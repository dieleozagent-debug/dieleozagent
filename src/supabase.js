// supabase.js — Módulo para interactuar con Supabase localmente y manejar Embeddings
'use strict';

const { Pool } = require('pg');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./config');

// Conexión a Supabase Local usando config centralizado
const dbConfig = {
  host: process.env.DB_HOST || 'supabase_db_sicc-local',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: 'postgres'
};

const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);

/**
 * Obtener Vector Embedding de un texto usando Gemini 
 */
async function obtenerEmbedding(texto) {
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001"});
  const result = await model.embedContent(texto);
  const embedding = result.embedding;
  return embedding.values;
}

const pool = new Pool(dbConfig);

/**
 * Inserta un fragmento de documento en la DB vectorial
 */
async function insertarFragmento(archivoNombre, contenido, vector) {
  const query = `
    INSERT INTO contrato_documentos (nombre_archivo, contenido, embedding)
    VALUES ($1, $2, $3)
  `;
  const vectorStr = `[${vector.join(',')}]`;
  await pool.query(query, [archivoNombre, contenido, vectorStr]);
}

/**
 * Busca documentos similares usando RAG 
 */
async function buscarSimilares(preguntaTexto, limite = 3) {
  const vectorQuery = await obtenerEmbedding(preguntaTexto);
  const vectorStr = `[${vectorQuery.join(',')}]`;

  const query = `
    SELECT nombre_archivo, contenido, similitud
    FROM buscar_documentos_contrato($1::vector, 0.5, $2)
  `;
  
  const result = await pool.query(query, [vectorStr, limite]);
  return result.rows;
}

module.exports = {
  obtenerEmbedding,
  insertarFragmento,
  buscarSimilares,
  pool
};
