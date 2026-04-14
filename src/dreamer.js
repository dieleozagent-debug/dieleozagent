/**
 * 🌙 SICC DREAMER (v6.5 Michelin Edition)
 * Orquestador de Autonomía Forense e Iteración Karpathy.
 * Ventana Operativa: 8:00 PM - 7:00 AM.
 * 
 * Lógica: Tomar hipótesis -> Iterar 5 veces con Ollama (hallucinate) 
 *       -> Auditar contra Contrato Level 1/2 y NotebookLM pensamientos
 *       -> Decantar en DT Borrador.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { procesarMensaje, PROMPT_FULL, ejecutarFactoriaPeones, llamarMultiplexadorFree } = require('./agent');
const { cargarMemoriaReciente } = require('./memory');
const { getCpuLoad } = require('../scripts/resource-governor');

const { enviarAlerta } = require('./notifications');

const PENDING_DIR = path.join(__dirname, '../brain/PENDING_DTS');
const BLOCKER_DIR = path.join(__dirname, '../brain/BLOCKERS');
const OPERATIONS_DASHBOARD = path.join(__dirname, '../brain/SICC_OPERATIONS.md');
const DREAMS_FILE = path.join(__dirname, '../data/brain/DREAMS.md');
const NOTEBOOK_THOUGHTS = path.join(__dirname, '../docs/pensamientos notebooklm.txt');

if (!fs.existsSync(PENDING_DIR)) fs.mkdirSync(PENDING_DIR, { recursive: true });
if (!fs.existsSync(BLOCKER_DIR)) fs.mkdirSync(BLOCKER_DIR, { recursive: true });

async function ejecutarSueno(especialidad) {
    console.log(`[DREAMER] 🌙 Iniciando ciclo de sueño para: ${especialidad}`);
    
    const pensamientosBase = fs.existsSync(NOTEBOOK_THOUGHTS) 
        ? fs.readFileSync(NOTEBOOK_THOUGHTS, 'utf8').substring(0, 5000) 
        : '';

    try {
        // 🏭 FASE 0: FACTORÍA DE PEONES (Minería Paralela)
        console.log(`[DREAMER] 🏭 Activando Factoría de Peones para extraer ADN contractual...`);
        const factoryReport = await ejecutarFactoriaPeones(especialidad, pensamientosBase);
        
        let hipotesisActual = `Revisión forense de la especialidad: ${especialidad}.\n\n` +
                              `${factoryReport}\n\n` +
                              `Objetivo: Eliminar impurezas Nivel 16 y optimizar CAPEX mediante N-1.`;

        const numPasses = parseInt(process.env.KARPATHY_PASSES) || 5; 
    
    // 🔄 BUCLE DE KARPATHY (PEONES FREE)
    for (let i = 1; i <= numPasses; i++) {
        console.log(`[DREAMER] 🧬 Iteración ${i}/${numPasses} (Modo Peón)...`);
        
        const load = getCpuLoad();
        if (load > 2.0 && i > 5) {
            console.warn(`[DREAMER] ⚠️ Carga extrema (${Math.round(load*100)}%). Deteniendo en iteración ${i}.`);
            break;
        }
        
        const promptIteracion = `
        [LOOP DE SUEÑO - PEÓN - ITERACIÓN ${i}]
        Sintetiza y limpia la propuesta actual eliminando redundancias y "grasa" técnica.
        Propuesta actual: ${hipotesisActual}
        `;

        // USAMOS EL MULTIPLEXOR FREE PARA LAS ITERACIONES (COSTO $0)
        const { texto: refinamiento, proveedor } = await llamarMultiplexadorFree(promptIteracion, null, "Responde solo con la propuesta mejorada.");
        console.log(`[DREAMER] ✅ Iteración ${i} completada via: ${proveedor.toUpperCase()}`);
        hipotesisActual = refinamiento;
        await new Promise(r => setTimeout(r, 1000));
    }

    // 🧠 FASE DE ASESOR (RAZONAMIENTO PROFUNDO)
    console.log(`[DREAMER] 🏛️ Invocando al ASESOR para decantación final...`);
    const promptAsesor = `
    [DECANTACIÓN SICC - ASESOR]
    Has recibido el trabajo de los peones. Tu misión es dar el veredicto final.
    Basado en:
    ---
    ${pensamientosBase}
    ---
    Propuesta procesada: ${hipotesisActual}
    
    TAREA: 
    1. Si hay una contradicción insalvable con el Contrato L1 o la Sec 1.2(d), responde iniciando con "BLOCKER: [Motivo]".
    2. Si es coherente, genera la Decisión Técnica final.
    `;

    const { texto: finalVeredict, proveedor } = await procesarMensaje(promptAsesor, null);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    if (finalVeredict.includes('BLOCKER:')) {
        const safeSubject = especialidad.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
        const blockerFileName = `BLOCKER-${safeSubject}-${timestamp}.md`;
        const blockerPath = path.join(BLOCKER_DIR, blockerFileName);
        
        const blockerDoc = `
# 🚨 BLOQUEO DE RAZONAMIENTO SICC
**Especialidad:** ${especialidad}
**Origen:** Dreamer v8.7 asimétrico
**Veredicto del Asesor (${proveedor}):**
${finalVeredict}

## Contexto para Diego:
Los peones intentaron resolver esto durante ${numPasses} iteraciones pero el Asesor identificó un punto ciego contractual o técnico irresoluble.
        `;
        fs.writeFileSync(blockerPath, blockerDoc);
        
        // Actualizar Dashboard y Notificar
        await actualizarDashboard(especialidad, '🚨 BLOCKER', finalVeredict);
        await enviarAlerta(`🚨 *SICC BLOCKER DETECTADO*\n\n*Especialidad:* ${especialidad}\n\n${finalVeredict.substring(0, 500)}...`);
        return;
    }

    // 🏺 DECANTACIÓN FINAL
    const safeSubject = especialidad.replace(/[^a-z0-9]/gi, '_').substring(0, 100);
    const fileName = `DT-DREAM-${safeSubject}-${timestamp}.md`;
    const finalPath = path.join(PENDING_DIR, fileName);

    const docFinal = `
# 🏺 DECISIÓN TÉCNICA DECANTADA (SICC DREAMER v6.5)
**Especialidad:** ${especialidad}
**Iteraciones:** 5 (Karpathy Loop)
**Estado:** PENDIENTE FIRMA JURÍDICA

## 🏛️ Propuesta Soberana (Michelin Certified)
${finalVeredict}

---
*Generado autónomamente durante el ciclo de sueño SICC.*
`;

    fs.writeFileSync(finalPath, docFinal);
    console.log(`[DREAMER] ✅ Sueño decantado en: ${fileName}`);

    // Actualizar Dashboard y Notificar
    await actualizarDashboard(especialidad, '✅ ÉXITO', fileName);
    await enviarAlerta(`🏺 *SICC DT GENERADA*\n\n*Especialidad:* ${especialidad}\n*Archivo:* \`${fileName}\``);
    } catch (err) {
        console.error(`[DREAMER] ❌ Error fatal en ciclo de sueño: ${err.message}`);
        await actualizarDashboard(especialidad, '🚨 ERROR FATAL', err.message);
        await enviarAlerta(`🚨 *ERROR FATAL EN DREAMER*\n\n*Especialidad:* ${especialidad}\n\n*Error:* ${err.message}`);
    }
}

/**
 * Mantiene el dashboard de operaciones sincronizado
 */
async function actualizarDashboard(especialidad, estado, detalle) {
    if (!fs.existsSync(OPERATIONS_DASHBOARD)) return;
    
    let content = fs.readFileSync(OPERATIONS_DASHBOARD, 'utf8');
    const timestamp = new Date().toLocaleString();

    if (estado.includes('BLOCKER')) {
        const blockerEntry = `- **${especialidad}** (${timestamp}): ${detalle.substring(0, 100)}...`;
        content = content.replace('## 🚨 BLOCKERS ACTIVOS (Juicio de Diego Requerido)\n*No hay bloqueos activos en este momento.*', `## 🚨 BLOCKERS ACTIVOS (Juicio de Diego Requerido)\n${blockerEntry}`);
    } else {
        const dtEntry = `- [ ] [${especialidad} - ${timestamp}](file:///home/administrador/docker/agente/brain/PENDING_DTS/${detalle})`;
        content = content.replace('## 🏺 DECISIONES TÉCNICAS (PENDIENTES DE FIRMA)', `## 🏺 DECISIONES TÉCNICAS (PENDIENTES DE FIRMA)\n${dtEntry}`);
    }

    // Actualizar sección de estado de factoría
    const factorySection = `## 🧬 ESTADO DE LA FACTORÍA (Última Carrera)\n- **Tema:** ${especialidad}\n- **Estado:** ${estado}\n- **Fecha:** ${timestamp}`;
    content = content.replace(/## 🧬 ESTADO DE LA FACTORÍA \(Última Carrera\)\n[\s\S]*?\n\n/g, factorySection + '\n\n');

    fs.writeFileSync(OPERATIONS_DASHBOARD, content);
}

// Exportar para el cron
module.exports = { ejecutarSueno };

// Si se ejecuta directamente
if (require.main === module) {
    const target = process.argv[2] || 'Ingeniería de Sistemas';
    ejecutarSueno(target).catch(console.error);
}
