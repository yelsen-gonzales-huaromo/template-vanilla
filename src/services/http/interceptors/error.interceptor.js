import { estadoAuth } from '../../../store/auth.store.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';
import { busEventos, EVENTOS_APP } from '../../../utils/helpers/event-bus.js';

/** Manejo centralizado de errores — cierra sesión en 401, notifica en 5xx, dispara evento global. */
export const interceptorError = async (resErr) => {
  const status = resErr.status;

  if (status === 401) {
    estadoAuth.limpiar();
    busEventos.emitir(EVENTOS_APP.AUTH_EXPIRADA);
    estadoNotificaciones.advertencia('Sesión expirada. Vuelve a iniciar sesión.');
  } else if (status === 403) {
    estadoNotificaciones.error('No tienes permisos para esta acción.');
  } else if (status >= 500) {
    estadoNotificaciones.error('Error del servidor. Inténtalo de nuevo.');
  } else if (resErr.esErrorRed) {
    estadoNotificaciones.error('Sin conexión con el servidor.');
  }

  return resErr;
};
