-- Pasar lista: asistencia de la clase (2026-10-05). Una fila por clase (sesión).
-- Se registra en NEGATIVO: solo los ausentes. Fila existente = "se pasó lista"
-- (ausentes vacío = todos presentes). Ver AUDITORIA/DESARROLLO_PARALELO.md.
CREATE TABLE IF NOT EXISTS libro_asistencia (
    sesion_id      UUID PRIMARY KEY REFERENCES sesiones(id) ON DELETE CASCADE,
    ausentes       UUID[] NOT NULL DEFAULT '{}',          -- libro_estudiantes.id
    actualizada_en TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE libro_asistencia ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acceso_total" ON libro_asistencia;
CREATE POLICY "acceso_total" ON libro_asistencia FOR ALL USING (true) WITH CHECK (true);
