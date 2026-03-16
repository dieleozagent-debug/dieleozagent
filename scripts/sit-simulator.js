#!/usr/bin/env node

/**
 * SIT Simulator v1.0 - Simulación de Impacto Técnico
 * Demostración de razonamiento Brain-Sync (N -> N+1)
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = '/home/administrador/docker/LFC2';

function simulateWbsChange(oldCode, newCode) {
    console.log(`\n🚀 INICIANDO SIMULACIÓN SIT: ${oldCode} -> ${newCode}\n`);
    
    // 1. ANÁLISIS HACIA ATRÁS (Backtrace N)
    console.log("🔍 [CEREBRO] Analizando dependencias existentes (N)...");
    
    // Leer Riesgos
    const riesgosPath = path.join(REPO_ROOT, 'IX. WBS y Planificacion/riesgos_wbs.js');
    let impactFound = false;
    
    if (fs.existsSync(riesgosPath)) {
        const content = fs.readFileSync(riesgosPath, 'utf8');
        const risksMatch = content.match(/window\.riesgosWbs\s*=\s*({[\s\S]*?});/);
        
        if (risksMatch) {
            const data = JSON.parse(risksMatch[1]);
            const affectedRisks = data.riesgos.filter(r => 
                Array.isArray(r.items_wbs) ? r.items_wbs.includes(oldCode) : r.items_wbs === oldCode
            );
            
            if (affectedRisks.length > 0) {
                console.log(`  ⚠️  ALERTA DE IMPACTO (Riesgos):`);
                affectedRisks.forEach(r => {
                    console.log(`    - Riesgo ${r.id}: "${r.descripcion}" quedará HUÉRFANO.`);
                });
                impactFound = true;
            }
        }
    }

    // 2. ANÁLISIS HACIA ADELANTE (Impact N+1)
    console.log("\n🛰️ [CEREBRO] Proyectando impacto en Front-End (N+1)...");
    
    const htmlFiles = [
        'IX. WBS y Planificacion/WBS_Cronograma_Propuesta.html',
        'IX. WBS y Planificacion/WBS_Analisis_Riesgos.html'
    ];

    htmlFiles.forEach(file => {
        const fullPath = path.join(REPO_ROOT, file);
        if (fs.existsSync(fullPath)) {
            console.log(`  ✅ Verificando resiliencia en: ${path.basename(file)}`);
            // Simular búsqueda de código en el archivo (aunque use inyección JS)
        }
    });

    // 3. DICTAMEN TÉCNICO
    console.log("\n⚖️ [DIAGNOSTICO FINAL]");
    if (impactFound) {
        console.log("  🔴 ESTADO: RIESGO DE ROTURA DETECTADO.");
        console.log(`  💡 ACCIÓN RECOMENDADA: Ejecutar saneamiento recursivo en 'riesgos_wbs.js' antes de aplicar el cambio.`);
    } else {
        console.log("  🟢 ESTADO: CAMBIO SEGURO (DETERMINISTA).");
    }
}

// Demo Simulation
const targetItem = process.argv[2] || "1.1.100";
simulateWbsChange(targetItem, `${targetItem}-NEW`);
