/**
 * LottieIcon — abstracción de alto nivel para usar animaciones del catálogo
 * por ID, sin acordarse de URLs ni rutas.
 *
 *   LottieIcon('check')                 → busca 'check' en cualquier categoría
 *   LottieIcon('check', { tamano: 80 })
 *   LottieIcon('searching-free', { hover: true })
 *
 * Si el id no existe en el catálogo, muestra un fallback con el id en gris.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Lottie } from './lottie.js';
import { LOTTIE_TODAS, resolverFuenteLottie } from '../../common/lottie-catalog/lottie-catalog.js';

const _porId = new Map();
LOTTIE_TODAS.forEach((it) => _porId.set(it.id, it));

export const LottieIcon = (id, {
  tamano = 64,
  loop = true,
  autoplay = true,
  velocidad = 1,
  hover = false,
} = {}) => {
  const item = _porId.get(id);
  const host = crearEl('span', {
    class: 'lottie-icon',
    style: {
      display: 'inline-block',
      width: typeof tamano === 'number' ? `${tamano}px` : tamano,
      height: typeof tamano === 'number' ? `${tamano}px` : tamano,
    },
  });

  if (!item) {
    host.textContent = `?${id}?`;
    host.style.color = 'var(--muted-foreground)';
    host.style.fontSize = '0.7rem';
    host.style.fontFamily = 'var(--font-mono, monospace)';
    return host;
  }

  resolverFuenteLottie(item).then((src) => {
    host.replaceChildren(Lottie({
      src,
      ancho: '100%', alto: '100%',
      loop, autoplay, velocidad, hover,
    }));
  });

  return host;
};

/** Devuelve true si el id existe en el catálogo. */
export const existeLottieIcon = (id) => _porId.has(id);

/** Lista todos los IDs disponibles. */
export const idsLottieIconos = () => [..._porId.keys()];
