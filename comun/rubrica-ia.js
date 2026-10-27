// ═══════════════════════════════════════════════════════════════════════
// ✨ PROPONER LA RÚBRICA O LISTA DE COTEJO CON IA (deuda DT, 2026-10-27)
// En el editor de un instrumento del Libro (y de una plantilla): el profe elige 3, 4 o 5 criterios, puede escribir
// una idea, y la IA (Gemini, la misma de ✨ Redactar OA: comun/redactar-oa.js) propone los criterios a partir del OA
// de la evaluación (o del nombre de la plantilla) y del currículo del nivel. Rúbrica: cada criterio con sus 4
// niveles (Por lograr · Medianamente logrado · Logrado · Logrado con distinción). Lista de cotejo: ítems Sí/No.
// Vista previa → "Agregar todos" (se suman a los que ya haya; luego se corrigen en el mismo editor).
// Iterar (PO 2026-10-27): se selecciona un fragmento de la propuesta → 💬 Comentar (o 💬 de la casilla entera, o un
// comentario general); los comentarios se juntan y "Enviar comentarios" pide a la IA cambiar SOLO eso; lo que cambió
// queda marcado y se puede volver a comentar. Solo cursos 1° a 8° (sin nivel no se muestra).
//
//   RubricaIA.html({ nivel, tipo, base, alAgregar })  → HTML del bloque (vacío si no hay nivel)
//     base()      → { oa, nombre }   (texto que la IA toma como punto de partida)
//     alAgregar(criterios) → Promise   criterios = [{ texto, desc_n1, desc_n2, desc_n3, desc_n4 }]
// ═══════════════════════════════════════════════════════════════════════
const RubricaIA = (() => {
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const NIVELES = ['Por lograr', 'Medianamente logrado', 'Logrado', 'Logrado con distinción'];
    const CAMPOS = ['texto', 'desc_n1', 'desc_n2', 'desc_n3', 'desc_n4'];
    let op = null, propuesta = null, comentarios = [], cambiados = new Set(), contexto = null;
    const $ = id => document.getElementById(id);
    const esRub = () => op.tipo === 'rubrica';

    function html(opciones) {
        if (!opciones?.nivel) return '';
        op = opciones; propuesta = null; comentarios = []; cambiados = new Set();
        estilos();
        const que = op.tipo === 'rubrica' ? 'criterios' : 'ítems';
        return `<div id="ria" style="margin-top:12px;border:1px dashed var(--line);border-radius:8px;padding:8px 10px">
            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
                <b style="font-size:13px">✨ Proponer con IA</b>
                <select id="ria-n" title="Cuántos ${que} propone" style="width:auto">
                    <option value="3">3 ${que}</option><option value="4" selected>4 ${que}</option><option value="5">5 ${que}</option></select>
                <input id="ria-idea" placeholder="Idea opcional (qué mirar, canción, instrumento…)" style="flex:1;min-width:180px" autocomplete="off">
                <button type="button" class="btn mini primary" id="ria-btn" onclick="RubricaIA.proponer()">Proponer</button>
            </div>
            <div class="hint" id="ria-estado" style="margin-top:4px"></div>
            <div id="ria-prev"></div>
        </div>`;
    }
    function estilos() {
        if ($('ria-estilos')) return;
        const st = document.createElement('style');
        st.id = 'ria-estilos';
        st.textContent = `
            .ria-celda { position: relative; border-radius: 6px; padding: 2px 22px 2px 4px; margin: -2px -4px; }
            .ria-celda:hover { background: rgba(255,255,255,.04); }
            .ria-celda.cambio { background: rgba(76,175,80,.14); box-shadow: inset 2px 0 0 #4CAF50; }
            .ria-celda .ria-c1 { position: absolute; top: 0; right: 0; visibility: hidden; border: 0; background: none; cursor: pointer; font-size: 13px; padding: 1px 3px; }
            .ria-celda:hover .ria-c1 { visibility: visible; }
            .ria-celda mark { background: rgba(224,161,6,.35); color: inherit; border-radius: 3px; padding: 0 1px; }
            #ria-flot { position: fixed; z-index: 9500; }
            #ria-caja { position: fixed; z-index: 9500; width: min(420px, 90vw); background: var(--panel); border: 1px solid var(--line);
                        border-radius: 10px; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,.5); }
            #ria-caja .q { font-size: 12px; color: var(--mut); border-left: 3px solid #e0a106; padding: 2px 8px; margin-bottom: 8px; max-height: 80px; overflow: auto; }
            #ria-caja textarea { width: 100%; min-height: 56px; }
            .ria-com { display: flex; gap: 8px; align-items: flex-start; font-size: 12.5px; padding: 4px 0; border-top: 1px solid var(--line); }
            .ria-com .q { color: var(--mut); }
        `;
        document.head.appendChild(st);
    }
    function estado(t) { const el = $('ria-estado'); if (el) el.textContent = t || ''; }

    // Normaliza la respuesta de la IA (o null si no trae lo pedido).
    function normalizar(o) {
        const lista = Array.isArray(o.criterios) ? o.criterios : null;
        if (!lista || !lista.length) return null;
        const out = lista.map(c => ({
            texto: String(c.texto || '').trim(),
            desc_n1: esRub() ? String(c.n1 || '').trim() || null : null,
            desc_n2: esRub() ? String(c.n2 || '').trim() || null : null,
            desc_n3: esRub() ? String(c.n3 || '').trim() || null : null,
            desc_n4: esRub() ? String(c.n4 || '').trim() || null : null,
        })).filter(c => c.texto);
        return out.length ? out : null;
    }
    const formato = () => esRub()
        ? `{"criterios": [{"texto": "...", "n1": "...", "n2": "...", "n3": "...", "n4": "..."}]}`
        : `{"criterios": [{"texto": "..."}]}`;
    const comoJSON = lista => JSON.stringify({ criterios: lista.map(c => esRub()
        ? { texto: c.texto, n1: c.desc_n1, n2: c.desc_n2, n3: c.desc_n3, n4: c.desc_n4 } : { texto: c.texto }) }, null, 1);

    function instruccion(n, cant, base, idea, cur) {
        return `Eres asesor de evaluación de Música para la educación básica en Chile. Propón exactamente ${cant} ` +
            (esRub() ? 'criterios para una RÚBRICA' : 'ítems para una LISTA DE COTEJO') +
            ` de ${n}° básico, en español de Chile, coherentes con el objetivo de abajo: observables durante la ` +
            `interpretación o el trabajo de los estudiantes, distintos entre sí y sin notas numéricas.\n` +
            (esRub()
                ? `Cada criterio: un nombre breve (2 a 6 palabras) y una descripción de cada uno de sus 4 niveles, graduales ` +
                  `y concretos, de una oración corta (máximo 25 palabras): n1 = Por lograr, n2 = Medianamente logrado, ` +
                  `n3 = Logrado, n4 = Logrado con distinción.\n`
                : `Cada ítem: una afirmación observable que se responde Sí o No (máximo 18 palabras).\n`) +
            `Devuelve SOLO JSON: ${formato()}\n\n` +
            (base.oa ? `Objetivo de la evaluación: ${base.oa}\n` : '') +
            (base.nombre ? `Nombre: ${base.nombre}\n` : '') +
            (idea ? `Idea del profesor: ${idea}\n` : '') +
            `\nCURRÍCULO DEL NIVEL (referencia):\n${cur}`;
    }
    function lugar(c) {
        if (c.i == null) return 'General (toda la propuesta)';
        const crit = `${esRub() ? 'Criterio' : 'Ítem'} ${c.i + 1} («${propuesta[c.i]?.texto || ''}»)`;
        return c.campo === 'texto' ? `${crit}, su nombre` : `${crit}, nivel ${NIVELES[+c.campo.slice(-1) - 1]} (${c.campo.slice(-1)})`;
    }
    function instruccionRevision() {
        return `Eres asesor de evaluación de Música para la educación básica en Chile. Esta es una propuesta de ` +
            (esRub() ? 'RÚBRICA' : 'LISTA DE COTEJO') + ` para ${op.nivel}° básico:\n${comoJSON(propuesta)}\n\n` +
            `El profesor hizo comentarios sobre partes específicas. Aplica SOLO lo que piden los comentarios y deja todo lo ` +
            `demás EXACTAMENTE igual (mismo texto, mismo orden). Si un comentario sobre un nivel obliga a ajustar los otros ` +
            `niveles del mismo criterio para que sigan siendo graduales, ajústalos lo mínimo. Mantén la misma cantidad de ` +
            `${esRub() ? 'criterios' : 'ítems'}, salvo que un comentario pida agregar o quitar.\n\nCOMENTARIOS:\n` +
            comentarios.map((c, k) => `${k + 1}. ${lugar(c)}${c.frag ? `, fragmento: «${c.frag}»` : ''}. Comentario: ${c.nota}`).join('\n') +
            `\n\nDevuelve SOLO JSON con la propuesta completa: ${formato()}\n` +
            (contexto ? `\nContexto: ${contexto}` : '');
    }

    async function pedirIA(texto, previa) {
        const btn = $('ria-btn');
        btn.disabled = true;
        try {
            const nueva = await RedactarOA.pedir(texto, normalizar);
            cambiados = new Set();
            if (previa) nueva.forEach((c, i) => CAMPOS.forEach(k => { if ((c[k] || '') !== (previa[i]?.[k] || '')) cambiados.add(i + ':' + k); }));
            propuesta = nueva;
            comentarios = [];
            estado(previa ? (cambiados.size ? 'Listo: lo que cambió quedó marcado en verde.' : 'La IA no cambió nada; prueba con otro comentario.') : '');
            pintar();
        } catch (e) {
            estado(RedactarOA.mensajeError(e, previa ? 'No se pudo corregir; prueba de nuevo.' : 'No se pudo proponer; prueba de nuevo.'));
        } finally { btn.disabled = false; }
    }

    async function proponer() {
        if (!op) return;
        const cant = +$('ria-n').value, idea = $('ria-idea').value.trim();
        const base = op.base ? op.base() : {};
        if (!base.oa && !base.nombre && !idea) { estado('Escribe una idea (o agrega el OA a la evaluación).'); $('ria-idea').focus(); return; }
        contexto = [base.oa && `objetivo «${base.oa}»`, idea && `idea «${idea}»`].filter(Boolean).join('; ');
        estado('Proponiendo…');
        $('ria-prev').innerHTML = '';
        try { await pedirIA(instruccion(op.nivel, cant, base, idea, await RedactarOA.curriculo(op.nivel)), null); }
        catch (e) { estado(RedactarOA.mensajeError(e, 'No se pudo proponer; prueba de nuevo.')); }
    }
    async function enviarComentarios() {
        if (!comentarios.length || !propuesta) return;
        estado(`Corrigiendo ${comentarios.length} comentario${comentarios.length > 1 ? 's' : ''}…`);
        await pedirIA(instruccionRevision(), propuesta.map(c => ({ ...c })));
    }

    // Texto de una casilla con los fragmentos comentados marcados.
    function conMarcas(txt, i, campo) {
        let h = esc(txt || '—');
        comentarios.filter(c => c.i === i && c.campo === campo && c.frag).forEach(c => {
            const f = esc(c.frag);
            if (f && h.includes(f)) h = h.replace(f, `<mark>${f}</mark>`);
        });
        return h;
    }
    function celda(i, campo, contenido) {
        return `<div class="ria-celda${cambiados.has(i + ':' + campo) ? ' cambio' : ''}" data-i="${i}" data-c="${campo}">${contenido}` +
            `<button type="button" class="ria-c1" title="Comentar esta casilla entera" onclick="RubricaIA.comentar(${i},'${campo}','')">💬</button></div>`;
    }

    function pintar() {
        cerrarFlotantes();
        const n = comentarios.length;
        $('ria-prev').innerHTML = propuesta.map((c, i) => `
            <div style="border:1px solid var(--line);border-radius:8px;padding:7px 10px;margin-top:6px;background:var(--panel2)">
                ${celda(i, 'texto', `<span class="hint">${i + 1}.</span> <b>${conMarcas(c.texto, i, 'texto')}</b>`)}
                ${esRub() ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:6px;margin-top:5px">
                    ${[1, 2, 3, 4].map(k => celda(i, 'desc_n' + k,
                        `<div style="font-size:12px"><span class="hint">${NIVELES[k - 1]} (${k})</span><br>${conMarcas(c['desc_n' + k], i, 'desc_n' + k)}</div>`)).join('')}
                  </div>` : ''}
            </div>`).join('') +
            `<div class="hint" style="margin-top:8px">💬 Para pedir cambios: selecciona un texto de la propuesta (o usa el 💬 de una casilla) y escribe tu comentario. Junta los que quieras y envíalos.</div>
             <div id="ria-coms" style="margin-top:4px">${comentarios.map((c, k) => `
                <div class="ria-com"><div style="flex:1"><span class="q">${esc(lugar(c))}${c.frag ? ` · «${esc(c.frag)}»` : ''}</span><br>${esc(c.nota)}</div>
                <button type="button" class="btn mini" title="Quitar este comentario" onclick="RubricaIA.quitar(${k})">✕</button></div>`).join('')}</div>
             <div class="row" style="gap:8px;margin-top:6px;flex-wrap:wrap">
                <button type="button" class="btn mini" onclick="RubricaIA.comentar(null,null,'')">💬 Comentario general</button>
                <button type="button" class="btn mini primary" ${n ? '' : 'disabled'} onclick="RubricaIA.enviar()">Enviar comentarios (${n})</button>
                <span style="flex:1"></span>
                <button type="button" class="btn mini primary" id="ria-agregar">Agregar todos</button>
                <button type="button" class="btn mini" onclick="RubricaIA.proponer()">↻ Otra propuesta</button>
                <button type="button" class="btn mini" onclick="RubricaIA.descartar()">✕ Descartar</button>
            </div>`;
        $('ria-agregar').addEventListener('click', async ev => {
            const b = ev.currentTarget;
            if (comentarios.length && !confirm(`Tienes ${comentarios.length} comentario(s) sin enviar. ¿Agregar igual la propuesta como está?`)) return;
            b.disabled = true; b.textContent = 'Agregando…';
            try { await op.alAgregar(propuesta); propuesta = null; comentarios = []; }
            catch (e) { b.disabled = false; b.textContent = 'Agregar todos'; estado('No se pudo agregar — revisa la conexión.'); }
        });
    }
    function descartar() { propuesta = null; comentarios = []; cambiados = new Set(); cerrarFlotantes(); $('ria-prev').innerHTML = ''; estado(''); }
    function quitar(k) { comentarios.splice(k, 1); pintar(); }

    // ── Seleccionar un fragmento → 💬 Comentar ───────────────────────────
    function cerrarFlotantes() { $('ria-flot')?.remove(); $('ria-caja')?.remove(); }
    document.addEventListener('mouseup', e => {
        if (e.target.closest?.('#ria-flot, #ria-caja')) return;
        setTimeout(() => {
            $('ria-flot')?.remove();
            const sel = window.getSelection();
            const txt = sel && !sel.isCollapsed ? sel.toString().trim() : '';
            if (!txt || !propuesta) return;
            const a = sel.anchorNode?.parentElement?.closest('.ria-celda'), b = sel.focusNode?.parentElement?.closest('.ria-celda');
            if (!a || a !== b || !$('ria-prev')?.contains(a)) return;
            const r = sel.getRangeAt(0).getBoundingClientRect();
            const f = document.createElement('div');
            f.id = 'ria-flot';
            f.innerHTML = `<button type="button" class="btn mini primary">💬 Comentar</button>`;
            f.style.left = Math.min(r.left, innerWidth - 120) + 'px';
            f.style.top = (r.bottom + 6) + 'px';
            f.firstChild.addEventListener('mousedown', ev => ev.preventDefault());   // no perder la selección
            f.firstChild.addEventListener('click', () => comentar(+a.dataset.i, a.dataset.c, txt, r));
            document.body.appendChild(f);
        });
    });
    function comentar(i, campo, frag, rect) {
        cerrarFlotantes();
        const c = { i, campo, frag };
        const caja = document.createElement('div');
        caja.id = 'ria-caja';
        const cita = frag || (i == null ? 'Toda la propuesta' : (propuesta[i]?.[campo] || ''));
        caja.innerHTML = `<div class="hint" style="margin-bottom:4px">${esc(lugar(c))}</div>
            <div class="q">${esc(cita)}</div>
            <textarea placeholder="¿Qué quieres cambiar? (p. ej. más simple, que nombre el metalófono…)"></textarea>
            <div class="row" style="gap:8px;margin-top:8px;justify-content:flex-end">
                <button type="button" class="btn mini" data-x>Cancelar</button>
                <button type="button" class="btn mini primary" data-ok>Agregar comentario</button></div>`;
        document.body.appendChild(caja);
        const base = rect || document.querySelector(i == null ? '#ria-coms' : `.ria-celda[data-i="${i}"][data-c="${campo}"]`)?.getBoundingClientRect();
        const top = base ? Math.min(base.bottom + 6, innerHeight - caja.offsetHeight - 8) : 80;
        caja.style.left = Math.max(8, Math.min(base ? base.left : 80, innerWidth - caja.offsetWidth - 8)) + 'px';
        caja.style.top = Math.max(8, top) + 'px';
        const ta = caja.querySelector('textarea');
        ta.focus();
        const ok = () => {
            const nota = ta.value.trim();
            if (!nota) { ta.focus(); return; }
            comentarios.push({ ...c, nota });
            window.getSelection()?.removeAllRanges();
            pintar();
        };
        caja.querySelector('[data-ok]').addEventListener('click', ok);
        caja.querySelector('[data-x]').addEventListener('click', cerrarFlotantes);
        ta.addEventListener('keydown', e => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); ok(); }
            if (e.key === 'Escape') { e.stopPropagation(); cerrarFlotantes(); }
        });
    }

    return { html, proponer, enviar: enviarComentarios, comentar, quitar, descartar };
})();
