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

    // --- INYECCIÓN DE ADN SICC (v12.4) ---
    const identitySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'IDENTITY.md'), 'utf8');
    const methodologySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'SICC_METHODOLOGY.md'), 'utf8');

    const agent1 = {
        name: "AUDITOR FORENSE SOBERANO",
        prompt: `### MANDATO SUPERIOR SICC
${identitySicc}

### METODOLOGÍA DE PRODUCCIÓN
${methodologySicc}

### TAREA DE INVESTIGACIÓN (DECANTACIÓN CICLO 1)
Genera una Decisión Técnica (DT) radical sobre el área de ${arg} para el tren LFC2. 
REGLA DE ORO: No saludes, no analices la tarea, no pidas información. EJECUTA EL DICTAMEN TÉCNICO CITANDO EL CONTRATO.`
    };

    try {
        console.log(`🐝 Disparando enjambre (Fase 1: Sueño Soberano sobre ${arg})...`);
        let borrador_DT = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
        borrador_DT = typeof borrador_DT === 'string' ? borrador_DT : (borrador_DT.content || JSON.stringify(borrador_DT));
        
        // --- FILTRO ANTI-META-HABLA (Emergencia) ---
        if (borrador_DT.includes("I need more information") || borrador_DT.includes("Could you please provide")) {
            console.error(`\n🚨 [ALUCINACIÓN DETECTADA] El agente intentó pedir información. Abortando y re-inyectando ADN...`);
            borrador_DT = "ERROR: El agente falló al procesar por alucinación de incompetencia. Se requiere reinicio de vigilia.";
        }

        console.log(`\n💤 SUEÑO GENERADO:\n${borrador_DT.substring(0,800)}...\n`);
        
        await sleep(2000); 

        console.log(`🛡️ [Fase 2] INICIANDO CÁMARA DE VALIDACIÓN (Doble Ciego)...`);
        console.log(`   🔸 Interrogando SAPI Interna (Supabase / Contratos LFC2)...`);
        const validInterna = await validarInternaSupabase(borrador_DT);

        await sleep(2000); 

        console.log(`   🔸 Interrogando SAPI Externa (NotebookLM MCP)...`);
        const validExterna = await validarExternaNotebook(borrador_DT);

        await sleep(2000); 

        console.log(`\n⚖️ [Fase 3] DESPERTAR Y JUZGAR (Firma Forense)...`);

        const promptJuez = `Eres el JUEZ SOBERANO SICC v12.4. 
Evalúa estrictamente este sueño del enjambre. 

### CRITERIOS DE RECHAZO AUTOMÁTICO:
1. Si el sueño contiene preguntas al usuario o frases como "I need more information".
2. Si el sueño es meta-analítico (habla sobre la tarea en lugar de hacerla).
3. Si propone tecnología propietaria (V-Block, Alstom Cloud, etc.) o viola la soberanía.

SUEÑO DEL ENJAMBRE:
${borrador_DT}

RESTRICCIONES INTERNAS (Supabase):
${validInterna}

PERSPECTIVA EXTERNA (NotebookLM):
${validExterna}

Responde ÚNICAMENTE en JSON:
{
  "aprobado": boolean,
  "razon": "Justificación técnica/contractual",
  "categoria_fallida": "COMMUNICATIONS | SIGNALIZATION | POWER | INTEGRATION | ENCE | Ninguna",
  "leccion_karpathy": "Lección estricta para el Brain si falló."
}`;

        let decisionRAW = await llamarMultiplexadorFree("Despierta al enjambre y eval?a el sue?o.", "", promptJuez);
        decisionRAW = typeof decisionRAW === 'string' ? decisionRAW : (decisionRAW.content || JSON.stringify(decisionRAW));
        
        const jsonMatch = decisionRAW.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Juez fall? al emitir JSON v?lido");
        
        const decision = JSON.parse(jsonMatch[0]);
        console.log(`\n⚖️ VEREDICTO FINAL AL DESPERTAR:`);
        console.log(`   Aprobado: ${decision.aprobado ? '[OK] SÍ' : '[BLOCK] NO'}`);
        console.log(`   Razón: ${decision.razon || 'No especificada'}`);

        if (decision.aprobado) {
            console.log(`\n✅ SUEÑO APROBADO Y CERTIFICADO PARA EL DISEÑO LFC2.`);
        } else {
            console.log(`\n❌ [Fase 4] PESADILLA DETECTADA -> BUCLE DE APRENDIZAJE KARPATHY`);
            const targetSp = (decision.categoria_fallida && decision.categoria_fallida !== "Ninguna") 
                ? decision.categoria_fallida 
                : (arg.toUpperCase().includes('SEÑAL') ? 'SIGNALIZATION' : 'SIGNALIZATION');
            
            const leccion = decision.leccion_karpathy || decision.razon || "Alucinación de proceso detectada.";
            await updateKarpathySpecialty(targetSp, leccion);
            console.log(`🛡️ ALUCINACIÓN SOBERANA CONTENIDA. El conocimiento ha sido integrado al cerebro en ${targetSp}.md`);
        }

        console.log(`\n--------------------------------------------------`);
        console.log(`?? FIN DEL SUE?O - GOBERNANZA ACTIVA`);

    } catch (error) {
        console.error("? Error en el pilot:", error.message);
    }
}

runSwarmPilot();
