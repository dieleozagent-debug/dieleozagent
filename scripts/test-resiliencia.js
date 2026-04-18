/**
 * 🛰️ TEST DE RESILIENCIA SOBERANA SICC
 * Valida que el sistema salte de un proveedor fallido a uno funcional.
 */
'use strict';

const { procesarMensaje, inicializarBrain } = require('../src/agent');
const config = require('../src/config');

async function runTest() {
  console.log('--- 🧪 INICIANDO TEST DE RESILIENCIA SOBERANA ---');
  
  // 1. Inicializar
  inicializarBrain();

  // 2. Simular fallo de OpenRouter (inyectando basura en la llave temporalmente)
  const originalKey = config.ai.openrouter.apiKey;
  config.ai.openrouter.apiKey = 'sk-or-v1-INVALID-KEY-TEST';
  
  console.log('🔄 Escenario: OpenRouter sin créditos (401/402 simulated)');
  console.log('🎯 Objetivo: Debe saltar a Gemini Free o Ollama.');

  try {
    const query = '¿Cuál es la penalidad por caída de la Red Vital en el AT1?';
    const result = await procesarMensaje(query);
    
    console.log('\n✅ RESULTADO DEL TEST:');
    console.log(`- Modelo que respondió: ${result.proveedor}`);
    console.log(`- Fragmento de respuesta: ${result.texto.substring(0, 100)}...`);
    
    // 3. Restaurar llave (opcional)
    config.ai.openrouter.apiKey = originalKey;
    
    console.log('\n📜 REVISANDO LOGS DE FLUJO...');
    const logPath = require('path').join(__dirname, '../data/logs/flow-resilience.json');
    if (require('fs').existsSync(logPath)) {
      const logs = require('fs').readFileSync(logPath, 'utf8').split('\n').filter(Boolean);
      const lastLogs = logs.slice(-5);
      lastLogs.forEach(l => console.log(`  [LOG] ${l}`));
    } else {
      console.error('❌ Error: No se encontró el archivo de logs.');
    }

  } catch (err) {
    console.error('💥 El test falló completamente:', err.message);
  }
}

runTest();
