# 🤖 OpenGravity Agent — Ecosistema Soberano v6.4

> **Stack:** Node.js · Telegram Bot API · **Ollama (Local)** · Groq · Gemini · Docker · Ubuntu Server

OpenGravity es un **Agente de IA Autónomo y Auditor Transversal** diseñado para operar con soberanía tecnológica total. Utiliza una arquitectura modular de 3 repositorios independientes para separar la lógica de ejecución del conocimiento y los entregables de ingeniería.

---

## 🏛️ Arquitectura Soberana (3-Repo Structure)

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

## 🚀 Estabilidad y Capacidades Críticas

-   **Multi-Provider Fallback**: **Ollama (Primario Local: gemma4-light:latest)** -> Groq (Secundario Llama-3) -> Gemini.
-   **Resource Governor**: Middleware CPU-aware que escala a cloud o encola tareas según la carga del host.
-   **SICC Dreamer**: Capacidad de auditoría autónoma nocturna (sin intervención humana) vía cron.
-   **Safe Prompt Mode**: Truncado automático de payloads para garantizar estabilidad en APIs externas.
-   **Telegram Message Splitter**: División automática de respuestas técnicas largas.
-   **Karpathy Loop**: Auto-investigación y saneamiento proactivo de documentos (Purge Mode).
-   **SICC Hard-Cap (Stability)**: Límite estricto de 3 núcleos para Ollama, garantizando SSH ininterrumpido.
-   **Sequential Swarm**: Debate multi-agente forense optimizado (Auditor vs Estratega).

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

## 🌀 Protocolos Operativos (Slash Commands)

-   `/karpathy-loop`: Inicia auditoría forense en el repositorio `LFC2`.
-   `/swarm [pregunta]`: Debate forense multi-agente (Auditor + Estratega) en modo secuencial.
-   `/simulacion-sit`: Simula el impacto de cambios técnicos antes de ejecutarlos.
-   `/sintesis-memoria`: Graba las lecciones de la sesión en `brain/DBCD_CRITERIA.md`.
-   `/cerebro`: Verifica la integridad de los 11 archivos de identidad del agente.

---

## 📜 Licencia y Soberanía
Este proyecto es 100% auditable y prioriza modelos Open-Weights. **OpenGravity** no es solo una herramienta, es el guardián de la coherencia técnica del proyecto LFC.

**SICC — Excelencia técnica desde la raíz.**
