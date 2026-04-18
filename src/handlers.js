/**
 * @file src/handlers.js
 * @what  Router de comandos Telegram. Maneja comandos /slash y delega intents de
 *        lenguaje natural a src/intents/*.js. Exporta handleMessage y handleFile.
 * @how   handleMessage enruta /comandos por prefijo exacto (bloque if por comando).
 *        Para lenguaje natural: loop sobre INTENTS — cada módulo expone matches() y
 *        handle(); el primero que coincide responde y retorna true. Si ninguno
 *        coincide, cae al fallback IA (procesarMensaje).
 * @why   Separar routing de lógica de intent evita que este archivo crezca.
 *        Para agregar un intent nuevo: crear src/intents/nuevo.js y añadirlo a INTENTS.
 * @refs  index.js — llama handleMessage/handleFile desde bot.on('message/document/photo')
 *        utils/send.js — `send` = safeSendMessage ligado al bot
 *        agent.js — procesarMensaje(), procesarMensajeSwarm(), limpiarHistorial()
 *        src/intents/navigation.js — "me pierdo / cómo empiezo"
 *        src/intents/brain-state.js — soul / identidad / enjambre / lecciones
 *        src/intents/dream-state.js — sueños / DREAMS / PENDING / historial área / roadmap
 *        src/intents/dt-ops.js — DTs aprobadas / bloqueadas / qué hacemos con X
 *
 * @agent-prompt
 *   Para agregar un COMANDO nuevo (/slash): añade un bloque if ANTES del loop INTENTS.
 *   Para agregar un INTENT de lenguaje natural: crea src/intents/nuevo.js con
 *   { matches(textLower, texto), handle(chatId, texto, textLower, send, BRAIN_DIR) }
 *   y agrégalo al array INTENTS. NO pongas lógica de intent aquí directamente.
 *   captureLog() solo funciona con funciones síncronas (cmdDoctor, cmdLearn).
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const { exec } = require('child_process');

const config          = require('./config');
const { procesarMensaje, procesarMensajeSwarm, limpiarHistorial } = require('./agent');
const { llamarOllama } = require('../scripts/sicc-multiplexer');
const { cmdDoctor, cmdLearn, cmdAudit } = require('../scripts/sicc-harness');
const { estadoBrain } = require('./brain');
const { guardar, estadoMemoria } = require('./memory');
const { leerNoLeidos, formatearCorreos, enviarCorreo } = require('./gmail');
const { infoRepo, ultimosCommits, issuesAbiertos, listarCarpeta,
        leerArchivo, formatearInfo, formatearCommits, formatearIssues,
        OWNER, REPO } = require('./github');
const { startPatrol, stopPatrol, getPatrolStatus } = require('./patrol');

const DOWNLOADS_DIR = path.join(__dirname, '../data/downloads');
const BRAIN_DIR     = path.join(__dirname, '../brain');

// ── Intents de lenguaje natural ───────────────────────────────────────────────
// Cada módulo expone { matches(textLower, texto), handle(chatId, texto, textLower, send, BRAIN_DIR) }
// Orden importa: el primero que coincide responde.
const INTENTS = [
  require('./intents/navigation'),
  require('./intents/brain-state'),
  require('./intents/dream-state'),
  require('./intents/dt-ops'),
];

// ── Autorizacion ─────────────────────────────────────────────────────────────
function autorizado(userId) {
  return userId === config.telegram.userId || userId === '1567740382';
}

// ── Captura de console.log para resúmenes ──────────────────────────────────
function captureLog(fn) {
  const lines = [];
  const orig = console.log;
  console.log = (...a) => { orig(...a); lines.push(a.join(' ')); };
  const res = fn();
  console.log = orig;
  return { res, lines };
}

// ── Handler principal de mensajes ──────────────────────────────────────────
async function handleMessage(msg, bot, send) {
  if (!msg.text) return;
  const texto  = msg.text.trim();
  const chatId = msg.chat.id;
  const userId = String(msg.from.id);

  if (texto.startsWith('/dream') || texto === '/swarm') return;
  if (!autorizado(userId)) {
    console.warn(`[BOT] Mensaje ignorado de: ${userId}`);
    return;
  }
  if (!texto) { await bot.sendMessage(chatId, '📎 Solo proceso texto.'); return; }

  // /start /hola
  if (texto === '/start' || /^\/?(hola|hello|hi|buenas?|buenos?\s*d[ií]as?|buenas?\s*tardes?|buenas?\s*noches?)$/i.test(texto)) {
    await send(chatId,
      `👋 ¡Hola Diego! Soy *${config.agent.name}* (SICC v12.9).\n\n` +
      `*/dream [tema]* · */swarm [pregunta]* · */doctor* · */learn*\n` +
      `*/audit [ruta]* · */karpathy [tema]* · */audit_run*\n` +
      `*/ollama [prompt]* · */cmd [shell]* · */ingesta [ruta]*\n` +
      `*/cerebro* · */estado* · */memoria* · */limpiar*\n` +
      `*/correos* · */email para|asunto|msg*\n` +
      `*/git repo* · */git commits* · */git ls [ruta]* · */git cat archivo*\n` +
      `*/dream_on* · */dream_off* · */dream_status*`
    );
    return;
  }

  // /swarm
  if (texto.startsWith('/swarm ')) {
    const pregunta = texto.slice(7).trim();
    await send(chatId, '🐝 *Iniciando Enjambre Secuencial...* (~10 min)');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const respuesta = await procesarMensajeSwarm(pregunta);
      guardar(texto, respuesta, 'SICC-SWARM');
      await send(chatId, respuesta);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Error Swarm: ${err.message}`);
    }
    return;
  }

  // /doctor
  if (texto === '/doctor') {
    await send(chatId, '🩺 *Ejecutando SICC Doctor...*');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const { res: score, lines } = captureLog(() => cmdDoctor());
      const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
      await send(chatId, `🩺 *SICC Doctor*\n\n${emoji} *Score: ${score}/100*\n\n\`\`\`\n${lines.slice(-12).join('\n')}\n\`\`\``);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Doctor: ${err.message}`);
    }
    return;
  }

  // /dream (sin área = estado del dreamer)
  if (texto === '/dream') {
    const dreamsDir = path.join(BRAIN_DIR, 'DREAMS');
    const pendingDir = path.join(BRAIN_DIR, 'PENDING_DTS');
    const dreams  = fs.existsSync(dreamsDir)  ? fs.readdirSync(dreamsDir).filter(f => f.endsWith('.md')).length  : 0;
    const pending = fs.existsSync(pendingDir) ? fs.readdirSync(pendingDir).filter(f => f.endsWith('.md')).length : 0;
    await send(chatId,
      `💤 *SICC Dreamer — Estado*\n\n` +
      `📓 *${dreams}* sueños registrados en \`brain/DREAMS/\`\n` +
      `🔶 *${pending}* borradores en \`brain/PENDING_DTS/\` (revisión humana)\n\n` +
      `Usa */dream [área]* para iniciar un ciclo de decantación.`
    );
    return;
  }

  // /learn
  if (texto === '/learn') {
    await send(chatId, '[SICC BRAIN] *Iniciando aprendizaje recursivo...*');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const { lines } = captureLog(() => cmdLearn());
      const resumen = lines.slice(-5).join('\n');
      guardar(texto, resumen, 'SYSTEM');
      await send(chatId, `[SICC OK] *Aprendizaje Completado*\n\n\`\`\`\n${resumen}\n\`\`\``);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Learn: ${err.message}`);
    }
    return;
  }

  // /karpathy
  if (texto.startsWith('/karpathy ')) {
    const tema = texto.slice(10).trim();
    await send(chatId, `🔬 *Karpathy — Auditando:* \`${tema}\`...`);
    await bot.sendChatAction(chatId, 'typing');
    const keyword = tema.toLowerCase().includes('ingeniería') ? tema.split(' ').slice(1).join(' ') : tema;
    const norm = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    exec(`find ${config.paths.lfc2} -iname "*${norm}*" | grep -v "/old/" | head -5`, async (_, stdout) => {
      const archivos = stdout.trim();
      const ruta = archivos ? archivos.split('\n')[0] : config.paths.lfc2;
      if (!archivos) await send(chatId, `[SICC WARN] Sin archivos para \`${keyword}\`. Auditando raíz.`);
      else await send(chatId, `📂 *Archivos localizados:*\n\`\`\`\n${archivos}\n\`\`\``);
      const { lines } = captureLog(() => cmdAudit(ruta));
      await send(chatId, `🔬 *Dictamen Karpathy:*\n\n\`\`\`\n${lines.join('\n').substring(0, 3000)}\n\`\`\``);
    });
    return;
  }

  // /audit
  if (texto.startsWith('/audit ')) {
    const ruta = texto.slice(7).trim();
    await send(chatId, `🔬 *Auditando:* \`${ruta}\`...`);
    await bot.sendChatAction(chatId, 'typing');
    try {
      const { lines } = captureLog(() => cmdAudit(ruta));
      guardar(texto, `Auditoría en ${ruta}`, 'SYSTEM');
      await send(chatId, `🔬 *Resultados:*\n\n\`\`\`\n${lines.join('\n').substring(0, 3000)}\n\`\`\``);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Audit: ${err.message}`);
    }
    return;
  }

  // /ollama
  if (texto.startsWith('/ollama ')) {
    const prompt = texto.slice(8).trim();
    await send(chatId, '🖥️ *Ollama Local:* Pensando...');
    await bot.sendChatAction(chatId, 'typing');
    try {
      const resultado = await llamarOllama(prompt);
      await send(chatId, `🖥️ *Ollama:*\n\n${resultado}`);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Ollama: ${err.message}`);
    }
    return;
  }

  // /cmd
  if (texto.startsWith('/cmd ')) {
    const comando = texto.slice(5).trim();
    await send(chatId, `💻 *Ejecutando:* \`${comando}\``);
    exec(comando, { timeout: 15000 }, async (error, stdout, stderr) => {
      let out = stdout || stderr || 'Sin salida.';
      if (error) out += `\nError: ${error.message}`;
      await send(chatId, `\`\`\`bash\n${out.substring(0, 3000)}\n\`\`\``);
    });
    return;
  }

  // /ingesta
  if (texto.startsWith('/ingesta ')) {
    const ruta = texto.slice(9).trim();
    await send(chatId, `🚀 *Ingesta en:* \`${ruta}\`...\nPuede tardar varios minutos.`);
    await bot.sendChatAction(chatId, 'upload_document');
    exec(`node scripts/sicc-ingesta.js --path "${ruta}"`, (error, stdout) => {
      if (error) send(chatId, `❌ *Error Ingesta:* ${error.message}`);
      else send(chatId, `✅ *Ingesta Finalizada*\n\n\`\`\`\n${stdout.split('\n').slice(-5).join('\n')}\n\`\`\``);
    });
    return;
  }

  // /audit_run
  if (texto === '/audit_run') {
    await send(chatId, '🛡️ *Activando Auditoría Forense...*');
    await bot.sendChatAction(chatId, 'typing');
    exec('node scripts/sicc-harness.js audit --force', (error, stdout) => {
      if (error) send(chatId, `❌ *Error Auditor:* ${error.message}`);
      else send(chatId, `🛡️ *Auditoría Finalizada*\n\n\`\`\`\n${stdout.split('\n').slice(-5).join('\n')}\n\`\`\``);
    });
    return;
  }

  // patrol
  if (texto === '/dream_on')     { await send(chatId, startPatrol(bot, chatId)); return; }
  if (texto === '/dream_off')    { await send(chatId, stopPatrol()); return; }
  if (texto === '/dream_status') {
    const st = getPatrolStatus();
    await send(chatId,
      `${st.active ? '🛰️' : '🛑'} *Patrulla SICC*\n\n` +
      `• Estado: ${st.active ? '*ACTIVA*' : '*DETENIDA*'}\n` +
      `• Carpeta: \`#${st.folderIndex + 1}\`\n• CPU: ${st.cpu}%\n\n_${st.msg}_`
    );
    return;
  }

  // /git
  if (texto.startsWith('/git ')) {
    const args = texto.slice(5).trim().split(' ');
    const sub  = args[0];
    await bot.sendChatAction(chatId, 'typing');
    try {
      if (sub === 'repo') {
        await bot.sendMessage(chatId, formatearInfo(await infoRepo()), { parse_mode: 'Markdown' });
      } else if (sub === 'commits') {
        await bot.sendMessage(chatId,
          `🔀 *Últimos commits — ${OWNER}/${REPO}*\n\n${formatearCommits(await ultimosCommits(5))}`,
          { parse_mode: 'Markdown' });
      } else if (sub === 'issues') {
        await bot.sendMessage(chatId,
          `🐛 *Issues abiertos — ${OWNER}/${REPO}*\n\n${formatearIssues(await issuesAbiertos(5))}`,
          { parse_mode: 'Markdown' });
      } else if (sub === 'ls') {
        const ruta  = args.slice(1).join(' ') || '';
        const items = await listarCarpeta(ruta);
        await bot.sendMessage(chatId, `📁 *${REPO}/${ruta || '(raíz)'}*\n\n${items.join('\n')}`, { parse_mode: 'Markdown' });
      } else if (sub === 'cat') {
        const archivo = args.slice(1).join(' ');
        if (!archivo) { await send(chatId, '[SICC WARN] Uso: `/git cat ruta/archivo`'); return; }
        const contenido = await leerArchivo(archivo);
        await bot.sendMessage(chatId,
          `📄 *${archivo}*\n\`\`\`\n${contenido.substring(0, 3000)}${contenido.length > 3000 ? '\n...(truncado)' : ''}\n\`\`\``,
          { parse_mode: 'Markdown' });
      } else {
        await send(chatId, '[SICC WARN] Sub-comandos: `repo` · `commits` · `issues` · `ls [ruta]` · `cat archivo`');
      }
    } catch (err) {
      await send(chatId, `[SICC FAIL] GitHub: ${err.message}`);
    }
    return;
  }

  // /correos
  if (texto === '/correos') {
    await bot.sendChatAction(chatId, 'typing');
    try {
      await send(chatId, `📧 *Correos no leídos*\n\n${formatearCorreos(await leerNoLeidos(5))}`);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Gmail: ${err.message}`);
    }
    return;
  }

  // /email
  if (texto.startsWith('/email ')) {
    const partes = texto.slice(7).split('|');
    if (partes.length < 3) { await send(chatId, '[SICC WARN] Formato: `/email para|asunto|mensaje`'); return; }
    await bot.sendChatAction(chatId, 'typing');
    try {
      await enviarCorreo({ para: partes[0].trim(), asunto: partes[1].trim(), cuerpo: partes[2].trim() });
      await send(chatId, `[SICC OK] Correo enviado a *${partes[0].trim()}*`);
    } catch (err) {
      await send(chatId, `[SICC FAIL] Email: ${err.message}`);
    }
    return;
  }

  // utilidades
  if (texto === '/limpiar') { limpiarHistorial(); await bot.sendMessage(chatId, '🧹 Historial limpiado.'); return; }

  if (texto === '/estado') {
    await send(chatId,
      `📊 *Estado ${config.agent.name}*\n\n` +
      `• Gemini: ${config.ai.gemini.apiKey ? '🟢' : '🔴'}\n` +
      `• Groq: ${config.ai.groq.apiKey ? '🟢' : '🔴'}\n` +
      `• OpenRouter: ${config.ai.openrouter.apiKey ? '🟢' : '🔴'}\n\n` +
      `💾 ${estadoMemoria()}`
    );
    return;
  }

  if (texto === '/cerebro') { await send(chatId, `[SICC BRAIN] *Archivos del cerebro:*\n\n${estadoBrain()}`); return; }

  if (texto === '/memoria') {
    await send(chatId, `💾 *Memoria:*\n\n${estadoMemoria()}`);
    return;
  }

  // ── Intents de lenguaje natural (loop extensible) ────────────────────────
  // Cada módulo en src/intents/ expone { matches(textLower, texto), handle(...) }.
  // Para agregar un intent: crear el archivo y añadirlo al array INTENTS.
  const textLower = texto.toLowerCase();
  for (const intent of INTENTS) {
    try {
      if (intent.matches(textLower, texto)) {
        const handled = await intent.handle(chatId, texto, textLower, send, BRAIN_DIR);
        if (handled) return;
      }
    } catch (e) {
      console.warn(`[BOT] Intent ${intent._name || '?'} error: ${e.message}`);
    }
  }

  // ── Fallback IA ──────────────────────────────────────────────────────────
  console.log(`[BOT] 📨 "${texto.substring(0, 60)}"`);
  await bot.sendChatAction(chatId, 'typing');
  try {
    const { texto: respuesta, proveedor } = await procesarMensaje(texto, null);
    guardar(texto, respuesta, proveedor);
    await send(chatId, respuesta);
    console.log(`[BOT] [SICC OK] Respondido con ${proveedor}`);
  } catch (err) {
    console.error(`[BOT] [SICC FAIL] ${err.message}`);
    await send(chatId, '[SICC WARN] Error inesperado. Revisa los logs.');
  }
}

// ── Handler de archivos / fotos ────────────────────────────────────────────
async function handleFile(msg, msgTipo, bot, send) {
  const chatId = msg.chat.id;
  if (String(msg.from.id) !== config.telegram.userId) return;

  const fileId   = msgTipo === 'photo' ? msg.photo[msg.photo.length - 1].file_id : msg.document.file_id;
  const fileName = msgTipo === 'photo' ? `photo_${fileId}.jpg` : msg.document.file_name;
  const mimeType = msgTipo === 'photo' ? 'image/jpeg' : msg.document.mime_type;
  const caption  = msg.caption || 'Analiza este archivo.';

  await bot.sendMessage(chatId, '📥 Descargando archivo...');
  await bot.sendChatAction(chatId, 'typing');

  try {
    const subPath = await bot.downloadFile(fileId, DOWNLOADS_DIR);
    const { texto: respuesta, proveedor } = await procesarMensaje(caption, { path: subPath, name: fileName, mimeType });
    fs.unlinkSync(subPath);
    guardar(`[Archivo: ${fileName}] ${caption}`, respuesta, proveedor);
    await send(chatId, respuesta);
  } catch (err) {
    console.error(`[BOT] [SICC FAIL] Archivo: ${err.message}`);
    await send(chatId, '[SICC WARN] Error analizando el archivo.');
  }
}

module.exports = { handleMessage, handleFile };
