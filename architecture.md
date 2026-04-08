# 🏛️ Arquitectura Soberana — OpenGravity SICC v6.4

## 🌌 Visión General

La arquitectura de **OpenGravity** está diseñada para la **Soberanía Tecnológica Total** y la **Auditoría Forense Autónoma**. Opera bajo la filosofía de `claw-code` (UltraWorkers, 2025):

> *"Humans set direction; claws perform the labor. The bottleneck is no longer typing speed — it's architectural clarity, judgment, and taste."*

Diego da la dirección. El sistema ejecuta, valida y mejora — incluso mientras duerme.

---

## 🏛️ Estructura de Triple Repositorio (3-Repo Sovereign System)

La separación de preocupaciones se logra mediante tres unidades independientes de Git:

| Repositorio | Rol | Tecnología |
|:---|:---|:---|
| **[Agente](https://github.com/dieleozagent-debug/dieleozagent)** | Motor de ejecución, bot Telegram, orquestador | Node.js, Docker |
| **[Brain](https://github.com/dieleozagent-debug/brain)** | SSOT: identidad, criterios, memoria, Skills | Markdown, JSON |
| **[LFC2](https://github.com/dieleozagent-debug/LFC2)** | Verdad de Ingeniería: planos, DTs, contratos | Markdown, HTML |

### Nodo de Inferencia (v6.4.8 Alpha 2026 Edition)
- **Vigilia (Bot/Swarm):** Cloud-First vía OpenRouter con el motor **Alpha 2026 Elite**.
  - **Auditor:** `qwen/qwen3.5-flash-02-23` (#2 mundial en Legal, $0.065/M).
  - **Estratega:** `anthropic/claude-sonnet-4.6` (Lógica Senior SIL-4).
  - **Contexto:** Destilación dinámica vía `google/gemini-3.1-flash-lite-preview` ($0.25/M).
- **Capa de Memoria Contractual (LTM):** **Supabase Vector DB**.
  - **Función:** Almacena el ADN de contrato (PDFs) en embeddings de 768d (Gemini).
  - **RAG:** Recuperación reactiva de cláusulas para alimentar al Swarm.
- **Sueño (Autónomo):** Ollama con `gemma4-light:latest` (Local/Soberano).
- **SICC Hard-Cap:** Límite estricto de 3 CPUs para procesos locales.

---

## 🔄 Protocolos Operativos (The Loops)

### 1. Karpathy Loop (Sovereign Forensic Mode)
Auto-mejora del corpus de ingeniería mediante detección y eliminación de impurezas.
- **Ciclo:** Escaneo LFC2 → Detección de legacy (GSM-R, G.655, EN 50128) → Tesis de Saneamiento → Generación DT → `lfc cook` → Validación L4.
- **Script:** `scripts/karpathy_audit.js`

### 2. Protocolo SIT (Simulación de Impacto y Trazabilidad)
Sistema predictivo para cambios transversales. Ejecutar **antes** de cualquier modificación estructural.
- **Lógica N→N+1:** Backtrace de dependencias cross-repo + proyección de impacto.
- **Script:** `scripts/sit-simulator.js`

### 3. Síntesis de Memoria & Swarm Secuencial
Debate multi-agente forense con aprendizaje post-sesión.
- **Swarm:** Debate secuencial Auditor ↔ Estratega vía `/swarm [pregunta]` en Telegram.
- **Síntesis:** Los hallazgos se destilan en `brain/DBCD_CRITERIA.md`.

---

## 🛡️ Capacidades de Soberanía v6.4 (Implemented)

### 1. SICC Harness CLI (Control de Alucinaciones)
Motor central de orquestación con **Parity Guard** integrado.
- **Función:** Todo comando forense pasa por el Arnés. Si el LLM propone un término legacy ("Caja Negra", "Eurobaliza"), el Guard aborta la respuesta antes de que toque Git.
- **Comandos:** `node scripts/sicc-harness.js [doctor|learn|audit|status]`
- **Bot:** `/doctor` — Health Score numérico en tiempo real vía Telegram.

### 2. Resource Governor (Soberanía de CPU)
Middleware de planificación CPU-aware que protege el host de 4 núcleos.
- **Lógica:** Antes de cada inferencia Ollama, mide `os.loadavg()`. Si CPU > 70% → encola en Dreamer. Si CPU > 85% → fuerza fallback a Groq cloud.
- **Script:** `scripts/resource-governor.js`
- **Integración:** Wired directamente en `src/agent.js` antes de `llamarOllama()`.

> [!TIP]
> **Paradigma de Inteligencia Asimétrica (Vigilia vs Sueño):** 
> Para optimizar la usabilidad (UX) y el gasto de créditos, el sistema utiliza un **Enjambre Híbrido** diurno (abril 2026) en Telegram. El **80% del trabajo forense** lo realiza un modelo de bajo costo y alta precisión legal (Qwen 3.5), dejando el razonamiento costoso solo para la validación final. El procesamiento profundo y 100% soberano se reserva para el **Dreamer Nocturno** (Ollama).

### 3. Block Thinking & Destilación Dinámica
Mecanismo para evadir el **Error 413 (Token Limit)** en nubes comerciales.
- **Lógica:** Si el contexto RAG + Skills excede 10k caracteres, el sistema invoca un "Sumarizador Flash" que sintetiza la información antes de la inferencia principal, manteniendo la coherencia técnica sin saturar el payload.

### 3. SICC Dreamer (Autonomía Nocturna)
El Agente trabaja mientras Diego duerme — sin intervención humana.
- **Ciclo Cron:** `0 2 * * *` — Solo si CPU < 80%.
- **Flujo:** Lee `brain/DREAMS.md` → Infiere con Ollama (máx. 3 hipótesis/noche) → Deposita borradores en `brain/PENDING_DTS.md` → Notifica Telegram al amanecer.
- **SSOT Files:** `brain/DREAMS.md` (cola) · `brain/PENDING_DTS.md` (aprobación).
- **Bot:** `/dream` — Estado de la cola y borradores pendientes.

### 4. Skills Registry Multinivel (Active Capability)
El Agente carga dinámicamente habilidades según la intención del usuario detectada en `src/agent.js`.
- **Skills JSON (Conocimiento de Dominio):**
  - `skill-telecom.json`: Red Vital IP, G.652.D, AREMA Comms.
  - `skill-capex.json`: Optimización financiera, WBS.
  - `skill-om.json`: Mantenimiento predictivo, O&M soberano.
  - `skill-contracts.json`: Ley 1508, Cláusulas ANI.
- **Workflows MD (Manuales de Operación):**
  - `dbcd_scan.md`: Protocolo de escaneo de impurezas.
  - `dt_execute.md`: Guía para redactar Decisiones Técnicas blindadas.
  - `web_research.md`: Motor de investigación profunda en tiempo real.

---

## 🧠 Matriz de Memoria del Cerebro (23 Archivos)

La identidad del Agente se distribuye en una jerarquía de archivos Markdown inyectados asimétricamente:

1. **Memoria Activa (Inyectada en cada Prompt):**
   - `SOUL.md`: Alma y voz.
   - `IDENTITY.md`: Identidad y soberanía.
   - `AUTODETERMINACION_v3`: Lógica Deductiva N-1.
   - `INFERENCIA_RADICAL`: Auditoría de ADN técnico.
   - `INFERENCIA_DISENO_RECTOR`: Las reglas de la "Cocina" SICC.
   - `LFC_ROLE.md`: Misión contractual.
   - `DBCD_CRITERIA.md`: Criterios de diseño SSOT.
   - `P42_METODOLOGIA.md`: Guía de auditoría de brecha.

2. **Memoria Reactiva (Solo si se solicita):**
   - `DREAMS.md`: Tareas nocturnas.
   - `ROADMAP.md`: Estado del proyecto.
   - `HEARTBEAT.md`: Tareas de corta duración.
   - `PENDING_DTS.md`: Borradores en espera de firma.

3. **Log de Experimentos:**
   - `RESEARCH_LOG.md`: Bitácora histórica de sesiones.

| Característica | autoresearch (Karpathy) | claw-code (UltraWorkers) | OpenGravity SICC v6.4 |
|:---|:---|:---|:---|
| **Misión** | Optimizar código LLM | Demo de desarrollo autónomo | Plataforma Defensa Técnica Ferroviaria |
| **Métrica** | `val_bpb` | Stars/Forks | **Pureza DBCD** (Adherencia Soberana) |
| **Interfaz humana** | Terminal | Discord | **Telegram** |
| **Trabajo autónomo** | No | Sí (claws paralelos) | **Sí (Dreamer secuencial, Hard-Cap)** |
| **Control de alucinaciones** | No | Partial (parity audit) | **Sí (Parity Guard pre-commit)** |
| **Gestión de recursos** | No | No | **Sí (Resource Governor)** |

---

## 🗂️ Estructura del Repositorio Agente

```
agente/
├── .agents/workflows/        # 🌀 Karpathy Loop, SIT, Síntesis (slash commands)
├── brain/                    # 🧠 CEREBRO (SSOT, Skills, Dreams, Pending DTs)
│   ├── skills/               # 📦 Skills modulares por dominio
│   ├── DREAMS.md             # 💤 Cola de hipótesis para el Dreamer
│   └── PENDING_DTS.md        # 📋 Borradores de DT autónomos (pendiente aprobación)
├── scripts/
│   ├── sicc-harness.js       # ⚙️ CLI central con Parity Guard
│   ├── sicc-dreamer.js       # 💤 Agente autónomo nocturno (cron 2AM)
│   ├── resource-governor.js  # 🛡️ CPU-aware scheduler
│   ├── karpathy_audit.js     # 🔬 Auditoría forense de ADN
│   ├── lfc-doctor.js         # 🩺 Health Score cuantitativo
│   └── lfc_learn.js          # 📚 Auto-mapeo dinámico de LFC2
├── src/
│   ├── agent.js              # 🤖 Motor LLM + Skills Registry + Resource Governor
│   └── index.js              # 📱 Telegram bot (/doctor, /dream, /swarm, /git)
├── ollama-data/              # 🏠 gemma4-light:latest (Q4_K_M, local)
└── docker-compose.yml        # 🐳 Orquestación (Hard-Cap: 3 CPUs Ollama)
```

---

## ✅ Veredicto Final — v6.4

OpenGravity es una **Plataforma de Defensa Técnica Autónoma** para ingeniería ferroviaria soberana. Su diferencial sobre otros agentes de IA es que opera bajo restricciones de hardware real (4 núcleos, Hard-Cap) con garantías de *no-regresión de ADN técnico* (Parity Guard) y capacidad de trabajo autónomo profundo durante horas de baja carga (Dreamer).

**El Cerebro no es un chatbot. Es un Guardián que aprende.**
