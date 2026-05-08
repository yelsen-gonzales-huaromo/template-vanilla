/**
 * Auth layouts — 3 variantes + helper para envolver una página de auth.
 *
 *   DisenoAuthSimple(pagina)  — card centrada con banner de marca arriba
 *   DisenoAuthCard(pagina)    — card de 2 mitades: panel promo + form
 *   DisenoAuthSplit(pagina)   — full-page split: panel promo + card con banner
 *
 * Las 3 esperan que `pagina` sea el contenido (formulario o pantalla), sin
 * chrome adicional. El layout aporta marca, banner gradiente, panel promo,
 * padding, fondo, etc.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { CONFIG_APP } from '../../config/app.config.js';
import { PanelPromo } from '../../components/auth/auth-elements.js';

/* Banner de marca en la cabecera del card — gradiente azul con shape SVG
   decorativa y nombre de la app. Se usa en simple/split (no en card, que ya
   tiene el panel promocional cumpliendo ese rol). */
const BannerMarcaCard = () => crearEl('div', {
  class: 'auth-layout__banner', 'aria-hidden': 'true',
}, [
  crearEl('div', { class: 'auth-layout__banner-shape' }),
  crearEl('div', { class: 'auth-layout__banner-glow' }),
  crearEl('a', {
    href: '#/', class: 'auth-layout__banner-marca',
    'aria-label': CONFIG_APP.nombre,
  }, [CONFIG_APP.nombre]),
]);

const Pie = () => crearEl('p', { class: 'auth-layout__pie' }, [
  `© ${new Date().getFullYear()} ${CONFIG_APP.nombre} · v${CONFIG_APP.version}`,
]);

/** Simple: centrado, sin hero. Card con banner gradiente arriba. */
export const DisenoAuthSimple = (pagina) => crearEl('div', {
  class: 'auth-layout auth-layout--simple',
}, [
  crearEl('div', { class: 'auth-layout__envoltura' }, [
    crearEl('div', { class: 'auth-layout__card' }, [
      BannerMarcaCard(),
      crearEl('div', { class: 'auth-layout__card-cuerpo' }, [pagina]),
    ]),
    Pie(),
  ]),
]);

/** Card: card horizontal con panel promocional + form. */
export const DisenoAuthCard = (pagina) => crearEl('div', {
  class: 'auth-layout auth-layout--card',
}, [
  crearEl('div', { class: 'auth-layout__envoltura' }, [
    PanelPromo({ compacto: true }),
    crearEl('div', { class: 'auth-layout__card' }, [
      crearEl('div', { class: 'auth-layout__card-cuerpo' }, [pagina]),
    ]),
  ]),
]);

/** Split: panel promocional full-height a la izquierda, card con banner. */
export const DisenoAuthSplit = (pagina) => crearEl('div', {
  class: 'auth-layout auth-layout--split',
}, [
  PanelPromo(),
  crearEl('main', { class: 'auth-layout__main' }, [
    crearEl('div', { class: 'auth-layout__envoltura' }, [
      crearEl('div', { class: 'auth-layout__card' }, [
        BannerMarcaCard(),
        crearEl('div', { class: 'auth-layout__card-cuerpo' }, [pagina]),
      ]),
    ]),
  ]),
]);

/* Backwards compat — el layout legacy `auth` apunta al split. */
export const DisenoAuth = DisenoAuthSplit;
