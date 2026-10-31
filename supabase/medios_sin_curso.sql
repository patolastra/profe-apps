-- Extractos y versiones sin curso (deuda FC, 2026-10-31). Un medio ligado a una canción puede no pertenecer a ningún
-- curso: se ve solo en la canción (Biblioteca y Entrenador), no en 📁 Archivos de un curso. Su archivo va en
-- curso-archivos/sin-curso/<año>/… Aditiva e idempotente.
alter table curso_archivos alter column contexto_id drop not null;
