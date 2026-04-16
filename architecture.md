# 🏛️ Arquitectura SICC v12.2 — "Paz Estructural"

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

- **Desde el Host (Ubuntu):** Acceso vía `localhost:11434`. (Ollama configurado con `OLLAMA_HOST=0.0.0.0` para visibilidad total).
- **Desde el Agente (Docker):** Comunicación vía el alias `opengravity-ollama` (mapeado a la IP de la puerta de enlace `172.20.0.1`) permitiendo acceso directo a la aceleración por hardware del servidor desde la red aislada `docker_sicc_net`.

---

## 🧠 Flujo de Datos (Cámara Doble Ciego)

1. **Ingesta:** El agente lee `LFC2/` (Read-Only).
2. **Deducción:** Se generan hipótesis contrastadas con la `Biblia-Legal`.
3. **Validación (SAPI):** El MCP (NotebookLM) valida la hipótesis contra fuentes externas no estructuradas.
4. **Consolidación:** Si hay match 100%, se emite una **Decisión Técnica (DT)** en `brain/SPECIALTIES/`.

---

## 🛡️ Gobernanza R-HARD

Toda decisión técnica debe respetar:
1. **CAPEX Inamovible:** Limites financieros del contrato.
2. **Normativa Técnica:** FRA 49 CFR Part 236 / AREMA.
3. **Soberanía:** Datos 100% locales, sin fuga de propiedad intelectual a nubes públicas (salvo Gemini como fallback).
