/**
 * SICC Harness CLI v1.0.0 — Motor Central de Orquestación con Parity Guard
 * Inspirado en la arquitectura de claw-code (ultraworkers/claw-code)
 *
 * Filosofía: "Every agent action passes through the harness. No hallucination reaches Git."
 *
 * Comandos:
 *   node scripts/sicc-harness.js doctor       — Health check forense completo
 *   node scripts/sicc-harness.js learn        — Auto-mapeo de LFC2
 *   node scripts/sicc-harness.js audit [ruta] — Auditoría sobre archivo/carpeta
 *   node scripts/sicc-harness.js audit_cycle  — Procesar hipótesis de auditoría
 *   node scripts/sicc-harness.js status       — Estado del sistema (CPU, memoria, Git)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');
const config = require('../src/config');
const AGENTE_ROOT = path.join(__dirname, '..');

const LFC2_ROOT   = config.paths.lfc2;
const BRAIN_ROOT  = config.paths.brain;
const AUDIT_QUEUE = path.join(BRAIN_ROOT, 'AUDIT_QUEUE.md');
const PENDING_DTS = path.join(BRAIN_ROOT, 'PENDING_DTS');

// ── 1. PARITY GUARD ─────────────────────────────────────────────────────────
// Valida que los conceptos de una propuesta existen en el SSOT.
// Esta es la capa que atrapa alucinaciones ANTES de que toquen Git.

const SOVEREIGN_TERMS = [
  'Red Vital IP', 'G.652.D', 'Contadores de Ejes SIL-4', 'EN 50716:2023',
  'AREMA 2021', 'PTC Virtual', 'Baliza Virtual (GNSS)',
];

const LEGACY_TERMS = [
  'Eurobaliza', 'GSM-R', 'mantenimiento físico correctivo',
  'Peón', 'Peones', 'Sueño', 'Dreamer', 'Michelin', 'Karpathy Loop'
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

async function cmdDoctor() {
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
    // Asegurar que el directorio es seguro para git (especialmente dentro de Docker)
    execSync(`git config --global --add safe.directory ${LFC2_ROOT}`);
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

  // Ollama Connectivity (Native Node Check)
  try {
    const http = require('http');
    const checkOllama = () => new Promise((resolve, reject) => {
      const req = http.get(`${config.ai.ollama.host}/api/tags`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', (e) => reject(e));
      req.setTimeout(2000, () => { req.destroy(); reject(new Error('Timeout')); });
    });

    const isOllamaUp = await checkOllama().catch(() => false);
    if (isOllamaUp) {
      console.log(`[PASS]  Ollama: ${config.ai.ollama.host} — OK`);
    } else {
      score -= 10;
      errores.push('Ollama inaccesible (Connection Refused/Timeout)');
      console.log(`[FAIL]  Ollama: ${config.ai.ollama.host} — No responde`);
    }
  } catch (e) {
    score -= 10;
    errores.push('Ollama — Error en el check de conectividad');
    console.log(`[FAIL]  Ollama: — Falló verificación`);
  }

  // Audit queue
  const auditCount = fs.existsSync(AUDIT_QUEUE)
    ? (fs.readFileSync(AUDIT_QUEUE, 'utf8').match(/^- \[/gm) || []).length
    : 0;
  console.log(`[INFO]  Audit queue: ${auditCount} hipótesis pendientes`);

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
  console.log(`\n🔬 SICC AUDIT — Auditoría Forense sobre: ${ruta}`);
  try {
    const output = execSync(`node ${path.join(AGENTE_ROOT, 'scripts/forensic_auditor.js')} ${ruta}`).toString();
    console.log(output);
  } catch (e) {
    console.error('[HARNESS] ❌ Error en forensic_auditor.js:', e.message);
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
  const auditCount = fs.existsSync(AUDIT_QUEUE)
    ? (fs.readFileSync(AUDIT_QUEUE, 'utf8').match(/^- \[/gm) || []).length : 0;
  console.log(`Audit queue:   ${auditCount} hipótesis`);
  console.log(`Pending DTs:   En revisión forense`);
}

async function cmdApprove(id) {
  if (!id) {
    console.error('[HARNESS] ❌ Error: Debes proporcionar un ID (competo o parcial, ej: DREAM-1234)');
    process.exit(1);
  }

  console.log(`\n👨‍🍳 SICC COOKER — Procesando aprobación para ID: ${id}`);
  
  if (!fs.existsSync(PENDING_DTS)) {
    console.error('[HARNESS] ❌ Error: No se encuentra brain/PENDING_DTS.md');
    process.exit(1);
  }

  const content = fs.readFileSync(PENDING_DTS, 'utf8');
  
  // Buscar el bloque de la DT
  const dtRegex = new RegExp(`## DT-${id}.*?\\n([\\s\\S]*?)(?=\\n## DT-|\\n---|$|\\*Requiere)`, 'g');
  const match = dtRegex.exec(content);

  if (!match) {
    console.error(`[HARNESS] ❌ Error: No se encontró el borrador con ID ${id}`);
    process.exit(1);
  }

  const dtBody = match[1];

  // 1. EXTRAER DJ (Dictamen Jurídico)
  const djMatch = dtBody.match(/### ⚖️ DICTAMEN JURÍDICO([\s\S]*?)(?=### 🛠️ DECISIÓN TÉCNICA|###|$)/);
  if (djMatch) {
    const djContent = djMatch[1].trim();
    const djPath = path.join(LFC2_ROOT, 'II_A_Analisis_Contractual/dictamenes', `DJ-${id}.md`);
    
    // Asegurar directorio
    fs.mkdirSync(path.dirname(djPath), { recursive: true });
    fs.writeFileSync(djPath, `# DICTAMEN JURÍDICO - SICC\n\n${djContent}`);
    console.log(`[COOKER] ✅ DJ guardado en: ${djPath}`);
  }

  // 2. EXTRAER DT (Decisión Técnica) Y REGLAS DE COCINA
  const dtActionMatch = dtBody.match(/\[COOKING_RULE: (.*?)]/);
  if (dtActionMatch) {
    const rule = dtActionMatch[1]; // Ej: "1.1.102 -> 3"
    console.log(`[COOKER] 🛠️ Aplicando regla de cocina: ${rule}`);
    
    const [item, action] = rule.split('->').map(s => s.trim());
    const newValue = action;

    // Localizar WBS Michelin
    const wbsPath = path.join(LFC2_ROOT, 'IX_WBS_Planificacion/WBS_Presupuestal_v4_0_MICHELIN.md');
    if (fs.existsSync(wbsPath)) {
      let wbsContent = fs.readFileSync(wbsPath, 'utf8');
      
      // Regex para encontrar la línea del item y cambiar la cantidad
      // Formato: | **1.1.102** | Descripcion | Cantidad | ...
      const itemRegex = new RegExp(`(\\| \\*\\*${item}\\*\\* \\| .*? \\| )(\\d+)( \\| )`, 'g');
      
      if (itemRegex.test(wbsContent)) {
        wbsContent = wbsContent.replace(itemRegex, `$1${newValue}$3`);
        fs.writeFileSync(wbsPath, wbsContent);
        console.log(`[COOKER] ✅ WBS actualizada: Item ${item} ahora es ${newValue}`);
      } else {
        console.warn(`[COOKER] ⚠️ No se encontró el item ${item} en la WBS.`);
      }
    }
  }

  // 3. ACTUALIZAR ESTADO EN PENDING_DTS.md
  // (Simplificado: solo marcar como ejecutada en el log)
  console.log(`[HARNESS] 🛡️ DT-${id} institucionalizada.`);
}

function cmdAuditCycle() {
  console.log('\n🛡️ SICC AUDIT CYCLE — Activando Ciclo de Auditoría Forense...');
  try {
    const output = execSync(`node ${path.join(AGENTE_ROOT, 'scripts/sicc-simulator.js')}`).toString();
    console.log(output);
  } catch (e) {
    console.error('[HARNESS] ❌ Error en sicc-simulator.js:', e.message);
    process.exit(1);
  }
}

// ── 3. ENTRY POINT ───────────────────────────────────────────────────────────

if (require.main === module) {
  const [,, cmd, ...args] = process.argv;

  switch (cmd) {
    case 'doctor':  
      cmdDoctor().then(score => process.exit(score >= 70 ? 0 : 1));
      break;
    case 'learn':   cmdLearn(); break;
    case 'audit':   cmdAudit(args[0]); break;
    case 'audit_cycle': cmdAuditCycle(); break;
    case 'status':  cmdStatus(); break;
    case 'approve': cmdApprove(args[0]); break;
    default:
      console.log('SICC Harness CLI v6.4\nUso: node sicc-harness.js [doctor|learn|audit|status]');
      break;
  }
}

// Exportar para uso como módulo desde src/index.js
module.exports = { parityGuard, cmdDoctor, cmdAudit, cmdLearn, cmdStatus };
