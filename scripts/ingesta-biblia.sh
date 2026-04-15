#!/bin/bash
# scripts/ingesta-biblia.sh — v12.0 SICC Sovereign
# El manejo de reintentos ahora es gestionado internamente por Node.js.

echo "🚀 Iniciando proceso de ingesta masiva (Lote Biblia Legal)..."
node scripts/ingest_masivo.js
echo "🏁 Proceso finalizado."
