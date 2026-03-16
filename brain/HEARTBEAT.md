# HEARTBEAT.md — Tareas Periódicas del Agente

## Configuración del Heartbeat

- **Frecuencia:** Cada 30 minutos
- **Comportamiento:** El agente revisa esta lista y envía un mensaje proactivo a Telegram
  si hay alguna tarea marcada como `[ ]` (pendiente) y con condición activa.

## Lista de Tareas Periódicas

### Sistema
- [ ] **Verificar conectividad IA:** Cada arranque, confirmar que al menos un proveedor responde
- [ ] **Log de salud:** Registrar estado del contenedor cada hora en `/app/data/logs/health.log`

### Recordatorios (activar editando este archivo)
- [x] ~~Recordatorio de ejemplo~~ *(desactivado — marcar sin tilde para activar)*

## Cómo Agregar una Tarea

Añade una línea con este formato:
```
- [ ] **Nombre:** Descripción de la tarea — frecuencia o condición
```

Ejemplos:
```
- [ ] **Resumen diario:** Enviar resumen de actividad a las 8:00 AM
- [ ] **Backup:** Comprimir /app/data y notificar ubicación del backup
- [ ] **Clima:** Consultar clima de Bogotá y enviarlo cada mañana
```

## Historial de Ejecución

*(El agente actualiza esta sección automáticamente)*

| Fecha | Tarea | Resultado |
|---|---|---|
| — | — | — |


### Saneamiento Avanzado
- [ ] **SSoT Cross-Ref Check:** Buscar variables huérfanas o TypeErrors en la consola de reportes.
- [ ] **Zero-Residue Audit:** Comprobar redondeos matemáticos en cualquier vista financiera nueva para eliminar decimales erráticos.
