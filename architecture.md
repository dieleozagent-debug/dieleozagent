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
  DT_CERTIFICADA (vector)
  VEREDICTO_JUEZ (vector)
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
| `sicc_genetic_memory` | `supabase.js` | Al **completar** cada ciclo — veredicto + DT si aprobada |
| `brain/AUDIT_QUEUE.md` | `resource-governor.js` | CPU >80% — sueños encolados |

### Naming de archivos
- **Dictamen aprobado:** `DT-{PREFIX}-{AÑO}-{SEQ}_{Descripcion}_APROBADO.md`
  - Prefix por área: señaliz→CTSC, telecom→COMS, energi→ENRG, integr→INTG, control→CTRL, ence→ENCE
- **Sueño (log):** `DREAM-{AREA}-{ISO_TIMESTAMP}.md`
- **Pending:** `PENDING-{AREA}-{FECHA}.md`

---

## 🗃️ Infraestructura Vectorial (LTM)

| Tabla Postgres | Función |
|---|---|
| `contrato_documentos` | Biblia Legal — Contrato LFC2 + normas técnicas (OCR chunking 800c/100c) |
| `sicc_genetic_memory` | 59 lecciones manuales + entradas automáticas DT_CERTIFICADA / VEREDICTO_JUEZ |

**Estado 2026-04-18:** Primera `DT_CERTIFICADA` real (dream ENCE) + `VEREDICTO_JUEZ` en DB. El pipeline de aprendizaje automático está activo.

**Embeddings:** `nomic-embed-text` (Ollama, 768 dims) → fallback `text-embedding-004` (Gemini)

---

## 📦 Pipeline DT → LFC2 → Vercel

Las DTs certificadas en `brain/dictamenes/` se **promueven manualmente** al repo documental:

```
brain/dictamenes/DT-*.md
        │ (copia manual / promote automático PENDIENTE)
        ▼
LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/
        │ node scripts/lfc-cli.js cook && serve
        ▼
X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/
        │ git push LFC2 origin main
        ▼
lfc-2.vercel.app (Vercel auto-deploy)
```

| Script agente | Qué hace con LFC2 |
|---|---|
| `forensic_auditor.js` | Escanea LFC2, usa `brain/dictamenes/` como referencia de pureza |
| `simulator.js` | Lee dictámenes como "gold standards" para validar propuestas |
| `sicc-harness.js` | Audita git LFC2, genera dictámenes contractuales en `II_A_Analisis_Contractual/` |

**Variable clave:** `LFC2_ROOT=/home/administrador/docker/LFC2` (`.env`)

---

## ⚠️ Deuda Técnica Identificada (2026-04-18)

### Dead code en `agent.js`
| Elemento | Problema |
|---|---|
| `rutarEstrategiaAdvisor` | Importado, nunca llamado |
| `encolarHallazgo` | Importado, nunca llamado |
| `PROMPT_FULL` | Construido pero nunca llega al LLM (solo `PROMPT_FAST` se usa) |
| `rutarEspecialidad()` + `ESPECIALIDADES` | Calculan `finalPrompt` que `systemPromptSoberano` sobreescribe |

### Archivos muertos (pendiente eliminación)
- **`src/`**: `cachear_contrato`, `extract_to_md`, `gitlocal`, `ingestar_contrato`, `ingestar_gemini`, `ocr_pilot`, `ocr_sovereign`, `test_migracion_soberana`
- **`scripts/`**: `sicc-dreamer`, `sicc-seed-memory`, `lfc-doctor`, `scorecard-v2`, `sicc-rag-match`, `sicc-sentinel`, `sicc-sweep`, `sit-simulator`, `next_dream`, 7 archivos `test_*`, 4 one-offs (`fix_encoding`, `fix_telecom_html`, `normalize_paths`, `sync_links`)

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

# DTs certificadas
ls brain/dictamenes/

# Estado learning pipeline
docker exec sicc-postgres psql -U sicc_app -d postgres_sicc \
  -c "SELECT COUNT(*), COALESCE(metadata->>'tipo','sin_tipo') FROM sicc_genetic_memory GROUP BY 2;"

# Sueños recientes
ls brain/DREAMS/ | tail -5

# Pendientes revisión humana
ls brain/PENDING_DTS/
```

---

*Actualizado: 2026-04-18 | OpenGravity SICC v12.9*
