# 🤖 OpenGravity SICC — Agente Soberano v12.2

> **⚡ INICIO RÁPIDO:** Lee roadmap.md primero para saber el estado exacto del proyecto.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC, Colombia).

---

## 🚀 Cómo arrancar / verificar

```bash
# Ver estado del contenedor
cd /home/administrador/docker/agente
docker compose ps

# Ver logs en vivo
docker compose logs -f --tail=30

# Reiniciar si es necesario
docker compose restart
```

**Red Docker:** `docker_sicc_net`
**Bridge Host:** `172.20.0.1` (Ollama Gateway)
**Volumen LFC2:** montado en `/home/administrador/docker/LFC2`

---

## 📡 Proveedores IA (en orden de prioridad)

1. **Gemini** (Google) — primario
2. **Groq** — fallback gratuito
3. **OpenRouter** — fallback secondary
4. **Ollama** (local) — fallback offline (Nativo en Host via 0.0.0.0)

---

## 💬 Comandos Telegram Activos

| Comando | Función |
|---|---|
| /dream [ruta] | Karpathy Dreamer (Cámara Doble Ciego) |
| /doctor | Health report del sistema SICC (Score: 100/100) |
| /learn | Mapear recursivamente LFC2 y actualizar rutas |
| /audit [ruta] | Auditoría forense manual sobre una carpeta específica |
| /ingesta | Iniciar motor de ingesta con backoff exponencial |
| /cerebro | Verificar integridad de IDENTITY.md, SOUL.md, R-HARD.md |
| /limpiar | Reset cognitivo de la sesión |

## 🚀 Estado Actual: v12.2 "Paz Estructural"
- **Estado:** 🟢 Operativo (**100/100 Certificado**).
- **Cerebro:** `SOUL.md` (Ética) y `IDENTITY.md` sincronizados y restaurados.
- **Infraestructura:** Ollama Nativo (Host) con puente DNS (Bridge IP 172.20.0.1).
- **Misión:** Patrulla Forense continua sobre LFC2.

---

## 🗂️ Repositorios del Ecosistema

| Repo | Ruta | Propósito |
|---|---|---|
| **agente** | /home/administrador/docker/agente | Motor bot + lógica |
| **LFC2** | /home/administrador/docker/LFC2 | Documentos ingeniería (read-only) |
| **notebook-mcp** | /home/administrador/docker/notebook-mcp | MCP de notebooks |

---

## ⚠️ Reglas Operativas (NO ignorar)

1. **Gobernanza R-HARD:** CAPEX máximo $726M COP, FRA 49 CFR Part 236.
2. **Ollama en Host:** Escuchando en `0.0.0.0` para acceso desde Docker via `172.20.0.1`.
3. **LFC2 es read-only:** El agente no modifica ingeniería directamente.

---

## 🧠 Cerebro (brain/)

```bash
brain/
├── IDENTITY.md       ← ADN del agente v6. Mandatos soberanos.
├── SOUL.md           ← Ética operacional. Eficiencia + silencio.
├── R-HARD.md         ← 7 restricciones duras del contrato.
├── SICC_OPERATIONS.md← Tablero de gobernanza y auditoría.
├── SPECIALTIES/      ← Mini-Cerberos por especialidad técnica.
└── GENETIC_EVOLUTION.md ← Bitácora de aprendizaje Karpathy.
```
