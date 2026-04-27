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

async function llamarGroqJSON(mensajeUsuario, systemPrompt) {
  const groq = new Groq({ apiKey: config.ai.groq.apiKey });
  const sp = systemPrompt ? inyectarIdioma(systemPrompt) : IDIOMA_SICC;
  console.log(`[AGENTE] 🟠 [JUEZ-JSON] Invocando Groq con response_format json_object.`);
  const respuesta = await groq.chat.completions.create({
    model: config.ai.groq.model,
    messages: [
      { role: 'system', content: sp },
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
    response_format: { type: 'json_object' },
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

  console.log(`[AGENTE] 🟣 Invocando llamarOpenRouter. Modelo: ${modelOverride || config.ai.openrouter.model}. Chars: ${systemInstruction.length}`);
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

async function llamarOpenRouterJSON(mensajeUsuario, systemPrompt, modelOverride = null) {
  const client = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: config.ai.openrouter.apiKey,
    defaultHeaders: { 'HTTP-Referer': 'http://localhost', 'X-Title': config.agent.name },
  });
  
  const sp = systemPrompt ? inyectarIdioma(systemPrompt) : IDIOMA_SICC;
  console.log(`[AGENTE] 🟣 [JUEZ-JSON] Invocando OpenRouter. Modelo: ${modelOverride || 'openrouter/free'}`);
  const respuesta = await client.chat.completions.create({
    model: modelOverride || 'openrouter/free',
    messages: [
      { role: 'system', content: sp },
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
  });
  return respuesta.choices[0].message.content;
}

/**
 * DEEPSEEK — Motor de Razonamiento Forense (v4-flash / v4-pro)
 * 100% compatible con el SDK de OpenAI. Proveedor principal del sistema.
 */
async function llamarDeepSeek(mensajeUsuario, _archivoTmp, contextoRAG = '', systemPrompt = null) {
  const client = new OpenAI({
    baseURL: config.ai.deepseek.baseUrl,
    apiKey: config.ai.deepseek.apiKey,
  });
  const sp = inyectarIdioma(systemPrompt || agentContext.getPromptFast());
  const modelo = config.ai.deepseek.model;
  console.log(`[AGENTE] 🔵 Invocando DeepSeek. Modelo: ${modelo}`);
  const respuesta = await client.chat.completions.create({
    model: modelo,
    messages: [
      { role: 'system', content: sp + (contextoRAG ? `\n\n---\nCONTEXTO CONTRACTUAL:\n${contextoRAG}` : '') },
      ...agentContext.getHistorial().map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 2048,
    temperature: 0.2,
  });
  // Fallback: algunos modelos de razonamiento usan reasoning_content en lugar de content
  const msg = respuesta.choices[0].message;
  return msg.content || msg.reasoning_content || '';
}

async function llamarDeepSeekJSON(mensajeUsuario, systemPrompt) {
  const client = new OpenAI({
    baseURL: config.ai.deepseek.baseUrl,
    apiKey: config.ai.deepseek.apiKey,
  });
  const sp = systemPrompt ? inyectarIdioma(systemPrompt) : IDIOMA_SICC;
  const modelo = config.ai.deepseek.modelPro || 'deepseek-chat';
  console.log(`[AGENTE] 🔵 [JUEZ-JSON] Invocando DeepSeek Reasoner. Modelo: ${modelo}`);
  const respuesta = await client.chat.completions.create({
    model: modelo,
    messages: [
      { role: 'system', content: sp },
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });
  const msg = respuesta.choices[0].message;
  return msg.content || msg.reasoning_content || '';
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
const IDIOMA_SICC = '\n\nREGLA ABSOLUTA DE IDIOMA: Debes pensar, razonar y responder SIEMPRE en español. Nunca respondas en inglés. Si el contexto está en inglés, traduce tu respuesta al español.\n\n';

function inyectarIdioma(sp) {
  if (!sp) return IDIOMA_SICC;
  return sp + IDIOMA_SICC;
}

// Retorna true si el proveedor tuvo 429 en los últimos 15 minutos — skip rápido para no gastar budget de tiempo
function proveedorBloqueadoReciente(id) {
  const cutoff = Date.now() - 15 * 60 * 1000;
  const bloqueado = EstadoGlobalErrores.ultimos4xx.some(
    e => e.proveedor === id && e.code === 429 && new Date(e.ts).getTime() > cutoff
  );
  if (bloqueado) console.log(`[TELEMETRY] 🛡️  Proveedor ${id.toUpperCase()} bloqueado por cuota (429) hasta ${new Date(cutoff + 15 * 60 * 1000).toLocaleTimeString()}`);
  return bloqueado;
}

async function llamarMultiplexadorFree(pregunta, contextoRAG = '', systemPrompt = null) {
  const sp = inyectarIdioma(systemPrompt);

  const proveedoresFree = [
    { id: 'gemini',     fn: async (q, a, ctx, h, s) => llamarGemini(q, a, ctx, s) },
    { id: 'groq',       fn: async (q, a, ctx, h, s) => llamarGroq(q, a, ctx, s) },
    { id: 'ollama',     fn: llamarOllama },
    { id: 'openrouter', fn: async (q, a, ctx, h, s) => llamarOpenRouter(q, a, ctx, s, 'openrouter/free') },
    { id: 'deepseek',   fn: async (q, a, ctx, h, s) => llamarDeepSeek(q, a, ctx, s) }, // 🔴 Blocker final
  ];

  // Mapa de verificación de disponibilidad por proveedor
  function proveedorDisponible(id) {
    if (id === 'ollama')    return !!config.ai.ollama?.host;
    if (id === 'deepseek')  return !!config.ai.deepseek?.apiKey;
    return !!(config.ai[id]?.apiKey);
  }

  let lastErr = null;
  for (const p of proveedoresFree) {
    // Skip si no tiene credenciales configuradas
    if (!proveedorDisponible(p.id)) {
      console.log(`[GATEWAY-AHORRO] ⏭️  Saltando ${p.id.toUpperCase()} (sin credenciales)`);
      continue;
    }

    // Skip si tuvo un 429 en los últimos 15 min — no gastar RTT para volver a fallar
    if (proveedorBloqueadoReciente(p.id)) {
      console.log(`[GATEWAY-AHORRO] ⏭️  Saltando ${p.id.toUpperCase()} (429 reciente <15min)`);
      continue;
    }

    try {
      console.log(`[GATEWAY-AHORRO] 💸 Intentando: ${p.id.toUpperCase()}...`);
      const respuesta = await p.fn(pregunta, null, contextoRAG, null, sp);
      if (respuesta && respuesta.length > 10) { // Validar respuesta mínima sustantiva
        registrarTrazaSICC(pregunta, p.id, contextoRAG);
        return { texto: respuesta, proveedor: p.id };
      }
      console.warn(`[GATEWAY-AHORRO] ⚠️  ${p.id.toUpperCase()} devolvió respuesta vacía o insuficiente. Continuando...`);
    } catch (err) {
      lastErr = err;
      const code = extraerCodigoError(err);
      if (code) registrarError4xx(code, p.id, err.message);
      
      if (code === 429) {
        console.warn(`[GATEWAY-AHORRO] 🔴 ${p.id.toUpperCase()} cuota agotada (429). MARCANDO BLOQUEO TEMPORAL.`);
        // Forzar registro inmediato para que el siguiente intento lo salte
        registrarError4xx(429, p.id, "Auto-bloqueo preventivo");
      } else {
        console.warn(`[GATEWAY-AHORRO] [SICC WARN] Fallo en ${p.id} (${code || 'ERR'}): ${err.message}`);
      }
    }
  }

  // Todos los proveedores de la cascada fallaron
  throw new Error(
    `[SICC BLOCKER] Todos los proveedores agotaron su cuota o fallaron.` +
    (lastErr ? ` Último error: ${lastErr.message}` : '') +
    ` Reintenta en 1h o verifica las API Keys.`
  );
}

/**
 * ORACLE FETCHER: Destilación de Contexto para Modelos con Ventana Limitada
 * Objetivo: Transformar fragmentos contractuales en una Ficha de Mandatos Innegociables.
 */
async function extraerFichaTecnica(intencion, chunksCrudos) {
    const promptDestilador = `
ACTÚA COMO UN DIRECTOR DE INTEGRACIÓN TÉCNICA PARA EL PROYECTO LFC2.
TU OBJETIVO ES RESUMIR ESTOS FRAGMENTOS DE CONTRATO (SSoT) EN UNA FICHA TÉCNICA ESTRICTA.

REGLAS DE ORO PARA EL RESUMEN:
1. NUNCA RESUMAS IDs O NÚMEROS DE CLÁUSULA: Mantén "Cláusula 3.9(a)(iv)" o los artículos de la FRA o AREMA exactamente como están en el texto.
2. EXTRAE SOLO MANDATOS TÉCNICOS Y RESTRICCIONES: Busca y extrae obligaciones ("El concesionario debe...", "Se exige...", "El sistema operará bajo...").
3. ELIMINA LA RETÓRICA LEGAL: Borra saludos, introducciones largas, "De conformidad con lo dispuesto..." y céntrate en el requerimiento duro.
4. MANTÉN NOMBRES EXACTOS: Ej. "Fibra Óptica Soterrada", "SIL-4", "Locomotoras GR12, U10 y U18".

Especialidad a analizar: ${intencion}

CONTEXTO CRUDO (PROVENIENTE DEL CONTRATO APP 001/2025 Y NORMAS ASOCIADAS):
${chunksCrudos}

Genera la FICHA TÉCNICA DE RESTRICCIONES usando Markdown, en viñetas concisas.
`;

    console.log(`[ORACLE FETCHER] Destilando ${chunksCrudos.length} caracteres para la especialidad: ${intencion}...`);
    try {
        const respuesta = await llamarMultiplexadorFree(promptDestilador, "", "Rol: Destilador de Soberanía Técnica");
        return typeof respuesta === 'string' ? respuesta : (respuesta.texto || respuesta.content || "Error en destilación");
    } catch (error) {
        console.error(`[ORACLE FETCHER] Falló la destilación: ${error.message}`);
        return `## FICHA TÉCNICA BÁSICA\n- Cumplir estrictamente con el Contrato APP 001/2025 para el área de ${intencion}.\n- [Error destilando contexto: ${error.message}]`;
    }
}

module.exports = { 
  detectSpecialty, 
  getMultiplexedContext,
  setAgentContext,
  llamarGemini,
  llamarGroq,
  llamarGroqJSON,
  llamarDeepSeek,
  llamarDeepSeekJSON,
  llamarOpenRouter,
  llamarOpenRouterJSON,
  llamarOllama,
  ordenProveedores,
  llamarMultiplexadorFree,
  registrarTrazaSICC,
  EstadoGlobalErrores,
  registrarError4xx,
  extraerCodigoError,
  extraerFichaTecnica
};

if (require.main === module) {
  const testInput = process.argv.slice(2).join(' ');
  if (!testInput) {
    console.log('Uso: node sicc-multiplexer.js "pregunta de prueba"');
    process.exit(0);
  }
  console.log(getMultiplexedContext(testInput));
}
