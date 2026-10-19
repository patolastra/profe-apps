/* ============================================================================
 * ritmo-render.js — CAPA VISUAL + SONORA (Etapa 1.1)
 * ----------------------------------------------------------------------------
 * Renderiza y reproduce un OBJETO RITMO producido por ritmo.js.
 *
 * FUENTE DE VERDAD: ritmo.js. Este módulo NO recalcula duraciones ni tiempos:
 * todo deriva de los `events` (startTick/durTick/evIdx/tuplet). El player usa
 * un único reloj (AudioContext.currentTime) para audio, cursor y FX.
 *
 * PARTITURA → VexFlow (vendorizado local en vendor/vexflow.js). Una línea por voz,
 *             plicas arriba, contenido dentro del compás, indicador de tresillo
 *             conmutable (solo visual).
 * INFANTIL  → SVG propio. Espaciado por duración SIN solapamiento (jerarquía
 *             negra/blanca > corchea > semicorchea) + autofit por viewBox.
 * DOS VOCES (deuda BY): obj.voces = [voz 1, voz 2] → dos líneas alineadas por tiempo
 *             (👏 voz 1 · 🥁 voz 2); la voz 2 suena con un golpe grave. Silencios
 *             (e.rest) se dibujan pero no suenan ni destellan.
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
        .ritmo-inf-sil { fill: #cbd5e1; }
        .ritmo-voz-lbl { font: 26px "Segoe UI Emoji","Apple Color Emoji",system-ui,sans-serif;
                         text-anchor:middle; dominant-baseline:central; }
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
                    evIdx: e.evIdx, mi, fig: e.fig, dotted: e.dotted, tuplet: e.tuplet, rest: !!e.rest,
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
        // Voces (deuda BY): una línea por voz, alineadas por tiempo (mismo formateo).
        const voces = obj.voces || [{ measures: obj.measures }];
        const GAP_VOZ = 90;                              // distancia entre las líneas de las voces
        const LBL_W = voces.length > 1 ? 44 : 0;         // espacio para el ícono de cada voz
        let x = 8 + LBL_W;
        const lineYs = voces.map((_, vi) => Y_STAVE + 20 + vi * GAP_VOZ);   // se fijan con la línea real
        const RIGHT_PAD = 20;

        obj.measures.forEach((_, mi) => {
            const porVoz = voces.map(vz => {
                const measure = vz.measures[mi];
                // 1) Construir notas VexFlow (plicas SIEMPRE arriba); silencio = figura + 'r'
                const notes = [];
                const grupos = {};      // groupId → [notes]  (para tresillos)
                measure.events.forEach(e => {
                    let code = DUR_VEX[e.fig] + (e.dotted ? 'd' : '') + (e.rest ? 'r' : '');
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
                return { measure, notes, tuplets, voice };
            });
            const vfVoces = porVoz.map(p => p.voice);

            // 3) Ancho del compás = ancho mínimo musical + paddings (evita desborde)
            const fmt = new VF.Formatter();
            vfVoces.forEach(v => fmt.joinVoices([v]));
            const minW = fmt.preCalculateMinTotalWidth(vfVoces);
            const leftMods = (mi === 0) ? 42 : 12;    // hueco para cifra de compás
            // Aire: ensanchamos el compás sobre el mínimo musical para que las figuras
            // (p.ej. negras) respiren y no queden pegadas. El desborde se evita porque
            // formateamos las notas al ancho útil real del compás (con RIGHT_PAD).
            const measureW = Math.ceil(minW * AIR + leftMods + RIGHT_PAD);

            const staves = porVoz.map((p, vi) => {
                const stave = new VF.Stave(x, Y_STAVE + vi * GAP_VOZ, measureW);
                // Una sola línea: mostrar únicamente la línea central de las 5
                stave.setConfigForLines([
                    { visible: false }, { visible: false }, { visible: true }, { visible: false }, { visible: false },
                ]);
                if (mi === 0) stave.addTimeSignature(obj.meter.num + '/' + obj.meter.den);
                stave.setContext(ctx).draw();
                if (mi === 0) lineYs[vi] = stave.getYForLine(2);   // línea central (baseline musical)
                return stave;
            });

            // 4) Formatear las notas DENTRO del ancho útil del compás (todas las voces juntas:
            //    lo que suena a la vez queda alineado en vertical)
            const startX = Math.max(...staves.map(st => st.getNoteStartX()));
            const usable = (staves[0].getX() + staves[0].getWidth()) - startX - RIGHT_PAD;
            fmt.format(vfVoces, Math.max(40, usable));

            // Barrado según compás: 3/8 en 6/8, 2/8 en 4/4 — plicas arriba
            const groupsBeam = obj.meter.den === 8 ? [new VF.Fraction(3, 8)] : [new VF.Fraction(2, 8)];
            porVoz.forEach((p, vi) => {
                const beams = VF.Beam.generateBeams(p.notes, { groups: groupsBeam, stem_direction: VF.Stem.UP });

                p.voice.draw(ctx, staves[vi]);
                beams.forEach(b => b.setContext(ctx).draw());
                // Tresillo: SIEMPRE se dibuja (reserva su espacio vertical → el toggle no
                // desplaza la partitura). Si el indicador está OFF, se oculta con
                // visibility:hidden, que sigue contando en getBBox (misma geometría/escala).
                if (p.tuplets.length) {
                    const gTup = ctx.openGroup('ritmo-tuplet-layer');
                    p.tuplets.forEach(tp => tp.setContext(ctx).draw());
                    ctx.closeGroup();
                    if (!mostrarTresillo && gTup) gTup.style.visibility = 'hidden';
                }

                // 5) Anclas tick→X (posición real de cada nota en el layout de VexFlow)
                const cap = p.measure.capacityTicks;
                p.measure.events.forEach(e => {
                    anclas.push({ t: mi * cap + e.startTick, x: evMap[e.evIdx].getAbsoluteX() });
                });
            });
            x += measureW;
        });

        const totalW = x + 4;
        renderer.resize(totalW, CANVAS_H);
        const svg = wrap.querySelector('svg');
        // Ícono de cada voz a la izquierda de su línea (solo con dos voces).
        if (voces.length > 1) voces.forEach((_, vi) =>
            svg.appendChild(txt(8 + LBL_W / 2, lineYs[vi], vi === 0 ? '👏' : '🥁', 'ritmo-voz-lbl')));

        let bb;
        try { bb = svg.getBBox(); } catch (_) { bb = { x: 0, y: 0, width: totalW, height: CANVAS_H }; }
        if (!bb.width || !bb.height) bb = { x: 0, y: 0, width: totalW, height: CANVAS_H };

        // CURSOR: banda SIMÉTRICA respecto de la línea musical, de tamaño fijo en
        // unidades de viewBox → longitud consistente e independiente de la densidad
        // (negras, corcheas o semicorcheas dan el mismo cursor). Centrado por construcción.
        const curTop = lineYs[0] - CURSOR_HALF, curBot = lineYs[lineYs.length - 1] + CURSOR_HALF;

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

    const FILA_INF = 90;             // distancia entre las filas de las dos voces (deuda BY)

    function renderInfantil(obj, contenedor, opts) {
        const voces = obj.voces || [{ measures: obj.measures }];
        const filas = voces.map(vz => aplanar({ measures: vz.measures }));

        // Paso visual por instante de ataque (de cualquier voz): separación ≥ (ancho clap +
        // GAP_MIN), y además crece con la duración hasta el instante siguiente (jerarquía
        // negra/blanca > corchea > semicorchea). Con una voz sin silencios equivale a la
        // duración de cada figura. NO altera el modelo: solo posiciona en X.
        const ticks = [...new Set(filas.flat().map(e => e.absTick))].sort((a, b) => a - b);
        const xDe = new Map();
        let x = PAD_INF;
        ticks.forEach((t, k) => {
            xDe.set(t, x);
            const dur = (k + 1 < ticks.length ? ticks[k + 1] : obj.ticksPorRep) - t;
            x += Math.max(CLAP_W + GAP_MIN, CLAP_W + dur * 1.4);   // piso anti-solape + duración
        });
        const anclas = ticks.map(t => ({ t, x: xDe.get(t) }));
        const totalW = x + PAD_INF;
        const H = H_INF + (filas.length - 1) * FILA_INF;
        const yFila = vi => H_INF / 2 + vi * FILA_INF;

        const wrap = document.createElement('div');
        wrap.className = 'ritmo-wrap';
        contenedor.appendChild(wrap);
        const svg = svgEl('svg');
        wrap.appendChild(svg);

        // Recuadros de tresillo (debajo de los 👏), usando las X ya calculadas
        filas.forEach((evs, vi) => {
            const gruposTup = {};
            evs.forEach(e => { if (e.tuplet) (gruposTup[e.mi + e.tuplet.groupId] ||= []).push(xDe.get(e.absTick)); });
            Object.values(gruposTup).forEach(xs => {
                const x1 = xs[0], x2 = xs[xs.length - 1];
                svg.appendChild(svgEl('rect', {
                    class: 'ritmo-inf-group', rx: 14,
                    x: x1 - CLAP_W / 2 - 8, y: yFila(vi) - 34, width: (x2 - x1) + CLAP_W + 16, height: 68,
                }));
            });
        });

        // 👏 voz 1 · 🥁 voz 2; un silencio es un punto gris (no suena ni destella).
        const evMap = {};
        filas.forEach((evs, vi) => evs.forEach(e => {
            const g = svgEl('g', { class: 'ritmo-ev', 'data-ev-idx': e.evIdx });
            if (e.rest) g.appendChild(svgEl('circle', { class: 'ritmo-inf-sil', cx: xDe.get(e.absTick), cy: yFila(vi), r: 6 }));
            else g.appendChild(txt(xDe.get(e.absTick), yFila(vi), vi === 0 ? '👏' : '🥁', 'ritmo-clap'));
            svg.appendChild(g);
            evMap[e.evIdx] = g;
        }));

        hacerResponsive(svg, totalW, H);

        // Anclas de borde para el cursor
        const acCursor = anclas.map(a => ({ t: a.t, x: a.x }));
        acCursor.unshift({ t: 0, x: acCursor.length ? acCursor[0].x : PAD_INF });
        acCursor.push({ t: obj.ticksPorRep, x: totalW - PAD_INF });
        acCursor.sort((a, b) => a.t - b.t);
        const tickToX = crearTickToX(acCursor);

        const setCur = montarCursor(svg, 4, H - 4, tickToX(0));
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
    // Ruido con envolvente de PALMADA (clap): varias micro-ráfagas seguidas de
    // una cola corta, imitando el rebote de las manos al aplaudir. Sustituye al
    // tick anterior (ruido con caída simple). Reutiliza el mismo mecanismo de
    // buffer de ruido + biquad; no introduce dependencias nuevas.
    function bufferRuido(c) {
        if (_noise && _noise.sampleRate === c.sampleRate) return _noise;
        const sr = c.sampleRate;
        const dur = 0.20, n = Math.ceil(sr * dur);
        const buf = c.createBuffer(1, n, sr);
        const d = buf.getChannelData(0);
        const taps = [0, 0.009, 0.018, 0.027];   // ráfagas del golpe de palmas
        for (let i = 0; i < n; i++) {
            const t = i / sr;
            let env = 0;
            for (const tp of taps) if (t >= tp) env += Math.exp(-(t - tp) * 300);
            env += 0.28 * Math.exp(-t * 22);      // cola corta
            d[i] = (Math.random() * 2 - 1) * Math.min(env, 1);
        }
        _noise = buf;
        return buf;
    }
    function programarGolpe(c, t, salida) {
        const buf = bufferRuido(c);
        const src = c.createBufferSource(); src.buffer = buf;
        const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 1150; bp.Q.value = 0.7;
        const g = c.createGain(); g.gain.value = 1.0;   // envolvente ya horneada en el buffer
        src.connect(bp).connect(g).connect(salida);
        src.start(t); src.stop(t + buf.duration + 0.02);
        return src;
    }

    // ── GOLPE GRAVE (voz 2, deuda BY): tipo tambor/bombo — seno con caída de altura
    // + un golpecito de ruido filtrado para el ataque. Ignora la duración (percusivo).
    function programarGrave(c, t, salida) {
        const o = c.createOscillator(); o.type = 'sine';
        o.frequency.setValueAtTime(150, t);
        o.frequency.exponentialRampToValueAtTime(55, t + 0.18);
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(1.0, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.38);
        o.connect(g).connect(salida);
        o.start(t); o.stop(t + 0.42);
        const src = c.createBufferSource(); src.buffer = bufferRuido(c);
        const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 900;
        const g2 = c.createGain();
        g2.gain.setValueAtTime(0.35, t);
        g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
        src.connect(lp).connect(g2).connect(salida);
        src.start(t); src.stop(t + 0.08);
        return [o, src];
    }

    // ── PIANO (patrón): síntesis de una nota tipo piano (C4 = 261.63 Hz).
    // Respeta la DURACIÓN real de la figura (durSec): ataque rápido + decaimiento
    // progresivo que SOSTIENE hasta el final de la figura y luego libera (release).
    // No es un oscilador de volumen constante ni desaparece antes de tiempo.
    function programarPiano(c, t, salida, freq, durSec) {
        const dur   = Math.max(0.25, durSec || 0);   // cubre la duración musical (piso audible)
        const rel   = 0.12;                           // cola de liberación
        const total = dur + rel;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.9, t + 0.006);                       // ataque rápido
        g.gain.exponentialRampToValueAtTime(0.30, t + Math.min(dur * 0.5, 0.35));  // caída inicial (percusivo)
        g.gain.exponentialRampToValueAtTime(0.12, t + dur);                        // sostiene hasta el fin de la figura
        g.gain.exponentialRampToValueAtTime(0.0006, t + total);                    // release
        g.connect(salida);
        const parciales = [[1, 1.0], [2, 0.42], [3, 0.20], [4, 0.09]];
        const oscs = [];
        for (const [mult, amp] of parciales) {
            const o = c.createOscillator();
            o.type = 'triangle';
            o.frequency.value = freq * mult;
            const gp = c.createGain(); gp.gain.value = amp;
            o.connect(gp).connect(g);
            o.start(t); o.stop(t + total + 0.05);
            oscs.push(o);
        }
        return oscs;   // varios osciladores → array de sources
    }

    // ── TICK de metrónomo/precuenta (canal independiente del patrón).
    // Timbre de metrónomo original (blip square). La ALTURA la aporta `reg` según el
    // timbre del patrón (ver TICK_REG): mismo tick, distinto registro. Pulso 1 = más agudo.
    function programarTick(c, t, salida, agudo, reg) {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = 'square';
        o.frequency.value = agudo ? reg.agudo : reg.normal;
        const dur = 0.035, peak = (agudo ? 0.32 : 0.18) * (reg.vol || 1);   // nivel según timbre; ratio acento/normal intacto
        g.gain.setValueAtTime(peak, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(salida);
        o.start(t); o.stop(t + dur + 0.01);
        return o;
    }

    // Registro de TIMBRES del PATRÓN. Cada timbre programa UN ataque y devuelve source(s).
    // El timbre se asocia a la VOZ, no al player (arquitectura lista para 2+ voces).
    const TIMBRES_PATRON = {
        palmas:  (c, t, out, durSec) => programarGolpe(c, t, out),               // el clap ignora la duración
        pianoC4: (c, t, out, durSec) => programarPiano(c, t, out, 392.00, durSec), // G4 (id conservado por compat)
        grave:   (c, t, out, durSec) => programarGrave(c, t, out),               // voz 2 (deuda BY)
    };

    // Registro del metrónomo según el timbre del patrón (MISMO tick, distinta altura):
    //  · palmas → algo más agudo que el registro base (1200/2000) para separarlo del clap;
    //  · piano  → algo más grave para que el piano no lo tape.
    const TICK_REG = {
        palmas:  { normal: 1400, agudo: 2300, vol: 1.35 },  // un poco más fuerte
        pianoC4: { normal: 1000, agudo: 1700, vol: 1.70 },  // todavía más fuerte (para no quedar tapado por el piano)
    };

    function crearPlayer(obj, layout, opts) {
        opts = opts || {};
        const secPorTick = 60 / (obj.bpm * obj.meter.beatTicks);
        const tpr = obj.ticksPorRep;
        const totalTicks = tpr * obj.reps;

        // Ataques del patrón dentro de UNA repetición (absTick + evIdx), por voz. Los
        // silencios no son ataques: no suenan ni destellan (deuda BY).
        const ataquesPorVoz = (obj.voces || [{ measures: obj.measures }]).map(vz => {
            const at = [];
            vz.measures.forEach((m, mi) => m.events.forEach(e => {
                if (!e.rest) at.push({ absTick: mi * m.capacityTicks + e.startTick, durTick: e.durTick, evIdx: e.evIdx });
            }));
            return at;
        });
        const ataquesRep = ataquesPorVoz.flat();

        // Lista GLOBAL (todas las reps) para cursor/FX — común a todas las voces.
        const ataquesGlobal = [];
        for (let r = 0; r < obj.reps; r++)
            for (const a of ataquesRep)
                ataquesGlobal.push({ t: (a.absTick + r * tpr) * secPorTick, evIdx: a.evIdx });
        ataquesGlobal.sort((a, b) => a.t - b.t);

        // CANAL PATRÓN — voces, cada una con su timbre: la voz 1 con el del patrón
        // (palmas/piano), la voz 2 con el golpe grave. `opts.voces` puede reemplazarlas.
        const voces = opts.voces || ataquesPorVoz.map((at, vi) =>
            ({ timbre: vi === 0 ? (opts.timbrePatron || 'palmas') : 'grave', ataques: at }));

        // PRECUENTA — 4/4: 1 compás · 6/8: 2 compases (respeta meter.beats/beatTicks).
        const precountMeasures = opts.precuenta ? (obj.meter.group === 'compound' ? 2 : 1) : 0;
        const offsetPatron = precountMeasures * obj.meter.capacityTicks * secPorTick;  // desplaza el arranque del patrón

        let raf = null, sources = [], playing = false, t0 = 0, fired = -1;
        let busPatron = null, busMetro = null, offActual = 0;

        function loop() {
            const elPat = audioCtx().currentTime - (t0 + offActual);      // tiempo del PATRÓN
            if (elPat >= totalTicks * secPorTick) { finalizar(); return; }
            layout.setCursor(elPat < 0 ? 0 : (elPat / secPorTick) % tpr); // durante la precuenta: cursor en 0
            while (fired + 1 < ataquesGlobal.length && ataquesGlobal[fired + 1].t <= elPat) {
                fired++; layout.fx(ataquesGlobal[fired].evIdx);
            }
            raf = requestAnimationFrame(loop);
        }
        // sinPrecuenta: al reanudar tras un cambio de BPM/reps NO se vuelve a oír la precuenta.
        function play(sinPrecuenta) {
            stop();
            const c = audioCtx();
            if (c.state === 'suspended') c.resume();
            playing = true; fired = -1;
            // Buses independientes: patrón ↔ metrónomo/precuenta.
            busPatron = c.createGain(); busPatron.gain.value = 1.0; busPatron.connect(c.destination);
            busMetro  = c.createGain(); busMetro.gain.value  = 1.0; busMetro.connect(c.destination);
            const pm = sinPrecuenta ? 0 : precountMeasures;
            offActual = sinPrecuenta ? 0 : offsetPatron;
            t0 = c.currentTime + 0.12;
            // Registro del metrónomo adaptado al timbre de la voz del patrón (mismo tick).
            const regTick = TICK_REG[(voces[0] && voces[0].timbre)] || TICK_REG.palmas;

            // Precuenta (canal metrónomo). Acento (agudo) en el pulso 1 de cada compás.
            for (let p = 0; p < pm; p++)
                for (let k = 0; k < obj.meter.beats; k++) {
                    const tick = p * obj.meter.capacityTicks + k * obj.meter.beatTicks;
                    sources.push(programarTick(c, t0 + tick * secPorTick, busMetro, k === 0, regTick));
                }

            // Metrónomo durante el patrón (canal metrónomo). Un tick por pulso, acento en el 1.
            if (opts.metronomo)
                for (let r = 0; r < obj.reps; r++)
                    for (let mi = 0; mi < obj.measures.length; mi++)
                        for (let k = 0; k < obj.meter.beats; k++) {
                            const tick = r * tpr + mi * obj.meter.capacityTicks + k * obj.meter.beatTicks;
                            sources.push(programarTick(c, t0 + offActual + tick * secPorTick, busMetro, k === 0, regTick));
                        }

            // Patrón por voces (canal patrón). El timbre viaja con la voz.
            for (const voz of voces) {
                const fn = TIMBRES_PATRON[voz.timbre] || TIMBRES_PATRON.palmas;
                for (let r = 0; r < obj.reps; r++)
                    for (const a of voz.ataques) {
                        const durSec = (a.durTick || 0) * secPorTick;   // duración real de la figura
                        const res = fn(c, t0 + offActual + (a.absTick + r * tpr) * secPorTick, busPatron, durSec);
                        if (Array.isArray(res)) for (const s of res) sources.push(s); else sources.push(res);
                    }
            }

            if (opts.onState) opts.onState('playing');
            raf = requestAnimationFrame(loop);
        }
        function detenerAudio() {
            sources.forEach(s => { try { s.stop(); } catch (_) {} }); sources = [];
            if (busPatron) { try { busPatron.disconnect(); } catch (_) {} busPatron = null; }
            if (busMetro)  { try { busMetro.disconnect();  } catch (_) {} busMetro  = null; }
        }
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
