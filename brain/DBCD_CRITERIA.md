# DBCD — BASES Y CRITERIOS DE DISEÑO ( LFC)

Este documento es la **Fuente Única de Verdad** para la ingeniería del proyecto  LFC (La Dorada - Chiriguaná). Cualquier propuesta de mejora o revisión debe alinearse con estos parámetros para proteger el CAPEX y cumplir el contrato.

## 1. Arquitectura Core: PTC VIRTUAL (Saneado)
- **Estándar:** FRA 49 CFR Part 236 Subpart I / AREMA (Soberanía Tecnológica).
- **Filosofía:** Sistema 100% VIRTUAL. Eliminación radical de señales físicas wayside, eurobalizas, GSM-R y circuitos de vía continuos.
- **Posicionamiento:** GNSS de Alta Precisión (Fusión de sensores) + Edometría (Moving Block).
- **Enclavamientos (ENCE):** ÚNICAMENTE 5 según AT1 Tabla 17, operando bajo lógica de V-Block (Bloque Virtual).
- **Redundancia:** Lógica y failover automático en Servidores Vitales 2oo3 (COTS hardware).

## 2. Jerarquía Normativa (Soberanía)
- **REGLA DE PRELACIÓN ABSOLUTA (Sec 1.2(d)):** El *Nivel 2 (AT1 - Arquitectura PTC Virtual / Moving Block)* prevalece absolutamente sobre el *Nivel 11 (AT10 - Procedimientos de Simulación)*. La tecnología manda sobre el modelo, nunca al revés. No se solicita permiso a ANI (Sec 9.11), sino que se instruye cumplimiento de jerarquía.
  - *Sustento:* Véase `KNOWLEDGE_AT10_CAPACIDAD.md`.
1. Contrato APP 001-2025 y Apéndices (AT1, AT3, AT4).
2. FRA 49 CFR Part 236 Subpart I (Positive Train Control).
3. AREMA Manual (Communications & Signaling).
4. IEEE 1474.1 (CBTC/PTC Functional Requirements).
5. EN 50126/128/129 (SIL) - Solo como estándar de seguridad funcional.

## 3. Optimización de CAPEX (Reglas de Verificación)
- **Cero Infraestructura Europa:** Rechazo activo de Eurobalizas (LEU), RBC (propietario) y GSM-R.
- **Backbone FO:** Red de misión crítica para el protocolo **Vital IP**.
- **Detección de Trenes:** Basada en reporte OBC (On-Board Computer). No usar circuitos de vía (excepto PaN críticos).
- **Interoperabilidad Nacional (FENOCO):**
    - [ ] **DBCD-C3: Interfaz Estrictamente Operacional (Stop & Switch)**
        - La interoperabilidad se garantiza a nivel de Material Rodante (Tren), NO a nivel de Centro de Control (CTC).
        - Prohibido el uso de licencias propietarias ITCS de terceros bajo presupuesto de CAPEX original.
        - Todo **Gateway lógico** o integración de software con FENOCO se define como **Obra y Equipo Complementario (Sección 25.4)**: requiere adición contractual previa y pago del 100% por la ANI.
    - [ ] **DBCD-C4: Excelencia Visual y UX Soberana**
        - Obligatoriedad de seguir el [UX_DESIGN_SYSTEM.md](file:///home/administrador/docker/agente/brain/UX_DESIGN_SYSTEM.md).
        - Uso de Paleta HSL Steel Blue, Glassmorphism y Micro-animaciones.
        - El Agente DEBE auditar el HTML generado antes de servirlo.
    - Prohibido el uso de licencias propietarias ITCS de terceros.

## 4. Niveles de Seguridad (SIL)
- **SIL-4:** PTC Embarcado, Servidor PTC Central, 5 ENCE.
- **SIL-3:** Pasos a Nivel Automáticos.
- **SIL-2:** Comunicaciones, CTC/HMI.

## 5. Metodología de Carga por Fases
- Habilitación de comunicaciones satelitales como solución transitoria (Habilitación AT1) para activación temprana de tramos.

## 6. Geografía Soberana (Ground Truth PKs)
El sistema de referencia de Kilometraje (PK) es **ABSOLUTO** y empieza en el origen histórico de la red (PK 201+470).
- **Ley de Longitud:** Corredor total = **526 km** oficiales.
- **Ley de Toponimia Operacional:**
  - 1.3.104: **La Dorada-México** (PK 201+470) - Nodo Maestro CCO.
  - 1.3.103: **Puerto Berrío-Grecia** (PK 299+800–332+500).
  - 1.3.102: **Barrancabermeja** (PK 423+400–465+250).
  - 1.3.101: **García Cadena** (PK Pendiente validación Ardanuy).
  - 1.3.100: **Zapatosa** (PK Pendiente validación Ardanuy).
- **Ley de Interfaz FENOCO:** Exclusivamente en **Chiriguaná (PK 526 / PK Absoluto 722+683)**.


## 7. Protocolo de Ejecución SIT (Simulation of Impact)
- **SIT-RULE-01**: Antes de modificar códigos WBS o estructuras en `LFC2`, ejecutar `sit-simulator.js`.
- **SIT-RULE-02**: Saneamiento Recursivo: Proponer cambios atómicos que incluyan todas las dependencias detectadas.

## 8. Motor de Aprendizaje y Evolución
- **LEARN-RULE-01**: Tras cada fix exitoso de error estructural, evaluar y destilar el patrón en este documento.
- **LEARN-RULE-02**: Las preferencias de flujo/estilo del usuario se integran como "DNA Preferences".

---
*Versión: 1.2.0 | Evolución Híbrida (Original + SIT/Memory)*
