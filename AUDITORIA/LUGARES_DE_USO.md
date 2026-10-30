# Lugares de uso de las piezas principales

> **Para qué sirve (DECISIÓN del PO, 2026-10-24).** Una mejora pedida pensando en un lugar debe llegar a **todos** los
> lugares donde se usa esa pieza. Antes de cerrar un desarrollo, la ficha (`DESARROLLO_PARALELO.md`) anota los lugares de
> uso afectados y se revisa cada uno; si un lugar debe quedar distinto, se dice por qué. Ver regla 11 de `CLAUDE.md` §4.
>
> **Mantenimiento:** cuando una pieza gana o pierde un lugar de uso, se actualiza esta tabla en el mismo commit.
> Las piezas `comun/*.js` se pueden volver a listar con: `grep -rl "comun/<pieza>.js" --include=*.html .`

## Entrenador (`REPERTORIO/index.html`, un solo archivo para todos sus usos)

| Lugar | Cómo se abre | Particularidad |
|---|---|---|
| Biblioteca, canción suelta | ficha de la canción (`?cancion=`) | lo pintado/escondido se guarda solo en ese equipo |
| Entrenador (pestaña) | Workspace 🎵 (`?vista=sesiones`) → repertorio del curso (`?practicar=`) | lo pintado/escondido se guarda en la sesión (deuda CS) |
| Canción de una actividad del Plan | pestaña del Workspace (`?practicar=&cancion=` o `?cancion=`) | igual que arriba según tenga sesión |
| Entrenador mínimo del Plan | `?mini=1` sobre Presentación + Vista previa | sin cancionero; en clase abre la Pizarra (`&pizarra=1`) |
| Copia en la Pizarra | `?espejo=1`, capa encima de la Pizarra | solo obedece al profe, en silencio, sin barra |
| Pizarra, tecla T | `?practicar=|cancion=…&proyeccion=1` | barra oculta al abrir; **por eliminar** (Notion, PO 2026-10-24) |
| Metalófono dentro del Entrenador | `#metal-overlay` (iframe del Metalófono) | ver Metalófono |
| Estudiantes: canción compartida | `CANTAR/index.html` (enlace corto `l/?a=&n=`, deuda EQ) | **otro archivo, copia del estilo** del Entrenador del celular (clases `ent-*`): un cambio de estilo de la letra o del reproductor se repite allá |

## Lector de tablaturas (`tabs/index.html`, archivo único)

| Lugar | Cómo se abre |
|---|---|
| Workspace 🎸 Tablaturas | `?admin=1` (panel de administración) |
| Biblioteca | tablatura (`?storage=&nombre=`), una sección (`&seccion=`), crear cifrado (`?cifrado=1&cancion=`) |
| Entrenador | tablatura elegida → pestaña del Workspace (`ws-abrir`) o ventana nueva |
| Alumno / lecciones (congeladas) | asignaciones `alumno_tabs` y lecciones |
| Celular del estudiante | `?p=` en un celular → versión móvil horizontal (`html.movil`, deuda DP) |
| Enlace corto de una tablatura | `t/?a=<id>[&s=<sección>]` → `?a=` en modo público (solo publicadas; deuda DP) |

## Metalófono (`METALÓFONO APP/METAL21 (ALPHA).HTML`)

| Lugar | Modo |
|---|---|
| Workspace, Biblioteca, Plan (`?midi=&nombre=`) | profesor |
| Dentro del Entrenador (`#metal-overlay`) | profesor |
| Link / QR del alumno (`m/?a=&n=`) | alumno (sin Supabase) |

## Editor de Melodías (`MELODIA/index.html`, deuda DK)

| Lugar | Cómo se abre |
|---|---|
| Workspace, menú + | ♬ Editor de Melodías: lista de canciones (✏️ / ＋ Nueva melodía) · 🎹 Piano: lista de melodías |
| Biblioteca, ficha de la canción | "+ Agregar asset" → ♬ Melodía (`?cancion=`) y ✏️ en cada melodía (`?asset=`): pestaña cerrable del Workspace (`ws-abrir`, guarda al cerrar) o ventana nueva |
| Piano del estudiante (`PIANO/`, deuda DL) | 🎹 en la ficha (pestaña del Workspace) y enlace `p/?a=&n=` (🔗 Compartir, solo publicadas); lee `melodia/<id>.json`, sin base de datos |
| Entrenador, Plan, celular | aún no abren "Melodía" (el Entrenador la esconde de su desplegable); su MIDI sí se abre en el Metalófono desde la ficha |
| Editor de Arreglos (`ARREGLO/`, deuda ES) | "Copiar" trae una copia de la melodía (de `melodia/<id>.json`) al arreglo; no queda vinculada |

## Arreglo de piano (`ARREGLO/index.html` + `PIANO/?r=`, deuda ES)

| Lugar | Cómo se abre |
|---|---|
| Biblioteca, ficha de la canción (grupo 🎹 Piano) | "+ Arreglo de piano" y "+ Agregar asset" → 🎹 Arreglo (`?cancion=`), ✏️ en cada arreglo (`?asset=`): pestaña cerrable del Workspace (guarda al cerrar) o ventana nueva · 🎹 abre el Piano como lo ve el estudiante · ✈ (solo publicados) con 📅 Disponible hasta |
| Editor de Arreglos, vista previa | el Piano dentro del editor (`PIANO/?vista=editor`, datos por mensaje) |
| Piano del estudiante | enlace `p/?r=&n=`; lee `arreglo/<id>.json` (sin base de datos), con la grabación por `grabacion-tono.js` |
| Entrenador, Plan, celular | aún no abren arreglos (el Entrenador los esconde de su desplegable) |

## Piezas compartidas (`comun/`)

| Pieza | Dónde se usa |
|---|---|
| `editor-bloques.js` | Cursos (curso, ☀ Hoy y 📚 Estudios; tipo Cita y `insertar`, deuda EB) · Plan: Actividades, ✍🏼 Bitácora, bitácora por actividad, Historial · celular Cursos (`tactil`) · Cuaderno · Pizarra (solo lectura) |
| `pendientes.js` | Dashboard (☀ Hoy y Todos) · Plan (pestaña Pendientes) · ✍🏼 Bitácora (Pendientes → fecha) · Cursos (columna ☑ Pendientes, curso y Hoy) · celular inicio |
| `apoderados.js` | Dashboard (👪 y citas de hoy) · Plan (👪) · celular sin clase (👪 y citas de hoy) (en Cursos se quitó, DR) |
| `asistencia.js` | Plan (Pasar lista) · Libro · Pizarra (espejo) · celular Evaluar · Workspace |
| `libro-proyeccion.js` | Libro (📽️ Proyectar) · Pizarra · Workspace |
| `cuaderno.js` | Plan (📔) · Cursos (📔 Cuaderno) · Pizarra (espejo) |
| `compartir.js` | Biblioteca: ficha de la canción, ✈ de la melodía de metalófono, del piano, del arreglo de piano (con `plazo`, ES) y de cada tablatura y sección publicada (deudas DQ y DP) |
| `grabacion-tono.js` | Mapa de tempo (`TEMPO/`, tocar más lento y marcar pulsos; EU) · Piano del estudiante con arreglo (grabación en el tono del arreglo, más lenta sin cambiar el tono; ES); 🎤/🎶 sin corte, ET) |
| `tempo-mapa.js` (EU) | Mapa de tempo de la canción (segundo ↔ pulso ↔ compás, y sus secciones): app `TEMPO/` · Editor de Arreglos (resumen y vista previa) · Piano con arreglo (calce con la grabación, PC y celular). Siguen: Lector, loops del Entrenador, Cajón y Metrónomo con la grabación, Editor de Melodías |
| `dos-grabaciones.js` (ET) | Melodía ↔ Karaoke exacto en un solo reproductor: Entrenador en todas sus versiones (también es su motor de Pitch y velocidad; la copia de la Pizarra no suena) · Cantar. El Piano con arreglo hace lo mismo con `grabacion-tono.js` |
| `redactar-oa.js` | Libro: ✨ Redactar OA en Nueva evaluación y en la cabecera (solo cursos; DS) · llamada a Gemini compartida |
| `citar.js` | ❝ Citar de 📚 Estudios: Cursos del PC y Bitácora del celular (deuda EC) |
| `rubrica-ia.js` | Libro: ✨ Proponer con IA en el editor de instrumentos y en Plantillas (solo cursos; DT) |
| `archivos-curso.js` | Cursos (📁 Archivos) · Cursos del celular (📁, EJ) · guía QR de `compartir.js` · 📷 Subir del celular · Extractos y versiones de la Biblioteca (DQ, DU) |
| `fotos-clase.js` | Bitácora: Cursos PC (curso y ☀ Hoy) · Plan (✍🏼 y 🕘 Historial) · Cursos del celular (DU fase 4) |
| `recurrentes.js` / `fecha-pizarra.js` | Plan (🔔) · Pizarra |
| `clase-vivo.js` | Plan · Pizarra · Libro · Biblioteca/Entrenador · Workspace · Bitácora (MEMORIA) · celular (inicio, Cursos, Evaluar) |
| `tiempo-real.js` | Plan · Pizarra · Libro · Biblioteca/Entrenador · Cursos · celular (Cursos, Evaluar) |
| `puntero.js` | Entrenador del profe (completo y mínimo, mientras proyecta) → copia en la Pizarra · Plan: Vista previa y vista de clase → Pizarra · Pasar lista (Plan y Libro) → Pizarra · Cuaderno del Plan → Pizarra · Metalófono del Entrenador → copia en la Pizarra · Participación del Libro → Pizarra (Evaluaciones y Entregas: no, la lámina proyectada es distinta). Un solo botón 🔴, en la barra del Plan |
| `volumen.js` | Entrenador del profe (Biblioteca, sesión del curso, mínimo del Plan): canción, ritmos (`ritmo-render.js`) y Metalófono · celular: 🔊 VOLUMEN en el inicio con la clase en curso · copia de la Pizarra: siempre muda |
| `mensajes.js` | Dashboard: pestaña ✉️ · celular: inicio sin clase, pestaña ✉️. Se anotan con `/mensaje` en todo cuadro de `pendientes.js` (Dashboard, Plan, Bitácora, Cursos, celular) |
| `nombre-asset.js` | Biblioteca/Entrenador · Lector · Plan · Planificaciones · Workspace |

## Libro de clases (`LIBRO/index.html`)

| Lugar | Cómo se abre |
|---|---|
| Libro directo | `?ctx=&sesion=` |
| 📒 Libros (pestaña fija) | iframe a la derecha de la lista de instancias (`LIBROS/`); el 📒 del Plan lleva aquí |
| Pizarra | lo que el Libro proyecta (`libro-proyeccion.js`) |
| Celular 📝 Evaluar | evaluaciones por toques (`MOVIL/evaluar.html`, mismas tablas) |

## Ritmos (`RITMOS/index.html`, deuda DM)

| Lugar | Cómo se abre |
|---|---|
| Workspace, menú + | 🥁 Ritmos: pestañas ⏱ Metrónomo · 🪘 Cajón (`CAJON-PERUANO/` adentro, sin cambios) |

## Cajón (`CAJON-PERUANO/index.html`, deudas CH y EF)

| Lugar | Cómo se abre |
|---|---|
| 🥁 Ritmos, pestaña 🪘 Cajón | adentro de Ritmos; 🎛️ Programar → 📂 Abrir los ritmos guardados |
| Biblioteca, ficha de la canción | ＋ recurso → 🪘 Cajón (`?cancion=`) o ✏️ de un recurso Cajón (`?asset=`): pestaña cerrable del Workspace |
| Suelto | `CAJON-PERUANO/index.html` (con `?midi=` carga un MIDI) |
| Estudiantes (celular) | ✈ del recurso Cajón publicado → enlace corto `c/?a=&n=` → `?modo=alumno` (solo mirar y tocar) |
