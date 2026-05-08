# 🏛️ Arquitectura del Agente — Auditor Forense LFC2

El **Agente** es un sistema autónomo de auditoría técnica y jurídica del proyecto LFC2. Ejecuta el bucle `/audit [área]` → genera DT (Decisión Técnica) → `/promote` la sincroniza al repo LFC2 y la despliega en Vercel.

> **Nota terminológica (2026-05-08):** este documento usa la sigla **SCC** (Sistema de Comunicación, Control de Tráfico y Señalización) tal como la define el **BCD v001** del contrato — alcance contractual UF2. Cualquier referencia residual a "SICC" en código/strings internos del agente es marca interna doctrinal del proyecto OpenGravity (no confundir con el SICC del AT4, que es el Sistema de Indicadores de Calidad/Cumplimiento).

---

## 🏛️ FUENTE DE VERDAD SUPREMA (SSoT)
Desde el 2026-05-05, el sistema se rige por el **BCD v001 (Abril 2026)**. La verdad técnica es innegociable frente a alucinaciones o normas obsoletas.

### 🛰️ Directrices Técnicas de Diseño (SSoT v14.7 · BCD-aligned)
- **TROCHA:** Vía única de **914 mm** (yarda).
- **FIBRA ÓPTICA:** Backbone de **48 hilos** G.652.D soterrado (BCD §6.1.1, NO 64h). OTDR en 1310/1550/1625 nm.
- **PASOS A NIVEL:** **24 Protegidos** (9 Tipo C + 15 Tipo B). Los 122 PaN básicos restantes están **fuera del alcance SCC** (BCD §8.2).
- **ENCE:** 5 estaciones nominadas (Zapatosa, García Cadena, Barrancabermeja, Pto Berrío–Grecia, La Dorada–México). Tabla 17 AT1.
- **PTC:** Virtual Fixed Block §236.1005. Prohibido "Moving Block".
- **COMMS:** TETRA primario + Satelital LEO/GEO redundante.
- **POWER:** UPS diferenciada por bloque BCD §10 — **4h** señalización/CCO/PaN (110V DC) y **24-48h** TETRA (48V DC). NO homogeneizar.
- **CCO:** La Dorada (Principal) + Barrancabermeja (Failover, deuda LFC, no exigido por BCD).
- **INTEROPERABILIDAD:** **Stop & Switch** operacional en Chiriguaná (BCD §9.2). NO integración técnica con sistemas FENOCO.

---

## 🛰️ Topología de Red (Nodo Único Soberano)

| Servicio | Contenedor / Proceso | Puerto | Función |
| :--- | :--- | :--- | :--- |
| **Agente Core** | `node src/index.js` | — | Orquestación SICC |
| **Oracle NotebookLM** | `notebooklm-mcp-v12` | 3001 (SSE) | Verdad Externa (DBCD v001) |
| **Base de Datos** | `sicc-postgres` | 5432 | pgvector (10.358 fragmentos) |
| **Embeddings** | Gemini `embedding-001` | — | Vectorización forense |

---

## 🌪️ Bucle de Auditoría Forense SICC v14.7 — `/audit [área]`

```
/audit señalizacion
    │
    ▼ FASE 0: Extracción RAG (Supabase + NotebookLM)
    │
    ▼ FASE 0.5: Destilación BCD v001 (Mandatos Innegociables)
    │
    ▼ FASE 1: Generación de DT con Citación Canónica
    │
    ▼ FASE 2: Validación Triple (Técnico / Legal / Coordinador)
    │
    ▼ FASE 3: Juez SICC v14.7 (Consenso Soberano)
    │
    ▼ FASE 4: Persistencia & CI/CD (/promote)
```

---

## ⚖️ Mandatos del Agente (Blindaje Anti-Scope Creep)

1. **CAPEX Blindado:** Ningún dictamen puede proponer over-engineering (ej: 24h UPS en señalización donde BCD §10 dice 4h, o 64h fibra donde BCD §6.1.1 dice 48h) sin DT de justificación costo-beneficio.
2. **Normativa:** FRA 49 CFR Part 236 Subpart I prevalece sobre CENELEC/UIC para señalización; AREMA > FRA > AAR > UIC para infraestructura.
3. **TRM Risk:** Presupuesto calculado a **4.400 COP/USD** (techo cobertura cambiaria).
4. **Sigla del sistema:** los DTs nuevos deben usar **SCC** (sigla contractual BCD v001) en cara externa al gerente/Interventoría/ANI. La marca interna "SICC" se reserva para metadata interna del agente.

---

## 🚨 Estado de los DTs publicados en LFC2 (2026-05-08)

Los DTs actualmente publicados en `https://lfc-2.vercel.app/II_A_Analisis_Contractual/dictamenes/` son **producto v8 pre-purga** generados durante pruebas tempranas de `/promote` (antes de la cirugía v14.7 del 2026-04-30). Su contenido tiene terminología obsoleta:

- "Bus Vital 110V DC" (vs BCD §10 que diferencia 110V DC señalización + 48V DC TETRA)
- "Red Vital IP" (terminología purgada)
- "PTC Virtual (SICC) L2" (mezcla SICC con SCC)
- "Soberanía Integral", "Sovereign", "Soberano" (lenguaje doctrinal interno, no contractual)
- "[REDACTADO_SICC]" (placeholders incompletos)
- "DT-SICC-V8-*" (naming legacy)
- Cifras "CAPEX Protegido $X M USD" sin trazabilidad WBS

**Estos DTs son alucinaciones legacy** del agente operando con doctrina pre-BCD v001. No representan la línea base actual del proyecto.

**Plan de saneamiento:**
1. Cerrar deuda D1 (alinear architecture.md y código a BCD v001).
2. Ejecutar `/audit` por especialidad con SSoT v14.7.
3. `/promote` regenera DTs con cita literal BCD v001 + sigla SCC + cifras trazables al WBS.
4. Reescribir `dictamenes/index.html` en LFC2 con lenguaje corporativo.
5. Restaurar al sidebar gerencial de LFC2 (hoy quitado, commit `c7dcd19`).

---

*Actualizado: 2026-05-08 | OpenGravity Agente v14.7 — BCD-aligned Edition*
