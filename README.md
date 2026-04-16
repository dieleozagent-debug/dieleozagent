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

## 💬 Comandos Telegram Activos

| Comando | Función |
|---|---|
| /dream [tema] | Modo Sueño (Swarm Pilot v12.3 con Throttling) |
| /doctor | Health report del sistema SICC (Score: 100/100) |
| /learn | Mapear recursivamente LFC2 y actualizar rutas |
| /cerebro | Verificar integridad de IDENTITY.md, SOUL.md, R-HARD.md |

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
