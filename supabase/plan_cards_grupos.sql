-- Deuda IJ (2026-11-19): grupos de trabajo armados en una actividad del Plan, sin evaluación del Libro.
-- [{ "id": "<id>", "nombre": "Grupo 1", "integrantes": ["<libro_estudiantes.id>"], "canciones": [vínculos como
--    plan_cards.canciones], "individual": true? }]. El plan de cada grupo va en plan_cards.grupos_plan (HW) y su
-- bitácora en la de la clase (memorias.contenido), igual que los grupos de una evaluación (HV).
ALTER TABLE plan_cards
    ADD COLUMN IF NOT EXISTS grupos JSONB;
