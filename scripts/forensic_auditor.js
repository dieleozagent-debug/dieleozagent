/**
 * 🛡️ SICC FORENSIC AUDITOR (v12.0)
 * Objetivo: Escaneo Determinístico de Pureza Contractual.
 * 
 * Filosofía: "Si el Verbo Rector no existe en el AT, o si el término es Propietario, es Bloqueo."
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('../src/config');
const { encolarHallazgo } = require('../src/digest');

const REPO_ROOT = fs.existsSync(path.join(__dirname, '../brain')) ? path.join(__dirname, '../') : config.paths.lfc2;

// 1. REGLAS MAESTRAS (Deducción N-1)
const RECTOR_VERBS = ['instalar', 'instalará', 'operar', 'operará', 'mantener', 'mantendrá', 'suministrar', 'proveer'];

const SOVEREIGN_INVARIANTS = [
    { rule: "NO_RBC", pattern: /RBC|ERTMS|Level 2/i, fix: "SICC PTC Virtual / Servidor Maestro" },
    { rule: "V_BLOCK_REJECTION", pattern: /V-Block|VBlock/i, fix: "Enclavamiento Electrónico SIL-4 (Arquitectura Abierta)" },
    { rule: "TOPOLOGY_REJECTION", pattern: /2oo3|Two-out-of-three/i, fix: "SIL-4 Master Server (Evitar Lock-in Propietario)" },
    { rule: "SOVEREIGN_NET", pattern: /GSM-R|Red Privada/i, fix: "Red Vital IP / TETRA (Solo Voz)" },
    { rule: "SATELITE_MANDATE", pattern: /Microondas|Radioenlace|Starlink|Viasat/i, fix: "LEO/GEO Genérico (Neutralidad Tecnológica)" },
    { rule: "FENOCO_GATEWAY_REJECTION", pattern: /Gateway FENOCO|Pasarela Lógica|ITCS Gateway/i, fix: "Interoperabilidad Operacional (Stop & Switch)" },
    { rule: "CATENARY_REJECTION", pattern: /Catenaria|Electrificación Futura|Tracción Eléctrica/i, fix: "Tracción Diésel-Eléctrica (Sin previsión de Catenaria - Dictamen 2026-04-13)" },
    { rule: "CAPEX_HOAX", pattern: /Capital de Emergencia|2\.5\s*MM|USD\s*2\.5/i, fix: "Rechazado (Hoax Financiero). El CAPEX oficial es $726,000,000 COP por locomotora." },
    { rule: "HALUCINATION_CLAUSE", pattern: /ART 2\.5\(2\)|Umbral de Ecuidadum/i, fix: "Término alucinado. Usar Sección 3.8(a)(i) para plazos." },
    { rule: "CCO_ERROR", pattern: /Barrancabermeja|PK 201\+470|Sección 20-9/i, fix: "Ubicación CCO: PK 0+000 / Interoperabilidad: Sección 2.209" }
];

const LEGACY_BLACKLIST = [
    'Peón', 'Peones', 'Sueño', 'Michelin', 'Karpathy', 'Dreamer', 'V-Block',
    'Canton Fijo', 'Bloque Fijo', 'Eurobaliza', 'NZ-DSF', 'G.655',
    'Capital de Emergencia', 'Ecuidadum', 'Sección 20-9'
];

/**
 * Análisis de Verbos Rectores
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

    // A. Detección de Invariantes
    SOVEREIGN_INVARIANTS.forEach(inv => {
        if (inv.pattern && inv.pattern.test(content)) {
            violations.push(`[ADN] Regresión Detectada: ${inv.rule}. Sugerido: ${inv.fix}`);
        }
    });

    // B. Mapeo de Verbos Rectores
    const verbs = analyzeRectorVerbs(content);
    if (verbs.length === 0 && !filePath.includes('II_Apendices_Tecnicos') && filePath.endsWith('.md')) {
        violations.push(`[SICC] AMBIGÜEDAD DETECTADA: Falta de Verbo Rector. El documento define parámetros sin respaldo contractual aparente.`);
    }

    // C. Blacklist Sistémica
    LEGACY_BLACKLIST.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        if (regex.test(content)) {
            violations.push(`[LEGACY] Término Prohibido: "${term}". Invalida la Pureza SICC.`);
        }
    });

    if (violations.length > 0) {
        encolarHallazgo(
            `Auditoría Forense: ${relativePath}`,
            `${violations.length} deficiencias detectadas. ADN o Legacy comprometido.`,
            'ALERTA',
            { archivo: relativePath, deficiencias: violations }
        );
    }

    return violations;
}

function runAudit(targetPath) {
    let report = [];
    if (!fs.existsSync(targetPath)) return report;
    
    const stats = fs.statSync(targetPath);

    if (stats.isFile()) {
        if (/\.(md|html|js|txt)$/.test(targetPath)) {
            const issues = auditFile(targetPath);
            if (issues.length > 0) report.push({ file: path.relative(REPO_ROOT, targetPath), issues });
        }
    } else {
        const files = fs.readdirSync(targetPath);
        files.forEach(file => {
            if (['.git', 'node_modules', 'bin', 'scripts', 'old', 'archive'].includes(file)) return;
            const fullPath = path.join(targetPath, file);
            report = report.concat(runAudit(fullPath));
        });
    }

    return report;
}

// Entry point
const args = process.argv.slice(2);
const target = args[0] ? (path.isAbsolute(args[0]) ? args[0] : path.resolve(REPO_ROOT, args[0])) : REPO_ROOT;

console.log("--------------------------------------------------");
console.log(`🛡️ SICC V12.0 | FORENSIC AUDITOR`);
console.log(`📍 Auditando: ${target}`);
console.log("--------------------------------------------------");

const results = runAudit(target);

if (results.length === 0) {
    console.log("✅ PUREZA CONTRACTUAL AL 100%. Cumple Estándares SICC v12.0.");
} else {
    console.log(`⚠️ SE DETECTARON ${results.length} ARCHIVOS CON DEFICIENCIAS (RED).`);
    results.forEach(res => {
        console.log(`\n📄 Archivo: ${res.file}`);
        res.issues.forEach(issue => console.log(`   - ${issue}`));
    });
}

console.log("\n--------------------------------------------------");
console.log("Fin del Audit Forense.");
