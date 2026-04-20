# 🏛️ Arquitectura SICC v13.0 — "Intents Soberanos" (Saneada)

SICC (**Sistema Integrado de Control Contractual**) es una arquitectura de agente soberano para auditoría técnica y jurídica del proyecto LFC2 (Línea Ferroviaria de Carga 2, Colombia).

---

## 🛰️ Topología de Red (Nodo Único Soberano)

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `dieleozagent-debug-dieleozagent-1` | — | Bot Telegram + orquestación de sueños |
| **Oracle NotebookLM** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad Externa — 108 fuentes "Contrato Ardanuy LFC" |
| **Infra Oracle** | **Chrome + Xvfb + auth2.cjs** | — | Sesión Google persistente (Google Sign-In bypass) |
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
| 1 | Gemini | `gemini-2.0-flash` | Free tier (1500 req/día) |
| 1 | Groq | `llama-3.3-70b-versatile` | Free tier (100K tokens/día) |
| 1 | Ollama local | `gemma4-light:latest` | Sin límite, español forzado, prompt segmentado |
| 2 | OpenRouter free | `openrouter/free` | Nemotron 70B, Trinity, gpt-oss-120b… |
| 3 | OpenRouter paid | `gemini-2.0-flash-001` | ~$0.10/1M tokens — Último recurso |
| 3 | OpenRouter paid | `llama-3.3-70b-instruct` | ~$0.12/1M tokens — Sin cuota diaria |

**Muro de Fuego (Firewall):** Si fallan todos los niveles gratuitos/locales, el sistema **no escala a modelos premium** sin autorización. Registra un `[SICC BLOCKER]` y encola en `SICC_OPERATIONS.md`.

**Skip 429:** `proveedorBloqueadoReciente()` saltea proveedores con 429 en los últimos 15 min.

---

## 🗂️ Arquitectura de Código — v13.0

```
src/
├── index.js          ← Bootstrap: dirs, brain init, IA check, bot, crons, dream launcher (~160 líneas)
├── agent.js          ← Motor: pipeline FASE-0..5 (CPU→Vacunas→RAG→Oracle→Skills→LLM) (~450 líneas)
├── handlers.js       ← Router: /comandos slash + loop INTENTS[] (~390 líneas)
├── utils/
│   └── send.js       ← safeSendMessage: chunking 3500c + fallback Markdown
└── intents/          ← Intents de lenguaje natural (sin costo LLM)
    ├── navigation.js     "me pierdo / cómo empiezo"
    ├── brain-state.js    soul / enjambre / lecciones de auditoría
    ├── dream-state.js    sueños / DREAMS / historial área / roadmap
    └── dt-ops.js         DTs aprobadas / bloqueadas / qué hacemos con X
```

### Flujo de un mensaje Telegram

```
Telegram msg
    │
    ▼ index.js:bot.on('message')
    │
    ▼ handlers.js:handleMessage()
    │
    ├─ ¿Es /comando slash? → handler exacto → send() → return
    │
    ├─ ¿Lenguaje natural? → loop INTENTS[]
    │   ├─ intent.matches(textLower) ?
    │   │   └─ intent.handle() → send() → return
    │   └─ (siguiente intent)
    │
    └─ Fallback IA → agent.js:procesarMensaje() → send()
```

### Cómo agregar un intent nuevo
```bash
# 1. Crear archivo
cat > src/intents/mi-intent.js << 'EOF'
module.exports = {
  matches(textLower, texto) { return /mi regex/i.test(textLower); },
  async handle(chatId, texto, textLower, send, BRAIN_DIR) {
    await send(chatId, 'respuesta directa');
    return true;
  }
};
EOF

# 2. Registrar en handlers.js
# En el array INTENTS: require('./intents/mi-intent')
```

---

## 🌪️ Pipeline de Inferencia — `procesarMensaje()` (agent.js)

```
procesarMensaje(textoUsuario)
    │
    ├─ FASE-0: evaluarRecursos() → CPU check
    │
    ├─ FASE-1: buscarLecciones() → sicc_genetic_memory (coseno >0.7)
    │           → contextoGenetico (vacunas anti-alucinación)
    │
    ├─ FASE-2: buscarSimilares() → contrato_documentos (top-3 fragmentos)
    │           → contextoRAG (Biblia Legal)
    │
    ├─ FASE-3: buscarEnWeb() + validarExternaNotebook() [solo si Tavily+técnica]
    │           → contextoWeb + contextoOracle
    │
    ├─ FASE-4: seleccionarSkills() → brain/skills/*.json|md
    │           → skillsContext
    │
    ├─ FASE-5: getMultiplexedContext() → systemPromptSoberano
    │                llamarMultiplexadorFree(texto, contextoFinal, systemPromptSoberano)
    │                → { texto, proveedor }
    │                ─ Si falla → MURO-DE-FUEGO → registrarBloqueoSICC()
```

**Audit logs:** `data/logs/sicc-traces.json` (últimas 100) · `data/logs/flow-resilience.json`

---

## 🌪️ Bucle de Auditoría SICC — `/dream [área]`

```
/dream señalizacion
    │
    ▼ index.js:bot.onText — exec(swarm-pilot.js, timeout 30 min)
    │
    ▼ ── hasta 3 ciclos ─────────────────────────────────────────
    │
    ├─ FASE 1: buscarLecciones() → sicc_genetic_memory → vacunas
    ├─ FASE 2: Auditor Forense genera borrador DT
    ├─ FASE 3: validarInternaSupabase() + validarExternaNotebook()
    ├─ FASE 4: Juez → { aprobado, razon, leccion_auditoria }
    └─ FASE 5: Persistencia
        ├─ APROBADO: brain/dictamenes/ + sicc_genetic_memory (DT_CERTIFICADA)
        └─ RECHAZADO: brain/SPECIALTIES/{area}.md + brain/DREAMS/ + [tras 3: PENDING_DTS/]
```

**Hard-caps:** MAX_CICLOS=3 | exec timeout=1800s | Oracle timeout=90s

---

## 🤖 Intents Directos Activos (sin costo LLM)

| Trigger (lenguaje natural) | Intent | Responde con |
|---|---|---|
| `hola` / `buenas` / `hi` | handlers.js | Menú de comandos |
| `me pierdo / cómo empiezo / cómo me ayudas` | navigation.js | Guía rápida del flujo |
| `como aprende tu soul / quien eres` | brain-state.js | SOUL.md + pipeline aprendizaje |
| `el enjambre ya entiende / necesitas algo` | brain-state.js | Estado lecciones Karpathy |
| `qué sueños tienes pendientes` | dream-state.js | DREAMS/ + PENDING_DTS/ |
| `qué temas puedo proponer / roadmap` | dream-state.js | SPECIALTIES/ + ROADMAP.md |
| `historial de comunicaciones / señalización` | dream-state.js | Lecciones + DTs + Vercel status |
| `dónde están las DTs / dictamenes` | dt-ops.js | brain/dictamenes/ + DREAMS/ |
| `qué DT tengo bloqueadas / pendientes` | dt-ops.js | Aprobadas / sin promover / PENDING |
| `qué hacemos con DT-ENRG-2026-004` | dt-ops.js | Resumen DT + pasos promote |

---

## 🗄️ Brain — Jerarquía de Directorios

| Directorio | Escrito por | Cuándo |
|---|---|---|
| `brain/dictamenes/` | `swarm-pilot.js` | Al **aprobar** el Juez — PROHIBIDO EDITAR MANUALMENTE |
| `brain/DREAMS/` | `swarm-pilot.js` | Siempre — aprobado **y** rechazado |
| `brain/PENDING_DTS/` | `swarm-pilot.js` | Al **rechazar** tras 3 ciclos |
| `brain/SPECIALTIES/*.md` | `swarm-pilot.js` | Al **rechazar** — lección auditoría append (Vacuna) |
| `sicc_genetic_memory` | `supabase.js` | Al **completar** cada ciclo — veredicto + DT |
| `brain/AUDIT_QUEUE.md` | `resource-governor.js` | CPU >80% |

### Naming de archivos
- **Dictamen aprobado:** `DT-{PREFIX}-{AÑO}-{SEQ}_{Descripcion}_APROBADO.md`
  - Prefijos: CTSC (señalización), COMS (telecom), ENRG (energía), INTG (integración), CTRL (control), ENCE
- **Sueño (log):** `DREAM-{AREA}-{ISO_TIMESTAMP}.md`
- **Pending:** `PENDING-{AREA}-{FECHA}.md`

---

## 🗃️ Infraestructura Vectorial (LTM)

| Tabla Postgres | Función |
|---|---|
| `contrato_documentos` | Biblia Legal — Contrato LFC2 + normas técnicas (OCR chunking 800c/100c) |
| `sicc_genetic_memory` | 59 lecciones manuales + DT_CERTIFICADA + VEREDICTO_JUEZ automáticos |

**Embeddings:** `nomic-embed-text` (Ollama, 768 dims) → fallback `text-embedding-004` (Gemini)

---

## 📦 Pipeline DT → LFC2 → Vercel (manual — /promote pendiente)

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
lfc-2.vercel.app (Vercel auto-deploy ~2 min)
```

```bash
# Promote manual de una DT aprobada
cp brain/dictamenes/DT-XXXX.md \
   /home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/
cd /home/administrador/docker/LFC2
git add . && git commit -m "feat: DT certificada SICC" && git push
```

---

## ⚠️ Deuda Técnica Activa

| Item | Estado |
|---|---|
| `ejecutarSondaForense()` en simulator.js | ROTO (OpenAI no importado). Requiere refactor a `llamarMultiplexadorFree()`. |
| Comando `/promote` DT→LFC2 | Automatizar pipeline manual — usar `src/gitlocal.js`. |
| Re-ingesta `contrato_documentos` | Fragmentos pre-fix oversized — re-ingestar con 800c/100c. |
| Interrogación iterativa Oracle | Juez debe emitir ≥2 preguntas de seguimiento al Oracle por ciclo. |
| `SICC_OPERATIONS.md` auto-actualización | Tras cada sueño — fecha, área, veredicto. |

---

## 🛡️ Gobernanza R-HARD

1. **CAPEX Blindado:** $726.000.000 COP máx (WBS 6.1.100)
2. **Normativa:** FRA 49 CFR Part 236 / AREMA / Manual Vial 2024
3. **CPU:** >80% → encolar | >95% → bloquear inferencia local
4. **Idioma:** Español obligatorio en toda salida del enjambre
5. **Verdad:** Oracle prevalece sobre intuición de la IA generativa
6. **Soberanía:** PROHIBIDA la edición manual de dictámenes. Todo cambio debe ser vía ajuste del BRAIN y re-ejecución del enjambre.

---

## 🛠️ Diagnóstico Rápido

```bash
# Estado contenedores
docker ps --format "table {{.Names}}\t{{.Status}}"

# Logs del agente (solo pipeline de inferencia)
docker compose -f docker-compose.yaml logs -f | grep "\[AGENTE\]"

# DTs certificadas
ls brain/dictamenes/

# Estado learning pipeline
docker exec sicc-postgres psql -U sicc_app -d postgres_sicc \
  -c "SELECT COUNT(*), COALESCE(metadata->>'tipo','sin_tipo') FROM sicc_genetic_memory GROUP BY 2;"

# Sueños recientes
ls brain/DREAMS/ | tail -5

# Trazas de inferencia (últimas 5)
tail -5 data/logs/sicc-traces.json | python3 -m json.tool
```

---

*Actualizado: 2026-04-18 | OpenGravity SICC v13.0*
