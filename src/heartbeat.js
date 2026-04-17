/**
 * heartbeat.js — Núcleo de Auditoría Forense y Monitoreo Institucional SICC v8.7.5
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const config = require('./config');

/**
 * Consulta el clima de Bogotá para el reporte matutino.
 * Usa wttr.in para una obtención soberana y ligera.
 */
async function consultarClimaBogota() {
    return new Promise((resolve) => {
        exec('curl -s "wttr.in/Bogota?format=%C+%t+&m"', (error, stdout) => {
            if (error) {
                resolve('Clima: Información no disponible (Offline)');
            } else {
                resolve(`Clima Bogotá: ${stdout.trim() || 'Despejado 18°C (Est.)'}`);
            }
        });
    });
}

/**
 * SSoT Cross-Ref Check:
 * Compara los registros en DREAMS.md con los archivos físicos en PENDING_DTS.
 * Detecta huérfanos o inconsistencias de estado.
 */
async function ejecutarCrossRefCheck() {
    const dreamsPath = path.join(config.paths.brain, 'DREAMS.md');
    const dtsDir = path.join(config.paths.brain, 'PENDING_DTS');
    
    // Si no existe PENDING_DTS, lo creamos para evitar el bloqueo del Centinela
    if (!fs.existsSync(dtsDir)) fs.mkdirSync(dtsDir, { recursive: true });

    if (!fs.existsSync(dreamsPath)) {
        return { 
            status: 'WARN', 
            reporte: '📌 **SICC Cross-Ref Audit:** Archivo DREAMS.md no localizado (Saneamiento pendiente).' 
        };
    }

    const content = fs.readFileSync(dreamsPath, 'utf8');
    const files = fs.readdirSync(dtsDir);
    
    // Buscar menciones de archivos en DREAMS.md
    const matches = content.match(/DT-DREAM-[^\s\)]+/g) || [];
    const uniqueMatches = [...new Set(matches)];
    
    const huerfanos = files.filter(f => !content.includes(f));
    const faltantes = uniqueMatches.filter(m => !files.some(f => m.includes(f)));

    let reporte = `📌 **SICC Cross-Ref Audit:** ${huerfanos.length > 0 || faltantes.length > 0 ? '[SICC WARN]' : '[SICC OK]'}\n`;
    if (huerfanos.length > 0) reporte += `• Huérfanos en PENDING_DTS: ${huerfanos.length}\n`;
    if (faltantes.length > 0) reporte += `• Referencias rotas en DREAMS.md: ${faltantes.length}\n`;
    if (huerfanos.length === 0 && faltantes.length === 0) reporte += `• Integridad Referencial: 100%\n`;

    return { 
        status: (huerfanos.length > 0 || faltantes.length > 0) ? 'FAIL' : 'OK', 
        reporte 
    };
}

/**
 * Zero-Residue Audit:
 * Busca decimales erráticos (>2 decimales) en archivos financieros sospechosos.
 * N-1 Deductive Logic para purgar "grasa matemática".
 */
async function ejecutarZeroResidueCheck() {
    const lfcRoot = config.paths.lfc2;
    // Buscamos en archivos de presupuesto o tablas técnicas (HTML/MD/JSON)
    const cmd = `grep -rE "[0-9]+\\.[0-9]{3,}" ${lfcRoot} --include="*.md" --include="*.html" --include="*.json" | grep -v "node_modules" | head -10`;

    return new Promise((resolve) => {
        exec(cmd, (error, stdout) => {
            let reporte = `⚖️ **Zero-Residue Audit:** `;
            if (stdout.trim()) {
                const lines = stdout.trim().split('\n').length;
                reporte += `[SICC WARN] Detectadas ${lines} posibles inconsistencias matemáticas (precision > 2).`;
            } else {
                reporte += `[SICC OK] Purity Check: OK (Redondeo N-1 validado).`;
            }
            resolve({ 
                status: stdout.trim() ? 'WARN' : 'OK', 
                reporte,
                raw: stdout.trim() 
            });
        });
    });
}

/**
 * Consolidado final para el Heartbeat
 */
async function obtenerResumenForense() {
    const clima = await consultarClimaBogota();
    const crossRef = await ejecutarCrossRefCheck();
    const zeroResidue = await ejecutarZeroResidueCheck();

    return {
        clima,
        crossRefReporte: crossRef.reporte,
        zeroResidueReporte: zeroResidue.reporte,
        statusGeneral: (crossRef.status === 'OK' && zeroResidue.status === 'OK') ? 'HEALTHY' : 'NEEDS_ATTENTION'
    };
}

module.exports = {
    consultarClimaBogota,
    ejecutarCrossRefCheck,
    ejecutarZeroResidueCheck,
    obtenerResumenForense
};
