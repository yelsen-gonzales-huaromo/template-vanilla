/**
 * Decoraciones para `Tarjeta({ decoracion: ... })`.
 *
 * Equivalente al `bg-holder` de Falcon. Dos familias:
 *
 *   1) IMAGEN (PNGs migrados de Falcon — public/img/illustrations/corner-*.png)
 *      Usa estas para replicar exactamente el look de Falcon.
 *      Funciones: corner1() … corner7(), bgShape(), halfCircle()
 *
 *   2) SVG inline (theme-aware — colores se adaptan al tema activo)
 *      Útiles cuando quieres que el ornamento cambie con dark/light mode.
 *      Funciones: esquinaCircular, esquinaOndas, esquinaGeometrica,
 *                 esquinaPuntos, esquinaBlob.
 *
 * Uso:
 *   import { corner4, esquinaOndas } from '.../card-decoraciones.js';
 *   Tarjeta({ decoracion: corner4(), variante: 'acento', hijos: ... })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

const RUTA_ILUSTRACIONES = './public/img/illustrations';

/* ===========================================================================
   FAMILIA 1 — Imágenes (PNGs migrados de Falcon)
   =========================================================================== */

/**
 * Decoración basada en imagen — un div con `background-image`.
 * Por defecto se posiciona top-right (estilo Falcon corner-N).
 */
const imagen = (archivo) => crearEl('div', {
  class: 'tarjeta-deco-img',
  style: { backgroundImage: `url('${RUTA_ILUSTRACIONES}/${archivo}')` },
  'aria-hidden': 'true',
});

/** Triángulos azul-verdes (esquina derecha completa). */
export const corner1     = () => imagen('corner-1.png');
/** Curvas onduladas suaves. */
export const corner2     = () => imagen('corner-2.png');
/** Patrón de puntos sutiles. */
export const corner3     = () => imagen('corner-3.png');
/** Capas curvas oscuras (estilo Falcon Alerts). */
export const corner4     = () => imagen('corner-4.png');
/** Triángulos en gradiente. */
export const corner5     = () => imagen('corner-5.png');
/** Mancha orgánica en gradiente azul. */
export const corner6     = () => imagen('corner-6.png');
/** Geometría tenue. */
export const corner7     = () => imagen('corner-7.png');
/** Forma diagonal con olas. */
export const bgShape     = () => imagen('bg-shape.png');
/** Semicírculo (medio círculo). */
export const halfCircle  = () => imagen('half-circle.png');

/** Catálogo (key → factory) — útil para renderizar pickers. */
export const CORNERS = {
  'corner-1': corner1, 'corner-2': corner2, 'corner-3': corner3,
  'corner-4': corner4, 'corner-5': corner5, 'corner-6': corner6,
  'corner-7': corner7, 'bg-shape': bgShape, 'half-circle': halfCircle,
};

/* ===========================================================================
   FAMILIA 2 — SVG inline (theme-aware)
   =========================================================================== */

const ns = (tag, attrs = {}, children = []) => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  children.forEach((c) => c && el.appendChild(c));
  return el;
};
const svg = (attrs, children) => ns('svg', { xmlns: 'http://www.w3.org/2000/svg', ...attrs }, children);

export const esquinaCircular = () => svg({
  class: 'tarjeta-deco tarjeta-deco--circular',
  viewBox: '0 0 600 300', preserveAspectRatio: 'xMaxYMin slice',
  'aria-hidden': 'true',
}, [
  ns('circle', { cx: 580, cy: -40, r: 220, fill: 'var(--primary)',       opacity: '0.10' }),
  ns('circle', { cx: 580, cy: -40, r: 160, fill: 'var(--primary)',       opacity: '0.10' }),
  ns('circle', { cx: 580, cy: -40, r: 100, fill: 'var(--color-success)', opacity: '0.10' }),
  ns('circle', { cx: 580, cy: -40, r: 50,  fill: 'var(--color-success)', opacity: '0.12' }),
]);

export const esquinaOndas = () => svg({
  class: 'tarjeta-deco tarjeta-deco--ondas',
  viewBox: '0 0 600 300', preserveAspectRatio: 'xMaxYMid slice',
  'aria-hidden': 'true',
}, [
  ns('path', { d: 'M340 300 C 380 220, 470 200, 600 220 L 600 300 Z',
    fill: 'var(--primary)', opacity: '0.10' }),
  ns('path', { d: 'M380 300 C 430 240, 510 230, 600 250 L 600 300 Z',
    fill: 'var(--color-success)', opacity: '0.10' }),
  ns('path', { d: 'M450 300 C 490 270, 540 270, 600 280 L 600 300 Z',
    fill: 'var(--color-info)', opacity: '0.10' }),
]);

export const esquinaGeometrica = () => svg({
  class: 'tarjeta-deco tarjeta-deco--geo',
  viewBox: '0 0 600 300', preserveAspectRatio: 'xMaxYMid slice',
  'aria-hidden': 'true',
}, [
  ns('polygon', { points: '600,0 600,180 460,0',           fill: 'var(--primary)',       opacity: '0.12' }),
  ns('polygon', { points: '600,80 600,300 380,300',        fill: 'var(--color-success)', opacity: '0.10' }),
  ns('polygon', { points: '460,0 600,180 600,80 540,40',   fill: 'var(--primary)',       opacity: '0.06' }),
]);

export const esquinaPuntos = () => {
  const puntos = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 12; col++) {
      const x = 280 + col * 28;
      const y = 30  + row * 28;
      const opacity = ((row + col) % 3 === 0) ? 0.30 : 0.12;
      puntos.push(ns('circle', { cx: x, cy: y, r: 2.5, fill: 'var(--primary)', opacity }));
    }
  }
  return svg({
    class: 'tarjeta-deco tarjeta-deco--puntos',
    viewBox: '0 0 600 300', preserveAspectRatio: 'xMaxYMid slice',
    'aria-hidden': 'true',
  }, puntos);
};

export const esquinaBlob = () => svg({
  class: 'tarjeta-deco tarjeta-deco--blob',
  viewBox: '0 0 600 300', preserveAspectRatio: 'xMaxYMid slice',
  'aria-hidden': 'true',
}, [
  ns('ellipse', { cx: 540, cy: 60,  rx: 180, ry: 110, fill: 'var(--primary)',       opacity: '0.18',
    transform: 'rotate(20 540 60)' }),
  ns('ellipse', { cx: 580, cy: 230, rx: 160, ry: 90,  fill: 'var(--color-success)', opacity: '0.15',
    transform: 'rotate(-12 580 230)' }),
  ns('ellipse', { cx: 460, cy: 150, rx: 90,  ry: 60,  fill: 'var(--color-info)',    opacity: '0.10' }),
]);

export const DECORACIONES = {
  circular:   esquinaCircular,
  ondas:      esquinaOndas,
  geometrica: esquinaGeometrica,
  puntos:     esquinaPuntos,
  blob:       esquinaBlob,
};
