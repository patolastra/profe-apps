-- ============================================================
-- SEED — Contextos y horario real de Pato
-- Ejecutar DESPUÉS de schema.sql
-- ============================================================

-- ── CONTEXTOS ───────────────────────────────────────────────
INSERT INTO contextos (nombre, tipo, color) VALUES
    ('PRIMERO',          'curso',    '#4CAF50'),
    ('SEGUNDO',          'curso',    '#2196F3'),
    ('TERCERO',          'curso',    '#FF9800'),
    ('CUARTO',           'curso',    '#9C27B0'),
    ('QUINTO',           'curso',    '#F44336'),
    ('SEXTO',            'curso',    '#00BCD4'),
    ('SEPTIMO',          'curso',    '#8BC34A'),
    ('OCTAVO',           'curso',    '#FF5722'),
    ('CUERDAS',          'taller',   '#607D8B'),
    ('CASTIGADAS',       'taller',   '#795548'),
    ('KIDS CASTIGADAS',  'taller',   '#9E9E9E'),
    ('RECREO',           'recreo',   '#FFEB3B'),
    ('ENLACE',           'jefatura', '#E91E63'),
    ('ORIENTACIÓN',      'jefatura', '#3F51B5'),
    ('GENERAL',          'general',  '#78909C')
ON CONFLICT (nombre) DO NOTHING;

-- ── HORARIO ─────────────────────────────────────────────────
-- Lunes = 0, Martes = 1, Miércoles = 2, Jueves = 3
INSERT INTO horario (contexto_id, dia_semana, orden)
SELECT id, 0, 1 FROM contextos WHERE nombre = 'ORIENTACIÓN'
UNION ALL
SELECT id, 0, 2 FROM contextos WHERE nombre = 'TERCERO'
UNION ALL
SELECT id, 0, 3 FROM contextos WHERE nombre = 'CUARTO'
UNION ALL
SELECT id, 0, 4 FROM contextos WHERE nombre = 'CUERDAS'
UNION ALL
SELECT id, 1, 1 FROM contextos WHERE nombre = 'ENLACE'
UNION ALL
SELECT id, 1, 2 FROM contextos WHERE nombre = 'SEXTO'
UNION ALL
SELECT id, 1, 3 FROM contextos WHERE nombre = 'RECREO'
UNION ALL
SELECT id, 1, 4 FROM contextos WHERE nombre = 'QUINTO'
UNION ALL
SELECT id, 2, 1 FROM contextos WHERE nombre = 'PRIMERO'
UNION ALL
SELECT id, 3, 1 FROM contextos WHERE nombre = 'SEGUNDO'
UNION ALL
SELECT id, 3, 2 FROM contextos WHERE nombre = 'SEPTIMO'
UNION ALL
SELECT id, 3, 3 FROM contextos WHERE nombre = 'KIDS CASTIGADAS'
UNION ALL
SELECT id, 3, 4 FROM contextos WHERE nombre = 'OCTAVO'
UNION ALL
SELECT id, 3, 5 FROM contextos WHERE nombre = 'CASTIGADAS';
