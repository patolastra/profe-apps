-- Parte de la canción de un extracto (deuda DW, 2026-10-27). Amplía medios.sql.
-- Texto libre, sugerido desde las secciones de las tablaturas de la canción, las estrofas de su letra
-- ("Estrofa 2 — «primer verso…»") o nombres comunes (Intro, Coro, Puente…).
-- Aditiva e idempotente.
alter table curso_archivos add column if not exists parte text;
