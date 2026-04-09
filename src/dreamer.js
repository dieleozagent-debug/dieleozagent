/**
 * 🌙 SICC DREAMER (v6.5 Michelin Edition)
 * Orquestador de Autonomía Forense e Iteración Karpathy.
 * Ventana Operativa: 8:00 PM - 7:00 AM.
 * 
 * Lógica: Tomar hipótesis -> Iterar 5 veces con Ollama (hallucinate) 
 *       -> Auditar contra Contrato Level 1/2 y NotebookLM pensamientos
 *       -> Decantar en DT Borrador.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { procesarMensaje, PROMPT_FULL } = require('./agent');
const { guardar } = require('./memory');

const PENDING_DIR = path.join(__dirname, '../brain/PENDING_DTS');
const NOTEBOOK_THOUGHTS = path.join(__dirname, '../docs/pensamientos notebooklm.txt');

if (!fs.existsSync(PENDING_DIR)) fs.mkdirSync(PENDING_DIR, { recursive: true });

async function ejecutarSueno(especialidad) {
    console.log(`[DREAMER] 🌙 Iniciando ciclo de sueño para: ${especialidad}`);
    
    const pensamientosBase = fs.existsSync(NOTEBOOK_THOUGHTS) 
        ? fs.readFileSync(NOTEBOOK_THOUGHTS, 'utf8').substring(0, 5000) 
        : '';

    let hipotesisActual = `Revisión forense de la especialidad: ${especialidad}. 
    Objetivo: Eliminar impurezas Nivel 16 y optimizar CAPEX mediante N-1.`;

    // 🔄 BUCLE DE KARPATHY (5 Iteraciones)
    for (let i = 1; i <= 5; i++) {
        console.log(`[DREAMER] 🧬 Iteración ${i}/5...`);
        
        const promptIteracion = `
        [LOOP DE SUEÑO - ITERACIÓN ${i}]
        Estás decantando una solución soberana. 
        Basado en estos pensamientos de referencia:
        ---
        ${pensamientosBase}
        ---
        Propuesta actual: ${hipotesisActual}
        
        TAREA: Mejora la propuesta. Busca contradicciones con el Contrato L1 (APP 001) y la Sec 1.2(d). 
        Elimina cualquier 'Gateway' o costo no justificado por el AT1.
        `;

        const { texto: refinamiento } = await procesarMensaje(promptIteracion, null);
        hipotesisActual = refinamiento;
        
        // Pequeño delay para no saturar Ollama/Host
        await new Promise(r => setTimeout(r, 2000));
    }

    // 🏺 DECANTACIÓN FINAL
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `DT-DREAM-${especialidad.replace(/ /g, '_')}-${timestamp}.md`;
    const finalPath = path.join(PENDING_DIR, fileName);

    const docFinal = `
# 🏺 DECISIÓN TÉCNICA DECANTADA (SICC DREAMER v6.5)
**Especialidad:** ${especialidad}
**Iteraciones:** 5 (Karpathy Loop)
**Estado:** PENDIENTE FIRMA JURÍDICA

## 🏛️ Propuesta Soberana (Michelin Certified)
${hipotesisActual}

---
*Generado autónomamente durante el ciclo de sueño SICC.*
`;

    fs.writeFileSync(finalPath, docFinal);
    console.log(`[DREAMER] ✅ Sueño decantado en: ${fileName}`);
}

// Exportar para el cron
module.exports = { ejecutarSueno };

// Si se ejecuta directamente
if (require.main === module) {
    const target = process.argv[2] || 'Ingeniería de Sistemas';
    ejecutarSueno(target).catch(console.error);
}
