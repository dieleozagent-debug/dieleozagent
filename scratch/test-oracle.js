const { validarExternaNotebook } = require('../src/sapi/notebooklm_mcp');

async function testOracle() {
    console.log('🔮 Probando Oráculo de Verdad Externa (NotebookLM MCP)...');
    try {
        const query = 'Cuáles son los estándares de seguridad FRA 236 para PTC?';
        const respuesta = await validarExternaNotebook(query);
        
        console.log('\n--- RESPUESTA DEL ORÁCULO ---');
        console.log(respuesta);
        console.log('-----------------------------');
        
        if (respuesta.toLowerCase().includes('error') || respuesta.toLowerCase().includes('failed')) {
            console.log('❌ El Oráculo falló o no está conectado.');
        } else {
            console.log('✅ ORÁCULO OPERATIVO Y CONECTADO.');
        }
    } catch (e) {
        console.error('❌ Error fatal en el test del Oráculo:', e.message);
    }
}

testOracle();
