// ═══════════════════════════════════════════════════════════════════════
// AlDia — todo se pone al día solo (regla 12 de CLAUDE.md, deuda HG, 2026-11-13)
// Cuando se guarda algo de una canción (Ficha, letra, ritmo de cajón, melodía, arreglo), las demás pestañas y los otros
// equipos se enteran: en el mismo computador al tiro (BroadcastChannel) y en otros equipos por Supabase Realtime
// (repertorio_assets ya está en la publicación: supabase/fase3_realtime.sql). Cada página escucha lo suyo.
// Además, lo que ven los estudiantes se rehace solo: al cambiar la Ficha, un ritmo o una melodía, cada arreglo que los
// usa (y no está 📌 fijado) se abre escondido, sigue a sus originales y vuelve a guardar su archivo público.
//
//   AlDia.conectar(sb)
//   AlDia.escuchar(({ cancion, tipo, id, fila, aqui }) => …)   // tipo = 'tempo' | 'letra' | 'cajon' | 'melodia' | 'arreglo' | 'audio'…
//                                                              // fila = la fila nueva (solo si llegó por Realtime); aqui = este equipo
//   AlDia.avisar({ cancion, tipo, id })                        // después de guardar
//   await AlDia.rehacerArreglos({ cancion, tipo, id })          // → n de arreglos puestos al día (avisa con un toast)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    let sb = null, canal = null;
    const oyentes = [];
    const bc = (() => { try { return new BroadcastChannel('profe-al-dia'); } catch (_) { return null; } })();
    const recientes = new Map();     // clave → hora: el mismo cambio llega por los dos caminos; se avisa una vez
    function repartir(msg) {
        const k = [msg.cancion, msg.tipo, msg.id].join('|'), t = Date.now();
        if (recientes.has(k) && t - recientes.get(k) < 2500 && !msg.fila) return;
        recientes.set(k, t);
        oyentes.forEach(cb => { try { cb(msg); } catch (e) { console.error(e); } });
    }
    if (bc) bc.onmessage = e => { if (e.data && e.data.cancion) repartir({ ...e.data, aqui: true }); };

    function conectar(cliente) {
        if (sb || !cliente) return;
        sb = cliente;
        try {
            canal = sb.channel('profe-al-dia-assets')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'repertorio_assets' }, pl => {
                    const f = pl.new && Object.keys(pl.new).length ? pl.new : pl.old || {};
                    if (!f.cancion_id) return;
                    repartir({ cancion: f.cancion_id, tipo: f.tipo, id: f.id, fila: pl.new && Object.keys(pl.new).length ? pl.new : null, aqui: false });
                })
                .subscribe();
        } catch (_) {}
    }
    function escuchar(cb) { oyentes.push(cb); }
    function avisar(msg) {
        if (!msg || !msg.cancion) return;
        try { bc && bc.postMessage({ cancion: msg.cancion, tipo: msg.tipo, id: msg.id || null }); } catch (_) {}
    }

    // ── Rehacer lo de los estudiantes ─────────────────────────────────────────────────────
    const base = (() => { const s = document.currentScript && document.currentScript.src; return s ? s.replace(/comun\/al-dia\.js.*$/, '') : '../'; })();
    let cola = Promise.resolve();
    function rehacerArreglos(msg) {
        const tarea = cola.then(() => rehacer(msg)).catch(() => 0);
        cola = tarea;
        return tarea;
    }
    async function rehacer({ cancion, tipo, id }) {
        if (!sb || !['tempo', 'cajon', 'melodia'].includes(tipo)) return 0;
        // Los arreglos de la canción y, para un ritmo o una melodía, los de cualquier canción que tengan su copia
        const qs = [sb.from('repertorio_assets').select('id, contenido').eq('tipo', 'arreglo').eq('cancion_id', cancion)];
        if (id && tipo !== 'tempo') qs.push(sb.from('repertorio_assets').select('id, contenido').eq('tipo', 'arreglo').like('contenido', `%"${id}"%`));
        const rs = await Promise.all(qs);
        const vistos = new Map();
        rs.forEach(r => (r.data || []).forEach(a => vistos.set(a.id, a)));
        const L = [...vistos.values()].filter(a => {
            let c = null; try { c = JSON.parse(a.contenido || 'null'); } catch (_) {}
            if (!c || c.fijo) return false;
            if (tipo === 'tempo') return true;
            if (tipo === 'melodia') return c.melodia && c.melodia.origen === id;
            return !!(c.cajon && c.cajon.ritmos && c.cajon.ritmos[id]);
        });
        let n = 0;
        for (const a of L) { if (await rehacerUno(a.id)) n++; }
        if (n) toast(`Se ${n === 1 ? 'puso' : 'pusieron'} al día ${n} ${n === 1 ? 'arreglo' : 'arreglos'} para los estudiantes`);
        return n;
    }
    // El Editor de arreglos, escondido (?rehacer=1): sigue a los originales, guarda si cambió y rehace su archivo público
    function rehacerUno(id) {
        return new Promise(res => {
            const f = document.createElement('iframe');
            f.style.cssText = 'position:fixed;left:-4000px;top:0;width:1200px;height:800px;border:0;visibility:hidden';
            const fin = ok => { clearTimeout(t); window.removeEventListener('message', h); f.remove(); res(ok); };
            const t = setTimeout(() => fin(false), 60000);
            const h = e => { if (e.source === f.contentWindow && e.data && e.data.tipo === 'arreglo-rehecho') fin(e.data.ok !== false); };
            window.addEventListener('message', h);
            f.src = `${base}ARREGLO/index.html?asset=${encodeURIComponent(id)}&rehacer=1&t=${Date.now()}`;
            document.body.appendChild(f);
        });
    }
    let caja = null, timer = null;
    function toast(texto) {
        if (!caja) {
            caja = document.createElement('div');
            caja.style.cssText = 'position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;max-width:min(92vw,520px);' +
                'padding:10px 16px;border-radius:10px;background:#1f2937;color:#f9fafb;font:500 14px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;' +
                'box-shadow:0 8px 24px rgba(0,0,0,.25);transition:opacity .2s;opacity:0;pointer-events:none;text-align:center';
            document.body.appendChild(caja);
        }
        caja.textContent = texto; caja.style.opacity = '1';
        clearTimeout(timer); timer = setTimeout(() => { caja.style.opacity = '0'; }, 5000);
    }

    window.AlDia = { conectar, escuchar, avisar, rehacerArreglos, toast };
})();
