/**
 * scratch/test_heartbeat.js — Validación manual de motores forenses
 */
const { obtenerResumenForense } = require('../src/heartbeat');

(async () => {
    console.log('🧪 Iniciando Test de Auditoría Heartbeat...');
    console.log('-----------------------------------------');
    
    try {
        const resumen = await obtenerResumenForense();
        
        console.log('🌤️  RESULTADO CLIMA:');
        console.log(resumen.clima);
        console.log('\n📌 RESULTADO CROSS-REF:');
        console.log(resumen.crossRefReporte);
        console.log('\n⚖️  RESULTADO ZERO-RESIDUE:');
        console.log(resumen.zeroResidueReporte);
        
        console.log('\n-----------------------------------------');
        console.log(`📡 ESTATUS GENERAL: ${resumen.statusGeneral}`);
        
        if (resumen.statusGeneral === 'HEALTHY') {
            console.log('✅ TEST PASSED: El sistema es soberano y puro.');
        } else {
            console.log('⚠️ TEST READY: El sistema detectó inconsistencias para corregir.');
        }
    } catch (err) {
        console.error('❌ ERROR EN EL TEST:', err.message);
    }
})();
