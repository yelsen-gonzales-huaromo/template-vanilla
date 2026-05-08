import { estadoAuth } from '../../store/auth.store.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';

/** Redirige a usuarios autenticados fuera de páginas públicas de auth (login, registro…). */
export const guardiaInvitado = () => {
  if (estadoAuth.estaAutenticado.value) {
    return { redireccion: RUTAS[NOMBRES_RUTAS.PANEL] };
  }
  return null;
};
