# 📡 ESPECIALIDAD: COMUNICACIONES — v14.7
## RED TRONCAL Y REDUNDANCIA SATELITAL

> [!IMPORTANT]
> **MANDATO DE INFRAESTRUCTURA:** La red troncal es estrictamente **lineal de fibra óptica (64 hilos G.652.D)**. Prohibida la topología de anillo redundante (G.8031). Las microondas terrestres están proscritas como medio primario o secundario. La redundancia tren-tierra se resuelve mediante arquitectura híbrida embarcada (satélite + celular SD-WAN), legalmente habilitada por **FRA 49 CFR §236.1033**.

---

## 1. MEDIOS DE TRANSMISIÓN (TRIPLE CAPA)
- **Capa Primaria (Backbone):** Red troncal lineal enterrada de **exactamente sesenta y cuatro (64) hilos monomodo G.652.D**. Soporta CCTV, SCADA y datos vitales.
- **Capa Inalámbrica (Voz/Datos):** Sistema **TETRA** (estándar ETSI). Torres dimensionadas exclusivamente para antenas TETRA.
- **Capa de Redundancia Embarcada:** Enlace híbrido **satelital LEO/GEO + GSM/LTE** mediante ruteo SD-WAN. **Latencia round-trip admisible: hasta tres (3) segundos**, conforme principio Fail-Safe del PTC.
- **Prohibición:** Queda prohibido el diseño de torres de microondas terrestres (MW) para redundancia tren-tierra. La FRA no exige determinismo terrestre; ampara expresamente las redes inalámbricas abiertas bajo §236.1033.

---

## 2. ESTÁNDARES DE SEGURIDAD Y CIBERSEGURIDAD
- **Habilitación legal de redes abiertas (texto literal §236.1033(a)):**
  > *"All wireless communications between the office, wayside, and onboard components in a PTC system shall provide cryptographic message integrity and authentication."*

  La FRA permite **todas** las comunicaciones inalámbricas bajo condición única de integridad criptográfica y autenticación.

- **Plan de mitigación obligatorio (texto literal §236.1033(f)):**
  > *"Each railroad, or its vendor or supplier, shall have a prioritized service restoration and mitigation plan for scheduled and unscheduled interruptions of service."*

  La FRA prevé expresamente las **interrupciones no programadas** y exige plan de mitigación priorizado, **no enlaces infalibles de 99.999%**. La mitigación de LFC: principio Fail-Safe (frenado del tren ante pérdida de señal) + arquitectura SD-WAN (conmutación automática satélite ↔ celular).

- **Transmisión Vital:** **EN 50159 Categoría 3** para medios de transmisión abiertos.
- **Norma Rectora PTC:** **FRA 49 CFR §236.1033** para enlaces de datos PTC.
- **Cifrado:** Algoritmos aprobados por **NIST** conforme §236.1033(b)(1).
- **Gestión de claves:** Distribución manual o automatizada (§236.1033(b)(2)); revocación obligatoria por compromiso o caducidad del algoritmo (§236.1033(b)(3)).

---

## 3. MECANISMOS DE DEFENSA PATRIMONIAL
- **Over-engineering:** Cualquier exigencia de redundancia física adicional (anillos dobles, microondas terrestres, capacidad superior a 64 hilos, latencia inferior a 3 segundos garantizada por enlaces terrestres) activa la **Sección 9.12** y se tramita exclusivamente como **Obra y Equipo Complementario (Sección 25.4)**.
- **Argumento del determinismo:** Cualquier argumento de Ardanuy o Interventoría que exija canales terrestres "deterministas" se destruye con el literal §236.1033(a) — la FRA permite redes inalámbricas bajo integridad criptográfica, sin imponer determinismo terrestre.
- **Jurisdicción:** Prohibido citar contratos de consultoría externos en líneas base hacia ANI/Interventoría.

---

## 🏗️ INFRAESTRUCTURA FÍSICA (OSP) — v14.7
- **Capacidad Troncal:** Exactamente **64 hilos G.652.D**. Prohibido el uso de "como mínimo" o redacción que abra a sobredimensionamiento.
- **Protección Civil:** Soterramiento con **placa de concreto antivandálica** (Mandato AT1).
- **Estándares de Pruebas:** **ANSI/ICEA S-87-640** y **Telcordia GR-20-CORE Issue 2**.
- **OTDR/OLTS obligatorio:** Pruebas en las **tres ventanas: 1310 nm, 1550 nm y 1625 nm** (la última es indispensable para detección de macrocurvaturas; las dos primeras certifican operación normal).
- **Atenuación máxima por empalme:** **0.1 dB bidireccional**.
- **Shield:** Exigencias de anillos físicos, mayores hilos o capa de microondas activan la Sección 25.4.

---

## 📹 SEGREGACIÓN CCTV — v14.7
- **Mandato:** Tráfico de video **exclusivo por Fibra Óptica**.
- **Prohibición:** Prohibido transmitir video por la capa satelital/celular (red reservada para mensajería PTC).
- **Almacenamiento:** Máximo **30 días**.
- **Alimentación:** PoE conforme `POWER.md`.

---
**Generado por la Dirección Técnica LFC - Sistema SICC v14.7**
