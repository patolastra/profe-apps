// Libro en el proyector (deuda AI, ver AUDITORIA/DESARROLLO_PARALELO.md).
// El Libro arma una "foto" de lo que quiere mostrar al curso (sin notas, comentarios ni
// adecuaciones) y esta pieza la dibuja en grande:
//   · con la clase en curso, en la Pizarra (espejo(): canal 'profe-espejo-libro', solo mirar);
//   · sin clase, a pantalla completa en la misma ventana (abrirLocal()).
// Fotos: { tipo:'general', curso, titulo, fecha, oa }
//        { tipo:'instr', curso, titulo, instr:{ nombre, clase:'rubrica'|'cotejo', niveles:[lab], items:[{ texto, desc:[..] }] } }
//        { tipo:'grupos', curso, titulo, grupos:[{ nombre, miembros:[..], terminado }], armando:[..], sinGrupo:[..] }
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
    .lpro-vacio{font-size:calc(28px*var(--k));color:#94a3b8;text-align:center;margin-top:12vh}`;
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
        return `<div class="lpro-gen"><h1>${esc(f.titulo || '')}</h1></div>`;
    }

    // Escala todo (variable --k): lo más grande posible que quepa sin scroll (para leer desde atrás).
    function ajustar(el) {
        const cu = el.querySelector('.lpro-cuerpo'); if (!cu) return;
        const cabe = () => cu.scrollHeight <= cu.clientHeight + 1 && cu.scrollWidth <= cu.clientWidth + 1;
        let k = 2.2; el.style.setProperty('--k', k);
        while (k > 0.45 && !cabe()) { k -= 0.05; el.style.setProperty('--k', k.toFixed(2)); }
    }

    function pintar(el, f, conSalir) {
        el.innerHTML = `<div class="lpro-top"><span class="lpro-curso">${esc(f.curso || '')}</span>
            <span class="lpro-titulo">${f.tipo === 'general' || f.tipo === 'pausa' ? '' : esc(f.titulo || '')}</span>
            ${conSalir ? '<button class="lpro-salir" data-salir>✕ Salir</button>' : ''}</div>
            <div class="lpro-cuerpo">${cuerpoHTML(f)}</div>`;
        ajustar(el);
    }

    // ── Pantalla completa en la misma ventana (sin clase en curso) ──
    let local = null, ultimaLocal = null;
    function onResize() { if (local) ajustar(local); if (vista) ajustar(vista); }
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
            css();
            if (!vista) {
                vista = document.createElement('div'); vista.className = 'lpro';
                document.body.appendChild(vista);
                window.addEventListener('resize', onResize);
            }
            pintar(vista, f, false);
        };
        const quitar = () => { if (vista) { vista.remove(); vista = null; } };
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
                               encender, emitir, apagar, espejo };
})();
