// ═══════════════════════════════════════════════════════════════════════
// Pendientes — una sola lista de pendientes en todo el sistema (deuda BB, 2026-10-12)
// La usan el Dashboard, "Pendientes de esta clase" (Plan) y "Pendientes para la
// próxima clase" (Bitácora). Se ve y funciona igual en todos lados: activos arriba,
// "Completados" abajo en gris y cursiva; agregar, editar, marcar y borrar.
// Al instante: entre pestañas del mismo computador (BroadcastChannel) y entre
// equipos (Supabase Realtime, supabase/pendientes_realtime.sql).
// Estilos en comun/pendientes.css. Tabla `pendientes`, categoria 'tarea_proxima'.
//
// Uso:
//   Pendientes.conectar(sb)
//   await Pendientes.cargar(sb => sb.from('pendientes').select(Pendientes.COLS).eq(...))
//   const l = Pendientes.lista(caja, { filtro, alta, mostrarClase, botonAgregar, vacio, alCambiar })
//   l.agregar() · l.repintar()
//   Pendientes.guardarTodo()   (antes de cerrar una ventana)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'tarea_proxima';
    const COLS = 'id, contexto_id, sesion_id, categoria, texto, estado, semanas_pendiente, created_at, sesiones(fecha)';

    let sb = null;
    const filas  = new Map();     // id → pendiente { …, fecha (de su clase) }
    const fechas = new Map();     // sesion_id → fecha
    const listas = new Set();
    const timers = {};            // guardado del texto, por id
    const canal  = 'BroadcastChannel' in window ? new BroadcastChannel('profe-pendientes') : null;

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
        if (!n.fecha && n.sesion_id && fechas.has(n.sesion_id)) n.fecha = fechas.get(n.sesion_id);
        if (n.fecha && n.sesion_id) fechas.set(n.sesion_id, n.fecha);
        if (n.sesion_id && !n.fecha) pedirFecha(n.sesion_id);
        filas.set(p.id, n);
        if (!silencioso) repintarTodo();
        return n;
    }
    function quitarLocal(id) { if (filas.delete(id)) repintarTodo(); }
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

    async function crear({ contexto_id, sesion_id, fecha }) {
        const { data, error } = await sb.from('pendientes').insert({
            contexto_id, sesion_id: sesion_id || null, categoria: CAT, texto: '', estado: 'activo',
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
        filas.delete(id);
        avisar({ tipo: 'quitar', id });
        repintarTodo();
        const { error } = await sb.from('pendientes').delete().eq('id', id);
        if (error && antes) { ponerLocal(antes); aviso('No se pudo borrar el pendiente — revisa la conexión.'); }
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

    // ── Listas en pantalla ──────────────────────────────────────────────
    const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const fechaCorta = iso => { const d = new Date(iso + 'T12:00:00'); return `${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; };

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
    function items(L) { return [...filas.values()].filter(p => (!p.categoria || p.categoria === CAT) && (!L.op.filtro || L.op.filtro(p))); }
    function contar(L) { const it = items(L); return { activos: it.filter(p => p.estado === 'activo').length, completados: it.filter(p => p.estado === 'completado').length }; }

    async function agregar(L) {
        if (!L.op.alta) return;
        const destino = await L.op.alta();
        if (!destino) { aviso(L.op.sinDestino || 'Este curso no tiene una próxima clase en el horario.'); return; }
        const p = await crear(destino);
        if (!p) { aviso('No se pudo crear el pendiente — revisa la conexión.'); return; }
        const t = L.caja.querySelector(`.pd-fila[data-id="${p.id}"] .pd-txt`);
        if (t) t.focus();
    }

    function repintarTodo() { listas.forEach(L => { if (L.caja.isConnected) pintar(L); else listas.delete(L); }); }

    function pintar(L) {
        const it = items(L).sort((a, b) => String(a.created_at).localeCompare(String(b.created_at)));
        const act = it.filter(p => p.estado === 'activo'), comp = it.filter(p => p.estado === 'completado');
        const cAct = L.caja.querySelector('.pd-activos'), cComp = L.caja.querySelector('.pd-comp-body');
        const vivos = new Set(it.map(p => p.id));
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
    function colocar(L, cont, lista) {
        let ref = cont.firstElementChild;
        lista.forEach(p => {
            let el = L.filasEl.get(p.id);
            if (!el) { el = filaEl(L, p); L.filasEl.set(p.id, el); }
            actualizarFila(L, el, p);
            if (el === ref) { ref = ref.nextElementSibling; return; }
            cont.insertBefore(el, ref);
        });
    }
    function filaEl(L, p) {
        const f = document.createElement('div');
        f.className = 'pd-fila';
        f.dataset.id = p.id;
        f.innerHTML = `<input type="checkbox" class="pd-chk" title="Marcar como hecho">
            <textarea class="pd-txt" rows="1" placeholder="Escribe el pendiente…"></textarea>
            <span class="pd-meta"></span>
            <button class="pd-del" type="button" title="Borrar">✕</button>`;
        const chk = f.querySelector('.pd-chk'), txt = f.querySelector('.pd-txt');
        chk.addEventListener('change', () => { guardarTexto(p.id, txt, true); cambiar(p.id, { estado: chk.checked ? 'completado' : 'activo' }); });
        txt.addEventListener('input', () => { crecer(txt); guardarTexto(p.id, txt, false); });
        txt.addEventListener('blur', () => {
            if (!txt.value.trim()) { borrar(p.id); return; }
            guardarTexto(p.id, txt, true);
        });
        txt.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); txt.blur(); } });
        f.querySelector('.pd-del').addEventListener('click', () => borrar(p.id));
        return f;
    }
    function actualizarFila(L, f, p) {
        const hecho = p.estado === 'completado';
        f.classList.toggle('pd-hecho', hecho);
        f.querySelector('.pd-chk').checked = hecho;
        const txt = f.querySelector('.pd-txt');
        if (document.activeElement !== txt && txt.value !== (p.texto || '')) txt.value = p.texto || '';
        requestAnimationFrame(() => crecer(txt));
        const sem = Number(p.semanas_pendiente) || 0;
        const partes = [];
        if (!hecho && sem > 0) partes.push(`<span class="pd-sem" title="${sem === 1 ? 'Trasladado 1 semana' : `Trasladado ${sem} semanas`}">(${sem} sem)</span>`);
        if (L.op.mostrarClase && p.fecha) partes.push(`<span class="pd-clase" title="Clase a la que pertenece">${fechaCorta(p.fecha)}</span>`);
        f.querySelector('.pd-meta').innerHTML = partes.join(' ');
    }
    function crecer(t) {
        if (!t.isConnected || !t.offsetParent) return;
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + (t.offsetHeight - t.clientHeight)) + 'px';
    }
    // Al cambiar el ancho de una lista, reajustar las alturas.
    const ro = 'ResizeObserver' in window
        ? new ResizeObserver(ents => ents.forEach(e => e.target.querySelectorAll('.pd-txt').forEach(crecer))) : null;

    window.Pendientes = { conectar, cargar, lista, guardarTodo, crear, COLS, CAT };
})();
