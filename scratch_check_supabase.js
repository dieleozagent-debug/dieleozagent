const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 54322,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'postgres'
};

console.log(`🔍 Checking connectivity to Postgres (${dbConfig.host}:${dbConfig.port}) [v12.2 SSoT Mode]...`);

const pool = new Pool(dbConfig);

async function check() {
    try {
        // 1. Verificar conexión básica
        const res = await pool.query('SELECT NOW()');
        console.log(`✅ Database Connected: ${res.rows[0].now}`);

        // 2. Verificar tabla de contratos (Biblia Legal)
        const countRes = await pool.query('SELECT COUNT(*) FROM contrato_documentos');
        const count = countRes.rows[0].count;
        console.log(`📊 Fragments in 'contrato_documentos': ${count}`);

        if (parseInt(count) > 0) {
            console.log(`🎉 Biblia Legal SSoT is INTACT.`);
        } else {
            console.warn(`⚠️  Database is empty. Ingestion might be required.`);
        }

        // 3. Verificar triggers/extensiones de vectores
        const vectorRes = await pool.query("SELECT * FROM pg_extension WHERE extname = 'vector'");
        if (vectorRes.rows.length > 0) {
            console.log(`✅ pgvector extension is ACTIVE.`);
        }

        process.exit(0);
    } catch (err) {
        console.error(`❌ Connection failed: ${err.message}`);
        console.log("Tip: If running from host, ensure port 54322 is mapped. If from container, use DB_HOST=postgres.");
        process.exit(1);
    }
}

check();
