# 🗺️ Roadmap OpenGravity SICC — v13.0 (Estado real 2026-04-18)

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
| Primera `DT_CERTIFICADA` + `VEREDICTO_JUEZ` real en `sicc_genetic_memory` (dream ENCE 2026-04-18) | ✅ |
| **Refactor `src/index.js`** 790→142 líneas (handlers.js + utils/send.js) | ✅ |
| **Dead code eliminado en `agent.js`** (rutarEspecialidad, ESPECIALIDADES, encolarHallazgo, sumarizarContexto) | ✅ |
| **Trazas FASE-0..5** en `procesarMensaje()` para audit de flujo | ✅ |
| **Cabeceras `@agent-prompt`** en index.js, handlers.js, agent.js, utils/send.js, intents/*.js | ✅ |
| **26 archivos muertos eliminados** (scripts/ + src/) | ✅ |
| **Intents de lenguaje natural** extraídos a `src/intents/` — handlers.js es router puro | ✅ |
| Handler: saludos naturales (hola/buenas/hi sin barra) | ✅ |
| Handler: soul/identidad/aprendizaje | ✅ |
| Handler: enjambre/lecciones Karpathy ya activas | ✅ |
| Handler: sueños/DREAMS/PENDING (lenguaje natural) | ✅ |
| Handler: temas para /dream + roadmap pendiente | ✅ |
| Handler: historial por área (comunicaciones, señalización, etc.) | ✅ |
| Handler: DTs bloqueadas/sin promover/PENDING revisión humana | ✅ |
| Handler: qué hacemos con [DT-nombre] → resumen + pasos promote | ✅ |
| Handler: guía de navegación "me pierdo / cómo empiezo" | ✅ |

---

## 🔴 PENDIENTE — Alta prioridad

| Ítem | Descripción |
|---|---|
| **`/promote` DT→LFC2** | Comando que copia DT de `brain/dictamenes/` → LFC2 + git commit automático. Usa `src/gitlocal.js`. |
| **Validar `/dream telecomunicaciones`** | Primer dream post-refactor con todas las vacunas activas — validar Oracle, parser, persistencia. |
| **Re-ingesta `contrato_documentos`** | Fragmentos pre-fix oversized — re-ingestar con max 800c + overlap 100c. |
| **Probar `ejecutarSondaForense` en simulator.js** | Corregida con `llamarMultiplexadorFree`, pendiente prueba real con simulator.js. |

## 🟡 PENDIENTE — Media prioridad

| Ítem | Descripción |
|---|---|
| Rate limit Gemini/Groq | Rotación automática de API keys cuando se agota daily quota |
| `SICC_OPERATIONS.md` auto-actualización | Tras cada sueño — fecha, área, veredicto |
| Wire `scripts/sicc-rag-match.js` → `/audit` | Valida que párrafos de LFC2 tienen ancla en Supabase |
| `src/ingestar_gemini.js` como OCR premium | Activar como fallback de tesseract para PDFs escaneados |

---

## 🤖 Intents Directos Activos (sin costo LLM)

| Trigger | Módulo | Responde con |
|---|---|---|
| `hola` / `buenas` / `hi` | handlers.js | Menú de comandos |
| `me pierdo / cómo empiezo / cómo me ayudas` | navigation.js | Guía rápida del flujo |
| `como aprende tu soul / quien eres` | brain-state.js | SOUL.md + pipeline aprendizaje |
| `el enjambre ya entiende / necesitas algo` | brain-state.js | Estado lecciones Karpathy |
| `qué sueños tienes pendientes / dreams` | dream-state.js | DREAMS/ + PENDING_DTS/ |
| `qué temas puedo proponer / roadmap` | dream-state.js | SPECIALTIES/ + ROADMAP.md |
| `historial de comunicaciones / señalización` | dream-state.js | Lecciones + DTs + Vercel |
| `dónde están las DTs / dictamenes` | dt-ops.js | brain/dictamenes/ + DREAMS/ |
| `qué DT tengo bloqueadas / pendientes` | dt-ops.js | Aprobadas / sin promover / PENDING |
| `qué hacemos con DT-ENRG-2026-004` | dt-ops.js | Resumen DT + pasos promote |

**Para agregar un intent:** crear `src/intents/nuevo.js` + añadir al array `INTENTS` en handlers.js.

---

## 🗂️ Archivos rescatados (funcionalidad pendiente de activar)

| Archivo | Funcionalidad rescatada |
|---|---|
| `src/gitlocal.js` | Operaciones git sobre LFC2 — necesario para `/promote` DT→LFC2 |
| `src/ingestar_gemini.js` | Ingesta OCR premium vía Gemini File API — alternativa a tesseract |
| `scripts/sicc-rag-match.js` | Valida que párrafos de LFC2 tienen ancla en Supabase — útil para `/audit` |

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
lfc-2.vercel.app (auto-deploy ~2 min)
```

---

*Actualizado: 2026-04-18 | OpenGravity SICC v13.0*
