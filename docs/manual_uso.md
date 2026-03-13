# 📖 Manual de Uso del Agente OpenGravity (Telegram)

Bienvenido a tu asistente personal de IA. Este bot está diseñado específicamente para asesorar en la gestión del proyecto **LFC (Concesión Línea Férrea Central S.A.S.)**.

---

## 🚀 Cómo empezar
1. Abre tu aplicación de Telegram.
2. Busca al bot: `[Nombre del Bot o @agentedieleozbot]` (Asegúrate de estar usando el usuario autorizado).
3. Envía `/start` para iniciar la sesión.

---

## 🎯 Tu Rol Contractual
El agente actúa como el **Administrador Contractual EPC**. Sus respuestas están orientadas a la interpretación técnica-legal del proyecto La Dorada – Chiriguaná.

---

## 🧠 Capacidades Principales

### 1. Consulta del Contrato y Apéndices (RAG)
El bot tiene "Super Memoria" de los documentos del contrato (incluyendo los escaneos de los Apéndices AT1-AT10).
*   **Cómo usarlo:** Simplemente pregunta algo relacionado con el contrato.
*   **Ejemplos:**
    *   *"¿Cuáles son las obligaciones del EPC respecto a la Fibra Óptica?"*
    *   *"¿Qué dice el AT3 sobre los enclavamientos?"*
    *   *"¿Cuál es la multa por retraso en el hito de ingeniería?"*
*   **Nota:** El bot buscará automáticamente en la base de datos de Supabase y te citará el texto original.

### 2. Análisis de Archivos Externos
Puedes enviarle documentos que no estén en la base de datos original.
*   **Cómo usarlo:** Arrastra y suelta un PDF, Word o Imagen al chat de Telegram.
*   **Acción:** Una vez subido, pregúntale: *"Hazme un resumen crítico de este acta"* o *"Busca inconsistencias en este documento"*.

### 3. Revisión con Metodología Punto 42
El bot aplica un estándar profesional de revisión documental.
*   **Cómo usarlo:** Pídele revisar un texto o documento bajo la metodología .42.
*   **Resultado:** Te entregará un **Diagnóstico de Brechas** y una **Propuesta de Mejora** estructurada.

### 4. Redacción de Comunicaciones Oficiales
*   **Protocolo:** Si le pides redactar una carta, el bot se detendrá y te preguntará desde qué **rol** quieres escribir (Constructor, Interventoría, etc.).
*   **Ejemplo:** *"Redacta un oficio para la interventoría sobre el retraso en el hito 2"*.

---

## 🛠️ Comandos Disponibles
*   `/start`: Inicia o reinicia el saludo inicial.
*   `/estado`: Muestra la salud del sistema (Cerebro, Memoria y Conexión).
*   `/limpiar`: Borra el historial de la conversación actual (útil para cambiar de tema drásticamente).

---

## ⚠️ Consejos de Oro
*   **Exactitud:** El bot tiene prohibido inventar numerales. Si no encuentra la información en el contrato, te lo dirá.
*   **Citas:** Siempre exigirá o proveerá citas textuales: `[Documento], [Capítulo], [Numeral]`.
*   **Contexto:** El bot recuerda lo que hablaron hoy y ayer, por lo que puedes decirle: *"Respecto a lo que hablamos hace un momento..."*.
