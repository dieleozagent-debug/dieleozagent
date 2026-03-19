// supabase.js — Módulo para interactuar con Supabase localmente y manejar Embeddings
'use strict';

const { createClient } = require('@supabase/supabase-js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Conexión a Supabase Local usando variables de entorno o defaults
const supabaseUrl = process.env.SUPABASE_URL || 'http://supabase_kong_sicc-local:8000';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJh...'; // Requiere JWT Service Key, o usar psql directo

// Como estamos operando localmente dentro del mismo servidor, a veces es más robusto 
// usar conexión por postgres directa si no tenemos la Anon Key de Supabase a la mano
const dbConfig = {
  host: process.env.DB_HOST || 'supabase_db_sicc-local',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres', // Config por defecto de docker supabase
  database: 'postgres'
};

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

/**
 * Obtener Vector Embedding de un texto usando Gemini 
 */
async function obtenerEmbedding(texto) {
  // El modelo text-embedding-004 de Gemini devuelve un vector de 768 dimensiones
  const model = genAI.getGenerativeModel({ model: "models/gemini-embedding-001"});
  const result = await model.embedContent(texto);
  const embedding = result.embedding;
  return embedding.values;
}

// ── Solución usando Postgres Nativo (pg) ya que tenemos acceso directo ─────────
const { Pool } = require('pg');
const pool = new Pool(dbConfig);

/**
 * Inserta un fragmento de documento en la DB vectorial
 */
async function insertarFragmento(archivoNombre, contenido, vector) {
  const query = `
    INSERT INTO contrato_documentos (nombre_archivo, contenido, embedding)
    VALUES ($1, $2, $3)
  `;
  // pgvector requiere formato '[val1, val2, ...]'
  const vectorStr = `[${vector.join(',')}]`;
  await pool.query(query, [archivoNombre, contenido, vectorStr]);
}

/**
 * Busca documentos similares usando RAG 
 */
async function buscarSimilares(preguntaTexto, limite = 3) {
  const vectorQuery = await obtenerEmbedding(preguntaTexto);
  const vectorStr = `[${vectorQuery.join(',')}]`;

  // Usamos la función RPC que creamos en el script SQL
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
