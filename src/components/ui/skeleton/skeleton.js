/**
 * Esqueleto — placeholder shimmer durante carga.
 *
 *   Esqueleto({ variante: 'text', ancho: '70%' })
 *   Esqueleto({ variante: 'circle', ancho: '48px', alto: '48px' })
 *   Esqueleto({ variante: 'card', alto: '160px' })
 *   Esqueleto({ lineas: 3 })                       // shortcut para 3 párrafos
 *   Esqueleto({ animacion: 'pulse' })              // shimmer | pulse | wave | none
 *
 * Variantes:
 *   text      — línea de texto (12px alto)
 *   title     — título (24px alto)
 *   subtitle  — subtítulo (16px alto)
 *   circle    — círculo perfecto (avatar)
 *   square    — cuadrado con border-radius
 *   card      — bloque grande (imagen, hero)
 *   button    — pill estilo botón
 *   thumbnail — miniatura (aspect-ratio 4/3)
 *   chip      — pill chiquita
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const Esqueleto = ({
  variante = '', ancho, alto, lineas, animacion = 'shimmer',
  ...resto
} = {}) => {
  // Shortcut para múltiples líneas — devuelve un wrapper con N esqueletos de texto
  if (lineas && lineas > 1) {
    return crearEl('div', { class: 'skeleton-grupo' },
      Array.from({ length: lineas }, (_, i) => crearEl('span', {
        class: ['skeleton', 'skeleton--text', animacion !== 'shimmer' && `skeleton--${animacion}`],
        // La última línea sale más corta (look natural)
        style: i === lineas - 1 ? { width: '60%' } : null,
        'aria-hidden': 'true',
      })),
    );
  }

  return crearEl('span', {
    class: [
      'skeleton',
      variante && `skeleton--${variante}`,
      animacion !== 'shimmer' && `skeleton--${animacion}`,
    ],
    style: { ...(ancho && { width: ancho }), ...(alto && { height: alto }) },
    'aria-hidden': 'true',
    ...resto,
  });
};
