# ⚖️ DICTAMEN TÉCNICO VINCULANTE (SICC v14.6 - CORREGIDO)

**Documento:** DT-SICC-2026-002 (REVISIÓN FORENSE)
**Área:** Integración y Control (PTC/CTC)
**Fecha:** 2026-04-28T08:45:00Z
**Estado:** ❌ RECHAZADO / APELADO POR DESVIACIÓN TÉCNICA
**Validado por:** Dirección Técnica SICC - LFC (Recurso de Apelación)

**MANDATO CORRECTIVO:** Ajustar los niveles de integridad de seguridad (SIL) a la arquitectura aprobada, incluir el Nodo de Respaldo (Failover) y acotar la flota de instalación tecnológica al Material Rodante Tractivo.

---

## CITACIÓN CANÓNICA
Contrato APP 001/2025, Apéndice Técnico 1 (AT1), Capítulo V, Numeral 5.1: "El Concesionario deberá instalar a bordo del material rodante los equipos de control y comunicaciones necesarios para la operación del sistema PTC/CTC, incluyendo la integración con el Centro de Control de Operaciones (CCO) ubicado en La Dorada, Caldas (PK 201+470) y su Nodo Secundario de Respaldo (Failover) en Barrancabermeja."

## ANÁLISIS TÉCNICO
La obligación de instalación de equipos embarcados se fundamenta en tres pilares contractuales concurrentes:
1. **Sección 3.1(a)(ii) del Contrato Principal**: Establece como objeto del contrato la "Puesta a Punto" del material rodante.
2. **Apéndice Técnico 1, Capítulo V, Numeral 5.1**: Define taxativamente que la instalación de equipos de control a bordo es una prestación obligatoria en el **Material Rodante Tractivo**.
3. **Apéndice Financiero 4**: Confirma que la ANI amortiza el 100% del valor del equipamiento embarcado tecnológico, consolidando la obligación como principal.

La flota objeto de esta obligación tecnológica específica (PTC) se limita exclusivamente al **Material Rodante Tractivo** del proyecto:
- Locomotoras GR12 (propiedad de la Nación)
- Locomotoras U10 (propiedad de la Nación)
- Locomotora U18 o su equivalente (Factor de Calidad - Concesionario)

## DECISIÓN VINCULANTE
**Se ORDENA** la instalación obligatoria e irrenunciable de equipos de control PTC/CTC a bordo de la totalidad de la flota tractiva nacional (GR12 y U10) y la locomotora del Factor de Calidad, conforme a las siguientes especificaciones técnicas blindadas:

1. **Estándar tecnológico único**: FRA 49 CFR Part 236, Subparte I, como única norma aplicable para el sistema de control de trenes.
2. **Arquitectura embarcada dual**: Sistema con capacidad fail-safe implementado mediante procedimiento operacional Stop & Switch (hardware dual embarcado LFC/FENOCO), integrando:
   - **Computador PTC embarcado (OBC)** con nivel de integridad **SIL-4**.
   - Posicionamiento GNSS/GPS de alta precisión con odometría embarcada.
   - **Comunicaciones operacionales y redundancia** (Satelital LEO/GEO + GSM/LTE vía SD-WAN) bajo nivel **SIL-2** y aseguradas criptográficamente conforme a la norma EN 50159 Categoría 3 y FRA §236.1033. **Queda expresamente prohibido exigir nivel SIL-4 a los módulos de telecomunicación.**
3. **Cronograma**: La instalación debe completarse dentro de la Fase de Preconstrucción, con fecha fatal de finalización el 01-noviembre-2026, conforme a la Sección 3.8(a)(i) del Contrato.

## JUSTIFICACIÓN
La presente decisión se sustenta en la literalidad del Contrato APP 001/2025 y sus Apéndices. La exclusión de tecnologías como microondas (torres), contadores de ejes wayside, catenaria, gateway lógico ITCS/Alstom, y DWDM/G.655/EDFA obedece a que dichas soluciones no están previstas en el alcance del proyecto, cuyo diseño se limita al transporte de carga (64 km/h) con tecnología Diésel-Eléctrica. 

La segregación de niveles SIL (SIL-4 para procesamiento PTC y SIL-2 para telecomunicaciones) garantiza la seguridad operacional sin incurrir en sobredimensionamiento de hardware comercial (COTS), salvaguardando el equilibrio económico del contrato y evitando bloqueos de suministro por inexistencia de mercado para equipos de telecomunicaciones SIL-4.

**Veredicto Estratégico:** 🦅 Con este ajuste se preservan absolutamente todas las victorias financieras (pago del 100% ANI y exclusión del Gateway) pero se elimina la exposición a multas por el Nodo de Respaldo y se acota el alcance al Material Rodante Tractivo.