-- Planificaciones mensuales para la UTP (deuda CI, paso 3, 2026-10-20).
-- Una por curso, año y meses: el relato del mes y los campos del .docx, para reabrirla,
-- corregirla y volver a descargarla sin generarla de nuevo. Se guarda sola desde PLANIFICACION/.
-- Aditiva e idempotente: no toca ninguna tabla existente.
create table if not exists planificaciones (
  id          uuid primary key default gen_random_uuid(),
  contexto_id uuid not null references contextos(id),
  anio        integer not null,
  meses       integer[] not null,          -- {10} = octubre; {4,5} = abril y mayo
  relato      text not null default '',    -- lo trabajado en el mes, tal como quedó
  campos      jsonb not null default '{}', -- eje, OAT, OA, actitud, meta, desempeños, evidencias, tiempo, recursos, evaluación
  created_at  timestamptz default now(),
  updated_at  timestamptz default now(),
  unique (contexto_id, anio, meses)
);

alter table planificaciones enable row level security;
do $$ begin
  create policy "acceso_total" on planificaciones for all using (true) with check (true);
exception when duplicate_object then null;
end $$;
