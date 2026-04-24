#!/usr/bin/env node

/**
 * SICC SWARM PILOT v14.0 - MODO AUDITORÍA (AUDITOR)
 * Simulador del comando /audit de Telegram.
 */

const fs = require('fs');
const path = require('path');
const { llamarMultiplexadorFree, llamarGroqJSON, extraerFichaTecnica, getMultiplexedContext, llamarOpenRouterJSON } = require('./sicc-multiplexer');
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
    const contenido = `# ⚖️ DICTAMEN TÉCNICO VINCULANTE (SICC v14.0)\n\n**Documento:** ${idDT} (Validación Forense)\n**Área:** ${area}\n**Fecha:** ${fecha}\n**Validado por:** Dirección Técnica y Jurídica SICC - LFC\n**Razón Juez:** ${razonJuez}\n\n---\n\n${textoDT}`;
    fs.writeFileSync(path.join(dictamenesDir, filename), contenido, 'utf8');
    console.log(`\n📄 DT guardada en disco: brain/dictamenes/${filename}`);
}

function ensureDirs() {
    const dirs = [
        path.join(__dirname, '..', 'brain', 'DREAMS'),
        path.join(__dirname, '..', 'brain', 'history'),
        path.join(__dirname, '..', 'brain', 'dictamenes'),
        path.join(__dirname, '..', 'brain', 'PENDING_DTS'),
    ];
    dirs.forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });
}

function registrarAuditoria(area, textoDT, veredicto, razon, ciclos) {
    const historyDir = path.join(__dirname, '..', 'brain', 'history');
    const fecha = new Date().toISOString();
    const slug = fecha.replace(/[:.]/g, '-');
    const estado = veredicto ? 'CERTIFICADA' : 'RECHAZADA';
    const filename = `AUDIT-${area.toUpperCase().replace(/\s+/g, '_')}-${slug}.md`;
    const contenido = [
        `# ⚖️ AUDITORÍA ${estado} — ${area.toUpperCase()}`,
        `**Fecha:** ${fecha} | **Ciclos:** ${ciclos}/3 | **Estado:** ${estado}`,
        `**Veredicto Juez:** ${razon}`,
        ``,
        `---`,
        ``,
        textoDT,
    ].join('\n');
    fs.writeFileSync(path.join(historyDir, filename), contenido, 'utf8');
    console.log(`\n📓 Auditoría registrada en history/${filename}`);
}

function guardarPendingDT(area, textoDT, ultimaLeccion) {
    const pendingDir = path.join(__dirname, '..', 'brain', 'PENDING_DTS');
    const fecha = new Date().toISOString();
    const slug = fecha.slice(0, 10);
    const areaSlug = area.toUpperCase().replace(/\s+/g, '_').substring(0, 20);
    const filename = `PENDING-${areaSlug}-${slug}.md`;
    const contenido = [
        `# 🔶 BORRADOR PENDIENTE — ${area.toUpperCase()} (Impureza Persistente)`,
        `**Fecha:** ${fecha}`,
        `**Estado:** RECHAZADO tras 3 ciclos — pendiente revisión humana`,
        `**Última lección de auditoría:** ${ultimaLeccion}`,
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
        const leccionText = `\n> [!WARNING] **AUDIT_LESSON (SICC v14.0 - ${timestamp}):**\n> ${leccion}\n`;
        fs.appendFileSync(filePath, leccionText, 'utf8');
        console.log(`\n⚖️ [SICC AUDIT] Aprendizaje registrado mecánicamente en ${specialty}.md`);
    } else {
        console.error(`\n❌ [SICC AUDIT] Especialidad no encontrada: ${filePath}`);
    }
}

async function runSwarmPilot() {
    ensureDirs();
    console.log(`--------------------------------------------------`);
    console.log(`📡 [SICC] Inicializando Brain y Soberanía Técnica...`);
    
    // --- CONTROL DE RECURSOS ---
    const resourceCheck = checkYEncolar(`Auditoría sobre ${arg}`, 'auditor');
    if (!resourceCheck.ok) {
        console.error(`\n[GOVERNOR] 🚦 RECURSOS INSUFICIENTES (CPU: ${Math.round(resourceCheck.load * 100)}%)`);
        console.error(`[GOVERNOR] La auditoría ha sido ENCOLADA en AUDIT_QUEUE.md para ejecución diferida.`);
        process.exit(0);
    }

    inicializarBrain();
    
    console.log(`⚖️ SICC AUDITOR FORENSE - MODO AUDITORÍA (/audit ${arg})`);
    console.log(`--------------------------------------------------\n`);

    const identitySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'IDENTITY.md'), 'utf8');
    const methodologySicc = fs.readFileSync(path.join(__dirname, '..', 'brain', 'SICC_METHODOLOGY.md'), 'utf8');
    let specialtyContext = getMultiplexedContext(arg);

    // --- FASE 0 & 0.5: CAPA DE HIDRATACIÓN PROACTIVA (ORACLE FETCHER) ---
    const fichaTecnicaPath = path.join(__dirname, '..', 'brain', 'DREAMS', `FICHA-${arg.toUpperCase().replace(/\s+/g, '_')}.md`);
    let fichaTecnica = "";
    if (fs.existsSync(fichaTecnicaPath)) {
        console.log(`[ORACLE FETCHER] ♻️ Ficha Técnica existente encontrada (Modo Caché).`);
        fichaTecnica = fs.readFileSync(fichaTecnicaPath, 'utf8');
    } else {
        console.log(`[ORACLE FETCHER] 🔍 Fase 0: Extrayendo contexto crudo del SSoT (Supabase) para ${arg}...`);
        const chunksCrudos = await validarInternaSupabase(arg); 
        console.log(`[ORACLE FETCHER] ⚗️ Fase 0.5: Destilando Ficha de Mandatos Innegociables...`);
        fichaTecnica = await extraerFichaTecnica(arg, chunksCrudos);
        fs.writeFileSync(fichaTecnicaPath, fichaTecnica, 'utf8');
        console.log(`[ORACLE FETCHER] ✅ Ficha Técnica generada y guardada en ${fichaTecnicaPath}`);
    }

    // Inyectamos la Ficha Técnica directamente al inicio del contexto de la especialidad
    specialtyContext = `### 📋 FICHA TÉCNICA OBLIGATORIA (EXTRACTO DEL SSoT)\n${fichaTecnica}\n\n${specialtyContext}`;

    const stateFile = path.join(__dirname, '..', 'brain', `STATE-${arg.replace(/\s+/g, '_')}.json`);
    let state = { ciclosTotalesHistoricos: 0, ultimaLeccion: "", status: 'PENDING', ultimoBorrador: "" };
    if (fs.existsSync(stateFile)) {
        try { state = JSON.parse(fs.readFileSync(stateFile, 'utf8')); } catch(e){}
    }

    const isOverride = process.argv.includes('--override');
    if (isOverride) {
        console.log('\n⚠️ OVERRIDE HUMANO activado. Veto del Director Técnico.');
        const leccionVeto = {
            causa: "Veto Manual del Director Técnico",
            justificacion: "Excepción aprobada por la Dirección Técnica",
            ajusteCriterio: "En el futuro, se debe considerar válida esta formulación bajo autoridad de la Dirección."
        };
        fs.appendFileSync(path.join(__dirname, '..', 'brain', 'LEARNING_CURVE.log'), JSON.stringify(leccionVeto) + '\n');
        state.ultimaLeccion = leccionVeto.ajusteCriterio;
        state.status = 'APPROVED_BY_DIRECTOR';
        state.timestamp = new Date().toISOString();
        fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
        
        // Registrar lección inversa en la especialidad si es posible
        const validSpecialty = ["COMMUNICATIONS", "SIGNALIZATION", "POWER", "INTEGRATION", "ENCE", "CONTROL_CENTER"].find(s => s.toLowerCase().includes(arg.toLowerCase().substring(0,4))) || "INTEGRATION";
        registrarLeccionAuditoria(validSpecialty, `EXCEPCIÓN APROBADA (OVERRIDE): ${leccionVeto.ajusteCriterio}`);
        
        console.log('✅ Estado actualizado a APPROVED_BY_DIRECTOR y lección inversa guardada.');
        return;
    }

    let ciclosRealizados = 0;
    const MAX_CICLOS = 3;
    let aprobado = state.status.includes('APPROVED');
    let ultimaLeccion = state.ultimaLeccion || "";
    let ultimoBorrador = state.ultimoBorrador || "";

    while (ciclosRealizados < MAX_CICLOS && !aprobado) {
        ciclosRealizados++;
        console.log(`\n🔄 [CICLO DE AUDITORÍA ${ciclosRealizados}/${MAX_CICLOS}]`);
        
        console.log(`🧬 [Fase 1] Consultando Memoria Histórica (Auto-tuning)...`);
        const lecciones = await buscarLecciones(arg, 3);
        let contextoGenetico = "";
        if (lecciones.length > 0) {
            console.log(`✅ [SICC OK] Inyectando ${lecciones.length} vacunas preventivas.`);
            contextoGenetico = `### LECCIONES APRENDIDAS (HISTORIAL):\\n` + 
                lecciones.map(l => `- ${l.content}`).join('\n') + '\n\n';
        }

        const dtFormatTemplate = `
FORMATO OBLIGATORIO DE LA DT (debes seguir esta estructura exacta):

## CITACIÓN CANONíCA
Contrato APP 001/2025, [Sección X.Y.Z]: "[texto literal o parafraseado del contrato]"

## ANÁLISIS TÉCNICO
[Análisis sustantivo de la decisión, con referencia a la normativa aplicable (AREMA, FRA, ETSI, NSR-10, etc.)]

## DECISIÓN VINCULANTE
[Mandato claro, concreto e irreversible]

## JUSTIFICACIÓN
[Por qué esta decisión es la única alineada con el Contrato APP 001/2025]
`;
        const promptFase1 = ciclosRealizados === 1 
            ? `### TAREA DE INVESTIGACIÓN (DECANTACIÓN INICIAL)\n${contextoGenetico}Genera una Decisión Técnica (DT) vinculante sobre el área de ${arg} para el Proyecto SICC. Usa OBLIGATORIAMENTE el formato siguiente:\n${dtFormatTemplate}`
            : `### REFINAMIENTO POR FALLO PREVIO (PURA DE GRASA)\n${contextoGenetico}Tu propuesta anterior fue RECHAZADA. Genera una nueva DT corregida, respetando OBLIGATORIAMENTE el formato:\n${dtFormatTemplate}\nELIMINA: 'Infraestructura Zero', 'Soberanía', referencias a normativas internas. SOLO Contrato APP 001/2025 y normativa técnica externa.`;

        const agent1 = {
            name: "DIRECCIÓN TÉCNICA SICC",
            prompt: `### CONTEXTO CONTRACTUAL Y NORMATIVO DEL PROYECTO (ESPECIALIDAD: ${arg.toUpperCase()})
${specialtyContext.substring(0, 8000)}

### IDENTIDAD Y METODOLOGÍA
${identitySicc}

${methodologySicc}

🛡️ PROHIBICIONES ABSOLUTAS (MURO CONTRACTUAL):
1. PROHIBIDO citar herramientas de IA: "Supabase", "RAG", "NotebookLM", "Doble Ciego", "Algoritmo", "Script".
2. PROHIBIDO personificar: "Diego", "Soberano", "Karpathy", "Peones", "Alma", "Enjambre".
3. PROHIBIDO alucinar flotas: Solo existen locomotoras **GR12 y U10** (Nación) y **U18** (Calidad). El "Tren LFC2" es una alucinación.
4. PROHIBIDO inventar cláusulas: La "Cláusula N-1" o "Deducción Radical" NO existen. Solo el Orden de Prelación 1.2(d).
5. PROHIBIDO alucinar seguros: El Artículo 12.1 NO existe para seguros. Usar Art. 9: 11.300 SMMLV (RCE) y 3.900 SMMLV (Patronal).
6. PROHIBIDO confundir conceptos: "Pasos a Nivel (PaN)" son cruces físicos, NO cantidades administrativas.
7. PROHIBICIÓN DE AUTOCONTAMINACIÓN (CRÍTICO): PROHIBIDO escribir en tu respuesta: "R-HARD-06", "MURO DE FUEGO CONTRACTUAL", "MANDATO SUPERIOR SICC", "SSoT", "Protocolo de Soberanía", "Normativa Interna de Proyecto".

### TAREA:
${promptFase1}

REGLA DE ORO: Tu lenguaje debe ser estrictamente institucional, legalista y técnico.`
        };

        try {
            console.log(`⚖️ Activando agentes forenses (Fase 1: Decantación Técnica)...`);
            let responseObj = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
            let borrador_DT = typeof responseObj === 'string' ? responseObj : (responseObj.texto || responseObj.content || JSON.stringify(responseObj));
            ultimoBorrador = borrador_DT;
            
            if (borrador_DT.includes("I need more information") || borrador_DT.includes("Could you please provide")) {
                console.error(`🚨 [ALUCINACIÓN DETECTADA] Abortando ciclo por intento de meta-habla.`);
                ultimaLeccion = "El agente intentó pedir información en lugar de dictaminar autónomamente.";
                continue;
            }

            console.log(`⚖️ BORRADOR GENERADO (Resumen): ${borrador_DT.substring(0,200)}...`);
            
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
1. RECHAZAR si menciona: "Diego", "Soberano", "Karpathy", "RAG", "Supabase", "NotebookLM", "IA", "Algoritmo", "Tren LFC2", "Cláusula N-1", "Protocolo de Soberanía", "Enjambre", "Peones", "Alma".
2. RECHAZAR si menciona fibra óptica asociada a material rodante o trenes (la fibra es exclusivamente BACKBONE SOTERRADO).
3. RECHAZAR si menciona el "Artículo 12.1" para seguros o cláusulas inexistentes como "Capítulo 3 → Sección 2 → Literal 1".
4. RECHAZAR si menciona componentes mecánicos de trenes (acoples, 1.200 unidades, etc.) en dictámenes de señalización o Pasos a Nivel.
5. RECHAZAR si el dictamen es "vacío" o "puramente motivacional". UN DICTAMEN VÁLIDO DEBE TENER:
   - Sección **CITACIÓN CANÓNICA** (con numerales reales del Contrato APP 001/2025).
   - Sección **ANÁLISIS** técnico o jurídico sustantivo.
   - Sección **DECISIÓN** vinculante clara.
6. RECHAZAR si sugiere "omitir" o "desviar" el cumplimiento de **SIL-4** en hardware de control de trenes. El SIL-4 es innegociable bajo norma FRA 236.
7. RECHAZAR si el texto está en portugués, caracteres asiáticos o cualquier idioma distinto al ESPAÑOL (excepto siglas técnicas como SIL, PTC, TETRA).
8. RECHAZAR si cita reglas internas (R-HARD-01, $726M) como si fueran "Cláusulas Literales del Contrato". Deben citarse como "Normativa Interna de Proyecto".
9. RECHAZAR si confunde Pasos a Nivel (PaN) con "pasos de cantidades" o "acoples mecánicos".
10. RECHAZAR si los Pasos a Nivel no coinciden con las cantidades cerradas: 9 Tipo C, 15 Tipo B, 122 Tipo A.
11. RECHAZAR si asigna presupuestos irrisorios para Señalización (ej. $150M). El software CTC/PTC (Partida 1.1.103) cuesta más de **$88.000 Millones COP**.
12. RECHAZAR si menciona "Infraestructura Zero". El término correcto es **Arquitectura Virtual V-Rail**.
13. RECHAZAR (solo en dictámenes de SEÑALIZACIÓN o ENCE) si no cita los 5 ENCE obligatorios (Zapatosa, García Cadena, Barrancabermeja, Pto. Berrío, La Dorada) de la **Tabla 17 del AT1**.
14. RECHAZAR si cita el "WBS v2.9" (el único válido es WBS v3.0).
15. RECHAZAR si el dictamen usa excusas de "falta de claridad" (Sección 3.9(a)(v)).
16. RECHAZAR (solo en dictámenes de SEÑALIZACIÓN o ENCE) si no cita la flota real: GR12, U10 o U18.

### TEXTO A EVALUAR:
${borrador_DT}

### FORMATO DE SALIDA (JSON ESTRICTO):
{
  "aprobado": boolean,
  "razon": "Justificación legalista citando el Contrato APP 001/2025 (Secciones 1.2(d), 3.9, 9.11, 18.7, etc.)",
  "categoria_fallida": "SIGNALIZATION | POWER | COMMUNICATIONS | INTEGRATION | LEGAL | CONTRACTUAL",
  "mandato_correctivo": "Mandato técnico para purgar el error en el siguiente ciclo"
}
`;

            let decisionRAW;
            try {
                // Groq con json_object forzado — evita respuestas en lenguaje natural
                decisionRAW = await llamarGroqJSON("Evalúa el dictamen y responde SOLO con el JSON solicitado.", promptJuez);
                console.log(`[JUEZ] 🟠 Groq JSON OK.`);
            } catch (juezErr) {
                // Parche para evitar quemar ciclos por errores de red/cuota
                if (juezErr.message.includes('429')) {
                    try {
                        console.warn(`[JUEZ] ⚠️ Cuota Groq agotada (429). Intentando rescate de emergencia con OpenRouter (Auto Free)...`);
                        // Intentamos usar uno de los modelos gratuitos listados por ti que es de alta calidad
                        decisionRAW = await llamarOpenRouterJSON("Evalúa el dictamen y responde SOLO con el JSON solicitado.", promptJuez, "openrouter/free");
                        console.log(`[JUEZ] 🟣 OpenRouter JSON OK.`);
                    } catch (rescueErr) {
                        console.error(`\n[SICC CRITICAL] Rescate falló (${rescueErr.message}). Cuota agotada. Abortando Swarm para preservar ciclos de auditoría.`);
                        process.exit(1); // Salida con error para que el Governor sepa que debe reintentar luego
                    }
                } else {
                    console.warn(`[JUEZ] ⚠️ Groq JSON falló (${juezErr.message}), fallback a multiplexer...`);
                    const responseJuez = await llamarMultiplexadorFree("Evalúa el dictamen y responde SOLO con el JSON solicitado.", "", promptJuez);
                    decisionRAW = typeof responseJuez === 'string' ? responseJuez : (responseJuez.texto || responseJuez.content || JSON.stringify(responseJuez));
                }
            }
            
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
                        leccion_auditoria: extraerCampoJuez(jsonMatch, 'mandato_correctivo') || extraerCampoJuez(jsonMatch, 'leccion_auditoria') || 'Respuesta JSON malformada del Juez.',
                    };
                    console.warn(`⚠️ [JUEZ] JSON malformado — campos extraídos individualmente.`);
                }
            } else {
                // Sin llaves: el modelo respondió en lenguaje natural — inferir por palabras clave
                const textoUpper = decisionRAW.toUpperCase();
                const aprobadoInferido = textoUpper.includes('APROBADO') && 
                                         !textoUpper.includes('NO APROBADO') && 
                                         !textoUpper.includes('RECHAZO') && 
                                         !textoUpper.includes('RECHAZADO') && 
                                         !textoUpper.includes('RECHAZAR') && 
                                         !textoUpper.includes('BLOCKER') && 
                                         !textoUpper.includes('IMPUREZA');
                decision = {
                    aprobado: aprobadoInferido,
                    razon: decisionRAW.substring(0, 300),
                    categoria_fallida: 'Ninguna',
                    leccion_auditoria: 'El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.',
                };
                console.warn(`⚠️ [JUEZ] Sin JSON — respuesta inferida por palabras clave. Aprobado: ${aprobadoInferido}`);
            }
            console.log(`⚖️ VEREDICTO: ${decision.aprobado ? '✅ APROBADO' : '❌ RECHAZADO'}`);
            console.log(`   Razón: ${decision.razon || 'No especificada'}`);

            // Vectorizar veredicto siempre — aprobado y rechazado
            await guardarVeredictoJuez(arg, decision);

            if (decision.aprobado) {
                aprobado = true;
                console.log(`\n✅ AUDITORÍA CERTIFICADA TRAS ${ciclosRealizados} CICLOS.`);
                console.log(`\n--- DT FINAL ---\n${borrador_DT}\n----------------`);
                const { id: idDT, filename } = generarNombreDT(arg, borrador_DT);
                guardarDTEnDisco(arg, borrador_DT, decision.razon || '', idDT, filename);
                registrarAuditoria(arg, borrador_DT, true, decision.razon || '', ciclosRealizados);
                const idSupabase = await guardarDTCertificada(arg, borrador_DT, decision.razon || '');
                if (idSupabase) console.log(`\n📦 DT vectorizada en Supabase: ${idSupabase}`);
            } else {
                ultimaLeccion = decision.mandato_correctivo || decision.leccion_auditoria || decision.razon || "Alucinación de proceso detectada.";
                const VALID_SPECIALTIES = ['COMMUNICATIONS', 'SIGNALIZATION', 'POWER', 'INTEGRATION', 'ENCE', 'CONTROL_CENTER', 'CONTRACTUAL_NORMATIVE'];
                const SPECIALTY_MAP = {
                    'comunicaci': 'COMMUNICATIONS', 'telecom': 'COMMUNICATIONS', 'señaliz': 'SIGNALIZATION',
                    'señal': 'SIGNALIZATION', 'power': 'POWER', 'potencia': 'POWER', 'integr': 'INTEGRATION',
                    'ence': 'ENCE', 'control': 'CONTROL_CENTER', 'centro': 'CONTROL_CENTER', 'norma': 'CONTRACTUAL_NORMATIVE',
                    'contrato': 'CONTRACTUAL_NORMATIVE', 'jerar': 'CONTRACTUAL_NORMATIVE'
                };
                const rawCat = (decision.categoria_fallida || '').trim().toUpperCase();
                let targetSp = VALID_SPECIALTIES.includes(rawCat) ? rawCat : null;
                if (!targetSp) {
                    const lower = (decision.categoria_fallida || '').toLowerCase();
                    targetSp = Object.entries(SPECIALTY_MAP).find(([k]) => lower.includes(k))?.[1] || 'COMMUNICATIONS';
                }
                
                await registrarLeccionAuditoria(targetSp, ultimaLeccion);
                console.log(`🛡️ ALUCINACIÓN DETECTADA. Re-inyectando lección y reiniciando auditoría...`);
                await sleep(3000);
            }

        } catch (error) {
            console.error("⚠️ Error en ciclo:", error.message);
            ultimaLeccion = error.message;
        }
    }

    if (!aprobado) {
        console.log(`\n🛑 [SICC BLOCKER] Los agentes no lograron decantar una DT pura tras ${MAX_CICLOS} ciclos.`);
        console.log(`Gobernanza activa: El tema ha sido bloqueado por impureza persistente.`);
        if (ultimoBorrador) {
            registrarAuditoria(arg, ultimoBorrador, false, ultimaLeccion, ciclosRealizados);
            guardarPendingDT(arg, ultimoBorrador, ultimaLeccion);
        }
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`⚖️ VEREDICTO FINAL:`);
    console.log(aprobado ? `✅ AUDITORÍA CERTIFICADA` : `❌ AUDITORÍA RECHAZADA\nBloqueada por impureza persistente. Última lección: ${ultimaLeccion}`);
    console.log(`--------------------------------------------------`);

    // Serializar el estado final para persistencia entre ejecuciones de Docker
    state.ciclosTotalesHistoricos += ciclosRealizados;
    state.ultimaLeccion = ultimaLeccion;
    state.ultimoBorrador = ultimoBorrador;
    state.status = aprobado ? 'APPROVED' : 'REJECTED';
    state.timestamp = new Date().toISOString();
    fs.writeFileSync(stateFile, JSON.stringify(state, null, 2), 'utf8');
}

runSwarmPilot();
