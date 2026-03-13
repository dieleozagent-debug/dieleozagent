const fs = require('fs');
const file = '/home/administrador/docker/LFC2/IX. WBS y Planificacion/WBS_Presupuesto_SCC_APP_La_Dorada_Chiriguana.html';

let content = fs.readFileSync(file, 'utf8');

// Fragmento original
const targetStr = `
                // AIU = 0.33 Ã— OBRA (solo OBRA)
                const administracion = cap.OBRA * 0.23;
                const imprevistos = cap.OBRA * 0.05;
                const utilidad = cap.OBRA * 0.05;
                const aiuCap = administracion + imprevistos + utilidad;
                totalAIU += aiuCap;
                
                // IVA = 0.19 Ã— SUM + 0.19 Ã— SERV + 0.19 Ã— (0.05 Ã— OBRA)
                const ivaSuministros = cap.SUMINISTRO * 0.19;
                const ivaServicios = cap.SERVICIO * 0.19;
                const ivaUtilidad = cap.OBRA * 0.05 * 0.19; // IVA sobre utilidad de OBRA
                const ivaCap = ivaSuministros + ivaServicios + ivaUtilidad;
                totalIVA += ivaCap;
                
                // Guardar por capítulo
                capitulos[capitulo] = {
                    suministros: cap.SUMINISTRO,
                    obraCivil: cap.OBRA,
                    servicios: cap.SERVICIO,
                    costoDirecto: cd,
                    administracion: administracion,
                    imprevistos: imprevistos,
                    utilidad: utilidad,
                    aiu: aiuCap,
                    ivaSuministros: ivaSuministros,
                    ivaServicios: ivaServicios,
                    ivaUtilidad: ivaUtilidad,
                    iva: ivaCap,
                    total: cd + aiuCap + ivaCap
                };`.trim();

// Fragmento de reemplazo
const replStr = `
                // AIU = 0.33 Ã— OBRA (solo OBRA)
                const administracion = Math.round(cap.OBRA * 0.23);
                const imprevistos = Math.round(cap.OBRA * 0.05);
                const utilidad = Math.round(cap.OBRA * 0.05);
                const aiuCap = administracion + imprevistos + utilidad;
                totalAIU += aiuCap;
                
                // IVA = 0.19 Ã— SUM + 0.19 Ã— SERV + 0.19 Ã— (0.05 Ã— OBRA)
                const ivaSuministros = Math.round(cap.SUMINISTRO * 0.19);
                const ivaServicios = Math.round(cap.SERVICIO * 0.19);
                const ivaUtilidad = Math.round(cap.OBRA * 0.05 * 0.19); // IVA sobre utilidad de OBRA
                const ivaCap = ivaSuministros + ivaServicios + ivaUtilidad;
                totalIVA += ivaCap;
                
                // Guardar por capítulo
                capitulos[capitulo] = {
                    suministros: cap.SUMINISTRO,
                    obraCivil: cap.OBRA,
                    servicios: cap.SERVICIO,
                    costoDirecto: cd,
                    administracion: administracion,
                    imprevistos: imprevistos,
                    utilidad: utilidad,
                    aiu: aiuCap,
                    ivaSuministros: ivaSuministros,
                    ivaServicios: ivaServicios,
                    ivaUtilidad: ivaUtilidad,
                    iva: ivaCap,
                    total: Math.round(cd + aiuCap + ivaCap)
                };`.trim();

if (content.includes(targetStr)) {
    content = content.replace(targetStr, replStr);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Reemplazo de Math.round() ejecutado exitosamente.");
} else {
    console.log("ERROR: Fragmento objetivo no encontrado. El texto podría tener variaciones.");
}
