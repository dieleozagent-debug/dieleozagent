// ocr_sovereign.js — Extracción local de alta fidelidad (v2.4.3)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const FILE_TO_PILOT = '/app/Contrato pdf/AT1.pdf';
const OUTPUT_DIR = '/app/data/transcripts';

/**
 * Extrae texto usando herramientas locales (pdftotext / tesseract)
 */
function extraerTextoLocal(filePath, startPage = 1, endPage = 10) {
    const nombreBase = path.basename(filePath, '.pdf');
    const tempText = `/tmp/${nombreBase}_raw.txt`;

    console.log(`[OCR-SOVEREIGN] 🛡️ Extrayendo páginas ${startPage}-${endPage} localmente...`);

    try {
        // 1. Intento rápido con pdftotext (Poppler)
        execSync(`pdftotext -f ${startPage} -l ${endPage} -layout "${filePath}" "${tempText}"`);
        let text = fs.readFileSync(tempText, 'utf8').trim();

        // 2. Si pdftotext falla (escaneado), usamos Tesseract
        if (text.length < 100) {
            console.log(`[OCR-SOVEREIGN] ⚠️ pdftotext devolvió poco texto. Intentando Tesseract OCR (SPA)...`);
            // Convertimos páginas a imágenes intermedias y luego a OCR es pesado para el contenedor alpine, 
            // pero tesseract puede leer PDFs directamente si tiene los plugins (en alpine es tesseract-ocr).
            // Nota: tesseract directo en PDF requiere que el PDF tenga capas o usar 'pdftoppm' primero.
            
            // Estrategia: pdftoppm -> tesseract
            const tempImgBase = `/tmp/${nombreBase}_img`;
            execSync(`pdftoppm -f ${startPage} -l ${endPage} -png "${filePath}" "${tempImgBase}"`);
            
            const images = fs.readdirSync('/tmp').filter(f => f.startsWith(path.basename(tempImgBase)));
            text = '';
            for (const img of images.sort()) {
                console.log(`   - OCR en página: ${img}`);
                const imgPath = `/tmp/${img}`;
                const outBase = `/tmp/${img}_ocr`;
                execSync(`tesseract "${imgPath}" "${outBase}" -l spa`);
                text += fs.readFileSync(`${outBase}.txt`, 'utf8') + '\n\n';
                fs.unlinkSync(imgPath);
                fs.unlinkSync(`${outBase}.txt`);
            }
        }
        
        return text;
    } catch (err) {
        console.error(`[OCR-SOVEREIGN] ❌ Error en proceso local: ${err.message}`);
        return '';
    }
}

async function run() {
    const text = extraerTextoLocal(FILE_TO_PILOT, 1, 10);
    
    if (text.length < 50) {
        console.error('[OCR-SOVEREIGN] 💀 No se pudo extraer texto legible.');
        process.exit(1);
    }

    console.log(`[OCR-SOVEREIGN] ✨ Éxito. Extraídos ${text.length} caracteres.`);
    
    // Ingesta RAG
    const nombreArchivo = path.basename(FILE_TO_PILOT);
    const chunks = text.split('\n\n').filter(c => c.length > 50);
    
    for (const chunk of chunks) {
        const vector = await obtenerEmbedding(chunk);
        await insertarFragmento(`[SOVEREIGN] ${nombreArchivo}`, chunk, vector);
        process.stdout.write('.');
    }

    console.log(`\n[OCR-SOVEREIGN] ✅ Pilot local completado. RAG poblado con 10 páginas.`);
    await pool.end();
}

run().catch(console.error);
