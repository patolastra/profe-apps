-- 📁 Archivos del curso (deuda DQ, 2026-10-26).
-- Documentos, audios, videos e imágenes de cada curso o taller en un año (p. ej. las guías QR que arma la Biblioteca).
-- Una fila por archivo; el archivo vive en el bucket público curso-archivos, en <contexto_id>/<anio>/<nombre único>.
-- origen: de dónde salió ('guia-qr' = guía QR de la Biblioteca; 'subido' = subido a mano).
-- Aditiva e idempotente: no toca ninguna tabla existente.
create table if not exists curso_archivos (
  id           uuid primary key default gen_random_uuid(),
  contexto_id  uuid not null references contextos(id),
  anio         integer not null,
  nombre       text not null,                 -- nombre visible
  tipo         text not null default 'documento'
               check (tipo in ('documento', 'audio', 'video', 'imagen', 'otro')),
  mime         text,
  storage_path text not null,                 -- ruta en el bucket curso-archivos
  tamano       bigint,
  origen       text not null default 'subido',
  descripcion  text,
  created_at   timestamptz default now()
);
create index if not exists curso_archivos_ctx_anio on curso_archivos (contexto_id, anio, created_at desc);

alter table curso_archivos enable row level security;
do $$ begin
  create policy "acceso_total" on curso_archivos for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

-- Al instante entre equipos (una guía hecha en un computador aparece en el otro).
do $$ begin
  alter publication supabase_realtime add table curso_archivos;
exception when duplicate_object then null;
end $$;

-- Archivos: bucket público (se abren e imprimen sin pedir permiso, como las imágenes del Cuaderno).
insert into storage.buckets (id, name, public)
values ('curso-archivos', 'curso-archivos', true)
on conflict (id) do nothing;

do $$ begin
  create policy "curso_archivos_leer" on storage.objects for select using (bucket_id = 'curso-archivos');
exception when duplicate_object then null;
end $$;
do $$ begin
  create policy "curso_archivos_subir" on storage.objects for insert with check (bucket_id = 'curso-archivos');
exception when duplicate_object then null;
end $$;
do $$ begin
  create policy "curso_archivos_borrar" on storage.objects for delete using (bucket_id = 'curso-archivos');
exception when duplicate_object then null;
end $$;
