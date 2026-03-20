// ingest.js — Motor de ingesta masiva (v2.4.2) con robustez en la extracción de PDF
'use strict';

const fs = require('fs');
const path = require('path');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const DATA_DIR = process.env.DATA_INGEST_DIR || path.join(__dirname, '../Contrato pdf');
const CHUNK_SIZE = 1200;
const OVERLAP = 200;

/**
 * Estrategia de Extracción de Texto PDF (Multi-librería)
 */
async function extraerTextoPDF(filePath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        
        // Intentar estrategia 1: pdf-parse (si es la funcional)
        try {
            const pdf = require('pdf-parse');
            if (typeof pdf === 'function') {
                const data = await pdf(dataBuffer);
                if (data.text && data.text.trim().length > 10) return data.text;
            }
        } catch (e) { /* fallback */ }

        // Intentar estrategia 2: pdfjs-dist (manual)
        try {
            if (typeof global.DOMMatrix === 'undefined') {
                global.DOMMatrix = class DOMMatrix {
                    constructor() { this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0; }
                };
            }
            const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');
            const loadingTask = pdfjsLib.getDocument({ 
                data: new Uint8Array(dataBuffer),
                useWorkerFetch: false,
                isEvalSupported: false,
                useSystemFonts: true
            });
            const pdf = await loadingTask.promise;
            let fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                fullText += textContent.items.map(item => item.str).join(' ') + '\n';
            }
            if (fullText.trim().length > 10) return fullText;
        } catch (e) { /* fallback */ }

        return '';
    } catch (err) {
        console.error(`[INGEST] ❌ Error total en ${path.basename(filePath)}: ${err.message}`);
        return '';
    }
}

/**
 * Fragmenta texto para RAG
 */
function chunkText(text, size, overlap) {
    const chunks = [];
    const cleanText = text.replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
    for (let i = 0; i < cleanText.length; i += size - overlap) {
        chunks.push(cleanText.slice(i, i + size));
        if (i + size >= cleanText.length) break;
    }
    return chunks;
}

async function procesarArchivo(filePath) {
    const nombreBase = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let contenido = '';

    if (ext === '.pdf') {
        contenido = await extraerTextoPDF(filePath);
    } else if (ext === '.md' || ext === '.txt') {
        contenido = fs.readFileSync(filePath, 'utf8');
    }

    if (!contenido || contenido.trim().length < 20) {
        console.warn(`[INGEST] ⚠️ Sin contenido legible en: ${nombreBase}`);
        return;
    }

    const chunks = chunkText(contenido, CHUNK_SIZE, OVERLAP);
    console.log(`[INGEST] 🧩 ${nombreBase} -> ${chunks.length} chunks.`);

    for (let i = 0; i < chunks.length; i++) {
        try {
            const vector = await obtenerEmbedding(chunks[i]);
            await insertarFragmento(nombreBase, chunks[i], vector);
            if (i % 5 === 0) process.stdout.write('.');
        } catch (err) {
            console.error(`\n[INGEST] ❌ Error en fragmento ${i}: ${err.message}`);
        }
    }
    console.log(`\n[INGEST] ✅ Éxito: ${nombreBase}`);
}

async function run() {
    console.log(`[INGEST] 🚀 Iniciando Ingesta Soberana v2.4.2 en ${DATA_DIR}...`);
    const archivos = fs.readdirSync(DATA_DIR).filter(f => !f.startsWith('.'));
    
    for (const archivo of archivos) {
        await procesarArchivo(path.join(DATA_DIR, archivo));
    }
    console.log('[INGEST] 🏆 Fin de la ingesta.');
    await pool.end();
}

run().catch(console.error);
