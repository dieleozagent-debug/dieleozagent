# 🤖 OpenGravity SICC — Agente Autónomo v14.0

> **⚡ INICIO RÁPIDO:** Lee `architecture.md` para el diseño completo. `roadmap.md` para el estado de ejecución y pendientes.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC2, Colombia).

---

| Sistema | Estado |
|---|---|
| Bot Telegram | 🟢 Operativo |
| Oracle NotebookLM | 🟢 `notebooklm-mcp-v12` — Sesión persistente |
| Learning pipeline | 🟢 DT_CERTIFICADA + VEREDICTO_JUEZ en `sicc_genetic_memory` |
| Auditoría SIL-4 | 🟢 Mandatos FRA 236 inyectados en SPECIALTIES/ |
| Anclaje Financiero | 🟢 WBS v3.0 ($88.112 MM CTC / $726M Locomotora) |
| CPU Governor | 🟢 Umbral 80%, throttling activo |
| Ollama embeddings | 🟢 `nomic-embed-text` 768 dims |

---

## 🗂️ Estructura de Código

```
src/
├── index.js          Bootstrap: dirs, brain, bot, crons, /dream launcher
├── agent.js          Motor: pipeline FASE-0..5 con trazas audit
├── handlers.js       Router: /comandos + loop INTENTS[]
├── utils/send.js     safeSendMessage: chunking + fallback Markdown
└── intents/          Lenguaje natural sin LLM
    ├── navigation.js     "me pierdo / cómo empiezo"
    ├── brain-state.js    soul / enjambre / lecciones de auditoría
    ├── dream-state.js    sueños / historial área / roadmap
    └── dt-ops.js         DTs aprobadas / promote / flujo contractual
```

---

## 🗺️ Rutas del Sistema SICC

| Recurso | Ruta |
| :--- | :--- |
| **Código** | `/home/administrador/docker/agente/src/` |
| **Cerebro** | `/home/administrador/docker/agente/brain/` |
| **DTs certificadas** | `brain/dictamenes/` |
| **Sueños** | `brain/DREAMS/` |
| **Borradores impuros** | `brain/PENDING_DTS/` |
| **Base Legal LFC2** | `/home/administrador/docker/LFC2` |
| **Oracle MCP** | `/home/administrador/docker/notebook-mcp` |

---

## 💬 Comandos Telegram

| Comando | Función |
|---|---|
| `/audit [área]` | Bucle Forense SICC v14.0 (Fetcher → RAG → Oracle → Juez R-HARD-06 → Persistencia). |
| `/swarm [pregunta]` | Enjambre secuencial: Auditor + Estratega SICC |
| `/doctor` | Health report: score, CPU, telemetría 4xx |
| `/learn` | Auto-mapeo recursivo LFC2 |

---

## 🏛️ Avances de Arquitectura (SICC v14.0)
* **Oracle Fetcher (Fase 0.5):** Destilación de Supabase en Fichas Técnicas para evitar "amnesia de contexto" en los LLM locales.
* **Rescate de Emergencia (OpenRouter):** Si la cuota de Groq se agota (429 Diario), el Juez salta automáticamente a `openrouter/free` (con `json_object` forzado) para proteger el registro de auditoría.
* **Oráculo Blindado:** Conexión a NotebookLM mediante resolución DNS de Docker (`notebooklm-mcp-v12:3001`) para evitar errores de IP (ECONNREFUSED).
| `/cerebro` | Verifica SOUL + R-HARD + IDENTITY + METHODOLOGY activos |
| `/ingesta [ruta]` | Pipeline OCR: PDF → chunks 800c → embeddings → Supabase |
| `/cmd [comando]` | Shell en el contenedor |
| `/audit [ruta]` | Auditoría forense de un directorio LFC2 |
| `/estado` | Proveedores IA y memoria activos |

## 🤖 Lenguaje Natural (sin /comando)

El bot entiende preguntas directas sin necesidad de comandos slash:

| Pregunta | Responde con |
|---|---|
| `hola` / `buenas` / `hi` | Menú de comandos |
| `me pierdo, cómo me ayudas` | Guía del flujo completo |
| `como aprende tu soul` | SOUL.md + pipeline de aprendizaje |
| `el enjambre ya entiende?` | Estado de lecciones de auditoría activas |
| `qué sueños tienes pendientes` | DREAMS/ + PENDING_DTS/ |
| `qué temas puedo proponer` | Áreas disponibles + ROADMAP pendiente |
| `historial de comunicaciones` | Lecciones + DTs + estado Vercel del área |
| `qué DT tengo bloqueadas` | Aprobadas, sin promover, pendientes revisión |
| `qué hacemos con DT-ENRG-2026-004` | Resumen del archivo + pasos promote |

---

## 🌪️ El Ciclo `/dream` — Ciclo de Refinamiento Forense

```
/dream [área]
    │
    ├─ Fase 1: VACUNACIÓN GENÉTICA
    │   └─ buscarLecciones() → sicc_genetic_memory (coseno >0.7) → vacunas anti-alucinación
    │
    ├─ Fase 2: GENERACIÓN
    │   └─ Auditor Forense genera borrador DT completo
    │
    ├─ Fase 3: DOBLE CIEGO
    │   ├─ validarInternaSupabase() → contrato_documentos (Biblia Legal)
    │   └─ validarExternaNotebook() → notebooklm-mcp-v12 → Chrome → NotebookLM
    │
    ├─ Fase 4: JUICIO
    │   └─ Juez cruza borrador + feedback → { aprobado, razon, leccion_auditoria }
    │
    └─ Fase 5: PERSISTENCIA
        ├─ SIEMPRE: guardarVeredictoJuez() → sicc_genetic_memory
        ├─ Si APROBADO: DT en brain/dictamenes/ + guardarDTCertificada() → sicc_genetic_memory
        └─ Si RECHAZADO: lección → brain/SPECIALTIES/{área}.md | borrador → PENDING_DTS/
```

**Hard-caps:** 3 ciclos máx | 30 min exec | Oracle 90s timeout

---

## 🧠 Cómo aprende el agente

| Mecanismo | Dónde | Cuándo |
|---|---|---|
| Vacunas genéticas | `sicc_genetic_memory` → inyectadas en FASE-1 | Cada `/dream` y cada mensaje |
| Lecciones de Auditoría| `brain/SPECIALTIES/{area}.md` → append | Cada rechazo del Juez |
| Gold standards | `brain/dictamenes/` → leídos por `simulator.js` | Futuros sueños del mismo área |
| SOUL + R-HARD + IDENTITY | Estáticos — definen comportamiento base | Siempre en system prompt |

---

## 🛡️ Gobernanza de Inferencia (Firewall)

El agente opera bajo un régimen de **Muro de Fuego (Firewall)**:
- Prioriza proveedores gratuitos (Gemini, Groq, OpenRouter Free).
- Usa modelos locales (Ollama) para autonomía total.
- **BLOQUEO:** Si se agotan las vías gratuitas, el agente emite un bloqueo de firma y requiere autorización manual para usar modelos premium.

---

## 📦 Pipeline DT → LFC2 → Vercel

Las DTs certificadas se **promueven manualmente** (comando `/promote` pendiente):

```bash
# 1. Copiar DT aprobada a LFC2
cp brain/dictamenes/DT-*_APROBADO.md \
   /home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/

# 2. Publicar
cd /home/administrador/docker/LFC2
git add . && git commit -m "feat: DT certificada SICC" && git push
```

Vercel auto-deploya en `lfc-2.vercel.app` al detectar el push (~2 min).

---

## 🚀 Arrancar / verificar

```bash
cd /home/administrador/docker/agente
docker compose ps
docker compose logs -f --tail=30

# Solo pipeline de inferencia (sin ruido)
docker compose logs -f | grep "\[AGENTE\]"

# Oracle health
curl http://localhost:3001/health
```

---
*Actualizado: 2026-04-24 | OpenGravity SICC v14.0*
