# ESPECIALIDAD: NORMATIVA CONTRACTUAL Y GOBERNANZA TÉCNICA
**Versión:** 14.0 (Institutionalized)
**SSoT:** Contrato APP 001/2025 + AT1 + AT3

## 1. PROPÓSITO
Establecer el orden de aplicación para la ingeniería de detalle del Sistema de Señalización del Corredor Férreo La Dorada – Chiriguaná.

## 2. MARCO CONTRACTUAL Y JERARQUÍA NORMATIVA
1. Contrato APP 001/2025 | 2. AT1 | 3. AT3 | 4. DBCD | 5. Normas Adoptadas (AREMA > FRA > AAR > UIC).

## 3. DESCRIPCIÓN DEL PROYECTO: CORREDOR LA DORADA – CHIRIGUANÁ
Unidad Funcional 2 (UF2): 526,133 km (PK 201+470 a 722+683).

## 4. FILOSOFÍA DE DISEÑO: ARQUITECTURA PTC CON CANTONAMIENTO VIRTUAL
Arquitectura basada en **FRA 49 CFR Part 236, Subpart I (2026)**.

## 5. CRITERIOS DEL SISTEMA DE CONTROL DE TRENES PTC
- Funcionalidades FRA 236-I. Lógica central en CCO La Dorada (§ 236.1033).

## 6. CRITERIOS DEL SISTEMA DE TELECOMUNICACIONES
- Fibra 48 hilos G.652.D. Radio TETRA (ETSI). Redundancia Satelital.

## 7. CRITERIOS DEL CENTRO DE CONTROL DE OPERACIONES (CCO)
- Ubicación: La Dorada, Caldas. UPS 4h. HMI FRA 236 App E.

## 8. CRITERIOS DE PASOS A NIVEL (PaN)
- Lógica CWT. 9 Tipo C | 15 Tipo B. Normas NTC 4741, FRA 234.

## 9. INTEROPERABILIDAD CON FENOCO (PUNTO NORTE)
- Modelo **Stop & Switch** (Chiriguaná). OBC Dual. Prohibición de integración técnica.

## 10. ALIMENTACIÓN ELÉCTRICA (POWER)

### 10.1 Sistemas Vitales (ENCE, PTC, PaN, CCO)
- **Tensión de Alimentación:** 110V DC (AREMA / FRA 236 / FRA 234).
- **Autonomía UPS:** Mínimo **cuatro (4) horas**.
- **Margen de Diseño:** +20% sobre carga pico.
- **Respaldo:** Generación local con transferencia < 2 min (EL2).

### 10.2 Sistema de Radio TETRA
- **Tensión de Alimentación:** 48V DC (ETSI 300.132-2).
- **Autonomía UPS:** Mínimo **24-48 horas** de operación continua.

### 10.3 Servicios Auxiliares (CCTV, SCADA, Alarmas)
- **Tensión de Alimentación:** 120V AC (Solo para circuitos no vitales).
- **Caída de Tensión Máxima:** 3% (RETIE 2024).
- **Uso de AC:** Limitado a entrada de UPS o rectificadores para sistemas de respaldo. Se requieren protecciones EMC y filtrado.

## 11. RELACIÓN DE NORMAS EXPRESAMENTE ADOPTADAS
- FRA 236-I, FRA 234, AREMA, ETSI 300.132-2, EN 50159, ITU-T G.652.D, RETIE 2024, NSR-10, NTC 4741.

## 12. GOBERNANZA TÉCNICA DEL DISEÑO
La jerarquía normativa asegura la trazabilidad contractual del Proyecto.
