// Configuración declarada de ESTA instancia del Lector.
// El despliegue PÚBLICO reemplaza este archivo por uno con perfil: 'publico'.
// Versión versionada por defecto: docente.
//
// LectorInstancia = config DECLARADA por el despliegue (cruda).
// LectorConfig     = config DERIVADA que lee el resto del sistema (perfil → cap/feat).
// El único puente entre ambas es resolverPerfilLector().
window.LectorInstancia = {
    perfil: 'docente'      // 'docente' | 'publico'
};
