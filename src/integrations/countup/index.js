/**
 * Adaptador para CountUp.js — animación numérica.
 *  https://inorganik.github.io/countUp.js/
 *
 *   const span = document.createElement('span');
 *   await Contador({ elemento: span, valor: 12480 });    // → cuenta de 0 a 12.480
 *
 *   // o si quieres aplicarlo a TODOS los `[data-countup]` de la página:
 *   await aplicarContadores();
 */
import { cargarLib } from '../_loader.js';

const VERSION = '2.8.0';
const URL_JS = `https://cdn.jsdelivr.net/npm/countup.js@${VERSION}/dist/countUp.umd.js`;

export const cargarCountUp = async () => {
  const mod = await cargarLib({ scripts: URL_JS, global: 'countUp' });
  // El UMD expone `countUp.CountUp`.
  return mod?.CountUp || window.countUp.CountUp;
};

/**
 * Anima un número en el elemento dado.
 * @param {object} opts
 * @param {HTMLElement} opts.elemento
 * @param {number}      opts.valor
 * @param {number}      [opts.duracion=2]   — segundos.
 * @param {number}      [opts.decimales=0]
 * @param {string}      [opts.prefijo]
 * @param {string}      [opts.sufijo]
 * @returns {Promise<object>} instancia.
 */
export const Contador = async ({
  elemento, valor, duracion = 2, decimales = 0, prefijo = '', sufijo = '',
} = {}) => {
  const CountUp = await cargarCountUp();
  const c = new CountUp(elemento, valor, {
    duration: duracion,
    decimalPlaces: decimales,
    prefix: prefijo,
    suffix: sufijo,
    separator: '.',
    decimal: ',',
    enableScrollSpy: false,
  });
  if (!c.error) c.start();
  else console.warn('[countup]', c.error);
  return c;
};

/**
 * Recorre el DOM buscando elementos `[data-countup="<valor>"]` y los anima
 * cuando entran en el viewport. Llama esto una vez por página.
 *
 *   <span data-countup="12480" data-countup-prefijo="$"></span>
 */
export const aplicarContadores = async (raiz = document) => {
  const CountUp = await cargarCountUp();
  const observador = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      const el = e.target;
      const valor = parseFloat(el.dataset.countup);
      if (Number.isNaN(valor)) continue;
      const c = new CountUp(el, valor, {
        duration: parseFloat(el.dataset.countupDuracion || '2'),
        decimalPlaces: parseInt(el.dataset.countupDecimales || '0', 10),
        prefix: el.dataset.countupPrefijo || '',
        suffix: el.dataset.countupSufijo || '',
        separator: '.',
        decimal: ',',
      });
      if (!c.error) c.start();
      observador.unobserve(el);
    }
  }, { threshold: 0.4 });

  raiz.querySelectorAll('[data-countup]').forEach(el => observador.observe(el));
  return () => observador.disconnect();
};
