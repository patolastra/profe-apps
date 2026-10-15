-- Plan de la clase en cards (deuda BO, paso 1, 2026-10-15).
-- Cada clase (sesión) tiene su plan: una lista ordenada de cards, cada una con su
-- título y su texto (mismo formato por bloques que memorias.contenido).
-- Pasos siguientes: unir cada card con sus diapositivas; multimedia.
create table if not exists plan_cards (
  id          uuid primary key default gen_random_uuid(),
  sesion_id   uuid not null references sesiones(id) on delete cascade,
  orden       integer not null default 0,
  titulo      text not null default '',
  contenido   text not null default '',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
create index if not exists plan_cards_sesion on plan_cards (sesion_id, orden);

alter table plan_cards enable row level security;
do $$ begin
  create policy "acceso_total" on plan_cards for all using (true) with check (true);
exception when duplicate_object then null;
end $$;

-- Al instante entre equipos (como la bitácora).
do $$ begin
  alter publication supabase_realtime add table plan_cards;
exception when duplicate_object then null;
end $$;
