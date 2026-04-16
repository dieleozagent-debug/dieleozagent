const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

let mcpClient = null;

async function initMCP() {
  if (mcpClient) return mcpClient;

  // Usa la SAPI oficial de Github: interact?a por STDIO pero puenteado en el host Docker local
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
 * Validar tecnolog?a global (Verdad Externa) usando la Libreta Compartida NotebookLM.
 */
async function validarExternaNotebook(queryRaw) {
  try {
    const query = typeof queryRaw === 'string' ? queryRaw : JSON.stringify(queryRaw);
    const client = await initMCP();
    console.log(`[SAPI NotebookLM] Consultando Or?culo: ${query.substring(0, 50)}...`);
    
    // Llamamos la tool ask_question
    const result = await client.callTool({
      name: 'ask_question',
      arguments: {
        question: query
      }
    });

    if (result && result.content && result.content.length > 0) {
      return result.content[0].text;
    }
    return JSON.stringify(result);
  } catch (error) {
    console.error('[SAPI NotebookLM] Error cr?tico de validaci?n:', error.message);
    return `[ERROR_ALUCINACI?N] El Or?culo externo rechaz? o fall? la consulta: ${error.message}`;
  }
}

module.exports = {
  validarExternaNotebook
};
