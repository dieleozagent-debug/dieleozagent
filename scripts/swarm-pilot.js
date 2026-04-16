#!/usr/bin/env node

/**
 * SICC SWARM PILOT v2.0 - Gobernanza de Enjambre Validado
 * Integraci??n de SAPIs y Bucle Karpathy de Doble Ciego.
 */

const fs = require('fs');
const path = require('path');
const { llamarMultiplexadorFree } = require('../src/agent');
const { validarExternaNotebook } = require('../src/sapi/notebooklm_mcp');
const { validarInternaSupabase } = require('../src/sapi/supabase_rag');

const ROADMAP_PATH = '/home/administrador/docker/agente/roadmap.md';

async function updateKarpathySpecialty(specialty, leccion) {
    const filePath = path.join(__dirname, '..', 'brain', 'SPECIALTIES', `${specialty}.md`);
    if (fs.existsSync(filePath)) {
        const timestamp = new Date().toISOString();
        const leccionText = `\n> [!WARNING] **Karpathy Lesson (${timestamp}):**\n> ${leccion}\n`;
        fs.appendFileSync(filePath, leccionText, 'utf8');
        console.log(`\n???? [Karpathy Loop] Aprendizaje registrado mec??nicamente en ${specialty}.md`);
    } else {
        console.error(`\n??? [Karpathy Loop] Especialidad no encontrada: ${filePath}`);
    }
}

async function runSwarmPilot() {
    console.log(`\n--------------------------------------------------`);
    console.log(`???? SICC SWARM PILOT v2.2 - C??MARA DOBLE CIEGO`);
    console.log(`--------------------------------------------------\n`);

    if (!fs.existsSync(ROADMAP_PATH)) {
        console.error("??? Error: roadmap.md no encontrado.");
        return;
    }

    const content = fs.readFileSync(ROADMAP_PATH, 'utf8');

    const agent1 = {
        name: "AUDITOR FORENSE",
        prompt: `Analiza este Roadmap y busca riesgos de soberan??a, proponiendo una soluci??n radical (Decision T??cnica). CONTENIDO:\n${content}`
    };

    try {
        console.log(`???? Disparando enjambre (Fase 1: Ideaci??n con Gemini)...`);
        let borrador_DT = await llamarMultiplexadorFree(agent1.prompt, "", `Role: ${agent1.name}`);
        borrador_DT = typeof borrador_DT === 'string' ? borrador_DT : (borrador_DT.content || JSON.stringify(borrador_DT));
        
        console.log(`\n???? BORRADOR GENERADO:\n${borrador_DT.substring(0,800)}...\n`);

        console.log(`???? [Fase 2] INICIANDO C??MARA DE VALIDACI??N (SAPIs)...`);
        console.log(`   ??? Llamando SAPI Interna (Supabase / LFC2)...`);
        const validInterna = await validarInternaSupabase(borrador_DT);

        console.log(`   ??? Llamando SAPI Externa (NotebookLM MCP)...`);
        const validExterna = await validarExternaNotebook(borrador_DT);

        console.log(`\n?????? [Fase 3] JUEZ FINAL (Gemini API)...`);

        const promptJuez = `Eres el JUEZ SOBERANO SICC v12.
Eval??a estrictamente si la propuesta del enjambre es segura o es una ALUCINACI??N que nos desv??a.

PROPUESTA:
${borrador_DT}

VERDAD INTERNA (LFC2 Supabase):
${validInterna}

PERSPECTIVA EXTERNA (NotebookLM MCP):
${validExterna}

Responde ??NICAMENTE en JSON con esta estructura exacta:
{
  "aprobado": boolean,
  "razon": "Por qu?? pasa o no",
  "categoria_fallida": "COMMUNICATIONS | SIGNALIZATION | Ninguna",
  "leccion_karpathy": "Si fall??, escribe el aprendizaje que se debe guardar en las alertas del sistema."
}`;

        let decisionRAW = await llamarMultiplexadorFree("Eval??a la propuesta bajo doble ciego.", "", promptJuez);
        decisionRAW = typeof decisionRAW === 'string' ? decisionRAW : (decisionRAW.content || JSON.stringify(decisionRAW));
        
        const jsonMatch = decisionRAW.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Juez fall?? al emitir JSON v??lido");
        
        const decision = JSON.parse(jsonMatch[0]);
        console.log(`\n???? VEREDICTO FINAL:`);
        console.log(`   Aprobado: ${decision.aprobado ? '??? S??' : '??? NO'}`);
        console.log(`   Raz??n: ${decision.razon}`);

        if (!decision.aprobado && decision.leccion_karpathy) {
            console.log(`\n???? [Fase 4] FALLO DETECTADO -> BUCLE DE APRENDIZAJE KARPATHY`);
            const targetSp = decision.categoria_fallida !== "Ninguna" ? decision.categoria_fallida : "COMMUNICATIONS";
            await updateKarpathySpecialty(targetSp, decision.leccion_karpathy);
            console.log(`?????? ALUCINACI??N CONTENIDA Y ASIMILADA. Borrador descartado.`);
        } else {
            console.log(`\n??? DT CERTIFICADO PARA ESCRITURA EN LFC2.`);
        }

        console.log(`\n--------------------------------------------------`);
        console.log(`???? FIN DEL PILOTO - GOBERNANZA ACTIVA`);

    } catch (error) {
        console.error("??? Error en el pilot:", error.message);
    }
}

runSwarmPilot();
