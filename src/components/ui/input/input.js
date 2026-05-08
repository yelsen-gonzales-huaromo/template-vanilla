import { crearEl } from '../../../utils/helpers/dom.js';

export const Campo = ({
  type = 'text',
  value = '',
  placeholder = '',
  tamano = 'md',
  invalido = false,
  deshabilitado = false,
  onInput,
  onChange,
  onBlur,
  ...resto
} = {}) => crearEl('input', {
  type,
  value,
  placeholder,
  disabled: deshabilitado,
  class: ['input', tamano !== 'md' && `input--${tamano}`],
  'aria-invalid': invalido || null,
  onInput: onInput && ((e) => onInput(e.target.value, e)),
  onChange: onChange && ((e) => onChange(e.target.value, e)),
  onBlur,
  ...resto,
});

export const AreaTexto = ({ filas = 4, ...resto } = {}) =>
  crearEl('textarea', { rows: filas, class: 'input', ...resto });
