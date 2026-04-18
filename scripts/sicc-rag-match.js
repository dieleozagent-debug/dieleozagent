/**
 * 🛰️ SICC RAG MATCHER (v1.1) — Protocolo de Emparejamiento Contractual
 * Objetivo: Validar que cada párrafo de un entregable tenga un "ancla" en la Biblia Legal de Supabase.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { buscarSimilares } = require('../src/supabase');

const LFC2_ROOT = process.env.LFC2_ROOT || '/home/administrador/docker/LFC2';

async function matchFile(filePath) {
    let fullPath = filePath;
    
    // Resolución de ruta
    if (!path.isAbsolute(filePath)) {
        const tryLfc = path.join(LFC2_ROOT, filePath);
        if (fs.existsSync(tryLfc)) {
            fullPath = tryLfc;
        } else {
            fullPath = path.resolve(filePath);
        }
    }
    
    if (!fs.existsSync(fullPath)) {
        console.error(`❌ Archivo no encontrado: ${fullPath}`);
        return;
    }

    console.log(`\n🔍 [MATCHER] Iniciando auditoría vectorial: ${path.basename(fullPath)}`);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Dividir en bloques (párrafos o secciones)
    const blocks = content.split('\n\n').filter(b => b.trim().length > 50);
    
    console.log(`📊 Se identificaron ${blocks.length} bloques técnicos para validación.`);
    
    const report = [];
    let hallucinations = 0;

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i].trim();
        process.stdout.write(`⏳ Validando bloque ${i+1}/${blocks.length}... \r`);
        
        try {
            // Buscar los 2 fragmentos más parecidos
            const matches = await buscarSimilares(block, 2);
            
            const bestMatch = matches[0] || { similitud: 0 };
            // Umbral de verdad forense: 0.7
            const status = bestMatch.similitud > 0.7 ? '✅ MATCH' : '⚠️ ALUCINACIÓN';
            
            if (status === '⚠️ ALUCINACIÓN') hallucinations++;

            report.push({
                index: i + 1,
                content: block.substring(0, 100) + '...',
                status: status,
                similarity: (bestMatch.similitud * 100).toFixed(2) + '%',
                source: (bestMatch.nombre_archivo || 'DESCONOCIDO').replace(/^\[BIBLIA-LEGAL\]\s*/, ''),
                legal_anchor: bestMatch.contenido ? bestMatch.contenido.substring(0, 200) + '...' : 'Sin respaldo literal.'
            });
        } catch (err) {
            console.error(`\n❌ Error en bloque ${i+1}: ${err.message}`);
        }
    }

    console.log('\n\n🏆 [MATCHER] Auditoría Finalizada.');
    console.log('--------------------------------------------------');
    report.forEach(r => {
        if (r.status === '⚠️ ALUCINACIÓN') {
            console.log(`[${r.status}] Bloque ${r.index} (${r.similarity})`);
            console.log(`   - Contenido: "${r.content}"`);
            console.log(`   - ALERTA: Este párrafo no tiene sustento literal claro en el RAG.`);
            console.log(`   - Similar más cercano: ${r.source}`);
        } else {
            console.log(`[✅ MATCH] Bloque ${r.index} (${r.similarity}) -> Fuente: ${r.source}`);
        }
    });
    console.log('--------------------------------------------------');
    console.log(`📈 Resumen: ${blocks.length} bloques, ${hallucinations} posibles alucinaciones detectadas.`);
    
    return report;
}

// CLI Execution
if (require.main === module) {
    const target = process.argv[2];
    if (!target) {
        console.log('Usage: node scripts/sicc-rag-match.js <file_path>');
        process.exit(1);
    }
    matchFile(target).then(() => {
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
}

module.exports = { matchFile };
