Protocolo de cierre de sesión de trabajo. Ejecutar en este orden:

1. **Preguntar al usuario** qué quedó pendiente para la próxima sesión (si no lo dijo ya en la conversación).

2. **Git commit** — revisar `git status` y `git diff`, luego hacer commit de todo el trabajo de la sesión con un mensaje descriptivo en español. NO hacer push.

3. **Actualizar memoria** — actualizar los archivos relevantes en `C:\Users\Pato\.claude\projects\C--Users-Pato-Desktop-PROFE-APPS-BY-ME\memory\`:
   - `proxima_sesion.md` — qué se completó hoy, qué queda pendiente para la próxima sesión
   - `project_ecosystem.md` — si cambió el estado de alguna fase (ej: Pendiente → En prototipo → Completada)
   - Otros archivos solo si hubo cambios relevantes en esa área

4. **Actualizar CLAUDE.md** — SOLO si hubo un cambio estructural: nueva fase completada, decisión arquitectural nueva, módulo nuevo definido. No actualizar por cambios menores de código.

5. **Reportar** al usuario un resumen de 3 líneas: qué se hizo hoy, qué quedó en git, qué sigue.
