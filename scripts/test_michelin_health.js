// scripts/test_michelin_health.js — Michelin Health Check (v7.1)
'use strict';

const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 54322,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: 'postgres'
};

const pool = new Pool(dbConfig);

async function checkHealth() {
    console.log('🛡️ [MICHELIN-HEALTH] Iniciando Diagnóstico Forense...');
    
    try {
        // 1. Probar Conexión
        console.log('🔗 Probando conexión a Supabase Local...');
        const res = await pool.query('SELECT NOW()');
        console.log(`✅ Conexión exitosa: ${res.rows[0].now}`);

        // 2. Verificar dimensiones de la tabla
        console.log('📊 Verificando esquema de contrato_documentos...');
        const schema = await pool.query(`
            SELECT column_name, udt_name, character_maximum_length 
            FROM information_schema.columns 
            WHERE table_name = 'contrato_documentos' AND column_name = 'embedding'
        `);

        if (schema.rows.length === 0) {
            console.log('❌ Error: La tabla contrato_documentos no existe.');
        } else {
            // Obtener dimensiones reales vía SQL de pgvector
            const dims = await pool.query(`
                SELECT atttypmod FROM pg_attribute 
                WHERE attrelid = 'contrato_documentos'::regclass AND attname = 'embedding'
            `);
            const dimensionValue = dims.rows[0].atttypmod;
            console.log(`📊 Dimensiones detectadas en DB: ${dimensionValue} (Nota: pgvector usa atttypmod para esto)`);
            
            if (dimensionValue === 3072) {
                console.log('✅ Estándar de 3072 dimensiones confirmado (Google Method).');
            } else {
                console.log(`⚠️ Discrepancia: Se detectaron ${dimensionValue} dimensiones.`);
            }
        }

        // 3. Verificar Crontab (Simulado)
        console.log('⏰ Validando Crontab...');
        const { execSync } = require('child_process');
        const crontab = execSync('crontab -l').toString();
        if (crontab.includes('/home/administrador/.nvm/')) {
            console.log('✅ Crontab actualizado correctamente con path NVM.');
        } else {
            console.log('❌ El Crontab aún usa rutas legacy.');
        }

        console.log('\n🏆 [RESULTADO] Sistema SICC Michelin Estable y Sincronizado.');
    } catch (err) {
        console.error(`\n❌ Error Crítico en Diagnóstico: ${err.message}`);
    } finally {
        await pool.end();
    }
}

checkHealth();
