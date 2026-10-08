-- Clase en curso (deuda AM, 2026-10-08): una sola clase en curso en todo el sistema,
-- visible desde cualquier equipo (computadores y celular). Una sola fila (id = 1):
-- "Comenzar clase" la escribe, "Terminar clase" la borra. Una clase con más de 2 horas
-- se considera terminada (la app la limpia). Los tiempos de cada clase siguen en
-- clase_tiempos (se escriben al terminar).
create table if not exists clase_en_curso (
  id smallint primary key default 1 check (id = 1),
  sesion_id uuid not null references sesiones(id) on delete cascade,
  ctx text not null default '',
  fecha date,
  inicio timestamptz not null,
  updated_at timestamptz default now()
);
alter table clase_en_curso enable row level security;
create policy "acceso_total" on clase_en_curso for all using (true) with check (true);

-- Avisos al instante a los equipos abiertos (si falla porque ya está, no importa).
alter publication supabase_realtime add table clase_en_curso;
