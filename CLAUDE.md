# CLAUDE.md — Ecosistema PROFE

## Idioma

Responde **siempre en español**. Comentarios en código, nombres de variables, mensajes de confirmación: todo en español o inglés técnico según claridad.

---

## Qué es este repositorio

Ecosistema de aplicaciones pedagógicas para un profesor de música en escuela pública (Renca, Santiago). El profesor maneja ~200 alumnos en 15 contextos (cursos, talleres, jefatura) con semana laboral L-M-M-J. El objetivo es reemplazar notebook personal, DAWs pesados, PowerPoint y Excel por herramientas web livianas, offline-first, usables desde celular y PC de escuela.

**Quién usa esto:** una sola persona (el profesor). No hay equipo, no hay usuarios múltiples excepto el modo invitado para sustitutos.

---

## Módulos del ecosistema

| Carpeta | Módulo | Estado |
|---------|--------|--------|
| `SRP/` | Sistema de Revisión Pedagógica — captura de voz → IA → pendientes organizados | **Producción** |
| `PIZARRA/` | **Pizarra** (= Presentador Pedagógico) — runtime markdown → slides en clase, fullscreen, YouTube embed | **Funcional** |
| `PRESENTADOR PEDAGÓGICO/` | *(carpeta vacía — el módulo vive en `PIZARRA/`)* | — |
| `CUADERNO MIDI/` | Captura rápida de melodías, exporta MIDI | Planificado |
| `METALÓFONO APP/` | Herramienta pedagógica visual basada en MIDI | En desarrollo |
| `LECTOR TABLATURAS/` | Lector de partituras MXL/MSCZ | En desarrollo |
| `FLAUTA APP/` | Digitaciones y ejercicios interactivos | Planificado |
| `HUIRO APP/` | Práctica rítmica y patrones | Planificado |
| `CIFRADO AMERICANO/` | Cifrado de acordes | Planificado |
| `REPERTORIO/` | **Repertorio** — biblioteca de canciones, visor letras sincronizado, importación iTunes+LRCLIB | **v1 completa** |
| `ANALIZADOR/` | **Analizador Pedagógico** — estadísticas de uso + análisis Gemini | Funcional |
| *(sin carpeta)* | **Portal** — hub de planificación en PC, dashboard temporal | En prototipo (Fase 4) |
| *(sin carpeta)* | **Libro de Clases** — evaluaciones con modo mobile offline | Pendiente (Fase 5) |

**Sub-secciones dentro de SRP** (no son módulos independientes): Captura de ideas, Bienestar, Jefatura, Administrativos, Mensajes, Planificaciones.

**Módulo futuro considerado:** Biblioteca Musical — interfaz navegable sobre Supabase Storage para explorar MIDIs, ejercicios y canciones. Depende de Fases 4+.

Cada módulo en producción o desarrollo activo tiene su propio `CLAUDE.md` interno con detalles técnicos.

**Versión activa por módulo:**
- Metalófono: `METAL21 (ALPHA).HTML` es la última estable conocida
- Lector Tablaturas: `T25–T34.html` son las últimas 10 iteraciones (la activa es la de número más alto)
- SRP: `mobile_ui/index.html` es la única UI activa

**Assets pedagógicos reales — no modificar sin confirmar:**
- `METALÓFONO APP/MIDI/` — archivos MIDI creados por el profesor para sus clases
- `LECTOR TABLATURAS/TABS/` — partituras MuseScore reales (ESCALA DE DO, etc.)

---

## Decisión de stack — inamovible

**HTML/JS vanilla.** Sin React, sin Vue, sin build tools, sin npm.

Razón: funciona en cualquier PC de escuela sin instalar nada, en internet inestable, abriendo el archivo directamente en el navegador. Los módulos existentes (SRP, Metalófono, Tablaturas) fueron construidos así en decenas de iteraciones — no migrar.

| Capa | Tecnología |
|------|-----------|
| Frontend (todas las apps) | HTML + JS vanilla, PWA donde aplique |
| Base de datos + auth + storage | Supabase (free, São Paulo) |
| Backend SRP (IA) | Python + FastAPI (futuro) |
| IA de parseo SRP | Gemini (Google) — no migrar hasta estabilizar |
| Hosting frontend | Vercel o GitHub Pages (futuro) |

**Patrón offline estándar del ecosistema:**
Toda app que necesite funcionar sin internet sigue este patrón:
1. Datos se guardan localmente (IndexedDB en el navegador)
2. Al recuperar conexión → sincronización con Supabase
3. Campo `sincronizado` (bool) en tablas críticas para rastrear qué falta sincronizar

SRP usa este patrón en la Bandeja (grabaciones locales → sync al guardar). Libro de Clases lo usará en `evaluaciones.sincronizado`. Toda nueva app que necesite offline debe seguir este mismo patrón, no inventar uno nuevo.

---

## Supabase — infraestructura compartida

Todas las apps del ecosistema comparten la misma base de datos.

```
URL:      https://bfinpxcwcsteintikrtt.supabase.co
Anon key: sb_publishable_nKng6T9w2MA0fLrJ778Jog_2ZV_BrsB
```

Archivos locales en `supabase/`:
- `config.js` — credenciales (incluir con `<script src="../supabase/config.js">` desde cualquier app)
- `schema.sql` — DDL de las tablas base
- `seed.sql` — 15 contextos + horario real
- `test.html` — verificación de conexión

La anon key es pública (va en el frontend). La secret key nunca va en el navegador.

**Tablas base (Fase 3, completa):**

| Tabla | Contenido |
|-------|-----------|
| `contextos` | 15 contextos — poblada |
| `horario` | Estructura semanal L-M-M-J — poblada |
| `sesiones` | Instancias concretas (contexto + fecha) |
| `sesiones_srp` | Registros SRP procesados |
| `pendientes` | Items parseados con `sesion_id` |

---

## Los 15 contextos

| Nombre | Tipo | Día |
|--------|------|-----|
| ORIENTACIÓN | jefatura | Lunes |
| TERCERO | curso | Lunes |
| CUARTO | curso | Lunes |
| CUERDAS | taller | Lunes |
| ENLACE | jefatura | Martes |
| SEXTO | curso | Martes |
| RECREO | recreo | Martes |
| QUINTO | curso | Martes |
| PRIMERO | curso | Miércoles |
| SEGUNDO | curso | Jueves |
| SEPTIMO | curso | Jueves |
| KIDS CASTIGADAS | taller | Jueves |
| OCTAVO | curso | Jueves |
| CASTIGADAS | taller | Jueves |
| GENERAL | general | — (virtual, ítems sin curso específico) |

Jefatura actual: 8° básico (puede cambiar de año en año).

**Alias de display para espacios compactos:**
Cuando el nombre completo no cabe en una sola línea en un espacio compacto (card, badge, chip), usar el alias corto en lugar de truncar con ellipsis:

| Nombre completo | Alias |
|-----------------|-------|
| KIDS CASTIGADAS | KIDS |

**Patrón de implementación (HTML/JS vanilla):**
```js
const NOMBRE_CORTO = { 'KIDS CASTIGADAS': 'KIDS' };

function ajustarNombres() {
    document.querySelectorAll('[data-nombre]').forEach(el => {
        const nombre = el.dataset.nombre;
        el.textContent = nombre;
        if (el.scrollWidth > el.clientWidth && NOMBRE_CORTO[nombre]) {
            el.textContent = NOMBRE_CORTO[nombre];
        }
    });
}
window.addEventListener('resize', () => requestAnimationFrame(ajustarNombres));
// Llamar con requestAnimationFrame(ajustarNombres) después de renderizar
```
CSS requerido en el elemento: `white-space: nowrap; overflow: hidden;`
El atributo `title` siempre debe tener el nombre completo.

---

## Los 3 conceptos arquitecturales centrales

### 1. Eje temporal

**El tiempo no es un filtro — es el eje que determina qué ves.** Todo se ancla a una sesión (contexto + fecha concreta). Los pendientes de la clase del jueves pasado no aparecen hoy. Los del martes siguiente tampoco.

Pendiente sin sesión asignada → va a la próxima clase futura del curso por defecto.

### 2. Flujo bidireccional SRP ↔ Portal

- **SRP → Portal:** Bitácora graba → Gemini parsea → pendientes con sesión → aparecen en Portal Dashboard
- **Portal → SRP:** Portal planifica sesiones futuras → aparecen en el Panel de SRP (celular)

### 3. Biblioteca de assets + deep linking

Assets en Supabase Storage con UUID. Las apps aceptan `?asset=uuid` como parámetro. Una diapositiva del Presentador puede abrir el Metalófono cargando un ejercicio específico directamente.

---

## Roles de usuario

- **Admin (el profesor):** acceso total.
- **Invitado (sustituto):** URL con token temporal. Solo ve la presentación de la sesión asignada. Sin acceso a SRP, notas ni datos de alumnos.

**Estado actual de auth:** no existe ningún sistema de autenticación todavía. Las apps son archivos locales abiertos directamente en el navegador — no hay login, no hay sesión, no hay tokens. Las tablas `usuarios` y `tokens_invitado` están planificadas pero no creadas en Supabase. No construir funcionalidades que dependan de auth hasta que esto esté implementado.

---

## Estado de deployment

**Nada está desplegado.** Todo corre en archivos locales. No hay URL pública para ninguna app. Los hostings planificados (Vercel/GitHub Pages para frontend, Railway/Render para la API Python de SRP) son trabajo futuro de Fase 2 en adelante. No asumir infraestructura de hosting al trabajar en cualquier módulo.

---

## Sobre este repositorio raíz

El git en `APPS BY ME/` es un **repositorio de backup y control de cambios del ecosistema completo**. No es el repo de deployment de ninguna app individual. SRP tiene su propio repo git interno en `SRP/`.

Las carpetas de apps sin `CLAUDE.md` propio (Metalófono, Tablaturas, etc.) no tienen contexto documentado aún — crearlo cuando se empiece a trabajar en ellas activamente.

---

## Fases de construcción

| Fase | Qué | Estado |
|------|-----|--------|
| 1 | SRP Mobile UI completa (Bitácora + Panel como PWA) | ✅ Completa (2026-05-13) |
| 2 | SRP como API HTTP (FastAPI) + deploy | ⏸ Pospuesta indefinidamente |
| 3 | Supabase: DB + horario + sesiones (eje temporal) | ✅ Completa (2026-05-12) |
| 4 | Portal: Dashboard temporal + planificación de sesiones | 🔄 En prototipo |
| 4b | Pizarra (`PIZARRA/index.html`) — runtime de presentación standalone | ✅ Completa (2026-05-15) |
| deploy | GitHub Pages — `https://patolastra.github.io/profe-apps/` | ✅ Activo (2026-05-16) |
| 5 | Libro de Clases (modo mobile evaluación prioritario) | 📋 Pendiente |
| 6 | Presentaciones (offline + invitado) + deep linking básico | 📋 Pendiente |
| 7 | Integración herramientas de música + `?asset=uuid` | 📋 Pendiente |
