const { Pool } = require('pg');

const dbConfig = {
    host: 'supabase_db_sicc-local',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'postgres'
};

const pool = new Pool(dbConfig);

async function testConn() {
    console.log(`Intentando conectar a ${dbConfig.host}:${dbConfig.port}...`);
    try {
        const res = await pool.query('SELECT NOW() as hora_actual, count(*) as total_documentos FROM contrato_documentos');
        console.log('✅ Conexión exitosa desde el interior del contenedor!');
        console.log('Hora actual en DB:', res.rows[0].hora_actual);
        console.log('Total de documentos en contrato_documentos:', res.rows[0].total_documentos);
    } catch (err) {
        console.error('❌ Error de conexión:', err.message);
    } finally {
        await pool.end();
    }
}

testConn();
