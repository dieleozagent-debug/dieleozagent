# 🤖 OpenGravity SICC — Agente Soberano v12.3

> **⚡ INICIO RÁPIDO:** Lee roadmap.md primero para saber el estado exacto del proyecto.

**OpenGravity SICC** es un bot de Telegram + motor RAG para auditoría forense del
**Contrato APP No. 001/2025** (Línea Ferroviaria de Carga — LFC, Colombia).

---

## 🚀 Estado Actual: v12.3 "Eficiencia Operacional"
- **Estado:** 🟢 Operativo (**100/100 Certificado**).
- **CPU:** Gobernanza R-HARD activa (Umbral 80%, Throttling 2s).
- **Cerebro:** `SOUL.md` (Ética) y `IDENTITY.md` sincronizados y restaurados.
- **Infraestructura:** Ollama Nativo (Host) con puente DNS (Bridge IP 172.20.0.1).

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

### 🗄️ Gestión de Datos Soberana
- **Ingesta:** `node scripts/sicc-ingesta.js --path /ruta/pdfs` (OCR Michelin + pgvector).
- **Almacenamiento:** Tabla `contrato_documentos` en DB `postgres_sicc` (Supabase Local).
- **Consulta:** Automática durante el comando `/dream` (Fase 2).

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
