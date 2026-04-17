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
const { buscarLecciones } = require('../src/supabase');
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

    let ciclosRealizados = 0;
    const MAX_CICLOS = 3;
    let aprobado = false;
    let ultimaLeccion = "";

    while (ciclosRealizados < MAX_CICLOS && !aprobado) {
        ciclosRealizados++;
        console.log(`\n🔄 [CICLO DE DECANTACIÓN ${ciclosRealizados}/${MAX_CICLOS}]`);
        
        // ── FASE 1: VACUNACIÓN (SICC Immune System) ──────────────────────────
        console.log(`🧬 [Fase 1] Consultando Memoria Genética (Auto-tuning)...`);
        const lecciones = await buscarLecciones(arg, 3);
        let contextoGenetico = "";
        if (lecciones.length > 0) {
            console.log(`✅ [SICC OK] Inyectando ${lecciones.length} vacunas preventivas.`);
            contextoGenetico = `### LECCIONES APRENDIDAS (SISTEMA INMUNE):\n` + 
                lecciones.map(l => `- ${l.content}`).join('\n') + '\n\n';
        }

        const promptFase1 = ciclosRealizados === 1 
            ? `### TAREA DE INVESTIGACIÓN (DECANTACIÓN INICIAL)\n${contextoGenetico}Genera una Decisión Técnica (DT) radical sobre el área de ${arg} para el tren LFC2...`
            : `### REFINAMIENTO POR FALLO PREVIO (PURA DE GRASA)\n${contextoGenetico}Tu propuesta anterior fue RECHAZADA por el Juez...`;

        const agent1 = {
            name: "AUDITOR FORENSE SOBERANO",
            prompt: `### MANDATO SUPERIOR SICC\n${identitySicc}\n\n### METODOLOGÍA DE PRODUCCIÓN\n${methodologySicc}\n\n${promptFase1}`
        };

        try {
            console.log(`🐝 Disparando enjambre (Fase 1: Sueño Soberano)...`);
            let borrador_DT = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
            borrador_DT = typeof borrador_DT === 'string' ? borrador_DT : (borrador_DT.content || JSON.stringify(borrador_DT));
            
            // --- FILTRO ANTI-META-HABLA (Emergencia) ---
            if (borrador_DT.includes("I need more information") || borrador_DT.includes("Could you please provide")) {
                console.error(`🚨 [ALUCINACIÓN DETECTADA] Abortando ciclo por intento de meta-habla.`);
                ultimaLeccion = "El agente intentó pedir información al usuario en lugar de dictaminar soberanamente.";
                continue;
            }

            console.log(`💤 SUEÑO GENERADO (Resumen): ${borrador_DT.substring(0,200)}...`);
            
            await sleep(2000); 

            console.log(`🛡️ [Fase 2] CÁMARA DE VALIDACIÓN (Doble Ciego)...`);
            console.log(`   🔸 Interrogando Supabase RAG...`);
            const validInterna = await validarInternaSupabase(borrador_DT);
            
            console.log(`   🔸 Interrogando NotebookLM MCP...`);
            const validExterna = await validarExternaNotebook(borrador_DT);

            console.log(`⚖️ [Fase 3] DESPERTAR Y JUZGAR (Firma Forense)...`);

            const promptJuez = `Eres el JUEZ SOBERANO SICC v12.4. 
Evalúa estrictamente este sueño del enjambre. 
SUEÑO DEL ENJAMBRE:
${borrador_DT}

RESTRICCIONES INTERNAS (Supabase):
${validInterna}

PERSPECTIVA EXTERNA (NotebookLM):
${validExterna}

TAREA: 
1. Si hay contradicción con los Estándares de Oro, R-HARD o el Oráculo Externo, responde iniciando con "BLOCKER: [Motivo]".
2. IMPORTANTE: Si el Oráculo Externo (NotebookLM) proporciona feedback correctivo, inclúyelo OBLIGATORIAMENTE en la "leccion_karpathy" para que el enjambre se autocorrija en el siguiente ciclo.
3. Si no hay fallos y el Oráculo valida la propuesta, genera la Decisión Técnica Certificada (N-1).

Responde ÚNICAMENTE en JSON:
{
  "aprobado": boolean,
  "razon": "Justificación técnica/contractual",
  "categoria_fallida": "COMMUNICATIONS | SIGNALIZATION | POWER | INTEGRATION | ENCE | Ninguna",
  "leccion_karpathy": "Lección estricta para el Brain si falló (DEBE incluir correcciones del Oráculo si las hubo)."
}`;

            let decisionRAW = await llamarMultiplexadorFree("Despierta al enjambre y evalúa el sueño.", "", promptJuez);
            decisionRAW = typeof decisionRAW === 'string' ? decisionRAW : (decisionRAW.content || JSON.stringify(decisionRAW));
            
            const jsonMatch = decisionRAW.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Juez falló al emitir JSON válido");
            
            const decision = JSON.parse(jsonMatch[0]);
            console.log(`⚖️ VEREDICTO: ${decision.aprobado ? '✅ APROBADO' : '❌ RECHAZADO'}`);
            console.log(`   Razón: ${decision.razon || 'No especificada'}`);

            if (decision.aprobado) {
                aprobado = true;
                console.log(`\n✅ SUEÑO CERTIFICADO TRAS ${ciclosRealizados} CICLOS.`);
                console.log(`\n--- DT FINAL ---\n${borrador_DT}\n----------------`);
            } else {
                ultimaLeccion = decision.leccion_karpathy || decision.razon || "Alucinación de proceso detectada.";
                const targetSp = (decision.categoria_fallida && decision.categoria_fallida !== "Ninguna") 
                    ? decision.categoria_fallida 
                    : (arg.toUpperCase().includes('SEÑAL') ? 'SIGNALIZATION' : 'SIGNALIZATION');
                
                await updateKarpathySpecialty(targetSp, ultimaLeccion);
                console.log(`🛡️ ALUCINACIÓN DETECTADA. Re-inyectando lección y reiniciando decantación...`);
                await sleep(3000);
            }

        } catch (error) {
            console.error("⚠️ Error en ciclo:", error.message);
            ultimaLeccion = error.message;
        }
    } // fin while

    if (!aprobado) {
        console.log(`\n🛑 [SICC BLOCKER] El enjambre no logró decantar una DT pura tras ${MAX_CICLOS} ciclos.`);
        console.log(`Gobernanza activa: El tema ha sido bloqueado por impureza persistente.`);
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`⚖️ VEREDICTO FINAL AL DESPERTAR:`);
    console.log(aprobado ? `✅ SUEÑO CERTIFICADO\n\n${borrador_DT}` : `❌ SUEÑO RECHAZADO\nBloqueado por impureza persistente. Última lección: ${ultimaLeccion}`);
    console.log(`--------------------------------------------------`);
}

runSwarmPilot();
