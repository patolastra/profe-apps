// ── Clase en vivo (Modo Clase · Paso 1) ─────────────────────────────────────
// Estado compartido de la clase en curso entre Planificador, Pizarra, Libro,
// Entrenador y Workspace. Fuente de verdad: localStorage (sobrevive a cierres y
// recargas, funciona sin internet). Los tiempos se derivan de marcas de tiempo,
// no de contadores, así que cerrar y reabrir no pierde nada.
//
// Estado (clave CLASE_KEY):
//   { sesionId, ctx, fecha, inicio, perdidoAcumMs, perdidoDesde|null, episodios }
// Registros terminados aún no subidos a Supabase (clave PEND_KEY): array de filas
// listas para `clase_tiempos`. Los sube el Planificador (es quien tiene `sb`).
//
// Atajo global: Ctrl + Shift + Espacio = iniciar/detener tiempo perdido. Se
// captura antes que los atajos propios de cada app (Espacio avanza/reproduce).
(function () {
    const CLASE_KEY = 'profe_clase_activa';
    const PEND_KEY  = 'profe_clase_pendientes';
    const oyentes   = [];

    function leer(k, def) {
        try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
        catch (_) { return def; }
    }
    function escribir(k, v) {
        try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); }
        catch (_) {}
    }
    function avisar() { const st = get(); oyentes.forEach(fn => { try { fn(st); } catch (_) {} }); }

    function get() { return leer(CLASE_KEY, null); }

    function comenzar({ sesionId, ctx, fecha }) {
        if (get()) return get();
        escribir(CLASE_KEY, {
            sesionId, ctx: ctx || '', fecha: fecha || '',
            inicio: Date.now(), perdidoAcumMs: 0, perdidoDesde: null, episodios: 0,
        });
        avisar();
        return get();
    }

    function togglePerdido() {
        const st = get();
        if (!st) return null;
        const ahora = Date.now();
        if (st.perdidoDesde) {
            st.perdidoAcumMs += ahora - st.perdidoDesde;
            st.perdidoDesde = null;
        } else {
            st.perdidoDesde = ahora;
            st.episodios += 1;
        }
        escribir(CLASE_KEY, st);
        avisar();
        return st;
    }

    function tiempoClaseMs(st)   { return st ? Date.now() - st.inicio : 0; }
    function tiempoPerdidoMs(st) {
        if (!st) return 0;
        return st.perdidoAcumMs + (st.perdidoDesde ? Date.now() - st.perdidoDesde : 0);
    }

    // Termina la clase: deja la fila en la cola de pendientes y limpia el estado.
    function terminar() {
        const st = get();
        if (!st) return null;
        const fin = Date.now();
        const fila = {
            sesion_id:          st.sesionId,
            inicio:             new Date(st.inicio).toISOString(),
            fin:                new Date(fin).toISOString(),
            tiempo_clase_seg:   Math.round((fin - st.inicio) / 1000),
            tiempo_perdido_seg: Math.round((st.perdidoAcumMs + (st.perdidoDesde ? fin - st.perdidoDesde : 0)) / 1000),
            episodios_perdido:  st.episodios,
        };
        const pend = leer(PEND_KEY, []);
        pend.push(fila);
        escribir(PEND_KEY, pend);
        escribir(CLASE_KEY, null);
        avisar();
        return fila;
    }

    // Sube a Supabase los registros pendientes. Devuelve cuántos quedan sin subir.
    async function subirPendientes(sb) {
        const pend = leer(PEND_KEY, []);
        if (!pend.length || !sb) return pend.length;
        const quedan = [];
        for (const fila of pend) {
            try {
                const { error } = await sb.from('clase_tiempos').insert(fila);
                if (error) quedan.push(fila);
            } catch (_) { quedan.push(fila); }
        }
        escribir(PEND_KEY, quedan.length ? quedan : null);
        return quedan.length;
    }

    function fmt(ms) {
        const s = Math.max(0, Math.floor(ms / 1000));
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
        const p = n => String(n).padStart(2, '0');
        return h ? `${h}:${p(m)}:${p(ss)}` : `${p(m)}:${p(ss)}`;
    }

    function onCambio(fn) { oyentes.push(fn); }

    // Otras ventanas/pestañas (mismo sitio) escriben → `storage` avisa aquí.
    window.addEventListener('storage', e => { if (e.key === CLASE_KEY) avisar(); });

    // Atajo global en fase de captura: gana a los atajos propios (Espacio = avanzar).
    window.addEventListener('keydown', e => {
        if (!(e.ctrlKey && e.shiftKey) || (e.code !== 'Space' && e.key !== ' ')) return;
        if (!get()) return;
        e.preventDefault();
        e.stopPropagation();
        if (!e.repeat) togglePerdido();
    }, true);

    window.ClaseVivo = {
        get, comenzar, togglePerdido, terminar, subirPendientes,
        tiempoClaseMs, tiempoPerdidoMs, fmt, onCambio,
    };
})();
