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
- **Regla:** Todo hito posterior a esta fecha será RECHAZADO por exposición a penalidades de la Sección 4.6 y 16.8.
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

# REGLAS ESPECÍFICAS: POWER (ENERGÍA HÍBRIDA)

## PWR-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## PWR-01 — RED VITAL DE POTENCIA (SIL-4)
- **Mandato:** De conformidad con el **Apéndice Técnico 4** del Contrato APP No. 001/2025 (Capítulo I, Numeral 2.1) y en concordancia con el **DBCD-v002 (Sección 8.3)**, el sistema UPS debe garantizar integridad **SIL-4** y una autonomía mínima de **cuatro (4) horas** de operación continua.
- **Fuentes:** Red comercial + Fotovoltaica (Paneles) + Generadores de respaldo (Transferencia < 2 min).

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

