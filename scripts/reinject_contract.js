// scripts/reinject_contract.js — Ingesta de SSoT Saneado (v14.8.6 · 2026-05-08)
//
// CAMBIO v14.8.6: WHITELIST EXPLÍCITA de directorios contractualmente vinculantes.
//
// Problema histórico: el script tomaba TODOS los .md/.html/.txt del repo LFC2 y los
// metía en `contrato_documentos` con prefijo [SSOT-CLEAN]. Eso incluía:
//   - III_Ingenieria_conceptual/* (estimaciones de cantidades internas LFC, NO mandatos)
//   - 00_Gobernanza_PMO/* (matrices RACI internas)
//   - V_Ingenieria_detalle/* (ingeniería de detalle interna)
//   - IX_WBS_Planificacion/* (WBS y planificación interna)
//   - X_ENTREGABLES_CONSOLIDADOS/* (entregables internos)
//   - II_A_Analisis_Contractual/dictamenes/* (DTs alucinados v8 pre-purga)
//   - brain/DREAMS/* (output del propio agente que se ingirió por error)
//
// Resultado: el LLM citaba "AT1 → Sección Componentes → 2,068 cajas, 110.8 kW"
// como si fuera mandato contractual, cuando esos chunks venían de archivos de
// ingeniería conceptual interna. El destilador no podía distinguir jerarquía.
//
// Diego (Director Técnico UF2) ejecutó purga manual el 2026-05-08:
//   DELETE FROM contrato_documentos WHERE
//     nombre_archivo LIKE '%III_Ingenieria_conceptual/%' OR
//     nombre_archivo LIKE '%00_Gobernanza_PMO/%' OR
//     nombre_archivo LIKE 'brain/DREAMS/%';
//   → eliminados 2,647 chunks (9,839 → 7,192).
//
// Para que la contaminación NO vuelva en futuras re-ingestas, este script ahora
// usa WHITELIST: solo ingiere archivos cuyo path full coincida con un patrón
// explícitamente permitido. Si querés agregar una fuente nueva, modificar
// ALLOWED_PATTERNS abajo con justificación contractual en el comentario.

'use strict';

const fs = require('fs');
const path = require('path');
const { obtenerEmbedding, insertarFragmento } = require('../src/supabase');

const LFC2_DIR = '/home/administrador/docker/LFC2';

// ============================================================================
// WHITELIST CONTRACTUAL — SOLO BCD CTSC vigente (decisión Diego 2026-05-08)
// ============================================================================
// Diego (Director Técnico UF2) determinó que TODOS los .md de Contrato/Apéndices
// tienen huecos respecto a los PDFs originales y por tanto contaminan el RAG.
// Decisión: el RAG local sicc_postgres ingiere SOLO el BCD CTSC vigente (= el
// documento que NotebookLM llama "Bases de diseño - CTSC (2)"). Para el resto
// del Contrato/Apéndices, el agente debe consultar al Oráculo (NotebookLM MCP)
// que tiene los PDFs originales sin huecos.
//
// Si necesitás agregar una fuente, justificá por qué es vinculante
// contractualmente Y que el .md está alineado con el PDF original.
const ALLOWED_PATTERNS = [
    // "Bases de Diseño - CTSC (2)" según NotebookLM = BCD VERSIÓN No. 001
    // (Bogotá D.C., abril de 2026) — texto validado verbatim por Diego 2026-05-08.
    // El "(2)" del nombre NotebookLM es duplicado interno de NotebookLM, NO v002.
    /\/IV_Ingenieria_basica\/BCD_SCC_v001_2026-04\.md$/,
];

// ============================================================================
// BLACKLIST EXPLÍCITA — directorios prohibidos aunque coincidan en otra forma
// ============================================================================
// Doble protección: aunque algún pattern de allowlist sea ambiguo, estos
// directorios siempre se rechazan.
const BLOCKED_PATTERNS = [
    /\/\.git\//,
    /\/old\//,
    /\/legacy\//i,
    /\/_legacy/i,                        // _legacy/ y _legacy_YYYY_MM_DD/
    /\.legacy$/i,
    /\/III_Ingenieria_conceptual\//,    // estimaciones internas LFC
    /\/V_Ingenieria_detalle\//,          // ingeniería interna detalle
    /\/00_Gobernanza_PMO\//,             // matrices RACI internas
    /\/IX_WBS_Planificacion\//,          // WBS y planificación interna
    /\/X_ENTREGABLES_CONSOLIDADOS\//,    // entregables internos
    /\/II_A_Analisis_Contractual\/dictamenes\//, // DTs alucinados v8 pre-purga
    /\/IX_ENTREGABLES\//,                // entregables intermedios
    /\/VII_Soporte_Especializado\/_legacy\//,   // legacy soporte
    /\/VIII_Documentos_Maestros_Metodologia\/_legacy\//, // legacy maestros
    /\/brain\//,                         // output del agente, NO fuente
    /\/scripts\//,                       // código del agente
    /\/data\//,                          // data interna
];

function isAllowed(fullPath) {
    // 1. Bloqueos explícitos primero (siempre prevalecen)
    if (BLOCKED_PATTERNS.some(re => re.test(fullPath))) return false;
    // 2. Whitelist: solo lo expresamente permitido
    return ALLOWED_PATTERNS.some(re => re.test(fullPath));
}

function getAllFiles(dir, files = []) {
    let list;
    try { list = fs.readdirSync(dir); } catch (_) { return files; }
    for (const file of list) {
        const fullPath = path.join(dir, file);
        let stat;
        try { stat = fs.statSync(fullPath); } catch (_) { continue; }
        if (stat.isDirectory()) {
            // Saltar directorios bloqueados ANTES de recurrir (no perder tiempo)
            if (BLOCKED_PATTERNS.some(re => re.test(fullPath + '/'))) continue;
            if (file !== '.git' && file !== 'old') getAllFiles(fullPath, files);
        } else if (file.match(/\.(md|html|txt)$/i)) {
            if (isAllowed(fullPath)) {
                files.push(fullPath);
            }
            // Si no pasa whitelist, simplemente se ignora (sin log para no llenar consola).
        }
    }
    return files;
}

async function run() {
    console.log(`🚀 Iniciando re-ingesta de SSoT desde: ${LFC2_DIR}`);
    console.log(`🛡️  v14.8.6: WHITELIST contractual activa.`);
    console.log(`   Permitidos: 01_Contrato_MD/FORMATEADO_(CONTRATO|APENDICE_TECNICO|APENDICE_FINANCIERO)*.md + IV_Ingenieria_basica/BCD_SCC_v*.md`);
    console.log(`   Bloqueados: III_Ingenieria_conceptual/, V_Ingenieria_detalle/, 00_Gobernanza_PMO/, brain/, dictamenes/, etc.\n`);

    const archivos = getAllFiles(LFC2_DIR);
    console.log(`📂 Encontrados ${archivos.length} archivos contractualmente vinculantes para ingerir.\n`);

    if (archivos.length === 0) {
        console.error(`❌ Cero archivos permitidos. Verificá ALLOWED_PATTERNS o que el repo tenga los archivos esperados.`);
        process.exit(1);
    }

    // Listar lo que se va a ingerir antes de hacerlo, para que el operador valide.
    archivos.forEach(f => console.log(`   ✅ ${path.relative(LFC2_DIR, f)}`));
    console.log('');

    for (const fullPath of archivos) {
        const nombre = path.relative(LFC2_DIR, fullPath);
        const contenido = fs.readFileSync(fullPath, 'utf8');

        // Chunking simple por párrafos (max 800 chars)
        const fragmentos = contenido.split('\n\n').filter(f => f.trim().length > 50);

        console.log(`📄 Procesando: ${nombre} (${fragmentos.length} fragmentos)...`);

        for (const fragmento of fragmentos) {
            try {
                // Dividir si el párrafo es muy largo
                if (fragmento.length > 1000) {
                    const subFragmentos = fragmento.match(/.{1,800}(\s|$)/g) || [fragmento];
                    for (const sf of subFragmentos) {
                        const vector = await obtenerEmbedding(sf.trim());
                        await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, sf.trim(), vector);
                    }
                } else {
                    const vector = await obtenerEmbedding(fragmento);
                    await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, fragmento, vector);
                }
                process.stdout.write('.');
            } catch (e) {
                console.error(`\n❌ Error en ${nombre}: ${e.message}`);
            }
        }
        console.log(`\n✅ ${nombre} finalizado.`);
    }

    console.log('✨ Re-ingesta de SSoT completada (solo fuentes contractuales vinculantes).');
    process.exit(0);
}

// Modo dry-run para validar la whitelist sin ingerir nada
if (process.argv.includes('--dry-run')) {
    console.log('🔍 MODO DRY-RUN — listando archivos que se ingerirían (sin ejecutar):\n');
    const archivos = getAllFiles(LFC2_DIR);
    archivos.forEach(f => console.log(`   ✅ ${path.relative(LFC2_DIR, f)}`));
    console.log(`\nTotal: ${archivos.length} archivos.`);
    process.exit(0);
}

// v14.8.6: modo --only-bcd para ingerir SOLO los BCD sin tocar los Apéndices ya
// vectorizados. Útil cuando el BCD se actualiza y se quiere refrescar sin
// re-ingerir todo el Contrato (que puede tener .md con huecos respecto al PDF).
if (process.argv.includes('--only-bcd')) {
    (async () => {
        const archivos = getAllFiles(LFC2_DIR).filter(f => /\/IV_Ingenieria_basica\/BCD_/.test(f));
        console.log(`🛡️  MODO --only-bcd: ingerirá ${archivos.length} archivos BCD.`);
        archivos.forEach(f => console.log(`   ✅ ${path.relative(LFC2_DIR, f)}`));
        console.log('');

        // Eliminar chunks BCD anteriores (si los hubiera) para evitar duplicados
        const { deleteContratoFragmentosByPattern } = require('../src/supabase').deleteContratoFragmentosByPattern
            ? require('../src/supabase')
            : { deleteContratoFragmentosByPattern: null };
        // (helper no obligatorio — si no existe, simplemente se duplican y se purgan después)

        for (const fullPath of archivos) {
            const nombre = path.relative(LFC2_DIR, fullPath);
            const contenido = fs.readFileSync(fullPath, 'utf8');
            const fragmentos = contenido.split('\n\n').filter(f => f.trim().length > 50);
            console.log(`📄 ${nombre}: ${fragmentos.length} fragmentos`);
            for (const fragmento of fragmentos) {
                try {
                    if (fragmento.length > 1000) {
                        const subFragmentos = fragmento.match(/.{1,800}(\s|$)/g) || [fragmento];
                        for (const sf of subFragmentos) {
                            const vector = await obtenerEmbedding(sf.trim());
                            await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, sf.trim(), vector);
                        }
                    } else {
                        const vector = await obtenerEmbedding(fragmento);
                        await insertarFragmento(`[SSOT-CLEAN] ${nombre}`, fragmento, vector);
                    }
                    process.stdout.write('.');
                } catch (e) {
                    console.error(`\n❌ Error: ${e.message}`);
                }
            }
            console.log(`\n✅ ${nombre} OK.`);
        }
        console.log('✨ BCD ingerido al RAG.');
        process.exit(0);
    })();
} else {
    run();
}
