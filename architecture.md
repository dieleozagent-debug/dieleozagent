# 🏛️ Arquitectura SICC v14.6 — "Blindaje Táctico y Soberanía"

SICC (**Sistema Integrado de Control Contractual**) es una arquitectura de agente autónomo para auditoría técnica y jurídica del proyecto LFC2 (Colombia).

---

## 🛰️ Topología de Red (Nodo Único Soberano)

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `node src/index.js` (Host) | — | Bot Telegram + orquestación de ciclos de auditoría |
| **Oracle NotebookLM** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad Externa — 108 fuentes "Contrato Ardanuy LFC" |
| **Base de Datos** | `sicc-postgres` | 5432 | pgvector — 10.358 fragmentos del Contrato APP 001/2025 |
| **Embeddings v2.0** | **Multiplexador Híbrido** | — | **Primario:** Gemini `text-embedding-004` (Cloud) / **Fallback:** Ollama `nomic-embed-text` (Local) |
| **Inferencia** | **Tridente NVIDIA NIM** | — | Nemotron (Legal), DeepSeek (Técnico), Llama 70B (Auditoría) |

### Conectividad (v14.1 - Bridge Soberano)
- **Agente → Postgres:** `127.0.0.1:5432` (Mapeo directo Host-to-Container).
- **DNS Local:** Mapeado `127.0.0.1 sicc-postgres` en `/etc/hosts` para compatibilidad legacy.
- **Fragmentación:** 100% de integridad con 10.358 fragmentos contractuales inyectados.

---

## 🤖 Interfaz de Telegram & Control de Instancias

El sistema utiliza la API de Telegram como interfaz de mando soberano (HMI). Para garantizar la estabilidad, se aplican las siguientes reglas arquitectónicas:

### 1. Mecanismo de Comunicación
- **Modo:** Long Polling (configurado en `src/index.js`).
- **Librería:** `node-telegram-bot-api`.
- **Ventaja:** No requiere exposición de puertos (Webhooks) ni certificados SSL en el host, manteniendo el nodo oculto y seguro.

### 2. Política de Instancia Única (Anti-409)
Telegram prohíbe dos procesos usando el mismo Token simultáneamente.
- **Detección de Conflicto:** El log `ETEGRAM: 409 Conflict` indica que existe una instancia duplicada (proceso zombi, contenedor paralelo o script `.sh` resucitador).
- **Protocolo de Reinicio:** Se debe ejecutar `killall node` antes de levantar una nueva versión para asegurar la "limpieza" del canal de polling.

### 3. Mensajería Segura (`safeSendMessage`)
- **Chunking:** Los mensajes >3500 caracteres se dividen automáticamente para evitar el rechazo de Telegram.
- **Retry Logic:** Se implementan hasta 3 reintentos con delay de 3s en caso de fallos de red o *rate limiting* de Telegram.
- **Formato:** MarkdownV2/HTML con fallback a texto plano en caso de error de parseo.

### 4. Dualidad Funcional: Oído vs Boca
El sistema opera con dos instancias lógicas del bot para evitar bloqueos:
- **El Oído (Reactivo - `src/index.js`):** Utiliza *Long Polling* activo. Es el único componente autorizado para procesar comandos (`/audit`, etc.). Solo debe existir UNA instancia activa de este proceso para evitar conflictos 409.
- **La Boca (Proactivo - `src/notifications.js`):** No utiliza polling. Se instancia bajo demanda por otros módulos o scripts de cron para enviar alertas y reportes sin escuchar al usuario.

---

## 📡 Multiplexador de Proveedores IA — Cascada v12.9

| Nivel | Proveedor | Modelo | Nota |
|---|---|---|---|
| 1 | **NVIDIA NIM** 🟢 | `nemotron-3-super-120b` | **Tridente Principal:** Razonamiento superior gratuito |
| 1 | **DeepSeek 🔵** | `deepseek-v4-pro` | Razonamiento técnico y lógico puro |
| 1 | Gemini | `gemini-2.0-flash` | Alta velocidad y cuota generosa |
| 2 | Groq | `llama-3.3-70b` | Baja latencia, auditoría rápida |
| 2 | OpenRouter | `openrouter/free` | Rescate multi-modelo |
| **3** | **Ollama local** | `gemma2:9b` | **Soberanía Total:** Fallback offline y masivo |

**Cerebro Superior (DeepSeek):** Se ha integrado la API nativa de DeepSeek para actuar como el último muro de contención contra el `SICC BLOCKER`. Es el proveedor con mayor razonamiento por costo del mercado.

**Selector de Modelos (Conmutación):**
Para ajustar la prioridad o desactivar DeepSeek (si el consumo es alto), editar `.env`:
- `AI_PRIMARY_PROVIDER=gemini`: (Default) Prioriza lo gratuito.
- `AI_PRIMARY_PROVIDER=deepseek`: (Modo Auditoría Profunda) Usa DeepSeek de entrada.
- El sistema siempre intentará la cascada: `Gemini → Groq → Ollama → OpenRouter → DeepSeek`.

---

## 🗂️ Arquitectura de Código — v14.0

```
src/
├── index.js          ← Bootstrap: dirs, brain init, IA check, bot, crons, scheduler (~160 líneas)
├── agent.js          ← Motor: pipeline FASE-0..5 (CPU→Vacunas→RAG→Oracle→Skills→LLM) (~450 líneas)
├── handlers.js       ← Router: /comandos slash + loop INTENTS[] (~390 líneas)
├── utils/
│   └── send.js       ← safeSendMessage: chunking 3500c + fallback Markdown
└── intents/          ← Intents de lenguaje natural (sin costo LLM)
    ├── navigation.js     "me pierdo / cómo empiezo"
    ├── brain-state.js    brain / agentes / lecciones de auditoría
    ├── dream-state.js    auditorías / historial área / roadmap
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
    ├─ FASE-5: getMultiplexedContext() → systemPromptSICC
    │                llamarMultiplexadorFree(texto, contextoFinal, systemPromptSICC)
    │                → { texto, proveedor }
    │                ─ Si falla → MURO-DE-FUEGO → registrarBloqueoSICC()
```

**Audit logs:** `data/logs/sicc-traces.json` (últimas 100) · `data/logs/flow-resilience.json`

---

## 🌪️ Bucle de Auditoría Forense SICC v14.0 — `/audit [área]`

```
/audit señalizacion
    │
    ▼ index.js:bot.onText — exec(swarm-pilot.js "Señalización", timeout 30 min)
    │
    ▼ ── hasta 3 ciclos (STATE persistente) ─────────────────────
    │
    ├─ FASE 0: Supabase RAG extrae contexto crudo.
    ├─ FASE 0.5 (Oracle Fetcher): Destilación de Contexto (DBCD v001) → FICHA TÉCNICA OBLIGATORIA (vía distil-mandates.js).
    ├─ FASE 1: Auditor Forense genera borrador DT usando Citación Canónica de la Ficha.
    ├─ FASE 2: validarInternaSupabase() + validarExternaNotebook(notebooklm-mcp-v12:3001)
    ├─ FASE 3: Juez SICC v14.5 (Selector de Texto Crudo)
    │           🚨 Protocolo Rescate: Heurística Forense de Señales (SÍ/NO) agnóstica a JSON.
    └─ FASE 4: Persistencia & CI/CD
        ├─ APROBADO: brain/dictamenes/ + vectorización.
        │           🚀 Comando `/promote`: Git push automático a repositorio LFC2.
        └─ RECHAZADO: brain/SPECIALTIES/{area}.md (Vacuna Genética).
```

**Hard-caps:** MAX_CICLOS=3 | exec timeout=1800s | Oracle timeout=90s

---

## 🏗️ Principio Fundamental de Diseño: Arquitectura PTC con Cantonamiento Virtual

El principio fundamental de diseño del Sistema de Señalización del Corredor Férreo La Dorada–Chiriguaná es la implementación de una arquitectura de **Positive Train Control (PTC) con cantonamiento virtual**, complementada con **cantonamiento físico** en los puntos operativos definidos en el Apéndice Técnico 1 (La Dorada–México, Puerto Berrío–Grecia, Barrancabermeja, García Cadena y Zapatosa) que requieren control local seguro de rutas, señales y cambiavías.

### Filosofía de Operación
- **Vía Sencilla (Intermedios)**: Determinación y supervisión de autoridades de movimiento emitidas desde un sistema central (CCO), con soporte en equipos embarcados, posicionamiento GNSS, comunicaciones seguras y lógica de protección automática.
- **Puntos Críticos (ENCE)**: Enclavamientos electrónicos SIL-4 para asegurar rutas, control de movimientos incompatibles y permitir la **operación local controlada** en condiciones degradadas o pérdida de comunicación.
- **Desvíos Menores**: Los desvíos que no requieran enclavamiento completo se resuelven mediante **desvíos libres**.
- **Redundancia de Comunicaciones**: Red troncal de **Fibra Óptica** enterrada + Subsistema **TETRA** + Red **Satelital** de respaldo.

### Justificación Técnica
La arquitectura PTC con cantonamiento virtual concentra la infraestructura física únicamente donde es técnica y operacionalmente necesaria, manteniendo en el resto del corredor una solución centralizada, escalable y compatible con la operación de carga de 914mm, de conformidad con **FRA 49 CFR Part 236 Subpart I (2026)** y **AREMA (2021)**.

---

## ⚖️ Mandatos de Soberanía Técnica (Blindaje Anti-Scope Creep)

Para garantizar la viabilidad técnica y financiera del proyecto, el sistema opera bajo los siguientes mandatos innegociables:

### 1. Segregación de Integridad (SIL-4 / SIL-2)
- **Mandato:** Queda estrictamente PROHIBIDO exigir nivel de integridad SIL-4 para equipos de telecomunicaciones comerciales (COTS) como módems Satelitales, routers LTE o SD-WAN.
- **Regla:** El nivel **SIL-4** aplica única y exclusivamente al Computador de Procesamiento PTC (OBC). Los sistemas de transmisión de datos operan bajo **SIL-2** asegurados mediante lógica EN 50159 Cat 3.

### 2. Soberanía Geográfica (Resiliencia CCO)
- **Mandato:** Todo diseño de control debe integrar obligatoriamente el **Nodo Secundario de Respaldo (Failover) en Barrancabermeja**.
- **Regla:** No se aceptará ninguna arquitectura que limite el control únicamente a La Dorada, Caldas, para evitar Puntos Únicos de Falla (SPOF).

### 3. Delimitación de Flota (Material Rodante Tractivo)
- **Mandato:** La obligación de instalación tecnológica de equipos PTC se acota exclusivamente al **Material Rodante Tractivo** (Locomotoras GR12, U10, U18).
- **Regla:** Se debe salvaguardar la "Puesta a Punto" general de la flota remolcada (góndolas, plataformas), pero sin exigirles hardware de control redundante.

---

---

## 🤖 Intents Directos Activos (sin costo LLM)

| Trigger (lenguaje natural) | Intent | Responde con |
|---|---|---|
| `hola` / `buenas` / `hi` | handlers.js | Menú de comandos |
| `me pierdo / cómo empiezo / cómo me ayudas` | navigation.js | Guía rápida del flujo |
| `como aprende el sistema / quien eres` | brain-state.js | BRAIN.md + pipeline aprendizaje |
| `los agentes ya entienden / necesitas algo` | brain-state.js | Estado lecciones de auditoría |
| `qué auditorías tienes pendientes` | dream-state.js | history/ + PENDING_DTS/ |
| `qué temas puedo proponer / roadmap` | dream-state.js | SPECIALTIES/ + ROADMAP.md |
| `historial de comunicaciones / señalización` | dream-state.js | Lecciones + DTs + Vercel status |
| `dónde están las DTs / dictamenes` | dt-ops.js | brain/dictamenes/ + history/ |
| `qué DT tengo bloqueadas / pendientes` | dt-ops.js | Aprobadas / sin promover / PENDING |
| `qué hacemos con DT-ENRG-2026-004` | dt-ops.js | Resumen DT + pasos promote |

---

## 🗄️ Brain — Jerarquía de Directorios

| Directorio | Escrito por | Cuándo |
|---|---|---|
| `brain/dictamenes/` | `swarm-pilot.js` | Al **aprobar** el Juez — PROHIBIDO EDITAR MANUALMENTE |
| `brain/history/` | `swarm-pilot.js` | Historial de auditorías (aprobadas y rechazadas) |
| `brain/PENDING_DTS/` | `swarm-pilot.js` | Al **rechazar** tras 3 ciclos |
| `brain/SPECIALTIES/*.md` | `swarm-pilot.js` | Al **rechazar** — lección auditoría append (Vacuna) |
| `sicc_genetic_memory` | `supabase.js` | Al **completar** cada ciclo — veredicto + DT |
| `brain/AUDIT_QUEUE.md` | `resource-governor.js` | CPU >80% |

### Naming de archivos
- **Dictamen aprobado:** `DT-{PREFIX}-{AÑO}-{SEQ}_{Descripcion}_APROBADO.md`
  - Prefijos: CTSC (señalización), COMS (telecom), ENRG (energía), INTG (integración), CTRL (control), ENCE
- **Log de Auditoría:** `AUDIT-{AREA}-{ISO_TIMESTAMP}.md`
- **Pending:** `PENDING-{AREA}-{FECHA}.md`

---

## 🗃️ Infraestructura Vectorial (LTM)

| Tabla Postgres | Función |
|---|---|
| `contrato_documentos` | Biblia Legal — Contrato LFC2 + normas técnicas (OCR chunking 800c/100c) |
| `sicc_genetic_memory` | 59 lecciones manuales + DT_CERTIFICADA + VEREDICTO_JUEZ automáticos |

**Embeddings:** `text-embedding-004` (Gemini Cloud - Calidad Forense) → fallback `nomic-embed-text` (Ollama Local - Soberanía)

---

### 📋 El Algoritmo de Soberanía (6 Pasos)

| Paso | Actor | Acción Técnica | Output |
| :--- | :--- | :--- | :--- |
| **1. Análisis** | Agente (Brain) | Escaneo forense de archivos `.md` en LFC2 vs Mandatos R-HARD. | Detección de Toxinas |
| **2. Dictamen** | Agente (Brain) | Redacción de DT en `brain/dictamenes/` con bloque YAML (Sec. 10). | DT-SICC-2026-XXX.md |
| **3. Promoción** | Comando `/promote` | Copia de la DT certificada al root de LFC2 vía `gitlocal.js`. | DT en `Decisiones_Tecnicas/` |
| **4. Cirugía** | `lfc-cli process-dts` | El motor Node.js lee el YAML y aplica `replace` físico en los `.md`. | Recetas (.md) Saneadas |
| **5. Sincro** | `lfc-cli sync` | Regenera `datos_wbs.js` para actualizar métricas y el Menú. | Dashboard Actualizado |
| **6. Servicio** | `lfc-cli cook` | Convierte MD a HTML e inyecta la insignia Michelin SICC v7.0. | lfc-2.vercel.app (Live) |

**Referencia Cruzada:** Para el detalle del motor de cocinado y scripts de servicio, consultar [architectureLFC.md](file:///home/administrador/docker/LFC2/architectureLFC.md).

---

## ⚠️ Deuda Técnica Activa

| Item | Estado |
|---|---|
| Comando `/promote` DT→LFC2 | **COMPLETADO:** Automatización vía `src/gitlocal.js`. |
| Re-ingesta `contrato_documentos` | Fragmentos pre-fix oversized — re-ingestar con 800c/100c. |
| Interrogación iterativa Oracle | Juez debe emitir ≥2 preguntas de seguimiento al Oracle por ciclo. |
| `SICC_OPERATIONS.md` auto-actualización | Tras cada ciclo de auditoría — fecha, área, veredicto. |
| Integración DeepSeek nativa | **COMPLETADO:** Blocker final y Juez Principal. |

---

## 🛡️ Gobernanza R-HARD

1. **CAPEX Blindado:** $726.000.000 COP máx (WBS 6.1.100)
2. **Normativa:** FRA 49 CFR Part 236 / AREMA / Manual Vial 2024
3. **CPU:** >80% → Encolar (Bot informa estado de cola) | >95% → Bloqueo total.
4. **Idioma:** Español obligatorio en toda salida del agente.
5. **Verdad:** El Contrato APP 001/2025 (10.358 fragmentos) prevalece sobre cualquier inferencia.
6. **Autonomía:** PROHIBIDA la edición manual de dictámenes. Todo cambio vía ajuste del BRAIN.

---

## ⚕️ Protocolo de Saneamiento (Falsos Positivos del Juez)

La arquitectura delega el aprendizaje en el Juez (`swarm-pilot.js`). Sin embargo, si el Juez falla y **aprueba una alucinación (Falso Positivo)**, el sistema inyecta ese error en la base de datos vectorial (`sicc_genetic_memory`) como un Gold Standard, envenenando las futuras auditorías. Para corregir este "Punto Ciego", se debe ejecutar el siguiente protocolo manual:

1. **Purga Vectorial (LTM):** Eliminar el registro contaminado en Postgres para evitar que el RAG lo propague.
   `docker exec sicc-postgres psql -U sicc_app -d postgres_sicc -c "DELETE FROM sicc_genetic_memory WHERE metadata->>'documento' = 'DT-XXX';"`
2. **Vacuna Genética Preventiva:** Inyectar un mandato correctivo explícito en el archivo de especialidad correspondiente (`brain/SPECIALTIES/{area}.md`) para que en la Fase 1 el Auditor Forense lo lea antes de generar.
3. **Evolución del Juez (R-HARD):** Agregar una nueva restricción universal en `brain/R-HARD.md` para que el Juez penalice y rechace ese *Scope Creep* específico en el futuro.
4. **Sanitización del Documento:** Solo bajo este escenario excepcional de Falso Positivo se permite la edición manual correctiva del dictamen en `brain/dictamenes/`.

### 4. Capa de Inferencia Híbrida (Hybrid Sovereignty)

SICC v14.6 implementa una arquitectura de inferencia de dos niveles para maximizar el rendimiento sin sacrificar la soberanía:

- **Tier 1: Cloud-Free Power (NVIDIA NIM)**
  - **Uso:** Razonamiento complejo, auditorías forenses y generación de Dictámenes Técnicos (DT).
  - **Modelos:** Nemotron-3-Super (Planning), DeepSeek-v4-pro (Reasoning), Llama-3.1-70B (Pureza).
  - **Ventaja:** Acceso gratuito a modelos de +100B parámetros con 1M de contexto.

- **Tier 2: Sovereign Fallback (Ollama Local)**
  - **Uso:** Ingesta masiva (Barrido Karpathy), operaciones offline y procesamiento de datos ultra-sensibles.
  - **Modelos:** Llama-3.1-8B, Gemma-2-9B.
  - **Ventaja:** Garantiza la operatividad del Agente si hay caídas de red o bloqueos de cuotas en proveedores cloud.

- **Mecanismo de Throttling:**
  - Todas las llamadas a NVIDIA NIM incluyen un retardo (sleep) de 1.5s y un **Prompt Destilado (<5000 chars)** para evitar saturación de la API Free y asegurar la continuidad del servicio.

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

# Auditorías recientes
ls brain/history/ | tail -5

# Trazas de inferencia (últimas 5)
tail -5 data/logs/sicc-traces.json | python3 -m json.tool
```

---

*Actualizado: 2026-04-28 | OpenGravity SICC v14.6 — "Blindaje Táctico Saneado"*
