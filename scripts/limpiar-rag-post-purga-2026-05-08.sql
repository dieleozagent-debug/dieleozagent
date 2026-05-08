-- ============================================================================
-- LIMPIEZA RAG · sicc_genetic_memory · post-purga 2026-05-08
-- ============================================================================
-- Razón: 3 DTs aprobados por el agente fueron auditados manualmente por el
-- Director Técnico UF2 y rechazados por contener alucinaciones del LLM
-- (loop literal, "100% ANI", "detección de isla", paráfrasis Resolución de
-- Surcos, mezcla SIL/FRA, etc.). Esos DTs y sus veredictos vectorizados
-- contaminan próximos ciclos /audit reciclando los mismos errores.
--
-- DTs movidos a brain/REJECTED_DTS/:
--   - DT-SICC-2026-002_CONSORCIO_CONSTRUCTOR_LINEA_FERREA_APROBADO.md
--   - DT-ENRG-2025-001_CONSORCIO_CONSTRUCTOR_LINEA_FERREA_APROBADO.md
--   - DT-EMBARCADO-2026-001_CONSORCIO_CONSTRUCTOR_LINEA_FERREA_APROBADO.md
--
-- Ejecutar con Vo.Bo. del Director Técnico UF2:
--   docker exec -i sicc-postgres psql -U <user> -d <db> < scripts/limpiar-rag-post-purga-2026-05-08.sql
-- ============================================================================

-- 1. Inspeccionar qué fragmentos hay vinculados a los 3 DTs rechazados
\echo '=== Antes de la limpieza ==='
SELECT COUNT(*) AS total_fragmentos FROM sicc_genetic_memory;
SELECT source_doc, COUNT(*) AS fragmentos
FROM sicc_genetic_memory
WHERE source_doc ILIKE '%DT-SICC-2026-002%'
   OR source_doc ILIKE '%DT-ENRG-2025-001%'
   OR source_doc ILIKE '%DT-EMBARCADO-2026-001%'
GROUP BY source_doc;

-- 2. Eliminar fragmentos de los 3 DTs rechazados (incluye veredictos del Juez)
DELETE FROM sicc_genetic_memory
WHERE source_doc ILIKE '%DT-SICC-2026-002%'
   OR source_doc ILIKE '%DT-ENRG-2025-001%'
   OR source_doc ILIKE '%DT-EMBARCADO-2026-001%';

-- 3. Eliminar también veredictos del Juez asociados a estos DTs
-- (si la columna fuera otra, ajustar — verificar schema antes)
DELETE FROM sicc_genetic_memory
WHERE content ILIKE '%DT-SICC-2026-002%'
   OR content ILIKE '%DT-ENRG-2025-001%'
   OR content ILIKE '%DT-EMBARCADO-2026-001%';

-- 4. (Opcional, agresivo) Purgar también fragmentos que contengan alucinaciones
--    catalogadas — descomentar bajo Vo.Bo. del Director Técnico:
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%100%% por la ANI%';
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%detección de isla%';
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%LiFePO%' AND content ILIKE '%mandato%';
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%Checklist V3.5%';
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%Sistema SICC v14.6%';
-- DELETE FROM sicc_genetic_memory WHERE content ILIKE '%vinculante vía Sección 2.209%';

\echo '=== Después de la limpieza ==='
SELECT COUNT(*) AS total_fragmentos FROM sicc_genetic_memory;

-- 5. Re-vectorizar las SPECIALTIES con vacunas nuevas para que el agente
--    las absorba en próximos /audit. Ejecutar desde el agente:
--    node scripts/ingest-specialties.js
--    (o el comando equivalente en src/ingestar.js)
