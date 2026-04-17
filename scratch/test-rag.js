const { buscarSimilares } = require('../src/supabase');

async function test() {
    console.log('🔍 Probando conexión RAG a Supabase...');
    try {
        const query = 'obligaciones de señalización y multas';
        const docs = await buscarSimilares(query, 3);
        console.log('✅ Conexión Exitosa.');
        console.log(`📄 Fragmentos recuperados: ${docs.length}`);
        docs.forEach((d, i) => {
            console.log(`\n--- Fragmento ${i+1} [${d.nombre_archivo}] ---\n${d.contenido.substring(0, 200)}...`);
        });
    } catch (e) {
        console.error('❌ Error en la conexión RAG:', e.message);
    }
}

test();
