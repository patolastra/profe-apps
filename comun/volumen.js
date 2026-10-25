// ═══════════════════════════════════════════════════════════════════════
// Volumen — volumen de lo que suena en el Entrenador (deuda DA, 2026-10-24)
// Un nivel 0–100 y "silencio", recordados en este equipo (todas sus pestañas al tiempo).
// El celular lo maneja por internet: canal de Supabase 'profe-volumen' (sin tablas). El PC
// solo obedece y avisa su nivel con la clase en curso en ese PC (así no se mueve el volumen
// de otro computador encendido).
//
// Uso:
//   Volumen.nivel()            → 0..1 (0 si está en silencio)
//   Volumen.estado()           → { v: 0..100, mudo }
//   Volumen.poner({ v?, mudo? })
//   Volumen.alCambiar(fn)      → fn({ v, mudo }) ahora y en cada cambio
//   Volumen.conectar(sb)                       → PC (Entrenador): obedece al celular
//   Volumen.conectar(sb, { control: true })    → celular: manda y muestra el nivel del PC
//   Volumen.pedir() · Volumen.vistoPC()       → celular: pide el nivel al PC · hora de su última respuesta
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const KEY = 'profe_volumen';
    const lim = v => Math.max(0, Math.min(100, Math.round(+v || 0)));
    function leer() {
        try {
            const o = JSON.parse(localStorage.getItem(KEY) || 'null');
            if (o && typeof o.v === 'number') return { v: lim(o.v), mudo: !!o.mudo };
        } catch (_) {}
        return { v: 100, mudo: false };
    }
    let est = leer();
    const subs = new Set();
    const avisar = () => subs.forEach(f => { try { f({ ...est }); } catch (_) {} });

    function nivel() { return est.mudo ? 0 : est.v / 100; }
    function estado() { return { ...est }; }
    function guardar() { try { localStorage.setItem(KEY, JSON.stringify(est)); } catch (_) {} }
    function poner(c, desdeRed) {
        est = { v: lim(c.v ?? est.v), mudo: c.mudo ?? est.mudo };
        if (c.v != null && c.mudo == null && est.v > 0) est.mudo = false;   // subir el volumen quita el silencio
        guardar();
        avisar();
        if (!desdeRed && control) {   // celular: mientras se toca, manda lo tocado; al soltar, pide el nivel real del PC
            tocado = Date.now();
            clearTimeout(resync); resync = setTimeout(pedir, ESPERA + 100);
        }
        if (!desdeRed) enviar(control ? { tipo: 'poner', ...est } : { tipo: 'estado', ...est });
    }
    window.addEventListener('storage', e => { if (e.key === KEY) { est = leer(); avisar(); } });
    function alCambiar(f) { subs.add(f); f({ ...est }); }

    // ── Celular ↔ PC por internet ──
    let canal = null, listo = false, control = false, vistoPC = 0;   // celular: hora del último aviso del PC
    // Celular: las respuestas del PC llegan con atraso; durante ESPERA ms tras un toque no pisan lo tocado.
    const ESPERA = 1500;
    let tocado = 0, resync = null;
    const claseAqui = () => !!(window.ClaseVivo && ClaseVivo.get());
    function enviar(p) {
        if (!canal || !listo) return;
        if (!control && !claseAqui()) return;   // el PC solo avisa con la clase en curso en él
        try { canal.send({ type: 'broadcast', event: 'vol', payload: p }); } catch (_) {}
    }
    function conectar(sb, op) {
        if (canal || !sb) return;
        control = !!op?.control;
        try {
            canal = sb.channel('profe-volumen', { config: { broadcast: { self: false } } })
                .on('broadcast', { event: 'vol' }, ({ payload: m }) => {
                    if (!m) return;
                    if (control) {
                        if (m.tipo !== 'estado') return;
                        vistoPC = Date.now();
                        if (Date.now() - tocado > ESPERA) { est = { v: lim(m.v), mudo: !!m.mudo }; guardar(); }
                        avisar();
                        return;
                    }
                    if (!claseAqui()) return;
                    if (m.tipo === 'poner') poner({ v: m.v, mudo: m.mudo }, true), enviar({ tipo: 'estado', ...est });
                    else if (m.tipo === 'pedir') enviar({ tipo: 'estado', ...est });
                })
                .subscribe(s => {
                    listo = s === 'SUBSCRIBED';
                    if (listo && control) enviar({ tipo: 'pedir' });
                });
        } catch (_) {}
    }
    function pedir() { if (control) enviar({ tipo: 'pedir' }); }

    window.Volumen = { nivel, estado, poner, alCambiar, conectar, pedir, vistoPC: () => vistoPC };
})();
