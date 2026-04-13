# 🤖 OpenGravity Agent — Ecosistema Soberano v9.4.0 (Morning Digest Edition)

> **Stack:** Node.js · **Batch Factoría Serial v8.8** · **Qwen 2.5 1.5B (Host)** · Docker · **RED Protocol Engine**

OpenGravity es un **Agente de IA Autónomo y Auditor Transversal** diseñado para operar con soberanía tecnológica total. Utiliza una arquitectura modular de 3 repositorios independientes para separar la lógica de ejecución del conocimiento y los entregables de ingeniería.

---

## 🏛️ Arquitectura Soberana — OpenGravity SICC v9.4.0 "Morning Digest"

El proyecto está dividido en tres unidades git independientes sincronizadas proactivamente:

1.  **[Agente](https://github.com/dieleozagent-debug/dieleozagent)**: (Este repo) Motor core de Node.js, interfaz de Telegram y conectores de IA.
2.  **[Brain](https://github.com/dieleozagent-debug/brain)**: El repositorio SSOT. Contiene el alma (`SOUL.md`), criterios de ingeniería (`DBCD_CRITERIA.md`) y el log de experimentos (`RESEARCH_LOG.md`).
3.  **[LFC2](https://github.com/dieleozagent-debug/LFC2)**: Repositorio de entregables finales, planos y Decisiones Técnicas (DTs).

---

## 📁 Estructura del Repositorio Agente

```
agente/
├── .agents/workflows/        # 🌀 Protocolos Operativos (Karpathy Loop, SIT, Síntesis)
├── brain/                    # 🧠 CEREBRO (Repositorio montado como volumen Docker)
├── src/                      # Código fuente del motor
├── ollama-data/              # 🏠 Almacén de Modelos Locales (gemma4-light:latest)
├── docs/                     # 📄 Documentación técnica (Arquitectura, DT Manager)
├── Contrato pdf/             # 📚 Fuente RAG para auditoría forense
├── Dockerfile                # Imagen Node.js 20-Alpine
├── docker-compose.yml        # Orquestación de volúmenes y red
└── README.md                 # Este manual maestro
```

---

-   **Protocolo de Gobernanza v9.4.0 (Morning Digest):** 
    - **Muro de Fuego de Sonnet:** Escalación automática prohibida. Alertas Rojas inmediatas ante bloqueo de CAPEX.
    - **Búfer Michelin:** Los hallazgos forenses no críticos se encolan en `data/logs/michelin-findings.json`.
    - **Digest Consolidado:** Notificación única en Telegram con la síntesis de hallazgos para revisión ejecutiva.
    - **Trazabilidad Michelin:** Registro obligatorio de trazas para auditar el uso del ADN del cerebro.
-   **Sequential Swarm**: Debate multi-agente forense optimizado (Auditor vs Director).
-   **SICC Factory Mode**: Minería serial con enfriamiento de CPU y Peones ultra-ligeros.
-   **Digital Dashboard**: Tablero `brain/SICC_OPERATIONS.md` para gestión centralizada de Blockers y DTs.

---

## 🛠️ Instalación y Despliegue

### 1. Variables de Entorno (.env)
Asegúrate de configurar `AI_PRIMARY_PROVIDER=groq` y las claves correspondientes para evitar cuellos de botella por rate-limiting en Gemini.

### 2. Levantar con Docker

```bash
cd /home/administrador/docker/agente
docker compose up -d --build
```

### 3. Sincronización de Repositorios

Cada repositorio es independiente. Tras cambios en el cerebro o entregables, utiliza `git push` en sus respectivas carpetas para mantener la nube actualizada.

---

## 🌀 Protocolos Operativos (Slash Commands Telegram)

-   `/ollama [prompt]`: **[Soberano]** Ejecuta Inferencia Directa con el servidor local.
-   `/cmd [comando]`: **[Soberano]** Interfaz de consola remota para ejecución shell pura.
-   `/audit [ruta]`: **[Soberano]** Inicia Karpathy Loop v8.4 y genera reporte RED.
-   `/swarm [pregunta]`: Debate forense multi-agente en modo secuencial.
-   `/karpathy-loop`: Auditoría forense automatizada en el repositorio `LFC2`.
-   `/simulacion-sit`: Simula el impacto de cambios técnicos antes de ejecutarlos.
-   `/sintesis-memoria`: Graba las lecciones de la sesión en `brain/DBCD_CRITERIA.md`.
-   `/cerebro`: Verifica la integridad funcional de la identidad del agente.

---

## 📜 Licencia y Soberanía
Este proyecto es 100% auditable y prioriza modelos Open-Weights. **OpenGravity** no es solo una herramienta, es el guardián de la coherencia técnica del proyecto LFC.

**SICC — Excelencia técnica desde la raíz.**
