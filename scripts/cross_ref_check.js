// scripts/cross_ref_check.js — Auditoría de Consistencia y SSoT SICC v8.7
'use strict';

const fs = require('fs');
const path = require('path');

const LOGS_DIR = '/home/administrador/data-agente/logs';

async function runCrossRefCheck() {
    console.log('[CROSS-REF] 🕵️ Iniciando escaneo de consistencia SSoT...');
    
    let findings = [];

    // 1. Escanear logs en busca de TypeErrors o Dimension Mismatches
    const logFiles = ['ingesta_biblia.log', 'dreamer.log', 'continuous_dreamer.log'];
    
    for (const logFile of logFiles) {
        const fullPath = path.join(LOGS_DIR, logFile);
        if (!fs.existsSync(fullPath)) continue;

        const content = fs.readFileSync(fullPath, 'utf8').split('\n').slice(-500); // Últimas 500 líneas
        
        for (const line of content) {
            if (/TypeError|expected \d+ dimensions|ReferenceError|variable huérfana/i.test(line)) {
                findings.push({
                    source: `Log: ${logFile}`,
                    issue: line.trim().substring(0, 150)
                });
            }
        }
    }

    // 2. Comprobar integridad del Cerebro (Axiomas obligatorios)
    const BRAIN_DIR = '/app/brain';
    const REQUIRED_AXIOMS = ['SOUL.md', 'IDENTITY.md', 'LFC_ROLE.md', 'DREAMS.md'];
    
    // Nota: Esta parte solo funciona si el script se corre con acceso al volumen /app
    // Si se corre desde el host, hay que ajustar rutas.
    const internalBrainDir = fs.existsSync(BRAIN_DIR) ? BRAIN_DIR : '/home/administrador/docker/agente/brain';

    for (const axiom of REQUIRED_AXIOMS) {
        if (!fs.existsSync(path.join(internalBrainDir, axiom))) {
            findings.push({
                source: 'Brain Integrity',
                issue: `Falta axioma obligatorio: ${axiom}`
            });
        }
    }

    if (findings.length > 0) {
        console.log(`[CROSS-REF] ⚠️ Encontradas ${findings.length} inconsistencias.`);
        // Mostrar solo las únicas para no saturar
        const uniqueFindings = [...new Map(findings.map(item => [item.issue, item])).values()];
        return uniqueFindings;
    } else {
        console.log('[CROSS-REF] ✅ Verificación de consistencia SSoT exitosa.');
        return [];
    }
}

if (require.main === module) {
    runCrossRefCheck().then(findings => {
        if (findings.length > 0) {
            console.log(JSON.stringify(findings, null, 2));
            process.exit(1);
        }
        process.exit(0);
    });
}

module.exports = { runCrossRefCheck };
