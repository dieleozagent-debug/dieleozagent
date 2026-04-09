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
- **Capa de Memoria Contractual (LTM):** **Supabase Vector DB (Soberanía Local recalibrada a 768 dims)**.
- **Ingesta Masiva (Biblia Legal):** OCR Forense y Embeddings locales vía **Ollama (nomic-embed-text)**.
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
El motor de Decisiones Técnicas (DT) es el vehículo de la iteración:
- **Flujo:** Dictamen Jurídico → Propuesta Técnica → **Decision Técnica (DT)**.
- **Desacuerdos:** Si el usuario no está de acuerdo, puede marcar el `.md` de la DT con una "Nota de Desacuerdo" o instrucción vía chat; el Agente generará una REVISIÓN inmediata.
- **Vercel:** Los dictámenes se sirven en `https://lfc-2.vercel.app/DICTAMENES/`.
- **Iteración Humana:** Los especialistas de **Ardanuy, EPC y LFC** revisan los `.md` de las DTs, añaden sus notas y el Agente itera sobre estas notas para mejorar el diseño final.

### 3. SICC Dreamer (Autonomía Nocturna & El Sueño Brillante)
- **Ciclo Cron:** Ventana de **8:00 PM - 7:00 AM (COL)**.
- **Sueño Brillante:** Si un bloqueante prioritario no tiene respuesta, el Dreamer está facultado para usar **Investigación Autónoma** para proponer soluciones.

---

## 🛡️ Capacidades de Soberanía v6.4 (Implemented)

### 1. SICC Harness CLI (Parity Guard)
Evita la regresión de ADN técnico (ej. prohíbe términos legacy).

### 2. Skills Registry Multinivel
Carga dinámica de habilidades por dominio (`skill-contracts`, `skill-telecom`, `web_research`).

---
v1.0.1 - 08/04/2026
