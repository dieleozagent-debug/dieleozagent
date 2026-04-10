/**
 * SICC Forensic Auditor v1.0.0
 * Escanea el repositorio LFC2 buscando inconsistencias contra el DBCD_CRITERIA.md
 * Genera hipótesis automáticas para la cola de sueños (DREAMS.md).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { encolarEnDreamer } = require('../scripts/resource-governor'); 

const LFC2_ROOT = '/app/repos/LFC2';
const DBCD_PATH = '/app/data/brain/DBCD_CRITERIA.md';
const DREAMS_FILE = '/app/data/brain/DREAMS.md';

// Palabras clave prohibidas o sospechosas (Grasa Contractual)
const RED_FLAGS = [
    { term: 'G.655', reason: 'Fibras especializadas no primarias (DBCD-Cero Infraestructura Europa)' },
    { term: 'DWDM', reason: 'Multiplexación compleja no mandataria para Vital IP' },
    { term: 'balizas activas', reason: 'Infraestructura física wayside prohibida por PTC Virtual' },
    { term: 'Eurobaliza', reason: 'Protocolo propietario europeo rechazado por AREMA/FRA' },
    { term: 'cuatro puestos', reason: 'Redundancia CCO detectada; N-1 exige limitación a 3 puestos' },
    { term: '4 puestos', reason: 'Redundancia CCO detectada; N-1 exige limitación a 3 puestos' },
    { term: 'contadores de ejes', reason: 'Detección física wayside redundante frente a GNSS/Edometría' },
    { term: 'EN 50128', reason: 'Posible uso de norma europea para gobernar arquitectura (usar solo para SIL)' }
];

function scanFiles(dir, findings = []) {
    if (!fs.existsSync(dir)) return findings;
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git')) {
                scanFiles(fullPath, findings);
            }
        } else if (file.endsWith('.md') || file.endsWith('.txt') || file.endsWith('.json')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            for (const flag of RED_FLAGS) {
                if (content.includes(flag.term)) {
                    findings.push({
                        file: fullPath.replace(LFC2_ROOT, ''),
                        term: flag.term,
                        reason: flag.reason
                    });
                }
            }
        }
    }
    return findings;
}

async function run() {
    console.log('[AUDITOR] 🔍 Iniciando Escaneo Forense Proactivo...');
    const findings = scanFiles(LFC2_ROOT);
    
    if (findings.length === 0) {
        console.log('[AUDITOR] ✅ No se encontraron desviaciones superficiales en el repositorio.');
        return;
    }

    console.log(`[AUDITOR] 🎯 Detectadas ${findings.length} inconsistencias potenciales.`);
    
    // Agrupar por archivo para no saturar la cola
    const grouped = findings.reduce((acc, curr) => {
        if (!acc[curr.file]) acc[curr.file] = [];
        acc[curr.file].push(curr.term);
        return acc;
    }, {});

    for (const file in grouped) {
        const prompt = `AUDITORÍA FORENSE: El archivo ${file} contiene menciones de ${grouped[file].join(', ')}. 
        Validar contra el Axioma de Saneamiento y el DBCD. Generar DT de purga si corresponde.`;
        
        // Simular encolado (en lugar de usar process.env que no tenemos, usamos append directo si falla import)
        const timestamp = new Date().toISOString();
        const entrada = `\n- [PENDING] [NORMAL] [${timestamp}] [origen:auditor] ${prompt}\n`;
        
        // Leer el archivo para ver si ya existe el PENDING de ese archivo
        const currentDreams = fs.readFileSync(DREAMS_FILE, 'utf8');
        if (!currentDreams.includes(file)) {
            fs.appendFileSync(DREAMS_FILE, entrada);
            console.log(`[AUDITOR] 💤 Encolada hipótesis para: ${file}`);
        } else {
            console.log(`[AUDITOR] ⏭️ Omitiendo ${file} (ya está en cola).`);
        }
    }
}

run().catch(console.error);
