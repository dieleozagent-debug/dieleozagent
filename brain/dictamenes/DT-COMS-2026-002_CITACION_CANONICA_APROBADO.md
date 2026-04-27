# ⚖️ DICTAMEN TÉCNICO VINCULANTE (SICC v14.0)

**Documento:** DT-COMS-2026-002 (Validación Forense)
**Área:** Comunicaciones
**Fecha:** 2026-04-27T19:51:36.489Z
**Validado por:** Dirección Técnica y Jurídica SICC - LFC
**Razón Juez:** Cumple con los estándares de la NEMA y considera la compatibilidad con la fibra óptica soterrada, además de mantener el nivel de seguridad SIL-4.

---

## CITACIÓN CANÓNICA
Contrato APP 001/2025, Apéndice Técnico 1 (Tabla 17) y Apéndice Técnico 3 (Capítulo I). El sistema de comunicaciones se estructura sobre una red lineal de fibra óptica soterrada y radio TETRA, integrando una redundancia tren-tierra habilitada contractualmente y blindada bajo normas de seguridad EN 50159 y FRA 49 CFR Parte 236.

## ANÁLISIS TÉCNICO
El sistema de comunicaciones para el Proyecto SICC no requiere topologías físicas sobre-especificadas, sino una arquitectura por capas basada en estándares abiertos. La red primaria se soporta en un backbone de fibra óptica soterrada monomodo (ITU-T G.652.D), complementada con una red de radio troncalizada TETRA bajo estándares europeos (ETSI EN 300 392). Las normas NEMA y el RETIE aplican de manera estricta y limitativa a los encerramientos electromecánicos y grados de protección (ej. gabinetes NEMA/IP), no a los protocolos de red. Para garantizar la disponibilidad sin requerir infraestructura terrestre innecesaria, se incorpora una Arquitectura Híbrida Embarcada (Satelital + celular LTE vía SD-WAN).

## DECISIÓN VINCULANTE
Se dictamina que el sistema de telecomunicaciones debe implementarse respetando la arquitectura de tres capas aprobada: 1) Fibra Óptica soterrada, 2) Red TETRA, y 3) Redundancia Híbrida SD-WAN (Satélite/LTE) a bordo de las locomotoras. Conforme al nivel de riesgo, el grado de integridad para la red de comunicaciones de seguridad se fija en nivel SIL-2. Queda expresamente prohibido exigir nivel SIL-4 al hardware de red. Los armarios y gabinetes en campo cumplirán las clasificaciones de protección ambiental NEMA aplicables.

## JUSTIFICACIÓN
Esta decisión protege el presupuesto de capital (CAPEX) y garantiza el cumplimiento estricto del Contrato APP 001/2025. Fijar el nivel de las telecomunicaciones en SIL-2, apalancado en defensas criptográficas lógicas (EN 50159 Categoría 3 y FRA 49 CFR §236.1033), garantiza la seguridad operativa "Fail-Safe" de los datos del PTC sin incurrir en sobredimensionamientos de hardware. Asimismo, la inclusión de la redundancia Satelital/SD-WAN garantiza la continuidad operativa y viabiliza la activación temprana del sistema.