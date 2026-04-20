/**
 * @file src/intents/dream-state.js
 * @what  Intents sobre el estado de los sueños: pendientes generales, historial
 *        por área específica, agenda/roadmap de trabajo.
 * @refs  handlers.js — loop de INTENTS
 *        brain/DREAMS/ — archivos de sueños registrados
 *        brain/PENDING_DTS/ — borradores rechazados tras 3 ciclos
 *        brain/SPECIALTIES/[AREA].md — lecciones Karpathy por área
 *        brain/ROADMAP.md — pendientes de trabajo
 * @agent-prompt  Tres intents en orden de especificidad:
 *                1. roadmap/agenda (más genérico)
 *                2. historial por área (requiere keyword de área)
 *                3. estado general de sueños
 *                Si el texto menciona un área conocida, siempre va al historial por área.
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const AREA_MAP = {
  comunicac: 'COMMUNICATIONS', telecom: 'COMMUNICATIONS', telecomunicac: 'COMMUNICATIONS',
  'señali': 'SIGNALIZATION',   senali: 'SIGNALIZATION',   ctsc: 'SIGNALIZATION',
  energ: 'POWER',              potencia: 'POWER',         enrg: 'POWER',
  integrac: 'INTEGRATION',     integ: 'INTEGRATION',
  ence: 'ENCE',
  control: 'CONTROL_CENTER',   centro: 'CONTROL_CENTER',
};
const DT_PREFIX = {
  COMMUNICATIONS: 'COMS', SIGNALIZATION: 'CTSC', POWER: 'ENRG',
  INTEGRATION: 'INTG',   ENCE: 'ENCE',           CONTROL_CENTER: 'CTRL'
};
const LFC2_DT_DIR = '/home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas';

module.exports = {
  matches(textLower) {
    return (
      /temas?.*(proponer|dream|so[ñn]ar)|pendiente.*(trabajo|hacer|falta)|qu[eé] falta|qu[eé] tenemos|roadmap|agenda|backlog|prioridades/i.test(textLower) ||
      /sue[ñn]|dream|pending|pendiente|borrador|karpathy.*(pendiente|queue)|ciclo.*(pendiente|sue[ñn]o)/i.test(textLower)
    );
  },

  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    // Intent 1: roadmap/agenda/temas de trabajo
    if (/temas?.*(proponer|dream|so[ñn]ar)|pendiente.*(trabajo|hacer|falta)|qu[eé] falta|qu[eé] tenemos|roadmap|agenda|backlog|prioridades/i.test(textLower)) {
      try {
        const roadmap = fs.readFileSync(path.join(BRAIN_DIR, 'ROADMAP.md'), 'utf8');
        const specDir = path.join(BRAIN_DIR, 'SPECIALTIES');
        const areas   = fs.existsSync(specDir) ? fs.readdirSync(specDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md','')) : [];
        const pendienteMatch   = roadmap.match(/## 🔴 PENDIENTE[\s\S]*?(?=\n## |$)/);
        const pendienteMed     = roadmap.match(/## 🟡 PENDIENTE[\s\S]*?(?=\n## |$)/);
        const pendienteTexto   = pendienteMatch ? pendienteMatch[0].split('\n').slice(1,8).join('\n') : '';
        const pendienteMedText = pendienteMed   ? pendienteMed[0].split('\n').slice(1,6).join('\n')   : '';

        await send(chatId,
          `🗺️ *Agenda SICC — Qué trabajar*\n\n` +
          `*Áreas disponibles para /dream:*\n` +
          areas.map(a => `• \`/dream ${a.toLowerCase()}\``).join('\n') + `\n\n` +
          `*Alta prioridad (🔴):*\n\`\`\`\n${pendienteTexto.trim()}\n\`\`\`\n\n` +
          `*Media prioridad (🟡):*\n\`\`\`\n${pendienteMedText.trim()}\n\`\`\`\n\n` +
          `Ver roadmap completo: \`brain/ROADMAP.md\``
        );
        return true;
      } catch (_) { return false; }
    }

    // Intent 2: historial por área específica
    const areaKey = Object.keys(AREA_MAP).find(k => textLower.includes(k));
    if (areaKey) {
      const area   = AREA_MAP[areaKey];
      const prefix = DT_PREFIX[area];
      try {
        const specFile   = path.join(BRAIN_DIR, 'SPECIALTIES', `${area}.md`);
        const specContent = fs.existsSync(specFile) ? fs.readFileSync(specFile, 'utf8') : '';
        const lecciones  = [...specContent.matchAll(/\*\*AUDIT_LESSON \(([^)]+)\):\*\*\n> ([^\n]+)/g)]
          .map(m => `• ${m[1].substring(0,19)}: ${m[2].substring(0,80)}`);
        const dtsArea    = fs.readdirSync(path.join(BRAIN_DIR,'dictamenes')).filter(f => f.includes(prefix) && f.endsWith('.md'));
        const dreamsArea = fs.existsSync(path.join(BRAIN_DIR,'DREAMS'))
          ? fs.readdirSync(path.join(BRAIN_DIR,'DREAMS')).filter(f => f.toUpperCase().includes(area.split('_')[0]))
          : [];
        const enLfc2     = fs.existsSync(LFC2_DT_DIR) ? fs.readdirSync(LFC2_DT_DIR).filter(f => f.includes(prefix)) : [];

        const estadoDT = dtsArea.length
          ? `✅ *${dtsArea.length} DT aprobada(s):*\n${dtsArea.map(f=>`• \`${f}\``).join('\n')}`
          : `❌ *Sin DT aprobada* — todos los ciclos rechazados por el Juez.`;
        const estadoVercel = enLfc2.length
          ? `✅ En LFC2 → visible en lfc-2.vercel.app:\n${enLfc2.map(f=>`• \`${f}\``).join('\n')}`
          : `⚠️ *No promovida a LFC2/Vercel* — usa:\n\`cp brain/dictamenes/${prefix}-*.md ${LFC2_DT_DIR}/\``;

        await send(chatId,
          `🔍 *Historial SICC — Área: ${area}*\n\n` +
          estadoDT + `\n\n` +
          `📓 *Sueños del área:* ${dreamsArea.length || 0}\n` +
          (dreamsArea.length ? dreamsArea.map(f=>`• \`${f}\``).join('\n')+'\n\n' : '_(sin archivos en DREAMS/)_\n\n') +
          `🧬 *Lecciones de Auditoría (${lecciones.length} ciclos fallidos):*\n` +
          (lecciones.length
            ? lecciones.slice(0,5).join('\n') + (lecciones.length>5 ? `\n  _...+${lecciones.length-5} más en brain/SPECIALTIES/${area}.md_` : '')
            : '_(sin lecciones — área sin ciclos aún)_') + `\n\n` +
          estadoVercel
        );
        return true;
      } catch (_) { return false; }
    }

    // Intent 3: estado general de sueños
    try {
      const dreamsDir  = path.join(BRAIN_DIR, 'DREAMS');
      const pendingDir = path.join(BRAIN_DIR, 'PENDING_DTS');
      const specDir    = path.join(BRAIN_DIR, 'SPECIALTIES');
      const dreams  = fs.existsSync(dreamsDir)  ? fs.readdirSync(dreamsDir).filter(f=>f.endsWith('.md')).sort().reverse()  : [];
      const pending = fs.existsSync(pendingDir) ? fs.readdirSync(pendingDir).filter(f=>f.endsWith('.md')).sort().reverse() : [];
      const specs   = fs.existsSync(specDir)    ? fs.readdirSync(specDir).filter(f=>f.endsWith('.md'))                     : [];
      const aprobados  = dreams.filter(f=>f.includes('CERTIFICADO'));
      const rechazados = dreams.filter(f=>f.includes('RECHAZADO'));

      await send(chatId,
        `💤 *Estado del Dreamer SICC*\n\n` +
        `📓 *Sueños registrados (${dreams.length} total):*\n` +
        `• ${aprobados.length} CERTIFICADOS | ${rechazados.length} RECHAZADOS\n` +
        (dreams.slice(0,4).map(f=>`  \`${f}\``).join('\n') || '  _(ninguno)_') + `\n\n` +
        `🔶 *Borradores pendientes revisión humana (${pending.length}):*\n` +
        (pending.length ? pending.map(f=>`• \`${f}\``).join('\n') : '_(ninguno)_') + `\n\n` +
        `🧬 *Lecciones de Auditoría por área:*\n` +
        specs.map(f=>`• ${f.replace('.md','')}`).join('  ') + `\n\n` +
        `Usa */dream [área]* para iniciar un nuevo ciclo.`
      );
      return true;
    } catch (_) { return false; }
  }
};
