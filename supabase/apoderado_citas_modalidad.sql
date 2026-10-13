-- Citas a apoderados: citar en persona o llamar (deuda BK, ajuste del PO 2026-10-13).
alter table apoderado_citas add column if not exists modalidad text not null default 'cita'
  check (modalidad in ('cita', 'llamada'));
