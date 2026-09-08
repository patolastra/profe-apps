// Identidad de PRESENTACIÓN de los contextos (cursos e instancias).
// FUENTE ÚNICA del nombre visible + ícono de cada instancia del ecosistema.
//
// La LLAVE es el nombre TÉCNICO actual (contextos.nombre, en MAYÚSCULAS). Esta
// capa es SOLO de display: NO cambia ninguna clave, URL, FK, UUID ni dato. Los
// joins y la persistencia siguen usando contexto_id / contextos.nombre como hoy.
//
// Se incluye como <script src="../supabase/contextos.js"> (igual que config.js):
// classic script → las funciones quedan globales para los scripts de cada app.

const CTX_IDENTIDAD = {
    'PRIMERO':         { icono: '1️⃣', label: 'Primero'  },
    'SEGUNDO':         { icono: '2️⃣', label: 'Segundo'  },
    'TERCERO':         { icono: '3️⃣', label: 'Tercero'  },
    'CUARTO':          { icono: '4️⃣', label: 'Cuarto'   },
    'QUINTO':          { icono: '5️⃣', label: 'Quinto'   },
    'SEXTO':           { icono: '6️⃣', label: 'Sexto'    },
    'SEPTIMO':         { icono: '7️⃣', label: 'Séptimo'  },
    'OCTAVO':          { icono: '8️⃣', label: 'Octavo'   },
    'CUERDAS':         { icono: '🎸', label: 'Taller de Cuerdas' },
    'CASTIGADAS':      { icono: '🏅', label: 'Castigadas' },
    'KIDS CASTIGADAS': { icono: '👧', label: 'Kids Castigadas' },
    'RECREO':          { icono: '🪁', label: 'Recreo Entretenido' },
    'ENLACE':          { icono: '💻', label: 'Enlaces'  },
    'ORIENTACIÓN':     { icono: '🧭', label: 'Orientación' },
    'GENERAL':         { icono: '💼', label: 'General'  },
};

// Identidad completa a partir del nombre técnico. Fallback SEGURO para nombres
// desconocidos (p. ej. 'PERSONAL'): sin ícono y label = el nombre recibido,
// para no romper vistas existentes.
//   { nombre, icono, label, display }  (display = "ícono label", o solo label)
function contextoInfo(nombre) {
    const raw = (nombre == null ? '' : String(nombre)).trim();
    const key = raw.toUpperCase();
    const base = CTX_IDENTIDAD[key];
    if (base) {
        return { nombre: key, icono: base.icono, label: base.label,
                 display: base.icono + ' ' + base.label };
    }
    return { nombre: key, icono: '', label: raw, display: raw };
}

// Helpers de conveniencia (todos derivan de contextoInfo).
function ctxIcono(nombre)         { return contextoInfo(nombre).icono; }   // '3️⃣'
function ctxNombreVisible(nombre) { return contextoInfo(nombre).label; }   // 'Tercero'
function ctxDisplay(nombre)       { return contextoInfo(nombre).display; } // '3️⃣ Tercero'
