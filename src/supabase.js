// supabase.js — Módulo de Embeddings con Auto-Detección (v6.6.2)
'use strict';

const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
let modeloFuncional = null;

const dbConfig = {
    host: process.env.DB_HOST || 'supabase_db_sicc-local',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
};

const pool = new Pool(dbConfig);

/**
 * Intenta obtener un embedding probando varios modelos conocidos
 */
async function obtenerEmbedding(texto) {
    const candidatos = [
        { model: "text-embedding-004" },
        { model: "models/text-embedding-004" },
        { model: "embedding-001" },
        { model: "models/embedding-001" }
    ];

    if (modeloFuncional) {
        const result = await genAI.getGenerativeModel(modeloFuncional).embedContent(texto);
        return result.embedding.values;
    }

    for (const cand of candidatos) {
        try {
            const model = genAI.getGenerativeModel(cand);
            const result = await model.embedContent(texto);
            modeloFuncional = cand; // Guardamos el que funcionó
            console.log(`[SUPABASE] ✅ Modelo funcional detectado: ${JSON.stringify(cand)}`);
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
