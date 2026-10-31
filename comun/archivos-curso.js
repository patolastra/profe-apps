// ═══════════════════════════════════════════════════════════════════════
// 📁 ARCHIVOS DEL CURSO = MEDIOS DEL CURSO (deudas DQ y DU)
// Documentos, audios, videos, fotos y enlaces (YouTube / Drive) de cada curso o taller, por año. Tabla `curso_archivos`
// + bucket público `curso-archivos` (supabase/curso_archivos.sql + supabase/medios.sql). Cada uno puede ligarse
// además a una canción de la Biblioteca, a una clase (fecha), a un uso en la canción (Extracto · Versión) y, en las
// versiones, a estudiantes (esas nunca se comparten). Llegan: la guía QR de la Biblioteca (comun/compartir.js), el
// 📷 Subir del celular (MOVIL/subir.html) y la ventana de aquí (＋ Subir, arrastrar, ＋ Enlace); se abren desde Cursos.
//
//   ArchivosCurso.abrir({ sb, contextoId, ctxNombre })            → ventana con la lista del curso (año en curso);
//       tocar el nombre de una foto, audio o video lo muestra / reproduce ahí mismo (deuda EJ; también en el celular)
//   ArchivosCurso.guardar(sb, { contextoId, nombre, archivo, mime, origen, descripcion, cancionId, sesionId, fecha, uso })
//   ArchivosCurso.guardarEnlace(sb, { contextoId, nombre, url, cancionId, sesionId, fecha, uso })   → fila (+ url)
//   ArchivosCurso.prepararImagen(file) → la foto achicada (máx. 1920 px, JPEG) para no llenar el espacio
//   ArchivosCurso.url(fila) · ArchivosCurso.urlDescarga(fila) · ArchivosCurso.esEnlace(url) · MAX_BYTES
// Requiere ../supabase/config.js (SUPABASE_URL) y, para el nombre del curso, ../supabase/contextos.js.
// ═══════════════════════════════════════════════════════════════════════
const ArchivosCurso = (() => {
    const BUCKET = 'curso-archivos';
    const MAX_BYTES = 50 * 1024 * 1024;   // límite por archivo del plan gratis de Supabase
    const ICONO  = { documento: '📄', audio: '🎧', video: '🎬', imagen: '🖼️', otro: '📎' };
    const USO    = { extracto: 'Extracto', version: 'Versión' };
    const anioActual = () => new Date().getFullYear();
    const hoyISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function tipoDe(mime) {
        const m = (mime || '').toLowerCase();
        if (m.startsWith('audio/')) return 'audio';
        if (m.startsWith('video/')) return 'video';
        if (m.startsWith('image/')) return 'imagen';
        if (m === 'application/pdf' || m.startsWith('text/') || /word|document|sheet|excel|presentation|powerpoint/.test(m)) return 'documento';
        return 'otro';
    }
    // Un enlace aceptado como video externo (YouTube o Google Drive).
    const esEnlace = u => /^https?:\/\/(www\.|m\.)?(youtube\.com|youtu\.be|drive\.google\.com)\//i.test(String(u || '').trim());
    // Nombre seguro para la ruta en Storage (sin tildes ni espacios); el nombre visible va aparte, en la tabla.
    // La extensión (.pdf, .mp3…) se conserva aunque el nombre se corte por largo.
    function limpio(nombre) {
        const s = String(nombre).normalize('NFD').replace(/[̀-ͯ]/g, '');
        const ext = (s.match(/\.[a-zA-Z0-9]{1,5}$/) || [''])[0];
        const base = s.slice(0, s.length - ext.length)
            .replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 80) || 'archivo';
        return base + ext.toLowerCase();
    }
    const url = f => f.url || `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${f.storage_path.split('/').map(encodeURIComponent).join('/')}`;
    // Storage entrega el archivo como descarga (con su nombre) si se pide con ?download=; un enlace se abre tal cual.
    const urlDescarga = f => f.url || (url(f) + '?download=' + encodeURIComponent(f.nombre));
    function nombreCurso(ctxNombre) {
        return typeof ctxDisplay === 'function' ? ctxDisplay(ctxNombre) : (ctxNombre || '');
    }
    function tamTxt(b) {
        if (!b) return '';
        if (b < 1024 * 1024) return Math.max(1, Math.round(b / 1024)) + ' KB';
        return (b / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB';
    }
    function fechaTxt(iso) {
        const d = /^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? new Date(iso + 'T12:00:00') : new Date(iso);
        return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
    }
    // Mensaje humano si falta crear la tabla o sus columnas nuevas (falta correr un SQL).
    function errTxt(e) {
        const m = (e && (e.message || e.error || String(e))) || '';
        if (/cancion_id|sesion_id|uso|estudiantes|column/i.test(m) && !/curso_archivos"? does not exist/i.test(m))
            return 'Falta actualizar 📁 Archivos del curso en Supabase (correr supabase/medios.sql).';
        if (/curso_archivos|relation|does not exist|schema cache|Bucket not found/i.test(m))
            return 'Falta crear 📁 Archivos del curso en Supabase (correr supabase/curso_archivos.sql).';
        if (/exceeded|too large|maximum allowed size|413/i.test(m)) return 'El archivo es demasiado grande (máximo 50 MB).';
        return 'No se pudo — revisa la conexión.';
    }

    // Foto del celular (3–8 MB) → JPEG de hasta 1920 px (~0,3–0,6 MB). Si no se puede, va tal cual.
    async function prepararImagen(file) {
        if (!/^image\/(jpeg|png|webp|heic|heif)/i.test(file.type) || file.size < 900 * 1024) return file;
        try {
            const bmp = await createImageBitmap(file);
            const k = Math.min(1, 1920 / Math.max(bmp.width, bmp.height));
            const c = document.createElement('canvas');
            c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
            c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
            const blob = await new Promise(ok => c.toBlob(ok, 'image/jpeg', 0.85));
            if (!blob || blob.size >= file.size) return file;
            return new File([blob], file.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' });
        } catch (_) { return file; }
    }

    // Columnas de medios (DU): solo se mandan si tienen valor, así lo de antes sigue andando sin medios.sql.
    function extras({ cancionId, sesionId, fecha, uso, estudiantes, parte } = {}) {
        const x = {};
        if (parte) x.parte = parte;
        if (cancionId) x.cancion_id = cancionId;
        if (sesionId) x.sesion_id = sesionId;
        if (fecha) x.fecha = fecha;
        if (uso) x.uso = uso;
        if (estudiantes && estudiantes.length) x.estudiantes = estudiantes;
        return x;
    }
    async function guardar(sb, { contextoId, nombre, archivo, mime, origen = 'subido', descripcion = null, ...resto }) {
        if (archivo.size > MAX_BYTES) throw new Error('too large');
        const anio = anioActual();
        const tipoMime = mime || archivo.type || 'application/octet-stream';
        const path = `${contextoId || 'sin-curso'}/${anio}/${Date.now().toString(36)}-${limpio(nombre)}`;   // sin curso: solo de la canción (FC)
        const up = await sb.storage.from(BUCKET).upload(path, archivo, { contentType: tipoMime, upsert: false });
        if (up.error) throw up.error;
        const fila = { contexto_id: contextoId || null, anio, nombre, tipo: tipoDe(tipoMime), mime: tipoMime,
                       storage_path: path, tamano: archivo.size ?? null, origen, descripcion, ...extras(resto) };
        const { data, error } = await sb.from('curso_archivos').insert(fila).select().single();
        if (error) { await sb.storage.from(BUCKET).remove([path]); throw error; }
        return { ...data, url: url(data) };
    }
    async function guardarEnlace(sb, { contextoId, nombre, url: enlace, origen = 'enlace', ...resto }) {
        const fila = { contexto_id: contextoId || null, anio: anioActual(), nombre, tipo: 'video', mime: null,
                       storage_path: null, url: String(enlace).trim(), origen, ...extras(resto) };
        const { data, error } = await sb.from('curso_archivos').insert(fila).select().single();
        if (error) throw error;
        return data;
    }
    async function listar(sb, contextoId, anio = anioActual()) {
        let r = await sb.from('curso_archivos').select('*, repertorio_canciones(nombre)')
            .eq('contexto_id', contextoId).eq('anio', anio).order('created_at', { ascending: false });
        if (r.error && /repertorio_canciones|relationship/i.test(r.error.message || ''))   // sin medios.sql: sin la canción
            r = await sb.from('curso_archivos').select('*').eq('contexto_id', contextoId).eq('anio', anio).order('created_at', { ascending: false });
        if (r.error) throw r.error;
        return r.data || [];
    }
    async function borrar(sb, fila) {
        const { error } = await sb.from('curso_archivos').delete().eq('id', fila.id);
        if (error) throw error;
        if (fila.storage_path) await sb.storage.from(BUCKET).remove([fila.storage_path]);
    }

    // Canciones de la Biblioteca (para ligar) y estudiantes del curso (para las versiones), una vez por ventana.
    let canciones = null, estudiantesCurso = null;
    async function cargarCanciones(sb) {
        if (canciones) return canciones;
        const { data } = await sb.from('repertorio_canciones').select('id, nombre, artista').order('nombre');
        return (canciones = data || []);
    }
    async function cargarEstudiantes(sb, contextoId) {
        if (estudiantesCurso?.ctx === contextoId) return estudiantesCurso.lista;
        let lista = [];
        try {
            const { data: an } = await sb.from('libro_anios').select('id').eq('activo', true).maybeSingle();
            const { data: ctx } = await sb.from('contextos').select('tipo').eq('id', contextoId).maybeSingle();
            if (an && ctx) {
                const sel = 'estudiante:libro_estudiantes(id, nombre, apellido, nombre_social)';
                const { data } = ctx.tipo === 'taller'
                    ? await sb.from('libro_pertenencias_taller').select(sel).eq('anio_id', an.id).eq('contexto_id', contextoId)
                    : await sb.from('libro_matriculas').select(sel).eq('anio_id', an.id).eq('contexto_id', contextoId).eq('estado', 'activo');
                lista = (data || []).map(x => x.estudiante).filter(Boolean)
                    .map(e => ({ id: e.id, nombre: `${e.nombre_social || e.nombre} ${(e.apellido || '').split(' ')[0]}`.trim() }))
                    .sort((a, b) => a.nombre.localeCompare(b.nombre));
            }
        } catch (_) {}
        estudiantesCurso = { ctx: contextoId, lista };
        return lista;
    }

    // Partes de una canción para anotar un extracto (deuda DW), en el orden de la canción: secciones de sus tablaturas,
    // estrofas de la letra ("Estrofa 2 — «primer verso…»") y nombres comunes. Se usan como sugerencias (se puede
    // escribir otra) y para ordenar los extractos.
    const PARTES_COMUNES = ['Intro', 'Estrofa', 'Coro', 'Puente', 'Instrumental', 'Final'];
    async function partesDeCancion(sb, cancionId) {
        const partes = [];
        const sumar = p => { p = String(p || '').trim(); if (p && !partes.some(x => x.toLowerCase() === p.toLowerCase())) partes.push(p); };
        if (cancionId) {
            try {
                const { data } = await sb.from('repertorio_assets').select('tipo, contenido, tab_sync, orden')
                    .eq('cancion_id', cancionId).in('tipo', ['tab', 'letra']).order('orden');
                (data || []).filter(a => a.tipo === 'tab').forEach(a => (a.tab_sync?.secciones || []).forEach(s => sumar(s.nombre)));
                const letra = (data || []).find(a => a.tipo === 'letra')?.contenido || '';
                const estrofas = letra.replace(/\[\d+:\d+(\.\d+)?\]/g, '').split(/\n\s*\n/).map(e => e.split('\n').map(v => v.trim()).filter(Boolean))
                    .filter(e => e.length && !(e.length === 1 && e[0] === e[0].toUpperCase()));   // fuera el título (una línea en mayúsculas)
                estrofas.forEach((e, i) => sumar(`Estrofa ${i + 1} — «${e[0].length > 40 ? e[0].slice(0, 40) + '…' : e[0]}»`));
            } catch (_) {}
        }
        PARTES_COMUNES.forEach(sumar);
        return partes;
    }

    // ── Ventana ─────────────────────────────────────────────────────────
    let capa = null, op = null, filas = [], editando = null, viendo = null;
    function cerrar() { capa?.remove(); capa = null; op = null; editando = null; viendo = null; document.removeEventListener('keydown', alTeclear, true); }
    const sePuedeVer = f => !f.url && ['imagen', 'audio', 'video'].includes(f.tipo);
    // Vista dentro de la lista (EJ): la foto, o el reproductor del audio / video.
    function vistaPrevia(f) {
        const src = esc(url(f));
        if (f.tipo === 'imagen') return `<div class="arc-prev"><img src="${src}" alt="${esc(f.nombre)}"></div>`;
        if (f.tipo === 'audio') return `<div class="arc-prev"><audio src="${src}" controls autoplay preload="auto"></audio></div>`;
        return `<div class="arc-prev"><video src="${src}" controls autoplay playsinline preload="auto"></video></div>`;
    }
    function alTeclear(e) { if (e.key === 'Escape') { e.stopPropagation(); if (editando) { editando = null; pintar(); } else cerrar(); } }

    async function abrir(opciones) {
        cerrar();
        op = opciones;
        capa = document.createElement('div');
        capa.className = 'arc-capa';
        capa.innerHTML = `
            <div class="arc-caja" role="dialog" aria-label="Archivos del curso">
                <div class="arc-cab">
                    <div class="arc-tit">📁 Archivos del curso · ${esc(nombreCurso(op.ctxNombre))} <span class="arc-anio">${anioActual()}</span></div>
                    <button class="arc-subir arc-enlace" title="Agregar un video de YouTube o Google Drive (los videos grandes van como enlace)">＋ Enlace</button>
                    <label class="arc-subir" title="Subir documentos, audios, videos cortos (máx. 50 MB) o fotos a este curso">＋ Subir archivo
                        <input type="file" multiple hidden></label>
                    <button class="arc-x" title="Cerrar (Esc)">✕</button>
                </div>
                <div class="arc-estado"></div>
                <div class="arc-lista"><div class="arc-vacio">Cargando…</div></div>
                <div class="arc-soltar">Suelta aquí para subir a este curso</div>
            </div>`;
        document.body.appendChild(capa);
        const caja = capa.querySelector('.arc-caja');
        capa.addEventListener('mousedown', e => { if (e.target === capa) cerrar(); });
        capa.querySelector('.arc-x').addEventListener('click', cerrar);
        capa.querySelector('input[type=file]').addEventListener('change', e => subir([...e.target.files]));
        capa.querySelector('.arc-enlace').addEventListener('click', agregarEnlace);
        // Arrastrar archivos desde el computador (deuda DU)
        let profundidad = 0;
        caja.addEventListener('dragenter', e => { if (e.dataTransfer?.types?.includes('Files')) { e.preventDefault(); profundidad++; caja.classList.add('arrastrando'); } });
        caja.addEventListener('dragover',  e => { if (e.dataTransfer?.types?.includes('Files')) e.preventDefault(); });
        caja.addEventListener('dragleave', () => { if (--profundidad <= 0) { profundidad = 0; caja.classList.remove('arrastrando'); } });
        caja.addEventListener('drop', e => {
            e.preventDefault(); profundidad = 0; caja.classList.remove('arrastrando');
            subir([...(e.dataTransfer?.files || [])]);
        });
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
        try { filas = await listar(op.sb, op.contextoId); }
        catch (e) { capa.querySelector('.arc-lista').innerHTML = ''; estado(errTxt(e), true); return; }
        pintar();
    }
    function etiquetas(f) {
        const t = [];
        if (f.repertorio_canciones?.nombre) t.push(`<span class="arc-tag" title="Canción de la Biblioteca">🎵 ${esc(f.repertorio_canciones.nombre)}</span>`);
        if (f.uso) t.push(`<span class="arc-tag arc-${f.uso}">${USO[f.uso]}${f.uso === 'extracto' && f.parte ? ' · ' + esc(f.parte) : ''}</span>`);
        if (f.estudiantes?.length) t.push(`<span class="arc-tag" title="Estudiantes (no se comparte)">👥 ${f.estudiantes.length}</span>`);
        if (f.url) t.push(`<span class="arc-tag" title="Video externo">🔗 ${/drive\.google/.test(f.url) ? 'Drive' : 'YouTube'}</span>`);
        return t.join('');
    }
    function pintar() {
        if (!capa) return;
        const lista = capa.querySelector('.arc-lista');
        if (!filas.length) {
            lista.innerHTML = '<div class="arc-vacio">Todavía no hay archivos. Las guías QR de la Biblioteca y lo que subes desde el celular (📷 Subir) llegan aquí solos; también puedes subir con ＋ o arrastrar archivos a esta ventana.</div>';
            return;
        }
        lista.innerHTML = filas.map(f => `
            <div class="arc-fila${editando === f.id ? ' edit' : ''}" data-id="${f.id}">
                <span class="arc-ico">${ICONO[f.tipo] || ICONO.otro}</span>
                <span class="arc-nom"><span class="arc-nom-t${sePuedeVer(f) ? ' arc-ver' : ''}" title="${sePuedeVer(f) ? (viendo === f.id ? 'Tocar para cerrar' : f.tipo === 'imagen' ? 'Tocar para ver aquí' : 'Tocar para reproducir aquí') : esc(f.nombre)}">${esc(f.nombre)}</span>${etiquetas(f) ? `<span class="arc-tags">${etiquetas(f)}</span>` : ''}</span>
                <span class="arc-meta">${fechaTxt(f.fecha || f.created_at)}${f.tamano ? ' · ' + tamTxt(f.tamano) : ''}</span>
                <a class="arc-btn arc-abrir" href="${esc(url(f))}" target="_blank" rel="noopener" title="Abrir (para mirar, escuchar o imprimir)">Abrir</a>
                <button class="arc-btn arc-editar" title="Canción, tipo, fecha y estudiantes">✏️</button>
                ${f.url ? '<span></span>' : `<a class="arc-btn" href="${esc(urlDescarga(f))}" title="Descargar">⬇</a>`}
                <button class="arc-btn arc-borrar" title="Borrar este archivo">🗑</button>
            </div>
            ${viendo === f.id && sePuedeVer(f) ? vistaPrevia(f) : ''}
            ${editando === f.id ? '<div class="arc-form" id="arc-form"></div>' : ''}`).join('');
        lista.querySelectorAll('.arc-ver').forEach(n => n.addEventListener('click', () => {
            const id = n.closest('.arc-fila').dataset.id;
            viendo = viendo === id ? null : id;
            pintar();
        }));
        lista.querySelectorAll('.arc-borrar').forEach(b => b.addEventListener('click', async () => {
            const f = filas.find(x => x.id === b.closest('.arc-fila').dataset.id);
            if (!f || !confirm(`¿Borrar "${f.nombre}"? No se puede deshacer.`)) return;
            try { await borrar(op.sb, f); estado(''); refrescar(); }
            catch (e) { estado(errTxt(e), true); }
        }));
        lista.querySelectorAll('.arc-editar').forEach(b => b.addEventListener('click', () => {
            const id = b.closest('.arc-fila').dataset.id;
            editando = editando === id ? null : id;
            pintar();
        }));
        if (editando) pintarFormulario(filas.find(x => x.id === editando));
    }
    async function pintarFormulario(f) {
        const cont = capa?.querySelector('#arc-form');
        if (!cont || !f) return;
        cont.innerHTML = '<div class="arc-vacio" style="padding:8px">Cargando…</div>';
        const [cans, ests] = await Promise.all([cargarCanciones(op.sb), cargarEstudiantes(op.sb, op.contextoId)]);
        if (!capa || editando !== f.id) return;
        const elegidos = new Set(f.estudiantes || []);
        const canNom = cans.find(c => c.id === f.cancion_id)?.nombre || '';
        cont.innerHTML = `
            <div class="arc-g">
                <label>Nombre<input data-k="nombre" value="${esc(f.nombre)}"></label>
                <label>Fecha<input data-k="fecha" type="date" value="${esc(f.fecha || '')}"></label>
                <label>Canción<input data-k="cancion" list="arc-canciones" value="${esc(canNom)}" placeholder="(ninguna)">
                    <datalist id="arc-canciones">${cans.map(c => `<option value="${esc(c.nombre)}">${esc(c.artista || '')}</option>`).join('')}</datalist></label>
                <label>En la canción, es…<select data-k="uso">
                    <option value="">—</option>
                    <option value="extracto" ${f.uso === 'extracto' ? 'selected' : ''}>Extracto (grabado en clase)</option>
                    <option value="version" ${f.uso === 'version' ? 'selected' : ''}>Versión (en vivo íntegra / trabajo final)</option></select></label>
                <label class="arc-ancho arc-parte" ${f.uso === 'extracto' ? '' : 'hidden'}>Parte de la canción
                    <input data-k="parte" list="arc-partes" value="${esc(f.parte || '')}" placeholder="Elige o escribe (Coro, Estrofa 2…)">
                    <datalist id="arc-partes"></datalist></label>
                ${f.url ? `<label class="arc-ancho">Enlace<input data-k="url" value="${esc(f.url)}"></label>` : ''}
            </div>
            <div class="arc-ests" ${f.uso === 'version' ? '' : 'hidden'}>
                <div class="arc-sub">Estudiantes que tocan <span>(opcional · esta grabación no se comparte)</span></div>
                <div class="arc-ests-l">${ests.length ? ests.map(e => `<label><input type="checkbox" value="${e.id}" ${elegidos.has(e.id) ? 'checked' : ''}> ${esc(e.nombre)}</label>`).join('')
                    : '<span class="arc-sub">No hay lista de estudiantes en el Libro para este curso.</span>'}</div>
            </div>
            <div class="arc-acc"><button class="arc-btn" data-x>Cancelar</button><button class="arc-btn arc-abrir" data-ok>Guardar</button></div>`;
        const $ = k => cont.querySelector(`[data-k="${k}"]`);
        // Sugerencias de "Parte de la canción" (DW): las de la canción elegida (secciones, estrofas) + comunes
        const llenarPartes = async () => {
            const can = cans.find(c => c.nombre === $('cancion').value.trim());
            const partes = await partesDeCancion(op.sb, can?.id);
            const dl = cont.querySelector('#arc-partes');
            if (dl) dl.innerHTML = partes.map(p => `<option value="${esc(p)}">`).join('');
        };
        llenarPartes();
        $('cancion').addEventListener('change', llenarPartes);
        $('uso').addEventListener('change', () => {
            cont.querySelector('.arc-ests').hidden = $('uso').value !== 'version';
            cont.querySelector('.arc-parte').hidden = $('uso').value !== 'extracto';
        });
        cont.querySelector('[data-x]').addEventListener('click', () => { editando = null; pintar(); });
        cont.querySelector('[data-ok]').addEventListener('click', async ev => {
            const nombre = $('nombre').value.trim();
            const cTxt = $('cancion').value.trim();
            const can = cTxt ? cans.find(c => c.nombre === cTxt) || cans.find(c => c.nombre.toLowerCase() === cTxt.toLowerCase()) : null;
            if (cTxt && !can) { estado('Esa canción no está en la Biblioteca; elígela de la lista.', true); return; }
            const enlace = f.url ? $('url').value.trim() : null;
            if (f.url && !esEnlace(enlace)) { estado('El enlace debe ser de YouTube o Google Drive.', true); return; }
            const uso = $('uso').value || null;
            const cambios = {
                nombre: nombre || f.nombre, fecha: $('fecha').value || null, cancion_id: can?.id || null, uso,
                estudiantes: uso === 'version' ? [...cont.querySelectorAll('.arc-ests input:checked')].map(i => i.value) : [],
            };
            const parte = uso === 'extracto' ? $('parte').value.trim() || null : null;
            if (parte || f.parte) cambios.parte = parte;   // sin medios_parte.sql, no se manda si no hay parte
            if (f.url) cambios.url = enlace;
            ev.currentTarget.disabled = true;
            const { error } = await op.sb.from('curso_archivos').update(cambios).eq('id', f.id);
            if (error) { ev.currentTarget.disabled = false; estado(errTxt(error), true); return; }
            estado(''); editando = null; refrescar();
        });
    }
    async function subir(archivos) {
        if (!archivos.length || !op) return;
        for (const [i, a0] of archivos.entries()) {
            estado(`Subiendo ${archivos.length > 1 ? `${i + 1} de ${archivos.length}` : a0.name}…`);
            const a = await prepararImagen(a0);
            if (a.size > MAX_BYTES) {
                estado(`"${a.name}" pesa ${tamTxt(a.size)}: el máximo es 50 MB. Si es un video, súbelo a YouTube (no listado) y agrégalo con ＋ Enlace.`, true);
                continue;
            }
            try { await guardar(op.sb, { contextoId: op.contextoId, nombre: a.name, archivo: a, mime: a.type, origen: 'subido', fecha: hoyISO() }); }
            catch (e) { estado(errTxt(e), true); return; }
        }
        if (!capa?.querySelector('.arc-estado.err')) estado('');
        const inp = capa?.querySelector('input[type=file]');
        if (inp) inp.value = '';
        refrescar();
    }
    async function agregarEnlace() {
        const enlace = prompt('Pega el enlace del video (YouTube o Google Drive):');
        if (enlace === null) return;
        if (!esEnlace(enlace)) { estado('El enlace debe ser de YouTube o Google Drive.', true); return; }
        const nombre = prompt('Nombre para reconocerlo:', 'Video ' + fechaTxt(hoyISO()));
        if (nombre === null) return;
        try { await guardarEnlace(op.sb, { contextoId: op.contextoId, nombre: nombre.trim() || 'Video', url: enlace, fecha: hoyISO() }); estado(''); refrescar(); }
        catch (e) { estado(errTxt(e), true); }
    }

    return { abrir, cerrar, guardar, guardarEnlace, listar, borrar, url, urlDescarga, tipoDe, esEnlace, prepararImagen, partesDeCancion, BUCKET, MAX_BYTES };
})();
