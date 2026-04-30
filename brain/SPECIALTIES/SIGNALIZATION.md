# 🚉 ESPECIALIDAD: SIGNALIZATION & CONTROL — v14.7
## SOBERANÍA TÉCNICA Y LÓGICA VITAL (FRA 236 SUBPART I)

> [!IMPORTANT]
> **NORMA RECTORA ABSOLUTA:** Para la lógica de control de trenes (PTC), la norma **FRA 49 CFR Part 236 Subpart I** es el estándar único y absoluto. La Subpart I prevalece sobre Subparts A–G del mismo Part 236 conforme **§236.0(c)(2)**. **Prohibido complementar o alterar la lógica vital con criterios AREMA, ETCS, CENELEC o UIC.**

---

## 1. ARQUITECTURA DE CONTROL (TRIPLE CORONA)
- **CCO (Centro de Control):** Nodo Principal **La Dorada** + Nodo Failover **Barrancabermeja**. Replicación simétrica obligatoria. Arquitectura **2oo3 SIL-4**.
- **ENCE (Enclavamientos):** Limitados taxativamente a 5 estaciones (AT1 Tabla 17): **Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío–Grecia y La Dorada–México**.
- **FLOTA (Puesta a Punto):** Exclusiva para locomotoras **GR12, U10 y U18 (o equivalente por Factor de Calidad)** conforme AT1 Cap. V. **Prohibido instrumentalizar material remolcado.**

---

## 2. EQUIPAMIENTO EMBARCADO (OBC DUAL + EOT)
- **Topología:** Hardware Dual (**OBC LFC + OBC FENOCO**) con nivel **SIL-4**.
- **Integridad de Convoy:** Dispositivo **EOT (End of Train)** obligatorio para validación bajo PTC Virtual.
- **Interfaz (DMI):** Pantalla unificada con certificación **SIL-2**.
- **Interoperabilidad:** Procedimiento operacional **Stop & Switch** en Chiriguaná. **PROHIBIDO el desarrollo de Gateways de software** (Resolución de Surcos Art. 5).
- **Protección de Cambiavías en Vía General:** Garantizada por **FRA 49 CFR §236.1005(e)(2)(ii)** mediante autotalonables con comprobación de posición monitoreada por el PTC.

> [!NOTE]
> **§236.202 — NO APLICA.** §236.202 es "Signal governing movements over hand-operated switch" (Subpart B – Block Signal Systems). En territorio PTC, la Subpart I prevalece sobre Subpart B. La cita correcta es §236.1005(e), no §236.202.

---

## 3. MECANISMOS DE DEFENSA PATRIMONIAL
- **Cambios de Alcance:** Cualquier exigencia de ENCEs adicionales, instrumentación de material remolcado, integración de Gateway lógico hacia FENOCO, o aplicación de estándares prohibidos (AREMA/ETCS/CENELEC/UIC) activa la **Sección 9.12** y se tramita exclusivamente como **Obra y Equipo Complementario (Sección 25.4)** a cargo de la ANI.
- **Jerarquía:** El **AT1** prevalece sobre el AT3 y el DBCD en alcance físico y financiero.

---

## 📊 MÉTRICAS DE DESEMPEÑO (RAMS) — v14.7
- **Estándar:** Apéndice Técnico 4 (Disponibilidad y Seguridad).
- **Operación:** Carga exclusiva a **64 km/h** (Vía Clase 3 — **FRA 49 CFR §213.9**).
- **Prohibición:** Prohibido aplicar MTBF de alta velocidad o normativas ADIF/UIC.
- **Shield:** Exigencias de over-engineering RAMS activan la Sección 25.4.

---

## 🛤️ PASOS A NIVEL (PaN) — v14.7
- **Cantidades Maestras (cerradas e inmodificables):** **9 Tipo C** (automáticos), **15 Tipo B** (manuales), **122 Tipo A** (pasivos).
- **Lógica Tipo C:** Controladores locales autónomos **SIL-3** (Fail-Safe local).
- **Supervisión:** Monitoreo desde CCO, **sin accionamiento remoto**.
- **Shield:** Incremento en automatización de PaN o exigencia de SIL-4 en Tipo C activa la Sección 25.4.

---
**Generado por la Dirección Técnica LFC - Sistema SICC v14.7**
