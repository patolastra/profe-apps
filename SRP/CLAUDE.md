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

No build system, no package install, no CLI entrypoint yet. The main orchestration code lives in `executor/runtime_executor_v1.py`. To invoke it directly from Python:

```python
from executor.runtime_executor_v1 import RuntimeExecutor
from executor.runtime_client_v1 import RuntimeClientFactory

client = RuntimeClientFactory.create(provider="openai", model="gpt-4o")
executor = RuntimeExecutor(client=client)
result = executor.run(raw_input="...", fixture_name="fixture_001")
```

Requires the `openai` package (`pip install openai`) and `OPENAI_API_KEY` set in the environment. The import is optional — the system will raise clearly if OpenAI is unavailable.

**Execution traces** are written automatically to `./execution_traces/` as JSON files for every run.

---

## Testing

There is no pytest or unittest setup. Tests are behavioral and fixture-based:

- `fixtures/` — 13 real Spanish-language transcriptions (`.txt`)
- `expected_outputs/` — Ground-truth JSON for each fixture
- `freeze/TEST_MATRIX_v1.md` — 80+ assertion checklist (the test spec)
- `behavior_tests/PARSER_BEHAVIOR_TESTS_v1.md` — Behavioral scenarios (draft)

To validate a run, compare actual output JSON against the corresponding file in `expected_outputs/` and check against the contract in `freeze/PARSER_OUTPUT_CONTRACT_v1_FREEZE.md`.

---

## Architecture

```
executor/          ← Orchestration: invokes LLM, extracts JSON, validates, persists traces
runtime/           ← Parser runtime behavior spec (PARSER_RUNTIME_v1.md)
parser_specs/      ← Semantic parsing rules (PARSER_v1_SPEC.md)
contracts/         ← Machine-enforceable output guarantees
schemas/           ← SRP_SCHEMA_v1/v2/v3.json (v3 is active)
freeze/            ← CANONICAL AUTHORITY — frozen, read-only specifications
prompts/           ← LLM instruction prompts delivered by the executor
fixtures/          ← Real-world test inputs (Spanish)
expected_outputs/  ← Ground-truth JSON for each fixture
execution_traces/  ← Runtime logs (auto-generated, not committed)
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

## Estado actual del código

Notas técnicas sobre el estado real del sistema (actualizar a medida que se corrijan):

- **`ContractValidator`** — No valida el contrato real. Necesita reescritura completa.
- **`DriftClassifier`** — Mayormente vacío. Solo detecta `structural_drift`. Sin detección semántica real.
- **`runtime_executor_v2.py`** — Tiene un syntax error conocido en línea 351.
- **Expected outputs** — Son el activo más confiable del proyecto. Fuente de verdad principal.

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
