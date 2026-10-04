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

// ── Pantallas de proyección (Modo Clase · Paso 2) ───────────────────────────
// Ubica la Pizarra en el proyector cuando el navegador lo permite (Window
// Management API: Chrome/Edge; en Brave, solo con los escudos bajos para el
// sitio, porque si no entrega datos de pantalla falsos). Sin la API o sin
// permiso, todo funciona como antes y se mueve a mano (Windows + Shift + flecha).
//
// La Pizarra se abre SIEMPRE como ventana emergente (sin barras): solo esas se
// pueden mover después. Destino: pantalla recordada en ESTE computador (por
// nombre); si no está, la que no es la del Planificador; si no, la no principal.
// El Planificador deja el destino en DEST_KEY y la Pizarra, al cargar, se mueve
// ahí si quedó en otra (cubre reabrir una ventana que ya existía).
// ↔ manda la Pizarra a la otra pantalla; ese computador recuerda la elección
// si la pantalla no es la principal.
(function () {
    const PANT_KEY = 'profe_pantalla_proyeccion';
    const DEST_KEY = 'profe_pantalla_destino';
    const CMD_KEY  = 'profe_pizarra_cmd';
    const hayAPI   = 'getScreenDetails' in window;

    const leer  = k => { try { return localStorage.getItem(k); } catch (_) { return null; } };
    const poner = (k, v) => { try { localStorage.setItem(k, v); } catch (_) {} };
    const misma = (a, b) => !!a && !!b && a.availLeft === b.availLeft && a.availTop === b.availTop
                          && a.availWidth === b.availWidth && a.availHeight === b.availHeight;

    async function permiso() {
        if (!hayAPI) return 'no';
        try { return (await navigator.permissions.query({ name: 'window-management' })).state; }
        catch (_) { return 'prompt'; }
    }
    async function detalles() {
        try { return await window.getScreenDetails(); } catch (_) { return null; }
    }
    // Pantallas válidas: Brave con escudos devuelve pantallas de tamaño 0.
    const validas = sd => (sd ? sd.screens.filter(s => s.availWidth > 0 && s.availHeight > 0) : []);

    function elegir(sd) {
        const lista = validas(sd);
        if (lista.length < 2) return null;
        const guardada = leer(PANT_KEY);
        return lista.find(s => guardada && s.label === guardada)
            || lista.find(s => !misma(s, sd.currentScreen))
            || lista.find(s => !s.isPrimary) || null;
    }
    function recordar(s) { if (s && !s.isPrimary && s.label) poner(PANT_KEY, s.label); }
    function moverA(s) {
        window.moveTo(s.availLeft, s.availTop);
        window.resizeTo(s.availWidth, s.availHeight);
    }
    const rect = s => ({ availLeft: s.availLeft, availTop: s.availTop, availWidth: s.availWidth, availHeight: s.availHeight });

    // Planificador: abre (o reutiliza) la ventana de proyección, en el proyector
    // si se puede. Las consultas son rápidas y no consumen el gesto del clic.
    async function abrir(url, nombre) {
        let dest = null, sd = null;
        const perm = await permiso();
        if (perm === 'granted') { sd = await detalles(); dest = elegir(sd); }
        if (dest) poner(DEST_KEY, JSON.stringify(rect(dest)));
        const r = dest || { availLeft: screen.availLeft || 0, availTop: screen.availTop || 0,
                            availWidth: screen.availWidth, availHeight: screen.availHeight };
        const feats = `popup,left=${r.availLeft},top=${r.availTop},width=${r.availWidth},height=${r.availHeight}`;
        const w = window.open(url, nombre, feats);
        // Rastro de la última decisión (lo muestra comun/diagnostico-pantallas.html).
        Proyeccion.ultimo = { permiso: perm, enIframe: window !== window.top,
            pantallas: validas(sd).map(s => `${s.label || '(sin nombre)'} ${s.availLeft},${s.availTop} ${s.availWidth}x${s.availHeight}${s.isPrimary ? ' principal' : ''}`),
            actual: sd && sd.currentScreen ? `${sd.currentScreen.availLeft},${sd.currentScreen.availTop}` : null,
            ventana: feats };
        if (!dest && await permiso() === 'prompt') detalles();   // pide permiso para la próxima vez
        return w;
    }

    // Planificador → Pizarra: intercambiar pantalla.
    function flip() { poner(CMD_KEY, JSON.stringify({ accion: 'flip', t: Date.now() })); }

    async function ejecutarFlip() {
        if (await permiso() !== 'granted') return;
        const sd = await detalles();
        const lista = validas(sd);
        if (lista.length < 2) return;
        if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch (_) {} }
        const i = lista.findIndex(s => misma(s, sd.currentScreen));
        const otra = lista[(i + 1) % lista.length];
        moverA(otra);
        recordar(otra);
        poner(DEST_KEY, JSON.stringify(rect(otra)));
    }
    async function ubicarAlAbrir() {
        if (!window.opener || await permiso() !== 'granted') return;
        let dest = null;
        try { dest = JSON.parse(leer(DEST_KEY) || 'null'); } catch (_) {}
        if (!dest) return;
        const sd = await detalles();
        if (sd && !misma(dest, sd.currentScreen)) moverA(dest);
    }
    function escucharEnPizarra() {
        window.addEventListener('storage', e => {
            if (e.key !== CMD_KEY || !e.newValue) return;
            try { if (JSON.parse(e.newValue).accion === 'flip') ejecutarFlip(); } catch (_) {}
        });
        ubicarAlAbrir();
    }

    window.Proyeccion = { hayAPI, permiso, abrir, flip, escucharEnPizarra };
})();
