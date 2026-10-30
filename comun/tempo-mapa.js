// TempoMapa (deuda EU): el mapa de tempo de una canción = dónde cae cada pulso de su grabación.
// Melodía y Karaoke van exactamente juntas (ET), así que un mapa sirve para las dos.
//
//   Datos (recurso `tempo` de la canción y archivo público repertorio-assets/tempo/<cancion_id>.json):
//     { v: 1, pulsos: [seg…],            // cada pulso, en segundos de la grabación original, en orden
//       compas1: i,                      // índice del pulso donde empieza el compás 1 (los anteriores: compás 0, −1…)
//       cifras: [{ compas: 1, n: 4 }] }  // pulsos por compás desde ese compás (la primera vale también hacia atrás)
//
//   const m = TempoMapa.crear(datos);
//   m.segDePulso(p)      → segundo de la grabación del pulso p (p = 0 es el tiempo 1 del compás 1; admite decimales)
//   m.pulsoDeSeg(s)      → pulso (con decimales) que suena en el segundo s
//   m.pulsoDeCompas(c)   → pulso donde empieza el compás c
//   m.compasDePulso(p)   → { compas, tiempo } (tiempo 1 = el primero del compás)
//   m.cifraEn(c)         → pulsos del compás c
//   m.bpmEn(p)           → tempo alrededor del pulso p
//   Fuera de los pulsos marcados se sigue con el tempo del borde.
//   await TempoMapa.cargar(baseStorage, cancionId) → mapa o null (lee el archivo público; sin clave)
//   TempoMapa.desdeReaper(map, startQn, duracion)  → datos a partir de un mapa de Reaper (PT qn bpm; QN 0 = segundo 0)
// Usada por la app Tempo (TEMPO/), el Editor de Arreglos (ARREGLO/) y el Piano (PIANO/).
(function () {
    function crear(d) {
        const P = (d?.pulsos || []).filter(x => typeof x === 'number' && isFinite(x)).sort((a, b) => a - b);
        const i0 = Math.max(0, Math.min(P.length - 1, d?.compas1 | 0));
        const cifras = (d?.cifras?.length ? d.cifras : [{ compas: 1, n: 4 }]).map(c => ({ compas: c.compas | 0, n: Math.max(1, c.n | 0) }))
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

        const m = { pulsos: P, compas1: i0, cifras, vacio: P.length < 2 };
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
        m.datos = () => ({ v: 1, pulsos: P.map(x => Math.round(x * 1000) / 1000), compas1: i0, cifras });
        return m;
    }

    async function cargar(base, cancionId) {
        if (!cancionId) return null;
        try {
            const r = await fetch(`${base}tempo/${encodeURIComponent(cancionId)}.json?t=${Date.now()}`, { cache: 'no-store' });
            if (!r.ok) return null;
            const d = await r.json();
            return d?.pulsos?.length >= 2 ? crear(d) : null;
        } catch (_) { return null; }
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

    window.TempoMapa = { crear, cargar, desdeReaper };
})();
