-- 📚 Estudios (deuda EB, 2026-10-27).
-- Ensayos escritos del profe en Cursos, con citas copiadas de bitácoras, notas y del Libro.
-- El contenido es TEXTO del editor por bloques (comun/editor-bloques.js; las citas son líneas "> ").
-- Aditiva e idempotente: no toca ninguna tabla existente.
create table if not exists estudios (
  id          uuid primary key default gen_random_uuid(),
  titulo      text not null default '',
  contenido   text not null default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists estudios_updated on estudios (updated_at desc);

alter table estudios enable row level security;
do $$ begin
  create policy "acceso_total" on estudios for all using (true) with check (true);
exception when duplicate_object then null;
end $$;
