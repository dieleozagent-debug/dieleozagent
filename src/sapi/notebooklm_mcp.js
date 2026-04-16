const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

let mcpClient = null;

async function initMCP() {
  if (mcpClient) return mcpClient;

  // Usa la SAPI oficial de Github: interactúa por STDIO pero puenteado en el host Docker local
  const transport = new StdioClientTransport({
    command: 'docker',
    args: ['exec', '-i', 'notebooklm-mcp-v12', 'npx', 'tsx', 'src/index.ts']
  });

  mcpClient = new Client({
    name: 'SICC_Agent',
    version: '12.2.0'
  }, {
    capabilities: { tools: {} }
  });

  await mcpClient.connect(transport);
  return mcpClient;
}

/**
 * Validar tecnología global (Verdad Externa) usando la Libreta Compartida NotebookLM.
 */
async function validarExternaNotebook(query) {
  try {
    const client = await initMCP();
    console.log(`[SAPI NotebookLM] Consultando Oqáculo: ${query.substring(0, 50)}...`);
    
    // Llamamos la tool ask_question
    const result = await client.callTool({
      name: 'ask_question',
      arguments: {
        query: query
      }
    });

    if (result && result.content && result.content.length > 0) {
      return result.content[0].text;
    }
    return JSON.stringify(result);
  } catch (error) {
    console.error('[SAPI NotebookLM] Error crítico de validación:', error.message);
    return `[ERROR_ALUCINACIÓW] El Oráculo externo rechazó o falló la consulta: ${error.message}`;
  }
}

module.exports = {
  validarExternaNotebook
};
