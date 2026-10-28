// ═══════════════════════════════════════════════════════════════════════
// ❝ CITAR (deuda EB → EC, 2026-10-28) — pieza común de 📚 Estudios (Cursos del PC y del celular).
// Ventana: curso → 📓 Bitácoras y notas | 📒 Libro → elegir qué → se entrega como texto del editor por
// bloques: líneas "> …" (bloque Cita) + "> *— origen*". Del Libro NUNCA van nombres de estudiantes.
// Necesita supabase/contextos.js (contextoInfo) y comun/editor-bloques.js (EditorBloques). Estilos: comun/citar.css.
// Uso: Citar.abrir({ sb, contextos: [{ id, nombre }], alCitar: texto => … })
// ═══════════════════════════════════════════════════════════════════════
const Citar = (() => {
    const DIAS  = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const fechaD = f => new Date(f + 'T12:00:00');
    const tituloFecha = f => { const d = fechaD(f); return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`; };
    const cortoFecha = f => { const d = fechaD(f); return `${DIAS[d.getDay()].slice(0, 3)} ${d.getDate()} ${MESES[d.getMonth()].slice(0, 3)}`; };
    const fechaLarga = f => { const d = fechaD(f); return `${d.getDate()} de ${MESES[d.getMonth()]} de ${d.getFullYear()}`; };
    const fmtNota = x => x == null ? '—' : Number(x).toFixed(1).replace('.', ',');
    const escMd = t => String(t).replace(/[\\*_{}]/g, '\\$&');   // el origen va tal cual (sin formato)
    const previa = t => EditorBloques.mdAPlano(String(t).replace(/\n+/g, ' · ')).slice(0, 140);
    const NIVELES = ['Por lograr', 'Medianamente logrado', 'Logrado', 'Logrado con distinción'];

    let op = null, cid = null, pest = 'bit', items = [], det = null, caja = null, cuerpo = null, pie = null;
    const info = id => { const c = op.contextos.find(x => x.id === id); return c ? contextoInfo(c.nombre) : { label: '', icono: '' }; };
    const curso = () => info(cid).label;

    function armarCaja() {
        caja = document.createElement('div');
        caja.id = 'cit-modal'; caja.hidden = true;
        caja.innerHTML = `<div class="cit-fondo"></div><div class="cit-card">
            <div class="cit-cab"><b>❝ Citar</b>
                <select id="cit-curso" title="Curso"></select>
                <span class="cit-tabs"><button data-p="bit">📓 Bitácoras y notas</button><button data-p="libro">📒 Libro</button></span>
                <button class="cit-x" title="Cerrar (Esc)">✕</button></div>
            <div class="cit-cuerpo"></div>
            <div class="cit-pie"></div></div>`;
        document.body.appendChild(caja);
        cuerpo = caja.querySelector('.cit-cuerpo'); pie = caja.querySelector('.cit-pie');
        caja.querySelector('.cit-fondo').onclick = cerrar;
        caja.querySelector('.cit-x').onclick = cerrar;
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && !caja.hidden) cerrar(); });
        caja.querySelector('#cit-curso').onchange = e => { cid = e.target.value; try { localStorage.setItem('profe_estudio_cita_ctx', cid); } catch (_) {} cargar(); };
        caja.querySelector('.cit-tabs').onclick = e => { const b = e.target.closest('[data-p]'); if (b) { pest = b.dataset.p; cargar(); } };
        cuerpo.addEventListener('click', e => {
            const b = e.target.closest('.cit-it'); if (!b) return;
            const it = items[+b.dataset.i];
            if (pest === 'bit') verEntrada(it); else verEvaluacion(it);
        });
        cuerpo.addEventListener('change', e => {
            const c = e.target.closest('input[type=checkbox][data-i]'); if (!c || !det) return;
            det.partes[+c.dataset.i].on = c.checked;
            pintarPie();
        });
        pie.addEventListener('click', e => {
            if (e.target.closest('.cit-volver')) { cargar(); return; }
            if (!e.target.closest('.cit-ok') || !det) return;
            const lineas = det.partes.filter(p => p.on).flatMap(p => p.lineas);
            if (!lineas.length) return;
            const texto = lineas.map(l => '> ' + l).join('\n') + '\n> *— ' + escMd(det.origen) + '*\n';
            cerrar();
            op.alCitar(texto);
        });
    }

    function abrir(opciones) {
        op = opciones;
        if (!caja) armarCaja();
        const sel = caja.querySelector('#cit-curso');
        sel.innerHTML = op.contextos.map(c => { const i = contextoInfo(c.nombre); return `<option value="${c.id}">${i.icono || ''} ${esc(i.label)}</option>`; }).join('');
        let ult = null; try { ult = localStorage.getItem('profe_estudio_cita_ctx'); } catch (_) {}
        cid = op.contextos.some(c => c.id === ult) ? ult : (op.contextos.find(c => c.nombre !== 'GENERAL') || op.contextos[0])?.id;
        sel.value = cid;
        caja.hidden = false;
        cargar();
    }
    function cerrar() { if (caja) caja.hidden = true; det = null; }

    async function cargar() {
        det = null;
        caja.querySelectorAll('.cit-tabs button').forEach(b => b.classList.toggle('on', b.dataset.p === pest));
        cuerpo.innerHTML = '<div class="cit-vacio">Cargando…</div>'; pie.innerHTML = '';
        const yo = cid + pest, sb = op.sb;
        if (pest === 'bit') {
            const [ses, pags] = await Promise.all([
                sb.from('sesiones').select('id, fecha, memorias(contenido)').eq('contexto_id', cid).lte('fecha', iso(new Date())).order('fecha', { ascending: false }),
                sb.from('bitacora_paginas').select('*').eq('contexto_id', cid),
            ]);
            if (yo !== cid + pest) return;
            if (ses.error || pags.error) { cuerpo.innerHTML = '<div class="cit-vacio">No se pudo cargar — revisa la conexión.</div>'; return; }
            items = [];
            (ses.data || []).forEach(s => {
                const m = Array.isArray(s.memorias) ? s.memorias[0] : s.memorias;
                if ((m?.contenido || '').trim()) items.push({ tipo: 'clase', fecha: s.fecha, titulo: 'Bitácora · ' + tituloFecha(s.fecha), contenido: m.contenido });
            });
            (pags.data || []).forEach(p => { if ((p.contenido || '').trim() || p.titulo)
                items.push({ tipo: 'nota', fecha: p.fecha || iso(new Date(p.created_at)), titulo: 'Nota · ' + (p.titulo || 'Sin título'), nombre: p.titulo || 'Sin título', contenido: p.contenido || '' }); });
            items.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)));
            cuerpo.innerHTML = items.length ? items.map((it, i) => `<button class="cit-it" data-i="${i}">
                <span class="cit-t">${it.tipo === 'clase' ? '📓' : '📝'} ${esc(it.titulo)}</span>
                <span class="cit-s">${esc(previa(it.contenido))}</span>
                <span class="cit-f">${esc(cortoFecha(it.fecha))}</span></button>`).join('')
                : `<div class="cit-vacio">${esc(curso())} no tiene bitácoras ni notas escritas.</div>`;
        } else {
            const { data, error } = await sb.from('libro_evaluaciones').select('id, nombre, fecha, oa_original, instrumento_id, nota_min, estado')
                .eq('contexto_id', cid).order('fecha', { ascending: false });
            if (yo !== cid + pest) return;
            if (error) { cuerpo.innerHTML = '<div class="cit-vacio">No se pudo cargar — revisa la conexión.</div>'; return; }
            items = data || [];
            cuerpo.innerHTML = items.length ? items.map((ev, i) => `<button class="cit-it" data-i="${i}">
                <span class="cit-t">📒 ${esc(ev.nombre)}</span>
                <span class="cit-s">${esc(ev.oa_original || '')}</span>
                <span class="cit-f">${esc(cortoFecha(ev.fecha))}</span></button>`).join('')
                : `<div class="cit-vacio">${esc(curso())} no tiene evaluaciones en el Libro.</div>`;
        }
    }

    // ── Bitácora o nota: cada bloque con su casilla ─────────────────────
    function verEntrada(it) {
        const bs = EditorBloques.aBloques(it.contenido).filter(b => b.t !== 'hr' && b.x.trim());
        let n = 0;
        const lineas = bs.map(b => { n = b.t === 'ol' ? n + 1 : 0; return lineaCita(b, n); });
        det = {
            origen: it.tipo === 'clase' ? `${curso()} · Bitácora del ${tituloFecha(it.fecha).toLowerCase()} de ${fechaD(it.fecha).getFullYear()}`
                                        : `${curso()} · Nota «${it.nombre}» del ${fechaLarga(it.fecha)}`,
            partes: lineas.map(l => ({ lineas: [l], on: true })),
        };
        cuerpo.innerHTML = `<div class="cit-det"><div class="cit-dt">${esc(it.titulo)}</div>` + (det.partes.length
            ? det.partes.map((p, i) => `<label class="cit-op"><input type="checkbox" data-i="${i}" checked>
                <span>${EditorBloques.html(p.lineas[0])}</span></label>`).join('')
            : '<div class="cit-vacio">Está vacía.</div>') + '</div>';
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
    async function verEvaluacion(ev) {
        const sb = op.sb;
        cuerpo.innerHTML = '<div class="cit-vacio">Cargando…</div>'; pie.innerHTML = '';
        const [nt, ins] = await Promise.all([
            sb.from('libro_evaluacion_notas').select('id, nota, comentario, estado_eval').eq('evaluacion_id', ev.id),
            sb.from('libro_eval_instrumentos').select('id, tipo, nombre').eq('evaluacion_id', ev.id).order('created_at'),
        ]);
        if (nt.error || ins.error) { cuerpo.innerHTML = '<div class="cit-vacio">No se pudo cargar — revisa la conexión.</div>'; return; }
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
        const html = (p, i) => `<label class="cit-op${p.com ? ' com' : ''}"><input type="checkbox" data-i="${i}"${p.on ? ' checked' : ''}>
            <span>${p.com ? '' : `<b class="cit-pt">${esc(p.t)}</b>`}${EditorBloques.html(p.lineas.join('\n'))}</span></label>`;
        const ncom = partes.filter(p => p.com).length;
        cuerpo.innerHTML = `<div class="cit-det"><div class="cit-dt">📒 ${esc(ev.nombre)}</div>
            ${partes.map((p, i) => p.com ? '' : html(p, i)).join('')}
            ${ncom ? `<div class="cit-sub">Comentarios (${ncom}) · sin nombres; marca los que quieras citar</div>` +
                partes.map((p, i) => p.com ? html(p, i) : '').join('') : ''}
            <p class="cit-nota">No se citan nombres de estudiantes.</p></div>`;
        pintarPie();
    }

    function pintarPie() {
        const n = det.partes.filter(p => p.on).length;
        pie.innerHTML = `<button class="cit-btn sec cit-volver">‹ Volver</button>
            <span class="cit-org">— ${esc(det.origen)}</span>
            <button class="cit-btn cit-ok"${n ? '' : ' disabled'}>❝ Citar${det.partes.length > 1 ? ` (${n})` : ''}</button>`;
    }
    return { abrir, cerrar };
})();
