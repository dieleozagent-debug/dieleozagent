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
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres'
};

// 🛰️ AJUSTE DE PRIORIDAD SOBERANA (v8.9.8)
if (!isDocker && (dbConfig.host === 'postgres' || dbConfig.port === 5432)) {
    dbConfig.host = '127.0.0.1';
    dbConfig.port = 54322; // Puerto expuesto en el host
}

const pool = new Pool(dbConfig);

/**
 * Obtener Vector Embedding de un texto usando Ollama LOCAL (Soberanía Total)
 * Modelo: nomic-embed-text (768 dimensiones, compatible con Supabase v6.5)
 */
async function obtenerEmbedding(texto) {
    try {
        const host = config.ai.ollama.host;
        
        console.log(`[SUPABASE] 🤖 Obteniendo embedding vía ${host} (Modelo: nomic-embed-text:latest)...`);
        const response = await axios.post(`${host}/api/embeddings`, {
            model: "nomic-embed-text:latest",
            prompt: texto
        }, { timeout: 15000 });
        
        const vector = response.data.embedding;
    if (vector.length !== 768) {
        console.warn(`[SUPABASE] [SICC WARN] Ollama devolvió ${vector.length} dimensiones, se esperaba 768.`);
    }
    return vector;
  } catch (localErr) {
    console.warn(`[SUPABASE] ⚠️ Ollama Local falló (${localErr.message}). Intentando Cloud Gemini...`);
    try {
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(texto);
      const vector = result.embedding.values;
      if (vector.length !== 768) {
          console.warn(`[SUPABASE] [SICC WARN] Gemini devolvió ${vector.length} dimensiones, se esperaba 768.`);
      }
      return vector;
    } catch (e) {
      console.error(`[SUPABASE] [SICC FAIL] Error final en Embeddings: ${e.message}`);
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

async function guardarDTCertificada(area, textoDT, razonJuez) {
    try {
        const fecha = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const idDT = `DT-SICC-${fecha}-${area.toUpperCase().replace(/\s+/g, '_').substring(0, 20)}`;
        const contenido = `[DT CERTIFICADA: ${idDT}]\nÁREA: ${area}\nFECHA: ${new Date().toISOString()}\nRAZÓN JUEZ: ${razonJuez}\n\n${textoDT}`;
        const vector = await obtenerEmbedding(contenido);
        const metadata = { tipo: 'DT_CERTIFICADA', area, idDT, fecha: new Date().toISOString() };
        await pool.query(
            `INSERT INTO sicc_genetic_memory (content, metadata, embedding) VALUES ($1, $2, $3)`,
            [contenido, JSON.stringify(metadata), `[${vector.join(',')}]`]
        );
        console.log(`[SUPABASE] ✅ DT certificada vectorizada: ${idDT}`);
        return idDT;
    } catch (e) {
        console.error(`[SUPABASE] ❌ Error guardando DT certificada: ${e.message}`);
        return null;
    }
}

async function buscarLecciones(preguntaTexto, limite = 2) {
    try {
        const vectorQuery = await obtenerEmbedding(preguntaTexto);
        // Usamos una función similar para la tabla de lecciones genéticas
        const query = `SELECT content, metadata, 1 - (embedding <=> $1::vector) as similitud 
                       FROM sicc_genetic_memory 
                       WHERE 1 - (embedding <=> $1::vector) > 0.7
                       ORDER BY similitud DESC LIMIT $2`;
        const result = await pool.query(query, [`[${vectorQuery.join(',')}]`, limite]);
        return result.rows;
    } catch (e) {
        console.warn('[SUPABASE] [SICC WARN] Error buscando lecciones genéticas:', e.message);
        return [];
    }
}

module.exports = { obtenerEmbedding, insertarFragmento, buscarSimilares, buscarLecciones, guardarDTCertificada, pool };
