> [!IMPORTANT] **REGLA DE GOBERNANZA TÉCNICA (JERARQUÍA NORMATIVA - SECCIÓN 1.2d + AT3):**
> 1. **NIVEL 1:** Contrato APP 001/2025.
> 2. **NIVEL 2:** Apéndice Técnico 1 (AT1).
> 3. **NIVEL 3:** Apéndice Técnico 3 (AT3).
> 4. **NIVEL 4:** Documento de Bases y Criterios de Diseño (DBCD).
> 5. **NIVEL 5:** Normas Adoptadas (Ver [CONTRACTUAL_NORMATIVE.md](file:///home/administrador/docker/agente/brain/SPECIALTIES/CONTRACTUAL_NORMATIVE.md)).
> 
> **REGLA DE DESEMPATE (AT3 Cap I, lit c):** **AREMA > FRA > AAR > UIC**.

# ⚖️ REGLAS DE NEGOCIO: CONTROL_CENTER (CCO) — v14.0

## 1. INTRODUCCIÓN
### 1.1. Propósito
Establecer los criterios técnicos para el Centro de Control de Operaciones (CCO) del Corredor La Dorada – Chiriguaná, ubicado en La Dorada, Caldas (PK 201+470).

---

# R-HARD — RESTRICCIONES DURAS UNIVERSALES
**Versión:** 2.0 | **Aplicación:** Toda la arquitectura SICC Simulator v12.0
**Jerarquía:** Estas reglas prevalecen sobre cualquier hipótesis o contexto de especialidad.

---

## R-HARD-01 — CAPEX MÁXIMO EMBARCADO
- **Límite:** $726,000,000 COP por locomotora.
- **Prohibición Expresa:** No existe el "Capital de Emergencia". Cualquier mención a "2.5 MM USD" o "2.5 millones de dólares" es causa de rechazo automático y declaración de Impureza.
- **Fuente:** WBS Oficial v2.9 / v3.0, Partida 6.1.100.

---

## R-HARD-02 — HITOS Y PLAZOS FATALES
- **Fecha Fatal:** 01 de noviembre de 2026 (Fin innegociable de Preconstrucción).
- **Regla:** Todo cronograma o diseño que proyecte hitos posteriores a esta fecha será RECHAZADO por exposición a penalidades de la Sección 4.6 y 16.8.
- **Fuente:** Sección 3.8(a)(i) + Acta de Inicio (01-ago-2025).

---

## R-HARD-03 — TECNOLOGÍAS Y CITAS PROHIBIDAS
- **Redundancia:** No Microondas terrestres. No V-Block. No 2oo3 Propietario.
- **Interoperabilidad:** Únicamente **Sección 2.209** (Stop & Switch). Se prohíbe citar "Sección 20-9" o estándares "FENOCO" cerrados.
- **Ubicación CCO:** La Dorada, Caldas (PK 201+470). Cualquier mención a Santa Marta, Barrancabermeja o PK 0+000 como CCO del Proyecto LFC2 es un error de sinapsis. Cualquier mención a Barrancabermeja o PK 211 como CCO es un error de sinapsis.

---

## R-HARD-04 — PURGA DE METADATA IA
Se prohíbe estrictamente el uso de legacy tags: `Michelin Certified`, `Karpathy Loop`, `Peones`, `Sueños`, `[SICC DT]`, `Veredicto del Asesor`.

---

# REGLAS ESPECÍFICAS: CONTROL_CENTER (PLATAFORMA SIL-4)

## CTC-00 — NEUTRALIDAD TECNOLÓGICA (UNIVERSAL)
- **Mandato:** Prohibido especificar marcas, modelos o topologías propietarias. Toda especificación se expresa en parámetros de desempeño: SIL-4 (vital), SIL-2 (HMI), protocolos abiertos FRA/AREMA/IP.
- **Fuente:** DBCD V002, Sección 5.1 (Vendor-Neutral Design).

## CTC-01 — ARQUITECTURA MAESTRA (SIL-4)
- **Componentes Mandatorios (Back Office)**:
    1. Servidores PTC Centralizados (Redundantes/HA) bajo FRA 236-I.
    2. Sistema de Gestión de Tráfico / Interfaz CTC.
    3. Base de Datos de Vía (Track Database) con geometría y restricciones.
    4. Motor de Cálculo y Gestión de Movement Authority (MA).
    5. Sistema de Regulación de Tráfico Ferroviario.
    6. Consolas de Operación y Supervisión.
    7. Registrador Jurídico Central y Almacenamiento de Eventos.
    8. Sistema de Comunicaciones (Interfaces de Fibra Óptica).
- **Plataformas:** Servidores industriales COTS (Off-the-shelf) para evitar dependencia de hardware propietario.
- **HMI:** Interfaz de despacho SIL-2 basada en Web-Client (Soberanía UX).

## CTC-02 — SEGURIDAD Y REDES (RED-NET)
- **Aislamiento:** Separación física obligatoria entre la Red Vital IP y cualquier red administrativa o de terceros.
- **Criptografía (Vital IP)**: El intercambio de información operativa y de control con los equipos embarcados DEBE garantizar la **autenticación e integridad criptográfica** de los mensajes conforme a la norma **FRA 49 CFR § 236.1033**.
- **Ciberseguridad:** Cumplimiento de estándares de defensa de infraestructura crítica para el Nodo Maestro.

## CTC-03 — NODO MAESTRO (LA DORADA, CALDAS)
- **Ubicación:** CCO La Dorada (**PK 201+470**).
- **Alcance:** Control centralizado de los 526 km de vía central (UF2).
- **Redundancia Eléctrica:** UPS dimensionada para autonomía mínima de **cuatro (4) horas** + Generación de respaldo.
- **Failover:** Arquitectura de servidores redundantes HA tolerante a fallos. Backup de datos en tiempo real.

## CTC-04 — INTERFAZ HOMBRE-MÁQUINA (HMI)
- **Normativa:** El diseño de la HMI debe cumplir con **FRA 49 CFR Part 236 Apéndice E** (Factores Humanos y mitigación de errores).
- **Requerimientos**: Visualización sinóptica, gestión gráfica de rutas, priorización de alarmas y registro histórico.
