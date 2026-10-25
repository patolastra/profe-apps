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

## Lector de tablaturas (`tabs/index.html`, archivo único)

| Lugar | Cómo se abre |
|---|---|
| Workspace 🎸 Tablaturas | `?admin=1` (panel de administración) |
| Biblioteca | tablatura (`?storage=&nombre=`), una sección (`&seccion=`), crear cifrado (`?cifrado=1&cancion=`) |
| Entrenador | tablatura elegida → pestaña del Workspace (`ws-abrir`) o ventana nueva |
| Alumno / lecciones (congeladas) | asignaciones `alumno_tabs` y lecciones |

## Metalófono (`METALÓFONO APP/METAL21 (ALPHA).HTML`)

| Lugar | Modo |
|---|---|
| Workspace, Biblioteca, Plan (`?midi=&nombre=`) | profesor |
| Dentro del Entrenador (`#metal-overlay`) | profesor |
| Link / QR del alumno (`m/?a=&n=`) | alumno (sin Supabase) |

## Piezas compartidas (`comun/`)

| Pieza | Dónde se usa |
|---|---|
| `editor-bloques.js` | Cursos (curso y ☀ Hoy) · Plan: Actividades, ✍🏼 Bitácora, bitácora por actividad, Historial · celular Cursos (`tactil`) · Cuaderno · Pizarra (solo lectura) |
| `pendientes.js` | Dashboard (☀ Hoy y Todos) · Plan (pestaña Pendientes) · ✍🏼 Bitácora (Pendientes → fecha) · Cursos (columna ☑ Pendientes, curso y Hoy) · celular inicio |
| `apoderados.js` | Dashboard (👪 y citas de hoy) · Plan (👪) · Cursos |
| `asistencia.js` | Plan (Pasar lista) · Libro · Pizarra (espejo) · celular Evaluar · Workspace |
| `libro-proyeccion.js` | Libro (📽️ Proyectar) · Pizarra · Workspace |
| `cuaderno.js` | Plan (📔) · Cursos (📔 Cuaderno) · Pizarra (espejo) |
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
