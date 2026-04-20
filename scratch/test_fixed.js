
const multiplexer = require('./sicc-multiplexer-fixed');
const { inicializarBrain } = require('../src/agent');

async function test() {
    console.log('--- Testing Fixed Multiplexer ---');
    try {
        // inicializarBrain(); // Let's try without it first to see if it's the bottleneck
        const res = await multiplexer.llamarMultiplexadorFree('Genera una descripción detallada de un sistema de telecomunicaciones ferroviarias en al menos 50 palabras.', '', 'Eres un experto en ingeniería ferroviaria.');
        console.log('Result:', res);
    } catch (err) {
        console.error('Final Error:', err.message);
    }
}

test();
