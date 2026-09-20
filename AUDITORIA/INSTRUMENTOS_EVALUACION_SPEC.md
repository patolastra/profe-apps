# Instrumentos de Evaluación — Rúbricas y Listas de Cotejo (Libro de Clases)
## Especificación funcional consolidada

> **Qué es este documento.** La **especificación funcional aprobada por Producto**
> para la línea de desarrollo paralelo *"Instrumentos de Evaluación — Rúbricas y
> Listas de Cotejo"* del Libro de Clases. Consolida las decisiones de producto para
> que queden preservadas y trazables.
>
> **Estado (2026-09-20):** especificación funcional **cerrada por Producto**. La
> **implementación NO está autorizada**. La siguiente etapa —autorizada por separado
> por el Product Owner— será una **auditoría técnica y propuesta de implementación**
> contra el código existente.
>
> **Naturaleza documental (gobernanza).** Documento **complementario y NO normativo**:
> no reemplaza a `CLAUDE.md` (Fuente de Verdad). Es la ficha ampliada de un desarrollo
> paralelo; su registro de trazabilidad vive en `AUDITORIA/DESARROLLO_PARALELO.md`. Que
> Producto haya cerrado esta especificación **no** convierte automáticamente la línea en
> decisión conceptual del Bosquejo V1 ni reordena el Bosquejo (regla del período
> paralelo, `CLAUDE.md` §9); su encaje definitivo en V1 se resolverá en la
> **reintegración**.
>
> **Cómo leer las secciones.**
> - **§A — DECIDIDO POR PRODUCTO:** especificación cerrada (reproduce las decisiones
>   del PO, sin reinterpretar).
> - **§B — PENDIENTE DE RESOLUCIÓN TÉCNICA:** lo que Producto deja abierto al equipo
>   técnico, más las **contradicciones detectadas** con el comportamiento vigente que
>   deberán resolverse en la auditoría técnica (aquí solo se **señalan**, no se
>   resuelven).
> - **§C — MOBILE V1.0:** requisito futuro, explícitamente **fuera** de esta etapa.

---

## §A — DECIDIDO POR PRODUCTO (especificación funcional cerrada)

### A1. Conversión de puntaje a nota
Los instrumentos generan **automáticamente** la nota a partir del puntaje obtenido.

**Rúbrica** (valor por nivel):
- Por lograr = 1 punto.
- Medianamente logrado = 2 puntos.
- Logrado = 3 puntos.
- Logrado con distinción = 4 puntos.

**Lista de cotejo** (valor por respuesta):
- No = 1 punto.
- Sí = 2 puntos.

El **puntaje total** es la suma de los valores obtenidos. Cada instrumento tiene un
**puntaje mínimo posible** y un **puntaje máximo posible**.
- Puntaje mínimo posible → **nota mínima configurada** (piso).
- Puntaje máximo posible → **7,0**.
- Los valores intermedios se convierten **linealmente** entre ambos extremos.

**Nota mínima (piso)** — se configura **a nivel de la evaluación**:
- rango permitido: **2,0 a 6,9**;
- valor por defecto: **2,0**;
- máximo siempre: **7,0**.

**Redondeo** convencional a un decimal:
- segundo decimal 0–4 → se mantiene el primero;
- segundo decimal 5–9 → el primero aumenta una décima.

### A2. Estructura de los instrumentos
**Rúbrica:**
- múltiples **criterios**;
- exactamente **cuatro niveles**: (1) Por lograr, (2) Medianamente logrado,
  (3) Logrado, (4) Logrado con distinción;
- cada nivel **puede** tener su descripción correspondiente;
- valores fijos **1–4**.

**Lista de cotejo:**
- múltiples **ítems**;
- cada ítem se responde **Sí/No**; No = 1, Sí = 2.

### A3. Plantillas
Debe existir una sección **Plantillas** que permita: crear, nombrar libremente,
escoger **Rúbrica o Lista de cotejo**, editar, duplicar, eliminar y listar/gestionar.

- Las plantillas **NO contienen OA**.
- Desde una Evaluación se podrá **cargar una plantilla**; al hacerlo se crea una
  **copia independiente** dentro de esa evaluación.
- Cambiar o eliminar posteriormente la plantilla original **nunca** modifica
  evaluaciones donde ya haya sido utilizada.

### A4. Integración con EVALUACIÓN
**EVALUACIÓN sigue siendo el objeto central.** Una evaluación puede:
- funcionar de la manera **tradicional actual, sin instrumento**;
- utilizar **rúbrica**;
- utilizar **lista de cotejo**.

Los instrumentos **viven dentro de la Evaluación** una vez aplicados.

### A5. OA, adecuaciones e instrumentos
- Cada objetivo evaluado —OA original o adecuación— tiene **asociado un instrumento**.
- Una evaluación puede contener **simultáneamente varios instrumentos**, uno por
  objetivo/adecuación.
- Un **mismo instrumento** puede utilizarse para más de un objetivo cuando corresponda
  pedagógicamente.
- Cada estudiante utiliza el instrumento correspondiente al OA/adecuación que tenga
  asignado.
- **Cadena conceptual:** OA → instrumento → evaluación del estudiante.

### A6. Evaluaciones grupales
Los instrumentos deben funcionar con el mecanismo de **grupos**. Por defecto: se
evalúa el grupo y el resultado se aplica a sus integrantes.

Debe permitirse que el usuario establezca las **excepciones** que estime convenientes
dentro del grupo. Una excepción puede implicar, entre otras posibilidades, que un
estudiante:
- sea evaluado **individualmente**;
- tenga una **adecuación diferente**;
- utilice **otro instrumento**;
- tenga un **resultado diferente** al del grupo.

Un estudiante de un grupo puede, por tanto, tener una adecuación diferente y utilizar
el **instrumento completo** correspondiente a esa adecuación.

### A7. Persistencia / estructura técnica
Producto **NO prescribe** tablas, columnas ni arquitectura de Supabase. El equipo
técnico puede proponer las estructuras nuevas o modificaciones necesarias. Todo diseño
técnico deberá ser **auditado y documentado antes de implementar** (gobernanza del
proyecto). → Ver §B.

### A8. Cálculo durante la aplicación
Mientras se completa el instrumento, el profesor ve **en tiempo real**: **puntaje** y
**nota resultante** (usando el piso configurado para esa evaluación).

Mientras la evaluación esté **abierta**, el profesor puede **modificar el piso**; el
cambio **recalcula automáticamente** las notas de **todos** los estudiantes de esa
evaluación. Al **cerrar**, el piso queda **congelado**.

### A9. Experiencia de evaluación y pendientes
Para cada estudiante el profesor debe poder ver: **nombre**, **OA original o
adecuación asignada**, e **instrumento correspondiente**.

- Un instrumento puede **guardarse parcialmente** completado.
- Mientras falte algún criterio/ítem: queda como **evaluación incompleta**; **no hay
  nota definitiva**.
- **La evaluación no puede cerrarse** mientras existan estudiantes **pendientes** que
  deban ser evaluados.

**Retiro:** si un estudiante estaba incluido y es **retirado antes** de ser evaluado:
conserva su **registro histórico**, **no recibe nota** y **deja de bloquear el cierre**.
Si **ya fue evaluado** antes de retirarse, su evaluación **permanece**.

**Ingreso posterior:** si un estudiante **ingresa después** de creada una evaluación
abierta, debe poder **incorporarse** a ella. El profesor decide: **evaluarlo**, o
**marcarlo como "no evaluado/no aplica"** cuando por su incorporación tardía la
evaluación no resulte pertinente/accesible. Un estudiante **"no aplica" no bloquea el
cierre**.

### A10. Edición, cierre y reapertura
Mientras la evaluación esté **abierta** deben poder modificarse: resultados,
instrumentos, OA/adecuaciones, grupos, integrantes, excepciones y piso de nota.

Al **cerrar** quedan **congelados**: instrumentos; OA/adecuación efectivamente aplicado
a cada estudiante; composición de grupos; estudiantes considerados; excepciones;
resultados; puntajes/notas; configuración de conversión.

Se **mantiene el mecanismo actual de reapertura**. Al reabrir, la evaluación vuelve a
ser editable.

### A11. Pool previo y asignación in situ
El profesor puede preparar previamente un **pool** de: OA original, adecuaciones e
instrumentos asociados. **No es obligatorio** tener preasignado a cada estudiante cuál
utilizará.

Durante la evaluación el profesor puede decidir **in situ** qué OA/adecuación
corresponde a cada estudiante; el sistema utiliza el **instrumento asociado**. Mientras
la evaluación esté abierta, esta asignación puede **cambiar**.

### A12. Creación in situ
Durante la aplicación, si aparece una necesidad no prevista, el profesor debe poder
crear **sin abandonar el flujo**: una nueva **adecuación**, el **instrumento**
correspondiente, y **aplicarlo inmediatamente** al estudiante. La prioridad es
optimizar el trabajo con los estudiantes, no la administración del sistema.

Lo creado in situ queda **asociado a esa evaluación**. Por ahora **NO** debe existir un
paso adicional para guardarlo automáticamente como plantilla; si el profesor quiere
reutilizarlo, podrá **rescatarlo manualmente**.

### A13. Informes PDF / UTP
Existirán **dos salidas documentales**.

**A. Informe previo de instrumentos para UTP** — su objetivo **no** es aplicar la
evaluación en papel, sino **informar cómo será evaluada**. Debe incluir: OA original;
todas las adecuaciones previstas; instrumento asociado a cada OA/adecuación;
criterios/ítems y estructura completa de cada instrumento.

**B. Informe de resultados** — informe general detallado **por estudiante**: nombre;
OA/adecuación aplicado; instrumento utilizado; resultado por criterio/ítem; puntaje
total; nota obtenida.

**Formato:** PDF, tamaño **Carta**.

**Identidad institucional del PDF:** nombre de la escuela; logo de la escuela; nombre
del sostenedor; logo del sostenedor. En esta etapa **pueden estar hardcodeados** si
resulta conveniente; para **V1.0 deberán ser personalizables**.

La aplicación de las evaluaciones es **digital** dentro de Profe Apps; los PDF tienen
función **documental/informativa**, no sustituyen la aplicación digital.

### A14. Alcance de plataforma en esta línea
**Desktop:** toda la funcionalidad descrita debe resolverse en esta línea de
implementación. **Mobile:** ver §C (requisito V1.0, fuera de esta etapa).

---

## §B — PENDIENTE DE RESOLUCIÓN TÉCNICA

> No se resuelve aquí. Insumo para la **auditoría técnica y propuesta de
> implementación** (etapa siguiente, aún no autorizada).

1. **Persistencia (A7):** modelo de datos para plantillas, instrumentos aplicados
   (copia independiente por evaluación), criterios/ítems, niveles y descripciones,
   resultado por criterio/ítem por estudiante, piso por evaluación, y la asociación
   OA/adecuación → instrumento. Producto no prescribe tablas/columnas.
2. **Regla de conversión:** fórmula lineal puntaje→nota entre [mín posible → piso] y
   [máx posible → 7,0], y el redondeo a un decimal (A1). Definir el algoritmo exacto y
   los bordes (p. ej. instrumento de un solo criterio; mín = máx).
3. **Contradicciones con el comportamiento VIGENTE (auditado 2026-09-20)** — deben
   resolverse en la auditoría técnica; hoy solo se **señalan**:
   - **Cierre con pendientes:** la spec (A9) exige que **no se pueda cerrar** con
     estudiantes pendientes. Hoy `cerrarEval()` cierra **incondicionalmente** (no hay
     comprobación de pendientes). → cambio de comportamiento.
   - **Snapshot e ingreso posterior:** la spec (A9) exige poder **incorporar** a un
     estudiante que ingresa después. Hoy la población es un **snapshot inmutable**
     (invariante I13: "sin re-sincronización"); un ingreso posterior **nunca** aparece.
     → cambio de comportamiento / rediseño del snapshot.
   - **Retiro:** la spec (A9) exige que un retirado **deje de bloquear el cierre** y no
     reciba nota conservando su histórico. Hoy el retirado **permanece** en la foto,
     **sigue contando como pendiente** y no está diferenciado. → nuevo estado/manejo.
   - **Estado "no aplica":** no existe hoy; hay que definirlo (dato + efecto en cierre).
   - **Congelado al cerrar (A10):** hoy el cierre congela cabecera, notas, adecuaciones
     y grupos vía triggers; falta definir el congelado de las **nuevas** estructuras
     (instrumentos aplicados, resultados por criterio, piso, configuración de
     conversión).
4. **Grupos + instrumentos (A6):** cómo conviven las excepciones actuales
   (`nota_excepcion`/`objetivo_excepcion` y grupos "terminados") con "otro instrumento"
   e "instrumento completo por adecuación" a nivel individual dentro de un grupo.
5. **Recálculo del piso (A8):** propagación del recálculo en vivo a todos los
   estudiantes y su persistencia.
6. **PDFs (A13):** motor/generación PDF Carta dentro del stack vanilla (sin build), y
   de dónde salen los datos de identidad institucional (hardcode ahora; personalizable
   en V1.0 → toca la línea multi-escuela #10).
7. **Regla arquitectónica §4.4 (`CLAUDE.md`):** cualquier tabla/columna/RLS nueva en
   Supabase requiere **autorización explícita del PO** antes de implementar.

---

## §C — MOBILE V1.0 (requisito futuro, NO se implementa en esta etapa)

- **No se implementará** en esta línea, pero queda **establecido como requisito de
  V1.0** y explícitamente documentado.
- La experiencia Mobile deberá permitir el **flujo completo en terreno**:
  **estudiante/grupo → OA/adecuación → instrumento → criterios/ítems → resultado →
  nota**, incluyendo **selección y modificación** de OA/adecuaciones e instrumentos y
  la **resolución de situaciones nuevas in situ**.
- Deberá estar **optimizada para evaluar rápidamente** mientras el profesor trabaja
  directamente con los estudiantes; **no** debe concebirse como la interfaz Desktop
  reducida.

---

## Estado y continuidad
- **Especificación funcional aprobada por Producto** (esta versión).
- **Implementación NO autorizada.**
- **Siguiente etapa (autorización separada del PO):** auditoría técnica + propuesta de
  implementación contra el código existente (`LIBRO/index.html`,
  `supabase/libro_schema.sql`), respetando la gobernanza.
- **Trazabilidad:** ficha en `AUDITORIA/DESARROLLO_PARALELO.md`.
- **Reintegración:** al cerrar el período paralelo se contrastará contra el Bosquejo V1
  (F6-H Evaluaciones/UTP y afines) y se decidirá su estado definitivo en V1.
