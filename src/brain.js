// brain.js — Lee los archivos .md del cerebro e inyecta contexto en el system prompt
'use strict';

const fs = require('fs');
const path = require('path');

// Los archivos del cerebro viven en el volumen persistente (Docker) o localmente (Desarrollo)
const BRAIN_DIR = fs.existsSync('/app/data/brain') 
  ? '/app/data/brain' 
  : path.join(__dirname, '../brain');

// Orden y peso de los archivos en el system prompt
const BRAIN_FILES = [
  { file: 'SOUL.md',            label: 'ALMA Y PERSONALIDAD',    required: true  },
  { file: 'LFC_ROLE.md',        label: 'ROL CONTRACTUAL LFC',    required: false },
  { file: 'DBCD_CRITERIA.md',   label: 'CRITERIOS DISEÑO & CAPEX', required: false },
  { file: 'P42_METODOLOGIA.md', label: 'METODOLOGÍA PUNTO 42',   required: false },
  { file: 'IDENTITY.md',        label: 'IDENTIDAD',              required: false },
  { file: 'USER.md',            label: 'CONTEXTO DEL USUARIO',   required: false },
  { file: 'AGENTS.md',          label: 'MANUAL OPERATIVO',       required: false },
  { file: 'TOOLS.md',           label: 'HERRAMIENTAS',           required: false },
  { file: 'PROGRAM.md',         label: 'EXPERIMENTO ACTIVO',     required: false },
  { file: 'RESEARCH_LOG.md',    label: 'LOG DE INVESTIGACIÓN',   required: false },
  { file: 'skills/web_research.md', label: 'INVESTIGACIÓN WEB',  required: false },
];

/**
 * Lee un archivo .md del brain. Retorna null si no existe.
 */
function leerArchivo(filename) {
  const filepath = path.join(BRAIN_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf8').trim();
    }
    return null;
  } catch (err) {
    console.warn(`[BRAIN] ⚠️ No se pudo leer ${filename}: ${err.message}`);
    return null;
  }
}

/**
 * Lee el HEARTBEAT.md y extrae las tareas pendientes (marcadas con [ ])
 */
function leerHeartbeat() {
  const contenido = leerArchivo('HEARTBEAT.md');
  if (!contenido) return [];

  const tareas = [];
  const lineas = contenido.split('\n');
  for (const linea of lineas) {
    if (linea.match(/^- \[ \] \*\*/)) {
      // Extrae el nombre de la tarea
      const match = linea.match(/\*\*(.+?)\*\*:(.+)/);
      if (match) {
        tareas.push({ nombre: match[1].trim(), descripcion: match[2].trim() });
      }
    }
  }
  return tareas;
}

/**
 * Construye el system prompt completo inyectando todos los archivos del brain.
 * Este es el "system prompt dinámico" que va a la IA en cada conversación.
 */
function construirSystemPrompt() {
  const secciones = [];

  secciones.push('Eres un agente de IA autónomo. Tu cerebro está definido por los siguientes archivos de configuración:\n');
  secciones.push('═'.repeat(60));

  let cargados = 0;
  for (const { file, label, required } of BRAIN_FILES) {
    const contenido = leerArchivo(file);
    if (contenido) {
      secciones.push(`\n## ${label}\n\n${contenido}`);
      secciones.push('─'.repeat(60));
      cargados++;
    } else if (required) {
      console.warn(`[BRAIN] ⚠️ Archivo requerido no encontrado: ${file}`);
    }
  }

  console.log(`[BRAIN] ✅ System prompt construido con ${cargados}/${BRAIN_FILES.length} archivos del cerebro. Tamaño: ${secciones.join('\n').length} caracteres.`);
  return secciones.join('\n');
}

/**
 * Devuelve un resumen de qué archivos del brain están cargados
 */
function estadoBrain() {
  const estado = [];
  for (const { file, label } of [...BRAIN_FILES, { file: 'HEARTBEAT.md', label: 'HEARTBEAT' }]) {
    const existe = fs.existsSync(path.join(BRAIN_DIR, file));
    estado.push(`${existe ? '✅' : '❌'} ${label} (${file})`);
  }
  return estado.join('\n');
}

module.exports = { construirSystemPrompt, leerHeartbeat, estadoBrain };
