// ingestar_contrato.js — Lee todos los PDFs en 'Contrato pdf', los fragmenta y los guarda en Supabase con sus Embeddings
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Truco para cargar .env si lo ejecutamos manual desde fuera del contenedor
if (fs.existsSync(path.join(__dirname, '../.env'))) {
  require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const { insertarFragmento, obtenerEmbedding, pool } = require('./supabase');

const CARPETA_CONTRATO = path.join(__dirname, '../Contrato pdf');
const CHUNK_SIZE = 1500; // Caracteres por fragmento

async function extraerTexto(filePath) {
  try {
    const tmpTxt = filePath + '.txt';
    // pdftotext genera un archivo text con el mismo nombre si se le pasa un parametro extra o nada
    execSync(`pdftotext "${filePath}" "${tmpTxt}"`, { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    const output = fs.readFileSync(tmpTxt, 'utf8');
    fs.unlinkSync(tmpTxt);
    return output;
  } catch (err) {
    console.warn(`[INGEST] ⚠️ Error extrayendo ${path.basename(filePath)} con pdftotext: ${err.message}`);
    const tmpTxt = filePath + '.txt';
    if (fs.existsSync(tmpTxt)) fs.unlinkSync(tmpTxt);
    return '';
  }
}

function fragmentarTexto(texto, size = CHUNK_SIZE) {
  // Limpieza básica
  const textoLimpio = texto.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim();
  const chunks = [];
  
  for (let i = 0; i < textoLimpio.length; i += size) {
    chunks.push(textoLimpio.substring(i, i + size));
  }
  return chunks;
}

async function run() {
  console.log('[INGEST] 🚀 Iniciando ingesta de PDFs a Supabase (RAG)...');

  // Limpiar la tabla antes de la ingesta total
  await pool.query('TRUNCATE TABLE contrato_documentos').catch(() => {}); // Opcional, pero asumimos insert seguro
  
  const archivos = fs.readdirSync(CARPETA_CONTRATO).filter(f => f.endsWith('.pdf'));
  console.log(`[INGEST] 📂 Encontrados ${archivos.length} archivos terminados en .pdf`);

  for (const archivo of archivos) {
    console.log(`\n📄 Procesando: ${archivo}...`);
    const filePath = path.join(CARPETA_CONTRATO, archivo);
    
    const texto = await extraerTexto(filePath);
    if (!texto) continue;

    const fragmentos = fragmentarTexto(texto);
    console.log(`   ✂️ Extraídos ${fragmentos.length} fragmentos de ~${CHUNK_SIZE} caracteres.`);

    for (let i = 0; i < fragmentos.length; i++) {
      const fragmento = fragmentos[i];
      try {
        const vector = await obtenerEmbedding(fragmento);
        await insertarFragmento(archivo, fragmento, vector);
        
        // Progress bar en consola
        process.stdout.write(`\r   💾 Guardando en DB: [${i + 1}/${fragmentos.length}]`);
      } catch (err) {
        console.error(`\n   ❌ Error en fragmento ${i+1}: ${err.message}`);
      }
    }
    console.log(`\n   ✅ ${archivo} completado.`);
  }

  console.log('\n[INGEST] 🎉 Ingesta finalizada correctamente.');
  await pool.end();
}

run().catch(console.error);
