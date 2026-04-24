// brain.js — Lee los archivos .md del cerebro e inyecta contexto en el system prompt
'use strict';

const fs = require('fs');
const path = require('path');
const config = require('./config');

const BRAIN_DIR = config.paths.brain;

// Solo los 4 archivos que moldean comportamiento del agente.
// AGENTS.md duplica R-HARD. SYNOPSIS/ROADMAP/OPERATIONS son meta, no behavior.
// El aprendizaje real ocurre en: sicc_genetic_memory (Supabase) + SPECIALTIES/*.md (Karpathy)
const BRAIN_FILES = [
  { file: 'BRAIN.md',            label: 'CEREBRO Y ÉTICA OPERACIONAL',    required: true  },
  { file: 'R-HARD.md',           label: 'RESTRICCIONES DURAS UNIVERSALES', required: true  },
  { file: 'IDENTITY.md',         label: 'IDENTIDAD SICC',                  required: true  },
  { file: 'SICC_METHODOLOGY.md', label: 'METODOLOGÍA DE AUDITORÍA N-1',    required: true  },
];

function leerArchivo(filename) {
  const filepath = path.join(BRAIN_DIR, filename);
  try {
    if (fs.existsSync(filepath)) {
      return fs.readFileSync(filepath, 'utf8').trim();
    }
    return null;
  } catch (err) {
    console.warn(`[BRAIN] [SICC WARN] No se pudo leer ${filename}: ${err.message}`);
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
    res += `${presente ? '[SICC OK]' : '[SICC FAIL]'} ${label} (${file})\n`;
  }
  return res;
}

function leerHeartbeat() {
  const hbPath = path.join(BRAIN_DIR, 'HEARTBEAT.md');
  if (!fs.existsSync(hbPath)) return [];
  
  const content = fs.readFileSync(hbPath, 'utf8');
  const lines = content.split('\n');
  const pendientes = lines
    .filter(line => line.trim().startsWith('- [ ]'))
    .map(line => {
      const desc = line.replace('- [ ]', '').trim();
      return { nombre: 'Pendiente', descripcion: desc };
    })
    .filter(t => t.descripcion && !t.descripcion.toLowerCase().includes('activo') && t.descripcion.length > 5);

  return pendientes;
}

function destilarCerebro() {
  const identity = leerArchivo('IDENTITY.md') || '';
  
  // Extraemos solo las primeras líneas de misión y los axiomas clave
  const lines = identity.split('\n');
  const mission = lines.slice(0, 15).join('\n');
  
  return `## ADN SICC v11.0 (CONSOLIDADO)\n${mission}\n\nREGLA SOBERANA: Priorizar Jerarquía 1.2(d) y Ahorro de CAPEX (N-1).`;
}

module.exports = { construirSystemPrompt, estadoBrain, leerHeartbeat, destilarCerebro };
