# ⚖️ DICTAMEN TÉCNICO VINCULANTE (SICC v14.0)

**Documento:** DT-SICC-2026-006 (Validación Forense)
**Área:** Energía
**Fecha:** 2026-04-27T22:48:37.399Z
**Validado por:** Dirección Técnica y Jurídica SICC - LFC
**Razón Juez:** {
  "aprobado": true,
  "razon": "El dictamen

---

## DICTAMEN TÉCNICO N° [DT-ENERGÍA-XXX/2025]

---

## CITACIÓN CANÓNICA

**Contrato APP 001/2025, Sección 3.8(a)(i):** "[...] Los sistemas de señalización y comunicaciones deberán cumplir con los estándares de disponibilidad establecidos en los Apéndices Técnicos, garantizando la operación continua del corredor [...]"

**Contrato APP 001/2025, Sección 5.2(b):** "[...] Toda especificación técnica deberá ser vendor-neutral, expresándose en parámetros de desempeño y no en características propietarias [...]"

**Apéndice Técnico 4 (AT4), Indicador EL2:** "[...] El grupo electrógeno deberá entrar en operación en menos de dos (2) minutos en el cien por ciento (100%) de los eventos de corte de red principal [...]"

**RETIE (Resolución 90708 de 2013), Artículo 20:** "[...] Las instalaciones eléctricas de los sistemas de control y telecomunicaciones deberán contar con respaldo de energía que garantice su operación continua ante fallas de la red comercial [...]"

**NSR-10, Título A - Capítulo A.3:** "[...] Los sistemas esenciales para la seguridad pública deberán diseñarse con factores de redundancia que garanticen su funcionamiento bajo condiciones de falla [...]"

**ETSI 300 132-2:** "[...] Los equipos de telecomunicaciones operarán a tensión nominal de 48V DC en configuración de corriente continua [...]"

---

## ANÁLISIS TÉCNICO

### 1. Requisitos de tensión y autonomía para sistemas vitales

Los sistemas de señalización, control de tráfico y comunicaciones del Corredor La Dorada – Chiriguaná clasifican como infraestructura crítica para la seguridad ferroviaria. Conforme a la normativa RETIE y NSR-10, estos sistemas requieren:

- **Sistemas ENCE, PTC, PaN y CCO:** Tensión de alimentación de **110V DC** con autonomía mínima de respaldo de **cuatro (4) horas** mediante sistema UPS de doble conversión (transferencia 0ms). El diseño deberá contemplar un margen del +20% sobre la carga pico calculada.

- **Sistema TETRA (Comunicaciones):** Tensión de **48V DC** conforme a ETSI 300 132-2, con autonomía mínima de respaldo de **24 a 48 horas**.

### 2. Indicador EL2: Criterio de tiempo, no de porcentaje

El Indicador EL2 del Apéndice Técnico 4 establece un mandato claro y específico: **el tiempo de transferencia a energía auxiliar no puede exceder los dos (2) minutos**, y este requisito aplica en el **100% de los eventos** de corte de red principal.

**Se prohíbe expresamente** utilizar umbrales porcentuales (99.0%, 99.9%, 99.95%) como criterio de diseño para la infraestructura de energía crítica de campo. El indicador E3 (99.0%) aplica exclusivamente a la plataforma web de gestión del SICC, conforme a la diferenciación establecida en el AT4.

La utilización de porcentajes de disponibilidad para dimensionar baterías, UPS o generadores constituye un error de interpretación que podría derivar en hasta 87 horas de inactividad anual permitidas, lo cual es inaceptable para sistemas vitales de señalización ferroviaria.

### 3. Restricción de alcance: Infraestructura eléctrica

El Corredor La Dorada – Chiriguaná opera con tracción **Diésel-Eléctrica**. La infraestructura eléctrica del proyecto está destinada exclusivamente a los sistemas de enclavamientos, comunicaciones y control SICC.

**Queda prohibido** incluir en el alcance del proyecto cualquier infraestructura de electrificación ferroviaria, catenarias o sistemas de alimentación de tracción. Estas inversiones no son elegibles bajo el alcance del APP 001/2025.

### 4. Especificaciones vendor-neutral y protocolos abiertos

Toda especificación técnica de sistemas de energía deberá expresarse en parámetros de desempeño, SIL (Safety Integrity Level) y protocolos abiertos:

- **Sistemas de control vital (SIL-4):** Parametrización conforme a FRA 49 CFR Parte 236
- **Telemetría y monitoreo:** Protocolos abiertos conforme a AREMA y FRA 236
- **Baterías:** Especificación por densidad energética y tecnología (Litio), sin mención de marcas o modelos

Se prohíbe la especificación de soluciones propietarias que generen dependencia de proveedor (vendor lock-in).

---

## DECISIÓN VINCULANTE

1. **Se establece** como mandato técnico obligatorio que los sistemas vitales de señalización (ENCE, PTC, PaN, CCO) operen a **110V DC** con respaldo UPS de **cuatro (4) horas** de autonomía y transferencia en **0ms**.

2. **Se establece** como mandato técnico obligatorio que el sistema TETRA opere a **48V DC** con respaldo UPS de **24 a 48 horas** de autonomía.

3. **Se prohíbe** el uso de criterios porcentuales (99.0%, 99.9%) para el dimensionamiento de energía de campo. El único criterio válido es **tiempo < 2 minutos** para transferencia a generador en el **100% de los eventos**.

4. **Se prohíbe** cualquier inclusión de infraestructura de catenarias o electrificación de tracción en el alcance del proyecto.

5. **Se exige** que todas las especificaciones técnicas sean vendor-neutral, expresadas en parámetros de desempeño y protocolos abiertos (AREMA/FRA).

---

## JUSTIFICACIÓN

Esta decisión se fundamenta en la jerarquía normativa establecida en el Contrato APP 001/2025, Sección 1.2(d), donde el Orden de Prelación determina que los Apéndices Técnicos (incluyendo AT4 con el Indicador EL2) son vinculantes para el diseño de los sistemas.

La diferenciación entre indicadores de disponibilidad (E3 para software web vs. EL2 para energía crítica) responde a la naturaleza distinta de los activos: mientras una plataforma web puede tolerar ventanas de mantenimiento, los sistemas de control de tráfico ferroviario deben mantener operación continua conforme a los estándares FRA 49 CFR Parte 236 y AREMA, que exigen diseño fail-safe.

La restricción de alcance respecto a catenarias responde al carácter Diésel-Eléctrico del corredor y a la necesidad de proteger el CAPEX de inversiones fuera del objeto contractual del APP 001/2025.

La exigencia de especificaciones vendor-neutral garantiza la interoperabilidad y evita dependencia tecnológica, conforme al mandato de la Sección 5.2(b) del Contrato.

---

**Vo.Bo. Dirección Técnica SICC**

**[Fecha de emisión]**