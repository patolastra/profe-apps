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

-- Migración (ejecutar si la tabla ya existe):
-- ALTER TABLE repertorio_canciones ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'cancion';
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
