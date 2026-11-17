-- Deuda HW (2026-11-17): el plan de cada grupo de trabajo dentro de una actividad del Plan
-- (objetivos "O:" y anotaciones, con el editor por bloques), por clase: { "<id del grupo>": "texto" }.
ALTER TABLE plan_cards
    ADD COLUMN IF NOT EXISTS grupos_plan JSONB;
