---
description: Protocolo de Auditoría Forense y Mejora Continua (Karpathy Loop)
---

# 🌀 Protocolo Karpathy Loop

Este protocolo permite que el Agente audite sistemáticamente el repositorio, identifique desviaciones técnicas y proponga mejoras proactivas.

## 1. Fase de Auditoría Forense
- El Agente escanea las carpetas de ingeniería (III, IV, V) y la Carpeta X.
- Utiliza `DBCD_CRITERIA.md` y `lfc-terminology.js` como filtros de pureza.
- // turbo
Aplica el comando: `grep -ri "blacklist_term" [path]` basándose en la lista de `LEGACY_BLACKLIST`.

## 2. Generación de Tesis y DTs
- Por cada incoherencia (ej. mención a ETCS en vez de PTC), el Agente genera una **Tesis de Saneamiento**.
- Tras la aprobación del usuario, se crea una **Decisión Técnica (DT)** en `II. Apendices Tecnicos/Decisiones_Tecnicas`.

## 3. Saneamiento Determinista
- El Agente actualiza el diccionario `lfc-terminology.js` si el hallazgo es un nuevo patrón legacy.
- // turbo
Ejecuta: `node scripts/lfc-cli.js purify`

## 4. Regeneración y Verificación L4
- Se regeneran los platos servidos: `node scripts/lfc-cli.js cook [ID]` y `node scripts/lfc-cli.js serve`.
- El Agente verifica visualmente que el HTML tenga el badge de **Pureza SICC: 100%**.

## 5. Cierre de Ciclo (Commit)
- Registro en Git con trazabilidad al ID de la DT.
