// gitlocal.js — Operaciones git locales sobre el repo LFC2 montado en el contenedor
'use strict';

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const REPO_PATH = '/app/repos/LFC2';
const REPO_NAME = 'LFC2';

function exec(cmd) {
  return execSync(cmd, { cwd: REPO_PATH, encoding: 'utf8', timeout: 30000 }).trim();
}

/**
 * Verifica que el repo está montado y disponible
 */
function repoDisponible() {
  return fs.existsSync(path.join(REPO_PATH, '.git'));
}

/**
 * git pull — trae los últimos cambios de GitHub
 */
function pull() {
  if (!repoDisponible()) throw new Error('Repo LFC2 no está montado en /app/repos/LFC2');
  const resultado = exec('git pull origin main');
  console.log(`[GIT] ✅ pull: ${resultado}`);
  return resultado;
}

/**
 * git status — estado del working tree
 */
function status() {
  if (!repoDisponible()) throw new Error('Repo LFC2 no disponible');
  return exec('git status --short');
}

/**
 * git log — últimos N commits locales
 */
function log(n = 5) {
  if (!repoDisponible()) throw new Error('Repo LFC2 no disponible');
  return exec(`git log --oneline -${n}`);
}

/**
 * git diff --stat — resumen de cambios pendientes
 */
function diffStat() {
  if (!repoDisponible()) throw new Error('Repo LFC2 no disponible');
  try {
    return exec('git diff --stat HEAD') || '(sin cambios)';
  } catch {
    return '(sin cambios)';
  }
}

/**
 * git add + commit + push
 */
function commitYPush(mensaje) {
  if (!repoDisponible()) throw new Error('Repo LFC2 no disponible');
  exec('git add -A');
  const commit = exec(`git commit -m "${mensaje.replace(/"/g, "'")}"`);
  const push   = exec('git push origin main');
  console.log(`[GIT] ✅ commit+push: ${commit}`);
  return { commit, push };
}

/**
 * Listar archivos de una ruta dentro del repo (usa fs local, no API)
 */
function listarLocal(ruta = '') {
  const rutaCompleta = path.join(REPO_PATH, ruta);
  if (!fs.existsSync(rutaCompleta)) throw new Error(`Ruta no existe: ${ruta}`);
  const items = fs.readdirSync(rutaCompleta, { withFileTypes: true });
  return items.map(i => `${i.isDirectory() ? '📁' : '📄'} ${i.name}`).sort();
}

/**
 * Leer un archivo del repo local
 */
function leerLocal(ruta) {
  const rutaCompleta = path.join(REPO_PATH, ruta);
  if (!fs.existsSync(rutaCompleta)) throw new Error(`Archivo no existe: ${ruta}`);
  return fs.readFileSync(rutaCompleta, 'utf8');
}

/**
 * Escribir un archivo en el repo local
 */
function escribirLocal(ruta, contenido) {
  const rutaCompleta = path.join(REPO_PATH, ruta);
  fs.mkdirSync(path.dirname(rutaCompleta), { recursive: true });
  fs.writeFileSync(rutaCompleta, contenido, 'utf8');
  console.log(`[GIT] ✅ Archivo escrito: ${ruta}`);
}

module.exports = { repoDisponible, pull, status, log, diffStat, commitYPush, listarLocal, leerLocal, escribirLocal, REPO_PATH, REPO_NAME };
