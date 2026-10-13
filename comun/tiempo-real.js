// ═══════════════════════════════════════════════════════════════════════
// TiempoReal — lo que cambia en otro equipo se ve al instante (deuda BE, 2026-10-13)
// Base común para las páginas que no tienen su propia pieza al instante (pendientes y
// apoderados ya la tienen). Fase 1: bitácora (`memorias`) y notas (`bitacora_paginas`).
// Cada tabla necesita estar en la publicación de Supabase Realtime (supabase/*_realtime.sql).
//
// Regla (DECISIÓN del PO): nunca se pisa lo que se está escribiendo; lo de otro equipo se
// aplica al dejar de escribir; si los dos editaron lo mismo, queda lo último guardado y se avisa.
//
// Uso:
//   TiempoReal.conectar(sb)
//   TiempoReal.escuchar('memorias', ({ evento, nuevo, viejo }) => …)   // INSERT | UPDATE | DELETE
//   TiempoReal.alVolver(() => …)   // la página volvió a verse (el celular corta la conexión al
//                                  // apagar la pantalla o cambiar de app) o volvió la señal
//   TiempoReal.aviso('Cambió en otro equipo…')
//   TiempoReal.mismaHora(a, b)     // dos fechas-hora iguales aunque vengan escritas distinto
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    let sb = null;
    const oyentes = {};          // tabla → [cb]
    const canales = {};
    const alVolverCbs = [];

    function conectar(cliente) {
        if (sb || !cliente) return;
        sb = cliente;
        Object.keys(oyentes).forEach(suscribir);
    }
    function suscribir(tabla) {
        if (!sb || canales[tabla]) return;
        try {
            canales[tabla] = sb.channel('profe-tr-' + tabla)
                .on('postgres_changes', { event: '*', schema: 'public', table: tabla }, pl => {
                    const msg = { evento: pl.eventType, nuevo: pl.new || null, viejo: pl.old || null };
                    (oyentes[tabla] || []).forEach(cb => { try { cb(msg); } catch (e) { console.error(e); } });
                })
                .subscribe();
        } catch (_) {}
    }
    function escuchar(tabla, cb) {
        (oyentes[tabla] ||= []).push(cb);
        suscribir(tabla);
    }

    // Al volver: pantalla visible tras estar oculta, página traída de vuelta, o señal recuperada.
    let ocultaDesde = 0;
    const llamar = () => alVolverCbs.forEach(cb => { try { cb(); } catch (e) { console.error(e); } });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) { ocultaDesde = Date.now(); return; }
        if (ocultaDesde && Date.now() - ocultaDesde > 2000) llamar();
        ocultaDesde = 0;
    });
    window.addEventListener('pageshow', e => { if (e.persisted) llamar(); });
    window.addEventListener('online', () => setTimeout(llamar, 800));
    function alVolver(cb) { alVolverCbs.push(cb); }

    // Aviso breve abajo (no tapa lo que se escribe).
    let caja = null, timer = null;
    function aviso(texto) {
        if (!caja) {
            caja = document.createElement('div');
            caja.style.cssText = 'position:fixed;left:50%;bottom:calc(18px + env(safe-area-inset-bottom,0px));transform:translateX(-50%);' +
                'z-index:99999;max-width:min(92vw,520px);padding:10px 16px;border-radius:10px;background:#1f2937;color:#f9fafb;' +
                'font:500 14px/1.35 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25);' +
                'transition:opacity .2s;opacity:0;pointer-events:none;text-align:center';
            document.body.appendChild(caja);
        }
        caja.textContent = texto;
        caja.style.opacity = '1';
        clearTimeout(timer);
        timer = setTimeout(() => { caja.style.opacity = '0'; }, 5000);
    }

    const mismaHora = (a, b) => !!a && !!b && Date.parse(a) === Date.parse(b);

    window.TiempoReal = { conectar, escuchar, alVolver, aviso, mismaHora };
})();
