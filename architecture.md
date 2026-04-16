# 🏛️ Arquitectura Soberana — OpenGravity SICC v12.2 " Paz Estructural\

> **Fecha:** 16-Abr-2026 | **Estado:** Zero-Residue Certificado

## 🌌 Visión General
**OpenGravity** opera como un **Nodo Único Soberano**: un solo contenedor Docker con lógica de resiliencia interna. Su modo operativo principal se basa en el **Ecosistema de Aprendizaje Karpathy**, apoyado por conectores SAPI (Service APIs) totalmente separados del flujo lógico de toma de decisiones.

---

## 🏗️ Pilares del Diseño (v12.2)
1. **Separación de SAPI (Conectores):** Los métodos de llamada a herramientas externas (Supabase, MCP NotebookLM, Ollama) están aislados. Se incrustan en el flujo de decisión solo cuando el agente lo demanda.
2. **Ciclo de Aprendizaje Karpathy:** El agente no solo responde pedidos; cuando comete un error (alucinación) detectado por Validación, ajusta permanentemente sus reglas internas en \rain/SPECIALTIES/\.
3. **Soberanía de Construcción & Resiliencia Interna:** Construcción de imágenes estériles, orquestación limpia y backoff exponencial (15s → 30s) frente a errores 429.

---

## 🔄 El Motor Karpathy: Enjambre y SAPI (Service APIs)

El ciclo vital del agente ya no permite que el Enjambre (Swarm) suba directamente borradores. Operamos con una **Cámara de Validación de Doble Ciego** donde NotebookLM se usa estrictamente como validación final (Última Opción) para refinar los Cerberos de Especialidad.

\\\mermaid
graph TD
 A[Problema Inicial / Nuevo Reto] --> B(Enjambre: Auditor + Estratega)
 B -->|Genera Borrador / Hipótesis| C[Validación de Verdad Interna]
 
 subgraph SAPIs Separadas
 S1[SAPI: Supabase / LFC2]
 S2[SAPI: NotebookLM MCP]
 end

 C -->|Consulta| S1
 S1 -->|Rechazo Contractual| E[Ajuste de Error - Karpathy]
 S1 -->|Aprobado Interno| D[Validación de Verdad Externa / Última Opción]
 
 D -->|Consulta| S2
 S2 -->|Alucinación Tecnológica| E
 
 E -->|Actualiza Reglas| H[brain/SPECIALTIES/*.md]
 H -->|Re-evalúa| B
 
 S2 -->|Aprobado Global| G[Certificación y Commit a LFC2]
\\\

### 1. El Rol de las SAPIs
Las interfaces de conexión ahora existen por separado. El motor Karpathy evalúa y decide a qué SAPI llamar:
- **SAPI Interna (Supabase):** Verifica que la sugerencia del enjambre no viole las reglas técnicas del contrato.
- **SAPI Externa (NotebookLM MCP):** Actúa como oráculo final. Si el enjambre propone un estándar tecnológico, este SAPI verifica la viabilidad real en la industria actual (ej.GSM-R vs LTE-R) accediendo a la libreta maestro.

### 2. Actualización Autónoma de Especialidades (Karpathy Loop)
Cuando la Cámara de Validación rechaza una Decisión Técnica (DT) por alucinación o discordancia de la realidad, el Agente realiza introspección. Toma la lección y actualiza mecánicamente la categoría correspondiente en su memoria local:
- \COMMUNICATIONS.md\
- \CONTROL_CENTER.md\
- \POWER.md\
- \SIGNALIZATION.md\
- \ENCE.md\, \INTEGRATION.md\

De esta forma, la base de datos de Especialidades es un sistema orgánico y evolutivo; los errores del enjambre enriquecen la soberanía técnica del Cerebro para que no se cometan en el siguiente ciclo.

---
v12.2 \Paz Estructural\ — 16/04/2026 (Karpathy Loop Activo + SAPI NotebookLM)
