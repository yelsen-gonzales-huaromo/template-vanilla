import { crearEl } from '../../../utils/helpers/dom.js';

export const EstadoVacio = ({ icono = '∅', titulo = 'Sin datos', descripcion = '', accion } = {}) =>
  crearEl('div', { class: 'empty-state', role: 'status' }, [
    crearEl('div', { class: 'empty-state__icon', 'aria-hidden': 'true' }, [icono]),
    crearEl('h3', { class: 'empty-state__title' }, [titulo]),
    descripcion && crearEl('p', { class: 'empty-state__description' }, [descripcion]),
    accion,
  ]);
