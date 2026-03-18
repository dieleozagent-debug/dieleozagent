/**
 * KARPATHY AUDIT PROTOCOL (SICC v6.3.2)
 * Objetivo: Realizar un audit conceptual profundo de la ingeniería.
 * No solo busca caracteres, busca "Regresiones de ADN".
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = '/home/administrador/docker/LFC2';

// 1. EL TRÁNSITO DE LA SOBERANÍA (Terminology & Compliance)
const SOVEREIGN_INVARIANTS = [
    { rule: "NO_RBC", pattern: /RBC|ERTMS|Level 2/i, fix: "SICC PTC Virtual / Servidor Maestro" },
    { old: /GSM-R/i, new: "Red Vital IP / TETRA" },
    { old: /Eurobaliza/i, new: "Baliza Virtual (GNSS)" },
    { old: /Caja Negra/i, new: "Arquitectura Abierta SICC" },
    { old: /Propropietario/i, new: "Soberano" }
];

const FORBIDDEN_PATHS = /[^a-zA-Z0-9_\-\.\/]/; // Nada que no sea URL-Safe

function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(REPO_ROOT, filePath);
    let violations = [];

    // Check Content Invariants
    SOVEREIGN_INVARIANTS.forEach(inv => {
        if (inv.pattern && inv.pattern.test(content)) {
            violations.push(`[ADN] Regresión Detectada: ${inv.rule}. Sugerido: ${inv.fix}`);
        } else if (inv.old && inv.old.test(content)) {
            violations.push(`[TERMINAL] Término Prohibido: "${inv.old.source}". Sugerido: "${inv.new}"`);
        }
    });

    // Check Path Integrity
    if (FORBIDDEN_PATHS.test(relativePath)) {
        violations.push(`[RUTA] Nombre no seguro (Zero-Accents Violation): ${relativePath}`);
    }

    return violations;
}

function runAudit(dir) {
    let report = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        if (file === '.git' || file === 'node_modules' || file === 'old' || file === 'bin') return;

        if (fs.statSync(fullPath).isDirectory()) {
            report = report.concat(runAudit(fullPath));
        } else if (/\.(md|html|js)$/.test(file)) {
            const fileViolations = auditFile(fullPath);
            if (fileViolations.length > 0) {
                report.push({ file: relativePath(fullPath), issues: fileViolations });
            }
        }
    });

    return report;
}

function relativePath(fullPath) {
    return path.relative(REPO_ROOT, fullPath);
}

console.log("--------------------------------------------------");
console.log("📡 INICIANDO KARPATHY AUDIT (SICC SOVEREIGN DNA)");
console.log("--------------------------------------------------");

const results = runAudit(REPO_ROOT);

if (results.length === 0) {
    console.log("✅ PUREZA AL 100%. El corredor es SICC Soberano.");
} else {
    console.log(`⚠️ SE DETECTARON ${results.length} ARCHIVOS CON IMPUREZAS.`);
    results.forEach(res => {
        console.log(`\n📄 Archivo: ${res.file}`);
        res.issues.forEach(issue => console.log(`   - ${issue}`));
    });
}

console.log("\n--------------------------------------------------");
console.log("Fín del Audit.");
