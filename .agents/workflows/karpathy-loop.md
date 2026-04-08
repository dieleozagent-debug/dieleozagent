---
description: Protocolo de Simulación de Impacto y Trazabilidad (SIT) para Cambios Transversales — SICC v6.4.8
---

# 🌀 Protocolo Karpathy Loop (Alpha 2026 Edition)

Este protocolo permite que el Agente audite sistemáticamente los 3 repositorios (`agente`, `brain`, `LFC2`), identifique desviaciones soberanas y ejecute el saneamiento determinista usando el Enjambre Híbrido.

## 1. Fase de Planificación (Active Memory)
- El Agente revisa `ROADMAP.md` y `HEARTBEAT.md` para identificar el próximo paso del plan.
- Si no hay uno, realiza un escaneo exploratorio en `/home/administrador/docker/LFC2/` buscando términos prohibidos (GSM-R, RBC, ETCS, UNISIG) usando `grep`.

## 2. Auditoría Forense en Enjambre (Swarm)
- Se invoca al **Auditor Qwen 3.5 Flash** para identificar la brecha contractual y técnica.
- Se invoca al **Estratega Claude 4.6** para redactar la solución blindada.
- Se genera una **Decisión Técnica (DT)** formal en `LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/`.

## 3. Saneamiento y "Regla de Oro"
- El Agente aplica el saneamiento directamente en los archivos Markdown del repositorio `LFC2`.
- **Regla de Oro (Cook After Edit)**: Tras cada edición de un `.md`, el Agente DEBE servir el plato.
- // turbo
- Ejecuta: `cd /home/administrador/docker/LFC2 && ./lfc.sh sync && ./lfc.sh cook`

## 4. Registro y Cierre de Ciclo
- El Agente documenta el hallazgo en `brain/RESEARCH_LOG.md`.
- Se actualizan las métricas de pureza DBCD en el log central.
- // turbo
- Realiza Git Push en los 3 repositorios para asegurar la soberanía en la nube.
