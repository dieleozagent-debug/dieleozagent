---
description: Protocolo de Simulación de Impacto y Trazabilidad (SIT) para Cambios Transversales
---

# 🛰️ Protocolo SIT: Simulación N -> N+1

Este flujo permite al Agente y al Usuario predecir errores antes de que lleguen al Front-End, analizando dependencias "Adelante" (Futuro/N+1) y "Atrás" (Histórico/N).

## 1. El Concepto N+1
- **Estado N**: La realidad actual grabada en Git (WBS, Riesgos, Cronograma).
- **Estado N+1**: Una propuesta de cambio (ej. "Eliminar el ítem 1.1.100").
- **Simulación**: El Agente crea un mapa de impacto sin modificar los archivos reales.

## 2. Pasos de la Simulación

### Paso 1: Definición del Cambio (Input)
El usuario o el Agente proponen una "Tesis" o cambio técnico (DT).

### Paso 2: Análisis "Hacia Atrás" (Backtrace N)
El Agente escanea el repositorio buscando dependencias del objeto a cambiar:
- ¿Qué Riesgos dependen de este WBS?
- ¿Qué Párrafos del Contrato (DBCI) obligan a que exista?
- ¿Qué Fases de ingeniería se verán afectadas?

### Paso 3: Análisis "Hacia Adelante" (Impact N+1)
El Agente simula la ejecución y reporta:
- ❌ **Breaking Changes**: "Si borramos esto, el Gráfico de Gantt dará error en la línea 220".
- ⚠️ **Inconsistencias**: "El presupuesto bajará en $10.000 USD pero el riesgo R-01 sigue activo".
- ✅ **Alineación**: "El cambio cumple con el criterio DBCI-C5: Eficiencia de Red".

---

## 🛠️ Cómo Iniciar una Simulación
Para activar este flujo, usa el comando:
`/simular [Tipo de Cambio] [Objeto]`

*Ejemplo: `/simular cambio_wbs 1.1.105`*

---

## 🧠 Integración con el Cerebro
Este protocolo se guarda en el "Brain" del agente para que, en futuras sesiones, yo sepa que **antes de ejecutar un `replace`, debo correr un SIT**.
