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
3.  **DT Oficial:** El bot genera un archivo `.md` con YAML en la carpeta `II. Apendices Tecnicos/Decisiones_Tecnicas/` justificando el cambio.
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

## ⚠️ Reglas de Oro v2.2.1
*   **SSOT:** Si el DBCD dice "No", el bot no te dejará decir "Sí" sin una DT que justifique la excepción.
*   **Trazabilidad:** Todos los cambios importantes terminan en un commit de Git con el ID del dictamen técnico.
*   **Identidad:** El bot es tu **Administrador Contractual + Diseñador UX Specialist**.
