// ingestar_gemini.js — Usa Gemini 2.0 Flash File API para hacer OCR de PDFs y convertirlos en embeddings a Supabase local
'use strict';

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');

if (fs.existsSync(path.join(__dirname, '../.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const { insertarFragmento, obtenerEmbedding, pool } = require('./supabase');

const CARPETA_CONTRATO = path.join(__dirname, '../Contrato pdf');
const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
const CHUNK_SIZE = 2500; // Textos más grandes porque el OCR de Gemini da resultados completos

async function esperarUpload(fileUri) {
  // A veces Gemini tarda unos segundos en procesar el documento tras la subida
  let fileInfo = await fileManager.getFile(fileUri.split('/').pop());
  while (fileInfo.state === 'PROCESSING') {
    await new Promise(r => setTimeout(r, 2000));
    fileInfo = await fileManager.getFile(fileUri.split('/').pop());
  }
  return fileInfo;
}

async function extraerTextoConGemini(filePath, archivoNombre) {
  // 1. Subir archivo
  console.log(`   ⬆️ Subiendo ${archivoNombre} a Google para OCR...`);
  const uploadResult = await fileManager.uploadFile(filePath, {
    mimeType: 'application/pdf',
    displayName: archivoNombre,
  });
  
  await esperarUpload(uploadResult.file.uri);

  // 2. Extraer texto con el modelo
  console.log(`   👁️‍🗨️ Leyendo documento con Gemini 1.5 Flash (OCR)...`);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent([
    {
      fileData: { mimeType: uploadResult.file.mimeType, fileUri: uploadResult.file.uri }
    },
    { text: "Extrae de la forma más fiel y limpia posible todo el texto de este documento. No inventes informacion. Si es un scan, transcríbelo en su totalidad respetando encabezados." }
  ]);

  // 3. Borrar el archivo para no saturar la cuota
  await fileManager.deleteFile(uploadResult.file.uri.split('/').pop());

  return result.response.text();
}

function fragmentarTexto(texto, size = CHUNK_SIZE) {
  const textoLimpio = texto.replace(/\n+/g, '\n').trim();
  const chunks = [];
  
  for (let i = 0; i < textoLimpio.length; i += size) {
    chunks.push(textoLimpio.substring(i, i + size));
  }
  return chunks;
}

async function run() {
  console.log('[INGEST-OCR] 🚀 Iniciando Ingesta de PDFs OCR a Supabase...');

  const archivos = fs.readdirSync(CARPETA_CONTRATO).filter(f => f.endsWith('.pdf'));
  
  // Limpiar DB local
  await pool.query('TRUNCATE TABLE contrato_documentos').catch(() => {});
  
  for (const archivo of archivos) {
    if (archivo === "298 CONTRATO APP NO 001-2025.pdf") continue; // Este lo subiremos a mano porque pesa mucho y puede fallar
    
    console.log(`\n📄 Procesando OCR: ${archivo}...`);
    const filePath = path.join(CARPETA_CONTRATO, archivo);
    
    try {
      const texto = await extraerTextoConGemini(filePath, archivo);
      if (!texto || texto.length < 50) {
         console.log(`   ⚠️ Sin texto extraíble.`);
         continue;
      }

      const fragmentos = fragmentarTexto(texto);
      console.log(`   ✂️ Extraídos ${fragmentos.length} fragmentos de la transcripción OCR.`);

      for (let i = 0; i < fragmentos.length; i++) {
        const vector = await obtenerEmbedding(fragmentos[i]);
        await insertarFragmento(archivo, fragmentos[i], vector);
        process.stdout.write(`\r   💾 Guardando en RAG Supabase: [${i + 1}/${fragmentos.length}]`);
      }
      console.log(`\n   ✅ ${archivo} indexado.`);
      
      console.log(`\n   ⏳ Esperando 61s para cumplir tasa de Rate Limit de Gemini Free...`);
      await new Promise(r => setTimeout(r, 61000));
      
    } catch (err) {
      console.error(`\n   ❌ Error procesando ${archivo}: ${err.message}`);
    }
  }

  console.log('\n[INGEST-OCR] 🎉 Ingesta OCR+RAG finalizada.');
  await pool.end();
}

run().catch(console.error);
