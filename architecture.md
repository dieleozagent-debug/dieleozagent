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

### Nodo de Inferencia
- **Primario (Local):** Ollama con `gemma4-light:latest` (Q4_K_M, 5.0 GB).
- **SICC Hard-Cap:** Límite estricto de 3 CPUs — garantiza SSH ininterrumpido.
- **Fallback Cloud:** Groq (Llama-3.3-70B) → Gemini → OpenRouter.

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

### 3. SICC Dreamer (Autonomía Nocturna)
El Agente trabaja mientras Diego duerme — sin intervención humana.
- **Ciclo Cron:** `0 2 * * *` — Solo si CPU < 80%.
- **Flujo:** Lee `brain/DREAMS.md` → Infiere con Ollama (máx. 3 hipótesis/noche) → Deposita borradores en `brain/PENDING_DTS.md` → Notifica Telegram al amanecer.
- **SSOT Files:** `brain/DREAMS.md` (cola) · `brain/PENDING_DTS.md` (aprobación).
- **Bot:** `/dream` — Estado de la cola y borradores pendientes.

### 4. Skills Registry Modular (Anti-Inflación Cognitiva)
El system prompt pasa de monolito estático (29k chars) a contexto dinámico especializado.
- **Mecánica:** `seleccionarSkills(texto)` detecta el dominio del mensaje y carga solo el Skill relevante.
- **Skills disponibles:**
  - `brain/skills/skill-telecom.json` — Red Vital IP, AREMA Comms, G.652.D
  - `brain/skills/skill-capex.json` — Optimización CAPEX, WBS financiera
  - `brain/skills/skill-om.json` — O&M soberano, mantenimiento predictivo
  - `brain/skills/skill-contracts.json` — AT1, AT10, Cláusulas ANI, Ley 1508
- **Efecto:** System prompt dinámico < 10k chars → 3× más rápido, ~60% menos alucinaciones.

### 5. Métricas Cuantitativas (Sovereign Health Score)
`lfc-doctor.js` genera un score numérico (0-100) para medir la pureza del sistema.
- `100 - 10 por cada falla de DNA (RBC, GSM-R)` - `10 por rutas rotas` - `10 por Git sucio`

### 6. Auto-Aprendizaje de Skills (Recursive Mapping)
`lfc_learn.js` escanea LFC2 y mapea dinámicamente nuevos entregables — sin lista estática.

---

## ⚖️ Comparativa Arquitectónica

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
