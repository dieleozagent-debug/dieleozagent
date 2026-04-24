> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025 (y documentos prevalentes).
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1) — Alcance y Funcionalidad.
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3) — Criterios de Diseño y Normativa.
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: SIGNALIZATION (S-PTC) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios técnicos, funcionales y normativos que rigen el desarrollo del **diseño de detalle** del Sistema de Señalización, control de tráfico y comunicaciones del Corredor Férreo La Dorada – Chiriguaná (APP No. 001 de 2025). El alcance se limita a definir una base preliminar de diseño, arquitectura general, principios de operación y criterios de cumplimiento aplicables al subsistema de control de trenes, CCO, comunicaciones para señalización, protección de Pasos a Nivel (PaN) e interoperabilidad con FENOCO.

### 1.2. Marco Normativo (Obligatorio)
- **Internacional**: FRA 49 CFR Part 236, Subpart I (2026), FRA 49 CFR Part 213 (2026), AREMA Manual for Railway Engineering (2021) y AREMA Communications & Signals Manual (2021).
- **Nacional (Colombia)**: RETIE 2024, NSR-10 (Decreto 926 de 2010), NTC 4741:1999 y Manual de Señalización Vial de Colombia (Res. 20243040045005 de 2024).

### 1.3. Alcance del Sistema
- **Corredor**: 526,133 km | **Trocha**: 914 mm (Carga, vía única con apartaderos).
- **Arquitectura**: Positive Train Control (PTC) con **cantonamiento virtual** en tramos de vía sencilla y **cantonamiento físico** en las cinco (5) zonas ENCE.
- **Equipo Embarcado (Mandatorio)**:
    1. Computador PTC SIL-4.
    2. Posicionamiento GNSS + Odometría.
    3. DMI (Velocidad + MA).
    4. Interfaz de Freno (Enforcement).
    5. Radio TETRA + Redundancia Satelital.
    6. Event Recorder + HOT-EOT (Integridad).
    7. Onboard Track Database.
- **Funciones de Seguridad Vitales (FRA 236-I)**:
    1. Prevención de colisiones entre trenes.
    2. Prevención de descarrilamientos por exceso de velocidad.
    3. Prevención de incursión en zonas de trabajo protegidas.
    4. Prevención de movimiento a través de cambios mal posicionados.
- **Desvíos**: Motorizados en 5 zonas ENCE. **Desvíos Libres** en el resto del corredor (Tabla 17 AT1).

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

> [!CAUTION] **AXIOMAS DE SOBERANÍA Y OPERACIÓN (ESCUDOS CONTRACTUALES):**
> 1. **Notificación Oficial (Sección 2.156):** Nada es informal ni verbal. Solo la comunicación escrita oficial es vinculante. Los chats y minutas son informativos, NO contractuales.
> 2. **Régimen de Revisión (Sección 8.1):** La Interventoría tiene plazos técnicos. Si hay rechazo injustificado (caprichoso), se acude al Amigable Componedor (Sección 2.20).
> 3. **Equipos Complementarios (Sección 9.12):** Todo requerimiento de la ANI fuera del AT1 es un "Equipo Complementario" y debe ser pagado por el Estado (Sección 2.159).
> 4. **Responsabilidad Indelegable (Sección 7.1):** El retraso de subcontratistas (Ardanuy, etc.) no exime al Concesionario ante la ANI.

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

## S-PTC-07 — ANCLAJE FINANCIERO PTC (WBS CAP. 1)

- **Mandato:** El Sistema de Señalización y Control (PTC) tiene un presupuesto anclado al **WBS Oficial v3.0, Capítulo 1**.
- **Referencia CTC:** Tan solo la partida 1.1.103 (Software CTC Virtual + ETCS L2) tiene un valor asignado de **$88.112.090.432 COP**.
- **Rechazo automático:** Cualquier DT que asigne presupuestos irrisorios (ej. $150.000.000 COP) para la señalización principal será RECHAZADO por inviabilidad técnica.

## S-PTC-08 — MANDATO ENCE (5 ZONAS DE CANTONAMIENTO FÍSICO)

- **Mandato**: El diseño DEBE incluir los cinco (5) Enclavamientos Electrónicos (ENCE) físicos para las zonas operativas exigidas en AT1.
- **Zonas de Control**: La Dorada–México, Puerto Berrío–Grecia, Barrancabermeja, García Cadena y Zapatosa.
- **Funciones Vitales ENCE**:
    1. Aseguramiento de rutas mediante lógica segura.
    2. Verificación de liberación y ocupación de vía (Cantonamiento Físico).
    3. Comando de señales luminosas y cambiavías motorizados.
    4. Transferencia controlada a operación local (contingencia/mantenimiento).
- **Prohibición**: Se prohíbe el término "Infraestructura Zero". La arquitectura es **Virtual V-Rail** con componentes físicos ENCE en los nodos estratégicos.

## S-PTC-09 — REDES Y COMPATIBILIDAD ELECTRÓNICA (EMC)
- **Mandato**: Toda la red de transmisión de datos del sistema de señalización debe cumplir con los estándares IEEE 802.x y protocolos IP establecidos en [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md).
- **EMC**: El equipamiento activo debe certificar cumplimiento con CISPR 22/24.
- **Seguridad**: Transmisión en redes inalámbricas (Satelital/LTE) protegida bajo EN 50159 Categoría 3.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:35:09.064Z):**
> Se debe eliminar cualquier referencia a 'Soberana' o 'Infraestructura Zero' y respetar estrictamente las terminologías contractuales establecidas (e.g., Arquitectura Virtual V‑Rail). El siguiente ciclo deberá incluir el uso correcto de términos técnicos y la evitación de conceptos ficticios.

## S-PTC-10 — PROTECCIÓN DE PASOS A NIVEL (PaN)
- **Control**: Los PaN en zonas ENCE se gobiernan por el enclavamiento. Los restantes PaN activos (B/C) se gobiernan mediante la lógica **PTC con cantonamiento virtual**.
- **Lógica CWT**: Es mandatorio el uso de Tiempo de Advertencia Constante (**Constant Warning Time**) basado en el vector velocidad/posición del tren provisto por el sistema PTC.
- **Cantidades Mandatorias**: 9 Tipo C (Barreras) | 15 Tipo B (SLA).
- **Normativa**: **NTC 4741 (1999)**, Manual de Señalización Vial (2024) y **FRA 49 CFR Part 234**.
- **Falla Segura**: Ante pérdida de comunicación con el PTC central o falla de energía, el PaN debe transicionar a su estado de mayor seguridad (Cierre/Advertencia).

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:52:18.309Z):**
> Se debe diseñar e implementar el sistema de Control Center utilizando la 'Arquitectura Virtual V-Rail' y ajustarse a los estándares de disponibilidad y seguridad establecidos en la normativa FRA 49 CFR Parte 236 y AREMA, y cumplir con los requisitos técnicos y contractuales establecidos en el Contrato APP 001/2025.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T17:06:08.156Z):**
> Se debe incluir una sección de citación canónica que haga referencia explícita a numerales del Contrato APP 001/2025 y se debe asegurar que la propuesta se ajuste a los criterios técnicos y legales del Proyecto, incluyendo la mención explícita a la flota real en el contexto de señalización
