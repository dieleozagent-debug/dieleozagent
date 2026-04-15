// extract_to_md.js — Extracción local a Markdown para Auditoría (v2.4.5)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_DIR = '/app/Contrato pdf';
const OUTPUT_DIR = '/app/data/transcripts';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function extraerAMarkdown(filePath, maxPages = 20) {
    const nombreBase = path.basename(filePath, '.pdf');
    const outPath = path.join(OUTPUT_DIR, `${nombreBase}.md`);
    
    console.log(`[EXTRACT-TO-MD] 🛡️ Procesando: ${nombreBase} (Máx ${maxPages} págs)...`);

    try {
        const tempImgBase = `/tmp/${nombreBase}_audit`;
        
        // Extraer imágenes (Soberanía Local)
        execSync(`pdftoppm -f 1 -l ${maxPages} -png "${filePath}" "${tempImgBase}"`);
        
        const images = fs.readdirSync('/tmp').filter(f => f.startsWith(path.basename(tempImgBase))).sort();
        let markdown = `# Transcripción Auditada: ${nombreBase}\n\n`;
        
        for (const img of images) {
            const pageNum = img.match(/\d+/)[0];
            console.log(`   - OCR Página ${pageNum}...`);
            const imgPath = `/tmp/${img}`;
            const outBase = `/tmp/${img}_ocr`;
            
            execSync(`tesseract "${imgPath}" "${outBase}" -l spa`);
            const text = fs.readFileSync(`${outBase}.txt`, 'utf8');
            
            markdown += `## PÁGINA ${pageNum}\n\n${text}\n\n---\n\n`;
            
            // Limpieza inmediata
            fs.unlinkSync(imgPath);
            fs.unlinkSync(`${outBase}.txt`);
        }
        
        fs.writeFileSync(outPath, markdown);
        console.log(`[EXTRACT-TO-MD] [SICC OK] Guardado en: ${outPath}`);
        return outPath;
    } catch (err) {
        console.error(`[EXTRACT-TO-MD] [SICC FAIL] Error: ${err.message}`);
        return null;
    }
}

async function run() {
    // Procesamos solo el AT1 para validación inicial (20 páginas)
    const at1Path = path.join(DATA_DIR, 'AT1.pdf');
    if (fs.existsSync(at1Path)) {
        await extraerAMarkdown(at1Path, 20);
    } else {
        console.error('No se encontró AT1.pdf');
    }
}

run().catch(console.error);
