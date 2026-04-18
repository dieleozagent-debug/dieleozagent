# 🗺️ Roadmap OpenGravity SICC — v12.9 (Estado real 2026-04-18)

---

## ✅ COMPLETADO

| Ítem | Estado |
|---|---|
| Ciclo `/dream` end-to-end (Auditor → Oracle → Juez → Karpathy) | ✅ |
| Oracle NotebookLM MCP — 108 fuentes LFC2 | ✅ |
| Auto-restart Chrome en -32001 (`docker restart`) | ✅ |
| Parser Juez robusto (JSON → code fence → campos → inferencia) | ✅ |
| Persistencia DT aprobada en `brain/dictamenes/` | ✅ |
| Registro `brain/DREAMS/` (aprobado y rechazado) | ✅ |
| `brain/PENDING_DTS/` para borradores impuros tras 3 ciclos | ✅ |
| Vectorización DT certificada en `sicc_genetic_memory` | ✅ |
| Vectorización veredicto Juez (aprobado + rechazado) | ✅ |
| brain.js reducido a 4 archivos efectivos (SOUL, R-HARD, IDENTITY, METHODOLOGY) | ✅ |
| Ingesta con chunking max 800 chars + overlap 100 chars | ✅ |
| Truncado query Supabase RAG a 500 chars | ✅ |
| Skip 429 reciente en cascada de proveedores | ✅ |
| exec timeout 30 min | ✅ |
| Retry Telegram en ECONNRESET | ✅ |
| Arquitectura DT → LFC2 → Vercel documentada | ✅ |

---

## 🔶 PENDIENTE

| Ítem | Prioridad |
|---|---|
| `/dream telecomunicaciones` — validar ciclo completo con Oracle | 🔴 Alta |
| Comando `promote` — copia DT de `brain/dictamenes/` → `LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/` + git commit automático | 🔴 Alta |
| Validar primeras entradas `DT_CERTIFICADA` / `VEREDICTO_JUEZ` en `sicc_genetic_memory` tras próximo sueño | 🔴 Alta |
| Re-ingesta de chunks anteriores (pre-fix) con nuevo chunking 800c | 🟡 Media |
| Rate limit diario Gemini/Groq — rotación de API keys | 🟡 Media |
| `SICC_OPERATIONS.md` actualización automática tras cada sueño | 🟡 Media |
| Test `/cerebro` valida SOUL + R-HARD activos en prompt | 🟢 Baja |

---

## 🔗 Pipeline DT → LFC2 → Vercel (flujo actual — manual)

```
brain/dictamenes/DT-*.md
        │ (copia manual)
        ▼
LFC2/II_Apendices_Tecnicos/Decisiones_Tecnicas/
        │ node scripts/lfc-cli.js cook && serve
        ▼
LFC2/X_ENTREGABLES_CONSOLIDADOS/8_DOCUMENTOS_SERVIDOS/HTML/
        │ git push LFC2 origin main
        ▼
lfc-2.vercel.app (auto-deploy)
```

---

*Actualizado: 2026-04-18 | OpenGravity SICC v12.9*
