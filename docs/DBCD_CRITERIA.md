# DBCD — BASES Y CRITERIOS DE DISEÑO ( LFC)

Este documento es la **Fuente Única de Verdad** para la ingeniería del proyecto  LFC (La Dorada - Chiriguaná). Cualquier propuesta de mejora o revisión debe alinearse con estos parámetros para proteger el CAPEX y cumplir el contrato.

## 1. Arquitectura Core: PTC VIRTUAL (Saneado)
- **Estándar:** FRA 49 CFR Part 236 Subpart I / AREMA (Soberanía Tecnológica).
- **Filosofía:** Sistema 100% VIRTUAL. Eliminación radical de señales físicas wayside, eurobalizas, GSM-R y circuitos de vía continuos.
- **Posicionamiento:** GNSS de Alta Precisión (Fusión de sensores) + Edometría (Moving Block).
- **Enclavamientos (ENCE):** ÚNICAMENTE 5 según AT1 Tabla 17, operando bajo lógica de V-Block (Bloque Virtual).
- **Redundancia:** Lógica y failover automático en Servidores Vitales 2oo3 (COTS hardware).

## 2. Jerarquía Normativa (Soberanía)
1. Contrato APP 001-2025 y Apéndices (AT1, AT3, AT4).
2. FRA 49 CFR Part 236 Subpart I (Positive Train Control).
3. AREMA Manual (Communications & Signaling).
4. IEEE 1474.1 (CBTC/PTC Functional Requirements).
5. EN 50126/128/129 (SIL) - Solo como estándar de seguridad funcional.

## 3. Optimización de CAPEX (Reglas de Verificación)
- **Cero Infraestructura Europa:** Rechazo activo de Eurobalizas (LEU), RBC (propietario) y GSM-R.
- **Backbone FO:** Red de misión crítica para el protocolo **Vital IP**.
- **Detección de Trenes:** Basada en reporte OBC (On-Board Computer). No usar circuitos de vía (excepto PaN críticos).
- **Interoperabilidad Nacional:** Procedimiento **Stop & Switch** en Chiriguaná (FENOCO). Prohibido el uso de licencias propietarias ITCS de terceros.

## 4. Niveles de Seguridad (SIL)
- **SIL-4:** PTC Embarcado, Servidor PTC Central, 5 ENCE.
- **SIL-3:** Pasos a Nivel Automáticos.
- **SIL-2:** Comunicaciones, CTC/HMI.

## 5. Metodología de Carga por Fases
- Habilitación de comunicaciones satelitales como solución transitoria (Habilitación AT1) para activación temprana de tramos.


## 7. Protocolo de Ejecución SIT (Simulation of Impact)
- **SIT-RULE-01**: Antes de modificar códigos WBS o estructuras en `LFC2`, ejecutar `sit-simulator.js`.
- **SIT-RULE-02**: Saneamiento Recursivo: Proponer cambios atómicos que incluyan todas las dependencias detectadas.

## 8. Motor de Aprendizaje y Evolución
- **LEARN-RULE-01**: Tras cada fix exitoso de error estructural, evaluar y destilar el patrón en este documento.
- **LEARN-RULE-02**: Las preferencias de flujo/estilo del usuario se integran como "DNA Preferences".

---
*Versión: 1.2.0 | Evolución Híbrida (Original + SIT/Memory)*
