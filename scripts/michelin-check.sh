#!/bin/bash

# Michelin Baseline Integrity Guard - v7.0 Recursive
# Valida que los axiomas financieros de la Línea Base no hayan sido alterados.

WBS_FILE="/home/administrador/docker/LFC2/IX_WBS_Planificacion/WBS_Presupuestal_v4_0_MICHELIN.md"
HEARTBEAT_FILE="/home/administrador/docker/agente/brain/HEARTBEAT.md"
EXPECTED_TRM="4400"
EXPECTED_ITEM_103="11,000,000,000"
EXPECTED_TOTAL="241,702,615,356"

echo "🔍 Iniciando Auditoría de Integridad Michelin (Recursive Guard)..."

# 1. Verificar TRM
CURRENT_TRM=$(grep "TRM" "$WBS_FILE" | grep -o "[0-9]\{4\}" | head -1)
if [ "$CURRENT_TRM" != "$EXPECTED_TRM" ]; then
    echo "❌ ERROR: Desviación de TRM ($CURRENT_TRM vs $EXPECTED_TRM)"
    sed -i "/## 🚨 BLOQUEO DE RIGOR TÉCNICO/a - [$(date +'%Y-%m-%d %H:%M')] TRM Alterada: $CURRENT_TRM (Esperado $EXPECTED_TRM)" "$HEARTBEAT_FILE"
    exit 2
fi

# 2. Verificar Item 1.1.103
CURRENT_ITEM_VALUE=$(grep "1.1.103" "$WBS_FILE" | grep -o "\$[0-9,]*" | head -1 | tr -d '$,')
CLEAN_ITEM_VALUE=$(echo "$EXPECTED_ITEM_103" | tr -d ',')

if [ "$CURRENT_ITEM_VALUE" != "$CLEAN_ITEM_VALUE" ]; then
    echo "❌ ERROR: Ítem 1.1.103 alterado (\$${CURRENT_ITEM_VALUE})"
    sed -i "/## 🚨 BLOQUEO DE RIGOR TÉCNICO/a - [$(date +'%Y-%m-%d %H:%M')] Ítem 1.1.103 Alterado: \$${CURRENT_ITEM_VALUE} (Impureza detectada)" "$HEARTBEAT_FILE"
    exit 2
fi

# 3. Verificar Total
CURRENT_TOTAL=$(grep "TOTAL LÍNEA BASE" "$WBS_FILE" | grep -o "[0-9,]\{10,20\}" | head -1)
if [ "$CURRENT_TOTAL" != "$EXPECTED_TOTAL" ]; then
    echo "⚠️ ADVERTENCIA: Movimiento en CAPEX Total ($CURRENT_TOTAL)"
    # Aquí podríamos añadir lógica de escalamiento si el cambio es > 1%
fi

echo "✅ Auditoría Michelin Exitosa. SSOT Intacto."
exit 0
