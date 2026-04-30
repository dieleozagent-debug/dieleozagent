---
CÓDIGO: LFC-U2-CTSC-ED-GEN-PN-0006
VERSIÓN: 1.0
FECHA: 2026-04-30
ESTADO: LÍNEA BASE CERTIFICADA
PROYECTO: LA DORADA – CHIRIGUANÁ (LFC2)
---

CONSORCIO CONSTRUCTOR LÍNEA FÉRREA CENTRAL (LFC)
Dirección Técnica - Unidad Funcional 2

Asunto: LÍNEA BASE TÉCNICA Y CONTRACTUAL – DT-CCO-2026-006 – Arquitectura del CCO, Nodos ENCE, Vía General y Compatibilidad de Flota.

1. Definición de Arquitectura (Decisiones Técnicas Obligatorias)
Para la consolidación del Documento de Bases y Criterios de Diseño (DBCD) del Sistema de Señalización, Control de Tráfico y Comunicaciones, se establece la siguiente configuración técnica innegociable:

- Arquitectura Redundante del CCO (2oo3): El diseño del Centro de Control de Operaciones (CCO) deberá estructurarse con un Nodo Principal ubicado en La Dorada y, de manera obligatoria, un Nodo Secundario de Respaldo (Failover) en Barrancabermeja con replicación geográfica simétrica. Los servidores del núcleo PTC operarán bajo una arquitectura de alta disponibilidad 2-out-of-3 (2oo3) con nivel SIL-4, evitando cualquier punto único de falla (Single Point of Failure).
- Centralización de Lógica Vital (ENCE) y Vía General (Wayside Cero): La lógica vital y la instalación física de Enclavamientos Electrónicos (ENCE) se diseñará única y exclusivamente para las cinco (5) zonas operativas definidas contractualmente: Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío–Grecia y La Dorada–México. Queda prohibida la inclusión de ENCE fuera de este listado. El resto del corredor operará bajo arquitectura PTC con cantonamiento virtual, resolviendo los apartaderos obligatoriamente mediante cambiavías autotalonables con comprobación de posición, quedando prohibida la instalación de micro-enclavamientos o controladores de objetos distribuidos en la vía general.
- Compatibilidad de Flota e Interoperabilidad Operacional: El sistema de gestión del CTC deberá diseñarse para interactuar con la arquitectura a bordo instalada de forma exclusiva en el Material Rodante Tractivo sujeto a Puesta a Punto (locomotoras GR12, U10 y la U18 o equivalente por Factor de Calidad). La interoperabilidad con el tramo norte se garantizará de manera exclusivamente operacional mediante el procedimiento Stop & Switch en Chiriguaná (con equipamiento dual a bordo), quedando terminantemente prohibida la integración lógica, automática o el desarrollo de pasarelas de software (Gateways) hacia los servidores de FENOCO S.A.

2. Fundamento Contractual y Normativo
Esta línea base asegura el cumplimiento del alcance exigido y protege la viabilidad del Proyecto:

- El Apéndice Técnico 1 (AT1), Capítulo IV y su Tabla 17, circunscriben la obligación de inversión en Enclavamientos Electrónicos (ENCE) taxativamente a las cinco estaciones mencionadas, y habilitan expresamente la aplicación de desvíos libres o con dispositivo de autotalonamiento para la vía general.
- El Apéndice Técnico 1 (AT1), Capítulo V, delimita la obligación de "Puesta a Punto" estrictamente al material rodante tractivo listado, sin obligación de instrumentalizar equipos remolcados o no autorizados.
- En estricto cumplimiento del Artículo 5 de la Resolución de Surcos (Resolución 20243040046045), incorporada al Contrato (Sección 2.209), la interoperabilidad se evalúa exclusivamente sobre los dispositivos instalados a bordo. Asimismo, la norma FRA 49 CFR Parte 236 Subparte I exigida en el AT1 (Tabla 17) blinda el uso de un estándar abierto, haciendo técnica y contractualmente improcedente la integración de Gateways hacia protocolos cerrados de terceros.

3. Cierre Operativo
Esta instrucción constituye el límite máximo del alcance técnico y de inversión (CAPEX). Cualquier exigencia por parte de la Interventoría o la ANI tendiente a proveer lógica de enclavamiento físico o motorización de cambiavías fuera de las cinco (5) zonas ENCE, desarrollar Gateways hacia sistemas de terceros, o instrumentalizar flotas distintas a las referenciadas en el AT1 Cap. V, configurará automáticamente una Modificación de Especificaciones Técnicas (Sección 9.12). Dicho requerimiento deberá tramitarse como una Obra y Equipo Complementario (Sección 25.4), obligando al Concedente (ANI) a suscribir una adición contractual y asumir previamente el 100% de los mayores costos derivados.
