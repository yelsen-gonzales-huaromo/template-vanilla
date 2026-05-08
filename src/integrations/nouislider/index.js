/**
 * Adaptador para noUiSlider — range slider (1 o 2 manijas).
 *  https://refreshless.com/nouislider/
 *
 *   const { contenedor, instancia } = await RangoSlider({
 *     min: 0, max: 1000, valor: [200, 800],
 *     alCambiar: ([min, max]) => console.log(min, max),
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '15.8.1';
const URL_CSS = `https://cdn.jsdelivr.net/npm/nouislider@${VERSION}/dist/nouislider.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/nouislider@${VERSION}/dist/nouislider.min.js`;

export const cargarNoUiSlider = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'noUiSlider',
});

/**
 * @param {object} opts
 * @param {number}        opts.min
 * @param {number}        opts.max
 * @param {number|number[]} opts.valor   — número (single) o [a,b] (rango).
 * @param {number}        [opts.paso=1]
 * @param {Function}      [opts.alCambiar]  — recibe el valor formateado.
 */
export const RangoSlider = async ({
  min, max, valor, paso = 1, alCambiar,
} = {}) => {
  const noUiSlider = await cargarNoUiSlider();
  const contenedor = document.createElement('div');
  contenedor.style.padding = 'var(--space-3) var(--space-2)';

  const esRango = Array.isArray(valor);
  noUiSlider.create(contenedor, {
    start: valor,
    connect: esRango ? true : 'lower',
    range: { min, max },
    step: paso,
    tooltips: true,
    format: {
      to: (v) => Math.round(v),
      from: (v) => Number(v),
    },
  });

  if (alCambiar) {
    contenedor.noUiSlider.on('update', (vals) => {
      const out = vals.map(Number);
      alCambiar(esRango ? out : out[0]);
    });
  }

  return { contenedor, instancia: contenedor.noUiSlider };
};
