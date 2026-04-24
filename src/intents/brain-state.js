/**
 * @file src/intents/brain-state.js
 * @what  Intents sobre el estado de aprendizaje del sistema: brain, identidad,
 *        qué significa "los agentes deben entender", lecciones de auditoría activas.
 * @refs  handlers.js — loop de INTENTS
 *        brain/BRAIN.md, brain/IDENTITY.md — leídos para respuesta de identidad
 *        brain/SPECIALTIES/*.md — conteo de lecciones de auditoría
 * @agent-prompt  Dos intents separados: identidad (quién soy) y agentes (estado aprendizaje).
 */
'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = {
  matches(textLower) {
    return (
      // Preguntas sobre el estado de aprendizaje de los agentes
      /agent.*(entend|sab|aprend|necesit)|ya.*(entend|aprend|sab|internali)|lecciones?.*(aplica|activ|ya)|necesitas?.*(algo|m[aá]s|info)|qu[eé] significa.*entend/i.test(textLower) ||
      // Preguntas sobre identidad / brain
      (/\b(brain|identidad|aprendes?|aprende|memoria gen[eé]tica|como funciona|quien eres|qui[eé]n eres|sicc_forensic|audit)\b/i.test(textLower) &&
       /\b(t[uú]|agente|sicc|bot|opengravity|tu brain)\b/i.test(textLower))
    );
  },

  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    const specDir = path.join(BRAIN_DIR, 'SPECIALTIES');

    // Intent 1: estado de aprendizaje de los agentes
    if (/agent.*(entend|sab|aprend|necesit)|ya.*(entend|aprend|internali)|lecciones?.*(aplica|activ|ya)|necesitas?.*(algo|m[aá]s)|qu[eé] significa.*entend/i.test(textLower)) {
      const areas = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter(f => f.endsWith('.md')) : [];
      const totalLecciones = areas.reduce((acc, f) => {
        const c = fs.readFileSync(path.join(specDir, f), 'utf8');
        return acc + (c.match(/\*\*AUDIT_LESSON/g) || []).length;
      }, 0);

      await send(chatId,
        `🧬 *"Los agentes deben entender" — ¿qué significa?*\n\n` +
        `Esa frase es una *lección de auditoría*: se escribe cuando el Juez rechaza una DT. ` +
        `No es una queja — es una vacuna para el *próximo ciclo*.\n\n` +
        `*¿Ya entiende?* Sí — parcialmente:\n` +
        `• Las *${totalLecciones} lecciones* están en \`brain/SPECIALTIES/\`\n` +
        `• En el próximo \`/audit [área]\`, \`buscarLecciones()\` las recupera ` +
        `por coseno >0.7 e inyecta en *FASE-1* antes de generar la DT\n` +
        `• El LLM las lee *antes* de escribir — evita repetir el mismo error\n\n` +
        `*¿Qué falta para que realmente pase el Juez?*\n` +
        `1. Oracle estable — Chrome desbloqueado (\`/root/.local/share/notebooklm-mcp/\`)\n` +
        `2. Correr \`/audit [área]\` con las vacunas activas\n` +
        `3. Si aprueba → DT en \`brain/dictamenes/\` → promote a LFC2 → Vercel\n\n` +
        `_Las lecciones preparan el ciclo — no lo sustituyen._`
      );
      return true;
    }

    // Intent 2: identidad / brain / cómo aprende
    try {
      const brainContent  = fs.readFileSync(path.join(BRAIN_DIR, 'BRAIN.md'), 'utf8').split('\n').slice(0, 20).join('\n');
      const specs = fs.readdirSync(specDir).filter(f => f.endsWith('.md'));
      await send(chatId,
        `🧠 *Cómo aprende SICC:*\n\n` +
        `*1. BRAIN.md (ética — estático):*\n\`\`\`\n${brainContent.substring(0, 400)}\n\`\`\`\n\n` +
        `*2. Memoria Contractual (sicc_genetic_memory):*\n` +
        `buscarLecciones() inyecta vacunas por coseno >0.7 en cada auditoría/mensaje.\n\n` +
        `*3. SPECIALTIES/ (Auditoría):*\n` +
        specs.map(f => `• ${f.replace('.md','')}`).join('  ') + `\n` +
        `Cada rechazo del Juez hace append de la lección.\n\n` +
        `*4. brain/dictamenes/* (gold standards):*\nDTs aprobadas = referencia para futuros ciclos.\n\n` +
        `_BRAIN e IDENTITY definen quién soy. La memoria contractual define qué sé del proyecto._`
      );
      return true;
    } catch (_) { return false; }
  }
};
