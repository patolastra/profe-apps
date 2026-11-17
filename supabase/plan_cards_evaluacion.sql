-- Deuda HV (2026-11-17): una actividad del Plan muestra los grupos de trabajo de una evaluación del Libro
-- (los grupos se arman en el Libro; en el Plan se escribe la bitácora de cada grupo).
-- Si la evaluación se borra, la actividad queda sin grupos (no se borra).
ALTER TABLE plan_cards
    ADD COLUMN IF NOT EXISTS evaluacion_id UUID REFERENCES libro_evaluaciones(id) ON DELETE SET NULL;
