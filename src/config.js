// config.js — Lectura y validación centralizada de variables de entorno
'use strict';

require('dotenv').config({ path: __dirname + '/../.env' });

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
      model: env('OPENROUTER_MODEL', false) || 'openai/gpt-4o-mini',
    },

    ollama: {
      host: env('OLLAMA_HOST', false) || 'http://ollama:11434',
      model: env('OLLAMA_MODEL', false) || 'sicc-cerebro:latest',
    },

    // ── Swarm de Alta Velocidad (Hybrid Mode) ──────────────────────────────
    swarm: {
      auditor: env('SWARM_MODEL_AUDITOR', false) || 'deepseek/deepseek-chat',
      strategist: env('SWARM_MODEL_STRATEGIST', false) || 'anthropic/claude-3.5-sonnet',
      sumarizador: env('SUMMARIZER_MODEL', false) || 'meta-llama/llama-3.1-8b-instant',
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
  console.error('[CONFIG] ❌ Debes configurar al menos una API de IA (Gemini, Groq, OpenRouter u Ollama)');
  process.exit(1);
}

console.log(`[CONFIG] ✅ Agente: ${config.agent.name}`);
console.log(`[CONFIG] ✅ Proveedor primario: ${config.ai.primaryProvider}`);
console.log(`[CONFIG] ✅ Proveedores disponibles: ${[hasGemini && 'Gemini', hasGroq && 'Groq', hasOpenrouter && 'OpenRouter', hasOllama && 'Ollama'].filter(Boolean).join(', ')}`);

module.exports = config;
