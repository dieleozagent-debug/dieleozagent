// config.js — Lectura y validación centralizada de variables de entorno
'use strict';

require('dotenv').config();

/**
 * Lee una variable de entorno. Lanza error si es requerida y no existe.
 */
function env(key, required = true) {
  const value = process.env[key];
  if (required && !value) {
    console.error(`[CONFIG] ❌ Variable de entorno requerida no definida: ${key}`);
    process.exit(1);
  }
  return value || '';
}

const config = {
  // ── Telegram ──────────────────────────────────────────────────────────────
  telegram: {
    token: env('TELEGRAM_BOT_TOKEN'),
    userId: env('TELEGRAM_USER_ID'),
  },

  // ── Proveedores de IA ─────────────────────────────────────────────────────
  ai: {
    primaryProvider: env('AI_PRIMARY_PROVIDER', false) || 'gemini',

    gemini: {
      apiKey: env('GOOGLE_GEMINI_API_KEY', false),
      model: env('GOOGLE_GEMINI_MODEL', false) || 'gemini-2.0-flash',
    },

    groq: {
      apiKey: env('GROQ_API_KEY', false),
      model: env('GROQ_MODEL', false) || 'llama3-70b-8192',
    },

    openrouter: {
      apiKey: env('OPENROUTER_API_KEY', false),
      model: env('OPENROUTER_MODEL', false) || 'openai/gpt-4o-mini',
    },
  },

  // ── Agente ────────────────────────────────────────────────────────────────
  agent: {
    name: env('AGENT_NAME', false) || 'OpenGravity',
    language: env('AGENT_LANGUAGE', false) || 'es',
  },
};

// Validación: al menos un proveedor de IA debe estar configurado
const hasGemini = !!config.ai.gemini.apiKey;
const hasGroq = !!config.ai.groq.apiKey;
const hasOpenrouter = !!config.ai.openrouter.apiKey;

if (!hasGemini && !hasGroq && !hasOpenrouter) {
  console.error('[CONFIG] ❌ Debes configurar al menos una API de IA (GOOGLE_GEMINI_API_KEY, GROQ_API_KEY o OPENROUTER_API_KEY)');
  process.exit(1);
}

console.log(`[CONFIG] ✅ Agente: ${config.agent.name}`);
console.log(`[CONFIG] ✅ Proveedor primario: ${config.ai.primaryProvider}`);
console.log(`[CONFIG] ✅ Proveedores disponibles: ${[hasGemini && 'Gemini', hasGroq && 'Groq', hasOpenrouter && 'OpenRouter'].filter(Boolean).join(', ')}`);

module.exports = config;
