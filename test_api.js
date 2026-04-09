const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./src/config');
const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
async function test() {
  console.log(`[TEST-API] Usando llave: ${config.ai.gemini.apiKey.substring(0, 5)}...`);
  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
    const result = await model.embedContent("Hola mundo contractual de Michelin");
    console.log(`[TEST-API] ✅ Éxito. Vector de dimensiones: ${result.embedding.values.length}`);
  } catch (err) {
    console.error(`[TEST-API] ❌ Fallo:`, err.message);
  }
}
test().catch(console.error);
