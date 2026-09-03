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


-- ============================================================
-- LIBRO DE CLASES — F4: evaluaciones
-- ============================================================
-- Sistema de EVALUACIONES sobre la capa F1 (anios/estudiantes/matriculas).
-- Aditivo e idempotente (re-ejecutable). NO modifica F1 ni estructuras
-- ajenas: contextos, sesiones y alumnos_taller quedan intactas (solo se
-- referencian por FK).
--
-- ALCANCE F4 (estricto): cabecera de evaluación, OA original, adecuaciones,
-- detalle por estudiante (nota, comentario, objetivo aplicado), estado
-- abierto/cerrado con cierre REVERSIBLE, e integridad en Supabase.
-- NO incluye: rúbricas, participación, entregas, observaciones, talleres,
-- administración/cierre/migración de año, promoción, matching (F5–F7).
--
-- Invariantes garantizadas aquí (numeración del prompt de F4):
--   I7  una sola nota por estudiante/evaluación  → UNIQUE (evaluacion_id, estudiante_id)
--   I8  nota NULL o en [1.0, 7.0]                → CHECK
--   I9  la adecuación aplicada en una nota pertenece a la MISMA evaluación → trigger
--   I12 cerrado = solo lectura (cabecera + detalles); reapertura explícita  → triggers
--   I13 snapshot: la población se materializa al crear; sin re-sincronización
--       → garantizado por diseño: NINGÚN mecanismo de BD añade filas de notas;
--         la app inserta una fila por estudiante vigente al crear y nada más.
-- ============================================================

-- ── 4. LIBRO_EVALUACIONES ───────────────────────────────────
-- Cabecera. Pertenece a un año y a un contexto de tipo 'curso'. La sesión de
-- creación es solo trazabilidad: NO limita la vida de la evaluación (puede
-- seguir abierta y editarse desde sesiones posteriores del mismo contexto).
CREATE TABLE IF NOT EXISTS libro_evaluaciones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio_id             UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id         UUID NOT NULL REFERENCES contextos(id),    -- debe ser tipo 'curso'
    sesion_creacion_id  UUID NOT NULL REFERENCES sesiones(id),     -- trazabilidad
    nombre              TEXT NOT NULL,
    fecha               DATE NOT NULL,
    oa_original         TEXT NOT NULL DEFAULT '',                  -- un único OA original
    estado              TEXT NOT NULL DEFAULT 'abierto'
                            CHECK (estado IN ('abierto', 'cerrado')),
    created_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_libro_eval_anio_ctx ON libro_evaluaciones (anio_id, contexto_id);

-- ── 5. LIBRO_EVALUACION_ADECUACIONES ────────────────────────
-- Cero o más adecuaciones derivadas del OA original de UNA evaluación.
CREATE TABLE IF NOT EXISTS libro_evaluacion_adecuaciones (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluacion_id  UUID NOT NULL REFERENCES libro_evaluaciones(id) ON DELETE CASCADE,
    texto          TEXT NOT NULL,
    created_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_libro_adec_eval ON libro_evaluacion_adecuaciones (evaluacion_id);

-- ── 6. LIBRO_EVALUACION_NOTAS ───────────────────────────────
-- Detalle: una fila por estudiante incluido (materializado al crear = snapshot).
-- adecuacion_id NULL = el estudiante trabaja con el OA original.
CREATE TABLE IF NOT EXISTS libro_evaluacion_notas (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluacion_id  UUID NOT NULL REFERENCES libro_evaluaciones(id) ON DELETE CASCADE,
    estudiante_id  UUID NOT NULL REFERENCES libro_estudiantes(id),
    nota           NUMERIC(2,1) CHECK (nota IS NULL OR (nota >= 1.0 AND nota <= 7.0)),  -- I8
    comentario     TEXT,                                                                -- opcional (NULL permitido)
    adecuacion_id  UUID REFERENCES libro_evaluacion_adecuaciones(id) ON DELETE SET NULL,-- NULL = OA original
    created_at     TIMESTAMPTZ DEFAULT now(),
    UNIQUE (evaluacion_id, estudiante_id)                                               -- I7
);
CREATE INDEX IF NOT EXISTS idx_libro_notas_eval       ON libro_evaluacion_notas (evaluacion_id);
CREATE INDEX IF NOT EXISTS idx_libro_notas_estudiante ON libro_evaluacion_notas (estudiante_id);

-- ── TRIGGER: la evaluación solo puede apuntar a un contexto 'curso' ──
CREATE OR REPLACE FUNCTION libro_eval_contexto_es_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'curso' THEN
        RAISE EXCEPTION
            'libro_evaluaciones.contexto_id debe apuntar a un contexto de tipo ''curso'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_eval_contexto_es_curso ON libro_evaluaciones;
CREATE TRIGGER trg_libro_eval_contexto_es_curso
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_evaluaciones
    FOR EACH ROW EXECUTE FUNCTION libro_eval_contexto_es_curso();

-- ── TRIGGER I9: la adecuación de una nota pertenece a la misma evaluación ──
-- adecuacion_id NULL (OA original) siempre válido; si no es NULL, su
-- evaluacion_id debe coincidir con el de la nota.
CREATE OR REPLACE FUNCTION libro_notas_adecuacion_misma_eval()
RETURNS TRIGGER AS $$
DECLARE
    v_eval UUID;
BEGIN
    IF NEW.adecuacion_id IS NOT NULL THEN
        SELECT evaluacion_id INTO v_eval
            FROM libro_evaluacion_adecuaciones WHERE id = NEW.adecuacion_id;
        IF v_eval IS DISTINCT FROM NEW.evaluacion_id THEN
            RAISE EXCEPTION
                'I9: la adecuación % no pertenece a la evaluación % de la nota',
                NEW.adecuacion_id, NEW.evaluacion_id;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_notas_adecuacion_misma_eval ON libro_evaluacion_notas;
CREATE TRIGGER trg_libro_notas_adecuacion_misma_eval
    BEFORE INSERT OR UPDATE OF adecuacion_id, evaluacion_id ON libro_evaluacion_notas
    FOR EACH ROW EXECUTE FUNCTION libro_notas_adecuacion_misma_eval();

-- ── TRIGGER I12 (cabecera): inmutable mientras esté cerrada ──
-- Con la evaluación cerrada solo se permite cambiar 'estado' (para reabrir).
-- Cualquier edición de cabecera con estado='cerrado' se rechaza.
CREATE OR REPLACE FUNCTION libro_eval_bloqueo_cerrada()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'cerrado' AND (
           NEW.nombre             IS DISTINCT FROM OLD.nombre
        OR NEW.fecha              IS DISTINCT FROM OLD.fecha
        OR NEW.oa_original        IS DISTINCT FROM OLD.oa_original
        OR NEW.contexto_id        IS DISTINCT FROM OLD.contexto_id
        OR NEW.anio_id            IS DISTINCT FROM OLD.anio_id
        OR NEW.sesion_creacion_id IS DISTINCT FROM OLD.sesion_creacion_id
    ) THEN
        RAISE EXCEPTION
            'I12: evaluación cerrada es solo lectura; reábrela (estado=abierto) para editar la cabecera';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_eval_bloqueo_cerrada ON libro_evaluaciones;
CREATE TRIGGER trg_libro_eval_bloqueo_cerrada
    BEFORE UPDATE ON libro_evaluaciones
    FOR EACH ROW EXECUTE FUNCTION libro_eval_bloqueo_cerrada();

-- ── TRIGGER I12 (detalles): adecuaciones y notas inmutables si la evaluación
-- está cerrada. Sirve para INSERT/UPDATE (NEW) y DELETE (OLD). Si el padre ya
-- no existe (borrado en cascada) no bloquea.
CREATE OR REPLACE FUNCTION libro_hijo_bloqueo_cerrada()
RETURNS TRIGGER AS $$
DECLARE
    v_eval   UUID;
    v_estado TEXT;
BEGIN
    v_eval := COALESCE(NEW.evaluacion_id, OLD.evaluacion_id);
    SELECT estado INTO v_estado FROM libro_evaluaciones WHERE id = v_eval;
    IF NOT FOUND THEN
        RETURN COALESCE(NEW, OLD);   -- padre en borrado en cascada → permitir
    END IF;
    IF v_estado = 'cerrado' THEN
        RAISE EXCEPTION
            'I12: la evaluación % está cerrada; reábrela para modificar sus adecuaciones/notas',
            v_eval;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_adec_bloqueo_cerrada ON libro_evaluacion_adecuaciones;
CREATE TRIGGER trg_libro_adec_bloqueo_cerrada
    BEFORE INSERT OR UPDATE OR DELETE ON libro_evaluacion_adecuaciones
    FOR EACH ROW EXECUTE FUNCTION libro_hijo_bloqueo_cerrada();

DROP TRIGGER IF EXISTS trg_libro_notas_bloqueo_cerrada ON libro_evaluacion_notas;
CREATE TRIGGER trg_libro_notas_bloqueo_cerrada
    BEFORE INSERT OR UPDATE OR DELETE ON libro_evaluacion_notas
    FOR EACH ROW EXECUTE FUNCTION libro_hijo_bloqueo_cerrada();

-- ── ROW LEVEL SECURITY (patrón acceso_total del ecosistema) ──
ALTER TABLE libro_evaluaciones             ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_evaluacion_adecuaciones  ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_evaluacion_notas         ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "acceso_total" ON libro_evaluaciones;
DROP POLICY IF EXISTS "acceso_total" ON libro_evaluacion_adecuaciones;
DROP POLICY IF EXISTS "acceso_total" ON libro_evaluacion_notas;

CREATE POLICY "acceso_total" ON libro_evaluaciones            FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_evaluacion_adecuaciones FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_evaluacion_notas        FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- LIBRO DE CLASES — F5: pertenencia de estudiantes a talleres
-- ============================================================
-- Un estudiante puede pertenecer a 0..N talleres durante un año escolar. La
-- pertenencia es (estudiante + año + taller), siendo el taller un contexto de
-- tipo='taller'. Aditivo e idempotente.
--
-- NO reemplaza ni modifica libro_matriculas (que sigue representando la
-- pertenencia al CURSO). NO reutiliza ni toca alumnos_taller (estructura ajena
-- en producción). Sin fechas, estados ni atributos extra: F5 no los define.
-- La asignación inicial (de dónde salen las pertenencias) queda DIFERIDA a una
-- futura iteración; F5 solo da el soporte para gestionarlas.
--
-- Invariantes (numeración del Plan Maestro §12):
--   I6  Taller ⇒ matrícula: pertenecer a un taller exige matrícula de curso ese
--       mismo año → trigger.
--   I10 Pertenencia única: una sola fila por (estudiante, año, taller) → UNIQUE.
--   (+ el contexto debe ser tipo='taller' → trigger, análogo al de 'curso' de F1/F4).
--   Nota: I5 (fechas nulas) es de matrículas y NO aplica a esta capa (sin fechas).

CREATE TABLE IF NOT EXISTS libro_pertenencias_taller (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    estudiante_id  UUID NOT NULL REFERENCES libro_estudiantes(id),
    anio_id        UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id    UUID NOT NULL REFERENCES contextos(id),   -- debe ser tipo 'taller'
    created_at     TIMESTAMPTZ DEFAULT now(),
    UNIQUE (estudiante_id, anio_id, contexto_id)             -- I10 (pertenencia única)
);
CREATE INDEX IF NOT EXISTS idx_libro_pert_taller_anio_ctx    ON libro_pertenencias_taller (anio_id, contexto_id);
CREATE INDEX IF NOT EXISTS idx_libro_pert_taller_estudiante  ON libro_pertenencias_taller (estudiante_id);

-- Trigger: el contexto de la pertenencia debe ser de tipo 'taller'.
CREATE OR REPLACE FUNCTION libro_pert_taller_contexto_es_taller()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'taller' THEN
        RAISE EXCEPTION
            'libro_pertenencias_taller.contexto_id debe apuntar a un contexto de tipo ''taller'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_pert_taller_contexto_es_taller ON libro_pertenencias_taller;
CREATE TRIGGER trg_libro_pert_taller_contexto_es_taller
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_pertenencias_taller
    FOR EACH ROW EXECUTE FUNCTION libro_pert_taller_contexto_es_taller();

-- Trigger I6: pertenecer a un taller exige una matrícula de curso del mismo
-- estudiante en el mismo año (libro_matriculas ya garantiza que es un 'curso').
CREATE OR REPLACE FUNCTION libro_pert_taller_exige_matricula()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM libro_matriculas
        WHERE estudiante_id = NEW.estudiante_id AND anio_id = NEW.anio_id
    ) THEN
        RAISE EXCEPTION
            'I6: el estudiante % no tiene matrícula de curso en el año % (requisito para pertenecer a un taller)',
            NEW.estudiante_id, NEW.anio_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_pert_taller_exige_matricula ON libro_pertenencias_taller;
CREATE TRIGGER trg_libro_pert_taller_exige_matricula
    BEFORE INSERT OR UPDATE OF estudiante_id, anio_id ON libro_pertenencias_taller
    FOR EACH ROW EXECUTE FUNCTION libro_pert_taller_exige_matricula();

-- ── ROW LEVEL SECURITY (patrón acceso_total del ecosistema) ──
ALTER TABLE libro_pertenencias_taller ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acceso_total" ON libro_pertenencias_taller;
CREATE POLICY "acceso_total" ON libro_pertenencias_taller FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- LIBRO DE CLASES — F6: participación (unificada curso/taller)
-- ============================================================
-- Registro de participación por estudiante (participó sí/no) para un CURSO o un
-- TALLER en un año. Aditivo e idempotente. La sesión de creación es solo
-- trazabilidad: NO limita la vida del registro (puede editarse desde otras
-- sesiones del mismo contexto mientras esté abierto).
--
-- Población (snapshot al crear, I13): curso → matrículas del curso/año; taller →
-- estudiantes de libro_pertenencias_taller (F5) de ese taller/año. La app la
-- materializa; la BD nunca añade filas de detalle por su cuenta.
--
-- Invariantes (numeración del Plan Maestro §12):
--   I7  Detalle único: una sola fila por estudiante en cada participación
--       → UNIQUE (participacion_id, estudiante_id).
--   I12 Cerrado = solo lectura: cabecera + detalle inmutables mientras cerrado;
--       reapertura explícita permitida → triggers.
--   I13 Snapshot: población fijada al crear, sin re-sincronización → por diseño.
--   (+ el contexto debe ser 'curso' o 'taller' → trigger).
-- NOTA de numeración: en el Plan vigente "detalle único" es I7 (no I10; I10 es la
-- pertenencia única de talleres de F5). Ver el reporte de discrepancia de F6.

CREATE TABLE IF NOT EXISTS libro_participaciones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio_id             UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id         UUID NOT NULL REFERENCES contextos(id),   -- curso o taller
    sesion_creacion_id  UUID NOT NULL REFERENCES sesiones(id),    -- trazabilidad
    nombre              TEXT NOT NULL,
    fecha               DATE NOT NULL,
    estado              TEXT NOT NULL DEFAULT 'abierto'
                            CHECK (estado IN ('abierto', 'cerrado')),
    created_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_libro_part_anio_ctx ON libro_participaciones (anio_id, contexto_id);

CREATE TABLE IF NOT EXISTS libro_participacion_detalle (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participacion_id  UUID NOT NULL REFERENCES libro_participaciones(id) ON DELETE CASCADE,
    estudiante_id     UUID NOT NULL REFERENCES libro_estudiantes(id),
    participo         BOOLEAN NOT NULL DEFAULT false,   -- participó sí/no
    created_at        TIMESTAMPTZ DEFAULT now(),
    UNIQUE (participacion_id, estudiante_id)            -- I7 (detalle único)
);
CREATE INDEX IF NOT EXISTS idx_libro_part_det_part ON libro_participacion_detalle (participacion_id);
CREATE INDEX IF NOT EXISTS idx_libro_part_det_est  ON libro_participacion_detalle (estudiante_id);

-- Trigger: el contexto de una participación debe ser 'curso' o 'taller'.
CREATE OR REPLACE FUNCTION libro_participacion_contexto_valido()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'curso' AND v_tipo IS DISTINCT FROM 'taller' THEN
        RAISE EXCEPTION
            'libro_participaciones.contexto_id debe ser de tipo ''curso'' o ''taller'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_participacion_contexto_valido ON libro_participaciones;
CREATE TRIGGER trg_libro_participacion_contexto_valido
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_participaciones
    FOR EACH ROW EXECUTE FUNCTION libro_participacion_contexto_valido();

-- Trigger I12 (cabecera): inmutable mientras la participación esté cerrada.
-- Solo se permite cambiar 'estado' (para reabrir).
CREATE OR REPLACE FUNCTION libro_participacion_bloqueo_cerrada()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'cerrado' AND (
           NEW.nombre             IS DISTINCT FROM OLD.nombre
        OR NEW.fecha              IS DISTINCT FROM OLD.fecha
        OR NEW.contexto_id        IS DISTINCT FROM OLD.contexto_id
        OR NEW.anio_id            IS DISTINCT FROM OLD.anio_id
        OR NEW.sesion_creacion_id IS DISTINCT FROM OLD.sesion_creacion_id
    ) THEN
        RAISE EXCEPTION
            'I12: participación cerrada es solo lectura; reábrela (estado=abierto) para editar la cabecera';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_participacion_bloqueo_cerrada ON libro_participaciones;
CREATE TRIGGER trg_libro_participacion_bloqueo_cerrada
    BEFORE UPDATE ON libro_participaciones
    FOR EACH ROW EXECUTE FUNCTION libro_participacion_bloqueo_cerrada();

-- Trigger I12 (detalle): el detalle es inmutable si su participación está cerrada.
-- Sirve para INSERT/UPDATE (NEW) y DELETE (OLD); si el padre ya no existe
-- (borrado en cascada) no bloquea.
CREATE OR REPLACE FUNCTION libro_participacion_hijo_bloqueo_cerrada()
RETURNS TRIGGER AS $$
DECLARE
    v_part   UUID;
    v_estado TEXT;
BEGIN
    v_part := COALESCE(NEW.participacion_id, OLD.participacion_id);
    SELECT estado INTO v_estado FROM libro_participaciones WHERE id = v_part;
    IF NOT FOUND THEN
        RETURN COALESCE(NEW, OLD);   -- padre en borrado en cascada → permitir
    END IF;
    IF v_estado = 'cerrado' THEN
        RAISE EXCEPTION
            'I12: la participación % está cerrada; reábrela para modificar su detalle', v_part;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_part_det_bloqueo_cerrada ON libro_participacion_detalle;
CREATE TRIGGER trg_libro_part_det_bloqueo_cerrada
    BEFORE INSERT OR UPDATE OR DELETE ON libro_participacion_detalle
    FOR EACH ROW EXECUTE FUNCTION libro_participacion_hijo_bloqueo_cerrada();

-- ── ROW LEVEL SECURITY (patrón acceso_total del ecosistema) ──
ALTER TABLE libro_participaciones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_participacion_detalle  ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acceso_total" ON libro_participaciones;
DROP POLICY IF EXISTS "acceso_total" ON libro_participacion_detalle;
CREATE POLICY "acceso_total" ON libro_participaciones       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_participacion_detalle FOR ALL USING (true) WITH CHECK (true);


-- ============================================================
-- LIBRO DE CLASES — F7: entregas (curso) + observaciones (taller)
-- ============================================================
-- Dos funcionalidades independientes entre sí y de F4/F6. Aditivo e
-- idempotente (re-ejecutable). NO modifica F1–F6 ni estructuras ajenas
-- (contextos, sesiones, alumnos_taller intactas; solo se referencian por FK).
-- Reutiliza libro_estudiantes, libro_matriculas y libro_pertenencias_taller.
--
-- ── Invariantes aplicadas (numeración del Plan Maestro vigente) ──
--   I11  Estados de Entrega (detalle): pendiente / entregado / no_aplica
--        → CHECK (estado IN ('pendiente','entregado','no_aplica')).
--   I12  Estado de la Entrega (cabecera): abierta / cerrada
--        → CHECK (estado IN ('abierto','cerrado')).
--   I13  Una Entrega cerrada es de solo lectura; solo puede modificarse mediante
--        reapertura (estado=abierto) → triggers de bloqueo (cabecera + detalle).
--   I7   Detalle único: una fila por estudiante en cada entrega
--        → UNIQUE (entrega_id, estudiante_id) (misma invariante que en F4/F6).
--   P3   Snapshot: la población de la entrega se fija al crear (todo el curso
--        vigente en la fecha; seleccionados='pendiente', no seleccionados=
--        'no_aplica'); la BD nunca añade filas → por diseño (la app inserta una
--        vez y nada más).
--   I6-análoga  (observaciones) el estudiante observado debe pertenecer al
--               taller ese año (libro_pertenencias_taller) → trigger.
--   (+ contexto tipo correcto: entregas→'curso', observaciones→'taller' → triggers).
-- Observaciones: histórico pedagógico append-only, SIN mecanismo de cierre
-- (el Plan las deja fuera de ese mecanismo), independiente de F4/F6/entregas.

-- ── 7. LIBRO_ENTREGAS ───────────────────────────────────────
-- Cabecera de una entrega/tarea solicitada a estudiantes de un CURSO. La sesión
-- de creación es solo trazabilidad (no limita su vida, patrón F4/F6).
CREATE TABLE IF NOT EXISTS libro_entregas (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio_id             UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id         UUID NOT NULL REFERENCES contextos(id),    -- debe ser tipo 'curso'
    sesion_creacion_id  UUID NOT NULL REFERENCES sesiones(id),     -- trazabilidad
    nombre              TEXT NOT NULL,
    fecha               DATE NOT NULL,
    estado              TEXT NOT NULL DEFAULT 'abierto'
                            CHECK (estado IN ('abierto', 'cerrado')),   -- I12 (abierta/cerrada)
    created_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_libro_entregas_anio_ctx ON libro_entregas (anio_id, contexto_id);

-- ── 8. LIBRO_ENTREGA_DETALLE ────────────────────────────────
-- Una fila por estudiante del curso, materializada al crear (snapshot, P3).
-- I11 — estados de la entrega:
--   'pendiente'  → seleccionado; debe entregar y aún no lo hizo.
--   'entregado'  → seleccionado; ya entregó.
--   'no_aplica'  → NO seleccionado al crear (fuera de la entrega).
CREATE TABLE IF NOT EXISTS libro_entrega_detalle (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entrega_id     UUID NOT NULL REFERENCES libro_entregas(id) ON DELETE CASCADE,
    estudiante_id  UUID NOT NULL REFERENCES libro_estudiantes(id),
    estado         TEXT NOT NULL DEFAULT 'pendiente'
                        CHECK (estado IN ('pendiente', 'entregado', 'no_aplica')),  -- I11
    created_at     TIMESTAMPTZ DEFAULT now(),
    UNIQUE (entrega_id, estudiante_id)             -- I7 (detalle único)
);
CREATE INDEX IF NOT EXISTS idx_libro_entrega_det_entrega ON libro_entrega_detalle (entrega_id);
CREATE INDEX IF NOT EXISTS idx_libro_entrega_det_est     ON libro_entrega_detalle (estudiante_id);

-- Trigger: la entrega solo puede apuntar a un contexto 'curso'.
CREATE OR REPLACE FUNCTION libro_entrega_contexto_es_curso()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'curso' THEN
        RAISE EXCEPTION
            'libro_entregas.contexto_id debe apuntar a un contexto de tipo ''curso'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_entrega_contexto_es_curso ON libro_entregas;
CREATE TRIGGER trg_libro_entrega_contexto_es_curso
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_entregas
    FOR EACH ROW EXECUTE FUNCTION libro_entrega_contexto_es_curso();

-- Trigger I13 (cabecera): una entrega cerrada es de solo lectura; solo puede
-- modificarse mediante reapertura (solo se permite cambiar 'estado').
CREATE OR REPLACE FUNCTION libro_entrega_bloqueo_cerrada()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.estado = 'cerrado' AND (
           NEW.nombre             IS DISTINCT FROM OLD.nombre
        OR NEW.fecha              IS DISTINCT FROM OLD.fecha
        OR NEW.contexto_id        IS DISTINCT FROM OLD.contexto_id
        OR NEW.anio_id            IS DISTINCT FROM OLD.anio_id
        OR NEW.sesion_creacion_id IS DISTINCT FROM OLD.sesion_creacion_id
    ) THEN
        RAISE EXCEPTION
            'I13: entrega cerrada es solo lectura; reábrela (estado=abierto) para editar la cabecera';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_entrega_bloqueo_cerrada ON libro_entregas;
CREATE TRIGGER trg_libro_entrega_bloqueo_cerrada
    BEFORE UPDATE ON libro_entregas
    FOR EACH ROW EXECUTE FUNCTION libro_entrega_bloqueo_cerrada();

-- Trigger I13 (detalle): inmutable si su entrega está cerrada. Para
-- INSERT/UPDATE (NEW) y DELETE (OLD); si el padre ya no existe (cascada) no bloquea.
CREATE OR REPLACE FUNCTION libro_entrega_hijo_bloqueo_cerrada()
RETURNS TRIGGER AS $$
DECLARE
    v_entrega UUID;
    v_estado  TEXT;
BEGIN
    v_entrega := COALESCE(NEW.entrega_id, OLD.entrega_id);
    SELECT estado INTO v_estado FROM libro_entregas WHERE id = v_entrega;
    IF NOT FOUND THEN
        RETURN COALESCE(NEW, OLD);   -- padre en borrado en cascada → permitir
    END IF;
    IF v_estado = 'cerrado' THEN
        RAISE EXCEPTION
            'I13: la entrega % está cerrada; reábrela para modificar su detalle', v_entrega;
    END IF;
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_entrega_det_bloqueo_cerrada ON libro_entrega_detalle;
CREATE TRIGGER trg_libro_entrega_det_bloqueo_cerrada
    BEFORE INSERT OR UPDATE OR DELETE ON libro_entrega_detalle
    FOR EACH ROW EXECUTE FUNCTION libro_entrega_hijo_bloqueo_cerrada();

-- ── 9. LIBRO_OBSERVACIONES ──────────────────────────────────
-- Histórico pedagógico individual para estudiantes de un TALLER. Cada fila es
-- una observación puntual (append-only). SIN estado ni cierre (fuera del
-- mecanismo de cierre por decisión del Plan). Independiente de F4/F6/entregas.
-- La sesión de creación es trazabilidad (patrón F4/F6): de qué sesión salió.
CREATE TABLE IF NOT EXISTS libro_observaciones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    anio_id             UUID NOT NULL REFERENCES libro_anios(id),
    contexto_id         UUID NOT NULL REFERENCES contextos(id),    -- debe ser tipo 'taller'
    estudiante_id       UUID NOT NULL REFERENCES libro_estudiantes(id),
    sesion_creacion_id  UUID REFERENCES sesiones(id),              -- trazabilidad ("si corresponde": nullable)
    fecha               DATE NOT NULL,
    texto               TEXT NOT NULL,
    created_at          TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_libro_obs_anio_ctx_est ON libro_observaciones (anio_id, contexto_id, estudiante_id);
CREATE INDEX IF NOT EXISTS idx_libro_obs_estudiante   ON libro_observaciones (estudiante_id);

-- Trigger: la observación solo puede apuntar a un contexto 'taller'.
CREATE OR REPLACE FUNCTION libro_obs_contexto_es_taller()
RETURNS TRIGGER AS $$
DECLARE
    v_tipo TEXT;
BEGIN
    SELECT tipo INTO v_tipo FROM contextos WHERE id = NEW.contexto_id;
    IF v_tipo IS DISTINCT FROM 'taller' THEN
        RAISE EXCEPTION
            'libro_observaciones.contexto_id debe apuntar a un contexto de tipo ''taller'' (recibido: %)',
            COALESCE(v_tipo, 'inexistente');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_obs_contexto_es_taller ON libro_observaciones;
CREATE TRIGGER trg_libro_obs_contexto_es_taller
    BEFORE INSERT OR UPDATE OF contexto_id ON libro_observaciones
    FOR EACH ROW EXECUTE FUNCTION libro_obs_contexto_es_taller();

-- Trigger I6-análoga: el estudiante observado debe pertenecer al taller ese año
-- (integridad coherente con F5/F6; el pool de la UI son las pertenencias del
-- taller). Solo aplica a inserciones nuevas; el histórico ya escrito permanece.
CREATE OR REPLACE FUNCTION libro_obs_exige_pertenencia()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM libro_pertenencias_taller
        WHERE estudiante_id = NEW.estudiante_id
          AND anio_id       = NEW.anio_id
          AND contexto_id   = NEW.contexto_id
    ) THEN
        RAISE EXCEPTION
            'I6-análoga: el estudiante % no pertenece al taller % en el año % (requisito para observarlo)',
            NEW.estudiante_id, NEW.contexto_id, NEW.anio_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_libro_obs_exige_pertenencia ON libro_observaciones;
CREATE TRIGGER trg_libro_obs_exige_pertenencia
    BEFORE INSERT OR UPDATE OF estudiante_id, anio_id, contexto_id ON libro_observaciones
    FOR EACH ROW EXECUTE FUNCTION libro_obs_exige_pertenencia();

-- ── ROW LEVEL SECURITY (patrón acceso_total del ecosistema) ──
ALTER TABLE libro_entregas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_entrega_detalle  ENABLE ROW LEVEL SECURITY;
ALTER TABLE libro_observaciones    ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acceso_total" ON libro_entregas;
DROP POLICY IF EXISTS "acceso_total" ON libro_entrega_detalle;
DROP POLICY IF EXISTS "acceso_total" ON libro_observaciones;
CREATE POLICY "acceso_total" ON libro_entregas        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_entrega_detalle FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON libro_observaciones   FOR ALL USING (true) WITH CHECK (true);
