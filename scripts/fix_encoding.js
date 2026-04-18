const fs = require('fs');
const path = require('path');

function isUtf8(buffer) {
    try {
        new TextDecoder('utf-8', { fatal: true }).decode(buffer);
        return true;
    } catch (e) {
        return false;
    }
}

const dir = '/home/administrador/docker/LFC2/IV. Ingenieria básica/';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));

files.forEach(file => {
    const fullPath = path.join(dir, file);
    const buffer = fs.readFileSync(fullPath);
    
    if (!isUtf8(buffer)) {
        console.log(`[FIXING ENCODING] ${file}...`);
        // Assume latin1 (Win-1252) and convert to utf-8
        const content = fs.readFileSync(fullPath, 'latin1');
        fs.writeFileSync(fullPath, content, 'utf8');
    } else {
        console.log(`[OK] ${file} is already UTF-8.`);
    }
});
