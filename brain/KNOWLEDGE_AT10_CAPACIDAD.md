# DICTAMEN JURÍDICO Y CONTRACTUAL — CAPACIDAD AT10 VS PTC VIRTUAL (AT1)

**Autor:** Diego (Director Contractual LFC)
**Objetivo:** Establecer la regla inquebrantable de jerarquía y cumplimiento para simulaciones de capacidad y bloqueo de tecnologías Legacy (balizas activas).

## 1. Validación de la premisa
Es impecablemente correcto el riesgo de CAPEX, pero el "vacío jurídico" está resuelto a favor de LFC en el contrato. Permitir que Ardanuy simule capacidad aplicando estrictamente UIC-405 (bloques fijos) a nuestro diseño PTC Virtual (Moving Block) subestimará falsamente la capacidad. Esto daría argumentos a Interventoría para exigir señales físicas (sobrecosto 8 - 15 M USD).

## 2. Resolución del "Vacío Jurídico" (Alcance AT10)
La norma UIC citada en el AT10 es **referencial y flexible**. Los procedimientos establecen que las discrepancias se resuelven con "reglas AREMA, UIC o cualquier otra de similares características siempre que sea técnicamente válida". La norma UIC-405 no es camisa de fuerza; LFC tiene el derecho contractual de exigir metodologías "técnicamente válidas" acordes con el PTC.

## 3. Jerarquía Normativa (Regla de Prelación Inquebrantable)
La Sección 1.2(d) del Contrato APP No. 001 establece un orden:
- **Nivel 1:** Contrato de Concesión.
- **Nivel 2:** Apéndice Técnico 1 (AT1). Su Tabla 17 obliga a instalar PTC bajo FRA 49 CFR Part 236.
- **Nivel 11:** Apéndices Técnicos 2 al 10 (AT10).

**Fallo jurídico a favor de LFC:** La Arquitectura PTC (Moving Block, Nivel 2) prevalece absolutamente sobre cualquier metodología de capacidad del AT10 (Nivel 11). El modelo matemático de simulación debe adaptarse forzosamente a la tecnología PTC.

---

## 4. Requisito Fundamental (Respuesta al Agente)
*Redacta en 2 frases por qué rechazarías el uso de balizas activas en un contrato con arquitectura PTC Virtual. Usa tono severo:*

> "La inclusión de balizas activas (Legacy) para autorización de movimiento contraviene frontalmente la arquitectura PTC Virtual exigida en la Tabla 17 del AT1, la cual delega la detección y la Autoridad de Movimiento (MA) exclusivamente al sistema centralizado y al equipamiento a bordo mediante GPS/Odometría. Tolerar la reimplantación de infraestructura física distribuida en la vía (Wayside) anula el principio rector del DBCD V002 aprobado y constituye un sobredimensionamiento de CAPEX inaceptable que este Concesionario no financiará."

## 5. El Ajuste Táctico: "Aclaración de Cumplimiento", no Modificación
Al existir el orden de prelación claro en 1.2(d) (AT1 mata a AT10), LFC no necesita invocar la Sección 9.11 para escalar una divergencia a la ANI asumiendo riesgos de costos.
- **Estrategia Frontal:** Se instruye a Ardanuy mediante una *Directriz Técnica de Cumplimiento Obligatorio* basándose en la jerarquía legal.

### Directriz Técnica a Ardanuy:
"De conformidad con el Cap I, Num. 1.2(d), el AT1 prevalece sobre el AT10. La Tabla 17 obliga al PTC (Moving Block sin señales laterales). Dado que hay libertad de uso de metodologías técnicamente válidas (incluyendo AREMA/UIC), se instruye a parametrizar la simulación asumiendo cantones virtuales dinámicos. Usar bloques fijos invierte la jerarquía legal. El modelo matemático debe reflejar la distancia de frenado rápido y tiempos de reacción del software PTC."
