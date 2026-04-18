/**
 * LFC DOCTOR (v1.0.0) - SICC Sovereign Health Check
 * Inspirado en 'openclaw doctor' 🦞
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = '/home/administrador/docker/LFC2';
const AGENTE_ROOT = '/home/administrador/docker/agente';

console.log("--------------------------------------------------");
console.log("🩺 LFC DOCTOR - Diagnóstico de Salud Soberana");
console.log("--------------------------------------------------");

let healthScore = 100;
let errors = [];
let warnings = [];

function check(testName, condition, errorMessage, isWarning = false) {
    if (!condition) {
        if (isWarning) {
            warnings.push(testName + ": " + errorMessage);
        } else {
            healthScore -= 10;
            errors.push(testName + ": " + errorMessage);
        }
        console.log(`[FAIL] ${testName}`);
    } else {
        console.log(`[PASS] ${testName}`);
    }
}

// 1. INFRAESTRUCTURA BÁSICA
check("Runtime Node.js", process.version.startsWith('v2'), "Se recomienda Node.js >= 20");
const PANDOC_PATH = '/home/administrador/docker/LFC2/bin/pandoc';
try {
    execSync(`${PANDOC_PATH} --version`, { stdio: 'ignore' });
    check("Pandoc Engine", true, "");
} catch (e) {
    check("Pandoc Engine", false, "Pandoc no está instalado o no es accesible en " + PANDOC_PATH);
}

// 2. INTEGRIDAD DEL CEREBRO (SICC DNA)
check("Brain: IDENTITY.md", fs.existsSync(path.join(AGENTE_ROOT, 'brain/IDENTITY.md')), "IDENTITY.md no encontrado.");
check("Brain: AGENTS.md", fs.existsSync(path.join(AGENTE_ROOT, 'brain/AGENTS.md')), "AGENTS.md no encontrado.");
check("Brain: HEARTBEAT.md", fs.existsSync(path.join(AGENTE_ROOT, 'brain/HEARTBEAT.md')), "HEARTBEAT.md no encontrado.");

// 3. NORMALIZACIÓN DE RUTAS (Zero-Accents v2.0)
const folders = fs.readdirSync(REPO_ROOT);
const dirtyFolders = folders.filter(f => /[^a-zA-Z0-9_\-\.\/]/.test(f) && !f.startsWith('.'));
check("Rutas Limpias (URL-Safe)", dirtyFolders.length === 0, `Se encontraron carpetas con caracteres no seguros: ${dirtyFolders.join(', ')}`);

// 4. ESTADO DE GIT
try {
    const status = execSync(`git -C ${REPO_ROOT} status --porcelain`).toString();
    check("Despliegue Limpio (Git)", status === "", "Hay cambios locales no comitados en LFC2.", true);
} catch (e) {
    check("Git Access", false, "Error al acceder a Git.");
}

const isFixMode = process.argv.includes('--fix');

function applyFix(dir) {
    const indexPath = path.join(REPO_ROOT, dir, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log(`[FIXING] Creando portal index.html en ${dir}...`);
        const template = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>SICC - ${dir}</title><style>body { background: #0a192f; color: #e6f1ff; font-family: sans-serif; padding: 2rem; } a { color: #ffd700; }</style></head><body><h1>Saneamiento: ${dir}</h1><a href="/">← Volver</a><ul><li>Portal Auto-Generado por SICC Doctor</li></ul></body></html>`;
        fs.writeFileSync(indexPath, template);
    }
}

// 4.1 INTEGRIDAD WEB (Self-Healing Check)
console.log("\nEjecutando Portabilidad Web...");
if (isFixMode) {
    try {
        console.log("[LEARNING] Actualizando mapeo de rutas virtuales...");
        execSync(`node ${AGENTE_ROOT}/scripts/lfc_learn.js`);
    } catch (e) {
        console.log("❌ Error en lfc_learn.js");
    }
}
const vercelPath = path.join(REPO_ROOT, 'vercel.json');
if (fs.existsSync(vercelPath)) {
    try {
        const vercel = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
        let brokenRewrites = [];
        vercel.rewrites.forEach(r => {
            const dest = path.join(REPO_ROOT, r.destination.split('?')[0]);
            if (!fs.existsSync(dest)) brokenRewrites.push(r.destination);
        });
        check("Vercel Rewrites", brokenRewrites.length === 0, `Rutas rotas en vercel.json: ${brokenRewrites.join(', ')}`);
    } catch (e) {
        check("Vercel Config", false, "Error al parsear vercel.json");
    }
}

const mainDirs = ['IV_Ingenieria_basica', 'V_Ingenieria_detalle', 'VII_Soporte_Especializado', 'III_Ingenieria_conceptual'];
mainDirs.forEach(dir => {
    const exists = fs.existsSync(path.join(REPO_ROOT, dir, 'index.html'));
    if (!exists && isFixMode) applyFix(dir);
    check(`Entry Point: ${dir}`, fs.existsSync(path.join(REPO_ROOT, dir, 'index.html')), `Falta index.html en ${dir}`);
});

// 5. AUDIT CONCEPTUAL (Karpathy Audit)
console.log("\nEjecutando Audit Conceptual...");
try {
    const auditOutput = execSync(`node ${AGENTE_ROOT}/scripts/karpathy_audit.js`).toString();
    if (auditOutput.includes("✅ PUREZA AL 100%")) {
        check("Pureza SICC", true, "");
    } else {
        check("Pureza SICC", false, "Se detectaron impurezas conceptuales (RBC/GSM-R/etc).");
    }
} catch (e) {
    check("Audit Script", false, "Error al ejecutar karpathy_audit.js");
}

console.log("\n--------------------------------------------------");
console.log(`📊 RESULTADO FINAL: ${healthScore}/100`);
if (errors.length > 0) {
    console.log("\n❌ ERRORES CRÍTICOS:");
    errors.forEach(e => console.log(`   - ${e}`));
}
if (warnings.length > 0) {
    console.log("\n⚠️ ADVERTENCIAS:");
    warnings.forEach(w => console.log(`   - ${w}`));
}
console.log("--------------------------------------------------");

if (healthScore < 80) {
    console.log("🆘 El sistema requiere atención inmediata. Corre 'node scripts/lfc-daemon.js'.");
    process.exit(1);
} else {
    console.log("🚀 Sistema saludable y listo para la SOBERANÍA.");
    process.exit(0);
}
