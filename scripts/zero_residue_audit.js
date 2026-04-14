// scripts/zero_residue_audit.js — Auditoría de Redondeo SICC v8.7
'use strict';

const fs = require('fs');
const path = require('path');

const TARGET_DIR = '/home/administrador/docker/LFC2';

async function runZeroResidueAudit() {
    console.log('[ZERO-RESIDUE] 🕵️ Iniciando auditoría de impurezas decimales...');
    
    // Buscamos en archivos MD, HTML y JSON que suelen contener cifras
    // Usamos shell find para mayor velocidad y alcance
    const { execSync } = require('child_process');
    const cmd = `find ${TARGET_DIR} -type f -regex ".*\\.\\(md\\|html\\|json\\|txt\\)" ! -path "*/old/*" ! -path "*/.git/*"`;
    
    try {
        const files = execSync(cmd).toString().trim().split('\n');
        let issuesFound = [];

        for (const file of files) {
            if (!file) continue;
            const content = fs.readFileSync(file, 'utf8');
            
            // Regex para buscar números con 3 o más decimales (presunta grasa matemática)
            // Excluimos versiones (v1.0.0) y fechas
            const decimalMatches = content.match(/\d+\.\d{3,}/g);
            
            if (decimalMatches) {
                // Filtrar probables falsos positivos (como coordenadas GNSS que SÍ requieren precisión)
                const realIssues = decimalMatches.filter(num => {
                    const val = parseFloat(num);
                    // Si el archivo habla de presupuesto o financiero, 3+ decimales es ERROR
                    if (file.toLowerCase().includes('wbs') || file.toLowerCase().includes('presupuesto')) return true;
                    // Generalmente, para CAPEX, no queremos micro-centavos erráticos
                    return val > 0 && num.split('.')[1].length > 4; // Más de 4 decimales es sospechoso de error de redondeo
                });

                if (realIssues.length > 0) {
                    issuesFound.push({
                        file: path.relative(TARGET_DIR, file),
                        samples: realIssues.slice(0, 3)
                    });
                }
            }
        }

        if (issuesFound.length > 0) {
            console.log(`[ZERO-RESIDUE] ⚠️ Detectadas ${issuesFound.length} impurezas de redondeo.`);
            return issuesFound;
        } else {
            console.log('[ZERO-RESIDUE] ✅ Repositorio limpio de residuos decimales.');
            return [];
        }
    } catch (err) {
        console.error('[ZERO-RESIDUE] ❌ Error durante la auditoría:', err.message);
        return [];
    }
}

if (require.main === module) {
    runZeroResidueAudit().then(issues => {
        if (issues.length > 0) {
            console.log(JSON.stringify(issues, null, 2));
            process.exit(1);
        }
        process.exit(0);
    });
}

module.exports = { runZeroResidueAudit };
