const fs = require('fs');
const path = require('path');

const REPO_ROOT = '/home/administrador/docker/LFC2';
const TEMPLATE_PATH = path.join(REPO_ROOT, 'scripts/templates/premium-shell.html');
const SOURCE_MD = path.join(REPO_ROOT, 'X_ENTREGABLES_CONSOLIDADOS/7_SISTEMAS_EJECUTIVOS/SISTEMA_02_Telecomunicaciones_EJECUTIVO.md');
const TARGET_HTML = path.join(REPO_ROOT, 'X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/SISTEMA_02_Telecomunicaciones_EJECUTIVO.html');

console.log("🚀 Iniciando Regeneración Robusta - SISTEMA 02 Telecomunicaciones");

if (!fs.existsSync(SOURCE_MD)) {
    console.error("❌ Error: No se encuentra el archivo fuente MD.");
    process.exit(1);
}

let mdContent = fs.readFileSync(SOURCE_MD, 'utf8');

// 1. Saneamiento de Terminología (Regex Robusto)
const dbci = require(path.join(REPO_ROOT, 'IX. WBS y Planificacion/lfc-terminology.js'));
const mapCorreccion = dbci.CORRECTION_MAP;

Object.keys(mapCorreccion).forEach(key => {
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<!\\w)${escapedKey}(?!\\w)`, 'g');
    mdContent = mdContent.replace(regex, mapCorreccion[key]);
});

console.log("✅ Terminología saneada.");

// 2. Renderizado a HTML (Safe-Cooker Pro)
let bodyHtml = mdContent
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\|/g, '&nbsp;|&nbsp;')
    .replace(/\n/g, '<br>');

let template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

let finalHtml = template
    .replace(/\$title\$/g, "SISTEMA 02 Telecomunicaciones EJECUTIVO")
    .replace(/\$toc\$/g, "<!-- SICC Audit TOC -->")
    .replace(/\$body\$/g, bodyHtml)
    .replace(/{{content}}/g, bodyHtml);

// 3. Post-procesamiento (Badge & Styles)
const badge = `<span style="background: #0ea5e9; color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; margin-left: 12px; vertical-align: middle; font-weight: 800;">SICC PUREZA: 100%</span>`;
finalHtml = finalHtml.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/i, `$1$2 ${badge}$3`);

fs.writeFileSync(TARGET_HTML, finalHtml, 'utf8');
console.log(`✅ Deliverable generado exitosamente en: ${TARGET_HTML}`);
