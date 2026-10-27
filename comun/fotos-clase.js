// ═══════════════════════════════════════════════════════════════════════
// 🖼️ FOTOS DE LA CLASE EN SU BITÁCORA (deuda DU, fase 4, 2026-10-27)
// Las fotos subidas a 📁 Archivos del curso (comun/archivos-curso.js; desde 📷 Subir del celular quedan ligadas a la
// clase) se ven como miniaturas en la bitácora de esa clase: Cursos (PC y celular) y el Plan (✍🏼 Bitácora e
// 🕘 Historial). Una foto es de la clase si tiene su sesion_id, o si no tiene clase pero es del mismo curso y fecha.
// Tocar una miniatura la abre en grande (← → entre las de esa clase, Esc o toque fuera cierra).
//
//   FotosClase.para(sb, clases)  clases = [{ sesionId, cid, fecha }] → Map sesionId → [fotos]
//   FotosClase.html(fotos)       → HTML de la tira de miniaturas ('' si no hay)
// Requiere ../supabase/config.js (SUPABASE_URL).
// ═══════════════════════════════════════════════════════════════════════
const FotosClase = (() => {
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const url = f => f.url || `${SUPABASE_URL}/storage/v1/object/public/curso-archivos/${f.storage_path.split('/').map(encodeURIComponent).join('/')}`;
    let porId = {};

    async function para(sb, clases) {
        const mapa = new Map();
        const cs = clases.filter(c => c.sesionId);
        if (!cs.length) return mapa;
        const cids = [...new Set(cs.map(c => c.cid).filter(Boolean))], fechas = [...new Set(cs.map(c => c.fecha).filter(Boolean))];
        const sids = cs.map(c => c.sesionId);
        try {
            const [a, b] = await Promise.all([
                sb.from('curso_archivos').select('id, nombre, storage_path, url, sesion_id, contexto_id, fecha').eq('tipo', 'imagen').in('sesion_id', sids),
                cids.length && fechas.length
                    ? sb.from('curso_archivos').select('id, nombre, storage_path, url, sesion_id, contexto_id, fecha').eq('tipo', 'imagen')
                        .is('sesion_id', null).in('contexto_id', cids).in('fecha', fechas)
                    : Promise.resolve({ data: [] }),
            ]);
            const todas = [...(a.data || []), ...(b.data || [])];
            todas.forEach(f => { porId[f.id] = f; });
            cs.forEach(c => {
                const fs = todas.filter(f => f.sesion_id === c.sesionId || (!f.sesion_id && f.contexto_id === c.cid && f.fecha === c.fecha));
                if (fs.length) mapa.set(c.sesionId, fs);
            });
        } catch (_) {}   // sin medios.sql o sin señal: la bitácora se ve igual, sin fotos
        return mapa;
    }
    function html(fotos) {
        if (!fotos || !fotos.length) return '';
        estilos();
        const ids = fotos.map(f => f.id).join(',');
        return `<div class="fc-tira">${fotos.map(f =>
            `<button type="button" class="fc-mini" title="${esc(f.nombre)}" onclick="FotosClase.ver('${f.id}','${ids}')">` +
            `<img src="${esc(url(f))}" alt="" loading="lazy"></button>`).join('')}</div>`;
    }

    // ── Visor ──
    let visor = null, lista = [], i = 0;
    function ver(id, ids) {
        lista = ids.split(',').map(x => porId[x]).filter(Boolean);
        i = Math.max(0, lista.findIndex(f => f.id === id));
        if (!visor) {
            visor = document.createElement('div');
            visor.className = 'fc-visor';
            visor.innerHTML = '<img alt=""><div class="fc-pie"></div><button type="button" class="fc-x" aria-label="Cerrar">✕</button>' +
                '<button type="button" class="fc-nav fc-ant" aria-label="Anterior">‹</button><button type="button" class="fc-nav fc-sig" aria-label="Siguiente">›</button>';
            visor.addEventListener('click', e => {
                if (e.target.closest('.fc-ant')) return mover(-1);
                if (e.target.closest('.fc-sig')) return mover(1);
                if (e.target.tagName !== 'IMG') cerrar();
            });
            document.addEventListener('keydown', e => {
                if (!visor?.isConnected) return;
                if (e.key === 'Escape') { e.stopPropagation(); cerrar(); }
                if (e.key === 'ArrowLeft') mover(-1);
                if (e.key === 'ArrowRight') mover(1);
            }, true);
        }
        document.body.appendChild(visor);
        pintar();
    }
    function mover(d) { if (lista.length > 1) { i = (i + d + lista.length) % lista.length; pintar(); } }
    function pintar() {
        const f = lista[i];
        visor.querySelector('img').src = url(f);
        visor.querySelector('.fc-pie').textContent = lista.length > 1 ? `${f.nombre} · ${i + 1} de ${lista.length}` : f.nombre;
        visor.querySelectorAll('.fc-nav').forEach(b => { b.hidden = lista.length < 2; });
    }
    function cerrar() { visor?.remove(); }

    function estilos() {
        if (document.getElementById('fc-estilos')) return;
        const st = document.createElement('style');
        st.id = 'fc-estilos';
        st.textContent = `
            .fc-tira { display: flex; flex-wrap: wrap; gap: 6px; margin: 6px 0 8px; }
            .fc-mini { padding: 0; border: 0; background: none; cursor: zoom-in; border-radius: 8px; overflow: hidden; line-height: 0; }
            .fc-mini img { height: 76px; width: auto; max-width: 140px; object-fit: cover; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,.25); }
            .fc-visor { position: fixed; inset: 0; z-index: 99990; background: rgba(0,0,0,.88); display: flex; flex-direction: column;
                        align-items: center; justify-content: center; gap: 10px; padding: 20px; }
            .fc-visor img { max-width: 100%; max-height: calc(100vh - 80px); object-fit: contain; border-radius: 6px; }
            .fc-pie { color: #ddd; font: 13px system-ui, sans-serif; text-align: center; }
            .fc-x { position: absolute; top: 12px; right: 14px; border: 0; background: rgba(255,255,255,.12); color: #fff; font-size: 18px;
                    width: 40px; height: 40px; border-radius: 50%; cursor: pointer; }
            .fc-nav { position: absolute; top: 50%; transform: translateY(-50%); border: 0; background: rgba(255,255,255,.12); color: #fff;
                      font-size: 30px; width: 48px; height: 64px; border-radius: 10px; cursor: pointer; }
            .fc-ant { left: 10px; } .fc-sig { right: 10px; }
            .fc-nav[hidden] { display: none; }`;
        document.head.appendChild(st);
    }

    return { para, html, ver };
})();
