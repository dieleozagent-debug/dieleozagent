// index.js — Bot Telegram + heartbeat + guardado de memoria persistente
'use strict';

const fs = require('fs');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const { inicializarBrain, procesarMensaje, limpiarHistorial } = require('./agent');
const { estadoBrain, leerHeartbeat } = require('./brain');
const { guardar, estadoMemoria } = require('./memory');
const { leerNoLeidos, formatearCorreos, enviarCorreo } = require('./gmail');
const { infoRepo, ultimosCommits, issuesAbiertos, listarCarpeta, leerArchivo,
        formatearInfo, formatearCommits, formatearIssues, OWNER, REPO } = require('./github');

// Directorio para archivos temporales recibidos de Telegram
const DOWNLOADS_DIR = '/app/data/downloads';
if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

/**
 * Envía un mensaje de forma segura, intentando Markdown primero, 
 * y cayendo a texto plano si falla el parseo.
 */
async function safeSendMessage(chatId, text, options = {}) {
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
      await bot.sendMessage(config.telegram.userId,
        `⏰ *Heartbeat — Tareas pendientes:*\n\n${lista}`,
        { parse_mode: 'Markdown' }
      );
    } catch (err) {
      console.warn(`[HEARTBEAT] ⚠️ ${err.message}`);
    }
  }
}, 30 * 60 * 1000);

// ── Mensajes de Telegram ──────────────────────────────────────────────────────
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);
  const texto  = msg.text;

  if (userId !== config.telegram.userId) return;

  if (!texto) {
    await bot.sendMessage(chatId, '📎 Por ahora solo proceso texto.');
    return;
  }

  // ── Comandos ──────────────────────────────────────────────────────────────
  if (texto === '/start' || texto === '/hola') {
    await bot.sendMessage(chatId,
      `👋 ¡Hola Diego! Soy *${config.agent.name}*.\n\n` +
      `🧠 Cerebro · 💾 Memoria · 📧 Gmail · 🐙 GitHub\n\n` +
      `*/limpiar* · */estado* · */cerebro* · */memoria*\n` +
      `*/correos* · */email para|asunto|msg*\n` +
      `*/git repo* — Info del repo LFC2\n` +
      `*/git commits* — Últimos commits\n` +
      `*/git issues* — Issues abiertos\n` +
      `*/git ls [ruta]* — Listar archivos\n` +
      `*/git cat archivo* — Ver contenido`,
      { parse_mode: 'Markdown' }
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
      await bot.sendMessage(chatId, `❌ Error GitHub: ${err.message}`);
    }
    return;
  }

  if (texto === '/correos') {
    await bot.sendChatAction(chatId, 'typing');
    try {
      const correos = await leerNoLeidos(5);
      const resumen = formatearCorreos(correos);
      await bot.sendMessage(chatId,
        `📧 *Correos no leídos — dieleozagent@gmail.com*\n\n${resumen}`,
        { parse_mode: 'Markdown' }
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
    await bot.sendMessage(chatId,
      `📊 *Estado de ${config.agent.name}*\n\n` +
      `• Proveedor: *${config.ai.primaryProvider}*\n` +
      `• Gemini: ${config.ai.gemini.apiKey ? '✅' : '❌'}\n` +
      `• Groq: ${config.ai.groq.apiKey ? '✅' : '❌'}\n` +
      `• OpenRouter: ${config.ai.openrouter.apiKey ? '✅' : '❌'}\n\n` +
      `💾 ${estadoMemoria()}`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  if (texto === '/cerebro') {
    await bot.sendMessage(chatId,
      `🧠 *Archivos del cerebro:*\n\n${estadoBrain()}`,
      { parse_mode: 'Markdown' }
    );
    return;
  }

  if (texto === '/memoria') {
    await bot.sendMessage(chatId,
      `💾 *Memoria persistente:*\n\n${estadoMemoria()}\n\n` +
      `📁 Ubicación: \`/home/administrador/data-agente/memory/\``,
      { parse_mode: 'Markdown' }
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
