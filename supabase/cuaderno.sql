-- Cuaderno de música del curso (deuda CJ, 2026-10-21).
-- Una fila por hoja (página) del cuaderno de un curso (1° a 8°) en un año. Hojas libres con fecha;
-- si nace de una clase, guarda esa sesión (solo como referencia). Orden: fecha y luego creación.
-- contenido = piezas de la hoja, en orden:
--   [{ "t": "txt", "x": "<texto con marcas del editor por bloques>" },
--    { "t": "img", "path": "<ruta en el bucket cuaderno-imagenes>", "tam": "s" | "m" | "l" | "hoja" }]
-- Aditiva e idempotente: no toca ninguna tabla existente.
create table if not exists cuaderno_hojas (
  id          uuid primary key default gen_random_uuid(),
  contexto_id uuid not null references contextos(id),
  anio        integer not null,
  fecha       date not null,
  orientacion text not null default 'v' check (orientacion in ('v', 'h')),   -- vertical | horizontal (cuaderno girado)
  contenido   jsonb not null default '[]',
  sesion_id   uuid references sesiones(id) on delete set null,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists cuaderno_hojas_ctx_anio on cuaderno_hojas (contexto_id, anio, fecha);

alter table cuaderno_hojas enable row level security;
do $$ begin
  create policy "acceso_total" on cuaderno_hojas for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

-- Al instante entre equipos (como la bitácora).
do $$ begin
  alter publication supabase_realtime add table cuaderno_hojas;
exception when duplicate_object then null;
end $$;

-- Imágenes de las hojas: bucket público (se muestran sin pedir permiso, como los audios de la bitácora).
insert into storage.buckets (id, name, public)
values ('cuaderno-imagenes', 'cuaderno-imagenes', true)
on conflict (id) do nothing;

do $$ begin
  create policy "cuaderno_imagenes_leer" on storage.objects for select using (bucket_id = 'cuaderno-imagenes');
exception when duplicate_object then null;
end $$;
do $$ begin
  create policy "cuaderno_imagenes_subir" on storage.objects for insert with check (bucket_id = 'cuaderno-imagenes');
exception when duplicate_object then null;
end $$;
do $$ begin
  create policy "cuaderno_imagenes_borrar" on storage.objects for delete using (bucket_id = 'cuaderno-imagenes');
exception when duplicate_object then null;
end $$;
