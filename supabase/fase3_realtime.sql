-- Plan, Materiales y Biblioteca al instante entre equipos (deuda BE, Fase 3, 2026-10-13).
-- Si alguna tabla ya estaba, se salta sin error.
do $$ begin alter publication supabase_realtime add table presentaciones; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table materiales_contexto; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table repertorio_canciones; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table repertorio_assets; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table repertorio_cancion_contextos; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table repertorio_sesiones_entrenamiento; exception when duplicate_object then null; end $$;
