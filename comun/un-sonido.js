// UnSonido (deuda FK): en el Workspace PC suena una sola pestaña a la vez, y la que suena se pinta de verde.
// Cada app (y cada app dentro de otra: Cajón en Ritmos, Metalófono en el Entrenador…) incluye esta pieza:
//   · detecta sola cuándo suena: <audio>/<video> reproduciendo, o sonidos de Web Audio (osciladores y
//     grabaciones que se ponen a sonar, incluido Tone.js);
//   · avisa al Workspace { tipo:'ws-sonando', sonando } (a la ventana de arriba de todo);
//   · obedece { tipo:'ws-callar' }: llama a lo que la app registró con UnSonido.alDetener(fn) (su propio stop,
//     así sus botones quedan bien), pausa sus <audio>/<video>, corta los sonidos que sigan y pasa la orden a
//     sus apps internas.
// Fuera del Workspace (abierta sola, celular, estudiantes) no hace nada.
//   UnSonido.alDetener(fn, estaSonando) → fn() detiene todo lo que suena en esta app; estaSonando() (opcional)
//                              dice si la app está sonando según su propio estado (su ▶/■). Con ella, la pieza le
//                              cree a la app y no a los sonidos sueltos: un stop que deja notas ya programadas, o
//                              tocar una placa suelta, no dejan la pestaña en verde (se revisa cada medio segundo)
//   UnSonido.suena(cosa, v)  → para lo que el navegador no avisa (reproductores propios): v = true al empezar,
//                              false al parar
//   UnSonido.sonando         → true si esta ventana está sonando
(function () {
    if (window.UnSonido) return;
    const enWorkspace = (() => { try { return window.top !== window; } catch (_) { return true; } })();
    const detenedores = [];
    const fuentes = new Set();          // sonidos de Web Audio que aún suenan
    const propios = new Set();          // reproductores propios que avisan con suena()
    const estados = [];                 // estaSonando() de la app
    let sonando = false, timerSilencio = null;
    // Entre golpes de un metrónomo o un ritmo no hay sonido: se espera antes de decir "me callé".
    const ESPERA_SILENCIO = 2500;

    function medios() {
        return [...document.querySelectorAll('audio, video')];
    }
    function medioSonando() {
        return medios().some(m => !m.paused && !m.ended);
    }
    function avisar(v) {
        if (v === sonando) return;
        sonando = v;
        if (!enWorkspace) return;
        try { window.top.postMessage({ tipo: 'ws-sonando', sonando: v }, '*'); } catch (_) {}
    }
    function appSonando() {
        return estados.some(f => { try { return !!f(); } catch (_) { return false; } });
    }
    function algoSuena() {
        if (medioSonando() || propios.size) return true;
        return estados.length ? appSonando() : fuentes.size > 0;
    }
    function revisar() {
        if (algoSuena()) {
            clearTimeout(timerSilencio); timerSilencio = null;
            avisar(true);
        } else if (sonando && estados.length) {
            avisar(false);              // la app dice que paró: se le cree al tiro
        } else if (sonando && !timerSilencio) {
            timerSilencio = setTimeout(() => {
                timerSilencio = null;
                if (!algoSuena()) avisar(false);
            }, ESPERA_SILENCIO);
        }
    }

    // ── <audio> / <video>: el navegador avisa al empezar y al parar ──
    ['play', 'playing'].forEach(ev => document.addEventListener(ev, revisar, true));
    ['pause', 'ended', 'emptied'].forEach(ev => document.addEventListener(ev, revisar, true));

    // ── Web Audio: cada sonido que empieza (oscilador, grabación) se anota hasta que termina ──
    // (las grabaciones —AudioBufferSourceNode— tienen su propio start, por eso se cubren todas las clases)
    function anotar(nodo) {
        try {
            // No cuentan: lo marcado como mudo (p. ej. el ruido de la hoja del Cuaderno) ni las señales de
            // control que quedan encendidas para siempre (ConstantSource, que usa Tone.js por dentro)
            const control = window.ConstantSourceNode && nodo instanceof window.ConstantSourceNode;
            if (nodo.__unSonidoMudo || control || fuentes.has(nodo)) return;
            fuentes.add(nodo);
            nodo.addEventListener('ended', () => { fuentes.delete(nodo); revisar(); }, { once: true });
            revisar();
        } catch (_) {}
    }
    ['AudioScheduledSourceNode', 'AudioBufferSourceNode', 'OscillatorNode'].forEach(nombre => {
        const C = window[nombre];
        if (!C || !Object.prototype.hasOwnProperty.call(C.prototype, 'start')) return;
        const start0 = C.prototype.start;
        if (start0.__unSonido) return;
        const nuevo = function (...args) {
            const r = start0.apply(this, args);
            anotar(this);
            return r;
        };
        nuevo.__unSonido = true;
        C.prototype.start = nuevo;
    });

    function callar() {
        detenedores.forEach(fn => { try { fn(); } catch (e) { console.warn('UnSonido', e); } });
        medios().forEach(m => { try { if (!m.paused) m.pause(); } catch (_) {} });
        fuentes.forEach(f => { try { if (f instanceof AudioNode) f.stop(); } catch (_) {} });
        fuentes.clear();
        propios.clear();
        // Las apps internas (iframes) también se callan
        for (let i = 0; i < window.frames.length; i++) {
            try { window.frames[i].postMessage({ tipo: 'ws-callar' }, '*'); } catch (_) {}
        }
        clearTimeout(timerSilencio); timerSilencio = null;
        avisar(false);
    }
    window.addEventListener('message', e => {
        if (e.data && e.data.tipo === 'ws-callar') callar();
    });
    // Al cerrarse o recargarse la página deja de sonar
    window.addEventListener('pagehide', () => avisar(false));

    window.UnSonido = {
        alDetener(fn, estaSonando) {
            if (typeof fn === 'function') detenedores.push(fn);
            if (typeof estaSonando === 'function') {
                if (!estados.length && enWorkspace) setInterval(revisar, 500);
                estados.push(estaSonando);
            }
        },
        suena(cosa, v) { if (v) propios.add(cosa); else propios.delete(cosa); revisar(); },
        get sonando() { return sonando; },
        callar,
    };
})();
