'use strict';

const { registrarBloqueoSICC } = require('./src/agent');

async function testTelegramManual() {
  console.log('📢 FORZANDO ALERTA DE TELEGRAM PARA VALIDADOR DE SOBERANÍA...');
  try {
    await registrarBloqueoSICC(
      "CONSULTA DE PRUEBA: AUDITORÍA DE TELEGRAM", 
      "SIMULACIÓN DE FALLO DE TODAS LAS VÍAS GRATUITAS"
    );
    console.log('✅ Alerta enviada a Telegram. Revisa tu móvil, Diego.');
  } catch (err) {
    console.error('❌ Error en el test de Telegram:', err.message);
  }
}

testTelegramManual();
