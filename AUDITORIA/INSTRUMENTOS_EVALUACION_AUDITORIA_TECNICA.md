# Instrumentos de Evaluación — Auditoría técnica y propuesta de implementación

> **Qué es este documento.** Auditoría técnica del código y esquema **actuales** de
> EVALUACIÓN (Libro de Clases) contra la especificación funcional cerrada por Producto
> (`AUDITORIA/INSTRUMENTOS_EVALUACION_SPEC.md`), más una **propuesta de implementación**
> por etapas. **No es normativo. No decide producto. No autoriza implementación.**
> Fuente funcional obligatoria: la spec (§A). Trazabilidad: la ficha en
> `AUDITORIA/DESARROLLO_PARALELO.md`.
>
> **Estado (2026-09-20):** entregable de la etapa *Auditoría técnica + propuesta*.
> **Nada implementado.** Donde una elección técnica afecta al producto, se presentan
> **opciones** (no se elige): requieren decisión del PO. Referencias a la spec como
> "§A#" y a los puntos de atención pedidos.

---

## 0. Decisiones del Product Owner (2026-09-20)

Las seis opciones abiertas de §6 fueron **resueltas por el PO**. Esta sección es la
resolución vigente; el resto del documento debe leerse a la luz de estas decisiones.

| # | Tema | Decisión del PO | Efecto |
|---|---|---|---|
| 1 | Objetivos (§4.3) | **Opción A** | Se mantiene `oa_original` en la cabecera y las adecuaciones como filas; se **agrega `instrumento_id`** al OA original (en `libro_evaluaciones`) y a cada adecuación (en `libro_evaluacion_adecuaciones`). Sin migración de objetivos. |
| 2 | Instrumento por estudiante (§4.4) | **Opción 4a** | Columna `instrumento_id` (override individual) en `libro_evaluacion_notas`; NULL = hereda del OA/adecuación. Permite "mismo objetivo, otro instrumento". |
| 3 | Nota y estados (§4.5) | **Persistir (5a) + estados enum (5c)** | La `nota` calculada **se persiste** y **se recalcula al cambiar el piso**. Estado por estudiante: **Pendiente / Evaluado / No aplica**. Instrumento incompleto → **Pendiente, sin nota definitiva**. |
| 4 | Ingreso posterior (§4.6) | **Opción 6b + autoriza modificar I13** | Mientras la evaluación esté **abierta**, los estudiantes matriculados después **aparecen automáticamente**; el profesor decide evaluarlos o marcarlos **No aplica**. Una evaluación **cerrada NO** incorpora nuevos; al **reabrir**, vuelven a estar disponibles los matriculados tras el cierre. Ver §0.1. |
| 5 | Cierre (§4.7) | **Opción 7b** | Bloqueo de cierre en **UI + BD (trigger)**. No se puede cerrar mientras existan estudiantes que **deban** ser evaluados y estén **pendientes**. |
| 6 | PDF (§4.8) | **Opción 8a** | Impresión del navegador / **CSS** (`@media print`, `@page size: letter`) + "Guardar como PDF". **No** se incorpora jsPDF ni ninguna biblioteca externa. |

### 0.1 Modificación autorizada de la invariante I13 (snapshot)

**El PO autoriza expresamente modificar I13.** Alcance del nuevo comportamiento:
- La población **deja de ser un snapshot estrictamente inmutable** mientras la
  evaluación está **abierta**: se **reconcilia con las matrículas activas vigentes** del
  curso/año, de modo que un estudiante **matriculado después** de crear la evaluación
  **aparece automáticamente** (con estado inicial **Pendiente**), sin acción manual.
- Al **cerrar**, la población **queda congelada**: una evaluación cerrada **no**
  incorpora nuevos matriculados.
- Al **reabrir**, vuelve a reconciliarse: los matriculados posteriores al cierre
  **vuelven a estar disponibles**.
- **Retiro (coherente con §A9):** un estudiante retirado antes de ser evaluado conserva
  su registro histórico, no recibe nota y **no bloquea el cierre**; si ya fue evaluado,
  su evaluación permanece.
- **Consecuencia documental:** al implementar, deberán actualizarse la invariante I13 en
  `supabase/libro_schema.sql` y su descripción en `CLAUDE.md` (hoy descrita como
  sin re-sincronización). **No se toca ahora** (esta etapa no implementa).

### 0.2 Identidad y encabezado institucional del PDF (cerrado por el PO, 2026-09-20)

**Datos institucionales (para hardcodear ahora; personalizable en V1.0):**
- **Escuela:** *Escuela Juana de Lestonnac*
- **Sostenedor:** *Servicio Local de Educación Pública Los Parques*
- **Logos:** serán **adjuntados directamente a Claude** (aún no recibidos al cerrar esta
  etapa; ver "Puntos abiertos").

**Requisito visual (no es "poner logos"):** el archivo de referencia entregado por el PO
—versionado en el repo como **`AUDITORIA/assets/ENCABEZADO PDF.pdf`**— es la
**referencia visual exacta** del encabezado institucional que deben usar los documentos
generados, respetando:
- ubicación de los nombres de la escuela y del sostenedor;
- ubicación y disposición de los logos;
- proporciones y organización general del encabezado.

**El encabezado debe aparecer en TODAS las páginas** de los PDF generados (ambos
informes, §A13). Con la Opción 8a (impresión/CSS), esto implica implementarlo como
encabezado repetido por página (p. ej. `position: fixed` en `@media print` o `thead`
que se repite), a validar contra la referencia.

*Nota del material de referencia:* `AUDITORIA/assets/ENCABEZADO PDF.pdf` incluye además
**versiones grandes de los logos** solo como material de referencia / fuente disponible
para Claude si se necesitara alguna; **no** deben incorporarse al cuerpo del PDF.

### 0.3 Criterio de bloqueo de cierre (aprobado por el PO, 2026-09-20)

Un estudiante **bloquea el cierre** si y solo si se cumplen las tres condiciones:
- está **actualmente matriculado** (matrícula activa vigente);
- **no** está marcado como **No aplica**;
- y su **instrumento está incompleto**.

**No bloquean:** un estudiante **retirado** antes del cierre; un estudiante marcado
**No aplica**. (Definición operativa que usa el guard 7b, UI + BD.)

### 0.4 Estado de decisiones

**No quedan decisiones de Producto pendientes** en la etapa de auditoría. Lo que resta
antes de implementar son **gates de autorización/insumos** (ver "Puntos abiertos"), no
decisiones de producto.

---

## 1. Estado actual relevante

**Arquitectura.** Todo el Libro es un **único archivo vanilla** `LIBRO/index.html`
(2.805 líneas, HTML+CSS+JS) que carga `supabase/config.js` y la identidad de contextos;
**sin build, sin frameworks, sin npm** (regla `CLAUDE.md` §4.1). **No hay ningún motor
PDF** cargado (verificado: sin jsPDF/print/@media print). **No existe entidad de escuela
/ sostenedor / logo** en el esquema (la identidad institucional para el PDF hoy no tiene
dónde vivir).

**Persistencia de EVALUACIÓN (F4 del Libro).** Cuatro tablas en `supabase/libro_schema.sql`:
- `libro_evaluaciones` — cabecera: `anio_id`, `contexto_id` (curso), `sesion_creacion_id`,
  `nombre`, `fecha`, **`oa_original` (TEXT único)**, `estado` ('abierto'|'cerrado').
- `libro_evaluacion_adecuaciones` — 0..N variantes de OA (solo `texto`), hijas de la eval.
- `libro_evaluacion_notas` — **detalle por estudiante** (el *snapshot*): `nota`
  NUMERIC(2,1) [1.0–7.0], `comentario`, `adecuacion_id` (NULL=OA original), `grupo_id`,
  `nota_excepcion`, `objetivo_excepcion`. `UNIQUE(evaluacion_id, estudiante_id)`.
- `libro_evaluacion_grupos` — grupos: `nombre`, `nota_grupal`, `adecuacion_grupal_id`,
  `terminado`.

**Comportamientos vigentes clave (auditados 2026-09-20):**
- **Nota manual.** Se escribe a mano; `normalizarNota()`/`fmtNota()` ([LIBRO/index.html:457](LIBRO/index.html:457)) validan 1,0–7,0. **No hay puntaje, ni conversión, ni piso.**
- **Snapshot inmutable (invariante I13).** `crearEvaluacion()` ([LIBRO/index.html:581](LIBRO/index.html:581)) materializa una fila por estudiante **activo** en la fecha; **nunca se re-sincroniza** ([libro_schema.sql:142](supabase/libro_schema.sql:142)). El detalle se dibuja **solo** desde ese snapshot ([LIBRO/index.html:741](LIBRO/index.html:741)), sin re-mirar el estado de matrícula.
- **Cierre incondicional.** `cerrarEval()` ([LIBRO/index.html:1251](LIBRO/index.html:1251)) cierra sin comprobar pendientes. "Pendiente" es puramente visual: `nota == null` ([LIBRO/index.html:798](LIBRO/index.html:798)).
- **Congelado por cierre (I12).** Triggers congelan cabecera/notas/adecuaciones/grupos cuando `estado='cerrado'`; reapertura reversible. Grupo `terminado` congela aparte.
- **Grupos + excepciones.** El valor **efectivo** por estudiante se guarda en su fila; el grupo da defaults y los flags `*_excepcion` marcan quién no hereda ([LIBRO/index.html:1136-1216](LIBRO/index.html:1136)).

---

## 2. Matriz Especificación → código actual → brecha → cambio requerido

| # spec | Requisito de Producto | Hoy en el código | Brecha | Cambio requerido |
|---|---|---|---|---|
| A1 | Conversión puntaje→nota, lineal mín→piso / máx→7,0 | No existe (nota manual) | **Total** | Motor de cálculo + puntaje mín/máx por instrumento aplicado |
| A1 | Piso configurable por evaluación (2,0–6,9; def 2,0) | No existe | **Total** | Columna `nota_min` en `libro_evaluaciones` + validación |
| A1 | Redondeo a 1 decimal (regla 5→sube) | `Math.round(x*10)/10` (redondeo estándar) | Parcial | Función de redondeo explícita (coincide con la regla, formalizar) |
| A2 | Rúbrica: criterios × 4 niveles (1–4), desc. opcional | No existe | **Total** | Modelo de instrumento tipo rúbrica |
| A2 | Lista de cotejo: ítems Sí/No (2/1) | No existe | **Total** | Modelo de instrumento tipo cotejo |
| A3 | Sección **Plantillas** (CRUD, sin OA) | No existe | **Total** | Tablas de plantillas + UI de gestión |
| A3 | Cargar plantilla = **copia independiente** en la eval | No existe | **Total** | Copia profunda plantilla→instrumento aplicado |
| A4 | Eval sin instrumento / con rúbrica / con cotejo | Solo "sin instrumento" (tradicional) | Parcial | Coexistencia (ver §5) |
| A5 | Instrumento por OA/adecuación; varios por eval | `oa_original` TEXT + adecuaciones sin instrumento | **Alta** | Asociar instrumento a OA y a cada adecuación |
| A5 | Cada estudiante usa el instrumento de su OA/adec. | `adecuacion_id` por estudiante (sin instrumento) | Media | Derivar instrumento desde la adec./OA del estudiante |
| A6 | Grupos con instrumentos + excepciones arbitrarias | Grupos con nota/objetivo + flags excepción | Media | Extender excepción a "otro instrumento"/resultado propio |
| A8 | Puntaje y nota en **tiempo real** al completar | No aplica (nota manual) | **Total** | Cálculo en vivo en la UI |
| A8 | Cambiar piso recalcula todas las notas (abierta) | No existe | **Total** | Recalcular+persistir notas derivadas al cambiar piso |
| A9 | Instrumento **parcial** = incompleto, sin nota def. | `nota` puede quedar NULL (visual) | Media | Estado por-estudiante: completo/incompleto |
| A9 | **No cerrar** con pendientes | Cierre incondicional | **Contradicción** | Guard de cierre (UI + trigger) |
| A9 | Retirado antes: histórico, sin nota, no bloquea | Retirado permanece y bloquea (como pendiente) | **Contradicción** | Detectar retiro y excluir del bloqueo |
| A9 | Ingreso posterior: incorporable a eval abierta | Snapshot inmutable (I13): no aparece | **Contradicción** | Alta controlada de filas post-creación |
| A9 | Estado **"no aplica"** (no bloquea cierre) | No existe | **Total** | Estado por-estudiante 'no_aplica' |
| A10 | Edición completa mientras abierta | Sí (notas/adec./grupos) | Baja | Extender a instrumentos/piso/resultados |
| A10 | **Congelado integral** al cerrar | I12 congela lo actual | Media | Nuevos triggers para tablas nuevas |
| A10 | Reapertura | Existe y reversible | **Ninguna** | Conservar |
| A11 | **Pool** OA/adec./instrumentos + asignación in situ | `oa_original` + adecuaciones (sin instrumento) | Media | Pool de objetivos+instrumentos; asignar por estudiante |
| A12 | Crear adecuación+instrumento **in situ** y aplicar | `agregarAdecuacion()` (texto) en vivo | Media | Extender a crear instrumento y aplicarlo |
| A13 | Dos **PDF Carta** (previo UTP + resultados) | No existe | **Total** | Motor PDF + plantillas de informe |
| A13 | Identidad institucional en PDF (hardcode→config V1) | No existe entidad escuela | **Total** | Config de identidad (hardcode hoy; ligado a #10) |
| A14/§C | Desktop ahora; **Mobile V1.0** futuro | Desktop existe; sin mobile | (fuera de etapa) | No implementar; dejar el modelo apto para mobile |

**Contradicciones netas con el comportamiento vigente (punto 3 del encargo):** las tres
filas marcadas **Contradicción** (cierre con pendientes, retiro, ingreso posterior)
más el estado "no aplica". Todas nacen de que hoy la población es un **snapshot
inmutable que no distingue estados** y el cierre es incondicional. Son cambios de
comportamiento respecto de F4; una de ellas (**ingreso posterior**) **modifica la
invariante documentada I13** → requiere decisión explícita del PO (ver §6).

---

## 3. Auditoría del modelo de datos actual

- **Reutilizable tal cual:** `libro_evaluaciones` (cabecera + estado + reapertura),
  `libro_evaluacion_adecuaciones` (patrón "hijos de la eval"), `libro_evaluacion_notas`
  (una fila por estudiante — sirve de ancla para resultados y estados), grupos + flags
  de excepción, patrón RLS `acceso_total`, y el juego de triggers de congelado (I12).
- **Insuficiente para la spec:**
  - `oa_original` es **un TEXT en la cabecera**: no puede "tener asociado un
    instrumento" ni convivir con "varios objetivos por evaluación" de forma simétrica a
    las adecuaciones (§A5).
  - No hay puntaje, criterios, niveles, ítems, ni instrumentos.
  - `nota` es el único resultado; no hay resultado **por criterio/ítem**.
  - No hay `nota_min` (piso), ni estado por-estudiante (pendiente/no_aplica), ni
    marca de retiro/ingreso en el contexto de la evaluación.
- **Restricciones que condicionan el diseño:** `nota` es `NUMERIC(2,1)` con CHECK
  1,0–7,0 → las notas **derivadas** (piso 2,0–6,9 … 7,0) **caben** sin tocar el CHECK.
  El `UNIQUE(evaluacion_id, estudiante_id)` obliga a **una fila por estudiante** (bien
  para anclar resultados). La regla `contexto = curso` (trigger) se conserva.

---

## 4. Propuesta de modelo técnico

> Principio rector: **aditivo y compatible** (ninguna tabla/columna existente cambia de
> significado; lo tradicional sigue igual). Donde hay más de un camino con implicancia
> de producto, se marcan **OPCIONES (requieren PO)**.

### 4.1 Plantillas (independientes de las evaluaciones) — §A3
- `libro_instrumento_plantillas` (id, `tipo` 'rubrica'|'cotejo', `nombre`, created_at).
- `libro_plantilla_items` (id, plantilla_id, `orden`, `texto`). Para rúbrica, "item" =
  criterio; para cotejo, "item" = ítem Sí/No.
- Descripciones de los 4 niveles de rúbrica → **OPCIÓN 1** (técnica, menor):
  - **1a:** 4 columnas `desc_n1..desc_n4` en `libro_plantilla_items`.
  - **1b:** tabla hija `libro_plantilla_item_niveles` (item_id, nivel 1–4, descripcion).
  - *Diferencia:* 1a más simple; 1b más normalizado/extensible. Los **valores 1–4 son
    fijos** (no se guardan como dato).

### 4.2 Instrumento aplicado dentro de la evaluación (copia independiente) — §A3/§A4
- `libro_eval_instrumentos` (id, `evaluacion_id`, `tipo`, `nombre`,
  `origen_plantilla_id` NULL para trazabilidad no vinculante, created_at).
- `libro_eval_instrumento_items` (id, `instrumento_id`, `orden`, `texto`, +desc. según
  Opción 1). **Al cargar una plantilla se copian estas filas** → cambios/borrados en la
  plantilla original **no** afectan (spec §A3, ya decidido por Producto).

### 4.3 Objetivos e instrumento asociado — §A5  **(OPCIÓN con impacto de producto)**
Cómo representar "cada objetivo (OA original o adecuación) tiene un instrumento":
- **OPCIÓN A — mínimamente invasiva:** mantener `oa_original` en la cabecera y añadir
  `instrumento_id` a) en `libro_evaluaciones` (para el OA original) y b) en
  `libro_evaluacion_adecuaciones` (para cada adecuación).
  - *Ventaja:* cambio pequeño, no toca lo tradicional. *Desventaja:* el OA original y
    las adecuaciones quedan **asimétricos** (uno es columna, otras son filas).
- **OPCIÓN B — objetivos unificados:** nueva tabla `libro_eval_objetivos` (id,
  evaluacion_id, `tipo` 'oa'|'adecuacion', `texto`, `instrumento_id`), y `adecuacion_id`
  de las notas pasa a apuntar a un objetivo. `oa_original` se migra como un objetivo
  'oa'.
  - *Ventaja:* modelo simétrico y limpio, natural para "pool" (§A11) y "un instrumento
    para varios objetivos". *Desventaja:* migración de datos existentes y más cambios.
- *Nota:* "un mismo instrumento para más de un objetivo" (§A5) se soporta en ambas si
  `instrumento_id` es una referencia reutilizable. **Decisión del PO** (afecta cómo se
  conceptualiza el OA).

### 4.4 Resultado por criterio/ítem y por estudiante — §A1/§A8/§A9
- `libro_eval_resultados` (id, `nota_id` → `libro_evaluacion_notas`,
  `instrumento_item_id`, `valor` INT). Para rúbrica `valor`∈1..4; para cotejo `valor`∈1..2.
- **Instrumento efectivo por estudiante:** normalmente se **deriva** del objetivo/adec.
  asignado; pero §A6 permite "otro instrumento" individual → **OPCIÓN**:
  - **4a:** columna `instrumento_id` (override) en `libro_evaluacion_notas` (NULL =
    hereda del objetivo).
  - **4b:** derivar siempre del objetivo y modelar la excepción como "asignar al
    estudiante un objetivo distinto" (que trae su instrumento).
  - *Diferencia:* 4a permite "mismo objetivo, distinto instrumento"; 4b obliga a que un
    instrumento distinto implique un objetivo distinto. **Decisión del PO** (semántica
    de la excepción).

### 4.5 Piso, nota derivada y estado por estudiante — §A1/§A8/§A9
- `libro_evaluaciones.nota_min` NUMERIC(2,1) CHECK 2.0–6.9 DEFAULT 2.0.
- La `nota` de `libro_evaluacion_notas` **sigue siendo la nota final** (compatibilidad):
  para instrumentos se **calcula y persiste** (recalculada al cambiar el piso, §A8).
  - **OPCIÓN (calcular vs derivar):** **5a** persistir la nota calculada (simple para
    PDF/cierre/consultas; hay que recalcular en piso); **5b** calcular al vuelo desde
    resultados (siempre consistente; obliga a recomputar en todas las lecturas y a
    "congelar" distinto al cerrar). *Recomendación técnica neutral:* 5a encaja mejor con
    el congelado integral (§A10) y con los PDF, pero es decisión abierta.
- **Estado por estudiante** para "incompleto/no aplica/retiro" — **OPCIÓN:**
  - **5c:** columna `estado_eval` ('pendiente'|'evaluado'|'no_aplica') en
    `libro_evaluacion_notas` (+ derivar "incompleto" de faltar resultados).
  - **5d:** dos booleanos (`no_aplica`, y "evaluado" derivado de completitud).
  - *Diferencia:* enum explícito (5c) es más claro para el guard de cierre; booleanos
    (5d) más aditivos. **Decisión del PO** (cómo se nombran/derivan los estados).

### 4.6 Retiro e ingreso posterior — §A9  **(cambia la invariante I13 → requiere PO)**
- **Retiro:** al evaluar el cierre, un estudiante **retirado** (según `libro_matriculas`,
  estado 'retirado'/`fecha_retiro`) **sin evaluación** no bloquea; conserva su fila
  (histórico). Requiere **cruzar el snapshot con la matrícula vigente** (hoy no se hace).
- **Ingreso posterior:** permitir **insertar una fila** en `libro_evaluacion_notas`
  para un estudiante que ingresó después. Esto **relaja I13** ("sin re-sincronización").
  - **RESUELTO (PO): Opción 6b** — **re-sync automático** mientras la evaluación esté
    abierta (los matriculados posteriores aparecen solos, estado inicial Pendiente); el
    profesor decide evaluar o marcar No aplica. Cerrada = no incorpora; reabrir =
    vuelve a reconciliar. El PO **autoriza modificar la invariante I13**. Detalle en §0.1.
    *(Implicación técnica: al abrir/renderizar una evaluación abierta hay que cruzar el
    snapshot con las matrículas activas vigentes y materializar las filas faltantes.)*

### 4.7 Congelado integral al cerrar — §A10
- Extender el patrón I12 con **triggers nuevos** sobre `libro_eval_instrumentos`,
  `libro_eval_instrumento_items`, `libro_eval_resultados`, `libro_eval_objetivos` (si
  Opción B) y sobre las columnas nuevas, replicando `libro_hijo_bloqueo_cerrada`.
- Guard de **cierre por pendientes**: **OPCIÓN** **7a** solo en UI; **7b** UI + trigger
  en BD (coherente con el blindaje de I12). *Recomendación técnica:* 7b (defensa en BD),
  como el resto del Libro.

### 4.8 PDFs e identidad institucional — §A13  **(OPCIÓN técnica)**
- **Motor:** **8a** `@media print` + `window.print()` (cero dependencias, tamaño Carta
  vía CSS `@page size: letter`); **8b** jsPDF + AutoTable por CDN permitido (cdnjs).
  - *Diferencia:* 8a es más liviano y 100% vanilla, con menos control fino de paginado;
    8b da PDF programático y control de layout, sumando una dependencia CDN. Ambos son
    compatibles con el stack. **Decisión del PO/PO+técnica.**
- **Identidad institucional (RESUELTO PO, §0.2):** motor **8a**. Datos reales a
  hardcodear ahora: escuela *Escuela Juana de Lestonnac*, sostenedor *Servicio Local de
  Educación Pública Los Parques*; logos se adjuntarán a Claude. Se implementará en un
  **objeto de configuración único**, diseñado para volverse data-driven en V1.0 (enlaza
  con #10 multi-escuela). El **encabezado institucional** debe **repetirse en TODAS las
  páginas** replicando el layout de `ENCABEZADO PDF.pdf` (posición de nombres, logos,
  proporciones). No se crea la entidad escuela ahora salvo que el PO lo pida.

### 4.9 RLS y estilo
Todas las tablas nuevas con `acceso_total` (patrón vigente) y DDL **aditivo e
idempotente** (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`), como el resto
de `libro_schema.sql`.

---

## 5. Compatibilidad con evaluaciones existentes

**Objetivo: que nada de lo tradicional se rompa.** Diseño para que coexistan cuatro
modos sobre el **mismo** `libro_evaluaciones`/`libro_evaluacion_notas`:

| Modo | Cómo se reconoce | Nota | Datos nuevos |
|---|---|---|---|
| **Tradicional** (actual) | La eval **no tiene instrumentos** aplicados | Manual (como hoy) | Ninguno; `nota_min` se ignora |
| **Con rúbrica** | Objetivo(s) con instrumento tipo rúbrica | Derivada del puntaje | Instrumento + resultados |
| **Con lista de cotejo** | Objetivo(s) con instrumento tipo cotejo | Derivada | Instrumento + resultados |
| **Múltiples OA/adec.+instrumentos** | Varios objetivos, cada uno con su instrumento | Derivada por estudiante | Todo lo anterior |

Claves de compatibilidad:
- **Todo es aditivo.** Las evaluaciones existentes quedan con cero filas en las tablas
  nuevas y columnas nuevas en su default → se comportan **exactamente igual** que hoy.
- **La `nota` sigue siendo la nota final** en todos los modos (para tradicional se
  escribe; para instrumentos se calcula) → las lecturas/PDF/consultas existentes no
  cambian de contrato.
- **La UI decide el editor** según si el estudiante/objetivo tiene instrumento: si no,
  muestra el input de nota actual; si sí, muestra el instrumento.
- **Migración = solo `ALTER ... IF NOT EXISTS` + tablas nuevas**, re-ejecutable, sin
  tocar datos existentes. (La única excepción es la **Opción B §4.3**, que migraría
  `oa_original` a objetivos: si el PO la elige, se hará con backfill idempotente y sin
  pérdida.)

---

## 6. Riesgos y decisiones técnicas que requieren aprobación del PO

**Decisiones abiertas — RESUELTAS por el PO (2026-09-20).** Detalle en §0:
1. **§4.3** Objetivos → **Opción A** (OA en cabecera + adecuaciones como filas;
   `instrumento_id` en ambos).
2. **§4.4** Instrumento por estudiante → **Opción 4a** (override individual).
3. **§4.5** Nota → **5a persistida y recalculada al cambiar el piso**; estados →
   **5c enum: Pendiente / Evaluado / No aplica**.
4. **§4.6** Ingreso posterior → **Opción 6b** (re-sync automático con la evaluación
   abierta); **el PO autoriza modificar la invariante I13** (§0.1).
5. **§4.7** Cierre → **Opción 7b** (bloqueo en UI + BD).
6. **§4.8** PDF → **Opción 8a** (impresión del navegador / CSS; sin jsPDF).

**Riesgos / efectos secundarios:**
- **Cambio de invariante I13** (snapshot) y de la regla de cierre: afectan
  documentación normativa (esquema y CLAUDE.md) → deberán actualizarse **al implementar
  y decidir**, no ahora.
- **Redondeo:** la regla "5→sube" debe formalizarse; el actual `Math.round` cumple en
  casos comunes pero conviene un test de bordes (p. ej. .x5 exactos).
- **Recálculo por piso** sobre todos los estudiantes: volumen bajo (curso ~30–40), riesgo
  de rendimiento mínimo; riesgo real = consistencia (recalcular y persistir en bloque).
- **Crecimiento del archivo único** `LIBRO/index.html` (ya 2.805 líneas): mantenibilidad;
  hay que respetar el stack vanilla (no se puede modularizar con build).
- **Supabase (`CLAUDE.md` §4.4):** toda tabla/columna/RLS/trigger nueva exige
  autorización explícita del PO antes de ejecutarse.
- **Autorización de credenciales/estructura:** no se ejecuta ninguna migración en esta
  etapa.

---

## 7. Propuesta de implementación por etapas

> Cada etapa: acotada → validar → checkpoint Git propio (regla del período paralelo).
> **Etapa 0 es un gate de decisiones**, no de código.

- **Etapa 0 — Decisiones técnicas del PO. ✅ CERRADA (2026-09-20).** Las 6 opciones de
  §6 resueltas (ver §0). *Sin código.*
- **Etapa 1 — Esquema base (aditivo). ✅ IMPLEMENTADA, EJECUTADA Y VERIFICADA EN VIVO
  (2026-09-20).** Plantillas + instrumentos aplicados + items + resultados + `nota_min` +
  estado por estudiante + integridad "mismo ámbito". *Sin UI.* DDL ejecutado en Supabase
  y verificado (5 tablas, columnas, defaults, RLS, CHECK, regresión de lo tradicional).
  Ver "Registro de implementación — Etapa 1" al final.
- **Etapa 2 — Sección Plantillas (CRUD).** Crear/nombrar/editar/duplicar/eliminar/listar
  rúbricas y cotejos (§A3), independiente de evaluaciones. Depende de: E1. Prueba:
  E2E de CRUD; verificar que borrar una plantilla no afecta nada más.
- **Etapa 3 — Objetivos + instrumento + carga de plantilla (copia).** Piso por eval;
  asociar instrumento a OA/adecuación; cargar plantilla como **copia independiente**
  (§A3/§A5/§A11 pool). Depende de: E1. Prueba: modificar la plantilla original tras
  cargarla y verificar que la eval no cambia.
- **Etapa 4 — Aplicación por estudiante + cálculo.** Completar instrumento; puntaje y
  nota **en vivo**; guardado **parcial**; recálculo al cambiar **piso** (§A1/§A8/§A9).
  Depende de: E3. Prueba: casos de conversión y redondeo (incl. mín=máx, 1 criterio);
  cambio de piso recalcula todos.
- **Etapa 5 — Reglas de población y cierre.** Estados Pendiente/Evaluado/No aplica;
  bloqueo de cierre por pendientes (UI + trigger, 7b); retiro (no bloquea, conserva
  histórico); **ingreso posterior por re-sync automático (6b): reconciliar el snapshot
  con las matrículas activas mientras la eval está abierta, congelar al cerrar,
  re-reconciliar al reabrir** (modifica I13, §0.1); **congelado integral** al cerrar +
  reapertura (§A10). Depende de: E4. Prueba: matriz de escenarios
  (pendiente/retirado/ingreso posterior/no_aplica × abierta/cerrada/reabierta).
- **Etapa 6 — Grupos + excepciones con instrumentos.** Evaluar grupo y aplicar a
  integrantes; excepciones arbitrarias (individual, otra adecuación, otro instrumento,
  resultado propio) (§A6). Depende de: E4 (y E5 para estados). Prueba: herencia +
  cada tipo de excepción; interacción con grupo "terminado".
- **Etapa 7 — PDFs UTP + resultados + identidad institucional.** Informe previo e
  informe de resultados, Carta, vía impresión/CSS (8a). **Encabezado institucional
  repetido en TODAS las páginas** replicando `AUDITORIA/assets/ENCABEZADO PDF.pdf`
  (escuela *Juana de
  Lestonnac*, sostenedor *SLEP Los Parques*, logos), hardcode en config única y
  configurable en V1.0 (§0.2/§A13). Depende de: E4–E6 (datos completos) **y de recibir
  los logos**. Prueba: render Carta; encabezado en todas las páginas fiel a la
  referencia; contenido por estudiante; informe previo con estructura de instrumentos.

**Fuera de estas etapas (spec §C):** Mobile V1.0 — no se implementa; el modelo se diseña
para no impedirlo.

---

## 8. Estrategia de pruebas

No existe suite automatizada (stack vanilla); las pruebas son **manuales E2E** más
verificación de esquema:
- **Regresión tradicional:** una evaluación sin instrumentos debe comportarse
  exactamente como hoy (crear, notas manuales, cerrar/reabrir).
- **Esquema:** re-ejecutar el `.sql` es idempotente; filas existentes sin cambios.
- **Conversión/redondeo:** tabla de casos (mín=máx; 1 criterio; puntajes extremos;
  segundos decimales 4/5; piso 2,0 y 6,9).
- **Cierre:** no cierra con pendientes; cierra con todos evaluados o "no aplica";
  retirados sin nota no bloquean.
- **Snapshot:** ingreso posterior incorporable; retiro conserva histórico.
- **Grupos:** herencia + excepciones (nota, objetivo, instrumento) + "terminado".
- **Congelado:** cerrada = todo solo lectura (incluidas tablas nuevas); reapertura
  reactiva edición.
- **PDF:** ambos informes en Carta, con identidad institucional.
- **Verificación en vivo** con el preview del proyecto y comprobación en Supabase de las
  filas escritas.

---

## 9. Elementos que NO deben tocarse

- **Assets reales y motores protegidos** (`CLAUDE.md` §10): `METALÓFONO APP/MIDI/`,
  `tabs/TABS/`, `ritmo.js`/`ritmo-render.js`, `tabs/index.html`.
- **Supabase** (estructura/datos/RLS/triggers) **sin autorización explícita** del PO
  (§4.4) — esta etapa no ejecuta nada.
- **Contrato de lo tradicional:** no cambiar el significado de `libro_evaluacion_notas.nota`
  ni de las tablas existentes; solo **añadir**. No debilitar los triggers I7/I8/I9/I12
  (se **extienden**, no se relajan). **Excepción única:** I13 (snapshot), que la spec
  obliga a revisar para el ingreso posterior → solo con aprobación del PO.
- **Otras secciones del Libro** (Participación, Entregas, Observaciones, Talleres/
  pertenencias, Matrícula): fuera de alcance; no modificar.
- **Congelados del ecosistema** (SRP, LOOP-LAB, etc.) y **documentación normativa**
  (`CLAUDE.md`): no se tocan en esta etapa.

---

## Puntos que quedan abiertos antes de implementar

Con todas las decisiones de Producto cerradas (§0, incluidas §0.2 identidad/encabezado y
§0.3 cierre) **no quedan decisiones de producto pendientes**. Antes de escribir código
resta solo esto:

1. **Autorización de implementación + cambios en Supabase (PO).** Ejecutar el esquema
   nuevo y modificar la invariante I13 son cambios de base de datos: `CLAUDE.md` §4.4
   exige autorización explícita del PO **al momento de implementar** (la de I13 ya está
   dada en el plano conceptual; falta la de ejecutar). Esta etapa **no** ejecuta nada.
2. **Insumo pendiente (no es decisión):** los **archivos de logo** (escuela y
   sostenedor) que el PO adjuntará a Claude. Los nombres institucionales y el layout de
   encabezado ya están definidos (§0.2). Sin los logos no se puede cerrar la Etapa 7
   (PDF), pero no bloquea las etapas previas.

**Detalle técnico menor (no requiere PO), a fijar al implementar:** almacenamiento de
las descripciones de los 4 niveles de rúbrica (Opción 1a columnas vs 1b tabla hija,
§4.1) — sin impacto de producto.

## Cierre de la etapa (auditoría)
Auditoría, decisiones del PO (§0) y propuesta por etapas **actualizadas**. Implementación
autorizada por el PO (2026-09-20), **por etapas**, comenzando por la Etapa 1.

---

## Registro de implementación — Etapa 1 (esquema base) · 2026-09-20

**Autorización:** PO, sobre el checkpoint `44a0052`. Alcance ejecutado = **solo Etapa 1**
(esquema base aditivo). Sin UI, sin cálculo, sin cierre/congelado, sin cambio de I13.

**Qué se implementó (en `supabase/libro_schema.sql`, sección "F6 … ETAPA 1"):**
- **Tablas nuevas (5):** `libro_instrumento_plantillas`, `libro_plantilla_items`,
  `libro_eval_instrumentos`, `libro_eval_instrumento_items`, `libro_eval_resultados`.
- **Columnas aditivas:** `libro_evaluaciones.nota_min` (NUMERIC(2,1), CHECK 2.0–6.9,
  DEFAULT 2.0) y `.instrumento_id`; `libro_evaluacion_adecuaciones.instrumento_id`;
  `libro_evaluacion_notas.instrumento_id` (override 4a) y `.estado_eval`
  ('pendiente'|'evaluado'|'no_aplica', DEFAULT 'pendiente', **inerte** en esta etapa).
- **Integridad estructural "mismo ámbito"** (análoga a I9): triggers que verifican que un
  `instrumento_id` asociado a OA/adecuación/nota pertenezca a la misma evaluación, y que
  un resultado una nota e ítem de la misma evaluación. Helper `libro_instr_eval`.
- **RLS `acceso_total`** en las 5 tablas (patrón del ecosistema). DDL **aditivo e
  idempotente** (`IF NOT EXISTS` / `CREATE OR REPLACE` / `DROP … IF EXISTS`).

**Decisiones reflejadas:** Objetivos A, instrumento por estudiante 4a, estados 5c,
`nota_min` (piso) 5a-preparado. Descripciones de niveles de rúbrica = columnas
`desc_n1..desc_n4` (Opción 1a; detalle técnico menor, sin impacto de producto).

**Fuera de alcance (etapas posteriores), NO tocado en Etapa 1:** cálculo puntaje→nota y
recálculo por piso (E4); reconciliación de población / cambio efectivo de **I13** (E5);
bloqueo y congelado de cierre (E5); grupos↔instrumentos (E6); PDFs (E7); toda la UI.
**I13 no se modificó**: la sección de invariantes del esquema sigue como está; su cambio
ocurrirá en la Etapa 5 (población), como estaba previsto.

**Verificación realizada (estática):** balance de bloques `$$` (10 = 5 funciones), 5
tablas / 5 columnas / 5 funciones / 4 triggers / 5 políticas RLS; orden correcto de la
FK circular (`libro_eval_instrumentos` se crea antes de referenciarla desde
`libro_evaluaciones`); todo `IF NOT EXISTS` (re-ejecutable). **Regresión de lo tradicional
(razonada):** no se tocó código de aplicación; las columnas nuevas son NULL o con DEFAULT
y **ninguna consulta actual las usa** (los `SELECT`/`INSERT`/`upsert` del Libro nombran
columnas explícitas), por lo que una evaluación tradicional se comporta igual tras aplicar.

**Ejecución en Supabase:** el PO ejecutó el DDL en el **SQL Editor de Supabase**
(2026-09-20): "Success. No rows returned".

**Verificación en vivo (2026-09-20, vía REST con anon key / RLS `acceso_total`):**
- **Estructura:** las 5 tablas nuevas responden 200; las columnas nuevas
  (`libro_evaluaciones.nota_min`/`instrumento_id`, `libro_evaluacion_adecuaciones.instrumento_id`,
  `libro_evaluacion_notas.estado_eval`/`instrumento_id`) existen (200). ✅
- **Regresión de lo tradicional:** las **3 evaluaciones** existentes se leen sin cambios;
  **todas** con `nota_min=2.0` e `instrumento_id=null`; **todas** las notas con
  `estado_eval='pendiente'`, `instrumento_id=null` y sus notas intactas (5.0, 7.0, 6.7,
  null…). Filtros de control: 0 filas con `nota_min≠2.0` y 0 notas con
  `estado_eval≠'pendiente'`. ✅
- **Escritura + constraint (prueba reversible en la tabla independiente de plantillas):**
  insert válido → 201; insert con `tipo='xxx'` → **400 (CHECK activo)**; lectura → 1 fila;
  DELETE → 204; limpieza confirmada (sin filas de prueba residuales). ✅
- **Triggers de integridad "mismo ámbito":** verificados **estáticamente**; su prueba en
  vivo se ejercerá naturalmente en etapas posteriores (requieren instrumentos ligados a
  evaluaciones reales, que aún no existen).

**Resultado:** Etapa 1 **aplicada y verificada en vivo, sin regresiones**. No surgieron
decisiones de Producto nuevas.
