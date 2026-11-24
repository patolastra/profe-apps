// Iconos (deuda JQ): íconos propios que viajan con la app (no existen como emoji en todos los equipos).
//   Iconos.metal / Iconos.cajon → el dibujo como HTML (<i>) del tamaño de la letra; va donde se pinta HTML
//   Iconos.texto(s)             → quita los íconos propios de un texto (menús desplegables, títulos, avisos de solo texto)
// La pieza agrega sola su estilo; los dibujos están en comun/iconos/<nombre>.svg.
(function () {
    if (window.Iconos) return;
    const base = (document.currentScript && document.currentScript.src) || location.href;
    const DIBUJOS = { metal: ['metalofono', 'Metalófono'], cajon: ['cajon', 'Cajón'] };
    const css = document.createElement('style');
    css.textContent = Object.entries(DIBUJOS).map(([k, [archivo]]) =>
        `.ico-${k} { display: inline-block; width: 1.15em; height: 1.15em; vertical-align: -0.2em;
            background: url("${new URL(`iconos/${archivo}.svg?v=jr`, base).href}") center / contain no-repeat; }`).join('\n');
    (document.head || document.documentElement).appendChild(css);
    const html = k => `<i class="ico-${k}" role="img" aria-label="${DIBUJOS[k][1]}" title="${DIBUJOS[k][1]}"></i>`;
    window.Iconos = {
        metal: html('metal'),
        cajon: html('cajon'),
        texto: s => String(s || '').replace(/<i class="ico-[^"]*"[^>]*><\/i>\s*/g, '').trim(),
    };
})();
