/* ============================================================================
 * ritmo.js — NÚCLEO RÍTMICO (Etapa 0)
 * ----------------------------------------------------------------------------
 * Única fuente de verdad para: parsing, validación, representación interna,
 * serialización y cálculo de duraciones de ejercicios rítmicos.
 *
 * PRINCIPIO DE DISEÑO (decisión arquitectónica):
 *   Este módulo NO conoce Pizarra, Portal, slides, sesiones, canciones,
 *   Supabase ni el DOM. Recibe un STRING de definición pura y devuelve DATOS.
 *   El envoltorio de transporte (@ritmo, ---, filas de assets) es
 *   responsabilidad de otras capas, nunca de aquí.
 *
 * En esta etapa NO se implementan: renderers (partitura/infantil), audio,
 * Web Audio, cursor ni FX. Solo el modelo temporal reutilizable.
 *
 * Representación temporal: PPQ = 48 (negra = 48 ticks) → enteros exactos para
 * puntillos y tresillos, sin errores de coma flotante.
 * ==========================================================================*/

(function (root, factory) {
    const RITMO = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = RITMO;
        // `node ritmo.js` corre la batería de pruebas; require(...) no la corre.
        if (require.main === module) RITMO.__runTests();
    } else {
        root.RITMO = RITMO;
    }
})(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    // ── CONSTANTES TEMPORALES ────────────────────────────────────────────────
    const PPQ = 48;                       // ticks por negra
    const BASE_TICKS = {                  // duración base (sin puntillo)
        r: 192,   // redonda
        b: 96,    // blanca
        n: 48,    // negra
        c: 24,    // corchea
        s: 12,    // semicorchea
    };
    const FIGURAS = 'rbncs';
    const MODOS   = ['partitura', 'infantil'];

    // ── ERROR TIPADO ─────────────────────────────────────────────────────────
    class RitmoError extends Error {
        constructor(code, msg, detalle) {
            super(msg || code);
            this.name = 'RitmoError';
            this.code = code;
            this.detalle = detalle || null;   // { linea, pos, ... } cuando aplique
        }
    }

    // ── UTILIDADES ──────────────────────────────────────────────────────────
    function genId() {
        return 'rit_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    // Duración en ticks de una figura simple (con o sin puntillo). Entero exacto.
    function figTicks(fig, dotted) {
        const base = BASE_TICKS[fig];
        if (base === undefined) return null;
        return dotted ? base * 3 / 2 : base;   // ×1.5 → siempre entero (base múltiplo de 2)
    }

    // Construye el objeto meter a partir del string de compás.
    function crearMeter(compasStr) {
        const s = (compasStr || '').trim();
        if (s === '4/4') return { num: 4, den: 4, capacityTicks: 192, beats: 4, beatTicks: 48, group: 'simple' };
        if (s === '6/8') return { num: 6, den: 8, capacityTicks: 144, beats: 2, beatTicks: 72, group: 'compound' };
        throw new RitmoError('COMPAS_NO_SOPORTADO', `Compás no soportado: "${s}" (solo 4/4 o 6/8)`);
    }

    // ── LECTOR DE FIGURA ──────────────────────────────────────────────────────
    // Lee una figura (letra + puntillo opcional) desde s[i]. Devuelve null si no hay.
    function leerFigura(s, i) {
        const ch = s[i];
        if (FIGURAS.indexOf(ch) === -1) return null;
        let j = i + 1, dotted = false;
        if (s[j] === '.') { dotted = true; j++; }
        return { fig: ch, dotted, next: j, ticks: figTicks(ch, dotted) };
    }

    // ── ANALIZADOR DE UNA LÍNEA (independiente del compás) ────────────────────
    // Devuelve { events, durTick, error }. `error` es null o { code, msg, pos }.
    // startTick de cada evento es relativo al inicio del compás.
    // No decide si el compás está completo/excedido (eso lo hace validarLinea,
    // que conoce la capacidad del meter).
    function analizarLinea(linea) {
        const s = linea;
        const events = [];
        let cursor = 0;   // tick actual dentro del compás
        let i = 0;
        let grupoN = 0;   // contador de grupos de tresillo dentro de la línea

        const err = (code, msg, pos) => ({ events, durTick: cursor, error: { code, msg, pos } });

        while (i < s.length) {
            const ch = s[i];

            // ── Figura simple ──
            const f = leerFigura(s, i);
            if (f) {
                events.push({ startTick: cursor, durTick: f.ticks, fig: f.fig, dotted: f.dotted, tuplet: null });
                cursor += f.ticks;
                i = f.next;
                continue;
            }

            // ── Tresillo: (base,contenido) ──
            if (ch === '(') {
                let j = i + 1;

                // base
                const base = leerFigura(s, j);
                if (!base) return err('TRESILLO_BASE_INVALIDA', `Base de tresillo inválida en posición ${j}`, j);
                j = base.next;

                // coma
                if (s[j] !== ',') return err('TRESILLO_SIN_COMA', `Falta la coma tras la base del tresillo en posición ${j}`, j);
                j++;

                // contenido
                const baseTicks = base.ticks;
                const objetivoNominal = baseTicks * 3;  // el contenido nominal debe sumar 3×base
                const contenido = [];
                let nominal = 0;
                let cerrado = false;
                while (j < s.length) {
                    const cj = s[j];
                    if (cj === ')') { cerrado = true; j++; break; }
                    if (cj === '(') return err('TRESILLO_ANIDADO', `Tresillo anidado no permitido en posición ${j}`, j);
                    const cf = leerFigura(s, j);
                    if (!cf) return err('FIGURA_DESCONOCIDA', `Carácter inesperado "${cj}" dentro del tresillo en posición ${j}`, j);
                    contenido.push(cf);
                    nominal += cf.ticks;
                    j = cf.next;
                }
                if (!cerrado)          return err('PAREN_SIN_CERRAR', `Paréntesis de tresillo sin cerrar desde posición ${i}`, i);
                if (contenido.length === 0) return err('TRESILLO_CONTENIDO_INVALIDO', `Tresillo sin contenido en posición ${i}`, i);
                if (nominal !== objetivoNominal) {
                    return err('TRESILLO_DURACION',
                        `Duración de tresillo incorrecta: contenido nominal ${nominal} ≠ 3×base ${objetivoNominal}`, i);
                }

                // Emite un evento por cada figura del contenido, escalada por 2/3.
                // (3 en el tiempo de 2). Todas las duraciones resultan enteras
                // porque BASE_TICKS es múltiplo de 3.
                const groupId = 't' + (grupoN++);
                const baseStr = base.fig + (base.dotted ? '.' : '');
                for (const cf of contenido) {
                    const effDur = cf.ticks * 2 / 3;
                    events.push({
                        startTick: cursor,
                        durTick: effDur,
                        fig: cf.fig,
                        dotted: cf.dotted,
                        tuplet: { ratio: '3:2', groupId, base: baseStr },
                    });
                    cursor += effDur;
                }
                // El grupo ocupa exactamente 2×base ticks.
                i = j;
                continue;
            }

            // ── Errores de carácter suelto ──
            if (ch === ')') return err('PAREN_INESPERADO', `Paréntesis de cierre inesperado en posición ${i}`, i);
            if (ch === '.') return err('PUNTO_MAL_COLOCADO', `Puntillo sin figura previa en posición ${i}`, i);
            return err('FIGURA_DESCONOCIDA', `Figura/carácter desconocido "${ch}" en posición ${i}`, i);
        }

        return { events, durTick: cursor, error: null };
    }

    // ── VALIDACIÓN DE UNA LÍNEA (conoce la capacidad del compás) ──────────────
    // Devuelve { valida, durTick, esperado, events, error }.
    function validarLinea(linea, meter) {
        const esperado = meter.capacityTicks;
        if (linea == null || linea.trim() === '') {
            return { valida: false, durTick: 0, esperado, events: [], error: { code: 'LINEA_VACIA', msg: 'Línea vacía (se esperaba un compás)' } };
        }
        const r = analizarLinea(linea.trim());
        if (r.error) {
            return { valida: false, durTick: r.durTick, esperado, events: r.events, error: r.error };
        }
        if (r.durTick > esperado) {
            return { valida: false, durTick: r.durTick, esperado, events: r.events,
                     error: { code: 'COMPAS_EXCEDIDO', msg: `Compás excedido: ${r.durTick} > ${esperado} ticks` } };
        }
        if (r.durTick < esperado) {
            return { valida: false, durTick: r.durTick, esperado, events: r.events,
                     error: { code: 'COMPAS_INCOMPLETO', msg: `Compás incompleto: ${r.durTick} < ${esperado} ticks` } };
        }
        return { valida: true, durTick: r.durTick, esperado, events: r.events, error: null };
    }

    // Exposición meter-independiente (útil para futuros consumidores).
    function parseLinea(linea) {
        return analizarLinea((linea || '').trim());
    }

    // ── CABECERA ──────────────────────────────────────────────────────────────
    const CLAVES_HEADER = new Set(['id', 'compas', 'bpm', 'rep', 'reps', 'modo']);

    function parseHeaderValor(header, key, val) {
        switch (key) {
            case 'id':     header.id = val.trim(); break;
            case 'compas': header.compas = val.trim(); break;
            case 'bpm': {
                const n = Number(val.trim());
                if (!Number.isInteger(n) || n <= 0) throw new RitmoError('BPM_INVALIDO', `BPM inválido: "${val.trim()}"`);
                header.bpm = n; break;
            }
            case 'rep':
            case 'reps': {
                const n = Number(val.trim());
                if (!Number.isInteger(n) || n < 1) throw new RitmoError('REPS_INVALIDO', `Repeticiones inválidas: "${val.trim()}"`);
                header.reps = n; break;
            }
            case 'modo': {
                const m = val.trim().toLowerCase();
                if (!MODOS.includes(m)) throw new RitmoError('MODO_INVALIDO', `Modo inválido: "${val.trim()}" (partitura|infantil)`);
                header.modo = m; break;
            }
        }
    }

    // ── PARSER PRINCIPAL ──────────────────────────────────────────────────────
    // defString: definición PURA (sin @ritmo ni ---). Devuelve el objeto ritmo
    // validado o lanza RitmoError con .code y .detalle.
    function parse(defString) {
        if (typeof defString !== 'string') {
            throw new RitmoError('ENTRADA_INVALIDA', 'parse() espera un string de definición');
        }
        const rawLines = defString.split(/\r?\n/);
        const header = {};              // valores crudos de cabecera
        const lineasCompas = [];        // { texto, nLinea } (1-based, del archivo)

        rawLines.forEach((raw, idx) => {
            const t = raw.trim();
            if (t === '') return;       // se ignoran líneas en blanco de separación
            const m = t.match(/^([A-Za-z_]+)\s*:\s*(.*)$/);
            if (m) {
                const key = m[1].toLowerCase();
                if (!CLAVES_HEADER.has(key)) {
                    throw new RitmoError('CABECERA_DESCONOCIDA', `Clave de cabecera desconocida: "${m[1]}"`, { linea: idx + 1 });
                }
                parseHeaderValor(header, key, m[2]);
            } else {
                lineasCompas.push({ texto: t, nLinea: idx + 1 });
            }
        });

        // compás es obligatorio
        if (!header.compas) throw new RitmoError('FALTA_COMPAS', 'Falta la clave "compas" en la cabecera');
        const meter = crearMeter(header.compas);   // lanza COMPAS_NO_SOPORTADO si no es 4/4 o 6/8

        if (lineasCompas.length === 0) throw new RitmoError('SIN_COMPASES', 'La definición no contiene ningún compás');

        // Defaults sensatos
        const bpm  = header.bpm  !== undefined ? header.bpm  : 90;
        const reps = header.reps !== undefined ? header.reps : 1;
        const modo = header.modo !== undefined ? header.modo : 'partitura';
        const id   = header.id   && header.id.length ? header.id : genId();

        // Construcción de compases con validación e índice global de eventos.
        const measures = [];
        let evIdx = 0;
        for (const { texto, nLinea } of lineasCompas) {
            const v = validarLinea(texto, meter);
            if (!v.valida) {
                throw new RitmoError(v.error.code,
                    `Compás inválido (línea ${nLinea}): ${v.error.msg}`,
                    { linea: nLinea, texto, durTick: v.durTick, esperado: v.esperado });
            }
            const events = v.events.map(e => ({ ...e, evIdx: evIdx++ }));
            measures.push({ capacityTicks: meter.capacityTicks, events });
        }

        return {
            id, bpm, reps, modo, meter, measures,
            ticksPorRep: meter.capacityTicks * measures.length,
        };
    }

    // ── SERIALIZACIÓN ─────────────────────────────────────────────────────────
    // Reconstruye un compás a texto canónico a partir de sus eventos.
    function serializeMeasure(measure) {
        const ev = measure.events;
        let out = '';
        let i = 0;
        while (i < ev.length) {
            const e = ev[i];
            if (e.tuplet) {
                const gid = e.tuplet.groupId;
                const base = e.tuplet.base;
                let contenido = '';
                while (i < ev.length && ev[i].tuplet && ev[i].tuplet.groupId === gid) {
                    contenido += ev[i].fig + (ev[i].dotted ? '.' : '');
                    i++;
                }
                out += '(' + base + ',' + contenido + ')';
            } else {
                out += e.fig + (e.dotted ? '.' : '');
                i++;
            }
        }
        return out;
    }

    // Genera la definición textual PURA (sin @ritmo ni ---).
    // Invariante: serialize(parse(serialize(obj))) === serialize(obj).
    function serialize(obj) {
        const lines = [];
        if (obj.id) lines.push('id: ' + obj.id);
        lines.push('compas: ' + obj.meter.num + '/' + obj.meter.den);
        lines.push('bpm: ' + obj.bpm);
        lines.push('rep: ' + obj.reps);
        lines.push('modo: ' + obj.modo);
        for (const m of obj.measures) lines.push(serializeMeasure(m));
        return lines.join('\n');
    }

    // ── API PÚBLICA ───────────────────────────────────────────────────────────
    const RITMO = {
        // constantes
        PPQ, BASE_TICKS, FIGURAS, MODOS,
        // fábricas / utilidades
        genId, crearMeter, figTicks,
        // núcleo
        parse, serialize,
        parseLinea, validarLinea,
        // error
        RitmoError,
    };

    // ── BATERÍA DE PRUEBAS (solo Node: `node ritmo.js`) ───────────────────────
    RITMO.__runTests = function () {
        let pass = 0, fail = 0;
        const log = (...a) => console.log(...a);

        function ok(cond, name) {
            if (cond) { pass++; /* log('  ✓', name); */ }
            else { fail++; log('  ✕ FALLA:', name); }
        }
        function eq(actual, expected, name) {
            ok(actual === expected, `${name}  (esperado ${expected}, obtenido ${actual})`);
        }
        // valida una línea y comprueba código de error esperado (o validez)
        function linea(txt, compas, expected) {
            const meter = crearMeter(compas);
            const v = validarLinea(txt, meter);
            if (expected === true) {
                ok(v.valida, `[${compas}] "${txt}" → válida (${v.durTick}/${v.esperado})`);
            } else {
                ok(!v.valida && v.error.code === expected,
                   `[${compas}] "${txt}" → inválida ${expected} (obtenido ${v.valida ? 'válida' : v.error.code}, ${v.durTick}/${v.esperado})`);
            }
        }
        function lanza(fn, code, name) {
            try { fn(); ok(false, `${name} → debía lanzar ${code} pero no lanzó`); }
            catch (e) { ok(e instanceof RitmoError && e.code === code, `${name} → lanza ${code} (obtenido ${e.code || e.message})`); }
        }

        log('\n═══ ritmo.js — batería de pruebas Etapa 0 ═══\n');

        // ── Duraciones base y puntillos ──
        log('· Figuras y puntillos');
        eq(figTicks('n', false), 48, 'n = 48');
        eq(figTicks('c', false), 24, 'c = 24');
        eq(figTicks('s', false), 12, 's = 12');
        eq(figTicks('b', false), 96, 'b = 96');
        eq(figTicks('r', false), 192, 'r = 192');
        eq(figTicks('n', true), 72, 'n. = 72');
        eq(figTicks('c', true), 36, 'c. = 36');
        eq(figTicks('s', true), 18, 's. = 18');
        eq(figTicks('b', true), 144, 'b. = 144');
        eq(figTicks('r', true), 288, 'r. = 288');

        // ── Meters ──
        log('· Meters');
        const m44 = crearMeter('4/4'), m68 = crearMeter('6/8');
        eq(m44.capacityTicks, 192, '4/4 capacity');
        eq(m44.beats, 4, '4/4 beats'); eq(m44.beatTicks, 48, '4/4 beatTicks'); eq(m44.group, 'simple', '4/4 group');
        eq(m68.capacityTicks, 144, '6/8 capacity');
        eq(m68.beats, 2, '6/8 beats'); eq(m68.beatTicks, 72, '6/8 beatTicks'); eq(m68.group, 'compound', '6/8 group');
        lanza(() => crearMeter('3/4'), 'COMPAS_NO_SOPORTADO', 'crearMeter(3/4)');

        // ── 4/4 válidos / inválidos ──
        log('· 4/4');
        linea('nnnn', '4/4', true);
        linea('cccccccc', '4/4', true);
        linea('bb', '4/4', true);              // sin espacios
        linea('r', '4/4', true);
        linea('b.n', '4/4', true);             // 144 + 48
        linea('n.cnn', '4/4', true);           // 72 + 24 + 48 + 48
        linea('nnnnn', '4/4', 'COMPAS_EXCEDIDO');
        linea('nnn', '4/4', 'COMPAS_INCOMPLETO');
        linea('nnnx', '4/4', 'FIGURA_DESCONOCIDA');
        linea('n-n', '4/4', 'FIGURA_DESCONOCIDA');
        linea('n n', '4/4', 'FIGURA_DESCONOCIDA');   // el espacio es carácter inválido
        linea('', '4/4', 'LINEA_VACIA');

        // ── 6/8 válidos / inválidos ──
        log('· 6/8');
        linea('cccccc', '6/8', true);
        linea('n.n.', '6/8', true);            // dos negras con puntillo
        linea('bn', '6/8', true);              // 96 + 48
        linea('ncccc', '6/8', true);           // 48 + 24×4
        linea('ccccc', '6/8', 'COMPAS_INCOMPLETO');
        linea('ccccccc', '6/8', 'COMPAS_EXCEDIDO');

        // ── Puntillos: pruebas dedicadas ──
        log('· Puntillos');
        linea('n.n.n', '4/4', true);           // 72 + 72 + 48 = 192
        linea('.nnn', '4/4', 'PUNTO_MAL_COLOCADO');
        linea('n..', '4/4', 'PUNTO_MAL_COLOCADO'); // doble puntillo → el 2º punto queda suelto

        // ── Tresillos válidos ──
        log('· Tresillos válidos');
        linea('(n,nnn)nn', '4/4', true);       // tresillo(96) + 48 + 48
        linea('(c,ccc)nnn', '4/4', true);      // tresillo(48) + 144
        linea('(n,nccn)nn', '4/4', true);      // tresillo con subdivisión interna
        linea('(n,nnn)(c,ccc)', '6/8', true);  // 96 + 48 = 144

        // Estructura interna de (n,nnn): ocupa 96 ticks, 3 eventos de 32, ratio 3:2
        const tri = analizarLinea('(n,nnn)');
        ok(tri.error === null, '(n,nnn) analiza sin error');
        eq(tri.durTick, 96, '(n,nnn) ocupa 96 ticks');
        eq(tri.events.length, 3, '(n,nnn) → 3 eventos');
        eq(tri.events[0].durTick, 32, '(n,nnn) evento dura 32 ticks');
        ok(tri.events[0].tuplet && tri.events[0].tuplet.ratio === '3:2', '(n,nnn) ratio 3:2');
        eq(tri.events[0].tuplet.base, 'n', '(n,nnn) base = n');
        const triC = analizarLinea('(c,ccc)');
        eq(triC.durTick, 48, '(c,ccc) ocupa 48 ticks (una negra)');

        // ── Tresillos inválidos ──
        log('· Tresillos inválidos');
        linea('(n,nn)', '4/4', 'TRESILLO_DURACION');     // nominal 96 ≠ 144
        linea('(n,nnnn)', '4/4', 'TRESILLO_DURACION');   // nominal 192 ≠ 144
        linea('(n,ccc)', '4/4', 'TRESILLO_DURACION');    // nominal 72 ≠ 144
        linea('(n,(c,ccc)n)', '4/4', 'TRESILLO_ANIDADO');
        linea('(nnnn)', '4/4', 'TRESILLO_SIN_COMA');     // falta coma
        linea('(,nnn)', '4/4', 'TRESILLO_BASE_INVALIDA');
        linea('(x,nnn)', '4/4', 'TRESILLO_BASE_INVALIDA');
        linea('(n,nxn)', '4/4', 'FIGURA_DESCONOCIDA');   // contenido inválido
        linea('(n,nnn', '4/4', 'PAREN_SIN_CERRAR');
        linea(')', '4/4', 'PAREN_INESPERADO');

        // ── parse(): objeto completo ──
        log('· parse() objeto ritmo');
        const obj = parse('id: rit_demo\ncompas: 4/4\nbpm: 90\nrep: 4\nmodo: partitura\nnnnn\ncccccccc');
        eq(obj.id, 'rit_demo', 'parse conserva id');
        eq(obj.bpm, 90, 'parse bpm');
        eq(obj.reps, 4, 'parse reps');
        eq(obj.modo, 'partitura', 'parse modo');
        eq(obj.meter.num, 4, 'parse meter num');
        eq(obj.measures.length, 2, 'parse 2 compases');
        eq(obj.ticksPorRep, 384, 'parse ticksPorRep = 192×2');
        eq(obj.measures[0].events.length, 4, 'compás 1 → 4 eventos');
        eq(obj.measures[1].events[0].evIdx, 4, 'evIdx global continúa entre compases');

        // id autogenerado
        const objSinId = parse('compas: 6/8\nbpm: 100\nrep: 1\nmodo: infantil\ncccccc');
        ok(/^rit_/.test(objSinId.id), 'parse genera id cuando falta (empieza con rit_)');
        eq(objSinId.modo, 'infantil', 'parse modo infantil');
        eq(objSinId.meter.group, 'compound', 'parse 6/8 group compound');

        // parse() lanza en cabecera / valores inválidos
        log('· parse() errores de cabecera');
        lanza(() => parse('compas: 4/4\nbpm: 90\nrep: 1\nmodo: partitura\nnnnnn'), 'COMPAS_EXCEDIDO', 'parse compás excedido');
        lanza(() => parse('compas: 4/4\nnnn'), 'COMPAS_INCOMPLETO', 'parse compás incompleto');
        lanza(() => parse('bpm: 90\nnnnn'), 'FALTA_COMPAS', 'parse sin compás');
        lanza(() => parse('compas: 3/4\nnnnn'), 'COMPAS_NO_SOPORTADO', 'parse compás no soportado');
        lanza(() => parse('compas: 4/4\nbpm: abc\nnnnn'), 'BPM_INVALIDO', 'parse bpm inválido');
        lanza(() => parse('compas: 4/4\nrep: 0\nnnnn'), 'REPS_INVALIDO', 'parse reps inválidas');
        lanza(() => parse('compas: 4/4\nmodo: xxx\nnnnn'), 'MODO_INVALIDO', 'parse modo inválido');
        lanza(() => parse('compas: 4/4\nfoo: 1\nnnnn'), 'CABECERA_DESCONOCIDA', 'parse cabecera desconocida');
        lanza(() => parse('compas: 4/4\nbpm: 90'), 'SIN_COMPASES', 'parse sin compases');

        // ── Round-trip parse → serialize → parse ──
        log('· Round-trip serialize');
        const defs = [
            'id: rit_a\ncompas: 4/4\nbpm: 90\nrep: 4\nmodo: partitura\nnnnn\ncccccccc',
            'id: rit_b\ncompas: 6/8\nbpm: 100\nrep: 2\nmodo: infantil\ncccccc\nn.n.',
            'id: rit_c\ncompas: 4/4\nbpm: 80\nrep: 1\nmodo: partitura\n(n,nnn)nn\n(c,ccc)nnn',
            'id: rit_d\ncompas: 4/4\nbpm: 120\nrep: 3\nmodo: partitura\n(n,nccn)nn\nb.n',
        ];
        for (const d of defs) {
            const o1 = parse(d);
            const s1 = serialize(o1);
            const o2 = parse(s1);
            const s2 = serialize(o2);
            ok(s1 === s2, `round-trip estable: ${JSON.stringify(d.split('\n').slice(-1)[0])}`);
            // además, la firma musical (compás + compases serializados) se conserva
            ok(o1.measures.length === o2.measures.length &&
               o1.meter.num === o2.meter.num &&
               o1.bpm === o2.bpm && o1.reps === o2.reps && o1.modo === o2.modo,
               `round-trip conserva estructura musical`);
        }

        // Serialización canónica esperada de un tresillo
        const so = parse('id: rit_x\ncompas: 4/4\nbpm: 90\nrep: 1\nmodo: partitura\n(n,nccn)nn');
        ok(serialize(so).endsWith('(n,nccn)nn'), 'serialize reconstruye "(n,nccn)nn"');

        // ── Resumen ──
        log(`\n═══ Resultado: ${pass} OK, ${fail} FALLAS ═══\n`);
        if (typeof process !== 'undefined' && fail > 0) process.exitCode = 1;
        return { pass, fail };
    };

    return RITMO;
});
