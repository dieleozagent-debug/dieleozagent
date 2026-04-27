// config.js — Lectura y validación centralizada de variables de entorno
'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });

/**
 * Lee una variable de entorno. Lanza error si es requerida y no existe.
 */
function env(key, required = true) {
  const value = process.env[key];
  if (required && !value) {
    console.error(`[CONFIG] [SICC FAIL] Variable de entorno requerida no definida: ${key}`);
    process.exit(1);
  }
  return value || '';
}

const config = {
  // ── Telegram ──────────────────────────────────────────────────────────────
  telegram: {
    token: env('TELEGRAM_BOT_TOKEN', false),
    userId: env('TELEGRAM_USER_ID', false),
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
      model: env('GROQ_MODEL', false) || 'llama-3.3-70b-versatile',
    },

    openrouter: {
      apiKey: env('OPENROUTER_API_KEY', false),
      model: env('OPENROUTER_MODEL', false) || 'openrouter/free',
    },

    deepseek: {
      apiKey: env('DEEPSEEK_API_KEY', false),
      model: env('DEEPSEEK_MODEL', false) || 'deepseek-v4-flash',
      modelPro: 'deepseek-v4-pro', // Para el Juez (razonamiento complejo)
      baseUrl: 'https://api.deepseek.com',
    },

    ollama: {
      host: (function() {
        const fs = require('fs');
        const isDocker = fs.existsSync('/.dockerenv');
        return isDocker ? 'http://opengravity-ollama:11434' : 'http://localhost:11434';
      })(),
      model: env('OLLAMA_MODEL', false) || 'gemma4-light:latest',
    },

    // ── Swarm de Alta Velocidad (Hybrid Mode) ──────────────────────────────
    swarm: {
      auditor: env('SWARM_MODEL_AUDITOR', false) || 'google/gemini-2.0-flash-lite-preview-02-05:free',
      strategist: env('SWARM_MODEL_STRATEGIST', false) || 'google/gemini-2.0-flash-lite-preview-02-05:free',
      sumarizador: env('SUMMARIZER_MODEL', false) || 'google/gemini-2.0-flash-lite-preview-02-05:free',
    },

    // ── Búsqueda Web (Tavily) ────────────────────────────────────────────────
    tavily: {
      apiKey: env('TAVILY_API_KEY', false),
    },
  },

  // ── Agente ────────────────────────────────────────────────────────────────
  agent: {
    name: env('AGENT_NAME', false) || 'OpenGravity',
    language: env('AGENT_LANGUAGE', false) || 'es',
  },

  // ── Rutas (Sovereign Paths) ───────────────────────────────────────────────
  paths: {
    brain: env('BRAIN_ROOT', false) || path.join(__dirname, '../brain'),
    lfc2: env('LFC2_ROOT', false) || '/home/administrador/docker/LFC2',
  },
};

// Validación: al menos un proveedor de IA debe estar configurado
const hasGemini = !!config.ai.gemini.apiKey;
const hasGroq = !!config.ai.groq.apiKey;
const hasOpenrouter = !!config.ai.openrouter.apiKey;
const hasOllama = !!config.ai.ollama.host;

if (!hasGemini && !hasGroq && !hasOpenrouter && !hasOllama) {
  console.error('[CONFIG] [SICC FAIL] Debes configurar al menos una API de IA (Gemini, Groq, OpenRouter u Ollama)');
  process.exit(1);
}

console.log(`[CONFIG] [SICC OK] Agente: ${config.agent.name}`);
console.log(`[CONFIG] [SICC OK] Proveedor primario: ${config.ai.primaryProvider}`);
console.log(`[CONFIG] [SICC OK] Proveedores disponibles: ${[hasGemini && 'Gemini', hasGroq && 'Groq', hasOpenrouter && 'OpenRouter', hasOllama && 'Ollama'].filter(Boolean).join(', ')}`);

module.exports = config;
