// supabase.js — Módulo de Embeddings con Auto-Detección (v6.6.2)
'use strict';

const { Pool } = require('pg');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);

const dbConfig = {
    host: process.env.DB_HOST || 'supabase_db_sicc-local',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
};

const pool = new Pool(dbConfig);

/**
 * Obtener Vector Embedding de un texto usando Ollama LOCAL (Soberanía Total)
 * Modelo: nomic-embed-text (768 dimensiones, compatible con Supabase v6.5)
 */
async function obtenerEmbedding(texto) {
    try {
        const response = await axios.post(`http://localhost:11434/api/embeddings`, {
            model: "nomic-embed-text",
            prompt: texto
        });
        return response.data.embedding;
    } catch (localErr) {
        console.warn(`[SUPABASE] ⚠️ Ollama Local falló, intentando Cloud Gemini...`);
        try {
            const model = genAI.getGenerativeModel({ model: "models/text-embedding-004" });
            const result = await model.embedContent(texto);
            return result.embedding.values;
        } catch (e) {
            // Seguir probando
        }
    }

    throw new Error("Ningún modelo de embeddings de Google respondió (404/400). Verifica tu API Key.");
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
