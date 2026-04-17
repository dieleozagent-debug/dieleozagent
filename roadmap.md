# 🗺️ SICC AGENT ROADMAP — v12.9 | 17-Abr-2026

---

## 🔄 ESTADO HOY (17-Abr-2026)

| Componente | Estado | Detalle |
|---|---|---|
| **Bot Telegram** | 🟢 ACTIVO | Polling, autorización por userId |
| **Multiplexador LLM** | 🟢 ACTIVO | Cascada 5 niveles con idioma español garantizado |
| **Supabase RAG** | 🟢 ACTIVO | pgvector + Ollama embeddings, contrato LFC2 indexado |
| **Sistema Inmune** | 🟢 ACTIVO | 53 lecciones en `sicc_genetic_memory`, Fase 1 integrada |
| **Oracle MCP** | 🟢 CERTIFICADO | SSE per-connection, Chrome real, sesión Google persistente |
| **Ciclo /dream** | 🟢 END-TO-END | 5 fases validadas, Oracle respondiendo datos reales LFC2 |

---

## ✅ HITOS COMPLETADOS

### v12.9 — Oráculo Certificado (17-Abr-2026)

**Bugs críticos resueltos:**
- [x] `/dream` sin salida en Telegram — 3 bugs en cascada (timeout Oracle, exec sin límite, BLOCKER dentro del while)
- [x] Oracle crash-loop `"Already connected to a transport"` — patrón per-connection Server en `src/index.ts`
- [x] Google Chrome en Oracle (no Chromium) — resuelve bloqueo de IPs datacenter en Google Sign-In
- [x] Volumen `chrome_profile` mapeado a ruta `env-paths` — sesión Google persiste entre reinicios
- [x] Auth manual con Xvfb + script `auth2.cjs` + código 2FA SMS — sesión activa en notebook "Contrato Ardanuy LFC" (108 fuentes)
- [x] `BROWSER_TIMEOUT=120000` en Oracle — resuelve `-32001 Request timed out` en `ask_question`
- [x] Idioma español obligatorio en **todos** los proveedores — incluye Ollama y OpenRouter
- [x] Cascada OpenRouter corregida: `openrouter/free` primero (Nemotron 70B, Trinity Large, gpt-oss-120b a $0), luego modelos pagados como último recurso

**Cascada LLM v12.9:**
```
1. Gemini free  (1500 req/día)
2. Groq free    (100K tokens/día)  
3. Ollama local (sin límite, español forzado)
4. openrouter/free → auto-selección mejor modelo gratuito (Nemotron, Trinity, gpt-oss-120b…)
5. openrouter pagado → gemini-2.0-flash-001 / llama-3.3-70b (~$0.10-0.12/1M) — último recurso
```

### v12.8 y anteriores
- [x] Arquitectura Nodo Único Soberano v12.2
- [x] Brain: IDENTITY.md v6, SOUL.md, R-HARD.md
- [x] Ollama nativo en host vía 0.0.0.0
- [x] Gobernanza Recursos v12.3: CPU 80% throttling
- [x] SAPI modularizado: Supabase RAG + NotebookLM MCP
- [x] Filtro Anti-Meta-Habla + Inyección ADN (v12.4)
- [x] Michelin v7.2: OCR + ingesta masiva con checkpoints
- [x] Memoria Genética: 53 lecciones seeded

---

## 🎯 PENDIENTE

### Alta Prioridad
- [ ] **Prueba de estrés `/dream`** sobre Energía, Señalización y Centro de Control con Oracle activo y proveedores frescos (mañana cuando se reseteen cuotas)
- [ ] **Interrogación iterativa Oracle:** Juez debe emitir ≥2 preguntas de seguimiento al Oracle por ciclo para mayor profundidad normativa
- [ ] **Renovación sesión Google:** Validar recuperación cuando expire la sesión (~3-6 meses). Ver procedimiento en `notebook-mcp/architectureMCP.md`
- [ ] **`docs/manual_uso.md`:** Actualizar de v12.2 a v12.9 — agregar cascada LLM completa, Fase 5 dream, comandos faltantes (/swarm, /cmd), procedimiento re-auth Oracle

### Media Prioridad
- [ ] **Mapeo dinámico de especialidades:** `brain/SPECIALTIES/*.md` → `notebook_id` específico en NotebookLM por dominio técnico
- [ ] **Circuit breaker multiplexer:** Recuperación automática ante 402 + bloqueo temporal de proveedor saturado
- [ ] **Saneamiento Zero-Residue:** 10 inconsistencias matemáticas detectadas en LFC2
- [ ] **Integración email:** Verificar IMAP/SMTP extremo a extremo
- [ ] **Tavily web research:** Completar integración (clave presente, no conectada al flujo dream)

### Baja Prioridad
- [ ] Tests Jest: `config.js`, `brain.js`, `supabase.js`, `supabase_rag.js`
- [ ] Modularizar `index.js` y `agent.js` (>200 líneas cada uno)
- [ ] Sanitizar inputs `/cmd` e `/ingesta` (riesgo inyección shell)
- [ ] Migrar `.env` a Docker Secrets
