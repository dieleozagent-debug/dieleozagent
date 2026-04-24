'use strict';

const { llamarMultiplexadorFree } = require('../scripts/sicc-multiplexer'); // Separación de capas para evitar dependencia circular
const fs = require('fs');
const path = require('path');

/**
 * ADVISOR ESTRATÉGICO v9.5.0
 * Su misión es rutar la consulta al especialista adecuado y proponer mejoras al Brain.
 */
async function rutarEstrategiaAdvisor(pregunta, contextoDNA) {
  console.log('[ADVISOR] [SICC BRAIN] Analizando estrategia de ruteo soberano...');
  
  const systemPrompt = `Eres el ORQUESTADOR SOBREANO SICC v12.0. 
Tu misión es decidir qué especialistas del Auditor Forense activar y qué archivos del cerebro (.md) son vitales.

ADN ACTUAL: ${contextoDNA.substring(0, 500)}...

RESPONDE ÚNICAMENTE CON ESTE JSON:
{
  "especialista": "LEGAL" | "TECNICO" | "MIXTO" | "GESTION",
  "archivos_vitales": ["archivo1.md", "archivo2.md"],
  "razonamiento": "Breve explicación de por qué este ruteo",
  "propuesta_aprendizaje": "Breve nota de qué debería aprender el cerebro de esta consulta"
}`;

  try {
    // Usamos el multiplexor free forzando un modelo de ruteo rápido
    const res = await llamarMultiplexadorFree(pregunta, contextoDNA, systemPrompt);
    
    let decision;
    try {
      // Extraer JSON limpiando bloques de código markdown o texto basura
      const cleanJson = res.texto.includes('{') 
        ? res.texto.substring(res.texto.indexOf('{'), res.texto.lastIndexOf('}') + 1)
        : res.texto;
      
      decision = JSON.parse(cleanJson);
    } catch (e) {
      console.warn('[ADVISOR] [SICC WARN] No se pudo parsear JSON. Buscando heurística...');
      decision = { 
        especialista: res.texto.toUpperCase().includes('LEGAL') ? 'LEGAL' : 'MIXTO',
        archivos_vitales: [],
        razonamiento: 'Heurística aplicada por fallo de formato JSON',
        propuesta_aprendizaje: 'El modelo no entregó formato JSON estructurado. Revisar prompt del ruteador.'
      };
    }
    
    console.log(`[ADVISOR] [SICC OK] Decisión: ${decision.especialista} (${decision.razonamiento})`);
    
    // Registrar evolución técnica
    const historyPath = path.join(__dirname, '../brain/HISTORY.md');
    const sugerencia = decision.propuesta_aprendizaje || 'Sin sugerencia específica.';
    const entrada = `\n### 🧬 REGISTRO DE EVOLUCIÓN TÉCNICA (${new Date().toISOString()})\n- **Consulta:** ${pregunta}\n- **Sugerencia:** ${sugerencia}\n- **Ruteo:** ${decision.especialista}\n`;
    
    fs.appendFileSync(historyPath, entrada);
    
    return decision;
  } catch (err) {
    console.error('[ADVISOR] [SICC FAIL] Error en ruteo:', err.message);
    return { especialista: 'MIXTO', archivos_vitales: [], razonamiento: 'Fallo de infraestructura' };
  }
}

module.exports = { rutarEstrategiaAdvisor };
