// ═══════════════════════════════════════════════════════════════════════
// Apoderados — citas a apoderados (deuda BK, 2026-10-13; pendientes, paso 3)
// Tres etapas: Por citar (motivo) → Citado o llamada agendada (fecha y hora; ese día aparece en ☀ Hoy) →
// Atendido (acuerdos). Si el apoderado no llega, vuelve a Por citar. De los acuerdos se
// pueden crear pendientes del curso (a mano, nunca solo). Cada cita va ligada a un
// estudiante de la lista del curso. Sin teléfono ni datos del apoderado (DECISIÓN del PO).
// La usan el Dashboard (todas + las de hoy), el Plan y Cursos (las del curso).
// Al instante entre pestañas (BroadcastChannel) y equipos (Realtime). Estilos en
// comun/apoderados.css. Tabla `apoderado_citas` (supabase/apoderado_citas.sql).
// Necesita supabase/contextos.js; para "→ Pendiente", comun/pendientes.js.
//
// Uso:
//   Apoderados.conectar(sb)
//   const l = Apoderados.lista(caja, { contextoId, soloHoy, alCambiar })
//   l.nueva() · l.destruir()
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const COLS = 'id, contexto_id, estudiante_id, motivo, estado, modalidad, cita_en, acuerdos, atendido_en, created_at, libro_estudiantes(nombre, apellido, nombre_social)';
    const DIAS_ATENDIDAS = 30;      // atendidas: se ven 30 días (no se borran)
    const ORDEN = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SEPTIMO', 'OCTAVO'];

    let sb = null, cargado = null;
    const citas = new Map();        // id → cita
    const ctxs = new Map();         // id → { id, nombre, tipo }
    const listas = new Set();
    const alumnosCache = new Map(); // contexto_id → [{ id, nombre, apellido }]
    const canal = 'BroadcastChannel' in window ? new BroadcastChannel('profe-apoderados') : null;
    const avisar = m => { try { canal?.postMessage(m); } catch (_) {} };
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const hoyISO = () => iso(new Date());
    const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const fechaHora = t => {
        const d = new Date(t);
        return `${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    };
    const aLocalInput = t => { const d = new Date(t); return `${iso(d)}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
    const nombreCtx = id => ctxs.get(id)?.nombre || '';
    const icono = id => { const n = nombreCtx(id); return typeof ctxMinimo === 'function' ? ctxMinimo(n) : n; };
    const display = id => { const n = nombreCtx(id); return typeof ctxDisplay === 'function' ? ctxDisplay(n) : n; };
    const nombreEst = e => {
        if (!e) return 'Estudiante';
        const nom = (e.nombre_social || '').trim() || e.nombre || '';
        return `${nom} ${e.apellido || ''}`.trim();
    };

    // ── Datos ───────────────────────────────────────────────────────────
    function conectar(cliente) {
        if (sb) return;
        sb = cliente;
        try {
            sb.channel('profe-apoderados')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'apoderado_citas' }, pl => {
                  if (pl.eventType === 'DELETE') { if (pl.old?.id) quitarLocal(pl.old.id); return; }
                  if (pl.new?.id) refrescar(pl.new.id);
              })
              .subscribe();
        } catch (_) {}
    }
    if (canal) canal.onmessage = e => {
        const m = e.data || {};
        if (m.tipo === 'poner' && m.c) ponerLocal(m.c);
        if (m.tipo === 'quitar' && m.id) quitarLocal(m.id);
    };
    function ponerLocal(c) { citas.set(c.id, c); repintarTodo(); }
    function quitarLocal(id) { if (citas.delete(id)) repintarTodo(); }
    async function refrescar(id) {
        const { data } = await sb.from('apoderado_citas').select(COLS).eq('id', id).maybeSingle();
        if (data) ponerLocal(data);
    }

    function cargar() {
        if (cargado) return cargado;
        cargado = (async () => {
            const desde = new Date(Date.now() - DIAS_ATENDIDAS * 864e5).toISOString();
            const [cx, a, b] = await Promise.all([
                sb.from('contextos').select('id, nombre, tipo'),
                sb.from('apoderado_citas').select(COLS).neq('estado', 'atendido'),
                sb.from('apoderado_citas').select(COLS).eq('estado', 'atendido').gte('atendido_en', desde),
            ]);
            (cx.data || []).forEach(c => ctxs.set(c.id, c));
            if (a.error) throw a.error;
            [...(a.data || []), ...(b.data || [])].forEach(c => citas.set(c.id, c));
        })();
        cargado.catch(() => { cargado = null; });
        return cargado;
    }

    async function guardar(id, cambios) {
        const c = citas.get(id);
        if (!c) return;
        Object.assign(c, cambios);
        repintarTodo();
        const { data, error } = await sb.from('apoderado_citas')
            .update({ ...cambios, updated_at: new Date().toISOString() }).eq('id', id).select(COLS).single();
        if (error) { aviso('No se pudo guardar la cita. Revisa la conexión.'); return; }
        citas.set(id, data); avisar({ tipo: 'poner', c: data });
    }
    async function crear({ contexto_id, estudiante_id, motivo }) {
        const { data, error } = await sb.from('apoderado_citas')
            .insert({ contexto_id, estudiante_id, motivo }).select(COLS).single();
        if (error) { aviso('No se pudo crear la cita. Revisa la conexión.'); return null; }
        ponerLocal(data); avisar({ tipo: 'poner', c: data });
        return data;
    }
    async function borrar(id) {
        quitarLocal(id);
        const { error } = await sb.from('apoderado_citas').delete().eq('id', id);
        if (error) { aviso('No se pudo borrar la cita.'); return; }
        avisar({ tipo: 'quitar', id });
    }

    // Contextos con estudiantes: cursos, talleres y jefaturas (estas toman la lista de su curso).
    function contextosConAlumnos() {
        const peso = c => c.tipo === 'curso' ? ORDEN.indexOf(c.nombre) : c.tipo === 'taller' ? 100 : 200;
        return [...ctxs.values()].filter(c => ['curso', 'taller', 'jefatura'].includes(c.tipo))
            .sort((a, b) => peso(a) - peso(b) || a.nombre.localeCompare(b.nombre));
    }
    async function alumnos(cid) {
        if (alumnosCache.has(cid)) return alumnosCache.get(cid);
        const ctx = ctxs.get(cid);
        const { data: an } = await sb.from('libro_anios').select('id').eq('activo', true).limit(1);
        const anioId = an?.[0]?.id;
        if (!ctx || !anioId) return [];
        let ids = [];
        if (ctx.tipo === 'taller') {
            const { data } = await sb.from('libro_pertenencias_taller').select('estudiante_id').eq('anio_id', anioId).eq('contexto_id', cid);
            ids = (data || []).map(p => p.estudiante_id);
        } else {
            let pob = cid;
            try {
                const { data: vp } = await sb.from('libro_contexto_poblacion').select('poblacion_ctx_id').eq('contexto_id', cid).eq('anio_id', anioId).limit(1);
                if (vp?.[0]) pob = vp[0].poblacion_ctx_id;
            } catch (_) {}
            const { data } = await sb.from('libro_matriculas').select('estudiante_id').eq('anio_id', anioId).eq('contexto_id', pob).eq('estado', 'activo');
            ids = (data || []).map(m => m.estudiante_id);
        }
        if (!ids.length) return [];
        const { data: est } = await sb.from('libro_estudiantes').select('id, nombre, apellido, nombre_social').in('id', ids);
        const lista = (est || []).map(e => ({ id: e.id, nombre: nombreEst(e) }))
            .sort((a, b) => norm(a.nombre).localeCompare(norm(b.nombre)));
        alumnosCache.set(cid, lista);
        return lista;
    }

    // ── Pantalla ────────────────────────────────────────────────────────
    function aviso(t) {
        listas.forEach(L => { const a = L.caja.querySelector('.ap-aviso'); if (a) { a.textContent = t; setTimeout(() => { a.textContent = ''; }, 5000); } });
    }
    function repintarTodo() { listas.forEach(L => { if (L.caja.isConnected) pintar(L); else listas.delete(L); }); }

    function lista(caja, op = {}) {
        const L = { caja, op, abiertas: false, form: false };
        caja.classList.add('ap-lista');
        listas.add(L);
        caja.innerHTML = '<div class="ap-vacio">Cargando…</div>';
        cargar().then(() => pintar(L), () => { caja.innerHTML = '<div class="ap-vacio">No se pudieron cargar las citas.</div>'; });
        L.nueva = () => { L.form = true; pintar(L); };
        L.destruir = () => { listas.delete(L); caja.innerHTML = ''; };
        L.repintar = () => pintar(L);
        return L;
    }

    function delaLista(L) {
        return [...citas.values()].filter(c => {
            if (L.op.contextoId && c.contexto_id !== L.op.contextoId) return false;
            if (L.op.soloHoy) return c.estado === 'citado' && c.cita_en && iso(new Date(c.cita_en)) === hoyISO();
            return true;
        });
    }

    function pintar(L) {
        if (L.caja.contains(document.activeElement) && document.activeElement.matches('textarea, input[type=text]')) {
            L.pend = true;                // no interrumpir lo que se está escribiendo; se repinta al salir
            clearTimeout(L.espera); L.espera = setTimeout(() => { if (L.pend) pintar(L); }, 1500);
            return;
        }
        L.pend = false;
        const todas = delaLista(L);
        const porCitar = todas.filter(c => c.estado === 'por_citar').sort((a, b) => a.created_at < b.created_at ? -1 : 1);
        const citados = todas.filter(c => c.estado === 'citado').sort((a, b) => (a.cita_en || '') < (b.cita_en || '') ? -1 : 1);
        const atendidas = todas.filter(c => c.estado === 'atendido').sort((a, b) => (a.atendido_en || '') > (b.atendido_en || '') ? -1 : 1);
        const caja = L.caja;
        caja.innerHTML = '';
        if (L.op.soloHoy) {
            citados.forEach(c => caja.appendChild(fila(L, c)));
        } else {
            if (L.form) caja.appendChild(formNueva(L));
            const sec = (titulo, arr, cls) => {
                if (!arr.length) return;
                const h = document.createElement('div');
                h.className = 'ap-sec ' + cls;
                h.textContent = `${titulo} · ${arr.length}`;
                caja.appendChild(h);
                arr.forEach(c => caja.appendChild(fila(L, c)));
            };
            sec('Por citar', porCitar, 'ap-sec-por');
            sec('Agendados', citados, 'ap-sec-cit');
            if (!porCitar.length && !citados.length && !L.form) {
                const v = document.createElement('div');
                v.className = 'ap-vacio';
                v.textContent = 'Sin citas pendientes.';
                caja.appendChild(v);
            }
            if (atendidas.length) {
                const h = document.createElement('button');
                h.type = 'button';
                h.className = 'ap-sec ap-sec-at';
                h.textContent = `${L.abiertas ? '▾' : '▸'} Atendidas · ${atendidas.length}`;
                h.onclick = () => { L.abiertas = !L.abiertas; pintar(L); };
                caja.appendChild(h);
                if (L.abiertas) atendidas.forEach(c => caja.appendChild(fila(L, c)));
            }
            if (!L.form && !L.op.sinBoton) {
                const b = document.createElement('button');
                b.type = 'button';
                b.className = 'ap-add';
                b.textContent = '＋ Cita';
                b.onclick = () => L.nueva();
                caja.appendChild(b);
            }
        }
        const a = document.createElement('div');
        a.className = 'ap-aviso';
        caja.appendChild(a);
        caja.querySelectorAll('textarea').forEach(crecer);
        L.op.alCambiar?.({ porCitar: porCitar.length, citados: citados.length, total: porCitar.length + citados.length });
    }
    // Repintar lo que quedó en espera al terminar de escribir.
    document.addEventListener('focusout', () => setTimeout(() => listas.forEach(L => { if (L.pend && !L.caja.contains(document.activeElement)) pintar(L); }), 0));

    function fila(L, c) {
        const el = document.createElement('div');
        el.className = 'ap-fila ap-' + c.estado;
        const vencida = c.estado === 'citado' && c.cita_en && new Date(c.cita_en) < new Date() && iso(new Date(c.cita_en)) !== hoyISO();
        if (vencida) el.classList.add('ap-vencida');
        const llamada = c.modalidad === 'llamada';
        const curso = L.op.contextoId ? '' : `<span class="ap-curso" title="${esc(display(c.contexto_id))}">${esc(icono(c.contexto_id))}</span>`;
        el.innerHTML = `
            <div class="ap-cab">
                ${curso}<span class="ap-est">${esc(nombreEst(c.libro_estudiantes))}</span>
                ${c.estado === 'citado' && c.cita_en ? `<button type="button" class="ap-fecha" title="${llamada ? 'Llamada · cambiar fecha y hora' : 'Cita · cambiar fecha y hora'}">${llamada ? '📞' : '📅'} ${esc(fechaHora(c.cita_en))}</button>` : ''}
                <span class="ap-sp"></span>
                <span class="ap-acc"></span>
                <button type="button" class="ap-del" title="Borrar la cita">✕</button>
            </div>
            <textarea class="ap-motivo" rows="1" placeholder="Motivo de la citación…">${esc(c.motivo)}</textarea>
            <div class="ap-extra"></div>`;
        const mot = el.querySelector('.ap-motivo');
        crecer(mot);
        mot.oninput = () => crecer(mot);
        mot.onchange = () => guardar(c.id, { motivo: mot.value.trim() });
        el.querySelector('.ap-del').onclick = () => { if (confirm('¿Borrar esta cita?')) borrar(c.id); };
        const acc = el.querySelector('.ap-acc');
        const extra = el.querySelector('.ap-extra');
        const boton = (txt, titulo, fn, cls = '') => {
            const b = document.createElement('button');
            b.type = 'button'; b.className = 'ap-btn ' + cls; b.textContent = txt; b.title = titulo; b.onclick = fn;
            acc.appendChild(b);
        };
        const pedirFecha = (modalidad = c.modalidad || 'cita') => {
            extra.innerHTML = `<div class="ap-cuando"><input type="datetime-local" class="ap-dt"><button type="button" class="ap-btn ap-ok">Guardar</button><button type="button" class="ap-btn ap-no">Cancelar</button></div>`;
            const dt = extra.querySelector('.ap-dt');
            if (c.cita_en) dt.value = aLocalInput(c.cita_en);
            else { const d = new Date(); d.setDate(d.getDate() + 1); d.setHours(15, 0, 0, 0); dt.value = aLocalInput(d); }
            dt.focus();
            extra.querySelector('.ap-ok').onclick = () => {
                if (!dt.value) return;
                guardar(c.id, { estado: 'citado', modalidad, cita_en: new Date(dt.value).toISOString() });
            };
            extra.querySelector('.ap-no').onclick = () => { extra.innerHTML = ''; };
        };
        if (c.estado === 'por_citar') {
            boton('📞 Llamar', 'Agendar una llamada (fecha y hora)', () => pedirFecha('llamada'));
            boton('📅 Citar', 'Citar en persona (fecha y hora)', () => pedirFecha('cita'), 'ap-prim');
        } else if (c.estado === 'citado') {
            el.querySelector('.ap-fecha').onclick = () => pedirFecha();
            boton(llamada ? 'No contestó' : 'No vino', llamada ? 'No contestó: vuelve a Por citar' : 'El apoderado no llegó: vuelve a Por citar',
                () => guardar(c.id, { estado: 'por_citar', cita_en: null }));
            boton('✓ Atendido', 'Se atendió: anotar acuerdos', () => { L.abiertas = true; guardar(c.id, { estado: 'atendido', atendido_en: new Date().toISOString() }); }, 'ap-prim');
        } else {
            const d = c.atendido_en ? new Date(c.atendido_en) : null;
            if (d) { const s = document.createElement('span'); s.className = 'ap-cuando-at'; s.textContent = `${llamada ? '📞 ' : ''}atendido ${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; acc.appendChild(s); }
            extra.innerHTML = `
                <textarea class="ap-acuerdos" rows="2" placeholder="Acuerdos…">${esc(c.acuerdos)}</textarea>
                <div class="ap-accion"><input type="text" class="ap-accion-txt" placeholder="Acción a tomar → pendiente del curso (Enter)"><button type="button" class="ap-btn">→ Pendiente</button></div>`;
            const ac = extra.querySelector('.ap-acuerdos');
            crecer(ac);
            ac.oninput = () => crecer(ac);
            ac.onchange = () => guardar(c.id, { acuerdos: ac.value.trim() });
            const inp = extra.querySelector('.ap-accion-txt');
            const aPend = async () => {
                const t = inp.value.trim();
                if (!t) { inp.focus(); return; }
                if (!window.Pendientes) { aviso('Los pendientes no están disponibles en esta página.'); return; }
                const est = nombreEst(c.libro_estudiantes).split(' ')[0];
                const dest = await Pendientes.proximaClase(c.contexto_id);
                const p = await Pendientes.crear({ ...dest, texto: `Apoderado de ${est}: ${t}` });
                if (p) { inp.value = ''; aviso(`Pendiente creado${dest.fecha ? ' para la clase del ' + dest.fecha.split('-').reverse().slice(0, 2).join('/') : ''}.`); }
            };
            inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); aPend(); } };
            extra.querySelector('.ap-accion button').onclick = aPend;
        }
        return el;
    }

    function formNueva(L) {
        const f = document.createElement('div');
        f.className = 'ap-form';
        const fijo = L.op.contextoId;
        f.innerHTML = `
            ${fijo ? '' : '<div class="ap-cursos"></div>'}
            <input type="text" class="ap-buscar" placeholder="${fijo ? 'Estudiante…' : 'Elige el curso y busca al estudiante…'}" autocomplete="off">
            <div class="ap-sugs"></div>
            <textarea class="ap-motivo-n" rows="1" placeholder="Motivo de la citación…"></textarea>
            <div class="ap-form-acc"><button type="button" class="ap-btn ap-no">Cancelar</button><button type="button" class="ap-btn ap-prim ap-ok" disabled>Agregar</button></div>`;
        let cid = fijo || null, est = null, lista = [];
        const buscar = f.querySelector('.ap-buscar'), sugs = f.querySelector('.ap-sugs'), ok = f.querySelector('.ap-ok');
        const mot = f.querySelector('.ap-motivo-n');
        mot.oninput = () => crecer(mot);
        const listo = () => { ok.disabled = !(cid && est); };
        const mostrar = () => {
            const q = norm(buscar.value);
            if (!cid) { sugs.innerHTML = '<div class="ap-vacio">Elige primero el curso.</div>'; return; }
            if (est && buscar.value === est.nombre) { sugs.innerHTML = ''; return; }
            const v = lista.filter(a => !q || norm(a.nombre).includes(q)).slice(0, 8);
            sugs.innerHTML = v.length ? '' : '<div class="ap-vacio">Sin coincidencias.</div>';
            v.forEach(a => {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'ap-sug'; b.textContent = a.nombre;
                b.onmousedown = e => e.preventDefault();
                b.onclick = () => { est = a; buscar.value = a.nombre; sugs.innerHTML = ''; listo(); mot.focus(); };
                sugs.appendChild(b);
            });
        };
        const elegirCurso = async id => {
            cid = id; est = null; buscar.value = ''; listo();
            f.querySelectorAll('.ap-cur').forEach(b => b.classList.toggle('activo', b.dataset.id === id));
            sugs.innerHTML = '<div class="ap-vacio">Cargando…</div>';
            lista = await alumnos(id);
            if (cid !== id) return;
            mostrar(); buscar.focus();
        };
        if (!fijo) {
            const cc = f.querySelector('.ap-cursos');
            contextosConAlumnos().forEach(c => {
                const b = document.createElement('button');
                b.type = 'button'; b.className = 'ap-cur'; b.dataset.id = c.id;
                b.textContent = icono(c.id); b.title = display(c.id);
                b.onclick = () => elegirCurso(c.id);
                cc.appendChild(b);
            });
        } else {
            alumnos(fijo).then(a => { lista = a; });
        }
        buscar.oninput = () => { est = null; listo(); mostrar(); };
        buscar.onfocus = () => { if (cid) mostrar(); };
        f.querySelector('.ap-no').onclick = () => { L.form = false; pintar(L); };
        ok.onclick = async () => {
            if (!cid || !est) return;
            ok.disabled = true;
            if (f.contains(document.activeElement)) document.activeElement.blur();
            L.form = false;
            const nueva = await crear({ contexto_id: cid, estudiante_id: est.id, motivo: mot.value.trim() });
            if (!nueva) pintar(L);
        };
        setTimeout(() => (fijo ? buscar : f.querySelector('.ap-cur') || buscar).focus(), 0);
        return f;
    }

    function crecer(t) { t.style.height = 'auto'; t.style.height = (t.scrollHeight + 2) + 'px'; }

    window.Apoderados = { conectar, cargar, lista };
})();
