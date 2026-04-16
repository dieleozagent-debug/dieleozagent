const http = require('http');

async function testModel(modelName) {
    return new Promise((resolve) => {
        const postData = JSON.stringify({
            model: modelName,
            prompt: "Hola, responde brevemente.",
            stream: false
        });

        const req = http.request({
            hostname: '172.20.0.1', 
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    console.log(`[SUCCESS] ${modelName}: ${json.response.trim().substring(0, 100)}`);
                    resolve(true);
                } catch (e) {
                    console.log(`[ERROR] ${modelName}: Parse fail`);
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.log(`[FAIL] ${modelName}: ${e.message}`);
            resolve(false);
        });

        req.write(postData);
        req.end();
    });
}

async function run() {
    console.log("--- SICC BRIDGE SALUTATION ---");
    const models = ['gemma2:2b', 'phi3.5:latest', 'sicc-gemma4:q5', 'qwen2.5:1.5b'];
    for (const m of models) {
        await testModel(m);
    }
}

run();
