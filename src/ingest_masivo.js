// ingest_masivo.js — Motor de Ingesta Soberana de Alto Volumen (v2.4.4)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const DATA_DIR = process.argv[2] || '/app/Contrato pdf';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Extrae texto de TODAS las páginas de un PDF localmente
 */
async function extraerTextoCompleto(filePath) {
    const nombreBase = path.basename(filePath, '.pdf');
    const tempText = `/tmp/${nombreBase}_full.txt`;
    let text = '';

    console.log(`[INGEST-MASIVO] 🛡️ Procesando: ${nombreBase}...`);

    try {
        // 1. Intento por defecto con pdftotext (Layout preservado)
        execSync(`pdftotext -layout "${filePath}" "${tempText}"`);
        text = fs.readFileSync(tempText, 'utf8').trim();

        // 2. Si detectamos que es una imagen (poco texto), usamos Tesseract por lotes a 300 DPI
        if (text.length < 500) {
            console.log(`   ⚠️ Documento escaneado detectado. Iniciando Tesseract OCR (SPA) a 300 DPI...`);
            const tempImgBase = `/tmp/${nombreBase}_img`;
            
            // Extraer imágenes a 300 DPI para máxima fidelidad OCR
            execSync(`pdftoppm -r 300 -png "${filePath}" "${tempImgBase}"`);
            
            const images = fs.readdirSync('/tmp').filter(f => f.startsWith(path.basename(tempImgBase)));
            text = '';
            console.log(`   📂 Procesando ${images.length} páginas...`);
            for (const img of images.sort()) {
                const imgPath = `/tmp/${img}`;
                const outBase = `/tmp/${img}_ocr`;
                try {
                    execSync(`tesseract "${imgPath}" "${outBase}" -l spa`);
                    const pageText = fs.readFileSync(`${outBase}.txt`, 'utf8').trim();
                    text += pageText + '\n\n';
                    const pageNum = img.split('-').pop().match(/\d+/)[0];
                    const preview = pageText.substring(0, 50).replace(/\n/g, ' ');
                    console.log(`      📝 Pág ${pageNum}: "${preview}..."`);
                } catch (e) {
                    console.error(`      ❌ Error OCR en página ${img}: ${e.message}`);
                }
                // Limpieza inmediata para ahorrar espacio en /tmp
                if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
                if (fs.existsSync(`${outBase}.txt`)) fs.unlinkSync(`${outBase}.txt`);
            }
        }
        
        if (fs.existsSync(tempText)) fs.unlinkSync(tempText);
        return text;
    } catch (err) {
        console.error(`[INGEST-MASIVO] ❌ Error total en ${nombreBase}: ${err.message}`);
        return '';
    }
}

/**
 * Inicia la ingesta de todo el directorio
 */
async function run() {
    console.log(`[INGEST-MASIVO] 🚀 Iniciando Ingesta Soberana v2.4.4 en: ${DATA_DIR}`);
    
    const archivos = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`[INGEST-MASIVO] 📂 Encontrados ${archivos.length} archivos para procesar.`);

    for (const archivo of archivos) {
        const fullPath = path.join(DATA_DIR, archivo);
        const texto = await extraerTextoCompleto(fullPath);

        if (!texto || texto.length < 100) {
            console.warn(`   ⏭️ Saltando ${archivo} (Sin contenido legible)`);
            continue;
        }

        // Fragmentación semántica básica
        const chunks = texto.split(/\n\n---|\n\n###|\n\n##|\f/).filter(c => c.trim().length > 100);
        console.log(`   🧩 Generando ${chunks.length} vectores para ${archivo}`);

        for (let i = 0; i < chunks.length; i++) {
            let reintentos = 3;
            let exito = false;
            
            while (reintentos > 0 && !exito) {
                try {
                    const vector = await obtenerEmbedding(chunks[i]);
                    await insertarFragmento(`[CONTRATO] ${archivo}`, chunks[i], vector);
                    if (i % 20 === 0) process.stdout.write('.');
                    exito = true;
                } catch (err) {
                    if (err.message.includes('429')) {
                        console.warn(`\n   ⚠️ Cuota excedida (429). Esperando 60s antes de reintentar...`);
                        await sleep(60000);
                        reintentos--;
                    } else {
                        console.error(`\n   ❌ Error fatal en fragmento ${i} de ${archivo}: ${err.message}`);
                        break;
                    }
                }
            }
            // Pequeña pausa de cortesía entre fragmentos exitosos
            await sleep(3000);
        }
        console.log(`\n   ✅ ${archivo} procesado y sincronizado.`);
    }

    console.log('\n[INGEST-MASIVO] 🏆 Ingesta total finalizada. El Cerebro ahora es omnisciente sobre el contrato.');
    await pool.end();
}

run().catch(console.error);
