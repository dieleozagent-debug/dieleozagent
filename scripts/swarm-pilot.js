#!/usr/bin/env node

/**
 * SICC SWARM PILOT v2.2 - MODO SUEÑO (DREAMER)
 * Simulador del comando /dream de Telegram.
 */

const fs = require('fs');
const path = require('path');
const { llamarMultiplexadorFree } = require('./sicc-multiplexer');
const { inicializarBrain } = require('../src/agent');
const { validarExternaNotebook } = require('../src/sapi/notebooklm_mcp');
const { validarInternaSupabase } = require('../src/sapi/supabase_rag');
const { buscarLecciones, guardarDTCertificada } = require('../src/supabase');
const { checkYEncolar, getCpuLoad } = require('./resource-governor');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const arg = process.argv[2] || "Señalización";

async function updateKarpathySpecialty(specialty, leccion) {
    const filePath = path.join(__dirname, '..', 'brain', 'SPECIALTIES', `${specialty}.md`);
    if (fs.existsSync(filePath)) {
        const timestamp = new Date().toISOString();
        const leccionText = `\n> [!WARNING] **Karpathy Dream Lesson (${timestamp}):**\n> ${leccion}\n`;
        fs.appendFileSync(filePath, leccionText, 'utf8');
        console.log(`\n⚖️ [Karpathy Loop] Aprendizaje registrado mecánicamente en ${specialty}.md`);
    } else {
        console.error(`\n❌ [Karpathy Loop] Especialidad no encontrada: ${filePath}`);
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
    
    console.log(`🌪️ SICC SWARM PILOT - 💤 MODO SUEÑO (/dream ${arg})`);
    console.log(`--------------------------------------------------\n`);

    const identitySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'IDENTITY.md'), 'utf8');
    const methodologySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'SICC_METHODOLOGY.md'), 'utf8');

    let ciclosRealizados = 0;
    const MAX_CICLOS = 3;
    let aprobado = false;
    let ultimaLeccion = "";

    while (ciclosRealizados < MAX_CICLOS && !aprobado) {
        ciclosRealizados++;
        console.log(`\n🔄 [CICLO DE DECANTACIÓN ${ciclosRealizados}/${MAX_CICLOS}]`);
        
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
            let responseObj = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
            let borrador_DT = typeof responseObj === 'string' ? responseObj : (responseObj.texto || responseObj.content || JSON.stringify(responseObj));
            
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

            let responseJuez = await llamarMultiplexadorFree("Despierta al enjambre y evalúa el sueño.", "", promptJuez);
            let decisionRAW = typeof responseJuez === 'string' ? responseJuez : (responseJuez.texto || responseJuez.content || JSON.stringify(responseJuez));
            
            // Parsear respuesta del Juez: JSON limpio → code fence → extracción campo a campo
            function extraerCampoJuez(texto, campo) {
                const m = texto.match(new RegExp(`"${campo}"\\s*:\\s*"([^"]*)"`, 'i'))
                         || texto.match(new RegExp(`"${campo}"\\s*:\\s*(true|false)`, 'i'));
                return m ? m[1] : null;
            }

            let decision;
            const fenceMatch = decisionRAW.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
            const jsonMatch = fenceMatch ? fenceMatch[1] : (decisionRAW.match(/\{[\s\S]*\}/) || [null])[0];

            if (jsonMatch) {
                try {
                    decision = JSON.parse(jsonMatch);
                } catch (_) {
                    // JSON malformado — extraer campos individualmente
                    decision = {
                        aprobado: /\"aprobado\"\s*:\s*true/i.test(jsonMatch),
                        razon: extraerCampoJuez(jsonMatch, 'razon') || 'JSON malformado por el modelo',
                        categoria_fallida: extraerCampoJuez(jsonMatch, 'categoria_fallida') || 'Ninguna',
                        leccion_karpathy: extraerCampoJuez(jsonMatch, 'leccion_karpathy') || 'Respuesta JSON malformada del Juez.',
                    };
                    console.warn(`⚠️ [JUEZ] JSON malformado — campos extraídos individualmente.`);
                }
            } else {
                // Sin llaves: el modelo respondió en lenguaje natural — inferir por palabras clave
                const textoUpper = decisionRAW.toUpperCase();
                const aprobadoInferido = textoUpper.includes('APROBADO') && !textoUpper.includes('NO APROBADO') && !textoUpper.includes('RECHAZADO') && !textoUpper.includes('BLOCKER');
                decision = {
                    aprobado: aprobadoInferido,
                    razon: decisionRAW.substring(0, 300),
                    categoria_fallida: 'Ninguna',
                    leccion_karpathy: 'El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.',
                };
                console.warn(`⚠️ [JUEZ] Sin JSON — respuesta inferida por palabras clave. Aprobado: ${aprobadoInferido}`);
            }
            console.log(`⚖️ VEREDICTO: ${decision.aprobado ? '✅ APROBADO' : '❌ RECHAZADO'}`);
            console.log(`   Razón: ${decision.razon || 'No especificada'}`);

            if (decision.aprobado) {
                aprobado = true;
                console.log(`\n✅ SUEÑO CERTIFICADO TRAS ${ciclosRealizados} CICLOS.`);
                console.log(`\n--- DT FINAL ---\n${borrador_DT}\n----------------`);
                const idDT = await guardarDTCertificada(arg, borrador_DT, decision.razon || '');
                if (idDT) console.log(`\n📦 DT vectorizada en Supabase: ${idDT}`);
            } else {
                ultimaLeccion = decision.leccion_karpathy || decision.razon || "Alucinación de proceso detectada.";
                const VALID_SPECIALTIES = ['COMMUNICATIONS', 'SIGNALIZATION', 'POWER', 'INTEGRATION', 'ENCE', 'CONTROL_CENTER'];
                const SPECIALTY_MAP = {
                    'comunicaci': 'COMMUNICATIONS', 'telecom': 'COMMUNICATIONS', 'señaliz': 'SIGNALIZATION',
                    'señal': 'SIGNALIZATION', 'power': 'POWER', 'potencia': 'POWER', 'integr': 'INTEGRATION',
                    'ence': 'ENCE', 'control': 'CONTROL_CENTER', 'centro': 'CONTROL_CENTER',
                };
                const rawCat = (decision.categoria_fallida || '').trim().toUpperCase();
                let targetSp = VALID_SPECIALTIES.includes(rawCat) ? rawCat : null;
                if (!targetSp) {
                    const lower = (decision.categoria_fallida || '').toLowerCase();
                    targetSp = Object.entries(SPECIALTY_MAP).find(([k]) => lower.includes(k))?.[1] || 'COMMUNICATIONS';
                }
                
                await updateKarpathySpecialty(targetSp, ultimaLeccion);
                console.log(`🛡️ ALUCINACIÓN DETECTADA. Re-inyectando lección y reiniciando decantación...`);
                await sleep(3000);
            }

        } catch (error) {
            console.error("⚠️ Error en ciclo:", error.message);
            ultimaLeccion = error.message;
        }
    }

    if (!aprobado) {
        console.log(`\n🛑 [SICC BLOCKER] El enjambre no logró decantar una DT pura tras ${MAX_CICLOS} ciclos.`);
        console.log(`Gobernanza activa: El tema ha sido bloqueado por impureza persistente.`);
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`⚖️ VEREDICTO FINAL AL DESPERTAR:`);
    console.log(aprobado ? `✅ SUEÑO CERTIFICADO` : `❌ SUEÑO RECHAZADO\nBloqueado por impureza persistente. Última lección: ${ultimaLeccion}`);
    console.log(`--------------------------------------------------`);
}

runSwarmPilot();
