// index.js — Bot Telegram + heartbeat + guardado de memoria persistente
'use strict';

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { inicializarBrain, procesarMensaje, procesarMensajeSwarm, limpiarHistorial, generarReporteConsistencia } = require('./agent');
const { llamarMultiplexadorFree, llamarOllama, EstadoGlobalErrores, extraerCodigoError } = require('../scripts/sicc-multiplexer');
const { cmdDoctor, cmdLearn, cmdAudit } = require('../scripts/sicc-harness');
const { estadoBrain, leerHeartbeat } = require('./brain');
const { guardar, estadoMemoria } = require('./memory');
const { leerNoLeidos, formatearCorreos, enviarCorreo } = require('./gmail');
const { infoRepo, ultimosCommits, issuesAbiertos, listarCarpeta, leerArchivo,
        formatearInfo, formatearCommits, formatearIssues, OWNER, REPO } = require('./github');
const { startPatrol, stopPatrol, getPatrolStatus } = require('./patrol');
const { exec } = require('child_process');
const cron = require('node-cron');
const { obtenerResumenForense } = require('./heartbeat');

console.log('--------------------------------------------------');
console.log('🛡️ SICC GUARDIA ACTIVADA (v7.2 Hyper-Productive)');
console.log('⏰ Lun-Vie: 20:00 - 07:00 (Cada 3h)');
console.log('⏰ Fin de Semana: Vie 17:00 - Lun 07:00 (Cada 4h)');
console.log('--------------------------------------------------');

const DOWNLOADS_DIR = path.join(__dirname, '../data/downloads');
const LOGS_DIR = path.join(__dirname, '../data/logs');
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

/**
 * Envía un mensaje de forma segura, intentando Markdown primero, 
 * y cayendo a texto plano si falla el parseo.
 */
async function safeSendMessage(chatId, text, options = {}) {
  // Telegram tiene un límite de 4096 caracteres. Usamos 3500 para mayor seguridad con meta-data.
  const MAX_LENGTH = 3500;
  
  if (text.length <= MAX_LENGTH) {
    try {
      return await bot.sendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });
    } catch (err) {
      if (err.message.includes('can\'t parse entities')) {
        console.warn('[BOT] [SICC WARN] Error de Markdown, reintentando en texto plano...');
        return await bot.sendMessage(chatId, text, { ...options, parse_mode: undefined });
      }
      throw err;
    }
  }

  // Si es muy largo, dividimos en trozos
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_LENGTH) {
    chunks.push(text.substring(i, i + MAX_LENGTH));
  }
  console.log(`[BOT] 📦 Dividiendo mensaje de ${text.length} chars en ${chunks.length} fragmentos...`);

  for (const [index, chunk] of chunks.entries()) {
    const finalChunk = chunks.length > 1 ? `* [Parte ${index + 1}/${chunks.length}]*\n${chunk}` : chunk;
    try {
      await bot.sendMessage(chatId, finalChunk, { ...options, parse_mode: 'Markdown' });
      console.log(`[BOT] [SICC OK] Fragmento ${index + 1}/${chunks.length} enviado.`);
    } catch (err) {
      console.warn(`[BOT] [SICC WARN] Fallo Markdown en fragmento ${index + 1}, reintentando plano...`);
      await bot.sendMessage(chatId, finalChunk, { ...options, parse_mode: undefined });
    }
    // Pequeño delay para no saturar el polling de Telegram
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// ── Inicializar brain + memoria al arrancar ───────────────────────────────────
inicializarBrain();

// 🔍 VERIFICACIÓN DE CONECTIVIDAD IA AL ARRANQUE (Doble Factor Sovereign)
(async () => {
    try {
        console.log('[STARTUP] 📡 Verificando conectividad IA...');
        
        // Verificación 1: Primario (Gemini/Ollama)
        const test1 = await llamarMultiplexadorFree('ping', null, 'Responde solo con la palabra PONG');
        
        // Verificación 2: Alternativo (OpenRouter si está configurado)
        let statusOR = 'N/A';
        if (config.ai.openrouter.apiKey) {
            try {
                // llamarOpenRouter ya está importado arriba desde el multiplexor (línea 9)
                statusOR = '[SICC OK]';
            } catch (e) { statusOR = '[SICC FAIL]'; }
        }

        if (test1 && test1.texto) {
            console.log(`[STARTUP] [SICC OK] Conectividad IA verificada vía ${test1.proveedor.toUpperCase()} | OpenRouter: ${statusOR}`);
        }
    } catch (err) {
        const code = extraerCodigoError(err);
        const label = code ? `(Error ${code})` : '';
        console.warn(`[STARTUP] [SICC WARN] Advertencia de conectividad IA ${label}:`, err.message);
        if (code === 402) console.error('[STARTUP] [SICC BLOCKER] BLOQUEO DE CUOTA (402) DETECTADO AL INICIO.');
    }
})();

const bot = new TelegramBot(config.telegram.token, { polling: true });
console.log(`[BOT] 🤖 ${config.agent.name} iniciado (v8.7). Esperando mensajes de Telegram...`);
console.log(`[BOT] 🔒 Solo responde al usuario ID: ${config.telegram.userId}`);

// ── Heartbeat periódico (cada 30 minutos) ─────────────────────────────────────
// HEARTBEAT REDUNDANTE ELIMINADO V9.13

// ── Programador de Tareas Interno (Unificación de Autonomía) ────────────────
const BOGOTA_TZ = 'America/Bogota';

// 1. Vigilia Michelin (08:00 AM) - Reporte Consolidado Institucional Dinámico
cron.schedule('00 08 * * *', async () => {
  console.log('[CRON] 🛰️ Iniciando Reporte de Consistencia Soberana (8:00 AM)...');
  try {
    const { pool } = require('./supabase');
    const { execSync } = require('child_process');
    
    // Obtener Clima Dinámico
    let climaReal = '14°C (Nublado)';
    try {
        climaReal = execSync('curl -s "https://wttr.in/Bogota?format=3"', { encoding: 'utf8' }).trim();
    } catch (e) { console.warn('[CRON] Error obteniendo clima'); }

    // Obtener Conteo de Brain
    let brainCount = 'Desconocido';
    try {
        const res = await pool.query('SELECT count(*) FROM contrato_documentos');
        brainCount = res.rows[0].count;
    } catch (e) { console.warn('[CRON] Error obteniendo conteo de fragmentos'); }

    const resumenAudit = await obtenerResumenForense();
    const msgConsistencia = await generarReporteConsistencia();
    
    const reporteCompleto = `[SICC CYCLE] *REPORTE MATUTINO SICC — ${new Date().toLocaleDateString()}*\n\n` +
      `🌤️ *Clima:* ${climaReal}\n` +
      `[SICC BRAIN] *Brain Pureness:* ${brainCount} fragmentos\n\n` +
      `${resumenAudit.crossRefReporte}\n` +
      `${resumenAudit.zeroResidueReporte}\n\n` +
      `--- \n` +
      `🔍 *Estado de Vigilancia:* ${resumenAudit.statusGeneral === 'HEALTHY' ? '🟢 Óptimo' : '🟡 Requiere Revisión'}\n\n` +
      `🛰️ *Dictamen de Consistencia SICC:*\n${msgConsistencia}`;

    await safeSendMessage(config.telegram.userId, reporteCompleto);
    console.log('[CRON] [SICC OK] Reporte Institucional dinámico enviado.');
  } catch (err) {
    console.error('[CRON] [SICC FAIL] Error en Reporte Matutino:', err.message);
  }
}, { timezone: BOGOTA_TZ });

// 2. Ciclo de Auditoría Forense (SICC Simulator v12.0)
const ejecutarCicloAuditoria = () => {
  console.log('[CRON] 🛡️ Iniciando ciclo de auditoría forense (Ingesta + Validación Soberana)...');
  const docPath = '/app/repos/LFC2/docs/00_Referencia_Normativa_Contractual_LFC/';
  const cmdIngesta = `node src/ingest_masivo.js "${docPath}" >> data/logs/ingesta_biblia.log 2>&1`;
  const cmdSimulator = `node src/simulator.js "SICC" >> data/logs/simulator.log 2>&1`;

  exec(`${cmdIngesta} && ${cmdSimulator}`, (error) => {
    if (error) {
      console.error('[CRON] [SICC FAIL] Error en ciclo de auditoría:', error.message);
    } else {
      console.log('[CRON] [SICC OK] Ciclo de auditoría completado.');
    }
  });
};

// A. Vigilia Nocturna (Lun-Jue): 8PM, 11PM, 2AM, 5AM
// cron.schedule('0 20,23,02,05 * * 1-4', ejecutarCicloNocturno, { timezone: BOGOTA_TZ });

// B. MISIÓN INFINITA (Fin de Semana - Inicia Viernes 4PM)
// cron.schedule('0 16,20,00 * * 5', ejecutarCicloNocturno, { timezone: BOGOTA_TZ }); // Viernes Early Surge
// cron.schedule('0 */04 * * 6,0', ejecutarCicloNocturno, { timezone: BOGOTA_TZ }); // Sáb-Dom Continuo (cada 4h)
// cron.schedule('0 02,05 * * 1', ejecutarCicloNocturno, { timezone: BOGOTA_TZ });   // Cierre Lunes AM

// 3. Backup Automatizado SICC (06:00 AM) - Después de la Guardia
cron.schedule('00 06 * * *', () => {
  console.log('[BACKUP] 📂 Iniciando respaldo soberano SICC (06:00 AM)...');
  exec(`bash scripts/sicc-backup.sh`, async (error, stdout, stderr) => {
    if (error) {
      console.error('[BACKUP] [SICC FAIL] Error en backup:', error.message);
      await safeSendMessage(config.telegram.userId, `[SICC BLOCKER] *FALLO DE RESPALDO SICC*\n\nError: ${error.message}`);
    } else {
      console.log('[BACKUP] [SICC OK] Respaldo completado exitosamente.');
      // Omitimos mensaje diario para reducir ruido, solo logueamos. Si falla, avisará.
    }
  });
}, { timezone: BOGOTA_TZ });

// ── Registro de Salud Institucional (cada hora) [TAREA 2] ─────────────────────
cron.schedule('0 * * * *', async () => {
  console.log('[HEALTH] 🩺 Generando latido horario...');
  const timestamp = new Date().toISOString();
  const logPath = path.join(LOGS_DIR, 'health.log');
  
  try {
    const resumen = await obtenerResumenForense();
    const brainStatus = estadoBrain().replace(/\n/g, ' | ');
    
    // Telemetría 4xx Integrada
    const err4xxCount = Object.entries(EstadoGlobalErrores.conteos)
      .map(([code, count]) => `[${code}]: ${count}`).join(', ') || 'None';

    const logEntry = `[${timestamp}] ❤️ STATUS: ${resumen.statusGeneral} | IA: ${config.ai.primaryProvider} | 4xx: ${err4xxCount} | ${resumen.clima} | ${resumen.crossRefReporte.trim().replace(/\n/g, ' ')} | ${resumen.zeroResidueReporte.trim().replace(/\n/g, ' ')}\n`;

    fs.appendFileSync(logPath, logEntry);
    console.log('[HEALTH] [SICC OK] Registro forense guardado en health.log.');
  } catch (err) {
    console.error(`[HEALTH] [SICC FAIL] Error en el latido horario: ${err.message}`);
  }
}, { timezone: BOGOTA_TZ });

// ── Monitor de Bloqueos Críticos (Inmediato ante fallo) ─────────────────────
setInterval(async () => {
  if (EstadoGlobalErrores.bloqueos.size > 0) {
    const list = Array.from(EstadoGlobalErrores.bloqueos).join(', ');
    console.error(`[GUARD] [SICC BLOCKER] EVENTO CRÍTICO DETECTADO: ${list}`);
    await safeSendMessage(config.telegram.userId, 
      `[SICC BLOCKER] *SICC CRITICAL EVENT*\n\nSe ha detectado un bloqueo de infraestructura (${list}).\nEl sistema requiere atención inmediata para continuar la misión.`
    );
    EstadoGlobalErrores.bloqueos.clear();
  }
}, 30 * 60 * 1000); // Revisión cada 30 min alineada con Heartbeat

// ── Mensajes de Telegram ──────────────────────────────────────────────────────

// --- GOBERNANZA KARPATHY DREAMER ---
bot.onText(/^\/dream(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  if (msg.chat.id.toString() !== "1567740382") return;
  const target = match[1] || "LFC2 General";
  
  bot.sendMessage(chatId, `?? **Modo Sue?o Iniciado**\nEl enjambre est? analizando: *${target}*\nUsando: C?mara Doble Ciego (Supabase + NotebookLM)\nObserva los logs del contenedor para detalles...`, { parse_mode: 'Markdown' });
  
  // Importamos y corremos el script en background
  const { exec } = require('child_process');
  exec(`node /home/administrador/docker/agente/scripts/swarm-pilot.js "${target}"`, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      bot.sendMessage(chatId, `? **Pesadilla (Error Interno):**\n${error.message}`);
      return;
    }
    const logStr = stdout.toString();
    const veredictoMatch = logStr.match(/VEREDICTO FINAL AL DESPERTAR:[\\s\\S]*/);
    let resumen = "El sue?o concluy?.";
    if (veredictoMatch) {
       resumen = veredictoMatch[0].substring(0, 1500) + '...';
    }
    bot.sendMessage(chatId, `? **Sue?o Finalizado (${target})**\n\n${resumen}`);
  });
});

bot.on('message', async (msg) => {
  if (!msg.text) return;
  const _texto = msg.text.trim();
  // Ignorar comandos gestionados en onText o obsoletos
  if (_texto.startsWith('/dream') || _texto === '/swarm') return;

  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  const texto  = msg.text;

  console.log(`[BOT] 📩 Recibido de ${userId} (Esperado: ${config.telegram.userId}): "${texto ? texto.substring(0, 50) : '(sin texto)'}"`);

  if (userId !== config.telegram.userId) {
    console.warn(`[BOT] 🛡️ Mensaje ignorado de usuario no autorizado: ${userId}`);
    return;
  }

  if (!texto) {
    await bot.sendMessage(chatId, '📎 Por ahora solo proceso texto.');
    return;
  }

  // ── Comandos ──────────────────────────────────────────────────────────────
  if (texto === '/start' || texto === '/hola') {
    await safeSendMessage(chatId,
      `👋 ¡Hola Diego! Soy *${config.agent.name}* (SICC Simulator).\n\n` +
      `[SICC BRAIN] Cerebro · 💾 Memoria · 📧 Gmail · 🐙 GitHub\n\n` +
      `*/doctor* · */learn* · */audit [ruta]*\n` +
      `*/ollama [prompt]* — Hablar directo con IA Local\n` +
      `*/cmd [comando]* — Ejecutar Shell (ej. docker ps)\n\n` +
      `*/correos* · */email para|asunto|msg*\n` +
      `*/git repo* · */git commits* · */git issues*\n` +
      `*/git ls [ruta]* · */git cat archivo*\n\n` +
      `🛰️ **Patrulla Forense (v12.0-Manual):**\n` +
      `*/ingesta [ruta]* — Ingerir PDFs manualmente\n` +
      `*/audit_run* — Forzar ciclo de auditoría\n` +
      `*/patrol_on* — Activar Patrulla 24/7\n` +
      `*/patrol_off* — Detener Patrulla\n` +
      `*/patrol_status* — Estado del simulador`
    );
    return;
  }

  // ── Comando SWARM (DBCD Forensic Debate) ───────────────────────────────────
  if (texto.startsWith('/swarm ')) {
    const pregunta = texto.replace('/swarm ', '').trim();
    if (!pregunta) {
      await bot.sendMessage(chatId, '🐝 Uso: `/swarm ¿Cómo sanar la Red Vital IP?`', { parse_mode: 'Markdown' });
      return;
    }

    await safeSendMessage(chatId, '🐝 *Iniciando Enjambre Secuencial...*\n\nEstamos consultando al Auditor Forense y al Estratega SICC. Esto tomará ~10 minutos (SICC Hard-Cap activo).');
    await bot.sendChatAction(chatId, 'typing');

    try {
      const respuestaDebate = await procesarMensajeSwarm(pregunta);
      guardar(texto, respuestaDebate, 'SICC-SWARM');
      await safeSendMessage(chatId, respuestaDebate);
      console.log(`[BOT] [SICC OK] Swarm completado para: "${pregunta.substring(0, 30)}..."`);
    } catch (err) {
      console.error(`[BOT] [SICC FAIL] Error en Swarm: ${err.message}`);
      await safeSendMessage(chatId, `[SICC FAIL] Error en el Enjambre: ${err.message}`);
    }
    return;
  }

  // ── Comando DOCTOR (SICC Health Check nativo) ───────────────────────────────
  if (texto === '/doctor') {
    await safeSendMessage(chatId, '🩺 *Ejecutando SICC Doctor...*');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const oldLog = console.log;
      const oldWarn = console.warn;
      const lines = [];
      console.log = (...a) => { oldLog(...a); lines.push(a.join(' ')); };
      console.warn = (...a) => { oldWarn(...a); lines.push(a.join(' ')); };
      const score = await cmdDoctor();
      console.log = oldLog;
      console.warn = oldWarn;
      const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
      const reporte = `🩺 *SICC Doctor — Health Report*\n\n` +
        `${emoji} *Score: ${score}/100*\n\n` +
        `\`\`\`\n${lines.slice(-12).join('\n')}\n\`\`\``;
      guardar(texto, `Score: ${score}/100`, 'SYSTEM');
      await safeSendMessage(chatId, reporte);
    } catch (err) {
      await safeSendMessage(chatId, `[SICC FAIL] Error en Doctor: ${err.message}`);
    }
    return;
  }

  // ── Comando DREAM (Estado del Dreamer) ─────────────────────────────────────
  if (texto === '/dream') {
    const dreamsPath = path.join(__dirname, '../brain/DREAMS.md');
    const dtsPath    = path.join(__dirname, '../brain/PENDING_DTS.md');
    const dreams = fs.existsSync(dreamsPath)
      ? (fs.readFileSync(dreamsPath, 'utf8').match(/^- \[(?!DONE)/gm) || []).length : 0;
    const dts = fs.existsSync(dtsPath)
      ? (fs.readFileSync(dtsPath, 'utf8').match(/^## DT-DREAM/gm) || []).length : 0;
    const msg = `[SICC SLEEP] *SICC Dreamer — Estado*\n\n` +
      `⏳ *${dreams}* hipótesis en cola para el ciclo nocturno\n` +
      `📋 *${dts}* borradores de DT pendientes de aprobación\n\n` +
      `El Dreamer ejecuta a las *2:00 AM* con el Hard-Cap de CPU activo.`;
    await safeSendMessage(chatId, msg);
    return;
  }

  // ── Comando LEARN (Auto-mapeo recursivo) ───────────────────────────────────
  if (texto === '/learn') {
    await safeSendMessage(chatId, '[SICC BRAIN] *SICC Brain: Inicia aprendizaje recursivo...*');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const oldLog = console.log;
      const lines = [];
      console.log = (...a) => { oldLog(...a); lines.push(a.join(' ')); };
      cmdLearn();
      console.log = oldLog;
      const resumen = lines.slice(-5).join('\n');
      guardar(texto, resumen, 'SYSTEM');
      await safeSendMessage(chatId, `[SICC OK] *Aprendizaje Completado*\n\n\`\`\`\n${resumen}\n\`\`\``);
    } catch (err) {
      await safeSendMessage(chatId, `[SICC FAIL] Error en Learn: ${err.message}`);
    }
    return;
  }

  // ── Comando KARPATHY (Auditoría Autónoma proactiva) ───────────────────────
  if (texto.startsWith('/karpathy ')) {
    const tema = texto.replace('/karpathy ', '').trim();
    if (!tema) {
      await safeSendMessage(chatId, '🔬 Uso: `/karpathy Ingeniería Eléctrica`');
      return;
    }

    await safeSendMessage(chatId, `🔬 *SICC Karpathy — Iniciando Auditoría proactiva sobre:* \`${tema}\`...\nEstoy explorando archivos y buscando impurezas en el repositorio.`);
    await bot.sendChatAction(chatId, 'typing');

    try {
      // 1. Búsqueda inteligente (Ignora "Ingeniería" y normaliza acentos)
      let keyword = tema.toLowerCase().includes('ingeniería') ? tema.split(' ').slice(1).join(' ') : tema;
      // Normalizar: quitar acentos para la búsqueda en archivos
      const normalizedKeyword = keyword.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const findCmd = `find ${config.paths.lfc2} -iname "*${normalizedKeyword}*" | grep -v "/old/" | head -5`;
      
      exec(findCmd, async (err, stdout) => {
        const archivos = stdout.trim();
        let rutaAuditar = config.paths.lfc2;
        
        if (!archivos) {
          await safeSendMessage(chatId, `[SICC WARN] No se encontraron archivos específicos para: \`${keyword}\`. Auditando raíz...`);
        } else {
          await safeSendMessage(chatId, `📂 *Archivos localizados:*\n\`\`\`\n${archivos}\n\`\`\``);
          rutaAuditar = archivos.split('\n')[0];
        }

        // 2. Ejecutar Auditoría capturando salida
        const oldLog = console.log;
        const lines = [];
        console.log = (...a) => { oldLog(...a); lines.push(a.join(' ')); };
        cmdAudit(rutaAuditar);
        console.log = oldLog;

        const resumenAudit = lines.join('\n').substring(0, 3000);
        await safeSendMessage(chatId, `🔬 *Dictamen Karpathy:* \n\n\`\`\`\n${resumenAudit}\n\`\`\``);
        await safeSendMessage(chatId, `[SICC OK] *Proceso completado.* Los hallazgos se han registrado en el cerebro.`);
      });
    } catch (err) {
      await safeSendMessage(chatId, `[SICC FAIL] Error en Protocolo Karpathy: ${err.message}`);
    }
    return;
  }

  // ── Comando AUDIT (Karpathy Loop manual) ───────────────────────────────────
  if (texto.startsWith('/audit ')) {
    const ruta = texto.replace('/audit ', '').trim();
    if (!ruta) {
      await safeSendMessage(chatId, '[SICC WARN] Uso: `/audit IV_Ingenieria_basica`');
      return;
    }
    await safeSendMessage(chatId, `🔬 *Iniciando Auditoría Forense en:* \`${ruta}\`...`);
    await bot.sendChatAction(chatId, 'typing');
    try {
      const oldLog = console.log;
      const lines = [];
      console.log = (...a) => { oldLog(...a); lines.push(a.join(' ')); };
      cmdAudit(ruta);
      console.log = oldLog;
      const resumenAudit = lines.join('\n').substring(0, 3000);
      guardar(texto, `Resultados de auditoría en ${ruta}`, 'SYSTEM');
      await safeSendMessage(chatId, `🔬 *Resultados de la Auditoría:* \n\n\`\`\`\n${resumenAudit}\n\`\`\``);
    } catch (err) {
      await safeSendMessage(chatId, `[SICC FAIL] Error en Audit: ${err.message}`);
    }
    return;
  }

  // ── Comando OLLAMA (Inferencia Local Soberana) ────────────────────────────
  if (texto.startsWith('/ollama ')) {
    const prompt = texto.replace('/ollama ', '').trim();
    if (!prompt) return;
    await safeSendMessage(chatId, '🖥️ *Ollama Local:* Pensando...');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const resultado = await llamarOllama(prompt);
      await safeSendMessage(chatId, `🖥️ *Ollama_v7.0:*\n\n${resultado}`);
    } catch (err) {
      await safeSendMessage(chatId, `[SICC FAIL] Error en Ollama: ${err.message}`);
    }
    return;
  }

  // ── Comando CMD (Ejecución Terminal) ──────────────────────────────────────
  if (texto.startsWith('/cmd ')) {
    const comando = texto.replace('/cmd ', '').trim();
    if (!comando) return;
    await safeSendMessage(chatId, `💻 *Ejecutando:* \`${comando}\``);
    exec(comando, { timeout: 15000 }, async (error, stdout, stderr) => {
      let output = stdout || stderr || 'Sin salida.';
      if (error) output += `\nError: ${error.message}`;
      const preview = output.substring(0, 3000);
      await safeSendMessage(chatId, `\`\`\`bash\n${preview}\n\`\`\``);
    });
    return;
  }

  // ── Comando INGESTA (Manual Demand) ───────────────────────────────────────
  if (texto.startsWith('/ingesta ')) {
    const ruta = texto.replace('/ingesta ', '').trim();
    if (!ruta) {
      await bot.sendMessage(chatId, '📝 Uso: `/ingesta /ruta/de/pdfs`');
      return;
    }
    await safeSendMessage(chatId, `🚀 *Iniciando Ingesta bajo demanda en:* \`${ruta}\`...\nEsto puede tardar varios minutos.`);
    await bot.sendChatAction(chatId, 'upload_document');
    
    exec(`node scripts/sicc-ingesta.js --path "${ruta}"`, (error, stdout, stderr) => {
      if (error) {
        bot.sendMessage(chatId, `❌ *Error en Ingesta:* ${error.message}`);
      } else {
        const out = stdout.split('\n').slice(-5).join('\n');
        safeSendMessage(chatId, `✅ *Ingesta Finalizada*\n\n\`\`\`\n${out}\n\`\`\``);
      }
    });
    return;
  }

  // ── Comando AUDIT_RUN (Auditor Manual) ─────────────────────────────────────────
  if (texto === '/audit_run') {
    await safeSendMessage(chatId, '🛡️ *Activando Motor de Auditoría Forense...*');
    await bot.sendChatAction(chatId, 'typing');
    
    exec(`node scripts/sicc-harness.js audit --force`, (error, stdout, stderr) => {
      if (error) {
        bot.sendMessage(chatId, `❌ *Error en Auditor:* ${error.message}`);
      } else {
        const out = stdout.split('\n').slice(-5).join('\n');
        safeSendMessage(chatId, `🛡️ *Ciclo de Auditoría Finalizado*\n\n\`\`\`\n${out}\n\`\`\``);
      }
    });
    return;
  }

  // ── Comandos de Patrulla v9.6.1 (Dreamer) ──────────────────────────────────
  if (texto === '/dream_on') {
    const res = startPatrol(bot, chatId);
    await safeSendMessage(chatId, res);
    return;
  }

  if (texto === '/dream_off') {
    const res = stopPatrol();
    await safeSendMessage(chatId, res);
    return;
  }

  if (texto === '/dream_status') {
    const st = getPatrolStatus();
    const emoji = st.active ? '🛰️' : '🛑';
    await safeSendMessage(chatId, 
      `${emoji} *Estatus de Patrulla SICC*\n\n` +
      `• Estado: ${st.active ? '*ACTIVA*' : '*DETENIDA*'}\n` +
      `• Carpeta Actual: \`#${st.folderIndex + 1}\`\n` +
      `• Carga CPU: ${st.cpu}%\n\n` +
      `📝 _${st.msg}_`
    );
    return;
  }


  // ── Comandos GitHub ───────────────────────────────────────────────────────
  if (texto.startsWith('/git ')) {
    const args = texto.replace('/git ', '').trim().split(' ');
    const sub  = args[0];
    await bot.sendChatAction(chatId, 'typing');
    try {
      if (sub === 'repo') {
        const info = await infoRepo();
        await bot.sendMessage(chatId, formatearInfo(info), { parse_mode: 'Markdown' });

      } else if (sub === 'commits') {
        const commits = await ultimosCommits(5);
        await bot.sendMessage(chatId,
          `🔀 *Últimos commits — ${OWNER}/${REPO}*\n\n${formatearCommits(commits)}`,
          { parse_mode: 'Markdown' }
        );

      } else if (sub === 'issues') {
        const issues = await issuesAbiertos(5);
        await bot.sendMessage(chatId,
          `🐛 *Issues abiertos — ${OWNER}/${REPO}*\n\n${formatearIssues(issues)}`,
          { parse_mode: 'Markdown' }
        );

      } else if (sub === 'ls') {
        const ruta = args.slice(1).join(' ') || '';
        const items = await listarCarpeta(ruta);
        await bot.sendMessage(chatId,
          `📁 *${REPO}/${ruta || '(raíz)'}*\n\n${items.join('\n')}`,
          { parse_mode: 'Markdown' }
        );

      } else if (sub === 'cat') {
        const archivo = args.slice(1).join(' ');
        if (!archivo) { await bot.sendMessage(chatId, '[SICC WARN] Uso: `/git cat ruta/archivo`', { parse_mode: 'Markdown' }); return; }
        const contenido = await leerArchivo(archivo);
        const preview = contenido.substring(0, 3000);
        await bot.sendMessage(chatId,
          `📄 *${archivo}*\n\`\`\`\n${preview}${contenido.length > 3000 ? '\n...(truncado)' : ''}\n\`\`\``,
          { parse_mode: 'Markdown' }
        );

      } else {
        await bot.sendMessage(chatId, '[SICC WARN] Sub-comandos: `repo` · `commits` · `issues` · `ls [ruta]` · `cat archivo`', { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error(`[GITHUB] [SICC FAIL] ${err.message}`);
      await safeSendMessage(chatId, `[SICC FAIL] Error GitHub: ${err.message}`);
    }
    return;
  }

  if (texto === '/correos') {
    await bot.sendChatAction(chatId, 'typing');
    try {
      const correos = await leerNoLeidos(5);
      const resumen = formatearCorreos(correos);
      await safeSendMessage(chatId,
        `📧 *Correos no leídos — dieleozagent@gmail.com*\n\n${resumen}`
      );
    } catch (err) {
      console.error(`[GMAIL] [SICC FAIL] ${err.message}`);
      await bot.sendMessage(chatId, `[SICC FAIL] Error al leer Gmail: ${err.message}`);
    }
    return;
  }

  if (texto.startsWith('/email ')) {
    // Formato: /email destinatario|asunto|mensaje
    const partes = texto.replace('/email ', '').split('|');
    if (partes.length < 3) {
      await bot.sendMessage(chatId,
        '[SICC WARN] Formato: `/email destinatario@correo.com|Asunto|Mensaje`',
        { parse_mode: 'Markdown' }
      );
      return;
    }
    await bot.sendChatAction(chatId, 'typing');
    try {
      await enviarCorreo({ para: partes[0].trim(), asunto: partes[1].trim(), cuerpo: partes[2].trim() });
      await bot.sendMessage(chatId, `[SICC OK] Correo enviado a *${partes[0].trim()}*`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(`[GMAIL] [SICC FAIL] ${err.message}`);
      await bot.sendMessage(chatId, `[SICC FAIL] Error al enviar: ${err.message}`);
    }
    return;
  }

  if (texto === '/limpiar') {
    limpiarHistorial();
    await bot.sendMessage(chatId, '🧹 Historial de sesión limpiado.');
    return;
  }

  if (texto === '/estado') {
    await safeSendMessage(chatId,
      `📊 *Estado de ${config.agent.name}*\n\n` +
      `• Proveedor: *${config.ai.primaryProvider}*\n` +
      `• Gemini: ${config.ai.gemini.apiKey ? '[SICC OK]' : '[SICC FAIL]'}\n` +
      `• Groq: ${config.ai.groq.apiKey ? '[SICC OK]' : '[SICC FAIL]'}\n` +
      `• OpenRouter: ${config.ai.openrouter.apiKey ? '[SICC OK]' : '[SICC FAIL]'}\n\n` +
      `💾 ${estadoMemoria()}`
    );
    return;
  }

  if (texto === '/cerebro') {
    await safeSendMessage(chatId,
      `[SICC BRAIN] *Archivos del cerebro:*\n\n${estadoBrain()}`
    );
    return;
  }

  if (texto === '/memoria') {
    await safeSendMessage(chatId,
      `💾 *Memoria persistente:*\n\n${estadoMemoria()}\n\n` +
      `📁 Ubicación: \`/home/administrador/data-agente/memory/\``
    );
    return;
  }

  // ── Procesar con IA y guardar en memoria ──────────────────────────────────
  console.log(`[BOT] 📨 "${texto.substring(0, 60)}"`);
  await bot.sendChatAction(chatId, 'typing');

  try {
    const { texto: respuesta, proveedor } = await procesarMensaje(texto, null);
    guardar(texto, respuesta, proveedor);
    await safeSendMessage(chatId, respuesta);
    console.log(`[BOT] [SICC OK] Respondido con ${proveedor}`);
  } catch (err) {
    console.error(`[BOT] [SICC FAIL] ${err.message}`);
    await safeSendMessage(chatId, '[SICC WARN] Error inesperado. Revisa los logs.');
  }
});

// ── Manejo de Documentos y Fotos ──────────────────────────────────────────────
async function procesarArchivo(msg, msgTipo) {
  const chatId = msg.chat.id;
  if (String(msg.from.id) !== config.telegram.userId) return;

  const fileId = msgTipo === 'photo' ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id;
  const fileName = msgTipo === 'photo' ? `photo_${fileId}.jpg` : msg.document.file_name;
  const mimeType = msgTipo === 'photo' ? 'image/jpeg' : msg.document.mime_type;
  const caption = msg.caption || 'Analiza este archivo.';

  await bot.sendMessage(chatId, '📥 Descargando archivo...');
  await bot.sendChatAction(chatId, 'typing');

  try {
    // Descargar a local
    const subPath = await bot.downloadFile(fileId, DOWNLOADS_DIR);
    console.log(`[BOT] 📥 Archivo descargado en: ${subPath}`);

    const archivoTmpInfo = { path: subPath, name: fileName, mimeType };

    // Procesar con la IA
    const { texto: respuesta, proveedor } = await procesarMensaje(caption, archivoTmpInfo);
    
    // Limpieza local
    fs.unlinkSync(subPath);

    guardar(`[Archivo: ${fileName}] ${caption}`, respuesta, proveedor);
    await safeSendMessage(chatId, respuesta);
    
  } catch (err) {
    console.error(`[BOT] [SICC FAIL] Error procesando archivo: ${err.message}`);
    await safeSendMessage(chatId, '[SICC WARN] Error analizando el archivo asegúrate de que sea un PDF/Imagen soportado por Gemini.');
  }
}

bot.on('document', (msg) => procesarArchivo(msg, 'document'));
bot.on('photo',    (msg) => procesarArchivo(msg, 'photo'));

bot.on('polling_error', (err) => console.error(`[BOT] [SICC FAIL] Polling: ${err.message}`));
process.on('SIGTERM', () => { bot.stopPolling(); process.exit(0); });
process.on('SIGINT',  () => { bot.stopPolling(); process.exit(0); });
