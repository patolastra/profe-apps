-- ============================================================
-- LIBRO DE CLASES — F1: infraestructura base
-- ============================================================
-- Fase 5 (Libro de Clases) — Capa 1: año escolar + estudiantes + matrículas.
--
-- ALCANCE F1 (estricto). Esta capa NO incluye: importación XLS, interfaz
-- LIBRO, botón en Portal, evaluaciones, participaciones, entregas,
-- observaciones, asignación a talleres, cierre/migración de año, ni
-- detección de estudiantes conocidos. Todo eso es F2+.
--
-- Se ejecuta UNA vez en el SQL Editor de Supabase (la anon key no ejecuta
-- DDL por REST). Es idempotente: puede re-correrse sin romper nada.
--
-- NO modifica ninguna estructura existente (sesiones, contextos,
-- alumnos_taller quedan intactas). La pertenencia de `sesiones` a un año
-- escolar queda DELIBERADAMENTE diferida a una revisión de implementación
-- posterior — F1 no la toca.
-- ============================================================

-- ── 1. LIBRO_ANIOS ──────────────────────────────────────────
-- El año escolar como dimensión estructural. A lo sumo un año activo.
CREATE TABLE IF NOT EXISTS libro_anios (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio        INT NOT NULL UNIQUE,
    activo      BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- Invariante: como máximo UN año con activo=true (permite varios en false).
CREATE UNIQUE INDEX IF NOT EXISTS ux_libro_anios_activo
    ON libro_anios (activo) WHERE activo = true;

-- ── 2. LIBRO_ESTUDIANTES ────────────────────────────────────
-- La persona, permanente entre años. Sin RUT ni otros datos personales.
-- Un estudiante NO se crea como "continuación" de otro año: el matching de
-- estudiantes conocidos pertenece a la futura importación (F2) y exige
-- confirmación humana.
CREATE TABLE IF NOT EXISTS libro_estudiantes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL,
    apellido    TEXT NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 3. LIBRO_MATRICULAS ─────────────────────────────────────
-- Pertenencia de un estudiante a un curso durante un año.
-- Reglas (Plan Maestro, literales):
--   · la posición histórica no se renumera;
--   · una posición utilizada no se reutiliza;
--   · una matrícula retirada permanece (no se borra);
--   · un reingreso genera una NUEVA matrícula y una NUEVA posición;
--   · no puede haber dos matrículas activas del mismo estudiante en el año;
--   · contexto_id apunta a un contexto de tipo 'curso';
--   · estados: solo 'activo' | 'retirado' (sin 'no ingresado', sin inventar).
CREATE TABLE IF NOT EXISTS libro_matriculas (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id  UUID NOT NULL REFERENCES libro_estudiantes(id),
    anio_id        UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id    UUID NOT NULL REFERENCES contextos(id),   -- debe ser tipo 'curso'
    posicion       INT  NOT NULL,
    estado         TEXT NOT NULL DEFAULT 'activo'
                        CHECK (estado IN ('activo', 'retirado')),
    fecha_ingreso  DATE,
    fecha_retiro   DATE,
    created_at     TIMESTAMPTZ DEFAULT now(),
    -- Una posición no se reutiliza dentro de un curso-año (las retiradas
    -- permanecen y siguen ocupando su posición → el reingreso toma otra).
    UNIQUE (anio_id, contexto_id, posicion)
);

-- Invariante: a lo sumo UNA matrícula activa por estudiante en el mismo año
-- (cubre también "dos cursos distintos a la vez").
CREATE UNIQUE INDEX IF NOT EXISTS ux_libro_matriculas_activa_estudiante_anio
    ON libro_matriculas (estudiante_id, anio_id) WHERE estado = 'activo';

-- Índices de acceso.
CREATE INDEX IF NOT EXISTS idx_libro_matriculas_anio        ON libro_matriculas (anio_id);
CREATE INDEX IF NOT EXISTS idx_libro_matriculas_contexto    ON libro_matriculas (contexto_id);
CREATE INDEX IF NOT EXISTS idx_libro_matriculas_estudiante  ON libro_matriculas (estudiante_id);

-- Invariante estructural que un CHECK no puede expresar (requiere consultar
-- contextos.tipo): la matrícula solo puede apuntar a un contexto 'curso'.
CREATE OR REPLACE FUNCTION libro_matriculas_contexto_es_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'curso' THEN
        RAISE EXCEPTION
            'libro_matriculas.contexto_id debe apuntar a un contexto de tipo ''curso'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_matriculas_contexto_es_curso ON libro_matriculas;
CREATE TRIGGER trg_libro_matriculas_contexto_es_curso
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_matriculas
    FOR EACH ROW EXECUTE FUNCTION libro_matriculas_contexto_es_curso();

-- ── ROW LEVEL SECURITY (patrón acceso_total del ecosistema) ──
ALTER TABLE libro_anios       ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_estudiantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_matriculas  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "acceso_total" ON libro_anios;
DROP POLICY IF EXISTS "acceso_total" ON libro_estudiantes;
DROP POLICY IF EXISTS "acceso_total" ON libro_matriculas;

CREATE POLICY "acceso_total" ON libro_anios       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_estudiantes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_matriculas  FOR ALL USING (true) WITH CHECK (true);

-- ── SEMILLA — año escolar activo 2026 ───────────────────────
-- Único año, activo. Sin estudiantes (los 233 del XLS son F2/importación).
-- Sin mecanismo de cierre/migración (F2+).
INSERT INTO libro_anios (anio, activo) VALUES (2026, true)
ON CONFLICT (anio) DO NOTHING;
