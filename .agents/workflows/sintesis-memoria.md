---
description: Protocolo de Síntesis de Memoria y Actualización de SSOT — SICC v6.3
---

# 🧠 Protocolo de Síntesis de Memoria (Sovereign)

Este flujo garantiza que el conocimiento adquirido durante una sesión de debugging o implementación se convierta en una regla mandatoria en el repositorio `brain`.

## 1. El Momento de Síntesis
Este protocolo se activa **después** de un "Walkthrough" exitoso y **antes** del cierre de la sesión.

## 2. Pasos de la Síntesis

### Paso 1: Identificación del Patrón
El agente debe preguntarse:
- ¿Este error (ej. Telegram 4096, RAG 404) ocurrió por una falta de estándar?
- ¿La solución aplicada es universalmente mejor para este proyecto?

### Paso 2: Actualización de la Ley (Brain Repo)
Si la respuesta es SÍ, el agente debe:
1. Abrir `brain/DBCD_CRITERIA.md`.
2. Crear una nueva **DBCI-CX** o **LEARN-RULE-XX**.
3. Documentar el "Mandato" (ej. "NUNCA enviar más de 4000 chars a Telegram").

### Paso 3: Sincronización Global
1. Registrar la lección en `brain/RESEARCH_LOG.md`.
2. Realizar Git Push en el repositorio `brain`.

## 3. Resultado Esperado
En la próxima sesión, el Agente leerá las nuevas reglas desde el `brain` y evitará el error **antes** de que ocurra.
