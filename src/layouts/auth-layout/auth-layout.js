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
import {
  PanelPromo,
  MarcaAuth,
  consumirFondoSimple,
} from '../../components/auth/auth-elements.js';

/* Marca pequeña inline para la cabecera del card (estilo NobleUI). Sustituye
   al banner gradiente que dominaba demasiado el card. */
const MarcaInlineCard = () => crearEl('div', {
  class: 'auth-layout__marca-inline',
}, [MarcaAuth({ tamano: 'lg' })]);

const Pie = () => crearEl('p', { class: 'auth-layout__pie' }, [
  `© ${new Date().getFullYear()} ${CONFIG_APP.nombre} · v${CONFIG_APP.version}`,
]);

/** Simple: card centrada con marca pequeña inline (sin banner gradiente).
 *  Algunas páginas definen un `fondoSimple` (URL) que se aplica como
 *  background del layout entero con un velo encima. */
export const DisenoAuthSimple = (pagina) => {
  const fondo = consumirFondoSimple();
  const root = crearEl('div', {
    class: ['auth-layout', 'auth-layout--simple', fondo && 'auth-layout--simple-imagen'],
    style: fondo ? { backgroundImage: `url('${fondo}')` } : null,
  }, [
    fondo && crearEl('div', { class: 'auth-layout__velo', 'aria-hidden': 'true' }),
    crearEl('div', { class: 'auth-layout__envoltura' }, [
      crearEl('div', { class: 'auth-layout__card' }, [
        crearEl('div', { class: 'auth-layout__card-cuerpo' }, [
          MarcaInlineCard(),
          pagina,
        ]),
      ]),
      Pie(),
    ]),
  ]);
  return root;
};

/** Card: card horizontal con panel promocional + form. La marca va inline
 *  arriba del form (estilo NobleUI). */
export const DisenoAuthCard = (pagina) => crearEl('div', {
  class: 'auth-layout auth-layout--card',
}, [
  crearEl('div', { class: 'auth-layout__envoltura' }, [
    PanelPromo({ compacto: true }),
    crearEl('div', { class: 'auth-layout__card' }, [
      crearEl('div', { class: 'auth-layout__card-cuerpo' }, [
        MarcaInlineCard(),
        pagina,
      ]),
    ]),
  ]),
]);

/** Split: panel promocional full-height a la izquierda, form pelado a la
 *  derecha (sin card, sin banner, sin marca duplicada — la marca vive en
 *  el panel). En móvil, donde el panel se oculta, mostramos una marca
 *  pequeña sólo en ese caso (vía CSS).
 */
export const DisenoAuthSplit = (pagina) => crearEl('div', {
  class: 'auth-layout auth-layout--split',
}, [
  PanelPromo(),
  crearEl('main', { class: 'auth-layout__main' }, [
    crearEl('div', { class: 'auth-layout__envoltura' }, [
      crearEl('div', { class: 'auth-layout__split-marca-movil' }, [
        MarcaAuth({ tamano: 'lg' }),
      ]),
      crearEl('div', { class: 'auth-layout__split-cuerpo' }, [pagina]),
    ]),
  ]),
]);

/* Backwards compat — el layout legacy `auth` apunta al split. */
export const DisenoAuth = DisenoAuthSplit;
