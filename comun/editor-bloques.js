// ═══════════════════════════════════════════════════════════════════════
// EditorBloques — editor por bloques estilo Notion (deuda BA, 2026-10-12)
// Lo usan Cursos (CURSOS/) y la Bitácora del Planificador (PORTAL/), para que
// escribir se vea y se sienta igual en los dos. Estilos en comun/editor-bloques.css.
//
// El contenido es TEXTO con marcas simples, una línea por bloque (el mismo
// formato de memorias.contenido, que también lee el celular):
//   "# " "## " "### " títulos · "- " viñeta · "1. " numerada · "- [ ] "/"- [x] " casilla
//   "---" separador · dentro del texto: **negrita** *cursiva* __subrayado__ {2:…} {3:…}
//
// Uso:
//   const ed = EditorBloques.crear(contenedor, { texto, alCambiar, vacio, alSubir, pie, tactil });
//   tactil: celular (deuda BM) — sin ＋/⋮⋮ ni arrastrar; barra de formato sobre el teclado y
//   toque largo (o ⋯ de la barra) = menú del bloque, con Subir / Bajar en vez de arrastrar.
//   ed.texto() · ed.poner(texto) · ed.tieneAlgo() · ed.enfocar('inicio'|'fin') · ed.guardado(isoFecha)
//   EditorBloques.zona(elemento)   → ahí se puede arrastrar un marco para seleccionar bloques
//   EditorBloques.html(texto, op)  → vista de solo lectura (HTML); op.objetivo como en crear
//   objetivo: un párrafo que empieza con "O:" es el objetivo y se destaca (Actividades del Plan, deuda BP)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';

    const TIPOS = [
        { t: 'p',    ico: 'Aa', lbl: 'Texto' },
        { t: 'h1',   ico: 'H1', lbl: 'Título 1' },
        { t: 'h2',   ico: 'H2', lbl: 'Título 2' },
        { t: 'h3',   ico: 'H3', lbl: 'Título 3' },
        { t: 'ul',   ico: '•',  lbl: 'Viñetas' },
        { t: 'ol',   ico: '1.', lbl: 'Lista numerada' },
        { t: 'todo', ico: '☑',  lbl: 'Casilla' },
        { t: 'hr',   ico: '—',  lbl: 'Separador' },
    ];
    const LISTAS = new Set(['ul', 'ol', 'todo']);
    const COLORES = [
        { c: 1, lbl: 'Color 1 (normal)',  ico: '<span style="font-weight:700">A</span>' },
        { c: 2, lbl: 'Color 2 (naranjo)', ico: '<span style="color:var(--eb-c2);font-weight:700">A</span>' },
        { c: 3, lbl: 'Color 3 (azul)',    ico: '<span style="color:var(--eb-c3);font-weight:700">A</span>' },
    ];
    const COLOR_HEX = { 2: '#ea580c', 3: '#2563eb' };
    const HEX_COLOR = { '#ea580c': 2, '#2563eb': 3, 'rgb(234, 88, 12)': 2, 'rgb(37, 99, 235)': 3 };

    const nid = () => Math.random().toString(36).slice(2, 10);
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // ── Texto ⇄ bloques (una línea por bloque) ──────────────────────────
    function aBloques(texto) {
        return String(texto || '').replace(/\r/g, '').split('\n').map(linea => {
            let m;
            if (linea === '---')                                 return { id: nid(), t: 'hr', x: '' };
            if ((m = linea.match(/^### (.*)$/)))                 return { id: nid(), t: 'h3', x: m[1] };
            if ((m = linea.match(/^## (.*)$/)))                  return { id: nid(), t: 'h2', x: m[1] };
            if ((m = linea.match(/^# (.*)$/)))                   return { id: nid(), t: 'h1', x: m[1] };
            if ((m = linea.match(/^[-*] \[( |x|X)\] ?(.*)$/)))   return { id: nid(), t: 'todo', x: m[2], c: m[1] !== ' ' };
            if ((m = linea.match(/^([-*•]) (.*)$/)))             return { id: nid(), t: 'ul', x: m[2], m: m[1] };
            if ((m = linea.match(/^\d+[.)] (.*)$/)))             return { id: nid(), t: 'ol', x: m[1] };
            // Párrafo que termina en "<br>": la lista que le sigue va pegada a él (su título; PO 2026-10-18).
            if (/<br>$/.test(linea)) return { id: nid(), t: 'p', x: linea.replace(/<br>$/, ''), pegar: true };
            return { id: nid(), t: 'p', x: linea };
        }).flatMap(b => partirLista(b) || [b]);
    }
    // Párrafo con líneas hechas con Mayús+Enter que empiezan con "- ", "1. " o "[] ": esas líneas son una lista
    // pegada al párrafo (cada línea con marca, un ítem; una línea sin marca sigue al ítem anterior).
    const MARCA_LISTA = /^(\[\s?\] |[-*•] |\d+[.)] )/;
    function partirLista(b) {
        if (b.t !== 'p' || !b.x.includes('<br>')) return null;
        const lineas = b.x.split('<br>');
        const k = lineas.findIndex((l, j) => j > 0 && MARCA_LISTA.test(l));
        if (k < 0) return null;
        const out = [{ ...b, x: lineas.slice(0, k).join('<br>'), pegar: true }];
        lineas.slice(k).forEach(l => {
            const m = l.match(MARCA_LISTA);
            if (!m) { out[out.length - 1].x += '<br>' + l; return; }
            const t = m[1][0] === '[' ? 'todo' : /^\d/.test(m[1]) ? 'ol' : 'ul';
            out.push({ id: nid(), t, x: l.slice(m[1].length).replace(/^ +/, ''), c: false });
        });
        return out;
    }
    function aTexto(bs) {
        let n = 0;
        const txt = bs.map(b => {
            n = b.t === 'ol' ? n + 1 : 0;
            switch (b.t) {
                case 'h1': return '# ' + b.x;
                case 'h2': return '## ' + b.x;
                case 'h3': return '### ' + b.x;
                case 'ul': return (b.m || '-') + ' ' + b.x;
                case 'ol': return n + '. ' + b.x;
                case 'todo': return (b.c ? '- [x] ' : '- [ ] ') + b.x;
                case 'hr': return '---';
                default: return b.x + (b.pegar ? '<br>' : '');
            }
        }).join('\n');
        return txt.trim() ? txt : '';
    }

    // ── Formato dentro del texto ────────────────────────────────────────
    // "\" antes de * _ { } \ = el carácter tal cual. Una marca sin su cierre queda como texto.
    // "<br>" = salto de línea dentro del mismo bloque (Mayús+Enter, PO 2026-10-18).
    function mdAHtml(s) {
        s = String(s || '');
        let out = '';
        const abiertos = [];
        const abre = x => x === '**' ? '<b>' : x === '__' ? '<u>' : '<i>';
        const cierra = { '**': '</b>', '__': '</u>', '*': '</i>', '}': '</font>' };
        const hayCierre = (marca, desde) => {
            for (let j = desde; j < s.length; j++) {
                if (s[j] === '\\') { j++; continue; }
                if (s.startsWith(marca, j)) return true;
            }
            return false;
        };
        const cerrarHasta = m => {
            const k = abiertos.lastIndexOf(m), dentro = abiertos.splice(k);
            dentro.slice().reverse().forEach(x => out += cierra[x]);
            dentro.slice(1).forEach(x => { out += x === '}' ? '' : abre(x); if (x !== '}') abiertos.push(x); });
        };
        for (let i = 0; i < s.length; i++) {
            const ch = s[i];
            if (ch === '\\' && i + 1 < s.length && '*_{}\\'.includes(s[i + 1])) { out += esc(s[++i]); continue; }
            let m = null;
            if (s.startsWith('**', i)) m = '**';
            else if (s.startsWith('__', i)) m = '__';
            else if (ch === '*') m = '*';
            if (m) {
                if (abiertos.includes(m)) { cerrarHasta(m); i += m.length - 1; continue; }
                if (hayCierre(m, i + m.length)) { out += abre(m); abiertos.push(m); i += m.length - 1; continue; }
            }
            if (s.startsWith('<br>', i)) { out += '<br>'; i += 3; continue; }
            const c = s.slice(i, i + 3).match(/^\{([23]):/);
            if (c && hayCierre('}', i + 3)) { out += `<font color="${COLOR_HEX[c[1]]}">`; abiertos.push('}'); i += 2; continue; }
            if (ch === '}' && abiertos.includes('}')) { cerrarHasta('}'); continue; }
            out += esc(ch);
        }
        abiertos.slice().reverse().forEach(x => out += cierra[x]);
        return out;
    }
    const escMd = t => t.replace(/[\\*_{}]/g, '\\$&');
    function domAMd(nodo, escapar) {
        let out = '';
        nodo.childNodes.forEach(n => {
            // Un salto de línea escrito dentro del bloque (Mayús+Enter) se guarda como "<br>".
            if (n.nodeType === 3) { out += n.nodeValue.split('\n').map(v => escapar ? escMd(v) : v).join('<br>'); return; }
            if (n.nodeType === 1 && n.tagName === 'BR') { out += '<br>'; return; }
            if (n.nodeType !== 1) return;
            let dentro = domAMd(n, escapar);
            if (!dentro) return;
            const tag = n.tagName, st = n.style || {};
            const color = HEX_COLOR[(n.getAttribute('color') || '').toLowerCase()] || HEX_COLOR[st.color];
            if (color) dentro = `{${color}:${dentro}}`;
            if (tag === 'U' || /underline/.test(st.textDecoration || st.textDecorationLine || '')) dentro = `__${dentro}__`;
            if (tag === 'I' || tag === 'EM' || st.fontStyle === 'italic') dentro = `*${dentro}*`;
            if (tag === 'B' || tag === 'STRONG' || st.fontWeight === 'bold' || +st.fontWeight >= 600) dentro = `**${dentro}**`;
            out += dentro;
        });
        return out;
    }
    // Los * _ { } del texto se marcan con "\" solo cuando hace falta (enlaces y textos antiguos quedan tal cual).
    function mdDeDom(el) {
        const libre = domAMd(el, false), seguro = domAMd(el, true);
        const md = libre === seguro || mdAHtml(libre) === mdAHtml(seguro) ? libre : seguro;
        return md.replace(/<br>$/, '');   // el último salto es el que el navegador pone para mostrar la línea vacía
    }
    function mdDeTexto(t) { return mdAHtml(t) === esc(t) ? t : escMd(t); }
    function mdAPlano(s) { const d = document.createElement('div'); d.innerHTML = mdAHtml(s); return d.textContent; }
    function mdAPlanoBloques(t) {
        return t.split('\n').map(l => { const m = l.match(/^(#{1,3} |[-*•] \[[ xX]\] |[-*•] |\d+\. )?(.*)$/); return (m[1] || '') + mdAPlano(m[2]); }).join('\n');
    }

    // ── Bloques en pantalla ─────────────────────────────────────────────
    const esObjetivo = b => b.t === 'p' && /^\s*O:/.test(mdAPlano(b.x));
    function htmlBloque(b, num, editable, vacio, op) {
        let marca = '';
        if (b.t === 'ul')   marca = '<span class="eb-marca">•</span>';
        if (b.t === 'ol')   marca = `<span class="eb-marca">${num}.</span>`;
        if (b.t === 'todo') marca = `<span class="eb-marca"><input type="checkbox"${b.c ? ' checked' : ''}${editable ? '' : ' disabled'}></span>`;
        const cuerpo = b.t === 'hr' ? '<div class="eb-linea"></div>'
            : `<div class="eb-txt"${editable ? ` contenteditable="true" spellcheck="true" data-vacio="${esc(vacio || '')}"` : ''}>${mdAHtml(b.x)}${/<br>$/.test(b.x) ? '<br>' : ''}</div>`;
        const asas = editable ? `<div class="eb-asas">
                <button class="eb-mas" tabindex="-1" data-eb-tip="<b>Haz clic</b> para agregar un bloque debajo<br><b>Alt + clic</b> para agregar un bloque arriba">＋</button>
                <span class="eb-asa" draggable="true" data-eb-tip="<b>Arrastra</b> para mover<br><b>Haz clic</b> para abrir el menú">⋮⋮</span>
            </div>` : '';
        const vaciaCls = !editable && b.t === 'p' && !b.x ? ' eb-vacia' : '';
        const objCls = op?.objetivo && esObjetivo(b) ? ' eb-objetivo' : '';
        const pegCls = b.t === 'p' && b.pegar ? ' eb-pegar' : '';
        return `<div class="eb-blq eb-t-${b.t}${b.t === 'todo' && b.c ? ' eb-hecho' : ''}${vaciaCls}${objCls}${pegCls}" data-id="${b.id}">${asas}${marca}${cuerpo}</div>`;
    }
    function html(texto, op) {
        let num = 0;
        const bs = aBloques(texto);
        while (bs.length && bs[bs.length - 1].t === 'p' && !bs[bs.length - 1].x) bs.pop();
        return `<div class="eb eb-lectura"><div class="eb-bloques">${bs.map(b => { num = b.t === 'ol' ? num + 1 : 0; return htmlBloque(b, num, false, '', op); }).join('')}</div></div>`;
    }

    // ── Instancias ──────────────────────────────────────────────────────
    const instancias = {};
    const zonas = new Set();
    function crear(cont, op = {}) {
        const I = { id: nid(), cont, op, bloques: aBloques(op.texto), actualizado: op.actualizado || null };
        instancias[I.id] = I;
        cont.classList.add('eb');
        cont.classList.toggle('eb-tactil', !!op.tactil);
        cont.dataset.eb = I.id;
        cont.innerHTML = '<div class="eb-bloques"><div class="eb-ind"></div></div><div class="eb-fin"></div>';
        asegurarFlotantes();
        if (op.tactil) asegurarBarraTactil();
        pintar(I);
        return {
            texto: () => aTexto(I.bloques),
            poner: t => { I.bloques = aBloques(t); pintar(I); },
            tieneAlgo: () => I.bloques.some(b => b.t === 'hr' || b.x.trim()),
            enfocar: donde => {
                const lista = I.bloques.filter(b => b.t !== 'hr');
                const b = donde === 'inicio' ? lista[0] : lista[lista.length - 1];
                if (b) enfocar(b.id, donde === 'inicio' ? 0 : 'fin');
            },
            guardado: iso => { I.actualizado = iso; },
            destruir: () => { delete instancias[I.id]; },
            el: cont,
        };
    }
    function zona(el) { zonas.add(el); }

    const insDe   = el => instancias[el?.closest?.('.eb[data-eb]')?.dataset.eb];
    const elDe    = id => document.querySelector(`.eb-blq[data-id="${id}"]`);
    const txtDe   = id => elDe(id)?.querySelector('.eb-txt');
    const insDeId = id => insDe(elDe(id));
    const idx     = (I, id) => I.bloques.findIndex(b => b.id === id);
    const cambio  = I => { if (I.op.alCambiar) I.op.alCambiar(); };

    function pintar(I) {
        const cont = I.cont.querySelector('.eb-bloques');
        if (!I.bloques.length) I.bloques = [{ id: nid(), t: 'p', x: '' }];
        [...cont.querySelectorAll('.eb-blq')].forEach(n => n.remove());
        let num = 0, h = '';
        I.bloques.forEach(b => { num = b.t === 'ol' ? num + 1 : 0; h += htmlBloque(b, num, true, I.op.vacio, I.op); });
        cont.insertAdjacentHTML('beforeend', h);
        marcarSolo(I);
    }
    function marcarSolo(I) {
        I.cont.querySelector('.eb-bloques').classList.toggle('eb-solo', I.bloques.length === 1 && !I.bloques[0].x && I.bloques[0].t === 'p');
    }

    // ── Cursor ──────────────────────────────────────────────────────────
    function cursorEn(el) {
        const s = getSelection();
        if (!s.rangeCount || !el.contains(s.anchorNode)) return 0;
        const r = s.getRangeAt(0), pre = document.createRange();
        pre.selectNodeContents(el);
        pre.setEnd(r.startContainer, r.startOffset);
        return pre.toString().length;
    }
    function ponerCursor(el, off) {
        el.focus();
        const s = getSelection(), r = document.createRange();
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let t, rest = off, ok = false;
        while ((t = w.nextNode())) {
            if (rest <= t.length) { r.setStart(t, rest); ok = true; break; }
            rest -= t.length;
        }
        if (!ok) { r.selectNodeContents(el); r.collapse(false); } else r.collapse(true);
        s.removeAllRanges(); s.addRange(r);
    }
    function enfocar(id, off) {
        const el = txtDe(id);
        if (el) ponerCursor(el, off === 'fin' ? el.textContent.length : off);
    }
    function borrarInicio(el, n) {
        const r = document.createRange(), w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        r.setStart(el, 0);
        let t, rest = n;
        while ((t = w.nextNode())) { if (rest <= t.length) { r.setEnd(t, rest); break; } rest -= t.length; }
        r.deleteContents();
    }
    function cortarDesdeCursor(el) {
        const s = getSelection();
        if (!s.rangeCount) return '';
        const r = document.createRange();
        r.selectNodeContents(el);
        r.setStart(s.getRangeAt(0).startContainer, s.getRangeAt(0).startOffset);
        const div = document.createElement('div');
        div.appendChild(r.extractContents());
        return mdDeDom(div);
    }

    // ── Operaciones ─────────────────────────────────────────────────────
    function insertar(I, pos, b) { I.bloques.splice(pos, 0, b); pintar(I); cambio(I); return b; }
    function convertir(id, t) {
        const I = insDeId(id); if (!I) return;
        const i = idx(I, id), b = I.bloques[i];
        if (t === 'hr') {
            const resto = b.t !== 'hr' ? b.x : '';
            b.t = 'hr'; b.x = '';
            let sig = I.bloques[i + 1];
            if (resto || !sig || sig.t === 'hr') { sig = { id: nid(), t: 'p', x: resto }; I.bloques.splice(i + 1, 0, sig); }
            pintar(I); cambio(I);
            enfocar(sig.id, 0);
            return;
        }
        const off = txtDe(id) ? cursorEn(txtDe(id)) : 0;
        b.t = t;
        if (t === 'todo' && b.c === undefined) b.c = false;
        pintar(I); cambio(I);
        enfocar(id, Math.min(off, mdAPlano(b.x).length));
    }
    function duplicar(ids) {
        ids = [].concat(ids);
        const I = insDeId(ids[0]); if (!I) return;
        const orden = ids.map(id => idx(I, id)).filter(i => i >= 0).sort((a, b) => a - b);
        if (!orden.length) return;
        const copias = orden.map(i => ({ ...I.bloques[i], id: nid() }));
        I.bloques.splice(orden[orden.length - 1] + 1, 0, ...copias);
        pintar(I); cambio(I);
        if (copias.length === 1) enfocar(copias[0].id, 'fin'); else seleccionar(copias.map(c => c.id));
    }
    function eliminar(ids) {
        ids = [].concat(ids);
        const I = insDeId(ids[0]); if (!I) return;
        const primero = Math.min(...ids.map(id => idx(I, id)).filter(i => i >= 0));
        I.bloques = I.bloques.filter(b => !ids.includes(b.id));
        limpiarSeleccion();
        pintar(I); cambio(I);
        const vecino = I.bloques[Math.max(0, primero - 1)];
        if (vecino) enfocar(vecino.id, 'fin');
    }
    function convertirGrupo(ids, t) {
        const I = insDeId(ids[0]); if (!I) return;
        I.bloques.forEach(b => { if (ids.includes(b.id) && b.t !== 'hr') { b.t = t; if (t === 'todo' && b.c === undefined) b.c = false; } });
        pintar(I); cambio(I);
        seleccionar(ids);
    }
    function colorDe(x) { const m = String(x).match(/^\{([23]):[\s\S]*\}$/); return m && mdAHtml(x).startsWith('<font') ? +m[1] : 1; }
    function colorear(ids, c) {
        const I = insDeId(ids[0]); if (!I) return;
        I.bloques.forEach(b => {
            if (!ids.includes(b.id) || b.t === 'hr' || !b.x) return;
            const d = document.createElement('div');
            d.innerHTML = mdAHtml(b.x);
            d.querySelectorAll('font').forEach(f => f.replaceWith(...f.childNodes));
            const md = mdDeDom(d);
            b.x = c === 1 ? md : `{${c}:${md}}`;
        });
        pintar(I); cambio(I);
        if (ids.length > 1) seleccionar(ids);
    }

    // ── Escritura ───────────────────────────────────────────────────────
    document.addEventListener('input', e => {
        const txt = e.target.closest?.('.eb-blq .eb-txt');
        if (!txt) return;
        const I = insDe(txt), id = txt.parentElement.dataset.id, b = I?.bloques[idx(I, id)];
        if (!b) return;
        if (!txt.textContent) txt.innerHTML = '';
        b.x = mdDeDom(txt);
        if (I.op.objetivo) txt.parentElement.classList.toggle('eb-objetivo', esObjetivo(b));
        if (e.inputType === 'insertText' && e.data) {
            const plano = txt.textContent, pos = cursorEn(txt);
            if (I.op.tactil && plano === '/') { txt.innerHTML = ''; b.x = ''; marcarSolo(I); menuTipos(id); return; }
            if (b.t === 'p' && plano === '---') { b.x = ''; txt.innerHTML = ''; convertir(id, 'hr'); return; }
            if (e.data.includes(' ')) {
                const partes = partirLista(b);
                if (partes) {
                    const i = idx(I, id);
                    I.bloques.splice(i, 1, ...partes);
                    pintar(I); cambio(I);
                    enfocar(partes[1].id, 'fin');   // si el texto llegó de una vez ("1. Primero"), el cursor queda tras él
                    return;
                }
            }
            if (e.data.includes(' ')) {
                const reglas = [[/^### /, 'h3'], [/^## /, 'h2'], [/^# /, 'h1'], [/^\[\s?\] /, 'todo'], [/^[-*] /, 'ul'], [/^1[.)] /, 'ol']];
                for (const [re, t] of reglas) {
                    const m = plano.match(re);
                    const recien = m && (pos === m[0].length || (e.data.length > 1 && e.data.startsWith(m[0]) && pos === e.data.length));
                    if (recien && (b.t === 'p' || (b.t === 'ul' && t === 'todo'))) {
                        borrarInicio(txt, m[0].length);
                        b.x = mdDeDom(txt);
                        b.t = t; if (t === 'todo') b.c = false;
                        pintar(I); cambio(I);
                        enfocar(id, pos - m[0].length);
                        return;
                    }
                }
            }
        }
        marcarSolo(I);
        cambio(I);
    });

    document.addEventListener('keydown', e => {
        if (menuAbierto() && teclaMenu(e)) return;
        if (seleccion.length && teclaSeleccion(e)) return;
        const txt = e.target.closest?.('.eb-blq .eb-txt');
        if (!txt || e.isComposing) return;
        const I = insDe(txt), id = txt.parentElement.dataset.id, i = idx(I, id), b = I?.bloques[i];
        if (!b) return;
        const bs = I.bloques;
        const sel = getSelection(), colapsada = sel.isCollapsed, off = cursorEn(txt), largo = txt.textContent.length;

        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); txt.blur(); seleccionar([id]); return; }
        if (e.key === 'Enter' && e.shiftKey) { e.preventDefault(); document.execCommand('insertLineBreak'); return; }   // salto dentro del párrafo
        if (e.key === 'Enter') { e.preventDefault(); alEnter(txt); return; }
        if (e.key === 'Backspace' && colapsada && off === 0) { e.preventDefault(); alBorrarAlInicio(txt); return; }
        if (e.key === 'Delete' && colapsada && off === largo && i < bs.length - 1) {
            e.preventDefault();
            if (bs[i + 1].t !== 'hr') b.x += bs[i + 1].x;
            bs.splice(i + 1, 1);
            pintar(I); cambio(I);
            enfocar(id, largo);
            return;
        }
        const anterior  = () => { for (let j = i - 1; j >= 0; j--) if (bs[j].t !== 'hr') return bs[j]; };
        const siguiente = () => { for (let j = i + 1; j < bs.length; j++) if (bs[j].t !== 'hr') return bs[j]; };
        if (e.key === 'ArrowUp' && colapsada && off === 0) {
            const a = anterior();
            if (a) { e.preventDefault(); enfocar(a.id, 'fin'); return; }
            if (I.op.alSubir) { e.preventDefault(); I.op.alSubir(); return; }
        }
        if (e.key === 'ArrowDown' && colapsada && off === largo) { const s = siguiente(); if (s) { e.preventDefault(); enfocar(s.id, 0); return; } }
        if (e.key === 'ArrowLeft' && colapsada && off === 0 && !e.shiftKey) { const a = anterior(); if (a) { e.preventDefault(); enfocar(a.id, 'fin'); return; } }
        if (e.key === 'ArrowRight' && colapsada && off === largo && !e.shiftKey) { const s = siguiente(); if (s) { e.preventDefault(); enfocar(s.id, 0); return; } }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) { e.preventDefault(); duplicar(id); return; }
        if (e.key === '/' && !b.x) { e.preventDefault(); menuTipos(id); return; }
    }, true);

    // Enter: parte el bloque en el cursor (en una lista vacía, vuelve a texto).
    function alEnter(txt) {
        const I = insDe(txt), id = txt.parentElement.dataset.id, i = idx(I, id), b = I?.bloques[i];
        if (!b) return;
        const sel = getSelection();
        if (LISTAS.has(b.t) && !b.x) { convertir(id, 'p'); return; }
        if (!sel.isCollapsed) sel.deleteFromDocument();
        const o = cursorEn(txt), tNuevo = LISTAS.has(b.t) ? b.t : 'p';
        if (o === 0 && txt.textContent.length) {
            b.x = mdDeDom(txt);
            insertar(I, i, { id: nid(), t: tNuevo, x: '', c: false });
            enfocar(id, 0);
            return;
        }
        const resto = cortarDesdeCursor(txt);
        b.x = mdDeDom(txt);
        const nuevo = insertar(I, i + 1, { id: nid(), t: tNuevo, x: resto, c: false, m: b.m });
        enfocar(nuevo.id, 0);
    }
    // Borrar al inicio del bloque: un título/lista vuelve a texto; un texto se une al anterior.
    function alBorrarAlInicio(txt) {
        const I = insDe(txt), id = txt.parentElement.dataset.id, i = idx(I, id), b = I?.bloques[i];
        if (!b) return;
        const bs = I.bloques;
        if (b.t !== 'p') { convertir(id, 'p'); return; }
        if (i === 0) return;
        const prev = bs[i - 1];
        if (prev.t === 'hr') { bs.splice(i - 1, 1); pintar(I); cambio(I); enfocar(id, 0); return; }
        const pos = mdAPlano(prev.x).length;
        prev.x += b.x;
        bs.splice(i, 1);
        pintar(I); cambio(I);
        enfocar(prev.id, pos);
    }
    // Teclado del celular: Enter y Borrar no siempre llegan como teclas; llegan como "beforeinput".
    // (En el PC, la tecla ya hizo su trabajo y canceló este paso.)
    document.addEventListener('beforeinput', e => {
        const txt = e.target.closest?.('.eb-blq .eb-txt');
        if (!txt || e.isComposing) return;
        if (e.inputType === 'insertParagraph') { e.preventDefault(); alEnter(txt); return; }
        if (e.inputType === 'deleteContentBackward' && getSelection().isCollapsed && cursorEn(txt) === 0) { e.preventDefault(); alBorrarAlInicio(txt); }
    });

    // Pegar: solo texto; cada línea pegada es un bloque.
    document.addEventListener('paste', e => {
        const txt = e.target.closest?.('.eb-blq .eb-txt');
        if (!txt) return;
        e.preventDefault();
        const texto = (e.clipboardData.getData('text/plain') || '').replace(/\r/g, '');
        if (!texto) return;
        const lineas = texto.split('\n');
        const I = insDe(txt), id = txt.parentElement.dataset.id, i = idx(I, id), b = I.bloques[i];
        if (lineas.length === 1) { document.execCommand('insertText', false, texto); return; }
        const sel = getSelection();
        if (!sel.isCollapsed) sel.deleteFromDocument();
        const resto = cortarDesdeCursor(txt);
        b.x = mdDeDom(txt) + mdDeTexto(lineas[0]);
        const nuevos = aBloques(lineas.slice(1).map(l => {
            const m = l.match(/^(#{1,3} |[-*•] \[[ xX]\] ?|[-*•] |\d+[.)] )?(.*)$/);
            return (m[1] || '') + mdDeTexto(m[2]);
        }).join('\n'));
        const ultimo = nuevos[nuevos.length - 1], finUltimo = mdAPlano(ultimo.x).length;
        ultimo.x += resto;
        I.bloques.splice(i + 1, 0, ...nuevos);
        pintar(I); cambio(I);
        enfocar(ultimo.id, finUltimo);
    });

    // Clics: casillas, ＋, ⋮⋮, separador, final del editor.
    document.addEventListener('click', e => {
        const chk = e.target.closest('.eb-blq .eb-marca input');
        if (chk) {
            const I = insDe(chk); if (!I) return;
            const b = I.bloques[idx(I, chk.closest('.eb-blq').dataset.id)];
            b.c = chk.checked;
            chk.closest('.eb-blq').classList.toggle('eb-hecho', b.c);
            cambio(I);
            return;
        }
        const mas = e.target.closest('.eb-mas');
        if (mas) {
            ocultarTip();
            const I = insDe(mas), i = idx(I, mas.closest('.eb-blq').dataset.id);
            const nuevo = insertar(I, e.altKey ? i : i + 1, { id: nid(), t: 'p', x: '' });
            enfocar(nuevo.id, 0);
            menuTipos(nuevo.id);
            return;
        }
        const asa = e.target.closest('.eb-asa');
        if (asa) { ocultarTip(); menuBloque(asa.closest('.eb-blq').dataset.id, asa); return; }
        const hr = e.target.closest('.eb[data-eb] .eb-blq.eb-t-hr');
        if (hr && !e.target.closest('.eb-asas')) { seleccionar([hr.dataset.id]); return; }
        const fin = e.target.closest('.eb[data-eb] > .eb-fin');
        if (fin) {
            const I = insDe(fin), ult = I.bloques[I.bloques.length - 1];
            if (ult && ult.t === 'p' && !ult.x) enfocar(ult.id, 0);
            else { const n = insertar(I, I.bloques.length, { id: nid(), t: 'p', x: '' }); enfocar(n.id, 0); }
        }
    });

    // Clic derecho sobre un bloque: su menú (solo en editores que pueden crear pendientes).
    document.addEventListener('contextmenu', e => {
        const blq = e.target.closest?.('.eb[data-eb] .eb-blq');
        const I = insDe(blq);
        if (!blq || !(I?.op.alPendiente || I?.op.tactil)) return;
        e.preventDefault();
        const x = e.clientX, y = e.clientY;
        menuBloque(blq.dataset.id, { getBoundingClientRect: () => ({ left: x, right: x, top: y, bottom: y }) });
    });

    // ── Arrastrar bloques (dentro del mismo editor) ─────────────────────
    let arrastre = null, destino = null;
    document.addEventListener('dragstart', e => {
        const asa = e.target.closest?.('.eb-asa');
        if (!asa) return;
        const blq = asa.closest('.eb-blq');
        const ids = seleccion.includes(blq.dataset.id) ? seleccion.slice() : [blq.dataset.id];
        arrastre = { I: insDe(blq), ids };
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
        e.dataTransfer.setDragImage(blq, 30, 14);
        ocultarTip(); cerrarMenus();
        requestAnimationFrame(() => ids.forEach(id => elDe(id)?.classList.add('eb-arr')));
    });
    document.addEventListener('dragover', e => {
        if (!arrastre) return;
        const cont = arrastre.I.cont.querySelector('.eb-bloques');
        e.preventDefault();
        const base = cont.getBoundingClientRect(), els = [...cont.querySelectorAll('.eb-blq')];
        let pos = els.length, y;
        for (let k = 0; k < els.length; k++) {
            const r = els[k].getBoundingClientRect();
            if (e.clientY < r.top + r.height / 2) { pos = k; y = r.top - base.top - 2; break; }
        }
        if (pos === els.length) { const r = els[els.length - 1].getBoundingClientRect(); y = r.bottom - base.top - 1; }
        destino = pos;
        const ind = cont.querySelector('.eb-ind');
        ind.style.top = y + 'px'; ind.style.display = 'block';
    });
    document.addEventListener('drop', e => {
        if (!arrastre) return;
        e.preventDefault();
        const I = arrastre.I, ids = arrastre.ids;
        const pos = ids.map(id => idx(I, id)).filter(i => i >= 0).sort((x, y) => x - y);
        let a = destino;
        const igual = pos.length && a !== null && a >= pos[0] && a <= pos[pos.length - 1] + 1 && pos[pos.length - 1] - pos[0] === pos.length - 1;
        if (pos.length && a !== null && !igual) {
            const mover = pos.map(i => I.bloques[i]);
            a -= pos.filter(i => i < a).length;
            I.bloques = I.bloques.filter(b => !ids.includes(b.id));
            I.bloques.splice(a, 0, ...mover);
            pintar(I); cambio(I);
            if (ids.length > 1) seleccionar(ids);
        }
        finArrastre();
    });
    document.addEventListener('dragend', finArrastre);
    function finArrastre() {
        arrastre = null; destino = null;
        document.querySelectorAll('.eb-ind').forEach(n => n.style.display = 'none');
        document.querySelectorAll('.eb-blq.eb-arr').forEach(n => n.classList.remove('eb-arr'));
    }

    // ── Elementos flotantes (ayuda, menús, marco, barra de formato) ─────
    let F = null;
    function asegurarFlotantes() {
        if (F) return;
        const d = document.createElement('div');
        d.innerHTML = `<div id="eb-tip" class="eb-flot"></div>
            <div id="eb-marco"></div>
            <div id="eb-menu" class="eb-menu eb-flot"></div>
            <div id="eb-submenu" class="eb-menu eb-flot"></div>
            <div id="eb-formato" class="eb-flot">
                <button data-f="bold" title="Negrita (Ctrl+B)"><b>B</b></button>
                <button data-f="italic" title="Cursiva (Ctrl+I)"><i>I</i></button>
                <button data-f="underline" title="Subrayado (Ctrl+U)"><u>U</u></button>
                <span class="eb-sep"></span>
                <button data-c="#000001" class="eb-col-a" title="Color 1 (normal)">A</button>
                <button data-c="#ea580c" class="eb-col-a" style="color:var(--eb-c2)" title="Color 2 (naranjo)">A</button>
                <button data-c="#2563eb" class="eb-col-a" style="color:var(--eb-c3)" title="Color 3 (azul)">A</button>
                <span class="eb-sep"></span>
                <button data-a="mas" title="Más opciones del bloque">⋯</button>
            </div>`;
        document.body.append(...d.children);
        F = { tip: document.getElementById('eb-tip'), marco: document.getElementById('eb-marco'), menu: document.getElementById('eb-menu'),
              sub: document.getElementById('eb-submenu'), formato: document.getElementById('eb-formato') };
        F.menu.addEventListener('mousedown', e => { if (e.target.closest('.eb-m-fmt')) e.preventDefault(); });
        F.menu.addEventListener('click', e => {
            const fb = e.target.closest('.eb-m-fmt button');
            if (fb) { aplicarFormato(fb); return; }
            const b = e.target.closest('.eb-m-it'); if (b) elegir(+b.dataset.k);
        });
        F.menu.addEventListener('mouseover', e => {
            const b = e.target.closest('.eb-m-it');
            if (!b) return;
            focoMenu(+b.dataset.k);
            const it = menuItems[+b.dataset.k];
            if (it.sub) abrirSubmenu(it, b); else F.sub.style.display = 'none';
        });
        F.formato.addEventListener('mousedown', e => e.preventDefault());
        F.formato.addEventListener('click', e => {
            const btn = e.target.closest('button');
            const txt = txtDeSeleccion();
            if (!btn || !txt) return;
            // ⋯: el menú completo del bloque, que sigue actuando sobre el texto seleccionado (deuda CP)
            if (btn.dataset.a === 'mas') { const r = F.formato.getBoundingClientRect(); F.formato.style.display = 'none'; menuBloque(txt.parentElement.dataset.id, { getBoundingClientRect: () => r }); return; }
            document.execCommand('styleWithCSS', false, false);
            if (btn.dataset.f) document.execCommand(btn.dataset.f);
            if (btn.dataset.c) document.execCommand('foreColor', false, btn.dataset.c);
            actualizarFormato();
        });
    }

    document.addEventListener('mouseover', e => {
        const t = e.target.closest?.('[data-eb-tip]');
        if (!t || arrastre || menuAbierto() || !F) return;
        F.tip.innerHTML = t.dataset.ebTip;
        F.tip.style.display = 'block';
        const r = t.getBoundingClientRect();
        F.tip.style.left = Math.max(8, r.left + r.width / 2 - F.tip.offsetWidth / 2) + 'px';
        F.tip.style.top = (r.bottom + 8) + 'px';
    });
    document.addEventListener('mouseout', e => { if (e.target.closest?.('[data-eb-tip]')) ocultarTip(); });
    function ocultarTip() { if (F) F.tip.style.display = 'none'; }

    // ── Barra de formato (al seleccionar texto) ─────────────────────────
    function txtDeSeleccion() {
        const s = getSelection();
        if (!s.rangeCount || s.isCollapsed) return null;
        const de = n => (n?.nodeType === 3 ? n.parentElement : n)?.closest?.('.eb[data-eb] .eb-txt');
        const a = de(s.anchorNode), f = de(s.focusNode);
        return a && a === f ? a : null;
    }
    function actualizarFormato() {
        if (!F) return;
        const txt = txtDeSeleccion();
        if (!txt || marcando || txt.closest('.eb-tactil') || menuAbierto()) { F.formato.style.display = 'none'; return; }
        const r = getSelection().getRangeAt(0).getBoundingClientRect();
        F.formato.style.display = 'flex';
        ['bold', 'italic', 'underline'].forEach(f => F.formato.querySelector(`[data-f="${f}"]`).classList.toggle('eb-on', document.queryCommandState(f)));
        let left = r.left + r.width / 2 - F.formato.offsetWidth / 2, top = r.top - F.formato.offsetHeight - 8;
        if (top < 8) top = r.bottom + 8;
        F.formato.style.left = Math.max(8, Math.min(left, innerWidth - F.formato.offsetWidth - 8)) + 'px';
        F.formato.style.top = top + 'px';
    }
    document.addEventListener('selectionchange', actualizarFormato);

    // ── Menús ───────────────────────────────────────────────────────────
    let menuItems = [], menuFoco = 0, menuCierre = null, menuBloqueId = null, menuFormato = null;
    function menuAbierto() { return !!F && F.menu.style.display === 'block'; }
    // formato: { ids, txt, rango } → fila B I U · A A A arriba (deuda CP). Con rango actúa sobre ese
    // texto seleccionado; sin rango, sobre los bloques enteros.
    function abrirMenu(items, ancla, { titulo = '', pie = '', alCerrar = null, alDerecha = false, formato = null } = {}) {
        asegurarFlotantes();
        cerrarMenus();
        const m = F.menu;
        menuItems = items.filter(it => !it.sep);
        menuFoco = 0; menuCierre = alCerrar; menuFormato = formato;
        let k = 0, h = titulo ? `<div class="eb-m-tit">${esc(titulo)}</div>` : '';
        if (formato) h += `<div class="eb-m-fmt">
                <button data-f="bold" title="Negrita (Ctrl+B)"><b>B</b></button>
                <button data-f="italic" title="Cursiva (Ctrl+I)"><i>I</i></button>
                <button data-f="underline" title="Subrayado (Ctrl+U)"><u>U</u></button>
                <span class="eb-sep"></span>
                ${COLORES.map(k => `<button data-c="${k.c}" class="eb-col-a"${k.c > 1 ? ` style="color:var(--eb-c${k.c})"` : ''} title="${esc(k.lbl)}">A</button>`).join('')}
            </div><div class="eb-m-sep"></div>`;
        items.forEach(it => {
            if (it.sep) { h += '<div class="eb-m-sep"></div>'; return; }
            h += `<button class="eb-m-it${it.peligro ? ' eb-peligro' : ''}" data-k="${k++}">
                <span class="eb-m-ico">${it.html ? it.ico : esc(it.ico || '')}</span><span class="eb-m-lbl">${esc(it.lbl)}</span>
                ${it.atajo ? `<span class="eb-m-atajo">${esc(it.atajo)}</span>` : ''}${it.sub ? '<span class="eb-m-chev">›</span>' : ''}</button>`;
        });
        if (pie) h += `<div class="eb-m-sep"></div><div class="eb-m-pie">${pie}</div>`;
        m.innerHTML = h;
        m.style.display = 'block';
        const r = ancla.getBoundingClientRect();
        let left = r.left, top = r.bottom + 6;
        if (top + m.offsetHeight > innerHeight - 8) top = Math.max(8, r.top - m.offsetHeight - 6);
        if (alDerecha) left = r.right - m.offsetWidth;
        if (left + m.offsetWidth > innerWidth - 8) left = innerWidth - m.offsetWidth - 8;
        m.style.left = Math.max(8, left) + 'px'; m.style.top = top + 'px';
        focoMenu(0);
        estadoFormato();
    }
    function estadoFormato() {
        const fm = menuFormato, fila = F.menu.querySelector('.eb-m-fmt');
        if (!fm || !fila) return;
        ['bold', 'italic', 'underline'].forEach(f => fila.querySelector(`[data-f="${f}"]`).classList.toggle('eb-on', !!fm.rango && document.queryCommandState(f)));
        const I = insDeId(fm.ids[0]), uno = !fm.rango && fm.ids.length === 1 ? I?.bloques[idx(I, fm.ids[0])] : null;
        fila.querySelectorAll('[data-c]').forEach(b => b.classList.toggle('eb-on', !!uno && !!uno.x && colorDe(uno.x) === +b.dataset.c));
    }
    function aplicarFormato(btn) {
        const fm = menuFormato;
        if (!fm) return;
        const f = btn.dataset.f, c = +btn.dataset.c;
        if (fm.rango && fm.txt.isConnected) {
            fm.txt.focus();
            const s = getSelection();
            s.removeAllRanges(); s.addRange(fm.rango);
            document.execCommand('styleWithCSS', false, false);
            if (f) document.execCommand(f); else document.execCommand('foreColor', false, c === 1 ? '#000001' : COLOR_HEX[c]);
            if (s.rangeCount) fm.rango = s.getRangeAt(0).cloneRange();
        } else if (f) formatoBloques(fm.ids, f);
        else { colorear(fm.ids, c); fm.ids.forEach(id => elDe(id)?.classList.add('eb-sel')); }
        estadoFormato();
    }
    // Negrita/cursiva/subrayado a bloques enteros: si el primero ya lo tiene, se quita en todos.
    function formatoBloques(ids, f) {
        const s = getSelection();
        let quitar = null;
        ids.forEach(id => {
            const txt = txtDe(id);
            if (!txt || !txt.textContent) return;
            txt.focus();
            const r = document.createRange(); r.selectNodeContents(txt);
            s.removeAllRanges(); s.addRange(r);
            document.execCommand('styleWithCSS', false, false);
            const tiene = document.queryCommandState(f);
            if (quitar === null) quitar = tiene;
            if (tiene === quitar) document.execCommand(f);
        });
        s.removeAllRanges(); document.activeElement?.blur?.();
        ids.forEach(id => elDe(id)?.classList.add('eb-sel'));
    }
    function focoMenu(k) {
        menuFoco = (k + menuItems.length) % menuItems.length;
        F.menu.querySelectorAll('.eb-m-it').forEach((n, j) => n.classList.toggle('eb-foco', j === menuFoco));
    }
    function cerrarMenus() {
        if (!F) return;
        const estaba = menuAbierto();
        F.menu.style.display = 'none'; F.sub.style.display = 'none';
        if (estaba) limpiarSeleccion();
        if (estaba && menuCierre) { const f = menuCierre; menuCierre = null; f(); }
        menuBloqueId = null; menuFormato = null;
    }
    function elegir(k) {
        const it = menuItems[k];
        if (!it) return;
        if (it.sub) { abrirSubmenu(it, F.menu.querySelectorAll('.eb-m-it')[k]); return; }
        menuCierre = null;
        cerrarMenus();
        it.accion();
    }
    function abrirSubmenu(it, el) {
        const s = F.sub;
        s.innerHTML = it.sub.map((x, j) => `<button class="eb-m-it" data-j="${j}"><span class="eb-m-ico">${x.html ? x.ico : esc(x.ico)}</span>
            <span class="eb-m-lbl">${esc(x.lbl)}</span>${x.activo ? '<span class="eb-m-atajo">✓</span>' : ''}</button>`).join('');
        s.style.display = 'block';
        const r = el.getBoundingClientRect();
        let left = r.right + 4;
        if (left + s.offsetWidth > innerWidth - 8) left = r.left - s.offsetWidth - 4;
        s.style.left = left + 'px';
        s.style.top = Math.max(8, Math.min(r.top - 6, innerHeight - s.offsetHeight - 8)) + 'px';
        s.onclick = ev => {
            const b = ev.target.closest('[data-j]');
            if (!b) return;
            const x = it.sub[+b.dataset.j];
            menuCierre = null; cerrarMenus(); x.accion();
        };
    }
    document.addEventListener('mousedown', e => {
        if (menuAbierto() && !e.target.closest('.eb-menu') && !e.target.closest('.eb-asa') && !e.target.closest('[data-eb-menu]')) cerrarMenus();
    });
    function teclaMenu(e) {
        const corta = () => { e.preventDefault(); e.stopPropagation(); return true; };
        if (e.key === 'ArrowDown') { focoMenu(menuFoco + 1); return corta(); }
        if (e.key === 'ArrowUp')   { focoMenu(menuFoco - 1); return corta(); }
        if (e.key === 'Enter')     { elegir(menuFoco); return corta(); }
        if (e.key === 'Escape')    { cerrarMenus(); return corta(); }
        if (menuBloqueId && !menuFormato?.rango) {
            const ids = menuBloqueId;
            if (e.key === 'Delete' || e.key === 'Backspace') { menuCierre = null; cerrarMenus(); eliminar(ids); return corta(); }
            if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) { menuCierre = null; cerrarMenus(); duplicar(ids); return corta(); }
            return false;
        }
        if (e.key.length === 1 || e.key === 'Backspace') cerrarMenus();
        return false;
    }
    function itemsTipos(id) {
        const I = insDeId(id), b = I?.bloques[idx(I, id)];
        return TIPOS.map(x => ({ ico: x.ico, lbl: x.lbl, activo: b && b.t === x.t, accion: () => convertir(id, x.t) }));
    }
    function menuTipos(id) {
        const el = txtDe(id);
        if (!el) return;
        abrirMenu(itemsTipos(id).map(x => ({ ...x, activo: false })), el, { titulo: 'Bloques básicos', alCerrar: () => enfocar(id, 'fin') });
    }
    function cuando(iso) {
        const d = new Date(iso), hoy = new Date();
        const hora = d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        if (d.toDateString() === hoy.toDateString()) return 'hoy a las ' + hora;
        return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' }) + ' a las ' + hora;
    }
    function menuBloque(id, asa) {
        const I = insDeId(id), b = I?.bloques[idx(I, id)];
        if (!b) return;
        if (seleccion.includes(id) && seleccion.length > 1) return menuGrupo(seleccion.slice(), asa);
        const plano = mdAPlano(b.x).trim();
        const palabras = plano ? plano.split(/\s+/).length : 0;
        // Texto seleccionado dentro del bloque (clic derecho sobre él o ⋯ de la barra): el formato va a ese texto.
        const s = getSelection(), txt = txtDe(id);
        const rango = txt && s.rangeCount && !s.isCollapsed && txt.contains(s.anchorNode) && txt.contains(s.focusNode) ? s.getRangeAt(0).cloneRange() : null;
        abrirMenu([
            { ico: '⇄', lbl: 'Convertir en', sub: itemsTipos(id) },
            ...(I.op.alPendiente && plano ? [{ ico: '☑', lbl: 'Convertir en pendiente', accion: () => aPendiente([id]) }] : []),
            ...(I.op.tactil ? [{ sep: true },
                { ico: '↑', lbl: 'Subir', accion: () => mover(id, -1) },
                { ico: '↓', lbl: 'Bajar', accion: () => mover(id, 1) }] : []),
            { sep: true },
            { ico: '⧉', lbl: 'Duplicar', atajo: I.op.tactil ? '' : 'Ctrl+D', accion: () => duplicar(id) },
            { ico: '🗑', lbl: 'Eliminar', atajo: I.op.tactil ? '' : 'Supr', peligro: true, accion: () => eliminar(id) },
        ], asa, {
            titulo: TIPOS.find(x => x.t === b.t)?.lbl || 'Texto',
            pie: `${I.actualizado ? 'Última edición: ' + cuando(I.actualizado) + '<br>' : ''}${palabras} palabra${palabras === 1 ? '' : 's'}, ${plano.length} caractere${plano.length === 1 ? '' : 's'}`,
            formato: b.t === 'hr' ? null : { ids: [id], txt, rango },
        });
        menuBloqueId = [id];
        elDe(id)?.classList.add('eb-sel');
        if (!rango) document.activeElement?.blur?.();
    }
    // Celular: mover un bloque un lugar (reemplaza arrastrar).
    function mover(id, d) {
        const I = insDeId(id); if (!I) return;
        const i = idx(I, id), j = i + d;
        if (i < 0 || j < 0 || j >= I.bloques.length) return;
        [I.bloques[i], I.bloques[j]] = [I.bloques[j], I.bloques[i]];
        pintar(I); cambio(I);
        elDe(id)?.scrollIntoView({ block: 'nearest' });
        if (txtDe(id)) enfocar(id, 'fin'); else seleccionar([id]);
    }

    // Bloque(s) → pendiente(s): uno por bloque con texto; el texto queda en el editor.
    function aPendiente(ids) {
        const I = insDeId(ids[0]);
        if (!I?.op.alPendiente) return;
        I.bloques.filter(b => ids.includes(b.id)).map(b => mdAPlano(b.x.replace(/<br>/g, ' ')).trim()).filter(Boolean)
            .reduce((cadena, t) => cadena.then(() => I.op.alPendiente(t)), Promise.resolve());
    }
    function menuGrupo(ids, asa) {
        const I = insDeId(ids[0]);
        abrirMenu([
            { ico: '⇄', lbl: 'Convertir en', sub: TIPOS.filter(x => x.t !== 'hr').map(x => ({ ico: x.ico, lbl: x.lbl, accion: () => convertirGrupo(ids, x.t) })) },
            ...(I?.op.alPendiente ? [{ ico: '☑', lbl: 'Convertir en pendientes', accion: () => aPendiente(ids) }] : []),
            { sep: true },
            { ico: '⧉', lbl: 'Duplicar', atajo: 'Ctrl+D', accion: () => duplicar(ids) },
            { ico: '🗑', lbl: 'Eliminar', atajo: 'Supr', peligro: true, accion: () => eliminar(ids) },
        ], asa, { titulo: `${ids.length} bloques`, alCerrar: () => seleccionar(ids), formato: { ids, txt: null, rango: null } });
        menuBloqueId = ids;
        ids.forEach(id => elDe(id)?.classList.add('eb-sel'));
    }

    // ── Selección de bloques (arrastrar fuera del texto, o de un bloque a otro) ──
    let seleccion = [];
    let marcando = null;
    function seleccionar(ids) {
        limpiarSeleccion();
        seleccion = ids.slice();
        seleccion.forEach(id => elDe(id)?.classList.add('eb-sel'));
        if (seleccion.length) { document.activeElement?.blur?.(); getSelection().removeAllRanges(); }
    }
    function limpiarSeleccion() {
        seleccion = [];
        document.querySelectorAll('.eb-blq.eb-sel').forEach(n => n.classList.remove('eb-sel'));
    }
    function teclaSeleccion(e) {
        if (document.activeElement?.closest?.('[contenteditable], input, textarea')) return false;
        const ids = seleccion.slice();
        const corta = () => { e.preventDefault(); e.stopPropagation(); return true; };
        if (e.key === 'Escape') { limpiarSeleccion(); return corta(); }
        if (e.key === 'Delete' || e.key === 'Backspace') { eliminar(ids); return corta(); }
        if ((e.ctrlKey || e.metaKey) && (e.key === 'd' || e.key === 'D')) { duplicar(ids); return corta(); }
        if ((e.ctrlKey || e.metaKey) && 'cCxX'.includes(e.key)) {
            const I = insDeId(ids[0]);
            navigator.clipboard?.writeText(mdAPlanoBloques(aTexto(I.bloques.filter(b => ids.includes(b.id))))).catch(() => {});
            if (e.key.toLowerCase() === 'x') eliminar(ids);
            return corta();
        }
        if (e.key === 'Enter') { const u = ids[ids.length - 1]; limpiarSeleccion(); enfocar(u, 'fin'); return corta(); }
        return false;
    }
    function bloquesEnRango(I, y1, y2) {
        return I.bloques.filter(b => { const el = elDe(b.id); if (!el) return false; const r = el.getBoundingClientRect(); return r.bottom >= y1 && r.top <= y2; }).map(b => b.id);
    }
    const enZona = el => [...zonas].some(z => z.contains(el));
    document.addEventListener('mousedown', e => {
        if (e.button !== 0 || e.target.closest('.eb-flot, .eb-asas, input, button, select, textarea, a, [data-eb-no-marco]')) return;
        const txt = e.target.closest('.eb[data-eb] .eb-txt');
        if (txt) { if (seleccion.length) limpiarSeleccion(); marcando = { x: e.clientX, y: e.clientY, desdeTexto: true, idInicio: txt.parentElement.dataset.id, I: insDe(txt) }; return; }
        if (e.target.closest('[contenteditable]') || !enZona(e.target)) { if (seleccion.length && !e.target.closest('.eb')) limpiarSeleccion(); return; }
        if (seleccion.length) limpiarSeleccion();
        marcando = { x: e.clientX, y: e.clientY, desdeTexto: false, activo: false };
    });
    document.addEventListener('mousemove', e => {
        if (!marcando) return;
        if (marcando.desdeTexto) {
            const sobre = document.elementFromPoint(e.clientX, e.clientY)?.closest('.eb-blq');
            if (!sobre || sobre.dataset.id === marcando.idInicio || insDe(sobre) !== marcando.I) {
                if (marcando.activo && sobre?.dataset.id === marcando.idInicio) seleccionar([marcando.idInicio]);
                return;
            }
            marcando.activo = true;
            document.body.classList.add('eb-marcando');
            const I = marcando.I, a = idx(I, marcando.idInicio), b = idx(I, sobre.dataset.id);
            seleccionar(I.bloques.slice(Math.min(a, b), Math.max(a, b) + 1).map(x => x.id));
            return;
        }
        const dx = e.clientX - marcando.x, dy = e.clientY - marcando.y;
        if (!marcando.activo && Math.hypot(dx, dy) < 5) return;
        if (!marcando.activo) { marcando.activo = true; document.body.classList.add('eb-marcando'); getSelection().removeAllRanges(); document.activeElement?.blur?.(); }
        const x1 = Math.min(e.clientX, marcando.x), y1 = Math.min(e.clientY, marcando.y);
        const x2 = x1 + Math.abs(dx), y2 = y1 + Math.abs(dy);
        Object.assign(F.marco.style, { display: 'block', left: x1 + 'px', top: y1 + 'px', width: Math.abs(dx) + 'px', height: Math.abs(dy) + 'px' });
        let I = marcando.I;
        if (!I) {
            for (const el of document.querySelectorAll('.eb[data-eb] .eb-blq')) {
                const r = el.getBoundingClientRect();
                if (r.bottom >= y1 && r.top <= y2 && r.right >= x1 && r.left - 60 <= x2 && enZona(el)) { I = marcando.I = insDe(el); break; }
            }
        }
        if (I) {
            const c = I.cont.querySelector('.eb-bloques').getBoundingClientRect();
            if (c.right >= x1 && c.left - 60 <= x2) seleccionar(bloquesEnRango(I, y1, y2)); else limpiarSeleccion();
        }
    });
    document.addEventListener('mouseup', () => {
        if (!marcando) return;
        if (F) F.marco.style.display = 'none';
        document.body.classList.remove('eb-marcando');
        marcando = null;
    });

    // ── Celular: barra de formato sobre el teclado (deuda BM) ──────────
    // Aparece mientras se escribe en un editor táctil: tipo de bloque, viñetas, casilla,
    // negrita/cursiva/subrayado, 3 colores y ⋯ (menú del bloque). Los botones no le quitan
    // el foco al texto (el teclado no se cierra). Se ubica justo encima del teclado.
    let BT = null, btTxt = null;
    function asegurarBarraTactil() {
        if (BT) return;
        BT = document.createElement('div');
        BT.id = 'eb-barra-tactil';
        BT.className = 'eb-flot';
        BT.innerHTML = `<button data-a="tipo" title="Tipo de bloque">Aa</button>
            <button data-a="ul" title="Viñetas">•</button>
            <button data-a="todo" title="Casilla">☑</button>
            <span class="eb-sep"></span>
            <button data-f="bold" title="Negrita"><b>B</b></button>
            <button data-f="italic" title="Cursiva"><i>I</i></button>
            <button data-f="underline" title="Subrayado"><u>U</u></button>
            <span class="eb-sep"></span>
            <button data-c="1" class="eb-col-a" title="Color normal">A</button>
            <button data-c="2" class="eb-col-a" style="color:var(--eb-c2)" title="Naranjo">A</button>
            <button data-c="3" class="eb-col-a" style="color:var(--eb-c3)" title="Azul">A</button>
            <span class="eb-sep"></span>
            <button data-a="menu" title="Más (mover, duplicar, eliminar)">⋯</button>`;
        document.body.appendChild(BT);
        // pointerdown sin seguir: el texto no pierde el foco y el teclado se queda abierto
        BT.addEventListener('pointerdown', e => e.preventDefault());
        BT.addEventListener('mousedown', e => e.preventDefault());
        BT.addEventListener('click', e => {
            const btn = e.target.closest('button');
            if (!btn || !btTxt || !btTxt.isConnected) return;
            const id = btTxt.parentElement.dataset.id, I = insDe(btTxt), b = I?.bloques[idx(I, id)];
            if (!b) return;
            if (btn.dataset.a === 'tipo') { menuTipos(id); return; }
            if (btn.dataset.a === 'menu') { menuBloque(id, btn); return; }
            if (btn.dataset.a) { convertir(id, b.t === btn.dataset.a ? 'p' : btn.dataset.a); return; }
            if (btn.dataset.f) { document.execCommand('styleWithCSS', false, false); document.execCommand(btn.dataset.f); estadoBarra(); return; }
            if (btn.dataset.c) {
                const c = +btn.dataset.c;
                if (getSelection().isCollapsed) { const off = cursorEn(btTxt); colorear([id], c); enfocar(id, off); }   // sin selección: todo el bloque
                else { document.execCommand('styleWithCSS', false, false); document.execCommand('foreColor', false, c === 1 ? '#000001' : COLOR_HEX[c]); }
            }
        });
        const ubicar = () => {
            if (BT.style.display === 'none') return;
            const vv = window.visualViewport;
            const abajo = vv ? vv.offsetTop + vv.height : innerHeight;
            BT.style.top = (abajo - BT.offsetHeight) + 'px';
            BT.style.left = (vv ? vv.offsetLeft : 0) + 'px';
            BT.style.width = (vv ? vv.width : innerWidth) + 'px';
        };
        BT.ubicar = ubicar;
        window.visualViewport?.addEventListener('resize', ubicar);
        window.visualViewport?.addEventListener('scroll', ubicar);
        document.addEventListener('focusin', e => {
            const t = e.target.closest?.('.eb-tactil .eb-blq .eb-txt');
            if (!t) return;
            btTxt = t;
            BT.style.display = 'flex';
            document.body.classList.add('eb-con-barra');
            ubicar(); estadoBarra();
        });
        document.addEventListener('focusout', () => setTimeout(() => {
            if (document.activeElement?.closest?.('.eb-tactil .eb-txt') || menuAbierto()) return;
            BT.style.display = 'none'; btTxt = null;
            document.body.classList.remove('eb-con-barra');
        }, 120));
        document.addEventListener('selectionchange', () => { if (btTxt) estadoBarra(); });
    }
    function estadoBarra() {
        if (!BT || !btTxt) return;
        ['bold', 'italic', 'underline'].forEach(f => BT.querySelector(`[data-f="${f}"]`).classList.toggle('eb-on', document.queryCommandState(f)));
        const I = insDe(btTxt), b = I?.bloques[idx(I, btTxt.parentElement?.dataset.id)];
        BT.querySelector('[data-a="ul"]').classList.toggle('eb-on', b?.t === 'ul');
        BT.querySelector('[data-a="todo"]').classList.toggle('eb-on', b?.t === 'todo');
        BT.ubicar?.();
    }

    window.EditorBloques = { crear, zona, html, aBloques, aTexto, mdAPlano, menu: abrirMenu, menuAbierto, cerrarMenus };
})();
