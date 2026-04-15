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
const DBCD_PATH = '/home/administrador/docker/agente/brain/DBCD_CRITERIA.md';
const AUDIT_QUEUE_FILE = '/home/administrador/docker/agente/brain/AUDIT_QUEUE.md';
const DICTAMENES_DIR = '/home/administrador/docker/agente/brain/dictamenes';

// Palabras clave prohibidas o sospechosas (Grasa Contractual / Legacy)
const RED_FLAGS = [
    { term: 'G.655', reason: 'Fibras no primarias (DBCD-Cero Infraestructura Europa)' },
    { term: 'DWDM', reason: 'Multiplexación compleja no mandataria para Vital IP' },
    { term: 'V-Block', reason: 'Marca propietaria prohibida (Neutralidad Tecnológica)' },
    { term: '2oo3', reason: 'Topología propietaria rechazada; usar SIL-4 abierto' },
    { term: 'Starlink', reason: 'Marca satelital prohibida; usar LEO genérico' },
    { term: 'Viasat', reason: 'Marca satelital prohibida; usar GEO genérico' },
    { term: 'Barrancabermeja', reason: 'Posible ubicación errónea del CCO (Sovereign Core en PK 0+000)' },
    { term: 'PK 201+470', reason: 'Ubicación errónea del CCO (Verificar AT1)' },
    { term: 'balizas activas', reason: 'Infraestructura wayside prohibida por PTC Virtual' },
    { term: 'Eurobaliza', reason: 'Protocolo propietario europeo rechazado' },
    { term: 'contadores de ejes', reason: 'Redundancia física wayside prohibida por GNSS/Odometría' },
    { term: 'Capital de Emergencia', reason: 'Cláusula inexistente / Alucinación financiera' },
    { term: '2.5 MM USD', reason: 'CAPEX inflado (Hoax); el límite es $726M COP' },
    { term: 'Umbral de Ecuidadum', reason: 'Término alucinado; no existe en la Biblia Legal' },
    { term: 'Sección 20-9', reason: 'Cita errónea; la interoperabilidad es Sección 2.209' },
    { term: 'estándar FENOCO', reason: 'Lock-in propietario; la regla es Stop & Switch (Sec. 2.209)' }
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
        console.log('[AUDITOR] [SICC OK] No se encontraron desviaciones superficiales en el repositorio.');
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
        // 🛡️ GATEKEEPER: Bloqueo de modificación sobre Dictámenes Aprobados
        if (file.startsWith(DICTAMENES_DIR) || file.includes('/dictamenes/')) {
            console.warn(`[AUDITOR] 🛡️ [SICC LOCKER] Intento de auditoría sobre Dictamen Aprobado ${file} RECHAZADO. Los Gold Standards son inmutables.`);
            continue;
        }

        const prompt = `AUDITORÍA FORENSE: El archivo ${file} contiene menciones de ${grouped[file].join(', ')}. 
        Validar contra el Axioma de Saneamiento y el DBCD. Generar DT de purga si corresponde.`;
        
        const timestamp = new Date().toISOString();
        const entrada = `\n- [PENDING] [NORMAL] [${timestamp}] [origen:auditor] ${prompt}\n`;
        
        if (!fs.existsSync(AUDIT_QUEUE_FILE)) {
            fs.writeFileSync(AUDIT_QUEUE_FILE, '# 🔬 SICC AUDIT QUEUE\n\n## Pendientes\n');
        }

        const currentQueue = fs.readFileSync(AUDIT_QUEUE_FILE, 'utf8');
        if (!currentQueue.includes(file)) {
            fs.appendFileSync(AUDIT_QUEUE_FILE, entrada);
            console.log(`[AUDITOR] [SICC QUEUE] Encolada hipótesis forense para: ${file}`);
        } else {
            console.log(`[AUDITOR] ⏭️ Omitiendo ${file} (ya está en la cola de auditoría).`);
        }
    }
}

run().catch(console.error);
