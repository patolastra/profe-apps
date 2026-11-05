-- 2ª voz (deuda GA, 2026-11-05; ver AUDITORIA/DESARROLLO_PARALELO.md, "GA. 2ª voz").
-- Un tercer rol de audio: 'segunda' = solo la voz de la segunda voz, que calza con la Melodía y el Karaoke y suena
-- encima de ellos. Máximo una por canción (lo cuida el índice único idx_assets_cancion_rol ya existente).

alter table repertorio_assets drop constraint if exists repertorio_assets_rol_chk;
alter table repertorio_assets add constraint repertorio_assets_rol_chk
  check (rol is null or (tipo = 'audio' and rol in ('melodia', 'karaoke', 'segunda')));

-- Verificación
select rol, count(*) from repertorio_assets where tipo = 'audio' group by rol;
