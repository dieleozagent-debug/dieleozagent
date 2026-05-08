# 🚂 ESPECIALIDAD: EMBARCADO / MATERIAL RODANTE — v14.8
## EQUIPOS EMBARCADOS (ON-BOARD PTC)

> [!CAUTION]
> **VACUNAS ANTI-ALUCINACIÓN (v14.8 · 2026-05-08)**
>
> 1. **Flota tractiva COMPLETA y FIJA:** GR12 + U10 + U18. La U18 va por **Factor de Calidad** (compromiso del Concesionario, no exigida contractualmente). **PROHIBIDO emitir DTs que limiten la flota a "GR12 y U10"** — eso contradice las observaciones radicadas a Ardanuy (`obs_snl.txt`) y abre exposición a que Ardanuy argumente "Diego nos firmó GR12+U10".
>
> 2. **NO confundir Stop & Switch con Hardware Dual:**
>    - **Stop & Switch** = procedimiento operacional de interoperabilidad en interfaz FENOCO Chiriguaná (BCD §9.2). Es decir: el tren para, el operador conmuta cabina, sigue. NO es hardware.
>    - **Hardware Dual** = arquitectura OBC verificada: OBC LFC + OBC FENOCO con Nivel SIL-4. Vive en la locomotora, NO en la frontera operacional.
>    - **PROHIBIDO** describir "Stop & Switch como arquitectura de hardware OBC dual para evitar vendor lock-in". Si firmas esa confusión, Ardanuy argumentará que "ya estaba la conmutación" y eludirá el Hardware Dual real.
>
> 3. **DT scope quirúrgico:** una DT de EMBARCADO trata SOLO del subsistema embarcado. **PROHIBIDO mezclar wayside + backbone + interoperabilidad en el mismo cuerpo.** Excluir explícitamente del cuerpo de un DT-EMBARCADO: contadores de ejes wayside, microondas, catenaria, gateway ITCS/Alstom, DWDM/G.655/EDFA, fibra G.652.D backbone (es wayside, no embarcado). Estas exclusiones, si se documentan, van como "fuera de scope" en una sola línea, no como objeto de la DT.
>
> 4. **Doctrina DT — cuándo emitir:** SOLO cuando hay **conflicto de jerarquía documental** que la prelación contractual resuelve. Si los parámetros están **pendientes de no-objeción** (ej. DBCD V003 en drafting) o son propuestas tuyas en proceso, **NO emitir DT** — usa DBCD o ACC observation. Emitir DT auto-impone obligaciones de O&M de 30 años sobre parámetros aún en revisión.

> [!IMPORTANT]
> **ARQUITECTURA VINCULANTE EMBARCADO (cuando aplique en DT):**
> - **OBC Dual:** OBC LFC (PTC virtual FRA Subpart I) + OBC FENOCO (interoperabilidad propietaria) instalados en cada locomotora tractiva GR12, U10 y U18.
> - **Nivel de seguridad funcional:** SIL-4 según marco **CENELEC EN 50126/50128/50129**, **subordinado** al marco rector **FRA 49 CFR Part 236 Subpart I** (Type Approval + PTCSP). Formulación correcta: *"FRA 49 CFR Part 236 Subpart I como marco rector PTC; criterios de seguridad funcional según CENELEC EN 50126/50128/50129 (SIL-4 para núcleo OBC)"*.
> - **DMI Unificada SIL-2:** una sola interfaz humano-máquina por locomotora.
> - **Dispositivo EOT** (End-of-Train) o equivalente HOT-EOT.
> - **Comunicación tren-tierra embarcada:** TETRA primario + Satelital LEO/GEO redundante. NO fibra óptica (es wayside).
> - **EMC embarcado:** **EN 50121-3-2** (Apparatus on board rolling stock) o equivalente AREMA C&S Manual / AAR. **NO CISPR 22/24** (esas son para ITE — Information Technology Equipment estacionario).

---

## 🚫 LISTA NEGRA — Tecnologías que NO aplican a EMBARCADO

| Tecnología | Aplica a | NUNCA citar en DT-EMBARCADO |
|---|---|---|
| ITU-T G.652.D | Backbone wayside (fibra óptica enterrada) | ✅ excluir explícitamente si surge |
| CISPR 22:2008 / CISPR 24:2010 | ITE estacionario (servidores, switches) | ✅ usar EN 50121-3-2 en su lugar |
| IEEE 1100, 802.3, 802.1 | Redes IP/Ethernet de campus | ✅ no fijar como mandato — pertenece a PTCSP/Bases de Diseño |
| Contadores de ejes | Detección wayside | ✅ excluir, es de SIGNALIZATION |
| Microondas / catenaria | Infraestructura wayside | ✅ excluir |
| Gateway ITCS/Alstom | Integración propietaria FENOCO | ✅ **PROHIBIDO** (BCD §9.1) |
| DWDM/G.655/EDFA | Backbone óptico avanzado | ✅ excluir, es de COMMUNICATIONS |

---

## 1. INSTRUCCIÓN DE DISEÑO (cuando aplique DT-EMBARCADO)
- Diseñar el equipamiento a bordo PTC única y exclusivamente para el Material Rodante Tractivo sujeto a Puesta a Punto: locomotoras **GR12, U10 y U18** (esta última por Factor de Calidad del Concesionario).
- Implementar **Hardware Dual** (OBC LFC + OBC FENOCO) en cada locomotora, con SIL-4 bajo marco CENELEC subordinado a FRA Subpart I.
- Integrar **DMI Unificada SIL-2** y dispositivo **EOT**.
- Garantizar interoperabilidad operacional en Chiriguaná mediante el procedimiento **Stop & Switch** (operacional, NO hardware).
- **PROHIBIDO** desarrollar pasarelas de software (Gateways) hacia sistemas de terceros (BCD §9.1, AT1).
- **PROHIBIDO** extender obligación PTC al material remolcado (góndolas, vagones).

---

## 2. FUNDAMENTO CONTRACTUAL Y NORMATIVO

> [!WARNING]
> **PROHIBIDO** citar como literal del Contrato algo que NO has verificado contra el texto fuente. Si el agente parafrasea, declarar "(paráfrasis)". El campo "[Texto literal]" del fundamento debe contener literal entre comillas, NO paráfrasis.

1. **Contrato APP 001/2025 → Sección 3.1(a)(ii)** (objeto del contrato) — **literal completo, NO mutilar:** *"(ii) la Puesta a Punto, Operación y Mantenimiento del Material Rodante del Proyecto y la Prestación del Servicio Público de Transporte Ferroviario de Carga"*. **PROHIBIDO** omitir "Operación y Mantenimiento" en la cita.
2. **AT1 → Capítulo V → Numeral 5.1 y 5.3** — delimita la flota tractiva. **VERIFICAR contra texto fuente** antes de citar como literal; en su defecto, marcar como paráfrasis.
3. **FRA 49 CFR Part 236 Subpart I** — marco rector PTC.
4. **CENELEC EN 50126/50128/50129** — SIL-4 para núcleo OBC, subordinado a FRA.
5. **EN 50121-3-2** — EMC apparatus on board rolling stock.
6. **Resolución de Surcos Art. 5** — compatibilidad operacional embarcada.

> [!CAUTION]
> **PROHIBIDO citar como mandato técnico:**
> - **Apéndice Financiero 4 (AF4):** su nombre real es *"Amortización Material Rodante del Proyecto"*. Regula mecanismo financiero, **NO** obligaciones técnicas de diseño OBC. **NO inventar "Amortización del 100% por la ANI"** — eso es paráfrasis errónea.
> - **"Límite CAPEX por especialidad establecido en el Contrato APP 001/2025":** **NO existe en el contrato.** Cualquier mención de límite CAPEX por especialidad como cláusula contractual es **alucinación catalogada**. El límite (~$55M USD del CAPEX UF2/SCC) es interno LFC / oferta licitatoria, no cláusula contractual.

**Prefijo canónico para DTs de esta especialidad:** `EMBARCADO` o `EMB`.

---

## 3. CIERRE OPERATIVO

> [!IMPORTANT]
> **PROHIBIDO firmar DTs publicados con marker de versión interna:** "Sistema SICC v14.6", "Sistema SICC v14.7", "OpenGravity SICC", etc. Esos son markers de sistema interno (alucinación catalogada). En cara externa los DTs van firmados con: **"Dirección Técnica — Unidad Funcional 2"** y la fecha de emisión, sin versionado.

Las DTs deben:
- Estructura tripartita: Instrucción / Fundamento / Cierre.
- Sin emojis, sin "Soberanía", sin "Soberano", sin "Sovereign", sin "Infraestructura Zero", sin "Vital IP/Bus", sin "Michelin".
- Sigla del sistema en cara externa: **SCC** (BCD v001), NO "SICC" (colisión con SICC del AT4 = Sistema de Indicadores).
- Sección 10 YAML ejecutable obligatoria (deuda D0 del agente).
