const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');
const { execSync } = require('child_process');

const MCP_CONNECT_TIMEOUT_MS = 20000;
const MCP_QUERY_TIMEOUT_MS   = 90000; // 90s — si Chrome no responde en 90s, está atascado

let mcpClient = null;

function withTimeout(promise, ms, label) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`[TIMEOUT] ${label} superó ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]);
}

async function resetOracle() {
  // Reinicia el contenedor completo — matar solo Chrome deja el MCP server en estado roto
  if (mcpClient) { try { await mcpClient.close(); } catch (_) {} }
  mcpClient = null;
  try {
    execSync('docker restart notebooklm-mcp-v12', { timeout: 30000 });
    console.log('[SAPI NotebookLM] Contenedor Oracle reiniciado.');
  } catch (e) {
    console.error('[SAPI NotebookLM] Fallo al reiniciar contenedor Oracle:', e.message);
  }
}

async function initMCP() {
  if (mcpClient) return mcpClient;
  // Usamos el hostname del contenedor en lugar de una IP estática frágil
  const transport = new SSEClientTransport(new URL('http://notebooklm-mcp:3001/sse'));
  const client = new Client({ name: 'SICC_Agent', version: '12.2.0' }, { capabilities: { tools: {} } });
  await withTimeout(client.connect(transport), MCP_CONNECT_TIMEOUT_MS, 'initMCP connect');
  mcpClient = client;
  return mcpClient;
}

/**
 * Construye una respuesta consolidada del MCP NotebookLM.
 * El MCP devuelve estructura: { content: [{ type:'text', text: '<JSON-string>' }] }
 * donde el JSON-string interno contiene { success, data:{ status, question, answer,
 * session_id, notebook_url, session_info } }.
 *
 * Esta función EXTRAE el `data.answer` (respuesta real) y CONCATENA todos los chunks
 * si vienen múltiples (`content[0..N]`), además de adjuntar metadata útil al final
 * (session_id, notebook_url) para trazabilidad forense.
 *
 * v14.8.3 (2026-05-08): antes solo devolvía `content[0].text` crudo (JSON-string sin
 * parsear). Ahora construye un texto verificable con answer + metadata.
 */
function construirRespuestaMCP(result) {
  if (!result || !result.content || !Array.isArray(result.content) || result.content.length === 0) {
    return `[ORACULO_VACIO] El MCP NotebookLM no devolvió contenido. Result raw: ${JSON.stringify(result).slice(0, 300)}`;
  }

  const partes = [];
  let metadata = null;
  let chatter_filtrado = '';

  for (const chunk of result.content) {
    if (chunk.type !== 'text' || !chunk.text) continue;

    // El MCP envuelve la respuesta en un JSON-string. Intentar parsearlo.
    let parsed = null;
    try { parsed = JSON.parse(chunk.text); } catch (_) { /* texto plano, OK */ }

    if (parsed && parsed.success && parsed.data && parsed.data.answer) {
      // Estructura típica del NotebookLM-MCP
      let answer = parsed.data.answer;

      // Filtrar chatter del MCP que se mete al final ("EXTREMELY IMPORTANT: Is that ALL...")
      const chatterRegex = /\n+EXTREMELY IMPORTANT:[\s\S]*$/i;
      if (chatterRegex.test(answer)) {
        chatter_filtrado = answer.match(chatterRegex)[0].trim();
        answer = answer.replace(chatterRegex, '').trim();
      }

      // Limpiar marcadores in-line tipo "\n1\nmore_horiz\n." que vienen del UI de NotebookLM
      answer = answer.replace(/\n\d+\nmore_horiz\n\.?/g, ' [fuente]');

      partes.push(answer);

      // Capturar metadata de la primera respuesta válida
      if (!metadata) {
        metadata = {
          status: parsed.data.status,
          question: parsed.data.question,
          session_id: parsed.data.session_id,
          notebook_url: parsed.data.notebook_url,
          session_info: parsed.data.session_info,
        };
      }
    } else {
      // Texto plano sin envoltura JSON — concatenarlo igual
      partes.push(chunk.text);
    }
  }

  if (partes.length === 0) {
    return `[ORACULO_INVALIDO] MCP devolvió ${result.content.length} chunk(s) sin texto utilizable. Raw: ${JSON.stringify(result).slice(0, 300)}`;
  }

  // Construir texto final con metadata trazable
  const respuesta = partes.join('\n\n');
  if (metadata) {
    return [
      respuesta,
      '',
      '---',
      `[Oráculo NotebookLM · session_id: ${metadata.session_id || 'n/a'} · notebook: ${metadata.notebook_url || 'n/a'}]`,
      metadata.session_info ? `[age: ${metadata.session_info.age_seconds?.toFixed?.(1) ?? '?'}s · msg_count: ${metadata.session_info.message_count ?? '?'}]` : '',
    ].filter(Boolean).join('\n');
  }
  return respuesta;
}

async function llamarOracle(query) {
  const client = await withTimeout(initMCP(), MCP_CONNECT_TIMEOUT_MS, 'initMCP');
  const result = await withTimeout(
    client.callTool({ name: 'ask_question', arguments: { question: query } }, undefined, { timeout: MCP_QUERY_TIMEOUT_MS }),
    MCP_QUERY_TIMEOUT_MS + 5000,
    'ask_question'
  );
  return construirRespuestaMCP(result);
}

/**
 * v14.8.4 (2026-05-08): Anclaje contractual obligatorio para TODA query al Oráculo.
 *
 * Razón: NotebookLM tiene 124 documentos cargados (TDR Fase III, Adendas del Proceso
 * de Selección, AT1-AT7, BCD V001, Bases de Diseño, propuestas técnicas, etc.). Si la
 * query es libre ("¿cuántos hilos de fibra?"), el modelo mezcla pre-contractuales con
 * contractuales y termina inventando hasta nombres de DTs (ej. DT-TEL-2026-007 que
 * NO EXISTE — alucinación verificada por escaneo forense del Director Técnico UF2
 * 2026-05-08).
 *
 * Solución: prepender un PROMPT GUARDIAN que fuerza al Oráculo a:
 * 1. Aplicar Regla de Prelación Documental (Sección 1.2.d del Contrato APP 001/2025).
 * 2. PREVALECEN: cuerpo del Contrato + Apéndices Técnicos (AT1, AT3, AT4, AT5, AT6, AT7).
 * 3. NO PREVALECEN: TDR de licitación, Adendas del Proceso de Selección, propuestas
 *    de oferta, Líneas Base internas — son pre-contractuales.
 * 4. Citar SOLO archivos verificables del notebook; NO inventar nombres de DTs.
 */
// v14.8.4: anclaje conciso al contrato + apéndices + bases de diseño internas.
// Limita el espacio de búsqueda del Oráculo a las fuentes vinculantes y dirige
// hacia el documento principal de diseño LFC. Si hay conflicto entre fuentes,
// NotebookLM ya conoce la jerarquía (Contrato > Apéndices > Bases).
const ANCLAJE_CONTRACTUAL = `Responde según el Contrato APP 001/2025, sus Apéndices Técnicos y el documento "Bases de Diseño - CTSC (2)". Pregunta: `;

/**
 * Validar tecnología global (Verdad Externa) usando NotebookLM.
 * Si Chrome está atascado (-32001 / timeout), lo reinicia y reintenta una vez.
 */
async function validarExternaNotebook(queryRaw) {
  const queryUsuario = typeof queryRaw === 'string' ? queryRaw : JSON.stringify(queryRaw);
  // v14.8.4: prepender anclaje contractual a TODA query
  const query = ANCLAJE_CONTRACTUAL + queryUsuario;
  console.log(`[SAPI NotebookLM] Consultando Oráculo (con anclaje contractual ${ANCLAJE_CONTRACTUAL.length} chars): ${queryUsuario.substring(0, 50)}...`);

  for (let intento = 1; intento <= 2; intento++) {
    try {
      return await llamarOracle(query);
    } catch (error) {
      const esAtasco = error.message.includes('-32001') || error.message.includes('TIMEOUT') || error.message.includes('timed out');
      console.error(`[SAPI NotebookLM] Intento ${intento} fallido: ${error.message}`);
      if (esAtasco && intento === 1) {
        console.log('[SAPI NotebookLM] Chrome atascado detectado — reiniciando y reintentando...');
        await resetOracle();
        await new Promise(r => setTimeout(r, 15000)); // esperar 15s para que el contenedor y Chrome arranquen
      } else {
        if (mcpClient) { try { await mcpClient.close(); } catch (_) {} }
        mcpClient = null;
        return `[ERROR_ORACULO] El Oráculo externo falló tras ${intento} intento(s): ${error.message}`;
      }
    }
  }
}

module.exports = {
  validarExternaNotebook
};
