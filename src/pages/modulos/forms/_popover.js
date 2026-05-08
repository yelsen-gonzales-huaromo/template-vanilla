/**
 * Popover manager — un solo panel flotante abierto a la vez en toda la app.
 * Usado por los pickers (color/date/time/phone) y los selects modernos.
 *
 * Características:
 *  - position: absolute con coordenadas de página (rect.top + window.scrollY),
 *    así el panel sobrevive al scroll sin saltar como con position: fixed.
 *  - Hereda min-width del trigger (input ancho → panel ancho).
 *  - Cierre con click-fuera, ESC, resize.
 *  - Auto-flip arriba si no cabe debajo del trigger en la viewport visible.
 */
import { crearEl } from '../../../utils/helpers/dom.js';

let _cerrarPopoverActual = null;

export const cerrarPopoverActivo = () => {
  if (_cerrarPopoverActual) _cerrarPopoverActual();
};

const posicionar = (panel, ancla) => {
  const r = ancla.getBoundingClientRect();
  const altoPanel = panel.offsetHeight || 200;
  const espacioAbajo = window.innerHeight - r.bottom;
  const espacioArriba = r.top;
  // Si no cabe debajo y arriba hay más espacio, abrimos arriba.
  const arriba = espacioAbajo < altoPanel + 16 && espacioArriba > espacioAbajo;

  panel.style.position = 'absolute';
  panel.style.left = `${r.left + window.scrollX}px`;
  panel.style.minWidth = `${r.width}px`;
  if (arriba) {
    panel.style.top = `${r.top + window.scrollY - altoPanel - 6}px`;
    panel.dataset.placement = 'top';
  } else {
    panel.style.top = `${r.bottom + window.scrollY + 6}px`;
    panel.dataset.placement = 'bottom';
  }
};

export const abrirPanel = ({ ancla, contenido, onCerrar, claseExtra }) => {
  cerrarPopoverActivo();

  const panel = crearEl('div', { class: ['picker-panel', claseExtra] }, [contenido]);
  document.body.appendChild(panel);
  posicionar(panel, ancla);
  // Re-posiciona después de medir el panel ya con su contenido.
  requestAnimationFrame(() => {
    posicionar(panel, ancla);
    panel.classList.add('picker-panel--abierto');
  });

  const cerrar = () => {
    panel.classList.remove('picker-panel--abierto');
    document.removeEventListener('mousedown', onClickFuera, true);
    document.removeEventListener('keydown', onKey, true);
    window.removeEventListener('resize', onResize, true);
    window.removeEventListener('scroll', onScroll, true);
    setTimeout(() => panel.remove(), 160);
    _cerrarPopoverActual = null;
    onCerrar && onCerrar();
  };
  const onClickFuera = (e) => {
    if (panel.contains(e.target) || ancla.contains(e.target)) return;
    cerrar();
  };
  const onKey = (e) => { if (e.key === 'Escape') cerrar(); };
  const onResize = () => cerrar();
  const onScroll = () => posicionar(panel, ancla);

  document.addEventListener('mousedown', onClickFuera, true);
  document.addEventListener('keydown', onKey, true);
  window.addEventListener('resize', onResize, true);
  window.addEventListener('scroll', onScroll, true);

  _cerrarPopoverActual = cerrar;
  return cerrar;
};
