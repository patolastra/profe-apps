-- Enlace de la canción (p. ej. YouTube) (deuda X, 2026-10-07). Opcional; al cargar una canción pedida
-- se copia el enlace del pedido. No cambia datos existentes. Ver AUDITORIA/DESARROLLO_PARALELO.md.
ALTER TABLE repertorio_canciones ADD COLUMN IF NOT EXISTS url TEXT;
