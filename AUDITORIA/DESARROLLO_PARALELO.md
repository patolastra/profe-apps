# Desarrollo Paralelo — Registro de trazabilidad

> **Propósito.** Durante la suspensión temporal del recorrido lineal del Bosquejo
> Conceptual V1 (pausa tras **F6A**; ver `BOSQUEJO_V1_ESTADO_Y_CONTINUIDAD.md`), el
> Product Owner puede implementar funcionalidades que la **práctica profesional
> docente** demuestre necesarias ahora, aunque el Bosquejo las contemplara para una
> fase posterior. Este documento es la **bitácora que deja trazable cada uno de esos
> desarrollos**, para poder reintegrarlos correctamente cuando se retome F6B.

## Reglas del período paralelo

- Un desarrollo paralelo **puede adelantarse** respecto del orden del Bosquejo.
- Eso **NO significa** que el Bosquejo se reordene.
- Que una funcionalidad **exista implementada NO implica** automáticamente que su
  **diseño conceptual esté cerrado**.
- Las **decisiones** tomadas durante estos desarrollos deben quedar **identificables**
  para la futura reintegración.
- Este registro **no** es normativo y **no** modifica el Bosquejo ni `CLAUDE.md`.
- La arquitectura real debe mantenerse **limpia, actualizada y fiel al código**
  también durante este período (nada de duplicaciones o arquitectura provisional sin
  registrar).

## Ciclo de trabajo obligatorio (procedimiento operativo)

Cada desarrollo paralelo sigue **obligatoriamente** este ciclo, sin saltarse pasos.
Es la regla permanente del proyecto (ver también `CLAUDE.md`, §9).

**Por cada desarrollo paralelo:**

1. **Necesidad profesional** — se identifica la necesidad docente real que lo
   origina (queda en la ficha, campo "Necesidad profesional que lo origina").
2. **Ficha de trazabilidad** — se crea la entrada en este documento copiando la
   plantilla y completando los campos conocidos.
3. **Auditoría técnica** — Claude audita estado actual, dependencias e impacto en la
   arquitectura vigente **antes** de proponer/implementar.
4. **Decisión del Product Owner** — el PO aprueba o ajusta el alcance. Las
   decisiones de producto son del PO; Claude no las toma por su cuenta.
5. **Implementación** — Claude implementa **solo el alcance autorizado**.
6. **Prueba / validación** — se verifica el resultado (funcional/visual según
   corresponda).
7. **Documentación y cierre** — se actualiza la ficha (estado, decisiones,
   documentación/código afectado, pendientes, observaciones para la reintegración).
8. **Git checkpoint** — commit propio del desarrollo.

**Al finalizar el período paralelo (reintegración):**

9. **Reintegración/auditoría global** de todo lo desarrollado en el período.
10. **Revisión frente al Bosquejo V1** (lo definido vs. lo realmente construido).
11. **Decisiones definitivas** sobre el estado de cada funcionalidad dentro de V1.
12. **Reanudación del Bosquejo en F6B**.

**Reglas de checkpoint:** cada desarrollo cerrado tiene **su propio checkpoint Git**;
**no se mezclan** checkpoints de desarrollos paralelos distintos. La reintegración
global ocurre **antes** de retomar F6B.

**Recordatorios (ver "Reglas del período paralelo" arriba):** adelantar una
funcionalidad no cambia su posición en el Bosquejo; una implementación no cierra
automáticamente su diseño conceptual; nada de esto modifica automáticamente el
Bosquejo V1.

### Participación de ChatGPT en el ciclo

ChatGPT (arquitecto y coordinador; opera fuera del repositorio, vía el PO) participa
así, **sin cambiar** el ciclo ni tomar decisiones:

- **Necesidad (1) y Ficha (2):** ayuda a formular la necesidad profesional y a redactar
  la ficha/especificación.
- **Auditoría técnica (3):** puede aportar **revisión arquitectónica** de alto nivel; la
  auditoría del repo la hace **Claude**.
- **Decisión (4):** **prepara las propuestas** para el PO; **decide el PO**.
- **Implementación (5):** la hace **Claude**; ChatGPT **transforma la decisión aprobada
  en prompts/especificaciones**.
- **Prueba (6) y Documentación/cierre (7):** **revisa** resultados/diffs y documentación
  **a través del PO**.
- **Checkpoint Git (8):** lo hace **Claude**; ChatGPT **no commitea**.
- **Reintegración (9–12):** participa en la **revisión conceptual** frente al Bosquejo y
  en la propuesta de decisiones definitivas; **decide el PO**.

ChatGPT **no implementa ni hace commits**. Contexto de entrada de ChatGPT:
`AUDITORIA/CONTEXTO_CHATGPT.md`.

## Cómo usar este registro

Copiar la plantilla de abajo por **cada desarrollo paralelo relevante** y completar
todos los campos. Mantener las entradas en orden cronológico bajo "Entradas".

---

## Plantilla

```
### Desarrollo paralelo: [nombre]

**Fecha:**
**Necesidad profesional que lo origina:**
**Funcionalidad desarrollada:**
**Estado:** propuesto / en desarrollo / implementado / auditado
**Relación con la arquitectura actual:**
**Relación con el Bosquejo Conceptual V1:**
**Fase del Bosquejo donde originalmente estaba contemplado:**
**Decisiones de producto adoptadas durante el desarrollo:**
**Documentación/código afectado:**
**Pendientes:**
**Observaciones para la reintegración:**
```

---

## Entradas

### Desarrollo paralelo: Instrumentos de Evaluación — Rúbricas y Listas de Cotejo (Libro de Clases)

**Fecha:** 2026-09-20
**Necesidad profesional que lo origina:** el profesor necesita evaluar con
**instrumentos formales** (rúbricas y listas de cotejo) que **generen la nota
automáticamente** a partir del puntaje, aplicarlos digitalmente por estudiante y por
grupo (con excepciones y adecuaciones), y producir **informes PDF para UTP** (uno
previo que informa cómo se evaluará y otro de resultados). Producto lo define como
**vital para V1.0** del Bosquejo Conceptual.
**Funcionalidad desarrollada:** especificación funcional cerrada por Producto (14
puntos): conversión puntaje→nota con piso configurable por evaluación (2,0–6,9; def.
2,0; máx 7,0) y redondeo a un decimal; estructura de rúbrica (criterios × 4 niveles
1–4) y lista de cotejo (ítems Sí/No = 2/1); sección **Plantillas** (copia independiente
al cargarse en una evaluación); integración con EVALUACIÓN (tradicional / rúbrica /
cotejo); cadena OA→instrumento→estudiante (varios instrumentos por evaluación, uno por
OA/adecuación); grupos con excepciones (incl. otro instrumento/adecuación individual);
cálculo en tiempo real y recálculo al cambiar el piso; pendientes/retiro/ingreso
posterior/"no aplica" y su efecto en el cierre; congelado al cerrar + reapertura;
pool previo + asignación y creación **in situ**; dos **PDF Carta** con identidad
institucional (hardcode permitido ahora, personalizable en V1.0). **Especificación
completa en `AUDITORIA/INSTRUMENTOS_EVALUACION_SPEC.md`.**
**Estado:** **CERRADA — EN MARCHA BLANCA / VALIDACIÓN EN USO REAL** (2026-09-21).
Resumen para lectura rápida (una ventana/contexto nueva puede entenderlo de inmediato):
- **IMPLEMENTACIÓN:** CERRADA (Etapas 1–7 completas y verificadas en vivo, 2026-09-20/21).
- **ESTADO OPERATIVO:** EN MARCHA BLANCA (publicada online; en uso real).
- **VALIDACIÓN REAL:** EN CURSO (recién iniciada; **NO** validada/aprobada aún).
- **DECISIONES PENDIENTES (de Producto):** NINGUNA dentro de esta línea.
- **REINTEGRACIÓN F6B:** PENDIENTE al final del período general de desarrollos paralelos.

**Publicación online (2026-09-21):** la implementación se **publicó mediante `git push` a
`origin/master`** (fast-forward `cf14b98..f883fd5`); **GitHub Pages** reconstruyó y **sirve
la implementación completa** en https://patolastra.github.io/profe-apps/ (LIBRO online
byte-idéntico al blob commiteado). El **backend Supabase** requerido (tablas/columnas/
triggers de las Etapas 1 y 5) está **operativo**. La evaluación tradicional sigue sin
regresiones.

**Marcha blanca (validación en uso real — EN CURSO, sin resultados aún):** el uso real
buscará detectar eventuales incidencias de (a) **funcionamiento**, (b) **persistencia/
sincronización**, (c) **integración con el Libro de Clases**, (d) **generación de
informes** y (e) **experiencia de uso**. **Regla:** las incidencias que aparezcan se
tratan como **correcciones de la implementación existente**, **no** como una nueva línea
de desarrollo paralelo **ni** como reapertura automática de las Etapas 1–7.

**Marcha blanca — registro de incidencias y correcciones:**
- **#1 — Descubribilidad de Plantillas (2026-09-21).**
  - **Incidencia:** en una evaluación **sin plantillas**, el bloque "Instrumentos de esta
    evaluación" mostraba el selector "— elegir plantilla —" vacío, **sin indicar dónde
    crear** una plantilla.
  - **Diagnóstico:** la funcionalidad de Plantillas **existía y funcionaba**; el problema
    era **de descubribilidad/UX**, no de funcionamiento, datos ni acceso (las plantillas
    se crean/gestionan en la sección global "Plantillas", accesible desde el panel del
    curso; el selector estaba vacío simplemente porque aún no se había creado ninguna).
  - **Corrección:** con 0 plantillas se muestra un **mensaje explicativo** ("No hay
    plantillas creadas todavía…") y un **acceso directo "Crear plantilla"** que lleva a la
    **sección global existente** de Plantillas (reutiliza `abrirPlantillas()`; **no**
    duplica el formulario). Con plantillas existentes, el selector y la carga se comportan
    igual que antes. **Solo UI en `LIBRO/index.html`; sin cambios de esquema ni de
    Supabase.**
  - **Verificación (con Supabase real):** estado vacío → mensaje + acceso; acceso lleva a
    la pantalla de Plantillas; creación de plantilla; aparición en el selector; **carga en
    la evaluación como copia independiente**; y **regresión** del flujo existente (0
    errores). Datos de prueba creados y **eliminados** (estado global restaurado a 0
    plantillas).
  - **Estado:** **corrección verificada y publicada online** (push `eb00137..b264d85`, 2026-09-21).
  - **Checkpoint:** `4100a2d`.
- **#2 — Creación directa de instrumentos (2026-09-21).**
  - **Incidencia:** el flujo permitía **cargar plantillas**, pero **no** crear directamente
    una **Rúbrica** o **Lista de cotejo** para una evaluación cuando ya existían plantillas;
    obligaba a convertir artificialmente la necesidad de crear un instrumento concreto en
    la creación previa de una plantilla.
  - **Diagnóstico:** la funcionalidad de Plantillas **funcionaba correctamente**; faltaba el
    **flujo operativo de creación directa** de un instrumento aplicado a una evaluación.
  - **Corrección:** se agregó **"＋ Crear instrumento"** dentro de la evaluación → elegir
    **Rúbrica / Lista de cotejo**, ingresar **nombre** y configurar directamente sus
    **criterios/ítems**. El instrumento directo: se crea en `libro_eval_instrumentos` con
    **`origen_plantilla_id = NULL`**; usa `libro_eval_instrumento_items`; funciona con el
    **pipeline existente** (asociación OA/adaptación, evaluación, cálculo, grupos/
    excepciones, informes) **sin modificarlo**; y **no crea ni modifica Plantillas**.
    Edición de estructura **solo con evaluación abierta y sin resultados**; con resultados,
    **bloqueada**; evaluación cerrada respeta el congelamiento de Etapa 5 (UI + triggers).
    **Solo UI en `LIBRO/index.html`; sin cambios de esquema ni de Supabase.**
  - **Verificación:** **16 pruebas E2E con Supabase real, todas OK** — creación directa de
    rúbrica; creación directa de lista de cotejo; persistencia; `origen_plantilla_id` NULL;
    asociación a OA; cálculo de resultados; compatibilidad con plantillas existentes;
    bloqueo de edición con resultados; bloqueo en evaluación cerrada (UI + BD); regresión
    de evaluación tradicional; consola sin errores relevantes.
  - **Datos:** datos de prueba **eliminados**; **datos reales del profesor intactos**
    (incl. su plantilla y su evaluación real con instrumentos).
  - **Estado:** **corrección verificada y publicada online** (push `eb00137..b264d85`, 2026-09-21).
  - **Checkpoint de implementación:** `9a5da65`.
  - **Deuda futura (identificada, NO implementada):** (1) "Guardar instrumento como
    plantilla"; (2) promover instrumento directo a plantilla; (3) reutilizar instrumentos
    sin convertirlos en plantilla; (4) gestión definitiva de instrumentos reutilizables;
    (5) diferenciación UX definitiva Instrumento vs. Plantilla; (6) acceso desde Talleres;
    (7) política definitiva de edición/versionado de instrumentos con resultados.

**Checkpoints Git (uno por etapa):** E1 `253982b` (precursor de esquema `2af798e`) · E2
`6471ded` · E3 `5659da0` · E4 `6f6c0b7` · E5 `3ba322f` · E6 `e05219c` · **E7 `7470a35`
(checkpoint final de implementación)**. Etapa documental previa: `44a0052`. **Cierre
documental de la línea: `f883fd5`.** Publicación online: push `cf14b98..f883fd5` a
`origin/master`.
Detalle por etapa:
**Etapa 1 (esquema base) implementada en código**
(`supabase/libro_schema.sql`, sección "F6 … ETAPA 1"): 5 tablas nuevas
(`libro_instrumento_plantillas`, `libro_plantilla_items`, `libro_eval_instrumentos`,
`libro_eval_instrumento_items`, `libro_eval_resultados`), columnas aditivas (`nota_min`,
`instrumento_id` en evaluaciones/adecuaciones/notas, `estado_eval`), integridad "mismo
ámbito" y RLS; aditivo e idempotente. **DDL ejecutado por el PO en Supabase y verificado
en vivo (2026-09-20): 5 tablas, columnas y defaults OK, RLS y CHECK activos, sin
regresión en las evaluaciones tradicionales.** **Etapa 2 (Plantillas CRUD) implementada
y verificada en vivo (2026-09-20)** en `LIBRO/index.html`: crear/editar/duplicar/eliminar/
listar plantillas (rúbrica 4 niveles / cotejo Sí-No), acceso desde el panel del curso,
copia independiente al duplicar; incluye una corrección de robustez en el alta de ítems
(guard de reentrada). Sin regresión en evaluaciones tradicionales; datos de prueba
limpiados. **Etapa 3 (Objetivos+instrumento+plantilla+piso+pool) implementada y
verificada en vivo (2026-09-20)** en `LIBRO/index.html`: card "Instrumentos de
evaluación" en el detalle (evaluación abierta); asociar OA/adecuación→instrumento
(Opción A), cargar plantilla como **copia independiente** (verificado: editar la original
no altera la aplicada), configurar el **piso** (`nota_min`, sin cálculo aún), pool y
"Quitar" (ON DELETE SET NULL). Sin regresión en evaluaciones tradicionales; datos de
prueba limpiados. **Etapa 4 (aplicación del instrumento + cálculo) implementada y
verificada en vivo (2026-09-20)** en `LIBRO/index.html`: aplicar el instrumento por
estudiante (modal con niveles rúbrica 1–4 / cotejo Sí=2/No=1), puntaje→nota en vivo con
piso y redondeo, guardado parcial (incompleto = sin nota), recálculo al cambiar el piso,
override individual (4a) respetado, persistencia y recuperación tras recarga. Incluye 3
correcciones de robustez (instrumento_id en el SELECT de notas; persistir objetivo con
instrumento; recalcular al asociar). E2E sobre evaluación desechable (creada y borrada);
sin regresión en la evaluación tradicional real. **Etapa 5 (estados, población, cierre,
reapertura) implementada y verificada en vivo (2026-09-20)** en `LIBRO/index.html` +
`supabase/libro_schema.sql`: estados Pendiente/Evaluado/No aplica, reconciliación con la
matrícula activa (cambio de I13 autorizado por el PO), guard de cierre en UI + BD
(trigger), congelado integral al cerrar (incl. tablas nuevas) y reapertura con
reconciliación. **Decisión del PO: aplica a TODAS las evaluaciones.** 14 tests E2E OK
(incl. protección de BD, tests 10 y 13); una corrección (estado_eval en el SELECT de
notas). Datos de prueba limpiados y datos reales restaurados. **CLAUDE.md sin cambios**
(consolidación normativa de I13/estados/cierre diferida a la reintegración; el comentario
de I13 en el esquema sí se actualizó). **Etapa 6 (grupos + excepciones con instrumentos)
implementada y verificada en vivo (2026-09-20)** en `LIBRO/index.html` (**sin cambios de
esquema**): evaluar el grupo con su instrumento (reparto/*fan-out* a los integrantes que
heredan, sobre `libro_eval_resultados`) y excepciones individuales arbitrarias por
integrante (evaluación individual, otra adecuación, otro instrumento por override 4a,
resultado propio) sin alterar al resto; el modal de grupo es instrument-aware (conserva la
nota grupal manual tradicional cuando no hay instrumento); reintegración del override 4a en
la persistencia y del congelado de Etapa 5 (verificado). 12 tests E2E OK contra Supabase
real (evaluación desechable en CUARTO, datos de prueba limpiados; evaluaciones reales y
matrículas intactas), incl. el cálculo con excepciones y el congelado al cerrar. **CLAUDE.md
sin cambios** (no cambia esquema/invariantes; consolidación normativa diferida a la
reintegración). **Etapa 7 (Informes PDF UTP + resultados) implementada y verificada en vivo
(2026-09-21)** en `LIBRO/index.html` (**sin cambios de esquema**): dos informes tamaño
**Carta** por impresión del navegador + CSS (Opción 8a, sin librerías) — (A) informe previo
de instrumentos para UTP (OA/adecuaciones + instrumento asociado + estructura completa) y
(B) informe de resultados por estudiante (objetivo, instrumento, resultado por
criterio/ítem, puntaje y nota) respetando estados (Evaluado/No aplica/Pendiente-incompleto);
**encabezado institucional repetido en todas las páginas** (vía `<thead>`) fiel a
`AUDITORIA/assets/ENCABEZADO PDF.pdf`, con los **logos extraídos de ese mismo PDF** e
incrustados como data-URI (sin pedir archivos aparte); los informes **solo leen** datos (no
tocan la lógica de evaluación). 12 tests E2E OK contra Supabase real (escenario rico en
CUARTO: evaluado/No aplica/incompleto/tradicional; datos de prueba limpiados; evaluaciones
reales y matrículas intactas); comparación visual del encabezado contra la referencia OK.
**CLAUDE.md sin cambios** (identidad institucional hardcodeada, data-driven en V1.0;
consolidación normativa diferida a la reintegración). **Con la Etapa 7 se CIERRA la línea
"Instrumentos de Evaluación" (Etapas 1–7 implementadas y verificadas).** Registro detallado
en `INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` ("Registro de implementación — Etapa 1" a
"— Etapa 7").
**Identidad institucional del PDF (PO):** escuela *Escuela Juana de Lestonnac*;
sostenedor *Servicio Local de Educación Pública Los Parques*. **Logos [ACTUALIZADO
2026-09-21]:** ya estaban **embebidos en el PDF de referencia versionado**
`AUDITORIA/assets/ENCABEZADO PDF.pdf`; en la Etapa 7 se **extrajeron de allí** e incrustaron
como data-URI — **no** hubo que recibir archivos aparte. El **encabezado institucional** se
**repite en todas las páginas** replicando el layout de ese PDF (posición de nombres, logos
y proporciones); las versiones grandes de logos en ese PDF son solo material de referencia,
no van en el cuerpo. Detalle en `INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` §0.2.
**Criterio de cierre (PO, aprobado):** bloquea el cierre el estudiante que está
**matriculado + no "No aplica" + instrumento incompleto**; retirado y "No aplica" no
bloquean (§0.3).
**Decisiones técnicas del PO (2026-09-20):** (1) Objetivos = **Opción A** (OA en
cabecera + adecuaciones; `instrumento_id` en ambos); (2) Instrumento por estudiante =
**4a** (override individual); (3) Nota **persistida y recalculada al cambiar el piso**,
estados **Pendiente/Evaluado/No aplica**, incompleto = pendiente sin nota; (4) Ingreso
posterior = **6b** (re-sync automático con la eval abierta; cerrada no incorpora;
reabrir re-reconcilia) **+ el PO autoriza modificar la invariante I13**; (5) Cierre =
**7b** (bloqueo en UI + BD); (6) PDF = **8a** (impresión del navegador/CSS, sin
bibliotecas). Detalle en `INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` §0.
**Relación con la arquitectura actual:** se integra sobre la funcionalidad EVALUACIÓN
del Libro (`LIBRO/index.html`; tablas `libro_evaluaciones`, `libro_evaluacion_notas`,
`libro_evaluacion_adecuaciones`, `libro_evaluacion_grupos`). Producto **no prescribe**
persistencia (§A7). **Contradice comportamientos vigentes** que deberán resolverse en
la auditoría técnica (detalle en la spec §B): hoy el cierre **no** bloquea por
pendientes, y la población es un **snapshot inmutable** (invariante I13) que **no**
admite ingresos posteriores.
**Relación con el Bosquejo Conceptual V1:** funcionalidad **adelantada** durante el
período de desarrollo paralelo. No reordena ni sustituye el Bosquejo; su estado
definitivo en V1 se decidirá en la reintegración.
**Fase del Bosquejo donde originalmente estaba contemplado:** **F6H
(Evaluaciones/UTP)** — rúbricas y entrega a UTP; con tangencias a F6E (recursos/
plantillas), F6G (Libro/alumnos) y F6K (identidad institucional en el PDF /
multi-escuela #10).
**Decisiones de producto adoptadas durante el desarrollo:** las 14 de la especificación
(§A de `INSTRUMENTOS_EVALUACION_SPEC.md`).
**Documentación/código afectado:** `AUDITORIA/INSTRUMENTOS_EVALUACION_SPEC.md` y
`AUDITORIA/INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` (spec + auditoría + registros de
implementación Etapas 1–7); `supabase/libro_schema.sql` (Etapas 1 y 5); `LIBRO/index.html`
(Etapas 2–7); esta ficha. Referencia institucional: `AUDITORIA/assets/ENCABEZADO PDF.pdf`.
**Pendientes (post-decisiones):** **no quedan decisiones de Producto pendientes** ni
etapas por implementar en esta línea. **[ACTUALIZADO 2026-09-21]** Resueltos: (a) la
autorización del PO para implementar/ejecutar en Supabase (Etapas 1 y 5); (b) el insumo de
logos — estaban en el PDF de referencia y se extrajeron en la Etapa 7. Detalle técnico
menor (descripciones de niveles de rúbrica): implementado como Opción 1a (`desc_n1..n4`).
**Mobile V1.0** sigue como **requisito futuro** (spec §C), fuera de esta línea.
**Consecuencia documental [ACTUALIZADO 2026-09-22]:** la invariante **I13** ya se
actualizó en `supabase/libro_schema.sql` durante la **Etapa 5** (conforme a la decisión
6b). `CLAUDE.md` no describe I13; decidir si I13/estados/cierre pasan a `CLAUDE.md` como
regla permanente queda **pendiente para la reintegración**.
**Observaciones para la reintegración:** contrastar contra F6H del Bosquejo; si Producto
lo confirma como V1 firme, evaluar la actualización de `CLAUDE.md` (§8 alcance V1 y §9
roadmap, hoy con rúbricas/UTP como "posible/identificado"). Registrar que esta línea
**cambia reglas vigentes** de EVALUACIÓN (cierre y snapshot), lo que debe quedar
reflejado en la Fuente de Verdad cuando se implemente y decida.

---

### Microiteración de uso real: Workspace — cierre de pestaña → Dashboard

> Entrada **breve** y **separada** de la línea de Instrumentos: es una **microiteración de
> UX** sobre un módulo activo (Workspace PC), surgida en uso real durante el período
> paralelo. **No** es una línea de desarrollo paralelo del Bosquejo ni una especificación
> general del sistema de pestañas.

**Fecha:** 2026-09-21
**Módulo / archivo:** Workspace PC — `PC/workspace.html` (función `cerrarTab`).
**Necesidad detectada en uso real:** al cerrar una **pestaña adicional activa**, cuando
quedaban únicamente las dos pestañas fijas **Dashboard** y **Repertorio**, la aplicación
dejaba activa **Repertorio**.
**Decisión puntual (PO):** cuando se cierra la pestaña **activa** y, tras el cierre, solo
quedan las **dos pestañas fijas** (Dashboard + Repertorio), activar **Dashboard**.
**Alcance:** **solo ese caso.** En cualquier otro escenario se conserva **exactamente** la
lógica actual (`tabs[i] || tabs[i-1] || null`): otras pestañas adicionales abiertas, cierre
de una pestaña no activa, cierre de una intermedia, o varias adicionales.
**Aclaración fundamental:** el **comportamiento general de cierre de pestañas sigue
deliberadamente sin definir** y queda **pendiente de observación mediante uso real**. Esta
microiteración **NO** constituye una especificación general de la política de pestañas.
**Estado:** **publicada online y verificada** (byte-idéntica al blob commiteado; 5 pruebas
en navegador OK; consola sin errores).
**Checkpoint:** `b81d5e6`.
**Nota de gobernanza:** cambio acotado a `PC/workspace.html`; sin cambios de Supabase, de
arquitectura de pestañas ni de `CLAUDE.md` (no es regla permanente; es UX provisional).

---

### Microiteración de uso real: Participación — Inhabilitar y Preseleccionar participante

> Entrada **breve** y **separada**: microiteración de UX sobre un módulo activo (Libro de
> Clases → Participación), surgida en uso real durante el período paralelo. **No** es una
> línea de desarrollo paralelo del Bosquejo ni una regla general del sistema.

**Fecha:** 2026-09-22
**Módulo / archivo:** Libro de Clases → Participación — `LIBRO/index.html` (vista normal
de la tabla y vista Proyector).
**Necesidad detectada en uso real:** durante el sorteo "🎲 Elegir al azar" el profesor
necesita (1) **excluir temporalmente** a un estudiante (ausente, no quiere participar u
otra razón puntual del momento) y (2) poder **decidir en secreto** quién saldrá en el
próximo sorteo.
**Ciclo seguido:** auditoría técnica (sin cambios) → **autorización del PO** →
implementación → pruebas → esta ficha → checkpoint propio.
**Decisión puntual (PO):** dos gestos nuevos, independientes entre sí:
- **Shift + clic** → **Inhabilitar / rehabilitar** participante.
- **Ctrl + Shift + clic** → **Preseleccionar / quitar preselección** para el próximo sorteo.

**Distinción de estados (clave de esta microiteración):**
| Estado | Naturaleza | Dónde vive | Al salir de la instancia |
|---|---|---|---|
| **Participó / En espera** | **persistente** (existente, sin cambios) | Supabase `libro_participacion_detalle.participo` | se conserva |
| **Inhabilitado** | **temporal, visible, no persistente** | solo memoria de la página | se descarta |
| **Preseleccionado** | **temporal, secreto, no persistente, consumido por el sorteo** | solo memoria de la página | se descarta |

**Comportamiento implementado:**
- **Inhabilitado:** no entra al sorteo; el clic normal (fila, casilla o tarjeta) **no**
  registra participación; se rehabilita con Shift + clic. Se ve **atenuado** en la tabla
  (con la etiqueta "inhabilitado") y **gris, punteado y tachado** en el Proyector, en su
  mismo lugar (el tablero no se reordena). El contador **"esperando su turno"** cuenta solo
  a quienes están en espera **y** habilitados; el botón del sorteo se desactiva si no queda
  nadie elegible.
- **Preseleccionado:** solo se puede preseleccionar a quien está en espera y habilitado. El
  próximo "🎲 Elegir al azar" lo elige; la animación y el destacado son **exactamente** los
  de un sorteo normal (el barajado nunca "aterriza" en una tarjeta, así que no delata nada).
  **Ninguna** marca visual en el Proyector ni en la vista normal (ni clase, ni texto, ni
  tooltip). Se **consume** al sortear; se **anula** si el preseleccionado se inhabilita o
  pasa a "Participó"; repetir el gesto sobre la misma persona la quita. **No** modifica
  "Participó" (igual que hoy, el sorteo solo destaca; el profesor registra la participación
  con el clic normal).
- **Fin de la instancia:** ambos estados temporales se descartan al volver a la lista, al
  volver al panel del curso ("← Curso"), al abrir una participación o al recargar. **Cerrar
  el Proyector no los descarta.**
- **Participación cerrada:** ambos gestos quedan bloqueados (igual que el clic normal).
- **Segunda ventana del Proyector:** sincronización por el canal local existente
  (`BroadcastChannel 'libro_participacion'`), **sin Supabase**: cambios de inhabilitación,
  preselección (solo como dato, **nunca se pinta**) y su consumo/anulación. Una ventana que
  abre la **misma** participación mientras otra la tiene abierta **recibe** el estado
  temporal vigente (así el sorteo del Proyector conoce lo marcado en la otra ventana).

**Pruebas (2026-09-22, navegador local contra Supabase real, sobre una participación
desechable en CUARTO):** 21/21 OK — inhabilitar/rehabilitar (clic simulado y clic real con
teclas); inhabilitado fuera del sorteo y del barajado (40 sorteos, 0 casos); participó fuera
del sorteo (40 sorteos, 0 violaciones); en espera + habilitado dentro; contador sin
inhabilitados; clic normal (fila, casilla, tarjeta) sobre inhabilitado no registra nada;
reflejo en tabla y Proyector; descarte al volver al panel/lista, al reabrir y al recargar;
"Participó" persistido intacto tras recargar (memoria = BD); preselección con clic real
Ctrl+Shift; el sorteo eligió al preseleccionado con presentación normal; sin señal en el
Proyector (tarjeta idéntica); consumo tras un sorteo (los siguientes vuelven al azar);
anulación al inhabilitar y al marcar "Participó"; no se puede preseleccionar a quien ya
participó o está inhabilitado; segunda ventana recibe el estado al abrir, refleja cambios en
vivo y su sorteo usó la preselección hecha en la otra ventana; cerrar el Proyector conserva
el estado; participación cerrada bloquea ambos gestos; guardado normal de la tabla sin
regresión; consola sin errores. Datos de prueba **eliminados** (conteos de
`libro_participaciones`/`libro_participacion_detalle` iguales a los previos: 10/273);
datos reales del profesor intactos.
**Supabase:** **sin cambios** de esquema, tablas, columnas, RLS, triggers ni migraciones.
**Nota de gobernanza:** cambio acotado a `LIBRO/index.html`; sin cambios de `CLAUDE.md` ni
de otros módulos. **No** es una regla general del sistema; es UX provisional en observación
de uso real, a considerar en la reintegración (F6G Libro/alumnos).
**Pendiente de observación (no decidido):** si en uso real conviene que abrir la misma
participación en una ventana nueva **no** herede el estado temporal de otra ventana abierta
(hoy lo hereda para mantener coherente el sorteo del Proyector). Ver "Deudas pendientes", D.
**Estado [ACTUALIZADO 2026-09-23]:** **implementada, verificada y publicada.** Checkpoint
`1dbb227`; publicado con `git push` a `origin/master` (fast-forward `74b0fe6..1dbb227`,
junto con el commit documental `b581c6b`, que es independiente); verificado a nivel Git:
`origin/master` = `1dbb227` y local/remoto sincronizados (0/0). No se registró una
verificación de la página servida por GitHub Pages.

---

### Desarrollo paralelo: Libro de Clases para contextos de Jefatura con población vinculada

**Fecha:** 2026-09-23
**Necesidad profesional que lo origina:** el profesor no podía usar el Libro de Clases en
ORIENTACIÓN ni en ENLACE (contextos de tipo `jefatura`). Para Producto, ser "jefatura" y
usar el Libro son dimensiones **independientes**: ORIENTACIÓN y ENLACE son **asignaturas
distintas dentro de OCTAVO**, deben tener **su propio Libro** (separado entre sí y del Libro
de Música de OCTAVO) y trabajar con **los mismos alumnos de OCTAVO**.
**Ciclo seguido:** auditoría acotada → propuesta técnica → **autorización del PO**
(incl. Supabase) → implementación → SQL ejecutado por el PO en Supabase → pruebas → esta
ficha → checkpoint propio → publicación.
**Nomenclatura:** la asignatura se denomina oficialmente **ENLACES** (así se muestra, vía
la identidad común `supabase/contextos.js`); el nombre técnico del contexto en la BD sigue
siendo `ENLACE` (clave `?ctx`, no se cambia). En esta ficha, "ENLACE" en contexto técnico =
ENLACES. Ver "Deudas pendientes", C.
**Estado [ACTUALIZADO 2026-09-23]:** **implementado, verificado contra Supabase real y
publicado.** Checkpoint **`b81c4bf`**; publicado con `git push` a `origin/master`
(fast-forward `1dbb227..b81c4bf`); verificado a nivel Git: `origin/master` = `b81c4bf`,
local/remoto sincronizados (0/0), commit propio sin squash. El SQL de Supabase ya estaba
ejecutado por el PO antes de la publicación. No se registró una verificación de la página
servida por GitHub Pages. El trabajo del Loop (`tabs/index.html`, `LOOP-LAB/`,
`.claude/launch.json`) quedó **fuera** del commit y del push.

**Causa (auditoría):** tres barreras superpuestas — (1) el Libro solo abría contextos
`curso`/`taller`; (2) triggers de BD exigían `tipo='curso'` (evaluaciones, entregas) o
`curso`/`taller` (participaciones); (3) ORIENTACIÓN/ENLACE no tienen alumnos, y no pueden
tenerlos por matrícula porque la BD admite **una sola matrícula activa por estudiante/año**
(los alumnos ya están en OCTAVO). Convertirlos en `curso` no resolvía el problema.

**Solución adoptada — distinción contexto DUEÑO / contexto de POBLACIÓN:**
- **Contexto dueño de los registros** (sin cambios): evaluaciones, participaciones y
  entregas se guardan con el `contexto_id` del Libro abierto; instrumentos, resultados,
  adecuaciones y grupos cuelgan de la evaluación. Por eso los Libros no se mezclan.
- **Contexto de población** (nuevo): de qué curso salen los alumnos (`libro_matriculas`).
  Por defecto es el propio contexto; si existe un vínculo para ese año, es el curso de
  origen. **No se duplican matrículas.**
- El Libro **ya no depende de que el contexto sea `jefatura`**: se habilita porque el
  contexto tiene una **población válida**, propia (`curso`) o **vinculada** (dato).

**Cambios realizados:**
- **Supabase / `supabase/libro_schema.sql`** (sección nueva "POBLACIÓN VINCULADA", aditiva
  e idempotente, **ejecutada por el PO** en el SQL Editor):
  - tabla `libro_contexto_poblacion (anio_id, contexto_id, poblacion_ctx_id)` — un origen
    por contexto/año; trigger de validez (el origen debe ser `curso`; el vinculado no puede
    ser `curso` ni `taller`); RLS `acceso_total` como el resto del Libro;
  - funciones `libro_ctx_poblacion(ctx, año)` y `libro_ctx_vinculado(ctx, año)`;
  - triggers de contexto de evaluaciones / participaciones / entregas: aceptan además un
    contexto vinculado (todo lo válido antes sigue válido);
  - `libro_eval_cierre_guard` (Etapa 5): busca pendientes en la matrícula de la población
    (sin este ajuste, una evaluación de ORIENTACIÓN se habría podido cerrar con pendientes
    sin error);
  - **datos 2026:** ORIENTACIÓN → OCTAVO, ENLACES (`ENLACE`) → OCTAVO.
  - **Intactos:** `libro_matriculas` y su unicidad, la tabla `contextos` (ORIENTACIÓN/ENLACE
    siguen siendo `jefatura`), talleres, congelamiento, datos existentes.
- **`LIBRO/index.html`:** al abrir, consulta el vínculo del año (si la tabla no existiera,
  sigue sin vínculo: retrocompatible); variables separadas `ctxId` (dueño) / `pobCtxId`
  (población); las condiciones "es curso" pasan a `libroModoCurso()` (curso **o**
  vinculado); **solo** las consultas de alumnos usan `pobCtxId` (crear/abrir/reconciliar
  evaluación, participación, entregas y posiciones); todas las consultas de registros siguen
  en `ctxId`. **Matrícula** en un contexto vinculado muestra "La matrícula se gestiona en
  OCTAVO" y no permite administrar ni crear matrícula. **Presentación:** títulos
  "OCTAVO · Orientación", migas "Orientación · alumnos de Octavo" e informes PDF
  "Curso: OCTAVO · Asignatura: Orientación".
- **Sin cambios:** `PORTAL/index.html` (ya abre cada Libro con su contexto y en su propia
  pestaña), `CLAUDE.md`, otros módulos.

**Pruebas (2026-09-23, navegador local contra Supabase real, datos desechables):** todas OK.
- **ORIENTACIÓN:** abre el Libro completo; toma los **14 alumnos activos de OCTAVO**;
  **0 matrículas propias**; evaluación, participación y entrega propias (con `contexto_id`
  de ORIENTACIÓN); instrumento directo + resultados → nota calculada (4,5); cierre con
  pendientes **bloqueado en UI y en BD**; cierre correcto con "No aplica", **resultados
  congelados** al cerrar, reapertura OK; informes previo y de resultados con
  "Curso: OCTAVO · Asignatura: Orientación"; Matrícula muestra el aviso.
- **ENLACE:** mismas verificaciones esenciales (14 alumnos, registros propios, cierre
  bloqueado en BD, informe, aviso de matrícula).
- **Separación:** ORIENTACIÓN y ENLACE solo ven lo suyo; OCTAVO no ve nada de ninguno
  (panel, listas, archivo); consulta directa por contexto confirma 1 evaluación,
  1 participación y 1 entrega en cada uno, 0 en OCTAVO.
- **Regresión:** OCTAVO igual que antes (sin vínculo, población propia, matrícula normal
  16/14); CUARTO: evaluación (26), cierre bloqueado UI/BD, cierre con "No aplica",
  cabecera congelada, reapertura, participación (26); taller CUERDAS sin cambios;
  **Instrumentos:** evaluación real "LECTURA RÍTMICA EN 6/8" (SEXTO) carga igual
  (36 notas, 1 instrumento, 99 resultados, informe) y sus datos quedaron **idénticos**.
- **Reglas de BD:** contexto sin vínculo (GENERAL) sigue rechazado; matrícula en
  ORIENTACIÓN rechazada; vínculo de un `curso` o hacia un no-`curso` rechazados.
- Consola: sin errores nuevos en un recorrido completo de ORIENTACIÓN (los únicos errores
  registrados fueron las operaciones rechazadas a propósito).
- **Datos:** datos de prueba **eliminados**; 17 conteos de tablas del Libro **idénticos** a
  los previos (p. ej. 233 matrículas, 4 evaluaciones, 151 resultados); quedan solo las 2
  filas de configuración 2026.

**Decisiones de producto adoptadas (PO):** ORIENTACIÓN y ENLACE = asignaturas propias de
OCTAVO con Libro propio y población de OCTAVO; presentación "Curso: OCTAVO · Asignatura:
…"; la matrícula se gestiona solo en OCTAVO; **las plantillas de instrumentos siguen
compartidas** entre todos los Libros del profesor (no se separan por asignatura).

**Configuración actual (dato):** el vínculo 2026 ORIENTACIÓN/ENLACE → OCTAVO es **un dato
administrado hoy directamente en Supabase** (`libro_contexto_poblacion`). Cada año nuevo
requiere su fila; sin ella el contexto vuelve a mostrar el aviso de "no aplica" sin romper
nada. En el futuro deberá gestionarse desde Producto/UI.

**Deudas asociadas (NO resueltas; detalle en "Deudas pendientes identificadas durante el
desarrollo paralelo"):** A — configuración futura de Jefatura; B — deuda conceptual de
`jefatura`; C — nomenclatura "Enlaces".
**Relación con el Bosquejo:** funcionalidad adelantada; tangencias con F6A (Jefatura como
posibilidad futura), F6C (Curso: curso/asignatura/población) y F6G (Libro/alumnos).
**Observaciones para la reintegración:** decidir si la distinción dueño/población y
`libro_contexto_poblacion` se consolidan en `CLAUDE.md`; revisar el concepto `jefatura`;
diseñar la configuración de Jefatura en la UI.

---

### Microiteración de uso real: Informes UTP — cabecera, introducción y tipografía

> Entrada **breve** y **separada**: primera capa de rediseño documental común de los dos
> informes UTP del Libro (Instrumentos de Evaluación, Etapa 7). **No** es una línea nueva
> de desarrollo paralelo ni reabre la Etapa 7.

**Fecha:** 2026-09-23
**Módulo / archivo:** Libro de Clases → Evaluación → informes PDF — `LIBRO/index.html`.
**Necesidad:** los informes funcionaban, pero su aspecto no era el de un documento
institucional sobrio (encabezado con líneas negras y texto grande, subtítulos y datos
innecesarios, tipografía mezclada heredada del Libro, leyenda final).
**Ciclo seguido:** auditoría técnica de los informes (sin cambios) → **decisión del PO**
(especificación de esta microiteración) → implementación → pruebas → esta ficha →
checkpoint propio.
**Decisión de Producto (PO):**
- **Encabezado** (ambos): se conservan logos y composición izquierda/centro/derecha; se
  eliminan las líneas negras; texto institucional a **8px** con menor interlineado.
- **Introducción** (ambos): encabezado → título → **sin subtítulo** → datos → contenido.
  Títulos exactos: **"Instrumento de Evaluación"** (previo) e **"Informe de Resultados"**.
  Datos: **Curso, Asignatura, Evaluación, Fecha, Docente**. Se eliminan **Estado, Año y
  Piso de nota**.
- **Docente:** "Patricio Lastra", provisional y fijo en el código.
- **Asignatura:** con la información que el sistema ya dispone.
- **Leyenda final** "Generado desde el Libro de Clases · …" eliminada, sin reemplazo.
- **Tipografía** de ambos documentos completos: **Arial**; texto común **12px**; título
  en bold y mayor (16px); secciones en bold a 12px.

**Implementación (solo `LIBRO/index.html`, solo presentación de los informes):**
- **Las "dos líneas negras"** eran: (1) el borde inferior de `.rep-head` y (2) un borde
  superior que las celdas de la tabla envolvente (`.rep-table`) heredaban de la regla
  global `th, td` del Libro (una sobre el encabezado y otra justo debajo). Se quitaron
  ambas (`border:0` en esas celdas).
- Estilos `.rep-*`: Arial en todo `#rep-page`; tamaños en pt → 12px (incluye tablas y
  etiquetas de estado); título 16px bold; `.rep-head-txt` 8px, interlineado 1.35 → 1.15.
  Se retiraron los estilos `.rep-sub` y `.rep-foot`, que quedaron sin uso.
- `INFORME_INSTITUCION.docente = 'Patricio Lastra'`.
- Nueva `informeAsignatura()`: un contexto **vinculado** (Orientación, Enlaces) usa su
  nombre visible (`ctxNombreVisible`, ya existente); el resto muestra **"Música"**, la
  asignatura por defecto del sistema (profesor de música; el Libro propio de un curso es
  el de Música). Es la única fuente disponible hoy; no se creó configuración nueva.
- `informeMetaHTML()` rehecha con los 5 datos; títulos cambiados; subtítulos y leyenda
  final retirados; se quitó la variable del piso, que solo alimentaba la introducción.
- **Sin cambios:** cálculos, notas, resultados, instrumentos, estructura de tablas y del
  detalle, márgenes, paginación, Supabase, otros archivos.

**Pruebas (2026-09-23, navegador local contra Supabase real, solo lectura):** evaluación
real "LECTURA RÍTMICA EN 6/8" (SEXTO, 36 estudiantes). Las 16 comprobaciones de la
especificación, OK:
- **Encabezado:** 0 líneas (bordes de `.rep-head` y de las celdas envolventes en 0);
  logos intactos (60px / 57px, misma disposición); texto a 8px con interlineado 9,2px
  (antes 21,6px).
- **Introducción:** títulos exactos, sin subtítulo, con Curso, Asignatura (Música),
  Evaluación, Fecha (2026-09-22) y Docente (Patricio Lastra). Ya no aparecen Estado, Año,
  Piso de nota ni la leyenda final.
- **Tipografía:** una sola familia en todo el documento (Arial); todo el texto común a
  12px; solo el título a 16px/700 y el encabezado a 8px.
- **Contenido evaluativo idéntico:** el texto de objetivos, instrumentos y las 36 fichas
  de resultados es igual carácter por carácter al de la versión anterior (comparado
  contra `HEAD` en el mismo navegador).
- **Asignatura en otros Libros:** ORIENTACIÓN (vinculado) → "Curso: OCTAVO · Asignatura:
  Orientación"; taller CUERDAS → "Música".
- Consola sin errores; ningún dato creado ni modificado.

**Observación (no resuelta, fuera de alcance):** los títulos de columna de las tablas
siguen heredando del Libro las mayúsculas, el gris y el corte con "…"; con 12px el corte
de "Medianamente logrado" / "Logrado con distinción" en la rúbrica sigue visible. Estaba
diagnosticado en la auditoría previa y queda para una próxima capa del rediseño, con
decisión del PO.
**Deudas registradas:** E — Docente configurable; F — Asignatura configurable (ver
"Deudas pendientes").
**Estado [ACTUALIZADO 2026-09-23]:** **CERRADA — aprobada por el PO y publicada.**
- **Aprobación del PO:** implementación aprobada tal como quedó, incluida la regla
  **provisional** de Asignatura: ORIENTACIÓN → "Orientación"; ENLACE → "Enlaces"; demás
  cursos y talleres → "Música". Sigue siendo provisional (deuda F); no se implementa
  ninguna configuración ahora.
- **Deudas vigentes:** E — Docente configurable; F — Asignatura configurable.
- **Checkpoint de implementación:** `a723b8a` (implementación + ficha); `af91c67` anota el
  checkpoint en la ficha.
- **Publicación:** `git push` fast-forward `5d8cb14..af91c67` a `origin/master`; verificado a
  nivel Git: `origin/master` = `af91c67` y local/remoto sincronizados (0/0). El cierre
  documental (esta actualización) se publica en un commit posterior. No se registró una
  verificación de la página servida por GitHub Pages.
- El trabajo del Loop (`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`) quedó
  **fuera** de los commits y del push.
**Nota de gobernanza:** cambio acotado a `LIBRO/index.html`; sin cambios de Supabase ni de
`CLAUDE.md` (son decisiones provisionales, no reglas permanentes).

---

### Microiteración de uso real: Informes UTP — ajuste de encabezado e introducción

> Entrada **breve** y **separada**: segunda capa de ajuste visual fino de los dos informes
> UTP del Libro, **independiente** de la microiteración anterior (cabecera, introducción y
> tipografía, `a723b8a`, ya cerrada). **No** reabre la Etapa 7.

**Fecha:** 2026-09-23
**Módulo / archivo:** Libro de Clases → Evaluación → informes PDF — `LIBRO/index.html`.
**Necesidad:** tras la primera capa, el PO observó que el bloque institucional quedaba
corrido hacia la derecha, que sobraba espacio entre el encabezado y el título, que el curso
salía con el nombre técnico en mayúsculas ("SEXTO"), que la fecha salía en formato
`YYYY-MM-DD` y que los tamaños tipográficos debían ajustarse.
**Ciclo seguido:** auditoría del encabezado, espaciado, curso y fecha (medición en el
navegador) → **decisión del PO** → implementación → pruebas → revisión y **aprobación del
PO** → esta ficha → checkpoint propio → publicación.
**Decisiones de Producto (PO):**
- **Encabezado:** los tres elementos (logo SLEP, texto institucional, logo de la escuela)
  con el **mismo centro vertical**; texto institucional **centrado horizontalmente**; logos
  sin cambios de posición ni tamaño; sin líneas.
- **Separación:** reducir claramente el espacio entre encabezado y título, sin eliminarlo.
- **Curso:** nombre con capitalización normal ("Sexto", "Séptimo"…), usando la fuente que ya
  tiene el sistema; solo presentación, sin tocar el nombre técnico.
- **Fecha:** `DD/MM/YYYY`, sin nombres de meses.
- **Tipografía** (reemplaza la de la microiteración anterior): encabezado Arial **10px**;
  texto normal Arial **13px**; secciones Arial 13px bold; título Arial 16px bold.

**Auditoría (qué producía cada problema):**
- **Desplazamiento horizontal:** el texto ocupaba con `flex:1` el espacio entre logos de
  anchos distintos (SLEP 104px, escuela 42px), por lo que su centro quedaba **31px a la
  derecha** del centro de la hoja.
- **Alineación vertical:** en pantalla ya coincidían los centros de las cajas (126,1px) y
  de la tinta de los logos (diferencia < 0,5px); se reforzó con la nueva grilla.
- **Espacio encabezado→título:** padding superior del cuerpo (6mm) + margen superior del
  título (5mm), ~57px entre el borde inferior de los logos y el título.
- **Curso:** se imprimía `ctxNombre` / `pobCtxNombre` (nombre técnico en mayúsculas).
- **Fecha:** se imprimía `evalActual.fecha` tal como está guardada.

**Implementación (solo `LIBRO/index.html`, solo presentación de los informes):**
- `.rep-head` pasa de flex a **grilla `1fr auto 1fr`** con `align-items:center`; logo
  izquierdo `justify-self:start`, derecho `justify-self:end` (mismas posiciones y tamaños).
- `.rep-title` margen superior 5mm → 0; `.rep-body` padding superior 6mm → 3mm.
- **Curso:** `ctxNombreVisible(...)` de la identidad común `supabase/contextos.js` (ya
  existente), aplicado al contexto propio o al de población en los Libros vinculados.
- **Fecha:** nueva `informeFecha()` que solo formatea para el informe (`YYYY-MM-DD` →
  `DD/MM/YYYY`; sin fecha → "—").
- **Tipografía:** `.rep-head-txt` 8px → 10px; texto común de los informes 12px → 13px
  (incluye tablas y etiquetas); título 16px bold sin cambios.
- **Sin cambios:** cálculos, notas, resultados, instrumentos, estructura de tablas y del
  detalle, asignatura, docente, Supabase, otros archivos.

**Pruebas (2026-09-23, navegador local contra Supabase real, solo lectura):** evaluación
real "LECTURA RÍTMICA EN 6/8" (SEXTO), en ambos informes; las 14 comprobaciones pedidas,
OK.
- **Encabezado:**
  - Centros verticales: SLEP 126,11 / texto 126,10 / escuela 126,11 px.
  - Texto centrado en la hoja: 408px, igual al centro de la hoja; antes estaba 31px a la
    derecha.
  - Logos en la misma posición (52,9px / 763,1px) y con el mismo alto (60,5px / 56,7px).
- **Espacio encabezado→título:** 26,5px (antes ~57px).
- **Curso y fecha:**
  - Curso "Sexto"; la misma lógica verificada para Primero…Octavo y para los talleres.
  - ORIENTACIÓN muestra "Curso: Octavo · Asignatura: Orientación".
  - Fecha "22/09/2026".
- **Tipografía:** solo Arial; encabezado 10px, texto 13px, título 16px/700.
- **Se mantienen** los cambios de la microiteración anterior (sin líneas, sin subtítulo,
  los 5 datos, sin Estado/Año/Piso, sin leyenda final).
- **Datos evaluativos idénticos:** el contenido es igual carácter por carácter a la versión
  publicada, comparado en el mismo navegador.
- Consola sin errores; ningún dato creado ni modificado.
- Revisión visual en el navegador de ambos informes.

**Fuera de alcance (NO resuelto):** los títulos de columna de las tablas siguen heredando
del Libro las mayúsculas, el gris y el **corte con "…"**; con 13px el corte en la rúbrica
es algo mayor ("MEDIANAMENTE LO…", "LOGRADO CON DIST…"). Queda pendiente para una próxima
iteración, con decisión del PO. Tampoco se tocaron las deudas E (docente) y F (asignatura).
**Aprobación del PO:** implementación revisada y **aprobada** (2026-09-23).
**Estado [ACTUALIZADO 2026-09-23]:** **CERRADA / PUBLICADA.**
- **Checkpoint:** `af081eb` (implementación + ficha).
- **Publicación:** `git push` fast-forward `374fd38..af081eb` a `origin/master`; verificado a
  nivel Git: `origin/master` = `af081eb` y local/remoto sincronizados (0/0). Este cierre
  documental se publica en un commit posterior. No se registró una verificación de la
  página servida por GitHub Pages.
- El trabajo del Loop (`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`) quedó
  **fuera** de los commits y del push.
**Nota de gobernanza:** cambio acotado a `LIBRO/index.html`; sin cambios de Supabase ni de
`CLAUDE.md`.

---

### Informe UTP previo — cuatro microiteraciones consolidadas (2026-09-23)

> Cuatro microiteraciones **sucesivas** sobre el **Informe Previo** ("Instrumento de
> Evaluación") del Libro, cada una con su propio ciclo: especificación del PO → auditoría →
> implementación → pruebas → revisión del PO.
> **Checkpoints:** ninguna tuvo commit propio. Se trabajaron una tras otra sobre el mismo
> archivo **sin commit intermedio**, así que **no existen checkpoints Git individuales** y
> no se inventan. Las cuatro quedan **consolidadas en un único checkpoint final** (ver
> "Cierre de las cuatro" al final de esta sección), por orden del PO.
> **Alcance común:** solo `LIBRO/index.html` (función `abrirInformePrevio`, función
> `instrEstructuraInforme` y estilos `.rep-*` del informe). Sin cambios de Supabase, datos,
> lógica de evaluación, cálculo de notas ni `CLAUDE.md`.
> **Pruebas comunes:** navegador local contra Supabase real, **solo lectura**, sobre la
> evaluación real "Lectura rítmica en 6/8" (SEXTO). El contenido de las tablas y el texto del
> Informe de Resultados se compararon **carácter por carácter** contra la versión publicada
> (`HEAD`) en el mismo navegador. Consola sin errores. Ningún dato creado ni modificado.

#### Microiteración 1 — Orden objetivo → instrumento

**Necesidad:** en el informe previo aparecían primero todos los objetivos (OA y
adecuaciones) y después todos los instrumentos juntos, y costaba saber qué instrumento
evaluaba qué.
**Decisión de Producto (PO):**
- Secuencia **OBJETIVO → INSTRUMENTO**: OA original → su instrumento → cada adecuación →
  su instrumento.
- "Objetivo de aprendizaje: [OA]" en una sola línea.
- Título del instrumento "Rúbrica de X criterio(s)" / "Lista de cotejo de X criterio(s)",
  con singular/plural según la cantidad real.
- Conservar la relación real de los datos; no rediseñar las tablas.

**Auditoría:** la relación ya era **explícita** en los datos. El OA usa
`evalActual.instrumento_id` y cada adecuación su `instrumento_id`; hay un OA por evaluación.
Se pudo reordenar sin tocar datos.
**Implementación:**
- `abrirInformePrevio` rehecha: por cada objetivo, su línea y luego su instrumento.
- Si dos objetivos comparten instrumento, este se muestra completo tras cada uno (antes se
  mostraba una sola vez).
- Adecuaciones como "Adecuación:" sin número, según el ejemplo del PO.
- Sin instrumento: se conservan los textos previos ("Sin instrumento (evaluación
  tradicional)." / "Sin instrumento.").
- Se retiraron los títulos de sección "Objetivo de Aprendizaje y adecuaciones" y
  "Estructura completa de los instrumentos".
- Nuevo estilo `.rep-instr-tit`.

**Pruebas:**
- SEXTO real: OA con rúbrica y 2 adecuaciones sin instrumento.
- TERCERO real: OA con rúbrica, sin adecuaciones.
- PRIMERO real: sin instrumentos, 3 adecuaciones.
- **Casos simulados solo en la memoria de la página** (sin guardar nada, datos restaurados
  al terminar), porque los datos reales no los tienen:
  - listas de cotejo de 1 y de 2 criterios;
  - rúbrica compartida entre objetivos;
  - rúbrica de 1 criterio.
- Resultado: orden, relación y singular/plural correctos; Informe de Resultados sin
  cambios.

**Estado:** implementada, aprobada, **consolidada en el checkpoint final**.

#### Microiteración 2 — Limpieza visual de rúbricas

**Necesidad:** dentro de cada rúbrica se repetía una línea "nombre · Rúbrica · N criterios"
y todo iba dentro de un gran marco; además, el título de cada criterio quedaba pegado a la
tabla anterior.
**Decisión de Producto (PO):**
- Eliminar esa línea redundante y el **marco contenedor general** de la rúbrica.
- Conservar los bordes de cada tabla de criterio.
- Más espacio antes de cada criterio y menos entre el criterio y su tabla.
- Listas de cotejo sin cambios internos.

**Implementación:**
- `instrEstructuraInforme` devuelve la rúbrica en un contenedor sin borde (`.rep-rub`), sin
  la línea `in-nom`.
- Espaciado de criterios en `.rep-rub .rep-crit`, que además no queda separado de su tabla
  en un salto de página.
- Las listas de cotejo conservan su marco y su línea interior.

**Pruebas (SEXTO):**
- Línea y marco eliminados; bordes de tabla intactos.
- Criterios "1. Lectura rítmica", "2. Pulso" y "3. Coordinación" presentes.
- Espacio antes de cada criterio: 18,9px (antes 0); criterio→tabla: 3,8px (antes ~11px).
- Tablas idénticas; Resultados sin cambios.

**Observación:** con la línea eliminada, el nombre propio del instrumento (p. ej. "Lectura
rítmica en 6/8") ya no aparece en el informe previo.
**Estado:** implementada, aprobada, **consolidada en el checkpoint final**.

#### Microiteración 3 — Ajuste de espaciados y encabezados de nivel

**Necesidad:** había demasiado aire en el bloque de datos inicial, entre cada adecuación y
su información y entre criterio y tabla; además, los nombres de nivel salían cortados con
"…" ("MEDIANAMENTE LOG…", "LOGRADO CON DISTI…").
**Decisión de Producto (PO):**
- Bloque de datos compacto, con las dos columnas.
- Cada objetivo junto a su información.
- Criterio pegado a su tabla.
- Nombres de nivel **siempre completos**, con salto de línea dentro de la celda si hace
  falta, sin "…" ni abreviar.

**Auditoría:**
- Datos: 2mm entre filas + interlineado 1,45 heredado del Libro.
- El corte con "…" venía de la regla global `th, td` (`overflow:hidden;
  text-overflow:ellipsis`) más `white-space:nowrap` en `.rep-niv th`.

**Implementación:**
- `.rep-meta` con 0,5mm entre filas e interlineado 1,3.
- Bloque `.rep-blq` que agrupa cada objetivo con su instrumento.
- Criterio→tabla a 0,5mm.
- `.rep-niv th` con `white-space:normal; overflow:visible; text-overflow:clip`.

**Pruebas (SEXTO):**
- Filas de datos a 1,9px (antes ~7,5px).
- Adecuación→información a 1,9px; entre bloques 15,1px.
- Criterio→tabla a 1,9px; entre criterios 18,9px.
- Los cuatro niveles completos, con salto de línea en "MEDIANAMENTE / LOGRADO (2)" y
  "LOGRADO CON / DISTINCIÓN (4)".
- Tablas idénticas; texto de Resultados sin cambios.

**Observación:** `.rep-meta` es el **bloque de datos común a ambos informes**, por lo que
su interlineado compacto se aplica también a la introducción del **Informe de Resultados**.
El texto de ese informe no cambia; su bloque de datos solo se ve más compacto.
**Estado:** implementada, aprobada, **consolidada en el checkpoint final**.

#### Microiteración 4 — Ajuste final: adecuaciones, centrado vertical y jerarquía

**Necesidad:**
- "Adecuación: …" y "Sin instrumento." aún se veían separadas.
- Los nombres de nivel de una línea quedaban pegados arriba de su celda.
- Sobraba espacio entre "Rúbrica de X criterios" y el primer criterio, y faltaba entre el
  OA y ese título.

**Decisión de Producto (PO):**
- Espaciado normal dentro de cada adecuación.
- **Centrado vertical real** (por CSS) de los cuatro nombres de nivel, con un centro común.
- Jerarquía espacial: cada encabezado más cerca de lo que introduce que de lo anterior.

**Auditoría:**
- La fila de encabezados toma la altura del nombre de dos líneas.
- Todas las celdas tenían `vertical-align:top` por la regla compartida
  `.rep-niv td,.rep-niv th`.
- OA→título estaba a 0,5mm y título→primer criterio a 2mm.

**Implementación:**
- `.rep-blq > .rep-obj` sin margen, con interlineado 1,25.
- `.rep-blq > .rep-instr-tit` con margen 3mm arriba y 1mm abajo.
- `.rep-niv th` con `vertical-align:middle`.

**Pruebas (SEXTO):**
- Adecuación→"Sin instrumento.": 1,3px entre textos.
- Entre adecuaciones: 15,1px.
- OA→título del instrumento: 11,3px.
- Título→primer criterio: 3,8px.
- Criterio→tabla: 1,9px.
- Entre criterios: 18,9px.
- Los cuatro niveles con el mismo centro vertical (1px de diferencia, que corresponde al
  borde de la celda).
- Tablas idénticas; Resultados sin cambios.

**Estado:** implementada, aprobada, **consolidada en el checkpoint final**.

#### Cierre de las cuatro microiteraciones

**Aprobación del PO:** estado actual del Informe Previo **aprobado** (2026-09-23), con
orden de consolidar, documentar, publicar y cerrar.
**Estado [ACTUALIZADO 2026-09-23]:** las cuatro microiteraciones quedan **IMPLEMENTADAS /
PUBLICADAS / CERRADAS**.
- **Checkpoint de consolidación:** `01cd292` ("Libro: informe UTP previo — cierre del
  desarrollo hasta este punto"), único checkpoint de las cuatro; no hay checkpoints
  individuales.
- **Publicación:** `git push` fast-forward `21c4527..01cd292` a `origin/master`; verificado
  a nivel Git: `origin/master` = `01cd292` y local/remoto sincronizados (0/0). Este cierre
  documental se publica en un commit posterior. No se registró una verificación de la
  página servida por GitHub Pages.
**Pendientes derivados (NO resueltos):** deudas G (rúbricas de adecuaciones), H (listas de
cotejo en el Informe Previo) e I (información del Informe de Resultados). Ver "Deudas
pendientes".
**Nota de gobernanza:** sin cambios de Supabase ni de `CLAUDE.md`. El trabajo del Loop
(`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`) queda **fuera**.

---

### Desarrollo paralelo: Observación general de la evaluación (Libro de Clases)

**Fecha:** 2026-09-23
**Necesidad profesional que lo origina:** el profesor necesita registrar, para cada
evaluación completa, una **apreciación general del proceso evaluativo**, distinta de las
notas y de los comentarios por estudiante.
**Ciclo seguido:** auditoría técnica (solo lectura) → **decisión y autorización del PO**
(incluido el cambio de esquema en Supabase) → implementación → SQL ejecutado por el PO →
pruebas contra Supabase real → esta ficha → checkpoint propio.

**Decisiones de producto (PO):**
- Pertenece a una evaluación completa y es independiente de notas, comentarios
  individuales, grupos, OA e instrumentos.
- Tarjeta propia titulada **"Observación general"**, **al final** de la evaluación
  (después de Estudiantes). Se muestra **siempre**, incluso vacía y con la evaluación
  cerrada.
- Texto libre, multilínea, sin límite práctico; conserva los saltos de línea.
- **Guardado:** automático al salir del campo **y** con el botón **"Guardar observación"**.
- **Al cerrar** con cambios sin guardar, se guarda automáticamente antes de cerrar.
- **Cerrada:** congelada; campo y botón deshabilitados; la **base de datos también
  rechaza** modificarla. **Reabierta:** vuelve a ser editable y conserva el contenido.
- **No** aparece en el Informe Previo ni en el Informe de Resultados.

**Solución técnica:**
- **Supabase — `supabase/libro_schema.sql`** (sección nueva "OBSERVACIÓN GENERAL DE LA
  EVALUACIÓN", aditiva e idempotente, **ejecutada por el PO** en el SQL Editor):
  - columna `libro_evaluaciones.observacion_general TEXT NOT NULL DEFAULT ''`; las
    evaluaciones existentes quedan vacías;
  - redefinición de `libro_eval_bloqueo_cerrada()` con los mismos campos protegidos de la
    Etapa 5 **más `observacion_general`**. El trigger existente sigue apuntando a ella.
  - No se tocaron otras reglas, triggers ni tablas. La política RLS `acceso_total` ya cubre
    la columna.
- **`LIBRO/index.html`:**
  - tarjeta nueva al final de `renderDetalle()`;
  - funciones `obsGen*`: borrador `obsGenBorrador` que sobrevive a los redibujados,
    guardado al salir del campo y con el botón, y guardados en cola, uno detrás de otro;
  - `cerrarEval()` guarda la observación antes de cerrar. Si no logra guardarla, **no
    cierra** y avisa.
  - Si la columna no existiera en Supabase, la tarjeta se muestra deshabilitada con un aviso
    y el Libro sigue funcionando.
  - La lectura no cambió: `abrirDetalle` ya trae toda la fila de la evaluación.
  - Los informes no se tocaron.

**Comportamiento abierto / cerrado / reabierto:** editable → congelada en pantalla y en la
base de datos → editable conservando el texto.

**Pruebas (2026-09-23, navegador local contra Supabase real):**
- **Datos de prueba:** una evaluación desechable en CUARTO (26 estudiantes) y otra en cada
  Libro vinculado (ORIENTACIÓN y ENLACE). Las 24 comprobaciones pedidas, OK.
- **Escritura y guardado:**
  - escribir con teclado real, con salto de línea;
  - guardar con el botón;
  - **guardado automático al salir del campo** (clic real fuera);
  - persistencia tras recargar;
  - multilínea (los `\n` se conservan);
  - texto largo: 20.691 caracteres y 200 líneas, idéntico en la base y tras recargar.
- **Redibujados:** el texto sin guardar **sobrevive** a `refrescarDetalle()`, al cambio de
  orden de estudiantes, a la creación de un grupo y a la creación/asociación de un
  instrumento. Mientras tanto, la base conserva lo último guardado.
- **Cierre:**
  - cerrar con la observación modificada (sin salir del campo) → se guardó y luego cerró;
  - cerrada: campo y botón deshabilitados;
  - **la base rechaza** modificar y vaciar la observación de una evaluación cerrada (error
    I12); los demás campos siguen congelados;
  - reabrir → editable y conserva el texto; se editó y se guardó de nuevo;
  - cerrada y vacía → tarjeta visible y vacía.
- **Archivo:** la evaluación cerrada abierta desde Archivo muestra la observación en solo
  lectura.
- **Informes:** la observación no aparece en ninguno. En la evaluación real "Lectura
  rítmica en 6/8" ambos informes salen **idénticos en su HTML completo** a la versión
  publicada.
- **Regresión:**
  - nota puesta desde la tabla + "Guardar notas";
  - grupo creado (1 grupo, 2 integrantes en la base);
  - instrumento directo creado y asociado al OA;
  - **cierre con pendientes** bloqueado en pantalla (26 pendientes) y en la base; la
    observación se guardó igual antes del intento;
  - reapertura;
  - ORIENTACIÓN y ENLACE: 14 alumnos de OCTAVO cada uno, evaluación en su propio contexto,
    observación guardada;
  - la evaluación real de SEXTO carga igual (36 estudiantes, 1 instrumento, 99 resultados).
- **Consola:** un recorrido normal completo (abrir, reabrir, editar, guardar, redibujar,
  informes, cerrar) no produjo errores. Los 400 registrados corresponden a la fase de
  rechazos provocados a propósito: el guard de cierre en la base y los intentos sobre la
  evaluación cerrada. Uno de los cinco no se pudo atribuir con certeza porque la consola no
  guarda la dirección de cada petición; no se repitió en el recorrido normal.
- **Datos:** las 3 evaluaciones de prueba se **eliminaron**. Los 11 conteos de tablas del
  Libro quedaron **idénticos** a los previos (p. ej. 4 evaluaciones, 123 notas,
  151 resultados, 233 matrículas), y las 4 evaluaciones reales quedaron **idénticas campo
  por campo**, con `observacion_general` vacía.
- **Límite de la herramienta:** con el navegador de pruebas sin foco no se dispara el evento
  de salida del campo. El guardado automático se verificó con clic real y el panel
  enfocado; en los pasos sin foco se usó el botón o el cierre.
- **Observado, sin cambio:** al asociar al OA un instrumento incompleto, el Libro recalcula
  la nota desde el instrumento (comportamiento vigente de la Etapa 4), por lo que la nota
  manual de prueba quedó vacía. No es una regresión.

**Estado [ACTUALIZADO 2026-09-23]:** **CERRADO Y PUBLICADO.** Implementado y verificado
contra Supabase real.
- **Checkpoint:** `8fb5b90` (implementación + SQL + esta ficha).
- **Publicación:** `git push` fast-forward `29f5f09..8fb5b90` a `origin/master`; verificado a
  nivel Git: `origin/master` = `8fb5b90` y local/remoto sincronizados (0/0). Esta
  actualización documental se publica en un commit posterior. No se registró una
  verificación de la página servida por GitHub Pages.
**Deudas / pendientes:**
- Si el profesor recarga o cierra la pestaña **sin salir antes del campo**, lo escrito desde
  el último guardado se pierde (no hay aviso al salir de la página). El PO pidió evitar un
  sistema de borradores complejo.
- `CLAUDE.md` no se modificó. **Pendiente para la reintegración (antes de F6B):** registrar
  que `libro_evaluaciones` tiene
  una columna nueva protegida por I12.

**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6H**
(Evaluaciones/UTP) y **F6G** (Libro).
**Nota de gobernanza:** archivos `LIBRO/index.html`, `supabase/libro_schema.sql` y esta
ficha. El trabajo del Loop (`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`) quedó
**fuera**.

---

## Deudas pendientes identificadas durante el desarrollo paralelo

> Registro **agrupado** de las deudas que quedaron **explícitamente identificadas** en los
> desarrollos del período paralelo. **Ninguna está resuelta.** Cada una se aborda en una
> iteración futura o en la reintegración, **con decisión del PO**. No reemplaza a las
> "Deudas futuras" ya listadas dentro de la ficha de Instrumentos de Evaluación.

### A. Configuración futura de Jefatura
*Origen: Libro de Clases para contextos de Jefatura (`b81c4bf`).*
- **Hoy:** las relaciones de población (2026: ORIENTACIÓN → OCTAVO, ENLACES → OCTAVO) se
  cargan como **datos** en Supabase (`libro_contexto_poblacion`).
- **No es un hardcode en el código:** la relación ya está expresada como dato por año; el
  Libro no conoce nombres de contextos. La deuda es hacer esa configuración
  **administrable desde Producto/UI**.
- **Deuda futura:** configuración desde la interfaz — ¿soy profesor jefe? (Sí/No) → ¿de qué
  curso? → ¿qué asignaturas/contextos complementarios corresponden a esa jefatura? — y, a
  partir de ello, generar/administrar las filas de población vinculada, evitando que cada
  año se requiera configuración manual directa en Supabase.
- **Fuera de alcance por ahora:** interfaz de Jefatura, perfil docente, creación automática
  de contextos, cambios generales al modelo de contextos.

### B. Deuda conceptual de "jefatura"
*Origen: auditoría del Libro para contextos de Jefatura.*
- Hoy `jefatura` (tipo de contexto) mezcla: **rol del profesor** (ser profesor jefe),
  **asignatura/contexto** (Orientación, Enlaces) y **relación con un curso** (OCTAVO; además
  cableada en el Portal como `esOctavo`).
- La implementación actual **no la profundiza**: el Libro funciona por tener población
  (propia o vinculada), no por ser de tipo `jefatura`.
- **Pendiente:** determinar cómo encaja Jefatura en el modelo V1, considerando lo ya
  señalado en F6A ("Jefatura" no es opción de tipo en V1.0; posible área funcional futura).
  **No se resuelve ahora.**

### C. Nomenclatura "Enlaces"
*Origen: presentación del Libro de ENLACES.*
- La asignatura se denomina oficialmente **Enlaces**. El nombre visible lo determina la
  identidad común del ecosistema, `supabase/contextos.js` (etiqueta "Enlaces"); el nombre
  técnico del contexto en la BD es `ENLACE` (clave de `?ctx`, que por regla no se cambia).
- **Pendiente:** revisar la nomenclatura de forma **global** en una iteración futura. **No
  se modifica ahora** el archivo compartido.

### D. Participación — herencia de estado temporal entre ventanas
*Origen: microiteración de Participación (`1dbb227`).*
- **Hoy:** si una segunda ventana abre la misma participación mientras otra la tiene
  abierta, **hereda** su estado temporal (inhabilitados y preselección), para que el sorteo
  del Proyector sea coherente con lo marcado en la otra ventana.
- **Pendiente (observación de uso real):** evaluar si conviene que **no** lo herede. **No se
  cambia ahora.**

### E. Docente configurable
*Origen: microiteración de informes UTP (cabecera, introducción y tipografía).*
- **Hoy:** el campo "Docente" de ambos informes UTP muestra "Patricio Lastra", **fijo en el
  código** (`INFORME_INSTITUCION.docente` en `LIBRO/index.html`).
- **Deuda futura:** el nombre del docente deberá ser **configurable** y no depender de un
  valor fijo (se relaciona con la identidad del profesor de F6A y con cuentas/F6K).
- **No se implementa ahora.**

### F. Asignatura configurable
*Origen: microiteración de informes UTP (cabecera, introducción y tipografía).*
- **Hoy:** la asignatura de los informes sale de lo que el sistema ya sabe: un contexto
  **vinculado** usa su nombre visible (Orientación, Enlaces); todo otro contexto muestra
  **"Música"** (`informeAsignatura()` en `LIBRO/index.html`). Regla **aprobada por el PO
  como provisional** (2026-09-23).
- **Deuda futura:** un mecanismo **formal y configurable** para saber qué asignatura
  corresponde a cada contexto (p. ej. Música, Enlaces, Literatura…). Se relaciona con la
  deuda B (jefatura), la C (nomenclatura "Enlaces") y la asignatura por defecto de F6A.
- **No se resuelve en esta microiteración.**

### G. Informe Previo — rúbricas de adecuaciones
*Origen: microiteraciones del Informe UTP previo (2026-09-23).*
- **PENDIENTE:** revisar específicamente cómo se muestran las **rúbricas asociadas a las
  adecuaciones**.
  - En los datos reales actuales ninguna adecuación tiene instrumento; solo se probó con
    casos simulados en memoria.
  - Si una adecuación usa el mismo instrumento que el OA, este se repite completo.
- **No resuelto.**

### H. Informe Previo — listas de cotejo
*Origen: microiteraciones del Informe UTP previo (2026-09-23).*
- **PENDIENTE:** revisar y definir la **presentación visual de las listas de cotejo** en el
  Informe Previo.
- Hoy conservan el marco y la línea interior "nombre · Lista de cotejo · N ítems" (que dice
  "1 ítems" con un solo ítem). Su título dice "criterios", pero adentro se habla de "ítems".
- **No resuelto.**

### I. Informe de Resultados — información y estructura
*Origen: auditoría de los informes UTP y microiteraciones del Informe Previo (2026-09-23).*
- **PENDIENTE:** definir y modificar qué información presenta el **Informe de Resultados**
  y cómo la estructura.
- Temas señalados en la auditoría:
  - ficha por estudiante que repite el OA completo;
  - largo del documento (~9 páginas para 36 estudiantes);
  - falta de resumen o estadísticas;
  - títulos de columna en mayúscula gris heredados del Libro.
- **No resuelto.**
