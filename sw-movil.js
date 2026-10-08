// App del celular (deuda AN): abre aunque no haya señal.
// Solo atiende las páginas y piezas del celular (lista PROPIAS + la librería de Supabase);
// todo lo demás (Workspace, Planificador…) pasa directo, como si no existiera.
// Siempre pide primero a internet (así llegan las versiones nuevas) y, sin señal,
// usa la última copia guardada.
const CACHE = 'profe-movil-v1';
const PROPIAS = [
    'MOVIL/', 'MOVIL/index.html', 'MOVIL/evaluar.html', 'MOVIL/manifest.webmanifest',
    'MOVIL/icono-192.png', 'MOVIL/icono-512.png',
    'MEMORIA/index.html',
    'comun/clase-vivo.js', 'comun/asistencia.js',
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
self.addEventListener('fetch', e => {
    if (e.request.method !== 'GET') return;
    const u = new URL(e.request.url);
    const limpia = u.origin + u.pathname;
    if (!URLS.has(limpia) && !URLS.has(e.request.url)) return;
    e.respondWith((async () => {
        const c = await caches.open(CACHE);
        try {
            const r = await fetch(e.request);
            if (r && (r.ok || r.type === 'opaque')) c.put(limpia, r.clone());   // opaca = librería externa
            return r;
        } catch (_) {
            const g = await c.match(limpia) || await c.match(e.request, { ignoreSearch: true });
            if (g) return g;
            throw _;
        }
    })());
});
