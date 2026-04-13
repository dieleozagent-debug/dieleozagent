'use strict';
const { rutarEstrategiaAdvisor } = require('./src/advisor');
const fs = require('fs');
const path = require('path');

async function debugAdvisor() {
  console.log('🧪 DEBUG ADVISOR INICIADO...');
  const result = await rutarEstrategiaAdvisor('CONSULTA DE PRUEBA DE ESCRITURA', 'DNA TEST');
  console.log('✅ Resultado del Advisor:', result);
  
  const logPath = '/home/administrador/docker/agente/brain/GENETIC_EVOLUTION.md';
  if (fs.existsSync(logPath)) {
    console.log(`📄 Tamaño del log: ${fs.statSync(logPath).size} bytes`);
  } else {
    console.error('❌ El archivo GENETIC_EVOLUTION.md NO EXISTE en la ruta esperada.');
  }
}

debugAdvisor();
