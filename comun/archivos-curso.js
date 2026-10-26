// ═══════════════════════════════════════════════════════════════════════
// 📁 ARCHIVOS DEL CURSO (deuda DQ, 2026-10-26)
// Documentos, audios, videos e imágenes de cada curso o taller, por año. Tabla `curso_archivos` + bucket público
// `curso-archivos` (supabase/curso_archivos.sql). Hoy los crea la guía QR de la Biblioteca (comun/compartir.js) y se
// suben a mano desde la ventana; se abren desde Cursos (botón 📁 Archivos).
//
//   ArchivosCurso.abrir({ sb, contextoId, ctxNombre })            → ventana con la lista del curso (año en curso)
//   ArchivosCurso.guardar(sb, { contextoId, nombre, archivo, mime, origen, descripcion })  → fila (+ url)
//   ArchivosCurso.url(fila) · ArchivosCurso.urlDescarga(fila)
// Requiere ../supabase/config.js (SUPABASE_URL) y, para el nombre del curso, ../supabase/contextos.js.
// ═══════════════════════════════════════════════════════════════════════
const ArchivosCurso = (() => {
    const BUCKET = 'curso-archivos';
    const ICONO  = { documento: '📄', audio: '🎧', video: '🎬', imagen: '🖼️', otro: '📎' };
    const anioActual = () => new Date().getFullYear();
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function tipoDe(mime) {
        const m = (mime || '').toLowerCase();
        if (m.startsWith('audio/')) return 'audio';
        if (m.startsWith('video/')) return 'video';
        if (m.startsWith('image/')) return 'imagen';
        if (m === 'application/pdf' || m.startsWith('text/') || /word|document|sheet|excel|presentation|powerpoint/.test(m)) return 'documento';
        return 'otro';
    }
    // Nombre seguro para la ruta en Storage (sin tildes ni espacios); el nombre visible va aparte, en la tabla.
    function limpio(nombre) {
        return String(nombre).normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'archivo';
    }
    const url = f => `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.storage_path.split('/').map(encodeURIComponent).join('/')}`;
    // Storage entrega el archivo como descarga (con su nombre) si se pide con ?download=
    const urlDescarga = f => url(f) + '?download=' + encodeURIComponent(f.nombre);
    function nombreCurso(ctxNombre) {
        return typeof ctxDisplay === 'function' ? ctxDisplay(ctxNombre) : (ctxNombre || '');
    }
    function tamTxt(b) {
        if (!b) return '';
        if (b < 1024 * 1024) return Math.max(1, Math.round(b / 1024)) + ' KB';
        return (b / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB';
    }
    function fechaTxt(ts) {
        const d = new Date(ts);
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    }
    // Mensaje humano si la tabla todavía no existe (falta correr el SQL).
    function errTxt(e) {
        const m = (e && (e.message || e.error || String(e))) || '';
        if (/curso_archivos|relation|does not exist|schema cache|Bucket not found/i.test(m))
            return 'Falta crear 📁 Archivos del curso en Supabase (correr supabase/curso_archivos.sql).';
        return 'No se pudo — revisa la conexión.';
    }

    async function guardar(sb, { contextoId, nombre, archivo, mime, origen = 'subido', descripcion = null }) {
        const anio = anioActual();
        const tipoMime = mime || archivo.type || 'application/octet-stream';
        const path = `${contextoId}/${anio}/${Date.now().toString(36)}-${limpio(nombre)}`;
        const up = await sb.storage.from(BUCKET).upload(path, archivo, { contentType: tipoMime, upsert: false });
        if (up.error) throw up.error;
        const fila = { contexto_id: contextoId, anio, nombre, tipo: tipoDe(tipoMime), mime: tipoMime,
                       storage_path: path, tamano: archivo.size ?? null, origen, descripcion };
        const { data, error } = await sb.from('curso_archivos').insert(fila).select().single();
        if (error) { await sb.storage.from(BUCKET).remove([path]); throw error; }
        return { ...data, url: url(data) };
    }
    async function listar(sb, contextoId, anio = anioActual()) {
        const { data, error } = await sb.from('curso_archivos').select('*')
            .eq('contexto_id', contextoId).eq('anio', anio).order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    }
    async function borrar(sb, fila) {
        const { error } = await sb.from('curso_archivos').delete().eq('id', fila.id);
        if (error) throw error;
        await sb.storage.from(BUCKET).remove([fila.storage_path]);
    }

    // ── Ventana ─────────────────────────────────────────────────────────
    let capa = null, op = null;
    function cerrar() { capa?.remove(); capa = null; op = null; document.removeEventListener('keydown', alTeclear, true); }
    function alTeclear(e) { if (e.key === 'Escape') { e.stopPropagation(); cerrar(); } }

    async function abrir(opciones) {
        cerrar();
        op = opciones;
        capa = document.createElement('div');
        capa.className = 'arc-capa';
        capa.innerHTML = `
            <div class="arc-caja" role="dialog" aria-label="Archivos del curso">
                <div class="arc-cab">
                    <div class="arc-tit">📁 Archivos del curso · ${esc(nombreCurso(op.ctxNombre))} <span class="arc-anio">${anioActual()}</span></div>
                    <label class="arc-subir" title="Subir documentos, audios, videos o imágenes a este curso">＋ Subir archivo
                        <input type="file" multiple hidden></label>
                    <button class="arc-x" title="Cerrar (Esc)">✕</button>
                </div>
                <div class="arc-estado"></div>
                <div class="arc-lista"><div class="arc-vacio">Cargando…</div></div>
            </div>`;
        document.body.appendChild(capa);
        capa.addEventListener('mousedown', e => { if (e.target === capa) cerrar(); });
        capa.querySelector('.arc-x').addEventListener('click', cerrar);
        capa.querySelector('input[type=file]').addEventListener('change', e => subir([...e.target.files]));
        document.addEventListener('keydown', alTeclear, true);
        await refrescar();
    }
    function estado(txt, err) {
        const el = capa?.querySelector('.arc-estado');
        if (!el) return;
        el.textContent = txt || '';
        el.classList.toggle('err', !!err);
    }
    async function refrescar() {
        if (!capa) return;
        const lista = capa.querySelector('.arc-lista');
        let filas;
        try { filas = await listar(op.sb, op.contextoId); }
        catch (e) { lista.innerHTML = ''; estado(errTxt(e), true); return; }
        if (!capa) return;
        if (!filas.length) {
            lista.innerHTML = '<div class="arc-vacio">Todavía no hay archivos. Las guías QR de la Biblioteca llegan aquí solas; también puedes subir archivos con ＋.</div>';
            return;
        }
        lista.innerHTML = filas.map(f => `
            <div class="arc-fila" data-id="${f.id}">
                <span class="arc-ico">${ICONO[f.tipo] || ICONO.otro}</span>
                <span class="arc-nom" title="${esc(f.nombre)}">${esc(f.nombre)}</span>
                <span class="arc-meta">${fechaTxt(f.created_at)}${f.tamano ? ' · ' + tamTxt(f.tamano) : ''}</span>
                <a class="arc-btn arc-abrir" href="${esc(url(f))}" target="_blank" rel="noopener" title="Abrir (para mirar o imprimir)">Abrir</a>
                <a class="arc-btn" href="${esc(urlDescarga(f))}" title="Descargar">⬇</a>
                <button class="arc-btn arc-borrar" title="Borrar este archivo">🗑</button>
            </div>`).join('');
        lista.querySelectorAll('.arc-borrar').forEach(b => b.addEventListener('click', async () => {
            const f = filas.find(x => x.id === b.closest('.arc-fila').dataset.id);
            if (!f || !confirm(`¿Borrar "${f.nombre}"? No se puede deshacer.`)) return;
            try { await borrar(op.sb, f); estado(''); refrescar(); }
            catch (e) { estado(errTxt(e), true); }
        }));
    }
    async function subir(archivos) {
        if (!archivos.length || !op) return;
        for (const [i, a] of archivos.entries()) {
            estado(`Subiendo ${archivos.length > 1 ? `${i + 1} de ${archivos.length}` : a.name}…`);
            try { await guardar(op.sb, { contextoId: op.contextoId, nombre: a.name, archivo: a, mime: a.type, origen: 'subido' }); }
            catch (e) { estado(errTxt(e), true); return; }
        }
        estado('');
        const inp = capa?.querySelector('input[type=file]');
        if (inp) inp.value = '';
        refrescar();
    }

    return { abrir, cerrar, guardar, listar, borrar, url, urlDescarga, tipoDe, BUCKET };
})();
