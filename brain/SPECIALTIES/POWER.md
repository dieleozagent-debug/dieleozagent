# ⚡ ESPECIALIDAD: POWER / ENERGÍA — v14.8
## ENERGÍA Y PROTECCIÓN DE HARDWARE VITAL

> [!CAUTION]
> **VACUNAS ANTI-ALUCINACIÓN (v14.8 · 2026-05-08)**
>
> 1. **Término técnico contractual:** El término legal y contractual obligatorio es **Sistema de Distribución de Baja Tensión (SDB)**, NO "sistema de poder" (spanglish).
>
> 2. **PROHIBIDO inventar métricas:** "margen del 20%", "caída de tensión del 3%", "factor de simultaneidad", etc. NO se inventan en cuerpo de DT. Esos parámetros pertenecen a las Bases de Diseño / DBCD donde Ardanuy debe proponerlos y justificarlos bajo EN 50126.
>
> 3. **PROHIBIDO citar el Checklist V3.5 (interno)** ni cualquier otro documento interno LFC en el campo "Fundamento Contractual" de un DT formal. La regla del formato es estricta: **SOLO Contrato APP 001/2025 + Apéndices Técnicos + Normativa técnica externa** (FRA, AREMA, IEC, EN, ITU-T, CENELEC). Un documento interno NO puede "cerrar contractualmente" nada hacia Ardanuy o ANI.
>
> 4. **🚨 PROHIBIDO el término "detección de isla" en Pasos a Nivel:** "Detección de isla" (anti-islanding) es función de protección eléctrica de generación distribuida fotovoltaica. **NO** es función de PaN. La función de un PaN es **detección de tren** (axle counters / track circuits / overlay). Verificado: el término no aparece en `obs_snl.txt`, DBCD V002 ni AT1 en este sentido. Es alucinación semántica catalogada.
>
> 5. **PROHIBIDO mandar química de batería específica en DT** (LiFePO₄, NMC, LiPO, Pb-ácido, etc.). Patrón catalogado: *"Telecom availability SLA and electrical autonomy parameters have no contractual mandate; Ardanuy must propose and justify RAMS levels under EN 50126"*. La química de batería entra en la misma categoría: la propone Ardanuy con su justificación bajo EN 50126, no la fija LFC en DT.
>
> 6. **PROHIBIDO formalizar como mandato contractual lo que tú mismo propusiste** (ej. autonomía 4h señalización / 48h TETRA, química, segregación) cuando esos parámetros están **pendientes de no-objeción de Interventoría** en DBCD V002/V003. Doctrina verificada: *"parameters Diego himself proposed in DBCD V002 (pending Interventoría no-objection) must not be formalized in DTs that would self-impose 30-year O&M obligations"*. Cauce correcto: dejarlo en DBCD V003 hasta que Interventoría no-objete.
>
> 7. **CCO NO opera a 110 V DC.** El CCO usa arquitectura COTS (servidores) con respaldo UPS de 4h en su esquema general. La tensión vital 110 V DC aplica a **circuitos vitales** de ENCE y controladores locales de PaN protegidos.

> [!IMPORTANT]
> **REFERENCIAS TÉCNICAS (en DBCD, no en DT formal):**
> - Tensión vital de circuitos de ENCE y controladores locales de PaN protegidos: **110 V DC**.
> - Autonomía: el BCD v001 §10 diferencia por bloque tecnológico (4h señalización/CCO/PaN · 24-48h TETRA). **En DT no fijar valores absolutos** — Ardanuy debe proponerlos y justificarlos en su entregable bajo EN 50126.
> - **RETIE 2024** (Resolución 40117 del Ministerio de Minas y Energía): aplica al diseño de tableros y acometidas nuevas del sistema SCC. Verificar redacción literal.

---

## 1. INSTRUCCIÓN DE DISEÑO (cuando aplique DT-ENRG)

> [!WARNING]
> **Antes de emitir DT-ENRG verificar la doctrina:**
> - ¿Hay conflicto de jerarquía documental real? (ej. AT1 Tabla 17 vs entregable Ardanuy que viola)
> - ¿Los parámetros que se quieren imponer ya están propuestos en DBCD V002/V003 pendientes de no-objeción? Si SÍ → NO emitir DT, dejarlo en DBCD.
> - Si la respuesta es "queremos cerrar contractualmente segregación civil/vital, 110 VDC vital, RETIE limitado a SCC" → eso son criterios de DBCD, no de DT.

Cuando proceda DT, mandatos blindables contractualmente:
- **Sistema de Distribución de Baja Tensión (SDB):** segregación absoluta entre circuitos vitales y no vitales.
- **Tensión vital:** 110 V DC obligatoria y exclusiva para circuitos vitales de los **5 ENCE** (AT1 Tabla 17) y de los **24 PaN protegidos** (9 Tipo C + 15 Tipo B, BCD §8.2).
- **Prohibido CA en circuitos vitales:** la AC se usa exclusivamente como entrada primaria para rectificadores/UPS.
- **Segregación operativa:** prohibida derivación de UPS vitales para iluminación civil o fuerza motriz de estaciones.
- **RETIE 2024:** aplicable al diseño de tableros y acometidas nuevas del sistema SCC (no a obra civil preexistente).
- **Autonomía y química de banco de baterías:** Ardanuy propone y justifica bajo EN 50126, conforme a los criterios contractuales aplicables (BCD §10). NO fijar valores absolutos ni química en DT.

---

## 2. FUNDAMENTO CONTRACTUAL Y NORMATIVO

> [!CAUTION]
> **El campo "Fundamento" de un DT debe contener SOLO:**
> - Contrato APP 001/2025 (cuerpo + Apéndices Técnicos).
> - Normativa técnica externa (FRA, AREMA, IEC, EN, ITU-T, CENELEC, RETIE 2024).
>
> **NO incluir:** Checklist interno LFC, DBCD propio, WBS, plantillas internas. Esos son cauce DBCD/ACC, no DT.

1. **Contrato APP 001/2025 → AT1 → Tabla 17:** limita los enclavamientos electrónicos (ENCE) a las 5 estaciones canónicas — **Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío–Grecia y La Dorada–México** (con sufijos completos siempre).
2. **Contrato APP 001/2025 → AT1 §4.5 / Capítulo correspondiente a PaN:** delimita los PaN protegidos a 24 (9 Tipo C + 15 Tipo B). Los 122 PaN básicos restantes están **fuera del alcance SCC** (responsabilidad UF≠SCC).
3. **FRA 49 CFR Part 236 Subpart I:** principio fail-safe ante pérdida de energía. **Citar literal** §236.51 o §236.1005 según aplique, no parafrasear.
4. **RETIE 2024 — Resolución 40117 del Ministerio de Minas y Energía:** aplicable a tableros y acometidas nuevas del SCC.

> [!IMPORTANT]
> **Doble candado de Sección 25.4 — citar SIEMPRE con precondiciones, NO afirmaciones absolutas:**
>
> - **§25.4(b):** *"En ningún caso el Concesionario ejecutará Obras y Equipos Complementarios sin la previa suscripción de la respectiva adición."*
> - **§25.4(f):** *"durante la Etapa Preoperativa no se podrán tomar recursos de la Subcuenta Excedentes ANI para estos efectos."*
> - **§9.12(b):** activación SOLO cuando una **Autoridad Estatal** (no "terceros" genéricos) exija licencia/permiso/modificación de Especificaciones Técnicas.
>
> **Formulación correcta en DT:**
> *"Cualquier modificación de las Especificaciones Técnicas exigida por Autoridad Estatal se tramitará por el cauce de las Secciones 9.12 y 25.4 del Contrato APP 001/2025, con sus respectivas precondiciones (suscripción previa de adenda y régimen de fondos aplicable conforme §25.4(f))."*
>
> **PROHIBIDO** decir: *"se tramitará como Obra Complementaria financiada al 100% por la ANI"* — esa afirmación absoluta es alucinación catalogada. La 25.4 NO promete 100% y tiene precondiciones de adenda + fondos.

**Prefijo canónico para DTs:** `ENRG`.

---

## 3. CIERRE OPERATIVO

- Verificar versión vigente del DBCD al momento de cualquier referencia. Si V003 está en circulación, NO instruir actualizar V002.
- Las DTs ENRG NO firman versionadas ("Sistema SICC vX.Y"). Firma corporativa: **"Dirección Técnica — Unidad Funcional 2"** + fecha.
- Sigla del sistema en cara externa: **SCC** (BCD v001), no "SICC" (colisión con SICC del AT4).
