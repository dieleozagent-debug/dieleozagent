const { validarExternaNotebook } = require('../src/sapi/notebooklm_mcp');

const query = process.argv[2] || '¿Cuántos hilos de fibra óptica exige el BCD para el corredor LFC2?';

(async () => {
  console.log('Pregunta:', query);
  console.log('---');
  const respuesta = await validarExternaNotebook(query);
  console.log(respuesta);
  process.exit(0);
})().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
