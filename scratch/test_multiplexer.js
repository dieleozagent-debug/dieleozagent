
const multiplexer = require('/home/administrador/docker/agente/scripts/sicc-multiplexer');

async function test() {
    console.log('--- Testing Multiplexer ---');
    try {
        const res = await multiplexer.llamarMultiplexadorFree('Hola, responde en una palabra.', '', 'Eres un asistente.');
        console.log('Result:', res);
    } catch (err) {
        console.error('Final Error:', err.message);
    }
}

test();
