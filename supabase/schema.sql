-- ============================================================
-- ECOSISTEMA PROFE — Schema base Supabase
-- Fase 3: Eje temporal + pendientes con sesión
-- ============================================================

-- ── 1. CONTEXTOS ────────────────────────────────────────────
-- Los 14 contextos docentes + GENERAL
CREATE TABLE IF NOT EXISTS contextos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL UNIQUE,
    tipo        TEXT NOT NULL CHECK (tipo IN ('curso', 'taller', 'recreo', 'jefatura', 'general')),
    color       TEXT,
    activo      BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 2. HORARIO ──────────────────────────────────────────────
-- Estructura fija semanal: qué contexto aparece qué día
-- dia_semana: 0=Lunes, 1=Martes, 2=Miércoles, 3=Jueves
CREATE TABLE IF NOT EXISTS horario (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contexto_id UUID NOT NULL REFERENCES contextos(id) ON DELETE CASCADE,
    dia_semana  SMALLINT NOT NULL CHECK (dia_semana BETWEEN 0 AND 3),
    orden       SMALLINT DEFAULT 0,   -- posición dentro del día
    hora_inicio TIME,
    hora_fin    TIME,
    sala        TEXT,
    activo      BOOLEAN DEFAULT true
);

-- ── 3. SESIONES ─────────────────────────────────────────────
-- Instancias concretas: contexto + fecha = sesión real
-- Es el eje temporal central del sistema
CREATE TABLE IF NOT EXISTS sesiones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contexto_id UUID NOT NULL REFERENCES contextos(id),
    horario_id  UUID REFERENCES horario(id),
    fecha       DATE NOT NULL,
    nota        TEXT,
    created_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (contexto_id, fecha)
);

-- ── 4. PENDIENTES ───────────────────────────────────────────
-- Items capturados y procesados por SRP
-- sesion_id nullable = sin sesión asignada → va a próxima clase del curso
CREATE TABLE IF NOT EXISTS pendientes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contexto_id     UUID REFERENCES contextos(id),
    sesion_id       UUID REFERENCES sesiones(id),   -- null = próxima sesión futura
    categoria       TEXT NOT NULL,
    texto           TEXT NOT NULL,
    estado          TEXT DEFAULT 'activo' CHECK (estado IN ('activo', 'completado', 'descartado')),
    fecha_captura   TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── 5. SESIONES SRP ─────────────────────────────────────────
-- Registros de procesamiento: fixture + parseo + output corregido
CREATE TABLE IF NOT EXISTS sesiones_srp (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id       UUID REFERENCES sesiones(id),   -- null si se grabó fuera de horario
    fixture_name    TEXT,
    raw_fixtures    JSONB,
    original_parse  JSONB,
    expected_output JSONB,
    timestamp_ms    BIGINT,
    created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── 6. PRESENTACIONES ───────────────────────────────────────
-- Texto de presentación asociado a una sesión (Portal → Presentador)
CREATE TABLE IF NOT EXISTS presentaciones (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id   UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    contenido   TEXT DEFAULT '',
    updated_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (sesion_id)
);

-- ── 7. PLAN_SESION_ITEMS ─────────────────────────────────────
-- Pool de actividades planificadas por sesión (Portal)
CREATE TABLE IF NOT EXISTS plan_sesion_items (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id    UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    texto        TEXT NOT NULL,
    categoria    TEXT DEFAULT '',
    orden        SMALLINT DEFAULT 0,
    origen       TEXT NOT NULL DEFAULT 'manual' CHECK (origen IN ('srp', 'manual')),
    pendiente_id UUID REFERENCES pendientes(id),
    incluido         BOOLEAN DEFAULT true,
    completado       BOOLEAN DEFAULT false,
    es_planificacion BOOLEAN DEFAULT false,
    created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── 8. ALUMNOS_TALLER ───────────────────────────────────────
-- Nómina de alumnos por taller (MVP: CUERDAS)
-- Futuro: migrar a Libro de Clases
CREATE TABLE IF NOT EXISTS alumnos_taller (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL,           -- nombre(s) de pila: "Juan"
    apellido    TEXT DEFAULT '',         -- apellido(s): "García López"
    contexto    TEXT NOT NULL REFERENCES contextos(nombre),
    curso       TEXT DEFAULT '',         -- informativo: '6°B', '7°A', etc.
    activo      BOOLEAN DEFAULT true,
    orden       SMALLINT DEFAULT 0,
    created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── 9. ALUMNO_REPERTORIO ─────────────────────────────────────
-- Canciones asignadas a cada alumno (su secuencia de lecciones)
-- Futuro: gestionado desde Repertorio + Libro de Clases
CREATE TABLE IF NOT EXISTS alumno_repertorio (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id   UUID NOT NULL REFERENCES alumnos_taller(id) ON DELETE CASCADE,
    cancion_id  TEXT NOT NULL REFERENCES repertorio_canciones(id) ON DELETE CASCADE,
    orden       SMALLINT DEFAULT 0,
    activo      BOOLEAN DEFAULT true,
    created_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (alumno_id, cancion_id)
);

-- ── 10. PRACTICA_LOG ─────────────────────────────────────────
-- Registro automático de cada sesión de práctica (= asistencia al taller)
CREATE TABLE IF NOT EXISTS practica_log (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id     UUID NOT NULL REFERENCES alumnos_taller(id) ON DELETE CASCADE,
    cancion_id    TEXT REFERENCES repertorio_canciones(id),
    storage_path  TEXT,
    fecha         DATE NOT NULL DEFAULT CURRENT_DATE,
    inicio        TIMESTAMPTZ NOT NULL DEFAULT now(),
    duracion_seg  INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT now()
);

-- ── ÍNDICES ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_horario_dia        ON horario(dia_semana);
CREATE INDEX IF NOT EXISTS idx_sesiones_fecha     ON sesiones(fecha);
CREATE INDEX IF NOT EXISTS idx_sesiones_contexto  ON sesiones(contexto_id);
CREATE INDEX IF NOT EXISTS idx_pendientes_sesion  ON pendientes(sesion_id);
CREATE INDEX IF NOT EXISTS idx_pendientes_ctx     ON pendientes(contexto_id);
CREATE INDEX IF NOT EXISTS idx_pendientes_estado  ON pendientes(estado);
CREATE INDEX IF NOT EXISTS idx_presentaciones_sesion ON presentaciones(sesion_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_sesion     ON plan_sesion_items(sesion_id);
CREATE INDEX IF NOT EXISTS idx_plan_items_pendiente  ON plan_sesion_items(pendiente_id);
CREATE INDEX IF NOT EXISTS idx_alumnos_contexto      ON alumnos_taller(contexto);
CREATE INDEX IF NOT EXISTS idx_alumno_rep_alumno     ON alumno_repertorio(alumno_id);
CREATE INDEX IF NOT EXISTS idx_practica_alumno_fecha ON practica_log(alumno_id, fecha);
CREATE INDEX IF NOT EXISTS idx_practica_fecha        ON practica_log(fecha);

-- ── ROW LEVEL SECURITY ──────────────────────────────────────
-- Habilitado pero permisivo por ahora (acceso con service key)
-- Se refina cuando se agregue auth de usuario
ALTER TABLE contextos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE horario           ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones          ENABLE ROW LEVEL SECURITY;
ALTER TABLE pendientes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sesiones_srp      ENABLE ROW LEVEL SECURITY;
ALTER TABLE presentaciones    ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_sesion_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acceso_total" ON contextos         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON horario           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON sesiones          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON pendientes        FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON sesiones_srp      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON presentaciones    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON plan_sesion_items FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE alumnos_taller    ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumno_repertorio ENABLE ROW LEVEL SECURITY;
ALTER TABLE practica_log      ENABLE ROW LEVEL SECURITY;

CREATE POLICY "acceso_total" ON alumnos_taller    FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON alumno_repertorio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "acceso_total" ON practica_log      FOR ALL USING (true) WITH CHECK (true);

-- ── SESIONES DE ENTRENAMIENTO (Repertorio) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS repertorio_sesiones_entrenamiento (
    id          TEXT PRIMARY KEY,
    nombre      TEXT NOT NULL,
    canciones   JSONB DEFAULT '[]',
    creada_en   BIGINT
);
ALTER TABLE repertorio_sesiones_entrenamiento ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acceso_total" ON repertorio_sesiones_entrenamiento FOR ALL USING (true) WITH CHECK (true);

-- ── 11. MEMORIAS ─────────────────────────────────────────────
-- Memoria permanente de cada clase: documento narrativo (texto y/o audios)
-- asociado 1:1 a una sesión. Es el acta de lo que ocurrió — NO genera
-- pendientes ni pasa por el parser. (Iteración 1 — 2026-07-07)
-- audios: lista JSON [{ "path": "<ruta en bucket memorias-audio>", "ts": <epoch ms> }]
CREATE TABLE IF NOT EXISTS memorias (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sesion_id   UUID NOT NULL REFERENCES sesiones(id) ON DELETE CASCADE,
    contenido   TEXT DEFAULT '',
    audios      JSONB DEFAULT '[]',
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (sesion_id)
);
ALTER TABLE memorias ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acceso_total" ON memorias FOR ALL USING (true) WITH CHECK (true);

-- Storage para los audios de memorias:
-- 1. Crear bucket manualmente: Dashboard → Storage → New bucket
--    Nombre: memorias-audio | Public: YES | File size limit: 50 MB
-- 2. Ejecutar estas políticas:
CREATE POLICY "mem_select" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'memorias-audio');
CREATE POLICY "mem_insert" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'memorias-audio');

-- ── 12. MATERIALES_CONTEXTO ──────────────────────────────────
-- Lista persistente de materiales POR CONTEXTO (no por sesión).
-- Clave = contexto_id (UNIQUE). items = array JSON de strings, p.ej.
-- ["Baquetas","Metalófonos","Parlante"]. Reemplazo total al guardar
-- (upsert onConflict:'contexto_id'); sin checks, estados ni historial.
-- NO confundir con pendientes.categoria='pendientes_materiales' (por sesión, SRP).
CREATE TABLE IF NOT EXISTS materiales_contexto (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contexto_id UUID NOT NULL REFERENCES contextos(id) ON DELETE CASCADE,
    items       JSONB DEFAULT '[]',
    updated_at  TIMESTAMPTZ DEFAULT now(),
    UNIQUE (contexto_id)
);
ALTER TABLE materiales_contexto ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acceso_total" ON materiales_contexto FOR ALL USING (true) WITH CHECK (true);

-- ── 13. LECTOR_PARTICULARES ──────────────────────────────────
-- Estudiantes PARTICULARES del Lector Tabs: alumnos que NO pertenecen a la
-- escuela. Sin contexto, sin curso, sin matrícula, sin datos personales
-- (nada de RUT/email/teléfono/password). NO aparecen en ninguna nómina
-- escolar ni en el Libro de Clases. Su único propósito es tener una
-- identidad propia dentro del Lector para recibir tabs/secciones/lecciones.
--
-- Reutilización: el `id` (UUID) se usa como alumno_id (TEXT) en las tablas
-- de asignación existentes (alumno_tabs, alumno_tab_secciones,
-- alumno_lecciones, tab_mensajes_alumno) — que NO tienen FK, por lo que
-- aceptan cualquier id sin tocar su definición. No se modifica ninguna
-- tabla escolar (alumnos_taller, contextos, matrículas, etc.).
--
-- slug: identificador legible y estable para la URL pública
--       (/tabs/index.html?p=<slug>), p.ej. "juan-perez-a3f9". NO es el UUID
--       ni un token; es ofuscación, no seguridad. La restricción real la
--       aplica el Lector forzando modo público cuando hay ?p= (sin admin).
CREATE TABLE IF NOT EXISTS lector_particulares (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL,
    apellido    TEXT NOT NULL DEFAULT '',
    slug        TEXT NOT NULL UNIQUE,
    activo      BOOLEAN NOT NULL DEFAULT true,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE lector_particulares ENABLE ROW LEVEL SECURITY;
CREATE POLICY "acceso_total" ON lector_particulares FOR ALL USING (true) WITH CHECK (true);

-- ════════════════════════════════════════════════════════════
-- ── 14. GESTIÓN SEMANAL DE PENDIENTES (desarrollo paralelo, 2026-09-23)
-- ════════════════════════════════════════════════════════════
-- Decisión del PO: cada JUEVES 18:00 (hora de Chile) los pendientes
-- `tarea_proxima` NO completados cuya clase ya ocurrió (fecha <= jueves del
-- cierre) se TRASLADAN a la próxima clase de su mismo contexto según el
-- horario. Es el MISMO pendiente (solo cambia sesion_id); nunca se crea uno
-- nuevo. Cada traslado suma 1 a `semanas_pendiente` → la UI muestra "(n sem)"
-- mientras el pendiente esté activo. Completar/desmarcar NO toca el contador.
-- Vacaciones y feriados: fuera de alcance (no existen en el sistema).
--
-- Garantías:
--   · sin duplicados   → solo UPDATE de sesion_id (nunca INSERT de pendientes);
--   · sin cierre doble → pendientes_cierres (PK = fecha del jueves) + candado
--                        + guardia por fila `ultimo_cierre`;
--   · sin mover completados → WHERE estado = 'activo' en el mismo UPDATE;
--   · próxima clase    → primera fecha > jueves del cierre cuyo día de semana
--                        está en el horario ACTIVO del contexto (genérico para
--                        cualquier día; dia_semana 0 = lunes); la sesión se
--                        crea si no existe (UNIQUE contexto_id+fecha).
--   · contexto sin horario → el pendiente no se mueve (queda contado).
-- Disparo: pg_cron (bloque 14.4, cada hora; la función solo actúa cuando ya
-- pasó el jueves 18:00) + respaldo: el Portal llama a la función al abrirse.
-- Aditivo e idempotente: re-ejecutable.

-- 14.1 Baja de los pendientes antiguos (SRP/ADMIN). Se DESCARTAN, no se
-- borran (se conserva el histórico de SRP, congelado).
UPDATE pendientes SET estado = 'descartado'
 WHERE estado = 'activo' AND categoria <> 'tarea_proxima';

-- 14.2 Estructura
ALTER TABLE pendientes ADD COLUMN IF NOT EXISTS semanas_pendiente SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE pendientes ADD COLUMN IF NOT EXISTS ultimo_cierre     DATE;

CREATE TABLE IF NOT EXISTS pendientes_cierres (
    fecha        DATE PRIMARY KEY,              -- jueves del cierre
    ejecutado_en TIMESTAMPTZ NOT NULL DEFAULT now(),
    movidos      INTEGER NOT NULL DEFAULT 0,
    sin_horario  INTEGER NOT NULL DEFAULT 0     -- pendientes no movidos (contexto sin horario)
);
ALTER TABLE pendientes_cierres ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "acceso_total" ON pendientes_cierres;
CREATE POLICY "acceso_total" ON pendientes_cierres FOR ALL USING (true) WITH CHECK (true);

-- 14.3 Funciones
-- Aplica UN cierre (jueves p_cierre). p_ids = NULL → todos los pendientes
-- (uso real). p_ids = lista → solo esos pendientes (pruebas); en ese modo NO
-- se registra el cierre en pendientes_cierres.
CREATE OR REPLACE FUNCTION public.pendientes_cierre_aplicar(p_cierre DATE, p_ids UUID[] DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    r        RECORD;
    v_fecha  DATE;
    v_sid    UUID;
    v_mov    INTEGER := 0;
    v_sinh   INTEGER := 0;
BEGIN
    IF p_ids IS NULL THEN
        INSERT INTO pendientes_cierres (fecha) VALUES (p_cierre)
        ON CONFLICT (fecha) DO NOTHING;
        IF NOT FOUND THEN
            RETURN jsonb_build_object('cierre', p_cierre, 'ya_ejecutado', true);
        END IF;
    END IF;

    FOR r IN
        SELECT p.id, p.contexto_id
          FROM pendientes p
          JOIN sesiones s ON s.id = p.sesion_id
         WHERE p.categoria = 'tarea_proxima'
           AND p.estado    = 'activo'
           AND btrim(p.texto) <> ''
           AND s.fecha    <= p_cierre
           AND (p.ultimo_cierre IS NULL OR p.ultimo_cierre < p_cierre)
           AND (p_ids IS NULL OR p.id = ANY (p_ids))
         ORDER BY p.created_at
           FOR UPDATE OF p
    LOOP
        SELECT min(p_cierre + k) INTO v_fecha
          FROM generate_series(1, 7) AS k
          JOIN horario h ON h.contexto_id = r.contexto_id
                        AND h.activo
                        AND h.dia_semana = extract(isodow FROM (p_cierre + k))::int - 1;

        IF v_fecha IS NULL THEN
            v_sinh := v_sinh + 1;
            CONTINUE;
        END IF;

        INSERT INTO sesiones (contexto_id, fecha) VALUES (r.contexto_id, v_fecha)
        ON CONFLICT (contexto_id, fecha) DO NOTHING;
        SELECT id INTO v_sid FROM sesiones
         WHERE contexto_id = r.contexto_id AND fecha = v_fecha;

        UPDATE pendientes
           SET sesion_id         = v_sid,
               semanas_pendiente = semanas_pendiente + 1,
               ultimo_cierre     = p_cierre
         WHERE id = r.id AND estado = 'activo';
        IF FOUND THEN v_mov := v_mov + 1; END IF;
    END LOOP;

    IF p_ids IS NULL THEN
        UPDATE pendientes_cierres SET movidos = v_mov, sin_horario = v_sinh
         WHERE fecha = p_cierre;
    END IF;
    RETURN jsonb_build_object('cierre', p_cierre, 'movidos', v_mov, 'sin_horario', v_sinh);
END $$;

-- Punto de entrada (pg_cron y Portal). Ejecuta, en orden, todos los cierres
-- vencidos (jueves 18:00 hora de Chile ya pasado) desde el PRIMER cierre
-- (2026-09-24) que aún no se hayan ejecutado. Sin cierres vencidos → no hace
-- nada. p_ahora / p_ids: solo para pruebas (simular hora / limitar pendientes).
CREATE OR REPLACE FUNCTION public.pendientes_cierre_semanal(p_ahora TIMESTAMPTZ DEFAULT now(), p_ids UUID[] DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql AS $$
DECLARE
    c_primer_cierre CONSTANT DATE := DATE '2026-09-24';   -- jueves
    c_dia_iso       CONSTANT INT  := 4;                   -- jueves (ISO)
    c_hora          CONSTANT TIME := TIME '18:00';
    c_zona          CONSTANT TEXT := 'America/Santiago';
    v_local   TIMESTAMP := p_ahora AT TIME ZONE c_zona;
    v_ultimo  DATE;
    v_cierre  DATE;
    v_res     JSONB := '[]'::jsonb;
BEGIN
    PERFORM pg_advisory_xact_lock(hashtext('pendientes_cierre_semanal'));

    -- último jueves (<= hoy local) y, si es hoy, solo si ya pasaron las 18:00
    v_ultimo := v_local::date - ((extract(isodow FROM v_local)::int - c_dia_iso + 7) % 7);
    IF v_ultimo = v_local::date AND v_local::time < c_hora THEN
        v_ultimo := v_ultimo - 7;
    END IF;

    FOR v_cierre IN
        SELECT d::date FROM generate_series(c_primer_cierre, v_ultimo, INTERVAL '7 days') AS d
    LOOP
        IF p_ids IS NULL AND EXISTS (SELECT 1 FROM pendientes_cierres WHERE fecha = v_cierre) THEN
            CONTINUE;
        END IF;
        v_res := v_res || pendientes_cierre_aplicar(v_cierre, p_ids);
    END LOOP;
    RETURN v_res;
END $$;

-- 14.4 Reloj (pg_cron): cada hora, minuto 5. La función decide si hay un
-- cierre vencido; el resto de las horas no hace nada. Si pg_cron no estuviera
-- disponible, el respaldo del Portal (al abrirse) ejecuta el cierre igual.
CREATE EXTENSION IF NOT EXISTS pg_cron;
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobname = 'pendientes-cierre-semanal';
SELECT cron.schedule('pendientes-cierre-semanal', '5 * * * *',
                     $$SELECT public.pendientes_cierre_semanal()$$);
