-- Duración de una actividad "Tiempo libre" del Plan (deuda BZ, 2026-10-19).
-- Minutos que se proponen al comenzarla en clase (se confirman o cambian antes de lanzarla).
alter table plan_cards add column if not exists minutos integer;
