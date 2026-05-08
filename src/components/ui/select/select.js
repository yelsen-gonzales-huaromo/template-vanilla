import { crearEl } from '../../../utils/helpers/dom.js';

export const Selector = ({ opciones = [], value, onChange, placeholder, ...resto } = {}) =>
  crearEl('select', {
    class: 'select',
    onChange: onChange && ((e) => onChange(e.target.value, e)),
    ...resto,
  }, [
    placeholder && crearEl('option', { value: '', disabled: true, selected: !value }, [placeholder]),
    ...opciones.map(opc => crearEl('option', {
      value: opc.value, selected: opc.value === value,
    }, [opc.label])),
  ]);
