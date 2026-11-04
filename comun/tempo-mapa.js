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
//   m.compasSimple()     → pulsos por compás si la cifra del compás 1 es 2/4, 3/4 o 4/4; si no, 0
//   m.cifraApp()         → TempoMapa.cifraInfo de la cifra del compás 1 (o null si no es del sistema; deudas FN y FO)
//   TempoMapa.cambiarCifra(datos, { compas, n, d }, 'compases' | 'pulsos') → datos con la nueva cifra (las secciones
//                          quedan en su segundo); TempoMapa.preguntarCambioCifra(datos, cambio) → pregunta cuál (FQ)
//   TempoMapa.CIFRAS     → las cifras del sistema; TempoMapa.cifraInfo('6/8') → { n, d, compas (negras por compás),
//                          pulso (negras por pulso contado), pulsos, figura, mapa (negras por pulso del mapa) }
//   m.bpmEn(p)           → tempo alrededor del pulso p
//   m.secciones          → [{ compas, seg, nombre }] en orden (compas null = sin tempo en ese punto)
//   m.seccionEn(c)       → la sección del compás c (o null); m.seccionEnSeg(s) → la que suena en el segundo s (o null)
//   Sección ligada a un verso de la letra (EX): sin nada = el comienzo de estrofa más cercano a su comienzo (−1 s a +8 s);
//   `letra: false` = desligada a mano; `letraSeg: s` = ligada a mano al verso (cualquiera) que se canta en s.
//   TempoMapa.versosDeLetra(contenido, synced) → [{ seg, texto, estrofa, primero }];
//   m.letraDeSecciones(versos) → por sección [{ verso (índice o null), auto }]
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
            seg: typeof x.seg === 'number' && isFinite(x.seg) ? x.seg : null, nombre: String(x.nombre),
            ...(x.letra === false ? { letra: false } : typeof x.letraSeg === 'number' && isFinite(x.letraSeg) ? { letraSeg: x.letraSeg } : {}) }));
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
        // La cifra del compás 1 como la escriben las apps (deudas FN y FO): cifraInfo, o null si no es del sistema
        m.cifraApp = () => cifraInfo(m.cifraTexto(1));
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
        const secDatos = () => secciones.map(x => ({ ...(x.compas !== null ? { compas: x.compas } : {}), ...(x.seg !== null ? { seg: Math.round(x.seg * 1000) / 1000 } : {}), nombre: x.nombre,
            ...(x.letra === false ? { letra: false } : x.letraSeg !== undefined ? { letraSeg: Math.round(x.letraSeg * 1000) / 1000 } : {}) }));
        // El verso de cada sección (EX). versos = [{ seg (null sin tiempo), primero (comienzo de estrofa) }].
        // → por sección (en el orden de m.secciones): { verso (índice o null), auto (si es el de por cercanía) }
        m.letraDeSecciones = versos => {
            const T = (versos || []).map(v => v.seg ?? null), inicios = (versos || []).map(v => v.primero ? v.seg ?? null : null);
            // Primero las ligadas a mano (mandan; a cualquier verso); después las automáticas (a un comienzo de estrofa)
            const usados = new Set();
            const res = secciones.map(x => {
                if (x.letraSeg === undefined) return null;
                const v = cercana(T, x.letraSeg, x.letraSeg - 3, x.letraSeg + 3, usados);
                if (v !== null) usados.add(v);
                return { verso: v, auto: false };
            });
            return secciones.map((x, i) => {
                if (res[i]) return res[i];
                if (x.letra === false || x.seg === null) return { verso: null, auto: false };
                const sig = secciones[i + 1]?.seg ?? Infinity;
                const v = cercana(inicios, x.seg, x.seg - 1, Math.min(x.seg + 8, sig - 0.5), usados);
                if (v !== null) usados.add(v);
                return { verso: v, auto: v !== null };
            });
        };
        m.datos = () => ({ v: 1, pulsos: P.map(x => Math.round(x * 1000) / 1000), compas1: i0, cifras, ...(secciones.length ? { secciones: secDatos() } : {}),
            ...(tonalidad ? { tonalidad } : {}), ...(m.bpm ? { bpm: m.bpm } : {}) });
        return m;
    }

    // El índice cuyo segundo está entre a y b, el más cercano a t; null si no hay
    function cercana(inicios, t, a, b, usadas) {
        let k = null;
        (inicios || []).forEach((s, i) => {
            if (s === null || s < a || s > b || usadas.has(i)) return;
            if (k === null || Math.abs(s - t) < Math.abs(inicios[k] - t)) k = i;
        });
        return k;
    }
    // Versos de una letra sincronizada, como los arma el Entrenador (EX): el texto da el orden y las estrofas (una
    // línea vacía entre ellas); el LRC da el segundo de cada verso (una cola por texto, para versos repetidos).
    // → [{ seg (o null), texto, estrofa (n°), primero (el primer verso con tiempo de su estrofa) }]
    function versosDeLetra(contenido, synced) {
        const cola = new Map(), re = /\[(\d{2}):(\d{2})[.:](\d{2,3})(?:-[^\]]*)?\](.*)$/gm;
        const lrc = []; let r;
        while ((r = re.exec(synced || '')) !== null) lrc.push({ seg: +r[1] * 60 + +r[2] + (r[3].length === 2 ? +r[3] / 100 : +r[3] / 1000), texto: r[4].trim() });
        lrc.sort((a, b) => a.seg - b.seg).forEach(x => { if (!cola.has(x.texto)) cola.set(x.texto, []); cola.get(x.texto).push(x.seg); });
        const base = contenido ? contenido.split('\n') : lrc.map(x => x.texto);
        const out = []; let e = -1, nueva = true, conPrimero = false;
        for (const raw of base) {
            const t = raw.trim();
            if (!t) { nueva = true; continue; }
            if (nueva) { e++; nueva = false; conPrimero = false; }
            const seg = cola.get(t)?.shift() ?? null;
            const primero = seg !== null && !conPrimero;
            if (primero) conPrimero = true;
            out.push({ seg, texto: t, estrofa: e, primero });
        }
        return out;
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
    // Cifras del sistema (deuda FO): las ofrecen la Ficha y todas las apps musicales. Cómo se cuenta cada una:
    // x/4 en negras · 2/2 en blancas · 6/8, 9/8 y 12/8 en negra con punto · 3/8 y 7/8 en corcheas.
    const CIFRAS = ['2/4', '3/4', '4/4', '5/4', '6/4', '7/4', '2/2', '3/8', '6/8', '7/8', '9/8', '12/8'];
    // → { texto, n, d, compas (negras por compás), pulso (negras por pulso contado), pulsos (por compás),
    //     figura (del pulso: ♩ 𝅗𝅥 ♩. ♪), mapa (negras por pulso del mapa de tempo = 4/d) } o null
    function cifraInfo(texto) {
        if (!CIFRAS.includes(texto)) return null;
        const [n, d] = texto.split('/').map(Number);
        const compuesta = d === 8 && n % 3 === 0 && n > 3;
        const pulso = d === 2 ? 2 : d === 4 ? 1 : compuesta ? 1.5 : 0.5;
        const compas = n * 4 / d;
        return { texto, n, d, compas, pulso, pulsos: Math.round(compas / pulso), figura: { 2: '𝅗𝅥', 1: '♩', 1.5: '♩.', 0.5: '♪' }[pulso], mapa: 4 / d };
    }

    // ── Cambiar la cifra de una Ficha que ya tiene tempo (deuda FQ) ───────────────────────────────────────────
    // cambio = { compas (desde qué compás; 1 = toda la canción), n, d }. modo:
    //   'compases' → cada compás sigue empezando donde estaba y dura lo mismo; se reparten de nuevo sus pulsos
    //   'pulsos'   → los pulsos marcados se quedan y se agrupan en compases del nuevo tamaño
    // En los dos, las secciones quedan en su segundo de la grabación (se recalcula su compás: el 1 más cercano).
    function nuevasCifras(cifras, { compas: c = 1, n, d }) {
        let cs = (cifras?.length ? cifras : [{ compas: 1, n: 4, d: 4 }]).map(x => ({ compas: x.compas | 0, n: x.n, d: x.d || 4 }))
            .sort((a, b) => a.compas - b.compas);
        if (c <= cs[0].compas) Object.assign(cs[0], { n, d });
        else {
            const x = cs.find(y => y.compas === c);
            if (x) Object.assign(x, { n, d }); else cs.push({ compas: c, n, d });
            cs.sort((a, b) => a.compas - b.compas);
        }
        return cs.filter((y, i) => i === 0 || y.n !== cs[i - 1].n || y.d !== cs[i - 1].d);   // un cambio que repite la anterior sobra
    }
    function cambiarCifra(datos, cambio, modo) {
        const d0 = JSON.parse(JSON.stringify(datos || {}));
        const cifras = nuevasCifras(d0.cifras, cambio);
        const m1 = crear(d0), P = m1.pulsos;
        let pulsos = P.slice(), compas1 = m1.compas1;
        if (modo === 'compases' && P.length >= 2) {
            // El 1 de cada compás (en segundos), del primero al último que cae en lo marcado
            const cIni = m1.compasDePulso(-m1.compas1).compas, unos = [];
            for (let c = cIni; ; c++) {
                const t = m1.segDePulso(m1.pulsoDeCompas(c));
                if (t > P[P.length - 1] + 1e-3) break;
                if (t >= P[0] - 1e-3) unos.push({ c, t });
                if (unos.length > 5000) break;
            }
            const m2 = crear({ pulsos: [0, 1], cifras });   // solo para saber cuántos pulsos tiene cada compás
            pulsos = []; compas1 = 0;
            unos.forEach((u, i) => {
                if (u.c === 1) compas1 = pulsos.length;
                pulsos.push(u.t);
                const sig = unos[i + 1]; if (!sig) return;
                const k = m2.cifraEn(u.c), paso = (sig.t - u.t) / k;
                for (let j = 1; j < k; j++) pulsos.push(u.t + j * paso);
            });
        }
        const nuevo = { ...d0, pulsos, compas1, cifras };
        const m3 = crear({ ...nuevo, secciones: [] });
        // Cada sección: su mismo segundo → el 1 de compás más cercano
        nuevo.secciones = (m1.secciones || []).map(x => {
            const y = { ...x };
            if (x.seg !== null && x.compas !== null && m3.pulsos.length >= 2) {
                const p = m3.pulsoDeSeg(x.seg), c = m3.compasDePulso(p).compas;
                const a = m3.segDePulso(m3.pulsoDeCompas(c)), b = m3.segDePulso(m3.pulsoDeCompas(c + 1));
                y.compas = Math.abs(b - x.seg) < Math.abs(a - x.seg) ? c + 1 : c;
            }
            if (y.compas === null) delete y.compas;
            if (y.seg === null) delete y.seg;
            return y;
        });
        return crear(nuevo).datos();
    }
    // Pregunta cómo cambiar la cifra (solo si hay tempo marcado) → Promise<{ datos, modo } | null (cancelado)>
    function preguntarCambioCifra(datos, cambio) {
        const m = crear(datos);
        if (m.pulsos.length < 2) return Promise.resolve({ datos: cambiarCifra(datos, cambio, 'pulsos'), modo: 'pulsos' });
        const texto = `${cambio.n}/${cambio.d}`, antes = m.cifraTexto(Math.max(1, cambio.compas || 1));
        const op = ['compases', 'pulsos'].map(modo => {
            const dd = cambiarCifra(datos, cambio, modo), mm = crear(dd), inf = cifraInfo(texto);
            const tempo = inf ? `${inf.figura} ${Math.round(mm.bpm * inf.mapa / inf.pulso)}` : `${mm.bpm}`;
            const c = Math.max(1, cambio.compas || 1), dur = mm.segDePulso(mm.pulsoDeCompas(c + 1)) - mm.segDePulso(mm.pulsoDeCompas(c));
            return { modo, datos: dd, tempo, dur: dur.toFixed(1).replace('.', ',') };
        });
        return new Promise(res => {
            const fondo = document.createElement('div');
            fondo.style.cssText = 'position:fixed;inset:0;background:rgba(2,6,23,.7);display:flex;align-items:center;justify-content:center;z-index:9999;font-family:system-ui,sans-serif';
            const b = 'display:block;width:100%;text-align:left;margin:6px 0;padding:10px 12px;border-radius:9px;border:1px solid #475569;background:#1e293b;color:#e2e8f0;cursor:pointer;font:inherit';
            fondo.innerHTML = `<div style="background:#0f172a;color:#e2e8f0;border:1px solid #334155;border-radius:12px;padding:16px 18px;width:min(460px,92vw)">
                <div style="font-weight:700;font-size:16px;margin-bottom:6px">Cambiar el compás de ${antes} a ${texto}</div>
                <div style="font-size:13px;color:#94a3b8;margin-bottom:8px">La canción ya tiene el tempo marcado. Las secciones se quedan en su lugar de la grabación.</div>
                <button data-m="compases" style="${b}"><b>Mantener los compases</b><br><span style="font-size:13px;color:#94a3b8">Cada compás sigue durando ${op[0].dur} s · tempo ${op[0].tempo}</span></button>
                <button data-m="pulsos" style="${b}"><b>Mantener los pulsos</b><br><span style="font-size:13px;color:#94a3b8">Tus marcas se agrupan de nuevo: cada compás dura ${op[1].dur} s · tempo ${op[1].tempo}</span></button>
                <button data-m="" style="${b};text-align:center;background:transparent">Cancelar</button></div>`;
            const fin = r => { fondo.remove(); document.removeEventListener('keydown', esc, true); res(r); };
            const esc = e => { if (e.key === 'Escape') { e.preventDefault(); fin(null); } };
            fondo.addEventListener('click', e => {
                const x = e.target.closest('[data-m]');
                if (x) fin(x.dataset.m ? op.find(o => o.modo === x.dataset.m) : null);
                else if (e.target === fondo) fin(null);
            });
            document.addEventListener('keydown', esc, true);
            document.body.appendChild(fondo);
        });
    }
    const TONICAS = {
        mayor: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'],
        menor: ['A', 'E', 'B', 'F#', 'C#', 'G#', 'D', 'G', 'C', 'F', 'Bb', 'Eb'],
    };

    window.TempoMapa = { crear, cargar, cargarFicha, desdeReaper, nombreTonalidad, mismaTonalidad, TONICAS, versosDeLetra, CIFRAS, cifraInfo, cambiarCifra, preguntarCambioCifra };
})();
