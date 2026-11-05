-- Versos con 2ª voz (deuda GB, 2026-11-05; ver AUDITORIA/DESARROLLO_PARALELO.md, "GB").
-- En la letra de una canción: las posiciones (0, 1, 2…, una por línea de `contenido`) de los versos que llevan
-- 2ª voz. El Entrenador y Cantar los marcan en violeta.

alter table repertorio_assets add column if not exists segunda_voz jsonb;

-- Verificación: la columna existe (debe dar 1 fila)
select column_name, data_type from information_schema.columns
where table_name = 'repertorio_assets' and column_name = 'segunda_voz';
