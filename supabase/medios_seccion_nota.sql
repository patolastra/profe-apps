-- Extractos de una canción: sección de su Ficha y nota breve (deuda GX, 2026-11-10). Amplía medios.sql.
--   · seccion_seg: segundo de la grabación donde empieza la sección de la Ficha (🧩 Estructura) a la que va ligado el
--     extracto (por segundo y no por nombre: una canción puede tener varios "Coro"). Opcional.
--   · nota: texto breve sobre el extracto ("aquí se aceleraron, repasar la entrada"). Opcional.
-- Aditiva e idempotente: solo agrega dos columnas a curso_archivos.
alter table curso_archivos add column if not exists seccion_seg numeric;
alter table curso_archivos add column if not exists nota        text;
