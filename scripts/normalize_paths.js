const fs = require('fs');
const path = require('path');

const targetDir = '/home/administrador/docker/LFC2';

function sanitize(name) {
    // 1. Remove accents
    name = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    // 2. Replace non-alphanumeric (except . and -) with underscore
    name = name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    // 3. Replace dots (except for the last one if it's an extension) with underscore
    const parts = name.split('.');
    if (parts.length > 2) {
        const ext = parts.pop();
        name = parts.join('_') + '.' + ext;
    }
    // 4. Remove multiple underscores
    name = name.replace(/_+/g, '_');
    return name;
}

function processDir(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (item === '.git' || item === 'node_modules') continue;

        const oldPath = path.join(dir, item);
        const newName = sanitize(item);
        const newPath = path.join(dir, newName);

        if (oldPath !== newPath) {
            console.log(`Renaming: ${item} -> ${newName}`);
            fs.renameSync(oldPath, newPath);
        }

        if (fs.statSync(newPath).isDirectory()) {
            processDir(newPath);
        }
    }
}

console.log("Starting Global Zero-Accents Normalization...");
processDir(targetDir);
console.log("Done.");
