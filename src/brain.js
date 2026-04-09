// brain.js — Lee los archivos .md del cerebro e inyecta contexto en el system prompt
'use strict';

const fs = require('fs');
const path = require('path');

const BRAIN_DIR = fs.existsSync('/app/data/brain') 
  ? '/app/data/brain' 
  : path.join(__dirname, '../brain');

const BRAIN_FILES = [
  { file: 'SOUL.md',            label: 'ALMA Y PERSONALIDAD',           required: true  },
  { file: 'IDENTITY.md',        label: 'IDENTIDAD SOBERANA',            required: true  },
  { file: 'AUTODETERMINACION_CEREBRO_v3_N_1.md', label: 'LÓGICA N-1 (DEDUCTIVA)', required: false },
  { file: 'LFC_ROLE.md',        label: 'ROL CONTRACTUAL LFC',           required: false },
  { file: 'DBCD_CRITERIA.md',   label: 'CRITERIOS DISEÑO & CAPEX',      required: false },
  { file: 'DREAMS.md',          label: 'SUEÑOS Y TAREAS NOCTURNAS',     required: false },
  { file: 'ROADMAP.md',         label: 'HOJA DE RUTA (ROADMAP)',        required: false },
  { file: 'PENDIENTES_COLABORACION.md', label: 'PENDIENTES (ACCOUNTABILITY)', required: false },
  { file: 'USER.md',            label: 'CONTEXTO DEL USUARIO (DIEGO)',  required: false },
];

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

function construirSystemPrompt(modo = 'full') {
  const secciones = [];
  const LIMIT_CHARS = modo === 'fast' ? 15000 : 100000;

  secciones.push('Eres un agente de IA autónomo para el proyecto LFC. Tu cerebro se define así:\n');

  let currentTotalChars = secciones.join('\n').length;

  for (const { file, label, required } of BRAIN_FILES) {
    let contenido = leerArchivo(file);
    if (contenido) {
      const bloque = `\n## ${label}\n\n${contenido}\n${'─'.repeat(60)}`;
      secciones.push(bloque);
      currentTotalChars += bloque.length;
    }
  }

  return secciones.join('\n');
}

function estadoBrain() {
  let res = '';
  for (const { file, label } of BRAIN_FILES) {
    const presente = fs.existsSync(path.join(BRAIN_DIR, file));
    res += `${presente ? '✅' : '❌'} ${label} (${file})\n`;
  }
  return res;
}

function leerHeartbeat() {
  const hbPath = path.join(BRAIN_DIR, 'HEARTBEAT.md');
  if (!fs.existsSync(hbPath)) return [];
  return [{ nombre: 'Heartbeat', descripcion: 'Activo' }];
}

module.exports = { construirSystemPrompt, estadoBrain, leerHeartbeat };
