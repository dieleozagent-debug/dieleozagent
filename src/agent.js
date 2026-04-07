// agent.js — Lógica del agente con brain + memoria persistente inyectada al system prompt
'use strict';

const config = require('./config');
const { construirSystemPrompt } = require('./brain');
const { cargarMemoriaReciente } = require('./memory');
const { buscarSimilares } = require('./supabase');
const { buscarEnWeb } = require('./search');
const { checkYEncolar, evaluarRecursos } = require('../scripts/resource-governor');

// Skills Registry — carga modular de contexto especializado
const SKILLS_DIR = require('path').join(__dirname, '../brain/skills');
const fs = require('fs');

function seleccionarSkills(textoUsuario) {
  if (!fs.existsSync(SKILLS_DIR)) return '';
  const texto = textoUsuario.toLowerCase();
  let injected = '';
  try {
    const archivos = fs.readdirSync(SKILLS_DIR).filter(f => f.endsWith('.json'));
    for (const archivo of archivos) {
      const skill = JSON.parse(fs.readFileSync(require('path').join(SKILLS_DIR, archivo), 'utf8'));
      const match = skill.activadores.some(a => texto.includes(a.toLowerCase()));
      if (match) {
        injected += '\n\n' + skill.prompt_injection;
        console.log(`[SKILLS] 🎯 Skill cargado: ${skill.id}`);
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
  
  let systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

  // Modo seguro: Si el prompt es demasiado grande, truncamos para evitar errores de payload
  if (systemInstruction.length > 30000) {
    console.warn(`[AGENTE] ⚠️ System Prompt muy grande (${systemInstruction.length}). Truncando a 30k chars.`);
    systemInstruction = systemInstruction.substring(0, 30000) + '\n... [TRUNCADO POR SEGURIDAD]';
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

async function llamarGroq(mensajeUsuario, _, contextoRAG = '') {
  const groq = new Groq({ apiKey: config.ai.groq.apiKey });
  
  let systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

  // Modo seguro
  if (systemInstruction.length > 30000) {
    systemInstruction = systemInstruction.substring(0, 30000) + '\n... [TRUNCADO POR SEGURIDAD]';
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

async function llamarOllama(mensajeUsuario, _, contextoRAG = '', historialLocal = null) {
  const client = new OpenAI({
    baseURL: `${config.ai.ollama.host}/v1`,
    apiKey: 'ollama', 
  });
  
  const systemInstruction = contextoRAG 
    ? SYSTEM_PROMPT + '\n\n' + contextoRAG 
    : SYSTEM_PROMPT;

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
}

// ── Selección de proveedor con fallback automático ────────────────────────────

function ordenProveedores() {
  const todos = [
    { id: 'ollama',     fn: llamarOllama,     habilitado: !!config.ai.ollama.host },
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
  console.log(`[AGENTE] 📋 Orden de proveedores calculado: ${res.map(p => p.id).join(' -> ')}. Tamaño System Prompt: ${SYSTEM_PROMPT.length} chars.`);
  return res;
}

/**
 * Procesa un mensaje y retorna { texto, proveedor }. Acepta archivo opcional.
 */
async function procesarMensaje(textoUsuario, archivoTmpInfo) {
  const proveedores = ordenProveedores();
  
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

  const skillsContext = seleccionarSkills(textoUsuario);
  const contextoFinal = (contextoRAG || '') + (contextoWeb || '') + (skillsContext || '');

  for (const proveedor of proveedores) {
    try {
      // Saltar Ollama si CPU está crítica — dejar que fallen los proveedores y caiga al cloud
      if (recursos.level === 'CRITICAL' && proveedor.id === 'ollama') {
        console.log('[AGENT] ⏭️ Saltando Ollama por CPU crítica → fallback a cloud.');
        continue;
      }

      // Solo Gemini soporta File API en nuestra config actual
      if (archivoTmpInfo && proveedor.id !== 'gemini') {
        console.log(`[AGENTE] ⏭️ Saltando ${proveedor.id} porque hay un archivo adjunto.`);
        continue;
      }

      console.log(`[AGENTE] Usando proveedor: ${proveedor.id}`);
      const respuesta = await proveedor.fn(textoUsuario, archivoTmpInfo, contextoFinal);

      // Guardar en historial de sesión (sin el archivo para simplificar memoria larga)
      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: respuesta    });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      return { texto: respuesta, proveedor: proveedor.id };
    } catch (err) {
      console.error(`[AGENTE] ❌ ERROR en ${proveedor.id}:`, err.message || err);
      // Log profundo del error
      try {
        const errorDetail = err.response ? JSON.stringify(err.response.data || err.response) : JSON.stringify(err);
        console.error(`[AGENTE] 🔍 Detalle del error completo:`, errorDetail);
      } catch (e) {
        console.error(`[AGENTE] 🔍 No se pudo serializar el error:`, err);
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

/**
 * 🐝 SWARM SECUENCIAL (SICC v6.3.3)
 * Debate multi-agente forense ejecutado de forma secuencial para proteger el host.
 */
async function procesarMensajeSwarm(textoUsuario) {
  console.log(`[SWARM] 🐝 Iniciando debate forense secuencial: "${textoUsuario.substring(0, 50)}"`);
  
  const AGENTES_SWARM = [
    {
      nombre: 'AUDITOR FORENSE',
      rol: 'Identificar impurezas técnicas, terminología legacy y riesgos de soberanía (N-1).',
      prompt: 'Eres el AUDITOR FORENSE SICC. Tu misión es desenterrar impurezas y fallos en la propuesta del usuario.'
    },
    {
      nombre: 'ESTRATEGA SICC',
      rol: 'Proponer soluciones soberanas, optimización de CAPEX y blindaje contractual.',
      prompt: 'Eres el ESTRATEGA SICC. Tu misión es tomar los hallazgos del Auditor y proponer una solución final blindada.'
    }
  ];

  let debateBuffer = `🐝 **DEBATE SICC SWARM — PROTOCOLO .42**\n\n`;
  let contextoPrevio = `Pregunta Inicial: ${textoUsuario}\n\n`;

  for (const [index, agente] of AGENTES_SWARM.entries()) {
    console.log(`[SWARM] 🤖 Agente ${index + 1}/2: ${agente.nombre} en proceso...`);
    
    const promptAgente = `[MODO SWARM - ROL: ${agente.nombre}]\n${agente.prompt}\n\nREGLAS: Responde de forma concisa pero letal.\n\n${contextoPrevio}`;
    
    try {
      // Usamos llamarOllama directamente con un historial local para no contaminar la sesión general
      const respuesta = await llamarOllama(promptAgente, null, '', []);
      
      debateBuffer += `🎭 **${agente.nombre}**\n${respuesta}\n\n---\n\n`;
      contextoPrevio += `Respuesta de ${agente.nombre}:\n${respuesta}\n\n`;
      
      // Delay de seguridad entre agentes para liberar CPU
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(`[SWARM] ❌ Error en ${agente.nombre}:`, err.message);
      debateBuffer += `⚠️ **${agente.nombre}** falló: ${err.message}\n\n`;
    }
  }

  return debateBuffer + `🏁 **FIN DEL PROCESO SWARM**`;
}

module.exports = { 
  inicializarBrain, 
  procesarMensaje, 
  procesarMensajeSwarm,
  limpiarHistorial,
  llamarOllama,
  config,
  SYSTEM_PROMPT
};
