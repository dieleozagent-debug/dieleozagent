const { obtenerEmbedding, insertarFragmento, pool } = require('../src/supabase');

async function test() {
    try {
        console.log("Generando embedding de prueba...");
        const vector = await obtenerEmbedding("Prueba de dimensiones para el SICC.");
        console.log(`Vector de ${vector.length} dimensiones generado.`);
        
        console.log("Insertando en DB...");
        await insertarFragmento("test_check.txt", "Contenido de prueba", vector);
        console.log("✅ Inserción exitosa!");
        
        const res = await pool.query("SELECT count(*) FROM contrato_documentos WHERE nombre_archivo = 'test_check.txt'");
        console.log(`Registros encontrados: ${res.rows[0].count}`);
        
        // Limpiar
        await pool.query("DELETE FROM contrato_documentos WHERE nombre_archivo = 'test_check.txt'");
    } catch (err) {
        console.error("❌ Error:", err.message);
    } finally {
        await pool.end();
    }
}

test();
