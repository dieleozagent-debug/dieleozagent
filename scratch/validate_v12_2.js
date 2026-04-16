
const multiplexer = require('../scripts/sicc-multiplexer');
const agent = require('../src/agent');
const heartbeat = require('../src/heartbeat');
const config = require('../src/config');

async function validate() {
  console.log('--- 🛡️ SICC VALIDATION v12.2 ---');

  // LAYER 1: Health (Doctor)
  console.log('\n[LAYER 1] Health Validation (Doctor)...');
  const summary = await heartbeat.obtenerResumenForense();
  console.log(`- Status General: ${summary.statusGeneral}`);
  console.log(`- Clima: ${summary.clima}`);
  console.log(`- CrossRef: ${summary.crossRefReporte.split('\n')[0]}`);
  console.log(`- ZeroResidue: ${summary.zeroResidueReporte}`);
  console.log(`- Telemetría 4xx: ${JSON.stringify(multiplexer.EstadoGlobalErrores)}`);

  // LAYER 2: Sovereignty (IA Local)
  console.log('\n[LAYER 2] Sovereignty Validation (IA Local)...');
  try {
    const res = await multiplexer.llamarOllama('ping', null, '', null, 'Responde solo con PONG.');
    console.log(`- Ollama Response: ${res.trim()}`);
    if (res.trim().toUpperCase().includes('PONG')) {
      console.log('- [SICC OK] Soberanía Local Verificada.');
    } else {
      console.warn('- [SICC WARN] Ollama respondió algo inesperado.');
    }
  } catch (err) {
    console.error(`- [SICC FAIL] Ollama Offline: ${err.message}`);
  }

  // LAYER 3: Resilience (Fallback)
  console.log('\n[LAYER 3] Resilience Validation (Fallback)...');
  // Simulamos un error 429 en Gemini para ver si cae a Groq u otro
  const originalGemini = multiplexer.llamarGemini;
  multiplexer.llamarGemini = async () => {
    const err = new Error('Rate limit exceeded');
    err.status = 429;
    throw err;
  };

  try {
    console.log('- Intentando consulta con fallback forzado (Gemini fallando)...');
    const result = await multiplexer.llamarMultiplexadorFree('¿Cuál es la regla maestra de señalización?', 'Regla: FRA 236.');
    console.log(`- Fallback Exitoso vía: ${result.proveedor.toUpperCase()}`);
    console.log(`- Respuesta: ${result.texto.substring(0, 100)}...`);
  } catch (err) {
    console.error(`- [SICC FAIL] Fallback falló: ${err.message}`);
  } finally {
    multiplexer.llamarGemini = originalGemini; // Restaurar
  }

  console.log('\n--- VALIDACIÓN COMPLETADA ---');
}

validate().catch(console.error);
