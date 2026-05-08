/**
 * Adaptador para Font Awesome 6 — librería de iconos vectoriales.
 *  https://fontawesome.com/
 *
 * Una vez activado, usa los iconos en HTML/JSX como `<i class="fa-solid fa-house"></i>`.
 *
 *   import { activarFontAwesome, Icono } from '@/integrations/fontawesome';
 *   await activarFontAwesome();
 *   const i = Icono('house');                 // <i class="fa-solid fa-house"></i>
 *   const j = Icono('star', { tipo: 'regular', tamano: 'lg', color: 'gold' });
 */
import { cargarCss } from '../_loader.js';

const VERSION = '6.7.1';
const URL_CSS = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@${VERSION}/css/all.min.css`;

let activado = false;

/** Carga el CSS de FontAwesome. Idempotente. */
export const activarFontAwesome = () => {
  if (activado) return;
  cargarCss(URL_CSS);
  activado = true;
};

/**
 * Crea un elemento <i> con el icono indicado.
 * @param {string} nombre    — sin prefijo, p. ej. 'house', 'envelope', 'gear'.
 * @param {object} [opts]
 * @param {'solid'|'regular'|'light'|'brands'} [opts.tipo='solid']
 * @param {'xs'|'sm'|'lg'|'xl'|'2x'|'3x'} [opts.tamano]
 * @param {string} [opts.color]
 * @param {boolean} [opts.spin]
 */
export const Icono = (nombre, { tipo = 'solid', tamano, color, spin = false } = {}) => {
  activarFontAwesome();
  const i = document.createElement('i');
  const clases = [`fa-${tipo}`, `fa-${nombre}`];
  if (tamano) clases.push(`fa-${tamano}`);
  if (spin) clases.push('fa-spin');
  i.className = clases.join(' ');
  if (color) i.style.color = color;
  i.setAttribute('aria-hidden', 'true');
  return i;
};
