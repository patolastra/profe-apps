# CLAUDE.md — Cuaderno MIDI

## Qué es

Herramienta de **captura rápida de ideas musicales** del ecosistema PROFE. La visión completa está en `Prompt — Cuaderno MIDI.txt` (teclado visual, melodías, piano roll, captura rítmica) — **esa visión es v2, todavía no construida**.

## v1 — Editor de cifrado americano (IMPLEMENTADO 2026-06-12)

**La v1 NO vive en esta carpeta.** Es un **modo de autoría dentro del Lector de Tablaturas**: `tabs/index.html`, sección "CUADERNO MIDI — MODO CIFRADO" (buscar `cifradoMode`).

### Qué hace
Crear rápido el **cifrado armónico** de una canción (acordes por compás + secciones) sobre un audio + tempomap MIDI, sin DAW. El cifrado es una **fuente maestra en notación americana** (traducible a latino con el botón `C→Do` del Lector), agnóstica de instrumento — de ella se podrán extraer tabs para guitarra/ukelele/bajo (v2).

### Cómo se usa
- **Ctrl+Shift+C** en el Lector → modal de setup, o desde REPERTORIO con el botón 🎼 de una canción (deep-link `?cifrado=1&cancion=<id>`).
- Entrada: canción del Repertorio (audio + tempomap si existe) **o** archivos locales (audio + `.mid` opcional; sin `.mid` usa BPM fijo = sync `grid`).
- Edición: clic o ←/→ selecciona compás; chips raíz+alteración+calidad (o texto libre `Am7`) + Enter asigna y avanza; chips de beat para 2+ acordes por compás; 📑 marca secciones (doble barra automática en el compás anterior); ┆ subsección = barra discontinua manual; Supr borra; Espacio reproduce el audio.
- Sidebar izquierda: estructura en vivo (secciones y subsecciones clicables).
- **Autosave**: borrador en `localStorage` (`cif_draft_<cancionId|local>`), se ofrece restaurar al reabrir.

### Formato de salida
**MXL real** (MusicXML empaquetado con JSZip): `<harmony>` por acorde (con offset de beat), `<rest>` para las duraciones, `<rehearsal>` para secciones, `<barline>` light-light (cierre de sección) y dashed (subsección). El Lector lo abre nativo gracias al **render solo-armonía** (`cifradoEvents` en `parseXML` → `buildChordEvents` sin notas con traste).

### Guardado
- Con canción vinculada → Storage `repertorio-assets/cifrado/<id>.mxl` + fila en `repertorio_assets` con `tipo='cifrado'`, `instrumento='cifrado'`, `tab_sync` (tempomap + secciones extraídas).
- Sin canción → descarga local del `.mxl`.
- Los assets `tipo='cifrado'` aparecen en REPERTORIO (ícono 🎼 en `TIPOS_ASSET`) y en la biblioteca del panel del Lector (queries `tipo=in.(tab,cifrado)`).

### Vocabulario de acordes (v1)
Raíz A–G + ♯/♭ + calidad: `m, 7, m7, maj7, 5 (power chord), sus2, sus4, dim, aug, add9, m7b5` + texto libre. Normalización y descripción en `procesarLabel`/`describirAcorde` del Lector.

## Pendiente (v2)
- Extracción de tab específica por instrumento (guitarra/ukelele/bajo) desde el cifrado, usando `CHORD_DB` del Lector.
- La visión melódica del spec original (teclado, piano roll, ritmo por tap).
- Navegación vertical tipo "página" en el Lector.
