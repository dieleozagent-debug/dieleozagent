#!/bin/bash
# scripts/sicc-backup.sh — Respaldo Soberano BD + Brain (v1.0)
# Rotación: 3 días | Compresión: Alta (gzip)

BACKUP_DIR="/home/administrador/docker/agente/data/backups"
BRAIN_DIR="/home/administrador/docker/agente/brain"
TIMESTAMP=$(date +"%Y%m%d_%H%M")
DB_CONTAINER="supabase_db_sicc-local"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] 🛡️ Iniciando Backup SICC..."

# 1. Database Dump (postgres | contrato_documentos)
echo "[$(date)] 💾 Extrayendo Dump SQL de la Base de Datos..."
docker exec "$DB_CONTAINER" pg_dump -U postgres postgres | gzip > "$BACKUP_DIR/sicc_db_$TIMESTAMP.sql.gz"

# 2. Brain Backup (Archivos incrementales/nuevos via tar)
echo "[$(date)] 🧠 Respaldando el Brain..."
tar -czf "$BACKUP_DIR/sicc_brain_$TIMESTAMP.tar.gz" -C "/home/administrador/docker/agente" brain

# 3. Rotación Automática (Mantener solo los últimos 3 días - aprox 6-12 archivos)
echo "[$(date)] 🧹 Ejecutando rotación de seguridad (3 días)..."
find "$BACKUP_DIR" -type f -mtime +3 -delete

echo "[$(date)] ✅ Backup completado exitosamente."
ls -lh "$BACKUP_DIR/sicc_db_$TIMESTAMP.sql.gz" "$BACKUP_DIR/sicc_brain_$TIMESTAMP.tar.gz"
