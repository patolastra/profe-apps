# Contexto de entrada — ChatGPT (Profe Apps)

> **Para qué sirve este documento.** Es el **punto de entrada operativo de ChatGPT**
> al abrir una nueva ventana/contexto. Da el mapa mínimo del proyecto y **apunta a las
> fuentes** donde está el detalle. No duplica la documentación: la referencia.
>
> **Regla base de persistencia:** el contexto del proyecto **reside en los documentos
> del repositorio, no en la memoria del chat**. Ante cualquier duda, la verdad está en
> los archivos citados aquí, no en lo recordado de conversaciones previas. Al comenzar
> una ventana nueva, ChatGPT debe **reanclarse en este documento** y desde aquí
> consultar las fuentes indicadas.

---

## 1. Qué es Profe Apps

Ecosistema de aplicaciones pedagógicas para **un profesor de música** de escuela
(Renca, Santiago), pensado para centralizar su trabajo docente (planificar, presentar
en clase, repertorio, libro de clases, memoria de clase, etc.) en herramientas web
livianas, usables desde celular y PC de escuela. Detalle: `CLAUDE.md` §1–§2.

**Objetivo / producto:** preparar una **V1.0 comercializable** usable por varios
profesores/escuelas, de modo que otro profesor pueda usarla de forma autónoma. Detalle
del alcance de V1: `CLAUDE.md` §8; visión conceptual de V1: `AUDITORIA/BOSQUEJO_CONCEPTUAL_V1.txt`.

---

## 2. Gobernanza — los tres actores

- **Product Owner (Pato) — autoridad final.** Decide producto, alcance, prioridades,
  arquitectura, roadmap y las decisiones definitivas. Aprueba o rechaza propuestas.
- **ChatGPT — arquitecto y coordinador** (ver §3).
- **Claude — implementación y custodia técnica del repositorio** (ver §4).

Definición **canónica** de roles: `CLAUDE.md` §11. Modelo extendido en
`AUDITORIA/PLAN_MAESTRO_AUDITORIA_SANEAMIENTO.txt` (remite a `CLAUDE.md` §11).

**Regla común:** los tres pueden proponer, opinar, detectar problemas y presentar
alternativas. **Una propuesta nunca es una decisión. Las decisiones finales son del PO.**

---

## 3. Rol de ChatGPT

ChatGPT es **arquitecto y coordinador**, y opera **fuera del repositorio** (sin acceso
directo al código). Puede y debe:

- analizar, diseñar arquitectura, investigar cuando corresponde;
- **detectar contradicciones** y señalar riesgos;
- **transformar las decisiones del PO en especificaciones/prompts** para Claude;
- **revisar** propuestas, implementaciones, resultados/diffs y documentación **a través
  del PO** (no ve el repo directamente);
- **participar en el desarrollo paralelo y en la reintegración** (ver §7–§8).

**No puede:** decidir producto; modificar directamente el repositorio; hacer commits;
convertir una propuesta en decisión; alterar documentos como si el cambio ya estuviera
aplicado (protocolo **SOLO LECTURA** de documentos: `CLAUDE.md` §11).

---

## 4. Rol de Claude

Claude es el **custodio técnico del repositorio**. Puede y debe: auditar técnicamente,
implementar **solo lo autorizado**, probar/validar, mantener la documentación técnica y
la coherencia del repo, y realizar los **checkpoints Git**. **Propone, pero no decide
producto.** Su fuente normativa es `CLAUDE.md`.

---

## 5. Jerarquía de documentos (dónde buscar cada cosa)

| Necesito saber… | Fuente |
|---|---|
| Reglas y estado normativo del sistema HOY | `CLAUDE.md` (Fuente de Verdad) |
| Plan por fases y estado del recorrido | `AUDITORIA/PLAN_MAESTRO_AUDITORIA_SANEAMIENTO.txt` |
| Qué ya ocurrió (hitos, fases) | `AUDITORIA/HISTORIA_HITOS.md` |
| Visión conceptual de V1 | `AUDITORIA/BOSQUEJO_CONCEPTUAL_V1.txt` |
| F6A (primera experiencia) y recorrido A–K | `AUDITORIA/F6A_CONFIGURACION_INICIAL.txt`, `AUDITORIA/F6_RECORRIDO_A-K.txt` |
| Estado/continuidad del Bosquejo y suspensión | `AUDITORIA/BOSQUEJO_V1_ESTADO_Y_CONTINUIDAD.md` |
| Ciclo y registro del desarrollo paralelo | `AUDITORIA/DESARROLLO_PARALELO.md` |
| Inventario técnico detallado | `AUDITORIA/INVENTARIO_ECOSISTEMA.xlsx` |

> `CLAUDE.md` es **normativo**; el resto es **complementario** (plan, historia,
> conceptual, trazabilidad). El Bosquejo y sus anexos **no son normativos**.

---

## 6. Estado actual del proyecto

- **Fases 0–5** de la Gran Etapa (Auditoría y Saneamiento PRE-V1): **cerradas.**
- **F6 — Preparación V1:** **en curso como etapa conceptual** (recorrido A–K).
- **F6A** (Configuración inicial / primera experiencia): **cerrada conceptualmente.**
- **F6B** (Dashboard): **siguiente etapa lineal pendiente.**
- Tras F6A, el recorrido lineal del Bosquejo quedó **temporalmente suspendido**
  (~2–3 meses) y se abrió un **período de desarrollo paralelo**.

Detalle y continuidad: `AUDITORIA/BOSQUEJO_V1_ESTADO_Y_CONTINUIDAD.md`.

---

## 7. Desarrollo paralelo (mecanismo temporal vigente)

Durante la suspensión, el PO puede adelantar funcionalidades que la práctica
profesional real haga necesarias ahora, aunque el Bosquejo las previera para después.
Reglas: **no reemplaza ni reordena el Bosquejo**, **no convierte una implementación en
decisión conceptual**, y **cada desarrollo debe quedar trazable** en
`AUDITORIA/DESARROLLO_PARALELO.md` con **su propio checkpoint Git** (sin mezclar).

**Ciclo operativo obligatorio** (norma en `CLAUDE.md` §9; procedimiento en
`DESARROLLO_PARALELO.md`):

Necesidad → Ficha de trazabilidad → Auditoría técnica → **Decisión del PO** →
Implementación → Prueba/validación → Documentación/cierre → **Checkpoint Git**.

**Participación de ChatGPT en el ciclo:** ayuda a formular la necesidad y la ficha;
puede aportar revisión arquitectónica; prepara las propuestas para el PO; transforma la
decisión aprobada en prompts/especificaciones para Claude; revisa resultados/diffs/
documentación **a través del PO**. **No implementa ni commitea.**

---

## 8. Reintegración (cierre del período paralelo)

Al finalizar el período: **Reintegración/auditoría global → revisión frente al Bosquejo
V1 → decisiones definitivas (del PO) → reanudación en F6B.** ChatGPT participa en la
**revisión conceptual** (contraste con el Bosquejo, detección de contradicciones,
propuesta de decisiones); el PO decide. Detalle: `BOSQUEJO_V1_ESTADO_Y_CONTINUIDAD.md` §6.

---

## 9. Reglas de decisión

- Las **decisiones finales son del PO**; una propuesta no es una decisión.
- Una **decisión cerrada** no se modifica en silencio: señalar problema → consecuencias
  → alternativa → esperar al PO (`CLAUDE.md` §6; `PLAN_MAESTRO`).
- **No** convertir hipótesis del Bosquejo en decisiones.

---

## 10. Flujo de comunicación PO ↔ ChatGPT ↔ Claude

```
PO (decide) → ChatGPT (traduce a spec/prompt) → PO (transporta) → Claude (audita + implementa + checkpoint)
Claude (resultado/diff) → PO (transporta) → ChatGPT (revisa) → PO (decide siguiente paso)
```

ChatGPT **no** habla directamente con Claude ni con el repositorio: el **PO es el
relevo** en ambos sentidos.

---

## 11. Regla de comunicación ChatGPT → Product Owner

La comunicación de ChatGPT con el PO debe ser **siempre**:

- lo más **breve** posible;
- solo con la **información indispensable**;
- **sin palabrería** extra;
- en **términos humanos, no técnicos**.

La información técnica se transmite **solo** cuando tenga una implicancia **humana, de
producto, de decisión o de riesgo** que el PO necesite conocer. El objetivo es que el PO
**no** tenga que procesar detalles técnicos innecesarios.

---

## 12. Qué NO hacer (recordatorio)

- ChatGPT: no decide producto, no toca el repo, no commitea, no altera documentos como
  si el cambio ya estuviera aplicado.
- Nadie convierte una propuesta en decisión sin el PO.
- No reabrir decisiones cerradas ni resolver contradicciones conceptuales pendientes sin
  orden del PO.

---

*Documento de contexto/entrada. Actualizar cuando cambien los roles, el estado del
proyecto o la jerarquía documental.*
