import { estadoAuth } from '../../store/auth.store.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';

/** Construye una guardia que bloquea salvo que el usuario tenga al menos un rol permitido. */
export const guardiaRol = (rolesPermitidos = []) => () => {
  const rol = estadoAuth.usuario.value?.rol;
  if (!rol || !rolesPermitidos.includes(rol)) {
    return { redireccion: RUTAS[NOMBRES_RUTAS.ERROR_403] };
  }
  return null;
};
