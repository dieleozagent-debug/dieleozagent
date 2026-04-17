const { buscarLecciones } = require('../src/supabase');

async function testVacuna() {
    console.log('🧬 Probando Sistema Inmune (Memoria Genética)...');
    try {
        const query = 'CAPEX sistema ATP embarcado';
        const lecciones = await require('../src/supabase').buscarLecciones(query, 3);
        
        console.log(`📄 Resultados encontrados: ${lecciones.length}`);
        lecciones.forEach((l, i) => {
            console.log(`\n--- Lección ${i+1} [Similitud: ${l.similitud.toFixed(4)}] ---\n${l.content}`);
        });
    } catch (e) {
        console.error('❌ Error en la prueba de vacunación:', e.message);
    }
}

testVacuna();
