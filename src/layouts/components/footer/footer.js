import { crearEl } from '../../../utils/helpers/dom.js';
import { CONFIG_APP } from '../../../config/app.config.js';

export const PiePagina = () => crearEl('footer', { class: 'footer', role: 'contentinfo' }, [
  crearEl('span', null, [`© ${new Date().getFullYear()} ${CONFIG_APP.nombre} · v${CONFIG_APP.version}`]),
]);
