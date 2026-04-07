/**
 * SICC Harness CLI v1.0.0 — Motor Central de Orquestación con Parity Guard
 * Inspirado en la arquitectura de claw-code (ultraworkers/claw-code)
 *
 * Filosofía: "Every agent action passes through the harness. No hallucination reaches Git."
 *
 * Comandos:
 *   node scripts/sicc-harness.js doctor       — Health check completo
 *   node scripts/sicc-harness.js learn        — Auto-mapeo de LFC2
 *   node scripts/sicc-harness.js audit [ruta] — Karpathy Loop sobre archivo/carpeta
 *   node scripts/sicc-harness.js dream        — Procesar una hipótesis del Dreamer
 *   node scripts/sicc-harness.js status       — Estado del sistema (CPU, memoria, Git)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

const AGENTE_ROOT = path.join(__dirname, '..');
const LFC2_ROOT   = '/home/administrador/docker/LFC2';
const BRAIN_ROOT  = path.join(AGENTE_ROOT, 'brain');
const DREAMS_FILE = path.join(BRAIN_ROOT, 'DREAMS.md');
const PENDING_DTS = path.join(BRAIN_ROOT, 'PENDING_DTS.md');

// ── 1. PARITY GUARD ─────────────────────────────────────────────────────────
// Valida que los conceptos de una propuesta existen en el SSOT.
// Esta es la capa que atrapa alucinaciones ANTES de que toquen Git.

const SOVEREIGN_TERMS = [
  'Red Vital IP', 'G.652.D', 'Contadores de Ejes SIL-4', 'EN 50716:2023',
  'AREMA 2021', 'PTC Virtual', 'Baliza Virtual (GNSS)',
];

const LEGACY_TERMS = [
  'Caja Negra', 'Eurobaliza', 'GSM-R', 'DWDM', 'G.655',
  'EN 50128', 'Circuitos de Vía', 'mantenimiento físico correctivo',
];

function parityGuard(texto) {
  const hallucinations = [];

  // Detectar términos legacy que no deberían aparecer en propuestas nuevas
  for (const term of LEGACY_TERMS) {
    if (texto.toLowerCase().includes(term.toLowerCase())) {
      hallucinations.push({ tipo: 'LEGACY_CONTAMINATION', termino: term });
    }
  }

  if (hallucinations.length > 0) {
    console.error('[HARNESS] ⛔ PARITY GUARD activado — Alucinaciones detectadas:');
    hallucinations.forEach(h => console.error(`   → ${h.tipo}: "${h.termino}"`));
    return { pass: false, hallucinations };
  }

  console.log('[HARNESS] ✅ PARITY GUARD: texto aprobado — sin impurezas detectadas.');
  return { pass: true, hallucinations: [] };
}

// ── 2. COMANDOS ──────────────────────────────────────────────────────────────

function cmdDoctor() {
  console.log('\n🩺 SICC DOCTOR — Diagnóstico de Salud Soberana v6.4');
  console.log('═'.repeat(55));

  let score = 100;
  const errores = [];

  // CPU load
  const [load1m] = os.loadavg();
  const cpuCount = os.cpus().length;
  const cpuPct = Math.round((load1m / cpuCount) * 100);
  if (cpuPct > 70) {
    score -= 15;
    errores.push(`CPU alta: ${cpuPct}% (umbral: 70%)`);
    console.log(`[WARN]  CPU: ${cpuPct}% — Por encima del umbral`);
  } else {
    console.log(`[PASS]  CPU: ${cpuPct}% — OK`);
  }

  // Memoria disponible
  const freeMem = Math.round(os.freemem() / 1024 / 1024);
  const totalMem = Math.round(os.totalmem() / 1024 / 1024);
  if (freeMem < 512) {
    score -= 10;
    errores.push(`Memoria libre baja: ${freeMem}MB`);
    console.log(`[WARN]  Memoria libre: ${freeMem}/${totalMem}MB`);
  } else {
    console.log(`[PASS]  Memoria libre: ${freeMem}/${totalMem}MB`);
  }

  // Archivos clave del cerebro
  const brainFiles = ['SOUL.md', 'DBCD_CRITERIA.md', 'RESEARCH_LOG.md', 'IDENTITY.md'];
  for (const f of brainFiles) {
    const exists = fs.existsSync(path.join(BRAIN_ROOT, f));
    if (!exists) { score -= 10; errores.push(`Brain: falta ${f}`); }
    console.log(`[${exists ? 'PASS' : 'FAIL'}]  Brain/${f}`);
  }

  // Git status de LFC2
  try {
    const gitStatus = execSync(`git -C ${LFC2_ROOT} status --porcelain`).toString().trim();
    if (gitStatus) {
      console.log(`[WARN]  LFC2 tiene cambios sin commit (${gitStatus.split('\n').length} archivos)`);
    } else {
      console.log('[PASS]  LFC2 — Git limpio');
    }
  } catch (e) {
    score -= 5; errores.push('No se puede acceder a git LFC2');
    console.log('[FAIL]  LFC2 — Git inaccesible');
  }

  // Dreamer queue
  const dreamCount = fs.existsSync(DREAMS_FILE)
    ? (fs.readFileSync(DREAMS_FILE, 'utf8').match(/^- \[/gm) || []).length
    : 0;
  console.log(`[INFO]  Dreamer queue: ${dreamCount} hipótesis pendientes`);

  // Resultado
  console.log('\n' + '═'.repeat(55));
  console.log(`📊 HEALTH SCORE: ${score}/100`);
  if (errores.length > 0) {
    console.log('\n❌ Errores:');
    errores.forEach(e => console.log(`   - ${e}`));
  } else {
    console.log('🚀 Sistema soberano y operativo.');
  }
  return score;
}

function cmdLearn() {
  console.log('\n📚 SICC LEARN — Auto-mapeo de LFC2...');
  try {
    const output = execSync(`node ${path.join(AGENTE_ROOT, 'scripts/lfc_learn.js')}`).toString();
    console.log(output);
    console.log('[HARNESS] ✅ Mapeo completado.');
  } catch (e) {
    console.error('[HARNESS] ❌ Error en lfc_learn.js:', e.message);
    process.exit(1);
  }
}

function cmdAudit(ruta = LFC2_ROOT) {
  console.log(`\n🔬 SICC AUDIT — Karpathy Loop sobre: ${ruta}`);
  try {
    const output = execSync(`node ${path.join(AGENTE_ROOT, 'scripts/karpathy_audit.js')} ${ruta}`).toString();
    console.log(output);
  } catch (e) {
    console.error('[HARNESS] ❌ Error en karpathy_audit.js:', e.message);
    process.exit(1);
  }
}

function cmdStatus() {
  console.log('\n📡 SICC STATUS — Estado del sistema');
  console.log('═'.repeat(55));
  const [l1, l5, l15] = os.loadavg();
  const cpus = os.cpus().length;
  console.log(`CPU Cores:    ${cpus}`);
  console.log(`Load (1m):    ${Math.round(l1 / cpus * 100)}%`);
  console.log(`Load (5m):    ${Math.round(l5 / cpus * 100)}%`);
  console.log(`Load (15m):   ${Math.round(l15 / cpus * 100)}%`);
  console.log(`Mem libre:    ${Math.round(os.freemem() / 1024 / 1024)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB`);
  const dreamCount = fs.existsSync(DREAMS_FILE)
    ? (fs.readFileSync(DREAMS_FILE, 'utf8').match(/^- \[/gm) || []).length : 0;
  const dtCount = fs.existsSync(PENDING_DTS)
    ? (fs.readFileSync(PENDING_DTS, 'utf8').match(/^## DT-/gm) || []).length : 0;
  console.log(`Dreams queue: ${dreamCount} hipótesis`);
  console.log(`Pending DTs:  ${dtCount} borradores`);
}

// ── 3. ENTRY POINT ───────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'doctor':  process.exit(cmdDoctor() >= 70 ? 0 : 1);
  case 'learn':   cmdLearn(); break;
  case 'audit':   cmdAudit(args[0]); break;
  case 'status':  cmdStatus(); break;
  default:
    console.log('SICC Harness CLI v6.4\nUso: node sicc-harness.js [doctor|learn|audit|status]');
    break;
}

// Exportar para uso como módulo desde src/index.js
module.exports = { parityGuard, cmdDoctor, cmdAudit, cmdLearn, cmdStatus };
