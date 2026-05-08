import { crearEl } from '../../utils/helpers/dom.js';
import { CONFIG_APP } from '../../config/app.config.js';
import { t } from '../../i18n/index.js';

export const DisenoAuth = (pagina) => crearEl('div', { class: 'auth-layout' }, [
  crearEl('aside', { class: 'auth-layout__hero', 'aria-hidden': 'true' }, [
    crearEl('div', { class: 'auth-layout__brand' }, [CONFIG_APP.nombre]),
    crearEl('div', { class: 'auth-layout__pitch' }, [
      crearEl('h1', null, [t('auth.welcome_back')]),
      crearEl('p', null, [t('app.tagline')]),
    ]),
    crearEl('div', { class: 'text-sm', style: { opacity: 0.7 } }, [`v${CONFIG_APP.version}`]),
  ]),
  crearEl('main', { class: 'auth-layout__main' }, [
    crearEl('div', { class: 'auth-layout__card' }, [pagina]),
  ]),
]);
