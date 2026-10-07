// Pasar lista — asistencia de la clase (pieza compartida: Planificador + Libro).
// Ver AUDITORIA/DESARROLLO_PARALELO.md, ficha "Pasar lista".
//
// · Una lista por CLASE (sesión). Se registra en NEGATIVO: solo los ausentes.
//   Fila en libro_asistencia = "se pasó lista" (ausentes vacío = todos presentes).
// · Población según el contexto, con la MISMA regla del Libro (poblacionContexto):
//   curso → matrícula activa a la fecha (o población vinculada: jefatura → octavo);
//   taller → integrantes del taller.
// · Sin internet: la lista queda en este computador (cola en localStorage) y se sube
//   sola al volver la conexión. Otras ventanas se enteran por el evento `storage`.
// · Visual: el tablero de Participación en modo proyector (tiles, sin scroll). Un solo
//   tablero: el ausente se queda en su lugar, inhabilitado (como Shift+clic en Participación).
(function () {
    const COLA_KEY  = 'profe_asistencia_cola';         // { sesionId: { ausentes, ts } }
    const CACHE_KEY = id => 'profe_asistencia_' + id;  // última lista conocida (lectura offline)
    let _sb = null;

    // Ícono de "Pasar lista": casilla con visto verde (Planificador, Libro y la propia lista).
    // Toda etiqueta con clase "icono-lista" lo recibe sola al cargar la página.
    const ICONO = '<svg class="ico-lista" viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" style="vertical-align:-0.18em">'
        + '<rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" stroke-width="2"/>'
        + '<path d="M7.5 12.5l3 3 6-7" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const ponerIconos = () => document.querySelectorAll('.icono-lista').forEach(el => { el.innerHTML = ICONO; });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ponerIconos); else ponerIconos();

    const leerJSON = (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch (_) { return def; } };
    const norm = s => (s == null ? '' : String(s)).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const esc  = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

    // ── Datos ────────────────────────────────────────────────────────────────
    // Subidas en serie: varios toques seguidos nunca dejan en la base una lista más vieja.
    let _cadena = Promise.resolve();
    function subirPendientes() { _cadena = _cadena.then(_subir).catch(() => {}); return _cadena; }
    async function _subir() {
        if (!_sb) return;
        const cola = leerJSON(COLA_KEY, {});
        for (const [sesionId, item] of Object.entries(cola)) {
            const { error } = await _sb.from('libro_asistencia').upsert({
                sesion_id: sesionId, ausentes: item.ausentes, actualizada_en: new Date(item.ts).toISOString(),
            });
            if (error) return;   // sin conexión u otro error: se reintenta más tarde
            const actual = leerJSON(COLA_KEY, {});
            if (actual[sesionId] && actual[sesionId].ts === item.ts) { delete actual[sesionId]; localStorage.setItem(COLA_KEY, JSON.stringify(actual)); }
        }
    }

    // Lista de la clase: { tomada: bool, ausentes: [estudiante_id] }. Lo pendiente de
    // subir (más nuevo) manda sobre la base; sin conexión, la última copia conocida.
    async function obtener(sesionId) {
        const pend = leerJSON(COLA_KEY, {})[sesionId];
        if (pend) return { tomada: true, ausentes: pend.ausentes, pendiente: true };
        try {
            const { data, error } = await _sb.from('libro_asistencia').select('ausentes').eq('sesion_id', sesionId).maybeSingle();
            if (error) throw error;
            const r = data ? { tomada: true, ausentes: data.ausentes || [] } : { tomada: false, ausentes: [] };
            localStorage.setItem(CACHE_KEY(sesionId), JSON.stringify(r));
            return r;
        } catch (_) {
            return leerJSON(CACHE_KEY(sesionId), { tomada: false, ausentes: [] });
        }
    }

    function guardar(sesionId, ausentes) {
        const ts = Date.now();
        const cola = leerJSON(COLA_KEY, {});
        cola[sesionId] = { ausentes: [...ausentes], ts };
        localStorage.setItem(COLA_KEY, JSON.stringify(cola));
        localStorage.setItem(CACHE_KEY(sesionId), JSON.stringify({ tomada: true, ausentes: [...ausentes] }));
        return subirPendientes();
    }

    // Población de la clase (misma regla que poblacionContexto del Libro), con nombres.
    async function poblacion({ sesionId, ctxNombre, anio, fecha }) {
        if (!fecha) {   // el Libro no siempre tiene la fecha de la clase a mano
            const { data } = await _sb.from('sesiones').select('fecha').eq('id', sesionId).maybeSingle();
            fecha = data?.fecha || new Date().toISOString().slice(0, 10);
        }
        const { data: cx } = await _sb.from('contextos').select('id,tipo').eq('nombre', ctxNombre).limit(1);
        const ctx = cx && cx[0];
        if (!ctx) return [];
        const { data: an } = await _sb.from('libro_anios').select('id').eq('anio', parseInt(anio, 10)).limit(1);
        const anioId = an && an[0] && an[0].id;
        if (!anioId) return [];
        let ids = [];
        const pos = {};   // número de lista (posición en la matrícula del curso); talleres no tienen
        if (ctx.tipo === 'taller') {
            const { data, error } = await _sb.from('libro_pertenencias_taller').select('estudiante_id').eq('anio_id', anioId).eq('contexto_id', ctx.id);
            if (error) throw error;
            ids = (data || []).map(p => p.estudiante_id);
        } else {
            let pobId = ctx.id;
            try {
                const { data: vp } = await _sb.from('libro_contexto_poblacion').select('poblacion_ctx_id').eq('contexto_id', ctx.id).eq('anio_id', anioId).limit(1);
                if (vp && vp[0]) pobId = vp[0].poblacion_ctx_id;
            } catch (_) { /* sin vínculo */ }
            const { data, error } = await _sb.from('libro_matriculas').select('estudiante_id,posicion,fecha_ingreso,fecha_retiro')
                .eq('anio_id', anioId).eq('contexto_id', pobId).eq('estado', 'activo');
            if (error) throw error;
            ids = (data || []).filter(m => (!m.fecha_ingreso || m.fecha_ingreso <= fecha) && (!m.fecha_retiro || m.fecha_retiro > fecha))
                .map(m => { pos[m.estudiante_id] = m.posicion; return m.estudiante_id; });
        }
        if (!ids.length) return [];
        const { data: est, error } = await _sb.from('libro_estudiantes').select('id,nombre,apellido,nombre_social,mostrar_apellido').in('id', ids);
        if (error) throw error;
        // Nombre social: reemplaza el nombre de pila (sin señal visible); el resumen usa el apellido.
        (est || []).forEach(e => { e.pos = pos[e.id] ?? null; e.nombre = (e.nombre_social || '').trim() || e.nombre; });
        return (est || []).sort((a, b) => norm(`${a.nombre} ${a.apellido}`).localeCompare(norm(`${b.nombre} ${b.apellido}`)));
    }

    // ── Vista (tablero estilo proyector de Participación) ────────────────────
    const CSS = `
    .asis{position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;background:#0f1218;color:#e8ecf1;
      font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
    .asis-bar{flex:0 0 auto;display:flex;align-items:center;gap:14px;padding:14px 20px;background:#161b23;border-bottom:1px solid #262d38}
    .asis-tit{font-weight:800;font-size:clamp(18px,2.2vw,max(28px,2.6vh))}
    .asis-cont{font-weight:700;font-size:clamp(14px,1.6vw,max(20px,1.85vh));color:#9aa3ad}
    .asis-cont b.p{color:#7ee39a} .asis-cont b.a{color:#ff8a80}
    .asis-sp{flex:1}
    .asis-hint{color:#7b8592;font-size:clamp(12px,1.2vw,max(15px,1.4vh))}
    .asis-btn{border:none;border-radius:12px;font:inherit;font-weight:800;cursor:pointer;padding:10px 18px;font-size:clamp(14px,1.5vw,max(18px,1.67vh))}
    .asis-btn.listo{background:linear-gradient(135deg,#2e9c46,#1f7a34);color:#fff}
    .asis-btn.no{background:rgba(255,255,255,.10);color:#e8ecf1}
    .asis-btn:hover{filter:brightness(1.12)}
    .asis-board{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;padding:14px 18px}
    .asis-zona{flex:0 0 auto;display:flex;flex-direction:column;border-radius:16px;overflow:hidden;border:1px solid rgba(255,255,255,.06)}
    .asis-zona.p{flex:1;min-height:0;justify-content:center;background:linear-gradient(180deg,rgba(46,125,50,.16),rgba(46,125,50,.05))}
    .asis-grid{display:grid;justify-content:center;align-content:center;padding:7px 12px;
      grid-template-columns:repeat(var(--cols,6),var(--cw,120px));grid-auto-rows:var(--ch,48px);gap:var(--cg,10px)}
    .asis-tile{display:flex;align-items:center;justify-content:center;text-align:center;border-radius:12px;cursor:pointer;
      font-weight:800;font-size:var(--cf,20px);padding:0 11px;user-select:none;transition:transform .12s,filter .12s}
    .asis-tile>span{display:block;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    .asis-tile{background:linear-gradient(160deg,#2e9c46,#1f7a34);color:#fff;border:2px solid transparent}
    .asis-tile.aus{background:#3a414b;color:#9aa3ad;opacity:.6;border:2px dashed rgba(255,255,255,.28)}
    .asis-tile.aus>span{text-decoration:line-through}
    .asis-tile:hover{transform:translateY(-3px);filter:brightness(1.1)}
    .asis-vacio{grid-column:1/-1;text-align:center;color:#7b8592;font-weight:700;padding:6px}
    .asis-msg{margin:auto;color:#9aa3ad;font-size:20px;text-align:center;padding:20px}
    .asis-resumen{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;background:#0f1218}
    .asis-resumen-lista{flex:1;min-height:0;overflow:hidden;padding:18px 28px;display:grid;grid-auto-flow:column;
      grid-template-columns:repeat(var(--rc,1),1fr);grid-template-rows:repeat(var(--rr,1),auto);
      align-content:start;column-gap:48px;font-size:var(--rf,32px);font-weight:800;line-height:1.35;font-variant-numeric:tabular-nums}
    .asis-resumen-lista div{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .asis-resumen-lista .vacio{color:#7b8592;font-weight:700}
    .asis.espejo .asis-tile{cursor:default}`;

    let _ui = null;   // { el, sesionId, lista, ausentes:Set, tomada, resolver, ro }

    function nombreTile(e, repes) {
        const nom = (e.nombre || '').trim() || '—';
        const ap  = (e.apellido || '').trim();
        return ((e.mostrar_apellido || repes[norm(nom)] > 1) && ap) ? `${nom} ${ap}` : nom;   // repetido o "mostrar con apellido"
    }

    // Topes pensados para pantallas de hasta 1080 px de alto; más grandes (4K) crecen en proporción.
    const escala = () => Math.max(1, window.innerHeight / 1080);
    function layout() {
        if (!_ui) return;
        layoutResumen();
        const board = _ui.el.querySelector('.asis-board');
        const lista = _ui.lista;
        if (!lista.length || !board.clientHeight) return;
        const W = board.clientWidth - 36 - 24, H = board.clientHeight - 28 - 14 - 10;
        const ctx = (layout._c ||= document.createElement('canvas').getContext('2d'));
        ctx.font = `800 100px ${getComputedStyle(board).fontFamily}`;
        const repes = _ui.repes;
        const maxW = Math.max(1, ...lista.map(e => ctx.measureText(nombreTile(e, repes)).width));
        const cg = Math.max(6, Math.min(14 * escala(), Math.round(W * 0.008)));
        let best = null;
        for (let c = 1; c <= Math.min(lista.length, 40); c++) {
            const filas = Math.ceil(lista.length / c);
            const cw = Math.floor((W - cg * (c - 1)) / c), ch = Math.floor((Math.max(40, H) - cg * filas) / filas);
            if (cw < 54 || ch < 26) continue;
            const f = Math.max(12, Math.min(ch * 0.52, (cw - 28) / (maxW / 100), 110 * escala()));
            const score = f * 1000 + cw * ch / 1000;
            if (!best || score > best.score) best = { c, cw, ch, f, score };
        }
        if (!best) { const c = Math.ceil(Math.sqrt(lista.length)); best = { c, cw: 90, ch: 34, f: 13 }; }
        const s = _ui.el.style;
        s.setProperty('--cols', best.c); s.setProperty('--cw', best.cw + 'px'); s.setProperty('--ch', best.ch + 'px');
        s.setProperty('--cg', cg + 'px'); s.setProperty('--cf', Math.floor(best.f) + 'px');
    }

    function pintar() {
        if (!_ui) return;
        const { lista, ausentes, repes } = _ui;
        const nA = lista.filter(e => ausentes.has(e.id)).length;
        const tile = e => `<div class="asis-tile${ausentes.has(e.id) ? ' aus' : ''}" data-id="${e.id}" title="${esc(`${e.nombre} ${e.apellido || ''}`.trim())}"><span>${esc(nombreTile(e, repes))}</span></div>`;
        _ui.el.querySelector('.asis-cont').innerHTML = `<b class="p">${lista.length - nA}</b> presentes · <b class="a">${nA}</b> ausentes`;
        _ui.el.querySelector('.asis-grid.p').innerHTML = lista.map(tile).join('');
        // Resumen para traspasar al libro (solo en la pantalla del profe): botón en la barra.
        const bRes = _ui.el.querySelector('[data-acc="resumen"]');
        if (bRes) { bRes.style.display = nA ? '' : 'none'; bRes.textContent = `📋 Resumen (${nA})`; }
        if (_ui.el.querySelector('.asis-resumen')) abrirResumen();   // abierto: se mantiene al día
        botones();
        layout();
        if (!_ui.espejo) emitir();
    }

    // Resumen para traspasar al libro oficial: uno por línea, "N° - APELLIDO", ordenado por
    // n° de lista (talleres sin n°: "APELLIDO NOMBRE"). Pantalla aparte sobre el tablero.
    function lineaResumen(e) {
        return e.pos != null ? `${e.pos} - ${(e.apellido || e.nombre || '').trim()}`
                             : `${e.apellido || ''} ${e.nombre || ''}`.trim();
    }
    function abrirResumen() {
        if (!_ui) return;
        const aus = _ui.lista.filter(e => _ui.ausentes.has(e.id))
            .sort((a, b) => (a.pos ?? 1e9) - (b.pos ?? 1e9) || norm(a.apellido).localeCompare(norm(b.apellido)));
        let r = _ui.el.querySelector('.asis-resumen');
        if (!r) {
            r = document.createElement('div');
            r.className = 'asis-resumen';
            r.innerHTML = `<div class="asis-bar"><span class="asis-tit">📋 Ausentes</span><span class="asis-cont"></span>
                <span class="asis-sp"></span><button class="asis-btn listo" data-acc="volver">Volver</button></div>
                <div class="asis-resumen-lista"></div>`;
            r.querySelector('[data-acc="volver"]').onclick = cerrarResumen;
            _ui.el.appendChild(r);
        }
        r.querySelector('.asis-cont').textContent = `${aus.length} ${aus.length === 1 ? 'estudiante' : 'estudiantes'}`;
        r.querySelector('.asis-resumen-lista').innerHTML = aus.length
            ? aus.map(e => `<div>${esc(lineaResumen(e))}</div>`).join('')
            : '<div class="vacio">Ninguno</div>';
        layoutResumen();
    }
    // Nunca se desborda: prueba de 1 a 6 columnas y elige la letra más grande con la que
    // toda la lista cabe en la pantalla (orden de arriba hacia abajo, columna por columna).
    function layoutResumen() {
        const box = _ui?.el.querySelector('.asis-resumen-lista');
        if (!box || !box.clientHeight) return;
        const items = [...box.children], n = Math.max(1, items.length);
        const W = box.clientWidth - 56, H = box.clientHeight - 36, gap = 48;
        const ctx = (layout._c ||= document.createElement('canvas').getContext('2d'));
        ctx.font = `800 100px ${getComputedStyle(box).fontFamily}`;
        const maxW = Math.max(1, ...items.map(d => ctx.measureText(d.textContent).width));
        let best = { c: 1, f: 12 };
        for (let c = 1; c <= Math.min(6, n); c++) {
            const filas = Math.ceil(n / c);
            const f = Math.min(H / (filas * 1.35), ((W - gap * (c - 1)) / c) / (maxW / 100), 64 * escala());
            if (f > best.f + 0.5) best = { c, f };
        }
        const st = box.style;
        st.setProperty('--rc', best.c); st.setProperty('--rr', Math.ceil(n / best.c));
        st.setProperty('--rf', Math.max(12, Math.floor(best.f)) + 'px');
    }
    function cerrarResumen() { _ui?.el.querySelector('.asis-resumen')?.remove(); }

    // Lista sin tomar y sin toques: "Ahora no" (no registra nada) y "Todos presentes" (guarda la
    // lista vacía). Después de un toque, o con la lista ya tomada, todo está guardado: solo "Listo".
    function botones() {
        if (!_ui || _ui.espejo) return;
        const sinTomar = !_ui.tomada && !_ui.cambios;
        const no = _ui.el.querySelector('[data-acc="no"]'), listo = _ui.el.querySelector('[data-acc="listo"]');
        if (no) no.style.display = sinTomar ? '' : 'none';
        if (listo) listo.textContent = sinTomar ? 'Todos presentes' : 'Listo';
    }

    // ── Espejo en la Pizarra (mismo tablero, solo para mirar) ─────────────────
    // La ventana que pasa lista avisa por BroadcastChannel; la Pizarra (espejo()) lo muestra.
    const canal = 'BroadcastChannel' in window ? new BroadcastChannel('profe-asistencia') : null;
    function emitir() {
        if (!canal || !_ui || _ui.espejo || !_ui.lista.length) return;
        canal.postMessage({ tipo: 'estado', titulo: _ui.titulo,
            lista: _ui.lista.map(e => ({ id: e.id, nombre: e.nombre, apellido: e.apellido, mostrar_apellido: !!e.mostrar_apellido })),
            ausentes: [..._ui.ausentes] });
    }
    if (canal) canal.addEventListener('message', ev => {
        if (ev.data && ev.data.tipo === 'pedir') emitir();   // una Pizarra recién abierta lo pide
    });

    function crearVista({ titulo, espejo }) {
        if (!document.getElementById('asis-css')) {
            const st = document.createElement('style'); st.id = 'asis-css'; st.textContent = CSS; document.head.appendChild(st);
        }
        const el = document.createElement('div');
        el.className = 'asis' + (espejo ? ' espejo' : '');
        el.innerHTML = `
          <div class="asis-bar">
            <span class="asis-tit">${ICONO} Pasar lista${titulo ? ' — ' + esc(titulo) : ''}</span>
            <span class="asis-cont"></span>
            <span class="asis-sp"></span>
            ${espejo ? '' : `<span class="asis-hint">Toca a los AUSENTES</span>
            <button class="asis-btn no" data-acc="resumen" style="display:none">📋 Resumen</button>
            <button class="asis-btn no" data-acc="no">Ahora no</button>
            <button class="asis-btn listo" data-acc="listo">Todos presentes</button>`}
          </div>
          <div class="asis-board"><div class="asis-msg">Cargando la lista…</div></div>`;
        document.body.appendChild(el);
        return el;
    }
    // Deja el tablero listo para pintar (lista ya cargada).
    function montarTablero() {
        const board = _ui.el.querySelector('.asis-board');
        _ui.repes = {};
        _ui.lista.forEach(e => { const k = norm(e.nombre); _ui.repes[k] = (_ui.repes[k] || 0) + 1; });
        board.innerHTML = `<div class="asis-zona p"><div class="asis-grid p"></div></div>`;
        if ('ResizeObserver' in window) { _ui.ro = new ResizeObserver(() => requestAnimationFrame(layout)); _ui.ro.observe(board); }
        window.addEventListener('resize', layout);
        return board;
    }

    function cerrar(resultado) {
        if (!_ui) return;
        const { el, resolver, ro, espejo } = _ui;
        if (ro) ro.disconnect();
        window.removeEventListener('resize', layout);
        if (_ui.onKey) document.removeEventListener('keydown', _ui.onKey, true);
        el.remove();
        _ui = null;
        if (!espejo && canal) canal.postMessage({ tipo: 'cerrar' });
        if (resolver) resolver(resultado);
    }

    // Pizarra: muestra el tablero mientras otra ventana pasa lista.
    function espejo() {
        if (!canal) return;
        canal.addEventListener('message', ev => {
            const m = ev.data || {};
            if (m.tipo === 'cerrar') { if (_ui && _ui.espejo) cerrar(); return; }
            if (m.tipo !== 'estado' || !Array.isArray(m.lista)) return;
            if (_ui && !_ui.espejo) return;   // esta ventana está pasando lista ella misma
            if (!_ui || _ui.titulo !== m.titulo || _ui.lista.length !== m.lista.length) {
                if (_ui) cerrar();
                _ui = { el: crearVista({ titulo: m.titulo, espejo: true }), espejo: true, titulo: m.titulo,
                        lista: m.lista, ausentes: new Set(), repes: {} };
                montarTablero();
            }
            _ui.ausentes = new Set(m.ausentes || []);
            pintar();
        });
        canal.postMessage({ tipo: 'pedir' });
    }

    // Abre "Pasar lista". Resuelve { guardada, ausentes } al cerrar.
    async function abrir({ sb, sesionId, ctxNombre, anio, fecha, titulo }) {
        if (sb) _sb = sb;
        if (_ui && _ui.espejo) cerrar();
        if (_ui) return { guardada: false };
        const el = crearVista({ titulo, espejo: false });
        return new Promise(async resolver => {
            _ui = { el, sesionId, titulo, lista: [], ausentes: new Set(), repes: {}, tomada: false, resolver, cambios: false };
            _ui.onKey = e => { if (e.key === 'Escape' && _ui.el.querySelector('.asis-resumen')) { e.stopPropagation(); e.preventDefault(); cerrarResumen(); return; }
                if (e.key === 'Escape') { e.stopPropagation(); e.preventDefault(); cerrar({ guardada: _ui.tomada || _ui.cambios, ausentes: [..._ui.ausentes] }); } };
            document.addEventListener('keydown', _ui.onKey, true);
            el.querySelector('[data-acc="no"]').onclick = () => cerrar({ guardada: _ui.tomada || _ui.cambios, ausentes: [..._ui.ausentes] });
            el.querySelector('[data-acc="listo"]').onclick = async () => {
                const u = _ui;
                if (!u.lista.length) return cerrar({ guardada: false });
                if (!u.tomada && !u.cambios) await guardar(sesionId, []);   // "Listo" sin marcar = todos presentes
                cerrar({ guardada: true, ausentes: [...u.ausentes] });
            };
            try {
                const [lista, prev] = await Promise.all([poblacion({ sesionId, ctxNombre, anio, fecha }), obtener(sesionId)]);
                if (!_ui) return;
                const board = el.querySelector('.asis-board');
                if (!lista.length) { board.innerHTML = '<div class="asis-msg">Esta clase no tiene estudiantes registrados en el Libro.</div>'; return; }
                _ui.lista = lista;
                _ui.tomada = prev.tomada;
                _ui.ausentes = new Set((prev.ausentes || []).filter(id => lista.some(e => e.id === id)));
                el.querySelector('[data-acc="resumen"]').onclick = abrirResumen;
                montarTablero();
                board.onclick = ev => {
                    const t = ev.target.closest('.asis-tile'); if (!t || !_ui) return;
                    const id = t.dataset.id;
                    if (_ui.ausentes.has(id)) _ui.ausentes.delete(id); else _ui.ausentes.add(id);
                    _ui.cambios = true;
                    guardar(sesionId, [..._ui.ausentes]);   // cada toque queda guardado (sin conexión: en cola)
                    pintar();
                };
                pintar();
                requestAnimationFrame(layout);
            } catch (e) {
                const b = el.querySelector('.asis-board');
                if (b) b.innerHTML = `<div class="asis-msg">No se pudo cargar la lista: ${esc(e.message || e)}</div>`;
            }
        });
    }

    // Avisa a la ventana cuando otra cambió la lista de una clase (Paso 2: Libro).
    function onCambio(cb) {
        window.addEventListener('storage', ev => {
            if (ev.key && ev.key.startsWith('profe_asistencia_') && ev.key !== COLA_KEY) cb(ev.key.slice('profe_asistencia_'.length));
        });
    }

    function iniciar(sb) { if (sb) _sb = sb; subirPendientes(); }
    window.addEventListener('online', () => subirPendientes());

    window.Asistencia = { ICONO, abrir, espejo, obtener, guardar, iniciar, onCambio, subirPendientes };
})();
