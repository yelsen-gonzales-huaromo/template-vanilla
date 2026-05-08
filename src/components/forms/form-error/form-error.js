import { crearEl } from '../../../utils/helpers/dom.js';
import { tx } from '../../../i18n/index.js';

export const ErrorFormulario = ({ error } = {}) =>
  error ? crearEl('span', { class: 'form-field__error', role: 'alert' }, [tx(error)]) : null;
