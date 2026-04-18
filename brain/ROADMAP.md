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
| Handler bot para preguntas "¿dónde están las DTs?" | ✅ |
| Handler bot para preguntas sobre soul/identidad/aprendizaje | ✅ |
| Primera `DT_CERTIFICADA` + `VEREDICTO_JUEZ` real en `sicc_genetic_memory` (dream ENCE 2026-04-18) | ✅ |
| Audit completo de archivos muertos y dead code en agent.js | ✅ |

---

## 🔴 PENDIENTE — Alta prioridad

| Ítem | Descripción |
|---|---|
| **Limpieza de archivos muertos** | Eliminar 8 `src/` + 15+ `scripts/` sin referencias activas (ver sección DEUDA TÉCNICA) |
| **Limpiar dead code en `agent.js`** | Eliminar `rutarEstrategiaAdvisor`, `encolarHallazgo`, `PROMPT_FULL`, `rutarEspecialidad()`, `ESPECIALIDADES` — nunca se ejecutan |
| **`promote` DT→LFC2** | Comando que copia DT de `brain/dictamenes/` → `LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/` + git commit automático |
| **Validar `/dream telecomunicaciones`** | Con todos los fixes activos — Oracle, parser Juez, persistencia |
| **Re-ingesta con chunking nuevo** | Fragmentos pre-fix son oversized — re-ingestar con max 800c + overlap 100c |

## 🟡 PENDIENTE — Media prioridad

| Ítem | Descripción |
|---|---|
| Rate limit Gemini/Groq | Rotación automática de API keys cuando se agota daily quota |
| `SICC_OPERATIONS.md` auto-actualización | Tras cada sueño — fecha, área, veredicto |
| Test `/cerebro` | Valida que SOUL + R-HARD aparecen activos en prompt |

---

## 🔧 DEUDA TÉCNICA — Archivos a eliminar

### `src/` sin referencias activas
```
cachear_contrato.js     — reemplazado por ingest_masivo.js
extract_to_md.js        — herramienta one-off
gitlocal.js             — no usado por ningún handler activo
ingestar_contrato.js    — superado por ingest_masivo.js
ingestar_gemini.js      — superado por ingest_masivo.js
ocr_pilot.js            — superado por ingest_masivo.js
ocr_sovereign.js        — superado por ingest_masivo.js
test_migracion_soberana.js — script de prueba, no módulo
```

### `scripts/` sin referencias activas
```
sicc-dreamer.js         — reemplazado por swarm-pilot.js
sicc-seed-memory.js     — ejecución única completada (59 entradas sembradas)
lfc-doctor.js           — duplica cmdDoctor de sicc-harness.js
scorecard-v2.js         — no referenciado
sicc-rag-match.js       — no referenciado
sicc-sentinel.js        — no referenciado
sicc-sweep.js           — no referenciado
sit-simulator.js        — no referenciado
next_dream.js           — no referenciado
fix_encoding.js         — one-off ejecutado
fix_telecom_html.js     — one-off ejecutado
normalize_paths.js      — one-off ejecutado
sync_links.js           — one-off ejecutado
debug_db_conn.js        — debug temporal
test-factory.js         — no invocado
test-oracle-sapi.js     — no invocado
test-resiliencia.js     — no invocado
test_db_fix.js          — no invocado
test_gmail_connectivity.js — no invocado
test_inside_conn.js     — no invocado
test_michelin_health.js — no invocado
```

### Dead code en `agent.js` (líneas ~10-11, 107-156, 162-203)
```
rutarEstrategiaAdvisor  — importado, nunca llamado
encolarHallazgo         — importado, nunca llamado
PROMPT_FULL             — construido, exportado, nunca llega al LLM
rutarEspecialidad()     — calcula especialidadPrompt que finalPrompt ignora
ESPECIALIDADES dict     — sobreescrito por getMultiplexedContext()
finalPrompt             — construido pero systemPromptSoberano lo ignora
```

---

## 🔗 Pipeline DT → LFC2 → Vercel (flujo actual — manual)

```
brain/dictamenes/DT-*.md
        │ (copia manual hoy / promote automático pendiente)
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

*Actualizado: 2026-04-18 | OpenGravity SICC v12.9*
