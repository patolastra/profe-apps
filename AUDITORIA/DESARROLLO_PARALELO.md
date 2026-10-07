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
