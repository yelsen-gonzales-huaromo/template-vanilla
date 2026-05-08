import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../icon/icons.js';

/* Singleton: sólo un dropdown puede estar abierto a la vez. Al abrir uno
   nuevo, el activo anterior se cierra automáticamente. */
let _cerrarActivo = null;

/** Cierra el dropdown actualmente abierto (si lo hay). Útil cuando se navega
 *  desde un contenido custom (p.ej. los items del launcher de apps). */
export const cerrarMenuActivo = () => { _cerrarActivo?.(); };

/**
 * Calcula la posición del menú según el rect del disparador y la dirección
 * solicitada. Devuelve { top, left } absolutos para `position: fixed`.
 */
const calcularPosicion = (rectDisp, rectMenu, direccion, alineacion) => {
  const margen = 8; // var(--space-2)
  let top = 0, left = 0;
  if (direccion === 'down') {
    top = rectDisp.bottom + margen;
    left = alineacion === 'end'
      ? rectDisp.right - rectMenu.width
      : rectDisp.left;
  } else if (direccion === 'up') {
    top = rectDisp.top - rectMenu.height - margen;
    left = alineacion === 'end'
      ? rectDisp.right - rectMenu.width
      : rectDisp.left;
  } else if (direccion === 'right') {
    left = rectDisp.right + margen;
    top = alineacion === 'end'
      ? rectDisp.bottom - rectMenu.height
      : rectDisp.top;
  } else if (direccion === 'left') {
    left = rectDisp.left - rectMenu.width - margen;
    top = alineacion === 'end'
      ? rectDisp.bottom - rectMenu.height
      : rectDisp.top;
  }
  // Clamp dentro de la ventana
  const vw = window.innerWidth, vh = window.innerHeight;
  left = Math.max(margen, Math.min(left, vw - rectMenu.width - margen));
  top  = Math.max(margen, Math.min(top,  vh - rectMenu.height - margen));
  return { top, left };
};

/**
 * Renderiza un item de menú según su shape.
 * Items soportados:
 *   { etiqueta, icono?, alSeleccionar?, peligro?, seleccionado?, descripcion?, atajo?, deshabilitado? }
 *   { separador: true }
 *   { grupo: 'Texto del label' }
 */
const renderizarItem = (item, cerrar) => {
  if (item.separador) return crearEl('div', { class: 'dropdown__separator', role: 'separator' });
  if (item.grupo)     return crearEl('div', { class: 'dropdown__label' }, [item.grupo]);

  const cuerpo = item.descripcion
    ? crearEl('span', { class: 'dropdown__item-textos' }, [
        crearEl('span', { class: 'dropdown__item-etiqueta' }, [item.etiqueta]),
        crearEl('span', { class: 'dropdown__item-desc' }, [item.descripcion]),
      ])
    : crearEl('span', { class: 'dropdown__item-etiqueta' }, [item.etiqueta]);

  return crearEl('button', {
    type: 'button',
    role: item.seleccionado != null ? 'menuitemradio' : 'menuitem',
    'aria-checked': item.seleccionado != null ? String(!!item.seleccionado) : null,
    'aria-disabled': item.deshabilitado ? 'true' : null,
    disabled: item.deshabilitado ? 'disabled' : null,
    class: [
      'dropdown__item',
      item.peligro && 'dropdown__item--danger',
      item.seleccionado && 'dropdown__item--seleccionado',
      item.deshabilitado && 'dropdown__item--deshabilitado',
    ],
    onClick: () => {
      if (item.deshabilitado) return;
      item.alSeleccionar?.();
      if (item.cerrarAlSeleccionar !== false) cerrar();
    },
  }, [
    item.icono && crearEl('span', { class: 'dropdown__item-icono', 'aria-hidden': 'true' }, [item.icono]),
    cuerpo,
    item.atajo && crearEl('kbd', { class: 'dropdown__item-atajo' }, [item.atajo]),
    item.seleccionado && crearEl('span', { class: 'dropdown__item-check', 'aria-hidden': 'true' },
      [Icono('check', { tamano: 14 })]),
  ]);
};

/**
 * Menú desplegable — `disparador` es un nodo, `items` un array.
 *
 * Items soportados:
 *   { etiqueta, icono?, alSeleccionar?, peligro?,
 *     seleccionado?, descripcion?, atajo?, deshabilitado?,
 *     cerrarAlSeleccionar? }   // false → no cierra el menú al hacer click
 *   { separador: true }
 *   { grupo: 'LABEL DEL GRUPO' }
 *
 * Se PORTALEA a document.body con `position: fixed` para escapar de cualquier
 * stacking context del padre — siempre aparece sobre el resto del UI.
 *
 * @param {string} direccion 'down' (default), 'up', 'right', 'left'
 * @param {string} alineacion 'start' | 'end' (default)
 * @param {Node} encabezado Nodo opcional al inicio del menú.
 * @param {Node} pie Nodo opcional al final del menú.
 * @param {Node} cuerpo Nodo opcional que reemplaza los items (cuerpo libre).
 * @param {string} ancho ancho mínimo del menú ('14rem' default, ej. '20rem')
 * @param {boolean} cerrarAlClickFuera default true
 */
export const MenuDesplegable = ({
  disparador, items = [],
  direccion = 'down', alineacion = 'end',
  encabezado, pie, cuerpo,
  ancho,
  cerrarAlClickFuera = true,
} = {}) => {
  const contenedor = crearEl('div', { class: 'dropdown' });
  let menu = null;
  let limpieza = null;

  const cerrar = () => {
    limpieza?.(); limpieza = null;
    menu?.remove(); menu = null;
    disparador.setAttribute('aria-expanded', 'false');
    if (_cerrarActivo === cerrar) _cerrarActivo = null;
  };

  const reposicionar = () => {
    if (!menu) return;
    const rectDisp = disparador.getBoundingClientRect();
    const rectMenu = menu.getBoundingClientRect();
    const { top, left } = calcularPosicion(rectDisp, rectMenu, direccion, alineacion);
    menu.style.top = `${top}px`;
    menu.style.left = `${left}px`;
  };

  const abrir = () => {
    if (menu) return;
    if (_cerrarActivo && _cerrarActivo !== cerrar) _cerrarActivo();

    menu = crearEl('div', {
      class: [
        'dropdown__menu',
        'dropdown__menu--portal',
        `dropdown__menu--${direccion}`,
        `dropdown__menu--align-${alineacion}`,
      ],
      style: ancho ? { minWidth: ancho } : null,
      role: 'menu',
    }, [
      encabezado,
      cuerpo,
      ...items.map((item) => renderizarItem(item, cerrar)),
      pie,
    ]);

    document.body.appendChild(menu);
    reposicionar();
    disparador.setAttribute('aria-expanded', 'true');

    const onDoc = (e) => {
      if (menu?.contains(e.target) || contenedor.contains(e.target)) return;
      if (cerrarAlClickFuera) cerrar();
    };
    const onScroll = () => reposicionar();
    const onResize = () => reposicionar();
    setTimeout(() => document.addEventListener('click', onDoc), 0);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    limpieza = () => {
      document.removeEventListener('click', onDoc);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
    _cerrarActivo = cerrar;
  };

  disparador.setAttribute('aria-haspopup', 'true');
  disparador.setAttribute('aria-expanded', 'false');
  disparador.addEventListener('click', (e) => { e.stopPropagation(); menu ? cerrar() : abrir(); });
  contenedor.appendChild(disparador);

  // API imperativa por si el consumidor necesita controlar el menú desde fuera
  contenedor._menu = { abrir, cerrar };
  return contenedor;
};
