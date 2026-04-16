#!/bin/bash

# SICC INGESTA NORMATIVA v12.2
# Procesa todos los PDFs de Referencia Normativa Contractual LFC

SOURCE_DIR="docs/00_Referencia_Normativa_Contractual_LFC"
LOG_FILE="data/logs/ingesta_normativa.log"

echo "🚀 Iniciando Ingesta Normativa Masiva..." | tee -a "$LOG_FILE"
date | tee -a "$LOG_FILE"

find "$SOURCE_DIR" -maxdepth 1 -name "*.pdf" | while read -r pdf_file; do
    filename=$(basename "$pdf_file")
    source_name="normativa_${filename%.*}"
    
    echo "📄 Procesando: $filename -> Source: $source_name" | tee -a "$LOG_FILE"
    
    # 1. Extraer texto
    TEXTO=$(pdftotext "$pdf_file" -)
    
    # 2. Enviar a Supabase
    RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/ingesta-biblia" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
      -H "Content-Type: application/json" \
      -d "{ \"page_content\": \"$TEXTO\", \"page_number\": 0, \"source\": \"$source_name\" }")
    
    echo "   ✅ Resultado: $RESPONSE" | tee -a "$LOG_FILE"
    
    # 3. Pequeña pausa para no saturar
    sleep 2
done

echo "🏁 Ingesta Normativa Completada." | tee -a "$LOG_FILE"
date | tee -a "$LOG_FILE"
