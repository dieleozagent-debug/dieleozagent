# 🤖 OpenGravity SICC — Agente Soberano v12.2

> **⚡ INICIO RÁPIDO:** Lee oadmap.md primero para saber el estado exacto del proyecto.

**OpenGravity** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC, Colombia).

---

## 🚀 Cómo arrancar / verificar

\\\ash
# Ver estado del contenedor
cd /home/administrador/docker/agente
docker compose ps

# Ver logs en vivo
docker compose logs -f --tail=30

# Reiniciar si es necesario
docker compose restart
\\\

**Comando activo:** \
ode src/agent.js --vigilia\
**Red Docker:** \docker_sicc_net\
**Volumen LFC2:** montado en \/home/administrador/docker/LFC2\

---

## 📡 Proveedores IA (en orden de prioridad)

1. **Gemini** (Google) — primario
2. **Groq** — fallback gratuito
3. **OpenRouter** — fallback secondary
4. **Ollama** (local) — fallback offline

---

## 💬 Comandos Telegram Activos

| Comando | Función |
|---|---|
| /doctor | Health report del sistema SICC |
| /learn | Mapear recursivamente LFC2 y actualizar rutas |
| /audit [ruta] | Auditoría forense manual sobre una carpeta específica |
| /ingesta | Iniciar motor de ingesta con backoff exponencial |
| /cerebro | Verificar integridad de IDENTITY.md, SOUL.md, R-HARD.md |
| /limpiar | Reset cognitivo de la sesión |

> ⚠️ **Comandos ELIMINADOS (eran del enjambre/legacy):**
> /swarm, /dream, /git ls, /git cat, /git commits, /estado, /simulacion-sit

---

## 🗂️ Repositorios del Ecosistema

| Repo | Ruta | Propósito |
|---|---|---|
| **agente** | /home/administrador/docker/agente | Motor bot + lógica |
| **LFC2** | /home/administrador/docker/LFC2 | Documentos ingeniería (read-only para el agente) |
| **notebook-mcp** | /home/administrador/docker/notebook-mcp | MCP de notebooks |

---

## ⚠️ Reglas Operativas (NO ignorar)

1. **DTs y DJs generados por el agente = BASURA** — productos del enjambre desactivado, no commitear
2. **El enjambre (swarm) está DESACTIVADO** — era fuente de alucinaciones
3. **No hay Sentinel, no hay cron externo** — todo vive en src/agent.js
4. **Gobernanza R-HARD:** CAPEX máximo \ COP, FRA 49 CFR Part 236, hitos contractuales inamovibles
5. **LFC2 es read-only** — el agente puede leerlo y auditarlo, no modificarlo con contenido técnico

---

## 🧠 Cerebro (brain/)

\\\
brain/
├── IDENTITY.md       ← ADN del agente v6. Mandatos soberanos.
├── SOUL.md           ← Ética operacional. Eficiencia + silencio.
├── R-HARD.md         ← 7 restricciones duras del contrato.
├── SICC_OPERATIONS.md← Tablero de gobernanza y auditoría.
├── SPECIALTIES/      ← Mini-Cerberos por especialidad técnica.
└── skills/           ← Contexto modular cargable dinámicamente.
\\\

---

v12.2 " Paz Estructural\ — 16/04/2026
