const { pool, obtenerEmbedding, insertarFragmento } = require('./supabase');

async function migrarYProbar() {
    try {
        console.log("1. Re-calibrando el Cerebro a 768 Dimensiones (Motor Michelin Soberano)...");
        // Destruir tabla antigua (solo tiene 51 fragmentos defectuosos o nulos)
        await pool.query('DROP TABLE IF EXISTS contrato_documentos CASCADE;');
        
        // Crear tabla con nueva "resolución" para nuestro motor local
        await pool.query(`
            CREATE TABLE contrato_documentos (
                id bigserial PRIMARY KEY,
                nombre_archivo text,
                contenido text,
                embedding vector(768),
                fecha_creacion timestamp with time zone DEFAULT timezone('utc'::text, now())
            );
        `);
        // Opcionalmente podemos re-crear la funcion de busqueda, pero esto ya la tabla basica:
        await pool.query(`
            DROP FUNCTION IF EXISTS buscar_documentos_contrato(vector, float, int);
            CREATE OR REPLACE FUNCTION buscar_documentos_contrato(
                query_embedding vector(768), match_threshold float, match_count int
            )
            RETURNS TABLE ( nombre_archivo text, contenido text, similitud float )
            LANGUAGE plpgsql
            AS $$
            BEGIN
                RETURN QUERY
                SELECT c.nombre_archivo, c.contenido, 1 - (c.embedding <=> query_embedding) AS similitud
                FROM contrato_documentos c
                WHERE 1 - (c.embedding <=> query_embedding) > match_threshold
                ORDER BY c.embedding <=> query_embedding
                LIMIT match_count;
            END;
            $$;
        `);
        console.log("✅ Tabla y Función de Búsqueda recreadas exitosamente con soporte para vector(768).");

        console.log("2. Generando embedding local para '1 hoja' de prueba (Ollama)...");
        const textoUnaHoja = "ESTA ES UNA HOJA DE PRUEBA. La autonomía forense exige soberanía técnica. Este es el inicio del SICC v7.0.";
        const vector = await obtenerEmbedding(textoUnaHoja);
        console.log(`✅ Embedding generado. Tamaño real: ${vector.length} dimensiones.`);

        console.log("3. Inyectando la hoja experimental en el Cerebro Supabase...");
        await insertarFragmento("[TEST] Hoja_Unica.pdf", textoUnaHoja, vector);
        
        console.log("4. Verificación final de inserción en la tabla...");
        const res = await pool.query("SELECT COUNT(*) as cuenta FROM contrato_documentos");
        console.log(`✅ INGESTA CONFIRMADA: El cerebro tiene ahora ${res.rows[0].cuenta} fragmento(s).`);

        console.log("\n🏆 SOBERANÍA ALCANZADA. Puedes lanzar el ingest_masivo esta noche con total tranquilidad.");
        pool.end();
    } catch (err) {
        console.error("❌ Error en la prueba:", err.message);
        pool.end();
    }
}

migrarYProbar();
