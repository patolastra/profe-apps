// ═══════════════════════════════════════════════════════════════════════
// Cuaderno — el cuaderno de música del curso (deuda CJ, 2026-10-21)
// Lo que se escribe en el cuaderno físico de 1° a 8°: un cuaderno rosado por curso y año,
// con hojas libres (fecha, texto e imágenes coloreadas). Se arma desde el Plan y la bitácora
// del Planificador y se mira en Cursos. Estilos en comun/cuaderno.css; tabla `cuaderno_hojas`
// e imágenes en el bucket `cuaderno-imagenes` (supabase/cuaderno.sql).
//
// Cuatro formas de verlo: 1 cerrado · 2 abierto, dos páginas · 3 abierto, una página (con zoom)
// · 4 abierto y horizontal, una página (el cuaderno girado). Cada hoja tiene su orientación
// ('v' | 'h'): una hoja escrita con el cuaderno girado se ve de lado en 1–3 y derecha en 4.
// La hoja se pasa arrastrándola (sigue al dedo o al mouse), con clic en el borde, ← → o deslizando.
// Formas 3 y 4 = una página del par abierto vista de cerca (como la forma 2, recortada por una "ventana"): entre
// las dos páginas del mismo par el cuaderno se desliza; entre pares se da vuelta la hoja y la vista la acompaña.
// Se ve una franja de la otra página del par, al otro lado del espiral, para no perder la referencia.
// Página en blanco: hoja sin fecha ni contenido (pieza { t: 'blanco' }), como saltarse una página.
//
// Uso:
//   Cuaderno.abrir({ sb, contextoId, ctxNombre, anio, fecha, sesionId, crear, alCerrar })
//     fecha: abre en la hoja de esa fecha (y es la fecha sugerida de una hoja nueva)
//     crear: true en el Plan y la bitácora (＋ Nueva hoja); en Cursos solo ✏️ por hoja
//   Cuaderno.cursos → nombres de los contextos que tienen cuaderno (1° a 8°)
//   Cuaderno.espejoEnPizarra(sb, sesionId) → la Pizarra muestra el cuaderno que el profe proyecta (paso 2):
//     con la clase en curso, 📽️ Pizarra en el cuaderno del Plan lo manda por el canal 'profe-espejo-cuaderno'
//     (estado + cada hoja que se pasa); la Pizarra lo hojea igual, sin barras ni gestos.
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';

    const PW = 860, PH = 1120;                    // tamaño fijo de la hoja (cuaderno college)
    const BUCKET = 'cuaderno-imagenes';
    const KEY = 'profe_cuaderno';
    const CURSOS = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SEPTIMO', 'OCTAVO'];
    const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const TAMS = [{ t: 's', lbl: 'Chica' }, { t: 'm', lbl: 'Mediana' }, { t: 'l', lbl: 'Grande' }, { t: 'hoja', lbl: 'Hoja completa' }];

    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const hoyISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    // "Lunes 13/10/26", como se copia en el cuaderno (igual que la Fecha en la Pizarra)
    function fechaCuaderno(iso) {
        const d = new Date(String(iso).slice(0, 10) + 'T12:00:00');
        return `${DIAS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    }
    const fechaCorta = iso => fechaCuaderno(iso).replace(/^(\S{3})\S*/, '$1');
    const sinFecha = h => (h?.contenido || []).some(p => p.t === 'blanco');   // página en blanco (sin fecha)
    const FR = 130;   // ancho de la franja de la otra página del par (formas 3 y 4)

    // ── Preferencias (en este equipo): forma, espirales, sonido; papel y letra por curso ──
    function prefs() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (_) { return {}; } }
    function guardarPrefs(cambios) { if (S?.op.espejo) return; try { localStorage.setItem(KEY, JSON.stringify({ ...prefs(), ...cambios })); } catch (_) {} }
    function prefCurso(ctx) { return { papel: 'lineas', letra: 'ligada', ...((prefs().cursos || {})[ctx] || {}) }; }
    function guardarPrefCurso(ctx, cambios) {
        if (S?.op.espejo) return;
        const p = prefs(); p.cursos = p.cursos || {};
        p.cursos[ctx] = { ...prefCurso(ctx), ...cambios };
        guardarPrefs({ cursos: p.cursos });
    }

    // ── Estado ──────────────────────────────────────────────────────────
    let S = null;      // cuaderno abierto
    let raiz = null;   // overlay
    const $ = sel => raiz.querySelector(sel);

    // Páginas que se hojean: las hojas + (en el Plan) una hoja en blanco para crear la siguiente.
    function pags() {
        const p = S.hojas.slice();
        if (S.op.crear) p.push({ especial: 'nueva' });
        else if (S.op.espejo) p.push({ especial: 'blanco' });   // la Pizarra cuenta las hojas igual que el Plan
        if (!p.length) p.push({ especial: 'vacia' });
        return p;
    }
    // Forma 2: pliego k = [izquierda, derecha]; el pliego 0 empieza con el interior de la tapa.
    const maxPliego = () => Math.floor(pags().length / 2);
    const pliego = () => Math.floor((S.i + 1) / 2);
    function izqDe(k) { return k === 0 ? { especial: 'tapa-int' } : pags()[2 * k - 1]; }
    function derDe(k) { return pags()[2 * k] || { especial: 'tapa-int' }; }
    function focoDePliego(k) { const n = pags().length; return 2 * k < n ? 2 * k : 2 * k - 1; }

    function urlImg(path) { return S.op.sb.storage.from(BUCKET).getPublicUrl(path).data.publicUrl; }

    // ── Una hoja en HTML ────────────────────────────────────────────────
    function htmlPag(h) {
        const papel = S.pref.papel;
        if (!h) return '';
        if (h.especial === 'tapa') {
            const info = typeof contextoInfo === 'function' ? contextoInfo(S.op.ctxNombre) : { label: S.op.ctxNombre, icono: '' };
            return `<div class="cdn-pag tapa"><div class="cdn-etiqueta"><div class="m">Música</div>
                <div class="c">${esc(info.label)} básico</div><div class="a">${S.anio}</div></div><div class="cdn-esquina"></div></div>`;
        }
        if (h.especial === 'tapa-int') return '<div class="cdn-pag tapa-int"></div>';
        if (h.especial === 'reverso') return `<div class="cdn-pag reverso ${papel}"></div>`;
        if (h.especial === 'blanco') return `<div class="cdn-pag ${papel}"></div>`;
        if (h.especial === 'nueva') return `<div class="cdn-pag nueva ${papel}"><button class="cdn-nueva-btn" data-accion="nueva">＋ Nueva hoja</button></div>`;
        if (h.especial === 'vacia') return `<div class="cdn-pag vacia ${papel}">Todavía no hay hojas en este cuaderno.</div>`;
        const piezas = (h.contenido || []).map(p => {
            if (p.t === 'img') {
                const src = p.url || (p.path ? urlImg(p.path) : '');
                return src ? `<img class="cdn-img ${esc(p.tam || 'm')}" src="${esc(src)}" alt="" draggable="false">` : '<div class="cdn-img m cargando"></div>';
            }
            return p.x && p.x.trim() ? `<div class="cdn-txt">${EditorBloques.html(p.x)}</div>` : '';
        }).join('');
        return `<div class="cdn-pag ${papel}" data-hoja="${h.id || ''}"><div class="cdn-cont${h.orientacion === 'h' ? ' h' : ''}">
            <div class="cdn-ajuste">${sinFecha(h) ? '' : `<div class="cdn-fecha">${esc(fechaCuaderno(h.fecha))}</div>`}${piezas}</div></div></div>`;
    }
    // Si lo escrito no cabe, la hoja completa se achica (como escribir más apretado).
    function ajustar(cont) {
        cont.querySelectorAll('.cdn-cont').forEach(c => {
            const a = c.querySelector('.cdn-ajuste');
            a.style.transform = ''; a.style.width = '';
            const f = Math.min(1, c.clientHeight / Math.max(1, a.scrollHeight));
            if (f < 1) { a.style.transform = `scale(${f})`; a.style.width = (100 / f) + '%'; }
        });
        cont.querySelectorAll('img.cdn-img').forEach(img => {
            if (!img.complete) img.addEventListener('load', () => ajustar(cont), { once: true });
        });
    }

    // ── Dibujar el libro según la forma ─────────────────────────────────
    function espiral(x) {
        let h = `<div class="cdn-espiral" style="left:${x - 28}px">`;
        for (let i = 0; i < 34; i++) h += `<div class="cdn-anillo" style="top:${(i * PH / 34 + 9).toFixed(1)}px"></div>`;
        return h + '</div>';
    }
    // Formas 3 y 4: el par completo dentro de una ventana que deja ver la página en foco + la franja de la otra.
    const unaPagina = () => S.modo === 3 || S.modo === 4;
    const dosPag = () => S.modo === 2 || S.modo === 5;    // vista 5 = la 2 girada (horizontal, dos páginas)
    const girado = () => S.modo === 4 || S.modo === 5;    // cuaderno horizontal: espiral arriba / al medio
    function anchoLibro() { return S.modo === 1 ? PW : 2 * PW; }
    const ladoDe = i => (i % 2 ? 'izq' : 'der');          // en el par: impar = izquierda, par = derecha
    function despDe(lado) { return unaPagina() && lado === 'der' ? PW - FR : 0; }   // cuánto se corre el par en la ventana
    function anchoVentana() { return unaPagina() ? PW + FR : anchoLibro(); }
    function pintar() {
        const Vn = $('.cdn-ventana'), L = $('.cdn-libro');
        L.style.width = anchoLibro() + 'px'; L.style.height = PH + 'px';
        Vn.style.width = anchoVentana() + 'px'; Vn.style.height = PH + 'px';
        Vn.classList.toggle('recorta', unaPagina());
        let h = '';
        if (S.modo === 1) {
            h = `<div class="cdn-slot der cerrado" style="left:0">${htmlPag({ especial: 'tapa' })}</div>` + espiral(0);
        } else {
            const k = pliego(), lado = ladoDe(S.i), una = unaPagina();
            h = `<div class="cdn-slot izq${una && lado !== 'izq' ? ' otra' : ''}" style="left:0">${htmlPag(izqDe(k))}</div>
                 <div class="cdn-slot der${una && lado !== 'der' ? ' otra' : ''}" style="left:${PW}px">${htmlPag(derDe(k))}</div>` + espiral(PW);
        }
        L.classList.remove('deslizar', 'en3d');
        L.innerHTML = h;
        S.desp = S.modo === 1 ? 0 : despDe(ladoDe(S.i));
        L.style.transform = `translateX(${-S.desp}px)`;
        ajustar(L);
        transformar();
        pintarBarra();
    }
    // Escala la ventana a la pantalla (forma 4: girada); en la forma 3 suma el zoom y el arrastre.
    function escala() {
        const r = $('.cdn-escena').getBoundingClientRect();
        const gira = girado(), ancho = anchoVentana();
        const w = (gira ? PH : ancho) + 80, hh = (gira ? ancho : PH) + 40;
        return Math.min(r.width / w, r.height / hh) * (unaPagina() ? S.zoom : 1);
    }
    function transformar() {
        S.k = escala();
        limitarPan();
        $('.cdn-ventana').style.transform = `translate(-50%, -50%) translate(${S.panX * S.k}px, ${S.panY * S.k}px)${girado() ? ' rotate(90deg)' : ''} scale(${S.k})`;
        emitirEstado();
    }
    // Con zoom (vistas 3 y 4) se recorre la hoja sin salirse de sus bordes: el recorrido (panX/panY, en unidades de
    // la hoja, sin girar) no deja ver más allá del borde de la ventana. Sin zoom, centrado.
    function limitarPan() {
        if (!unaPagina() || S.zoom <= 1.001) { S.panX = S.panY = 0; return; }
        const r = $('.cdn-escena').getBoundingClientRect();
        const w = anchoVentana() * S.k, h = PH * S.k;
        const [sw, sh] = girado() ? [h, w] : [w, h];
        const mx = Math.max(0, (sw - r.width) / 2 + 12) / S.k, my = Math.max(0, (sh - r.height) / 2 + 12) / S.k;
        S.panX = clamp(S.panX, -mx, mx); S.panY = clamp(S.panY, -my, my);
    }
    function ponerDesp(d) { S.desp = d; $('.cdn-libro').style.transform = `translateX(${-d}px)`; }

    // ── Barra y pie ─────────────────────────────────────────────────────
    function hojaFoco() { const p = pags()[S.i]; return p && !p.especial ? p : null; }
    function pintarBarra() {
        raiz.querySelectorAll('[data-modo]').forEach(b => b.classList.toggle('on', +b.dataset.modo === S.modo));
        raiz.querySelectorAll('[data-papel]').forEach(b => b.classList.toggle('on', b.dataset.papel === S.pref.papel));
        raiz.querySelectorAll('[data-letra]').forEach(b => b.classList.toggle('on', b.dataset.letra === S.pref.letra));
        raiz.classList.toggle('espirales', S.espirales);
        raiz.classList.toggle('ligada', S.pref.letra === 'ligada');
        raiz.classList.toggle('imprenta', S.pref.letra === 'imprenta');
        $('[data-accion="espirales"]').classList.toggle('on', S.espirales);
        $('[data-accion="sonido"]').textContent = S.sonido ? '🔈' : '🔇';
        $('.cdn-zoom').style.visibility = unaPagina() ? 'visible' : 'hidden';
        $('.cdn-zoom-n').textContent = Math.round(S.zoom * 100) + '%';
        const h = hojaFoco();
        $('[data-accion="editar"]').style.visibility = h && S.modo !== 1 ? 'visible' : 'hidden';
        $('[data-accion="crear"]').style.visibility = S.op.crear ? 'visible' : 'hidden';
        $('[data-accion="blanca"]').style.visibility = S.op.crear && S.modo !== 1 ? 'visible' : 'hidden';
        const bp = $('[data-accion="pizarra"]');
        bp.style.visibility = claseAqui() ? 'visible' : 'hidden';
        bp.classList.toggle('on', !!S.proy);
        // Pie
        const n = S.hojas.length;
        let lbl = '';
        if (S.modo === 1) lbl = `Tapa · ${n} ${n === 1 ? 'hoja' : 'hojas'}`;
        else if (dosPag()) {
            const k = pliego(), a = izqDe(k), b = derDe(k);
            const fs = [a, b].filter(x => x && !x.especial);
            lbl = fs.length ? fs.map(x => `${S.hojas.indexOf(x) + 1}`).join('–') + ` de ${n} · ` + fs.map(x => sinFecha(x) ? 'en blanco' : fechaCorta(x.fecha)).join(' · ') : (n ? `${n} hojas` : 'Sin hojas');
        } else {
            lbl = h ? `Hoja ${S.hojas.indexOf(h) + 1} de ${n} · ${sinFecha(h) ? 'en blanco' : fechaCuaderno(h.fecha)}` : (S.op.crear ? 'Nueva hoja' : 'Sin hojas');
        }
        $('.cdn-lbl').textContent = lbl;
        $('[data-accion="ant"]').disabled = S.modo === 1 || (dosPag() ? pliego() === 0 : S.i === 0);
        $('[data-accion="sig"]').disabled = dosPag() ? pliego() >= maxPliego() : S.modo !== 1 && S.i >= pags().length - 1;
        // ↻ Girar para leer: la hoja en foco tiene la otra orientación que la forma en que se mira
        const girar = h && S.modo !== 1 && ((h.orientacion === 'h') !== girado());
        $('.cdn-girar').style.visibility = girar ? 'visible' : 'hidden';
        emitirEstado();
    }

    // ── En la Pizarra (paso 2) ──────────────────────────────────────────
    const CANAL_P = 'profe-espejo-cuaderno', KEY_P = 'profe_espejo_cuaderno';
    const canalP = 'BroadcastChannel' in window ? new BroadcastChannel(CANAL_P) : null;
    // La clase de esta sesión está en curso en este equipo (solo ahí se proyecta).
    function claseAqui() { return !!(S && !S.op.espejo && S.op.sesionId && window.ClaseVivo && ClaseVivo.get()?.sesionId === S.op.sesionId); }
    function estadoProy() {
        return { contextoId: S.op.contextoId, ctxNombre: S.op.ctxNombre, anio: S.anio, modo: S.modo, modoAbierto: S.modoAbierto, i: S.i,
            espirales: S.espirales, papel: S.pref.papel, letra: S.pref.letra, zoom: S.zoom, panX: S.panX, panY: S.panY };
    }
    let ultimoProy = '';
    function emitirEstado(forzar) {
        if (!S?.proy) return;
        const e = estadoProy(), j = JSON.stringify(e);
        if (j === ultimoProy && !forzar) return;
        ultimoProy = j;
        const m = { tipo: 'estado', sesionId: S.op.sesionId, e };
        try { localStorage.setItem(KEY_P, JSON.stringify(m)); } catch (_) {}
        canalP?.postMessage(m);
    }
    function emitirPasar(dir) { if (S?.proy) canalP?.postMessage({ tipo: 'pasar', sesionId: S.op.sesionId, dir }); }
    function proyectar(on) {
        if (!S) return;
        S.proy = !!on && claseAqui();
        if (S.proy) emitirEstado(true);
        else { ultimoProy = ''; try { localStorage.removeItem(KEY_P); } catch (_) {} canalP?.postMessage({ tipo: 'off' }); }
        pintarBarra();
    }
    window.addEventListener('pagehide', () => { if (S?.proy) proyectar(false); });
    if (window.ClaseVivo) ClaseVivo.onCambio(() => { if (!S || raiz?.hidden) return; if (S.proy && !claseAqui()) proyectar(false); else pintarBarra(); });

    // Lado Pizarra: abre el mismo cuaderno a pantalla completa y sigue lo que hace el profe.
    let abriendo = null;
    function aplicarEstado(e) {
        if (!S?.op.espejo) return;
        if (S.anim) { S.pendEstado = e; return; }
        S.pendEstado = null;
        S.espirales = e.espirales; S.pref.papel = e.papel; S.pref.letra = e.letra;
        S.zoom = e.zoom || 1; S.panX = e.panX || 0; S.panY = e.panY || 0;
        S.modo = e.modo; S.modoAbierto = e.modoAbierto || 2;
        S.i = clamp(e.i | 0, 0, pags().length - 1);
        pintar();
    }
    // `sb` puede ser una función: la Pizarra crea su cliente de Supabase después de cargar.
    function espejoEnPizarra(sbODar, sesionId) {
        if (!canalP || !sesionId) return;
        const dar = typeof sbODar === 'function' ? sbODar : () => sbODar;
        const mostrar = async e => {
            if (abriendo) await abriendo;
            if (!S || !S.op.espejo || S.op.contextoId !== e.contextoId || S.anio !== e.anio) {
                let sb = dar();
                for (let n = 0; !sb && n < 80; n++) { await new Promise(r => setTimeout(r, 250)); sb = dar(); }
                if (!sb) return;
                abriendo = abrir({ sb, contextoId: e.contextoId, ctxNombre: e.ctxNombre, anio: e.anio, espejo: true });
                await abriendo; abriendo = null;
                try { window.Recurrentes?.alProyectar?.(); } catch (_) {}
            }
            aplicarEstado(e);
        };
        canalP.onmessage = ev => {
            const m = ev.data || {};
            if (m.tipo === 'off') { if (S?.op.espejo) cerrar(); return; }
            if (m.sesionId !== sesionId) return;
            if (m.tipo === 'estado' && m.e) mostrar(m.e);
            else if (m.tipo === 'pasar' && S?.op.espejo && !S.anim && !abriendo) pasar(m.dir);
        };
        try {
            const m = JSON.parse(localStorage.getItem(KEY_P) || 'null');
            if (m && m.sesionId === sesionId && m.e) mostrar(m.e);
        } catch (_) {}
    }

    // ── Pasar la hoja ───────────────────────────────────────────────────
    // Una hoja que gira sobre el espiral: ángulo 0 = tendida a la derecha, −180 = tendida a la izquierda.
    // Frente = derecha del pliego a, dorso = izquierda del pliego a+1 (las tres formas abiertas). En las formas 3 y 4
    // la vista acompaña a la hoja: de la derecha del par a la izquierda del siguiente (o al revés al volver).
    function prepararVolteo(dir) {
        const L = $('.cdn-libro');
        if (S.modo === 1) return null;
        const k = pliego(), a = dir > 0 ? k : k - 1, una = unaPagina();
        if (a < 0 || a + 1 > maxPliego()) return null;
        const frente = derDe(a), atras = izqDe(a + 1), abajo = { izq: izqDe(a), der: derDe(a + 1) }, x0 = PW;
        const antes = S.i;
        const alTerminar = una
            ? fin => { if (fin) S.i = antes + dir; }
            : fin => { S.i = focoDePliego(fin ? (dir > 0 ? a + 1 : a) : k); };
        // Formas 3 y 4: corrimiento del par al empezar y al terminar (de la derecha a la izquierda o al revés).
        const d0 = S.desp || 0, d1 = una ? despDe(ladoDe(antes + dir)) : 0;
        const sI = L.querySelector('.cdn-slot.izq'), sD = L.querySelector('.cdn-slot.der');
        sI.innerHTML = htmlPag(abajo.izq);
        sD.innerHTML = htmlPag(abajo.der);
        sI.classList.remove('otra'); sD.classList.remove('otra');
        L.classList.add('en3d');   // profundidad solo mientras gira (quieto, la hoja se dibuja plana y nítida)
        const v = document.createElement('div');
        v.className = 'cdn-volteo';
        v.style.left = x0 + 'px';
        v.innerHTML = `<div class="cdn-cara frente">${htmlPag(frente)}<div class="cdn-sombra"></div></div>
            <div class="cdn-cara atras">${htmlPag(atras)}<div class="cdn-sombra"></div></div>`;
        L.appendChild(v);
        ajustar(L);
        const sF = v.querySelector('.frente .cdn-sombra'), sA = v.querySelector('.atras .cdn-sombra');
        const V = {
            dir, inicio: dir > 0 ? 0 : -180, th: dir > 0 ? 0 : -180,
            poner(th) {
                V.th = clamp(th, -180, 0);
                v.style.transform = `rotateY(${V.th}deg)`;
                const p = -V.th / 180;                     // 0 → 1
                sF.style.opacity = (p * 0.9).toFixed(3);
                sA.style.opacity = ((1 - p) * 0.9).toFixed(3);
                if (una) ponerDesp(d0 + (d1 - d0) * (dir > 0 ? p : 1 - p));
            },
            terminar(completar, ms) {
                const desde = V.th, hasta = completar ? (dir > 0 ? -180 : 0) : V.inicio;
                const dur = ms ?? Math.max(120, 520 * Math.abs(hasta - desde) / 180);
                return new Promise(res => {
                    const t0 = performance.now();
                    let listo = false;
                    const fin = () => { if (listo) return; listo = true; alTerminar(completar); pintar(); res(); };
                    const paso = t => {
                        if (listo) return;
                        const u = clamp((t - t0) / dur, 0, 1), e = 1 - Math.pow(1 - u, 3);
                        V.poner(desde + (hasta - desde) * e);
                        if (u < 1) return requestAnimationFrame(paso);
                        fin();
                    };
                    requestAnimationFrame(paso);
                    // Ventana sin dibujar (minimizada o detrás): la hoja igual queda pasada.
                    setTimeout(fin, dur + 400);
                });
            },
        };
        V.poner(V.inicio);
        return V;
    }
    async function pasar(dir, ms) {
        if (S.anim || S.arrastre) return false;
        if (S.modo === 1) { if (dir > 0) { emitirPasar(1); await abrirTapa(); } return true; }
        // Formas 3 y 4: hacia la otra página del mismo par, el cuaderno se desliza (no se da vuelta nada).
        if (unaPagina() && (dir > 0) === (ladoDe(S.i) === 'izq')) return deslizar(dir, ms);
        const V = prepararVolteo(dir);
        if (!V) return false;
        S.anim = true;
        emitirPasar(dir);
        sonar(ms);
        await V.terminar(true, ms);
        S.anim = false;
        if (S.pendEstado) aplicarEstado(S.pendEstado);
        return true;
    }
    // Deslizar el par hasta la otra página (formas 3 y 4).
    async function deslizar(dir, ms) {
        const j = S.i + dir;
        if (j < 0 || j > pags().length - 1) return false;
        S.anim = true;
        emitirPasar(dir);
        await moverPar(despDe(ladoDe(j)), j, ms);
        S.i = j;
        pintar();
        S.anim = false;
        if (S.pendEstado) aplicarEstado(S.pendEstado);
        return true;
    }
    // Lleva el par a un corrimiento con transición (y apaga/enciende la página que pasa a ser franja).
    function moverPar(d, iFoco, ms) {
        const L = $('.cdn-libro');
        const lado = ladoDe(iFoco);
        L.querySelector('.cdn-slot.izq')?.classList.toggle('otra', lado !== 'izq');
        L.querySelector('.cdn-slot.der')?.classList.toggle('otra', lado !== 'der');
        const dur = ms ?? 420;
        L.style.transitionDuration = dur + 'ms';
        L.classList.add('deslizar');
        ponerDesp(d);
        return new Promise(res => setTimeout(() => { L.classList.remove('deslizar'); L.style.transitionDuration = ''; res(); }, dur + 30));
    }
    // Abrir el cuaderno cerrado: la tapa gira y queda la forma abierta que se usó la última vez.
    async function abrirTapa() {
        S.anim = true;
        const L = $('.cdn-libro');
        L.querySelector('.cdn-slot').classList.remove('cerrado');
        L.querySelector('.cdn-slot').innerHTML = htmlPag(pags()[0]);
        L.classList.add('en3d');
        const v = document.createElement('div');
        v.className = 'cdn-volteo'; v.style.left = '0px';
        v.innerHTML = `<div class="cdn-cara frente">${htmlPag({ especial: 'tapa' })}</div><div class="cdn-cara atras">${htmlPag({ especial: 'tapa-int' })}</div>`;
        L.appendChild(v);
        ajustar(L);
        sonar();
        await new Promise(res => {
            const t0 = performance.now();
            const paso = t => {
                const u = clamp((t - t0) / 600, 0, 1), e = 1 - Math.pow(1 - u, 3);
                v.style.transform = `rotateY(${-180 * e}deg)`;
                v.style.opacity = e > 0.5 ? (1 - (e - 0.5) * 2).toFixed(3) : '1';
                if (u < 1) requestAnimationFrame(paso); else res();
            };
            requestAnimationFrame(paso);
            setTimeout(res, 1000);
        });
        S.i = 0;
        cambiarModo(S.modoAbierto || 2);
        S.anim = false;
        if (S.pendEstado) aplicarEstado(S.pendEstado);
    }
    // Índice: salta a una hoja pasando las hojas rápido (si son muchas, pasan algunas y llega).
    async function saltarA(i) {
        if (S.anim) return;
        if (S.modo === 1) cambiarModo(S.modoAbierto || 2);
        const destino = dosPag() ? Math.floor((i + 1) / 2) : i;
        const actual = () => dosPag() ? pliego() : S.i;
        const dir = Math.sign(destino - actual());
        let pasos = 0;
        while (actual() !== destino && pasos < (unaPagina() ? 10 : 6)) {
            if (!(await pasar(dir, 150))) break;
            pasos++;
        }
        if (actual() !== destino) { if (dosPag()) S.i = focoDePliego(destino); else S.i = destino; pintar(); }
        if (dosPag()) { S.i = i; pintarBarra(); }
    }

    // Sonido suave de papel (ruido filtrado, sin archivos).
    let actx = null;
    function sonar(ms) {
        if (!S.sonido || S.op.espejo) return;   // suena solo el computador del profe
        try {
            actx ||= new (window.AudioContext || window.webkitAudioContext)();
            const dur = Math.min(0.42, (ms || 420) / 1000 + 0.05), n = Math.floor(actx.sampleRate * dur);
            const buf = actx.createBuffer(1, n, actx.sampleRate), d = buf.getChannelData(0);
            for (let j = 0; j < n; j++) d[j] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(j / n * Math.PI * 3));
            const src = actx.createBufferSource(); src.buffer = buf;
            const f = actx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
            const t = actx.currentTime;
            f.frequency.setValueAtTime(2600, t); f.frequency.exponentialRampToValueAtTime(700, t + dur);
            const g = actx.createGain();
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.16, t + dur * 0.25); g.gain.linearRampToValueAtTime(0, t + dur);
            src.connect(f).connect(g).connect(actx.destination);
            src.start();
        } catch (_) {}
    }

    // ── Formas, zoom ────────────────────────────────────────────────────
    function cambiarModo(m) {
        if (m === S.modo) return;
        S.modo = m;
        if (m !== 1) S.modoAbierto = m;
        S.panX = S.panY = 0;
        if (m === 2) S.i = focoDePliego(pliego());
        guardarPrefs({ modo: m, modoAbierto: S.modoAbierto });
        pintar();
    }
    function ponerZoom(z) {
        S.zoom = clamp(z, 1, 4);
        if (S.zoom === 1) S.panX = S.panY = 0;
        guardarPrefs({ zoom: S.zoom });
        transformar(); pintarBarra();
    }
    function volverAlCentro() {
        const Vn = $('.cdn-ventana');
        Vn.classList.add('volver');
        S.panX = S.panY = 0; transformar();
        setTimeout(() => Vn.classList.remove('volver'), 300);
    }

    // ── Gestos: arrastrar la hoja, clic en el borde, deslizar, pellizcar, rueda ──
    // Coordenadas de pantalla → coordenadas del libro (sin escala; forma 4 girada 90°; con el corrimiento del par).
    function aLibro(cx, cy) {
        const r = $('.cdn-escena').getBoundingClientRect();
        const ox = cx - (r.left + r.width / 2) - S.panX * S.k, oy = cy - (r.top + r.height / 2) - S.panY * S.k;
        const [lx, ly] = girado() ? [oy, -ox] : [ox, oy];
        return { x: lx / S.k + anchoVentana() / 2 + (S.desp || 0), y: ly / S.k + PH / 2 };
    }
    const punteros = new Map();
    let clicPend = null;
    let G = null;   // gesto en curso
    function alBajar(e) {
        if (!S || S.op.espejo || S.editando || e.button > 0 || e.target.closest('button')) return;
        punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
        try { $('.cdn-escena').setPointerCapture(e.pointerId); } catch (_) {}
        if (punteros.size === 2 && unaPagina()) {
            const [p1, p2] = [...punteros.values()];
            G = { tipo: 'pellizco', d0: Math.hypot(p1.x - p2.x, p1.y - p2.y), z0: S.zoom };
            return;
        }
        const l = aLibro(e.clientX, e.clientY);
        G = { tipo: 'nada', x0: e.clientX, y0: e.clientY, l0: l, t0: performance.now(), ultX: e.clientX, ultY: e.clientY, ultT: performance.now(), pan0: [S.panX, S.panY] };
    }
    function alMover(e) {
        if (!G || !punteros.has(e.pointerId)) return;
        punteros.set(e.pointerId, { x: e.clientX, y: e.clientY });
        if (G.tipo === 'pellizco') {
            const [p1, p2] = [...punteros.values()];
            if (p2) ponerZoom(G.z0 * Math.hypot(p1.x - p2.x, p1.y - p2.y) / G.d0);
            return;
        }
        const dxS = e.clientX - G.x0, dyS = e.clientY - G.y0;
        if (G.tipo === 'nada') {
            if (Math.hypot(dxS, dyS) < 8 || S.anim) return;
            if (unaPagina() && S.zoom > 1.01) G.tipo = 'pan';
            else {
                const l = aLibro(e.clientX, e.clientY), dx = l.x - G.l0.x, dy = l.y - G.l0.y;
                if (Math.abs(dx) < Math.abs(dy) * 0.8 || S.modo === 1) { G.tipo = S.modo === 1 ? 'tapa' : 'ignorar'; return; }
                const dir = dx < 0 ? 1 : -1;
                // Formas 3 y 4, hacia la otra página del mismo par: el cuaderno sigue al dedo.
                if (unaPagina() && (dir > 0) === (ladoDe(S.i) === 'izq')) {
                    const j = S.i + dir;
                    if (j < 0 || j > pags().length - 1) { G.tipo = 'ignorar'; return; }
                    G.tipo = 'desliza'; G.dir = dir; G.d0 = S.desp; G.d1 = despDe(ladoDe(j)); S.arrastre = true;
                } else {
                    const V = prepararVolteo(dir);
                    if (!V) { G.tipo = 'ignorar'; return; }
                    // Distancia del punto tomado al espiral: la hoja sigue al dedo (coseno del ángulo).
                    G.r = Math.max(PW * 0.45, dir > 0 ? G.l0.x - PW : PW - G.l0.x);
                    G.V = V; G.tipo = 'hoja'; S.arrastre = true;
                    sonar();
                }
            }
        }
        if (G.tipo === 'pan') {
            S.panX = G.pan0[0] + dxS / S.k; S.panY = G.pan0[1] + dyS / S.k;
            transformar();
        } else if (G.tipo === 'desliza') {
            const [lx] = girado() ? [dyS] : [dxS];
            const lo = Math.min(G.d0, G.d1), hi = Math.max(G.d0, G.d1);
            ponerDesp(clamp(G.d0 - lx / S.k, lo, hi));
        } else if (G.tipo === 'hoja') {
            const dx = aLibro(e.clientX, e.clientY).x - G.l0.x;
            const th = G.V.dir > 0
                ? -Math.acos(clamp((G.r + dx) / G.r, -1, 1)) * 180 / Math.PI
                : -180 + Math.acos(clamp((G.r - dx) / G.r, -1, 1)) * 180 / Math.PI;
            G.V.poner(th);
        }
        G.vx = (e.clientX - G.ultX) / Math.max(1, performance.now() - G.ultT);
        G.vy = (e.clientY - G.ultY) / Math.max(1, performance.now() - G.ultT);
        G.ultX = e.clientX; G.ultY = e.clientY; G.ultT = performance.now();
    }
    async function alSoltar(e) {
        if (!punteros.has(e.pointerId)) return;
        punteros.delete(e.pointerId);
        if (!G) return;
        const g = G;
        if (g.tipo === 'pellizco') { if (!punteros.size) G = null; return; }
        G = null;
        if (g.tipo === 'pan') return;   // se queda donde se dejó (dentro de la hoja)
        if (g.tipo === 'desliza') {
            // Queda en la página más cercana (o en la otra si se lanzó rápido hacia ella).
            const vx = (girado() ? g.vy : g.vx) || 0;
            const avance = Math.abs(S.desp - g.d0) / Math.max(1, Math.abs(g.d1 - g.d0));
            const ir = avance > 0.35 || (g.dir > 0 ? vx < -0.5 : vx > 0.5);
            S.anim = true;
            const j = S.i + g.dir;
            if (ir) emitirPasar(g.dir);
            await moverPar(ir ? g.d1 : g.d0, ir ? j : S.i, 260);
            if (ir) S.i = j;
            pintar();
            S.anim = false; S.arrastre = false;
            if (S.pendEstado) aplicarEstado(S.pendEstado);
            return;
        }
        if (g.tipo === 'hoja') {
            // Se completa si pasó la mitad o si se lanzó rápido hacia su lado.
            const vx = (girado() ? g.vy : g.vx) || 0;   // velocidad hacia la derecha del libro (forma 4: hacia abajo)
            const rapido = g.V.dir > 0 ? vx < -0.6 : vx > 0.6;
            const completar = g.V.dir > 0 ? g.V.th < -90 || rapido : g.V.th > -90 || rapido;
            S.anim = true;
            if (completar) emitirPasar(g.V.dir);
            await g.V.terminar(completar);
            S.anim = false; S.arrastre = false;
            return;
        }
        if (g.tipo === 'tapa') { pasar(1); return; }
        if (g.tipo === 'nada' && Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < 8) {
            // Vistas de dos páginas: se espera un instante por si es doble clic (que abre esa página sola).
            clearTimeout(clicPend);
            if (dosPag()) clicPend = setTimeout(() => clicLibro(g.l0), 240);
            else clicLibro(g.l0);
        }
    }
    function clicLibro(l) {
        if (S.anim) return;
        if (S.modo === 1) { pasar(1); return; }
        if (l.y < 0 || l.y > PH) return;
        // Bordes de la página en foco (formas 3 y 4) o del par (forma 2); la franja de la otra página también lleva a ella.
        const [x0, x1] = unaPagina() ? (ladoDe(S.i) === 'izq' ? [0, PW + FR] : [PW - FR, 2 * PW]) : [0, anchoLibro()];
        const [b0, b1] = unaPagina() ? (ladoDe(S.i) === 'izq' ? [0, PW] : [PW, 2 * PW]) : [0, anchoLibro()];
        if (l.x > b1 - PW * 0.16 && l.x <= x1 + 40) { pasar(1); return; }
        if (l.x < b0 + PW * 0.16 && l.x >= x0 - 40) { pasar(-1); return; }
        if (dosPag() && l.x >= 0 && l.x <= anchoLibro()) {      // clic en una página = esa es la hoja en foco
            const i = l.x < PW ? 2 * pliego() - 1 : 2 * pliego();
            if (i >= 0 && i < pags().length) { S.i = i; pintarBarra(); }
        }
    }
    function alRueda(e) {
        if (!S || S.op.espejo || S.editando) return;
        if (unaPagina()) { e.preventDefault(); ponerZoom(S.zoom * (e.deltaY < 0 ? 1.12 : 1 / 1.12)); }
    }
    function alTecla(e) {
        if (!S || raiz.hidden || S.op.espejo) return;
        if (S.editando) { if (e.key === 'Escape' && !EditorBloques.menuAbierto?.()) { e.preventDefault(); cerrarEditor(); } return; }
        if (e.target.closest?.('input, textarea, [contenteditable]')) return;
        const adelante = girado() ? ['ArrowRight', 'ArrowUp', 'PageDown'] : ['ArrowRight', 'PageDown'];
        const atras = girado() ? ['ArrowLeft', 'ArrowDown', 'PageUp'] : ['ArrowLeft', 'PageUp'];
        if (adelante.includes(e.key)) pasar(1);
        else if (atras.includes(e.key)) pasar(-1);
        else if (e.key === 'Escape') { if (!$('.cdn-idx').hidden) cerrarIndice(); else cerrar(); }
        else if (unaPagina() && (e.key === '+' || e.key === '=')) ponerZoom(S.zoom * 1.2);
        else if (unaPagina() && e.key === '-') ponerZoom(S.zoom / 1.2);
        else if (unaPagina() && e.key === '0') ponerZoom(1);
        else return;
        e.preventDefault(); e.stopPropagation();   // la página de abajo (Planificador) no reacciona a estas teclas
    }

    // ── Overlay ─────────────────────────────────────────────────────────
    const ICO = {
        1: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="6" y="3" width="13" height="18" rx="1.5" fill="#f3a6c2" stroke="#b0476f"/><path d="M6 6h-1.5M6 9.5h-1.5M6 13h-1.5M6 16.5h-1.5M6 20h-1.5" stroke="#333"/></svg>',
        2: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1.5" y="4" width="10" height="16" rx="1"/><rect x="12.5" y="4" width="10" height="16" rx="1"/><path d="M4 8h5M4 11h5M15 8h5M15 11h5"/></svg>',
        3: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="6" y="3" width="12" height="18" rx="1"/><path d="M9 7h6M9 10h6M9 13h6"/></svg>',
        4: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="18" height="12" rx="1"/><path d="M7 10h10M7 13h10"/></svg>',
        5: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="1.5" width="18" height="10" rx="1"/><rect x="3" y="12.5" width="18" height="10" rx="1"/><path d="M7 5h10M7 8h10M7 16h10M7 19h10"/></svg>',
    };
    function crearRaiz() {
        raiz = document.createElement('div');
        raiz.className = 'cdn';
        raiz.hidden = true;
        raiz.innerHTML = `
        <div class="cdn-barra">
            <span class="cdn-tit"></span>
            <span class="cdn-grupo" title="Forma de ver el cuaderno">
                <button data-modo="1" title="Cerrado">${ICO[1]}</button>
                <button data-modo="2" title="Abierto, dos páginas">${ICO[2]}</button>
                <button data-modo="3" title="Abierto, una página (con zoom)">${ICO[3]}</button>
                <button data-modo="5" title="Abierto y horizontal, dos páginas (cuaderno girado)">${ICO[5]}</button>
                <button data-modo="4" title="Abierto y horizontal, una página (cuaderno girado)">${ICO[4]}</button>
            </span>
            <button class="cdn-btn" data-accion="espirales" title="Mostrar u ocultar los espirales">➰</button>
            <span class="cdn-grupo" title="Tipo de hoja">
                <button data-papel="lisa">Lisa</button><button data-papel="lineas">Líneas</button><button data-papel="cuadros">Cuadros</button>
            </span>
            <span class="cdn-grupo" title="Letra (se recuerda por curso)">
                <button data-letra="ligada" style="font-family:'Cuaderno Ligada',cursive;font-size:12px">Ligada</button><button data-letra="imprenta" style="font-family:'Cuaderno Imprenta',sans-serif">Imprenta</button>
            </span>
            <button class="cdn-btn" data-accion="indice" title="Índice del cuaderno: todas las hojas por mes">📅 Índice</button>
            <span class="cdn-grupo cdn-zoom" style="visibility:hidden" title="Zoom (rueda, pellizco, + / −; doble clic = normal)">
                <button data-accion="zoom-" title="Alejar">−</button><span class="cdn-zoom-n">100%</span><button data-accion="zoom+" title="Acercar">+</button><button data-accion="zoom0" title="Tamaño normal">⟲</button>
            </span>
            <span class="cdn-esp"></span>
            <button class="cdn-btn" data-accion="sonido" title="Sonido al pasar la hoja">🔈</button>
            <button class="cdn-btn" data-accion="pizarra" style="visibility:hidden" title="Mostrar el cuaderno en la Pizarra y hojearlo desde aquí">📽️ Pizarra</button>
            <button class="cdn-btn" data-accion="editar" style="visibility:hidden" title="Editar la hoja en foco">✏️ Editar</button>
            <button class="cdn-btn" data-accion="crear" style="visibility:hidden" title="Agregar una hoja nueva">＋ Hoja</button>
            <button class="cdn-btn" data-accion="blanca" style="visibility:hidden" title="Dejar una página en blanco después de la que se está mirando">＋ En blanco</button>
            <button class="cdn-cerrar" data-accion="cerrar" title="Cerrar (Esc)">✕</button>
        </div>
        <div class="cdn-escena"><div class="cdn-ventana"><div class="cdn-libro"></div></div></div>
        <div class="cdn-pie">
            <button class="nav" data-accion="ant" title="Hoja anterior (←)">◀</button>
            <span class="cdn-lbl"></span>
            <button class="nav" data-accion="sig" title="Hoja siguiente (→)">▶</button>
            <button class="cdn-girar" data-accion="girar" style="visibility:hidden" title="Esta hoja está escrita con el cuaderno girado">↻ Girar para leer</button>
        </div>
        <div class="cdn-idx" hidden></div>
        <div class="cdn-ed" hidden></div>`;
        document.body.appendChild(raiz);

        raiz.addEventListener('click', e => {
            const b = e.target.closest('button');
            if (!b || !S) return;
            if (b.dataset.modo) { cambiarModo(+b.dataset.modo); return; }
            if (b.dataset.papel) { S.pref.papel = b.dataset.papel; guardarPrefCurso(S.op.ctxNombre, { papel: S.pref.papel }); pintar(); return; }
            if (b.dataset.letra) { S.pref.letra = b.dataset.letra; guardarPrefCurso(S.op.ctxNombre, { letra: S.pref.letra }); pintar(); return; }
            if (b.dataset.ir != null) { cerrarIndice(); saltarA(+b.dataset.ir); return; }
            switch (b.dataset.accion) {
                case 'cerrar': cerrar(); break;
                case 'pizarra': proyectar(!S.proy); break;
                case 'ant': pasar(-1); break;
                case 'sig': pasar(1); break;
                case 'espirales': S.espirales = !S.espirales; guardarPrefs({ espirales: S.espirales }); pintarBarra(); break;
                case 'sonido': S.sonido = !S.sonido; guardarPrefs({ sonido: S.sonido }); pintarBarra(); break;
                case 'zoom-': ponerZoom(S.zoom / 1.2); break;
                case 'zoom+': ponerZoom(S.zoom * 1.2); break;
                case 'zoom0': ponerZoom(1); break;
                case 'girar': cambiarModo({ 2: 5, 5: 2, 3: 4, 4: 3 }[S.modo] || 4); break;
                case 'indice': abrirIndice(); break;
                case 'idx-cerrar': cerrarIndice(); break;
                case 'editar': { const h = hojaFoco(); if (h) abrirEditor(h); break; }
                case 'crear': case 'nueva': nuevaHoja(); break;
                case 'blanca': paginaEnBlanco(); break;
            }
        });
        const esc_ = $('.cdn-escena');
        esc_.addEventListener('pointerdown', alBajar);
        esc_.addEventListener('pointermove', alMover);
        esc_.addEventListener('pointerup', alSoltar);
        esc_.addEventListener('pointercancel', alSoltar);
        esc_.addEventListener('wheel', alRueda, { passive: false });
        esc_.addEventListener('dblclick', e => {
            if (!S || S.op.espejo || e.target.closest('button')) return;
            if (unaPagina()) { ponerZoom(1); return; }
            if (!dosPag() || S.anim) return;
            // Doble clic en una página del par: pasa a verla sola (2 → 3, 5 → 4).
            clearTimeout(clicPend);
            const l = aLibro(e.clientX, e.clientY);
            if (l.y < 0 || l.y > PH || l.x < 0 || l.x > 2 * PW) return;
            const i = l.x < PW ? 2 * pliego() - 1 : 2 * pliego();
            if (i < 0 || i >= pags().length) return;
            S.i = i;
            cambiarModo(S.modo === 2 ? 3 : 4);
        });
        window.addEventListener('resize', () => { if (S && !raiz.hidden) { transformar(); if (S.editando) vistaPrevia(); } });
        document.addEventListener('keydown', alTecla, true);
        raiz.addEventListener('paste', alPegar);
    }
    // Índice (PO 2026-10-21): una página sobre el cuaderno, por meses; cada hoja con su día ("Miércoles 21"), un
    // resumen de lo escrito y cuántas imágenes tiene. Las páginas en blanco (sin fecha) no se listan.
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    function resumenHoja(h) {
        const lineas = (h.contenido || []).filter(p => p.t === 'txt' && p.x).flatMap(p => p.x.split('\n'))
            .map(l => l.replace(/<br>/g, ' ').replace(/^(#{1,3} |[-*•] \[[ xX]\] |[-*•] |\d+\. |---$)/, '')
                .replace(/\{[23]:/g, '').replace(/\\([*_{}\\])/g, '$1').replace(/\*\*|__|[*{}]/g, '').trim())
            .filter(Boolean);
        const t = lineas.join(' · ');
        return t.length > 170 ? t.slice(0, 168).replace(/\s+\S*$/, '') + '…' : t;
    }
    function abrirIndice() {
        const caja = $('.cdn-idx');
        if (!caja.hidden) { cerrarIndice(); return; }
        const foco = hojaFoco();
        const info = typeof contextoInfo === 'function' ? contextoInfo(S.op.ctxNombre) : { label: S.op.ctxNombre, icono: '' };
        let html = '', mes = -1;
        S.hojas.forEach((h, i) => {
            if (sinFecha(h)) return;
            const d = new Date(String(h.fecha).slice(0, 10) + 'T12:00:00');
            if (d.getMonth() !== mes) { mes = d.getMonth(); html += `<h3>${MESES[mes]}</h3>`; }
            const imgs = (h.contenido || []).filter(p => p.t === 'img').length;
            const res = resumenHoja(h);
            html += `<button class="cdn-idx-fila${h === foco ? ' on' : ''}" data-ir="${i}">
                <span class="dia">${DIAS[d.getDay()]} ${d.getDate()}</span>
                <span class="res">${res ? esc(res) : '<i>Sin texto</i>'}</span>
                <span class="img">${imgs ? `🖼 ${imgs} ${imgs === 1 ? 'imagen' : 'imágenes'}` : ''}</span></button>`;
        });
        caja.innerHTML = `<div class="cdn-idx-caja">
            <div class="cdn-idx-cab"><span>📅 Índice · ${esc(info.icono || '')} ${esc(info.label)} · ${S.anio}</span>
                <button class="cdn-cerrar" data-accion="idx-cerrar" title="Cerrar el índice (Esc)">✕</button></div>
            <div class="cdn-idx-cuerpo">${html || '<p class="vacio">Todavía no hay hojas con fecha.</p>'}</div></div>`;
        caja.hidden = false;
        caja.querySelector('.cdn-idx-fila.on')?.scrollIntoView({ block: 'center' });
    }
    function cerrarIndice() { const c = raiz && $('.cdn-idx'); if (c) { c.hidden = true; c.innerHTML = ''; } }

    // ── Abrir / cerrar ──────────────────────────────────────────────────
    async function abrir(op) {
        if (!raiz) crearRaiz();
        if (S) await cerrar(true);
        const p = prefs();
        const anio = op.anio || +String(op.fecha || hoyISO()).slice(0, 4);
        S = {
            op, anio, hojas: [], i: 0,
            modo: p.modo || 2, modoAbierto: p.modoAbierto || 2, espirales: p.espirales !== false, sonido: p.sonido !== false,
            zoom: p.zoom || 1, panX: 0, panY: 0, k: 1, pref: prefCurso(op.ctxNombre), anim: false, editando: null, proy: false,
        };
        raiz.classList.toggle('espejo', !!op.espejo);
        const info = typeof contextoInfo === 'function' ? contextoInfo(op.ctxNombre) : { label: op.ctxNombre, icono: '' };
        $('.cdn-tit').textContent = `📔 Cuaderno · ${info.icono} ${info.label} · ${anio}`;
        raiz.hidden = false;
        $('.cdn-libro').innerHTML = '';
        $('.cdn-lbl').textContent = 'Cargando…';
        ['.cdn-zoom', '[data-accion="editar"]', '[data-accion="crear"]', '[data-accion="blanca"]', '.cdn-girar'].forEach(q => { $(q).style.visibility = 'hidden'; });
        const ok = await cargar();
        if (!ok) { $('.cdn-lbl').textContent = 'No se pudo cargar el cuaderno — revisa conexión (¿se ejecutó cuaderno.sql?).'; return; }
        // Abre en la hoja de esa fecha; si no hay, en la última.
        const fi = op.fecha ? S.hojas.findIndex(h => h.fecha === op.fecha) : -1;
        S.i = fi >= 0 ? fi : Math.max(0, S.hojas.length - 1);
        if (dosPag()) S.i = focoDePliego(pliego());
        if (fi >= 0) S.i = fi;
        pintar();
        if (window.TiempoReal && !abrir.escuchando) {
            abrir.escuchando = true;
            TiempoReal.conectar(op.sb);
            TiempoReal.escuchar('cuaderno_hojas', alCambioRemoto);
        }
    }
    async function cargar() {
        const { data, error } = await S.op.sb.from('cuaderno_hojas').select('*')
            .eq('contexto_id', S.op.contextoId).eq('anio', S.anio)
            .order('fecha', { ascending: true }).order('created_at', { ascending: true });
        if (error) return false;
        S.hojas = (data || []).map(h => ({ ...h, contenido: Array.isArray(h.contenido) ? h.contenido : [] }));
        return true;
    }
    function ordenar() { S.hojas.sort((a, b) => a.fecha.localeCompare(b.fecha) || String(a.created_at).localeCompare(String(b.created_at))); }
    async function cerrar(silencioso) {
        if (!S) return;
        if (S.editando) await cerrarEditor();
        if (S.proy) proyectar(false);
        const cb = S.op.alCerrar;
        raiz.hidden = true;
        cerrarIndice();
        S = null;
        if (!silencioso && cb) cb();
    }
    // Otro equipo cambió una hoja: se recarga si aquí no se está editando ni pasando una hoja.
    let remotoPend = false;
    async function alCambioRemoto({ nuevo, viejo }) {
        if (!S) return;
        const fila = nuevo || viejo;
        if (fila?.contexto_id && fila.contexto_id !== S.op.contextoId) return;
        if (nuevo && S.ultEnvio && TiempoReal.mismaHora(nuevo.updated_at, S.ultEnvio)) return;   // eco propio
        if (S.editando || S.anim || S.arrastre) { remotoPend = true; return; }
        remotoPend = false;
        const id = hojaFoco()?.id;
        if (!(await cargar())) return;
        const j = S.hojas.findIndex(h => h.id === id);
        S.i = j >= 0 ? j : clamp(S.i, 0, pags().length - 1);
        pintar();
    }

    // ── Hojas: crear, editar, borrar ────────────────────────────────────
    async function nuevaHoja() {
        if (!S?.op.crear) return;
        let fecha = S.op.fecha || hoyISO();
        if (+fecha.slice(0, 4) !== S.anio) fecha = +hoyISO().slice(0, 4) === S.anio ? hoyISO() : `${S.anio}-12-31`;
        const fila = { contexto_id: S.op.contextoId, anio: S.anio, fecha, orientacion: 'v', contenido: [{ t: 'txt', x: '' }], sesion_id: S.op.sesionId || null };
        const { data, error } = await S.op.sb.from('cuaderno_hojas').insert(fila).select().single();
        if (error) { $('.cdn-lbl').textContent = 'No se pudo crear la hoja — revisa conexión.'; return; }
        S.ultEnvio = data.updated_at;
        S.hojas.push({ ...data, contenido: data.contenido || [] });
        ordenar();
        if (S.modo === 1) S.modo = S.modoAbierto || 2;
        S.i = S.hojas.findIndex(h => h.id === data.id);
        pintar();
        abrirEditor(S.hojas[S.i], true);
    }

    // Página en blanco: queda justo después de la hoja que se está mirando (misma fecha, creada después).
    async function paginaEnBlanco() {
        if (!S?.op.crear || S.anim) return;
        const foco = hojaFoco() || (dosPag() ? izqDe(pliego()) : null);
        const base = foco && !foco.especial ? foco : S.hojas[S.hojas.length - 1];
        const fecha = base?.fecha || S.op.fecha || hoyISO();
        const fila = { contexto_id: S.op.contextoId, anio: S.anio, fecha, orientacion: 'v', contenido: [{ t: 'blanco' }], sesion_id: S.op.sesionId || null };
        const { data, error } = await S.op.sb.from('cuaderno_hojas').insert(fila).select().single();
        if (error) { $('.cdn-lbl').textContent = 'No se pudo agregar la página — revisa conexión.'; return; }
        S.ultEnvio = data.updated_at;
        S.hojas.push({ ...data, contenido: data.contenido || [] });
        ordenar();
        S.i = S.hojas.findIndex(h => h.id === data.id);
        pintar();
    }

    function abrirEditor(h, nueva) {
        const caja = $('.cdn-ed');
        const E = S.editando = { h, nueva, fecha: h.fecha, orientacion: h.orientacion || 'v', sinFecha: sinFecha(h), piezas: [], sucio: false, timer: null, cadena: Promise.resolve() };
        caja.innerHTML = `<div class="cdn-ed-caja">
            <div class="cdn-ed-hdr">
                <span class="tit">✏️ Hoja del cuaderno</span>
                <input type="date" class="cdn-ed-fecha" min="${S.anio}-01-01" max="${S.anio}-12-31" value="${h.fecha}" title="Fecha de la hoja">
                <span class="cdn-grupo" title="Orientación: horizontal = escrita con el cuaderno girado">
                    <button data-ori="v">▯ Vertical</button><button data-ori="h">▭ Horizontal</button>
                </span>
                <label title="Página en blanco: no muestra la fecha"><input type="checkbox" class="cdn-ed-sinfecha"${sinFecha(h) ? ' checked' : ''}> Sin fecha</label>
                <span class="cdn-ed-estado"></span>
                <span class="cdn-esp"></span>
                <button class="cdn-ed-borrar" data-ed="borrar">🗑 Eliminar hoja</button>
                <button class="cdn-ed-listo" data-ed="listo">Listo</button>
            </div>
            <div class="cdn-ed-cuerpo">
                <div class="cdn-ed-piezas"><div class="cdn-ed-lista"></div>
                    <div class="cdn-ed-add"><button data-ed="txt">＋ Texto</button><button data-ed="img">＋ Imagen</button>
                    <span>o pega una imagen (Ctrl + V)</span><input type="file" accept="image/*" multiple hidden></div></div>
                <div class="cdn-ed-vista"></div>
            </div></div>`;
        caja.hidden = false;
        (h.contenido || []).forEach(p => { if (p.t !== 'blanco') E.piezas.push({ ...p }); });
        if (!E.piezas.some(p => p.t === 'txt')) E.piezas.unshift({ t: 'txt', x: '' });
        pintarPiezas();
        pintarOri();
        vistaPrevia();
        caja.onclick = e => {
            const b = e.target.closest('button');
            if (!b) return;
            if (b.dataset.ori) { E.orientacion = b.dataset.ori; pintarOri(); marcar(); return; }
            const pz = b.closest('.cdn-pz'), j = pz ? +pz.dataset.j : -1;
            if (b.dataset.tam) { E.piezas[j].tam = b.dataset.tam; pintarPiezas(); marcar(); return; }
            switch (b.dataset.ed) {
                case 'listo': cerrarEditor(); break;
                case 'borrar': borrarHoja(); break;
                case 'txt': recogerTextos(); E.piezas.push({ t: 'txt', x: '' }); pintarPiezas(); marcar(); E.piezas[E.piezas.length - 1].ed?.enfocar('inicio'); break;
                case 'img': caja.querySelector('input[type=file]').click(); break;
                case 'subir': if (j > 0) { recogerTextos(); [E.piezas[j - 1], E.piezas[j]] = [E.piezas[j], E.piezas[j - 1]]; pintarPiezas(); marcar(); } break;
                case 'bajar': if (j < E.piezas.length - 1) { recogerTextos(); [E.piezas[j + 1], E.piezas[j]] = [E.piezas[j], E.piezas[j + 1]]; pintarPiezas(); marcar(); } break;
                case 'quitar': recogerTextos(); E.piezas.splice(j, 1); pintarPiezas(); marcar(); break;
            }
        };
        caja.querySelector('.cdn-ed-sinfecha').onchange = e => { E.sinFecha = e.target.checked; marcar(); };
        caja.querySelector('.cdn-ed-fecha').onchange = e => { if (e.target.value) { E.fecha = e.target.value; marcar(); } };
        caja.querySelector('input[type=file]').onchange = e => { [...e.target.files].forEach(subirImagen); e.target.value = ''; };
    }
    function pintarOri() {
        $('.cdn-ed').querySelectorAll('[data-ori]').forEach(b => b.classList.toggle('on', b.dataset.ori === S.editando.orientacion));
    }
    function recogerTextos() { S.editando.piezas.forEach(p => { if (p.t === 'txt' && p.ed) p.x = p.ed.texto(); }); }
    function pintarPiezas() {
        const E = S.editando, lista = $('.cdn-ed-lista');
        E.piezas.forEach(p => { if (p.ed) { p.x = p.ed.texto(); p.ed.destruir(); p.ed = null; } });
        lista.innerHTML = E.piezas.map((p, j) => {
            const herr = `<div class="cdn-pz-herr"><button data-ed="subir" title="Subir">▲</button><button data-ed="bajar" title="Bajar">▼</button><button data-ed="quitar" title="Quitar">✕</button></div>`;
            if (p.t === 'img') {
                const src = p.url || (p.path ? urlImg(p.path) : '');
                return `<div class="cdn-pz img" data-j="${j}">${herr}<img src="${esc(src)}" alt="">
                    <div>${p.subiendo ? '<div class="subiendo">Subiendo imagen…</div>' : ''}<div class="tams">${TAMS.map(t =>
                        `<button data-tam="${t.t}" class="${(p.tam || 'm') === t.t ? 'on' : ''}">${t.lbl}</button>`).join('')}</div></div></div>`;
            }
            return `<div class="cdn-pz txt" data-j="${j}">${herr}<div class="cdn-pz-ed"></div></div>`;
        }).join('');
        E.piezas.forEach((p, j) => {
            if (p.t !== 'txt') return;
            p.ed = EditorBloques.crear(lista.querySelector(`.cdn-pz[data-j="${j}"] .cdn-pz-ed`), {
                texto: p.x || '', vacio: 'Escribe lo que va en el cuaderno…', alCambiar: () => marcar(),
            });
        });
    }
    function piezasParaGuardar() {
        recogerTextos();
        const piezas = S.editando.piezas.filter(p => p.t === 'txt' ? true : !!p.path).map(p => p.t === 'img' ? { t: 'img', path: p.path, tam: p.tam || 'm' } : { t: 'txt', x: p.x || '' });
        return S.editando.sinFecha ? [{ t: 'blanco' }, ...piezas] : piezas;
    }
    let timerVista = null;
    function marcar() {
        const E = S.editando;
        if (!E) return;
        E.sucio = true;
        estadoEd('Sin guardar…');
        clearTimeout(E.timer);
        E.timer = setTimeout(guardarHoja, 900);
        clearTimeout(timerVista);
        timerVista = setTimeout(vistaPrevia, 250);
    }
    function estadoEd(t, err) { const e = $('.cdn-ed-estado'); if (e) { e.textContent = t; e.classList.toggle('err', !!err); } }
    function guardarHoja() {
        const E = S?.editando;
        if (!E) return Promise.resolve();
        clearTimeout(E.timer);
        if (!E.sucio) return E.cadena;
        E.sucio = false;
        const cambios = { fecha: E.fecha, orientacion: E.orientacion, contenido: piezasParaGuardar(), updated_at: new Date().toISOString() };
        const sb = S.op.sb, h = E.h, s = S;
        E.cadena = E.cadena.then(async () => {
            estadoEd('Guardando…');
            s.ultEnvio = cambios.updated_at;
            const { error } = await sb.from('cuaderno_hojas').update(cambios).eq('id', h.id);
            if (error) { E.sucio = true; estadoEd('No se pudo guardar — revisa conexión.', true); return; }
            Object.assign(h, cambios);
            if (s.editando === E && !E.sucio) estadoEd('Guardado ✓');
        });
        return E.cadena;
    }
    // Vista previa: la hoja tal como quedará, escalada a su columna.
    function vistaPrevia() {
        const E = S?.editando;
        if (!E) return;
        recogerTextos();
        const caja = $('.cdn-ed-vista');
        const h = { ...E.h, fecha: E.fecha, orientacion: E.orientacion, contenido: [...(E.sinFecha ? [{ t: 'blanco' }] : []), ...E.piezas.map(p => ({ ...p, ed: undefined }))] };
        const r = caja.getBoundingClientRect();
        const k = Math.min((r.width - 30) / PW, (r.height - 30) / PH);
        caja.innerHTML = `<div class="cdn-slot der" style="left:${(r.width - PW * k) / 2}px;top:${(r.height - PH * k) / 2}px;transform:scale(${k})">${htmlPag(h)}</div>`;
        ajustar(caja);
    }
    async function cerrarEditor() {
        const E = S?.editando;
        if (!E) return;
        clearTimeout(timerVista);
        if (E.piezas.some(p => p.subiendo)) { estadoEd('Espera: se está subiendo una imagen.'); return; }
        await guardarHoja();
        E.piezas.forEach(p => { p.ed?.destruir(); p.ed = null; });
        EditorBloques.cerrarMenus?.();
        $('.cdn-ed').hidden = true;
        $('.cdn-ed').innerHTML = '';
        S.editando = null;
        ordenar();
        const j = S.hojas.indexOf(E.h);
        if (j >= 0) S.i = j;
        pintar();
        if (remotoPend) alCambioRemoto({});
    }
    async function borrarHoja() {
        const E = S.editando;
        if (!confirm(`¿Eliminar la hoja del ${fechaCuaderno(E.fecha)}? No se puede deshacer.`)) return;
        clearTimeout(E.timer); E.sucio = false;
        const { error } = await S.op.sb.from('cuaderno_hojas').delete().eq('id', E.h.id);
        if (error) { estadoEd('No se pudo eliminar — revisa conexión.', true); return; }
        const rutas = [...(E.h.contenido || []), ...E.piezas].filter(p => p.t === 'img' && p.path).map(p => p.path);
        if (rutas.length) S.op.sb.storage.from(BUCKET).remove([...new Set(rutas)]).catch(() => {});
        E.piezas.forEach(p => p.ed?.destruir());
        $('.cdn-ed').hidden = true; $('.cdn-ed').innerHTML = '';
        S.editando = null;
        S.hojas = S.hojas.filter(h => h !== E.h);
        S.i = clamp(S.i, 0, pags().length - 1);
        pintar();
    }

    // Imágenes: se achican a 1600 px (webp) antes de subir, para que pesen poco.
    async function achicar(file) {
        try {
            const bmp = await createImageBitmap(file);
            const f = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
            const c = document.createElement('canvas');
            c.width = Math.round(bmp.width * f); c.height = Math.round(bmp.height * f);
            const g = c.getContext('2d');
            g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
            g.drawImage(bmp, 0, 0, c.width, c.height);
            const blob = await new Promise(res => c.toBlob(res, 'image/webp', 0.86));
            if (blob) return { blob, ext: 'webp', tipo: 'image/webp' };
        } catch (_) {}
        return { blob: file, ext: (file.name.split('.').pop() || 'png').toLowerCase(), tipo: file.type || 'image/png' };
    }
    async function subirImagen(file) {
        const E = S?.editando;
        if (!E || !file?.type?.startsWith('image/')) return;
        recogerTextos();
        const p = { t: 'img', tam: 'm', url: URL.createObjectURL(file), subiendo: true };
        E.piezas.push(p);
        pintarPiezas(); vistaPrevia();
        const { blob, ext, tipo } = await achicar(file);
        const id = (crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2));
        const path = `${S.op.contextoId}/${S.anio}/${id}.${ext}`;
        const { error } = await S.op.sb.storage.from(BUCKET).upload(path, blob, { contentType: tipo, upsert: false });
        p.subiendo = false;
        if (S?.editando !== E) return;
        if (error) {
            E.piezas.splice(E.piezas.indexOf(p), 1);
            estadoEd('No se pudo subir la imagen — revisa conexión.', true);
        } else { p.path = path; marcar(); }
        recogerTextos(); pintarPiezas(); vistaPrevia();
    }
    function alPegar(e) {
        if (!S?.editando) return;
        const imgs = [...(e.clipboardData?.items || [])].filter(it => it.type.startsWith('image/')).map(it => it.getAsFile()).filter(Boolean);
        if (!imgs.length) return;
        e.preventDefault();
        imgs.forEach(subirImagen);
    }

    window.Cuaderno = { abrir, cerrar: () => cerrar(), cursos: CURSOS, abierto: () => !!S, espejoEnPizarra };
})();
