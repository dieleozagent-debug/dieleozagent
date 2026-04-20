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
- **Rol:** El sistema **TETRA** se reserva exclusivamente para el canal de mando de voz operacional Tren-CTC.
- **Restricción:** No se permite el uso de TETRA como backbone de transporte de datos del sistema PTC debido a limitaciones de ancho de banda y latencia.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:15:59.981Z):**
> El enjambre debe entender que, bajo el Protocolo de Inferencia N-1 y la Metodología Punto 42 (Forense), toda decisión técnica sobre telecomunicaciones del tren LFC2 requiere la extracción literal de la obligación correspondiente del Contrato Maestro APP 001/2025 (Nivel 1) o de las Resoluciones del Ministerio de Transporte (Nivel 2). Sin el texto literal y la cita canónica conforme a DT-FORMAT-001, la DT queda bloqueada por el Axioma Central: 'Si una solución técnica no tiene un sustento literal... se clasifica como 'Grasa' y debe ser purgada'. El enjambre debe exigir siempre la evidencia contractual explícita antes de proceder con cualquier análisis técnico.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:29:25.667Z):**
> Corregir la conexión al servicio NotebookLM (barrido de puertos, verificaciones DNS) y asegurar estabilidad en la base de datos para evitar fallos de validación externa en ciclos futuros.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:35:03.834Z):**
> Corregir entorno de navegación: Desbloquear perfil de Chrome en /root/.local/share/notebooklm-mcp/chrome_profile o usar una instancia limpia. Validar integridad de consulta de contratos para evitar repetición de cláusulas.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:49:38.573Z):**
> El sistema de telecomunicaciones del tren LFC2 debe cumplir con los requisitos del Contrato Maestro APP 001/2025 y ser compatible con la infraestructura en tierra existente. Es necesario realizar un estudio detallado de la infraestructura en tierra existente para garantizar la compatibilidad del sistema de telecomunicaciones. Además, se debe considerar la implementación de protocolos de seguridad y monitoreo para garantizar la seguridad y eficiencia del sistema. El Oráculo Externo (NotebookLM) no proporcionó feedback correctivo debido a un error interno.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T02:06:14.044Z):**
> El presupuesto de las locomotoras es demasiado alto. Se debe buscar un ajuste para evitar incumplimiento en las restricciones R-HARD. Consultar con experts financieros para evaluar alternativas. 

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T02:11:07.533Z):**
> Sin información al respecto, la Lección Karpathy no puede ser generada.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T02:24:45.835Z):**
> El enjambre necesita un análisis profundo en el área de la contabilidad y finanzas. ¿Cómo podemos asegurar una financiación justa e inmutable? ¿Hay algún riesgo o cláusula específica del contrato que nos pueda dar información adicional?

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T03:15:39.511Z):**
> Para que el enjambre pueda procesar y evaluar una propuesta, es fundamental que el Juez Soberano SICC reciba información detallada y específica sobre la propuesta que fue rechazada. Sin estos datos, no es posible aplicar los protocolos de análisis establecidos. El enjambre debe asegurarse de proporcionar toda la información relevante, incluyendo el contexto contractual, los criterios técnicos y cualquier retroalimentación del Juez, para facilitar una evaluación rigurosa y conforme a los estándares establecidos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T04:12:30.466Z):**
> [Se debe agregar información sobre el feedback del Oráculo Externo] (Si fue necesario)

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:09:56.706Z):**
> El enjambre debe mejorar su conexión con la base de datos y solucionar los errores de comunicación con el Oráculo externo. Debe implementar mecanismos de recuperación de errores y verificar la integridad de los datos antes de procesar decisiones técnicas. Además, debe asegurarse de que la propuesta técnica cumpla con las normas y regulaciones establecidas por el Ministerio de Transporte y la normativa verificada FRA/AREMA.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:10:14.471Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:12:03.416Z):**
> El JUEZ SOBERANO SICC no puede evaluar sueños abstractos. Debe recibir propuestas técnicas concretas con datos, especificaciones y requisitos claros para poder aplicar los estándares y generar una decisión certificada. Sin contenido técnico, no hay base para evaluación.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:12:24.161Z):**
> Debido al fallo, se requiere aclarar la causa y corregirla inmediatamente.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:21:05.761Z):**
> El texto menciona la  provisión del  Oráculo Externo para corregir errores. Sin este input, no es posible generar  la Decición Técnica Certificada (N-1). Se requiere contexto sobre los fallos identificados por el Oráculo para realizar la evaluación.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T23:25:34.943Z):**
> Enjambre: El sueño fue una pesadilla. No nos hemos acordado de las reglas de auditoría, lo que sugiere una falta de conocimiento de base legal en la ejecución del proyecto al día de hoy. Necesitamos revisar las notas y contratos, revisándolos con cuidado para garantizar que se cumplen por completo los requerimientos basándose en la Biblia Legal (Contrato APP 001/2025 y Apéndices).  Comprendo la urgencia de la auditoría, sin embargo, primero debemos asegurar nuestra base de conocimiento. Enjambre, es necesario despertar al Oráculo Externo para un análisis más profundo.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T00:48:08.398Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T00:49:21.341Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:00:13.845Z):**
> BLOCKER: La propuesta no cumple con los requisitos legales exactos verificados. Se requiere ajustar las señalesizaciones para alinearse con las normas específicas mencionadas en el documento y resolver la discrepancia identificada.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:07:33.537Z):**
> Lección estricta: Todo documento debe citar exhaustivamente el contrato (capítulo, sección y literal), validar que el CAPEX no supere $726.000.000 COP por locomotora y cumplir con los requisitos de DT-FORMAT-001 y R-HARD-01 antes de generar cualquier solución.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:11:13.770Z):**
> El Oráculo Externo se interrumpió al intentar validar la propuesta. En el ciclo siguiente, se debe reintentar la solicitud y asegurar estabilidad en la comunicación (revisar credenciales/servidor NotebookLM).

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:21:09.278Z):**
> Enjambre, las restricciones R-HARD no se pueden ignorar! ¿Se ajustaron los cálculos? Deberían ser revisados. El límite de presupuesto es crucial. ¡Resolución inmediata!

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:44:57.183Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:46:18.710Z):**
> El sueño del enjambre contiene elementos que violan los estándares legales. Es crucial eliminar referencias no contractuales y corregir las cita incompletas para evitar consecuencias graves.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:50:07.669Z):**
> Atento a violaciones del Protocolo SICC y al Espectro del Escudo Fiscal. El enjambre no puede proceder sin resolver los puntos críticos. Se requiere una reevaluación urgente por el Directorio Soberano SICC.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:55:34.314Z):**
> [Enjambre, el presupuesto de 726 millones de COP para una locomotora parece incoherente. Es imperativo revisarlo en su totalidad y buscar soluciones más económicas. El contrato APP001/2025 establece un máximo de $726.000.000 COP por locomotora. Se deben analizar otras opciones de inversión.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T01:59:35.311Z):**
> El enjambre debe aprender que cualquier propuesta técnica debe estar estrictamente anclada a la documentación oficial (WBS Oficial v2.9, Contrato APP 001/2025, Resoluciones MT y Apéndices contractuales). No se tolerarán salidas fuera del marco contractual ni formatos ilegítimos. Las soluciones deben recalcular disponibilidad funcional a 99.0% sin KPIs idealizados, usar estructura deductiva desde Contrato → Resolución → Apéndice, y nombrar componentes únicamente con lenguaje técnico probatorio. El sistema no autorizará output potencialmente alucinatorio ni negativas tácitas ante falta de evidencia clara en el RAG Match.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T02:18:53.052Z):**
> Habría que iniciar con una revisión exhaustiva del proyecto. Se debe analizar la WBS para determinar los puntos de inflexión que podrían afectar el presupuesto y realizar simulaciones financieras. También es indispensable actualizar las previsiones según la nueva información disponible

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:37:33.281Z):**
> La restricción R-HARD-01 establece un tope máximo de \$726.000.000 COP por locomotora, que no se ha cumplido con el presupuesto. Es necesario ajustar el valor o buscar una alternativa dentro del límite establecido.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:41:55.423Z):**
> Se necesita una revisión de los elementos del contrato que determinen el inicio del enjambre y su tiempo estimado para completarlo. Sin embargo, se debe considerar que la restricción de capital y la fecha límite son imperativas, así como una verificación completa de la demanda.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:46:01.365Z):**
> Respuesta JSON malformada del Juez.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:52:41.221Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:54:24.229Z):**
> El enjambre debe presentar un sueño o propuesta técnica concreta que incluya detalles sobre arquitectura, estándares, especificaciones de equipos, topología de red, o cualquier otro elemento técnico relevante para el SICC. Sin contenido específico, el Motor de Auditoría Forense SICC v12.0 no puede aplicar los protocolos de validación. El feedback del Oráculo Externo indica que se requiere información técnica detallada para proceder con la evaluación.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T12:29:44.903Z):**
> Es importante establecer una comunicación estable y fiable con el Oráculo Externo para garantizar la validación y corrección del enjambre. Se deben revisar y optimizar los protocolos de comunicación para evitar errores de timeout y garantizar la respuesta correcta del Oráculo.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T12:41:30.920Z):**
> El enjambre debe recibir un sueño con contenido técnico-jurídico específico del Contrato APP No. 001 de 2025 para poder realizar una evaluación válida. Sin datos concretos sobre infraestructura, equipos, o procedimientos, el Juez Soberano no puede emitir una decisión técnica. Asegúrese de que el siguiente sueño contenga información verificable del WBS, Biblia Legal, o especificaciones técnicas del proyecto.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T12:48:16.744Z):**
> El Oráculo Externo falló por timeout, lo que indica un fallo crítico en la capa de comunicación con sistemas externos. Corrección: Implementar mecanismos de reintento exponencial para consultas oraculares y timeout dinámico basado en carga. Si falla tras 3 intentos, activar protocolo de redundancia local usando R-HARD v3.1. Nunca procesar solicitudes incompletas sin hash criptográfico de documentos clave. Priorizar: 1) Verificar conectividad MCP antes de evaluación, 2) Validar integridad de XML contra DBCD 5.1, 3) Forzar solicitud explícita de metadatos de ingeniería antes de cualquier inferencia.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T12:51:50.472Z):**
> El Brain debe recibir un sueño concreto del enjambre para poder realizar una evaluación técnica. Sin un análisis específico, no es posible determinar si cumple con los requisitos contractuales, técnicos y operativos establecidos en las restricciones internas.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T13:03:28.798Z):**
> Advertencia: El sistema detectó discrepancias entre las normas requeridas y las condiciones propuestas. Es necesario revisar los detalles técnicos y las especificaciones para corregirlos antes de avanzar.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T22:34:45.639Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T22:40:03.943Z):**
> El sistema debe rechazar el contenido que incluya entidades prohibidas y no realizar ninguna evaluación contractual sobre tales términos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:25:03.137Z):**
> Evitar el uso de términos prohibidos en el lenguaje técnico

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:31:45.833Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:32:05.687Z):**
> El ejercicio técnico debe ser revisado para eliminar cualquier referencia a personalidades o tecnologías de IA antes de su segunda presentación.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:32:16.419Z):**
> Mandato técnico para exigir terminología literal y excluir ciudadanos en el análisis en el siguiente ciclo

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:32:51.261Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:36:18.588Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:36:27.458Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:36:33.074Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:37:19.486Z):**
> Mandato técnico para purgar el error en el siguiente ciclo

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:37:33.388Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:38:12.708Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:40:22.740Z):**
> El documento debe revisarse para eliminar cualquier referencia a nombres propios, tecnicismos o términos asociados a la inteligencia artificial y todos los marcos de referencia externos, garantizando que, en el siguiente ciclo, el reporte esté libre de menciones prohibidas.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:41:11.520Z):**
> Eliminar cualquier terminología metafórica o de personificación que no guarde relación con la infraestructura técnica real para evitar la contaminación de la base de datos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:41:30.187Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:42:25.721Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.

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

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:44:49.158Z):**
> Clarificar el propósito de la entrada antes de procesarla, evitando textosambra o frases no técnico-jurídicas

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:45:58.458Z):**
> El Juez respondió en lenguaje natural en lugar de JSON — ajustar instrucciones.
