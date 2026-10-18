-- Canciones de cada actividad del Plan (deuda BT, 2026-10-18).
-- Lista ordenada de ids de repertorio_canciones: [{ "cancion_id": "..." }, ...].
-- Al tocar una, el Planificador abre el Entrenador del curso en esa canción.
alter table plan_cards add column if not exists canciones jsonb not null default '[]'::jsonb;
