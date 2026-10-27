-- Medios del curso y de las canciones (deuda DU, 2026-10-27). Amplía 📁 Archivos del curso (curso_archivos.sql).
-- Un mismo archivo (o enlace de YouTube / Drive) del curso puede ligarse además a:
--   · una canción de la Biblioteca (cancion_id) → se ve también en la ficha de la canción;
--   · una clase (sesion_id) y su fecha (fecha) → en clase se liga solo, y las fotos irán a la bitácora (fase 4);
--   · un uso en la canción: 'extracto' (grabado por el profe en clase) o 'version' (en vivo íntegra / trabajo final);
--   · estudiantes (ids de libro_estudiantes) en las versiones: esas grabaciones nunca se comparten.
-- Los videos grandes se guardan como enlace (url) en vez de archivo (storage_path).
-- Aditiva e idempotente: solo agrega columnas a curso_archivos y relaja storage_path.
alter table curso_archivos add column if not exists cancion_id  text references repertorio_canciones(id) on delete set null;
alter table curso_archivos add column if not exists sesion_id   uuid references sesiones(id) on delete set null;
alter table curso_archivos add column if not exists fecha       date;
alter table curso_archivos add column if not exists uso         text;
alter table curso_archivos add column if not exists url         text;
alter table curso_archivos add column if not exists estudiantes uuid[] not null default '{}';

alter table curso_archivos alter column storage_path drop not null;

alter table curso_archivos drop constraint if exists curso_archivos_uso_chk;
alter table curso_archivos add constraint curso_archivos_uso_chk
  check (uso is null or uso in ('extracto', 'version'));
alter table curso_archivos drop constraint if exists curso_archivos_origen_chk;
alter table curso_archivos add constraint curso_archivos_origen_chk
  check (storage_path is not null or url is not null);

create index if not exists curso_archivos_cancion on curso_archivos (cancion_id) where cancion_id is not null;
create index if not exists curso_archivos_sesion  on curso_archivos (sesion_id)  where sesion_id  is not null;
