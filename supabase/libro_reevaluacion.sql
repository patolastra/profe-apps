-- Libro de Clases — Reevaluar a un estudiante ya evaluado (deuda AD, 2026-10-07).
-- Ver AUDITORIA/DESARROLLO_PARALELO.md, ficha AD.
--
-- Guarda los intentos anteriores de cada estudiante en una evaluación cuando el profe
-- lo "reevalúa": la nota nueva reemplaza a la anterior (que queda como historial).
-- Cada intento: { "nota": 2.8, "fecha": "2026-10-07", "exc": false,
--                 "resultados": [ { "item": "<uuid ítem>", "valor": 3 }, ... ] }
-- No cambia datos existentes (todas las filas quedan con lista vacía).

ALTER TABLE libro_evaluacion_notas
    ADD COLUMN IF NOT EXISTS intentos_anteriores JSONB NOT NULL DEFAULT '[]'::jsonb;
