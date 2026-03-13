// gmail.js — Leer correos y enviar desde dieleozagent@gmail.com
'use strict';

const nodemailer = require('nodemailer');
const { ImapFlow } = require('imapflow');

const GMAIL_USER  = process.env.GMAIL_ACCOUNT;
const GMAIL_PASS  = process.env.GMAIL_APP_PASSWORD;

// ── Enviar correo ─────────────────────────────────────────────────────────────
async function enviarCorreo({ para, asunto, cuerpo }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
  });

  await transporter.sendMail({
    from: `"OpenGravity" <${GMAIL_USER}>`,
    to: para,
    subject: asunto,
    text: cuerpo,
  });

  console.log(`[GMAIL] ✅ Correo enviado a ${para}`);
}

// ── Leer correos no leídos ────────────────────────────────────────────────────
async function leerNoLeidos(maxCorreos = 5) {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: { user: GMAIL_USER, pass: GMAIL_PASS },
    logger: false,
  });

  await client.connect();
  const correos = [];

  try {
    const lock = await client.getMailboxLock('INBOX');
    try {
      // Buscar no leídos, tomar los últimos N
      const uids = await client.search({ seen: false });
      const recientes = uids.slice(-maxCorreos);

      for await (const msg of client.fetch(recientes, { envelope: true, bodyStructure: true, source: true })) {
        const texto = msg.source?.toString() || '';
        // Extraer cuerpo de texto plano de forma simple
        const lineas = texto.split('\n');
        const inicio = lineas.findIndex(l => l.trim() === '');
        const body   = lineas.slice(inicio + 1).join('\n').substring(0, 500).trim();

        correos.push({
          de:      msg.envelope.from?.[0]?.address || 'desconocido',
          asunto:  msg.envelope.subject || '(sin asunto)',
          fecha:   msg.envelope.date?.toLocaleDateString('es-CO') || '?',
          preview: body,
        });
      }
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }

  console.log(`[GMAIL] ✅ Leídos ${correos.length} correos no leídos`);
  return correos;
}

/**
 * Formatea los correos para mostrarlos en Telegram
 */
function formatearCorreos(correos) {
  if (correos.length === 0) return '📭 No tienes correos sin leer.';
  return correos.map((c, i) =>
    `*${i + 1}. ${c.asunto}*\n` +
    `👤 De: ${c.de}\n` +
    `📅 ${c.fecha}\n` +
    `📄 ${c.preview || '(sin vista previa)'}...`
  ).join('\n\n─────────────────\n\n');
}

module.exports = { enviarCorreo, leerNoLeidos, formatearCorreos };
