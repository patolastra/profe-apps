-- LIBRO DE CLASES — Varios ítems típicos por grupo (deuda ER, ajuste PO 2026-11-02)
-- Cada grupo de una evaluación lleva una LISTA de ítems, en orden, mezclables:
--   [{ "cancion_id": "<id de repertorio_canciones>" } | { "texto": "una línea libre" }, …]
-- Reemplaza a cancion_id / tipico (libro_grupo_tipico.sql), que quedan sin uso: el Libro
-- los lee si un grupo aún no tiene lista y los deja vacíos al guardar la lista.
-- No se migran datos aquí a propósito: actualizar un grupo terminado o de una evaluación
-- cerrada choca con sus bloqueos; la interfaz hace la transición sola.
ALTER TABLE libro_evaluacion_grupos
    ADD COLUMN IF NOT EXISTS tipicos JSONB;
