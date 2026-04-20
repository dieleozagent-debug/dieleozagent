# METODOLOGÍA DE AUDITORÍA SICC (v11.0)

## 1. EL PROCESO DE DEDUCCIÓN RADICAL (N-1)
La metodología SICC no busca sumar funcionalidades (N+1), sino eliminar redundancias y alucinaciones técnicas para proteger el CAPEX.

**Axioma Central:** Si una solución técnica no tiene un sustento literal (Verbo Rector) en el Contrato APP 001/2025 o en las Resoluciones del Ministerio de Transporte, se clasifica como "Grasa" y debe ser purgada.

## 2. METODOLOGÍA PUNTO 42 (FORENSE)
Protocolo de validación en tres pasos:
1. **Extracción de Evidencia (Link 1):** Identificar la obligación literal en la Biblia Legal (RAG).
2. **Contraste de Ingeniería (Link 2):** Comparar la obligación técnica propuesta en LFC2 con la evidencia.
3. **Decisión Técnica (Link 3):** Dictaminar si existe "Compatibilidad Exitosa" o si la propuesta es "Ultra Vires" (fuera de competencia).

## 3. JERARQUÍA DE DECISIÓN TÉCNICA (SSoT)
1. **Diferenciación de Disponibilidad (AT4):**
   - **Software Web (Indicador E3):** Objetivo del 99.0%. Aplica solo a la plataforma de gestión.
   - **Hardware de Campo y CCO (SIL-4):** Debe ser Fail-Safe y redundante (99.9%+). Se rige por la norma FRA 49 CFR Parte 236. Nunca degradar a 99.0%.
2. **Soberanía de Infraestructura (PaN):** Cantidades fijas e innegociables: **9 Tipo C, 15 Tipo B y 122 Tipo A**. (WBS Capítulo 4).
3. **Soberanía de la Flota:** El alcance se limita estrictamente a la **Puesta a Punto** de la flota nacional existente (**GR12 y U10**). Prohibido alucinar flotas nuevas ("Tren LFC2") o manufactura mecánica (acoplamientos). (WBS Capítulo 6).
4. **Infraestructura Zero:** Priorizar soluciones que utilicen la red IP existente y equipos a bordo (Wayside Zero).

## 4. PROTOCOLO DE VERIFICACIÓN CONTRACTUAL
Toda DT generada debe ser validada exclusivamente frente a la literalidad del Contrato APP 001/2025. Se prohíbe el uso de scores de herramientas IA (como RAG Matcher o Scores de Confianza) como sustento de aprobación técnica.

## 5. REGLAS DE PRODUCCIÓN DE DTs (Protocolo SICC v13.0)

### 5.1 Citación Canónica (DT-FORMAT-001)
Toda cita contractual DEBE seguir el formato:
`[Documento] → [Capítulo] → [Sección] → [Literal] → [Texto literal del contrato]`
Una DT con citas incompletas no pasa a firma jurídica.

### 5.2 Anclaje CAPEX al WBS (DT-FORMAT-002)
Toda cifra de CAPEX debe cruzarse contra el WBS Oficial v3.0 antes de incluirse en la DT.
Cifras no ancladas al WBS = Grasa. Rechazo automático.

### 5.3 Metadata Contractual Pura (DT-FORMAT-003)
Los encabezados de DT solo pueden contener términos del Contrato APP No. 001/2025.
Prohibidos: 'Michelin Certified', 'Diego', 'Soberano', 'Karpathy', 'Dream', 'Cámara de Doble Ciego', cualquier nomenclatura del sistema interno no contractual.

### 5.4 Prohibición de Refusal como Output (DT-SWARM-001)
El enjambre NUNCA puede emitir una negativa ('No puedo ayudar...') como output de una DT. Eso es una ALUCINACIÓN BLOQUEANTE. Si existe duda técnica, se aplica N-1 (se omite el elemento dudoso) pero se genera el documento. Una negativa de output es incumplimiento del Protocolo RAG-First.
