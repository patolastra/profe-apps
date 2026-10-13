// Fecha en la Pizarra (deuda BL): franja arriba con la fecha de la clase, para que los cursos
// pequeños la copien en el cuaderno. Letra ligada (Playwrite CL), imprenta (Andika) o ambas,
// una bajo la otra; a la izquierda o a la derecha; "Lunes 13/10/26" o "Lunes 13 - 10 - 26".
// Le hace espacio a la diapositiva (no la tapa). Se maneja con 📅 en el Planificador (clase en
// curso) y se recuerda por curso en este equipo (localStorage, como las recurrentes: Planificador
// y Pizarra van en el mismo computador). Fuentes guardadas en comun/fuentes/ (sin internet).
(function () {
    const KEY = 'profe_fecha_pizarra';
    const BASE = { on: false, formato: 'barra', letra: 'ligada', lado: 'izq' };
    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const DIR = new URL('fuentes/', document.currentScript.src).href;

    const css = document.createElement('style');
    css.textContent = `
    @font-face { font-family: 'Fecha Ligada'; src: url('${DIR}playwrite-cl.woff2') format('woff2'); font-display: swap; }
    @font-face { font-family: 'Fecha Imprenta'; src: url('${DIR}andika-latin.woff2') format('woff2'); font-display: swap; }
    .fp-ligada { font-family: 'Fecha Ligada', cursive; }
    .fp-imprenta { font-family: 'Fecha Imprenta', system-ui, sans-serif; }
    #fecha-franja { flex-shrink: 0; display: flex; flex-direction: column; gap: .4vh; padding: 1.2vh 4vw .6vh;
        background: var(--slide-bg, #fff); color: var(--slide-h1, #0f172a); line-height: 1.25; white-space: nowrap; }
    #fecha-franja[hidden] { display: none; }
    #fecha-franja.der { align-items: flex-end; }
    #fecha-franja.izq { align-items: flex-start; }
    #fecha-franja > div { font-size: 7.5vh; }`;
    document.head.appendChild(css);

    const leer = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) { return {}; } };
    function config(ctx) { return { ...BASE, ...(leer()[String(ctx || '').toUpperCase()] || {}) }; }
    const oyentes = [];
    function avisar() { oyentes.forEach(fn => { try { fn(); } catch (_) {} }); }
    function guardar(ctx, cambios) {
        const todo = leer();
        const k = String(ctx || '').toUpperCase();
        todo[k] = { ...config(k), ...cambios };
        try { localStorage.setItem(KEY, JSON.stringify(todo)); } catch (_) {}
        avisar();
        return todo[k];
    }
    function onCambio(fn) { oyentes.push(fn); }
    window.addEventListener('storage', e => { if (e.key === KEY) avisar(); });

    // "Lunes 13/10/26" · "Lunes 13 - 10 - 26" (día y mes sin cero adelante, como se escribe a mano)
    function texto(fechaISO, formato) {
        const d = new Date(String(fechaISO).slice(0, 10) + 'T12:00:00');
        const p = [d.getDate(), d.getMonth() + 1, String(d.getFullYear()).slice(2)];
        return `${DIAS[d.getDay()]} ${formato === 'guion' ? p.join(' - ') : p.join('/')}`;
    }

    // Las dos letras del mismo ancho (DECISIÓN del PO): a igual tamaño la ligada sale bastante más
    // grande que la imprenta; se mide el texto en ambas y cada una se escala al ancho promedio, así
    // quedan iguales y justo entremedio. Igual con una sola letra (mismo tamaño que tendría junto a la otra).
    const REF_VH = { sola: 8, ambas: 6.8 };
    const FAM = { ligada: "'Fecha Ligada'", imprenta: "'Fecha Imprenta'" };
    let lienzo = null;
    async function tamanos(t, ref) {
        try { await Promise.all(Object.values(FAM).map(f => document.fonts.load(`100px ${f}`, t))); } catch (_) {}
        const ctx = (lienzo ||= document.createElement('canvas').getContext('2d'));
        const ancho = f => { ctx.font = `100px ${f}`; return ctx.measureText(t).width || 1; };
        const wL = ancho(FAM.ligada), wI = ancho(FAM.imprenta), prom = (wL + wI) / 2;
        return { ligada: ref * prom / wL, imprenta: ref * prom / wI };
    }

    // Pizarra: franja entre el encabezado y el área de diapositivas.
    function enPizarra(ctx, fechaISO) {
        const area = document.getElementById('slide-area');
        if (!area || !fechaISO) return;
        let f = document.getElementById('fecha-franja');
        if (!f) { f = document.createElement('div'); f.id = 'fecha-franja'; area.parentNode.insertBefore(f, area); }
        const pintar = () => {
            const c = config(ctx);
            const antes = f.hidden;
            f.hidden = !c.on;
            f.className = (c.lado === 'der' ? 'der' : 'izq') + (c.letra === 'ambas' ? ' ambas' : '');
            const t = texto(fechaISO, c.formato);
            const lineas = c.letra === 'ambas' ? ['ligada', 'imprenta'] : [c.letra === 'imprenta' ? 'imprenta' : 'ligada'];
            f.innerHTML = '';
            const els = lineas.map(l => { const s = document.createElement('div'); s.className = 'fp-' + l; s.textContent = t; f.appendChild(s); return s; });
            // La diapositiva se reajusta al nuevo alto (también cuando la letra queda con su tamaño final).
            const reajustar = () => window.dispatchEvent(new Event('resize'));
            reajustar();
            if (antes !== f.hidden) setTimeout(reajustar, 50);
            const yo = ++pintar.n;
            tamanos(t, lineas.length > 1 ? REF_VH.ambas : REF_VH.sola).then(tm => {
                if (yo !== pintar.n) return;
                els.forEach((el, i) => { el.style.fontSize = tm[lineas[i]].toFixed(2) + 'vh'; });
                reajustar();
            });
        };
        pintar.n = 0;
        onCambio(pintar);
        pintar();
    }

    window.FechaPizarra = { config, guardar, onCambio, texto, enPizarra };
})();
