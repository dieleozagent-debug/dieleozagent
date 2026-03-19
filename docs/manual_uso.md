# 📖 Manual de Uso del Agente LFC (Autoresearcher v2.2)

Bienvenido a la versión avanzada de tu asistente IA. Este agente no solo responde preguntas, sino que **audita, investiga y optimiza** proactivamente el repositorio del proyecto.

---

## 🚀 Capacidades de "Autoresearcher"

A diferencia de un bot tradicional, este agente opera bajo un ciclo de mejora continua:

### 1. Auditoría y Saneamiento (DBCD Master)
El bot utiliza el archivo `DBCD_CRITERIA.md` como su Fuente Única de Verdad (SSOT). 
*   **Proactividad:** Escanea tus carpetas en busca de incoherencias (ej: términos obsoletos como ETCS o materiales que no cumplen el presupuesto).
*   **Acción:** Detectará "zombis" informativos y te propondrá eliminarlos.

### 2. Ciclo de Decisión Técnica (DT)
Cada cambio importante en el proyecto sigue un flujo auditable:
1.  **Tesis:** El bot te propone una mejora por Telegram (*"¿Qué tal si cambiamos X por Y?"*).
2.  **Conversación:** Tú apruebas o ajustas la idea en el chat.
### Protocolo de Integridad L3/L4 (Karpathy Feedback Loop)
1. **Validación Visual**: Al terminar un `serve`, verifica que las tablas no sean solo texto, sino que tengan los componentes L4 (botones, clases `premium-card`).
2. **Reconstrucción**: Si el MD es simple pero el plato debe ser complejo, el agente debe actualizar los scripts de transformación (`lfc-cli.js`) para "reconstruir" la riqueza técnica desde los ingredientes básicos.
3. **Escalamiento de Feedback**: Si el usuario reporta una pérdida de estilo, documenta la clase CSS faltante en el `SOUL.md`.
4.  **Ejecución:** El bot aplica el cambio en el WBS (Excel/JSON) y en los documentos técnicos automáticamente.

### 3. Consultoría UX/UI Premium
El bot ahora tiene un "ojo estético" para tus tableros de control:
*   **Diseño Ejecutivo:** Puede transformar un dashboard simple en una interfaz de alto impacto (Glassmorphism, paletas HSL).
*   **Justificación:** Sus propuestas incluyen el *Qué*, el *Por qué* y criterios de usabilidad.

---

## 🛠️ Herramientas de Automatización (Linux-Native)

Si necesitas ejecutar herramientas directamente en la terminal (Ubuntu), hemos unificado todo en el **LFC-CLI**:

### Comandos Principales:
Desde la carpeta raíz del proyecto (`LFC2/`), puedes ejecutar:
*   `./lfc.sh sync`: Sincroniza el WBS Presupuestal (.md) con las bases de datos (.json/.js) y actualiza los dashboards.
*   `./lfc.sh cook`: Regenera los entregables en la **Carpeta X** basándose en los cambios de las carpetas de diseño (III, IV, V).
*   `./lfc.sh serve`: Convierte tus documentos `.md` a formatos empresariales (**Word** y **HTML**) usando el binario de Pandoc optimizado.
*   `./lfc.sh design`: Aplica automáticamente los tokens de diseño (colores, fuentes) a tus interfaces HTML.

---

## 🎯 Consejos para una Mejor Interacción
*   **Pídele Tesis:** "Revisa el Capítulo 4 y dame una Tesis de optimización de costos".
*   **Envía PDFs:** Sigue siendo un experto en RAG. Puede leer un acta y decirte si viola algún criterio del DBCD.
*   **Pide Dictámenes:** "Genera un DT para eliminar el ítem 1.1.20 y explica el ahorro en el CAPEX".

---

## 🛡️ Estabilidad y Resiliencia (v2.2.1)

El agente ahora es más robusto ante fallos externos:
*   **Safe-Messaging:** Si Telegram falla al procesar el formato (Markdown), el bot reintenta automáticamente en texto plano. No más silencios.
*   **Fallback Inteligente:** Si Gemini agota su cuota (Error 429), el bot salta a **Groq (Llama 3.3)** en milisegundos para mantener la conversación fluida.
*   **Purga de Docker:** El sistema se mantiene limpio de imágenes huérfanas automáticamente después de cada actualización.

---

## 🗂️ Gestión de Repositorios (v2.3 — Brain Separado)

El sistema ahora opera con **3 repositorios independientes**:

| Repo | Qué versiona | Cómo hacer push |
|------|-------------|------------------|
| `agente/` | Código del bot | `cd agente && git push` |
| `agente/brain/` | SSOT (criterios, identidad) | `cd agente/brain && git push` |
| `LFC2/` | Proyecto del cliente | `cd LFC2 && git push` |

> ⚠️ Los cambios en `brain/` son **independientes** del código del bot. Un `git push` en `agente/` no sube los cambios del cerebro.

---

## 🚀 Migración a VPS

Gracias a la arquitectura Docker + 3 repos separados, migrar a una VPS es directo:

```bash
# 1. Clonar los 3 repos en la VPS
git clone https://github.com/dieleozagent-debug/dieleozagent.git agente
git clone https://github.com/dieleozagent-debug/brain.git agente/brain
git clone https://github.com/dieleozagent-debug/LFC2.git LFC2

# 2. Configurar variables de entorno
cd agente && cp .env.example .env && nano .env

# 3. Crear directorio de datos persistentes
mkdir -p /home/administrador/data-agente

# 4. Levantar el agente
docker compose up -d --build
```

> El volumen `brain/` se monta automáticamente como se define en `docker-compose.yml`. No se requiere ningún cambio adicional.

---

## ⚠️ Reglas de Oro v2.3
*   **SSOT:** Si el DBCD dice "No", el bot no te dejará decir "Sí" sin una DT que justifique la excepción.
*   **Trazabilidad:** Todos los cambios importantes terminan en un commit de Git con el ID del dictamen técnico.
*   **Brain separado:** Cambios en la identidad/criterios → commit en `brain/`, no en `agente/`.
*   **Identidad:** El bot es tu **Administrador Contractual + Diseñador UX Specialist**.
