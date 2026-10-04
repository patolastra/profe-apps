-- Modo Clase (Paso 1): tiempos de cada clase (tiempo de clase y tiempo perdido).
-- Ejecutado por el PO en Supabase el 2026-10-05. Puede haber varias filas por sesión
-- (deuda registrada: debería quedar una sola por clase).
create table if not exists clase_tiempos (
  id uuid primary key default gen_random_uuid(),
  sesion_id uuid not null references sesiones(id) on delete cascade,
  inicio timestamptz not null,
  fin timestamptz not null,
  tiempo_clase_seg integer not null,
  tiempo_perdido_seg integer not null,
  episodios_perdido integer not null default 0,
  created_at timestamptz default now()
);
alter table clase_tiempos enable row level security;
create policy "acceso_total" on clase_tiempos for all using (true) with check (true);
