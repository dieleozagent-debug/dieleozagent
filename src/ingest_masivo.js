// ingest_masivo.js — Motor de Ingesta Michelin v6.6.0 (Protocolo Forense Hoja a Hoja)
'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./config');
const { obtenerEmbedding, insertarFragmento, pool } = require('./supabase');

const DATA_DIR = process.argv[2] || '/app/Contrato pdf';
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
    console.log(`[MICHELIN-INGEST] 🚀 Iniciando Protocolo Forense v6.6.0 en: ${DATA_DIR}`);
    
    if (!fs.existsSync(DATA_DIR)) {
        console.error(`❌ Directorio no encontrado: ${DATA_DIR}`);
        process.exit(1);
    }

    const archivos = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.pdf'));
    console.log(`[MICHELIN-INGEST] 📂 Encontrados ${archivos.length} archivos para procesamiento hoja a hoja.`);

    for (const archivo of archivos) {
        console.log(`\n📄 [PROTOCOLO-HOJA] Procesando: ${archivo}...`);
        const fullPath = path.join(DATA_DIR, archivo);
        const nombreBase = path.basename(archivo, '.pdf');
        const tempImgBase = `/tmp/${nombreBase}_michelin`;

        try {
            // 1. PDF -> Imágenes (300 DPI para máxima fidelidad)
            console.log(`   📸 Convirtiendo PDF a imágenes de alta resolución...`);
            execSync(`/usr/bin/pdftoppm -r 300 -png "${fullPath}" "${tempImgBase}"`);
            
            const images = fs.readdirSync('/tmp')
                .filter(f => f.startsWith(path.basename(tempImgBase)))
                .sort((a, b) => {
                    const numA = parseInt(a.match(/\d+/)[0]);
                    const numB = parseInt(b.match(/\d+/)[0]);
                    return numA - numB;
                });

            console.log(`   🔍 Detectadas ${images.length} hojas. Iniciando OCR y Embeddings...`);

            for (let i = 0; i < images.length; i++) {
                const img = images[i];
                const imgPath = path.join('/tmp', img);
                const outBase = `/tmp/${img}_ocr`;

                try {
                    // 2. Imagen -> OCR
                    execSync(`/usr/bin/tesseract "${imgPath}" "${outBase}" -l spa`);
                    const textoHoja = fs.readFileSync(`${outBase}.txt`, 'utf8').trim();
                    
                    if (textoHoja.length > 50) {
                        // 3. OCR -> DB (con Embeddings)
                        const fragmentos = textoHoja.split('\n\n').filter(f => f.trim().length > 50);
                        
                        for (const fragmento of fragmentos) {
                            try {
                                const vector = await obtenerEmbedding(fragmento);
                                await insertarFragmento(`[BIBLIA-LEGAL] ${archivo}`, fragmento, vector);
                                process.stdout.write('.');
                                
                                // 4. Espera estratégica (Rate Limit protection)
                                await sleep(1500); 
                            } catch (e) {
                                console.error(`\n   ⚠️ Error en fragmento de hoja ${i+1}: ${e.message}`);
                            }
                        }
                    }
                    
                    // Limpieza parcial
                    fs.unlinkSync(imgPath);
                    fs.unlinkSync(`${outBase}.txt`);
                    
                } catch (err) {
                    console.error(`\n   ❌ Fallo en hoja ${i+1} de ${archivo}: ${err.message}`);
                }
            }
            console.log(`\n   ✅ ${archivo} finalizado con éxito.`);
            
        } catch (err) {
            console.error(`\n   💀 Error crítico en el protocolo para ${archivo}: ${err.message}`);
        }
    }

    console.log('\n[MICHELIN-INGEST] 🏆 Biblia Legal totalmente integrada bajo protocolo forense.');
    await pool.end();
}

run().catch(console.error);
