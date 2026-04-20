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
const { buscarLecciones, guardarDTCertificada, guardarVeredictoJuez } = require('../src/supabase');
const { checkYEncolar, getCpuLoad } = require('./resource-governor');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AREA_PREFIX = {
    'señaliz': 'CTSC', 'señal': 'CTSC', 'comunicaci': 'COMS', 'telecom': 'COMS',
    'power': 'ENRG', 'potencia': 'ENRG', 'energi': 'ENRG',
    'integr': 'INTG', 'control': 'CTRL', 'ence': 'ENCE',
};

function generarNombreDT(area, textoDT) {
    const dictamenesDir = path.join(__dirname, '..', 'brain', 'dictamenes');
    // Próximo número secuencial global
    let maxNum = 0;
    try {
        fs.readdirSync(dictamenesDir).forEach(f => {
            const m = f.match(/DT-\w+-\d+-(\d+)/);
            if (m) maxNum = Math.max(maxNum, parseInt(m[1]));
        });
    } catch (_) {}
    const seq = String(maxNum + 1).padStart(3, '0');

    const areaLower = area.toLowerCase();
    const prefix = Object.entries(AREA_PREFIX).find(([k]) => areaLower.includes(k))?.[1] || 'SICC';
    const year = new Date().getFullYear();

    // Descripción desde el primer encabezado H2/H3 o primeras palabras del DT
    const headingMatch = textoDT.match(/##?\s+(.+)/);
    const descripcion = (headingMatch ? headingMatch[1] : textoDT.substring(0, 50))
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
        .trim().split(/\s+/).slice(0, 4).join('_')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // quitar tildes para el filename

    return { id: `DT-${prefix}-${year}-${seq}`, filename: `DT-${prefix}-${year}-${seq}_${descripcion}_APROBADO.md` };
}

function guardarDTEnDisco(area, textoDT, razonJuez, idDT, filename) {
    const dictamenesDir = path.join(__dirname, '..', 'brain', 'dictamenes');
    const fecha = new Date().toISOString();
    const contenido = `# ⚖️ DICTAMEN TÉCNICO VINCULANTE (SICC v12.9)\n\n**Documento:** ${idDT} (Pureza N-1)\n**Área:** ${area}\n**Fecha:** ${fecha}\n**Validado por:** Dirección Técnica y Jurídica SICC - LFC\n**Razón Juez:** ${razonJuez}\n\n---\n\n${textoDT}`;
    fs.writeFileSync(path.join(dictamenesDir, filename), contenido, 'utf8');
    console.log(`\n📄 DT guardada en disco: brain/dictamenes/${filename}`);
}

function registrarEnDreams(area, textoDT, veredicto, razon, ciclos) {
    const dreamsDir = path.join(__dirname, '..', 'brain', 'DREAMS');
    const fecha = new Date().toISOString();
    const slug = fecha.replace(/[:.]/g, '-');
    const estado = veredicto ? 'CERTIFICADO' : 'RECHAZADO';
    const filename = `DREAM-${area.toUpperCase().replace(/\s+/g, '_')}-${slug}.md`;
    const contenido = [
        `# 💤 SUEÑO ${estado} — ${area.toUpperCase()}`,
        `**Fecha:** ${fecha} | **Ciclos:** ${ciclos}/3 | **Estado:** ${estado}`,
        `**Veredicto Juez:** ${razon}`,
        ``,
        `---`,
        ``,
        textoDT,
    ].join('\n');
    fs.writeFileSync(path.join(dreamsDir, filename), contenido, 'utf8');
    console.log(`\n📓 Sueño registrado en DREAMS/${filename}`);
}

function guardarPendingDT(area, textoDT, ultimaLeccion) {
    const pendingDir = path.join(__dirname, '..', 'brain', 'PENDING_DTS');
    const fecha = new Date().toISOString();
    const slug = fecha.slice(0, 10);
    const areaSlug = area.toUpperCase().replace(/\s+/g, '_').substring(0, 20);
    const filename = `PENDING-${areaSlug}-${slug}.md`;
    const contenido = [
        `# 🔶 PENDING DT — ${area.toUpperCase()} (Impureza Persistente)`,
        `**Fecha:** ${fecha}`,
        `**Estado:** RECHAZADO tras 3 ciclos — pendiente revisión humana`,
        `**Última lección Karpathy:** ${ultimaLeccion}`,
        ``,
        `---`,
        ``,
        `> ⚠️ Este borrador no superó la Verificación Contractual en 3 ciclos.`,
        `> Requiere revisión manual antes de promover a dictamenes/.`,
        ``,
        textoDT,
    ].join('\n');
    fs.writeFileSync(path.join(pendingDir, filename), contenido, 'utf8');
    console.log(`\n🔶 Borrador impuro guardado en PENDING_DTS/${filename}`);
}

const arg = process.argv[2] || "Señalización";

async function registrarLeccionAuditoria(specialty, leccion) {
    const filePath = path.join(__dirname, '..', 'brain', 'SPECIALTIES', `${specialty}.md`);
    if (fs.existsSync(filePath)) {
        const timestamp = new Date().toISOString();
        const leccionText = `\n> [!WARNING] **AUDIT_LESSON (SICC v12.8 - ${timestamp}):**\n> ${leccion}\n`;
        fs.appendFileSync(filePath, leccionText, 'utf8');
        console.log(`\n⚖️ [SICC AUDIT] Aprendizaje registrado mecánicamente en ${specialty}.md`);
    } else {
        console.error(`\n❌ [SICC AUDIT] Especialidad no encontrada: ${filePath}`);
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
    let ultimoBorrador = "";

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
            ? `### TAREA DE INVESTIGACIÓN (DECANTACIÓN INICIAL)\n${contextoGenetico}Genera una Decisión Técnica (DT) soberana sobre el área de ${arg} para el Proyecto SICC...`
            : `### REFINAMIENTO POR FALLO PREVIO (PURA DE GRASA)\n${contextoGenetico}Tu propuesta anterior fue RECHAZADA por el Juez por contener alucinaciones o violar la R-HARD-06...`;

        const agent1 = {
            name: "DIRECCIÓN TÉCNICA SICC",
            prompt: `### MANDATO SUPERIOR SICC (SSoT)
${identitySicc}

### METODOLOGÍA DE AUDITORÍA
${methodologySicc}

🛡️ MURO DE FUEGO CONTRACTUAL (R-HARD-06) - PROHIBICIONES ABSOLUTAS:
1. PROHIBIDO citar herramientas de IA: "Supabase", "RAG", "Oráculo", "NotebookLM", "Doble Ciego", "Algoritmo", "Script".
2. PROHIBIDO personificar: "Diego", "Soberano", "Karpathy", "Peones".
3. PROHIBIDO alucinar flotas: Solo existen locomotoras **GR12 y U10** (Nación) y **U18** (Calidad). El "Tren LFC2" es una alucinación.
4. PROHIBIDO inventar cláusulas: La "Cláusula N-1" o "Deducción Radical" NO existen. Solo el Orden de Prelación 1.2(d).
5. PROHIBIDO alucinar seguros: El Artículo 12.1 NO existe para seguros. Usar Resolución de Surcos (Art. 9): 11.300 SMMLV (RCE) y 3.900 SMMLV (Patronal).
6. PROHIBIDO confundir conceptos: "Pasos a Nivel (PaN)" son cruces físicos, NO cantidades administrativas.

### TAREA:
${promptFase1}

REGLA DE ORO: Tu lenguaje debe ser estrictamente institucional, legalista y técnico. Si el Juez detecta una sola palabra de la lista negra, el ciclo será abortado.`
        };

        try {
            console.log(`🐝 Disparando enjambre (Fase 1: Decantación Técnica)...`);
            let responseObj = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
            let borrador_DT = typeof responseObj === 'string' ? responseObj : (responseObj.texto || responseObj.content || JSON.stringify(responseObj));
            ultimoBorrador = borrador_DT;
            
            if (borrador_DT.includes("I need more information") || borrador_DT.includes("Could you please provide")) {
                console.error(`🚨 [ALUCINACIÓN DETECTADA] Abortando ciclo por intento de meta-habla.`);
                ultimaLeccion = "El agente intentó pedir información en lugar de dictaminar soberanamente.";
                continue;
            }

            console.log(`💤 BORRADOR GENERADO (Resumen): ${borrador_DT.substring(0,200)}...`);
            
            await sleep(2000); 

            console.log(`🛡️ [Fase 2] AUDITORÍA FORENSE (Cámara de Verificación)...`);
            console.log(`   🔸 Verificando consistencia con SSoT...`);
            const validInterna = await validarInternaSupabase(borrador_DT);
            
            console.log(`   🔸 Cruzando con Normativa Externa...`);
            const validExterna = await validarExternaNotebook(borrador_DT);

            console.log(`⚖️ [Fase 3] VEREDICTO DE LA DIRECCIÓN TÉCNICA (R-HARD-06)...`);

            const promptJuez = `Eres la DIRECCIÓN TÉCNICA Y JURÍDICA SICC. 
Tu única misión es RECHAZAR cualquier dictamen que contenga alucinaciones, personificaciones o menciones a herramientas de IA.

### PROTOCOLO DE RECHAZO FULMINANTE:
1. RECHAZAR si menciona: "Diego", "Soberano", "Karpathy", "RAG", "Supabase", "NotebookLM", "IA", "Algoritmo".
2. RECHAZAR si menciona: "Tren LFC2" o "Cláusula N-1".
3. RECHAZAR si confunde "Pasos a Nivel" con "pasos de cantidades".
4. RECHAZAR si cita el "Artículo 12.1" para seguros.

### TEXTO A EVALUAR:
${borrador_DT}

### FORMATO DE SALIDA (JSON ESTRICTO):
{
  "aprobado": boolean,
  "razon": "Justificación legalista citando el Contrato APP 001/2025",
  "categoria_fallida": "SIGNALIZATION | POWER | COMMUNICATIONS | INTEGRATION | LEGAL",
  "leccion_karpathy": "Mandato técnico para purgar el error en el siguiente ciclo"
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

            // Vectorizar veredicto siempre — aprobado y rechazado
            await guardarVeredictoJuez(arg, decision);

            if (decision.aprobado) {
                aprobado = true;
                console.log(`\n✅ SUEÑO CERTIFICADO TRAS ${ciclosRealizados} CICLOS.`);
                console.log(`\n--- DT FINAL ---\n${borrador_DT}\n----------------`);
                const { id: idDT, filename } = generarNombreDT(arg, borrador_DT);
                guardarDTEnDisco(arg, borrador_DT, decision.razon || '', idDT, filename);
                registrarEnDreams(arg, borrador_DT, true, decision.razon || '', ciclosRealizados);
                const idSupabase = await guardarDTCertificada(arg, borrador_DT, decision.razon || '');
                if (idSupabase) console.log(`\n📦 DT vectorizada en Supabase: ${idSupabase}`);
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
                
                await registrarLeccionAuditoria(targetSp, ultimaLeccion);
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
        if (ultimoBorrador) {
            registrarEnDreams(arg, ultimoBorrador, false, ultimaLeccion, ciclosRealizados);
            guardarPendingDT(arg, ultimoBorrador, ultimaLeccion);
        }
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`⚖️ VEREDICTO FINAL AL DESPERTAR:`);
    console.log(aprobado ? `✅ SUEÑO CERTIFICADO` : `❌ SUEÑO RECHAZADO\nBloqueado por impureza persistente. Última lección: ${ultimaLeccion}`);
    console.log(`--------------------------------------------------`);
}

runSwarmPilot();
