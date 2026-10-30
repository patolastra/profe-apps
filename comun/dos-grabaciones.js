// DosGrabaciones (deuda ET): Melodía y Karaoke en un solo reproductor, para cambiar entre ellas sin salto.
// Las dos grabaciones quedan decodificadas y el reproductor lee la elegida muestra a muestra; cambiar es un fundido
// de 25 ms entre las dos en la misma posición (musicalmente exacto). El <audio> de la página sigue siendo el reloj
// (letra, loops, saltos), en silencio mientras suena este reproductor.
//
//   const buf = await DosGrabaciones.cargar(ctx, url, x => …)     // x = 0..1 descargado; devuelve el AudioBuffer
//   const r = DosGrabaciones.motor(ctx, destino, { buffer, reloj, vel, st, alEmpezar })
//        buffer: AudioBuffer inicial · reloj(): segundo del <audio> (al primer bloque el motor se pone donde va a ir
//        el <audio> cuando ese bloque suene) · vel: velocidad · st: { SimpleFilter, pipe } con un SoundTouch ya
//        configurado (tono / velocidad) o null (se lee directo) · alEmpezar(horaCtx): cuándo empieza a oírse (para
//        callar el <audio> justo ahí: el traspaso no se nota)
//   r.cambiar(otroBuffer) · r.ir(seg) · r.detener() · r.segundo() (posición leída de la grabación)
// Usada por el Entrenador (REPERTORIO/) y Cantar (CANTAR/).
(function () {
    const BLOQUE = 4096;
    const FUNDIDO = 0.025;      // segundos

    async function cargar(ctx, url, alProgreso) {
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const total = +r.headers.get('content-length') || 0;
        let datos;
        if (r.body && total && alProgreso) {
            const lector = r.body.getReader(), partes = [];
            let n = 0;
            for (;;) {
                const { done, value } = await lector.read();
                if (done) break;
                partes.push(value); n += value.length;
                alProgreso(Math.min(1, n / total));
            }
            datos = new Uint8Array(n);
            let o = 0;
            for (const p of partes) { datos.set(p, o); o += p.length; }
            datos = datos.buffer;
        } else datos = await r.arrayBuffer();
        alProgreso?.(1);
        return await ctx.decodeAudioData(datos);
    }

    function motor(ctx, destino, op) {
        let buf = op.buffer, viejo = null, resta = 0;
        const sr = buf.sampleRate, largoF = Math.round(FUNDIDO * sr);
        let pos = 0;            // sin SoundTouch: la posición la lleva el motor
        // Lee n cuadros desde p (intercalados L R), mezclando con la grabación anterior durante el fundido
        function leer(t, n, p) {
            const k = Math.min(n, buf.length - p);
            if (k <= 0) return 0;
            const a0 = buf.getChannelData(0), a1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : a0;
            for (let i = 0; i < k; i++) { t[i * 2] = a0[p + i]; t[i * 2 + 1] = a1[p + i]; }
            if (viejo && resta > 0) {
                const b0 = viejo.getChannelData(0), b1 = viejo.numberOfChannels > 1 ? viejo.getChannelData(1) : b0;
                for (let i = 0; i < k && resta > 0; i++, resta--) {
                    const g = resta / largoF, q = p + i;
                    const v0 = q < viejo.length ? b0[q] : 0, v1 = q < viejo.length ? b1[q] : 0;
                    t[i * 2] = t[i * 2] * (1 - g) + v0 * g; t[i * 2 + 1] = t[i * 2 + 1] * (1 - g) + v1 * g;
                }
                if (resta <= 0) viejo = null;
            }
            return k;
        }
        let filtro = null;
        if (op.st) {
            filtro = new op.st.SimpleFilter({ extract: leer }, op.st.pipe);
        }
        const muestras = new Float32Array(BLOQUE * 2);
        const nodo = ctx.createScriptProcessor(BLOQUE, 2, 2);
        let primero = true;
        nodo.onaudioprocess = ev => {
            const izq = ev.outputBuffer.getChannelData(0), der = ev.outputBuffer.getChannelData(1);
            if (primero) ir(op.reloj() + Math.max(0, ev.playbackTime - ctx.currentTime) * (op.vel || 1));
            let k;
            if (filtro) k = filtro.extract(muestras, BLOQUE);
            else { k = leer(muestras, BLOQUE, pos); pos += k; }
            for (let i = 0; i < BLOQUE; i++) { izq[i] = i < k ? muestras[i * 2] : 0; der[i] = i < k ? muestras[i * 2 + 1] : 0; }
            if (primero) { primero = false; op.alEmpezar?.(ev.playbackTime); }
        };
        nodo.connect(destino);
        function ir(seg) {
            pos = Math.max(0, Math.floor(seg * sr)); viejo = null; resta = 0;
            if (filtro) filtro.sourcePosition = pos;
        }
        return {
            cambiar(otro) {
                if (!otro || otro === buf) return;
                viejo = buf; resta = largoF; buf = otro;
            },
            ir,
            segundo() { return (filtro ? filtro.sourcePosition : pos) / sr; },
            detener() { nodo.onaudioprocess = null; try { nodo.disconnect(); } catch (_) {} },
            get buffer() { return buf; },
        };
    }
    window.DosGrabaciones = { cargar, motor, BLOQUE };
})();
