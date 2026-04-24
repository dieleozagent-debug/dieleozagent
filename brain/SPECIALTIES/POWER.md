> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025.
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1).
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3).
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: POWER (ENERGÍA HÍBRIDA) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios técnicos y normativos que rigen el suministro de energía para los sistemas de señalización y comunicaciones del Corredor La Dorada – Chiriguaná (APP No. 001 de 2025), garantizando cumplimiento con RETIE y NSR-10.

---

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
- **Regla:** Todo hito posterior a esta fecha será RECHAZADO por exposición a penalidades de la Sección 4.6 y 16.8.
- **Fuente:** Sección 3.8(a)(i) + Acta de Inicio (01-ago-2025).

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** La Dorada, Caldas (**PK 201+470**). Cualquier mención a Santa Marta, Barrancabermeja o PK 0+000 como CCO del Proyecto LFC2 es un error de sinapsis.

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe estrictamente el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`, `Veredicto del Asesor`.

---

# REGLAS ESPECÍFICAS: POWER (ENERGÍA HÍBRIDA)

## PWR-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## PWR-01 — RED VITAL DE POTENCIA (SIL-4)
- **Mandato (ENCE, PTC, PaN, CCO):** Tensión de **110V DC**. Autonomía mínima de UPS de **cuatro (4) horas**. Margen de diseño: +20% sobre carga pico.
- **Mandato (TETRA):** Tensión de **48V DC** conforme a ETSI 300.132-2. Autonomía mínima de UPS de **24-48 horas**.
- **Fuentes:** Red comercial + Fotovoltaica (Paneles) + Generadores de respaldo (Transferencia < 2 min - EL2).

## PWR-02 — GESTIÓN EFICIENTE Y PROTOCOLOS ABIERTOS
- **Mandato:** Prohibición absoluta de sobredimensionamiento. Uso obligatorio de baterías de **Litio de alta densidad** para reducción de huella constructiva.
- **Telemetría:** El monitoreo remoto via Red Vital IP debe utilizar **protocolos abiertos e interoperables** (conforme a AT1 Tabla 17 y FRA 236). Se prohíben protocolos propietarios que generen dependencia de proveedor (*vendor lock-in*).

## PWR-03 — RESTRICCIÓN DE ALCANCE (CERO CATENARIAS)
- **Mandato:** La infraestructura eléctrica está destinada exclusivamente a enclavamientos, comunicaciones y control SICC.
- **Prohibición:** El corredor es Diésel-Eléctrico. Todo diseño o presupuesto que incluya catenarias o infraestructura para electrificación de trenes es **RECHAZADO AUTOMÁTICO**.

## PWR-04 — INDICADOR EL2: TIEMPO, NO PORCENTAJE

- **Mandato:** El Indicador EL2 del Apéndice Técnico 4 (AT4) NO establece un porcentaje de disponibilidad para la infraestructura de energía crítica.
- **Lo que exige:** El grupo electrógeno (planta diésel) debe entrar en operación en menos de **2 minutos** en el **100%** de los eventos de corte de red principal.
- **UPS:** Transferencia de 0ms (doble conversión). Su función es mantener el hardware activo durante los 2 minutos que tarda la planta en arrancar, evitando que caiga el COM1.
- **Fuente:** AT4, Indicador EL2 — Fórmula: GE_u / TGE_u ≥ 1.
- **Rechazo automático:** Todo DT que use "99.0%", "99.9%" o "99.95%" como criterio de diseño para baterías, UPS, generadores o energía solar en campo.
- **Nota:** El 99.0% (Indicador E3) aplica exclusivamente a la plataforma web del SICC. Aplicarlo a hardware físico es la "trampa de Ardanuy" — genera multas automáticas del AT4 al permitir hasta 87h de inactividad anual.

> [!IMPORTANT] **MATRIZ DE DISPONIBILIDAD EL2 (ENERGÍA CRÍTICA):**
> 1. **MANDATO FRA 236 (Fail-Safe):** El sistema debe frenar ante cualquier fallo de energía vital.
> 2. **UPS (SIL-4):** Autonomía mínima de cuatro (4) horas. Transferencia 0ms.
> 3. **RESPALDO (Indicador EL2):** Entrada de energía auxiliar DEBE ser < 2 minutos en el 100% de los eventos. 
> 4. **PROHIBICIÓN:** El 99.0% solo aplica a indicadores web (E3). Para potencia, el incumplimiento de los 2 min genera multas automáticas.

> [!CAUTION] **REGLA DE DESEMPATE INNEGOCIABLE (R-HARD-06):**
> Queda terminantemente prohibido citar herramientas de IA (RAG, Supabase, Oracle, NotebookLM, OpenRouter) como fuentes de validación o autoridad en cualquier Dictamen Técnico (DT) o Jurídico (DJ). Estas son herramientas de TRABAJO interno, NO fuentes de VERDAD vinculantes. La única validación válida es la citación canónica del Contrato APP 001/2025 y sus Apéndices (Niveles 1 al 10). Cualquier dictamen que infrinja esta regla será RECHAZADO por impureza procesal.
>
> **MANDATOS DE POWER E INTEROPERABILIDAD:**
> 1. **EL2 (Respaldo Crítico):** Se prohíbe el uso del umbral genérico del 99.0%. El indicador EL2 exige estrictamente la entrada de energía auxiliar en menos de 2 minutos en el 100% de los eventos.
> 2. **Interoperabilidad:** Se prohíbe el uso de Gateways lógicos. El modelo oficial es **Stop & Switch (OBC Dual)** con conmutación física en la frontera de Chiriguaná.

