# 📖 Manual de Uso — OpenGravity SICC v12.9 "Oráculo Certificado"

> Última validación: 17-Abr-2026. Estado verificado ejecutando cada comando contra el contenedor activo.

---

## 🗺️ Mapa de Comandos (Estado Real)

| Comando | Estado | Velocidad | Notas |
|:---|:---:|:---|:---|
| `/hola` | ✅ | Inmediato | Menú de ayuda |
| `/dream [tema]` | ✅ | 5-30 min | Comando principal. Ver sección detallada abajo |
| `/swarm [pregunta]` | ✅ | ~10 min | Pregunta libre al enjambre sin ciclo de 5 fases |
| `/doctor` | ✅ | ~5s | Health check — score 85/100 en validación |
| `/learn` | ✅ | ~3s | Mapea 119 rutas LFC2, actualiza índice |
| `/cerebro` | ✅ | Inmediato | Lista archivos brain/ con estado |
| `/memoria` | ✅ | Inmediato | Muestra días de memoria almacenados |
| `/estado` | ✅ | Inmediato | Muestra estado de APIs (Gemini/Groq/OpenRouter) |
| `/limpiar` | ✅ | Inmediato | Limpia historial de sesión |
| `/ollama [prompt]` | ⚠️ | ~30-45s | Funciona cuando CPU < 80%. Falla si CPU saturada |
| `/cmd [comando]` | ✅ | ~15s max | Ejecuta shell en el contenedor. Timeout 15s |
| `/ingesta [ruta]` | ✅ | Minutos | Ingesta PDFs al vector DB. Sin timeout |
| `/audit [ruta]` | ✅ | ~5s | Auditoría forense de carpeta LFC2 |
| `/karpathy [tema]` | ✅ | ~10s | Busca archivos + audita + extrae lección |
| `/audit_run` | ✅ | ~10s | Fuerza ciclo de auditoría completo |
| `/dream_on/off/status` | ✅ | Inmediato | Activa/detiene patrulla autónoma 24/7 |
| `/git [sub]` | ⚠️ | ~3s | Funciona pero token puede tener límites. Ver sub-comandos |
| `/correos` | ⚠️ | ~5s | IMAP Gmail. **Requiere credenciales IMAP en .env** |
| `/email` | ⚠️ | ~5s | Envío Gmail. **Requiere credenciales SMTP en .env** |

---

## 🌪️ Flujo Principal: `/dream [tema]`

El comando más importante. Ejecuta un ciclo forense autónomo de **5 fases**.

```
/dream telecomunicaciones
```

### Las 5 Fases (validadas y operativas)

**Fase 1 — Vacunación** *(~5s)*
- Consulta `sicc_genetic_memory` (Supabase) para el tema dado
- Inyecta vacunas de errores pasados en el prompt para no repetirlos
- Si no hay lecciones previas, continúa sin restricciones adicionales

**Fase 2 — RAG Match** *(~10s)*
- Busca fragmentos literales del contrato LFC2 en `contrato_documentos`
- Genera un Borrador de Decisión Técnica (DT) anclado en el contrato
- Proveedor: cascada LLM (ver sección Proveedores)

**Fase 3 — Oracle Check** *(30s-3min)*
- Conecta a `notebooklm-mcp-v12:3001` vía SSE
- Google Chrome navega a NotebookLM con la sesión guardada
- Consulta el notebook "Contrato Ardanuy LFC" (108 fuentes)
- Valida borrador contra normativas FRA/AREMA/UIC
- **Si el Oracle no responde en 3 min → continúa sin feedback externo**

**Fase 4 — Juicio** *(~30s)*
- El Juez AI cruza Borrador + Feedback Oracle
- Emite JSON: `{ aprobado, razon, categoria_fallida, leccion_karpathy }`
- Resultado: **APROBADO** o **RECHAZADO**

**Fase 5 — Persistencia y Auto-tuning**

Si **APROBADO**:
- `brain/dictamenes/DT-{PREFIX}-{AÑO}-{SEQ}_*_APROBADO.md` — texto completo certificado
- `brain/DREAMS/DREAM-*-CERTIFICADO.md` — log del sueño
- `sicc_genetic_memory` (Supabase) — vectorizado para RAG en sueños futuros del área

Si **RECHAZADO** (y se agotaron los 3 ciclos):
- `brain/SPECIALTIES/{categoria}.md` — lección Karpathy append (auto-tuning)
- `brain/PENDING_DTS/PENDING-*.md` — borrador impuro para revisión humana
- `brain/DREAMS/DREAM-*-RECHAZADO.md` — log del sueño

**Ciclos:** Máximo 3 intentos. Si los 3 fallan → `🛑 SICC BLOCKER`.
**Timeout total:** 30 minutos (exec hard-cap). Oracle: 90s por consulta, auto-restart si Chrome cuelga.

### Cascada de Proveedores LLM

Orden de escalación cuando un proveedor falla (429 / timeout):

```
1. Gemini free      → ~1500 req/día  (se resetea medianoche UTC)
2. Groq free        → 100K tokens/día (se resetea medianoche UTC)
3. Ollama local     → sin límite, prompt segmentado en 4 secciones, timeout 45s
4. openrouter/free  → auto-selección: Nemotron 70B, Trinity Large, gpt-oss-120b ($0)
5. OpenRouter pagado → gemini-2.0-flash-001 / llama-3.3-70b (~$0.10-0.12/1M tokens)
```

**Idioma:** Todos los proveedores incluyen instrucción de idioma → respuesta siempre en español.

### Cuándo usar `/dream` vs `/swarm`

| | `/dream [tema]` | `/swarm [pregunta]` |
|---|---|---|
| Tipo de input | Especialidad técnica (`telecomunicaciones`) | Pregunta abierta (`¿Cuánto cuesta el PTC?`) |
| Ciclos | 3 max con auto-corrección | 1 ciclo |
| Oracle | Sí (Fase 3) | Sí (integrado) |
| Auto-tuning | Sí (Fase 5) | No |
| Uso ideal | Generar DT certificada | Consulta rápida con validación |

---

## 🩺 `/doctor` — Health Check

Verifica la salud del sistema. Score actual: **85/100**.

```
/doctor
```

Qué revisa:
- Memoria libre del servidor
- Archivos del brain (SOUL, IDENTITY, R-HARD, DBCD_CRITERIA)
- Estado Git de LFC2
- Conectividad Ollama
- Hipótesis en cola de auditoría
- CPU (alerta si > 70%)

---

## 📚 `/learn` — Auto-mapeo LFC2

Mapea recursivamente el repositorio LFC2 e indexa las rutas.

```
/learn
```

Resultado validado: mapea **119 rutas + 3 redirects legacy** en ~3 segundos. Actualiza el índice de navegación del agente.

---

## 🔬 Comandos de Auditoría Forense

### `/audit [ruta]`
Auditoría forense manual de una carpeta específica de LFC2.
```
/audit IV_Ingenieria_basica
/audit II_A_Analisis_Contractual
```

### `/karpathy [tema]`
Búsqueda inteligente + auditoría + extracción de lección.
```
/karpathy Ingeniería Eléctrica
/karpathy telecomunicaciones
```
Busca archivos, normaliza acentos, audita y registra en el brain.

### `/audit_run`
Fuerza un ciclo completo de auditoría usando el harness SICC.

### `/ingesta [ruta]`
Ingesta masiva de PDFs al vector DB (Supabase + pgvector).
```
/ingesta /home/administrador/docker/agente/Contrato pdf
/ingesta /home/administrador/docker/LFC2/IV_Ingenieria_basica
```
- Motor Michelin v7.2 con OCR (pdftoppm 300dpi + Tesseract)
- Checkpoints por archivo — se puede interrumpir y reanudar
- Sin timeout — puede correr varios minutos

---

## 🛰️ Patrulla Autónoma (`/dream_on`)

Activa un ciclo de auditoría autónoma continua.

```
/dream_on    → Inicia patrulla
/dream_off   → Detiene patrulla
/dream_status → Estado: activa/inactiva, carpeta actual, CPU%
```

**Nota:** La patrulla respeta el Resource Governor (CPU 80%). Con CPU alta se pone en modo agresivo o se auto-limita.

---

## 🖥️ `/ollama [prompt]` — IA Local Directa

Habla directamente con el modelo local sin pasar por el ciclo de sueños.

```
/ollama ¿Cuál es el CAPEX máximo permitido para señalización?
/ollama Resume el WBS 6.1.100
```

**Limitaciones:** Timeout 45s. Solo recomendado para preguntas cortas y directas. Para análisis profundo usar `/dream`.

---

## 💻 `/cmd [comando]` — Shell del Contenedor

Ejecuta cualquier comando bash en el contenedor del agente.

```
/cmd docker ps
/cmd df -h
/cmd cat data/logs/health.log | tail -20
```

**Timeout:** 15 segundos. Salida máxima: 3000 chars.

---

## 🔀 `/git [sub]` — GitHub Integration

Estado: funcional pero el token puede tener permisos limitados.

```
/git repo           → Info del repositorio
/git commits        → Últimos 5 commits
/git issues         → Issues abiertos
/git ls [ruta]      → Lista carpeta del repo
/git cat [archivo]  → Lee archivo del repo
```

---

## 📧 Email (`/correos`, `/email`) — Estado: ⚠️ Requiere Config

Los comandos están implementados pero requieren credenciales IMAP/SMTP activas en `.env`:

```
GMAIL_USER=dieleozagent@gmail.com
GMAIL_APP_PASSWORD=<app_password_de_16_chars>
```

```
/correos                              → Lee últimos 5 no leídos
/email diego@ejemplo.com|Asunto|Cuerpo → Envía correo
```

> **Nota:** La contraseña debe ser un **App Password** de Google (no la contraseña de cuenta). Para generarlo: Google Account → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones.

---

## 🛡️ Estado y Mantenimiento

### `/estado` — Estado de APIs
Muestra qué proveedores están configurados y si responden.

### `/cerebro` — Integridad del Brain
Lista todos los archivos del brain con estado OK/MISSING.

### `/memoria` — Memoria de Sesión
Muestra cuántos días de historial están almacenados.

### `/limpiar` — Reset Cognitivo
Limpia el historial de la sesión actual para cambiar de tema radicalmente.

---

## 🔑 Oracle — Re-autenticación (Cada 3-6 meses)

Cuando la sesión de Google expire, el `/dream` fallará en Fase 3 con `Failed to authenticate session`. Procedimiento:

**Terminal 1:**
```bash
docker exec notebooklm-mcp-v12 bash -c "
  pkill -9 -f chrome 2>/dev/null
  rm -f /app/user_data/chrome_profile/SingletonLock /tmp/.X99-lock
  Xvfb :99 -screen 0 1280x720x24 &>/dev/null &
  sleep 4 && DISPLAY=:99 node /app/user_data/auth2.cjs
"
```

Esperar `LISTO_PARA_CODIGO` en la terminal.

**Terminal 2** (inmediatamente al recibir el SMS):
```bash
docker exec notebooklm-mcp-v12 sh -c "echo 'CODIGO_6_DIGITOS' > /app/user_data/sms_code.txt"
```

Cuando aparezca `AUTH_COMPLETE`, la sesión queda guardada en el volumen persistente.

---

## 📊 Monitoreo Operativo

```bash
# Estado de todos los contenedores
docker ps --format "table {{.Names}}\t{{.Status}}"

# Logs en vivo del agente
docker compose logs -f --tail=30

# Oracle health
curl http://localhost:3001/health

# Ver últimas trazas de inferencia
cat data/logs/sicc-traces.json | python3 -m json.tool | tail -40

# Ver lecciones Karpathy por especialidad
cat brain/SPECIALTIES/COMMUNICATIONS.md | tail -20
```
