// sicc-seed-memory.js — Siembra de memoria genética con embeddings reales para el enjambre
'use strict';

const { pool, obtenerEmbedding } = require('../src/supabase');

const lessons = [
  {
    content: "LECCIÓN GOB-001 (Balizas): La interoperabilidad con FENOCO es un procedimiento operacional Stop & Switch con equipamiento dual embarcado (OBU Dual). NO se requieren Eurobalizas legacy ni Gateways de software. Referencia: Res. Surcos Art 5.1.e.",
    metadata: { type: "lesson", category: "signalization", rule: "R-06" }
  },
  {
    content: "LECCIÓN GOB-002 (Fibra): El único estándar de fibra óptica central es ITU-T G.652.D (48 hilos). Se prohíbe el uso de fibra G.655 o tecnologías DWDM/ROADM por ser sobredimensionamiento (Grasa). Referencia: AT3 Numeral 8.6.",
    metadata: { type: "lesson", category: "telecom", rule: "R-01" }
  },
  {
    content: "LECCIÓN GOB-003 (Métricas): La disponibilidad del 99.95% es una alucinación técnica. El contrato solo exige 99.0% para el software SICC (AT4 5.4.2). Los sistemas de tren se rigen por el principio de Falla Segura (Fail-Safe) según FRA Parte 236.",
    metadata: { type: "lesson", category: "operations", rule: "R-09" }
  },
  {
    content: "LECCIÓN DT-024 (Interoperabilidad): Se rechaza absolutamente cualquier API o Gateway de software hacia FENOCO. La interoperabilidad es puramente Operacional (Stop & Switch) con equipos embarcados duales. Se prohíben Contadores de Ejes para PTC (Virtual PTC es la norma).",
    metadata: { type: "lesson", category: "signalization", rule: "DT-024" }
  },
  {
    content: "LECCIÓN DT-026 (Cronograma): La Fase de Preconstrucción vence de forma inexorable el 1 de noviembre de 2026 (15 meses desde el 1 de agosto de 2025). Cualquier proyección para diciembre de 2026 o enero de 2027 es un incumplimiento crítico.",
    metadata: { type: "lesson", category: "management", rule: "DT-026" }
  },
  {
    content: "LECCIÓN DT-026 (Finanzas): El CAPEX del sistema ATP embarcado está topado en $726.000.000 COP por unidad (WBS v2.9). Cifras de USD 2.5 MM son alucinaciones de sobredimensionamiento.",
    metadata: { type: "lesson", category: "finance", rule: "DT-026" }
  },
  {
    content: "LECCIÓN DT-027 (Estándares): Se prohíbe el uso de EN 50716 o EN 50128 como base de diseño SCC. El estándar mandatario según AT1 Tabla 17 es FRA 49 CFR Parte 236 para Arquitectura PTC Virtual.",
    metadata: { type: "lesson", category: "telecom", rule: "DT-027" }
  },
  {
    content: "LECCIÓN DT-027 (Interoperabilidad): No se permite la integración lógica de software (Gateway) con FENOCO. La 'Compatibilidad Exitosa' del AT10 se limita a equipos físicos duales a bordo. Interoperabilidad operacional: Stop & Switch.",
    metadata: { type: "lesson", category: "signalization", rule: "DT-027" }
  },
  {
    content: "LECCIÓN DT-027 (Seguridad): El sistema de comunicaciones se rige por el principio de Falla Segura (Fail-Safe) de la FRA, no por métricas de disponibilidad del 99.95%. Exigir 99.95% es sobredimensionamiento (Grasa).",
    metadata: { type: "lesson", category: "telecom", rule: "DT-027" }
  },
  {
    content: "LECCIÓN DT-030 (Jerarquía): El 'Nivel 16' de prelación se refiere exclusivamente a los Pliegos de Condiciones, Adendas y Anexos de la Licitación (Sección 1.2(d)). NO existen componentes físicos o de hardware denominados Nivel 16.",
    metadata: { type: "lesson", category: "legal", rule: "DT-030" }
  },
  {
    content: "LECCIÓN DT-030 (Metodología): 'N-1' es una METODOLOGÍA de razonamiento deductivo forense, NO es el nombre de una propuesta técnica ni de una optimización de diseño. Se prohíbe el uso de términos como 'Optimización Forense N-1'.",
    metadata: { type: "lesson", category: "management", rule: "DT-030" }
  },
  {
    content: "LECCIÓN DT-030 (Estrategia): El suministro de equipamiento dual embarcado (Radios/DMI LFC+FENOCO) es la ESTRATEGIA SICC (Shield) innegociable. No es una simplificación; es el escudo que exime a LFC de construir el Gateway.",
    metadata: { type: "lesson", category: "signalization", rule: "DT-030" }
  },
  {
    content: "LECCIÓN DT-031 (Finanzas): La inversión en equipamiento onboard está protegida por el Apéndice Financiero 4, el cual obliga a la ANI a AMORTIZAR el 100% del valor de los equipos tecnológicos de señalización. No se requieren teorías de ahorro fantasma.",
    metadata: { type: "lesson", category: "finance", rule: "DT-031" }
  },
  {
    content: "LECCIÓN DT-031 (Jerarquía): Es terminantemente falso que exista un 'Contrato L1'. El único documento rector es el Contrato APP 001/2025. Cualquier mención a otros contratos maestros es una alucinación crítica.",
    metadata: { type: "lesson", category: "legal", rule: "DT-031" }
  },
  {
    content: "LECCIÓN DT-031 (Obligación): El equipamiento onboard es una obligación taxativa del AT1 Numeral 5.1 y del Artículo 20-9 de la Política de FENOCO. Se justifica por cumplimiento legal, no por 'equivalencia técnica'.",
    metadata: { type: "lesson", category: "legal", rule: "DT-031" }
  },
  {
    content: "LECCIÓN DT-032 (Catenaria): En la especialidad de Catenaria y Energía, NO existe obligación de 'Optimización Energética' ni 'Simplificación Topológica'. El diseño debe regirse por el AT de Catenaria sin invenciones de ahorro.",
    metadata: { type: "lesson", category: "energy", rule: "DT-032" }
  },
  {
    content: "LECCIÓN DT-032 (Cerebro): Se prohíbe terminantemente establecer objetivos de diseño basados en 'Eliminar impurezas Nivel 16' como si fueran hardware. El sistema debe ser neutral y basado en RAG.",
    metadata: { type: "lesson", category: "management", rule: "DT-032" }
  },
  {
    content: "LECCIÓN DT-033 (Telecom): La Fibra Óptica central DEBE ser G.652.D (mínimo 48 hilos). Se prohíbe terminantemente G.655 o DWDM/EDFA (CAPEX Grasa/Sobredimensionamiento).",
    metadata: { type: "lesson", category: "telecom", rule: "DT-033" }
  },
  {
    content: "LECCIÓN DT-033 (Estrategia): La 'Bala de Plata' es el Satélite: El AT1 permite comunicación satelital al 100%. LFC usará Arquitectura Híbrida SD-WAN (Satlink+LTE) para evitar torres físicas y salir a operar temprano.",
    metadata: { type: "lesson", category: "telecom", rule: "DT-033" }
  },
  {
    content: "LECCIÓN DT-033 (Legal): Las Torres de Microondas son Obra Complementaria (Sección 25.4 del Contrato). LFC NO las construye ni las financia; si la ANI las exige, debe suscribirse adición previa pagada por el Estado.",
    metadata: { type: "lesson", category: "legal", rule: "DT-033" }
  },
  {
    content: "LECCIÓN DT-FORMAT-001 (Citación Canónica): Toda cita contractual en una DT DEBE seguir el formato obligatorio: [Documento] → [Capítulo] → [Sección] → [Literal] → [Texto literal del contrato]. Ejemplo correcto: 'De conformidad con el Contrato General APP No. 001/2025, Capítulo XIII, Sección 2.201, en concordancia con Sección 9.1(b)(vii), el Concesionario está obligado taxativamente a instalar los equipos de control de tráfico a bordo del Material Rodante Tractivo.' Una cita sin este formato es incompleta y la DT no pasa a firma jurídica.",
    metadata: { type: "lesson", category: "format", rule: "DT-FORMAT-001" }
  },
  {
    content: "LECCIÓN DT-FORMAT-002 (Anclaje CAPEX al WBS): Toda cifra de CAPEX en una DT debe cruzarse obligatoriamente contra la Partida correspondiente del WBS Oficial v2.9. Para Sistemas ATP embarcados, el valor de referencia contractual es $726.000.000 COP por locomotora (Partida 6.1.100). Cualquier cifra externa no anclada al WBS (ej. '2 MM USD', '2.5 MM USD') carece de respaldo contractual y se rechaza automáticamente como Grasa de sobredimensionamiento.",
    metadata: { type: "lesson", category: "finance", rule: "DT-FORMAT-002" }
  },
  {
    content: "LECCIÓN DT-FORMAT-003 (Metadata Contractual Pura): Los encabezados de toda DT deben contener ÚNICAMENTE términos con sustento en el Contrato APP No. 001/2025 o sus Apéndices Técnicos. Quedan terminantemente prohibidos en los encabezados: 'Michelin Certified', 'Karpathy Loop', 'ciclo de sueño SICC', 'Propuesta Soberana', emojis decorativos o cualquier nomenclatura inventada por el enjambre sin respaldo contractual. Regla aplicada: Herramienta 2 — Matriz de Traducción a Términos Contractuales.",
    metadata: { type: "lesson", category: "format", rule: "DT-FORMAT-003" }
  },
  {
    content: "LECCIÓN DT-SWARM-001 (Prohibición de Refusal como Output): Está terminantemente prohibido que el enjambre de IA emita una respuesta del tipo 'No puedo ayudar a crear un documento...' como output de una DT. Esa respuesta constituye una ALUCINACIÓN BLOQUEANTE. El agente tiene la obligación contractual de generar la DT basada en la evidencia de la Biblia Legal. Si hay duda sobre un término, se aplica N-1 (se omite) pero se genera el documento. Una negativa de output es incumplimiento del Protocolo RAG-First.",
    metadata: { type: "lesson", category: "governance", rule: "DT-SWARM-001" }
  },
  {
    content: "LECCIÓN DT-034 (Catenaria/Energía — Corredor Diésel): El corredor LFC (La Dorada — Chiriguaná) opera con TRACCIÓN DIÉSEL. No existe obligación contractual de electrificación de catenaria aérea (AC 25kV / DC 1.5kV). La especialidad de Catenaria y Energía en LFC se refiere exclusivamente al suministro de energía de misión crítica para subsistemas SICC (UPS, Generadores para ENCE x5 y CCO). Cualquier propuesta de electrificación de catenaria es CAPEX sin sustento contractual (Ultra Vires). Los ENCE x5 (AT1 Tabla 17) requieren respaldo autónomo: red local + UPS + generador diésel, con autonomía mínima por confirmar en AT3/AT4.",
    metadata: { type: "lesson", category: "energy", rule: "DT-034" }
  },
  {
    content: "LECCIÓN DT-035 (Telecom — Arquitectura Híbrida Satelital): El AT1 Tabla 17 autoriza explícitamente el uso de comunicaciones satelitales como redundancia del sistema PTC. Esto fundamenta y blinda legalmente la Arquitectura Híbrida SD-WAN (Satlink+LTE) para habilitar tramos del corredor sin construir redes de microondas terrestres. El estándar FRA 49 CFR Parte 236 Subparte I rige la SEGURIDAD a bordo (Fail-Safe); NO exige disponibilidades comerciales IT del 99.95%. Régimen sancionatorio real por incumplimiento: Sección 4.6 (Deducciones por Desempeño) y Sección 16.8 (Multas). No existen 'Tribunales de Bases Técnicas'.",
    metadata: { type: "lesson", category: "telecom", rule: "DT-035" }
  },
  {
    content: "LECCIÓN DT-SWARM-002 (Purga Interna como Verdad): Cuando el enjambre produce un documento original mutilado (texto truncado, corte abrupto) Y además genera una versión purgada interna en el mismo archivo, la VERSIÓN PURGADA INTERNA ES LA VÁLIDA y debe prevalecer. El documento original mutilado es descartado automáticamente. La metadata inválida (Michelin Certified, Karpathy Loop, etc.) es el vicio sistémico más recurrente del enjambre. Toda iteración de DT debe pasar el chequeo FORMAT-003 antes de escalarse.",
    metadata: { type: "lesson", category: "governance", rule: "DT-SWARM-002" }
  },
  {
    content: "LECCIÓN DT-FORMAT-004 (Apéndice Financiero 4 — Cita Precisa): Toda referencia a amortización ANI del CAPEX embarcado DEBE incluir el numeral específico del Apéndice Financiero 4 del Contrato APP No. 001/2025. Una referencia genérica al 'Apéndice Financiero 4' sin numeral específico es insuficiente para circular externamente. Formato obligatorio: 'De conformidad con el Contrato General APP No. 001/2025, Apéndice Financiero 4, [Numeral específico verificado], la ANI reconocerá al Concesionario la amortización del 100% de la inversión en equipamiento embarcado, dentro del techo de la Partida 6.1.100 WBS v2.9 ($726.000.000 COP/locomotora).' TAREA ABIERTA: Verificar numeral exacto del AF4 en la Biblia Legal.",
    metadata: { type: "lesson", category: "finance", rule: "DT-FORMAT-004" }
  },
  {
    content: "LECCIÓN BLOCKER-001 (Falso Blocker Aritmético): El enjambre emitió un BLOCKER afirmando que el cronograma LFC era 'inconsistente'. La realidad: 15 meses desde el 01-ago-2025 = 01-nov-2026 es matemáticamente exacto (12 meses = ago-2026 + 3 meses sep/oct/nov = nov-2026). REGLA: Antes de emitir un BLOCKER basado en cálculo cronológico, el enjambre DEBE verificar la aritmética. Un BLOCKER con error matemático propio es automáticamente destruido. Las órdenes de compra y decisiones de diseño NO se detienen por falsos BLOCKERS.",
    metadata: { type: "lesson", category: "governance", rule: "BLOCKER-001" }
  },
  {
    content: "LECCIÓN BLOCKER-002 (Especialidades Válidas): Solo pueden asignarse especialidades existentes en el organigrama LFC o en los Apéndices Técnicos del Contrato APP No. 001/2025. Especialidades prohibidas por inexistentes: 'Geografía Contractual', 'Auditoría Forense Genética', 'Soberanía Tecnológica' u otras nomenclaturas inventadas por el enjambre. Especialidades válidas: Señalización Ferroviaria, Telecomunicaciones SICC, Catenaria y Energía, Obras Civiles, Material Rodante, Cronograma y Fases.",
    metadata: { type: "lesson", category: "governance", rule: "BLOCKER-002" }
  },
  {
    content: "LECCIÓN DT-036 (Cronograma Contractual — Canon Definitivo): El plazo de la Fase de Preconstrucción es INAM OVible: 15 meses desde el Acta de Inicio (01-ago-2025), venciendo el 01-nov-2026 (Contrato General APP No. 001/2025, Capítulo III, Sección 3.8(a)(i)(2)). Cita canon definitiva: 'De conformidad con el Contrato General APP No. 001/2025, Capítulo III, Sección 3.8(a)(i)(2), la Fase de Preconstrucción tiene una duración de quince (15) meses contados desde la Fecha de Inicio (01-ago-2025), venciendo improrrogablemente el 01-nov-2026. El incumplimiento activa directamente las Multas pecuniarias de la Sección 16.8 y las Deducciones por Desempeño de la Sección 4.6, sin requerir interpretación adicional.'",
    metadata: { type: "lesson", category: "management", rule: "DT-036" }
  },
  {
    content: "LECCIÓN BLOCKER-003 (Contrato L1 Inexistente — Alucinación Crítica): El enjambre inventó un 'Contrato L1' como documento rector del proyecto. Ese contrato NO EXISTE. El Único marco vinculante del proyecto es el Contrato de Concesión APP No. 001 de 2025. La jerarquía legal está definida en la Sección 1.2(d): (i) Contrato APP No. 001/2025, (ii) AT1, (iii-x) AT2 a AT10, (xvi) Pliegos/Adendas/Q&A SECOP. Invocar documentos fantasma destruye la defensa basada en Sección 1.2(d). Todo documento o cita que mencione 'Contrato L1' debe ser rechazado automáticamente.",
    metadata: { type: "lesson", category: "legal", rule: "BLOCKER-003" }
  },
  {
    content: "LECCIÓN DT-037 (AT10 — Rol Operativo, NO Financiero): El Apéndice Técnico 10 (AT10) regula operativamente el Sistema de Control de Tráfico (capacidad, simulación, protocolos). AT10 NO contiene modelos financieros, tasas de retorno, ni 'rentas de equilibrio'. Toda referencia a 'renta de equilibrio (AT10)' es una ALUCINACIÓN. La recuperación financiera del CAPEX embarcado se sustenta exclusivamente en el Apéndice Financiero 4 (Amortización). Cita correcta: 'De conformidad con el Apéndice Financiero 4, la ANI amortizará a LFC el valor de los equipos embarcados (dispositivos tecnológicos) en cada locomotora, requeridos para el control de tráfico y señalización.'",
    metadata: { type: "lesson", category: "finance", rule: "DT-037" }
  },
  {
    content: "LECCIÓN DT-FORMAT-006 (CAPEX Inflado — Patrón Reincidente): La cifra '~2.5 MM USD' para equipamiento ATP embarcado es una alucinación REINCIDENTE del enjambre (apareció en múltiples iteraciones). Valor contractual verificado: WBS Oficial v2.9, Partida 6.1.100 = $726.000.000 COP por locomotora (≈ $181.500 USD al TRM de referencia). La diferencia es >10x. Usar los 2.5 MM USD en cualquier documento interno equivale a confesar un sobrecosto sin respaldo contractual (Herramienta 4 — bloqueo automático). Si el enjambre propone una cifra mayor al WBS v2.9 sin cita contractual explícita, debe rechazarse como Grasa de sobredimensionamiento.",
    metadata: { type: "lesson", category: "finance", rule: "DT-FORMAT-006" }
  },
  {
    content: "LECCIÓN BLOCKER-004 (Supabase NO es fuente de verdad contractual): El enjambre exigió justificar decisiones de CAPEX mediante un 'registro vectorial en Supabase vinculante'. Esto es una ALUCINACIÓN CRÍTICA. La única fuente de verdad del proyecto es el Contrato APP No. 001/2025 y sus Apéndices Técnicos (Sección 1.2(d)). Supabase, Ollama, OpenRouter, Gemini o cualquier herramienta de software NO aparece en la jerarquía documental del contrato. Subordinar decisiones de ingeniería al output de una base de datos vectorial anula la soberanía documental de LFC y podría tener consecuencias legales ante la ANI o la Interventoría.",
    metadata: { type: "lesson", category: "governance", rule: "BLOCKER-004" }
  },
  {
    content: "LECCIÓN BLOCKER-005 (Caracteres No Latinos = Colapso Algorítmico): Cuando el enjambre produce caracteres en idiomas no latinos (cirílico, árabe, chino, etc.) dentro de un documento técnico-jurídico del proyecto LFC, se clasifica como COLAPSO ALGORÍTMICO TOTAL. El documento debe ser rechazado de forma inmediata sin análisis adicional. Todo documento LFC/SICC debe estar íntegramente en español con citas en inglés solo cuando la norma original es en ese idioma (FRA, AREMA). Ningún otro alfabeto es válido.",
    metadata: { type: "lesson", category: "governance", rule: "BLOCKER-005" }
  },
  {
    content: "LECCIÓN DT-FORMAT-007 (CAPEX Inflado — Restricción Estructural de Prompt): La alucinación del CAPEX ATP embarcado en '2.5 MM USD' ha aparecido en 3 iteraciones consecutivas. Esto confirma que es un patrón ESTRUCTURAL del enjambre, no un error puntual. Requiere restricción en el system prompt, no solo en la memoria vectorial. REGLA DURA: El valor $726.000.000 COP por locomotora (WBS Oficial v2.9, Partida 6.1.100) es NO NEGOCIABLE. Toda cifra superior sin cita contractual explícita es Grasa bloqueada automáticamente. Las Cláusulas 'N-1 de Ahorro CAPEX' no existen en el Contrato APP No. 001/2025. Modificaciones de CAPEX se rigen únicamente por Secciones 9.11 y 9.12.",
    metadata: { type: "lesson", category: "finance", rule: "DT-FORMAT-007" }
  },
  {
    content: "LECCIÓN DT-038 (Cronología Mínima de Hitos — Fecha de Valla): Ningún hito, orden de compra, plan de integración ni entrega de documentación puede tener fecha anterior al Acta de Inicio del 01-ago-2025. La fecha de firma del contrato es 21-abr-2025; el Acta de Inicio perfeccionó las obligaciones el 01-ago-2025. Toda tabla de hitos con fechas previas al 01-ago-2025 es cronológicamente imposible y se rechaza automáticamente. Fechas de valla obligatorias: Acta de Inicio = 01-ago-2025 | Vencimiento Preconstrucción = 01-nov-2026 | Firma contrato = 21-abr-2025 (solo referencia, no operativa).",
    metadata: { type: "lesson", category: "management", rule: "DT-038" }
  },
  {
    content: "LECCIÓN DT-039 (Tecnologías Wayside Prohibidas — PTC Virtual): La arquitectura PTC Virtual (AT1 Tabla 17) elimina toda infraestructura wayside física a lo largo del corredor LFC. Quedan terminantemente prohibidas: (1) Telemetría de contadores de ejes salvo en los 5 ENCE mandatados (AT1 Tabla 17); (2) Redes de microondas como backup de comunicaciones (la redundancia autorizada es Satelital + GSM/LTE vía SD-WAN). Incluir estas tecnologías en un entregable equivale a aceptar sobredimensionamiento que LFC estaría obligado a financiar. Modificaciones requieren Sección 9.12 con costo 100% a cargo de la ANI.",
    metadata: { type: "lesson", category: "signalization", rule: "DT-039" }
  },
  {
    content: "LECCIÓN R-HARD-06 (Especialidad 'Catenaria y Energía' — Prohibida para este corredor): El corredor LFC (La Dorada — Chiriguaná, 526 km) opera con TRACCIÓN DIÉSEL-ELÉCTRICA. No existen catenarias eléctricas aéreas en ningún km del corredor. La especialidad 'Catenaria y Energía' en el contexto del sistema de señalización se refiere únicamente a suministro de energía de misión crítica para subsistemas SICC (UPS/Generadores para ENCE x5 y CCO). Esta especificación ha reincidido 2 veces: requiere restricción dura en el prompt del sistema. La especialidad correcta para el sistema de control es: 'Señalización y Control de Tráfico (PTC Virtual)'.",
    metadata: { type: "lesson", category: "energy", rule: "R-HARD-06" }
  },
  {
    content: "LECCIÓN BLOCKER-006 (Norma Inventada 'TECNOPARTE 2001'): El enjambre inventó un estándar ferroviario llamado 'TECNOPARTE 2001' que no existe en ningún sistema jurídico ferroviario (colombiano, estadounidense ni europeo). El Único estándar vinculante para el sistema PTC Virtual del proyecto LFC es la FRA 49 CFR Parte 236, Subparte I (AT1 Tabla 17, Nivel 2). Cualquier otra norma propuesta sin cita en AT1 o el Contrato APP No. 001/2025 debe rechazarse automáticamente como alucinación.",
    metadata: { type: "lesson", category: "signalization", rule: "BLOCKER-006" }
  },
  {
    content: "LECCIÓN BLOCKER-007 (Cronología Invertida — Error Más Peligroso): El enjambre afirmó que la Fase de Preconstrucción fue 'concluida el 01 de agosto de 2025'. Eso es CATASTRÓFICAMENTE FALSO. El 01-ago-2025 es la fecha de INICIO (Acta de Inicio), no de conclusión. La Fase de Preconstrucción VENCE el 01-nov-2026 (15 meses desde el inicio). Si este error circula, LFC estaría declarando legalmente que ya incumplió el plazo contractual, exponiéndose a multas y deducciones inmediatas. REGLA: INICIO = 01-ago-2025. FIN = 01-nov-2026. Invertir estas fechas es error crítico irrecuperable de rango máximo.",
    metadata: { type: "lesson", category: "management", rule: "BLOCKER-007" }
  },
  {
    content: "LECCIÓN DT-FORMAT-009 ('DIANOMENTO DE FIRMACIÓN' y 'Firma Simbólica'): Términos sin valor jurídico inventados por el enjambre. 'DIANOMENTO DE FIRMACIÓN' no existe en el vocabulario jurídico colombiano ni en ningún apéndice del Contrato. 'Firma simbólica' no tiene valor legal; el contrato exige firmas de responsables técnicos reales con nombre y cargo. Estos términos se suman a la lista METADATA_PROHIBIDA del system prompt.",
    metadata: { type: "lesson", category: "format", rule: "DT-FORMAT-009" }
  },
  {
    content: "LECCIÓN BLOCKER-008 (Lenguaje Ininteligible = Colapso Algorítmico Total): Cuando el enjambre produce palabras inexistentes en cualquier idioma ('FACTE DAZFÍNICA DEREGUA', 'NOUTICIENTES', 'Inademperable', 'CUMPLIECIDAD DE LA ACCIÓN', etc.), el documento debe rechazarse INMEDIATAMENTE sin análisis adicional. Es la señal definitiva de degradación del modelo. Corregir el output de un modelo en colapso lingüístico es inútil. Acción requerida: cambiar de modelo o reiniciar el contexto completamente.",
    metadata: { type: "lesson", category: "governance", rule: "BLOCKER-008" }
  },
  {
    content: "LECCIÓN BLOCKER-009 (Referencias Externas Inventadas): El enjambre aluminó que LFC tiene 'contrato preexistente con la Universidad Nacional de Colombia', citó el 'Decreto 1467/2012' como fundamento de plazos e inventó el 'Proyecto 298 BLLA 298'. Ninguna de estas referencias existe en el proyecto. REGLA: Toda referencia a entidades externas (universidades, decretos no citados en el contrato, proyectos con códigos alfanuméricos no reconocidos) debe ser rechazada y verificada contra la jerarquía documental Sección 1.2(d). El plazo de preconstrucción se rige por la Sección 3.8(a)(i), no por ningún decreto externo.",
    metadata: { type: "lesson", category: "legal", rule: "BLOCKER-009" }
  },
  {
    content: "LECCIÓN DT-040 (CAPEX ATP Embarcado — Blindaje Final): El valor fijo para Sistemas ATP embarcados es de $726.000.000 COP (aprox. $181.500 USD) por locomotora (WBS v2.9, Partida 6.1.100). Cualquier propuesta de '2.5 MM USD' es una alucinación destructiva y debe ser rechazada automáticamente. La recuperación de esta inversión está garantizada por el Apéndice Financiero 4, Capítulo I, Numeral (ii)(a).",
    metadata: { type: "lesson", category: "finance", rule: "DT-040" }
  },
  {
    content: "LECCIÓN DT-041 (Interoperabilidad FENOCO — No es opcional): La Resolución 20243040046045 y la política de FENOCO son parte vinculante del Contrato vía Sección 2.209. Prohibido tratarlas como 'referenciales'. La falta de información de terceros NO exime a LFC del cumplimiento del cronograma (Sección 3.9(a)(xi)).",
    metadata: { type: "lesson", category: "legal", rule: "DT-041" }
  },
  {
    content: "LECCIÓN DT-042 (Cronología de Valla Mínima — Acta de Inicio): El Acta de Inicio se firmó el 01-ago-2025. Es administrativamente imposible e ilegal recomendar órdenes de compra antes de esa fecha (ej. '30-abr-2025'). Toda fecha de hito debe ser >= 01-ago-2025 y <= 01-nov-2026 (fin fase preconstrucción).",
    metadata: { type: "lesson", category: "legal", rule: "DT-042" }
  },
  {
    content: "LECCIÓN DT-043 (Puesta a Punto Embarcada — Obligación Taxativa): La instalación de equipos de control de tráfico a bordo (radios, GPS, DMI) no es un 'requisito adicional'; es el núcleo de la Puesta a Punto según AT1 Cap. V Numeral 5.1 y Sección 2.201. Cualquier intento de negarla es un incumplimiento directo.",
    metadata: { type: "lesson", category: "technical", rule: "DT-043" }
  },
  {
    content: "LECCIÓN DT-044 (Debida Diligencia — Prohibición de Excusas): Bajo la Sección 3.9(a)(xi) y (xii), LFC declaró haber investigado todos los riesgos y aceptó que la falta de información de terceros (FENOCO/ANI) NO lo exime de responsabilidad. Prohibido proponer paralizar compras para 'solicitar claridad'.",
    metadata: { type: "lesson", category: "legal", rule: "DT-044" }
  },
  {
    content: "LECCIÓN DT-045 (Uso de la Sección 1.2.d): La Sección 1.2(d) consagra únicamente el Orden de Prelación (Jerarquía Documental). Prohibido usarla para argumentar que una obligación técnica no existe solo porque no está listada nominalmente en esa cláusula específica.",
    metadata: { type: "lesson", category: "legal", rule: "DT-045" }
  },
  {
    content: "LECCIÓN DT-046 (Alucinación 'BILBA'): El enjambre inventó el término 'BILBA' para referirse a la Biblia Legal o Sección 1.2(d). Este término NO existe y es una alucinación pura. Referencia correcta: Biblia Legal, Jerarquía Documental o Sección 1.2(d) del Contrato.",
    metadata: { type: "lesson", category: "format", rule: "DT-046" }
  },
  {
    content: "LECCIÓN DT-047 (Infiltración de Jerga IA - Purity Breach): El agente incluyó en el texto técnico/jurídico términos de su propia infraestructura (Supabase, base vectorial, RAG-First, skill de auditor). Esto es una violación crítica de la pureza documental. El DT debe ser 100% técnico-jurídico, sin rastro de la herramienta de IA que lo generó (R-HARD-14).",
    metadata: { type: "lesson", category: "format", rule: "DT-047" }
  },
  {
    content: "LECCIÓN DT-048 (Falsos Números de Contrato): El agente citó el 'Contrato No. 201/2025'. El único marco vinculante es el Contrato APP No. 001 de 2025. Inventar números de contrato es un error bloqueante Nivel 1.",
    metadata: { type: "lesson", category: "legal", rule: "DT-048" }
  },
  {
    content: "LECCIÓN DT-049 (Reincidencia en la Negación de AT1 Cap V 5.1): Por tercera vez, el enjambre afirmó que la obligación de equipos a bordo no existe en el contrato. REGLA MADRE: La cita de AT1, Capítulo V, Numeral 5.1 es el fundamento técnico de Nivel 2 que obliga al equipamiento embarcado. Cualquier documento que lo niegue es un colapso de razonamiento.",
    metadata: { type: "lesson", category: "legal", rule: "DT-049" }
  },
  {
    content: "LECCIÓN DT-050 (Distorsión de la Jerarquía 1.2.d para Exoneración): El agente usa la jerarquía legal para argumentar que si una obligación técnica no está en el Nivel 1, no es exigible. Esto es falso: el Nivel 2 (Apéndices Técnicos) es vinculante y define el alcance del proyecto. La Sección 1.2(d) resuelve conflictos, no borra obligaciones del Nivel 2.",
    metadata: { type: "lesson", category: "legal", rule: "DT-050" }
  },
  {
    content: "LECCIÓN DT-051 (Rechazo a Tracción Eléctrica/Catenarias): LFC es un Proyecto de tracción Diésel-Eléctrica. No hay catenarias ni electrificación. Todo documento que mencione 'Catenaria' o 'Sistemas de Energía de Tracción' es una alucinación técnica que debe ser rechazada de inmediato.",
    metadata: { type: "lesson", category: "technical", rule: "DT-051" }
  },
  {
    content: "LECCIÓN DT-052 (Alucinación 'Expediente PEÓN'): El agente inventó la existencia de un 'Expediente PEÓN' o 'Propuesta de Revisión Forense – Expediente PEÓN'. Esta nomenclatura no existe en la WBS ni en el Contrato. Solo se aceptan entregables contractuales reales.",
    metadata: { type: "lesson", category: "format", rule: "DT-052" }
  },
  {
    content: "LECCIÓN DT-053 (Tipología del Contrato Soberano): El nombre jurídico es 'Contrato de Concesión bajo el esquema de APP No. 001 de 2025'. Prohibido llamarlo 'Contrato de Servicios'. Este error invalida la validez legal del dictamen.",
    metadata: { type: "lesson", category: "legal", rule: "DT-053" }
  }
];

async function seed() {
  console.log("[LTM] Iniciando siembra de memoria genética...");
  for (const lesson of lessons) {
    try {
      console.log(`[LTM] Vectorizando lección: ${lesson.metadata.type} - ${lesson.metadata.category}...`);
      const vector = await obtenerEmbedding(lesson.content);
      await pool.query(
        "INSERT INTO sicc_genetic_memory (content, metadata, embedding) VALUES ($1, $2, $3)",
        [lesson.content, JSON.stringify(lesson.metadata), `[${vector.join(',')}]`]
      );
      console.log(`[LTM] ✅ Lección inyectada.`);
    } catch (e) {
      console.error(`[LTM] ❌ Error inyectando lección: ${e.message}`);
    }
  }
  pool.end();
}

seed();
