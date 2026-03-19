// agent.js — Lógica del agente con brain + memoria persistente inyectada al system prompt
'use strict';

const config = require('./config');
const { construirSystemPrompt } = require('./brain');
const { cargarMemoriaReciente } = require('./memory');
const { buscarSimilares } = require('./supabase');

// Importaciones de IA (Movidas arriba para debugging)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const Groq = require('groq-sdk');
const OpenAI = require('openai');

// ── Historial de sesión (en RAM, máx 20 intercambios) ────────────────────────
const historial = [];
const MAX_HISTORIAL = 20;

// System prompt: brain + memoria reciente, construido al arrancar
let SYSTEM_PROMPT = '';

function inicializarBrain() {
  const brain   = construirSystemPrompt();
  const memoria = cargarMemoriaReciente();

  SYSTEM_PROMPT = brain;
  if (memoria) {
    SYSTEM_PROMPT +=
      '\n\n' + '═'.repeat(60) +
      '\n## MEMORIA DE CONVERSACIONES ANTERIORES\n\n' +
      memoria +
      '\n' + '═'.repeat(60);
    console.log('[AGENTE] ✅ Memoria reciente inyectada en el system prompt');
  }
}

// ── Proveedores de IA ─────────────────────────────────────────────────────────

async function llamarGemini(mensajeUsuario, archivoTmpInfo, contextoRAG = '') {
  const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
  const fileManager = new GoogleAIFileManager(config.ai.gemini.apiKey);
  
  const systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

  console.log(`[AGENTE] 🔵 Invocando llamarGemini. Modelo: ${config.ai.gemini.model}`);
  const model = genAI.getGenerativeModel({
    model: config.ai.gemini.model,
    systemInstruction: systemInstruction,
  });

  const parts = [{ text: mensajeUsuario }];
  let uploadResponse = null;

  // Si hay un archivo temporal, lo subimos
  if (archivoTmpInfo) {
    console.log(`[AGENTE] ⬆️ Subiendo archivo a Gemini: ${archivoTmpInfo.path}`);
    uploadResponse = await fileManager.uploadFile(archivoTmpInfo.path, {
      mimeType: archivoTmpInfo.mimeType,
      displayName: archivoTmpInfo.name,
    });
    console.log(`[AGENTE] ✅ Archivo subido: ${uploadResponse.file.uri}`);
    parts.unshift({
      fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri }
    });
  }

  const chat = model.startChat({
    history: historial.map(h => ({
      role: h.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: h.content }],
    })),
  });

  try {
    const resultado = await chat.sendMessage(parts);
    const texto = resultado.response.text();

    // Limpiar el archivo subido a Gemini
    if (uploadResponse) {
      await fileManager.deleteFile(uploadResponse.file.name);
      console.log(`[AGENTE] 🗑️ Archivo borrado de Gemini: ${uploadResponse.file.name}`);
    }

    return texto;
  } catch (err) {
    if (uploadResponse) await fileManager.deleteFile(uploadResponse.file.name).catch(() => {});
    throw err;
  }
}

async function llamarGroq(mensajeUsuario, _, contextoRAG = '') {
  const groq = new Groq({ apiKey: config.ai.groq.apiKey });
  
  const systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

  const respuesta = await groq.chat.completions.create({
    model: config.ai.groq.model,
    messages: [
      { role: 'system', content: systemInstruction },
      ...historial.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
  });
  return respuesta.choices[0].message.content;
}

async function llamarOpenRouter(mensajeUsuario, _, contextoRAG = '') {
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.ai.openrouter.apiKey,
    defaultHeaders: { 'HTTP-Referer': 'http://localhost', 'X-Title': config.agent.name },
  });
  
  const systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

  const respuesta = await client.chat.completions.create({
    model: config.ai.openrouter.model,
    messages: [
      { role: 'system', content: systemInstruction },
      ...historial.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
  });
  return respuesta.choices[0].message.content;
}

// ── Selección de proveedor con fallback automático ────────────────────────────

function ordenProveedores() {
  const todos = [
    { id: 'gemini',     fn: llamarGemini,     habilitado: !!config.ai.gemini.apiKey },
    { id: 'groq',       fn: llamarGroq,       habilitado: !!config.ai.groq.apiKey },
    { id: 'openrouter', fn: llamarOpenRouter, habilitado: !!config.ai.openrouter.apiKey },
  ].filter(p => p.habilitado);

  const primario = config.ai.primaryProvider;
  console.log(`[AGENTE] 🔍 Debug ordenProveedores: primario=${primario}, keys: gemini=${!!config.ai.gemini.apiKey}, groq=${!!config.ai.groq.apiKey}, openrouter=${!!config.ai.openrouter.apiKey}`);
  const res = [
    ...todos.filter(p => p.id === primario),
    ...todos.filter(p => p.id !== primario),
  ];
  console.log(`[AGENTE] 📋 Orden de proveedores calculado: ${res.map(p => p.id).join(' -> ')}`);
  return res;
}

/**
 * Procesa un mensaje y retorna { texto, proveedor }. Acepta archivo opcional.
 */
async function procesarMensaje(textoUsuario, archivoTmpInfo) {
  const proveedores = ordenProveedores();
  
  // RAG: Buscar contexto pertinente en el contrato (Supabase) si habla de temas relevantes
  // Para no saturar con BBDD en cada mensaje corto tipo "Hola", aplicamos un filtro básico
  let contextoRAG = '';
  if (textoUsuario.length > 10 || /contrato|anexo|apéndice|at|obligación|multa/i.test(textoUsuario)) {
     try {
       const docs = await buscarSimilares(textoUsuario, 3); // 3 chunks más parecidos
       if (docs && docs.length > 0) {
         contextoRAG = '## CONTEXTO DE CONTRATO (Supabase Vector DB):\nEl siguiente texto ha sido extraido dinámicamente del contrato oficial en base a la pregunta del usuario. Úsalo para responder de formar informada:\n\n';
         docs.forEach((doc, i) => {
           contextoRAG += `--- Fragmento ${i+1} [Archivo: ${doc.nombre_archivo}] ---\n${doc.contenido}\n\n`;
         });
         console.log(`[RAG] 🔍 Recuperados ${docs.length} fragmentos de Supabase para esta consulta.`);
       }
     } catch (err) {
       console.log(`[RAG] ⚠️ Error recuperando contexto: ${err.message}`);
     }
  }

  for (const proveedor of proveedores) {
    try {
      // Solo Gemini soporta File API en nuestra config actual
      if (archivoTmpInfo && proveedor.id !== 'gemini') {
        console.log(`[AGENTE] ⏭️ Saltando ${proveedor.id} porque hay un archivo adjunto.`);
        continue;
      }

      console.log(`[AGENTE] Usando proveedor: ${proveedor.id}`);
      const respuesta = await proveedor.fn(textoUsuario, archivoTmpInfo, contextoRAG);

      // Guardar en historial de sesión (sin el archivo para simplificar memoria larga)
      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: respuesta    });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      return { texto: respuesta, proveedor: proveedor.id };
    } catch (err) {
      console.error(`[AGENTE] ❌ ERROR en ${proveedor.id}:`, err.message || err);
      if (err.response && err.response.data) {
        console.error(`[AGENTE] 🔍 Detalle del error:`, JSON.stringify(err.response.data));
      }
    }
  }
  console.log('[AGENTE] 💀 El loop de proveedores terminó sin éxito.');
  return {
    texto: '⚠️ Todos los proveedores fallaron o el archivo no es compatible.',
    proveedor: 'ninguno',
  };
}

function limpiarHistorial() {
  historial.length = 0;
  console.log('[AGENTE] Historial de sesión limpiado.');
}

module.exports = { inicializarBrain, procesarMensaje, limpiarHistorial };
