---
description: Protocolo de Simulación de Impacto y Trazabilidad (SIT) para Cambios Transversales — SICC v6.3
---

# 🛰️ Protocolo SIT: Simulación N -> N+1 (Cross-Repo)

Este flujo permite predecir errores analizando dependencias entre los 3 repositorios (`agente`, `brain`, `LFC2`) antes de ejecutar un cambio real.

## 1. El Concepto N+1 Soberano
- **Estado N**: La realidad grabada en los 3 repositorios.
- **Estado N+1**: Una propuesta de cambio técnico (DT).

## 2. Pasos de la Simulación

### Paso 1: Tesis de Cambio
El usuario o el Agente proponen una "Tesis" en `brain/PROGRAM.md`.

### Paso 2: Análisis Transversal (Backtrace N)
El Agente escanea los repositorios buscando dependencias:
- **LFC2**: ¿Qué entregables dependen de este ID?
- **Brain**: ¿Qué criterios DBCD (pureza) se ven afectados?
- **Agente**: ¿Alguna regla de negocio o script de procesamiento se romperá?

### Paso 3: Informe de Impacto N+1
El Agente simula la ejecución y reporta:
- ❌ **Breaking Changes**: "Borrar este ítem en LFC2 romperá el script de auditoría en `agente`".
- ✅ **Alineación**: "El cambio cumple con el criterio soberano de `brain/DBCD_CRITERIA.md`".

## 🛠️ Comando de Activación
Para activar este flujo, usa: `/simular [Tipo de Cambio] [Objeto]`

## 🧠 Integración
Este protocolo es mandatorio **antes** de ejecutar cualquier `lfc cook` que involucre cambios en la estructura de datos core. Todo SIT exitoso se registra en `brain/RESEARCH_LOG.md`.
