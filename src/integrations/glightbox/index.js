/**
 * Adaptador para GLightbox — visor de imágenes/vídeos en lightbox.
 *  https://biati-digital.github.io/glightbox/
 *
 *   await activarLightbox();   // anchors con `[data-lightbox]` se vuelven lightbox.
 *
 *   <a href="foto.jpg" data-lightbox><img src="foto.jpg" /></a>
 */
import { cargarLib } from '../_loader.js';

const VERSION = '3.3.0';
const URL_CSS = `https://cdn.jsdelivr.net/npm/glightbox@${VERSION}/dist/css/glightbox.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/glightbox@${VERSION}/dist/js/glightbox.min.js`;

let instancia = null;

export const cargarGLightbox = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'GLightbox',
});

/** Activa el lightbox global. Re-llama si añades nuevos enlaces. */
export const activarLightbox = async (selector = '[data-lightbox]') => {
  const GLightbox = await cargarGLightbox();
  if (instancia) instancia.destroy();
  instancia = GLightbox({ selector, touchNavigation: true, loop: true });
  return instancia;
};

export const cerrarLightbox = () => instancia?.close();
