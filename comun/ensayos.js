// ═══════════════════════════════════════════════════════════════════════
// Ensayos — quién ensaya qué, y las pruebas pendientes (deuda FJ, 2026-11-02)
// Se anotan con "/ensayo quién: qué" o "/prueba quién: qué" en un pendiente o en el editor de bloques: quedan en la
// tabla `pendientes`, categoría 'ensayo', texto "quién\nqué" ("📝 quién\nqué" si es prueba), con el curso y la clase
// donde se escribieron. Aquí se ven agrupados por curso; ✓ los deja como Hechos (abajo, plegados) y se dejan de ver
// a las 2 semanas, como los pendientes. Al instante entre equipos (Realtime de `pendientes`).
//
// Uso:
//   Ensayos.conectar(sb)
//   Ensayos.lista(caja, { curso: cid => ({ texto, titulo }) | null, cursos: () => [{ id, texto }],
//                         alCambiar: n => {…} })   → { destruir }
//   cursos: los del selector del cuadro para anotar ahí mismo (el último elegido se recuerda en el equipo)
//   n = { activos }
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'ensayo';
    const PRUEBA = '📝 ';
    const COPIA = 'profe_ensayos_copia';
    const ULTIMO = 'profe_ensayos_curso';  // último curso elegido en el cuadro para anotar   // última lista vista (el celular la muestra sin señal)
    let sb = null, filas = [], cargando = null;
    const listas = new Set();
    const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    function partes(t) {
        let s = String(t || ''), prueba = false;
        if (s.startsWith(PRUEBA)) { prueba = true; s = s.slice(PRUEBA.length); }
        const i = s.indexOf('\n');
        return i < 0 ? { quien: s.trim(), que: '', prueba } : { quien: s.slice(0, i).trim(), que: s.slice(i + 1).trim(), prueba };
    }

    function conectar(cliente) {
        if (sb || !cliente) return;
        sb = cliente;
        try {
            sb.channel('profe-ensayos')
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

    async function cambiar(id, cambios) {
        const f = filas.find(x => x.id === id);
        const antes = f ? { ...f } : null;
        if (f) Object.assign(f, cambios);
        pintarTodas();
        const { error } = await sb.from('pendientes').update(cambios).eq('id', id);
        if (error && f) { Object.assign(f, antes); pintarTodas(); aviso('No se pudo guardar — revisa la conexión.'); }
    }
    async function borrar(id) {
        const i = filas.findIndex(x => x.id === id);
        const antes = i >= 0 ? filas[i] : null;
        if (i >= 0) filas.splice(i, 1);
        pintarTodas();
        const { error } = await sb.from('pendientes').delete().eq('id', id);
        if (error && antes) { filas.push(antes); pintarTodas(); aviso('No se pudo borrar — revisa la conexión.'); }
    }
    // Cuadro propio: "quién: qué" (con /prueba adelante, prueba pendiente) en el curso elegido.
    async function anotar(texto, contexto_id) {
        let t = String(texto || '').trim(), prueba = false;
        const m = t.match(/^\/(ensayo|prueba)(?![a-záéíóúñ])\s*/i);
        if (m) { prueba = m[1].toLowerCase() === 'prueba'; t = t.slice(m[0].length); }
        const i = t.indexOf(':');
        const quien = i > 0 ? t.slice(0, i).trim() : '', que = i > 0 ? t.slice(i + 1).trim() : '';
        if (!quien || !que) { aviso('Escribe quién, dos puntos y qué (ej.: Josefa: estrofa 2). Con /prueba adelante es prueba.'); return false; }
        const { data, error } = await sb.from('pendientes')
            .insert({ contexto_id: contexto_id || null, sesion_id: null, categoria: CAT, texto: (prueba ? PRUEBA : '') + quien + '\n' + que, estado: 'activo' })
            .select('id, contexto_id, sesion_id, texto, estado, completado_en, created_at').single();
        if (error) { aviso('No se pudo anotar — revisa la conexión.'); return false; }
        if (!filas.some(f => f.id === data.id)) filas.push(data);
        pintarTodas();
        return true;
    }
    function aviso(t) { listas.forEach(L => { const a = L.caja.querySelector('.ens-aviso'); if (a) { a.textContent = t; setTimeout(() => { a.textContent = ''; }, 5000); } }); }

    // Fecha en que se anotó, chico al margen.
    function origen(f) {
        const d = new Date(f.created_at);
        return isNaN(d) ? '' : `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
    }

    function pintar(L) {
        const grupos = new Map();
        filas.forEach(f => {
            const k = f.contexto_id || '';
            if (!grupos.has(k)) {
                const c = k && L.op.curso ? L.op.curso(k) : null;
                grupos.set(k, { nombre: c ? c.titulo || c.texto : 'Sin curso', items: [] });   // titulo = nombre visible (con su ícono)
            }
            grupos.get(k).items.push({ ...f, ...partes(f.texto) });
        });
        // Cursos con ensayos por hacer primero (en orden de llegada); los que solo tienen hechos, al final.
        const lista = [...grupos.values()].sort((a, b) => {
            const pa = a.items.some(i => i.estado === 'activo'), pb = b.items.some(i => i.estado === 'activo');
            return pa === pb ? 0 : pa ? -1 : 1;
        });
        const activos = filas.filter(f => f.estado === 'activo').length;
        const fila = i => `<div class="ens-item${i.estado === 'activo' ? '' : ' hecho'}" data-id="${esc(i.id)}">
                <button class="ens-chk" type="button" title="${i.estado === 'activo' ? 'Hecho' : 'Volver a por hacer'}">${i.estado === 'activo' ? '' : '✓'}</button>
                <span class="ens-txt">${i.prueba ? '<span class="ens-prueba" title="Prueba pendiente">📝</span> ' : ''}<b>${esc(i.quien || '—')}</b>${i.que ? ' · ' + esc(i.que) : ''}</span>
                <span class="ens-meta">${origen(i)}</span>
                <button class="ens-del" type="button" title="Borrar">✕</button>
            </div>`;
        const bloque = (g, estado) => {
            const its = g.items.filter(i => estado === 'activo' ? i.estado === 'activo' : i.estado !== 'activo');
            return its.length ? `<div class="ens-grupo"><div class="ens-curso">${esc(g.nombre)}${estado === 'activo' ? ` <span class="ens-n">${its.length}</span>` : ''}</div>${its.map(fila).join('')}</div>` : '';
        };
        const porHacer = lista.map(g => bloque(g, 'activo')).join('');
        const nHechos = filas.length - activos;
        const hechos = nHechos ? `<button class="ens-hechos-tit" type="button" aria-expanded="${L.verHechos ? 'true' : 'false'}">${L.verHechos ? '▾' : '▸'} ✓ Hechos (${nHechos})</button>
            ${L.verHechos ? `<div class="ens-hechos">${lista.map(g => bloque(g, 'hecho')).join('')}</div>` : ''}` : '';
        L.cuerpo.innerHTML = `${porHacer || '<div class="ens-vacio">No hay ensayos ni pruebas pendientes.</div>'}${hechos}
            <p class="ens-ayuda">Arriba: curso, <b>quién: qué</b> y Enter (con <b>/prueba</b> adelante, prueba pendiente). También con <b>/ensayo quién: qué</b> o <b>/prueba quién: qué</b> en cualquier pendiente, la bitácora o una actividad (el curso es el de donde lo escribes).</p>`;
        if (L.op.alCambiar) { try { L.op.alCambiar({ activos }); } catch (_) {} }
    }
    function pintarTodas() { listas.forEach(pintar); }

    function lista(caja, op = {}) {
        const L = { caja, op };
        listas.add(L);
        // El cuadro queda fuera de lo que se repinta: lo que se está escribiendo nunca se pierde.
        const cursos = (op.cursos ? op.cursos() : []) || [];
        let ultimo = ''; try { ultimo = localStorage.getItem(ULTIMO) || ''; } catch (_) {}
        caja.innerHTML = `<div class="ens"><div class="ens-anotar">
                <select class="ens-sel" title="Curso">${cursos.map(c => `<option value="${esc(c.id)}"${c.id === ultimo ? ' selected' : ''}>${esc(c.texto)}</option>`).join('')}<option value=""${ultimo === '-' ? ' selected' : ''}>Sin curso</option></select>
                <input class="ens-nuevo" type="text" enterkeyhint="send" autocomplete="off" placeholder="Anotar: quién: qué, y Enter">
            </div><div class="ens-aviso"></div><div class="ens-cuerpo"></div></div>`;
        L.cuerpo = caja.querySelector('.ens-cuerpo');
        const sel = caja.querySelector('.ens-sel'), inp = caja.querySelector('.ens-nuevo');
        sel.addEventListener('change', () => { try { localStorage.setItem(ULTIMO, sel.value || '-'); } catch (_) {} });
        inp.addEventListener('keydown', async e => {
            if (e.key !== 'Enter' || !inp.value.trim() || inp.disabled) return;
            e.preventDefault();
            inp.disabled = true;
            const ok = await anotar(inp.value, sel.value);
            inp.disabled = false;
            if (ok) inp.value = '';
            inp.focus();
        });
        caja.addEventListener('click', e => {
            if (e.target.closest('.ens-hechos-tit')) { L.verHechos = !L.verHechos; pintar(L); return; }
            const it = e.target.closest('.ens-item'); if (!it) return;
            const id = it.dataset.id, f = filas.find(x => x.id === id); if (!f) return;
            if (e.target.closest('.ens-chk')) {
                cambiar(id, f.estado === 'activo' ? { estado: 'completado', completado_en: new Date().toISOString() } : { estado: 'activo', completado_en: null });
            } else if (e.target.closest('.ens-del')) {
                if (confirm('¿Borrar este ensayo?')) borrar(id);
            }
        });
        pintar(L);
        cargar();
        return { destruir: () => { listas.delete(L); caja.innerHTML = ''; }, recargar: cargar };
    }

    window.Ensayos = { conectar, lista, cargar };
})();
