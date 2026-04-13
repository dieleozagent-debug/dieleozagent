// notifications.js — Módulo para envío de alertas proactivas a Telegram
'use strict';

const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const bot = new TelegramBot(config.telegram.token);

/**
 * Envía una alerta proactiva a Diego vía Telegram.
 * No requiere polling activo.
 */
async function enviarAlerta(texto) {
  if (!config.telegram.token || !config.telegram.userId) {
    console.warn('[NOTIFY] ⚠️ Configuración de Telegram incompleta. Alerta no enviada.');
    return;
  }

  const MAX_LENGTH = 3500;
  const chunks = [];
  for (let i = 0; i < texto.length; i += MAX_LENGTH) {
    chunks.push(texto.substring(i, i + MAX_LENGTH));
  }

  for (const chunk of chunks) {
    try {
      await bot.sendMessage(config.telegram.userId, chunk, { parse_mode: 'Markdown' });
    } catch (err) {
      // Reintento en texto plano si falla Markdown
      try {
        await bot.sendMessage(config.telegram.userId, chunk, { parse_mode: undefined });
      } catch (err2) {
        console.error('[NOTIFY] ❌ Error enviando Telegram:', err2.message);
      }
    }
  }
}

module.exports = { enviarAlerta };
