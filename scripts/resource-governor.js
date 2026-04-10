/**
 * SICC Resource Governor v1.0.0
 * Protege el host de 4 núcleos del colapso bajo carga de inferencia.
 * Implementa una política de encolado proactivo basada en la carga de CPU.
 */
'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const config = require('../src/config');

const DREAMS_FILE = path.join(config.paths.brain, 'DREAMS.md');
const CPU_ALERT_THRESHOLD = 0.99; // 99% de carga → permitir manual hoy
const CPU_CRITICAL_THRESHOLD = 0.99; // 99% → permitir manual hoy

/**
 * Retorna la carga de CPU normalizada (0.0 a 1.0) sobre el núcleo más cargado.
 * Usa el promedio de 1 minuto de os.loadavg(), normalizado por núm. de CPUs.
 */
function getCpuLoad() {
  const [load1m] = os.loadavg();
  const cpus = os.cpus().length;
  return load1m / cpus;
}

/**
 * Evalúa si el sistema tiene capacidad para una inferencia Ollama.
 * @returns {{ ok: boolean, level: 'OK'|'WARN'|'CRITICAL', load: number, message: string }}
 */
function evaluarRecursos() {
  const load = getCpuLoad();
  const mem = process.memoryUsage();

  if (load >= CPU_CRITICAL_THRESHOLD) {
    return {
      ok: false,
      level: 'CRITICAL',
      load,
      message: `⛔ CPU al ${Math.round(load * 100)}%. Sistema bajo carga crítica. Operación rechazada.`,
    };
  }

  if (load >= CPU_ALERT_THRESHOLD) {
    return {
      ok: false,
      level: 'WARN',
      load,
      message: `⚠️ CPU al ${Math.round(load * 100)}%. Operación encolada en el Dreamer para ejecución nocturna.`,
    };
  }

  return {
    ok: true,
    level: 'OK',
    load,
    message: `✅ CPU al ${Math.round(load * 100)}%. Recursos disponibles para inferencia.`,
  };
}

/**
 * Encola una hipótesis en brain/DREAMS.md para que el Dreamer la procese.
 * @param {string} prompt - El prompt que no pudo procesarse por falta de recursos.
 * @param {string} origen - Quién disparó la solicitud (ej: 'swarm', 'karpathy', 'usuario')
 */
function encolarEnDreamer(prompt, origen = 'usuario') {
  const timestamp = new Date().toISOString();
  const prioridad = origen === 'swarm' ? 'HIGH' : 'NORMAL';
  const entrada = `\n- [${prioridad}] [${timestamp}] [origen:${origen}] ${prompt.substring(0, 200)}\n`;

  // Asegurar que DREAMS.md existe
  if (!fs.existsSync(DREAMS_FILE)) {
    fs.writeFileSync(DREAMS_FILE,
      '# 💤 SICC DREAMS — Cola de Hipótesis Forenses\n\n' +
      '> Operaciones encoladas para ejecución autónoma por el SICC Dreamer.\n\n' +
      '## Pendientes\n'
    );
  }

  fs.appendFileSync(DREAMS_FILE, entrada);
  console.log(`[GOVERNOR] 💤 Operación encolada en DREAMS.md: "${prompt.substring(0, 50)}..."`);
}

/**
 * Middleware de verificación de recursos. Retorna true si se puede proceder.
 * Si los recursos son insuficientes, encola el prompt y retorna false.
 * @param {string} prompt
 * @param {string} origen
 * @returns {boolean}
 */
function checkYEncolar(prompt, origen = 'usuario') {
  const estado = evaluarRecursos();
  console.log(`[GOVERNOR] 📊 Carga CPU: ${Math.round(estado.load * 100)}% → ${estado.level}`);

  if (!estado.ok) {
    encolarEnDreamer(prompt, origen);
  }

  return { ...estado };
}

module.exports = { evaluarRecursos, encolarEnDreamer, checkYEncolar, getCpuLoad };
