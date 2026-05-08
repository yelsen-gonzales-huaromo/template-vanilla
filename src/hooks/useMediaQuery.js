import { senal } from '../utils/helpers/reactive.js';

/**
 * Hook reactivo de media-query — la señal `coincide` cambia automáticamente con el viewport.
 * Sirve para alternar variantes responsivas (drawer móvil vs sidebar desktop).
 */
export const usarMedia = (consulta) => {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return senal(false);
  }
  const mql = window.matchMedia(consulta);
  const coincide = senal(mql.matches);
  const manejador = (e) => { coincide.value = e.matches; };
  mql.addEventListener('change', manejador);
  return coincide;
};

export const usarPuntoQuiebre = () => ({
  esMovil:    usarMedia('(max-width: 767.98px)'),
  esTablet:   usarMedia('(min-width: 768px) and (max-width: 1023.98px)'),
  esEscritorio: usarMedia('(min-width: 1024px)'),
  prefiereOscuro: usarMedia('(prefers-color-scheme: dark)'),
});
