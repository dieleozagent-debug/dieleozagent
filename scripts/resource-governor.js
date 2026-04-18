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
const AUDIT_QUEUE = path.join(config.paths.brain, 'AUDIT_QUEUE.md');

// Umbrales SICC v12.0 (Protección de Host de 4 núcleos)
const CPU_ALERT_THRESHOLD = 0.80;    // 80% → El Auditor debe encolar (Modo Diferido)
const CPU_CRITICAL_THRESHOLD = 0.95; // 95% → Bloqueo total (Inferencia rechazada)

function isWeekend() {
  const now = new Date();
  const day = now.getDay(); // 0: Dom, 1: Lun, ..., 5: Vie, 6: Sab
  const hour = now.getHours();
  if (day === 0 || day === 6) return true;
  if (day === 5 && hour >= 17) return true; // Viernes tarde
  if (day === 1 && hour < 7) return true;   // Lunes madrugada
  return false;
}

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

  if (isWeekend()) {
    return {
      ok: true,
      level: 'AGGRESSIVE',
      load,
      message: `🚀 MODO AGRESIVO FDS ACTIVADO. CPU al ${Math.round(load * 100)}%. Ignorando límites para agotar cola.`,
    };
  }

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
      message: `⚠️ CPU al ${Math.round(load * 100)}%. Operación encolada para ejecución diferida por el Auditor.`,
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
 * Encola una hipótesis en brain/AUDIT_QUEUE.md para que sea procesada en diferido.
 * @param {string} prompt - El prompt que no pudo procesarse por falta de recursos.
 * @param {string} origen - Quién disparó la solicitud (ej: 'sonda', 'forensic', 'usuario')
 */
function encolarHipotesisForense(prompt, origen = 'usuario') {
  const timestamp = new Date().toISOString();
  const prioridad = origen === 'sonda' ? 'HIGH' : 'NORMAL';
  const entrada = `\n- [${prioridad}] [${timestamp}] [origen:${origen}] ${prompt.substring(0, 200)}\n`;

  // Asegurar que AUDIT_QUEUE.md existe
  if (!fs.existsSync(AUDIT_QUEUE)) {
    fs.writeFileSync(AUDIT_QUEUE,
      '# 🔬 SICC AUDIT QUEUE — Cola de Hipótesis Forenses\n\n' +
      '> Operaciones encoladas para ejecución diferida por el Motor de Auditoría SICC.\n\n' +
      '## Pendientes\n'
    );
  }

  fs.appendFileSync(AUDIT_QUEUE, entrada);
  console.log(`[GOVERNOR] 🔬 Operación encolada en AUDIT_QUEUE.md: "${prompt.substring(0, 50)}..."`);
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
    encolarHipotesisForense(prompt, origen);
  }

  return { ...estado };
}

module.exports = { evaluarRecursos, encolarHipotesisForense, checkYEncolar, getCpuLoad };
