// ═══════════════════════════════════════════════════════════════════════
// Pendientes — una sola lista de pendientes en todo el sistema (deudas BB y BC, 2026-10-12)
// La usan el Dashboard (cursos + HOY), "Pendientes" del Plan, "Pendientes" de la Bitácora
// y Cursos. Se ve y funciona igual en todos lados: activos arriba, "Completados" abajo en
// gris y cursiva (se dejan de ver 2 semanas después de completados); agregar, editar,
// marcar y borrar; ☀️ = a la lista HOY (cada día parte vacía); subpendientes de un nivel,
// plegables; desde 3 semanas arrastrado: "Sigue" / "Archivar".
// Al instante: entre pestañas del mismo computador (BroadcastChannel) y entre
// equipos (Supabase Realtime, supabase/pendientes_realtime.sql).
// Estilos en comun/pendientes.css. Tabla `pendientes`, categoria 'tarea_proxima'.
//
// Uso:
//   Pendientes.conectar(sb)
//   await Pendientes.cargar(sb => sb.from('pendientes').select(Pendientes.COLS).eq(...))
//   const l = Pendientes.lista(caja, { filtro, alta, mostrarClase, mostrarCurso, botonAgregar,
//                                      vacio, alCambiar, todosCompletados, completadosAbiertos,
//                                      sugerencias (filas con Aceptar / Rechazar para Hoy),
//                                      tactil (celular: el texto se edita al tocarlo),
//                                      elegirCurso ({ cursos }: ＋ pregunta el curso; tocar el curso lo cambia),
//                                      marcaHoy (marca ☀️ en los que están en Hoy; para el celular,
//                                      donde no hay botón ☀️ a la vista) })
//   l.agregar() · l.repintar()
//   Pendientes.crear({ contexto_id, sesion_id, fecha, texto, hoy })
//   Pendientes.proximaClase(contexto_id, { despuesDe, desde })   → destino { contexto_id, sesion_id, fecha }
//     sin opciones: la próxima clase desde hoy (hoy incluida). despuesDe: la clase siguiente a esa fecha
//     (un texto de la bitácora de esa clase); desde: desde esa fecha (una nota). Nunca una clase ya pasada.
//   Pendientes.fechaCorta(iso)   → "mar 20/10"
//   Pendientes.desdeTexto(texto, { cid, sesionId, general, despuesDe | desde })   → { ok, aviso } (editor de bloques, deuda DE)
//   Comandos al comienzo de un texto: /bug · /mejora (🐞 Mejoras) · /msj o /mensaje destinatario: mensaje (✉️ Mensajes)
//   Pendientes.guardarTodo()   (antes de cerrar una ventana)
// ═══════════════════════════════════════════════════════════════════════
(function () {
    'use strict';
    const CAT = 'tarea_proxima';
    const COLS = 'id, contexto_id, sesion_id, categoria, texto, estado, semanas_pendiente, hoy, completado_en, padre_id, created_at, sesiones(fecha)';
    const DIAS_VISIBLE_COMP = 14;     // completados: se dejan de ver a las 2 semanas
    const SEM_ARRASTRE = 3;           // desde 3 semanas: "Sigue" / "Archivar"

    let sb = null;
    const filas  = new Map();     // id → pendiente { …, fecha (de su clase) }
    const fechas = new Map();     // sesion_id → fecha
    const listas = new Set();
    const timers = {};            // guardado del texto, por id
    const canal  = 'BroadcastChannel' in window ? new BroadcastChannel('profe-pendientes') : null;

    const hoyISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
    let plegados;
    try { plegados = new Set(JSON.parse(localStorage.getItem('profe_pend_plegados') || '[]')); } catch (_) { plegados = new Set(); }
    const guardarPlegados = () => { try { localStorage.setItem('profe_pend_plegados', JSON.stringify([...plegados])); } catch (_) {} };

    // ── Datos ───────────────────────────────────────────────────────────
    // conectar(sb, { sinSenal: true }) — celular: los cambios pasan por una cola guardada en
    // el equipo (se suben al volver la señal) y la última lista queda copiada para abrir sin señal.
    let conCola = false;
    const COLA_KEY = 'profe_pend_cola', COPIA_KEY = 'profe_pend_copia';
    const leerJSON = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } };
    const escribirJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
    function conectar(cliente, op = {}) {
        if (sb) return;
        sb = cliente;
        conCola = !!op.sinSenal;
        if (conCola) {
            window.addEventListener('online', subirCola);
            setInterval(subirCola, 20000);
        }
        try {
            sb.channel('profe-pendientes')
              .on('postgres_changes', { event: '*', schema: 'public', table: 'pendientes' }, pl => {
                  if (pl.eventType === 'DELETE') { if (pl.old?.id) quitarLocal(pl.old.id); return; }
                  if (pl.new) { if (pl.new.categoria === CAT) ponerLocal(pl.new); else if (filas.has(pl.new.id)) quitarLocal(pl.new.id); }
              })
              .subscribe();
        } catch (_) {}
    }
    if (canal) canal.onmessage = e => {
        const m = e.data || {};
        if (m.tipo === 'poner' && m.p) ponerLocal(m.p);
        if (m.tipo === 'quitar' && m.id) quitarLocal(m.id);
    };
    const avisar = m => { try { canal?.postMessage(m); } catch (_) {} };

    function ponerLocal(p, silencioso) {
        const n = { ...(filas.get(p.id) || {}), ...p };
        if (p.sesiones) n.fecha = p.sesiones.fecha;
        delete n.sesiones;
        if (n.sesion_id && fechas.has(n.sesion_id) && (!p.sesiones || !n.fecha)) n.fecha = fechas.get(n.sesion_id);
        if (!n.sesion_id) n.fecha = null;
        if (n.fecha && n.sesion_id) fechas.set(n.sesion_id, n.fecha);
        if (n.sesion_id && !n.fecha) pedirFecha(n.sesion_id);
        filas.set(p.id, n);
        if (!silencioso) repintarTodo();
        return n;
    }
    function quitarLocal(id) {
        if (!filas.delete(id)) return;
        filas.forEach((p, k) => { if (p.padre_id === id) filas.delete(k); });   // el padre se lleva a sus hijos
        repintarTodo();
    }
    const pidiendo = new Set();
    async function pedirFecha(sid) {
        if (pidiendo.has(sid) || !sb || !navigator.onLine) return;
        pidiendo.add(sid);
        const { data } = await sb.from('sesiones').select('fecha').eq('id', sid).maybeSingle();
        if (data?.fecha) {
            fechas.set(sid, data.fecha);
            filas.forEach(p => { if (p.sesion_id === sid) p.fecha = data.fecha; });
            repintarTodo();
        }
    }

    async function cargar(consulta) {
        let r;
        try { r = await consulta(sb); } catch (e) { r = { error: e }; }
        if (r.error) return { error: r.error };
        (r.data || []).forEach(p => ponerLocal(p, true));
        if (conCola) aplicarCola();
        repintarTodo();
        return { data: r.data };
    }

    // ── Cola (modo sin señal) ───────────────────────────────────────────
    // Operaciones en orden: { tipo: 'crear', fila, resolver } · { tipo: 'cambiar', id, cambios } · { tipo: 'borrar', id }
    const COLS_FILA = ['id', 'contexto_id', 'sesion_id', 'categoria', 'texto', 'estado', 'semanas_pendiente', 'hoy', 'completado_en', 'padre_id', 'created_at'];
    const soloFila = p => Object.fromEntries(COLS_FILA.filter(k => k in p).map(k => [k, p[k]]));
    function guardarCopia() {
        if (!conCola) return;
        escribirJSON(COPIA_KEY, { filas: [...filas.values()], fechas: [...fechas] });
    }
    // Abre la última lista guardada en este equipo (sin señal).
    function restaurarCopia() {
        const c = leerJSON(COPIA_KEY, null);
        if (!c) return false;
        (c.fechas || []).forEach(([k, v]) => fechas.set(k, v));
        (c.filas || []).forEach(p => ponerLocal(p, true));
        aplicarCola();
        repintarTodo();
        return true;
    }
    function encolar(op) {
        const cola = leerJSON(COLA_KEY, []);
        // varios cambios seguidos del mismo pendiente se juntan en uno
        const ult = cola[cola.length - 1];
        if (op.tipo === 'cambiar' && ult && ult.tipo === 'cambiar' && ult.id === op.id) Object.assign(ult.cambios, op.cambios);
        else cola.push(op);
        escribirJSON(COLA_KEY, cola);
        guardarCopia();
        pintarCola();
        subirCola();
    }
    // Lo que aún no sube manda sobre lo que trae internet.
    function aplicarCola() {
        leerJSON(COLA_KEY, []).forEach(op => {
            if (op.tipo === 'crear') ponerLocal(op.fila, true);
            else if (op.tipo === 'cambiar' && filas.has(op.id)) Object.assign(filas.get(op.id), op.cambios);
            else if (op.tipo === 'borrar') { filas.delete(op.id); filas.forEach((p, k) => { if (p.padre_id === op.id) filas.delete(k); }); }
        });
    }
    const esDeRed = e => !navigator.onLine || /fetch|network|timeout|load failed/i.test(String((e && e.message) || e));
    let subiendo = null;
    function subirCola() {
        if (subiendo || !sb || !navigator.onLine) return subiendo;
        subiendo = (async () => {
            for (;;) {
                const cola = leerJSON(COLA_KEY, []);
                if (!cola.length) break;
                const op = cola[0];
                let error = null;
                try {
                    if (op.tipo === 'crear') {
                        const fila = { ...op.fila };
                        if (op.resolver && !fila.sesion_id && fila.contexto_id) {
                            const d = await proximaClase(fila.contexto_id);
                            fila.sesion_id = d.sesion_id || null;
                            if (d.sesion_id && filas.has(fila.id)) {
                                if (d.fecha) fechas.set(d.sesion_id, d.fecha);
                                cambiarLocal(fila.id, { sesion_id: d.sesion_id });
                            }
                        }
                        ({ error } = await sb.from('pendientes').upsert(fila, { onConflict: 'id' }));
                    } else if (op.tipo === 'cambiar') {
                        ({ error } = await sb.from('pendientes').update(op.cambios).eq('id', op.id));
                    } else if (op.tipo === 'borrar') {
                        ({ error } = await sb.from('pendientes').delete().eq('id', op.id));
                    }
                } catch (e) { error = e; }
                if (error && esDeRed(error)) break;                    // sin señal: se reintenta después
                const ahora = leerJSON(COLA_KEY, []);
                ahora.shift();                                          // hecho (o rechazado por la base: se descarta)
                escribirJSON(COLA_KEY, ahora);
                if (error) aviso('Un cambio no se pudo guardar y se descartó.');
            }
            pintarCola();
        })().finally(() => { subiendo = null; });
        return subiendo;
    }
    function enCola() { return leerJSON(COLA_KEY, []).length; }
    let avisarCola = null;
    function pintarCola() { if (avisarCola) avisarCola(enCola()); }

    function cambiarLocal(id, cambios) {
        const p = filas.get(id);
        if (!p) return;
        Object.assign(p, cambios);
        if ('sesion_id' in cambios) p.fecha = fechas.get(p.sesion_id) || null;
        avisar({ tipo: 'poner', p: { ...p } });
        repintarTodo();
    }

    const nuevoId = () => (crypto.randomUUID ? crypto.randomUUID()
        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));

    // 🐞 Mejoras de la app (deuda CO): un pendiente que empieza con /bug o /mejora deja de ser pendiente y se anota en
    // esa lista (categoría 'mejora_app', con su marca 🐞 / ✨ adelante); conserva el curso y la clase donde se escribió.
    const CAT_MEJORA = 'mejora_app';
    function comoMejora(texto) {
        const m = String(texto || '').match(/^\s*\/(bug|mejora)(?![a-záéíóúñ])[\s:.-]*/i);
        return m ? (m[1].toLowerCase() === 'bug' ? '🐞 ' : '✨ ') + String(texto).slice(m[0].length).trim() : null;
    }
    // ✉️ Mensajes (deudas DD y DE): "/msj destinatario: mensaje" (o "/mensaje …"), en una línea. Mientras se escribe
    // falta el mensaje (msg vacío). Sin dos puntos, un salto de línea también separa.
    const CAT_MENSAJE = 'mensaje';
    function partesMensaje(texto) {
        const m = String(texto || '').match(/^\s*\/(mensaje|msj)(?![a-záéíóúñ])\s*/i);
        if (!m) return null;
        const resto = String(texto).slice(m[0].length);
        let i = resto.indexOf(':');
        if (i < 0) i = resto.indexOf('\n');
        if (i < 0) return { para: resto.trim(), msg: '' };
        return { para: resto.slice(0, i).trim(), msg: resto.slice(i + 1).replace(/\s*\n\s*/g, ' ').trim() };
    }
    // Un texto con /bug, /mejora o /mensaje (completo) deja de ser pendiente: a qué categoría va, con qué texto y qué aviso.
    function comoOtra(texto) {
        const mejora = comoMejora(texto);
        if (mejora) return { categoria: CAT_MEJORA, texto: mejora, aviso: 'Anotado en 🐞 Mejoras de la app.', error: 'No se pudo anotar la mejora — revisa la conexión.' };
        const m = partesMensaje(texto);
        if (m && m.para && m.msg) return { categoria: CAT_MENSAJE, texto: m.para + '\n' + m.msg, aviso: `Anotado en ✉️ Mensajes para ${m.para}.`, error: 'No se pudo anotar el mensaje — revisa la conexión.' };
        return null;
    }
    async function crear({ contexto_id, sesion_id, fecha, texto = '', hoy = null, padre_id = null, resolver = false, silencioso = false }) {
        const otra = comoOtra(texto);
        if (otra) {
            const fila = { contexto_id, sesion_id: sesion_id || null, categoria: otra.categoria, texto: otra.texto, estado: 'activo' };
            if (conCola) encolar({ tipo: 'crear', fila: { id: nuevoId(), ...fila, semanas_pendiente: 0, hoy: null, completado_en: null, padre_id: null, created_at: new Date().toISOString() } });
            else if ((await sb.from('pendientes').insert(fila)).error) { if (!silencioso) aviso(otra.error); return null; }
            if (!silencioso) aviso(otra.aviso, true);   // desde el editor, la página muestra su propio aviso
            return { otra: otra.categoria, aviso: otra.aviso };   // no es pendiente: no entra a la lista
        }
        if (conCola) {
            const fila = { id: nuevoId(), contexto_id, sesion_id: sesion_id || null, categoria: CAT, texto, estado: 'activo',
                semanas_pendiente: 0, hoy, completado_en: null, padre_id, created_at: new Date().toISOString() };
            const p = ponerLocal({ ...fila, sesiones: fecha ? { fecha } : null });
            encolar({ tipo: 'crear', fila, resolver });
            return p;
        }
        const { data, error } = await sb.from('pendientes').insert({
            contexto_id, sesion_id: sesion_id || null, categoria: CAT, texto, estado: 'activo', hoy, padre_id,
        }).select(COLS).single();
        if (error) return null;
        if (fecha && !data.sesiones) data.sesiones = { fecha };
        const p = ponerLocal(data);
        avisar({ tipo: 'poner', p });
        return p;
    }
    async function cambiar(id, cambios) {
        const p = filas.get(id);
        if (!p) return;
        const otra = 'texto' in cambios ? comoOtra(cambios.texto) : null;
        if (otra) {   // escrito con /bug, /mejora o /mensaje: sale de la lista (🐞 Mejoras de la app · ✉️ Mensajes)
            const pasa = { categoria: otra.categoria, texto: otra.texto, padre_id: null, hoy: null };
            clearTimeout(timers[id]?.t); delete timers[id];
            filas.delete(id);
            avisar({ tipo: 'quitar', id });
            repintarTodo();
            if (conCola) {
                const cola = leerJSON(COLA_KEY, []);
                const cr = cola.find(o => o.tipo === 'crear' && o.fila.id === id);
                if (cr && !subiendo) { Object.assign(cr.fila, pasa); escribirJSON(COLA_KEY, cola); }
                else encolar({ tipo: 'cambiar', id, cambios: pasa });
            } else if ((await sb.from('pendientes').update(pasa).eq('id', id)).error) {
                filas.set(id, p); repintarTodo(); avisar({ tipo: 'poner', p });
                aviso(otra.error); return;
            }
            aviso(otra.aviso, true);
            return;
        }
        if (conCola) {
            cambiarLocal(id, cambios);
            // un pendiente aún sin subir: el cambio va dentro de su "crear"
            const cola = leerJSON(COLA_KEY, []);
            const cr = cola.find(o => o.tipo === 'crear' && o.fila.id === id);
            if (cr && !subiendo) { Object.assign(cr.fila, cambios); escribirJSON(COLA_KEY, cola); return; }
            encolar({ tipo: 'cambiar', id, cambios });
            return;
        }
        const antes = { ...p };
        Object.assign(p, cambios);
        if ('sesion_id' in cambios) p.fecha = fechas.get(p.sesion_id) || null;
        avisar({ tipo: 'poner', p: { ...p } });
        repintarTodo();
        const { error } = await sb.from('pendientes').update(cambios).eq('id', id);
        if (error) {
            filas.set(id, antes); repintarTodo();
            avisar({ tipo: 'poner', p: antes });
            aviso('No se pudo guardar el pendiente — revisa la conexión.');
        }
    }
    // Devuelve lo borrado (el pendiente y sus subpendientes), para poder deshacer.
    async function borrar(id) {
        clearTimeout(timers[id]?.t); delete timers[id];
        const antes = filas.get(id);
        const hijos = [...filas.values()].filter(p => p.padre_id === id);
        filas.delete(id);
        hijos.forEach(h => filas.delete(h.id));
        avisar({ tipo: 'quitar', id });
        repintarTodo();
        const borrados = antes ? [{ ...antes }, ...hijos.map(h => ({ ...h }))] : [];
        if (conCola) {
            const cola = leerJSON(COLA_KEY, []);
            const k = cola.findIndex(o => o.tipo === 'crear' && o.fila.id === id);
            if (k >= 0 && !subiendo) {                       // aún no subía: basta con olvidarlo (y a sus hijos)
                escribirJSON(COLA_KEY, cola.filter(o => o.id !== id && !(o.tipo === 'crear' && (o.fila.id === id || o.fila.padre_id === id))));
                pintarCola(); return borrados;
            }
            encolar({ tipo: 'borrar', id });
            return borrados;
        }
        const { error } = await sb.from('pendientes').delete().eq('id', id);
        if (error && antes) { ponerLocal(antes); hijos.forEach(h => ponerLocal(h)); aviso('No se pudo borrar el pendiente — revisa la conexión.'); }
        return borrados;
    }
    // Deshacer un borrado: vuelven los mismos pendientes (mismo id), el principal primero.
    async function restaurar(borrados) {
        for (const p of borrados) {
            const fila = soloFila(p);
            ponerLocal({ ...fila, sesiones: p.fecha ? { fecha: p.fecha } : null });
            avisar({ tipo: 'poner', p: filas.get(p.id) });
            if (conCola) { encolar({ tipo: 'crear', fila }); continue; }
            const { error } = await sb.from('pendientes').upsert(fila, { onConflict: 'id' });
            if (error) aviso('No se pudo deshacer — revisa la conexión.');
        }
    }
    // `el` = el cuadro donde se escribe (un mismo pendiente puede verse en varias listas).
    function guardarTexto(id, el, ahora) {
        clearTimeout(timers[id]?.t);
        const ir = () => {
            const texto = el.value.trim();
            // /bug o /mejora: pasa a 🐞 Mejoras recién al terminar (Enter o salir), no a mitad de escribir
            if (!ahora && (comoMejora(texto) || partesMensaje(texto))) { timers[id] = { t: null, el }; return; }
            delete timers[id];
            if (filas.get(id) && filas.get(id).texto !== texto) cambiar(id, { texto });
        };
        if (ahora) ir(); else timers[id] = { t: setTimeout(ir, 600), el };
    }
    function guardarTodo() { Object.entries(timers).forEach(([id, x]) => guardarTexto(id, x.el, true)); }

    // El aviso sale solo en la lista donde se está escribiendo (no en todas las de la página: en el Dashboard hay una por
    // curso). `ok`: confirmación (verde), no error (rojo).
    let listaActiva = null;
    function aviso(t, ok = false) {
        const vivas = [...listas].filter(L => L.caja.isConnected);
        const donde = listaActiva && vivas.includes(listaActiva) ? [listaActiva] : vivas.slice(0, 1);
        donde.forEach(L => {
            const a = L.caja.querySelector('.pd-aviso'); if (!a) return;
            a.textContent = t; a.classList.toggle('ok', ok);
            clearTimeout(a._t); a._t = setTimeout(() => { a.textContent = ''; }, 5000);
        });
    }

    // Próxima clase de un curso (hoy incluida); si aún no existe, la próxima fecha de su
    // horario (se crea la sesión). Sin horario (General, por ejemplo): sin clase.
    async function proximaClase(cid, { despuesDe = null, desde = null } = {}) {
        if (!cid) return { contexto_id: null, sesion_id: null };
        const hoy = hoyISO();
        const minimo = desde && desde > hoy ? desde : hoy;          // nunca una clase ya pasada
        let q = sb.from('sesiones').select('id, fecha').eq('contexto_id', cid).gte('fecha', minimo);
        if (despuesDe) q = q.gt('fecha', despuesDe);                // la clase siguiente a la revisada
        const { data } = await q.order('fecha', { ascending: true }).limit(2);
        let cand = data || [];
        // Desde un texto o una nota: la clase de hoy no cuenta si ya se dio (quedó su registro de
        // tiempos al terminarla) o está en curso; entonces va a la siguiente.
        let hoyDada = false;
        if ((despuesDe || desde) && cand[0]?.fecha === hoy) {
            const { data: t } = await sb.from('clase_tiempos').select('id').eq('sesion_id', cand[0].id).limit(1);
            let vivo = null; try { vivo = window.ClaseVivo?.enCurso(); } catch (_) {}
            hoyDada = !!(t && t.length) || vivo?.sesionId === cand[0].id;
            if (hoyDada) cand = cand.slice(1);
        }
        if (cand[0]) return { contexto_id: cid, sesion_id: cand[0].id, fecha: cand[0].fecha };
        const { data: hor } = await sb.from('horario').select('dia_semana').eq('contexto_id', cid).eq('activo', true);
        const dias = new Set((hor || []).map(h => (Number(h.dia_semana) + 1) % 7));   // 0 = lunes → getDay 1
        if (!dias.size) return { contexto_id: cid, sesion_id: null };
        const d = new Date(minimo + 'T12:00:00');
        if (despuesDe && despuesDe >= minimo) { d.setTime(new Date(despuesDe + 'T12:00:00').getTime()); d.setDate(d.getDate() + 1); }
        else if (hoyDada && minimo === hoy) d.setDate(d.getDate() + 1);
        for (let i = 0; i < 21; i++, d.setDate(d.getDate() + 1)) {
            if (!dias.has(d.getDay())) continue;
            const f = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            let { data: s } = await sb.from('sesiones').select('id').eq('contexto_id', cid).eq('fecha', f).maybeSingle();
            if (!s) ({ data: s } = await sb.from('sesiones').insert({ contexto_id: cid, fecha: f }).select('id').single());
            return { contexto_id: cid, sesion_id: s?.id || null, fecha: f };
        }
        return { contexto_id: cid, sesion_id: null };
    }

    // ── Listas en pantalla ──────────────────────────────────────────────
    const DIAS_C = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
    const fechaCorta = iso => { const d = new Date(iso + 'T12:00:00'); return `${DIAS_C[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`; };
    const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function lista(caja, op = {}) {
        const L = {
            caja, op, filasEl: new Map(), abiertoComp: op.completadosAbiertos !== false,
        };
        caja.classList.add('pd-lista');
        caja.classList.toggle('pd-sugerencias', !!op.sugerencias);
        if (op.elegirCurso) caja.dataset.elegir = '1';
        caja.classList.toggle('pd-tactil', !!op.tactil);
        caja.innerHTML = `<div class="pd-activos"></div>
            ${op.botonAgregar === false || !op.alta ? '' : '<button class="pd-add" type="button">＋ Agregar pendiente</button>'}
            <div class="pd-cursos" hidden></div>
            <div class="pd-vacio"></div>
            <div class="pd-viejos" hidden>
                <button class="pd-viejos-hdr" type="button"><span class="pd-viejos-lbl"></span><span class="pd-viejos-chev"></span></button>
                <div class="pd-viejos-body"></div>
            </div>
            <div class="pd-comp" hidden>
                <button class="pd-comp-hdr" type="button"><span class="pd-comp-lbl"></span><span class="pd-comp-chev"></span></button>
                <div class="pd-comp-body"></div>
            </div>
            <div class="pd-aviso"></div>`;
        caja.querySelector('.pd-add')?.addEventListener('click', () => {
            if (op.elegirCurso) abrirCursos(L, null, caja.querySelector('.pd-add')); else agregar(L);
        });
        // Tocar el curso de un pendiente (listas con elegirCurso) = cambiarlo de curso.
        if (op.elegirCurso) caja.addEventListener('click', e => {
            const c = e.target.closest('.pd-curso');
            if (!c) return;
            const fila = c.closest('.pd-fila');
            if (fila) abrirCursos(L, fila.dataset.id, fila.parentElement);
        });
        caja.querySelector('.pd-comp-hdr').addEventListener('click', () => { L.abiertoComp = !L.abiertoComp; pintar(L); });
        caja.querySelector('.pd-viejos-hdr').addEventListener('click', () => { L.abiertoViejos = !L.abiertoViejos; pintar(L); });
        listas.add(L);
        ro?.observe(caja);
        pintar(L);
        return {
            agregar: () => agregar(L),
            repintar: () => pintar(L),
            destruir: () => { listas.delete(L); ro?.unobserve(caja); },
            cuenta: () => contar(L),
        };
    }

    // Completado hace más de 2 semanas → ya no se ve (salvo listas de historial).
    function vigente(L, p) {
        if (p.estado === 'activo') return true;
        if (p.estado !== 'completado') return false;
        if (L.op.todosCompletados || !p.completado_en) return true;
        return Date.now() - new Date(p.completado_en).getTime() < DIAS_VISIBLE_COMP * 864e5;
    }
    const esDeCat = p => !p.categoria || p.categoria === CAT;
    const esViejo = p => !p.padre_id && p.estado === 'activo' && (Number(p.semanas_pendiente) || 0) >= SEM_ARRASTRE;
    // Pendientes principales de la lista (los subpendientes van con su padre; si el padre no
    // está cargado, se muestran sueltos).
    function items(L) {
        return [...filas.values()].filter(p => esDeCat(p) && (!p.padre_id || !filas.has(p.padre_id))
            && vigente(L, p) && (!L.op.filtro || L.op.filtro(p)));
    }
    const porFecha = (a, b) => String(a.created_at).localeCompare(String(b.created_at));
    function hijosDe(L, id) { return [...filas.values()].filter(p => p.padre_id === id && vigente(L, p)).sort(porFecha); }
    function contar(L) { const it = items(L); return { activos: it.filter(p => p.estado === 'activo').length, completados: it.filter(p => p.estado === 'completado').length }; }

    // Elegir curso (opción elegirCurso: { cursos: () => [{ id, corto, nombre }] }): una fila de
    // íconos bajo `ancla`. Para uno nuevo (id = null) se llama alta(curso); para uno existente,
    // se lo cambia a ese curso (alta(curso) da su próxima clase).
    function abrirCursos(L, id, ancla) {
        let box = L.caja.querySelector('.pd-cursos');
        if (!box) { box = document.createElement('div'); box.className = 'pd-cursos'; box.hidden = true; }   // se fue con una fila borrada
        if (!box.hidden && box.dataset.para === String(id)) { box.hidden = true; return; }
        const actual = id ? filas.get(id)?.contexto_id : null;
        box.dataset.para = String(id);
        box.innerHTML = `<span class="pd-cursos-tit">${id ? 'Mover a:' : '¿De qué curso?'}</span>` +
            L.op.elegirCurso.cursos().map(c => `<button type="button" class="pd-curso-op${c.id === actual ? ' actual' : ''}"
                data-cid="${esc(c.id ?? '')}" title="${esc(c.nombre)}">${esc(c.corto)}</button>`).join('') +
            '<button type="button" class="pd-cursos-x" title="Cerrar">✕</button>';
        ancla.insertAdjacentElement('afterend', box);
        box.hidden = false;
        box.onclick = async e => {
            if (e.target.closest('.pd-cursos-x')) { box.hidden = true; return; }
            const b = e.target.closest('.pd-curso-op');
            if (!b) return;
            box.hidden = true;
            const cid = b.dataset.cid || null;
            if (!id) { agregar(L, cid); return; }
            const p = filas.get(id);
            if (!p || p.contexto_id === cid) return;
            const d = await L.op.alta(cid);
            if (!d) return;
            const cambios = { contexto_id: d.contexto_id, sesion_id: d.sesion_id || null };
            if (d.fecha && d.sesion_id) fechas.set(d.sesion_id, d.fecha);
            cambiar(id, cambios);
            [...filas.values()].filter(h => h.padre_id === id).forEach(h => cambiar(h.id, cambios));
        };
    }

    async function agregar(L, curso) {
        listaActiva = L;
        if (!L.op.alta) return;
        const destino = await L.op.alta(curso);
        if (!destino) { aviso(L.op.sinDestino || 'Este curso no tiene una próxima clase en el horario.'); return; }
        const p = await crear(destino);
        if (!p) { aviso('No se pudo crear el pendiente — revisa la conexión.'); return; }
        enfocarFila(L, p.id);
    }
    async function agregarHijo(L, padre) {            // queda al final de sus subpendientes
        listaActiva = L;
        plegados.delete(padre.id); guardarPlegados();
        const p = await crear({ contexto_id: padre.contexto_id, sesion_id: padre.sesion_id, fecha: padre.fecha, padre_id: padre.id });
        if (!p) { aviso('No se pudo crear el pendiente — revisa la conexión.'); return; }
        enfocarFila(L, p.id);
    }
    function enfocarFila(L, id) {
        const t = L.caja.querySelector(`.pd-fila[data-id="${id}"] .pd-txt`);
        if (t) { t.readOnly = false; t.focus(); }
    }

    function repintarTodo() { listas.forEach(L => { if (L.caja.isConnected) pintar(L); else listas.delete(L); }); guardarCopia(); }
    // Al pasar la medianoche (o volver a la pestaña), HOY parte vacía.
    let diaPintado = hoyISO();
    const revisarDia = () => { if (hoyISO() !== diaPintado) { diaPintado = hoyISO(); repintarTodo(); } };
    document.addEventListener('visibilitychange', revisarDia);
    setInterval(revisarDia, 60000);

    function pintar(L) {
        const it = items(L).sort(porFecha);
        const activos = it.filter(p => p.estado === 'activo'), comp = it.filter(p => p.estado === 'completado');
        // Menos ruido (PO 2026-10-25): los que llevan 3 semanas o más van juntos al final, en un cuadro plegado con
        // Sigue / Archivar (en las sugerencias de Hoy, no).
        const viejos = L.op.sugerencias ? [] : activos.filter(esViejo), act = activos.filter(p => !viejos.includes(p));
        // Fecha de la clase: si todos van a la misma, se dice una vez (en el título del grupo) y no en cada fila.
        const fechas = new Set(activos.map(p => p.fecha || ''));
        L.fechaComun = L.op.fechaEnGrupo && activos.length && fechas.size === 1 ? [...fechas][0] || null : null;
        if (L.op.fechaEnGrupo) { try { L.op.fechaEnGrupo(L.fechaComun ? fechaCorta(L.fechaComun) : ''); } catch (_) {} }
        const cAct = L.caja.querySelector('.pd-activos'), cComp = L.caja.querySelector('.pd-comp-body'), cViejos = L.caja.querySelector('.pd-viejos-body');
        const vivos = new Set();
        it.forEach(p => { vivos.add(p.id); hijosDe(L, p.id).forEach(h => vivos.add(h.id)); });
        L.filasEl.forEach((el, id) => { if (!vivos.has(id)) { el.remove(); L.filasEl.delete(id); } });
        colocar(L, cAct, act);
        colocar(L, cViejos, viejos);
        const cajaV = L.caja.querySelector('.pd-viejos');
        cajaV.hidden = !viejos.length;
        cajaV.classList.toggle('pd-cerrado', !L.abiertoViejos);
        L.caja.querySelector('.pd-viejos-lbl').textContent = `⏳ Llevan 3 semanas o más · ${viejos.length}`;
        L.caja.querySelector('.pd-viejos-chev').textContent = L.abiertoViejos ? '▾' : '▸';
        colocar(L, cComp, comp);
        const caja = L.caja.querySelector('.pd-comp');
        caja.hidden = !comp.length;
        caja.classList.toggle('pd-cerrado', !L.abiertoComp);
        L.caja.querySelector('.pd-comp-lbl').textContent = `Completados · ${comp.length}`;
        L.caja.querySelector('.pd-comp-chev').textContent = L.abiertoComp ? '▾' : '▸';
        const vacio = L.caja.querySelector('.pd-vacio');
        vacio.textContent = !act.length && L.op.vacio ? L.op.vacio : '';
        vacio.hidden = !vacio.textContent;
        if (L.op.alCambiar) L.op.alCambiar({ activos: activos.length, completados: comp.length });
    }
    // Pone las filas en orden sin mover las que ya están en su lugar (no se pierde el cursor).
    function colocar(L, cont, lista, padre) {
        let ref = cont.firstElementChild;
        lista.forEach(p => {
            let el = L.filasEl.get(p.id);
            if (!el) { el = nodoEl(L, p); L.filasEl.set(p.id, el); }
            actualizarFila(L, el, p, !!padre);
            if (!padre) colocar(L, el.querySelector('.pd-hijos'), hijosDe(L, p.id), p);
            if (el === ref) { ref = ref.nextElementSibling; return; }
            cont.insertBefore(el, ref);
        });
    }
    function nodoEl(L, p) {
        const n = document.createElement('div');
        n.className = 'pd-nodo';
        n.dataset.id = p.id;
        n.innerHTML = `<div class="pd-fila" data-id="${p.id}">
                <button class="pd-plegar" type="button" tabindex="-1"></button>
                <input type="checkbox" class="pd-chk" title="Marcar como hecho">
                <textarea class="pd-txt" rows="1" placeholder="Escribe el pendiente…"></textarea>
                <span class="pd-meta"></span>
                <span class="pd-acc">
                    <button class="pd-sol" type="button" tabindex="-1" title="Agregar a HOY">☀️</button>
                    <button class="pd-sub" type="button" tabindex="-1" title="Agregar un subpendiente"><svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true"><path d="M4 2.5v5.5a3 3 0 0 0 3 3h6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M10.5 8.5 13 11l-2.5 2.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
                    <button class="pd-del" type="button" tabindex="-1" title="Borrar">✕</button>
                    <button class="pd-aceptar" type="button" title="Queda para hoy">Aceptar</button>
                    <button class="pd-rechazar" type="button" title="Sale de Hoy; sigue como pendiente de su curso">Rechazar</button>
                </span>
            </div>
            <div class="pd-arr"><span class="pd-arr-txt"></span>
                <button class="pd-sigue" type="button" title="Sigue pendiente: el contador vuelve a cero">Sigue</button>
                <button class="pd-archivar" type="button" title="Sale de la lista sin borrarse">Archivar</button></div>
            <div class="pd-hijos"></div>`;
        const fila = n.firstElementChild;
        const chk = fila.querySelector('.pd-chk'), txt = fila.querySelector('.pd-txt');
        const yo = () => filas.get(p.id) || p;
        chk.addEventListener('change', () => {
            guardarTexto(p.id, txt, true);
            cambiar(p.id, chk.checked ? { estado: 'completado', completado_en: new Date().toISOString() } : { estado: 'activo', completado_en: null });
        });
        txt.addEventListener('focus', () => { listaActiva = L; });
        txt.addEventListener('input', () => { listaActiva = L; crecer(txt); guardarTexto(p.id, txt, false); });
        txt.addEventListener('blur', () => {
            if (!txt.value.trim() && !hijosDe(L, p.id).length) { borrar(p.id); return; }
            guardarTexto(p.id, txt, true);
        });
        txt.addEventListener('keydown', e => {
            const q = yo();
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                // En un subpendiente con texto, Enter crea el siguiente.
                if (q.padre_id && txt.value.trim() && filas.has(q.padre_id)) { guardarTexto(p.id, txt, true); agregarHijo(L, filas.get(q.padre_id)); return; }
                txt.blur(); return;
            }
            if (e.key === 'Tab' && !e.shiftKey && !q.padre_id && !hijosDe(L, q.id).length) {
                // Tab: pasa a ser subpendiente del pendiente de arriba.
                const arriba = n.previousElementSibling && filas.get(n.previousElementSibling.dataset.id);
                if (!arriba) return;
                e.preventDefault();
                guardarTexto(p.id, txt, true);
                plegados.delete(arriba.id); guardarPlegados();
                cambiar(q.id, { padre_id: arriba.id, sesion_id: arriba.sesion_id, contexto_id: arriba.contexto_id });
                setTimeout(() => enfocarFila(L, q.id), 0);
                return;
            }
            if (e.key === 'Tab' && e.shiftKey && q.padre_id) {
                e.preventDefault();
                guardarTexto(p.id, txt, true);
                cambiar(q.id, { padre_id: null });
                setTimeout(() => enfocarFila(L, q.id), 0);
            }
        });
        fila.querySelector('.pd-del').addEventListener('click', () => {
            const nh = hijosDe(L, p.id).length;
            if (nh && !confirm(`Este pendiente tiene ${nh} subpendiente${nh === 1 ? '' : 's'}. ¿Borrarlo con todo?`)) return;
            borrar(p.id);
        });
        fila.querySelector('.pd-sol').addEventListener('click', () => cambiar(p.id, { hoy: yo().hoy === hoyISO() ? null : hoyISO() }));
        fila.querySelector('.pd-sub').addEventListener('click', () => agregarHijo(L, yo()));
        // Sugerencias (marcados ☀️ otro día y no hechos): aceptar = hoy; rechazar = fuera de Hoy.
        fila.querySelector('.pd-aceptar').addEventListener('click', () => cambiar(p.id, { hoy: hoyISO() }));
        fila.querySelector('.pd-rechazar').addEventListener('click', () => cambiar(p.id, { hoy: null }));
        if (L.op.sugerencias) txt.readOnly = true;
        // Táctil (celular): el texto se edita solo con un toque corto en la fila. Mientras no se
        // edita, el cuadro de texto no recibe el dedo (CSS .pd-tactil): así mantener presionado
        // arrastra la fila en vez de seleccionar texto, y deslizar no abre el teclado.
        if (L.op.tactil && !L.op.sugerencias) {
            txt.readOnly = true;
            fila.addEventListener('click', e => {
                if (!txt.readOnly || fila.dataset.gesto || e.target.closest('.pd-chk, .pd-plegar, .pd-acc, .pd-curso, .pd-arr')) return;
                txt.readOnly = false; txt.focus();
            });
            txt.addEventListener('blur', () => { txt.readOnly = true; });
        }
        fila.querySelector('.pd-plegar').addEventListener('click', () => {
            if (plegados.has(p.id)) plegados.delete(p.id); else plegados.add(p.id);
            guardarPlegados(); repintarTodo();
        });
        n.querySelector('.pd-sigue').addEventListener('click', () => cambiar(p.id, { semanas_pendiente: 0 }));
        n.querySelector('.pd-archivar').addEventListener('click', () => cambiar(p.id, { estado: 'descartado' }));
        return n;
    }
    function actualizarFila(L, n, p, esHijo) {
        const fila = n.firstElementChild;
        const hecho = p.estado === 'completado';
        const hijos = esHijo ? [] : hijosDe(L, p.id);
        const plegado = hijos.length && plegados.has(p.id);
        n.classList.toggle('pd-es-hijo', esHijo);
        n.classList.toggle('pd-plegado', !!plegado);
        fila.classList.toggle('pd-hecho', hecho);
        fila.classList.toggle('pd-en-hoy', p.hoy === hoyISO());
        fila.querySelector('.pd-chk').checked = hecho;
        const pl = fila.querySelector('.pd-plegar');
        pl.textContent = hijos.length ? (plegado ? '▸' : '▾') : '';
        pl.title = hijos.length ? (plegado ? 'Mostrar subpendientes' : 'Ocultar subpendientes') : '';
        pl.classList.toggle('pd-sin', !hijos.length);
        const txt = fila.querySelector('.pd-txt');
        if (document.activeElement !== txt && txt.value !== (p.texto || '')) txt.value = p.texto || '';
        requestAnimationFrame(() => crecer(txt));
        const sem = Number(p.semanas_pendiente) || 0;
        const partes = [];
        if (plegado) partes.push(`<span class="pd-cuenta" title="Subpendientes hechos">${hijos.filter(h => h.estado === 'completado').length}/${hijos.length}</span>`);
        if (!esHijo && !hecho && sem >= SEM_ARRASTRE) partes.push(`<span class="pd-sem" title="Trasladado ${sem} semanas">⏳ ${sem}</span>`);
        if (!esHijo && L.op.marcaHoy && p.hoy === hoyISO()) partes.push('<span class="pd-marca-hoy" title="Está en Hoy">☀️</span>');
        if (!esHijo && L.op.mostrarCurso) {
            const c = L.op.mostrarCurso(p);                       // texto, o { texto, titulo }
            const tx = c && typeof c === 'object' ? c.texto : c, ti = c && typeof c === 'object' ? c.titulo : 'Curso';
            if (tx) partes.push(`<span class="pd-curso" title="${esc(ti)}">${esc(tx)}</span>`);
        }
        if (!esHijo && L.op.mostrarClase && p.fecha && p.fecha !== L.fechaComun) partes.push(`<span class="pd-clase" title="Clase a la que pertenece">${fechaCorta(p.fecha)}</span>`);
        fila.querySelector('.pd-meta').innerHTML = partes.join(' ');
        fila.querySelector('.pd-sol').hidden = esHijo;
        fila.querySelector('.pd-sol').title = p.hoy === hoyISO() ? 'Quitar de HOY' : 'Agregar a HOY';
        fila.querySelector('.pd-sub').hidden = esHijo;
        const arrastrado = !esHijo && !hecho && sem >= SEM_ARRASTRE;
        fila.classList.toggle('pd-arrastrado', arrastrado);
        n.querySelector('.pd-arr').hidden = !arrastrado;   // Sigue / Archivar: solo se ven dentro del cuadro ⏳ (CSS)
        if (arrastrado) n.querySelector('.pd-arr-txt').textContent = `Lleva ${sem} semanas.`;
    }
    function crecer(t) {
        if (!t.isConnected || !t.offsetParent) return;
        t.style.height = 'auto';
        t.style.height = (t.scrollHeight + (t.offsetHeight - t.clientHeight)) + 'px';
    }
    // Al cambiar el ancho de una lista, reajustar las alturas.
    const ro = 'ResizeObserver' in window
        ? new ResizeObserver(ents => ents.forEach(e => e.target.querySelectorAll('.pd-txt').forEach(crecer))) : null;

    // Desde un texto del editor de bloques (deuda DE): /bug, /mejora y /msj quedan con el curso y la clase de origen;
    // un pendiente va a la clase siguiente (despuesDe: la fecha de esa clase) o desde una fecha (desde: una nota).
    // Sin curso o en General: sin clase. Devuelve { ok, aviso } para mostrarlo en la página.
    async function desdeTexto(texto, { cid = null, sesionId = null, general = false, despuesDe = null, desde = null } = {}) {
        try {
            if (comoOtra(texto)) {
                const r = await crear({ contexto_id: cid, sesion_id: sesionId, texto, silencioso: true });
                return r ? { ok: true, aviso: r.aviso } : { ok: false, aviso: 'No se pudo anotar — revisa la conexión.' };
            }
            const destino = !cid || general ? { contexto_id: cid, sesion_id: null } : await proximaClase(cid, despuesDe ? { despuesDe } : desde ? { desde } : {});
            const r = await crear({ ...destino, texto });
            if (!r) return { ok: false, aviso: 'No se pudo crear el pendiente — revisa la conexión.' };
            return { ok: true, aviso: destino.fecha ? `Pendiente para la clase del ${fechaCorta(destino.fecha)} ✓` : 'Pendiente creado ✓' };
        } catch (_) { return { ok: false, aviso: 'No se pudo crear el pendiente — revisa la conexión.' }; }
    }

    window.Pendientes = {
        conectar, cargar, lista, guardarTodo, crear, cambiar, borrar, restaurar, proximaClase, hoyISO, fechaCorta, desdeTexto,
        get: id => filas.get(id), restaurarCopia, subirCola, enCola, alCola: fn => { avisarCola = fn; },
        COLS, CAT,
    };
})();
