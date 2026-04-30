# 🏢 ESPECIALIDAD: CONTROL CENTER (CCO) — v14.7
## ARQUITECTURA REDUNDANTE Y LÓGICA VITAL

> [!IMPORTANT]
> **MANDATO DE LOCALIZACIÓN:** El Centro de Control de Operaciones (CCO) se compone obligatoriamente de **dos nodos**: Principal en **La Dorada** y Secundario (Failover) en **Barrancabermeja**, con replicación geográfica simétrica.

---

## 1. INFRAESTRUCTURA Y REDUNDANCIA (SPOF ZERO)
- **Topología:** Replicación geográfica simétrica entre La Dorada y Barrancabermeja.
- **Failover:** Conmutación automatizada para garantizar continuidad del PTC/CTC ante pérdida total de un nodo.
- **Servidores:** Arquitectura virtualizada con hardware redundante (N+1).
- **Fundamento normativo:** FRA 49 CFR §236.1015 (PTC Safety Plan) — la arquitectura virtualizada con redundancia 2oo3 SIL-4 es certificable como sistema seguro equivalente.

---

## 2. INTEROPERABILIDAD Y GESTIÓN DE TRÁFICO
- **Gestión de Flota:** El CTC reconoce exclusivamente las locomotoras **GR12, U10 y U18 (o equivalente por Factor de Calidad)**, conforme AT1 Cap. V.
- **Interoperabilidad:** Limitada al procedimiento operacional **Stop & Switch** en Chiriguaná, conforme Artículo 5 de la Resolución de Surcos (Res. 20243040046045).
- **Prohibición de Gateways:** Queda prohibida la integración lógica de software con los servidores de FENOCO. La compatibilidad se resuelve a bordo mediante **hardware dual (OBC LFC + OBC FENOCO)**.

---

## 3. BLINDAJE CONTRACTUAL
- **Alcance Físico:** Cualquier exigencia de nodos adicionales, servidores para integración con terceros, o ampliación de arquitectura constituye **Modificación de Especificaciones (Sección 9.12)**.
- **Trámite Financiero:** Se ejecuta exclusivamente bajo **Sección 25.4 (Obra y Equipo Complementario)** con cargo del 100% a la ANI mediante adición contractual previa.
- **Cero Terceros:** Prohibido citar consultores (Ardanuy) o contratos privados (CCLF 00013-2026) en línea base oficial.

---

## 🖥️ ARQUITECTURA DE SERVIDORES — v14.7
- **Configuración:** Alta Disponibilidad **2-out-of-3 (2oo3)**.
- **Seguridad:** Nivel de Integridad **SIL-4** mandatorio para el núcleo PTC.
- **Failover:** Replicación geográfica simétrica entre **La Dorada (nodo principal)** y **Barrancabermeja (nodo secundario)**.
- **Certificación:** Vía PTC Safety Plan (PTCSP) bajo §236.1015, sustituyendo la necesidad de hardware vital físico equivalente.

---
**Generado por la Dirección Técnica LFC - Sistema SICC v14.7**
