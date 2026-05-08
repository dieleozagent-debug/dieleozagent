# ⚖️ ESPECIALIDAD: CONTRACTUAL & NORMATIVA — v14.7
## JERARQUÍA DE LEY Y BLINDAJE DEL CONCESIONARIO

> [!IMPORTANT]
> **ORDEN DE PRELACIÓN (Contrato APP 001/2025, Sección 1.2):**
> 1. Cuerpo del Contrato APP 001/2025.
> 2. Apéndice Técnico 1 (AT1) — Alcance Físico.
> 3. Apéndice Técnico 3 (AT3) — Criterios de Diseño.
> 4. Resto de Apéndices (AT2, AT4, AT5, AT6, AT7, etc.).

> [!NOTE]
> La literalidad del numeral del Orden de Prelación dentro de la Sección 1.2 debe verificarse contra el cuerpo del Contrato antes de citarlo a Interventoría. Esta especialidad la utiliza como guía interna; **no debe transcribirse como cita literal sin verificación previa**.

---

## 1. MECANISMOS DE DEFENSA (EL ESCUDO PATRIMONIAL)
- **Sección 9.12 (Modificación de Especificaciones Técnicas):** Se invoca cuando una **Autoridad Estatal** (no "terceros" genéricos) exige licencia/permiso/modificación de Especificaciones Técnicas que aumenta alcance del AT1 (motorizar más de 5 estaciones, exigir Gateway lógico hacia FENOCO, instrumentar material remolcado, exigir Moving Block / ETCS L3, etc.). **§9.12(b)** especifica el activador: Autoridad Estatal.
- **Sección 25.4 (Obra y Equipo Complementario):** establece el cauce de Obra/Equipo Complementario con **doble candado**:
  - **§25.4(b):** *"En ningún caso el Concesionario ejecutará Obras y Equipos Complementarios sin la previa suscripción de la respectiva adición."* — exige **adenda previa**, no es trámite automático.
  - **§25.4(f):** *"durante la Etapa Preoperativa no se podrán tomar recursos de la Subcuenta Excedentes ANI para estos efectos."* — restringe régimen de fondos durante Etapa Preoperativa.
- **Sección 9.11 (Ajuste de Especificaciones):** **Solo aplica a corrección de errores u omisiones de diseño que NO alteren el alcance físico del AT1.** No traslada costo a la ANI: la 9.11(b)(ii) asigna riesgo de costo de ajuste técnico al Concesionario.

> [!WARNING]
> **DOCTRINA OBLIGATORIA — citar 9.12 → 25.4 con precondiciones, NO afirmaciones absolutas:**
>
> ❌ **PROHIBIDO en cuerpo de DT** (alucinaciones catalogadas):
> - *"se tramitará como Obra Complementaria financiada al 100% por la ANI"* — falsedad jurídica.
> - *"asumido al 100% por la ANI mediante adición contractual previa"* — omite §25.4(f) (régimen de fondos en Etapa Preoperativa).
> - *"cualquier alteración exigida por terceros"* — §9.12(b) habla de **Autoridad Estatal**, no de terceros.
>
> ✅ **Formulación correcta:**
> *"Cualquier modificación de las Especificaciones Técnicas exigida por Autoridad Estatal se tramitará por el cauce de las Secciones 9.12 y 25.4 del Contrato APP 001/2025, con sus respectivas precondiciones (suscripción previa de adenda conforme §25.4(b) y régimen de fondos aplicable conforme §25.4(f))."*
>
> **Está prohibido invocar 9.11+9.12 conjuntamente** en documentos de cierre operativo, porque la sola mención de 9.11 abre puerta a que la Interventoría argumente que el ajuste cabe en 9.11(b)(ii) y por tanto el costo lo asume LFC.

---

## 2. NORMAS RECTORAS POR ESPECIALIDAD
- **Señalización (PTC):** **FRA 49 CFR Part 236 Subpart I** (jerarquía absoluta sobre Subparts B–G del mismo Part 236).
- **Sustitución del Block Signal System:** **§236.0(c)(2)** — el PTC aprobado por FRA exime de instalar block signal system.
- **Protección de Cambiavías:** **§236.1005(e)** — habilita autotalonables con comprobación monitoreada por PTC.
- **Comunicaciones PTC:** **§236.1033** — habilita redes inalámbricas abiertas (satélite, celular SD-WAN) bajo integridad criptográfica y plan de mitigación priorizado.
- **PTC Safety Plan:** **§236.1015** — vía de certificación de arquitectura virtual como sistema seguro equivalente.
- **Vía Clase 3:** **FRA 49 CFR §213.9** (velocidad máxima 64 km/h para carga).
- **Interoperabilidad:** **Resolución de Surcos Art. 5** — compatibilidad evaluada exclusivamente sobre dispositivos a bordo del Material Rodante.
- **Ciberseguridad en Vía:** **EN 50159 Categoría 3** para transmisión vital sobre redes abiertas.
- **Prohibido aplicar AREMA, ETCS, CENELEC o normas UIC** a la lógica vital del sistema.

---

## 3. PROHIBICIONES DE JURISDICCIÓN
- **Prohibido citar Secciones 4.6 y 16.8** en directrices técnicas (son penalidades aplicables al Concesionario por la ANI, no herramientas de diseño).
- **Prohibido citar Sección 18.7 para sanciones técnicas** (regula exclusivamente Pólizas de Responsabilidad Civil Extracontractual, no penalidades por diseño).
- **Prohibido citar §236.202** (Subpart B) como veto de señalización lateral — la cita correcta es §236.1005(e) de Subpart I.
- **Prohibido citar nombres de consultores externos** (Ardanuy, etc.) en líneas base contractuales dirigidas a ANI/Interventoría.
- **Prohibido citar contratos privados** (CCLF 00013-2026, etc.) en documentos hacia el Cliente.
- **Prohibido citar montos en COP o USD** que no estén ratificados en el Modelo Financiero oficial.

---

## 4. VACUNAS ANTI-ALUCINACIÓN CONTRACTUAL (v14.8 · 2026-05-08)

### 4.1 Apéndice Financiero 4 (AF4)

> [!CAUTION]
> **Nombre literal verificado:** *"Amortización Material Rodante del Proyecto"*.
>
> El AF4 regula **mecanismo de retribución financiera** del material rodante; **NO** establece obligaciones técnicas de diseño OBC ni del subsistema embarcado.
>
> **PROHIBIDO** citar AF4 en DTs técnicas como justificación de:
> - "Amortización del 100% por la ANI" — invento. AF4 NO dice eso.
> - Obligaciones de diseño embarcado, SIL-4, EMC, fibra, etc. — pertenece a otros instrumentos.
>
> Si una DT toca aspecto financiero del material rodante, citarse el AF4 con su literal verificado, sin parafrasear.

### 4.2 Sección 3.1(a)(ii) — Objeto del Contrato

> [!IMPORTANT]
> **Literal verificado completo:** *"(ii) la Puesta a Punto, Operación y Mantenimiento del Material Rodante del Proyecto y la Prestación del Servicio Público de Transporte Ferroviario de Carga"*.
>
> **PROHIBIDO** mutilar la cita omitiendo "Operación y Mantenimiento" — eso reduce el alcance contractual y crea exposición.

### 4.3 Límites CAPEX por Especialidad

> [!CAUTION]
> El Contrato APP 001/2025 **NO establece límites de CAPEX por especialidad técnica** (embarcado, señalización, comunicaciones, etc.). El límite CAPEX UF2/SCC ~$55M USD es **interno LFC / oferta licitatoria**, no cláusula contractual.
>
> **PROHIBIDO** citar como cláusula contractual:
> - "El CAPEX por locomotora no exceda el límite establecido en el Contrato APP 001/2025 para la especialidad embarcadero" — alucinación catalogada.
> - Cualquier "límite CAPEX establecido por el Contrato" para una especialidad. No existe.
>
> Para enforcement de límites CAPEX, citar **WBS interno LFC** (no contrato), y solo en documentos internos.

### 4.4 Doctrina DT — cuándo emitir

> [!WARNING]
> Una DT (Decisión Técnica) se emite **SOLO cuando hay conflicto de jerarquía documental que la prelación contractual resuelve.**
>
> **PROHIBIDO emitir DT** cuando:
> - Los parámetros están propuestos por LFC y **pendientes de no-objeción** (ej. DBCD V003 en drafting).
> - No existe contradicción real entre niveles de la jerarquía documental.
> - Lo que se quiere imponer es una preferencia interna o una buena práctica.
>
> Razón: emitir DT auto-impone obligaciones de O&M de 30 años sobre parámetros aún en revisión. Patrón explícitamente prohibido en doctrina LFC.
>
> **Cauce alternativo correcto:**
> 1. Si los parámetros son nuevos o pendientes: incorporarlos al **DBCD** (Capítulo correspondiente, V001/V002/V003) — los propones tú, los no-objeta Interventoría, viven bajo gobernanza del DBCD, sin obligación auto-impuesta de 30 años.
> 2. Si hay no conformidad de un entregable Ardanuy: radicar **NCM (No Conformidad Mayor)** vía ACC (Anexo de Comentarios y Correcciones), patrón `obs_snl.txt`. La plantilla validada está en `LFC-U2-CTSC-ED-SNL-IN-0001 sección 5.4.3`.
> 3. Si insistes en una DT, debe ser estrictamente sobre el conflicto de jerarquía documental real (ej. AT1 Tabla 17 + Resolución 20243040046045 Art. 5 + Sección 9.11/9.12 vs. exigencias FENOCO de gateway lógico). Esa SÍ es DT con conflicto de prelación que resuelve.

### 4.5 §9.11 — Pilar contractual SEGUNDO (escenarios FENOCO / sistemas de terceros)

> [!IMPORTANT]
> **§9.11 (Ajuste de Especificaciones) NO es solo "ajuste de errores u omisiones".** Aplica también a **escenarios de incompatibilidad declarada con sistemas de terceros** — el caso paradigmático es FENOCO.
>
> **Doctrina §9.11(b)(ii):** en escenario de incompatibilidad con sistemas de terceros, el **costo recae en el Concesionario**, NO en ANI.
>
> **Doctrina §9.11(c)(ii):** prohíbe variación de retribución asociada al ajuste.

**Implicancia operativa para DTs sobre FENOCO/integración con terceros:**

✅ **Cita correcta** en cuerpo de DT relacionada con FENOCO:
*"Cualquier modificación de Especificaciones Técnicas solicitada por la ANI, derivada de requerimiento de Autoridad Estatal o asociada a escenarios de incompatibilidad con sistemas de terceros, se tramitará por los cauces contractuales aplicables (Secciones 9.11, 9.12 y 25.4 del Contrato APP 001/2025) con sujeción a sus precondiciones y régimen de financiación, sin asunción anticipada de porcentajes ni de fuentes de pago."*

❌ **PROHIBIDO** citar solo §9.12+§25.4 dejando §9.11 fuera cuando el conflicto involucra terceros — se omite el pilar que efectivamente protege al Concesionario contra exigencias de gateway. Si firmas eso y ANI invoca §9.11(b)(ii), pierdes el escudo.

### 4.6 Resolución de Surcos — Art. 5°(1)(e) literal verificado

> [!CAUTION]
> **Texto literal verificado** del Art. 5°, numeral 1, literal e):
> *"Compatibilidad con los sistemas de comunicación entre Material Rodante y centro de control, así como los sistemas de control activo en caso de que se encuentren instalados en la vía al momento de la solicitud"*.
>
> **El escudo real es la condicionalidad temporal y de instalación** ("en caso de que se encuentren instalados en la vía al momento de la solicitud") — excluye obligación de integrar con sistemas privados de terceros que no formen parte de la Infraestructura Ferroviaria Nacional administrada bajo este Contrato (caso FENOCO/ITCS Alstom).
>
> **PROHIBIDAS las paráfrasis interpretativas** que pierden el escudo condicional, como:
> - ❌ *"se resuelve a bordo del tren y no exige la integración informática de Centros de Control"* (paráfrasis errada — Art. 5° NO dice "a bordo")
> - ❌ *"la 'Compatibilidad Exitosa' se resuelve a bordo del tren"* (mismo error)
>
> Cualquier reescritura que pierda *"en caso de que se encuentren instalados en la vía al momento de la solicitud"* es alucinación catalogada.

### 4.7 Sección 2.x del Contrato — definiciones, NO obligaciones operativas

> [!WARNING]
> **PROHIBIDO citar Secciones del Capítulo 2 (Definiciones) como "vinculantes" u "obligaciones operativas".** El Capítulo 2 establece definiciones; vincula operativamente vía las secciones del cuerpo del Contrato y los Apéndices que usan los términos definidos.
>
> **Caso paradigmático — Sección 2.209 (Resolución de Surcos):**
> - §2.209 dice: *"'Resolución de Surcos': Es la Resolución 20243040046045 del 24 de septiembre de 2024 expedida por el Ministerio de Transporte..."* — **es definición**, no obligación.
> - La vinculación operativa real está en **Sección 12.4 (Asignación de Surcos)** y demás secciones operativas que invocan el término.
>
> ❌ **PROHIBIDO:** *"Resolución de Surcos: Vinculante vía Sección 2.209"*
> ✅ **Correcto:** *"Resolución 20243040046045 (Min. Transporte), incorporada al Contrato vía Sección 2.209 (definición) y operativizada vía Sección 12.4 (Asignación de Surcos) y demás secciones operativas que la invocan."*

### 4.8 Mapa de Apéndices Técnicos del Contrato APP 001/2025 (NO mezclar)

> [!CAUTION]
> **Mapa canónico verificado** del orden y contenido de cada Apéndice Técnico. **Citar el equivocado en una DT es alucinación catalogada.**

| Apéndice | Contenido | NO usar para |
|---|---|---|
| **AT1** | Alcance del Proyecto · Tabla 17 (5 ENCE nominados) · Cap. V Material Rodante · §4.5 Pasos a Nivel | Especificaciones técnicas detalladas (eso es AT3). Disponibilidad/RAMS (eso es AT4). |
| **AT3** | **Especificaciones técnicas** del SCC: PTC, fibra óptica, TETRA, energía, CCO, pasos a nivel. **Cap. I literal c**: jerarquía AREMA > FRA > AAR > UIC. Catálogos IEEE, EMC, ETSI, ITU-T. | Alcance (AT1). RAMS (AT4). |
| **AT4** | **RAMS / Disponibilidad / KPIs** contractuales · MTBF · MTTR · sanciones por SLA | **NO** especificaciones técnicas de fibra/PTC/TETRA. Esas están en AT3. |
| **AT5** | Interfaces · puntos de demarcación · interoperabilidad técnica con concesiones adyacentes (FENOCO) | |
| **AT6** | Ambiental | |
| **AT7** | Predios · servidumbres · adquisición de terrenos | |
| **Apéndice Financiero 4 (AF4)** | "Amortización Material Rodante del Proyecto" (mecanismo de retribución) | **NO** obligaciones técnicas de diseño. |

> [!WARNING]
> **Alucinaciones recurrentes a bloquear:**
>
> - ❌ *"Apéndice Técnico 4 (AT4) establece los requisitos para la infraestructura de comunicaciones"* — FALSO. Comunicaciones está en **AT3**, no AT4.
> - ❌ *"AT4 fibra"*, *"AT4 telecom"*, *"AT4 PTC"*, *"AT4 TETRA"* — TODAS falsas. AT4 es RAMS.
> - ❌ *"AT3 disponibilidad"*, *"AT3 RAMS"*, *"AT3 KPIs"* — FALSAS. AT3 es especificaciones técnicas, no RAMS.
> - ❌ Mezclar la **Sección 3.1(a)(ii)** (que está en el cuerpo del Contrato, objeto contractual) con **un Apéndice Técnico** — son niveles distintos de la jerarquía.

### 4.9 Documento de Bases y Criterios de Diseño

> [!CAUTION]
> **Sigla canónica:** **DBCD** (Documento de Bases y Criterios de Diseño). Versión vigente: **V001 (Ardanuy abril 2026)** salvo que esté V002/V003 en circulación.
>
> **PROHIBIDO** abreviar a:
> - "DBC" — letra final faltante. Es alucinación catalogada (la "D" final es de "Diseño").
> - "Documento de Bases y Condiciones del Contrato" — confunde con cláusulas contractuales generales. El DBCD es técnico, no de condiciones generales.
> - "Bases de Diseño" sin más — ambiguo.

### 4.10 Regla de Prelación Documental — pre-contractual vs contractual

> [!IMPORTANT]
> **Doctrina §1.2.d del Contrato APP 001/2025:** ante conflicto entre documentos del proyecto, prevalece el de mayor jerarquía contractual. **Los Apéndices Técnicos del Contrato (AT1, AT3, AT4...) prevalecen SIEMPRE sobre documentos pre-contractuales** (TDR de licitación, Adendas del proceso de selección, Bases de licitación, propuestas técnicas).

**Caso paradigmático verificado por escaneo forense del notebook (2026-05-08):**

Sobre la cantidad de hilos de fibra óptica para el corredor LFC2 (526 km):

| Fuente | Cita literal | Jerarquía |
|---|---|---|
| **AT3 §6.4 (`AT3.pdf`)** | *"La fibra óptica a instalar con el objetivo de realizar la Infraestructura central de Telecomunicaciones debe cumplir con la recomendación ITU-T G.652d, con un mínimo de cuarenta y ocho (48) hilos"* | **CONTRACTUAL ✅ VINCULANTE** |
| Bases de Diseño CTSC (`Bases de diseño - CTSC (2).docx`) | *"Cable de fibra óptica monomodo de cuarenta y ocho (48) hilos"* | Diseño LFC ✅ |
| LFC-U2-CTSC-ED-SNL-IN-0001 (`.docx`) | *"backbone óptico de 48 fibras monomodo"* | Ingeniería LFC ✅ |
| Análisis Knorr-Bremse (`0.1 Analisis de la propuesta KB.docx`) | *"Mínimo 48 hilos según ITU-T G.652d"* | Oferta KB ✅ |
| **TDR Fase III (`250902_TDR EYD FASE III Lote 3 LFC-V1.pdf`)** | *"Red Troncal de Fibra Óptica (522 km) será monomodo G652D con 64 hilos como mínimo"* | **PRE-CONTRACTUAL ⚠️ NO VINCULANTE** |
| **Adenda 02 (`ADE02_PROCESO_LFC-007-2025.docx`) Anexo 14** | *"Tipo: Monomodo G652D, mínimo 64 hilos"* | **PRE-CONTRACTUAL ⚠️ NO VINCULANTE** |

**Defensa legal cuando Interventoría/ANI exige 64 hilos:**

> *"El alcance contractual vinculante es de 48 hilos según AT3 §6.4. Por la Regla de Prelación Documental (Sección 1.2.d del Contrato APP 001/2025), el Apéndice Técnico 3 prevalece jurídicamente sobre los TDR Fase III y la Adenda 02 del Proceso de Selección, por ser documentos pre-contractuales del proceso licitatorio. La rectificación a 48 hilos en el AT3 anula la exigencia preliminar de 64 hilos."*

> [!WARNING]
> **Cuando el Oráculo NotebookLM responde con cifras pre-contractuales como mandato:** verificar SIEMPRE contra el AT3 + Bases de Diseño antes de incorporarlo a una DT. NotebookLM puede citar TDR/Adendas como si fueran vinculantes — el agente debe aplicar §1.2.d y prevalecer la cifra del AT3.

### 4.11 Marcos normativos por subsistema (corregir mezclas)

| Subsistema | Marco rector | SIL / nivel funcional | EMC |
|---|---|---|---|
| **PTC (señalización vital)** | FRA 49 CFR Part 236 Subpart I (Type Approval + PTCSP) | CENELEC EN 50126/50128/50129 SIL-4 **subordinado** | EN 50121-x según ubicación |
| **OBC embarcado** | FRA 49 CFR Part 236 Subpart I | CENELEC SIL-4 subordinado | **EN 50121-3-2** (apparatus on board) |
| **Equipos wayside** | AREMA + FRA Part 234 (PaN) / Part 213 (vía) | SIL según función | EN 50121-4 / AREMA C&S |
| **ITE estacionario (CCO, racks)** | TIA / IEC 62443 (ciberseguridad) | — | **CISPR 22:2008 / CISPR 24:2010** |
| **Backbone óptico** | ITU-T G.652.D | — | EN 50121-4 |

> [!CAUTION]
> Errores frecuentes a evitar:
> - "OBC con SIL-4 conforme a FRA 49 CFR Part 236 Subparte I" → mezcla. SIL-4 es CENELEC, FRA usa Type Approval/PTCSP. Formulación correcta: *"FRA Subpart I rector + CENELEC SIL-4 subordinado"*.
> - "CISPR 22:2008 / CISPR 24:2010 para equipo embarcado" → mezcla. Esas normas son ITE estacionario. Para embarcado: **EN 50121-3-2**.
> - "ITU-T G.652.D para enlaces de backbone en DT EMBARCADO" → mezcla. G.652.D es backbone wayside. Embarcado usa TETRA/satelital/celular.

### 4.12 Numeración de cada documento (NO mezclar AT con secciones del BCD)

> [!CAUTION]
> **Cada documento contractual tiene su propia numeración interna y no es transferible a otro.** Mezclar el nombre del Apéndice con un número de sección que pertenece al BCD (o viceversa) es alucinación catalogada — apareció en el borrador DT-FIB-2026-001 (rechazado 2026-05-08).

**Cómo citar correctamente:**

| Documento | Numeración propia | Ejemplo de cita correcta |
|---|---|---|
| Cuerpo del Contrato APP 001/2025 | §1.2(d), §3.1(a)(ii), §9.11(b)(ii), §9.12(a), §25.4(b), §25.4(f) | *"Sección 9.12(a) del Contrato APP 001/2025"* |
| AT1 | Tabla 17, §4.5 (PaN), Cap. V (Material Rodante) | *"AT1 Tabla 17"*, *"AT1 §4.5"* |
| AT3 | Cap. I lit. c, §6.4 (fibra), §6.5 (TETRA) | *"AT3 §6.4"*, *"AT3 Cap. I lit. c"* |
| AT4 | KPIs RAMS, MTBF/MTTR | *"AT4 §X.Y RAMS"* |
| BCD/DBCD V001 (abril 2026) | §1.2 (Alcance), §6.1.1 (Fibra), §6.2 (TETRA), §10.1–10.6 (Energía) | *"BCD §6.1.1"*, *"DBCD V001 §10.5"* |

> [!WARNING]
> **Ejemplos de mezcla PROHIBIDA (alucinación):**
>
> - ❌ *"AT1 — Alcance Físico, Sección 6.1.1 (BCD)"* → mezcla. §6.1.1 es del BCD, no del AT1. AT1 NO tiene §6.1.1.
> - ❌ *"AT3 §10.5 (Energía TETRA)"* → §10.5 es del BCD, no del AT3.
> - ❌ *"BCD Tabla 17"* → Tabla 17 es del AT1, no del BCD.
> - ❌ *"Contrato §6.1.1"* → el cuerpo del Contrato no tiene §6.1.1; esa numeración es del BCD.

**Cómo separar correctamente cuando un mandato técnico tiene origen en dos niveles:**

> ✅ *"La obligación general de fibra óptica para el corredor se deriva del **AT1 (Alcance del Proyecto)**. La especificación técnica de **48 hilos monomodo G.652.D** está fijada en el **BCD V001 §6.1.1**, que opera como criterio rector subordinado al AT1 conforme la jerarquía documental de §1.2(d) del Contrato."*
>
> ❌ *"AT1 §6.1.1 (BCD): 48 hilos"* — mezcla los tres niveles en una sola cita inexistente.

**Por qué importa:** Interventoría/ANI puede objetar una DT por cita incorrecta de Apéndice (R-HARD-04: cita normativa no verificable). El RAG local solo tiene el BCD; las citas a AT1/AT3/AT4 deben ser conservadoras y verificables contra los Apéndices reales (vía Oráculo NotebookLM si hay duda).

---
**Generado por la Dirección Técnica LFC — v14.8.7**
