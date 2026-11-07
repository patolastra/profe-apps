// App del celular (deuda AN): abre aunque no haya señal.
// Solo atiende las páginas y piezas del celular (lista PROPIAS + la librería de Supabase);
// todo lo demás (Workspace, Planificador…) pasa directo, como si no existiera.
// Siempre pide primero a internet (así llegan las versiones nuevas) y, sin señal,
// usa la última copia guardada.
const CACHE = 'profe-movil-v18';
const PROPIAS = [
    'MOVIL/', 'MOVIL/index.html', 'MOVIL/evaluar.html', 'MOVIL/manifest.webmanifest',
    'MOVIL/icono-192.png', 'MOVIL/icono-512.png',
    'MOVIL/cursos.html', 'MOVIL/subir.html', 'MOVIL/recortar.html', 'comun/lame.min.js', 'MEMORIA/index.html',
    'comun/clase-vivo.js', 'comun/asistencia.js', 'comun/pendientes.js', 'comun/pendientes.css',
    'comun/editor-bloques.js', 'comun/editor-bloques.css', 'comun/tiempo-real.js', 'comun/volumen.js', 'comun/mensajes.js', 'comun/mensajes.css', 'comun/ensayos.js', 'comun/ensayos.css', 'comun/apoderados.js', 'comun/apoderados.css', 'comun/archivos-curso.js', 'comun/archivos-curso.css', 'comun/fotos-clase.js', 'comun/citar.js', 'comun/citar.css',
    'supabase/config.js', 'supabase/contextos.js',
];
const EXTERNAS = ['https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'];
const base = self.registration.scope;
const URLS = new Set([...PROPIAS.map(p => new URL(p, base).href), ...EXTERNAS]);

self.addEventListener('install', e => {
    e.waitUntil(caches.open(CACHE).then(c => Promise.all([...URLS].map(u => c.add(u).catch(() => {})))));
    self.skipWaiting();
});
self.addEventListener('activate', e => {
    e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('profe-movil-') && k !== CACHE).map(k => caches.delete(k))))
        .then(() => self.clients.claim()));
});
// Compartir → Profe (deuda GE): Android manda el audio aquí (POST, manifest `share_target`). Se deja en el equipo
// (caché aparte, una sola entrada) y se abre ✂ Recortar, que lo lee de ahí.
const COMPARTIDO = 'profe-compartido';
self.addEventListener('fetch', e => {
    if (e.request.method === 'POST' && new URL(e.request.url).pathname.endsWith('/MOVIL/compartir-audio')) {
        e.respondWith((async () => {
            try {
                const datos = await e.request.formData();
                const f = datos.getAll('audio').find(x => x && typeof x === 'object' && x.size);
                if (f) {
                    const c = await caches.open(COMPARTIDO);
                    await c.put(new URL('compartido-audio', base).href, new Response(f, { headers: {
                        'Content-Type': f.type || 'application/octet-stream',
                        'X-Nombre': encodeURIComponent(f.name || 'Audio') } }));
                }
            } catch (_) {}
            return Response.redirect(new URL('MOVIL/recortar.html?compartido=1', base).href, 303);
        })());
        return;
    }
    if (e.request.method !== 'GET') return;
    const u = new URL(e.request.url);
    const limpia = u.origin + u.pathname;
    if (!URLS.has(limpia) && !URLS.has(e.request.url)) return;
    e.respondWith((async () => {
        const c = await caches.open(CACHE);
        try {
            // no-cache: pregunta al servidor si hay versión nueva (sin esto, el navegador puede
            // entregar una copia de hasta 10 min y mezclar piezas viejas con nuevas).
            const r = await fetch(e.request.mode === 'navigate' ? e.request.url : e.request, { cache: 'no-cache' });
            if (r && (r.ok || r.type === 'opaque')) c.put(limpia, r.clone());   // opaca = librería externa
            return r;
        } catch (_) {
            const g = await c.match(limpia) || await c.match(e.request, { ignoreSearch: true });
            if (g) return g;
            throw _;
        }
    })());
});
