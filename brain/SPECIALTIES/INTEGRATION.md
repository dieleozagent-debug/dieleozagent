> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025.
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1).
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3).
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: INTEGRATION (INTEROPERABILIDAD) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios de interoperabilidad con la red de FENOCO, centrados en el modelo Stop & Switch (OBC Dual), conforme al Contrato APP 001 de 2025.

### 1.2. Alcance (Conexión Norte)
- **Punto de Conexión**: Chiriguaná (Extremo Norte).
- **Naturaleza**: Interoperabilidad **estrictamente operacional** bajo los términos del Contrato.

---

# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 2.0 | **Aplicación:** Toda la arquitectura SICC Simulator v12.0
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis o contexto de especialidad.

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO
- **Límite:** $726,000,000 COP por locomotora.
- **Prohibición Expresa:** No existe el "Capital de Emergencia". Cualquier mención a "2.5 MM USD" o "2.5 millones de dólares" es causa de rechazo automático y declaración de Impureza.

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
- **Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
- **Regla:** Todo cronograma o diseño que proyecte hitos posteriores a esta fecha será RECHAZADO por exposición a penalidades.

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** PK 0+000 (Santa Marta).

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`.

---
# REGLAS ESPECÍFICAS: INTEGRATION (INTERCONEXIÓN SICC)

## INT-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## INT-01 — MATRIZ DE INTERFACES Y PROTOCOLOS VITALES
- **Mandato:** Todas las interfaces entre subsistemas (PTC, CTC, Comms, Power) deben seguir el **Vendor-Neutral Design (DBCD V002 Sección 5.1)**, especificando funcionalidades sin marcas propietarias.
- **Seguridad Vital:** El transporte de señales vitales debe implementar el **Numerical assurance concept (49 CFR Parte 236 Subparte H/I)** y protección criptográfica bajo **EN 50159 Categoría 3** para la transmisión en medios abiertos (Red Vital IP / SD-WAN).
- **Protocolo No-Vital:** Se autoriza el uso de REST API únicamente para aplicaciones de gestión e información no crítica.

## INT-02 — SOBERANÍA DEL ALCANCE (BLOQUEO DE GATEWAY)
- **Prohibición:** Queda estrictamente excluida cualquier integración lógica, automática o vital entre el sistema SICC del corredor y sistemas externos (ITCS de FENOCO).
- **Mandato:** La interoperabilidad con FENOCO es puramente **operativa (Nivel 1 — Sección 2.209)**, lograda mediante el uso de hardware dual embarcado (Stop & Switch). No se financiarán pasarelas de software o "Gateways" no contemplados en el alcance.

## INT-03 — PRUEBAS DE VALIDACIÓN (FAT/SAT)
- **Mandato:** La validación de software y subsistemas debe regirse por la norma **EN 50128** para asegurar la trazabilidad SIL en funciones críticas.
- **HIL:** Las pruebas de laboratorio (FAT) deben usar simulación Hardware-in-the-loop para validar el comportamiento funcional de los **Enclavamientos Electrónicos SIL-4**, rechazando cualquier dependencia de hardware propietario previo al despliegue.
- **Criterio:** No se aceptan pruebas "en vivo" sobre el corredor central sin certificación previa de laboratorio.
