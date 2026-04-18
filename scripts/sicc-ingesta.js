/**
 * sicc-ingesta.js — GESTOR DE INGESTA BAJO DEMANDA (v1.0)
 * Uso: node scripts/sicc-ingesta.js --path /ruta/de/pdfs
 */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const pathIndex = args.indexOf('--path');
const targetPath = pathIndex !== -1 ? args[pathIndex + 1] : null;

if (!targetPath) {
    console.error('❌ Error: Debe especificar la ruta con --path');
    console.error('Uso: node scripts/sicc-ingesta.js --path /ruta/de/pdfs');
    process.exit(1);
}

const absolutePath = path.isAbsolute(targetPath) ? targetPath : path.resolve(process.cwd(), targetPath);

if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Error: La ruta no existe: ${absolutePath}`);
    process.exit(1);
}

console.log(`🛡️ [SICC INGESTA] Iniciando proceso manual en: ${absolutePath}`);

const INGESTOR_ENGINE = path.join(__dirname, '../src/ingest_masivo.js');

const child = spawn('node', [INGESTOR_ENGINE, absolutePath], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
});

child.on('close', (code) => {
    if (code === 0) {
        console.log('\n✅ [SICC INGESTA] Proceso completado exitosamente.');
    } else {
        console.error(`\n❌ [SICC INGESTA] El proceso falló con código ${code}.`);
    }
    process.exit(code);
});
