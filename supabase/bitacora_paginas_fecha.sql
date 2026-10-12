-- Cursos — fecha de las notas (deuda BA, 2026-10-12).
-- Cada curso es un solo histórico (clases + notas, lo más nuevo arriba); una nota queda
-- en el día en que se escribió y su fecha se puede cambiar para moverla en el histórico.
alter table bitacora_paginas add column if not exists fecha date not null default current_date;
update bitacora_paginas set fecha = (created_at at time zone 'America/Santiago')::date where created_at is not null;
create index if not exists bitacora_paginas_fecha on bitacora_paginas (contexto_id, fecha);
