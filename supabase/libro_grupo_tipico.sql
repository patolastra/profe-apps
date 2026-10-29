-- LIBRO DE CLASES — Lo típico de cada grupo (deuda ER, 2026-10-29)
-- En una evaluación en grupo, cada grupo puede llevar una canción de la Biblioteca
-- (del repertorio del curso o cualquiera) o un texto libre. Uno u otro: la interfaz
-- borra el texto al elegir canción y al revés.
-- Aditiva y segura: los grupos existentes quedan sin nada. Los bloqueos vigentes
-- (evaluación cerrada I12, grupo terminado) cubren también estas columnas.
-- cancion_id es TEXT como repertorio_canciones.id, y SIN llave foránea a propósito: con
-- ON DELETE SET NULL, borrar una canción usada por un grupo terminado o de una evaluación
-- cerrada chocaría con esos bloqueos. Si la canción ya no existe, el Libro no la muestra.
ALTER TABLE libro_evaluacion_grupos
    ADD COLUMN IF NOT EXISTS cancion_id TEXT,
    ADD COLUMN IF NOT EXISTS tipico     TEXT;
-- Una primera versión de este archivo la creó como UUID (vacía): pasarla a TEXT.
ALTER TABLE libro_evaluacion_grupos ALTER COLUMN cancion_id TYPE TEXT;
