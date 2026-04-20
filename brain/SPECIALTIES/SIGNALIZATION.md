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

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
- **Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
- **Regla:** Todo hito posterior a esta fecha será RECHAZADO por exposición a penalidades.

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`.

---

# REGLAS ESPECÍFICAS: SIGNALIZATION (S-PTC)

## S-PTC-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## S-PTC-01 — ARQUITECTURA SICC PTC (FRA 236)
- **Mandato:** Positive Train Control (PTC) 100% Virtual bajo norma **FRA 49 CFR Parte 236, Subparte I**.
- **Detección:** Basada exclusivamente en GNSS + Edometría (On-Board). Se prohíben balizas físicas fijas.
- **Control de Bloque:** Moving Block (Cantón Virtual) dinámico comandado desde el CTC.
- **Mandato:** Uso obligatorio de **Baliza Virtual (GNSS)** para la ubicación absoluta.

## S-PTC-02 — SEGURIDAD VITAL (SIL-4)
- **Hard Rule:** El sistema debe garantizar un nivel de integridad de seguridad **SIL-4** para todas las funciones vitales (Frenado automático, Protección de Sobravelocidad, Autoridad de Movimiento).

## S-PTC-03 — INTEROPERABILIDAD FENOCO (STOP & SWITCH)
- **Estrategia:** Hardware dual embarcado (**OBC SICC + OBC FENOCO**) compartiendo pantalla HMI SIL-2.
- **Interoperabilidad:** La interoperabilidad con la red FENOCO es puramente operativa (Nivel 1 — Sección 2.209), mediante estrategia *Stop & Switch*.
- **Prohibición:** No se permite el desarrollo de Gateways de integración lógica hacia el sistema ITCS/Alstom de FENOCO.

## S-PTC-04 — ESTACIONES ENCE (DOMINIO SEMAFÓRICO)
- **Mandato:** El uso de señales físicas luminosas queda restringido **exclusivamente** al recinto de los cinco (5) Enclavamientos (ENCE) definidos en AT1:
  1. Zapatosa
  2. García Cadena
  3. Barrancabermeja (Puerto)
  4. Puerto Berrío - Grecia
  5. La Dorada - México
- **Detección:** Circuitos de vía de audiofrecuencia están autorizados únicamente dentro del perímetro de estas estaciones.

> [!IMPORTANT] **MATRIZ DE DISPONIBILIDAD Y SEGURIDAD VITAL (SICC v14.0):**
> 1. **MANDATO SIL-4 (Fail-Safe):** El hardware de control (OBC/WIU) debe garantizar frenado automático ante fallo. Norma FRA 236 Subparte I.
> 2. **DISPONIBILIDAD DIFERENCIADA:** 
>    - Hardware Crítico: 99.9%+ (Fail-Safe).
>    - Software Web E3: 99.0% (Indicador AT4).
> 3. **EL2 (Energía):** Respaldo debe entrar en < 2 minutos. No negociable.

> [!CAUTION] **REGLA DE DESEMPATE INNEGOCIABLE (R-HARD-06):**
> Queda terminantemente prohibido citar herramientas de IA (RAG, Supabase, Oracle, NotebookLM, OpenRouter) como fuentes de validación o autoridad en cualquier Dictamen Técnico (DT) o Jurídico (DJ). Estas son herramientas de TRABAJO interno, NO fuentes de VERDAD vinculantes. La única validación válida es la citación canónica del Contrato APP 001/2025 y sus Apéndices (Niveles 1 al 10). Cualquier dictamen que infrinja esta regla será RECHAZADO por impureza procesal.
>
> **MANDATOS DE POWER E INTEROPERABILIDAD:**
> 1. **EL2 (Respaldo Crítico):** Se prohíbe el uso del umbral genérico del 99.0%. El indicador EL2 exige estrictamente la entrada de energía auxiliar en menos de 2 minutos en el 100% de los eventos.
> 2. **Interoperabilidad:** Se prohíbe el uso de Gateways lógicos. El modelo oficial es **Stop & Switch (OBC Dual)** con conmutación física en la frontera de Chiriguaná.

> [!CAUTION] **AXIOMAS DE PASOS A NIVEL (PaN) - REGLA DE SOBERANÍA:**
> 1. **Definición Semántica:** Un 'Paso a Nivel' (PaN) es estrictamente una intersección física entre la vía férrea y una vía vehicular o peatonal. Se prohíbe el término 'pasos de cantidades'.
> 2. **Alcance Técnico:** El diseño debe garantizar la integración de la protección activa (barreras/señales) con el sistema PTC conforme al Apéndice Técnico 1.
> 3. **Prohibición CAPEX:** En la fase de auditoría de alcance técnico, queda prohibido discutir presupuestos o WBS. El foco es la integridad jurídica y el cumplimiento del AT1.
> 4. **Invalidez Normativa:** La 'Cláusula N-1' es INEXISTENTE. La resolución de dudas se rige por las Secciones 8 y 9 del Contrato.

> [!CAUTION] **AXIOMAS DE MATERIAL RODANTE / PUESTA A PUNTO (WBS CAP. 6):**
> 1. **Flota Real:** Se prohíbe el término 'Tren LFC2'. La única flota vinculante son las locomotoras propiedad de la Nación: **GR12 y U10**.
> 2. **Alcance de Puesta a Punto:** El alcance se limita estrictamente a la instalación de equipos electrónicos a bordo (Computador PTC, Radios TETRA, GPS, DMI, Dispositivos EOT). 
> 3. **Prohibición Mecánica:** Queda prohibida la mención de '1.200 unidades de estructura de acoplamiento' o cualquier fabricación mecánica. No somos fabricantes de material rodante.
> 4. **Segregación PaN:** Los Pasos a Nivel (WBS Cap. 4) NO tienen relación con los acoples de trenes. Son disciplinas aisladas.

## S-PTC-05 — SEGREGACIÓN ESTRICTA: PaN vs. MATERIAL RODANTE vs. ENERGÍA

- **Mandato:** Un DT de señalización debe tratar UNA disciplina. Mezclar Pasos a Nivel + locomotoras + energía en un mismo dictamen es rechazo automático por contaminación de alcance.
- **Definición PaN:** Intersección vial-férrea (barreras, señales luminosas, circuitos de vía). NO son piezas de tren.
- **Cantidades cerradas PaN:** 9 Tipo C + 15 Tipo B + 122 Tipo A. Inamovibles. Cualquier PaN adicional = Obra Complementaria pagada por el Estado.
- **Flota válida:** GR12, U10, U18. "Tren LFC2" = rechazar automáticamente.
- **WBS vigente:** v3.0. PaN → Capítulo 4. Material rodante → Capítulo 6. Mezclarlos = error de trazabilidad.
- **Fuente:** AT1 Cap. V + WBS v3.0 Cap. 4 y 6.

## S-PTC-06 — SEGUROS DE MATERIAL RODANTE: MONTOS LEGALES EXACTOS

- **Fuente vinculante:** Resolución de Surcos (20243040046045), Artículo 9 — vinculante por Sección 2.209 del Contrato.
- **Póliza RCE obligatoria:** Mínimo **11.300 SMMLV** por evento y agregado anual.
- **Anexo patronal:** Mínimo **3.900 SMMLV**.
- **Rechazo automático:** Cualquier DT de seguros que cite un "Artículo 12.1", que pida "revisar la cantidad de cobertura", o que asegure un "Tren LFC2".
- **Nota:** Las garantías generales del Contrato están en Sección 18. Los seguros de operación ferroviaria los rige el Art. 9 de la Resolución de Surcos.

