-- Pendientes al instante en todos los equipos (deuda BB, 2026-10-12).
-- Avisa a los equipos abiertos cuando un pendiente se agrega, cambia o se borra.
-- (Si falla porque ya está, no importa.)
alter publication supabase_realtime add table pendientes;
