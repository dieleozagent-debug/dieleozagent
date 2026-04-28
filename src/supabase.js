// supabase.js — Módulo de Embeddings con Auto-Detección (v14.0)
'use strict';

const { Pool } = require('pg');
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);

const fs = require('fs');
const isDocker = fs.existsSync('/.dockerenv');

const dbConfig = {
    host: process.env.DB_HOST || 'sicc-postgres',
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres'
};

// dbConfig ya toma DB_HOST de las variables de entorno

const pool = new Pool(dbConfig);

/**
 * Obtener Vector Embedding de un texto usando Ollama LOCAL
 */
async function obtenerEmbedding(texto) {
    // 1. Intentar Cloud Gemini (Calidad Forense)
    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(texto);
        const vector = result.embedding.values;
        if (vector.length === 768) {
            return vector;
        }
        console.warn(`[SUPABASE] [SICC WARN] Gemini devolvió ${vector.length} dimensiones.`);
    } catch (e) {
        console.warn(`[SUPABASE] ⚠️ Cloud Gemini falló (${e.message}). Rebotando a Ollama Local...`);
    }

    // 2. Fallback a Ollama Local (Soberanía Local)
    try {
        const host = config.ai.ollama.host;
        const response = await axios.post(`${host}/api/embeddings`, {
            model: "nomic-embed-text:latest",
            prompt: texto
        }, { timeout: 15000 }); // Timeout más corto para no bloquear
        
        return response.data.embedding;
    } catch (localErr) {
        console.error(`[SUPABASE] [SICC FAIL] Error final en Embeddings: ${localErr.message}`);
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

async function guardarVeredictoJuez(area, veredicto) {
    // Vectoriza el JSON completo del Juez para que futuros ciclos sepan por qué se aprobó/rechazó
    try {
        const { aprobado, razon, categoria_fallida, leccion_auditoria } = veredicto;
        const estado = aprobado ? 'APROBADO' : 'RECHAZADO';
        const contenido = `[VEREDICTO JUEZ ${estado}] Área: ${area}\nRazón: ${razon}\nCategoría: ${categoria_fallida || 'N/A'}\nLección: ${leccion_auditoria || 'N/A'}`;
        const vector = await obtenerEmbedding(contenido);
        const metadata = { tipo: 'VEREDICTO_JUEZ', area, estado, fecha: new Date().toISOString() };
        await pool.query(
            `INSERT INTO sicc_genetic_memory (content, metadata, embedding) VALUES ($1, $2, $3)`,
            [contenido, JSON.stringify(metadata), `[${vector.join(',')}]`]
        );
        console.log(`[SUPABASE] ✅ Veredicto Juez vectorizado: ${estado} — ${area}`);
    } catch (e) {
        console.error(`[SUPABASE] ❌ Error guardando veredicto: ${e.message}`);
    }
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
        const query = `SELECT content, metadata, 1 - (embedding <=> $1::vector) as similitud 
                       FROM sicc_genetic_memory 
                       WHERE 1 - (embedding <=> $1::vector) > 0.7
                       ORDER BY similitud DESC LIMIT $2`;
        const result = await pool.query(query, [`[${vectorQuery.join(',')}]`, limite]);
        return result.rows;
    } catch (e) {
        console.warn('[SUPABASE] [SICC WARN] Error buscando lecciones contractuales:', e.message);
        return [];
    }
}

module.exports = { obtenerEmbedding, insertarFragmento, buscarSimilares, buscarLecciones, guardarDTCertificada, guardarVeredictoJuez, pool };
