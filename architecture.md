# 🏛️ Arquitectura SICC v12.7 — "Institucionalización Forense"

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
| **NotebookLM MCP** | `notebooklm-mcp-v12` | n/a (STDIO Bridge) | **Oracle de Verdad Externa.** Aislado en Docker para persistencia de sesión Chrome y evitar contaminación de dependencias (Playwright/Chrome) en el Core. |

### 2. Modelos de Inteligencia Local (Ollama)

| Modelo | Función | Dimensiones |
| :--- | :--- | :--- |
| `gemma4-light:latest` | Auditoría Forense y Razonamiento Deductivo | n/a |
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
- **Infraestructura Vectorial (Long Term Memory - LTM):**
    - **Base de Datos:** Postgres 17 (Supabase Local) con extensión `pgvector`.
    - **Almacenamiento:** 
        1. `contrato_documentos`: Biblia Legal (Contexto).
        2. `sicc_genetic_memory`: Lecciones Aprendidas (Auto-tuning/Sistema Inmune).
    - **Motor de Embeddings (Soberanía Dual):**
        1. **Primario:** Ollama Local (`nomic-embed-text`) para 100% de soberanía.
        2. **Contingencia:** Google Gemini (`text-embedding-004`) en caso de fallo del host local.
    - **Flujo de Consulta (RAG-Match):** El enjambre consulta automáticamente la tabla en la **Fase 2**. 
        - **Gatillos:** Mensajes > 10 caracteres o mención de palabras clave (`contrato, anexo, multa, obligación, apéndice, AT`).
        - **Algoritmo:** Búsqueda por similitud de coseno (Top 3 fragmentos) inyectados directamente en el System Prompt.

### 🏛️ Jerarquía de Rutas Soberanas (SSoP)

Para garantizar la resiliencia y evitar la "ceguera" agéntica (blindness), el sistema impone una estructura de rutas absolutas sincronizadas. El uso de rutas relativas fuera del núcleo `src/` está prohibido para asegurar que los crons y contenedores siempre localicen la "Verdad".

| Directorio | Ruta en Contenedor | Racional Forense (El "Por Qué") |
| :--- | :--- | :--- |
| **Raíz Agente** | `/home/administrador/docker/agente` | Nodo de ejecución central. Garantiza que los binarios y dependencias (node_modules) sean consistentes. |
| **Cerebro (Brain)**| `/home/administrador/docker/agente/brain` | **SSOT Contractual.** Aquí reside el R-HARD. Es la fuente de la Fase 4 (Juicio) para evitar alucinaciones. |
| **LFC2 (Docs)** | `/home/administrador/docker/LFC2` | Repositorio de ingeniería externa. Se usa para auditorías de consistencia (Cross-Ref) contra planos y técnicos. |
| **Biblia Legal** | `/home/administrador/docker/agente/Contrato pdf` | Fuente primaria OCR. Es la entrada de la Michelin para la Fase 2 (RAG). Debe estar aislada del código. |
| **Logs / Traces** | `/home/administrador/docker/agente/data/logs` | Telemetría. Permite la reconstrucción forense de cada decisión en caso de fallo técnico o legal. |

**Regla de Oro de Direccionamiento:**
Todos los servicios deben heredar sus rutas de `src/config.js`. Si un script necesita acceder al cerebro, debe usar `config.paths.brain` para asegurar que, si el sistema se despliega en otro nodo, solo sea necesario cambiar una variable de entorno (`BRAIN_ROOT`) para que todo el enjambre recupere la vista.

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

## 🌪️ El Bucle de Decantación (Karpathy Loop)

El sistema opera mediante un ciclo de refinamiento iterativo de 5 fases, donde la **Memoria Genética** actúa como el sistema inmune del Agente:

1.  **Fase 1: Hipótesis (Drafting) + Vacunación:** 
    - El Multiplexor consulta `sicc_genetic_memory` buscando errores pasados similares a la consulta actual.
    - Se inyectan las **Lecciones Aprendidas** como restricciones duras en el prompt inicial para evitar reincidencias.
2.  **Fase 2: RAG-Match (Soberanía Interna):** Cruce obligatorio contra la Biblia Legal en `postgres_sicc`. Se extraen los 3 fragmentos contractuales más relevantes.
3.  **Fase 3: Oracle-Check (Verdad Externa - NotebookLM MCP):** 
    - **Por qué:** Validación contra normas internacionales (FRA, AREMA, IEEE) no contenidas en el contrato.
    - **Cuándo:** Se activa ante consultas técnicas complejas o mención de estándares regulatorios.
    - **Qué pasa:** El archivo `src/sapi/notebooklm_mcp.js` ejecuta un puente vía `docker exec` hacia el contenedor `notebooklm-mcp-v12`, consultando una libreta de ingeniería pre-cargada.
    - **Resultado:** Proporciona un "Segundo Voto" técnico para evitar alucinaciones operativas.
4.  **Fase 4: Juicio R-HARD (Deducción N-1):** El Juez audita el output contra límites de CAPEX ($726M) y plazos contractuales. Aplica la técnica de "Grasa Zero" (elimina lo innecesario).
5.  **Fase 5: Decantación e Ingesta (Auto-tuning):** 
    - Si hay fallo en las fases anteriores, se genera una **Lección Aprendida**.
    - La lección se vectoriza en `sicc_genetic_memory` y se guarda físicamente en `brain/SPECIALTIES/`.
    - El ciclo se reinicia (Max 3 veces) con el nuevo conocimiento inyectado.

## 🐝 El Enjambre SICC (Swarm Intelligence)

El enjambre no es una simple lista de proveedores, sino un sistema de **validación cruzada** diseñado para eliminar el "ruido" técnico y las alucinaciones. Opera mediante la orquestación de múltiples agentes especializados:

1.  **Peones Ollama (Soberanía Local):** Ejecutan la minería de datos pesada y la deducción primaria sobre el host Ubuntu.
2.  **Auditores Forenses (Cloud):** Gemini y Groq actúan como auditores de segundo nivel, verificando la lógica legal y contractual sin acceso directo a los archivos sensibles del host.
3.  **Juez Soberano:** Un modelo de alta capacidad (ej. Gemini 1.5 Pro) que toma las versiones de los peones y auditores, las compara y emite un veredicto final.
4.  **Escalada de Razonamiento (Thinking Fallback):** En caso de bloqueo técnico o ambigüedad extrema, el sistema escala automáticamente a un modelo de razonamiento profundo (`gemini-2.0-flash-thinking`) para intentar una resolución lógica antes de activar el Muro de Fuego.

---

## 🛠️ Validación y Telemetría

- **SICC Traces:** Cada ciclo de decantación se registra en `data/logs/sicc-traces.json` con un hash de integridad.
- **EstadoGlobalErrores:** Monitorea en tiempo real la salud de los proveedores (4xx) para garantizar que el enjambre nunca quede "ciego" por falta de cuota.

---

## 🧩 El Cerebro Multiplexado (sicc-multiplexer.js)

El Multiplexor es el centro de despacho lógico del Agente. Su función es garantizar que cada consulta sea procesada por el modelo más eficiente y con el contexto técnico correcto.

### 1. Flujo de Ruteo Especializado
1.  **Detección de Especialidad:** Analiza palabras clave (ej: "fibra", "SIL-4", "UPS") para identificar la especialidad (**SIGNALIZATION, POWER, COMMUNICATIONS**, etc.).
2.  **Inyección de Mini-Cerbero:** Carga el archivo correspondiente de `brain/SPECIALTIES/`. Este archivo contiene reglas específicas que el Agente debe obedecer.
3.  **Jerarquía de Proveedores (Handoff):**
    - **Nivel 1 (Flash):** Intenta Gemini 2.0 o Groq para velocidad.
    - **Nivel 2 (Local):** Si no hay internet o falla la cuota, conmuta a **Ollama (Host)**.
    - **Nivel 3 (Razonamiento):** Ante ambigüedad, activa la **Escalada de Razonamiento** (`flash-thinking`).
    - **Nivel 4 (Bloqueo):** Si todo falla, activa el **Muro de Fuego** y solicita firma manual.

### 2. Iteraciones y Aprendizaje (Karpathy Loop)
- **Número de Iteraciones:** Máximo **3 ciclos** de re-intento por consulta compleja.
- **Validación Local (Ollama):** Los "Peones" locales revisan el output del modelo Cloud buscando alucinaciones de CAPEX o normativa.
- **Mecanismo de Aprendizaje:** 
    - Si una respuesta falla la validación, el error se captura y se genera una **"Lección Aprendida"**.
    - Esta lección se inyecta en el prompt de la siguiente iteración y se guarda en `brain/SPECIALTIES/`.
    - **Resultado:** El sistema nunca comete el mismo error de diseño dos veces.
