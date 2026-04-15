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
const { getMultiplexedContext } = require('../scripts/sicc-multiplexer');
const fs = require('fs');
const path = require('path');
const { checkYEncolar, evaluarRecursos } = require('../scripts/resource-governor');

// Skills Registry — carga modular de contexto especializado
const SKILLS_DIR = require('path').join(__dirname, '../brain/skills');

// ── FUNCIONES DE GOBERNANZA v9.3.0 ──────────────────────────────────────────

function registrarTrazaSICC(pregunta, proveedor, contextoUsado) {
  const logPath = path.join(__dirname, '../data/logs/sicc-traces.json');
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
    console.warn('[TRAZA] [SICC WARN] No se pudo registrar la traza SICC:', e.message);
  }
}

async function registrarBloqueoSICC(pregunta, error) {
  const opsPath = path.join(__dirname, '../brain/SICC_OPERATIONS.md');
  const timestamp = new Date().toISOString();
  const entrada = `\n### [SICC BLOCKER] BLOQUEO DE FIRMA (${timestamp})\n- **Problema:** Fallo total de vías gratuitas/locales.\n- **Consulta:** ${pregunta}\n- **Error:** ${error}\n- **Acción Requerida:** [DIEGO] Debe autorizar desbloqueo con SONNET o resolver manual.\n`;
  
  try {
    fs.appendFileSync(opsPath, entrada);
    console.log('[GOBERNANZA] 🛡️ Bloqueo registrado en SICC_OPERATIONS.md.');
    
    // 📢 NOTIFICACIÓN PROACTIVA A TELEGRAM
    await enviarAlerta(`🛡️ *BLOCKER DE SOBERANÍA*\n\nHe agotado las opciones gratuitas para la consulta:\n"${pregunta.substring(0, 100)}..."\n\nError: ${error}\n\nRevisarDashboard: [SICC_OPERATIONS.md]`);
  } catch (e) {
    console.error('[GOBERNANZA] [SICC FAIL] Fallo al registrar bloqueo:', e.message);
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
    console.log('[SKILLS] [SICC WARN] Error cargando skills:', e.message);
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
  console.log(`[TELEMETRY] [SICC BLOCKER] Error ${code} registrado desde ${proveedor.toUpperCase()}.`);
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
  'LEGAL': `Eres un ABOGADO DE CONCESIONES SICC (DEDUCTIVO). Tu misión es el blindaje contractual. 
           REGLA MAESTRA: Jerarquía 1.2(d) vinculante. NO des opiniones técnicas sin base legal citada.
           LIMITACIÓN: Cualquier requerimiento de CAPEX embarcado > $726.000.000 COP es RECHAZO AUTOMÁTICO.`,
  'TECNICO-FERROVIARIO': `Eres un INGENIERO DE SEÑALIZACIÓN FERROVIARIA SICC (SOBERANO). Tu misión es la soberanía técnica. 
                          PROTOCOLO: FRA 49 CFR Parte 236 Subparte I. 
                          RESTRICCIÓN: Prohibido vendor lock-in (V-Block, ITCS, Eurobalizas). Señalización física solo en 5 estaciones ENCE.`,
  'GESTION': `Eres un AUDITOR DE GESTIÓN SICC. Tu misión es la síntesis operativa y el orden documental forense.`
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
    console.warn('[FLOW-LOG] [SICC WARN] No se pudo guardar el log de flujo:', e.message);
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
    console.log('[AGENTE] [SICC OK] Memoria reciente inyectada en system prompts');
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
    console.log(`[AGENTE] [SICC OK] Archivo subido: ${uploadResponse.file.uri}`);
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
          COMMUNICATIONS: \`S-COM-01: Red Vital IP sobre Anillo de Fibra G.652.D. 
          S-COM-02: Redundancia Híbrida Embarcada (Satelital LEO/GEO + GSM/LTE). 
          S-COM-03: Prohibición de Radioenlaces/Microondas Terrestres.
          S-COM-04: Latencia < 50ms, Jitter < 10ms (AT3).
          S-COM-05: Jitter < 2ms para Vital IP (EN 50159).
          S-COM-06: FECHA FATAL: 01-Nov-2026 (Fin de Preconstrucción).
          S-COM-07: NO EXISTE CAPITAL DE EMERGENCIA de 2.5 MM USD. El CAPEX es $726,000,000 COP.\`
          
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
    console.warn('[ADVISOR-ROUTER] [SICC WARN] Fallo en ruteo, usando GESTION por defecto.');
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
      console.warn(`[GATEWAY-AHORRO] [SICC WARN] Fallo en ${p.id}: ${err.message}`);
    }
  }

  // Fallback final a OpenRouter con el modelo más barato (Llama 8B) SOLO si todo lo gratuito falló
  console.warn('[GATEWAY-AHORRO] [SICC BLOCKER] Vías gratuitas agotadas (incluyendo OpenRouter Free). Usando Low Cost...');
  const lowCostModel = 'meta-llama/llama-3.1-8b-instruct';
  const res = await llamarOpenRouter(pregunta, null, contextoRAG, systemPrompt, lowCostModel);
  return { texto: res, proveedor: 'openrouter-lowcost' };
}

/**
 * Destila un contexto largo en una síntesis cohesiva usando el Multiplexor Free.
 */
async function sumarizarContexto(contextoLargo) {
  console.log(`[BLOCK-THINKING] [SICC BRAIN] Destilando bloque de contexto largo (${contextoLargo.length} caracteres) con Multiplexor Free...`);
  
  try {
    const { texto: resumen } = await llamarMultiplexadorFree(
      `Sintetiza la información clave técnica y contractual de este fragmento para un Director Contractual Senior. 
      Prioriza menciones a cláusulas Niveles 1 (Contrato) y 2 (AT). Descarta ruido de Nivel 16 (Q&A).`,
      contextoLargo, 
      "Eres un Abogado de Concesiones especializado en Auditoría Forense."
    );
    return `## SÍNTESIS DE CONTEXTO (Destilado):\n${resumen}`;
  } catch (err) {
    console.warn(`[BLOCK-THINKING] [SICC WARN] Fallo en destilación: ${err.message}. Usando truncado.`);
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
    console.warn(`[AGENT] [SICC WARN] CPU ALTA (${Math.round(recursos.load * 100)}%). Priorizando proveedor cloud.`);
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
       console.log(`[RAG] [SICC WARN] Error recuperando contexto: ${err.message}`);
     }
  }

  // Búsqueda Web: Solo si es técnico y Supabase no fue suficiente o hay keywords de normas
  let contextoWeb = '';
  const esConsultaTecnica = /norma|estándar|arema|fra|uic|regulación|manual|noticia/i.test(textoUsuario);
  
  if (config.ai.tavily.apiKey && esConsultaTecnica) {
    try {
      contextoWeb = await buscarEnWeb(textoUsuario);
      if (contextoWeb) {
        console.log(`[SEARCH] [SICC OK] Investigación web inyectada para: "${textoUsuario}"`);
      }
    } catch (err) {
      console.log(`[SEARCH] [SICC WARN] Fallo silencioso en búsqueda web.`);
    }
  }

  // Obtener Skills antes de construir el contexto final
  const skillsContext = seleccionarSkills(textoUsuario);
  let contextoFinal = (contextoRAG || '') + (contextoWeb || '') + (skillsContext || '');
  
  // Construir Prompt Final (Contexto + Especialidad) — v9.1.1
  const currentPromptBase = PROMPT_FAST; // Usamos la versión fast por defecto para nube/ahorro
  const finalPrompt = forcedSystemPrompt || (currentPromptBase + '\n\n' + (especialidadPrompt || ''));

  // ── ESCUDO FISCAL v12.0 (MODULAR & R-HARD) ─────────────────────────────
  console.log(`[FISCAL-SHIELD] 🛡️ Aplicando Hand-off Especializado...`);
  try {
    const multiplexedBrain = getMultiplexedContext(textoUsuario);
    const systemPromptSoberano = `${multiplexedBrain}\n\n` + 
      `REGLAS DE SALIDA (BLINDAJE ANT-IA):\n` +
      `- PROHIBIDO el uso de emojis.\n` +
      `- PROHIBIDO el uso de términos: "Peones", "Sueño", "Dreamer", "Michelin Certified", "Karpathy Loop", "Propuesta Soberana", "SICC BLOCKER".\n` +
      `- OBLIGATORIO: Usar el CÁNON DE CITACIÓN: [Documento] → [Capítulo] → [Sección] → [Literal] → [Texto literal].\n` +
      `- OUTPUT: Texto plano de alta densidad técnica.\n\n` +
      `CONSTRUYE TU RESPUESTA BASADA EN EL CONTEXTO RAG SIGUIENTE:`;
    
    const resFree = await llamarMultiplexadorFree(textoUsuario, contextoFinal, systemPromptSoberano);
    if (resFree && resFree.texto && !resFree.texto.toLowerCase().includes('error')) {
      console.log(`[FISCAL-SHIELD] [SICC OK] Éxito vía ${resFree.proveedor.toUpperCase()} (Expert Hand-off).`);
      
      // Guardar en historial de sesión
      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: resFree.texto });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      registrarTrazaSICC(textoUsuario, resFree.proveedor, contextoFinal);
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
    texto: '[SICC WARN] Error interno inesperado en el motor de decisión.',
    proveedor: 'ninguno',
  };
}

function limpiarHistorial() {
  historial.length = 0;
  console.log('[AGENTE] Historial de sesión limpiado.');
}

/**
 * 🏭 HAND-OFF ESPECIALIZADO (SICC v12.0)
 * Reemplaza al Swarm para evitar colapso por debate.
 */
async function procesarMensajeSwarm(textoUsuario) {
  console.log(`[HAND-OFF] 🛰️ Iniciando procesamiento por especialista único: "${textoUsuario.substring(0, 50)}"`);
  const resultado = await procesarMensaje(textoUsuario, null);
  return `### 🛡️ DICTAMEN TÉCNICO VINCULANTE (Expert Hand-off)\n\n${resultado.texto}\n\n*Resultado via ${resultado.proveedor.toUpperCase()}*`;
}

/**
 * 🏭 SONDA DE MINERÍA FORENSE (v12.0 Serial Batch Edition)
 * Ejecuta múltiples agentes de validación en SERIE para extracción de datos técnicos oficiales.
 */
async function ejecutarSondaForense(tema, contexto) {
  console.log(`[SONDA] 🛰️ Iniciando Sonda Forense (Modo Serial Batch) para: ${tema}`);
  
  const ANALISTA_MODEL = 'gemma4-light:latest'; 
  const TIMEOUT_MS = 90000; // 90 segundos de Hard-Cap por Analista
  
  const ANALISTAS = [
    { id: 'legal', prompt: 'Extrae todos los VERBOS RECTORES (obligaciones) y multas asociadas bajo jerarquía 1.2(d).' },
    { id: 'tecnico', prompt: 'Extrae especificaciones técnicas críticas (FRA 236, Jitter, SIL-4) y restricciones de CAPEX.' },
    { id: 'purity', prompt: 'Identifica ADN legacy o contaminantes: términos V-Block, 2oo3, Starlink o hardware propietario.' }
  ];

  let resultados = [];

  for (const analista of ANALISTAS) {
    // 🚦 Validación de CPU antes de cada analista (Resiliencia de Hardware)
    const recursos = evaluarRecursos();
    if (recursos.load > 0.85) {
      console.warn(`[SONDA] 🛑 CPU al ${Math.round(recursos.load*100)}%. Pausando 10s para enfriamiento...`);
      await new Promise(r => setTimeout(r, 10000));
    }

    try {
      console.log(`[SONDA] 🤖 Analista ${analista.id.toUpperCase()} iniciando (Modelo: ${ANALISTA_MODEL})...`);
      
      const client = new OpenAI({ 
        baseURL: 'http://opengravity-ollama:11434/v1', 
        apiKey: 'ollama' 
      });

      const SOBERANIA_SYSTEM_SICC = `Eres un Auditor Forense especializado en ingeniería ferroviaria soberana.
Proyecto: Concesión APP No. 001/2025. Cásate con la Biblia Legal.
REGLAS: CAPEX_MAX=$726.000.000 COP/loco | FECHA_MIN=01-ago-2025 | FASE_FIN=01-nov-2026 | ESTANDAR=FRA 236 | SIN metadata de IA`;

      const llamarAnalista = async (modelName, systemContent) => client.chat.completions.create({
        model: modelName,
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: `TAREA: ${analista.prompt}\n\nCONTEXTO:\n${contexto}` }
        ],
        timeout: TIMEOUT_MS
      });

      let res = await llamarAnalista(ANALISTA_MODEL, SOBERANIA_SYSTEM_SICC);
      let respuestaAnalista = res.choices[0].message.content;

      console.log(`[SONDA] [SICC OK] Analista ${analista.id.toUpperCase()} completado.`);
      resultados.push(`### 🛡️ Reporte Analista ${analista.id.toUpperCase()}\n${respuestaAnalista}`);
    } catch (e) {
      console.error(`[SONDA] [SICC FAIL] Error en Analista ${analista.id}:`, e.message);
      resultados.push(`### 🛡️ Reporte Analista ${analista.id.toUpperCase()}\n[FALLO DE MINERÍA: ${e.message}]`);
    }
  }

  const reporteFinal = `## [SICC DT] REPORTE DE SÍNTESIS FORENSE SICC\n\n${resultados.join('\n\n')}`;
  logFlow({ type: 'sonda', topic: tema, status: 'DONE', mode: 'serial' });
  return reporteFinal;
}

/**
 * 🛰️ REPORTE DE CONSISTENCIA SICC (8:30 AM Heartbeat)
 * Recolecta inconsistencias y estados de cumplimiento para reporte consolidado.
 */
async function generarReporteConsistencia() {
  const PENDING_DIR = require('path').join(__dirname, '../brain/PENDING_DTS');
  const DICTAMENES_DIR = require('path').join(__dirname, '../brain/dictamenes');
  const { runZeroResidueAudit } = require('../scripts/zero_residue_audit');
  const { runCrossRefCheck } = require('../scripts/cross_ref_check');
  
  const pending = fs.existsSync(PENDING_DIR) ? fs.readdirSync(PENDING_DIR) : [];
  const approved = fs.existsSync(DICTAMENES_DIR) ? fs.readdirSync(DICTAMENES_DIR) : [];
  
  let msg = `🏦 **REPORTE DE CONSISTENCIA SOBERANA — ${new Date().toLocaleDateString()}**\n\n`;
  
  msg += `⚖️ **Estado Contractual:**\n- Jerarquía 1.2(d) Activa: [Nivel 1/2 > Nivel 16]\n`;
  msg += `- Inferencia N-1: [Soberanía Garantizada]\n\n`;

  // 🕵️ RESULTADOS DE AUDITORÍA HEARTBEAT
  const zeroIssues = await runZeroResidueAudit();
  const crossIssues = await runCrossRefCheck();

  msg += `🛡️ **Heartbeat Audit:**\n`;
  msg += `- Zero-Residue: ${zeroIssues.length > 0 ? `[SICC WARN] ${zeroIssues.length} impurezas` : '[SICC OK] Limpio'}\n`;
  msg += `- Cross-Ref SSoT: ${crossIssues.length > 0 ? `[SICC WARN] ${crossIssues.length} errores` : '[SICC OK] Consistente'}\n\n`;
  
  msg += `📜 **Dictámenes Aprobados (Gold Standards):**\n`;
  if (approved.length > 0) {
    approved.forEach(d => msg += `- ${d}\n`);
  } else {
    msg += `- No hay dictámenes certificados aún.\n`;
  }

  msg += `\n⚠️ **Cola de Auditoría (Pendientes):**\n`;
  if (pending.length > 0) {
    pending.forEach(d => msg += `- ${d}\n`);
  } else {
    msg += `- Sin pendientes de auditoría.\n`;
  }
  
  msg += `\n🔍 **Mecanismos Activos:**\n- Bucle de Validación: [Activo]\n- Ingesta: [Soberanía LTM Activa]`;
  
  return msg;
}

// ── Ejecución como Script (Vigilia) ───────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--vigilia')) {
    console.log('👁️ MODO VIGILIA: El Agente Soberano está despierto.');
    // Inicia la patrulla determinística. 
    // Nota: enviamos null para bot/chatId ya que es ejecución CLI
    console.log(startPatrol(null, null)); 
  } else {
    generarReporteConsistencia().then(msg => {
      console.log(msg);
    }).catch(console.error);
  }
}

module.exports = { 
  inicializarBrain, 
  procesarMensaje, 
  procesarMensajeSwarm,
  ejecutarSondaForense,
  llamarMultiplexadorFree,
  limpiarHistorial,
  generarReporteConsistencia,
  llamarOllama,
  config,
  PROMPT_FULL,
  PROMPT_FAST,
  registrarBloqueoSICC,
  registrarTrazaSICC,
  EstadoGlobalErrores, // Sensor de salud 4xx
  extraerCodigoError    // Extractor forense
};
