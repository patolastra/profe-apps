// ═══════════════════════════════════════════════════════════════════════
// 😀 Panel grande de emojis (deuda IX, 2026-11-23)
// Grupos (los de la sala de clases primero), buscador en español y "usados últimamente" (en el equipo).
// Clic en un emoji → alElegir(emoji); el panel queda abierto para elegir varios. Esc o clic fuera lo cierra.
// Sin internet ni base de datos.
//
// Uso:
//   Emojis.abrir({ ancla: botón, alElegir: e => {…}, alCerrar: () => {…} })
//   Emojis.cerrar()
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    // Cada línea: emoji y sus palabras de búsqueda (separadas por espacio)
    const GRUPOS = [
        ['🎵', 'Música', `
🎵 nota musica melodia|🎶 notas musica cancion|🎼 partitura pentagrama|🎤 microfono cantar voz|🎧 audifonos escuchar|🎹 piano teclado|
🎸 guitarra|🪕 banjo charango|🎻 violin cuerdas|🎺 trompeta|🎷 saxofon|🪗 acordeon|🥁 tambor bateria ritmo|🪘 cajon tambor percusion|
🪇 maracas|🪈 flauta|📯 corneta|🔔 campana|🔕 silencio campana|🎙️ microfono radio grabar|📻 radio|🔊 volumen fuerte|🔉 volumen medio|
🔈 volumen bajo|🔇 silencio mudo|💃 bailar baile|🕺 bailar baile|🎭 teatro ensayo|🎬 video cine|🎞️ pelicula|📹 video camara|🎛️ mezcla perillas|🎚️ volumen deslizar`],
        ['😀', 'Caras', `
😀 feliz sonrisa|😃 feliz alegre|😄 feliz risa|😁 sonrisa dientes|😆 risa|😅 nervioso sudor|🤣 carcajada|😂 risa lagrimas|🙂 sonrisa|
🙃 al reves|😉 guino|😊 contento|😇 angel bueno|🥰 amor carino|😍 enamorado encanta|🤩 estrella asombro genial|😘 beso|😋 rico delicioso|
😛 lengua|😜 broma loco|🤪 loco|🤗 abrazo|🤭 ups secreto|🤫 silencio callar shh|🤔 pensar duda|🤐 boca cerrada callar|🤨 sospecha duda|
😐 serio neutral|😑 sin expresion|😶 sin palabras|😏 picaro|😒 aburrido|🙄 ojos aburrido|😬 incomodo|😌 tranquilo calma|😔 triste pensativo|
😪 sueno|😴 dormir sueno|😷 enfermo mascarilla|🤒 fiebre enfermo|🤕 herido|🤧 resfrio estornudo|🥵 calor|🥶 frio|😵 mareado|🤯 explota mente sorpresa|
🤠 vaquero|🥳 fiesta celebrar cumpleanos|😎 lentes genial cool|🤓 estudioso nerd|🧐 lupa observar|😕 confundido|😟 preocupado|🙁 triste|
😮 sorpresa|😯 asombro|😲 asombrado|😳 verguenza|🥺 por favor tierno|😦 susto|😨 miedo|😰 ansioso|😥 alivio triste|😢 llorar triste|
😭 llorar mucho|😱 grito miedo|😖 frustrado|😣 esfuerzo|😞 desilusion|😓 cansado|😩 agotado|😫 cansado|🥱 bostezo aburrido|😤 enojado bufido|
😡 enojado furioso|😠 enojado|🤬 garabato enojado|😈 travieso|👻 fantasma|💀 calavera|🤖 robot|👽 extraterrestre|🤡 payaso|💩 caca|
😺 gato feliz|😸 gato risa|😻 gato amor`],
        ['👍', 'Manos y gestos', `
👍 bien ok pulgar arriba|👎 mal pulgar abajo|👏 aplaudir aplausos palmas|🙌 celebrar manos arriba|👐 manos abiertas|🤲 manos|🙏 gracias por favor|
🤝 acuerdo saludo|✋ alto mano levantada|🤚 mano|🖐️ mano cinco|👋 hola chao saludo|🤙 llamame|💪 fuerza|✌️ paz dos|🤞 suerte dedos cruzados|
🤟 te quiero|🤘 rock|👌 perfecto ok|🤌 italiano|🤏 poquito|👈 izquierda|👉 derecha|👆 arriba|👇 abajo|☝️ uno atencion|✍️ escribir|
🫶 corazon manos carino|👂 oreja escuchar|👀 ojos mirar|👁️ ojo ver|👄 boca hablar|🦶 pie|🦵 pierna|🧠 cerebro pensar|🫀 corazon|🗣️ hablar decir|
👤 persona|👥 grupo personas|🧑‍🤝‍🧑 pareja amigos|👪 familia|🧒 nino|👦 nino|👧 nina|🧑 persona|👩 mujer|👨 hombre|🧓 abuelo|👵 abuela|👴 abuelo|
🧑‍🏫 profesor profesora|👩‍🏫 profesora|👨‍🏫 profesor|🧑‍🎓 estudiante|👩‍🎓 estudiante|👨‍🎓 estudiante|🧑‍🎤 cantante|👩‍🎤 cantante|👨‍🎤 cantante|
🙋 levantar mano pregunta|🙋‍♀️ levantar mano|🙋‍♂️ levantar mano|🙅 no prohibido|🙆 si ok|💁 informacion|🤷 no se|🤦 error facepalm|🧘 calma respirar|
🏃 correr|🚶 caminar|🧍 de pie|🧎 arrodillado|🪑 sentado silla`],
        ['✏️', 'Escuela', `
✏️ lapiz escribir|✒️ pluma|🖊️ lapiz pasta|🖍️ crayon pintar|🖌️ pincel pintar arte|📝 tarea anotar escribir|📒 cuaderno|📓 cuaderno|📔 cuaderno|
📕 libro rojo|📗 libro verde|📘 libro azul|📙 libro naranja|📚 libros estudiar biblioteca|📖 libro abierto leer|🔖 marcador|🏷️ etiqueta|📄 hoja|
📃 hoja|📑 hojas|📋 lista portapapeles|📌 chinche importante|📍 ubicacion|📎 clip|🖇️ clips|📏 regla|📐 escuadra|✂️ tijeras|🗂️ carpetas|📁 carpeta|
📂 carpeta abierta|🗃️ archivo|🗒️ notas|🗓️ calendario|📅 calendario fecha|📆 calendario|⏰ despertador hora|⏱️ cronometro tiempo|⏲️ temporizador|
⌛ reloj arena tiempo|⏳ tiempo espera|🕐 hora|🏫 escuela colegio|🎒 mochila|🧮 contar abaco|🔢 numeros|🔤 letras abc|🔡 abc|🅰️ a|💯 cien perfecto|
✅ listo correcto check|☑️ casilla|✔️ correcto|❌ error incorrecto|❎ no|❓ pregunta|❔ pregunta|❗ importante atencion|❕ atencion|‼️ muy importante|
⁉️ pregunta|💡 idea|🔍 buscar lupa|🔎 buscar|💻 computador|🖥️ pantalla computador|⌨️ teclado|🖱️ mouse|📱 celular|☎️ telefono|📞 llamar|📧 correo|
✉️ carta sobre mensaje|📨 mensaje|📢 anuncio altavoz|📣 megafono avisar|🔒 cerrado|🔓 abierto|🔑 llave|🏆 trofeo ganador|🥇 primero oro medalla|
🥈 segundo plata|🥉 tercero bronce|🏅 medalla|🎖️ medalla|⭐ estrella|🌟 estrella brillante|✨ brillo magia|🎓 graduacion|🧪 experimento ciencia|
🔬 microscopio|🔭 telescopio|🧲 iman|🌍 mundo tierra|🗺️ mapa|🧭 brujula`],
        ['🐶', 'Animales', `
🐶 perro|🐱 gato|🐭 raton|🐹 hamster|🐰 conejo|🦊 zorro|🐻 oso|🐼 panda|🐨 koala|🐯 tigre|🦁 leon|🐮 vaca|🐷 cerdo chancho|🐸 rana sapo|
🐵 mono|🙈 mono no ver|🙉 mono no oir|🙊 mono no hablar|🐔 gallina|🐧 pinguino|🐦 pajaro|🐤 pollito|🦆 pato|🦅 aguila condor|🦉 buho|🦇 murcielago|
🐺 lobo|🐴 caballo|🦄 unicornio|🐝 abeja|🐛 gusano|🦋 mariposa|🐌 caracol|🐞 chinita mariquita|🐜 hormiga|🕷️ arana|🐢 tortuga|🐍 serpiente|
🦎 lagartija|🦖 dinosaurio|🦕 dinosaurio|🐙 pulpo|🦑 calamar|🦀 cangrejo|🐠 pez|🐟 pez|🐬 delfin|🐳 ballena|🦈 tiburon|🐊 cocodrilo|🐘 elefante|
🦒 jirafa|🦓 cebra|🦘 canguro|🐪 camello|🦙 llama alpaca|🐑 oveja|🐐 cabra|🐓 gallo|🦜 loro|🦚 pavo real|🐿️ ardilla|🦔 erizo|🐾 huellas`],
        ['🌳', 'Naturaleza', `
🌞 sol|☀️ sol dia|🌤️ sol nubes|⛅ nublado|☁️ nube|🌧️ lluvia|⛈️ tormenta|🌩️ rayo|❄️ nieve frio|☃️ mono de nieve|🌈 arcoiris|🌙 luna noche|
🌛 luna|⭐ estrella|🌠 estrella fugaz|☄️ cometa|🌍 tierra planeta|🪐 planeta saturno|🌋 volcan|🏔️ montana cordillera|⛰️ cerro|🏖️ playa|🌊 ola mar|
💧 gota agua|🔥 fuego|🌪️ tornado|🌫️ niebla|🌱 planta brote|🌿 hoja|☘️ trebol|🍀 suerte trebol|🍃 hojas viento|🍂 otono hojas|🍁 hoja otono|🌵 cactus|
🌴 palmera|🌳 arbol|🌲 pino|🌸 flor|🌺 flor|🌻 girasol|🌹 rosa|🌷 tulipan|🌼 flor|💐 ramo flores|🍄 hongo|🪨 piedra|🌎 america`],
        ['🍎', 'Comida', `
🍎 manzana|🍐 pera|🍊 naranja|🍋 limon|🍌 platano|🍉 sandia|🍇 uva|🍓 frutilla|🫐 arandano|🍒 cereza|🍑 durazno|🥭 mango|🍍 pina|🥥 coco|
🥝 kiwi|🍅 tomate|🥑 palta|🥕 zanahoria|🌽 choclo|🥔 papa|🥦 brocoli|🥒 pepino|🍞 pan|🥐 croissant|🧀 queso|🥚 huevo|🍳 huevo frito|🥞 panqueques|
🌭 completo|🍔 hamburguesa|🍟 papas fritas|🍕 pizza|🌮 taco|🥪 sandwich|🍝 tallarines|🍜 sopa|🍚 arroz|🍣 sushi|🍦 helado|🍨 helado|🍩 donut|
🍪 galleta|🎂 torta cumpleanos|🍰 torta|🧁 cupcake|🍫 chocolate|🍬 dulce|🍭 chupete|🍿 cabritas|🥤 bebida|🧃 jugo|🥛 leche|☕ cafe|🍵 te|🍼 mamadera|
🍽️ comer almuerzo|🥄 cuchara|🍴 cubiertos`],
        ['🎉', 'Celebración', `
🎉 fiesta celebrar|🎊 confeti celebrar|🎈 globo|🎁 regalo|🎀 cinta|🎂 cumpleanos torta|🥳 fiesta|🪅 pinata|🎆 fuegos artificiales|🎇 bengala|
🧨 petardo|🎄 navidad arbol|🎅 viejito pascuero|🤶 mama noel|🎃 halloween calabaza|🎗️ cinta|🏳️ bandera|🇨🇱 chile bandera|🏁 meta|🚩 bandera|
❤️ corazon amor|🧡 corazon naranja|💛 corazon amarillo|💚 corazon verde|💙 corazon azul|💜 corazon morado|🖤 corazon negro|🤍 corazon blanco|
💖 corazon brillante|💕 corazones|💞 corazones|💗 corazon|💓 latido|💝 regalo corazon|💌 carta amor|🫂 abrazo|🌹 rosa`],
        ['⚽', 'Deportes y juegos', `
⚽ futbol pelota|🏀 basquetbol|🏐 voleibol|🏈 futbol americano|⚾ beisbol|🎾 tenis|🏓 ping pong|🏸 badminton|🥅 arco|⛳ golf|🏒 hockey|
🏊 nadar|🚴 bicicleta|🤸 gimnasia|🤾 balonmano|🧗 escalar|🏋️ pesas|🥋 karate|🛹 skate|⛸️ patinar|🎯 objetivo meta diana|🎮 videojuego|
🕹️ juego|🎲 dado azar sorteo|🧩 puzzle rompecabezas|♟️ ajedrez|🃏 carta|🎴 cartas|🪀 yoyo|🪁 volantin|🎨 arte pintura|🖼️ cuadro|🧸 peluche|
🚗 auto|🚌 bus|🚲 bicicleta|✈️ avion|🚀 cohete|⛵ barco|🚂 tren|🚦 semaforo|🏠 casa|🏥 hospital|🏛️ museo|⛪ iglesia|🏟️ estadio`],
        ['➡️', 'Flechas y símbolos', `
➡️ derecha flecha|⬅️ izquierda flecha|⬆️ arriba flecha|⬇️ abajo flecha|↗️ diagonal|↘️ diagonal|↙️ diagonal|↖️ diagonal|↔️ ida vuelta|↕️ arriba abajo|
🔄 repetir|🔁 repetir bucle|🔂 repetir una|🔃 girar|↩️ volver|↪️ seguir|⤴️ subir|⤵️ bajar|🔙 atras|🔜 pronto|🔝 arriba|▶️ play reproducir|⏸️ pausa|
⏹️ detener|⏺️ grabar|⏭️ siguiente|⏮️ anterior|⏩ adelantar|⏪ retroceder|🔀 mezclar|➕ mas sumar|➖ menos restar|✖️ por multiplicar|➗ dividir|
🟰 igual|♾️ infinito|💲 dinero|❤️‍🔥 pasion|🆗 ok|🆕 nuevo|🆒 cool|🆓 gratis|🆘 ayuda|⛔ prohibido|🚫 no prohibido|⚠️ cuidado advertencia|
🔴 rojo circulo|🟠 naranja|🟡 amarillo|🟢 verde|🔵 azul|🟣 morado|🟤 cafe|⚫ negro|⚪ blanco|🟥 cuadrado rojo|🟧 cuadrado naranja|🟨 cuadrado amarillo|
🟩 cuadrado verde|🟦 cuadrado azul|🟪 cuadrado morado|⬛ cuadrado negro|⬜ cuadrado blanco|🔺 triangulo|🔻 triangulo abajo|🔶 rombo|🔷 rombo azul|
1️⃣ uno|2️⃣ dos|3️⃣ tres|4️⃣ cuatro|5️⃣ cinco|6️⃣ seis|7️⃣ siete|8️⃣ ocho|9️⃣ nueve|🔟 diez|0️⃣ cero|#️⃣ numero|*️⃣ asterisco|©️ copyright|
♻️ reciclar|☮️ paz|☯️ yin yang|♈ aries|💤 dormir|💭 pensamiento|💬 dialogo hablar|🗯️ grito|💥 choque explosion|💫 mareo|💨 rapido viento`],
    ].map(([ico, nombre, txt]) => ({ ico, nombre, items: txt.replace(/\n/g, '').split('|').map(s => s.trim()).filter(Boolean)
        .map(s => { const i = s.indexOf(' '); return i < 0 ? { e: s, p: '' } : { e: s.slice(0, i), p: s.slice(i + 1) }; }) }));
    const norm = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

    const CLAVE = 'profe_emojis_usados';
    const usados = () => { try { return JSON.parse(localStorage.getItem(CLAVE) || '[]'); } catch (_) { return []; } };
    const usar = e => { try { localStorage.setItem(CLAVE, JSON.stringify([e, ...usados().filter(x => x !== e)].slice(0, 24))); } catch (_) {} };

    let caja = null, op = null, grupoSel = null;
    function css() {
        if (document.getElementById('emojis-css')) return;
        const s = document.createElement('style');
        s.id = 'emojis-css';
        s.textContent = `
#emojis { position: fixed; z-index: 9500; width: min(560px, calc(100vw - 16px)); height: min(460px, calc(100vh - 16px));
    display: flex; flex-direction: column; background: #fff; border: 1px solid #cbd5e1; border-radius: 12px;
    box-shadow: 0 18px 50px rgba(15,23,42,.25); font-family: system-ui, -apple-system, sans-serif; color: #1e293b; }
#emojis[hidden] { display: none; }
#emojis .em-cab { display: flex; gap: 6px; align-items: center; padding: 8px 8px 6px; }
#emojis .em-buscar { flex: 1; min-width: 0; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 10px; font: inherit; font-size: .95rem; outline: none; }
#emojis .em-buscar:focus { border-color: #3b82f6; }
#emojis .em-x { border: none; background: none; cursor: pointer; color: #64748b; font-size: 1rem; padding: 4px 8px; border-radius: 6px; }
#emojis .em-x:hover { background: #f1f5f9; }
#emojis .em-grupos { display: flex; gap: 2px; padding: 0 8px 6px; border-bottom: 1px solid #e2e8f0; overflow-x: auto; }
#emojis .em-grupos button { flex: 0 0 auto; border: none; background: none; cursor: pointer; font-size: 1.35rem; padding: 4px 6px; border-radius: 8px; opacity: .55; }
#emojis .em-grupos button:hover, #emojis .em-grupos button.on { background: #eff6ff; opacity: 1; }
#emojis .em-lista { flex: 1; overflow-y: auto; padding: 4px 8px 10px; }
#emojis .em-tit { font-size: .75rem; font-weight: 700; color: #64748b; margin: 8px 2px 4px; text-transform: uppercase; letter-spacing: .03em; }
#emojis .em-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(46px, 1fr)); gap: 2px; }
#emojis .em-grid button { border: none; background: none; cursor: pointer; font-size: 1.9rem; line-height: 1; height: 46px; border-radius: 8px;
    font-family: "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif; }
#emojis .em-grid button:hover { background: #eff6ff; transform: scale(1.12); }
#emojis .em-vacio { color: #94a3b8; font-size: .9rem; padding: 16px 4px; }
#emojis .em-pie { padding: 4px 10px 6px; font-size: .75rem; color: #94a3b8; min-height: 1.3em; border-top: 1px solid #f1f5f9; }`;
        document.head.appendChild(s);
    }
    function armar() {
        if (caja) return;
        css();
        caja = document.createElement('div');
        caja.id = 'emojis'; caja.hidden = true;
        caja.innerHTML = `<div class="em-cab"><input class="em-buscar" placeholder="Buscar: guitarra, feliz, estrella…" autocomplete="off">
            <button class="em-x" title="Cerrar (Esc)">✕</button></div>
            <div class="em-grupos">${GRUPOS.map((g, i) => `<button data-g="${i}" title="${g.nombre}">${g.ico}</button>`).join('')}</div>
            <div class="em-lista"></div><div class="em-pie"></div>`;
        document.body.appendChild(caja);
        const buscar = caja.querySelector('.em-buscar'), lista = caja.querySelector('.em-lista'), pie = caja.querySelector('.em-pie');
        buscar.addEventListener('input', () => pintar());
        buscar.addEventListener('keydown', e => {
            if (e.key === 'Enter') { const b = lista.querySelector('.em-grid button'); if (b) { e.preventDefault(); elegir(b.dataset.e); } }
        });
        caja.querySelector('.em-x').onclick = () => cerrar();
        caja.querySelector('.em-grupos').addEventListener('click', e => {
            const b = e.target.closest('[data-g]'); if (!b) return;
            buscar.value = '';
            pintar();
            lista.querySelector(`.em-tit[data-g="${b.dataset.g}"]`)?.scrollIntoView({ block: 'start' });
        });
        lista.addEventListener('mousedown', e => { if (e.target.closest('.em-grid button')) e.preventDefault(); });   // no le quita el foco al buscador
        lista.addEventListener('click', e => { const b = e.target.closest('.em-grid button'); if (b) elegir(b.dataset.e); });
        lista.addEventListener('mouseover', e => {
            const b = e.target.closest('.em-grid button');
            pie.textContent = b ? `${b.dataset.e}  ${b.title}` : '';
        });
        lista.addEventListener('scroll', () => {   // marca el grupo que se está mirando
            const tits = [...lista.querySelectorAll('.em-tit[data-g]')];
            const top = lista.getBoundingClientRect().top + 10;
            let g = null;
            tits.forEach(t => { if (t.getBoundingClientRect().top <= top) g = t.dataset.g; });
            if (g === null && tits.length) g = tits[0].dataset.g;
            if (g !== grupoSel) { grupoSel = g; caja.querySelectorAll('.em-grupos button').forEach(b => b.classList.toggle('on', b.dataset.g === g)); }
        });
        document.addEventListener('keydown', e => { if (e.key === 'Escape' && caja && !caja.hidden) { e.preventDefault(); cerrar(); } }, true);
        document.addEventListener('mousedown', e => {
            if (!caja || caja.hidden || caja.contains(e.target) || (op?.ancla && op.ancla.contains(e.target))) return;
            cerrar();
        }, true);
    }
    const boton = x => `<button data-e="${x.e}" title="${x.p}">${x.e}</button>`;
    function pintar() {
        const lista = caja.querySelector('.em-lista');
        const q = norm(caja.querySelector('.em-buscar').value).trim();
        if (q) {
            const palabras = q.split(/\s+/);
            const vistos = new Set(), res = [];
            GRUPOS.forEach(g => g.items.forEach(x => {
                if (vistos.has(x.e)) return;
                const t = norm(x.p + ' ' + g.nombre).split(/\s+/);
                if (palabras.every(p => t.some(w => w.startsWith(p)))) { vistos.add(x.e); res.push(x); }
            }));
            lista.innerHTML = res.length ? `<div class="em-grid">${res.map(boton).join('')}</div>` : '<div class="em-vacio">No encontré ese emoji. Prueba con otra palabra.</div>';
            return;
        }
        const u = usados();
        const busca = e => { for (const g of GRUPOS) { const x = g.items.find(y => y.e === e); if (x) return x; } return { e, p: '' }; };
        lista.innerHTML = (u.length ? `<div class="em-tit">Usados últimamente</div><div class="em-grid">${u.map(e => boton(busca(e))).join('')}</div>` : '')
            + GRUPOS.map((g, i) => `<div class="em-tit" data-g="${i}">${g.ico} ${g.nombre}</div><div class="em-grid">${g.items.map(boton).join('')}</div>`).join('');
    }
    function elegir(e) {
        usar(e);
        try { op?.alElegir?.(e); } catch (_) {}
    }
    function ubicar() {
        const r = op?.ancla?.getBoundingClientRect();
        const w = caja.offsetWidth, h = caja.offsetHeight;
        let x = r ? r.right - w : (innerWidth - w) / 2, y = r ? r.bottom + 6 : (innerHeight - h) / 2;
        if (y + h > innerHeight - 8) y = r ? Math.max(8, r.top - h - 6) : 8;
        caja.style.left = Math.max(8, Math.min(x, innerWidth - w - 8)) + 'px';
        caja.style.top = Math.max(8, y) + 'px';
    }
    function abrir(opciones) {
        armar();
        op = opciones || {};
        caja.querySelector('.em-buscar').value = '';
        caja.querySelector('.em-pie').textContent = '';
        caja.hidden = false;
        pintar();
        caja.querySelector('.em-lista').scrollTop = 0;
        grupoSel = null;
        caja.querySelector('.em-lista').dispatchEvent(new Event('scroll'));
        ubicar();
        caja.querySelector('.em-buscar').focus();
    }
    function cerrar() {
        if (!caja || caja.hidden) return;
        caja.hidden = true;
        const o = op; op = null;
        try { o?.alCerrar?.(); } catch (_) {}
    }
    const abierto = () => !!(caja && !caja.hidden);
    window.Emojis = { abrir, cerrar, abierto };
})();
