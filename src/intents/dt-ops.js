/**
 * @file src/intents/dt-ops.js
 * @what  Intents sobre operaciones de DTs: dónde están, cuáles están bloqueadas/
 *        pendientes de revisión, qué hacemos con una DT específica (promote).
 * @refs  handlers.js — loop de INTENTS
 *        brain/dictamenes/ — DTs aprobadas (certificadas)
 *        brain/PENDING_DTS/ — borradores rechazados en revisión humana
 *        brain/history/ — log de auditorías
 *        LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/ — DTs promovidas a Vercel
 * @agent-prompt  Tres intents en orden de especificidad:
 *                1. DT específica por nombre (detecta patrón DT-XXXX en el mensaje)
 *                2. DTs bloqueadas/pendientes de review
 *                3. Ubicación general de DTs
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const LFC2_DT_DIR = '/home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas';

module.exports = {
  matches(textLower, texto) {
    return (
      // DT específica por nombre
      /\bdt[-_][a-z0-9][-a-z0-9_]+/i.test(texto) ||
      // DTs bloqueadas / pendientes de review
      /dt.*(bloqueada|pendiente|revisar|review|debo revisar|tengo pendiente)|bloqueada|pendiente.*dt|qu[eé].*dt.*(aprobad|revisar|pend)/i.test(textLower) ||
      // Ubicación general de DTs
      /d[oó]nde|encuentro|dictamen|dt[- ]?aprobad|dt certificad|audit.*cert/i.test(textLower)
    );
  },

  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    const dictDir  = path.join(BRAIN_DIR, 'dictamenes');
    const pendDir  = path.join(BRAIN_DIR, 'PENDING_DTS');
    const historyDir = path.join(BRAIN_DIR, 'history');

    // Intent 1: pregunta sobre una DT específica por nombre
    const dtMatch = texto.match(/\b(DT[-_][A-Z0-9][-A-Z0-9_]+)/i);
    if (dtMatch) {
      const dtName = dtMatch[1].toUpperCase().replace('_','-');
      try {
        // Buscar el archivo exacto o por prefijo
        const allDTs   = fs.readdirSync(dictDir).filter(f => f.endsWith('.md'));
        const dtFile   = allDTs.find(f => f.toUpperCase().includes(dtName));
        const enLfc2   = fs.existsSync(LFC2_DT_DIR)
          ? fs.readdirSync(LFC2_DT_DIR).filter(f => f.toUpperCase().includes(dtName))
          : [];

        if (!dtFile) {
          await send(chatId,
            `🔍 *DT: ${dtName}*\n\n` +
            `❌ No encontrada en \`brain/dictamenes/\` — puede que esté en PENDING o nunca fue aprobada.\n\n` +
            `DTs aprobadas actuales:\n` + allDTs.map(f=>`• \`${f}\``).join('\n')
          );
          return true;
        }

        // Leer resumen del archivo (primeras 30 líneas)
        const content = fs.readFileSync(path.join(dictDir, dtFile), 'utf8');
        const resumen = content.split('\n').slice(0,30).join('\n').substring(0,600);
        const estadoLFC2 = enLfc2.length
          ? `✅ *Promovida a LFC2* — visible en lfc-2.vercel.app`
          : `⚠️ *NO promovida a LFC2/Vercel todavía*`;

        await send(chatId,
          `📄 *${dtFile}*\n\n` +
          `\`\`\`\n${resumen}\n...\n\`\`\`\n\n` +
          estadoLFC2 + `\n\n` +
          `*¿Qué hacemos con ella?*\n` +
          (enLfc2.length ? `Ya está en LFC2. Verifica en lfc-2.vercel.app que el deploy esté activo.` :
            `1. Promoverla a LFC2:\n\`\`\`\ncp brain/dictamenes/${dtFile} \\\n  ${LFC2_DT_DIR}/\n\`\`\`\n` +
            `2. Publicar:\n\`\`\`\ncd /home/administrador/docker/LFC2\ngit add . && git commit -m "feat: ${dtName}" && git push\n\`\`\`\n` +
            `3. Vercel auto-deploya en ~2 min.`)
        );
        return true;
      } catch (_) { return false; }
    }

    // Intent 2: DTs bloqueadas / pendientes de revisión humana
    if (/bloqueada|pendiente.*dt|dt.*(bloqueada|pendiente|revisar|debo revisar)|qu[eé].*dt.*(aprobad|revisar|pend)/i.test(textLower)) {
      try {
        const aprobadas = fs.existsSync(dictDir) ? fs.readdirSync(dictDir).filter(f=>f.endsWith('.md')) : [];
        const pendientes = fs.existsSync(pendDir) ? fs.readdirSync(pendDir).filter(f=>f.endsWith('.md')) : [];
        const enLfc2    = fs.existsSync(LFC2_DT_DIR) ? fs.readdirSync(LFC2_DT_DIR) : [];
        const sinPromover = aprobadas.filter(f => {
          const base = f.replace('_APROBADO.md','').replace('.md','');
          return !enLfc2.some(l => l.includes(base.split('_')[0]));
        });

        await send(chatId,
          `📋 *Estado de DTs SICC*\n\n` +
          `✅ *Aprobadas (${aprobadas.length}) — en \`brain/dictamenes/\`:*\n` +
          aprobadas.map(f => `• \`${f}\``).join('\n') + `\n\n` +
          `🚀 *Sin promover a LFC2/Vercel (${sinPromover.length}):*\n` +
          (sinPromover.length
            ? sinPromover.map(f=>`• \`${f}\` ← *acción requerida*`).join('\n')
            : '_(todas promovidas)_') + `\n\n` +
          `🔶 *Borradores bloqueados — revisión humana (${pendientes.length}):*\n` +
          (pendientes.length
            ? pendientes.map(f=>`• \`${f}\``).join('\n') + `\n_(rechazados 3+ ciclos — requieren tu revisión antes de volver a soñar)_`
            : '_(ninguno)_')
        );
        return true;
      } catch (_) { return false; }
    }

    // Intent 3: ubicación general de DTs
    try {
      const dts    = fs.readdirSync(dictDir).filter(f=>f.endsWith('.md')).sort().reverse().slice(0,5);
      const audits = fs.existsSync(historyDir) ? fs.readdirSync(historyDir).filter(f=>f.endsWith('.md')).sort().reverse().slice(0,3) : [];
      await send(chatId,
        `📄 *DTs certificadas* (\`brain/dictamenes/\`):\n` +
        (dts.length ? dts.map(f=>`• \`${f}\``).join('\n') : '_(ninguna)_') + `\n\n` +
        `⚖️ *Auditorías recientes* (\`brain/history/\`):\n` +
        (audits.length ? audits.map(f=>`• \`${f}\``).join('\n') : '_(ninguna)_') + `\n\n` +
        `Para promover a LFC2:\n\`\`\`\ncp brain/dictamenes/<DT>.md ${LFC2_DT_DIR}/\n\`\`\``
      );
      return true;
    } catch (_) { return false; }
  }
};
