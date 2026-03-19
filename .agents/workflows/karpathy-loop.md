---
description: Protocolo de Auditoría Forense y Mejora Continua (Karpathy Loop) — SICC v6.3
---

# 🌀 Protocolo Karpathy Loop (Sovereign Mode)

Este protocolo permite que el Agente audite sistemáticamente los 3 repositorios (`agente`, `brain`, `LFC2`), identifique desviaciones soberanas y ejecute el saneamiento determinista.

## 1. Fase de Planificación (Brain Repo)
- El Agente revisa `PROGRAM.md` para identificar el próximo experimento pendiente.
- Si no hay uno, el Agente realiza un escaneo exploratorio en `/app/repos/LFC2/` buscando términos prohibidos (GSM-R, RBC, ETCS, UNISIG) usando `grep`.
- Se actualiza `PROGRAM.md` con el nuevo objetivo y la skill a utilizar.

## 2. Auditoría Forense y Tesis
- El Agente ejecuta la skill `skills/dbcd_scan.md`.
- Se genera una **Tesis de Saneamiento** (vía Telegram) basada en `DBCD_CRITERIA.md`.
- Tras la aprobación del usuario, se crea una **Decisión Técnica (DT)** formal en `LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/`.

## 3. Saneamiento y "Regla de Oro"
- El Agente aplica el saneamiento directamente en los archivos Markdown del repositorio `LFC2`.
- **Regla de Oro (Cook After Edit)**: Tras cada edición de un `.md`, el Agente DEBE servir el plato.
- // turbo
- Ejecuta: `cd /app/repos/LFC2 && ./lfc.sh sync && ./lfc.sh cook`

## 4. Registro y Cierre de Ciclo
- El Agente documenta el hallazgo en `brain/RESEARCH_LOG.md`.
- Se actualizan las métricas de pureza DBCD en el log central.
- // turbo
- Realiza Git Push en los 3 repositorios para asegurar la sincronización en la nube.

## 5. Verificación L4 (The Plate)
- El Agente verifica el HTML generado y confirma que el cambio es 100% fiel a la "Receta Soberana".
- Se marca el experimento como **Completado** en `PROGRAM.md`.
