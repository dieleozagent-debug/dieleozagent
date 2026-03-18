const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = '/home/administrador/docker/LFC2';
const TERMINOLOGY_PATH = path.join(REPO_ROOT, 'IX. WBS y Planificacion/lfc-terminology.js');
const AUDIT_PATHS = [
    'III. Ingenieria conceptual',
    'IV. Ingenieria basica',
    'V. Ingenieria de detalle',
    'X_ENTREGABLES_CONSOLIDADOS/7_SISTEMAS_EJECUTIVOS'
];

console.log("🔍 INICIANDO REPORTE DE AUDITORÍA KARPATHY v6.5");
console.log("----------------------------------------------");

const dbci = require(TERMINOLOGY_PATH);
const blacklist = dbci.LEGACY_BLACKLIST;

let totalIssues = 0;
const report = {};

blacklist.forEach(term => {
    AUDIT_PATHS.forEach(p => {
        const fullPath = path.join(REPO_ROOT, p);
        if (!fs.existsSync(fullPath)) return;
        
        try {
            // Escapar el término para grep
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const output = execSync(`grep -ri "${escapedTerm}" "${fullPath}" | grep -v "lfc-terminology.js" | head -n 5`, { encoding: 'utf8' });
            
            if (output) {
                if (!report[term]) report[term] = [];
                report[term].push({ path: p, count: output.split('\n').filter(l => l).length });
                totalIssues++;
            }
        } catch (e) {
            // Grep returns non-zero exit code if no matches found
        }
    });
});

if (totalIssues === 0) {
    console.log("✅ PUREZA GARANTIZADA: No se encontraron términos legacy.");
} else {
    console.log(`⚠️ SE DETECTARON ${totalIssues} PATRONES LEGACY:`);
    console.log(JSON.stringify(report, null, 2));
    console.log("\n💡 RECOMENDACIÓN: Ejecutar 'node scripts/lfc-cli.js purify' o actualizar el CORRECTION_MAP.");
}
