const { leerNoLeidos, enviarCorreo } = require('../src/gmail');
require('dotenv').config();

async function testConnectivity() {
  console.log('🧪 Iniciando test de conectividad GMAIL...');
  console.log(`👤 Usuario: ${process.env.GMAIL_ACCOUNT}`);

  try {
    console.log('📡 Factibilidad IMAP (Leer no leídos)...');
    const correos = await leerNoLeidos(1);
    console.log(`✅ [SICC OK] IMAP Conectado. Correos encontrados: ${correos.length}`);

    console.log('📡 Factibilidad SMTP (Enviar prueba)...');
    await enviarCorreo({
      para: process.env.GMAIL_ACCOUNT,
      asunto: 'SICC HEARTBEAT: GMAIL LINK TEST',
      cuerpo: 'Este es un correo de prueba generado por el Agente SICC v12.2.'
    });
    console.log('✅ [SICC OK] SMTP Conectado. Correo enviado a sí mismo.');

  } catch (err) {
    console.error('❌ [SICC FAIL] Error en test de Gmail:', err.message);
  }
}

testConnectivity();
