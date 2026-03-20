// search.js — Motor de Búsqueda Web Soberana (v2.4) vía Tavily
'use strict';

const axios = require('axios');

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

/**
 * Realiza una búsqueda técnica en la web
 */
async function buscarEnWeb(query) {
    if (!TAVILY_API_KEY || TAVILY_API_KEY === 'tu_tavily_key_aqui') {
        console.warn('[SEARCH] ⚠️ Tavily API Key no configurada.');
        return 'Búsqueda web no disponible.';
    }

    console.log(`[SEARCH] 🔍 Buscando: "${query}"...`);

    try {
        const response = await axios.post('https://api.tavily.com/search', {
            api_key: TAVILY_API_KEY,
            query: query,
            search_depth: "advanced",
            include_answer: true,
            max_results: 5
        });

        const results = response.data.results.map(r => ({
            title: r.title,
            url: r.url,
            content: r.content.substring(0, 500) + '...'
        }));

        const summary = response.data.answer || "No hay resumen directo, consulte los enlaces.";
        
        return {
            summary: summary,
            sources: results
        };

    } catch (err) {
        console.error(`[SEARCH] ❌ Error en búsqueda web: ${err.message}`);
        return 'Error al consultar la web.';
    }
}

module.exports = { buscarEnWeb };
