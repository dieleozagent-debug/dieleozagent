'use strict';

const fs = require('fs');
const path = require('path');
const { evaluarRecursos } = require('../scripts/resource-governor');
const { exec } = require('child_process');
const config = require('./config');

const STATE_FILE = path.join(__dirname, '../data/patrol-state.json');
const REPO_ROOT = config.paths.lfc2;

let patrolActive = false;
let currentFolderIndex = 0;

/**
 * Estado Inicial de Patrulla
 */
function cargarEstado() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    } catch (e) {
      return { lastFolderIndex: 0, active: false };
    }
  }
  return { lastFolderIndex: 0, active: false };
}

function guardarEstado() {
  fs.writeFileSync(STATE_FILE, JSON.stringify({
    lastFolderIndex: currentFolderIndex,
    active: patrolActive,
    timestamp: new Date().toISOString()
  }, null, 2));
}

/**
 * Motor de Bucle Infinito
 */
async function buclePatrulla(bot, chatId) {
  if (!patrolActive) return;

  // 1. Verificar Recursos
  const recursos = evaluarRecursos();
  if (!recursos.ok) {
    console.log(`[PATROL] [SICC SLEEP] Pausa por recursos: ${recursos.message}`);
    // Reintentar en 5 minutos
    setTimeout(() => buclePatrulla(bot, chatId), 5 * 60 * 1000);
    return;
  }

  // 2. Obtener lista de carpetas
  const folders = fs.readdirSync(REPO_ROOT)
    .filter(f => fs.statSync(path.join(REPO_ROOT, f)).isDirectory())
    .filter(f => !['.git', 'node_modules', 'bin', 'scripts', 'old', 'Reportes'].includes(f))
    .sort();

  if (currentFolderIndex >= folders.length) {
    currentFolderIndex = 0; // Reiniciar ciclo
    console.log('[PATROL] 🔄 Ciclo completo de LFC2 finalizado. Reiniciando...');
  }

  const target = folders[currentFolderIndex];
  console.log(`[PATROL] 🚀 Auditando carpeta [${currentFolderIndex + 1}/${folders.length}]: ${target}`);

  // 3. Ejecutar Auditoría Forense
  const cmd = `node scripts/forensic_auditor.js "${target}"`;
  
  exec(cmd, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    // Registrar hallazgos (los dictámenes se guardan en history/ si hay hallazgos críticos)
    const logPath = path.join(__dirname, '../data/logs/patrol.log');
    const entry = `\n--- [${new Date().toISOString()}] Audit: ${target} ---\n${stdout}\n${stderr}\n`;
    fs.appendFileSync(logPath, entry);

    if (error) {
      console.warn(`[PATROL] [SICC WARN] Error auditando ${target}: ${error.message}`);
    }

    currentFolderIndex++;
    guardarEstado();

    // Siguiente iteración tras un breve descanso (2 minutos) para no estresar el disco
    if (patrolActive) {
      setTimeout(() => buclePatrulla(bot, chatId), 2 * 60 * 1000);
    }
  });
}

/**
 * Controladores del Bot
 */
function startPatrol(bot, chatId) {
  if (patrolActive) return '🛰️ La patrulla ya está activa.';
  
  const estado = cargarEstado();
  patrolActive = true;
  currentFolderIndex = estado.lastFolderIndex;
  
  buclePatrulla(bot, chatId);
  guardarEstado();
  return `🚀 **Modo Patrulla Forense Activado.** Iniciando desde carpeta #${currentFolderIndex + 1}. Escaneo determinístico N-1 en curso.`;
}

function stopPatrol() {
  patrolActive = false;
  guardarEstado();
  return '🛑 **Patrulla Forense Detenida.** El sistema ha entrado en reposo soberano.';
}

function getPatrolStatus() {
  const recursos = evaluarRecursos();
  return {
    active: patrolActive,
    folderIndex: currentFolderIndex,
    cpu: Math.round(recursos.load * 100),
    msg: `[SICC GUARD] ${recursos.message}`
  };
}

module.exports = { startPatrol, stopPatrol, getPatrolStatus };
