-- ── REPERTORIO — Schema Supabase ─────────────────────────────────────────────
-- Ejecutar en: Supabase Dashboard → SQL Editor

-- Canciones
CREATE TABLE IF NOT EXISTS repertorio_canciones (
    id           TEXT PRIMARY KEY,
    nombre       TEXT NOT NULL,
    artista      TEXT DEFAULT '',
    año          TEXT DEFAULT '',
    estilo       TEXT DEFAULT '',
    artwork_url  TEXT DEFAULT '',
    categoria    TEXT DEFAULT 'cancion',  -- 'cancion' | 'material'
    prefs        JSONB DEFAULT NULL,      -- preferencias por canción, ej: { "vista_letra": { "modo": "...", "resaltado": "..." } }
    creado       BIGINT,
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Assets (letra, tab, metalofono, flauta, cifrado, audio)
CREATE TABLE IF NOT EXISTS repertorio_assets (
    id             TEXT PRIMARY KEY,
    cancion_id     TEXT NOT NULL REFERENCES repertorio_canciones(id) ON DELETE CASCADE,
    tipo           TEXT NOT NULL,
    etiqueta       TEXT DEFAULT '',
    contenido      TEXT DEFAULT '',
    synced         TEXT DEFAULT '',
    lrclib_id      INTEGER,
    nombre_archivo TEXT DEFAULT '',
    storage_path   TEXT DEFAULT '',
    orden          INTEGER DEFAULT 0,
    instrumento    TEXT DEFAULT '',  -- guitarra, ukelele, bajo, metalofono, flauta
    dificultad     TEXT DEFAULT '',  -- inicial, media, dificil, experto
    tonalidad      TEXT DEFAULT '',  -- Do mayor, Re menor, etc.
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ── ESTADO EDITORIAL DEL ASSET ───────────────────────────────────────────────
-- Ciclo de vida de publicación. Representa ÚNICAMENTE la decisión editorial del
-- profesor: NO representa calidad, completitud, digitación ni rasgueo.
--
--   borrador     → en desarrollo (valor por defecto)
--   publicado    → operativo, apto para ofrecer y asignar
--   experimental → material usado para probar funciones del Lector
--   archivado    → fuera de circulación (no se borra)
--
-- REGLA: el estado solo cambia cuando el usuario lo modifica explícitamente.
-- Nunca debe inferirse automáticamente desde tab_sync ni desde ningún otro campo.
-- (El backfill de abajo usa tab_sync SOLO por única vez, en la migración inicial.)
--
-- Política de visibilidad:
--   · superficies de ELECCIÓN → filtran por estado
--   · runtime (audio sync, deep links, Pizarra, Entrenador) → NUNCA filtra
ALTER TABLE repertorio_assets
    ADD COLUMN IF NOT EXISTS estado TEXT NOT NULL DEFAULT 'borrador';

ALTER TABLE repertorio_assets
    DROP CONSTRAINT IF EXISTS repertorio_assets_estado_chk;
ALTER TABLE repertorio_assets
    ADD CONSTRAINT repertorio_assets_estado_chk
    CHECK (estado IN ('borrador','publicado','experimental','archivado'));

-- Backfill inicial (una sola vez):
--   El DEFAULT deja todos los assets existentes en 'borrador'.
--   Solo los que tienen audio sync REAL (tab_sync->>'mode') pasan a 'experimental'.
--   Nota: tab_sync IS NOT NULL no sirve como criterio — guardarSecciones() lo escribe
--   automáticamente al abrir cualquier tab con rehearsal marks.
UPDATE repertorio_assets SET estado = 'experimental' WHERE tab_sync->>'mode' IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_assets_estado ON repertorio_assets(estado);

-- Migración (ejecutar si la tabla ya existe):
-- ALTER TABLE repertorio_canciones ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'cancion';
-- ALTER TABLE repertorio_canciones ADD COLUMN IF NOT EXISTS prefs JSONB DEFAULT NULL;  -- prefs de visualización de letra (Pizarra)
-- ALTER TABLE repertorio_assets ADD COLUMN IF NOT EXISTS instrumento TEXT DEFAULT '';
-- ALTER TABLE repertorio_assets ADD COLUMN IF NOT EXISTS dificultad TEXT DEFAULT '';
-- ALTER TABLE repertorio_assets ADD COLUMN IF NOT EXISTS tonalidad TEXT DEFAULT '';
-- ALTER TABLE repertorio_assets ADD COLUMN IF NOT EXISTS mensaje TEXT;
-- ALTER TABLE repertorio_assets ADD COLUMN IF NOT EXISTS tab_sync JSONB DEFAULT NULL;

-- Asignación de tabs individuales a alumnos (reemplaza alumno_repertorio por cancion)
CREATE TABLE IF NOT EXISTS alumno_tabs (
    alumno_id  TEXT NOT NULL,   -- ID del alumno (alumnos_taller)
    asset_id   TEXT NOT NULL,   -- ID del asset (repertorio_assets)
    PRIMARY KEY (alumno_id, asset_id)
);
ALTER TABLE alumno_tabs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON alumno_tabs FOR ALL TO anon USING (true) WITH CHECK (true);

-- Asignación de secciones individuales a alumnos (para tabs con rehearsal marks)
CREATE TABLE IF NOT EXISTS alumno_tab_secciones (
    alumno_id  TEXT NOT NULL,   -- ID del alumno (alumnos_taller)
    asset_id   TEXT NOT NULL,   -- ID del asset (repertorio_assets)
    seccion    TEXT NOT NULL,   -- nombre de la sección (ej: 'Intro', 'Estrofa')
    PRIMARY KEY (alumno_id, asset_id, seccion)
);
ALTER TABLE alumno_tab_secciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON alumno_tab_secciones FOR ALL TO anon USING (true) WITH CHECK (true);

-- Mensajes de recordatorio por alumno en ejercicio específico
CREATE TABLE IF NOT EXISTS tab_mensajes_alumno (
    storage_path  TEXT NOT NULL,   -- identifica el archivo tab en Supabase Storage
    alumno_id     TEXT NOT NULL,   -- ID del alumno (UUID de la tabla alumnos del Lector)
    mensaje       TEXT NOT NULL,
    updated_at    TIMESTAMPTZ DEFAULT now(),
    PRIMARY KEY (storage_path, alumno_id)
);

-- RLS
ALTER TABLE tab_mensajes_alumno ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON tab_mensajes_alumno
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- Asignaciones canción ↔ contexto (muchos a muchos)
CREATE TABLE IF NOT EXISTS repertorio_cancion_contextos (
    cancion_id  TEXT NOT NULL REFERENCES repertorio_canciones(id) ON DELETE CASCADE,
    contexto    TEXT NOT NULL,
    PRIMARY KEY (cancion_id, contexto)
);

-- RLS (acceso abierto — sin auth todavía, consistente con el ecosistema)
ALTER TABLE repertorio_canciones            ENABLE ROW LEVEL SECURITY;
ALTER TABLE repertorio_assets               ENABLE ROW LEVEL SECURITY;
ALTER TABLE repertorio_cancion_contextos    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all" ON repertorio_canciones
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON repertorio_assets
    FOR ALL TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon_all" ON repertorio_cancion_contextos
    FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── STORAGE ───────────────────────────────────────────────────────────────────
-- Crear el bucket manualmente en:
-- Supabase Dashboard → Storage → New bucket
-- Nombre: repertorio-assets
-- Public: YES (para streaming directo sin auth)
-- File size limit: 50 MB

-- Políticas RLS para Storage (bucket repertorio-assets)
-- El bucket público da lectura libre, pero escritura requiere políticas explícitas.
CREATE POLICY "anon_select"  ON storage.objects FOR SELECT  TO anon USING (bucket_id = 'repertorio-assets');
CREATE POLICY "anon_insert"  ON storage.objects FOR INSERT  TO anon WITH CHECK (bucket_id = 'repertorio-assets');
CREATE POLICY "anon_update"  ON storage.objects FOR UPDATE  TO anon USING (bucket_id = 'repertorio-assets');
CREATE POLICY "anon_delete"  ON storage.objects FOR DELETE  TO anon USING (bucket_id = 'repertorio-assets');

-- ══ SISTEMA DE LECCIONES (Etapa 1) ═══════════════════════════════════════════
-- Una Lección es una colección ORDENADA de referencias a tablaturas existentes
-- (modelo playlist). Nunca duplica un asset: solo lo referencia.
--
--   lecciones (1) ──< leccion_items (N) >── (1) repertorio_assets  [tabs intactas]
--       └──< alumno_lecciones (N) >── alumnos_taller (por id, sin FK — ver nota)

-- 1. LECCIONES — el documento. Solo identidad y metadatos.
CREATE TABLE IF NOT EXISTS lecciones (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre         TEXT NOT NULL,
    descripcion    TEXT DEFAULT '',
    creada_en      TIMESTAMPTZ DEFAULT now(),
    actualizada_en TIMESTAMPTZ DEFAULT now()
);

-- 2. LECCION_ITEMS — la lista ordenada. Cada fila es un paso.
--    orden: siempre consecutivo (0,1,2,3…), recalculado por la app en cada reordenamiento.
--    tipo:  discriminador para futuros recursos; hoy siempre 'tab'.
--    data:  reservado para tipos futuros (no usado en esta etapa).
--    asset_id es TEXT porque repertorio_assets.id es TEXT (un FK exige tipos idénticos).
--    ON DELETE CASCADE limpia la referencia; la app avisa antes de borrar la tab.
CREATE TABLE IF NOT EXISTS leccion_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leccion_id  UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
    orden       SMALLINT NOT NULL DEFAULT 0,
    tipo        TEXT NOT NULL DEFAULT 'tab',
    asset_id    TEXT REFERENCES repertorio_assets(id) ON DELETE CASCADE,
    data        JSONB DEFAULT '{}',
    UNIQUE (leccion_id, asset_id)   -- una tab no puede repetirse en la misma lección
);

-- 3. ALUMNO_LECCIONES — asignación. Espejo de alumno_tabs.
--    alumno_id sin FK: replica alumno_tabs (allí es TEXT y alumnos_taller.id es UUID).
CREATE TABLE IF NOT EXISTS alumno_lecciones (
    alumno_id   TEXT NOT NULL,
    leccion_id  UUID NOT NULL REFERENCES lecciones(id) ON DELETE CASCADE,
    PRIMARY KEY (alumno_id, leccion_id)
);

CREATE INDEX IF NOT EXISTS idx_leccion_items_leccion ON leccion_items(leccion_id, orden);
CREATE INDEX IF NOT EXISTS idx_leccion_items_asset   ON leccion_items(asset_id);
CREATE INDEX IF NOT EXISTS idx_alumno_lecciones_al   ON alumno_lecciones(alumno_id);

ALTER TABLE lecciones        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leccion_items    ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumno_lecciones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_all" ON lecciones        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON leccion_items    FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all" ON alumno_lecciones FOR ALL TO anon USING (true) WITH CHECK (true);
