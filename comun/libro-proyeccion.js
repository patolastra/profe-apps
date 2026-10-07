// Libro en el proyector (deuda AI, ver AUDITORIA/DESARROLLO_PARALELO.md).
// El Libro arma una "foto" de lo que quiere mostrar al curso (sin notas, comentarios ni
// adecuaciones) y esta pieza la dibuja en grande:
//   · con la clase en curso, en la Pizarra (espejo(): canal 'profe-espejo-libro', solo mirar);
//   · sin clase, a pantalla completa en la misma ventana (abrirLocal()).
// Fotos: { tipo:'general', curso, titulo, fecha, oa }
//        { tipo:'instr', curso, titulo, instr:{ nombre, clase:'rubrica'|'cotejo', niveles:[lab], items:[{ texto, desc:[..] }] } }
//        { tipo:'grupos', curso, titulo, grupos:[{ nombre, miembros:[..], terminado }], armando:[..], sinGrupo:[..] }
//        { tipo:'pend', curso, titulo, total, evaluados, pendientes:[..], ausentes:[..] }
//        { tipo:'entrega', curso, titulo, hicieron, deben, faltan:[..], listos:[..] }
//        { tipo:'part', curso, titulo, tablero:{ contador, cntEsp, cntSi, esp, si, vaciaEsp, vaciaSi, cerrada, big } }
//          (Participación: el mismo tablero del profe, con comun/participacion-tablero.css)
//        { tipo:'pausa', curso, titulo }
(function () {
    const CANAL = 'profe-espejo-libro';
    const KEY = 'profe_espejo_libro';   // avisa a una Pizarra recién abierta que debe mostrar la foto
    const canal = 'BroadcastChannel' in window ? new BroadcastChannel(CANAL) : null;
    const esc = t => String(t ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

    const CSS = `
    .lpro{position:fixed;inset:0;z-index:8600;background:#0f172a;color:#f1f5f9;display:flex;flex-direction:column;
      font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--k:1;overflow:hidden}
    .lpro-top{display:flex;align-items:center;gap:16px;padding:calc(14px*var(--k)) 28px;border-bottom:2px solid #1e293b;flex-shrink:0}
    .lpro-curso{font-size:calc(18px*var(--k));font-weight:700;color:#94a3b8;letter-spacing:.04em;text-transform:uppercase}
    .lpro-titulo{font-size:calc(26px*var(--k));font-weight:800;flex:1;min-width:0}
    .lpro-salir{background:#334155;color:#e2e8f0;border:1px solid #475569;border-radius:10px;padding:8px 14px;font-size:15px;cursor:pointer}
    .lpro-cuerpo{flex:1;min-height:0;padding:calc(22px*var(--k)) 28px;overflow:hidden}
    .lpro-gen{height:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;gap:calc(22px*var(--k))}
    .lpro-gen h1{margin:0;font-size:calc(64px*var(--k));line-height:1.1}
    .lpro-gen .f{font-size:calc(30px*var(--k));color:#fb923c;font-weight:700}
    .lpro-gen .oa{max-width:1400px;font-size:calc(30px*var(--k));line-height:1.35;color:#e2e8f0}
    .lpro-gen .oa b{display:block;font-size:calc(18px*var(--k));color:#94a3b8;letter-spacing:.06em;margin-bottom:6px}
    .lpro-instr-n{font-size:calc(24px*var(--k));font-weight:700;margin:0 0 calc(12px*var(--k))}
    .lpro-tab{width:100%;border-collapse:collapse;table-layout:fixed}
    .lpro-tab th,.lpro-tab td{border:2px solid #334155;padding:calc(10px*var(--k)) calc(12px*var(--k));vertical-align:top;
      font-size:calc(19px*var(--k));line-height:1.3;text-align:left}
    .lpro-tab th{background:#1e293b;color:#fb923c;font-size:calc(17px*var(--k))}
    .lpro-tab td.c{font-weight:700;background:#131c2e}
    .lpro-cot{display:flex;flex-direction:column;gap:calc(10px*var(--k))}
    .lpro-cot div{font-size:calc(26px*var(--k));padding:calc(10px*var(--k)) 16px;border-left:6px solid #fb923c;background:#131c2e;border-radius:6px}
    .lpro-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(calc(260px*var(--k)),1fr));gap:calc(16px*var(--k))}
    .lpro-g{background:#1e293b;border:2px solid #334155;border-radius:14px;padding:calc(12px*var(--k)) calc(16px*var(--k))}
    .lpro-g h3{margin:0 0 calc(8px*var(--k));font-size:calc(26px*var(--k));color:#fb923c;display:flex;justify-content:space-between;gap:8px}
    .lpro-g h3 span{color:#94a3b8;font-size:.75em}
    .lpro-g ul{margin:0;padding:0;list-style:none}
    .lpro-g li{font-size:calc(24px*var(--k));padding:calc(3px*var(--k)) 0;line-height:1.25}
    .lpro-g.armando{border:3px dashed #fb923c;background:#2a1a0c}
    .lpro-g.armando h3{color:#fdba74}
    .lpro-g.listo{opacity:.75}
    .lpro-sub{margin:calc(20px*var(--k)) 0 calc(10px*var(--k));font-size:calc(18px*var(--k));color:#94a3b8;letter-spacing:.06em;text-transform:uppercase}
    .lpro-sin{display:flex;flex-wrap:wrap;gap:calc(8px*var(--k))}
    .lpro-sin span{font-size:calc(22px*var(--k));background:#131c2e;border:1px solid #334155;border-radius:999px;padding:calc(4px*var(--k)) calc(14px*var(--k))}
    .lpro-vacio{font-size:calc(28px*var(--k));color:#94a3b8;text-align:center;margin-top:12vh}
    .lpro-cnt{font-size:calc(24px*var(--k));color:#cbd5e1;margin:0 0 calc(14px*var(--k))}
    .lpro-cnt b{color:#f1f5f9}.lpro-cnt b.o{color:#fb923c}
    .lpro-sub.o{color:#fb923c}
    .lpro-tiles{display:flex;flex-wrap:wrap;gap:calc(10px*var(--k))}
    .lpro-t{font-size:calc(26px*var(--k));font-weight:700;padding:calc(8px*var(--k)) calc(16px*var(--k));border-radius:12px;
      background:#1e293b;border:2px solid #334155;line-height:1.2}
    .lpro-t.falta{border:3px solid #fb923c;background:#2a1a0c;color:#fff}
    .lpro-t.ok{font-size:calc(17px*var(--k));font-weight:600;background:#14361f;border-color:#166534;color:#bbf7d0}
    .lpro-t.ok::before{content:'✓ '}
    .lpro-t.inhab{opacity:.35}
    .lpro-t.aus{font-size:calc(18px*var(--k));opacity:.55;font-weight:600}`;
    function css() {
        if (document.getElementById('lpro-css')) return;
        const st = document.createElement('style'); st.id = 'lpro-css'; st.textContent = CSS;
        document.head.appendChild(st);
    }

    function cuerpoHTML(f) {
        if (f.tipo === 'general') return `<div class="lpro-gen">
            <h1>${esc(f.titulo)}</h1>${f.fecha ? `<div class="f">${esc(f.fecha)}</div>` : ''}
            ${f.oa ? `<div class="oa"><b>OBJETIVO</b>${esc(f.oa)}</div>` : ''}</div>`;
        if (f.tipo === 'instr') {
            const i = f.instr;
            if (!i) return '<div class="lpro-vacio">Esta evaluación aún no tiene instrumento.</div>';
            if (!i.items.length) return `<p class="lpro-instr-n">${esc(i.nombre)}</p><div class="lpro-vacio">Sin criterios.</div>`;
            if (i.clase === 'rubrica') return `<p class="lpro-instr-n">${esc(i.nombre)}</p>
                <table class="lpro-tab"><thead><tr><th style="width:22%">Criterio</th>${i.niveles.map(n => `<th>${esc(n)}</th>`).join('')}</tr></thead>
                <tbody>${i.items.map(it => `<tr><td class="c">${esc(it.texto)}</td>${it.desc.map(d => `<td>${esc(d)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
            return `<p class="lpro-instr-n">${esc(i.nombre)} · lista de cotejo</p>
                <div class="lpro-cot">${i.items.map(it => `<div>${esc(it.texto)}</div>`).join('')}</div>`;
        }
        if (f.tipo === 'grupos') {
            const tarj = f.grupos.map(g => `<div class="lpro-g${g.terminado ? ' listo' : ''}"><h3>${esc(g.nombre)}<span>${g.terminado ? '✓' : g.miembros.length}</span></h3>
                <ul>${g.miembros.map(m => `<li>${esc(m)}</li>`).join('') || '<li style="color:#64748b">Sin integrantes</li>'}</ul></div>`).join('');
            const arm = f.armando.length ? `<div class="lpro-g armando"><h3>Nuevo grupo…<span>${f.armando.length}</span></h3>
                <ul>${f.armando.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>` : '';
            const sin = f.sinGrupo.length ? `<p class="lpro-sub">Sin grupo aún (${f.sinGrupo.length})</p>
                <div class="lpro-sin">${f.sinGrupo.map(m => `<span>${esc(m)}</span>`).join('')}</div>` : '';
            if (!tarj && !arm && !sin) return '<div class="lpro-vacio">Aún no hay grupos.</div>';
            return `${tarj || arm ? `<div class="lpro-grid">${tarj}${arm}</div>` : ''}${sin}`;
        }
        const tiles = (arr, cls) => `<div class="lpro-tiles">${arr.map(n => `<span class="lpro-t ${cls}">${esc(n)}</span>`).join('')}</div>`;
        if (f.tipo === 'pend') {
            const cnt = `<p class="lpro-cnt"><b>${f.evaluados}</b> de ${f.total} evaluados · faltan <b class="o">${f.pendientes.length}</b></p>`;
            const pend = f.pendientes.length ? tiles(f.pendientes, 'falta') : '<div class="lpro-vacio">🎉 ¡No queda nadie por evaluar!</div>';
            const aus = f.ausentes.length ? `<p class="lpro-sub">Ausentes hoy (${f.ausentes.length})</p>${tiles(f.ausentes, 'aus')}` : '';
            return cnt + pend + aus;
        }
        if (f.tipo === 'entrega') {
            const total = f.faltan.length + f.listos.length;
            const cnt = `<p class="lpro-cnt"><b>${f.listos.length}</b> de ${total} ${esc(f.hicieron)} · faltan <b class="o">${f.faltan.length}</b></p>`;
            const faltan = f.faltan.length ? `<p class="lpro-sub o">Faltan (${f.faltan.length})</p>${tiles(f.faltan, 'falta')}`
                                           : '<div class="lpro-vacio" style="margin-top:4vh">🎉 ¡Todos listos!</div>';
            const listos = f.listos.length ? `<p class="lpro-sub">${esc(f.hicieron)} (${f.listos.length})</p>${tiles(f.listos, 'ok')}` : '';
            return cnt + faltan + listos;
        }
        return `<div class="lpro-gen"><h1>${esc(f.titulo || '')}</h1></div>`;
    }

    // Escala todo (variable --k): lo más grande posible que quepa sin scroll (para leer desde atrás).
    // Sirve para cualquier resolución del proyector (800×600 a 4K, 4:3 o 16:9): el tope crece
    // con el alto de la pantalla y se busca por bisección el mayor --k que entra.
    function ajustar(el) {
        const cu = el.querySelector('.lpro-cuerpo'); if (!cu) return;
        const cabe = k => {
            el.style.setProperty('--k', k.toFixed(3));
            return cu.scrollHeight <= cu.clientHeight + 1 && cu.scrollWidth <= cu.clientWidth + 1;
        };
        let lo = 0.3, hi = Math.max(2.2, window.innerHeight / 300);
        if (cabe(hi)) return;
        for (let i = 0; i < 14; i++) { const m = (lo + hi) / 2; if (cabe(m)) lo = m; else hi = m; }
        cabe(lo);
    }

    function pintar(el, f, conSalir) {
        el.innerHTML = `<div class="lpro-top"><span class="lpro-curso">${esc(f.curso || '')}</span>
            <span class="lpro-titulo">${f.tipo === 'general' || f.tipo === 'pausa' ? '' : esc(f.titulo || '')}</span>
            ${conSalir ? '<button class="lpro-salir" data-salir>✕ Salir</button>' : ''}</div>
            <div class="lpro-cuerpo">${cuerpoHTML(f)}</div>`;
        ajustar(el);
    }

    // ── Tablero de Participación: mismo diseño y mismo cálculo en el Libro y en la Pizarra ──
    const CSS_TABLERO = new URL('participacion-tablero.css', (document.currentScript && document.currentScript.src) || location.href).href;
    let _ctx = null;
    function medir(board) {
        if (!_ctx) _ctx = document.createElement('canvas').getContext('2d');
        _ctx.font = `800 100px ${(board && getComputedStyle(board).fontFamily) || 'system-ui, sans-serif'}`;
        return _ctx;
    }
    // Busca la mejor combinación filas×columnas (compartida por ambas zonas) para que TODOS los
    // cuadros quepan sin scroll y cada nombre entre en UNA línea. Lee el tablero tal como está.
    function layoutTablero(ppro) {
        const board = ppro && ppro.querySelector('.ppro-board');
        if (!board) return;
        const gSi = ppro.querySelector('.ppro-zona.si .ppro-grid'), gEsp = ppro.querySelector('.ppro-zona.esp .ppro-grid');
        const si = gSi.querySelectorAll('.ppro-tile').length, esp = gEsp.querySelectorAll('.ppro-tile').length;
        const N = si + esp;
        if (!N || !board.clientHeight) return;
        const cs = getComputedStyle(board);
        const padX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
        const padY = parseFloat(cs.paddingTop)  + parseFloat(cs.paddingBottom);
        const zgap = parseFloat(cs.rowGap || cs.gap) || 12;
        const availW = board.clientWidth - padX, availH = board.clientHeight - padY;
        if (availW <= 20 || availH <= 20) return;
        let titH = 0;
        board.querySelectorAll('.ppro-zona-tit').forEach(t => { titH = Math.max(titH, t.offsetHeight || 28); });
        titH = titH || 28;
        const gridPadV = 14, gridPadX = 24, emptyPh = 34, zonas = 2, zoneBorder = 2 * zonas, safety = 6;
        const zonasVacias = (si === 0 ? 1 : 0) + (esp === 0 ? 1 : 0);
        let hFilas = availH - titH * zonas - zgap * (zonas - 1) - gridPadV * zonas - emptyPh * zonasVacias - zoneBorder - safety;
        if (hFilas < 40) hFilas = 40;
        const wZona = availW - gridPadX;
        const ctx2d = medir(board);
        let maxNameW100 = 1;
        ppro.querySelectorAll('.ppro-zona .ppro-tile').forEach(t => { const w = ctx2d.measureText(t.textContent.trim()).width; if (w > maxNameW100) maxNameW100 = w; });
        const escala = Math.max(1, window.innerHeight / 1080);   // proyector grande (4K): todo en proporción
        const cg = Math.max(6, Math.min(16 * escala, Math.round(availW * 0.008)));
        const padTile = 22;
        let best = null;
        for (let c = 1; c <= Math.min(N, 60); c++) {
            const rSi = si ? Math.ceil(si / c) : 0, rEsp = esp ? Math.ceil(esp / c) : 0, filas = rSi + rEsp;
            if (!filas) continue;
            const cw = Math.floor((wZona - cg * (c - 1)) / c);
            if (cw < 54) continue;
            const ch = Math.floor((hFilas - cg * filas) / filas);
            if (ch < 26) continue;
            const f = Math.max(12, Math.min(ch * 0.52, (cw - padTile) / (maxNameW100 / 100), 120 * escala));
            const score = f * 1000 + (cw * ch) / 1000;
            if (!best || score > best.score) best = { c, cw, ch, cg, f, score };
        }
        if (!best) {
            const c = Math.max(1, Math.ceil(Math.sqrt(N)));
            const filas = (si ? Math.ceil(si / c) : 0) + (esp ? Math.ceil(esp / c) : 0) || 1;
            const cw = Math.max(40, Math.floor((wZona - cg * (c - 1)) / c));
            const ch = Math.max(20, Math.floor((hFilas - cg * filas) / filas));
            best = { c, cw, ch, cg, f: Math.max(11, Math.min(ch * 0.5, (cw - 14) / (maxNameW100 / 100))) };
        }
        const st = ppro.style;
        st.setProperty('--cols', best.c); st.setProperty('--cw', best.cw + 'px'); st.setProperty('--ch', best.ch + 'px');
        st.setProperty('--cg', best.cg + 'px'); st.setProperty('--cf', Math.floor(best.f) + 'px');
    }
    // Nombre gigante del elegido (🎲): caja al centro del tablero, la letra más grande que quepa.
    function dimensionarBig(ppro, nom) {
        const board = ppro.querySelector('.ppro-board'), big = ppro.querySelector('.ppro-big');
        if (!board || !big) return;
        big.firstElementChild.textContent = nom;
        const bw = Math.floor(board.clientWidth * 0.78), bh = Math.floor(board.clientHeight * 0.62);
        big.style.width = bw + 'px'; big.style.height = bh + 'px';
        const w100 = medir(board).measureText(nom).width;
        const f = Math.min((bw * 0.86) / (w100 / 100), bh * 0.6);
        big.style.fontSize = Math.max(28, Math.floor(f)) + 'px';
    }

    // Copia en la Pizarra (solo mirar). Los cuadros se actualizan en su lugar: una animación
    // (aparecer, barajar) no se reinicia con cada aviso.
    let tab = null, tabBig = null;
    function sincronizar(grid, html, vacia) {
        const tpl = document.createElement('template'); tpl.innerHTML = html;
        const nuevos = [...tpl.content.children], actuales = [...grid.children];
        const clave = a => a.map(e => e.dataset.eid || e.className + e.textContent).join('|');
        if (clave(nuevos) === clave(actuales))
            nuevos.forEach((n, i) => { if (actuales[i].className !== n.className) actuales[i].className = n.className;
                                      if (actuales[i].innerHTML !== n.innerHTML) actuales[i].innerHTML = n.innerHTML; });
        else grid.replaceChildren(...nuevos);
        grid.classList.toggle('vacia', !!vacia);
    }
    function pintarTablero(t) {
        if (!document.getElementById('ppro-css')) {
            const l = document.createElement('link'); l.id = 'ppro-css'; l.rel = 'stylesheet'; l.href = CSS_TABLERO;
            l.onload = () => { if (tab) { layoutTablero(tab); if (tabBig) dimensionarBig(tab, tabBig); } };
            document.head.appendChild(l);
        }
        if (!tab) {
            tab = document.createElement('div');
            tab.className = 'ppro show espejo';
            tab.innerHTML = `<div class="ppro-bar"><div class="ppro-contador"></div>
                <span class="ppro-lock">🔒 Participación cerrada</span><span class="ppro-spacer"></span>
                <button class="ppro-btn dado" tabindex="-1">🎲 Elegir al azar</button><button class="ppro-btn salir" tabindex="-1">✕ Salir</button></div>
              <div class="ppro-board">
                <div class="ppro-zona esp"><div class="ppro-zona-tit">⏳ Esperando su turno <span class="cnt" data-c="esp"></span></div><div class="ppro-grid" data-g="esp"></div></div>
                <div class="ppro-zona si"><div class="ppro-zona-tit">✅ Participaron <span class="cnt" data-c="si"></span></div><div class="ppro-grid" data-g="si"></div></div>
                <div class="ppro-big"><span></span><span class="dado">🎲</span></div>
              </div>`;
            document.body.appendChild(tab);
            window.addEventListener('resize', onResize);
            tabBig = null;
        }
        tab.classList.toggle('cerrada', !!t.cerrada);
        tab.querySelector('.ppro-contador').innerHTML = t.contador;
        tab.querySelector('[data-c="esp"]').textContent = t.cntEsp;
        tab.querySelector('[data-c="si"]').textContent = t.cntSi;
        sincronizar(tab.querySelector('[data-g="esp"]'), t.esp, t.vaciaEsp);
        sincronizar(tab.querySelector('[data-g="si"]'), t.si, t.vaciaSi);
        layoutTablero(tab);
        const big = tab.querySelector('.ppro-big');
        if (t.big) {
            dimensionarBig(tab, t.big);
            if (t.big !== tabBig) { big.classList.remove('show'); void big.offsetWidth; big.classList.add('show'); }
        } else big.classList.remove('show');
        tabBig = t.big;
    }
    function quitarTablero() { if (tab) { tab.remove(); tab = null; tabBig = null; } }

    // ── Pantalla completa en la misma ventana (sin clase en curso) ──
    let local = null, ultimaLocal = null;
    function onResize() {
        if (local) ajustar(local); if (vista) ajustar(vista);
        if (tab) { layoutTablero(tab); if (tabBig) dimensionarBig(tab, tabBig); }
    }
    function abrirLocal(f, alSalir) {
        css();
        if (!local) {
            local = document.createElement('div'); local.className = 'lpro';
            local.addEventListener('click', e => { if (e.target.closest('[data-salir]')) cerrarLocal(); });
            local._alSalir = alSalir;
            document.body.appendChild(local);
            document.addEventListener('keydown', escLocal);
            window.addEventListener('resize', onResize);
        }
        actualizarLocal(f);
    }
    function actualizarLocal(f) {
        if (!local) return;
        const j = JSON.stringify(f); if (j === ultimaLocal) return; ultimaLocal = j;
        pintar(local, f, true);
    }
    function escLocal(e) { if (e.key === 'Escape') cerrarLocal(); }
    function cerrarLocal() {
        if (!local) return;
        const cb = local._alSalir;
        local.remove(); local = null; ultimaLocal = null;
        document.removeEventListener('keydown', escLocal);
        if (cb) cb();
    }

    // ── Emisión hacia la Pizarra (clase en curso) ──
    let ultimaEmitida = null;
    function encender(sesionId, f) {
        try { localStorage.setItem(KEY, JSON.stringify({ sesionId, f })); } catch (_) {}
        ultimaEmitida = JSON.stringify(f);
        canal?.postMessage({ tipo: 'on', sesionId, f });
    }
    function emitir(sesionId, f) {
        const j = JSON.stringify(f); if (j === ultimaEmitida) return; ultimaEmitida = j;
        try { localStorage.setItem(KEY, JSON.stringify({ sesionId, f })); } catch (_) {}
        canal?.postMessage({ tipo: 'estado', sesionId, f });
    }
    function apagar() {
        ultimaEmitida = null;
        try { localStorage.removeItem(KEY); } catch (_) {}
        canal?.postMessage({ tipo: 'off' });
    }

    // ── Lado Pizarra: muestra la foto encima de la diapositiva ──
    let vista = null;
    function espejo() {
        if (!canal) return;
        const miSesion = new URLSearchParams(location.search).get('sesion');
        const mostrar = f => {
            if (f.tipo === 'part' && f.tablero) {   // Participación: el tablero idéntico al del profe
                if (vista) { vista.remove(); vista = null; }
                pintarTablero(f.tablero);
                return;
            }
            quitarTablero();
            css();
            if (!vista) {
                vista = document.createElement('div'); vista.className = 'lpro';
                document.body.appendChild(vista);
                window.addEventListener('resize', onResize);
            }
            pintar(vista, f, false);
        };
        const quitar = () => { if (vista) { vista.remove(); vista = null; } quitarTablero(); };
        canal.onmessage = ev => {
            const m = ev.data || {};
            if (m.tipo === 'off') { quitar(); return; }
            if ((m.tipo === 'on' || m.tipo === 'estado') && m.sesionId === miSesion && m.f) mostrar(m.f);
        };
        try {
            const e = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (e && e.sesionId === miSesion && e.f) mostrar(e.f);
        } catch (_) {}
    }

    window.LibroProyeccion = { abrirLocal, actualizarLocal, cerrarLocal, localAbierta: () => !!local,
                               encender, emitir, apagar, espejo, layoutTablero, dimensionarBig };
})();
