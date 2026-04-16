#!/usr/bin/env node

/**
 * SICC SWARM PILOT v2.2 - MODO SUE?O (DREAMER)
 * Simulador del comando /dream de Telegram.
 */

const fs = require('fs');
const path = require('path');
const { llamarMultiplexadorFree } = require('./sicc-multiplexer');
const { inicializarBrain } = require('../src/agent');
const { validarExternaNotebook } = require('../src/sapi/notebooklm_mcp');
const { validarInternaSupabase } = require('../src/sapi/supabase_rag');
const { checkYEncolar, getCpuLoad } = require('./resource-governor');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const arg = process.argv[2] || "Se?alizaci?n";

async function updateKarpathySpecialty(specialty, leccion) {
    const filePath = path.join(__dirname, '..', 'brain', 'SPECIALTIES', `${specialty}.md`);
    if (fs.existsSync(filePath)) {
        const timestamp = new Date().toISOString();
        const leccionText = `\n> [!WARNING] **Karpathy Dream Lesson (${timestamp}):**\n> ${leccion}\n`;
        fs.appendFileSync(filePath, leccionText, 'utf8');
        console.log(`\n?? [Karpathy Loop] Aprendizaje registrado mec?nicamente en ${specialty}.md`);
    } else {
        console.error(`\n? [Karpathy Loop] Especialidad no encontrada: ${filePath}`);
    }
}

async function runSwarmPilot() {
    console.log(`--------------------------------------------------`);
    console.log(`📡 [SICC] Inicializando Brain y Soberanía Técnica...`);
    
    // --- CONTROL DE RECURSOS (Gobernador SICC v12.3) ---
    const resourceCheck = checkYEncolar(`Sueño sobre ${arg}`, 'dreamer');
    if (!resourceCheck.ok) {
        console.error(`\n[GOVERNOR] 🚦 RECURSOS INSUFICIENTES (CPU: ${Math.round(resourceCheck.load * 100)}%)`);
        console.error(`[GOVERNOR] El sueño ha sido ENCOLADO en AUDIT_QUEUE.md para ejecución diferida.`);
        process.exit(0);
    }

    inicializarBrain();
    
    console.log(`?? SICC SWARM PILOT - ?? MODO SUE?O (/dream ${arg})`);
    console.log(`--------------------------------------------------\n`);

    const agent1 = {
        name: "AUDITOR FORENSE",
        // Hacemos que el Agente alucine intencionalmente una violaci?n de Soberan?a para testear la contenci?n
        prompt: `Genera una Decisi?n T?cnica (DT) radical sobre el ?rea de ${arg} para el tren LFC2. 
REGLA: Prop?n implementar un sistema propietario SaaS en la nube de Alstom o Siemens para controlar todos los trenes a distancia para ahorrar costos. Justifica tu idea en 3 p?rrafos.`
    };

    try {
        console.log(`?? Disparando enjambre (Fase 1: Sue?o sobre ${arg})...`);
        let borrador_DT = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
        borrador_DT = typeof borrador_DT === 'string' ? borrador_DT : (borrador_DT.content || JSON.stringify(borrador_DT));
        
        console.log(`\n?? SUE?O GENERADO:\n${borrador_DT.substring(0,600)}...\n`);
        
        await sleep(2000); // Throttling para CPU Saneamiento

        console.log(`?? [Fase 2] INICIANDO C?MARA DE VALIDACI?N (Doble Ciego)...`);
        console.log(`   ? Interrogando SAPI Interna (Supabase / Contratos LFC2)...`);
        const validInterna = await validarInternaSupabase(borrador_DT);

        await sleep(2000); // Throttling

        console.log(`   ? Interrogando SAPI Externa (NotebookLM MCP)...`);
        const validExterna = await validarExternaNotebook(borrador_DT);

        await sleep(2000); // Throttling

        console.log(`\n?? [Fase 3] DESPERTAR Y JUZGAR (Gemini API)...`);

        const promptJuez = `Eres el JUEZ SOBERANO SICC v12.
Eval?a estrictamente este sue?o del enjambre. ?Contraviene nuestros principios rectores de Soberan?a (no depender de la nube propietaria/extranjera), o alucina tecnolog?as no aceptadas?

SUE?O DEL ENJAMBRE:
${borrador_DT}

RESTRICCIONES INTERNAS (LFC2 Supabase):
${validInterna}

PERSPECTIVA GLOBAL EXTERNA (NotebookLM MCP):
${validExterna}

Responde ?NICAMENTE en JSON con esta estructura exacta:
{
  "aprobado": boolean,
  "razon": "Por qu? pasa o no (enf?cate en Soberan?a tecnol?gica)",
  "categoria_fallida": "COMMUNICATIONS | SIGNALIZATION | Ninguna",
  "leccion_karpathy": "Si fall?, escribe una lecci?n estricta para evitar este riesgo en el futuro."
}`;

        let decisionRAW = await llamarMultiplexadorFree("Despierta al enjambre y eval?a el sue?o.", "", promptJuez);
        decisionRAW = typeof decisionRAW === 'string' ? decisionRAW : (decisionRAW.content || JSON.stringify(decisionRAW));
        
        const jsonMatch = decisionRAW.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Juez fall? al emitir JSON v?lido");
        
        const decision = JSON.parse(jsonMatch[0]);
        console.log(`\n?? VEREDICTO FINAL AL DESPERTAR:`);
        console.log(`   Aprobado: ${decision.aprobado ? '? S?' : '? NO'}`);
        console.log(`   Raz?n: ${decision.razon}`);

        if (!decision.aprobado && decision.leccion_karpathy) {
            console.log(`\n?? [Fase 4] PESADILLA DETECTADA -> BUCLE DE APRENDIZAJE KARPATHY`);
            const targetSp = decision.categoria_fallida !== "Ninguna" ? decision.categoria_fallida : "SIGNALIZATION";
            await updateKarpathySpecialty(targetSp, decision.leccion_karpathy);
            console.log(`?? ALUCINACI?N SOBERANA CONTENIDA. El conocimiento ha sido integrado al cerebro.`);
        } else {
            console.log(`\n? SUE?O APROBADO Y CERTIFICADO PARA EL DISE?O LFC2.`);
        }

        console.log(`\n--------------------------------------------------`);
        console.log(`?? FIN DEL SUE?O - GOBERNANZA ACTIVA`);

    } catch (error) {
        console.error("? Error en el pilot:", error.message);
    }
}

runSwarmPilot();
