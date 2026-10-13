// ═══════════════════════════════════════════════════════════════════════
// Pendientes — una sola lista de pendientes en todo el sistema (deudas BB y BC, 2026-10-12)
// La usan el Dashboard (cursos + HOY), "Pendientes" del Plan, "Pendientes" de la Bitácora
// y Cursos. Se ve y funciona igual en todos lados: activos arriba, "Completados" abajo en
// gris y cursiva (se dejan de ver 2 semanas después de completados); agregar, editar,
// marcar y borrar; ☀ = a la lista HOY (cada día parte vacía); subpendientes de un nivel,
// plegables; desde 3 semanas arrastrado: "Sigue" / "Archivar".
// Al instante: entre pestañas del mismo computador (BroadcastChannel) y entre
// equipos (Supabase Realtime, supabase/pendientes_realtime.sql).
// Estilos en comun/pendientes.css. Tabla `pendientes`, categoria 'tarea_proxima'.
//
// Uso:
//   Pendientes.conectar(sb)
//   await Pendientes.cargar(sb => sb.from('pendientes').select(Pendientes.COLS).eq(...))
//   const l = Pendientes.lista(caja, { filtro, alta, mostrarClase, mostrarCurso, botonAgregar,
//                                      vacio, alCambiar, todosCompletados, completadosAbiertos })
//   l.agregar() · l.repintar()
//   Pendientes.crear({ contexto_id, sesion_id, fecha, texto, hoy })
//   Pendientes.proximaClase(contexto_id)   → destino { contexto_id, sesion_id, fecha }
//   Pendientes.guardarTodo()   (antes de cerrar una ventana)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'tarea_proxima';
    const COLS = 'id, contexto_id, sesion_id, categoria, texto, estado, semanas_pendiente, hoy, completado_en, padre_id, created_at, sesiones(fecha)';
    const DIAS_VISIBLE_COMP = 14;     // completados: se dejan de ver a las 2 semanas
    const SEM_ARRASTRE = 3;           // desde 3 semanas: "Sigue" / "Archivar"

    let sb = null;
    const filas  = new Map();     // id → pendiente { …, fecha (de su clase) }
    const fechas = new Map();     // sesion_id → fecha
    const listas = new Set();
    const timers = {};            // guardado del texto, por id
    const canal  = 'BroadcastChannel' in window ? new BroadcastChannel('profe-pendientes') : null;

    const hoyISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    let plegados;
    try { plegados = new Set(JSON.parse(localStorage.getItem('profe_pend_plegados') || '[]')); } catch (_) { plegados = new Set(); }
    const guardarPlegados = () => { try { localStorage.setItem('profe_pend_plegados', JSON.stringify([...plegados])); } catch (_) {} };

    // ── Datos ───────────────────────────────────────────────────────────
    function conectar(cliente) {
        if (sb) return;
        sb = cliente;
        try {
            sb.channel('profe-pendientes')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'pendientes' }, pl => {
                  if (pl.eventType === 'DELETE') { if (pl.old?.id) quitarLocal(pl.old.id); return; }
                  if (pl.new && pl.new.categoria === CAT) ponerLocal(pl.new);
              })
              .subscribe();
        } catch (_) {}
    }
    if (canal) canal.onmessage = e => {
        const m = e.data || {};
        if (m.tipo === 'poner' && m.p) ponerLocal(m.p);
        if (m.tipo === 'quitar' && m.id) quitarLocal(m.id);
    };
    const avisar = m => { try { canal?.postMessage(m); } catch (_) {} };

    function ponerLocal(p, silencioso) {
        const n = { ...(filas.get(p.id) || {}), ...p };
        if (p.sesiones) n.fecha = p.sesiones.fecha;
        delete n.sesiones;
        if (n.sesion_id && fechas.has(n.sesion_id) && (!p.sesiones || !n.fecha)) n.fecha = fechas.get(n.sesion_id);
        if (!n.sesion_id) n.fecha = null;
        if (n.fecha && n.sesion_id) fechas.set(n.sesion_id, n.fecha);
        if (n.sesion_id && !n.fecha) pedirFecha(n.sesion_id);
        filas.set(p.id, n);
        if (!silencioso) repintarTodo();
        return n;
    }
    function quitarLocal(id) {
        if (!filas.delete(id)) return;
        filas.forEach((p, k) => { if (p.padre_id === id) filas.delete(k); });   // el padre se lleva a sus hijos
        repintarTodo();
    }
    const pidiendo = new Set();
    async function pedirFecha(sid) {
        if (pidiendo.has(sid) || !sb) return;
        pidiendo.add(sid);
        const { data } = await sb.from('sesiones').select('fecha').eq('id', sid).maybeSingle();
        if (data?.fecha) {
            fechas.set(sid, data.fecha);
            filas.forEach(p => { if (p.sesion_id === sid) p.fecha = data.fecha; });
            repintarTodo();
        }
    }

    async function cargar(consulta) {
        const { data, error } = await consulta(sb);
        if (error) return { error };
        (data || []).forEach(p => ponerLocal(p, true));
        repintarTodo();
        return { data };
    }

    async function crear({ contexto_id, sesion_id, fecha, texto = '', hoy = null, padre_id = null }) {
        const { data, error } = await sb.from('pendientes').insert({
            contexto_id, sesion_id: sesion_id || null, categoria: CAT, texto, estado: 'activo', hoy, padre_id,
        }).select(COLS).single();
        if (error) return null;
        if (fecha && !data.sesiones) data.sesiones = { fecha };
        const p = ponerLocal(data);
        avisar({ tipo: 'poner', p });
        return p;
    }
    async function cambiar(id, cambios) {
        const p = filas.get(id);
        if (!p) return;
        const antes = { ...p };
        Object.assign(p, cambios);
        if ('sesion_id' in cambios) p.fecha = fechas.get(p.sesion_id) || null;
        avisar({ tipo: 'poner', p: { ...p } });
        repintarTodo();
        const { error } = await sb.from('pendientes').update(cambios).eq('id', id);
        if (error) {
            filas.set(id, antes); repintarTodo();
            avisar({ tipo: 'poner', p: antes });
            aviso('No se pudo guardar el pendiente — revisa la conexión.');
        }
    }
    async function borrar(id) {
        clearTimeout(timers[id]?.t); delete timers[id];
        const antes = filas.get(id);
        const hijos = [...filas.values()].filter(p => p.padre_id === id);
        filas.delete(id);
        hijos.forEach(h => filas.delete(h.id));
        avisar({ tipo: 'quitar', id });
        repintarTodo();
        const { error } = await sb.from('pendientes').delete().eq('id', id);
        if (error && antes) { ponerLocal(antes); hijos.forEach(h => ponerLocal(h)); aviso('No se pudo borrar el pendiente — revisa la conexión.'); }
    }
    // `el` = el cuadro donde se escribe (un mismo pendiente puede verse en varias listas).
    function guardarTexto(id, el, ahora) {
        clearTimeout(timers[id]?.t);
        const ir = () => {
            delete timers[id];
            const texto = el.value.trim();
            if (filas.get(id) && filas.get(id).texto !== texto) cambiar(id, { texto });
        };
        if (ahora) ir(); else timers[id] = { t: setTimeout(ir, 600), el };
    }
    function guardarTodo() { Object.entries(timers).forEach(([id, x]) => guardarTexto(id, x.el, true)); }

    function aviso(t) { listas.forEach(L => { const a = L.caja.querySelector('.pd-aviso'); if (a) { a.textContent = t; setTimeout(() => { a.textContent = ''; }, 5000); } }); }

    // Próxima clase de un curso (hoy incluida); si aún no existe, la próxima fecha de su
    // horario (se crea la sesión). Sin horario (General, por ejemplo): sin clase.
    async function proximaClase(cid) {
        if (!cid) return { contexto_id: null, sesion_id: null };
        const hoy = hoyISO();
        const { data } = await sb.from('sesiones').select('id, fecha')
            .eq('contexto_id', cid).gte('fecha', hoy).order('fecha', { ascending: true }).limit(1);
        if (data?.[0]) return { contexto_id: cid, sesion_id: data[0].id, fecha: data[0].fecha };
        const { data: hor } = await sb.from('horario').select('dia_semana').eq('contexto_id', cid).eq('activo', true);
        const dias = new Set((hor || []).map(h => (Number(h.dia_semana) + 1) % 7));   // 0 = lunes → getDay 1
        if (!dias.size) return { contexto_id: cid, sesion_id: null };
        const d = new Date(); d.setHours(12, 0, 0, 0);
        for (let i = 0; i < 21; i++, d.setDate(d.getDate() + 1)) {
            if (!dias.has(d.getDay())) continue;
            const f = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            let { data: s } = await sb.from('sesiones').select('id').eq('contexto_id', cid).eq('fecha', f).maybeSingle();
            if (!s) ({ data: s } = await sb.from('sesiones').insert({ contexto_id: cid, fecha: f }).select('id').single());
            return { contexto_id: cid, sesion_id: s?.id || null, fecha: f };
        }
        return { contexto_id: cid, sesion_id: null };
    }

    // ── Listas en pantalla ──────────────────────────────────────────────
    const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const fechaCorta = iso => { const d = new Date(iso + 'T12:00:00'); return `${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; };
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function lista(caja, op = {}) {
        const L = {
            caja, op, filasEl: new Map(), abiertoComp: op.completadosAbiertos !== false,
        };
        caja.classList.add('pd-lista');
        caja.innerHTML = `<div class="pd-activos"></div>
            ${op.botonAgregar === false || !op.alta ? '' : '<button class="pd-add" type="button">＋ Agregar pendiente</button>'}
            <div class="pd-vacio"></div>
            <div class="pd-comp" hidden>
                <button class="pd-comp-hdr" type="button"><span class="pd-comp-lbl"></span><span class="pd-comp-chev"></span></button>
                <div class="pd-comp-body"></div>
            </div>
            <div class="pd-aviso"></div>`;
        caja.querySelector('.pd-add')?.addEventListener('click', () => agregar(L));
        caja.querySelector('.pd-comp-hdr').addEventListener('click', () => { L.abiertoComp = !L.abiertoComp; pintar(L); });
        listas.add(L);
        ro?.observe(caja);
        pintar(L);
        return {
            agregar: () => agregar(L),
            repintar: () => pintar(L),
            destruir: () => { listas.delete(L); ro?.unobserve(caja); },
            cuenta: () => contar(L),
        };
    }

    // Completado hace más de 2 semanas → ya no se ve (salvo listas de historial).
    function vigente(L, p) {
        if (p.estado === 'activo') return true;
        if (p.estado !== 'completado') return false;
        if (L.op.todosCompletados || !p.completado_en) return true;
        return Date.now() - new Date(p.completado_en).getTime() < DIAS_VISIBLE_COMP * 864e5;
    }
    const esDeCat = p => !p.categoria || p.categoria === CAT;
    // Pendientes principales de la lista (los subpendientes van con su padre; si el padre no
    // está cargado, se muestran sueltos).
    function items(L) {
        return [...filas.values()].filter(p => esDeCat(p) && (!p.padre_id || !filas.has(p.padre_id))
            && vigente(L, p) && (!L.op.filtro || L.op.filtro(p)));
    }
    const porFecha = (a, b) => String(a.created_at).localeCompare(String(b.created_at));
    function hijosDe(L, id) { return [...filas.values()].filter(p => p.padre_id === id && vigente(L, p)).sort(porFecha); }
    function contar(L) { const it = items(L); return { activos: it.filter(p => p.estado === 'activo').length, completados: it.filter(p => p.estado === 'completado').length }; }

    async function agregar(L) {
        if (!L.op.alta) return;
        const destino = await L.op.alta();
        if (!destino) { aviso(L.op.sinDestino || 'Este curso no tiene una próxima clase en el horario.'); return; }
        const p = await crear(destino);
        if (!p) { aviso('No se pudo crear el pendiente — revisa la conexión.'); return; }
        enfocarFila(L, p.id);
    }
    async function agregarHijo(L, padre) {            // queda al final de sus subpendientes
        plegados.delete(padre.id); guardarPlegados();
        const p = await crear({ contexto_id: padre.contexto_id, sesion_id: padre.sesion_id, fecha: padre.fecha, padre_id: padre.id });
        if (!p) { aviso('No se pudo crear el pendiente — revisa la conexión.'); return; }
        enfocarFila(L, p.id);
    }
    function enfocarFila(L, id) {
        const t = L.caja.querySelector(`.pd-fila[data-id="${id}"] .pd-txt`);
        if (t) t.focus();
    }

    function repintarTodo() { listas.forEach(L => { if (L.caja.isConnected) pintar(L); else listas.delete(L); }); }
    // Al pasar la medianoche (o volver a la pestaña), HOY parte vacía.
    let diaPintado = hoyISO();
    const revisarDia = () => { if (hoyISO() !== diaPintado) { diaPintado = hoyISO(); repintarTodo(); } };
    document.addEventListener('visibilitychange', revisarDia);
    setInterval(revisarDia, 60000);

    function pintar(L) {
        const it = items(L).sort(porFecha);
        const act = it.filter(p => p.estado === 'activo'), comp = it.filter(p => p.estado === 'completado');
        const cAct = L.caja.querySelector('.pd-activos'), cComp = L.caja.querySelector('.pd-comp-body');
        const vivos = new Set();
        it.forEach(p => { vivos.add(p.id); hijosDe(L, p.id).forEach(h => vivos.add(h.id)); });
        L.filasEl.forEach((el, id) => { if (!vivos.has(id)) { el.remove(); L.filasEl.delete(id); } });
        colocar(L, cAct, act);
        colocar(L, cComp, comp);
        const caja = L.caja.querySelector('.pd-comp');
        caja.hidden = !comp.length;
        caja.classList.toggle('pd-cerrado', !L.abiertoComp);
        L.caja.querySelector('.pd-comp-lbl').textContent = `Completados · ${comp.length}`;
        L.caja.querySelector('.pd-comp-chev').textContent = L.abiertoComp ? '▾' : '▸';
        const vacio = L.caja.querySelector('.pd-vacio');
        vacio.textContent = !act.length && L.op.vacio ? L.op.vacio : '';
        vacio.hidden = !vacio.textContent;
        if (L.op.alCambiar) L.op.alCambiar({ activos: act.length, completados: comp.length });
    }
    // Pone las filas en orden sin mover las que ya están en su lugar (no se pierde el cursor).
    function colocar(L, cont, lista, padre) {
        let ref = cont.firstElementChild;
        lista.forEach(p => {
            let el = L.filasEl.get(p.id);
            if (!el) { el = nodoEl(L, p); L.filasEl.set(p.id, el); }
            actualizarFila(L, el, p, !!padre);
            if (!padre) colocar(L, el.querySelector('.pd-hijos'), hijosDe(L, p.id), p);
            if (el === ref) { ref = ref.nextElementSibling; return; }
            cont.insertBefore(el, ref);
        });
    }
    function nodoEl(L, p) {
        const n = document.createElement('div');
        n.className = 'pd-nodo';
        n.dataset.id = p.id;
        n.innerHTML = `<div class="pd-fila" data-id="${p.id}">
                <button class="pd-plegar" type="button" tabindex="-1"></button>
                <input type="checkbox" class="pd-chk" title="Marcar como hecho">
                <textarea class="pd-txt" rows="1" placeholder="Escribe el pendiente…"></textarea>
                <span class="pd-meta"></span>
                <span class="pd-acc">
                    <button class="pd-sol" type="button" tabindex="-1" title="Agregar a HOY">☀</button>
                    <button class="pd-sub" type="button" tabindex="-1" title="Agregar un subpendiente">↳</button>
                    <button class="pd-del" type="button" tabindex="-1" title="Borrar">✕</button>
                </span>
            </div>
            <div class="pd-arr"><span class="pd-arr-txt"></span>
                <button class="pd-sigue" type="button" title="Sigue pendiente: el contador vuelve a cero">Sigue</button>
                <button class="pd-archivar" type="button" title="Sale de la lista sin borrarse">Archivar</button></div>
            <div class="pd-hijos"></div>`;
        const fila = n.firstElementChild;
        const chk = fila.querySelector('.pd-chk'), txt = fila.querySelector('.pd-txt');
        const yo = () => filas.get(p.id) || p;
        chk.addEventListener('change', () => {
            guardarTexto(p.id, txt, true);
            cambiar(p.id, chk.checked ? { estado: 'completado', completado_en: new Date().toISOString() } : { estado: 'activo', completado_en: null });
        });
        txt.addEventListener('input', () => { crecer(txt); guardarTexto(p.id, txt, false); });
        txt.addEventListener('blur', () => {
            if (!txt.value.trim() && !hijosDe(L, p.id).length) { borrar(p.id); return; }
            guardarTexto(p.id, txt, true);
        });
        txt.addEventListener('keydown', e => {
            const q = yo();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // En un subpendiente con texto, Enter crea el siguiente.
                if (q.padre_id && txt.value.trim() && filas.has(q.padre_id)) { guardarTexto(p.id, txt, true); agregarHijo(L, filas.get(q.padre_id)); return; }
                txt.blur(); return;
            }
            if (e.key === 'Tab' && !e.shiftKey && !q.padre_id && !hijosDe(L, q.id).length) {
                // Tab: pasa a ser subpendiente del pendiente de arriba.
                const arriba = n.previousElementSibling && filas.get(n.previousElementSibling.dataset.id);
                if (!arriba) return;
                e.preventDefault();
                guardarTexto(p.id, txt, true);
                plegados.delete(arriba.id); guardarPlegados();
                cambiar(q.id, { padre_id: arriba.id, sesion_id: arriba.sesion_id, contexto_id: arriba.contexto_id });
                setTimeout(() => enfocarFila(L, q.id), 0);
                return;
            }
            if (e.key === 'Tab' && e.shiftKey && q.padre_id) {
                e.preventDefault();
                guardarTexto(p.id, txt, true);
                cambiar(q.id, { padre_id: null });
                setTimeout(() => enfocarFila(L, q.id), 0);
            }
        });
        fila.querySelector('.pd-del').addEventListener('click', () => {
            const nh = hijosDe(L, p.id).length;
            if (nh && !confirm(`Este pendiente tiene ${nh} subpendiente${nh === 1 ? '' : 's'}. ¿Borrarlo con todo?`)) return;
            borrar(p.id);
        });
        fila.querySelector('.pd-sol').addEventListener('click', () => cambiar(p.id, { hoy: yo().hoy === hoyISO() ? null : hoyISO() }));
        fila.querySelector('.pd-sub').addEventListener('click', () => agregarHijo(L, yo()));
        fila.querySelector('.pd-plegar').addEventListener('click', () => {
            if (plegados.has(p.id)) plegados.delete(p.id); else plegados.add(p.id);
            guardarPlegados(); repintarTodo();
        });
        n.querySelector('.pd-sigue').addEventListener('click', () => cambiar(p.id, { semanas_pendiente: 0 }));
        n.querySelector('.pd-archivar').addEventListener('click', () => cambiar(p.id, { estado: 'descartado' }));
        return n;
    }
    function actualizarFila(L, n, p, esHijo) {
        const fila = n.firstElementChild;
        const hecho = p.estado === 'completado';
        const hijos = esHijo ? [] : hijosDe(L, p.id);
        const plegado = hijos.length && plegados.has(p.id);
        n.classList.toggle('pd-es-hijo', esHijo);
        n.classList.toggle('pd-plegado', !!plegado);
        fila.classList.toggle('pd-hecho', hecho);
        fila.classList.toggle('pd-en-hoy', p.hoy === hoyISO());
        fila.querySelector('.pd-chk').checked = hecho;
        const pl = fila.querySelector('.pd-plegar');
        pl.textContent = hijos.length ? (plegado ? '▸' : '▾') : '';
        pl.title = hijos.length ? (plegado ? 'Mostrar subpendientes' : 'Ocultar subpendientes') : '';
        pl.classList.toggle('pd-sin', !hijos.length);
        const txt = fila.querySelector('.pd-txt');
        if (document.activeElement !== txt && txt.value !== (p.texto || '')) txt.value = p.texto || '';
        requestAnimationFrame(() => crecer(txt));
        const sem = Number(p.semanas_pendiente) || 0;
        const partes = [];
        if (plegado) partes.push(`<span class="pd-cuenta" title="Subpendientes hechos">${hijos.filter(h => h.estado === 'completado').length}/${hijos.length}</span>`);
        if (!esHijo && !hecho && sem > 0) partes.push(`<span class="pd-sem" title="${sem === 1 ? 'Trasladado 1 semana' : `Trasladado ${sem} semanas`}">(${sem} sem)</span>`);
        if (!esHijo && L.op.mostrarCurso) { const c = L.op.mostrarCurso(p); if (c) partes.push(`<span class="pd-curso" title="Curso">${esc(c)}</span>`); }
        if (!esHijo && L.op.mostrarClase && p.fecha) partes.push(`<span class="pd-clase" title="Clase a la que pertenece">${fechaCorta(p.fecha)}</span>`);
        fila.querySelector('.pd-meta').innerHTML = partes.join(' ');
        fila.querySelector('.pd-sol').hidden = esHijo;
        fila.querySelector('.pd-sol').title = p.hoy === hoyISO() ? 'Quitar de HOY' : 'Agregar a HOY';
        fila.querySelector('.pd-sub').hidden = esHijo;
        const arrastrado = !esHijo && !hecho && sem >= SEM_ARRASTRE;
        fila.classList.toggle('pd-arrastrado', arrastrado);
        n.querySelector('.pd-arr').hidden = !arrastrado;
        if (arrastrado) n.querySelector('.pd-arr-txt').textContent = `Lleva ${sem} semanas.`;
    }
    function crecer(t) {
        if (!t.isConnected || !t.offsetParent) return;
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + (t.offsetHeight - t.clientHeight)) + 'px';
    }
    // Al cambiar el ancho de una lista, reajustar las alturas.
    const ro = 'ResizeObserver' in window
        ? new ResizeObserver(ents => ents.forEach(e => e.target.querySelectorAll('.pd-txt').forEach(crecer))) : null;

    window.Pendientes = { conectar, cargar, lista, guardarTodo, crear, proximaClase, hoyISO, COLS, CAT };
})();
