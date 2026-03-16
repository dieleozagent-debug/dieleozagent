---
description: Protocolo de Síntesis de Memoria y Actualización de SSOT
---

# 🧠 Protocolo de Síntesis de Memoria

Este flujo garantiza que el conocimiento adquirido durante una sesión de debugging o implementación no se pierda y se convierta en una regla mandatoria para futuras sesiones.

## 1. El Momento de Síntesis
Este protocolo se activa **después** de un "Walkthrough" exitoso y **antes** del cierre de la sesión.

## 2. Pasos de la Síntesis

### Paso 1: Identificación del Patrón
El agente debe preguntarse:
- ¿Este error (ej. TypeError, 404) ocurrió por una falta de estándar?
- ¿La solución aplicada (ej. Rutas absolutas) es universalmente mejor para este proyecto?

### Paso 2: Actualización de la Ley (DBCI)
Si la respuesta es SÍ, el agente debe:
1. Abrir `docs/DBCD_CRITERIA.md`.
2. Crear una nueva **DBCI-CX** o **LEARN-RULE-XX**.
3. Documentar el "Mandato" (lo que NO se debe permitir de nuevo).

### Paso 3: Sincronización de Knowledge Item (KI)
1. Actualizar el KI correspondiente en el brain (ej. `SIT_protocol_KI.md`).
2. Versionar el documento (ej. v1.1.0).

## 3. Resultado Esperado
En la próxima sesión, el Agente leerá las nuevas reglas y detectará el error **antes** de que ocurra, validando el código contra la "Ley" actualizada.
