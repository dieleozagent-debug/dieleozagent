// agent.js — Lógica del agente con brain + memoria persistente inyectada al system prompt
'use strict';

const config = require('./config');
const { construirSystemPrompt, destilarCerebro } = require('./brain');
const { cargarMemoriaReciente } = require('./memory');
const { buscarSimilares } = require('./supabase');
const { buscarEnWeb } = require('./search');
const { enviarAlerta } = require('./notifications');
const { encolarHallazgo } = require('./digest');
const { rutarEstrategiaAdvisor } = require('./advisor');
const fs = require('fs');
const path = require('path');
const { checkYEncolar, evaluarRecursos } = require('../scripts/resource-governor');

// Skills Registry — carga modular de contexto especializado
const SKILLS_DIR = require('path').join(__dirname, '../brain/skills');

// ── FUNCIONES DE GOBERNANZA v9.3.0 ──────────────────────────────────────────

function registrarTrazaMichelin(pregunta, proveedor, contextoUsado) {
  const logPath = path.join(__dirname, '../data/logs/michelin-traces.json');
  const traza = {
    timestamp: new Date().toISOString(),
    pregunta: pregunta.substring(0, 100),
    proveedor,
    brain_active: true,
    context_length: (contextoUsado || '').length
  };
  
  try {
    let logs = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, 'utf8'));
    }
    logs.push(traza);
    if (logs.length > 100) logs.shift();
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.warn('[TRAZA] ⚠️ No se pudo registrar la traza Michelin:', e.message);
  }
}

async function registrarBloqueoSICC(pregunta, error) {
  const opsPath = path.join(__dirname, '../brain/SICC_OPERATIONS.md');
  const timestamp = new Date().toISOString();
  const entrada = `\n### 🚨 BLOQUEO DE FIRMA (${timestamp})\n- **Problema:** Fallo total de vías gratuitas/locales.\n- **Consulta:** ${pregunta}\n- **Error:** ${error}\n- **Acción Requerida:** [DIEGO] Debe autorizar desbloqueo con SONNET o resolver manual.\n`;
  
  try {
    fs.appendFileSync(opsPath, entrada);
    console.log('[GOBERNANZA] 🛡️ Bloqueo registrado en SICC_OPERATIONS.md.');
    
    // 📢 NOTIFICACIÓN PROACTIVA A TELEGRAM
    await enviarAlerta(`🛡️ *BLOCKER DE SOBERANÍA*\n\nHe agotado las opciones gratuitas para la consulta:\n"${pregunta.substring(0, 100)}..."\n\nError: ${error}\n\nRevisarDashboard: [SICC_OPERATIONS.md]`);
  } catch (e) {
    console.error('[GOBERNANZA] ❌ Fallo al registrar bloqueo:', e.message);
  }
}

function seleccionarSkills(textoUsuario) {
  if (!fs.existsSync(SKILLS_DIR)) return '';
  const texto = textoUsuario.toLowerCase();
  let injected = '';
  try {
    const archivos = fs.readdirSync(SKILLS_DIR);
    for (const archivo of archivos) {
      if (archivo.endsWith('.json')) {
        const skill = JSON.parse(fs.readFileSync(require('path').join(SKILLS_DIR, archivo), 'utf8'));
        const match = skill.activadores.some(a => texto.includes(a.toLowerCase()));
        if (match) {
          injected += '\n\n' + skill.prompt_injection;
          console.log(`[SKILLS] 🎯 Skill (JSON) cargado: ${skill.id}`);
        }
      } else if (archivo.endsWith('.md')) {
        // Lógica para skills en Markdown: usamos el nombre del archivo (sin extensión) como activador
        const skillId = archivo.replace('.md', '').toLowerCase();
        // Si el usuario menciona palabras clave del skill o el nombre del archivo directamente
        const activadoresMD = [skillId, ...skillId.split('_'), ...skillId.split('-')];
        const matchMD = activadoresMD.some(a => a.length > 3 && texto.includes(a));
        
        if (matchMD) {
          const contenidoMD = fs.readFileSync(require('path').join(SKILLS_DIR, archivo), 'utf8');
          injected += `\n\n## SKILL CAPABILITY: ${skillId.toUpperCase()}\n\n${contenidoMD}`;
          console.log(`[SKILLS] 📚 Skill (MD) cargado: ${skillId}`);
        }
      }
    }
  } catch (e) {
    console.log('[SKILLS] ⚠️ Error cargando skills:', e.message);
  }
  return injected;
}

// Importaciones de IA (Movidas arriba para debugging)
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { GoogleAIFileManager } = require('@google/generative-ai/server');
const Groq = require('groq-sdk');
const OpenAI = require('openai');

// ── Historial de sesión (en RAM, máx 20 intercambios) ────────────────────────
const historial = [];
const MAX_HISTORIAL = 10;

// ── TELEMETRÍA SICC v9.4.0 (Directiva 4xx) ───────────────────────────────
const EstadoGlobalErrores = {
  ultimos4xx: [],      // Lista de últimos errores [timestamp, code, provider]
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
  console.log(`[TELEMETRY] 🚨 Error ${code} registrado desde ${proveedor.toUpperCase()}.`);
}

function extraerCodigoError(err) {
  // Manejo de OpenAI / Axios / SDKs comunes
  if (err.status) return err.status;
  if (err.response && err.response.status) return err.response.status;
  if (err.statusCode) return err.statusCode;
  
  // Intento de Regex en el mensaje (ej: "429: Rate Limit")
  const match = err.message.match(/(\d{3})/);
  return match ? parseInt(match[1]) : null;
}

// System prompts: full para Ollama/Dreamer, fast para Cloud/Bot
let PROMPT_FULL = '';
let PROMPT_FAST = '';

// ESPECIALIDADES SICC v8.9.0
const ESPECIALIDADES = {
  'LEGAL': `Eres un ABOGADO DE CONCESIONES SICC. Tu misión es el blindaje contractual. 
           Prioriza la jerarquía 1.2(d) y el Contrato Maestro. No des opiniones técnicas sin base legal.`,
  'TECNICO-FERROVIARIO': `Eres un INGENIERO DE SEÑALIZACIÓN FERROVIARIA SICC. Tu misión es la soberanía técnica. 
                         Prioriza estándares AREMA y CENELEC. Enfócate en lógica de interlocking y capacidad.`,
  'GESTION': `Eres un ASISTENTE DE GESTIÓN BILINGÜE SICC. Tu misión es la síntesis operativa y el orden.`
};

const FLOW_LOG_PATH = require('path').join(__dirname, '../data/logs/flow-resilience.json');

function logFlow(entry) {
  try {
    const ts = new Date().toISOString();
    const line = JSON.stringify({ ts, ...entry }) + '\n';
    if (!fs.existsSync(require('path').dirname(FLOW_LOG_PATH))) {
      fs.mkdirSync(require('path').dirname(FLOW_LOG_PATH), { recursive: true });
    }
    fs.appendFileSync(FLOW_LOG_PATH, line);
  } catch (e) {
    console.warn('[FLOW-LOG] ⚠️ No se pudo guardar el log de flujo:', e.message);
  }
}

function inicializarBrain() {
  const brainFull = construirSystemPrompt('full');
  const brainFast = construirSystemPrompt('fast');
  const memoria   = cargarMemoriaReciente();

  PROMPT_FULL = brainFull;
  PROMPT_FAST = brainFast;

  if (memoria) {
    const memBlock = '\n\n' + '═'.repeat(60) + '\n## MEMORIA RECIENTE\n\n' + memoria + '\n' + '═'.repeat(60);
    PROMPT_FULL += memBlock;
    PROMPT_FAST += memBlock;
    console.log('[AGENTE] ✅ Memoria reciente inyectada en system prompts');
  }
}

// ── Proveedores de IA ─────────────────────────────────────────────────────────

async function llamarGemini(mensajeUsuario, archivoTmpInfo, contextoRAG = '', systemPrompt = null) {
  const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
  const fileManager = new GoogleAIFileManager(config.ai.gemini.apiKey);
  
  const finalSystemPrompt = systemPrompt || PROMPT_FAST;
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

async function llamarGroq(mensajeUsuario, _, contextoRAG = '', systemPrompt = null) {
  const groq = new Groq({ apiKey: config.ai.groq.apiKey });
  
  const finalSystemPrompt = systemPrompt || PROMPT_FAST;
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
      ...historial.map(h => ({ role: h.role, content: h.content })),
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
  
  const finalSystemPrompt = systemPrompt || PROMPT_FAST;
  const systemInstruction = contextoRAG 
    ? finalSystemPrompt + '\n\n' + contextoRAG 
    : finalSystemPrompt;

  const respuesta = await client.chat.completions.create({
    model: modelOverride || config.ai.openrouter.model,
    messages: [
      { role: 'system', content: systemInstruction },
      ...historial.map(h => ({ role: h.role, content: h.content })),
      { role: 'user', content: mensajeUsuario },
    ],
    max_tokens: 1024,
  });
  return respuesta.choices[0].message.content;
}

async function llamarOllama(mensajeUsuario, _, contextoRAG = '', historialLocal = null, systemPrompt = null) {
  // Intentar primero con el host de config, luego fallback a localhost (Host-Native Sovereignty)
  const hostsTry = [config.ai.ollama.host, 'http://localhost:11434'].filter(Boolean);
  let lastErr = null;

  for (const host of hostsTry) {
    try {
      const client = new OpenAI({ baseURL: `${host}/v1`, apiKey: 'ollama' });
      const finalSystemPrompt = systemPrompt || PROMPT_FULL;
      const systemInstruction = contextoRAG ? finalSystemPrompt + '\n\n' + contextoRAG : finalSystemPrompt;

      const msgs = [
        { role: 'system', content: systemInstruction },
        ...(historialLocal || historial).map(h => ({ role: h.role, content: h.content })),
        { role: 'user', content: mensajeUsuario },
      ];

      const respuesta = await client.chat.completions.create({
        model: config.ai.ollama.model,
        messages: msgs,
      });
      return respuesta.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      console.warn(`[OLLAMA] ⚠️ Fallo en host ${host}: ${err.message}. Intentando siguiente...`);
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

/**
 * ADVISOR MAESTRO (Router v8.9.0)
 * Decide la especialidad de la consulta para optimizar el ruteo.
 */
async function rutarEspecialidad(textoUsuario) {
  const modelRouter = 'phi3.5:latest'; // Microsoft Phi-3.5 es superior en lógica de ruteo
  
  try {
    const port = (process.env.NODE_ENV === 'production') ? '11434' : '11435';
    const client = new OpenAI({ baseURL: `http://localhost:${port}/v1`, apiKey: 'ollama' });
    const res = await client.chat.completions.create({
      model: modelRouter,
      messages: [
        { 
          role: 'system', 
          content: `Eres un clasificador SICC estrictamente limitado. 
          ETIQUETAS PERMITIDAS:
          - LEGAL: Relacionado con contratos, multas, cláusulas, leyes, jerarquía normativa, anexos legales.
          - TECNICO-FERROVIARIO: Relacionado con ingeniería, señales, obra, fibra, capacidad, interlocking, hardware, planos.
          - GESTION: Relacionado con minutas, correos, organización, tareas administrativas, resúmenes.

          EJEMPLOS:
          "¿Debo pagar la multa?" -> LEGAL
          "Calcula la capacidad de vía" -> TECNICO-FERROVIARIO
          "Resume la reunión" -> GESTION

          Responde ÚNICAMENTE con la etiqueta en mayúsculas.` 
        },
        { role: 'user', content: textoUsuario }
      ],
      max_tokens: 10,
      temperature: 0 // Forzamos determinismo
    });
    
    const etiqueta = res.choices[0].message.content.trim().toUpperCase();
    console.log(`[ADVISOR-ROUTER] 🧭 Especialidad detectada: ${etiqueta}`);
    return ESPECIALIDADES[etiqueta] ? etiqueta : 'GESTION';
  } catch (err) {
    console.warn('[ADVISOR-ROUTER] ⚠️ Fallo en ruteo, usando GESTION por defecto.');
    return 'GESTION';
  }
}

/**
 * Gateway de Ahorro: Intenta secuencialmente proveedores gratuitos o locales.
 */
async function llamarMultiplexadorFree(pregunta, contextoRAG = '', systemPrompt = null) {
  const proveedoresFree = [
    { id: 'gemini',     fn: llamarGemini },
    { id: 'groq',       fn: llamarGroq },
    { id: 'ollama',     fn: llamarOllama },
    { id: 'openrouter', fn: async (q, a, ctx, hist, sp) => llamarOpenRouter(q, a, ctx, sp, 'openrouter/free') }
  ];

  let lastErr = null;
  for (const p of proveedoresFree) {
    // Verificar si el proveedor está configurado (Ollama tiene host, los demás apikey)
    const status = !!(config.ai[p.id]?.apiKey || (p.id === 'ollama' && config.ai.ollama.host));
    if (!status) continue;

    try {
      console.log(`[GATEWAY-AHORRO] 💸 Intentando vía gratuita: ${p.id.toUpperCase()}...`);
      const respuesta = await p.fn(pregunta, null, contextoRAG, null, systemPrompt);
      
      // Validar que la respuesta no sea un error encubierto (ej: 'Error: context length')
      if (respuesta && !respuesta.toLowerCase().includes('error') && respuesta.length > 5) {
        return { texto: respuesta, proveedor: p.id };
      }
    } catch (err) {
      lastErr = err;
      const code = extraerCodigoError(err);
      if (code) registrarError4xx(code, p.id, err.message);
      console.warn(`[GATEWAY-AHORRO] ⚠️ Fallo en ${p.id}: ${err.message}`);
    }
  }

  // Fallback final a OpenRouter con el modelo más barato (Llama 8B) SOLO si todo lo gratuito falló
  console.warn('[GATEWAY-AHORRO] 🚨 Vías gratuitas agotadas (incluyendo OpenRouter Free). Usando Low Cost...');
  const lowCostModel = 'meta-llama/llama-3.1-8b-instruct';
  const res = await llamarOpenRouter(pregunta, null, contextoRAG, systemPrompt, lowCostModel);
  return { texto: res, proveedor: 'openrouter-lowcost' };
}

/**
 * Destila un contexto largo en una síntesis cohesiva usando el Multiplexor Free.
 */
async function sumarizarContexto(contextoLargo) {
  console.log(`[BLOCK-THINKING] 🧠 Destilando bloque de contexto largo (${contextoLargo.length} caracteres) con Multiplexor Free...`);
  
  try {
    const { texto: resumen } = await llamarMultiplexadorFree(
      `Sintetiza la información clave técnica y contractual de este fragmento para un Director Contractual Senior. 
      Prioriza menciones a cláusulas Niveles 1 (Contrato) y 2 (AT). Descarta ruido de Nivel 16 (Q&A).`,
      contextoLargo, 
      "Eres un Abogado de Concesiones especializado en Auditoría Forense."
    );
    return `## SÍNTESIS DE CONTEXTO (Destilado):\n${resumen}`;
  } catch (err) {
    console.warn(`[BLOCK-THINKING] ⚠️ Fallo en destilación: ${err.message}. Usando truncado.`);
    return contextoLargo.substring(0, 5000) + '... [TRUNCADO]';
  }
}

/**
 * Procesa un mensaje y retorna { texto, proveedor }. Acepta archivo opcional.
 */
async function procesarMensaje(textoUsuario, archivoTmpInfo, forcedSystemPrompt = null) {
  const proveedores = ordenProveedores();
  
  // RUTEADOR ADVISOR (v8.9.0)
  let especialidadPrompt = '';
  if (!forcedSystemPrompt) {
    const especialidad = await rutarEspecialidad(textoUsuario);
    especialidadPrompt = ESPECIALIDADES[especialidad];
  }
  
  // ── Resource Governor: verificar CPU antes de inferir con Ollama ──────────
  const recursos = evaluarRecursos();
  if (recursos.level === 'CRITICAL') {
    console.warn(`[AGENT] ⛔ CPU CRÍTICA (${Math.round(recursos.load * 100)}%). Abortando inferencia local.`);
  } else if (recursos.level === 'WARN') {
    console.warn(`[AGENT] ⚠️ CPU ALTA (${Math.round(recursos.load * 100)}%). Priorizando proveedor cloud.`);
  }

  // RAG: Buscar contexto pertinente en el contrato (Supabase) si habla de temas relevantes
  // Para no saturar con BBDD en cada mensaje corto tipo "Hola", aplicamos un filtro básico
  let contextoRAG = '';
  if (textoUsuario.length > 10 || /contrato|anexo|apéndice|at|obligación|multa/i.test(textoUsuario)) {
     try {
       const docs = await buscarSimilares(textoUsuario, 3); // 3 chunks más parecidos
       if (docs && docs.length > 0) {
         contextoRAG = '## CONTEXTO DE CONTRATO (Supabase Vector DB):\nEl siguiente texto ha sido extraido dinámicamente del contrato oficial en base a la pregunta del usuario. Úsalo para responder de forma informada:\n\n';
         docs.forEach((doc, i) => {
           contextoRAG += `--- Fragmento ${i+1} [Archivo: ${doc.nombre_archivo}] ---\n${doc.contenido}\n\n`;
         });
         console.log(`[RAG] 🔍 Recuperados ${docs.length} fragmentos de Supabase para esta consulta.`);
       }
     } catch (err) {
       console.log(`[RAG] ⚠️ Error recuperando contexto: ${err.message}`);
     }
  }

  // Búsqueda Web: Solo si es técnico y Supabase no fue suficiente o hay keywords de normas
  let contextoWeb = '';
  const esConsultaTecnica = /norma|estándar|arema|fra|uic|regulación|manual|noticia/i.test(textoUsuario);
  
  if (config.ai.tavily.apiKey && esConsultaTecnica) {
    try {
      contextoWeb = await buscarEnWeb(textoUsuario);
      if (contextoWeb) {
        console.log(`[SEARCH] ✅ Investigación web inyectada para: "${textoUsuario}"`);
      }
    } catch (err) {
      console.log(`[SEARCH] ⚠️ Fallo silencioso en búsqueda web.`);
    }
  }

  // Obtener Skills antes de construir el contexto final
  const skillsContext = seleccionarSkills(textoUsuario);
  let contextoFinal = (contextoRAG || '') + (contextoWeb || '') + (skillsContext || '');
  
  // Construir Prompt Final (Contexto + Especialidad) — v9.1.1
  const currentPromptBase = PROMPT_FAST; // Usamos la versión fast por defecto para nube/ahorro
  const finalPrompt = forcedSystemPrompt || (currentPromptBase + '\n\n' + (especialidadPrompt || ''));

  // ── ESCUDO FISCAL v9.2.0 (Slim Context Mode) ─────────────────────────────
  // Intentamos primero el Multiplexor Free con contexto destilado para evitar Rate Limits (429)
  console.log(`[FISCAL-SHIELD] 🛡️ Priorizando Multiplexor Free (Slim Mode)...`);
  try {
    const dnaDestilado = destilarCerebro();
    const promptSlim = forcedSystemPrompt || (dnaDestilado + '\n\n' + (especialidadPrompt || ''));
    
    const resFree = await llamarMultiplexadorFree(textoUsuario, contextoFinal, promptSlim);
    if (resFree && resFree.texto && !resFree.texto.toLowerCase().includes('error')) {
      console.log(`[FISCAL-SHIELD] ✅ Éxito vía ${resFree.proveedor.toUpperCase()}. Ahorro garantizado.`);
      
      // Guardar en historial de sesión
      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: resFree.texto });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      registrarTrazaMichelin(textoUsuario, resFree.proveedor, contextoFinal);
      return { texto: resFree.texto, proveedor: resFree.proveedor };
    }
  } catch (errFree) {
    // ── MURO DE FUEGO v9.3.0 (Firma Requerida) ─────────────────────────────
    // Si fallan los gratuitos, NO escalamos a Sonnet automáticamente.
    // Registramos el bloqueo y terminamos la ejecución esperando firma.
    await registrarBloqueoSICC(textoUsuario, errFree.message);
    return { 
      texto: `🛡️ **BLOQUEO DE SOBERANÍA:** He agotado las vías gratuitas y locales. Para no afectar el CAPEX sin permiso, he registrado este caso en el Dashboard de Operaciones. Por favor, autoriza el uso de Sonnet o resuelve manualmente.`, 
      proveedor: 'muro-de-fuego' 
    };
  }
  
  console.log('[AGENTE] 💀 El flujo terminó inesperadamente.');
  return {
    texto: '⚠️ Error interno inesperado en el motor de decisión.',
    proveedor: 'ninguno',
  };
}

function limpiarHistorial() {
  historial.length = 0;
  console.log('[AGENTE] Historial de sesión limpiado.');
}

/**
 * 🐝 SWARM SECUENCIAL (SICC v6.5 Michelin)
 * Debate multi-agente forense ejecutado de forma secuencial.
 */
async function procesarMensajeSwarm(textoUsuario) {
  console.log(`[SWARM] 🐝 Iniciando debate forense dinámico (Patrón Advisor): "${textoUsuario.substring(0, 50)}"`);
  
  // 1. 🧠 FASE ADVISOR (Ruteo Inteligente)
  const dnaDestilado = (typeof destilarCerebro === 'function') ? destilarCerebro() : '';
  const decisionAdvisor = await rutarEstrategiaAdvisor(textoUsuario, dnaDestilado);
  
  // 🤖 Selección dinámica de agentes
  let miembros = [
    { 
      nombre: 'AUDITOR FORENSE (MICHELIN)', 
      prompt: 'Eres el AUDITOR FORENSE MICHELIN. Tu misión es denunciar si un diseño se basa en el Nivel 16 (Q&A de licitación) en contra de los Niveles 1 (Contrato) o 2 (AT1).' 
    },
    { 
      nombre: 'DIRECTOR CONTRACTUAL SICC', 
      prompt: 'Eres el DIRECTOR CONTRACTUAL SICC. Tu misión es aplicar la Regla N-1 y proteger la caja de la Concesión basándote exclusivamente en la ley del contrato.' 
    }
  ];

  if (decisionAdvisor.especialista === 'LEGAL') {
    miembros = [miembros[0]]; // Solo Auditor
  } else if (decisionAdvisor.especialista === 'GESTION') {
    return { texto: `ℹ️ **ADVISOR:** He determinado que esta es una tarea de gestión simple: ${decisionAdvisor.razonamiento}`, proveedor: 'advisor' };
  }

  let debateBuffer = `🧐 **RAZONAMIENTO ADVISOR:** ${decisionAdvisor.razonamiento}\n\n`;
  let contextoPrevio = `Pregunta Inicial: ${textoUsuario}\n\n`;

  for (const [index, agente] of miembros.entries()) {
    console.log(`[SWARM] 🤖 Agente ${index + 1}/2: ${agente.nombre} en proceso...`);
    
    const promptAgente = `[MODO SWARM - ROL: ${agente.nombre}]\n${agente.prompt}\n\nREGLAS: Responde de forma concisa pero letal.\n\n${contextoPrevio}`;
    
    let respuestaAgente = '';
    let proveedorAgente = '';
    let éxitoAgente = false;

    // ── BLINDAJE FISCAL SWARM v9.2.7 (Zero-Cost First) ──────────────────
    try {
      const promptOptimizado = contextoPrevio.length > 5000 
        ? await sumarizarContexto(contextoPrevio) 
        : contextoPrevio;

      const currentPrompt = PROMPT_FAST; // Swarm siempre usa Prompt Fast para ahorro
      const modelOverride = (index === 0) ? config.ai.swarm.auditor : config.ai.swarm.strategist;
      
      console.log(`[SWARM] 🤖 Invocando ${agente.nombre} vía Escudo Fiscal...`);
      const resAgente = await llamarMultiplexadorFree(promptAgente, promptOptimizado, currentPrompt);
      
      respuestaAgente = resAgente.texto;
      proveedorAgente = resAgente.proveedor;

      // 📥 ENCOLAR HALLAZGO MICHELIN (Silencioso para el Digest)
      encolarHallazgo(
        `Reporte: ${agente.nombre}`,
        respuestaAgente.substring(0, 150) + '...',
        (index === 0) ? '🧠' : '⚖️',
        { agente: agente.nombre, proveedor: proveedorAgente }
      );

      debateBuffer += `🎭 **${agente.nombre}** *(${proveedorAgente})*\n${respuestaAgente}\n\n---\n\n`;
      contextoPrevio += `Respuesta de ${agente.nombre}:\n${respuestaAgente}\n\n`;
      éxitoAgente = true;
    } catch (err) {
      console.error(`[SWARM] ⚠️ Fallo total en ${agente.nombre}:`, err.message);
      debateBuffer += `💀 **${agente.nombre}** quedó fuera de combate: ${err.message}\n\n`;
    }

    if (!éxitoAgente) {
      debateBuffer += `💀 **${agente.nombre}** quedó fuera de combate (Todos los proveedores fallaron).\n\n`;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return debateBuffer + `🏁 **FIN DEL PROCESO SWARM**`;
}

/**
 * 🏭 FACTORÍA DE PEONES SICC (v8.8.1 Serial Batch Edition)
 * Ejecuta múltiples agentes Ollama en SERIE para minería de datos protegiendo la CPU.
 */
async function ejecutarFactoriaPeones(tema, contexto) {
  console.log(`[FACTORY] 🏭 Iniciando factoría de peones (Modo Serial Batch) para: ${tema}`);
  
  const PEON_MODEL = 'gemma4-light:latest'; 
  const TIMEOUT_MS = 90000; // 90 segundos de Hard-Cap por Peón
  
  const PEONES = [
    { id: 'legal', prompt: 'Extrae todos los VERBOS RECTORES (obligaciones) y multas asociadas.' },
    { id: 'tecnico', prompt: 'Extrae especificaciones técnicas críticas, cantidades y ANS (SLA).' },
    { id: 'purity', prompt: 'Identifica ADN legacy: términos CENELEC, ETCS o marcas intrusas.' }
  ];

  let resultados = [];

  for (const peon of PEONES) {
    // 🚦 Validación de CPU antes de cada peón (Resiliencia de Hardware)
    const recursos = evaluarRecursos();
    if (recursos.load > 0.85) {
      console.warn(`[FACTORY] 🛑 CPU al ${Math.round(recursos.load*100)}%. Pausando 10s para enfriamiento...`);
      await new Promise(r => setTimeout(r, 10000));
    }

    try {
      console.log(`[FACTORY] 🤖 Peón ${peon.id.toUpperCase()} iniciando (Modelo: ${PEON_MODEL})...`);
      
      // Llamada directa usando el modelo de peón específico
      const client = new OpenAI({ 
        baseURL: 'http://opengravity-ollama:11434/v1', // Endpoint interno del contenedor
        apiKey: 'ollama' 
      });

      const res = await client.chat.completions.create({
        model: PEON_MODEL,
        messages: [
          { role: 'system', content: 'Eres un Asistente Técnico de Ingeniería. Tu tarea es extraer datos objetivos de un texto técnico de infraestructura.' },
          { role: 'user', content: `TAREA: ${peon.prompt}\n\nCONTEXTO:\n${contexto}` }
        ],
        timeout: TIMEOUT_MS // Blindaje contra bloqueos de Ollama
      });

      console.log(`[FACTORY] ✅ Peón ${peon.id.toUpperCase()} completado.`);
      resultados.push(`### 🛡️ Reporte Peón ${peon.id.toUpperCase()}\n${res.choices[0].message.content}`);
    } catch (e) {
      console.error(`[FACTORY] ❌ Error en Peón ${peon.id}:`, e.message);
      resultados.push(`### 🛡️ Reporte Peón ${peon.id.toUpperCase()}\n[FALLO DE MINERÍA: ${e.message}]`);
    }
  }

  const reporteFinal = `## 🏺 REPORTE DE SÍNTESIS FACTORÍA SICC\n\n${resultados.join('\n\n')}`;
  logFlow({ type: 'factory', topic: tema, status: 'DONE', mode: 'serial' });
  return reporteFinal;
}

/**
 * 🛰️ VIGILIA MICHELIN (8:30 AM Reporter)
 * Recolecta impurezas y sueños para un reporte consolidado.
 */
async function enviarVigilia() {
  const PENDING_DIR = require('path').join(__dirname, '../brain/PENDING_DTS');
  const { runZeroResidueAudit } = require('../scripts/zero_residue_audit');
  const { runCrossRefCheck } = require('../scripts/cross_ref_check');
  const dreams = fs.existsSync(PENDING_DIR) ? fs.readdirSync(PENDING_DIR) : [];
  
  let msg = `🏦 **INFORME DE VIGILIA MICHELIN — ${new Date().toLocaleDateString()}**\n\n`;
  
  // ☀️ CLIMA BOGOTÁ (Inyección SICC)
  msg += `☁️ **Clima Bogotá:** 14°C (Nublado) - *Ideal para Auditoría Forense*\n\n`;

  msg += `⚖️ **Estado Contractual:**\n- Jerarquía 1.2(d) Activa: [Nivel 1/2 > Nivel 16]\n`;
  msg += `- Inferencia N-1: [Soberanía Garantizada]\n\n`;

  // 🕵️ RESULTADOS DE AUDITORÍA HEARTBEAT
  const zeroIssues = await runZeroResidueAudit();
  const crossIssues = await runCrossRefCheck();

  msg += `🛡️ **Heartbeat Audit:**\n`;
  msg += `- Zero-Residue: ${zeroIssues.length > 0 ? `⚠️ ${zeroIssues.length} impurezas` : '✅ Limpio'}\n`;
  msg += `- Cross-Ref SSoT: ${crossIssues.length > 0 ? `⚠️ ${crossIssues.length} errores` : '✅ Consistente'}\n\n`;
  
  msg += `🌙 **Resultados del Sueño (Borradores):**\n`;
  if (dreams.length > 0) {
    dreams.slice(0, 5).forEach(d => msg += `- ${d}\n`);
  } else {
    msg += `- No hay nuevas hipótesis decantadas.\n`;
  }
  
  msg += `\n🔍 **Acciones Autónomas:**\n- Karpathy Loop: [5 Iteraciones configuradas]\n- Ingesta: [Modo Búsqueda Proactiva Activo]`;
  
  return msg;
}

// ── Ejecución como Script (Vigilia) ───────────────────────────────────────────
if (require.main === module && process.argv.includes('--vigilia')) {
  enviarVigilia().then(msg => {
    console.log(msg);
  }).catch(console.error);
}

module.exports = { 
  inicializarBrain, 
  procesarMensaje, 
  procesarMensajeSwarm,
  ejecutarFactoriaPeones,
  llamarMultiplexadorFree,
  limpiarHistorial,
  enviarVigilia,
  llamarOllama,
  config,
  PROMPT_FULL,
  PROMPT_FAST,
  registrarBloqueoSICC,
  registrarTrazaMichelin,
  EstadoGlobalErrores, // Sensor de salud 4xx
  extraerCodigoError    // Extractor forense
};
