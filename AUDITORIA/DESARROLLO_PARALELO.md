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
**Estado:** en desarrollo — spec aprobada + auditoría técnica + decisiones del PO
cerradas (NO quedan decisiones de Producto pendientes); **implementación autorizada por
el PO (2026-09-20), por etapas**. **Etapa 1 (esquema base) implementada en código**
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
sin regresión en la evaluación tradicional real. **Etapas 5–7 NO iniciadas.** Registro
detallado en `INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` ("Registro de implementación
— Etapa 1" a "— Etapa 4").
**Identidad institucional del PDF (PO):** escuela *Escuela Juana de Lestonnac*;
sostenedor *Servicio Local de Educación Pública Los Parques*; **logos** se adjuntarán a
Claude (pendiente de recibir). El **encabezado institucional** debe **repetirse en todas
las páginas** de los PDF replicando el layout del archivo de referencia versionado
`AUDITORIA/assets/ENCABEZADO PDF.pdf` (posición de nombres, logos y proporciones); las versiones grandes
de logos en ese PDF son solo material de referencia, no van en el cuerpo. Detalle en
`INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` §0.2.
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
**Documentación/código afectado:** se creó `AUDITORIA/INSTRUMENTOS_EVALUACION_SPEC.md`
y `AUDITORIA/INSTRUMENTOS_EVALUACION_AUDITORIA_TECNICA.md` (auditoría + decisiones del
PO); se actualizó esta ficha. **Código: ninguno** (sin implementación en esta etapa).
**Pendientes (post-decisiones):** **no quedan decisiones de Producto pendientes.** Antes
de implementar resta: (a) **autorización del PO para implementar y ejecutar los cambios
en Supabase** (incl. modificar I13; §4.4); (b) **insumo:** recibir los **archivos de
logo** (escuela y sostenedor) — necesario solo para cerrar la Etapa 7 (PDF), no bloquea
etapas previas. Detalle técnico menor sin impacto de producto: almacenamiento de
descripciones de niveles de rúbrica. **Mobile V1.0** sigue como requisito futuro (spec
§C), no implementado ahora.
**Consecuencia documental pendiente (al implementar):** actualizar la invariante **I13**
en `supabase/libro_schema.sql` y su descripción en `CLAUDE.md` (hoy "sin
re-sincronización") conforme a la decisión 6b — **no se toca ahora**.
**Observaciones para la reintegración:** contrastar contra F6H del Bosquejo; si Producto
lo confirma como V1 firme, evaluar la actualización de `CLAUDE.md` (§8 alcance V1 y §9
roadmap, hoy con rúbricas/UTP como "posible/identificado"). Registrar que esta línea
**cambia reglas vigentes** de EVALUACIÓN (cierre y snapshot), lo que debe quedar
reflejado en la Fuente de Verdad cuando se implemente y decida.
