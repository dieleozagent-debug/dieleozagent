#!/bin/bash
# health-monitor.sh — SICC Heartbeat Monitor v1.0
# Registra el estado del sistema cada hora en /home/administrador/docker/agente/data/logs/health.log

LOG_FILE="/home/administrador/docker/agente/data/logs/health.log"
mkdir -p "$(dirname "$LOG_FILE")"

echo "--------------------------------------------------" >> "$LOG_FILE"
echo "⏰ HEARTBEAT: $(date)" >> "$LOG_FILE"

# 1. Verificar conectividad IA
echo "🔍 Verificando conectividad IA..." >> "$LOG_FILE"
if curl -s http://localhost:11435/api/tags > /dev/null; then
    echo "✅ Ollama Local: OK" >> "$LOG_FILE"
else
    echo "❌ Ollama Local: FAIL" >> "$LOG_FILE"
fi

# 2. Verificar Recursos
echo "📊 Recursos del Sistema:" >> "$LOG_FILE"
free -h | grep "Mem:" | awk '{print "   Memoria: " $3 "/" $2}' >> "$LOG_FILE"
top -bn1 | grep "Cpu(s)" | awk '{print "   CPU: " $2 "%"}' >> "$LOG_FILE"

# 3. Verificar Base de Datos (Puente Soberano)
if nc -z localhost 54322; then
    echo "✅ Supabase Tunnel: OK" >> "$LOG_FILE"
else
    echo "❌ Supabase Tunnel: FAIL" >> "$LOG_FILE"
fi

echo "✅ Heartbeat completado." >> "$LOG_FILE"
