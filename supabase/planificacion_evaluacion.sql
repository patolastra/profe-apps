-- Evaluación de cierre de cada planificación (deuda CK, 2026-10-21).
-- Cada planificación mensual (tabla planificaciones, deuda CI) cierra con UNA evaluación del Libro del curso,
-- con su rúbrica. El vínculo va en la evaluación: a qué planificación pertenece.
-- Aditiva e idempotente: no cambia ninguna columna existente; las evaluaciones actuales quedan sin planificación.
alter table libro_evaluaciones
  add column if not exists planificacion_id uuid references planificaciones(id) on delete set null;

-- Una sola evaluación de cierre por planificación.
create unique index if not exists libro_evaluaciones_planificacion_unica
  on libro_evaluaciones (planificacion_id) where planificacion_id is not null;
