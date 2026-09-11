# Historia de Hitos — Ecosistema Profe Apps

> Historia **conceptual** (no una crónica commit por commit). Recoge los grandes hitos identificados durante F0–F5. Documento **complementario y no normativo**: la fuente de verdad es `/CLAUDE.md`. Donde un detalle no puede comprobarse con los antecedentes existentes, se omite o se marca como *no verificable*.

## Hitos de desarrollo

- **M0 — Génesis / reorganización.** El ecosistema se consolida en un **único repositorio** de backup y control de cambios (SRP deja de tener repo propio, verificado 2026-07-07). Relevante: base del versionado único y del deploy por GitHub Pages.

- **M1 — Supabase + eje temporal + Portal.** Se crea la base en Supabase (DB + `horario` + `sesiones`) y el **tiempo pasa a ser el eje** del ecosistema (contexto + fecha = sesión); nace el **Portal** de planificación/Dashboard. *(Fase 3 ✅ 2026-05-12; Portal Fase 4 ✅ 2026-05-21.)*

- **M2 — Pizarra + Repertorio + protocolo de URLs.** Aparece la **Pizarra** como runtime de presentación en clase y el **Repertorio** (biblioteca + letras); se establece el **protocolo de deep-linking** inter-módulo (`?ctx`, `?modo`, `?sesion`…) como columna vertebral de interoperabilidad. *(Pizarra Fase 4b ✅ 2026-05-15.)*

- **M3 — Shells PC/móvil + Admin + `modulos.js`.** Se define la arquitectura de **launchers** (PC Shell y Mobile Shell con auth gate por PIN), el módulo **Admin** y `modulos.js` como registro de módulos. *(Fase 4c ✅ 2026-05-21.)*

- **M4 — Evolución de la interfaz móvil.** El shell móvil completo evoluciona hacia un **modo lienzo mínimo** (`SHELL_MINIMO`) que deja visible solo la Bitácora; el shell histórico queda oculto/en retiro. *(Desde ~2026-08.)*

- **M5 — Evolución del Lector de Tablaturas.** Consolidación de toda la funcionalidad en el **único archivo oficial** `tabs/index.html` (partituras mixtas, secciones como escena, sincronización de audio); se retiran versiones antiguas versionadas (T42–T48).

- **M6 — Entrenador.** El Entrenador se establece como **editor central de assets** del ecosistema (letras, sincronización, coloreado de versos, modos de proyección); visor y presentación son consumidores read-only.

- **M7 — Memoria / Bitácora.** Se oficializa el concepto de **Memoria de clase** (documento narrativo permanente, tabla `memorias`, audios en bucket propio) y su captura móvil; no genera pendientes ni ejecuta IA. *(Iteración 1 ✅ 2026-07-07.)*

- **M8 — Lector público / capa de configuración.** Se publica un **fork público** del Lector (`tabs-public`) con backend propio, dejando el ecosistema original intacto; se introduce una capa de configuración por instancia del Lector. *(Fork publicado 2026-07-29.)*

- **M9 — Workspace.** `PC/workspace.html` pasa a ser la **entrada PC** (pestañas + iframes persistentes + `postMessage`), reemplazando al launcher clásico. *(Desde 2026-08-13.)*

- **M10 — Ritmo.** El motor **rítmico** del Entrenador madura (sonido de palmada/clap, control de BPM, reanudación). *(2026-08-31.)*

- **M11 — Libro de Clases.** Se construye la **infraestructura base** del Libro (años/estudiantes/matrículas con invariantes, `libro_schema.sql`) y una vista de Participación proyectable. *(F1 ✅ 2026-09-01.)*

- **M12 — Identidad global + nuevo Dashboard.** Se crea la **identidad icónica global** de contextos (`supabase/contextos.js`, sin tocar el nombre técnico) y se **reconstruye el Dashboard** (calendario de 3 semanas + panel de pendientes), retirando el dock y los bloques antiguos del Portal. *(Sep 2026.)*

## Fases de la Gran Etapa (Auditoría y Saneamiento PRE-V1)

- **F0 — Reconstrucción histórica.** Reconstrucción de los principales hitos a partir de Git y documentación (este documento es su síntesis). *Cerrada.*

- **F1 — Auditoría técnica del ecosistema.** Inventario y clasificación técnica de todo el ecosistema (categorías 🟢🟡🔵🟣🟠🔴⚪). *Cerrada.*

- **F1.5 — Clasificación y decisiones del Autor.** El Autor valida el estado real, separa "estado técnico" de "estado según el Autor" y cierra 22 decisiones; entregable: `AUDITORIA/INVENTARIO_ECOSISTEMA.xlsx`. *Cerrada.*

- **F2 — Fuente de Verdad del Ecosistema.** Creación de `/CLAUDE.md` como documento normativo permanente que consolida F0/F1/F1.5. *Cerrada.*

- **F3 — Revisión y Plan de Saneamiento.** *Cerrada.* Secuencia B1 (auditoría de `modulos.js`) → B2 (dependencias de lo aprobado para retiro) → B3 (dudas abiertas) → B4 (**decisiones del Autor**: D1 retirar el shell móvil antiguo, D2 retirar el legacy interno del Portal, y **Opción A** para retirar el deep-link `?ctx`-solo) → **F3.1** (definición conceptual del **Dashboard V1**: mapa temporal / punto de entrada, con los días derivados del horario real y no de una semana fija). Resultado: un plan de saneamiento **por bloques, incremental y verificable**.

- **F4 — Saneamiento (ejecución controlada).** *Cerrada.* Ocho bloques, **un commit por bloque**:
  - `bf5098b` experimentos de prueba + FICHAS · `21662ae` MIDIs de prueba (`PRUEBAS/`) · `0da22d2` A1: repunta redirects de ADMIN/Portal → Workspace · `a91f434` `PC/index.html` (lanzador PC antiguo) · `f270b7b` código muerto del Portal (dock, `volverDashboard`, `wsTitulo`) · `6bbcbd5` Dashboard y calendario legacy del Portal · `9c2be51` shell móvil legacy · `0374729` `modulos.js`.
  - **Infraestructura:** rama **`gh-pages` eliminada** (local y remota); **default branch** de GitHub cambiada **`gh-pages → master`**; **GitHub Pages** sigue en **`master / (root)`**; `origin/HEAD → origin/master`.
  - **Qué se preservó / qué se retiró:** `?ctx&fecha` **preservado**, `?ctx`-solo **retirado**; **SRP congelado** (en `SRP/`) **preservado e intacto**, mientras que la vieja **UI móvil de captura SRP-adjacente** embebida en `MOVIL` + su **IndexedDB `SRP_VozDB`** fueron **retiradas**; `modulos.js` **retirado sin reemplazo** (no se creó un registro central ejecutable). En conjunto: **se retiró el legacy sin rescatarlo ni reemplazarlo**, conservando las arquitecturas y funcionalidades vigentes.

- **F5 — Auditoría Funcional Post-Saneamiento.** *Cerrada.* Dos rondas de comprobación funcional **en vivo** del ecosistema activo tras F4: el núcleo (Workspace/entrada/auth, Portal → Dashboard y Plan, MOVIL lienzo, redirect A1 ADMIN→Workspace, Repertorio) y, en la segunda ronda, **Pizarra, Libro, CAJÓN, Metalófono, ANALIZADOR y Lector**. **No se detectaron regresiones atribuibles a F4**; 0 referencias de código a lo retirado; sintaxis correcta. Se limpiaron los comentarios stale (`c5cf14c`, `fabe299`). Único hallazgo **postergado**: `eventos_uso` (el `INSERT` devuelve 401 → el logging no persiste; **no bloqueante, preexistente, no causado por F4**) — queda como pendiente técnico futuro, junto con la contradicción documental asociada. **Con F5 cerrada, las Fases 0–5 de la GRAN ETAPA quedan cerradas; la siguiente etapa es F6 — Preparación V1.**

---

*Nota: las fechas provienen de la documentación existente (CLAUDE.md previo, notas de trabajo y Git). Los hashes de F4 provienen del historial Git de esta etapa. El detalle fino por commit (más allá de los checkpoints de F4) no se reconstruye aquí a propósito.*
