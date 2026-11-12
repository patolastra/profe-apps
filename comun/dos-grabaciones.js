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
//        capa / capaGanancia: otra grabación que suena ENCIMA en la misma muestra (la 2ª voz, deuda GA), con su volumen
//        mezcla / mezclaGanancia: una segunda capa encima (HA: la Melodía sobre el Karaoke, para dejar la voz a medias)
//        adelanto (GV): segundos de la grabación que SoundTouch adelanta su salida (se lee desde un poco antes)
//        saltos (GK): [{ desde, hasta }] tramos que no suenan (una ✂ adaptación); alSaltar(horaCtx, seg): una junta se oye
//        a esa hora del contexto y lo que sigue es ese segundo de la grabación (para que el <audio> salte ahí)
//   r.cambiar(otroBuffer) · r.ir(seg) · r.detener() · r.segundo() (posición leída de la grabación)
//   r.capa(buffer|null, ganancia) (prender / apagar / volumen de la capa, sin golpe: la ganancia se desliza)
//   r.principal(ganancia, seg) (volumen de la grabación de abajo, para que la capa quede por encima; también se desliza)
//   r.mezcla(buffer|null, ganancia, seg) (la segunda capa, HA). `seg`: cuánto dura el deslizamiento (por defecto 25 ms)
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

    // ✂ Saltos (GK): tramos [{ desde, hasta }] (segundos) que no suenan. El motor lee una línea "virtual" (la grabación
    // sin esos tramos): pos y sourcePosition van en ella; aReal / aVirtual pasan de una a otra.
    function cortesDe(saltos, dur) {
        const L = (saltos || []).map(x => ({ a: Math.max(0, +x.desde), b: Math.min(dur, +x.hasta) }))
            .filter(x => isFinite(x.a) && isFinite(x.b) && x.b - x.a > 0.01).sort((x, y) => x.a - y.a);
        const out = [];
        for (const x of L) { const u = out[out.length - 1]; if (u && x.a <= u.b + 0.01) u.b = Math.max(u.b, x.b); else out.push({ ...x }); }
        let q = 0;
        for (const x of out) { x.v = x.a - q; q += x.b - x.a; }
        return out;
    }
    function motor(ctx, destino, op) {
        let buf = op.buffer, viejo = null, resta = 0;
        const sr = buf.sampleRate, largoF = Math.round(FUNDIDO * sr);
        const cortes = cortesDe(op.saltos, buf.duration), juntas = cortes.map(x => Math.round(x.v * sr)), JUNTA = 128;   // ~3 ms de fundido
        const aReal = v => { let r = v; for (const x of cortes) { if (x.v <= v + 1e-9) r += x.b - x.a; else break; } return r; };
        const aVirtual = s => { let q = 0; for (const x of cortes) { if (s >= x.b) q += x.b - x.a; else if (s >= x.a) return x.v; else break; } return s - q; };
        const realF = v => juntas.length ? Math.round(aReal(v / sr) * sr) : v;   // cuadro virtual → cuadro de la grabación
        let pos = 0;            // sin SoundTouch: la posición la lleva el motor (en la línea virtual)
        // Capas (2ª voz y mezcla): se suman antes del tono y la velocidad, así calzan exacto; su volumen se desliza
        const paso = 1 / largoF;
        const pasoDe = seg => seg > 0 ? 1 / Math.max(1, Math.round(seg * sr)) : paso;
        const nuevaCapa = (b, g) => ({ b: b || null, g: b ? (g ?? 1) : 0, meta: b ? (g ?? 1) : 0, paso });
        const capas = [nuevaCapa(op.capa, op.capaGanancia), nuevaCapa(op.mezcla, op.mezclaGanancia)];
        let pMeta = op.ganancia ?? 1, gPrin = pMeta, pPaso = paso;      // volumen de la grabación de abajo
        // Lee n cuadros desde p (de la grabación) y los deja desde el cuadro o de t (intercalados L R), mezclando con la
        // grabación anterior durante el fundido
        function leerReal(t, n, p, o) {
            const k = Math.min(n, buf.length - p);
            if (k <= 0) return 0;
            const a0 = buf.getChannelData(0), a1 = buf.numberOfChannels > 1 ? buf.getChannelData(1) : a0;
            for (let i = 0; i < k; i++) { t[(o + i) * 2] = a0[p + i]; t[(o + i) * 2 + 1] = a1[p + i]; }
            if (viejo && resta > 0) {
                const b0 = viejo.getChannelData(0), b1 = viejo.numberOfChannels > 1 ? viejo.getChannelData(1) : b0;
                for (let i = 0; i < k && resta > 0; i++, resta--) {
                    const g = resta / largoF, q = p + i;
                    const v0 = q < viejo.length ? b0[q] : 0, v1 = q < viejo.length ? b1[q] : 0;
                    t[(o + i) * 2] = t[(o + i) * 2] * (1 - g) + v0 * g; t[(o + i) * 2 + 1] = t[(o + i) * 2 + 1] * (1 - g) + v1 * g;
                }
                if (resta <= 0) viejo = null;
            }
            if (gPrin !== 1 || pMeta !== 1) {
                for (let i = 0; i < k; i++) {
                    if (gPrin !== pMeta) gPrin = gPrin < pMeta ? Math.min(pMeta, gPrin + pPaso) : Math.max(pMeta, gPrin - pPaso);
                    t[(o + i) * 2] *= gPrin; t[(o + i) * 2 + 1] *= gPrin;
                }
            }
            for (const C of capas) {
                if (!C.b || (C.g === 0 && C.meta === 0)) continue;
                const c0 = C.b.getChannelData(0), c1 = C.b.numberOfChannels > 1 ? C.b.getChannelData(1) : c0;
                for (let i = 0; i < k; i++) {
                    if (C.g !== C.meta) C.g = C.g < C.meta ? Math.min(C.meta, C.g + C.paso) : Math.max(C.meta, C.g - C.paso);
                    const q = p + i;
                    if (q < C.b.length) { t[(o + i) * 2] += c0[q] * C.g; t[(o + i) * 2 + 1] += c1[q] * C.g; }
                }
                if (C.g === 0 && C.meta === 0) C.b = null;
            }
            return k;
        }
        // Lee n cuadros desde v (línea virtual): por tramos sin junta, con un fundido corto a cada lado de cada junta
        function leer(t, n, v) {
            if (!juntas.length) return leerReal(t, n, v, 0);
            let k = 0;
            while (k < n) {
                const w = v + k, j = juntas.findIndex(x => x > w);
                const prev = j === -1 ? juntas[juntas.length - 1] : j > 0 ? juntas[j - 1] : null, sig = j === -1 ? Infinity : juntas[j];
                const run = Math.min(n - k, sig - w);
                const got = leerReal(t, run, realF(w), k);
                for (let i = 0; i < got; i++) {
                    const ww = w + i, g = Math.min(1, prev !== null ? (ww - prev) / JUNTA : 1, (sig - ww) / JUNTA);
                    if (g < 1) { t[(k + i) * 2] *= g; t[(k + i) * 2 + 1] *= g; }
                }
                k += got;
                if (got < run) break;
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
        const vel = op.vel || 1;
        let base = 0, salidaBase = 0;           // con SoundTouch: dónde se puso (virtual) y cuánto había salido entonces
        const avisadas = new Set();
        nodo.onaudioprocess = ev => {
            const izq = ev.outputBuffer.getChannelData(0), der = ev.outputBuffer.getChannelData(1);
            if (primero) ir(op.reloj() + Math.max(0, ev.playbackTime - ctx.currentTime) * vel);
            // Lo que se oirá en este bloque empieza en este cuadro de la línea virtual
            const vIni = filtro ? base + (filtro.position - salidaBase) * vel : pos;
            let k;
            if (filtro) k = filtro.extract(muestras, BLOQUE);
            else { k = leer(muestras, BLOQUE, pos); pos += k; }
            // ✂ Una junta en este bloque: se avisa cuándo se oye y a qué segundo de la grabación salta (el reloj la sigue)
            if (juntas.length && op.alSaltar) for (let j = 0; j < juntas.length; j++) {
                const J = juntas[j];
                if (J < vIni || J >= vIni + BLOQUE * vel || avisadas.has(j)) continue;
                avisadas.add(j);
                op.alSaltar(ev.playbackTime + (J - vIni) / sr / vel, cortes[j].b);
            }
            for (let i = 0; i < BLOQUE; i++) { izq[i] = i < k ? muestras[i * 2] : 0; der[i] = i < k ? muestras[i * 2 + 1] : 0; }
            if (primero) { primero = false; op.alEmpezar?.(ev.playbackTime); }
        };
        nodo.connect(destino);
        function ir(seg) {
            pos = Math.max(0, Math.floor(aVirtual(Math.max(0, seg)) * sr)); viejo = null; resta = 0;
            if (filtro) { filtro.sourcePosition = Math.max(0, pos - Math.round((op.adelanto || 0) * sr)); salidaBase = filtro.position; }
            base = pos; avisadas.clear();
        }
        function ponerCapa(C, b, g, seg) {
            C.paso = pasoDe(seg);
            if (b) { if (C.b && C.b !== b) C.g = 0; C.b = b; C.meta = Math.max(0, g); }
            else C.meta = 0;                    // se apaga deslizándose; luego se suelta
        }
        return {
            cambiar(otro) {
                if (!otro || otro === buf) return;
                viejo = buf; resta = largoF; buf = otro;
            },
            ir,
            capa(b, g = 1, seg) { ponerCapa(capas[0], b, g, seg); },
            mezcla(b, g = 1, seg) { ponerCapa(capas[1], b, g, seg); },
            principal(g = 1, seg) { pMeta = Math.max(0, g); pPaso = pasoDe(seg); },
            segundo() { return aReal((filtro ? filtro.sourcePosition : pos) / sr); },
            detener() { nodo.onaudioprocess = null; try { nodo.disconnect(); } catch (_) {} },
            get buffer() { return buf; },
        };
    }
    window.DosGrabaciones = { cargar, motor, BLOQUE };
})();
