// ═══════════════════════════════════════════════════════════════════════
// Mensajes — qué decirle a quién (deuda DD, 2026-10-24)
// Se anotan con "/msj destinatario: mensaje" (o /mensaje) en un pendiente o en el editor de bloques (deuda DE):
// quedan en la tabla `pendientes`, categoría 'mensaje', texto "destinatario\nmensaje" (con el curso y la
// clase donde se escribió). Aquí se ven agrupados por persona; ✓ los deja como Entregados (abajo, plegados) y se dejan de ver
// a las 2 semanas, como los pendientes. Al instante entre equipos (Realtime de `pendientes`).
//
// Uso:
//   Mensajes.conectar(sb)
//   Mensajes.lista(caja, { alCambiar: n => {…} })   → { destruir }   n = { activos, personas }
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'mensaje';
    const COPIA = 'profe_mensajes_copia';   // última lista vista (el celular la muestra sin señal)
    let sb = null, filas = [], cargando = null, canal = null;
    const listas = new Set();
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const partes = t => { const i = String(t || '').indexOf('\n'); return i < 0 ? { para: String(t || '').trim(), msg: '' } : { para: t.slice(0, i).trim(), msg: t.slice(i + 1).trim() }; };
    const clave = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

    function conectar(cliente) {
        if (sb || !cliente) return;
        sb = cliente;
        try {
            canal = sb.channel('profe-mensajes')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'pendientes' }, ({ new: n, old: o }) => {
                    if ((n && n.categoria === CAT) || (o && filas.some(f => f.id === o.id))) cargar();
                })
                .subscribe();
        } catch (_) {}
        document.addEventListener('visibilitychange', () => { if (!document.hidden && listas.size) cargar(); });
        window.addEventListener('online', () => { if (listas.size) cargar(); });
    }

    async function cargar() {
        if (!sb) return;
        if (cargando) return cargando;
        cargando = (async () => {
            try {
                const hace14 = new Date(Date.now() - 14 * 864e5).toISOString();
                const { data, error } = await sb.from('pendientes')
                    .select('id, contexto_id, sesion_id, texto, estado, completado_en, created_at')
                    .eq('categoria', CAT).or(`estado.eq.activo,completado_en.gte.${hace14}`)
                    .order('created_at', { ascending: true });
                if (error) throw error;
                filas = data || [];
                try { localStorage.setItem(COPIA, JSON.stringify(filas)); } catch (_) {}
            } catch (_) {
                if (!filas.length) { try { filas = JSON.parse(localStorage.getItem(COPIA) || '[]'); } catch (_) {} }
            }
            pintarTodas();
        })();
        try { await cargando; } finally { cargando = null; }
    }

    async function cambiar(id, cambios, avisoError) {
        const f = filas.find(x => x.id === id);
        const antes = f ? { ...f } : null;
        if (f) Object.assign(f, cambios);
        pintarTodas();
        const { error } = await sb.from('pendientes').update(cambios).eq('id', id);
        if (error && f) { Object.assign(f, antes); pintarTodas(); aviso(avisoError); }
    }
    async function borrar(id) {
        const i = filas.findIndex(x => x.id === id);
        const antes = i >= 0 ? filas[i] : null;
        if (i >= 0) filas.splice(i, 1);
        pintarTodas();
        const { error } = await sb.from('pendientes').delete().eq('id', id);
        if (error && antes) { filas.push(antes); pintarTodas(); aviso('No se pudo borrar el mensaje — revisa la conexión.'); }
    }
    function aviso(t) { listas.forEach(L => { const a = L.caja.querySelector('.msj-aviso'); if (a) { a.textContent = t; setTimeout(() => { a.textContent = ''; }, 5000); } }); }

    // Fecha en que se anotó (el curso lo da la página con op.curso), chico al margen.
    function origen(f) {
        const d = new Date(f.created_at);
        return isNaN(d) ? '' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function pintar(L) {
        const grupos = new Map();
        filas.forEach(f => {
            const { para, msg } = partes(f.texto);
            const k = clave(para) || '(sin destinatario)';
            if (!grupos.has(k)) grupos.set(k, { para: para || '(sin destinatario)', items: [] });
            grupos.get(k).items.push({ ...f, msg });
        });
        // Personas con mensajes por dar primero (en orden de llegada); las que solo tienen dados, al final.
        const lista = [...grupos.values()].sort((a, b) => {
            const pa = a.items.some(i => i.estado === 'activo'), pb = b.items.some(i => i.estado === 'activo');
            return pa === pb ? 0 : pa ? -1 : 1;
        });
        const activos = filas.filter(f => f.estado === 'activo').length;
        const personas = lista.filter(g => g.items.some(i => i.estado === 'activo')).length;
        // Lista compacta (PO 2026-10-28): sin tarjetas; por persona, sus mensajes por dar. Los entregados quedan
        // abajo, escondidos bajo "✓ Entregados (n)", que se abre al tocarlo.
        const fila = i => {
            const curso = L.op.curso ? L.op.curso(i.contexto_id) : null;
            return `<div class="msj-item${i.estado === 'activo' ? '' : ' dado'}" data-id="${esc(i.id)}">
                <button class="msj-chk" type="button" title="${i.estado === 'activo' ? 'Ya se lo dije' : 'Volver a por dar'}">${i.estado === 'activo' ? '' : '✓'}</button>
                <span class="msj-txt">${esc(i.msg || '—')}</span>
                <span class="msj-meta"${curso ? ` title="${esc(curso.titulo)}"` : ''}>${curso ? esc(curso.texto) + ' · ' : ''}${origen(i)}</span>
                <button class="msj-del" type="button" title="Borrar">✕</button>
            </div>`;
        };
        const bloque = (g, estado) => {
            const its = g.items.filter(i => estado === 'activo' ? i.estado === 'activo' : i.estado !== 'activo');
            return its.length ? `<div class="msj-grupo"><div class="msj-para">${esc(g.para)}${estado === 'activo' ? ` <span class="msj-n">${its.length}</span>` : ''}</div>${its.map(fila).join('')}</div>` : '';
        };
        const porDar = lista.map(g => bloque(g, 'activo')).join('');
        const nEnt = filas.length - activos;
        const ent = nEnt ? `<button class="msj-ent-tit" type="button" aria-expanded="${L.verEnt ? 'true' : 'false'}">${L.verEnt ? '▾' : '▸'} ✓ Entregados (${nEnt})</button>
            ${L.verEnt ? `<div class="msj-ent">${lista.map(g => bloque(g, 'dado')).join('')}</div>` : ''}` : '';
        L.caja.innerHTML = `<div class="msj">${porDar || '<div class="msj-vacio">No hay mensajes por dar.</div>'}${ent}
            <p class="msj-ayuda">Escribe <b>/msj a quién: mensaje</b> en cualquier pendiente o en la bitácora, y Enter.</p>
            <div class="msj-aviso"></div></div>`;
        if (L.op.alCambiar) { try { L.op.alCambiar({ activos, personas }); } catch (_) {} }
    }
    function pintarTodas() { listas.forEach(pintar); }

    function lista(caja, op = {}) {
        const L = { caja, op };
        listas.add(L);
        caja.addEventListener('click', e => {
            if (e.target.closest('.msj-ent-tit')) { L.verEnt = !L.verEnt; pintar(L); return; }
            const it = e.target.closest('.msj-item'); if (!it) return;
            const id = it.dataset.id, f = filas.find(x => x.id === id); if (!f) return;
            if (e.target.closest('.msj-chk')) {
                const dado = f.estado === 'activo';
                cambiar(id, dado ? { estado: 'completado', completado_en: new Date().toISOString() } : { estado: 'activo', completado_en: null },
                    'No se pudo guardar — revisa la conexión.');
            } else if (e.target.closest('.msj-del')) {
                if (confirm('¿Borrar este mensaje?')) borrar(id);
            }
        });
        pintar(L);
        cargar();
        return { destruir: () => { listas.delete(L); caja.innerHTML = ''; }, recargar: cargar };
    }

    window.Mensajes = { conectar, lista, cargar };
})();
