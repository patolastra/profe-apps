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
    // Versión por edad del curso (decisión del PO): 1°–3° infantil, 4°–6° intermedia, el resto
    // (7°, 8°, talleres y Recreo) adolescente.
    function version(ctx) {
        const c = String(ctx || '').toUpperCase();
        if (['PRIMERO', 'SEGUNDO', 'TERCERO'].includes(c)) return 'infantil';
        if (['CUARTO', 'QUINTO', 'SEXTO'].includes(c)) return 'intermedia';
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
        capa.style.cssText = 'position:fixed;inset:0;z-index:9000;display:none;align-items:center;justify-content:center;background:#000';
        // Título arriba, del ancho de la imagen (4:3): el bloque mide ancho × (0,75 + 0,13) del ancho
        // y cabe entero en la pantalla; la letra se mide en % del ancho del bloque (cqw).
        const caja = document.createElement('div');
        caja.style.cssText = 'width:min(100vw, calc(100vh / 0.88));aspect-ratio:1 / 0.88;display:flex;flex-direction:column;container-type:inline-size';
        const titulo = document.createElement('div');
        titulo.style.cssText = 'height:13cqw;display:flex;align-items:center;justify-content:center;color:#fff;' +
            'font:800 7.9cqw/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.04em;white-space:nowrap';
        const img = document.createElement('img');
        img.alt = '';
        img.style.cssText = 'width:100%;height:75cqw;object-fit:cover;display:block';
        caja.append(titulo, img);
        capa.appendChild(caja);
        document.body.appendChild(capa);
        const pintar = a => {
            const ver = !!(a && a.sesionId === sesionId && DIAPOS[a.diapo]);
            if (ver) {
                img.src = new URL(`../comun/diapositivas/${a.diapo}-${a.version}.webp`, location.href).href;
                titulo.textContent = DIAPOS[a.diapo].titulo.toLocaleUpperCase('es');
            }
            capa.style.display = ver ? 'flex' : 'none';
            // Acuse para el Planificador: esta Pizarra sí la está mostrando.
            if (ver) { try { localStorage.setItem(KEY + '_ok', String(a.t)); } catch (_) {} }
        };
        onCambio(pintar);
        pintar(actual());
        // Esc la quita (antes que cualquier otro uso de la tecla en la Pizarra).
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && capa.style.display !== 'none') { e.preventDefault(); e.stopImmediatePropagation(); quitar(); }
        }, true);
    }

    // Planificador: ¿la Pizarra acusó recibo de la diapositiva puesta?
    function recibida() {
        const a = actual();
        try { return !!a && localStorage.getItem(KEY + '_ok') === String(a.t); } catch (_) { return false; }
    }

    window.Recurrentes = { DIAPOS, version, actual, poner, quitar, onCambio, capaEnPizarra, recibida };
})();
