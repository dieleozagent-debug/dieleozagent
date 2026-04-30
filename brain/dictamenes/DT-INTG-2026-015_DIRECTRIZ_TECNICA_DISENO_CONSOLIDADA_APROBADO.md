CONSORCIO CONSTRUCTOR LÍNEA FÉRREA CENTRAL (LFC)
Dirección Técnica - Unidad Funcional 2

Asunto: LÍNEA BASE TÉCNICA Y CONTRACTUAL MAESTRA – Consolidación de Arquitectura de Señalización, Control (PTC) y Comunicaciones.

1. Definición de Arquitectura (Decisiones Técnicas Obligatorias)
Para la consolidación final del Documento de Bases y Criterios de Diseño (DBCD), se establece la siguiente configuración técnica innegociable, orientada a la protección del CAPEX y el estricto cumplimiento del alcance:

a) Sistema de Control de Trenes (PTC Virtual y Wayside):
- La arquitectura central se diseñará bajo la norma rectora FRA 49 CFR Parte 236, Subparte I, operando bajo el esquema de cantonamiento virtual para la vía general.
- El despliegue de hardware en campo, la detección física de trenes, las señales luminosas laterales y los Enclavamientos Electrónicos (ENCE) nivel SIL-4 se limitarán, de manera taxativa, a las cinco (5) estaciones operativas exigidas: Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío-Grecia y La Dorada-México.
- Para el resto del corredor, la infraestructura se diseñará exclusivamente con cambiavías autotalonables con comprobación de posición reportando al sistema PTC, quedando expresamente prohibida la instalación de lógica vital distribuida (micro-enclavamientos, contadores de ejes o Eurobalizas) en la vía general.

b) Equipamiento Embarcado e Interoperabilidad (Stop & Switch):
- El hardware a bordo se dimensionará exclusivamente para el Material Rodante Tractivo autorizado: Locomotoras GR12 y U10 (Nación) y la locomotora U18 o equivalente (Factor de Calidad), quedando prohibida la instrumentalización de material remolcado.
- Para garantizar la interoperabilidad con la red norte, el equipamiento a bordo integrará obligatoriamente un Computador PTC (Hardware Dual: OBC LFC + OBC FENOCO), una Interfaz del Maquinista unificada (DMI SIL-2), radios duales y un Dispositivo de Fin de Tren (EOT).
- La interoperabilidad en frontera (Chiriguaná) se ejecutará exclusivamente mediante el procedimiento operacional Stop & Switch, quedando terminantemente prohibido el desarrollo de pasarelas de software (Gateways lógicos) hacia los servidores de FENOCO S.A.

c) Infraestructura de Telecomunicaciones:
- Red Troncal: Fibra óptica lineal enterrada monomodo (ITU-T G.652.D) de exactamente cuarenta y ocho (48) hilos, soportada operativamente por red de radio TETRA (cuyas torres serán de uso exclusivo TETRA).
- Red de Redundancia: Arquitectura Híbrida Embarcada (Satelital LEO/GEO + celular GSM/LTE vía ruteo SD-WAN), respaldada bajo el estándar de seguridad EN 50159 Categoría 3 para redes abiertas.

d) Centro de Control y Despliegue Operativo:
- Redundancia Central: Implementación del Centro de Control de Operaciones (CCO) principal en La Dorada (PK 201+470), con un Nodo Secundario de Respaldo (Failover) en Barrancabermeja (arquitectura 2-out-of-3 / 2oo3).
- Despliegue Progresivo: El despliegue modular habilitará la activación operativa temprana (Fase Transitoria), sin que la sectorización por Unidades Funcional de Vía Férrea (UFVF) genere obligaciones de entregas operativas parciales definitivas ante la Interventoría.

e) Pasos a Nivel (PaN):
- Cantidades cerradas e inmodificables: Nueve (9) Tipo C automáticos, quince (15) Tipo B manuales y ciento veintidós (122) Tipo A pasivos.
- Los PaN activos contarán con controladores locales autónomos (Fail-Safe), limitando la interacción con el CCO exclusivamente a supervisión y monitoreo, sin permitir el accionamiento remoto.

2. Fundamento Contractual y Normativo
- Cumplimiento Legal y Reglamentario (Sección 2.209): La Resolución 20243040046045 (Resolución de Surcos), vinculante para el Proyecto, define taxativamente en su Artículo 5 que la "Compatibilidad Exitosa" se evalúa exclusivamente sobre los dispositivos a bordo del Material Rodante, sin imponer en ningún escenario la integración informática de Centros de Control (CTC) de distintos concesionarios.
- Jerarquía Normativa y Regla PTC: El Apéndice Técnico 1 (AT1) prevalece sobre el AT3. Por consiguiente, la norma FRA 49 CFR Parte 236 Subparte I, exigida en la Tabla 17, es el estándar rector obligatorio, el cual opera bajo protocolos abiertos interoperables, haciendo contractualmente inviable la sujeción a protocolos propietarios cerrados de terceros.

3. Cierre Operativo
Esta instrucción constituye el límite máximo del alcance técnico de la Unidad Funcional 2. Toda desviación exigida por la Interventoría o la ANI tendiente a imponer enclavamientos adicionales, motorización de desvíos en vía general, integración de software mediante Gateways hacia FENOCO, o la instrumentalización de flotas no autorizadas, configurará una Incompatibilidad Técnica y una Modificación de Especificaciones (Sección 9.12). Dicho requerimiento deberá tramitarse de manera inmediata como una Obra y Equipo Complementario (Sección 25.4), obligando al Concedente (ANI) a suscribir una adición contractual y asumir previamente el 100% de los sobrecostos tecnológicos y civiles derivados.
