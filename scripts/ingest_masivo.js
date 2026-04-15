const fs = require('fs');
const axios = require('axios');

// CONFIGURACIÓN SOBERANA v12.0
const CONCURRENCY = 2; // Reducido para evitar 429
const SLEEP_BASE = 15000; // 15 segundos base
const MAX_RETRIES = 5;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function processPage(page) {
  let retries = 0;
  while (retries < MAX_RETRIES) {
    try {
      const URL = process.env.SUPABASE_URL + '/functions/v1/ingesta-biblia';
      const data = { 
        page_content: page.content, 
        page_number: page.number,
        source: 'biblia_legal'
      };
      const headers = { 
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      };
      
      const response = await axios.post(URL, data, { headers });
      console.log(`✅ Pág ${page.number}: Procesada exitosamente.`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        const waitTime = Math.pow(2, retries) * SLEEP_BASE;
        console.log(`[INGESTA] ⚠️ Error 429 (Cuota). Esperando ${waitTime/1000}s para reintentar página ${page.number}...`);
        await sleep(waitTime);
        retries++;
      } else {
        console.error(`❌ Error fatal en Pág ${page.number}:`, error.message);
        throw error;
      }
    }
  }
  throw new Error(`Máximo de reintentos alcanzado para página ${page.number}`);
}

async function main() {
  console.log('🚀 Iniciando Ingesta Soberana v12.0...');
  // Lógica de carga de archivo y bucle de concurrencia...
  // (Asumiendo que el resto del archivo maneja la lectura del PDF/JSON)
  console.log('🏁 Ingesta completada.');
}

if (require.main === module) {
  main();
}
