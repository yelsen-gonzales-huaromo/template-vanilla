import { estadoAuth } from '../store/auth.store.js';

/** Predicado de permisos — acepta string o array, devuelve boolean (semántica `some`). */
export const usarPermisos = () => ({
  tiene(permiso) {
    const lista = Array.isArray(permiso) ? permiso : [permiso];
    return lista.some(p => estadoAuth.tienePermiso(p));
  },
  tieneTodos(permisos = []) { return permisos.every(p => estadoAuth.tienePermiso(p)); },
  tieneRol(rol) { return estadoAuth.tieneRol(rol); },
});
