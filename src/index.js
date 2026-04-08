// index.js — Bot Telegram + heartbeat + guardado de memoria persistente
'use strict';

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { inicializarBrain, procesarMensaje, procesarMensajeSwarm, limpiarHistorial } = require('./agent');
const { cmdDoctor, cmdLearn, cmdAudit } = require('../scripts/sicc-harness');
const { estadoBrain, leerHeartbeat } = require('./brain');
const { guardar, estadoMemoria } = require('./memory');
const { leerNoLeidos, formatearCorreos, enviarCorreo } = require('./gmail');
const { infoRepo, ultimosCommits, issuesAbiertos, listarCarpeta, leerArchivo,
        formatearInfo, formatearCommits, formatearIssues, OWNER, REPO } = require('./github');

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
        console.warn('[BOT] ⚠️ Error de Markdown, reintentando en texto plano...');
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
      console.log(`[BOT] ✅ Fragmento ${index + 1}/${chunks.length} enviado.`);
    } catch (err) {
      console.warn(`[BOT] ⚠️ Fallo Markdown en fragmento ${index + 1}, reintentando plano...`);
      await bot.sendMessage(chatId, finalChunk, { ...options, parse_mode: undefined });
    }
    // Pequeño delay para no saturar el polling de Telegram
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

// ── Inicializar brain + memoria al arrancar ───────────────────────────────────
inicializarBrain();

const bot = new TelegramBot(config.telegram.token, { polling: true });
console.log(`[BOT] 🤖 ${config.agent.name} iniciado. Esperando mensajes de Telegram...`);
console.log(`[BOT] 🔒 Solo responde al usuario ID: ${config.telegram.userId}`);

// ── Heartbeat periódico (cada 30 minutos) ─────────────────────────────────────
setInterval(async () => {
  console.log('[HEARTBEAT] ⏰ Revisión periódica...');
  const tareas = leerHeartbeat();
  if (tareas.length > 0) {
    const lista = tareas.map(t => `• *${t.nombre}:* ${t.descripcion}`).join('\n');
    try {
      await safeSendMessage(config.telegram.userId,
        `⏰ *Heartbeat — Tareas pendientes:*\n\n${lista}`
      );
    } catch (err) {
      console.warn(`[HEARTBEAT] ⚠️ ${err.message}`);
    }
  }
}, 30 * 60 * 1000);

// ── Registro de Salud (cada hora) ─────────────────────────────────────────────
setInterval(async () => {
  const timestamp = new Date().toISOString();
  const logPath = path.join(LOGS_DIR, 'health.log');
  const brainStatus = estadoBrain().replace(/\n/g, ' | ');
  const healthEntry = `[${timestamp}] ❤️ HEALTH_CHECK: Container OK | IA: ${config.ai.primaryProvider} | Brain: ${brainStatus}\n`;

  try {
    fs.appendFileSync(logPath, healthEntry);
    console.log('[HEALTH] ✅ Registro de salud guardado.');
  } catch (err) {
    console.error(`[HEALTH] ❌ Error al escribir log de salud: ${err.message}`);
  }
}, 60 * 60 * 1000);

// ── Mensajes de Telegram ──────────────────────────────────────────────────────
bot.on('message', async (msg) => {
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
      `👋 ¡Hola Diego! Soy *${config.agent.name}*.\n\n` +
      `🧠 Cerebro · 💾 Memoria · 📧 Gmail · 🐙 GitHub\n\n` +
      `*/doctor* · */learn* · */audit [ruta]*\n` +
      `*/dream* · */swarm [pregunta]* · */limpiar*\n` +
      `*/estado* · */cerebro* · */memoria*\n\n` +
      `*/correos* · */email para|asunto|msg*\n` +
      `*/git repo* — Info del repo LFC2\n` +
      `*/git commits* — Últimos commits\n` +
      `*/git issues* — Issues abiertos\n` +
      `*/git ls [ruta]* — Listar archivos\n` +
      `*/git cat archivo* — Ver contenido`
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
      await safeSendMessage(chatId, respuestaDebate);
      console.log(`[BOT] ✅ Swarm completado para: "${pregunta.substring(0, 30)}..."`);
    } catch (err) {
      console.error(`[BOT] ❌ Error en Swarm: ${err.message}`);
      await safeSendMessage(chatId, `❌ Error en el Enjambre: ${err.message}`);
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
      const score = cmdDoctor();
      console.log = oldLog;
      console.warn = oldWarn;
      const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
      const reporte = `🩺 *SICC Doctor — Health Report*\n\n` +
        `${emoji} *Score: ${score}/100*\n\n` +
        `\`\`\`\n${lines.slice(-12).join('\n')}\n\`\`\``;
      await safeSendMessage(chatId, reporte);
    } catch (err) {
      await safeSendMessage(chatId, `❌ Error en Doctor: ${err.message}`);
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
    const msg = `💤 *SICC Dreamer — Estado*\n\n` +
      `⏳ *${dreams}* hipótesis en cola para el ciclo nocturno\n` +
      `📋 *${dts}* borradores de DT pendientes de aprobación\n\n` +
      `El Dreamer ejecuta a las *2:00 AM* con el Hard-Cap de CPU activo.`;
    await safeSendMessage(chatId, msg);
    return;
  }

  // ── Comando LEARN (Auto-mapeo recursivo) ───────────────────────────────────
  if (texto === '/learn') {
    await safeSendMessage(chatId, '🧠 *SICC Brain: Inicia aprendizaje recursivo...*');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const oldLog = console.log;
      const lines = [];
      console.log = (...a) => { oldLog(...a); lines.push(a.join(' ')); };
      cmdLearn();
      console.log = oldLog;
      await safeSendMessage(chatId, `✅ *Aprendizaje Completado*\n\n\`\`\`\n${lines.slice(-5).join('\n')}\n\`\`\``);
    } catch (err) {
      await safeSendMessage(chatId, `❌ Error en Learn: ${err.message}`);
    }
    return;
  }

  // ── Comando AUDIT (Karpathy Loop manual) ───────────────────────────────────
  if (texto.startsWith('/audit ')) {
    const ruta = texto.replace('/audit ', '').trim();
    if (!ruta) {
      await safeSendMessage(chatId, '⚠️ Uso: `/audit IV_Ingenieria_basica`');
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
      await safeSendMessage(chatId, `🔬 *Resultados de la Auditoría:* \n\n\`\`\`\n${lines.join('\n').substring(0, 3000)}\n\`\`\``);
    } catch (err) {
      await safeSendMessage(chatId, `❌ Error en Audit: ${err.message}`);
    }
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
        if (!archivo) { await bot.sendMessage(chatId, '⚠️ Uso: `/git cat ruta/archivo`', { parse_mode: 'Markdown' }); return; }
        const contenido = await leerArchivo(archivo);
        const preview = contenido.substring(0, 3000);
        await bot.sendMessage(chatId,
          `📄 *${archivo}*\n\`\`\`\n${preview}${contenido.length > 3000 ? '\n...(truncado)' : ''}\n\`\`\``,
          { parse_mode: 'Markdown' }
        );

      } else {
        await bot.sendMessage(chatId, '⚠️ Sub-comandos: `repo` · `commits` · `issues` · `ls [ruta]` · `cat archivo`', { parse_mode: 'Markdown' });
      }
    } catch (err) {
      console.error(`[GITHUB] ❌ ${err.message}`);
      await safeSendMessage(chatId, `❌ Error GitHub: ${err.message}`);
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
      console.error(`[GMAIL] ❌ ${err.message}`);
      await bot.sendMessage(chatId, `❌ Error al leer Gmail: ${err.message}`);
    }
    return;
  }

  if (texto.startsWith('/email ')) {
    // Formato: /email destinatario|asunto|mensaje
    const partes = texto.replace('/email ', '').split('|');
    if (partes.length < 3) {
      await bot.sendMessage(chatId,
        '⚠️ Formato: `/email destinatario@correo.com|Asunto|Mensaje`',
        { parse_mode: 'Markdown' }
      );
      return;
    }
    await bot.sendChatAction(chatId, 'typing');
    try {
      await enviarCorreo({ para: partes[0].trim(), asunto: partes[1].trim(), cuerpo: partes[2].trim() });
      await bot.sendMessage(chatId, `✅ Correo enviado a *${partes[0].trim()}*`, { parse_mode: 'Markdown' });
    } catch (err) {
      console.error(`[GMAIL] ❌ ${err.message}`);
      await bot.sendMessage(chatId, `❌ Error al enviar: ${err.message}`);
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
      `• Gemini: ${config.ai.gemini.apiKey ? '✅' : '❌'}\n` +
      `• Groq: ${config.ai.groq.apiKey ? '✅' : '❌'}\n` +
      `• OpenRouter: ${config.ai.openrouter.apiKey ? '✅' : '❌'}\n\n` +
      `💾 ${estadoMemoria()}`
    );
    return;
  }

  if (texto === '/cerebro') {
    await safeSendMessage(chatId,
      `🧠 *Archivos del cerebro:*\n\n${estadoBrain()}`
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
    console.log(`[BOT] ✅ Respondido con ${proveedor}`);
  } catch (err) {
    console.error(`[BOT] ❌ ${err.message}`);
    await safeSendMessage(chatId, '⚠️ Error inesperado. Revisa los logs.');
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
    console.error(`[BOT] ❌ Error procesando archivo: ${err.message}`);
    await safeSendMessage(chatId, '⚠️ Error analizando el archivo asegúrate de que sea un PDF/Imagen soportado por Gemini.');
  }
}

bot.on('document', (msg) => procesarArchivo(msg, 'document'));
bot.on('photo',    (msg) => procesarArchivo(msg, 'photo'));

bot.on('polling_error', (err) => console.error(`[BOT] ❌ Polling: ${err.message}`));
process.on('SIGTERM', () => { bot.stopPolling(); process.exit(0); });
process.on('SIGINT',  () => { bot.stopPolling(); process.exit(0); });
