/**
 * Tooltip — información contextual al hover/focus.
 *
 *   Tooltip({ texto: 'Editar',  hijos: Boton(...) })
 *   Tooltip({ texto: 'Buscar',  posicion: 'bottom', hijos: ... })
 *   Tooltip({ texto: 'Guardar', atajo: '⌘S', hijos: ... })
 *   Tooltip({ titulo: 'Storage', descripcion: 'Usado: 1.2 GB de 2 GB', hijos: ... })
 *   Tooltip({ texto: 'Info', tema: 'claro', flecha: true, hijos: ... })
 *
 * Props:
 *   texto       — string simple
 *   titulo      — título en bold (rich tooltip)
 *   descripcion — descripción debajo del título
 *   atajo       — atajo de teclado (kbd) a la derecha del texto
 *   posicion    — 'top' (default) | 'bottom' | 'left' | 'right'
 *   tema        — 'oscuro' (default) | 'claro' | 'primary'
 *   flecha      — agrega arrow indicator
 *   tamano      — 'sm' | 'md' (default)
 *   delay       — ms antes de mostrar (default 100ms)
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const Tooltip = ({
  texto, titulo, descripcion, atajo,
  posicion = 'top', tema = 'oscuro', tamano = 'md',
  flecha = false, delay = 100,
  hijos,
} = {}) => {
  const contenido = [];
  if (titulo) {
    contenido.push(crearEl('strong', { class: 'tooltip__titulo' }, [titulo]));
    if (descripcion) contenido.push(crearEl('span', { class: 'tooltip__desc' }, [descripcion]));
  } else if (texto) {
    contenido.push(crearEl('span', { class: 'tooltip__txt' }, [texto]));
    if (atajo) contenido.push(crearEl('kbd', { class: 'tooltip__kbd' }, [atajo]));
  }

  const tip = crearEl('span', {
    class: [
      'tooltip',
      `tooltip--${posicion}`,
      tema !== 'oscuro' && `tooltip--${tema}`,
      tamano !== 'md' && `tooltip--${tamano}`,
      flecha && 'tooltip--flecha',
      (titulo || atajo) && 'tooltip--rico',
    ],
    role: 'tooltip',
    style: delay ? { transitionDelay: `${delay}ms` } : null,
  }, contenido);

  return crearEl('span', {
    class: ['tooltip-host', `tooltip-host--${posicion}`],
    tabindex: hijos?.tagName === 'BUTTON' || hijos?.tagName === 'A' ? null : '0',
  }, [hijos, tip]);
};
