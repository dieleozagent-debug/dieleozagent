# 🏛️ Arquitectura Soberana — OpenGravity SICC v12.2 " Paz Estructural\

> **Fecha:** 16-Abr-2026 | **Estado:** Zero-Residue Certificado

## 🌌 Visión General

**OpenGravity** opera como un **Nodo Único Soberano**: un solo contenedor Docker con
lógica de resiliencia interna, sin scripts externos de supervisión, sin crons parásitos,
sin multi-nodo.

---

## 🏗️ Pilares del Diseño (v12.2)

- **Soberanía de Construcción:** Imágenes Docker estériles — ningún script de persistencia baked-in.
- **Resiliencia Interna:** Backoff exponencial nativo en Node.js (15s → 30s → 60s…) ante errores 429.
- **Orquestación Limpia:** Un solo docker-compose.yaml, un solo servicio gente.
- **Patrulla Pasiva:** El agente audita LFC2 pero **no auto-lanza** procesos pesados sin orden explícita.
- **Enjambre DESACTIVADO:** El modo swarm multi-agente fue fuente de alucinaciones — eliminado.

---

## 🗂️ Stack Real (lo que corre hoy)

| Capa | Tecnología |
|---|---|
| Runtime | Node.js 20-slim (Docker) |
| Interfaz | Telegram Bot (
ode-telegram-bot-api) |
| IA Primaria | Gemini API (Google) |
| IA Fallback | Groq → OpenRouter → Ollama (local) |
| RAG / Vector DB | Supabase (pgvector) — 22k fragmentos |
| Orquestación | Docker Compose — red docker_sicc_net |
| Knowledge Base | /home/administrador/docker/LFC2 (volumen montado) |

---

## 📁 Estructura del Proyecto

\\\
agente/
├── src/
│ ├── index.js # Entrypoint bot Telegram (comandos slash)
│ ├── agent.js # Motor principal — llamado con --vigilia
│ ├── brain.js # Construcción del system prompt + SSOT
│ ├── patrol.js # Patrulla pasiva forense sobre LFC2
│ ├── ingest_masivo.js # Ingesta resiliente con backoff exponencial
│ ├── advisor.js # Router de estrategia (sin swarm)
│ ├── supabase.js # RAG — búsqueda vectorial
│ └── config.js # Variables de entorno y rutas
├── brain/ # Cerebro del agente (SSOT local)
│ ├── IDENTITY.md # ADN v6 + mandatos soberanos
│ ├── SOUL.md # Ética y brújula operacional
│ ├── R-HARD.md # 7 restricciones duras innegociables
│ ├── SICC_OPERATIONS.md# Tablero de gobernanza
│ ├── ROADMAP.md # Roadmap de expansión futura
│ ├── SPECIALTIES/ # Mini-Cerberos por especialidad
│ └── skills/ # Contexto modular cargable
├── scripts/
│ ├── forensic_auditor.js # Ejecutor de auditoría por carpeta
│ ├── sicc-multiplexer.js # Router multi-proveedor IA
│ ├── resource-governor.js # Guard de CPU/RAM antes de tareas pesadas
│ └── sicc-harness.js # Wrappers /doctor /learn /audit
├── data/
│ ├── logs/ # patrol.log, sicc-traces.json
│ └── patrol-state.json # Cursor de patrulla (carpeta actual)
├── Dockerfile # node:20-slim, estéril
├── docker-compose.yaml # UN solo servicio: agente --vigilia
├── roadmap.md # ⚡ SSOT de estado — leer al iniciar sesión
└── README.md # Manual de uso
\\\

---

## 🔄 Flujo de Ejecución (Modo Vigilia)

\\\mermaid
graph TD
 A[Docker Compose] -->|node src/agent.js --vigilia| B[Agent Soberano v12.2]
 B --> C{Mensaje Telegram?}
 C -->|Sí| D[Procesar con RAG + Gemini]
 C -->|No| E[Patrulla Pasiva]
 D --> F[Supabase pgvector]
 F -->|contexto| G[Gemini API]
 G -->|429 error| H[Backoff Exponencial]
 H -->|retry| G
 G -->|respuesta| I[Telegram safeSendMessage]
 E --> J[forensic_auditor.js por carpeta]
 J -->|log| K[data/logs/patrol.log]
 J -->|siguiente carpeta| E
\\\

---

## 🧠 Lecciones Aprendidas Críticas (no repetir)

| # | Problema | Lección |
|---|---|---|
| LL-001 | Script SENTINEL baked en Docker image → inmortal | Imágenes estériles siempre |
| LL-002 | Hidra multi-nodo (local1/2/3) mismo token Telegram | Purga transversal en todos los nodos |
| LL-003 | while true ante errores 429 → DoS self-inflicted | Backoff exponencial en capa de app |
| LL-004 | Cron oculto en /etc/cron.d/ sobrevivió limpieza | Auditar /etc/cron.* y /etc/systemd/ |
| LL-005 | Swarm multi-agente → alucinaciones y colapso densidad | Enjambre DESACTIVADO permanentemente |

---

v12.2 \Paz Estructural\ — 16/04/2026 (Arquitectura Zero-Residue + Anti-Alucinación)
