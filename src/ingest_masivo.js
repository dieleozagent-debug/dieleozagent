// ingest_masivo.js — Motor de Ingesta Michelin v7.2.0 (Protocolo Forense Recursivo con Lock)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./config');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const DATA_DIR = process.argv[2] || '/app/Contrato pdf';
const BATCH_SIZE = 10;
const LOCK_FILE = '/tmp/ingest_masivo.lock';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const MAX_BUF = 50 * 1024 * 1024;

/**
 * Busca todos los archivos PDF de forma recursiva.
 */
function getAllPdfs(dir, files = []) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            getAllPdfs(fullPath, files);
        } else if (file.toLowerCase().endsWith('.pdf')) {
            files.push(fullPath);
        }
    }
    return files;
}

async function run() {
    // 1. Verificar LOCK para evitar colisiones
    if (fs.existsSync(LOCK_FILE)) {
        console.error(`[LOCK-ERROR] ⛔ Ya existe un proceso de ingesta activo (${LOCK_FILE}). Abortando.`);
        process.exit(0); // Exit gracefully to not alert cron
    }
    fs.writeFileSync(LOCK_FILE, process.pid.toString());

    try {
        console.log(`[MICHELIN-INGEST] 🚀 Iniciando Protocolo Forense v7.2.0 (Recursivo) en: ${DATA_DIR}`);
        
        if (!fs.existsSync(DATA_DIR)) {
            console.error(`[SICC FAIL] Directorio no encontrado: ${DATA_DIR}`);
            process.exit(1);
        }

        const archivos = getAllPdfs(DATA_DIR);
        console.log(`[MICHELIN-INGEST] 📂 Encontrados ${archivos.length} archivos para procesamiento.`);

        for (const fullPath of archivos) {
            const archivo = path.basename(fullPath);
            const checkpointFile = fullPath + '.checkpoint';
            console.log(`\n📄 [PROTOCOLO-RECURSIVO] Procesando: ${archivo}...`);
            
            let startFrom = 1;
            if (fs.existsSync(checkpointFile)) {
                startFrom = parseInt(fs.readFileSync(checkpointFile, 'utf8')) + 1;
                console.log(`   📝 Checkpoint detectado. Reanudando desde página ${startFrom}.`);
            }

            try {
                const info = execSync(`pdfinfo "${fullPath}"`, { maxBuffer: MAX_BUF }).toString();
                const pagesMatch = info.match(/Pages:\s+(\d+)/);
                const totalPages = pagesMatch ? parseInt(pagesMatch[1]) : 0;
                console.log(`   📊 Documento con ${totalPages} páginas.`);

                if (totalPages === 0 || startFrom > totalPages) {
                    console.log(`   ⏭️ Saltando documento (ya procesado o vacío).`);
                    continue;
                }

                for (let startPage = startFrom; startPage <= totalPages; startPage += BATCH_SIZE) {
                    const endPage = Math.min(startPage + BATCH_SIZE - 1, totalPages);
                    
                    // AISLAMIENTO: Crear carpeta única para este lote
                    const batchId = `batch_${startPage}_${Date.now()}`;
                    const batchDir = path.join('/tmp', batchId);
                    fs.mkdirSync(batchDir, { recursive: true });

                    const tempImgBase = path.join(batchDir, 'page');
                    
                    console.log(`\n   💠 [LOTE] Páginas ${startPage} a ${endPage}...`);

                    try {
                        // 1. PDF -> Imágenes
                        execSync(`/usr/bin/pdftoppm -f ${startPage} -l ${endPage} -r 300 -png "${fullPath}" "${tempImgBase}"`, { maxBuffer: MAX_BUF });
                        
                        const images = fs.readdirSync(batchDir)
                            .filter(f => f.endsWith('.png'))
                            .sort((a, b) => {
                                const numA = parseInt(a.match(/\d+/)[0]);
                                const numB = parseInt(b.match(/\d+/)[0]);
                                return numA - numB;
                            });

                        for (let j = 0; j < images.length; j++) {
                            const img = images[j];
                            const imgPath = path.join(batchDir, img);
                            const outBase = path.join(batchDir, `${img}_ocr`);
                            const pageNum = startPage + j;

                            try {
                                // 2. Imagen -> OCR
                                execSync(`/usr/bin/tesseract "${imgPath}" "${outBase}" -l spa`, { maxBuffer: MAX_BUF });
                                const textoHoja = fs.readFileSync(`${outBase}.txt`, 'utf8').trim();
                                
                                if (textoHoja.length > 50) {
                                    // 3. OCR -> DB (Chequeo de duplicados por contenido simple si fuera necesario)
                                    const fragmentos = textoHoja.split('\n\n').filter(f => f.trim().length > 50);
                                    console.log(`      📄 Pág ${pageNum}: ${fragmentos.length} fragmentos...`);
                                    
                                    for (const fragmento of fragmentos) {
                                        try {
                                            const vector = await obtenerEmbedding(fragmento);
                                            await insertarFragmento(`[BIBLIA-LEGAL] ${archivo}`, fragmento, vector);
                                            process.stdout.write('.');
                                            await sleep(1000); 
                                        } catch (e) {
                                            console.error(`\n      [SICC WARN] Error en pág ${pageNum}: ${e.message}`);
                                        }
                                    }
                                }
                            } catch (err) {
                                console.error(`\n      [SICC FAIL] Fallo en página ${pageNum}: ${err.message}`);
                            }
                        }
                        
                        // [SICC OK] GUARDAR CHECKPOINT tras éxito de lote
                        fs.writeFileSync(checkpointFile, endPage.toString());
                        console.log(`\n   💾 Checkpoint actualizado: pág ${endPage}`);

                        fs.rmSync(batchDir, { recursive: true, force: true });
                        
                    } catch (err) {
                        console.error(`\n   [SICC WARN] Error en lote ${startPage}-${endPage}: ${err.message}`);
                        if (fs.existsSync(batchDir)) fs.rmSync(batchDir, { recursive: true, force: true });
                    }
                }
                console.log(`\n   [SICC OK] ${archivo} finalizado.`);
                
            } catch (err) {
                console.error(`\n   💀 Error estructural en ${archivo}: ${err.message}`);
            }
        }
    } finally {
        // 4. Liberar LOCK
        if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
        console.log('\n[MICHELIN-INGEST] 🏆 Ingesta masiva finalizada y lock liberado.');
        await pool.end();
    }
}

run().catch(err => {
    console.error(err);
    if (fs.existsSync(LOCK_FILE)) fs.unlinkSync(LOCK_FILE);
    process.exit(1);
});
