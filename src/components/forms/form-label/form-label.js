import { crearEl } from '../../../utils/helpers/dom.js';

export const EtiquetaFormulario = ({ texto, htmlFor, obligatorio = false } = {}) =>
  crearEl('label', {
    for: htmlFor,
    class: ['form-field__label', obligatorio && 'form-field__label--required'],
  }, [texto]);
