# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 1.1 | **Aplicación:** Todos los Mini-Cerberos sin excepción
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis, sueño o contexto de especialidad

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO

**Valor:** $726.000.000 COP por locomotora
**Fuente:** WBS Oficial v3.0, Partida 6.1.100
**Regla:** Cualquier cifra superior es rechazo automático sin análisis.
**Términos bloqueados:** "2.5 MM USD", "2 MM USD", "2.5 millones", "USD 2,500,000"
**Nota:** WBS vigente es v3.0. Citar "v2.9" como única referencia es error de sinapsis.

---

## R-HARD-02 — FECHA MÍNIMA DE HITOS

**Fecha mínima absoluta:** 01-ago-2025 (Acta de Inicio)
**Fecha fatal:** 01-nov-2026 (vencimiento Fase de Preconstrucción)
**Fuente:** Sección 3.8(a)(i) + Acta de Inicio firmada
**Regla:** Ninguna acción, orden de compra ni hito puede preceder al 01-ago-2025.
Todo cronograma con entregas posteriores al 01-nov-2026 se rechaza por exposición a Sección 4.6 + Sección 16.8.
**Términos bloqueados:** Cualquier fecha anterior a "01/08/2025" en columnas de "plazo" o "orden de compra"

---

## R-HARD-03 — TECNOLOGÍAS EXCLUIDAS

Las siguientes tecnologías no existen en el alcance del proyecto y su mención en cualquier entregable es rechazo automático:

| ❌ Tecnología excluida | Motivo | Reemplazo correcto |
|------------------------|--------|--------------------|
| Microondas (torres) | Sobredimensionamiento no previsto en AT1 | Satelital + GSM/LTE vía SD-WAN |
| Contadores de ejes wayside | PTC Virtual elimina señalización física | GPS/GNSS + odometría embarcada |
| Catenaria | Proyecto es Diésel-Eléctrico | No aplica |
| Gateway lógico ITCS/Alstom | Vendor lock-in prohibido FRA 236 | Stop & Switch (hardware dual embarcado) |
| DWDM / G.655 / EDFA | Fuera de alcance AT3 | Fibra G.652.D |

---

## R-HARD-04 — ESTÁNDAR TECNOLÓGICO ÚNICO

**Estándar:** FRA 49 CFR Part 236, Subparte I
**Fuente:** AT1 Capítulo V, Tabla 17
**Prelación:** Nivel 2 (Sección 1.2(d))
**Regla:** Este es el único estándar tecnológico vinculante para PTC. No existen estándares alternativos válidos en este proyecto.
**Términos bloqueados:** "TECNOPARTE 2001", "EN 50159 como estándar principal", "ETCS", cualquier norma europea como sustituto del FRA

---

## R-HARD-05 — METADATA Y TERMINOLOGÍA PROHIBIDA

Cualquier output que contenga los siguientes elementos es rechazado automáticamente sin análisis de contenido:

**Sellos de IA prohibidos (solo en el texto de respuesta final):**
`Michelin Certified` | `Karpathy Loop` | `ciclo de sueño SICC` | `Propuesta Soberana` | `DIANOMENTO` | `firma simbólica`
*Nota: El uso de comandos técnicos como /Dream o /estado es PERMITIDO y obligatorio para la ejecución, la prohibición aplica solo a la narrativa del output.*

**Nomenclatura operativa prohibida en outputs:**
`[BLOCKER]` | `[SICC BLOCKER]` | `Veredicto del Asesor (openrouter)` | `Dreamer v8.7 asimétrico` | `peones` | `Analizados N ciclos de iteración` | `Expediente PEÓN` | `Reporte Peón LEGAL/TÉCNICO/PURITY`

**Contratos, normas y entidades inexistentes:**
`Contrato L1` | `TECNOPARTE 2001` | `Cláusula N-1` | `Protocolo N-1` | `Deducción N-1` | `Contrato de Servicios APP` | `Supabase vinculante` | `RAG-First` | `Decreto 1467/2012 como fuente de plazos` | `Artículo 12.1` (de seguros) | `DII` (Dirección de Infraestructura Intérpreta) | `sicc-rag-match.js` (como validador) | `Soberano de la Aprobación` | `Tren LFC2` | `WBS v2.9` (como única referencia — usar v3.0)

**Tecnologías prohibidas adicionales:**
`ZigBee para control de trenes` | `PostgreSQL/RAG como lógica de OBC` | `fibra óptica entre locomotoras en movimiento`

---

## R-HARD-06 — JERARQUÍA DOCUMENTAL (SECCIÓN 1.2(d))

Orden de prelación innegociable. Sin excepciones.

| Nivel | Documento |
|-------|-----------|
| 1 | Contrato de Concesión APP No. 001 de 2025 |
| 2 | Apéndice Técnico 1 (AT1) |
| 3–10 | Apéndices Técnicos 2 al 10 |
| Vinculante externo | Resolución 20243040046045 (Surcos) + Política FENOCO Art. 20 Num. 9 |
| 16 — NO vinculante para modificar 1–10 | Pliego, adendas, Q&A SECOP |
| ❌ Inexistente | Supabase, RAG, bases vectoriales, openrouter |

---

## R-HARD-07 — OBLIGACIÓN TAXATIVA EMBARCADA (NO NEGOCIABLE)

La instalación de equipos a bordo del Material Rodante es una obligación principal irrefutable. Ningún output puede negarla.

**Tres fuentes simultáneas — Niveles 1 y 2:**
- Sección 3.1(a)(ii): objeto del contrato incluye Puesta a Punto
- Sección 2.201: suministro, instalación, pruebas del Material Rodante
- AT1 Cap. V, Num. 5.1: "instalación de equipos de control a bordo en el Material Rodante Tractivo"

**Recuperación garantizada:** Apéndice Financiero 4, Cap. I, Num. (ii)(a) — ANI amortiza el 100% de los equipos embarcados.

**Regla:** Todo output que declare esta obligación como "no contemplada", "adicional" o "incoherente" es rechazo automático con BLOCKER inválido.

---

---

## R-HARD-08 — INDICADORES AT4: DISPONIBILIDAD POR TIEMPO, NO POR PORCENTAJE

**Fuente:** Apéndice Técnico 4 (AT4) — Indicadores EL2, COM1 y E3
**Regla maestra:** El 99.0% de disponibilidad aplica ÚNICA Y EXCLUSIVAMENTE al software web del SICC (Indicador E3). Para infraestructura crítica de campo, el AT4 mide por tiempo de evento, no por porcentaje anual.

| Indicador AT4 | Aplica a | Exigencia | Consecuencia de incumplimiento |
|---|---|---|---|
| **E3** (99.0%) | Plataforma web / software SICC | Disponibilidad mensual ≥ 99.0% | Deducción leve |
| **EL2** | Energía de respaldo en campo | Grupo electrógeno activo en < **2 minutos** en el **100%** de los eventos | Deducción automática por evento |
| **COM1** | Comunicaciones PTC en campo | Pérdida de comunicación en un evento < **1 minuto** | Deducción automática por evento |

**Regla de rechazo:** Todo DT que cite "99.0%" o "99.9%" para hardware de campo (baterías, UPS, radios, equipos PTC) es RECHAZADO. El parámetro correcto son los tiempos del EL2 y COM1.
**Principio FRA:** Fail-Safe — ante fallo de energía o comunicaciones, el tren frena. Eso no exime al Concesionario de las multas del AT4.

---

## R-HARD-09 — FLOTA REAL DEL PROYECTO (MATERIAL RODANTE)

**Fuente:** AT1 Cap. V, Num. 5.1 + Sección 2.101 (Factor de Calidad)
**Flota válida:**
- Locomotoras **GR12** (propiedad de la Nación)
- Locomotoras **U10** (propiedad de la Nación)
- Locomotora **U18** (Factor de Calidad aportado por el Concesionario)

**Regla:** La mención a "Tren LFC2" como flota a fabricar o asegurar es rechazo automático — esa flota no existe en el alcance del Contrato. La obligación de "Puesta a Punto" es instalar equipamiento electrónico a bordo de GR12, U10 y U18. No se fabrica ningún tren nuevo.

---

## R-HARD-10 — CANTIDADES CERRADAS: PASOS A NIVEL (PaN)

**Fuente:** AT1 + WBS v3.0, Capítulo 4
**Cantidades bloqueadas e inamovibles:**
- **9** Pasos a Nivel Tipo C (automáticos)
- **15** Pasos a Nivel Tipo B (manuales)
- **122** Pasos a Nivel Tipo A

**Regla:** No existe "auditoría de cantidades de pasos a nivel". Los Pasos a Nivel son intersecciones viales-férreas (barreras, señales), NO componentes de locomotoras. Mezclar PaN con material rodante en un mismo DT es rechazo automático. Cualquier PaN adicional exigido por la Interventoría = Obra Complementaria pagada por el Estado.

---

## CÁNON DE CITACIÓN OBLIGATORIA (Herramienta 3)

Todo output debe seguir este formato sin excepción:
`[Documento] → [Capítulo] → [Sección/Numeral] → [Literal] → [Texto literal]`

Un output sin ruta de citación completa no pasa a firma jurídica.
