/**
 * sicc-sentinel.js — ORQUESTADOR DE AUTO-SANEAMIENTO (v1.0)
 * Utiliza el Multiplexador Free para romper bloqueos de ingesta sin intervención humana.
 */
'use strict';

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const { llamarMultiplexadorFree, registrarBloqueoSICC } = require('../src/agent');
const { enviarAlerta } = require('../src/notifications');

const INGESTOR_PATH = path.join(__dirname, '../src/ingest_masivo.js');
const LOG_PATH = path.join(__dirname, '../data/logs/sentinel-audit.log');

async function sentinelLoop() {
    console.log('🛡️ [SENTINEL] Iniciando Guardia Autónoma (Costo 0)...');
    
    // 1. Ejecutar Ingestor Masivo
    const child = spawn('node', [INGESTOR_PATH], {
        env: { ...process.env, NODE_ENV: 'production' }
    });

    let stderrBuffer = '';
    child.stderr.on('data', (data) => {
        stderrBuffer += data.toString();
        process.stderr.write(data);
    });

    child.on('close', async (code) => {
        if (code !== 0 || stderrBuffer.includes('Error')) {
            console.error(`\n🚨 [SENTINEL] Fallo detectado (Código ${code}). Iniciando Diagnóstico Free...`);
            await handleFailure(stderrBuffer);
        } else {
            console.log('\n✅ [SENTINEL] Ingesta completada con éxito. Brain sincronizado.');
            await enviarAlerta('✅ *SICC SENTINEL:* Ingesta completada exitosamente. El Brain está refundado.');
        }
    });
}

async function handleFailure(errorLog) {
    const promptDiagnostico = `Has detectado un error en el motor de ingesta masiva SICC. 
    Analiza el siguiente log de error y propón una solución técnica concisa. 
    
    LOG DE ERROR:
    ${errorLog.substring(0, 2000)}
    
    INSTRUCCIÓN: Responde con el diagnóstico y el comando de reparación si es posible (ej: chmod, mkdir, ajuste de variable).`;

    try {
        const { texto: diagnostico, proveedor } = await llamarMultiplexadorFree(promptDiagnostico, '', 'Eres un Ingeniero de Sistemas SICC experto en Auto-Saneamiento.');
        
        const timestamp = new Date().toISOString();
        const entry = `\n### 🛡️ AUTO-DIAGNÓSTICO SENTINEL (${timestamp})\n- **Proveedor:** ${proveedor}\n- **Diagnóstico:** ${diagnostico}\n`;
        fs.appendFileSync(path.join(__dirname, '../brain/SICC_OPERATIONS.md'), entry);

        // Notificar al humano
        await enviarAlerta(`🚨 *SENTINEL ALERT:* Fallo en ingesta.\n\n*Diagnóstico Free (${proveedor}):*\n${diagnostico}\n\nRevisar SICC_OPERATIONS.md.`);
        
        console.log(`[SENTINEL] Diagnóstico registrado vía ${proveedor}.`);
    } catch (e) {
        await registrarBloqueoSICC('Diagnóstico de Sentinel', e.message);
    }
}

sentinelLoop();
