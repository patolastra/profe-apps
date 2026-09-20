# Bosquejo Conceptual V1 — Estado y Continuidad

> **Qué es este documento.** Registro del **estado y la continuidad** del proyecto
> "Bosquejo Conceptual V1" (la definición de la V1.0 comercializable de Profe Apps).
> No es normativo. Su función es dejar por escrito en qué punto quedó el recorrido
> conceptual, qué se suspende temporalmente y bajo qué reglas continúa el trabajo.
>
> **Jerarquía documental (sin cambios):**
> - `CLAUDE.md` → **Fuente de Verdad normativa** del ecosistema.
> - Bosquejo conceptual (`BOSQUEJO_CONCEPTUAL_V1.txt`, `F6A_CONFIGURACION_INICIAL.txt`,
>   `F6_RECORRIDO_A-K.txt`) → **marco conceptual** de V1 (no normativo).
> - Este documento y `DESARROLLO_PARALELO.md` → **documentación de estado/continuidad
>   y trazabilidad** (no normativa).
>
> Este documento **no** convierte hipótesis del Bosquejo en decisiones de producto.

---

## 1. Estado general del proyecto

- **F0–F5:** cerradas (Gran Etapa — Auditoría y Saneamiento PRE-V1). Ver
  `PLAN_MAESTRO_AUDITORIA_SANEAMIENTO.txt` y `HISTORIA_HITOS.md`.
- **F6:** iniciada como **exploración conceptual de V1** (Preparación V1). No es
  implementación: es la definición conceptual del producto antes de construir.
- **F6A — Configuración inicial / primera experiencia:** **CERRADA conceptualmente.**
- **F6B–F6K:** **pendientes** (aún no recorridas conceptualmente).

---

## 2. Recorrido de F6 (subestructura A–K)

F6 recorre el ecosistema desde la primera experiencia del profesor hasta las
capacidades que V1 necesita, **antes** de decidir implementación:

| Etapa | Área | Estado |
|---|---|---|
| **F6A** | Configuración inicial / primera experiencia | ✅ Cerrada conceptualmente |
| **F6B** | Dashboard | ⏳ Pendiente — **siguiente etapa lineal** |
| **F6C** | Curso | ⏳ Pendiente |
| **F6D** | Clase / Planificación | ⏳ Pendiente |
| **F6E** | Biblioteca / Repertorio / Recursos | ⏳ Pendiente |
| **F6F** | Pizarra / ejecución | ⏳ Pendiente |
| **F6G** | Libro / alumnos | ⏳ Pendiente |
| **F6H** | Evaluaciones / UTP | ⏳ Pendiente |
| **F6I** | Audio / video | ⏳ Pendiente |
| **F6J** | Creación de recursos / apps | ⏳ Pendiente |
| **F6K** | Administración / cuenta / seguridad | ⏳ Pendiente |

Documentos fuente de F6 disponibles en `AUDITORIA/`:
- `F6A_CONFIGURACION_INICIAL.txt` — consolidación conceptual de F6A (verbatim).
- `F6_RECORRIDO_A-K.txt` — estructura completa del recorrido A–K (verbatim).
- `BOSQUEJO_CONCEPTUAL_V1.txt` — bosquejo general previo de V1 (verbatim).

---

## 3. Punto actual del recorrido

- **F6A está cerrada conceptualmente.**
- La **siguiente etapa lineal pendiente es F6B — Dashboard.**

---

## 4. Suspensión temporal del recorrido lineal

- El **Bosquejo Conceptual V1 NO se cancela** ni se congela definitivamente.
- El **recorrido lineal queda temporalmente suspendido después de F6A.**
- **Punto exacto de suspensión:** justo después del cierre conceptual de F6A;
  el próximo punto de continuidad del Bosquejo será **F6B — Dashboard**.
- **Duración estimada:** aproximadamente **2–3 meses** (sujeto a las necesidades
  del año escolar).
- **Razón:** permitir el desarrollo de funcionalidades que **actualmente son
  necesarias para el trabajo profesional docente del usuario**, aunque algunas
  estuvieran previstas originalmente para fases posteriores del Bosquejo.

Esta suspensión **no** significa cancelar el Bosquejo, congelarlo definitivamente,
modificar silenciosamente su planificación ni abandonar F6.

---

## 5. Desarrollo paralelo (mecanismo temporal)

Durante la suspensión se abre un período de **desarrollo paralelo**. Sus reglas:

- **No reemplaza** el Bosquejo Conceptual V1.
- **No modifica automáticamente** el Bosquejo.
- **No convierte** una implementación anticipada en decisión conceptual definitiva.
- Cada desarrollo paralelo debe quedar **trazable** (registrado en
  `DESARROLLO_PARALELO.md`).
- Al finalizar este período se realizará una **reintegración / auditoría global**
  antes de continuar con **F6B**.

Toda funcionalidad prevista para una fase posterior que se implemente ahora se
registra como **"funcionalidad adelantada durante el período de desarrollo
paralelo"**.

---

## 6. Criterios de reintegración (al retomar el recorrido V1)

Al reanudar el recorrido conceptual se deberá **comparar**:

- lo definido en el Bosquejo;
- lo que realmente existe en el código;
- lo desarrollado durante el período paralelo;
- las decisiones adoptadas durante ese período;
- la arquitectura / documentación vigente.

La reintegración **determinará el estado definitivo de cada funcionalidad** dentro
de V1 antes de continuar con F6B.

---

## 7. Temas pendientes de F6A

Los asuntos que F6A dejó **explícitamente pendientes o especulativos siguen
pendientes** y **NO deben considerarse resueltos por este documento** (detalle
en `F6A_CONFIGURACION_INICIAL.txt`, p. ej. su punto 43). A modo de referencia,
sin cerrarlos aquí: comportamiento al eliminar una sección y conservación
histórica; qué modificaciones de configuración requieren confirmación; diseño de
excepciones y de vacaciones; nomenclatura definitiva de assets / "Recursos";
arquitectura Biblioteca/Repertorio; diseño completo del Dashboard; Pizarra LIVE;
captura de audio/video; rúbricas; entrega a UTP; administración institucional.

> Además existen **contradicciones detectadas** entre definiciones de F6A y la
> arquitectura actual (p. ej. Jefatura; modelo Institución→Curso→Sección→Clase;
> nomenclatura "Recursos"/Biblioteca/Repertorio). **No se resuelven aquí**: quedan
> anotadas para la reintegración futura.

---

## 8. Distinción documental (recordatorio)

- **`CLAUDE.md`** = fuente de verdad **normativa**.
- **Bosquejo conceptual** = **marco conceptual** de V1.
- **Este documento + `DESARROLLO_PARALELO.md`** = documentación de **estado /
  continuidad y trazabilidad**.

---

*Documento de estado. Actualizar cuando cambie el punto de continuidad, se reanude
el recorrido lineal, o se ejecute la reintegración global.*
