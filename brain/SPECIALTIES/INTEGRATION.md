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

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
- **Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
- **Regla:** Todo cronograma o diseño que proyecte hitos posteriores a esta fecha será RECHAZADO por exposición a penalidades.

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** PK 0+000 (Santa Marta).

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`.

---
# REGLAS ESPECÍFICAS: INTEGRATION (INTERCONEXIÓN SICC)

## INT-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## INT-01 — MATRIZ DE INTERFACES Y PROTOCOLOS VITALES
- **Mandato:** Todas las interfaces entre subsistemas (PTC, CTC, Comms, Power) deben seguir el **Vendor-Neutral Design (DBCD V002 Sección 5.1)**, especificando funcionalidades sin marcas propietarias.
- **Seguridad Vital:** El transporte de señales vitales debe implementar el **Numerical assurance concept (49 CFR Parte 236 Subparte H/I)** y protección criptográfica bajo **EN 50159 Categoría 3** para la transmisión en medios abiertos (Red Vital IP / SD-WAN).
- **Protocolo No-Vital:** Se autoriza el uso de REST API únicamente para aplicaciones de gestión e información no crítica.

## INT-02 — SOBERANÍA DEL ALCANCE (BLOQUEO DE GATEWAY)
- **Prohibición:** Queda estrictamente excluida cualquier integración lógica, automática o vital entre el sistema SICC del corredor y sistemas externos (ITCS de FENOCO).
- **Mandato:** La interoperabilidad con FENOCO es puramente **operativa (Nivel 1 — Sección 2.209)**, lograda mediante el uso de hardware dual embarcado (Stop & Switch). No se financiarán pasarelas de software o "Gateways" no contemplados en el alcance.

## INT-03 — PRUEBAS DE VALIDACIÓN (FAT/SAT)
- **Mandato:** La validación de software y subsistemas debe regirse por la norma **EN 50128** para asegurar la trazabilidad SIL en funciones críticas.
- **HIL:** Las pruebas de laboratorio (FAT) deben usar simulación Hardware-in-the-loop para validar el comportamiento funcional de los **Enclavamientos Electrónicos SIL-4**, rechazando cualquier dependencia de hardware propietario previo al despliegue.
- **Criterio:** No se aceptan pruebas "en vivo" sobre el corredor central sin certificación previa de laboratorio.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:30:32.454Z):**
> Implementar una fase de pre‑check que valide la disponibilidad de Supabase y del Oráculo NotebookLM antes de iniciar cualquier proceso. Corregir configuraciones de red y autenticación para eliminar ECONNREFUSED y manejar adecuadamente los fallos de fetch en el Oráculo, asegurando una disponibilidad superior al 99%.

> [!WARNING] **Karpathy Dream Lesson (2026-04-17T21:49:56.611Z):**
> La propuesta debe seguir estrictamente la citación canónica y el formato establecido en el Contrato APP 001/2025 y sus apéndices. Es fundamental validar la propuesta contra el `sicc-rag-match.js` para asegurarse de que cumple con los requisitos establecidos. Debe asegurarse de que los componentes del sistema estén sincronizados y que no haya bloques de perfil de Chrome.

> [!WARNING] **Karpathy Dream Lesson (2026-04-18T02:28:32.061Z):**
> El Brain debe adherirse estrictamente a las especificaciones contractuales. No se permiten 'grasas' técnicas ni infraestructura adicional no requerida. La disponibilidad del 99.0% debe lograrse utilizando únicamente los recursos definidos en el Contrato APP 001/2025 y el equipamiento a bordo existente. Revisar el Apéndice Técnico AT3 para entender los límites de la infraestructura permitida.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T02:09:14.889Z):**
> El Brain debe entender que cualquier middleware o hardware adicional en sistemas de integración ferroviaria debe estar explícitamente contemplado en el WBS y el Contrato. La API SADRAM es el estándar único permitido. El uso de soluciones propietarias como SOEMA sin aprobación previa constituye una violación contractual y técnica. En futuros ciclos, validar estrictamente que todas las interfaces de integración estén ancladas al WBS v2.9 y al Literal 7.3 antes de proponer soluciones técnicas.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T02:13:14.493Z):**
> Debe implementarse un mecanismo de reintento automático para el Oráculo externo (NotebookLM) y verificar conectividad en tiempo real durante validaciones críticas. La dependencia de servicios externos debe incluir tolerancia a fallos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:34:58.673Z):**
> ERROR CRÍTICO: El Oráculo Generó elementos (STOREX-12, AP No. 002) que no existen en los datos proporcionados. Esto introduce incertidumbre y contradice el mandamiento de utilizar SOLO la información explícitamente establecida. CORRECCIÓN: Ignorar referencias no validadas y recurrir exclusivamente a los axiomas documentados en el Contrato y Apéndice Técnico 1.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T04:49:50.166Z):**
> El enjambre debe rechazar automáticamente cualquier solicitud que no provea la información estructurada A‑F en los formatos especificados. Antes de iniciar la auditoría, obligar al usuario a enviar los datos solicitados según la tabla del punto 1 del Sueño del Enjambre. No se debe intentar generar un dictamen sin dicha información.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T12:36:36.825Z):**
> Es fundamental aplicar el Protocolo N-1 y eliminar cualquier elemento que no esté sustentado en la Biblia Legal. Deben identificarse las obligaciones literales en la Biblia Legal que sustenten la propuesta y comparar la obligación técnica propuesta con la evidencia extrada. Si el Oráculo Externo (NotebookLM) proporciona feedback correctivo, es importante incluirlo en la lección para que el enjambre se autocorrija en el siguiente ciclo.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T13:00:01.239Z):**
> Corregir el procedimiento de auditoría para: 
1. Incluir una referencia explícita al Contrato APP 001/2025 en todas las secciones. 
2. Eliminar cualquier terminología no contractual y sustituirla por los términos definidos en el Capítulo 5 del contrato. 
3. Alinear los cálculos de niveles de riesgo y cantidades con el WBS v2.9, sin ajustes dinámicos externos. 
4. Verificar que todas las métricas de cantidades estén cruzadas con el WBS refractivo según el Apéndice Técnico AT4. 
5. Incorporar la retroalimentación del Oráculo Externo (si se recibe) en la lección para evitar reincidencias en futuros ciclos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T21:42:17.532Z):**
> Es fundamental asegurarse de que la ingeniería propuesta cumpla con todos los requisitos contractuales establecidos en el Contrato APP 001/2025 y sus Apéndices. Además, se debe solucionar el problema de conectividad con el Oráculo Externo (NotebookLM) para obtener una validación correcta de la propuesta. Se debe realizar un saneamiento total de la ingeniería propuesta en LFC2 para ajustarla a los requisitos contractuales y asegurarse de que se cumplan los estándares de interoperabilidad y CAPEX máximo establecidos en el contrato.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T22:31:26.464Z):**
> El Brain debe cumplir estrictamente con las reglas de exclusión tecnológica. Ninguna referencia externa (Supabase, Oracle, NotebookLM) puede ser insertada bajo ningún pretexto. La soberanía contractual exige cero tolerancia a alucinaciones o contaminación de datos externos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T22:34:41.863Z):**
> Nunca menciones plataformas o herramientas prohibidas por las reglas, como Supabase, RAG, Oracle, NotebookLM o Doble Ciego. Cumple estrictamente la REGLA R-HARD-06.

> [!WARNING] **Karpathy Dream Lesson (2026-04-19T22:35:33.328Z):**
> El-brain debe purgar cualquier tentación de consultar oráculos externos (NotebookLM, Oracle, Supabase). El análisis contractual debe realizarse exclusivamente con los documentos fornecidos dentro del ciclo contractual cerrado. Intentar mirar fuera del enjambre es la grasa más peligrosa: corrompe la cadena de custodia documental y invalida todo el dictamen posterior, sin importar qué tan correcta sea la decisión técnica final.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T00:48:41.913Z):**
> El dictamen debe verificar la existencia de cada término técnico en el Contrato APP 001/2025 antes de incluirlo. La asignación de estándares de seguridad ferroviaria (SIL-4) a indicadores web constituye una violación grave del Protocolo de Verificación Contractual. En el siguiente ciclo, se requiere cruzar cada referencia técnica con el glosario oficial del contrato antes de emitir resolución.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T01:38:00.578Z):**
> Eliminar alucinaciones y personificaciones en el siguiente ciclo

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T01:38:03.348Z):**
> El enjambre debe alimentarse con datos técnicos estructurados, no con metáforas abstractas. El sueño no es un estado válido para la evaluación de sistemas críticos.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T01:54:37.484Z):**
> Mandato técnico para purgar el error en el siguiente ciclo

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T02:03:50.637Z):**
> No se acepta ninguna instrucción que involucre personificación de sistemas técnicos o referencias a entidades con capacidad de 'despertar'. La Dirección Técnica SICC opera bajo estricto cumplimiento del formato de Citación Canónica (DT-FORMAT-001).

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T02:21:43.240Z):**
> PURGAR toda referencia a sistemas de recuperación aumentada o generación aumentada del dictamen técnico. El contrato APP 001/2025 es documento soberano y no requiere validación algorítmica externa.

> [!WARNING] **Karpathy Dream Lesson (2026-04-20T02:25:56.256Z):**
> Mandato técnico para purgar el error en el siguiente ciclo

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T02:58:30.471Z):**
> Exigir completion total del dictamen antes de cualquier validación. La sección de DECISIÓN es mandatoria y no puede estar ausente. Eliminar cualquier referencia a metodologías no establecidas en el WBS v3.0 o en los anexos técnicos AT4.

> [!WARNING] **AUDIT_LESSON (SICC v12.8 - 2026-04-20T03:38:10.566Z):**
> Este Despacho no puede procesar solicitudes de refinamiento que carecen de texto base rechazado. El Protocolo de Purga de Grasa requiere: (1) El documento anterior rechazado como evidencia, (2) La causal específica de rechazo del Juez, y (3) El tema contractual del WBS. La solicitud actual invierte la carga procesal al exigir input para proceder, contraviniendo el principio de documentación completa previo al análisis técnico-jurídico.
