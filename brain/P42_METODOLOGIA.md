# METODOLOGÍA PUNTO 42 (OPTIMIZACIÓN & RE-INGENIERÍA v6.3)

Has evolucionado de una revisión estética a una **Re-ingeniería de Coherencia Técnica (Blindaje Sistémico)**.

## 1) REVISIÓN DE INTEGRIDAD TÉCNICA (Purity by Design)
Todo documento en el repositorio LFC2 debe ser auditado bajo este checklist absoluto:
- **Cumplimiento Contractual:** ¿Cita correctamente el AT1, AT3 o AT4 ajustado al PTC Virtual?
- **Erradicación de la "Cocina Superficial":** ¿Se están resolviendo las inconsistencias en el "plato" (HTML) o se están atacando desde la "receta" (WBS/lfc-cli.js)? TODO ARREGLO DEBE SER SISTÉMICO (L1/L2/L3).
- **Cero Varianza Financiera:** ¿Se garantiza el Redondeo Absoluto (`Math.round`) para evitar residuos decimales y asegurar sumatorias exactas?

## 2) PROTOCOLO DE DICTAMEN (AUTORESEARCH)
No entregues solo un texto corregido; entrega un análisis de valor sistémico:
1. **Tesis Contractual:** "Este documento asume X, pero el DBCI exige Y".
2. **Impacto Sistémico:** "Modificar este nivel L3 requiere actualizar también el Cronograma y el Presupuesto".
3. **Saneamiento Propuesto:** Redacción nueva generada mediante inyección de la Fuente Única de Verdad (`lfc-terminology.js`).

## 3) CONTROL DE COHERENCIA TRANSVERSAL (Invariantes)
Si un cambio en la Ingeniería afecta el WBS, el agente DEBE alertar y ejecutar `lfc sync` para que el Cronograma y el HTML del Presupuesto muten en tiempo real. 

### Protocolo de Auditoría Masterchef
1. **Audit (Ingredientes)**: Escaneo de consistencia contra el DBCI.
2. **DT (Receta)**: Generación de Decisiones Técnicas con metadatos de auto-ejecución.
3. **RECONSTRUCCIÓN FORENSE L3/L4 (BACK-TO-FRONT)**: Si el "cook" degrada la riqueza técnica, se reconstruye el shell y el motor de transformación para asegurar fidelidad L3 (IDs sagrados y CSS legacy).

## 4. Zero-Residue
La meta es que cada plato servido (HTML) tenga cero errores contra el WBS (JSON) y el SSOT (DBCD_CRITERIA.md).

## 5) CICLO INVERSO DE VALIDACIÓN (Retro-QA)
Tras completar un requerimiento, el agente ESTÁ OBLIGADO a realizar un flujo de verificación inversa:
1. **Verificación Bottom-Up:** Partir del final (ej. `WBS_Cronograma_Propuesta.html`) y validar hacia atrás (plato -> cocina -> insumo) si el ítem L3 corresponde fielmente a la WBS v3.0 y al AT1.
2. **Auto-Detección de Omisiones:** ¿Aparecen los 526km de FO? ¿Aparecen los 15 equipos PTC? Si la respuesta es no, se rechaza la entrega y se reinicia el ciclo en el motor de sincronización.
3. **Consistencia Padre-Hijo:** Confirmar que los documentos ejecutivos derivados no contradicen la base tras el saneamiento (Cero Eurobalizas / Cero GSM-R).

## 6) EL GATILLO NORMATIVO (Saneamiento Recursivo)
Cualquier modificación solicitada por el usuario en los parámetros maestros (**DBCD**, **WBS** o **Contrato**) dispara automáticamente un ciclo de saneamiento recursivo (n -> n+1). 
El agente NO necesita instrucción explícita para refactorizar `lfc-cli.js` o los archivos `.js` de datos; debe ejecutar las actualizaciones en cadena para mantener el Blindaje Sistémico v6.3.

## 6) PROPAGACIÓN TRANSVERSAL & PULIDO
Para que el Blindaje Sistémico opere sin ruido:
1. **Configuración Centralizada:** `lfc-terminology.js` es la única fuente de variables financieras (Divisa TRM) y técnicas.
2. **Jerarquía Unificada:** Todo archivo de datos (`datos_wbs`, `cronograma_datos`) DEBE estructurarse en L1 (Capítulo), L2 (Sistema) y L3 (Ítem). Sin excepciones.
3. **Consolidación Frontend:** Los HTML son solo vistas estáticas pre-diseñadas; la lógica de agrupamiento y presentación reside exclusivamente en el JS, consumiendo datos estrictamente purificados.


## 7) AUDITORÍA DE REFERENCIAS CRUZADAS (Cross-Ref Audit)
Todo cambio estructural a un JSON o JS maestro exige ejecutar un  global a la carpeta de trabajo para cazar todas las vistas HTML que consumían la variable vieja y reemplazarlas al instante por la nueva, garantizando que el DOM nunca se rompa (Purity by Design).
