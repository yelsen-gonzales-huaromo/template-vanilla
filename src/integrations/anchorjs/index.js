/**
 * Adaptador para AnchorJS — añade enlaces de ancla a los headings (#).
 *  https://www.bryanbraun.com/anchorjs/
 *
 * Útil en páginas de documentación: cada h2/h3 obtiene un icono # al pasar el ratón.
 *
 *   await anchorearTitulos();              // todos los h2-h6 del documento
 *   await anchorearTitulos('h2, h3');      // sólo h2 y h3
 *   await anchorearTitulos('main h2');     // sólo dentro de <main>
 */
import { cargarLib } from '../_loader.js';

const VERSION = '5.0.0';
const URL_JS = `https://cdn.jsdelivr.net/npm/anchor-js@${VERSION}/anchor.min.js`;

export const cargarAnchorJs = () => cargarLib({ scripts: URL_JS, global: 'AnchorJS' });

/**
 * @param {string} [selector='h2, h3, h4']  — selectores CSS de los títulos a marcar.
 * @param {object} [opciones]
 */
export const anchorearTitulos = async (selector = 'h2, h3, h4', opciones = {}) => {
  const AnchorJS = await cargarAnchorJs();
  const anchors = new AnchorJS({
    placement: 'right',
    visible: 'hover',
    icon: '#',
    ...opciones,
  });
  anchors.add(selector);
  return anchors;
};
