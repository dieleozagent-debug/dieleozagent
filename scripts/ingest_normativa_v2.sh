#!/bin/bash

# SICC INGESTA NORMATIVA v12.2.4 (Corrected Edition)
# Procesa PDFs masivos evitando el error "Argument list too long"

SOURCE_DIR="docs/00_Referencia_Normativa_Contractual_LFC"
LOG_FILE="data/logs/ingesta_normativa_v2.log"

echo "🚀 Iniciando Ingesta Normativa Robusta (v2.4)..." | tee -a "$LOG_FILE"
date | tee -a "$LOG_FILE"

find "$SOURCE_DIR" -maxdepth 1 -name "*.pdf" | while read -r pdf_file; do
    filename=$(basename "$pdf_file")
    source_name="normativa_${filename%.*}"
    
    # 1. Obtener total de páginas
    TOTAL_PAGES=$(pdfinfo "$pdf_file" | grep -i "Pages:" | awk '{print $2}')
    echo "📄 Documento: $filename ($TOTAL_PAGES páginas)" | tee -a "$LOG_FILE"
    
    if [ -z "$TOTAL_PAGES" ]; then
        echo "❌ Error: No se pudo determinar el total de páginas para $filename" | tee -a "$LOG_FILE"
        continue
    fi

    # 2. Procesar página por página
    for ((p=1; p<=TOTAL_PAGES; p++)); do
        # Extraer solo la página actual
        TEXTO=$(pdftotext -f "$p" -l "$p" "$pdf_file" -)
        
        # Omitir si la página está vacía
        if [ -z "$TEXTO" ]; then
            continue
        fi

        echo "   -> Subiendo Pág $p/$TOTAL_PAGES..."
        
        # Guardar en archivo temporal para que Node lo lea de forma segura
        echo "$TEXTO" > /tmp/page_content.txt
        
        # Escapar JSON usando Node de forma Robusta
        JSON_TEXT=$(node -e "console.log(JSON.stringify(require('fs').readFileSync('/tmp/page_content.txt', 'utf8')))")
        
        RESPONSE=$(curl -s -X POST "${SUPABASE_URL}/functions/v1/ingesta-biblia" \
          -H "Authorization: Bearer ${SUPABASE_SERVICE_ROLE_KEY}" \
          -H "Content-Type: application/json" \
          --data-binary @- <<EOF
{
  "page_content": $JSON_TEXT,
  "page_number": $p,
  "source": "$source_name"
}
EOF
)
        
        # Pequeña pausa para estabilidad
        sleep 0.2
    done
    
    echo "✅ Finalizado: $filename" | tee -a "$LOG_FILE"
done

echo "🏁 Ingesta Normativa v2.4 Completada." | tee -a "$LOG_FILE"
date | tee -a "$LOG_FILE"
rm -f /tmp/page_content.txt
