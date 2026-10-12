-- Cursos — páginas de bitácora (deuda BA, 2026-10-12).
-- Por curso (contexto): una página del curso (tipo 'curso', una sola) y subpáginas
-- libres de un solo nivel (tipo 'sub'). Las bitácoras de cada clase siguen en
-- `memorias` (1:1 con `sesiones`); esta tabla solo guarda lo que no es de una clase.
-- `contenido` = texto con marcas simples, una línea por bloque (mismo formato que
-- memorias.contenido): "# título", "- viñeta", "1. numerada", "- [ ] casilla".
create table if not exists bitacora_paginas (
  id          uuid primary key default gen_random_uuid(),
  contexto_id uuid not null references contextos(id) on delete cascade,
  tipo        text not null default 'sub' check (tipo in ('curso', 'sub')),
  titulo      text not null default '',
  contenido   text not null default '',
  audios      jsonb not null default '[]',
  orden       integer not null default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
-- Una sola página del curso por contexto.
create unique index if not exists bitacora_paginas_curso_unica
  on bitacora_paginas (contexto_id) where tipo = 'curso';
create index if not exists bitacora_paginas_ctx on bitacora_paginas (contexto_id, orden);

alter table bitacora_paginas enable row level security;
create policy "acceso_total" on bitacora_paginas for all using (true) with check (true);
