# TOOLS.md — Herramientas Disponibles

## Herramientas Activas

### 1. Chat con IA
- **Descripción:** Conversación en lenguaje natural con memoria de sesión
- **Proveedores:** Gemini → Groq → OpenRouter (fallback automático)
- **Uso:** Cualquier mensaje de texto en Telegram

### 2. Estado del sistema
- **Descripción:** Muestra qué proveedores de IA están configurados y activos
- **Uso:** Comando `/estado` en Telegram

### 3. Cerebro (Brain)
- **Descripción:** Lee los archivos SOUL, IDENTITY, USER, AGENTS de `/app/data/brain/`
  e inyecta el contexto en cada conversación
- **Actualizables sin rebuild:** Sí — edita los `.md` y reinicia con `docker compose restart agente`

## Herramientas Planificadas (Próximas)

| Herramienta | Descripción | Prioridad |
|---|---|---|
| **Memoria persistente** | Guardar historial entre reinicios en `memory/YYYY-MM-DD.md` | Alta |
| **Consulta Supabase** | Acceder a la DB `sicc-local` desde el agente | Media |
| **Notas de voz** | Transcribir audios de Telegram con Groq Whisper | Media |
| **Google Calendar** | Leer y crear eventos en el calendario | Baja |
| **Gmail** | `dieleozagent@gmail.com` — Leer correos, responder, enviar | Alta |

## Cómo Añadir una Nueva Herramienta

1. Crea `src/skills/nombre-skill.js` con la lógica
2. Documenta el skill en este archivo `TOOLS.md`
3. Importa y registra en `src/agent.js`
4. Reconstruye: `docker compose up -d --build`


### Refactorización de Strings Complejos
- Usa Node.js + RegEx () para reemplazos de código multilinea en lugar del obsoleto y propenso a errores , protegiendo el .
