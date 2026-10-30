// GrabacionTono (deuda ES): una grabación con el tono cambiado (semitonos) y más lenta sin cambiar el tono,
// con SoundTouch (la misma biblioteca que el Pitch del Entrenador). Sabe en qué segundo de la grabación va lo
// que se escucha, para dibujar y programar notas a la par.
//
//   const g = GrabacionTono.crear(ctx, destino);
//   await g.cargar(url);                    // descarga y decodifica (una vez por url) y la deja elegida
//   g.precargar(url)                        // deja lista otra grabación (Melodía / Karaoke) sin elegirla
//   await g.cambiar(url)                    // sonando, pasa a la otra grabación en la misma muestra (deuda ET)
//   await g.tocar(desdeSeg, semitonos, velocidad);   // velocidad 1 = normal, 0.5 = mitad
//   g.oido()        → segundo de la grabación que suena ahora (null si no suena)
//   g.aCtx(seg)     → hora del AudioContext en que sonará ese segundo de la grabación
//   g.detener() · g.duracion · g.sonando · g.alTerminar = fn
// Usada por el Editor de Arreglos (ARREGLO/) y el Piano del estudiante (PIANO/).
(function () {
    let lib = null;
    async function cargarLib() {
        if (!lib) lib = await import('https://cdn.jsdelivr.net/npm/soundtouchjs@0.1.30/+esm');
        return lib;
    }
    const BLOQUE = 4096;

    function crear(ctx, destino) {
        const g = { buffer: null, url: null, sonando: false, duracion: 0, alTerminar: null };
        let nodo = null, ancla = null, vel = 1;   // ancla: { ctx, seg } = a esa hora del contexto suena ese segundo
        const cache = {};       // url → AudioBuffer (promesa)
        const decodificar = url => cache[url] || (cache[url] = fetch(url).then(r => {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.arrayBuffer();
        }).then(b => ctx.decodeAudioData(b)).catch(e => { delete cache[url]; throw e; }));
        g.cargar = async (url) => {
            if (g.url === url && g.buffer) return;
            g.buffer = await decodificar(url);
            g.url = url; g.duracion = g.buffer.duration;
        };
        g.precargar = url => { if (url) decodificar(url).catch(() => {}); };
        g.cambiar = async (url) => {
            const b = await decodificar(url);
            g.buffer = b; g.url = url; g.duracion = b.duration;   // la fuente lee g.buffer en cada bloque
        };
        g.tocar = async (desde, semitonos = 0, velocidad = 1) => {
            g.detener();
            const L = await cargarLib();
            const st = new L.SoundTouch();
            st.pitchSemitones = semitonos;
            st.tempo = velocidad;
            const fuente = { extract(t, n, pos) {
                const buf = g.buffer;
                const c0 = buf.getChannelData(0), c1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : c0;
                const k = Math.min(n, buf.length - pos);
                if (k <= 0) return 0;
                for (let i = 0; i < k; i++) { t[i * 2] = c0[pos + i]; t[i * 2 + 1] = c1[pos + i]; }
                return k;
            } };
            const filtro = new L.SimpleFilter(fuente, st);
            const sr = g.buffer.sampleRate;
            const ini = Math.max(0, Math.floor(desde * sr));
            filtro.sourcePosition = ini;
            vel = velocidad;
            const s0 = ini / sr;
            const muestras = new Float32Array(BLOQUE * 2);
            const n = ctx.createScriptProcessor(BLOQUE, 2, 2);
            ancla = { ctx: ctx.currentTime + BLOQUE / ctx.sampleRate, seg: s0 };
            n.onaudioprocess = ev => {
                // lo que sale en este bloque empieza en este segundo de la grabación
                ancla = { ctx: ev.playbackTime, seg: s0 + filtro.position * vel / sr };
                const izq = ev.outputBuffer.getChannelData(0), der = ev.outputBuffer.getChannelData(1);
                const k = filtro.extract(muestras, BLOQUE);
                for (let i = 0; i < BLOQUE; i++) { izq[i] = i < k ? muestras[i * 2] : 0; der[i] = i < k ? muestras[i * 2 + 1] : 0; }
                if (k === 0 && g.sonando) { g.detener(); g.alTerminar?.(); }
            };
            n.connect(destino);
            nodo = n; g.sonando = true;
        };
        g.detener = () => {
            if (nodo) { nodo.onaudioprocess = null; try { nodo.disconnect(); } catch (_) {} }
            nodo = null; g.sonando = false;
        };
        const salida = () => ctx.outputLatency || ctx.baseLatency || 0;
        g.oido = () => g.sonando && ancla ? ancla.seg + (ctx.currentTime - salida() - ancla.ctx) * vel : null;
        g.aCtx = seg => ancla ? ancla.ctx + (seg - ancla.seg) / vel : ctx.currentTime;
        return g;
    }
    window.GrabacionTono = { crear, cargarLib };
})();
