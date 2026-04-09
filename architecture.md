# 🏛️ Arquitectura Soberana — OpenGravity SICC v6.4.18 Alpha

## 🌌 Visión General

La arquitectura de **OpenGravity** está diseñada para la **Soberanía Tecnológica Total** y la **Auditoría Forense Autónoma**. Opera bajo la filosofía de `claw-code` (UltraWorkers, 2025).

Diego da la dirección. El sistema ejecuta, valida y mejora — incluso mientras duerme.

---

## 🏛️ Estructura de Triple Repositorio (3-Repo Sovereign System)

| Repositorio | Rol | Tecnología |
|:---|:---|:---|
| **[Agente](https://github.com/dieleozagent-debug/dieleozagent)** | Motor de ejecución, bot Telegram, orquestador | Node.js, Docker |
| **[Brain](https://github.com/dieleozagent-debug/brain)** | SSOT: identidad, criterios, memoria, Skills | Markdown, JSON |
| **[LFC2](https://github.com/dieleozagent-debug/LFC2)** | Verdad de Ingeniería: planos, DTs, contratos | Markdown, HTML |

### Nodo de Inferencia (v7.0 Sovereign 2026 Edition)
- **Vigilia (Bot/Swarm):** Cloud-First vía OpenRouter con el motor **Alpha 2026 Elite**.
- **Capa de Memoria Contractual (LTM):** **Supabase Vector DB (3072 dims - Google Method)**. 
  - *Veredicto:* Se mantiene la estructura de 3072 dimensiones por ser la validada contractualmente.
- **Ingesta Masiva (Biblia Legal):** OCR Forense local (Tesseract) + Ingesta vía **Google LLM Free (3072 dims)**.
- **Topología de Red Aislada (Ollama Sandbox):** 
  - Ollama corre en el contenedor aislado `opengravity-ollama` mapeando el repositorio físico de modelos: `/home/administrador/ollama-data` -> `/root/.ollama`.
  - Compilación Local: Se compila a partir de archivos `.gguf` invocando a Docker internamente (`docker exec ... ollama create [modelo] -f Modelfile.light`).
  - Puerto de Inferencia: Se comunica internamente a la red del agente vía `http://ollama:11434` o al host en el fallback port `11435`.
- **Control Bot CLI:** El bot de Telegram actúa encapsulado dentro del contenedor `opengravity-agente`. Cuando se le ordena un `/cmd`, este ejecuta nativamente sh en Alpine, protegiendo al host subyacente.

---

## 🔄 Protocolos Operativos (The Loops)

### 1. Karpathy Loop (Sovereign Forensic Mode)
Auto-mejora del corpus de ingeniería mediante detección y eliminación de impurezas.

### 2. Motor de Dictámenes & DT Lifecycle (Approved)
El motor de Decisiones Técnicas (DT) ha evolucionado a la **v7.0 Michelin**:
- **Batch Masterchef:** Los dictámenes y entregables no se sirven de forma aislada. Se utiliza `node scripts/lfc-cli.js [purify|serve]` para garantizar la consistencia transversal N-1 en toda la biblioteca.
- **Desacuerdos:** Si el usuario no está de acuerdo, puede marcar el `.md` de la DT con una "Nota de Desacuerdo" o instrucción vía chat; el Agente generará una REVISIÓN inmediata.
- **Vercel Blindage:** Las rutas se sirven en `https://lfc-2.vercel.app/`. Se han implementado `rewrites` sistémicos para mapear el Análisis Contractual Forense sin errores 404.
- **Iteración Humana:** Los especialistas de **Ardanuy, EPC y LFC** revisan los `.md` de las DTs, añaden sus notas y el Agente itera sobre estas notas para mejorar el diseño final.

---

### 3. SICC Dreamer (Autonomía Nocturna & El Sueño Brillante)
- **Ciclo Cron:** Ventana de **8:00 PM - 7:00 AM (COL)**.
- **Sueño Brillante:** Si un bloqueante prioritario no tiene respuesta, el Dreamer está facultado para usar **Investigación Autónoma** para proponer soluciones.

---

## 🛡️ Capacidades de Soberanía v7.0 (Implemented)

### 1. SICC Masterchef CLI (Batch Purifier)
Motor central de purga y servido que aplica el DNA técnico (lfc-terminology.js) en bloque.

### 2. Sinapsis Neural Sync
Los 5 Pilares del Cerebro (Soul, Identity, DNA, Memory, Architecture) están sincronizados mediante el archivo `SYNOPSIS.md`.

---
v1.0.2 Michelin Edition - 09/04/2026
