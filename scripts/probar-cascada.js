#!/usr/bin/env node
/**
 * probar-cascada.js — Test de gateway de proveedores LLM (v14.8 · 2026-05-08)
 *
 * Dispara la cascada `llamarMultiplexadorFree` con un prompt simple para validar
 * que (a) cada proveedor responde correctamente cuando le toca y (b) la
 * conmutación al siguiente proveedor funciona cuando uno falla.
 *
 * Uso:
 *   node scripts/probar-cascada.js                     # saludo simple
 *   node scripts/probar-cascada.js "Tu pregunta acá"   # prompt custom
 *
 * Lee proveedores en el orden definido en sicc-multiplexer.js. Si el primero
 * responde correctamente (>10 chars limpios), retorna inmediatamente. Si falla
 * (vacío, 429, error, etc.), pasa al siguiente.
 *
 * Salida esperada:
 *   - Lista de cada proveedor probado con su veredicto (OK/SKIP/FAIL)
 *   - Proveedor que respondió finalmente
 *   - Texto de la respuesta (primeros 300 chars)
 *
 * Para validar el bug fix: si NVIDIA Nemotron antes daba "vacío" y ahora con
 * el fallback reasoning_content devuelve contenido, la cascada nunca debería
 * llegar a OPENROUTER (que está en 429 upstream).
 */
'use strict';

const path = require('path');
process.chdir(path.join(__dirname, '..'));

const mux = require('./sicc-multiplexer');

// Stub mínimo de agentContext para que el multiplexer no falle al construir prompts
const agentContextStub = {
  getPromptFast: () => 'Eres un asistente del proyecto LFC2. Responde con frases cortas y directas. Sin emojis. En español.',
  getHistorial: () => [], // historial vacío para test limpio
};
mux.setAgentContext(agentContextStub);

const pregunta = process.argv[2] || 'Di solo: "SCC funciona". Sin más texto.';

console.log('═'.repeat(70));
console.log('🧪 TEST DE CASCADA DE PROVEEDORES LLM (v14.8)');
console.log('═'.repeat(70));
console.log(`Pregunta: "${pregunta}"`);
console.log(`Contexto: vacío (test puro de cascada, sin RAG)`);
console.log(`Historial: vacío`);
console.log('─'.repeat(70));

(async () => {
  const t0 = Date.now();
  try {
    const resultado = await mux.llamarMultiplexadorFree(pregunta, '', null);
    const dt = Date.now() - t0;
    console.log('─'.repeat(70));
    console.log(`✅ RESPONDIÓ: ${resultado.proveedor.toUpperCase()}`);
    console.log(`   Tiempo total: ${dt}ms`);
    console.log(`   Respuesta (${resultado.texto.length} chars):`);
    console.log('   ┌' + '─'.repeat(67));
    const lines = resultado.texto.slice(0, 600).split('\n');
    lines.forEach(l => console.log('   │ ' + l));
    if (resultado.texto.length > 600) console.log('   │ ... (truncado)');
    console.log('   └' + '─'.repeat(67));
    console.log('═'.repeat(70));
    console.log('🟢 CASCADA OK — el agente puede responder a /audit');
    process.exit(0);
  } catch (err) {
    const dt = Date.now() - t0;
    console.log('─'.repeat(70));
    console.error(`❌ TODOS LOS PROVEEDORES FALLARON (${dt}ms)`);
    console.error(`   Error: ${err.message}`);
    console.log('═'.repeat(70));
    console.log('🔴 CASCADA CAÍDA — revisar:');
    console.log('   1. ¿Hay alguna API key vencida en .env?');
    console.log('   2. ¿Cuotas free agotadas en todos los proveedores?');
    console.log('   3. ¿Ollama local arrancado? docker ps | grep ollama');
    process.exit(1);
  }
})();
