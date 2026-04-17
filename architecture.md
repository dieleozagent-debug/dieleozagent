# 🏛️ Arquitectura SICC v12.9 — "Oráculo Certificado"

SICC (**Sistema Integrado de Control Contractual**) es una arquitectura de agente soberano para auditoría técnica y jurídica del proyecto LFC2 (Línea Ferroviaria de Carga 2, Colombia).

---

## 🛰️ Topología de Red (Nodo Único Soberano)

El sistema opera en un servidor Ubuntu dedicado con 4 servicios Docker + 1 proceso nativo.

### 1. Mapa de Servicios

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `dieleozagent-debug-dieleozagent-1` | — | Bot Telegram + orquestación de sueños |
| **Oracle NotebookLM** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad Externa — 108 fuentes "Contrato Ardanuy LFC" |
| **Base de Datos** | `sicc-postgres` | 5432 | pgvector — LTM contractual + memoria genética |
| **Ollama (Embeddings)** | **Nativo en Host** | 11434 | `nomic-embed-text` 768 dims, soberanía total |

### 2. Modelos de Inteligencia (Ollama local)

| Modelo | Función |
| :--- | :--- |
| `gemma4-light:latest` | Auditoría Forense — fallback offline |
| `nomic-embed-text` | Embeddings vectoriales (LTM) |
| `phi3.5:latest` | Análisis rápido de sintaxis |

### 3. Conectividad

- **Host → Ollama:** `localhost:11434` (`OLLAMA_HOST=0.0.0.0`)
- **Agente → Ollama:** alias `opengravity-ollama` → `172.20.0.1`
- **Agente → Oracle:** `http://notebooklm-mcp-v12:3001/sse` (red `docker_sicc_net`)
- **Agente → Postgres:** `sicc-postgres:5432`

---

## 🌪️ El Bucle de Decantación (Karpathy Loop) — v12.9

### Ciclo completo de `/dream [especialidad]`

```
Telegram: /dream telecomunicaciones
         │
         ▼
[index.js] exec(swarm-pilot.js, timeout:660s)
         │
         ▼ FASE 1 — VACUNACIÓN
[supabase.js] buscarLecciones(tema, 3)
  └─ sicc_genetic_memory → vacunas anti-alucinación inyectadas al prompt
         │
         ▼ FASE 2 — RAG MATCH
[sapi/supabase_rag.js] buscarSimilares(borrador, 5)
  └─ contrato_documentos → fragmentos literales del contrato LFC2
  └─ llamarMultiplexadorFree() → Borrador DT
         │
         ▼ FASE 3 — ORACLE CHECK
[sapi/notebooklm_mcp.js] validarExternaNotebook(borrador)
  └─ SSE → notebooklm-mcp-v12:3001
  └─ Google Chrome (Patchright) → NotebookLM (108 fuentes)
  └─ Timeout: 3 min (BROWSER_TIMEOUT=120s en Oracle)
         │
         ▼ FASE 4 — JUICIO
[swarm-pilot.js] llamarMultiplexadorFree(prompt_juez)
  └─ JSON: { aprobado, razon, categoria_fallida, leccion_karpathy }
         │
    ┌────┴────┐
APROBADO    RECHAZADO
    │            │
    ▼            ▼ FASE 5 — AUTO-TUNING
DT Final   brain/SPECIALTIES/{categoria}.md ← lección Karpathy
    │
    ▼
Telegram: ⚖️ VEREDICTO FINAL AL DESPERTAR
```

**Hard-caps:** MAX_CICLOS=3, exec timeout=11min, Oracle timeout=3min/consulta.

---

## 📡 Multiplexador de Proveedores IA — Cascada v12.9

Orden de escalación en `llamarMultiplexadorFree()`:

| Nivel | Proveedor | Modelo | Cuota / Costo |
|---|---|---|---|
| 1 | Gemini | `gemini-2.0-flash` | Free tier (límite diario ~1500 req) |
| 1 | Groq | `llama-3.3-70b-versatile` | Free tier (100K tokens/día) |
| 1 | Ollama | `gemma4-light` local | Sin límite — responde en español por prompt |
| 2 | OpenRouter | `openrouter/free` | Auto-selección: Nemotron 70B, Trinity Large, gpt-oss-120b… |
| 3 | OpenRouter | `gemini-2.0-flash-001` | ~$0.10/1M tokens — último recurso pagado |
| 3 | OpenRouter | `llama-3.3-70b-instruct` | ~$0.12/1M tokens — sin cuota diaria |

**Idioma garantizado:** Todos los llamados incluyen `REGLA ABSOLUTA DE IDIOMA: responde siempre en español` en el system prompt — incluyendo Ollama y OpenRouter.

---

## 🗄️ Infraestructura Vectorial (LTM)

### Colecciones Postgres/pgvector

| Colección | Función | Estado |
|---|---|---|
| `contrato_documentos` | Biblia Legal — Contrato LFC2 + normas | 🟢 Activo |
| `sicc_genetic_memory` | 53 lecciones aprendidas — Sistema Inmune | 🟢 Activo |

### Motor de Embeddings (Soberanía Dual)
1. **Primario:** `nomic-embed-text` vía Ollama local (768 dims, 100% soberano)
2. **Contingencia:** `text-embedding-004` vía Gemini Cloud

### Ingesta (Michelin v7.2)
- OCR con `pdftoppm` (300dpi) + Tesseract
- Checkpoints por archivo — resume-capable
- `node scripts/sicc-ingesta.js --path [ruta]`

---

## 🏛️ Jerarquía de Rutas Soberanas (SSoP)

| Directorio | Ruta en Contenedor | Función |
| :--- | :--- | :--- |
| **Raíz Agente** | `/home/administrador/docker/agente` | Código + Brain |
| **Cerebro (SSOT)** | `/home/administrador/docker/agente/brain` | R-HARD, IDENTITY, SPECIALTIES |
| **Oracle** | `/home/administrador/docker/notebook-mcp` | NotebookLM MCP server |
| **LFC2 (Docs)** | `/home/administrador/docker/LFC2` | Ingeniería externa |
| **Biblia Legal** | `/home/administrador/docker/agente/Contrato pdf` | PDFs contractuales |
| **Logs / Traces** | `/home/administrador/docker/agente/data/logs` | Telemetría forense |

---

## 🛡️ Gobernanza R-HARD

1. **CAPEX Blindado:** $726.000.000 COP máx (WBS 6.1.100)
2. **Normativa:** FRA 49 CFR Part 236 / AREMA / Manual Vial 2024
3. **CPU:** 80% → encolar en `AUDIT_QUEUE.md` / 95% → bloquear inferencia local
4. **Idioma:** Español obligatorio en toda salida del enjambre
5. **Verdad:** Oracle prevalece sobre intuición de la IA generativa

---

## 🛠️ Diagnóstico Rápido

```bash
# Estado de contenedores
docker ps --format "table {{.Names}}\t{{.Status}}"

# Oracle health
curl http://localhost:3001/health

# Test Oracle desde agente
docker exec dieleozagent-debug-dieleozagent-1 node -e "
  const {validarExternaNotebook}=require('./src/sapi/notebooklm_mcp');
  validarExternaNotebook('hola').then(r=>console.log(r?.substring(0,200)));
"

# Logs agente en vivo
docker compose logs -f --tail=30
```

---

*Certificado: OpenGravity Forensic Auditor — v12.9 "Oráculo Certificado" — 2026-04-17*
