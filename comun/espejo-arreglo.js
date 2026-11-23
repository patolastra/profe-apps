// EspejoArreglo (deuda IS): el Cajón, el Metalófono y el Piano de un arreglo abiertos en el panel del Plan con la clase
// en curso (`&pizarra=1&sesion=<id>` en su dirección) avisan a la Pizarra qué muestran y en qué segundo de la grabación
// van, para que ella ponga encima una copia que los sigue sin sonar. Misma computadora (BroadcastChannel).
//
//   EspejoArreglo.emitir({ inst: 'cajon' | 'metal' | 'piano', r: <id del arreglo>, n: <nombre>,
//                          seg: () => segundo de la grabación (o null), tocando: () => bool })
//
// Mensajes del canal 'profe-espejo-arreglo': { tipo: 'on', sesionId, inst, r, n } · { tipo: 'seg', sesionId, seg, tocando }
// · { tipo: 'off', sesionId }. Una Pizarra que se abre después pregunta { tipo: 'quien', sesionId } y se le responde 'on'.
(function () {
    function emitir(o) {
        const q = new URLSearchParams(location.search);
        const sesionId = q.get('sesion');
        if (q.get('pizarra') !== '1' || !sesionId || !('BroadcastChannel' in window)) return;
        const canal = new BroadcastChannel('profe-espejo-arreglo');
        const on = { tipo: 'on', sesionId, inst: o.inst, r: o.r, n: o.n || '' };
        canal.postMessage(on);
        const reloj = setInterval(() => {
            let seg = null, tocando = false;
            try { seg = o.seg(); tocando = !!o.tocando(); } catch (_) {}
            if (typeof seg === 'number' && isFinite(seg)) canal.postMessage({ tipo: 'seg', sesionId, seg, tocando });
        }, 60);
        // Una Pizarra recién abierta pregunta qué hay
        canal.onmessage = ev => { if (ev.data?.tipo === 'quien' && ev.data.sesionId === sesionId) canal.postMessage(on); };
        window.addEventListener('pagehide', () => {
            clearInterval(reloj);
            canal.postMessage({ tipo: 'off', sesionId });
        });
    }
    window.EspejoArreglo = { emitir };
})();
