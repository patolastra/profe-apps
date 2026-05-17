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
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

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
