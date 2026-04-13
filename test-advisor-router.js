// test-advisor-router.js — Validación de la arquitectura v8.9.0
const { procesarMensaje } = require('./src/agent');

async function runTest() {
  const tests = [
    { 
      q: "¿Qué dice el contrato sobre el pago de multas por retrasos?", 
      esperado: "LEGAL" 
    },
    { 
      q: "Calcula los hilos de fibra G.652.D para el interlocking.", 
      esperado: "TECNICO-FERROVIARIO" 
    },
    { 
      q: "¿Me puedes resumir la minuta de la reunión de ayer?", 
      esperado: "GESTION" 
    }
  ];

  console.log("🚀 Iniciando Test de Clasificación Advisor SICC v8.9.0...\n");

  for (const test of tests) {
    console.log(`👤 Usuario: "${test.q}"`);
    const { proveedor } = await procesarMensaje(test.q, null);
    // El log [ADVISOR-ROUTER] saldrá en consola desde agent.js
    console.log(`✅ Respuesta via: ${proveedor}\n`);
  }
}

runTest();
