const { llamarNemotron } = require('./scripts/sicc-multiplexer');

async function test() {
    console.log('🤖 Enviando saludo al Segundo Cerebro (Nemotron-3-Super-120b)...');
    try {
        const respuesta = await llamarNemotron('Hola Nemotron, eres el Segundo Cerebro del sistema SICC v14.6. Confírmame tu disponibilidad para tareas de planificación y lógica compleja bajo la infraestructura de NVIDIA NIM.');
        console.log('\n--- RESPUESTA DE NEMOTRON ---');
        console.log(respuesta);
        console.log('-----------------------------\n');
    } catch (e) {
        console.error('❌ Error llamando a Nemotron:', e.message);
    }
}
test();
