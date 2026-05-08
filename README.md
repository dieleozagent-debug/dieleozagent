# 🧠 Agente SICC v14.8.8 — Auditor Forense Contractual

**Cerebro forense para el Proyecto LFC2 (La Dorada–Chiriguaná)**
Genera **Decisiones Técnicas (DT)** auditadas contra el Contrato APP No. 001 de 2025, sus Apéndices y el documento "Bases de Diseño - CTSC (2)" (BCD V001 abril 2026). Las DT aprobadas se promueven al repo LFC2 y se publican en Vercel.

> **Cambios v14.8.8 (2026-05-08):** RAG `contrato_documentos` purgado completo (7,661 → 286 chunks) y re-vectorizado SOLO con BCD V001 (decisión Diego: los .md del Contrato/Apéndices tienen huecos vs PDFs originales). Anclaje del MCP NotebookLM pide al Oráculo cita SEPARADA por nivel (Contrato / Apéndices / BCD) para evitar mezclas tipo "AT1 §6.1.1 (BCD)". Timeout MCP subido de 90s a 240s — la pregunta estructurada tarda más legítimamente.

> **Nota terminológica:** la sigla del sistema en cara externa es **SCC** (Sistema de Comunicación, Control de Tráfico y Señalización — sigla contractual del BCD v001). "SICC" se reserva como marca interna del agente y NO debe aparecer en DTs publicados — colisiona con el SICC del AT4 (Sistema de Indicadores).

---

## 🚀 Cómo se usa el agente

### 1) Pre-requisitos

```bash
# Containers en marcha
docker ps | grep -E "dieleozagent|notebooklm|sicc-postgres"

# Esperás ver:
#   dieleozagent-debug-dieleozagent-1   Up X (bot Telegram)
#   notebooklm-mcp-v12                  Up X (Oráculo externo)
#   sicc-postgres                       Up X (RAG pgvector :5432)
```

Si alguno está caído: `docker compose up -d` desde `/home/administrador/docker/agente/`.

### 2) Lanzar una auditoría forense (genera una DT)

Desde Telegram (bot `agentez`, chat autorizado userId `1567740382`):

```
/audit fibra
/audit señalización
/audit comunicaciones
/audit energía
/audit pasos_a_nivel
/audit fenoco
/audit cco
/audit material_rodante
```

**Flujo del comando** (`scripts/swarm-pilot.js`):
```
Fase 0   → RAG Supabase: chunks crudos del SSoT por especialidad
Fase 0.5 → Destilador (anti-alucinación): "Ficha de Mandatos Literales"
Ciclo 1-3:
  Fase 1 → Generación de borrador DT (LLM con vacunas v14.8 + identity + metodología)
  Fase 2 → Auditoría forense:
            • RAG interno (consistencia con Supabase)
            • Oráculo NotebookLM (verdad externa, con anclaje contractual)
  Fase 3 → Juez SICC: APROBADO o RECHAZADO + lección al ciclo siguiente
Si APROBADO → guardar en brain/dictamenes/ + vectorizar veredicto en RAG
Si RECHAZADO 3 veces → guardar en brain/PENDING_DTS/ con última lección
```

Tiempo esperado: 5-10 minutos por especialidad.

### 3) Validar el DT generado

Antes de promover al LFC2, **validá manualmente** el contenido contra las vacunas:

```bash
cd /home/administrador/docker/agente

# Listar DTs aprobados pendientes de revisión humana
ls -la brain/dictamenes/

# Inspeccionar contenido de un DT
cat brain/dictamenes/DT-COMS-2026-XXX_*.md

# Grep alucinaciones residuales (deberían dar VACÍO)
grep -E "100% por la ANI|detección de isla|Checklist V3.5|Sistema SICC v|Vital IP|Soberano|Sovereign|We must not use|DT-TEL-2026-007|DT-SICC-2026-022" brain/dictamenes/*.md
```

Si hay match → mover a `brain/REJECTED_DTS/` con razón en `_INDEX.md` y volver a lanzar `/audit`.

### 4) Promover una DT aprobada al LFC2 (CI/CD)

```
/promote DT-COMS-2026-XXX
```

Esto ejecuta:
- `gitlocal.js` copia el DT desde `agente/brain/dictamenes/` → `LFC2/II_A_Analisis_Contractual/dictamenes/`
- `git push origin main` al repo LFC2
- Vercel auto-deploy (~2 min)

### 5) Scripts de prueba (sin pasar por Telegram)

```bash
# Probar la cascada de proveedores LLM (saluda y reporta cuál responde)
docker exec dieleozagent-debug-dieleozagent-1 node scripts/probar-cascada.js
docker exec dieleozagent-debug-dieleozagent-1 node scripts/probar-cascada.js "Tu pregunta aquí"

# Probar el Oráculo NotebookLM con anclaje contractual
docker exec dieleozagent-debug-dieleozagent-1 node scripts/probar-mcp.js
docker exec dieleozagent-debug-dieleozagent-1 node scripts/probar-mcp.js "¿Cuántos hilos de fibra?"
```

### 6) Otros comandos útiles desde Telegram

| Comando | Función |
|---|---|
| `/doctor` | Telemetría, carga CPU (gobernador), estado de cuotas API |
| `/cerebro` | Estado de Mandatos Maestros, Identidad, Memoria Genética |
| `hola` / `me pierdo` | Menú de ayuda y guía rápida del flujo |
| `qué sueños tienes pendientes` | Lista de DREAMS / PENDING_DTS |
| `qué DT tengo bloqueadas` | DTs aprobados sin promover, PENDING en revisión humana |

### 7) Mantenimiento — purgar el RAG

Si se detecta contaminación en `sicc_genetic_memory` (veredictos APROBADOS falsos del Juez heurístico):

```bash
# Inspeccionar fragmentos vectorizados
docker exec sicc-postgres psql -U sicc_app -d postgres_sicc -c \
  "SELECT id, metadata->>'area', metadata->>'estado', metadata->>'fecha' FROM sicc_genetic_memory ORDER BY id;"

# Eliminar veredicto contaminado por id
docker exec sicc-postgres psql -U sicc_app -d postgres_sicc -c \
  "DELETE FROM sicc_genetic_memory WHERE id IN (369, 370);"
```

Antes de re-lanzar un `/audit` sobre la misma área, eliminá el STATE para forzar audit limpio:

```bash
rm -f brain/STATE-fibra.json brain/DREAMS/FICHA-FIBRA.md
docker restart dieleozagent-debug-dieleozagent-1
```

---

## 📁 Estructura del cerebro (`brain/`)

| Carpeta | Contenido |
|---|---|
| `dictamenes/` | DTs aprobados pendientes de promoción al LFC2 |
| `REJECTED_DTS/` | DTs rechazados con manifest forense (`_INDEX.md`) — sirven de vacuna histórica |
| `PENDING_DTS/` | Borradores que tras 3 ciclos no aprobaron, esperan revisión humana |
| `SPECIALTIES/` | Vacunas técnicas por especialidad (8 archivos + transversales) |
| `DREAMS/` | Fichas de Mandatos Literales destiladas (1 por especialidad) |
| `history/` | Auditorías completas (1 archivo por audit) |
| `STATE-*.json` | Estado por especialidad (último borrador, status APPROVED/REJECTED, lección) |
| `NOTEBOOK_SOURCES_MAP.md` | Mapa verificado de las fuentes reales del notebook NotebookLM con jerarquía contractual |
| `R-HARD.md` | Restricciones duras universales |
| `IDENTITY.md` | Identidad/rol del agente |
| `SICC_METHODOLOGY.md` | Metodología `.42` |
| `ROADMAP.md` | Roadmap operativo y deuda activa |

### Vacunas en `brain/SPECIALTIES/` (v14.8.4)

| Archivo | Rol |
|---|---|
| `_LOOP_GUARD.md` | **Transversal** — anti-loop, anti-scratchpad, anti-firma versionada, lista de alucinaciones catalogadas |
| `CONTRACTUAL_NORMATIVE.md` | **Transversal** — doctrina DT, doble candado §25.4, §9.11 FENOCO, prelación AT3 vs TDR/Adenda, mapa de Apéndices, DBCD canónico |
| `EMBARCADO.md` | Flota GR12+U10+U18, Hardware Dual SIL-4, Stop & Switch operacional, EMC EN 50121-3-2 |
| `POWER.md` | UPS diferenciada (4h/24-48h), 110 V DC vital, RETIE 2024, segregación civil/vital |
| `SIGNALIZATION.md` | PTC virtual + 5 ENCE, 24 PaN protegidos (no 122), failover Barrancabermeja |
| `COMMUNICATIONS.md` | TETRA + Satelital LEO/GEO, EN 50159 Cat 3, FRA §236.1033 |
| `CONTROL_CENTER.md` | CCO La Dorada + failover, HMI FRA §236 Apéndice E |
| `ENCE.md` | Enclavamientos electrónicos en 5 estaciones nominadas |
| `INTEGRATION.md` | Interfaces ICD entre subsistemas |

> **Las dos transversales (`_LOOP_GUARD` y `CONTRACTUAL_NORMATIVE`) se cargan SIEMPRE** en cualquier `/audit`, independiente de la especialidad detectada (`scripts/sicc-multiplexer.js:getMultiplexedContext`).

---

## 🚨 Deuda activa (al 2026-05-08)

| # | Item | Estado |
|---|---|---|
| **D0** | YAML Sección 10 ejecutable en DTs (para `/promote` automático) | Pendiente — ajustar prompt del Auditor Forense |
| **D1** | Sanear código residual del agente (búsqueda de "64 hilos", "Vital IP" en `src/`) | Header de architecture corregido. Pendiente grep recursivo del resto del código. |
| **D2** | DTs legacy v8 en LFC2 ya eliminados | ✅ Cerrado el 2026-05-08 (vaciado de `LFC2/II_A_Analisis_Contractual/dictamenes/`). Pendiente regenerar con BCD v001. |
| **D3** | Re-ingesta `contrato_documentos` en pgvector con BCD v001 | Pendiente, requiere Vo.Bo. del Director Técnico UF2 |
| **D4** | Purga `sicc_genetic_memory` post-rechazo DTs alucinados | ✅ Cerrado el 2026-05-08 (6 fragmentos finales, solo RECHAZOS válidos) |
| **D5** | Juez heurístico → JSON estructurado (línea 342 swarm-pilot.js) | Pendiente. La heurística `tieneSi && !tieneNo` produce false positives |
| **D6** | Post-proceso `generarNombreDT()` para reemplazar ID inventado por LLM | Pendiente. Hoy cuerpo dice "DT-FIBRA-2026-001" y filename dice "DT-SICC-2026-001" |

Plan completo de regeneración de DTs en `brain/ROADMAP.md` sección "🟢 PLAN PENDIENTE — Regeneración de DTs en LFC2".

---

## 📊 Hitos recientes

- **2026-05-08 v14.8.4** — Anclaje contractual al MCP NotebookLM. `validarExternaNotebook()` prepende *"Responde según el Contrato APP 001/2025, sus Apéndices Técnicos y el documento 'Bases de Diseño - CTSC (2)'"* a TODA query. `construirRespuestaMCP()` parsea estructura completa (`data.answer` + metadata + chunks múltiples + filtra chatter). Validado E2E: pregunta "¿hilos de fibra?" pasa de "64 según DT-TEL-2026-007 (alucinación)" a "48 según AT3 §6.4 vinculante".
- **2026-05-08 v14.8.3** — Caps de truncado corregidos: NVIDIA 5k→12k, Juez razón 500→2000.
- **2026-05-08 v14.8.2** — Cap `specialtyContext` 8k→14k + multiplexer reordenado (CONTRACTUAL primero).
- **2026-05-08 v14.8.1** — Vacunas DBCD/AT4 en CONTRACTUAL §4.8/§4.9.
- **2026-05-08 v14.8** — `_LOOP_GUARD.md` (transversal), `EMBARCADO/POWER/SIGNALIZATION` reescritos. 3 DTs alucinados → `REJECTED_DTS/`.
- **2026-04-30 v14.7** — Cirugía Doctrinal: 13 ajustes FRA, 48h G.652.D, UPS 4h+24-48h, Stop & Switch operacional FENOCO.

---

**© 2026 OpenGravity SICC System | Agente v14.8.4**
