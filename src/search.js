// search.js — Cliente modular para búsqueda web (Tavily API)
'use strict';

const config = require('./config');
const fetch = require('node-fetch');

/**
 * Realiza una búsqueda web optimizada para LLMs.
 * @param {string} query - El término de búsqueda técnico.
 * @returns {Promise<string>} - Contexto enriquecido de los resultados.
 */
async function buscarEnWeb(query) {
  if (!config.ai.tavily.apiKey) {
    console.log('[SEARCH] ⚠️ No hay TAVILY_API_KEY configurada. Saltando búsqueda web.');
    return '';
  }

  console.log(`[SEARCH] 🔍 Buscando en la web (Tavily): "${query}"`);

  try {
    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.ai.tavily.apiKey,
        query: query,
        search_depth: 'advanced', // Mayor profundidad para temas técnicos de ingeniería
        include_answer: true,
        max_results: 5,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error Tavily: ${response.statusText}`);
    }

    const data = await response.json();
    
    let contexto = '\n\n## 🌐 INVESTIGACIÓN TÉCNICA WEB (LIVE)\n';
    contexto += `*Fuentes consultadas en tiempo real para complementar el cerebro local.*\n\n`;

    if (data.answer) {
      contexto += `> **Resumen Ejecutivo:** ${data.answer}\n\n`;
    }

    data.results.forEach((res, i) => {
      contexto += `### Fuente ${i + 1}: ${res.title}\n`;
      contexto += `URL: ${res.url}\n`;
      contexto += `Contenido: ${res.content}\n\n`;
    });

    return contexto;
  } catch (err) {
    console.error('[SEARCH] ❌ Error en búsqueda web:', err.message);
    return '\n\n⚠️ Error en búsqueda web. Usando solo conocimiento local.';
  }
}

module.exports = { buscarEnWeb };
