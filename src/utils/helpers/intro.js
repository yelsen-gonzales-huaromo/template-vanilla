/**
 * Intro overlay — pantalla "Iniciando template-vanilla…" mostrada únicamente como
 * transición deliberada entre el submit del login (o registro) y la llegada
 * al panel. NO se usa en cold load / F5: ahí el router muestra esqueleto.
 *
 * Es un nodo independiente montado en <body>, así que sobrevive al swap del
 * router (que reemplaza el contenido de #app) y queda visible mientras la
 * primera ruta protegida termina de cargarse.
 *
 *   await mostrarIntro({ duracion: 700 });
 *   navegarA('/panel');
 */
import { crearEl } from './dom.js';
import { CONFIG_APP } from '../../config/app.config.js';

let overlayActivo = null;

export const mostrarIntro = ({ duracion = 800, mensaje } = {}) => {
  // Si ya hay uno visible, no apilamos — sólo extendemos el tiempo.
  if (overlayActivo) {
    return new Promise(resolver => setTimeout(resolver, duracion));
  }

  const texto = mensaje || `Iniciando ${CONFIG_APP.nombre}…`;
  const overlay = crearEl('div', {
    class: 'boot boot--intro',
    role: 'status',
    'aria-live': 'polite',
  }, [
    crearEl('div', { class: 'boot__mark' }),
    crearEl('p', null, [texto]),
  ]);

  document.body.appendChild(overlay);
  overlayActivo = overlay;

  return new Promise(resolver => {
    setTimeout(() => {
      overlay.classList.add('boot--saliendo');
      // El fade de salida coincide con la transición declarada en main.css.
      setTimeout(() => {
        overlay.remove();
        if (overlayActivo === overlay) overlayActivo = null;
        resolver();
      }, 240);
    }, duracion);
  });
};

/** Cierra inmediatamente el overlay si estuviera visible (uso poco común). */
export const cerrarIntro = () => {
  if (!overlayActivo) return;
  overlayActivo.remove();
  overlayActivo = null;
};
