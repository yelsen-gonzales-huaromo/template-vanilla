/**
 * Helpers compartidos para las páginas de Forms — wrappers reusables
 * (Campo, InputGrupo, Check, Switch, Select, etc.) y patrones comunes.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ============================================================================
//  Campo — wrapper label + input + hint/error
// ============================================================================
export const Campo = ({ label, requerido, opcional, hint, error, hijos, htmlFor } = {}) => {
  const id = htmlFor || `campo-${Math.random().toString(36).slice(2, 9)}`;
  // Si hijos es un input/textarea/select, le ponemos el id automático
  const apply = (n) => {
    if (n && n.tagName && (n.tagName === 'INPUT' || n.tagName === 'TEXTAREA' || n.tagName === 'SELECT') && !n.id) n.id = id;
    return n;
  };
  const cuerpo = Array.isArray(hijos) ? hijos.map(apply) : [apply(hijos)];

  return crearEl('div', { class: 'campo' }, [
    label && crearEl('label', { class: 'campo__label', htmlFor: id }, [
      label,
      requerido && crearEl('span', { class: 'campo__label-required' }, ['*']),
      opcional && !requerido && crearEl('span', { class: 'campo__optional' }, ['(opcional)']),
    ]),
    ...cuerpo,
    hint && !error && crearEl('div', { class: 'campo__hint' }, [hint]),
    error && crearEl('div', { class: 'campo__error' }, [Icono('alerta', { tamano: 12 }), error]),
  ]);
};

// ============================================================================
//  Input — el input base con todos los props comunes
// ============================================================================
export const Input = ({
  type = 'text', value = '', placeholder = '', tamano = 'md',
  invalido, valido, deshabilitado, readonly,
  onInput, onChange, onBlur, onFocus,
  ...resto
} = {}) => crearEl('input', {
  type, value, placeholder,
  disabled: deshabilitado || null,
  readOnly: readonly || null,
  class: ['input', tamano !== 'md' && `input--${tamano}`],
  'aria-invalid': invalido || null,
  'data-valido': valido || null,
  onInput, onChange, onBlur, onFocus,
  ...resto,
});

// ============================================================================
//  Textarea
// ============================================================================
export const Textarea = ({ filas = 4, tamano = 'md', invalido, ...resto } = {}) => crearEl('textarea', {
  rows: filas,
  class: ['input', tamano !== 'md' && `input--${tamano}`],
  'aria-invalid': invalido || null,
  ...resto,
});

// ============================================================================
//  InputGrupo — input con prefix/suffix (texto, ícono, botón)
// ============================================================================
export const InputGrupo = ({
  prefix, suffix,
  invalido, valido,
  ...inputProps
} = {}) => {
  const elPrefix = prefix && crearEl('span', { class: 'input-grupo__addon' }, [prefix]);
  const elSuffix = suffix && crearEl('span', { class: 'input-grupo__addon' }, [suffix]);
  const elInput = Input(inputProps);
  return crearEl('div', {
    class: ['input-grupo', invalido && 'input-grupo--invalido', valido && 'input-grupo--valido'],
  }, [elPrefix, elInput, elSuffix]);
};

// ============================================================================
//  Select nativo polished
// ============================================================================
export const Select = ({ value = '', opciones = [], placeholder, deshabilitado, onChange, ...resto } = {}) => {
  const opts = [];
  if (placeholder) opts.push(crearEl('option', { value: '', disabled: true, selected: !value }, [placeholder]));
  opciones.forEach((o) => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    opts.push(crearEl('option', { value: v, selected: v === value }, [l]));
  });
  return crearEl('select', {
    class: 'select',
    disabled: deshabilitado || null,
    onChange,
    ...resto,
  }, opts);
};

// ============================================================================
//  Check (checkbox o radio) con label
// ============================================================================
export const Check = ({ tipo = 'checkbox', name, value, checked, label, descripcion, deshabilitado, onChange, tamano = 'md' } = {}) => {
  const input = crearEl('input', {
    type: tipo, name, value,
    checked: checked || null,
    disabled: deshabilitado || null,
    class: ['check-input', tipo === 'radio' && 'check-input--radio', tamano !== 'md' && `check-input--${tamano}`],
    onChange,
  });
  return crearEl('label', { class: 'check', 'aria-disabled': deshabilitado || null }, [
    input,
    label && crearEl('span', { class: 'check__label' }, [
      crearEl('span', { class: 'check__label-titulo' }, [label]),
      descripcion && crearEl('span', { class: 'check__label-desc' }, [descripcion]),
    ]),
  ]);
};

// ============================================================================
//  Check-card (toda la tarjeta seleccionable, con borde resaltado)
// ============================================================================
export const CheckCard = ({ tipo = 'checkbox', name, value, checked, titulo, descripcion, icono, onChange } = {}) => {
  const input = crearEl('input', {
    type: tipo, name, value,
    checked: checked || null,
    class: ['check-input', tipo === 'radio' && 'check-input--radio'],
    onChange,
  });
  return crearEl('label', { class: 'check-card' }, [
    input,
    crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 } }, [
      crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
        icono && crearEl('span', { style: { color: 'var(--primary)', display: 'inline-flex' } }, [icono]),
        crearEl('span', { style: { fontWeight: 600, fontSize: 'var(--text-sm)' } }, [titulo]),
      ]),
      descripcion && crearEl('span', { style: { fontSize: '12px', color: 'var(--muted-foreground)', lineHeight: 1.5 } }, [descripcion]),
    ]),
  ]);
};

// ============================================================================
//  Switch / Toggle
// ============================================================================
export const Switch = ({ name, checked, deshabilitado, onChange, label, descripcion, tamano = 'md' } = {}) => {
  const input = crearEl('input', {
    type: 'checkbox', name,
    checked: checked || null,
    disabled: deshabilitado || null,
    class: ['switch', tamano !== 'md' && `switch--${tamano}`],
    role: 'switch',
    onChange,
  });
  if (!label) return input;
  return crearEl('label', { class: 'check', 'aria-disabled': deshabilitado || null }, [
    input,
    crearEl('span', { class: 'check__label' }, [
      crearEl('span', { class: 'check__label-titulo' }, [label]),
      descripcion && crearEl('span', { class: 'check__label-desc' }, [descripcion]),
    ]),
  ]);
};

// ============================================================================
//  Card de contenido (para envolver ejemplos)
// ============================================================================
export const Card = ({ titulo, descripcion, hijos, ancho = 'auto' } = {}) => crearEl('div', {
  style: {
    padding: 'var(--space-4) var(--space-5)',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    maxWidth: ancho === 'auto' ? null : ancho,
  },
}, [
  titulo && crearEl('div', { style: { fontSize: '13px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBlockEnd: descripcion ? '4px' : 'var(--space-3)' } }, [titulo]),
  descripcion && crearEl('div', { style: { fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', marginBlockEnd: 'var(--space-3)' } }, [descripcion]),
  ...(Array.isArray(hijos) ? hijos : [hijos]),
]);

// Grid responsive 2-col
export const Grid2 = (...nodos) => crearEl('div', {
  style: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 'var(--space-3)',
  },
}, nodos);

// Stack vertical
export const Stack = (...nodos) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, nodos);

// Inline horizontal
export const Inline = (...nodos) => crearEl('div', {
  style: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' },
}, nodos);
