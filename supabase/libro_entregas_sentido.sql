-- Entregas: sentido de la entrega (2026-10-05).
--   'estudiantes' = los estudiantes entregan al profe (trabajos, tareas) — por defecto
--   'profe'       = el profe entrega a los estudiantes (guías, fotocopias, partituras)
-- Las entregas existentes quedan como 'estudiantes'. Ver AUDITORIA/DESARROLLO_PARALELO.md.
ALTER TABLE libro_entregas
    ADD COLUMN IF NOT EXISTS sentido TEXT NOT NULL DEFAULT 'estudiantes'
        CHECK (sentido IN ('estudiantes', 'profe'));
