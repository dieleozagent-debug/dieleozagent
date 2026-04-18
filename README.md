# 🤖 OpenGravity SICC — Agente Soberano v12.9

> **⚡ INICIO RÁPIDO:** Lee `architecture.md` para el diseño completo. `brain/ROADMAP.md` para el estado exacto.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC2, Colombia).

---

## 🚀 Estado Actual: v12.9 — Pipeline de Aprendizaje Activo

| Sistema | Estado |
|---|---|
| Bot Telegram | 🟢 Operativo |
| Oracle NotebookLM | 🟢 `notebooklm-mcp-v12` — 108 fuentes activas |
| Learning pipeline | 🟢 Primeras entradas reales en `sicc_genetic_memory` (2026-04-18) |
| CPU Governor | 🟢 Umbral 80%, throttling activo |
| Ollama embeddings | 🟢 `nomic-embed-text` 768 dims |

---

## 🗺️ Rutas Soberanas

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
| `/dream [tema]` | Ciclo Karpathy 5 fases — Vacunación → RAG → Oracle → Juicio → Auto-tuning. Timeout 30 min. |
| `/swarm [pregunta]` | Enjambre secuencial: Auditor + Estratega SICC |
| `/doctor` | Health report: score, CPU, telemetría 4xx |
| `/learn` | Auto-mapeo recursivo LFC2 |
| `/cerebro` | Verifica SOUL + R-HARD + IDENTITY + METHODOLOGY activos |
| `/ingesta [ruta]` | Pipeline OCR: PDF → chunks 800c → embeddings → Supabase |
| `/cmd [comando]` | Shell en el contenedor |
| `/audit [ruta]` | Auditoría forense de un directorio LFC2 |
| `/estado` | Proveedores IA y memoria activos |

---

## 🌪️ El Ciclo `/dream` — 5 Fases

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
    │   └─ Juez cruza borrador + feedback → { aprobado, razon, leccion_karpathy }
    │
    └─ Fase 5: PERSISTENCIA
        ├─ SIEMPRE: guardarVeredictoJuez() → sicc_genetic_memory
        ├─ Si APROBADO: DT en brain/dictamenes/ + guardarDTCertificada() → sicc_genetic_memory
        └─ Si RECHAZADO: lección en brain/SPECIALTIES/{categoria}.md
                         borrador en brain/PENDING_DTS/ (tras 3 ciclos)
```

**Hard-caps:** 3 ciclos máx | 30 min exec | Oracle 90s client timeout | Auto-restart Chrome si -32001

---

## 🧠 Cómo aprende el agente

| Mecanismo | Dónde | Cuándo |
|---|---|---|
| Vacunas genéticas | `sicc_genetic_memory` → inyectadas en Fase 1 | Cada `/dream` y cada mensaje |
| Lecciones Karpathy | `brain/SPECIALTIES/{area}.md` → append | Cada rechazo del Juez |
| Gold standards | `brain/dictamenes/` → leídos por `simulator.js` | Futuros sueños del mismo área |
| SOUL + R-HARD + IDENTITY | Estáticos — definen comportamiento base | Siempre en system prompt |

**Estado sicc_genetic_memory (2026-04-18):** 59 lecciones manuales + 1 DT_CERTIFICADA + 1 VEREDICTO_JUEZ reales (dream ENCE).

---

## 📦 Integración LFC2 → Vercel

Las DTs certificadas se **promueven manualmente** al repo documental:

```bash
# 1. Copiar DT aprobada a LFC2
cp brain/dictamenes/DT-*_APROBADO.md \
   /home/administrador/docker/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/

# 2. Compilar y servir (pandoc MD → HTML)
cd /home/administrador/docker/LFC2
node scripts/lfc-cli.js cook && node scripts/lfc-cli.js serve

# 3. Publicar
git add II_Apendices_Tecnicos/ && git commit -m "feat: DT certificada SICC" && git push
```

Vercel auto-deploya en `lfc-2.vercel.app` al detectar el push.

---

## 🗄️ Infraestructura

| Servicio | Contenedor | Puerto | Estado |
|---|---|---|---|
| Agente Core | `dieleozagent-debug-dieleozagent-1` | — | 🟢 |
| Oracle NotebookLM | `notebooklm-mcp-v12` | 3001 (SSE) | 🟢 |
| Postgres + pgvector | `sicc-postgres` | 5432 | 🟢 |
| Ollama (embeddings) | Nativo en host | 11434 | 🟢 |

---

## 🧠 Cerebro (brain/)

```
brain/
├── IDENTITY.md           ← ADN del agente
├── SOUL.md               ← Ética operacional
├── R-HARD.md             ← 7 restricciones duras (CAPEX $726MM)
├── SICC_METHODOLOGY.md   ← Protocolo N-1 deductivo
├── SPECIALTIES/          ← 6 mini-expertos (lecciones Karpathy auto-append)
│   ├── SIGNALIZATION.md
│   ├── COMMUNICATIONS.md
│   ├── POWER.md
│   ├── INTEGRATION.md
│   ├── ENCE.md
│   └── CONTROL_CENTER.md
├── dictamenes/           ← DTs aprobadas (texto completo, inmutables)
├── DREAMS/               ← Log de cada sueño (aprobado y rechazado)
├── PENDING_DTS/          ← Borradores impuros tras 3 ciclos → revisión humana
└── ROADMAP.md            ← Estado del proyecto + deuda técnica
```

---

## ⚠️ Deuda Técnica Activa

Ver sección completa en `architecture.md` y `brain/ROADMAP.md`.

**Resumen:** ~8 archivos `src/` + ~15 `scripts/` muertos. Dead code en `agent.js` (rutarEspecialidad, PROMPT_FULL, advisor/digest nunca llamados). Pendiente limpieza.

---

## 🚀 Arrancar / verificar

```bash
cd /home/administrador/docker/agente
docker compose ps
docker compose logs -f --tail=30
curl http://localhost:3001/health
```
