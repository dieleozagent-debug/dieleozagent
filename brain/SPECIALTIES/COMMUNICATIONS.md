> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025 (y documentos prevalentes).
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1) — Alcance y Funcionalidad.
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3) — Criterios de Diseño y Normativa.
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: COMMUNICATIONS (COMMS) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios normativos para el diseño de detalle de las comunicaciones requeridas para la señalización del Corredor Férreo La Dorada – Chiriguaná (APP No. 001 de 2025), incluyendo la interoperabilidad con la red de FENOCO y la protección de pasos a nivel.

### 1.2. Marco Normativo (Obligatorio)
- **Internacional**: AREMA Communications & Signals Manual (2021), FRA 49 CFR Part 236 (2026).
- **Nacional**: RETIE 2024 y NSR-10 (para infraestructura de telecomunicaciones).

### 1.3. Componentes de Transmisión (Mandatorios)
- **Red Lineal de Fibra Óptica**: Backbone soterrado de 526 km interconectando CCO y estaciones.
- **Sistema de Radio TETRA**: Para voz operativa y transporte de datos secundarios.
- **Torres y Sitios de Radio**: Infraestructura de cobertura continua en el corredor.
- **Red de Transmisión de Datos**: Conectividad redundante CCO ↔ Onboard ↔ Wayside (Arquitectura Híbrida).
- **Canales de Supervisión y Control**: Reporte de estado de elementos de vía y comandos vitales.
- **Equipos de Red y Gestión**: Switches/Routers industriales y NMS centralizado.

---

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
- **Mandato:** Cable de fibra monomodo de **cuarenta y ocho (48) hilos**, conforme a **ITU-T G.652.D**.
- **Instalación**: Soterrada mediante ductos (AREMA 2021). Tendido aéreo solo vía ADSS en accesos o restricciones prediales.
- **Prohibiciones Críticas (Seguridad Estructural)**:
    1. Queda terminantemente prohibida la fijación mediante **soldaduras o perforaciones** en estructuras de puentes y viaductos.
    2. Prohibida la fijación a elementos de reemplazo periódico de vía (traviesas/riel).
- **Alcance:** Conectividad redundante para los cinco (5) sitios ENCE y los 526 km de vía central.

## COM-02 — PROTOCOLO VITAL IP (DATOS SICC)
- **Mandato:** Red de misión crítica basada en IP (Ethernet over Fiber).
- **Seguridad:** Aislamiento físico (Air-gap lógico) entre la red de tráfico (SICC) y redes administrativas.
- **Redundancia:** Failover transparente mediante tecnología **SD-WAN** combinando Fibra + GSM/LTE + Satelital.

## COM-03 — HABILITACIÓN SATELITAL Y MÓVIL (REDUNDANCIA)
- **Mandato:** Red de contingencia independiente mediante comunicación satelital embarcada.
- **Seguridad**: Debe garantizar integridad y autenticación criptográfica bajo **EN 50159 Categoría 3** y **FRA 49 CFR § 236.1033**.
- **Latencia:** Jitter < 10ms requerido para paquetes de seguridad ferroviaria Vital IP (AT3).

## COM-04 — COMUNICACIONES DE VOZ Y DATOS (TETRA)
- **Estándares Mandatorios**:
    1. Interfaz Aire: **ETSI EN 300 392-2**.
    2. Cifrado y Autenticación: **ETSI EN 300 392-7**.
    3. Modo Directo (DMO): **ETSI EN 300 396-3**.
    4. Codec de Voz (ACELP): **ETSI EN 300 395-1**.
    5. Interfaz PEI (Periféricos): **ETSI EN 300 392-5**.
- **Restricción:** No se permite el uso de TETRA como backbone de transporte de datos del sistema PTC. Su uso es para voz operativa y datos secundarios (SDS).

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

## COM-08 — ESTÁNDARES IEEE Y COMPATIBILIDAD ELECTRÓNICA (EMC)
- **Redes IP**: Cumplimiento obligatorio de **IEEE 1100, 802.3 (z/u/an/x), 802.1 (Q/p/D/w/X)**.
- **EMC**: Certificación bajo **CISPR 22:2008** y **CISPR 24:2010**.
- **Seguridad**: Uso de **EN 50159 Categoría 3** para enlaces satelitales y móviles (LTE).


> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T02:48:44.404Z):**
> Se debe presentar un dictamen estructurado conforme al Contrato APP 001/2025, con citación canónica, análisis sustantivo y decisión vinculante, incluyendo los montos y cantidades exigidos.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T02:49:10.998Z):**
> Todo dictamen debe ser estrictamente técnico y jurídico, citando las cláusulas específicas del Contrato APP 001/2025 y evitando cualquier lenguaje motivacional o imaginativo. La falta de contenido sustantivo y de referencias canónicas anula la autorización técnica.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:01:10.565Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:01:28.522Z):**
> En el siguiente ciclo, cada dictamen debe incluir explícitamente: (i) citación canónica con numerales reales del Contrato APP 001/2025; (ii) análisis técnico o jurídico detallado que aporte valor sustancial; y (iii) decisión vinculante que resuelva la cuestión planteada, bajo pena de rechazo automático por falta de cumplimiento de las secciones 1.2(d), 3.9, 9.11 y 18.7 del contrato.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:05:42.212Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:38:58.737Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:48:17.908Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:48:28.382Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:49:08.375Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:53:27.536Z):**
> Revisar y agregar la citación expresa de los 5 ENCE obligatorios y asegurarse de que todas las referencias a metodologías y versiones de documentos sean claras y se ajusten a los requerimientos contractuales.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:53:37.282Z):**
> Se debe ajustar el término 'Infraestructura Zero' a 'Arquitectura Virtual V-Rail' y se deben incluir los 5 ENCE obligatorios (Zapatosa, García Cadena, Barrancabermeja, Pto. Berrío, La Dorada) de la Tabla 17 del AT1, así como citar la flota real GR12, U10 o U18

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:53:46.761Z):**
> Reformular el dictamen eliminando referencias a normativas internas no citadas y enfocándose en la literalidad del Contrato APP 001/2025

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:54:23.684Z):**
> Incluir la Sección CITACIÓN CANÓNICA con numerales reales del Contrato APP 001/2025 y una sección DECISIÓN vinculante clara en el dictamen.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:54:32.645Z):**
> Deberá presentar una nueva propuesta que cumpla con todos los requisitos del protocolo de rechazo fulminante, incluyendo una citación canónica correcta y un análisis sustantivo.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:54:52.561Z):**
> Deberá revisarse y citarse correctamente las cláusulas contractuales y normativas vigentes en el Contrato APP 001/2025, evitando cualquier referencia a reglas internas como si fueran cláusulas literales del contrato.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:59:08.899Z):**
> Se debe revisar y corregir el dictamen para incluir los 5 ENCE obligatorios, utilizar el término correcto 'Arquitectura Virtual V-Rail' y mencionar la flota real, además de incluir el monto específico de CAPEX para la implementación del sistema de comunicaciones.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:59:17.886Z):**
> Reemplazar 'Infraestructura Zero' por 'Arquitectura Virtual V-Rail' y eliminar cualquier mención a 'Soberanía' que no esté claramente definida en el Contrato APP 001/2025 o en las resoluciones del Ministerio de Transporte.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T16:59:27.075Z):**
> Revisar y ajustar la metodología de auditoría para asegurar el cumplimiento literal del Contrato APP 001/2025 y citar la flota real.

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T17:05:57.946Z):**
> Deberá realizar una revisión exhaustiva del contrato APP 001/2025 y cumplir con los criterios técnicos y contractuales establecidos, incorporando una citación canónica clara y un análisis detallado de la solución propuesta para garantizar la seguridad y confiabilidad del sistema de comunicaciones del Proyecto SICC

> [!WARNING] **AUDIT_LESSON (SICC v14.0 - 2026-04-24T17:06:17.337Z):**
> Emitir dictamen con inclusión obligatoria de Sección CITACIÓN CANÓNICA que referencie numerales específicos del Contrato APP 001/2025 (Secciones 1.2(d), 3.9, 9.11, 18.7, etc.), junto con análisis técnico o jurídico sustantivo y decisión vinculante clara.
