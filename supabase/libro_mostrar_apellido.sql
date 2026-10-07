-- "Mostrar con apellido" (2026-10-07). Para nombres que suenan igual aunque se escriban
-- distinto (Matías / Mathías): el estudiante se muestra siempre como NOMBRE APELLIDO en el
-- Libro y en Pasar lista (lo normal es solo el nombre, salvo que se repita en el curso).
-- Se marca en la ficha de Matrícula. Ver AUDITORIA/DESARROLLO_PARALELO.md (deuda Y).
ALTER TABLE libro_estudiantes ADD COLUMN IF NOT EXISTS mostrar_apellido BOOLEAN NOT NULL DEFAULT false;
