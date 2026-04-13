'use strict';

const { procesarMensajeSwarm, inicializarBrain } = require('./src/agent');

async function testSwarmFlow() {
  console.log('🚀 INICIANDO TEST DE FLUJO SWARM (AUDITOR -> DIRECTOR)...');
  
  try {
    inicializarBrain();
    
    const consulta = "¿Cómo afecta el retraso en la fibra óptica al pago de multas según el AT1?";
    console.log(`👤 Consulta: "${consulta}"`);
    
    const resultado = await procesarMensajeSwarm(consulta);
    
    console.log('\n🏁 RESULTADO DEL DEBATE SWARM:');
    console.log('═'.repeat(60));
    console.log(resultado);
    console.log('═'.repeat(60));
    
    if (resultado.includes('AUDITOR FORENSE') && resultado.includes('DIRECTOR CONTRACTUAL')) {
      console.log('✅ ÉXITO: Los agentes se han comunicado y el flujo es continuo.');
    } else {
      console.log('❌ FALLO: El flujo entre agentes parece estar truncado o incompleto.');
    }
  } catch (err) {
    console.error('❌ ERROR CRÍTICO EN EL TEST:', err.message);
  }
}

testSwarmFlow();
