# CLAUDE.md — Fuente de Verdad del Ecosistema Profe Apps

> **Qué es este documento.** La referencia oficial, permanente y normativa de Profe Apps. Es el punto de partida para el Autor, ChatGPT y Claude antes de trabajar. Resume y **norma**; el detalle fino del inventario vive en `AUDITORIA/INVENTARIO_ECOSISTEMA.xlsx`.
>
> **Cómo leer las etiquetas.** A lo largo del documento:
> - **HECHO** — comprobable técnicamente en el repo/Git/Supabase.
> - **DECISIÓN** — aprobada oficialmente por el Autor (cerrada en Fase 1.5).
> - **PROPUESTA** — alternativa planteada; **no** es decisión.
> - **PENDIENTE** — todavía sin resolver o no verificable.
>
> **Estado de la Fuente de Verdad:** creada en Fase 2 (2026-09-11) a partir de F0 (historia), F1 (auditoría técnica) y F1.5 (clasificación del Autor). No introduce decisiones nuevas.

---

## 1. Identidad del proyecto

Ecosistema de aplicaciones pedagógicas para **un profesor de música** en escuela pública (Renca, Santiago). Maneja ~200 alumnos en **15 contextos** (cursos, talleres, jefatura), semana laboral L-M-M-J. Reemplaza notebook personal, DAWs pesados, PowerPoint y Excel por **herramientas web livianas, offline-first, usables desde celular y PC de escuela**.

- **Hoy (HECHO):** lo usa una sola persona (el profesor). Sin equipo, sin multiusuario (salvo modo invitado para sustitutos, aún futuro).
- **Horizonte (DECISIÓN de dirección):** preparar una **V1 comercial** (~6 meses) usable por **varias escuelas**. Ver §8 y decisiones **#10** y **#11**.

**Idioma:** responder **siempre en español**; código y nombres en español o inglés técnico según claridad.

---

## 2. Mapa del ecosistema

Estado = clasificación oficial de Fase 1.5 (ver §5 para la leyenda). Detalle por elemento en el Excel.

| Módulo | Qué hace / para quién | Ubicación | Estado (F1.5) |
|---|---|---|---|
| **Portal / Planning** | Planificación de sesiones + Dashboard. Profesor. | `PORTAL/index.html` | 🟢 Activo |
| **Workspace PC** | Entrada PC: pestañas + iframes persistentes. Profesor. | `PC/workspace.html` | 🟢 Activo — **entrada PC actual** |
| **Dashboard** | Calendario 3 semanas + panel de pendientes (dentro del Portal). | `PORTAL/` | 🟢 Activo |
| **Repertorio** | Biblioteca de canciones + visor de letras + Entrenador. | `REPERTORIO/index.html` | 🟢 Activo |
| **Entrenador** | Editor central de assets (letras/sync/proyección). Vive en Repertorio (`?vista=sesiones`). | `REPERTORIO/` | 🟢 Activo |
| **Ritmo** | Motor rítmico del Entrenador (`ritmo.js` + `ritmo-render.js`). | `REPERTORIO/` | 🟢 Activo |
| **Lector de Tablaturas** | Lector MXL/MusicXML, audio sync, secciones, modo cifrado. | `tabs/index.html` | 🟢 Activo |
| **Pizarra** (= Presentador Pedagógico) | Runtime markdown → slides en clase, fullscreen, YouTube. | `PIZARRA/index.html` | 🟢 Activo |
| **Libro de Clases** | Evaluación/participación (infra base F1 lista). | `LIBRO/index.html` | 🟢 Activo |
| **Bitácora / Memoria** | Documento narrativo permanente de la clase (móvil). | `MEMORIA/index.html` + tabla `memorias` | 🟢 Activo — **lo visible del móvil hoy** |
| **Metalófono** | Herramienta pedagógica MIDI. | `METALÓFONO APP/METAL21 (ALPHA).HTML` | 🟢 Activo (estable; el rótulo "alpha" es histórico) |
| **ADMIN** | Gestión de pendientes (CRUD, 3 vistas). | `ADMIN/index.html` | 🟡 Activo pero antiguo → **futuro panel de administración** |
| **CAJÓN (generador de planificación)** | Genera planificaciones `.docx`. | `CAJON/generador-planificacion.html` | 🟡 Activo pero antiguo (en uso) |
| **ANALIZADOR** | Analítica de uso (`eventos_uso`) + análisis Gemini. | `ANALIZADOR/index.html` | 🟡 Antiguo — **visor congelado, logging activo** |
| **SRP** | Captura voz → Gemini → pendientes. | `SRP/` | 🔵 **Congelado** (concepto + backend) |
| **Shells antiguos** | Launcher PC clásico y shell móvil histórico. | `PC/index.html`, `MOVIL/index.html` | 🟠/🟣 **En retiro** (reemplazados) |

**Contratos y assets reales (HECHO):**
- Lector: `tabs/index.html` es el **único** archivo oficial (no crear `index-beta`/`dev`/`2`; todo se desarrolla ahí).
- Assets pedagógicos reales — **no modificar sin confirmar**: `METALÓFONO APP/MIDI/` (MIDIs reales del profesor), `tabs/TABS/` (partituras MuseScore reales).

**Módulos futuros identificados (no existen aún):** Flauta, Huiro, Cifrado, Chords (Cifrado+Chords a fusionar), Games, Cajón-instrumento (percusión), Cuaderno MIDI, Biblioteca Musical. Ver §9.

**Pizarra vs Presentador Pedagógico (aclaración):** `PIZARRA/` es el **módulo actual** (Pizarra = Presentador Pedagógico). **No son dos módulos:** `PRESENTADOR PEDAGÓGICO/` es únicamente un **documento histórico de diseño** (el prompt que dio origen a Pizarra), que se **archiva/conserva** como referencia.

---

## 3. Arquitectura vigente

### Stack — inamovible (DECISIÓN)
**HTML/JS vanilla.** Sin React, Vue, build tools ni npm. Razón: funciona en cualquier PC de escuela sin instalar nada, con internet inestable, abriendo el archivo en el navegador.

| Capa | Tecnología |
|---|---|
| Frontend (todas las apps) | HTML + JS vanilla, PWA donde aplique |
| Base de datos + auth + storage | Supabase (free, São Paulo) |
| Backend SRP (IA) | Python + FastAPI (**pospuesto/congelado**) |
| IA de parseo SRP | Gemini (congelado con SRP) |
| Hosting | GitHub Pages (desde `master`) |

### Entrada y navegación (HECHO)
- La raíz detecta dispositivo: **PC → `PC/workspace.html`** (Workspace, entrada actual); **móvil → `MOVIL/index.html`**.
- **Workspace PC** (`PC/workspace.html`): modelo de **pestañas con `key` única** + iframes persistentes + canal `postMessage` (`ws-abrir`, `ws-titulo`, `ws-guardar`/`ws-guardado`); pestañas `fijo` (no cerrables) y `guardarAlCerrar` (handshake de guardado). Tiene su propio catálogo de apps y **no lee `modulos.js`**.
- Módulos (Portal, SRP, etc.) no son shells: verifican `sessionStorage.profe_auth === '1'` y redirigen si no hay auth.

### Protocolo de deep linking inter-módulo (HECHO — contrato)
Columna vertebral de la interoperabilidad. Toda app nueva debe respetarlo.

| Parámetro | Descripción | Apps |
|---|---|---|
| `?ctx=<NOMBRE>` | Contexto activo — **uppercase, = campo `nombre` en `contextos`** | Portal, Repertorio, Libro |
| `?modo=<modo>` | `pres`, `remoto`, `catalogo`, `entrenamiento`, `alumno`… | Pizarra, Repertorio |
| `?sesion=<uuid>` / `?slide=<n>` | Sesión / slide | Pizarra |
| `?tab=<path>` | Path relativo a `tabs/TABS/` | Lector |
| `?cancion=<id>` / `?practicar=` / `?proyeccion=1` / `?vista=sesiones` | Canción / práctica / proyección / Entrenador | Repertorio |
| `?asset=<uuid>` | Asset en Storage (futuro) | Futuro |
| `?alumno=<id>` | Alumno | Libro |

**Codificación de URL (HECHO — cuidado):** al construir `iframe.src` en el Workspace, la query ya viene codificada; se codifica **solo el path** (no reencodear la query), para no romper `?ctx` con caracteres como `%` (bug de doble codificación ya corregido).

### Los 4 conceptos centrales (HECHO)
1. **Eje temporal:** el tiempo no es un filtro, es el eje. Todo se ancla a una **sesión** (contexto + fecha). Pendiente sin sesión → próxima clase futura del curso.
2. **Flujo SRP ↔ Portal** (hoy en pausa por SRP congelado): SRP→Portal (captura→pendientes) y Portal→SRP (planifica→panel móvil).
3. **Biblioteca de assets + deep linking:** assets en Storage con UUID; `?asset=uuid` (futuro).
4. **Memoria de clase:** documento narrativo permanente de la sesión (tabla `memorias`, 1:1 con `sesiones`, audios en bucket `memorias-audio`). **No genera pendientes, no ejecuta IA.** No confundir con la Bitácora de captura de SRP. En el móvil, "Bitácora" (`MEMORIA/`) es hoy la única superficie visible.

### `modulos.js` (HECHO + PENDIENTE)
Registro de módulos leído por `PC/index.html`, el drawer de `MOVIL` y el dock del Portal — **los tres en retiro o ya muertos**; el Workspace lo ignora. Hoy es 🟠 **LEGACY** sin renderizador activo real. Su destino (promover a catálogo único del Workspace **o** retirar) queda **DIFERIDO a Fase 3**. Hasta entonces: **no actualizar sus datos ni borrarlo**.

---

## 4. Reglas arquitectónicas (normativas — Claude debe respetarlas)

Estas son **reglas**, no recomendaciones:

1. **Stack vanilla inamovible.** Nada de frameworks/build/npm.
2. **`?ctx` = `contextos.nombre` en UPPERCASE.** Esa clave técnica **nunca** se cambia. La identidad visible (ícono + nombre para mostrar) se resuelve aparte vía `supabase/contextos.js` (`CTX_IDENTIDAD`/`ctxDisplay`), **sin** tocar el `nombre` almacenado.
3. **No crear ramas paralelas de archivos oficiales.** El Lector es `tabs/index.html` y punto.
4. **No modificar Supabase** (estructura, datos, tablas, RLS) sin autorización explícita.
5. **No modificar assets pedagógicos reales** (`METALÓFONO APP/MIDI/`, `tabs/TABS/`) sin confirmación.
6. **Conectividad intermitente (dirección posible, no arquitectura cerrada):** tolerar internet inestable en las escuelas es una preocupación válida del ecosistema. El patrón concreto para lograrlo (p. ej. IndexedDB local → sync a Supabase → campo `sincronizado`) **no** es una decisión universal cerrada para todo el ecosistema: se documenta como **HECHO** solo donde ya se aplicó (existió en la Bandeja de SRP —hoy congelado— y estaba previsto para Libro), y su definición/validación general queda **PENDIENTE**.
7. **Deep-linking:** respetar el protocolo del §3; no meter datos personales en la URL.
8. **Alias de display en espacios compactos:** cuando el nombre no cabe, usar alias corto (`KIDS CASTIGADAS`→`KIDS`) en vez de truncar; `title` siempre con el nombre completo.
9. **Antes de un cambio relevante:** consultar esta Fuente de Verdad (§ *Regla de uso*).

---

## 5. Estado del ecosistema (clasificación oficial F1.5)

**Leyenda técnica (F1):** 🟢 Activo · 🟡 Activo pero antiguo · 🔵 Congelado · 🟣 Oculto · 🟠 Legacy/en desuso · 🔴 Obsoleto/muerto · ⚪ Dudoso. **El estado técnico y el estado del Autor son planos distintos y conviven.**

Resumen por grupos (detalle completo en el Excel):

- **🟢 Núcleo activo (conservar):** Portal/Dashboard, Workspace PC, Repertorio, Entrenador, Ritmo, Lector, Pizarra, Libro, Bitácora/Memoria, Metalófono, `contextos.js`, config Supabase, CAJÓN (planificación), ADMIN (base del futuro panel de administración), `SHELL_MINIMO` (puente móvil provisional).
- **🔵 Conservar dormido (congelado — no desarrollar, no borrar):** SRP completo (concepto + backend, filas 6a-6e), visor de ANALIZADOR (logging sigue activo), LOOP-LAB, `import_2026` (respaldo histórico), PRESENTADOR PEDAGÓGICO (`.txt` de diseño, archivar), función **Lecciones**.
- **🟠 No continúa (retiro aprobado, se ejecuta en Fase 4):** `PC/index.html`, shell móvil antiguo (`MOVIL` histórico), FICHAS (`walk-secuencia`), legacy del Portal (dock, dashboard 8 días, popover, bloques modo Plan), experimentos de test (`supabase/test.html`, `ritmo-demo.html`, `vexflow-test.html`, comando `/elementos`), MIDIs de prueba (`METALÓFONO APP/MIDI/PRUEBAS/`). Rama `gh-pages` → retiro **condicionado** (ver §7).
- **⚪/diferido:** `modulos.js` (Fase 3); módulos futuros que no existen aún (§9).

> Regla de Fase 1.5–2: **nada se borra ni modifica todavía.** "Retiro aprobado" significa candidato a **Fase 4**, no acción inmediata.

---

## 6. Decisiones cerradas (no reabrir sin razón concreta)

Aprobadas por el Autor en Fase 1.5. Si surge motivo para reconsiderar una, **plantearla al Autor** — no cambiarla en silencio.

| # | Tema | Decisión |
|---|---|---|
| 1m | `contextos.js` | Activo; conservar; no candidato a limpieza. |
| 2b | `PC/index.html` | Retirar (reemplazado por el Workspace). |
| 2c/4f | Shell móvil antiguo | Retirar; el móvil se rehará **desde cero** conservando solo Bitácora. |
| 1l/2e/6 | **SRP** | **Congelar** (concepto + backend): preservar, **no desarrollar, no integrar, no borrar**. No forma parte del desarrollo actual; se conserva deliberadamente. Podría eventualmente servir de **base/referencia para una futura nueva interfaz móvil** — **no decidido**: retomarlo requiere una **nueva decisión explícita del Autor**. Es **distinto** de la UI móvil vieja, que sí se retira (el móvil se rehace desde cero). SRP **no** está retirado ni fuera de uso: está **congelado**. |
| 3a | ADMIN | Conservar como **base del futuro panel de administración** (escuelas/años/clases); su función de pendientes se absorbe en el Dashboard. |
| 3b | ANALIZADOR | Congelar el visor; mantener el logging (`eventos_uso`); reevaluar como métricas de producto en V1. |
| 3c | CAJÓN | Sumar a V1 como **motor de planificación con formatos por escuela** (plantillas); empezar por predefinidas. |
| 3d/3e | FICHAS / Presentador | FICHAS: eliminar. Presentador Pedagógico: **archivar** (es el prompt de diseño de la Pizarra). |
| 3f | Cuaderno MIDI | Desarrollar como **funcionalidad básica de V1**. |
| 4a-4d | Legacy del Portal | Limpieza aprobada en F4 (cuidar `?ctx`; por partes). |
| 5a/5d/5e, 5c | Experimentos y MIDIs de prueba | Retiro aprobado en F4 (sin tocar `ritmo.js` ni los MIDIs reales). |
| 5b | `import_2026` | Conservar como respaldo histórico. |
| 8 | Naturaleza | Clasificación de naturaleza completa en todo el inventario. |
| Supabase-1 | Esquema real | Exportar el esquema real de Supabase al repo (robustez pre-V1). |
| Supabase-2 | `alumno_repertorio` | Conservar como tabla **futura** (asignar repertorio a alumnos). |
| **#10** | Multi-año + multi-escuela | V1 soporta: (1) año lectivo como contexto temporal; (2) múltiples escuelas; (3) **identidad de contextos data-driven** en la tabla `contextos`, no hardcodeada. |
| **#11** | Estructura del proyecto | **Un solo sistema.** V1 = subconjunto curado y estable; lo personal/experimental convive **marcado** (Naturaleza + flags), no en un proyecto aparte. Separación dura solo al desplegar V1 a escuelas reales; el sistema personal podrá ser "una escuela/tenant más". |

---

## 7. Decisiones postergadas

Deliberadamente sin resolver (≠ rechazado, ≠ congelado, ≠ futuro):

- **`modulos.js` (1n/4g) → Fase 3:** decidir si se **promueve** a catálogo único del Workspace o se **retira**. Hasta entonces no se actualiza ni se borra.
- **Roadmap de módulos que no existen (3g–3l):** Flauta, Huiro, Cifrado, Chords, Games, Cajón-instrumento. Criterio (ligado a **#11**): **construir y probar primero**, decidir su entrada a V1 después.
- **SRP — congelado (no retirado):** se conserva deliberadamente; hoy **no** se desarrolla ni integra. Una eventual reutilización futura (p. ej. como base/referencia de una nueva interfaz móvil) **o** su retiro requieren una **nueva decisión explícita del Autor**. No confundir con la **UI móvil antigua**, que sí está en retiro.
- **Rama `gh-pages`:** retiro **condicionado** a verificar antes, en GitHub, que Pages publica desde `master`. **Verificación aún no hecha.**

---

## 8. V1 — alcance actual

No convertir posibilidades en compromisos. Estado a hoy:

- **Incluido (Sí):** Portal/Dashboard, Workspace, Repertorio, Entrenador, Ritmo, Lector, Pizarra, Libro, Bitácora/Memoria, Metalófono, `contextos.js`, config Supabase, **CAJÓN** (motor de planificación con formatos por escuela), **ADMIN** (panel de administración), **Cuaderno MIDI** (básico).
- **Posible:** `modulos.js`, ANALIZADOR (como métricas de producto), y los módulos de roadmap (Flauta, Huiro, Cifrado+Chords, Games, Cajón-instrumento).
- **Futuro:** LOOP-LAB, `alumno_repertorio`, Biblioteca Musical, editor de plantillas de planificación por escuela.
- **Excluido:** `PC/index.html`, shells antiguos, FICHAS, legacy del Portal, experimentos de test, MIDIs de prueba.
- **Pendiente:** SRP (**congelado**; retomar o retirar = decisión futura del Autor), `modulos.js` (F3).

**Direcciones transversales de V1 (DECISIÓN):**
- **#10 — multi-año + multi-escuela:** el sistema debe soportar que las instancias cambien por año y que existan varias escuelas, con la **identidad de contextos data-driven** (hoy `contextos.js` está hardcodeado a los 15 fijos). Impacta `seed.sql`, `?ctx`, matrícula por año y aislamiento de datos.
- **#11 — un solo sistema (producto vs taller):** V1 es la "tienda" estable; el sistema personal del Autor es el "taller" donde se experimenta. Misma base, marcado por Naturaleza.

**PENDIENTE — modelo comercial (SaaS):** Profe Apps **podría** eventualmente convertirse en un producto **SaaS** para escuelas; esa posibilidad queda **abierta como decisión futura de producto/comercial, todavía no tomada**. La arquitectura actual **no** es —ni se presenta como— una arquitectura SaaS ya definida. Si en el futuro se adoptara ese modelo, cobrarían relevancia aspectos como múltiples escuelas, aislamiento de datos, cuentas/usuarios, seguridad, conectividad intermitente en establecimientos, y persistencia/sincronización local — **ninguno** de ellos es una decisión técnica actual.

---

## 9. Roadmap / futuro (ideas identificadas, no comprometidas para V1)

- **Módulos musicales nuevos:** Flauta (digitaciones), **Huiro** y **Cajón-instrumento** (evoluciones del Entrenador de ritmos; Cajón más prioritario que Huiro), **Cifrado + Chords fusionados** (un solo módulo de acordes), Games.
- **Biblioteca Musical:** interfaz navegable sobre Supabase Storage (MIDIs, ejercicios, canciones).
- **Editor de plantillas de planificación por escuela** (nivel ambicioso de CAJÓN).
- **Asignación de repertorio a alumnos** (`alumno_repertorio`, ya con schema listo).
- **SRP** eventualmente retomable si la captura voz→pendientes entra al producto.
- **Preparación V1 (Fase 5):** onboarding, cuentas, seguridad, aislamiento de datos multi-escuela, recuperación, pagos/suscripciones, privacidad, robustez multi-dispositivo. No implementar sin autorización.

---

## 10. Elementos protegidos (no eliminar/reemplazar/modificar sin autorización explícita)

- **Assets reales:** `METALÓFONO APP/MIDI/` (MIDIs del profesor), `tabs/TABS/` (partituras MuseScore).
- **Motor de ritmo:** `ritmo.js` y `ritmo-render.js` (al retirar `ritmo-demo.html`, **no** tocarlos).
- **Archivo oficial del Lector:** `tabs/index.html`.
- **Supabase:** estructura, datos, tablas, RLS — no tocar sin autorización.
- **Congelados:** backend de SRP (6a-6e), LOOP-LAB, función Lecciones, visor de ANALIZADOR.
- **Respaldos e historia:** `import_2026`, `memorias` + bucket `memorias-audio`, el `.txt` de PRESENTADOR PEDAGÓGICO.
- **Decisiones cerradas (§6):** no reabrir en silencio.

---

## 11. Modelo de gobernanza

- **Autor / Product Owner (Pato):** autoridad final. **Decide** producto, alcance, arquitectura, roadmap, qué se conserva/congela/modifica/elimina.
- **ChatGPT:** arquitectura, análisis, investigación, coordinación, revisión; transforma objetivos del Autor en specs/prompts.
- **Claude:** inspección del repo, implementación, pruebas, custodia técnica y mantenimiento de esta Fuente de Verdad.

**Regla común:** los tres pueden proponer, opinar, detectar problemas, cuestionar y presentar alternativas. **Pero las decisiones finales corresponden exclusivamente al Autor. Una propuesta nunca se presenta como decisión.**

### Protocolo de revisión documental de ChatGPT — SOLO LECTURA

Cuando el Autor entrega a ChatGPT un documento del proyecto para revisión, ChatGPT lo trata como material de **solo lectura**: puede leerlo, analizarlo, auditarlo y **proponer** cambios, pero **no** altera silenciosamente su contenido ni presenta una modificación como si ya estuviera aplicada.

**Flujo normal:** Autor entrega documento → ChatGPT revisa → ChatGPT propone/instruye → **Autor decide** → Claude implementa/modifica → se revisa de nuevo si corresponde.

Una propuesta de ChatGPT **no** constituye una modificación ni una decisión.

---

## 12. HECHO / DECISIÓN / PROPUESTA / PENDIENTE

Cuando haga falta distinguirlos, usar explícitamente:
- **HECHO** — comprobable técnicamente.
- **DECISIÓN** — aprobado por el Autor.
- **PROPUESTA** — alternativa planteada por cualquiera.
- **PENDIENTE** — todavía no resuelto.

---

## Regla de uso (antes de implementar un cambio relevante)

1. Consultar esta Fuente de Verdad.
2. Identificar reglas y decisiones aplicables (§4, §6, §7, §10).
3. Inspeccionar el código afectado.
4. Comprobar dependencias.
5. Señalar cualquier conflicto **antes** de implementar.
6. Implementar **solo** el alcance autorizado.

Si la tarea contradice una decisión registrada, **no** resolver el conflicto por cuenta propia: plantearlo al Autor.

---

## Mantenimiento

Actualizar este documento cuando un trabajo modifique significativamente: arquitectura, contratos, comunicación entre sistemas, estado de un módulo, decisiones, alcance de V1, roadmap o reglas permanentes. **No** registrar cada pequeño cambio de código: es una fuente de verdad viva, no un diario de desarrollo.

---

## Infraestructura de referencia

**Supabase (compartida por todas las apps) — HECHO:** la configuración y las credenciales están en **`supabase/config.js`** (se incluye con `<script src="../supabase/config.js">` desde cualquier app). La anon key es pública (va en el frontend); la secret key nunca va al navegador. No exponer credenciales en la documentación.
Archivos en `supabase/`: `config.js` (credenciales), `schema.sql` (DDL base), `seed.sql` (15 contextos + horario), `contextos.js` (identidad visible), `libro_schema.sql`. **PENDIENTE (Supabase-1):** el esquema **real** (varias tablas con DDL no versionado, además de RLS/RPC/triggers) sólo vive en Supabase; exportarlo al repo.

**Tablas principales (HECHO):** `contextos`, `horario`, `sesiones`, `pendientes`, `plan_sesion_items`, `presentaciones`, `memorias`, `materiales_contexto` (activa; `pendientes_materiales` es legacy oculto), `repertorio_*`, `lecciones`/`leccion_items` (función congelada), `alumnos_taller`, `alumno_tabs`/`alumno_tab_secciones`, `tab_mensajes_alumno`, `lector_particulares`, `practica_log`, `eventos_uso` (logging activo), `libro_*` (14 tablas, `libro_schema.sql` versionado), `sesiones_srp` (registros históricos; SRP congelado —conservar datos—), `alumno_repertorio` (futura, sin uso aún). Detalle en el Excel, hoja SUPABASE.

**Los 15 contextos (HECHO — hoy fijos; DECISIÓN #10: pasarán a data-driven):**
ORIENTACIÓN·jefatura·Lun · TERCERO·curso·Lun · CUARTO·curso·Lun · CUERDAS·taller·Lun · ENLACE·jefatura·Mar · SEXTO·curso·Mar · RECREO·recreo·Mar · QUINTO·curso·Mar · PRIMERO·curso·Mié · SEGUNDO·curso·Jue · SEPTIMO·curso·Jue · KIDS CASTIGADAS·taller·Jue · OCTAVO·curso·Jue · CASTIGADAS·taller·Jue · GENERAL·virtual. Jefatura actual: 8° (cambia año a año). Alias compacto: `KIDS CASTIGADAS`→`KIDS`.

**Auth (HECHO):** PIN por oscuridad vía `sessionStorage`. Shells (Workspace/MOVIL) tienen auth gate; PIN = `new Date().getDate()` (día del mes) → `sessionStorage.profe_auth='1'`. Los módulos verifican ese flag. No existe tabla `usuarios`/`tokens_invitado` aún; invitados = futuro. *(Nota: el auth del Planner quedó temporalmente desactivado con `false &&` — pendiente reactivar; la seguridad unificada es trabajo de V1.)*

**Deployment (HECHO):** GitHub Pages desde `master` en `https://patolastra.github.io/profe-apps/` (repo `patolastra/profe-apps`). Cada push a `master` despliega. Rama `gh-pages` = legacy (retiro condicionado, §7). El backend Python de SRP sigue pospuesto.

---

## Relación con el inventario

`AUDITORIA/INVENTARIO_ECOSISTEMA.xlsx` es el **inventario detallado de auditoría** (hojas INVENTARIO, DECISIONES PENDIENTES, SUPABASE, CRITERIOS; ~53 elementos + 22 decisiones). **No** duplicar aquí todo su detalle:

> **CLAUDE.md** → verdad oficial resumida y normativa · **Excel** → detalle del inventario y auditoría.

**Documento histórico complementario:** `AUDITORIA/HISTORIA_HITOS.md` — historia conceptual del ecosistema (hitos M0–M12 + fases F0–F2). No es normativo; es contexto.
