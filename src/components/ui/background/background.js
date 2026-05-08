/**
 * Fondo — sección con fondo de video/imagen/color/patrón y contenido encima.
 * Estilo "hero section" estilo Falcon Background.
 *
 *   FondoVideo({ src, alto, overlay: 0.5, hijos: nodo })
 *   FondoImagen({ src, alto, overlay: 0.5, hijos })
 *   FondoColor({ color, hijos })
 *   FondoGradiente({ gradiente, hijos })
 *   FondoPatron({ tipo: 'puntos' | 'lineas' | 'cuadricula', hijos })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

const baseEstilo = (alto) => ({
  position: 'relative',
  width: '100%',
  minHeight: alto || '320px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
});

const overlayDiv = (intensidad) => crearEl('div', {
  class: 'fondo__overlay',
  style: {
    position: 'absolute', inset: 0,
    background: `rgba(0, 0, 0, ${intensidad})`,
    pointerEvents: 'none',
  },
});

const contenidoDiv = (hijos, color = '#fff') => crearEl('div', {
  class: 'fondo__contenido',
  style: {
    position: 'relative', zIndex: 1,
    color, textAlign: 'center',
    padding: 'var(--space-6) var(--space-5)',
    width: '100%',
  },
}, [hijos]);

export const FondoVideo = ({ src, poster, alto = '320px', overlay = 0.5, hijos } = {}) => {
  const video = crearEl('video', {
    class: 'fondo__video',
    autoplay: 'true', muted: 'true', loop: 'true', playsinline: 'true',
    poster, preload: 'auto',
    style: {
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      objectFit: 'cover',
    },
  }, [crearEl('source', { src, type: 'video/mp4' })]);
  return crearEl('section', { class: 'fondo fondo--video', style: baseEstilo(alto) }, [
    video, overlayDiv(overlay), contenidoDiv(hijos),
  ]);
};

export const FondoImagen = ({ src, alto = '320px', overlay = 0.5, posicion = 'center', hijos } = {}) =>
  crearEl('section', {
    class: 'fondo fondo--imagen',
    style: {
      ...baseEstilo(alto),
      backgroundImage: `url('${src}')`,
      backgroundSize: 'cover',
      backgroundPosition: posicion,
      backgroundRepeat: 'no-repeat',
    },
  }, [overlayDiv(overlay), contenidoDiv(hijos)]);

export const FondoColor = ({ color = 'var(--primary)', alto = '260px', hijos } = {}) =>
  crearEl('section', {
    class: 'fondo fondo--color',
    style: { ...baseEstilo(alto), background: color },
  }, [contenidoDiv(hijos)]);

export const FondoGradiente = ({
  gradiente = 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  alto = '260px', hijos,
} = {}) =>
  crearEl('section', {
    class: 'fondo fondo--gradiente',
    style: { ...baseEstilo(alto), background: gradiente },
  }, [contenidoDiv(hijos)]);

const PATRONES = {
  puntos: {
    background: 'var(--surface)',
    backgroundImage: 'radial-gradient(circle, color-mix(in srgb, var(--foreground) 20%, transparent) 1.2px, transparent 1.2px)',
    backgroundSize: '18px 18px',
  },
  lineas: {
    background: 'var(--surface)',
    backgroundImage: 'repeating-linear-gradient(45deg, color-mix(in srgb, var(--foreground) 6%, transparent) 0 1px, transparent 1px 14px)',
  },
  cuadricula: {
    background: 'var(--surface)',
    backgroundImage:
      'linear-gradient(color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px),' +
      'linear-gradient(90deg, color-mix(in srgb, var(--foreground) 10%, transparent) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
};

export const FondoPatron = ({ tipo = 'puntos', alto = '260px', hijos } = {}) =>
  crearEl('section', {
    class: ['fondo', `fondo--patron`, `fondo--patron-${tipo}`],
    style: { ...baseEstilo(alto), color: 'var(--foreground)', ...PATRONES[tipo] },
  }, [contenidoDiv(hijos, 'var(--foreground)')]);
