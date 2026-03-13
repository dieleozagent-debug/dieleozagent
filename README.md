# 🤖 OpenGravity Agent — Agente IA Local con Telegram + Docker

> **Stack:** Node.js · Telegram Bot API · Groq · OpenRouter · Docker · Ubuntu Server

Agente de inteligencia artificial autónomo que corre **100% en local** sobre Docker en Ubuntu. Se controla por Telegram, usa modelos de IA gratuitos (Groq + OpenRouter) y es generado/extendido con **Google Antigravity** como IDE de IA.

---

## 📁 Estructura del Proyecto

```
agente/
├── src/
│   └── index.js              # Punto de entrada del agente
├── .env.example              # Plantilla de variables de entorno
├── .env                      # Variables reales (NO subir a Git)
├── package.json              # Dependencias y scripts npm
├── Dockerfile                # Imagen Docker del agente
├── docker-compose.yml        # Orquestación del contenedor
├── .dockerignore             # Archivos excluidos del build
├── .gitignore                # Archivos excluidos de Git
├── docs/
│   └── ARCHITECTURE.md       # Diagrama y diseño del sistema
└── README.md                 # Este archivo
```

---

## 🧰 Prerequisitos en el Servidor Ubuntu

> Antes de clonar el repositorio, asegúrate de tener lo siguiente instalado en Ubuntu.

### 1. Instalar Git

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install git -y
git --version
```

### 2. Instalar Docker Engine

```bash
# Instalar dependencias
sudo apt install ca-certificates curl gnupg -y

# Agregar clave GPG oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Agregar repositorio Docker
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

# Verificar instalación
docker --version
docker compose version

# (Opcional) Ejecutar Docker sin sudo
sudo usermod -aG docker $USER
newgrp docker
```

---

## 🚀 Instalación y Puesta en Marcha

### Paso 1 — Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/agente.git
cd agente
```

> Si es un repo nuevo, sigue la sección **"Iniciar con Antigravity"** primero.

### Paso 2 — Configurar variables de entorno

```bash
cp .env.example .env
nano .env
```

Completa los valores en `.env` (ver sección **Claves API** abajo).

### Paso 3 — Crear el directorio de datos persistentes

```bash
mkdir -p /home/administrador/data-agente
```

> Esta carpeta vive **fuera** del contenedor. Aunque borres o reconstruyas el contenedor, la memoria y datos del agente se conservan aquí.

### Paso 4 — Construir y levantar el contenedor

```bash
docker compose up -d --build
```

### Paso 5 — Ver logs en tiempo real

```bash
docker compose logs -f agente
```

### Paso 6 — Probar el agente

Ve a Telegram, busca tu bot por el nombre que le diste en BotFather y escríbele:

```
Hola! ¿Qué puedes hacer?
```

---

## 🔑 Claves API Necesarias

| Variable              | Servicio         | URL                                        | Costo  |
|-----------------------|------------------|--------------------------------------------|--------|
| `TELEGRAM_BOT_TOKEN`  | Telegram BotFather | Telegram > @BotFather > /newbot           | Gratis |
| `TELEGRAM_USER_ID`    | Telegram userinfobot | Telegram > @userinfobot > /start        | Gratis |
| `GROQ_API_KEY`        | Groq Console     | https://console.groq.com                   | Gratis |
| `OPENROUTER_API_KEY`  | OpenRouter       | https://openrouter.ai                      | Gratis |

### Plantilla `.env.example`

```env
# ── Telegram ──────────────────────────────────────────
TELEGRAM_BOT_TOKEN=tu_token_aqui
TELEGRAM_USER_ID=tu_id_numerico_aqui

# ── Motor IA (proveedor principal) ────────────────────
GROQ_API_KEY=tu_groq_key_aqui
GROQ_MODEL=llama3-70b-8192

# ── Motor IA (respaldo/fallback) ──────────────────────
OPENROUTER_API_KEY=tu_openrouter_key_aqui
OPENROUTER_MODEL=openai/gpt-4o-mini

# ── Configuración del agente ──────────────────────────
AGENT_NAME=MiAgente
AGENT_LANGUAGE=es
NODE_ENV=production
```

---

## 🐳 Docker: Configuración detallada

### `Dockerfile`

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
```

### `docker-compose.yml`

```yaml
services:
  agente:
    build: .
    container_name: opengravity-agente
    restart: unless-stopped
    env_file:
      - .env
    volumes:
      # Datos persistentes: host → contenedor
      - /home/administrador/data-agente:/app/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

### `.dockerignore`

```
node_modules
.env
.git
*.log
```

---

## 🤖 Generar el Código con Google Antigravity

### Paso 1 — Abrir la carpeta en Antigravity

Abre **Google Antigravity** (la interfaz IDE), haz clic en **Open Folder** y selecciona la carpeta `/home/TU_USUARIO/agente` (la carpeta clonada/creada).

### Paso 2 — Cambiar a modo Planning

En la interfaz de Antigravity, selecciona el modo **Planning** y elige el modelo **Gemini 2.5 Pro** o **Flash**.

### Paso 3 — Pegar el Prompt Maestro

```
Actúa como un desarrollador Senior en Node.js. Necesito que construyas desde cero un agente de IA autónomo que se ejecute en local dentro de un contenedor Docker en Ubuntu.

Requisitos:

1. INTERFAZ: Telegram Bot — solo responde a mi TELEGRAM_USER_ID (leído desde .env).
2. MOTOR IA: Usa Groq como proveedor principal y OpenRouter como fallback. Ambas claves en .env.
3. ESTRUCTURA DE ARCHIVOS:
   - src/index.js       → punto de entrada, polling de Telegram
   - src/agent.js       → lógica del agente y llamadas a IA
   - src/config.js      → lectura centralizada de .env con validación
   - .env.example       → plantilla sin valores reales
   - package.json       → con script npm run dev (nodemon) y npm start
   - Dockerfile         → basado en node:20-alpine
   - docker-compose.yml → con restart: unless-stopped y volume para /app/data
   - .dockerignore y .gitignore

4. CÓDIGO: Limpio, modular, comentado en español.
5. SEGURIDAD: El bot ignora mensajes de cualquier usuario distinto a TELEGRAM_USER_ID.
6. MANEJO DE ERRORES: Captura errores de red y de la API de IA, con reintentos.

Genera el plan primero. Cuando lo apruebe, escribe todos los archivos.
```

### Paso 4 — Revisar el plan y aprobar

Antigravity mostrará un **plan de implementación**. Revísalo y haz clic en **Accept** para que empiece a escribir los archivos.

### Paso 5 — Completar `.env` y levantar Docker

```bash
cp .env.example .env
nano .env        # Pegar tus claves reales
docker compose up -d --build
docker compose logs -f agente
```

---

## 🔧 Comandos Útiles

```bash
# Ver estado del contenedor
docker compose ps

# Reiniciar el agente (por ej. tras cambiar .env)
docker compose restart agente

# Detener todo
docker compose down

# Reconstruir imagen tras cambios en código
docker compose up -d --build

# Entrar al contenedor (debug)
docker exec -it opengravity-agente sh

# Ver logs últimas 100 líneas
docker compose logs --tail=100 agente
```

---

## 🔄 Actualizaciones con Antigravity

Para añadir nuevas capacidades al agente, vuelve a Antigravity con la carpeta abierta y usa prompts como:

```
Añade memoria persistente usando un archivo JSON local en /app/data/memory.json.
El agente debe recordar las últimas 20 conversaciones con el usuario.
```

```
Implementa transcripción de notas de voz usando la API de Groq Whisper.
Cuando el usuario envíe un audio por Telegram, transcríbelo y respóndele.
```

Tras cada mejora, reconstruye el contenedor:

```bash
docker compose up -d --build
```

---

## 📜 Licencia

MIT — Libre para uso personal y comercial.
