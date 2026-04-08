// brain.js — Lee los archivos .md del cerebro e inyecta contexto en el system prompt
'use strict';

const fs = require('fs');
const path = require('path');

// Los archivos del cerebro viven en el volumen persistente (Docker) o localmente (Desarrollo)
const BRAIN_DIR = fs.existsSync('/app/data/brain') 
  ? '/app/data/brain' 
  : path.join(__dirname, '../brain');

// Orden y peso de los archivos en el system prompt (Matrix 2026)
const BRAIN_FILES = [
  { file: 'SOUL.md',            label: 'ALMA Y PERSONALIDAD',           required: true  },
  { file: 'IDENTITY.md',        label: 'IDENTIDAD SOBERANA',            required: true  },
  { file: 'AUTODETERMINACION_CEREBRO_v3_N_1.md', label: 'LÓGICA N-1 (DEDUCTIVA)', required: false },
  { file: 'INFERENCIA_RADICAL_N_MENOS_1.md',     label: 'INFERENCIA RADICAL',       required: false },
  { file: 'INFERENCIA_DISENO_RECTOR.md',         label: 'DISEÑO RECTOR SICC',       required: false },
  { file: 'LFC_ROLE.md',        label: 'ROL CONTRACTUAL LFC',           required: false },
  { file: 'DBCD_CRITERIA.md',   label: 'CRITERIOS DISEÑO & CAPEX',      required: false },
  { file: 'P42_METODOLOGIA.md', label: 'METODOLOGÍA PUNTO 42',          required: false },
  { file: 'BRECHA_CONTRACTUAL_METODOLOGIA_42.md', label: 'AUDITORÍA DE BRECHA',     required: false },
  { file: 'DREAMS.md',          label: 'SUEÑOS Y TAREAS NOCTURNAS',     required: false },
  { file: 'ROADMAP.md',         label: 'HOJA DE RUTA (ROADMAP)',        required: false },
  { file: 'USER.md',            label: 'CONTEXTO DEL USUARIO (DIEGO)',  required: false },
  { file: 'AGENTS.md',          label: 'MANUAL OPERATIVO DE AGENTES',   required: false },
  { file: 'TOOLS.md',           label: 'HERRAMIENTAS SICC',             required: false },
  { file: 'PROGRAM.md',         label: 'EXPERIMENTO ACTIVO',            required: false },
  { file: 'RESEARCH_LOG.md',    label: 'LOG DE INVESTIGACIÓN SICC',     required: false },
  { file: 'skills/web_research.md', label: 'CAPACIDAD INVESTIGACIÓN WEB', required: false },
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
 * Construye el system prompt inyectando archivos del brain.
 * @param {'full'|'fast'} modo - 'full' carga todo, 'fast' carga solo lo esencial (15k chars total).
 */
function construirSystemPrompt(modo = 'full') {
  const secciones = [];
  const LIMIT_CHARS = modo === 'fast' ? 15000 : 100000;

  secciones.push('Eres un agente de IA autónomo. Tu cerebro está definido por los siguientes archivos de configuración:\n');
  secciones.push('═'.repeat(60));

  let cargados = 0;
  let currentTotalChars = secciones.join('\n').length;

  for (const { file, label, required } of BRAIN_FILES) {
    if (modo === 'fast' && currentTotalChars > LIMIT_CHARS) break;

    let contenido = leerArchivo(file);
    if (contenido) {
      // Destilación: si estamos en modo fast, truncamos archivos pesados
      if (modo === 'fast' && contenido.length > 3000 && !required) {
        contenido = contenido.substring(0, 3000) + '\n... [TRUNCADO PARA EFICIENCIA DIURNA]';
      }

      const bloque = `\n## ${label}\n\n${contenido}\n${'─'.repeat(60)}`;
      
      // En modo fast, si agregar el bloque nos hace pasarnos del límite, lo saltamos a menos que sea requerido
      if (modo === 'fast' && (currentTotalChars + bloque.length) > LIMIT_CHARS && !required) {
        continue;
      }

      secciones.push(bloque);
      currentTotalChars += bloque.length;
      cargados++;
    } else if (required) {
      console.warn(`[BRAIN] ⚠️ Archivo requerido no encontrado: ${file}`);
    }
  }

  console.log(`[BRAIN] ✅ Prompt (${modo}) construido con ${cargados}/${BRAIN_FILES.length} archivos. Tamaño: ${currentTotalChars} caracteres.`);
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
