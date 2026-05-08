import { senal } from '../utils/helpers/reactive.js';
import { idUnico } from '../utils/helpers/uid.js';
import { busEventos, EVENTOS_APP } from '../utils/helpers/event-bus.js';

const items = senal([]);

const empujar = (notificacion) => {
  const entrada = { id: idUnico('notif'), creadaEn: Date.now(), leida: false, ...notificacion };
  items.value = [entrada, ...items.value];
  busEventos.emitir(EVENTOS_APP.AVISO_PUSH, entrada);
  return entrada.id;
};

export const estadoNotificaciones = {
  items,

  push: empujar,
  exito:       (mensaje, opciones = {}) => empujar({ tipo: 'success', message: mensaje, ...opciones }),
  error:       (mensaje, opciones = {}) => empujar({ tipo: 'error',   message: mensaje, ...opciones }),
  advertencia: (mensaje, opciones = {}) => empujar({ tipo: 'warning', message: mensaje, ...opciones }),
  info:        (mensaje, opciones = {}) => empujar({ tipo: 'info',    message: mensaje, ...opciones }),

  marcarLeida(id) {
    items.value = items.value.map(n => n.id === id ? { ...n, leida: true } : n);
  },

  eliminar(id) {
    items.value = items.value.filter(n => n.id !== id);
  },

  limpiar() { items.value = []; },
};
