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
**Estado:** propuesto — **especificación funcional aprobada por Producto**;
**implementación NO autorizada**; **pendiente de auditoría técnica** (etapa siguiente,
autorización separada del PO).
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
**Documentación/código afectado:** se creó `AUDITORIA/INSTRUMENTOS_EVALUACION_SPEC.md`;
se registró esta ficha. **Código: ninguno** (sin implementación en esta etapa).
**Pendientes:** toda la resolución técnica (spec §B): modelo de datos, algoritmo de
conversión/redondeo, resolución de las contradicciones con el comportamiento vigente
(cierre con pendientes, snapshot/ingreso posterior, retiro, "no aplica"), congelado de
las nuevas estructuras al cerrar, convivencia grupos↔instrumentos, generación de PDF en
stack vanilla, y autorización de cambios en Supabase (§4.4). **Mobile V1.0** queda como
requisito futuro (spec §C), no implementado ahora.
**Observaciones para la reintegración:** contrastar contra F6H del Bosquejo; si Producto
lo confirma como V1 firme, evaluar la actualización de `CLAUDE.md` (§8 alcance V1 y §9
roadmap, hoy con rúbricas/UTP como "posible/identificado"). Registrar que esta línea
**cambia reglas vigentes** de EVALUACIÓN (cierre y snapshot), lo que debe quedar
reflejado en la Fuente de Verdad cuando se implemente y decida.
