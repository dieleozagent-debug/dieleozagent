# 🛡️ SICC OPERATIONS MANUAL — EL CENTINELA MANUAL

Este documento describe el protocolo de operación del sistema SICC tras la transición al modo de auditoría 100% bajo demanda (v12.3).

## 🚀 Control de Ingesta (Brain Renewal)

Para actualizar el cerebro del agente con nuevos documentos contractuales o de ingeniería, utilice el comando de ingesta manual.

### Comando Telegram
`/ingesta [path]`
> Ejemplo: `/ingesta /app/repos/LFC2/docs/IV_Ingenieria_Basica`

### Comando CLI
`node scripts/sicc-ingesta.js --path [CARPETA]`

---

## 🌙 Ciclo de Sueño (Dreamer)

El Dreamer ya no se ejecuta automáticamente cada noche. El operador debe disparar el ciclo cuando considere que hay suficientes hipótesis en `brain/DREAMS.md`.

### Comando Telegram
`/sueno`
> Ejecuta el Dreamer con el flag `--force` para saltar restricciones de carga de CPU.

### Comando CLI
`node scripts/sicc-dreamer.js --force`

---

## 📜 Memoria Genética (LTM)

La Memoria de Largo Plazo (LTM) se rige por las Decisiones Técnicas soberanas.

### Actualizar Memoria
Para inyectar nuevas verdades contractuales o lecciones aprendidas:
1. Editar `scripts/sicc-seed-memory.js`
2. Ejecutar `node scripts/sicc-seed-memory.js`

---

## 🛡️ Reglas de Oro (Blindaje v12.3)

1. **Pureza Forense:** El output del Dreamer es texto plano denso. No emojis.
2. **Rechazo a Gateways:** Se prohíbe cualquier interoperabilidad vía software (APIs) hacia FENOCO.
3. **Stop & Switch:** La interoperabilidad es operacional y embarcada.
4. **Virtual PTC:** Se prohíben los contadores de ejes físicos para el sistema PTC.
