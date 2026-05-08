/**
 * Popover — flotante con click trigger (a diferencia del Tooltip que es hover).
 * Portaleado a body + position fixed. Sólo un popover abierto a la vez (singleton).
 *
 *   Popover({
 *     disparador: Boton({ texto: 'Más info' }),
 *     titulo: 'Detalles',
 *     contenido: nodo,
 *     pie: nodo,                          // footer (botones)
 *     posicion: 'top'|'bottom'|'left'|'right',
 *     ancho: '20rem',                     // override min/max-width
 *     flecha: true,                       // muestra arrow indicator
 *     tema: 'claro'|'oscuro',             // 'claro' default, 'oscuro' invierte
 *     cerrarConClickFuera: true,
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

let _cerrarActivo = null;

export const cerrarPopoverActivo = () => { _cerrarActivo?.(); };

export const Popover = ({
  disparador, titulo, contenido, pie,
  posicion = 'top', ancho, flecha = false, tema = 'claro',
  cerrarConClickFuera = true,
} = {}) => {
  const contenedor = crearEl('span', { class: 'popover-host' }, [disparador]);
  let panel = null, limpieza = null, flechaNodo = null;

  const cerrar = () => {
    limpieza?.(); limpieza = null;
    panel?.remove(); panel = null; flechaNodo = null;
    disparador.setAttribute('aria-expanded', 'false');
    if (_cerrarActivo === cerrar) _cerrarActivo = null;
  };

  const reposicionar = () => {
    if (!panel) return;
    const r = disparador.getBoundingClientRect();
    const m = panel.getBoundingClientRect();
    const margen = 8;
    let top, left;
    if (posicion === 'top')    { top = r.top - m.height - margen; left = r.left + r.width / 2 - m.width / 2; }
    else if (posicion === 'bottom') { top = r.bottom + margen;    left = r.left + r.width / 2 - m.width / 2; }
    else if (posicion === 'left')   { top = r.top + r.height / 2 - m.height / 2; left = r.left - m.width - margen; }
    else { /* right */              top = r.top + r.height / 2 - m.height / 2; left = r.right + margen; }

    // Clamp dentro de la ventana
    const vw = innerWidth, vh = innerHeight;
    const leftClamped = Math.max(margen, Math.min(left, vw - m.width  - margen));
    const topClamped  = Math.max(margen, Math.min(top,  vh - m.height - margen));
    panel.style.top  = `${topClamped}px`;
    panel.style.left = `${leftClamped}px`;

    // Reposicionar la flecha sobre el centro del disparador (compensa el clamping)
    if (flechaNodo) {
      if (posicion === 'top' || posicion === 'bottom') {
        const centroX = r.left + r.width / 2;
        const flechaX = centroX - leftClamped;
        flechaNodo.style.insetInlineStart = `${flechaX}px`;
        flechaNodo.style.insetBlockStart = posicion === 'top' ? 'auto' : '0';
        flechaNodo.style.insetBlockEnd = posicion === 'top' ? '0' : 'auto';
      } else {
        const centroY = r.top + r.height / 2;
        const flechaY = centroY - topClamped;
        flechaNodo.style.insetBlockStart = `${flechaY}px`;
        flechaNodo.style.insetInlineStart = posicion === 'left' ? 'auto' : '0';
        flechaNodo.style.insetInlineEnd = posicion === 'left' ? '0' : 'auto';
      }
    }
  };

  const abrir = () => {
    if (panel) return;
    if (_cerrarActivo) _cerrarActivo();

    if (flecha) flechaNodo = crearEl('span', { class: ['popover__flecha', `popover__flecha--${posicion}`], 'aria-hidden': 'true' });

    panel = crearEl('div', {
      class: ['popover', `popover--${posicion}`, `popover--${tema}`, flecha && 'popover--con-flecha'],
      role: 'dialog',
      style: ancho ? { minWidth: ancho, maxWidth: ancho } : null,
    }, [
      flechaNodo,
      titulo && crearEl('div', { class: 'popover__titulo' }, [titulo]),
      crearEl('div', { class: 'popover__contenido' }, [contenido]),
      pie && crearEl('div', { class: 'popover__pie' }, [pie]),
    ]);

    document.body.appendChild(panel);
    reposicionar();
    disparador.setAttribute('aria-expanded', 'true');

    const onDoc = (e) => {
      if (!cerrarConClickFuera) return;
      if (panel.contains(e.target) || contenedor.contains(e.target)) return;
      cerrar();
    };
    const onScroll = () => reposicionar();
    const onKey = (e) => { if (e.key === 'Escape') cerrar(); };
    setTimeout(() => document.addEventListener('click', onDoc), 0);
    addEventListener('scroll', onScroll, true);
    addEventListener('resize', onScroll);
    document.addEventListener('keydown', onKey);
    limpieza = () => {
      document.removeEventListener('click', onDoc);
      removeEventListener('scroll', onScroll, true);
      removeEventListener('resize', onScroll);
      document.removeEventListener('keydown', onKey);
    };
    _cerrarActivo = cerrar;
  };

  disparador.setAttribute('aria-haspopup', 'true');
  disparador.setAttribute('aria-expanded', 'false');
  disparador.addEventListener('click', (e) => { e.stopPropagation(); panel ? cerrar() : abrir(); });

  // API imperativa para cerrar desde dentro de los handlers
  contenedor._popover = { abrir, cerrar };
  return contenedor;
};
