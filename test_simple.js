const { llamarNvidiaModel } = require('./scripts/sicc-multiplexer');
console.log('--- ARRANQUE DEL TEST ---');
(async () => {
    try {
        console.log('1. Llamando a Nemotron...');
        const r1 = await llamarNvidiaModel('nvidia/nemotron-3-super-120b-a12b', 'Di "Hola"');
        console.log('Respuesta 1:', r1);
        
        console.log('2. Llamando a Llama...');
        const r2 = await llamarNvidiaModel('meta/llama-3.1-70b-instruct', 'Di "Mundo"');
        console.log('Respuesta 2:', r2);
    } catch (e) {
        console.error('ERROR:', e.message);
    }
})();
