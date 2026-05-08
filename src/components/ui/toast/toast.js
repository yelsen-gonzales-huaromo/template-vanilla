import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../icon/icons.js';
import { busEventos, EVENTOS_APP } from '../../../utils/helpers/event-bus.js';

/**
 * Toasts — notificaciones flotantes efímeras.
 *
 *   notificar('mensaje')                              // info default
 *   notificar.exito('Guardado')
 *   notificar.error('Falló la conexión')
 *   notificar.advertencia('Cambios sin guardar')
 *   notificar.info('Sincronizando…')
 *   notificar.cargando('Subiendo archivo')            // loading sin auto-cierre
 *   notificar.promesa(promise, { exito, error, cargando })  // toggle automático
 *
 *   notificar('Hola', {
 *     titulo: 'Mensaje nuevo',
 *     posicion: 'top-right',                          // 6 posiciones disponibles
 *     duracion: 4500,                                 // 0 = no auto-cierre
 *     icono: nodo,                                    // override
 *     acciones: [{ etiqueta: 'Deshacer', alClick: fn }],
 *     avatar: nodo,                                   // foto/iniciales
 *     imagen: nodo,                                   // preview cuadrada (right)
 *     progreso: true,                                 // barra de countdown
 *     id: 'mi-id',                                    // para deduplicar/actualizar
 *   })
 */

// ============================================================================
//  Regiones — una por posición
// ============================================================================
const POSICIONES = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'];
const regiones = {};

const asegurarRegion = (posicion = 'bottom-right') => {
  if (regiones[posicion] && document.body.contains(regiones[posicion])) return regiones[posicion];
  const r = crearEl('div', {
    class: ['toast-region', `toast-region--${posicion}`],
    role: 'region',
    'aria-live': 'polite',
    'aria-label': 'Notificaciones',
  });
  document.body.appendChild(r);
  regiones[posicion] = r;
  return r;
};

// ============================================================================
//  Iconos por tipo
// ============================================================================
const ICONO_TIPO = {
  success:  () => Icono('check', { tamano: 16 }),
  error:    () => Icono('cerrar', { tamano: 16 }),
  warning:  () => Icono('alerta', { tamano: 16 }),
  info:     () => Icono('info', { tamano: 16 }),
  cargando: () => crearEl('span', { class: 'toast__spinner', 'aria-hidden': 'true' }),
};

// ============================================================================
//  Render del toast
// ============================================================================
const _toasts = new Map(); // id → { el, eliminar, actualizar }

const renderAviso = ({
  id, tipo = 'info', titulo, message, duracion = 4500,
  posicion = 'bottom-right', icono, acciones, avatar, imagen, progreso = false,
}) => {
  // Si ya existe un toast con ese id, lo actualizamos en su lugar
  if (id && _toasts.has(id)) {
    return _toasts.get(id).actualizar({ tipo, titulo, message, duracion, icono, acciones, avatar, imagen, progreso });
  }

  const region = asegurarRegion(posicion);

  const construir = ({ tipo, titulo, message, icono, acciones, avatar, imagen, progreso, duracion }) => {
    const iconoNodo = avatar
      ? crearEl('span', { class: 'toast__avatar' }, [avatar])
      : crearEl('span', { class: ['toast__icono', `toast__icono--${tipo}`] },
          [icono || ICONO_TIPO[tipo]?.() || ICONO_TIPO.info()]);

    const cuerpo = crearEl('div', { class: 'toast__body' }, [
      titulo && crearEl('div', { class: 'toast__title' }, [titulo]),
      crearEl('div', { class: 'toast__msg' }, [message]),
      acciones && acciones.length && crearEl('div', { class: 'toast__acciones' },
        acciones.map((a) => crearEl('button', {
          type: 'button', class: ['toast__accion', a.peligro && 'toast__accion--peligro'],
          onClick: () => { a.alClick?.(); if (a.cerrar !== false) eliminar(); },
        }, [a.etiqueta]))),
    ]);

    const close = crearEl('button', {
      type: 'button', class: 'toast__close', 'aria-label': 'Cerrar',
      onClick: () => eliminar(),
    }, [Icono('cerrar', { tamano: 14 })]);

    const barra = progreso && duracion > 0
      ? crearEl('span', {
          class: 'toast__progreso',
          style: { animationDuration: `${duracion}ms` },
        })
      : null;

    return [iconoNodo, cuerpo, imagen && crearEl('span', { class: 'toast__imagen' }, [imagen]), close, barra]
      .filter(Boolean);
  };

  let timeoutId = null;
  const programarCierre = (ms) => {
    if (timeoutId) clearTimeout(timeoutId);
    if (ms > 0) timeoutId = setTimeout(eliminar, ms);
  };

  const el = crearEl('div', {
    class: ['toast', `toast--${tipo}`],
    role: 'status', 'data-id': id || '',
    onMouseenter: () => { if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; el.classList.add('toast--hover'); } },
    onMouseleave: () => { el.classList.remove('toast--hover'); if (duracion > 0) programarCierre(duracion); },
  }, construir({ tipo, titulo, message, icono, acciones, avatar, imagen, progreso, duracion }));

  const eliminar = () => {
    if (timeoutId) clearTimeout(timeoutId);
    if (id) _toasts.delete(id);
    el.classList.add('toast--saliendo');
    setTimeout(() => el.remove(), 220);
  };

  const actualizar = (props) => {
    Object.assign({ tipo, titulo, message, icono, acciones, avatar, imagen, progreso, duracion }, props);
    const nuevoTipo = props.tipo ?? tipo;
    el.className = `toast toast--${nuevoTipo}`;
    el.replaceChildren(...construir({
      tipo: nuevoTipo,
      titulo: props.titulo ?? titulo,
      message: props.message ?? message,
      icono: props.icono,
      acciones: props.acciones,
      avatar: props.avatar,
      imagen: props.imagen,
      progreso: props.progreso ?? progreso,
      duracion: props.duracion ?? duracion,
    }));
    if (props.duracion !== undefined) programarCierre(props.duracion);
    return eliminar;
  };

  region.appendChild(el);
  programarCierre(duracion);
  if (id) _toasts.set(id, { el, eliminar, actualizar });
  return eliminar;
};

// ============================================================================
//  API pública
// ============================================================================
export const iniciarNotificaciones = () => {
  busEventos.on(EVENTOS_APP.AVISO_PUSH, (notif) => renderAviso(notif));
};

export const notificar = (mensaje, opciones = {}) => renderAviso({ message: mensaje, ...opciones });
notificar.exito       = (m, o = {}) => renderAviso({ ...o, message: m, tipo: 'success' });
notificar.error       = (m, o = {}) => renderAviso({ ...o, message: m, tipo: 'error' });
notificar.advertencia = (m, o = {}) => renderAviso({ ...o, message: m, tipo: 'warning' });
notificar.info        = (m, o = {}) => renderAviso({ ...o, message: m, tipo: 'info' });
notificar.cargando    = (m, o = {}) => renderAviso({ ...o, message: m, tipo: 'cargando', duracion: 0, id: o.id || `cargando-${Date.now()}` });

// Cerrar específico por id
notificar.cerrar = (id) => _toasts.get(id)?.eliminar();

// Promise wrapper — auto-toggle cargando → success/error
notificar.promesa = (promesa, { cargando = 'Procesando…', exito = '¡Listo!', error = 'Falló' } = {}) => {
  const id = `prom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  renderAviso({ id, tipo: 'cargando', message: cargando, duracion: 0 });
  return promesa.then(
    (val) => {
      _toasts.get(id)?.actualizar({
        tipo: 'success',
        message: typeof exito === 'function' ? exito(val) : exito,
        duracion: 3500,
      });
      return val;
    },
    (err) => {
      _toasts.get(id)?.actualizar({
        tipo: 'error',
        message: typeof error === 'function' ? error(err) : error,
        duracion: 4500,
      });
      throw err;
    },
  );
};
