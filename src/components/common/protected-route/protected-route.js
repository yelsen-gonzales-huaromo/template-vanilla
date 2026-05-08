import { crearEl } from '../../../utils/helpers/dom.js';
import { estadoAuth } from '../../../store/auth.store.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';

/**
 * Envoltorio RBAC a nivel componente — si al usuario le falta `permiso` o `rol`,
 * no renderiza nada y redirige a /403. Úsalo con moderación; prefiere guardias en rutas.
 */
export const RutaProtegida = ({ permiso, rol, hijos } = {}) => {
  const permitido = rol
    ? estadoAuth.tieneRol(rol)
    : permiso ? estadoAuth.tienePermiso(permiso) : true;

  if (!permitido) {
    queueMicrotask(() => navegarA(RUTAS[NOMBRES_RUTAS.ERROR_403], { reemplazar: true }));
    return crearEl('div');
  }
  return hijos;
};
