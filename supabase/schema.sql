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
