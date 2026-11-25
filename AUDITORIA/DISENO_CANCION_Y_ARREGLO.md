# Diseño: las piezas de una canción y el Arreglo

> **Qué es.** El orden y la jerarquía de todo lo que forma una canción en la Biblioteca (Ficha, audios, letra,
> versiones, melodías, ritmos, armonías, tablaturas, arreglos) y cómo el Editor de arreglos los junta.
> Conversado y aprobado por el PO el 2026-11-24 (deuda JO). Es **diseño**: no cambia la app por sí solo; cada
> cambio en la app sigue el ciclo del desarrollo paralelo (ficha → aprobación → implementación → prueba).
>
> Etiquetas: **DECISIÓN** (aprobado por el PO) · **PROPUESTA** (falta aprobar) · **PENDIENTE** (sin resolver).

---

## 1. Por qué

Las piezas fueron naciendo de a una y hoy se pisan:

- Tres cosas dicen "dónde empieza cada parte": las secciones de la Ficha, las 🧩 partes propias de la melodía y
  las secuencias del arreglo.
- La ✂ versión se elige por separado en el Entrenador, Cantar, el Arreglo y el Plan.
- Los acordes viven solo dentro del arreglo: ni una tablatura ni un cifrado de la misma canción los aprovechan.
- El arreglo se llama "de piano" aunque ya tiene cajón y metalófono, y el editor está armado alrededor del piano.
- El arreglo guarda **copias** de la melodía y los ritmos (se ponen al día solas, regla 12, pero son dos cosas que
  cuidar).

---

## 2. La jerarquía (DECISIÓN)

```
🎵 CANCIÓN  (nombre, artista, género, estilo)              ← lo único obligatorio
│
├─ 1. LA CANCIÓN TAL COMO ES        (todo opcional: cada cosa aparece cuando se agrega)
│    ├─ 📋 Ficha: tonalidad · cifra · secciones · tempo        (puede estar vacía)
│    ├─ 🎤 Audios: Melodía (casi siempre) · Karaoke (a veces) · 2ª voz (pocas) · o ninguno
│    └─ 📝 Letra: sincronizada · sin sincronizar · desincronizada (⚠) · o sin letra
│
├─ 2. VERSIONES ✂   Completa (siempre) + recortes (qué secciones o tramos suenan)
│
├─ 3. MATERIALES    ♬ Melodías · 🎹 Armonías · 🪘 Ritmos · 🎸 Tablaturas
│         └─ cada uno con sus propias PARTES (pedagógicas)
│
├─ 4. ARREGLOS 🎶   la canción completa o una versión + qué toca cada instrumento en cada sección
│
└─ 5. LO QUE SE USA   estudiantes (Cantar, Piano, Metalófono, Cajón, Lector) · 🎭 Ensayo · Plan · Pizarra
```

**Regla general:** cada nivel usa lo de arriba, nunca al revés.

### Nivel 1 — La canción tal como es

- **Nada se exige** salvo el nombre. Hay canciones sin tonalidad, sin cifra, sin secciones y hasta sin audio.
  *(DECISIÓN)*
- **La Ficha existe siempre, aunque esté vacía**, y nunca se pide llenarla. Lo que falta simplemente no se ofrece
  (sin secciones no aparece "saltar al Coro"). Se llena **sola mientras se trabaja**: si el Editor de Melodías
  necesita la tonalidad, la pregunta ahí y la guarda en la Ficha. *(DECISIÓN)*
- **Audios:** Melodía es lo habitual; Karaoke a veces; 2ª voz pocas veces; puede no haber ninguno (la Ficha ya
  toca la melodía como grabación, deuda IA). *(HECHO)*
- **Letra:** una canción sin letra (una melodía instrumental) **sigue siendo una canción**; no hay tipo aparte.
  *(DECISIÓN)* La letra puede estar sincronizada o no; falta poder marcarla **desincronizada** (Notion: "Marcar una
  canción con letra y audio desincronizados"). *(PENDIENTE)*

### Nivel 2 — Versiones

La ✂ adaptación de la Ficha (deuda GK): la Completa siempre existe; los recortes omiten secciones o tramos.
*(DECISIÓN, ya HECHO en la Ficha)*

### Nivel 3 — Materiales

- Son las ideas musicales de la canción: **♬ Melodías**, **🎹 Armonías** (acordes por sección), **🪘 Ritmos**,
  **🎸 Tablaturas**. *(DECISIÓN)*
- **Todo material es de la canción** y vive en su ficha, aunque se cree desde dentro de un arreglo (queda con la
  marca "nació en el arreglo X"). *(DECISIÓN)*
- **Un material es neutro:** dice *qué* suena (la melodía en grados, la armonía en acordes, el ritmo en golpes), no
  *cómo* lo toca un instrumento. *(DECISIÓN)*
- **Variantes:** un arreglo más fácil o más difícil no copia por dentro: se crea una **variante** ("Melodía del
  coro · fácil"), que es un material nuevo de la canción, sabe de cuál viene y el arreglo la elige.
  *(DECISIÓN de dirección; el PO no descarta que en el futuro el arreglo copie — se revisará al implementarlo)*

### Secciones ≠ Partes *(DECISIÓN)*

| | **Secciones** | **Partes** |
|---|---|---|
| De quién | la **canción** | un **material** |
| Ejemplos | Intro, Estrofa, Coro, Puente | "frase 1", "la subida", "el puente difícil" |
| Dónde viven | la Ficha | dentro del material (hoy: 🧩 partes propias de la melodía, deuda IL) |
| Para qué | la forma de la canción, versiones, arreglo | enseñar y practicar por trozos |

Conviven y nunca se mezclan. Una parte **puede** decir "estoy dentro del Coro" si sirve, pero no está obligada.
En toda pantalla se usan siempre estas dos palabras con este sentido.

### Nivel 4 — Arreglos

- Un arreglo nace de la canción **completa** o de **una versión**, y la lleva consigo. *(DECISIÓN)*
- **Elige materiales, no los guarda** (ver §3). *(DECISIÓN)*

### Nivel 5 — Lo que se usa

Estudiantes (cada uno recibe **su fila** del arreglo o un material suelto), 🎭 Ensayo (el arreglo entero), Plan y
Pizarra. *(DECISIÓN)*

### Dónde se elige la versión *(PROPUESTA, conversada; falta cerrar el detalle)*

- Con **arreglo**: manda la versión del arreglo; quien lo use (estudiantes, Ensayo, Plan) toca esa.
- **Canción sola**, sin arreglo: se elige donde se usa y queda guardada ahí — en la actividad del Plan, por canción
  en el Entrenador (como hoy) y en el link de Cantar (`&v=`, como hoy).

---

## 3. El Editor de arreglos (DECISIÓN)

### El principio

> **El material dice *qué* suena. La fila del instrumento dice *cómo* lo toca ese instrumento.**

Arreglar es, sobre todo, la segunda parte: la digitación, el registro, las posiciones y la técnica de **cada**
instrumento. Esas decisiones son propias del instrumento y viven en su fila del arreglo.

### El mapa: instrumentos × secciones

```
🎶 Arreglo "6° básico"              ✂ Versión corta · 🎤 con grabación · Tono: Sol

                 Intro      Estrofa 1    Coro         Estrofa 2    Coro
🎤 Voces         —          letra        letra+2ª     letra        letra+2ª
🎵 Metalófono    —          —            ♬ Coro       —            ♬ Coro
🎹 Piano         🎹 Arm.    🎹 Arm.      🎹 Arm.+♬    🎹 Arm.      🎹 Arm.+♬
🪘 Cajón         🪘 Festejo 🪘 Festejo   🪘 Festejo B 🪘 Festejo   🪘 Festejo B
🎸 Guitarra      🎹 Arm.    🎹 Arm.      ♬ Coro       🎹 Arm.      ♬ Coro
   ＋ Instrumento
```

- **Arriba (la base, común a todos):** versión, grabación, tono y tempo (de la Ficha).
- **Columnas:** las secciones de la versión, en su orden real. Sin secciones en la Ficha: una sola columna, "Toda
  la canción".
- **Filas:** los instrumentos que se agregan. **Ninguno es el principal.**
- **Cada casilla:** uno o más materiales (o partes de un material) o silencio. Si el material no existe,
  **＋ Crear** abre su editor y queda guardado en la canción.
- **Clic en la fila:** abre el detalle de ese instrumento.

### Cada fila, en dos capas

1. **Qué toca** en cada sección: melodía, armonía, ritmo, bajo (una o varias a la vez) o silencio.
2. **Cómo lo toca:** el detalle propio del instrumento.

| Instrumento | Qué puede tocar | Cómo (su detalle) | El estudiante lo ve en |
|---|---|---|---|
| 🎹 Piano | armonía, melodía, bajo | acordes con dedos, octavas por mano, ritmo del acompañamiento | Piano (`p/?r=`) |
| 🎸 Guitarra · 🪕 Ukelele · 🎸 Bajo | melodía **y/o** armonía | digitación en el diapasón (cuerda y traste), posiciones de acordes, rasgueo o punteo | Lector (tablatura) |
| 🎵 Metalófono | melodía | octava que cabe en las placas, desde qué compás | Metalófono (`m/?r=`) |
| 🪘 Cajón | ritmo | grave / agudo, mano D / I, pasajes para practicar | Cajón (`c/?r=`) |
| 🎤 Voces | letra, 2ª voz | quién canta qué | Cantar |

En las cuerdas, la misma melodía de la canción se vuelve tablatura **en la fila de cada instrumento**, cada uno con
su digitación; la armonía, con sus propias posiciones.

### Lo de hoy, en el diseño nuevo

| Hoy (Editor de arreglos) | Pasa a ser |
|---|---|
| ① Base | La base, arriba: versión, grabación, tono, tempo |
| ② Secuencias armónicas | Material **🎹 Armonía** de la canción; el arreglo la elige por sección |
| ③ Estructura | Las columnas: salen de la versión elegida |
| ④ Acordes (notas y dedos) | Detalle de la fila Piano (cada instrumento tiene el suyo) |
| ⑤ Grabación | La base, arriba |
| Pestañas 🪘 Cajón / 🎵 Metalófono | Filas del mapa, al mismo nivel que el piano |
| Melodía y ritmos **copiados** | Elegidos (apuntan al material); para cambiarlos, una variante |

### Nombre y lugar *(DECISIÓN)*

- Se llama **🎶 Arreglo**, nunca "Arreglo de piano", y va en su grupo propio de la ficha de la canción (como hoy,
  deuda IO).
- Se nombra por su propósito o sus instrumentos ("Arreglo 6° básico", "Piano + Cajón + Metalófono").

---

## 4. Orden posible para llevarlo a la app *(PROPUESTA — no aprobada)*

Cada etapa con su ficha, su prueba y su checkpoint; los arreglos y links que ya existen siguen funcionando en todas.

1. **Nombres:** "🎶 Arreglo" en todas partes (hoy quedan 5 "Arreglo de piano"); "Secciones" y "Partes" con su
   sentido fijo en Ficha, Editor de Melodías, Metalófono y Arreglo. Bajo riesgo.
2. **Ficha siempre presente y que se llena sola** (sin pedir nada).
3. **🎹 Armonía como material de la canción:** las secuencias armónicas salen del arreglo y el arreglo las elige.
4. **El mapa instrumentos × secciones** como corazón del editor, con las filas de hoy (Piano, Cajón, Metalófono).
5. **El arreglo apunta en vez de copiar**, y aparecen las **variantes** (📌 Fijar sigue existiendo).
6. **Filas nuevas:** cuerdas (guitarra, ukelele, bajo → tablatura en el Lector) y voces.

**Avance:** etapa 1 HECHA (JP, y JQ/JR íconos) · etapa 2 HECHA (JS; el tempo desde el arreglo queda pendiente:
la Ficha solo tiene tempo con el pulso marcado) · etapa 3 HECHA (JT: 🎶 Armonía; por ahora se escribe en el arreglo). · etapa 4 HECHA (JU: pestaña Mapa, solo para mirar; cada instrumento
se trabaja en su pantalla) · etapa 5 HECHA (JV: las copias quedan como respaldo; ＋ Variante de melodía y de ritmo).

## 5. Pendientes

- ~~Un espacio propio para escribir y editar la 🎶 Armonía rápido~~ HECHO (JW, `ARMONIA/`); sigue el ritmo por compás.

- Cerrar el detalle de dónde se elige la versión (§2, nivel 5).
- Si en el futuro el arreglo debe poder **copiar** en vez de usar variantes.
- Marca de letra **desincronizada** (Notion).
- Revisar el orden de §4 con el PO antes de empezar.
