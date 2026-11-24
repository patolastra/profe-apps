// Registro (deuda JM): anota en el equipo lo que pasa con el sonido y con la página, para entender después por qué
// algo dejó de sonar (p. ej. el Entrenador dentro del Plan al minimizar o cambiar de ventana).
// Cada página guarda su propia lista en localStorage ('profe_reg:<página>:<id>', 2 horas); Registro.texto() las junta.
// Anota solo: ocultar / mostrar, foco, congelar / reanudar, pagehide / pageshow; play, pause (y quién lo pidió),
// ended, waiting, stalled, error de <audio>/<video>; AudioContext (creado, cambios de estado, suspend / close con
// quién); ws-callar recibido; iframes que cambian de dirección o se quitan; errores; y mientras suena, un pulso cada
// 10 s con el tiempo del audio y del AudioContext (⚠ si no avanzó).
//   Registro.anotar(evento, texto)  → una línea más
//   Registro.texto(minutos = 10)    → las líneas de todas las páginas de los últimos minutos, en orden
// Debe cargarse temprano (antes de dos-grabaciones.js y un-sonido.js) para alcanzar a ver los AudioContext.
(function () {
    if (window.Registro) return;
    const PREF = 'profe_reg:', DURA = 2 * 3600e3, MAX = 400;
    const q = new URLSearchParams(location.search);
    const carpeta = (location.pathname.split('/').slice(-2, -1)[0] || '').toUpperCase();
    const NOMBRES = { PC: 'Workspace', PORTAL: 'Plan', REPERTORIO: q.has('mini') || q.has('practicar') || q.has('espejo') ? 'Entrenador' : 'Biblioteca' };
    const pagina = (NOMBRES[carpeta] || carpeta || 'raíz')
        + ['mini', 'pizarra', 'espejo', 'movil'].filter(k => q.get(k) === '1').map(k => '·' + k).join('');
    const clave = PREF + pagina + ':' + Math.random().toString(36).slice(2, 6);
    let lista = [], timer = null;

    function guardar() {
        clearTimeout(timer); timer = null;
        const lim = Date.now() - DURA;
        lista = lista.filter(e => e[0] >= lim).slice(-MAX);
        try { localStorage.setItem(clave, JSON.stringify(lista)); } catch (_) {}
    }
    function anotar(ev, txt) {
        lista.push([Date.now(), ev, String(txt || '').slice(0, 220)]);
        if (!timer) timer = setTimeout(guardar, 600);
    }
    // Las listas viejas de páginas ya cerradas se borran
    try {
        const lim = Date.now() - DURA;
        Object.keys(localStorage).filter(k => k.startsWith(PREF)).forEach(k => {
            try { const l = JSON.parse(localStorage.getItem(k) || '[]'); if (!l.length || l[l.length - 1][0] < lim) localStorage.removeItem(k); }
            catch (_) { localStorage.removeItem(k); }
        });
    } catch (_) {}

    const hora = t => { const d = new Date(t); return d.toTimeString().slice(0, 8) + '.' + String(d.getMilliseconds()).padStart(3, '0'); };
    function texto(min = 10, maxLineas = 250) {
        guardar();
        const desde = Date.now() - min * 60e3, todo = [];
        try {
            Object.keys(localStorage).filter(k => k.startsWith(PREF)).forEach(k => {
                const pag = k.slice(PREF.length).replace(/:[^:]*$/, '');
                try { JSON.parse(localStorage.getItem(k) || '[]').forEach(e => { if (e[0] >= desde) todo.push([e[0], pag, e[1], e[2]]); }); } catch (_) {}
            });
        } catch (_) {}
        todo.sort((a, b) => a[0] - b[0]);
        return todo.slice(-maxLineas).map(e => `${hora(e[0])} ${e[1]} ${e[2]}${e[3] ? ' ' + e[3] : ''}`).join('\n');
    }

    // Quién pidió algo: las funciones de la pila (nombre:línea), sin las de esta pieza
    function quien() {
        const s = (new Error().stack || '').split('\n').slice(1);
        const out = [];
        for (const l of s) {
            if (/registro\.js/.test(l)) continue;
            const m = l.match(/at (?:async )?([^\s(]+)?\s*\(?(?:.*\/)?([^/:]+):(\d+):\d+\)?/);
            if (!m) continue;
            out.push((m[1] && m[1] !== '<anonymous>' ? m[1].replace(/^(HTMLMediaElement|Object|Window)\./, '') : '·') + '@' + m[2].replace(/\?.*$/, '') + ':' + m[3]);
            if (out.length >= 5) break;
        }
        return out.length ? '← ' + out.join(' < ') : '';
    }

    // ── La página ──
    document.addEventListener('visibilitychange', () => { anotar(document.hidden ? 'oculta' : 'visible'); if (document.hidden) guardar(); });
    window.addEventListener('focus', () => anotar('foco'));
    window.addEventListener('blur', () => anotar('sin foco'));
    document.addEventListener('freeze', () => { anotar('congelada'); guardar(); });
    document.addEventListener('resume', () => anotar('reanudada'));
    window.addEventListener('pagehide', e => { anotar('pagehide', e.persisted ? '(queda en caché)' : ''); guardar(); });
    window.addEventListener('pageshow', e => anotar('pageshow', e.persisted ? '(desde caché)' : ''));
    window.addEventListener('error', e => anotar('error', `${e.message || ''} ${(e.filename || '').split('/').pop()}:${e.lineno || ''}`));
    window.addEventListener('unhandledrejection', e => anotar('promesa rechazada', String(e.reason?.message || e.reason || '')));
    window.addEventListener('message', e => {
        if (e.data && e.data.tipo === 'ws-callar') anotar('ws-callar recibido', e.source === window.parent ? 'de arriba' : '');
    });

    // ── <audio> / <video> ──
    const desc = m => `<${m.tagName.toLowerCase()}> ${(m.currentTime || 0).toFixed(1)}s${m.muted ? ' mudo' : ''}${m.volume < 1 ? ' vol ' + m.volume.toFixed(2) : ''} ${(m.currentSrc || m.src || '').split('/').pop().slice(0, 40)}`;
    const P = window.HTMLMediaElement && HTMLMediaElement.prototype;
    if (P && !P.pause.__reg) {
        const pause0 = P.pause, play0 = P.play;
        P.pause = function () { if (!this.paused) { this.__regPedida = Date.now(); anotar('pause()', desc(this) + ' ' + quien()); } return pause0.apply(this, arguments); };
        P.play = function () { if (this.paused) anotar('play()', desc(this) + ' ' + quien()); const r = play0.apply(this, arguments); if (r && r.catch) r.catch(err => anotar('play falló', `${desc(this)} ${err && err.name}`)); return r; };
        P.pause.__reg = true;
    }
    document.addEventListener('pause', e => {
        const m = e.target; if (!(m instanceof HTMLMediaElement)) return;
        const pedida = m.__regPedida && Date.now() - m.__regPedida < 1000;
        if (!pedida && !m.ended) anotar('pause', desc(m) + ' ⚠ sin pause() (lo pausó el navegador)');
    }, true);
    ['ended', 'waiting', 'stalled', 'error', 'emptied'].forEach(ev => document.addEventListener(ev, e => {
        const m = e.target; if (m instanceof HTMLMediaElement) anotar(ev, desc(m) + (ev === 'error' && m.error ? ' código ' + m.error.code : ''));
    }, true));

    // ── AudioContext ──
    const contextos = [];
    ['AudioContext', 'webkitAudioContext'].forEach(n => {
        const C = window[n];
        if (!C || C.__reg) return;
        const R = class extends C {
            constructor(...a) {
                super(...a);
                const i = contextos.push(this);
                this.__regN = i;
                anotar('AudioContext creado', `#${i} ${this.state} ${quien()}`);
                this.addEventListener('statechange', () => anotar('AudioContext', `#${i} → ${this.state}`));
            }
        };
        R.__reg = true;
        window[n] = R;
        const Pr = C.prototype;
        ['suspend', 'close'].forEach(f => {
            const f0 = Pr[f]; if (!f0) return;
            Pr[f] = function () { anotar(`AudioContext.${f}()`, `#${this.__regN || '?'} ${quien()}`); return f0.apply(this, arguments); };
        });
    });

    // ── iframes que cambian de dirección o se quitan ──
    const corto = u => String(u || '').replace(/^.*?\/([A-Za-z-]+\/index\.html)/, '$1').replace(/[?&]v=\d+/, '').slice(0, 120);
    function observar() {
        new MutationObserver(ms => ms.forEach(m => {
            if (m.type === 'attributes' && m.target.tagName === 'IFRAME') anotar('iframe → ', corto(m.target.getAttribute('src')) + (m.target.id ? ` #${m.target.id}` : ''));
            if (m.type === 'childList') m.removedNodes.forEach(n => {
                if (n.nodeType !== 1) return;
                const fs = n.tagName === 'IFRAME' ? [n] : [...n.querySelectorAll('iframe')];
                fs.forEach(f => anotar('iframe quitado', corto(f.getAttribute('src'))));
            });
        })).observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['src'] });
    }
    observar();

    // ── Pulso mientras suena (cada 10 s) ──
    const antes = new Map();
    setInterval(() => {
        const partes = [];
        document.querySelectorAll('audio, video').forEach((m, i) => {
            if (m.paused) { antes.delete(m); return; }
            const t = m.currentTime, a = antes.get(m);
            partes.push(`${m.tagName.toLowerCase()}${i} ${t.toFixed(1)}s${a != null && Math.abs(t - a) < 0.05 ? ' ⚠ quieto' : ''}${m.muted ? ' mudo' : ''}`);
            antes.set(m, t);
        });
        contextos.forEach(c => {
            if (c.state === 'closed') return;
            const t = c.currentTime, a = antes.get(c);
            if (c.state !== 'running' && a == null) return;
            partes.push(`ctx#${c.__regN} ${c.state} ${t.toFixed(1)}s${c.state === 'running' && a != null && Math.abs(t - a) < 0.05 ? ' ⚠ quieto' : ''}`);
            antes.set(c, t);
        });
        const us = window.UnSonido && window.UnSonido.sonando;
        const medio = [...document.querySelectorAll('audio, video')].some(m => !m.paused);
        if (partes.length && (us || medio)) anotar('pulso', partes.join(' · ') + (us ? ' · suena' : '') + (document.hidden ? ' · oculta' : ''));
    }, 10000);

    anotar('abre', corto(location.href));
    window.Registro = { anotar, texto, pagina };
})();
