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

> **SUSPENDIDA desde 2026-10-04 (marcha blanca, DECISIÓN del PO).** Se trabaja solo
> Pato + Claude con Notion como canal; lo que hacía ChatGPT en el ciclo lo cubre Claude y
> decide el PO. Lo de abajo se conserva por si se vuelve al esquema anterior. Ver
> `CLAUDE.md` §11.

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

### Microiteración de uso real: Workspace — cierre con clic central + retiro del badge "Demo"

> Entrada **breve** y **separada**: microiteración de UX sobre un módulo activo (Workspace
> PC), surgida en uso real. **No** redefine la política general de pestañas (que sigue
> pendiente de observación, ver la microiteración "cierre de pestaña → Dashboard").

**Fecha:** 2026-09-23
**Módulo / archivo:** Workspace PC — `PC/workspace.html` (única modificación).
**Necesidad observada:**
1. Cerrar las pestañas cerrables con **clic central** del mouse, como en los navegadores.
2. Quitar el badge visual **"Demo"** que aparecía junto a las pestañas.

**Ciclo seguido:** auditoría técnica (solo lectura) → **decisión y autorización del PO** →
implementación → pruebas → esta ficha → checkpoint propio.

**Decisiones de producto (PO):**
- **Clic central sobre una pestaña cerrable → cerrarla**, reutilizando `cerrarTab(key)`.
  - Dashboard y Repertorio (fijas): el clic central no hace nada y no muestra aviso.
  - La ✕, el clic normal, el guardado previo de los Planes y la elección de la pestaña que
    queda activa (incluida la regla que activa Dashboard cuando solo quedan las fijas)
    **no cambian**.
  - Una pestaña inactiva se cierra **sin activarse** antes.
  - Evitar el desplazamiento automático del botón central de Windows.
- **Retirar el badge "Demo"** por completo, sin reemplazo y sin otros cambios visuales.

**Auditoría técnica (resumen):**
- Las pestañas nacen en un único punto, `abrirInstancia()`, con la marca `fijo`. Solo
  Dashboard y Repertorio son fijas; las que se abren desde las apps nunca lo son.
- `cerrarTab()` ya ignora las fijas.
- El clic central no dispara `click` (no activa la pestaña), sino `auxclick`.
- No existen arrastrar y soltar ni otros manejadores del mouse en las pestañas.
- Ningún otro archivo participa.

**Implementación:**
- **Cambio 1:** en `abrirInstancia()`, **solo para pestañas no fijas**:
  - `auxclick` con `button === 1` llama a `cerrarTab(key)`;
  - `mousedown` con `button === 1` hace `preventDefault()`, para evitar el desplazamiento
    automático.
  - Las fijas no reciben estos manejadores, y además `cerrarTab()` las ignora (doble
    protección).
- **Cambio 2:** eliminado el `<span class="demo-badge">Demo</span>` de la barra y su estilo
  `.demo-badge`, que quedó sin uso.
- **No tocado:** el título de la pestaña del navegador ("Workspace (demo) — PROFE") y los
  comentarios internos que dicen "demo". No forman parte del badge visual; queda anotado
  por si el PO quiere revisarlos.

**Pruebas (2026-09-23, navegador local):**
- **Método:** el panel de pruebas no puede hacer un clic central físico, así que se
  enviaron a las pestañas los mismos eventos que genera el mouse (`mousedown` / `mouseup`
  / `auxclick` con el botón central).
- **Resultado de las 13 comprobaciones:**
  1. Central sobre la pestaña cerrable activa → cierra. Si solo quedan las fijas, activa
     Dashboard; con otra adicional a la derecha, activa la vecina (lógica existente).
  2. Central sobre una cerrable **inactiva** → cierra y la activa no cambia.
  3–4. Central sobre Dashboard y sobre Repertorio → no pasa nada; en ellas tampoco se
     bloquea el comportamiento del botón central.
  5. Plan: pestaña con guardado previo (`guardarAlCerrar`) sobre una página vacía,
     registrando cada pedido de guardado:
     - el clic central **pide el mismo guardado previo que la ✕** y cierra;
     - si el guardado **falla**, ni el clic central ni la ✕ cierran, y muestran el mismo
       aviso.
     - No se usó un Plan real, porque su cierre escribe en Supabase y editarlo alteraría
       datos del profesor.
  6. La ✕ funciona igual en pestañas activas e inactivas.
  7. El clic normal sigue activando pestañas.
  8. Desplazamiento automático: el `mousedown` central sobre las pestañas cerrables queda
     bloqueado. El efecto visual del desplazamiento de Windows no se pudo observar con
     eventos simulados.
  9. Central sobre el ícono, el título y la zona de la ✕ → cierra.
  10. El badge "Demo" no aparece; la barra muestra solo "📅 Dashboard · 🎵 Repertorio · +",
      y el estilo `.demo-badge` ya no existe.
  11. Recorrido abriendo Entrenador, Metalófono y 3 Planes, cerrándolos con central y ✕
      mezclados: resultados coherentes y sin marcos de contenido sobrantes (2 al final).
  12. Consola sin errores.
  13. El diff contiene solo los dos cambios.

**Guardado previo de los Planes (aclaración):** `cerrarTab()` pide el guardado a toda
pestaña con `guardarAlCerrar` (los Planes) **sin importar si está activa o inactiva**. Una
pestaña inactiva solo está oculta y su Plan sigue vivo, así que puede responder el pedido de
guardado. Si el Plan no responde en 4 s, se cierra igual (tolerancia existente). Las demás
apps (Entrenador, Metalófono) no tienen ese paso y se cierran directo, igual que con la ✕.
Nada de esto cambió en esta microiteración.
**Validación física con mouse:** el PO informó (2026-09-23) que **realizó la validación
física pendiente** y autorizó la publicación. No se registraron más detalles de esa prueba.
**Título del navegador:** "Workspace (demo) — PROFE" **no se modificó**; no formaba parte
de esta microiteración.
**Estado [ACTUALIZADO 2026-09-23]:** **CERRADA Y PUBLICADA.**
- **Checkpoint:** `78f04d5` (implementación + ficha).
- **Publicación:** `git push` fast-forward `35de1fd..78f04d5` a `origin/master`; verificado a
  nivel Git: `origin/master` = `78f04d5` y local/remoto sincronizados (0/0). Esta
  actualización documental se publica en un commit posterior. No se registró una
  verificación de la página servida por GitHub Pages.
**Nota de gobernanza:** solo `PC/workspace.html` y esta ficha. Sin cambios de Supabase ni
de `CLAUDE.md`. El Loop quedó **fuera**.

---

### Desarrollo paralelo: Gestión semanal de pendientes (Portal)

**Fecha:** 2026-09-23
**Necesidad profesional que lo origina:** los pendientes no terminados quedaban
"olvidados" en clases ya pasadas (34 de 63 al momento de la auditoría) y solo se veían en
el Dashboard. Además, el Dashboard mezclaba 14 pendientes antiguos de SRP/ADMIN (mayo) que
no aparecían en ningún Plan.
**Ciclo seguido:** auditoría técnica del flujo de pendientes (solo lectura) → auditoría
breve + plan técnico → **decisión y autorización del PO** (incluido Supabase) →
implementación → SQL ejecutado por el PO (dos scripts) → pruebas contra Supabase real →
esta ficha → checkpoint propio.

**Decisiones de producto (PO):**
- Se dan de baja los 14 pendientes antiguos de SRP/ADMIN; solo participan los
  `tarea_proxima`.
- **Cierre semanal: jueves 18:00.** Cada pendiente no completado se **traslada** a la
  próxima clase disponible de su mismo contexto. Es el **mismo** pendiente; no se duplica.
- Antigüedad: primer traslado **"(1 sem)"**, luego "(2 sem)", "(3 sem)"… Los pendientes
  ya atrasados parten desde "(1 sem)" en el primer cierre.
- Completar y desmarcar **conserva** la antigüedad; el indicador solo se ve mientras el
  pendiente está activo.
- El indicador aparece en **Dashboard, Plan y Bitácora**, fuera del texto editable.
- Vacaciones y feriados: **fuera de alcance**.

**Solución técnica:**
- **Supabase** (`supabase/schema.sql` §14, aditivo e idempotente; **ejecutado por el PO**
  en dos scripts):
  - baja: `UPDATE pendientes SET estado='descartado'` en los activos que no son
    `tarea_proxima` (14 filas; **no se borran**, se conserva el histórico de SRP);
  - columnas `pendientes.semanas_pendiente` (antigüedad, 0 por defecto) y
    `pendientes.ultimo_cierre` (último cierre que movió la fila);
  - tabla `pendientes_cierres` (una fila por jueves ejecutado; RLS `acceso_total`);
  - función `pendientes_cierre_aplicar(p_cierre, p_ids)`: mueve los `tarea_proxima`
    activos, con texto, cuya clase es ≤ jueves del cierre y que no fueron movidos en ese
    cierre. El destino es la primera fecha posterior al jueves en el horario activo de su
    contexto (sirve para cualquier día; `dia_semana` 0 = lunes). Si esa clase no existe,
    la crea (`UNIQUE contexto_id+fecha`). Un contexto sin horario → no se mueve (queda
    contado);
  - función `pendientes_cierre_semanal(p_ahora, p_ids)`: con candado, ejecuta en orden
    los cierres vencidos (jueves 18:00 **hora de Chile** ya pasado), desde el **primer
    cierre, 2026-09-24**, que no estén registrados. `p_ahora`/`p_ids` solo sirven para
    pruebas (en modo prueba no se registra el cierre);
  - reloj `pg_cron` `pendientes-cierre-semanal`, **cada hora** (`5 * * * *`); la función
    decide si hay un cierre vencido. Creado OK (job 1).
- **`PORTAL/index.html`:**
  - respaldo del reloj: `cierreSemanalPendientes()` llama a la función al abrir el
    Portal, antes de leer pendientes (idempotente; si falla, el Portal sigue igual);
  - Dashboard: filtra `categoria='tarea_proxima'`;
  - Dashboard, Plan ("PENDIENTES DE ESTA CLASE") y Bitácora: indicador "(n sem)" con
    `semIndicador()`, como elemento aparte del texto. En Plan y Bitácora se oculta por CSS
    mientras la fila está completada;
  - `consultaPendientes()`: si la columna nueva no existiera, repite la consulta sin ella
    (retrocompatible; verificado antes de ejecutar el SQL).
- **Garantías:**
  - sin duplicados: solo se cambia `sesion_id` de la misma fila;
  - sin cierre doble: tabla de cierres + candado + guardia por fila `ultimo_cierre`;
  - sin mover completados: `estado='activo'` dentro del mismo `UPDATE`.
- **Sin cambios:** ADMIN, SRP, MEMORIA, Libro, `CLAUDE.md`.

**Pruebas (2026-09-23, navegador local contra Supabase real):**
- **SQL aplicado:** 0 antiguos activos, 63 `tarea_proxima` activos intactos, registro de
  cierres vacío. Llamada real con la hora actual (miércoles) → **no hace nada**.
- **Datos de prueba:** 7 pendientes desechables: pasado CUARTO; OCTAVO en el propio jueves
  del cierre; completado; clase futura; texto vacío; GENERAL sin horario; categoría
  antigua. Más 1 clase GENERAL de prueba.
- **Hora del cierre:** jueves 24/09 17:59 → sin cierre. 18:01 → se movieron **exactamente
  2** (CUARTO 21/09→28/09, OCTAVO 24/09→01/10), ambos "(1 sem)"; 1 contado sin horario.
  No se movieron el completado, el de clase futura, el vacío ni el de categoría antigua.
- **Repetición:** repetir el cierre y **3 llamadas simultáneas** → 0 movidos; mismas filas
  (sin duplicados).
- **Cierres acumulados:** simulación al 01/10 18:30 → se ejecutan en orden los dos jueves;
  CUARTO → 05/10 "(2 sem)", OCTAVO → 08/10 "(2 sem)", el de clase futura → 05/10
  "(1 sem)". Clases de destino creadas una sola vez.
- **Completado:** un pendiente completado no se mueve en un cierre posterior; desmarcado
  conserva "(2 sem)".
- **Camino real del registro, sin tocar datos:** con un cierre registrado a mano, la
  función responde "ya ejecutado" y no hace nada; registro eliminado después.
  **Los 93 `tarea_proxima` reales quedaron idénticos** (clase, estado, antigüedad, texto).
- **Pantallas:**
  - Dashboard: "(2 sem)"/"(1 sem)" junto al texto, sin categorías antiguas;
  - Plan de destino (CUARTO 05/10): ambos con su indicador; completar con clic real lo
    oculta y desmarcar lo muestra (BD: completado→activo, antigüedad 2); editar el texto
    con teclado guarda solo el texto;
  - Bitácora del 28/09: destino "→ lun 5/10" con los mismos pendientes e indicadores.
- **Consola:** sin solicitudes fallidas en una carga limpia del Dashboard. Los 401 que
  aparecen al abrir un Plan son de `eventos_uso`, un hallazgo previo (F5).
- **Datos:** 7 pendientes, 3 clases de prueba (GENERAL 22/09, CUARTO 05/10, OCTAVO 08/10,
  con su presentación en cascada) y la presentación automática creada al abrir el Plan del
  28/09 **eliminados**. No quedan filas "PRUEBA-CIERRE"; el registro de cierres quedó
  vacío.
- **No verificable desde aquí:** que `pg_cron` efectivamente dispare el jueves (no hay
  acceso de lectura a `cron.job`). El **primer cierre real es el jueves 24/09 18:00**; se
  puede confirmar con `select * from pendientes_cierres;`. Si el reloj no corriera, el
  respaldo del Portal ejecuta el cierre al abrirlo.

**Resultado:** los pendientes antiguos de SRP/ADMIN quedaron dados de baja (descartados,
no borrados). Los `tarea_proxima` no completados se trasladan cada jueves 18:00 a la
próxima clase de su contexto, conservando el mismo pendiente, y muestran su antigüedad
"(n sem)" en Dashboard, Plan y Bitácora. Verificado sin duplicados, sin cierres
repetidos, sin mover completados y con los datos reales intactos.
**Estado [ACTUALIZADO 2026-09-24]:** **CERRADO Y PUBLICADO.** Implementado y verificado
contra Supabase real; SQL (dos scripts: estructura/función y reloj `pg_cron`) ejecutado
por el PO.
- **Checkpoint:** `3127ca0` (implementación + SQL + esta ficha).
- **Publicación:** `git push` fast-forward `e4d7ea1..3127ca0` a `origin/master`
  (2026-09-23); verificado a nivel Git (`origin/master` = `3127ca0`, local/remoto
  sincronizados 0/0). **GitHub Pages** reconstruyó ese commit (build `built`);
  `PORTAL/index.html` y `supabase/schema.sql` servidos online son **idénticos** a los del
  commit. No se abrió la página en un navegador.
- **Primer cierre real: pendiente de confirmar.** Al momento de este cierre documental
  (2026-09-24, antes de las 18:00 de Chile), `pendientes_cierres` está vacío, como
  corresponde. El primer cierre real ocurre el jueves 24/09 a las 18:00 y se confirma con
  `select * from pendientes_cierres;`. Sigue vigente lo anotado arriba: no se puede
  verificar desde aquí que `pg_cron` dispare; si no lo hiciera, el respaldo del Portal
  ejecuta el cierre al abrirlo.
- Registro histórico del hito en `AUDITORIA/HISTORIA_HITOS.md` (ya incluía el commit y la
  publicación). El cierre documental se publica en un commit posterior.
**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6B** (Dashboard:
pendientes) y **F6D** (Clase/Planificación).
**Nota de gobernanza:** archivos `PORTAL/index.html`, `supabase/schema.sql` y esta ficha.
`CLAUDE.md` no se modificó; queda para la reintegración registrar la regla del cierre
semanal y la baja de los pendientes antiguos. El Loop quedó **fuera**. Deudas asociadas:
J (ver "Deudas pendientes").

---

### Desarrollo paralelo: Eliminar actividades, OA y adecuaciones (Libro de Clases)

**Fecha:** 2026-09-24
**Necesidad profesional que lo origina:** el profesor no podía eliminar actividades
abiertas creadas por error (evaluaciones, participaciones, entregas), ni quitar el OA o
una adecuación de una evaluación.
**Ciclo seguido:** auditoría técnica breve (solo lectura) → **decisión del PO** (+ una
aclaración: el instrumento del OA se *desasocia*, no se borra) → implementación → pruebas
→ SQL de protección ejecutado por el PO → prueba en BD → esta ficha → checkpoint propio.

**Decisiones de producto (PO):**
- Se pueden eliminar las **tres** actividades abiertas, **aunque tengan datos**: borrado
  **real**, con confirmación fuerte que muestra lo que se pierde.
- **Actividades cerradas no se eliminan:** primero se reabren. La protección existe
  también en la BD.
- **"Eliminar OA"** (hay un solo OA por evaluación): vaciar su texto y **desasociar** su
  instrumento, que sigue en la lista de la evaluación. No hay múltiples OA.
- **Eliminar adecuación**, aunque esté asignada: aviso con estudiantes y grupos afectados.
  Estos vuelven al OA original y se recalcula la nota cuando corresponde. **Bloqueada** si
  un grupo **terminado** depende de ella (hay que reabrirlo primero).

**Implementación:**
- **`LIBRO/index.html`** (nueva sección "ELIMINACIONES"):
  - **Botones:** "Eliminar evaluación/participación/entrega" en la cabecera (solo
    abiertas), "Eliminar OA" bajo el OA original y ✕ en cada adecuación (solo con la
    evaluación abierta).
  - **Confirmación fuerte** (`confirmarEliminacion`): resumen de lo que se pierde
    (estudiantes, notas, comentarios, adecuaciones, grupos, instrumentos aplicados,
    resultados, observación general; o participaron/entregaron) + escribir **ELIMINAR**.
    Otra palabra o cancelar → no se borra.
  - **Borrado:** `borrarActividadAbierta` borra con `estado='abierto'`. Si la actividad se
    cerró en otra ventana, no borra y avisa. Luego vuelve al panel del curso (o a la lista
    en un taller, con `volverAtras`, que además descarta el estado temporal de
    Participación). La cascada existente de la BD borra todo lo dependiente; las
    plantillas no se tocan.
  - **Eliminar adecuación:** primero pasa los grupos y estudiantes afectados al OA
    original, luego borra la adecuación y recalcula la nota de los afectados que quedan
    con instrumento. Es la **misma regla existente** que al cambiar el objetivo de un
    estudiante.
  - **Eliminar OA:** `oa_original=''` + `instrumento_id=NULL` y recalcula, con la misma
    regla que ya usaba el selector "Objetivo → instrumento".
- **Supabase — `supabase/libro_schema.sql`** (sección nueva "ELIMINACIÓN DE ACTIVIDADES",
  aditiva e idempotente, **ejecutada por el PO**): trigger `BEFORE DELETE` en
  `libro_evaluaciones`, `libro_participaciones` y `libro_entregas`
  (`libro_actividad_bloqueo_borrado_cerrada`) que rechaza borrar una actividad cerrada.
  Antes la BD solo impedía modificarlas.

**Pruebas (2026-09-24, navegador local contra Supabase real, datos desechables en CUARTO
y CUERDAS):** todas OK. Las confirmaciones se simularon para poder comprobar el texto
exacto que ve el profesor.
- **Borrado en cascada:** una evaluación abierta con un grupo **terminado** se borra
  completa, sin dejar filas huérfanas (conteos idénticos a los previos).
- **Eliminar evaluación con datos:** 26 estudiantes, 2 con nota, comentario, adecuación,
  grupo, 2 instrumentos, 7 resultados; el resumen lo mostró todo. "eliminar no" y
  cancelar → no se borra; "ELIMINAR" → se borra y vuelve al panel.
- **Participación** (5 participaron) y **entrega** (10 deben entregar, 3 entregaron): se
  borran con todo su detalle.
- **Taller CUERDAS:** tras eliminar vuelve a la lista de participaciones.
- **Actividad cerrada:** sin botones (evaluación: tampoco "Eliminar OA" ni ✕); la función
  se niega. Si otra ventana la cerró, la eliminación se rechaza.
- **Protección en BD (tras el SQL):** borrar directamente una evaluación, una
  participación y una entrega **cerradas** → rechazado con "reábrela primero".
- **Adecuación asignada** (3 estudiantes, 2 de ellos en un grupo que la usaba): los 3 y el
  grupo quedaron en el OA original. Sus notas (7,0 con el instrumento de la adecuación)
  pasaron a pendientes: el instrumento del OA no tenía resultados. La nota manual de otro
  estudiante (5,5) y la de un estudiante del OA (7,0) no cambiaron. La lista se renumera y
  el selector "Objetivo aplicado" se actualiza.
- **Adecuación sin uso:** cancelar no borra; confirmar borra.
- **Grupo terminado:** aviso de bloqueo y nada cambia; la BD también rechaza el borrado
  directo. Tras reabrir el grupo, se elimina.
- **Eliminar OA:** texto vacío, OA sin instrumento, instrumento todavía en la lista. El
  aviso indica cuántos estudiantes quedan sin instrumento.
- **Informes:** el previo ("Objetivo de aprendizaje: (sin texto)") y el de resultados se
  generan sin errores.
- **Regresión:** la evaluación real "Lectura rítmica en 6/8" (SEXTO) carga igual
  (36 estudiantes, 1 instrumento, 99 resultados, informe previo).
- **Datos:** todo lo de prueba **eliminado**; los conteos de 16 tablas (Libro + sesiones)
  quedaron **idénticos** a los previos y las 4 evaluaciones reales quedaron **idénticas
  campo por campo**.

**Resultado:** las tres actividades abiertas, el OA y las adecuaciones se pueden eliminar
según las decisiones del PO. Las actividades cerradas quedaron protegidas contra el
borrado en la interfaz y en la BD. Sin regresiones en las funcionalidades existentes y
sin datos huérfanos.
**Estado [ACTUALIZADO 2026-09-24]:** **CERRADO Y PUBLICADO.** Implementado y verificado
contra Supabase real; SQL de protección ejecutado por el PO.
- **Checkpoint:** `088d5c9` (implementación + SQL + esta ficha).
- **Publicación:** `git push` fast-forward `c4bc6bb..088d5c9` a `origin/master`; verificado
  a nivel Git (`origin/master` = `088d5c9`, local/remoto sincronizados 0/0). **GitHub
  Pages** reconstruyó ese commit (build `built`); `LIBRO/index.html`,
  `supabase/libro_schema.sql` y esta ficha servidos online son **idénticos** a los del
  commit. No se abrió la página en un navegador. El cierre documental se publica en un
  commit posterior.
**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6G** (Libro) y
**F6H** (Evaluaciones).
**Nota de gobernanza:** archivos `LIBRO/index.html`, `supabase/libro_schema.sql` y esta
ficha. `CLAUDE.md` no se modificó; queda para la reintegración registrar que las
actividades abiertas son eliminables y las cerradas están protegidas también contra el
borrado. El Loop quedó **fuera**. Observaciones: deuda K.

---

### Desarrollo paralelo: Repertorio — audio Melodía + Karaoke (EN PAUSA)

> **ESTADO: CONGELADA / EN PAUSA — NO CERRADA** (2026-09-29). Decisiones y plan
> aprobados; **implementación pendiente**. No hay código ni cambios en Supabase de esta
> iteración (ni commits, ni cambios sin commitear). Se retoma ejecutando el plan de abajo.

**Fecha:** auditoría y plan 2026-09-24/29; pausa 2026-09-29.
**Necesidad profesional que lo origina:** una canción puede tener varios audios, pero el
profesor no puede elegir cuál reproducir. Quiere un audio **Melodía** (por defecto) y un
**Karaoke** seleccionable, reutilizando la misma letra y su sincronización (subirá
karaokes con exactamente la misma duración y estructura temporal que la melodía).

**Diagnóstico (auditoría técnica, solo lectura):**
- La sincronización (LRC) vive en el asset `letra` (`synced`), **no** en el audio: es
  reutilizable para cualquier audio de igual duración.
- Todos los reproductores eligen el audio con "el primer `tipo='audio'` que aparezca".
  Con dos audios la elección es **indeterminada**: ya ocurre en 2 canciones.
- Datos al momento de la auditoría: 51 audios en 49 canciones (47 con 1 audio, 2 con 2);
  79 letras, 64 con sincronización.

**Decisiones de producto (PO, aprobadas):**
- Por defecto se reproduce **siempre Melodía**.
- Máximo **1 Melodía + 1 Karaoke** por canción en esta iteración.
- Selector **solo en el Entrenador**.
- **Visor de letras** (en desuso) y **Pizarra** (tendrá una iteración profunda futura):
  **no se modifican**; se registrarán como deudas al implementar.
- La sincronización sigue perteneciendo a la letra; **solo se edita con Melodía**
  seleccionada.
- Los audios únicos actuales se migran como `melodia`.
- **Advertencia** si Karaoke y Melodía difieren en más de ~0,5 s.
- No se implementan relaciones entre subconjuntos de assets ni el modelo futuro de
  Biblioteca.
- **Los dos audios dobles existentes (confirmado):** "con voz" = Melodía, "karaoke" =
  Karaoke:
  - Amenaza de Ultracumbia: Melodía `mu4g4tvcdqb3`, Karaoke `mu4g5ij9qotq`;
  - Severla god level: Melodía `mu4hl18gz8mo`, Karaoke `mu4hmfw8p9l7`.
- **Canción que queda solo con Karaoke (confirmado):** si una canción queda
  temporalmente solo con Karaoke, el Entrenador **reproduce ese Karaoke sin selector**,
  para que la canción no quede sin audio.

**Plan de implementación aprobado (5 etapas):**
1. **Estructura y migración (SQL ejecutado por el PO):**
   - columna `repertorio_assets.rol` (`melodia`|`karaoke`, solo audio);
   - índice único parcial canción+rol (máx. 1+1);
   - 47 audios únicos → `melodia`; los 2 dobles por id según la tabla;
   - verificación: 49 Melodías / 2 Karaokes / 0 sin rol;
   - documentado en `REPERTORIO/supabase_schema.sql`.
2. **Selección determinista:** una función única `audioDe(cancion, rol)`. Melodía = rol
   `melodia`; si no hay, el primer audio no-karaoke por `orden`/fecha. Reemplaza la
   elección en el Entrenador (`abrirEntrenador`, `abrirEntrenadorConConfig`), el modo
   pitch (`entActivarPitch`) y las sesiones (`seConfigurarLoops`).
3. **Subir/editar con tipo:** control Melodía/Karaoke al subir y editar un audio. Se
   bloquea si el tipo ya existe en la canción. Advertencia de duración (> ~0,5 s) al
   subir/editar un Karaoke.
4. **Selector en el Entrenador:** solo si la canción tiene ambos audios; abre siempre en
   Melodía.
   - Al cambiar conserva el punto, la reproducción, la velocidad, los loops y el verso.
   - Con Karaoke, **Sync** desactivado; mientras se edita la sincronización, el selector
     queda bloqueado en Melodía.
   - El audio del modo pitch se guarda en memoria por audio, no por canción.
   - Advertencia de duración al pasar a Karaoke.
5. **Documentación y deudas:** cierre de esta ficha + deudas **L (Visor de letras)** y
   **M (Pizarra)**: siguen con "primer audio"; en la Pizarra las 2 canciones dobles
   pueden seguir sonando en karaoke.

**Pruebas previstas:**
- foto previa de los datos (conteo de assets, huella de la sincronización de todas las
  letras, audios de las 2 canciones dobles);
- canción desechable "PRUEBA-AUDIO" con dos audios generados en el navegador;
- verificar todo lo anterior;
- las 64 sincronizaciones reales deben quedar idénticas;
- borrar los datos y archivos de prueba.

**Pendiente al retomar:**
- ejecutar las etapas 1–5 (el SQL de la etapa 1 lo ejecuta el PO). No quedan decisiones
  de producto abiertas.

**Archivos que se modificarán al implementar:** `REPERTORIO/index.html`,
`REPERTORIO/supabase_schema.sql`, esta ficha. Sin cambios en `PIZARRA/`, el Visor ni
`CLAUDE.md`.

**REANUDADA (PO, 2026-10-08: "quiero implementar ese doble audio").**
- **Revisión previa:** datos sin cambios relevantes (53 audios en 51 canciones; las únicas con dos audios siguen siendo
  Amenaza de Ultracumbia y Severla god level, mismos ids). Columna `rol` aún no existe. Novedad desde la pausa: la
  copia del Entrenador en la Pizarra (espejo, AJ/AR) es el mismo Entrenador → copia también el audio elegido (en
  silencio); la Pizarra propiamente tal (`PIZARRA/`) sigue sin tocarse.
- **Etapa 1:** el SQL quedó en `supabase/repertorio_audio_rol.sql` (convención actual de la carpeta `supabase/`;
  incluye la verificación: melodia 51 · karaoke 2). Lo corre el PO.
- **Etapas 2–4 implementadas (`REPERTORIO/index.html`):** `audiosDe` / `audioDe(c, rol)` (elección determinista;
  solo-karaoke → ese) en `abrirEntrenador`, `abrirEntrenadorConConfig`, `seConfigurarLoops` y el modo pitch (memoria
  por audio, no por canción); siempre abre en Melodía. Botón "🎤 Melodía / 🎶 Karaoke" en el header (solo con los
  dos): conserva punto, reproducción, velocidad, loops y verso; aviso si las duraciones difieren > 0,5 s; con Karaoke
  Sync queda desactivado y no se puede pasar a Karaoke mientras se sincroniza. Subir audio: "Este audio es Melodía /
  Karaoke" (propone el que falta; bloquea si ya existe; aviso de duración al subir un Karaoke). Editar audio: mismo
  campo con las mismas reglas. El panel de la canción muestra "Audio · 🎤 Melodía / 🎶 Karaoke".
**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6E**
(Biblioteca/Repertorio/Recursos).

---

### Desarrollo paralelo: Dashboard — jerarquía visual del calendario

**Fecha:** 2026-09-29
**Necesidad:** en el calendario del Dashboard (tres semanas: pasada, en curso y
siguiente) las tres semanas competían visualmente. El profesor quería que la **semana en
curso** fuera claramente el foco, con las otras dos en segundo plano pero legibles y
activas, que el día de hoy se reconociera de inmediato y que los días se leyeran con su
nombre completo.
**Ciclo seguido:** auditoría técnica breve (solo lectura) → propuesta visual → decisión
del PO → implementación en microiteraciones sucesivas, cada una revisada por el PO en el
navegador → verificación final → esta ficha → checkpoint propio.

**Estado final implementado** (solo se describe lo vigente; las variantes intermedias que
se probaron y descartaron no forman parte del resultado):
1. **Semanas no actuales atenuadas** (pasada y siguiente, solo cuando la semana en curso
   está entre las tres visibles):
   - días con fondo gris muy claro (`#f1f5f9`);
   - clases con texto gris (`#536171`) y fondo neutro (`#e8edf3`);
   - fecha y clases con **desenfoque de 0,9 px** y **saturación al 60 %** (emojis
     incluidos).
2. **Semana en curso:** sin atenuación; conserva su tratamiento previo (fondo celeste,
   borde y título azules).
3. **Nombres completos de los días** en las tres semanas: "lunes 28", "martes 29",
   "miércoles 30", "jueves 01" (se mantiene el número con dos cifras).
4. **Día actual — acento ámbar terroso, no relleno:**
   - card en crema cálida (`#faf3ee`) con **borde fino ámbar `#b45309`**;
   - la fecha, en **pastilla ámbar `#b45309`** con texto blanco (contraste 5,0:1), es la
     principal señal de "hoy";
   - las clases conservan su aspecto azul/celeste;
   - con el cursor encima, la card de hoy no cambia.
5. **Paleta aprobada:** ámbar terroso **`#b45309`**, el mismo tono del indicador
   "(n sem)" del panel de Pendientes del Dashboard, con dos derivados mezclados con
   blanco: crema `#faf3ee` (7 %) y hover `#fdfaf8` (3 %). No se usa el naranja
   `#ea580c`.
6. **Hover por día:** la card bajo el cursor toma un realce cálido casi imperceptible
   (`#fdfaf8`, borde `#ecd4c2`), sin afectar a las otras cards. En una semana atenuada,
   además, **solo esa card recupera nitidez**: sin desenfoque y con color normal; el
   resto de la semana sigue atenuado.
7. **Hover por clase** (sin cambios de comportamiento): la clase bajo el cursor queda
   nítida, con fondo celeste y borde azul.
8. **No existe hover por semana completa:** pasar el cursor sobre una semana atenuada no
   la desatenúa.
9. **Navegación:** si al navegar la semana en curso no está entre las tres visibles, no se
   aplica la atenuación.

**Implementación:** solo `PORTAL/index.html`.
- Un bloque de estilos del calendario.
- En `renderCalSemanas()`, tres líneas nuevas:
  - `CAL_DIA_NOMBRE` (reemplaza `CAL_DIA_ABBR`);
  - la clase `hoy` en la card del día actual;
  - la marca `con-actual` en el calendario cuando la semana en curso está visible.
- Sin cambios en tamaños, distribución, navegación de semanas, clics hacia el Plan,
  panel de pendientes, Plan, datos, Supabase ni otras páginas.

**Verificación (navegador local, mouse real):**
- semana en curso nítida y las otras dos atenuadas (0,9 px / 60 %), legibles;
- nombres completos sin cortes ("miércoles 30" ocupa 68 px de 148 px, también a 900 px de
  ancho);
- día actual con crema, borde y pastilla ámbar, y sin cambio al pasar el cursor;
- hover de día en la semana en curso y en una semana atenuada (solo esa card recupera
  nitidez);
- hover de clase en una semana atenuada y dentro del día actual;
- el cursor sobre el título de una semana atenuada no la desatenúa;
- sin atenuación al navegar fuera de la semana en curso; reaparece al volver;
- un clic en una clase atenuada sigue abriendo su Plan;
- consola sin errores.

**Estado:** **CERRADA — implementada, verificada y publicada.** El checkpoint es el
commit de cierre que contiene esta ficha ("Dashboard: cierre de la jerarquía visual del
calendario"), publicado con `git push` a `origin/master` y servido por GitHub Pages.
**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6B** (Dashboard).
**Nota de gobernanza:** sin cambios de Supabase ni de `CLAUDE.md` (decisión puramente
visual; `CLAUDE.md` no describe la apariencia del Dashboard). El Loop quedó **fuera**. El
problema posterior de recorte (*clipping*) del calendario **no** forma parte de esta
iteración; se tratará como un desarrollo aparte.

**Deuda registrada tras el cierre (2026-09-29) — PENDIENTE DE DISEÑO: tratamiento de las
semanas fuera del horizonte inmediato.**
- **Qué queda sin definir:** la jerarquía visual se diseñó para el horizonte inmediato
  (semana pasada, en curso y siguiente). Falta decidir cómo se ven las semanas **más
  lejanas** al presente cuando el profesor navega hacia ellas: qué jerarquía tienen
  respecto de la semana en curso y de las semanas inmediatamente anterior y siguiente.
- **No forma parte** de la implementación cerrada.
- **No es una decisión:** lo que hoy ocurre al navegar (punto 9: sin semana en curso
  visible no se atenúa nada) es solo el comportamiento actual.
- Requiere una **futura decisión de producto/diseño del PO**; su implementación será una
  iteración posterior.
- Esta deuda **no reabre** la iteración, que sigue cerrada, implementada, verificada y
  publicada.

---

### Microiteración: Libro de Clases — nombres de PDF UTP

**Fecha:** 2026-09-30
**Estado:** **CERRADA — implementada, verificada y publicada.**
**Problema original:** los dos PDF UTP del Libro (Informe Previo "Instrumento de
Evaluación" e "Informe de Resultados") se guardaban con un nombre genérico, **"Libro de
Clases.pdf"**. Dentro del Workspace, el cuadro "Guardar como PDF" proponía **"Workspace
(demo) — PROFE"**.
**Causa:**
- "Guardar como PDF" propone el título de la **ventana principal**. Dentro del Workspace
  esa ventana es el Workspace, no el Libro (que corre en un iframe).
- Con el sistema abierto como archivo local (`file://`), el navegador trata cada archivo
  como un sitio distinto y **el Libro no puede modificar el título del Workspace**
  directamente.

**Ciclo seguido:**
1. Auditoría y propuesta.
2. Decisión del PO sobre el formato.
3. Primera implementación: título temporal del documento.
4. Prueba física: en el Workspace seguía proponiendo "Workspace (demo) — PROFE".
5. Auditoría de la causa (`file://`).
6. Solución por `postMessage` aprobada por el PO.
7. Implementación y pruebas.
8. **Verificación física del PO en Brave:** correcta.
9. Esta ficha y checkpoint propio.

**Formatos finales (todo en MAYÚSCULAS, conservando tildes y Ñ):**
- `DD-MM-YY - CURSO - ASIGNATURA - RÚBRICA`
- `DD-MM-YY - CURSO - ASIGNATURA - LISTA DE COTEJO`
- `DD-MM-YY - CURSO - ASIGNATURA - RESULTADOS`
- Ejemplo: `22-09-26 - 6TO - MÚSICA - RÚBRICA`.

**Reglas de cada parte:**
- **Fecha:** la de la **evaluación** (no la de impresión), en formato DD-MM-YY.
- **Curso:** se normaliza según la tabla implementada: PRIMERO→1RO, SEGUNDO→2DO,
  TERCERO→3RO, CUARTO→4TO, QUINTO→5TO, SEXTO→6TO, SÉPTIMO→7MO, OCTAVO→8VO.
  - PREKÍNDER y KÍNDER se conservan; también se reconoce la forma "N° BÁSICO".
  - Un curso fuera de la tabla conserva su nombre visible en mayúsculas (no se inventan
    abreviaturas).
  - En un Libro vinculado (Orientación, Enlaces) el curso es el de la población (8VO).
- **Asignatura:** la del informe (`informeAsignatura()`), en mayúsculas: MÚSICA,
  ORIENTACIÓN, ENLACES.
- **Tipo** (solo Informe Previo): el del instrumento asociado al OA y a las adecuaciones.
  - Casos que el formato del PO no especificaba, resueltos así en la implementación:
    - sin instrumento asociado → `INSTRUMENTO DE EVALUACIÓN`;
    - con ambos tipos → `RÚBRICA Y LISTA DE COTEJO`.
- **Caracteres no válidos en Windows** (`\ / : * ? " < > |`): se reemplazan por "-".

**Solución implementada:**
- **`LIBRO/index.html`:** `imprimirInforme()` genera el nombre (`informeNombreArchivo()`)
  y lo pone como título del Libro. Luego:
  - **dentro del Workspace:** envía por `postMessage` el pedido `ws-titulo-ventana`,
    **espera la confirmación** (`ws-titulo-ventana-ok`) y recién entonces llama a
    `window.print()`. Si no hay respuesta en 1,5 s, imprime igual para no bloquear;
  - **fuera del Workspace:** imprime de inmediato con su propio título.
  - Al terminar la impresión, **también al cancelar** (`afterprint`), o al cerrar el
    informe, restaura el título del Libro y pide `ws-titulo-ventana-restaurar`.
- **`PC/workspace.html`:** el canal `postMessage` existente (que solo acepta mensajes de
  sus propios iframes) suma `ws-titulo-ventana` (cambia el título de la ventana, guarda el
  original y confirma) y `ws-titulo-ventana-restaurar` (vuelve a "Workspace (demo) —
  PROFE").
- **Funciona también en `file://`**, porque no depende de acceder a la otra ventana, sino
  del intercambio de mensajes.
- **Sin cambios:** contenido y diseño de los informes, cálculos, notas, instrumentos,
  otras funciones del Libro, Supabase.

**Verificación:**
- **Navegador de pruebas** (título de la ventana principal en el instante de imprimir):
  - Workspace: Rúbrica, reimpresión tras cancelar, Lista de cotejo (tipo simulado solo en
    memoria) y Resultados, todos con el nombre correcto; tras cancelar, el Workspace vuelve
    a "Workspace (demo) — PROFE";
  - Libro abierto directamente: nombre correcto e impresión inmediata;
  - otros cursos: 3RO; Libro vinculado: 8VO · ORIENTACIÓN;
  - consola sin errores; ningún dato creado ni modificado.
- **Verificación física del PO en Brave**, con el sistema abierto como archivo local
  (`file://…/PC/workspace.html` → Libro → Informe → Guardar como PDF): **el cuadro real
  propone el nombre correcto.**

**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6H**
(Evaluaciones/UTP).
**Nota de gobernanza:** archivos `LIBRO/index.html`, `PC/workspace.html` y esta ficha. Sin
cambios de Supabase ni de `CLAUDE.md`. **Para la reintegración:** `CLAUDE.md` §3
enumera los mensajes del canal `postMessage` del Workspace (`ws-abrir`, `ws-titulo`,
`ws-guardar`/`ws-guardado`); habrá que sumar `ws-titulo-ventana` /
`ws-titulo-ventana-restaurar`, hoy documentados en el propio `workspace.html`. El Loop
quedó **fuera**.

---

### Desarrollo paralelo: Metalófono Web — Etapa 1: modo alumno (celular)

**Fecha:** 2026-09-30
**Estado:** **CERRADA — implementada, validada físicamente por el PO y guardada en su
checkpoint Git.** La **Etapa 2** (compartir por link) **NO está implementada**; ver el
final de esta ficha.
**Objetivo / necesidad:** que un niño pueda abrir desde su celular, en casa, una melodía
del Metalófono y practicarla sin configurar nada. La Etapa 1 construye el **modo
alumno**; la Etapa 2 construirá el **link compartible** desde el Repertorio.
**Punto de partida:** el Metalófono era un solo archivo pensado para PC
(`METALÓFONO APP/METAL21 (ALPHA).HTML`). Tenía 25 placas, reproducción con luces,
precuenta configurable, práctica ("Pool de notas" y "Melodía sin ritmo"), cifrado,
colores y pantalla completa, y abría un MIDI desde un archivo o con `?midi=<url>` (así lo
abren el Repertorio y el Portal).

**Arquitectura:**
- **Mismo archivo, dos modos.** `?modo=alumno` activa el modo alumno. Todo lo nuevo
  depende de la clase `html.modo-alumno` o de `MODO_ALUMNO`. No hay una segunda
  aplicación ni un segundo motor de audio.
- **Carga en modo alumno:** `?a=<id del asset metalofono del Repertorio>` → descarga el
  MIDI **público** `…/storage/v1/object/public/repertorio-assets/midi/<id>.mid` y usa el
  cargador existente (`cargarMidiBuffer`).
  - **Sin Supabase:** no carga `supabase/config.js` ni consulta tablas.
  - El ID solo admite letras y números.
  - Link incompleto o MIDI inexistente → mensaje en la pantalla de inicio.
- **Nombre visible:** `?n=<nombre>`; si falta, el nombre guardado dentro del MIDI.
- **Móvil:** el modo alumno agrega por JS la etiqueta viewport y `color-scheme: only
  light`. El modo profesor no las recibe.

**Decisiones de producto cerradas (PO) — no reinterpretar:**
- **Instrumento completo siempre:** 25 placas (15 naturales + 10 sostenidos). **No** se
  reduce al rango de la melodía.
- **Orientación horizontal:** en vertical, pantalla "Gira tu celular 🔄".
- **Inicio:** nombre de la melodía y botón grande **"Tocar"**, que habilita el audio (el
  celular exige un primer toque).
- **Barra superior** (una fila, en este orden):
  - 🎯 Práctica;
  - nombre de la melodía (secundario; se acorta con "…" si no cabe);
  - velocidad **− · valor · +**;
  - ▶ REPRODUCIR / ⏹ DETENER.
  - **Sin** el badge "¡Listo para tocar!".
- **Colores:**
  - Práctica apagada = **gris**; encendida = **naranja** (mismo texto, sin anillo ni
    brillo);
  - Reproducir disponible = **naranja**; durante la Práctica = **gris y bloqueado** (no
    inicia la reproducción); vuelve a naranja al apagar la Práctica;
  - − y + = **naranjas**;
  - el **valor de velocidad** no es botón: neutro, no editable, sin foco ni clic; solo −
    y + lo cambian;
  - bloqueado = gris; mismo color al tocar (sin el gris de hover del modo profesor).
- **Precuenta siempre obligatoria**, sin control. No lee ni escribe la preferencia del
  profesor (`metal_precuenta`).
  - El velo se mide sobre el **área real del instrumento** (unidades de contenedor
    `cqh`), así que no desborda en celulares.
  - Tiene un **retiro garantizado** al entrar la melodía (reloj de audio +
    temporizador), porque el retiro original (`Tone.Draw`) puede descartarse si el
    navegador no dibuja a tiempo.
- **Práctica del alumno ("melodía sin ritmo"):**
  - **un toque = una posición**: el 1.er toque ilumina la nota 1 y cada toque pasa directo
    a la siguiente, **sin** el paso "apagar";
  - nota **repetida** consecutiva: se apaga y se reenciende tras **200 ms fijos**
    (interno, no configurable); un toque durante esa pausa completa la nota y avanza;
  - al terminar, a los **2 s** la Práctica se apaga sola y Reproducir queda disponible;
  - apagar la Práctica durante una pausa cancela todo lo pendiente.
- **Cifrado y colores del instrumento:** los predeterminados, sin controles.
- **Ocultos en modo alumno:** Nuevo MIDI, Modo Práctica/Pool de notas, Cifrado, Colores,
  Precuenta, Pantalla completa y el deslizador de velocidad.
- **Robustez ante zoom:** todas las medidas del modo alumno usan una unidad proporcional
  `--u = min(100dvh/390, 100vw/844)` (referencia: celular horizontal 844×390).
  - Con cualquier zoom se mantiene la misma composición: barra al 11,3 % del alto y los
    mismos controles en las mismas posiciones.
  - La altura de las placas se recalcula por JS (`alumnoAjustarPlacas`, con
    `ResizeObserver`).
  - No se bloquea el zoom del navegador.
- **Modo oscuro del sistema:** no altera la apariencia (`color-scheme: only light`).

**Rendimiento (común a ambos modos, sin cambio funcional):**
- **Diagnóstico:** el motor es liviano (procesar el MIDI ~1 ms; preparar la reproducción
  ~1 ms). La lentitud venía de la cadena de carga:
  - librerías pedidas **sin versión**, con una redirección que caducaba a los 60 s y que
    bloqueaba la página;
  - el MIDI se pedía recién después.
- **Cambios:**
  - librerías con **versión fija**, las mismas que ya se usaban (Tone.js 15.1.22 y
    @tonejs/midi 2.0.28): caché de un año, sin redirección;
  - **descarga anticipada del MIDI** en el `<head>`, en paralelo con las librerías y
    reutilizada por el cargador. Aplica a `?a=` (alumno) y a `?midi=` (profesor); sin
    melodía no descarga nada.
  - Resultado: el MIDI se pide a ~15–20 ms en vez de ~474 ms, una sola vez.
- **Sin tocar a propósito** (cambiaría el aspecto visual o arriesga el primer sonido):
  - el brillo de las placas al sonar (sombras de hasta 220 px) y el "latido" animado de la
    Práctica, que son lo más costoso de dibujar;
  - el momento en que se prepara el motor de audio;
  - la duración de la precuenta.

**Separación del modo profesor:** sin cambios de comportamiento.
- Barra de 70 px, todos sus controles, mensaje de estado, precuenta configurable.
- Su propia "Melodía sin ritmo" con la secuencia antigua (mostrar → apagar → siguiente).
- **La lógica de Práctica del alumno no se traslada al profesor** sin decisión del PO.
- Solo recibe las dos mejoras de rendimiento.

**Archivos modificados:** solo `METALÓFONO APP/METAL21 (ALPHA).HTML`, más esta ficha,
`AUDITORIA/HISTORIA_HITOS.md` y `CLAUDE.md` (protocolo de links y fila del Metalófono).
Sin cambios de Supabase ni de otros módulos.

**Pruebas:**
- **Validación física del PO** (celular real): funcionamiento general, composición, zoom,
  estados de Práctica, Reproducir bloqueado en Práctica, valor de velocidad no editable,
  nueva secuencia de Práctica y carga inicial mejorada.
- **Navegador de pruebas** (Claude):
  - vertical/horizontal;
  - zoom simulado 50/75/100/125/150/175 % y pantallas de otras proporciones (568×320,
    640×260, 360×180): sin scroll, cortes ni superposiciones, 25 placas dentro, precuenta
    contenida;
  - modo oscuro simulado;
  - Práctica con una triple repetición real (Sol♯×3) y las 33 notas sonando una vez cada
    una;
  - link inválido;
  - modo profesor sin melodía y con `?midi=`;
  - mediciones de carga y reproducción.
- **No realizadas:** prueba en **iPhone** (sin registro); simulación de zoom que agranda
  **solo el texto**. El zoom se probó como reducción del espacio disponible.

**Limitaciones conocidas:**
- La dirección del MIDI asume la extensión `.mid`: una melodía está guardada como `.MID`
  (ver Etapa 2).
- Un MIDI sin cifra de compás no se reproduce en modo alumno, porque la precuenta es
  obligatoria y el aviso del estado está oculto. Se resolverá impidiendo compartirlo
  (Etapa 2).

**Etapa 2 — decisiones tomadas por el PO al cierre de la Etapa 1** (registro histórico;
la Etapa 2 ya está **implementada**: ver la ficha siguiente, "Metalófono Web — Etapa 2"):
- **Link permanente:** `https://patolastra.github.io/profe-apps/m/?a=<ID>&n=<nombre>`.
  - Siempre apunta a la versión en línea.
  - `n` codificado (espacios, tildes, caracteres especiales).
- **`m/index.html`:** página mínima que **solo redirige** a
  `../METALÓFONO APP/METAL21 (ALPHA).HTML?modo=alumno&a=…&n=…`. No es una aplicación.
- **Botón "Compartir"** en `REPERTORIO/index.html`, en las tarjetas de melodías
  `metalofono` (zona de `assetItemHTML`), **solo si están PUBLICADAS**.
  - Usa el menú nativo de compartir (`navigator.share`) o, si no existe, copia el link.
- **Identificador:** el ID del asset del Repertorio. Sin tablas, permisos ni Supabase
  nuevos.
- **Antes de compartir:**
  - el Repertorio verifica que el MIDI tenga **cifra de compás**, sin cargar el motor de
    audio; si no la tiene, **no se comparte** y se informa el motivo;
  - se usa la **extensión real** del archivo del asset, porque existe
    `midi/mrj8x2fagmcu.MID` ("MELODÍA VOCAL 2 DINOSAURIO ANACLETO"). **No** renombrar
    archivos del almacenamiento. Esto probablemente exige que el modo alumno acepte la
    extensión (a definir al implementar).
- **Datos al cierre de la Etapa 1:** 21 melodías `metalofono`, **todas en borrador**. El
  botón no aparecerá hasta que el PO publique alguna (esperado).

**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6E**
(Biblioteca/Repertorio/Recursos) y **F6J** (Creación de recursos/apps).
**Nota de gobernanza:** el Loop (`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`)
quedó **fuera** del checkpoint.

---

### Desarrollo paralelo: Metalófono Web — Etapa 2: compartir melodías desde el Repertorio

**Fecha:** 2026-09-30
**Estado:** **CERRADA — implementada, probada técnicamente, probada físicamente en celular Android
y aprobada por el PO (2026-09-30).** La prueba física incluyó abrir una melodía cuyo
archivo está guardado como `.MID`. Checkpoint de implementación: `093af2a`; cierre
documental en su propio commit.
**Objetivo / necesidad:** que el profesor mande a sus alumnos, con un link corto, una
melodía del Metalófono para practicar en el celular (modo alumno de la Etapa 1).
**Punto de partida:** checkpoint de la Etapa 1 (`bba8f96`), verificado antes de empezar:
local = remoto y GitHub Pages sirve exactamente ese commit.

**Qué se implementó:**
- **Link permanente:** `https://patolastra.github.io/profe-apps/m/?a=<ID>&n=<nombre>`.
  - `a` = ID del asset `metalofono` del Repertorio.
  - `n` codificado para URL (`encodeURIComponent`: espacios, tildes, "—", "#"…).
  - Siempre apunta a la versión en línea, aunque se comparta desde una copia local.
- **`m/index.html`:** página mínima que solo redirige (`location.replace`) a
  `../METALÓFONO APP/METAL21 (ALPHA).HTML?modo=alumno&a=…&n=…`. No carga librerías ni
  consulta nada.
- **Botón "🔗 Compartir"** en `REPERTORIO/index.html` (`assetItemHTML`), **solo** en assets
  `metalofono` con estado **publicado**. Aparece o desaparece al cambiar el estado desde el
  badge P/B/E/A (el panel ya se redibuja).
- **Al compartir** (`compartirMetalofono`):
  1. Descarga el MIDI con su **dirección real** (`storage_path`, con la extensión real) y
     verifica la **cifra de compás** con un lector mínimo de eventos MIDI
     (`midiTieneCifraCompas`, meta evento `FF 58`), sin cargar el motor de audio. El
     resultado se recuerda por asset durante la sesión.
  2. Sin cifra de compás → **no comparte** y avisa: "No se puede compartir esta melodía:
     al MIDI le falta la cifra de compás…".
  3. Con `navigator.share` → menú nativo de compartir. Sin él → copia el link al
     portapapeles ("Link copiado"). Cancelar el menú no muestra error; si el navegador
     exige un toque reciente, pide volver a tocar Compartir.

**Decisiones del PO tomadas durante la implementación (2026-09-30):**
- **Extensión del MIDI — "probar ambas".** El link aprobado no lleva extensión y el modo
  alumno no consulta la base de datos. Por eso el modo alumno pide `<id>.mid` y, **si no
  existe**, `<id>.MID`. El link queda exactamente como se aprobó y no se renombran
  archivos del almacenamiento.
  - Aplica **solo al modo alumno**. El modo profesor (`?midi=`) sigue con una única
    descarga, sin segundo intento.
  - Único cambio en el Metalófono: la función de descarga `metalDescargarMidi`, que usan
    la descarga anticipada y el cargador. La UX aprobada del modo alumno no cambia.
- **Nombre visible (`n`) — "Canción — etiqueta".** Ej.: "El Crack — Parte 1, en C". Si
  el asset no tiene etiqueta, solo el nombre de la canción.

**Archivos modificados:** `REPERTORIO/index.html`, `METALÓFONO APP/METAL21 (ALPHA).HTML`,
`m/index.html` (nuevo), más esta ficha, `AUDITORIA/HISTORIA_HITOS.md` y `CLAUDE.md`
(protocolo de links). Sin tablas, permisos ni cambios de Supabase.

**Pruebas (navegador de pruebas, Claude):**
- `m/?a=mrj8x2fagmcu&n=…` (la melodía `.MID`): redirige al modo alumno, `.mid` responde
  400 y `.MID` 200, la melodía carga (54 notas, 4/4) y el nombre con tildes, "—" y "#"
  llega intacto.
- Melodía `.mid` normal: una sola descarga, carga correcta.
- ID inexistente → "No se pudo cargar la melodía."; `m/` sin `a` → "Link incompleto".
- Modo profesor con `?midi=`: una sola descarga, carga igual que antes; con un `.mid`
  inexistente, el mismo error de siempre (sin segundo intento).
- Lector de cifra de compás: coincide con `@tonejs/midi` (la librería del Metalófono) en
  las **21 melodías reales** (todas tienen cifra) y en MIDIs sintéticos con y sin cifra
  (incluye running status) y en un archivo no MIDI.
- Botón: 0 botones con las 21 en borrador. Con una melodía marcada publicada **solo en la
  memoria del navegador** (sin escribir en la base): aparece "🔗 Compartir"; con
  `navigator.share` simulado recibe título y link correctos; sin él copia el link y
  muestra "Link copiado"; forzando "sin cifra" no comparte y muestra el aviso. Estado
  restaurado y página recargada al terminar.
- **No realizadas:** menú nativo de compartir real (el navegador de pruebas no lo tiene) y
  prueba en celular/iPhone → quedan para la **validación física del PO**.

**Validación física del PO (2026-09-30):** realizada en celular **Android**; funciona correctamente,
incluida la melodía guardada como `.MID`. **Etapa 2 aprobada.** **iPhone: sin probar**
(pendiente de validación, igual que en la Etapa 1).
**Deuda derivada (no resuelta):** densidad del menú de acciones de los assets; ver
"Deudas pendientes", punto **L**.
**Relación con el Bosquejo:** funcionalidad adelantada; encaja en **F6E** y **F6J**.
**Nota de gobernanza:** el Loop (`tabs/index.html`, `LOOP-LAB/`, `.claude/launch.json`)
quedó **fuera** del checkpoint.

---

### Desarrollo paralelo: Modo Clase — Pasos 1 y 2: "Comenzar clase", temporizadores y Pizarra en el proyector

**Fecha:** 2026-10-04 / 05
**Estado:** **CERRADOS — Paso 1 y Paso 2 implementados, validados físicamente por el PO
(proyector en "Extender", versión en línea) y publicados.** Tabla `clase_tiempos` creada
por el PO en Supabase y verificada (lectura/escritura). El Modo Clase como línea sigue
abierto: próximos pasos y deudas al final de esta ficha.
Primer desarrollo bajo la marcha blanca sin ChatGPT (Notion: *Modo live para clases*).
**Necesidad profesional que lo origina:** un modo "en vivo" para la clase, con el
Planificador como centro de operaciones del profesor y la Pizarra en el proyector
(pantallas en **Extender**). Primer paso pequeño: medir el **tiempo de clase** y el
**tiempo perdido**, y mostrar el tiempo perdido a los alumnos.
**Funcionalidad aprobada (alcance del Paso 1):**
1. En el Planificador, el botón "📽️ Presentar" pasa a **"Comenzar clase"**: abre la
   Pizarra y comienza la clase. **Deja de abrir el Entrenador** en una segunda ventana
   (el navegador siempre la bloqueaba).
2. En el Planificador, dos temporizadores siempre visibles mientras dure la clase:
   - **Tiempo de clase:** parte solo, acumulativo, no se pausa; termina al terminar la clase.
   - **Tiempo perdido:** parte en 00:00, acumulativo, se inicia/detiene con
     **Ctrl + Shift + Espacio** (desde el Planificador o la Pizarra), cuantas veces se quiera.
3. Mientras el tiempo perdido corre, la Pizarra lo muestra **encima, muy grande,
   parpadeando entre rojo y verde**; al detenerlo desaparece y la Pizarra sigue donde estaba.
   El tiempo de clase **no** se proyecta.
4. El botón cambia a **"Terminar clase"**, que pide confirmación con la **clave del
   sistema** (día del mes; a cambiar en V1).
5. Al terminar, se guardan ambos tiempos de esa sesión (**nuevo espacio en la base de
   datos, autorizado por el PO**). Se consultan en una sección plegable nueva
   **"DATOS DE LA CLASE"** en el panel izquierdo del Planificador (separada de la bitácora).
6. Si algo se cierra por error y se reabre, los tiempos **siguen donde iban**.
**Decisiones del PO (2026-10-04):** recorrido del modo = sigue el plan con saltos libres;
tiempos = "estadísticas de la clase", no bitácora; Pizarra como **ventana aparte**
(proyector) — indiferente para el PO si existe un "espejo" para operar la proyección
desde su pantalla (idea futura, fuera de este paso); nombre "Comenzar clase" provisorio;
"tiempo de juego" (relación con el tiempo perdido) postergado.
**Relación con la arquitectura actual:** Planificador (`PORTAL/`) + Pizarra (`PIZARRA/`);
Pizarra ya tiene control remoto por celular y un temporizador de cuenta regresiva, que no
se tocan.
**Relación con el Bosquejo Conceptual V1:** adelanta parte de **F6D (Clase)** y **F6F (Pizarra)**.
**Implementación (técnica):** `comun/clase-vivo.js` (nuevo, compartido): estado de la
clase en `localStorage` (marcas de tiempo → sobrevive a cierres/recargas y funciona sin
internet; las ventanas se enteran por el evento `storage`), atajo global en fase de
captura (no dispara el Espacio = avanzar/reproducir), cola de registros por subir.
Incluido en Planificador, Pizarra, Libro, Repertorio/Entrenador y Workspace. Planificador:
botón Comenzar/Terminar clase, temporizadores en la barra, botón 📽️ para reabrir la
Pizarra (ventana con nombre fijo; desde el Paso 2, `profe-proyeccion`), modal con clave, sección DATOS DE LA
CLASE en el registro de clase anterior (cerrada por defecto). Pizarra: capa del tiempo
perdido (parpadeo rojo/verde, no bloquea clics). Tabla nueva `clase_tiempos`
(sesion_id, inicio, fin, tiempo_clase_seg, tiempo_perdido_seg, episodios_perdido; RLS
acceso_total); varias filas por sesión permitidas.
**Pruebas (Claude, navegador de pruebas):** comenzar → estado creado y Pizarra abierta;
atajo en la Pizarra muestra/oculta la capa sin mover la diapositiva (Espacio solo sigue
avanzando); clic en 🎮 desde otro Planificador → la capa aparece en la Pizarra; reabrir el
Planificador conserva los tiempos; clave errónea no termina, correcta termina y deja el
registro en cola (tabla aún no creada → aviso correcto). Datos de prueba borrados. No
probado: dos pantallas reales, ni abriendo desde archivos locales.
**Paso 2 — Pizarra en el proyector (2026-10-04, IMPLEMENTADO; falta prueba física del PO):**
aprobado por el PO tras evaluar la viabilidad de la nota "Modo live" (dos vistas, ventana
aparte, detección de pantallas, asignación manual, Flip, degradación progresiva).
- Con permiso del navegador para manejar pantallas (Window Management API: Chrome/Edge;
  **Brave por probar**), "Comenzar clase"/📽️ abre la Pizarra como ventana sin barras en
  el proyector. Regla: pantalla recordada **en ese computador** (por nombre); si no está
  conectada, la primera que **no es la principal**. Al abrirse, la Pizarra también se
  ubica sola si quedó en la principal.
- **↔** en el Planificador (solo con permiso y clase en curso) pasa la Pizarra a la otra
  pantalla; si queda en una no principal, ese computador la recuerda. No mueve la
  ventana del Planificador (el navegador no lo permite) — aceptado por el PO.
- Pantalla completa: sigue siendo con F (el navegador exige un gesto) — aceptado por el PO.
- Sin la función o sin permiso: todo como antes (Windows + Shift + flecha). La primera
  vez el navegador pregunta si se autoriza; queda guardado.
- Código: `comun/clase-vivo.js` (bloque `Proyeccion`), Planificador (`abrirPizarra`,
  botón ↔), Pizarra (escucha ↔ y se ubica al abrir).
- **Corrección tras la primera prueba física (falló en Brave y Chrome):** diagnóstico con
  página temporal `comun/diagnostico-pantallas.html`. Chrome entrega datos reales y puede
  abrir una ventana en el proyector; **Brave con escudos entrega pantallas falsas** (sin
  nombre, tamaño 0, misma posición). Causas propias corregidas: (1) el Workspace no
  delegaba `window-management` al iframe del Planificador; (2) la primera apertura era una
  pestaña normal y al reabrir se reutilizaba (no se puede mover). Ahora la Pizarra se abre
  siempre como ventana emergente (`profe-proyeccion`), el destino se elige evitando la
  pantalla del Planificador, se ignoran pantallas de tamaño 0, y la Pizarra se reubica
  sola al cargar según el destino que dejó el Planificador.
- **Causa final del fallo en la prueba física:** el PO abría el Workspace como archivo local
  (`file://`); el permiso de pantallas estaba concedido solo en la versión en línea. Desde
  la versión en línea, **funciona: la Pizarra se abre en el proyector (validado por el PO,
  Brave con escudos bajos)**. Recomendación al PO: usar siempre la versión en línea.
- Barra del Planificador: con clase en curso (📽️ y ↔ extra) el título y los botones se
  partían en dos líneas en pantallas de ~1536 px; ahora nunca se parten y los tamaños se
  ajustan al ancho (probado a 1536 y 1280 px). Segundo reporte del PO (seguía partida):
  red de seguridad — si la barra no cabe en una línea, los botones Libro/Repertorio/
  Bitácora/Remoto quedan solo con ícono (nombre en el globo); se recalcula al cambiar el
  ancho real de la barra.
- ↔: la Pizarra quedaba detrás del navegador al llegar a la pantalla del profe; ahora el
  Planificador la trae al frente con el mismo clic (y la Pizarra pide foco al moverse).
  Segundo reporte (seguía quedando detrás): ahora el **Planificador** mueve la ventana y la
  trae al frente dentro del mismo clic (obtiene la ventana existente por su nombre, sin
  recargarla); la Pizarra emite un latido para no abrir una ventana en blanco si no está.
- Pruebas (Claude): solo el camino sin permiso (navegador de pruebas de una pantalla):
  la Pizarra abre como antes, ↔ oculto, sin errores. **Dos pantallas reales: sin probar.**
**Deuda técnica (PO, 2026-10-04):** hoy una misma sesión puede acumular **varios
registros** de tiempos (si se comienza y termina la clase más de una vez en la misma
fecha). Debe haber **uno solo por clase**; definir cómo se resuelve (impedir comenzar de
nuevo, retomar el registro existente, o reemplazarlo).
**Deuda (PO, 2026-10-05): botón ↔ propio en la Pizarra**, para devolverla a la pantalla
de proyección desde la misma Pizarra (hoy ↔ solo está en el Planificador).
**Notas operativas:** usar la **versión en línea** (`https://patolastra.github.io/profe-apps/`);
abierta como archivo local (`file://`) el navegador no aplica el permiso de pantallas. En
Brave hay que bajar los escudos para el sitio. Cada computador acepta el permiso una vez.
La página temporal `comun/diagnostico-pantallas.html` se conserva por ahora para revisar
otros computadores; retirarla cuando ya no sea necesaria.
**Pendientes:** futuros: espejo de la proyección, notas
por diapositiva, proyectar recursos del Libro, invitación a la bitácora al terminar.
**Observaciones para la reintegración:** primera pieza del "Modo Clase"; nombre definitivo
pendiente.

---

> **Nota de trazabilidad (2026-10-05):** las seis fichas siguientes se registraron **de forma
> retroactiva**, al cierre del día: se implementaron con plan y aprobación del PO en el chat y
> en Notion, pero **sin crear la ficha antes de implementar** (paso 2 del ciclo, omitido por
> Claude). Cada una tuvo su propio checkpoint Git. Desde ahora la ficha se crea antes de
> implementar. Todas quedan **pendientes de comprobación en uso real** (ítem de Notion
> *"Comprobar en uso real los arreglos del 5 de octubre"*).

### Microiteración: Repertorio — subir y borrar assets sin perder tabs ni sincronización

**Fecha:** 2026-10-05 · **Checkpoint:** `fb3c9b7` · **Estado:** CERRADA (falta uso real).
**Necesidad:** la tab de bajo y una de ukelele de Baby Shark "desaparecieron". Auditoría con el
registro de Supabase (DELETE del 2026-10-04, 19:49–19:58): el bajo se había subido **3 veces en
3 segundos** (Guardar aceptaba varios clics mientras subía) y al limpiar las copias se borraron
también el bajo bueno y el ukelele del 28-09 (la confirmación no decía qué se borraba). Además:
el ✏️ (editar datos) y "mover a otra canción" reenviaban el asset completo desde memoria y
**podían borrar la sincronización** guardada desde el Lector.
**Decisión del PO:** aprobar los tres arreglos y probar con una canción de prueba.
**Implementación (`REPERTORIO/index.html`):** Guardar se bloquea ("Subiendo…") al subir tab/
metalófono/flauta; la confirmación del 🗑 muestra qué se borra; ✏️ y mover actualizan solo sus
campos (`update` parcial), sin tocar `tab_sync`/estado.
**Prueba (Claude):** canción "PRUEBA CLAUDE": 3 clics → 1 tab; sync simulada intacta tras editar
y mover; borrado con nombre visible. Canción, tab y archivo de prueba borrados.
**Deuda derivada (Notion):** guardar letras y ritmos también reenvía el asset completo (Baja).

### Microiteración: Nombre de cortesía de los assets

**Fecha:** 2026-10-05 · **Checkpoint:** `0765f63` · **Estado:** CERRADA (falta uso real).
**Necesidad:** el sistema mostraba el nombre del archivo original (p. ej. en la confirmación
del 🗑) y en "asignar tabs a estudiantes" no se distinguía melodía de armonía.
**Decisión del PO:** regla **Canción · Instrumento · Descripción · Dificultad**, para los **7
tipos** de asset (en no-tab, el tipo hace de instrumento); versión corta sin canción donde ya
se ve. Registrada como regla en `CLAUDE.md` §3.
**Implementación:** `comun/nombre-asset.js` (`nombreAsset`/`partesAsset`; quita de la etiqueta
el instrumento/dificultad/tonalidad autogenerados); aplicada en Repertorio, Lector (Biblioteca,
panel lateral, asignación a estudiantes, Lecciones, cabecera) y Planificador (selector de
metalófono). Sin columna nueva; el nombre del archivo solo se usa al descargar. Los cambios
del Loop (en pausa) en `tabs/index.html` se apartaron (stash) y quedaron **fuera** del checkpoint.
**Prueba (Claude):** regla corrida sobre los 104 assets reales; pantallas revisadas.

### Microiteración: Lector — tab sin sincronización real y "Abrir archivo"

**Fecha:** 2026-10-05 · **Checkpoint:** `cb6db9c` · **Estado:** CERRADA (falta uso real).
**Necesidad:** el bajo de Doma se quedaba pegado en la primera nota (el audio sonaba). Causa:
las secciones que el Lector guarda en `tab_sync` al abrir cualquier tab se tomaban como
"sincronizada" (falso "✓ Tempo map (0 pts)"). Además, "Abrir archivo" desde el computador
heredaba audio/sincronización/asset de la tab anterior. (El desfase de un compás del bajo de
Baby Shark resultó ser de una subida que se perdió; resubido, sincroniza bien.)
**Decisión del PO:** anotar ambos como deuda y luego arreglarlos juntos.
**Implementación (`tabs/index.html`):** `tieneSyncReal()` (solo grilla o tempo map cuentan);
abrir archivo local limpia audio, sincronización, asset y sección. Loop apartado del checkpoint.
**Prueba (Claude):** bajo de Doma avanza ("Sin sincronización"); guitarra de Baby Shark sigue
"✓ Tempo map (5 pts)" (no se reprodujo); archivo local sin audio heredado.

### Microiteración: Entrenador — versos borrosos, Alt+clic y botón Letra

**Fecha:** 2026-10-05 · **Checkpoint:** `8c456be` · **Estado:** CERRADA (falta uso real).
**Necesidad:** al esconder versos (doble clic) no gustaba el aspecto (bloques en caja gris);
el doble clic además movía el audio y la vista.
**Decisión del PO:** texto muy borroso; **Alt+clic** = verso, **Alt+doble clic** = estrofa,
sin mover audio ni vista; doble clic simple sin función; vuelve el botón **Letra** (nunca
desaparece, solo se atenúa).
**Implementación (`REPERTORIO/index.html`):** clase `.oculta` con `filter: blur`; esconder/
mostrar por clase sin re-render; atajos y ayuda actualizados.
**Prueba (Claude):** canción "1313", tema claro y oscuro; estado de la canción restaurado.
**Deuda derivada (Notion):** los botones Sync, Guardar y Pitch aún aparecen/desaparecen.

### Microiteración: Libro — notas de grupos terminados y "Evaluar individualmente"

**Fecha:** 2026-10-05 · **Checkpoint:** `299dede` · **Estado:** CERRADA (falta uso real).
**Necesidad:** (1) la nota "congelada" no se recalculaba al cambiar el piso ni al reevaluar
(caso Stefania Díaz); (2) "Evaluar individualmente" no permitía usar la rúbrica.
**Causa (1):** el trigger `libro_nota_grupo_terminado_congela` protegía también la columna
`nota`; la rúbrica sí se guardaba. 10 notas desfasadas en "Repertorio (Chicos y chicas)".
**Decisión del PO (opción A):** "terminado" congela la organización del grupo, no las cuentas.
**Cambio en Supabase (corrido por el PO):** `nota` sale del bloqueo del trigger
(`supabase/libro_schema.sql` actualizado).
**Implementación (`LIBRO/index.html`):** al abrir una evaluación se corrigen las notas
calculadas que no coinciden con su instrumento (solo instrumento completo, con aviso); el
recálculo avisa si falla; nota manual de integrante de grupo terminado bloqueada en la
pantalla; "Evaluar individualmente" abre la rúbrica si hay instrumento.
**Prueba (Claude):** 9 notas reales corregidas (Stefania 5,8 → 6,0), verificadas en la base;
rúbrica abierta para Florencia Astorga sin evaluar. Cambio de piso no probado con datos reales.

### Microiteración: Entrenador — loops, edición protegida y Escape

**Fecha:** 2026-10-05 · **Checkpoint:** `38cafcb` · **Estado:** CERRADA (falta uso real).
**Necesidad:** "los loops no se guardan como corresponde"; al editar la letra, Diapositiva/
Scroll borraba lo escrito; Escape cerraba el Entrenador (al editar y al reproducir).
**Causas (loops):** loops de canción suelta solo en `localStorage` del navegador; en sesión,
Ctrl+clic y renombrar no se guardaban; cerrar tras una sesión pisaba los loops de la canción.
**Decisión del PO:** loops en Supabase; bloquear lo que borra la edición; Escape paso a paso.
**Cambio en Supabase (corrido por el PO):** columna `repertorio_canciones.loops JSONB`
(`supabase/repertorio_loops.sql`).
**Implementación (`REPERTORIO/index.html`):** punto único `entGuardarLoops` (sesión → sesión;
canción → Supabase) + rescate único de loops locales; editar/guardar canción ya no reenvía
loops; en edición, Vista/Sync/recursos/‹ › atenuados y cerrar guarda antes; Escape: edición →
Sync (guarda si hubo cambios) → pausar → cerrar.
**Prueba (Claude):** "1313" y sesión "Pancho Morales": rescate, crear, renombrar, borrar y
cierre sin pisar; verso de prueba no se pierde con Scroll y Escape guarda sin cerrar; Escape
pausa. Estado de prueba restaurado.

---

### Desarrollo paralelo: Pasar lista — asistencia de la clase (Libro + Planificador)

**Fecha:** 2026-10-05 · **Estado:** APROBADO, en implementación (2 pasos). Ficha creada
**antes** de implementar. Notion: *"asistencia… snapshot de la asistencia ligada a la fecha
de la clase…"* (Alta).
**Necesidad profesional:** saber en el momento quién está en la sala para que lo que hago en
el Libro (participación, evaluaciones, entregas) considere a los ausentes: p. ej. saber al
tiro si puedo evaluar a los pendientes de una evaluación o no, porque están ausentes.
**Decisiones del PO (2026-10-05):**
- "Pasar lista" aparece al **Comenzar clase** (Planificador) y también desde el **Libro**
  (botón "Asistencia de hoy") para pasarla o corregirla; se puede omitir ("Ahora no").
- Se pasa **en negativo**: solo se marcan los ausentes. Corregible durante la clase
  (llegó / se fue), sin registrar horas ni estado "atrasado".
- Una lista por **clase** (sesión = contexto + fecha). Cursos, talleres y jefatura (cada uno
  con su población: matrícula, integrantes del taller, población vinculada).
- Visual: el **mismo render del tablero de Participación en modo proyector** (tiles).
- **Participación:** los ausentes de **hoy** (solo la clase actual) quedan **inhabilitados**
  como con Shift+clic (fuera del sorteo/tablero; Shift+clic los rehabilita).
- **Evaluaciones:** marca "ausente hoy"; salen de los pendientes de hoy; se pueden evaluar igual.
- **Entregas:** marca "ausente hoy" (distinta de "no entregó").
- Sin internet: se guarda en el computador y se sube sola al volver.
- Fuera de alcance: historial / % de asistencia (más adelante).
**Arquitectura prevista:** pieza compartida `comun/asistencia.js` (ventana "Pasar lista",
población por contexto, guardado con cola sin conexión) usada por Planificador y Libro.
Tabla nueva `libro_asistencia` (1 fila por sesión: `sesion_id` PK → `sesiones`, `ausentes`
uuid[] de `libro_estudiantes`, `actualizada_en`; RLS acceso_total), DDL en
`supabase/libro_asistencia.sql`, a correr por el PO.
**Pasos:** Paso 1 = pasar lista (Planificador + Libro + sin conexión), checkpoint propio.
Paso 2 = efectos en Participación / Evaluaciones / Entregas, checkpoint propio.
**Tabla creada por el PO en Supabase (2026-10-05):** `supabase/libro_asistencia.sql`.
**Paso 1 — IMPLEMENTADO (2026-10-05):** `comun/asistencia.js` (`Asistencia.abrir/obtener/
guardar/iniciar/onCambio`): tablero de tiles Presentes/Ausentes (layout sin scroll, nombre o
nombre+apellido si se repite, orden alfabético), cada toque se guarda (cola sin conexión,
subidas en serie), "Ahora no"/"Cerrar"/"Listo" ("Listo" sin marcar = todos presentes),
Escape cierra. Planificador: al "Comenzar clase" abre Pasar lista si el contexto es curso/
taller/jefatura. Libro: botón "📋 Asistencia" en el encabezado (lista de la sesión con que se
abrió el Libro).
**Pruebas Paso 1 (Claude):** Tercero (26), Cuerdas (15), Orientación → población de Octavo
(14); marcar ausente se guarda; sin conexión simulada queda en cola y sube al volver;
reabrir recuerda los ausentes; "Ahora no" no crea fila. Listas de prueba borradas.
Checkpoint Paso 1: `c80ca18`.
**Paso 2 — IMPLEMENTADO (2026-10-05):** Libro carga la lista de la clase (`ausentesHoy`, de
`ref.sesion`) al abrir y la actualiza al cerrar "Asistencia" o si otra ventana (Planificador)
la cambia (evento `storage`). Participación: al abrir una instancia, los ausentes entran a
`partInhab` (inhabilitados, como Shift+clic); los cambios de lista se aplican como diferencia.
Evaluaciones: marca "ausente hoy" en la tabla y en Disponibles; "Pendientes" excluye a los
ausentes de hoy. Entregas: marca "ausente hoy".
**Pruebas Paso 2 (Claude):** Tercero con 2 ausentes de prueba: 2 marcas en la evaluación
"Repertorio", Pendientes 12 → 10, 2 marcas en Disponibles, 2 inhabilitados en la participación
abierta. Entregas: sin entregas en Tercero → marca no probada con datos. Lista de prueba borrada
(tabla vacía).
**Pendiente de comprobación en uso real.**
**Deuda anotada en la misma conversación (Notion):** el Libro por defecto en modo
"Nombre Apellido" (sin coma) y siempre en orden alfabético.
**Iteración pedida por el PO (Notion, Alta):** barra del Planificador solo con íconos + botón
Asistencia; Pasar lista **no** se abre solo al comenzar (invasivo), se abre/corrige desde ese botón.

---

### Microiteración: Entregas — sentido de la entrega (Libro de Clases)

**Fecha:** 2026-10-05 · **Estado:** APROBADA, en implementación. Ficha creada antes de implementar.
**Necesidad profesional:** registrar también lo que el **profe entrega a los estudiantes**
(guías, fotocopias, partituras: material que se quedan), no solo lo que los estudiantes
entregan al profe.
**Decisiones del PO (2026-10-05):** el sentido se elige **al crear** y es **editable mientras
la entrega esté abierta**; por defecto "Estudiantes → Profe" (las existentes quedan así).
Préstamos/devoluciones = futuro, como casillero **"con devolución"** dentro de una entrega
(Notion).
**Alcance:** formulario de creación con sentido; textos según sentido ("deben entregar /
entregaron / Entregó" ↔ "deben recibir / recibieron / Recibió"); listas (panel del curso,
lista de entregas, archivo) distinguen "Material entregado"; cambio de sentido en el detalle
(abierta); ficha del estudiante: el material recibido **no** cuenta como deuda, línea aparte
"Material recibido: X de Y"; "ausente hoy" igual en ambos sentidos.
**Cambio en Supabase (corrido por el PO, 2026-10-05):** columna `libro_entregas.sentido`
('estudiantes' | 'profe', por defecto 'estudiantes') — `supabase/libro_entregas_sentido.sql`.
**Implementación (`LIBRO/index.html`):** `entTxt()`/`entEsProfe()` centralizan los textos por
sentido; selector "Sentido" al crear y en la cabecera del detalle (guardar cabecera; con la
entrega abierta); lista de entregas con "📤 material entregado por el profe"; panel del curso y
archivo con etiqueta "Material entregado"; ficha del estudiante con "Material recibido: X de Y"
aparte de "Entregas".
**Pruebas (Claude):** Tercero: crear "Profe → Estudiantes" ("¿A quiénes se les entrega?",
"deben recibir 26", casilla "Recibió"); cambiar a "Estudiantes → Profe" y volver; etiqueta en el
panel; "ausente hoy" visible en la entrega; ficha: "Entregas 0 · Material recibido 1 de 1".
Entregas y lista de prueba borradas. **Pendiente de comprobación en uso real.**
**Relación con el Bosquejo:** adelanta parte de **F6D (Clase)** y **F6G (Libro/alumnos)**.

---

### Microiteración: Barra del Planificador solo íconos + botón Pasar lista

**Fecha:** 2026-10-05 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** barra de la clase más limpia y pasar lista **cuando el profe
decide**, no obligado al comenzar (pedido Alta en Notion).
**Decisiones del PO (2026-10-05):**
- Botones de la barra **solo con ícono**; el nombre aparece al pasar el mouse.
  **"Comenzar / Terminar clase" conserva su texto** (botón principal; evita confusión con 📽️).
- Nuevo botón **Pasar lista** a la izquierda de Libro, con ícono **casilla con visto verde**
  (mismo ícono en el botón Asistencia del Libro y en la ventana de la lista).
- Mientras no se ha pasado lista, el ícono tiene un **brillo discreto** (llamado a la acción);
  pasada la lista, queda normal y el globo dice **"Modificar lista"** en vez de "Pasar lista".
- Aparece en curso, taller, jefatura y **recreo**; no en General.
- **"Comenzar clase" ya no abre la lista sola.**
**Alcance:** `PORTAL/index.html` (barra, botón, estado de la lista), `comun/asistencia.js`
(ícono compartido), `LIBRO/index.html` (ícono del botón Asistencia). Sin cambios en Supabase.
**Nota:** si un recreo no tiene estudiantes vinculados en el Libro, la lista dice que no hay
estudiantes registrados (comportamiento ya existente).
**Implementación:** `comun/asistencia.js` exporta `Asistencia.ICONO` y lo pone solo en toda
etiqueta `.icono-lista`; Planificador: `pasarLista()` + `renderBotonLista()` (consulta
`Asistencia.obtener`, se refresca al cerrar la lista y cuando otra ventana la cambia); se quitó
la apertura automática al comenzar.
**Pruebas (Claude):** Tercero 05-10: botón visible con brillo, "Pasar lista"; Tercero 26-10:
pasar lista (26 estudiantes, ícono en la ventana) → botón sin brillo, "Modificar lista"; lista de
prueba borrada; tipos: aparece en cursos/talleres/jefaturas/recreo, no en General; Libro muestra
el nuevo ícono en "Asistencia".
**Ajuste del PO (2026-10-05, tras ver la primera versión):** barra más alta (título, fecha e
íconos más grandes); el nombre de cada ícono aparece **arriba, en la barra de pestañas del
Workspace**, con la letra de la barra (mayúsculas, negrita), no como globo del navegador; ↔
reemplazado por un ícono de dos pantallas ("Cambiar de pantalla"). Nuevo mensaje del Workspace
`ws-etiqueta` (`texto`, `x`); con el Planificador suelto, la etiqueta aparece bajo el ícono.
**2º ajuste del PO (en uso, 2026-10-05):** la barra quedó muy alta → vuelve a **52 px, igual
que la barra del Workspace** (nunca más alta), con los tamaños de letra e íconos ya aprobados;
el botón Pasar lista suma un **saltito** al brillo para llamar más la atención.
**Deuda registrada (PO, prueba real en clases 2026-10-05):** el botón ↔ (pasar la Pizarra a la
otra pantalla) **no apareció** en el computador de la escuela. Ver deuda **M**.
**Relación con el Bosquejo:** adelanta parte de **F6D (Clase)**.

### Microiteración: ↔ siempre disponible + ausente queda en su lugar (deudas M y O)

**Fecha:** 2026-10-05 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** en clases el ↔ no aparecía (deuda **M**) y en Pasar lista el ausente
cambiaba de lugar, lo que confunde al leer la lista con los estudiantes (deuda **O**).
**Decisión del PO (2026-10-05):** arreglar ambas.
**Alcance:**
- **↔:** aparece siempre durante la clase en curso si el navegador puede mover ventanas y el
  computador tiene más de una pantalla (no depende de que el permiso ya esté dado). Al apretarlo,
  si falta el permiso, lo pide; si el permiso está bloqueado, avisa cómo activarlo.
  (`comun/clase-vivo.js` `Proyeccion.flip`, `PORTAL/index.html` `renderClase`).
- **Pasar lista:** un solo tablero; el ausente **se queda en su lugar** con aspecto inhabilitado
  (gris, borde punteado, tachado, como Shift+clic en Participación). (`comun/asistencia.js`)
Sin cambios en Supabase.
**Pruebas (Claude):** Tercero 26-10: marcar/desmarcar ausentes no cambia el orden del tablero;
el ausente se ve gris y tachado; contador correcto; lista de prueba borrada. El ↔ no se pudo
probar aquí (computador de prueba con una sola pantalla: el botón queda oculto, como corresponde).

### Microiteración: Pasar lista — resumen de ausentes + tablero en la Pizarra (deudas S y N)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** traspasar los ausentes al libro oficial sin buscarlos (S) y que los
estudiantes ayuden a pasar lista leyendo el tablero en el proyector (N).
**Decisión del PO (2026-10-06):** hacer ambas.
**Alcance (`comun/asistencia.js`, `PIZARRA/index.html`):**
- **Resumen:** franja abajo del tablero, solo en la pantalla del profe, con los ausentes
  ordenados por **número de lista + apellido** (número = posición de la matrícula). En talleres
  no hay número de lista: se muestra apellido y nombre.
- **Pizarra:** mientras la lista está abierta (desde el Planificador o el Libro), la Pizarra
  muestra **el mismo tablero**, solo para mirar (se maneja desde la pantalla del profe), y se
  actualiza con cada toque; al cerrar la lista, desaparece. Si la Pizarra se abre con la lista
  ya abierta, la pide y la muestra.
Sin cambios en Supabase.
**Implementación:** `poblacion()` trae `posicion` como número de lista; franja `.asis-res`;
canal `BroadcastChannel('profe-asistencia')` (estado / pedir / cerrar) y `Asistencia.espejo()`
llamado desde la Pizarra (que ahora carga `comun/asistencia.js`).
**Pruebas (Claude):** Tercero 26-10 en dos pestañas (Planificador + Pizarra): resumen
"1 ACIARES · 22 RUBIO"; la Pizarra muestra los 26 nombres con los mismos 2 ausentes, sin botones
ni resumen; Pizarra recargada con la lista abierta → la vuelve a mostrar; al cerrar la lista
desaparece de la Pizarra. Lista de prueba borrada.

### Desarrollo paralelo: Nombre social del estudiante (deuda R)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** hay estudiantes que usan un nombre social distinto del legal; el
profe debe poder registrarlo y que se use en clases.
**Decisiones del PO (2026-10-06):**
- Por ahora reemplaza **solo el nombre de pila**; los apellidos siguen siendo los legales.
- Se ingresa en la **ficha del estudiante** (Matrícula), campo opcional; en la ficha se ven los
  dos nombres.
- Se usa en **todo el Libro y en Pasar lista** (tablero, Pizarra, Participación, Evaluaciones,
  Entregas, orden alfabético, búsqueda).
- Van con el **nombre legal**: el **Informe previo** y el **Informe de resultados** (UTP).
- El **resumen de ausentes** de Pasar lista va con número de lista + **apellido** (no cambia).
- **Sin ninguna señal** visible en pantallas de clase (el nombre social se ve como cualquier otro).
**Cambio en Supabase (lo corre el PO):** columna `libro_estudiantes.nombre_social` (texto,
opcional) — `supabase/libro_nombre_social.sql`.
**Alcance técnico:** `LIBRO/index.html` (consultas de estudiantes, formato de nombres, ficha,
informes con nombre legal), `comun/asistencia.js` (tablero y Pizarra).
**Cambio en Supabase corrido por el PO (2026-10-06).**
**Implementación:** `nombrePila(est)` (social o legal) usado por `nombreFmt` (con `legal=true`
para el Informe de resultados), orden alfabético, búsqueda, nombres del proyector de
Participación; las 10 consultas de estudiantes traen `nombre_social`; ficha con "Nombre legal" +
campo "Nombre social" (Guardar / Enter; vacío = vuelve al legal) — `matGuardarNombreSocial`.
`comun/asistencia.js` usa el nombre social en el tablero y la Pizarra. La coincidencia por
identidad al matricular (`matEstKey`) sigue usando el nombre legal. El Informe previo no lista
estudiantes.
**Pruebas (Claude):** Tercero, ACIARES DARIEL con nombre social "TOMÁS": ficha "ACIARES, TOMÁS"
con nombre legal "ACIARES, DARIEL"; lista de Matrícula y tablero de Pasar lista muestran TOMÁS;
el formato del informe da el nombre legal. Nombre social de prueba borrado y sin lista guardada.

### Desarrollo paralelo: Listas de las actividades según la matrícula al día (deuda P)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** Eduardo Oyarzún (retirado el 28-09) seguía apareciendo en la
participación "EL MUSEO" y en una entrega abiertas; lo mismo Laura Oyarzún (retirada el 24-09).
**Auditoría (Claude):** Participación y Entregas guardan la lista del curso del día en que se
crean y no se actualizan; Evaluaciones abiertas suman a los nuevos pero no sacan a los retirados.
**Decisiones del PO (2026-10-06):**
- Mientras la actividad (participación, entrega, evaluación) está **abierta**, su lista sigue la
  **matrícula al día**: los nuevos se agregan solos; los **retirados dejan de aparecer** y no
  cuentan en totales, sorteo ni pendientes — **aunque tengan algo anotado**.
- **No se borra nada:** lo anotado del retirado queda guardado (ficha); si se reintegra, vuelve.
- **Cerradas = foto** del momento del cierre (historial); para corregir, se reabre.
- **Talleres:** igual, según quién pertenece hoy al taller.
**Alcance:** `LIBRO/index.html`. Sin cambios en Supabase.
**Implementación:** `listaAlDia()` (con `poblacionContexto(hoy)`) al abrir el detalle de una
participación o entrega **abierta**: inserta las filas que faltan y oculta a los no vigentes.
Evaluación abierta: oculta a los no vigentes (los nuevos ya se agregaban). Entrega: el nuevo queda
"pendiente" si la entrega era para todo el curso; si era para algunos, "no aplica".
**Pruebas (Claude):** Cuarto: participación "EL MUSEO" (abierta, 26 filas guardadas) muestra 25,
sin Eduardo; entrega "cuaderno…" muestra 25, sin Eduardo, y su fila sigue guardada; evaluación
abierta "CHICOS" muestra 25, sin Eduardo.

### Microiteración: Nombre social — aviso al guardar (deuda T)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** confirmar a la vista que el nombre social quedó guardado.
**Decisión del PO (2026-10-06):** al guardar, mostrar un aviso "Nombre social guardado".
**Alcance:** `LIBRO/index.html` (ficha del estudiante). Si se guarda vacío, el aviso dice
"Nombre social borrado" (vuelve el nombre legal). Sin cambios en Supabase.
**Pruebas (Claude):** Cuarto: guardar "PRUEBA" → "Nombre social guardado"; guardar vacío →
"Nombre social borrado"; el estudiante quedó sin nombre social.

### Microiteración: ↔ visible también con una sola pantalla (deuda Q)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** que el botón no "desaparezca" sin explicación cuando el proyector
no está conectado.
**Decisión del PO (2026-10-05/06):** el ↔ aparece siempre durante la clase; con una sola
pantalla, al apretarlo dice explícitamente que no hay dos pantallas conectadas; al conectar la
segunda (sin recargar), funciona normalmente.
**Alcance:** `comun/clase-vivo.js` (`Proyeccion.flip` devuelve el motivo: 'una-pantalla',
'sin-api', 'sin-pizarra', 'denegado'), `PORTAL/index.html` (botón visible en la clase en curso
y aviso según el motivo). Sin cambios en Supabase.
**Pruebas (Claude):** computador con una pantalla: el ↔ se ve con la clase en curso y se oculta
sin clase; al apretarlo avisa "No hay dos pantallas conectadas…". Con dos pantallas no se pudo
probar aquí (queda para uso real con el proyector).

### Desarrollo paralelo: Control de la Pizarra desde el Planificador

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** manejar la proyección desde la pantalla del profe sin ir a la ventana
de la Pizarra, y que lo que se escribe en la presentación se vea al tiro en el proyector.
**Decisiones del PO (2026-10-06):**
- Botones **◀ ▶** ("Anterior" / "Siguiente") en la barra del Planificador, junto a 📽️ y ↔,
  solo con la clase en curso; hacen lo mismo que las flechas en la Pizarra (en canción: verso o
  estrofa según el modo). Con la Pizarra cerrada avisan "La Pizarra no está abierta".
- **Clic en una diapositiva de la vista previa** con la clase en curso → la Pizarra salta a esa.
- **Texto al día:** al dejar de escribir (~1 s, con el guardado automático) la Pizarra se rehace
  con el texto nuevo; se queda en la diapositiva que mostraba (aunque cambie de número) y solo
  redibuja la actual si su texto cambió (no reinicia un video).
- Sin contador "3 / 12" por ahora. Todo funciona sin internet (misma computadora).
**Alcance:** `comun/clase-vivo.js` (canal de órdenes Planificador → Pizarra), `PORTAL/index.html`,
`PIZARRA/index.html`. Sin cambios en Supabase.
**Implementación:** `Proyeccion.ordenar(sesionId, orden)` / `Proyeccion.pizarraViva()` (por
`localStorage`, como ↔); la Pizarra las atiende en `ordenDelPlanificador` (filtra por sesión) y
`textoAlDia`. Planificador: `navPizarra`, `controlaPizarra`, orden 'ir' en el clic de la vista
previa (lleva el texto actual) y orden 'texto' en `guardarPres` (antes de subir a internet).
**Pruebas (Claude):** Planificador + Pizarra en dos pestañas: ◀ ▶ visibles solo con la clase en
curso; ▶ ▶ lleva de la 1ª a la 3ª; borrar la 1ª diapositiva deja la Pizarra en la misma ("C");
editar otra diapositiva no redibuja la actual; clic en la vista previa salta a esa diapositiva
con el texto actual. Sin guardar nada en la base (textos de prueba solo enviados a la Pizarra).

### Desarrollo paralelo: Entrenador en la Pizarra (espejo)

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** durante la clase, mostrar en el proyector la letra del Entrenador que
el profe está usando, sin dejar la Pizarra de lado y sin manejar dos ventanas.
**Decisiones del PO (2026-10-06):**
- Botón tipo interruptor en el Entrenador, **solo si hay una clase en curso**. Encendido: la
  Pizarra muestra una copia de la vista del Entrenador (canción, recurso, verso activo, versos
  coloreados y escondidos, Scroll/Diapositiva, tema, avance). Apagado: la Pizarra se "suelta" y
  vuelve **exactamente** a la diapositiva donde estaba.
- **Suena solo el computador del profe;** la copia del proyector va en silencio y sigue el avance.
- Si la Pizarra no está abierta, el botón la abre en el proyector (igual que "Comenzar clase").
- Botones y menús del Entrenador no se proyectan: solo la letra.
**Alcance:** `REPERTORIO/index.html` (botón + emisión del estado; modo `?espejo=1` que obedece),
`PIZARRA/index.html` (capa a pantalla completa con el Entrenador espejo). Misma computadora, sin
internet (BroadcastChannel + `localStorage`). Sin cambios en Supabase.
**Fuera de alcance:** sincronizar la reproducción de ritmos/metalófono (se muestra el recurso, no
se sincroniza su reproductor), loops como tales (la copia sigue el tiempo del audio).
**Implementación:** Entrenador: botón `#ent-btn-espejo` ("📽️ Pizarra", naranjo encendido),
visible según `ClaseVivo`; `entToggleEspejo` abre la Pizarra si no está viva (`Proyeccion.abrir`),
marca `localStorage.profe_espejo_entrenador` y emite el estado cada 300 ms y al
reproducir/pausar/saltar (canal `profe-espejo-entrenador`). Con `?espejo=1` el mismo archivo solo
muestra la letra (`body.espejo`), aplica el estado (`espejoAplicar`) con el audio en silencio y
corrige el avance si se desfasa más de 0,35 s. Pizarra: capa `#espejo-entrenador` (iframe) bajo el
tiempo perdido y Pasar lista; se quita al soltar. Terminar la clase o cerrar el Entrenador suelta el espejo.
**Pruebas (Claude):** Entrenador + Pizarra en dos pestañas con una clase simulada: botón visible
solo con clase; al encender, la Pizarra muestra la canción sin botones, en silencio; coinciden
versos coloreados, Diapositiva y posición; sonando, la copia va a la par (diferencia de
centésimas); al soltar desaparece la capa; una Pizarra abierta después también lo muestra;
terminar la clase oculta el botón y suelta el espejo. Con proyector real queda para uso en clases.

### Microiteración: Entrenador en la Pizarra — ritmos

**Fecha:** 2026-10-06 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** que en el Modo Clase se proyecten también los recursos del Entrenador
que no son letra. Orden aprobado: ritmo → metalófono. **Tablaturas: postergadas por el PO**
(no las necesita por ahora).
**Decisión del PO (2026-10-06):** partir por el ritmo: con el espejo encendido, la Pizarra muestra
el ritmo (Partitura/Infantil, tresillo) y sigue la reproducción del profe (cursor y destellos de
los golpes). Sin los controles del ritmo en el proyector; suena solo el computador del profe.
**Alcance:** `REPERTORIO/index.html` solamente. **No se toca `ritmo-render.js`** (protegido): el
Entrenador del profe envuelve su propio objeto de dibujo para avisar cada movimiento del cursor y
cada golpe; la copia los repite en su dibujo, sin reproductor ni sonido.
**Implementación:** `espejoEnvolverLayout` (profe) envuelve `setCursor`/`fx`/`limpiarFx` del dibujo
del ritmo y avisa cada llamada (mensaje `ritmo`); `espejoRitmo` (copia) las repite. El estado
lleva `ritmoModo` y `ritmoTresillo`; la copia redibuja si cambian. Controles del ritmo ocultos.
**Pruebas (Claude):** ritmo real ("Figuras rítmicas en 6/8") con clase simulada: la copia muestra
el ritmo sin controles; al hacerlo sonar en el Entrenador del profe, la copia recibe el cursor y
los destellos de los golpes y los dibuja; al terminar se limpia; Partitura→Infantil y Tresillo se
copian. (En el navegador de pruebas la animación del profe va frenada por estar oculta; la
fluidez real se comprueba en clases.)
**Ajuste (PO, 2026-10-06):** en uso real el cursor del ritmo en la Pizarra no tenía fluidez (llegaban
pocos avisos). Ahora cada aviso trae la hora y el BPM; la copia pone el cursor al tiro y entre
avisos lo avanza por su cuenta a cada cuadro (`espejoRitmoPintar`), solo si el del profe avanza
(precuenta quieta) y hasta 1 s sin avisos. Probado simulando 3 avisos/s: 38 posiciones distintas
en 3 s, avance parejo y vuelta al inicio al terminar la repetición.
**Ajuste 2 (PO, 2026-10-06):** seguía pegado ("en el primer golpe, y de repente en otro"), aunque
en la pantalla del profe iba fluido. Causa probable: probando con una sola pantalla, la Pizarra
tapa al Entrenador y el navegador frena la ventana tapada (deja de mover su cursor y de avisar;
el sonido sigue). Ahora el espejo no depende de eso: al dar Play, el Entrenador avisa **una vez**
la hora de inicio del patrón (con la precuenta) y el BPM (`espejoEnvolverPlayer`); la copia
calcula con su propio reloj el cursor y los destellos (`espejoRitmoPintar`), y Detener avisa
'stop'. Reemplaza al envoltorio del dibujo y a los avisos por cuadro. Probado: un solo aviso →
cursor quieto en la precuenta, luego 39 posiciones distintas en 5 s y 12 destellos; Detener lo limpia.
**Pendiente del pedido "todos los recursos en la Pizarra":** metalófono (siguiente).
Tablaturas: postergadas por el PO (deuda V).

### Microiteración: Entrenador en la Pizarra — metalófono

**Fecha:** 2026-10-06 · **Estado:** CERRADA — comprobada por el PO en uso real (2026-10-06): las placas se encienden al tocar y el instrumento se ve centrado. Ficha creada antes de implementar.
**Necesidad profesional:** proyectar el metalófono que el profe usa desde el Entrenador.
**Decisión del PO (2026-10-06):** seguir con el metalófono tras el ritmo (orden aprobado).
Con el espejo encendido y el Metalófono abierto (botón "Abrir en Metalófono" del Entrenador),
la Pizarra muestra las placas con sus nombres y colores, las notas que se encienden al tocar,
la práctica (nota destacada) y la precuenta. Sin los botones del Metalófono; suena solo el
computador del profe. Al cerrar el Metalófono, la Pizarra vuelve a mostrar el Entrenador.
**Alcance:** `REPERTORIO/index.html` solamente. **No se modifica el Metalófono**
(`METAL21 (ALPHA).HTML`): el Entrenador del profe observa lo que se ve en su ventana del
Metalófono (mismo sitio) y la copia en la ventana del Metalófono del espejo.
**Implementación:** profe: `espejoMetalObservar` (MutationObserver sobre su Metalófono, a cada
carga) → `espejoMetalFoto` (por placa: clases, estilo y nombre; precuenta; colores) enviada como
mensaje `metal` (máx. una por cuadro) y también en la emisión periódica. El estado lleva `metal`.
Espejo: `espejoMetalVista` abre/cierra su Metalófono (sin canción, sin barra de botones) y
`espejoMetalAplicar` copia solo lo que cambió.
**Pruebas (Claude):** melodía real ("Aló, Aló") con clase simulada: al abrir el Metalófono con el
espejo encendido, la Pizarra lo muestra sin botones; se copian el cambio de nombres de las
placas, el color de fondo, una placa encendida y la precuenta; al cerrar el Metalófono la Pizarra
vuelve al Entrenador. La melodía sonando no se pudo ver avanzar aquí (el navegador de pruebas,
oculto, frena la animación del propio Metalófono); queda para uso real.
**Ajuste tras la primera prueba del PO (2026-10-06):** la Pizarra quedaba mostrando el botón
"Abrir en Metalófono". Ahora el espejo abre el Metalófono si el profe lo abrió **o** si el recurso
activo es un metalófono (aunque el profe no haya apretado el botón). Probado: con solo el botón en
la pantalla del profe, la Pizarra muestra las 25 placas; al volver a la letra, vuelve la letra.
Nota: tras cada actualización, recargar el Workspace (Ctrl+Shift+R) y abrir de nuevo la Pizarra,
porque las ventanas ya abiertas siguen con la versión anterior.
**Ajuste (PO, 2026-10-06):** "funciona"; el instrumento quedaba arriba con una franja negra
abajo. Ahora ocupa toda la Pizarra y las placas quedan centradas (sin la barra, `#viewport` al
alto completo). Probado: caja 0–768 px, placas 79–695 px.
**Ajuste (PO, 2026-10-06):** en uso real las placas se encienden al tocar ("todo funciona"), pero
seguía la franja negra: la Pizarra cargaba una copia guardada (vieja) del Entrenador (el sitio se
guarda 10 min en el navegador). Ahora la Pizarra carga el espejo con un parámetro `v` distinto cada
vez (siempre la versión al día) y el estilo del Metalófono proyectado se asegura en cada foto.

### Microiteración: Entregas — solo los que aplica (deuda Z)

**Fecha:** 2026-10-07 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** en una entrega para algunos estudiantes, ver solo a quienes les corresponde
y poder corregir si alguien quedó mal como "No aplica".
**Decisión del PO (2026-10-07):** propuesta aprobada: lista solo con los que aplica + botón "Mostrar no
aplica (N)" que despliega al resto con el botón "Aplicar" (y "No aplica" en los pendientes), como en
Evaluaciones.
**Alcance:** `LIBRO/index.html` (detalle de la entrega). El cambio se guarda con "Guardar entrega",
como las marcas. Sin cambios en Supabase (el estado ya existe).
**Implementación:** `entMostrarNA` (se reinicia al abrir cada entrega), botón "Mostrar/Ocultar no aplica (N)"
junto a "Pendientes", `filtrarEntregas` oculta los `no_aplica`, botones "Aplicar" (no aplica → pendiente) y
"No aplica" (pendiente → no aplica, solo con los no aplica a la vista); la vista se redibuja conservando
búsqueda y filtro.
**Pruebas (Claude):** entrega real de Tercero ("guía con QR…": 8 pendientes, 15 no aplica, 3 entregados):
se ven 11; "Mostrar no aplica (15)" muestra 26 con 15 "Aplicar" y 8 "No aplica"; Aplicar sube "deben" a
12 y No aplica lo baja a 11; Ocultar vuelve a 11. Sin guardar: la base quedó igual (8/15/3).

### Microiteración: Pasar lista — resumen de ausentes en vertical (deuda AA)

**Fecha:** 2026-10-07 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** traspasar los ausentes al libro oficial sin leer una línea horizontal.
**Decisión del PO (2026-10-07):** vertical, uno por línea `N° - APELLIDO`; si no cabe, botón "Resumen"
con pantalla aparte (Claude recomendó la pantalla aparte para no quitar espacio al tablero).
**Alcance:** `comun/asistencia.js`: el pie del tablero muestra la cantidad de ausentes y el botón
"Resumen (N)", que abre una pantalla con la lista vertical en letra grande y "Volver" (Esc vuelve al
tablero). Solo en la pantalla del profe. Sin cambios en Supabase.
**Implementación:** pie `.asis-res` = "AUSENTES n" + botón "📋 Resumen (n)" (desactivado si no hay);
`abrirResumen` pinta `.asis-resumen` sobre el tablero (uno por línea, `N° - APELLIDO`, orden por n°;
talleres: `APELLIDO NOMBRE`) y se mantiene al día si está abierto; "Volver" o Esc vuelven al tablero.
**Pruebas (Claude):** Tercero (26) con el guardado desconectado (sin tocar la base): 3 ausentes →
pie "Resumen (3)"; resumen: "7 - ESPINOSA / 10 - MANSILLA / 27 - SCHAAF", "3 estudiantes"; Esc vuelve al
tablero sin cerrar Pasar lista. La base no recibió ninguna lista.
**Iteración 2 (PO, 2026-10-07) — IMPLEMENTADA (pendiente de uso real), aprobada:** (1) el botón "📋 Resumen (N)" va en la
barra de arriba y se quita la barra de abajo (sin ausentes, el botón no aparece); (2) el resumen nunca se
desborda: se reparte en columnas y ajusta la letra para que todo quepa, sin scroll (orden por n° de lista,
de arriba abajo por columna); (3) botones sin redundancia (auditoría: "Cerrar" y "Listo" hacían lo mismo
salvo con la lista sin tomar y sin ausentes): lista sin tomar y sin toques → "Ahora no" (no registra; el
botón del Planificador sigue brillando) y "Todos presentes" (guarda la lista vacía); después de un toque o
con la lista ya tomada → solo "Listo". Esc cierra igual que antes.
*Implementación:* botón `data-acc="resumen"` en `.asis-bar` (oculto sin ausentes); se eliminó `.asis-res`;
`layoutResumen` elige 1–6 columnas y la letra más grande que hace caber todo (grid por columnas, sin
scroll), también al cambiar el tamaño; `botones()` decide "Ahora no" + "Todos presentes" / solo "Listo".
*Pruebas (Claude), Tercero con guardado desconectado:* al abrir → "Ahora no" + "Todos presentes", sin
botón Resumen ni barra de abajo; tras marcar → solo "Listo" y "📋 Resumen (22)"; resumen a 1280×720:
22 líneas en 3 columnas × 8, letra 47 px, sin desborde ni scroll; a 1024×600 con 26: 3 × 9, 33 px, sin
desborde. La base no recibió ninguna lista.

### Desarrollo paralelo: Libro por nombre de pila, A–Z (deuda Y)

**Fecha:** 2026-10-07 · **Estado:** IMPLEMENTADA, pendiente de comprobación en uso real. Ficha creada antes de implementar.
**Necesidad profesional:** reconocer rápido a cada estudiante en el Libro (por su nombre, en orden alfabético),
sin confundir nombres repetidos o que suenan igual.
**Decisión del PO (2026-10-07):** plan Y autorizado completo (ver deuda Y): (1) todo el Libro por nombre de pila
(o nombre social), A–Z por defecto; (2) nombre + apellido si el nombre se repite en el curso/taller o si el
estudiante tiene marcada "mostrar con apellido"; (3) orden por n° de lista como opción secundaria (botón
actual, con APELLIDO, NOMBRE); (4) informes UTP con nombre legal completo (sin cambio); (5) resumen de
ausentes de Pasar lista sin cambio; (6) opción "mostrar con apellido" en la ficha de Matrícula; (7) el nombre
mostrado es siempre el nombre completo registrado; (8) la ficha de Matrícula permite corregir el nombre legal.
**Alcance:** `LIBRO/index.html`, `comun/asistencia.js` (Pasar lista usa la misma regla). Supabase: columna
nueva `libro_estudiantes.mostrar_apellido` (boolean, por defecto falso) en `supabase/libro_mostrar_apellido.sql`,
**a correr por el PO**; la corrección del nombre legal escribe el campo `nombre` existente.
**Columna creada por el PO en Supabase (2026-10-07):** `supabase/libro_mostrar_apellido.sql`.
**Implementación:** `ordenModo` parte en 'alfa' (botón "NOMBRE · A–Z" / "APELLIDO, NOMBRE · 1–N");
`nombreCorto` (nombre completo o nombre social; + apellido si se repite en `nombresRepes` o si
`mostrar_apellido`); `cargarNombresRepes` cuenta la población del contexto (curso: matrícula del año
con retirados; taller: pertenencias) al iniciar y al recargar la matrícula / cambiar nombres;
`nombreFmt(est, true)` (informes y ficha) = APELLIDO, NOMBRE fijo; búsquedas con `nombreBuscar`
(nombre + social + apellido); todas las consultas traen `mostrar_apellido`; Proyector de Participación
y Pasar lista (`comun/asistencia.js`, también su espejo) respetan la opción. Ficha de Matrícula:
nombre legal editable (nombres + apellidos, en mayúsculas, con confirmación; aviso "Nombre legal
guardado") y casilla "Mostrar con apellido" (se guarda al marcar).
**Pruebas (Claude):** Primero: A–Z por nombre, "TOMAS MARTINEZ / TOMAS SOTO" y "VIOLETA ESPINOZA /
VIOLETA LOPEZ" con apellido, el resto solo nombre; Pasar lista igual (23). Quinto: "JUAN", "MARÍA
JESÚS" completa; marcar "mostrar con apellido" → "JUAN VEGA", desmarcar → "JUAN" (revertido en la
base); buscar "vega" encuentra a JUAN; corregir nombre legal "juan josé" (guardado desconectado) →
envía "JUAN JOSÉ"/"VEGA", muestra "JUAN JOSÉ" y legal "VEGA, JUAN JOSÉ"; Entregas: botón
"NOMBRE · A–Z" ↔ "APELLIDO, NOMBRE · 1–N" con "ARAUJO, SALVADOR"… Base sin cambios (Juan sigue
"JUAN", ninguna casilla marcada). Sin errores en consola.

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

### J. Pendientes semanales — observaciones abiertas
*Origen: gestión semanal de pendientes (2026-09-23).*
- **Configuración fija:** "jueves 18:00" y el primer cierre (24/09) están como constantes
  en `pendientes_cierre_semanal()`. Responden a la semana L–J del Autor; para V1 (varios
  profesores/horarios) deberán ser configurables (principio F3.1).
- **Vacaciones y feriados:** no existen en el sistema; en esos períodos los pendientes se
  seguirán trasladando y sumando semanas (fuera de alcance por decisión del PO).
- **Pantallas abiertas:** el Dashboard lee los pendientes una sola vez; si queda abierto
  durante el cierre, muestra el estado anterior hasta recargarlo (comportamiento previo).
- **Destino de la Bitácora:** la Bitácora elige "la siguiente clase existente", no el
  horario; en casos raros (clases sueltas fuera del horario) puede diferir del destino del
  cierre. El cierre siguiente lo corrige.
- **Pendiente vacío:** "＋ Agregar" crea la fila con texto vacío; si se cierra la pestaña a
  mitad, queda una fila en blanco visible en el Dashboard. El cierre no la mueve.
- **ADMIN:** si alguien creara un pendiente de categoría antigua desde ADMIN (sin enlace),
  no se vería en el Dashboard ni participaría del cierre.
- **No resuelto.**

### K. Eliminaciones en el Libro — observaciones abiertas
*Origen: eliminar actividades, OA y adecuaciones (2026-09-24).*
- **Nota de quien pierde el instrumento:** se sigue la regla existente del Libro. Si un
  estudiante queda **sin** instrumento (p. ej. al eliminar el OA o una adecuación cuyo
  destino no tiene instrumento), conserva la nota que tenía, que pasa a verse como nota
  manual. Si queda **con** instrumento, la nota se recalcula. Observar en uso real si
  conviene otra cosa.
- **Resultados del instrumento de una adecuación eliminada:** siguen guardados porque el
  instrumento sigue en la lista de la evaluación (no quedan huérfanos). Si luego se
  "Quita" ese instrumento, se borran con él.
- **No hay papelera:** el borrado es real e irreversible (decisión del PO); la protección
  es la confirmación con la palabra ELIMINAR.
- **No resuelto.**

### L. Repertorio / Biblioteca — densidad del menú de acciones de los assets
*Origen: Metalófono Web — Etapa 2 (`093af2a`), observación del PO al aprobarla (2026-09-30).*
- Cada asset concentra varias acciones y el botón **"🔗 Compartir"** ocupa demasiado
  espacio visual.
- A futuro, revisar la organización y presentación de esas acciones para:
  - aumentar la densidad útil;
  - liberar espacio vertical;
  - mejorar especialmente la experiencia en **móvil**;
  - evitar que la acumulación de botones haga perder espacio y legibilidad.
- Corresponde al **futuro rediseño del área de Repertorio**, que más adelante se llamará
  **Biblioteca** (Bosquejo **F6E**).
- **No resuelto.** No rediseñar ni cambiar el botón Compartir fuera de esa iteración.

### M. Modo Clase — el botón ↔ no aparece en el computador de la escuela
*Origen: prueba real en clases (PO, 2026-10-05).*
- En el computador de la escuela (no el del profe) el botón **↔** para pasar la Pizarra a la
  otra pantalla **no apareció**. El botón solo se muestra si el navegador dio permiso para
  manejar pantallas; probablemente ese permiso no se concedió o el navegador no lo ofrece.
- Auditar: navegador usado, si se abrió la versión en línea, si hubo pedido de permiso.
- 2026-10-05 (tarde): tampoco apareció en el uso del PO probando la barra nueva.
- **Resuelto** en la microiteración "↔ siempre disponible + ausente queda en su lugar" (pendiente de uso real).

### N. Pasar lista — el mismo tablero en las dos pantallas
*Origen: PO, uso en clases (2026-10-05).*
- Pasar lista es una acción propia de la clase: el tablero de nombres debe verse **también en
  la Pizarra (proyector)**. El profe controla desde su pantalla; los estudiantes leen la lista y
  le dicen a quién marcar ausente.
- **Resuelto** en la microiteración "Pasar lista — resumen de ausentes + tablero en la Pizarra" (pendiente de uso real).

### O. Pasar lista — el ausente no cambia de lugar
*Origen: PO, uso en clases (2026-10-05).*
- Hoy el ausente baja a una lista aparte (como en Participación cuando alguien participa).
  Se quiere que el ausente **se quede en su lugar del tablero**, con aspecto **inhabilitado**
  (como Shift+clic en Participación).
- **Resuelto** en la microiteración "↔ siempre disponible + ausente queda en su lugar" (pendiente de uso real).

### P. Participación — estudiante retirado sigue apareciendo
*Origen: PO (2026-10-05).*
- Eduardo Oyarzún fue retirado de la matrícula hace un tiempo y **sigue saliendo en las
  participaciones**. Auditar cómo Participación arma su lista (relacionado con
  "sincronización de población con Matrícula": hoy las listas son una foto del momento de crearlas).
- **Resuelto** en el desarrollo "Listas de las actividades según la matrícula al día" (pendiente de uso real).

### Q. Modo Clase — ↔ visible también con una sola pantalla
*Origen: PO (2026-10-05).*
- Hoy, con una sola pantalla, el ↔ queda oculto. Se quiere que **aparezca igual** durante la
  clase y, al apretarlo, **diga explícitamente** algo como "No hay dos pantallas conectadas".
- Una vez conectada la segunda pantalla (sin recargar), el ↔ debe **funcionar normalmente**.
- **Resuelto** en la microiteración "↔ visible también con una sola pantalla" (pendiente de uso real).

### R. Libro / Matrícula — nombre social
*Origen: PO (2026-10-05). **Importante.***
- Hay estudiantes que usan un **nombre social** distinto del nombre legal. En la **ficha de
  matrícula** debe poder agregarse ese dato a quien lo necesite.
- El nombre social se usa **en todo** (Participación, Pasar lista, Evaluaciones, Entregas,
  tableros, etc.), **excepto en los documentos formales** que se generen (principalmente los
  **informes de resultados para UTP**), donde va el nombre legal.
- Implica un cambio en Supabase (dato nuevo del estudiante): requiere autorización del PO.
- **Resuelto** en el desarrollo "Nombre social del estudiante" (pendiente de uso real).

### S. Pasar lista — cuadro resumen de ausentes
*Origen: PO (2026-10-06).*
- En la parte de abajo del tablero de Pasar lista, un **cuadro resumen** con los ausentes:
  **número de lista y apellido**, para traspasarlos al libro de clases oficial.
- Uso transitorio: a futuro caerá en desuso.
- **Resuelto** en la microiteración "Pasar lista — resumen de ausentes + tablero en la Pizarra" (pendiente de uso real).

### T. Nombre social — aviso al guardar
*Origen: PO (2026-10-06).*
- Al guardar un nombre social en la ficha, mostrar un aviso (badge) **"Nombre social guardado"**.
- **Resuelto** en la microiteración "Nombre social — aviso al guardar" (pendiente de uso real).

### U. Lector Tabs — juego formativo "¿Esta postura es correcta?"
*Origen: PO (2026-10-06).*
- Hoy existe como **material de clase en PowerPoint** (`MATERIAL CLASE/Postura mano izquierda - guitarra.pptx`, fuera de las apps): 5 fotos de la mano izquierda en el diapasón; cada foto aparece con "?" y luego con la respuesta (✕ incorrecta; la última ✓ correcta y cierre con "LA PINZA"). Fondo de las fotos difuminado.
- **Deuda:** formalizarlo como un **juego formativo dentro del Lector Tabs**: se muestra la foto, los estudiantes responden **"sí" o "no"** (¿es correcta?) y luego se revela la respuesta.
- Hay **más imágenes** que el PO sumará a esta colección.
- Pendiente de diseño con el PO (dónde vive, quién responde, si se registra algo). **No implementar** sin ficha y aprobación.

### V. Entrenador en la Pizarra — tablaturas (postergada)
*Origen: PO (2026-10-06).*
- Hoy el Entrenador **no muestra** las tablaturas/partituras (archivos MXL): intenta abrir el archivo
  tal cual. Para verlas en la Pizarra habría que mostrar el Lector Tabs dentro del Entrenador y copiarlo.
- **Postergada por decisión del PO** ("no lo necesito por de pronto"). No implementar sin nueva decisión.

### W. PWA móvil — grabar audios de la clase (biblioteca de audios del curso)
*Origen: PO (2026-10-07). **Diseño propuesto, pendiente de revisión detallada del PO** (pidió que se le presente más adelante). No implementar.*
- **Necesidad:** con clase en curso, grabar audios desde el celular que queden ligados al día/fecha/curso, formando una biblioteca de audios del curso, consultable desde la sesión de cada curso. Uno de los fines: determinar con exactitud el **tono conveniente** para cantar cada canción del repertorio del curso.
- **Hallazgos (auditoría):** el móvil hoy solo tiene la Bitácora (`MEMORIA/`); la PWA aún no existe (Backlog, prioridad alta). El celular no sabe si hay clase en curso (`ClaseVivo` vive en el `localStorage` de cada computador). La tabla `horario` sí tiene `hora_inicio`/`hora_fin`. Los audios de `memorias` (bucket `memorias-audio`) son históricos y protegidos: no se reutilizan.
- **Propuesta (Claude, no decidida):**
  1. Clase deducida por horario + hora del celular; si no hay clase en ese momento, elegirla a mano.
  2. Grabar con un toque; datos opcionales después: canción del repertorio del curso, tono usado (semitonos −6..+6 respecto del original, como el Pitch del Entrenador), cómo les acomodó (bien / alto / bajo), nota corta.
  3. Sin internet: se guarda en el celular y se sube sola al volver la conexión.
  4. Consulta: sección "Audios del curso" en la sesión del Planificador (por fecha, filtro por canción) y resumen de tonos por curso en la canción (Repertorio/Entrenador).
  5. Privacidad: almacenamiento privado (voces de menores), sin links para compartir.
  6. Espacio (por decidir): ~15 MB por hora de audio liviano; el plan gratuito trae 1 GB (~60 h).
  7. Futuro: detección automática del tono cantado.
- **Implica:** tabla y almacenamiento nuevos en Supabase (requiere autorización del PO). Sería el primer paso concreto de la PWA móvil.

### X. Entrenador — "Pedido de repertorio" por curso
*Origen: PO (2026-10-07). Idea registrada; diseño pendiente. No implementar.*
- **Necesidad:** en las sesiones del Entrenador ligadas a un curso, un botón para anotar una canción pedida (un recordatorio), que después permita agregar la canción de verdad al repertorio/sesión.
- **Por definir con el PO:** qué se anota (solo nombre/artista, quién la pidió), dónde se ven los pedidos pendientes, y cómo se "convierte" el pedido en canción (buscar en la biblioteca o importar una nueva).
- **Decisión del PO (2026-10-07):**
  1. Botón **"Pedir canción"** en el Entrenador, siempre que sea una sesión: canción, artista y (opcional) quién la pidió.
  2. El pedido aparece en el **cancionero** de la sesión (tecla C), distinguido como **"en espera de ser cargada"**
     (no se puede abrir), con botón **Descartar**.
  3. **"+ Canción"** abre una página nueva: botón **"Nueva"** (canción normal) y los **contextos con sus canciones
     pedidas**; cada pedido se **carga** formalmente (ficha de canción nueva con nombre/artista escritos; letra,
     carátula, audio como siempre) y queda **de inmediato en la sesión que la pidió**. Botón **Descartar**.
  4. Autoriza el cambio en Supabase.
- **Auditoría:** las sesiones viven en `repertorio_sesiones_entrenamiento` (`canciones` JSON + `contexto_id`
  opcional; una sesión por contexto). `guardarSesion` envía solo nombre/canciones/creada_en/contexto_id, así que una
  columna aparte no se pisa. El cancionero es `entRenderListaSesion` sobre `entSesionActual` (copia de la sesión).
- **Supabase:** columna `pedidos` (JSON) en `repertorio_sesiones_entrenamiento`, versionada en
  `supabase/repertorio_pedidos.sql` (la corre el PO). Sin la columna, el botón avisa y nada más cambia.
- **Fuera de alcance:** ver pedidos en el Planificador/Dashboard; pedidos hechos por los alumnos.
- **Implementado (2026-10-07, `REPERTORIO/index.html`):** botón `#ent-btn-pedir` en el header del Entrenador (solo en
  modo sesión) → cuadro "Pedir canción" (Enter anota, Esc cierra; las teclas no llegan a los atajos del Entrenador).
  `entPedidosListaHTML()` suma al cancionero la sección "Pedidas" (gris, "⏳ en espera de ser cargada", sin abrir, con
  "✕ Descartar"). "+ Canción" abre `#pedidos-overlay` (recarga las sesiones; "+ Nueva" = ficha de siempre; grupos por
  contexto, luego sesiones sin curso; Cargar / Descartar). `pedidoCargar` abre la ficha con nombre/artista escritos y
  la búsqueda de carátula lanzada; al guardar, `pedidoVincular` lee la sesión fresca, agrega la canción al final y
  marca el pedido `cargada` (con `cancion_id`). Todo cambio de pedidos lee antes de escribir y se avisa a las otras
  pestañas (`BroadcastChannel` 'profe-repertorio-pedidos'): el Entrenador abierto en otra pestaña ve la canción nueva.
  Nada se borra: estados `pendiente` / `cargada` / `descartada`.
- **Prueba (2026-10-07, servidor local, sin la columna aún):** botón visible solo en sesión y cabe en 1366 px; anotar
  sin la columna avisa "Falta activar los pedidos en Supabase…" (sin otros errores); pedidos simulados en memoria: el
  cancionero los muestra en gris al final (texto escapado; los descartados no aparecen); la página de "+ Canción" los
  agrupa (Cuarto / sesión sin curso, fecha "07 OCT"); "Cargar" abre "Cargar canción pedida" con los datos y la búsqueda
  de carátula; cerrar la ficha suelta el pedido. **Falta:** que el PO corra `supabase/repertorio_pedidos.sql` y probar
  anotar → cargar → canción en la sesión con datos reales.
- **Implementación:** commit `fb2a8eb` (2026-10-07). Pendiente: SQL del PO + prueba con datos reales.
- **SQL corrido por el PO (2026-10-07).** Prueba con datos reales en la sesión "Mine" (sin curso): anotar 2 pedidos → guardados en `pedidos` y visibles en el cancionero; descartar uno → `descartada` y sale de la lista; "+ Canción" lo agrupa; Cargar + Guardar → canción creada, agregada al final de la sesión y pedido `cargada` con `cancion_id`; el Entrenador abierto en otra pestaña con la misma sesión mostró la canción nueva al instante y quitó el pedido. Datos de prueba borrados (sesión vuelta a sus 2 canciones, pedidos vacíos, canción eliminada). Probar en clase.
- **Ajustes del PO (2026-10-07):** (1) el cuadro "Pedir canción", el botón y los pedidos del cancionero siguen el tema claro/oscuro del Entrenador; (2) campo **Enlace (opcional)** en el pedido (`url`; sin "https://" se agrega; solo http/https), visible como "🔗 Enlace" en el cancionero y en la página de pedidos; (3) botón **"✕ Volver a la biblioteca"** junto a "+ Nueva". Probado en el servidor local (ambos temas, enlace, botones).
- **Ajuste 2 del PO (2026-10-07):** el enlace debe **pasar a la canción** al cargarla ("necesito el link para verla en YouTube"). Columna nueva `repertorio_canciones.url` (`supabase/repertorio_canciones_url.sql`, la corre el PO). Campo "Enlace" en la ficha de canción (nueva/editar; al cargar un pedido viene escrito); se muestra como "▶ Ver en YouTube" / "🔗 Abrir enlace" en el panel de la canción y junto al nombre en el Entrenador. Sin enlace, la canción se guarda como antes (no se envía el campo).
- **SQL corrido por el PO (2026-10-07).** Prueba con datos reales (sesión "Mine"): pedido con enlace sin "https://" → guardado completo y visible en el cancionero; Cargar trae el enlace a la ficha; la canción se guarda con `url` y el panel muestra "▶ Ver en YouTube"; editar cambia el enlace y dejarlo vacío lo quita (el botón desaparece). Commit `7093505`. Datos de prueba borrados. Probar en clase.
- **Ajuste 3 del PO (2026-10-07):** **todos los campos del pedido son opcionales** (basta con uno). Sin nombre, el pedido se muestra como "Canción de <artista>" / "Canción del enlace" / "Canción sin nombre"; al cargarlo, el nombre se completa en la ficha (la canción sí necesita nombre) y la búsqueda de carátula solo se lanza si hay nombre o artista.

### Y. Libro — todo por nombre de pila (sin apellido) y A–Z, salvo los informes
*Origen: PO (2026-10-07). Deuda registrada tras auditoría; no implementar sin ficha y aprobación.*
- **Pedido:** en todo el Libro los estudiantes se ven por **nombre** (sin apellido) y en orden **A–Z**,
  excepto en los **informes** (UTP), que siguen con el nombre legal completo.
- **Ya estaba pendiente en parte (reemplaza y unifica):** (1) idea de 2026-09-04: en el modo A–Z mostrar
  solo el nombre salvo nombres repetidos (memoria del proyecto); (2) Notion: "Libro: por defecto modo
  'Nombre Apellido' (sin coma) y siempre en orden alfabético"; (3) Notion: "Nombres que suenan igual
  (Matias/Mathias): mostrar apellido".
- **Estado actual (auditoría):** el Libro tiene un interruptor `ordenModo` 'oficial' (APELLIDO, NOMBRE ·
  1–N, por defecto, no se recuerda) / 'alfa' (NOMBRE, APELLIDO · A–Z) en `nombreFmt`/`cmpEstudiantes`.
  "Solo nombre salvo repetidos" ya existe en el Proyector de Participación (`nombreProyector` /
  `mapaNombresRepetidos`) y en Pasar lista (`comun/asistencia.js`). Los informes usan
  `nombreFmt(est, true)` (nombre legal). El nombre social ya reemplaza el nombre de pila.
- **Por decidir con el PO:** (a) dos estudiantes con el mismo nombre o que suenan igual (Matías/Mathías):
  ¿nombre + apellido, o nombre + inicial del apellido?; (b) ¿se elimina el interruptor 1–N o queda como
  opción secundaria? (el n° de lista sirve para traspasar al libro oficial); (c) el resumen de ausentes de
  Pasar lista (n° de lista + apellido) es para el libro oficial: ¿queda igual? (recomendado: sí).
- **Decisiones del PO (2026-10-07):** (a) nombre repetido o que suena igual → **nombre + apellido**;
  (b) el orden por n° de lista **queda como opción secundaria**; (c) el resumen de ausentes de Pasar lista
  **queda igual** en contenido (ver deuda AA para su forma).
- **Complemento del PO (2026-10-07) — "falsos cognados":** nombres que suenan igual pero se escriben
  distinto (Matías / Mathías) no se detectan como repetidos. Se pide una **opción en la ficha de
  matrícula** para que ese estudiante se muestre siempre con **nombre completo** (nombre + apellido).
  Origen: tarjeta Notion "Nombres que suenan igual (Matias/Mathias)".
  - *Implica (auditoría):* un dato nuevo por estudiante (p. ej. `libro_estudiantes.mostrar_apellido`,
    sí/no), versionado en un `.sql` y **corrido con autorización del PO**; se edita en la ficha de
    Matrícula junto al nombre social. Va en el estudiante (sirve todos los años).
  - *Propuesta complementaria (no decidida):* además, detección automática de parecidos simples
    (h muda, th/t, y/i, z/s/c, v/b, ll/y, tildes) para sugerir marcar la opción.
- **Plan Y actualizado (no implementar aún):** (1) todo el Libro por nombre de pila (o nombre social),
  orden A–Z por defecto; (2) nombre + apellido si el nombre se repite en la lista o si el estudiante
  tiene marcada la opción "mostrar con apellido"; (3) botón de orden por n° de lista como opción
  secundaria; (4) informes UTP con nombre legal completo (sin cambio); (5) resumen de ausentes de Pasar
  lista con n° + apellido (sin cambio de contenido); (6) la opción nueva en la ficha de Matrícula.
- **Complemento del PO (2026-10-07) — nombres compuestos:** regla general: **si un nombre es compuesto, se
  muestra completo** (nunca solo la primera palabra).
  - *Auditoría (Quinto):* las apps **no recortan** nombres: muestran el campo `nombre` tal como está guardado.
    "MARÍA JESÚS" (n° 21) está guardada completa. El estudiante n° 31 está guardado solo como "JUAN" (apellido
    VEGA): así venía en la planilla del colegio importada en septiembre (`supabase/import_2026/registros_2026.txt`).
    Es un tema de **datos**, no de la app.
  - *Hoy la ficha de Matrícula solo permite editar el nombre social*, no el nombre legal.
  - *Agregado al plan Y:* (7) regla explícita: el nombre de pila que se muestra es el campo `nombre` completo
    (todos los nombres registrados), nunca la primera palabra; (8) **por decidir:** permitir corregir el nombre
    legal en la ficha de Matrícula (para casos como "JUAN" → "JUAN JOSÉ"), o corregir esos casos directo en la
    base con autorización del PO.
  - **Decisión del PO (2026-10-07) sobre (8):** opción **A** — la ficha de Matrícula permitirá **corregir el
    nombre legal** (también se verá en los informes UTP, por ser el legal). Sin cambios de estructura en
    Supabase (el campo ya existe); sí escribe datos del estudiante. Sigue dentro del plan Y (no implementar aún).

### Z. Libro / Entregas — ocultar a quienes "no aplica" y poder volver a "sí aplica"
*Origen: PO (2026-10-07). Aprobada e implementada (ver cierre).*
- **Pedido:** en una entrega que no es para todo el curso, la lista muestra solo a quienes **sí aplica**;
  los "No aplica" quedan ocultos. Y debe poder cambiarse un "No aplica" a "Sí aplica".
- **Estado actual (auditoría):** al crear la entrega, los no seleccionados quedan `no_aplica`
  (`libro_entregas`… detalle por estudiante); los nuevos de una entrega "para algunos" también entran
  como `no_aplica`. En el detalle se listan **todos**, con el rótulo "No aplica" sin acción posible: hoy
  **no se puede** volver a "aplica" en Entregas (en Evaluaciones sí existe el botón "Aplicar",
  `setNoAplica`). El encabezado ya cuenta aparte "deben: N".
- **Propuesta (Claude, no decidida):** lista solo con los que aplica + un botón "Mostrar no aplica (N)"
  que despliega a los demás con un botón "Aplicar" (y "No aplica" en los que sí aplican), igual que en
  Evaluaciones. Sin cambios en la base de datos (el estado ya existe).
- **Decisión del PO (2026-10-07):** propuesta aprobada ("ok").
- **Cierre:** commit `74ed738` (2026-10-07). Hecho; falta probar en clase. *(Cierre anotado el 2026-10-07 al ordenar el Backlog.)*

### AA. Pasar lista — resumen de ausentes en vertical
*Origen: PO (2026-10-07). Aprobada e implementada (ver cierre).*
- **Pedido:** el resumen de ausentes se lee mal porque va en una sola línea horizontal. Debe ir en vertical,
  uno por línea: `N° - APELLIDO`. Si no cabe en la misma pantalla de pasar/modificar lista, un botón
  **"Resumen"** que abre una pantalla aparte con la lista de los que faltan.
- **Estado actual (auditoría):** `comun/asistencia.js` pinta el resumen como una franja al pie del tablero
  (`.asis-res`, en línea, con salto automático), solo en la pantalla del profe (no en el espejo de la Pizarra).
  El tablero ocupa toda la pantalla sin scroll, así que una lista vertical al pie le quitaría espacio a los
  nombres.
- **Propuesta (Claude, no decidida):** botón "Resumen (N)" en el pie del tablero → pantalla aparte con la
  lista vertical `N° - APELLIDO` (talleres sin n° de lista: `APELLIDO NOMBRE`), letra grande, y un botón para
  volver.
- **Cierre:** commits `73cb0aa` + `fdd3c69` (2026-10-07): botón "Resumen (N)" en la barra, lista vertical en columnas sin
  scroll. Hecho; falta probar en clase. *(Cierre anotado el 2026-10-07 al ordenar el Backlog.)*

### AB. Workspace — las pestañas siguen con la versión anterior tras una actualización
*Origen: PO (2026-10-07). Deuda registrada; no implementar sin ficha y aprobación.*
- **Problema (visto varias veces: espejo de la Pizarra, Metalófono centrado, plan Y):** tras subir un cambio, las
  pestañas ya abiertas del Workspace (iframes persistentes) y las ventanas abiertas (Pizarra) siguen con la versión
  vieja; además el navegador guarda el sitio hasta 10 min (GitHub Pages, `max-age=600`). Hay que cerrar pestañas,
  recargar con Ctrl+Shift+R y reabrir.
- **Ya aplicado en un caso:** la Pizarra carga el espejo del Entrenador con un parámetro `v` distinto cada vez.
- **Propuesta (Claude, no decidida):** un archivo pequeño de versión (p. ej. `version.json`, actualizado en cada
  subida) que el Workspace consulta cada pocos minutos sin usar lo guardado; si cambió, muestra un aviso "Hay una
  versión nueva — Recargar", que recarga el Workspace y sus pestañas pidiendo los archivos al día. Alternativa
  mínima: que reabrir una pestaña del Workspace siempre pida la versión al día.
- **Decisión del PO (2026-10-07):** propuesta aprobada (aviso de versión nueva).
- **Implementado (2026-10-07):**
  - `version.json` en la raíz (`{ "version": "<fecha>" }`). Lo actualiza solo el gancho de Git `.githooks/pre-commit`
    cuando el commit cambia `.html`/`.js`/`.css` (activado en este repo con `git config core.hooksPath .githooks`;
    en otro computador hay que repetir ese comando).
  - `PC/workspace.html`: consulta `version.json` sin usar lo guardado al abrir, cada 3 min y al volver a la ventana.
    La última versión cargada se recuerda en el computador (`localStorage ws_version_cargada`): si al abrir ya hay
    otra, el aviso aparece de inmediato. Botón verde "🔄 Hay una versión nueva — Recargar": guarda los Planes abiertos
    (mismo handshake que al cerrar), pide al servidor las páginas abiertas y sus scripts/estilos (`cache:'reload'`) y
    recarga las pestañas en su lugar; si cambió el propio Workspace, lo recarga entero. En `file://` no hace nada.
  - Fuera de alcance: la ventana de la Pizarra ya abierta en el proyector (se recarga a mano).
- **Prueba (2026-10-07, servidor local):** versión nueva simulada → aparece el aviso; "Recargar" recarga Dashboard y
  Repertorio sin cerrarlos, el aviso se oculta y la versión queda recordada. Sin errores.
- **Cierre:** commits `1fb920a` + `1ed9e2b` (2026-10-07).

### AC. Libro — varios (hoja Notion "varios del libro de clases")
*Origen: PO (2026-10-07). Plan revisado por el PO ("todo ok"). **Aprobado para implementar (PO, 2026-10-07).** En implementación.*
1. **Evaluación en pestañas.** Hoy una sola página larga: Cabecera (nombre, fecha, OA, adecuaciones) · Instrumentos ·
   Grupos de trabajo · Estudiantes · Observación general. *Plan:* barra de pestañas con esas cinco; se ve solo la
   elegida; se recuerda la última; por defecto Estudiantes. Mismo contenido y guardados.
2. **Guardar al instante.** Hoy Entregas y Participación (vista normal) guardan solo con "Guardar entrega" /
   "Guardar participación" (el Proyector de Participación sí guarda al tiro). *Plan:* cada marca se guarda al
   instante (entregó, Aplicar/No aplica, participó); los botones de guardar dejan de ser necesarios. *Sin conexión
   (agregado por el PO, 2026-10-07):* estas marcas quedan guardadas en el computador y se suben solas al volver la
   conexión (como Pasar lista), con aviso de que hay marcas pendientes de subir.
3. **Clics repetidos crean duplicados.** *Auditoría de todo el Libro (63 acciones que escriben en la base):*
   - **Pueden duplicar** (crean algo nuevo con cada clic, sin bloqueo ni regla en la base): crear evaluación,
     participación, entrega, plantilla, instrumento; agregar ítem de plantilla y de instrumento; agregar adecuación;
     crear grupo de trabajo; crear estudiante nuevo (Matrícula: duplicaría la identidad); guardar observación (taller);
     duplicar plantilla; cargar plantilla en una evaluación.
   - **Protegidos por la base** (un segundo clic da error, no duplica): matrícula nueva (1 activa por estudiante/año),
     pertenencia a taller, filas por estudiante de evaluación/participación/entrega (únicas por actividad y estudiante;
     incluye la "lista al día" al abrir dos veces seguidas).
   - **Sin riesgo de duplicar** (cambian o borran algo existente): guardar cabeceras, notas, cerrar/reabrir, retirar/
     reintegrar, renombrar, eliminar (piden confirmación).
   *Plan:* un mismo seguro para todos los botones que escriben: al primer clic el botón se desactiva y dice
   "Creando…" / "Guardando…" hasta que termina (si falla, vuelve a activarse); y la "lista al día" de cada actividad
   corre una sola vez a la vez (evita el aviso de error al abrir dos veces).
   *Si falla (agregado por el PO, 2026-10-07):* aviso claro "No se guardó: revisa la conexión e intenta de nuevo";
   lo escrito queda en el formulario; el botón vuelve a activarse para reintentar; antes de reintentar una creación,
   el Libro revisa si ya quedó creada (respuesta perdida) y, si la encuentra, no la duplica y avisa "ya estaba
   creado". Sin guardado local en el computador para estas acciones.
4. **Participación: "ausente" en vez de "inhabilitado".** Hoy ausente (Pasar lista) e inhabilitado a mano (Shift+clic)
   comparten marca y texto. *Plan:* si está en los ausentes de hoy dice "ausente"; si se inhabilitó a mano, "inhabilitado".
   Mismo comportamiento (fuera del sorteo).
- *Orden recomendado:* 3 y 4 → 2 → 1. Sin cambios en Supabase.
- **Implementado (2026-10-07, `LIBRO/index.html`, sin cambios en Supabase):**
  - *4:* clase `fila-aus` → la fila dice "ausente" si el inhabilitado está en los ausentes de hoy; en el Proyector,
    el `title` del casillero dice "ausente" / "inhabilitado".
  - *3:* `seguro(clave, botón, texto, fn)` — una acción a la vez, botón desactivado con "Creando…"/"Guardando…".
    Creaciones con id fijado en el navegador (`idCreacion` + `insertarUnaVez`): al reintentar con los mismos datos se
    usa el mismo id; si ya existía, avisa "ya estaba creada" y no duplica. Filas por estudiante con `upsert …
    ignoreDuplicates`. Aplicado a las 13 creaciones y a Guardar cabecera/Guardar notas/Cerrar/Reabrir. "Lista al día"
    corre una sola vez a la vez por actividad. Aviso de falla único: `avisoFallo()`.
  - *2:* `guardarMarca()` con cola `localStorage profe_libro_marcas_cola`, subida en serie, al volver la conexión
    (`online`) y cada 20 s; lo pendiente se aplica encima al recargar (`marcasSobre`). Aviso amarillo "⏳ N marcas sin
    subir". Participó (vista normal y Proyector), Entregó/Recibió y Aplicar/No aplica. Se retiraron los botones
    "Guardar participación" y "Guardar entrega".
  - *1:* barra de pestañas Cabecera · Instrumentos · Grupos de trabajo · Estudiantes · Observación general; las demás
    quedan armadas pero ocultas (mismos guardados); última recordada (`localStorage libro_eval_tab`), por defecto
    Estudiantes; la Observación general se guarda al salir de su pestaña.
- **Prueba (2026-10-07, servidor local):** pestañas en una evaluación real de Tercero; duplicados y cola sin conexión
  con base simulada (reintento sin duplicar, 3 clics = 1 acción, marcas subidas al volver). Sin errores. Falta probar
  en clase marcas reales y el Proyector.
- **Cierre:** commit `9110394` (2026-10-07). Queda en marcha blanca hasta probarlo en clase.

### AD. Libro / Evaluaciones — reevaluar a un estudiante ya evaluado
*Origen: PO (2026-10-07). Plan **aprobado por el PO (2026-10-07)** e implementado.*
- **Necesidad profesional:** a algunos estudiantes les va muy mal en una prueba; ya quedaron evaluados y se necesita
  dejarlos otra vez pendientes para reevaluarlos la semana siguiente, sin perder la primera nota.
- **Estado actual (auditoría):** "Evaluado" = tener nota (`estadoEfectivo`). Sin instrumento, borrar la nota lo deja
  "Pendiente" pero la primera nota se pierde. Con rúbrica/lista de cotejo no hay forma: la nota sale de
  `libro_eval_resultados` y "No aplica → Aplicar" la recupera. Alternativa actual: otra evaluación marcando "No aplica"
  al resto (lenta y separada de la original).
- **Decisiones del PO (2026-10-07):** la nota nueva **reemplaza** a la primera (no se promedian); los informes de UTP
  muestran **solo la nota final**.
- **Plan (Claude, por aprobar):**
  1. Botón **"Reevaluar"** en cada estudiante evaluado (pestaña Estudiantes, evaluación abierta), con confirmación.
  2. El estudiante vuelve a "Pendiente" (entra al filtro Pendientes). La primera nota queda guardada y visible junto a
     la celda: "1ª nota: 2,8" (si se reevalúa otra vez: "notas anteriores: 2,8 · 3,4").
  3. Con rúbrica/lista de cotejo: las respuestas actuales se guardan como intento anterior y el instrumento queda en
     blanco para evaluar de nuevo.
  4. Integrante de grupo que heredaba la nota del grupo: pasa a evaluación individual (como "Evaluar individual") y su
     nota/respuestas del grupo quedan como intento anterior; el resto del grupo no cambia.
  5. La nota nueva es la oficial en todo el Libro (ficha del estudiante, informes UTP). Los informes no muestran las
     anteriores.
  6. Opción "Deshacer reevaluación" mientras siga pendiente (vuelve la nota anterior), por si fue un clic equivocado.
- **Implica (Supabase, requiere autorización del PO):** una columna nueva en `libro_evaluacion_notas`:
  `intentos_anteriores JSONB NOT NULL DEFAULT '[]'` — lista de `{ nota, fecha, resultados: [{ item, valor }] }`.
  Versionada en `supabase/libro_reevaluacion.sql` y **corrida por el PO** en Supabase. No cambia datos existentes.
- **Fuera de alcance:** reevaluar en evaluaciones cerradas (hay que reabrirlas primero); promedios entre intentos.
- **Implementado (2026-10-07):** `supabase/libro_reevaluacion.sql` (columna `intentos_anteriores`, **corrida por el PO
  en Supabase el 2026-10-07**; verificado: la columna responde y aparecen los 14 botones en Tercero). `LIBRO/index.html`: `cargarIntentos()` en consulta aparte (si la columna no existe,
  la función queda oculta y el Libro sigue igual; la consulta da un 400 esperado); `reevalHTML()` en la celda de nota
  ("1ª nota: X" / "notas anteriores: X · Y", botones Reevaluar / Deshacer reevaluación); `reevaluar()` guarda el
  intento (nota, fecha, excepción previa, respuestas) y deja la nota en blanco, luego borra las respuestas (si eso
  falla, revierte); `deshacerReevaluacion()` repone respuestas, nota y excepción. Integrante de grupo → `nota_excepcion`.
  El reevaluado no vuelve a "Disponibles" de Grupos ni queda congelado por grupo terminado. Usa el seguro AC-3.
- **Prueba (2026-10-07, servidor local, base simulada para las escrituras):** sin la columna no aparece el botón;
  simulada: 14 botones para 14 evaluados; reevaluar (integrante de grupo, 4 respuestas) → Pendiente con "1ª nota: 6,0";
  deshacer → vuelven nota y 4 respuestas. Falta probar con la columna real.
- **Cierre:** commit `93fb3cc` (2026-10-07).
- **Estado (PO, 2026-10-07):** **pendiente de validación en uso real.** Se cierra cuando el PO lo use con estudiantes
  reales.

### AE. Libro — contador en "Pendientes" y botón "Copiar" la nómina
*Origen: PO (2026-10-07). Plan **aprobado por el PO (2026-10-07)** e implementado.*
- **Necesidad profesional:** saber de un vistazo cuántos faltan, y llevar la lista de pendientes al Planificador para
  la clase siguiente (p. ej. quiénes deben rendir o entregar).
- **Estado actual (auditoría):** hay dos botones "Pendientes" (filtro), ambos en `LIBRO/index.html`:
  - *Evaluaciones* (pestaña Estudiantes): muestra a los que no tienen nota y no están ausentes hoy.
    **Hallazgo:** también muestra a los marcados **"No aplica"** (no tienen nota), lo que es un error.
  - *Entregas*: muestra a los que están "Pendiente" (sin entregar/recibir; "No aplica" no cuenta).
  Ninguno muestra cuántos son ni permite copiar la lista. Participación no tiene filtro Pendientes.
- **Propuesta (Claude, por decidir):**
  1. El botón dice **"Pendientes (N)"** y el número se actualiza al instante al marcar notas o entregas.
  2. Corregir Evaluaciones: "No aplica" deja de contar como pendiente.
  3. Botón **"📋 Copiar"** junto a cada filtro: copia la nómina de pendientes como texto para pegar en el Plan,
     con el formato de abajo, y muestra "Copiado (N)".
  4. Ausentes de hoy: en Evaluaciones siguen fuera del filtro en pantalla (como hoy), pero **sí van en la copia**,
     porque para la clase siguiente también deben rendir; marcados "(ausente hoy)".
- **Formato propuesto de la copia:**
  ```
  Pendientes · Prueba unidad 1 (5)
  - Ana
  - Benjamín Soto
  - Camila (ausente hoy)
  ```
  Nombres como se muestran en el Libro (nombre; nombre + apellido si se repite), en el orden activo.
- **Por decidir con el PO:** formato de la copia (lista con guiones / una sola línea separada por comas); si los
  ausentes de hoy van en la copia; si se agrega también a Participación ("quiénes no han participado").
- **Decisiones del PO (2026-10-07):** uno por línea (con guion); los ausentes de hoy **sí** van en la copia;
  Participación **no**.
- **Implementado (2026-10-07, `LIBRO/index.html`):** `evalEsPendiente()` (sin nota y no "No aplica") en el filtro de
  Evaluaciones; el contador "Pendientes (N)" se actualiza en `filtrarEstudiantes()` / `filtrarEntregas()` (cuenta lo que
  muestra el filtro: en Evaluaciones sin los ausentes de hoy); botón "📋 Copiar" → `copiarNomina()` (portapapeles con
  respaldo), muestra "✔ Copiado (N)". La copia lleva a todos los pendientes, ausentes de hoy marcados "(ausente hoy)".
- **Prueba (2026-10-07, servidor local, solo lectura):** Tercero, evaluación "Repertorio (Chicos y chicas)":
  "Pendientes (12)" y copia de 12 nombres; entrega con "Pendientes (8)" y copia de 8; un "No aplica" simulado baja el
  contador a 11 y sale del filtro.
- **Cierre:** commit `db68735` (2026-10-07).

### AF. Metalófono — se pierde el 1er tick de la precuenta (n°4) y loop que acelera (n°1)
*Origen: PO (2026-10-07), tarjeta Notion "cuatro deudas en metalófono" (n°4 y n°1, las urgentes). n°2 y n°3 quedan
para después.*
- **Necesidad profesional:** la precuenta coordina a los niños; si el 1er tick no suena, se descoordinan (n°4). Para
  practicar, repetir la melodía subiendo la velocidad de a poco (n°1).
- **Auditoría n°4 (2026-10-07):** en `METAL21 (ALPHA).HTML` la precuenta va en la misma línea de tiempo del Transport
  (`agendarPrecuenta`). Medido en el navegador (contexto de audio recién reactivado, como al primer Play): el 1er tick
  se programa con el mismo margen (~60 ms) que los demás → **la app lo entrega a tiempo**. Causa más probable: la
  **salida de audio dormida** (parlantes por HDMI del proyector / Bluetooth se apagan con el silencio y se comen el
  primer sonido al despertar). No reproducible sin ese hardware.
- **Arreglo n°4 (alcance técnico, dentro de lo pedido):** antes de la precuenta suena un tono **inaudible** que
  despierta la salida, y la reproducción parte **0,5 s** después del clic. Aplica a profesor y alumno; no cambia la
  precuenta ni el ritmo.
- **Implementado n°4 (2026-10-07):** `despertarSalida()` (oscilador 40 Hz a −60 dB desde el clic hasta 0,3 s después
  del 1er tick, luego se libera) y `Tone.Transport.start("+0.5")` en `startAudio()`. Prueba local: 1er tick a ~0,6 s del
  clic con el mismo margen que los demás; Play→Detener→Play seguido sin errores; modo alumno: velo, sonido y fin de
  precuenta OK. **Falta probar en clase con los parlantes del proyector** (Probar en clase).
- **Auditoría n°1:** hoy no existe repetición en bucle; ▶ toca la melodía una vez (con precuenta opcional). BPM entre
  40 y 250, botones −/+ de a 5.
- **Plan n°1 (por decidir con el PO):** botón "🔁 Repetir +5" (modo profesor): al terminar la melodía vuelve a empezar
  sola con 5 BPM más, hasta que se detenga. Por decidir: ¿precuenta entre vueltas?, ¿tope de velocidad?, ¿al detener
  vuelve al BPM inicial?, ¿también en el modo alumno?
- **Decisiones del PO (2026-10-07):** con precuenta entre vueltas; tope configurable; al detener vuelve a la velocidad
  inicial; solo modo profesor.
- **Implementado n°1 (2026-10-07):** botón "🔁 +5" (encendido/apagado, se recuerda) + campo "hasta [140]" (tope, se
  recuerda; visible solo con el botón encendido). `agendarVuelta()`: cada vuelta deja agendada la siguiente al empezar;
  en el tick final sube +5 hasta el tope (`Tone.Transport.bpm.setValueAtTime`), suena un compás de precuenta
  (`agendarPrecuenta(compas, offset)`) y repite; sin cifra de compás, repite sin precuenta. Estado "🔁 Vuelta N · BPM
  (tope)". Al detener: vuelve a la velocidad inicial. Oculto en modo alumno. Pantalla y fin de melodía con temporizador
  (`alTiempo`) en vez de `Tone.Draw` (que se salta eventos si la página no dibuja; ahora la melodía también termina sola
  con la pestaña oculta). Para que quepa la barra a 1280 px: "🔤 Cifrado", "🎨 Colores" y "⛶" (antes "Cambiar
  Cifrado", "Cambiar Colores", "PANTALLA COMPLETA").
- **Prueba (2026-10-07, servidor local):** Zapatero desde 240 con tope 250: vueltas a 240 → 245 → 250 → 250, cada una
  con 4 ticks de precuenta a su velocidad; al detener vuelve a 240; apagado: toca una vez y termina solo; Play→Detener→
  Play sin cortes; modo alumno sin el botón. Falta probar en clase.
- **Cierre AF (n°4 + n°1):** commits `12bfef9` + `48c4338` (2026-10-07). Probar en clase.

### AF (cont.). Metalófono — n°2 listado de notas y n°3 práctica del alumno en el modo profesor
*Origen: PO (2026-10-07), misma tarjeta Notion; n°2 también es la tarjeta "renderizar melodía completa como listado
de notas (diferenciando octavas), PARA ESCRIBIR EN EL CUADERNO" (agrupada). Aprobado e implementado (ver abajo).*
- **Auditoría n°3:** hay dos prácticas "Melodía sin ritmo". *Profesor:* cada toque alterna mostrar → apagar la misma
  nota (2 toques por nota). *Alumno* (Etapa 1): cada toque avanza directo a la nota siguiente; si se repite la nota,
  se apaga 200 ms y vuelve a encender para que se note; al terminar, 2 s y se apaga sola. **Ojo:** la ficha de la
  Etapa 1 y `CLAUDE.md` dicen "el modo profesor no se altera"; copiar la práctica del alumno al profesor cambia eso
  y requiere decisión explícita del PO.
- **Auditoría n°2:** no existe una vista de la melodía como texto. El MIDI trae las notas (rango La 81 → La 105:
  tres "La", dos octavas y algo) y la cifra de compás (se puede cortar por compás).
- **Propuesta (Claude, por decidir):** botón "📝 Notas" (modo profesor) que muestra la melodía completa como texto
  grande sobre el metalófono, un compás por línea, notas separadas por " - ", en el cifrado elegido (Do/C), con
  botón "📋 Copiar". Por decidir: cómo marcar las octavas; un compás por línea o todo seguido; si también va en el
  modo alumno.
- **Decisiones del PO (2026-10-07):** n°3 sí, reemplazar la práctica del profesor por la del alumno; octavas con coma
  (graves) y comilla (agudas); un compás por línea (*"está por probarse; quizá no sea lo mejor pedagógicamente"*);
  no en el modo alumno.
- **Implementado (2026-10-07):** n°3: `advanceManualMelody()` usa siempre `alumnoAvanzarMelodia()`; `stopPractice()`
  cancela sus temporizadores en ambos modos; el estado muestra "Modo Práctica: i/N". n°2: "📝 Ver notas (para el
  cuaderno)" en el panel de Modo Práctica → capa a pantalla completa con la melodía (título, número de compás, notas
  con " - "), "📋 Copiar" (texto plano) y ✕/Esc; `nombreNotaLista()`: graves 81–83 con coma, agudas 96–105 con
  comilla, en el cifrado elegido (latino; americano si se muestra solo el americano). Oculto en modo alumno.
  `CLAUDE.md` actualizado (excepción a "el modo profesor no se altera").
- **Prueba (2026-10-07, servidor local):** profesor: cada toque avanza a la nota siguiente (0→1→2→3→4); Zapatero en
  líneas por compás (`Do♯'` agudo); rango 81→`La,` · 83→`Si,` · 84→`Do` · 96→`Do'` · 105→`La'`; Copiar y Esc OK;
  alumno sin cambios y sin el botón. Falta probar en clase.
- **Cierre n°2 + n°3:** commit `b86a70d` (2026-10-07). Probar en clase.

### AG. Lector de Tabs — también se pierde el comienzo del audio (como AF n°4)
*Origen: PO (2026-10-07). Registrada para después; el PO pidió hacerla el mismo día ("sigue con la deuda AG").*
- **Pedido:** en el Lector (`tabs/index.html`) ocurre algo parecido a lo del Metalófono: se pierde el comienzo del
  sonido al reproducir.
- **Hipótesis (por auditar):** la misma causa de AF n°4 (salida de audio dormida: HDMI del proyector / Bluetooth). El
  arreglo probable es el mismo: despertar la salida con un tono inaudible y partir medio segundo después.
- **Ojo:** `tabs/index.html` tiene cambios del Loop sin commitear (pausa controlada); no mezclarlos con este arreglo.
- **Auditoría (2026-10-07):** el Lector no usa Tone; avanza con `requestAnimationFrame` desde el Play y agenda la
  precuenta/metrónomo con `playClick` en un `AudioContext` propio; el audio sincronizado (`<audio>`) entra al mismo
  contexto. El primer click de la precuenta suena apenas se da Play → mismo problema de salida dormida.
- **Implementado:** `despertarSalidaYLuego(fn)`: tono 40 Hz a −60 dB y la acción parte 0,5 s después; Pausa,
  Reiniciar, Espacio o el botón de audio durante la espera la cancelan (`cancelarDespertar`). Aplicado a los 4 inicios:
  botón ▶ (con y sin audio), Espacio, botón de audio (`toggleTabAudio`) y `doRestart` (cancela). Si ya está sonando, ▶
  actúa como antes, sin espera.
- **Separación del Loop:** se commitea solo este arreglo (índice armado desde `HEAD` + el arreglo); los cambios del Loop
  siguen sin commitear en la copia de trabajo, idénticos (verificado contra un respaldo).
- **Prueba (2026-10-07, servidor local, "ESCALA DE DO"):** Play → parte a los 0,5 s; Play+Pausa a los 0,2 s → no
  parte; Espacio parte y pausa; Espacio-Espacio rápido → no parte. Falta probar en clase con el proyector.
- **Cierre:** commit `df9bb48` (2026-10-07). Probar en clase.
- **Complemento del PO (2026-10-07):** no pasa solo con Bluetooth: también en los parlantes de los computadores. Los
  primeros sonidos (metrónomo y primeras notas) suenan "arcaicos" y muy fuertes, luego se normaliza; cuando pasa, el
  audio se atrasa.
- **Auditoría 2 (2026-10-07):** causa encontrada. Los sonidos de guitarra (soundfont MusyngKite, de internet) se
  cargaban recién al **primer Play** y se volvían a cargar al cambiar de partitura/instrumento
  (`aplicarTimbreInstrumento` ponía `guitarSF = null`). Mientras tanto sonaba el **sonido de reemplazo** (Karplus-
  Strong): otro timbre ("arcaico") y **~6× más fuerte, saturado** (medido: pico 1,65 vs 0,27 de la guitarra; > 1 =
  distorsión). Y la descarga + decodificación ocurría justo al partir → computador cargado → audio atrasado.
- **Arreglo 2:** `cargarSoundfont()` con caché por instrumento (`sfCache`); **precarga al abrir el Lector**
  (`ensureAudio()` al final del script: el contexto nace suspendido y se activa con el primer Play); al cambiar de
  instrumento se usa lo ya cargado; el Play **espera** a los sonidos (`esperarSonidos`, máx. 8 s, aviso "Cargando
  sonidos…") en vez de tocar con el reemplazo; el reemplazo queda solo si la carga falla y a nivel de la guitarra
  (`KS_NIVEL = 0.17`: pico 0,26).
- **Prueba 2 (2026-10-07, servidor local):** sin tocar nada, sonidos listos al abrir; abrir partitura no recarga; Play
  parte a ~0,58 s; carga lenta simulada (2 s): aviso y parte a los ~2 s con la guitarra; reemplazo 0,26 vs guitarra
  0,27; bajo ↔ guitarra: la vuelta a guitarra es inmediata. Loop sin commitear intacto.
- **Cierre parte 2:** commit `7e7a09d` (2026-10-07). Probar en clase (parlantes del computador y del proyector).
- **Estado (PO, 2026-10-07):** **pendiente de revisión en uso real** (partes 1 y 2). Se cierra cuando el PO lo
  compruebe en clase.

### AH. Libro — fechas cortas "07 OCT" y marca HOY en el historial de observaciones
*Origen: Backlog Notion "Historial pedagógico: fecha legible, badge HOY, una nota editable por fecha" (2026-09-23).
Alcance ajustado por el PO (2026-10-07).*
- **Decisión del PO:** (1) la fecha legible es **el mismo formato en todo el Libro: día + mes, "07 OCT"**; (2) marca
  **HOY** en el historial pedagógico: sí; (3) "una sola nota por fecha, editable y bloqueada después de una semana":
  **no se hace**.
- **Auditoría:** el Libro mostraba las fechas tal como se guardan ("2026-09-21") en: historial de observaciones, filas
  de actividades (panel de abiertas y Archivo), listas de evaluaciones/participaciones/entregas y avisos de eliminar.
- **Fuera de alcance:** los **informes de UTP** (documento oficial, mantienen DD/MM/AAAA y su nombre de archivo) y los
  campos para elegir fecha (los dibuja el navegador). El dato guardado no cambia.
- **Prueba (2026-10-07):** fechaCorta('2026-10-07') = '07 OCT', '2026-01-21' = '21 ENE', vacía = '—'; página sin errores.
- **Cierre:** commit `ac89e8f` (2026-10-07). Probar en clase.

### AI. Libro — proyectar evaluaciones, participaciones y entregas (Pizarra o pantalla completa)
*Origen: Backlog Notion "Proyectar desde el Libro: grupos de trabajo (evaluaciones) y entregas" (prioridad Aprobada).
Plan aprobado por el PO (2026-10-07) en dos etapas; esta ficha cubre la **Etapa 1**.*
- **Necesidad:** que el curso vea en el proyector lo que el profe trabaja en el Libro: la evaluación, su instrumento y,
  sobre todo, el **armado de los grupos de trabajo en vivo** (el profe arma en su pantalla y el curso lo ve).
- **Decisión del PO:**
  - Botón **"📽️ Proyectar"**. Con la clase en curso se proyecta en la **Pizarra** (como el Entrenador en la Pizarra:
    solo mirar, al instante, al soltarlo la Pizarra vuelve a su diapositiva); sin clase, pantalla completa en la misma
    ventana (como el Proyector de Participación).
  - Evaluaciones: la pestaña "Cabecera" pasa a llamarse **"General"**; se proyecta la pestaña abierta: General (nombre,
    fecha, OA), Instrumentos (rúbrica / lista de cotejo en grande), Grupos de trabajo (grupos e integrantes, el grupo que
    se está armando y quienes aún no tienen grupo). Estudiantes y Observación general **no** se proyectan.
  - **Etapa 2 (pendiente):** pestaña Resultados (✓ evaluado / pendiente; notas solo con botón "Mostrar notas" —
    recomendación de Claude, **decisión del PO pendiente**), Entregas (tablero) y Participación hacia la Pizarra.
- **Auditoría:** ya existen dos patrones: Entrenador en la Pizarra (`profe-espejo-entrenador`: la Pizarra carga una
  copia del Entrenador en una capa) y Pasar lista (`comun/asistencia.js`: pieza compartida que dibuja el mismo tablero
  en la Pizarra). Para el Libro conviene el segundo: una pieza liviana **`comun/libro-proyeccion.js`** que recibe una
  "foto" de lo que se muestra (sin notas ni comentarios) y la dibuja en la Pizarra o a pantalla completa; la Pizarra no
  necesita cargar el Libro ni Supabase. El Libro arma la foto desde lo que ya tiene en memoria (evaluación, adecuaciones
  no, instrumentos, grupos, selección en curso). Sin cambios en Supabase.
- **Privacidad:** la foto no lleva notas, comentarios, adecuaciones ni observaciones; los nombres usan la regla del
  Libro (nombre, A–Z).
- **Implementado (Etapa 1, 2026-10-07):** `comun/libro-proyeccion.js` (`LibroProyeccion`: dibuja la foto, se agranda
  hasta llenar la pantalla sin scroll; `abrirLocal` pantalla completa con ✕ Salir / Esc; `encender`/`emitir`/`apagar`
  hacia la Pizarra por el canal `profe-espejo-libro` + `localStorage` para una Pizarra recién abierta; `espejo()` en la
  Pizarra, capa encima de la diapositiva). `LIBRO/index.html`: pestaña "General", botón "📽️ Proyectar" en la barra de
  pestañas de la evaluación, `proyFoto()` (General / Instrumentos: el abierto con "Ver", si no el del OA, si no el
  primero / Grupos: grupos con integrantes, "Nuevo grupo…" con la selección en curso y "Sin grupo aún" / otras pestañas:
  solo el nombre), envío cada 0,3 s solo si cambió; sin clase en curso → pantalla completa; si la clase termina se suelta
  solo. `PIZARRA/index.html`: carga la pieza y llama `LibroProyeccion.espejo()`.
- **Prueba (2026-10-07, servidor local, Tercero, "Repertorio (Chicos y chicas)", sin guardar nada):** pestañas
  General / Instrumentos / Grupos de trabajo / Estudiantes / Observación general; sin clase → pantalla completa; las
  cuatro vistas caben sin scroll en 1366×768 (rúbrica de 4 niveles completa); seleccionar estudiantes en Grupos aparece
  al instante como "Nuevo grupo…" y sale de "Sin grupo aún"; Pizarra de la misma sesión en otra pestaña: muestra la foto
  encima, se actualiza con el armado y desaparece al soltar; sin errores. **Falta:** probar en clase con el proyector y
  el Modo Clase real.
- **Decisión del PO para la Etapa 2 (2026-10-07):** **nunca** proyectar las notas del curso. Pestaña **Resultados**
  en la pantalla del profe: buscar un nombre y ver su nota (grupo, ausente hoy, notas anteriores); proyectada muestra
  **solo los pendientes de la prueba** (ausentes de hoy aparte). **Entregas:** tablero completo **con énfasis en quienes
  no han entregado**. **Participación:** con la clase en curso, el Proyector actual además se ve en la Pizarra (nombres,
  quién participó, contador, 🎲 elegido en grande; la preselección secreta nunca se proyecta).
- **Cierre Etapa 1:** commit `08440d6` (2026-10-07). Probar en clase. Etapa 2 pendiente (decisión del PO sobre notas).
- **Implementado (Etapa 2, 2026-10-07):** `LIBRO/index.html`: pestaña **Resultados** (`resPaneHTML`/`resBuscar`:
  contador evaluados/pendientes, buscador grande, tarjeta con nota —roja bajo 4,0— o Pendiente / No aplica, grupo,
  ausente hoy y notas anteriores; la búsqueda se conserva al redibujar); `proyFoto` suma `pend` (solo pendientes
  presentes + ausentes de hoy aparte, sin notas), `entrega` (faltan en grande con borde naranjo, listos chicos en verde
  con ✓, "no aplica" fuera, textos según el sentido: entregaron / recibieron) y `part` (esperando / participaron /
  inhabilitados tenues, contador, nombre elegido en grande o "🎲 Eligiendo…"). Botón "📽️ Proyectar" en la cabecera de
  cada entrega. Participación: con la clase en curso, abrir el Proyector también lo envía a la Pizarra y cerrarlo lo
  suelta; sin clase, igual que antes. `comun/libro-proyeccion.js`: vistas `pend`, `entrega`, `part`.
- **Prueba (2026-10-07, servidor local, Tercero, sin guardar nada):** Resultados: "Evaluados 14 de 26 · Pendientes 12";
  buscar "agus" → AGUSTINA Pendiente / AGUSTÍN Grupo 1 5,8; la foto no contiene ninguna nota; proyectada cabe en
  1366×768. Entrega "guia con QR…": "3 de 11 recibieron · faltan 8", marcar uno (solo en memoria) → "4 de 11" al
  instante y vuelta. Participación "EL MUSEO" con clase simulada: el Proyector abre en la pantalla del profe y la
  Pizarra muestra el tablero (5 participaron · 21 esperando) y el nombre elegido en grande; al cerrar el Proyector la
  Pizarra se libera. Sin errores. **Falta:** probar en clase con el proyector y el Modo Clase real.
- **Cierre Etapa 2:** commit `9bfad74` (2026-10-07). Probar en clase.
- **Ajuste: cualquier resolución del proyector (PO, 2026-10-07).** La escala ya no tiene tope fijo: crece con el alto de la pantalla y se busca por bisección el mayor tamaño que entra (también al cambiar el tamaño de la ventana o pasar a pantalla completa). Medido con las 6 vistas + cursos simulados de 40 nombres en 800×600, 1024×768, 1280×800, 1366×768, 1920×1080 y 3840×2160: todo cabe sin scroll, usa el 100 % del alto y la letra queda en la misma proporción de la pantalla en todas (p. ej. nombres de Entregas ≈ 6 % del alto; rúbrica ≈ 3 %).
- **Ajuste: el resto de lo que se proyecta en la Pizarra (PO, 2026-10-07).** Auditoría con la misma medición (800×600,
  1024×768, 1366×768, 1920×1080, 3840×2160): todo cabía, pero había **topes fijos de letra** pensados para pantallas
  de ~1080 px que en un proyector más grande dejaban la letra chica (en 4K, a la mitad de su proporción):
  - **Diapositivas de la Pizarra** (`PIZARRA/index.html`): texto ≤ 250 px, letra de canción ≤ 220 px, modo pantalla ≤
    200 px, modo scroll ≤ 46 px. Ahora `topeFuente(base)` (igual hasta 1080 px de alto; más grande, en proporción) y
    scroll `max(20px, 3.4vh)`; además el ajuste de texto revisa también el ancho (palabras muy largas).
  - **Pasar lista** (`comun/asistencia.js`): nombres ≤ 110 px, resumen ≤ 64 px, barra superior ≤ 28 px → topes en
    proporción a la pantalla. Arreglo extra (pasaba en cualquier resolución): el cálculo no descontaba el borde del
    cuadro y un nombre largo podía salir cortado con "…" por 3 px.
  - **Entrenador** (`REPERTORIO/index.html`, también su copia en la Pizarra): Scroll ≤ ~60 px y Diapositiva ≤ 96 px →
    topes en proporción a la pantalla.
  - **Resultado medido:** en las seis resoluciones todo cabe, sin nombres cortados, y la letra mantiene la misma
    proporción del alto (p. ej. diapositiva corta ≈ 23 %, Pasar lista con 12 estudiantes ≈ 6,5 %, Entrenador Scroll ≈
    5,5 %; en 4:3 algo menos porque manda el ancho). Una canción larga en Diapositiva en un proyector de 800×600 queda
    en letra chica (cabe completa a ~10 px): para esos casos conviene el modo Scroll.

### AJ. Entrenador en la Pizarra — la copia sigue el desplazamiento de la letra del profe (modo Scroll)
*Origen: PO (2026-10-07), hallazgo en uso. Complementa "Desarrollo paralelo: Entrenador en la Pizarra (espejo)".*
- **Pedido:** en modo Scroll, el scroll de la Pizarra tiene que copiar el de la pantalla del profe.
- **Auditoría:** la copia solo seguía el verso activo (se centraba sola al cambiar de verso); el desplazamiento a mano
  del profe no viajaba. Las pantallas miden distinto, así que copiar la posición en píxeles no sirve.
- **Implementado (`REPERTORIO/index.html`):** `espejoAnclaScroll()` = verso más cercano al centro de la vista del profe +
  su altura relativa; va en cada estado y, además, al instante con cada movimiento (`tipo:'scroll'`, una vez por
  cuadro). `espejoAplicarScroll()` en la copia ubica ese mismo verso a la misma altura. En la copia, modo Scroll, ya no
  se centra sola en el verso activo (manda el profe; cuando suena, la vista del profe se centra y la copia la sigue).
- **Prueba (2026-10-07, servidor local):** profe en 1366×768 y copia en 1920×1080 con la misma canción: al 60 % de la
  letra, el verso 69 queda al 51,6 % de la altura en ambas; arriba, el verso 13 al 47,5 % en ambas. Falta probar en
  clase.

### AK. Participación en la Pizarra — idéntica al tablero del profe
*Origen: PO (2026-10-07): "la pantalla de participación que se proyecta en la Pizarra debe ser idéntica a la que se
presenta en la pantalla del profe". Corrige la Etapa 2 de AI, que dibujaba en la Pizarra una versión simplificada.*
- **Implementado:** el diseño del tablero pasó del Libro a **`comun/participacion-tablero.css`** (lo usan el Libro y la
  Pizarra; con sus propias variables, tipografía e interlineado para verse igual en ambas páginas; máximos de letra que
  crecen con la pantalla). El cálculo de tamaños (`LibroProyeccion.layoutTablero`) y el nombre gigante
  (`LibroProyeccion.dimensionarBig`) pasaron a `comun/libro-proyeccion.js` y el Libro los usa (`proyectorLayout`,
  `proyectorMostrarBig`). El Libro envía el tablero tal cual (`proyTableroFoto`: contador, cuadros con sus clases
  —inhabilitado, barajando, entra—, zonas vacías, cerrada, nombre gigante) y cada cambio sale al instante
  (`MutationObserver`); la Pizarra lo arma con la misma estructura y actualiza los cuadros en su lugar (las animaciones
  no se reinician). Botones "Elegir al azar" / "Salir" invisibles en la Pizarra (ocupan su lugar: misma barra). Con el
  Proyector abierto, la página del Libro oculta su barra de desplazamiento (el tablero usa todo el ancho).
- **Prueba (2026-10-07, servidor local, "EL MUSEO", clase simulada):** profe y Pizarra en 1366×768: mismos valores de
  columnas / ancho / alto / letra (5 · 253 · 80 · 37 px), mismos cuadros y contador; 🎲 sorteo: el barajado se ve en la
  Pizarra y termina en el mismo nombre gigante con el mismo tamaño (EMILIANO, 179 px); Pizarra en 1920×1080: mismo
  tablero agrandado (letra 55 px, 5,1 % del alto), sin nombres cortados. Falta probar en clase.
- **Validado por el PO (2026-10-07):** "ahora sí se ve igual". **Ajustes pedidos:**
  1. **"🎲 Elegir al azar" visible en la Pizarra y lo más grande que da el espacio** (en ambas pantallas): ocupa todo
     el espacio libre de la barra, letra como el contador; en la Pizarra se ve (gris mientras sortea, igual que el
     profe) pero no se aprieta; "Salir" sigue invisible ocupando su lugar. `line-height` fijo en los botones para que
     ambas pantallas midan igual.
  2. **El parpadeo del sorteo pasa por TODOS los válidos antes del resultado:** orden al azar sin repetir; con menos de
     10, una segunda vuelta (nunca el mismo dos veces seguidas); parte rápido y se frena; el último también alcanza a
     parpadear (antes se borraba al instante). El orden no depende del elegido (la preselección no se delata).
  - **Prueba:** 3 sorteos con 21 válidos → los 21 parpadean, solo válidos, ~2,9 s; con 3 válidos → 6 pasos (dos
    vueltas), todos vistos, sin repetidos seguidos; profe y Pizarra en 1366×768 con los mismos valores
    (5 · 253 · 78 · 37 px).
  3. **"Elegir al azar" centrado en la Pizarra** (foto del PO en el proyector: el espacio de "Salir", invisible,
     lo corría a la izquierda): en la copia "Salir" ya no ocupa lugar; la barra mide lo mismo (su alto lo da el botón
     grande), así que el tablero sigue idéntico (5 · 253 · 78 · 37 px en ambas). Centro del botón a 3 px del centro
     del espacio libre.

### AL. Versión nueva — "Recargar" también renueva la ventana de la Pizarra
*Origen: PO (2026-10-07): tras AK, "no veo los cambios, se ve la pantalla simplificada antigua, y eso que le di a lo
de hay una nueva versión". Complementa AB.*
- **Auditoría:** la versión estaba publicada (Pages construyó `043026c`; el sitio entregaba el archivo nuevo). El
  "Recargar" del Workspace (AB) renueva solo sus pestañas; la **Pizarra es una ventana aparte** (proyector) y seguía con
  el código anterior en memoria: recibía el tablero nuevo, no sabía dibujarlo y dejaba en pantalla la versión
  simplificada. Además el navegador guarda cada archivo hasta 10 min (`Cache-Control: max-age=600` de GitHub Pages).
- **Implementado:** `PC/workspace.html`: al "Recargar", tras renovar los archivos, avisa por el canal
  `profe-version`. `PIZARRA/index.html`: al recibirlo pide al servidor sus archivos al día (incluido
  `comun/participacion-tablero.css`, que se carga solo al usarlo) y se recarga **en la misma diapositiva**
  (`?slide=` actual).
- **Prueba (2026-10-07, servidor local):** Pizarra en la diapositiva 4; aviso desde otra pestaña → se recargó sola y
  quedó en la diapositiva 4 (`?slide=3`).
- **Una sola vez:** la Pizarra que estaba abierta antes de esta versión no tiene el aviso; hay que recargarla a mano
  (Ctrl + Shift + R en esa ventana) o cerrarla y volver a abrirla. Desde ahí, "Recargar" la renueva sola.
- **Segundo hallazgo del PO (2026-10-07, foto de la Pizarra en Sexto):** la Pizarra ya era nueva, pero el **Libro** que
  proyectaba era una copia anterior (envió la Participación "Director musical" en el formato viejo y la Pizarra solo
  pudo mostrar el nombre). Causa probable: ese Libro se abrió después del "Recargar" con la misma dirección que uno
  abierto minutos antes, y el navegador usó su copia guardada (hasta 10 min).
- **Arreglo 2 (`PC/workspace.html`):** (1) toda pestaña nueva se pide con la versión en su dirección (`wsv=<versión>`):
  tras una subida, la dirección cambia y el navegador la pide al servidor; (2) al detectar una versión nueva, se piden
  al día de inmediato las piezas compartidas (`comun/*`, `supabase/config.js`, `contextos.js`), también al "Recargar".
  Prueba local: pestaña de Libro abierta con `&wsv=…`, carga normal y con el código nuevo; sin errores.

### AM. Una sola clase en curso, y todo el sistema lo sabe (también el celular)
*Origen: PO (2026-10-08), al definir AN: "cuando hay una clase en curso no puede haber otra en curso; y cuando hay una
clase en curso todo el sistema debe poder saberlo, porque el sistema está adaptándose a funcionar distinto estando en
clases o no, eso incluye al cel". **DECISIÓN del PO** (registrada en `CLAUDE.md` §3).*
- **Necesidad:** el celular (AN) solo evalúa con una clase en curso; hoy "Comenzar clase" queda guardado solo en el
  computador donde se apretó (`ClaseVivo`, `localStorage`), así que el celular y otros equipos no lo saben.
- **Auditoría:** `comun/clase-vivo.js` guarda la clase en `localStorage` (`profe_clase_activa`); la usan Planificador,
  Pizarra, Libro, Repertorio y Workspace. El Planificador ya impide comenzar otra clase en el mismo computador (botón
  desactivado), pero no entre equipos. `clase_tiempos` se escribe solo al terminar (no sirve para saber "en curso").
- **Aprobado (PO 2026-10-08):**
  1. "Comenzar clase" deja la clase en curso registrada en internet (tabla nueva `clase_en_curso`, una sola fila;
     `supabase/clase_en_curso.sql`, la corre el PO). Todos los equipos y módulos pueden saber cuál es.
  2. Con otra clase en curso (en este u otro equipo), "Comenzar clase" avisa "Hay una clase de X en curso" y, con la
     clave, la termina y comienza la nueva.
  3. Una clase olvidada se termina sola a las **2 horas**.
  4. Esta etapa es solo la base; cómo cambia cada módulo "en clase" se ve módulo a módulo (primero el celular, AN).
- **Implementado:** `comun/clase-vivo.js`: `comenzar` / `terminar` publican la clase en `clase_en_curso` (sin internet
  queda en `profe_clase_publicar` y sale después; última foto en `profe_clase_remota`); `conectar(sb)` lee la fila al
  abrir, con avisos al instante (realtime), cada 60 s, al volver a la pestaña y al volver la conexión; si otro equipo
  comenzó otra clase, la de aquí se termina (sus tiempos se guardan); `enCurso()` = clase en curso de cualquier equipo;
  vencimiento a las 2 h (los tiempos quedan con fin = inicio + 2 h). Conectan: Planificador, Libro, Repertorio.
  `PORTAL/index.html`: "Comenzar clase" con otra clase en curso abre el aviso "Hay otra clase en curso" con la clave
  ("Terminarla y comenzar esta"); la clase de otro equipo se ve en la barra (curso + tiempo, sin tiempo perdido).
- **Prueba (2026-10-08, servidor local, tabla simulada):** dos "equipos": A comienza → la tabla queda con A; B ve la
  clase de A; B comienza otra → la tabla queda con B y A termina la suya sola; B termina → tabla vacía y A sin clase.
  Sin internet → queda pendiente y sale al volver. Planificador con clase de otro equipo: barra "Sexto 25:06", botón
  activo y aviso con clave. Sin la tabla creada, todo sigue como antes.
- **Prueba con la tabla real (PO corrió el SQL):** comenzar → fila en `clase_en_curso`; otro equipo (simulado) comienza
  otra → el aviso llega al instante y la clase local se termina sola. Datos de prueba borrados. Commit `c40dae0`.

### AN. Celular — evaluar por toques (primer paso de la PWA móvil)
*Origen: PO (2026-10-08). Depende de AM.*
- **Necesidad:** evaluar en la sala desde el celular: todos los estudiantes a la vista, cada uno parte con 7 y cada
  toque en su nombre le resta nota.
- **Auditoría:** las evaluaciones del Libro existen solo en **cursos** (no talleres); ya tienen grupos de trabajo
  (`libro_evaluacion_grupos`), instrumentos (rúbrica / lista de cotejo), nota mínima por evaluación (`nota_min`, 2,0 por
  defecto) y reevaluación (AD). El celular hoy solo tiene la Bitácora; no hay PWA (ni manifiesto ni modo sin internet).
- **Aprobado (PO 2026-10-08):**
  1. **Libro:** nuevo instrumento **"Por toques"** al crear la evaluación, con "descuento por toque" (0,1 por defecto).
  2. **Celular:** botón "📝 Evaluar" junto a la Bitácora; requiere **clase en curso** (AM) y muestra las evaluaciones
     "Por toques" abiertas de ese curso. Con grupos, se elige un grupo; si no, el curso completo. Cuadrícula vertical
     de nombres; **los ausentes no aparecen**; solo aparecen los **pendientes** (en una segunda clase, los que faltan;
     un reevaluado vuelve a ser pendiente).
  3. El celular **solo acumula toques** (la palabra es "toque"). "↩" deshace el último; mantener apretado resta uno.
     Sin internet guarda en el celular y sube después.
  4. **"Terminar" en el celular** (por grupo o curso): los que estaban en pantalla quedan evaluados; sin toques = 7.
     Lo evaluado no se toca más desde el celular.
  5. **Libro, Resultados:** toques de cada estudiante y nota que corresponde (7 − toques × descuento, nunca bajo la nota
     mínima); se puede cambiar cualquier nota a mano.
  6. Celular instalable como app (ícono en la pantalla de inicio) y abre sin señal: base de la PWA.
  7. Columnas y tamaño de los nombres: **3 columnas y el tamaño actual, aprobados por el PO (2026-10-08)**.
- **Implementado:**
  - Supabase (`supabase/libro_toques.sql`, corrido por el PO): `libro_evaluaciones.descuento_toque` (NULL = normal) y
    `libro_evaluacion_notas.toques`.
  - `LIBRO/index.html`: casilla "Por toques (desde el celular)" + descuento al crear; "📱 por toques" en la lista;
    descuento editable en General; Resultados de una evaluación por toques = lista completa (toques · corresponde ·
    nota editable a mano, "(a mano)" si difiere · estado); Reevaluar guarda los toques en el intento y parte en 0
    (Deshacer los devuelve). Se implementó como **forma de evaluar de la evaluación** (no como instrumento con ítems).
  - `MOVIL/evaluar.html` (nueva): clase en curso (`ClaseVivo.enCurso`) → evaluaciones por toques abiertas del curso
    (si hay una, entra directo) → grupo (si hay grupos; "Sin grupo" para los sueltos) → cuadrícula de 3 columnas con
    pendientes presentes de matrícula activa; nombres con la regla del Libro (deuda Y). Toque = +1, mantener 0,55 s =
    −1, "↩" deshace, color según toques (1 / 3 / 5+). "Terminar" escribe 7 − toques × descuento (piso = nota mínima)
    y `nota_excepcion` si está en un grupo. Cola sin conexión `profe_toques_cola`; copias para abrir sin señal.
  - `MOVIL/index.html`: botón "📝 EVALUAR"; manifiesto (`MOVIL/manifest.webmanifest`, íconos `icono-192/512.png`) y
    **`sw-movil.js`** en la raíz: solo atiende las páginas del celular (MOVIL, MEMORIA, `comun/clase-vivo.js`,
    `comun/asistencia.js`, `supabase/config.js`, `contextos.js`, supabase-js); primero internet, sin señal la copia.
- **Prueba (2026-10-08, servidor local, Segundo, evaluación "PRUEBA TOQUES (borrar)", descuento 0,5):** creada desde el
  formulario; clase comenzada → el celular entra directo al tablero (31 de 37: los 6 ausentes reales de hoy no
  aparecen); 3 toques a uno, ↩, mantener apretado → 2; los toques llegan a Supabase al instante; Terminar → 29 con
  7,0, 1 toque 6,5, 2 toques 6,0; los 6 ausentes siguen pendientes. Libro/Resultados: lista correcta; nota a mano 5,5
  → "(a mano)"; Reevaluar → toques 0 y nota vacía; Deshacer → vuelven 2 toques y 5,5. App: el celular registró la
  pieza sin señal y guardó sus 12 archivos. Todo lo de prueba borrado (evaluación, clase en curso; sin tiempos).
- **Pendiente:** probar en el celular real (instalar, tamaño de nombres/columnas, sin señal en la sala). Commit `017ad1b`.
- **Prueba del PO en su celular (2026-10-08):** los toques sin señal quedan "⏳ N sin subir" y suben al volver internet
  (bien). **Error:** al abrir Evaluar en modo avión quedaba "Cargando…" sin fin (la consulta a internet no respondía y
  no había límite). **Arreglo:** sin conexión no se consulta internet y se usa la copia del celular al instante; con
  conexión mala, se espera hasta 5 s y luego la copia; la lista de ausentes también sale de la copia. Sin copia, avisa:
  "ábrela una vez con internet". Prueba local: conexión que no responde → aviso a los 5 s; sin señal → al instante;
  con copia guardada → tablero al instante con sus toques. Validar en uso real.

### AO. Workspace — insignia de "clase en curso" en la barra (deuda)
*Origen: PO (2026-10-08). Anotada; **aprobada el mismo día**.*
- Con clase en curso, una insignia en la barra del Workspace; al apretarla abre el Planificador de esa clase.
- **Aprobado (PO 2026-10-08):** insignia a la derecha de todo en la barra: "Hay una clase en curso, ir". Lleva al Plan
  de esa clase; si ese Plan ya está abierto, va a esa misma pestaña (nunca se abre dos veces). Mientras se está en
  el Plan de esa clase, la insignia no se ve.
- **Auditoría:** las pestañas de Plan usan la clave `plan:<contexto_id>|<fecha>` y la dirección
  `PORTAL/index.html?ctx=<NOMBRE>&fecha=<fecha>`; la clase en curso (`ClaseVivo.enCurso`, AM) trae `ctx` y `fecha`
  (no el id del contexto). El Workspace no tiene `sb`: se entera por el `localStorage` que escriben sus pestañas.
- **Implementado (`PC/workspace.html`):** botón `#ws-clase` a la derecha de todo (tras el aviso de versión nueva),
  rojo; visible con clase en curso salvo cuando la pestaña activa es el Plan de esa clase; `title` con el curso (y "otro
  equipo" si corresponde). Toda pestaña de Plan guarda su clase (`clasePlan`: "NOMBRE|fecha" de su dirección) y
  `abrirInstancia` reconoce un Plan ya abierto por su clase aunque la clave sea otra: la insignia y el Dashboard nunca
  abren el mismo Plan dos veces. Se actualiza con `ClaseVivo.onCambio`, al cambiar de pestaña y cada 30 s.
  Carga `supabase/contextos.js` (nombre visible del curso).
- **Prueba (2026-10-08, servidor local, Segundo):** sin clase → no se ve; clase comenzada → "Hay una clase en curso,
  ir" a la derecha; clic → abre el Plan de Segundo y la insignia se oculta; en Dashboard reaparece; clic → misma
  pestaña (3 pestañas); el Dashboard pidiendo el mismo Plan con su clave → misma pestaña; al revés (Plan abierto
  desde el Dashboard, luego la insignia) → misma pestaña; terminar → la insignia desaparece. Sin datos de prueba.

### AP. Insignia de clase en curso — no mostrarla en las pestañas de esa misma clase (deuda)
*Origen: PO (2026-10-08), tras AO en uso: "en clase en curso voy a distintas pestañas que sí son de la clase: el
repertorio del curso, el libro, etc.; ahí el badge no corresponde". Anotada para iterar después; no implementar aún.*
- **Necesidad:** la insignia solo debe verse fuera de la clase en curso; en el Libro, la Sesión del Entrenador u otras
  pestañas de ese mismo curso sobra.
- **Hallazgo previo (para la auditoría):** esas pestañas usan claves con el id del contexto (`libro:<cid>`,
  `sesion:<cid>`); el Libro lleva `ctx=<NOMBRE>` en su dirección, la Sesión del Entrenador no (solo `practicar=<id>`).
  Habría que marcar cada pestaña con su curso al abrirla desde el Plan.
- **Propuesta (Claude, no decidida):** ocultar la insignia en toda pestaña abierta desde la clase en curso (Plan, Libro,
  Sesión del Entrenador, Pizarra…), y mostrarla solo en Dashboard, Repertorio general y pestañas de otros cursos.
- **Aprobado e implementado el mismo día (PO: "iterémoslo altiro"; se adoptó la propuesta):** `PC/workspace.html`:
  cada pestaña guarda su curso al abrirse (`curso`): el de su Plan (`clasePlan`), el `?ctx=` de su dirección (Libro)
  o, si no lo trae, el de la pestaña que la pidió abrir (`cursoOrigen`, p. ej. la Sesión del Entrenador abierta desde
  el Plan). La insignia no se ve en el Plan de la clase en curso ni en las demás pestañas de ese curso; sí en el
  Dashboard, el Repertorio general, el Entrenador del catálogo y los Planes de otros cursos o de otra fecha.
- **Prueba (2026-10-08, servidor local, clase de Segundo):** Dashboard → se ve; su Plan → no; Libro de Segundo (desde
  el Plan) → no; Sesión de Segundo (desde el Plan) → no; Repertorio general → se ve; Plan de Octavo → se ve.
  Clase de prueba terminada sin guardar tiempos.

### AQ. Entrenador — canción sin letra (error de la letra anterior + agregar letra desde la sesión)
*Origen: PO (2026-10-08): "Cafuné" (pedido → cargado desde la Biblioteca) quedó en la sesión de Octavo sin letra, y
el Entrenador mostraba la letra de la canción anterior.*
- **Auditoría:** al cargar un pedido, la canción se crea y se busca su letra en LRCLIB; si no está, queda solo con
  audio (aviso breve "sin letra en LRCLIB"). En el Entrenador, `entRenderChips` no cargaba nada cuando la canción no
  tenía recursos y dejaba vivas las líneas de la canción anterior (`entrenadorLines/Stanzas`): se veían y **se podían
  editar encima** de la canción nueva. Con recursos sin letra (ritmo, metalófono) las líneas viejas también quedaban.
- **Arreglo (error, sin esperar decisión):** `entLimpiarLetra()` al abrir una canción sin recursos (muestra "Sin
  letra", sin Sync) y al cargar un recurso que no es letra; `entRenderZona` ya no dibuja letra sobre un ritmo /
  metalófono / PDF.
- **Prueba (2026-10-08, servidor local, sesión "Octavo 2026"):** Para No Verte Más → Doma → Loco → Cafuné: "Sin letra"
  (0 líneas), Editar no se abre; de vuelta a Loco su letra vuelve bien.
- **Propuesta pendiente de decisión del PO:** en el Entrenador, si la canción no tiene letra, recuadro "➕ Agregar
  letra" (🔎 buscar en internet, repetible cambiando nombre/artista · 📋 pegar la letra), y aviso claro y fijo al
  "Cargar" un pedido sin letra.
- **Aprobado por el PO (2026-10-08, "hazlo altiro") e implementado (`REPERTORIO/index.html`):**
  - Canción sin ninguna letra → en el Entrenador, recuadro "Esta canción no tiene letra": buscador con nombre + artista
    (editable, Enter busca) que lista hasta 6 resultados de LRCLIB ("con tiempos" / "solo texto") para elegir, o
    "📋 Pegar la letra". Al guardar se crea el recurso `letra` de la canción y se abre de inmediato (listo para Sync).
    Lo que se escribe en el recuadro no activa los atajos del Entrenador. En la copia de la Pizarra solo "Sin letra".
  - `lrclibBuscar`: si no hay resultados, reintenta **sin tildes** (hallazgo: "Cafuné Micro TDH" no daba resultados y
    "Cafune Micro TDH" sí). Lo usa también la creación de canciones/pedidos, que además toma el primer resultado
    **con** letra.
  - Pedido cargado que queda sin letra → aviso fijo: "quedó en la sesión, pero SIN LETRA… agrégala desde el Entrenador".
- **Prueba (2026-10-08, sesión "Octavo 2026", Cafuné):** recuadro visible; escribir con espacios no reproduce; con la
  tilde ahora encuentra 6 resultados; elegir el primero (guardado simulado, sin escribir en Supabase) → 93 versos en
  pantalla y Sync disponible. Cafuné quedó intacta en Supabase (solo audio): **el PO elige su letra**.

### AR. Entrenador — portada de la canción y cancionero en tarjetas en la Pizarra
*Origen: PO (2026-10-08): "render del título de la canción, el artista y el año si hay, en todas las canciones del
Entrenador"; y "al estar abierto el cancionero como lista en el Entrenador del profe, que en la proyección se vean las
canciones a pantalla completa, como cards, tipo los nombres de Pasar lista pero más grandes, sin artista; mismo botón
y atajo; las pedidas no se muestran".*
- **Decisiones del PO:** cancionero = la lista de la sesión (☰, mismo botón y atajo); en la pantalla del profe nada
  cambia; en la Pizarra se ven las tarjetas mientras la lista esté abierta; sin pedidas. Portada: se adoptó la
  recomendación (portada al comienzo de la letra; en Diapositiva, una línea arriba).
- **Implementado (`REPERTORIO/index.html`):**
  - `entPortadaHTML` / `entPortadaPartes`: título (1,2 × letra) y debajo "artista · año" (campo `año` de la canción, si
    hay), antes del primer verso en Scroll (se va con la letra). Diapositiva: línea "Título · artista · año" arriba,
    con su alto descontado del espacio de la letra (sigue sin desbordes). No aparece en Sync ni en Edición.
  - Espejo: el estado incluye `cancionero` (canciones de la sesión con la actual marcada) solo si la lista ☰ está
    abierta en modo sesión; la Pizarra lo muestra en `#espejo-cancionero` a pantalla completa, fondo oscuro, tarjetas
    verdes estilo Pasar lista (la canción actual en naranjo), tamaño máximo sin cortar títulos (mejor nº de columnas,
    ajuste fino si algo no cabe); se reacomoda al cambiar el tamaño. Al cerrar la lista vuelve la letra.
- **Prueba (2026-10-08, servidor local, sesión "Octavo 2026", copia en otra pestaña):** portada "Para No Verte Más /
  La Mosca Tsé-Tsé · 1999" en Scroll; Diapositiva en 1920×1080 con la línea arriba y sin desbordes; lista abierta →
  4 tarjetas (actual en naranjo; 1 columna en 800×755, 2×2 en 1920×1080); lista cerrada → vuelve la letra.
- **Ojo (uso):** en la sesión la lista suele estar abierta; mientras se proyecte el Entrenador, la Pizarra mostrará
  el cancionero hasta cerrar la lista (☰).
- **Validado por el PO (2026-10-08): "todo está ok".** Ajuste pedido: las tarjetas respetan el tono claro/oscuro del
  Entrenador del profe (`claro` del estado del espejo): claro = fondo #eef2f6 (el del Entrenador claro), tarjetas verde
  claro con texto verde oscuro y la actual en naranjo claro; oscuro = como antes. Prueba: claro → tarjetas claras;
  cambiar el profe a oscuro → la Pizarra pasa a oscuro al instante.
- **Ajuste del PO (2026-10-08): usar los colores propios del Entrenador.** Oscuro: fondo #0f172a, tarjetas #1e293b
  con borde #334155 y texto #cbd5e1; la actual #140d06 con naranjo #ea580c (como la canción activa de la lista).
  Claro: fondo #eef2f6, tarjetas blancas con borde #e2e8f0 y texto #334155; la actual #fff7ed con naranjo #ea580c.
  Prueba: ambos tonos en la copia, cambio al instante.
- **SQL corrido por el PO (2026-10-08):** verificación karaoke 2 · melodia 51 (correcta).
- **Prueba (servidor local, datos reales):** 0 audios sin tipo; canciones con los dos: Amenaza de Ultracumbia y
  Severla god level. Amenaza abre en Melodía (botón visible "🎤 Melodía"); en 0:42 a 0,75× → Karaoke: mismo punto
  (42 s) y velocidad, botón "🎶 Karaoke" en naranjo, Sync desactivado y no entra; vuelta a Melodía en 42 s con Sync
  activo. Duraciones Melodía/Karaoke iguales en ambas canciones (0 s de diferencia). Canción con un solo audio
  (Cafuné): sin botón. El botón usa el mismo estilo que Pitch (claro y oscuro). No se tocó ninguna letra ni su
  sincronización (el cambio no escribe en `letra`).
- **Deudas registradas (etapa 5):** el **Visor de letras** (en desuso) y el modo canción de la **Pizarra** (`PIZARRA/`)
  siguen eligiendo "el primer audio": en las 2 canciones dobles podrían sonar en karaoke. Se corrigen cuando se
  trabaje cada uno (decisión del PO del 29-09: no tocarlos ahora).
- **Cerrada la implementación; pendiente probar en clase.**
- **DECISIÓN del PO (2026-10-08), al revisar las deudas de la etapa 5:** el **Visor de letras** y las **diapositivas de
  canción de la Pizarra** (`@rep:`) están **en desuso** (la sesión de repertorio del curso las reemplazó): no se les
  corrige el audio. "Todo asset del repertorio (salvo las tablaturas) lo consume el Entrenador: si quiero escuchar la
  canción o ver la letra, que se abra el Entrenador."
- **Implementado:** en la Biblioteca, "▶ Ver letra" abre el Entrenador (se quitó el botón 🎯, que quedaba repetido);
  el Entrenador se abre también sin audio (solo la letra). Prueba: Amenaza de Ultracumbia (con audio, 118 versos) y
  "Cuando se apaga la PC" (solo letra, 49 versos, sin audio) abren en el Entrenador.

### AS. Retirar el Visor de letras y las diapositivas de canción de la Pizarra (deuda)
*Origen: DECISIÓN del PO (2026-10-08): ambos en desuso. Pendiente decidir su retiro (regla §4.10: no conservar legacy
como respaldo).*
- **Hoy:** el Visor (`abrirVisor` y su pantalla, `REPERTORIO/index.html`) ya no tiene botón; el selector de canciones
  del Planificador (`@rep:`) y su diapositiva en la Pizarra siguen existiendo y eligen "el primer audio".
- **Propuesta (Claude, no decidida):** retirar ambos en una limpieza propia (código, botón del selector de canciones
  del Planificador y soporte `@rep:` en la Pizarra), revisando antes si alguna presentación guardada aún usa `@rep:`.
- **Auditoría (2026-10-13):** 50 presentaciones guardadas usan `@rep:`, todas de clases pasadas (la última, 2026-08-24);
  ninguna futura. Sin soporte, esas diapositivas se verían como texto crudo (`@rep:Nombre|id`).
- **DECISIÓN del PO (2026-10-13, opción 1 recomendada):** retirar Visor, selector de canciones del Planificador y la
  diapositiva de canción de la Pizarra (letra, audio, modos, coloreado). Las `@rep:` guardadas se muestran como una
  diapositiva de texto simple con "🎵 Nombre" (Pizarra y vista previa del Planificador). **No se tocan los datos.** La
  tecla T de la Pizarra (abrir el Entrenador) se conserva.
- **Implementación (2026-10-13, `d416d43`):** ~1.800 líneas fuera (Pizarra, Planificador, Biblioteca). Probado en local:
  la clase del 24-08 de Tercero muestra sus 7 canciones como "🎵 Nombre" en la Pizarra y en la vista previa; el menú
  Insertar queda en Metalófono / YouTube / Imagen; el Entrenador abre y cierra igual. **Cerrada.**

### AT. Repertorio pasa a llamarse Biblioteca (en todo el sistema)
*Origen: DECISIÓN del PO (2026-10-08): "formalizar que Repertorio ahora se llama Biblioteca, en todo el sistema".*
- **Auditoría:** "Repertorio" aparece como nombre visible en la pestaña del Workspace, el título de la página, el Lector
  (botones de abrir/elegir tablatura, avisos), avisos del Planificador y el buscador de la Pizarra; y en CLAUDE.md /
  fichas. Internamente es carpeta `REPERTORIO/`, tablas `repertorio_*`, bucket `repertorio-assets`, clave de pestaña
  `repertorio` y direcciones que ya circulan (links a alumnos).
- **DECISIÓN del PO (adopta las 2 recomendaciones de Claude):**
  1. Cambia **solo el nombre visible**; carpeta, tablas, bucket, claves y direcciones **no se tocan** (romperían links
     y datos).
  2. La palabra **"repertorio" se conserva en su sentido pedagógico**: el repertorio **del curso** (sesión del
     Entrenador) y el **de un alumno** (Lector). Biblioteca = todo lo que hay; repertorio = lo que trabaja un curso o
     alumno.
  3. La **"Biblioteca Musical"** del roadmap queda **absorbida por esta Biblioteca** y sale de los módulos futuros.
- **Implementación (2026-10-08):** título y encabezado de la página (`REPERTORIO/index.html`), pestaña del Workspace
  (`PC/workspace.html`, ícono 🎵 sin cambio), avisos del Planificador (`PORTAL/`), buscador del selector de la Pizarra
  ("Buscar canción de la Biblioteca…", "Cargando canciones…") y textos del Lector (`tabs/index.html`: columna
  "📚 Biblioteca" del panel de asignación, "Desde Biblioteca", "Elegir tablatura de la Biblioteca", avisos y toast).
  Se conservan, por su sentido pedagógico: botón "Repertorio" del Planificador (repertorio del curso), "Repertorio de
  <alumno>" en el Lector y la categoría de pendiente "Repertorio" (ADMIN/Portal). CLAUDE.md actualizado (regla en §3;
  Biblioteca Musical retirada de §2, §8 y §9). Los cambios del Loop en `tabs/index.html` siguen sin guardar: solo se
  guardaron las líneas de este cambio.
- **Prueba (servidor local):** Biblioteca con título y encabezado "Biblioteca"; Pizarra y Lector con los textos nuevos;
  sin errores en consola.
- **Cerrada; pendiente que el PO la vea en uso.**

### AU. Biblioteca ↔ cursos: una sola verdad (la sesión del curso)
*Origen: PO (2026-10-08): "quiero conectar más la Biblioteca con los cursos; hoy la vinculación es a través de las
sesiones, pero la Biblioteca tiene un menú de cursos que debería apuntar a lo mismo y no lo hace; cada curso tiene un
subconjunto de la Biblioteca y debe poder administrarse directamente desde la Biblioteca, no desde Sesiones".*
- **Auditoría:** hay dos vínculos canción↔curso que no se hablan: (a) la **sesión del curso** del Entrenador
  (`repertorio_sesiones_entrenamiento.contexto_id` + `canciones` JSONB, una por curso), que es la que se usa en clase y
  abre el Planificador; (b) la tabla `repertorio_cancion_contextos` (por **nombre** de contexto), que alimenta los
  botones "Curso" de la Biblioteca y se marca a mano en la ficha de la canción. Datos (2026-10-08): casi no coinciden
  (Sexto 3 vs 10, Tercero 1 vs 9; Segundo/Octavo/Castigadas/Kids 0 vs 9/4/4/2; Cuarto y Quinto con 1 canción solo en
  el botón; Recreo 5 canciones y sin sesión). `PERSONAL` vive en la misma tabla pero no es curso (lo usan Lector y
  Planificador para excluir). Sesiones sin curso (Salsas, Cuecas 2026, Mine, Pancho Morales) son listas libres.
- **DECISIÓN del PO (adopta las recomendaciones):**
  1. La **sesión del curso es la única verdad**; los botones de curso de la Biblioteca la muestran (todos los cursos con
     sesión, aunque estén vacíos).
  2. Se **administra desde la Biblioteca**: marcar/desmarcar un curso en la ficha de la canción la agrega (al final) o la
     saca de la sesión del curso (sacarla pide confirmación: se pierden sus loops en esa sesión).
  3. Curso sin sesión → se crea sola al marcar su primera canción ("<Curso> <año>").
  4. **⭐ Personal** sigue como marca aparte (tabla actual).
  5. Ordenar sigue en el Entrenador.
  6. Antes del cambio se suman a sus sesiones las canciones que hoy están solo en el botón (Sexto y Quinto: "Si Antes Te
     Hubiera Conocido"; Cuarto: "Melodía Andina"; Recreo: 5 canciones → sesión nueva). Autorizado por el PO (escritura
     de datos, sin cambio de tablas).
  7. Vínculo **por canción** (con todos sus recursos); por recurso suelto, más adelante si hace falta.
- **Implementación (2026-10-08, `REPERTORIO/index.html`):** `recalcCursos()` arma los cursos de cada canción desde las
  sesiones con `contexto_id`; de `repertorio_cancion_contextos` solo se lee la fila `PERSONAL`. Botones de curso = cursos
  con sesión (aunque vacía). En la ficha, `toggleCurso` → `cursoAsignar` lee la sesión al día, agrega al final o saca
  (con confirmación), crea la sesión si falta y avisa a las otras pestañas por el canal `profe-repertorio-pedidos`
  (`tipo: 'curso'`, `cursoAplicar` actualiza la lista del Entrenador abierto). ⭐ Personal escribe solo su fila
  (`sbGuardarPersonal`). Las filas de curso antiguas de la tabla quedan sin uso (no se borraron).
- **Datos (autorizado por el PO):** sumadas "Si Antes Te Hubiera Conocido" a Sexto 2026 (11) y Quinto 2026 (3),
  "Melodía Andina, loop inicial" a Cuarto 2026 (4); creada **Recreo 2026** con Las Avispas, Waka Waka, Hakuna Matata,
  Baianá y Nunca Me He Sacado un 7.
- **Prueba (servidor local, datos reales):** botones Personal 13 · Castigadas 4 · Cuarto 3 · Kids 2 · Octavo 4 ·
  Quinto 2 · Segundo 9 · Séptimo 2 · Sexto 10 · Tercero 9 (antes de sumar); con el Entrenador de Recreo abierto en otra
  pestaña, sacar "Nunca Me He Sacado un 7" desde la ficha la quitó de su lista al instante y volver a marcarla la
  devolvió al final (Supabase igual); ⭐ Personal marcar/desmarcar sin tocar otras filas. Sin errores.
- **Cerrada; pendiente probar en clase.**

### AV. Biblioteca — sin pestaña "Sesiones", botón "🏋️ Practicar" y barra ordenada
*Origen: PO (2026-10-08), tras AU: "la pestaña Sesiones en la Biblioteca está un poco demás"; "ordena el toolbar de la
Biblioteca, es un desastre".*
- **Auditoría:** "🎯 Sesiones" abre la misma lista que la pestaña 🏋️ Entrenador del Workspace (`?vista=sesiones`):
  practicar, crear, renombrar, ordenar, vincular a curso, borrar, y las 4 listas libres (Salsas, Cuecas 2026, Mine,
  Pancho Morales). Tras AU, lo de cursos ya se maneja en la Biblioteca. La barra de filtros ocupaba 3 filas: tipo, orden
  (3 botones) y "Filtrar" con cursos en columna angosta + ~30 estilos como botones; curso y estilo se excluían entre sí.
- **DECISIÓN del PO:** quitar "🎯 Sesiones" de la Biblioteca; al elegir un curso, botón mínimo **"🏋️ Practicar"** que
  abre la sesión de ese curso; la lista de sesiones (y las listas libres) queda solo en el Entrenador, igual que hoy.
  Ordenar la barra (diseño a criterio de Claude).
- **Implementación (2026-10-08, `REPERTORIO/index.html`):**
  - "🎯 Sesiones" oculto (`#btn-sesiones { display: none }`; la función y `?vista=sesiones` siguen para el Entrenador).
  - Barra en **una línea**: tipo (Todo · 🎵 Canciones · 📚 Materiales) | cursos ("Todos los cursos", ⭐ Personal y los
    cursos con sesión; bajan a una 2ª fila si no caben) | **🏋️ Practicar** (solo con un curso con canciones; abre su
    sesión en el Entrenador sobre la Biblioteca) | a la derecha, **listas desplegables** de estilo y orden.
  - Curso y estilo ahora **se combinan** (`filtroCurso` + `filtroEstilo`, antes `filtroExtra` excluyente); `?ctx=` sigue
    preseleccionando el curso.
  - Celular: la barra se acomoda en filas y el encabezado ya no se sale de la pantalla (se oculta el conteo).
- **Prueba (servidor local):** 1400 px en 2 filas; Sexto → 11 canciones y Practicar visible; Sexto + Cueca → 3; orden
  A–Z canción; ⭐ Personal sin Practicar; Practicar abre "Sexto 2026" (11) y al cerrar vuelve a la Biblioteca filtrada;
  pestaña Entrenador (`?vista=sesiones`) sin cambios; 375 px sin desborde. Sin errores en consola.
- **Ajuste del PO (2026-10-08): orden de los botones de curso.** Fila 1: "📚 Todos", 1°–6°; fila 2: 7°, 8°, talleres
  (Castigadas, Kids, Recreo) y ⭐ Personal, cada uno con su ícono. Alias compactos "Kids" y "Recreo" (regla §4.8, nombre
  completo en `title`). Solo aparecen cursos con sesión (hoy Primero no tiene). Prueba: 1400 px, filas como lo pedido.
- **Ajuste del PO (2026-10-08): cursos de la ficha de la canción** en filas: 1°–3° | 4°–6° | 7°–8° | Castigadas, Kids,
  Recreo | ⭐ Personal. Salen de la ficha Orientación, Enlace, Cuerdas y General (no llevan canciones; no tenían sesión).
  Prueba: filas exactas como lo pedido.
- **Ajuste del PO (2026-10-08): Cuerdas en ambos menús, con los talleres** (Castigadas, Kids, Cuerdas, Recreo). La barra
  muestra ahora siempre la lista completa (también cursos aún sin sesión, como Primero y Cuerdas; Practicar solo aparece
  si la sesión tiene canciones). Botones de la ficha sin mayúsculas forzadas, para que los 4 talleres quepan en una fila.
  Prueba: barra 2 filas y ficha 5 filas como lo pedido; Cuerdas → 0 canciones, sin Practicar.
- **Cerrada; pendiente que el PO la vea en uso.**

### AW. Entrenador — buscar letras: aviso honesto y probar sincronizaciones contra el audio
*Origen: PO (2026-10-12): en el Entrenador, "Mi Buen Amor (feat. Bunbury)" mostraba "Sin conexión para buscar" con
internet; y "me gustaría ir probando los resultados de la búsqueda para dar con uno con el timing correcto según mi
audio: escoger, revisar contra el audio y aprobar o descartar, hasta dar con el que se acerque más".*
- **Auditoría:** `entSinLetraBuscar` mostraba "Sin conexión" ante cualquier falla de LRCLIB; la misma búsqueda, minutos
  después, dio 20 resultados con tiempos (falla momentánea del buscador, no del internet). Los resultados de LRCLIB traen
  la duración de su versión: buena pista para elegir el que calza con el audio. Hoy solo se podía elegir a ciegas y solo
  en canciones sin letra.
- **DECISIÓN del PO (adopta las recomendaciones):** (1) reintentar 1 vez y avisar "el buscador de letras no respondió"
  (solo "sin conexión" si de verdad no hay internet); (2) lista (hasta 10 con tiempos) ordenada por cercanía de duración
  con el audio; (3) "▶ Probar" carga esa letra sin guardar y la reproduce con el audio; barra de prueba "Probando n de
  N · ✓ Usar esta · ✕ Descartar · ◀ ▶"; (4) también en canciones con letra: "🔎 Buscar otra sincronización", que
  reemplaza la letra solo al "Usar esta".
- **Implementación (2026-10-12, `REPERTORIO/index.html`):** `lrclibBuscar` reintenta 1 vez; el aviso distingue "el
  buscador no respondió" de "sin conexión" (`navigator.onLine`). Resultados (`entBusq`) con tiempos primero, ordenados por
  diferencia de duración con el audio (✓ si ≤ 2 s), con "▶ Probar" y "Usar". La prueba (`entPrueba`) carga un recurso
  temporal `_prueba` (nunca se guarda: guarda en `entGuardarAssetActivo`; Sync, Editar, recursos y 🔎 bloqueados) y
  reproduce desde 0:00; barra azul con ◀ ▶, ✕ Descartar (pasa a la siguiente no descartada), ✓ Usar esta y Volver (vuelve
  a la letra de antes y a la lista, que se conserva con los descartes). Botón 🔎 junto a Editar: misma búsqueda en una
  ventana; "Usar esta" reemplaza la letra actual con confirmación (mismo recurso, `contenido` + `synced` + `lrclib_id`).
  `entLetraDeResultado` usa el texto con estrofas solo si calza con los versos con tiempos. Cambiar de canción/recurso o
  cerrar el Entrenador termina la prueba sin guardar.
- **Prueba (servidor local, sin guardar nada):** "Mi Buen Amor" (audio 3:45, sin letra): 10 resultados, el 1° de 3:45 ✓;
  Probar → 37 versos y suena, Sync bloqueado, en 1:00 resalta "Mi buen amor"; Descartar pasa al 2°, ◀ vuelve al 1°
  marcado "descartada"; Volver → recuadro con la lista y 1 descartada, la canción sigue sin letra. "Para No Verte Más"
  (con letra): 🔎 → 10 resultados; Probar y Volver → vuelve su letra (62 versos) y Supabase sin cambios. "Amenaza de
  Ultracumbia" no está en LRCLIB (aviso "No se encontró"). Sin errores en consola.
- **Cerrada; pendiente probar en uso (el PO elige la letra de Mi Buen Amor y de Cafuné).**
- **Error en uso (PO, 2026-10-12):** al probar desde 🔎 la pantalla quedaba oscura y no respondía: el fondo de la ventana
  de búsqueda seguía encima (su `display: flex` anulaba `hidden`). Arreglo: `#ent-busq-modal[hidden] { display: none }`.
  Prueba: tras ▶ Probar la ventana queda oculta y "Usar esta" es lo que está bajo el puntero.

### AX. Planificador — diapositivas recurrentes en clase (1ª: "Silencio y atención")
*Origen: PO (2026-10-12): "en el Planificador, con clase en curso, un botón de la barra que me permita disparar
diapositivas recurrentes; la primera, una que invite al silencio y la atención": una imagen (sala con 5 estudiantes
atentos y el profe) en 3 versiones por edad.*
- **Auditoría:** el Planificador ya ordena a la Pizarra de la misma computadora (`Proyeccion.ordenar`, `localStorage`);
  la Pizarra tiene capas encima de la diapositiva (copia del Entrenador z 8500) y el contador de tiempo perdido encima de
  todo (`#clase-perdido`, z 9999). Claude no puede generar imágenes: entregó 3 textos para generarlas con IA.
- **DECISIÓN del PO:** botón en la barra (solo con la clase en curso de este equipo) con menú de recurrentes; la imagen
  queda en la Pizarra **hasta quitarla** (mismo botón o Esc) y vuelve a la diapositiva; **no** activa el tiempo perdido
  (se enciende aparte y se ve encima); versiones: 1°–2° infantil, 3°–5° intermedia, 6°–8° + talleres y Recreo
  adolescente; **por ahora el dibujo en blanco y negro del PO** para las 3 (se reemplazan los archivos cuando lleguen).
- **Implementación (2026-10-12):** pieza compartida **`comun/recurrentes.js`** (`Recurrentes`: catálogo `DIAPOS`,
  `version(ctx)`, `poner/quitar/actual/onCambio`, `capaEnPizarra(sesionId)`); estado en `localStorage`
  (`profe_recurrente` = { sesionId, diapo, version }). Planificador (`PORTAL/index.html`): botón 🔔 "Diapositivas
  recurrentes" en la barra, visible solo con la clase en curso de este equipo; menú con 🤫 Silencio y atención (tocarla de
  nuevo = Quitar); el botón se pinta ámbar mientras está puesta. Pizarra (`PIZARRA/index.html`): capa blanca a pantalla
  completa (z 9000: sobre diapositiva y copias del Entrenador/Libro, bajo el tiempo perdido z 9999) con
  `comun/diapositivas/<diapo>-<versión>.png`; Esc la quita y el Planificador se entera. Imágenes provisionales: las 3 son
  el dibujo del PO (`silencio-infantil|intermedia|adolescente.png`); al llegar las definitivas solo se reemplazan esos
  archivos.
- **Prueba (servidor local, sesión de Castigadas, sin comenzar clase real):** Planificador: menú con "🤫 Silencio y
  atención"; elegir pone/quita y el botón se enciende/apaga; versión de Castigadas = adolescente (1°–2° infantil, 3°–5°
  intermedia, resto adolescente). Pizarra en otra pestaña: aparece la imagen a pantalla completa; Esc la quita y el botón
  del Planificador se apaga solo. Sin errores nuevos (solo el 401 conocido de `eventos_uso`).
- **Imágenes definitivas (PO, 2026-10-12):** 3 versiones a color en 4:3 ("los proyectores muchas veces son más bien
  cuadrados"), en `.webp` (170–250 KB). **Ajuste del PO de cursos:** 1°–3° infantil, 4°–6° intermedia, 7°–8° (y talleres
  y Recreo) adolescente. Fondo de la capa negro (bandas a los lados en proyectores 16:9). Prueba: Tercero → infantil,
  Cuarto y Sexto → intermedia, Séptimo y Castigadas → adolescente; las 3 cargan (1448×1086).
- **Error en uso (PO, 2026-10-12): "selecciono Silencio y no aparece nada en la Pizarra".** En línea funcionaba (prueba con
  Planificador y Pizarra en pestañas): la ventana de la Pizarra del PO venía de antes de la actualización (sin la capa).
  Arreglo: la Pizarra acusa recibo (`profe_recurrente_ok`, `Recurrentes.recibida()`); si a los 1,5 s no lo hizo, el
  Planificador avisa "ciérrala y ábrela de nuevo con 📽️" (o "no está abierta"). Prueba: con la Pizarra al día, acuse ok
  y sin aviso.
- **Cerrada; pendiente probar en clase.**

### AY. Planificador — marco en la diapositiva que se está mostrando en la Pizarra
*Origen: PO (2026-10-12), deuda: "que la diapo que se esté mostrando (si es de las hechas en el cuadro de texto del
Planner) se muestre en el Planner con un distintivo visual (puede ser un marco)".*
- **Decisión del PO:** marco simple en la vista previa. Implementado el mismo día (alcance pedido explícitamente).
- **Implementación:** la Pizarra publica su diapositiva en `localStorage` (`profe_pizarra_slide` = { sesionId, idx }) al
  cambiar (`actualizarContadores`); el Planificador enmarca en ámbar (`.slide-prev.en-pizarra`, sombra, convive con el
  contorno de "activa") esa vista previa si es de la misma sesión y la Pizarra está viva; se repinta al redibujar la
  vista previa, al recibir el aviso y en el reloj de la clase (si la Pizarra se cierra, el marco se va).
- **Prueba (servidor local, sin guardar):** 3 diapositivas; "ir a la 3" → marco en la 3; "◀" → marco en la 2.
- **Cerrada; pendiente probar en clase.**

### AZ. Terminar clase cierra la Pizarra · título en "Silencio y atención"
*Origen: PO (2026-10-12), tras probar AX en uso ("ahora funciona"): "'Terminar clase' tiene que cerrar la ventana de la
Pizarra; además, la diapo de Silencio y atención que diga arriba de todo, y del ancho de la imagen, SILENCIO Y ATENCIÓN".*
- **Implementación (alcance pedido explícitamente):**
  - `PORTAL/index.html` (`confirmarFinClase`): al terminar, quita la recurrente y ordena a la Pizarra de esa sesión
    `{ accion: 'cerrar' }` (`Proyeccion.ordenar`); si se termina para pasar a otra clase, no se cierra (la ventana se
    reutiliza para la nueva). `PIZARRA/index.html` (`ordenDelPlanificador`): `cerrar` → `window.close()` (funciona porque
    la abrió el Planificador).
  - `comun/recurrentes.js`: bloque título + imagen 4:3 que cabe entero en la pantalla; título en mayúsculas (del catálogo
    `DIAPOS`), blanco sobre negro, del ancho de la imagen (letra en % del ancho del bloque).
- **Prueba (servidor local):** 1280×720 y 1024×768: título y imagen del mismo ancho (818 / 873 px), letras ~93 % del
  ancho, todo dentro de la pantalla. Orden "cerrar" a otra sesión: ignorada; a la propia: la Pizarra se cierra (no se
  pudo abrir una ventana emergente real en el panel de pruebas).
- **Ajuste del PO (2026-10-12):** toda la diapositiva con fondo blanco y el título en negro. Prueba: fondo blanco, texto
  negro.
- **Cerrada; pendiente probar en clase.**

### BA. Cursos — bitácoras de cada curso como páginas (estilo Notion)
*Origen: PO (2026-10-12): "una página en la que pueda seleccionar los contextos e ir viendo sus bitácoras… que las
bitácoras de los cursos funcionen como páginas de Notion".*
- **Auditoría:** hoy la bitácora es 1 texto por clase (`memorias.contenido` + `audios`, 1:1 con `sesiones`); la escriben
  el Planificador (modal ✍🏼, autoguardado) y el celular (`MEMORIA/`). No existe lugar para notas del curso fuera de una
  clase. El contexto `GENERAL` (virtual) ya existe en `contextos`.
- **DECISIÓN del PO:** página nueva **"Cursos"** (PC y celular; **primero escritorio**). Por curso: **página del curso**
  (notas generales), **subpáginas** de un solo nivel y **clases por fecha** (= las bitácoras existentes, título
  automático). Página **General** para notas de los consejos de profesores. Editor por bloques como Notion: **＋** (clic =
  bloque abajo, Alt + clic = arriba), **⋮⋮** (arrastrar = mover; clic = menú sencillo: Convertir en, Duplicar,
  Eliminar); títulos, viñetas, listas numeradas, casillas, imágenes, enlaces a la Biblioteca; **audio en cualquier
  página**. En dos pasos: **(1)** página + editor por bloques; **(2)** imágenes, audio y enlaces a la Biblioteca.
- **Diseño técnico:** el contenido se guarda como **texto con marcas simples** (`# `, `- `, `1. `, `- [ ] `), una línea por
  bloque: el Planificador y el celular siguen leyendo/escribiendo `memorias.contenido` igual. Páginas de curso y
  subpáginas en tabla nueva **`bitacora_paginas`** (`supabase/bitacora_paginas.sql`, la ejecuta el PO).
- **Implementación paso 1 (2026-10-12):** `CURSOS/index.html` (pestaña "📓 Cursos" del Workspace, guarda al cerrar).
  Panel lateral: General arriba y luego cursos, talleres, Recreo y jefaturas; al desplegar uno, sus subpáginas,
  "＋ Agregar página" y "🗓 Clases" (sesiones hasta hoy, punto azul = con bitácora). Página: título (fijo en curso/clase,
  editable en subpáginas), audios existentes de la clase (solo escuchar) y editor por bloques: ＋ (abajo / Alt arriba,
  abre "Bloques básicos"), ⋮⋮ (arrastrar con línea guía; clic = menú Convertir en ▸ / Duplicar Ctrl+D / Eliminar Supr,
  con última edición y palabras), "/" en un bloque vacío, atajos `#`/`##`/`###`/`-`/`1.`/`[]`, Enter/Retroceso/Supr/
  flechas entre bloques, pegar varias líneas = varios bloques. Guardado automático (0,8 s; al cambiar de página, al ocultar
  y al cerrar la pestaña). Menú ⋯ de la página: eliminar subpágina (con confirmación). `?ctx=<NOMBRE>` abre ese curso.
- **Prueba (servidor local, sin escribir datos reales: guardado reemplazado en la prueba):** Séptimo carga 22 clases; la
  bitácora del 8 oct se ve completa; en una clase vacía, los atajos y Enter dan título, viñetas, casilla y lista numerada
  y el texto guardado queda `# … / - … / - [ ] … / 1. … 2. …`; ＋, Alt + ＋, menú de tipos con teclado, ⋮⋮ → Duplicar,
  Convertir en Casilla, Eliminar; arrastre con línea guía; Retroceso convierte a texto y une. Sin la tabla nueva, la página
  avisa "Falta crear la tabla…".
- **Tabla creada por el PO (2026-10-12)** (prueba: crear y borrar una subpágina, ok). **Pendiente:** probar página del curso, General y subpáginas con la
  tabla real; paso 2 (imágenes, audio, enlaces a la Biblioteca) y celular.
- **Ajuste del PO (2026-10-12): "un solo histórico".** Sin colapsables ni página fija del curso. **3 columnas:** cursos |
  entradas del curso (clases + notas, por mes, lo más nuevo arriba) | **una sola página con todo el histórico** (cada
  clase y cada nota es un título con su editor). Al recorrer la página se marca la entrada; al tocarla, la página salta
  ahí. **Todas las clases hasta hoy** (las vacías en gris, se puede escribir en ellas). **Notas** = `bitacora_paginas`
  con **fecha editable** (por defecto hoy; el mismo día van sobre la clase); "＋ Nota" en la 2ª columna; ⋯ = eliminar.
  Columna nueva `bitacora_paginas.fecha` (`supabase/bitacora_paginas_fecha.sql`, la ejecuta el PO; mientras no esté, la
  fecha sale del día de creación y cambiarla avisa). Las filas `tipo='curso'` que existan se muestran como notas.
- **Prueba (servidor local, sin escribir bitácoras reales):** Tercero: 23 clases en orden, meses en la 2ª columna, clic en
  "Lun 31 ago" salta y la marca; al bajar se marca la entrada de arriba. General: "＋ Nota" crea la nota arriba con el
  cursor en su título (nota de prueba borrada). Las 3 notas vacías de General y 1 página vacía de otro curso son de la
  prueba del PO (no borradas).
- **PO ejecutó `bitacora_paginas_fecha.sql` (2026-10-12).** Nuevos pedidos del PO, mismo día:
  - **Separador** `---` (escribirlo en un bloque vacío, o "Separador" en el menú); se guarda como la línea `---`.
  - **General sin clases:** el PO pidió borrar sus 6 "clases" (11–18 may); **no se borraron** porque tienen **39 pendientes**
    asociados: Cursos oculta las sesiones de General (solo notas), los datos quedan intactos.
  - **Barra de formato al seleccionar texto:** negrita, cursiva, subrayado, color 1 (normal), color 2 (naranjo `#ea580c`) y
    color 3 (azul `#2563eb`); también Ctrl+B/I/U. Se guarda en el mismo texto: `**negrita**`, `*cursiva*`, `__subrayado__`,
    `{2:…}`, `{3:…}`; "\" solo cuando hace falta, para no alterar enlaces ni textos antiguos (prueba: las 158 bitácoras
    existentes quedan idénticas al abrir y volver a guardar). Las viñetas conservan su signo (`-`, `*`, `•`).
  - **Selección de bloques como Notion:** arrastrar desde fuera del texto dibuja un marco y selecciona los bloques que toca;
    arrastrar desde un texto hacia otro bloque selecciona bloques completos; Esc en un bloque lo selecciona. Con bloques
    seleccionados: Supr/Retroceso elimina, Ctrl+D duplica, Ctrl+C/Ctrl+X copia/corta como texto, Enter vuelve a escribir,
    Esc suelta; ⋮⋮ arrastra el grupo y su menú (Convertir en / Duplicar / Eliminar) actúa sobre todos.
  - **Prueba (servidor local, sin guardar datos reales):** formato y su texto guardado, Enter en medio de una palabra con
    formato (lo cortado conserva negrita y color), separador y Retroceso que lo quita, marco de selección (3 bloques),
    texto→otro bloque (3 bloques), Supr sobre la selección, arrastre de grupo, menú "3 bloques".
- **Ajustes del PO (2026-10-12):** título de las notas del mismo tamaño que el de las clases; **"🎨 Color"** en el menú ⋮⋮
  (de un bloque o de los seleccionados): Color 1 (normal) / 2 (naranjo) / 3 (azul) para todo el bloque, reemplazando los
  colores que tuviera adentro (negrita/cursiva se conservan). Prueba: `hola **mundo** {3:azul}` → color 2 =
  `{2:hola **mundo** azul}`; color 1 sobre la selección quita los colores.
- **Pedido del PO (2026-10-12): "la Bitácora del Planificador tiene que verse y sentirse igual que Cursos", en blanco.**
  El editor salió de Cursos a una **pieza compartida `comun/editor-bloques.js` + `comun/editor-bloques.css`**
  (`EditorBloques.crear(caja, { texto, alCambiar, vacio, alSubir, actualizado })`, `.zona(el)` para el marco de selección,
  `.html(texto)` solo lectura, `.menu(...)`; clases e ids con prefijo `eb-` para no chocar con cada página). Cursos la usa
  (un editor por entrada). Planificador (`PORTAL/index.html`): la ventana ✍🏼 Bitácora (más ancha, blanca) cambia el cuadro
  de texto por el editor (audios y "Pendientes para la próxima clase" igual; guardado automático 1,2 s como antes); el
  panel "Clase anterior" muestra la bitácora con su formato, solo lectura. Ajustes: Ctrl+Z y "?" (ayuda) no interfieren
  con el editor; Esc en el editor selecciona el bloque (no cierra nada).
- **Prueba (servidor local, sin guardar bitácoras reales):** Cursos igual que antes (22 bitácoras de Séptimo intactas,
  atajos, separador). Planificador, Séptimo 16 jul: el editor abre con el cursor listo; título, casilla, texto con "?"
  (no abre la ayuda); Esc selecciona el bloque y la ventana sigue abierta; el texto a guardar sale con el formato
  esperado; "Clase anterior" (9 jul) se ve en bloques. Efecto lateral de la prueba deshecho: abrir el Plan creó la
  diapositiva inicial automática de esa clase pasada; se borró.
- **DEUDA A FUTURO (PO, 2026-10-12):** controlar el aspecto de **toda la app con un solo interruptor central de tema
  claro/oscuro**. No implementado.
- **Ajuste del PO (2026-10-13):** el ícono de Cursos pasa de 📓 a 🎓 (pestaña del Workspace y la página).

### BB. Pendientes — una sola lista en todo el sistema (paso 1)
*Origen: PO (2026-10-12), tras el informe de pendientes; tarjeta Notion "Pendientes: Dashboard ↔ sesiones de clase
(agrupa 6 tarjetas)" (centro de F6B: se adelanta una parte, como permite el período paralelo).*
- **Auditoría (informe al PO):** 3 lugares con comportamientos distintos: Dashboard (solo marcar; al marcar desaparece; sin
  agregar ni editar; no dice para qué clase), Planificador "Pendientes de esta clase" y Bitácora "Pendientes para la
  próxima clase" (agregar/editar/marcar tachado/borrar). Sin actualización al instante entre ellos. Traspaso semanal del
  jueves 18:00 funcionando (3 cierres: 33, 43, 34 movidos). 41 activos (17 con 3 semanas), 54 completados; 216 antiguos
  SRP/ADMIN cerrados.
- **Limpieza pedida por el PO:** borrados los 39 pendientes antiguos (todos completados) de las 6 sesiones de General.
  Las 6 sesiones **no** se borraron: tienen 7 registros de `sesiones_srp` (SRP congelado, datos a conservar).
- **DECISIÓN del PO (paso 1):** misma lista en todos lados; completados en gris y cursiva, abajo en "Completados";
  agregar y editar desde el Dashboard; actualización al instante. Paso 2 (después, a diseñar): lista "HOY", qué hacer con
  los que se arrastran semanas, pendientes en Cursos, nombres "de esta clase" / "para la próxima".
- **Implementación paso 1 (2026-10-12):** pieza compartida **`comun/pendientes.js` + `comun/pendientes.css`**
  (`Pendientes.conectar/cargar/lista/guardarTodo`): un solo almacén en memoria y listas que lo filtran; activos arriba,
  "Completados · n" abajo en gris y cursiva (se puede plegar); agregar, editar (se guarda solo), marcar/desmarcar,
  borrar; "(n sem)" y, si se pide, la clase a la que va. **Al instante:** entre pestañas/ventanas del mismo computador
  (BroadcastChannel `profe-pendientes`) y entre equipos con Supabase Realtime (`supabase/pendientes_realtime.sql`, lo
  ejecuta el PO). Planificador (`PORTAL/index.html`): **Dashboard** = un grupo por curso con ＋ en el encabezado (va a la
  próxima clase del curso, hoy incluida; si no existe se crea según el horario; General sin clase), cada pendiente dice
  su clase ("lun 12/10"), completados de clases desde el lunes de la semana pasada (plegados); **Pendientes de esta
  clase** y **Bitácora → Pendientes para la próxima clase** usan la misma lista. Se retiró el código anterior de las tres
  listas (sin respaldo, regla §4.10).
- **Prueba (servidor local, datos reales con pendientes de prueba borrados al final):** Dashboard 15 grupos, 41 activos,
  11 completados recientes; ＋ en Primero → nuevo pendiente a "mié 14/10" con el cursor listo; escribir lo guarda;
  marcar lo pasa a Completados (gris) y a Supabase. Con el Plan de Primero 14/10 abierto en otra pestaña: aparece en sus
  Completados; desmarcarlo allí lo devuelve a activos también en el Dashboard; editarlo allí cambia el texto en el
  Dashboard; borrarlo desde el Dashboard lo quita del Plan y de Supabase. Bitácora: "→ mié 21/10", lista vacía con su
  ＋. Error encontrado y corregido: si el mismo pendiente estaba en dos listas de la página (Dashboard oculto + Plan),
  lo escrito no se guardaba.
- **PO ejecutó `pendientes_realtime.sql` (2026-10-12).** Prueba: un pendiente creado y borrado desde otra conexión (simula otro equipo) aparece y desaparece solo en el Dashboard. **Pendiente:** probar en uso; paso 2.

### BC. Pendientes — paso 2 (HOY, arrastrados, completados viejos, nombres, Cursos, sublistas, Bitácora → pendiente)
*Origen: PO (2026-10-12), tarjeta Notion "Pendientes: Dashboard ↔ sesiones de clase" (paso 2 de BB + anotaciones del PO).*
- **DECISIÓN del PO (2026-10-12):**
  1. **HOY:** ☀ en cada pendiente lo suma a una lista "HOY" arriba del Dashboard (todos los cursos, dice el curso).
     **Cada día la lista parte vacía.**
  2. **Arrastrados:** desde 3 semanas se ven en naranjo con "Sigue" (el contador vuelve a cero) y "Archivar" (sale de
     la lista sin borrarse, estado `descartado`). Nunca se archivan solos.
  3. **Completados:** dejan de verse 2 semanas después de completados (no se borran).
  4. **Nombres:** "Pendientes" en todos lados, con la clase al lado (Bitácora: "Pendientes → mié 21/10").
  5. **Cursos:** arriba de cada curso sus pendientes activos; cada clase del histórico muestra los suyos.
  6. **Sublistas:** un nivel, plegables.
  7. **Bitácora → pendiente:** clic derecho o menú ⋮⋮ de un bloque (Bitácora del Planificador y Cursos) → "Convertir en
     pendiente": se copia (el texto queda en la bitácora) a la próxima clase del curso.
  8. Apoderados: paso 3 aparte (no en este desarrollo).
- **Supabase (`supabase/pendientes_paso2.sql`, lo ejecuta el PO):** columnas `hoy DATE`, `completado_en TIMESTAMPTZ`
  (se rellena con la fecha de la clase en los ya completados), `padre_id UUID` (borrar el padre borra sus
  subpendientes); el traslado del jueves mueve solo los pendientes principales y sus subpendientes van con ellos.
- **Implementación (2026-10-12):** `comun/pendientes.js` + `.css`: ☀ por pendiente (columna `hoy` = fecha; la lista HOY
  filtra por la fecha de hoy, así cada día parte vacía; ＋ de HOY crea uno General marcado hoy); subpendientes de un
  nivel (↳, Tab / Shift+Tab, Enter en un subpendiente crea el siguiente; ▸/▾ plegar, recordado en el equipo; plegado
  muestra "hechos/total"; borrar el padre pregunta y se lleva los hijos); desde 3 semanas fila naranja con "Sigue" /
  "Archivar"; completados con `completado_en`, ocultos a los 14 días (salvo el historial de cada clase en Cursos);
  `Pendientes.proximaClase(curso)` (reemplaza la búsqueda del Dashboard). Planificador: grupo ☀ HOY arriba del
  Dashboard (dice el curso), títulos "Pendientes" en el Plan y la Bitácora (con "→ fecha"). `comun/editor-bloques.js`:
  opción `alPendiente` → "Convertir en pendiente(s)" en el menú ⋮⋮ y con clic derecho (Bitácora del Planificador →
  próxima clase; Cursos → próxima clase del curso, General sin clase). Cursos: cuadro "Pendientes" bajo el título y
  "Pendientes de esta clase" en cada clase (solo si tiene).
- **PO ejecutó `pendientes_paso2.sql` (2026-10-12).** Prueba (servidor local, datos reales; pendientes de prueba
  borrados al final): pendiente en Primero → ☀ aparece en HOY con "Primero"; 2 subpendientes (↳ y Enter) guardados con
  su padre; Shift+Tab lo suelta y Tab lo vuelve a meter; marcar un subpendiente guarda `completado_en`; con 3 semanas se
  ve naranjo con Sigue/Archivar y "Sigue" lo limpia; Cursos muestra el cuadro y los pendientes de cada clase; clic
  derecho en un bloque de la clase → "Convertir en pendiente" lo crea en la próxima clase y el texto queda; borrar el
  padre borró sus hijos en Supabase. **Pendiente:** probar en uso; paso 3 (Apoderados).
- **Ajuste del PO (2026-10-12):** en Cursos los completados parten plegados. En el Dashboard, Pendientes tiene **dos
  vistas** con selector: **☀ Hoy** (lista grande y limpia: texto grande, curso como etiqueta, sin "(n sem)" ni
  Sigue/Archivar; ＋ agrega uno general a Hoy; el selector muestra cuántos hay) y **Todos** (por curso, como antes;
  el grupo HOY de arriba se retiró). Al abrir: Hoy si ya tiene pendientes (pueden venir del celular), si no Todos.
  Probado en servidor local (abre en Hoy con 2 de prueba, en Todos sin ellos; borrados al final).
- **Ajuste del PO (2026-10-12):** Hoy con letra normal y sin margen a la izquierda (la flecha de plegar queda en el
  borde); espacio fijo para la barra de desplazamiento (Dashboard y Cursos) para que nada baile; subpendientes con
  sangría clara en todas las listas (su casilla bajo el texto del pendiente principal). Medido en servidor local.
- **DECISIÓN del PO (2026-10-12) — sugerencias en Hoy:** lo marcado ☀ un día anterior y no hecho aparece arriba de la
  vista Hoy, en un recuadro "De días anteriores · ¿siguen para hoy?", con **Aceptar** (queda para hoy) o **Rechazar**
  (sale de Hoy; sigue como pendiente de su curso). Opción `sugerencias` de `Pendientes.lista`. El Dashboard abre en Hoy
  también si hay sugerencias. Probado en servidor local (2 de prueba marcados "ayer": uno aceptado → en Hoy; otro
  rechazado → solo en su curso; borrados al final).
- **Ajuste del PO (2026-10-13): ¿para qué clase es el pendiente que nace de un texto?** En Cursos iba a "la próxima
  clase desde hoy": al revisar la clase de hoy (Recreo, mar 13/10), sus pendientes quedaban en esa misma clase.
  **DECISIÓN del PO:** de la bitácora de una clase X → la clase **siguiente a X**; si esa ya pasó, la próxima que **aún
  no ocurre** (la de hoy no cuenta si ya se dio —quedó su registro de tiempos— o está en curso); de una **nota** → la
  primera clase **desde la fecha de la nota** que aún no ocurre; General → sin clase. Al crearlo se avisa
  "Pendiente para la clase del mar 20/10". Igual en Cursos y en la ✍🏼 del Planificador. `Pendientes.proximaClase(cid,
  { despuesDe | desde })`. Los dos pendientes de Recreo ("ejercicio: …") se movieron al mar 20/10 (autorizado por el PO).
  Prueba: Recreo, desde la clase del 13 → 20/10; desde la del 06 → 13/10 (hoy, porque no quedó registro de que ya se dio).

### BD. Celular — inicio según haya clase en curso; pendientes en el celular
*Origen: PO (2026-10-12): iterar la app del celular; distinguir con / sin clase en curso; sin clase, ver y gestionar
los pendientes como en el Dashboard.*
- **DECISIÓN del PO (2026-10-12):**
  - **Sin clase en curso:** el inicio muestra la fecha, ✍🏼 Bitácora y los **pendientes** con ☀ Hoy / Todos (Hoy igual
    que el Dashboard, con sugerencias Aceptar / Rechazar; Todos = cursos plegables con su número y ＋). Tocar la casilla
    = hecho; tocar el texto = editar. **Deslizar a la derecha** = poner/sacar de ☀ Hoy; **a la izquierda** = borrar,
    con aviso "Borrado · Deshacer". **Subpendiente:** mantener presionado y arrastrar un pendiente sobre otro (queda
    bajo él); arrastrarlo a un espacio vacío lo vuelve principal (a probar si es cómodo). **Sin señal:** se ve la
    última lista y lo que se marque, agregue o borre se sube al volver la señal.
  - **Con clase en curso:** el inicio muestra qué curso está en clase, ✍🏼 Bitácora y 📝 Evaluar si hay evaluaciones
    por toques abiertas de ese curso (los pendientes no se muestran en clase, por ahora).
- **Implementación (2026-10-12):** `MOVIL/index.html` rehecho sobre la misma entrada: decide con `ClaseVivo.enCurso()`
  (y vuelve a decidir al cambiar). En clase: tarjeta "En clase · curso", ✍🏼 Bitácora y 📝 Evaluar (solo si el curso
  tiene evaluaciones por toques abiertas; usa la misma copia que Evaluar para verlo sin señal). Sin clase: Bitácora +
  pendientes (☀ Hoy con sugerencias / Todos con cursos plegables, abiertos recordados en el celular). Gestos propios de
  la página (deslizar, mantener 0,45 s y arrastrar; aviso con Deshacer). `comun/pendientes.js`: modo
  `conectar(sb, { sinSenal: true })` = cola en el equipo (`profe_pend_cola`, ids creados en el celular, upsert) + copia
  de la última lista (`profe_pend_copia`); un pendiente creado sin señal en un curso toma su próxima clase al subir;
  opción `tactil` (el texto se edita al tocarlo); nuevas `cambiar`, `borrar` (devuelve lo borrado), `restaurar`,
  `get`, `restaurarCopia`, `enCola`, `alCola`. `sw-movil.js` v2 suma `comun/pendientes.js/.css`.
- **Prueba (servidor local, tamaño celular, datos reales; pendientes de prueba borrados al final):** ＋ en Tercero crea
  en su próxima clase; deslizar → lo pone en Hoy; ← lo borra y "Deshacer" lo devuelve (mismo id, en la base);
  mantener + arrastrar B sobre A → subpendiente con sangría; arrastrarlo al título → vuelve a principal; sin señal
  (simulada): marcar uno y crear otro dejan "⏳ 2 sin subir" y al volver la señal suben solos (el creado tomó la
  próxima clase de Tercero); clase en curso simulada solo en el navegador → "En clase · Cuarto" + Bitácora, sin
  Evaluar (Cuarto no tiene evaluaciones por toques). Dashboard del PC sin cambios. **Falta:** probar en el celular
  real (gestos con el dedo, instalada).
- **Ajuste del PO (2026-10-12):** en las listas por curso (Todos, PC y celular) lo que está en Hoy lleva la etiqueta
  "☀ Hoy" (opción `sinMarcaHoy` para la propia lista Hoy). **Tiempo real en el celular verificado:** un pendiente
  creado, marcado para hoy y borrado desde otra conexión (otro equipo) aparece, gana la etiqueta, pasa a Hoy y
  desaparece solo. Hoy solo pendientes y clase en curso tienen tiempo real en todo el sistema (PEDIDO del PO: tiempo
  real en toda la app → auditoría aparte, ver BE).
- **DECISIÓN del PO (2026-10-12) — nombre mínimo del curso:** solo su ícono (2️⃣, 💼 General, 🎸 Cuerdas…), con el
  nombre completo al pasar el mouse. Regla única `ctxMinimo(nombre)` en `supabase/contextos.js`. Por ahora en las listas
  Hoy (y sus sugerencias) del Dashboard y del celular. **Arreglo:** el celular podía mezclar piezas nuevas con viejas
  (copias del navegador de hasta 10 min) → `sw-movil.js` v3 pregunta siempre al servidor (`cache: 'no-cache'`) y la
  página tolera un `contextos.js` viejo. Probablemente por eso la etiqueta "☀ Hoy" aún no se veía en el celular.
- **Ajuste (2026-10-13, pedido del PO con captura): subpendientes en el celular.** En ☀ Hoy, los pendientes con
  subpendientes quedaban corridos a la derecha por su flecha y los subpendientes no quedaban bajo el texto. Ahora la
  flecha va al margen (todas las casillas alineadas) y la casilla del subpendiente queda justo bajo el texto del
  pendiente, en Hoy y en Todos (`MOVIL/index.html`, solo estilos).

### BE. Tiempo real en toda la app — DEUDA (anotada, sin diseñar)
*Origen: PO (2026-10-12): "todo debería ser con actualización en tiempo real, en general en toda la app y
específicamente en el celular".*
- **HECHO hoy:** solo **pendientes** (`comun/pendientes.js`) y **clase en curso** (`comun/clase-vivo.js`) se
  actualizan al instante entre equipos (Supabase Realtime). Bitácora, toques de Evaluar, Libro (participación, notas,
  asistencia), Biblioteca, Plan, etc. se ven al día solo al abrir o recargar.
- **Próximo paso propuesto:** auditoría módulo por módulo (qué se vería al instante, prioridades; recomendación de
  partida: Bitácora y Asistencia) y un SQL corto por tabla que ejecuta el PO. No implementar sin aprobación.
- **Auditoría (2026-10-13):** al instante entre equipos hoy: pendientes, citas a apoderados y clase en curso. Lo demás
  (bitácora y notas, Libro, Plan, Biblioteca, Materiales, Dashboard) se pone al día solo al abrir o recargar; y el
  celular corta la conexión al apagar la pantalla o cambiar de app.
- **DECISIÓN del PO (2026-10-13):** (1) **base común + Fase 1 (Bitácora y notas)** ahora: Cursos del PC y del
  celular, ✍🏼 del Planificador y "Clase anterior" del Plan; además, cada página se pone al día sola **al volver a
  ella**. Fase 2 (Libro: toques, asistencia, marcas) y Fase 3 (Plan, Dashboard, Biblioteca, Materiales) después de
  probarla. (2) Regla: nunca se pisa lo que se está escribiendo (lo de otro equipo se aplica al dejar de escribir); si
  los dos editaron lo mismo, **queda lo último guardado + aviso** "cambió en otro equipo".
- **Implementación Fase 1 (2026-10-13):** pieza común `comun/tiempo-real.js` (`TiempoReal`: escuchar una tabla,
  "al volver" —pantalla visible de nuevo, página traída de vuelta o señal recuperada—, aviso breve abajo, y comparar
  fechas-hora para reconocer los guardados propios). Conectada en **Cursos del PC**, **Cursos del celular** y el
  **Planificador** (ventana ✍🏼 y "Clase anterior"). Tablas `memorias` y `bitacora_paginas` sumadas a Realtime
  (`supabase/bitacora_realtime.sql`, lo ejecutó el PO). Una entrada que se está escribiendo no se toca (se aplica al
  dejar de escribir); con cambios sin guardar aquí, queda lo de aquí y aparece "cambió en otro equipo mientras
  escribías: quedó tu versión". Notas nuevas, borradas o con fecha cambiada rearman el curso sin moverse de lugar.
  `sw-movil.js` v5 suma la pieza.
- **Prueba (servidor local; notas de prueba creadas y borradas "desde otro equipo"):** con el SQL ejecutado, un cambio
  de nota hecho afuera apareció solo en Cursos del PC ("LLEGO SOLO") y en el celular ("LLEGO AL CELULAR"); una nota
  nueva apareció sola y al borrarlas desaparecieron solas. Reglas probadas: sin escribir se aplica al tiro; escribiendo
  espera y se aplica al dejar de escribir; con cambios sin guardar queda lo de aquí + aviso. Planificador carga sin
  errores. **Siguiente:** que el PO lo pruebe en uso (PC + celular a la vez); luego Fase 2 (Libro).
- **Fase 2 — Libro (aprobada por el PO, 2026-10-13, "dale con la fase 2"):** al instante entre equipos: los toques de
  Evaluar (celular) y las notas en el detalle de la evaluación del Libro (Resultados incluido); Pasar lista (el Libro y
  Evaluar del celular toman los ausentes al tiro); las marcas de participación y de entregas. Misma regla (no se pisa lo
  que se está escribiendo; lo pendiente de subir manda). Tablas `libro_evaluacion_notas`, `libro_asistencia`,
  `libro_participacion_detalle`, `libro_entrega_detalle` a Realtime (`supabase/libro_realtime.sql`, lo ejecuta el PO).
- **Implementación Fase 2 (2026-10-13):** `LIBRO/index.html` escucha `libro_evaluacion_notas` (evaluación abierta:
  notas y toques, Resultados incluido), `libro_asistencia` (la lista de la clase con que se abrió el Libro),
  `libro_participacion_detalle` y `libro_entrega_detalle` (la actividad abierta; lo pendiente de subir de este equipo
  manda) y repinta junto, nunca mientras se escribe; al volver a la pantalla se pone al día. `MOVIL/evaluar.html`
  escucha la lista de la clase y las notas de la evaluación abierta (lo de este celular sin subir manda; no repinta en
  medio de un toque). `sw-movil.js` v6. PO ejecutó `libro_realtime.sql`.
- **Prueba (servidor local, datos reales cambiados "desde otro equipo" y devueltos a su valor exacto):** Libro de
  Quinto, participación "HUI": marcar a Renata apareció sola como participó y al devolverla, sola sin marcar; Libro de
  Segundo, evaluación por toques "prueba": 3 toques a Josefina aparecieron solos en Resultados ("Corresponde 6,7") y
  volvieron a 0; Pasar lista de esa clase: quitar una ausente se reflejó al tiro (6 → 5) y al reponer la lista original
  volvió a 6. Entregas y Evaluar del celular: mismo mecanismo, sin prueba en vivo (falta clase en curso / entrega
  abierta); quedan para la prueba en uso.
- **Fase 3 (aprobada por el PO, 2026-10-13, "dale con la fase 3"):** **Plan**: el texto de las diapositivas
  (`presentaciones`) al instante en el Planificador de otro equipo y en una Pizarra abierta en otro equipo; los
  **Materiales** del curso (`materiales_contexto`). **Biblioteca**: canciones, recursos, ⭐ Personal y sesiones del
  Entrenador (`repertorio_canciones`, `repertorio_assets`, `repertorio_cancion_contextos`,
  `repertorio_sesiones_entrenamiento`), sin tocar el Entrenador ni una ficha abiertos (se aplica al cerrarlos).
  **Dashboard**: su calendario sale del horario (no cambia en el día a día) y sus pendientes y citas ya eran al
  instante; solo se pone al día al volver a la pantalla. SQL `supabase/fase3_realtime.sql` (lo ejecuta el PO).
- **Implementación Fase 3 (2026-10-13):** Planificador: texto de las diapositivas al instante (no se pisa lo que
  se escribe; con cambios sin guardar queda lo de aquí + aviso) y Materiales del curso (no se tocan con su ventana de
  edición abierta; también al borrarse); al volver, se pone al día y redibuja el calendario (marca de hoy). Pizarra:
  toma el texto nuevo de su clase sin moverse de la diapositiva (`textoAlDia`). Biblioteca: canciones, recursos,
  ⭐ Personal y sesiones del Entrenador se recargan solos (espera si hay Entrenador, ficha o ventana abierta, o si se
  escribe; no repinta si lo que llega es igual a lo que se ve). PO ejecutó `fase3_realtime.sql`.
- **Prueba (servidor local, datos reales cambiados "desde otro equipo" y devueltos):** Biblioteca: el artista de "El
  Corralero" cambió solo en pantalla y volvió; Pizarra de Primero (mié 14/10): una diapositiva agregada afuera apareció
  sola sin moverla de la que mostraba; Planificador de esa clase: al devolver el texto original afuera, el texto y la
  vista previa se ajustaron solos (2 → 1 diapositiva); Materiales de Primero: uno agregado afuera apareció solo y al
  borrarlo volvió a "Sin materiales." **Con esto la deuda BE queda cubierta en toda la app; falta la prueba en uso.**
- **Pedido del PO (2026-10-12) — curso al agregar en Hoy:** en Hoy (Dashboard y celular) "＋ Agregar pendiente" abre
  una fila de íconos de los cursos ("¿De qué curso?"); el pendiente va a la próxima clase de ese curso, marcado para
  hoy (General: sin clase). Tocar el ícono de curso de un pendiente de Hoy abre la misma fila ("Mover a:") y lo cambia
  de curso (con sus subpendientes). Opción `elegirCurso` de `Pendientes.lista`. Probado en servidor local (PC: crear en
  Quinto → mié 13/10, mover a Sexto; celular: crear en Segundo → jue 15/10; borrados al final).
- **Arreglo (2026-10-12, reportado por el PO en el celular):** mantener presionado abría la edición del texto en vez de
  arrastrar (el dedo caía sobre el cuadro de texto y el teléfono lo trataba como selección). Ahora, en listas táctiles,
  el texto sin editar no recibe el dedo (`.pd-tactil .pd-txt[readonly] { pointer-events: none }`): lo recibe la fila;
  toque corto = editar, mantener = arrastrar. Simulado en servidor local (el dedo cae en la fila; arrastre → subpendiente
  sin abrir edición; toque corto → edita). Falta confirmarlo en el celular real.

### BF. Bitácora del celular — cursos como botones, guardado automático, sin señal
*Origen: PO (2026-10-12): en la Bitácora del celular hay que elegir fecha y curso (mucho trabajo); ¿se guarda sola?
(No: había que apretar "GUARDAR BITÁCORA").*
- **DECISIÓN del PO (2026-10-12):** (1) al elegir la fecha, los cursos de ese día aparecen como botones (ícono +
  nombre); un toque abre su bitácora; si hay clase en curso, entra directo a ese curso. (2) Guardado automático
  mientras se escribe ("Guardando… / Guardado ✓"), sin botón Guardar. (3) Sin señal, lo escrito queda en el celular y
  se sube al volver la señal.
- **Implementación (2026-10-12):** `MEMORIA/index.html` rehecho: las fechas y los cursos salen del **horario** (copia en
  el celular, `profe_bitacora_horario`; ya no lun–jue fijo, regla F3.1); cursos del día = botones (el de la clase en
  curso dice "● en clase" y se abre solo al entrar); guardado automático 1,2 s después de escribir, al cambiar de
  curso/fecha y al salir; cola en el celular (`profe_bitacora_cola`) + copia de lo último visto (`profe_bitacora_copias`);
  lo que está en la cola manda sobre lo que trae internet. Misma tabla `memorias` (texto) que el Planificador y Cursos.
- **Prueba (servidor local, tamaño celular):** fechas = días con horario (hoy primero); hoy muestra Orientación, Tercero
  (● en clase: había una clase real en curso), Cuarto, Cuerdas, y entró sola a Tercero; escribir → "Sin guardar…" →
  "Guardado ✓" y quedó en la base; sin señal (simulada) en Cuarto → "⏳ sin señal · guardado en el celular" y al volver
  la señal se subió solo. Las dos bitácoras de prueba (Tercero y Cuarto de hoy, que estaban vacías) se borraron.
- **BUG causado por BD y corregido (2026-10-12, reportado por el PO):** la función nueva `ctxCorto` de
  `supabase/contextos.js` (71b484c) tenía el mismo nombre que una constante propia de la Biblioteca
  (`REPERTORIO/index.html`), y el choque detenía toda la Biblioteca/Entrenador (p. ej. "Sesión" desde el Plan se
  quedaba a medio camino). Renombrada a **`ctxMinimo`**. Verificado: `?practicar=<sesión de Tercero>` abre la sesión
  con sus canciones. **Lección:** antes de agregar un nombre global a una pieza compartida, buscarlo en todo el repo.

### BG. Biblioteca — ordenar los recursos de una canción; desplegable del Entrenador ordenado
*Origen: PO (2026-10-12), con "Figuras rítmicas en 6/8" (10 ritmos en desorden en el Entrenador).*
- **Pedido del PO:** ordenar los recursos arrastrándolos en la ficha de la Biblioteca y que el Entrenador los muestre en
  ese orden; el botón del desplegable del Entrenador debe ser fijo, con el título del recurso aparte, y el menú sin
  ítems de dos líneas.
- **Implementación (2026-10-12):** sin cambios en Supabase (la columna `repertorio_assets.orden` ya existía, todo en
  0). `ordenAssets()` (REPERTORIO): `orden` > 0 manda; los sin ordenar van después por tipo/instrumento/dificultad.
  Ficha: cada recurso (no tablaturas, que siguen agrupadas) se arrastra (⋮⋮); al soltar se guarda `orden` 1..n.
  Entrenador: botón fijo "📑 Recursos ▾", el recurso abierto al lado (una línea, con "…" si no cabe), menú con su
  propio ancho (hasta 560 px), cada recurso en una línea.
- **Prueba:** "Figuras rítmicas en 6/8" ordenada arrastrando según la numeración del PO (Negra con punto → … →
  Combinado 3), guardado en la base; el Entrenador la muestra en ese orden, todos los ítems de una línea.
- **Ampliación (2026-10-12, pedido del PO con "Iniciación del Taller de Cuerdas"):** las **tablaturas** también se
  ordenan arrastrando en la ficha (⋮⋮, dentro de su instrumento; se guardan con `orden` desde 1001 para quedar después
  de los demás recursos). El **Lector** las muestra en ese orden en sus cuatro listas (catálogo, panel de repertorio,
  asignación y alumno): `cmpTabOrden` = instrumento → orden manual → dificultad, y sus consultas traen `orden`. Se
  subió solo ese cambio del Lector (los cambios del Loop siguen aparte). Prueba: mover "La vaca Lola" al primer lugar →
  guardado y el panel del Lector la muestra primera; después se dejó esa canción como estaba (sin orden manual).

### BH. Biblioteca — barra en una sola línea
*Origen: PO (2026-10-13): rehacer la barra de la Biblioteca en una sola línea, sin el título "Biblioteca", con la
búsqueda más corta y los cursos con su nombre corto.*
- **Implementación:** en la vista Biblioteca la cabecera oscura se oculta y la barra de filtros lleva todo en una
  línea: búsqueda (más corta) · Todo / Canciones / Materiales · Todos + cursos con su **ícono** (nombre mínimo; nombre
  completo al pasar el mouse) · Practicar · estilos · orden · cuenta · Lecciones · + Canción. `ubicarControles()` mueve
  búsqueda, cuenta, Lecciones y + Canción a la barra en la Biblioteca y de vuelta a la cabecera en Entrenador y
  Lecciones (donde todo sigue como antes). Si la ventana es angosta, la barra se desplaza de lado (no se parte).
- **Prueba (1900 px):** una línea de 48 px sin desbordar; ir a Entrenador y a Lecciones y volver deja cada control en
  su lugar; sin errores.
- **Ajuste del PO (2026-10-13):** la cuenta de canciones va como texto del campo de búsqueda ("Buscar en 119
  canciones…"; se corrigió "canciónes" también en la lista de una sesión). Se quitó el botón **Lecciones**:
  **CONGELADO — futura evaluación: dar de baja o seguir desarrollando** (la función queda intacta; anotado en
  CLAUDE.md §5).
- **Ajuste del PO (2026-10-13):** Todo / Canciones / Materiales es **un solo botón** que va pasando con cada clic (azul
  cuando filtra); sin separador y selectores más angostos. Medido: con "Practicar" visible cabe en una línea a 1900 px
  (sobran ~500 px) y a 1400 px (justo).
- **Ajuste del PO (2026-10-13) — REGLA: ninguna interacción en una barra puede hacer bailar sus elementos.** Botón de
  categoría con ancho fijo; "Practicar" con su espacio siempre reservado (entre ⭐ y estilos; se oculta sin
  desaparecer); selectores, cursos y + Canción sin encoger. Medido: posición y ancho de todos los controles idénticos
  tras cambiar categoría (3 veces), elegir curso (aparece Practicar), Personal, Todos y un estilo.

### BI. Libros — sección central con el Libro de clases de cada instancia
*Origen: PO (2026-10-13): nueva sección central "Libros" para entrar al Libro de clases de cualquier instancia; pestaña
permanente del Workspace.*
- **DECISIÓN del PO (2026-10-13):** se ve **como Cursos** (columna con las instancias a la izquierda; el Libro de la
  elegida a la derecha, en la misma pestaña; recuerda la última). Instancias: **todas menos General** (1°–8°, talleres,
  Recreo, Orientación, Enlaces). Clase sobre la que se abre: **la de hoy; si no hay, la última que ocurrió**. El botón
  📒 Libro del Plan **lleva a la pestaña Libros** con ese curso y la clase del Plan (no abre más pestañas de Libro).
  Pestaña fija: Dashboard · Biblioteca · Cursos · **Libros**.
- **Implementación (2026-10-13):** `LIBROS/index.html` (estilo Cursos) carga las instancias (sin General) y el año
  activo (`libro_anios`); al elegir, busca la clase (hoy o la última; si nunca hubo, la próxima) y muestra
  `LIBRO/index.html?sesion=&ctx=&anio=` en un marco; recuerda la última instancia. Reenvía entre el Libro y el Workspace
  los mensajes de título de ventana (imprimir). Workspace: pestaña fija `libros`; `ws-abrir` con `ir` a una pestaña ya
  abierta le manda `ws-ir` sin recargarla. Planificador: el 📒 abre Libros con `ir: { ctx, sesion }`.
- **Prueba (servidor local):** 4 pestañas fijas (Dashboard · Biblioteca · Cursos · Libros); 14 instancias; Tercero →
  su Libro sobre la clase del lun 12/10; el 📒 del Plan (simulado desde una pestaña) llevó a Libros con Cuarto y su
  clase, sin abrir pestañas nuevas; Orientación abre con los alumnos de Octavo.
- **Ajuste del PO (2026-10-13):** en el Libro de los cursos, **Asistencia** pasa a ser un botón grande del panel, el
  primero (antes de + Evaluación); los siete caben en una fila. En los talleres (sin panel) sigue arriba. En Libros se
  quitó el detalle "clase del …" bajo el curso: la lista es siempre igual.

### BJ. Workspace — accesos directos al correo y al OneDrive institucional
*Origen: pedido del PO (2026-10-13): dos accesos directos en la barra del Workspace, a la derecha del todo, al correo
institucional y al drive institucional (cuenta Microsoft 365 / Outlook del SLEP).*
- **Decisión del PO:** dos botones al extremo derecho de la barra: ✉️ Correo (Outlook) y 📁 Drive (OneDrive), que abren
  una pestaña nueva del navegador. Los avisos de versión nueva y de clase en curso quedan a su izquierda (barra estable,
  regla 8b: los accesos nunca se mueven).
- **Implementación (2026-10-13):** `PC/workspace.html`: grupo `#ws-derecha` (margen automático) con el aviso de
  versión, el de clase en curso y los dos enlaces (`outlook.office.com/mail/`, `sleplosparquesgobcl-my.sharepoint.com/favorites`; ajustado por el PO). La
  dirección de correo **no** va en el enlace (el repo y la página son públicos): abren la cuenta Microsoft con sesión
  iniciada en el navegador.

### BK. Citas a apoderados (pendientes, paso 3)
*Origen: anotación del PO en la tarjeta Notion "Pendientes: Dashboard ↔ sesiones de clase" (paso 3): una lista especial
de recordatorios para apoderados — llamar para gestionar la reunión, anotar cuándo quedé de atenderlo y, al final,
acuerdos y acciones —, que se pueda crear desde el Dashboard, el Plan y Cursos.*
- **Auditoría (2026-10-13):** hoy no existe ningún dato de apoderados (ni nombre ni teléfono). Los estudiantes están en
  `libro_estudiantes`; su curso en `libro_matriculas` (año activo) o `libro_pertenencias_taller`; las jefaturas toman
  la población de su curso por `libro_contexto_poblacion`. Hace falta una tabla nueva.
- **DECISIÓN del PO (2026-10-13):**
  1. Tres etapas: **Por citar** (motivo) → **Citado** (fecha y hora; ese día aparece en ☀ Hoy) → **Atendido**
     (acuerdos). Si el apoderado no llega, vuelve a Por citar.
  2. La cita va ligada a un **estudiante elegido de la lista del curso** (permite ver su historial de citas).
  3. **No** se guarda el teléfono ni datos del apoderado.
  4. De los acuerdos **se pueden** generar pendientes del curso (botón), **no automático**.
  5. Se ven y se crean desde el Dashboard (todas), el Plan y Cursos (las del curso).
- **Supabase (`supabase/apoderado_citas.sql`, lo ejecuta el PO):** tabla `apoderado_citas` (contexto, estudiante,
  motivo, estado `por_citar|citado|atendido`, `cita_en`, acuerdos, `atendido_en`), RLS `acceso_total`, Realtime.
- **PO ejecutó `apoderado_citas.sql` (2026-10-13).**
- **Implementación (2026-10-13):** pieza compartida `comun/apoderados.js` (`Apoderados`) + `comun/apoderados.css`.
  Dashboard: pestaña **👪 Apoderados** (junto a ☀ Hoy / Todos, con la cuenta de citas abiertas) y cuadro "👪 Citas de
  hoy" arriba de la vista Hoy. Plan: sección **👪 APODERADOS** bajo Pendientes (citas del curso). Cursos: cuadro
  **👪 Apoderados** bajo Pendientes (no en General). Nueva cita: curso (íconos; cursos, talleres y jefaturas, estas con
  la lista de su curso) → buscar estudiante → motivo. Por citar: 📅 Citar (fecha y hora). Citado: cambiar fecha,
  "No vino" (vuelve a Por citar), "✓ Atendido"; si la fecha pasó sin atender, en rojo. Atendido: acuerdos y "Acción
  → Pendiente" (crea "Apoderado de <nombre>: <acción>" en la próxima clase del curso). Atendidas: plegadas, se ven 30
  días. Al instante entre pestañas y equipos.
- **Prueba (servidor local, datos de prueba borrados al final):** cita creada en Tercero desde el Dashboard → Citar
  hoy 11:00 (aparece en "Citas de hoy") → Atendido → acuerdos guardados → acción convertida en pendiente para la clase
  del 19/10; la cita se ve en Cursos (Tercero) y en el Plan de Tercero del 19/10 con su pendiente. Corregido: la lista
  no se repintaba si se agregaba con el cursor aún en el motivo.
- **Ajuste del PO (2026-10-13): citar o llamar.** En Por citar, dos acciones: **📅 Citar** (en persona) y **📞 Llamar**;
  ambas con fecha y hora, mismo camino. En llamadas, "No vino" se llama "No contestó". Columna `modalidad`
  (`cita|llamada`, `supabase/apoderado_citas_modalidad.sql`, lo ejecuta el PO).
  PO ejecutó el SQL (2026-10-13). Prueba en Cursos (Tercero, cita de prueba borrada): 📞 Llamar → "📞 mié 14/10 ·
  15:00" con "No contestó" → vuelve a Por citar → 📅 Citar → "No vino". La sección "Citados" pasa a "Agendados" y el
  cuadro del Dashboard a "Llamadas y citas de hoy".

### BL. Pizarra — la fecha arriba, para copiarla en el cuaderno
*Origen: pedido del PO (2026-10-13): los cursos pequeños tienen la costumbre de anotar la fecha en el cuaderno; mostrarla
en la Pizarra, en letra ligada y/o imprenta, activable desde el Planificador con la clase en curso.*
- **DECISIÓN del PO (2026-10-13):**
  1. Formatos: **Lunes 13/10/26** o **Lunes 13 - 10 - 26**.
  2. Letra: **ligada** (Playwrite CL, modelo de letra escolar chileno), **imprenta** (Andika, a y g de niño) o
     **ambas**, una bajo la otra (ligada arriba).
  3. En el extremo superior de la Pizarra, a la **izquierda o a la derecha**. **Le hace espacio** a la diapositiva
     (franja propia, nunca tapa texto).
  4. Se maneja desde el Planificador con la clase en curso y **se recuerda por curso** (la próxima clase del curso
     parte igual).
- **Implementación (2026-10-13):** fuentes guardadas en la app (`comun/fuentes/`, sin internet). Pieza compartida
  `comun/fecha-pizarra.js` (`FechaPizarra`): opciones por curso en el equipo (`localStorage`, como las recurrentes:
  Planificador y Pizarra van en el mismo computador). Planificador: botón 📅 en la barra (con la clase en curso) con
  mostrar/ocultar, formato, letra y lado. Pizarra: franja arriba con la fecha de la clase; la diapositiva se reajusta.
- **Prueba (servidor local):** Pizarra de Primero (mié 14/10): ambas letras a la izquierda ("Miércoles 14/10/26" ligada
  y bajo ella imprenta) y ligada a la derecha con guiones ("Miércoles 14 - 10 - 26"); la diapositiva se achica y no
  queda tapada. Menú 📅 del Planificador: mostrar/ocultar, formato con el ejemplo de la fecha de la clase, letra
  (muestra cada fuente), lado; elegir una opción la muestra y se recuerda para el curso. Letra agrandada para leerse
  desde el fondo de la sala (ligada 8,5 % del alto; con ambas, 7 % y 6,5 %).
- **Ajuste del PO (2026-10-13):** (1) las dos letras con **las mismas dimensiones, justo entremedio** (a igual tamaño
  la ligada salía bastante más grande): se mide el texto en ambas fuentes y cada una se escala al ancho promedio (con
  una sola letra, el mismo tamaño que tendría junto a la otra). (2) La fecha pasa a ser una **recurrente**: sin botón
  📅 propio; "📅 Fecha" va en el menú 🔔 (con Quitar), con formato, letra y lado debajo; el 🔔 queda encendido si la
  fecha está a la vista. Prueba: ambas a la derecha, 555 px de ancho cada línea (ligada 6,2 % y imprenta 7,5 % del alto).
- **Ajuste del PO (2026-10-13): menú limpio.** El menú 🔔 solo lista las recurrentes (🤫 Silencio y atención, 📅 Fecha
  — esta dice "Visible" cuando se ve —). "📅 Fecha ‹" abre **su propio menú** al lado, con un **interruptor
  Visible / Oculta** y debajo formato, letra y lado; cambiar opciones ya no la muestra sola (solo el interruptor).

### BM. Celular — la Bitácora pasa a ser Cursos (estilo Notion, versión celular)
*Origen: pedido del PO (2026-10-13): que la Bitácora del celular sea en realidad la página Cursos, con su estilo
Notion, en versión para el celular.*
- **Auditoría (2026-10-13):** la Bitácora del celular (`MEMORIA/index.html`, BF) es texto plano: día → curso → clase,
  guardado automático y funciona sin señal (cola + copia en el celular). Cursos (`CURSOS/index.html`, BA) usa el editor
  por bloques (`comun/editor-bloques.js`), que hoy no tiene soporte táctil (arrastrar y ⋮⋮ solo con mouse) y no
  funciona sin señal.
- **DECISIÓN del PO (2026-10-13):**
  1. Navegación **curso → su página**: íconos de cursos arriba; la página del curso muestra su histórico (clases +
     notas, la más reciente arriba). En clase, entra directo al curso en curso, en la clase de hoy.
  2. Editor: **escribir + formato por toque** (títulos, listas, casillas, colores) con barra de formato sobre el
     teclado; mover/convertir bloques con **toque largo → menú**; sin arrastrar.
  3. Extras: **＋ Nota** (notas del curso con fecha). Sin cuadros de pendientes ni apoderados en el celular.
  4. **Reemplaza** a la Bitácora actual (✍🏼 abre la nueva); la vieja se retira cuando el PO la valide en uso. Se
     mantiene el funcionamiento **sin señal**.
- **Implementación (2026-10-13):** `MOVIL/cursos.html` (página nueva del celular, estilo Notion claro): cursos como
  chips arriba (● verde = en clase); la página del curso con su histórico (clases hasta hoy + notas, lo más nuevo
  arriba; si el curso tiene clase hoy o está en clase, aparece su clase de hoy aunque aún no exista) y ＋ Nota (título,
  fecha, ⋯ Eliminar). En clase entra directo al curso en curso. **Sin señal:** todo cambio pasa por una cola en el
  celular (`profe_cel_cursos_cola`; notas nuevas con su id creado en el celular) y se sube al volver la señal; cada
  curso abierto queda copiado (`profe_cel_cursos_copia`); lo pendiente de la Bitácora anterior (`profe_bitacora_cola`)
  también se sube. `comun/editor-bloques.js` gana la opción **`tactil`**: sin ＋/⋮⋮, barra de formato sobre el teclado
  (Aa tipo · • · ☑ · B I U · 3 colores · ⋯ menú del bloque con Subir/Bajar), toque largo = menú del bloque, Enter y
  Borrar del teclado del celular (llegan como "beforeinput"), "/" abre los tipos. El PC no cambia. Los botones ✍🏼
  BITÁCORA del celular abren la página nueva; `sw-movil.js` (v4) la suma junto al editor. `MEMORIA/` queda sin
  enlaces hasta que el PO valide (después se retira).
- **Prueba (servidor local, tamaño celular; nota de prueba borrada):** Tercero con 23 entradas; ＋ Nota con título y
  texto → "Guardado ✓" en la base; sin señal simulada → "⏳ sin señal · guardado en el celular" (cola) y al volver la
  señal se subió; barra táctil sobre el teclado (cabe en 375 px), "•" convierte en viñetas, Enter del teclado del
  celular crea el siguiente ítem, ⋯ muestra Subir/Bajar/Duplicar/Eliminar; eliminar la nota la borra de la base. En el
  PC el editor sigue igual (＋/⋮⋮ visibles, Enter parte el bloque). Falta probar en el celular real (teclado, toque largo).
- **Ajuste del PO (2026-10-13): menú lateral.** En vez de la fila de cursos, un **menú lateral** estilo Notion (como la
  columna de cursos del Workspace) con todos los contextos **sin tener que desplazarse**, que se abre/cierra con ☰
  arriba; arriba del menú, **🏠 Inicio** (vuelve a la página principal del celular). Tocar un curso cierra el menú y
  abre su página; el encabezado muestra el curso abierto.
  Prueba: ☰ abre el menú con 🏠 Inicio, General y los 14 cursos/talleres/jefaturas; caben sin desplazarse en 375×812 y
  en 360×640 (cada fila ajusta su alto a la pantalla, entre 30 y 44 px); tocar Quinto cierra el menú y abre su página
  ("5️⃣ Quinto" en el encabezado). Sin curso elegido, el menú se abre solo.

### BN. Planificador — las notas de Cursos junto a la clase anterior
*Origen: pedido del PO (2026-10-14): las notas que se escriben en Cursos también deben verse en el Planificador, donde
se muestran las clases anteriores.*
- **Auditoría (2026-10-14):** el panel izquierdo del Plan (`pintarRegistro`, `PORTAL/index.html`) muestra de la clase
  anterior (y de las anteriores con ← →) su bitácora (`memorias`), datos de la clase, Revisión, Repertorio, Plan y
  Materiales. Las notas de Cursos viven en `bitacora_paginas` (`contexto_id`, `fecha`, `titulo`, `contenido`) y hoy
  solo se ven en Cursos. Sin cambios en Supabase (la tabla ya está en tiempo real, BE).
- **DECISIÓN del PO (2026-10-14):**
  1. Se ven las notas **del tramo**: fecha desde esa clase (incluida) hasta la clase siguiente (excluida); en la clase
     anterior inmediata, hasta la clase que se planifica (incluida).
  2. Solo las del curso (**no** las de General).
  3. **Solo lectura**; un clic abre la nota en Cursos.
  4. **Bajo la bitácora** de esa clase, cada una con su fecha y su título.
- **Implementación (2026-10-14):** `PORTAL/index.html`: `notasDelTramo` + sección "📝 NOTAS DEL CURSO (n)" bajo la
  bitácora de la clase anterior (solo si hay notas; título, fecha corta y texto con `EditorBloques.html`); clic →
  `abrirNotaCursos` abre la pestaña fija Cursos con `ir: { ctx, nota }` (suelto: pestaña de navegador); al instante
  con `TiempoReal` sobre `bitacora_paginas`. `CURSOS/index.html`: `irA(ctx, nota)` atiende `ws-ir` y `?ctx=&nota=`
  (abre el curso y salta a la nota). Sin cambios en Supabase.
- **Prueba (servidor local):** Plan de Quinto del mar 20/10: la clase anterior (13/10) muestra "R' Equipo de Aula ·
  mar 13 oct" bajo su bitácora; con ← (clase del 06/10) no aparece. `CURSOS/?ctx=QUINTO&nota=…` abre Quinto con la
  nota marcada y a la vista. Falta probar el clic dentro del Workspace (mismo mecanismo que Libros, BI).

### BO. Planificador — columna izquierda con pestañas: Plan de la clase (cards), Curso, Pendientes, Apoderados
*Origen: pedido del PO (2026-10-14): en la columna izquierda del Plan, donde hoy está "Clase anterior", un menú de
pestañas; cada una muestra su información en el mismo espacio.*
- **Auditoría (2026-10-15):** la columna izquierda muestra, bajo la barra ← Clase anterior →, el registro de la clase
  anterior (`pintarRegistro`: bitácora, notas BN, datos de la clase, Revisión/Repertorio/Plan/Materiales antiguos), y
  debajo Pendientes y Apoderados de la clase (`cargarPendientesSesion`); Materiales anclado al fondo. El plan antiguo
  (`plan_sesion_items`, una fila por ítem) ya no se edita desde la vista única.
- **DECISIÓN del PO (2026-10-15):**
  1. Pestañas: **📋 Plan** (abre primero) · **🎓 Curso** · **Pendientes** · **👪 Apoderados**. Materiales sigue abajo.
  2. **Plan de la clase** = algo nuevo: el plan de ESTA clase, estilo Notion en **cards**; cada card con título y
     texto (párrafos, viñetas, numerado). Tabla nueva (aprobada). Pasos siguientes: (2) cada card con sus
     diapositivas de la presentación al lado (diseño a conversar), (3) multimedia en las cards.
  3. **Curso** = la página del curso como en Cursos (clases y notas), **solo lectura con botón para editar**; parte
     mostrando la clase anterior. Las flechas ← → desaparecen (se recorre con la rueda).
  4. "Datos de la clase" y Revisión/Repertorio/Plan antiguos **fuera** (no se borran datos); el PO irá sumando lo que
     necesite.
- **Implementación paso 1 (2026-10-15):** `PORTAL/index.html`: barra de pestañas `#plan-tabs` (ancho de "Apoderados"
  fijo: 👪 + n° de citas, nombre en el `title`, regla 8b) y 4 paneles en la columna izquierda. **Plan:** tabla nueva
  `plan_cards` (`supabase/plan_cards.sql`, ejecutado por el PO; `sesion_id`, `orden`, `titulo`, `contenido`; en
  Realtime): cards con título + `EditorBloques`, ＋ Card, ⋯ Subir / Bajar / Eliminar, guardado automático, al instante
  entre equipos sin pisar lo que se escribe. **Curso:** clases anteriores a esta (bitácora de `memorias`) + notas hasta
  su fecha (`bitacora_paginas`), lo más nuevo arriba, como en Cursos; ✏️ Editar convierte la entrada en editor ahí
  mismo y ✓ Listo guarda. **Pendientes / Apoderados:** las mismas listas de antes. Retirados del Plan: registro de la
  clase anterior (`pintarRegistro`, historial ← →, notas BN —ahora en la pestaña Curso—, Datos de la clase y
  Revisión/Repertorio/Plan antiguos). El editor del plan antiguo (`plan_sesion_items`) ya estaba sin uso; sigue en el
  código, a retirar en una limpieza aparte.
- **Prueba (servidor local, 1366×768, Quinto 20/10):** abre en 📋 Plan; ＋ Card ×2, título y viñetas guardados en la base;
  texto escrito a mano guardado ("Guardado ✓"); ↑ Subir cambia el orden en pantalla y en la base; Eliminar borra (cards
  de prueba borradas). Card creada desde "otro equipo" aparece sola y desaparece al borrarla allá. 🎓 Curso: nota del
  13/10 arriba, luego la clase del 13/10 y las anteriores; ✏️ abre el editor y ✓ Listo vuelve a lectura. Pendientes y
  Apoderados se ven en sus pestañas.
- **Ajuste del PO (2026-10-15):** la pestaña "🎓 Curso" del Plan se llama **🕘 Historial** (cabe sin cortarse a 1366 px).

### BP. Plan — las cards se llaman "Actividades" y cada una puede tener un objetivo ("O:")
*Origen: pedido del PO (2026-10-15).*
- **DECISIÓN del PO (2026-10-15):** (1) las cards del Plan se llaman **Actividades** en todo lo visible; (2) cada
  actividad puede tener un **objetivo**: un párrafo que empieza con **"O:"** se reconoce como el objetivo y se destaca.
- **Implementación (2026-10-15):** `comun/editor-bloques.js` gana la opción **`objetivo`** (en `crear` y en `html`):
  un párrafo cuyo texto empieza con "O:" lleva la clase `eb-objetivo`, también mientras se escribe; estilo en
  `comun/editor-bloques.css` (fondo verde claro, borde izquierdo verde, letra seminegrita). Sin la opción, el editor
  sigue igual (Cursos, Bitácora). El texto se guarda tal cual ("O: …"), sin cambios en la base. Planificador: "＋
  Actividad", "Título de la actividad", "Eliminar actividad", ayuda inicial que explica el "O:".
- **Prueba (servidor local, 1366×768):** actividad "Calentamiento" escrita con el teclado: "O: Reconocer el pulso con el
  cuerpo" queda destacado y la viñeta siguiente no; al recargar se mantiene; en una segunda actividad el destaque
  aparece al ir escribiendo "O:". Guardado en la base como texto. Actividades de prueba borradas.

### BQ. Editor por bloques — listas juntas (viñetas, numerados y casillas)
*Origen: pedido del PO (2026-10-15): las viñetas y los ítems numerados se veían separados por un espacio grande, como
párrafos sueltos.*
- **DECISIÓN del PO (2026-10-15):** en todo el sistema, viñetas seguidas, numerados seguidos y **casillas** seguidas van
  con el interlineado normal de una lista; la separación de siempre queda solo entre la lista y lo que viene antes o
  después (y entre listas de distinto tipo).
- **Implementación (2026-10-15):** solo `comun/editor-bloques.css` (aplica a Cursos PC y celular, Bitácora del
  Planificador, Actividades del Plan e Historial): en listas, sin margen entre bloques, relleno de 1 px y alto mínimo
  de una línea; 5 px de separación al entrar o salir de un grupo de un mismo tipo; casilla centrada en la línea.
  Lectura igual de compacta. El celular toma la versión nueva solo (pide primero a internet).
- **Prueba (servidor local, 1366×768):** Actividad con texto, 3 viñetas, 3 numerados, 2 casillas y párrafo: cada ítem
  de lista mide 22 px y van pegados (antes 32 px por ítem en el editor); entre grupos, 5 px; párrafos sin cambio.
  Historial de Enlaces (lista de 10 nombres) y Cursos de Enlaces (26 px por ítem a 16 px de letra) se ven como lista
  continua. Actividad de prueba borrada.

### BR. Plan — arrastrar para ordenar actividades y los párrafos de cada actividad
*Origen: pedido del PO (2026-10-15).*
- **DECISIÓN del PO (2026-10-15):** las actividades se ordenan entre sí arrastrando, y los párrafos (bloques) dentro de
  cada actividad también.
- **Implementación (2026-10-15):** `PORTAL/index.html`: asa ⋮⋮ a la izquierda del título de cada actividad (aparece al
  pasar el mouse; `data-eb-no-marco` para que no active el recuadro de selección del editor) con arrastre propio
  (línea azul de destino) → `moverPlanCard(desde, antes)`, que también usan ⋯ Subir / Bajar, y guarda el orden. Los
  párrafos usan el ⋮⋮ que el editor ya tenía: en la actividad el texto se corre 14 px para que el ⋮⋮ quede dentro de
  la tarjeta y se oculta el ＋ (Enter ya crea el bloque siguiente).
- **Prueba (servidor local, 1366×768, arrastre real con el mouse):** "tercer párrafo" arrastrado sobre "primer párrafo"
  → orden nuevo en pantalla y en la base; actividad TRES arrastrada sobre UNO → TRES, UNO, DOS en pantalla y en la base;
  ⋯ Subir sigue funcionando; sin recuadro de selección pegado tras arrastrar. Actividades de prueba borradas.

### BS. Plan — cada actividad con sus diapositivas (deuda BO, paso 2)
*Origen: paso 2 de BO (PO, 2026-10-15): cada actividad del Plan con sus diapositivas de la presentación al lado.*
- **DECISIÓN del PO (2026-10-18):** (1) las diapositivas se agrupan **bajo cada actividad**: la columna Presentación
  se divide en **un cuadro por actividad** (con su título arriba), más un cuadro **Inicio** fijo arriba para el saludo
  y lo que no es de ninguna actividad; (2) al cambiar el orden de las actividades, **sus diapositivas se mueven con
  ellas**; (3) una actividad nueva parte **sin diapositivas**; (4) las presentaciones ya escritas quedan completas en
  **Inicio**; (5) en clase, se **destaca la actividad en curso** según la diapositiva de la Pizarra; (6) tocar una
  actividad **salta a su primera diapositiva**: la Pizarra con la clase en curso, la vista previa sin clase.
- **Auditoría (2026-10-18):** la presentación es un solo texto (`presentaciones.contenido`, diapositivas separadas por
  `---`) que usan el editor (`#pres-area`), la vista previa (posiciones de texto, arrastrar, duplicar, borrar,
  deshacer), Insertar, el tiempo real y la Pizarra (`parsearSlides`, índice de diapositiva compartido con
  `Proyeccion` y `profe_pizarra_slide`).
- **Diseño técnico (sin cambios en Supabase):** el texto completo sigue siendo la única verdad. Cada actividad con
  diapositivas se marca dentro del texto con una diapositiva-marca `@actividad:<id de plan_cards>` antes de las suyas;
  lo anterior a la primera marca es Inicio. Planificador y Pizarra **no cuentan ni muestran** las marcas (mismo
  índice de diapositiva en ambos). Los cuadros editan cada tramo y rearman el texto en el orden de las actividades.
- **Implementación (2026-10-18):** `PORTAL/index.html`: `#pres-area` queda oculto como texto completo; la columna
  Presentación muestra `#pres-secc` con un cuadro por tramo (Inicio, cada actividad en el orden del Plan y, si
  quedara una marca sin actividad, "Diapositivas sin actividad", para no perder nada); cada cuadro crece con su texto y
  su encabezado (título + n° de diapositivas) salta a sus diapositivas. Escribir en un cuadro rearma el texto
  (`presTextoDe`) y sigue el camino de siempre (guardado, vista previa, Pizarra al día, tiempo real). Vista previa:
  rótulo por actividad y cada diapositiva sabe de cuál es; clic en una diapositiva selecciona su texto en su cuadro;
  arrastrar, duplicar, borrar y deshacer conservan las marcas. Insertar (imagen, metalófono, YouTube) escribe en el
  último cuadro usado. Actividades: botón ▶ (solo si tiene diapositivas, espacio reservado) → `irActividad`; mover
  una actividad rearma y guarda la presentación; eliminarla avisa y borra también sus diapositivas. En clase, la
  diapositiva de la Pizarra destaca su actividad (card, cuadro y rótulo, en ámbar). `PIZARRA/index.html`:
  `parsearSlides` ignora las marcas. Sin cambios en Supabase.
- **Prueba (servidor local, 1366×768, Quinto 27/10):** dos actividades creadas y escritas con el teclado; sus
  diapositivas quedan en el texto guardado tras su marca, con rótulos Inicio / Calentamiento / Canto en la vista previa;
  ↓ Bajar Calentamiento → cuadros y texto guardado en el orden nuevo; al recargar, cada cuadro con lo suyo; ▶ de
  Calentamiento marca "# Pulso" en la vista previa; clic en "Coro" de la vista previa selecciona su texto en el cuadro
  Canto; con la Pizarra simulada en "# Pulso", Calentamiento se destaca en card, cuadro y rótulo; eliminar Canto pide
  "¿… y sus 2 diapositivas?" y las saca del texto; la Pizarra abre con 3 diapositivas (sin marcas) en el mismo orden.
  Datos de prueba borrados (presentación de Quinto 27/10 vuelta a la diapositiva inicial). Falta: prueba con la
  Pizarra real en el proyector.
- **Ajuste del PO (2026-10-18):** no toda actividad tiene diapositivas. En la Presentación, una actividad sin
  diapositivas es una **línea delgada** (borde punteado) con su título y "＋ Diapositivas"; al tocarla se abre su cuadro
  para escribir y, si se deja sin escribir, vuelve a ser línea. Su ▶ en el Plan sigue oculto. Prueba (local,
  1366×768): dos actividades nuevas = dos líneas; abrir Canto y escribir "# Cantamos" → cuadro con 1 diapositiva y ▶;
  abrir Conversación y salir sin escribir → vuelve a línea. Datos de prueba borrados.

### BT. Plan — actividades vinculadas a canciones del repertorio del curso
*Origen: pedido del PO (2026-10-18): algunas actividades deben quedar vinculadas a canciones del repertorio del curso.*
- **DECISIÓN del PO (2026-10-18):** (1) una actividad puede tener **varias** canciones, en orden; (2) se eligen
  primero del **repertorio del curso** (su sesión del Entrenador, deuda AU), con buscador en **toda la Biblioteca**:
  una canción que el curso no tiene **se suma a su repertorio**; (3) tocar una canción **abre el Entrenador del curso
  en esa canción** (en clase se proyecta desde ahí con 📽️ Pizarra, como hoy); (4) se ven como fichas en la actividad
  del Plan. Columna nueva aprobada.
- **Auditoría (2026-10-18):** el repertorio del curso = `repertorio_sesiones_entrenamiento.canciones` con
  `contexto_id` (el Planificador ya conoce su id, `entrenamientoDefaultId`; botón de repertorio del curso abre
  `REPERTORIO/?practicar=<id>` en la pestaña `sesion:<contexto>`). `practicarSesion` siempre parte en la primera
  canción; el Workspace ya sabe pedir a una pestaña abierta que vaya a un lugar (`ws-abrir` con `ir` → `ws-ir`).
  La Biblioteca suma una canción a un curso con `cursoAsignar` (lee la lista al día; crea la sesión si falta).
- **Supabase:** `plan_cards.canciones` (jsonb, `supabase/plan_cards_canciones.sql`) — la corre el PO.
- **Implementación (2026-10-18):** `PORTAL/index.html`: botón 🎵 en la cabecera de cada actividad → selector
  (repertorio del curso en su orden; al escribir, también el resto de la Biblioteca, máx. 30, "se suma al curso";
  Enter elige la primera); fichas 🎵 bajo el título (✕ quita de la actividad, no del curso); `sumarAlCurso` lee la
  lista al día y crea la sesión del curso si no existe (como `cursoAsignar` de la Biblioteca); guardado aparte del
  texto (`plan_cards.canciones`), con aviso si falta la columna. Tocar una ficha abre la pestaña del repertorio del
  curso (`sesion:<contexto>`) con `?practicar=<sesión>&cancion=<id>` o, si ya está abierta, le pide ir ahí (`ir`);
  si el curso ya no tiene la canción, la abre sola. `REPERTORIO/index.html`: `practicarSesion(id, cancionId)` parte en
  esa canción; `?practicar&cancion` en la dirección; atiende `ws-ir` { practicar, cancion } (lee la lista al día).
- **Prueba (servidor local, 1366×768, Quinto 27/10; PO corrió el SQL):** selector muestra las 3 canciones de Quinto;
  "amor" muestra "Mi Buen Amor" bajo Biblioteca; El Crack (del curso) y Mi Buen Amor (de la Biblioteca) quedan como
  fichas y en la base, y Mi Buen Amor se sumó a la sesión de Quinto (3 → 4); al recargar siguen; ✕ quita y guarda.
  Entrenador con `?practicar=<Quinto>&cancion=<El Crack>` abre en "El Crack · 2/3"; `ws-ir` a la 3ª canción salta a
  "Si Antes Te Hubiera Conocido · 3/3". Datos de prueba revertidos (repertorio de Quinto con sus 3 canciones,
  actividad borrada). Falta: probar el clic dentro del Workspace.
- **Ajuste del PO (2026-10-18):** el 🎵 sale de la cabecera de la actividad y pasa al menú ⋯ ("🎵 Vincular canción").
  Corregido: los rótulos de la vista previa decían "Diapositivas sin actividad" si la presentación se pintaba antes
  de que llegaran las actividades (ahora se ponen al día al pintar el Plan).

### BU. Plan — la letra de una canción de la actividad en la Vista previa y en la Pizarra
*Origen: pedido del PO (2026-10-18).*
- **DECISIÓN del PO (2026-10-18):** en la columna Presentación, el cuadro de una actividad con canciones tiene **un
  botón por canción**; al tocarlo, la columna Vista previa muestra un **Entrenador mínimo** (sin cancionero, con
  play/pausa y la barra de siempre) con una **✕** para volver a la vista previa, y **con la clase en curso** la
  Pizarra muestra solo la letra; **sin clase**, solo la Vista previa (la Pizarra no se toca).
- **Auditoría (2026-10-18):** ya existe el espejo del Entrenador en la Pizarra (botón "📽️ Pizarra", deuda del
  2026-10-06): el Entrenador emite su estado (`profe-espejo-entrenador`) y la Pizarra superpone
  `REPERTORIO/?espejo=1` (solo la letra, en silencio); al soltarlo vuelve a su diapositiva.
- **Implementación (2026-10-18):** `REPERTORIO/index.html`: modo **`?mini=1`** (solo el Entrenador; sin ←, ☰,
  cancionero, navegación de sesión ni Pedir); con `&pizarra=1` y la clase en curso enciende el espejo al abrir; ← /
  Esc avisan al Planificador (`ent-mini-cerrar`); al cerrarse la página (`pagehide`) el espejo se apaga solo (sirve
  también para la pestaña del Entrenador). `PORTAL/index.html`: botones 🎵 por canción en el encabezado del cuadro;
  `#prev-mini` (encabezado + ✕ + iframe) sobre la Vista previa; `abrirMini` usa la sesión del curso si la canción
  está en ella (`practicar` + `cancion`) y pide la Pizarra solo si la clase en curso es esta; ✕, cambiar de clase o
  ←/Esc lo cierran. Sin cambios en Supabase.
- **Deuda anotada por el PO (Notion, Pendiente):** en el Entrenador, esconder toda la letra e ir mostrando versos o
  estrofas con el mecanismo de marcado que ya existe.
- **Prueba (servidor local, Quinto 27/10):** ⋯ muestra "🎵 Vincular canción" y abre el selector; El Crack vinculada →
  botón "🎵 El Crack" en el cuadro de la actividad (línea delgada sin diapositivas); al tocarlo, la Vista previa
  muestra el Entrenador de El Crack (sesión del curso) sin ←, ☰ ni cancionero, con ⏪ ▶ ⏩ abajo; en una columna
  angosta (266 px) la barra baja de fila sin salirse; ✕ lo cierra (iframe en blanco) y ← / Esc del Entrenador
  también. Sin clase no se toca la Pizarra. Datos de prueba borrados. **Falta:** probar con la clase en curso que la
  letra aparece en la Pizarra y que al cerrar vuelve a su diapositiva (usa el espejo ya probado del Entrenador).
- **Ajuste del PO (2026-10-18):** el Entrenador mínimo ocupa **las columnas Presentación y Vista previa** (no solo la
  Vista previa), para tener espacio. `#prev-mini` pasa a ser hijo de `.s-split` y su borde izquierdo sigue al de la
  Presentación (también al arrastrar el ancho del Plan). En el Entrenador mínimo se ocultan el nombre y el artista
  del encabezado (ya están en la franja del Planificador). Prueba (local, 1366×768): ocupa de x=369 (inicio de la
  Presentación) a 1366, barra en una fila, ⏪ ▶ ⏩ abajo; ✕ cierra.
- **Ajuste del PO (2026-10-18):** fuera la franja morada sobre el Entrenador mínimo; la **✕ va en la barra del
  Entrenador, a la derecha de "Scroll"** (`#ent-btn-mini-x`, solo con `?mini=1`; llama a `cerrarEntrenador`, que avisa
  al Planificador). Vuelven el nombre y el artista a la izquierda de la barra (ya hay espacio). Prueba (local,
  1366×768): barra con El Crack · Los Miserables a la izquierda y ✕ tras Scroll; la ✕ cierra el Entrenador mínimo.
- **Ajuste del PO (2026-10-18):** en el cuadro de la actividad, los botones de las canciones van **en su propia fila,
  bajo el título** (el título ya no se corta por ellos). Prueba (local): actividad 'Repertorio: "El puma chileno y el
  león africano"' con 3 canciones → título entero en la primera fila y Aló, Aló · El Crack · Si Antes Te Hubiera
  Conocido debajo. Actividad de prueba borrada.
- **Ajuste del PO (2026-10-18):** una actividad **con canciones vinculadas** se ve como cuadro activo en la
  Presentación aunque no tenga diapositivas (no como línea delgada). "＋ Diapositivas" ya no se parte en dos líneas
  (ancho mínimo y sin corte). Prueba (local): actividad con 3 canciones → cuadro activo con título, canciones y
  espacio para escribir; actividad sin canciones ni diapositivas → línea con "＋ Diapositivas" en una línea.
  Actividades de prueba borradas.
- **Corrección del PO (2026-10-18):** lo pedido era solo que el **título** se vea activo, no que aparezca el cuadro de
  texto. Una actividad con canciones y sin diapositivas sigue siendo línea (sin cuadro de texto, se abre al tocar "＋
  Diapositivas"), pero con fondo blanco, borde continuo y título en negrita sin cursiva; "＋ Diapositivas" siempre en
  una línea. Prueba (local): así se ve con 3 canciones; sin canciones, línea punteada como antes. Datos de prueba
  borrados.
- **Ajuste del PO (2026-10-18):** con la clase en curso, la **actividad en curso** (la de la diapositiva que muestra la
  Pizarra) se pinta **amarilla** en la pestaña Plan y **sube al comienzo de la columna** (desplazándola, sin cambiar el
  orden); su identidad es solo el color. Sube solo cuando cambia la actividad en curso, y no si se está escribiendo en
  el Plan; mientras hay una, la columna deja espacio abajo para que también la última pueda quedar arriba. Prueba
  (local, Pizarra simulada): 4 actividades, diapositiva de la 4ª → amarilla y a 8 px del borde superior; diapositiva de
  Inicio → ninguna destacada y sin espacio extra. Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** con la clase en curso, abrir la letra de una canción de una actividad (Entrenador
  mínimo) la deja como **actividad en curso** (amarilla y arriba en el Plan), aunque la diapositiva de la Pizarra sea
  de otra; al cerrar el Entrenador mínimo, vuelve a mandar la diapositiva. Prueba (local, clase simulada): canción de
  la Actividad 3 → Actividad 3 amarilla; al cerrar, ninguna. Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** el Entrenador mínimo **nunca** muestra el cancionero en la Pizarra (su lista estaba
  oculta solo en la pantalla del profe; el espejo la seguía enviando). `espejoCancioneroDatos` no envía nada con
  `?mini=1`. Prueba (local): Entrenador mínimo de Quinto en El Crack, lista "abierta" por dentro → el estado enviado a
  la Pizarra va sin cancionero.
- **Ajustes del PO (2026-10-18):**
  1. **Desplazar la letra en la Pizarra** (deuda del Entrenador, vale para todo espejo): el Entrenador del profe
     reenviaba su posición cada 300 ms y deshacía lo hecho en la Pizarra. Ahora, mientras se usa la rueda / toque /
     teclado en la Pizarra (y 0,9 s después), la copia no obedece y cada 150 ms le avisa al Entrenador del profe dónde
     quedó (`scroll-pizarra`), que la sigue. Prueba (local, dos pestañas = profe + Pizarra): rueda y desplazamiento en
     la Pizarra → queda en su lugar (1500 px) y el profe pasa al mismo verso (n° 34).
  2. **Cerrar la letra de una actividad sin diapositivas** (en clase): la Pizarra queda **en blanco** (orden
     `blanco` de `Proyeccion`; no vuelve a la diapositiva anterior) y la actividad **sigue destacada** (la Pizarra
     publica `idx: -1, act`); ▶ va a la primera diapositiva de lo que viene después de esa actividad, ◀ a la anterior;
     el texto al día no la saca del blanco. Prueba (local): A1 (1 diapo), A2 (canción, sin diapos), A3 (2 diapos) →
     al cerrar la canción de A2 se ordena blanco con siguiente = 2 y A2 sigue amarilla; en la Pizarra queda en blanco,
     ▶ muestra "Tres", ◀ desde blanco muestra "Uno".
  3. **Al terminar la clase** se apaga la actividad en curso (solo hay actividad en curso con la clase de esa sesión
     en curso; el Planificador repinta al cambiar la clase). Prueba (local): sin clase, ninguna card ni cuadro
     destacado. Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** al terminar la clase se apaga también el **marco dorado** de la diapositiva en la
  Pizarra en la vista previa (el marco y la actividad en curso solo existen con la clase de esa sesión en curso).
  El PO informó que la Pizarra en blanco "no funciona": probado de nuevo de punta a punta con dos ventanas reales
  (Planificador + Pizarra, ✕ del Entrenador mínimo) → la Pizarra queda en blanco (siguiente = 2) y la actividad sigue
  destacada. Sospecha: la Pizarra abierta tenía la versión anterior (GitHub Pages guarda copias hasta 10 min); a
  confirmar por el PO cerrando y reabriendo la Pizarra.
- **Ajuste del PO (2026-10-18):** el PO confirmó que la Pizarra en blanco sí funciona (probaba con una actividad con
  diapositivas). Nuevo caso: al cerrar la letra de una actividad **con** diapositivas, la Pizarra volvía a la
  diapositiva donde estaba (de la actividad anterior); ahora va a **la última diapositiva que mostró de esa
  actividad** o, si no mostró ninguna, a **su primera**. El Planificador recuerda la última diapositiva mostrada de
  cada actividad (`ultDiapoAct`). Prueba (local, dos ventanas): A2 con "Dos a" (2) y "Dos b" (3); Pizarra en Dos b,
  abrir y cerrar la canción de A2 → vuelve a 3; Pizarra en "Uno" sin haber mostrado A2 → vuelve a 2, A2 destacada.
  Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** al cerrar la letra de una actividad **sin** diapositivas ya no se va a una
  diapositiva en blanco: **la letra se queda a la vista en la Pizarra** hasta que se elija otra diapositiva o
  canción (la actividad sigue destacada; ▶ / ◀ siguen igual que con el blanco). Al cerrar, el Entrenador mínimo se
  congela (`espejoCongelado`: no envía el estado "cerrado"); el Planificador le pide `espejoDejarEnPizarra()` (deja de
  emitir sin soltar la copia) y ordena `blanco` con `letra: true`; la Pizarra marca la copia como dejada y la suelta al
  dibujar una diapositiva o al recibir otra canción. Si no se estaba proyectando, queda el blanco. Con diapositivas,
  se suelta como antes. Prueba (local, dos ventanas): A2 (canción, sin diapos) proyectada y cerrada → la Pizarra sigue
  mostrando El Crack, A2 destacada; ▶ → "Tres" y la letra se va; A3 (con diapo) proyectada y cerrada → la letra se va
  y queda "Tres". Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** también con una actividad **con** diapositivas, al cerrar la letra la Pizarra
  **espera** (la letra queda a la vista) a que el profe elija qué mostrar; ▶ va a la diapositiva de esa actividad (la
  última que mostró o su primera), ◀ a la anterior. Prueba (local, dos ventanas): A2 con "Dos" → cerrar su canción
  proyectada deja la letra; ▶ muestra "Dos" y la letra se va. Datos de prueba borrados.

### BV. Entrenador — esconder toda la letra e ir mostrando versos o estrofas
*Origen: deuda anotada por el PO (2026-10-18; Notion, Pendiente), pedida el mismo día.*
- **DECISIÓN del PO:** poder esconder toda la letra de una canción e ir mostrando los versos o estrofas que se
  necesiten, con el mecanismo que ya existe.
- **Auditoría:** el botón "Letra" escondía toda la letra con una marca general que se imponía a todo (Alt+clic no
  podía mostrar un verso); Alt+clic (verso) y Alt+doble clic (estrofa) ya esconden/muestran versos uno a uno
  (`entrenadorLineasOcultas`, se guarda por canción y llega a la Pizarra).
- **Implementación (2026-10-18):** `REPERTORIO/index.html`: "Letra" esconde cada verso con texto (en vez de la marca
  general), así Alt+clic / Alt+doble clic los van mostrando; si hay versos escondidos, "Letra" muestra todo. El botón
  queda marcado mientras haya versos escondidos (`entPintarBtnLetra`). Ayuda del botón y atajos (⌨) al día.
- **Prueba (local, El Crack, 59 versos):** Letra → 59 escondidos y botón marcado; Alt+clic en un verso → se ve (58);
  Alt+doble clic en otro → se ve su estrofa (54); Letra → todo visible y botón sin marcar.
- **Ajuste del PO (2026-10-18):** en el Entrenador desde el Planificador (`?mini=1`), un verso escondido **se deja
  leer al pasar el mouse** (sin desenfoque, medio transparente) solo en la pantalla del profe; la Pizarra no cambia y
  Alt+clic lo muestra de verdad. Prueba (local): con toda la letra escondida, el verso bajo el mouse se lee.

### BW. Planificador en clase — vista para conducir la clase (diseño)
*Origen: pedido del PO (2026-10-18): idear cómo se ve todo el Planificador (Plan + Presentación + Vista previa) con
la clase en curso.*
- **DECISIÓN del PO (2026-10-18):**
  1. **Prioridades en clase:** conducir la clase, luego registrar bitácora, luego editar diapositivas.
  2. **Columna izquierda:** las actividades como **cards grandes** (títulos); al escoger una, **reemplaza la lista**
     y se muestra toda su información con **letra mucho más grande** (con "← Actividades" para volver). Escoger una
     la deja **en curso** (amarilla); **la Pizarra espera** hasta que se toque una diapositiva o canción.
  3. **Presentación + Vista previa** forman un solo espacio: las **diapositivas, canciones u otros recursos** de la
     actividad escogida, **un poco más grandes** que hoy; siempre a mano las **canciones de la actividad**.
  4. **Editar en clase:** ✏️ en cada diapositiva (edita su texto ahí) y ＋ para agregar una nueva a la actividad.
  5. **Bitácora por actividad:** en la actividad, un botón como el de ✍🏼 con la ayuda "Registrar bitácora de esta
     actividad", que no abre toda la bitácora. La bitácora de la clase es **un solo texto**: lo escrito en ✍🏼
     (lo general de la clase) más lo escrito para cada actividad, con su título; desde ✍🏼 se edita todo junto.
  6. **Por partes:** (1) vista de clase; (2) bitácora por actividad.
- **PROPUESTA (Claude, por defecto mientras el PO no diga otra cosa):** Inicio aparece como una card más, primera;
  las pestañas Historial / Pendientes / Apoderados siguen arriba; fuera de clase todo queda como hoy.
- **Implementación parte 1 (2026-10-18):** `PORTAL/index.html`. Con la clase de esta sesión en curso
  (`claseAqui()`), la pestaña 📋 Plan muestra `#pane-clase` en vez del editor: **lista** de cards grandes (Inicio si
  tiene diapositivas + cada actividad, con n° de diapositivas y canciones) o **detalle** de la escogida (título 1,6 rem,
  texto por bloques en lectura a 20 px, "← Actividades"). Sobre Presentación + Vista previa, `#clase-panel` (se ubica
  como el Entrenador mínimo, que queda encima): botones grandes de canciones (abren el Entrenador mínimo) y las
  diapositivas de la actividad en una grilla de ≥ 380 px, con el tema del curso y el marco dorado de la que está en la
  Pizarra; clic = esa diapositiva en la Pizarra; ✏️ = editar su texto ahí (Listo / Cancelar; reemplaza solo ese tramo
  del texto); ＋ Diapositiva = una nueva al final de la actividad. Escoger una actividad la deja en curso (`actManual`,
  manda mientras la Pizarra no cambie de diapositiva) sin mover la Pizarra; si la Pizarra pasa a una diapositiva de
  otra actividad, el detalle cambia a esa. Al terminar la clase vuelve el Plan de siempre. Sin cambios en Supabase.
- **Prueba (local, clase simulada, 3 actividades):** lista con Inicio (1 diapositiva), Acción y reacción (1),
  Repertorio (2 · 2 canciones), Juego: ASMR; escoger Repertorio → detalle en grande y amarillo (también su card del
  Plan), canciones El Crack y Aló, Aló, diapositivas de 476 px; ✏️ cambió "Verso y estrofa" y ＋ agregó "Nueva en clase"
  (ambas guardadas en la base); clic en una diapositiva ordena `ir` a la Pizarra (idx 3); Pizarra en una diapositiva de
  "Acción y reacción" → el detalle pasa a esa; terminar la clase → vuelve el Plan normal sin destacados. Datos de
  prueba borrados. Falta: parte 2 (bitácora por actividad) y prueba en clase real.
- **Implementación parte 2 (2026-10-18) — bitácora por actividad:** `PORTAL/index.html`. En el detalle de una
  actividad (vista de clase), botón ✍🏼 junto al título con la ayuda "Registrar bitácora de esta actividad": abre bajo
  la actividad un recuadro con un editor por bloques solo para su apartado (no abre toda la bitácora), con guardado
  automático y "Listo". La bitácora sigue siendo **un solo texto** (`memorias.contenido`): el apartado de cada
  actividad empieza con `## <título de la actividad>` y llega hasta el siguiente título (`#` o `##`); al guardar se
  lee el texto al día y se reemplaza o agrega solo ese apartado (si queda vacío, se quita). Si la ventana ✍🏼 está
  abierta, se pone al día. Mientras se escribe, la columna no se repinta; al cambiar de actividad, volver a la lista o
  terminar la clase se guarda y se cierra. Sin cambios en Supabase. Nota: si se cambia el título de la actividad
  después, su apartado viejo queda con el título anterior y se empieza uno nuevo.
- **Prueba (local, clase simulada, bitácora de Quinto 27/10 vacía al empezar):** nota escrita con el teclado en
  "Acción y reacción" → `## Acción y reacción` + nota; texto general agregado aparte; nota en "Juego: ASMR" → su
  apartado al final; volver a "Acción y reacción" carga solo su nota y agregar una viñeta la deja en su apartado:
  "Clase tranquila en general. / ## Acción y reacción / … / - Probar de nuevo el jueves / ## Juego: ASMR / Les encantó,
  repetir." Bitácora de prueba y actividades borradas.
- **Ajustes del PO (2026-10-18):** (1) el ✍🏼 de la actividad sale de la card y va en la línea de "← Actividades",
  pegado a la derecha; (2) los apartados de actividades en la bitácora van con **título 3** (`### <título>`; se
  siguen reconociendo los `##` escritos antes y se pasan a `###` al guardar); (3) diapositivas **3 o 4 por fila**, a
  elección con "Por fila 3 | 4" (se recuerda en el equipo); (4) más aire después del objetivo "O:" (10 px; 4 px entre
  dos objetivos seguidos) en todo el editor por bloques; (5) **un párrafo seguido de una lista es su título**: la
  lista va pegada a él, y **Mayús+Enter** en un párrafo empieza la línea siguiente como viñeta; (6) casillas del
  detalle de la actividad con espacio para el texto. `comun/editor-bloques.js` (Mayús+Enter) y `.css` (espacios).
  Prueba (local): escrito con el teclado "O: reforzar la letra" ↵ "CON LETRA RENDERIZADA:" Mayús+↵ "Pregunta uno" ↵
  "Pregunta dos" → objetivo, párrafo a 10 px, viñetas a 1 px y 0 px; texto guardado igual que siempre. En clase: ✍🏼
  en la barra de "← Actividades"; 3 por fila → 3 arriba y la 4ª abajo; 4 por fila → 4 arriba; nota guardada como
  "### Repertorio". Datos de prueba borrados.
- **Ajuste del PO (2026-10-18):** en la vista de clase, las canciones de la actividad dejan de ser chips y se ven
  **como diapositivas moradas** (repertorio) al comienzo de la grilla: 16:9, 🎵 grande, nombre y artista; tocarlas
  abre su letra (Entrenador mínimo) como antes. Prueba (local): 3 canciones como tarjetas moradas antes de "Verso y
  estrofa" y de ＋ Diapositiva. Datos de prueba borrados.
- **Corrección (2026-10-18):** el PO informó que la lista seguía separada de su título. La lista ya no tenía margen,
  pero el párrafo que la titula seguía con el alto y el relleno de un párrafo normal (30 px). Ahora un párrafo
  seguido de una lista mide como una línea de lista (sin margen abajo, relleno de 1 px; `:has`). Prueba (local, con
  el texto real de la actividad del PO): título → 1ª viñeta 28 px y entre viñetas 26 px (en lectura 23 / 21 px).
- **Corrección del PO (2026-10-18), editor por bloques en todo el sistema:** Mayús+Enter **no** crea una viñeta: es
  un **salto de línea dentro del mismo párrafo** (sin el espacio entre párrafos); Enter sigue creando un bloque nuevo
  con su espacio. Se deshizo la regla "párrafo seguido de lista = pegado" (vuelve el espaciado de siempre) y se
  mantiene el aire extra tras "O:". Formato: el salto se guarda dentro de la línea del bloque como `<br>` (el texto
  sigue siendo una línea por bloque; el celular lo lee igual); al convertir un bloque en pendiente, los saltos pasan a
  espacios. Además, **← al comienzo de un bloque va al final del anterior** y **→ al final va al comienzo del
  siguiente**. `comun/editor-bloques.js` y `.css`. Prueba (local, teclado real): "CON LETRA:" Mayús+↵ "Pregunta uno"
  Mayús+↵ "Pregunta dos" ↵ "Otro parrafo", Inicio, ← y "!" → guardado "CON LETRA:<br>Pregunta uno<br>Pregunta dos!\nOtro
  parrafo"; al recargar, un párrafo de 3 líneas y otro aparte.
- **Ajuste del PO (2026-10-18):** una línea hecha con Mayús+Enter que empieza con "- ", "1. " o "[] " **es una
  lista** (viñeta, numerada o casilla) **pegada al párrafo** que la titula. Al escribir la marca, el párrafo se parte
  ahí; Enter sigue la lista como siempre. Formato: el párrafo título termina en `<br>` en su línea
  (`CON LETRA:<br>` + `\n- …`), lo que pega la lista que sigue (clase `eb-pegar`); los textos ya escritos así se
  convierten al abrirlos. Prueba (local): la actividad real del PO ("CON LETRA DE LA CANCIÓN RENDERIZADA:<br>-  Pregunta…")
  se ve como título + 4 viñetas pegadas; "PASOS:" Mayús+↵ "1. Primero" ↵ "Segundo" → "PASOS:<br>\n1. Primero\n2.
  Segundo" (también con el texto entrando de una vez). Actividad de prueba borrada.
- **Ajuste del PO (2026-10-18):** la actividad en curso **ya no se colorea** en la columna del Plan (ni en la card del
  Plan ni en la vista de clase); sí se mantiene el **marco dorado** de la diapositiva que está en la Pizarra. La
  actividad en curso sigue funcionando por dentro (sube al comienzo, cambia el detalle en clase). Prueba (local, clase
  simulada): detalle y card en blanco; la diapositiva en la Pizarra con su marco dorado. Datos de prueba borrados.

### BX. Plan — melodías de metalófono y ritmos en las actividades
*Origen: pedido del PO (2026-10-19): además de canciones (letra + audio), poder vincular a una actividad melodías
de metalófono y ritmos.*
- **Auditoría:** los ritmos (`tipo='ritmo'`) y las melodías de metalófono (`tipo='metalofono'`) son recursos
  (`repertorio_assets`) de una canción de la Biblioteca (hoy 10 ritmos y 16 metalófonos, casi todos en borrador). El
  Entrenador ya los muestra y los lleva a la Pizarra (espejo del ritmo y del metalófono). Falta: elegirlos en la
  actividad y abrir el Entrenador directo en ese recurso.
- **DECISIÓN del PO (2026-10-19):** aprobado: selector con pestañas 🎵 Canción · 🎹 Metalófono · 🥁 Ritmo; cada
  recurso con su nombre de cortesía; primero los del curso, al escribir toda la Biblioteca (sin filtrar por estado);
  tocarlo abre el Entrenador mínimo en ese recurso (en clase, también en la Pizarra); su canción se suma al repertorio
  del curso, como con las canciones. Sin cambios en Supabase.
- **Implementación (2026-10-19):** `PORTAL/index.html`: "🎵 Vincular canción, metalófono o ritmo" (menú ⋯ de la
  actividad) abre el selector con pestañas 🎵 Canción · 🎹 Metalófono · 🥁 Ritmo (ancho fijo, regla 8b). El vínculo
  se guarda en la misma lista `plan_cards.canciones` como `{ cancion_id, asset_id }` (sin `asset_id` = canción, como
  antes). Fichas del Plan, botones del cuadro de la Presentación y tarjetas moradas de la vista de clase muestran
  🎹 / 🥁 + "Canción · Descripción" (nombre de cortesía); la vista de clase cuenta "1 metalófono · 1 ritmo".
  `REPERTORIO/index.html`: `?asset=<id>` (y `asset` en `ws-ir`) parte el Entrenador en ese recurso; un metalófono se
  abre directo en el Metalófono. Sin cambios en Supabase.
- **Prueba (local, Quinto 27/10):** pestaña Metalófono → "Del curso" con Aló, Aló y 5 de El Crack; "crack" filtra;
  vinculado "El Crack · Parte 1, en C" (queda inhabilitado en el selector); Ritmo → "El curso aún no tiene ritmos";
  ritmo "Figuras rítmicas en 6/8 · Negra con punto" agregado. Desde la Presentación: el ritmo abre el Entrenador
  mínimo con su partitura; el metalófono abre el Metalófono con esa melodía. Vista de clase: tarjetas 🎹 y 🥁 con su
  descripción. Actividad de prueba borrada. Falta: prueba en clase real (Pizarra) y dentro del Workspace.
- **Commit:** `7d3a51e` (subido).

### BY. Entrenador — ritmos a dos voces (y silencios)
*Origen: pedido del PO (2026-10-19): poder armar ritmos a dos voces en el Entrenador.*
- **Auditoría:** el motor (`ritmo.js` + `ritmo-render.js`, **protegidos**, §10) tiene una sola voz y no tiene
  silencios; el reproductor ya estaba preparado para varias voces (`opts.voces`, timbre por voz). Consumidores: solo
  `REPERTORIO/index.html` (editor de ritmo, vista del Entrenador y espejo en la Pizarra).
- **DECISIÓN del PO (2026-10-19):** (1) dos líneas, una sobre otra, con las barras alineadas; (2) la voz 1 sigue con
  palmas (o piano) y la voz 2 suena con un **golpe grave**; (3) se agregan **silencios** (en una y dos voces);
  (4) **autoriza modificar el motor de ritmo**, solo para esto; los ritmos de una voz quedan iguales.
- **Formato (PROPUESTA de Claude, aplicada):** silencio = la misma letra en mayúscula (`N` silencio de negra,
  `C.` de corchea con puntillo; también dentro de tresillos). La segunda voz va después de una línea `voz: 2`, con
  la misma cantidad de compases. Sin cambios en Supabase (el ritmo sigue siendo texto en `repertorio_assets.contenido`).
- **Implementación (2026-10-19):** `ritmo.js`: silencios (letra mayúscula → evento con `rest: true`; la base de un
  tresillo no puede ser silencio), clave `voz: 2` y `obj.voces` (`measures` sigue siendo la voz 1; los eventos de la
  voz 2 siguen la numeración), error `VOZ2_COMPASES` si las voces no tienen los mismos compases, `serializeMeasure`
  público; 16 pruebas nuevas (`node ritmo.js`: 107 OK). `ritmo-render.js`: Partitura con una línea por voz formateadas
  juntas (lo simultáneo queda alineado) e íconos 👏 / 🥁; Infantil con dos filas (🥁 en la voz 2, silencio = punto
  gris); los silencios no suenan ni destellan; timbre nuevo `grave` (golpe tipo tambor) para la voz 2.
  `REPERTORIO/index.html`: editor de ritmo con "Voces 1 | 2" (cada compás con su línea 👏 y su línea 🥁, validación por
  voz, ayuda con silencios), vista previa más alta con dos voces; espejo de la Pizarra con los golpes de ambas voces;
  `ritmo.js?v=by1` para que ningún equipo use una copia vieja del motor.
- **Prueba (local):** los 12 ritmos guardados se leen y se vuelven a escribir idénticos (1 voz). Editor: 2 voces,
  2 compases ("nNnN / bb" + "ccNnN / N.cn.c") → Partitura alineada con 👏 y 🥁 y Infantil con 10 golpes y 5 silencios;
  Play / Stop sin errores. Entrenador con ese ritmo (sin guardarlo): dos líneas, Play, Partitura ↔ Infantil sin
  errores. No se guardó nada. Falta: escucharlo (el sonido del golpe grave) y la Pizarra en clase.
- **Commit:** `8eee199` (subido).
- **Corrección (2026-10-19, informada por el PO):** un ritmo nuevo de la Biblioteca no aparecía en el selector del Plan:
  el Planificador leía la Biblioteca una sola vez. Ahora `PORTAL/index.html` escucha `repertorio_canciones` y
  `repertorio_assets` al instante (`TiempoReal`, ya activos por `fase3_realtime.sql`), vuelve a leerla al abrir el
  selector y al volver a la página, y repinta fichas, cuadros de la Presentación, vista de clase y el selector
  abierto. Prueba (local): con el selector abierto en Ritmo, un ritmo de prueba creado en la base apareció solo en
  ~4 s y al borrarlo desapareció solo; datos de prueba borrados.

### BZ. Plan — actividad "Tiempo libre" con cuenta regresiva en la Pizarra
*Origen: pedido del PO (2026-10-19).*
- **DECISIÓN del PO (2026-10-19):** una actividad cuyo título es "Tiempo libre" es de un tipo especial: en el Plan se
  anota cuánto dura; en clase, un botón en la actividad la comienza, **pidiendo confirmar o cambiar los minutos**.
  La Pizarra muestra una diapositiva recurrente con "TIEMPO LIBRE" y la **cuenta regresiva** (por ahora sin
  imágenes; más adelante el PO agregará imágenes por edad). Al llegar a cero, sin sonido, pasa a 🤫 **Silencio y
  atención**, que **se quita sola cuando el profe proyecta** otra diapositiva o canción (también con su botón o Esc).
- **PROPUESTA (Claude, por defecto):** se reconoce el título sin importar mayúsculas ni tildes; conserva su texto
  (notas) y puede tener diapositivas como cualquier actividad; 10 minutos si no se anotan (el PO lo cambió a 5, ver ajuste); mientras corre, "+1 min"
  y "Terminar" (pasa a Silencio y atención); no cuenta como tiempo perdido (ese sigue siendo manual).
- **Supabase:** columna `plan_cards.minutos` (`supabase/plan_cards_minutos.sql`, la corre el PO).
- **Implementación (2026-10-19):** `comun/recurrentes.js`: recurrente `libre` (fuera del menú 🔔, sin imagen) con
  `{ fin, min }`; la capa de la Pizarra muestra "TIEMPO LIBRE" y la cuenta regresiva (m:ss) en el lugar de la imagen;
  cualquier ventana abierta revisa el fin y pasa a `silencio` con `trasLibre`; `sumarLibre`, `terminarLibre`,
  `alProyectar` (quita solo ese Silencio). `PIZARRA/index.html`: `irA` (cualquier diapositiva: teclado o
  Planificador) y el espejo del Entrenador ("on") llaman `alProyectar`. `PORTAL/index.html`: actividad titulada
  "Tiempo libre" → fila "⏱ [10] min" en su card (`plan_cards.minutos`); en la vista de clase, su detalle tiene
  "⏱ Comenzar tiempo libre" → "¿Cuántos minutos?" (editable) → Comenzar; mientras corre, reloj + "+1 min" +
  "Terminar"; después, aviso de Silencio y atención con "Quitar". Mismo aviso que el 🔔 si la Pizarra no acusa recibo.
- **Prueba (local, clase simulada solo en la pestaña, Quinto 27/10):** título "Tiempo Libre" → fila de minutos;
  Comenzar → confirmación con 10 → cambiado a 2 → la Pizarra mostró "TIEMPO LIBRE 1:52"; +1 min sumó 60 s; Terminar →
  Pizarra con Silencio y atención; ir a otra diapositiva en la Pizarra → se quitó sola; un Silencio puesto con 🔔 no
  se quita al proyectar; vencimiento natural (1,5 s) → Silencio. Sin la columna `minutos` avisa "¿Falta correr
  supabase/plan_cards_minutos.sql?" y el Tiempo libre igual funciona con los minutos confirmados. Datos borrados.
  Nota: si la Pizarra se abre recién, la vista de clase sigue a su diapositiva (comportamiento de BW).
- **Commit:** `da80e76` (subido). El PO corrió `supabase/plan_cards_minutos.sql` (2026-10-19; verificado: los minutos se guardan y se leen). Falta: prueba en clase real.
- **Ajustes del PO (2026-10-19):** (1) la actividad Tiempo libre **no muestra cuadro de texto** por defecto; ⋯ →
  "✏️ Agregar texto" lo muestra (si ya tiene texto, se ve siempre); (2) en la columna Presentación su título se ve
  **activo** y muestra los minutos ("⏱ 5 min"); (3) **5 minutos** por defecto; (4) la **Vista previa** muestra una
  diapositiva "TIEMPO LIBRE 5:00" en el lugar de la actividad (solo para el profe: no cuenta ni va como diapositiva a
  la Pizarra); (5) en clase, el panel de la actividad muestra esa diapositiva con el mensaje para el profe
  **"Recuerda hacer el trabajo ejecutivo: firmar libro, llenar leccionario…"** (tocarla pide confirmar los minutos);
  (6) en la Pizarra, letrero y reloj más grandes (letrero 11 % del ancho, reloj 36 %: el reloj siempre manda).
  `PORTAL/index.html` (`libreSinTexto`, `previewLibres`, `libreDiapoHTML`, `LIBRE_NOTA`) y `comun/recurrentes.js`.
- **Prueba (local, Quinto 27/10):** "Canto" + "Tiempo libre": card sin cuadro de texto con "⏱ 5 min"; Presentación con
  "⏱ 5 min" y título activo; Vista previa con su diapositiva bajo el rótulo "Tiempo libre"; ⋯ muestra "✏️ Agregar
  texto" y lo abre; cambiar a 10 → Presentación "⏱ 10 min", Vista previa "10:00", guardado ✓. Clase simulada: panel
  con la diapositiva y el mensaje; tocarla → "¿Cuántos minutos?"; Comenzar → Pizarra con letrero y reloj grandes;
  "10:01" mide 732 px en un bloque de 818 px (cabe). Datos borrados.

### CA. Diapositivas — línea forzada a una sola línea (`1L`) y lista numerada
*Origen: pedido del PO (2026-10-19), para el texto de la columna Presentación.*
- **DECISIÓN del PO (2026-10-19):** prefijo **`1L `** al comienzo de la línea (como `IZ `, combinable: `IZ 1L …`)
  fuerza que ese texto se muestre en **una sola línea**; si no cabe a lo ancho, **solo esa línea** achica su letra (el
  resto de la diapositiva queda igual). Además, **lista numerada** con `1. `, `2. `… (empieza en el número escrito).
- **Alcance:** el mismo formato en el Planificador (Vista previa y vista de clase) y en la Pizarra; ayuda de markdown
  (?) al día. Sin cambios en Supabase.
- **Implementación (2026-10-19):** `PORTAL/index.html` y `PIZARRA/index.html` (`renderizarSlideHtml` de cada uno):
  prefijos `IZ` y `1L` en cualquier orden; `1L` envuelve el texto en `<span class="una-linea">` (en bloque en línea,
  sin cortes, lo que sobra se oculta) y, tras el ajuste de letra de la diapositiva (`autoFitSlide` / `autoFit`),
  `ajustarUnaLinea` le baja la letra solo a ese texto hasta que quepa. Líneas `N. texto` → `<ol>` (con `start` si no
  parte en 1); las listas abiertas se cierran al cambiar de tipo. Estilos de `ol` (número en negrita, color de
  viñeta) y ayuda (?) al día. Nota: una línea antigua que empezaba con "2. " ahora se ve como lista numerada.
- **Prueba (local, sin guardar):** diapositiva de prueba con título, línea `1L` larga, párrafo largo, 3 numerados y
  una viñeta. Vista previa: la línea `1L` en una línea a 19 px mientras el párrafo queda a 22 px (dos líneas); lista
  1-2-3 y la viñeta aparte. Pizarra (1280×720): igual, la línea `1L` en una sola línea y más chica que el resto.
- **Commit:** `b391460` (subido). Falta: uso en clase.

### CB. Diapositivas — línea horizontal `'---`
*Origen: pedido del PO (2026-10-19).* **DECISIÓN del PO:** una línea con `'---` (con la comilla, para no confundirla con
`---`, que separa diapositivas) dibuja una línea horizontal dentro de la diapositiva.
- **Implementación (2026-10-19):** `renderizarSlideHtml` de `PORTAL/index.html` y `PIZARRA/index.html` → `<hr class="slide-hr">`
  (90 % del ancho, color del texto, suave); el separador de diapositivas sigue siendo solo `\n---\n`. Ayuda (?) al día.
- **Prueba (local, sin guardar):** "# Ritmo / Escuchamos el pulso / '--- / 1. Palmas / 2. Pies" → línea de 458 px en
  una diapositiva de 523 px, sin partir la diapositiva; la Pizarra genera `<h1>Ritmo</h1><hr class="slide-hr"><p>Texto</p>`.

### CC. Diapositivas — la línea en blanco deja espacio
*Origen: pedido del PO (2026-10-19): "que se respete el Enter".* **DECISIÓN del PO:** **siempre**, cada línea en blanco
dentro de una diapositiva deja un espacio del alto de una línea de texto (las diapositivas que ya tenían líneas en
blanco quedan con más aire).
- **Implementación (2026-10-19):** `renderizarSlideHtml` de `PORTAL/index.html` y `PIZARRA/index.html`: línea vacía →
  `<div class="slide-esp">` (1,3 em, cierra la lista abierta); las diapositivas llegan sin blancos al comienzo ni al
  final. Ayuda (?) al día.
- **Prueba (local, sin guardar):** "# Ritmo / (blanco) / Escuchamos / (blanco) / - uno" → 2 espacios; distancia
  título-párrafo 56 px contra 16 px sin la línea en blanco. Pizarra: `<h1>…</h1><div class="slide-esp"></div><p>…`.

### CD. Lector — atajo a las asignaciones del estudiante con sesión iniciada
*Origen: pedido del PO (2026-10-19).* Cuando un estudiante tiene su sesión iniciada en el Lector y el profe abre ahí
mismo la administración (Ctrl+Shift+A o `?admin=1`), quiere modificar **las asignaciones de ese estudiante** (tabs y
secciones: `alumno_tabs` / `alumno_tab_secciones`) sin buscarlo en la lista.
- **Auditoría (2026-10-19):** el estudiante se identifica con `alumnoActual` (`loginAlumno`, desde la lista del panel;
  los particulares `?p=` entran en modo público, sin administración, así que no aplica). La administración es el
  panel de alumnos (`abrirPanelAlumnos`, gateado por `cap.admin`), que ya muestra arriba "Alumno activo" con su nombre
  y "Cerrar sesión". Hoy, para editar sus asignaciones, hay que bajar por la lista de alumnos (agrupada por curso) y
  tocar su 📋, que abre la sub-vista de asignación (`abrirModoAsignacion(id)`: catálogo con paleta, buscador,
  instrumentos, ✓ Asignados y columna "Asignado"). Al cerrar el panel, el repertorio del estudiante se vuelve a leer
  al abrirlo, así que los cambios se ven sin más.
- **DECISIÓN del PO (2026-10-19):** con un estudiante con sesión iniciada, abrir la administración entra **directo a sus
  asignaciones** ("← Lista" vuelve a la administración normal); además, botón **📋 Asignaciones** junto a su nombre en
  "Alumno activo" para volver a ellas.
- **Alcance:** solo `tabs/index.html`; sin cambios en Supabase.
- **Implementación (2026-10-19):** `prepararModoAsignacion(id)` (deja la sub-vista elegida con los filtros limpios, sin
  dibujar) sale de `abrirModoAsignacion`; `abrirPanelAlumnos` la llama si hay `alumnoActual`; botón 📋 Asignaciones en
  la barra "Alumno activo" → `abrirModoAsignacion(alumnoActual.id)`.
- **Prueba (local, sin guardar):** `?admin=1` sin estudiante → lista normal (16 filas); sesión iniciada de un estudiante
  y Ctrl+Shift+A → abre su sub-vista de asignación (su nombre, buscador y catálogo); "← Lista" → barra "Alumno activo"
  con "📋 Asignaciones" y "Cerrar sesión"; el botón vuelve a sus asignaciones. Sin asignaciones modificadas.
- **Commit:** `0948a82` (subido). Falta: uso real con un estudiante.

### CE. Lector — afinador sencillo
*Origen: pedido del PO (2026-10-19): "agrega un afinador sencillo para lector tabs; dependiendo del instrumento en que
esté la partitura, abro el afinador, muestra las cuerdas del instrumento, y si toco una cuerda empieza a sonar ella
indefinidamente hasta que cambio de cuerda o salgo del afinador".*
- **Auditoría (2026-10-19):** el Lector reconoce el instrumento de la partitura con `detectarInstrumento` (datos del
  MusicXML: sonido / nombre del instrumento / 4 líneas) → `currentInstrument` = guitarra, ukelele o bajo (los tres en
  uso; el letrero de la izquierda lo muestra). La afinación es la **estándar fija** (`TUNING`; no se leen afinaciones
  especiales del archivo). Hay **capo** por partitura (`capoFret`, guitarra y ukelele). El sonido ya existe: el de
  cada instrumento (`guitarSF`, soundfont precargado; reemplazo Karplus-Strong si no cargó) por `masterBus`.
- **DECISIÓN del PO (2026-10-19):** botón **🎚️ Afinar** en la barra de controles (profe y estudiantes) que abre el
  afinador con las cuerdas del instrumento de la partitura; nombres **solo Do-Re-Mi** (número de cuerda + nota);
  sonido = la **cuerda del instrumento pulsada de nuevo** cada ~1,5 s mientras esté elegida; **con capo**, cada cuerda
  suena subida según el traste del capo. Criterio de Claude (sin pregunta): al abrir se pausa la reproducción; tocar
  la misma cuerda la apaga; teclas 1–6 eligen cuerda y Esc / ✕ / clic fuera cierran (y callan).
- **Alcance:** solo `tabs/index.html`; sin cambios en Supabase.
- **Implementación (2026-10-19):** botón `#btnAfinar` en la barra (oculto sin reservar otro lugar mientras no hay
  partitura, se muestra con el letrero del instrumento); ventana `#modalAfinador` con una fila por cuerda (número,
  nota en Do-Re-Mi y una línea más gruesa en las graves); `afiTocar` pulsa la cuerda con `guitarSF` (o el sonido de
  reemplazo) cada 1,6 s; `afiCallar` corta el sonido al cambiar o cerrar. El teclado queda solo para el afinador
  mientras está abierto.
- **Prueba (local):** partitura de guitarra con capo 2 → "Con capo en el traste 2", notas Fa♯ Do♯ La Mi Si Fa♯; la
  cuerda 6 suena repetida; tecla 2 cambia a la cuerda 2, otra vez 2 la calla; Esc cierra y corta el sonido. Sin capo:
  Mi Si Sol Re La Mi.
- **Commit:** `d09a53d` (subido). Falta: uso en clase.

### CF. Entrenador — una tablatura abre el Lector
*Origen: pedido del PO (2026-10-19): el Taller de Cuerdas es una instancia como todas, pero su repertorio debería abrir
el Lector de tablaturas; "algo raro pasa".*
- **Auditoría (2026-10-19):** la sesión del curso "Cuerdas 2026" tiene una canción ("Iniciación del Taller de Cuerdas")
  con 18 tablaturas de ukelele. Desde el Plan (🎵) o la Biblioteca se abre en el Entrenador, que lista las tablaturas
  como recursos; al cargar una, `entCargarAsset` cae en el caso genérico "archivo en Storage" y pone el `.mxl`
  (zip) dentro de un cuadro: el navegador lo **descarga** o deja la pantalla en blanco. Solo la ficha de la Biblioteca
  (doble clic) abre el Lector, y en una pestaña suelta del navegador. Nada en el código trata distinto a Cuerdas: el
  problema es de **toda** tablatura en el Entrenador.
- **DECISIÓN del PO (2026-10-19):** una tablatura en el Entrenador abre el **Lector en esa partitura**, en una
  **pestaña del Workspace**.
- **Alcance:** solo `REPERTORIO/index.html`; sin cambios en Supabase ni en el Lector (ya acepta `?storage=&nombre=&seccion=`).
- **Criterio de Claude:** el Entrenador muestra en su lugar un cuadro con el nombre de la tablatura, botón
  **🎸 Abrir en el Lector** y un botón por cada parte (sección); al elegirla en el desplegable de recursos se abre sola
  (al abrir la canción no, para no abrir pestañas sin pedirlas). Dentro del Workspace = pestaña propia por partitura
  (clave `lector:<id>`, se enfoca si ya está); fuera del Workspace o dentro del Entrenador mínimo del Plan = pestaña del
  navegador.
- **Implementación (2026-10-19):** en `entCargarAsset`, rama nueva para `tipo === 'tab'` → `entRenderTab` (cuadro 🎸 con
  nombre de cortesía, botón al Lector y botones por parte) y, si la eligió el profe, `entAbrirTabEnLector`, que pide al
  Workspace `ws-abrir` con `../tabs/index.html?storage=&nombre=[&seccion=]` (fuera del Workspace, `window.open`).
- **Prueba (local, Workspace):** Entrenador en "Cuerdas 2026" → cuadro de la tablatura (ya no descarga el `.mxl`);
  "Abrir en el Lector" abre la pestaña 🎸 con la partitura de ukelele cargada; elegir otra en el desplegable abre su
  pestaña sola; botón de una parte abre el Lector con `&seccion=`. Sin errores en la consola.
- **Commit:** `88b54f3` (subido). Falta: uso en el taller.

### CG. Modo Clase — "Traer la clase aquí" (misma clase en curso en otro equipo)
*Origen: bug reportado por el PO (2026-10-19): con la clase de Tercero en curso (comenzada en otro equipo), el
Planificador de este equipo mostraba "▶ Comenzar clase" en esa misma clase.*
- **Auditoría (2026-10-19):** `renderClase` (`PORTAL/index.html`) solo muestra "⏹ Terminar clase" si la clase en curso
  es de **este** computador (`ClaseVivo.enCurso().aqui`); la misma clase comenzada en otro equipo cae en el caso "otra
  clase" y dice "Comenzar clase". Apretarlo ("Terminarla y comenzar esta") deja **dos equipos con la misma clase en
  curso**: `leerRemota` solo suelta la clase local si la de internet es de **otra** sesión. `clase_en_curso` no guarda
  qué equipo la tiene.
- **DECISIÓN del PO (2026-10-19):** en la misma clase, este equipo dice **"En curso en otro equipo"** con un botón
  **"Traer la clase aquí"**: la clase pasa a este equipo con la **misma hora de inicio** y el otro la **suelta sin
  duplicar tiempos**.
- **Alcance:** `comun/clase-vivo.js` y `PORTAL/index.html`; sin cambios en Supabase.
- **Criterio de Claude:** cada equipo recuerda la hora (`updated_at`) de su última publicación de la fila; si la fila
  de la misma clase cambia a una hora que no es la suya, otro equipo la trajo → la suelta (sin registrar tiempos) y
  cierra su Pizarra. Traer abre la Pizarra aquí (como Comenzar) y no pide clave (no se pierde nada). El **tiempo
  perdido** anotado en el otro equipo no viaja (la fila no tiene dónde llevarlo sin cambiar Supabase).
- **Implementación (2026-10-19):** `ClaseVivo.traer()` copia la clase de internet como clase de este equipo (mismo
  `inicio`) y la publica; `publicar` guarda en `profe_clase_publicada_en` la hora de la fila propia; `leerRemota`, con
  la misma sesión y una fila más nueva que la propia, suelta la clase local (sin `clase_tiempos`) y ordena cerrar la
  Pizarra. Clases comenzadas antes de esta versión toman como propia la fila que ven. En el Planificador, `renderClase`
  muestra "En curso en otro equipo" + "⇄ Traer la clase aquí" (`traerClase`: abre la Pizarra y trae).
- **Prueba:** simulación de dos equipos con base falsa (Node): B ve la clase de A, la trae (mismo inicio), A la suelta
  y cierra su Pizarra sin registro, B sigue con ella y al terminar deja **un** registro con el inicio original y la
  fila de internet vacía. Planificador local con la clase real de Tercero en otro equipo: muestra "En curso en otro
  equipo" y el botón (sin apretarlo, para no mover la clase real). Sin errores nuevos en la consola.
- **Commit:** `6fede0a` (subido). Falta: probarlo con dos equipos reales.

### CH. Cajón peruano — animación que toca un MIDI (grave y agudo)
*Origen: pedido del PO (2026-10-19): "una animación de alguien tocando cajón peruano, y que yo pueda pasarle MIDIs y
que renderice los ritmos, básicamente dos notas: grave, agudo". Es el primer paso del **Cajón-instrumento** del
roadmap (§9, evolución del Entrenador de ritmos).*
- **Necesidad:** mostrar en clase (proyector) cómo suena y cómo se toca un ritmo de cajón, con los golpes graves y
  agudos a la vista, a la velocidad que el curso necesite.
- **Auditoría (2026-10-19):**
  - **Motor de ritmo** (`ritmo.js` + `ritmo-render.js`, raíz, **protegidos**): lee el texto de ritmo propio (no MIDI);
    ya tiene un golpe grave sintetizado (`programarGrave`, deuda BY) y un reloj único con `AudioContext`. No se
    modifica: se **copia la idea** del sonido y del reloj en el módulo nuevo.
  - **Metalófono**: lee MIDI con `@tonejs/midi` + Tone.js desde unpkg (no funciona sin internet) y valida con un lector
    propio de bytes. Para el cajón basta un lector propio pequeño (notas, tiempos, tempo): funciona sin internet.
  - **Biblioteca**: tipos de recurso fijos (`TIPOS_ASSET`: letra, audio, tab, metalofono, flauta, cifrado, ritmo); los
    MIDI del metalófono van al bucket `repertorio-assets`. Un tipo nuevo "cajón" toca la Biblioteca, el Entrenador,
    el Plan (🎹/🥁) y posiblemente una regla de la base: **se deja para un paso 2**.
  - **Nombre de carpeta:** `CAJON/` ya existe (generador de planificación) → el módulo nuevo no puede llamarse así.
- **PROPUESTA de Claude (paso 1):**
  - **Dónde vive:** módulo propio `CAJON-PERUANO/index.html` (un archivo), con pestaña 🪘 en el Workspace. Carga un
    MIDI desde el equipo (botón o arrastrar) o por `?midi=<url>&nombre=`. Paso 2 (aparte): recurso "Cajón" en la
    Biblioteca y en el Plan.
  - **Grave / agudo en el MIDI:** por altura de nota. Regla por defecto: si son notas de batería estándar (bombo 35/36 →
    grave; caja, tom, etc. → agudo); si no, la nota **más baja** del archivo = grave y las demás = agudo. Al cargar se
    listan las notas encontradas (cuántos golpes cada una) con un interruptor Grave/Agudo por nota; el ajuste se
    recuerda por archivo en el equipo.
  - **Animación:** SVG dibujado en el mismo archivo (sin librerías): una figura sentada sobre el cajón; **grave** = la
    mano golpea el centro de la cara (el cajón vibra, onda grande, color cálido); **agudo** = golpe en el borde de
    arriba (destello chico, color frío). Las manos se alternan en golpes seguidos. Abajo, una cinta con los golpes que
    vienen (fila grave / fila agudo) y la línea del "ahora".
  - **Sonido:** sintetizado (sin archivos): grave = golpe sordo tipo bombo; agudo = chasquido de madera ("slap"). La
    intensidad del MIDI cambia el volumen y el tamaño del golpe.
  - **Sincronía y tempo:** un solo reloj (`AudioContext`), sonido programado por adelantado y animación leyendo ese
    reloj (el mismo principio del motor de ritmo). Tempo = BPM del MIDI con − / + de 5 (y cambio en vivo sin
    perder el lugar); ▶ / ⏸ (pausa sigue desde donde quedó), ⏮ al inicio, 🔁 repetir.
  - **Pasos siguientes (DECISIÓN del PO, 2026-10-19):** en uno de los pasos, estos ritmos de cajón se **publican para
    los estudiantes**, que entran a ellos con un **código QR** (como el link del Metalófono alumno, `m/?a=&n=`). Orden
    propuesto: paso 2 = recurso "Cajón" en la Biblioteca y el Plan; paso 3 = versión estudiante + link permanente + QR.
- **DECISIÓN del PO (2026-10-19):** aprueba el paso 1 tal como está propuesto.
- **Implementación (2026-10-19):** `CAJON-PERUANO/index.html` (nuevo, un archivo): lector de MIDI propio (formatos 0 y 1,
  estado continuo, mapa de tempo, compás), regla grave/agudo (`mapaAutomatico`: batería estándar → bombo y toms de piso
  graves; si no, la nota más baja) con panel 🎚️ Notas por altura (`profe_cajon_mapa:<nombre>` en `localStorage`) y
  "Volver a la regla automática"; figura en SVG con brazos articulados (hombro → codo → mano), manos que se alternan en
  golpes seguidos (< 0,5 s) y una en cada mano en golpes simultáneos; efectos (onda naranja + cajón que vibra en el
  grave, destello celeste en el agudo, luces AGUDO / GRAVE); cinta con compases y tiempos. Sonido sintetizado; reloj
  único `AudioContext` con programación anticipada (120 ms); la animación descuenta la latencia de salida. Tempo − / +
  de 5 (30–300) en vivo sin perder el lugar, ▶ / ⏸ (Espacio), ⏮ (Inicio), 🔁 repetir (encendido), pantalla completa,
  arrastrar un MIDI, botón Ejemplo (MIDI armado en memoria) y `?midi=<url>&nombre=`. `PC/workspace.html`: app 🪘 Cajón
  en el menú ＋.
- **Prueba (local, puerto 8971):** MIDI de prueba hecho por Claude (formato 1, pista de tempo aparte, 90 BPM, 3/4, notas
  Do3/Do4 sin batería): 19 golpes, Do3 grave y Do4 agudo por la regla; los 19 sonidos de cada vuelta caen exactos
  (corcheas a 0,333 s) y la vuelta empalma; a 100 BPM pasan a 0,3 s; la pausa queda quieta y sigue desde el mismo punto;
  sin repetir se detiene al final y vuelve al inicio; Notas: pasar Do4 a grave da 19 graves, se guarda y "Volver a la
  regla" deja 9. Ejemplo (batería): bombo grave, caja aguda, 100 BPM. Archivo que no es MIDI: aviso "Ese archivo no es
  un MIDI.". Dentro del Workspace abre como pestaña 🪘 Cajón. Sin errores en la consola. Falta: escucharlo y verlo en el
  proyector (en el panel de pruebas la animación iba a pocos cuadros por segundo, el sonido no).
- **Commit:** `6f044da` (subido). Tarjeta en Notion: "Cajón peruano: animación que toca un MIDI" (Probar en clase).
  - **Alcance:** solo el archivo nuevo + la pestaña en `PC/workspace.html`. Sin cambios en Supabase, ni en el motor de
    ritmo, ni en los MIDI reales.

### CI. Planificación mensual para la UTP — integrar el generador `CAJON/` a Profe Apps
*Origen: pedido del PO (2026-10-20): "hay un planificador que está en una carpeta que se llama 'cajon'; quiero que
presentes una idea de cómo integrarlo de la mejor manera posible a profe-apps, considerando un flujo lógico". Se apoya
en la DECISIÓN 3c (CAJÓN entra a V1 como motor de planificación con formatos por escuela, partiendo por plantillas
predefinidas; el editor de plantillas por escuela es futuro, §8–§9). No confundir con `CAJON-PERUANO/` (deuda CH).*
- **Necesidad:** entregar cada mes a la UTP la planificación de cada curso en `.docx` sin escribir de cero lo que ya
  quedó registrado en Profe Apps (clases, actividades, objetivos, canciones, evaluaciones).
- **Auditoría (2026-10-20):**
  - **Qué es hoy:** `CAJON/generador-planificacion.html` (un archivo, 1.334 líneas; además 5 imágenes sueltas de
    bugs de otros módulos que no usa). **Nadie lo enlaza** (no está en el Workspace ni en ningún módulo). No usa
    Supabase ni `localStorage`: todo es a mano y se pierde al cerrar.
  - **Flujo actual (2 pasos):** (1) elegir curso (chips 1°–8° fijos, sin talleres), año y uno o varios meses, escribir
    un **relato** de lo trabajado y copiar un *prompt* para **NotebookLM** (con un formato fijo de etiquetas: EJE,
    OAT, 2 OA basales y 2 complementarios con número y texto, ACTITUD, META, DESEMPEÑOS, EVIDENCIAS, TIEMPO, RECURSOS,
    EVALUACIÓN); (2) pegar la respuesta de NotebookLM: la página la lee por etiquetas (con tolerancia a variantes y un
    restaurador de tildes), llena campos **ocultos** y muestra un informe de lo encontrado/faltante; "Generar" descarga
    el `.docx`. Los campos no se pueden revisar ni corregir en pantalla antes de descargar.
  - **El `.docx`:** librería `docx@7.8.2` desde jsdelivr (**sin internet no genera**). Carta apaisada, letra Aptos,
    cabecera con 2 logos (en base64 dentro del archivo) y "ESCUELA N°325 'SANTA JUANA DE LESTONNAC'"; hoja 1 =
    "PLANIFICACIÓN <año>" + tabla (Asignatura, Curso, Eje, **Docente fijo "Patricio Lastra"**, Mes, OAT, OA, Actitud);
    hoja 2 = tabla azul de 6 columnas (Meta/Núcleo · Desempeños/Escenario · Evidencias · Tiempo · Recursos ·
    Evaluación/Instrumento). Nombre del archivo: `CUARTO - ABRIL.docx`. Es **la plantilla de una escuela**, cableada.
  - **Qué ya existe en el ecosistema y podría tomar solo:**
    - **Curso:** `contextos` + `supabase/contextos.js` (ícono y nombre visible) y el protocolo `?ctx=` (hoy el generador
      repite la lista de cursos a mano).
    - **Clases del mes:** `sesiones` (contexto + fecha) — las fechas reales de cada clase.
    - **Actividades y objetivos:** `plan_cards` de cada sesión (título + texto; el párrafo "O:" es el objetivo de la
      actividad), con canciones/melodías/ritmos vinculados (`plan_cards.canciones`) y minutos del Tiempo libre.
    - **Lo que pasó de verdad:** la bitácora de cada clase (`memorias.contenido`, con apartados por actividad) y las
      notas de Cursos (`bitacora_paginas`).
    - **Evaluaciones del mes:** `libro_evaluaciones` (nombre, fecha y **OA original**) — alimentan "Evaluación /
      Instrumento" y dan OA ya escritos por el profe.
    - **Recursos:** materiales del curso (`materiales_contexto`) y los instrumentos de las canciones vinculadas.
    - **Lo que NO existe:** catálogo de OA/OAT/ejes del currículum de Música, ni "escuela" o "docente" como dato
      (DECISIÓN #10 los vuelve datos en V1). Eso hoy lo pone NotebookLM o el profe.
- **PROPUESTA de Claude (sin decisión del PO):**
  - **Flujo lógico para el profe:** Cursos (o el Plan) → **📄 Planificación del mes** → se abre una pestaña del
    Workspace con el curso y el mes ya puestos → la página arma sola el **resumen del mes** (clases con fecha,
    actividades con su objetivo "O:", canciones y recursos, evaluaciones con su OA, y lo esencial de la bitácora) →
    el profe lo revisa y agrega lo que quiera → copia el *prompt* para NotebookLM → pega la respuesta → **revisa y
    corrige los campos en pantalla** → descarga el `.docx` para la UTP.
  - **Paso 1 (acotado, útil ya; sin cambios en Supabase, solo lectura):**
    1. Mover el generador a una carpeta con nombre propio (`PLANIFICACION/index.html`; nadie lo enlaza, así que no
       rompe nada) y sumarlo al Workspace como pestaña **📄 Planificación** (menú ＋).
    2. Curso desde `contextos` (los cursos 1°–8°, con `?ctx=`) y mes(es) como hoy.
    3. Botón **"Traer lo del mes"**: llena el relato con el resumen del mes leído de Supabase (sesiones, `plan_cards`,
       canciones, `libro_evaluaciones`, bitácora), editable antes de copiar el *prompt*.
    4. Mostrar los campos que hoy están ocultos para revisarlos y corregirlos antes de generar.
    5. Botón "📄 Planificación del mes" en la página del curso en Cursos (abre la pestaña con ese curso).
  - **Paso 2:** guardar cada planificación generada (curso + mes) para reabrirla, corregirla y volver a descargarla
    sin pasar de nuevo por NotebookLM (requiere una tabla nueva → autorización de Supabase). Guardar la librería
    `docx` en `comun/` para que genere sin internet.
  - **Paso 3 (DECISIÓN 3c):** sacar lo cableado (escuela, logos, docente, orden de tablas) a una **plantilla**
    predefinida; la de la Escuela N°325 sería la primera. El editor de plantillas por escuela sigue siendo futuro.
  - **Alternativas:**
    - **A — solo trasladarlo** (pestaña del Workspace, sin leer datos): rápido, pero sigue pidiendo todo a mano.
    - **B — paso 1 propuesto** (pestaña + "Traer lo del mes" + campos visibles): **recomendada**; aprovecha lo que ya
      se registra y no toca Supabase.
    - **C — sin NotebookLM:** Profe Apps arma el `.docx` directo desde los datos más un catálogo propio de OA de
      Música por nivel. Más autónomo, pero exige cargar el currículum y redactar metas/evidencias a mano: después.
- **Comentarios del PO en Notion (2026-10-20) y ajuste de la propuesta:**
  1. *"Mis objetivos no son siempre los OA del currículum; habría que traducirlos a OA, parte del trabajo de la IA."*
     → Los objetivos "O:" van al resumen como **material**, y el pedido a la IA dice explícitamente que los traduzca a
     los OA del currículum del nivel.
  2. *"Las evaluaciones del Libro: no sé si sea necesario incluirlas."* → Fuera del paso 1 (se podrán sumar después
     como casilla opcional).
  3. *"Me gustaría integrar una IA (NotebookLM razona sobre un conjunto acotado de documentos: el currículum
     nacional), por API y gratis."* → **HECHO (búsqueda 2026-10-20):** NotebookLM no tiene una API pública anunciada
     por Google. **PROPUESTA:** usar la **API de Gemini en su plan gratis** (la misma familia que ya usaba SRP) y
     guardar en Profe Apps los **documentos del currículum de Música por nivel** (los mismos que el PO le da a
     NotebookLM); cada pedido envía solo el documento del nivel del curso + el resumen del mes, con la instrucción de
     responder solo con esos documentos. Efecto parecido a NotebookLM, costo cero. Cuidados: (a) en el plan gratis
     Google puede usar lo enviado para mejorar sus productos → **no enviar nombres de estudiantes** (el resumen se
     muestra y se revisa antes de enviar); (b) la llave de la API la pega el profe una vez en su equipo, **nunca en el
     repo** (es público); (c) límites diarios bajos, pero sobran para ~15 planificaciones al mes; (d) sin internet no
     hay IA (se mantiene copiar/pegar como respaldo).
  - **Pasos ajustados:** **Paso 1** = pestaña 📄 Planificación + "Traer lo del mes" (clases, actividades con su "O:",
    canciones/recursos, bitácora; sin evaluaciones) + campos visibles + copiar/pegar a NotebookLM como hoy.
    **Paso 2** = botón **✨ Generar con IA** (Gemini gratis + currículum guardado) que llena los campos solo.
    **Paso 3** = guardar las planificaciones (tabla nueva, con autorización). **Paso 4** = plantilla por escuela (3c).
    Para el paso 2 el PO debe entregar los documentos del currículum que usa en NotebookLM.
- **DECISIÓN del PO (2026-10-20):** aprueba el **paso 1 ajustado**; los documentos del currículum para el paso 2 los
  entrega después.
- **Implementación (2026-10-20):** `CAJON/generador-planificacion.html` → **`PLANIFICACION/index.html`** (`git mv`; las
  imágenes sueltas de `CAJON/` quedan donde están). En la página: título "📄 Planificación del mes"; curso por `?ctx=`
  (1°–8°, mapa `CURSO_CTX`) o por `ws-ir` { ctx } si la pestaña ya está abierta; mes y año actuales al abrir; botón
  **📥 Traer lo del mes** (solo lectura: `contextos` → `sesiones` del curso en los meses marcados con `memorias` y
  `plan_cards` embebidas → nombres de `repertorio_canciones` / `repertorio_assets` con `nombreAsset`), que arma el
  relato por clase (fecha, actividad, "Objetivo:" por cada párrafo "O:", resto del texto, canciones y recursos,
  bitácora en una línea; formato por bloques pasado a texto simple), pide confirmar si ya había relato y avisa
  "Revisa que no queden nombres de estudiantes antes de copiar"; el *prompt* pide traducir los objetivos del profe a
  OA del currículum del nivel; los campos del `.docx` quedan **visibles** ("Revisa y corrige antes de descargar").
  Sin evaluaciones del Libro. `PC/workspace.html`: app 📄 Planificación en el menú ＋. `CURSOS/index.html`: botón
  "📄 Planificación del mes" en la barra (espacio reservado; visible solo en 1°–8° y dentro del Workspace) que abre o
  enfoca la pestaña en ese curso.
- **Prueba (local, puerto 8971):** Cuarto, octubre 2026: "Traer lo del mes" arma 3 clases (dos solo con bitácora y una
  con la actividad "Montaje: Anacleto", sus 3 objetivos, el texto y sus canciones/recursos con nombre de cortesía).
  **Se confirmó que la bitácora trae nombres de estudiantes**: el aviso es necesario (y lo será más en el paso 2).
  Pegar una respuesta llena los campos visibles y el informe marca lo que falta. En el Workspace: el botón de Cursos
  abre la pestaña en Quinto; con la pestaña abierta, desde Octavo la cambia a Octavo sin abrir otra; en General el
  botón no se ve; el menú ＋ muestra 📄 Planificación. Sin errores en la consola. No se probó la descarga del `.docx`
  (código sin cambios).
- **Commit:** `7d46110` (subido). Tarjeta en Notion: "Planificación del mes para la UTP — deuda CI" (Probar en clase).
  - **Alcance:** solo lectura de Supabase; sin tablas nuevas. Paso 2 (✨ Generar con IA) espera los documentos del
    currículum del PO.
- **Currículum para el paso 2 (2026-10-20, pedido del PO):** en vez de esperar sus documentos, el PO pidió buscar los
  oficiales y extraer ejes, OA, OAT y actitudes por curso. Quedan en **`PLANIFICACION/curriculo/`**: `musica-1.txt` …
  `musica-8.txt` (ejes, OA numerados por eje y actitudes del nivel) y `oat-1a6.txt` / `oat-7a8.txt` (OAT por dimensión,
  comunes a todas las asignaturas de cada ciclo; los de 7°–8° no vienen numerados en el original y se numeraron por
  orden). Fuentes (curriculumnacional.cl): Programas de Estudio de Música 1° a 8° (`articles-20704/20705/20708/20709/
  20710/20711/20712/34941_programa.pdf`), Bases Curriculares 1° a 6° (`articles-22394_bases.pdf`) y 7° a 2° medio
  (`articles-37136_bases.pdf`). Los OA de 7° y 8° se tomaron de las **Bases** (el programa de 7° trae en su anexo los
  OA de 8° y se mezclaban); el reparto por eje se confirmó por la posición de los títulos en la página. Texto literal
  salvo dos erratas del original corregidas ("tocan" → "tocar" en 4° OA 4; "Gofré" → "Grofé" en 3° OA 3) y la
  descripción de los ejes, que es un resumen propio. No se guardaron los PDF.
- **DECISIÓN del PO (2026-10-20) — paso 2:** botón **"✨ Generar"** (sin "con IA", con las estrellas) que usa **Gemini en
  su plan gratis** y el currículum guardado.
- **Implementación paso 2 (2026-10-20):** `PLANIFICACION/index.html`: bajo el relato, **✨ Generar** (principal) junto a
  "Copiar prompt para NotebookLM" (queda de respaldo) y 🔑 para cambiar la llave. Al generar: (1) **oculta nombres de
  estudiantes**: toda palabra del relato que sea nombre, apellido o nombre social de algún estudiante del Libro
  (`libro_estudiantes`, ≥ 3 letras, sin tildes) pasa a `[estudiante]`; si no se puede leer la lista, **no se envía
  nada**; (2) lee `curriculo/musica-<nivel>.txt` y el OAT del ciclo; (3) arma el mismo pedido de NotebookLM
  (`armarPrompt`, ahora compartido) precedido de la instrucción de usar solo esos documentos y copiar números y textos
  tal cual (2 OA basales, 2 complementarios, OAT física y sociocultural, una actitud); (4) llama a Gemini
  (`gemini-2.5-flash` → `-flash-lite` → `flash-latest` → `2.0-flash`; pasa al siguiente si uno no está o no tiene cuota),
  con la llave en la cabecera, nunca en la dirección; (5) deja la respuesta en el cuadro de pegado y llena los campos
  con la misma lectura que NotebookLM (`procesarRespuesta`, antes dentro del evento de pegar). La llave queda solo en el
  equipo (`localStorage.gemini_api_key`, la misma clave que usaban SRP y ANALIZADOR); se pide con un cuadro la primera
  vez. Mensajes claros para llave mala, sin cuota, sin conexión y currículum no disponible (en `file://` no se lee).
- **Prueba (local, puerto 8971, Gemini simulado: no hay llave en este equipo):** Cuarto, octubre: el texto enviado no
  lleva "Javier" ni "Muñoz" (5 nombres ocultos, Victoria incluida), sí lleva el currículum de 4° y los OAT; el primer
  modelo respondió "sin cuota" y pasó al segundo; la respuesta llenó los campos (OA 4, actitud, desempeños) y el aviso
  dijo cuántos nombres se ocultaron. Llave mala, sin cuota y sin relato dan su aviso. Botones en una fila, sin
  desplazamiento lateral. **Falta: probarlo con la llave real del PO.** Ojo: como se tapa todo apellido del Libro,
  palabras comunes que también son apellidos (Paz, Reyes, Campos, Ríos, Victoria…) pueden salir como `[estudiante]`.
- **Commit paso 2:** `0078958` (subido). Currículum: `0cc4b41`.
- **Validación del PO (2026-10-20):** probó ✨ Generar con su llave real: funciona.
- **DECISIÓN del PO (2026-10-20) — ajuste del paso 2:** (1) **vista previa de lo que se envía**: al apretar ✨ Generar
  se muestra el relato con lo tapado resaltado; un clic destapa lo que no era nombre o tapa lo que se escapó; las
  palabras corregidas se recuerdan en el equipo; se envía solo al confirmar. (2) El filtro usa **solo los estudiantes
  del curso** que se planifica.
- **Implementación del ajuste (2026-10-20):** `PLANIFICACION/index.html`. `nombresDelCurso` reemplaza a
  `ocultarNombres`: lee la matrícula del curso (`libro_matriculas` del año elegido —o el activo si ese año no existe—,
  activos y retirados) y solo esos `libro_estudiantes`; si algo falla, no se envía nada. `vistaPrevia` abre un cuadro
  con el relato y lo tapado en oscuro; un clic en cualquier palabra la tapa o la destapa en todo el texto; "✨ Enviar"
  manda el texto con `[estudiante]` y guarda las correcciones en el equipo (`profe_plani_no_tapar` /
  `profe_plani_tapar`: lo destapado nunca se vuelve a tapar y lo tapado a mano se tapa siempre); "Cancelar" no envía
  nada. Si el curso no tiene lista en el Libro, la vista previa lo avisa para revisar a mano.
- **Prueba (local, Gemini simulado):** Cuarto, octubre: 52 palabras-nombre del curso (Octavo tiene otras 30, sin
  "Javier"); la vista previa tapó 5; destapar "Victoria" y tapar "Anacleto" cambió todas sus apariciones, lo enviado
  llevó Victoria y no llevó Anacleto ni Javier, y ambas correcciones quedaron guardadas. Con "Paz" en el relato ya no
  se tapa (nadie de Cuarto se llama así). Cancelar: Gemini no se llama y el aviso dice "No se envió nada".
- **Commit del ajuste:** `04c2866` (subido).
- **DECISIÓN del PO (2026-10-20) — paso 3:** aprueba la tabla nueva **`planificaciones`** (una por curso + año + meses,
  con el relato y los campos del `.docx`; `supabase/planificaciones.sql`) **guardando también el relato**. Se guarda
  sola (al generar, al pegar y al corregir), se abre sola al elegir curso y mes ("Guardada el …" + "Empezar de nuevo")
  y un menú 📂 Guardadas lista las del curso.
- **Implementación paso 3 (2026-10-20):** `supabase/planificaciones.sql` (aditiva e idempotente; **la corrió el PO** el
  mismo día). `PLANIFICACION/index.html`: fila bajo los meses con **📂 Guardadas** (las del curso, por año y meses),
  el estado ("Sin guardar todavía." / "✓ Guardada 20/10" / "Guardada el 20/10") y **Empezar de nuevo** (espacio
  reservado; pide confirmar, borra la fila y deja la página en blanco). Guarda solo (`upsert` por
  `contexto_id, anio, meses`) 1,5 s después de corregir el relato o un campo, y al instante tras "Traer lo del mes",
  pegar la respuesta o ✨ Generar; no guarda una página vacía. Al cambiar curso, año o meses guarda lo pendiente,
  deja la página en blanco y abre lo guardado de la nueva combinación. Guarda también al salir de la pestaña y al
  cerrarla en el Workspace (`guardarAlCerrar` en la app 📄 y en el botón de Cursos). Sin la tabla o sin conexión, la
  página sigue igual y lo avisa.
- **Prueba (local, año ficticio 2099, Quinto):** sin la tabla avisaba "falta crear la tabla"; con la tabla: escribir
  relato y eje → "✓ Guardada 20/10" y la fila en Supabase; 📂 Guardadas (1) "Octubre 2099"; noviembre abre en blanco;
  elegir "Octubre 2099" en el menú vuelve a abrirla; al recargar la página se abre sola; Empezar de nuevo la borra
  (0 filas en 2099) y deja la página en blanco. Datos de prueba borrados.
- **Commit paso 3:** `a84021e` (subido). Falta: uso real. Sigue (cuando el PO decida): paso 4, plantilla por escuela.
- **DECISIÓN del PO (2026-10-20) — elegir qué va al Word:** (1) todos los cuadros de texto crecen hasta mostrar todo su
  contenido (ni más chicos ni más grandes); (2) cada OAT, OA basal, OA complementario y actitud lleva una **casilla**:
  Gemini propone más opciones (3 basales, 3 complementarios, 2 OAT por dimensión, 2 actitudes) y **todas parten
  desmarcadas**: el profe elige; (3) en la tabla de planificación las 6 columnas van siempre, pero cada párrafo es un
  **ítem numerado con casilla** y al desmarcar se **renumera** (también en el Word); (4) Recursos, uno por línea;
  (5) un grupo sin nada marcado sale en el Word con su título y "—". Lo elegido queda guardado con la planificación.
- **Implementación (2026-10-20):** `PLANIFICACION/index.html`. Los campos fijos se reemplazan por un **modelo**
  (`P = { v: 2, eje, g: { grupo: [{ txt, num?, on }] } }`, grupos `oat_fisica`, `oat_socio`, `basal`, `comp`, `actitud`,
  `meta`, `desempenos`, `evidencias`, `tiempo`, `recursos`, `evaluacion`) que se pinta como ítems: casilla, número de
  OA (basales y complementarios), número de ítem (tabla: solo los marcados y con texto, de corrido), cuadro de texto,
  ✕ quitar y "＋ agregar / ＋ ítem". Objetivos y actitudes parten **desmarcados**; ítems de la tabla, marcados.
  Todos los cuadros (`textarea.auto`, también el eje, el relato y el cuadro de pegado) se ajustan a su contenido al
  pintar, al escribir y al cambiar el ancho. El pedido (`FORMATO_FIJO`) pide `OAT_FISICA_1/2`, `OAT_SOCIO_1/2`,
  `OA_BASAL_1..3`, `OA_COMP_1..3`, `ACTITUD_1/2` y Meta/Recursos con un ítem por línea; la lectura (`parsearTexto` →
  `modeloDesdeBloques`) acepta también el formato anterior (una etiqueta sin número; recursos separados por comas).
  Word: "Etiqueta: texto" por cada objetivo marcado y "Etiqueta: —" si no hay ninguno (OA: "—"); tabla con
  "1. …", "2. …" de lo marcado y "—" en una columna vacía. Se guarda `P` en `planificaciones.campos` (las guardadas
  antes se convierten al abrirlas). Sin cambios en Supabase.
- **Prueba (local, año 2099, Cuarto; respuesta de ejemplo):** 2 + 2 OAT, 3 + 3 OA y 2 actitudes, todos desmarcados;
  desempeños y recursos numerados 1–3; ningún cuadro con texto escondido. Marcando OAT física 2, OA basal 4 y 6 y la
  actitud 2, y desmarcando el desempeño 2 y todos los recursos: el Word dice "OAT Dimensión Física: 2. …",
  "OAT Dimensión Sociocultural: —", "OA Basal 4: …", "OA Basal 6: …", complementarios "—", la actitud elegida,
  desempeños "1. Revisan…", "2. Montaje grupal" y Recursos "—". Al recargar, las casillas siguen como quedaron.
  Datos de prueba borrados.
- **Commit:** `431f407` (subido). Falta: uso real.
- **Validación del PO (2026-10-20):** generó la primera planificación real: "está bien".
- **DECISIÓN del PO (2026-10-20) — viñetas y apartado Planificaciones:** (1) la tabla de planificación usa **viñetas**
  en vez de números (en pantalla y en el Word), salvo **Tiempo**, que va con el texto solo; (2) apartado
  **📚 Planificaciones** dentro de la misma pestaña, con selector "📚 Planificaciones | ✏️ Editar", y es la **primera
  pantalla**: una tabla con los cursos 1° a 8° como filas y marzo a diciembre como columnas, **solo del año en
  curso**; en cada cruce, **Visualizar** (solo lo marcado, en formato simple, con "✏️ Editar") y **Descargar** (el
  Word institucional); una planificación de varios meses aparece en cada uno de sus meses con el aviso "Abr–May";
  una celda vacía lleva "＋ Crear", que abre el editor en ese curso y mes. Desde el botón de Cursos (trae el curso)
  se abre directo el editor. **Deuda (PO):** un archivo con las planificaciones de años anteriores.
- **Implementación (2026-10-20):** `PLANIFICACION/index.html`. Viñetas "•" en la tabla (pantalla y Word) y Tiempo sin
  marca. Encabezado con "📚 Planificaciones | ✏️ Editar" (`mostrarVista`); sin `?ctx` abre la tabla, con `?ctx` o
  `ws-ir` (botón de Cursos) el editor. La tabla (`cargarPlanis` / `pintarPlanis`) lee `planificaciones` del año en
  curso: filas 1° a 8°, columnas Mar–Dic (el mes actual resaltado); en cada cruce 👁 / ⬇ por cada planificación que
  incluye ese mes (si se cruzan dos, se ven las dos; las de varios meses llevan "Abr–May"); sin planificación, "＋"
  (abre el editor en ese curso y mes del año en curso). **Visualizar** (`verPlani`): ventana con solo lo marcado
  (eje, OAT, OA con su número, actitud, tabla con viñetas, Tiempo sin marca) y botones ✏️ Editar / ⬇ Descargar.
  **Descargar** usa el mismo Word institucional (`generarDoc(null, { modelo, curso, mes, anio })`), sin pasar por
  el editor. **Corrección:** si se cambiaba de curso o mes antes de 1,5 s, lo último escrito no se guardaba
  (`guardarAhora` comparaba con la clave nueva); ahora guarda bajo la clave que estaba en pantalla (`claveVistaObj`).
- **Prueba (local):** la tabla mostró las dos planificaciones reales de Cuarto que el PO estaba armando (octubre, y
  octubre + noviembre: en octubre se ven las dos, en noviembre "Oct–Nov"); Visualizar y Descargar (solo lectura)
  dieron "Cuarto básico · Octubre 2026", `CUARTO - OCTUBRE.docx`, Tiempo "90 minutos por sesión." sin marca y
  Recursos "• PowerPoint"…; una fila simulada de abril–mayo (sin guardar) se vio en las dos celdas con "Abr–May";
  "＋" de Quinto noviembre abrió el editor en Quinto, Noviembre 2026 sin guardar nada. Corrección: escribir y
  cambiar de mes al tiro dejó lo escrito guardado en el mes anterior (año 2099, borrado).
- **Commit:** `ffb024e` (subido). Falta: uso real. Deudas: archivo de años anteriores; plantilla por escuela.
- **Corrección (PO, 2026-10-20):** al pasar de 📚 Planificaciones a ✏️ Editar aparecía la barra de desplazamiento y
  todo se corría (regla 8b). `html { scrollbar-gutter: stable; }` reserva siempre su espacio; verificado: el
  selector queda en el mismo lugar en ambas vistas.
- **DECISIÓN del PO (2026-10-20):** el botón del editor **solo guarda**; el Word se descarga desde 📚 Planificaciones.
  Hecho: "Generar planificación .docx" → **"💾 Guardar planificación"** (`guardarDesdeBoton`: guarda al instante y
  dice "✓ Guardada. Descárgala desde 📚 Planificaciones."; avisa si no hay curso/mes o nada que guardar); la columna
  pasa a "Revisa y guarda la planificación". Probado (año 2099, borrado): guarda y no descarga nada.
- **Ajuste (PO, 2026-10-21):** el texto largo que devuelve Gemini **no se muestra**; en "Revisa y guarda la planificación"
  queda solo el informe (✓ Formato correcto…). El cuadro para pegar desde NotebookLM sigue como respaldo, plegado en
  "📋 Pegar desde NotebookLM (respaldo)" (`<details id="pasteWrap">`; al abrirlo toma el alto de su texto). Probado
  (local, Cuarto): plegado al abrir la página, el cuadro no se ve y el informe aparece igual al procesar una respuesta.
  Commit `138e47f` (subido).
- **Ajuste (PO, 2026-10-21):** al guardar con "💾 Guardar planificación", la página **vuelve a 📚 Planificaciones** y la
  recién guardada se destaca unos segundos (brillo verde y "✓ Nueva" encima de su celda, sin correr la tabla; se
  desvanece solo). `recienGuardada` = { curso, año, meses } se marca en `pintarPlanis` una sola vez y la tabla se
  desplaza hasta ella. Probado (local): guardar una de prueba en 8° diciembre volvió a la tabla con "✓ Nueva" en esa
  celda; la prueba se borró.
  Commit `b85475e` (subido).
- **Ajuste (PO, 2026-10-21): ejes solo con su nombre y a elección.** Los ejes de Música son 3 e iguales de 1° a 8°
  (Escuchar y apreciar · Interpretar y crear · Reflexionar y contextualizar). El cuadro Eje pasa de texto libre a **3
  casillas** con solo el nombre; lo marcado se guarda como antes (`campos.eje`, nombres separados por "; "), así el Word y
  Visualizar no cambian. A Gemini se le pide solo el nombre de el o los ejes, sin definiciones; si igual las manda (o en
  planificaciones guardadas con definiciones), `ejesDe` deja solo los nombres reconocidos (sin reconocer ninguno, deja el
  texto tal cual). Probado (local, sin guardar): un eje con definición quedó en su nombre; marcar/desmarcar cambia el
  eje; las planificaciones guardadas de Cuarto no se tocaron.
  Commit `022e8e6` (subido).
- **Ajuste (PO, 2026-10-21): el año no se elige.** Se planifica siempre para el año en ejercicio: el campo Año queda solo
  para mirar (`readonly`, sin borde, no recibe foco); lo pone la página (año en curso) y solo cambia al abrir una
  planificación guardada de otro año desde 📂 Guardadas.
  Commit `6c74a8b` (subido).
- **Ajuste (PO, 2026-10-21): planificaciones de varios meses en una sola celda.** En 📚 Planificaciones, una
  planificación de meses seguidos (p. ej. Oct–Nov) se muestra **una sola vez**, en una celda combinada a lo ancho de sus
  meses (con su rango y un fondo suave), para que no parezcan dos documentos. Si en alguno de esos meses el curso tiene
  otra planificación, se mantiene la vista por mes (no se pueden superponer). Probado (local, datos reales): 4° Oct–Nov,
  5° y 8° Sep–Oct quedan en una celda de 2 meses; las demás filas siguen con una celda por mes.
  Commit `a9a2117` (subido).
- **Ajuste (PO, 2026-10-21): nunca dos planificaciones del mismo curso en un mismo mes.** Causa: cada combinación de
  meses es una planificación distinta y se guarda sola; si se escribe con Octubre marcado y luego se agrega Noviembre,
  quedan "Octubre" y "Octubre y Noviembre". (Al revisar, hoy no hay ninguna repetida.) **DECISIÓN del PO** (aprueba los
  4 cambios propuestos): (1) **regla:** cada mes de un curso pertenece a una sola planificación en el año; (2) cambiar
  los meses de una planificación abierta **le cambia los meses a esa misma** (no crea otra); (3) si los meses elegidos
  ya están en otra planificación, **aviso** "Octubre ya está en la planificación Oct–Nov de 4°" con **Abrir esa**, y no
  se guarda nada mientras tanto; (4) **🗑 Eliminar** en la ventana de Visualizar.
  - **Implementación:** `plId` = la planificación en pantalla; se guarda por su id (antes, por curso + año + meses).
    `alCambiarClave({ mover })`: solo el cambio de meses marcados "mueve" (el curso, el año, 📂 Guardadas, la tabla y
    "Abrir esa" abren). Antes de abrir o mover se leen las planificaciones del curso en el año (`planisDelCurso`): si los
    meses chocan con otra, `bloqueo` + aviso "Mayo ya está en otra planificación de Primero básico (Mayo). Ábrela o
    cambia los meses." con **Abrir esa** (espacio reservado bajo 📂 Guardadas, regla 8b); `guardarAhora` y el botón 💾 no
    guardan mientras haya bloqueo. "Empezar de nuevo" borra por id. Visualizar suma **🗑 Eliminar** (confirma, borra por
    id y redibuja la tabla).
  - **Prueba (local, 1° marzo–mayo 2026, borradas al final):** escribir en Marzo la guardó; marcar Abril dejó **una sola**
    "3,4" (la misma, sin duplicar); con otra de Mayo creada aparte, marcar Mayo mostró el aviso y no cambió nada en la
    base ("3,4" y "5" intactas); "Abrir esa" abrió la de Mayo y quitó el aviso; 🗑 Eliminar desde Visualizar borró las
    dos (0 restantes) y cerró la ventana.
  - **Commit:** `4c207c5` (subido).
- **Ajuste (PO, 2026-10-21): nombre e ícono.** La pestaña del Workspace se llama **"Planificaciones"** y usa el ícono
  **🗓️** (elegido por el PO entre 🗓️ / 🗂️ / 📋 / 📑), el mismo del botón de la página (antes 📚, que es el de la
  Biblioteca) y del botón "🗓️ Planificación del mes" de Cursos.

### CJ. Bitácora — Cuaderno de música del curso (1° a 8°)
*Origen: pedido del PO (2026-10-21): "un registro de lo que se escribe en el cuaderno (físico) de la clase de música,
para cada curso, de 1ro a 8vo; mostrar un cuaderno que tenga tapas de color rosado, de manera vertical, y que se pueda
navegar por él; ahí consta la fecha, lo escrito, las imágenes coloreadas que se hayan trabajado".*
- **Necesidad:** que los niños vean qué trabajo tienen (o deberían tener) en su cuaderno; registro del profe y para la
  UTP; revisar cuadernos. Es parte de la bitácora: se anota también *después* de la clase lo que se hizo en el cuaderno.
- **Auditoría (2026-10-21):**
  - **Cursos** (`CURSOS/index.html`): histórico del curso en una página; barra superior con 📄 Planificación del mes
    (solo 1°–8°, espacio reservado). Ahí cabe un botón 📔 Cuaderno con la misma regla.
  - **Planificador** (`PORTAL/index.html`): barra de la sesión con ✍🏼 Bitácora (`abrirMemoria`, ventana `#mem-modal`).
    El cuaderno se abre desde la barra y desde la ventana de la bitácora.
  - **Editor por bloques** (`comun/editor-bloques.js`): no maneja imágenes; sirve para los textos de la hoja (mismo
    formato y 3 colores). Las imágenes van como piezas aparte de la hoja.
  - **Letras**: `comun/fuentes/` ya tiene ligada (Playwrite CL) e imprenta (Andika), sin internet (deuda BL).
  - **Supabase:** no hay tabla ni lugar para imágenes de este tipo; los buckets existentes son de la Biblioteca y de
    los audios de la bitácora → tabla y bucket nuevos (aditivo).
- **DECISIÓN del PO (2026-10-21), paso 1:**
  - Un **cuaderno rosado por curso (1° a 8°) y por año**; tapa con curso, año y "Música". Los de años anteriores quedan.
  - **Hojas libres** con fecha (no atadas a una clase): si nace del Plan o de la bitácora de una clase, parte con la
    fecha de esa clase y se puede cambiar; se ordenan por fecha.
  - Cada hoja: **texto** (letra ligada o imprenta, a elección, recordada por curso) e **imágenes** coloreadas, entre el
    texto (chica, mediana, grande) o a hoja completa. **Tipo de hoja** con interruptor: lisa / líneas / cuadros (sin
    pentagrama). Cada hoja tiene **su orientación** (vertical u horizontal), como el cuaderno real escrito girado.
  - **Cuatro formas de verlo:** (1) cerrado y vertical; (2) abierto y vertical, las dos páginas; (3) abierto y vertical,
    una página; (4) abierto y horizontal, una página. La hoja se ve como en el cuaderno físico: una horizontal en las
    formas 1–3 se ve de lado y en la 4 derecha (y al revés). Aviso "↻ Girar para leer" que cambia de forma.
  - **Mostrar/ocultar espirales.** **Pasar la hoja** lo más real posible: arrastrar la esquina (la hoja sigue al
    dedo/mouse y vuelve si se suelta a medias), clic en el borde, ← →, deslizar; sonido suave de papel (apagable);
    índice por fecha que salta pasando las hojas rápido.
  - **Zoom en la forma 3:** rueda, pellizco o + / −, siempre con la hoja centrada; con zoom se puede arrastrar para mirar
    un rincón y vuelve sola al centro al soltar; doble clic o ⟲ = tamaño normal; el zoom se mantiene al pasar de hoja.
  - **Dónde:** se arma en el **Plan** y en la **bitácora** de la clase; en **Cursos** se ve (solo lectura, con ✏️ por
    hoja). Paso 2: la Pizarra (📔 con la clase en curso, hojeando todo el cuaderno). Paso 3: celular, si se quiere.
- **Implementación (2026-10-21):** pieza compartida **`comun/cuaderno.js`** (`Cuaderno.abrir({ sb, contextoId, ctxNombre,
  anio, fecha, sesionId, crear })`) + `comun/cuaderno.css`; tabla `cuaderno_hojas` y bucket público `cuaderno-imagenes`
  en **`supabase/cuaderno.sql`** (aditivo; lo corre el PO). La hoja se dibuja a tamaño fijo (860 × 1120) y el libro se
  escala a la pantalla; forma 4 = el mismo libro girado 90°, así una hoja horizontal (`orientacion = 'h'`, contenido
  girado −90°) se lee derecha ahí y de lado en las formas 1–3. Pasar la hoja: hoja que gira en 3D sobre el espiral con
  sombra; al arrastrar, el punto tomado sigue al dedo/mouse (ángulo por coseno), y al soltar se completa si pasó la
  mitad o se lanzó rápido; clic en el borde, ← → (forma 4 también ↑ ↓), ◀ ▶ y deslizar. Sonido de papel sintetizado
  (🔈/🔇). Índice 📅 por fecha que pasa hasta 6 hojas rápido y llega. Zoom en la forma 3 (rueda, pellizco, + / −, ⟲,
  doble clic), arrastre que vuelve al centro. Lo escrito que no cabe achica la hoja. Contenido de la hoja = piezas en
  orden: textos (editor por bloques, mismas marcas) e imágenes (achicadas a 1600 px en webp al subir; chica, mediana,
  grande u hoja completa; también se pegan con Ctrl + V). Editor de la hoja: fecha (del año del cuaderno),
  Vertical/Horizontal, piezas con ▲ ▼ ✕, vista previa al lado, guardado solo, 🗑 Eliminar hoja (borra también sus
  imágenes). Preferencias en el equipo: forma, espirales, sonido, zoom; papel (lisa/líneas/cuadros) y letra
  (ligada/imprenta) por curso. Al instante entre equipos (Realtime de `cuaderno_hojas`). **Planificador:** 📔 en la
  barra de la sesión y "📔 Cuaderno" en la ventana ✍🏼 (solo 1°–8°, espacio reservado): abre en la hoja de esa clase
  (o la última), con ＋ Hoja / ＋ Nueva hoja con la fecha de la clase. **Cursos:** "📔 Cuaderno" en la barra (1°–8°),
  sin crear hojas, con ✏️ Editar hoja.
- **Prueba (local, puerto 8972, con hojas de prueba en memoria; la tabla aún no existe):** las 4 formas (tapa rosada con
  "Música · Cuarto básico · 2026"; dos páginas con interior de tapa a la izquierda; una página; horizontal con espiral
  arriba y la hoja horizontal derecha), "↻ Girar para leer" pasa de 3 a 4; arrastrar la esquina gira la hoja a −74° y al
  soltar pasada la mitad queda en el pliego siguiente; zoom con rueda a 197 % y se mantiene al saltar con el índice;
  editor: cambiar a Horizontal gira la vista previa y guarda; letra ligada en la hoja. En el Planificador, 📔 visible en
  Cuarto y el cuaderno avisa "¿se ejecutó cuaderno.sql?" mientras falte la tabla. Falta: correr el SQL, subir imágenes
  reales y probar con el dedo en pantalla táctil.
- **Commit:** `6f0f5bf` (subido). El PO corrió `supabase/cuaderno.sql` (2026-10-21).
- **Prueba con datos reales (2026-10-21, Cuarto, año 2099):** ＋ Hoja creó la fila con la fecha sugerida; texto e imagen
  (PNG achicado a webp) guardados solos; al reabrir, la hoja se leyó de Supabase con la imagen desde el bucket público;
  🗑 Eliminar hoja borró la fila y su imagen (0 filas, 0 archivos). Falta: uso real y pantalla táctil.
- **Paso 2 — el cuaderno en la Pizarra (PO aprueba seguir, 2026-10-21; diseño ya decidido en el paso 1: botón 📔 con la
  clase en curso, la Pizarra muestra el cuaderno y se hojea entero desde el Planificador; al soltarlo vuelve a su
  diapositiva).**
  - **Auditoría:** la Pizarra ya recibe copias por `BroadcastChannel` + `localStorage` (Libro: `profe-espejo-libro`,
    capa z 8600; Entrenador: `profe-espejo-entrenador`, capa z 8500; recurrentes z 9000; tiempo perdido z 9999) y llama
    `Recurrentes.alProyectar()` al mostrar algo nuevo. La Pizarra tiene `sb` y `TiempoReal`: puede leer las hojas ella
    misma (no hace falta mandar el contenido por el canal). `ClaseVivo.get().sesionId` dice si la clase en curso aquí
    es la de la sesión abierta.
  - **Diseño:** en el cuaderno abierto desde el Plan, botón **📽️ Pizarra** (solo con esa clase en curso en este
    equipo, espacio reservado). Encendido: canal `profe-espejo-cuaderno` con el estado (curso, año, forma, hoja,
    espirales, papel, letra, zoom) y un aviso por cada hoja que se pasa, para que la Pizarra la pase con la misma
    animación. La Pizarra abre el mismo cuaderno (`Cuaderno.espejoEnPizarra`) a pantalla completa, sin barras ni
    gestos, encima de la diapositiva (z 8400: debajo del Libro, el Entrenador, las recurrentes y el tiempo perdido).
    Se apaga con el mismo botón o al cerrar el cuaderno; una Pizarra abierta después lo retoma.
  - **Implementación (2026-10-21):** `comun/cuaderno.js`: botón 📽️ Pizarra (visible si `ClaseVivo.get().sesionId` es la
    sesión del cuaderno), `proyectar` / `emitirEstado` (deduplicado, también en `localStorage` `profe_espejo_cuaderno`)
    / `emitirPasar` (botones, teclas, clic en el borde, arrastre completado y la tapa); se apaga al cerrar el cuaderno,
    al salir de la página y al terminar la clase. `Cuaderno.espejoEnPizarra(() => sb, sesionId)`: abre el cuaderno con
    `espejo: true` (clase `.cdn.espejo`: sin barra ni pie, sin gestos ni teclas, sin sonido, sin guardar preferencias;
    al final una hoja en blanco en vez de "＋ Nueva hoja" para contar las hojas igual que el Plan), pasa la hoja con la
    misma animación al recibir "pasar" y se pone al día con el estado (si llega en plena animación, al terminarla).
    `PIZARRA/index.html` carga `editor-bloques` y `cuaderno` y llama `espejoEnPizarra`. Corrección: si la ventana no se
    dibuja (minimizada o detrás) la animación igual termina (respaldo con `setTimeout`); antes la hoja quedaba trabada.
  - **Prueba (local, dos pestañas, hojas del año 2099 en Cuarto, borradas al final; clase en curso simulada en la
    página):** 📽️ Pizarra visible y encendido; la Pizarra abrió el cuaderno encima (z 8400) sin barras; ▶ en el Plan
    pasó al pliego de las hojas 2–3 en ambos; forma 3 + zoom 120 % llegó a la Pizarra; forma 4 llegó girada; cerrar el
    cuaderno quitó el de la Pizarra y borró el aviso guardado. Falta: probar con el proyector y la clase real.
  - **Commit:** `a81690c` (subido).
- **Ajuste (PO, 2026-10-21): páginas en blanco y franja de la página de al lado.**
  - **DECISIÓN del PO:** botón **"＋ Página en blanco"** (deja una hoja sin fecha ni contenido justo después de la que se
    está mirando, como saltarse una página); en las formas 3 y 4 se ve **una franja de la página de al lado** para que
    los niños no pierdan la referencia.
  - **Implementación:** la página en blanco es una hoja con la pieza `{ t: 'blanco' }` (sin cambio en Supabase): misma
    fecha que la hoja en foco, creada después, así queda justo detrás; no muestra la fecha; el pie dice "en blanco" y el
    índice "Página en blanco"; el editor tiene la casilla "Sin fecha" (se puede escribir en ella o volver a ponerle
    fecha). Franja: en las formas 3 y 4 se dibuja la página anterior (antes de la primera, el interior de la tapa)
    recortada a 130 de ancho junto al espiral, un poco más apagada; el conjunto queda centrado (`translateX(65)` dentro
    del libro, también en la forma 4, donde la franja queda arriba) y los clics se calculan con ese corrimiento.
  - **Prueba (local, Cuarto, año 2099, borrado al final):** "＋ Página en blanco" desde la hoja 1 dejó la hoja 2 "en
    blanco" sin fecha; la franja muestra el borde de la hoja anterior (con su fecha cortada) a la izquierda del espiral en
    la forma 3 y arriba en la forma 4; la hoja principal cabe entera en pantalla.
  - **Commit:** `ae27235` (subido).
- **Ajuste (PO, 2026-10-21): títulos centrados.** DECISIÓN del PO: en el cuaderno, todo lo marcado como Título (H1, H2,
  H3) queda centrado solo (sin botón Centrar: el editor compartido no cambia). Solo CSS en `comun/cuaderno.css` (en la
  hoja y al escribirlo en el editor de la hoja). Probado: "# Las figuras rítmicas" y "## La corchea" centrados, el
  párrafo a la izquierda.

### CK. Evaluación de cierre de cada planificación (rúbrica en el Libro)
*Origen: pedido del PO (2026-10-21): "toda planificación debería cerrar con una evaluación, para lo cual está contemplada
una rúbrica; ese proceso debe poder seguirse por dentro de la app: cada plani tiene una rúbrica asignada y esa rúbrica
está dentro de una evaluación dentro del libro de clases del curso en cuestión".*
- **Necesidad:** que cada planificación mensual (deuda CI) termine en una evaluación real del curso, con su rúbrica, y
  poder ver desde la planificación si ya se evaluó (y cuánto falta).
- **Auditoría (2026-10-21):**
  - **Libro** (`LIBRO/index.html`): evaluaciones por curso y año (`libro_evaluaciones`: nombre, fecha, OA original,
    estado abierto/cerrado; `sesion_creacion_id` obligatorio = la clase con que se abrió el Libro). Rúbricas: plantillas
    globales (`libro_instrumento_plantillas` + `_items`, 4 niveles) que se **copian** a la evaluación
    (`libro_eval_instrumentos` + `_items`, `origen_plantilla_id`) y se asocian al OA (`libro_evaluaciones.instrumento_id`);
    la nota sale de la rúbrica. Crear una evaluación materializa la lista del curso (snapshot + reconciliación al abrir).
  - **Libros** (`LIBROS/index.html`): pestaña fija que abre el Libro de un curso sobre su clase de hoy o la última;
    recibe `ws-ir { ctx, sesion }`.
  - **Planificación** (`PLANIFICACION/index.html`): la "Evaluación" es solo texto de la tabla (Gemini); no hay vínculo.
- **DECISIÓN del PO (2026-10-21):** aprueba el diseño; **paso 1**: (1) cada planificación tiene una **Evaluación de
  cierre** (cuadro en el editor: sin evaluación / abierta con avance / cerrada) y **una sola**; (2) se crea desde la
  planificación con nombre, fecha (última clase del último mes), OA (de los marcados) y rúbrica (una plantilla), y se
  termina de crear **en el Libro** (pestaña Libros con el formulario lleno), para que la lista de estudiantes y las notas
  sigan en un solo lugar; (3) la evaluación muestra "🗓️ Planificación Oct–Nov" con enlace de vuelta; (4) la tabla de
  🗓️ Planificaciones muestra el estado por celda (📝 sin evaluación —en rojo si el período ya pasó— · ⏳ abierta x/y ·
  ✅ cerrada). Pasos siguientes: 2 = ✨ Gemini propone la rúbrica; 3 = la rúbrica como anexo del Word.
- **Diseño técnico:** columna `libro_evaluaciones.planificacion_id` (→ `planificaciones`, `on delete set null`, única
  cuando no es nula) en `supabase/planificacion_evaluacion.sql` (aditivo; lo corre el PO). La planificación deja un
  pedido en el equipo (`localStorage` `profe_libro_nueva_eval`: curso, nombre, fecha, OA, plantilla, planificación) y
  abre Libros en el curso; el Libro, al ver el pedido de su curso, abre "Nueva evaluación" lleno con un aviso; al crear,
  guarda `planificacion_id`, copia la plantilla como instrumento y la asocia al OA.
- **Implementación (2026-10-21):**
  - `PLANIFICACION/index.html`: cuadro **Evaluación de cierre** al final del editor (`pintarCierre`): sin guardar →
    "Guarda la planificación…"; falta el SQL → aviso; sin evaluación → "📝 …" + **＋ Crear evaluación de cierre**
    (`formCierre`: nombre "Evaluación de cierre · <meses>", fecha = última clase del curso en el último mes
    (`fechaCierreSugerida`), OA entre los marcados (o todos si no hay marcados), rúbrica entre las plantillas del Libro
    o "sin rúbrica por ahora") → **Continuar en el Libro →** deja el pedido (`profe_libro_nueva_eval`) y abre Libros en
    el curso; con evaluación → "⏳ nombre · fecha · x de y evaluados" o "✅ … cerrada" + **📒 Abrir en el Libro** (pedido
    `profe_libro_abrir_eval` → el Libro abre esa evaluación). Se pone al día al volver a la pestaña y cuando el Libro
    avisa (`profe_cierre_cambio`). Tabla 🗓️ Planificaciones: bajo los botones de cada planificación, "📝 sin evaluación"
    (en rojo si su último mes ya pasó) · "⏳ x/y" · "✅ evaluada" (sin el SQL, la tabla sigue sin estados). `ws-ir` con
    `meses` abre esa planificación (enlace desde el Libro).
  - `LIBRO/index.html`: con un pedido de su curso y año (< 30 min), abre "Nueva evaluación" lleno, con el cuadro
    destacado y el aviso "🗓️ Evaluación de cierre de la planificación … · rúbrica … (se carga al crear)" + "No, gracias";
    al crear: `planificacion_id` (avisa si ya tenía otra o si falta el SQL), copia la plantilla como instrumento
    (`copiarPlantillaAEval`, la misma pieza que usa "Cargar plantilla") y la asocia al OA. Detalle: botón
    "🗓️ Planificación Oct–Nov" que abre la planificación; lista: "· 🗓️ cierre de planificación".
- **Prueba parcial (local, sin el SQL aún):** la planificación de Cuarto (septiembre) muestra "Falta correr
  supabase/planificacion_evaluacion.sql"; la tabla carga igual (14 planificaciones, sin estados); el Libro de Cuarto con un
  pedido de prueba abrió "Nueva evaluación" con nombre, fecha, OA y el aviso (no se creó nada; pedido borrado); sin
  errores en la consola. Falta: el PO corre el SQL; prueba completa (crear, ligar, rúbrica, estados).
- **Commit:** `f73b852` (subido). El PO corrió `supabase/planificacion_evaluacion.sql` (2026-10-21).
- **Prueba completa (local, datos reales; planificación de prueba de 1° marzo 2026 y su evaluación, borradas al final):**
  el cuadro mostró "📝 … todavía no tiene evaluación de cierre"; ＋ Crear propuso "Evaluación de cierre · Marzo", fecha
  31/3 (1° no tiene clases en marzo: último día del mes), el OA marcado y la plantilla "Rúbrica para canto y ritmo";
  Continuar dejó el pedido; el Libro de Primero abrió "Nueva evaluación" lleno con el aviso; Crear evaluación la ligó
  (`planificacion_id`), copió la rúbrica (4 criterios, `origen_plantilla_id` = la plantilla), la asoció al OA
  (`instrumento_id`) y materializó 23 estudiantes; el detalle muestra "🗓️ Planificación Mar"; el pedido se borró. De
  vuelta: el cuadro dice "⏳ … · 31/3 · 0 de 23 evaluados" y la tabla "⏳ 0/23" en 1° marzo (las demás "📝 sin
  evaluación", en rojo las de septiembre, ya pasado); 📒 Abrir en el Libro abrió esa evaluación. Al borrar la evaluación
  se fueron su rúbrica copiada y sus notas (0 restantes). Falta: uso real (y que el PO vea el aviso rojo de las de
  septiembre).
- **Paso 2 — ✨ Gemini propone la rúbrica (PO aprueba seguir, 2026-10-21; diseño ya aprobado):**
  - **Diseño:** en "＋ Crear evaluación de cierre", junto a Rúbrica, botón **✨ Proponer con Gemini**. Se le envía lo
    de la planificación (curso, meses, ejes, OA marcados, meta, desempeños y evidencias), pasando por la misma vista
    previa que tapa nombres de estudiantes; pide 3–4 criterios con sus 4 niveles (Por lograr · Medianamente logrado ·
    Logrado · Logrado con distinción) en un formato fijo (`NOMBRE:` / `CRITERIO:` / `N1:`…`N4:`). La propuesta se revisa
    en pantalla (nombre, criterios y niveles editables, quitar o agregar criterios) y **💾 Guardar como plantilla y
    usarla** la crea en las plantillas del Libro (`libro_instrumento_plantillas` + `_items`, tipo rúbrica) y la deja
    elegida para la evaluación. Sin cambios en Supabase.
  - **Implementación (2026-10-21):** `PLANIFICACION/index.html`: `proponerRubrica` (llave de Gemini del equipo, nombres
    del curso, `vistaPrevia` para tapar, `llamarGemini`), `textoParaRubrica` (sin el relato), `parsearRubrica` (tolera
    `**`), `pintarRubProp` (tabla editable: criterio + 4 niveles, ✕ quitar, ＋ Criterio, Descartar, 💾 Guardar como
    plantilla y usarla → inserta plantilla + ítems en orden; si fallan los ítems, borra la plantilla).
  - **Prueba (local, respuesta de Gemini simulada —no hay llave en el navegador de pruebas—; planificación de 1° marzo y
    plantilla de prueba, borradas al final):** apareció la vista previa de lo que se envía (con el OA marcado, sin el
    relato); la propuesta llegó con 2 criterios y su nombre (con `**` en la respuesta); se agregó un 3.º y se guardó: la
    plantilla quedó con 3 criterios en orden y sus 4 niveles, elegida en "Rúbrica" con el aviso ✓. Falta: probarlo con
    Gemini de verdad (llave del PO).
  - **Incidente (PO, 2026-10-21): se perdió una rúbrica de Primero a medio armar** (propuesta de Gemini en "Crear
    evaluación de cierre"). Revisado: no quedó nada guardado (ni plantilla ni evaluación). **Causa:** el cuadro de cierre se
    redibujaba cada vez que la pestaña recuperaba el foco (volver desde otra pestaña o ventana, o un clic dentro de la
    página del Workspace), y eso borraba el formulario abierto con la propuesta. No se pudo intentar rescatarla de la
    pestaña del PO (la extensión de Chrome no estaba conectada). **Corrección:** `refrescarCierre()` no redibuja si el
    formulario está abierto o hay una rúbrica en revisión; la rúbrica se guarda como **borrador en el equipo** con cada
    cambio (`profe_rubrica_borrador:<planificación>`) y al volver a abrir la planificación el formulario se abre solo
    con "Se recuperó la rúbrica que estabas armando"; se borra al guardarla o al descartarla (Descartar ahora pide
    confirmar). Probado (local, planificación de prueba borrada): con la propuesta abierta y un criterio editado, el
    foco de la ventana ya no la borra; tras **recargar la página** volvió la propuesta con el texto editado.
    Commit `bb1d893` (subido).
  - **Ajuste (PO, 2026-10-21): celdas de 🗓️ Planificaciones más productivas.** Cada planificación lleva **dos botones**:
    **📄 la planificación** (menú 👁 Ver · ⬇ Descargar) y **📋 su rúbrica de cierre**: si no existe, punteado con "＋"
    (en rojo si el período ya pasó) y al tocarlo abre la planificación con "Crear evaluación de cierre" ya abierto (si
    la evaluación existe sin rúbrica, la abre en el Libro); si existe, el mismo menú 👁 Ver (ventana con la tabla
    criterios × niveles) · ⬇ Descargar (Word aparte); verde si la evaluación está cerrada; el avance va en la ayuda del
    botón. Se quitó la línea "📝 sin evaluación" y las filas son más bajas: la página **no muestra barra de
    desplazamiento** en la pantalla del Workspace. `leerRubricaDe` = lectura común de la rúbrica (Ver y Descargar).
  - **Prueba (local, datos reales sin tocarlos; pantalla de 1900 × 870):** la tabla cabe sin desplazar (alto del
    documento = alto de la ventana); 14 planificaciones con 📄 y 📋＋ (6 en rojo, las de septiembre); 📄 → menú Ver /
    Descargar → Ver abre la planificación; 📋＋ de 1° septiembre abrió el editor con el formulario de cierre lleno
    ("Evaluación de cierre · Septiembre"), sin guardar nada; con una rúbrica simulada, 📋 → Ver / Descargar → Ver
    mostró la tabla en la ventana.
    Commit `4e7e927` (subido).
  - **Ajuste (PO): la tabla quedó muy chica → que llene la pantalla disponible.** Con `body.en-planis` la vista usa todo
    el ancho; `altoPlanis()` le da todo el alto bajo el encabezado (al mostrarla y al cambiar el tamaño de la ventana) y
    las filas se reparten ese alto; letra y botones crecen con la pantalla (`clamp` según el alto). La vista ✏️ Editar
    no cambia. Probado (local): en 1900 × 870, filas de 79 y botones de 18 px, sin desplazamiento (alto del documento =
    alto de la ventana); en 1366 × 640 también cabe sin desplazar.
  - **Ajuste (PO):** sin el título "Planificaciones 2026" (el año ya está en la página) ni la raya bajo 8°, y ese
    espacio va a la tabla; **el ancho vuelve a ser el de antes** (1120): solo se aprovecha el alto.
- **Paso 3 — la rúbrica en Word (DECISIÓN del PO, 2026-10-21): en un Word aparte, con su propio botón** (no como anexo
  del Word de la planificación). Contenido: la misma cabecera institucional, "RÚBRICA DE EVALUACIÓN <año>", curso,
  período, evaluación, fecha y OA; tabla de criterios × 4 niveles (o ítem / Sí / No si es lista de cotejo), en hoja
  horizontal. Se toma de la evaluación de cierre del Libro (la copia de la evaluación, con lo que se haya ajustado allí).
  Botón **⬇ Rúbrica** en el cuadro Evaluación de cierre y en la ventana 👁 Visualizar de la tabla (solo si hay
  evaluación con instrumento). Archivo: `<CURSO> - <MES> - RUBRICA.docx`.
  - **Implementación (2026-10-21):** `descargarRubrica(pl, aviso)` en `PLANIFICACION/index.html` (lee la evaluación por
    `planificacion_id`, su instrumento —el asociado al OA o, si no, el primero— y sus ítems; arma el Word con `docx`); la
    cabecera institucional pasó a una función común `cabeceraDoc()` que usan los dos Word. Botones: "⬇ Rúbrica" en el
    cuadro de cierre (con aviso debajo) y en 👁 Visualizar (visible solo si la planificación tiene evaluación de cierre).
  - **Prueba (local; planificación de 1° marzo + evaluación con rúbrica de 2 criterios, insertadas y borradas al final):**
    "⬇ Rúbrica" descargó `PRIMERO - MARZO - RUBRICA.docx`; su contenido (leído del archivo): título, asignatura, curso,
    período, evaluación, fecha 31/03/2026, OA, instrumento y la tabla Criterio × 4 niveles con sus textos. El Word de la
    planificación sigue saliendo igual, con la cabecera de la escuela. En Visualizar el botón aparece solo con evaluación.
- **Ajuste (PO, 2026-10-21): en las vistas de una página, el cuaderno se comporta como el real.** Las páginas van de a dos
  (izquierda = atrás de una hoja, derecha = adelante de la siguiente). **DECISIÓN del PO:** entre las dos páginas del
  mismo par el cuaderno **se desliza** (pasa el espiral, no gira nada); entre pares **se da vuelta la hoja** (y la vista
  acompaña a la hoja hasta la página que corresponde); la **franja** muestra siempre la **otra página del par**, al otro
  lado del espiral. En la vista 4 (horizontal, espiral arriba) lo mismo pero hacia arriba/abajo: la izquierda queda
  arriba del espiral y la derecha abajo; la hoja gira como un calendario de pared.
  - **Diseño técnico:** en las vistas 3 y 4 se dibuja el par completo (como en la vista 2) dentro de una "ventana" que
    recorta lo que no se ve (la página enfocada + la franja de la otra junto al espiral, con margen arriba/abajo para la
    hoja que gira); deslizar = mover el par dentro de la ventana; dar vuelta = la misma hoja de la vista 2 mientras el par
    se mueve hasta la página nueva. La forma 4 gira la ventana completa. Arrastrar: dentro del par, el cuaderno sigue al
    dedo y al soltar queda en la página más cercana; entre pares, la hoja sigue al dedo como ahora.
  - **Implementación (2026-10-21):** `comun/cuaderno.js`: nueva capa `.cdn-ventana` (lleva la escala, el giro de la forma
    4, el zoom y el arrastre del zoom; en las formas 3 y 4 recorta solo de lado a lado con `clip-path`, así la hoja que gira
    no se corta arriba/abajo); `.cdn-libro` dibuja siempre el par en las formas abiertas y se corre con `translateX(−desp)`
    (`despDe`: izquierda = 0, derecha = PW − franja). `pasar`: en 3/4, hacia la otra página del par → `deslizar` (sin
    sonido de papel) y entre pares → la misma hoja de la forma 2 mientras `ponerDesp` acompaña el giro. Arrastre:
    `desliza` (el par sigue al dedo; al soltar, a la página más cercana o a la otra si se lanzó) u `hoja`. Clics: bordes de
    la página en foco; la franja lleva a su página. La otra página del par se apaga un poco (`.cdn-slot.otra`). Se quitó
    la franja anterior (siempre a la izquierda, con la hoja anterior). La Pizarra sigue igual (recibe "pasar" y hace lo
    mismo).
  - **Prueba (local, 4 hojas de prueba en memoria):** forma 3 desde la hoja 1 (derecha del primer par): ▶ dio vuelta la
    hoja y quedó la hoja 2 a la izquierda; ▶ se deslizó (sin hoja girando) a la hoja 3 a la derecha; ◀ se deslizó a la 2;
    ◀ dio vuelta a la 1. Medidas: la página en foco entra entera en la ventana y de la otra se ven solo los 130 de la
    franja, al lado que corresponde. Forma 4: la izquierda queda arriba del espiral y la derecha abajo, con la franja
    arriba; arrastrar hacia abajo desde la primera no hace nada (antes está la tapa), hacia arriba da vuelta la hoja y el
    siguiente arrastre se desliza. Forma 2 y abrir la tapa siguen igual. (Sin captura de pantalla: el panel no dibujaba.)
- **Ajuste (PO, 2026-10-21): vista 5 y barra en una línea.** **Vista 5** = el cuaderno horizontal con **las dos
  páginas** (la vista 2 girada: espiral al medio en horizontal, la página izquierda arriba y la derecha abajo; la hoja
  gira hacia arriba/abajo). Orden de los botones: 1, 2, 3, 5, 4. "↻ Girar para leer" alterna 2↔5 y 3↔4. **La barra del
  cuaderno cabe en una sola línea** (antes "＋ Página en blanco" y ✕ bajaban a una segunda línea): botones más compactos
  ("✏️ Editar", "＋ En blanco", ➰ solo con su ícono) y sin saltos de línea.
  - **Implementación:** `dosPag()` (2 y 5) y `girado()` (4 y 5) reemplazan las comparaciones con 2 y 4; la 5 es la 2 con
    la ventana girada 90°; ícono propio (dos páginas apiladas); girar alterna 2↔5 y 3↔4. Barra: `flex-wrap: nowrap`, menos
    espacio entre botones, título que se acorta si falta lugar (y desplazamiento lateral como respaldo en pantallas angostas).
  - **Prueba (local, pantalla de 1920, hojas de prueba):** botones en orden 1, 2, 3, 5, 4; la barra quedó en una línea
    (alto 49, ✕ dentro); en la 5, la página izquierda arriba y la derecha abajo; ◀ dio vuelta la hoja al par anterior;
    con foco en una hoja horizontal en la 2, "↻ Girar para leer" pasó a la 5.
  - **Commit:** `d63dc4f` (subido).
- **Ajuste (PO, 2026-10-21): rayado que se cortaba y cuadros más grandes.** En la vista 5 el rayado del PO se cortaba
  pasada la mitad de la hoja (las líneas verticales están bien, así queda el cuaderno real al girarlo). El rayado era un
  degradado repetido largo, que el navegador puede dejar de dibujar en parte al girar y escalar la hoja; pasa a ser un
  **mosaico simple** de 44 de alto (una línea por mosaico) con la franja de arriba tapada, que se dibuja igual en
  cualquier vista. **Cuadros** (DECISIÓN del PO): del mismo alto y ancho que el renglón de las líneas, **44 × 44**
  (antes 22), alineados con el texto. Probado (local): en la vista 5 las líneas cubren toda la hoja; en la 3, con
  cuadros, cada renglón de texto queda dentro de una fila de cuadros. No se pudo reproducir el corte en el navegador de
  pruebas; **el PO confirmó en su pantalla que ya no se corta** (2026-10-21). Commit `88d844a` (subido).
- **Ajuste (PO, 2026-10-21): dos márgenes rojos** en "Líneas" y "Cuadros" (antes solo uno a la izquierda en Líneas y
  ninguno en Cuadros): a 100 del borde izquierdo y a 70 del derecho (`--cdn-margenes`, la misma capa en ambos papeles);
  el texto queda entre los dos (caja de contenido de 712 a 666 de ancho). Probado (local): en Líneas se ven los dos y el
  texto largo baja de renglón antes del margen derecho; en Cuadros la hoja lleva las dos líneas rojas.
  - **Corrección (PO):** en Cuadros cada línea roja debe **reemplazar justo una línea celeste**, y las dos rojas, delgadas y
    del **mismo grosor** (la izquierda se veía más delgada que la derecha), en todas las vistas y papeles. Los márgenes
    pasan a posiciones fijas sobre la cuadrícula de 44: **86–88 y 790–792** (2 de grosor, igual que las celestes), en
    Líneas y en Cuadros; el texto va de 100 a 778.
    Probado (local, Cuadros con zoom 400 %): la línea roja izquierda ocupa justo el lugar de una celeste y tiene su mismo
    grosor; la derecha cae en 790–792, también sobre la cuadrícula.
- **Ajuste (PO, 2026-10-21): líneas nítidas en la vista 4 y zoom libre en las vistas de una página.**
  - En la vista 4 las líneas rojas se veían gruesas (la hoja girada se dibujaba borrosa: el navegador la trata como capa
    3D aunque no haya ninguna hoja girando). La profundidad 3D se activa **solo mientras una hoja gira**; quieto, el
    cuaderno se dibuja plano y nítido.
  - **Zoom** (DECISIÓN del PO, cambia la del paso 1 "arrastre que vuelve al centro"): en las vistas de una página
    (**3 y 4**) se puede acercar y **recorrer toda la hoja** arrastrando, sin salirse de sus bordes, y se queda donde se
    deja (ya no vuelve al centro). El recorrido se guarda en unidades de la hoja, así la Pizarra muestra el mismo lugar.
  - **Implementación:** `.cdn-libro.en3d` (perspectiva y 3D) solo mientras gira una hoja (al pasar y al abrir la tapa);
    zoom con `unaPagina()` (rueda, pellizco, + / −, ⟲, doble clic, teclas) en 3 y 4; `limitarPan()` acota el recorrido a
    los bordes de la hoja (12 de aire) y no vuelve al centro al soltar; `panX/panY` en unidades de la hoja y enviados a la
    Pizarra con el estado.
  - **Prueba (local):** vista 4 con Líneas, quieta: la hoja se ve nítida (sin capa 3D) y las rojas, delgadas como las
    celestes; zoom 248 % con la rueda en la vista 4; arrastrar muy lejos hacia un lado deja la hoja justo en su esquina
    (12 de aire) y al otro lado, en la esquina opuesta; en la vista 3, lo mismo hacia abajo; el zoom se mantiene.
- **Ajuste (PO, 2026-10-21): doble clic en una página de las vistas de dos páginas** (2 y 5) pasa a ver esa página sola
  (2 → 3, 5 → 4). Para que el doble clic no pase la hoja, en esas vistas el clic simple en el borde espera un instante
  (240 ms) por si es doble.
  Probado (local, 3 hojas de prueba): doble clic en la izquierda de la vista 2 → vista 3 en la hoja 2; en la derecha →
  vista 3 en la hoja 3; en la 5, arriba → vista 4 en la hoja 2 y abajo → vista 4 en la hoja 3; los dos clics previos al
  doble clic (cerca del borde) no pasaron la hoja.
- **Ajuste (PO, 2026-10-21): índice como página aparte.** El menú del índice no se veía bien (quedaba recortado dentro
  de la barra, que ahora es de una sola línea). **DECISIÓN del PO:** 📅 Índice abre una **página** sobre el cuaderno,
  **separada por meses**; cada hoja en una fila: **día y número** ("Miércoles 21"), **resumen del texto** e
  **indicación de imágenes** si las hay; se cierra con **✕** (o Esc); tocar una fila lleva a esa hoja. **Las páginas en
  blanco no se listan.**
  - **Implementación:** `.cdn-idx` (capa bajo la barra) con `abrirIndice` / `cerrarIndice`; meses en orden; fila =
    "Miércoles 21" + `resumenHoja` (líneas del texto sin marcas, unidas con " · ", hasta ~170 letras) + "🖼 n imágenes";
    la hoja en foco destacada; se omiten las hojas sin fecha (páginas en blanco). Se quitó el menú desplegable anterior.
  - **Prueba (local, 4 hojas de prueba: texto con título y viñetas, solo 2 imágenes, una en blanco, texto + imagen):**
    "septiembre" con "Miércoles 30 · Las cualidades del sonido · Altura: agudo y grave · Intensidad: fuerte y suave";
    "octubre" con "Miércoles 7 · Sin texto · 🖼 2 imágenes" y "Miércoles 21 · Cantamos Cuncuna amarilla completa ·
    🖼 1 imagen"; la página en blanco no aparece; tocar el 21 cerró el índice y llevó a esa hoja; al reabrir, esa fila
    destacada; ✕ lo cierra.

- **Ajuste (PO, 2026-10-22): una rúbrica de una evaluación se puede guardar como plantilla** (Libro). En la tarjeta de
  instrumentos de la evaluación, cada instrumento lleva **💾 Guardar como plantilla** (también con la evaluación cerrada):
  pide el nombre (propone el del instrumento), avisa si ya hay una plantilla con ese nombre y guarda una **copia** en
  Plantillas (tipo, criterios en orden y sus 4 niveles); lo que se cambie después en una no toca a la otra.
  `instrAPlantilla` en `LIBRO/index.html`. Probado (local, instrumento de prueba en memoria, plantilla borrada al final):
  quedó la plantilla tipo rúbrica con sus 2 criterios en orden y sus niveles.

- **Ajuste (PO, 2026-10-22): editores de rúbrica más amplios y con cuadros de texto grandes** (Libro: editor de la
  plantilla y ventana "Instrumento" de la evaluación). Criterio y niveles pasan de líneas sueltas a **cuadros de texto
  que crecen con lo escrito** (letra 14–15, se lee todo); los 4 niveles van uno al lado del otro con más ancho. La ventana
  del instrumento llega a 1400 de ancho (antes 660) y la página de Plantillas a 1400 (antes 1000). Probado (local, 1600
  de ancho): plantilla con cuadros de nivel de 305 de ancho que muestran todo su texto; ventana del instrumento de 1334.

### CL. Plan — el Historial al lado del Plan
*Origen: pedido del PO (2026-10-21): "el botón historial muestra el historial en el mismo espacio donde se renderiza el
plan; quiero poder ver el historial en el espacio de la presentación, porque para planificar me sirve mucho tener a la
vista el historial, pero no puedo ver las dos cosas al mismo tiempo".*
- **Necesidad:** planificar la clase mirando qué se hizo en las anteriores (Plan e Historial a la vez).
- **Auditoría:** el Historial (deuda BO) es la pestaña 🕘 de la columna izquierda (`#pane-curso`, `cargarCurso`, ✏️ por
  entrada) y reemplaza al Plan. Las columnas Presentación + Vista previa ya se tapan con capas propias (Entrenador
  mínimo `#prev-mini`, vista de clase `#clase-panel`) que siguen al ancho de la columna del Plan (`miniUbicar`).
- **DECISIÓN del PO (2026-10-21):** el Historial se abre **sobre Presentación + Vista previa** (el Plan sigue a la
  izquierda); **🕘 Historial lo abre y lo cierra** (o ✕) sin cambiar la columna izquierda; se puede abrir también **con
  la clase en curso** (tapa un momento el panel de la clase); **✏️ por entrada** como hoy. **Queda en revisión** si este
  uso es cómodo.
- **Implementación (2026-10-22):** `PORTAL/index.html`: `#pane-curso` sale de la columna izquierda a la capa
  **`#hist-lado`** (encabezado "🕘 Historial del curso" + ✕, cuerpo con su propio desplazamiento, letra un poco mayor),
  ubicada como el Entrenador mínimo (`miniUbicar`, sigue el ancho de la columna del Plan) y encima de él y del panel de
  clase (z 25). `planTab('curso')` abre/cierra (`abrirHistorial` / `cerrarHistorial`) sin tocar la pestaña activa de
  la izquierda; el botón 🕘 se marca mientras está abierto. Al abrir otra clase con el Historial abierto, se arma el
  del curso nuevo. ✏️ por entrada igual que antes.
- **Prueba (local, Cuarto, clase del 12/10, sin editar nada):** 🕘 abrió el Historial a la derecha (22 entradas),
  justo desde donde empieza la Presentación hasta el borde, con el 📋 Plan visible a la izquierda; cambiar a Pendientes
  dejó el Historial abierto; 🕘 de nuevo lo cerró y ✕ también. **PENDIENTE (PO):** revisar en uso si es cómodo.

### CM. Cursos — vista ☀ Hoy (las bitácoras del día en una página)
*Origen: pedido del PO (2026-10-22): "en Cursos necesito una vista que me permita ver las bitácoras del día, una vista
Hoy; se muestran, como si fueran una página, las bitácoras de los contextos".*
- **Necesidad:** al terminar (o durante) el día, escribir y revisar la bitácora de todas las clases del día en un solo
  lugar, sin entrar curso por curso.
- **Auditoría:** Cursos (`CURSOS/index.html`, deuda BA) arma la página de **un** curso (clases = `memorias` por sesión +
  notas). El horario del día sale de `horario` (`dia_semana` 0–3 = lun–jue, `orden`, `hora_inicio`); una clase tiene
  bitácora solo si existe su `sesion` (la crea el Planificador al abrirla: `contexto_id` + `fecha`, única).
- **DECISIÓN del PO (2026-10-22):** fila **☀ Hoy** arriba de la lista de cursos; abre una página con **todas las clases
  del día** (todos los cursos, talleres y jefaturas del horario de ese día, en orden), cada una con su bitácora
  **editable como en Cursos** (la misma bitácora del curso y del Plan); **◀ ▶** para ir a otros días; **nada más**
  (sin notas ni pendientes).
- **Diseño técnico:** las clases del día = el horario de ese día de la semana + las sesiones de esa fecha que no estén
  en el horario; si la clase aún no tiene sesión, la bitácora se ve vacía y la sesión se crea **al escribir** (igual que
  el Planificador). Mismo guardado, tiempo real y "bloque → pendiente" (a la clase siguiente de ese curso).
- **Implementación (2026-10-22):** `CURSOS/index.html`: fila **☀ Hoy** sobre General; `abrirHoy(fecha)` (horario del
  día ordenado por hora y orden + sesiones extra de esa fecha, sin General), `pintarHoy` (una sección por clase con
  "ícono + curso", **Abrir curso →** y su editor por bloques), barra con ◀ Hoy ▶ (`moverDia`), `asegurarSesion` (crea la
  sesión al primer guardado si la clase aún no la tiene), tiempo real de `memorias` también en ☀ Hoy, y se recuerda
  ☀ Hoy como última vista. Sin cambios en Supabase.
- **Prueba (local, datos reales, sin escribir nada):** ☀ Hoy (jueves 22/10) mostró Segundo, Séptimo, Kids Castigadas,
  Octavo y Castigadas en el orden del horario; ◀ → miércoles 21 con Primero y su bitácora; ◀ ◀ → lunes 19 con
  Orientación, Tercero, Cuarto y Taller de Cuerdas; "Abrir curso →" de Cuarto abrió su página en la clase del 19.
  Falta: escribir en una clase sin sesión (se crea al guardar) en uso real.
- **Ajuste (PO, 2026-10-22):** en ☀ Hoy la segunda columna no se esconde: muestra **las clases del día** ("☀ Jue 22 oct"
  arriba; punto azul = con bitácora) y al tocar una la página salta a ella; al recorrer la página se marca la clase que
  se está viendo. "＋ Nota" se oculta en ☀ Hoy (vuelve al abrir un curso). `pintarEntradasHoy`. Probado (local, jueves
  22): Segundo, Séptimo, Kids Castigadas (sin bitácora), Octavo y Castigadas; tocar Octavo llevó a su bitácora y la
  marcó; al abrir Cuarto volvió la lista por meses y "＋ Nota".

### CN. Cursos — listas de pendientes siempre plegadas
*Origen: deuda anotada por el PO (2026-10-21, Notion "Cursos: listas de pendientes siempre plegadas"); el PO pide hacerla
(2026-10-22). Solo Cursos: el Historial del Plan no muestra pendientes.*
- **Decisión del PO:** en la página de un curso, el cuadro **☑ Pendientes** del curso y los pendientes de **cada
  clase** aparecen **plegados** al abrir; se despliegan tocando su título (con la cantidad a la vista).
- **Implementación (2026-10-22):** `CURSOS/index.html`: los cuadros llevan `plegable plegado` (▸ que gira al abrir); el
  de cada clase muestra "· n" pendientes activos; un clic en el título alterna; al volver a abrir el curso parten
  plegados otra vez. Probado (local, Cuarto): "▸ ☑ Pendientes · 2" plegado, 4 clases con pendientes plegadas
  ("· 2" en la primera); clic abre y vuelve a cerrar.

### CO. 🐞 Mejoras de la app — anotar bugs e ideas al vuelo desde cualquier pendiente
*Origen: pedido del PO (2026-10-22): "un nuevo tipo de pendientes que me permita ir registrando aquí mismo las
iteraciones importantes, los bugs que necesito arreglar". No es para gestionar el desarrollo en la app: es para anotar
en contexto las ideas que aparecen en la marcha.*
- **DECISIÓN del PO (2026-10-22):** en **cualquier pendiente**, si el texto empieza con **`/bug`** o **`/mejora`**, deja
  de ser pendiente y va a la lista **🐞 Mejoras de la app** (botón corto: "🐞 Mejoras"); esa lista es una **página en
  Cursos, al final del menú, separada por una línea**. Cada anotación guarda **de dónde salió** (curso y clase) como
  etiqueta; **una sola lista** con marca 🐞 bug / ✨ mejora y filtro; **sin estados** (no se gestiona aquí). **Flujo:**
  Claude la lee al comenzar cada sesión, las pasa al Backlog de Notion y, **con aprobación previa del PO**, las borra.
- **Diseño técnico:** misma tabla `pendientes` con `categoria = 'mejora_app'` (texto libre, sin cambio en Supabase) y el
  texto con su marca 🐞 / ✨ adelante; conserva `contexto_id` y `sesion_id` de donde se escribió. Las listas de pendientes
  solo muestran `tarea_proxima`, así que la anotación sale de ellas sola. Funciona también en el celular (misma pieza,
  con la cola sin señal).
- **Implementación (2026-10-22):** `comun/pendientes.js`: `comoMejora` (texto que empieza con `/bug` o `/mejora`, sin
  confundir con "/bugs…") → al **crear** se anota directo como `mejora_app` y al **editar** un pendiente existente sale
  de las listas y se convierte (sin padre ni ☀ Hoy); aviso "Anotado en 🐞 Mejoras de la app."; en el tiempo real, un
  pendiente que cambia de categoría se quita de las listas de otros equipos. `CURSOS/index.html`: fila **🐞 Mejoras**
  al final del menú, tras una línea; página con ayuda, filtros Todas / 🐞 Bugs / ✨ Mejoras (con su cantidad), un cuadro
  para anotar directo (sin comando queda ✨) y cada anotación con su origen ("4️⃣ Cuarto · Lun 19 oct"), la fecha en que
  se anotó y 🗑. Sin cambios en Supabase.
- **Prueba (local, datos reales; anotaciones de prueba borradas al final):** crear "/bug …" en un pendiente de Cuarto
  (clase del 19/10) lo anotó como "🐞 …" sin pasar por la lista; editar un pendiente nuevo a "/mejora …" lo sacó de la
  lista y lo dejó "✨ …"; ambos aparecen en 🐞 Mejoras con "4️⃣ Cuarto · Lun 19 oct"; el filtro 🐞 dejó solo el bug;
  anotar directo dejó "✨ …"; 🗑 lo borró.
- **Regla de trabajo (DECISIÓN del PO):** al comenzar cada sesión, Claude lee 🐞 Mejoras, las pasa al Backlog de Notion
  y **pide aprobación** antes de borrarlas de la app.

### CP. Editor por bloques — un solo menú (formato + acciones del bloque)
*Origen: 🐞 Mejoras de la app (PO, 2026-10-22): "hay dos menús que aparecen, que deberían ser uno solo: uno de bold,
itálica y colores, y el otro con convertir, color, duplicar, eliminar. NECESITAMOS UN SOLO MENÚ". Notion: tarjeta
"Cursos: un solo menú (formato + acciones del bloque)".*
- **Auditoría:** `comun/editor-bloques.js` tiene dos flotantes: la barra `#eb-formato` (B I U + 3 colores, al seleccionar
  texto) y el menú `#eb-menu` del bloque (⋮⋮ / clic derecho: Convertir en, 🎨 Color, Convertir en pendiente, Duplicar,
  Eliminar). La pieza es compartida: el cambio se ve en Cursos, la Bitácora del Planificador, las Actividades del Plan y el
  Cuaderno. El celular (`tactil`) usa su propia barra sobre el teclado y no cambia.
- **DECISIÓN del PO (2026-10-24):** un menú único con la fila **B I U · A A A** arriba. Al seleccionar texto aparece
  **solo esa fila** con un **⋯** que despliega el resto; con ⋮⋮ o clic derecho se abre **completo**. Los 3 colores
  reemplazan a "🎨 Color": con texto seleccionado pintan ese texto, sin selección pintan el bloque entero.
- **Implementación (2026-10-24):** `comun/editor-bloques.js`: `abrirMenu` acepta `formato: { ids, txt, rango }` y dibuja la
  fila B I U · A A A arriba del menú; con `rango` (texto seleccionado al abrir con clic derecho o con el **⋯** nuevo de la
  barra chica) actúa sobre ese texto y el menú queda abierto; sin él, B/I/U van al bloque entero (`formatoBloques`: si el
  primero ya lo tiene, se quita en todos) y los colores pintan los bloques (`colorear`). Fuera "🎨 Color" del menú del
  bloque y del de varios bloques. Con el menú abierto la barra chica no aparece; con texto seleccionado, Supr no borra el
  bloque. `editor-bloques.css`: estilos de `.eb-m-fmt`. El celular no cambia.
- **Prueba (local, página de prueba sin datos reales):** seleccionar texto → barra chica con ⋯; ⋯ abre el menú completo
  (Convertir en, Convertir en pendiente, Duplicar, Eliminar) y azul + negrita quedaron solo en lo seleccionado
  (`Primera {3:**línea**} de prueba`); ⋮⋮ sin selección: naranjo + negrita al bloque entero (`{2:**Segunda línea**}`);
  2 bloques seleccionados: cursiva a los dos y otra vez la quita en los dos.

### CQ. Cursos — 4ª columna "Pendientes" (ocultable), alineada con las clases
*Origen: 🐞 Mejoras de la app (PO, 2026-10-22): un botón "Pendientes" en Cursos que muestra una cuarta columna a la
derecha con los pendientes que se derivan de cada sesión a la siguiente, alineados con las sesiones; sacar el plegable
"Pendientes" de cada sesión, que dificulta la lectura; parte desactivado. Notion: tarjeta "Cursos: 4ª columna
Pendientes ocultable, alineada con las clases".*
- **Auditoría:** `CURSOS/index.html` muestra arriba el cuadro "☑ Pendientes" del curso (plegado, deuda CN) y, en cada
  clase, "☑ Pendientes de esta clase" (los que tienen `sesion_id` de esa clase). Los pendientes ya traen la fecha de su
  clase (`Pendientes`), así que se pueden alinear por fecha, sin consultas nuevas. ☀ Hoy hoy no muestra pendientes.
- **DECISIÓN del PO (2026-10-24):** (1) al lado de cada clase van **los que deja para la siguiente**: los pendientes de
  las clases que vienen después de esa y hasta la próxima que aparece en la página (al lado de la última clase, todo lo
  que está para más adelante, aunque esa clase todavía no ocurra); (2) la columna **también en ☀ Hoy**; (3) el cuadro
  "☑ Pendientes" de arriba **se va a la columna**; también se quitan los plegables de cada clase. Botón en la barra,
  parte **desactivado**.
- **Implementación (2026-10-24):** `CURSOS/index.html`: botón **☑ Pendientes** en la barra (espacio reservado, visible en
  un curso y en ☀ Hoy; resaltado mientras está activo; parte apagado y no se recuerda). Activo, cada entrada pasa a dos
  partes (bitácora | columna de 320 px con línea a la izquierda). En un curso, cada pendiente va al lado de la **última
  clase anterior a la suya** (por la fecha de su clase): la más nueva tiene todo lo que viene y el ＋ (a la clase siguiente
  a ella); las demás, sin ＋. Lo que no tiene una clase anterior en la página va arriba, en "Pendientes sin una clase
  anterior" (solo si hay); en General (solo notas) ese cuadro es la lista completa con ＋. En ☀ Hoy, al lado de cada clase
  del día, los pendientes de sus clases siguientes, con ＋. Fuera el cuadro "☑ Pendientes" de arriba y los plegables de
  cada clase (con eso queda sin uso el plegado de la deuda CN). En la columna angosta, la fecha de la clase y las semanas
  van bajo el texto. El celular no cambia.
- **Prueba (local, datos reales, solo mirando):** Cuarto: apagado no se ve nada; al activar, Lun 19/10 tiene los 2 del
  lun 26/10 y el ＋, Lun 12/10 el del 19/10, Lun 28/9 los 5 del 5/10, y las clases sin pendientes quedan en blanco
  alineadas; ☀ Hoy del 19/10: Orientación 3, Tercero 1, Cuarto 2, Cuerdas 9; General: 61 en el cuadro de arriba con ＋;
  apagar lo oculta todo; sin errores.

- **Arreglo (2026-10-24, reportado por el PO):** al escribir "/bug …" o "/mejora …" en un pendiente, el guardado
  automático (600 ms sin escribir) lo pasaba a 🐞 Mejoras a mitad de escribir, cortado. Ahora `guardarTexto` no lo
  convierte en el guardado automático: pasa recién con Enter o al salir del cuadro (o al cerrar, `guardarTodo`).
  Probado: escribiendo con pausas de 1,2 s el pendiente siguió en la lista; al salir quedó "🐞 prueba … borrar" completo
  (borrado después).

### CR. Pizarra con el Entrenador encima — flechas, letra que se detiene y dos Entrenadores
*Origen: bitácoras revisadas con el PO (2026-10-24; Notion: tarjetas "Pizarra: flechas ↑ ↓ no mueven la letra y ← →
sacan de la canción", "Pizarra: con audio sonando, al salir de la pantalla la letra deja de avanzar" y "Dos sesiones del
Entrenador en la Pizarra: la última pisa a la anterior"). PO: "deberían pisarse nomás".*
- **Auditoría:** (1) en la Pizarra, las flechas iban a las diapositivas de abajo (invisibles) y, con una letra "dejada",
  ← → la soltaban; dentro de la copia, ↑/↓ cambiaban el verso solo un instante, porque el Entrenador del profe la
  devolvía a su verso cada 300 ms; además, en 15 canciones hay versos sin tiempo dentro de una letra sincronizada, y ↓
  sobre ellos saltaba de vuelta al anterior (también en el Entrenador del profe). (2) La copia en modo Scroll copia el
  desplazamiento del Entrenador del profe; si ese queda oculto (escribiendo la bitácora), deja de moverse y la Pizarra
  también. (3) Dos Entrenadores proyectando mandan su estado a la vez y la Pizarra salta entre ambos.
- **Arreglo:** (1) en la Pizarra con el Entrenador encima, ↑/↓ mueven el verso en el Entrenador del profe (o en la
  copia si ya no proyecta) y ← → no hacen nada; los versos sin tiempo se eligen sin mover el audio y el aviso de tiempo
  siguiente no los cambia. (2) Sonando una letra sincronizada, la copia centra sola su verso activo; detenida, sigue
  copiando la vista del profe. (3) El último Entrenador que proyecta manda; el anterior deja de proyectar solo.
- **Implementación (2026-10-24):** `REPERTORIO/index.html`: versos con `sinTiempo` (los de una letra sincronizada que
  no encontraron su tiempo); ↑/↓ y el clic los eligen sin mover el audio, y `entLineaManualHasta` evita que el aviso de
  tiempo siguiente cambie el verso elegido con el audio detenido. Copia (`?espejo=1`): las flechas van a `espejoTecla`
  (↑/↓ → mensaje `tecla` al Entrenador del profe si está proyectando, o el verso local si la letra quedó "dejada"; ← →
  nada); sonando una letra sincronizada, la copia centra sola su verso (`espejoSigueSola`) y solo detenida copia el
  desplazamiento del profe; el profe con la pestaña oculta no manda desplazamiento. Profe: atiende `tecla` y, si otro
  Entrenador manda `on`, deja de proyectar. `PIZARRA/index.html`: con el Entrenador encima, las flechas se pasan a la
  copia (`espejoEntrenador.tecla`) y no mueven las diapositivas.
- **Prueba (local, clase simulada solo en el navegador, sin tocar Supabase):** El Guatón Loyola: un verso sin tiempo se
  recorre con ↓ ↓ ↑ (7, 8, 7) sin volver atrás; en la copia, ↓ llevó al profe del verso 3 al 4 y → no cambió de
  canción; un segundo Entrenador proyectando el verso 12 tomó la Pizarra y el primero se apagó solo; con el profe en
  otra pestaña y la canción sonando, la copia pidió centrar cada verso (14, 15, 17… 20). No probado: la Pizarra real en
  el proyector (requiere clase en curso).

### CS. Entrenador — versos pintados guardados en la sesión y modo 📖 Lectura
*Origen: bitácora 22/10 Séptimo ("pinté algunos coros, eso debería ser función del sistema y que persista por sesión") y
PO 2026-10-24 (modo "solo lectura": ↑ ↓ por los versos, sin play con espacio ni ← →, para leer la letra sin audio).
Notion: "Entrenador: modo solo lectura (versos con ↑ ↓, sin audio)". PO: "dale con esto".*
- **Auditoría:** los versos pintados (Shift+clic, estrofa con Ctrl+Shift+clic) se guardan solo en este equipo y por
  canción suelta (`entrenador_config_<id>`); al practicar una **sesión** (repertorio del curso) cada canción parte sin
  pintar. La sesión ya guarda por canción la velocidad, el tono y los loops dentro de `canciones` (JSON), con guardado
  diferido (`entPersistirConfigSesion`): ahí cabe también lo pintado, **sin cambio en Supabase**. Teclado: ↑ ↓ mueven el
  verso y el audio, ← → cambian de canción en la sesión, espacio y K reproducen, J / L saltan 5 s.
- **Diseño:** (1) en una sesión, lo pintado se guarda en la canción de la sesión (`coloreadas`) y vuelve al abrirla, en
  este equipo y en los demás; fuera de sesión sigue como antes. (2) Botón **📖 Lectura** junto a "Letra" (se recuerda en
  este equipo hasta apagarlo): ↑ ↓ cambian de verso sin mover el audio; espacio, K, J, L, ← y → no hacen nada; al
  activarlo se pausa el audio. El botón ▶ en pantalla sigue funcionando (es un clic deliberado).
- **Implementación (2026-10-24):** `REPERTORIO/index.html`: `entGuardarColoreadosSesion` (al pintar, despintar, pintar
  estrofa o limpiar) guarda con `entPersistirConfigSesion`, que ahora escribe también `coloreadas` en la canción de la
  sesión; al abrir una canción de la sesión se cargan. Botón `#ent-btn-lectura` (estilo de los botones del header,
  naranjo activo), `entLectura` en `localStorage` (`profe_ent_lectura`); con él, el teclado solo recorre versos
  (`entNavVerso(dir, true)`, sin mover el audio) e ignora espacio, K, J, L, ← y →; ↑ ↓ desde la Pizarra respetan el modo.
- **Prueba (local, sesión real Cuarto 2026, deshecho al final):** pintar el primer verso de El Dinosaurio Anacleto lo
  guardó en la sesión (`coloreadas: [0]` en Supabase) y al recargar volvió pintado; despintarlo dejó `coloreadas: []`.
  📖 Lectura: ↓ ↓ llevó al verso 2 con el audio en 0:00; espacio, K, → y L no reprodujeron ni cambiaron de canción.
- **Ajuste (2026-10-24, PO):** también se guardan en la sesión los **versos y estrofas escondidos** (`ocultas`): Alt+clic,
  Alt+doble clic y el botón "Letra" guardan con `entGuardarMarcasSesion` (antes `entGuardarColoreadosSesion`) y al abrir
  la canción de la sesión vuelven escondidos. El botón "Letra" ahora queda marcado al abrir una canción con versos
  escondidos (dos líneas antiguas lo apagaban siempre). Probado con Cuarto 2026: escondida la primera estrofa de
  Anacleto, al recargar volvió escondida con "Letra" marcado; mostrada otra vez (`ocultas: []`).
- **Ajuste (2026-10-24, PO, primera aplicación de la regla 11):** el verso escondido que se deja leer tenue al pasar el
  mouse (antes solo en el Entrenador mínimo del Plan) ahora vale en **todos** los Entrenadores del profe
  (`body:not(.espejo) .ent-lyric-line.oculta:hover`); la copia de la Pizarra no cambia. Lugares revisados (ver
  `LUGARES_DE_USO.md`): Biblioteca, sesión del curso, canción del Plan, mínimo y tecla T → sí; copia en la Pizarra → no, a
  propósito (lo ven los estudiantes). Pendiente de decisión del PO: Alt+clic dentro de la copia de la Pizarra.
- **Ajuste (2026-10-24, PO: "que funcione"):** Alt+clic y Alt+doble clic dentro de la copia de la Pizarra se le pasan al
  Entrenador del profe (mensaje `alt`, igual que las flechas), que esconde o muestra y la copia lo sigue; si el profe ya
  no proyecta (letra dejada), se hace en la copia. `entAltLinea` reúne la lógica del verso / estrofa. Probado con dos
  pestañas (clase simulada en el navegador): Alt+clic en la copia escondió el verso 2 y siguió escondido; otro Alt+clic
  lo mostró.

### CT. 🔴 Puntero en la Pizarra — mostrar a qué parte me refiero
*Origen: PO 2026-10-24: "en el mini entrenador del planer estoy haciendo referencia a cierta parte de la canción y ocupo
el mouse para mostrar eso, pensando en que el mouse se ve en la pizarra y claramente no se ve… no tiene que ser un
mouse… habría que pensar en qué otras partes del ecosistema necesitaríamos una funcionalidad tal". Notion: "Puntero en
la Pizarra: mostrar a qué parte me refiero".*
- **Auditoría:** todo lo que se proyecta desde la pantalla del profe (LUGARES_DE_USO.md): letra del Entrenador (completo,
  mínimo; copia `?espejo=1`), diapositivas (Vista previa y vista de clase del Plan → Pizarra), Cuaderno, Libro
  proyectado, Pasar lista, Metalófono / ritmos del Entrenador. Las pantallas miden distinto: la posición se manda
  relativa a lo señalado (verso + posición dentro del verso; diapositiva + posición proporcional).
- **DECISIÓN del PO (2026-10-24):** se enciende con un **botón 🔴 Puntero** (solo con la clase en curso); en la Pizarra
  se ve un **punto láser rojo** con estela corta, que se desvanece al dejar de mover el mouse; se parte por la **letra**
  (Entrenador completo y mínimo) y las **diapositivas** (Vista previa y vista de clase); después Cuaderno, Libro, Pasar
  lista y Metalófono.
- **Diseño técnico:** pieza nueva `comun/puntero.js` (`Puntero`): estado encendido compartido entre pestañas del equipo
  (`localStorage` + evento `storage`), emisor (posición relativa, máx. una vez por cuadro) y receptor que dibuja el punto
  (canal `profe-puntero`, misma computadora, sin internet). Emisores: Entrenador del profe (solo mientras proyecta) y
  Plan (solo sobre la diapositiva marcada "en Pizarra"). Receptores: copia del Entrenador (letra) y Pizarra
  (diapositiva, solo si no hay Entrenador encima).
- **Implementación (2026-10-24):** `comun/puntero.js` (nombre `Puntero` revisado en todo el repo: libre). Entrenador
  (`REPERTORIO/`): botón `#ent-btn-puntero` "🔴 Puntero" junto a 📽️ Pizarra, con espacio reservado y visible solo
  mientras se proyecta; el emisor manda verso (`orig`) + posición relativa dentro del verso (entre versos, el más
  cercano); la copia (`?espejo=1`) dibuja el punto. Plan (`PORTAL/`): botón 🔴 al lado de 🔔 (con la clase en curso),
  emisor sobre la diapositiva marcada `en-pizarra` en la Vista previa y en la vista de clase. Pizarra: dibuja el punto si
  el aviso es de su diapositiva actual y no hay Entrenador encima. Encendido compartido entre pestañas del equipo.
  Los avisos salen a lo más cada 25 ms (con intervalo y no por cuadro de animación, para que no se detengan con la
  ventana tapada).
- **Prueba (local, clase simulada solo en el navegador; Pizarra y Plan de una clase pasada solo mirando):** letra: el
  mouse en el verso 3 al 25 % dejó el punto en la copia en (331, 266), con el verso en (332, 267), y se desvaneció a los
  1,5 s; diapositiva: un aviso de la diapositiva 0 al (50 %, 25 %) quedó en (512, 212) de la Pizarra (esperado 512, 213);
  un aviso de otra diapositiva no lo mostró; Plan: el mouse sobre la diapositiva "en Pizarra" mandó `diapo 0 0.30 0.60`
  y al apagar avisó "fuera". No probado: proyector real.
- **Lugares de uso (regla 11):** Entrenador completo, mínimo del Plan, canción del Plan y sesión → sí (mismo archivo);
  copia de la Pizarra → receptor; Pizarra con la tecla T → no tiene botón visible sin proyectar (se elimina); Cuaderno,
  Libro, Pasar lista y Metalófono → fase 2 (decisión del PO).

### CU. "La bitácora cambió en otro equipo mientras escribías" con un solo computador
*Origen: bitácora 15/10 Segundo ("aparece mucho y no sé si tengo otra sesión abierta… es molesto") y PO 2026-10-24.
Notion: "\"La bitácora cambió mientras escribías\" aparece con un solo computador".*
- **Auditoría:** al guardar, cada página anota la hora del guardado para reconocer su propio aviso al instante (eco) que
  vuelve de Supabase; pero anota **solo el último**. Con internet lento, el eco de un guardado anterior llega cuando ya
  se guardó otra vez y se sigue escribiendo: no coincide con la hora anotada, el texto difiere y se avisa "cambió en
  otro equipo". Supabase no cambia la hora (se revisó: conserva la de la app). Mismo método en: bitácora ✍🏼 y por
  actividad del Plan, actividades del Plan, Cursos y Cuaderno; las **diapositivas** del Plan no reconocen su eco en
  absoluto (cualquier eco tardío mientras se escribe avisa "las diapositivas cambiaron…"). El celular (Cursos) ya lo
  hace bien: recuerda todos sus guardados recientes.
- **Arreglo (regla 11, todos los lugares):** pieza `TiempoReal.propios()` en `comun/tiempo-real.js` que recuerda los
  últimos 30 guardados (por hora o por texto); cada lugar anota cada guardado y descarta como propio el eco de
  cualquiera de ellos. Diapositivas: por el texto enviado.
- **Implementación (2026-10-24):** `TiempoReal.propios()` (últimos 30; por fecha-hora, que compara igual aunque venga
  escrita distinto, o por texto). Usado en: Plan — bitácora ✍🏼 y por actividad (`memPropios`), actividades
  (`planPropios`), diapositivas (`presPropios`, por el texto enviado); Cursos (`curPropios`); Cuaderno (`propiosCdn`).
  El celular ya tenía su propio conjunto (`enviados`), sin cambios.
- **Prueba (local, Cursos de Cuarto, sin guardar nada):** con dos guardados anotados, el eco tardío del primero (texto
  distinto, entrada con cambios sin guardar) no avisó; un cambio con otra hora sí avisó "cambió en otro equipo".
  `propios` reconoce la misma hora escrita de otra forma y olvida la más vieja al pasar el máximo.
- **Lugares de uso (regla 11):** los seis lugares que muestran el aviso o reciben ecos (Plan ×3, Cursos PC, celular,
  Cuaderno) quedan con el mismo método.
- **Arreglo (2026-10-24, reportado por el PO en clase: "no aparece, estoy en el entrenador mínimo"):** el botón 🔴 del
  Entrenador solo se mostraba mientras ese Entrenador proyectaba, y la decisión del PO era "solo con la clase en
  curso" (como en el Plan). Ahora se ve con la clase en curso, igual que 📽️ Pizarra; el punto se dibuja mientras ese
  Entrenador proyecta (el título del botón lo explica). Probado: sin clase, oculto; con clase y sin proyectar, visible.
- **Arreglo (2026-10-24, reportado por el PO: "sobre diapos sí se ve; sobre entrenador no"):** la copia de la Pizarra
  esconde todo lo que cuelga directo del `body` salvo la letra (`body.espejo > *:not(...) { display: none }`), y el punto
  se agregaba ahí: quedaba dibujado pero invisible. La prueba anterior miraba solo su opacidad y posición, no si se veía.
  Ahora `puntero.js` cuelga el punto y la estela del `<html>`, fuera del `body` (vale para cualquier página). Además, en
  la letra el punto se ubica por la **letra (carácter)** bajo el mouse (`punteroLetraEn` / `punteroRectLetra`): en la
  Pizarra la letra es más grande y la proporción del verso no caía sobre la misma palabra. Probado: la "g" de "guatón"
  está en (580, 325) en la copia y el punto cayó en (579, 325), visible (captura).
- **Validación del PO (2026-10-24):** en la Pizarra real el punto se ve sobre la letra (Entrenador mínimo) y sobre las
  diapositivas. Queda la fase 2.
- **Fase 2 — auditoría (2026-10-24):** Pasar lista (mismo tablero en el Plan y en la Pizarra, tarjeta por estudiante
  `data-id`), Cuaderno (mismo cuaderno, misma hoja, zoom y desplazamiento), Metalófono del Entrenador (misma copia de las
  placas `data-midi`) y Participación del Libro (mismo tablero, tarjeta `data-eid`): en los cuatro se puede ubicar el
  punto sobre lo mismo. Evaluaciones y Entregas del Libro proyectan una lámina distinta a la pantalla del profe: quedan
  fuera. El Metalófono suelto (pestaña) no se proyecta: no aplica.
- **Decisión del PO (2026-10-24):** **un solo botón 🔴, el de la barra del Plan**, para todos los casos (letra,
  diapositivas, Pasar lista, Cuaderno, Metalófono, Participación); se quita el botón 🔴 Puntero del Entrenador. Pasar
  lista y el Cuaderno tapan la barra y la Participación está en la pestaña 📒 Libros: se enciende antes y puede quedar
  encendido toda la clase (el punto solo aparece al mover el mouse sobre lo proyectado).
- **Implementación fase 2 (2026-10-24):** `Puntero` admite varios receptores por página (el primero que ubica el aviso lo
  dibuja) y suma `relativo` / `enElemento`. Emisores: Pasar lista (`asistencia.js`, tarjeta `data-id`), Cuaderno
  (`cuaderno.js`, página a la vista: por id de hoja o por orden, solo proyectando), Metalófono del Entrenador (placa
  `data-midi` dentro de su marco, solo proyectando) y Participación del Libro (`ppro-tile` `data-eid`, solo proyectando
  a la Pizarra; el Libro carga ahora `puntero.js`). Receptores en la Pizarra (Pasar lista, Participación, Cuaderno) y en
  la copia del Entrenador (Metalófono). Fuera el botón "🔴 Puntero" del Entrenador.
- **Prueba fase 2 (local, sin clase):** avisos enviados a mano a la Pizarra de prueba: Pasar lista (tarjeta 8 al 25 %):
  punto en (433, 320,5), esperado (433, 321); Participación (tarjeta 6 al centro): (837, 317,5), esperado (837, 318);
  Cuaderno de Primero (hoja con dibujo, 50 % · 30 %): (756,6, 256,6), esperado (757, 257); Metalófono de la copia
  (placa 94): (542,9, 225,4), esperado (543, 225). Visible en captura en los cuatro. Entrenador sin el botón y Libro sin
  errores al cargar. Hallazgo: en `asistencia.js` y `libro-proyeccion.js` el nombre `CSS` es su hoja de estilos (se usa
  `window.CSS.escape`). No probado: el emisor con el mouse real y el proyector.

### CV. Plan — el recurso de una actividad se abre como en la Presentación
*Origen: 🐞 Mejoras (Segundo, clase del 22/10/26), PO 2026-10-24. Notion: "Recurso de una actividad: abrirlo como en
Presentación, no en pestaña nueva".*
- **Auditoría:** el chip de una canción o recurso en la card de la actividad (columna Plan) llama `abrirCancionCurso`,
  que abre el Entrenador del curso en una pestaña del Workspace; el mismo chip en el cuadro de la actividad de la
  Presentación llama `abrirMini` (Entrenador mínimo sobre Presentación + Vista previa y, con la clase en curso, la letra
  en la Pizarra). La vista de clase ya usaba `abrirMini`.
- **Decisión del PO (2026-10-24):** que el chip del Plan haga lo mismo que el de la Presentación.
- **Implementación:** el clic del chip en la card llama `abrirMini(cancion, actividad, asset)`.
- **Lugares de uso (regla 11):** chip en la card del Plan, chip del cuadro de la Presentación y panel de la vista de
  clase: los tres abren ahora el Entrenador mínimo. `abrirCancionCurso` quedó sin uso y se retiró (regla 10).

### CW. Pizarra — reloj de tiempo perdido visible pero detenido
*Origen: PO 2026-10-24. Notion: "Pizarra: reloj de clase visible pero detenido".*
- **Auditoría:** el 🎮 de la barra del Plan (y Ctrl + Shift + Espacio) echa a correr o detiene el tiempo perdido
  (`ClaseVivo.togglePerdido`). La Pizarra lo muestra en grande, parpadeando, solo mientras corre (`#clase-perdido`); al
  detenerlo desaparece. No hay forma de dejarlo a la vista quieto.
- **Decisión del PO (2026-10-24):** el 🎮 abre un menú que reúne todo: echar a correr / detener y mostrarlo u ocultarlo
  en la Pizarra.
- **Implementación:** `ClaseVivo` guarda `perdidoVisible` en el estado de la clase (`verPerdido(on)`). La Pizarra lo
  muestra si corre (parpadea, como hoy) o si está visible (quieto, sin parpadear, en rojo). Menú del 🎮 en el Plan:
  ▶ Echar a correr / ⏸ Detener y el interruptor 👁 En la Pizarra (Visible / Oculto); mientras corre, se ve siempre.
  El atajo Ctrl + Shift + Espacio sigue igual.
- **Lugares de uso (regla 11):** el 🎮 solo existe en la barra del Plan; el contador solo en la Pizarra.

### CX. Cancionero en la Pizarra — 🎲 al azar y revisar que se vean todas las canciones
*Origen: bitácora 08/10 Séptimo ("se pelean por la siguiente canción") y PO 2026-10-24. Notion: "Cancionero en la
Pizarra: botón 🎲 al azar + revisar que se vean todas las canciones".*
- **Auditoría:** con la lista de la sesión (☰) abierta en el Entrenador del curso, la Pizarra muestra las canciones como
  tarjetas (`espejoCancionero`). Prueba con la sesión más larga (Séptimo, 15 canciones) a 1024 × 768: se ven las 15,
  ninguna cortada. El Entrenador mínimo del Plan no tiene cancionero.
- **Decisión del PO (2026-10-24):** 🎲 sortea y abre: en la Pizarra las tarjetas se iluminan una tras otra unos 3 s
  (como el 🎲 de Participación), se detiene en una y el Entrenador la deja lista para tocar. No repite las canciones ya
  sorteadas en esta clase (salvo que ya hayan salido todas).
- **Lugares de uso (regla 11):** el 🎲 va en la lista de la sesión del Entrenador (Biblioteca y pestaña de la sesión
  del curso); la animación, en la copia de la Pizarra. El Entrenador mínimo no tiene lista (no aplica).
- **Prueba CW (local, sin publicar clase):** Pizarra con el tiempo detenido y "visible": se ve 01:23 quieto, sin
  parpadear; oculto: desaparece; corriendo: parpadea como antes. Menú del 🎮 en el Plan: se ve completo bajo el
  contador; ▶/⏸ y el interruptor cambian sin cerrarlo.
- **Implementación CX:** botón "🎲 Al azar" en la cabecera de la lista de la sesión (`entSortear`): elige entre las que
  no han salido hoy en esa sesión (`localStorage profe_sorteo_<sesión>_<fecha>`; si salieron todas, parte de nuevo; nunca
  la que está puesta), recorre todas en desorden frenando 3 s, abre la elegida y 2 s después cierra la lista (la Pizarra
  pasa a la letra). El estado del sorteo viaja en el espejo (`sorteo`) y la Pizarra lo anima con su propio reloj.
- **Prueba CX (local):** Séptimo: recorrió 13 canciones, cayó en la elegida (late), la abrió, cerró la lista y el
  segundo sorteo no repitió. Copia de la Pizarra con 15 tarjetas: recorrido en amarillo y la elegida latiendo, visible.

### CY. Libro — nombre sin apellido cuando el repetido se retiró · "OA:" como objetivo
*Origen: bitácora 08/10 Séptimo (dos Agustina, una se retiró) y PO 2026-10-24. Notion: "Libro: nombre con apellido
aunque ya quede un solo estudiante con ese nombre" y "Objetivo: \"OA:\" funciona igual que \"O:\"".*
- **Auditoría:** el Libro contaba los nombres repetidos con toda la matrícula del año, retirados incluidos
  (`cargarNombresRepes`). Pasar lista, Evaluar del celular y el tablero de Participación (abierta) ya contaban solo a los
  activos. El objetivo se reconocía solo con "O:" (`EditorBloques`, opción `objetivo`; "📥 Traer lo del mes" de
  Planificaciones).
- **Decisión del PO (2026-10-24):** si hay dos nombres iguales se muestran con apellido; si uno se retira de la escuela,
  la otra se muestra sin apellido. "OA:" funciona igual que "O:".
- **Implementación:** `cargarNombresRepes` cuenta solo la matrícula activa (talleres: pertenencias, sin cambio).
  `esObjetivo` acepta "O:" u "OA:"; en Planificaciones, "OA:" llega al relato como "Objetivo de aprendizaje (OA)". Texto
  de ayuda del Plan actualizado.
- **Lugares de uso (regla 11):** nombres → Libro (todas sus vistas usan `nombresRepes`); Pasar lista, Evaluar y
  Participación ya seguían la regla. Objetivo → actividades del Plan (editar y vista de clase, misma pieza) y
  Planificaciones.
- **Prueba:** Séptimo: antes salían con apellido "Agustina" y "Camila"; ahora solo "Camila" (dos activas). Editor:
  "OA: …" y "O: …" destacados, "OAX: …" no.

### CZ. Pizarra — revisar el resaltado de versos y estrofas proyectado
*Origen: bitácora 15/10 Segundo ("resaltado de versos y estrofas parece que no funciona bien con proyección en
Pizarra"). Notion: "Pizarra: revisar resaltado de versos y estrofas en proyección". El PO no recordaba el detalle;
acordado (2026-10-24): reproducir, arreglar solo lo que falle.*
- **Prueba (local, sin clase: el Entrenador de Segundo emitiendo a mano a una copia `?espejo=1`, sin guardar nada):**
  verso pintado (Shift + clic), estrofa (Ctrl + Shift + clic), verso activo pintado (rojo), Diapositiva, sonando 12 s
  con la copia siguiendo sola, cambio de canción, borrar todo (Shift + doble clic): la copia muestra siempre los mismos
  versos pintados y el mismo verso activo (comparado verso a verso y en captura). Desde el 15/10 cambiaron esta parte CR
  y CS; el pintado no se pudo hacer fallar.
- **Hallazgo y arreglo:** al volver de Diapositiva a Scroll, la lista de la sesión (☰) se abría sola aunque estuviera
  cerrada; proyectando, la Pizarra pasaba de la letra al cancionero (tarjetas) sin pedirlo. Ahora se reabre solo si
  estaba abierta al pasar a Diapositiva (`entSetViewMode`). Probado: abierta → ida y vuelta → abierta; cerrada → ida y
  vuelta → cerrada.
- **Lugares de uso (regla 11):** el cambio es del Entrenador (Biblioteca y pestaña de la sesión del curso); el mínimo
  del Plan no tiene lista; la copia de la Pizarra no está en modo sesión.

### DA. Entrenador — volumen en la barra y desde el celular
*Origen: bitácora 13/10 Sexto y PO 2026-10-24. Notion: "Entrenador: barra de volumen y control de volumen desde el
celular".*
- **Auditoría:** el Entrenador no tiene control de volumen. Suenan tres cosas: la canción (elemento de audio, o el
  tono cambiado por `entPitchCtx`), los ritmos (`ritmo-render.js`, sus buses salen directo a los parlantes) y el
  Metalófono del Entrenador (su marco, con Tone.js). La copia de la Pizarra siempre va muda. El celular y el PC son
  equipos distintos: solo se pueden hablar por internet (Supabase); ya existe un canal así (Pizarra remota,
  `pizarra:<sesión>`), sin tablas.
- **Decisión del PO (2026-10-24):** el volumen aplica a **todo** lo que suena en el Entrenador, **incluidos los
  ritmos** (autoriza tocar el motor de ritmo protegido, solo para esto); en el celular, **🔊 Volumen en el inicio con la
  clase en curso**.
- **Diseño:** pieza `comun/volumen.js` (`Volumen`): nivel 0–100 y silencio, recordado en el equipo (`localStorage`,
  todas las pestañas al tiempo); con la clase en curso escucha y avisa por un canal de Supabase sin tablas
  (`profe-volumen`), así el celular lo cambia y ve el nivel del PC. Entrenador: barra 🔊 (ancho fijo) junto a la
  velocidad; aplica el nivel a la canción, a los ritmos y al Metalófono. Motor de ritmo: un solo nodo de volumen a la
  salida (`RITMO_UI.volumen(v)`), sin tocar tiempos ni sonidos. Celular: botón 🔊 VOLUMEN con − / + / 🔇 y la barra.
- **Lugares de uso (regla 11):** Entrenador de la Biblioteca, de la sesión del curso y mínimo del Plan (mismo archivo,
  mismo nivel); copia de la Pizarra: sigue muda.
- **Implementación (2026-10-24):** `comun/volumen.js`; Entrenador: barra 🔊 (118 px fijos) junto a la velocidad,
  `entAplicarVolumen` (audio, `entPitchSalida` para el tono cambiado, `RITMO_UI.volumen`, `Tone.Destination` del
  Metalófono); `ritmo-render.js`: `salidaGeneral` + `volumen(v)` (los buses pasan por un nodo más; tiempos y sonidos
  iguales), cargado como `?v=da1`; celular: tarjeta 🔊 VOLUMEN en "En clase" (`MOVIL/index.html`), `volumen.js` en la
  lista sin señal (`sw-movil.js`, copia v7). Mientras se toca en el celular, las respuestas atrasadas del PC no pisan lo
  tocado (1,5 s) y luego se pide el nivel real.
- **Prueba (local; la clase solo simulada en la memoria de la pestaña del PC, sin publicarla):** canción 60/30/silencio
  → volumen del audio 0,6 / 0,3 / 0; ritmo: un solo nodo a los parlantes, 0,40 → 0,80 al cambiar sonando; Metalófono:
  50 % = −6 dB, silencio = mudo; celular ↔ PC: el celular mostró "PC: 100 %", tres "−" rápidos → PC 70 % (audio 0,7),
  🔇 → "en silencio", de nuevo → 70 %. Captura del celular y de la barra. No probado: dos equipos reales y el proyector.

### DB. Entrenador — canción sin audio: fuera todo lo de audio
*Origen: PO 2026-10-24 ("le doy a play y cambia a pausa, pero nada más… algo debería pasar").*
- **Auditoría:** 35 canciones de la Biblioteca tienen letra y no tienen audio (Melodía ni Karaoke). En ellas el ▶ solo
  cambia a ⏸ (`entrenadorTogglePlay` llama `play()` sobre un audio vacío). El modo 📖 Lectura no cambia el reproductor:
  lo deja a la vista y ▶ reproduce.
- **Decisión del PO (2026-10-24):** sin audio, con la letra abierta, desaparece todo lo que tiene que ver con el audio,
  sin que la barra se mueva: barra de avance, tiempo, ⏪ ▶ ⏩, velocidad, Pitch, 🎤 Melodía/Karaoke, Sync, 🔊 y ⟳ loops.
  Quedan Letra, Lectura, Editar, 🔎, Scroll/Diapositiva, 📽️ Pizarra y la lista. Espacio no hace nada; ↑ ↓ pasan de
  verso como en Lectura; ← → siguen cambiando de canción. Ritmos y Metalófono de la canción conservan su ▶.
- **Implementación:** clase `sin-audio` en el Entrenador (`entPintarSinAudio`, al abrir una canción y al cargar cada
  recurso): lo de audio queda invisible con su espacio reservado (regla 8b); el panel de loops se cierra.
- **Lugares de uso (regla 11):** Entrenador de la Biblioteca, de la sesión del curso, mínimo del Plan (mismo archivo).
- **Prueba (local, sesión de Segundo, sin guardar nada):** La vicuñita (sin audio): reproductor de abajo oculto, Pitch,
  velocidad y 🔊 ocultos con su espacio; ↓ pasó al verso 1; Espacio no hizo nada. La Señora Interesante (con audio): todo
  a la vista y en las mismas posiciones (los botones de arriba no se movieron un píxel entre una y otra). Captura.
- **Ajuste del PO (2026-10-24, "está bien y es deseable, pero feo"):** el reproductor de abajo **desaparece** (la letra
  ocupa ese espacio) y lo de audio de la barra de arriba queda **deshabilitado** (atenuado, sin responder, en su lugar).
  Probado: la letra llega al borde inferior (720 de 720); Pitch, velocidad, 🔊 y Sync al 35 %. Captura.

### DC. Entrenador — reproductor en una sola franja
*Origen: PO 2026-10-24 ("revisa cómo se ven los controles de audio en el entrenador, son feísimos: ¿por qué?").*
- **Auditoría (captura):** (1) ⏪ ⏩ son emojis: Windows los dibuja como cuadros azules con brillo, sin los colores del
  Entrenador; (2) dos franjas (barra de avance + tiempo solo en otra línea, y debajo, tras una raya, los botones): ~95 px
  para poco; (3) la barra de avance es una línea de 6 px sin punto; (4) estilos mezclados (círculo naranjo, cuadros
  azules, el 🔊 emoji y la barra del navegador del volumen de DA).
- **Decisión del PO (2026-10-24):** una sola franja con ⏪ ▶ ⏩ dibujados en el estilo del Entrenador, tiempo, barra de
  avance con punto para arrastrar, duración y el volumen al final (se baja de la barra de arriba).
- **Implementación:** `#ent-controles` = una fila: botones con íconos SVG (`entIcono`), ▶/⏸/■ por `entPintarPlay`,
  tiempo actual y duración a los lados de la barra (`entPintarTiempo`), punto que sigue al avance y se arrastra
  (`entrenadorSeek` con puntero), volumen con ícono dibujado y barra propia (relleno naranjo). Tema claro y oscuro. Sin
  audio (DB) la franja sigue desapareciendo.
- **Lugares de uso (regla 11):** Entrenador de la Biblioteca, de la sesión del curso y mínimo del Plan (mismo archivo);
  la copia de la Pizarra no muestra el reproductor.
- **Prueba (local, La Señora Interesante, sin guardar nada):** franja de 57 px (antes ~95) con ⏪ ▶ ⏩ dibujados,
  "0:02" · barra con punto · "2:28" · volumen; ▶ → ⏸ al reproducir y de vuelta; el punto sigue el avance; volumen al
  40 % pinta su barra hasta la mitad; tema claro (captura) y oscuro (colores revisados). Sin audio la franja no aparece.
- **Ajuste del PO (2026-10-24, "no sirven, sácalos"):** fuera ⏪ ⏩ (saltaban 10 s). Siguen J / L (5 s) y ↑ ↓ por verso.
- **Ajuste del PO (2026-10-24, "me arrepentí; devuélvelos"):** vuelven dos botones con otra función: ⏮ al comienzo de
  la canción (audio a 0, sin verso activo, letra arriba) y ⏭ al primer verso de la estrofa siguiente a la del verso
  activo (`entIrAlComienzo`, `entSiguienteEstrofa`). Probado (La Señora Interesante): ⏭ → verso 0 (0,1 s), ⏭ → verso 5,
  estrofa 2 (17,6 s); ⏮ → 0,0 s sin verso activo.

### DD. ✉️ Mensajes — qué decirle a quién (/mensaje en cualquier pendiente)
*Origen: bitácora 22/10 Séptimo ("iterar mensajes a profes") y PO 2026-10-24. Notion: "Mensajes pendientes para
personas específicas".*
- **Auditoría:** los pendientes (`comun/pendientes.js`) ya reconocen comandos al comienzo: `/bug` y `/mejora` sacan
  el texto de la lista y lo anotan en 🐞 Mejoras (categoría `mejora_app`), recién al terminar de escribir (Enter o
  salir). El cuadro del pendiente es de varias líneas; hoy Enter termina.
- **Decisión del PO (2026-10-24):** `/mensaje` en cualquier pendiente: primero el destinatario, Enter, el mensaje y
  Enter final. Se ven en el **Dashboard** (pestaña ✉️, junto a Hoy / Todos / Apoderados) y en el **celular sin clase**.
- **Diseño:** sin cambios en Supabase: misma tabla `pendientes`, categoría `mensaje`, texto = "destinatario⏎mensaje"
  (conserva el curso y la clase donde se escribió). Pieza `comun/mensajes.js` (`Mensajes`) + `comun/mensajes.css`:
  lista agrupada por persona, ✓ Dado (queda en gris y se deja de ver a las 2 semanas, como los pendientes), ✕ borrar,
  al instante entre equipos (Realtime de `pendientes`, ya activo). En el pendiente, con `/mensaje` el primer Enter baja
  de línea y el segundo lo envía; si queda sin mensaje, sigue como pendiente (no se pierde).
- **Lugares de uso (regla 11):** todo cuadro de pendientes (Dashboard, Plan, Bitácora, Cursos, celular) por la pieza
  compartida; la lista en Dashboard y celular (sin clase).
- **Implementación (2026-10-24):** `pendientes.js`: `partesMensaje` / `comoOtra` (una sola salida para /bug, /mejora y
  /mensaje, al crear y al cambiar); con `/mensaje` y sin mensaje aún, Enter baja de línea. `comun/mensajes.js` +
  `mensajes.css`: lista por persona (pendientes primero, con su número), curso y fecha de origen al margen, ✓ Dado / ↺,
  ✕ borrar, copia en el equipo para verla sin señal, al instante por Realtime. Dashboard: pestaña ✉️ con el número por
  dar. Celular (sin clase): tercera pestaña ✉️; `sw-movil.js` copia v8 con las dos piezas nuevas.
- **Prueba (local; un mensaje de prueba en Supabase, borrado al final):** en Generales del Dashboard, "/mensaje Prueba
  Claude" + Enter bajó de línea; mensaje + Enter (y salir) → aviso "Anotado en ✉️ Mensajes para Prueba Claude.", salió
  de los pendientes y apareció en ✉️ agrupado ("Prueba Claude 1", 💼 · 24/10); ✓ lo dejó tachado y el número en 0; ↺ lo
  devolvió; ✕ lo borró (Supabase sin rastro). Celular: pestaña ✉️ sin errores. Captura del Dashboard.

### DE. Comandos /pdte, /msj, /bug y /mejora en el editor de bloques; /msj con dos puntos
*Origen: PO 2026-10-24 (tras DD). Notion: "Comandos /pdte, /msj, /bug, /mejora en el editor de bloques".*
- **Auditoría:** el editor de bloques (`comun/editor-bloques.js`) ya convierte un bloque en pendiente desde ⋮⋮ / clic
  derecho (opción `alPendiente`, el texto queda), solo en la bitácora ✍🏼 del Plan y en Cursos (curso y ☀ Hoy). No la
  tienen: actividades del Plan, bitácora por actividad (vista de clase), Historial del Plan y Cursos del celular. "/" en
  un bloque vacío abre el menú de tipos y se come la barra (no se puede escribir "/pdte"). `Pendientes.crear` devuelve
  `null` cuando el texto es /bug, /mejora o /mensaje (las páginas lo leen como error).
- **Decisiones del PO (2026-10-24):** `/msj` = `/mensaje`; sintaxis única en todas partes: `/msj destinatario: mensaje`
  (una línea). En los cuadros de pendientes el comando sigue sacando el texto de la lista; en el editor de bloques el
  texto **se queda** marcado (☑ / ✉️ / 🐞 / ✨) y genera el pendiente / mensaje / mejora. Comando nuevo `/pdte`.
- **Diseño:** `pendientes.js`: `partesMensaje` con "destinatario: mensaje" (acepta `/msj` y `/mensaje`); sin el Enter
  que bajaba de línea; `crear` devuelve `{ otra, aviso }` para lo que no es pendiente; `Pendientes.desdeTexto(texto,
  { cid, sesionId, despuesDe | desde })` = crear desde un texto del editor con la regla de destino de siempre (el
  pendiente va a la clase siguiente; mensaje / mejora quedan con el curso y la clase de origen) y devuelve el aviso.
  Editor: Enter en un bloque que empieza con un comando completo lo envía y deja el bloque marcado; "/" en un bloque
  vacío escribe la barra y abre el menú (con "Anotar: ☑ Pendiente · ✉️ Mensaje · 🐞 Bug · ✨ Mejora", que escribe el
  comando); seguir escribiendo cierra el menú.
- **Lugares de uso (regla 11):** los 8 editores: bitácora ✍🏼 del Plan, actividades del Plan, bitácora por actividad,
  Historial del Plan, Cursos (curso y ☀ Hoy), Cursos del celular. El Historial del Plan y Cursos siguen la regla de
  Cursos (clase → siguiente; nota → desde su fecha).
- **Implementación (2026-10-24):** `pendientes.js`: `partesMensaje` con dos puntos (`/msj` y `/mensaje`; sin dos puntos,
  un salto de línea separa), sin el Enter que bajaba de línea, `crear` devuelve `{ otra, aviso }` y `desdeTexto`.
  `editor-bloques.js`: `comandoDe` + Enter (envía, deja el bloque marcado al confirmar; si falla, el comando queda
  escrito), "/" escrita + menú con sección "Anotar" (títulos de sección en `abrirMenu`), elegir un tipo borra la "/".
  Conectado en los 8 editores (CURSOS ×2 con `desdeTexto`; PORTAL: bitácora ✍🏼, actividades, bitácora por actividad e
  Historial con `planPendienteDesde`; MOVIL/cursos.html carga `pendientes.js` con cola sin señal).
- **Prueba (local):** editor en un cuadro aparte con envío simulado: "/pdte Revisar flautas" ⏎ → "☑ Revisar flautas";
  "/msj UTP: traer la planificación" ⏎ → "✉️ UTP: …"; "/bug …" ⏎ → "🐞 …"; "/msj sin dos puntos" ⏎ → no se envía (queda
  igual); "/" → menú con "Anotar"; Pendiente → escribe "/pdte "; Título 1 → la "/" se borra (captura del menú). Envío
  real: `/msj Prueba Claude: …` → ✉️ Mensajes; un pendiente de Segundo desde el 22/10 → clase del jue 29/10; ambos
  borrados. Cursos y Cursos del celular cargan sin errores. No probado: escribir con el teclado real del celular.

### DF. Celular — 👪 citas a apoderados
*Origen: PO 2026-10-24 ("hemos desarrollado algunas cosas… deberían poder reflejarse también en la PWA móvil"; de las
opciones propuestas eligió solo las citas a apoderados).*
- **Auditoría:** el celular ya tenía ✉️ (sin clase), 🔊 (en clase) y los comandos en pendientes y Cursos. Las citas a
  apoderados (`comun/apoderados.js`, BK) solo estaban en el PC (Dashboard, Plan, Cursos). La pieza funciona con toques;
  sus estilos son claros (el celular es oscuro). Sin señal no guarda (avisa), como en el PC.
- **Decisión del PO (2026-10-24):** llevar las citas a apoderados al celular.
- **Implementación:** inicio del celular sin clase: pestaña 👪 (todas, con su número) y "👪 Llamadas y citas de hoy"
  arriba de ☀ Hoy (abre en Hoy si hay); estilos oscuros y botones más grandes para el dedo (solo en el celular, sin
  tocar la pieza); `sw-movil.js` copia v9 con `apoderados.js` / `.css`.
- **Lugares de uso (regla 11):** `apoderados.js` gana un lugar (celular); LUGARES_DE_USO actualizado.
- **Prueba (local, tamaño celular; una cita de prueba creada y borrada):** sin citas, la pestaña 👪 muestra "Sin citas
  pendientes" y ＋ Cita; con una llamada para hoy, el celular abrió en ☀ Hoy con "👪 Llamadas y citas de hoy" arriba
  (No contestó / ✓ Atendido) y la pestaña 👪 con 1. Captura. Observado (ya existía, no se tocó): en "De días anteriores"
  el texto largo queda en una columna angosta.
- **Arreglo (PO 2026-10-24):** en "De días anteriores" del celular el texto quedaba en ~90 px (en la misma fila iban el
  curso y Aceptar / Rechazar). Ahora los botones van en una segunda línea a la derecha y el texto usa todo el ancho
  (solo en esa lista del celular, `#sug`). Captura.

### DG. Entrenador en el celular (docente) y para alumnos (enlace / QR por canción)
*Origen: PO 2026-10-24 ("muy importante para implementar pronto: el entrenador versión móvil").*
- **Auditoría:** el Entrenador (`REPERTORIO/index.html?practicar=…`) en un celular (375 px) no sirve: la barra de
  arriba se sale de la pantalla, la lista de la sesión ocupa una columna fija y la letra queda chica. El Metalófono ya
  tiene un "modo alumno" en el mismo archivo (sin Supabase, enlace corto `m/?a=&n=`). Las canciones y sus recursos se
  leen con la llave pública (como la Biblioteca); los recursos tienen estado editorial (publicado / borrador…).
- **Decisión del PO (2026-10-24):** dos usos: (B) el docente en su celular y (C) los alumnos por enlace o QR, **solo
  por canción**. Orden: **primero el docente, luego los alumnos**.
- **Etapa 1 (docente), diseño:** el mismo Entrenador con un **modo celular** (`?movil=1`, mismo archivo: una mejora
  llega a ambos, regla 11). Entrada: 🎵 ENTRENADOR en el inicio del celular (en clase abre el curso en curso). Pantalla
  de cursos → canciones del curso (su sesión) en lista grande → letra grande con su audio: arriba ← volver, nombre,
  📖 Lectura, Letra y ☀/🌙; abajo la franja (⏮ ▶ ⏭, avance, Melodía / Karaoke); tocar un verso va ahí; deslizar ← →
  cambia de canción. Sin edición (Editar, Sync, loops, Pitch, Pizarra, puntero quedan en el PC). Sin señal: más adelante.
- **Etapa 2 (alumnos):** la misma vista sin PIN ni datos del curso, solo una canción y solo con recursos publicados;
  "Compartir" (enlace + QR) en la canción.
- **Avance etapa 1 (2026-10-24, sin cerrar):** modo `?movil=1` en el Entrenador (pantalla de cursos → canciones,
  Entrenador sin herramientas de edición, deslizar ← → cambia de canción) y 🎵 ENTRENADOR en el inicio del celular (en
  clase con `&ctx=` del curso en curso). Probado solo el recorrido: 12 cursos → 2 canciones → Entrenador abierto con la
  lista lateral oculta. **Falta:** revisar cómo se ve la letra y la barra en el teléfono (capturas), probar deslizar y
  el audio en un celular real; luego la etapa 2 (alumnos).
- **Prueba del PO en su celular (2026-10-25) y arreglos:** (1) la flecha atrás del teléfono sacaba al inicio del
  celular: ahora cada pantalla deja un paso en el historial (cursos → canciones → canción); atrás y la ← de la pantalla
  vuelven un paso. (2) Ícono del curso repetido (ctxDisplay ya lo trae): fuera el extra. (3) **Los audios no sonaban**:
  el inicio del celular guardaba en el equipo el volumen que le informaba el PC (p. ej. en silencio) y el Entrenador del
  mismo celular lo tomaba como propio. Ahora el control del celular no lo guarda y el Entrenador en el celular suena a
  todo volumen (se maneja con los botones del teléfono). Probado con el volumen guardado "en silencio": audio a 1, sin
  silenciar; atrás: canción → lista de Segundo → cursos; ← de pantalla igual. Captura del Entrenador en el teléfono.

### DH. Celular — sin clave, menú ☰ con la Biblioteca, "Cargar versión nueva"; Biblioteca con Cursos / Otras sesiones
*Origen: PO 2026-10-25, tras probar DG en su celular ("todo funciona, ahora algunos detalles").*
- **Decisiones del PO:** (1) **sin clave en el celular** (lo usa solo el PO; en el PC sigue); (2) en las sesiones del
  Entrenador del celular, un selector **Cursos / Otras sesiones**; (3) sin clase, la página principal son los
  pendientes y se agrega un **menú** cuyo primer ítem es el Entrenador, que en el celular se llama **"Biblioteca"**
  (para estudiar las canciones de las sesiones; no para subir canciones, tablaturas ni MIDI; más adelante quizá letras
  y administrar las canciones de las sesiones); (4) **"Cargar versión nueva"** como el "Recargar" del PC.
- **Implementación:** `MOVIL/index.html` sin la pantalla de clave (también `cursos.html` y `evaluar.html` dejan de
  pedirla); ☰ en el encabezado con 📚 Biblioteca · ✍🏼 Bitácora · 🔄 Cargar versión nueva (punto naranjo si hay);
  aviso "🔄 Hay una versión nueva — Cargar" arriba (revisa `version.json` al abrir, al volver y cada 5 min; cargar pide
  al servidor las páginas y piezas del celular y la Biblioteca, renueva el modo sin señal y recarga); sin clase sale la
  fila Bitácora / Entrenador (todo está en el menú); en clase el botón se llama 📚 BIBLIOTECA. Biblioteca del celular
  (`REPERTORIO/?movil=1`): título 📚 Biblioteca, pestañas Cursos (la sesión de cada curso) / Otras sesiones (las demás
  con canciones); la lista es por sesión.
- **Prueba (local, tamaño celular):** sin la sesión guardada, el inicio abre directo (sin clave); con una versión vieja
  anotada aparece "🔄 Hay una versión nueva — Cargar" y el punto en el menú; "Cargar versión nueva" recargó y el aviso
  se fue. Menú: 📚 Biblioteca · ✍🏼 Bitácora · 🔄 Cargar versión nueva. Biblioteca: 12 cursos / Otras sesiones (Cuecas
  2026 13, Mine 2, Pancho Morales 4, Salsas 3); Cuecas → 13 canciones; atrás vuelve a la pestaña Otras. Capturas.
- **Ajustes del PO (2026-10-25):** (1) menú **abajo a la izquierda**: botón ☰ redondo fijo y la lista encima de él (el
  encabezado queda solo con la fecha). (2) "No se ven las dos pestañas" de la Biblioteca: el celular abría una copia
  anterior de la Biblioteca guardada por el navegador; ahora la Biblioteca (menú y botón en clase) se abre con la
  versión en la dirección (`&v=`), así siempre llega la última. (3) **Con Pitch no sonaba**: con el tono cambiado el
  sonido sale por otro camino (`entPitchSalida`) que seguía usando el volumen guardado en el celular (en silencio);
  ahora todo el Entrenador del celular usa `entNivelVolumen()` = 1, y ▶ reanuda ese camino en el mismo toque.
- **Confirmado por el PO (2026-10-25):** Pitch y pestañas funcionan en su celular. **Ajustes:** letra de **tamaño fijo**
  en el celular (24 px, `ENT_MOVIL_FS`; el verso largo se parte en dos líneas) en vez de achicarla para que quepa el
  verso más largo; el nombre y artista ya no se repiten (queda la portada de la letra, sale el de la barra); sin
  📖 Lectura en el celular (botón fuera y apagada aunque haya quedado encendida). Probado con "Si Antes Te Hubiera
  Conocido" (Séptimo): letra a 24 px, versos partidos, barra solo con ←, tema y Letra. Captura.
- **Arreglo (PO 2026-10-25, captura del Dashboard):** "Anotado en ✉️ Mensajes para …" salía en rojo bajo **todas** las
  listas de la página (una por curso). Ahora sale solo en la lista donde se escribió y en verde (es confirmación, no
  error); desde el editor de bloques no se repite (la página ya muestra su aviso). Probado: un /msj en el 4° grupo del
  Dashboard → un solo aviso, verde, en ese grupo; mensaje de prueba borrado.

### DI. Pendientes menos ruidosos · encabezado fijo · clic con la rueda en una clase
*Origen: PO 2026-10-25 (captura de los pendientes del Dashboard: "muy ruidosa visualmente") y del encabezado y calendario.*
- **Auditoría:** cada fila repetía la fecha de la clase (casi siempre la misma en el grupo) y la marca naranja
  "(N sem)"; los que llevan 3 semanas o más se pintaban con fondo naranjo y sumaban una fila "Lleva N semanas · Sigue ·
  Archivar". El encabezado "Pendientes / Hoy / Todos / Apoderados / ✉️" se iba al bajar. El clic en una clase del
  calendario siempre lleva a su Plan; no hay "abrir sin ir".
- **Decisión del PO (2026-10-25):** aplicar la propuesta: fecha una vez en el título del grupo (en la fila solo si es
  distinta); marca de semanas solo desde 3, como ⏳ gris; los de 3 semanas o más juntos al final, en un cuadro plegado
  con Sigue / Archivar. Además: el encabezado de Pendientes siempre a la vista; clic con la rueda en una clase = abrir
  su Plan en una pestaña sin ir a ella.
- **Implementación:** `pendientes.js`: cuadro plegado "⏳ Llevan 3 semanas o más · N" (`pd-viejos`), opción
  `fechaEnGrupo(fecha)` (la lista avisa la fecha común), marca ⏳ desde 3 semanas, Sigue / Archivar solo dentro del
  cuadro, sin fondo naranjo. Dashboard: fecha en el título de cada grupo, encabezado fijo (`position: sticky`), clic con
  la rueda (o Ctrl + clic) → `ws-abrir` con `fondo`; el Workspace abre la pestaña sin activarla.
- **Lugares de uso (regla 11):** la lista es la misma en Dashboard, Plan, Cursos y celular: en todas, ⏳ y el cuadro de
  los de 3 semanas o más; la fecha en el título solo donde la página tiene título de grupo (Dashboard); en las demás,
  la fecha sigue en la fila como antes.
- **Prueba (local):** Dashboard, vista Todos: 11 grupos con la fecha en el título ("· lun 26/10", "· jue 29/10"…; los
  Generales sin fecha), 0 fechas y 0 marcas de semana en las filas; Taller de Cuerdas con "⏳ Llevan 3 semanas o más ·
  2" plegado al final. Encabezado: tras bajar 600 px sigue arriba del panel. Workspace: clic con la rueda en
  "Orientación" de la semana en curso → pestaña "Plan" nueva (5 pestañas) y la activa sigue siendo el Dashboard.

### DJ. Pendientes — menú con clic derecho (PC)
*Origen: PO 2026-10-25 (captura de los íconos ☀ ↳ ✕ al pasar el mouse).*
- **Decisión del PO (2026-10-25):** al pasar el mouse queda **solo el ☀**; con **clic derecho** sobre un pendiente, un
  menú: ↳ Agregar subpendiente · ⤴ Volver a principal (en un subpendiente) · ✉️ Convertir en mensaje… · 📋 Crear
  actividad en el Plan · ✨ Convertir en mejora de la app · 🗑 Eliminar. Al convertir o crear la actividad, **el
  pendiente siempre sale de la lista**. Por ahora solo el PC (el celular se verá después).
- **Implementación:** `pendientes.js`: `abrirMenu` (clic derecho en la fila, listas no táctiles ni de sugerencias);
  mensaje: el menú pregunta "¿A quién?" y lo envía como `/msj a quién: texto`; mejora: `/mejora texto`; actividad:
  `plan_cards` al final del Plan de la clase del pendiente, con su texto como título, y el pendiente se borra; las
  conversiones se desactivan si el pendiente tiene subpendientes activos o no tiene texto (la actividad, también si no
  tiene clase). `pendientes.css`: ↳ y ✕ ocultos en el PC; estilos del menú.
- **Lugares de uso (regla 11):** todas las listas del PC (Dashboard, Plan, Cursos, bitácora); el celular sin cambios.
- **Prueba (local; 2 pendientes de prueba en Segundo, borrados al final con lo que generaron):** al pasar el mouse solo
  ☀; clic derecho → ↳ Agregar subpendiente · ✉️ Convertir en mensaje… · 📋 Crear actividad en el Plan · ✨ Convertir en
  mejora de la app · 🗑 Eliminar. "Convertir en mensaje…" preguntó "¿A quién?" → quedó en ✉️ Mensajes ("Prueba
  Claude") y salió de la lista; "Crear actividad" → actividad al final del Plan del jue 29/10 con el texto como título,
  aviso verde, y el pendiente salió. (Arreglado en la prueba: el menú se cerraba antes de preguntar a quién.)
- **Ajustes visuales (PO 2026-10-25):** "Completados" con menos jerarquía: "3 completados" en minúscula, letra normal,
  gris claro y alineado con el texto de los pendientes (sin el recuadro negro al tocarlo; igual el cuadro ⏳); la línea
  divisoria pasa a separar un curso del siguiente (ya no está entre el título y sus pendientes); "no hay pendientes"
  más tenue. Revisado: título sin línea, línea arriba de cada curso desde el segundo, "8 completados".
- **Más ajustes (PO 2026-10-25):** "N completados" sin negrita, en cursiva y solo al pasar el mouse; en el Dashboard va
  en el título del curso, a la derecha (opción `compEnTitulo` + `lista.completados()`), así un curso sin pendientes
  queda con el mismo aire arriba y abajo (la lista no ocupa espacio si no hay nada a la vista); el ＋ también solo al
  pasar el mouse; "Sexto - no hay pendientes" con el mismo espacio a ambos lados del guion (la fecha vacía ya no suma
  espacio). Medido: 11 px arriba / 10 px abajo en Sexto; 6 px entre el nombre y el guion; "2 completados ▸" abre y
  cierra sus 2.
- **Ajuste (PO 2026-10-25):** al pasar el mouse sobre un pendiente ya no aparece el cuadro del texto ni el puntero de
  escribir; se edita al hacer clic (ahí sí se marca el cuadro azul). Vale para todas las listas.
- **Ajuste (PO 2026-10-25):** el clic derecho sobre un pendiente ya no entra a escribir: solo abre el menú (DJ).

### DK. Editor de Melodías — ritmo con Espacio, notas por grado (1–7)
*Origen: PO 2026-10-25 ("un editor de melodías, sencillo, eficaz y rápido").*
- **Necesidad:** escribir rápido la melodía de una canción del repertorio, pensando en grados de la escala (do re mi
  = 1° 2° 3°) y no en nombres con sostenidos; que quede en la Biblioteca junto a la canción.
- **Decisión del PO (2026-10-25):**
  - Instrumento **general** por ahora (piano, guitarra, ukelele, bajo, metalófono, melódica); el registro de cada
    instrumento se trabaja después.
  - **Ritmo primero:** se eligen tempo, compás y la **figura más corta** (cada vez); metrónomo con precuenta; se
    tapea con **Espacio** (mantener = nota larga); se cuantiza y se revisa.
  - **Tonalidad:** cualquier tónica, **mayor o menor**; 1° = tónica.
  - **Notas:** se recorren los golpes y se asigna el grado con las **teclas 1 a 7**; ↑↓ octava; una tecla sube/baja
    medio tono solo esa nota.
  - **Vista:** bloques (largo = duración, alto = nota, con do re mi o 1° 2° 3°, a elección) **y** pentagrama abajo.
  - **Ritmo:** figuras simples (redonda, blanca, negra, corchea, semicorchea y silencios; 2/4, 3/4, 4/4).
  - **Se abre** desde la ficha de la canción ("＋ Melodía"), en una **pestaña del Workspace no fija**.
  - **Se guarda** como recurso **nuevo "Melodía"** de esa canción.
  - **Para más adelante (anotado):** tapear sobre el audio de la canción de la Biblioteca; registros por instrumento;
    que Entrenador, Plan y enlace de alumnos abran "Melodía".
- **Auditoría (2026-10-25):** los recursos viven en `repertorio_assets` (`tipo` es texto libre, sin restricción; la
  definición de un ritmo ya se guarda como texto en `contenido`), los archivos en el bucket `repertorio-assets`
  (`storage_path`); `TIPOS_ASSET` / `TIPO_ORD` de `REPERTORIO/index.html` dan ícono y orden. El Metalófono abre un MIDI
  por dirección (`abrirMetalofono`). VexFlow ya está guardado en `vendor/vexflow.js` (sin internet). El Workspace abre
  pestañas cerrables con `ws-abrir` (`guardarAlCerrar` para el aviso de guardado). **No hace falta cambiar Supabase.**
- **Diseño (aprobado por el PO 2026-10-25):**
  - Página nueva `MELODIA/index.html` (`?cancion=<id>` para crear, `?asset=<id>` para editar). Tres pasos en la misma
    pantalla: **① Ritmo** → **② Tonalidad** → **③ Notas**; se puede volver a ① sin perder las notas ya puestas.
  - ① Barra: tempo, compás, figura más corta, ● Grabar (precuenta de 1 compás). Al soltar, cuantiza; los huecos
    quedan como silencios. Corrección: elegir un compás y volver a tapear **solo ese compás**; escuchar el ritmo.
  - ③ Cursor en un golpe: 1–7 pone el grado y avanza; 0 = silencio; ↑↓ octava; + / − medio tono; ← → mover; Espacio
    escucha desde el cursor. Sonido sintetizado propio (sin bibliotecas nuevas).
  - Guardado: `repertorio_assets` con `tipo = 'melodia'`, `contenido` = la melodía en texto (compás, tempo, tónica,
    modo y cada nota como grado + octava + alteración + duración, así se puede transponer) y `tonalidad`; además un
    **MIDI** generado en `repertorio-assets/melodia/<id>.mid` (`storage_path`) para que el Metalófono lo abra desde
    el primer día.
  - Biblioteca: tipo "Melodía" en `TIPOS_ASSET`; en la ficha, "＋ Melodía" y en cada melodía ✏️ Editar, 🎹 Abrir en
    Metalófono y ⬇ MIDI.
- **Lugares de uso (regla 11):** ficha de la canción de la Biblioteca (PC, dentro y fuera del Workspace). Entrenador,
  Plan, celular y enlace de alumnos: **fuera de esta etapa** (decisión del PO).
- **Implementación (2026-10-25):** `MELODIA/index.html` (página nueva). Al tapear, un golpe corto dura hasta el
  siguiente y solo queda un silencio si se suelta y se espera ¾ de pulso o más (si no, todo tap corto quedaba como
  corchea + silencio); se compensa el retardo de los parlantes. Al poner un grado se elige la **octava más cercana a la
  nota anterior** (↑↓ corrige). Borrador en el equipo mientras no se guarda (se recupera al volver a abrir si nadie lo
  cambió). Pentagrama: clave de sol, armadura, figuras simples con ligaduras alineadas al pulso; la nota del cursor en
  naranjo. **MIDI:** el Metalófono solo acepta sus placas (MIDI 81–105, La5–La7), así que el MIDI se sube o baja de
  octava hasta caber (la melodía guardada no cambia) y, si igual no cabe, se avisa al guardar. Biblioteca: `TIPOS_ASSET`
  / `TIPO_ORD` + botón ♬ Melodía en "+ Agregar asset", `abrirEditorMelodia` (pestaña `melodia:<id>` con
  `guardarAlCerrar`), en la ficha 🎹 / ⬇ / ✏️ (el MIDI con marca `?v=` para no abrir una copia vieja); Entrenador:
  esconde las melodías de su desplegable; `comun/nombre-asset.js`: tipo "Melodía".
- **Prueba (local; un recurso de prueba en "Estrellita", borrado al final con su MIDI):** grabación con taps simulados
  a 120 → negras, blanca y silencio en su lugar; regrabar el compás 2 con 4 golpes conservó sus 4 notas; teclas 1–7,
  ← →, + y ↑↓ en Re mayor → re re la la si si la♯ sol, con pentagrama y ligadura entre compases; guardar → fila
  `melodia` + MIDI `MThd` en `melodia/<id>.mid`, la dirección pasa a `?asset=`; la ficha muestra ♬ Melodía con 🎹 ⬇ ✏️
  🗑; cambiar a Sol mayor y guardar → el Metalófono la abrió sin aviso de rango y a 100 de tempo; en el Workspace se
  abrió como pestaña cerrable y al cerrarla con un cambio sin guardar (tempo 104) se guardó solo. El borrador se
  recuperó al recargar. **No probado:** el sonido real (en la prueba no se escucha) ni el tapeo con una persona.
- **Ajuste (PO 2026-10-25):** botón **Limpiar** en la barra (con confirmación): borra ritmo y notas y vuelve a ①; lo
  guardado en la Biblioteca no cambia hasta Guardar. **Para más adelante (PO):** "Ajustar retraso" (8 clics tapeados
  para medir el retraso del parlante, recordado por equipo); con Bluetooth el tapeo llega 0,15–0,3 s tarde y el navegador
  no lo informa bien. Por ahora el PO usa parlante con cable.
- **Corregir el ritmo (PO 2026-10-25):** los silencios se arman **arrastrando el final de la nota** (borde derecho del
  bloque), siempre saltando a la figura más corta; el bloque entero se arrastra para moverlo; nunca se pisan dos notas.
  Teclas (pasos ① y ③): Shift+← → acortar/alargar · Alt+← → mover · D dividir en dos · U unir con la siguiente · Supr
  borrar. El tapeo sigue igual (un tap corto dura hasta el siguiente). Prueba: teclas → 0:4 acortada a 0:2 (silencio),
  movida a 2:2, tope contra la nota siguiente, dividir 4:4 → 4:2 + 6:2, unir y borrar; mouse (pestaña local) → borde de
  la 1ª nota arrastrado: 0:2 y silencio de corchea en el pentagrama; 2ª nota arrastrada hasta pegarse (2:4).
- **Bug (PO 2026-10-25):** Detener no paraba el sonido (las notas ya estaban programadas) y al volver a escuchar sonaban
  dos veces. Ahora cada escucha suena por su propia salida y Detener la corta de una vez. Medido: nivel 0,099 sonando →
  0 al detener y nada en el segundo siguiente.
- **Cambiar la nota arrastrando (PO 2026-10-25):** arrastrar un bloque **arriba/abajo** lo cambia de nota (fila de la
  escala, sin alteración; suena al cambiar); a los lados sigue moviéndolo en el tiempo (el primer movimiento decide);
  llevarlo a la fila "ritmo" lo deja sin nota y subir uno sin nota le da la de esa fila. Prueba: do → sol, "?" → la,
  mi♯ → re (sin ♯) y re → fila ritmo ("?"); pentagrama al día.
- **Escuchar desde el compás elegido (PO 2026-10-25):** ▶ Escuchar / Espacio parte en el compás elegido (clic en el
  compás o en una nota; ← → y poner un grado lo siguen); sin compás elegido, desde el comienzo. Vale en ① y ③.
  Prueba: clic en el compás 2 → parte en el tick 16; flecha a una nota del compás 1 → 0; sin elegir → 0.
- **Escuchar en la barra de arriba (PO 2026-10-25):** un solo botón ▶ Escuchar, entre ③ Notas y Limpiar, verde y más
  grande (ancho fijo; ■ Detener en ámbar mientras suena); se quitó de los paneles de ① y ③. La barra completa necesita
  ~1030 px de ancho.
- **Ajustes (PO 2026-10-25):** la nota que suena se pinta **naranja** (antes solo se aclaraba); en ① **½× / 2×** pasan
  todo el ritmo a la mitad / al doble (la figura más corta acompaña; no deja nada más corto que una semicorchea); en ③
  **Octava ↓ / Octava ↑** mueven toda la melodía (sin salir del rango). Prueba: 4 negras → ½× corcheas → ½×
  semicorcheas → ½× avisa; 2× 2× → negras; octava ↑ hasta el tope avisa; nota sonando rgb(249, 115, 22).
- **Pentagrama en una línea, alineado con los bloques (PO 2026-10-25):** una sola fila horizontal; cada compás mide lo
  mismo que arriba y cada figura cae en la posición de su tiempo (se corrige la que reparte VexFlow); clave, armadura y
  compás quedan fijos a la izquierda, del mismo ancho que la columna de nombres de filas (se ajusta a la armadura); se
  desplaza junto con los bloques (y con la rueda sobre el pentagrama). Los bloques ganan el alto sobrante. Medido:
  barras de compás en las mismas x (101 / 341 / 581) y cada cabeza de nota a +2 px del inicio de su bloque; desplazamiento
  igual en ambos. No revisado con captura (el panel estaba oculto).
- **Tonalidad y canción (PO 2026-10-25):** la tonalidad ya se guardaba (en la melodía y en `tonalidad`); ahora la ficha
  de la Biblioteca la muestra en cada melodía ("Estrofa · Re mayor"). Botón **🎵 Canción** en la barra del editor, solo
  si la canción tiene audio (espacio reservado si no): abre la canción en el Entrenador (`REPERTORIO/?cancion=`) en una
  pestaña cerrable del Workspace (o ventana nueva). Prueba: Estrellita (sin audio) → oculto; Invincible (con audio) →
  visible; clic → pestaña "Estrellita ¿Dónde Estás?" con el Entrenador.

### DL. Piano para estudiantes (estilo Synthesia) + instrumentos y digitaciones en el Editor de Melodías
*Origen: PO 2026-10-25 ("el piano synthesia-like, este sí que es de frentón para compartir con estudiantes").*
- **Necesidad:** que el estudiante practique una melodía en casa viendo las notas caer sobre un teclado, con la
  digitación puesta por el profe y pudiendo ir subiendo la velocidad.
- **Decisión del PO (2026-10-25):**
  - En el editor se dice **para qué instrumentos es la melodía** (piano, metalófono, etc.) y **en cada instrumento por
    separado** se definen sus digitaciones.
  - El estudiante **solo mira**: las notas caen y suenan; toca a la par en su instrumento real.
  - Velocidad **como el Metalófono**: − / + a mano y 🔁 +5 por vuelta (con precuenta entre vueltas) hasta un tope.
  - Llega por **enlace / QR**, como el Metalófono del alumno (sin clave, sin base de datos).
- **Auditoría (2026-10-25):** el modo alumno del Metalófono se abre con `m/?a=<id>&n=<nombre>` y solo baja un archivo
  público del bucket; el botón 🔗 Compartir de la ficha usa `navigator.share` o copia el enlace y solo aparece en lo
  **publicado**. La melodía (DK) guarda sus notas en `repertorio_assets.contenido`, que un estudiante sin base de datos
  no puede leer → hace falta un archivo público de la melodía. 🔁 +5 del Metalófono: botón encendido/apagado + tope,
  recordados en el equipo; al detener vuelve a la velocidad inicial. No hace falta cambiar Supabase.
- **Diseño (aprobado por el PO 2026-10-25):**
  - **Editor — paso ④ Digitación:** arriba, los instrumentos de la melodía (Piano · Melódica · Metalófono · Guitarra ·
    Ukelele · Bajo; se marcan los que correspondan) y una pestaña por instrumento marcado. En la pestaña, se recorren las
    notas y se pone el dedo con **1–5** (0 = sin dedo); se ve el número sobre cada bloque y en el pentagrama. Cada
    instrumento guarda su propia digitación (en la misma melodía, nota a nota, así sobrevive a correcciones del ritmo).
  - **Archivo público:** al guardar, además del MIDI, `repertorio-assets/melodia/<id>.json` (notas ya en alturas reales,
    tempo, compás, tonalidad, digitaciones y nombre).
  - **Piano (`PIANO/index.html`, página nueva):** teclado del rango de la melodía (octavas completas, mínimo 2); las notas
    caen como barras con su dedo adentro (y do re mi, opcional) y la tecla se ilumina al sonar; sonido de piano
    sintetizado; precuenta de 1 compás; tempo con − / + y 🔁 +5 hasta un tope; celular horizontal y PC. Usa la digitación
    de Piano (si no hay, la de Melódica; si no, sin números).
  - **Compartir:** en la ficha, cada melodía con Piano o Melódica marcado tiene 🎹 (abre el piano) y, si está publicada,
    🔗 Compartir → enlace corto `p/?a=<id>&n=<nombre>` (como `m/`).
  - **Etapas:** ① instrumentos y digitación en el editor + archivo público · ② el piano · ③ compartir.
- **Lugares de uso (regla 11):** Editor de Melodías (paso ④), ficha de la Biblioteca (🎹 y 🔗), piano del estudiante
  (enlace). Entrenador, Plan y Pizarra: fuera de esta etapa.
- **Implementación (2026-10-25):** Editor: paso **④ Digitación** ("Para": instrumentos marcados; "Digitación de":
  una pestaña por instrumento; 1–5 pone el dedo y avanza a la nota siguiente, 0 / Retroceso lo quita; el dedo se ve en
  el bloque y sobre la nota del pentagrama); en la melodía: `inst` y cada nota con `dig` ({ piano: 3, … }; dividir lo
  conserva); `repertorio_assets.instrumento` = los instrumentos; al guardar sube también `melodia/<id>.json` (alturas
  reales, nombres, dedos, tempo, compás, tonalidad). **`PIANO/index.html`** (página nueva, sin base de datos, lee ese
  archivo): teclado de octavas completas (mín. 2) del rango de la melodía, notas que caen (dos compases a la vista; en
  pantallas bajas menos, ≥ 45 px por pulso) con el dedo en un círculo (se achica para caber), la que suena y su tecla en
  naranja con el dedo encima, "do" marcado en cada do, do re mi opcional, precuenta grande, sonido de piano sintetizado,
  − / + y 🔁 +5 con tope (se recuerdan en el equipo; al detener vuelve a la velocidad inicial; las vueltas se revisan
  con un reloj propio, no con el dibujo), ⛶ pantalla completa, aviso "Gira el celular" en vertical. Usa la digitación de
  Piano (si no hay, la de Melódica). **`p/index.html`**: enlace corto que redirige al piano. Biblioteca: en cada melodía
  con Piano o Melódica, 🎹 (pestaña cerrable del Workspace) y, si está publicada, 🔗 Compartir (`p/?a=&n=`); el
  Metalófono de la melodía pasa a 🎼 y solo aparece si está marcado Metalófono (o si no tiene instrumentos); al borrar
  una melodía (o su canción) se borra también su archivo público.
- **Prueba (local; una melodía de prueba en "Estrellita", borrada al final con su MIDI y su archivo):** sin instrumento
  avisa "Primero marca para qué instrumento es"; Piano + Metalófono con dedos distintos por instrumento → el archivo
  trae ambos; el piano abrió por `p/` con el nombre, 24 teclas (do4–si5), dedos de Piano, tecla y nota en naranja al
  sonar; 🔁 +5 a 200 con tope 210 → 200 → 205 → 210 y queda en 210; Detener vuelve a 200; sin 🔁 termina solo; celular
  horizontal 740×360: dedos visibles. Ficha: 🎹 🎼 ⬇ ✏️ 🗑 ("PRUEBA CLAUDE · Do mayor"); publicada → 🔗 Compartir copia
  `https://patolastra.github.io/profe-apps/p/?a=…&n=…`. **No probado:** un celular real, el sonido real, iPhone. Las
  melodías guardadas antes de esto no tienen archivo público: se crea al guardarlas de nuevo.
- **Melodía al centro (PO 2026-10-25, captura de "COQUETA — Mambo"):** el teclado ya no parte en el do de abajo y se
  alarga hacia arriba (la melodía quedaba a la izquierda): se cuenta en teclas blancas, una de aire a cada lado y se
  completa alternando izquierda/derecha hasta 14 blancas (dos octavas). Medido en Coqueta (do5–sol♯5): 216 px a la
  izquierda y 254 a la derecha en 756 px (la diferencia es menos de una tecla).
- **Compases que aparecen mientras se tapea (PO 2026-10-26):** al grabar se veían solo los dos primeros compases y lo
  tapeado después quedaba fuera de vista. Ahora los compases nuevos se agregan a medida que avanza la grabación (siempre
  uno por delante) y la vista los sigue. Prueba (simulada, 10 s a 240): de 2 a 11 compases (1…11), los 3 golpes a la
  vista y la vista corrida al final. No probado tapeando a mano (el panel estaba oculto).
- **En el menú + del Workspace (PO 2026-10-26):** ♬ **Editor de Melodías** y 🎹 **Piano** en el catálogo del Workspace.
  Abiertos sin dirección, cada uno muestra su lista: el editor, las canciones con buscador (primero las que tienen
  melodías), con ✏️ por melodía y ＋ Nueva melodía; el piano, las melodías (primero las marcadas para Piano o Melódica).
  Solo esa lista del piano usa la base de datos; el enlace del estudiante (`?a=`) sigue sin tocarla. Prueba: menú con
  ambos; elegir "COQUETA — Mambo" en el piano lo abrió; ✏️ en el editor abrió la melodía (38 bloques).

### DM. Ritmos: apartado con ⏱ Metrónomo (sube de a 5) y 🪘 Cajón
*Origen: PO 2026-10-26 ("una app metrónomo… ir subiendo de 5 en 5 bpm cada cierta cantidad de compases; dentro de
todo un apartado de ritmos, con la app de ritmos de cajón").*
- **Necesidad:** practicar con el curso (o en casa) un ritmo que acelera de a poco, sin estar cambiando el tempo a mano.
- **Decisión del PO (2026-10-26):**
  - **Apartado Ritmos:** una pestaña del Workspace con pestañas propias arriba — ⏱ Metrónomo · 🪘 Cajón — y espacio
    para sumar más; reemplaza a "🪘 Cajón" en el menú +.
  - **Metrónomo:** cifra de compás, bpm mínimo, bpm máximo, sube **+5** cada N compases.
  - Al llegar al máximo: **se queda o se detiene**, a elección del usuario.
  - Ajustes: **acento en el 1** (apagable), **subdivisión** (corcheas o tresillos suaves), **precuenta** (1 compás).
  - Vista **grande para proyectar**: bpm actual gigante, los tiempos como círculos que se encienden, "sube en N compases".
- **Auditoría (2026-10-26):** el Cajón (`CAJON-PERUANO/index.html`, deuda CH) es una página suelta; solo la abre el
  catálogo del Workspace (`cajon`), nadie más la enlaza → puede vivir dentro del apartado sin romper nada. No hay
  metrónomo propio en el ecosistema (los de Metalófono/Editor/Piano son internos). No hace falta Supabase.
- **Diseño (aprobado por el PO 2026-10-26):**
  - `RITMOS/index.html` (página nueva): barra de pestañas ⏱ Metrónomo · 🪘 Cajón (el Cajón se carga adentro, tal cual,
    al abrir su pestaña; la pestaña elegida se recuerda en el equipo). Workspace: "🥁 Ritmos" en lugar de "🪘 Cajón".
  - Metrónomo: controles arriba (compás 2/4 · 3/4 · 4/4 · 5/4 · 6/8; mínimo; máximo; "subir +5 cada [4] compases";
    al llegar al máximo: Quedarse / Detener; Acento en el 1; Subdivisión: no · corcheas · tresillos; Precuenta) y un
    ▶ / ■ grande; todo se recuerda en el equipo. Al centro: el bpm actual muy grande, los círculos del compás (el 1 de
    otro color), compás n° y "sube a 100 en 2 compases" (o "máximo"). Sonido sintetizado con reloj del audio (exacto);
    Espacio = ▶ / ■. Si mínimo = máximo, es un metrónomo fijo.
- **Lugares de uso (regla 11):** Workspace (menú +). Cajón: sin cambios por dentro.
- **Implementación (2026-10-26):** `RITMOS/index.html` (página nueva): pestañas ⏱ Metrónomo · 🪘 Cajón (el Cajón se
  carga adentro al abrir su pestaña y el metrónomo se detiene; la pestaña se recuerda). Metrónomo programado por
  adelantado con el reloj del audio (exacto); el tempo cambia solo al empezar un compás; la precuenta (1 compás al bpm
  mínimo) no cuenta para subir; 6/8 = 2 pulsos de negra con punto (la subdivisión son sus 3 corcheas); los ajustes se
  recuerdan en el equipo; Espacio = ▶ / ■. Workspace: "🥁 Ritmos" reemplaza a "🪘 Cajón" en el menú +.
- **Prueba (local):** con el reloj simulado, 100→110 de a 5 cada 2 compases con precuenta y "Se detiene": precuenta,
  100 100 105 105 110 110 y termina solo; "Se queda": sigue en 110; 6/8 a 60: 2 pulsos por compás. En vivo: círculos
  y "Compás 4 · sube a 85 en 1 compás"; la pestaña Cajón abre el Cajón y detiene el metrónomo. **No probado:** el
  sonido real y en el proyector.
- **Mano izquierda / derecha (PO 2026-10-26):** en el editor, la melodía de Piano se marca para **una** mano (todavía
  no a dos manos); la Melódica no elige mano. En el piano: aviso de qué mano es, colores por mano **como Synthesia**
  (derecha verde, izquierda azul; listos para cuando haya dos manos) y un botón ✋ en la esquina inferior derecha (como
  el Lector) con el diagrama de **la mano en uso**, dedos del 1 (pulgar) al 5 (meñique). La mano del Lector no sirve tal
  cual (es de guitarra: índice = 1, sin pulgar) → se dibuja una propia. Los dedos en las notas siguen solo con número.
- **Implementación (2026-10-26):** Editor: en ④, con la digitación de Piano, "Mano: Derecha / Izquierda" (espacio
  reservado, oculto para otros instrumentos); se guarda en la melodía (`mano`, solo si es izquierda) y en el archivo
  público (`mano`). Piano: aviso "✋ Mano derecha / izquierda" en la barra con el color de la mano; notas con colores de
  Synthesia (derecha verde, izquierda azul; cada nota puede traer su propia mano para cuando haya dos); botón ✋ justo
  sobre el teclado a la derecha → diagrama dibujado de la mano en uso, vista desde arriba, 1 pulgar … 5 meñique (la
  izquierda es el espejo). Las melodías ya guardadas quedan como mano derecha.
- **Prueba (local):** Coqueta → "✋ Mano derecha" en verde, notas verdes, diagrama derecho (pulgar a la izquierda);
  forzada a izquierda → aviso azul y diagrama espejo (pulgar a la derecha). Editor: "Mano" aparece solo con Piano,
  parte en Derecha, Izquierda queda guardada en la melodía y vuelve al recargarla.
- **Bug (PO 2026-10-26):** al cambiar la mano, el botón Guardar seguía apagado y decía "Guardado ✓" (el cambio sí
  quedaba en la melodía, pero la barra no se actualizaba). Arreglado. Prueba con Coqueta: cambiar la mano → "Sin
  guardar" y Guardar encendido; volver a la mano original → "Guardado ✓" (no se guardó nada).
- **Barra del metrónomo ordenada (PO 2026-10-26):** dos filas con título — **Tempo** (desde / hasta, sube +5 cada N
  compases, en el máximo) y **Sonido** (compás, subdivisión, acento en el 1 y precuenta) — separadas por líneas finas,
  y ▶ Tocar más grande a la derecha, centrado entre las dos. Revisado con captura a 1600 px.
- **Fijo o va subiendo (PO 2026-10-26):** en la fila Tempo, **Fijo / Va subiendo** (se recuerda). En Fijo solo queda
  el bpm; "hasta", "sube +5 cada" y "en el máximo" se ocultan guardando su lugar (barra estable) y el tempo no cambia.
  Prueba (reloj simulado): Fijo con 90 / 140 / cada 1 → siempre 90; aviso "Fijo a …"; al volver a Va subiendo
  reaparecen los controles.
- **Fijo compacto (PO 2026-10-26, captura):** en Fijo quedaba un hueco entre el número y "bpm" (lo oculto guardaba su
  lugar). Ahora en Fijo lo de "va subiendo" desaparece del todo: queda "[80] bpm" junto a Fijo / Va subiendo (va al
  final de la fila, así que nada más se mueve). Medido: el grupo pasa de 261 a 118 px y "bpm" queda pegado al número.

### DN. Libros — n° de participantes de cada instancia
*Origen: PO 2026-10-26 (captura de la columna de Libros: "Primero (24)", con su ícono).*
- **Decisión del PO:** en la columna de instancias de Libros, cada una con su número de participantes entre paréntesis.
- **Implementación:** `LIBROS/index.html` cuenta como arma la lista el Libro: curso = matrícula **activa** del año;
  instancia con población vinculada (Orientación, Enlaces → Octavo) = la matrícula de ese curso; taller = sus
  pertenencias. El número va en gris claro junto al nombre; se cuenta al abrir la pestaña (sin cambios en Supabase).
- **Prueba (local):** Primero (22) · Segundo (35) · Tercero (26) · Cuarto (25) · Quinto (34) · Sexto (36) · Séptimo (20)
  · Octavo (14) · Taller de Cuerdas (15) · Castigadas (5) · Kids Castigadas (7) · Recreo Entretenido (0) · Enlaces (14) ·
  Orientación (14).

### DO. Lector de tablaturas — interfaz mínima
*Origen: PO 2026-10-26 ("el lector tabs, quiero minimizar la interfaz").*
- **Decisión del PO:** profesor y estudiante; **barras que se esconden** mientras suena (también la de abajo y ✋) y
  **quitar botones:** "Abrir Tablatura ▼" pasa a un solo **Abrir** (fuera "Sube desde tu computador"), **Play y Pausa
  en un botón**, sin el reloj 0.00s, velocidad sin la barra deslizante (− 100% +). El loop IN/OUT se queda.
- **Antes de tocar el archivo:** los cambios sin guardar del Loop IN/OUT (en pausa) se apartaron con
  `git stash` ("Loop IN/OUT en pausa … apartado 2026-10-26") y se devolvieron después, sin mezclarlos con este commit.
- **Implementación (`tabs/index.html`):** Abrir → la biblioteca directo; ▶ PLAY / ⏸ PAUSA en un botón de ancho fijo
  (el de pausa queda oculto porque otras partes lo usan); reloj y barra de velocidad ocultos (el código los sigue
  actualizando). Interfaz mínima: a los 2 s de sonar sin mover el mouse ni tocar, la barra de arriba sube y
  desaparece y la de abajo y ✋ bajan y se esconden (también el puntero); vuelven al mover, tocar, usar la rueda o una
  tecla; en pausa, todo a la vista; no se esconden con Pistas, el panel de alumnos o la mano abiertos.
- **Lugares de uso (regla 11):** el Lector es un solo archivo: profesor (Workspace, Biblioteca, Entrenador) y estudiante.
- **Prueba (local, "Dedo 2, sexta cuerda"):** barra: Abrir · ▶ PLAY · ↺ · IN · OUT · ✕ loop · − + 100% · Pistas · Afinar;
  al tocar ▶ pasa a ⏸ PAUSA; sin mover el mouse, a los 2 s la barra de arriba queda en opacidad 0 y corrida hacia arriba
  y ✋ en 0; ⏸ pausa y todo vuelve; ▶ de nuevo reproduce. **No probado:** la vista del estudiante en un celular.
- **Una sola tira (PO 2026-10-26):** la barra queda en **una fila**: badge del instrumento (con canción y etiqueta ·
  dificultad en dos líneas) a la izquierda, los botones al centro y el badge del estudiante a la derecha; los costados
  se achican con puntos suspensivos y los botones nunca se mueven aunque esos badges aparezcan o desaparezcan.
  **▶ Play** se convierte, al sonar, en **⏸ Pausa + ↺ Inicio** en el mismo espacio (176 px); en pausa vuelve ▶ Play.
  En pantallas angostas (≤ 1000 px) la tira se compacta (botones más chicos, sin separadores ni datos de la canción).
  Prueba: 1366 px → alto 53 px, instrumento 16–239, botones 255–1112, estudiante 1128–1350; ▶ → ⏸ Pausa + ↺ Inicio sin
  mover IN (533 px); 1100 px y 740 px → una fila sin desborde (a 740 los badges quedan casi solo en ícono).
- **Solo símbolos (PO 2026-10-26):** ▶ · ⏸ · ↺ sin texto (con su nombre al pasar el mouse); el grupo baja de 176 a
  104 px (88 en pantallas angostas). Prueba: ▶ ocupa el grupo; al sonar, ⏸ y ↺ de 41 px cada uno (pantalla angosta).
- **Más aire (PO 2026-10-26):** la tira sube de 53 a 70 px de alto (más margen arriba/abajo y a los lados, botones un
  poco más grandes y separados). Sigue en una fila a 1366 px (botones 252–1114, con instrumento y estudiante a los lados).
- **Bug: mensaje inicial (PO 2026-10-26, captura con "Comienza leyendo… A TU RITMO"):** el mensaje del ejercicio llega
  un poco después de abrir la tablatura; si alcanzaban a dar Play, la tablatura seguía sonando detrás del mensaje.
  Ahora, al aparecer el mensaje, lo que suena se detiene y vuelve al inicio, y mientras el mensaje está a la vista Play
  no hace nada; con "Entendido ✓" todo sigue normal. Prueba: sonando → aparece el mensaje → detenido; Play con el mensaje
  → nada; tras cerrar → suena.
- **Sin nombre del estudiante, cifrado latino y nombres completos (PO 2026-10-26):** se quita de la barra el badge con
  el nombre del estudiante; la tira queda "instrumento + canción" (todo el espacio que sobra) · botones, así el nombre
  de la tablatura y su descripción ya no se cortan. **Cifrado latino siempre** (Do, Re, Mi…; también el bajo de los
  acordes con barra: Sol/Si) en la tablatura, la ventana de Acordes y el editor de cifrado del profe (lo guardado no
  cambia por dentro); se esconde el botón C→Do. Prueba (1366 px, "Impostor Syndrome · PRIMERA MITAD · Media"): nombre y
  descripción completos; Acordes: Sol, Mim, Lam, Re, La, Do, Mi, Sim, Dom; C→Do y nombre del estudiante ocultos.
- **Diagramas sobre la barra · Acordes pausa (PO 2026-10-26, captura):** los diagramas AHORA / PRÓXIMO tapaban la
  barra de avance: ahora se ubican sobre su borde superior (o al fondo si no hay barra), aunque la barra esté escondida
  en ese momento; siguen a la vista mientras suena. Abrir "🎸 Acordes" con la tablatura sonando la pausa. Prueba
  (1366 × 700, Impostor Syndrome): barra desde 640 px → diagramas terminan en 628 px (antes 688, encima de la barra);
  sonando → Acordes → en pausa.
- **Afinador con los tres instrumentos (PO 2026-10-26):** el afinador abre en el instrumento de la tablatura y arriba
  tiene 🎸 Guitarra · 🪕 Ukelele · 🎸 Bajo para cambiar ahí mismo (la cuerda que sonaba se calla); el capo de la
  tablatura solo cuenta si se afina ese mismo instrumento; las teclas 1–N siguen al instrumento elegido. Prueba (tab de
  guitarra): Mi Si Sol Re La Mi → Ukelele: La Mi Do Sol (teclas 1–4) → Bajo: Sol Re La Mi.
- **Diagramas sin tapar las cuerdas (PO 2026-10-26, captura):** con la ventana más baja, los diagramas quedaban encima
  del diapasón. Ahora van debajo del diapasón (hasta la barra de avance) si caben casi enteros; si no, en el hueco mayor
  (también puede ser arriba, bajo la barra de botones), achicándose hasta 50 % para no tapar cuerdas ni barras.
  Prueba (Impostor Syndrome, 1366 px de ancho): 768 px de alto → debajo (545–698, diapasón termina en 535, barra en
  708, 95 %); 640 px → arriba (80–193, diapasón empieza en 204, 71 %).
- **Diagramas siempre abajo (PO 2026-10-26):** nada de ponerlos sobre el diapasón: van siempre debajo; mientras la
  barra de avance se ve, se achican para caber (hasta 40 %), y cuando la interfaz mínima la esconde, crecen hasta su
  tamaño (con transición), y vuelven a achicarse al reaparecer la barra. Prueba (Impostor Syndrome, 1366 × 640;
  diapasón termina en 493, barra en 580): con barra → 42 % terminando en 570; barra escondida → 79 % terminando en 630.

---

### DP. Lector de tablaturas en el celular (estudiantes)
*Origen: PO 2026-10-26 ("seguimos con el lector de tabs: quiero ahora hacer una versión móvil").*
- **Necesidad:** que los estudiantes practiquen su tablatura desde el celular, con el audio y la partitura juntos.
- **Decisión del PO:** para **estudiantes** (solo leer, escuchar y practicar; sin edición ni paneles del profe);
  celular **horizontal** (en vertical pide girarlo); trae **audio + seguir la partitura** (▶/⏸, bola, barra de avance),
  **secciones y velocidad**, y **acordes / diagramas** (sin afinador). Se entra por el **enlace de particular de siempre**
  (`?p=`) y por un **enlace corto por tablatura** (como el del Metalófono).
- **Plan aprobado (PO 2026-10-26):** un solo Lector (`tabs/index.html`, regla §4.3) que se adapta solo al celular.
  Paso 1: modo celular horizontal con el enlace de particular, probado en Android. Paso 2: enlace corto
  `t/?a=<id>` + botón 🔗 en la Biblioteca, solo tablaturas **publicadas** (recomendación, a confirmar en el paso 2).
- **Antes de tocar el archivo:** los cambios sin guardar del Loop IN/OUT (en pausa) se apartaron con `git stash`
  ("Loop IN/OUT (pausa) - apartado para Lector movil", 2026-10-26); se devuelven al terminar, sin mezclarlos.
- **Lugares de uso (regla 11):** el Lector es un solo archivo: profesor (Workspace, Biblioteca, Entrenador) y estudiante
  (`?p=`). El modo celular solo se activa en pantallas táctiles chicas; el PC no cambia.
- **Paso 1 — implementación (`tabs/index.html`):** el Lector detecta un celular (pantalla táctil, lado corto ≤ 600 px)
  y se pone en modo celular (`html.movil`). El diapasón se dibuja en un lienzo de ~660 px de alto y se muestra
  achicado (`ESCALA_LIENZO`), un poco más arriba (24 % del alto) para dejar lugar a los diagramas de acordes debajo;
  los diagramas usan la misma escala para ubicarse. Barra: instrumento · Abrir · ▶ · − + % · 🎸 Acordes (sin loop,
  Pistas, Afinar ni C→Do); barra de avance y ✋ más compactas. En vertical, pantalla "🔄 Gira tu celular". Al primer
  toque pide pantalla completa y deja fijo el horizontal (si el celular lo permite). En PC no cambia nada.
- **Prueba (local, 740 × 360 táctil, enlace de Kalen, "He Barrido el Sol · Estrofa"):** lienzo 1357 × 660 mostrado
  en 740 × 360 (escala 0,55); diapasón de 76 a 234 px; barra arriba hasta 52 px; barra de avance desde 308 px;
  sonando, los diagramas van bajo el diapasón (al 40 % con la barra visible, ~65 % con ella escondida). En vertical
  (375 × 812) se ve "Gira tu celular". PC (1024 × 768): sin escala ni cambios en la barra. **No probado:** un celular
  real (sonido, pantalla completa, giro fijo); se prueba en Android al publicar.
- **Prueba en Android (PO 2026-10-26, captura en Brave):** no pasaba a pantalla completa y los diagramas quedaban
  chicos y encima de las cuerdas (con la barra del navegador la pantalla útil queda en ~270 px de alto).
  **Arreglo:** la pantalla completa se pide al **soltar** el dedo (con toque, el navegador no la permite al apoyarlo)
  y se reintenta en cada toque hasta lograrla; en el celular los diagramas van **uno sobre otro a la izquierda de la
  bola** (la parte ya tocada), entre la barra de arriba y la de avance, lo más grandes que quepan; barra de arriba y
  de avance más bajas. Prueba (690 × 266, como el Android con la barra del navegador): diapasón 61–173 px; diagramas
  en 6–138 px de ancho (bola en 138): 52 % con las barras visibles, 77 % con ellas escondidas. **No probado:** la
  pantalla completa en el celular real.
- **Revertido (PO 2026-10-26, captura):** poner los diagramas a la izquierda de la bola, sobre el diapasón, **no lo
  pidió el PO** y contradice su decisión de DO ("siempre debajo, nunca sobre el diapasón"). Se quitó: en el celular
  rige la misma regla que en el PC. La **pantalla completa sí funciona** en Android (Brave). Prueba (740 × 333, como el
  Android en pantalla completa): diapasón termina en 217 px; diagramas 218–283 al 40 % con la barra de avance (desde
  293), y al 60 % hasta el fondo cuando la barra se esconde.
- **Botón 🎸 Acordes en blanco (PO 2026-10-26):** su texto era verde sobre verde; ahora es blanco (PC y celular, el
  botón es el mismo).
- **Nombre del acorde en bloques cortos (PO 2026-10-26, captura):** con varios rasgueos cortos seguidos del mismo
  acorde (p. ej. 4 de Re7), el nombre iba solo en el primer bloque y se achicaba hasta ser ilegible. Ahora usa el ancho
  de **todo el tramo** del acorde (hasta que cambia, sin pasar el fin de la sección ni del loop). PC y celular.
  Prueba ("He Barrido el Sol · Estrofa", 18,2 s): "Re7" del mismo tamaño que los demás sobre sus 4 bloques.
- **Rótulo de sección (ESTROFA) tapado en el celular (PO 2026-10-26):** su altura se calculaba con la barra de arriba
  en pixeles de pantalla, sin la escala del celular, y quedaba medio bajo la barra. Ahora se pasa a la escala del
  lienzo: queda entero entre la barra y el diapasón. En el PC no cambia.
- **Seguía sonando fuera de la pantalla (PO 2026-10-26, Android):** al apagar el celular, minimizar el navegador,
  abrir las apps recientes (botón ▢) o girarlo, la tablatura seguía sonando. Ahora, **solo en el celular**, se pausa
  (igual que ⏸) cuando la página deja de verse, pierde el foco o el celular queda en vertical. En el PC no: ahí el profe
  puede dejarla sonando en otra pestaña. Al girar: si el navegador dejó fijo el horizontal (pantalla completa) no pasa
  nada; si no, aparece "Gira tu celular". Prueba (740 × 333): sonando → pierde el foco → en pausa y quieta; sonando →
  333 × 740 (vertical) → en pausa y con "Gira tu celular". **No probado:** iPhone.
- **Probado en Android por el PO (2026-10-26): funciona** (pantalla completa, pausa al salir/girar, nombres, botón).
- **Deslizar para avanzar o retroceder (PO 2026-10-26):** en el celular y en pantallas táctiles (también notebooks con
  pantalla táctil), arrastrar el dedo a los lados sobre la tablatura la mueve con el dedo: a la izquierda avanza, a la
  derecha retrocede, sin salir de la sección. Si estaba sonando, se pausa mientras se arrastra y sigue al soltar. Solo
  con el dedo: el mouse sigue marcando IN / OUT. (← / → del teclado usan la misma pieza, `moverTablaA`.)
  Prueba (740 × 333, sección 3,13–20,13 s): desde 8 s, arrastre a la izquierda → 10,82 s; a la derecha → 5,18 s;
  sonando → en pausa durante el arrastre → sonando al soltar.
- **Ventana 🎸 Acordes que cabe entera (PO 2026-10-26, captura):** en el celular los diagramas desbordaban (la fila de
  arriba quedaba cortada). Ahora el tamaño se calcula: se prueba cada cantidad de columnas y se usa el tamaño más grande
  con el que caben todos (en el celular se achican; en pantallas grandes crecen hasta 2,2×); se recalcula al cambiar el
  tamaño de la ventana. Prueba: 740 × 333 → 7 acordes en 5 + 2, de 57 a 323 px, sin desborde; PC 756 × 630 → sin desborde.
- **▶ al final vuelve a empezar (PO 2026-10-26):** al llegar al final, ▶ no volvía a tocar (con audio, el audio quedaba
  en su último segundo; con sección, quedaba marcada como terminada). Ahora, si la tablatura está al final (terminó
  sola, el audio llegó a su fin o se llevó al final deslizando), ▶ y Espacio la tocan **desde el comienzo** (o desde el
  inicio de la sección, con su precuenta). Una pausa a mitad de canción sigue desde donde quedó. PC y celular.
  Prueba (Kalen): sección terminada (20,13 s) → ▶ → suena desde 3,8 s; canción completa con el audio al final → ▶ →
  suena desde 2 s; pausa en 10,74 s → ▶ → sigue en 11,46 s.
- **Pistas y Afinar también en el celular (PO 2026-10-26):** se habían dejado fuera por el alcance inicial ("sin
  afinador"); el PO los quiere. Vuelven a la barra después de Acordes (el loop IN/OUT sigue fuera en el celular).
  El afinador se compacta en el celular (filas de cuerda más bajas, sin la ayuda de teclado) para que las 6 cuerdas
  quepan sin desplazarse. Prueba (690 × 320): barra en una fila sin desborde (Acordes 360–489, Pistas 495–586,
  Afinar 592–680; el instrumento queda solo con su ícono); Pistas abre su lista (Audio, Partitura, Metrónomo);
  Afinador 306 px de alto con todo adentro (antes 530 de contenido). En el PC no cambia.

- **Paso 2 — enlace corto por tablatura (PO 2026-10-27):** decisión del PO: solo tablaturas **publicadas**; ✈ en la
  tablatura completa **y en cada sección**. `t/index.html` (`t/?a=<id>[&s=<sección>]`) solo redirige al Lector;
  el Lector con `?a=` entra en modo público (como `?p=`), busca el recurso **publicado** y abre la tablatura (o solo
  esa sección); si no existe o no está publicado: "Este acceso no está disponible". En la Biblioteca, ✈ junto al ⬇ de
  cada tablatura publicada y al lado de cada sección (menú de `comun/compartir.js`: link, QR, guía QR; instrumento de
  la tablatura en la guía). Prueba (local, "Baby Shark · Guitarra", publicada, secciones intro / baby shark /
  modulación): ✈ en la tablatura y en sus 3 secciones; ninguno en un borrador; el link de "baby shark" →
  `t/?a=muuer8gdltcz&s=baby%20shark` → Lector en modo estudiante, versión celular (740 × 333), solo esa sección
  (205 notas); sin `&s=` abre la tablatura completa; el link de un borrador → "Este acceso no está disponible".
- **Cierre (2026-10-27):** pasos 1 y 2 hechos; el paso 1 lo validó el PO en Android. **Pendiente de uso real:** probar
  en iPhone y leer un QR de tablatura desde un celular. El Loop IN/OUT del Lector sigue apartado sin guardar (en pausa).

---

### DQ. Compartir desde la Biblioteca: menú ✈ (link, QR, guía QR) + 📁 Archivos del curso
*Origen: PO 2026-10-26 (captura del botón "🔗 Compartir"; Notion: "Compartir todos los recursos por enlace o QR + hoja
de QR imprimible", 2026-10-24).*
- **Necesidad:** el botón Compartir abre la ventana del sistema, que en otros computadores (los del colegio) no permite
  hacer un QR. El profe necesita sacar el link, un QR y una hoja de QR recortables para repartir en un curso, en
  cualquier equipo, y encontrar después las guías ya hechas.
- **Decisión del PO (2026-10-26):** el botón pasa a ser solo el ícono **✈ avioncito de papel**; abre un **menú propio**
  con **Copiar link · Generar QR · Generar guía QR**. La guía: se elige el **curso**, **copias sin nombre** (parte con el
  número de estudiantes del curso), **los datos de cada QR se eligen al crearla** (canción, instrumento, curso, fecha de
  evaluación) y se puede **escribir un mensaje**; **hoja carta siempre**, ~30 QR recortables legibles por hoja. La guía
  queda guardada en un apartado nuevo de **documentos de cada curso** (audios, videos, imágenes, documentos), con
  botón **Abrir** al crearla para imprimir al tiempo o buscarla después. Nombre: **📁 Archivos del curso** (recomendado
  por Claude, aprobado; "Materiales" ya es la lista del Plan). Se ve en la página de cada curso en **Cursos**.
  **Autorizado:** tabla y bucket nuevos en Supabase.
- **Plan aprobado (dos pasos):** Paso 1: menú ✈ (piezas compartidas, para que el Lector y otros recursos lo usen
  después), parte con los recursos que ya tienen link de estudiante: melodía de **metalófono** (`m/?a=`) y **piano**
  (`p/?a=`); las tablaturas se suman con su enlace corto (DP paso 2). Paso 2: 📁 Archivos del curso (tabla
  `curso_archivos` + bucket `curso-archivos`, `supabase/curso_archivos.sql`, lo corre el PO) y la guía se guarda ahí.
- **Lugares de uso (regla 11):** el menú ✈ va en la ficha de la canción de la Biblioteca (todas las vistas donde hoy
  está 🔗 Compartir); 📁 Archivos del curso, en Cursos (PC).
- **Implementación (paso 1 y paso 2 en el mismo desarrollo):**
  - `comun/compartir.js` + `.css` (`Compartir`): menú ✈ (avioncito de papel, solo ícono) con 🔗 Copiar link · ▦ Generar
    QR (grande, Copiar link / ⬇ Descargar imagen) · 🖨️ Generar guía QR (curso de una lista de cursos y talleres; copias =
    estudiantes del curso según el Libro, editable; datos marcables Canción / Instrumento / Curso / Fecha de evaluación;
    mensaje opcional de hasta 140 letras; recuerda lo último elegido en el equipo). PDF hoja carta 5 × 6 = 30 QR con
    líneas de corte; más copias → más hojas. Librerías desde cdnjs solo al usarlas: qrcode-generator 1.4.4 y jsPDF 2.5.1.
  - `comun/archivos-curso.js` + `.css` (`ArchivosCurso`): guardar / listar / borrar y la ventana 📁 Archivos del curso
    (año en curso; Abrir · ⬇ · 🗑 al pasar el mouse; ＋ Subir archivo). La guía se guarda sola ahí (origen `guia-qr`) y
    deja los botones **Abrir** y **⬇ Descargar**; si no se puede guardar, igual se abre/descarga y lo dice.
  - `supabase/curso_archivos.sql`: tabla `curso_archivos` + bucket público `curso-archivos` (aditivo; **lo corre el PO**).
  - Biblioteca (`REPERTORIO/index.html`): los dos "🔗 Compartir" (metalófono y piano) pasan a ✈; el de metalófono sigue
    revisando la cifra de compás antes de abrir el menú. Cursos (`CURSOS/index.html`): botón **📁 Archivos** en la barra
    de cada curso (todos, también talleres y General).
- **Prueba (local, "Aló, Aló — Intro completa", metalófono):** ✈ abre el menú con las 3 opciones; Generar QR → QR de
  636 px que un lector de QR lee como el link `m/?a=muvtzpj4huv2…`; guía para 5° (34 estudiantes según el Libro) con
  fecha 12/11/2026 y mensaje → PDF de 2 hojas carta; cada tarjeta: QR + "Aló, Aló — Intro completa / Metalófono /
  5° básico / Evaluación: 12/11/2026 / mensaje en cursiva"; el QR de la hoja (a 115 dpi) se lee bien. Sin la tabla aún:
  "No se pudo guardar en 📁 Archivos del curso (falta crearlo en Supabase); igual puedes abrirla o descargarla", y
  📁 Archivos en Cursos dice "Falta crear… (correr supabase/curso_archivos.sql)". **No probado:** guardar y listar de
  verdad (falta el SQL), imprimir en papel y leer con un celular.
- **PO corrió `supabase/curso_archivos.sql` (2026-10-27).** Prueba completa (local, "Aló, Aló — Intro completa" → 5°):
  la guía se guarda ("✓ Guardada en 📁 Archivos del curso · 5️⃣ Quinto", 34 QR · 2 hojas carta); su "Abrir" entrega el
  PDF (application/pdf, 41 KB) y "⬇" lo descarga con su nombre; aparece en Cursos → Quinto → 📁 Archivos (fecha y
  tamaño); ＋ Subir archivo y 🗑 Borrar funcionan (los archivos de prueba se borraron; queda solo la guía real del PO de
  8°). **Arreglo:** con nombres largos, la ruta guardada perdía la extensión (".pdf"); ahora se conserva siempre.
- **Tablaturas con ✈ (2026-10-27):** con el paso 2 del Lector móvil (DP), el menú ✈ llega también a las tablaturas
  publicadas y a cada una de sus secciones (`t/?a=`).
- **Cierre (2026-10-27):** pasos 1 y 2 hechos y probados con la tabla creada. **Pendiente de uso real:** imprimir una
  guía y leer sus QR con un celular.

---

### DR. Cursos sin el cuadro 👪 Apoderados
*Origen: PO 2026-10-27 (captura de la página de 4°: "quita esa sección de apoderados en las páginas de los cursos").*
- **Decisión del PO:** la página de cada curso en **Cursos** ya no muestra el cuadro 👪 Apoderados (de BK). Las citas
  siguen en el Dashboard (pestaña 👪 Apoderados), en el Plan (pestaña 👪 Apoderados) y en el celular: no cambia nada ahí.
- **Implementación (`CURSOS/index.html`):** se quitó el cuadro, su estilo y la pieza `comun/apoderados.js` de la página
  (ya no se usa en Cursos).
- **Lugares de uso (regla 11):** solo Cursos del PC (el celular y el Historial del Plan no lo mostraban).
- **Prueba (local, 4°):** la página abre con el título y sus 25 clases/notas, sin "Apoderados"; ☑ Pendientes sigue
  funcionando; sin errores.

---

### DS. Libro — ✨ Redactar OA con IA (Gemini)
*Origen: PO 2026-10-27 (captura de "Nueva evaluación": "aquí necesito poner una idea, mandarlo a la IA y que me dé una
idea formal de OA").*
- **Necesidad:** al crear una evaluación, el profe tiene la idea pero no la redacción formal del Objetivo de Aprendizaje.
- **Decisión del PO (2026-10-27):** botón junto al campo "OA original" que envía la idea a la IA y devuelve **dos
  opciones**: una **basada en un OA oficial** del curso (lo cita) y otra de **redacción libre**; se elige una y queda en
  el campo (editable). **Solo cursos** (1° a 8°; en talleres no aparece). Va en **Nueva evaluación** y **al editar el OA**.
- **Plan:** misma IA que la Planificación del mes (Gemini plan gratis, llave guardada solo en el equipo,
  `gemini_api_key`, modelos de respaldo) y el mismo currículum guardado (`PLANIFICACION/curriculo/musica-<n>.txt`).
  Se envía: la idea, el nombre de la evaluación y los OA del nivel (sin nombres de estudiantes).
- **Lugares de uso (regla 11):** Libro (Nueva evaluación y editar OA) — también dentro de 📒 Libros, que muestra el mismo
  Libro.
- **Implementación:** pieza `comun/redactar-oa.js` (`RedactarOA`): botón **✨ Redactar OA** bajo el campo (solo si el
  contexto es PRIMERO…OCTAVO; en talleres, jefaturas y General no aparece; en una evaluación cerrada tampoco). Toma la
  idea escrita en el campo, la envía a Gemini con el nombre de la evaluación y `PLANIFICACION/curriculo/musica-<n>.txt`,
  y muestra **dos tarjetas** — "Basado en el OA oficial" ("OA n: …") y "Redacción libre" — cada una con **Usar**;
  además ↻ Otras y ✕ Cerrar. Nada se escribe en el campo sin tocar Usar; al editar una evaluación recuerda «Guardar
  cabecera». Llave: la misma `gemini_api_key` del equipo (si falta, la pide; si no sirve, la borra y avisa). Libro
  (`LIBRO/index.html`): en Nueva evaluación y en la cabecera de una evaluación abierta.
- **Prueba (local, 5°, respuesta de Gemini simulada porque este equipo de pruebas no tiene la llave):** el botón
  aparece y el campo invita a escribir la idea; lo enviado incluye la idea, el nombre "Repertorio «Cantó el gallo con el
  diablo»", "5° básico" y el currículo de QUINTO BÁSICO; se ven las dos opciones; Usar (libre) deja ese texto en el campo
  y cierra el panel. No se creó ninguna evaluación. **No probado:** la respuesta real de Gemini (con la llave del PO) y
  la cabecera de una evaluación existente.
- **Bug (PO 2026-10-27, con su llave): "No se pudo redactar; prueba de nuevo".** Causa probable: los modelos 2.5 de
  Gemini "piensan" antes de responder y eso gasta la cuota de salida (estaba en 2048): la respuesta llegaba cortada y no
  se podía leer en ningún modelo. **Arreglo:** cuota 8192 (como la Planificación), sin pensar en los 2.5
  (`thinkingBudget: 0`), lectura tolerante (toma lo que está entre llaves aunque venga con texto o ``` alrededor) y, si
  igual falla, el mensaje dice el motivo entre paréntesis (modelo + "respuesta incompleta (MAX_TOKENS)", HTTP, etc.).
  Prueba con respuestas simuladas: cortada → "(gemini-2.0-flash: respuesta incompleta (MAX_TOKENS))"; con texto y ```
  alrededor → se leen las dos opciones. **Falta:** que el PO pruebe de nuevo con su llave.
- **Seguía fallando sin motivo entre paréntesis (PO 2026-10-27):** el navegador del PO seguía con la versión anterior de
  `redactar-oa.js`. Causa: el Libro vive **dentro** de la pestaña 📒 Libros y el "Recargar" del Workspace renovaba solo
  los archivos de cada pestaña, no los de una página dentro de otra. **Arreglo:** el Libro pide `redactar-oa.js?v=ds2`
  y el "Recargar" del Workspace (`PC/workspace.html`) recorre también las páginas dentro de otras (Libro en Libros,
  Cajón en Ritmos). Prueba (local): con 📒 Libros abierto en 5°, Recargar pidió al servidor 36 archivos, entre ellos
  `LIBRO/index.html` y `comun/redactar-oa.js?v=ds2`.
- **Validado por el PO (2026-10-27):** ✨ Redactar OA funciona con su llave de Gemini. Cierre: hecho y probado en uso;
  queda por ver en el uso diario si las dos redacciones sirven.

---

### DT. Libro — ✨ Proponer la rúbrica o lista de cotejo con IA
*Origen: PO 2026-10-27 (captura de la pestaña Instrumentos de una evaluación con su OA: "quiero también incluir a la IA
para el desarrollo de la rúbrica").*
- **Necesidad:** armar los criterios de una rúbrica (con sus 4 niveles) o los ítems de una lista de cotejo toma tiempo;
  el OA ya dice qué se evalúa.
- **Decisión del PO (2026-10-27):** botón **✨ Proponer con IA** en el editor del instrumento: la IA propone los
  criterios a partir del OA de la evaluación (+ una idea opcional y el currículo del nivel); **el profe elige 3, 4 o 5**
  criterios (parte en 4); **vista previa** y **"Agregar todos"** (se suman a los que ya tenga y se corrigen ahí). **Solo
  cursos** (1° a 8°). **También en las Plantillas** de instrumentos (ahí parte del nombre y una idea, sin OA).
- **Plan:** misma IA que ✨ Redactar OA (DS): Gemini plan gratis, llave del equipo, currículo del nivel; la pieza común
  `comun/redactar-oa.js` comparte la llamada.
- **Lugares de uso (regla 11):** Libro → evaluación → Instrumentos (crear/editar instrumento) y Plantillas de
  instrumentos; también dentro de 📒 Libros.
- **Implementación:** pieza `comun/rubrica-ia.js` (`RubricaIA`): bloque "✨ Proponer con IA" bajo "Agregar" en el editor
  del instrumento (si no está bloqueado por tener resultados) y en el de plantillas — selector 3 / 4 / 5 (parte en 4),
  idea opcional, Proponer → vista previa (rúbrica: cada criterio con sus 4 niveles; cotejo: ítems Sí/No) → **Agregar
  todos** (se insertan de una vez al final, con su orden), ↻ Otra propuesta, ✕ Descartar. Base: OA y nombre de la
  evaluación (en plantillas, su nombre) + currículo del nivel. `comun/redactar-oa.js` ahora comparte la llamada a
  Gemini (`RedactarOA.pedir`, `curriculo`, `mensajeError`). Libro: `agregarCriteriosIA` / `agregarPlItemsIA`;
  scripts pedidos con `?v=dt1`.
- **Prueba (local, 5°, respuesta de Gemini simulada):** en una plantilla de prueba de rúbrica, con 3 criterios y la idea
  "la intro de la cueca": lo enviado pide "exactamente 3" con el currículo de QUINTO BÁSICO, la idea y el nombre; la
  vista previa muestra los 3 criterios con sus 4 niveles; Agregar todos guardó los 3 (orden 0–2, niveles 1 a 4) y el
  editor quedó en "Criterios (3)". ✨ Redactar OA sigue funcionando. La plantilla de prueba se borró. **No probado:**
  la respuesta real de Gemini y el editor de un instrumento de una evaluación real (mismo bloque).
- **Validado por el PO (2026-10-27):** funciona con su llave (captura: 4 criterios para la intro de una cueca en
  metalófono).
- **Iterar con comentarios (PO 2026-10-27):** "seleccionar alguno de esos textos y dar una respuesta acotada a ese
  detalle… puedo pedir una sola mod o muchas; es el mismo mecanismo para darte respuestas a ti, Claude". Diseño:
  seleccionar un fragmento de la vista previa → 💬 Comentar (o 💬 de la casilla entera, o un comentario general) → los
  comentarios se juntan abajo (✕ para quitar) → **Enviar comentarios (n)** → Gemini devuelve la propuesta completa
  cambiando solo lo comentado; lo que cambió queda marcado; se puede volver a comentar cuantas veces se quiera.
- **Implementación (iterar):** en `comun/rubrica-ia.js`, cada nombre de criterio y cada nivel de la vista previa es una
  casilla comentable: al seleccionar un texto dentro de una casilla aparece **💬 Comentar** (abre una cajita con la
  cita; Ctrl+Enter agrega); 💬 al pasar el mouse comenta la casilla entera; **💬 Comentario general** para toda la
  propuesta. Los fragmentos comentados quedan resaltados y los comentarios se listan con ✕. **Enviar comentarios (n)**
  manda a Gemini la propuesta completa + los comentarios (dónde, fragmento y qué cambiar) con la orden de cambiar SOLO
  eso y dejar el resto igual; la versión nueva marca en verde las casillas que cambiaron y se puede volver a comentar.
  "Agregar todos" avisa si quedan comentarios sin enviar. Libro pide `rubrica-ia.js?v=dt2`.
- **Prueba (local, plantilla de prueba de rúbrica, respuestas simuladas):** al seleccionar "pocas notas correctas" en
  Criterio 1 · Por lograr aparece 💬 Comentar; la cajita muestra "Criterio 1 («Criterio 1»), nivel Por lograr (1)" y la
  cita; con un comentario + uno general el botón dice "Enviar comentarios (2)" y el fragmento queda resaltado; lo
  enviado incluye la propuesta, "Aplica SOLO lo que piden" y los dos comentarios con su lugar y fragmento; la respuesta
  marcó en verde solo la casilla que cambió ("Pulso estable") y la lista de comentarios quedó vacía. Plantilla de prueba
  borrada. **No probado:** con la respuesta real de Gemini.
- **Validado por el PO (2026-10-27):** comentar y corregir funciona. **Estado: pendiente de validación en uso real**
  (DS y DT; tarjeta en Notion "Probar en clase").

---

### DU. Medios del curso y de las canciones (audios, videos, fotos)
*Origen: PO 2026-10-27 ("quiero empezar a tener audios/videos vinculados a canciones y a cursos… en la biblioteca, para
una canción: versión oficial (melodía), karaoke, extractos (grabados por mí en clases) y otras versiones (en vivo
íntegras grabadas por estudiantes, trabajos finales)").*
- **Necesidad:** guardar lo que se graba en clase (audios, videos, fotos) ligado al curso y, cuando corresponde, a una
  canción, sin llenar el espacio gratis de Supabase (1 GB, 50 MB por archivo).
- **Decisión del PO (2026-10-27):** se sube **desde el celular dentro de la app** (fotos, audios, videos) y **desde el PC
  arrastrando**; **audios aquí, videos como enlace**: si un video no cabe, la app deja lo más cerca posible de subirlo a
  YouTube sin navegar (grabar en la app → "Subir a YouTube" abre la app de YouTube con el video listo → "No listado" →
  📋 Pegar enlace); un archivo se ve **en la canción y en el curso**; en clase queda **solo en el curso y la clase**
  (canción y tipo después, opcional); en la canción: **Melodía · Karaoke (1 c/u) · Extractos · Versiones (varios)**;
  en las Versiones se anotan **estudiantes** (opcional) y **nunca se comparten**; las **fotos** van al curso **y a la
  bitácora** de la clase. **Autorizado:** cambios en Supabase.
- **Nota técnica:** subir a YouTube de forma automática (API) no conviene: los videos subidos por apps no verificadas
  por Google quedan **privados** (no "no listados"); por eso se usa la app de YouTube del celular.
- **Plan aprobado (fases):** 1) base: 📁 Archivos del curso = medios del curso (`supabase/medios.sql`: canción, clase,
  fecha, uso extracto/versión, enlace, estudiantes) y editar esos datos; arrastrar en el PC. 2) celular: 📷 Subir (foto,
  audio, video con la cámara; en clase, ligado al curso y la fecha; video grande → YouTube). 3) Biblioteca: Extractos y
  Versiones en la ficha de la canción. 4) Fotos en la bitácora (Cursos y Plan). **Se parte por 1 y 2.**
- **Lugares de uso (regla 11):** 📁 Archivos (Cursos PC y la guía QR de la Biblioteca); celular (nuevo 📷 Subir).
- **Implementación fases 1 y 2:**
  - `supabase/medios.sql` (**lo corre el PO**): columnas `cancion_id`, `sesion_id`, `fecha`, `uso` (extracto|version),
    `url`, `estudiantes` en `curso_archivos`; `storage_path` deja de ser obligatorio (archivo o enlace).
  - `comun/archivos-curso.js` (+ `.css`, pedidos con `?v=du1`): guardar con canción/clase/fecha/uso, `guardarEnlace`
    (YouTube o Drive), `prepararImagen` (fotos achicadas a 1920 px JPEG), máximo 50 MB por archivo. Ventana: etiquetas
    🎵 canción · Extracto/Versión · 👥 n · 🔗 YouTube; ✏️ edita nombre, fecha, canción (lista de la Biblioteca), "En la
    canción, es…" (Extracto / Versión) y, en Versión, los estudiantes del curso (casillas; "no se comparte"); ＋ Enlace;
    **arrastrar archivos** a la ventana sube al curso. Sin `medios.sql` la lista sigue funcionando.
  - `MOVIL/subir.html` (nuevo, en el ☰ menú y en clase como "📷 SUBIR FOTO, AUDIO O VIDEO"; sumado a `sw-movil.js` v11
    y a "Cargar versión nueva"): 📷 Foto y 🎬 Video con la cámara, 🎤 Grabar audio aquí mismo (⏺/⏹ con tiempo), 🖼️
    Desde la galería. En clase va al curso, la clase y la fecha solos; sin clase se elige el curso (recuerda el último).
    Video > 50 MB: pasos a YouTube con **▶ Subir a YouTube** (abre la app con el video listo, en Android), "No listado",
    📋 Pegar (al volver se pega solo si el enlace está copiado) y Guardar enlace.
- **Prueba parcial (local, antes de correr `medios.sql`):** 📷 Subir abre con los 4 botones y la lista de cursos (16);
  un video simulado de 60 MB muestra los pasos a YouTube (en el PC de pruebas no hay "compartir archivo", así que salen
  las instrucciones a mano; en Android aparece el botón); 📁 Archivos de 8° muestra ＋ Enlace, ＋ Subir archivo, la
  zona para soltar y el formulario ✏️. **Falta:** correr `medios.sql` y probar guardar, ligar canción/estudiantes y
  enlaces; probar en el celular real (cámara, audio, YouTube).
- **PO corrió `supabase/medios.sql` (2026-10-27).** Prueba completa (local, 5°): desde 📷 Subir, una foto de prueba de
  23 MB quedó en 1,3 MB JPEG, un audio y un video de 60 MB por el camino de YouTube (enlace pegado) — los tres "✓", con
  fecha de hoy; en 📁 Archivos (PC) el audio quedó como **Versión** de "Aló, Aló" con 2 estudiantes (de los 34 de 5°) y
  el video como **Extracto** con 🔗 YouTube; arrastrar un archivo a la ventana la resalta y lo sube. Todo lo de prueba
  se borró (queda solo la guía real de 8°). **Arreglos:** la foto achicada se nombra .jpg (antes conservaba .png); las
  etiquetas (🎵 canción · tipo · 👥 · 🔗) van en una segunda línea para que se vean aunque el nombre sea largo
  (`?v=du2`). **Falta:** probar en el celular real (cámara, audio, botón Subir a YouTube) y las fases 3 y 4.
- **Fase 3 — Extractos y versiones en la ficha de la canción (2026-10-27):** en la Biblioteca (`REPERTORIO/index.html`),
  bajo "Assets", la sección **Extractos y versiones** lista los medios de los cursos ligados a la canción, agrupados en
  Extractos · Versiones (no se comparten) · Otros, con el ícono del curso, la fecha y 👥 n. ▶ los reproduce ahí mismo
  (audio, video o foto); 🔗 abre un enlace de YouTube/Drive; ✏️ abre 📁 Archivos de ese curso (canción, tipo,
  estudiantes) y al cerrarla la lista se pone al día. **+ Agregar extracto o versión** (o soltar un archivo en la
  sección): curso, Extracto/Versión y archivo o enlace; se guarda en el curso ligado a la canción con fecha de hoy.
  Prueba (local, "Aló, Aló"): sección vacía → se agregó un audio de prueba como Extracto de 5° y un enlace de YouTube
  como Versión → "Extractos (1)" y "Versiones · no se comparten (1)"; ▶ cargó el audio (2 s, sin error) y 🔗 apunta
  al enlace. Lo de prueba se borró. **Falta:** fase 4 (fotos en la bitácora) y uso real.
- **Fase 4 — fotos de la clase en su bitácora (2026-10-27):** pieza `comun/fotos-clase.js` (`FotosClase`): una foto
  de 📁 Archivos es de una clase si tiene su `sesion_id`, o si no tiene clase pero es del mismo curso y fecha; se
  muestran como miniaturas sobre el texto de la bitácora y al tocarlas se ven en grande (‹ › entre las de la clase,
  Esc o toque fuera cierra). Lugares: **Cursos PC** (página del curso y ☀ Hoy), **Plan** (✍🏼 Bitácora de la clase y
  🕘 Historial) y **Cursos del celular** (sumada a `sw-movil.js` v12 y a "Cargar versión nueva"). Sin fotos o sin
  señal, la bitácora se ve igual.
  Prueba (local, 5°, 3 fotos de prueba: A y B ligadas a la clase del 27/10, C sin clase con fecha 20/10): Cursos PC →
  A y B en "Martes 27", C en "Martes 20"; visor "A · 1 de 2" → › "B · 2 de 2", Esc cierra; Plan → 2 fotos en la ✍🏼
  Bitácora del 27 y 1 en el martes 20 del Historial; celular → igual. Fotos de prueba borradas (queda solo la guía
  real de 8°). **DU fases 1–4 hechas; falta probar en uso real (celular: cámara, audio, YouTube).**

---

### DV. Evaluar por toques — tap de tres dedos: un toque a todo el curso
*Origen: PO 2026-10-27 ("en la evaluación por tap desde el cel hay que agregar un nuevo gesto: tap de tres dedos,
eso implica que todo el curso tiene un punto menos").*
- **Decisión del PO:** el tap de tres dedos suma **un toque a cada estudiante en pantalla** (lo mismo que tocar a cada
  uno: descuenta lo que vale un toque en esa evaluación), no un punto entero de nota.
- **Implementación (`MOVIL/evaluar.html`):** se cuentan los dedos de cada gesto; si llegan a 3 (rápido, sin arrastrar),
  al levantarlos se suma un toque a todos los que están en pantalla (pendientes y presentes del grupo o curso elegido),
  y los toques individuales bajo esos dedos no cuentan. Aviso rojo "+1 toque a todo el curso (n)" y vibración larga;
  **↩ lo deshace para todos de una vez**. La ayuda del tablero lo menciona. Un gesto de 2 dedos no hace nada.
- **Lugares de uso (regla 11):** solo Evaluar del celular (el Libro del PC no tiene toques).
- **Prueba (local, tablero con 5 estudiantes ficticios, sin guardar):** 3 dedos sobre Ana, Beto y Caro → los 5 con 1
  toque (sin dobles) y aviso "(5)"; un toque a Dani → 2; ↩ → Dani vuelve a 1; ↩ → todos a 0. **Falta:** probar con
  tres dedos reales en el celular.

---

### DW. Extractos — a qué parte de la canción corresponden
*Origen: PO 2026-10-27 ("en el caso de los extractos, debe haber una posibilidad: anotar a qué parte de la estructura
de la canción corresponde ese extracto").*
- **Auditoría:** las canciones no tienen una estructura con nombres guardada: la letra son estrofas sin nombre
  (separadas por línea en blanco) y solo las tablaturas tienen secciones con nombre (`tab_sync.secciones`).
- **Decisión del PO (2026-10-27):** campo **"Parte de la canción"** en los extractos, elegible de una lista o escrito:
  secciones de las tablaturas de la canción, estrofas de la letra con su primer verso, y nombres comunes (Intro,
  Estrofa, Coro, Puente, Instrumental, Final). Se anota al agregar desde la ficha y con ✏️ en 📁 Archivos; en la ficha
  cada extracto muestra su parte y se ordenan según la canción. **Autorizado:** columna `parte` en Supabase
  (`supabase/medios_parte.sql`, lo corre el PO). Saltar a esa parte en el Entrenador queda para después.
- **Lugares de uso (regla 11):** 📁 Archivos (✏️) y la ficha de la canción (Extractos y versiones).
- **Implementación:** `ArchivosCurso.partesDeCancion(sb, cancionId)` arma las sugerencias en el orden de la canción
  (secciones de sus tablaturas → estrofas de la letra con su primer verso, sin el título → Intro/Estrofa/Coro/Puente/
  Instrumental/Final, sin repetir). Campo "Parte de la canción" (lista + texto libre) solo en Extractos: ✏️ de
  📁 Archivos (etiqueta "Extracto · <parte>") y "+ Agregar extracto o versión" de la ficha; en la ficha cada extracto
  muestra su parte en negrita y se ordenan según la canción (sin parte, al final). Pieza pedida con `?v=dw1`.
- **PO corrió `supabase/medios_parte.sql` (2026-10-27).** Prueba (local, "Aló, Aló", 5°): sugerencias = 5 estrofas
  + 6 comunes ("Baby Shark": intro, baby shark, modulación + comunes); se agregaron desde la ficha "tercera" (Estrofa 3)
  y luego "primera" (Estrofa 1) → guardadas con su parte y listadas Estrofa 1 antes que Estrofa 3; ✏️ en Archivos
  mostró la parte guardada y las 11 sugerencias, se cambió a "Coro" → etiqueta "Extracto · Coro" y la ficha se puso
  al día. Lo de prueba se borró. **Falta:** uso real.

---

### DX. Plan — vincular tablaturas (y sus secciones) a las actividades
*Origen: PO 2026-10-27 ("¿puedo linkear tabs a actividades de clases? necesito hacerlo").*
- **Auditoría:** una actividad del Plan vincula 🎵 canciones, 🎹 melodías de metalófono y 🥁 ritmos (`plan_cards.canciones`
  = `[{ cancion_id, asset_id? }]`, deudas BT y BX); las tablaturas no.
- **Implementación (`PORTAL/index.html`, sin cambios en Supabase):** pestaña **🎸 Tablatura** en el selector de la
  actividad, con cada tablatura del curso (o de la Biblioteca al buscar) y debajo **cada sección** ("▸ coro · solo esta
  sección"); el vínculo guarda `{ cancion_id, asset_id, seccion? }` en la misma lista. Se ve como "🎸 Canción ·
  Instrumento · Descripción · Dificultad · ▸ sección"; tocarlo (en la actividad, en la Presentación o en la vista de
  clase) abre el **Lector** en una pestaña del Workspace (key `lector:<id>[:sección]`, como desde el Entrenador, deuda
  CF), con la sección si la tiene. La vista de clase cuenta también "n tablaturas".
- **Lugares de uso (regla 11):** actividad del Plan (ficha), Presentación (botones por actividad) y vista de clase.
- **Prueba (local, Plan de 5° del 27/10, sin guardar vínculos):** el selector tiene 🎵 Canción · 🎹 Metalófono ·
  🥁 Ritmo · 🎸 Tablatura; al buscar "baby", "🎸 Baby Shark · Guitarra · Arreglo de cuerdas… · Media" y debajo
  "▸ intro / ▸ baby shark / ▸ modulación — solo esta sección" (y lo mismo para la de Bajo); un vínculo a la sección
  "baby shark" se ve "🎸 Baby Shark · Guitarra · … · ▸ baby shark" y abre
  `tabs/index.html?storage=tab/muuer8gdltcz.mxl&…&seccion=baby shark` (fuera del Workspace, en ventana nueva; dentro,
  pestaña del Lector). Sin errores. **Falta:** uso real (vincular de verdad y abrir desde el Workspace).

---

### DY. Plan — vínculos de la actividad: sin desborde, ✕ visible y ordenar arrastrando
*Origen: PO 2026-10-27 (capturas: vínculos 🎸 largos se salían de la actividad y no se veía la ✕; el selector se
desbordaba en "Tablatura"; "quisiera poder arrastrar aquí mismo, o también en la columna Presentación, para tener un
orden").*
- **Implementación (`PORTAL/index.html`):** el nombre del vínculo se recorta con "…" y la ✕ queda siempre a la vista;
  el selector pasa de 300 a 380 px (caben 🎵 Canción · 🎹 Metalófono · 🥁 Ritmo · 🎸 Tablatura); los vínculos se
  **ordenan arrastrando** en la actividad y en la columna Presentación (línea morada donde caerán), con la misma
  función (`ordenarArrastrando` + `moverVinculo`): el orden se guarda en `plan_cards.canciones` y se ve igual en la
  actividad, la Presentación y la vista de clase.
- **Lugares de uso (regla 11):** actividad, Presentación y vista de clase (esta última solo muestra el orden).
- **Prueba (local, Plan de 5°, 3 vínculos solo en memoria, sin guardar):** los 3 caben en la actividad con su ✕
  visible; arrastrar "Aló, Aló" del 3.º al 1.º lugar en la actividad → orden nuevo también en la Presentación;
  arrastrarlo de vuelta al final desde la Presentación → la actividad se actualiza; selector de 380 px con las 4
  pestañas enteras. **Falta:** uso real.

---

### DZ. Tablaturas de la actividad: en el panel del Plan y con copia en la Pizarra
*Origen: PO 2026-10-27 ("al abrir esos chips, que no se abran en pestaña nueva, sino como lo hacen las letras y las
melodías de metalófono, y con espejo en la Pizarra").*
- **Auditoría:** letras y metalófono se abren en el Entrenador mínimo sobre Presentación + Vista previa
  (`REPERTORIO/?mini=1`, deuda BU) y, en clase, la Pizarra muestra una copia (`?espejo=1`, canal
  `profe-espejo-entrenador`). El Lector no tiene modo panel ni copia.
- **Plan:** 1) el vínculo 🎸 abre el Lector en el mismo panel (`tabs/index.html?…&mini=1`, ✕ o Esc lo cierran);
  2) Lector **copia** (`?espejo=1`): sin botones ni audio, sigue el avance que le manda el Lector del panel (canal
  `profe-espejo-lector`, ~20 veces por segundo, con la tablatura, sección y tiempo); 3) la Pizarra muestra la copia
  encima mientras el panel está abierto con la clase en curso (como la letra) y la quita al cerrarlo.
- **Lugares de uso (regla 11):** vínculos 🎸 de la actividad, de la Presentación y de la vista de clase.
- **Implementación:** Lector (`tabs/index.html`): `?mini=1` (sin "Abrir", con ✕ y Esc que cierran el panel vía
  `ent-mini-cerrar`) y `?espejo=1` (sin barras, mano, avisos ni audio; en cada cuadro toma el tiempo del panel y entre
  mensajes avanza al ritmo medido). El panel con `&pizarra=1&sesion=` avisa `on` (tablatura, nombre, sección; también
  en `localStorage profe_espejo_lector` para una Pizarra que se abra después), manda su tiempo cada 50 ms y al salir
  avisa `off`. Plan (`PORTAL/index.html`): `abrirTabLector` abre el Lector en `#prev-mini` (con `&pizarra=1` solo con
  la clase de esa sesión en curso). Pizarra (`PIZARRA/index.html`): capa `#espejo-lector` (z 8600) al `on` de su sesión,
  quitada al `off`.
- **Prueba (local):** panel (`mini`) de "Baby Shark · baby shark" → 205 notas en la sección, "Abrir" oculto y ✕ visible;
  copia (`espejo`) sin barras, misma sección, recibe el tiempo (10,5); con mensajes "sonando" la copia queda a 1 ms del
  tiempo enviado y al pausar se fija en el tiempo exacto; Pizarra de 5° → crea la copia solo con el aviso de su sesión
  (no con otra) y la quita con `off`; Plan → el vínculo 🎸 abre el Lector en el panel en la sección y ✕ lo cierra.
  (En las pruebas el navegador estaba oculto y no corrían los cuadros de dibujo: el cálculo de la copia se probó
  directo.) **Falta:** probar en clase con la Pizarra real en el proyector.

---

### EA. Libro — pestaña Estudiantes de una evaluación, más limpia
*Origen: PO 2026-10-27 (captura de la evaluación de 5°: "tiene un montón de información muy visualmente ruidosa,
propón algo").*
- **Necesidad:** en clase y al revisar, ver de un vistazo quién tiene nota y cuál; hoy cada fila muestra el selector del
  objetivo (casi siempre el mismo OA), la etiqueta de estado, "0/3", tres botones y el comentario en un cuadro, todo a
  la vez.
- **Auditoría:** la fila la arma `notaCellHTML` + la tabla de Estudiantes en `LIBRO/index.html` (columnas Objetivo
  aplicado · Nota · Comentario). El estado ya se marca con el fondo verde de la fila. Sin cambios en Supabase.
- **Propuesta (aprobada por el PO 2026-10-27):**
  1. **Fila delgada:** nombre · nota grande · comentario en una línea.
  2. **Objetivo aplicado:** la columna se oculta si nadie tiene adecuación (el OA está en General); si alguien la tiene,
     se ve solo en su fila como etiqueta chica (el selector aparece al pasar el mouse o al hacer clic).
  3. **Estado:** solo una barra de color a la izquierda (verde evaluado · amarillo pendiente · gris no aplica), sin la
     etiqueta en cada fila; el filtro "Pendientes (n)" de arriba sigue igual.
  4. **Botones** Evaluar · No aplica · Reevaluar: ocultos, aparecen al pasar el mouse por la fila (interfaz silenciosa).
  5. **"0/3":** solo cuando una rúbrica está a medias.
  6. **Comentario:** una línea; al hacer clic se abre completo para escribir.
- **Lugares de uso (regla 11):** Libro directo y 📒 Libros (misma página dentro). No se proyecta (la pestaña
  Estudiantes no va a la Pizarra) y el celular Evaluar no la usa.
- **Nota de datos (2026-10-27, aprobado por el PO):** en 5° se ordenaron las evaluaciones de hoy: la de las notas
  ("hjk,l") recibió el nombre y OA de «Aló aló al metalófono»; las dos vacías se borraron; la rúbrica "Melodía en
  metalófono" quedó en Instrumentos **sin** asociarse a la cabecera, para que Estudiantes muestre las notas puestas a
  mano por toques (con la rúbrica asociada mostraba "—" y "Evaluar" habría reemplazado la nota). **Ojo:** al quitarla de la cabecera, Supabase **borró** el instrumento (algo del esquema real, no versionado, borra el instrumento que deja de estar asociado); se repuso el mismo día desde el respaldo (mismo id, 3 criterios con sus niveles), en Instrumentos y sin asociar. Para desasociar un instrumento en el futuro: revisar antes esa regla en Supabase.
- **Implementación (`LIBRO/index.html`):** la tabla lleva la clase `est-limpia`; fila con `filaEstClase` (verde `fila-ok`
  · amarillo `est-pend` · gris `est-na`, también al cambiar la nota: `pintarFilaEst`); la etiqueta de estado se oculta
  solo en esta tabla; columna Objetivo aplicado solo si hay adecuaciones (`verObj`), con el selector como texto chico
  (amarillo si es adecuación) que se enmarca al pasar el mouse; celda de nota en una línea: nota grande · "1ª nota" ·
  marca de grupo · botones (`nota-acc`, ocultos con `visibility` hasta pasar el mouse o tener el foco: la fila no se
  mueve); "n/m" solo con la rúbrica a medias; `reevalHTML` se separó en `notaAntHTML` + `reevalBtnHTML`; comentario
  en un `textarea` de una línea que crece al escribir (`estComAlto`). Sin cambios en Supabase.
- **Prueba (local, evaluación de 5°, sin guardar nada):** 34 filas de 46 px (antes ~140), columnas # · Estudiante ·
  Nota · Comentario; barras verde / amarilla; botones ocultos y visibles al pasar el mouse; comentario largo se abre
  completo al hacer clic sin barra de desplazamiento; con una adecuación ficticia en memoria aparece la columna
  Objetivo aplicado (en amarillo para ese estudiante) y la tabla cabe sin desplazarse a 1200 px. **Falta:** uso real.
- **Ajuste (PO 2026-10-27: "al hacer clic en un comentario el texto sube, es incómodo"; y un filtro al final de la
  barra):** el comentario abierto **flota hacia abajo** sobre las filas siguientes (clase `abierto`, posición absoluta
  en el mismo lugar): la fila no cambia de alto y el texto no se mueve. Botón **💬 Todos / Con comentario / Sin
  comentario** (ancho fijo, se recuerda en el equipo, `libro_est_com`) al final de la barra del buscador; se combina
  con la búsqueda y con Pendientes. Prueba (5°): 34 / 30 / 4 filas; comentario largo abierto → fila 46 px igual, texto
  en el mismo lugar, cuadro de 76 px hacia abajo; al salir vuelve a una línea.

---

### EB. 📚 Estudios — ensayos en Cursos con citas de Profe Apps
*Origen: PO 2026-10-27 ("quiero hacer estudios y poder citar muchas cosas de las que están en Profe Apps; ensayos
escritos en Cursos, un apartado más").*
- **Necesidad:** reflexionar por escrito sobre lo que pasa en clases (para sí mismo, para la UTP o un perfeccionamiento)
  apoyándose en lo ya registrado, sin copiar a mano.
- **Decisiones del PO (2026-10-27):** apartado **propio** en el menú de Cursos (no dentro de cada curso); se citan
  **bitácoras y notas** y el **Libro**; la cita se **copia** dentro del texto (no es un enlace); uso: solo para el PO,
  descargar Word/PDF y ayuda de IA.
- **Auditoría:** Cursos ya tiene apartados propios en su menú (☀ Hoy, 🐞 Mejoras) y el editor por bloques compartido
  (`comun/editor-bloques.js`), cuyo contenido es texto de una línea por bloque. Bitácoras en `memorias` (por sesión),
  notas en `bitacora_paginas`; Libro en `libro_evaluaciones` + `libro_evaluacion_notas` + `libro_eval_instrumentos`/
  `_items` + `libro_eval_resultados`. Falta una tabla para los estudios.
- **Plan (4 pasos):** 1) **📚 Estudios** en el menú de Cursos: lista (título, fecha) + ＋ Nuevo; cada estudio con título
  y el editor por bloques; tabla nueva `estudios` (`supabase/estudios.sql`). 2) **❝ Citar**: curso → Bitácoras y notas
  (la clase o nota entera o algunos bloques) o Libro (evaluación: nombre, OA, rúbrica y resumen de resultados —
  promedio, tramos, niveles por criterio—, **sin nombres de estudiantes**; comentarios uno por uno, también sin
  nombre); se inserta como bloque **Cita** con su origen ("— 5° · Bitácora del lunes 14/10/26"). 3) ⬇ Word / PDF.
  4) ✨ IA (Gemini) con vista previa que tapa nombres, iterable como la rúbrica. **Aprobados para empezar: 1 y 2.**
- **Pieza compartida tocada:** el editor por bloques gana el tipo **Cita** (línea "> "; se ve con borde a la
  izquierda) y `ed.insertar(texto)` (agrega bloques después del último bloque donde se escribió).
- **Lugares de uso (regla 11):** el tipo Cita queda disponible en todos los editores por bloques (bitácora del Plan,
  actividades, Historial, Cursos PC y celular) y se ve igual en las vistas de solo lectura; Estudios solo en Cursos (PC).
- **Implementación (pasos 1 y 2):** `CURSOS/estudios.js` + `CURSOS/estudios.css` (`Estudios`, con `Citar` adentro);
  Cursos (`CURSOS/index.html`): fila 📚 Estudios sobre 🐞 Mejoras, `modoEstudios`, guardado en la misma cadena
  (`guardarTodo`), se recuerda el último estudio. Columna 2 = ＋ Nuevo estudio y la lista (título, fecha); página =
  ❝ Citar · "Editado …" · 🗑 (al pasar el mouse) · título grande · editor. Guardado solo a los 0,8 s. Citar: curso
  (se recuerda) · 📓 Bitácoras y notas | 📒 Libro → lista → casillas por bloque / por parte → "❝ Citar (n)" inserta
  las líneas "> …" + "> *— origen*" después del último bloque donde se escribió. Libro: Evaluación y OA ·
  Rúbrica/Lista de cotejo (instrumento de la cabecera o el primero) con descripciones de niveles · Resumen (evaluados,
  promedio, tramos, niveles por criterio si hay resultados) · Comentarios (desmarcados, sin nombre; no se ofrece
  "PDTE"). Editor por bloques: tipo **Cita** (`> `), `ed.insertar(texto)`; celular: caché `profe-movil-v13`.
- **Prueba (local, tabla `estudios` simulada en memoria porque aún no existe; lecturas reales):** crear estudio,
  título "Cueca en 5°" guardado; Citar → 5° → bitácora del 20/10 con 3 de 4 bloques → cita con su origen; Libro →
  «Aló aló» → evaluación, OA, resumen (27 de 34, promedio 5,9, tramos 17/5/5/0) y 1 comentario sin nombre; otra
  evaluación con rúbrica → criterios con sus 4 niveles. **Falta:** correr `supabase/estudios.sql` y uso real.

---

### EC. Bitácora del celular — el mismo menú de Cursos (☀ Hoy, 📚 Estudios, 🐞 Mejoras)
*Origen: PO 2026-10-28 ("el menú Cursos debería poder verse tal cual en la bitácora del celular; no es necesario que
se vean los pendientes, los archivos o la planificación del mes, pero sí todo lo que está en el menú").*
- **Auditoría:** `MOVIL/cursos.html` es una página propia (no comparte código con `CURSOS/`): menú ☰ con 🏠 Inicio + cursos;
  todo lo escrito pasa por una cola en el celular (funciona sin señal) amarrada al curso abierto. ❝ Citar vive dentro
  de `CURSOS/estudios.js` y usa lo de esa página.
- **Plan aprobado (PO 2026-10-28):** 1) ❝ Citar pasa a pieza común **`comun/citar.js`** + `comun/citar.css` (PC y
  celular, regla 11); 2) celular ☀ **Hoy**: las bitácoras de todas las clases del día, editables y sin señal (cada
  entrada lleva su propio curso en la cola), con ◀ Hoy ▶; 3) 📚 **Estudios**: lista + título + editor táctil + ❝ Citar;
  guarda con señal (sin señal queda "sin subir" y se reintenta); 4) 🐞 **Mejoras**: lista con filtro, anotar y borrar.
  Sin pendientes, archivos ni planificación.
- **Lugares de uso (regla 11):** `citar.js` → Estudios del PC y del celular.
- **Implementación:** `comun/citar.js` + `citar.css` (`Citar.abrir({ sb, contextos, alCitar })`; en el celular a
  pantalla completa), `CURSOS/estudios.js` la usa (sin cambios para el PC). `MOVIL/cursos.html`: `vista` = curso · hoy ·
  estudios · mejoras; menú ☰ 🏠 Inicio · ☀ Hoy · cursos · 📚 Estudios · 🐞 Mejoras (19 filas sin desplazarse); cada
  entrada lleva su curso (`E.ctx`) en la cola, así ☀ Hoy escribe sin señal en varias clases; ◀ Hoy ▶ salta el fin de
  semana; se recuerda la última vista (salvo que haya clase en curso: entra a ese curso). Estudios: lista, ＋ Nuevo,
  título, editor táctil, ❝ Citar, ⋯ Borrar; guarda a 1,2 s con señal y reintenta. Mejoras: filtro, anotar, 🗑.
  `sw-movil.js` v14 con `citar.js`/`.css`.
- **Prueba (local, 375×812):** menú con las 19 filas visibles; ☀ Hoy del 28/10 (Primero, con su bitácora) y ◀ al
  27/10 (Enlaces, Sexto, Recreo, Quinto: 4 editores); 🐞 Mejoras (0 anotadas); 📚 Estudios con la tabla simulada:
  nuevo, título, ❝ Citar a pantalla completa → bitácora de 5° del 20/10 citada y guardada. PC: ❝ Citar del Libro con
  la pieza común → cita con la rúbrica. **Falta:** `supabase/estudios.sql` y uso real en el celular.

---

### ED. Celular — franjas del sistema (arriba y abajo) siempre del color de la página
*Origen: PO 2026-10-28 ("el borde superior y el inferior de la PWA son inconsistentes: a veces abajo se ve el fondo de
pantalla del celular, a veces la franja de arriba es blanca, a veces negra"). Decisión del PO: **color de la página**.*
- **Auditoría:** cada página pedía su color de franja (inicio, Evaluar, Subir: oscuro; Bitácora: blanco; Biblioteca del
  celular: ninguno → el del manifiesto) y solo Bitácora, Evaluar y Subir se dibujaban detrás de las franjas
  (`viewport-fit=cover`); en el inicio y la Biblioteca, abajo podía verse el fondo de pantalla.
- **Implementación:** todas las páginas del celular se dibujan detrás de las franjas (`viewport-fit=cover`; ya usaban
  los márgenes seguros) con `html` del color de la página y `theme-color` igual: inicio, Evaluar, Subir y Biblioteca
  (`?movil=1`, por código; el PC no cambia) oscuras `#0b1120`; Bitácora blanca.
- **Prueba:** solo en el navegador del computador (colores y fondos correctos, sin errores). **Falta:** verlo en Android.
- **Ajuste (captura del PO, 2026-10-28):** con el celular en modo oscuro, Chrome oscurece por su cuenta la Bitácora
  (blanca) y la franja de arriba quedaba blanca. Ahora la Bitácora pide franja blanca en modo claro y oscura (`#121212`)
  en modo oscuro, igual que como se ve la página.

---

### EE. ✉️ Mensajes — lista compacta, entregados plegados
*Origen: PO 2026-10-28 (captura del Dashboard: "visualmente ya se ve colapsado"); aprobado con el nombre "Entregados".*
- **Implementación (`comun/mensajes.js` + `.css`):** sin tarjetas; por persona, su nombre en una línea chica (con el
  número por dar) y sus mensajes por dar debajo; los entregados quedan abajo bajo **▸ ✓ Entregados (n)**, que se abre
  y se cierra al tocarlo (parte cerrado). Ayuda en letra más chica.
- **Lugares de uso (regla 11):** Dashboard (pestaña ✉️) e inicio del celular sin clase (misma pieza).
- **Prueba (local, Dashboard):** "DIRE · 1" con su mensaje arriba; ▸ ✓ Entregados (3) cerrado → al tocarlo, Castigadas,
  Juan Andrés y Caro Farías tachados. **Falta:** verlo en el celular.
- **Ajuste (PO 2026-10-28): cuadro para anotar** arriba de la lista: "a quién: mensaje" + Enter (el /msj es opcional;
  sin ":" avisa cómo escribirlo y no borra lo escrito). Queda sin curso ni clase. El cuadro no se repinta con los
  cambios al instante (lo escrito no se pierde). Prueba (Dashboard): aviso sin ":"; "/msj Prueba Claude: …" → aparece
  como PRUEBA CLAUDE · 1 y el cuadro se vacía; borrado después.

---

### EF. 🪘 Cajón — programador de ritmos (cuadrícula tipo drum-machine) — APROBADA, paso 1 en curso
*Origen: PO 2026-10-28 ("una especie de drum-machine para programar los ritmos del Cajón: una cuadrícula con los tiempos
de la cifra de compás y dos filas, bombo y agudo"). El PO lo aprobará en otra sesión.*
- **Respuestas del PO:** división elegible al crear (corcheas · tresillos · semicorcheas); de 1 a 8 compases; se guarda
  en la Biblioteca; con metrónomo, la figura del cajón tocando lo programado y compartir con estudiantes (sin acentos).
- **Auditoría:** `CAJON-PERUANO/index.html` toca golpes grave/agudo leídos de un MIDI (`golpes`, sonido sintetizado,
  figura animada, un solo reloj). Los recursos de la Biblioteca tienen `tipo` libre (así entró `melodia`): no hace falta
  tocar Supabase.
- **Plan (3 pasos):** 1) cuadrícula bajo la figura: cifra de compás, división, compases 1–8; filas **Grave** (naranjo) y
  **Agudo** (celeste); clic pone/quita; ▶ en bucle con BPM; metrónomo; la figura toca lo programado y una luz recorre la
  casilla. 2) recurso nuevo **🪘 Cajón** de una canción (contenido JSON), abre desde la ficha y desde 🥁 Ritmos.
  3) ✈ Compartir (link, QR, guía QR) → cajón animado para estudiantes sin clave, solo publicados (archivo público como
  el Piano). **Recomendado: partir por el paso 1.**
- **Decisión del PO (2026-10-28):** aprobado; se parte por el **paso 1**.
- **Paso 1 hecho (2026-10-28):** botón **🎛️ Programar** en la barra del Cajón (`CAJON-PERUANO/index.html`). Bajo la
  figura (en lugar de la cinta) va la cuadrícula: cifra (2/4 · 3/4 · 4/4 · 5/4 · 6/8 · 7/8 · 12/8), división (corcheas ·
  tresillos —no en x/8— · semicorcheas) y 1–8 compases; filas **A** agudo (celeste, arriba) y **G** grave (naranjo);
  clic pone/quita, arrastrar marca varias, con la música detenida se escucha el golpe. ▶ toca en bucle con el BPM
  (negra) y ⏱ Metrónomo (acento en el 1; pulso = negra, negra con punto en 6/8 y 12/8, corchea en 7/8); la figura
  toca lo programado y una luz amarilla recorre la columna. Editar mientras suena no corta. Cambiar cifra, división o
  compases conserva los golpes que caben (se ajustan a la nueva división) y pide confirmar si se pierde alguno. El
  borrador se recuerda en el equipo (`profe_cajon_programa`) hasta el paso 2 (guardar en la Biblioteca). Volver a
  🎛️ (o cargar un MIDI) regresa al MIDI que había. Sin Supabase. Lugares: Cajón suelto y pestaña 🪘 de 🥁 Ritmos
  (mismo archivo). Prueba (navegador): marcar/arrastrar, tocar con luz, pasar a semicorcheas sonando, 6/8 desactiva
  tresillos y ajusta, salir y volver al Ejemplo; sin errores en consola. **Falta:** probarlo el PO con sonido.
- **Paso 2 hecho (2026-10-28):** el ritmo se guarda en la **Biblioteca** como recurso **🪘 Cajón** de una canción
  (`repertorio_assets`, `tipo = 'cajon'`, `contenido` = el ritmo en texto JSON `{ v, cifra, div, compases, bpm, metro,
  agudo, grave }`, `etiqueta` = nombre del ritmo; sin archivo en Storage; **sin cambios en Supabase**). En el Cajón,
  sobre la cuadrícula: canción · nombre del ritmo · **💾 Guardar** (si no hay canción, pide elegirla con buscador) ·
  **📂 Abrir** (los ritmos de cajón guardados, por canción) · **＋ Nuevo**. Dirección `?cancion=<id>` (nuevo para esa
  canción) y `?asset=<id>` (abrir uno). Lo no guardado queda en el equipo y se recupera al volver a abrir el mismo
  ritmo; al cerrar su pestaña del Workspace se guarda solo. **Biblioteca:** ＋ recurso → botón 🪘 Cajón y ✏️ en el
  recurso abren el Cajón en una pestaña cerrable del Workspace; el tipo suma su etiqueta en las tarjetas; el
  Entrenador no lo muestra (aún no lo abre). `comun/nombre-asset.js` conoce el tipo ("Canción · Cajón · Festejo").
  Desde 🥁 Ritmos se abre con 📂 Abrir. Lugares en `LUGARES_DE_USO.md` (Cajón). Prueba (navegador): canción por
  dirección, Guardar se activa al marcar, borrador, cuadros Abrir / Guardar con buscador, ficha y tarjeta de la
  Biblioteca con un recurso Cajón de mentira, sin errores. **No se probó guardar de verdad** (la prueba no puede
  escribir en la base real): **falta que el PO guarde un ritmo y lo vuelva a abrir.**
- **Paso 3 hecho (2026-10-28):** **versión para estudiantes** del Cajón: `CAJON-PERUANO/index.html?modo=alumno&a=<id>&n=<nombre>`,
  enlace corto **`c/?a=&n=`** (`c/index.html` solo redirige). Sin clave y **sin conectarse a la base de datos** (no carga
  Supabase): lee el archivo público `repertorio-assets/cajon/<id>.json` (el ritmo + canción y nombre). Muestra la figura
  tocando y la cuadrícula con la luz, **sin editar**: ⏮ ▶ 🔁, BPM − / +, ⏱ Metrónomo y pantalla completa; en el celular
  vertical pide girarlo; en horizontal la cuadrícula se compacta para caber. No guarda borrador en el equipo del estudiante.
  El archivo público se escribe al **💾 Guardar** en el Cajón y se rehace al compartir desde la Biblioteca (sirve para los
  ritmos guardados antes del paso 3); al borrar el recurso o la canción se borra también. **Biblioteca:** el recurso
  Cajón **publicado** muestra el ✈ (menú `comun/compartir.js`: Copiar link · QR · Guía QR, instrumento "Cajón").
  Prueba (navegador): enlace corto → versión estudiante sin Supabase; ritmo que no existe → aviso; con un ritmo de
  mentira: figura, cuadrícula sin editar y sin borrador, cabe en 780×360; ✈ solo en publicados. **No probado:** subir el
  archivo público ni abrir un enlace real en un celular (requiere guardar en la base real): **falta que lo pruebe el PO.**
- **Lugares:** Cajón suelto, 🥁 Ritmos, ficha de la Biblioteca y versión estudiante (`LUGARES_DE_USO.md`).

---

### EG. 🥁 Estilos rítmicos en la Biblioteca (Festejo, Landó, Cueca…) — APROBADA, paso 1 hecho
*Origen: PO 2026-10-28, tras cerrar EF ("algunos ritmos deberían ser assets en sí mismos, no solo vinculados a las
canciones: patrones que constituyen una identidad musical —estilos— y que se podrían vincular a distintas canciones").*
- **Decisiones del PO (2026-10-28):** (1) los estilos son un **tipo nuevo de la Biblioteca**, junto a Canción y Material,
  con ficha propia (sus ritmos de cajón y, si se quiere, audios/videos de ejemplo); (2) una canción tiene generalmente
  **un** estilo, pero puede mezclar **varios**; (3) la ficha de la canción muestra el ritmo de su estilo para abrirlo o
  compartirlo; **el BPM propio de esa canción se guarda en el vínculo** (propiedad del ritmo para esa canción); además la
  canción puede tener sus propios ritmos creados en el Cajón (ya existe, EF paso 2).
- **Auditoría:** las fichas de la Biblioteca son filas de `repertorio_canciones` con `categoria` `cancion` | `material`
  (texto); un estilo puede ser otra fila con `categoria = 'estilo'` y sus ritmos, recursos 🪘 Cajón normales (EF).
  El campo existente `estilo` de las canciones es el **género** que trae iTunes (Pop, Cueca, Infantil…, ~40 valores):
  **no** sirve para esto. Para el vínculo canción ↔ estilos con BPM hace falta **una columna nueva** en
  `repertorio_canciones` (lista JSON) → cambio en Supabase que corre el PO. `repertorio_canciones` ya está en Realtime.
- **Plan (aprobado por el PO 2026-10-28):** 1) **🥁 Estilo** como tipo de la Biblioteca (junto a Canción y Material) y
  el campo "Estilo / Género" pasa a llamarse **Género**; 2) **enlazar** canciones ↔ estilos en la ficha de la canción
  (varios por canción, BPM propio por ritmo en esa canción; la ficha del estilo muestra sus canciones) — requiere una
  columna nueva en `repertorio_canciones` (SQL que corre el PO); 3) el Cajón abre y comparte el ritmo del estilo con el
  BPM de la canción.
- **Paso 1 hecho (2026-10-28):** `REPERTORIO/index.html`: en Nueva/Editar, Tipo **🥁 Estilo** (`categoria = 'estilo'`,
  sin campo Artista, igual que Material); el filtro recorre Todo → Canciones → Materiales → **Estilos**; ficha y tarjeta
  sin carátula muestran 🥁. Sus ritmos son recursos 🪘 Cajón normales (EF). El campo y el filtro "Estilo" se ven como
  **Género** ("Todos los géneros"); el dato guardado (`estilo`) no cambia. Sin cambios en Supabase. Prueba (navegador,
  sin guardar): ciclo del filtro, Tipo Estilo oculta Artista, tarjeta 🥁 con un estilo de mentira, rótulos Género.
- **Ajuste (PO 2026-10-28):** al crear el estilo "Cueca" la Biblioteca le pegó la letra de una canción (al guardar una
  entrada nueva siempre buscaba letra en LRCLIB con su nombre). Ahora **solo las canciones** buscan letra (estilos y
  materiales no); en Tipo Estilo se oculta "Importar metadata" (iTunes); en la ficha de un estilo, ＋ recurso no ofrece
  📝 Letra. La letra ya pegada a la Cueca la borra el PO con 🗑 (la prueba no puede borrar datos). Lo que pide el PO
  ("debería tener canciones asociadas") es el **paso 2**, que espera su visto bueno.
- **Ajuste 2 (PO 2026-10-28):** un estilo no tiene año, género ni enlace: en Tipo Estilo el cuadro muestra solo
  **Nombre** y **País o región** (se guarda en `artista`: aparece bajo el nombre en la tarjeta y la ficha y entra en la
  búsqueda, sin columna nueva). Título "Nuevo estilo" / "Nuevo material" y ejemplo "Festejo". Prueba (navegador, sin
  guardar): campos visibles por tipo (canción / material / estilo), título y ejemplo.
- **Ajuste 3 (PO 2026-10-28): bandera** como carátula del estilo: al guardarlo, si "País o región" nombra un país
  (~60 en una lista: América, España, Portugal, África, Europa, Asia…; sin tildes ni mayúsculas, el primero que
  aparece), `artwork_url` = imagen de **flagcdn.com** (`w320/<código>.png`; Windows no dibuja los emojis de banderas,
  por eso imagen; necesita internet como las carátulas de iTunes). Una región sin país ("Andes") queda con 🥁 y si se
  quita el país se quita la bandera. Se ve entera (sin recortar) en la tarjeta y la ficha. Los estilos ya creados la
  toman al guardarlos de nuevo (✏️ → Guardar). Prueba (navegador, guardado simulado): Cueca + Chile → bandera en
  tarjeta y ficha; Perú, México, "perú / chile" (la primera), Andes (sin bandera). El PO vio "algo raro" en el botón
  Guardar del cuadro: la simulación guarda y cierra bien; **queda por precisar qué vio.**
- **Corrección (PO 2026-10-28): ✏️ Editar no guardaba nada** (ninguna canción, material ni estilo) y no avisaba: desde la
  deuda AU (2026-10-08) cada ficha lleva en la página la marca `personal` (⭐), que se enviaba a `repertorio_canciones`
  como si fuera columna → Supabase rechazaba el guardado y el error quedaba escondido (el cuadro no se cerraba). Ahora
  `sbUpsertCancion` no la envía y, si un guardado falla, se avisa "No se pudo guardar: …" y el cuadro queda abierto.
  Títulos "Editar estilo" / "Editar material"; en un estilo no se muestra la carátula (la pone su país). Prueba
  (navegador, envío interceptado): se envían solo columnas reales, bandera de Chile, cuadro cerrado con "Estilo
  actualizado"; con error simulado, aviso y cuadro abierto. **Falta:** que el PO edite la Cueca y vea la bandera.

---

### EH. 🪘 Cajón — elegir la mano de cada golpe (D / I) y regla fija grave/agudo — HECHA
*Origen: PO 2026-10-28 ("que para cada golpe pueda asignar una mano en específico; y/o dejar una mano fija para
bombo/agudo").*
- **Auditoría:** hoy las manos se reparten solas (`prepararGolpes`): golpes simultáneos = una en cada mano; seguidos
  (< 0,5 s) se alternan; con tiempo, la derecha. La figura ya sabe llevar cualquier mano a grave o agudo (`DESTINO`).
  El ritmo programado se guarda como JSON en `repertorio_assets.contenido` y en el archivo público del estudiante:
  sumar las manos ahí **no toca Supabase**.
- **Decisiones del PO (2026-10-28):** (1) **pincel de mano** sobre la cuadrícula: ✋ Auto · D · I; cada golpe nuevo
  queda con la mano del pincel; clic sobre un golpe con otra mano se la cambia; clic sobre uno con la misma mano lo quita;
  (2) **regla fija** para todo el ritmo, configurable: Automática · Grave D / Agudo I · Grave I / Agudo D. La mano
  elegida golpe a golpe manda sobre la regla.
- **Plan:** cada golpe muestra su mano (D / I; tenue si la eligió el Cajón); dos golpes juntos nunca quedan en la misma
  mano (el segundo pasa a la otra); se guarda con el ritmo (`mano`, `regla`) y lo ve el estudiante.
- **Hecho (2026-10-28):** `CAJON-PERUANO/index.html`. Sobre la cuadrícula: **Mano** ✋ Auto · D · I (pincel) y
  **Regla** Automática · Grave D · Agudo I · Grave I · Agudo D. Cada golpe muestra D / I (oscuro si la mano es elegida
  o de la regla; tenue si la reparte el Cajón). `prepararGolpes` respeta la mano elegida y, si dos golpes juntos piden
  la misma, el segundo pasa a la otra; sin mano elegida, el reparto de siempre (también para los MIDI). Las manos se
  conservan al cambiar división o cifra (se ajustan con su golpe); Limpiar las borra. En el JSON del ritmo van `mano`
  y `regla` solo si se usan (los ritmos ya guardados no cambian); el estudiante ve las letras pero no el pincel ni la
  regla. Sin Supabase. Prueba (navegador): reparto automático D/I; pincel I cambia la mano y un segundo clic quita;
  grave I + agudo junto → agudo D; regla Grave D · Agudo I; cambio a semicorcheas conserva la mano.

---

### EI. 🪘 Cajón — barra: Abrir patrón · Nuevo ritmo · Editar ritmo — HECHA
*Origen: PO 2026-10-28 ("borra el botón Ejemplo; Cargar MIDI no interesa, debería ser Abrir patrón y poder revisar un
patrón de todos los que hay; Programar muestra el último editado y no debería: Nuevo ritmo en blanco, y para editar un
botón de edición de ritmo").*
- **Hecho (2026-10-28):** `CAJON-PERUANO/index.html`. Barra: **📂 Abrir patrón** · **＋ Nuevo ritmo** ·
  **✏️ Editar ritmo** (con su espacio reservado; se ve solo con un patrón abierto para mirar).
  - **Abrir patrón:** lista de todos los ritmos de cajón guardados, por canción o estilo (estilos primero, con 🥁 y su
    país), buscador que también encuentra por nombre del ritmo. El patrón se abre **para mirar y tocar** (como el
    estudiante, más el metrónomo); ✏️ Editar ritmo muestra nombre, Guardar, mano, regla, cifra, división y compases.
  - **Nuevo ritmo:** siempre en blanco y editable (ya no reaparece el último editado al abrir el Cajón). Si hay
    cambios sin guardar, pregunta antes. Lo no guardado de un patrón ya guardado se recupera al reabrirlo.
  - La barra muestra "🪘 Canción — Nombre del ritmo" (o "Ritmo nuevo"). Abrir desde la Biblioteca (✏️) sigue abriendo
    para editar.
  - **Retirado:** Ejemplo, Cargar MIDI, arrastrar un MIDI y 🎚️ Notas (el panel grave/agudo por nota del MIDI). Queda
    solo `?midi=<url>` (sin uso actual) para no romper un enlace; regla 10: no se guarda código de respaldo.
  - Lugares: Cajón suelto, 🥁 Ritmos y pestaña abierta desde la Biblioteca (mismo archivo); el estudiante no cambia.
  - Prueba (navegador): barra nueva; al abrir, aviso y sin ritmo; Nuevo ritmo en blanco y editable; Abrir patrón
    lista Cueca (Chile) y Cumbia (Colombia) primero; abierto: no se edita, Guardar oculto, metrónomo visible;
    ✏️ Editar ritmo habilita todo; sin errores.

---

### EJ. 📁 Archivos del curso en el celular (revisar fotos, audios, videos y enlaces) — HECHA
*Origen: PO 2026-10-28 ("¿la PWA móvil me permite revisar los audios/videos/imágenes de los archivos de los cursos?" →
hoy no: solo sube con 📷 Subir y ve las fotos ligadas a una clase en su bitácora. "Sí, agrégalo").*
- **Auditoría:** `comun/archivos-curso.js` (`ArchivosCurso.abrir`) es la ventana del PC (Cursos y ficha de la canción):
  lista del año con Abrir (pestaña nueva), ✏️, ⬇ y 🗑 (este solo al pasar el mouse); pensada para pantalla ancha.
  `MOVIL/cursos.html` ya carga el JS (no el CSS) y `sw-movil.js` ya guarda el JS (no el CSS).
- **Plan:** botón **📁** en la página del curso del celular (junto a ＋ Nota) que abre la misma ventana; la ventana se
  adapta a pantalla chica (ocupa toda la pantalla, filas en dos líneas, 🗑 siempre visible en pantallas táctiles,
  formulario de ✏️ en una columna); **tocar el nombre** de una foto, audio o video lo muestra/reproduce **dentro de la
  lista** (mejora que también recibe el PC, regla 11); enlaces de YouTube / Drive siguen con Abrir. El CSS se suma al
  celular sin señal (`sw-movil.js`).
- **Hecho (2026-10-28):** `MOVIL/cursos.html` (botón 📁 junto a ＋ Nota; carga `archivos-curso.js` + `.css`),
  `comun/archivos-curso.js` (tocar el nombre de foto / audio / video abre su vista o reproductor bajo la fila; otro toque
  la cierra) y `.css` (pantalla completa bajo 640 px, filas en dos líneas, 🗑 visible en táctiles, formulario en una
  columna). `sw-movil.js` v15 y "🔄 Cargar versión nueva" suman el CSS; Cursos PC y Biblioteca piden `?v=ej1`.
  Lugares (regla 11): Cursos PC, Cursos celular y Extractos y versiones de la Biblioteca (misma ventana). Prueba
  (navegador, 375×812 y escritorio): Taller de Cuerdas → 📁 → dos audios con canción y extracto; tocar el nombre
  muestra el reproductor y el audio carga (0:40) y suena; en escritorio la ventana queda como antes, con el reproductor.

---

### EK. Biblioteca — el curso marcado en la ficha no se pintaba (se guardaba igual) — HECHA
*Origen: PO 2026-10-28 ("en Go Away marqué Cuerdas, aparece el aviso de agregada pero no se pinta el botón").*
- **Causa:** al llegar un aviso "al instante" (deuda BE) la Biblioteca recarga canciones y sesiones; si no había
  cambios visibles salía antes de reapuntar la ficha abierta (`songActiva`) a la copia nueva. Desde ahí la ficha
  pintaba con la copia vieja: marcar un curso se guardaba (y aparecía al recargar) pero el botón no cambiaba.
- **Corrección:** `bibRefrescar` reapunta siempre la ficha abierta antes de comparar. Prueba (navegador, guardado
  simulado): ficha de Go Away → refresco sin cambios → marcar Quinto → el botón queda pintado.
- **Anotado en Notion (Backlog, Pendiente, Media):** celular — cambiar pitch y velocidad en las canciones de las sesiones.

---

### EL. 🪘 Cajón — ver todos los ritmos del estilo y cambiar entre ellos — HECHA
*Origen: PO 2026-10-28 ("cuando abro en la app cajón algún ritmo (estilo) deberían verse todos los ritmos y poder
cambiar entre ellos sin salir de la app").*
- **Auditoría:** `CAJON-PERUANO/index.html` abre un solo recurso (`abrirRecurso`); para ver otro ritmo del mismo estilo
  hay que volver a 📂 Abrir patrón y buscarlo. Los ritmos de un estilo o canción son sus recursos `tipo = 'cajon'`
  (`repertorio_assets.cancion_id`). Sin cambios en Supabase.
- **Plan:** con un ritmo abierto, una fila arriba de la cuadrícula con **todos los ritmos de esa canción o estilo**
  (el abierto marcado); un clic cambia de ritmo (pregunta si hay cambios sin guardar) y, si estaba sonando, sigue
  sonando el nuevo. **＋ Otro** empieza un ritmo nuevo en el mismo estilo. El estudiante no cambia.
- **Hecho (2026-10-28):** `CAJON-PERUANO/index.html`: fila "♬ Estilo · 🪘 ritmo · 🪘 ritmo · ＋ Otro" arriba de la
  cuadrícula (el abierto en celeste; su nombre cambia al escribirlo). Cambiar conserva mirar / editar, sigue sonando si
  sonaba y actualiza `?asset=` si venía en la dirección. ＋ Otro solo se ve editando. La lista se pone al día al
  guardar. Lugares: Cajón suelto, 🥁 Ritmos y pestaña desde la Biblioteca (mismo archivo); el estudiante no la ve.
  Prueba (navegador): Cueca Principal sonando → clic en Básico → sigue sonando con "Cueca — Básico"; Cumbia por
  `?asset=` (editando) → Variación 1 queda editable y la dirección cambia; sin errores.

---

### EM. 🪘 Cajón — nuevo dibujo: solo el cajón y dos manos (sin la persona) — HECHA
*Origen: PO 2026-10-28 (imagen de referencia: mano izquierda azul, derecha roja, mangas amarillas, estilo caricatura
con borde negro). "No es necesario renderizar a la persona, solamente el cajón en primer plano y las manos.
Agudo: al borde del cajón y solo con los dedos. Grave: basta que la palma entre completa en el cajón; la derecha se
acerca al centro pero nunca queda al centro (centro derecha); la izquierda igual, a la izquierda".*
- **Plan:** `CAJON-PERUANO/index.html`, solo el dibujo (sonido, cuadrícula, cinta y manos D / I iguales). La tapa del
  cajón grande de frente; las manos entran desde arriba con su manga, vistas por el dorso, dedos hacia abajo y pulgar
  hacia el centro. Agudo: la palma queda sobre el borde de arriba y solo los dedos tocan la tapa (cerca de la
  esquina de su lado). Grave: la mano entera dentro de la tapa, a centro izquierda / centro derecha. Antes del golpe la
  mano sube y se agranda (más cerca) y su sombra en la tapa se aclara; al golpear, sombra marcada. Aplica igual en la
  versión del estudiante (mismo archivo).
- **Hecho (2026-10-28):** `CAJON-PERUANO/index.html`: fuera la persona y los brazos con codo; tapa grande de frente con
  su asiento arriba; manos de caricatura (borde negro, dedos con pliegues, puño amarillo y manga que se desvanece
  hacia arriba), armadas por código desde una sola mano (la derecha es su espejo). Sombra en la tapa que se marca al
  golpear. Efecto del agudo en la punta de los dedos; el del grave en la palma. El movimiento (cuándo sube, golpea y
  descansa cada mano) es el mismo de antes.
  Prueba (navegador): Cumbia Principal sonando, las dos manos alternan agudo (dedos sobre el borde, palma afuera) y
  grave (mano entera dentro, centro izquierda / derecha); poses fijas revisadas en captura; sin errores.
- **Ajuste (PO 2026-10-28, con captura):** la tapa sube hasta donde el agudo golpea (borde 175 → 161); las manos quedan
  donde estaban y el destello del agudo sale justo en el borde.
- **Ajuste 2 (PO 2026-10-28, con imagen):** todo golpe (agudo y grave) se marca con **tres rayitas de historieta**
  bajo la punta de los dedos, del color de la mano (fuera los círculos naranjos y la estrella celeste). Se perdían los
  golpes del comienzo de cada vuelta al repetir (al dar la vuelta se saltaban los ya pasados): ahora se dibujan todos
  (prueba: 41 dibujados de 40 esperados en 8 s de Cumbia). La sombra tiene la **forma de la mano** (con su puño), se
  separa y aclara al subir.

---

### EN. 🪘 Cajón — 🔢 Precuenta (y rayitas más abiertas) — HECHA
*Origen: PO 2026-10-28 ("necesitamos toggle para precuenta; además las tres rayitas más separadas entre sí").*
- **Hecho (2026-10-28):** `CAJON-PERUANO/index.html`. Botón **🔢 Precuenta** junto a ⏱ Metrónomo (también en mirar y
  en la versión del estudiante): al tocar desde el comienzo suena un compás de clics (acento en el 1) y el número del
  tiempo se ve grande, en amarillo, sobre el cajón; después empieza el ritmo. Al seguir desde una pausa o al dar la
  vuelta no cuenta. Es preferencia del equipo (parte encendida), no del ritmo. Las tres rayitas se abren más
  (≈ 57° entre cada una).
  Prueba (navegador): Cumbia 4/4 a 100 BPM → cuenta 1 2 3 4 y empieza; apagada empieza al tiro; rayitas en captura.

---

### EO. Celular — 📚 Biblioteca: buscador de canciones arriba de las sesiones — HECHA
*Origen: PO 2026-10-29 ("en la sección Biblioteca de la PWA móvil necesito un buscador de canciones, arriba de todas
las sesiones"). DECISIÓN del PO: busca en **toda la Biblioteca**, no solo en las sesiones.*
- **Auditoría:** `REPERTORIO/index.html?movil=1` (`movilPintar`): pestañas Cursos / Otras sesiones → canciones de la
  sesión → Entrenador. No había forma de buscar. Sin cambios en Supabase.
- **Plan / hecho:** cuadro "🔍 Buscar canción…" arriba de las pestañas; al escribir, la lista muestra las canciones de
  la Biblioteca (solo canciones, no estilos ni materiales) que calzan con el nombre o el artista, con los cursos o
  sesiones donde está. Tocar una la abre dentro de su sesión (primero la del curso; deslizar pasa a la siguiente de
  esa sesión) o, si no está en ninguna, sola. Atrás vuelve a la búsqueda tal como quedó; ✕ la borra.
- Lugares: solo la Biblioteca del celular (`?movil=1`); el PC no cambia. Prueba (navegador, 375×812): "go" → 8
  canciones con sus cursos (Go Away · Octavo, Taller de Cuerdas); Go Away se abre en la sesión de Octavo; Algoritmo
  otra vez (sin sesión) se abre sola; atrás vuelve a la búsqueda "go"; pestañas ocultas mientras se busca; sin errores.

---

### EP. Biblioteca — ordenar los recursos (ficha por instrumento, clase del recurso, pestañas del catálogo) — APROBADA (PO 2026-10-29), HECHA (entregas 1, 2 y 3)
*Origen: PO 2026-10-29 ("quiero ordenar un poco todo eso de los assets en la Biblioteca; está creciendo, pero tiende
a desordenarse"). Hoy: 125 fichas (102 canciones, 20 materiales, 3 estilos) y 318 recursos (100 letras, 90 audios,
92 tablaturas, 15 ritmos, 14 metalófono, 5 cajón, 2 melodías); 223 en borrador, 89 publicados.*
- **Decisiones del PO (preguntas 2026-10-29):** el desorden está en la **ficha de la canción** y en los **nombres** (no
  dicen qué son, se repiten, falta la dificultad, se ven mal fuera de la ficha). Agrupar **por instrumento**, con un
  grupo **🎵 Canción** arriba (audio, letra, extractos y versiones) y luego **cuerdas primero**: Guitarra · Ukelele ·
  Bajo · Metalófono · Piano · Cajón / Ritmo (solo los que tengan algo). En cada grupo, publicados arriba y borradores
  abajo, con un botón **Publicado / Borrador / Ambos**. **Clase** del recurso elegida de una lista: Armonía · Melodía ·
  Riff · Acompañamiento · Quintas, con la opción **Simplificado(a)** para cualquiera; el detalle libre sigue. Los
  recursos existentes los clasifica el PO a mano. Dificultad **opcional pero visible** ("sin dificultad").
  Catálogo en **pestañas**: 🎵 Canciones · 📚 Materiales · 🥁 Estilos. Campo nuevo en la base de datos **autorizado**.
- **Plan (3 entregas):**
  1. Catálogo en pestañas (el buscador busca en la pestaña elegida).
  2. Ficha por instrumento + botón Publicado / Borrador / Ambos (recordado en el equipo) + "sin dificultad".
  3. Clase: `supabase/repertorio_assets_clase.sql` (columnas `clase` y `simplificado`, sin tocar lo existente); el
     editor del recurso la pide con lista + casilla Simplificado(a); el nombre pasa a
     **Canción · Instrumento · Clase (simplificada) · Detalle · Dificultad** en `comun/nombre-asset.js` (regla 11:
     Biblioteca, Lector, Planificador, Entrenador, Compartir). Filtro "sin clase" para encontrar lo que falta
     clasificar.
- **Entrega 1 hecha (2026-10-29):** `REPERTORIO/index.html`: el botón que pasaba Todo → Canciones → Materiales →
  Estilos se cambió por tres pestañas fijas **🎵 Canciones · 📚 Materiales · 🥁 Estilos** (parte en Canciones; ya no hay
  "Todo"). El buscador dice cuántos hay en la pestaña ("Buscar en 102 canciones…") y busca solo ahí; los chips de
  curso siguen filtrando dentro de la pestaña. Nueva ficha parte en el tipo de la pestaña; al guardar o cambiar el
  tipo de una ficha se pasa a su pestaña. Prueba (navegador): 102 canciones / 20 materiales / 3 estilos; sin errores.
- **Entrega 2 hecha (2026-10-29):** `REPERTORIO/index.html`, ficha de la canción. "Assets" pasa a **Recursos**, en
  grupos plegables: **🎵 Canción** (letra, audio y, adentro, Extractos y versiones) · Guitarra · Ukelele · Bajo ·
  Metalófono · Piano (melodías del Editor para piano / melódica; las que son solo de metalófono van en Metalófono) ·
  Cajón / Ritmo (ritmos y cajón) · Otros (tablaturas sin instrumento, cifrado). Solo aparecen los grupos con algo
  (Canción siempre). En cada grupo, publicados arriba y "Borradores" abajo (borrador, experimental, archivado).
  **Publicado / Borrador / Ambos** arriba de la lista (recordado en el equipo); el contador dice "vistos / total"
  si hay ocultos. Recurso de instrumento sin dificultad: "sin dificultad" en naranjo. Arrastrar ordena dentro del
  grupo y del lote; el orden guardado sigue lo que se ve (los ocultos por el filtro no se mueven).
  Prueba (navegador): Go Away → Canción 2 (con 2 extractos), Guitarra 5 (4 + 1 borrador), Bajo 3, Piano 1;
  Publicado → Canción 0 / 2, Guitarra 4 / 5; Borrador → Guitarra 1 / 5; Aló, Aló muestra "sin dificultad"; sin errores.
- **Entrega 3 hecha (2026-10-29); `supabase/repertorio_assets_clase.sql` corrido por el PO (318 recursos, sin clase):** columnas `clase`
  (armonia · melodia · riff · acompanamiento · quintas, con verificación) y `simplificado` (no cambia lo existente).
  Editor del recurso (`REPERTORIO`): para todo recurso de instrumento, **Clase** (clic en la elegida la quita),
  **Simplificado(a)**, **Dificultad** (antes solo en tablaturas) y **Detalle** (ex Etiqueta), con "Se verá: …" al
  vuelo. Ritmo, cajón y melodía (su ✏️ abre su editor) suman 🏷 para eso. Corrección de paso: editar un recurso que
  no es tablatura ya no le copia el instrumento/dificultad de la última tablatura editada.
  Nombre (`comun/nombre-asset.js`, `?v=ep3`): **Canción · Instrumento · Clase · Detalle · Dificultad** ("Armonía
  simplificada", "Riff simplificado", "Quintas simplificadas"; sin "Melodía · Melodía"); nuevo `detalle` (clase +
  descripción) donde el instrumento ya se ve. Lugares (regla 11): Biblioteca (ficha, selector de tablaturas),
  Lector (`tabs/`), Planificador (canciones de las actividades, selector de metalófono) y Planificación del mes;
  sus consultas piden ahora `clase, simplificado`. Ficha: "sin clase · sin dificultad" en naranjo; catálogo:
  botón **🏷 Sin clase** (fichas con algo por clasificar: 25 canciones hoy).
  Prueba (navegador, antes del SQL): editor de Go Away / Guitarra → "Se verá: Go Away (feat. Best Coast) · Guitarra
  · Armonía simplificada · Parte C · Inicial"; nombres de ejemplo correctos; guardar queda para después del SQL.
  Prueba tras el SQL: guardar Armonía + Simplificado en una tablatura de Go Away queda en la base y el nombre sale
  "… · Guitarra · Armonía simplificada · Parte C · Inicial" (luego se dejó como estaba); las consultas del Plan,
  del selector de metalófono y del Lector con `clase, simplificado` responden bien.
- **Ajuste (PO 2026-10-29, con capturas; "PERFECTO, queda todo para validar en uso real"):** los extractos y versiones
  ya no van con títulos aparte ("Extractos y versiones" / "Extractos (2)"): son filas más de 🎵 Canción, como Letra y
  Audio, con **EXTRACTO** (o VERSIÓN) y debajo, más chico, su parte ("Parte C"); el nombre del archivo no se muestra
  (queda al pasar el mouse). Orden: extractos según las partes de la canción, luego versiones y otros. El número de
  Canción los cuenta. Prueba: Go Away → Canción 4 (Letra, Audio, Extracto Parte C, Extracto Coro); ▶ reproduce ahí.

---

### EQ. 🎤 Compartir una canción (audio + letra sincronizada) con los estudiantes por link o QR — HECHA
*Origen: PO 2026-10-29 ("¿puedo compartir canciones (melodía/karaoke) con letra vía link o QR?" → hoy no; "prepara
el plan"). Ya figuraba como siguiente paso del celular (DG/DH): "versión para alumnos por enlace / QR por canción".*
- **Auditoría:** el ✈ (`comun/compartir.js`: link, QR, guía QR) existe para metalófono (`m/`), piano (`p/`),
  tablaturas (`t/`) y cajón (`c/`); no para canciones. La letra es el recurso `letra` (`contenido` = texto con
  estrofas separadas por línea en blanco; `synced` = LRC con tiempos de entrada y, a veces, de salida) y los audios
  son recursos `audio` con `rol` melodia / karaoke, en el bucket público `repertorio-assets` (la sincronía es una sola
  y sirve a los dos audios). Las versiones de estudiante no usan la base de datos: leen un archivo público
  (`cajon/<id>.json`, `melodia/<id>.json`), y así sería aquí. **Sin cambios en tablas de Supabase.**
- **Plan:**
  1. **Página para estudiantes** nueva, `CANTAR/index.html`, con enlace corto `l/?a=<id de la canción>&n=<nombre>`.
     Sin clave ni base de datos; celular (vertical u horizontal) y PC. Muestra nombre, artista y carátula; la
     **letra con el verso que suena resaltado**, avanzando sola y con las estrofas separadas (como el modo Scroll del
     Entrenador); ▶ / ⏸, barra de avance, ⏪ 5 s; **tocar un verso salta ahí**; botón **🎤 Melodía / 🎶 Karaoke**
     (solo si la canción tiene los dos). Sin edición, colores, loops ni velocidad.
  2. **Compartir desde la ficha:** ✈ en la fila de la **Letra**, solo si la letra está **publicada y sincronizada** y
     hay al menos un audio **publicado** (solo se comparten los audios publicados). Al tocarlo se escribe el archivo
     público `cancion/<id>.json` (nombre, artista, carátula, letra, sincronía y direcciones de los audios) y se abre el
     menú de siempre (link, QR, guía QR, con la guía guardada en 📁 Archivos del curso).
  3. **Al día solo:** si la canción ya se compartió, el archivo se renueva cada vez que se guarda la letra o su
     sincronización en el Entrenador, o cambia el estado de la letra o de un audio (así un link ya entregado muestra
     siempre lo último).
  - Lugares (regla 11): ficha de la Biblioteca (PC) y el Entrenador (al guardar). El celular del profe no cambia.
  - Fuera de este paso (a decidir después): compartir por partes de la letra, velocidad / tono, y abrir la versión
    estudiante desde la Biblioteca del celular.
- **Hecho (2026-10-29):** `CANTAR/index.html` (página del estudiante) + `l/index.html` (enlace corto) y, en
  `REPERTORIO/index.html`, `cancionCompartible` · `lineasPublicas` (mismo armado de líneas que el Entrenador) ·
  `escribirCancionPublica` (archivo `cancion/<id>.json`: nombre, artista, carátula, líneas con tiempo de entrada y
  salida, y los audios publicados) · `compartirCancion` (✈ en la fila de la Letra) · `cancionPublicaAlDia` (renueva o
  quita el archivo 1,5 s después de: guardar la letra o su sincronía en el Entrenador, cambiar el estado de la letra o
  de un audio, editar su ficha —rol del audio— o borrarlos). Al guardar la letra del Entrenador se usa su copia.
  Hoy cumple 1 canción (From The Start, con Melodía y Karaoke): las demás tienen la letra o el audio en borrador.
  Prueba (navegador, 375×812): l/?a=… lleva a CANTAR; carátula, nombre, Melodía / Karaoke; 35 líneas (30 con tiempo,
  5 entre estrofas); en 0:39 resalta el verso que suena; cambiar a Karaoke sigue en el mismo segundo y sonando; sin
  errores.
- **Ajuste (PO 2026-10-29):** (1) "copia el estilo de la página donde se renderizan las letras en el Entrenador":
  `CANTAR/` se rehízo como el Entrenador del celular sin edición — mismas clases y colores (`#ent-header`,
  `#ent-zona`, `.ent-stanza`, `.ent-lyric-line` cursiva 700, activo naranjo `#ea580c` centrado), portada (nombre ·
  artista), chip 🎤 Melodía / 🎶 Karaoke y el mismo reproductor (al comienzo · ▶ naranjo · estrofa siguiente ·
  tiempos · barra con punto, arrastrable); letra de 24 px en el celular y 2,2 rem en el PC. Es una copia: si el estilo
  del Entrenador cambia, cambiar aquí también (regla 11, anotado en el archivo). (2) **📅 Disponible hasta**
  (opcional, solo canciones): `comun/compartir.js` suma la opción `plazo` al menú ✈ (fecha + ✕ sin fecha); la fecha va
  en el mismo archivo público (`hasta`, último día disponible) y se conserva al renovarlo. Después de ese día la
  página dice "Esta canción estuvo disponible hasta el …" y no muestra letra ni audio, y la próxima renovación
  quita el archivo; compartir de nuevo una vencida parte sin fecha. Límite: los audios siguen en el depósito público
  de la Biblioteca (los usa todo el sistema), solo deja de entregarse su dirección.
  Prueba (navegador): menú con 📅; fecha 28/10/2026 guardada en el archivo → la página avisa que estuvo disponible
  hasta el 28/10/2026; sin fecha → vuelve; estilo nuevo en 375×812 con el verso activo en naranjo; sin errores.
- **Futuro (PO 2026-10-29):** fecha límite también para los otros recursos que se comparten (metalófono, piano,
  tablaturas, cajón). La pieza `plazo` de `comun/compartir.js` ya sirve; falta que cada versión estudiante la respete.

### ER. 🎵 Lo típico de cada grupo en las evaluaciones en grupo (canción del curso, de la Biblioteca o texto) — HECHA
*Origen: PO 2026-10-29 ("en las evaluaciones en grupo, poder asignarle a cada grupo algo típico: una canción de la
sesión del curso en el Entrenador, cualquier canción de la Biblioteca o un texto libre").*
- **Necesidad:** al evaluar en grupos cada grupo suele trabajar "su" canción u obra; hoy eso no queda anotado y hay
  que recordarlo o escribirlo en el nombre del grupo.
- **Auditoría:** los grupos viven en `libro_evaluacion_grupos` (`supabase/libro_schema.sql`: `id`, `evaluacion_id`,
  `nombre`, `nota_grupal`, `adecuacion_grupal_id`, `terminado`); los integrantes en `libro_evaluacion_notas.grupo_id`.
  Bloqueos en la base: con la evaluación **cerrada** no se toca ningún grupo (I12) y un grupo **terminado** solo
  admite Reabrir (`libro_grupo_terminado_congela`); una columna nueva queda cubierta por ambos sin cambiarlos (no se
  puede cambiar lo típico de un grupo terminado sin reabrirlo, igual que su nombre). Dónde aparecen los grupos:
  pestaña **Grupos de trabajo** (tarjeta por grupo, `grupoColHTML`), ventana **Evaluar grupo** (`renderEvalModal`),
  **Resultados** (buscador: el nombre del grupo junto al estudiante), **📽️ Proyectar** de Grupos
  (`comun/libro-proyeccion.js`, tipo `grupos`) y el celular **Evaluar** (`MOVIL/evaluar.html`, lee `id,nombre`).
  El repertorio del curso es la sesión del Entrenador con `contexto_id` (`repertorio_sesiones_entrenamiento.canciones`,
  lista de `{ cancion_id }`), como en el 🎵 del Plan (`PORTAL/index.html`, `cancionesDelCurso`). El Libro hoy no lee
  la Biblioteca.
- **Plan propuesto:**
  1. **Supabase** (`supabase/libro_grupo_tipico.sql`, lo corre el PO): dos columnas en `libro_evaluacion_grupos`:
     `cancion_id` (canción de la Biblioteca, TEXT como su id y sin llave foránea: con ella, borrar una canción usada
     por un grupo terminado chocaría con sus bloqueos; si ya no existe, no se muestra) y `tipico` (texto libre). Uno u
     otro: elegir una canción borra el texto y al revés.
  2. **Dónde se elige:** en cada tarjeta de grupo (Grupos de trabajo) y arriba en la ventana Evaluar grupo, un botón
     "🎵 Elegir…" abre un selector con buscador: primero **Repertorio del curso** (sesión del Entrenador), después
     **Biblioteca** (todas las canciones, sin estilos) y al final **✏️ Escribir otra cosa** (texto libre). ✕ lo quita.
  3. **Dónde se ve:** la tarjeta del grupo, la ventana Evaluar grupo, Resultados (junto al nombre del grupo), el
     📽️ Proyectar de Grupos (bajo el nombre de cada grupo) y el celular Evaluar (junto al nombre del grupo).
  - Lugares (regla 11): Libro PC (Grupos de trabajo, Evaluar grupo, Resultados, Proyectar → Pizarra) y celular
    Evaluar. No cambia el Plan ni la Biblioteca.
  - Fuera de este paso: abrir la canción en el Entrenador desde el grupo; informes de UTP (no la incluyen).
- **Decisión del PO (2026-10-29):** plan aprobado tal cual.
- **Hecho (2026-10-29):** `supabase/libro_grupo_tipico.sql` (corrido por el PO; la primera versión creó `cancion_id`
  como UUID y los id de canciones son texto, el archivo la pasa a TEXT). `LIBRO/index.html`: `tipCargarBib`,
  `tipCargarCurso`, `tipicoDe` / `tipicoTxt` / `tipicoHTML`, selector `#tip-modal` (`tipAbrir`, `tipPintarLista`,
  `tipGuardar`, `tipGuardarTexto`); se muestra en la tarjeta del grupo y en Evaluar grupo (editable solo con el grupo
  abierto), en Resultados (junto al grupo) y en la foto de Proyectar (`tipico`). `comun/libro-proyeccion.js`: línea
  `.lpro-tip` bajo el nombre del grupo. `MOVIL/evaluar.html`: lee los grupos con `*` y el nombre de su canción, y lo
  muestra junto a los pendientes de cada grupo.
  Prueba (navegador, evaluación Karaoke de 8°): buscador con el repertorio de 8° arriba y la Biblioteca abajo; Grupo 1
  con canción y Grupo 2 con texto, guardados en la base y visibles al recargar en la tarjeta, Evaluar grupo,
  Resultados, Proyectar a pantalla completa y Evaluar del celular; después se dejaron vacíos como estaban. Sin errores.

### ES. 🎹 Arreglo de piano: la armonía por compás de toda la canción + la melodía, con la grabación — HECHA (etapa 1)
*Origen: PO 2026-10-29 ("un arreglo de piano completo de una canción que ya está en la Biblioteca: la armonía con una
mano a lo largo de toda la canción y, donde va la melodía que ya existe, incluirla; con audio sincronizado y
compartible con los estudiantes hasta una fecha límite"). Primera prueba de un tipo de material que después se repite.*
- **Necesidad:** la pianista del taller necesita estudiar en la casa el arreglo entero de la canción, no solo la
  melodía, tocando al ritmo de la grabación real.
- **Auditoría:**
  - **Editor de Melodías** (`MELODIA/index.html`): guarda un recurso `melodia` (`repertorio_assets.contenido` = JSON
    en grados: `{ v, tempo, compas, fig, tonica, modo, inst, mano, notas: [[t, d, g, o, a, dig]] }`, t y d en
    semicorcheas), un MIDI `melodia/<id>.mid` para el Metalófono (corrido de octava hasta caber) y el archivo público
    `melodia/<id>.json` con alturas reales (`notas: [{ t, d, m, nombre, dig }]`, `mano`) para el Piano. Una sola mano
    por melodía; la digitación (paso ④) es por instrumento.
  - **Piano** (`PIANO/index.html`, enlace `p/?a=&n=`): estilo Synthesia sobre un teclado que se ajusta al rango; piano
    sintetizado propio; − / + y 🔁 +5; colores por mano ya previstos (derecha verde, izquierda azul, `n.mano`); sin
    grabación ni fecha límite.
  - **Cantar** (`CANTAR/`, `cancion/<id>.json`): grabación Melodía / Karaoke con botón, y `hasta` (fecha límite) que la
    Biblioteca escribe con el menú ✈ (`comun/compartir.js`, opción `plazo`).
  - **Entrenador**: ya cambia el tono de la grabación con SoundTouch (`soundtouchjs@0.1.30`, ±6 semitonos).
  - `repertorio_assets.tipo` no tiene restricción en la base (como `cajon`): un tipo nuevo `arreglo` no pide SQL.
  - Canción elegida: **COQUETA**. Melodía "Mambo" (8 compases, 4/4, ♩120, La mayor, mano derecha, con digitación) y
    dos grabaciones (Melodía y Karaoke, hoy en borrador). La grabación original está en **Mi**; el taller la toca en
    **La♭**; la pianista la aprendió en **La**.
- **Decisiones del PO (2026-10-29):**
  - Armonía escrita como **acordes por compás**, en **secciones con su orden** (Intro, Estrofa, Coro, Mambo…); la
    melodía va en su sección cada vez que aparece.
  - **Etapa 1 pedagógica:** el estudiante aprende los acordes por compás (un acorde por compás, sostenido). Cada acorde
    tiene **notas fijas (voicing)**: en una etapa posterior se le suma una rítmica con los mismos voicings.
  - Todo para la pianista **en La** (su teclado quizá no tiene transpose): la grabación (Mi) se sube 5 semitonos. El
    −1 del ensayo en el taller lo pone el profe en su teclado, no la app.
  - Grabación: **Melodía y Karaoke con botón**, como en Cantar.
  - **Recurso aparte** `🎹 Arreglo`, en el grupo **Piano** de la ficha de la canción. La melodía se **copia** al
    arreglo (no queda vinculada): corregir la melodía después no cambia el arreglo.
- **Plan propuesto:**
  1. **Editor de Arreglos** (`ARREGLO/index.html`, pestaña cerrable del Workspace, se abre desde la ficha de la
     canción: ＋ Arreglo en el grupo Piano, o el recurso):
     - **Base:** tonalidad, compás y tempo; "Copiar melodía" trae una Melodía de la canción (sus notas y digitación).
     - **Secciones:** nombre + acordes por compás escritos en texto (`A | E | F#m | D`, también `Am`, `D7`, `E/G#`);
       cada acorde recibe su voicing para la mano izquierda (posición cercana entre acordes, editable ▲▼ por
       inversión) y su digitación (sugerida 5-3-1, editable). Una casilla dice si la sección lleva la melodía.
     - **Orden:** la lista de secciones como suenan.
     - **Grabación:** se elige la de la canción (Melodía / Karaoke), su tono original (Mi → +5 hasta La) y dónde
       empieza el compás 1 (tapeando con Espacio sobre la grabación los primeros pulsos: da el inicio y el tempo
       exacto) + ajuste fino ± para que calce.
     - Escucha con la grabación ya transpuesta y el piano sintetizado encima.
     - Guarda el recurso (`tipo = 'arreglo'`, instrumento `piano`, `contenido` = JSON) y el archivo público
       `arreglo/<id>.json` (todas las notas desplegadas con mano y dedo, secciones con su compás de inicio, las dos
       grabaciones, +5, inicio y tempo).
  2. **Piano del estudiante** (`PIANO/index.html`, enlace `p/?r=<id>&n=`): con un arreglo, las dos manos (izquierda
     azul = acordes, derecha verde = melodía), el nombre del acorde sobre cada bloque, la sección que suena arriba y
     saltar a una sección; la grabación con 🎤 Melodía / 🎶 Karaoke, en La, y velocidad lenta sin cambiar el tono
     (SoundTouch, 50–100 %); 🎹 piano encendido o apagado encima. Respeta la fecha límite (`hasta`). Las melodías
     solas (`?a=`) siguen igual.
  3. **Biblioteca:** el recurso 🎹 Arreglo con su nombre de cortesía (`comun/nombre-asset.js`), ✈ con Copiar link · QR
     · Guía QR y **📅 Disponible hasta** (solo publicados); el archivo público se renueva al guardar.
  - Sin cambios en Supabase.
  - Lugares (regla 11): Biblioteca (ficha de la canción), Editor de Arreglos, Piano (PC y celular), menú ✈.
  - Fuera de esta etapa: la rítmica sobre los acordes, que la grabación cambie de tempo dentro de la canción (si se
    corre, se marca compás por compás en una etapa siguiente), y verlo desde el Entrenador o el Plan.
- **Decisión del PO (2026-10-29):** plan aprobado. Los acordes y el orden de Coqueta los escribe el PO en el editor
  (para eso existe); la prueba se hizo con acordes inventados en un arreglo aparte, borrado al terminar.
- **Hecho (2026-10-29):**
  - `ARREGLO/index.html` (Editor de Arreglos): ① Base (tonalidad, compás, tempo con decimales; "Copiar" trae la
    melodía elegida desde `melodia/<id>.json`, con sus dedos de piano); ② Secciones (nombre, acordes en texto —
    letras o do re mi, `/` para el bajo, `%` repite, dos acordes en un compás—, "Lleva la melodía" desde el compás N,
    aviso de lo que no entiende); ③ Orden (＋ por sección, ✕, arrastrar); ④ Acordes: cada acorde con sus notas para la
    mano izquierda (la posición más cercana a la anterior, dentro de una octava, cerca de Sol 3), ▼ ▲ para cambiarla,
    ♪ escuchar y dedos (5-3-1 o 5-2-1 sugeridos, editables); ↺ Recalcular todos; ⑤ Grabación: tono original → cuántos
    semitonos se mueve (−6 a +6), "Compás 1 en" (seg) y tempo con − / +, y ⏺ Marcar pulsos (suena la grabación ya en el
    tono del arreglo; Espacio en cada pulso desde el compás elegido; cuenta los pulsos saltados y calcula inicio y
    tempo con una recta). La vista previa a la derecha es el Piano (`PIANO/?vista=editor`) al día con cada cambio.
    Guarda `repertorio_assets` (`tipo 'arreglo'`, `instrumento 'piano'`, `contenido` = el arreglo) y el archivo público
    `arreglo/<id>.json` (notas desplegadas con mano y dedo, acordes, secciones, grabaciones, semitonos, inicio, tempo y
    `hasta` conservado). Borrador en el equipo y guardado al cerrar la pestaña, como el Editor de Melodías.
  - `comun/grabacion-tono.js` (`GrabacionTono`): la grabación con SoundTouch (tono y velocidad), sabiendo qué segundo
    se escucha (`oido`) y a qué hora sonará un segundo (`aCtx`), para dibujar y programar el piano a la par.
  - `PIANO/index.html`: con `?r=` lee el arreglo; barra propia (Desde: sección · 🎤 Melodía / 🎶 Karaoke · velocidad
    50–100 % · 🎹 piano encima); manos azul y verde, nombre del acorde sobre su bloque, línea y nombre de cada sección;
    empieza un compás antes de la sección (la grabación hace de precuenta; sin grabación, clics); cambiar velocidad,
    grabación o sección sonando sigue desde ahí; ✋ muestra las dos manos; fecha límite vencida → "estuvo disponible
    hasta el …". Las melodías solas (`?a=`) siguen igual. `p/index.html` pasa `r`.
  - Biblioteca (`REPERTORIO/index.html`): tipo 🎹 Arreglo en el grupo Piano ("+ Arreglo de piano" y en "+ Agregar
    asset"), con 🏷, 🎹, ✏️ y ✈ (solo publicados) con 📅 Disponible hasta (`plazo` de `comun/compartir.js`, escribe
    `hasta` en el archivo público; vencido, compartir de nuevo parte sin fecha); borrar el recurso o la canción borra
    el archivo; el Entrenador lo esconde. `comun/nombre-asset.js`: "Arreglo de piano".
  - Las grabaciones van aunque estén en borrador (las elige el profe en el arreglo); lo que se publica es el arreglo.
  - Sin cambios en Supabase.
  - Prueba (navegador, COQUETA, arreglo "PRUEBA borrar": Intro `A | % | D E | A` + Mambo con la melodía): melodía
    copiada (8 compases, mano derecha); grabación en Mi → "se sube 5 semitonos para quedar en La"; acordes A (mi la
    do♯), E (mi sol♯ si), F#m, D con dedos; vista previa sonando con la grabación a 120; pulsos simulados (con uno
    saltado) → compás 1 en 3,209 s y tempo 121,26; guardado → `p/?r=` en celular horizontal (844×390): barra sin
    desbordar, Desde: Mambo, 80 %, manos azul y verde, nombre de acordes y línea de la sección; ✈ con 📅 → fecha
    28/10/2026 en el archivo y la página avisa "estuvo disponible hasta el 28/10/2026"; Piano de melodía sola igual que
    antes. Arreglo de prueba y su archivo borrados. Sin errores.
- **Pendiente / futuro:** la rítmica sobre los mismos acordes (etapa 2); si la grabación cambia de tempo, marcar
  compás por compás; abrir arreglos desde el Entrenador o el Plan; probar el calce real con Coqueta y en un celular.

### ET. 🎤↔🎶 Cambio limpio entre Melodía y Karaoke — HECHA
*Origen: PO 2026-10-30 ("al tocar Melodía / Karaoke se produce un salto en el audio, se pierde la continuidad; el paso
entre esos dos audios debe ser completamente limpio", en todas las versiones del Entrenador y al compartir por QR o
link).*
- **Necesidad:** en clase y en la casa se cambia entre la canción con voz y sin voz para cantar solos; el corte rompe
  el pulso del curso.
- **Auditoría:** hoy el cambio **reemplaza el archivo** del único reproductor: se descarga el otro audio, se espera a
  que cargue, se salta al mismo segundo y se vuelve a tocar. Eso deja un silencio (lo que tarda en cargar) y un salto
  (el segundo exacto se pierde). Lugares:
  - Entrenador (`REPERTORIO/index.html`, `entCambiarAudio`): Biblioteca, sesión del curso, Plan (mínimo), celular
    (`?movil=1`); la copia en la Pizarra (`?espejo=1`) no suena y solo sigue al profe. Con **Pitch** activo el cambio
    además vuelve a descargar y decodificar el audio (`entActivarPitch`), con un corte más largo.
  - Cantar (`CANTAR/index.html`, `ponerAudio`): mismo mecanismo.
  - Piano con arreglo (`PIANO/`, ES): el 🎤/🎶 detiene y vuelve a empezar desde donde iba.
- **Plan propuesto:**
  1. **Los dos audios cargados y sonando juntos desde el principio**, uno en silencio. El de Melodía sigue mandando el
     tiempo (letra, loops, velocidad, saltos); el de Karaoke lo sigue (play, pausa, saltos, velocidad) y se corrige
     solo si se adelanta o atrasa (acelerándolo o frenándolo apenas, sin saltos). Cambiar = pasar el volumen de uno al
     otro en un fundido muy corto (~80 ms): sin silencio, sin salto y sin "clic".
  2. **Con Pitch:** las dos grabaciones quedan decodificadas y el cambio toma la otra en la misma muestra.
  3. **Cantar** y el **Piano con arreglo** usan la misma idea (Piano: `comun/grabacion-tono.js` cambia de grabación en
     la misma posición).
  - Costo: el celular descarga los dos audios al abrir la canción (hoy descarga el segundo al cambiar).
  - Lugares (regla 11): Entrenador en Biblioteca, sesión del curso, Plan mínimo y celular; Cantar; Piano con arreglo.
    La Pizarra (espejo) no cambia.
- **Decisión del PO (2026-10-30):** plan aprobado tal cual.
- **Hecho (2026-10-30):**
  - Entrenador (`REPERTORIO/index.html`): segundo reproductor `#entrenador-audio-k` con el Karaoke, cargado al abrir la
    canción (`entPrepararKaraoke`, en `abrirEntrenador` y `abrirEntrenadorConConfig`) y pausado al cerrar;
    `entSeguirMelodia` lo mantiene a la par de la Melodía (play, pausa, saltos, velocidad; cada 200 ms corrige
    acelerando o frenando hasta 4 %, o salta si se corrió más de 0,25 s); `entCambiarAudio` ya no cambia el archivo:
    `entFundir` pasa el volumen en 80 ms. `entAplicarSalidaAudio` decide cuál suena (también con el 🔊 Volumen, con
    Pitch y en la copia de la Pizarra, que no suena); en iPhone, que no deja cambiar el volumen de un audio, calla
    uno y da voz al otro en el mismo toque. Con **Pitch**: las dos grabaciones quedan decodificadas
    (`entPitchBuffers`) y SoundTouch lee la elegida en cada bloque (`entPitchCambiarBuffer`), sin rehacer nada.
  - Cantar (`CANTAR/index.html`): lo mismo con `#audio-k` (`seguir`, `fundir`, `ponerAudio`). Es copia de la lógica
    del Entrenador: si una cambia, cambiar la otra.
  - Piano con arreglo: `comun/grabacion-tono.js` suma `precargar` y `cambiar` (la fuente lee la grabación vigente en
    cada bloque, misma muestra); el 🎤/🎶 del Piano ya no detiene ni reinicia.
  - Prueba (navegador): Entrenador con COQUETA sonando desde 0:20 → Karaoke: la Melodía nunca se pausó, volúmenes
    1→0 y 0→1, desfase entre ambos 2 ms; vuelta a Melodía igual; con Pitch +2, el cambio usa la otra grabación en
    el mismo reproductor (sin recargar) y al quitar el Pitch vuelve la mezcla correcta. Cantar (From The Start,
    `l/`): mismo resultado, desfase 24 ms en corrección. Piano con arreglo: sonando, 🎤→🎶 sigue en la misma
    reproducción y el tiempo avanza sin corte. Sin errores. Falta probarlo en un celular (iPhone usa callar/dar voz).
- **Ajuste (PO 2026-10-30, "el karaoke suena cortado"):** la corrección aceleraba o frenaba cada 200 ms al Karaoke
  también mientras sonaba, y eso lo entrecortaba. Ahora **solo se corrige la grabación que está en silencio**: si
  suena el Karaoke, es la Melodía (callada) la que se ajusta a él; la que suena no se acelera, frena ni salta (salvo
  play, pausa o un salto del usuario). Corrección cada 250 ms, desde 30 ms de desfase, hasta 5 %; salto solo sobre la
  callada si pasa de 0,3 s (sin arrastrar a la otra). Igual en Cantar.
  Prueba (navegador): con el Karaoke sonando, 0 cambios de velocidad y 0 saltos en el Karaoke durante 6–8 s; desfase
  estable de 1–25 ms (Entrenador con COQUETA y Cantar con From The Start).
- **Ajuste 2 (PO 2026-10-30, "se pierde la línea temporal, da tropiezos, no es musicalmente perfecto"; pidió una
  barra mínima de carga):** dos reproductores separados nunca quedan exactos (en Android, centésimas que se oyen al
  cambiar). Ahora **un solo reproductor** para las dos grabaciones: `comun/dos-grabaciones.js` (`DosGrabaciones`)
  descarga con avance y decodifica las dos; el reproductor lee la elegida muestra a muestra y cambiar es pasar a la
  otra **en la misma muestra** con un fundido de 25 ms. El `<audio>` queda en silencio como reloj (letra, loops,
  saltos); el reproductor se arma alineado a él en cada play o salto y el traspaso se hace justo cuando empieza a
  oírse. Con tono o velocidad distintos usa SoundTouch (el mismo Pitch de antes); sin cambios lee la grabación directo.
  Mientras se preparan suena el `<audio>` con la Melodía y el botón Melodía / Karaoke espera con una **barra mínima**
  (línea naranja de 3 px en su borde de abajo que se llena). Se quitó el segundo `<audio>` y la corrección continua.
  - Entrenador: `entPrepararKaraoke` (carga con avance, `entPintarCargaAudio`), `entPitchCargarBuffer` (caché por
    audio de la canción abierta), `entActivarPitch` / `entCrearMotor` (con o sin SoundTouch), `entMotorVelocidad`
    (barra y loops), `entCambiarAudio` (espera a que estén listas; la copia de la Pizarra solo cambia el rol).
  - Cantar: `prepararDos`, `arrancarMotor` / `pararMotor`, `ponerAudio`; despierta el reproductor en el toque de ▶ y
    al tocar un verso (iPhone).
  - Costo: el celular descarga y decodifica las dos grabaciones completas al abrir la canción.
  - Prueba (navegador): Entrenador con COQUETA → barra y luego botón activo; sonando desde 0:20 el `<audio>` queda
    callado y suena el reproductor; al cambiar a Karaoke el mismo reproductor sigue (85 ms leídos en 50 ms: sin
    pausa) con la grabación del Karaoke. Cantar con From The Start: lo mismo; al pausar el reproductor se detiene.
    Barra: `45% 3px` en el borde del botón. Falta probarlo en el celular.
- **Ajuste 3 (PO 2026-10-30, celular Android: "funciona"; pero al manipular mucho Cantar quedaban varios versos en
  naranjo, y al ir a WhatsApp el audio se trababa; "el audio debe apagarse siempre que salga de la app"):**
  - Versos: al saltar (tocar un verso, ⏭ estrofa, barra) el verso marcado no se apagaba y se acumulaban; `ir` ahora
    lo apaga. Prueba: 9 saltos seguidos → 1 solo verso en naranjo.
  - Salir de la app: Cantar, Piano (estudiante) y el Entrenador del celular (`?movil=1`) se detienen al ocultarse la
    página (otra app, minimizar, apagar la pantalla) y al cerrarla; en pantallas táctiles también al abrir el selector
    de apps o la cortina de avisos (como el Lector, deuda DP). El Entrenador del PC sigue sonando (en clase se cambia
    de ventana con la música andando) y la vista previa del Editor de Arreglos tampoco se detiene.
    Prueba: con Cantar sonando, al cerrar la página se detuvo y se apagó el reproductor.
  - Metalófono (modo alumno, `stopAudio`) y Cajón (versión estudiante, `pausar`) tampoco se detenían: ahora lo hacen
    igual (ocultarse, cerrar, selector de apps). El modo profesor de ambos no cambia (PO 2026-10-30).
    Prueba: Cajón `c/` y Metalófono `m/` sonando → al salir se detienen. Con esto todas las versiones de estudiante
    (Lector, Cantar, Piano, Metalófono, Cajón) y el Entrenador del celular se detienen al salir de la app.

### EU. ⏱ Mapa de tempo de cada canción (pieza para el Arreglo y lo que venga) — HECHA (etapa 1)
*Origen: PO 2026-10-30 ("iteremos el arreglo de piano; antes necesito una pieza importante que se ocupará para muchas
cosas: una app que me permita hacer tempomaps de las canciones").*
- **Necesidad:** las grabaciones reales no tienen un tempo fijo (se aceleran, frenan, hay calderones). Para que el
  arreglo, y después la letra por compás, los loops, el cajón o el metrónomo, calcen con la grabación, hace falta saber
  dónde cae cada pulso de la canción.
- **Auditoría:**
  - Editor de Arreglos (ES): un solo tempo + "Compás 1 en" (recta por los pulsos marcados con Espacio). Si la
    grabación cambia de velocidad, el piano se descuadra. El Piano convierte pulso ↔ segundo con esa recta
    (`srcDePulso` / `pulsoDeSrc`).
  - Lector: lee mapas de tempo de Reaper (texto `PT` o `.mid`) por tablatura (`repertorio_assets.tab_sync`,
    `mode: 'tempomap'`, `map: [{ qn, bpm }]`, `start_qn`); no existe un mapa de la canción.
  - Melodía y Karaoke de una canción van exactamente juntas (ET): un mapa sirve para las dos.
  - `repertorio_assets.tipo` no tiene restricción: un tipo nuevo `tempo` no pide SQL.
- **Plan aprobado (PO 2026-10-30), etapa 1:**
  1. **App ⏱ Tempo** (`TEMPO/index.html`, pestaña cerrable del Workspace, desde la ficha de la canción): carga la
     grabación (Melodía o Karaoke); se marca el pulso con Espacio mientras suena (también más lenta sin cambiar el
     tono) y se guarda **cada pulso**; forma de onda con las marcas para arrastrar, borrar o agregar; dónde empieza el
     compás 1, la cifra y sus cambios; clic de metrónomo encima para comprobar. Importa mapas de Reaper.
  2. **Recurso de la canción** `⏱ Mapa de tempo` (`tipo = 'tempo'`, uno por canción, `contenido` = JSON) en el grupo
     🎵 Canción, y archivo público `tempo/<cancion_id>.json` para las páginas de estudiantes.
  3. **Pieza compartida** `comun/tempo-mapa.js` (`TempoMapa`): segundo ↔ pulso ↔ compás.
  4. **Arreglo usándola:** ya no pide pulsos ni tempo; dice desde qué compás de la canción empieza, y el Piano sigue
     la grabación aunque cambie de velocidad.
  - Sin cambios en Supabase.
  - Lugares (regla 11): Biblioteca (ficha), app Tempo, Editor de Arreglos (vista previa incluida), Piano con arreglo
    (PC y celular).
  - Después (cada uno aparte): Lector sin Reaper, loops del Entrenador por compás, Cajón y Metrónomo con la
    grabación, Editor de Melodías calzado con la canción.
- **Hecho (2026-10-30):**
  - `TEMPO/index.html`: barra con 🎤 Melodía / 🎶 Karaoke; ▶ Tocar (Espacio), ⏺ Marcar pulsos (desde el cursor; cada
    Espacio un pulso, Retroceso quita el último, Esc/Enter termina; lo marcado reemplaza los pulsos de ese tramo),
    velocidad 50–100 % sin cambiar el tono (`GrabacionTono`), 🔔 Clic en cada pulso (más agudo el tiempo 1), ↶ Deshacer
    (Ctrl+Z). Arriba la canción entera con su curva de tempo (amarilla) y lo que se ve abajo; abajo la onda con los
    pulsos: tiempo 1 en blanco con el número de compás, compás 1 en verde, el elegido en celeste, en rojo los
    intervalos disparejos (>18 % de sus vecinos); clic = cursor, arrastrar = mover, doble clic = agregar, Supr =
    borrar, ← → = pasar de pulso, rueda = acercar, Mayús+rueda = desplazar. "Aquí empieza el compás 1", cifra desde el
    compás del pulso elegido (2–7 pulsos; los cambios se listan con ✕). ✨ Emparejar (cada pulso a la recta de sus
    6 vecinos), 🎯 Ajustar a los golpes (el ataque más fuerte a ±60 ms, si destaca), 📥 Importar (líneas `PT` o `.mid`
    de Reaper, o el mapa de una tablatura de la canción). Guarda el recurso `tempo` (publicado, sin dificultad) y
    `tempo/<cancion_id>.json`; avisa a las otras pestañas (canal `profe-tempo`). Borrador en el equipo y guardado al
    cerrar la pestaña.
  - `comun/tempo-mapa.js` (`TempoMapa`): `segDePulso`, `pulsoDeSeg`, `pulsoDeCompas`, `compasDePulso`, `cifraEn`,
    `bpmEn` (fuera de lo marcado sigue el tempo del borde), `cargar` (archivo público) y `desdeReaper`.
  - Biblioteca: ⏱ Mapa de tempo en el grupo 🎵 Canción (✏️ y 🗑, sin estado ni dificultad, siempre visible);
    "+ Mapa de tempo" si la canción tiene audio y aún no tiene mapa; borrar el recurso o la canción borra el archivo;
    el Entrenador lo esconde. `comun/nombre-asset.js`: "Mapa de tempo".
  - Editor de Arreglos: ⑤ Grabación ya no marca pulsos ni pide "Compás 1 en" / tempo: con mapa muestra un resumen y
    "El arreglo empieza en el compás N de la canción" + ⏱ Editar el mapa; sin mapa, ⏱ Hacer el mapa de tempo (y el
    arreglo va sin grabación). Se pone al día solo al guardar el mapa en su pestaña. El archivo público lleva
    `audio.cancion` y `audio.desde`.
  - Piano con arreglo: con `audio.cancion` lee `tempo/<cancion>.json` y convierte pulso ↔ segundo con el mapa
    (arreglos antiguos: `inicio` + tempo fijo).
  - Sin cambios en Supabase.
  - Prueba (navegador, COQUETA): marcar 5 pulsos sonando → 5 pulsos, compás 1 en el primero, ♩ 118,8; importar
    `PT 0 120 / PT 40 100` con compás 1 en QN 4 → 410 pulsos, curva 120→100; cifra 3 desde el compás 5 (pulso 20 =
    compás 6.2); disparejo en rojo, elegido y compás 1 visibles; Emparejar, Ajustar a los golpes y Deshacer;
    guardado → recurso + archivo; la ficha lo muestra; Arreglo: resumen "134 compases, ♩ 100 (entre 100 y 120)",
    vista previa con pulso 0 = 2 s y pulso 40 = 22,4 s (tramo lento), "desde el compás 3" → pulso 0 = 6 s, y sonando
    2,5 s el pulso del piano coincide con la grabación. Mapa de prueba borrado (recurso y archivo); vuelve a verse
    "+ Mapa de tempo". Falta: el mapa real de COQUETA (lo marca el PO) y probarlo en el celular.
- **Ajuste (PO 2026-10-30, "si me equivoqué en un pulso no hay forma rápida de retroceder y retomar"; "el
  desplegable de velocidad no sirve, necesitamos el de siempre, el del Entrenador con los mismos atajos"):**
  - Velocidad = el chip del Entrenador (`1x`): `{` baja 5 %, `}` sube 5 %, `+` normal (50–150 %); sonando sigue desde
    donde iba. También `K` toca / detiene y `J` / `L` van 5 s atrás / adelante (botones ⏪ 5 s y 5 s ⏩).
  - Marcando, `J` (o ⏪) vuelve 5 s, borra lo marcado desde ese punto y se sigue marcando sin detenerse.
  - Prueba (navegador): `{ {` → 0.9x, `+` → 1x; marcando desde 0:10, 6 pulsos, J en 0:13,4 → vuelve a 0:08,8 sin
    pulsos y sigue; 4 pulsos más → quedan esos 4.
- **Ajuste 2 (PO 2026-10-30, "lo antinatural es que cada toque debería armar un compás, y está armando un compás con
  4 de mis toques"):** "Cada toque: **Compás** · Pulso" (parte en Compás; se recuerda en el equipo). Con Compás, cada
  Espacio es el 1 de un compás y la app reparte entre un toque y el siguiente tantos pulsos parejos como diga la cifra
  de ese compás; el compás 1 queda en un toque. Con Pulso, igual que antes. El botón pasa a "⏺ Marcar".
  Prueba (navegador): 4 toques cada 1,6 s desde 0:10 → 13 pulsos, compases 1.1 … 3.4 y 4.1, ♩ 149,5.
- **Ajuste 3 (PO 2026-10-30, "no escucho el clic contra la música, necesito un mezclador mínimo"):** dos barras en la
  barra de arriba, 🎵 grabación y 🔔 clic (se recuerdan en el equipo; el clic puede quedar más fuerte que la música);
  el clic suena más brillante (onda cuadrada) y se programa con su propio reloj cada 25 ms (antes iba con el dibujo de
  la pantalla, que se frena y lo podía atrasar o saltar). Soltar una barra devuelve el teclado a la app.
  Prueba (navegador): sonando desde 0:10, a los 2 s los clics ya estaban programados hasta 0:12 (suena 0:11,8);
  volumen de la grabación 30 % y del clic 80 % aplicados y guardados.
- **Ajuste 4 (PO 2026-10-30, "Compás / Pulso no hace diferencia, cada toque lo toma como un pulso"):** en la versión
  en línea, marcando sobre el mapa guardado de COQUETA (76 pulsos cada ~3 s, hechos antes del Ajuste 2), 4 toques
  cada 3 s → 13 pulsos parejos (3 compases): el reparto funciona; el mapa guardado era de antes. Corregido: al
  remarcar por compás, lo reemplazado llega hasta medio compás después del último toque (quedaba pegado un pulso
  viejo, que se veía disparejo). Prueba: el pulso viejo de 0:22,5 ya no queda.
- **Ajuste 5 (PO 2026-10-30, "¿tengo que marcar de nuevo el 1 de cada compás? Que lo interprete automáticamente"):**
  botón **÷ Eran compases**: los pulsos ya marcados pasan a ser el 1 de cada compás (el compás 1 se mantiene) y entre
  cada uno se reparten los pulsos de su cifra; se puede deshacer. Prueba (mapa guardado de COQUETA, sin guardar):
  76 pulsos → 301 pulsos, 76 compases, ♩ 78,9, compases 1.1 1.2 1.3 1.4 2.1…; Deshacer vuelve a 76.
- **Ajuste 6 (PO 2026-10-30, "¿qué hace la app para subdividir? ¿por qué me deja mover los golpes dentro de los
  compases?"; quitar "÷ Eran compases"; "solo quiero que Coqueta quede hecha correctamente"):** la app trabaja **solo
  con el 1 de cada compás**: es lo único que se marca (cada Espacio), se ve en blanco con su número y se arrastra,
  agrega (doble clic) o borra; los pulsos de adentro se ven tenues, no se toman y se reparten solos, parejos, según la
  cifra (al mover un 1 se reparten de nuevo los dos compases que toca). Emparejar, Ajustar a los golpes y lo disparejo
  (rojo) van sobre los compases. Se quitaron "Cada toque: Compás / Pulso" y "÷ Eran compases". Lo guardado sigue
  siendo la lista de pulsos (las otras apps no cambian); al abrir, la app toma de ahí el 1 de cada compás.
  COQUETA (único mapa hecho): sus 76 toques eran el 1 de cada compás → guardado como 76 compases (75 completos),
  301 pulsos, ♩ 78,9, compás 1 en el primer toque. Prueba: al mover el 1 del compás 3, sus pulsos y los del compás 2
  se reparten parejos; cifra 3 desde el compás 5 → 230 pulsos con los 1 en su lugar; Deshacer; guardado en la base y
  en el archivo público (301 pulsos, último = compás 76.1) y al volver a abrir quedan 76 compases.
- **Ajuste 7 (PO 2026-10-30, "navego con dos dedos y al soltar se hace un pequeño zoom"):** cada gesto de dos dedos
  o de rueda queda como desplazar o acercar según cómo empieza, hasta soltarlo (250 ms sin movimiento); el final de un
  deslizamiento horizontal ya no acerca. El zoom va según cuánto se mueve (parejo con dos dedos; con la rueda del
  mouse, lo mismo que antes). Prueba: deslizamiento horizontal que termina en vertical → se movió 1 s y el zoom no
  cambió; después la rueda acerca y aleja.
- **Ajuste 8 (PO 2026-10-30, "aquí mismo quiero poder etiquetar secciones, luego de haber hecho el tempo map"):**
  con un compás elegido, "🏷 Sección desde aquí" (Intro, Estrofa, Pre-coro, Coro, Puente, Interludio, Solo, Mambo,
  Final o cualquier nombre; Enter pone, vacío quita). Cada sección va desde su compás hasta la siguiente: franja de
  color con el nombre sobre la onda y raya de color arriba en la canción entera (mismo color para "Estrofa 1" y
  "Estrofa 2"); lista "Secciones" con el compás de cada una (clic = ir ahí, ✕ = quitar). La sección queda pegada al 1
  de su compás (lo sigue al moverlo). Se guarda en el mapa (`secciones: [{ compas, nombre }]`, también en el archivo
  público); `TempoMapa` da `m.secciones` y `m.seccionEn(c)` para el Arreglo y lo que venga.
  Prueba (COQUETA, sin guardar): Intro 0, Estrofa 1 4, Coro 12, Estrofa 2 20 → franjas y lista; al arrastrar el 1
  del compás 4 la Estrofa 1 lo siguió; `seccionEn(14)` = Coro. Deshecho, el mapa guardado quedó igual.
- **Ajuste 9 (PO 2026-10-30, "sí, que el Arreglo tome las secciones; y el metrónomo tiene que sonar siempre en esta
  app, sin interruptor"):**
  - Tempo: se quitó 🔔 Clic; el clic suena siempre que suena la grabación (se baja con su barra del mezclador).
  - Editor de Arreglos, ② Secciones: **⏱ Traer del mapa de tempo** (activo si el mapa tiene secciones) crea una
    sección por nombre (las que ya existen por nombre se conservan con sus acordes), arma el orden como suenan en la
    canción (pide confirmar si ya había orden) y el arreglo empieza en el compás de la primera. Cada sección muestra
    "en la canción: N compases" (en rojo si sus acordes no dan ese largo).
  - Prueba (COQUETA, sin guardar; secciones de prueba Intro 0 · Estrofa 4 · Coro 12 · Estrofa 20 · Coro 28 y un Coro
    ya escrito con 4 acordes): orden Intro · Estrofa · Coro · Estrofa · Coro, nuevas Intro y Estrofa, el Coro conservó
    sus acordes y quedó en rojo "en la canción: 8 o 49 compases", el arreglo empieza en el compás 0. Tempo: sonando
    desde 0:20 los clics se programan solos y ya no hay botón.
- **Ajuste 10 (PO 2026-10-30, "dejar fijos los inicios de compás: al elegir uno para poner una sección se mueve";
  "al hacer clic en los chips, ir a la sección"; "reproduciendo, si hago clic en otro lugar quiero ir allá aunque
  perdamos el cursor, y un botón que me devuelva al cursor"):**
  - **🔓 Compases editables / 🔒 Compases fijos** (se recuerda en el equipo): fijos, un clic solo elige el compás (para
    sección o cifra); no se marca, arrastra, agrega, borra, importa, empareja ni ajusta. Editables, un arrastre de
    menos de 4 px ya no mueve el compás (antes el pulso de la mano lo corría al elegirlo).
  - Chips de sección: llevan la vista y el cursor a la sección (sonando, suena desde ahí). Antes la lista se volvía
    a dibujar en medio del clic y el clic se perdía.
  - Sonando, la rueda o un clic en la canción entera llevan la vista allá y la vista deja de seguir lo que suena;
    aparece **⌖ Volver al cursor** (espacio reservado en la barra) cuando lo que suena o el cursor queda fuera de la
    vista, y al tocarlo la vista vuelve a seguir. Seguir lo que suena va ahora con el reloj del clic (no se frena).
  - Prueba (COQUETA, sin guardar): fijos, arrastrar 30 px el compás 4 → no se movió y quedó elegido; editables,
    temblor de 2 px → no se movió; chip "Estrofa" → vista y cursor en 0:10,2; sonando desde 0:20, clic al 80 % de la
    canción → vista en 3:08 y ⌖ visible; ⌖ → vista en 0:20 siguiendo lo que suena y el botón se oculta.

### EV. ⏱ El Mapa de tempo como ficha oficial de la canción (tonalidad, cifra, tempo, secciones) — HECHA (pasos 1, 2 y 3: Cajón, Metrónomo y Lector)
*Origen: PO 2026-10-30 ("el tempomapper debería ser la declaración de los estándares de las canciones: el tempomap,
las secciones, la tonalidad, cifra de compás, y eso debería poder leerse desde las otras instancias; desde aquí se
entrega lo oficial").*
- **Necesidad:** hoy cada app anota por su lado la tonalidad (cada melodía, cada tablatura), el tempo y la cifra
  (Editor de Melodías, Lector, Cajón, ritmos del Entrenador) y las secciones (mapa y Lector). Hace falta una sola
  verdad por canción que todas puedan leer.
- **Auditoría:**
  - El mapa (`tipo = 'tempo'`, `tempo/<cancion_id>.json`) guarda pulsos, compás 1, cifras y secciones. La cifra es
    solo "n pulsos" (sin el número de abajo: 6/8 y 3/4 no se distinguen). **No guarda tonalidad.** Lo leen solo el
    Arreglo de piano y el Piano (`TempoMapa.cargar`).
  - Tonalidad: en `repertorio_assets.tonalidad` por recurso; Melodía y Arreglo usan `{ tonica: 'A', modo: 'mayor' }`
    (letras en inglés, se muestra "La mayor").
  - La canción (`repertorio_canciones`) no tiene tonalidad ni tempo.
- **Plan aprobado (PO 2026-10-30), en 3 pasos (este es el 1):**
  1. **Ficha oficial en el Mapa de tempo:** tonalidad (tónica + mayor/menor), cifra completa (2/4, 3/4, 4/4, 6/8…)
     con sus cambios, tempo de referencia (calculado de lo marcado), compás 1 y secciones. La pieza `TempoMapa`
     entrega esos datos a cualquier app (`m.tonalidad`, `m.cifraTexto(c)`, `m.bpm`) y la ficha de la canción en la
     Biblioteca los muestra. Los mapas antiguos siguen sirviendo (sin número de abajo = /4).
  2. (Después) Editor de Melodías y Arreglo parten con lo oficial; si quedan distintos se marca "distinto de la canción".
  3. (Después, uno por uno) Lector, Cajón y Metrónomo leen secciones y tempo de la canción.
  - Sin cambios en Supabase (todo va en el mismo recurso y su archivo público).
  - Lugares (regla 11): app Tempo, `comun/tempo-mapa.js` (la leen Arreglo y Piano: no deben cambiar), Biblioteca (ficha).
- **Hecho (2026-10-30, paso 1):**
  - `comun/tempo-mapa.js`: cifras con `d` (número de abajo; sin él = 4), `tonalidad: { tonica, modo }`,
    `m.cifraTexto(c)`, `m.bpm` (mediana de lo marcado), `TempoMapa.nombreTonalidad(t)` ("Fa♯ menor") y
    `TempoMapa.TONICAS`; el archivo guardado lleva también `tonalidad` y `bpm`. `cifraEn` sigue siendo los pulsos del
    compás (Arreglo y Piano no cambian; en 6/8 se reparten 6 corcheas).
  - App Tempo: **Tonalidad** en la barra de arriba (tónica, — = sin declarar; mayor/menor con la misma tónica:
    La mayor → La menor); la cifra desde el compás elegido es un menú (2/4 3/4 4/4 5/4 6/4 7/4 2/2 3/8 6/8 7/8 9/8
    12/8) y los chips muestran "4/4"; la línea de abajo dice "tempo de referencia ♩ N".
  - Biblioteca: el ⏱ Mapa de tempo de la ficha muestra lo oficial ("sin tonalidad · 4/4 · ♩ 79 · 77 compases ·
    8 secciones").
  - Prueba (navegador, COQUETA, sin guardar): el mapa guardado abre como "Guardado" (4/4, ♩ 79); La → La menor →
    Mi♭ mayor; 6/8 desde el compás 5 (chip "Compás 5: 6/8", 6 pulsos por compás) → "Sin guardar"; deshecho y
    borrador borrado. Ficha: texto real y uno simulado ("Fa♯ menor · 4/4 (cambia) …"). `TempoMapa.cargar` de COQUETA
    da los mismos segundos que antes.
  - Falta: que el PO declare la tonalidad de COQUETA; pasos 2 y 3.
- **Paso 2 (aprobado PO 2026-10-30, "ok, paso dos"): Editor de Melodías y Arreglo parten con lo oficial.**
  - Auditoría: la Melodía nueva parte en 90 · 4/4 · Do mayor (solo admite 2/4, 3/4, 4/4); el Arreglo nuevo copia
    tempo, compás y tonalidad de la primera Melodía de la canción, y su "tono original de la grabación" parte en esa
    tonalidad. Ninguno lee la tonalidad ni la cifra del mapa.
  - Plan: (1) nuevo recurso → tonalidad, cifra (si es x/4 de 2 a 4) y tempo de referencia oficiales; en el Arreglo,
    el tono original de la grabación = la tonalidad oficial (la grabación ES la canción). Sin ficha oficial, como hoy.
    (2) Si la tonalidad o el compás quedan distintos de la canción, al lado se ve "≠ canción: La mayor", que al
    tocarlo adopta lo oficial; no impide nada (un arreglo puede ir en otro tono). El tempo no se marca (se practica
    más lento a propósito).
  - Lugares: Editor de Melodías (pasos ① y ②), Editor de Arreglos (① Base y ⑤ Grabación). El Piano no cambia.
  - **Hecho (2026-10-30):** `TempoMapa.mismaTonalidad(a, b)` (Re♭ = Do♯) y `m.compasSimple()`. Editor de Melodías:
    nueva → tonalidad, compás y ♩ oficiales; avisos "≠ canción" junto a Compás (paso ①) y Modo (paso ②), que al
    tocarlos adoptan lo oficial (con una cifra que no escribe, p. ej. 6/8, el aviso se ve pero no se toca); se pone al
    día al guardar el mapa (canal `profe-tempo`). Arreglo: nuevo → lo oficial por sobre lo de la Melodía, y el tono
    original de la grabación = la tónica oficial; avisos junto a Tonalidad, Compás y Tono original.
  - Prueba (navegador, COQUETA = Mi mayor declarada por el PO, sin guardar): Melodía nueva → Mi mayor · 4/4 · ♩ 79;
    oficial simulado Fa♯ menor 3/4 → avisos, al tocarlos la melodía queda en Fa♯ menor 3/4; 6/8 → aviso sin acción.
    Arreglo guardado (La mayor, grabación en Mi) → "≠ canción: Mi mayor" solo en Tonalidad. Arreglo nuevo → Mi mayor,
    4/4, ♩ 79, tono original Mi; tono original a La → aviso, tocarlo vuelve a Mi. Borradores de prueba borrados.
  - Visto en la prueba (preexistente, no de EV): el arreglo de COQUETA abre "Sin guardar" porque se guardó antes del
    Mapa de tempo (le falta `audio.desde`); al guardarlo una vez queda al día.
  - Falta: paso 3 (Lector, Cajón y Metrónomo leen secciones y tempo).
- **Paso 3a — 🪘 Cajón (aprobado PO 2026-10-30, "Sí, Cajón"; orden propuesto: Cajón → Metrónomo → Lector, este
  último después de decidir qué pasa con el Loop en pausa sin commitear en `tabs/index.html`).**
  - Auditoría: un ritmo nuevo de una canción parte en 4/4 a 100 (`prog`); cifras 2/4 3/4 4/4 5/4 6/8 7/8 12/8; el
    tempo del Cajón va en negras (`ritmo = bpm / 120`). La versión estudiante no carga la base de datos.
  - Plan: ritmo nuevo de una canción con ficha oficial → cifra (si el Cajón la tiene) y tempo oficiales (pasado a
    negras: en 6/8, ♪ 180 = ♩ 90); aviso "≠ canción: 6/8" junto a Compás, que al tocarlo cambia la cifra; el tempo
    no se marca. Estilos (Festejo, Landó…) no tienen mapa: como hoy. Versión estudiante sin cambios.
  - **Hecho (2026-10-30):** el Cajón (no la versión estudiante) carga `comun/tempo-mapa.js`; `nuevoRitmo` lee la
    ficha oficial de la canción y parte con su cifra (si está en la lista) y su tempo en negras; botón "≠ canción"
    junto a Compás (espacio reservado; deshabilitado si la cifra no existe en el Cajón o el ritmo está solo para
    mirar); se pone al día al guardar el mapa (`profe-tempo`). Abrir un ritmo guardado también muestra el aviso.
  - Prueba (navegador, sin guardar): ritmo nuevo de COQUETA → 4/4 · 79 BPM, sin aviso y sin "cambios"; oficial
    simulado 6/8 → "≠ canción: 6/8" visible, al tocarlo la cuadrícula pasa a 6/8; 9/8 → aviso sin acción;
    versión estudiante (`?modo=alumno`) sin base de datos ni TempoMapa y sin errores.
  - Siguen: 3b Metrónomo (elegir una canción) y 3c Lector (antes, decidir el Loop en pausa).
- **Paso 3b — ⏱ Metrónomo (aprobado PO 2026-10-30, "Sí, Metrónomo").**
  - Auditoría: `RITMOS/index.html` no conoce canciones ni usa la base de datos; ajustes en el equipo (cifra 2/4 3/4
    4/4 5/4 6/8; Fijo o Va subiendo desde/hasta). En 6/8 el pulso es la negra con punto.
  - Plan: botón **🎵 Canción** en la fila Tempo: elige entre las canciones que tienen Mapa de tempo (buscador); el
    metrónomo toma su cifra (si la tiene) y su tempo (en 6/8, ♪ → negra con punto): en Fijo, ese tempo; en Va
    subiendo, ese tempo pasa a ser el "hasta" (meta de práctica) y el "desde" baja si quedaba más alto. Se ve el
    nombre de la canción (✕ la quita) y "≠ canción" si después cambia el compás. También `?cancion=<id>`. Ritmos pasa
    a cargar Supabase solo para la lista de canciones (el resto sigue en el equipo).
  - **Hecho (2026-10-30):** Ritmos carga Supabase y `comun/tempo-mapa.js`. **🎵 Canción** (ancho fijo, ✕ para quitarla)
    abre un buscador con las canciones que tienen Mapa de tempo; al elegir una toma su cifra (si el metrónomo la
    tiene) y su tempo (6/8: ♪ ÷ 3 = negra con punto): Fijo = ese tempo; Va subiendo = la meta ("hasta") y el
    "desde" queda 20 abajo si no era menor (también al cambiar de modo con la canción puesta). "≠ canción" junto a
    Compás (espacio reservado). Se recuerda en el equipo; `?cancion=<id>`; se pone al día al guardar el mapa.
    De paso: "compáses" → "compases" en el texto de estado.
  - Prueba (navegador): partiendo de Fijo 3/4 a 100 → COQUETA (única con mapa; buscar "coq") → 4/4, 79; Va subiendo
    → de 59 a 79; 2/4 → "≠ canción: 4/4" visible, al tocarlo vuelve a 4/4; recargar → la recuerda; ✕ → "🎵 Canción".
  - Sigue: 3c Lector (antes, decidir qué pasa con el Loop en pausa sin commitear en `tabs/index.html`).
- **Loop IN/OUT en pausa — guardado (PO 2026-10-30, "Guardarlo como está"), antes del paso 3c (Lector):** los
  cambios sin commitear del Loop (IN/OUT en el extremo de nota visualmente más cercano, `nearestNoteEdgeTime`, en
  `tabs/index.html`) y el laboratorio `LOOP-LAB/loop-lab.html` se guardaron tal cual en el commit **1c318e7**; enseguida
  se revirtió solo `tabs/index.html` (commit siguiente), así el Lector en línea sigue como estaba y el Loop queda en
  pausa, recuperable desde 1c318e7. `LOOP-LAB/` (congelado) queda en el repositorio, sin enlaces.
- **Paso 3c — 🎼 Lector sincronizado con el Mapa de la canción (aprobado PO 2026-10-30, "Sí, apruebo").**
  - Auditoría: cada tablatura guarda su propia sincronización en `repertorio_assets.tab_sync`: `grid` (bpm + offset)
    o `tempomap` (mapa de Reaper `[{ qn, bpm }]` + `start_qn` = QN donde suena `notes[0]`); el motor convierte
    segundo ↔ QN con un mapa por tramos `[{ qn, bpm, startMs }]` (`tabSyncBuilt`). Las secciones salen de las marcas
    de ensayo de la partitura y las asignaciones a estudiantes van por su nombre (`alumno_tab_secciones`).
  - Plan: tercer modo **⏱ Mapa de la canción** (`tab_sync = { mode: 'cancion', desde: N }`, "la partitura empieza en
    el compás N de la canción"): se arma el mismo mapa por tramos desde el Mapa de tempo de la canción (un tramo por
    pulso; QN 0 = compás 1 de la canción) y `start_qn` = QN donde suena la primera nota (si el primer compás de la
    partitura es una anacrusa, el compás N es el primero completo). El motor no cambia. Las tablaturas con Reaper o
    grilla siguen igual; las secciones de la partitura no se tocan. Sirve también para el link de estudiantes
    (lee el archivo público del mapa).
  - **Hecho (2026-10-30):** `tabs/index.html` carga `comun/tempo-mapa.js`; en 🎵 Sincronización, tercera pestaña
    **⏱ Mapa de la canción** ("La partitura empieza en el compás N de la canción" + resumen del mapa: compases, cifra,
    ♩ y secciones; si la canción no tiene mapa, lo dice y no deja guardar). Si la tab no tiene sincronización, la
    ventana abre en esa pestaña cuando la canción tiene mapa. `tieneSyncReal` acepta `cancion` cuando el mapa cargó;
    estado "✓ ⏱ Canción desde el compás N". `construirSyncCancion` (un tramo por pulso) y `ajustarSyncCancion`
    (start_qn; anacrusa → el primer compás completo; se recalcula al volver a leer la partitura). Guardar conserva las
    secciones de `tab_sync`. Abrir la ventana sin sincronización real ya no precarga el panel de Reaper con datos vacíos.
  - Prueba (navegador, Hakuna Matata con mapa de Reaper, sin guardar): con un mapa de la canción armado desde el mismo
    Reaper (como 📥 Importar del Mapa de tempo), audio → partitura en 0/10/30/60/90 s y partitura → audio en 5/20/40 s
    dan **exactamente** lo mismo que el modo Reaper; "desde el compás 3" → start_qn 8 y estado "✓ ⏱ Canción desde el
    compás 3"; ventana con la pestaña nueva y el aviso "aún no tiene Mapa de tempo"; vuelta al modo Reaper intacta.
  - Falta: probarlo con una tablatura real de una canción con mapa (hoy solo COQUETA tiene mapa y no tiene tablaturas).
- **Ajuste (PO 2026-10-30, "renombrar esa sección, algo tipo Info General" → elige **Ficha de la canción**, "dale un
  aspecto mínimo"):** en todo lo visible "Mapa de tempo" pasa a **📋 Ficha de la canción** (o "su Ficha" en los avisos
  "≠ canción"): Biblioteca, app `TEMPO/` (título, pestaña del Workspace "<canción> · Ficha", 📋), Arreglo (📋 Traer de
  la Ficha, Hacer/Editar la Ficha), Melodía, Cajón, Metrónomo y Lector (pestaña 📋 Ficha de la canción, estado
  "✓ 📋 Ficha, desde el compás N"); `nombre-asset.js`: "Ficha de la canción". No cambian el tipo `tempo`, el archivo
  `tempo/<id>.json` ni `TempoMapa`. En la ficha de la Biblioteca la Ficha ya no es un recurso de la lista: es **una
  línea discreta** arriba del grupo 🎵 Canción ("📋 Ficha  Mi mayor · 4/4 · ♩ 79 · 77 compases · 8 secciones"; clic
  = editarla, 🗑 solo al pasar el mouse; no cuenta en el número del grupo); sin Ficha y con audio, "＋ Ficha de la
  canción" en el mismo lugar. Prueba (navegador, COQUETA): la línea se ve, mide 33 px (un recurso 46), 🗑 solo con el
  mouse encima; el grupo cuenta 3 (Letra, Melodía, Karaoke).
- **Ajuste 2 (PO 2026-10-30, aprobado "Sí, apruebo"): Ficha mínima + extractos desde "+ Audio".** "La ficha debe
  tener una primera interfaz mínima, donde poner la tonalidad, la cifra de compás, y ya al querer agregar tempomap
  entramos a la parte de tempomap; no necesito saber cuántos compases tiene ni cuántas secciones"; "no necesito
  saber que no hay extractos, ni un botón especial para agregar extractos: hay un audio Melodía, un Karaoke y el
  resto pueden ser extractos o versiones".
  - Plan: la línea 📋 Ficha de la Biblioteca se edita ahí mismo (tónica · modo · cifra, se guardan solas; ⏱ Tempo ♩ N
    abre la app de marcar el pulso; 🗑 al pasar el mouse); una Ficha puede existir sin tempo marcado (solo tonalidad y
    cifra) y las apps que leen lo oficial (Melodía, Arreglo, Cajón, Metrónomo) la leen igual
    (`TempoMapa.cargarFicha`); lo que sigue la grabación (Arreglo/Piano/Lector) sigue pidiendo pulsos. Extractos y
    versiones: sin texto de "no hay" ni botón propio; "+ Audio" ofrece Melodía · Karaoke · Extracto · Versión (los dos
    últimos piden curso y parte y van a 📁 Archivos del curso como hoy); soltar un archivo sobre 🎵 Canción sigue.
  - **Hecho (2026-10-30):** `TempoMapa.cargarFicha` (la Ficha aunque no tenga pulsos); la usan Melodía, Cajón,
    Metrónomo y el Arreglo (`fichaCancion` para tonalidad/compás/tempo inicial; el calce con la grabación sigue con
    `mapaTempo`); el Lector avisa "la Ficha aún no tiene el tempo marcado". Biblioteca: `lineaFicha` = 📋 Ficha ·
    tónica · modo · cifra · ⏱ Tempo ♩ N (deshabilitado sin audio) · 🗑 al pasar el mouse; solo en canciones (no en
    materiales ni estilos); `cambiarFicha` guarda solo (crea el recurso `tempo` si no existe, sube `tempo/<id>.json`,
    avisa por `profe-tempo`). La app del tempo toma la tonalidad y la cifra que llegan de la Biblioteca sin pisar sus
    pulsos (`ficha-datos`). Se quitó el resumen largo (`fichaOficial`). Extractos y versiones: sin el texto "Sin
    extractos…" ni el botón "+ Agregar extracto o versión"; "+ Audio" → Melodía · Karaoke · ✂️ Extracto · 🎙 Versión
    (propone el que falta; con los dos audios, Extracto), los dos últimos cierran la ventana y abren el formulario de
    la canción con ese tipo y el archivo elegido (o archivo/enlace si no se eligió). Soltar un archivo sigue igual.
  - Prueba (navegador, COQUETA): la línea muestra Mi · mayor · 4/4 · ⏱ Tempo ♩ 79 (35 px); con el guardado
    **simulado** (no se permite escribir en la base real desde la prueba): modo → Mi menor, cifra → 6/8 (pulsos
    intactos, archivo público tempo/<id>.json con el nombre), sin tónica → se quita la tonalidad y "modo" queda
    deshabilitado. "+ Audio" → Versión abre el formulario en Versión con archivo y enlace. Arreglo y Melodía nuevos de
    COQUETA parten en Mi mayor · 4/4 · 79. Sin extractos, no se ve nada. **Falta:** que el PO pruebe el guardado real
    en la Biblioteca.

### EW. 🧩 Estructura de la canción sin mapa de tempo (secciones por segundo) — HECHA
*Origen: PO 2026-10-31 ("a veces voy a querer estructurar las partes de una canción y no tener necesariamente un
tempomap; en la misma interfaz necesito una opción para marcar tempomap o estructura; si marco estructura no estoy
marcando compases, estoy marcando comienzos de secciones").*
- **Necesidad:** poner Intro, Estrofa, Coro… a una canción rápido, escuchándola, sin tener que marcar antes el 1 de
  cada compás. Lo que va por tiempo (saltar a una parte, loops por sección, Cantar) no necesita compases.
- **Auditoría:**
  - Hoy la sección se guarda "desde el compás N" (`secciones: [{ compas, nombre }]` en el recurso `tempo` y en
    `tempo/<cancion_id>.json`); sin pulsos no se puede poner ninguna ("🏷 Sección desde aquí" pide un compás elegido).
  - Adentro, la app `TEMPO/` ya guarda cada sección por su **segundo** (`S.secciones: [{ t, nombre }]`) y la pasa a
    compás solo al guardar: el cambio es chico.
  - Quién las lee hoy: solo el **Arreglo de piano** (📋 Traer de la Ficha, por compás) con `TempoMapa.secciones` /
    `seccionEn(c)`. El Piano y el Lector no las leen (el Lector tiene las suyas, de la partitura).
  - Una Ficha ya puede existir sin pulsos (EV, `cargarFicha`).
- **Plan aprobado (PO 2026-10-31, "Sí, apruebo"):**
  1. **Selector arriba en la app de la Ficha: ⏱ Tempo / 🧩 Estructura** (se recuerda en el equipo; si la canción no
     tiene pulsos, abre en Estructura).
     - **Tempo:** como hoy.
     - **Estructura:** sin metrónomo ni compases a la vista (la onda limpia). Suena la canción; **Espacio** pone el
       comienzo de una sección donde va sonando (nombre "Sección N" provisional, se cambia en la lista o con
       Intro/Estrofa/Coro…); **K** toca / detiene, J / L y la velocidad como en Tempo. Sobre la onda: arrastrar el
       comienzo para corregirlo, doble clic = nueva, Supr = quitar; chips con el nombre (clic = ir ahí).
       Mismos colores que hoy.
  2. **Cómo se guarda:** cada sección lleva siempre su **segundo** (`seg`) y, si hay pulsos, también su `compas`.
     - Sin pulsos: manda el segundo.
     - Con pulsos: manda el compás (como hoy) y el segundo se calcula.
     - Al marcar el tempo **después**, cada sección se pega sola al 1 del compás más cercano (se ve en la lista; se
       puede mover). Las fichas antiguas (solo `compas`) siguen igual.
  3. **`TempoMapa`:** cada sección trae `seg` además de `compas` (este puede faltar sin pulsos) y suma
     `seccionEnSeg(s)`. `seccionEn(c)` no cambia.
  4. **Arreglo:** "📋 Traer de la Ficha" solo con secciones con compás; si la Ficha tiene estructura pero no tempo,
     dice "falta marcar el tempo de la Ficha".
  - Sin cambios en Supabase (mismo recurso `tempo` y su archivo).
  - Lugares (regla 11): app `TEMPO/` (las dos vistas), `comun/tempo-mapa.js` (lo leen Arreglo, Piano, Melodía,
    Cajón, Metrónomo y Lector: solo el Arreglo usa secciones), Editor de Arreglos (② Secciones), Biblioteca (la línea
    📋 Ficha: el botón ⏱ Tempo abre la app; sin audio sigue deshabilitado).
  - Después (cada uno aparte, con su ficha): Entrenador (saltar a una sección, loop por sección) y Cantar.
  - Prueba: COQUETA (tiene pulsos) y una canción con audio y sin pulsos: marcar 4 secciones sonando, moverlas,
    guardar, volver a abrir; marcar después unos compases y ver que se pegan; Arreglo con y sin tempo.
- **Hecho (2026-10-31, commit d945793):**
  - `comun/tempo-mapa.js`: cada sección `{ compas, seg, nombre }` (`compas` null sin tempo en ese punto; con pulsos el
    `seg` se calcula del compás); `m.seccionEnSeg(s)`; `seccionEn(c)` solo mira las que tienen compás. Fichas antiguas
    (solo `compas`) se leen igual y al guardarse llevan también `seg`.
  - App de la Ficha (`TEMPO/`): selector ⏱ Tempo / 🧩 Estructura en la barra (abre en Estructura si no hay compases; si
    no, el último usado en el equipo). Estructura: sin ⏺ Marcar ni barra del clic (espacio reservado), sin la fila de
    compases ni Cifras/Emparejar/Ajustar/Importar/Borrar todos, sin clic de metrónomo, onda limpia con una línea por
    comienzo de parte (la elegida en celeste); Espacio = nueva parte donde suena (detenida, toca), "Sección N" de nombre
    provisional; fila con la sección elegida, su nombre (Enter; vacío = quitar) y 🗑 Quitar sección; arrastrar, doble
    clic, Supr, ← →; chips con el segundo (o el compás si cae en lo marcado). La posición de arriba dice en qué parte va.
    En las dos vistas, una sección dentro de lo marcado (± medio compás) se pega al 1 del compás más cercano; fuera, va
    por su segundo. Se puede guardar sin compases (solo estructura, tonalidad o cifra); un solo compás no.
  - Editor de Arreglos: "📋 Traer de la Ficha" usa solo las secciones con compás; si la Ficha tiene secciones pero no
    tempo, dice "La Ficha tiene secciones, pero falta marcar su tempo" (espacio reservado).
  - Prueba (navegador, sin escribir en la base): OLIMPO (sin Ficha) abre en Estructura; Espacio detenida toca, 3
    Espacios sonando + doble clic → 4 partes (11,2 · 12,4 · 13,7 · 40 s), renombrar a Intro; datos `{ seg, nombre }`;
    recargar → se recupera el borrador; a Tempo con 11 compases (10–30 s) → las de dentro se pegan (12 s = compás 2,
    14 s = compás 3) y la de 40 s sigue por segundo; ida y vuelta guardar/leer igual; `seccionEnSeg(41)` y
    `seccionEn(3)` correctos. COQUETA abre "Guardado" (sin cambios), en Estructura muestra sus 8 secciones. Arreglo de
    COQUETA: 8 secciones (Estrofa 12 compases, Coro 8…); con una Ficha simulada sin tempo, aviso visible y botón apagado.
    Visto en la prueba: dos partes a menos de un compás una de otra, al marcar el tempo, caen en el mismo compás y queda
    solo la segunda (en una canción real las partes están a varios compases).
  - **Falta:** que el PO marque la estructura de una canción real y la guarde.
- **Ajuste (PO 2026-10-31, "que la tecla para agregar marcadores sea Enter: le doy a Espacio para detener y se agregan
  marcadores erróneos; y que Retroceso vaya borrando desde el último"):** en las dos vistas **Espacio (o K) solo toca /
  detiene**. Tempo, marcando: **Enter** = el 1 de un compás, Retroceso quita el último, Espacio o Esc terminan (antes
  Espacio marcaba y Enter terminaba). Estructura: sonando, **Enter** pone una parte donde va; **Retroceso** quita la
  última que pasó (detenida, la última antes del cursor); Supr quita la elegida. Ayudas y avisos al día.
  Prueba (navegador, OLIMPO, sin guardar): Estructura: Espacio toca, 3 Enter → 3 partes, Retroceso → 2, Espacio
  detiene sin agregar; Tempo: 4 Enter marcando → Retroceso → 3, Espacio termina y detiene → 3 compases.

### EX. 🔗 Secciones de la Ficha ligadas a las estrofas de la letra — HECHA
*Origen: PO 2026-10-31 ("quiero que se puedan ligar algunas secciones (no todas) a letras de la canción; debería poderse
por proximidad de tiempo").*
- **Necesidad:** saber qué estrofa de la letra es el Coro, la Estrofa 2… sin escribirlo dos veces, para verlo al
  ensayar y, después, para repetir una sección desde la letra.
- **Auditoría:**
  - Letra: recurso `letra` (`contenido` = texto, una línea vacía entre estrofas; `synced` = LRC con el segundo de
    cada verso, en la misma grabación que Melodía/Karaoke, ET). El Entrenador une texto y tiempos con una cola por
    texto (`entrenadorLines`, `sinTiempo` si un verso no tiene tiempo) y arma las estrofas (`entParseStanzas`).
  - Secciones de la Ficha: `{ compas?, seg, nombre }` (EW); el segundo es de la misma grabación.
  - El Entrenador dibuja cada estrofa con `entStanzaHTML` (Scroll y Diapositiva; Sync y Edición tienen su propio
    dibujo); el tamaño de letra se pone verso a verso (`entAjustarFontSize`, Diapositiva). Ya carga `tempo-mapa.js`.
- **Plan aprobado (PO 2026-10-31, "apruebo"):**
  1. **Por cercanía:** una sección se liga a la estrofa cuyo primer verso con tiempo cae desde 1 s antes de su
     comienzo hasta 8 s después (sin pasar del comienzo de la siguiente sección); la más cercana. Así Coro y Estrofas
     se ligan solas e Intro/Mambo no.
  2. **Se corrige en la Ficha (vista 🧩 Estructura):** sobre la onda, una marca por estrofa con su primer verso (del
     color de su sección si está ligada, gris si no); la sección elegida tiene un menú "Letra" (— sin letra · las
     estrofas cercanas · la automática marcada); los chips de sección llevan 🔗 si están ligadas.
  3. **Se guarda poco:** en la sección, `letra: false` (desligada a mano) o `letraSeg: s` (ligada a mano a la estrofa
     que empieza en ese segundo); sin nada = automática. La estrofa se busca siempre por tiempo: corregir la letra o su
     sincronía no rompe la unión. Pieza: `TempoMapa.estrofasDeLetra(contenido, synced)` y `m.letraDeSecciones(inicios)`.
  4. **Entrenador:** sobre la estrofa ligada, una etiqueta chica con el nombre de la sección (Scroll y Diapositiva, con
     su tamaño proporcional a la letra). Sin letra sincronizada o sin Ficha, nada cambia.
  - Sin cambios en Supabase.
  - Lugares (regla 11): app `TEMPO/` (Estructura), `comun/tempo-mapa.js`, Entrenador en todos sus lugares (Biblioteca,
    sesión del curso, Plan/mínimo, celular `?movil=1`, copia en la Pizarra `?espejo=1`: mismo archivo y mismo
    `entStanzaHTML`).
  - Después (cada uno con su ficha): loop de una sección desde la letra, Cantar con los nombres, letra por sección en el
    Arreglo.
- **Hecho (2026-10-31, commit 5b575d2):**
  - `comun/tempo-mapa.js`: `TempoMapa.estrofasDeLetra(contenido, synced)` (mismo armado que el Entrenador) y
    `m.letraDeSecciones(inicios)` → `{ estrofa, auto }` por sección; primero las ligadas a mano (mandan), después las
    automáticas con las estrofas que quedan (una estrofa, una sección). Las secciones guardan `letra: false` o
    `letraSeg`. Versión de la pieza `ex1` en Biblioteca, Arreglo, Melodía, Cajón, Ritmos y Lector.
  - App de la Ficha (Estructura): abajo de la onda, una marca por estrofa con su primer verso (color de su sección si
    está ligada, gris si no); chips con 🔗 (el primer verso en el `title`); en la fila de la sección elegida, menú
    **🔗 Letra** (— sin letra · estrofas desde 3 s antes hasta la sección siguiente · "(por cercanía)" en la
    automática). Elegir la automática no guarda nada; otra = `letraSeg`; "sin letra" = `letra: false`. Lee la primera
    letra de la canción (la del Entrenador) si está sincronizada.
  - Entrenador: `entCalcularSecciones` (al dibujar Scroll y Diapositiva) y etiqueta `.ent-sec-tag` sobre la estrofa,
    sin ocupar lugar, ~38 % del tamaño de la letra (también en el modo Diapositiva que reparte versos sueltos).
  - Prueba (navegador, COQUETA, sin escribir en la base): la Ficha abre "Guardado"; se ligan solas Estrofa → "Pensando
    y viendo…" (9,8 s), Coro → "Coqueta, si me quieres…" (47 s), "Dame" (71 s), y lo mismo en la segunda vuelta; los
    dos Mambo quedan sin letra. Coro → "sin letra" guarda `letra: false`; Mambo → la estrofa "Mambo" (1:44) guarda
    `letraSeg: 104.24`; deshecho. Entrenador (Biblioteca y celular `?movil=1`): etiquetas ESTROFA · CORO · "DAME" ×2
    visibles en Scroll y en Diapositiva. La copia en la Pizarra y el Entrenador mínimo usan el mismo dibujo (no
    probados aparte).
  - **Falta:** que el PO lo vea en la Ficha y en el Entrenador con una canción real.
