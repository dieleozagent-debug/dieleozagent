# 🗺️ Roadmap OpenGravity Agente — v14.7 (Estado real 2026-05-08)

> **Sigla en cara externa:** los DTs publicados en LFC2 deben usar **SCC** (Sistema de Comunicación, Control de Tráfico y Señalización — sigla del BCD v001). La marca interna del agente "SICC" se reserva para metadata interna y NO debe aparecer en títulos/cifras visibles al gerente o Interventoría (colisión con SICC del AT4 = Sistema de Indicadores).

---

## 🚨 DEUDA CRÍTICA (bloquea regeneración de DTs)

| # | Ítem | Detalle | Acción |
|---|---|---|---|
| **D1** | **`agente/architecture.md` saneado parcial 2026-05-08** | Header corregido: 48h G.652.D, UPS 4h+24-48h diferenciada, Stop & Switch operacional FENOCO. Pendiente: revisar código/strings en `src/` que aún citen "64 hilos" o "UPS 24h eliminada". | Grep recursivo `src/`, `brain/SPECIALTIES/`, `data/` por terminología pre-BCD v001. |
| **D2** | **DTs legacy en LFC2 eliminados 2026-05-08** | `LFC2/II_A_Analisis_Contractual/dictamenes/` vaciado (57 archivos v8 producto de pruebas tempranas `/promote`: "Bus Vital 110V DC", "Red Vital IP", "DT-SICC-V8-*", cifras "CAPEX Protegido $X" sin trazabilidad). Conservados como histórico forense en `agente/brain/dictamenes/`. | Ver plan de regeneración abajo (post-D1+D0). |
| **D0** | **YAML Sección 10 ejecutable en DTs** (deuda histórica del LFC2 roadmap) | Las DTs generadas por el agente omiten la Sección 10 YAML requerida por la metodología `.42`. Sin YAML, `/promote` no puede propagar cambios al WBS ni a los HTML automáticamente. | Ajustar prompt del Auditor Forense para forzar emisión estricta de Sección 10 YAML. |
| **D3** | **Re-ingesta `contrato_documentos`** | pgvector contiene fragmentos pre-BCD v001. | `docker exec sicc-postgres ...` con BCD v001 como L4 vinculante. No disparar sin Vo.Bo. del Director Técnico UF2. |

---

## 🟢 PLAN PENDIENTE — Regeneración de DTs en LFC2 (post-D1 + D0)

Pendiente desde 2026-05-08. Bloqueado hasta cerrar D1 + D0. Cuando esté listo, ejecutar en este orden:

### Paso 1 — Cerrar deuda doctrinal del agente
- [ ] **D1 fix completo:** `grep -rn "64 hilos\|64h\|UPS 24h\|Vital IP\|Vital Bus" agente/src/ agente/brain/SPECIALTIES/ agente/data/` y reemplazar por terminología BCD v001 (48h G.652.D · UPS 4h+24-48h diferenciada · backbone óptico).
- [ ] **D0 fix:** ajustar prompt del Auditor Forense en `agente/src/` para emitir Sección 10 YAML estricta en cada DT.
- [ ] **D3 (opcional pero recomendado):** re-ingestar `contrato_documentos` en pgvector con BCD v001 como L4 vinculante. Solo con Vo.Bo. Director Técnico UF2.

### Paso 2 — Generar DTs por especialidad con SSoT BCD v001

Comandos de Telegram al agente, en orden de prioridad por riesgo material:

```
/audit fibra            → DTs cubriendo R-FO-PROF, R-FO-AEREO, R-FO-CRUCE-VEH/FERREO, R-FO-PUENTE
/audit señalizacion     → DTs PTC virtual + 5 ENCE + cantonamiento
/audit comunicaciones   → DTs TETRA cobertura + EN 50159 + redundancia satelital
/audit energia          → DTs UPS diferenciada + RETIE + EMC
/audit pasos_a_nivel    → DTs 24 PaN protegidos (9C+15B), CWT, failsafe
/audit fenoco           → DT Stop & Switch operacional (defensa contractual triple capa)
/audit cco              → DTs HA + HMI + failover Barrancabermeja (oportunidad)
/audit material_rodante → DT OBC dual + EOT-HOT + integración tipo locomotora
```

Cada DT debe:
- Usar la sigla **SCC** (BCD v001) en título y cara externa, NO "SICC" (colisión con AT4).
- Citar literalmente sección BCD + AT1 + AT3.
- Llevar Sección 10 YAML ejecutable (D0).
- Cifras trazables al WBS (`LFC2/IX_WBS_Planificacion/wbs_presupuestal_datos.js`), NO inventar "CAPEX Protegido".

### Paso 3 — Promover al LFC2

```
/promote DT-COMS-2026-XXX
/promote DT-CTRL-2026-XXX
/promote DT-PAN-2026-XXX
... (uno por uno, validar cada uno antes de promover el siguiente)
```

`/promote` ejecuta: `gitlocal.js` → copia DT a `LFC2/II_A_Analisis_Contractual/dictamenes/` → `git push origin main` → Vercel auto-deploy.

### Paso 4 — Reescribir `dictamenes/index.html` corporativo

Cuando estén los DTs nuevos en LFC2, reemplazar el README placeholder por un index.html corporativo:
- Título: "Decisiones Técnicas — Sistema SCC UF2" (NO "Reglas de Juego").
- Lenguaje contractual neutro (sin "Sovereign", "Soberano", "Vital IP", "[REDACTADO]").
- Tarjetas por DT con: ID + título + descripción 2-3 líneas + cita BCD/AT1 + delta WBS verificado (no "CAPEX Protegido $X").
- Filtros por especialidad y estado (aprobado / en revisión / publicado).

### Paso 5 — Restaurar al sidebar del index gerencial de LFC2

En `LFC2/index.html` (sidebar embebido, grupo "Gestión y Documentos"), añadir de vuelta:

```html
<a href="/II_A_Analisis_Contractual/dictamenes/" class="nav-item">⚖️ Decisiones Técnicas SCC</a>
```

Y en el access-grid principal, restaurar la card amarilla. Cache bump.

### Validación final
- [ ] Smoke test: abrir cada DT publicado en lfc-2.vercel.app, verificar que se renderiza, no hay placeholders pre-purga, cifras coinciden con WBS.
- [ ] Mover D1.5 del roadmap LFC2 de "Crítica" a "Cerrado".
- [ ] Comunicar al Director Técnico UF2 que el deck de Decisiones Técnicas está listo para Interventoría/ANI.

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
| **Cirugía v14.7 (2026-04-30):** SPECIALTIES canonizadas (13 ajustes FRA), RAG purgado (77 filas), dictámenes v14.6 eliminados, memoria limpia | ✅ |
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
| **Falta YAML EJECUTABLE en DTs (Sección 10)** | Las DTs generadas (ej. `DT-ENRG-2026-001`) se emiten sin el bloque YAML (Sección 10) requerido por la metodología `.42` de LFC2. Esto bloquea que la DT interactúe con el repositorio y el comando `/promote` queda desconectado del WBS. Requiere ajuste urgente en el prompt del Agente. **Cruzado con `LFC2/roadmap.md` (Deuda D0).** |
| **Validación en producción v14.7** | Emitir primer DT con enjambre post-cirugía y validar contra los 13 ajustes de v14.7. |
| **`/promote` DT→LFC2** | Comando que copia DT de `brain/dictamenes/` → LFC2 + git commit automático. Usa `src/gitlocal.js`. |
| **Re-ingesta `contrato_documentos`** | Fragmentos pre-fix oversized — re-ingestar con max 800c + overlap 100c. |
| **Probar `ejecutarSondaForense` en simulator.js** | Corregida con `llamarMultiplexadorFree`, pendiente prueba real con simulator.js. |

## 🟡 PENDIENTE — v14.8 (doctrina)

| Ítem | Descripción |
|---|---|
| **Textos literales §236.1003, §236.1029, §236.1015** | Suministrados por el otro agente — incrustar en INTEGRATION.md, COMMUNICATIONS.md, CONTROL_CENTER.md. |
| **Verificar literalidad Sección 1.2(d)** | Contrastar Orden de Prelación en CONTRACTUAL_NORMATIVE.md contra cuerpo del Contrato antes de citar a Interventoría. |
| **Especialidad LEVEL_CROSSINGS.md** | Extraer PaN de SIGNALIZATION.md a especialidad propia. |

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

*Actualizado: 2026-04-30 | OpenGravity SICC v14.7*
