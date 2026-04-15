// ocr_pilot.js — Validación de 'Brain Vision' OCR para los primeros documentos (v2.4.2)
'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const FILE_TO_PILOT = path.join(__dirname, '../Contrato pdf/AT1.pdf');
const PILOT_OUTPUT = path.join(__dirname, '../data/at1_pilot.md');
const PAGES_TO_PILOT = "páginas 1 a la 10"; // Instrucción específica para Gemini

async function ejecutarPilot() {
    console.log(`[PILOT-OCR] 👁️ Iniciando validación 'Brain Vision' para: ${path.basename(FILE_TO_PILOT)}`);
    console.log(`[PILOT-OCR] 🎯 Objetivo: Transcribir solo ${PAGES_TO_PILOT}`);

    const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
    const fileManager = new GoogleAIFileManager(config.ai.gemini.apiKey);

    // 1. Subir a Gemini
    console.log(`[PILOT-OCR] ⬆️ Subiendo archivo...`);
    const uploadResult = await fileManager.uploadFile(FILE_TO_PILOT, {
        mimeType: 'application/pdf',
        displayName: 'AT1_Contract_Pilot',
    });
    console.log(`[PILOT-OCR] [SICC OK] Archivo disponible en: ${uploadResult.file.uri}`);

    // 2. Solicitar Transcripción Técnica
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Modelo más moderno y compatible
    const prompt = `Eres un experto en ingeniería y digitalización forense. 
        Lee este PDF y transcribe ÚNICAMENTE las ${PAGES_TO_PILOT}.
        Convierte el contenido a Markdown puro.
        IMPORTANTE: Preserva las tablas técnica y econónimas de forma exacta usando el formato de tablas de Markdown.
        NO incluyas introducciones, ni comentarios de "aquí está la transcripción". Entrega solo el Markdown.`;

    console.log(`[PILOT-OCR] [SICC BRAIN] Procesando con Gemini Pro Vision...`);
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResult.file.mimeType,
                fileUri: uploadResult.file.uri
            }
        },
        { text: prompt }
    ]);

    const transcript = result.response.text();
    console.log(`[PILOT-OCR] ✨ Transcripción recibida (${transcript.length} caracteres)`);

    // 3. Guardar en Disco (Cache)
    if (!fs.existsSync(path.dirname(PILOT_OUTPUT))) {
        fs.mkdirSync(path.dirname(PILOT_OUTPUT), { recursive: true });
    }
    fs.writeFileSync(PILOT_OUTPUT, transcript);
    console.log(`[PILOT-OCR] 💾 Transcripción guardada en: ${PILOT_OUTPUT}`);

    // 4. Ingesta Experimental en Supabase
    console.log(`[PILOT-OCR] 🧩 Iniciando fragmentación e ingesta RAG...`);
    const chunks = transcript.split(/\n\n---|\n\n###|\n\n##/).filter(c => c.length > 50);
    
    for (let i = 0; i < chunks.length; i++) {
        try {
            const vector = await obtenerEmbedding(chunks[i]);
            await insertarFragmento(`[OCR-PILOT] AT1.pdf`, chunks[i], vector);
            process.stdout.write('.');
        } catch (err) {
            console.error(`\n[PILOT-OCR] [SICC FAIL] Error en fragmento ${i}: ${err.message}`);
        }
    }

    // 5. Limpieza externa
    await fileManager.deleteFile(uploadResult.file.name);
    console.log(`\n[PILOT-OCR] 🗑️ Archivo temporal borrado de Gemini.`);
    console.log(`[PILOT-OCR] 🏆 Pilot completado con éxito. El agente ahora "conoce" las primeras 10 páginas del AT1.`);
    
    await pool.end();
}

ejecutarPilot().catch(err => {
    console.error('[PILOT-OCR] 💀 Error fatal:', err);
    process.exit(1);
});
