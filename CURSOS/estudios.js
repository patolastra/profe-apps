// ═══════════════════════════════════════════════════════════════════════
// 📚 ESTUDIOS (deuda EB, 2026-10-27) — apartado propio del menú de Cursos.
// Ensayos del profe escritos con el editor por bloques (tabla `estudios`, supabase/estudios.sql), con
// ❝ Citar: trae COPIADO al texto, como bloques Cita ("> "), algo de Profe Apps con su origen:
//   · Bitácoras y notas de un curso (la clase o nota entera o algunos de sus bloques);
//   · Libro: una evaluación (nombre y OA, rúbrica, resumen de resultados y comentarios), SIN nombres de estudiantes.
// Usa lo de CURSOS/index.html (sb, $, esc, contextos, nombreCtx, guardarTodo, cadenaGuardado, modoEstudios…).
// ═══════════════════════════════════════════════════════════════════════
const Estudios = (() => {
    let lista = [];          // [{ id, titulo, updated_at }]
    let actual = null;       // { id, titulo, contenido, updated_at }
    let ed = null, timer = null, sucio = false;

    const fechaLarga = iso => { const d = fechaD(iso); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
    const fmtNota = x => x == null ? '—' : Number(x).toFixed(1).replace('.', ',');
    const escMd = t => String(t).replace(/[\\*_{}]/g, '\\$&');   // el origen va tal cual (sin formato)

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
        else if (e.target.closest('#est-citar')) Citar.abrir();
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

    // ═══════════════════════════════════════════════════════════════════
    // ❝ CITAR — ventana: curso → Bitácoras y notas | Libro → elegir qué → se copia al estudio como Cita
    // ═══════════════════════════════════════════════════════════════════
    const Citar = (() => {
        let cid = null, pest = 'bit', items = [], det = null;   // det: lo abierto (entrada o evaluación)
        const caja = document.createElement('div');
        caja.id = 'est-modal'; caja.hidden = true;
        caja.innerHTML = `<div class="est-m-fondo"></div><div class="est-m-card">
            <div class="est-m-cab"><b>❝ Citar</b>
                <select id="est-m-curso" title="Curso"></select>
                <span class="est-m-tabs"><button data-p="bit">📓 Bitácoras y notas</button><button data-p="libro">📒 Libro</button></span>
                <button class="est-m-x" title="Cerrar (Esc)">✕</button></div>
            <div class="est-m-cuerpo" id="est-m-cuerpo"></div>
            <div class="est-m-pie" id="est-m-pie"></div></div>`;
        document.body.appendChild(caja);
        const cuerpo = caja.querySelector('#est-m-cuerpo'), pie = caja.querySelector('#est-m-pie');
        caja.querySelector('.est-m-fondo').onclick = cerrar;
        caja.querySelector('.est-m-x').onclick = cerrar;
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !caja.hidden) cerrar(); });
        caja.querySelector('#est-m-curso').onchange = e => { cid = e.target.value; try { localStorage.setItem('profe_estudio_cita_ctx', cid); } catch (_) {} cargar(); };
        caja.querySelector('.est-m-tabs').onclick = e => { const b = e.target.closest('[data-p]'); if (b) { pest = b.dataset.p; cargar(); } };

        function abrir() {
            const sel = caja.querySelector('#est-m-curso');
            sel.innerHTML = contextos.map(c => { const i = contextoInfo(c.nombre); return `<option value="${c.id}">${i.icono || ''} ${esc(i.label)}</option>`; }).join('');
            let ult = null; try { ult = localStorage.getItem('profe_estudio_cita_ctx'); } catch (_) {}
            cid = contextos.some(c => c.id === ult) ? ult : (contextos.find(c => c.nombre !== 'GENERAL') || contextos[0])?.id;
            sel.value = cid;
            caja.hidden = false;
            cargar();
        }
        function cerrar() { caja.hidden = true; det = null; }
        const curso = () => nombreCtx(cid).label;

        async function cargar() {
            det = null;
            caja.querySelectorAll('.est-m-tabs button').forEach(b => b.classList.toggle('on', b.dataset.p === pest));
            cuerpo.innerHTML = '<div class="lat-vacio">Cargando…</div>'; pie.innerHTML = '';
            const yo = cid + pest;
            if (pest === 'bit') {
                const [ses, pags] = await Promise.all([
                    sb.from('sesiones').select('id, fecha, memorias(contenido)').eq('contexto_id', cid).lte('fecha', hoyISO()).order('fecha', { ascending: false }),
                    sb.from('bitacora_paginas').select('*').eq('contexto_id', cid),
                ]);
                if (yo !== cid + pest) return;
                if (ses.error || pags.error) { cuerpo.innerHTML = '<div class="lat-vacio">No se pudo cargar — revisa conexión.</div>'; return; }
                items = [];
                (ses.data || []).forEach(s => {
                    const m = Array.isArray(s.memorias) ? s.memorias[0] : s.memorias;
                    if ((m?.contenido || '').trim()) items.push({ tipo: 'clase', fecha: s.fecha, titulo: 'Bitácora · ' + tituloFecha(s.fecha), contenido: m.contenido });
                });
                (pags.data || []).forEach(p => { if ((p.contenido || '').trim() || p.titulo)
                    items.push({ tipo: 'nota', fecha: p.fecha || isoLocal(p.created_at), titulo: 'Nota · ' + (p.titulo || 'Sin título'), nombre: p.titulo || 'Sin título', contenido: p.contenido || '' }); });
                items.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
                cuerpo.innerHTML = items.length ? items.map((it, i) => `<button class="est-m-it" data-i="${i}">
                    <span class="est-m-t">${it.tipo === 'clase' ? '📓' : '📝'} ${esc(it.titulo)}</span>
                    <span class="est-m-s">${esc(previa(it.contenido))}</span>
                    <span class="est-m-f">${esc(cortoFecha(it.fecha))}</span></button>`).join('')
                    : `<div class="lat-vacio">${esc(curso())} no tiene bitácoras ni notas escritas.</div>`;
            } else {
                const { data, error } = await sb.from('libro_evaluaciones').select('id, nombre, fecha, oa_original, instrumento_id, nota_min, estado')
                    .eq('contexto_id', cid).order('fecha', { ascending: false });
                if (yo !== cid + pest) return;
                if (error) { cuerpo.innerHTML = '<div class="lat-vacio">No se pudo cargar — revisa conexión.</div>'; return; }
                items = data || [];
                cuerpo.innerHTML = items.length ? items.map((ev, i) => `<button class="est-m-it" data-i="${i}">
                    <span class="est-m-t">📒 ${esc(ev.nombre)}</span>
                    <span class="est-m-s">${esc(ev.oa_original || '')}</span>
                    <span class="est-m-f">${esc(cortoFecha(ev.fecha))}</span></button>`).join('')
                    : `<div class="lat-vacio">${esc(curso())} no tiene evaluaciones en el Libro.</div>`;
            }
        }
        const previa = t => EditorBloques.mdAPlano(String(t).replace(/\n+/g, ' · ')).slice(0, 140);
        cuerpo.addEventListener('click', e => {
            const b = e.target.closest('.est-m-it'); if (!b) return;
            const it = items[+b.dataset.i];
            if (pest === 'bit') verEntrada(it); else verEvaluacion(it);
        });

        // ── Bitácora o nota: cada bloque con su casilla ─────────────────
        function verEntrada(it) {
            const bs = EditorBloques.aBloques(it.contenido).filter(b => b.t !== 'hr' && b.x.trim());
            let n = 0;
            const lineas = bs.map(b => { n = b.t === 'ol' ? n + 1 : 0; return lineaCita(b, n); });
            det = {
                origen: it.tipo === 'clase' ? `${curso()} · Bitácora del ${tituloFecha(it.fecha).toLowerCase()} de ${fechaD(it.fecha).getFullYear()}`
                                            : `${curso()} · Nota «${it.nombre}» del ${fechaLarga(it.fecha)}`,
                partes: lineas.map(l => ({ lineas: [l], on: true })),
            };
            cuerpo.innerHTML = `<div class="est-m-det"><div class="est-m-dt">${esc(it.titulo)}</div>` + (det.partes.length
                ? det.partes.map((p, i) => `<label class="est-m-op"><input type="checkbox" data-i="${i}" checked>
                    <span>${EditorBloques.html(p.lineas[0])}</span></label>`).join('')
                : '<div class="lat-vacio">Está vacía.</div>') + '</div>';
            pintarPie();
        }
        // Un bloque como línea de la cita (las listas conservan su marca; los títulos, en negrita)
        function lineaCita(b, n) {
            switch (b.t) {
                case 'ul': return '• ' + b.x;
                case 'ol': return n + '. ' + b.x;
                case 'todo': return (b.c ? '☑ ' : '☐ ') + b.x;
                case 'h1': case 'h2': case 'h3': return '**' + b.x.replace(/\*\*/g, '') + '**';
                default: return b.x;
            }
        }

        // ── Evaluación del Libro: qué partes citar (sin nombres de estudiantes) ──
        const NIVELES = ['Por lograr', 'Medianamente logrado', 'Logrado', 'Logrado con distinción'];
        async function verEvaluacion(ev) {
            cuerpo.innerHTML = '<div class="lat-vacio">Cargando…</div>'; pie.innerHTML = '';
            const [nt, ins] = await Promise.all([
                sb.from('libro_evaluacion_notas').select('id, nota, comentario, estado_eval').eq('evaluacion_id', ev.id),
                sb.from('libro_eval_instrumentos').select('id, tipo, nombre').eq('evaluacion_id', ev.id).order('created_at'),
            ]);
            if (nt.error || ins.error) { cuerpo.innerHTML = '<div class="lat-vacio">No se pudo cargar — revisa conexión.</div>'; return; }
            const notas = nt.data || [];
            const instr = (ins.data || []).find(i => i.id === ev.instrumento_id) || (ins.data || [])[0] || null;
            let itemsI = [], res = [];
            if (instr) {
                const it = await sb.from('libro_eval_instrumento_items').select('*').eq('instrumento_id', instr.id).order('orden');
                itemsI = it.data || [];
                if (itemsI.length && notas.length) {
                    const r = await sb.from('libro_eval_resultados').select('instrumento_item_id, valor').in('instrumento_item_id', itemsI.map(x => x.id));
                    res = r.data || [];
                }
            }
            const partes = [];
            partes.push({ t: 'Evaluación y OA', on: true, lineas: [`**Evaluación:** ${ev.nombre} (${fechaLarga(ev.fecha)})`, ...(ev.oa_original ? [`**Objetivo:** ${ev.oa_original}`] : [])] });
            if (instr && itemsI.length) {
                const esRub = instr.tipo !== 'cotejo';
                partes.push({ t: esRub ? 'Rúbrica' : 'Lista de cotejo', on: true, lineas: [`**${esRub ? 'Rúbrica' : 'Lista de cotejo'} «${instr.nombre}»:**`,
                    ...itemsI.map(x => {
                        const d = esRub ? [1, 2, 3, 4].map(k => x['desc_n' + k] ? `${NIVELES[k - 1]}: ${x['desc_n' + k]}` : '').filter(Boolean) : [];
                        return '• ' + x.texto + (d.length ? ' — ' + d.join(' · ') : '');
                    })] });
            }
            const aplican = notas.filter(n => n.estado_eval !== 'no_aplica');
            const con = aplican.filter(n => n.nota != null).map(n => Number(n.nota));
            if (aplican.length) {
                const prom = con.length ? con.reduce((a, b) => a + b, 0) / con.length : null;
                const tramo = (a, b) => con.filter(x => x >= a && x < b).length;
                const lineas = [`**Resultados:** ${con.length} de ${aplican.length} evaluados${prom != null ? ` · promedio ${fmtNota(Math.round(prom * 10) / 10)}` : ''}`];
                if (con.length) lineas.push(`• 6,0 a 7,0: ${tramo(6, 7.01)} · 5,0 a 5,9: ${tramo(5, 6)} · 4,0 a 4,9: ${tramo(4, 5)} · bajo 4,0: ${tramo(0, 4)}`);
                if (instr && res.length) {
                    const esRub = instr.tipo !== 'cotejo';
                    itemsI.forEach(x => {
                        const v = res.filter(r => r.instrumento_item_id === x.id);
                        if (!v.length) return;
                        const cuenta = esRub ? [1, 2, 3, 4].map(k => `${NIVELES[k - 1]} ${v.filter(r => r.valor === k).length}`)
                                             : [`Sí ${v.filter(r => r.valor === 2).length}`, `No ${v.filter(r => r.valor === 1).length}`];
                        lineas.push(`• ${x.texto}: ${cuenta.join(' · ')}`);
                    });
                }
                partes.push({ t: 'Resumen de resultados', on: true, lineas });
            }
            notas.filter(n => (n.comentario || '').trim() && !/^pdte\.?$/i.test(n.comentario.trim()))
                .forEach(n => partes.push({ t: 'Comentario', on: false, com: true, lineas: ['• «' + n.comentario.trim() + '»'] }));
            det = { origen: `${curso()} · Libro: «${ev.nombre}» (${fechaLarga(ev.fecha)})`, partes };
            const html = (p, i) => `<label class="est-m-op${p.com ? ' com' : ''}"><input type="checkbox" data-i="${i}"${p.on ? ' checked' : ''}>
                <span>${p.com ? '' : `<b class="est-m-pt">${esc(p.t)}</b>`}${EditorBloques.html(p.lineas.join('\n'))}</span></label>`;
            const ncom = partes.filter(p => p.com).length;
            cuerpo.innerHTML = `<div class="est-m-det"><div class="est-m-dt">📒 ${esc(ev.nombre)}</div>
                ${partes.map((p, i) => p.com ? '' : html(p, i)).join('')}
                ${ncom ? `<div class="est-m-sub">Comentarios (${ncom}) · sin nombres; marca los que quieras citar</div>` +
                    partes.map((p, i) => p.com ? html(p, i) : '').join('') : ''}
                <p class="est-m-nota">No se citan nombres de estudiantes.</p></div>`;
            pintarPie();
        }

        function pintarPie() {
            const n = det.partes.filter(p => p.on).length;
            pie.innerHTML = `<button class="est-btn sec" id="est-m-volver">‹ Volver</button>
                <span class="est-m-org">— ${esc(det.origen)}</span>
                <button class="est-btn" id="est-m-ok"${n ? '' : ' disabled'}>❝ Citar${det.partes.length > 1 ? ` (${n})` : ''}</button>`;
        }
        cuerpo.addEventListener('change', e => {
            const c = e.target.closest('input[type=checkbox][data-i]'); if (!c || !det) return;
            det.partes[+c.dataset.i].on = c.checked;
            pintarPie();
        });
        pie.addEventListener('click', e => {
            if (e.target.closest('#est-m-volver')) { cargar(); return; }
            if (!e.target.closest('#est-m-ok') || !det) return;
            const lineas = det.partes.filter(p => p.on).flatMap(p => p.lineas);
            if (!lineas.length) return;
            insertar(lineas.map(l => '> ' + l).join('\n') + '\n> *— ' + escMd(det.origen) + '*\n');
            cerrar();
            estado('Cita agregada.');
        });
        return { abrir };
    })();

    return { abrir, guardar };
})();
