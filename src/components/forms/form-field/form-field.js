import { crearEl } from '../../../utils/helpers/dom.js';
import { idUnico } from '../../../utils/helpers/uid.js';
import { tx } from '../../../i18n/index.js';

/**
 * CampoFormulario — compone etiqueta + control + pista + error.
 * Conecta `for`, `aria-describedby` y `aria-invalid` automáticamente para accesibilidad.
 */
export const CampoFormulario = ({ etiqueta, control, pista, error, obligatorio = false, id } = {}) => {
  const idCampo = id || control?.id || idUnico('campo');
  if (control && !control.id) control.id = idCampo;

  const idPista = pista ? `${idCampo}-pista` : null;
  const idError = error ? `${idCampo}-error` : null;
  const describedBy = [idPista, idError].filter(Boolean).join(' ') || null;
  if (control && describedBy) control.setAttribute('aria-describedby', describedBy);
  if (control && error) control.setAttribute('aria-invalid', 'true');

  return crearEl('div', { class: 'form-field' }, [
    etiqueta && crearEl('label', {
      class: ['form-field__label', obligatorio && 'form-field__label--required'],
      for: idCampo,
    }, [etiqueta]),
    control,
    pista && crearEl('span', { class: 'form-field__hint', id: idPista }, [pista]),
    error && crearEl('span', { class: 'form-field__error', id: idError, role: 'alert' }, [tx(error)]),
  ]);
};
