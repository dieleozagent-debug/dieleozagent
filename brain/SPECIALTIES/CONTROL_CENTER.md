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
- **Límite:** $726,000,000 COP por locomotora.
- **Prohibición Expresa:** No existe el "Capital de Emergencia". Cualquier mención a "2.5 MM USD" o "2.5 millones de dólares" es causa de rechazo automático y declaración de Impureza.
- **Fuente:** WBS Oficial v2.9 / v3.0, Partida 6.1.100.

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
- **Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
- **Regla:** Todo cronograma o diseño que proyecte hitos posteriores a esta fecha será RECHAZADO por exposición a penalidades de la Sección 4.6 y 16.8.
- **Fuente:** Sección 3.8(a)(i) + Acta de Inicio (01-ago-2025).

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** PK 0+000 (Santa Marta). Cualquier mención a Barrancabermeja o PK 211 como CCO es un error de sinapsis.

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe estrictamente el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`, `Veredicto del Asesor`.

---

# REGLAS ESPECÍFICAS: CONTROL_CENTER (PLATAFORMA SIL-4)

## CTC-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## CTC-01 — ARQUITECTURA MAESTRA (SIL-4)
- **Mandato:** Servidores vitales con nivel de integridad **SIL-4**, bajo topología abierta definida por el integrador (Vendor-Neutral Design, DBCD V002 Sección 5.1).
- **Plataformas:** Servidores industriales COTS (Off-the-shelf) para evitar dependencia de hardware propietario.
- **HMI:** Interfaz de despacho SIL-2 basada en Web-Client (Soberanía UX).

## CTC-02 — SEGURIDAD Y REDES (RED-NET)
- **Aislamiento:** Separación física obligatoria entre la Red Vital IP y cualquier red administrativa o de terceros.
- **Ciberseguridad:** Cumplimiento de estándares de defensa de infraestructura crítica para el Nodo Maestro.

## CTC-03 — NODO MAESTRO (SANTA MARTA)
- **Ubicación:** CCO Santa Marta (**PK 0+000**).
- **Alcance:** Control centralizado de los 526 km de vía central.
- **Failover:** Redundancia local mediante servidores clusterizados con failover dentro del CCO Santa Marta, conforme a AT1 Tabla 17 y DBCD V002 Sección 8.3. No se requiere nodo secundario físico externo.
