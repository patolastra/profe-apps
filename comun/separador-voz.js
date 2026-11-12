// SeparadorVoz (deuda GZ): saca la voz de una grabación en este mismo computador y entrega
// la parte instrumental como MP3 liviano. Los trozos (~6 s) se separan en varios Workers a la vez
// (comun/separador-voz-worker.js) y aquí se unen con fundido (25 % de solape).
//   const r = await SeparadorVoz.crearKaraoke(urlOBlob, { kbps: 128, alAvance: (fase, p) => … });
//   op.desde / op.hasta (segundos, opcional): solo ese tramo · op.procesos: Workers en paralelo.
//   r.blob (audio/mpeg) · r.segundos · r.procesos
// Fases: 'leer' · 'descarga' (solo la primera vez, ~67 MB) · 'preparar' · 'separar' · 'mp3'.
(function () {
    const base = (document.currentScript && document.currentScript.src) || location.href;
    const URL_WORKER = new URL('separador-voz-worker.js?v=gz4', base).href;
    const N = 1024 * 255, PASO = Math.floor(N * 0.75);
    // lamejs no escribe el dato de retraso del MP3: el navegador lo toca 1105 muestras (25 ms) tarde.
    // Se adelanta el audio esa cantidad para que calce con la Melodía.
    const RETRASO_MP3 = 1105;

    async function leer(fuente, desde, hasta) {
        const datos = fuente instanceof Blob ? await fuente.arrayBuffer() : await (await fetch(fuente)).arrayBuffer();
        // El modelo trabaja a 44,1 kHz y en estéreo: el navegador convierte al decodificar.
        const buf = await new OfflineAudioContext(2, 44100, 44100).decodeAudioData(datos);
        const a = Math.max(0, Math.floor((desde || 0) * 44100));
        const b = hasta ? Math.min(buf.length, Math.floor(hasta * 44100)) : buf.length;
        const izq = buf.getChannelData(0).slice(a, b);
        const der = (buf.numberOfChannels > 1 ? buf.getChannelData(1) : buf.getChannelData(0)).slice(a, b);
        return { izq, der, segundos: (b - a) / 44100 };
    }

    let activos = [], cancelado = null;
    const pedir = (w, msg, transfer) => new Promise((ok, mal) => {
        w.onmessage = e => {
            const d = e.data;
            if (d.tipo === 'avance') { w._alAvance?.(d.fase, d.p); return; }
            if (d.tipo === 'error') mal(new Error(d.mensaje)); else ok(d);
        };
        w.onerror = e => mal(new Error(e.message || 'el separador se detuvo'));
        w._mal = mal;
        w.postMessage(msg, transfer || []);
    });

    async function crearKaraoke(fuente, op = {}) {
        cancelar();
        const yo = cancelado = { si: false };
        const alAvance = op.alAvance || (() => {});
        const vivo = () => { if (yo.si) throw new Error('cancelado'); };
        try {
            alAvance('leer', 0);
            const { izq, der, segundos } = await leer(fuente, op.desde, op.hasta);
            vivo();
            const L = izq.length, pre = N >> 1;
            const nTrozos = Math.max(1, Math.ceil((pre + L + (N >> 1) - N) / PASO) + 1);
            const largo = (nTrozos - 1) * PASO + N;
            const mezcla = [new Float32Array(largo), new Float32Array(largo)];
            mezcla[0].set(izq, pre); mezcla[1].set(der, pre);
            const res = [new Float32Array(largo), new Float32Array(largo)], peso = new Float32Array(largo);
            const hann = new Float32Array(N);
            for (let i = 0; i < N; i++) hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1)) + 1e-3;

            const nucleos = navigator.hardwareConcurrency || 4;
            const procesos = Math.max(1, Math.min(nTrozos, op.procesos || Math.min(6, nucleos - 2)));
            // El primero descarga el modelo (una vez) y lo deja guardado; los demás lo abren de ahí.
            const w0 = new Worker(URL_WORKER); activos.push(w0);
            w0._alAvance = (f, p) => alAvance(f, p);
            alAvance('preparar', 0);
            await pedir(w0, { tipo: 'iniciar' });
            vivo();
            alAvance('preparar', 1 / procesos);
            const ws = [w0];
            await Promise.all(Array.from({ length: procesos - 1 }, async () => {
                const w = new Worker(URL_WORKER); activos.push(w);
                await pedir(w, { tipo: 'iniciar' });
                ws.push(w);
                alAvance('preparar', ws.length / procesos);
            }));
            vivo();

            let siguiente = 0, hechos = 0;
            alAvance('separar', 0);
            await Promise.all(ws.map(async w => {
                while (siguiente < nTrozos) {
                    const n = siguiente++, ini = n * PASO;
                    const a = mezcla[0].slice(ini, ini + N), b = mezcla[1].slice(ini, ini + N);
                    const r = await pedir(w, { tipo: 'trozo', n, izq: a, der: b }, [a.buffer, b.buffer]);
                    vivo();
                    for (let i = 0; i < N; i++) {
                        const h = hann[i];
                        res[0][ini + i] += r.izq[i] * h; res[1][ini + i] += r.der[i] * h; peso[ini + i] += h;
                    }
                    alAvance('separar', ++hechos / nTrozos);
                }
            }));
            ws.slice(1).forEach(w => w.terminate());

            const sal = [new Float32Array(L), new Float32Array(L)];
            for (let i = 0; i + RETRASO_MP3 < L; i++) {
                const k = pre + i + RETRASO_MP3, p = peso[k] || 1;
                sal[0][i] = res[0][k] / p; sal[1][i] = res[1][k] / p;
            }
            alAvance('mp3', 0);
            const r = await pedir(w0, { tipo: 'mp3', izq: sal[0], der: sal[1], kbps: op.kbps || 128 }, [sal[0].buffer, sal[1].buffer]);
            vivo();
            return { blob: new Blob([r.mp3], { type: 'audio/mpeg' }), segundos, procesos };
        } finally {
            if (cancelado === yo) { activos.forEach(w => w.terminate()); activos = []; }
        }
    }

    function cancelar() {
        if (cancelado) cancelado.si = true;
        activos.forEach(w => { try { w._mal?.(new Error('cancelado')); w.terminate(); } catch (_) {} });
        activos = [];
    }

    window.SeparadorVoz = { crearKaraoke, cancelar };
})();
