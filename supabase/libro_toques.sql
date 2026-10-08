-- Evaluar por toques desde el celular (deuda AN, 2026-10-08).
-- descuento_toque: NULL = evaluación normal · valor = evaluación "Por toques" (cuánto
--   baja la nota cada toque; 0,1 por defecto al crearla).
-- toques: toques acumulados del estudiante en esa evaluación. La nota se escribe al
--   "Terminar" en el celular: 7 − toques × descuento, nunca bajo la nota mínima.
alter table libro_evaluaciones
  add column if not exists descuento_toque numeric(2,1)
    check (descuento_toque is null or (descuento_toque > 0 and descuento_toque <= 6.0));

alter table libro_evaluacion_notas
  add column if not exists toques smallint not null default 0
    check (toques >= 0);
