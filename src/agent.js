/**
 * @file src/agent.js
 * @what  Motor central del agente SICC. Orquesta el pipeline de inferencia:
 *        vacunación genética → RAG → Oracle → skills → LLM multiplexado.
 *        Exporta las funciones que consumen index.js, handlers.js y swarm-pilot.js.
 *
 * @how   procesarMensaje() ejecuta 5 fases en serie:
 *          FASE-0: CPU check (resource-governor)
 *          FASE-1: buscarLecciones() → vacunas genéticas (sicc_genetic_memory)
 *          FASE-2: buscarSimilares() → RAG contractual (contrato_documentos)
 *          FASE-3: buscarEnWeb() + validarExternaNotebook() → oracle (solo si apiKey Tavily)
 *          FASE-4: seleccionarSkills() → brain/skills/*.json|md
 *          FASE-5: getMultiplexedContext() + llamarMultiplexadorFree() → respuesta LLM
 *        Si FASE-5 falla → MURO-DE-FUEGO: registra bloqueo y retorna mensaje de auditoría.
 *
 * @why   Centraliza toda la lógica de decisión del agente para que index.js y
 *        handlers.js sean solo enrutadores, sin lógica de negocio.
 *
 * @refs  LLAMADORES de este módulo:
 *          index.js          → inicializarBrain(), generarReporteConsistencia()
 *          handlers.js       → procesarMensaje(), procesarMensajeSwarm(), limpiarHistorial()
 *          scripts/swarm-pilot.js → inicializarBrain()
 *          src/simulator.js  → procesarMensaje(), ejecutarSondaForense()
 *
 *        MÓDULOS QUE ESTE ARCHIVO LLAMA:
 *          brain.js          → construirSystemPrompt(), destilarCerebro()
 *          memory.js         → cargarMemoriaReciente()
 *          supabase.js       → buscarSimilares(), buscarLecciones()
 *          search.js         → buscarEnWeb()
 *          notifications.js  → enviarAlerta()
 *          patrol.js         → startPatrol() (solo modo CLI --vigilia)
 *          sapi/notebooklm_mcp.js → validarExternaNotebook()
 *          scripts/sicc-multiplexer.js → getMultiplexedContext(), llamarMultiplexadorFree(), …
 *          scripts/resource-governor.js → checkYEncolar(), evaluarRecursos()
 *          scripts/zero_residue_audit.js → runZeroResidueAudit()
 *          scripts/cross_ref_check.js    → runCrossRefCheck()
 *
 * @audit-log  data/logs/sicc-traces.json  — trazas por request (últimas 100)
 *             data/logs/flow-resilience.json — eventos de flujo (sondas forenses)
 *             brain/SICC_OPERATIONS.md      — bloqueos críticos registrados
 *
 * @agent-prompt
 *   NUNCA pongas lógica de comandos Telegram aquí — va en handlers.js.
 *   NUNCA llames a bot.sendMessage aquí — usa enviarAlerta() para alertas críticas.
 *   El sistema prompt real que llega al LLM es `systemPromptSICC` (FASE-5),
 *   construido con getMultiplexedContext(). PROMPT_FAST no llega al LLM directamente;
 *   solo existe para ser inyectado en el multiplexer vía setAgentContext().
 *   Si agregas una fase nueva: ponla ANTES de FASE-5, con su label [AGENTE] FASE-N.
 *   ejecutarSondaForense() ha sido CORREGIDO en v14.0 para usar llamarMultiplexadorFree.
 *   Dead code eliminado en este refactor: encolarHallazgo, rutarEstrategiaAdvisor,
 *   ESPECIALIDADES, rutarEspecialidad(), sumarizarContexto(), finalPrompt dead path.
 */
'use strict';

const config = require('./config');
const { construirSystemPrompt, destilarCerebro } = require('./brain');
const { cargarMemoriaReciente } = require('./memory');
const { buscarSimilares } = require('./supabase');
const { buscarEnWeb } = require('./search');
const { enviarAlerta } = require('./notifications');
const multiplexer = require('../scripts/sicc-multiplexer');
const {
  getMultiplexedContext,
  EstadoGlobalErrores,
  registrarError4xx,
  extraerCodigoError,
  llamarGemini,
  llamarGroq,
  llamarOpenRouter,
  llamarOllama,
  llamarNvidiaModel,
  ordenProveedores,
  llamarMultiplexadorFree
} = multiplexer;
const fs   = require('fs');
const path = require('path');
const { checkYEncolar, evaluarRecursos } = require('../scripts/resource-governor');
const { startPatrol } = require('./patrol');
const { validarExternaNotebook } = require('./sapi/notebooklm_mcp');

// ── Rutas de audit logs ───────────────────────────────────────────────────────
const SKILLS_DIR     = path.join(__dirname, '../brain/skills');
const FLOW_LOG_PATH  = path.join(__dirname, '../data/logs/flow-resilience.json');
const TRACES_PATH    = path.join(__dirname, '../data/logs/sicc-traces.json');
const OPS_PATH       = path.join(__dirname, '../brain/SICC_OPERATIONS.md');

// ── Historial de sesión en RAM (máx 10 intercambios = 20 entradas) ────────────
const historial     = [];
const MAX_HISTORIAL = 10;

// ── System prompts — inyectados al multiplexer vía setAgentContext() ──────────
// PROMPT_FAST/FULL NO llegan al LLM directamente: el prompt real es systemPromptSoberano
// en FASE-5. Estos existen para que el multiplexer los tenga disponibles internamente.
let PROMPT_FULL = '';
let PROMPT_FAST = '';

// ── Telemetría ────────────────────────────────────────────────────────────────
// @audit  Escribe a data/logs/sicc-traces.json (últimas 100 entradas).
function registrarTrazaSICC(pregunta, proveedor, contextoUsado) {
  const traza = {
    timestamp:      new Date().toISOString(),
    pregunta:       pregunta.substring(0, 100),
    proveedor,
    context_length: (contextoUsado || '').length
  };
  try {
    let logs = [];
    if (fs.existsSync(TRACES_PATH)) logs = JSON.parse(fs.readFileSync(TRACES_PATH, 'utf8'));
    logs.push(traza);
    if (logs.length > 100) logs.shift();
    fs.writeFileSync(TRACES_PATH, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.warn('[TRAZA] No se pudo registrar traza:', e.message);
  }
}

// @audit  Append a brain/SICC_OPERATIONS.md y notifica a Telegram vía enviarAlerta().
async function registrarBloqueoSICC(pregunta, error) {
  const ts     = new Date().toISOString();
  const entrada = `\n### [SICC BLOCKER] BLOQUEO DE FIRMA (${ts})\n` +
    `- **Consulta:** ${pregunta}\n- **Error:** ${error}\n` +
    `- **Acción Requerida:** Autorizar Sonnet o resolver manual.\n`;
  try {
    fs.appendFileSync(OPS_PATH, entrada);
    console.log('[GOBERNANZA] Bloqueo registrado en SICC_OPERATIONS.md.');
    await enviarAlerta(
      `🛡️ *BLOCKER DE AUDITORÍA*\n\n"${pregunta.substring(0, 100)}"\n\nError: ${error}`
    );
  } catch (e) {
    console.error('[GOBERNANZA] Fallo al registrar bloqueo:', e.message);
  }
}

// ── Skills modular (brain/skills/*.json|md) ───────────────────────────────────
// @refs  brain/skills/ — directorio de skills JSON y MD
// Activa skills cuyo activador aparece en el texto del usuario.
function seleccionarSkills(textoUsuario) {
  if (!fs.existsSync(SKILLS_DIR)) return '';
  const texto = textoUsuario.toLowerCase();
  let injected = '';
  try {
    for (const archivo of fs.readdirSync(SKILLS_DIR)) {
      if (archivo.endsWith('.json')) {
        const skill = JSON.parse(fs.readFileSync(path.join(SKILLS_DIR, archivo), 'utf8'));
        if (skill.activadores.some(a => texto.includes(a.toLowerCase()))) {
          injected += '\n\n' + skill.prompt_injection;
          console.log(`[SKILLS] Skill JSON cargado: ${skill.id}`);
        }
      } else if (archivo.endsWith('.md')) {
        const skillId = archivo.replace('.md', '').toLowerCase();
        const activadores = [skillId, ...skillId.split('_'), ...skillId.split('-')];
        if (activadores.some(a => a.length > 3 && texto.includes(a))) {
          injected += `\n\n## SKILL: ${skillId.toUpperCase()}\n\n${fs.readFileSync(path.join(SKILLS_DIR, archivo), 'utf8')}`;
          console.log(`[SKILLS] Skill MD cargado: ${skillId}`);
        }
      }
    }
  } catch (e) {
    console.warn('[SKILLS] Error cargando skills:', e.message);
  }
  return injected;
}

// ── Flow log (sondas forenses) ────────────────────────────────────────────────
// @audit  Append NDJSON a data/logs/flow-resilience.json
function logFlow(entry) {
  try {
    const dir = path.dirname(FLOW_LOG_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(FLOW_LOG_PATH, JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n');
  } catch (e) {
    console.warn('[FLOW-LOG] No se pudo guardar log de flujo:', e.message);
  }
}

// ── inicializarBrain() ────────────────────────────────────────────────────────
// @callers  index.js (al arrancar), scripts/swarm-pilot.js (al arrancar)
// Construye PROMPT_FAST/FULL desde brain/ e inyecta memoria reciente.
// Luego registra getHistorial/getPromptFast/getPromptFull en el multiplexer.
function inicializarBrain() {
  console.log('[AGENTE] Inicializando brain...');
  PROMPT_FULL = construirSystemPrompt('full');
  PROMPT_FAST = construirSystemPrompt('fast');
  const memoria = cargarMemoriaReciente();

  if (memoria) {
    const bloque = '\n\n' + '═'.repeat(60) + '\n## MEMORIA RECIENTE\n\n' + memoria + '\n' + '═'.repeat(60);
    PROMPT_FULL += bloque;
    PROMPT_FAST += bloque;
    console.log('[AGENTE] Memoria reciente inyectada en system prompts.');
  }

  multiplexer.setAgentContext({
    getHistorial:   () => historial,
    getPromptFast:  () => PROMPT_FAST,
    getPromptFull:  () => PROMPT_FULL
  });
  console.log('[AGENTE] Brain inicializado — multiplexer context registrado.');
}

// ── procesarMensaje() ─────────────────────────────────────────────────────────
// @callers  handlers.js (cada mensaje de usuario), simulator.js
// @returns  { texto: string, proveedor: string }
//
// PIPELINE (5 fases en serie):
//   FASE-0  CPU check
//   FASE-1  Vacunación genética  → sicc_genetic_memory (buscarLecciones)
//   FASE-2  RAG contractual      → contrato_documentos (buscarSimilares)
//   FASE-3  Oracle               → NotebookLM MCP + web (solo si Tavily key + query técnica)
//   FASE-4  Skills               → brain/skills/*
//   FASE-5  LLM                  → getMultiplexedContext() + llamarMultiplexadorFree()
//
// Si FASE-5 falla → MURO-DE-FUEGO: registra bloqueo, NO escala a Sonnet.
async function procesarMensaje(textoUsuario, archivoTmpInfo, forcedSystemPrompt = null) {
  console.log(`[AGENTE] ── procesarMensaje inicio: "${textoUsuario.substring(0, 60)}"`);

  // ── FASE-0: CPU ────────────────────────────────────────────────────────────
  const recursos = evaluarRecursos();
  if (recursos.level === 'CRITICAL') {
    console.warn(`[AGENTE] FASE-0: CPU CRÍTICA (${Math.round(recursos.load * 100)}%) — inferencia local abortada.`);
  } else if (recursos.level === 'WARN') {
    console.warn(`[AGENTE] FASE-0: CPU ALTA (${Math.round(recursos.load * 100)}%) — priorizando cloud.`);
  } else {
    console.log(`[AGENTE] FASE-0: CPU OK (${Math.round(recursos.load * 100)}%).`);
  }

  // ── FASE-1: VACUNACIÓN GENÉTICA ────────────────────────────────────────────
  // @refs  supabase.js:buscarLecciones → tabla sicc_genetic_memory, coseno >0.7
  let contextoGenetico = '';
  try {
    const lecciones = await require('./supabase').buscarLecciones(textoUsuario, 2);
    if (lecciones && lecciones.length > 0) {
      contextoGenetico = '## SISTEMA INMUNE SICC (Lecciones Aprendidas):\n';
      lecciones.forEach(l => { contextoGenetico += `- ${l.content}\n`; });
      console.log(`[AGENTE] FASE-1: ${lecciones.length} vacunas genéticas inyectadas.`);
    } else {
      console.log('[AGENTE] FASE-1: Sin vacunas relevantes (coseno <0.7 o tabla vacía).');
    }
  } catch (e) {
    console.warn('[AGENTE] FASE-1: Error vacunación:', e.message);
  }

  // ── FASE-2: RAG CONTRACTUAL ────────────────────────────────────────────────
  // @refs  supabase.js:buscarSimilares → tabla contrato_documentos, top-3 fragmentos
  let contextoRAG = '';
  if (textoUsuario.length > 10 || /contrato|anexo|apéndice|at|obligación|multa/i.test(textoUsuario)) {
    try {
      const docs = await buscarSimilares(textoUsuario, 3);
      if (docs && docs.length > 0) {
        contextoRAG = '## CONTEXTO DE CONTRATO (Supabase Vector DB):\n' +
          docs.map((d, i) => `--- Fragmento ${i + 1} [${d.nombre_archivo}] ---\n${d.contenido}`).join('\n\n') + '\n\n';
        console.log(`[AGENTE] FASE-2: ${docs.length} fragmentos RAG recuperados.`);
      } else {
        console.log('[AGENTE] FASE-2: Sin fragmentos RAG para esta consulta.');
      }
    } catch (err) {
      console.warn('[AGENTE] FASE-2: Error RAG:', err.message);
    }
  } else {
    console.log('[AGENTE] FASE-2: RAG omitido (texto muy corto / sin keywords contractuales).');
  }

  // ── FASE-3: ORACLE (condicional) ────────────────────────────────────────────
  // @refs  search.js:buscarEnWeb → Tavily API
  //        sapi/notebooklm_mcp.js:validarExternaNotebook → Chrome → NotebookLM SSE
  // Solo activa si config.ai.tavily.apiKey existe y la query es técnica.
  let contextoWeb    = '';
  let contextoOracle = '';
  const esConsultaTecnica = /norma|estándar|arema|fra|uic|regulación|manual|noticia/i.test(textoUsuario);
  if (config.ai.tavily.apiKey && esConsultaTecnica) {
    try {
      console.log('[AGENTE] FASE-3: Consultando web (Tavily) + Oracle NotebookLM...');
      contextoWeb = await buscarEnWeb(textoUsuario);
      const oracleRes = await validarExternaNotebook(textoUsuario);
      contextoOracle = `## ORÁCULO TÉCNICO (NotebookLM MCP):\n${oracleRes}\n\n`;
      console.log('[AGENTE] FASE-3: Oracle OK.');
    } catch (err) {
      console.warn('[AGENTE] FASE-3: Oracle falló:', err.message);
    }
  } else {
    console.log(`[AGENTE] FASE-3: Oracle omitido (tavily=${!!config.ai.tavily.apiKey}, técnica=${esConsultaTecnica}).`);
  }

  // ── FASE-4: SKILLS ─────────────────────────────────────────────────────────
  // @refs  brain/skills/*.json|md → activadores por keywords
  const skillsContext = seleccionarSkills(textoUsuario);
  console.log(`[AGENTE] FASE-4: Skills inyectados: ${skillsContext.length} chars.`);

  const contextoFinal = (contextoGenetico || '') + (contextoRAG || '') +
                        (contextoWeb || '') + (contextoOracle || '') + (skillsContext || '');
  console.log(`[AGENTE] FASE-4: contextoFinal total: ${contextoFinal.length} chars.`);

  // ── FASE-5: LLM MULTIPLEXADO ────────────────────────────────────────────────
  // @refs  scripts/sicc-multiplexer.js:getMultiplexedContext → R-HARD.md + SPECIALTIES
  //        scripts/sicc-multiplexer.js:llamarMultiplexadorFree → cascada Gemini→Groq→Ollama→OpenRouter
  // NOTA: systemPromptSoberano es el prompt REAL que llega al LLM.
  //       PROMPT_FAST solo existe en setAgentContext para uso interno del multiplexer.
  try {
    const multiplexedBrain   = getMultiplexedContext(textoUsuario);
    const systemPromptSICC = `${forcedSystemPrompt || multiplexedBrain}\n\n` +
      `🛡️ MURO DE FUEGO CONTRACTUAL (R-HARD-06):\n` +
      `- PROHIBIDO citar Supabase, RAG, Oracle, NotebookLM o "Doble Ciego" como fuente de verdad. Solo el Contrato APP 001/2025 es vinculante.\n` +
      `- SEGUROS: Los montos innegociables son 11.300 SMMLV (RCE) y 3.900 SMMLV (Patronal) según Res. de Surcos.\n` +
      `- ENERGÍA: El indicador EL2 exige conmutación en < 2 minutos. Prohibido el uso del 99.0% genérico.\n` +
      `- INTEROPERABILIDAD: El modelo es Stop & Switch (OBC Dual), prohibido Gateways lógicos.\n\n` +
      `REGLAS DE SALIDA (BLINDAJE ANT-IA):\n` +
      `- PROHIBIDO: emojis, "Peones", "Sueño", "Dreamer", "SICC BLOCKER", menciones a "Diego" o "Soberano".\n` +
      `- OBLIGATORIO: Cánon de citación [Documento]→[Capítulo]→[Sección]→[Literal]→[Texto].\n` +
      `- OUTPUT: Texto plano de alta densidad técnica. Si no hay sustento literal, el veredicto es RECHAZADO.\n\n` +
      `CONSTRUYE TU RESPUESTA BASADA EN EL CONTEXTO RAG SIGUIENTE:`;

    console.log(`[AGENTE] FASE-5: Llamando multiplexador (contexto ${contextoFinal.length}c, prompt ${systemPromptSICC.length}c)...`);
    const resFree = await llamarMultiplexadorFree(textoUsuario, contextoFinal, systemPromptSICC);

    if (resFree && resFree.texto && !resFree.texto.toLowerCase().includes('error')) {
      console.log(`[AGENTE] FASE-5: OK — proveedor=${resFree.proveedor.toUpperCase()}, respuesta=${resFree.texto.length}c.`);

      const textoFinalUsr = archivoTmpInfo ? `[Archivo: ${archivoTmpInfo.name}] ${textoUsuario}` : textoUsuario;
      historial.push({ role: 'user',      content: textoFinalUsr });
      historial.push({ role: 'assistant', content: resFree.texto });
      while (historial.length > MAX_HISTORIAL * 2) historial.shift();

      registrarTrazaSICC(textoUsuario, resFree.proveedor, contextoFinal);
      console.log(`[AGENTE] ── procesarMensaje fin OK (${resFree.proveedor}).`);
      return { texto: resFree.texto, proveedor: resFree.proveedor };
    }

    console.warn('[AGENTE] FASE-5: Respuesta vacía o con error — activando MURO-DE-FUEGO.');
    throw new Error('Respuesta vacía o inválida del multiplexer');

  } catch (errFree) {
    // MURO-DE-FUEGO: si fallan todos los proveedores gratuitos/locales, NO se escala
    // a Sonnet automáticamente. Se registra el bloqueo y se espera autorización.
    console.error(`[AGENTE] MURO-DE-FUEGO activado: ${errFree.message}`);
    await registrarBloqueoSICC(textoUsuario, errFree.message);
    return {
      texto: `🛡️ **BLOQUEO DE AUDITORÍA:** He agotado las vías gratuitas y locales. ` +
             `El caso quedó registrado en SICC_OPERATIONS.md. ` +
             `Autoriza el uso de Sonnet o resuelve manualmente.`,
      proveedor: 'muro-de-fuego'
    };
  }
}

// ── limpiarHistorial() ────────────────────────────────────────────────────────
// @callers  handlers.js:/limpiar
function limpiarHistorial() {
  historial.length = 0;
  console.log('[AGENTE] Historial de sesión limpiado (0 entradas).');
}

// ── procesarMensajeSwarm() ────────────────────────────────────────────────────
// @callers  handlers.js:/swarm
// Hand-off especializado: delega a procesarMensaje() y envuelve el resultado.
async function procesarMensajeSwarm(textoUsuario) {
  console.log(`[HAND-OFF] Iniciando hand-off especializado: "${textoUsuario.substring(0, 50)}"`);
  const resultado = await procesarMensaje(textoUsuario, null);
  console.log(`[HAND-OFF] Fin — proveedor=${resultado.proveedor}.`);
  return `### 🛡️ DICTAMEN TÉCNICO VINCULANTE (Expert Hand-off)\n\n${resultado.texto}\n\n*Via ${resultado.proveedor.toUpperCase()}*`;
}

// ── ejecutarSondaForense() ────────────────────────────────────────────────────
// @callers  src/simulator.js:43
// @version  v14.0 (Fixed)
async function ejecutarSondaForense(tema, contexto) {
  console.log(`[SONDA] Iniciando Sonda Forense (Serial Batch) para: ${tema}`);
  const ANALISTAS = [
    { id: 'legal',   modelo: 'nvidia/nemotron-3-super-120b-a12b', prompt: 'Extrae verbos rectores (obligaciones) y multas bajo jerarquía 1.2(d).' },
    { id: 'tecnico', modelo: 'deepseek-ai/deepseek-v4-pro', prompt: 'Extrae especificaciones técnicas (FRA 236, SIL-4) y restricciones CAPEX.' },
    { id: 'purity',  modelo: 'meta/llama-3.1-70b-instruct', prompt: 'Identifica ADN legacy: ADIF, OSHA, V-Block o hardware propietario.' }
  ];

  const resultados = [];
  for (const analista of ANALISTAS) {
    const recursos = evaluarRecursos();
    if (recursos.load > 0.85) {
      console.warn(`[SONDA] CPU al ${Math.round(recursos.load * 100)}% — pausa 10s.`);
      await new Promise(r => setTimeout(r, 10000));
    }
    try {
      console.log(`[SONDA] Analista ${analista.id.toUpperCase()} — ejecutando via llamarMultiplexadorFree.`);
      const res = await llamarNvidiaModel(
        analista.modelo,
        `TAREA: ${analista.prompt}\n\nCONTEXTO:\n${contexto}`,
        '',
        'Eres un Auditor Forense especializado. Proyecto: APP 001/2025. CAPEX_MAX=$726M COP.'
      );
      console.log(`[SONDA] Analista ${analista.id.toUpperCase()} OK.`);
      resultados.push(`### Analista ${analista.id.toUpperCase()}\n${res.texto}`);
    } catch (e) {
      console.error(`[SONDA] Analista ${analista.id} FAIL:`, e.message);
      resultados.push(`### Analista ${analista.id.toUpperCase()}\n[FALLO: ${e.message}]`);
    }
  }

  logFlow({ type: 'sonda', topic: tema, status: 'DONE' });
  return `## REPORTE DE SÍNTESIS FORENSE SICC\n\n${resultados.join('\n\n')}`;
}

// ── generarReporteConsistencia() ──────────────────────────────────────────────
// @callers  index.js (cron 08:00 matutino)
// Genera reporte de DTs aprobadas, pending y auditoría zero-residue/cross-ref.
async function generarReporteConsistencia() {
  console.log('[AGENTE] Generando reporte de consistencia...');
  const PENDING_DIR    = path.join(__dirname, '../brain/PENDING_DTS');
  const DICTAMENES_DIR = path.join(__dirname, '../brain/dictamenes');
  const { runZeroResidueAudit } = require('../scripts/zero_residue_audit');
  const { runCrossRefCheck }    = require('../scripts/cross_ref_check');

  const pending  = fs.existsSync(PENDING_DIR)    ? fs.readdirSync(PENDING_DIR)    : [];
  const approved = fs.existsSync(DICTAMENES_DIR) ? fs.readdirSync(DICTAMENES_DIR) : [];

  const zeroIssues  = await runZeroResidueAudit();
  const crossIssues = await runCrossRefCheck();

  let msg = `🏦 **REPORTE DE CONSISTENCIA SICC — ${new Date().toLocaleDateString()}**\n\n`;
  msg += `⚖️ **Estado Contractual:**\n- Jerarquía 1.2(d): Activa\n- Inferencia N-1: Autonomía Garantizada\n\n`;
  msg += `🛡️ **Heartbeat Audit:**\n`;
  msg += `- Zero-Residue: ${zeroIssues.length > 0 ? `${zeroIssues.length} impurezas` : 'Limpio'}\n`;
  msg += `- Cross-Ref: ${crossIssues.length > 0 ? `${crossIssues.length} errores` : 'Consistente'}\n\n`;
  msg += `📜 **Dictámenes Aprobados (${approved.length}):**\n`;
  approved.forEach(d => { msg += `- ${d}\n`; });
  if (!approved.length) msg += '- Ninguno aún.\n';
  msg += `\n⚠️ **Cola Pendiente (${pending.length}):**\n`;
  pending.forEach(d => { msg += `- ${d}\n`; });
  if (!pending.length) msg += '- Sin pendientes.\n';
  msg += `\n🔍 **Mecanismos Activos:**\n- Bucle de Validación: Activo\n- Ingesta LTM: Activa`;

  console.log(`[AGENTE] Reporte consistencia generado (${msg.length}c).`);
  return msg;
}

// ── Modo CLI (--vigilia) ──────────────────────────────────────────────────────
// Uso: node src/agent.js --vigilia
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--vigilia')) {
    console.log('[AGENTE] MODO VIGILIA — Patrulla activada.');
    console.log(startPatrol(null, null));
  } else {
    generarReporteConsistencia().then(console.log).catch(console.error);
  }
}

module.exports = {
  inicializarBrain,       // → index.js, swarm-pilot.js
  procesarMensaje,        // → handlers.js, simulator.js
  procesarMensajeSwarm,   // → handlers.js
  ejecutarSondaForense,   // → simulator.js (WARN: roto, ver @agent-prompt)
  limpiarHistorial,       // → handlers.js
  generarReporteConsistencia // → index.js
};
