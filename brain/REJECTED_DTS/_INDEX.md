# 📛 Dictámenes Rechazados — Manifest Forense

**Fecha de creación:** 2026-05-08
**Razón:** los 3 DTs aprobados que el agente tenía en `brain/dictamenes/` fueron auditados manualmente por el Director Técnico UF2 y **rechazados con correcciones obligatorias** por contener alucinaciones del LLM. Se conservan acá como evidencia forense del fallo y para que el agente, al leer este directorio en el RAG, identifique los patrones a evitar en próximos ciclos `/audit`.

---

## DTs rechazados

### 1. `DT-SICC-2026-002` (especialidad EMBARCADO · primera versión)

**Veredicto del Director Técnico:** RECHAZADO – No procede emisión.

**Categorías de error:**
- **Loop literal del LLM:** 313 líneas de archivo, ~250 son repetición idéntica de `"We must not use..."` decenas de veces. El "DT" está embebido en scratchpad — nunca se separó la salida final.
- **Doctrinales:** flota OBC incompleta ("GR12 y U10" sin U18); Stop & Switch confundido con "arquitectura de hardware OBC dual"; scope-creep (mezcla wayside + backbone + interoperabilidad); emisión de DT sin conflicto de jerarquía documental.
- **Fundamento contractual fabricado:** AF4 "Amortización del 100% por la ANI" inventado; Sección 3.1(a)(ii) mutilada omitiendo "Operación y Mantenimiento"; "límite CAPEX por especialidad establecido en Contrato APP 001/2025" inexistente; SIL-4 mezclado con FRA Subpart I (correcto: CENELEC subordinado); CISPR 22/24 para embarcado (correcto: EN 50121-3-2); ITU-T G.652.D para enlaces de backbone en DT EMBARCADO (no aplica, es wayside).
- **Forma:** firma "Sistema SICC v14.6" en cara externa (versionado prohibido).

**Vacunas inyectadas:** `EMBARCADO.md` reescrito + `CONTRACTUAL_NORMATIVE.md` §4 + `_LOOP_GUARD.md` (commit `814ab78`).

---

### 2. `DT-ENRG-2025-001` (especialidad ENERGÍA)

**Veredicto del Director Técnico:** RECHAZADO con correcciones quirúrgicas obligatorias.

**Categorías de error:**
- **Graves bloqueantes:** "Obra Complementaria financiada al 100% por la ANI" (falsedad jurídica, viola §25.4(b) adenda previa + §25.4(f) régimen de fondos + §9.12(b) Autoridad Estatal); cita del **Checklist V3.5** (interno LFC) en Fundamento de DT (regla del formato lo prohíbe expresamente); "**detección de isla**" en Pasos a Nivel (alucinación semántica — anti-islanding es de generación distribuida fotovoltaica, no de PaN).
- **Doctrinales:** mandato químico LiFePO₄ en DT (patrón catalogado); autonomía absoluta 4h/48h fijada cuando son parámetros DBCD V002/V003 pendientes de no-objeción Interventoría (auto-imposición O&M 30 años).
- **Exactitud:** nombres ENCE truncados ("Pto. Berrío", "La Dorada" sin sufijos canónicos "–Grecia" y "–México"); instruir actualizar DBCD V002 cuando V003 está en circulación.

**Vacunas inyectadas:** `POWER.md` reescrito + `SIGNALIZATION.md` correcciones + `CONTRACTUAL_NORMATIVE.md` §1 expandida (doble candado §25.4) + `_LOOP_GUARD.md` (commit `7e16a40`).

---

### 3. `DT-EMBARCADO-2026-001` (especialidad EMBARCADO · segunda versión)

**Veredicto del Director Técnico:** APROBABLE con tres correcciones quirúrgicas obligatorias.

**Cualidades respecto a las dos anteriores:**
- ✅ Flota completa (GR12 + U10 + U18).
- ✅ Hardware Dual correcto (OBC LFC + OBC FENOCO).
- ✅ Stop & Switch ubicado como procedimiento operacional (no hardware).
- ✅ Procedencia doctrinal: aquí SÍ existe conflicto de jerarquía documental (AT1 + Resolución de Surcos Art. 5° vs eventuales exigencias FENOCO de gateway lógico).

**Errores que requieren corrección:**
- **G1: "100% ANI" — patrón ENDÉMICO repetido por TERCERA vez** ("deberán ser asumidos al 100% por la ANI"). En escenario incompatibilidad con sistemas de terceros (caso FENOCO), §9.11(b)(ii) asigna costo al **Concesionario**, no a ANI. Si firmas "100% ANI" y luego ANI invoca §9.11, te auto-perjudicas.
- **G2:** paráfrasis errada del Art. 5° Resolución de Surcos. Texto literal verificado del Art. 5°(1)(e): *"Compatibilidad con los sistemas de comunicación entre Material Rodante y centro de control, así como los sistemas de control activo en caso de que se encuentren instalados en la vía al momento de la solicitud"*. NO dice "se resuelve a bordo del tren". El escudo real es la condicionalidad temporal y de instalación (excluye sistemas privados de terceros como FENOCO que no están instalados al momento de la solicitud).
- **G3:** Sección 2.209 citada como "vinculante". §2.209 es **definición**, no obligación operativa. Vincula operativamente vía §12.4 (Asignación de Surcos) y demás secciones operativas que la invocan.
- **D2:** falta §9.11 como segundo pilar contractual para escenarios FENOCO. El agente solo cita 9.12/25.4; debe agregar §9.11 cuando el conflicto involucra sistemas de terceros.

**Vacunas inyectadas:** este commit. Versión corregida del DT está en el diagnóstico del Director Técnico — el agente debe regenerarlo aplicando las vacunas, no copiar la versión humana directamente.

---

## Doctrina general aplicable a próximos ciclos `/audit`

1. **No emitir DT** cuando los parámetros están pendientes de no-objeción Interventoría (cauce: DBCD).
2. **No emitir DT** cuando no hay conflicto de jerarquía documental real (cauce: ACC observation patrón `obs_snl.txt`).
3. **Sigla del sistema en cara externa: SCC** (BCD v001), no SICC (colisión con SICC del AT4).
4. **Citar siempre con precondiciones** §25.4(b) + §25.4(f) y §9.12(b) "Autoridad Estatal". Nunca "100% ANI" absoluto.
5. **Cita literal verificada** en campo `[Texto literal]` — paráfrasis = rechazo.
6. **Marco SIL-4 subordinado a FRA Subpart I**, no mezclado.
7. **Una especialidad por DT** — no scope-creep.
