Carga el contexto completo del proyecto para esta sesión. Sigue estos pasos:

1. **Leer estado dinámico** — en paralelo:
   - `git log --oneline -10`
   - `C:\Users\Pato\.claude\projects\C--Users-Pato-Desktop-PROFE-APPS-BY-ME\memory\proxima_sesion.md`

2. **Internalizar el contexto estático** del bloque de abajo — no lo repitas todo al usuario, solo úsalo para trabajar bien.

3. **Producir una respuesta corta** con este formato:

---
## Contexto cargado — [fecha]

### Estado actual
[tabla de apps: nombre | archivo activo | estado en una línea]

### Agenda de esta sesión
[bullets de proxima_sesion.md — solo lo pendiente]

### Cambios recientes relevantes
[2-3 bullets de git log que afecten el trabajo de hoy]

---

Luego pregunta: **"¿Por dónde arrancamos?"**

---

## CONTEXTO ESTÁTICO DEL ECOSISTEMA

### Filosofía del proyecto

**El problema real:** un profesor de música maneja 15 contextos distintos (cursos, talleres, jefatura) cada uno con su propia dinámica, visto solo una vez por semana. La información fluye demasiado rápido — ideas pedagógicas, pendientes, observaciones — y sin un sistema, lo urgente aplasta lo importante y las ideas se pierden antes de implementarse.

**El objetivo:** capturar ideas en el momento (durante y después de clase), procesarlas con IA, darles seguimiento, y eventualmente analizar la práctica pedagógica. No solo gestionar tareas — construir una memoria de la práctica docente que permita profundizar y mejorar.

**Para quién:** una sola persona (Pato, profesor, escuela pública Renca). No hay equipo, no hay usuarios múltiples. Cada decisión prioriza usabilidad individual sin fricción sobre cualquier otra cosa.

**Restricciones reales que guían todo:**
- Los PCs del colegio no instalan nada → HTML/JS vanilla, archivo único, abre directo en navegador
- Internet inestable en el aula → offline-first donde aplique
- Costo cero mensual → Supabase free, Gemini directo desde browser, sin backend propio
- Una sola semana laboral (L-M-M-J) con 15 contextos → el eje temporal es la columna vertebral del sistema

---

### Mapa del ecosistema

| App | Carpeta | Archivo activo | Función | Estado |
|-----|---------|---------------|---------|--------|
| **SRP** | `SRP/mobile_ui/` | `index.html` | Captura (voz/texto/foto/video) → Gemini → pendientes organizados. PWA mobile. | Producción |
| **Portal** | `PORTAL/` | `index.html` | Hub PC: calendario semanal, vista 3-col (Plan \| Editor \| Preview). | Prototipo |
| **Pizarra** | `PIZARRA/` | `index.html` | Runtime de presentaciones markdown en clase. Fullscreen, auto-fit, YouTube embed. Esto ES el "Presentador Pedagógico". | Funcional básico |
| **Repertorio** | `REPERTORIO/` | `index.html` | Biblioteca de canciones: CRUD, visor LRC sincronizado, import iTunes+LRCLIB, assets por tipo. | v1 completa |
| **Lector Tablaturas** | `LECTOR TABLATURAS/` | `T42.html` | Canvas MusicXML (.mxl): notas, timeline, loop. | En desarrollo |
| **Metalófono** | `METALÓFONO APP/` | `METAL21 (ALPHA).HTML` | Herramienta pedagógica MIDI visual. | Alpha |

**Conexiones activas entre apps:**
- **SRP → Portal:** pendientes parseados por Gemini fluyen a Supabase (`pendientes`) → Portal los importa como `plan_sesion_items`
- **Portal → Pizarra:** el editor markdown del Portal genera el contenido que la Pizarra renderiza en clase
- **Repertorio ↔ Pizarra:** integración futura — comando `/r "canción"` en slides abre el visor de Repertorio
- **Herramientas → Pizarra:** deep linking futuro — `?asset=uuid` carga un MIDI/tab directamente desde un slide

**Supabase compartido:** todas las apps usan la misma BD. Credenciales en `supabase/config.js`. La anon key va en el frontend (es pública). La secret key nunca va en el browser.

---

### Stack técnico y convenciones

**Regla inamovible:** HTML + JS vanilla. Sin React, sin Vue, sin npm, sin bundler. Cada app es un único archivo `.html` que abre directamente en el navegador. No separar en múltiples archivos, no agregar build tools.

```
Frontend:        HTML/CSS/JS vanilla, un archivo por app
Base de datos:   Supabase JS v2 (CDN) — https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2
IA parseo:       Gemini API directo desde JS browser (no migrar)
Offline:         IndexedDB + campo sincronizado (bool) en tablas críticas
Fuentes:         Google Fonts CDN (Nunito, Poppins, DM Sans) donde aplique
Tablaturas:      jszip v3.10.1 CDN
```

**Convenciones de código:**
- Estado en variables globales `let` (no módulos, no clases)
- Constantes en `const MAYUSCULAS`
- Init lazy de Supabase: `let sbClient; function getSb() { if (!sbClient) sbClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON); return sbClient; }`
- Guardar a Supabase con debounce 1.2s: `clearTimeout(timer); timer = setTimeout(async () => { await guardar(); }, 1200)`
- IDs: `crypto.randomUUID()` (con fallback genId() legacy)
- Errores: try-catch + toast 2.2s + `console.error`
- Confirmaciones destructivas: `confirm()` nativo
- Alias compactos para UI estrecha: `const NOMBRE_CORTO = {'KIDS CASTIGADAS': 'KIDS'}`

**Patrón offline-first (estándar del ecosistema):**
1. Guardar localmente (IndexedDB)
2. Al recuperar conexión → sync con Supabase
3. Campo `sincronizado` (bool) para rastrear qué falta

**Patrón UI estándar:**
- Dark mode (#0d1117 o #1e293b como bg principal)
- CSS variables en `:root` para colores y tamaños
- Toast `#toast` con clase `.show` y timeout
- Transiciones: 0.12s–0.22s (rápidas, no decorativas)
- Touch-optimized en apps mobile (SRP): no hover, swipe gestures

---

### Modelos de datos clave

**Estructura relacional principal:**
```
contextos (15 fijos) → horario (L-M-M-J)
    └── sesiones (contexto + fecha, se crean on-demand, UNIQUE)
          ├── pendientes (items SRP parseados, nullable sesion_id → próxima futura)
          ├── sesiones_srp (registros IA: fixture, raw, parse original, expected)
          ├── presentaciones (markdown del Portal, UNIQUE por sesión)
          └── plan_sesion_items (Plan de clase: texto, categoría, origen, orden)

repertorio_canciones → repertorio_assets (tipos: letra/audio/tab/metal/flauta/cifrado)
repertorio_cancion_contextos (M-M: canción ↔ contexto)
```

**Objetos JS centrales:**

```javascript
// Contexto
{ id, nombre: "OCTAVO", tipo: "curso"|"taller"|"jefatura"|"recreo"|"general",
  color: "#hex", activo: true }

// Sesión
{ id, contexto_id, fecha: "2026-05-17", nota }

// Pendiente
{ id, contexto_id, sesion_id,
  categoria: "pendientes_sala"|..., // ver categorías SRP abajo
  texto, estado: "activo"|"completado"|"descartado", fecha_captura }

// Plan item (Portal)
{ id, sesion_id, texto, categoria, orden,
  origen: "srp"|"manual", pendiente_id, incluido, completado }

// Canción (Repertorio)
{ id, nombre, artista, año, estilo, artwork_url, creado,
  assets: [{ id, cancion_id, tipo, etiqueta, contenido, synced, lrclib_id, storage_path, orden }] }
```

**Categorías del parser SRP (9 + revision):**
| Categoría | Emoji | Cuándo usarla |
|-----------|-------|--------------|
| `pendientes_sala` | 🎵 | Acciones directas al llegar a clase, sin prep previa |
| `pendientes_planificacion` | 🧠 | Trabajo de preparación antes de clase |
| `pendientes_materiales` | 🎒 | Transporte físico de objetos dentro del colegio |
| `pendientes_casa` | 🏠 | Tareas fuera del contexto institucional |
| `pendientes_administrativos` | 📋 | Documentación y procedimientos formales |
| `pendientes_mensajes` | 💬 | Comunicaciones con destinatario explícito |
| `pendientes_jefatura` | 👥 | Rol jefe de curso (actualmente OCTAVO) |
| `pendientes_apps` | 💻 | Ideas de software/tecnología |
| `posible_repertorio` | 🎼 | Canciones/obras posibles para trabajar |
| `revision` | — | Notas generales de clase (no es un pendiente) |

---

### Estado actual de cada app

**SRP** (`SRP/mobile_ui/index.html`) — Producción
- Core completo: captura multimodal, transcripción Gemini, parseo, historial, Panel de lectura
- Pendiente: migrar `historial` IndexedDB → tabla `sesiones_srp` Supabase
- Audio se descarta tras transcribir (decisión de diseño, no un bug)
- Gemini en cascada: `gemini-2.0-flash-lite → gemini-2.5-flash → gemini-flash-lite-latest → gemini-2.0-flash`
- IndexedDB: `SRP_VozDB` v3, stores: `grabaciones`, `historial`, `expected_outputs`

**Portal** (`PORTAL/index.html`) — Prototipo funcional
- Implementado: calendario semanal, vista 3-col (Tríptico), editor markdown, preview slides, plan items CRUD + drag-drop + undo/redo
- Pendiente: import pendientes desde SRP, workflow arrastre (revisar/aceptar/rechazar), persistencia guardar presentación (debounce escrito, handler incompleto)
- Tab key: alterna plan ↔ presentación. ? key: cheatsheet markdown. Ctrl+Z: undo por zona

**Pizarra** (`PIZARRA/index.html`) — Funcional básico
- Renderiza markdown a slides (delimitador `---`), fullscreen, auto-fit font, YouTube embed
- Sin integración Supabase todavía
- ESTO ES el "Presentador Pedagógico" — mismo concepto, nombre cambió

**Repertorio** (`REPERTORIO/index.html`) — v1 completa, pendiente activar Supabase
- Requiere acción manual antes de usar: (1) ejecutar `REPERTORIO/supabase_schema.sql` en Supabase SQL Editor, (2) crear bucket `repertorio-audio` (Public, 20MB limit)
- Pendiente implementar: editor sync de precisión (offset LRC-audio), modo entrenamiento, integración /r con Pizarra
- Storage: `repertorio-audio` bucket, URLs públicas

**Lector Tablaturas** (`LECTOR TABLATURAS/T42.html`) — En desarrollo
- Canvas: pentagrama 6 cuerdas, notas como círculos numerados, timeline scroll, loop points
- Parseo MusicXML parcial. Depende de jszip para .mxl
- Assets pedagógicos reales en `TABS/` — NO modificar sin confirmar

**Metalófono** (`METALÓFONO APP/METAL21 (ALPHA).HTML`) — Alpha
- Sin CLAUDE.md interno, sin documentación
- Assets pedagógicos reales en `MIDI/` — NO modificar sin confirmar

---

### Componentes reutilizables detectados

Estos patrones ya existen en el código — reusarlos, no reinventarlos:

```javascript
// Toast de notificación (todas las apps)
function toast(msg, duration = 2200) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), duration);
}

// Alias de nombres cortos para UI compacta
const NOMBRE_CORTO = { 'KIDS CASTIGADAS': 'KIDS' };
function ajustarNombres() {
    document.querySelectorAll('[data-nombre]').forEach(el => {
        el.textContent = el.dataset.nombre;
        if (el.scrollWidth > el.clientWidth && NOMBRE_CORTO[el.dataset.nombre])
            el.textContent = NOMBRE_CORTO[el.dataset.nombre];
    });
}

// Parseo LRC (Repertorio)
function parseLRC(text) {
    return text.split('\n')
        .map(l => l.match(/\[(\d+):(\d+\.\d+)\](.*)/))
        .filter(Boolean)
        .map(([, m, s, t]) => ({ time: (+m * 60 + +s) * 1000, text: t.trim() }));
}

// Parseo slides markdown (Portal + Pizarra — IDÉNTICO en ambas, debe mantenerse sincronizado)
function parsearSlides(texto) {
    return texto.split(/^---$/m).map((raw, i) => ({ numero: i + 1, content: raw.trim() }));
}

// Auto-fit font-size al viewport (Portal preview + Pizarra)
function autoFitSlide(el) {
    let lo = 8, hi = 72, mid;
    while (lo < hi - 1) {
        mid = (lo + hi) >> 1;
        el.style.fontSize = mid + 'px';
        el.scrollHeight > el.clientHeight ? hi = mid : lo = mid;
    }
    el.style.fontSize = lo + 'px';
}
```

---

### Regla de mantenimiento de esta skill

**Si en una sesión algo contradice, extiende o enriquece lo que está aquí — actualizar esta skill antes de continuar.** La skill es la fuente de verdad sobre el proyecto; el código es la implementación.

Actualizar cuando cambie: estado de una app, nuevo modelo de datos, nueva conexión entre apps, nueva decisión arquitectural, nuevo componente reutilizable, cambio en filosofía o prioridades.
