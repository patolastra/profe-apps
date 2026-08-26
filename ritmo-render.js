/* ============================================================================
 * ritmo-render.js — CAPA VISUAL + SONORA (Etapa 1.1)
 * ----------------------------------------------------------------------------
 * Renderiza y reproduce un OBJETO RITMO producido por ritmo.js.
 *
 * FUENTE DE VERDAD: ritmo.js. Este módulo NO recalcula duraciones ni tiempos:
 * todo deriva de los `events` (startTick/durTick/evIdx/tuplet). El player usa
 * un único reloj (AudioContext.currentTime) para audio, cursor y FX.
 *
 * PARTITURA → VexFlow (vendorizado local en vendor/vexflow.js). Una sola línea,
 *             plicas arriba, contenido dentro del compás, indicador de tresillo
 *             conmutable (solo visual).
 * INFANTIL  → SVG propio. Espaciado por duración SIN solapamiento (jerarquía
 *             negra/blanca > corchea > semicorchea) + autofit por viewBox.
 *
 * Contrato de `layout` (dueño del mapeo temporal→espacial), común a ambos modos:
 *   { modo, svg, tickToX(absTick), setCursor(repTick), fx(evIdx), limpiarFx() }
 *
 * NO conoce Portal, Pizarra, Repertorio, Entrenador ni Supabase.
 * ==========================================================================*/

(function (root) {
    'use strict';

    const SVGNS = 'http://www.w3.org/2000/svg';

    // ── Estilos autocontenidos (cursor + FX, comunes a ambos modos) ───────────
    function asegurarCss() {
        if (document.getElementById('ritmo-ui-css')) return;
        const st = document.createElement('style');
        st.id = 'ritmo-ui-css';
        st.textContent = `
        .ritmo-wrap { width:100%; height:100%; overflow:hidden; display:flex; }
        .ritmo-wrap svg { width:100%; height:100%; display:block; }
        /* Cursor: línea vertical limpia y delgada (misma estética en ambos modos) */
        .ritmo-cursor-line { stroke:#2563eb; stroke-width:2.2; stroke-linecap:round; }
        /* FX: sirve tanto para grupos VexFlow (.vf-stavenote) como para 👏 (g.ritmo-ev) */
        .ritmo-ev, .vf-stavenote {
            transition: transform .07s ease-out, filter .07s ease-out;
            transform-box: fill-box; transform-origin: center;
        }
        .ritmo-fx { transform: scale(1.4);
                    filter: drop-shadow(0 0 6px rgba(234,88,12,.95)); }
        .ritmo-clap { font: 40px "Segoe UI Emoji","Apple Color Emoji",system-ui,sans-serif;
                      text-anchor:middle; dominant-baseline:central; }
        .ritmo-inf-group { fill: rgba(124,58,237,.10); stroke: rgba(124,58,237,.55); stroke-width:1.6; }
        `;
        document.head.appendChild(st);
    }

    function svgEl(tag, attrs) {
        const e = document.createElementNS(SVGNS, tag);
        if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }

    // Aplana eventos a coordenadas de tick absolutas dentro de UNA repetición.
    function aplanar(obj) {
        const evs = [];
        obj.measures.forEach((m, mi) => {
            m.events.forEach(e => {
                evs.push({
                    evIdx: e.evIdx, mi, fig: e.fig, dotted: e.dotted, tuplet: e.tuplet,
                    durTick: e.durTick, absTick: mi * m.capacityTicks + e.startTick,
                });
            });
        });
        return evs;
    }

    // Interpolador tick→X a partir de anclas {t, x} ordenadas por t.
    function crearTickToX(anclas) {
        return function (t) {
            if (t <= anclas[0].t) return anclas[0].x;
            const last = anclas[anclas.length - 1];
            if (t >= last.t) return last.x;
            for (let i = 1; i < anclas.length; i++) {
                if (t <= anclas[i].t) {
                    const a = anclas[i - 1], b = anclas[i];
                    const f = (t - a.t) / (b.t - a.t || 1);
                    return a.x + f * (b.x - a.x);
                }
            }
            return last.x;
        };
    }

    // Envuelve un <svg> ya dibujado para que escale al contenedor sin desbordar.
    function hacerResponsive(svg, w, h) {
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width');
        svg.removeAttribute('height');
    }

    // Añade el cursor (SOLO una línea vertical limpia) abarcando [yTop,yBot].
    // Misma estética en PARTITURA e INFANTIL. Devuelve setCursor sobre coords viewBox.
    function montarCursor(svg, yTop, yBot, xIni) {
        const line = svgEl('line', { class: 'ritmo-cursor-line', x1: xIni, y1: yTop, x2: xIni, y2: yBot });
        line.style.visibility = 'hidden';
        svg.appendChild(line);
        return function (x) {
            if (x == null) { line.style.visibility = 'hidden'; return; }
            line.style.visibility = 'visible';
            line.setAttribute('x1', x); line.setAttribute('x2', x);
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // RENDER (dispatcher)
    // ═══════════════════════════════════════════════════════════════════════
    function render(obj, contenedor, modo, opts) {
        asegurarCss();
        opts = opts || {};
        modo = (modo === 'infantil') ? 'infantil' : 'partitura';
        contenedor.innerHTML = '';
        if (modo === 'partitura') return renderPartitura(obj, contenedor, opts);
        return renderInfantil(obj, contenedor, opts);
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PARTITURA — VexFlow (una línea, plicas arriba, contenido dentro del compás)
    // ═══════════════════════════════════════════════════════════════════════
    const DUR_VEX = { r: 'w', b: 'h', n: 'q', c: '8', s: '16' };
    const Y_STAVE = 60;          // línea musical (deja sitio arriba para plicas/tresillos)
    const CANVAS_H = 200;        // superficie de dibujo; el viewBox se recorta después
    const AIR = 1.5;             // aire de espaciado sobre el ancho mínimo musical
    const CURSOR_HALF = 40;      // semialtura del cursor (unidades viewBox) — simétrico
                                 // respecto de la línea; cubre la plica (~35) + margen
    const MAX_SCALE = 3.6;       // tope de escala para no agrandar de más ritmos compactos

    function renderPartitura(obj, contenedor, opts) {
        const VF = root.Vex && root.Vex.Flow;
        if (!VF) { contenedor.innerHTML = '<div style="color:#dc2626;padding:10px">VexFlow no está cargado (vendor/vexflow.js).</div>'; return null; }
        const mostrarTresillo = opts.mostrarIndicadorTresillo !== false;   // default true

        const wrap = document.createElement('div');
        wrap.className = 'ritmo-wrap';
        contenedor.appendChild(wrap);

        const renderer = new VF.Renderer(wrap, VF.Renderer.Backends.SVG);
        renderer.resize(1000, CANVAS_H);          // se re-dimensiona al ancho real más abajo
        const ctx = renderer.getContext();

        const evMap = {};
        const anclas = [];
        let x = 8;
        let lineY = Y_STAVE + 20;    // se fija con la línea real del primer compás
        const RIGHT_PAD = 20;

        obj.measures.forEach((measure, mi) => {
            // 1) Construir notas VexFlow (plicas SIEMPRE arriba)
            const notes = [];
            const grupos = {};      // groupId → [notes]  (para tresillos)
            measure.events.forEach(e => {
                let code = DUR_VEX[e.fig] + (e.dotted ? 'd' : '');
                const n = new VF.StaveNote({ keys: ['b/4'], duration: code, stem_direction: VF.Stem.UP });
                n.setStemDirection(VF.Stem.UP);
                if (e.dotted) VF.Dot.buildAndAttach([n], { all: true });
                n.setAttribute('id', 'ev' + e.evIdx);   // identidad evIdx → <g id="vf-ev…">
                evMap[e.evIdx] = n;
                notes.push(n);
                if (e.tuplet) (grupos[e.tuplet.groupId] ||= []).push(n);
            });

            // 2) Tresillos: SIEMPRE se crean (aplican el multiplicador 2/3 → espaciado
            //    y ticks correctos). El indicador visual se dibuja o no según la opción.
            const tuplets = Object.values(grupos).map(g =>
                new VF.Tuplet(g, { num_notes: 3, notes_occupied: 2, bracketed: true, ratioed: false }));

            const voice = new VF.Voice({ num_beats: obj.meter.num, beat_value: obj.meter.den })
                .setMode(VF.Voice.Mode.SOFT);
            voice.addTickables(notes);

            // 3) Ancho del compás = ancho mínimo musical + paddings (evita desborde)
            const fmt = new VF.Formatter();
            fmt.joinVoices([voice]);
            const minW = fmt.preCalculateMinTotalWidth([voice]);
            const leftMods = (mi === 0) ? 42 : 12;    // hueco para cifra de compás
            // Aire: ensanchamos el compás sobre el mínimo musical para que las figuras
            // (p.ej. negras) respiren y no queden pegadas. El desborde se evita porque
            // formateamos las notas al ancho útil real del compás (con RIGHT_PAD).
            const measureW = Math.ceil(minW * AIR + leftMods + RIGHT_PAD);

            const stave = new VF.Stave(x, Y_STAVE, measureW);
            // Una sola línea: mostrar únicamente la línea central de las 5
            stave.setConfigForLines([
                { visible: false }, { visible: false }, { visible: true }, { visible: false }, { visible: false },
            ]);
            if (mi === 0) stave.addTimeSignature(obj.meter.num + '/' + obj.meter.den);
            stave.setContext(ctx).draw();
            if (mi === 0) lineY = stave.getYForLine(2);   // línea central (baseline musical)

            // 4) Formatear las notas DENTRO del ancho útil del compás
            const startX = stave.getNoteStartX();
            const usable = (stave.getX() + stave.getWidth()) - startX - RIGHT_PAD;
            fmt.format([voice], Math.max(40, usable));

            // Barrado según compás: 3/8 en 6/8, 2/8 en 4/4 — plicas arriba
            const groupsBeam = obj.meter.den === 8 ? [new VF.Fraction(3, 8)] : [new VF.Fraction(2, 8)];
            const beams = VF.Beam.generateBeams(notes, { groups: groupsBeam, stem_direction: VF.Stem.UP });

            voice.draw(ctx, stave);
            beams.forEach(b => b.setContext(ctx).draw());
            // Tresillo: SIEMPRE se dibuja (reserva su espacio vertical → el toggle no
            // desplaza la partitura). Si el indicador está OFF, se oculta con
            // visibility:hidden, que sigue contando en getBBox (misma geometría/escala).
            if (tuplets.length) {
                const gTup = ctx.openGroup('ritmo-tuplet-layer');
                tuplets.forEach(tp => tp.setContext(ctx).draw());
                ctx.closeGroup();
                if (!mostrarTresillo && gTup) gTup.style.visibility = 'hidden';
            }

            // 5) Anclas tick→X (posición real de cada nota en el layout de VexFlow)
            const cap = measure.capacityTicks;
            measure.events.forEach(e => {
                anclas.push({ t: mi * cap + e.startTick, x: evMap[e.evIdx].getAbsoluteX() });
            });
            x += measureW;
        });

        const totalW = x + 4;
        renderer.resize(totalW, CANVAS_H);
        const svg = wrap.querySelector('svg');

        let bb;
        try { bb = svg.getBBox(); } catch (_) { bb = { x: 0, y: 0, width: totalW, height: CANVAS_H }; }
        if (!bb.width || !bb.height) bb = { x: 0, y: 0, width: totalW, height: CANVAS_H };

        // CURSOR: banda SIMÉTRICA respecto de la línea musical, de tamaño fijo en
        // unidades de viewBox → longitud consistente e independiente de la densidad
        // (negras, corcheas o semicorcheas dan el mismo cursor). Centrado por construcción.
        const curTop = lineY - CURSOR_HALF, curBot = lineY + CURSOR_HALF;

        // AUTOFIT: viewBox = caja de la notación ∪ banda del cursor, con recorte para que
        // la partitura crezca, y TOPE DE ESCALA para que no crezca desproporcionadamente.
        const padH = 12, padV = 10;
        let vbX = bb.x - padH;
        let vbW = bb.width + 2 * padH;
        let vbY = Math.min(bb.y, curTop) - padV;
        let vbH = Math.max(bb.y + bb.height, curBot) + padV - vbY;

        // Tope de escala: si el ajuste natural superaría MAX_SCALE (ritmos compactos),
        // se agranda el viewBox (margen alrededor) para limitar el crecimiento.
        const cw = contenedor.clientWidth || 960, ch = contenedor.clientHeight || 540;
        const fit = Math.min(cw / vbW, ch / vbH);
        if (fit > MAX_SCALE) {
            const nW = Math.max(vbW, cw / MAX_SCALE), nH = Math.max(vbH, ch / MAX_SCALE);
            vbX -= (nW - vbW) / 2; vbY -= (nH - vbH) / 2; vbW = nW; vbH = nH;
        }
        svg.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`);
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.removeAttribute('width'); svg.removeAttribute('height');
        // VexFlow deja width/height como ESTILO inline (gana sobre el CSS): forzamos fill.
        svg.style.width = '100%'; svg.style.height = '100%';

        // Anclas de borde para el cursor (inicio y fin de la repetición)
        anclas.sort((a, b) => a.t - b.t);
        anclas.unshift({ t: 0, x: anclas.length ? anclas[0].x : 8 });
        anclas.push({ t: obj.ticksPorRep, x: totalW - RIGHT_PAD });
        const tickToX = crearTickToX(anclas);

        const setCur = montarCursor(svg, curTop, curBot, tickToX(0));
        // FX: resolver el nodo por id DENTRO del SVG renderizado. VexFlow emite
        // <g id="vf-ev{idx}"> al dibujar; note.getSVGElement() devuelve una
        // referencia que no siempre es la del árbol vivo, así que buscamos por id.
        return construirLayout('partitura', svg, tickToX, setCur, evMap,
            (n) => svg.querySelector('#vf-' + n.getAttribute('id')));
    }

    // ═══════════════════════════════════════════════════════════════════════
    // INFANTIL — SVG propio: espaciado por duración, sin solapamiento + autofit
    // ═══════════════════════════════════════════════════════════════════════
    const H_INF = 130;
    const CLAP_W = 42;               // ancho visual aproximado del 👏 (unidades)
    const GAP_MIN = 14;              // separación mínima garantizada entre 👏 (>0)
    const PAD_INF = 24;

    function renderInfantil(obj, contenedor, opts) {
        const evs = aplanar(obj);

        // Paso visual por evento: separación ≥ (ancho clap + GAP_MIN), y además
        // crece con la duración (jerarquía negra/blanca > corchea > semicorchea).
        // NO altera el modelo: solo posiciona en X. El cursor usará estas anclas.
        const anclas = [];
        let x = PAD_INF;
        evs.forEach((e, i) => {
            anclas.push({ t: e.absTick, x, evIdx: e.evIdx });
            // paso = piso anti-solape + componente proporcional a la duración
            const step = Math.max(CLAP_W + GAP_MIN, CLAP_W + e.durTick * 1.4);
            x += step;
        });
        const totalW = x + PAD_INF;

        const wrap = document.createElement('div');
        wrap.className = 'ritmo-wrap';
        contenedor.appendChild(wrap);
        const svg = svgEl('svg');
        wrap.appendChild(svg);

        // Recuadros de tresillo (debajo de los 👏), usando las X ya calculadas
        const gruposTup = {};
        evs.forEach((e, i) => { if (e.tuplet) (gruposTup[e.mi + e.tuplet.groupId] ||= []).push(i); });
        Object.values(gruposTup).forEach(idxs => {
            const x1 = anclas[idxs[0]].x, x2 = anclas[idxs[idxs.length - 1]].x;
            svg.appendChild(svgEl('rect', {
                class: 'ritmo-inf-group', rx: 14,
                x: x1 - CLAP_W / 2 - 8, y: H_INF / 2 - 34, width: (x2 - x1) + CLAP_W + 16, height: 68,
            }));
        });

        const evMap = {};
        evs.forEach((e, i) => {
            const g = svgEl('g', { class: 'ritmo-ev', 'data-ev-idx': e.evIdx });
            g.appendChild(txt(anclas[i].x, H_INF / 2, '👏', 'ritmo-clap'));
            svg.appendChild(g);
            evMap[e.evIdx] = g;
        });

        hacerResponsive(svg, totalW, H_INF);

        // Anclas de borde para el cursor
        const acCursor = anclas.map(a => ({ t: a.t, x: a.x }));
        acCursor.unshift({ t: 0, x: acCursor.length ? acCursor[0].x : PAD_INF });
        acCursor.push({ t: obj.ticksPorRep, x: totalW - PAD_INF });
        acCursor.sort((a, b) => a.t - b.t);
        const tickToX = crearTickToX(acCursor);

        const setCur = montarCursor(svg, 4, H_INF - 4, tickToX(0));
        return construirLayout('infantil', svg, tickToX, setCur, evMap, (g) => g);
    }

    function txt(x, y, s, cls) {
        const t = svgEl('text', { x, y, class: cls });
        t.textContent = s;
        return t;
    }

    // ── Layout común: setCursor / fx / limpiarFx sobre el nodo de cada evento ──
    // `nodoDe(ref)` devuelve el elemento SVG al que aplicar el FX (grupo VexFlow o <g> 👏).
    function construirLayout(modo, svg, tickToX, setCur, evMap, resolverNodo) {
        const fxTimers = new Map();
        const nodo = (evIdx) => {
            const ref = evMap[evIdx];
            if (!ref) return null;
            try { return resolverNodo(ref); } catch (_) { return null; }
        };
        return {
            modo, svg, tickToX,
            setCursor(repTick) { setCur(repTick == null ? null : tickToX(repTick)); },
            fx(evIdx) {
                const el = nodo(evIdx);
                if (!el) return;
                el.classList.add('ritmo-fx');
                clearTimeout(fxTimers.get(evIdx));
                fxTimers.set(evIdx, setTimeout(() => el.classList.remove('ritmo-fx'), 150));
            },
            limpiarFx() {
                Object.keys(evMap).forEach(i => { const el = nodo(i); if (el) el.classList.remove('ritmo-fx'); });
                fxTimers.forEach(t => clearTimeout(t)); fxTimers.clear();
                this.setCursor(null);
            },
        };
    }

    // ═══════════════════════════════════════════════════════════════════════
    // PLAYER — un único reloj (AudioContext.currentTime). SIN CAMBIOS de timing.
    // ═══════════════════════════════════════════════════════════════════════
    let _actx = null, _noise = null;
    function audioCtx() {
        if (!_actx) _actx = new (window.AudioContext || window.webkitAudioContext)();
        return _actx;
    }
    function bufferRuido(c) {
        if (_noise && _noise.sampleRate === c.sampleRate) return _noise;
        const dur = 0.05, n = Math.ceil(c.sampleRate * dur);
        const buf = c.createBuffer(1, n, c.sampleRate);
        const d = buf.getChannelData(0);
        for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.2);
        _noise = buf;
        return buf;
    }
    function programarGolpe(c, t, salida) {
        const src = c.createBufferSource(); src.buffer = bufferRuido(c);
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1750; bp.Q.value = 0.9;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0008, t + 0.05);
        src.connect(bp).connect(g).connect(salida);
        src.start(t); src.stop(t + 0.06);
        return src;
    }

    function crearPlayer(obj, layout, opts) {
        opts = opts || {};
        const secPorTick = 60 / (obj.bpm * obj.meter.beatTicks);
        const tpr = obj.ticksPorRep;
        const totalTicks = tpr * obj.reps;

        const ataquesRep = [];
        obj.measures.forEach((m, mi) => m.events.forEach(e =>
            ataquesRep.push({ absTick: mi * m.capacityTicks + e.startTick, evIdx: e.evIdx })));
        const ataquesGlobal = [];
        for (let r = 0; r < obj.reps; r++)
            for (const a of ataquesRep)
                ataquesGlobal.push({ t: (a.absTick + r * tpr) * secPorTick, evIdx: a.evIdx });
        ataquesGlobal.sort((a, b) => a.t - b.t);

        let raf = null, sources = [], playing = false, t0 = 0, fired = -1;

        function loop() {
            const el = audioCtx().currentTime - t0;
            if (el >= totalTicks * secPorTick) { finalizar(); return; }
            layout.setCursor(el < 0 ? 0 : (el / secPorTick) % tpr);
            while (fired + 1 < ataquesGlobal.length && ataquesGlobal[fired + 1].t <= el) {
                fired++; layout.fx(ataquesGlobal[fired].evIdx);
            }
            raf = requestAnimationFrame(loop);
        }
        function play() {
            stop();
            const c = audioCtx();
            if (c.state === 'suspended') c.resume();
            playing = true; fired = -1; t0 = c.currentTime + 0.12;
            for (const a of ataquesGlobal) sources.push(programarGolpe(c, t0 + a.t, c.destination));
            if (opts.onState) opts.onState('playing');
            raf = requestAnimationFrame(loop);
        }
        function detenerAudio() { sources.forEach(s => { try { s.stop(); } catch (_) {} }); sources = []; }
        function finalizar() {
            if (raf) cancelAnimationFrame(raf); raf = null; playing = false;
            detenerAudio(); layout.limpiarFx();
            if (opts.onState) opts.onState('ended');
        }
        function stop() {
            if (raf) cancelAnimationFrame(raf); raf = null;
            const was = playing; playing = false;
            detenerAudio(); layout.limpiarFx();
            if (was && opts.onState) opts.onState('stopped');
        }
        return { play, stop, get playing() { return playing; } };
    }

    root.RITMO_UI = { render, crearPlayer, audioCtx };

})(typeof window !== 'undefined' ? window : this);
