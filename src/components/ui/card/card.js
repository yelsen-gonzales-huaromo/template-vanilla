import { crearEl } from '../../../utils/helpers/dom.js';

/**
 * Tarjeta — contenedor estructurado con cabecera, cuerpo, pie y muchas variantes.
 *
 * @param {string|Node} [titulo]
 * @param {string} [subtitulo]
 * @param {Node} [accionCabecera]
 * @param {Node|Node[]} [hijos]      Cuerpo de la tarjeta.
 * @param {Node} [pie]
 * @param {string} [variante]        '' | 'flat' | 'elevated' | 'brand' | 'interactive'
 *                                   | 'acento' | 'flotante' | 'compacto' | 'sin-borde'
 *                                   | 'destacada' | 'vidrio' | 'lineas'
 * @param {Node} [decoracion]        SVG/Node decorativo posicionado detrás del
 *                                   contenido (equivalente al `bg-holder` de
 *                                   Falcon). Útil para intro cards con flair.
 *                                   Se oculta en pantallas pequeñas.
 */
export const Tarjeta = ({
  titulo, subtitulo, accionCabecera, hijos, pie, variante = '', decoracion,
  ...resto
} = {}) =>
  crearEl('section', {
    class: ['card', variante && `card--${variante}`, decoracion && 'card--con-decoracion'],
    ...resto,
  }, [
    decoracion && crearEl('div', { class: 'card__decoracion', 'aria-hidden': 'true' }, [decoracion]),
    (titulo || accionCabecera) && crearEl('header', { class: 'card__header' }, [
      crearEl('div', null, [
        titulo && crearEl('h3', { class: 'card__title' }, [titulo]),
        subtitulo && crearEl('p', { class: 'card__subtitle' }, [subtitulo]),
      ]),
      accionCabecera,
    ]),
    crearEl('div', { class: 'card__body' }, [hijos]),
    pie && crearEl('footer', { class: 'card__footer' }, [pie]),
  ]);
