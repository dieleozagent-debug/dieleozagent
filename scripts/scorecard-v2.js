#!/usr/bin/env node

/**
 * SICC SCORECARD v2.0 - Sovereign LLM Auditor
 * Powered by sicc-cerebro:latest (Gemma 4 Q5_K_M)
 */

const fs = require('fs');
const path = require('path');
const { llamarOllama, config, SYSTEM_PROMPT } = require('../src/agent');

// Configuración del entorno
const REPO_ROOT = '/home/administrador/docker/LFC2';
const BRAIN_PATH = '/home/administrador/docker/agente/brain';

async function generateScorecard(targetFilePath) {
    if (!fs.existsSync(targetFilePath)) {
        console.error(`❌ Error: El archivo ${targetFilePath} no existe.`);
        process.exit(1);
    }

    const content = fs.readFileSync(targetFilePath, 'utf8');
    const criteria = fs.readFileSync(path.join(BRAIN_PATH, 'DBCD_CRITERIA.md'), 'utf8');
    const fileName = path.basename(targetFilePath);

    console.log(`\n--------------------------------------------------`);
    console.log(`🧠 SICC SCORECARD v2.0 - AUDITORÍA FORENSE`);
    console.log(`📄 Archivo: ${fileName}`);
    console.log(`--------------------------------------------------\n`);

    const prompt = `
Actúa como un Auditor Forense SICC. Evalúa el siguiente documento técnico basándote en los criterios DBCD adjuntos. 
Tu objetivo es identificar "Regresiones de ADN" (tecnologías obsoletas o prohibidas) y proponer sanaciones N-1.

### CRITERIOS DBCD (SSOT):
${criteria}

### DOCUMENTO A AUDITAR:
---
${content}
---

### INSTRUCCIONES DE RESPUESTA:
Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
{
  "score": (número del 0 al 100),
  "summary": "Breve resumen del estado de pureza",
  "impurities": [
    { "type": "ADN|CONTRACTUAL|TECNICO", "issue": "Descripción del problema", "risk": "ALTO|MEDIO|BAJO" }
  ],
  "recommendations": ["Recomendación 1", "Recomendación 2"],
  "verdict": "APROBADO | CONDICIONADO | RECHAZADO"
}
`;

    try {
        console.log(`📡 Consultando al Cerebro Local (Ollama)...`);
        const responseText = await llamarOllama(prompt, null, "Auditoría Forense Directa");
        
        // Limpiar el JSON de posibles bloques de código triple backtick
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.log("❌ El Cerebro no devolvió un JSON válido.");
            console.log("Respuesta cruda:", responseText);
            return;
        }

        const report = JSON.parse(jsonMatch[0]);

        console.log(`\n📊 RESULTADOS:`);
        console.log(`⭐ PUNTUACIÓN: ${report.score}/100`);
        console.log(`⚖️ VERDICTO: ${report.verdict}`);
        console.log(`📝 RESUMEN: ${report.summary}`);

        if (report.impurities.length > 0) {
            console.log(`\n🔴 IMPUREZAS DETECTADAS:`);
            report.impurities.forEach(imp => {
                console.log(`   [${imp.type}] [${imp.risk}] ${imp.issue}`);
            });
        }

        if (report.recommendations.length > 0) {
            console.log(`\n💡 RECOMENDACIONES SICC:`);
            report.recommendations.forEach(rec => console.log(`   - ${rec}`));
        }

        console.log(`\n--------------------------------------------------`);

    } catch (error) {
        console.error("❌ Error durante la auditoría:", error.message);
    }
}

// Ejecutar
const fileToAudit = process.argv[2];
if (!fileToAudit) {
    console.log("Uso: node scorecard-v2.js <ruta_al_archivo>");
    process.exit(1);
}

generateScorecard(path.resolve(fileToAudit));
