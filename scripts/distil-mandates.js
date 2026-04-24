const fs = require('fs');
const path = require('path');
const { llamarMultiplexadorFree } = require('./sicc-multiplexer'); // Reusing the established AI multiplexer

const mdPath = path.join(__dirname, '../brain/SPECIALTIES/Criterios_Senalizacion_Comunicaciones.md');
const signalizationPath = path.join(__dirname, '../brain/SPECIALTIES/SIGNALIZATION.md');
const communicationsPath = path.join(__dirname, '../brain/SPECIALTIES/COMMUNICATIONS.md');

async function main() {
    try {
        console.log("📖 Leyendo documento Markdown base...");
        const fullText = fs.readFileSync(mdPath, 'utf-8');

        // Check if file is read correctly
        if (!fullText || fullText.length < 100) {
             throw new Error("El archivo Markdown está vacío o no se pudo leer correctamente.");
        }
        
        console.log(`📊 Tamaño del documento: ${fullText.length} caracteres.`);

        const systemPrompt = `Eres el Arquitecto Jefe de Sistemas Ferroviarios (SICC Director). 
Tu tarea es analizar el documento de 'Bases, Parámetros y Criterios de Diseño' proporcionado y extraer EXCLUSIVAMENTE los MANDATOS TÉCNICOS INNEGOCIABLES para dos especialidades: Señalización (SIGNALIZATION) y Comunicaciones (COMMUNICATIONS).

Reglas de extracción:
1. Extrae solo requisitos normativos y arquitectónicos duros (ej. PTC, FRA 236, Cantones Virtuales, TETRA, Fibra G.652.D, EN 50159).
2. Ignora saludos, índices, nombres de personas o descripciones de contexto genérico.
3. Devuelve un JSON estrictamente estructurado con este formato EXACTO:
{
  "SIGNALIZATION": [
    "Mandato 1...",
    "Mandato 2..."
  ],
  "COMMUNICATIONS": [
    "Mandato 1...",
    "Mandato 2..."
  ]
}
NO DEVUELVAS NADA MÁS QUE EL JSON VÁLIDO.`;

        console.log("🧠 Enviando a destilación a través del Multiplexador SICC (Fase 0.5)...");
        
        // Use the multiplexer to call an LLM (Gemini/Groq/OpenRouter)
        const response = await llamarMultiplexadorFree(
            "Extrae los mandatos según el system prompt. Devuelve SOLO JSON.",
            fullText,
            systemPrompt,
            { type: 'json_object' } // Forcing JSON if the provider supports it
        );

        let jsonString = response.texto;
        // Clean up markdown formatting if the model returned it
        if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/```json\n/g, '').replace(/```/g, '').trim();
        } else if (jsonString.startsWith('```')) {
             jsonString = jsonString.replace(/```\n/g, '').replace(/```/g, '').trim();
        }

        console.log("✅ Respuesta recibida. Parseando JSON...");
        let mandates;
        try {
            mandates = JSON.parse(jsonString);
        } catch (e) {
            console.error("❌ Error parseando la respuesta JSON del LLM:");
            console.error(jsonString);
            throw e;
        }

        let sigMandates = [];
        let commMandates = [];

        if (mandates.SIGNALIZATION && mandates.COMMUNICATIONS) {
             sigMandates = mandates.SIGNALIZATION;
             commMandates = mandates.COMMUNICATIONS;
        } else if (mandates.mandatos) {
             console.log("⚠️ El modelo devolvió un array genérico de 'mandatos'. Aplicando a ambas especialidades.");
             sigMandates = mandates.mandatos;
             commMandates = mandates.mandatos;
        } else {
             console.error("❌ El JSON no tiene la estructura esperada. Contenido parseado:");
             console.error(JSON.stringify(mandates, null, 2));
             throw new Error("El JSON no tiene la estructura esperada.");
        }

        console.log("💉 Inyectando mandatos en el Cerebro (SIGNALIZATION.md y COMMUNICATIONS.md)...");

        // Format for SIGNALIZATION
        let sigContent = `# ESPECIALIDAD: SIGNALIZATION\n\n`;
        sigContent += `## 📜 MANDATOS INNEGOCIABLES DE DISEÑO (Extracción Automática de DBCD v001)\n\n`;
        sigMandates.forEach(m => sigContent += `* ${m}\n`);
        
        // Preserve existing lessons if the file exists
        if (fs.existsSync(signalizationPath)) {
             const existing = fs.readFileSync(signalizationPath, 'utf-8');
             const parts = existing.split('## 📜 MANDATOS INNEGOCIABLES DE DISEÑO');
             if (parts.length > 0) {
                  // Keep whatever is after the mandates section if there are lessons
                 const lessonsMatch = existing.match(/## 🚨 LECCIONES DE AUDITORÍA FORENSE[\s\S]*/);
                 if (lessonsMatch) {
                     sigContent += `\n${lessonsMatch[0]}\n`;
                 }
             }
        } else {
            sigContent += `\n## 🚨 LECCIONES DE AUDITORÍA FORENSE\n* (Sin lecciones registradas aún)\n`;
        }
        
        fs.writeFileSync(signalizationPath, sigContent);
        console.log(`✅ ${signalizationPath} actualizado con ${mandates.SIGNALIZATION.length} mandatos.`);

        // Format for COMMUNICATIONS
        let comContent = `# ESPECIALIDAD: COMMUNICATIONS\n\n`;
        comContent += `## 📜 MANDATOS INNEGOCIABLES DE DISEÑO (Extracción Automática de DBCD v001)\n\n`;
        commMandates.forEach(m => comContent += `* ${m}\n`);

        if (fs.existsSync(communicationsPath)) {
            const existing = fs.readFileSync(communicationsPath, 'utf-8');
            const lessonsMatch = existing.match(/## 🚨 LECCIONES DE AUDITORÍA FORENSE[\s\S]*/);
            if (lessonsMatch) {
                comContent += `\n${lessonsMatch[0]}\n`;
            }
       } else {
           comContent += `\n## 🚨 LECCIONES DE AUDITORÍA FORENSE\n* (Sin lecciones registradas aún)\n`;
       }
        
        fs.writeFileSync(communicationsPath, comContent);
        console.log(`✅ ${communicationsPath} actualizado con ${mandates.COMMUNICATIONS.length} mandatos.`);

        console.log("🚀 ¡Operación de Parametrización Forense completada!");

    } catch (error) {
        console.error("❌ Fallo en la destilación:", error);
        process.exit(1);
    }
}

main();
