// scripts/reinject_memory.js — Recuperación de Dictámenes Huérfanos
'use strict';

const fs = require('fs');
const path = require('path');
const { guardarDTCertificada } = require('../src/supabase');

const DICTAMENES_DIR = path.join(__dirname, '../brain/dictamenes');

async function reinject() {
    console.log('🚀 Iniciando re-inyección de memoria SICC...');
    
    const archivos = fs.readdirSync(DICTAMENES_DIR).filter(f => f.endsWith('.md'));
    
    for (const archivo of archivos) {
        const rutaCompleta = path.join(DICTAMENES_DIR, archivo);
        const contenido = fs.readFileSync(rutaCompleta, 'utf-8');
        
        // Extraer área del nombre del archivo (ej: DT-COMS-...)
        const match = archivo.match(/DT-([A-Z]+)-/);
        const area = match ? match[1] : 'GENERAL';
        
        console.log(`📦 Procesando: ${archivo} (Área: ${area})...`);
        
        try {
            const idDT = await guardarDTCertificada(area, contenido, "RE-INYECCIÓN POST-SANEAMIENTO V14.6");
            if (idDT) {
                console.log(`✅ ${archivo} inyectado con ID: ${idDT}`);
            } else {
                console.log(`⚠️ ${archivo} falló en la inyección.`);
            }
        } catch (e) {
            console.error(`❌ Error inyectando ${archivo}: ${e.message}`);
        }
    }
    
    console.log('✨ Proceso de re-inyección completado.');
    process.exit(0);
}

reinject();
