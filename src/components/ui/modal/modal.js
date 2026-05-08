import { crearEl, atraparFoco } from '../../../utils/helpers/dom.js';

/**
 * Modal imperativo — `Modal.abrir({...})` retorna `{ cerrar, elemento }`.
 * Auto-foco, atrapado de foco, ESC para cerrar, click fuera para cerrar.
 *
 * @param {string} titulo                 — texto del header (vacío oculta el header).
 * @param {Node}   cuerpo                 — contenido principal.
 * @param {Node}   pie                    — footer (botones).
 * @param {string} tamano                 — 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
 * @param {string} posicion               — 'centro' (default) | 'derecha' | 'izquierda' | 'arriba' | 'abajo'
 *                                          (las 4 últimas se comportan como drawer)
 * @param {boolean} cerrarConFondo        — default true.
 * @param {Function} alCerrar             — callback al cerrarse.
 */
export const Modal = {
  abrir({
    titulo = '', cuerpo, pie,
    tamano = 'md', posicion = 'centro',
    cerrarConFondo = true, alCerrar,
  } = {}) {
    const cerrar = () => {
      liberarFoco?.();
      fondo.remove();
      document.removeEventListener('keydown', manejadorEsc);
      focoPrevio?.focus?.();
      alCerrar?.();
    };

    const manejadorEsc = (e) => { if (e.key === 'Escape') cerrar(); };
    const focoPrevio = document.activeElement;

    const btnCerrar = crearEl('button', {
      class: 'modal__close', 'aria-label': 'Cerrar', onClick: cerrar, html: '&times;',
    });

    const esDrawer = posicion !== 'centro';

    const modal = crearEl('div', {
      class: [
        'modal',
        tamano !== 'md' && `modal--${tamano}`,
        esDrawer && `modal--drawer modal--drawer-${posicion}`,
      ],
      role: 'dialog', 'aria-modal': 'true',
    }, [
      titulo && crearEl('header', { class: 'modal__header' }, [
        crearEl('h2', { class: 'modal__title' }, [titulo]),
        btnCerrar,
      ]),
      crearEl('div', { class: 'modal__body scroll-discreto' }, [cuerpo]),
      pie && crearEl('footer', { class: 'modal__footer' }, [pie]),
    ]);

    const fondo = crearEl('div', {
      class: ['modal-backdrop', esDrawer && `modal-backdrop--drawer-${posicion}`],
      onClick: (e) => { if (cerrarConFondo && e.target === fondo) cerrar(); },
    }, [modal]);

    document.body.appendChild(fondo);
    document.addEventListener('keydown', manejadorEsc);
    const liberarFoco = atraparFoco(modal);
    queueMicrotask(() => modal.querySelector('button, [tabindex]')?.focus?.());

    return { cerrar, elemento: modal };
  },
};
