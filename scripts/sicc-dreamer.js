/**
 * SICC Dreamer v1.0.0 — Caza-Incoherencias Proactivo
 * Ejecutado por cron a las 2:00 AM cuando el sistema está ocioso.
 *
 * Filosofía (claw-code): "Humans set direction; claws perform the labor."
 * El Dreamer es el claw que trabaja mientras Diego duerme.
 *
 * Flujo:
 *  1. Lee brain/DREAMS.md → extrae hipótesis pendientes
 *  2. Para cada hipótesis: verifica recursos → ejecuta análisis con Ollama
 *  3. Deposita borradores de DT en brain/PENDING_DTS.md
 *  4. Notifica via Telegram (opcional, modo silencioso si no hay token)
 */
'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');
const { checkYEncolar, getCpuLoad } = require('./resource-governor');
const config = require('../src/config');

const AGENTE_ROOT = path.join(__dirname, '..');
const BRAIN_ROOT  = config.paths.brain;
const DREAMS_FILE = path.join(BRAIN_ROOT, 'DREAMS.md');
const PENDING_DTS = path.join(BRAIN_ROOT, 'PENDING_DTS.md');
const LOG_FILE    = path.join(AGENTE_ROOT, 'data/logs/dreamer.log');

const DRY_RUN = process.argv.includes('--dry-run');

// ── Logger ───────────────────────────────────────────────────────────────────
function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try { fs.appendFileSync(LOG_FILE, line + '\n'); } catch (_) { /* sin permisos en dev */ }
}

// ── Parsear la cola de sueños ─────────────────────────────────────────────────
function parsearDreams() {
  if (!fs.existsSync(DREAMS_FILE)) return [];

  const contenido = fs.readFileSync(DREAMS_FILE, 'utf8');
  const lineas = contenido.split('\n');
  const pendientes = [];

  for (const linea of lineas) {
    // Formato: - [ ] [PRIORIDAD] [TIMESTAMP] [origen:X] hipótesis
    const match = linea.match(/^-\s*\[[\s/x]?\]\s*\[(\w+)\]\s*\[([^\]]+)\]\s*\[origen:([^\]]+)\]\s*(.+)$/);
    if (match) {
      pendientes.push({
        prioridad: match[1],
        timestamp: match[2],
        origen: match[3],
        hipotesis: match[4].trim(),
        raw: linea,
      });
    }
  }

  // Ordenar: HIGH > NORMAL > LOW
  const weight = { 'HIGH': 3, 'NORMAL': 2, 'LOW': 1 };
  return pendientes.sort((a, b) => (weight[b.prioridad] || 0) - (weight[a.prioridad] || 0));
}

// ── Marcar hipótesis como procesada ──────────────────────────────────────────
function marcarProcesada(raw) {
  if (!fs.existsSync(DREAMS_FILE)) return;
  const contenido = fs.readFileSync(DREAMS_FILE, 'utf8');
  const actualizado = contenido.replace(raw, raw.replace(/^- \[/, '- [DONE:'));
  fs.writeFileSync(DREAMS_FILE, actualizado);
}

// ── Llamar al agente Ollama (inferencia asíncrona) ───────────────────────────
async function inferirConOllama(hipotesis) {
  if (DRY_RUN) {
    log(`[DRY-RUN] Simulando inferencia para: "${hipotesis.substring(0, 60)}"`);
    return `[DRY-RUN] Borrador simulado para validación de: ${hipotesis}`;
  }

  // Importamos dinámicamente para no cargar el config completo en modo cron
  const OpenAI = require('openai');
  const ollamaHost = process.env.OLLAMA_HOST || 'http://ollama:11434';
  const ollamaModel = process.env.OLLAMA_MODEL || 'gemma4-light:latest';

  const client = new OpenAI({ baseURL: `${ollamaHost}/v1`, apiKey: 'ollama' });

  const { construirSystemPrompt } = require('../src/brain');
  const brainFull = construirSystemPrompt('full');

  const systemPrompt = `Eres el AUDITOR FORENSE SICC operando en modo AUTÓNOMO (Dreamer).\n\n` + 
    `CEREBRO DE REFERENCIA:\n${brainFull}\n\n` +
    `Tu misión es aplicar la METODOLOGÍA PUNTO 42 para realizar una RE-INGENIERÍA DE COHERENCIA TÉCNICA.\n\n` +
    `DEBES GENERAR DOS BLOQUES DISTINTOS PARA CADA HALLAZGO:\n\n` +
    `1. [DJ] DICTAMEN JURÍDICO: Define la REGLA DE NEGOCIO basada en el Contrato Maestro. Es el sustento legal y la restricción (Ej: "La Cláusula X prohíbe Y"). Destino: Carpeta de Dictámenes.\n` +
    `2. [DT] DECISIÓN TÉCNICA: Define la EJECUCIÓN TÉCNICA en la WBS. Es el ajuste de cantidades o especificaciones (Ej: "Reducir de 4 a 3 puestos en el ítem L3-Z"). Destino: WBS / Ingeniería.\n\n` +
    `FILOSOFÍA: Deducción N-1. Si no hay Verbo Rector en el Contrato, es excedente (Grasa).`;

  const respuesta = await client.chat.completions.create({
    model: ollamaModel,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `HIPÓTESIS A ANALIZAR:\n${hipotesis}` },
    ],
  });

  return respuesta.choices[0].message.content;
}

// ── Depositar DT en PENDING_DTS.md ───────────────────────────────────────────
function depositarDT(hipotesis, borrador) {
  const timestamp = new Date().toISOString();
  const dtId = `DT-DREAM-${Date.now()}`;

  const entrada = `\n## ${dtId} — Generado: ${timestamp}\n` +
    `> **Hipótesis origen:** ${hipotesis.substring(0, 150)}\n\n` +
    `${borrador}\n\n` +
    `---\n` +
    `*Requiere aprobación de Diego. Responde /aprobar ${dtId} para aplicarlo.*\n`;

  if (!fs.existsSync(PENDING_DTS)) {
    fs.writeFileSync(PENDING_DTS,
      '# 📋 SICC PENDING DTs — Borradores Generados por el Dreamer\n\n' +
      '> Estas Decisiones Técnicas fueron generadas de forma autónoma durante el ciclo de sueño.\n' +
      '> Requieren aprobación de Diego antes de aplicarse a LFC2.\n\n'
    );
  }

  fs.appendFileSync(PENDING_DTS, entrada);
  log(`[DREAMER] ✅ DT depositado: ${dtId}`);
  return dtId;
}

// ── Loop Principal ────────────────────────────────────────────────────────────
async function runDreamer() {
  log('[DREAMER] 💤 Ciclo de Sueño iniciado.');
  log(`[DREAMER] CPU actual: ${Math.round(getCpuLoad() * 100)}%`);

  // Control de CPU: el Dreamer tiene su propio límite. Respetamos el Hard-Cap SICC.
  const cpuLoad = getCpuLoad();
  const force = process.argv.includes('--force');
  if (cpuLoad > 0.80 && !DRY_RUN && !force) {
    log('[DREAMER] ⚠️ CPU > 80%. Dreamer posponiendo ejecución. Hasta mañana.');
    process.exit(0);
  }

  const hipotesis = parsearDreams();

  if (hipotesis.length === 0) {
    log('[DREAMER] 🌙 No hay hipótesis pendientes. Sueño tranquilo.');
    process.exit(0);
  }

  log(`[DREAMER] 📋 ${hipotesis.length} hipótesis encontradas. Procesando...`);

  let procesadas = 0;
  const dtIds = [];

  for (const item of hipotesis) {
    // Solo procesar 3 hipótesis por ciclo para no saturar
    if (procesadas >= 3) {
      log('[DREAMER] ⏱️ Límite de 3 hipótesis por ciclo alcanzado. Guardando el resto para mañana.');
      break;
    }

    // Verificar recursos antes de cada inferencia (honor --force)
    const recursos = force ? { ok: true } : checkYEncolar(item.hipotesis, 'dreamer');
    if (!recursos.ok && !DRY_RUN) {
      log(`[DREAMER] 🚦 Recursos insuficientes para hipótesis. Posponiendo.`);
      continue;
    }

    log(`[DREAMER] 🔬 Analizando [${item.prioridad}]: "${item.hipotesis.substring(0, 60)}..."`);

    try {
      const borrador = await inferirConOllama(item.hipotesis);
      const dtId = depositarDT(item.hipotesis, borrador);
      marcarProcesada(item.raw);
      dtIds.push(dtId);
      procesadas++;

      // Pausa de 30s entre inferencias para respetar el Hard-Cap
      if (procesadas < 3 && !DRY_RUN) {
        log('[DREAMER] ⏸️ Pausa de 30s entre inferencias (Hard-Cap protect)...');
        await new Promise(r => setTimeout(r, 30000));
      }
    } catch (err) {
      log(`[DREAMER] ❌ Error procesando hipótesis: ${err.message}`);
    }
  }

  // Resumen
  log(`[DREAMER] 🌅 Ciclo completado. ${procesadas} hipótesis procesadas. DTs generados: ${dtIds.join(', ')}`);

  // Notificación Telegram (opcional — no bloquea si falla)
  if (procesadas > 0) {
    try {
      await notificarTelegram(procesadas, dtIds);
    } catch (_) { /* silencioso si el bot no está disponible */ }
  }

  process.exit(0);
}

async function notificarTelegram(count, dtIds) {
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_USER_ID) return;

  // Cargamos el .env si estamos en modo cron
  const tokenFile = path.join(AGENTE_ROOT, '.env');
  if (fs.existsSync(tokenFile) && !process.env.TELEGRAM_BOT_TOKEN) {
    const lines = fs.readFileSync(tokenFile, 'utf8').split('\n');
    for (const l of lines) {
      const [k, v] = l.split('=');
      if (k && v) process.env[k.trim()] = v.trim();
    }
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const userId = process.env.TELEGRAM_USER_ID;
  if (!token || !userId) return;

  const msg = `💤 *SICC Dreamer | Reporte de Vigilia*\n\n` +
    `Mientras dormías, analicé ${count} hipótesis técnicas.\n\n` +
    `📋 *Borradores generados:*\n` +
    dtIds.map(id => `- \`${id}\``).join('\n') +
    `\n\nRevisa \`brain/PENDING_DTS.md\` y responde \`/aprobar [ID]\` para aplicarlos.`;

  const fetch = (await import('node-fetch')).default;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: userId, text: msg, parse_mode: 'Markdown' }),
  });

  log('[DREAMER] 📱 Notificación enviada a Telegram.');
}

runDreamer().catch(err => {
  log(`[DREAMER] 💥 Error fatal: ${err.message}`);
  process.exit(1);
});
