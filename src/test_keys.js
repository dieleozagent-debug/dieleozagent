const { GoogleGenerativeAI } = require('@google/generative-ai');
const Groq = require('groq-sdk');
require('dotenv').config();

async function testGemini() {
  console.log('--- Testing Gemini ---');
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent("Hola, eres Gemini?");
    console.log('✅ Gemini Success:', result.response.text());
  } catch (err) {
    console.error('❌ Gemini Error:', err.message);
  }
}

async function testGroq() {
  console.log('--- Testing Groq ---');
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: 'Hola, eres Groq?' }],
      model: 'llama-3.3-70b-versatile',
    });
    console.log('✅ Groq Success:', chatCompletion.choices[0].message.content);
  } catch (err) {
    console.error('❌ Groq Error:', err.message);
  }
}

async function run() {
  await testGemini();
  await testGroq();
}

run();
