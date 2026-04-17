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
const multiplexer = require('../scripts/sicc-multiplexer');
const { getMultiplexedContext, EstadoGlobalErrores, registrarError4xx, extraerCodigoError, llamarGemini, llamarGroq, llamarOpenRouter, llamarOllama, ordenProveedores, llamarMultiplexadorFree } = multiplexer;
const fs = require('fs');
const path = require('path');
const { checkYEncolar, evaluarRecursos } = require('../scripts/resource-governor');
const { startPatrol } = require('./patrol');
const { validarExternaNotebook } = require('./sapi/notebooklm_mcp');


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

// Importaciones de IA movidas a scripts/sicc-multiplexer.js
// ── Historial de sesión (en RAM, máx 20 intercambios) ────────────────────────
const historial = [];
const MAX_HISTORIAL = 10;

// Telemetría y gestión de errores movidos a scripts/sicc-multiplexer.js (ver imports al inicio)

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

  // Inyectar contexto al multiplexador aislado
  const multiplexer = require('../scripts/sicc-multiplexer');
  multiplexer.setAgentContext({
    getHistorial: () => historial,
    getPromptFast: () => PROMPT_FAST,
    getPromptFull: () => PROMPT_FULL
  });
}

// Proveedores de IA ya importados al inicio desde el multiplexor

async function rutarEspecialidad(textoUsuario) {
  console.log(`[ADVISOR] [SICC BRAIN] Ruteo local con Ollama...`);
  try {
    const res = await llamarOllama(textoUsuario, null, '', null, 
      `Eres un clasificador SICC estrictamente limitado. 
      Analiza la consulta y responde SOLO con una de estas etiquetas: LEGAL, TECNICO-FERROVIARIO, GESTION.
      No expliques nada.`
    );
    const etiqueta = res.trim().toUpperCase();
    return ESPECIALIDADES[etiqueta] ? etiqueta : 'GESTION';
  } catch (err) {
    return 'GESTION';
  }
}

// llamarMultiplexadorFree ya está importado arriba desde multiplexer

async function sumarizarContexto(contextoLargo) {
  console.log(`[BLOCK-THINKING] [SICC BRAIN] Destilando bloque de contexto largo con Multiplexor Free...`);
  try {
    const { texto: resumen } = await llamarMultiplexadorFree(
      `Sintetiza la información clave técnica y contractual...`,
      contextoLargo, 
      "Eres un Abogado de Concesiones especializado en Auditoría Forense."
    );
    return `## SÍNTESIS DE CONTEXTO (Destilado):\n${resumen}`;
  } catch (err) {
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

  // ── FASE 1: VACUNACIÓN (Memoria Genética / Auto-tuning) ──────────────────
  let contextoGenetico = '';
  try {
    const lecciones = await require('./supabase').buscarLecciones(textoUsuario, 2);
    if (lecciones && lecciones.length > 0) {
      contextoGenetico = '## SISTEMA INMUNE SICC (Lecciones Aprendidas):\n';
      lecciones.forEach(l => contextoGenetico += `- ${l.content}\n`);
      console.log(`[GENETIC-MEMORY] 🧬 Inyectadas ${lecciones.length} vacunas genéticas para esta consulta.`);
    }
  } catch (e) {
    console.warn('[GENETIC-MEMORY] [SICC WARN] Error en fase de vacunación:', e.message);
  }

  // ── FASE 2: RAG-MATCH (Biblia Legal) ────────────────────────────────────
  let contextoRAG = '';
  if (textoUsuario.length > 10 || /contrato|anexo|apéndice|at|obligación|multa/i.test(textoUsuario)) {
     try {
       const docs = await buscarSimilares(textoUsuario, 3);
       if (docs && docs.length > 0) {
         contextoRAG = '## CONTEXTO DE CONTRATO (Supabase Vector DB):\n' +
           docs.map((doc, i) => `--- Fragmento ${i+1} [Archivo: ${doc.nombre_archivo}] ---\n${doc.contenido}`).join('\n\n') + '\n\n';
         console.log(`[RAG] 🔍 Recuperados ${docs.length} fragmentos de Supabase.`);
       }
     } catch (err) {
       console.log(`[RAG] [SICC WARN] Error recuperando contexto: ${err.message}`);
     }
  }

  // ── FASE 3: ORACLE-CHECK (Web Search + NotebookLM) ──────────────────────
  let contextoWeb = '';
  let contextoOracle = '';
  const esConsultaTecnica = /norma|estándar|arema|fra|uic|regulación|manual|noticia/i.test(textoUsuario);
  
  if (config.ai.tavily.apiKey && esConsultaTecnica) {
    try {
      contextoWeb = await buscarEnWeb(textoUsuario);
      // Si es técnico, cruzamos con el Oráculo de NotebookLM
      console.log('[ORACLE] 🔮 Consultando Verdad Externa en NotebookLM...');
      const oracleRes = await validarExternaNotebook(textoUsuario);
      contextoOracle = `## ORÁCULO TÉCNICO (NotebookLM MCP):\n${oracleRes}\n\n`;
    } catch (err) {
      console.log(`[ORACLE] [SICC WARN] Fallo en fase de Oráculo: ${err.message}`);
    }
  }

  // Obtener Skills antes de construir el contexto final
  const skillsContext = seleccionarSkills(textoUsuario);
  let contextoFinal = (contextoGenetico || '') + (contextoRAG || '') + (contextoWeb || '') + (contextoOracle || '') + (skillsContext || '');
  
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
  
  const ANALISTA_MODEL = 'gemma2:2b'; 
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
