-- Clase de un recurso de la Biblioteca (deuda EP, entrega 3; aprobado por el PO el 2026-10-29).
-- Ver AUDITORIA/DESARROLLO_PARALELO.md, "Biblioteca — ordenar los recursos".
-- clase: qué es el recurso, elegido de una lista: 'armonia' | 'melodia' | 'riff' | 'acompanamiento' | 'quintas'
--        (vacío = sin clase; los recursos existentes los clasifica el PO a mano).
-- simplificado: versión simplificada de esa clase (o del recurso, si no tiene clase).
-- No cambia ni borra nada de lo que ya existe.

alter table repertorio_assets add column if not exists clase text;
alter table repertorio_assets add column if not exists simplificado boolean not null default false;

alter table repertorio_assets drop constraint if exists repertorio_assets_clase_chk;
alter table repertorio_assets add constraint repertorio_assets_clase_chk
  check (clase is null or clase in ('armonia', 'melodia', 'riff', 'acompanamiento', 'quintas'));

-- Verificación: todos deben quedar sin clase y sin simplificar.
select clase, simplificado, count(*) from repertorio_assets group by clase, simplificado;
