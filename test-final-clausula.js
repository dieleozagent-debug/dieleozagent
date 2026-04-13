'use strict';

const { procesarMensajeSwarm } = require('./src/agent');
const { enviarMorningDigest } = require('./src/digest');

async function validadorFinal() {
  const clausula = "Cláusula de Penalidades Técnicas §4.2";
  const consulta = `¿Cuál es el riesgo de incumplimiento del Nivel 1 si el Nivel 16 (Acuerdos Verbales) contradice la ${clausula} sobre penalidades de fibra?`;
  
  console.log('🚀 INICIANDO VALIDACIÓN UNITARIA v9.4.5...');
  console.log(`🔍 Ítem de Prueba: ${clausula}`);
  console.log('--- Proceso Silencioso Iniciado (Ollama/Free Priority) ---');

  try {
    // 1. Ejecutar el Swarm (esto encolará hallazgos automáticamente en el búfer)
    await procesarMensajeSwarm(consulta);
    
    console.log('\n✅ Debate finalizado. Hallazgos encolados en el Búfer Michelin.');
    console.log('📢 Generando Morning Digest para Telegram...');
    
    // 2. Forzar el envío del Digest
    await enviarMorningDigest();
    
    console.log('🏁 VALIDACIÓN COMPLETADA. Revisa tu móvil, Diego.');
  } catch (err) {
    console.error('❌ Fallo en la validación:', err.message);
  }
}

validadorFinal();
