/**
 * 🛰️ TEST DE VALIDACIÓN: SICC FACTORY MODE (v8.8)
 * Valida la ejecución paralela de peones y la síntesis de reportes.
 */
'use strict';

const { ejecutarFactoriaPeones, inicializarBrain } = require('../src/agent');

async function runTest() {
  console.log('--- 🧪 INICIANDO TEST DE FACTORÍA SICC (v8.8) ---');
  
  // 1. Inicializar
  inicializarBrain();

  const tema = "Sistemas de Energía y Catenaria";
  const contexto = "El AT1 exige 110VDC para el bus vital. El subcontratista propone 48VDC basándose en la norma EN 50125. El contrato dice que el bus vital debe soportar 4 horas de autonomía.";

  console.log('🔄 Ejecutando minería paralela con Peones Ollama...');
  
  try {
    const start = Date.now();
    const result = await ejecutarFactoriaPeones(tema, contexto);
    const duration = Date.now() - start;

    console.log(`\n✅ FACTORÍA COMPLETADA en ${Math.round(duration/1000)}s`);
    console.log('--- REPORTE SINTETIZADO ---');
    console.log(result);
    console.log('---------------------------');

    // Validación de contenido
    const tieneLegal = result.includes('🛡️ Reporte Peón LEGAL');
    const tieneTecnico = result.includes('🛡️ Reporte Peón TECNICO');
    
    if (tieneLegal && tieneTecnico) {
      console.log('🚀 VALIDACIÓN EXITOSA: La factoría produjo un reporte multi-agente cohesivo.');
    } else {
      console.error('❌ ERROR: Faltan secciones en el reporte de la factoría.');
    }

  } catch (err) {
    console.error('💥 Fallo crítico en la factoría:', err.message);
  }
}

runTest();
