/**
 * Adaptador para SimpleBar — scrollbars personalizadas (cross-browser).
 *  https://grsmto.github.io/simplebar/
 *
 *   const div = document.createElement('div');
 *   await aplicarScrollbar(div);
 *   div.style.maxHeight = '300px';
 *   // Ahora el scroll es bonito en cualquier navegador.
 */
import { cargarLib } from '../_loader.js';

const VERSION = '6.2.7';
const URL_CSS = `https://cdn.jsdelivr.net/npm/simplebar@${VERSION}/dist/simplebar.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/simplebar@${VERSION}/dist/simplebar.min.js`;

export const cargarSimpleBar = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'SimpleBar',
});

/** Aplica scroll personalizada a un elemento. Devuelve la instancia. */
export const aplicarScrollbar = async (elemento, opciones = {}) => {
  const SimpleBar = await cargarSimpleBar();
  return new SimpleBar(elemento, {
    autoHide: true,
    forceVisible: false,
    ...opciones,
  });
};
