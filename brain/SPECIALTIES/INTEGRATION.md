# ⚖️ ESPECIALIDAD: INTEGRACIÓN (INTEROPERABILIDAD) — v14.7
## SOBERANÍA TÉCNICA Y BLINDAJE DE INTERFACES

> [!IMPORTANT]
> **REGLA DE ORO:** La interoperabilidad con redes de terceros (FENOCO) es **exclusivamente operacional** mediante el procedimiento **Stop & Switch** en Chiriguaná. **Queda terminantemente prohibida cualquier integración lógica o desarrollo de Gateways de software** entre los Centros de Control.

---

## 1. INTEROPERABILIDAD CON EL TRAMO NORTE (CHIRIGUANÁ)
- **Método de Interfaz:** Procedimiento operacional **Stop & Switch** en la estación Chiriguaná.
- **Hardware Requerido:** Arquitectura de **hardware dual a bordo** (OBC LFC + OBC FENOCO con nivel SIL-4) con **DMI unificada SIL-2** y **Dispositivo EOT (End of Train)** para integridad de convoy.
- **Alcance Legal:** Cumplimiento estricto del **Artículo 5 de la Resolución de Surcos (Res. 20243040046045)**, incorporada al Contrato vía Sección 2.209. La compatibilidad se evalúa exclusivamente sobre los **dispositivos a bordo** del Material Rodante; **la norma no impone integración informática de los Centros de Control**.
- **Flota habilitada:** **GR12, U10 y U18 (o equivalente por Factor de Calidad)** conforme AT1 Cap. V.

---

## 2. INTEGRACIÓN DE SISTEMAS INTERNOS (SICC)
- **Protocolos de Transmisión:** Mensajería vital bajo **FRA 49 CFR Part 236 Subpart I**.
- **Comunicaciones:** Habilitación de redes abiertas bajo **§236.1033(a)** con integridad criptográfica y autenticación.
  > Texto literal: *"All wireless communications between the office, wayside, and onboard components in a PTC system shall provide cryptographic message integrity and authentication."*
- **Seguridad en Redes Abiertas:** Aplicación obligatoria de **EN 50159 Categoría 3** para transmisiones vía satelital/celular SD-WAN.
- **Neutralidad Tecnológica:** Todas las interfaces deben ser **abiertas y basadas en parámetros de desempeño**, evitando protocolos propietarios cerrados.

---

## 3. PROHIBICIONES Y ESCUDO PATRIMONIAL
- **Prohibición de Gateways:** Queda terminantemente prohibido el desarrollo de pasarelas de software para intercambio automático de datos vitales con servidores de terceros.
- **Argumento legal:** El Art. 5 de la Resolución de Surcos define la "Compatibilidad Exitosa" exclusivamente sobre los dispositivos a bordo del Material Rodante. La FRA, vía §236.1033(a), permite redes inalámbricas abiertas bajo integridad criptográfica. La combinación de ambas hace que el hardware dual a bordo + Stop & Switch sea jurídicamente suficiente.
- **Escudo CAPEX:** Cualquier exigencia de integración lógica centralizada activa automáticamente la **Sección 9.12 (Modificación de Especificaciones)** y la **Sección 25.4 (Obra y Equipo Complementario)** a cargo de la ANI.
- **Veto de Terceros:** Prohibido citar contratos de consultoría o subcontratistas (ej: Ardanuy, CCLF 00013-2026) en documentos oficiales de línea base hacia el Cliente.

---
**Generado por la Dirección Técnica LFC - Sistema SICC v14.7**
