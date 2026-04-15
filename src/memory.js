// memory.js — Persistencia de conversaciones en archivos Markdown diarios
'use strict';

const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, '../data');
const MEMORY_DIR = path.join(DATA_DIR, 'memory');
const MAX_DIAS_CARGAR = 3; 

// Asegura que el directorio existe
if (!fs.existsSync(MEMORY_DIR)) {
  try {
    fs.mkdirSync(MEMORY_DIR, { recursive: true });
  } catch (err) {
    console.warn(`[MEMORY] [SICC WARN] No se pudo crear el directorio de memoria: ${err.message}`);
  }
}

/**
 * Retorna la ruta del archivo de memoria del día de hoy
 */
function archivoHoy() {
  const hoy = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(MEMORY_DIR, `${hoy}.md`);
}

/**
 * Guarda un intercambio (usuario + agente) en el archivo del día
 */
function guardar(textoUsuario, textoAgente, proveedor) {
  const ahora = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  const entrada =
    `\n### ${ahora}\n` +
    `**Diego:** ${textoUsuario}\n\n` +
    `**OpenGravity** *(${proveedor})*: ${textoAgente}\n\n` +
    `---\n`;

  try {
    const archivo = archivoHoy();
    // Crear cabecera si el archivo es nuevo
    if (!fs.existsSync(archivo)) {
      const fecha = new Date().toLocaleDateString('es-CO', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      fs.writeFileSync(archivo, `# Memoria — ${fecha}\n\n`);
    }
    fs.appendFileSync(archivo, entrada);
  } catch (err) {
    console.warn(`[MEMORY] [SICC WARN] No se pudo guardar: ${err.message}`);
  }
}

/**
 * Lee los últimos N días de memoria y los retorna como string para el system prompt
 */
function cargarMemoriaReciente() {
  try {
    const archivos = fs.readdirSync(MEMORY_DIR)
      .filter(f => f.endsWith('.md'))
      .sort()                        // orden cronológico
      .slice(-MAX_DIAS_CARGAR);      // últimos N días

    if (archivos.length === 0) return '';

    const contenido = archivos
      .map(f => fs.readFileSync(path.join(MEMORY_DIR, f), 'utf8').trim())
      .join('\n\n');

    console.log(`[MEMORY] [SICC OK] Cargados ${archivos.length} día(s) de memoria: ${archivos.join(', ')}`);
    return contenido;
  } catch (err) {
    console.warn(`[MEMORY] [SICC WARN] No se pudo cargar memoria: ${err.message}`);
    return '';
  }
}

/**
 * Retorna un resumen de estadísticas de memoria
 */
function estadoMemoria() {
  try {
    const archivos = fs.readdirSync(MEMORY_DIR).filter(f => f.endsWith('.md'));
    if (archivos.length === 0) return '📭 Sin memoria guardada aún';
    const ultimo = archivos.sort().slice(-1)[0].replace('.md', '');
    return `📅 ${archivos.length} día(s) almacenado(s) · Último: ${ultimo}`;
  } catch {
    return '[SICC FAIL] Error al leer memoria';
  }
}

module.exports = { guardar, cargarMemoriaReciente, estadoMemoria };
