-- Libro al instante entre equipos (deuda BE, Fase 2, 2026-10-13): toques y notas de las
-- evaluaciones, Pasar lista, marcas de participación y de entregas. Si alguna ya estaba, se salta.
do $$ begin alter publication supabase_realtime add table libro_evaluacion_notas; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table libro_asistencia; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table libro_participacion_detalle; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table libro_entrega_detalle; exception when duplicate_object then null; end $$;
