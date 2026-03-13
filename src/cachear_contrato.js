// cachear_contrato.js — Sube los PDFs del contrato a Gemini Cache para OCR y contexto masivo
'use strict';

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAICacheManager, GoogleAIFileManager } = require('@google/generative-ai/server');

// Truco para cargar .env
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const CARPETA_CONTRATO = path.join(__dirname, '../Contrato pdf');
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

const fileManager = new GoogleAIFileManager(apiKey);
const cacheManager = new GoogleAICacheManager(apiKey);

async function run() {
  console.log('[CACHE] 🚀 Iniciando subida de PDFs a Google...');
  
  const archivos = fs.readdirSync(CARPETA_CONTRATO).filter(f => f.endsWith('.pdf'));
  console.log(`[CACHE] 📂 Encontrados ${archivos.length} archivos terminados en .pdf`);

  const fileUris = [];

  for (const archivo of archivos) {
    console.log(`\n📄 Subiendo: ${archivo}... (Esto puede tardar dependiendo de tu conexión)`);
    const filePath = path.join(CARPETA_CONTRATO, archivo);
    
    try {
      const uploadResult = await fileManager.uploadFile(filePath, {
        mimeType: 'application/pdf',
        displayName: archivo,
      });
      console.log(`   ✅ Subido exitosamente: ${uploadResult.file.uri}`);
      fileUris.push(uploadResult.file);
    } catch (err) {
      console.error(`   ❌ Error subiendo ${archivo}: ${err.message}`);
    }
  }

  if (fileUris.length === 0) {
    console.log('\n[CACHE] ⚠️ No se subió ningún archivo.');
    return;
  }

  console.log('\n[CACHE] 🧠 Generando Caché Masivo del Contexto (System Instruction)...');

  try {
    const ttlSeconds = 60 * 60 * 24 * 7; // Caché dura 7 días
    
    const cacheResult = await cacheManager.create({
      model: 'models/gemini-2.0-flash',
      displayName: 'Contrato SICC LFC2',
      systemInstruction: 'Eres un experto analizando el Contrato de Concesión SICC/LFC2. Estos archivos contienen los Apéndices Técnicos escaneados.',
      contents: [
        {
          role: 'user',
          parts: fileUris.map(file => ({
            fileData: { mimeType: file.mimeType, fileUri: file.uri }
          }))
        }
      ],
      ttlSeconds: ttlSeconds,
    });

    console.log('\n[CACHE] 🎉 Caché generado exitosamente!');
    console.log(`[CACHE] 🔑 CACHE_NAME: ${cacheResult.name}`);
    console.log(`   Por favor, añade o actualiza esto en tu archivo .env:`);
    console.log(`   GEMINI_CACHE_NAME=${cacheResult.name}`);
    
  } catch (err) {
    console.error(`\n[CACHE] ❌ Error generando caché: ${err.message}`);
  }
}

run().catch(console.error);
