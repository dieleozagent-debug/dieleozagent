// ingest_masivo.js — Motor de Ingesta Soberana v6.5.9 (Hybrid: PDF.js + Tesseract)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./config');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const DATA_DIR = process.argv[2] || '/app/Contrato pdf';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Motor de extracción de texto usando PDF.js (el método exitoso anterior)
 */
async function extraerTextoExitoso(filePath) {
    try {
        // Polyfill DOMMatrix for Node
        if (typeof global.DOMMatrix === 'undefined') {
            global.DOMMatrix = class DOMMatrix {
                constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; }
            };
        }
        const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
        const data = new Uint8Array(fs.readFileSync(filePath));
        const loadingTask = pdfjsLib.getDocument({ data, useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true });
        const pdf = await loadingTask.promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        return text;
    } catch (err) {
        console.warn(`[INGEST] ⚠️ Fallo PDF.js en ${path.basename(filePath)}, intentando OCR...`);
        return '';
    }
}

async function run() {
    console.log(`[INGEST-MASIVO] 🚀 Iniciando Ingesta v6.5.9 (Método Exitoso) en: ${DATA_DIR}`);
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`❌ Directorio no encontrado: ${DATA_DIR}`);
        process.exit(1);
    }
    const archivos = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`[INGEST-MASIVO] 📂 Encontrados ${archivos.length} archivos.`);

    for (const archivo of archivos) {
        console.log(`\n📄 Procesando: ${archivo}...`);
        const fullPath = path.join(DATA_DIR, archivo);
        let texto = await extraerTextoExitoso(fullPath);

        // Si PDF.js no sacó nada, usamos Tesseract como fallback forense
        if (!texto || texto.length < 200) {
            console.log(`   🎨 Documento parece ser imagen. Usando OCR Tesseract...`);
            try {
                const tempImgBase = `/tmp/${path.basename(archivo, '.pdf')}_img`;
                execSync(`/usr/bin/pdftoppm -r 300 -png "${fullPath}" "${tempImgBase}"`);
                const images = fs.readdirSync('/tmp').filter(f => f.startsWith(path.basename(tempImgBase)));
                texto = '';
                for (const img of images.sort()) {
                    const outBase = `/tmp/${img}_ocr`;
                    execSync(`/usr/bin/tesseract "/tmp/${img}" "${outBase}" -l spa`);
                    texto += fs.readFileSync(`${outBase}.txt`, 'utf8') + '\n';
                    fs.unlinkSync(`/tmp/${img}`);
                    fs.unlinkSync(`${outBase}.txt`);
                }
            } catch (e) { console.error(`   ❌ Fallo total en OCR para ${archivo}`); }
        }

        if (!texto) continue;

        const chunks = texto.split('\n\n').filter(c => c.trim().length > 100);
        for (let i = 0; i < chunks.length; i++) {
            try {
                const vector = await obtenerEmbedding(chunks[i]);
                await insertarFragmento(`[BIBLIA-LEGAL] ${archivo}`, chunks[i], vector);
                if (i % 10 === 0) process.stdout.write('.');
            } catch (e) {
                console.error(`\n   ❌ Error en fragmento ${i}: ${e.message}`);
            }
            await sleep(500); // Protección contra Rate Limit
        }
        console.log(`\n   ✅ ${archivo} sincronizado.`);
    }
    console.log('\n[INGEST-MASIVO] 🏆 Biblia Legal integrada con éxito.');
    await pool.end();
}

run().catch(console.error);
