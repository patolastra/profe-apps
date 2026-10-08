-- Audio Melodía + Karaoke (2026-10-08, plan aprobado el 2026-09-29; ver
-- AUDITORIA/DESARROLLO_PARALELO.md, "Repertorio — audio Melodía + Karaoke").
-- rol de un audio: 'melodia' (con voz, se reproduce por defecto) o 'karaoke'.
-- Máximo 1 Melodía + 1 Karaoke por canción. La sincronización sigue en la letra.

alter table repertorio_assets add column if not exists rol text;

alter table repertorio_assets drop constraint if exists repertorio_assets_rol_chk;
alter table repertorio_assets add constraint repertorio_assets_rol_chk
  check (rol is null or (tipo = 'audio' and rol in ('melodia', 'karaoke')));

create unique index if not exists idx_assets_cancion_rol
  on repertorio_assets (cancion_id, rol) where rol is not null;

-- Las 2 canciones con dos audios: el "karaoke" es Karaoke (confirmado por el PO).
update repertorio_assets set rol = 'karaoke' where id in ('mu4g5ij9qotq', 'mu4hmfw8p9l7');
-- Todos los demás audios son Melodía.
update repertorio_assets set rol = 'melodia' where tipo = 'audio' and rol is null;

-- Verificación (al 2026-10-08 debe dar: melodia 51 · karaoke 2).
select rol, count(*) from repertorio_assets where tipo = 'audio' group by rol;
