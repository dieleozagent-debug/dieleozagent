# 🗺️ SICC AGENT ROADMAP — Estado Real (v12.2 | 16-Abr-2026)

> **⚡ LEER ESTO PRIMERO** — Este archivo es el SSOT de estado del proyecto.
> Si arrancas una nueva conversación, empieza aquí para no alucinar.

---

## 🏛️ QUÉ ES ESTE PROYECTO

**OpenGravity SICC** — Bot Telegram + RAG soberano para auditoría forense del
Contrato APP No. 001/2025 (LFC — Línea Ferroviaria de Carga, Colombia).

- **Usuario:** Diego Zuñiga (Auditor Superior / Mando Karpathy)
- **Stack:** Node.js 20, Telegram Bot, Supabase (pgvector), Gemini API (primario), Groq/OpenRouter/Ollama (fallback)
- **Repos:** /home/administrador/docker/agente (bot), /home/administrador/docker/LFC2 (docs ingeniería)
- **Contenedor activo:** dieleozagent-debug-dieleozagent-1 — modo --vigilia + patrulla pasiva

---

## ✅ COMPLETADO (no volver a hacer)

- [x] Ingesta soberana Biblia Legal → Supabase (22k fragmentos, 100%)
- [x] Eliminación total de la Hidra SENTINEL en local1/2/3 (Operación Zero Absolute)
- [x] Arquitectura Nodo Único Soberano v12.2 — sin scripts de persistencia en imagen
- [x] Backoff exponencial en ingest_masivo.js (manejo 429 API)
- [x] Backup institucional 06:00 AM activo
- [x] Modo Silencioso — sin heartbeats ruidosos en Telegram
- [x] Brain saneado: IDENTITY.md v6, SOUL.md, R-HARD.md (7 restricciones duras)
- [x] Gobernanza R-HARD activa — CAPEX  COP, FRA 49 CFR, hitos 01-ago-2025
- [x] DT-Señalización y DT-Energía → estado SANEADO
- [x] Mini-Cerberos de Especialidades en rain/SPECIALTIES/
- [x] Patrulla Forense Pasiva sobre LFC2 (19 carpetas, ciclo continuo)
- [x] Fix dependencia circular llamarMultiplexadorFree en agent.js
- [x] Compose actualizado: volumen LFC2, red docker_sicc_net, env_file

---

## 🔄 ESTADO HOY (16-Abr-2026)

| Item | Estado |
|---|---|
| Contenedor | 🟢 UP — 
ode src/agent.js --vigilia |
| Patrulla | 🟢 Activa — auditando carpeta ~8/19 de LFC2 |
| RAG/Brain | 🟢 Supabase conectado, 22k fragmentos |
| Ingesta | ✅ Completa (Biblia Legal al 100%) |
| DTs/DJs del enjambre | 🗑️ IGNORAR — son alucinaciones del swarm, no commitear |

---

## 🎯 PRÓXIMOS PASOS (en orden de prioridad)

### 1. Certificación Forense de Especialidades (ACTIVO)
- El agente está auditando LFC2 en modo pasivo
- Próximo hito: dictámenes de **Señalización (ENCE)** y **Telecomunicaciones (G.652.D)** certificados
- **Acción humana requerida:** revisar hallazgos en Telegram / /audit

### 2. Búsqueda Web Soberana (PENDIENTE)
- Integrar Serper/Tavily/Exa al agente
- Para validar AREMA 2024, FRA, UIC en tiempo real vs DBCD_CRITERIA.md

### 3. Auditoría Visual con Playwright (PENDIENTE)
- Screenshots de HTMLs → Telegram
- Después de que los dictámenes estén certificados

### 4. Skill Orchestrator (PENDIENTE)
- Evolucionar rain/skills/ de texto a scripts ejecutivos
- Nuevos comandos sin tocar src/agent.js

---

## ⚠️ REGLAS PARA EL AGENTE (NO OLVIDAR)

1. **DTs y DJs generados por el swarm = BASURA** — no commitear, no preservar
2. **LFC2 no tuvo commits desde el 10-Abr** — la patrulla solo hace format passes, no modifica contenido técnico
3. **El enjambre multi-agente está DESACTIVADO** — era fuente de alucinaciones y colapso de densidad
4. **No hay Sentinel, no hay cron externo** — toda la lógica está en src/agent.js
5. **Proveedores IA:** Gemini (primario) → Groq → OpenRouter → Ollama (local, fallback)

---

*Última actualización: 16-Abr-2026 12:43 COT — por Diego (mando humano)*
