const fs = require('fs');
const path = require('path');

const targetDir = '/home/administrador/docker/LFC2';

const mappings = [
    { old: /00\. Gobernanza PMO/g, new: '00_Gobernanza_PMO' },
    { old: /01\. contrato en \.md/g, new: '01_Contrato_MD' },
    { old: /I\. Contrato General/g, new: 'I_Contrato_General' },
    { old: /II\. Apendices Tecnicos/g, new: 'II_Apendices_Tecnicos' },
    { old: /II\.A\. Analisis Contractual/g, new: 'II_A_Analisis_Contractual' },
    { old: /III\. Ingenieria conceptual/g, new: 'III_Ingenieria_conceptual' },
    { old: /IV\. Ingenieria basica/g, new: 'IV_Ingenieria_basica' },
    { old: /IV\. Ingenieria básica/g, new: 'IV_Ingenieria_basica' },
    { old: /V\. Ingenieria de detalle/g, new: 'V_Ingenieria_detalle' },
    { old: /IX\. WBS y Planificacion/g, new: 'IX_WBS_Planificacion' },
    { old: /VI\. operacion y mantenimiento y reversion/g, new: 'VI_Operacion_Mantenimiento_Reversion' },
    { old: /VII\. Soporte Especializado/g, new: 'VII_Soporte_Especializado' },
    { old: /VII\. documentos transversales/g, new: 'VII_Documentos_Transversales' },
    { old: /VIII\. Documentos Maestros y Metodologia/g, new: 'VIII_Documentos_Maestros_Metodologia' },
    // URL Encoded variants
    { old: /IV\.\%20Ingenieria\%20basica/g, new: 'IV_Ingenieria_basica' },
    { old: /IV\.\%20Ingenieria\%20b\%C3\%A1sica/g, new: 'IV_Ingenieria_basica' },
    { old: /V\.\%20Ingenieria\%20de\%20detalle/g, new: 'V_Ingenieria_detalle' },
    { old: /V\.\%20Ingeneiria\%20de\%20detalle/g, new: 'V_Ingenieria_detalle' } // Typo fix
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    for (const mapping of mappings) {
        if (mapping.old.test(content)) {
            content = content.replace(mapping.old, mapping.new);
            changed = true;
        }
    }

    if (changed) {
        console.log(`Updating links in: ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walk(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
        if (item === '.git' || item === 'node_modules') continue;
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            walk(fullPath);
        } else if (/\.(html|md|js|css)$/.test(item)) {
            processFile(fullPath);
        }
    }
}

console.log("Starting Global Link Synchronization...");
walk(targetDir);
console.log("Done.");
