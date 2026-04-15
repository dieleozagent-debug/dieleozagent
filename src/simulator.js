/**
 * 🛡️ SICC SIMULATOR (v12.0)
 * Orquestador de Autonomía Forense Superior.
 * 
 * Lógica: Tomar hipótesis AUDIT_QUEUE -> Ejecutar Sonda Forense (Deductiva N-1)
 *       -> Validar contra Estándares de Oro (dictamenes/)
 *       -> Decantar en DT-VALIDATED (Certificada).
 * 
 * No hay "Sueños". No hay "Hallucinations". Sólo deducción.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { procesarMensaje, ejecutarSondaForense } = require('./agent');
const { cargarMemoriaReciente } = require('./memory');
const { getCpuLoad } = require('../scripts/resource-governor');
const { enviarAlerta } = require('./notifications');

const PENDING_DIR = path.join(__dirname, '../brain/PENDING_DTS');
const BLOCKER_DIR = path.join(__dirname, '../brain/BLOCKERS');
const OPERATIONS_DASHBOARD = path.join(__dirname, '../brain/SICC_OPERATIONS.md');
const AUDIT_QUEUE = path.join(__dirname, '../brain/AUDIT_QUEUE.md');

if (!fs.existsSync(PENDING_DIR)) fs.mkdirSync(PENDING_DIR, { recursive: true });
if (!fs.existsSync(BLOCKER_DIR)) fs.mkdirSync(BLOCKER_DIR, { recursive: true });

async function ejecutarValidacionSoberana(especialidad) {
    console.log(`[SIMULATOR] 🛡️ Iniciando verificación soberana para: ${especialidad}`);
    
    // 1. CARGAR LTM (Estándares de Oro)
    const dictamenesDir = path.join(__dirname, '../brain/dictamenes');
    let goldStandards = '';
    if (fs.existsSync(dictamenesDir)) {
        const files = fs.readdirSync(dictamenesDir).filter(f => f.endsWith('.md'));
        goldStandards = files.map(f => fs.readFileSync(path.join(dictamenesDir, f), 'utf8').substring(0, 2000)).join('\n---\n');
    }

    try {
        // 🔬 FASE 1: SONDA FORENSE (Minería Deductiva)
        console.log(`[SIMULATOR] 🔬 Activando Sonda Forense para extracción N-1...`);
        const forensicReport = await ejecutarSondaForense(especialidad, goldStandards);
        
        // 🛡️ FASE 2: VEREDICTO DE CONSISTENCIA
        console.log(`[SIMULATOR] ⚖️ Invocando al Orquestador Soberano para certificación final...`);
        
        const systemPrompt = `Eres el SIMULADOR SICC v12.0. 
        Tu misión es certificar si la propuesta es técnica y contractualmente PERFECTA (Cero Hallucination).
        ESTÁNDARES DE ORO APROBADOS: 
        ${goldStandards}
        
        HALLAZGOS DE LA SONDA:
        ${forensicReport}

        TAREA: 
        1. Si hay contradicción con los Estándares de Oro o R-HARD, responde iniciando con "BLOCKER: [Motivo]".
        2. Si no hay fallos, genera la Decisión Técnica Certificada (N-1).
        `;

        const { texto: finalVeredict } = await procesarMensaje(`Certifica la especialidad: ${especialidad}`, null, systemPrompt);
        
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        if (finalVeredict.includes('BLOCKER:')) {
            const safeSubject = especialidad.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
            const blockerFileName = `BLOCKER-${safeSubject}-${timestamp}.md`;
            const blockerPath = path.join(BLOCKER_DIR, blockerFileName);
            
            const blockerDoc = `
# [BLOCKER] BLOQUEO SICC SIMULATOR (Deducción N-1)
**Especialidad:** ${especialidad}
**Fecha:** ${new Date().toLocaleDateString()}
**Veredicto:**
${finalVeredict}

## Auditoría Forense:
Sonda detectó desviaciones del SSOT o R-HARD. Requiere intervención humana (Dirección Técnica).
            `;
            fs.writeFileSync(blockerPath, blockerDoc);
            
            await actualizarDashboard(especialidad, '[SICC BLOCKER] RECHAZADO', finalVeredict);
            await enviarAlerta(`[SICC BLOCKER] *BLOQUEO DE SIMULADOR*\n\n*Especialidad:* ${especialidad}\n\n${finalVeredict.substring(0, 500)}...`);
            return;
        }

        // [SICC DT] CERTIFICACIÓN FINAL
        const safeSubject = especialidad.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
        const fileName = `DT-VALIDATED-${safeSubject}-${timestamp}.md`;
        const finalPath = path.join(PENDING_DIR, fileName);

        const docFinal = `
# [SICC DT] DECISIÓN TÉCNICA CERTIFICADA (v12.0)
**Especialidad:** ${especialidad}
**Estado:** PENDIENTE FIRMA SOBREANA
**Fecha:** ${new Date().toLocaleDateString()}
**Nivel de Fidelidad:** N-1 (Deductivo N-1)

---
${finalVeredict}

---
*Certificación Forense: SICC Simulator Protocol v12.0*
*Vo.Bo. Requerido: [Firma Humana Autorizada] Contrato APP No. 001/2025*
`;

        fs.writeFileSync(finalPath, docFinal);
        console.log(`[SIMULATOR] [SICC OK] DT Certificada en: ${fileName}`);

        await actualizarDashboard(especialidad, '[SICC OK] CERTIFICADO', fileName);
        await enviarAlerta(`[SICC DT] *DT SOBERANA GENERADA*\n\n*Especialidad:* ${especialidad}\n*Archivo:* \`${fileName}\``);
        
    } catch (err) {
        console.error(`[SIMULATOR] [SICC FAIL] Error fatal en ciclo soberano: ${err.message}`);
        await actualizarDashboard(especialidad, '[SICC BLOCKER] FALLO MOTOR', err.message);
    }
}

async function actualizarDashboard(especialidad, estado, detalle) {
    if (!fs.existsSync(OPERATIONS_DASHBOARD)) return;
    
    let content = fs.readFileSync(OPERATIONS_DASHBOARD, 'utf8');
    const timestamp = new Date().toLocaleString();

    if (estado.includes('BLOCKER') || estado.includes('RECHAZADO')) {
        const blockerEntry = `- **${especialidad}** (${timestamp}): ${detalle.substring(0, 100)}...`;
        content = content.replace('## [SICC BLOCKER] BLOCKERS ACTIVOS (Juicio de Diego Requerido)\n*No hay bloqueos activos en este momento.*', `## [SICC BLOCKER] BLOCKERS ACTIVOS (Juicio de Diego Requerido)\n${blockerEntry}`);
    } else {
        const dtEntry = `- [ ] [${especialidad} - ${timestamp}](file:///home/administrador/docker/agente/brain/PENDING_DTS/${detalle})`;
        content = content.replace('## [SICC DT] DECISIONES TÉCNICAS (PENDIENTES DE FIRMA)', `## [SICC DT] DECISIONES TÉCNICAS (PENDIENTES DE FIRMA)\n${dtEntry}`);
    }

    const factorySection = `## 🛡️ ESTADO DEL SIMULADOR (Última Validación)\n- **Tema:** ${especialidad}\n- **Estado:** ${estado}\n- **Fecha:** ${timestamp}`;
    content = content.replace(/## 🧬 ESTADO DE LA FACTORÍA \(Última Carrera\)\n[\s\S]*?\n\n/g, factorySection + '\n\n');
    content = content.replace(/## 🛡️ ESTADO DEL SIMULADOR \(Última Validación\)\n[\s\S]*?\n\n/g, factorySection + '\n\n');

    fs.writeFileSync(OPERATIONS_DASHBOARD, content);
}

module.exports = { ejecutarValidacionSoberana };

if (require.main === module) {
    const target = process.argv[2] || 'Ingeniería de Sistemas';
    ejecutarValidacionSoberana(target).catch(console.error);
}
