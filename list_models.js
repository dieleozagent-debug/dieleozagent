const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./src/config');
const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);

async function listModels() {
  const models = await genAI.getGenerativeModel({ model: 'gemini-pro' }); // Solo para obtener el cliente
  // Nota: la SDK no tiene un listModels directo fácil sin el cliente REST, 
  // pero intentaremos embedContent con el modelo base 'embedding-001'
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001"});
    const result = await model.embedContent("test");
    console.log("✅ embedding-001 funciona");
  } catch (e) {
    console.log("❌ embedding-001 falla:", e.message);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
    const result = await model.embedContent("test");
    console.log("✅ text-embedding-004 funciona");
  } catch (e) {
    console.log("❌ text-embedding-004 falla:", e.message);
  }
}
listModels().catch(console.error);
