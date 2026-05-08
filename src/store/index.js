/**
 * Estado raíz — compone los stores por característica en un único objeto.
 * Cada store expone sus propias señales reactivas; los módulos importan sólo lo que necesitan,
 * para mantener bajo el acoplamiento y eficaz el tree-shaking.
 */
import { estadoAuth } from './auth.store.js';
import { estadoUi } from './ui.store.js';
import { estadoNotificaciones } from './notifications.store.js';

export const estado = {
  auth: estadoAuth,
  ui: estadoUi,
  notificaciones: estadoNotificaciones,
};

export const iniciarEstado = () => {
  estadoAuth.hidratar();
  estadoUi.hidratar();
};

export { estadoAuth, estadoUi, estadoNotificaciones };
