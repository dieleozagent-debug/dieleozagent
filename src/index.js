/**
 * @file src/index.js
 * @what  Punto de entrada del bot. Inicializa brain, bot Telegram, crons y el
 *        lanzador /audit. NO contiene lógica de comandos.
 * @how   Importa safeSendMessage (utils/send.js) y los handlers (handlers.js),
 *        crea el helper `send` ligado al bot, registra eventos bot.on/onText,
 *        y programa 3 crons (reporte 08:00, backup 06:00, health/hora).
 * @why   Separar bootstrap/infraestructura de la lógica de comandos evita el
 *        monolito de 790 líneas y facilita leer el flujo de arranque.
 * @refs  handlers.js — toda la lógica de comandos Telegram
 *        utils/send.js — safeSendMessage con chunking y fallback Markdown
 *        scripts/swarm-pilot.js — ejecutado por exec() para /audit
 *        scripts/sicc-harness.js — cron de auditoría (audit_run)
 *        agent.js — inicializarBrain(), generarReporteConsistencia()
 *        heartbeat.js — obtenerResumenForense() para cron matutino
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cron = require('node-cron');
const TelegramBot = require('node-telegram-bot-api');

const config = require('./config');
const { inicializarBrain, generarReporteConsistencia } = require('./agent');
const { llamarMultiplexadorFree, EstadoGlobalErrores, extraerCodigoError } = require('../scripts/sicc-multiplexer');
const { estadoBrain } = require('./brain');
const { obtenerResumenForense } = require('./heartbeat');
const { safeSendMessage } = require('./utils/send');
const { handleMessage, handleFile } = require('./handlers');

// ── Dirs ──────────────────────────────────────────────────────────────────────
const DOWNLOADS_DIR = path.join(__dirname, '../data/downloads');
const LOGS_DIR = path.join(__dirname, '../data/logs');
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

// ── Brain init ────────────────────────────────────────────────────────────────
inicializarBrain();

// ── Startup IA check ──────────────────────────────────────────────────────────
(async () => {
  try {
    const test = await llamarMultiplexadorFree('ping', null, 'Responde solo con la palabra PONG');
    if (test?.texto) console.log(`[STARTUP] IA verificada vía ${test.proveedor.toUpperCase()}`);
  } catch (err) {
    const code = extraerCodigoError(err);
    console.warn(`[STARTUP] [SICC WARN] IA ${code ? `(${code})` : ''}: ${err.message}`);
    if (code === 402) console.error('[STARTUP] [SICC BLOCKER] BLOQUEO DE CUOTA (402)');
  }
})();

// ── Bot ───────────────────────────────────────────────────────────────────────
const bot = new TelegramBot(config.telegram.token, { polling: true });
const send = (chatId, text, opts) => safeSendMessage(bot, chatId, text, opts);

console.log(`[BOT] ${config.agent.name} iniciado. Usuario autorizado: ${config.telegram.userId}`);

// ── Crons ─────────────────────────────────────────────────────────────────────
const TZ = 'America/Bogota';

// 08:00 — Reporte matutino
cron.schedule('0 8 * * *', async () => {
  console.log('[CRON] Reporte matutino 08:00...');
  try {
    const { pool } = require('./supabase');
    const { execSync } = require('child_process');
    let clima = '—';
    try { clima = execSync('curl -s "https://wttr.in/Bogota?format=3"', { encoding: 'utf8' }).trim(); } catch (_) { }
    let frags = '?';
    try { frags = (await pool.query('SELECT count(*) FROM contrato_documentos')).rows[0].count; } catch (_) { }
    const forense = await obtenerResumenForense();
    const consistencia = await generarReporteConsistencia();
    await send(config.telegram.userId,
      `*REPORTE MATUTINO SICC — ${new Date().toLocaleDateString()}*\n\n` +
      `🌤️ *Clima:* ${clima}\n[SICC BRAIN] *Fragmentos:* ${frags}\n\n` +
      `${forense.crossRefReporte}\n${forense.zeroResidueReporte}\n\n` +
      `🔍 *Vigilancia:* ${forense.statusGeneral === 'HEALTHY' ? '🟢' : '🟡'}\n\n` +
      `🛰️ *Consistencia:*\n${consistencia}`
    );
  } catch (err) { console.error('[CRON] Reporte matutino:', err.message); }
}, { timezone: TZ });

// 06:00 — Backup
cron.schedule('0 6 * * *', () => {
  console.log('[BACKUP] Respaldo 06:00...');
  exec('bash scripts/sicc-backup.sh', async (error) => {
    if (error) {
      console.error('[BACKUP] Error:', error.message);
      await send(config.telegram.userId, `[SICC BLOCKER] *FALLO DE RESPALDO*\n\n${error.message}`);
    }
  });
}, { timezone: TZ });

// Cada hora — Health log
cron.schedule('0 * * * *', async () => {
  try {
    const forense = await obtenerResumenForense();
    const err4xx = Object.entries(EstadoGlobalErrores.conteos)
      .map(([c, n]) => `[${c}]:${n}`).join(',') || 'none';
    const entry = `[${new Date().toISOString()}] STATUS:${forense.statusGeneral} | 4xx:${err4xx} | ${forense.crossRefReporte.trim().replace(/\n/g, ' ')}\n`;
    fs.appendFileSync(path.join(LOGS_DIR, 'health.log'), entry);
  } catch (err) { console.error('[HEALTH]', err.message); }
}, { timezone: TZ });

// Cada 30 min — Monitor bloqueos críticos
setInterval(async () => {
  if (EstadoGlobalErrores.bloqueos.size > 0) {
    const list = Array.from(EstadoGlobalErrores.bloqueos).join(', ');
    console.error(`[GUARD] Bloqueo crítico: ${list}`);
    await send(config.telegram.userId, `[SICC BLOCKER] *EVENTO CRÍTICO*\n\nBloqueo: ${list}`);
    EstadoGlobalErrores.bloqueos.clear();
  }
}, 30 * 60 * 1000);

// ── Audit launcher ────────────────────────────────────────────────────────────
bot.onText(/^\/audit(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  if (userId !== config.telegram.userId && userId !== '1567740382') return;

  const target = match[1] || 'LFC2 General';
  await send(chatId,
    `⚖️ *Auditoría Forense Iniciada*\n\nÁrea: *${target}*\nMetodología: Verificación Contractual\n\n_Est. 5-10 min..._`
  );

  const scriptPath = path.join(__dirname, '../scripts/swarm-pilot.js');
  exec(`node "${scriptPath}" "${target}"`, { env: process.env, maxBuffer: 10 * 1024 * 1024, timeout: 1800000 },
    async (error, stdout) => {
      try {
        if (error) {
          for (let t = 0; t < 3; t++) {
            try { await send(chatId, `❌ *Error en auditoría:*\n${error.message}`); break; }
            catch (_) { await new Promise(r => setTimeout(r, 3000)); }
          }
          return;
        }
        // Intentar capturar desde el marcador de SICC o desde el final del stdout
        const veredictoMatch = stdout.match(/--------------------------------------------------[\s\S]*⚖️ VEREDICTO FINAL:[\s\S]*/i)
          || stdout.match(/⚖️ VEREDICTO FINAL:[\s\S]*/i);

        let resumen = 'Proceso concluido — veredicto no parseado.';
        if (veredictoMatch) {
          resumen = veredictoMatch[0].trim();
        } else {
          // Si no hay marcador, capturar las últimas 20 líneas (donde suele estar el resumen)
          const lines = stdout.trim().split('\n');
          resumen = lines.slice(-20).join('\n');
        }

        for (let t = 0; t < 3; t++) {
          try { await send(chatId, `✨ *Auditoría Finalizada (${target})*\n\n${resumen.substring(0, 3500)}`); break; }
          catch (_) { await new Promise(r => setTimeout(r, 3000)); }
        }
      } catch (e) { console.error('[AUDIT]', e.message); }
    }
  );
});

// ── /promote — CI/CD: commit + push de LFC2 a GitHub → Vercel ────────────────
bot.onText(/^\/promote(?:\s+(.+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  if (userId !== config.telegram.userId && userId !== '1567740382') return;

  const mensaje = match[1] || `DT aprobada — despliegue automático ${new Date().toLocaleDateString('es-CO')}`;
  await send(chatId, `🚀 *Iniciando despliegue LFC2...*\n_Commit: "${mensaje}"_`);

  try {
    const git = require('./gitlocal');
    const statusOut = git.status();
    if (!statusOut) {
      await send(chatId, `ℹ️ *Repositorio LFC2 sin cambios pendientes.* Vercel ya está al día.`);
      return;
    }
    const { commit, push } = git.commitYPush(mensaje);
    await send(chatId,
      `✅ *Despliegue Completado*\n\n` +
      `📦 *Commit:* \`${commit.split('\n')[0]}\`\n` +
      `☁️ *Push:* ${push || 'OK'}\n\n` +
      `🔗 Vercel iniciará el build en ~30s.`
    );
  } catch (err) {
    console.error('[PROMOTE]', err.message);
    await send(chatId, `❌ *Error en /promote:*\n${err.message}`);
  }
});

// ── Message & file routing ────────────────────────────────────────────────────
bot.on('message', (msg) => handleMessage(msg, bot, send));
bot.on('document', (msg) => handleFile(msg, 'document', bot, send));
bot.on('photo', (msg) => handleFile(msg, 'photo', bot, send));

bot.on('polling_error', (err) => console.error(`[BOT] Polling: ${err.message}`));
process.on('SIGTERM', () => { bot.stopPolling(); process.exit(0); });
process.on('SIGINT', () => { bot.stopPolling(); process.exit(0); });
