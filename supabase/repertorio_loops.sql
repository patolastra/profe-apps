-- Loops del Entrenador por canción (2026-10-05, corrido por el PO en Supabase).
-- Antes vivían solo en el localStorage de cada navegador. Formato: arreglo JSON de
-- { id, nombre, inicio (ms), fin (ms), velocidad }. Los loops de una SESIÓN siguen en
-- repertorio_sesiones_entrenamiento.canciones[i].loops. Ver AUDITORIA/DESARROLLO_PARALELO.md.
ALTER TABLE repertorio_canciones ADD COLUMN IF NOT EXISTS loops JSONB;
