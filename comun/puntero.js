// ═══════════════════════════════════════════════════════════════════════
// Puntero — punto láser rojo en la Pizarra (deuda CT, 2026-10-24)
// El profe señala algo en su pantalla (la letra del Entrenador, una diapositiva del Plan) y en
// la Pizarra aparece un punto rojo con estela corta en el mismo lugar, que se desvanece al dejar
// de mover el mouse. Se enciende con el botón 🔴 Puntero; el estado se comparte entre las
// pestañas de este computador. Las pantallas miden distinto: no se manda la posición del mouse
// sino dónde está relativo a lo señalado (un verso, una diapositiva), y el receptor la ubica en
// su propia pantalla. Canal 'profe-puntero' (misma computadora, sin internet).
//
// Uso:
//   Puntero.encendido() · Puntero.alternar([sí/no]) · Puntero.alCambiar(on => …)
//   Puntero.emisor(zona, ev => ({ donde, …datos }) | null)   → null = fuera de lo proyectado
//   Puntero.receptor(m => ({ x, y }) | null)                 → posición en esta pantalla
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const KEY = 'profe_puntero';
    const canal = 'BroadcastChannel' in window ? new BroadcastChannel('profe-puntero') : null;
    let on = false;
    try { on = localStorage.getItem(KEY) === '1'; } catch (_) {}
    const subs = new Set();
    const avisar = () => subs.forEach(f => { try { f(on); } catch (_) {} });

    function encendido() { return on; }
    function alternar(v) {
        on = v === undefined ? !on : !!v;
        try { localStorage.setItem(KEY, on ? '1' : '0'); } catch (_) {}
        if (!on) enviar({ fuera: true });
        avisar();
    }
    window.addEventListener('storage', e => { if (e.key === KEY) { on = e.newValue === '1'; avisar(); } });
    function alCambiar(f) { subs.add(f); f(on); }

    // ── Emisor ──────────────────────────────────────────────────────────
    const enviar = m => { try { canal?.postMessage({ tipo: 'puntero', ...m }); } catch (_) {} };
    function emisor(zona, ancla) {
        if (!zona) return;
        let ultimo = null, espera = 0, dentro = false;
        zona.addEventListener('mousemove', ev => {
            if (!on) return;
            ultimo = ev;
            if (espera) return;
            espera = setTimeout(() => {   // a lo más ~40 avisos por segundo
                espera = 0;
                const a = ancla(ultimo);
                if (a) { dentro = true; enviar(a); }
                else if (dentro) { dentro = false; enviar({ fuera: true }); }
            }, 25);
        });
        zona.addEventListener('mouseleave', () => { if (on && dentro) { dentro = false; enviar({ fuera: true }); } });
    }

    // ── Receptor y dibujo ───────────────────────────────────────────────
    function receptor(ubicar) {
        canal?.addEventListener('message', ev => {
            const m = ev.data;
            if (!m || m.tipo !== 'puntero') return;
            if (m.fuera) { ocultar(); return; }
            const p = ubicar(m);
            if (p) mostrar(p.x, p.y); else ocultar();
        });
    }
    const N = 6;                       // puntos de la estela
    let punto = null, estela = [], pasos = [], timer = 0;
    function asegurar() {
        if (punto) return;
        const css = document.createElement('style');
        css.textContent = `.pnt-punto, .pnt-estela { position: fixed; left: 0; top: 0; border-radius: 50%; pointer-events: none;
                z-index: 2147483000; opacity: 0; transition: opacity .25s; will-change: transform; }
            .pnt-punto { width: 2.4vh; height: 2.4vh; margin: -1.2vh 0 0 -1.2vh; background: #ff2a2a;
                box-shadow: 0 0 1.2vh .5vh rgba(255, 40, 40, .85), 0 0 .3vh .15vh #fff inset; }
            .pnt-estela { width: 1.6vh; height: 1.6vh; margin: -.8vh 0 0 -.8vh; background: rgba(255, 50, 50, .55); }`;
        document.head.appendChild(css);
        // Fuera del <body>: algunas páginas esconden todo lo que no es suyo en el body (la copia del Entrenador en la
        // Pizarra oculta "body > *" salvo la letra), y ahí el punto quedaba dibujado pero invisible.
        const raiz = document.documentElement;
        for (let i = 0; i < N; i++) {
            const e = document.createElement('div');
            e.className = 'pnt-estela';
            raiz.appendChild(e);
            estela.push(e);
        }
        punto = document.createElement('div');
        punto.className = 'pnt-punto';
        raiz.appendChild(punto);
    }
    function mostrar(x, y) {
        asegurar();
        pasos.unshift({ x, y });
        pasos.length = Math.min(pasos.length, N + 1);
        punto.style.transform = `translate(${x}px, ${y}px)`;
        punto.style.opacity = '1';
        estela.forEach((e, i) => {
            const p = pasos[i + 1];
            if (!p) { e.style.opacity = '0'; return; }
            e.style.transform = `translate(${p.x}px, ${p.y}px) scale(${1 - i / (N + 1)})`;
            e.style.opacity = String(0.6 * (1 - i / N));
        });
        clearTimeout(timer);
        timer = setTimeout(ocultar, 1500);   // quieto: se desvanece
    }
    function ocultar() {
        clearTimeout(timer);
        pasos = [];
        if (!punto) return;
        punto.style.opacity = '0';
        estela.forEach(e => { e.style.opacity = '0'; });
    }

    window.Puntero = { encendido, alternar, alCambiar, emisor, receptor };
})();
