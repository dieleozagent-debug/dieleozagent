#!/bin/bash
# 🌙 SICC NIGHT SHIFT ORCHESTRATOR (v9.14 - ESTADO SOBERANO)
# Autonomía total: Ingesta + Sueño Cíclico + Estabilización Térmica

LOG_FILE="/home/administrador/docker/agente/data/logs/night-shift.log"
SPECIALTIES=("Señalización Ferroviaria" "Catenaria y Energía" "Telecomunicaciones SICC" "Geografía Contractual")
INDEX=0

echo "$(date) [NIGHT-SHIFT] 🏛️ Iniciando Guardia Nocturna con Cerebro Ajustado..." >> $LOG_FILE

while true; do
    # 1. 🛡️ ACTIVACIÓN DEL CENTINELA (Modo Secuencial)
    # Se elimina el '&' para evitar procesos huérfanos y colisiones de CPU
    echo "$(date) [SENTINEL] 🚀 Lanzando verificación de ingesta..." >> $LOG_FILE
    node /home/administrador/docker/agente/scripts/sicc-sentinel.js >> $LOG_FILE 2>&1 
    
    # 2. 🌙 RÁFAGA DE SUEÑO (Modo Eficiente)
    SPECIALTY=${SPECIALTIES[$INDEX]}
    DREAM_TIME="600s"
    HIBRERNACION_POST_CICLO=3600 # 1 hora de descanso por defecto tras éxito
    
    # Si la ingesta ya no encuentra nada, activamos SUEÑO PROFUNDO
    if grep -q "ya procesado" $LOG_FILE || grep -q "completada exitosamente" $LOG_FILE; then
        echo "$(date) [NIGHT-SHIFT] 💤 Ingesta completa detectada. El Cerebro entra en HIBERNACIÓN (1 hora)..." >> $LOG_FILE
        sleep $HIBRERNACION_POST_CICLO
        # Limpiar log para la próxima verificación diaria
        > $LOG_FILE
        continue
    fi
    
    echo "$(date) [DREAMER] 🧬 Iniciando ráfaga de $DREAM_TIME para: $SPECIALTY" >> $LOG_FILE
    timeout $DREAM_TIME node /home/administrador/docker/agente/src/dreamer.js "$SPECIALTY" >> $LOG_FILE 2>&1
    
    echo "$(date) [DREAMER] ✅ Ciclo de decantación completado." >> $LOG_FILE
    
    # Rotar especialidad
    INDEX=$(( (INDEX + 1) % ${#SPECIALTIES[@]} ))

    # 3. 🩺 VERIFICADOR DE SALUD PASSIVE
    if ! pgrep -f "health-monitor.sh" > /dev/null; then
        nohup bash ./scripts/health-monitor.sh >> data/logs/health.log 2>&1 &
    fi

    # NOTA: Se elimina el reinicio automático de sicc-sentinel.js aquí. 
    # El bucle volverá a lanzarlo al inicio si es necesario.

    echo "[$(date)] [NIGHT-SHIFT] 💤 Hibernación táctica (600s). Reanudando vigilancia corporal..."
    sleep 600
done
