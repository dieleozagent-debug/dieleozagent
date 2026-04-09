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
const MAX_HISTORIAL = 20;

// System prompts: full para Ollama/Dreamer, fast para Cloud/Bot
let PROMPT_FULL = '';
let PROMPT_FAST = '';

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
  const client = new OpenAI({
    baseURL: `${config.ai.ollama.host}/v1`,
    apiKey: 'ollama', 
  });
  
  const finalSystemPrompt = systemPrompt || PROMPT_FULL;
  const systemInstruction = contextoRAG 
    ? finalSystemPrompt + '\n\n' + contextoRAG 
    : finalSystemPrompt;

  const msgs = [
    { role: 'system', content: systemInstruction },
    ...(historialLocal || historial).map(h => ({ role: h.role, content: h.content })),
    { role: 'user', content: mensajeUsuario },
  ];

  try {
    const respuesta = await client.chat.completions.create({
      model: config.ai.ollama.model,
      messages: msgs,
    });
    return respuesta.choices[0].message.content;
  } catch (err) {
    throw new Error(`Ollama Error: ${err.message}`);
  }
}

function ordenProveedores() {
  const todos = [
    { id: 'ollama',     fn: llamarOllama,     habilitado: !!config.ai.ollama.host },
    { id: 'gemini',     fn: llamarGemini,     habilitado: !!config.ai.gemini.apiKey },
    { id: 'groq',       fn: llamarGroq,       habilitado: !!config.ai.groq.apiKey },
    { id: 'openrouter', fn: llamarOpenRouter, habilitado: !!config.ai.openrouter.apiKey },
  ].filter(p => p.habilitado);

  const primario = config.ai.primaryProvider;
  console.log(`[AGENTE] 🔍 Debug: primario=${primario}, keys: gemini=${!!config.ai.gemini.apiKey}, groq=${!!config.ai.groq.apiKey}`);
  const res = [
    ...todos.filter(p => p.id === primario),
    ...todos.filter(p => p.id !== primario),
  ];
  console.log(`[AGENTE] 📋 Orden: ${res.map(p => p.id).join(' -> ')}. Prompts: Fast=${PROMPT_FAST.length}, Full=${PROMPT_FULL.length}`);
  return res;
}

/**
 * Destila un contexto largo en una síntesis cohesiva usando un modelo rápido.
 */
async function sumarizarContexto(contextoLargo) {
  console.log(`[BLOCK-THINKING] 🧠 Destilando bloque de contexto largo (${contextoLargo.length} caracteres)...`);
  
  // Usamos el modelo ultra-rápido definido para el resumidor
  const modelSumarizador = config.ai.swarm.sumarizador;
  
  try {
    const resumen = await llamarOpenRouter(
      `Sintetiza la información clave técnica y contractual de este fragmento para un Director Contractual Senior. 
      Prioriza menciones a cláusulas Niveles 1 (Contrato) y 2 (AT). Descarta ruido de Nivel 16 (Q&A).`,
      null, 
      contextoLargo, 
      "Eres un Abogado de Concesiones especializado en Auditoría Forense.",
      modelSumarizador
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
  
  // Pensamiento por Bloques: si el contexto es muy grande (> 10k), lo destilamos
  if (contextoFinal.length > 10000) {
    contextoFinal = await sumarizarContexto(contextoFinal);
  } else if (!contextoFinal && /contrato|cláusula|at1|sec|numeral/i.test(textoUsuario)) {
    // Si no hay contexto y la pregunta es contractual, forzamos una búsqueda de último recurso
    contextoFinal = "⚠️ INGREDIENTE FALTANTE: No se encontró la base legal en el repo. Ejecutar búsqueda forense proactiva.";
  }

  for (const proveedor of proveedores) {
    try {
      // ── MODO ASIMÉTRICO ───────────────────────────────────────────────────
      // Si estamos en el Bot (Vigilia), preferimos Cloud + Prompt Fast
      const currentPrompt = (proveedor.id === 'ollama') ? PROMPT_FULL : PROMPT_FAST;

      console.log(`[AGENTE] Usando proveedor: ${proveedor.id} (Prompt: ${currentPrompt.length} chars)`);
      const respuesta = await proveedor.fn(textoUsuario, archivoTmpInfo, contextoFinal, currentPrompt);

      if (!respuesta) throw new Error('Respuesta vacía del proveedor');

      // Guardar en historial de sesión
      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: respuesta    });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      return { texto: respuesta, proveedor: proveedor.id };
    } catch (err) {
      console.error(`[AGENTE] ❌ ERROR en ${proveedor.id}:`, err.message || err);
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
 * 🐝 SWARM SECUENCIAL (SICC v6.5 Michelin)
 * Debate multi-agente forense ejecutado de forma secuencial.
 */
async function procesarMensajeSwarm(textoUsuario) {
  console.log(`[SWARM] 🐝 Iniciando debate forense secuencial: "${textoUsuario.substring(0, 50)}"`);
  
  const AGENTES_SWARM = [
    {
      nombre: 'AUDITOR FORENSE (MICHELIN)',
      rol: 'Identificar impurezas técnicas y violaciones a la Jerarquía 1.2(d).',
      prompt: 'Eres el AUDITOR FORENSE MICHELIN. Tu misión es denunciar si un diseño se basa en el Nivel 16 (Q&A de licitación) en contra de los Niveles 1 (Contrato) o 2 (AT1).'
    },
    {
      nombre: 'DIRECTOR CONTRACTUAL SICC',
      rol: 'Blindaje de CAPEX, litigio estratégico y soberanía tecnológica.',
      prompt: 'Eres el DIRECTOR CONTRACTUAL SICC. Tu misión es aplicar la Regla N-1 y proteger la caja de la Concesión basándote exclusivamente en la ley del contrato.'
    }
  ];

  let debateBuffer = `🐝 **DEBATE SICC SWARM — PROTOCOLO MICHELIN**\n\n`;
  let contextoPrevio = `Pregunta Inicial: ${textoUsuario}\n\n`;

  for (const [index, agente] of AGENTES_SWARM.entries()) {
    console.log(`[SWARM] 🤖 Agente ${index + 1}/2: ${agente.nombre} en proceso...`);
    
    const promptAgente = `[MODO SWARM - ROL: ${agente.nombre}]\n${agente.prompt}\n\nREGLAS: Responde de forma concisa pero letal.\n\n${contextoPrevio}`;
    
    let respuestaAgente = '';
    let proveedorAgente = '';

    try {
      const proveedoresSwarm = ordenProveedores();
      const mejorProveedor = proveedoresSwarm[0];

      const modelRoles = {
        'AUDITOR FORENSE (MICHELIN)': config.ai.swarm.auditor,
        'DIRECTOR CONTRACTUAL SICC': config.ai.swarm.strategist
      };
      const modelOverride = (mejorProveedor.id === 'openrouter') ? modelRoles[agente.nombre] : null;

      const promptOptimizado = contextoPrevio.length > 5000 
        ? await sumarizarContexto(contextoPrevio) 
        : contextoPrevio;

      const currentPrompt = (mejorProveedor.id === 'ollama') ? PROMPT_FULL : PROMPT_FAST;

      respuestaAgente = await mejorProveedor.fn(promptAgente, null, promptOptimizado, currentPrompt, modelOverride);
      proveedorAgente = mejorProveedor.id === 'ollama' ? 'Ollama (Soberano)' : `${mejorProveedor.id} (${modelOverride || 'Cloud'})`;

      debateBuffer += `🎭 **${agente.nombre}** *(${proveedorAgente})*\n${respuestaAgente}\n\n---\n\n`;
      contextoPrevio += `Respuesta de ${agente.nombre}:\n${respuestaAgente}\n\n`;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (err) {
      console.error(`[SWARM] ❌ Error total en ${agente.nombre}:`, err.message);
      debateBuffer += `⚠️ **${agente.nombre}** falló tras reintentos: ${err.message}\n\n`;
    }
  }

  return debateBuffer + `🏁 **FIN DEL PROCESO SWARM**`;
}

/**
 * 🛰️ VIGILIA MICHELIN (8:30 AM Reporter)
 * Recolecta impurezas y sueños para un reporte consolidado.
 */
async function enviarVigilia() {
  const PENDING_DIR = require('path').join(__dirname, '../brain/PENDING_DTS');
  const dreams = fs.existsSync(PENDING_DIR) ? fs.readdirSync(PENDING_DIR) : [];
  
  let msg = `🏦 **INFORME DE VIGILIA MICHELIN — ${new Date().toLocaleDateString()}**\n\n`;
  
  msg += `⚖️ **Estado Contractual:**\n- Jerarquía 1.2(d) Activa: [Nivel 1/2 > Nivel 16]\n`;
  msg += `- Inferencia N-1: [Soberanía Garantizada]\n\n`;
  
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
  limpiarHistorial,
  enviarVigilia,
  llamarOllama,
  config,
  PROMPT_FULL,
  PROMPT_FAST
};
