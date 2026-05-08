/**
 * Adaptador para Swiper — carrusel/slider táctil.
 *  https://swiperjs.com/
 *
 *   const { contenedor } = await Carrusel({
 *     slides: [crearEl('img', { src: '...' }), ...],
 *     porVista: 3, autoplay: true,
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '11.1.14';
const URL_CSS = `https://cdn.jsdelivr.net/npm/swiper@${VERSION}/swiper-bundle.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/swiper@${VERSION}/swiper-bundle.min.js`;

export const cargarSwiper = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'Swiper',
});

/**
 * Crea un slider Swiper.
 * @param {object} opts
 * @param {Array<HTMLElement>} opts.slides
 * @param {number}  [opts.porVista=1]
 * @param {boolean} [opts.autoplay=false]
 * @param {boolean} [opts.flechas=true]
 * @param {boolean} [opts.bullets=true]
 * @param {boolean} [opts.bucle=false]
 * @param {number}  [opts.espacio=16]
 */
export const Carrusel = async ({
  slides = [],
  porVista = 1,
  autoplay = false,
  flechas = true,
  bullets = true,
  bucle = false,
  espacio = 16,
} = {}) => {
  const Swiper = await cargarSwiper();

  const wrapper = document.createElement('div');
  wrapper.className = 'swiper-wrapper';
  slides.forEach(s => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.appendChild(s);
    wrapper.appendChild(slide);
  });

  const contenedor = document.createElement('div');
  contenedor.className = 'swiper';
  contenedor.appendChild(wrapper);

  if (bullets) {
    const p = document.createElement('div');
    p.className = 'swiper-pagination';
    contenedor.appendChild(p);
  }
  if (flechas) {
    const next = document.createElement('div'); next.className = 'swiper-button-next'; contenedor.appendChild(next);
    const prev = document.createElement('div'); prev.className = 'swiper-button-prev'; contenedor.appendChild(prev);
  }

  // Initialize when in viewport so las medidas son correctas.
  const observador = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) {
      observador.disconnect();
      new Swiper(contenedor, {
        slidesPerView: porVista,
        spaceBetween: espacio,
        loop: bucle,
        autoplay: autoplay ? { delay: 4000, disableOnInteraction: false } : false,
        pagination: bullets ? { el: '.swiper-pagination', clickable: true } : false,
        navigation: flechas ? { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' } : false,
      });
    }
  });
  observador.observe(contenedor);

  return { contenedor };
};
