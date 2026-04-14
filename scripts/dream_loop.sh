#!/bin/bash
# scripts/dream_loop.sh — Orquestador Dinámico SICC v8.6
# Consume la cola de DREAMS.md secuencialmente.

LOG_FILE="/app/data/logs/continuous_dreamer.log"
WAIT_IDLE=900 # 15 minutos si no hay tareas
WAIT_SUCCESS=600 # 10 minutos entre misiones exitosas

echo "🚀 [SICC-LOOP] Iniciando Orquestador Dinámico de Sueños..." | tee -a "$LOG_FILE"

while true; do
    # 1. Obtener la siguiente misión
    NEXT_MISSION=$(node scripts/next_dream.js 2>/dev/null)
    
    if [ -z "$NEXT_MISSION" ]; then
        echo "💤 [SICC-LOOP] No hay misiones [PENDING] en DREAMS.md. Esperando ${WAIT_IDLE}s..." | tee -a "$LOG_FILE"
        sleep "$WAIT_IDLE"
        continue
    fi

    # 2. Ejecutar el Dreamer con la misión encontrada
    echo "🌙 [SICC-LOOP] Iniciando peritaje sobre: $NEXT_MISSION" | tee -a "$LOG_FILE"
    
    # El dreamer.js ya se encarga de loguear internamente
    node src/dreamer.js "$NEXT_MISSION" >> "$LOG_FILE" 2>&1
    
    # 3. Marcar como DONE (Manual preventivo si el script falló en hacerlo)
    # Nota: Si el dreamer.js no marca como DONE, el bucle repetirá. 
    # Por ahora confiamos en la lógica interna del Dreamer.
    
    echo "✅ [SICC-LOOP] Misión '$NEXT_MISSION' completada. Búfer de respiro: ${WAIT_SUCCESS}s..." | tee -a "$LOG_FILE"
    sleep "$WAIT_SUCCESS"
done
