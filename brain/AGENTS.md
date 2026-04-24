# 🤖 AGENTS.md — Manual Operativo & Reglas de Inferencia (SICC v14.0)

Este documento define las **Restricciones Duras de Prompt** y los protocolos de operación de los agentes SICC. El incumplimiento de estas reglas anula cualquier dictamen técnico.

## 🚨 RESTRICCIONES DURAS (System Prompt — No Negociables)

### R-HARD-01 | CAPEX ATP Embarcado
- **Valor único válido**: `$726.000.000 COP por locomotora` (WBS v3.0, Partida 6.1.100).
- Cualquier cifra superior es rechazo automático por inviabilidad financiera.

### R-HARD-02 | Purga de Terminología IA y Legacy
- **PROHIBIDOS**: `Michelin Certified`, `Karpathy Loop`, `Soul`, `Soberano`, `Dreamer`, `Peones`, `Veredicto del Asesor`, `Cámara de Doble Ciego`, `Enjambre`.
- Los documentos generados deben ser puramente técnicos y jurídicos, libres de meta-narrativas de IA.

### R-HARD-03 | Jerarquía Normativa (Gobernanza Técnica)
Orden de prelación innegociable (Sección 1.2d + AT3):
1. **Contrato de Concesión APP 001/2025** (y documentos prevalentes).
2. **Apéndice Técnico 1 (AT1)** — Alcance y Funcionalidad.
3. **Apéndice Técnico 3 (AT3)** — Criterios de Diseño y Normativa.
4. **Bases y Criterios de Diseño (DBCD)**.
5. **Normas Técnicas** (AREMA > FRA > AAR > UIC).

### R-HARD-04 | Arquitectura de Señalización y Redes
- **Proyecto**: Corredor Férreo La Dorada – Chiriguaná (**UF2**).
- **Principio**: **Arquitectura PTC con Cantonamiento Virtual** (Moving Block) + Cantonamiento Físico en las 5 zonas ENCE (Tabla 17 AT1).
- **Interoperabilidad**: Garantizar continuidad con la red **FENOCO S.A.** en el punto de interconexión norte.
- **Tracción**: 100% Diésel-Eléctrica. Prohibido mencionar catenarias.
- **Redes**: Estándares IEEE 802.x, ITU-T G.652.D y EN 50159 Categoría 3.

### R-HARD-05 | Ventana Temporal de Hitos
- **Fecha de Inicio**: 01-ago-2025 (Acta de Inicio).
- **Hito Fatal**: 01-nov-2026 (Fin de Preconstrucción).

### R-HARD-06 | Integridad Operativa de la UF2
- **Mandato**: La entrada en operación del sistema PTC/CTC es **integral** para la totalidad de la UF2.
- **Prohibición**: Se prohíbe proponer o aceptar "entregas operativas parciales" por UFVF. La sectorización geográfica es solo para inventario.

## 🌪️ Protocolos de Operación

### 1. Ciclo de Auditoría (`/audit`)
Los agentes deben ejecutar un proceso de validación cruzada:
1. **Inyección de Historial**: Cargar lecciones aprendidas de auditorías previas.
2. **Generación Forense**: Construir el dictamen basado exclusivamente en la Biblia Legal y especialidades.
3. **Verificación Contractual**: Validar contra el Oracle y RAG que no haya alucinaciones sobre el contrato.
4. **Veredicto Juez**: Un agente Juez aprueba o rechaza basándose en el cumplimiento de las **R-HARD**.

### 2. Saneamiento Cognitivo
Tras cada rechazo, se debe inyectar una **Lección de Auditoría** en el archivo de especialidad correspondiente (`brain/SPECIALTIES/`).

### 3. Citación Canónica Obligatoria
Formato: `[Documento] → [Capítulo] → [Numeral] → [Literal] → [Texto]`.

---
*Actualizado: 2026-04-24 | SICC v14.0 — Sede Santa Marta*
