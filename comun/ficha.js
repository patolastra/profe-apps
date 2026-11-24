// Ficha (deuda JS): la Ficha de la canción se llena sola mientras se trabaja.
// Al guardar en un editor (Melodía, Arreglo, Cajón), lo que FALTA en la Ficha se completa con lo del editor; lo que la
// Ficha ya tiene nunca se pisa (el editor sigue avisando "≠ canción"). Si la canción no tiene Ficha, se crea.
//   Ficha.completar(sb, cancionId, { tonalidad: { tonica, modo }, cifra: '6/8' })
//     → texto de lo completado ("Sol mayor · 6/8") o null si no faltaba nada (o falló; nunca corta el guardado)
// Escribe como la Biblioteca y la app de la Ficha: la fila (repertorio_assets tipo 'tempo'), su archivo público
// tempo/<canción>.json y los avisos a las demás pestañas y equipos (canal profe-tempo y AlDia).
// Necesita comun/tempo-mapa.js. Los estilos rítmicos (categoría 'estilo') no tienen Ficha.
(function () {
    if (window.Ficha) return;
    const BUCKET = 'repertorio-assets';
    const genId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

    async function completar(sb, cancionId, { tonalidad, cifra } = {}) {
        try {
            if (!sb || !cancionId || !window.TempoMapa) return null;
            const [{ data: canc }, { data: filas, error }] = await Promise.all([
                sb.from('repertorio_canciones').select('nombre, categoria').eq('id', cancionId).limit(1),
                sb.from('repertorio_assets').select('id, contenido').eq('cancion_id', cancionId).eq('tipo', 'tempo').limit(1),
            ]);
            if (error || !canc?.[0] || canc[0].categoria === 'estilo') return null;
            const fila = filas?.[0];
            let d = {}; try { d = JSON.parse(fila?.contenido || '{}') || {}; } catch (_) { return null; }
            const puso = [];
            if (tonalidad && tonalidad.tonica && !d.tonalidad) {
                d.tonalidad = { tonica: tonalidad.tonica, modo: tonalidad.modo === 'menor' ? 'menor' : 'mayor' };
                puso.push(TempoMapa.nombreTonalidad(d.tonalidad));
            }
            const [n, den] = String(cifra || '').split('/').map(Number);
            if (n > 0 && den > 0 && !(Array.isArray(d.cifras) && d.cifras.length)) {
                d.cifras = [{ compas: 1, n, d: den }];
                puso.push(`${n}/${den}`);
            }
            if (!puso.length) return null;
            const datos = TempoMapa.crear(d).datos();
            const contenido = JSON.stringify(datos);
            let id = fila?.id;
            if (id) {
                const { error: e } = await sb.from('repertorio_assets').update({ contenido }).eq('id', id);
                if (e) return null;
            } else {
                id = genId();
                const { error: e } = await sb.from('repertorio_assets').insert({ id, cancion_id: cancionId, tipo: 'tempo', etiqueta: '', instrumento: '',
                    contenido, storage_path: '', nombre_archivo: '', synced: '', orden: 0, dificultad: '', estado: 'publicado' });
                if (e) return null;
            }
            await sb.storage.from(BUCKET).upload(`tempo/${cancionId}.json`,
                new Blob([JSON.stringify({ ...datos, cancion: canc[0].nombre })], { type: 'application/json' }), { upsert: true, contentType: 'application/json' });
            try {
                const bc = new BroadcastChannel('profe-tempo');
                bc.postMessage({ tipo: 'ficha-datos', cancion: cancionId, tonalidad: datos.tonalidad || null, cifra: datos.cifras[0], datos });
                bc.postMessage({ tipo: 'tempo-guardado', cancion: cancionId });
                bc.close();
            } catch (_) {}
            if (window.AlDia) { try { AlDia.avisar({ cancion: cancionId, tipo: 'tempo', id }); AlDia.rehacerArreglos({ cancion: cancionId, tipo: 'tempo', id }); } catch (_) {} }
            return puso.join(' · ');
        } catch (e) { console.warn('Ficha.completar', e); return null; }
    }
    window.Ficha = { completar };
})();
