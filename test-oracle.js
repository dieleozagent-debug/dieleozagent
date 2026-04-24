const { validarInternaSupabase } = require('./src/sapi/supabase_rag');
const { extraerFichaTecnica } = require('./scripts/sicc-multiplexer');

async function run() {
    console.log("=== 1. Consultando BD (Supabase RAG) para 'Comunicaciones' ===");
    const chunks = await validarInternaSupabase("Comunicaciones");
    console.log(`Caracteres retornados: ${chunks.length}`);
    console.log("Muestra del inicio:\n", chunks.substring(0, 300));
    
    console.log("\n=== 2. Destilando Ficha Técnica (Oracle Fetcher) ===");
    const ficha = await extraerFichaTecnica("Comunicaciones", chunks);
    console.log("\nRESULTADO FINAL DE LA FICHA:");
    console.log(ficha);
}

run().catch(console.error);
