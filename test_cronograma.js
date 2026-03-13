const fs = require('fs');

const wbsDataStr = fs.readFileSync('/home/administrador/docker/LFC2/IX. WBS y Planificacion/wbs_presupuestal_datos.js', 'utf8').replace('const wbsDataPresupuestal =', 'module.exports =');
fs.writeFileSync('/tmp/wbs_temp.js', wbsDataStr);
const wbsData = require('/tmp/wbs_temp.js');

const cronoDataStr = fs.readFileSync('/home/administrador/docker/LFC2/IX. WBS y Planificacion/cronograma_datos.js', 'utf8').replace('window.cronogramaData =', 'const cData =');
fs.writeFileSync('/tmp/crono_temp.js', cronoDataStr + '\nmodule.exports = cData;');
const cronoData = require('/tmp/crono_temp.js');

// Mapeo L1 a Fases
function mapL1toFases(wbs) {
    const l3ToFases = wbs.map(item => {
        let faseId = 'F4'; // Por defecto instalación primaria
        let color = '#3a7bd5';
        
        switch(item.capitulo) {
            case '1': faseId = 'F4'; color = '#00d2ff'; break; // Control
            case '2': faseId = 'F4'; color = '#3a7bd5'; break; // Telecom
            case '3': faseId = 'F5'; color = '#92fe9d'; break; // ITS
            case '4': faseId = 'F5'; color = '#00c9ff'; break; // PaN
            case '5': faseId = 'F3'; color = '#f093fb'; break; // CCO (Obra)
            case '6': faseId = 'F2'; color = '#f5576c'; break; // Material Rodante (Compras)
        }
        
        if (item.tipo === 'SERVICIO' && item.descripcion.toLowerCase().includes('ingeniería')) faseId = 'F1';
        if (item.tipo === 'SERVICIO' && item.descripcion.toLowerCase().includes('prueba')) faseId = 'F6';
        if (item.tipo === 'SERVICIO' && item.descripcion.toLowerCase().includes('capacitación')) faseId = 'F7';
        
        return {
            id: item.item,
            nombre: item.descripcion,
            faseId: faseId,
            capitulo: item.capitulo,
            color: color
        }
    });

    console.log("Muestras de asignación L3 a Fases:");
    console.log(l3ToFases.slice(0, 3));
    
    // Contar L3 por fase
    const conteo = {};
    l3ToFases.forEach(i => {
        conteo[i.faseId] = (conteo[i.faseId] || 0) + 1;
    });
    console.log("\nÍtems L3 por Fase:", conteo);
}

mapL1toFases(wbsData);
