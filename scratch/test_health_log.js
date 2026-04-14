
/**
 * Verificación manual del latido de salud institucional SICC
 */
'use strict';

const fs = require('fs');
const path = require('path');
const { obtenerResumenForense } = require('../src/heartbeat');
const config = require('../src/config');
const { estadoBrain } = require('../src/brain');

async function testHealthLog() {
    console.log('🩺 DISPARANDO LATIDO MANUAL...');
    const LOGS_DIR = path.join(__dirname, '../data/logs');
    const logPath = path.join(LOGS_DIR, 'health.log');

    try {
        const resumen = await obtenerResumenForense();
        const timestamp = new Date().toISOString();
        
        const logEntry = `[${timestamp}] ❤️ MANUAL_TEST: ${resumen.statusGeneral} | IA: ${config.ai.primaryProvider} | ${resumen.clima} | ${resumen.crossRefReporte.trim().replace(/\n/g, ' ')} | ${resumen.zeroResidueReporte.trim().replace(/\n/g, ' ')}\n`;

        fs.appendFileSync(logPath, logEntry);
        console.log('✅ Latido registrado en:', logPath);
        console.log('内容:', logEntry);
    } catch (err) {
        console.error('❌ Error en prueba de salud:', err.message);
    }
}

testHealthLog();
