// ═══════════════════════════════════════════════════════════════════════
// ✨ REDACTAR OA CON IA (deuda DS, 2026-10-27)
// El profe escribe su idea en el campo del OA; la IA (Gemini, plan gratis) devuelve DOS opciones:
//   · basada en un OA oficial del curso (lo cita: "OA 4: …")  · redacción libre (sin número de OA)
// Se toca "Usar" y queda en el campo (editable). Solo cursos 1° a 8° (en talleres no se muestra).
// Misma IA y currículo que la Planificación del mes: llave solo en este equipo (localStorage 'gemini_api_key') y
// los OA de PLANIFICACION/curriculo/musica-<n>.txt. Se envía solo la idea, el nombre de la evaluación y los OA del
// nivel (nunca listas de estudiantes).
//
//   RedactarOA.nivel(ctxNombre)  → 1..8 | null
//   RedactarOA.boton(textareaId, { nivel, nombreEvaluacion })  → HTML del botón + su panel (vacío si no hay nivel)
// ═══════════════════════════════════════════════════════════════════════
const RedactarOA = (() => {
    const NIVEL = { PRIMERO: 1, SEGUNDO: 2, TERCERO: 3, CUARTO: 4, QUINTO: 5, SEXTO: 6, SEPTIMO: 7, OCTAVO: 8 };
    const MODELOS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-flash-latest', 'gemini-2.0-flash'];
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const curriculos = {};
    const opciones = {};   // textareaId → { nivel, nombreEvaluacion: () => string }

    function nivel(ctxNombre) { return NIVEL[String(ctxNombre || '').toUpperCase()] || null; }

    function leerLlave() { try { return localStorage.getItem('gemini_api_key') || ''; } catch (e) { return ''; } }
    function pedirLlave() {
        const nueva = prompt('Pega tu llave de Gemini (gratis en aistudio.google.com → "Get API key").\n' +
            'Queda guardada solo en este equipo (es la misma de la Planificación del mes).', leerLlave());
        if (nueva === null) return '';
        const llave = nueva.trim();
        try { if (llave) localStorage.setItem('gemini_api_key', llave); } catch (e) {}
        return llave;
    }
    async function curriculo(n) {
        if (!curriculos[n]) {
            const r = await fetch(`../PLANIFICACION/curriculo/musica-${n}.txt`);
            if (!r.ok) throw new Error('curriculo');
            curriculos[n] = await r.text();
        }
        return curriculos[n];
    }
    // Los modelos 2.5 "piensan" antes de responder y eso consume la cuota de salida: con poca, la respuesta llega
    // cortada. Aquí no hace falta pensar (thinkingBudget 0) y se deja espacio amplio, como en la Planificación.
    // Si todos los modelos fallan, el error trae el motivo del último (se muestra al profe entre paréntesis).
    // validar(o) → lo que se devuelve, o null si la respuesta no trae lo pedido (se prueba el modelo siguiente).
    async function llamar(texto, llave, validar) {
        let ultimo = 'modelos', detalle = '';
        for (const modelo of MODELOS) {
            const generationConfig = { temperature: 0.6, maxOutputTokens: 8192, responseMimeType: 'application/json' };
            if (/2\.5/.test(modelo)) generationConfig.thinkingConfig = { thinkingBudget: 0 };
            let res;
            try {
                res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': llave },
                    body: JSON.stringify({ contents: [{ parts: [{ text: texto }] }], generationConfig }),
                });
            } catch (e) { throw new Error('red'); }
            if (res.status === 401 || res.status === 403) throw new Error('llave');
            if (res.status === 400) {
                const j = await res.json().catch(() => ({}));
                if (/api key/i.test(j?.error?.message || '')) throw new Error('llave');
                detalle = `${modelo}: ${j?.error?.message || 'HTTP 400'}`;
                continue;
            }
            if (!res.ok) { if (res.status === 429) ultimo = 'cuota'; detalle = `${modelo}: HTTP ${res.status}`; continue; }   // 404 / 429 / 5xx → otro modelo
            const j = await res.json();
            const out = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
            const ini = out.indexOf('{'), fin = out.lastIndexOf('}');
            try {
                const r = validar(JSON.parse(out.slice(ini, fin + 1)));
                if (r) return r;
                detalle = `${modelo}: respuesta sin lo pedido`;
            } catch (_) { detalle = `${modelo}: respuesta ${out ? 'incompleta' : 'vacía'} (${j.candidates?.[0]?.finishReason || 'sin motivo'})`; }
        }
        console.warn('[IA Gemini]', detalle);
        const e = new Error(ultimo); e.detalle = detalle;
        throw e;
    }
    function instruccion(n, idea, nombreEval, cur) {
        return `Eres asesor curricular de Música para la educación básica en Chile. Un profesor de música de ${n}° básico ` +
            `escribió una idea para el objetivo de una evaluación. Redáctala como Objetivo de Aprendizaje formal, en español ` +
            `de Chile: una sola oración que empiece con un verbo en infinitivo, clara, observable y evaluable, sin agregar ` +
            `contenidos que la idea no menciona (respeta la canción, el instrumento o la actividad que nombre).\n\n` +
            `Devuelve SOLO un JSON con dos opciones:\n` +
            `{"oficial": "OA <número>: <texto>", "libre": "<texto>"}\n` +
            `- "oficial": parte del OA del currículo de abajo que mejor corresponda a la idea; empieza con su número ` +
            `("OA 4: …") y adapta su redacción a la idea concreta.\n` +
            `- "libre": una redacción propia, sin citar número de OA.\n\n` +
            `Nombre de la evaluación: ${nombreEval || '(sin nombre)'}\n` +
            `Idea del profesor: ${idea}\n\n` +
            `CURRÍCULO DEL NIVEL (usa solo estos OA):\n${cur}`;
    }

    function boton(textareaId, op) {
        if (!op?.nivel) return '';
        opciones[textareaId] = op;
        return `<div class="row" style="margin-top:6px;gap:8px;align-items:center">
                <button type="button" class="btn mini" onclick="RedactarOA.redactar('${textareaId}', this)"
                    title="Escribe tu idea en el campo y la IA te propone dos redacciones formales del OA (una basada en el OA oficial de ${op.nivel}° y otra libre)">✨ Redactar OA</button>
                <span class="hint" id="${textareaId}-ia-estado"></span></div>
            <div id="${textareaId}-ia" style="display:none;margin-top:8px"></div>`;
    }
    function estado(id, txt) { const el = document.getElementById(id + '-ia-estado'); if (el) el.textContent = txt || ''; }

    async function redactar(id, btn) {
        const ta = document.getElementById(id), op = opciones[id];
        if (!ta || !op) return;
        const idea = ta.value.trim();
        if (!idea) { estado(id, 'Primero escribe tu idea en el campo.'); ta.focus(); return; }
        let llave = leerLlave() || pedirLlave();
        if (!llave) { estado(id, 'Falta la llave de Gemini.'); return; }
        const panel = document.getElementById(id + '-ia');
        btn.disabled = true;
        estado(id, 'Redactando…');
        try {
            const nombreEval = typeof op.nombreEvaluacion === 'function' ? op.nombreEvaluacion() : (op.nombreEvaluacion || '');
            const r = await llamar(instruccion(op.nivel, idea, nombreEval, await curriculo(op.nivel)), llave,
                o => o.oficial && o.libre ? { oficial: String(o.oficial).trim(), libre: String(o.libre).trim() } : null);
            estado(id, '');
            panel.style.display = '';
            panel.innerHTML = [['Basado en el OA oficial', r.oficial], ['Redacción libre', r.libre]].map(([t, txt]) => `
                <div style="border:1px solid var(--line);border-radius:8px;padding:8px 10px;margin-bottom:6px;background:var(--panel2);display:flex;gap:10px;align-items:flex-start">
                    <div style="flex:1"><div class="hint" style="margin-bottom:2px">${t}</div><div>${esc(txt)}</div></div>
                    <button type="button" class="btn mini primary" data-txt="${esc(txt)}">Usar</button>
                </div>`).join('') +
                `<div class="row" style="gap:8px"><button type="button" class="btn mini" data-otra>↻ Otras</button>
                 <button type="button" class="btn mini" data-cerrar>✕ Cerrar</button>
                 <span class="hint">Se usa tu idea tal como está en el campo.</span></div>`;
            panel.querySelectorAll('[data-txt]').forEach(b => b.addEventListener('click', () => {
                ta.value = b.dataset.txt;
                ta.dispatchEvent(new Event('input', { bubbles: true }));
                panel.style.display = 'none';
                estado(id, op.alUsar || '');
            }));
            panel.querySelector('[data-otra]').addEventListener('click', () => redactar(id, btn));
            panel.querySelector('[data-cerrar]').addEventListener('click', () => { panel.style.display = 'none'; });
        } catch (e) {
            estado(id, mensajeError(e, 'No se pudo redactar; prueba de nuevo.'));
        } finally { btn.disabled = false; }
    }
    // Mensaje humano para un error de la IA (si la llave no sirve, se borra para pedirla de nuevo).
    function mensajeError(e, generico) {
        const m = e.message;
        if (m === 'llave') { try { localStorage.removeItem('gemini_api_key'); } catch (_) {} }
        return m === 'llave' ? 'La llave de Gemini no sirve; vuelve a intentarlo para pegar otra.'
            : m === 'cuota' ? 'Gemini está ocupado (límite del plan gratis); prueba en un minuto.'
            : m === 'red' ? 'Sin conexión.'
            : m === 'curriculo' ? 'No se encontró el currículo del curso.'
            : m === 'sin-llave' ? 'Falta la llave de Gemini.'
            : generico + (e.detalle ? ` (${e.detalle})` : '');
    }
    // Para otras funciones de IA del Libro (✨ Proponer rúbrica, DT): pide la llave si falta y llama a Gemini.
    async function pedir(texto, validar) {
        const llave = leerLlave() || pedirLlave();
        if (!llave) throw new Error('sin-llave');
        return llamar(texto, llave, validar);
    }

    return { nivel, boton, redactar, pedir, curriculo, mensajeError };
})();
