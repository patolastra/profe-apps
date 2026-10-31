// TempoMapa (deuda EU): el mapa de tempo de una canción = dónde cae cada pulso de su grabación.
// Melodía y Karaoke van exactamente juntas (ET), así que un mapa sirve para las dos.
//
//   Datos (recurso `tempo` de la canción y archivo público repertorio-assets/tempo/<cancion_id>.json):
//     { v: 1, pulsos: [seg…],            // cada pulso, en segundos de la grabación original, en orden
//       compas1: i,                      // índice del pulso donde empieza el compás 1 (los anteriores: compás 0, −1…)
//       cifras: [{ compas: 1, n: 4, d: 4 }], // cifra desde ese compás: n pulsos de valor 1/d (4/4, 3/4, 6/8…; sin d = /4);
//                                        // la primera vale también hacia atrás
//       secciones: [{ compas, seg, nombre }], // Intro, Estrofa, Coro…: cada una desde su comienzo hasta la siguiente (opcional);
//                                        // seg = segundo de la grabación; compas solo si cae en lo marcado (EW: puede no haber tempo)
//       tonalidad: { tonica: 'A', modo: 'mayor' } } // la de la canción (opcional; letras C D E F G A B con # o b)
//   Es la ficha oficial de la canción (deuda EV): tonalidad, cifra, tempo y secciones se leen de aquí.
//
//   const m = TempoMapa.crear(datos);
//   m.segDePulso(p)      → segundo de la grabación del pulso p (p = 0 es el tiempo 1 del compás 1; admite decimales)
//   m.pulsoDeSeg(s)      → pulso (con decimales) que suena en el segundo s
//   m.pulsoDeCompas(c)   → pulso donde empieza el compás c
//   m.compasDePulso(p)   → { compas, tiempo } (tiempo 1 = el primero del compás)
//   m.cifraEn(c)         → pulsos del compás c; m.cifraTexto(c) → "4/4", "6/8"… (sin c: la del compás 1)
//   m.bpm                → tempo de referencia (la mediana de lo marcado, redondeado; 0 si no hay)
//   m.tonalidad          → { tonica, modo } o null; TempoMapa.nombreTonalidad(t) → "La mayor", "Fa♯ menor"
//   TempoMapa.mismaTonalidad(a, b) → misma tónica (Re♭ = Do♯) y mismo modo
//   m.compasSimple()     → pulsos por compás si la cifra del compás 1 es 2/4, 3/4 o 4/4 (lo que escriben Melodía y Arreglo); si no, 0
//   m.bpmEn(p)           → tempo alrededor del pulso p
//   m.secciones          → [{ compas, seg, nombre }] en orden (compas null = sin tempo en ese punto)
//   m.seccionEn(c)       → la sección del compás c (o null); m.seccionEnSeg(s) → la que suena en el segundo s (o null)
//   Fuera de los pulsos marcados se sigue con el tempo del borde.
//   await TempoMapa.cargar(baseStorage, cancionId) → mapa o null (lee el archivo público; sin clave); null si no hay
//                                                   pulsos marcados (lo que sigue la grabación necesita el tempo)
//   await TempoMapa.cargarFicha(baseStorage, cancionId) → la Ficha aunque no tenga tempo (tonalidad y cifra), o null
//   TempoMapa.desdeReaper(map, startQn, duracion)  → datos a partir de un mapa de Reaper (PT qn bpm; QN 0 = segundo 0)
// Usada por la app Tempo (TEMPO/), el Editor de Arreglos (ARREGLO/), el Editor de Melodías (MELODIA/), el Piano (PIANO/)
// y la ficha de la canción (REPERTORIO/).
(function () {
    function crear(d) {
        const P = (d?.pulsos || []).filter(x => typeof x === 'number' && isFinite(x)).sort((a, b) => a - b);
        const i0 = Math.max(0, Math.min(P.length - 1, d?.compas1 | 0));
        const cifras = (d?.cifras?.length ? d.cifras : [{ compas: 1, n: 4 }]).map(c => ({ compas: c.compas | 0, n: Math.max(1, c.n | 0), d: [2, 4, 8, 16].includes(c.d) ? c.d : 4 }))
            .sort((a, b) => a.compas - b.compas);
        // Periodo en un borde: mediana de los últimos intervalos (un pulso mal marcado no lo arruina)
        const periodo = desdeFin => {
            const difs = [];
            for (let k = 0; k < 4 && P.length > k + 1; k++) {
                const a = desdeFin ? P.length - 2 - k : k;
                difs.push(P[a + 1] - P[a]);
            }
            difs.sort((a, b) => a - b);
            return difs.length ? difs[Math.floor(difs.length / 2)] : 0.5;
        };
        const perIni = periodo(false), perFin = periodo(true);

        // Cada sección: su segundo (`seg`) y, si cae en lo marcado, su compás (EW: la estructura puede ir sin tempo)
        const secciones = (d?.secciones || []).filter(x => x && x.nombre).map(x => ({
            compas: typeof x.compas === 'number' && isFinite(x.compas) ? x.compas | 0 : null,
            seg: typeof x.seg === 'number' && isFinite(x.seg) ? x.seg : null, nombre: String(x.nombre) }));
        const tonalidad = d?.tonalidad && /^[A-G][#b]?$/.test(d.tonalidad.tonica) && (d.tonalidad.modo === 'mayor' || d.tonalidad.modo === 'menor')
            ? { tonica: d.tonalidad.tonica, modo: d.tonalidad.modo } : null;
        const m = { pulsos: P, compas1: i0, cifras, secciones, tonalidad, vacio: P.length < 2 };
        // Tempo de referencia: la mediana de los intervalos (los extremos y un pulso mal puesto no lo mueven)
        m.bpm = (() => {
            const b = []; for (let k = 0; k + 1 < P.length; k++) if (P[k + 1] > P[k]) b.push(60 / (P[k + 1] - P[k]));
            b.sort((x, y) => x - y);
            return b.length ? Math.round(b[Math.floor(b.length / 2)]) : 0;
        })();
        m.segDePulso = p => {
            if (!P.length) return 0;
            const x = i0 + p;
            if (x <= 0) return P[0] + x * perIni;
            if (x >= P.length - 1) return P[P.length - 1] + (x - (P.length - 1)) * perFin;
            const k = Math.floor(x);
            return P[k] + (x - k) * (P[k + 1] - P[k]);
        };
        m.pulsoDeSeg = s => {
            if (!P.length) return 0;
            if (s <= P[0]) return (s - P[0]) / perIni - i0;
            if (s >= P[P.length - 1]) return P.length - 1 + (s - P[P.length - 1]) / perFin - i0;
            let lo = 0, hi = P.length - 1;
            while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (P[mid] <= s) lo = mid; else hi = mid; }
            return lo + (s - P[lo]) / (P[hi] - P[lo]) - i0;
        };
        m.cifraEn = c => { let n = cifras[0].n; for (const x of cifras) if (x.compas <= c) n = x.n; return n; };
        m.compasSimple = () => { const y = cifras.filter(x => x.compas <= 1).pop() || cifras[0]; return y.d === 4 && y.n >= 2 && y.n <= 4 ? y.n : 0; };
        m.cifraTexto = (c = 1) => { let y = cifras[0]; for (const x of cifras) if (x.compas <= c) y = x; return `${y.n}/${y.d}`; };
        m.pulsoDeCompas = c => {
            let p = 0;
            if (c >= 1) for (let k = 1; k < c; k++) p += m.cifraEn(k);
            else for (let k = c; k < 1; k++) p -= m.cifraEn(k);
            return p;
        };
        m.compasDePulso = p => {
            const f = Math.floor(p + 1e-6);
            let c = 1, ini = 0;
            if (f >= 0) { while (ini + m.cifraEn(c) <= f) { ini += m.cifraEn(c); c++; } }
            else { while (ini > f) { c--; ini -= m.cifraEn(c); } }
            return { compas: c, tiempo: f - ini + 1 };
        };
        m.bpmEn = p => {
            const x = Math.floor(i0 + p);
            if (P.length < 2) return 0;
            const k = Math.max(0, Math.min(P.length - 2, x));
            return 60 / (P[k + 1] - P[k]);
        };
        // Con pulsos manda el compás (el segundo se calcula); sin compás, manda el segundo
        if (P.length >= 2) for (const x of secciones) if (x.compas !== null) x.seg = m.segDePulso(m.pulsoDeCompas(x.compas));
        secciones.splice(0, secciones.length, ...secciones.filter(x => x.seg !== null || x.compas !== null)
            .sort((a, b) => (a.seg ?? 0) - (b.seg ?? 0) || (a.compas ?? 0) - (b.compas ?? 0)));
        m.seccionEn = c => { let s = null; for (const x of secciones) if (x.compas !== null && x.compas <= c) s = x; return s; };
        m.seccionEnSeg = t => { let s = null; for (const x of secciones) if (x.seg !== null && x.seg <= t + 1e-6) s = x; return s; };
        const secDatos = () => secciones.map(x => ({ ...(x.compas !== null ? { compas: x.compas } : {}), ...(x.seg !== null ? { seg: Math.round(x.seg * 1000) / 1000 } : {}), nombre: x.nombre }));
        m.datos = () => ({ v: 1, pulsos: P.map(x => Math.round(x * 1000) / 1000), compas1: i0, cifras, ...(secciones.length ? { secciones: secDatos() } : {}),
            ...(tonalidad ? { tonalidad } : {}), ...(m.bpm ? { bpm: m.bpm } : {}) });
        return m;
    }

    async function leer(base, cancionId) {
        if (!cancionId) return null;
        try {
            const r = await fetch(`${base}tempo/${encodeURIComponent(cancionId)}.json?t=${Date.now()}`, { cache: 'no-store' });
            return r.ok ? await r.json() : null;
        } catch (_) { return null; }
    }
    async function cargar(base, cancionId) {
        const d = await leer(base, cancionId);
        return d?.pulsos?.length >= 2 ? crear(d) : null;
    }
    async function cargarFicha(base, cancionId) {
        const d = await leer(base, cancionId);
        return d ? crear(d) : null;
    }

    // Reaper: QN 0 = segundo 0 de la grabación; start_qn = donde empieza el compás 1 de la partitura
    function desdeReaper(map, startQn, duracion, n = 4) {
        const M = [...map].sort((a, b) => a.qn - b.qn);
        if (!M.length) return null;
        // Cada tramo suena al tempo de su punto; antes del primero, al tempo del primero
        const segDeQn = q => {
            let s = 0, prev = 0, bpm = M[0].bpm;
            for (const pt of M) {
                if (pt.qn >= q) break;
                if (pt.qn > prev) { s += (pt.qn - prev) * 60 / bpm; prev = pt.qn; }
                bpm = pt.bpm;
            }
            return s + (q - prev) * 60 / bpm;
        };
        const pulsos = [];
        for (let q = 0; ; q++) { const s = segDeQn(q); if (s > duracion + 0.001 || q > 5000) break; pulsos.push(s); }
        return { v: 1, pulsos, compas1: Math.max(0, Math.round(startQn || 0)), cifras: [{ compas: 1, n }] };
    }

    const SOLF = { C: 'Do', D: 'Re', E: 'Mi', F: 'Fa', G: 'Sol', A: 'La', B: 'Si' };
    const pcDe = t => ({ C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[t[0]] + (t[1] === '#' ? 1 : t[1] === 'b' ? -1 : 0) + 12) % 12;
    const mismaTonalidad = (a, b) => !!(a?.tonica && b?.tonica) && a.modo === b.modo && pcDe(a.tonica) === pcDe(b.tonica);
    const nombreTonalidad = t => t?.tonica ? `${SOLF[t.tonica[0]]}${t.tonica[1] === '#' ? '♯' : t.tonica[1] === 'b' ? '♭' : ''} ${t.modo}` : '';
    // Las tónicas que se ofrecen (las mismas del Editor de Melodías y del Arreglo)
    const TONICAS = {
        mayor: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'],
        menor: ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D', 'G', 'C', 'F', 'Bb', 'Eb'],
    };

    window.TempoMapa = { crear, cargar, cargarFicha, desdeReaper, nombreTonalidad, mismaTonalidad, TONICAS };
})();
