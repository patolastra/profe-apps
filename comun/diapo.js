// Diapositiva de la Pizarra (deuda FD): una sola pieza para dibujarla, usada por la Pizarra y por las miniaturas
// del Plan (Vista previa y vista de clase), así la miniatura es siempre la diapositiva real.
// Con comun/diapo.css. La miniatura arma la ventana de la Pizarra a su tamaño real y la achica como una foto.
(function () {
    // ── TEMAS ── todos fondos claros; cambia la letra y la paleta. Mismo id de sesión → mismo tema.
    const TEMAS = [
        { id: 'polar',   font: 'system-ui,-apple-system,sans-serif', bg: '#ffffff', text: '#1a1a2e', h1: '#0f172a', h2: '#64748b',
          c1: '#ea580c', c2: '#2563eb', li: '#ea580c', hlBg: '#fff7ed', hlBorder: '#ea580c', hlText: '#9a3412' },
        { id: 'amable',  font: '"Nunito",system-ui,sans-serif',      bg: '#fafaf5', text: '#1c1917', h1: '#0d7377', h2: '#0f9b8e',
          c1: '#f43f5e', c2: '#7c3aed', li: '#0d7377', hlBg: '#f0fdf4', hlBorder: '#16a34a', hlText: '#14532d' },
        { id: 'arenoso', font: '"Poppins",system-ui,sans-serif',     bg: '#fdf8f0', text: '#2d1b0e', h1: '#c2410c', h2: '#92400e',
          c1: '#dc2626', c2: '#1d4ed8', li: '#c2410c', hlBg: '#fef9c3', hlBorder: '#ca8a04', hlText: '#713f12' },
        { id: 'fresco',  font: '"DM Sans",system-ui,sans-serif',     bg: '#f0f4f8', text: '#1e293b', h1: '#0e4c92', h2: '#1e40af',
          c1: '#d97706', c2: '#0891b2', li: '#0e4c92', hlBg: '#eff6ff', hlBorder: '#3b82f6', hlText: '#1e3a8a' },
    ];
    function temaParaSesion(uuid) {
        let h = 0;
        for (let i = 0; i < uuid.length; i++) h = Math.imul(31, h) + uuid.charCodeAt(i) | 0;
        return TEMAS[Math.abs(h) % TEMAS.length];
    }
    function varsTema(t) {
        return { '--slide-font': t.font, '--slide-bg': t.bg, '--slide-text': t.text, '--slide-h1': t.h1, '--slide-h2': t.h2,
                 '--slide-c1': t.c1, '--slide-c2': t.c2, '--slide-li': t.li,
                 '--hl-bg': t.hlBg, '--hl-border': t.hlBorder, '--hl-text': t.hlText };
    }
    function aplicarTema(el, t) { Object.entries(varsTema(t)).forEach(([k, v]) => el.style.setProperty(k, v)); }

    // ── TIPOS ──
    const primera = raw => raw.trim().split('\n')[0];
    function tipo(raw) {
        const p = primera(raw);
        if (p.startsWith('@youtube:')) return 'youtube';
        if (p.startsWith('@metal:'))   return 'metal';
        if (p.startsWith('@rep:'))     return 'rep';
        if (p.startsWith('@mensaje:')) return 'mensaje';
        return 'texto';
    }
    function extraerImg(raw) {
        const val = primera(raw).replace('@img:', '').trim();
        const pipe = val.indexOf('|');
        if (pipe >= 0) return { url: val.slice(0, pipe).trim(), caption: val.slice(pipe + 1).trim() };
        return { url: val, caption: '' };
    }
    function nombreDe(raw, pref, defecto) {   // @metal:/@rep: nombre|dato
        const val = primera(raw).replace(pref, '').trim();
        const pipe = val.indexOf('|');
        if (pipe >= 0) return val.slice(0, pipe).trim() || defecto;
        if (pref === '@metal:') return decodeURIComponent(val.split('/').pop().split('?')[0]) || defecto;
        return defecto;
    }

    // ── TEXTO ──
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    // Escapa sin procesar marcas (bloques &...&)
    function pEsc(s) {
        return s.replace(/\x01/g, '$').replace(/\x02/g, '%').replace(/\x03/g, '&amp;')
                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    // Marcas: $ color1, % color2, & destacado, _ itálica. Dobles ($$ %% &&) → el carácter; sin cerrar → hasta el final.
    function parseInline(raw) {
        let s = raw.replace(/\$\$/g, '\x01').replace(/%%/g, '\x02').replace(/&&/g, '\x03');
        let out = '', color = null, italic = false, i = 0;
        while (i < s.length) {
            const c = s[i];
            if (c === '&') {
                if (italic) { out += '</em>'; italic = false; }
                if (color)  { out += '</span>'; color = null; }
                const j = s.indexOf('&', i + 1);
                out += '<span class="hl-i">' + pEsc(j === -1 ? s.slice(i + 1) : s.slice(i + 1, j)) + '</span>';
                i = j === -1 ? s.length : j + 1;
            } else if (c === '$') {
                if (color === 'c1') { out += '</span>'; color = null; }
                else { if (color) out += '</span>'; out += '<span class="c1">'; color = 'c1'; }
                i++;
            } else if (c === '%') {
                if (color === 'c2') { out += '</span>'; color = null; }
                else { if (color) out += '</span>'; out += '<span class="c2">'; color = 'c2'; }
                i++;
            } else if (c === '_') {
                italic = !italic; out += italic ? '<em>' : '</em>'; i++;
            } else if (c === '\x01') { out += '$'; i++; }
            else if (c === '\x02') { out += '%'; i++; }
            else if (c === '\x03') { out += '&amp;'; i++; }
            else if (c === '<')    { out += '&lt;'; i++; }
            else if (c === '>')    { out += '&gt;'; i++; }
            else { out += c; i++; }
        }
        if (italic) out += '</em>';
        if (color)  out += '</span>';
        return out;
    }

    function html(raw) {
        const lines = raw.split('\n');
        let out = '', lista = null, hasImg = false;   // lista abierta: 'ul' | 'ol'
        const cerrar = () => { if (lista) { out += `</${lista}>`; lista = null; } };
        for (const line of lines) {
            const t = line.trim();
            // Línea en blanco = un espacio del alto de una línea de texto (deuda CC)
            if (!t) { cerrar(); out += '<div class="slide-esp"></div>'; continue; }
            // Imagen: @img:URL o @img:URL|título
            if (t.startsWith('@img:')) {
                cerrar();
                hasImg = true;
                const { url, caption } = extraerImg(t);
                out += `<img class="slide-inline-img" src="${esc(url)}" alt="${esc(caption)}">`;
                if (caption) out += `<div class="img-caption">${esc(caption)}</div>`;
                continue;
            }
            // Bloque destacado: la línea empieza con & (no &&)
            if (t.startsWith('&') && !t.startsWith('&&')) {
                cerrar();
                let c = t.slice(1);
                if (c.endsWith('&')) c = c.slice(0, -1);
                out += `<div class="hl">${pEsc(c)}</div>`;
                continue;
            }
            // '--- = línea horizontal dentro de la diapositiva (--- sin comilla separa diapositivas; deuda CB)
            if (t === "'---") { cerrar(); out += '<hr class="slide-hr">'; continue; }
            // Prefijos IZ (alinear a la izquierda) y 1L (una sola línea, deuda CA), en cualquier orden
            let izq = false, una = false, tc = t;
            for (;;) {
                if (tc.startsWith('IZ ') || tc === 'IZ') { izq = true; tc = tc.slice(3); continue; }
                if (tc.startsWith('1L ') || tc === '1L') { una = true; tc = tc.slice(3); continue; }
                break;
            }
            const cls = izq ? ' class="izq"' : '';
            const en = h => una ? `<span class="una-linea">${h}</span>` : h;
            let m;
            if (tc.startsWith('# ')) {
                cerrar(); out += `<h1${cls}>${en(parseInline(tc.slice(2)))}</h1>`;
            } else if (tc.startsWith('## ')) {
                cerrar(); out += `<h2${cls}>${en(parseInline(tc.slice(3)))}</h2>`;
            } else if (tc.startsWith('- ')) {
                if (lista !== 'ul') { cerrar(); out += '<ul>'; lista = 'ul'; }
                out += `<li${cls}>${en(parseInline(tc.slice(2)))}</li>`;
            } else if ((m = tc.match(/^(\d{1,3})\. (.*)$/))) {
                // Lista numerada (deuda CA): parte en el número escrito; las siguientes se numeran solas.
                if (lista !== 'ol') { cerrar(); out += `<ol${+m[1] !== 1 ? ` start="${+m[1]}"` : ''}>`; lista = 'ol'; }
                out += `<li${cls}>${en(parseInline(m[2]))}</li>`;
            } else if (tc) {
                cerrar(); out += `<p${cls}>${en(parseInline(tc))}</p>`;
            }
        }
        cerrar();
        return { html: out, centrado: true, hasImg };
    }

    // HTML de la diapositiva de texto o mensaje (lo que va en el área de la Pizarra). null = video o Metalófono.
    function htmlDiapo(raw) {
        let t = tipo(raw);
        if (t === 'rep') { raw = '# 🎵 ' + nombreDe(raw, '@rep:', 'Canción'); t = 'texto'; }   // retirada (deuda AS)
        if (t === 'mensaje') {
            return { tipo: t, ajustar: true, html: `<div class="slide-mensaje"><div class="slide-content centrado">
                <p>${esc(primera(raw).replace('@mensaje:', '').trim())}</p></div></div>` };
        }
        if (t !== 'texto') return { tipo: t, html: null };
        const r = html(raw);
        return { tipo: t, ajustar: !r.hasImg, html: `<div class="slide-texto">
            <div class="slide-content${r.centrado ? ' centrado' : ''}${r.hasImg ? ' has-img' : ''}">${r.html}</div></div>` };
    }

    // ── AJUSTE DE LA LETRA ──
    // Topes pensados para pantallas de hasta 1080 px de alto; en una más grande crecen en la misma proporción.
    const tope = (base, altoVentana) => Math.max(base, Math.round(base * altoVentana / 1080));
    // 1L (deuda CA): si la línea no cabe a lo ancho, solo ella achica su letra.
    function limpiarUnaLinea(content) { content.querySelectorAll('.una-linea').forEach(s => { s.style.fontSize = ''; }); }
    function ajustarUnaLinea(content) {
        content.querySelectorAll('.una-linea').forEach(s => {
            if (s.scrollWidth > s.clientWidth + 1) {
                const fs = parseFloat(getComputedStyle(s).fontSize);
                s.style.fontSize = Math.max(4, fs * s.clientWidth / s.scrollWidth * 0.98) + 'px';
            }
        });
    }
    // La letra más grande que cabe en `contenedor` (.slide-texto / .slide-mensaje); altoVentana = alto de la Pizarra.
    function ajustar(contenedor, altoVentana) {
        const content = contenedor.querySelector('.slide-content');
        if (!content) return;
        limpiarUnaLinea(content);
        let lo = 10, hi = tope(250, altoVentana || window.innerHeight);
        while (hi - lo > 1) {
            const mid = (lo + hi) >> 1;
            content.style.fontSize = mid + 'px';
            if (contenedor.scrollHeight > contenedor.clientHeight + 2 || contenedor.scrollWidth > contenedor.clientWidth + 2) hi = mid;
            else lo = mid;
        }
        content.style.fontSize = lo + 'px';
        ajustarUnaLinea(content);
    }

    // ── TAMAÑO DE LA PIZARRA ── la Pizarra anota el tamaño de su ventana en el equipo; las miniaturas lo imitan.
    const CLAVE_TAM = 'profe_pizarra_tam';
    function tamPizarra() {
        try {
            const t = JSON.parse(localStorage.getItem(CLAVE_TAM) || 'null');
            if (t && t.w >= 320 && t.h >= 240) return { w: Math.round(t.w), h: Math.round(t.h) };
        } catch (_) {}
        return { w: 1920, h: 1080 };
    }
    function anotarTam() {
        try {
            const w = window.innerWidth, h = window.innerHeight, t = tamPizarra();
            if (w >= 640 && h >= 400 && (t.w !== w || t.h !== h)) localStorage.setItem(CLAVE_TAM, JSON.stringify({ w, h }));
        } catch (_) {}
    }

    // ── MINIATURA ── dibuja `raw` dentro de `caja` (position: relative; overflow: hidden) como se ve en la Pizarra.
    // La caja toma la forma de la ventana de la Pizarra. Si ya está dibujada igual, solo vuelve a escalar.
    function miniatura(caja, raw) {
        const { w, h } = tamPizarra();
        const ancho = caja.clientWidth;
        let esc_ = caja.querySelector(':scope > .diapo-escena');
        const clave = w + 'x' + h + '\n' + raw;
        if (!ancho) { if (esc_) esc_.dataset.ok = ''; return; }   // oculta: se dibuja al verse
        caja.style.height = Math.round(ancho * h / w) + 'px';
        if (!esc_ || esc_.dataset.clave !== clave || !esc_.dataset.ok) {
            esc_?.remove();
            esc_ = document.createElement('div');
            esc_.className = 'diapo-escena';
            esc_.dataset.clave = clave;
            esc_.style.width = w + 'px'; esc_.style.height = h + 'px';
            esc_.style.setProperty('--dvw', (w / 100) + 'px');
            esc_.style.setProperty('--dvh', (h / 100) + 'px');
            const d = htmlDiapo(raw);
            if (d.tipo === 'youtube') esc_.innerHTML = '<div class="diapo-tarjeta video">▶ Video</div>';
            else if (d.tipo === 'metal') esc_.innerHTML = `<div class="diapo-escena-area"><div class="diapo-tarjeta metal">🎹 ${esc(nombreDe(raw, '@metal:', 'Melodía'))}</div></div>`;
            else esc_.innerHTML = `<div class="diapo-escena-area">${d.html}</div>`;
            caja.prepend(esc_);
            const c = esc_.querySelector('.slide-texto, .slide-mensaje');
            if (c && d.ajustar) ajustar(c, h);
            esc_.dataset.ok = '1';
        }
        esc_.style.transform = `scale(${ancho / w})`;
    }

    // Cuando llega una letra del tema (se descarga después), las miniaturas se vuelven a ajustar.
    if (document.fonts) document.fonts.addEventListener?.('loadingdone', () => {
        document.querySelectorAll('.diapo-escena').forEach(e => { e.dataset.ok = ''; });
        window.dispatchEvent(new CustomEvent('diapo-redibujar'));
    });

    window.Diapo = { TEMAS, temaParaSesion, varsTema, aplicarTema, tipo, extraerImg, parseInline, html, htmlDiapo,
                     ajustar, tamPizarra, anotarTam, miniatura, CLAVE_TAM };
})();
