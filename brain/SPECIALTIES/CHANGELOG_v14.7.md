# CHANGELOG — SPECIALTIES v14.6 → v14.7
**Fecha de emisión:** 30 de abril de 2026
**Autor doctrinal:** Dirección Técnica LFC — UF2

---

## 1. Resumen ejecutivo

Esta versión cierra **trece ajustes** identificados en auditoría forense de v14.6 contra el Contrato APP 001/2025, AT1, Resolución de Surcos y FRA 49 CFR Part 236. Los ajustes se distribuyen en cuatro críticos (CAPEX o doctrina), cinco de coherencia interna y cuatro de higiene/retractación. Adicionalmente se incorporan textos literales FRA suministrados como blindaje legal.

---

## 2. Ajustes Tier 1 — Bloqueantes

### 2.1 RETRACTACIÓN §236.202 → §236.1005(e)(2)(ii)
**Archivos afectados:** `ENCE.md`, `SIGNALIZATION.md`, `CONTRACTUAL_NORMATIVE.md`.
**Diagnóstico:** v14.6 vetaba "FRA 49 CFR §236.202 (Señales físicas laterales en desvíos fuera de ENCE)". Verificado contra el CFR oficial: §236.202 es "Signal governing movements over hand-operated switch" (Subpart B – Block Signal Systems), **no trata de señales laterales en general**. Es alucinación normativa.
**Cita correcta incorporada:**
> §236.1005(e)(2)(ii): *"A PTC system may allow a train to operate at a speed exceeding restricted speed over a switch in dark territory if the switch is equipped with a switch circuit controller that is monitored by the PTC system and the PTC system has confirmed that the switch is in the proper position."*

### 2.2 Eliminación de "Moving Block" como sinónimo de Cantonamiento Virtual
**Archivo afectado:** `ENCE.md`.
**Diagnóstico:** Moving Block es ETCS Nivel 3, arquitectura distinta no contratada. La equiparación abre puerta a exigencia de certificación ETCS L3.
**Corrección:** Reemplazado por **"Virtual Fixed Block bajo FRA 49 CFR §236.1005"** con prohibición explícita de equiparar a Moving Block.

### 2.3 Autonomía UPS: 24 h → 4 h
**Archivo afectado:** `POWER.md`.
**Diagnóstico:** v14.6 mandaba "autonomía mínima de 24 horas", contradiciendo el DT-INTG-2026-015 maestro que estableció 4 h alineadas con el MTTR. 24 h significa baterías ~6× más grandes, gabinetes ampliados, climatización adicional — over-engineering CAPEX.
**Corrección:** Bajada a **4 horas** con nota de retractación visible en el archivo.

### 2.4 Latencia round-trip ≤ 3 segundos
**Archivo afectado:** `COMMUNICATIONS.md`.
**Diagnóstico:** v14.6 no fijaba techo de latencia. Sin ese número, la Interventoría puede argumentar incompatibilidad satelital con PTC y exigir microondas terrestres.
**Corrección:** Incorporado **"Latencia round-trip admisible: hasta 3 segundos"** y texto literal §236.1033(f) sobre interrupciones no programadas.

---

## 3. Ajustes Tier 2 — Coherencia interna

### 3.1 Confirmación 64 hilos
**Archivo afectado:** `COMMUNICATIONS.md`.
**Estado:** Cifra ya estaba correcta en v14.6 ("exactamente 64 hilos G.652.D"). Ratificada en v14.7. **Nota para auditoría de dictámenes:** el DT-INTG-2026-015 maestro contiene una versión con "48 hilos" que debe homologarse a 64 al re-ingestar.

### 3.2 OTDR en tres ventanas (1310 / 1550 / 1625 nm)
**Archivo afectado:** `COMMUNICATIONS.md`.
**Diagnóstico:** v14.6 solo citaba 1625 nm. Las pruebas correctas son tres ventanas; sin las dos primeras, los empalmes pueden pasar con atenuación inaceptable en operación normal.
**Corrección:** Incorporadas las tres ventanas con justificación técnica.

### 3.3 PaN Tipo C con SIL-3 explícito
**Archivo afectado:** `SIGNALIZATION.md`.
**Diagnóstico:** v14.6 decía "Fail-Safe" genérico. Sin SIL explícito, la Interventoría puede exigir SIL-4, triplicando costo del controlador.
**Corrección:** Especificado **SIL-3 (Fail-Safe local)** para los 9 PaN Tipo C automáticos.

### 3.4 Naming completo de la flota
**Archivos afectados:** `CONTROL_CENTER.md`, `SIGNALIZATION.md`, `INTEGRATION.md`, `FINANCIAL_LEGAL.md`.
**Diagnóstico:** v14.6 decía solo "GR12, U10 y U18". La fórmula contractual completa por AT1 Cap. V es "GR12, U10 y U18 **(o equivalente por Factor de Calidad)**".
**Corrección:** Estandarizada la fórmula completa en las cuatro especialidades.

### 3.5 Naming completo de los 5 ENCE
**Archivos afectados:** `ENCE.md`, `POWER.md`, `FINANCIAL_LEGAL.md`.
**Diagnóstico:** Inconsistencia entre archivos: unos abreviaban ("Pto. Berrío", "La Dorada"), otros usaban sufijos ("Puerto Berrío–Grecia", "La Dorada–México"). La Tabla 17 del AT1 usa los sufijos.
**Corrección:** Unificada la nomenclatura larga con sufijos de PK en todas las especialidades.

---

## 4. Ajustes Tier 3 — Higiene y retractación

### 4.1 Purga de bloques `AUDIT_LESSON` repetidos
**Archivo afectado:** `COMMUNICATIONS.md`.
**Diagnóstico:** v14.6 contenía 24 bloques `> [!WARNING] AUDIT_LESSON ... Revisar mandatos.` repetidos con timestamps entre 2026-04-29 y 2026-04-30. Ruido del generador, no contenido normativo. Riesgo de contaminación de RAG.
**Corrección:** Eliminados todos los bloques.

### 4.2 Doctrina 9.12 sin 9.11 — refuerzo explícito
**Archivos afectados:** `CONTRACTUAL_NORMATIVE.md`, `FINANCIAL_LEGAL.md`.
**Diagnóstico:** v14.6 ya tenía la distinción correcta, pero faltaba prohibición explícita de invocarlas conjuntamente.
**Corrección:** Incorporado **veto explícito** de invocar 9.11+9.12 en cierres operativos. La cadena 9.12 → 25.4 es la única vía válida.

### 4.3 Verificación pendiente Sección 1.2(d)
**Archivo afectado:** `CONTRACTUAL_NORMATIVE.md`.
**Estado:** Mantenida la lista de Orden de Prelación con nota explícita de que la literalidad debe verificarse contra el Contrato antes de citarla a Interventoría.

### 4.4 Incorporación de textos literales FRA
**Archivos afectados:** `ENCE.md`, `COMMUNICATIONS.md`, `INTEGRATION.md`, `CONTRACTUAL_NORMATIVE.md`.
**Cambio:** Incorporados textos literales suministrados de:
- §236.1005(e)(2)(ii) — protección de cambiavías por PTC
- §236.0(c)(2) — sustitución legal del block signal system
- §236.1033(a) — habilitación de comunicaciones inalámbricas con integridad criptográfica
- §236.1033(f) — plan de mitigación priorizado para interrupciones

---

## 5. Pendientes para v14.8 (textos literales adicionales solicitados al otro agente)

- **§236.1003** — Definición legal de "Interoperability" (verdugo del Gateway)
- **§236.1029** — PTC system use and en route failures (escudo de latencia satelital)
- **§236.1015** — PTC Safety Plan (certificación de arquitectura virtual como SIL-4 equivalente)

Estos textos aún no están incorporados literalmente; cuando lleguen del otro agente, se incrustarán en `INTEGRATION.md`, `COMMUNICATIONS.md` y `CONTROL_CENTER.md` respectivamente.

---

## 6. Acciones operativas asociadas a la canonización de v14.7

1. **Mover** `brain/SPECIALTIES/*.md` v14.6 a `brain/dream/v14.6_<fecha>/` (cuarentena).
2. **Sobrescribir** `brain/SPECIALTIES/*.md` con los 8 archivos v14.7 + este CHANGELOG.
3. **Validar** lectura de los archivos por parte del agente.
4. **Purgar** `sicc_genetic_memory` (DT_CERTIFICADA + VEREDICTO_JUEZ — ambos tipos, total).
5. **Limpiar** `data/memory/AUDIT-*.md` y `data/memory/YYYY-MM-DD.md` de los últimos 7 días.
6. **Auditar** los 27 dictámenes en `brain/dictamenes/` contra v14.7 antes de re-ingestar.
7. **Re-ingestar** únicamente los dictámenes que pasen la auditoría contra v14.7.

---

**Documento generado en consolidación con la Dirección Técnica LFC — UF2**
**Sistema SICC v14.7**
