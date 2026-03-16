# DBCI Criteria: Determinismo Bajo Control de Interacción

Este documento es la **Fuente Única de Verdad (SSOT)** para el Agente Antigravity. Cualquier cambio en el repositorio LFC2 debe ser validado contra estos criterios.

## 📐 Criterios Técnicos Maestros (SSOT)

### DBCI-C1: Arquitectura PTC Virtual / Nativo
- **Descripción**: El sistema SICC debe priorizar la soberanía técnica del PTC Nativo LFC.
- **Mandato**: Eliminar cualquier referencia a protocolos propietarios cerrados que no tengan pasarela de abstracción.

### DBCI-C2: Trazabilidad Multinivel (L1-L2-L3)
- **Descripción**: Todo ítem L3 del presupuesto debe estar mapeado a una fase del Cronograma.
- **Mandato**: Ejecutar `lfc validate` tras cualquier cambio en `WBS_Presupuestal_v2.0.md`.

## 🛰️ Protocolo de Ejecución SIT (Simulation of Impact)

Para evitar alucinaciones y breaking changes, el agente debe seguir estas reglas:

### SIT-RULE-01: Simulación Mandatoria
- **Acción**: Antes de modificar códigos WBS o estructuras de datos en `LFC2`, el agente **DEBE** ejecutar el `sit-simulator.js`.
- **Propósito**: Identificar riesgos huérfanos antes de que el error llegue a producción.

### SIT-RULE-02: Saneamiento Recursivo
- **Acción**: Si la simulación detecta impactos, el agente no puede hacer cambios parciales. Debe proponer un cambio atómico que incluya el origen y todos sus dependientes.

## 🧠 Motor de Aprendizaje y Evolución

El agente no solo sigue reglas, sino que las **destila** de la interacción:

### LEARN-RULE-01: Destilación de Éxitos
- **Proceso**: Tras cada "Walkthrough" exitoso que resuelva un error estructural (ej. 404s, TypeErrors), el agente debe evaluar si existe un patrón.
- **Acción**: Si el patrón es repetible, el agente **DEBE** actualizar este documento `DBCD_CRITERIA.md` con una nueva regla mandatoria.

### LEARN-RULE-02: Retroalimentación del Usuario
- **Proceso**: Si el usuario propone una corrección de estilo o flujo, esta se convierte en una "Preferencia de ADN".
- **Acción**: Actualizar el `UX_DESIGN_SYSTEM.md` o este documento para que la preferencia sea la base de la próxima generación de código.

---
*Versión: 1.1.0 | Evolución: Aprendizaje Autónomo Activado*
