# 🏛️ Arquitectura del Agente — Auditor Forense LFC2

El **Agente** es un sistema autónomo de auditoría técnica y jurídica del proyecto LFC2. Ejecuta el bucle `/audit [área]` → genera DT (Decisión Técnica) → `/promote` la sincroniza al repo LFC2 y la despliega en Vercel.

> **Nota terminológica (2026-05-08):** este documento usa la sigla **SCC** (Sistema de Comunicación, Control de Tráfico y Señalización) tal como la define el **BCD v001** del contrato — alcance contractual UF2. Cualquier referencia residual a "SICC" en código/strings internos del agente es marca interna doctrinal del proyecto OpenGravity (no confundir con el SICC del AT4, que es el Sistema de Indicadores de Calidad/Cumplimiento).

---

## 🏛️ FUENTE DE VERDAD SUPREMA (SSoT)
Desde el 2026-05-05, el sistema se rige por el **BCD v001 (Abril 2026)**. La verdad técnica es innegociable frente a alucinaciones o normas obsoletas.

### 🛰️ Directrices Técnicas de Diseño (SSoT v14.7 · BCD-aligned)
- **TROCHA:** Vía única de **914 mm** (yarda).
- **FIBRA ÓPTICA:** Backbone de **48 hilos** G.652.D soterrado (BCD §6.1.1, NO 64h). OTDR en 1310/1550/1625 nm.
- **PASOS A NIVEL:** **24 Protegidos** (9 Tipo C + 15 Tipo B). Los 122 PaN básicos restantes están **fuera del alcance SCC** (BCD §8.2).
- **ENCE:** 5 estaciones nominadas (Zapatosa, García Cadena, Barrancabermeja, Pto Berrío–Grecia, La Dorada–México). Tabla 17 AT1.
- **PTC:** Virtual Fixed Block §236.1005. Prohibido "Moving Block".
- **COMMS:** TETRA primario + Satelital LEO/GEO redundante.
- **POWER:** UPS diferenciada por bloque BCD §10 — **4h** señalización/CCO/PaN (110V DC) y **24-48h** TETRA (48V DC). NO homogeneizar.
- **CCO:** La Dorada (Principal) + Barrancabermeja (Failover, deuda LFC, no exigido por BCD).
- **INTEROPERABILIDAD:** **Stop & Switch** operacional en Chiriguaná (BCD §9.2). NO integración técnica con sistemas FENOCO.

---

## 🛰️ Topología de servicios

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Bot Telegram + Orquestador** | `node src/index.js` (en `dieleozagent-debug-dieleozagent-1`) | — | Recibe `/audit`, dispara `swarm-pilot.js` vía `exec()` |
| **Oráculo NotebookLM (MCP)** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad externa: notebook con 124 fuentes verificadas (Contrato + Apéndices + Bases + TDR + propuestas) |
| **RAG pgvector** | `sicc-postgres` | 5432 | `contrato_documentos` (chunks contractuales) + `sicc_genetic_memory` (veredictos del Juez + DTs certificadas) |
| **Embeddings** | Gemini `embedding-001` (cloud) → fallback Ollama `nomic-embed-text` (local) | — | Vectorización forense |
| **Cascada LLM** | Groq → DeepSeek → Gemini → NVIDIA → Nemotron → Ollama → OpenRouter | varios | Generación + Juez (orden v14.8 prioriza los que responden directo) |

---

## 🌪️ Bucle de auditoría forense `/audit [área]` (v14.8.4)

Implementación: `scripts/swarm-pilot.js` (lanzado por `src/index.js:118` vía `exec()` cuando llega `/audit` por Telegram).

```
        Diego (Telegram)
              │
              ▼  /audit fibra
    [src/index.js bot.onText]
              │
              ▼  exec(node scripts/swarm-pilot.js fibra)
              │
   ┌──────────┴──────────────────────────────────────────────┐
   │ runSwarmPilot()                                          │
   ├──────────────────────────────────────────────────────────┤
   │                                                          │
   │ FASE 0   — RAG Supabase                                  │
   │   validarInternaSupabase(area) → chunks crudos del SSoT  │
   │                                                          │
   │ FASE 0.5 — Destilador anti-alucinación                   │
   │   extraerFichaTecnica(area, chunks)                      │
   │   • Prompt v14.8 con 7 reglas estrictas:                 │
   │     - PROHIBIDO inventar cifras                          │
   │     - Citar entre comillas, mantener referencias exactas │
   │     - Si no hay literal: "Pendiente Ardanuy bajo EN50126"│
   │   → brain/DREAMS/FICHA-{AREA}.md                         │
   │                                                          │
   │ ┌─ Loop while (ciclos < 3 && !aprobado): ──────────────┐ │
   │ │                                                       │ │
   │ │ FASE 1 — Generación de borrador DT                    │ │
   │ │   getMultiplexedContext(area) →                       │ │
   │ │     [CONTRACTUAL_NORMATIVE.md (15.7k)] +              │ │
   │ │     [_LOOP_GUARD.md (15.2k)] +                        │ │
   │ │     [{AREA}.md (3-5k)]                                │ │
   │ │   Truncado a 14k chars (cap v14.8.2)                  │ │
   │ │   + identity (1.8k) + methodology (3.1k) +            │ │
   │ │     prohibiciones + tarea                             │ │
   │ │   → llamarMultiplexadorFree(prompt)                   │ │
   │ │   → cascada GROQ (15s) → DEEPSEEK (60s) → ...         │ │
   │ │   → borrador_DT                                       │ │
   │ │                                                       │ │
   │ │ FASE 2 — Validación cruzada                           │ │
   │ │   • validarInternaSupabase(borrador)  → consistency   │ │
   │ │   • validarExternaNotebook(borrador)                  │ │
   │ │       └─ ANCLAJE_CONTRACTUAL prepended (v14.8.4):     │ │
   │ │          "Responde según el Contrato APP 001/2025,    │ │
   │ │           sus Apéndices Técnicos y el documento       │ │
   │ │           'Bases de Diseño - CTSC (2)'. Pregunta: ..." │ │
   │ │       └─ construirRespuestaMCP() parsea data.answer + │ │
   │ │          metadata + filtra chatter MCP                │ │
   │ │                                                       │ │
   │ │ FASE 3 — Juez SICC                                    │ │
   │ │   promptJuez incluye PROTOCOLO DE RECHAZO FULMINANTE  │ │
   │ │   → llamarMultiplexadorFree (cascada)                 │ │
   │ │   → parser heurístico (línea 342):                    │ │
   │ │     tieneSi (APROBADO/CERTIFICADA/...)                │ │
   │ │     tieneNo (RECHAZADO/IMPUREZA/...)                  │ │
   │ │     decision.aprobado = tieneSi && !tieneNo           │ │
   │ │     razon = decisionRAW.substring(0, 2000)            │ │
   │ │   → guardarVeredictoJuez() vectoriza en pgvector      │ │
   │ │                                                       │ │
   │ │ Si APROBADO:                                          │ │
   │ │   • generarNombreDT() → DT-{prefijo}-{año}-{seq}      │ │
   │ │   • guardarDTEnDisco(brain/dictamenes/...)            │ │
   │ │     Footer v14.8.1: "Dirección Técnica — UF2 ·        │ │
   │ │     Fecha de emisión: YYYY-MM-DD" (sin versionado)    │ │
   │ │   • guardarDTCertificada() → vectoriza en Supabase    │ │
   │ │   • registrarAuditoria(brain/history/...)             │ │
   │ │   break loop                                          │ │
   │ │                                                       │ │
   │ │ Si RECHAZADO:                                         │ │
   │ │   • registrarLeccionAuditoria({AREA}.md)              │ │
   │ │   • mandato_correctivo (cap 2000 chars v14.8.3)       │ │
   │ │   • sleep 3s, ciclo siguiente                         │ │
   │ │                                                       │ │
   │ └───────────────────────────────────────────────────────┘ │
   │                                                          │
   │ Si 3 ciclos sin aprobar:                                 │
   │   guardarPendingDT(brain/PENDING_DTS/...) + última lec.  │
   │                                                          │
   │ Persistir state final: brain/STATE-{area}.json           │
   └──────────────────────────────────────────────────────────┘
              │
              ▼
   El bot Telegram recibe stdout y manda mensaje "✨ Auditoría
   Finalizada (área)" con últimas 3500 chars del log.
```

---

## 🛡️ Defensas anti-alucinación (v14.8.4)

### 1) Vacunas transversales — siempre cargadas
`scripts/sicc-multiplexer.js:getMultiplexedContext()` anexa al inicio del contexto, en este orden:

1. **`brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md`** (~15.7k chars):
   - §4.1 AF4 literal verificado
   - §4.2 Sección 3.1(a)(ii) literal completa (no mutilar "Operación y Mantenimiento")
   - §4.3 NO existe "límite CAPEX por especialidad" en el Contrato
   - §4.4 Doctrina DT — solo emitir si hay conflicto de jerarquía
   - §4.5 §9.11 como segundo pilar para escenarios FENOCO
   - §4.6 Resolución de Surcos Art. 5°(1)(e) literal verificado
   - §4.7 Sección 2.x = definiciones, NO obligaciones
   - §4.8 Mapa de Apéndices Técnicos (AT3 ≠ AT4 ≠ AT1)
   - §4.9 DBCD canónico (no "DBC", no "Documento Básico del Contrato")
   - §4.10 Prelación documental (AT3 prevalece sobre TDR/Adenda)
   - §4.11 Marcos normativos por subsistema

2. **`brain/SPECIALTIES/_LOOP_GUARD.md`** (~15.2k chars):
   - §1 Anti-loop literal (>3 repeticiones idénticas → abortar)
   - §2 Anti-scratchpad ("We need to..." en cuerpo de DT → abortar)
   - §3 Anti-firma versionada (prohibido "Sistema SICC v14.6" en footer)
   - §4 Anti-mezcla SCC vs SICC (colisión con AT4)
   - §5 Tabla de >25 alucinaciones catalogadas con sus correcciones
   - §6 Anti-scope-creep (una especialidad por DT)
   - §7 Anti-DT sin conflicto de jerarquía (3 preguntas de validación)
   - §8 Inventario de frases prohibidas en cara externa

3. **`brain/SPECIALTIES/{ESPECIALIDAD_DETECTADA}.md`** (3-5k chars cada uno):
   EMBARCADO, POWER, SIGNALIZATION, COMMUNICATIONS, CONTROL_CENTER, ENCE, INTEGRATION.

### 2) Cascada de proveedores con timeouts y throttle (v14.8.3)

`scripts/sicc-multiplexer.js:llamarMultiplexadorFree()`:
- Orden: GROQ → DEEPSEEK → GEMINI → NVIDIA → NEMOTRON → OLLAMA → OPENROUTER
- Skip si 429 reciente (<15 min) o sin credenciales
- Throttle 400ms entre intentos efectivos
- Timeouts por proveedor: Groq 15s, Gemini 30s, DeepSeek/OpenRouter 60s, NVIDIA/Nemotron 90s, Ollama 45s
- Validación: respuesta debe tener >10 chars limpios
- NVIDIA Nemotron lee `reasoning_content` como fallback (es modelo razonador)

### 3) Anclaje contractual al Oráculo (v14.8.4)

`src/sapi/notebooklm_mcp.js:validarExternaNotebook()`:
- Prepende a cada query: *"Responde según el Contrato APP 001/2025, sus Apéndices Técnicos y el documento 'Bases de Diseño - CTSC (2)'. Pregunta: ..."*
- Razón: NotebookLM tiene 124 documentos cargados (TDR + Apéndices + Bases + propuestas). Sin anclaje, mezcla pre-contractuales con contractuales y termina inventando nombres de DTs (verificado por escaneo forense del Director Técnico UF2).
- `construirRespuestaMCP()` parsea estructura completa del MCP (`data.answer` + metadata + chunks múltiples), filtra chatter del MCP y limpia marcadores in-line del UI.

### 4) Mapa de fuentes verificadas

`brain/NOTEBOOK_SOURCES_MAP.md` — registro de las 124 fuentes reales del notebook clasificadas en 3 niveles:
- ✅ **CONTRACTUAL** (vinculante): Contrato + AT1-AT7
- ⚠️ **DISEÑO LFC** (propuesta): Bases de Diseño, ingeniería de detalle, propuestas técnicas
- ❌ **PRE-CONTRACTUAL** (no vinculante): TDR Fase III, Adendas Proceso de Selección

Cuando el Oráculo cita una fuente, el agente debe contrastarla contra este mapa antes de incorporarla a una DT.

### 5) Filtros post-generación

- Después de generar el borrador, búsqueda de patrones prohibidos (`We need to`, `Could you provide`, etc.) → si aparece, abortar ciclo.
- Footer hardcoded en `guardarDTEnDisco()` (`scripts/swarm-pilot.js:51`): solo "Dirección Técnica — UF2 + fecha", sin versionado interno.

---

## ⚖️ Mandatos del Agente (Blindaje Anti-Scope Creep)

1. **CAPEX Blindado:** Ningún dictamen puede proponer over-engineering (ej: 24h UPS en señalización donde BCD §10 dice 4h, o 64h fibra donde BCD §6.1.1 dice 48h) sin DT de justificación costo-beneficio.
2. **Normativa:** FRA 49 CFR Part 236 Subpart I prevalece sobre CENELEC/UIC para señalización; AREMA > FRA > AAR > UIC para infraestructura.
3. **TRM Risk:** Presupuesto calculado a **4.400 COP/USD** (techo cobertura cambiaria).
4. **Sigla del sistema:** los DTs nuevos deben usar **SCC** (sigla contractual BCD v001) en cara externa al gerente/Interventoría/ANI. La marca interna "SICC" se reserva para metadata interna del agente.
5. **Prelación documental:** ante conflicto entre fuentes, AT3 (contractual) prevalece sobre TDR/Adenda (pre-contractuales) por §1.2.d. Los DTs publicados deben citar la fuente vinculante, no la sugerencia pre-contractual.

---

## 🚨 Estado de los DTs publicados en LFC2 (2026-05-08)

Los DTs actualmente publicados en `https://lfc-2.vercel.app/II_A_Analisis_Contractual/dictamenes/` son **producto v8 pre-purga** generados durante pruebas tempranas de `/promote` (antes de la cirugía v14.7 del 2026-04-30). Su contenido tiene terminología obsoleta:

- "Bus Vital 110V DC" (vs BCD §10 que diferencia 110V DC señalización + 48V DC TETRA)
- "Red Vital IP" (terminología purgada)
- "PTC Virtual (SICC) L2" (mezcla SICC con SCC)
- "Soberanía Integral", "Sovereign", "Soberano" (lenguaje doctrinal interno, no contractual)
- "[REDACTADO_SICC]" (placeholders incompletos)
- "DT-SICC-V8-*" (naming legacy)
- Cifras "CAPEX Protegido $X M USD" sin trazabilidad WBS

**Estos DTs son alucinaciones legacy** del agente operando con doctrina pre-BCD v001. No representan la línea base actual del proyecto.

**Plan de saneamiento:**
1. Cerrar deuda D1 (alinear architecture.md y código a BCD v001).
2. Ejecutar `/audit` por especialidad con SSoT v14.7.
3. `/promote` regenera DTs con cita literal BCD v001 + sigla SCC + cifras trazables al WBS.
4. Reescribir `dictamenes/index.html` en LFC2 con lenguaje corporativo.
5. Restaurar al sidebar gerencial de LFC2 (hoy quitado, commit `c7dcd19`).

---

*Actualizado: 2026-05-08 | OpenGravity Agente v14.8.4 — Anclaje contractual MCP + cascada con vacunas transversales*
