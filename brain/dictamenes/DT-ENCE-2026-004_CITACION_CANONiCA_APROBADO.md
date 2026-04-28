# DIRECTRIZ TÉCNICA DE DISEÑO

**Código:** DT-ENCE-2026-004
**Fecha:** 28 de abril de 2026
**Para:** Ardanuy Colombia S.A.S. — Att. Sr. Mauricio Mora / Sr. Oscar Andrés Rico Gómez
**Copia:** Sr. Jaime Coronado, Director EPC – Consorcio Constructor Línea Férrea Central
**De:** Dirección Técnica SICC – UF2 – LFC
**Referencia:** Contrato CCLF 00013-2026; Apéndice Técnico 1 (AT1) del Contrato APP No. 001 de 2025; Informe de Rechazo del Presupuesto V001 (LFC-UF2-CTSC-ED-QTO-CO-0001); Checklist V3.5; DBCD V003 (en elaboración).

**Asunto:** Régimen de motorización de cambiavías y alcance del enclavamiento electrónico aplicable al DBCD V003, Capítulo 10, y al BoQ asociado.

---

## 1. Instrucción

En los entregables del DBCD V003, en los planos de señalización, en las memorias técnicas y en el BoQ asociado del Sistema de Señalización, Control de Tráfico y Comunicaciones, Ardanuy diseñará el régimen de cambiavías del corredor bajo dos categorías exclusivas:

a) **Cambiavías motorizados gobernados por enclavamiento electrónico (ENCE):** únicamente dentro del perímetro operativo de las cinco (5) estaciones definidas en la Tabla 17 del AT1 (Zapatosa, García Cadena, Barrancabermeja, Pto Berrio – Grecia, La Dorada – México).

b) **Cambiavías autotalonables con comprobación de posición:** en la totalidad de apartaderos, desvíos y vías secundarias situados fuera del perímetro de los cinco nodos ENCE.

Esta es la única configuración admisible para los entregables de Ardanuy en el alcance contractual vigente.

## 2. Fundamento contractual

El Apéndice Técnico 1, Capítulo IV, establece que la operatividad en las estaciones de la Vía Férrea se define *“bien mediante enclavamiento electrónico o aplicación de desvíos libres o con dispositivo de autotalonamiento”*, y precisa que *“para efectos de las inversiones, las estaciones que deberán tener enclavamiento electrónico son las relacionadas en la Tabla 17”*.

La Tabla 17 del mismo Apéndice acota la obligación de inversión a *“Cinco (5) enclavamientos y bloqueo automáticos electrónico estructurado (ENCE) uno en cada una de las estaciones operativas: Zapatosa, García Cadena, Barrancabermeja, Pto Berrio – Grecia, La Dorada – México”*.

En consecuencia, la arquitectura PTC con cantonamiento virtual adoptada en el DBCD aprovecha la habilitación contractual de los desvíos libres y autotalonables para los tramos situados fuera de las cinco zonas ENCE, manteniendo el cumplimiento íntegro del alcance del AT1 y optimizando la inversión asociada al sistema.

## 3. Reglas de diseño aplicables al DBCD V003, Capítulo 10

3.1. **Motorización:** se admite exclusivamente dentro del perímetro de los cinco nodos ENCE. Toda motorización propuesta fuera de dicho perímetro deberá ser retirada de planos, memorias y BoQ.

3.2. **Cambiavías fuera de ENCE:** se especificarán como autotalonables con comprobación de posición. La comprobación deberá reportar la condición real del cambiavía al sistema PTC central por los canales de comunicación previstos en la arquitectura del corredor.

3.3. **Hardware vital wayside fuera de ENCE:** no se incluirán micro-enclavamientos, controladores de objetos distribuidos, circuitos de vía de detección continua ni gabinetes de potencia para motorización en los tramos intermedios. La lógica vital queda concentrada en los cinco ENCE conforme a la arquitectura aprobada.

3.4. **Coherencia con la arquitectura aprobada:** la asignación motorizado/autotalonable deberá quedar reflejada en la Tabla 2 del DBCD (Arquitectura Funcional del Sistema) y en los componentes de la sección Wayside, en consistencia con las versiones precedentes ya aprobadas del documento rector.

3.5. **Neutralidad tecnológica:** la especificación de los autotalonables y de su comprobación se redactará en términos de desempeño funcional, sin marcas, modelos ni protocolos propietarios.

## 4. Entregables y trazabilidad

Los siguientes entregables deberán reflejar las reglas de la sección 3:

a) Planos de distribución de cambiavías diferenciando, mediante simbología explícita, los gobernados por ENCE y los autotalonables con comprobación.

b) BoQ con líneas separadas para motorizaciones (limitadas a las cinco zonas ENCE) y para cambiavías autotalonables, sin partidas de motorización en tramos intermedios.

c) Memorias de cálculo eléctrico, de comunicaciones y de potencia ajustadas al hardware efectivamente requerido por la arquitectura, sin sobredimensionamientos asociados a equipamiento wayside no previsto.

d) Trazabilidad explícita en el DBCD V003, Capítulo 10, hacia el AT1 Capítulo IV y la Tabla 17.

## 5. Encaje con observaciones previas

La presente directriz materializa, en términos de instrucción de diseño, las observaciones formuladas a Ardanuy en el Informe de Rechazo del Presupuesto V001 (LFC-UF2-CTSC-ED-QTO-CO-0001) y en el Checklist V3.5 sobre los Criterios de Diseño V001. No las sustituye ni las modifica: las complementa al precisar la regla de diseño que debe aplicarse en la siguiente revisión de los entregables.

## 6. Vigencia y consultas

Esta directriz aplica a partir de la fecha de su emisión a todos los entregables en curso y subsecuentes del alcance CCLF 00013-2026. Las consultas técnicas se canalizarán a la Dirección Técnica SICC – UF2.