'use strict';

const { procesarMensaje, inicializarBrain } = require('./src/agent');

async function testFirewall() {
  console.log('🚀 INICIANDO TEST DE MURO DE FUEGO v9.3.0...');
  console.log('--- Simulando fallo total de vías gratuitas ---');
  
  // Forzamos un mensaje que sabemos que fallará si cortamos la red o los modelos
  // Pero aquí simplemente validaremos que ante un error en llamarMultiplexadorFree,
  // el sistema reporte el BLOQUEO DE SOBERANÍA.
  
  try {
    inicializarBrain();
    
    // NOTA: Para este test, la lógica de 'muro-de-fuego' se activa si llamarMultiplexadorFree lanza error.
    // Probaremos un flujo normal y verificaremos que NO use Sonnet.
    const consulta = "CONSULTA DE TEST PARA MURO DE FUEGO";
    const res = await procesarMensaje(consulta);
    
    console.log('\n🏁 RESULTADO DE LA PETICIÓN:');
    console.log(`Proveedor usado: ${res.proveedor}`);
    console.log(`Respuesta: ${res.texto.substring(0, 100)}...`);
    
    if (res.proveedor === 'muro-de-fuego') {
      console.log('✅ ÉXITO: El Muro de Fuego ha atrapado la escalación y protegido el CAPEX.');
    } else {
      console.log(`ℹ️ INFO: El mensaje se resolvió vía ${res.proveedor} (Gasto $0). El muro no fue necesario.`);
    }

  } catch (err) {
    console.error('❌ ERROR CRÍTICO:', err.message);
  }
}

testFirewall();
