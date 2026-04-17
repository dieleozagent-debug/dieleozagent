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

/**
 * Construye un prompt segmentado en 4 secciones para Ollama.
 * Los modelos locales procesan mejor contexto estructurado que un bloque largo.
 * Total ~2500 chars vs los 15K del prompt completo.
 */
function construirPromptOllama(systemPrompt, contextoRAG) {
  const rhard = leerBrainOllama('R-HARD.md', 600);
  const identity = leerBrainOllama('IDENTITY.md', 400);

  const tareaRaw = systemPrompt || agentContext.getPromptFast();
  // Extraer solo la parte de la tarea (después de las instrucciones de rol)
  const tareaSnippet = tareaRaw.length > 800
    ? tareaRaw.substring(tareaRaw.length - 800)  // cola del prompt = la tarea concreta
    : tareaRaw;

  const ctxSnippet = contextoRAG ? contextoRAG.substring(0, 900) : '';

  return [
    `[SECCIÓN 1/4] IDENTIDAD SICC\n${identity}`,
    `[SECCIÓN 2/4] RESTRICCIONES R-HARD (INMUTABLES)\n${rhard}`,
    `[SECCIÓN 3/4] TAREA ACTUAL\n${tareaSnippet}`,
    ctxSnippet ? `[SECCIÓN 4/4] CONTEXTO CONTRACTUAL LFC2\n${ctxSnippet}` : '',
    `\nREGLA ABSOLUTA: Responde SIEMPRE en español. Nunca en inglés.`,
  ].filter(Boolean).join('\n\n---\n\n');
}

function leerBrainOllama(filename, maxChars) {
  try {
    const filepath = path.join(config.paths.brain, filename);
    if (!fs.existsSync(filepath)) return `[${filename} no disponible]`;
    const content = fs.readFileSync(filepath, 'utf8').trim();
    return content.length > maxChars ? content.substring(0, maxChars) + '...' : content;
  } catch { return `[${filename} no disponible]`; }
}

async function llamarOllama(mensajeUsuario, _, contextoRAG = '', historialLocal = null, systemPrompt = null) {
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
      // Prompt segmentado en 4 secciones — mejor que truncar un bloque largo
      const systemInstruction = construirPromptOllama(systemPrompt, contextoRAG);

      const msgs = [
        { role: 'system', content: systemInstruction },
        ...(historialLocal || agentContext.getHistorial()).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: mensajeUsuario },
      ];

      // Timeout de 45s — Ollama con prompts largos puede colgar indefinidamente
      const timeoutPromise = new Promise((_, rej) =>
        setTimeout(() => rej(new Error('Ollama timeout 45s')), 45000)
      );
      const respuesta = await Promise.race([
        client.chat.completions.create({ model: config.ai.ollama.model, messages: msgs }),
        timeoutPromise
      ]);
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

// Prefijo de idioma inyectado en TODOS los system prompts del multiplexer.
// Garantiza respuestas en español independientemente del modelo (Ollama, OpenRouter, etc.)
const IDIOMA_SICC = '\n\nREGLA ABSOLUTA DE IDIOMA: Debes pensar, razonar y responder SIEMPRE en español. Nunca respondas en inglés. Si el contexto está en inglés, traduce tu respuesta al español.\n\n';

function inyectarIdioma(sp) {
  if (!sp) return IDIOMA_SICC;
  return sp + IDIOMA_SICC;
}

async function llamarMultiplexadorFree(pregunta, contextoRAG = '', systemPrompt = null) {
  const sp = inyectarIdioma(systemPrompt);

  const proveedoresFree = [
    { id: 'gemini',     fn: llamarGemini },
    { id: 'groq',       fn: llamarGroq },
    { id: 'ollama',     fn: llamarOllama },
    { id: 'openrouter', fn: async (q, a, ctx, hist, s) => llamarOpenRouter(q, a, ctx, s, 'openrouter/free') }
  ];

  let lastErr = null;
  for (const p of proveedoresFree) {
    const status = !!(config.ai[p.id]?.apiKey || (p.id === 'ollama' && config.ai.ollama.host));
    if (!status) continue;

    try {
      console.log(`[GATEWAY-AHORRO] 💸 Intentando vía gratuita: ${p.id.toUpperCase()}...`);
      const respuesta = await p.fn(pregunta, null, contextoRAG, null, sp);
      if (respuesta && respuesta.length > 20) {
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

  // Nivel 2: OpenRouter free routing (selecciona automáticamente el mejor modelo libre disponible)
  // Historial confirmado: Nemotron 3 Super, Trinity Large, gpt-oss-120b — todos sin costo.
  if (config.ai.openrouter.apiKey) {
    try {
      console.log('[GATEWAY-AHORRO] 🔄 Nivel 2: OpenRouter auto-free routing...');
      const res = await llamarOpenRouter(pregunta, null, contextoRAG, sp, 'openrouter/free');
      if (res && res.length > 20) {
        registrarTrazaSICC(pregunta, 'openrouter/free', contextoRAG);
        return { texto: res, proveedor: 'openrouter/free' };
      }
    } catch (e) {
      console.warn(`[GATEWAY-AHORRO] [SICC WARN] Fallo openrouter/free: ${e.message}`);
    }
  }

  // Nivel 3: modelos de pago en OpenRouter como último recurso absoluto
  const paidFallbacks = [
    'google/gemini-2.0-flash-001',       // ~$0.10/1M tokens
    'meta-llama/llama-3.3-70b-instruct', // ~$0.12/1M tokens, sin cuota diaria
  ];
  if (config.ai.openrouter.apiKey) {
    for (const model of paidFallbacks) {
      try {
        console.log(`[GATEWAY-AHORRO] 💳 Nivel 3 (pagado): ${model}...`);
        const res = await llamarOpenRouter(pregunta, null, contextoRAG, sp, model);
        if (res && res.length > 20) {
          registrarTrazaSICC(pregunta, `openrouter-paid:${model}`, contextoRAG);
          return { texto: res, proveedor: `openrouter-paid:${model}` };
        }
      } catch (e) {
        console.warn(`[GATEWAY-AHORRO] [SICC WARN] Fallo ${model}: ${e.message}`);
      }
    }
  }

  throw new Error('[SICC BLOCKER] Todos los proveedores agotados. Reintenta en 1h.');
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
