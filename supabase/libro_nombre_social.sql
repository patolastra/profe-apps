-- Nombre social del estudiante (2026-10-06). Opcional: reemplaza SOLO el nombre de pila
-- (los apellidos siguen siendo los legales). Se usa en todo el Libro y en Pasar lista,
-- excepto en los informes de UTP (previo y de resultados), que van con el nombre legal.
-- Vacío/NULL = el estudiante usa su nombre legal. Ver AUDITORIA/DESARROLLO_PARALELO.md.
ALTER TABLE libro_estudiantes ADD COLUMN IF NOT EXISTS nombre_social TEXT;
