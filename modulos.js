// modulos.js — fuente única de verdad del ecosistema PROFE
// Para agregar un módulo: añadir UN objeto aquí. El resto se actualiza solo.
//
// Flags:
//   pc:true      → aparece en el PC Shell (PC/index.html)
//   mobile:true  → aparece en el Mobile Shell (MOVIL/index.html)
//   dock:true    → aparece en el dock del Portal
//   dockSep:true → separador solo en el dock (entre Admin y el resto)
//   sep:true     → separador de sección en todos los views
//   disabled:true → ítem deshabilitado (próximamente)
//
// hrefs son relativos a la raíz del repo. Cada consumer antepone '../'

const MODULOS_CONFIG = [
    // ── Activos ────────────────────────────────────────────────────────────
    {
        ico:'⚙️', nombre:'Admin',
        desc:'Gestión de pendientes del sistema',
        badge:'activo', href:'ADMIN/index.html',
        pc:true, mobile:true, dock:true
    },
    { dockSep: true },
    {
        ico:'📋', nombre:'Planning',
        desc:'Sesiones y planificación de clases',
        badge:'activo', href:'PORTAL/index.html',
        pc:true, mobile:true, dock:false
    },
    {
        ico:'🎙️', nombre:'Grabación',
        desc:'Registro de voz y seguimiento',
        badge:'activo', href:'SRP/mobile_ui/index.html',
        pc:true, mobile:true, dock:true
    },
    {
        ico:'🎵', nombre:'Repertorio',
        desc:'Biblioteca de canciones y letras',
        badge:'activo', href:'REPERTORIO/index.html',
        pc:true, mobile:true, dock:true
    },
    {
        ico:'🎸', nombre:'Tablaturas',
        desc:'Lector de partituras y tablatura',
        badge:'activo', href:'tabs/index.html',
        pc:true, mobile:false, dock:true
    },
    {
        ico:'🎹', nombre:'Metalófono',
        desc:'Herramienta pedagógica MIDI',
        badge:'alpha', href:'METALÓFONO APP/METAL21 (ALPHA).HTML',
        pc:true, mobile:false, dock:true
    },
    {
        ico:'🖥️', nombre:'Pizarra',
        desc:'Presentador de diapositivas en clase',
        badge:'activo', href:'PIZARRA/index.html',
        pc:true, mobile:false, dock:false
    },
    {
        ico:'📡', nombre:'Remoto',
        desc:'Controlar la Pizarra desde el celular',
        badge:'activo', href:'PIZARRA/index.html?modo=remoto',
        pc:false, mobile:true, dock:false
    },
    // ── Separador de sección (activos / próximamente) ──────────────────────
    { sep: true },
    // ── Próximamente ───────────────────────────────────────────────────────
    {
        ico:'📒', nombre:'Libro de Clases',
        desc:'Notas y registro de alumnos',
        badge:'pronto', disabled:true,
        pc:true, mobile:true, dock:true
    },
    {
        ico:'🎼', nombre:'Cuaderno MIDI',
        desc:'Captura y edición de melodías',
        badge:'pronto', disabled:true,
        pc:true, mobile:false, dock:true
    },
    {
        ico:'🏃', nombre:'Entrenamiento',
        desc:'Ejercicios y entrenamiento musical',
        badge:'pronto', disabled:true,
        pc:true, mobile:true, dock:true
    },
    {
        ico:'🃏', nombre:'Juegos',
        desc:'Juegos pedagógicos para clase',
        badge:'pronto', disabled:true,
        pc:true, mobile:false, dock:true
    },
    {
        ico:'📖', nombre:'Acordes',
        desc:'Diccionario de acordes guitarra/uke',
        badge:'pronto', disabled:true,
        pc:true, mobile:false, dock:true
    },
];
