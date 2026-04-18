// scripts/zero_residue_audit.js — Auditoría de Pureza SICC v12.0
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LFC2_DIR = '/home/administrador/docker/LFC2';
const BRAIN_DIR = '/home/administrador/docker/agente/brain';

const BLACKLIST = [
    { term: /2\.5\s*MM\s*USD|USD\s*2\.5\s*MM|2\.5\s*millones\s*de\s*dólares/i, reason: 'CAPEX Hallucination (Must be $726M COP)' },
    { term: /peones|pionero|sueño|dreamer|michelin certified|karpathy loop/i, reason: 'Prohibited IA Terminology' },
    { term: /microondas|catenaria|gateway lógico|itcs|alstom/i, reason: 'Excluded Technologies' },
    { term: /tecnoparte 2001/i, reason: 'Non-existent Regulation' }
];

async function runZeroResidueAudit() {
    console.log('[ZERO-RESIDUE] 🕵️ Iniciando Auditoría Forense de Residuo Cero (SICC v12.0)...');
    
    const searchDirs = [LFC2_DIR, path.join(BRAIN_DIR, 'PENDING_DTS')];
    let findings = [];

    for (const dir of searchDirs) {
        if (!fs.existsSync(dir)) continue;
        const cmd = `find ${dir} -type f -regex ".*\\.\\(md\\|html\\|json\\|txt\\)" ! -path "*/old/*" ! -path "*/.git/*"`;
        
        try {
            const files = execSync(cmd).toString().trim().split('\n');
            for (const file of files) {
                if (!file) continue;
                const content = fs.readFileSync(file, 'utf8');
                
                // 1. Check Blacklist Terms
                for (const item of BLACKLIST) {
                    if (item.term.test(content)) {
                        findings.push({
                            file: path.relative('/home/administrador/docker', file),
                            issue: item.reason,
                            evidence: content.match(item.term)[0]
                        });
                    }
                }

                // 2. Check Decimal Residue (Rounding issues > 4 decimals)
                const decimalMatches = content.match(/\d+\.\d{5,}/g);
                if (decimalMatches && !file.includes('coords') && !file.includes('gnss')) {
                    findings.push({
                        file: path.relative('/home/administrador/docker', file),
                        issue: 'Decimal Residue (Rounding Error)',
                        evidence: decimalMatches[0]
                    });
                }
            }
        } catch (err) {
            console.error(`[ZERO-RESIDUE] ❌ Error en directorio ${dir}:`, err.message);
        }
    }

    if (findings.length > 0) {
        console.log(`[ZERO-RESIDUE] ⚠️ Detectadas ${findings.length} impurezas forenses.`);
        return findings;
    } else {
        console.log('[ZERO-RESIDUE] ✅ Sistema blindado. Residuo Cero detectado.');
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
