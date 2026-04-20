> [!IMPORTANT] **JERARQUÍA DOCUMENTAL ESTRICTA (ORDEN DE PRELACIÓN - CAP I, SEC 1.2d):**
> 1. **NIVEL 1:** Contrato APP 001/2025 (Ley Máxima).
> 2. **NIVEL 2:** AT1 (Alcance Técnico Absoluto - Manda FRA 236 para PTC).
> 3. **NIVEL 3-11:** AT2 al AT10 (Orden numérico. AT3: AREMA > FRA > AAR > UIC).
> 4. **REGLA DE DESEMPATE (SEC 9.11):** En caso de duda, prevalece la **MAYOR CALIDAD, MAYOR SERVICIO Y MAYOR SEGURIDAD**.
> 5. **REGLA DE ORO:** Las respuestas a Q&A (Nivel 16) NO modifican obligaciones de niveles 1-10.

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

