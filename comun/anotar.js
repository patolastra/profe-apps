// ═══════════════════════════════════════════════════════════════════════
// ⌨ Anotar rápido (deuda GQ, 2026-11-08) — Ctrl + Shift + 7 en cualquier parte del Workspace PC
// Un cuadro abajo a la derecha para anotar sin moverse de donde se está:
//   texto suelto           → ☑ pendiente (con curso: a su próxima clase; en General, sin fecha)
//   /pdte texto            → ☑ pendiente (igual)
//   /msj quién: mensaje    → ✉️ Mensajes          /ensayo quién: qué · /prueba quién: qué → 🎭 Ensayos
//   /bug texto · /mejora   → 🐞 Mejoras de la app  /apod estudiante: motivo → 👪 cita "Por citar"
// El curso parte adivinado (lo da quien lo usa: la pestaña abierta o la clase en curso; si no, General), se cambia
// con el selector o se escribe al comienzo ("5° traer guitarras", "/apod 3° Ana: …"). Un /apod en General busca al
// estudiante en todos los cursos y talleres y la cita queda en el suyo. Enter anota, el cuadro se cierra solo y
// queda un aviso de qué se creó y dónde; clic en el aviso lleva allí. Esc cierra.
// Necesita supabase/contextos.js, comun/pendientes.js y comun/apoderados.js (conectados con el mismo sb).
//
// Uso (Workspace):
//   Anotar.iniciar({ sb, cursoSugerido: () => 'NOMBRE' | null, ir: destino => {…} })
//     destino = { tipo: 'plan', ctx, fecha } | { tipo: 'dashboard', vista: 'todos'|'msj'|'ens'|'apo' } | { tipo: 'mejoras' }
//   Anotar.escuchar(win)   → el atajo también dentro de esa ventana y de las que tiene adentro (se revisa sola)
//   Anotar.abrir()
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const ORDEN = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SEPTIMO', 'OCTAVO'];
    const RE_CMD = /^\s*\/(pdte|pendiente|msj|mensaje|ensayo|prueba|bug|mejora|apod|apoderado)(?![a-záéíóúñ])\s*/i;
    const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const disp = n => typeof ctxDisplay === 'function' ? ctxDisplay(n) : n;
    const mini = n => typeof ctxMinimo === 'function' ? ctxMinimo(n) : n;

    let op = null, sb = null;
    let ctxs = [];                 // [{ id, nombre, tipo }] en el orden del sistema (General primero)
    let alias = [];                // [{ re, nombre }] para el curso escrito al comienzo
    let caja = null, inp = null, sel = null, pista = null, sug = null, aviso = null;
    let elegido = null;            // estudiante elegido para /apod: { id, nombre, cid }
    let sugs = [], sugI = -1;
    let enviando = false;
    let volverA = null;            // elemento que tenía el teclado antes de abrir

    // ── Cursos ────────────────────────────────────────────────────────
    async function cargarCtxs() {
        if (ctxs.length) return;
        const { data } = await sb.from('contextos').select('id, nombre, tipo');
        const peso = c => {
            const n = String(c.nombre).toUpperCase();
            if (n === 'GENERAL') return -1;
            const i = ORDEN.indexOf(n);
            return i >= 0 ? i : c.tipo === 'taller' ? 100 : c.tipo === 'jefatura' ? 200 : 300;
        };
        ctxs = (data || []).filter(c => c.nombre).sort((a, b) => peso(a) - peso(b) || a.nombre.localeCompare(b.nombre));
        alias = [];
        const completos = new Set(ctxs.map(c => norm(c.nombre)));
        ctxs.forEach(c => {
            const n = String(c.nombre).toUpperCase();
            const label = norm(typeof ctxNombreVisible === 'function' ? ctxNombreVisible(n) : n);
            // Palabras sueltas del nombre ("cuerdas", "kids"), salvo las que son el nombre de otro ("castigadas")
            const sueltas = [...norm(n).split(/\s+/), ...label.split(/\s+/)]
                .filter(w => w.length >= 4 && !['taller', 'entretenido'].includes(w) && !(completos.has(w) && w !== norm(n)));
            const palabras = new Set([norm(n), label, ...sueltas]);
            const i = ORDEN.indexOf(n);
            const pats = [...palabras].map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
            if (i >= 0) pats.push(`${i + 1}\\s*(?:°|º|ro|do|to|vo|mo|no)`);
            pats.sort((a, b) => b.length - a.length);
            alias.push({ re: new RegExp(`^(?:${pats.join('|')})(?![a-z0-9])[\\s:,.-]*`, 'i'), nombre: n });
        });
        sel.innerHTML = ctxs.map(c => `<option value="${esc(String(c.nombre).toUpperCase())}">${esc(disp(c.nombre))}</option>`).join('');
    }
    const ctxDe = nombre => ctxs.find(c => String(c.nombre).toUpperCase() === nombre) || null;
    const generalId = () => ctxDe('GENERAL')?.id || null;

    // ── Leer lo escrito: comando, curso escrito y el resto ────────────────
    function leer() {
        const v = inp.value;
        let t = v, cmd = 'pdte';
        const m = t.match(RE_CMD);
        if (m) {
            cmd = m[1].toLowerCase();
            cmd = { pendiente: 'pdte', mensaje: 'msj', apoderado: 'apod' }[cmd] || cmd;
            t = t.slice(m[0].length);
        }
        t = t.replace(/^\s+/, '');
        let cursoEscrito = null;
        const tn = norm(t);   // mismo largo que t (las tildes se quitan de letras ya compuestas)
        for (const a of alias) {
            const mm = tn.match(a.re);
            if (mm) { cursoEscrito = a.nombre; t = t.slice(mm[0].length); break; }
        }
        const prefijo = v.slice(0, v.length - t.length);   // comando + curso escrito, tal como están
        t = t.trim();
        const curso = cursoEscrito || sel.dataset.base || 'GENERAL';
        let quien = '', que = '';
        if (['msj', 'ensayo', 'prueba', 'apod'].includes(cmd)) {
            const i = t.indexOf(':');
            quien = (i < 0 ? t : t.slice(0, i)).trim();
            que = i < 0 ? '' : t.slice(i + 1).trim();
        }
        return { cmd, resto: t, curso, cursoEscrito, prefijo, quien, que, conDosPuntos: t.includes(':') };
    }

    // ── Pantalla ──────────────────────────────────────────────────────
    function css() {
        if (document.getElementById('anotar-css')) return;
        const s = document.createElement('style');
        s.id = 'anotar-css';
        s.textContent = `
#anotar { position: fixed; right: 16px; bottom: 16px; z-index: 9000; width: min(460px, calc(100vw - 32px));
    background: #131c2e; border: 1px solid #3b82f6; border-radius: 12px; box-shadow: 0 18px 50px rgba(0,0,0,.55);
    padding: 10px; font-family: system-ui, -apple-system, sans-serif; color: #f1f5f9; }
#anotar[hidden] { display: none; }
#anotar .an-fila { display: flex; gap: 6px; align-items: center; }
#anotar select { flex: 0 0 150px; width: 150px; background: #1a2540; color: #f1f5f9; border: 1px solid #253455;
    border-radius: 8px; padding: 7px 6px; font: inherit; font-size: .85rem; }
#anotar input { flex: 1; min-width: 0; background: #0b1120; color: #f1f5f9; border: 1px solid #253455; border-radius: 8px;
    padding: 8px 10px; font: inherit; font-size: .95rem; outline: none; }
#anotar input:focus { border-color: #3b82f6; }
#anotar .an-x { flex: 0 0 auto; background: none; border: none; color: #7a8ba8; cursor: pointer; font-size: .95rem; padding: 4px 6px; }
#anotar .an-x:hover { color: #f1f5f9; }
#anotar .an-pista { margin-top: 6px; min-height: 1.2em; font-size: .8rem; color: #94a3b8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
#anotar .an-pista.error { color: #fca5a5; }
#anotar .an-sug { margin-top: 6px; max-height: 190px; overflow-y: auto; border-top: 1px solid #253455; }
#anotar .an-sug[hidden] { display: none; }
#anotar .an-sug div { padding: 6px 8px; border-radius: 6px; cursor: pointer; font-size: .88rem; display: flex; gap: 8px; }
#anotar .an-sug div .c { flex: 0 0 auto; opacity: .8; }
#anotar .an-sug div.on, #anotar .an-sug div:hover { background: #223052; }
#anotar-aviso { position: fixed; right: 16px; bottom: 16px; z-index: 9001; max-width: min(460px, calc(100vw - 32px));
    background: #14532d; border: 1px solid #22c55e; color: #dcfce7; border-radius: 12px; padding: 10px 14px;
    font-family: system-ui, -apple-system, sans-serif; font-size: .9rem; font-weight: 600; cursor: pointer;
    box-shadow: 0 18px 50px rgba(0,0,0,.5); }
#anotar-aviso:hover { background: #166534; }
#anotar-aviso[hidden] { display: none; }
#anotar-aviso .ir { opacity: .8; font-weight: 500; margin-left: 6px; }`;
        document.head.appendChild(s);
    }
    function armar() {
        if (caja) return;
        css();
        caja = document.createElement('div');
        caja.id = 'anotar'; caja.hidden = true;
        caja.innerHTML = `<div class="an-fila"><select title="Curso"></select>
            <input type="text" autocomplete="off" spellcheck="true" placeholder="Pendiente, /msj, /ensayo, /prueba, /apod, /bug, /mejora…">
            <button type="button" class="an-x" title="Cerrar (Esc)">✕</button></div>
            <div class="an-sug" hidden></div><div class="an-pista"></div>`;
        document.body.appendChild(caja);
        sel = caja.querySelector('select'); inp = caja.querySelector('input');
        pista = caja.querySelector('.an-pista'); sug = caja.querySelector('.an-sug');
        aviso = document.createElement('div');
        aviso.id = 'anotar-aviso'; aviso.hidden = true;
        document.body.appendChild(aviso);
        caja.querySelector('.an-x').onclick = () => cerrar();
        sel.onchange = () => { sel.dataset.base = sel.value; elegido = null; refrescar(); inp.focus(); };
        inp.addEventListener('input', () => { refrescar(); });
        inp.addEventListener('keydown', e => {
            if (e.key === 'Escape') { e.preventDefault(); cerrar(); return; }
            if (!sug.hidden && sugs.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
                e.preventDefault();
                sugI = (sugI + (e.key === 'ArrowDown' ? 1 : -1) + sugs.length) % sugs.length;
                pintarSugs(); return;
            }
            if (!sug.hidden && sugs.length && (e.key === 'Tab' || (e.key === 'Enter' && sugI >= 0))) {
                e.preventDefault(); elegir(sugs[Math.max(0, sugI)]); return;
            }
            if (e.key === 'Enter' && !e.isComposing) { e.preventDefault(); enviar(); }
        });
        sug.addEventListener('mousedown', e => {
            const d = e.target.closest('[data-i]'); if (!d) return;
            e.preventDefault(); elegir(sugs[+d.dataset.i]);
        });
        caja.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); cerrar(); } });
    }

    const NOMBRE_TIPO = { pdte: '☑ Pendiente', msj: '✉️ Mensaje', ensayo: '🎭 Ensayo', prueba: '📝 Prueba',
        bug: '🐞 Bug de la app', mejora: '✨ Mejora de la app', apod: '👪 Cita con apoderado' };
    let pedidoAlumnos = 0;
    async function refrescar() {
        const r = leer();
        sel.value = r.curso;
        if (r.cmd !== 'apod') elegido = null;
        else if (elegido && norm(r.quien) !== norm(elegido.nombre)) elegido = null;
        let t = NOMBRE_TIPO[r.cmd];
        if (r.cmd === 'pdte') t += r.curso === 'GENERAL' ? ' · General' : ` · ${disp(r.curso)}, próxima clase`;
        else if (r.cmd === 'msj') t += r.quien ? ` para ${r.quien}${r.conDosPuntos ? '' : ' — sigue con ":" y el mensaje'}` : ' — escribe quién: mensaje';
        else if (r.cmd === 'ensayo' || r.cmd === 'prueba') t += r.quien ? ` · ${r.quien}${r.conDosPuntos ? '' : ' — sigue con ":" y qué'}` : ' — escribe quién: qué';
        else if (r.cmd === 'apod') t += elegido ? ` · ${elegido.nombre} (${disp(nombreDeId(elegido.cid))})${r.conDosPuntos ? '' : ' — sigue con ":" y el motivo'}`
            : ' — escribe el nombre y elígelo de la lista';
        pintarPista(t);
        // Sugerencias de estudiantes (/apod, antes de los dos puntos)
        if (r.cmd === 'apod' && !r.conDosPuntos && r.quien.length >= 1) {
            const yo = ++pedidoAlumnos;
            const lista = await alumnosPara(r.curso);
            if (yo !== pedidoAlumnos) return;
            const palabras = norm(r.quien).split(/\s+/).filter(Boolean);
            sugs = lista.filter(a => calza(a, palabras)).slice(0, 30);
            sugI = sugs.length ? 0 : -1;
            pintarSugs();
        } else { sugs = []; sugI = -1; pintarSugs(); }
    }
    function pintarPista(t, error = false) { pista.textContent = t; pista.classList.toggle('error', error); }
    const nombreDeId = id => ctxs.find(c => c.id === id)?.nombre || '';
    function pintarSugs() {
        sug.hidden = !sugs.length;
        sug.innerHTML = sugs.map((a, i) => `<div data-i="${i}" class="${i === sugI ? 'on' : ''}"><span class="c" title="${esc(disp(nombreDeId(a.cid)))}">${esc(mini(nombreDeId(a.cid)))}</span><span>${esc(a.nombre)}</span></div>`).join('');
        sug.querySelector('.on')?.scrollIntoView({ block: 'nearest' });
    }
    function elegir(a) {
        if (!a) return;
        const r = leer();
        const pre = r.prefijo.replace(/\s*$/, ' ');
        inp.value = `${pre}${a.nombre}: `;
        elegido = a;
        sugs = []; sugI = -1; pintarSugs();
        refrescar();
        inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);
    }
    // Cada palabra escrita es el comienzo de una palabra del nombre ("ma be" → MARÍA BELÉN)
    const calza = (a, palabras) => { const w = a.n.split(/\s+/); return palabras.every(p => w.some(x => x.startsWith(p))); };
    // Estudiantes del curso (o de todos los cursos y talleres, en General)
    const cacheAl = new Map();
    async function alumnosPara(curso) {
        if (cacheAl.has(curso)) return cacheAl.get(curso);
        await Apoderados.cargar();
        let cids;
        if (curso === 'GENERAL') cids = Apoderados.contextosConAlumnos().filter(c => c.tipo !== 'jefatura').map(c => c.id);
        else { const c = ctxDe(curso); cids = c ? [c.id] : []; }
        const listas = await Promise.all(cids.map(async cid => (await Apoderados.alumnos(cid)).map(a => ({ ...a, cid, n: norm(a.nombre) }))));
        const todos = listas.flat().sort((a, b) => a.n.localeCompare(b.n));
        cacheAl.set(curso, todos);
        return todos;
    }

    // ── Anotar ────────────────────────────────────────────────────────
    async function enviar() {
        if (enviando) return;
        const r = leer();
        const falta = msg => { pintarPista(msg, true); inp.focus(); };
        if (!r.resto) return falta('Escribe algo para anotar.');
        if (['msj', 'ensayo', 'prueba'].includes(r.cmd) && (!r.quien || !r.que)) return falta('Falta "quién: qué" (con dos puntos).');
        if (r.cmd === 'apod') {
            if (!elegido) {   // escrito completo sin elegir: si coincide con uno solo, ese
                pintarPista('Buscando al estudiante…');
                enviando = true;
                let lista = [];
                try { lista = await alumnosPara(r.curso); } finally { enviando = false; }                const palabras = norm(r.quien).split(/\s+/).filter(Boolean);
                const c = palabras.length ? lista.filter(a => calza(a, palabras)) : [];
                if (c.length === 1) elegido = c[0];
                else return falta(c.length ? 'Hay varios con ese nombre: elígelo de la lista.' : 'Elige al estudiante de la lista del curso.');
            }
            if (!r.que) return falta('Falta el motivo después de los dos puntos.');
        }
        enviando = true; pintarPista('Anotando…');
        let res = null;
        try { res = await anotar(r); } catch (_) { res = null; }
        enviando = false;
        if (!res) return falta('No se pudo anotar — revisa la conexión.');
        inp.value = ''; elegido = null;
        cerrar();
        mostrarAviso(res.texto, res.destino);
    }
    async function anotar(r) {
        const curso = ctxDe(r.curso) || ctxDe('GENERAL');
        const esGeneral = !curso || String(curso.nombre).toUpperCase() === 'GENERAL';
        const cid = curso?.id || generalId();
        const nombre = esGeneral ? 'GENERAL' : String(curso.nombre).toUpperCase();
        const enCurso = esGeneral ? '' : ` · ${disp(nombre)}`;
        if (r.cmd === 'apod') {
            const c = await Apoderados.crear({ contexto_id: elegido.cid, estudiante_id: elegido.id, motivo: r.que });
            if (!c) return null;
            return { texto: `👪 Por citar: ${elegido.nombre} (${disp(nombreDeId(elegido.cid))})`, destino: { tipo: 'dashboard', vista: 'apo' } };
        }
        if (r.cmd === 'pdte') {
            const destino = esGeneral ? { contexto_id: cid, sesion_id: null } : await Pendientes.proximaClase(cid, { desde: Pendientes.hoyISO() });
            const p = await Pendientes.crear({ ...destino, texto: r.resto });
            if (!p) return null;
            if (destino.fecha) return { texto: `☑ Pendiente${enCurso}, clase del ${Pendientes.fechaCorta(destino.fecha)}`,
                destino: { tipo: 'plan', ctx: nombre, fecha: destino.fecha } };
            return { texto: `☑ Pendiente${esGeneral ? ' · General' : enCurso}`, destino: { tipo: 'dashboard', vista: 'todos' } };
        }
        // /msj, /ensayo, /prueba, /bug, /mejora: los mismos de siempre (Pendientes los reconoce por el comando)
        const texto = ['msj', 'ensayo', 'prueba'].includes(r.cmd) ? `/${r.cmd} ${r.quien}: ${r.que}` : `/${r.cmd} ${r.resto}`;
        const x = await Pendientes.crear({ contexto_id: cid, sesion_id: null, texto, silencioso: true });
        if (!x) return null;
        if (r.cmd === 'msj') return { texto: `✉️ Mensaje para ${r.quien}${enCurso}`, destino: { tipo: 'dashboard', vista: 'msj' } };
        if (r.cmd === 'ensayo' || r.cmd === 'prueba') return { texto: `${r.cmd === 'prueba' ? '📝 Prueba' : '🎭 Ensayo'}: ${r.quien}${enCurso}`, destino: { tipo: 'dashboard', vista: 'ens' } };
        return { texto: `${r.cmd === 'bug' ? '🐞 Bug' : '✨ Mejora'} anotado en Mejoras de la app`, destino: { tipo: 'mejoras' } };
    }
    let avisoT = null;
    function mostrarAviso(texto, destino) {
        aviso.innerHTML = `${esc(texto)}<span class="ir">· ir ›</span>`;
        aviso.title = 'Ir allí';
        aviso.hidden = false;
        aviso.onclick = () => { aviso.hidden = true; clearTimeout(avisoT); try { op.ir?.(destino); } catch (_) {} };
        clearTimeout(avisoT);
        avisoT = setTimeout(() => { aviso.hidden = true; }, 8000);
    }

    // ── Abrir / cerrar ────────────────────────────────────────────────
    async function abrir() {
        if (!op) return;
        try { if (op.puede && !op.puede()) return; } catch (_) {}
        armar();
        if (!caja.hidden) { inp.focus(); return; }
        aviso.hidden = true;
        try { volverA = document.activeElement; } catch (_) { volverA = null; }
        caja.hidden = false;
        inp.value = ''; elegido = null; sugs = []; pintarSugs(); pintarPista('');
        inp.focus();
        try { await cargarCtxs(); } catch (_) {}
        let base = null;
        try { base = op.cursoSugerido?.() || null; } catch (_) {}
        base = base && ctxDe(String(base).toUpperCase()) ? String(base).toUpperCase() : 'GENERAL';
        sel.dataset.base = base;
        refrescar();
        inp.focus();
    }
    function cerrar() {
        if (!caja || caja.hidden) return;
        caja.hidden = true;
        sugs = []; pintarSugs();
        try { op.alCerrar?.(volverA); } catch (_) {}
    }

    // ── Atajo: Ctrl + Shift + 7, también dentro de las pestañas (y de las que van dentro de otra) ──
    function alTeclear(e) {
        if (!(e.ctrlKey && e.shiftKey && !e.altKey && !e.metaKey)) return;
        if (e.code !== 'Digit7' && e.key !== '7' && e.key !== '/') return;
        e.preventDefault(); e.stopPropagation();
        if (e.repeat) return;
        abrir();
    }
    const vistas = new Set();
    function enganchar(w) {
        try { if (!w || w.__anotarAtajo) return; w.__anotarAtajo = true; w.addEventListener('keydown', alTeclear, true); vistas.add(w); } catch (_) {}
    }
    function barrer(w, nivel = 0) {
        if (nivel > 5) return;
        enganchar(w);
        try { w.document.querySelectorAll('iframe').forEach(f => barrer(f.contentWindow, nivel + 1)); } catch (_) {}
    }
    function escuchar(w) { barrer(w); }

    function iniciar(opciones) {
        op = opciones || {};
        sb = op.sb;
        escuchar(window);
        setInterval(() => barrer(window), 1500);   // pestañas nuevas, páginas que cambian, ventanas dentro de otras
    }

    window.Anotar = { iniciar, escuchar, abrir, cerrar };
})();
