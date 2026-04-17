# 🏛️ Arquitectura SICC v12.3 — "Eficiencia Operacional"

SICC (**Sistema Integrado de Control Contractual**) es una arquitectura de agente soberano diseñada para la auditoría técnica y jurídica del proyecto LFC2.

---

## 🛰️ Topología de Red (Nodo Único Soberano)

El sistema opera en un servidor Ubuntu dedicado, combinando contenedores Docker aislados con servicios nativos para máximo rendimiento de IA.

### 1. Mapa de Servicios

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `dieleozagent-debug-dieleozagent-1` | 3000 | Orquestación y Telegram |
| **Base de Datos** | `sicc-postgres` | 5432 | Supabase / LTM (Vector DB) |
| **Ollama Swarm** | **Nativo en Host** (Ubuntu) | 11434 | Inferencia Local (GPU Nativa) |
| **NotebookLM MCP** | `notebooklm-mcp-v12` | n/a | SAPI de Verdad Externa |

### 2. Modelos de Inteligencia Local (Ollama)

| Modelo | Función | Dimensiones |
| :--- | :--- | :--- |
| `sicc-gemma4:q5` | Auditoría Forense y Razonamiento Deductivo | n/a |
| `nomic-embed-text`| Embeddings Vectoriales (LTM) | 768 |
| `phi3.5:latest` | Análisis rápido de sintaxis | n/a |

### 3. Rutas de Acceso (Conectividad)

- **Desde el Host (Ubuntu):** Acceso vía `localhost:11434`. (Ollama configurado con `OLLAMA_HOST=0.0.0.0`).
- **Desde el Agente (Docker):** Comunicación vía el alias `opengravity-ollama` (mapeado a la IP `172.20.0.1`) permitiendo acceso directo a la aceleración por hardware desde la red `docker_sicc_net`.
- **Base de Datos Forense:** Local Supabase (`postgres_sicc`) alojada en el contenedor `sicc-postgres`.

### 🗄️ Gestión de Datos (Ingesta y Consulta)

- **Proceso de Ingesta (Michelin v7.2):** 
    - **Detección Resiliente:** Búsqueda recursiva insensible a mayúsculas (detecta `.pdf` y `.PDF`).
    - **Capa de Visión Forense:** Integración de `pdftoppm` (renderizado 300dpi) y `Tesseract OCR` (español) para extraer texto de PDFs complejos e imágenes.
    - **Checkpoints:** Sistema de persistencia por archivo (`.checkpoint`) que permite reanudar ingestas interrumpidas sin duplicar datos.
- **Infraestructura Vectorial:**
    - **Base de Datos:** Postgres 17 con extensión `pgvector` habilitada manualmente.
    - **Almacenamiento:** Tabla `contrato_documentos` en la DB `postgres_sicc`.
    - **Vectores:** 768 dimensiones generadas por `nomic-embed-text` vía Ollama.
- **Flujo de Consulta:** El enjambre consulta esta tabla en la **Fase 2 (Validación Interna)** mediante funciones de similitud de coseno.

---

## 🛡️ Gobernanza R-HARD (Recursos)

Toda decisión técnica debe respetar:
1. **CAPEX Inamovible:** Limites financieros del contrato ($726M COP).
2. **Normativa Técnica:** FRA 49 CFR Part 236 / AREMA.
3. **Soberanía:** Datos 100% locales (Ollama Nativo).
4. **Gobernanza de Recursos (CPU):**
   - **Umbral de Alerta (80%):** Las auditorías se encolan en `AUDIT_QUEUE.md`.
   - **Umbral Crítico (95%):** Bloqueo total de inferencia local para proteger el host.
   - **Throttling:** Pausas de 2s entre inferencias para estabilidad térmica.

## 🐝 El Enjambre SICC (Swarm Intelligence)

El enjambre no es una simple lista de proveedores, sino un sistema de **validación cruzada** diseñado para eliminar el "ruido" técnico y las alucinaciones. Opera mediante la orquestación de múltiples agentes especializados:

1.  **Peones Ollama (Soberanía Local):** Ejecutan la minería de datos pesada y la deducción primaria sobre el host Ubuntu.
2.  **Auditores Forenses (Cloud):** Gemini y Groq actúan como auditores de segundo nivel, verificando la lógica legal y contractual sin acceso directo a los archivos sensibles del host.
3.  **Juez Soberano:** Un modelo de alta capacidad (ej. Gemini 1.5 Pro) que toma las versiones de los peones y auditores, las compara y emite un veredicto final.

---

## 🌪️ Decantación de Karpathy (El Proceso de 5 Fases)

Para garantizar que ninguna alucinación técnica toque el SSOT (Single Source of Truth), toda hipótesis técnica debe atravesar un proceso de **decantación en 5 fases**:

1.  **Fase 1: Sueño (Hipótesis):** El agente genera una propuesta técnica basada en la necesidad operativa (ej. "Modificar el bus vital a 110VDC").
2.  **Fase 2: Validación Interna (Supabase RAG):** La hipótesis se enfrenta contra la "Biblia Legal". Si el contrato dice algo distinto, se genera una señal de rechazo.
3.  **Fase 3: Validación Externa (NotebookLM MCP):** El MCP consulta fuentes externas (AREMA, FRA, noticias técnicas) para asegurar que la propuesta cumple con estándares globales de ingeniería.
4.  **Fase 4: Juicio Soberano (Deducción N-1):** El Juez analiza las validaciones (Interna vs. Externa). Si hay contradicción, aplica el principio **N-1 (Grasa Zero)**: se elimina el elemento complejo y se prioriza la seguridad contractual.
5.  **Fase 5: Integración y Memoria (Karpathy Lesson):** Si la propuesta falló, el error se "decanta" en una lección aprendida que se inyecta permanentemente en los archivos de `brain/SPECIALTIES/`, asegurando que el enjambre nunca repita el mismo error de diseño.

---

## 🛠️ Validación y Telemetría

- **SICC Traces:** Cada ciclo de decantación se registra en `data/logs/sicc-traces.json` con un hash de integridad.
- **EstadoGlobalErrores:** Monitorea en tiempo real la salud de los proveedores (4xx) para garantizar que el enjambre nunca quede "ciego" por falta de cuota.
