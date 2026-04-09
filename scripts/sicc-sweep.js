/**
 * SICC SWEEP ORCHESTRATOR (v8.0)
 * Objetivo: Ejecutar el barrido masivo Punto 42 sobre todas las carpetas legacy.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = process.env.LFC2_ROOT || '/home/administrador/docker/LFC2';
const AGENTE_ROOT = '/home/administrador/docker/agente';

const FOLDERS_TO_SWEEP = [
    'I_Contrato_General',
    'II_A_Analisis_Contractual',
    'II_Apendices_Tecnicos',
    'III_Ingenieria_conceptual',
    'IV_Ingenieria_basica',
    'V_Ingenieria_detalle',
    'VI_Operacion_Mantenimiento_Reversion',
    'VII_Documentos_Transversales',
    'VII_Soporte_Especializado',
    'VIII_Documentos_Maestros_Metodologia',
    'X_ENTREGABLES_CONSOLIDADOS'
];

async function runSweep() {
    console.log("==================================================");
    console.log("🧹 INICIANDO BARRIDO MASIVO: METODOLOGÍA PUNTO 42");
    console.log("==================================================");

    for (const folder of FOLDERS_TO_SWEEP) {
        const fullPath = path.join(REPO_ROOT, folder);
        if (!fs.existsSync(fullPath)) {
            console.log(`[SKIPPED] Carpeta no encontrada: ${folder}`);
            continue;
        }

        console.log(`\n🚀 AUDITANDO: ${folder}...`);
        try {
            // Ejecutar el audit y capturar la salida
            const output = execSync(`node ${path.join(AGENTE_ROOT, 'scripts/karpathy_audit.js')} "${folder}"`).toString();
            console.log(output);
        } catch (e) {
            console.error(`[ERROR] Falló auditoría en ${folder}:`, e.message);
        }
    }

    console.log("\n==================================================");
    console.log("✅ BARRIDO COMPLETADO.");
    console.log("Consulte los logs para identificar los RED prioritarios.");
    console.log("==================================================");
}

runSweep();
