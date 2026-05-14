# CLAUDE.md

## Idioma

Responde **siempre en español**, incluyendo:
- Respuestas y explicaciones
- Comentarios en el código
- Nombres de variables y funciones (español o inglés técnico según claridad)
- Mensajes de confirmación y preguntas
- Descripciones de cambios realizados

**Excepciones permitidas en inglés:** nombres técnicos estándar (`import`, `class`, `def`, `return`…), nombres de librerías y frameworks, mensajes de error del sistema cuando sean literales, términos técnicos sin traducción directa (`parsing`, `runtime`, `drift`…).

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Ecosistema PROFE — Contexto general

SRP es uno de los 5 módulos de un ecosistema pedagógico más amplio ubicado en `APPS BY ME/`:

```
APPS BY ME/
├── SRP/                    ← este repositorio (producción)
├── PRESENTADOR PEDAGÓGICO/ ← renderer de presentaciones offline
├── CUADERNO MIDI/          ← captura de ideas musicales
├── METALÓFONO APP/         ← herramienta pedagógica MIDI
├── LECTOR TABLATURAS/      ← lector de partituras
├── FLAUTA APP/             ← digitaciones interactivas
├── HUIRO APP/              ← práctica rítmica
├── CIFRADO AMERICANO/      ← cifrado de acordes
└── supabase/               ← config compartida de DB
```

Los otros módulos planificados (no iniciados): **Portal** (hub de planificación en PC) y **Libro de Clases** (evaluaciones con modo offline).

### Vocabulario clave

| Término | Qué es |
|---------|--------|
| **Bitácora** | Todo el mundo derecho: captura de voz/texto/foto/video, bandeja, procesamiento con Gemini, historial. Es el flujo de registro y parseo. |
| **Panel** | El Mundo Izquierdo: vista de lectura que muestra cursos del día, pendientes por categoría, materiales, nota de sesión. Acceso con swipe desde Captura. |

### Rol dual de SRP

SRP tiene DOS funciones igualmente centrales:

1. **Captura → IA → estructura:** el profesor graba/escribe desde el celular → Gemini parsea → información organizada por curso y categoría
2. **Visualización inteligente:** el Mundo Izquierdo (Panel) muestra registros procesados + planificaciones que llegan desde el Portal

### Flujo bidireccional SRP ↔ Portal (futuro)

- **SRP → Portal:** grabación → Gemini parsea → pendientes con sesión → aparecen en Portal Dashboard
- **Portal → SRP:** Portal planifica sesiones futuras → aparecen en el Panel mobile de SRP

### El eje temporal — principio organizador central

Todo se ancla a una **sesión** (contexto + fecha concreta). Los pendientes no pertenecen a un curso en abstracto, sino a una sesión específica. Pendiente sin sesión asignada → va a la próxima clase futura del curso por defecto.

### Los 15 contextos del sistema

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
| GENERAL | general | — (virtual) |

Jefatura actual: 8° básico. Semana laboral: lunes a jueves (4 días).

### Supabase (capa de persistencia — Fase 3 completa)

La base de datos ya existe y está conectada. Credenciales en `../supabase/config.js`.

Tablas relevantes para SRP:
- `contextos` — los 15 contextos (ya poblada)
- `horario` — estructura semanal L-M-M-J (ya poblada)
- `sesiones` — instancias concretas (contexto + fecha)
- `sesiones_srp` — registros procesados (reemplaza IndexedDB `historial`)
- `pendientes` — items parseados con `sesion_id`

**Antes de cualquier integración: leer `../supabase/schema.sql`** — contiene los campos exactos, tipos, constraints e índices de todas las tablas. No asumir estructura sin leerlo.

**Sesiones — se crean on-demand, no se pre-generan.** La tabla `sesiones` tiene `UNIQUE(contexto_id, fecha)`. Cuando se guarda un registro de un curso en una fecha, se crea (o encuentra) la sesión correspondiente. No hay generación automática desde el horario.

**RLS habilitado pero permisivo** — todas las tablas tienen `USING (true) WITH CHECK (true)`. Cualquiera con la anon key puede leer y escribir. Esto es intencional mientras no haya auth. **No endurecer las políticas RLS hasta que exista un sistema de auth real** — hacerlo antes rompe el acceso de la app.

**Decisión de diseño — audio blobs:** se descartan después de transcribir. El audio cumple su función al generar el texto; no se guarda en Supabase Storage ni en el historial. Solo el texto transcrito y el JSON parseado van a Supabase. Las fotos y videos sí se conservan (ya se guardan como blob en `historial`).

**Próximo paso de integración:** reemplazar IndexedDB en `mobile_ui/index.html` por Supabase. Las grabaciones en bandeja se mantienen local (offline-first), se sincronizan al guardar.

### La app mobile (producción)

La UI activa es `mobile_ui/index.html` — una PWA HTML/JS puro con 4 pantallas principales (Captura, Bandeja, Procesamiento, Historial) y el Mundo Izquierdo (panel de lectura). **No es un placeholder** — tiene múltiples overlays y funciones implementadas. El stack es HTML/JS vanilla, sin frameworks, sin build tools.

**Arquitectura single-file:** todo el HTML, CSS y JS (~3200 líneas) vive en un solo archivo. Esto es intencional — permite abrir directamente en el navegador sin build tools. No separar en archivos, no agregar bundler.

### Sub-secciones dentro de SRP (NO módulos independientes)

Estas funciones viven dentro de SRP. No son apps separadas:

| Sub-sección | Descripción | Acceso |
|-------------|-------------|--------|
| **Repertorio** | 4 estados: posible / en_curso / visto / aprender | Drawer |
| **Captura de ideas** | URL/imagen/texto/voz; estados: nueva/revisada/implementada/descartada; etiquetable a contextos | Drawer |
| **Bienestar** | Cuotas de 20-40 funcionarios, pagos, balance mensual | Drawer |
| **Jefatura** | Apoderados, reuniones, actas (actualmente 8° básico, reasignable) | Drawer |
| **Administrativos / Casa / Mensajes / Apps** | Vistas globales de cada categoría SRP | Drawer |
| **Planificaciones** | Sesiones futuras creadas en el Portal que fluyen al Panel | Drawer |

### Estructura de navegación de la app mobile (`mobile_ui/index.html`)

**Bitácora — 4 pantallas con swipe vertical:**
1. **Captura** — graba audio, texto, foto, video. Swipe izquierdo → Panel
2. **Bandeja** — lista de grabaciones del día agrupadas por fecha. Swipe horizontal: borrar o regrabar
3. **Procesamiento / Resultados** — envía bandeja a Gemini, muestra items parseados. Permite editar, cambiar categoría, marcar OK, deshacer, guardar
4. **Historial** — registros SRP guardados, navegables por fecha y curso

**Panel (Mundo Izquierdo) — 3 vistas:**
- Vista de día: cursos del día seleccionado (navegación semanal ‹ ›)
- Vista de curso: pendientes por categoría + materiales (pull-down) + nota de sesión editable
- Vista lista genérica: categorías globales o historial de curso

**Drawer (menú ···):** accesos directos a Cursos, Planificaciones, Repertorio, Mensajes, Jefatura, Administrativos, Casa, Apps.

**Overlays implementados:** configuración API key Gemini, backup Google Drive, exportar expected output, foto/video con etiquetado de curso, category picker, modo selección múltiple, lightbox, source audio.

### Almacenamiento actual (antes de Supabase)

**IndexedDB** — base de datos: `SRP_VozDB` (versión 3), 3 stores:

| Store | Contenido |
|-------|-----------|
| `grabaciones` | Items de Bandeja: audio (blob), texto, foto, video. Campos: `{id, blob, timestamp, timeStr, dateGroup, type, textContent, enProceso}` |
| `historial` | Registros procesados y guardados: `{id, timestamp, data, media}`. Las fotos se guardan como blob aquí. → Migrar a tabla `sesiones_srp` en Supabase |
| `expected_outputs` | Fixtures generados desde la app: `{id, timestamp, fixture_name, json, raw_fixtures}` |

**localStorage** solo guarda: `gemini_api_key`, `drive_endpoint_url`, `srp_pending_results` (estado temporal entre pantallas).

**Plan de migración a Supabase:**
- `grabaciones` → mantener local (offline-first), sincronizar al guardar
- `historial` → tabla `sesiones_srp`
- Pendientes parseados → tabla `pendientes` con `sesion_id`

### IA de parseo

**Gemini** (Google). No migrar a Claude ni OpenAI hasta que el sistema esté completamente estabilizado.

**Dos pasos en la app mobile:**
1. `geminiTranscribe(base64, mimeType, apiKey)` — envía el audio como `inline_data` en base64 → Gemini devuelve texto transcrito
2. `geminiParseText(transcripcion, apiKey)` — envía el texto → Gemini devuelve JSON parseado según el schema

**Modelos usados (en cascada, si uno falla intenta el siguiente):**
```
gemini-2.0-flash-lite → gemini-2.5-flash → gemini-flash-lite-latest → gemini-2.0-flash
```

**El Python executor solo hace el paso 2** — recibe texto, no audio. La transcripción existe únicamente en la app mobile.

---

## What This Project Is

**SRP (Sistema de Revisión Pedagógica)** es una herramienta personal para un profesor de música que hace clases en muchos cursos una vez por semana. La complejidad logística y el volumen de información hacen imposible el seguimiento manual. El profesor narra su experiencia en notas de voz (fluir de conciencia), y el sistema extrae, organiza y hace accesible esa información de forma oportuna y ordenada.

**Flujo completo:**
1. El profesor graba una nota de voz (o ingresa texto, imagen o video) desde su celular
2. El audio se transcribe automáticamente
3. La transcripción se parsea según specs y se organiza por curso y categoría
4. El profesor puede corregir los parseos directamente en la app (generando así expected outputs reales y certeros)
5. La app muestra la información organizada cuando se necesita

**Categorías de clasificación (10 oficiales):** `revision`, `pendientes_sala`, `pendientes_planificacion`, `pendientes_materiales`, `pendientes_casa`, `pendientes_administrativos`, `pendientes_mensajes`, `pendientes_jefatura`, `pendientes_apps`, `posible_repertorio` — con distintas políticas de persistencia según su naturaleza operacional.

The architecture is **specification-first**: frozen markdown documents in `freeze/` are the canonical authority. All code must obey them without reinterpretation.

---

## Running the System

**IMPORTANTE — dos sistemas separados, no conectados:**

| Sistema | Qué es | Estado |
|---------|--------|--------|
| `mobile_ui/index.html` | La app de producción. Llama a Gemini directo desde JS en el navegador. | En uso |
| `executor/runtime_executor_v1.py` | Herramienta CLI para desarrollo y validación del parser. Base del futuro FastAPI (Fase 2). | No conectado a la UI |

El executor Python **no es el backend de la app mobile**. Son tracks paralelos. No modificar el executor asumiendo que afecta la app.

**Para correr el executor Python:**

```python
from executor.runtime_executor_v1 import RuntimeExecutor
from executor.runtime_client_v1 import RuntimeClientFactory

client = RuntimeClientFactory.create(provider="gemini", model="gemini-2.0-flash")
executor = RuntimeExecutor(client=client)
result = executor.run(raw_input="...", fixture_name="fixture_001")
```

Requiere la API key de Gemini en el entorno. **Execution traces** se escriben en `./execution_traces/` como JSON (auto-generados, no commiteados).

---

## Testing

There is no pytest or unittest setup. Tests are behavioral and fixture-based:

- `fixtures/` — 13 real Spanish-language transcriptions (`.txt`)
- `expected_outputs/` — Ground-truth JSON for each fixture
- `freeze/v1/TEST_MATRIX_v1.md` — 80+ assertion checklist (the test spec)
- `behavior_tests/PARSER_BEHAVIOR_TESTS_v1.md` — Behavioral scenarios (draft)

To validate a run, compare actual output JSON against the corresponding file in `expected_outputs/` and check against the contract in `freeze/PARSER_OUTPUT_CONTRACT_v1_FREEZE.md`.

---

## Architecture

```
mobile_ui/         ← App mobile activa (PWA HTML/JS). LA UI DE PRODUCCIÓN. Archivo: index.html
executor/          ← Orchestration: invoca Gemini, extrae JSON, valida, persiste traces
runtime/           ← Spec de comportamiento del parser en runtime
parser_specs/      ← Reglas semánticas de parsing
contracts/         ← Garantías de output exigibles por código
schemas/           ← VACÍA. El schema activo (v3) vive en freeze/v1/SRP_SCHEMA_v3.json
freeze/            ← AUTORIDAD CANÓNICA — specs congeladas, solo lectura
prompts/           ← Prompts ON_*.txt entregados por el executor a Gemini
fixtures/          ← Transcripciones reales de clases (español)
expected_outputs/  ← JSON ground-truth por fixture (activo más valioso del proyecto)
execution_traces/  ← Logs de runtime (auto-generados, no commiteados)
behavior_tests/    ← Escenarios de comportamiento del parser
storage/           ← VACÍA. Prevista para blobs locales antes de sync a Supabase
renderer/          ← VACÍA. Prevista para motor de Presentaciones cuando ese módulo llegue a SRP
```

**Layer responsibilities** (strict separation):

| Layer | Does | Does NOT do |
|---|---|---|
| `RuntimeClient` | Delivers prompt + raw input, retrieves raw text | Interpret, validate, repair |
| `RuntimeExecutor` | Extract JSON, validate contract, log drift, retry once | Semantic reasoning, continuity invention |
| Parser (LLM) | Segment, classify, infer continuity conservatively | Fabricate, over-infer, cross-contaminate courses |

---

## Frozen Artifacts — The Immutable Authority

Files inside `freeze/` (specifically `freeze/v1/`) are **read-only canonical specifications**. Code must never override, reinterpret, or silently deviate from them. **Antes de proponer cambios estructurales, leer estos archivos.**

Archivos congelados clave:
- `freeze/v1/PARSER_v1_SPEC_FREEZE.md` — Reglas completas de parsing
- `freeze/v1/PARSER_OUTPUT_CONTRACT_v1_FREEZE.md` — Estructura de output requerida
- `freeze/v1/PARSER_BEHAVIOR_TESTS_v1_FREEZE.md` — Expectativas de comportamiento
- `freeze/v1/SRP_SCHEMA_v3.json` — Schema JSON canónico (v3 es el activo)
- `freeze/v1/TEST_MATRIX_v1.md` — Checklist de validación (80+ assertions)
- `freeze/v1/CANONICAL_PARSE_EXAMPLES_v1.md` — Ejemplos canónicos de parsing

When a frozen spec and runtime code conflict, the spec wins — change the code.

---

## Output Schema (v3)

Every parser output must include these root fields:
```json
{
  "schema_version": "SRP_SCHEMA_v3",
  "fixture_name": "...",
  "courses": [...],
  "warnings": [...],
  "parser_confidence": 0.0–1.0
}
```

---

## Category System

### Categorías operacionales (10 oficiales)

| Key | Definición precisa |
|---|---|
| `revision` | Capa histórico-descriptiva. Preserva lo que ocurrió durante la ejecución pedagógica: actividades, observaciones, comportamientos, ideas tentativas, matices contextuales, referencias históricas, resultados operacionales y ambigüedad no resuelta. **No transforma reflexiones tentativas en acciones, no genera continuidad automática, no convierte interpretación en hecho.** |
| `pendientes_sala` | Acciones operacionales ejecutables exclusivamente durante la clase en vivo (cantar de nuevo, reorganizar grupos, probar dinámicas, reforzar rutinas, avanzar pedagógicamente). **Excluye planificación, logística, mensajería o reflexión abstracta.** |
| `pendientes_planificacion` | Trabajo de diseño pedagógico, estructural o de recursos fuera de la ejecución en vivo (crear PPT, diseñar estrategias, secuenciar, tomar decisiones metodológicas, arquitectura de evaluación). **Excluye logística física o acciones directas de aula.** |
| `pendientes_materiales` | Tareas físicas/logísticas de transporte o preparación material para ejecutar clases (llevar instrumentos, imprimir guías, mover equipos, instalar hardware). **El movimiento es siempre entre espacios del establecimiento escolar — excluye transporte entre casa y escuela. Excluye diseño pedagógico o comunicación.** |
| `pendientes_casa` | Tareas operacionales que ocurren fuera del contexto institucional inmediato, generalmente vinculando flujos de preparación hogar/trabajo. |
| `pendientes_administrativos` | Procedimientos institucionales formales, documentación o coordinación oficial. **Excluye observaciones pedagógicas simples o notas informales.** |
| `pendientes_mensajes` | Actos de comunicación pendientes que requieren estructura contextual destinatario/mensaje/plazo. El plazo puede ser implícito: si no se enuncia, se infiere por defecto como "un día antes del próximo evento relevante con esa persona" (ej: si el destinatario es un estudiante, un día antes de la próxima clase con ese curso). **Convive con otras categorías** (`pendientes_jefatura`, `pendientes_administrativos`, `pendientes_planificacion`, etc.) — un ítem puede generar un pendiente de acción Y un mensaje asociado como ítems separados. **No muta en operaciones administrativas o pedagógicas más amplias.** |
| `pendientes_jefatura` | Tareas de coordinación o seguimiento vinculadas específicamente a responsabilidades de jefatura de curso, no a ejecución pedagógica musical. |
| `pendientes_apps` | Ideas, desarrollos o posibilidades técnicas futuras de software/sistemas/aplicaciones, incluyendo conceptos exploratorios o no inmediatos. **No se convierten automáticamente en tareas operacionales ejecutables.** |
| `posible_repertorio` | Almacena referencias de repertorio futuro candidato sin promoverlas a repertorio confirmado ni a acciones obligatorias. |

### Constructos especiales

| Constructo | Definición precisa |
|---|---|
| `LETRA` | Contenido textual de canciones como material de referencia pedagógica o histórica, no como directiva operacional. |
| `CONTRADICCIÓN_DETECTADA` | Incompatibilidad semántica explícita entre hechos afirmados. **No se activa por ambigüedad o incertidumbre sola.** |
| `CONFUSIÓN_SEMÁNTICA` | Indeterminación semántica no resuelta causada por lenguaje ambiguo, incompleto o estructuralmente incierto, sin implicar necesariamente contradicción. |
| `CONTINUIDAD` | Solo existe cuando evidencia explícita sostiene persistencia longitudinal legítima entre ejecuciones/clases. **Nunca se alucina ni infla automáticamente.** |
| `HISTORIAL_PEDAGÓGICO` | Referencias de trayectoria pedagógicamente útiles (canciones usadas, estrategias intentadas, evolución observada) sin implicar continuidad futura automática ni acción obligatoria. |
| `DRIFT` | Desviación semántica, estructural, contractual o de continuidad donde el sistema muta, infla, redistribuye o fabrica significado operacional más allá de los límites evidenciales de la narración original. |

### Políticas de persistencia

- `pendientes_sala` y `pendientes_materiales`: requieren señal de continuidad explícita o fuertemente implicada.
- `pendientes_planificacion` y `posible_repertorio`: permiten persistencia futura con intención pedagógica explícita y continuidad plausible.
- `pendientes_apps`: tolera ideas exploratorias de largo plazo y especulación operacional no inmediata.
- `revision`: preserva memoria contextual pedagógica sin requerir continuidad operacional futura.

---

## Principios de trabajo

1. **Cambios incrementales** — No refactorizar todo de una vez. Hacer cambios pequeños y verificables.

2. **Validación contra expected outputs** — Usar los archivos en `/expected_outputs/` como criterio de verdad. Cada cambio debe validarse contra ellos.

3. **Preservar compatibilidad freeze** — Cualquier modificación debe mantener compatibilidad con los documentos freeze.

4. **No tomar decisiones semánticas** — Si hay ambigüedad sobre clasificación de categorías o asignación de cursos, marcar como ambiguo para revisión manual. No decidir por el usuario.

5. **Backups antes de cambios críticos** — Antes de modificar archivos críticos (`runtime_executor_*.py`, schemas, contracts), crear backup con timestamp.

6. **Validación explícita post-cambio** — Después de cada cambio, verificar que:
   - El output sigue siendo compatible con `PARSER_OUTPUT_CONTRACT_v1_FREEZE.md`
   - Los campos requeridos están presentes
   - La estructura JSON es válida

---

## Self-Verification Loop (OBLIGATORIO — NO NEGOCIABLE)

### Cuándo ejecutar verificación

Después de CADA uno de estos eventos:
- Modificar cualquier archivo en `/executor/`
- Modificar cualquier archivo en `/mobile_ui/`
- Modificar cualquier schema o contrato (freeze o no-freeze)
- Crear o modificar expected outputs
- Agregar nueva funcionalidad
- Corregir un bug
- Antes de declarar una tarea como "completada"

### Proceso de verificación (AUTOMÁTICO)

1. **Leer** `VERIFICATION_CHECKLIST.md` completo
2. **Ejecutar** todos los tests de las secciones "Functional Tests" y "Execution Tests"
3. **Verificar** cada checkbox de cada sección
4. **Reportar** el resultado AL USUARIO en el formato especificado
5. **Si algo falla:** corregir, volver a verificar, y solo entonces continuar

### Formato del reporte (OBLIGATORIO)

```
🔍 VERIFICACIÓN COMPLETADA — [timestamp]

Secciones verificadas: X/10
Checks pasados: X/Y

❌ FALLOS DETECTADOS: (si los hay)
  [lista de fallos]

✅ CORRECCIONES APLICADAS: (si corresponde)
  [lista de correcciones]

🔄 RE-VERIFICACIÓN: (si hubo correcciones)
  Checks pasados: X/Y ✅

Estado: [LISTO PARA CONTINUAR | REQUIERE ATENCIÓN | BLOQUEADO]
```

### Reglas críticas de verificación

**REGLA 1:** Si cualquier check falla, NO continúes con el siguiente cambio. Primero corrige el fallo, vuelve a verificar, y solo entonces procede.

**REGLA 2:** No pidas permiso al usuario para verificar. La verificación es automática y obligatoria.

**REGLA 3:** Si un check falla 3 veces consecutivas después de intentar corregirlo, DETENTE y pregúntale al usuario cómo proceder.

**REGLA 4:** Los archivos en `/freeze/v1/` NUNCA deben modificarse. Si un check indica que algo en freeze debe cambiar, el problema está en otro archivo (executor, schema no-freeze, expected output), NO en freeze.

**REGLA 5:** Si detectas un bug durante la verificación, corrígelo ANTES de reportar "verificación completada".

### Excepciones (las ÚNICAS)

La verificación se puede OMITIR solo si el usuario dice explícitamente:
- "Skip verification"
- "Sin verificar"
- "Omite la verificación esta vez"

---

## Estado actual del código

Notas técnicas sobre el estado real del sistema (actualizar a medida que se corrijan):

- **Bug arquitectural — eje temporal:** los pendientes actualmente no tienen `sesion_id` real. Aparecen en todas las vistas de un curso sin distinción temporal (bug conocido). Se resuelve con la integración a Supabase — no intentar parcharlo en IndexedDB.
- **`ContractValidator`** — No valida el contrato real. Necesita reescritura completa.
- **`DriftClassifier`** — Mayormente vacío. Solo detecta `structural_drift`. Sin detección semántica real.
- **Expected outputs** — Son el activo más confiable del proyecto. Fuente de verdad principal.
- **Comportamiento de medios al guardar (línea ~3283)** — Al guardar, se eliminan TODOS los photos/videos de `grabaciones` (no solo los del lote procesado). Es intencional: se guardan en `historial` vía `mediaSnapshot` antes de ese paso. No modificar sin entender el flujo completo.
- **Sin auth actualmente** — `mobile_ui/index.html` es accesible a cualquiera con la URL. La API key de Gemini la ingresa el usuario manualmente y se guarda en `localStorage` del dispositivo. No construir nada que asuma autenticación.
- **Google Drive backup** — Overlay implementado en la Bitácora. Usa una URL de Google Apps Script (web app desplegado por el profesor) guardada en `localStorage` (`drive_endpoint_url`). Sube el JSON del historial automáticamente al guardar. No eliminarlo ni modificarlo sin entender el flujo completo.

### Workflow de refinamiento del modelo

El ciclo de mejora de la IA funciona así:
1. El profesor graba en la Bitácora
2. Gemini parsea y muestra resultados en la pantalla de Procesamiento
3. El profesor edita los resultados directamente en la app (corrige categorías, textos, asignaciones de curso)
4. Exporta el parseo corregido como expected output (overlay "Exportar como expected output")
5. Ese par (transcripción original + parseo corregido) se agrega a `fixtures/` + `expected_outputs/`
6. Estos pares son la fuente de verdad para validar el parser

Los `expected_outputs/` son tan valiosos precisamente porque representan correcciones reales del profesor sobre outputs reales de Gemini — no datos sintéticos.

---

## Core Invariants

These are non-negotiable across all changes:

- **No silent normalization.** Any deviation from the input must be logged as a warning or drift event.
- **No cross-course contamination.** Course contexts are strictly isolated — never merge or redistribute across courses.
- **Conservative inference only.** Only infer continuity where context makes it unambiguous. Prefer incomplete-safe output over hallucinated continuity.
- **Max 1 retry.** The executor retries a failed parse exactly once, then records the failure.
- **Contract validation is mandatory.** Every output must pass `PARSER_OUTPUT_CONTRACT_v1_FREEZE.md` before being returned or persisted.

---

## Domain Context

Input is oral teacher narration transcribed from Spanish-language music classes (K–8). Expect: fragmented sentences, multicourse interleaving (e.g. "SEGUNDO", "OCTAVO"), ambiguous pronouns, imperfect transcription, and code-switching. Courses are referenced by grade level in Spanish (e.g. "cuarto básico", "segundo medio").
