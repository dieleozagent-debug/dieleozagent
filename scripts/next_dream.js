// scripts/next_dream.js — Selector inteligente de misiones SICC v8.6
'use strict';

const fs = require('fs');
const path = require('path');

const DREAMS_PATH = path.join(__dirname, '../brain/DREAMS.md');

function getNextDream() {
    if (!fs.existsSync(DREAMS_PATH)) {
        return null;
    }

    const content = fs.readFileSync(DREAMS_PATH, 'utf8');
    const lines = content.split('\n');

    for (let line of lines) {
        // Buscar líneas que empiecen por "- [PENDING]"
        if (line.trim().startsWith('- [PENDING]')) {
            // Extraer el tema. Ejemplo: "- [PENDING] [NORMAL] [FECHA] [origen] AUDITORÍA FORENSE: Sistemas de Telecomunicaciones"
            // O un formato más simple si el usuario lo editó.
            const match = line.match(/AUDITORÍA FORENSE:\s*(.*)/i) || line.match(/\[PENDING\].*?:\s*(.*)/i);
            if (match && match[1]) {
                return match[1].trim();
            }
        }
    }

    return null;
}

const next = getNextDream();
if (next) {
    console.log(next);
    process.exit(0);
} else {
    process.exit(1); // No pending dreams
}
