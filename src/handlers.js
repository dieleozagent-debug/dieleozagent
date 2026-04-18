/**
 * @file src/handlers.js
 * @what  Contiene TODA la lógica de comandos del bot Telegram.
 *        Exporta handleMessage(msg, bot, send) y handleFile(msg, tipo, bot, send).
 * @how   handleMessage recibe cada msg.text, lo enruta por prefijo/regex a un
 *        bloque handler. Usa `send(chatId, text)` para responder (nunca bot.sendMessage
 *        directamente salvo casos que necesitan parse_mode explícito en /git).
 *        captureLog() captura console.log de funciones síncronas (cmdDoctor, cmdLearn).
 *        Los handlers de soul/identidad y DTs leen archivos del brain/ directamente.
 * @why   Extraído de index.js (790 líneas) para que el bootstrap sea legible y
 *        esta lógica de dominio viva en un solo lugar fácil de extender.
 * @refs  index.js — llama handleMessage/handleFile desde bot.on('message/document/photo')
 *        utils/send.js — `send` es un wrapper de safeSendMessage ligado al bot
 *        agent.js — procesarMensaje(), procesarMensajeSwarm(), limpiarHistorial()
 *        scripts/sicc-multiplexer.js — llamarOllama()
 *        scripts/sicc-harness.js — cmdDoctor(), cmdLearn(), cmdAudit()
 *        brain/SOUL.md, brain/SPECIALTIES/* — leídos por el handler de identidad
 *        brain/dictamenes/, brain/DREAMS/ — leídos por el handler de DTs
 *
 * @agent-prompt
 *   Para agregar un comando nuevo: añade un bloque `if (texto === '/nuevo')` ANTES
 *   del fallback IA (último bloque). No cambies el orden de los handlers existentes.
 *   `send` ya maneja chunking y fallback Markdown; úsalo siempre.
 *   Los handlers de soul y DTs tienen try/catch silencioso; si fallan, caen al IA.
 *   captureLog() NO captura funciones async; para async usa await y lee el retorno.
 *   handleFile vive aquí porque comparte imports y sigue el mismo patrón de autorización.
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

  // ── Respuestas directas sobre identidad / soul / learning ─────────────────
  const textLower = texto.toLowerCase();
  if (/\b(soul|alma|identidad|aprendes?|aprende|memoria gen[eé]tica|como funciona|quien eres|qui[eé]n eres|cerebro|brain|karpathy|sueñas?|dream)\b/i.test(textLower) &&
      /\b(t[uú]|agente|sicc|bot|opengravity|tu soul|tu alma|tu brain)\b/i.test(textLower)) {
    try {
      const soul  = fs.readFileSync(path.join(BRAIN_DIR, 'SOUL.md'), 'utf8').split('\n').slice(0, 20).join('\n');
      const specs = fs.readdirSync(path.join(BRAIN_DIR, 'SPECIALTIES')).filter(f => f.endsWith('.md'));
      await send(chatId,
        `🧠 *Cómo aprende OpenGravity SICC:*\n\n` +
        `*1. SOUL.md (ética — estático):*\n\`\`\`\n${soul.substring(0, 400)}\n\`\`\`\n\n` +
        `*2. Memoria Genética (sicc_genetic_memory):*\n` +
        `buscarLecciones() inyecta vacunas por coseno >0.7 en cada dream/mensaje.\n\n` +
        `*3. SPECIALTIES/* (Karpathy):*\n` +
        specs.map(f => `• ${f.replace('.md', '')}`).join('  ') + `\n` +
        `Cada rechazo del Juez hace append de la lección.\n\n` +
        `*4. brain/dictamenes/* (gold standards):*\nDTs aprobadas = referencia para futuros sueños.\n\n` +
        `_SOUL e IDENTITY definen quién soy. La memoria genética define qué sé del proyecto._`
      );
      return;
    } catch (_) {}
  }

  // ── Respuesta directa sobre temas para /dream y pendientes de trabajo ───────
  // Captura: "qué temas puedo proponer", "qué tenemos pendiente", "qué falta", etc.
  if (/temas?.*(proponer|dream|soñar)|pendiente.*(trabajo|hacer|falta)|qu[eé] falta|qu[eé] tenemos|roadmap|agenda|backlog|prioridades/i.test(textLower)) {
    try {
      const roadmap    = fs.readFileSync(path.join(BRAIN_DIR, 'ROADMAP.md'), 'utf8');
      const specDir    = path.join(BRAIN_DIR, 'SPECIALTIES');
      const areas      = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', '')) : [];

      // Extraer sección PENDIENTE del ROADMAP
      const pendienteMatch = roadmap.match(/## 🔴 PENDIENTE[\s\S]*?(?=\n## |$)/);
      const pendienteMed   = roadmap.match(/## 🟡 PENDIENTE[\s\S]*?(?=\n## |$)/);
      const pendienteTexto = pendienteMatch ? pendienteMatch[0].split('\n').slice(1, 8).join('\n') : '';
      const pendienteMedTexto = pendienteMed ? pendienteMed[0].split('\n').slice(1, 6).join('\n') : '';

      await send(chatId,
        `🗺️ *Agenda SICC — Qué trabajar*\n\n` +
        `*Áreas disponibles para /dream:*\n` +
        areas.map(a => `• \`/dream ${a.toLowerCase()}\``).join('\n') + `\n\n` +
        `*Alta prioridad (🔴):*\n\`\`\`\n${pendienteTexto.trim()}\n\`\`\`\n\n` +
        `*Media prioridad (🟡):*\n\`\`\`\n${pendienteMedTexto.trim()}\n\`\`\`\n\n` +
        `Ver roadmap completo: \`brain/ROADMAP.md\``
      );
      return;
    } catch (_) {}
  }

  // ── Respuesta directa sobre ubicación de DTs ──────────────────────────────
  if (/d[oó]nde|encuentro|dictamen|dt[- ]?aprobad|dt certificad|sueño cert/i.test(textLower)) {
    try {
      const dts    = fs.readdirSync(path.join(BRAIN_DIR, 'dictamenes')).filter(f => f.endsWith('.md')).sort().reverse().slice(0, 5);
      const sueños = fs.readdirSync(path.join(BRAIN_DIR, 'DREAMS')).filter(f => f.endsWith('.md')).sort().reverse().slice(0, 3);
      await send(chatId,
        `📄 *DTs certificadas* (\`brain/dictamenes/\`):\n` +
        (dts.length ? dts.map(f => `• \`${f}\``).join('\n') : '_(ninguna)_') + `\n\n` +
        `💤 *Sueños recientes* (\`brain/DREAMS/\`):\n` +
        (sueños.length ? sueños.map(f => `• \`${f}\``).join('\n') : '_(ninguno)_') + `\n\n` +
        `Para promover a LFC2:\n\`\`\`\ncp brain/dictamenes/<DT>.md /home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/\n\`\`\``
      );
      return;
    } catch (_) {}
  }

  // ── Respuesta directa sobre sueños / DREAMS / PENDING ────────────────────
  // Captura: "qué sueños tienes pendientes", "dreams pendientes", "qué soñaste", etc.
  if (/sue[ñn]|dream|pending|pendiente|borrador|karpathy.*(pendiente|queue)|ciclo.*(pendiente|sueño)/i.test(textLower) &&
      !/\/dream/.test(texto)) {
    try {
      const dreamsDir  = path.join(BRAIN_DIR, 'DREAMS');
      const pendingDir = path.join(BRAIN_DIR, 'PENDING_DTS');
      const specDir    = path.join(BRAIN_DIR, 'SPECIALTIES');
      const dreams  = fs.existsSync(dreamsDir)  ? fs.readdirSync(dreamsDir).filter(f => f.endsWith('.md')).sort().reverse()  : [];
      const pending = fs.existsSync(pendingDir) ? fs.readdirSync(pendingDir).filter(f => f.endsWith('.md')).sort().reverse() : [];
      const specs   = fs.existsSync(specDir)    ? fs.readdirSync(specDir).filter(f => f.endsWith('.md'))                     : [];

      const aprobados = dreams.filter(f => f.includes('CERTIFICADO'));
      const rechazados = dreams.filter(f => f.includes('RECHAZADO'));

      await send(chatId,
        `💤 *Estado del Dreamer SICC*\n\n` +
        `📓 *Sueños registrados (${dreams.length} total):*\n` +
        `• ${aprobados.length} CERTIFICADOS | ${rechazados.length} RECHAZADOS\n` +
        (dreams.slice(0, 4).map(f => `  \`${f}\``).join('\n') || '  _(ninguno)_') + `\n\n` +
        `🔶 *Borradores pendientes revisión humana (${pending.length}):*\n` +
        (pending.length ? pending.map(f => `• \`${f}\``).join('\n') : '_(ninguno — el Juez no ha rechazado 3 ciclos consecutivos)_') + `\n\n` +
        `🧬 *Lecciones Karpathy por área:*\n` +
        specs.map(f => `• ${f.replace('.md', '')}`).join('  ') + `\n\n` +
        `Usa */dream [área]* para iniciar un nuevo ciclo de decantación.`
      );
      return;
    } catch (_) {}
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
