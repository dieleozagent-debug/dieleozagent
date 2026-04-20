
const config = require('/home/administrador/docker/agente/src/config');
const multiplexer = require('/home/administrador/docker/agente/scripts/sicc-multiplexer');

console.log('--- Debugging Providers ---');
console.log('Gemini API Key:', !!config.ai.gemini.apiKey);
console.log('Groq API Key:', !!config.ai.groq.apiKey);
console.log('OpenRouter API Key:', !!config.ai.openrouter.apiKey);
console.log('Ollama Host:', !!config.ai.ollama.host);

const proveedoresFree = [
    { id: 'gemini' },
    { id: 'groq' },
    { id: 'ollama' },
    { id: 'openrouter' }
];

for (const p of proveedoresFree) {
    const status = !!(config.ai[p.id]?.apiKey || (p.id === 'ollama' && config.ai.ollama.host));
    console.log(`Provider: ${p.id}, Status: ${status}`);
}
