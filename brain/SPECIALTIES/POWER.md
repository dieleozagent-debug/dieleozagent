# ⚡ ESPECIALIDAD: POWER — v14.7
## ENERGÍA Y PROTECCIÓN DE HARDWARE VITAL

> [!IMPORTANT]
> **MANDATO DE RESPALDO:** La infraestructura de energía para los 5 ENCE y los 2 nodos del CCO debe garantizar una autonomía **de cuatro (4) horas** mediante UPS y generación de respaldo. **El MTTR está limitado a 4 horas.** Toda exigencia de autonomía superior es over-engineering y activa la cadena 9.12 → 25.4.

> [!WARNING]
> **CORRECCIÓN v14.7:** Se elimina la mención previa de "autonomía mínima de 24 horas". El parámetro contractualmente coherente es **4 horas**, alineado con el MTTR establecido en el DT-INTG-2026-015 maestro. 24 h era over-engineering CAPEX (baterías ~6x más grandes, gabinetes mayores, climatización ampliada).

---

## 1. ESTÁNDARES ELÉCTRICOS Y TENSIÓN
- **Tensión de Operación:** **110V AC** para servidores y **48V DC** para equipos de radio y enclavamientos.
- **Protección:** Supresores de transitorios (TVSS) obligatorios en cada gabinete de campo y nodos centrales.
- **Failover Eléctrico:** Redundancia de alimentación (doble acometida o red + generador) para garantizar SPOF Zero.
- **Autonomía UPS:** **4 horas** (cuatro horas), alineadas con MTTR. Cualquier exigencia superior es over-engineering y activa la Sección 9.12 → 25.4.

---

## 2. INFRAESTRUCTURA DE CAMPO (WAYSIDE)
- **Concentración:** Gabinetes de potencia y baterías limitados estrictamente a las **5 zonas ENCE** (Zapatosa, García Cadena, Barrancabermeja, Puerto Berrío–Grecia, La Dorada–México).
- **Autotalonables:** Dispositivos de comprobación de posición de bajo consumo, alimentados localmente (solar/batería) para minimizar cableado de cobre y obra civil.

---

## 3. MECANISMOS DE DEFENSA PATRIMONIAL
- **Over-engineering:** Cualquier exigencia de autonomía UPS superior a 4 h, redundancia eléctrica de triple acometida, o ampliación de gabinetes fuera de los 5 ENCE activa la **Sección 9.12**.
- **Trámite Financiero:** Se gestiona exclusivamente como **Obra y Equipo Complementario (Sección 25.4)** a cargo del 100% de la ANI.
- **Jurisdicción:** Prohibido citar subcontratistas en documentos de línea base.

---

## 🔌 ALIMENTACIÓN CCTV — v14.7
- **Método:** **PoE (Power over Ethernet)** desde switches redundantes.
- **Tensión:** **48V DC** de respaldo local.
- **Prohibición:** Prohibidas acometidas independientes de 110V/220V por poste de cámara.

---
**Generado por la Dirección Técnica LFC - Sistema SICC v14.7**
