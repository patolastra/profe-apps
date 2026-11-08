---
description: Guarda todo lo necesario en la memoria persistente para seguir en una ventana de contexto nueva
---

Relevo de contexto: Pato va a cambiar de ventana de contexto. Deja guardado **todo lo que una sesión nueva necesita para seguir sin preguntar**. No preguntes nada al usuario: deduce todo de esta conversación, de git y de los documentos. Hazlo en este orden:

1. **Trabajo sin guardar** — `git status --short` y `git log origin/master..HEAD --oneline`.
   - Archivos del proyecto modificados por esta sesión y sin commit: commit con mensaje en español (sin push). No incluyas `.claude/launch.json` ni `MATERIAL CLASE/` (quedan fuera a propósito).
   - Commits sin subir: no los subas; anótalos en el punto 3 como "falta subir".

2. **Documentos del repo** (son la memoria permanente del proyecto, CLAUDE.md §11):
   - `AUDITORIA/DESARROLLO_PARALELO.md`: cada desarrollo tocado en esta sesión tiene su ficha al día (lo hecho, la prueba, lo que falta, decisiones del PO con fecha). Corrige el estado del título (EN CURSO / HECHA / falta probar).
   - `CLAUDE.md`: solo si cambió algo estructural (módulo nuevo, contrato, regla, decisión del PO).
   - Si cambiaste documentos, commit aparte (sin push).

3. **Memoria persistente** en `C:\Users\Pato\.claude\projects\C--Users-Pato-Desktop-PROFE-APPS-BY-ME\memory\`:
   - Reescribe **`proxima_sesion.md`** (no lo alargues: reemplaza lo viejo que ya no sirve) con:
     - fecha y último commit subido (`git log -1 --oneline origin/master`) y si quedó algo sin subir;
     - **qué se hizo** en esta sesión: una línea por desarrollo, con su deuda (letras) y hash;
     - **en qué estábamos justo ahora**: la tarea a medio camino, el último pedido de Pato y lo que se le preguntó o espera respuesta;
     - **siguientes pasos** y lo que **falta probar** (por Pato en clase, en el celular, etc.);
     - **ojos**: trampas o hallazgos de esta sesión que una sesión nueva repetiría (p. ej. algo que rompe, una regla de Supabase, un navegador).
     - Actualiza su `description` del frontmatter con un resumen de una línea.
   - Por cada cosa **durable** aprendida en esta sesión (preferencia o corrección de Pato, cómo trabaja, un hecho del entorno), crea o actualiza su archivo de memoria (un hecho por archivo, con frontmatter) y su línea en `MEMORY.md`. No dupliques lo que ya está en el repo ni en otra memoria: actualiza la existente.
   - Si `MEMORY.md` pasa de ~17 KB, acórtalo (una línea corta por entrada).

4. **Reporta** a Pato en 4 líneas como máximo, en humano: qué quedó guardado, qué falta subir (si hay), y la frase para empezar la ventana nueva: **"Escribe /contexto en la ventana nueva"**.
