-- Pendientes, paso 2 (deuda BC, 2026-10-12). Aditivo y re-ejecutable.
--   hoy           → fecha en que se puso en la lista HOY (la lista muestra solo los de hoy:
--                   cada día parte vacía)
--   completado_en → cuándo se completó (los completados dejan de verse a las 2 semanas)
--   padre_id      → subpendiente de otro pendiente (un nivel); borrar el padre borra los hijos
ALTER TABLE pendientes ADD COLUMN IF NOT EXISTS hoy           DATE;
ALTER TABLE pendientes ADD COLUMN IF NOT EXISTS completado_en TIMESTAMPTZ;
ALTER TABLE pendientes ADD COLUMN IF NOT EXISTS padre_id      UUID REFERENCES pendientes(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_pendientes_padre ON pendientes(padre_id);

-- Los ya completados: se toma la fecha de su clase (o la de creación si no tienen clase).
UPDATE pendientes p
   SET completado_en = COALESCE((SELECT s.fecha FROM sesiones s WHERE s.id = p.sesion_id)::timestamptz, p.created_at)
 WHERE p.estado = 'completado' AND p.completado_en IS NULL;

-- Traslado del jueves: solo los pendientes principales; sus subpendientes van con ellos.
-- (Misma función de supabase/schema.sql §14.3, con esos dos cambios.)
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
           AND p.padre_id IS NULL
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
        IF FOUND THEN
            v_mov := v_mov + 1;
            UPDATE pendientes SET sesion_id = v_sid WHERE padre_id = r.id;
        END IF;
    END LOOP;

    IF p_ids IS NULL THEN
        UPDATE pendientes_cierres SET movidos = v_mov, sin_horario = v_sinh
         WHERE fecha = p_cierre;
    END IF;
    RETURN jsonb_build_object('cierre', p_cierre, 'movidos', v_mov, 'sin_horario', v_sinh);
END $$;
