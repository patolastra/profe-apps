// ═══════════════════════════════════════════════════════════════════════
// ✈ COMPARTIR UN RECURSO CON LOS ESTUDIANTES (deuda DQ, 2026-10-26)
// Menú propio de Profe Apps (no la ventana de compartir del sistema, que en los computadores del colegio no hace QR):
//   · Copiar link
//   · Generar QR        → el QR grande, para proyectar o descargar como imagen
//   · Generar guía QR   → PDF hoja carta con QR recortables (5 × 6 = 30 por hoja) para un curso; los datos de cada QR
//                          (canción, instrumento, curso, fecha de evaluación) se eligen al crearla, más un mensaje.
//                          La guía se guarda en 📁 Archivos del curso (comun/archivos-curso.js) y se abre con "Abrir".
//
//   Compartir.abrir(boton, { url, titulo, cancion, instrumento, sb })
//   Compartir.ICONO  → el avioncito de papel (SVG) para el botón
// Librerías (cdnjs, se cargan solo al usarlas): qrcode-generator (QR) y jsPDF (PDF).
// ═══════════════════════════════════════════════════════════════════════
const Compartir = (() => {
    const ICONO = '<svg class="cmp-ico" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4 20-7z"/></svg>';
    const LIB_QR  = 'https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js';
    const LIB_PDF = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    const LS_GUIA = 'profe_guia_qr_opciones';
    // Cursos y talleres en el orden de siempre; el texto que va impreso en la guía (sin emojis: el PDF no los dibuja).
    const ORDEN = ['PRIMERO', 'SEGUNDO', 'TERCERO', 'CUARTO', 'QUINTO', 'SEXTO', 'SEPTIMO', 'OCTAVO', 'CUERDAS', 'CASTIGADAS', 'KIDS CASTIGADAS'];
    const CURSO_IMPRESO = { PRIMERO: '1° básico', SEGUNDO: '2° básico', TERCERO: '3° básico', CUARTO: '4° básico',
        QUINTO: '5° básico', SEXTO: '6° básico', SEPTIMO: '7° básico', OCTAVO: '8° básico' };
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    // Texto apto para el PDF (fuente estándar): sin emojis ni símbolos fuera del español.
    const pdfTxt = s => String(s ?? '').replace(/[^ -ÿ–—’“”]/g, '').replace(/\s+/g, ' ').trim();

    const cargas = {};
    function cargar(src) {
        return cargas[src] ||= new Promise((ok, mal) => {
            const s = document.createElement('script');
            s.src = src; s.onload = ok;
            s.onerror = () => { delete cargas[src]; mal(new Error('sin conexión')); };
            document.head.appendChild(s);
        });
    }
    async function qr(texto) {
        if (!window.qrcode) await cargar(LIB_QR);
        const q = window.qrcode(0, 'M');
        q.addData(texto);
        q.make();
        return q;
    }
    // QR en un canvas (con su margen blanco de 4 módulos, el que piden los lectores).
    function qrCanvas(q, px) {
        const n = q.getModuleCount(), tot = n + 8, m = Math.max(1, Math.floor(px / tot));
        const c = document.createElement('canvas');
        c.width = c.height = tot * m;
        const g = c.getContext('2d');
        g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
        g.fillStyle = '#000';
        for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect((k + 4) * m, (r + 4) * m, m, m);
        return c;
    }
    function nombreArchivo(s) { return String(s).replace(/[\\/:*?"<>|]+/g, '-').trim(); }
    function hoyISO() { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
    function fechaCorta(iso) { const [a, m, d] = iso.split('-'); return `${+d}/${+m}/${a}`; }
    async function copiar(texto) {
        try { await navigator.clipboard.writeText(texto); return true; }
        catch (_) {
            const t = document.createElement('textarea');
            t.value = texto; t.style.cssText = 'position:fixed;opacity:0';
            document.body.appendChild(t); t.select();
            let ok = false;
            try { ok = document.execCommand('copy'); } catch (_) {}
            t.remove();
            return ok;
        }
    }
    function aviso(txt) {
        const el = document.createElement('div');
        el.className = 'cmp-aviso'; el.textContent = txt;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 2200);
    }

    // ── Menú ────────────────────────────────────────────────────────────
    let menu = null;
    function cerrarMenu() { menu?.remove(); menu = null; document.removeEventListener('mousedown', fueraMenu, true); }
    function fueraMenu(e) { if (menu && !menu.contains(e.target)) cerrarMenu(); }
    function abrir(boton, op) {
        if (menu) { const mismo = menu._boton === boton; cerrarMenu(); if (mismo) return; }
        menu = document.createElement('div');
        menu.className = 'cmp-menu';
        menu._boton = boton;
        menu.innerHTML = `
            <button data-a="link">🔗 Copiar link</button>
            <button data-a="qr">▦ Generar QR</button>
            <button data-a="guia">🖨️ Generar guía QR</button>`;
        document.body.appendChild(menu);
        const r = boton.getBoundingClientRect(), w = menu.offsetWidth, h = menu.offsetHeight;
        menu.style.left = Math.max(8, Math.min(r.right - w, innerWidth - w - 8)) + 'px';
        menu.style.top  = (r.bottom + h + 6 > innerHeight ? r.top - h - 4 : r.bottom + 4) + 'px';
        menu.addEventListener('click', async e => {
            const a = e.target.closest('button')?.dataset.a;
            if (!a) return;
            cerrarMenu();
            if (a === 'link') aviso(await copiar(op.url) ? 'Link copiado' : 'No se pudo copiar el link');
            if (a === 'qr') verQR(op);
            if (a === 'guia') guia(op);
        });
        setTimeout(() => document.addEventListener('mousedown', fueraMenu, true));
    }

    // ── Ventanas ────────────────────────────────────────────────────────
    let capa = null;
    function cerrarCapa() { capa?.remove(); capa = null; document.removeEventListener('keydown', escCapa, true); }
    function escCapa(e) { if (e.key === 'Escape') { e.stopPropagation(); cerrarCapa(); } }
    function nuevaCapa(html) {
        cerrarCapa();
        capa = document.createElement('div');
        capa.className = 'cmp-capa';
        capa.innerHTML = `<div class="cmp-caja" role="dialog">${html}</div>`;
        document.body.appendChild(capa);
        capa.addEventListener('mousedown', e => { if (e.target === capa) cerrarCapa(); });
        capa.querySelectorAll('.cmp-x').forEach(b => b.addEventListener('click', cerrarCapa));
        document.addEventListener('keydown', escCapa, true);
        return capa.firstElementChild;
    }

    async function verQR(op) {
        const caja = nuevaCapa(`
            <div class="cmp-cab"><div class="cmp-tit">${esc(op.titulo)}</div><button class="cmp-x" title="Cerrar (Esc)">✕</button></div>
            <div class="cmp-qr"><div class="cmp-cargando">Generando QR…</div></div>
            <div class="cmp-link" title="${esc(op.url)}">${esc(op.url)}</div>
            <div class="cmp-acciones">
                <button class="cmp-btn" data-a="link">🔗 Copiar link</button>
                <button class="cmp-btn cmp-prim" data-a="png">⬇ Descargar imagen</button>
            </div>`);
        let c;
        try { c = qrCanvas(await qr(op.url), 640); }
        catch (e) { caja.querySelector('.cmp-qr').innerHTML = '<div class="cmp-cargando err">No se pudo generar el QR (sin conexión).</div>'; return; }
        if (!capa || capa.firstElementChild !== caja) return;
        c.className = 'cmp-qr-canvas';
        caja.querySelector('.cmp-qr').replaceChildren(c);
        caja.querySelector('[data-a=link]').addEventListener('click', async () => aviso(await copiar(op.url) ? 'Link copiado' : 'No se pudo copiar el link'));
        caja.querySelector('[data-a=png]').addEventListener('click', () => {
            const a = document.createElement('a');
            a.href = c.toDataURL('image/png');
            a.download = nombreArchivo(`QR · ${op.titulo}.png`);
            a.click();
        });
    }

    // ── Guía QR ─────────────────────────────────────────────────────────
    async function cursosConCantidad(sb) {
        const { data, error } = await sb.from('contextos').select('id, nombre, tipo, activo');
        if (error) throw error;
        const pos = n => { const i = ORDEN.indexOf(n); return i < 0 ? 99 : i; };
        return (data || []).filter(c => (c.tipo === 'curso' || c.tipo === 'taller') && c.activo !== false)
            .sort((a, b) => pos(a.nombre) - pos(b.nombre) || a.nombre.localeCompare(b.nombre));
    }
    let anioLibro;   // id del año activo del Libro (para contar estudiantes)
    async function cantidadEstudiantes(sb, ctx) {
        try {
            if (anioLibro === undefined) {
                const { data } = await sb.from('libro_anios').select('id').eq('activo', true).maybeSingle();
                anioLibro = data?.id || null;
            }
            if (!anioLibro) return null;
            const q = ctx.tipo === 'curso'
                ? sb.from('libro_matriculas').select('id', { count: 'exact', head: true }).eq('anio_id', anioLibro).eq('contexto_id', ctx.id).eq('estado', 'activo')
                : sb.from('libro_pertenencias_taller').select('id', { count: 'exact', head: true }).eq('anio_id', anioLibro).eq('contexto_id', ctx.id);
            const { count, error } = await q;
            return error ? null : count;
        } catch (_) { return null; }
    }
    function leerOpciones() {
        try { return JSON.parse(localStorage.getItem(LS_GUIA)) || {}; } catch (_) { return {}; }
    }
    function guardarOpciones(o) { try { localStorage.setItem(LS_GUIA, JSON.stringify(o)); } catch (_) {} }

    async function guia(op) {
        const prev = leerOpciones();
        const marca = (k, def) => (prev[k] ?? def) ? 'checked' : '';
        const caja = nuevaCapa(`
            <div class="cmp-cab"><div class="cmp-tit">🖨️ Guía QR · ${esc(op.titulo)}</div><button class="cmp-x" title="Cerrar (Esc)">✕</button></div>
            <div class="cmp-form">
                <label class="cmp-campo"><span>Curso</span><select class="cmp-curso"><option>Cargando…</option></select></label>
                <label class="cmp-campo"><span>Copias</span><input class="cmp-copias" type="number" min="1" max="300" value="30">
                    <small class="cmp-nota"></small></label>
                <div class="cmp-campo"><span>Escrito bajo cada QR</span>
                    <div class="cmp-datos">
                        <label><input type="checkbox" data-d="cancion" ${marca('cancion', true)}> Canción</label>
                        <label><input type="checkbox" data-d="instrumento" ${marca('instrumento', true)}> Instrumento</label>
                        <label><input type="checkbox" data-d="curso" ${marca('curso', true)}> Curso</label>
                        <label><input type="checkbox" data-d="fecha" ${marca('fecha', false)}> Fecha de evaluación
                            <input class="cmp-fecha" type="date" value="${esc(prev.fechaValor || '')}"></label>
                    </div>
                </div>
                <label class="cmp-campo"><span>Mensaje <small>(opcional)</small></span>
                    <textarea class="cmp-msj" rows="2" maxlength="140" placeholder="Por ejemplo: Practica 10 minutos cada día">${esc(prev.mensaje || '')}</textarea></label>
            </div>
            <div class="cmp-resultado"></div>
            <div class="cmp-acciones">
                <button class="cmp-btn cmp-x">Cancelar</button>
                <button class="cmp-btn cmp-prim cmp-generar" disabled>Generar guía</button>
            </div>`);
        const $ = s => caja.querySelector(s);
        const fecha = $('.cmp-fecha'), chkFecha = caja.querySelector('[data-d=fecha]');
        const pintarFecha = () => { fecha.disabled = !chkFecha.checked; };
        chkFecha.addEventListener('change', () => { pintarFecha(); if (chkFecha.checked && !fecha.value) fecha.focus(); });
        fecha.addEventListener('input', () => { if (fecha.value) chkFecha.checked = true; });
        pintarFecha();

        let cursos = [];
        try { cursos = await cursosConCantidad(op.sb); }
        catch (e) { $('.cmp-resultado').innerHTML = '<div class="cmp-err">No se pudieron cargar los cursos — revisa la conexión.</div>'; return; }
        if (!capa || capa.firstElementChild !== caja) return;
        const sel = $('.cmp-curso');
        const visible = n => (typeof ctxDisplay === 'function' ? ctxDisplay(n) : n);
        sel.innerHTML = '<option value="">Elige el curso…</option>' +
            cursos.map(c => `<option value="${c.id}">${esc(visible(c.nombre))}</option>`).join('');
        if (prev.cursoId && cursos.some(c => c.id === prev.cursoId)) sel.value = prev.cursoId;
        const btn = $('.cmp-generar');
        const alCambiarCurso = async () => {
            const ctx = cursos.find(c => c.id === sel.value);
            btn.disabled = !ctx;
            $('.cmp-nota').textContent = '';
            if (!ctx) return;
            const n = await cantidadEstudiantes(op.sb, ctx);
            if (sel.value !== ctx.id) return;
            if (n) { $('.cmp-copias').value = n; $('.cmp-nota').textContent = `${n} estudiantes en el curso`; }
        };
        sel.addEventListener('change', alCambiarCurso);
        alCambiarCurso();

        btn.addEventListener('click', async () => {
            const ctx = cursos.find(c => c.id === sel.value);
            if (!ctx) return;
            const copias = Math.max(1, Math.min(300, parseInt($('.cmp-copias').value, 10) || 1));
            const datos = {};
            caja.querySelectorAll('[data-d]').forEach(ch => { datos[ch.dataset.d] = ch.checked; });
            if (datos.fecha && !fecha.value) { fecha.focus(); return; }
            const mensaje = $('.cmp-msj').value.trim();
            guardarOpciones({ ...datos, fechaValor: fecha.value, mensaje, cursoId: ctx.id });
            btn.disabled = true;
            const res = $('.cmp-resultado');
            res.innerHTML = '<div class="cmp-cargando">Armando la guía…</div>';
            let blob, nombre;
            try {
                const lineas = [];
                if (datos.cancion && op.cancion) lineas.push({ t: op.cancion, b: true });
                if (datos.instrumento && op.instrumento) lineas.push({ t: op.instrumento });
                if (datos.curso) lineas.push({ t: CURSO_IMPRESO[ctx.nombre] || (typeof ctxNombreVisible === 'function' ? ctxNombreVisible(ctx.nombre) : ctx.nombre) });
                if (datos.fecha) lineas.push({ t: 'Evaluación: ' + fechaCorta(fecha.value) });
                blob = await armarPDF(op.url, lineas, mensaje, copias);
                nombre = nombreArchivo(`Guía QR · ${op.titulo} · ${typeof ctxNombreVisible === 'function' ? ctxNombreVisible(ctx.nombre) : ctx.nombre} · ${hoyISO()}.pdf`);
            } catch (e) {
                res.innerHTML = `<div class="cmp-err">No se pudo armar la guía (${esc(e.message || 'sin conexión')}).</div>`;
                btn.disabled = false;
                return;
            }
            const local = URL.createObjectURL(blob);
            let fila = null, errGuardar = null;
            if (typeof ArchivosCurso !== 'undefined' && op.sb) {
                res.innerHTML = '<div class="cmp-cargando">Guardando en 📁 Archivos del curso…</div>';
                try { fila = await ArchivosCurso.guardar(op.sb, { contextoId: ctx.id, nombre, archivo: blob, mime: 'application/pdf', origen: 'guia-qr', descripcion: op.url }); }
                catch (e) { errGuardar = e; }
            }
            if (!capa || capa.firstElementChild !== caja) return;
            const hojas = Math.ceil(copias / 30);
            res.innerHTML = `
                <div class="${fila ? 'cmp-ok' : 'cmp-err'}">${fila
                    ? `✓ Guardada en 📁 Archivos del curso · ${esc(visible(ctx.nombre))}`
                    : 'No se pudo guardar en 📁 Archivos del curso' + (errGuardar && /curso_archivos|does not exist|schema cache|Bucket not found/i.test(errGuardar.message || '') ? ' (falta crearlo en Supabase)' : ' (revisa la conexión)') + '; igual puedes abrirla o descargarla.'}</div>
                <div class="cmp-mini">${copias} QR · ${hojas} hoja${hojas > 1 ? 's' : ''} carta</div>`;
            const acc = caja.querySelector('.cmp-acciones');
            acc.innerHTML = `
                <a class="cmp-btn" href="${local}" download="${esc(nombre)}">⬇ Descargar</a>
                <a class="cmp-btn cmp-prim" href="${esc(fila ? fila.url : local)}" target="_blank" rel="noopener">Abrir</a>`;
        });
    }

    // PDF hoja carta: 5 columnas × 6 filas de QR recortables (líneas de corte punteadas); más copias → más hojas.
    async function armarPDF(url, lineas, mensaje, copias) {
        const q = await qr(url);
        if (!window.jspdf) await cargar(LIB_PDF);
        const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'letter' });
        const W = 215.9, H = 279.4, M = 7, COLS = 5, ROWS = 6;
        const cw = (W - 2 * M) / COLS, ch = (H - 2 * M) / ROWS;
        const FS = 7.5, LH = 3.1, PAD = 2;
        doc.setFontSize(FS);
        // Texto de cada QR: datos elegidos (una línea cada uno, cortados si no caben) + mensaje (hasta 3 líneas).
        const filas = [];
        lineas.forEach(l => {
            doc.setFont('helvetica', l.b ? 'bold' : 'normal');
            const t = pdfTxt(l.t);
            if (t) filas.push({ t: doc.splitTextToSize(t, cw - 2 * PAD)[0], b: l.b });
        });
        if (mensaje) {
            doc.setFont('helvetica', 'italic');
            doc.splitTextToSize(pdfTxt(mensaje), cw - 2 * PAD).slice(0, 3).forEach(t => filas.push({ t, i: true }));
        }
        const altoTexto = filas.length ? filas.length * LH + 1 : 0;
        const lado = Math.min(cw - 2 * PAD, ch - 2 * PAD - altoTexto);
        const img = qrCanvas(q, 600).toDataURL('image/png');
        for (let i = 0; i < copias; i++) {
            const k = i % (COLS * ROWS);
            if (i > 0 && k === 0) doc.addPage();
            const x0 = M + (k % COLS) * cw, y0 = M + Math.floor(k / COLS) * ch;
            doc.setDrawColor(175); doc.setLineWidth(0.2); doc.setLineDashPattern([1.2, 1.2], 0);
            doc.rect(x0, y0, cw, ch);
            const bloque = lado + altoTexto, top = y0 + (ch - bloque) / 2;
            doc.addImage(img, 'PNG', x0 + (cw - lado) / 2, top, lado, lado, 'qr', 'FAST');
            filas.forEach((f, j) => {
                doc.setFont('helvetica', f.b ? 'bold' : f.i ? 'italic' : 'normal');
                doc.setTextColor(f.i ? 70 : 20);
                doc.text(f.t, x0 + cw / 2, top + lado + 1 + LH * (j + 0.75), { align: 'center' });
            });
        }
        return doc.output('blob');
    }

    return { abrir, ICONO, cerrar: () => { cerrarMenu(); cerrarCapa(); } };
})();
