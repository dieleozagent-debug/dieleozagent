const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { SSEClientTransport } = require('@modelcontextprotocol/sdk/client/sse.js');

const MCP_CONNECT_TIMEOUT_MS = 20000;  // 20s para conectar al Oracle
const MCP_QUERY_TIMEOUT_MS   = 180000; // 3min para ask_question (incluye auto-login + Chromium cold start)

let mcpClient = null;

function withTimeout(promise, ms, label) {
  const timer = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`[TIMEOUT] ${label} superó ${ms}ms`)), ms)
  );
  return Promise.race([promise, timer]);
}

async function initMCP() {
  if (mcpClient) return mcpClient;

  const transport = new SSEClientTransport(new URL('http://notebooklm-mcp-v12:3001/sse'));

  const client = new Client({
    name: 'SICC_Agent',
    version: '12.2.0'
  }, {
    capabilities: { tools: {} }
  });

  await withTimeout(client.connect(transport), MCP_CONNECT_TIMEOUT_MS, 'initMCP connect');
  mcpClient = client;
  return mcpClient;
}

/**
 * Validar tecnología global (Verdad Externa) usando la Libreta Compartida NotebookLM.
 */
async function validarExternaNotebook(queryRaw) {
  try {
    const query = typeof queryRaw === 'string' ? queryRaw : JSON.stringify(queryRaw);
    const client = await withTimeout(initMCP(), MCP_CONNECT_TIMEOUT_MS, 'initMCP');
    console.log(`[SAPI NotebookLM] Consultando Oráculo: ${query.substring(0, 50)}...`);

    // Pass timeout both as MCP SDK option AND as Promise.race guard
    const result = await withTimeout(
      client.callTool(
        { name: 'ask_question', arguments: { question: query } },
        undefined,
        { timeout: MCP_QUERY_TIMEOUT_MS }
      ),
      MCP_QUERY_TIMEOUT_MS + 5000,
      'ask_question'
    );

    if (result && result.content && result.content.length > 0) {
      return result.content[0].text;
    }
    return JSON.stringify(result);
  } catch (error) {
    console.error('[SAPI NotebookLM] Error crítico de validación:', error.message);
    // cerrar transporte antes de resetear para evitar "Already connected" en el Oracle
    if (mcpClient) {
      try { await mcpClient.close(); } catch (_) {}
    }
    mcpClient = null;
    return `[ERROR_ORACULO] El Oráculo externo falló: ${error.message}`;
  }
}

module.exports = {
  validarExternaNotebook
};
