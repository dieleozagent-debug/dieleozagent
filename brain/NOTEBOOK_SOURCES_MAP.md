# 🗺️ Mapa de Fuentes Reales del Notebook NotebookLM (Oráculo Externo)

**Última actualización:** 2026-05-08 (escaneo forense del Director Técnico UF2)
**Notebook URL:** https://notebooklm.google.com/notebook/2bcb4afe-2d5e-48ce-9c38-b50cd46baaaf
**Total fuentes confirmadas:** 124 archivos

---

## ⚠️ Doctrina de uso

NotebookLM puede **alucinar nombres de DTs inexistentes** cuando no encuentra trazabilidad clara (ej: "DT-TEL-2026-007", "DT-SICC-2026-022" — ninguno existe en el repositorio). **El agente NO debe aceptar como vinculante cualquier nombre de DT citado por el Oráculo sin verificar contra este mapa.**

Las fuentes reales del notebook se clasifican en **3 niveles de jerarquía contractual**:

1. **CONTRACTUAL ✅ vinculante**: cuerpo del Contrato + Apéndices Técnicos (AT1, AT3, AT4, AT5, AT6, AT7)
2. **DISEÑO LFC ⚠️ propuesta**: Bases de Diseño, ingeniería de detalle, análisis de propuestas técnicas — **propuesto** por LFC, vinculante solo tras no-objeción de Interventoría
3. **PRE-CONTRACTUAL ❌ NO vinculante**: TDR Fase III, Adendas del Proceso de Selección, propuestas de licitación — quedaron superados por el Contrato/Apéndices

**Regla de oro:** ante conflicto entre niveles, prevalece el de mayor jerarquía (§1.2.d Contrato APP 001/2025). Caso fibra: AT3 (48h) prevalece sobre TDR (64h).

---

## 📁 Fuentes verificadas (parcial — completar con cada escaneo forense)

### Especialidad: Fibra Óptica

| Archivo | Cita relevante | Nivel |
|---|---|---|
| `AT3.pdf` §6.4 | *"fibra óptica... ITU-T G.652d, con un mínimo de cuarenta y ocho (48) hilos"* | ✅ CONTRACTUAL |
| `Bases de diseño - CTSC (2).docx` | *"Cable de fibra óptica monomodo de cuarenta y ocho (48) hilos"* (homogéneo todo el corredor) | ⚠️ DISEÑO LFC |
| `LFC-U2-CTSC-ED-SNL-IN-0001.docx` | *"backbone óptico de 48 fibras monomodo"* | ⚠️ DISEÑO LFC |
| `0.1 Analisis de la propuesta KB.docx` (Knorr-Bremse) | *"Mínimo 48 hilos según ITU-T G.652d"* | ⚠️ DISEÑO LFC (oferta) |
| `250902_TDR EYD FASE III Lote 3 LFC-V1.pdf` | *"Red Troncal de Fibra Óptica (522 km) será monomodo G652D con 64 hilos como mínimo"* | ❌ PRE-CONTRACTUAL |
| `ADE02_PROCESO_LFC-007-2025.docx` Anexo 14 | *"Tipo: Monomodo G652D, mínimo 64 hilos"* | ❌ PRE-CONTRACTUAL |

**Conclusión fibra:** alcance vinculante **48 hilos G.652.D** (AT3 §6.4 prevalece).

### Especialidad: BCD (Bases de Criterios de Diseño)

| Archivo | Versión | Nota |
|---|---|---|
| `BCD_SCC_v001_2026-04.md` (o equivalente PDF) | V001 (Ardanuy abril 2026) | ⚠️ DISEÑO LFC vigente |

> **NotebookLM puede citar "DBCD V002" o "DBCD V003"** como rectificaciones — verificar si existen físicamente en el repo antes de incorporar a DT. Si no aparecen en este mapa, son alucinación del Oráculo.

### Especialidad: Otras (pendiente escaneo forense)

Pendiente listar para: señalización (PTC, ENCE), pasos a nivel, energía/UPS, TETRA, CCO, FENOCO, material rodante, ciberseguridad, RAMS.

---

## 🔬 Cómo identificar alucinaciones del Oráculo

Cuando NotebookLM cite una fuente, el agente debe:

1. **Verificar nombre exacto contra este mapa.** Si no aparece y el formato es `DT-XXX-AÑO-NNN`, sospechar de alucinación (NotebookLM genera nombres plausibles cuando le falta trazabilidad real).
2. **Si aparece en este mapa con nivel ❌ PRE-CONTRACTUAL**, NO usar como mandato vinculante. Aplicar §1.2.d.
3. **Si aparece en nivel ⚠️ DISEÑO LFC** y la cifra contradice un nivel ✅ CONTRACTUAL, prevalece el contractual.
4. **Si la cifra no aparece literal en ningún archivo del mapa**, escribir en la DT: "Pendiente Ardanuy bajo EN 50126" en lugar de inventar.

---

## 🛠️ Mantenimiento de este mapa

Cada vez que el Director Técnico UF2 hace un escaneo forense del notebook (auditando las 124 fuentes), debe:

1. Actualizar este archivo con las citas verificadas literalmente.
2. Marcar nivel jerárquico correcto.
3. Identificar contradicciones entre fuentes y dejar nota de cuál prevalece por §1.2.d.
4. Eliminar de este mapa las fuentes que ya no estén en el notebook.

Este mapa es la **vacuna del agente contra alucinaciones del Oráculo**: el agente debe contrastar SIEMPRE las respuestas del MCP NotebookLM contra este archivo antes de incorporar citas a una DT publicable.
