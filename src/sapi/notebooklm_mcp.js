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
    execSync('docker restart 172.20.0.4', { timeout: 30000 });
    console.log('[SAPI NotebookLM] Contenedor Oracle reiniciado.');
  } catch (e) {
    console.error('[SAPI NotebookLM] Fallo al reiniciar contenedor Oracle:', e.message);
  }
}

async function initMCP() {
  if (mcpClient) return mcpClient;
  const transport = new SSEClientTransport(new URL('http://172.20.0.4:3001/sse'));
  const client = new Client({ name: 'SICC_Agent', version: '12.2.0' }, { capabilities: { tools: {} } });
  await withTimeout(client.connect(transport), MCP_CONNECT_TIMEOUT_MS, 'initMCP connect');
  mcpClient = client;
  return mcpClient;
}

async function llamarOracle(query) {
  const client = await withTimeout(initMCP(), MCP_CONNECT_TIMEOUT_MS, 'initMCP');
  const result = await withTimeout(
    client.callTool({ name: 'ask_question', arguments: { question: query } }, undefined, { timeout: MCP_QUERY_TIMEOUT_MS }),
    MCP_QUERY_TIMEOUT_MS + 5000,
    'ask_question'
  );
  if (result && result.content && result.content.length > 0) return result.content[0].text;
  return JSON.stringify(result);
}

/**
 * Validar tecnología global (Verdad Externa) usando NotebookLM.
 * Si Chrome está atascado (-32001 / timeout), lo reinicia y reintenta una vez.
 */
async function validarExternaNotebook(queryRaw) {
  const query = typeof queryRaw === 'string' ? queryRaw : JSON.stringify(queryRaw);
  console.log(`[SAPI NotebookLM] Consultando Oráculo: ${query.substring(0, 50)}...`);

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
