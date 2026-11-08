// GrabacionTono (deuda ES): una grabación con el tono cambiado (semitonos) y más lenta sin cambiar el tono,
// con SoundTouch (la misma biblioteca que el Pitch del Entrenador). Sabe en qué segundo de la grabación va lo
// que se escucha, para dibujar y programar notas a la par.
//
//   const g = GrabacionTono.crear(ctx, destino);
//   await g.cargar(url, x => …);            // descarga y decodifica (una vez por url) y la deja elegida; x = 0..1 descargado
//   g.precargar(url)                        // deja lista otra grabación (Melodía / Karaoke) sin elegirla
//   await g.cambiar(url)                    // sonando, pasa a la otra grabación en la misma muestra (deuda ET)
//   await g.tocar(desdeSeg, semitonos, velocidad, saltos);   // velocidad 1 = normal, 0.5 = mitad; saltos (opcional,
//                                           GK) = [{ desde, hasta }] tramos que no suenan (una adaptación de la canción)
//   g.omitido(seg)  → ese segundo cae en un salto
//   g.oido()        → segundo de la grabación que suena ahora (null si no suena)
//   g.aCtx(seg)     → hora del AudioContext en que sonará ese segundo de la grabación
//   g.detener() · g.duracion · g.sonando · g.alTerminar = fn
// Usada por el Piano del estudiante (PIANO/) y el Mapa de tempo (TEMPO/).
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
        // Descarga (con avance 0..1 si se pide; FV) y decodifica, una vez por url
        const progreso = {};    // url → [fn]: quienes esperan el avance de esa descarga
        const decodificar = (url, alProgreso) => {
            if (alProgreso) (progreso[url] = progreso[url] || []).push(alProgreso);
            return cache[url] || (cache[url] = fetch(url).then(async r => {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                const total = +r.headers.get('content-length') || 0;
                if (!r.body || !total) return r.arrayBuffer();
                const lector = r.body.getReader(), partes = [];
                let n = 0;
                for (;;) {
                    const { done, value } = await lector.read();
                    if (done) break;
                    partes.push(value); n += value.length;
                    (progreso[url] || []).forEach(f => { try { f(Math.min(1, n / total)); } catch (_) {} });
                }
                const datos = new Uint8Array(n); let o = 0;
                for (const p of partes) { datos.set(p, o); o += p.length; }
                return datos.buffer;
            }).then(b => { (progreso[url] || []).forEach(f => { try { f(1); } catch (_) {} }); delete progreso[url]; return ctx.decodeAudioData(b); })
              .catch(e => { delete cache[url]; delete progreso[url]; throw e; }));
        };
        g.cargar = async (url, alProgreso) => {
            if (g.url === url && g.buffer) return;
            g.buffer = await decodificar(url, alProgreso);
            g.url = url; g.duracion = g.buffer.duration;
        };
        g.precargar = url => { if (url) decodificar(url).catch(() => {}); };
        g.cambiar = async (url) => {
            const b = await decodificar(url);
            g.buffer = b; g.url = url; g.duracion = b.duration;   // la fuente lee g.buffer en cada bloque
        };
        // Saltos (GK, adaptaciones): tramos de la grabación que no suenan, [{ desde, hasta }] en segundos. Lo que suena es
        // una línea "virtual" (la grabación sin esos tramos); cortes = [{ a, b, v }] (a, b en la grabación; v = dónde cae en la
        // virtual). Sin saltos, virtual = grabación.
        let cortes = [];
        const normalizar = (saltos, dur) => {
            const L = (saltos || []).map(x => ({ a: Math.max(0, +x.desde), b: Math.min(dur, +x.hasta) }))
                .filter(x => isFinite(x.a) && isFinite(x.b) && x.b - x.a > 0.01).sort((x, y) => x.a - y.a);
            const out = [];
            for (const x of L) { const u = out[out.length - 1]; if (u && x.a <= u.b + 0.01) u.b = Math.max(u.b, x.b); else out.push({ ...x }); }
            let quitado = 0;
            for (const x of out) { x.v = x.a - quitado; quitado += x.b - x.a; }
            return out;
        };
        const aReal = v => { let r = v; for (const x of cortes) { if (x.v <= v + 1e-9) r += x.b - x.a; else break; } return r; };
        const aVirtual = s => { let q = 0; for (const x of cortes) { if (s >= x.b) q += x.b - x.a; else if (s >= x.a) return x.v; else break; } return s - q; };
        g.tocar = async (desde, semitonos = 0, velocidad = 1, saltos = null) => {
            g.detener();
            const L = await cargarLib();
            const st = new L.SoundTouch();
            st.pitchSemitones = semitonos;
            st.tempo = velocidad;
            const sr = g.buffer.sampleRate;
            cortes = normalizar(saltos, g.buffer.duration);
            const juntas = cortes.map(x => Math.round(x.v * sr)), FUNDIDO = 128;   // en cada junta, ~3 ms de fundido (sin chasquido)
            const fuente = { extract(t, n, pos) {
                const buf = g.buffer;
                const c0 = buf.getChannelData(0), c1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : c0;
                if (!juntas.length) {
                    const k = Math.min(n, buf.length - pos);
                    if (k <= 0) return 0;
                    for (let i = 0; i < k; i++) { t[i * 2] = c0[pos + i]; t[i * 2 + 1] = c1[pos + i]; }
                    return k;
                }
                let k = 0;
                while (k < n) {
                    const v = pos + k, j = juntas.findIndex(x => x > v);   // la próxima junta
                    const prev = j === -1 ? juntas[juntas.length - 1] : j > 0 ? juntas[j - 1] : null, sig = j === -1 ? Infinity : juntas[j];
                    const r = Math.round(aReal(v / sr) * sr);
                    const run = Math.min(n - k, sig - v, buf.length - r);
                    if (run <= 0) break;
                    for (let i = 0; i < run; i++) {
                        const vv = v + i, gn = Math.min(1, prev !== null ? (vv - prev) / FUNDIDO : 1, (sig - vv) / FUNDIDO);
                        t[(k + i) * 2] = c0[r + i] * gn; t[(k + i) * 2 + 1] = c1[r + i] * gn;
                    }
                    k += run;
                }
                return k;
            } };
            const filtro = new L.SimpleFilter(fuente, st);
            const ini = Math.max(0, Math.floor(aVirtual(Math.max(0, desde)) * sr));
            filtro.sourcePosition = ini;
            vel = velocidad;
            const s0 = ini / sr;
            const muestras = new Float32Array(BLOQUE * 2);
            const n = ctx.createScriptProcessor(BLOQUE, 2, 2);
            ancla = { ctx: ctx.currentTime + BLOQUE / ctx.sampleRate, seg: s0 };
            n.onaudioprocess = ev => {
                // lo que sale en este bloque empieza en este segundo (virtual) de la grabación
                ancla = { ctx: ev.playbackTime, seg: s0 + filtro.position * vel / sr };
                const izq = ev.outputBuffer.getChannelData(0), der = ev.outputBuffer.getChannelData(1);
                const k = filtro.extract(muestras, BLOQUE);
                for (let i = 0; i < BLOQUE; i++) { izq[i] = i < k ? muestras[i * 2] : 0; der[i] = i < k ? muestras[i * 2 + 1] : 0; }
                if (k === 0 && g.sonando) { g.detener(); g.alTerminar?.(); }
            };
            n.connect(destino);
            nodo = n; g.sonando = true;
            window.UnSonido?.suena(g, true);     // Workspace: una sola pestaña suena (FK)
        };
        g.detener = () => {
            if (nodo) { nodo.onaudioprocess = null; try { nodo.disconnect(); } catch (_) {} }
            nodo = null; g.sonando = false;
            window.UnSonido?.suena(g, false);
        };
        const salida = () => ctx.outputLatency || ctx.baseLatency || 0;
        g.oido = () => g.sonando && ancla ? aReal(ancla.seg + (ctx.currentTime - salida() - ancla.ctx) * vel) : null;
        g.aCtx = seg => ancla ? ancla.ctx + (aVirtual(seg) - ancla.seg) / vel : ctx.currentTime;
        g.omitido = seg => cortes.some(x => seg >= x.a && seg < x.b);   // ese segundo no suena (está en un salto)
        return g;
    }
    window.GrabacionTono = { crear, cargarLib };
})();
