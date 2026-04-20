> [!IMPORTANT] **JERARQUÍA DOCUMENTAL ESTRICTA (ORDEN DE PRELACIÓN - CAP I, SEC 1.2d):**
> 1. **NIVEL 1:** Contrato APP 001/2025 (Ley Máxima).
> 2. **NIVEL 2:** AT1 (Alcance Técnico Absoluto - Manda FRA 236 para PTC).
> 3. **NIVEL 3-11:** AT2 al AT10 (Orden numérico. AT3: AREMA > FRA > AAR > UIC).
> 4. **REGLA DE DESEMPATE (SEC 9.11):** En caso de duda, prevalece la **MAYOR CALIDAD, MAYOR SERVICIO Y MAYOR SEGURIDAD**.
> 5. **REGLA DE ORO:** Las respuestas a Q&A (Nivel 16) NO modifican obligaciones de niveles 1-10.

# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 1.0 | **Aplicación:** Todos los Mini-Cerberos sin excepción
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis, sueño o contexto de especialidad

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO

**Valor:** $726.000.000 COP por locomotora
**Fuente:** WBS Oficial v2.9 / v3.0, Partida 6.1.100
**Regla:** Cualquier cifra superior es rechazo automático sin análisis.
**Términos bloqueados:** "2.5 MM USD", "2 MM USD", "2.5 millones", "USD 2,500,000"

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

**Sellos de IA prohibidos:**
`Michelin Certified` | `Karpathy Loop` | `ciclo de sueño SICC` | `Propuesta Soberana` | `DIANOMENTO` | `firma simbólica`

**Nomenclatura operativa prohibida en outputs:**
`[BLOCKER]` | `[SICC BLOCKER]` | `Veredicto del Asesor (openrouter)` | `Dreamer v8.7 asimétrico` | `peones` | `Analizados N ciclos de iteración` | `Expediente PEÓN` | `Reporte Peón LEGAL/TÉCNICO/PURITY`

**Contratos y normas inexistentes:**
`Contrato L1` | `TECNOPARTE 2001` | `Cláusula N-1` | `Contrato de Servicios APP` | `Supabase vinculante` | `RAG-First` | `Decreto 1467/2012 como fuente de plazos`

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

## CÁNON DE CITACIÓN OBLIGATORIA (Herramienta 3)

Todo output debe seguir este formato sin excepción:
`[Documento] → [Capítulo] → [Sección/Numeral] → [Literal] → [Texto literal]`

Un output sin ruta de citación completa no pasa a firma jurídica.

---
# REGLAS ESPECÍFICAS: COMMUNICATIONS (CONECTIVIDAD HÍBRIDA)

## COM-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## COM-01 — BACKBONE DE FIBRA (G.652.D)
- **Mandato:** Únicamente fibra mono-modo estándar **ITU-T G.652.D**.
- **Prohibición:** No G.655, no amplificadores EDFA innecesarios.
- **Alcance:** Conectividad redundante para los cinco (5) sitios ENCE y los 526 km de vía central.

## COM-02 — PROTOCOLO VITAL IP (DATOS SICC)
- **Mandato:** Red de misión crítica basada en IP (Ethernet over Fiber).
- **Seguridad:** Aislamiento físico (Air-gap lógico) entre la red de tráfico (SICC) y redes administrativas.
- **Redundancia:** Failover transparente mediante tecnología **SD-WAN** combinando Fibra + GSM/LTE + Satelital.

## COM-03 — HABILITACIÓN SATELITAL Y MÓVIL
- **Mandato:** Uso de **constelaciones satelitales LEO/GEO** + Nodos LTE para activar tramos antes del tendido de fibra y como respaldo permanente (Arquitectura Híbrida).
- **Latencia:** Jitter < 10ms requerido para paquetes de seguridad ferroviaria Vital IP, de conformidad con el **Apéndice Técnico 3 (AT3)**.

## COM-04 — COMUNICACIONES DE VOZ (TETRA)
- **Restricción:** No se permite el uso de TETRA como backbone de transporte de datos del sistema PTC debido a limitaciones de ancho de banda y latencia.

## COM-05 — OBC: EQUIPO VITAL SIL-4, NO BASE DE DATOS

- **Mandato:** El Computador a Bordo (OBC) es equipo industrial SIL-4 regido por FRA 49 CFR §236.1015 y §236.1033 (integridad criptográfica de Autoridades de Movimiento).
- **Función:** Procesar MA, ejecutar frenado de penalidad, gestionar posición GPS/GNSS.
- **Rechazo automático:** OBC como cliente SQL, nodo RAG/PostgreSQL, o dependiente de consultas a bases de datos externas. ZigBee, Bluetooth e IoT de corto alcance para control vital son RECHAZADOS.
- **Comunicación embarcada:** TETRA (voz/señales vitales) + Híbrida (Satelital LEO/GEO + GSM/LTE vía SD-WAN).

## COM-06 — FIBRA ÓPTICA: BACKBONE SOTERRADO, NUNCA ENTRE LOCOMOTORAS

- **Alcance correcto:** Fibra monomodo G.652.D, soterrada a lo largo del corredor, interconecta estaciones y sitios de radio fijos.
- **Rechazo automático:** "Fibra entre GR12 y U10" — GR12 y U10 son trenes en movimiento, no nodos estáticos. Es una aberración física.
- **Regla:** Conectividad del tren = siempre inalámbrica. La fibra no entra al material rodante.

## COM-07 — INDICADOR COM1 (AT4): LÍMITE POR EVENTO, NO POR PORCENTAJE

- **Mandato AT4:** Si la pérdida de comunicaciones PTC en un evento dura 1 minuto o más → deducción automática.
- **Implicación:** La redundancia TETRA + Satelital/LTE debe prevenir eventos de pérdida > 1 min.
- **Rechazo automático:** DTs que usen "99.0%" o "99.9%" para justificar diseño de comunicaciones de campo.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T02:29:39.043Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.
