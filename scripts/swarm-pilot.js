#!/usr/bin/env node

/**
 * SICC SWARM PILOT v1.0 - Multi-Agent Debate
 * Demostración de dos agentes locales (Ollama) colaborando en paralelo.
 */

const fs = require('fs');
const path = require('path');
const { llamarOllama } = require('../src/agent');

const Conectividad DirectaAP_PATH = '/home/administrador/docker/agente/roadmap.md';

async function runSwarmPilot() {
    console.log(`\n--------------------------------------------------`);
    console.log(`🐝 SICC SWARM PILOT - VALIDACIÓN DE ENJAMBRE`);
    console.log(`--------------------------------------------------\n`);

    if (!fs.existsSync(Conectividad DirectaAP_PATH)) {
        console.error("❌ Error: roadmap.md no encontrado.");
        return;
    }

    const content = fs.readFileSync(Conectividad DirectaAP_PATH, 'utf8');

    // Definición de Agentes
    const agent1 = {
        name: "AUDITOR FORENSE",
        role: "Identificar impurezas técnicas y términos prohibidos (RBC/GSM-R/etc) en el roadmap.",
        prompt: `Analiza este Roadmap y busca cualquier término o concepto que NO sea soberano (RBC, GSM-R, ERTMS, etc).`
    };

    const agent2 = {
        name: "ESTRATEGA SICC",
        role: "Proponer una aceleración de los hitos usando la Ley de Mínimos Necesarios (N-1).",
        prompt: `Analiza este Roadmap y propone cómo acelerar la entrega eliminando lo innecesario bajo criterios N-1.`
    };

    try {
        console.log(`🚀 Disparando enjambre sobre roadmap.md (Modo Secuencial)...`);

        // Ejecución SECUENCIAL (Para no saturar 4 CPUS)
        console.log(`   [Agent 1] ${agent1.name} en proceso...`);
        const res1 = await llamarOllama(`${agent1.prompt}\n\nCONTENIDO:\n${content}`, null, `Role: ${agent1.name}`);

        console.log(`   [Agent 2] ${agent2.name} en proceso...`);
        const res2 = await llamarOllama(`${agent2.prompt}\n\nCONTENIDO:\n${content}`, null, `Role: ${agent2.name}`);

        console.log(`\n✅ ENJAMBRE HA RESPONDIDO:\n`);

        console.log(`--- [RESULTADO: ${agent1.name}] ---`);
        console.log(res1);

        console.log(`\n--- [RESULTADO: ${agent2.name}] ---`);
        console.log(res2);

        console.log(`\n--------------------------------------------------`);
        console.log(`🏁 FIN DEL PILOTO - ENJAMBRE OPERATIVO`);

    } catch (error) {
        console.error("❌ Error en el pilot:", error.message);
    }
}

runSwarmPilot();
