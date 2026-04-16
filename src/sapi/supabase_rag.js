const { buscarSimilares } = require('../supabase');

/**
 * Validar tecnolog?a o decisi?n frente a los PDFs contractuales locales (Verdad Interna).
 */
async function validarInternaSupabase(queryRaw) {
  try {
    const query = typeof queryRaw === 'string' ? queryRaw : JSON.stringify(queryRaw);
    console.log(`[SAPI Supabase] Verificando contrato LFC2: ${query.substring(0, 50)}...`);
    const resultados = await buscarSimilares(query, 5); 
    
    if (!resultados || resultados.length === 0) {
      return "[ALERTA] Sin contexto contractual encontrado. Posible vac?o legal o alucinaci?n del Enjambre.";
    }

    const contexto = resultados.map(r => r.contenido).join('\n\n');
    return contexto;
  } catch (error) {
    console.error('[SAPI Supabase] Error cr?tico:', error.message);
    return `[ERROR_DB] Fall? consulta al contrato: ${error.message}`;
  }
}

module.exports = {
  validarInternaSupabase
};
