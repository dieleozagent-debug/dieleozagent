const { extraerCodigoError } = require('../src/agent');

const mockAxiosError = { response: { status: 402 } };
const mockOpenAIError = { status: 404 };
const mockRegexError = { message: 'Error 429: Too many requests' };

console.log('--- TEST TELEMETRÍA 4xx ---');
console.log('Axios 402:', extraerCodigoError(mockAxiosError) === 402 ? '✅ OK' : '❌ FAIL');
console.log('OpenAI 404:', extraerCodigoError(mockOpenAIError) === 404 ? '✅ OK' : '❌ FAIL');
console.log('Regex 429:', extraerCodigoError(mockRegexError) === 429 ? '✅ OK' : '❌ FAIL');
