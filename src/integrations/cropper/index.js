/**
 * Adaptador para Cropper.js — recortador de imágenes.
 *  https://github.com/fengyuanchen/cropperjs
 *
 *   const cropper = await activarCropper(imgEl, { aspectRatio: 16/9 });
 *   const canvas  = cropper.getCroppedCanvas({ width: 800 });
 *   cropper.destroy();
 */
import { cargarLib } from '../_loader.js';

const VERSION = '1.6.2';
const URL_CSS = `https://cdn.jsdelivr.net/npm/cropperjs@${VERSION}/dist/cropper.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/cropperjs@${VERSION}/dist/cropper.min.js`;

export const cargarCropper = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'Cropper',
});

/**
 * Crea una instancia de Cropper sobre un <img> ya cargado.
 *  - `imgEl`: elemento <img> (debe tener `src` válido).
 *  - `opciones`: pasadas tal cual a Cropper (aspectRatio, viewMode, etc.).
 */
export const activarCropper = async (imgEl, opciones = {}) => {
  const Cropper = await cargarCropper();
  return new Cropper(imgEl, {
    viewMode: 1,            // limita el crop dentro de la imagen
    dragMode: 'move',
    autoCropArea: 0.85,
    background: false,      // sin background a cuadros (lo aporta nuestro CSS)
    responsive: true,
    ...opciones,
  });
};
