require('dotenv').config();
const { buscarSimilares } = require('./src/supabase');

async function testRAG() {
  console.log('--- BUSCANDO JERARQUÍA DOCUMENTAL EN RAG ---');
  try {
    const resultados = await buscarSimilares('¿Cuál es el orden de prelación o jerarquía documental del contrato?', 5);
    resultados.forEach((res, i) => {
      console.log(`\n[FRAGMENTO ${i + 1}] (Archivo: ${res.nombre_archivo}, Similitud: ${res.similitud})`);
      console.log('----------------------------------------------------');
      console.log(res.contenido);
    });
  } catch (error) {
    console.error('ERROR EN RAG:', error);
  } finally {
    process.exit();
  }
}

testRAG();
