-- Pedidos de canciones en las sesiones del Entrenador (deuda X, 2026-10-07, corrido por el PO en Supabase).
-- Arreglo JSON de { id, nombre, artista, pidio, fecha (YYYY-MM-DD), estado ('pendiente' |
-- 'cargada' | 'descartada'), cancion_id (al cargarla) }. No cambia datos existentes.
-- Ver AUDITORIA/DESARROLLO_PARALELO.md.
ALTER TABLE repertorio_sesiones_entrenamiento ADD COLUMN IF NOT EXISTS pedidos JSONB NOT NULL DEFAULT '[]'::jsonb;
