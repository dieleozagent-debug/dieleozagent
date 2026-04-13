/**
 * KARPATHY AUDIT PROTOCOL (SICC v8.0 "Punto 42")
 * Objetivo: Validación Contractual Sistémica (5 Fases).
 * 
 * Filosofía: "Deducción N-1. Si no hay Verbo Rector en el AT, es excedente."
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Conexión con el Búfer Michelin (v9.6.1)
const { encolarHallazgo } = require('../src/digest');

const REPO_ROOT = process.env.LFC2_ROOT || '/home/administrador/docker/LFC2';

// 1. REGLAS MAESTRAS (SICC_METHODOLOGY_42_ALPHA)
const RECTOR_VERBS = ['instalar', 'instalará', 'operar', 'operará', 'mantener', 'mantendrá', 'suministrar', 'proveer'];

const SOVEREIGN_INVARIANTS = [
    { rule: "NO_RBC", pattern: /RBC|ERTMS|Level 2/i, fix: "SICC PTC Virtual / Servidor Maestro" },
    { rule: "SOVEREIGN_NET", pattern: /GSM-R|Red Privada/i, fix: "Red Vital IP / TETRA" },
    { rule: "FIBER_SPEC", pattern: /G\.655|NZ-DSF/i, fix: "G.652.D (Backbone Soberano)" },
    { rule: "SATELITE_MANDATE", pattern: /Microondas|Radioenlace/i, fix: "Satélite (Habilitación AT1 / Mayor Calidad S. 9.11)" },
    { rule: "FENOCO_GATEWAY_REJECTION", pattern: /Gateway FENOCO|Pasarela Lógica/i, fix: "Material Rodante (Bien Revertible S. 3.3.c) - Stop & Switch" },
    { rule: "FINANCIAL_PADLOCK", pattern: /Obra Complementaria|Desarrollo Adicional/i, fix: "Bloqueo Preoperativo (Sección 25.4.f) - Fondeo Externo Requerido" },
    { rule: "BLOCK_LEGACY", pattern: /Canton Fijo|Bloque Fijo|Eurobaliza/i, fix: "Canton Virtual / Baliza Virtual (GNSS)" },
    { rule: "POWER_LEGACY", pattern: /Circuitos de Via (?!PaN)/i, fix: "Contadores de Ejes SIL-4 / Radar" }
];

const LEGACY_BLACKLIST = [
    'Caja Negra', 'Propietario', 'DWDM', 'SDH', 'Plesiocrono', 'Analogico', 'Cobro por evento'
];

/**
 * Fase 2: Análisis de Verbos Rectores
 * Busca si el texto tiene una intención contractual mandatoria.
 */
function analyzeRectorVerbs(content) {
    const findings = [];
    const lines = content.split('\n');
    lines.forEach((line, index) => {
        RECTOR_VERBS.forEach(verb => {
            const regex = new RegExp(`\\b${verb}\\b`, 'gi');
            if (regex.test(line)) {
                findings.push({ line: index + 1, verb: verb, context: line.trim() });
            }
        });
    });
    return findings;
}

/**
 * Auditoría de Archivo Individual
 */
function auditFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = path.relative(REPO_ROOT, filePath);
    let violations = [];

    // A. Detección de Invariantes (ADN Corrupto)
    SOVEREIGN_INVARIANTS.forEach(inv => {
        if (inv.pattern && inv.pattern.test(content)) {
            violations.push(`[ADN] Regresión Detectada: ${inv.rule}. Sugerido: ${inv.fix}`);
        }
    });

    // B. Mapeo de Verbos Rectores (Fase 1/2)
    const verbs = analyzeRectorVerbs(content);
    if (verbs.length === 0 && !filePath.includes('II_Apendices_Tecnicos')) {
        // Si es un documento de diseño/ conceptual y no tiene verbos rectores, 
        // podría estar "inventando" especificaciones (Alucinación de Ingeniería).
        violations.push(`[V8.0] AMBIGÜEDAD DETECTADA: Falta de Verbo Rector. El documento define parámetros sin respaldo contractual aparente (Candidato a N-1).`);
    }

    // C. Blacklist Sistémica
    LEGACY_BLACKLIST.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        if (regex.test(content)) {
            violations.push(`[LEGACY] Término Prohibido: "${term}". Invalida la Pureza SICC.`);
        }
    });

    // ❤️ ENVÍO AL BÚFER MICHELIN (v9.6.1)
    if (violations.length > 0) {
        encolarHallazgo(
            `Patrulla Forense: ${relativePath}`,
            `${violations.length} deficiencias detectadas. ADN o Legacy terms comprometidos.`,
            '🔬',
            { archivo: relativePath, deficiencias: violations }
        );
    }

    return violations;
}

/**
 * Generador de Reporte RED (Registro Ejecutivo de Deficiencias)
 */
function runAudit(targetPath) {
    let report = [];
    const stats = fs.statSync(targetPath);

    if (stats.isFile()) {
        if (/\.(md|html|js)$/.test(targetPath)) {
            const issues = auditFile(targetPath);
            if (issues.length > 0) report.push({ file: path.relative(REPO_ROOT, targetPath), issues });
        }
    } else {
        const files = fs.readdirSync(targetPath);
        files.forEach(file => {
            const fullPath = path.join(targetPath, file);
            if (['.git', 'node_modules', 'bin', 'scripts', 'lfc-terminology.js'].includes(file)) return;
            report = report.concat(runAudit(fullPath));
        });
    }

    return report;
}

// Entry point
const args = process.argv.slice(2);
const target = args[0] ? path.resolve(REPO_ROOT, args[0]) : REPO_ROOT;

console.log("--------------------------------------------------");
console.log(`📡 SICC V8.0 | KARPATHY AUDIT: PUNTO 42`);
console.log(`📍 Auditando: ${path.basename(target)}`);
console.log("--------------------------------------------------");

const results = runAudit(target);

if (results.length === 0) {
    console.log("✅ PUREZA CONTRACTUAL AL 100%. Cumple Metodología Punto 42.");
} else {
    console.log(`⚠️ SE DETECTARON ${results.length} ARCHIVOS CON DEFICIENCIAS (RED).`);
    results.forEach(res => {
        console.log(`\n📄 Archivo: ${res.file}`);
        res.issues.forEach(issue => console.log(`   - ${issue}`));
    });
}

console.log("\n--------------------------------------------------");
console.log("Fín del Audit Forense.");
