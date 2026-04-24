#!/usr/bin/env node

const http = require('http');
const { execSync } = require('child_process');

const ORACLE_HOST = '172.20.0.4';
const ORACLE_PORT = 3001;

console.log(`🩺 Iniciando Health-Check para el Oráculo NotebookLM en ${ORACLE_HOST}:${ORACLE_PORT}...`);

const options = {
  hostname: ORACLE_HOST,
  port: ORACLE_PORT,
  path: '/sse',
  method: 'GET',
  timeout: 5000 // 5 segundos de timeout
};

const req = http.request(options, (res) => {
  console.log(`✅ [STATUS: UP] Conexión establecida. Código HTTP: ${res.statusCode}`);
  
  if (res.headers['content-type'] && res.headers['content-type'].includes('text/event-stream')) {
    console.log(`✅ [SSE: OK] El endpoint soporta Server-Sent Events (SSE) correctamente.`);
  } else {
    console.warn(`⚠️ [SSE: WARN] El endpoint respondió, pero el Content-Type no es text/event-stream: ${res.headers['content-type']}`);
  }
  
  // Como es SSE, la conexión se queda abierta. La cerramos manual para el health check.
  res.destroy();
  process.exit(0);
});

req.on('timeout', () => {
  console.error(`❌ [STATUS: TIMEOUT] El servidor no respondió en 5 segundos. Chrome podría estar atascado.`);
  req.destroy();
  sugerirReinicio();
});

req.on('error', (err) => {
  if (err.code === 'ECONNREFUSED') {
    console.error(`❌ [STATUS: DOWN] Conexión rechazada (ECONNREFUSED). El contenedor está caído o el servidor Node.js interno crasheó.`);
  } else if (err.code === 'EHOSTUNREACH') {
    console.error(`❌ [STATUS: UNREACHABLE] Host inalcanzable. Problema de red en Docker (docker_sicc_net).`);
  } else {
    console.error(`❌ [ERROR]: ${err.message}`);
  }
  sugerirReinicio();
});

function sugerirReinicio() {
  console.log(`\n🔄 [AUTO-RECOVERY] Reiniciando el contenedor ${ORACLE_HOST} (notebooklm-mcp)...`);
  try {
    // Si conocemos el nombre del contenedor en docker-compose, sería mejor usarlo. 
    // Usamos la IP directamente como lo hace resetOracle()
    execSync(`docker restart ${ORACLE_HOST}`, { stdio: 'inherit' });
    console.log(`✅ [AUTO-RECOVERY] Reinicio completado. Ejecuta este script nuevamente en 15 segundos.`);
  } catch (e) {
    console.error(`❌ [AUTO-RECOVERY] Falló el reinicio: ${e.message}`);
    console.log(`👉 Ejecuta manualmente: docker-compose restart <nombre-servicio-oracle>`);
  }
  process.exit(1);
}

req.end();
