// supabase.js — Módulo de Embeddings con Auto-Detección (v6.6.2)
'use strict';

const { Pool } = require('pg');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);

const fs = require('fs');
const isDocker = fs.existsSync('/.dockerenv');

const dbConfig = {
    host: process.env.DB_HOST || 'supabase_db_sicc-local',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres'
};

// 🛰️ AJUSTE DE PRIORIDAD SOBERANA (v8.9.6)
if (!isDocker && (dbConfig.host === 'supabase_db_sicc-local' || dbConfig.port === 5432)) {
    dbConfig.host = 'localhost';
    dbConfig.port = 54322; // Puerto expuesto en el host
}

const pool = new Pool(dbConfig);

/**
 * Obtener Vector Embedding de un texto usando Ollama LOCAL (Soberanía Total)
 * Modelo: nomic-embed-text (768 dimensiones, compatible con Supabase v6.5)
 */
async function obtenerEmbedding(texto) {
    try {
        const port = (process.env.NODE_ENV === 'production') ? '11434' : '11435';
        const host = `http://localhost:${port}`;
        const response = await axios.post(`${host}/api/embeddings`, {
            model: "nomic-embed-text",
            prompt: texto
        });
    const vector = response.data.embedding;
    if (vector.length !== 768) {
        console.warn(`[SUPABASE] ⚠️ Ollama devolvió ${vector.length} dimensiones, se esperaba 768.`);
    }
    return vector;
  } catch (localErr) {
    console.warn(`[SUPABASE] ⚠️ Ollama Local falló, intentando Cloud Gemini...`);
    try {
      const model = genAI.getGenerativeModel({ model: "embedding-001" });
      const result = await model.embedContent(texto);
      const vector = result.embedding.values;
      if (vector.length !== 768) {
          console.warn(`[SUPABASE] ⚠️ Gemini devolvió ${vector.length} dimensiones, se esperaba 768.`);
      }
      return vector;
    } catch (e) {
      console.error(`[SUPABASE] ❌ Error final en Embeddings: ${e.message}`);
    }
  }

  throw new Error("Ningún modelo de embeddings respondió satisfactoriamente.");
}

async function insertarFragmento(archivoNombre, contenido, vector) {
    const query = `INSERT INTO contrato_documentos (nombre_archivo, contenido, embedding) VALUES ($1, $2, $3)`;
    await pool.query(query, [archivoNombre, contenido, `[${vector.join(',')}]`]);
}

async function buscarSimilares(preguntaTexto, limite = 3) {
    const vectorQuery = await obtenerEmbedding(preguntaTexto);
    const query = `SELECT nombre_archivo, contenido, similitud FROM buscar_documentos_contrato($1::vector, 0.5, $2)`;
    const result = await pool.query(query, [`[${vectorQuery.join(',')}]`, limite]);
    return result.rows;
}

module.exports = { obtenerEmbedding, insertarFragmento, buscarSimilares, pool };
