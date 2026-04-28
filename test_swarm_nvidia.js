const { llamarNvidiaModel } = require('./scripts/sicc-multiplexer');

async function swarmStepByStep() {
    console.log('🌪️ INICIANDO ENJAMBRE HETEROGÉNEO (NVIDIA NIM)...');
    
    try {
        console.log('[STEP 1] Analista Legal (Nemotron)...');
        const res1 = await llamarNvidiaModel('nvidia/nemotron-3-super-120b-a12b', 'Analiza PaN Tipo B.');
        console.log('\n--- DICTAMEN 1 ---\n' + res1 + '\n');
        
        console.log('[STEP 2] Analista Técnico (Llama 3.1 70B)...');
        const res2 = await llamarNvidiaModel('meta/llama-3.1-70b-instruct', 'Arquitectura PaN PTC.');
        console.log('\n--- DICTAMEN 2 ---\n' + res2 + '\n');
        
        console.log('[STEP 3] Analista de Pureza (Mistral NeMo)...');
        const res3 = await llamarNvidiaModel('nv-mistralai/mistral-nemo-12b-instruct', '¿ADIF es aceptable?');
        console.log('\n--- DICTAMEN 3 ---\n' + res3 + '\n');
        
    } catch (e) {
        console.error('CRASH:', e.message);
    }
}

// Forzar espera del proceso
swarmStepByStep().then(() => {
    console.log('✅ ENJAMBRE COMPLETADO.');
    process.exit(0);
}).catch(err => {
    console.error('FATAL:', err);
    process.exit(1);
});
