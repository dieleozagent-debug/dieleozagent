# 🏛️ Arquitectura SICC v12.9 — "Oráculo Certificado"

SICC (**Sistema Integrado de Control Contractual**) es una arquitectura de agente soberano para auditoría técnica y jurídica del proyecto LFC2 (Línea Ferroviaria de Carga 2, Colombia).

---

## 🛰️ Topología de Red (Nodo Único Soberano)

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `dieleozagent-debug-dieleozagent-1` | — | Bot Telegram + orquestación de sueños |
| **Oracle NotebookLM** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad Externa — 108 fuentes "Contrato Ardanuy LFC" |
| **Base de Datos** | `sicc-postgres` | 5432 | pgvector — LTM contractual + memoria genética |
| **Ollama (Embeddings)** | **Nativo en Host** | 11434 | `nomic-embed-text` 768 dims, soberanía total |

### Conectividad
- **Agente → Ollama:** alias `opengravity-ollama` → `172.20.0.1` (extra_hosts)
- **Agente → Oracle:** `http://notebooklm-mcp-v12:3001/sse` (red `docker_sicc_net`)
- **Agente → Postgres:** `sicc-postgres:5432`

---

## 📡 Multiplexador de Proveedores IA — Cascada v12.9

| Nivel | Proveedor | Modelo | Nota |
|---|---|---|---|
| 1 | Gemini | `gemini-2.0-flash` | Free tier — agotado en uso intensivo |
| 1 | Groq | `llama-3.3-70b-versatile` | Free 100K tokens/día |
| 1 | Ollama local | `gemma2:2b` | Sin límite, prompt segmentado 4 secciones |
| 2 | OpenRouter free | auto | Nemotron 70B, Trinity, gpt-oss-120b… |
| 3 | OpenRouter pagado | `gemini-2.0-flash-001` | ~$0.10/1M tokens |
| 3 | OpenRouter pagado | `llama-3.3-70b-instruct` | ~$0.12/1M tokens — sin cuota diaria |

**Skip 429:** `proveedorBloqueadoReciente()` saltea proveedores con 429 en últimos 15 min.
**Ollama timeout:** 45s — prompt estructurado en 4 secciones (`construirPromptOllama`).

---

## 🌪️ Bucle de Decantación Karpathy — `/dream [área]`

```
Telegram: /dream señalizacion
         │
         ▼
[index.js] exec(swarm-pilot.js, timeout: 1800s / 30 min)
         │
         ▼ ── hasta 3 ciclos ──────────────────────────────────────────
         │
         ▼ FASE 1 — VACUNACIÓN GENÉTICA
[supabase.js] buscarLecciones(área, 3)
  └─ sicc_genetic_memory → lecciones + DTs certificadas previas del área
         │
         ▼ FASE 2 — GENERACIÓN (Auditor Forense Soberano)
[sicc-multiplexer.js] llamarMultiplexadorFree(prompt_auditor)
  └─ Borrador DT generado (texto completo)
         │
         ▼ FASE 3 — CÁMARA DE DOBLE CIEGO
[sapi/supabase_rag.js] validarInternaSupabase(borrador)
  └─ contrato_documentos → fragmentos literales del contrato LFC2

[sapi/notebooklm_mcp.js] validarExternaNotebook(borrador)
  └─ SSE → notebooklm-mcp-v12:3001 → Chrome (Patchright) → NotebookLM
  └─ Timeout cliente: 90s | Auto-restart Chrome: docker restart si -32001
         │
         ▼ FASE 4 — JUICIO (Juez Soberano)
[sicc-multiplexer.js] llamarMultiplexadorFree(prompt_juez)
  └─ Parser robusto: JSON limpio → code fence → campo a campo → inferencia
  └─ { aprobado, razon, categoria_fallida, leccion_karpathy }
         │
    ┌────┴──────────────────────┐
APROBADO                   RECHAZADO
    │                          │
    ▼ PERSISTENCIA             ▼ FASE 5 — KARPATHY AUTO-TUNING
brain/dictamenes/          brain/SPECIALTIES/{categoria}.md ← lección
  DT-CTSC-2026-XXX_*.md    brain/PENDING_DTS/PENDING-*.md ← borrador impuro
brain/DREAMS/              brain/DREAMS/DREAM-*-RECHAZADO.md
  DREAM-*-CERTIFICADO.md
sicc_genetic_memory        [siguiente ciclo con lección inyectada]
  (vector embedding)
    │
    ▼
Telegram: ⚖️ VEREDICTO FINAL AL DESPERTAR
```

**Hard-caps:** MAX_CICLOS=3 | exec timeout=1800s | Oracle timeout cliente=90s

---

## 🗄️ Brain — Jerarquía de Directorios

| Directorio | Escrito por | Cuándo |
|---|---|---|
| `brain/dictamenes/` | `swarm-pilot.js` | Al **aprobar** el Juez — texto completo DT |
| `brain/DREAMS/` | `swarm-pilot.js` | Siempre — aprobado **y** rechazado |
| `brain/PENDING_DTS/` | `swarm-pilot.js` | Al **rechazar** tras 3 ciclos — borrador impuro para revisión humana |
| `brain/SPECIALTIES/*.md` | `swarm-pilot.js` | Al **rechazar** — lección Karpathy append |
| `sicc_genetic_memory` | `supabase.js` | Al **aprobar** — vector embedding del DT |
| `brain/AUDIT_QUEUE.md` | `resource-governor.js` | CPU >80% — sueños encolados |

### Naming de archivos
- **Dictamen aprobado:** `DT-{PREFIX}-{AÑO}-{SEQ}_{Descripcion}_APROBADO.md`
  - Prefix por área: señaliz→CTSC, telecom→COMS, energi→ENRG, integr→INTG, control→CTRL
- **Sueño (log):** `DREAM-{AREA}-{ISO_TIMESTAMP}.md`
- **Pending:** `PENDING-{AREA}-{FECHA}.md`

---

## 🗃️ Infraestructura Vectorial (LTM)

| Tabla Postgres | Función |
|---|---|
| `contrato_documentos` | Biblia Legal — Contrato LFC2 + normas técnicas |
| `sicc_genetic_memory` | Lecciones Karpathy + DTs certificadas (tipo: DT_CERTIFICADA) |

**Embeddings:** `nomic-embed-text` (Ollama, 768 dims) → fallback `text-embedding-004` (Gemini)

---

## 🛡️ Gobernanza R-HARD

1. **CAPEX Blindado:** $726.000.000 COP máx (WBS 6.1.100)
2. **Normativa:** FRA 49 CFR Part 236 / AREMA / Manual Vial 2024
3. **CPU:** >80% → encolar | >95% → bloquear inferencia local
4. **Idioma:** Español obligatorio en toda salida del enjambre
5. **Verdad:** Oracle prevalece sobre intuición de la IA generativa

---

## 🛠️ Diagnóstico Rápido

```bash
# Estado contenedores
docker ps --format "table {{.Names}}\t{{.Status}}"

# Oracle health
curl http://localhost:3001/health

# Test Oracle directo
docker exec dieleozagent-debug-dieleozagent-1 node -e "
  const {validarExternaNotebook}=require('./src/sapi/notebooklm_mcp');
  validarExternaNotebook('test').then(r=>console.log(r?.substring(0,200)));
"

# DTs certificadas
ls brain/dictamenes/

# Sueños recientes
ls brain/DREAMS/ | tail -5

# Pendientes revisión humana
ls brain/PENDING_DTS/
```

---

*Actualizado: 2026-04-18 | OpenGravity SICC v12.9 "Oráculo Certificado"*
