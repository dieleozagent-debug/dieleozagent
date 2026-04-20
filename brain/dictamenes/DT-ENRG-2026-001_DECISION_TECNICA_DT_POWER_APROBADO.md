# ⚖️ DICTAMEN TÉCNICO VINCULANTE (CORREGIDO Y SANEADO)

**Documento:** DT-ENRG-2026-001 (Versión Definitiva Purgada)  
**Área:** Power - Respaldo Crítico (EL2) y Telecomunicaciones (COM1)  
**Validado por:** Dirección Técnica y Jurídica SICC - LFC  
**Razón Juez:** El dictamen previo fue RECHAZADO por violar la regla de desempate y jerarquía normativa (R-HARD-06) e interpretar erróneamente el régimen de deducciones del Apéndice Técnico 4.

---

### DECISIÓN TÉCNICA (DT) - POWER - RESPALDO CRÍTICO (EL2) PARA LA FLOTA LFC

**CITACIÓN CANÓNICA:**  
[Contrato de Concesión APP 001/2025] → [Apéndice Técnico 4 - Indicadores] → [Indicadores EL2 y E3] / [Apéndice Técnico 1] → [Capítulo V, Tabla 17].

**ANÁLISIS:**  
El diseño de la infraestructura de energía y respaldo del sistema de control de trenes no puede regirse por el indicador de disponibilidad del 99.0%, toda vez que dicho umbral (Indicador E3) aplica de manera restrictiva al funcionamiento de la plataforma de software (SICC). La infraestructura dura y de campo debe ceñirse a los tiempos de respuesta críticos exigidos por el AT4 y al principio "Fail-Safe" de la FRA 49 CFR Parte 236.

**DECISIÓN:**  
Tras la purga contractual, se determina que el sistema de Power - Respaldo Crítico y el equipamiento a bordo deberán ser diseñados bajo los siguientes parámetros innegociables:

1. **Parámetro de Respaldo EL2:** Queda terminantemente prohibido dimensionar bancos de baterías, UPS o plantas bajo un umbral genérico del 99.0%. Para dar cumplimiento al indicador EL2 del AT4, el sistema de conmutación debe asegurar la entrada de la energía auxiliar del grupo electrógeno en un tiempo máximo de dos (2) minutos en el 100% de los eventos de falla de red principal, soportado transitoriamente por UPS de doble conversión.
2. **Infraestructura Wayside Zero:** Se maximizará la dependencia de la Red Vital IP y equipos a bordo (GPS/GNSS + Odometría) para la autorización de movimiento (PTC Virtual), limitando los elementos físicos en vía abierta para optimizar el CAPEX.
3. **Interoperabilidad Stop & Switch:** Se prohíbe el desarrollo de pasarelas lógicas (Gateways) o la pretensión de que el equipo LFC interprete la red adyacente. La interoperabilidad operacional en Chiriguaná se resolverá mediante la instalación de hardware dual a bordo (OBC LFC + OBC FENOCO), ejecutando una parada técnica y conmutación de sistemas.

**METADATA CONTRACTUAL PURA:**  
Este documento se subordina exclusivamente a la jerarquía del Contrato de Concesión y sus Apéndices Técnicos (Niveles 1 al 10), descartando cualquier validación proveniente de plataformas RAG o foros externos.

**CONCLUSIÓN:**  
Con la presente corrección, el área de Power - Respaldo Crítico (EL2) queda blindada contra las deducciones por desempeño del AT4, y la arquitectura de a bordo se ajusta a la legalidad de la Resolución de Surcos (Art. 5) sin incurrir en sobrecostos de integración de software propietario.
