// ═══════════════════════════════════════════════════════════════════════
// comun/pedidos-cancion.js — 🙋 Canciones pedidas SIN CURSO (deuda GT, DECISIÓN del PO 2026-11-10)
// Una lista general, aparte de los pedidos de cada curso (que viven en la sesión del Entrenador).
// Se guardan como filas de `pendientes` con categoría 'pedido_cancion' del contexto General:
//   activo = pedida · completado = cargada en la Biblioteca · descartado = descartada.
// Uso:
//   PedidosCancion.crear(sb, 'Go away - Weezer')   → fila nueva (o lanza error)
//   PedidosCancion.listar(sb)                      → las pedidas (activas), de la más antigua a la más nueva
//   PedidosCancion.cargada(sb, id) · PedidosCancion.descartar(sb, id)
//   PedidosCancion.partes(texto)                   → { nombre, artista } (separados por " - ")
// Cada cambio se avisa por el canal 'profe-repertorio-pedidos' ({ tipo: 'generales' }).
// Lo usan: comun/anotar.js (/rep), LIBRO (grupos de trabajo) y REPERTORIO (página de pedidos).
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'pedido_cancion';
    let genId = null;
    const canal = 'BroadcastChannel' in window ? new BroadcastChannel('profe-repertorio-pedidos') : null;
    const avisar = () => { try { canal?.postMessage({ tipo: 'generales' }); } catch (_) {} };

    async function general(sb) {
        if (genId) return genId;
        const { data, error } = await sb.from('contextos').select('id').eq('nombre', 'GENERAL').maybeSingle();
        if (error) throw error;
        genId = data?.id || null;
        if (!genId) throw new Error('No encontré el contexto General');
        return genId;
    }
    function partes(texto) {
        const p = String(texto || '').trim().split(/\s+[-–—]\s+/);
        return { nombre: (p[0] || '').trim(), artista: p.slice(1).join(' - ').trim() };
    }
    async function crear(sb, texto) {
        const t = String(texto || '').replace(/\s+/g, ' ').trim();
        if (!t) throw new Error('Falta la canción');
        const contexto_id = await general(sb);
        const { data, error } = await sb.from('pendientes')
            .insert({ contexto_id, sesion_id: null, categoria: CAT, texto: t, estado: 'activo' })
            .select('id, texto, created_at').single();
        if (error) throw error;
        avisar();
        return data;
    }
    async function listar(sb) {
        const { data, error } = await sb.from('pendientes').select('id, texto, created_at')
            .eq('categoria', CAT).eq('estado', 'activo').order('created_at');
        if (error) throw error;
        return data || [];
    }
    async function cerrar(sb, id, estado) {
        const cambios = { estado };
        if (estado === 'completado') cambios.completado_en = new Date().toISOString();
        const { error } = await sb.from('pendientes').update(cambios).eq('id', id);
        if (error) throw error;
        avisar();
    }

    window.PedidosCancion = {
        CAT, crear, listar, partes,
        cargada: (sb, id) => cerrar(sb, id, 'completado'),
        descartar: (sb, id) => cerrar(sb, id, 'descartado'),
    };
})();
