# 📋 Manual del Gestor de DTs (DT Manager)
> **Versión:** 1.0.1 · **Rol:** Autoresearcher & Optimizer · **SSOT:** [ARCHITECTURE.md](file:///home/administrador/docker/agente/architecture.md)

## 🛠️ Flujo Operativo para la IA

Este documento define cómo el agente debe procesar y generar **Decisiones Técnicas (DT)** para asegurar la trazabilidad y la aprobación humana.

### 1. Detección y Tesis (Research Phase)
Cuando el agente escanea el repositorio (`SCAN`) y encuentra una desalineación con el [DBCD_CRITERIA.md](file:///home/administrador/docker/agente/brain/DBCD_CRITERIA.md):
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

## 📋 Manual del Gestor de DTs (DT Manager) v2.3.2
> **Arquitectura:** Modular Soberana (3-Repo) · **SSOT:** [ARCHITECTURE.md](file:///home/administrador/docker/agente/architecture.md)

## 🛠️ Flujo Operativo Cross-Repo

Este protocolo define cómo el agente debe procesar y generar **Decisiones Técnicas (DT)** operando entre los repositorios `agente`, `brain` y `LFC2`.

### 1. Detección (Brain & LFC2)
Cuando el agente identifica una desalineación en el repositorio de trabajo (`LFC2`) contra los criterios del repositorio maestro (`brain/DBCD_CRITERIA.md`):
1. **Generar Tesis:** Crear un mensaje técnico para Telegram.
2. **Formato de Tesis:**
   - 🔍 **Hallazgo:** Archivo en `LFC2` y línea específica.
   - ⚖️ **Conflicto:** ID del criterio en `brain/DBCD_CRITERIA.md`.
   - 💡 **Propuesta:** Acción sugerida de saneamiento.

### 2. Generación del Artefacto (LFC2 Draft)
Tras la aprobación, el agente crea el archivo `.md` en:
`/app/repos/LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/DT-YYYY-NNN.md`

**Estructura del DT:**
- **Sección 10 (Metadata YAML):** Instrucciones de auto-ejecución parseables.
- **Sección 11 (Justificación):** Alineación con la soberanía técnica SICC.
- **Sección 12 (Log):** Registro de ejecución.

### 3. Ejecución y Sincronización (Execution Phase)
Para ejecutar un DT de forma soberana:
1. **LFC2 Update:** Aplicar los cambios en los archivos de ingeniería de `LFC2`.
2. **Brain Log:** Registrar el éxito del experimento en `brain/RESEARCH_LOG.md`.
3. **Regla de Oro:** Ejecutar `./lfc.sh sync && ./lfc.sh cook` en `LFC2` para servir el plato actualizado.

---

## 📐 Estándar YAML (Sección 10)

```yaml
dt_metadata:
  id: "DT-2026-XXX"
  repo: "LFC2"
  estado: "ejecutado"

cambios_transversales:
  - file: "docs/ingenieria/ejemplo.md"
    buscar: "ERTMS L2"
    reemplazar: "PTC Virtual (SICC)"
```

---

## 🛡️ Seguridad y Trazabilidad
- **Git Sync**: Se debe realizar push en el repo `agente` (para el motor) y en el repo `brain` (para el log) tras cada DT exitosa.
- **Validación SIT**: Antes de aplicar, se recomienda correr el protocolo `/simulacion-sit` para predecir impactos colaterales.
