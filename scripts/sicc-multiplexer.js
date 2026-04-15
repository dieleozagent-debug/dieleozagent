#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SPECIALTIES_DIR = path.join(__dirname, '../brain/SPECIALTIES');
const RHARD_PATH = path.join(__dirname, '../brain/R-HARD.md');

/**
 * SICC MULTIPLEXER v1.0 — Hand-off Especializado
 * Mapeo de Palabras Base a Mini-Cerberos
 */
const BASE_WORDS = {
  'SIGNALIZATION': ['señalización', 'ptc', 'fra 236', 'moving block', 'v-rail', 'obc', 'on-board'],
  'COMMUNICATIONS': ['telecomunicaciones', 'comunicaciones', 'fibra', 'g.652.d', 'vital ip', 'satélite', 'starlink'],
  'POWER': ['potencia', 'energía', 'híbrida', 'solar', 'fotovoltaico', 'ups', 'batería'],
  'CONTROL_CENTER': ['centro de control', 'cco', 'ctc', 'hmi', '2oo3', 'despacho'],
  'INTEGRATION': ['integración', 'interfaz', 'interconexión', 'fat', 'sat', 'hil'],
  'ENCE': ['enclavamiento', 'ence', 'v-block', 'aguja', 'desvío', 'sil-4']
};

function detectSpecialty(text) {
  const lowercaseText = text.toLowerCase();
  for (const [specialty, words] of Object.entries(BASE_WORDS)) {
    if (words.some(word => lowercaseText.includes(word))) {
      return specialty;
    }
  }
  return null;
}

function getMultiplexedContext(userInput) {
  const specialty = detectSpecialty(userInput);
  const rHardContent = fs.readFileSync(RHARD_PATH, 'utf8');
  
  if (!specialty) {
    console.log('[MULTIPLEXER] No se detectó especialidad específica. Usando R-HARD Core.');
    return rHardContent;
  }

  const specPath = path.join(SPECIALTIES_DIR, `${specialty}.md`);
  if (fs.existsSync(specPath)) {
    console.log(`[MULTIPLEXER] 🎯 Especialidad detectada: ${specialty}`);
    // Los archivos de especialidad ya contienen R-HARD en el header
    return fs.readFileSync(specPath, 'utf8');
  }

  return rHardContent;
}

// Exportar para uso en dreamer.js y agent.js
module.exports = { detectSpecialty, getMultiplexedContext };

// Soporte para ejecución CLI (Testing)
if (require.main === module) {
  const testInput = process.argv.slice(2).join(' ');
  if (!testInput) {
    console.log('Uso: node sicc-multiplexer.js "pregunta de prueba"');
    process.exit(0);
  }
  console.log(getMultiplexedContext(testInput));
}
