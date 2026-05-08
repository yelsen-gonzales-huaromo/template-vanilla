/**
 * Adaptador para rater-js — sistema de valoración por estrellas.
 *  https://github.com/fredolss/rater-js
 *
 *   const { contenedor, instancia } = await Valoracion({
 *     valor: 4.2,
 *     maxEstrellas: 5,
 *     soloLectura: false,
 *     alCambiar: (rating) => api.actualizar(rating),
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '0.5.1';
const URL_JS = `https://cdn.jsdelivr.net/npm/rater-js@${VERSION}/rater-js.min.js`;

export const cargarRater = () => cargarLib({ scripts: URL_JS, global: 'raterJs' });

/**
 * @param {object} opts
 * @param {number}   [opts.valor=0]
 * @param {number}   [opts.maxEstrellas=5]
 * @param {boolean}  [opts.soloLectura=false]
 * @param {Function} [opts.alCambiar]
 */
export const Valoracion = async ({
  valor = 0, maxEstrellas = 5, soloLectura = false, alCambiar,
} = {}) => {
  const raterJs = await cargarRater();
  const contenedor = document.createElement('div');
  const instancia = raterJs({
    element: contenedor,
    rating: valor,
    max: maxEstrellas,
    readOnly: soloLectura,
    starSize: 20,
    rateCallback(rating, hecho) {
      instancia.setRating(rating);
      alCambiar?.(rating);
      hecho();
    },
  });
  return { contenedor, instancia };
};
