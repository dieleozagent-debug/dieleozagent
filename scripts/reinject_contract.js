// scripts/reinject_contract.js — Ingesta de SSoT Saneado
'use strict';

const fs = require('fs');
const path = require('path');
const { obtenerEmbedding, insertarFragmento } = require('../src/supabase');

const LFC2_DIR = '/home/administrador/docker/LFC2';

function getAllFiles(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== '.git' && file !== 'old') getAllFiles(fullPath, files);
        } else if (file.match(/\.(md|html|txt)$/i)) {
            files.push(fullPath);
        }
    }
    return files;
}

async function run() {
    console.log(`🚀 Iniciando re-ingesta de SSoT desde: ${LFC2_DIR}`);
    const archivos = getAllFiles(LFC2_DIR);
    console.log(`📂 Encontrados ${archivos.length} archivos de texto.`);

    for (const fullPath of archivos) {
        const nombre = path.relative(LFC2_DIR, fullPath);
        const contenido = fs.readFileSync(fullPath, 'utf8');
        
        // Chunking simple por párrafos (max 800 chars)
        const fragmentos = contenido.split('\n\n').filter(f => f.trim().length > 50);
        
        console.log(`📄 Procesando: ${nombre} (${fragmentos.length} fragmentos)...`);
        
        for (const fragmento of fragmentos) {
            try {
                // Dividir si el párrafo es muy largo
                if (fragmento.length > 1000) {
                    const subFragmentos = fragmento.match(/.{1,800}(\s|$)/g) || [fragmento];
                    for (const sf of subFragmentos) {
                        const vector = await obtenerEmbedding(sf.trim());
                        await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, sf.trim(), vector);
                    }
                } else {
                    const vector = await obtenerEmbedding(fragmento);
                    await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, fragmento, vector);
                }
                process.stdout.write('.');
            } catch (e) {
                console.error(`\n❌ Error en ${nombre}: ${e.message}`);
            }
        }
        console.log(`\n✅ ${nombre} finalizado.`);
    }

    console.log('✨ Re-ingesta de SSoT completada.');
    process.exit(0);
}

run();
