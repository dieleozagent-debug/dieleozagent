# 🤖 OpenGravity SICC — Agente Soberano v12.9

> **⚡ INICIO RÁPIDO:** Lee `roadmap.md` para el estado exacto del proyecto.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC2, Colombia).

---

## 🚀 Estado Actual: v12.9 "Oráculo Certificado"

- **Estado:** 🟢 Operativo — Ciclo `/dream` end-to-end validado con Oracle respondiendo datos reales del contrato.
- **Oracle:** 🟢 `notebooklm-mcp-v12` — 108 fuentes "Contrato Ardanuy LFC" activas.
- **CPU:** Gobernanza R-HARD activa (Umbral 80%, Throttling 2s).
- **Memoria:** LTM Supabase Vectorial integrada con pgvector + Ollama embeddings.

---

## 🗺️ Mapa de Rutas Soberanas (SSoP)

| Recurso | Ruta Absoluta (Docker) |
| :--- | :--- |
| **Raíz Código** | `/home/administrador/docker/agente` |
| **Cerebro (SSOT)**| `/home/administrador/docker/agente/brain` |
| **Contrato (PDFs)**| `/home/administrador/docker/agente/Contrato pdf` |
| **Base Legal** | `/home/administrador/docker/LFC2` |
| **Logs / Traces** | `/home/administrador/docker/agente/data/logs` |
| **Oracle MCP** | `/home/administrador/docker/notebook-mcp` |

---

## 🚀 Cómo arrancar / verificar

```bash
cd /home/administrador/docker/agente
docker compose ps

# Logs en vivo
docker compose logs -f --tail=30

# Verificar Oracle
curl http://localhost:3001/health
```

---

## 📡 Proveedores IA (orden de prioridad)

1. **Gemini** (Google) — primario
2. **Groq** — fallback gratuito (70B)
3. **OpenRouter** — híbrido cloud
4. **Ollama** (local) — fallback offline, nativo en host via 0.0.0.0:11434

---

## 💬 Comandos Telegram

| Comando | Función |
|---|---|
| `/dream [tema]` | **Karpathy Auto-Dream**: Ciclo 5 fases — Vacunación → RAG → Oracle → Juicio → Auto-tuning |
| `/swarm [pregunta]` | **Enjambre Secuencial**: Auditor + Estratega SICC (~10 min) |
| `/doctor` | **Health Report**: Diagnóstico de pureza técnica, CPU, telemetría 4xx |
| `/learn` | **Auto-Aprendizaje**: Mapeo recursivo LFC2 y reflexión sobre SSOT |
| `/cerebro` | **Integridad ADN**: Verifica IDENTITY, SOUL, R-HARD |
| `/ingesta [ruta]` | **Pipeline OCR**: Ingesta masiva de PDFs al vector DB |
| `/cmd [comando]` | **Shell**: Ejecuta comandos en el contenedor |

---

## 🌪️ El Ciclo `/dream` — 5 Fases de Decantación (v12.9)

```
/dream [tema]
    │
    ├─ Fase 1: VACUNACIÓN
    │   └─ Consulta sicc_genetic_memory → inyecta vacunas anti-alucinación
    │
    ├─ Fase 2: RAG MATCH
    │   └─ buscarSimilares() en contrato_documentos → Borrador DT
    │
    ├─ Fase 3: ORACLE CHECK
    │   └─ validarExternaNotebook() → notebooklm-mcp-v12:3001/sse
    │       └─ Patchright + Google Chrome → NotebookLM (108 fuentes LFC2)
    │
    ├─ Fase 4: JUICIO (Swarm Pilot)
    │   └─ Juez AI cruza Borrador + Feedback Oracle → VEREDICTO
    │
    └─ Fase 5: AUTO-TUNING
        └─ Si RECHAZADO → lección en brain/SPECIALTIES/*.md
```

**Hard-cap:** 3 ciclos máx, 11 min por `/dream` (timeout exec).

---

## 🗄️ Infraestructura

| Servicio | Contenedor | Puerto | Estado |
|---|---|---|---|
| Agente Core | `dieleozagent-debug-dieleozagent-1` | 3000 | 🟢 |
| Oracle NotebookLM | `notebooklm-mcp-v12` | 3001 (SSE) | 🟢 |
| Postgres + pgvector | `sicc-postgres` | 5432 | 🟢 |
| Ollama (embeddings) | Nativo en host | 11434 | 🟢 |

---

## 🧠 Cerebro (brain/)

```
brain/
├── IDENTITY.md       ← ADN del agente v6
├── SOUL.md           ← Ética operacional
├── R-HARD.md         ← 7 restricciones duras (CAPEX $726MM, fechas 2025-2026)
├── SICC_METHODOLOGY.md ← Protocolo N-1 deductivo
├── SPECIALTIES/      ← 6 mini-expertos (Señalización, Comms, Energía...)
├── dictamenes/       ← Decisiones Técnicas aprobadas (inmutables)
└── sources/          ← Base legal (49 CFR, AREMA, Manual Vial 2024)
```
