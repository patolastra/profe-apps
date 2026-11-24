// Iconos (deuda JQ): íconos propios que viajan con la app (no existen como emoji en todos los equipos).
//   Iconos.metal       → el dibujo del metalófono, como HTML (<i>) del tamaño de la letra; va donde se pinta HTML
//   Iconos.texto(s)    → quita los íconos propios de un texto (para menús desplegables, títulos y avisos de solo texto)
// La pieza agrega sola su estilo; el dibujo está en comun/iconos/metalofono.svg.
(function () {
    if (window.Iconos) return;
    const base = (document.currentScript && document.currentScript.src) || location.href;
    const svg = new URL('iconos/metalofono.svg', base).href;
    const css = document.createElement('style');
    css.textContent = `.ico-metal { display: inline-block; width: 1.15em; height: 1.15em; vertical-align: -0.2em;
        background: url("${svg}") center / contain no-repeat; }`;
    (document.head || document.documentElement).appendChild(css);
    const metal = '<i class="ico-metal" role="img" aria-label="Metalófono" title="Metalófono"></i>';
    window.Iconos = {
        metal,
        texto: s => String(s || '').replace(/<i class="ico-[^"]*"[^>]*><\/i>\s*/g, '').trim(),
    };
})();
