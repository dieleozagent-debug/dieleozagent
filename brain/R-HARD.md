# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 1.2 | **Aplicación:** Todos los Agentes e Inferencia SICC
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis, auditoría o contexto de especialidad.

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO

**Valor:** $726.000.000 COP por locomotora
**Fuente:** WBS Oficial v3.0, Partida 6.1.100
**Regla:** Cualquier cifra superior es rechazo automático sin análisis.
**Términos bloqueados:** "2.5 MM USD", "2 MM USD", "2.5 millones", "USD 2,500,000"
**Nota:** WBS vigente es v3.0. Citar "v2.9" como única referencia es error de sistema.

---

## R-HARD-02 — FECHA MÍNIMA DE HITOS

**Fecha mínima absoluta:** 01-ago-2025 (Acta de Inicio)
**Fecha fatal:** 01-nov-2026 (vencimiento Fase de Preconstrucción)
**Fuente:** Sección 3.8(a)(i) + Acta de Inicio firmada
**Regla:** Ninguna acción, orden de compra ni hito puede preceder al 01-ago-2025.
Todo cronograma con entregas posteriores al 01-nov-2026 se rechaza por exposición a Sección 4.6 + Sección 16.8.

---

## R-HARD-03 — TECNOLOGÍAS EXCLUIDAS

Las siguientes tecnologías no existen en el alcance del proyecto y su mención en cualquier entregable es rechazo automático:

| ❌ Tecnología excluida | Motivo | Reemplazo correcto |
|------------------------|--------|--------------------|
| Microondas (torres) | Sobredimensionamiento no previsto en AT1 | Satelital + GSM/LTE vía SD-WAN |
| Contadores de ejes wayside | Auditoría Virtual elimina señalización física | GPS/GNSS + odometría embarcada |
| Catenaria | Proyecto es Diésel-Eléctrico | No aplica |
| Gateway lógico ITCS/Alstom | Vendor lock-in prohibido FRA 236 | Stop & Switch (hardware dual embarcado) |
| DWDM / G.655 / EDFA | Fuera de alcance AT3 | Fibra G.652.D |

---

## R-HARD-04 — ESTÁNDAR TECNOLÓGICO ÚNICO (PTC)

**Estándar:** FRA 49 CFR Part 236, Subparte I
**Fuente:** AT1 Capítulo V, Tabla 17
**Regla:** Este es el único estándar tecnológico vinculante para PTC. No existen estándares alternativos válidos en este proyecto.
**Términos bloqueados:** "TECNOPARTE 2001", "EN 50159 como estándar principal", "ETCS", cualquier norma europea como sustituto del FRA para el sistema de control.

---

## R-HARD-05 — METADATA Y TERMINOLOGÍA PROHIBIDA (PURGA LEGACY)

Cualquier output que contenga los siguientes elementos es rechazado automáticamente:

**Sellos y conceptos prohibidos:**
`Michelin Certified` | `Karpathy Loop` | `ciclo de sueño` | `Propuesta Soberana` | `DIANOMENTO` | `Enjambre` | `Peones` | `Alma del Agente` | `Soul` | `Soberana`

**Nomenclatura operativa prohibida:**
`[BLOCKER]` | `[SICC BLOCKER]` | `Veredicto del Asesor` | `Dreamer` | `peones` | `Expediente PEÓN`

**Contratos, normas y entidades inexistentes:**
`Contrato L1` | `TECNOPARTE 2001` | `Cláusula N-1` | `Protocolo N-1` | `Deducción N-1` | `Supabase vinculante` | `RAG-First` | `Tren LFC2` | `WBS v2.9` (usar v3.0)

**Ubicación CCO:**
- **Válida:** La Dorada, Caldas (**PK 201+470**).
- **Prohibida:** Cualquier mención a Santa Marta (PK 0+000) o Barrancabermeja como ubicación del CCO del Proyecto LFC2 es causa de rechazo por impureza/legacy.

---

## R-HARD-06 — JERARQUÍA DOCUMENTAL Y GOBERNANZA TÉCNICA

Orden de prelación innegociable (Sección 1.2(d) + AT3). Ver detalle en [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md).

| Nivel | Documento |
|-------|-----------|
| 1 | Contrato de Concesión APP No. 001 de 2025 |
| 2 | Apéndice Técnico 1 (AT1) |
| 3 | Apéndice Técnico 3 (AT3) |
| 4 | Documento de Bases y Criterios de Diseño (DBCD) |
| 5 | Normas Técnicas Adoptadas (AREMA > FRA > AAR > UIC) |
| Vinculante externo | Resolución 20243040046045 (Surcos) + Política FENOCO Art. 20 Num. 9 |
| 16 — NO vinculante | Pliego, adendas, Q&A SECOP |

**Regla de Desempate (Prelación Técnica):** AREMA > FRA > AAR > UIC.

---

## R-HARD-07 — OBLIGACIÓN TAXATIVA EMBARCADA

La instalación de equipos a bordo del Material Rodante es una obligación principal irrefutable.
- Sección 3.1(a)(ii): Objeto del contrato incluye Puesta a Punto.
- AT1 Cap. V, Num. 5.1: Instalación de equipos de control a bordo.
- Apéndice Financiero 4: Amortización del 100% por la ANI.

---

## R-HARD-08 — INDICADORES AT4: TIEMPOS DE RESPUESTA

**Fuente:** Apéndice Técnico 4 (AT4)
**EL2 (Energía):** Grupo electrógeno activo en < **2 minutos** en el **100%** de los eventos.
**COM1 (Comunicaciones):** Restablecimiento en < **1 minuto**.
**E3 (Software):** Disponibilidad mensual ≥ 99.0% (SOLO para software, NO para hardware).

---

## R-HARD-09 — FLOTA REAL DEL PROYECTO

**Flota válida:**
- Locomotoras **GR12** (Nación)
- Locomotoras **U10** (Nación)
- Locomotora **U18** (Factor de Calidad - Concesionario)

---

## R-HARD-10 — CANTIDADES CERRADAS: PASOS A NIVEL (PaN)

**Cantidades bloqueadas:**
- **9** Pasos a Nivel Tipo C (automáticos)
- **15** Pasos a Nivel Tipo B (manuales)
- **122** Pasos a Nivel Tipo A
---

## R-HARD-12 — INTEGRIDAD OPERATIVA DE LA UF2
- **Mandato:** La entrada en operación del sistema centralizado PTC/CTC corresponde a la culminación integral de la **Unidad Funcional 2 (UF2)**.
- **Prohibición:** Se prohíbe el fraccionamiento operacional del sistema. La sectorización por UFVF (Unidad Funcional de Vía Férrea) es exclusivamente para fines de localización e inventario, NO para entregas operativas parciales.
- **Fuente:** DBCD v14.0 Sección 3.3 y 3.4.

---

## R-HARD-13 — ALCANCE ESTRICTO Y ANTI-SCOPE CREEP
- **Mandato Carga:** El alcance del Proyecto LFC2 es exclusivamente para **transporte de carga** (64 km/h, 914mm). Está estrictamente PROHIBIDO justificar diseños, parámetros o tolerancias basándose en estándares de trenes de pasajeros (ej. 96 km/h).
- **Mandato Jerarquía:** La normativa NEMA y el reglamento RETIE aplican exclusivamente a **envolventes y protección electromecánica** (tableros, gabinetes). NUNCA deben igualarse en jerarquía a FRA 49 CFR Part 236 ni AREMA para la lógica vital de control de trenes y enclavamientos.
- **Penalidad:** Cualquier Output que viole este alcance será rechazado de inmediato y marcado como Impureza (Scope Creep).

---

## R-HARD-11 — REDES Y COMPATIBILIDAD ELECTRÓNICA (EMC)

**Fuente:** Apéndice Técnico 3 (AT3)
**Redes IP**: Cumplimiento obligatorio de **IEEE 1100, 802.3 (z/u/an/x), 802.1 (Q/p/D/w/X)**.
**Seguridad de Red**: **EN 50159 Categoría 3** para transmisión en redes abiertas (Satelital/Celular).
**EMC**: **CISPR 22:2008** y **CISPR 24:2010**.
**Fibra**: Únicamente **ITU-T G.652.D**.

---

## CÁNON DE CITACIÓN OBLIGATORIA
`[Documento] → [Capítulo] → [Sección/Numeral] → [Literal] → [Texto literal]`
