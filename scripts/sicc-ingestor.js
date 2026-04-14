/**
 * sicc-ingestor.js — MOTOR DE INGESTA SOBERANA (v1.0)
 * Extrae la "Biblia Legal" de Supabase para refundar el Brain.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { pool } = require('../src/supabase');

const BRAIN_SOURCES = '/home/administrador/docker/agente/brain/sources';

async function ingest() {
    console.log('🛡️ [INGESTOR] Iniciando vaciado de Supabase...');
    
    if (!fs.existsSync(BRAIN_SOURCES)) {
        fs.mkdirSync(BRAIN_SOURCES, { recursive: true });
    }

    try {
        console.log('🔗 Consultando tabla contrato_documentos...');
        const res = await pool.query('SELECT nombre_archivo, contenido FROM contrato_documentos');
        
        console.log(`📊 Se encontraron ${res.rows.length} fragmentos. Procesando...`);
        
        const filesMap = {};

        res.rows.forEach(row => {
            const fileName = row.nombre_archivo.replace(/[\[\]]/g, '').replace(/\s+/g, '_');
            if (!filesMap[fileName]) {
                filesMap[fileName] = '';
            }
            filesMap[fileName] += `\n--- FRAGMENTO ---\n${row.contenido}\n`;
        });

        for (const [name, content] of Object.entries(filesMap)) {
            const targetPath = path.join(BRAIN_SOURCES, `${name}.md`);
            fs.writeFileSync(targetPath, `# SOURCE: ${name}\n\n${content}`);
            console.log(`✅ Archivo generado: ${name}.md`);
        }

        console.log('\n🏆 [INGESTOR] Vaciado completado. El Brain ha sido refundado.');
    } catch (err) {
        console.error(`❌ Error Crítico en Ingesta: ${err.message}`);
    } finally {
        await pool.end();
    }
}

ingest();
