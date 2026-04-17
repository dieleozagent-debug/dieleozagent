const { pool } = require('../src/supabase');

async function initDB() {
    console.log('🏗️ Inicializando tablas SICC en Postgres...');
    try {
        // Habilitar pgvector si no existe
        await pool.query('CREATE EXTENSION IF NOT EXISTS vector');
        
        // Crear tabla de memoria genética
        await pool.query(`
            CREATE TABLE IF NOT EXISTS sicc_genetic_memory (
                id SERIAL PRIMARY KEY,
                content TEXT NOT NULL,
                metadata JSONB,
                embedding vector(768),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Tabla sicc_genetic_memory creada/verificada.');
        
        // Crear índice para búsqueda rápida
        await pool.query(`
            CREATE INDEX IF NOT EXISTS sicc_genetic_memory_idx 
            ON sicc_genetic_memory USING ivfflat (embedding vector_cosine_ops)
            WITH (lists = 100)
        `);
        
        console.log('✅ Índice vectorial creado.');
    } catch (e) {
        console.error('❌ Error inicializando DB:', e.message);
    } finally {
        pool.end();
    }
}

initDB();
