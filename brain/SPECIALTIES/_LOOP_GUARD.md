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

Cualquier match en el cuerpo de DT publicable → abortar y re-generar.

---

**Generado por la Dirección Técnica LFC — v14.8 · 2026-05-08**
