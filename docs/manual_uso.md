# 📖 Manual de Uso OpenGravity SICC v12.2 "Paz Estructural"

Bienvenido al ecosistema **OpenGravity**. Este agente es tu **Auditor Forense, Administrador Contractual y Centinela de Datos** operando bajo soberanía tecnológica total en modo **Nodo Único Soberano**.

---

## 📱 Interacción vía Telegram (Modo Operativo)

El bot es tu interfaz principal para la supervisión y toma de decisiones. Solo responde al usuario autorizado (Diego).

### 🛠️ Guía Maestra de Comandos

| Comando | Función | Uso Sugerido |
|:---|:---|:---|
| `/doctor` | **SICC Health Report** | Verificar pureza técnica y adherencia al DBCD. |
| `/learn` | **Auto-Aprendizaje** | Mapear recursivamente el repositorio LFC2 y actualizar rutas. |
| `/audit [ruta]` | **Karpathy Loop** | Ejecutar auditoría forense manual sobre una carpeta específica. |
| `/ingesta` | **Ingesta Biblia** | Inicia el motor resiliente v12.1 (Páginas 2000+) de la Biblia Legal. |
| `/cerebro` | **Integridad SSOT** | Verificar el estado de los archivos de identidad y el Brain. |
| `/limpiar` | **Reset Cognitivo** | Limpiar el historial de la sesión para cambiar de tema. |

### 📎 Auditoría de Documentos (RAG)
Puedes enviar archivos directamente al bot:
1.  **PDFs (Contratos/Actas):** Adjunta el archivo y añade un comentario como: *"¿Esto viola la cláusula 8.1 del AT1?"*.
2.  **Imágenes (Planos/Capturas):** Envía una foto para análisis visual contra el Manual de O&M.

---

## 📊 Gestión de Ingesta Masiva (Biblia Legal)

La arquitectura v12.2 ha erradicado los "Sentinel" automáticos por ser fuente de spam. La ingesta es ahora un proceso manual y resiliente:

1. **Lanzamiento Manual**: Usa `/ingesta` desde Telegram o ejecuta `node scripts/ingest_masivo.js`.
2. **Resiliencia v12.1**: El motor gestiona errores 429 (Too Many Requests) aplicando un **Backoff Exponencial** (esperas de 15s, 30s, 60s...).
3. **Monitoreo**: Puedes seguir el progreso con `tail -f data/logs/ingesta_v12.log`.
4. **Patrulla Pasiva**: El agente te notificará en el bot si detecta nuevos PDFs en `/Contrato pdf/`, pero NO los procesará sin tu orden.

---

## 🛡️ Protocolo de Purga "Zero-Residue"

Si detectas reinicios automáticos o logs sospechosos de tipo "SENTINEL", ejecuta este comando nuclear en el host:

```bash
# Purga manual definitiva (Solo si falla el docker-compose)
sudo rm -f /etc/cron.d/sicc-persistence
sudo rm -f /usr/local/bin/sicc-persistence-loop.sh
pkill -9 -f night-shift.sh
```

---

## 🛡️ Estabilidad SICC v6.4

- **Resource Governor**: El bot prioriza **Ollama (Local)** pero escalará automáticamente a **Groq (Cloud)** si detecta que la CPU del host supera el 70%.
- **Sequential Swarm**: Los debates forenses operan de forma secuencial para respetar el **SICC Hard-Cap** de 3 CPUs.
- **Message Splitter**: Si un reporte técnico excede los 3500 caracteres, se enviará automáticamente en fragmentos numerados.

---

## 🏗️ Navegación Documental

- **Arquitectura**: Para detalles del motor, consulta la [Arquitectura Soberana v12.2](file:///home/administrador/docker/agente/architecture.md).
- **Roadmap**: Consulta los hitos actuales en [Roadmap SICC](file:///home/administrador/docker/agente/roadmap.md).

---
v12.2 "Paz Estructural" — 15/04/2026 (Certificado Zero-Residue)
