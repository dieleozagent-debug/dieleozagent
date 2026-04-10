-- Habilitar extensión vectorial si no existe
CREATE EXTENSION IF NOT EXISTS vector;

-- Crear la tabla para los fragmentos del contrato
CREATE TABLE IF NOT EXISTS contrato_documentos (
    id BIGSERIAL PRIMARY KEY,
    nombre_archivo TEXT NOT NULL,
    contenido TEXT NOT NULL,
    embedding vector(768) -- Dimensión estándar para nomic-embed-text y text-embedding-004
);

-- Crear una función para buscar por similitud (RAG)
CREATE OR REPLACE FUNCTION buscar_documentos_contrato (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  nombre_archivo text,
  contenido text,
  similitud float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cd.id,
    cd.nombre_archivo,
    cd.contenido,
    1 - (cd.embedding <=> query_embedding) AS similitud
  FROM contrato_documentos cd
  WHERE 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
