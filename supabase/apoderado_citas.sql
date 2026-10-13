-- Citas a apoderados (deuda BK, 2026-10-13): recordatorios en 3 etapas.
--   por_citar → hay que llamar / gestionar la reunión (motivo)
--   citado    → quedó fecha y hora (cita_en); ese día aparece en ☀ Hoy
--   atendido  → se anotan los acuerdos (de ellos se pueden crear pendientes, a mano)
-- Sin teléfono ni datos del apoderado (DECISIÓN del PO).
create table if not exists apoderado_citas (
  id uuid primary key default gen_random_uuid(),
  contexto_id uuid not null references contextos(id),
  estudiante_id uuid not null references libro_estudiantes(id),
  motivo text not null default '',
  estado text not null default 'por_citar' check (estado in ('por_citar', 'citado', 'atendido')),
  cita_en timestamptz,
  acuerdos text not null default '',
  atendido_en timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_apoderado_citas_ctx on apoderado_citas (contexto_id);
create index if not exists idx_apoderado_citas_est on apoderado_citas (estudiante_id);
alter table apoderado_citas enable row level security;
create policy "acceso_total" on apoderado_citas for all using (true) with check (true);

-- Al instante en los equipos abiertos (si falla porque ya está, no importa).
alter publication supabase_realtime add table apoderado_citas;
