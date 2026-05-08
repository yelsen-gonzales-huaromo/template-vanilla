import { crearEl } from '../../utils/helpers/dom.js';
import { BarraLateral } from '../components/sidebar/sidebar.js';
import { BarraSuperior } from '../components/navbar/navbar.js';
import { BarraNavSuperior } from '../components/nav-top/nav-top.js';
import { PiePagina } from '../components/footer/footer.js';
import { estadoUi } from '../../store/ui.store.js';

/**
 * Layout adaptativo. La estructura cambia según `estadoUi.posicionNav`:
 *
 *  vertical → sidebar a la izquierda + navbar arriba (el clásico).
 *  top      → sin sidebar, sólo navbar + barra horizontal con mega-menus.
 *  combo    → sidebar a la izquierda + navbar + barra horizontal (ambas).
 *
 * El render se construye una vez por mount; al cambiar `posicionNav` el router
 * remonta la página y por tanto este layout vuelve a evaluarse.
 */
export const DisenoTablero = (pagina) => {
  const posicion = estadoUi.posicionNav.peek();
  const main = crearEl('main', { class: 'dashboard-layout__content', id: 'main', tabindex: '-1' }, [pagina]);

  // Modo TOP: sin sidebar, todo arriba
  if (posicion === 'top') {
    return crearEl('div', { class: 'dashboard-layout dashboard-layout--top' }, [
      crearEl('div', { class: 'dashboard-layout__main' }, [
        BarraSuperior(),
        BarraNavSuperior(),
        main,
        PiePagina(),
      ]),
    ]);
  }

  // Modo COMBO: sidebar + navbar + nav horizontal
  if (posicion === 'combo') {
    return crearEl('div', { class: 'dashboard-layout dashboard-layout--combo' }, [
      BarraLateral(),
      crearEl('div', { class: 'dashboard-layout__main' }, [
        BarraSuperior(),
        BarraNavSuperior(),
        main,
        PiePagina(),
      ]),
    ]);
  }

  // Modo VERTICAL (default)
  return crearEl('div', { class: 'dashboard-layout' }, [
    BarraLateral(),
    crearEl('div', { class: 'dashboard-layout__main' }, [
      BarraSuperior(),
      main,
      PiePagina(),
    ]),
  ]);
};
