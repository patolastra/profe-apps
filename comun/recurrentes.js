// Diapositivas recurrentes de la clase (deuda AX): imágenes que el profe dispara desde el
// Planificador y que la Pizarra muestra encima de su diapositiva hasta que se quitan.
// Estado compartido en localStorage (misma computadora, sin internet): { sesionId, diapo, version } | null.
// La Pizarra también la quita con Esc; el Planificador se entera y apaga su botón.
// No toca el tiempo perdido: su contador (#clase-perdido) se dibuja encima de esta capa.
// ⏱ Tiempo libre (deuda BZ): { diapo: 'libre', fin, min } muestra "TIEMPO LIBRE" y la cuenta regresiva (sin
// imagen por ahora); al llegar a cero pasa sola a 🤫 Silencio y atención con `trasLibre`, que se quita sola
// cuando el profe proyecta otra cosa en la Pizarra (alProyectar). No está en el menú 🔔: se lanza desde la actividad.
(function () {
    const KEY = 'profe_recurrente';
    const DIAPOS = {
        silencio: { ico: '🤫', titulo: 'Silencio y atención' },
        libre:    { ico: '⏱', titulo: 'Tiempo libre', sinMenu: true, sinImagen: true },
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
    // extra: datos propios de la diapositiva (Tiempo libre: { fin, min }; Silencio tras él: { trasLibre }).
    function poner(sesionId, diapo, ctx, extra) {
        guardar({ ...(extra || {}), sesionId, diapo, version: version(ctx), t: Date.now() });
    }
    function guardar(a) {
        try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (_) {}
        avisar();
    }

    // ── Tiempo libre ──
    function restanteMs() {
        const a = actual();
        return a && a.diapo === 'libre' ? Math.max(0, (a.fin || 0) - Date.now()) : null;
    }
    // Al llegar a cero (lo revisa cualquier ventana abierta: Planificador o Pizarra) pasa a Silencio y atención.
    function revisarLibre() {
        const a = actual();
        if (a && a.diapo === 'libre' && Date.now() >= (a.fin || 0))
            guardar({ sesionId: a.sesionId, diapo: 'silencio', version: a.version, trasLibre: true, t: Date.now() });
    }
    setInterval(revisarLibre, 400);
    function sumarLibre(ms) {
        const a = actual();
        if (a && a.diapo === 'libre') guardar({ ...a, fin: Math.max(Date.now(), a.fin || 0) + ms });
    }
    function terminarLibre() {
        const a = actual();
        if (a && a.diapo === 'libre') { guardar({ ...a, fin: Date.now() }); revisarLibre(); }
    }
    // El profe proyectó otra cosa en la Pizarra: el Silencio que dejó el Tiempo libre se va solo.
    function alProyectar() {
        const a = actual();
        if (a && a.trasLibre) quitar();
    }
    const reloj = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
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
        // Título arriba, del ancho de la imagen (4:3): el bloque mide ancho × (0,75 + 0,13) del ancho
        // y cabe entero en la pantalla; la letra se mide en % del ancho del bloque (cqw).
        const caja = document.createElement('div');
        caja.style.cssText = 'width:min(100vw, calc(100vh / 0.88));aspect-ratio:1 / 0.88;display:flex;flex-direction:column;container-type:inline-size';
        const titulo = document.createElement('div');
        titulo.style.cssText = 'height:13cqw;display:flex;align-items:center;justify-content:center;color:#000;' +
            'font:800 7.9cqw/1 system-ui,-apple-system,"Segoe UI",sans-serif;letter-spacing:.04em;white-space:nowrap';
        const img = document.createElement('img');
        img.alt = '';
        img.style.cssText = 'width:100%;height:75cqw;object-fit:cover;display:block';
        // Cuenta regresiva del Tiempo libre, en el lugar de la imagen.
        const cuenta = document.createElement('div');
        cuenta.style.cssText = 'width:100%;height:75cqw;display:none;align-items:center;justify-content:center;color:#000;' +
            'font:800 30cqw/1 system-ui,-apple-system,"Segoe UI",sans-serif;font-variant-numeric:tabular-nums';
        caja.append(titulo, img, cuenta);
        capa.appendChild(caja);
        document.body.appendChild(capa);
        let tic = null;
        const pintar = a => {
            const ver = !!(a && a.sesionId === sesionId && DIAPOS[a.diapo]);
            const sinImg = ver && DIAPOS[a.diapo].sinImagen;
            if (ver) {
                if (!sinImg) img.src = new URL(`../comun/diapositivas/${a.diapo}-${a.version}.webp`, location.href).href;
                titulo.textContent = DIAPOS[a.diapo].titulo.toLocaleUpperCase('es');
            }
            img.style.display = sinImg ? 'none' : 'block';
            cuenta.style.display = sinImg ? 'flex' : 'none';
            // Tiempo libre: letrero más grande y el reloj aún más (siempre manda el reloj); mismo bloque 4:3 + título.
            titulo.style.height = sinImg ? '22cqw' : '13cqw';
            titulo.style.fontSize = sinImg ? '11cqw' : '7.9cqw';
            cuenta.style.height = sinImg ? '66cqw' : '75cqw';
            cuenta.style.fontSize = sinImg ? '36cqw' : '30cqw';
            clearInterval(tic); tic = null;
            if (ver && a.diapo === 'libre') {
                const paso = () => { const r = restanteMs(); if (r !== null) cuenta.textContent = reloj(r); };
                paso(); tic = setInterval(paso, 200);
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

    window.Recurrentes = { DIAPOS, version, actual, poner, quitar, onCambio, capaEnPizarra, recibida,
                           restanteMs, sumarLibre, terminarLibre, alProyectar, reloj };
})();
