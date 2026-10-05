// Nombre de cortesía de un asset del Repertorio — regla única para todo el ecosistema.
//
//   Canción · Instrumento · Descripción · Dificultad      (completo)
//   Instrumento · Descripción · Dificultad                (corto: donde la canción ya se ve)
//
// - Instrumento: el campo `instrumento` en las tablaturas; en los demás tipos, el propio tipo
//   (Letra, Audio, Metalófono, Flauta, Cifrado, Ritmo).
// - Descripción: la etiqueta, sin el instrumento/dificultad/tonalidad que Repertorio antepone
//   cuando la genera sola ("guitarra media Do mayor" → "Do mayor").
// - Falta un dato → se salta. El nombre del archivo original NO se usa (solo para descargar).
// Se arma al vuelo con los datos existentes: no hay columna nueva en Supabase.
(function () {
    const TIPO = { letra: 'Letra', audio: 'Audio', tab: 'Tab', metalofono: 'Metalófono',
                   flauta: 'Flauta', cifrado: 'Cifrado', ritmo: 'Ritmo' };
    const DIFIC = { inicial: 'Inicial', media: 'Media', dificil: 'Difícil', experto: 'Experto' };

    const cap  = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
    const norm = s => (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();

    function partesAsset(a) {
        a = a || {};
        const instrumento = a.tipo === 'tab'
            ? (cap(a.instrumento) || TIPO.tab)
            : (TIPO[a.tipo] || cap(a.instrumento) || cap(a.tipo));

        // Quitar del inicio de la etiqueta las palabras autogeneradas (instrumento, dificultad, tonalidad)
        const sobran = new Set([norm(a.instrumento), norm(a.dificultad), norm(a.tonalidad)].filter(Boolean));
        const palabras = (a.etiqueta || '').trim().split(/\s+/).filter(Boolean);
        while (palabras.length > 1 && sobran.has(norm(palabras[0]))) palabras.shift();
        let descripcion = palabras.join(' ');
        // Etiqueta que solo repetía el instrumento o la dificultad → sin descripción
        if (sobran.has(norm(descripcion)) && norm(descripcion) !== norm(a.tonalidad)) descripcion = '';
        if (!descripcion && a.tonalidad && a.tipo === 'tab') descripcion = a.tonalidad;
        if (norm(descripcion) === norm(instrumento)) descripcion = '';

        const dificultad = DIFIC[norm(a.dificultad)] || cap(a.dificultad);
        return { instrumento, descripcion: cap(descripcion), dificultad };
    }

    // nombreAsset(asset)              → "Guitarra · Armonía · Media"
    // nombreAsset(asset, 'Baby Shark') → "Baby Shark · Guitarra · Armonía · Media"
    function nombreAsset(a, cancion) {
        const p = partesAsset(a);
        return [cancion, p.instrumento, p.descripcion, p.dificultad].filter(Boolean).join(' · ');
    }

    window.partesAsset = partesAsset;
    window.nombreAsset = nombreAsset;
})();
