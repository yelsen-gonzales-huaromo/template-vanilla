/**
 * Adaptador para Lottie — animaciones vectoriales (After Effects → JSON).
 *  https://github.com/airbnb/lottie-web
 *
 *   const { contenedor, instancia } = await Animacion({
 *     url: '/animaciones/loader.json',
 *     bucle: true,
 *   });
 *
 *   // Control:
 *   instancia.play(); instancia.pause(); instancia.setSpeed(1.5);
 */
import { cargarLib } from '../_loader.js';

const VERSION = '5.12.2';
const URL_JS = `https://cdn.jsdelivr.net/npm/lottie-web@${VERSION}/build/player/lottie.min.js`;

export const cargarLottie = () => cargarLib({ scripts: URL_JS, global: 'lottie' });

/**
 * @param {object} opts
 * @param {string|object} opts.url      — URL al JSON o el JSON directamente (animationData).
 * @param {boolean} [opts.bucle=true]
 * @param {boolean} [opts.autoplay=true]
 * @param {string}  [opts.alto='200px']
 * @param {string}  [opts.ancho='100%']
 */
export const Animacion = async ({
  url, bucle = true, autoplay = true, alto = '200px', ancho = '100%',
} = {}) => {
  const lottie = await cargarLottie();
  const contenedor = document.createElement('div');
  contenedor.style.width = ancho;
  contenedor.style.height = alto;

  const config = {
    container: contenedor,
    renderer: 'svg',
    loop: bucle,
    autoplay,
  };
  if (typeof url === 'string') config.path = url;
  else config.animationData = url;

  const instancia = lottie.loadAnimation(config);
  return { contenedor, instancia };
};
