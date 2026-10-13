-- Bitácora y notas al instante entre equipos (deuda BE, Fase 1, 2026-10-13).
-- Suma `memorias` (bitácora de cada clase) y `bitacora_paginas` (notas de Cursos) a Supabase
-- Realtime. Si alguna ya estaba, se salta sin error.
do $$ begin
  alter publication supabase_realtime add table memorias;
exception when duplicate_object then null;
end $$;

do $$ begin
  alter publication supabase_realtime add table bitacora_paginas;
exception when duplicate_object then null;
end $$;
