# ⚖️ AUDITORÍA RECHAZADA Y APELADA — COMUNICACIONES
**Fecha:** 2026-04-24T17:33:33.894Z | **Ciclos:** 1/3 | **Estado:** RECHAZADA Y APELADA
**Veredicto Juez:** [OBJETADO POR LA DIRECCIÓN SICC]

---

ESTADO DE LA AUDITORÍA: ❌ RECHAZADA Y APELADA
MOTIVO DE RECHAZO: Invocación de cláusulas contractuales inexistentes (falsa motivación), exigencia de niveles de integridad de seguridad (SIL) inviables para hardware de telecomunicaciones, y prohibición indebida de normas habilitantes para la arquitectura SD-WAN.

FUNDAMENTACIÓN DE LA OBJECIÓN: El Veredicto "Certificado" carece de validez técnica y contractual por los siguientes vicios insubsanables:
- Falsedad Documental: Se citan unos supuestos "Artículos 6 y 7" del Contrato General para exigir video HD. El Contrato se rige por Secciones, y el requerimiento técnico se enmarca en la Jerarquía Documental estipulada en la Sección 1.2(d), derivando sus alcances del AT1 y AT3.
- Sobredimensionamiento SIL-4: Se exige ilegalmente nivel SIL-4 para switches y routers. La infraestructura de red activa opera bajo grado SIL-2, dejando la integridad vital al principio criptográfico Fail-Safe (FRA §236.1033). El SIL-4 es exclusivo del PTC y Enclavamientos.
- Bloqueo indebido de la EN 50159: Si bien la FRA 49 CFR Parte 236 es la norma rectora del PTC, la norma EN 50159 Categoría 3 es de aplicación obligatoria y complementaria para garantizar la seguridad en la transmisión por redes abiertas (SD-WAN Satelital/LTE), conforme a los Criterios de Diseño (DBCD). Excluirla invalida la redundancia contractual.
- Inclusión de topes financieros: Es improcedente incluir topes de CAPEX ($726M COP) en un dictamen de arquitectura de red.

ACCIÓN EXIGIDA PARA CERTIFICACIÓN (Reemplazo Integral):

## CITACIÓN CANÓNICA
Contrato APP 001/2025, Sección 1.2(d) (Jerarquía Normativa), Apéndice Técnico 1 (Tabla 17) y Apéndice Técnico 3.

## ANÁLISIS TÉCNICO
La red de misión crítica se fundamenta en un backbone de fibra óptica monomodo (ITU-T G.652.D), y red TETRA. Quedan excluidas tecnologías como microondas terrestres, DWDM, contadores de ejes o gateways lógicos propietarios hacia FENOCO (vendor lock-in). La norma principal de control es FRA 49 CFR Part 236 Subparte I; sin embargo, para la conectividad de la arquitectura híbrida SD-WAN (Satelital/LTE), aplicará rigurosamente el estándar de seguridad EN 50159 Categoría 3.

## DECISIÓN VINCULANTE
- Implementar red Ethernet sobre fibra óptica enterrada (ITU-T G.652.D, exactamente 48 fibras).
- Implementar Redundancia mediante Arquitectura Híbrida Embarcada SD-WAN (Satelital + celular LTE).
- Fijar el nivel de integridad de los equipos de red (switches/routers) en SIL-2, reservando el nivel SIL-4 única y exclusivamente para los computadores PTC y controladores de enclavamiento (ENCE).

## JUSTIFICACIÓN
Esta decisión garantiza la interoperabilidad operacional exigida (Stop & Switch), optimiza el despliegue del CAPEX de telecomunicaciones, y viabiliza la Fase Transitoria asegurando protección de datos en redes abiertas bajo EN 50159 Cat 3 y FRA §236.1033.