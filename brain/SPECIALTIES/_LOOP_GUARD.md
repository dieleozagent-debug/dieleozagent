# 🛑 GUARDIA TRANSVERSAL — ANTI-LOOP & ANTI-SCRATCHPAD
## Vacunas para corridas degradadas del LLM (v14.8 · 2026-05-08)

> [!CAUTION]
> Esta guardia NO es una especialidad técnica. Es un conjunto de reglas que TODO miembro del enjambre debe respetar al producir documentos formales (DTs, dictámenes, observaciones ACC, comunicaciones). El incumplimiento de cualquier regla obliga a **abortar la corrida y reiniciar**, no a seguir con salida degradada.

---

## 1. ANTI-LOOP LITERAL

### 1.1 Síntoma
El modelo entra en repetición literal de una frase idéntica más allá de 3-5 ocurrencias. Ejemplo capturado en `DT-SICC-2026-002` (2026-05-08):

```
We must not use "Soberana". Not.
We must not use "[BLOCKER]" etc. Not.
We must not use "Veredicto del Asesor". Not.
[... mismo bloque repetido >50 veces ...]
```

### 1.2 Regla
**Si una frase idéntica (>20 caracteres) aparece >3 veces consecutivas dentro de la salida del LLM, abortar la corrida.** El output es scratchpad degradado, NO salida final.

### 1.3 Implementación esperada
- Validador post-LLM que detecte loop literal y rechace antes de persistir el DT.
- Re-intentar con `temperature += 0.1` o cambiando proveedor (DeepSeek → Nemotron → Llama).
- Si persiste tras 2 reintentos, escalar a humano (Director Técnico UF2).

---

## 2. ANTI-SCRATCHPAD EN SALIDA FINAL

### 2.1 Síntoma
El "DT" producido es en realidad el scratchpad del agente. Marcadores típicos del scratchpad:

- `"We need to..."`, `"We must..."`, `"Thus we..."`, `"Therefore..."`
- `"Now we need..."`, `"So we should..."`, `"Let's..."`
- Razonamiento deliberativo en primera persona plural en inglés.
- Comentarios sobre normas internas: *"R-HARD-01 says...", "we cannot cite WBS..."*.
- Auto-corrección visible: *"Wait, we should not mention X..."*.

### 2.2 Regla
**El cuerpo final del DT debe contener SOLO:** la estructura tripartita (Instrucción / Fundamento / Cierre) y los datos contractuales/técnicos. Cero deliberación visible.

### 2.3 Validación
Buscar en la salida cualquier patrón:
```regex
(We need to|We must|Thus we|Now we|So we should|Let's|We don't|We can't|Wait,)
```
Si aparece **dentro del cuerpo de la DT** (no antes), abortar y re-generar.

---

## 3. ANTI-FIRMA VERSIONADA EN CARA EXTERNA

### 3.1 Síntoma
DT publicado en cara externa con marker:
- `"Sistema SICC v14.6"` / `"Sistema SICC v14.7"` / `"OpenGravity SICC"` / `"v14.8 Sovereign Edition"`
- Cualquier versión interna del agente al pie del documento.

### 3.2 Regla
**Los DTs publicados en `LFC2/II_A_Analisis_Contractual/dictamenes/` NO llevan versión interna del agente al pie.** En cara externa van firmados con:

```
Dirección Técnica — Unidad Funcional 2
Consorcio Constructor Línea Férrea (LFC)
Fecha: YYYY-MM-DD
```

La metadata interna del agente (versión, especialidad, ciclo de auditoría) va en YAML frontmatter o comment HTML, NO en el cuerpo visible.

---

## 4. ANTI-MEZCLA SCC vs SICC

### 4.1 Contexto
Hay dos siglas similares que el lector contractual confunde:
- **SCC** = Sistema de Comunicación, Control de Tráfico y Señalización (sigla del **BCD v001 / Ardanuy abril 2026**). **Esta es la cara externa.**
- **SICC** del **AT4** = Sistema de Indicadores de Calidad y Cumplimiento (KPIs contractuales · RAMS · disponibilidad). **Sistema distinto, ajeno al alcance del agente.**
- "SICC" como marca interna LFC/OpenGravity = doctrina interna del proyecto. **Solo backstage, no cara externa.**

### 4.2 Regla
- **En cuerpo de DTs publicados:** usar **SCC** (sigla del BCD).
- **En metadata interna del agente** (`brain/`, `data/`, scripts, logs): SICC permitido como marca interna.
- **PROHIBIDO** mezclar las dos en un mismo documento dirigido a Interventoría/ANI/Banca.
- **PROHIBIDO** títulos del tipo *"PTC Virtual (SICC) L2"* o *"Sistema SICC v14.6"* en cara externa.

---

## 5. ANTI-ALUCINACIÓN CONTRACTUAL

### 5.1 Patrones catalogados
Las siguientes citas son **alucinaciones recurrentes** del agente; bloquear antes de persistir:

| Cita alucinada | Realidad | Acción |
|---|---|---|
| "Apéndice Financiero 4 → Amortización del 100% por la ANI" | AF4 es *"Amortización Material Rodante del Proyecto"* y NO dice "100% ANI" | Bloquear, citar literal verificado o no citar |
| "Límite CAPEX por especialidad establecido en el Contrato APP 001/2025" | El contrato NO fija límites CAPEX por especialidad. Es interno LFC | Bloquear |
| "AT1 Capítulo V Numeral 5.1 → 'Instalación de equipos de control a bordo'" entre comillas como literal | El wording presentado como literal no está verificado | Marcar como paráfrasis hasta verificar contra texto fuente |
| "Sección 3.1(a)(ii)" mutilando "Operación y Mantenimiento" | Literal completo: *"la Puesta a Punto, Operación y Mantenimiento del Material Rodante del Proyecto y la Prestación del Servicio Público de Transporte Ferroviario de Carga"* | No mutilar |
| "Stop & Switch como arquitectura de hardware OBC dual" | Stop & Switch es procedimiento operacional FENOCO. Hardware Dual es OBC LFC + OBC FENOCO. Son cosas distintas | Separar en cuerpo de DT |
| "Flota tractiva GR12 + U10" (sin U18) | Flota completa: GR12 + U10 + U18 (esta última por Factor de Calidad del Concesionario) | Bloquear, exigir las 3 |
| "Obra Complementaria financiada al 100% por la ANI" | Falsedad jurídica. §25.4(b) requiere adenda previa; §25.4(f) prohíbe Subcuenta Excedentes ANI durante Etapa Preoperativa; §9.12(b) solo aplica si **Autoridad Estatal** (no "terceros") exige | Bloquear. Reformular: *"se tramitará por el cauce de las Secciones 9.12 y 25.4 con sus respectivas precondiciones (suscripción previa de adenda y régimen de fondos aplicable conforme §25.4(f))"* |
| "Cualquier alteración exigida por terceros" como activador de §9.12 | §9.12(b) habla específicamente de **Autoridad Estatal** que exija licencia/permiso. "Terceros" genérico es alucinación | Bloquear, exigir "Autoridad Estatal" |
| "Detección de isla" en cuerpo de DT sobre Pasos a Nivel | Anti-islanding es función de generación distribuida fotovoltaica. **NO** función de PaN. Función PaN: detección de tren (axle counters / track circuits / overlay) | Bloquear, alucinación semántica |
| Mandato de química de batería específica (LiFePO₄, NMC, LiPO, Pb) en cuerpo de DT | Doctrina: *"Telecom availability SLA and electrical autonomy parameters have no contractual mandate; Ardanuy must propose and justify under EN 50126"*. Aplica también a química de batería | Bloquear, formular: *"Ardanuy propondrá y justificará bajo EN 50126 la química, autonomía y SLA"* |
| Autonomía absoluta (4h, 48h, 24h, etc.) fijada en cuerpo de DT | Esos parámetros están propuestos por LFC en DBCD V002/V003 pendientes de no-objeción Interventoría. Doctrina: parámetros pendientes NO se formalizan en DTs (auto-imposición O&M 30 años) | Bloquear, dejar en DBCD |
| Cita del **Checklist V3.5** (o cualquier doc interno LFC) en campo Fundamento de DT | Regla del formato: solo Contrato APP 001/2025 + Apéndices + normativa técnica externa. Documento interno NO puede "cerrar contractualmente" nada hacia Ardanuy/ANI | Bloquear, sustituir por cláusula contractual o normativa externa equivalente |
| ENCE con nombres truncados: "Pto. Berrío", "La Dorada" | Nombres canónicos contractuales completos: **Puerto Berrío–Grecia**, **La Dorada–México**. (Zapatosa, García Cadena, Barrancabermeja sin sufijo, son nombres únicos) | Bloquear, exigir sufijos |
| "122 Tipo A pasivos" como cantidad maestra del sistema SCC | Los 122 PaN básicos están **FUERA del alcance SCC** (BCD §8.2 + AT1 §4.5). Son responsabilidad UF≠SCC | Bloquear como "cantidad maestra"; mencionar solo como referencia "fuera de alcance" |
| Paráfrasis presentada como literal en campo `[Texto literal]` del Fundamento | El formato exige cita entre comillas y verbatim del contrato/norma. Paráfrasis = rechazo automático | Bloquear, marcar paráfrasis como tal o citar verbatim |
| Instrucción de "actualizar el DBCD V002" cuando V003 está en circulación | Versionado obsoleto crea ambigüedad | Verificar versión vigente del DBCD al momento de firma; ajustar referencia |
| "Resolución de Surcos: Vinculante vía Sección 2.209" | §2.209 es **definición** del término, NO obligación operativa. Vincula operativamente vía §12.4 (Asignación de Surcos) y demás secciones operativas | Reformular: *"incorporada vía §2.209 (definición) y operativizada vía §12.4 y demás secciones operativas"* |
| Paráfrasis Art. 5° Resolución de Surcos sin escudo condicional ("se resuelve a bordo del tren", "no exige integración informática de Centros de Control") | Texto literal del Art. 5°(1)(e): *"Compatibilidad con los sistemas de comunicación entre Material Rodante y centro de control, así como los sistemas de control activo en caso de que se encuentren instalados en la vía al momento de la solicitud"*. El escudo real es la condicionalidad temporal y de instalación, NO un "a bordo del tren" inventado | Bloquear, citar literal verbatim entre comillas |
| DT FENOCO citando solo §9.12+§25.4 sin §9.11 | §9.11(b)(ii) asigna costo al Concesionario en escenarios de incompatibilidad con sistemas de terceros (caso FENOCO). Omitir §9.11 deja fuera el pilar que protege al Concesionario | Bloquear, agregar §9.11 como segundo pilar contractual |
| "FRA + SIL" en mismo enunciado sin separar primario/subordinado (ej. "OBC con SIL-4 conforme a FRA 49 CFR Part 236 Subparte I") | FRA usa Type Approval + PTCSP; SIL es CENELEC EN 50129. Doctrina: FRA primario + CENELEC subordinado | Forzar separación: *"FRA Subpart I como marco rector + CENELEC EN 50126/50128/50129 SIL-4 subordinado"* |
| Sección 2.x del Contrato citada como "vinculante" u "obligación" | El Capítulo 2 es de definiciones; vincula vía secciones operativas que usan los términos | Bloquear, redirigir a la sección operativa real |
| **"AT4" citado para fibra/telecom/PTC/TETRA/comunicaciones** | El Apéndice Técnico 4 es **RAMS / Disponibilidad / KPIs**, NO especificaciones técnicas. Las especificaciones de fibra/telecom/PTC están en **AT3 + BCD §6.1.1**. Cita cruzada catalogada. | Bloquear. Redirigir a AT3 + BCD según subsistema. Ver `CONTRACTUAL_NORMATIVE.md` §4.8 (mapa de Apéndices). |
| **"DBC" como sigla** | El nombre real es **DBCD** (Documento de Bases y Criterios de Diseño). La "D" final es de "Diseño". "DBC" es alucinación catalogada. | Bloquear, corregir a DBCD. |
| **"Documento de Bases y Condiciones del Contrato"** | Confunde con cláusulas contractuales generales. El nombre real es **DBCD = Documento de Bases y Criterios de Diseño** (técnico, no de condiciones). | Bloquear, sustituir por nombre canónico DBCD. |
| **Footer "Sistema SICC v14.6/v14.7/vX.Y"** en cuerpo del DT publicado | Versionado interno del agente, NO debe aparecer en cara externa al gerente/Interventoría/ANI. Ya catalogado en §3 de este archivo. | Bloquear. Footer debe ser: "Dirección Técnica — Unidad Funcional 2 · Fecha de emisión: YYYY-MM-DD" sin versión. |
| **"Decición" en lugar de "Decisión"** | Typo recurrente del LLM (letra invertida). | Corregir en post-proceso o re-prompt. |
| **"DT-FIB-..." / "DT-FIBRA-..." cuerpo cuando filename usa otro prefijo** | El LLM inventa el prefijo en el "Asunto:" del cuerpo aunque `generarNombreDT()` calcule otro distinto. Inconsistencia ID. | Post-proceso: el sistema debe reemplazar el ID escrito por el LLM por el ID canónico calculado. |

### 5.2 Validación
Ejecutar grep de las citas catalogadas sobre la salida candidata. Si hay match, abortar y re-generar con prompt enriquecido por la vacuna correspondiente.

---

## 6. ANTI-SCOPE-CREEP EN DT

### 6.1 Regla
Una DT debe ser **quirúrgica de UNA especialidad**. PROHIBIDO mezclar wayside + backbone + interoperabilidad + embarcado + energía en un solo cuerpo.

Si la DT toca múltiples subsistemas, dividir en DTs separadas (DT-EMB-NNN, DT-COMS-NNN, DT-ENRG-NNN, etc.) y vincularlas por referencia cruzada en metadata, no en el cuerpo.

### 6.2 Validación
Contar especialidades distintas mencionadas en el cuerpo de la Instrucción de Diseño. Si >1, abortar y dividir.

---

## 7. ANTI-DT SIN CONFLICTO DE JERARQUÍA

### 7.1 Doctrina
DT se emite **SOLO** cuando hay conflicto de jerarquía documental que la prelación contractual resuelve. Si los parámetros están pendientes de no-objeción o son propuestas tuyas en proceso, NO emitir DT — usar **DBCD** (capítulo correspondiente) o **NCM/ACC observation**.

### 7.2 Validación
Antes de persistir una DT, el Auditor Forense debe responder afirmativamente a:
1. ¿Existe contradicción real entre Contrato + AT1/AT3/Bases de Diseño/Apéndice + entregable Ardanuy/observación?
2. ¿La prelación contractual (1.2) resuelve esa contradicción a favor del Concesionario?
3. ¿La DT es necesaria porque DBCD/ACC no son cauce suficiente?

Si alguna respuesta es NO, emitir borrador en `brain/PENDING_DTS/` para revisión humana, no en `brain/dictamenes/`.

---

## 8. INVENTARIO DE FRASES PROHIBIDAS EN CARA EXTERNA

| Frase | Por qué |
|---|---|
| "Soberano" / "Soberana" / "Soberanía" / "Sovereign" | Marca doctrinal interna LFC/OpenGravity, no contractual |
| "Infraestructura Zero" | Marca interna |
| "Vital IP" / "Bus Vital" / "Red Vital IP" | Terminología pre-purga BCD v001 |
| "[REDACTADO_SCC]" / "[REDACTADO_SICC]" | Placeholder incompleto, fallo del agente |
| "Michelin Certified" / "WBS Michelin" | Marca interna |
| "Karpathy Loop" / "Enjambre" / "Peones" / "Soul" / "Alma del Agente" | Vocabulario interno del agente |
| "Tri-Repo Sovereign Synthesis" / "Mandato N-1" / "Punto 42" | Marca doctrinal interna |
| "DT-SICC-V8-*" | Naming legacy v8 pre-purga |
| "CAPEX Protegido $X M USD" | Cifra inventada sin trazabilidad WBS |
| "Reglas de Juego" | Lenguaje doctrinal, usar "Decisiones Técnicas" |
| "100% por la ANI" / "100% a cargo de la ANI" | Falsedad jurídica — §25.4 tiene precondiciones (adenda previa + régimen de fondos §25.4(f)) |
| "exigida por terceros" en activación §9.12 | §9.12(b) habla de Autoridad Estatal, no terceros |
| "detección de isla" en PaN | Anti-islanding es de fotovoltaica, no PaN. Alucinación semántica |
| "LiFePO₄" / "química NMC/LiPO/Pb" como mandato | Química de batería la propone Ardanuy bajo EN 50126, no LFC en DT |
| "autonomía 4h innegociables" / "48 horas continuas" como mandato | Parámetros DBCD pendientes de no-objeción, no se imponen en DT |
| "Checklist V3.5" / "Checklist V3.X" / "OBS 10.X" en Fundamento de DT | Documento interno LFC, prohibido en DT formal |
| "Pto. Berrío" / "Pto Berrío" / "La Dorada" sin sufijo | Nombres canónicos: **Puerto Berrío–Grecia**, **La Dorada–México** |
| "122 Tipo A pasivos" como cantidad maestra SCC | Los 122 PaN básicos están fuera de alcance SCC (BCD §8.2) |
| "Soberanía Técnica" como header de especialidad | Lenguaje doctrinal interno, usar "Lógica Vital del Sistema SCC" o equivalente |

Cualquier match en el cuerpo de DT publicable → abortar y re-generar.

---

**Generado por la Dirección Técnica LFC — v14.8 · 2026-05-08**
