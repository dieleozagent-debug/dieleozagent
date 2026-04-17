#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const Groq = require('groq-sdk');
const OpenAI = require('openai');
const config = require('../src/config');

let agentContext = {
  getHistorial: () => [],
  getPromptFast: () => '',
  getPromptFull: () => '',
};

const EstadoGlobalErrores = {
  ultimos4xx: [],      // Lista de últimos errores [timestamp, code, proveedor]
  conteos: {},         // Mapa de códigos a frecuencia
  bloqueos: new Set(), // Códigos que requieren intervención manual (ej: 402)
  ultimaActualizacion: null
};

function registrarError4xx(codigo, proveedor, mensaje = '') {
  const code = parseInt(codigo);
  if (isNaN(code)) return;

  EstadoGlobalErrores.ultimos4xx.push({ ts: new Date().toISOString(), code, proveedor, mensaje: mensaje.substring(0, 50) });
  if (EstadoGlobalErrores.ultimos4xx.length > 20) EstadoGlobalErrores.ultimos4xx.shift();
  
  EstadoGlobalErrores.conteos[code] = (EstadoGlobalErrores.conteos[code] || 0) + 1;
  EstadoGlobalErrores.ultimaActualizacion = new Date().toISOString();
  
  if (code === 402) EstadoGlobalErrores.bloqueos.add('QUOTA_EXCEEDED');
  console.log(`[TELEMETRY] [SICC BLOCKER] Error ${code} registrado desde ${proveedor.toUpperCase()}.`);
}

function extraerCodigoError(err) {
  if (err.status) return err.status;
  if (err.response && err.response.status) return err.response.status;
  if (err.statusCode) return err.statusCode;
  const match = err.message.match(/(\d{3})/);
  return match ? parseInt(match[1]) : null;
}

function setAgentContext(ctx) {
  agentContext = { ...agentContext, ...ctx };
}

const SPECIALTIES_DIR = path.join(__dirname, '../brain/SPECIALTIES');
const RHARD_PATH = path.join(__dirname, '../brain/R-HARD.md');
const TRACES_PATH = path.join(__dirname, '../data/logs/sicc-traces.json');

/**
 * Registra una traza de inferencia para auditoría forense.
 */
function registrarTrazaSICC(pregunta, proveedor, contextoFinal = '') {
  try {
    const traza = {
      timestamp: new Date().toISOString(),
      pregunta: pregunta.substring(0, 500),
      proveedor,
      brain_active: true,
      context_length: (contextoFinal || '').length
    };
    
    let current = [];
    if (fs.existsSync(TRACES_PATH)) {
      const content = fs.readFileSync(TRACES_PATH, 'utf8');
      try { current = JSON.parse(content); } catch (e) { current = []; }
    }
    
    current.push(traza);
    if (current.length > 100) current.shift(); // Hard-cap de 100 trazas
    
    fs.mkdirSync(path.dirname(TRACES_PATH), { recursive: true });
    fs.writeFileSync(TRACES_PATH, JSON.stringify(current, null, 2));
  } catch (err) {
    console.warn('[MULTIPLEXER] [SICC WARN] No se pudo registrar traza:', err.message);
  }
}

/**
 * SICC MULTIPLEXER v1.0 — Hand-off Especializado
 * Mapeo de Palabras Base a Mini-Cerberos
 */
const BASE_WORDS = {
  'SIGNALIZATION': ['señalización', 'ptc', 'fra 236', 'moving block', 'v-rail', 'obc', 'on-board'],
  'COMMUNICATIONS': ['telecomunicaciones', 'comunicaciones', 'fibra', 'g.652.d', 'vital ip', 'satélite', 'starlink'],
  'POWER': ['potencia', 'energía', 'híbrida', 'solar', 'fotovoltaico', 'ups', 'batería'],
  'CONTROL_CENTER': ['centro de control', 'cco', 'ctc', 'hmi', '2oo3', 'despacho'],
  'INTEGRATION': ['integración', 'interfaz', 'interconexión', 'fat', 'sat', 'hil'],
  'ENCE': ['enclavamiento', 'ence', 'v-block', 'aguja', 'desvío', 'sil-4']
};

function detectSpecialty(text) {
  const lowercaseText = text.toLowerCase();
  for (const [specialty, words] of Object.entries(BASE_WORDS)) {
    if (words.some(word => lowercaseText.includes(word))) {
      return specialty;
    }
  }
  return null;
}

function getMultiplexedContext(userInput) {
  const specialty = detectSpecialty(userInput);
  const rHardContent = fs.readFileSync(RHARD_PATH, 'utf8');
  
  if (!specialty) {
    console.log('[MULTIPLEXER] No se detectó especialidad específica. Usando R-HARD Core.');
    return rHardContent;
  }

  const specPath = path.join(SPECIALTIES_DIR, `${specialty}.md`);
  if (fs.existsSync(specPath)) {
    console.log(`[MULTIPLEXER] 🎯 Especialidad detectada: ${specialty}`);
    // Los archivos de especialidad ya contienen R-HARD en el header
    return fs.readFileSync(specPath, 'utf8');
  }

  return rHardContent;
}

async function llamarGemini(mensajeUsuario, archivoTmpInfo, contextoRAG = '', systemPrompt = null) {
  const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
  const fileManager = new GoogleAIFileManager(config.ai.gemini.apiKey);
  
  const finalSystemPrompt = systemPrompt || agentContext.getPromptFast();
  let systemInstruction = contextoRAG 
    ? finalSystemPrompt + '\n\n' + contextoRAG 
    : finalSystemPrompt;

  // Modo seguro (Cloud caps at 15k for stability)
  if (systemInstruction.length > 15000) {
    systemInstruction = systemInstruction.substring(0, 15000) + '\n... [TRUNCADO POR SEGURIDAD]';
  }

  console.log(`[AGENTE] 🔵 Invocando llamarGemini. Modelo: ${config.ai.gemini.model}. Chars: ${systemInstruction.length}`);
  const model = genAI.getGenerativeModel({
    model: config.ai.gemini.model,
    systemInstruction: { role: 'system', parts: [{ text: systemInstruction }] },
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
    console.log(`[AGENTE] [SICC OK] Archivo subido: ${uploadResponse.file.uri}`);
    parts.unshift({
      fileData: { mimeType: uploadResponse.file.mimeType, fileUri: uploadResponse.file.uri }
    });
  }

  const chat = model.startChat({
    history: agentContext.getHistorial().map(h => ({
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

async function llamarGroq(mensajeUsuario, _, contextoRAG = '', systemPrompt = null) {
  const groq = new Groq({ apiKey: config.ai.groq.apiKey });
  
  const finalSystemPrompt = systemPrompt || agentContext.getPromptFast();
  let systemInstruction = contextoRAG 
    ? finalSystemPrompt + '\n\n' + contextoRAG 
    : finalSystemPrompt;

  // Límite estricto para Groq Free Tier (15k chars ≈ 4k-5k tokens)
  if (systemInstruction.length > 15000) {
    systemInstruction = systemInstruction.substring(0, 15000) + '\n... [TRUNCADO POR SEGURIDAD]';
  }

  console.log(`[AGENTE] 🟠 Invocando llamarGroq. Modelo: ${config.ai.groq.model}. Chars: ${systemInstruction.length}`);
  const respuesta = await groq.chat.completions.create({
    model: config.ai.groq.model,
    messages: [
      { role: 'system', content: systemInstruction },
      ...agentContext.getHistorial().map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 2048,
  });
  return respuesta.choices[0].message.content;
}

async function llamarOpenRouter(mensajeUsuario, _, contextoRAG = '', systemPrompt = null, modelOverride = null) {
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.ai.openrouter.apiKey,
    defaultHeaders: { 'HTTP-Referer': 'http://localhost', 'X-Title': config.agent.name },
  });
  
  const finalSystemPrompt = systemPrompt || agentContext.getPromptFast();
  const systemInstruction = contextoRAG 
    ? finalSystemPrompt + '\n\n' + contextoRAG 
    : finalSystemPrompt;

  const respuesta = await client.chat.completions.create({
    model: modelOverride || config.ai.openrouter.model,
    messages: [
      { role: 'system', content: systemInstruction },
      ...agentContext.getHistorial().map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
  });
  return respuesta.choices[0].message.content;
}

async function llamarOllama(mensajeUsuario, _, contextoRAG = '', historialLocal = null, systemPrompt = null) {
  // Intentar primero con el host de config, luego fallback inteligente (Host vs Docker)
  const isDocker = fs.existsSync('/.dockerenv');
  const internalHost = 'http://opengravity-ollama:11434';
  const externalHost = 'http://127.0.0.1:11434';
  
  const hostsTry = [
    config.ai.ollama.host,
    isDocker ? internalHost : externalHost,
    'http://localhost:11434'
  ].filter(Boolean);
  let lastErr = null;

  for (const host of hostsTry) {
    try {
      const client = new OpenAI({ baseURL: `${host}/v1`, apiKey: 'ollama' });
      const finalSystemPrompt = systemPrompt || agentContext.getPromptFull();
      const systemInstruction = contextoRAG ? finalSystemPrompt + '\n\n' + contextoRAG : finalSystemPrompt;

      const msgs = [
        { role: 'system', content: systemInstruction },
        ...(historialLocal || agentContext.getHistorial()).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: mensajeUsuario },
      ];

      const respuesta = await client.chat.completions.create({
        model: config.ai.ollama.model,
        messages: msgs,
      });
      return respuesta.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      console.warn(`[OLLAMA] [SICC WARN] Fallo en host ${host}: ${err.message}. Intentando siguiente...`);
    }
  }
  throw new Error(`Ollama Error: ${lastErr.message}`);
}

function ordenProveedores() {
  const todos = [
    { id: 'gemini',     fn: llamarGemini },
    { id: 'groq',       fn: llamarGroq },
    { id: 'openrouter', fn: llamarOpenRouter },
    { id: 'ollama',     fn: llamarOllama },
  ].filter(p => {
    if (p.id === 'gemini')     return !!config.ai.gemini.apiKey;
    if (p.id === 'groq')       return !!config.ai.groq.apiKey;
    if (p.id === 'openrouter') return !!config.ai.openrouter.apiKey;
    if (p.id === 'ollama')     return !!config.ai.ollama.host;
    return false;
  });

  const primario = config.ai.primaryProvider;
  const res = [
    ...todos.filter(p => p.id === primario),
    ...todos.filter(p => p.id !== primario),
  ];
  return res;
}

async function llamarMultiplexadorFree(pregunta, contextoRAG = '', systemPrompt = null) {
  const proveedoresFree = [
    { id: 'gemini',     fn: llamarGemini },
    { id: 'groq',       fn: llamarGroq },
    { id: 'ollama',     fn: llamarOllama },
    { id: 'openrouter', fn: async (q, a, ctx, hist, sp) => llamarOpenRouter(q, a, ctx, sp, 'openrouter/free') }
  ];

  let lastErr = null;
  for (const p of proveedoresFree) {
    const status = !!(config.ai[p.id]?.apiKey || (p.id === 'ollama' && config.ai.ollama.host));
    if (!status) continue;

    try {
      console.log(`[GATEWAY-AHORRO] 💸 Intentando vía gratuita: ${p.id.toUpperCase()}...`);
      const respuesta = await p.fn(pregunta, null, contextoRAG, null, systemPrompt);
      
      if (respuesta && !respuesta.toLowerCase().includes('error') && respuesta.length > 5) {
        registrarTrazaSICC(pregunta, p.id, contextoRAG);
        return { texto: respuesta, proveedor: p.id };
      }
    } catch (err) {
      lastErr = err;
      const code = extraerCodigoError(err);
      if (code) registrarError4xx(code, p.id, err.message);
      console.warn(`[GATEWAY-AHORRO] [SICC WARN] Fallo en ${p.id}: ${err.message}`);
    }
  }

  console.warn('[GATEWAY-AHORRO] [SICC BLOCKER] Vías gratuitas agotadas (incluyendo OpenRouter Free). Usando Contingencia SICC (Strictly Free)...');
  const lowCostModel = 'meta-llama/llama-3.1-8b-instruct:free';
  const res = await llamarOpenRouter(pregunta, null, contextoRAG, systemPrompt, lowCostModel);
  registrarTrazaSICC(pregunta, 'openrouter-lowcost', contextoRAG);
  return { texto: res, proveedor: 'openrouter-lowcost' };
}

// Exportar para uso en dreamer.js y agent.js
module.exports = { 
  detectSpecialty, 
  getMultiplexedContext,
  setAgentContext,
  llamarGemini,
  llamarGroq,
  llamarOpenRouter,
  llamarOllama,
  ordenProveedores,
  llamarMultiplexadorFree,
  registrarTrazaSICC,
  EstadoGlobalErrores,
  registrarError4xx,
  extraerCodigoError
};

// Soporte para ejecución CLI (Testing)
if (require.main === module) {
  const testInput = process.argv.slice(2).join(' ');
  if (!testInput) {
    console.log('Uso: node sicc-multiplexer.js "pregunta de prueba"');
    process.exit(0);
  }
  console.log(getMultiplexedContext(testInput));
}
