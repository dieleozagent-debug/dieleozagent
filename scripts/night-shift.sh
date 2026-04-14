#!/bin/bash
# 🌙 SICC NIGHT SHIFT ORCHESTRATOR (v9.9)
# Autonomía total: Ingesta + Sueño Cíclico

LOG_FILE="/home/administrador/docker/agente/data/logs/night-shift.log"
SPECIALTIES=("Señalización Ferroviaria" "Catenaria y Energía" "Telecomunicaciones SICC" "Geografía Contractual")
INDEX=0

echo "$(date) [NIGHT-SHIFT] 🏛️ Iniciando Guardia Nocturna Perpetua..." >> $LOG_FILE

while true; do
    # 1. 🛡️ ACTIVACIÓN DEL CENTINELA (Ingesta + Auto-Fix)
    echo "$(date) [SENTINEL] 🚀 Lanzando ciclo de ingesta..." >> $LOG_FILE
    node /home/administrador/docker/agente/scripts/sicc-sentinel.js >> $LOG_FILE 2>&1 &
    
    # 2. 🌙 RÁFAGA DE SUEÑO (10 Minutos)
    SPECIALTY=${SPECIALTIES[$INDEX]}
    echo "$(date) [DREAMER] 🧬 Iniciando ráfaga de 10 min para: $SPECIALTY" >> $LOG_FILE
    
    # Ejecutar el dreamer con un timeout estricto de 10 minutos
    timeout 600s node /home/administrador/docker/agente/src/dreamer.js "$SPECIALTY" >> $LOG_FILE 2>&1
    
    echo "$(date) [DREAMER] ✅ Ciclo de decantación completado. Hallazgos guardados en el Brain." >> $LOG_FILE
    
    # Rrotar especialidad para la próxima hora
    INDEX=$(( (INDEX + 1) % ${#SPECIALTIES[@]} ))

    # 3. 💤 PAUSA DE REGENERACIÓN (50 Minutos)
    echo "$(date) [NIGHT-SHIFT] 💤 Entrando en hibernación (50 min)..." >> $LOG_FILE
    sleep 3000
done
