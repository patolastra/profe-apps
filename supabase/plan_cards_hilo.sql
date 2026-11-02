-- Hilo de una actividad (deuda FG, 2026-11-02): las copias de una actividad que sigue de una clase a otra
-- ("➜ Continuar en la próxima clase") comparten el mismo hilo_id = id de la primera actividad del hilo.
-- Aditiva e idempotente: no cambia ni borra nada de lo existente.
alter table plan_cards add column if not exists hilo_id uuid;
create index if not exists plan_cards_hilo on plan_cards (hilo_id);
