# 🗺️ Roadmap OpenGravity SICC — v12.9 (Estado real 2026-04-18)

---

## ✅ COMPLETADO

| Ítem | Estado |
|---|---|
| Ciclo `/dream` end-to-end (Auditor → Oracle → Juez → Karpathy) | ✅ |
| Oracle NotebookLM MCP — 108 fuentes LFC2 | ✅ |
| Auto-restart Chrome en -32001 (`docker restart`) | ✅ |
| Parser Juez robusto (JSON → code fence → campos → inferencia) | ✅ |
| Persistencia DT aprobada en `brain/dictamenes/` | ✅ |
| Registro `brain/DREAMS/` (aprobado y rechazado) | ✅ |
| `brain/PENDING_DTS/` para borradores impuros tras 3 ciclos | ✅ |
| Vectorización DT certificada en `sicc_genetic_memory` | ✅ |
| Vectorización veredicto Juez (aprobado + rechazado) | ✅ |
| brain.js reducido a 4 archivos efectivos (SOUL, R-HARD, IDENTITY, METHODOLOGY) | ✅ |
| Ingesta con chunking max 800 chars + overlap 100 chars | ✅ |
| Truncado query Supabase RAG a 500 chars | ✅ |
| Skip 429 reciente en cascada de proveedores | ✅ |
| exec timeout 30 min | ✅ |
| Retry Telegram en ECONNRESET | ✅ |
| Arquitectura DT → LFC2 → Vercel documentada | ✅ |
| Handler bot: "¿dónde están las DTs?" | ✅ |
| Handler bot: soul/identidad/aprendizaje | ✅ |
| Handler bot: sueños/dreams/pendientes (lenguaje natural) | ✅ |
| Handler bot: temas para /dream + roadmap pendiente | ✅ |
| Handler bot: saludos naturales (hola/buenas/hi sin barra) | ✅ |
| Primera `DT_CERTIFICADA` + `VEREDICTO_JUEZ` real en `sicc_genetic_memory` (dream ENCE 2026-04-18) | ✅ |
| Refactor `src/index.js` 790→142 líneas (handlers.js + utils/send.js) | ✅ |
| Dead code eliminado en `agent.js` (rutarEspecialidad, ESPECIALIDADES, encolarHallazgo, rutarEstrategiaAdvisor, sumarizarContexto) | ✅ |
| Trazas FASE-0..5 en `procesarMensaje()` para audit de flujo | ✅ |
| Cabeceras `@agent-prompt` en index.js, handlers.js, utils/send.js, agent.js | ✅ |
| 26 archivos muertos eliminados (scripts/ + src/) | ✅ |

---

## 🔄 EN PROGRESO AHORA

_(ninguno — refactor completado)_

---

## 🔴 PENDIENTE — Alta prioridad

| Ítem | Descripción |
|---|---|
| **`promote` DT→LFC2** | Comando `/promote` que copia DT de `brain/dictamenes/` → `LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/` + git commit automático. Usa `src/gitlocal.js`. |
| **Validar `/dream telecomunicaciones`** | Primer dream post-refactor — validar Oracle, parser Juez, persistencia con código nuevo. |
| **Re-ingesta con chunking nuevo** | Fragmentos pre-fix son oversized — re-ingestar `contrato_documentos` con max 800c + overlap 100c. |
| **`ejecutarSondaForense` roto en simulator.js** | Usaba `new OpenAI()` no importado — parcialmente corregido con `llamarMultiplexadorFree`, pero simulator.js necesita prueba real. |

## 🟡 PENDIENTE — Media prioridad

| Ítem | Descripción |
|---|---|
| Rate limit Gemini/Groq | Rotación automática de API keys cuando se agota daily quota |
| `SICC_OPERATIONS.md` auto-actualización | Tras cada sueño — fecha, área, veredicto |
| Wire `scripts/sicc-rag-match.js` → `/audit` | Valida que párrafos de LFC2 tienen ancla en Supabase |
| `src/ingestar_gemini.js` como OCR premium | Activar como fallback de tesseract para PDFs escaneados |

---

## 🗂️ Archivos rescatados (funcionalidad pendiente de activar)

| Archivo | Funcionalidad rescatada |
|---|---|
| `src/gitlocal.js` | Operaciones git sobre LFC2 — necesario para `promote` DT→LFC2 |
| `src/ingestar_gemini.js` | Ingesta OCR premium vía Gemini File API — alternativa a tesseract |
| `scripts/sicc-rag-match.js` | Valida que párrafos de LFC2 tienen ancla en Supabase — útil para `/audit` |

## 🗑️ Eliminados (2026-04-18)

26 archivos eliminados: variantes antiguas de OCR/ingesta, scripts one-off, tests, duplicados.

---

## 🔗 Pipeline DT → LFC2 → Vercel (flujo actual — manual)

```
brain/dictamenes/DT-*.md
        │ (copia manual hoy / /promote automático PENDIENTE)
        ▼
LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/
        │ node scripts/lfc-cli.js cook && serve
        ▼
LFC2/X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/
        │ git push LFC2 origin main
        ▼
lfc-2.vercel.app (auto-deploy)
```

---

## 🤖 Handlers directos activos (sin costo de LLM)

| Trigger | Responde con |
|---|---|
| `hola` / `buenas` / `hi` | Menú de comandos |
| `como aprende tu soul` / `quien eres` | SOUL.md + pipeline de aprendizaje |
| `dónde están las DTs` / `dictamen` | Listado de `brain/dictamenes/` + `brain/DREAMS/` |
| `sueños pendientes` / `dreams` | Estado `brain/DREAMS/` + `brain/PENDING_DTS/` |
| `qué temas puedo proponer` / `pendiente de trabajo` | Áreas /dream + ROADMAP pendientes |
| `/cerebro` | Estado archivos brain/ |
| `/estado` | Proveedores IA activos |
| `/doctor` | Health score |

---

*Actualizado: 2026-04-18 | OpenGravity SICC v12.9*
