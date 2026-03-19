# Arquitectura de Ecosistema Soberano v2.3.2
> **Concepto:** Modularidad Radical · Independencia de Repositorios · Auditoría Forense · RAG Repair

**Última actualización:** 2026-03-19 · **Versión:** 2.3.2 "Sovereign Mode"

---

## 🏗️ Estructura de "Tres Pilares" (3-Repo Modularity)

El sistema ha evolucionado de un almacén monolítico a un **Ecosistema de Tres Repositorios** independientes. Esta separación garantiza que la lógica del bot no contamine el conocimiento del proyecto ni los entregables.

### 1. El Motor (Agente)
- **Repo:** `dieleozagent-debug/dieleozagent`
- **Función:** Servicios de Node.js, Polling de Telegram, Lógica de Enrutamiento de IA y Gestión de Fallbacks.
- **Seguridad:** Implementa un divisor de mensajes (3500 chars) y un modo seguro de prompt (30k chars).

### 2. El Oráculo (Brain)
- **Repo:** `dieleozagent-debug/brain`
- **Montaje:** Volumen Docker en `/app/data/brain/`.
- **Componentes:**
  - `SOUL.md`: Identidad y principios.
  - `DBCD_CRITERIA.md`: La Ley Maestra (SSOT).
  - `PROGRAM.md`: El Gestor de Misiones (Orquestación de tareas).
  - `RESEARCH_LOG.md`: La Memoria Forense de auditorías realizadas.

### 3. El Taller (LFC2)
- **Repo:** `dieleozagent-debug/LFC2`
- **Montaje:** Volumen Docker en `/app/repos/LFC2/`.
- **Función:** Area de trabajo donde el agente aplica Decisiones Técnicas (DTs), sanea archivos Markdown y "sirve" los platos HTML finales a través del motor `lfc.sh`.

---

## 🧬 Flujo de Auditoría Proactiva (Karpathy Loop)

El agente opera bajo un ciclo de investigación continua:

1.  **Planificación**: El agente lee `PROGRAM.md` en el repo **Brain**.
2.  **Auditoría**: Escanea el repo **LFC2** buscando desviaciones contra los criterios de **Brain/DBCD_CRITERIA.md**.
3.  **Tesis**: Propone un saneamiento vía Telegram.
4.  **Ejecución**: Genera la DT en **LFC2** y documenta el éxito en **Brain/RESEARCH_LOG.md**.
5.  **Cierre**: Realiza Git Push independiente en los 3 repositorios.

---

## 🛰️ Capas de Inteligencia Estabilizadas

### 1. Capa de Fallback (Resiliencia)
Implementa un bucle de proveedores: **Groq (Llama-3)** como motor de alta velocidad y **Gemini** como motor de razonamiento profundo y RAG. Si uno falla o alcanza el límite de tokens, el sistema escala automáticamente.

### 2. Capa de RAG Repair
Utiliza embeddings locales para auditar archivos PDF masivos (Contratos/Apéndices). Se ha corregido el modelo a `models/gemini-embedding-001` para asegurar compatibilidad total con la API de Google.

### 3. Capa de Fragmentación (UX)
Debido a las restricciones de Telegram (4096 chars), el agente fragmenta respuestas técnicas extensas en paquetes de 3500 chars, asegurando que la información técnica nunca se pierda por errores de transporte.

---

## 💾 Gestión de Datos y Volúmenes

| Volumen / Ruta en Host | Ruta en Contenedor | Persistencia |
|---|---|---|
| `/home/.../docker/agente/brain` | `/app/data/brain` | SSOT (Brain Repo) |
| `/home/.../docker/LFC2` | `/app/repos/LFC2` | Workspace (LFC2 Repo) |
| `/home/.../data-agente` | `/app/data` | Memoria y Logs Locales |

---

## 🛡️ Principios de Soberanía Técnica
- **Data Locality**: Los datos de ingeniería nunca salen del servidor Ubuntu fuera de la llamada a la API.
- **Modularidad**: Si un repositorio se corrompe, los otros dos permanecen intactos.
- **Traceability**: Cada cambio tiene un ID de DT y una justificación amparada por la metodología DBCD.

**OpenGravity — Arquitectura para la Verdad Técnica.**
