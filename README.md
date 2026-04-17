# 🤖 OpenGravity SICC — Agente Soberano v12.7

> **⚡ INICIO RÁPIDO:** Lee roadmap.md primero para saber el estado exacto del proyecto.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC, Colombia).

---

## 🚀 Estado Actual: v12.7 "Institucionalización Forense"
- **Estado:** 🟢 Operativo (**Soberanía de Rutas Certificada**).
- **CPU:** Gobernanza R-HARD activa (Umbral 80%, Throttling 2s).
- **Ingesta:** 🟠 Michelin v7.2 Activa (Biblia Legal inyectándose).
- **Memoria:** LTM Supabase Vectorial integrada con pgvector.

---

## 🗺️ Mapa de Rutas Soberanas (SSoP)

| Recurso | Ruta Absoluta (Docker) |
| :--- | :--- |
| **Raíz Código** | `/home/administrador/docker/agente` |
| **Cerebro (SSOT)**| `/home/administrador/docker/agente/brain` |
| **Contrato (PDFs)**| `/home/administrador/docker/agente/Contrato pdf` |
| **Base Legal** | `/home/administrador/docker/LFC2` |
| **Logs / Traces** | `/home/administrador/docker/agente/data/logs` |

---

## 🚀 Cómo arrancar / verificar

```bash
# Ver estado del contenedor
cd /home/administrador/docker/agente
docker compose ps

# Ver logs en vivo
docker compose logs -f --tail=30
```

---

## 📡 Proveedores IA (en orden de prioridad)

1. **Gemini** (Google) — primario
2. **Groq** — fallback gratuito
3. **Ollama** (local) — fallback offline (Nativo en Host via 0.0.0.0)

---

## 💬 Comandos Telegram

| Comando | Función |
|---|---|
| /dream [tema] | **Karpathy Auto-Dream**: Genera hipótesis técnicas, las valida en doble ciego y decanta lecciones en el Brain. |
| /doctor | **Health Report**: Diagnóstico de pureza técnica, CPU y telemetría de errores 4xx. |
| /learn | **Auto-Aprendizaje**: Mapeo recursivo de LFC2 y reflexión sobre el SSOT. |
| /cerebro | **Integridad**: Verifica ADN SICC (IDENTITY, SOUL, R-HARD). |

---

## 🐝 El Enjambre y la Decantación (v12.3)

SICC opera mediante un **Enjambre de IA** orquestado por la **Cámara de Doble Ciego**:
1. **Generación:** El enjambre propone una hipótesis técnica.
2. **Validación:** Se cruza contra **Supabase** (Contrato Interno) y **NotebookLM** (Verdad Externa).
3. **Decantación de Karpathy:** El conocimiento se filtra en 5 fases hasta convertirse en una **DT Certificada** o una **Lección Aprendida** en `brain/SPECIALTIES/`.

### 🗄️ Gestión de Datos (Memoria LTM)
- **Base de Datos (Supabase Local):** Postgres 17 con `pgvector` para almacenamiento de la Biblia Legal.
- **Ingesta (Michelin v7.2):** `node scripts/sicc-ingesta.js`. Procesa PDFs y genera embeddings.
- **Auto-tuning (Memoria Genética):** `node scripts/sicc-seed-memory.js`. Inyecta "vacunas" contra errores recurrentes y alucinaciones técnicas.
- **Memoria de Largo Plazo (LTM):** Cada interacción con el Agente que mencione temas contractuales activa una búsqueda por similitud de coseno para inyectar fragmentos literales del contrato en el prompt.
- **Resiliencia:** Si Ollama (local) falla al generar embeddings, el sistema escala automáticamente a Gemini Cloud para mantener la visión.

---

## 🧠 Cerebro (brain/)

```bash
brain/
├── IDENTITY.md       ← ADN del agente v6. Mandatos soberanos.
├── SOUL.md           ← Ética operacional. Eficiencia + silencio.
├── R-HARD.md         ← 7 restricciones duras del contrato y hardware.
├── AUDIT_QUEUE.md    ← Cola de auditoría diferida por carga de CPU.
└── SPECIALTIES/      ← Mini-Cerberos por especialidad técnica.
```
