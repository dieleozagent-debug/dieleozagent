'use strict';

const fs = require('fs');
const path = require('path');
const { enviarAlerta } = require('./notifications');

const FINDINGS_PATH = path.join(__dirname, '../data/logs/forensic-findings.json');

/**
 * Encola un hallazgo forense en el búfer local.
 */
function encolarHallazgo(titulo, detalle, criticidad = 'INFO', metadata = {}) {
  try {
    let findings = [];
    if (fs.existsSync(FINDINGS_PATH)) {
      findings = JSON.parse(fs.readFileSync(FINDINGS_PATH, 'utf8'));
    }
    
    findings.push({
      timestamp: new Date().toISOString(),
      titulo,
      detalle,
      criticidad,
      metadata
    });
    
    fs.writeFileSync(FINDINGS_PATH, JSON.stringify(findings, null, 2));
    console.log(`[DIGEST] 📝 Hallazgo encolado: ${titulo} (${criticidad})`);
  } catch (err) {
    console.error('[DIGEST] [SICC FAIL] Fallo al encolar hallazgo:', err.message);
  }
}

/**
 * Consolida los hallazgos y envía el reporte matutino.
 */
async function enviarMorningDigest() {
  if (!fs.existsSync(FINDINGS_PATH)) {
    console.log('[DIGEST] ℹ️ No hay hallazgos para resumir.');
    return;
  }
  
  try {
    const findings = JSON.parse(fs.readFileSync(FINDINGS_PATH, 'utf8'));
    if (findings.length === 0) {
       console.log('[DIGEST] ℹ️ El búfer está vacío.');
       return;
    }
    
    let report = `⚖️ **SICC MORNING DIGEST — REPORTE FORENSE**\n`;
    report += `📅 *Sesión:* ${new Date().toLocaleDateString()}\n`;
    report += `🔍 *Total Hallazgos:* ${findings.length}\n\n`;
    report += `═`.repeat(15) + `\n\n`;
    
    // Agrupar por criticidad o simplemente listar los últimos 10 más importantes
    const highlights = findings.slice(-10); // Limitamos a los últimos 10 para no saturar Telegram
    
    highlights.forEach((f, i) => {
      const emoji = f.criticidad === 'ALERTA' ? '[SICC BLOCKER]' : (f.criticidad === 'INFO' ? 'ℹ️' : '[SICC BRAIN]');
      report += `${emoji} **${f.titulo}**\n_${f.detalle}_\n\n`;
    });
    
    if (findings.length > 10) {
      report += `\n... y ${findings.length - 10} hallazgos más en SICC_OPERATIONS.md`;
    }
    
    report += `\n\n🏁 *Fin del Resumen. Todos los hallazgos han sido guardados en el historial.*`;
    
    await enviarAlerta(report);
    
    // Vaciar el búfer tras el envío exitoso
    fs.writeFileSync(FINDINGS_PATH, JSON.stringify([], null, 2));
    console.log('[DIGEST] [SICC OK] Morning Digest enviado y búfer vaciado.');
    
  } catch (err) {
    console.error('[DIGEST] [SICC FAIL] Fallo al enviar Morning Digest:', err.message);
  }
}

// Permitir ejecución directa para pruebas o cron
if (require.main === module) {
  if (process.argv.includes('--send')) {
    enviarMorningDigest();
  }
}

module.exports = { encolarHallazgo, enviarMorningDigest };
