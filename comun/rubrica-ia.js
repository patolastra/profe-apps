// ═══════════════════════════════════════════════════════════════════════
// ✨ PROPONER LA RÚBRICA O LISTA DE COTEJO CON IA (deuda DT, 2026-10-27)
// En el editor de un instrumento del Libro (y de una plantilla): el profe elige 3, 4 o 5 criterios, puede escribir
// una idea, y la IA (Gemini, la misma de ✨ Redactar OA: comun/redactar-oa.js) propone los criterios a partir del OA
// de la evaluación (o del nombre de la plantilla) y del currículo del nivel. Rúbrica: cada criterio con sus 4
// niveles (Por lograr · Medianamente logrado · Logrado · Logrado con distinción). Lista de cotejo: ítems Sí/No.
// Vista previa → "Agregar todos" (se suman a los que ya haya; luego se corrigen en el mismo editor).
// Solo cursos 1° a 8° (sin nivel no se muestra).
//
//   RubricaIA.html({ nivel, tipo, base, alAgregar })  → HTML del bloque (vacío si no hay nivel)
//     base()      → { oa, nombre }   (texto que la IA toma como punto de partida)
//     alAgregar(criterios) → Promise   criterios = [{ texto, desc_n1, desc_n2, desc_n3, desc_n4 }]
// ═══════════════════════════════════════════════════════════════════════
const RubricaIA = (() => {
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const NIVELES = ['Por lograr', 'Medianamente logrado', 'Logrado', 'Logrado con distinción'];
    let op = null, propuesta = null;
    const $ = id => document.getElementById(id);

    function html(opciones) {
        if (!opciones?.nivel) return '';
        op = opciones; propuesta = null;
        const que = op.tipo === 'rubrica' ? 'criterios' : 'ítems';
        return `<div id="ria" style="margin-top:12px;border:1px dashed var(--line);border-radius:8px;padding:8px 10px">
            <div class="row" style="gap:8px;align-items:center;flex-wrap:wrap">
                <b style="font-size:13px">✨ Proponer con IA</b>
                <select id="ria-n" title="Cuántos ${que} propone" style="width:auto">
                    <option value="3">3 ${que}</option><option value="4" selected>4 ${que}</option><option value="5">5 ${que}</option></select>
                <input id="ria-idea" placeholder="Idea opcional (qué mirar, canción, instrumento…)" style="flex:1;min-width:180px" autocomplete="off">
                <button type="button" class="btn mini primary" id="ria-btn" onclick="RubricaIA.proponer()">Proponer</button>
            </div>
            <div class="hint" id="ria-estado" style="margin-top:4px"></div>
            <div id="ria-prev"></div>
        </div>`;
    }
    function estado(t) { const el = $('ria-estado'); if (el) el.textContent = t || ''; }

    function instruccion(n, cant, tipo, base, idea, cur) {
        const esRub = tipo === 'rubrica';
        return `Eres asesor de evaluación de Música para la educación básica en Chile. Propón exactamente ${cant} ` +
            (esRub ? 'criterios para una RÚBRICA' : 'ítems para una LISTA DE COTEJO') +
            ` de ${n}° básico, en español de Chile, coherentes con el objetivo de abajo: observables durante la ` +
            `interpretación o el trabajo de los estudiantes, distintos entre sí y sin notas numéricas.\n` +
            (esRub
                ? `Cada criterio: un nombre breve (2 a 6 palabras) y una descripción de cada uno de sus 4 niveles, graduales ` +
                  `y concretos, de una oración corta (máximo 25 palabras): n1 = Por lograr, n2 = Medianamente logrado, ` +
                  `n3 = Logrado, n4 = Logrado con distinción.\n` +
                  `Devuelve SOLO JSON: {"criterios": [{"texto": "...", "n1": "...", "n2": "...", "n3": "...", "n4": "..."}]}\n\n`
                : `Cada ítem: una afirmación observable que se responde Sí o No (máximo 18 palabras).\n` +
                  `Devuelve SOLO JSON: {"criterios": [{"texto": "..."}]}\n\n`) +
            (base.oa ? `Objetivo de la evaluación: ${base.oa}\n` : '') +
            (base.nombre ? `Nombre: ${base.nombre}\n` : '') +
            (idea ? `Idea del profesor: ${idea}\n` : '') +
            `\nCURRÍCULO DEL NIVEL (referencia):\n${cur}`;
    }

    async function proponer() {
        if (!op) return;
        const btn = $('ria-btn'), cant = +$('ria-n').value, idea = $('ria-idea').value.trim();
        const base = op.base ? op.base() : {};
        if (!base.oa && !base.nombre && !idea) { estado('Escribe una idea (o agrega el OA a la evaluación).'); $('ria-idea').focus(); return; }
        btn.disabled = true;
        estado('Proponiendo…');
        $('ria-prev').innerHTML = '';
        const esRub = op.tipo === 'rubrica';
        try {
            const cur = await RedactarOA.curriculo(op.nivel);
            propuesta = await RedactarOA.pedir(instruccion(op.nivel, cant, op.tipo, base, idea, cur), o => {
                const lista = Array.isArray(o.criterios) ? o.criterios : null;
                if (!lista || !lista.length) return null;
                const out = lista.map(c => ({
                    texto: String(c.texto || '').trim(),
                    desc_n1: esRub ? String(c.n1 || '').trim() || null : null,
                    desc_n2: esRub ? String(c.n2 || '').trim() || null : null,
                    desc_n3: esRub ? String(c.n3 || '').trim() || null : null,
                    desc_n4: esRub ? String(c.n4 || '').trim() || null : null,
                })).filter(c => c.texto);
                return out.length ? out : null;
            });
            estado('');
            pintar();
        } catch (e) {
            estado(RedactarOA.mensajeError(e, 'No se pudo proponer; prueba de nuevo.'));
        } finally { btn.disabled = false; }
    }

    function pintar() {
        const esRub = op.tipo === 'rubrica';
        $('ria-prev').innerHTML = propuesta.map((c, i) => `
            <div style="border:1px solid var(--line);border-radius:8px;padding:7px 10px;margin-top:6px;background:var(--panel2)">
                <div><span class="hint">${i + 1}.</span> <b>${esc(c.texto)}</b></div>
                ${esRub ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:6px;margin-top:5px">
                    ${[c.desc_n1, c.desc_n2, c.desc_n3, c.desc_n4].map((d, k) =>
                        `<div style="font-size:12px"><span class="hint">${NIVELES[k]} (${k + 1})</span><br>${esc(d || '—')}</div>`).join('')}
                  </div>` : ''}
            </div>`).join('') +
            `<div class="row" style="gap:8px;margin-top:8px">
                <button type="button" class="btn mini primary" id="ria-agregar">Agregar todos</button>
                <button type="button" class="btn mini" onclick="RubricaIA.proponer()">↻ Otra propuesta</button>
                <button type="button" class="btn mini" onclick="document.getElementById('ria-prev').innerHTML=''">✕ Descartar</button>
                <span class="hint">Se suman a los que ya tiene; después se corrigen arriba.</span>
            </div>`;
        $('ria-agregar').addEventListener('click', async ev => {
            const b = ev.currentTarget;
            b.disabled = true; b.textContent = 'Agregando…';
            try { await op.alAgregar(propuesta); propuesta = null; }
            catch (e) { b.disabled = false; b.textContent = 'Agregar todos'; estado('No se pudo agregar — revisa la conexión.'); }
        });
    }

    return { html, proponer };
})();
