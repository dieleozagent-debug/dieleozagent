# 📋 Manual del Gestor de DTs (DT Manager)
> **Versión:** 1.0.0 · **Rol:** Autoresearcher & Optimizer

## 🛠️ Flujo Operativo para la IA

Este documento define cómo el agente debe procesar y generar **Decisiones Técnicas (DT)** para asegurar la trazabilidad y la aprobación humana.

### 1. Detección y Tesis (Research Phase)
Cuando el agente escanea el repositorio (`SCAN`) y encuentra una desalineación con el `DBCD_CRITERIA.md`:
1. **Generar Tesis:** Crear un mensaje conciso para Telegram.
2. **Formato de Tesis:**
   - 🔍 **Hallazgo:** Archivo y línea específica.
   - ⚖️ **Conflicto:** Por qué viola el DBCD (ID del criterio).
   - 💡 **Propuesta:** Acción sugerida (Eliminar/Modificar/Agregar).
   - 💰 **Impacto:** Ahorro de CAPEX estimado o mejora operativa.

### 2. Generación del Artefacto DT (Drafting Phase)
Tras la aprobación en Telegram, el agente debe crear el archivo `.md` en `II. Apendices Tecnicos/Decisiones_Tecnicas/`.

**Estructura Obligatoria:**
- **Metadatos YAML (Sección 10):** Instrucciones para la auto-ejecución.
- **Justificación Técnica:** Basada en normatividad (AREMA/FRA).
- **Referencia SSOT:** Vínculo directo al `DBCD_CRITERIA.md`.

### 3. Ejecución Automatizada (Execution Phase)
Para ejecutar un DT (propio o pre-existente):
1. **Leer Sección 10 (YAML):** Extraer los bloques `archivos_actualizar`.
2. **Aplicar Microcambios:** Usar `replace_file_content` para cada item listado.
3. **Actualizar WBS:** Si el DT afecta el presupuesto, actualizar `WBS_Presupuestal_v3.0.md` y `datos_wbs_TODOS_items.json`.
4. **Log de Ejecución:** Completar la Sección 12 del archivo DT con el timestamp y resultado.

---

## 📐 Estándar del YAML para el Agente

```yaml
dt_metadata:
  id: "DT-XXXX-NNN"
  fecha: "YYYY-MM-DD"
  estado: "ejecutado" # Cambiar tras ejecutar

archivos_actualizar:
  - file: "ruta/al/archivo.md"
    accion: "actualizar"
    seccion: "Nombre de la sección"
    cambios:
      - campo: "nombre_del_item"
        buscar: "texto viejo"
        reemplazar: "texto nuevo"
```

---

## 🛡️ Reglas de Seguridad
- **Backup:** Siempre realizar un commit en Git antes de ejecutar un DT masivo.
- **Validación Cruzada:** Tras ejecutar un DT, volver a correr el scanner de cumplimiento contra el DBCD para asegurar que no se introdujeron nuevas desalineaciones.
