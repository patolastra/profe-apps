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
