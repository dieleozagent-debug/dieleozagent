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
| **NotebookLM MCP** | `notebooklm-mcp-v12` | n/a (STDIO Bridge) | **Oracle de Verdad Externa.** Aislado en Docker para persistencia de sesión Chrome y evitar contaminación de dependencias en el Core. |

### 2. Modelos de Inteligencia Local (Ollama)

| Modelo | Función | Dimensiones |
| :--- | :--- | :--- |
| `gemma4-light:latest` | Auditoría Forense y Razonamiento Deductivo | n/a |
| `nomic-embed-text`| Embeddings Vectoriales (LTM) | 768 |
| `phi3.5:latest` | Análisis rápido de sintaxis | n/a |

### 3. Rutas de Acceso (Conectividad)

- **Desde el Host (Ubuntu):** Acceso vía `localhost:11434`. (Ollama configurado con `OLLAMA_HOST=0.0.0.0`).
- **Desde el Agente (Docker):** Comunicación vía el alias `opengravity-ollama` (mapeado a la IP `172.20.0.1`).
- **Base de Datos Forense:** Local Supabase (`postgres_sicc`) alojada en el contenedor `sicc-postgres`.

---

## 🗄️ Gestión de Datos (Ingesta y Consulta)

### 1. Proceso de Ingesta (Michelin v7.2)
- **Detección Resiliente:** Búsqueda recursiva insensible a mayúsculas.
- **Capa de Visión Forense:** Integración de `pdftoppm` (300dpi) y `Tesseract OCR` para PDFs complejos.
- **Checkpoints:** Sistema de persistencia por archivo para reanudar ingestas.

### 2. Infraestructura Vectorial (Long Term Memory - LTM)
- **Base de Datos:** Postgres 17 (Supabase Local) con extensión `pgvector`.
- **Almacenamiento:** 
    1. `contrato_documentos`: Biblia Legal (Contexto Contractual).
    2. `sicc_genetic_memory`: Lecciones Aprendidas (Auto-tuning / Sistema Inmune).
- **Motor de Embeddings (Soberanía Dual):**
    1. **Primario:** Ollama Local (`nomic-embed-text`) para 100% de soberanía.
    2. **Contingencia:** Google Gemini (`text-embedding-004`).

---

## 🌪️ El Bucle de Decantación (Karpathy Loop)

El sistema opera mediante un ciclo de refinamiento iterativo de 5 fases, donde la **Memoria Genética** actúa como el sistema inmune:

### 4. Detalle de Flujos y Componentes Forenses (SICC v12.7)

| Fase | Componente / Ruta | Función (Qué hace) | Racional (Por qué) | Salida (Output) |
|:---|:---|:---|:---|:---|
| **1. Vacunación** | `src/supabase.js` | Consulta `sicc_genetic_memory` por similitud. | Bloquea errores recurrentes y alucinaciones. | Vacunas (Prompt Constraints). |
| **2. RAG Match** | `src/sapi/supabase_rag.js` | Extrae fragmentos de la "Biblia Legal". | Ancla cada palabra al contrato LFC2. | Contexto Contractual literal. |
| **3. Oracle Check**| `src/sapi/notebooklm_mcp.js` | Conexión SAPI (Puerto 3001 interno) al Oráculo MCP. | Valida contra normas FRA/AREMA/UIC sin latencia `exec`. | Feedback de Verdad Externa. |
| **4. Juicio** | `scripts/swarm-pilot.js` | Juez AI evalúa Fases 1, 2 y 3. | Filtro final de "Grasa Zero" y CAPEX. | JSON (aprobado: true/false). |
| **5. Auto-tuning** | `brain/SPECIALTIES/*.md` | Registra el fallo como una lección. | Actualiza el "ADN" para el siguiente ciclo. | Lección Karpathy (ADN Update). |

---

## 🏛️ Jerarquía de Rutas Soberanas (SSoP)

Para evitar la "ceguera" agéntica, el sistema impone rutas absolutas sincronizadas herederadas de `src/config.js`.

| Directorio | Ruta en Contenedor | Racional Forense |
| :--- | :--- | :--- |
| **Raíz Agente** | `/home/administrador/docker/agente` | Nodo de ejecución central. |
| **Cerebro (Brain)**| `/home/administrador/docker/agente/brain` | **SSOT Contractual (R-HARD).** |
| **LFC2 (Docs)** | `/home/administrador/docker/LFC2` | Repositorio de ingeniería externa. |
| **Biblia Legal** | `/home/administrador/docker/agente/Contrato pdf` | Fuente primaria OCR. |
| **Logs / Traces** | `/home/administrador/docker/agente/data/logs` | Telemetría forense (Traces). |

---

## 🛡️ Gobernanza R-HARD (Recursos y Reglas)

1. **CAPEX Blindado:** Límite de **$726.000.000 COP** (WBS 6.1.100).
2. **Normativa:** FRA 49 CFR Part 236 / AREMA / Manual Vial 2024.
3. **Muro de Fuego de CPU:**
   - **80% Load:** Encolamiento en `AUDIT_QUEUE.md`.
   - **95% Load:** Bloqueo de inferencia local.

---

## 🛠️ Validación y Telemetría

- **SICC Traces:** Registro en `data/logs/sicc-traces.json` con hash de integridad.
- **EstadoGlobalErrores:** Monitoreo en tiempo real de fallos 4xx en proveedores.

#### 🔍 Protocolo de Inspección por Puerto (Diagnóstico Forense)
En caso de fallo en la Fase 3, se debe activar el **MCP Inspector** para validación humana:
- **Comando:** `npx @modelcontextprotocol/inspector docker exec -i notebooklm-mcp-v12 npx tsx src/index.ts`
- **Puerto:** `3000` / `3001` (Web UI).
- **Racional:** Permite verificar si la sesión de Google en el contenedor sigue activa y si el Oráculo responde a las herramientas (`ask_question`) antes de delegar la autonomía al Agente.

---
*Certificado por: OpenGravity Forensic Auditor*
*Estado: Institucionalizado v12.7*
