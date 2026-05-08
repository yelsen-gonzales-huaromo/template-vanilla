import { crearEl } from '../../utils/helpers/dom.js';

export const DisenoVacio = (pagina) => crearEl('div', { class: 'blank-layout' }, [pagina]);
