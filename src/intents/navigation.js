/**
 * @file src/intents/navigation.js
 * @what  Intent: guía de onboarding cuando el usuario se pierde o pregunta cómo usar el sistema.
 * @refs  handlers.js — requiere este módulo en el loop de INTENTS
 *        brain/SPECIALTIES/ — lista áreas disponibles para /dream
 *        brain/dictamenes/ — conteo de DTs aprobadas
 * @agent-prompt  Agrega aquí variantes de "me pierdo / cómo empiezo / cómo trabajamos".
 *                NO pongas comandos /slash aquí — esos van en handlers.js.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = {
  matches(textLower) {
    return /me pierdo|c[oó]mo.*(ayud|trabaj|us[ao]|mejor|empez)|por d[oó]nde|qu[eé] hago|ay[uú]dame|mejorar.*lfc|lfc.*mejor/i.test(textLower);
  },

  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    const specDir = path.join(BRAIN_DIR, 'SPECIALTIES');
    const areas   = fs.existsSync(specDir)
      ? fs.readdirSync(specDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md','').toLowerCase())
      : [];
    const dts = fs.existsSync(path.join(BRAIN_DIR,'dictamenes'))
      ? fs.readdirSync(path.join(BRAIN_DIR,'dictamenes')).filter(f => f.endsWith('.md')).length
      : 0;

    await send(chatId,
      `🧭 *Cómo trabajamos juntos — Guía rápida SICC*\n\n` +
      `*Para generar una Decisión Técnica nueva:*\n` +
      `\`/dream [área]\` → ciclo completo (5-10 min)\n` +
      areas.map(a => `  • \`/dream ${a}\``).join('\n') + `\n\n` +
      `*Para analizar una pregunta puntual del contrato:*\n` +
      `\`/swarm ¿cuál es la obligación de CAPEX en AT1 sección 5.1?\`\n\n` +
      `*Para ver qué tenemos aprobado (${dts} DTs):*\n` +
      `Pregúntame: _"qué DTs tenemos aprobadas"_ o _"dónde están los dictámenes"_\n\n` +
      `*Para ver qué falló y por qué:*\n` +
      `Pregúntame: _"qué pasó con señalización"_ o _"historial de comunicaciones"_\n\n` +
      `*Para promover una DT aprobada a LFC2/Vercel:*\n` +
      `\`\`\`\ncp brain/dictamenes/<DT>.md \\\n  /home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/\n\`\`\`\n` +
      `Luego: \`cd /home/administrador/docker/LFC2 && git add . && git commit -m "DT" && git push\`\n\n` +
      `*Estado del sistema:*\n` +
      `\`/doctor\` — health | \`/estado\` — proveedores IA | \`/cerebro\` — brain activo\n\n` +
      `_Flujo principal: /dream → Juez aprueba → promote → Vercel._`
    );
    return true;
  }
};
