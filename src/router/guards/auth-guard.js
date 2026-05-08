import { estadoAuth } from '../../store/auth.store.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';

/** Bloquea la ruta si el usuario no está autenticado. */
export const guardiaAutenticacion = (a) => {
  if (!estadoAuth.estaAutenticado.value) {
    return { redireccion: RUTAS[NOMBRES_RUTAS.INGRESAR], query: { siguiente: a.path } };
  }
  return null;
};
