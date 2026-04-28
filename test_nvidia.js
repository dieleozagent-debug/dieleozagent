const { llamarNvidia } = require('./scripts/sicc-multiplexer');
const config = require('./src/config');

async function test() {
    console.log('🤖 Enviando saludo a DeepSeek-v4-pro en NVIDIA NIM...');
    try {
        const respuesta = await llamarNvidia('Hola DeepSeek, saluda al equipo SICC de LFC2 y confírmame que estás operando bajo la infraestructura de NVIDIA NIM para nuestra auditoría forense.');
        console.log('\n--- RESPUESTA DE DEEPSEEK ---');
        console.log(respuesta);
        console.log('-----------------------------\n');
    } catch (e) {
        console.error('❌ Error llamando a NVIDIA:', e.message);
    }
}
test();
