// ═══════════════════════════════════════════════════════════════════════
// 📚 ESTUDIOS (deuda EB, 2026-10-27) — apartado propio del menú de Cursos.
// Ensayos del profe escritos con el editor por bloques (tabla `estudios`, supabase/estudios.sql), con
// ❝ Citar (comun/citar.js, pieza común con el celular): trae COPIADO al texto, como bloques Cita ("> "), algo de Profe Apps con su origen:
//   · Bitácoras y notas de un curso (la clase o nota entera o algunos de sus bloques);
//   · Libro: una evaluación (nombre y OA, rúbrica, resumen de resultados y comentarios), SIN nombres de estudiantes.
// Usa lo de CURSOS/index.html (sb, $, esc, contextos, nombreCtx, guardarTodo, cadenaGuardado, modoEstudios…).
// ═══════════════════════════════════════════════════════════════════════
const Estudios = (() => {
    let lista = [];          // [{ id, titulo, updated_at }]
    let actual = null;       // { id, titulo, contenido, updated_at }
    let ed = null, timer = null, sucio = false;


    // ── Abrir el apartado ───────────────────────────────────────────────
    async function abrir(id) {
        await guardarTodo();
        modoEstudios = true; modoHoy = null; modoMejoras = false; ctxActual = null;
        entradas.forEach(E => E.ed?.destruir()); entradas = [];
        Object.keys(porK).forEach(k => delete porK[k]);
        soltarPendientes();
        document.body.classList.remove('con-pend');
        try { localStorage.setItem('profe_cursos_ultimo', '__estudios'); } catch (e) {}
        pintarCursos();
        $('col-entradas').hidden = false;
        $('ent-curso').textContent = '📚 Estudios';
        $('btn-nota').style.visibility = 'hidden';
        ['btn-pend', 'btn-plani', 'btn-cuaderno', 'btn-archivos'].forEach(b => { $(b).style.visibility = 'hidden'; });
        $('hoy-nav').style.display = 'none';
        $('ruta').textContent = '📚 Estudios';
        $('lista-ent').innerHTML = '<div class="lat-vacio">Cargando…</div>';
        $('pagina').innerHTML = '';
        const { data, error } = await sb.from('estudios').select('id, titulo, updated_at').order('updated_at', { ascending: false });
        if (!modoEstudios) return;
        if (error) {
            $('lista-ent').innerHTML = '';
            $('pagina').innerHTML = `<div class="lat-vacio" style="padding:0">${/estudios/.test(error.message || '')
                ? 'Falta crear la tabla de Estudios en Supabase (supabase/estudios.sql).' : 'No se pudo cargar — revisa conexión.'}</div>`;
            return;
        }
        lista = data || [];
        let elegido = id;
        if (!elegido) { try { elegido = localStorage.getItem('profe_estudio_ultimo'); } catch (e) {} }
        if (elegido && lista.some(x => x.id === elegido)) await abrirEstudio(elegido);
        else { actual = null; pintarLista(); pintarVacio(); }
    }
    function pintarLista() {
        $('lista-ent').innerHTML = `<div class="fila est-nuevo" data-est="__nuevo" title="Empezar un estudio nuevo"><span class="nom">＋ Nuevo estudio</span></div>` +
            (lista.length ? lista.map(x => `<div class="fila${actual?.id === x.id ? ' activa' : ''}" data-est="${x.id}" title="${esc(x.titulo || 'Sin título')}">
                <span class="nom">${esc(x.titulo || 'Sin título')}</span><span class="est-lf">${esc(cortoFecha(isoLocal(x.updated_at)))}</span></div>`).join('')
            : '<div class="lat-vacio">Todavía no hay estudios.</div>');
    }
    function pintarVacio() {
        $('pagina').innerHTML = `<div id="pag-titulo">📚 Estudios</div>
            <p class="mj-ayuda">Ensayos escritos por ti. Con <b>❝ Citar</b> traes al texto, copiado y con su origen, lo que está en Profe Apps:
            la bitácora de una clase, una nota de Cursos o una evaluación del Libro (sin nombres de estudiantes).</p>
            <button class="est-btn" id="est-crear">＋ Nuevo estudio</button>`;
    }
    $('lista-ent').addEventListener('click', e => {
        if (!modoEstudios) return;
        const f = e.target.closest('.fila[data-est]'); if (!f) return;
        if (f.dataset.est === '__nuevo') nuevo(); else abrirEstudio(f.dataset.est);
    });
    $('pagina').addEventListener('click', e => {
        if (!modoEstudios) return;
        if (e.target.closest('#est-crear')) nuevo();
        else if (e.target.closest('#est-citar')) Citar.abrir({ sb, contextos, alCitar: t => { insertar(t); estado('Cita agregada.'); } });
        else if (e.target.closest('#est-borrar')) borrar();
    });

    async function nuevo() {
        await guardar();
        const { data, error } = await sb.from('estudios').insert({ titulo: '', contenido: '' }).select('id, titulo, updated_at').single();
        if (error) { estado('No se pudo crear — revisa conexión.', true); return; }
        lista.unshift(data);
        await abrirEstudio(data.id);
        $('est-titulo')?.focus();
    }
    async function abrirEstudio(id) {
        await guardar();
        const { data, error } = await sb.from('estudios').select('*').eq('id', id).maybeSingle();
        if (!modoEstudios) return;
        if (error || !data) { estado('No se pudo abrir el estudio — revisa conexión.', true); return; }
        actual = data;
        try { localStorage.setItem('profe_estudio_ultimo', id); } catch (e) {}
        pintarLista();
        ed?.destruir();
        $('pagina').innerHTML = `<div class="est-barra">
                <button class="est-btn" id="est-citar" title="Traer al texto, copiado y con su origen, algo de Profe Apps">❝ Citar</button>
                <span class="est-ed" id="est-ed"></span>
                <button class="est-borrar" id="est-borrar" title="Borrar este estudio">🗑</button>
            </div>
            <div id="est-titulo" contenteditable="true" spellcheck="true"></div>
            <div class="est-editor"></div>`;
        const t = $('est-titulo');
        t.textContent = actual.titulo || '';
        t.addEventListener('input', () => { actual.titulo = t.textContent.trim(); marcar(); });
        t.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); ed.enfocar('inicio'); } });
        ed = EditorBloques.crear($('pagina').querySelector('.est-editor'), {
            texto: actual.contenido || '',
            vacio: 'Escribe, o usa ❝ Citar para traer algo de Profe Apps…',
            alCambiar: marcar,
        });
        pintarEditado();
    }
    function pintarEditado() {
        if ($('est-ed') && actual) $('est-ed').textContent = 'Editado ' + cortoFecha(isoLocal(actual.updated_at || actual.created_at));
    }
    function marcar() {
        sucio = true; estado('Sin guardar…');
        clearTimeout(timer); timer = setTimeout(guardar, 800);
    }
    function guardar() {
        clearTimeout(timer);
        if (!sucio || !actual || !ed) return cadenaGuardado;
        sucio = false;
        const id = actual.id, titulo = actual.titulo || '', contenido = ed.texto(), ahora = new Date().toISOString();
        cadenaGuardado = cadenaGuardado.then(async () => {
            estado('Guardando…');
            const { error } = await sb.from('estudios').update({ titulo, contenido, updated_at: ahora }).eq('id', id);
            if (error) { sucio = true; estado('No se pudo guardar — revisa conexión.', true); return; }
            estado('Guardado');
            const x = lista.find(y => y.id === id);
            if (x) { x.titulo = titulo; x.updated_at = ahora; }
            if (actual?.id === id) { actual.updated_at = ahora; pintarEditado(); }
            if (modoEstudios) { lista.sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))); pintarLista(); }
        }).catch(() => {});
        return cadenaGuardado;
    }
    async function borrar() {
        if (!actual || !confirm(`¿Borrar el estudio «${actual.titulo || 'Sin título'}»? No se puede deshacer.`)) return;
        clearTimeout(timer); sucio = false;
        const { error } = await sb.from('estudios').delete().eq('id', actual.id);
        if (error) { estado('No se pudo borrar — revisa conexión.', true); return; }
        lista = lista.filter(x => x.id !== actual.id);
        ed?.destruir(); ed = null; actual = null;
        try { localStorage.removeItem('profe_estudio_ultimo'); } catch (e) {}
        pintarLista(); pintarVacio(); estado('');
    }
    function insertar(texto) { if (ed) ed.insertar(texto); }

    return { abrir, guardar };
})();
