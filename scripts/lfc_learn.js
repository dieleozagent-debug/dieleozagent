/**
 * SICC AUTO-LEARNING (v1.0.0)
 * Automates the mapping of the physical repository to the Virtual Web Root.
 */

const fs = require('fs');
const path = require('path');

const REPO_ROOT = '/home/administrador/docker/LFC2';
const DIRS_TO_INDEX = [
    'IV_Ingenieria_basica',
    'V_Ingenieria_detalle',
    'VII_Soporte_Especializado',
    'III_Ingenieria_conceptual'
];

function generateIndex(dirPath, files) {
    const dirName = path.basename(dirPath);
    const indexPath = path.join(dirPath, 'index.html');
    if (!fs.existsSync(indexPath)) {
        console.log(`[LEARNING] Generating portal for directory: ${dirName}`);
        const fileList = files
            .filter(f => !f.startsWith('.') && f !== 'index.html')
            .map(f => `<li><a href="${f}">${f}</a></li>`)
            .join('\n');
        
        const template = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>SICC - ${dirName}</title><style>body { background: #0a192f; color: #e6f1ff; font-family: sans-serif; padding: 4rem; line-height: 1.6; } a { color: #ffd700; text-decoration: none; } h1 { letter-spacing: -1px; margin-bottom: 2rem; } ul { list-style: none; } li { margin-bottom: 1rem; padding: 1rem; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); border-left: 4px solid #ffd700; transition: 0.3s; } li:hover { transform: translateX(10px); background: rgba(255,255,255,0.06); }</style></head><body><a href="/">← Inicio</a><h1 style="margin-top:2rem;">Explorador Red Vital: ${dirName}</h1><ul>${fileList}</ul></body></html>`;
        fs.writeFileSync(indexPath, template);
    }
}

function scanDir(dirPath, baseDir = "") {
    const items = fs.readdirSync(dirPath);
    let rewrites = [];

    // Generate index if missing
    generateIndex(dirPath, items);

    items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stats = fs.statSync(fullPath);
        const relativePath = path.join(baseDir, item);

        if (stats.isDirectory() && !item.startsWith('.')) {
            rewrites = rewrites.concat(scanDir(fullPath, relativePath));
        } else if (item.endsWith('.md') || item.endsWith('.html')) {
            rewrites.push({
                "source": `/${item}`,
                "destination": `/${baseDir}/${item}`.replace(/\\/g, '/')
            });
        }
    });
    return rewrites;
}

function learn() {
    console.log("🧠 SICC Brain: Learning RECURSIVE repository mapping...");
    let allRewrites = [
        { "source": "/", "destination": "/IX_WBS_Planificacion/WBS_COMPLETA_TODO_Interactiva_v4_0.html" },
        { "source": "/wbs", "destination": "/IX_WBS_Planificacion/WBS_COMPLETA_TODO_Interactiva_v4_0.html" },
        { "source": "/entregables", "destination": "/X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/INDICE_Documentos_Servidos.html" },
        { "source": "/master", "destination": "/X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/SISTEMA_01_Control_y_Senalizacion_EJECUTIVO.html" }
    ];

    const dirsToIndex = [
        '00_Gobernanza_PMO',
        'III_Ingenieria_conceptual',
        'IV_Ingenieria_basica',
        'V_Ingenieria_detalle',
        'VII_Soporte_Especializado',
        'VI_Operacion_Mantenimiento_Reversion'
    ];

    dirsToIndex.forEach(d => {
        const p = path.join(REPO_ROOT, d);
        if (fs.existsSync(p)) {
            allRewrites = allRewrites.concat(scanDir(p, d));
        }
    });

    const vercelConfig = {
        "version": 2,
        "name": "lfc-2",
        "public": true,
        "rewrites": allRewrites,
        "cleanUrls": true,
        "trailingSlash": false
    };

    fs.writeFileSync(path.join(REPO_ROOT, 'vercel.json'), JSON.stringify(vercelConfig, null, 2));
    console.log(`✅ SICC Brain: Learned ${allRewrites.length} routes recursive. vercel.json updated.`);
}

learn();
