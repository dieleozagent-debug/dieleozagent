/**
 * @file src/utils/send.js
 * @what  Exporta safeSendMessage(bot, chatId, text, options): envía texto a
 *        Telegram con Markdown, con fallback a texto plano si falla el parseo,
 *        y chunking automático si el texto supera 3500 caracteres.
 * @how   Si text.length <= 3500 → intenta Markdown; si error "can't parse entities"
 *        reintenta sin parse_mode. Si text > 3500 → divide en chunks, añade
 *        "[Parte N/M]" a cada uno, y espera 500ms entre envíos para no saturar.
 * @why   Telegram limita a 4096 chars y es estricto con Markdown. Centralizar
 *        este fallback evita duplicar try/catch en cada handler.
 * @refs  index.js — crea `send = (chatId, text, opts) => safeSendMessage(bot, ...)
 *        handlers.js — recibe `send` como parámetro y lo usa para responder
 *
 * @agent-prompt
 *   NO cambies la firma: siempre (bot, chatId, text, options).
 *   MAX_LENGTH = 3500, no 4096 — margen para metadata Telegram.
 *   El delay de 500ms entre chunks es intencional (rate-limit Telegram).
 *   Si necesitas otro tipo de mensaje (foto, documento) crea otra función aquí,
 *   NO reimplementes la lógica de chunking en handlers.js.
 */
'use strict';

const MAX_LENGTH = 3500;

async function safeSendMessage(bot, chatId, text, options = {}) {
  if (text.length <= MAX_LENGTH) {
    try {
      return await bot.sendMessage(chatId, text, { ...options, parse_mode: 'Markdown' });
    } catch (err) {
      if (err.message.includes("can't parse entities")) {
        return await bot.sendMessage(chatId, text, { ...options, parse_mode: undefined });
      }
      throw err;
    }
  }

  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_LENGTH) chunks.push(text.substring(i, i + MAX_LENGTH));
  console.log(`[BOT] 📦 Dividiendo mensaje ${text.length}c en ${chunks.length} fragmentos...`);

  for (const [i, chunk] of chunks.entries()) {
    const final = chunks.length > 1 ? `*[Parte ${i + 1}/${chunks.length}]*\n${chunk}` : chunk;
    try {
      await bot.sendMessage(chatId, final, { ...options, parse_mode: 'Markdown' });
    } catch (_) {
      await bot.sendMessage(chatId, final, { ...options, parse_mode: undefined });
    }
    await new Promise(r => setTimeout(r, 500));
  }
}

module.exports = { safeSendMessage };
