/**
 * @file src/intents/brain-state.js
 * @what  Intents sobre el estado de aprendizaje del agente: soul, identidad,
 *        qué significa "el enjambre debe entender", lecciones Karpathy activas.
 * @refs  handlers.js — loop de INTENTS
 *        brain/SOUL.md, brain/IDENTITY.md — leídos para respuesta de identidad
 *        brain/SPECIALTIES/*.md — conteo de lecciones Karpathy
 * @agent-prompt  Dos intents separados: identidad (quién soy) y enjambre (estado aprendizaje).
 *                Si matches() devuelve true y handle() devuelve false, cae al siguiente intent.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = {
  matches(textLower) {
    return (
      // Preguntas sobre el estado de aprendizaje del enjambre
      /enjambre.*(entend|sab|aprend|necesit)|ya.*(entend|aprend|sab|internali)|lecciones?.*(aplica|activ|ya)|necesitas?.*(algo|m[aá]s|info)|qu[eé] significa.*entend/i.test(textLower) ||
      // Preguntas sobre identidad / soul
      (/\b(soul|alma|identidad|aprendes?|aprende|memoria gen[eé]tica|como funciona|quien eres|qui[eé]n eres|brain|karpathy|sue[ñn]as?|dream)\b/i.test(textLower) &&
       /\b(t[uú]|agente|sicc|bot|opengravity|tu soul|tu alma|tu brain)\b/i.test(textLower))
    );
  },

  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    const specDir = path.join(BRAIN_DIR, 'SPECIALTIES');

    // Intent 1: estado de aprendizaje del enjambre
    if (/enjambre.*(entend|sab|aprend|necesit)|ya.*(entend|aprend|internali)|lecciones?.*(aplica|activ|ya)|necesitas?.*(algo|m[aá]s)|qu[eé] significa.*entend/i.test(textLower)) {
      const areas = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter(f => f.endsWith('.md')) : [];
      const totalLecciones = areas.reduce((acc, f) => {
        const c = fs.readFileSync(path.join(specDir, f), 'utf8');
        return acc + (c.match(/\*\*Karpathy Dream Lesson/g) || []).length;
      }, 0);

      await send(chatId,
        `🧬 *"El enjambre debe entender" — ¿qué significa?*\n\n` +
        `Esa frase es una *lección Karpathy*: se escribe cuando el Juez rechaza una DT. ` +
        `No es una queja — es una vacuna para el *próximo ciclo*.\n\n` +
        `*¿Ya entiende?* Sí — parcialmente:\n` +
        `• Las *${totalLecciones} lecciones* están en \`brain/SPECIALTIES/\`\n` +
        `• En el próximo \`/dream [área]\`, \`buscarLecciones()\` las recupera ` +
        `por coseno >0.7 e inyecta en *FASE-1* antes de generar la DT\n` +
        `• El LLM las lee *antes* de escribir — evita repetir el mismo error\n\n` +
        `*¿Qué falta para que realmente pase el Juez?*\n` +
        `1. Oracle estable — Chrome desbloqueado (\`/root/.local/share/notebooklm-mcp/\`)\n` +
        `2. Correr \`/dream [área]\` con las vacunas activas\n` +
        `3. Si aprueba → DT en \`brain/dictamenes/\` → promote a LFC2 → Vercel\n\n` +
        `_Las lecciones preparan el ciclo — no lo sustituyen._`
      );
      return true;
    }

    // Intent 2: identidad / soul / cómo aprende
    try {
      const soul  = fs.readFileSync(path.join(BRAIN_DIR, 'SOUL.md'), 'utf8').split('\n').slice(0, 20).join('\n');
      const specs = fs.readdirSync(specDir).filter(f => f.endsWith('.md'));
      await send(chatId,
        `🧠 *Cómo aprende OpenGravity SICC:*\n\n` +
        `*1. SOUL.md (ética — estático):*\n\`\`\`\n${soul.substring(0, 400)}\n\`\`\`\n\n` +
        `*2. Memoria Genética (sicc_genetic_memory):*\n` +
        `buscarLecciones() inyecta vacunas por coseno >0.7 en cada dream/mensaje.\n\n` +
        `*3. SPECIALTIES/* (Karpathy):*\n` +
        specs.map(f => `• ${f.replace('.md','')}`).join('  ') + `\n` +
        `Cada rechazo del Juez hace append de la lección.\n\n` +
        `*4. brain/dictamenes/* (gold standards):*\nDTs aprobadas = referencia para futuros sueños.\n\n` +
        `_SOUL e IDENTITY definen quién soy. La memoria genética define qué sé del proyecto._`
      );
      return true;
    } catch (_) { return false; }
  }
};
