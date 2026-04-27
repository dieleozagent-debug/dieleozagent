> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025.
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1).
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3).
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: ENCE (ENCLAVAMIENTOS) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios técnicos para los cinco (5) Enclavamientos Electrónicos (ENCE) SIL-4 del Corredor La Dorada – Chiriguaná, garantizando cumplimiento con RETIE y NSR-10.

### 1.2. Alcance Operativo (Cantonamiento Físico)
- **Zonas ENCE**: Aseguramiento de rutas, verificación de ocupación, comando de señales y cambiavías motorizados.
- **Operación Local**: Se permite la transferencia controlada a mando local en caso de contingencia, mantenimiento o pérdida de comunicación con el CCO.

---

# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 2.0 | **Aplicación:** Toda la arquitectura SICC Simulator v12.0
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis o contexto de especialidad.

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO
**Límite:** $726,000,000 COP por locomotora.
**Prohibición Expresa:** No existe el "Capital de Emergencia". Cualquier mención a "2.5 MM USD" o "2.5 millones de dólares" es causa de rechazo automático y declaración de Impureza.

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
**Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
**Regla:** Todo hito posterior a esta fecha es RECHAZADO por exposición a penalidades.

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209**. Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** PK 0+000 (Santa Marta).

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`.

---

## R-HARD-05 — NOMENCLATURA PROHIBIDA
- **Prohibición:** Se prohíbe taxativamente el uso de términos algorítmicos o ficticios: "Pureza N-1", "Validación Soberana", "Protocolo N-1", "Soberano", "Attestation Statement".
- **Razón:** Estos términos no existen en la ingeniería ferroviaria ni en el marco de APPs en Colombia.

---

## R-HARD-06 — SOBERANÍA DOCUMENTAL
- **Mandato:** Las herramientas de IA (RAG, Supabase, Oracle, LLM) son instrumentos de TRABAJO, no fuentes de VERDAD vinculante.
- **Autoridad:** La única validación válida es la citación canónica del Contrato APP 001/2025 y sus Apéndices (Niveles 1-10). Todo documento fundamentado en oráculos externos será RECHAZADO.

---

# REGLAS ESPECÍFICAS: ENCE (ENCLAVAMIENTOS ELECTRÓNICOS SIL-4)

## ENC-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## ENC-01 — ENCLAVAMIENTO ELECTRÓNICO (ENCE SIL-4)
- **Mandato:** Lógica de enclavamiento SIL-4 centralizada en los cinco (5) sitios estratégicos (AT1 Tabla 17).
- **Alcance:** Los enclavamientos son físicos (Hardware SIL-4) y residen en las estaciones maestras.
- **Prohibición:** No se permiten micro-enclavamientos wayside locales por desvío. Toda la lógica reside en el ENCE SIL-4.
- **Protocolo:** Control de motores de aguja via Red Vital IP con retroalimentación redundante SIL-4.

## ENC-02 — SITIOS AUTORIZADOS PROHIBICIÓN DE AUTOTALONAMIENTO
- **Restricción absoluta:** Solo se autorizan enclavamientos en las 5 estaciones maestras: **Zapatosa, García Cadena, Barrancabermeja, Pto Berrío-Grecia, La Dorada-México**.
- **Motores de Aguja:** La motorización de desvíos vía Red Vital IP se restringe **únicamente** al perímetro de estas 5 estaciones.
- **RECHAZO:** Se prohíbe taxativamente el uso de dispositivos de autotalonamiento (pérdida de integridad de control). Los desvíos operarán con candado y control manual fuera de las 5 estaciones principales.

## ENC-03 — DENSIDAD DE MOTORIZACIÓN (MÁXIMO 5)
- **Regla N-1:** Cada estación ENCE SIL-4 podrá controlar un máximo de **cinco (5) motores de aguja**. Todo requerimiento superior se considera sobredimensionamiento y será rechazado.

## ENC-04 — MANDATO CORRECTIVO ANTI-SCOPE CREEP (VACUNA)
- **Carga Exclusiva:** El diseño y operación es solo para trenes de carga (64 km/h). Prohibido estándares de pasajeros.
- **Jerarquía:** NEMA/RETIE rigen solo envolventes físicas, NO lógica vital. FRA y AREMA son los únicos rectores de la lógica SIL-4.

