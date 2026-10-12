// Diapositivas recurrentes de la clase (deuda AX): imágenes que el profe dispara desde el
// Planificador y que la Pizarra muestra encima de su diapositiva hasta que se quitan.
// Estado compartido en localStorage (misma computadora, sin internet): { sesionId, diapo, version } | null.
// La Pizarra también la quita con Esc; el Planificador se entera y apaga su botón.
// No toca el tiempo perdido: su contador (#clase-perdido) se dibuja encima de esta capa.
(function () {
    const KEY = 'profe_recurrente';
    const DIAPOS = {
        silencio: { ico: '🤫', titulo: 'Silencio y atención' },
    };
    // Versión por edad del curso (decisión del PO): 1°–2° infantil, 3°–5° intermedia, el resto adolescente.
    function version(ctx) {
        const c = String(ctx || '').toUpperCase();
        if (['PRIMERO', 'SEGUNDO'].includes(c)) return 'infantil';
        if (['TERCERO', 'CUARTO', 'QUINTO'].includes(c)) return 'intermedia';
        return 'adolescente';
    }
    function actual() {
        try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (_) { return null; }
    }
    const oyentes = [];
    function avisar() { const a = actual(); oyentes.forEach(fn => { try { fn(a); } catch (_) {} }); }
    function poner(sesionId, diapo, ctx) {
        try { localStorage.setItem(KEY, JSON.stringify({ sesionId, diapo, version: version(ctx), t: Date.now() })); } catch (_) {}
        avisar();
    }
    function quitar() {
        try { localStorage.removeItem(KEY); } catch (_) {}
        avisar();
    }
    function onCambio(fn) { oyentes.push(fn); }
    window.addEventListener('storage', e => { if (e.key === KEY) avisar(); });

    // Pizarra: capa a pantalla completa con la imagen de la sesión que muestra.
    function capaEnPizarra(sesionId) {
        const capa = document.createElement('div');
        capa.id = 'recurrente-capa';
        capa.style.cssText = 'position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;background:#fff';
        const img = document.createElement('img');
        img.alt = '';
        img.style.cssText = 'max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain';
        capa.appendChild(img);
        document.body.appendChild(capa);
        const pintar = a => {
            const ver = !!(a && a.sesionId === sesionId && DIAPOS[a.diapo]);
            if (ver) img.src = new URL(`../comun/diapositivas/${a.diapo}-${a.version}.png`, location.href).href;
            capa.style.display = ver ? 'flex' : 'none';
        };
        onCambio(pintar);
        pintar(actual());
        // Esc la quita (antes que cualquier otro uso de la tecla en la Pizarra).
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && capa.style.display !== 'none') { e.preventDefault(); e.stopImmediatePropagation(); quitar(); }
        }, true);
    }

    window.Recurrentes = { DIAPOS, version, actual, poner, quitar, onCambio, capaEnPizarra };
})();
