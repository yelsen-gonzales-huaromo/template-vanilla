/**
 * Floating labels — patrón Material 3 / Stripe Checkout, vanilla JS.
 *
 * Componentes:
 *   - FloatingInput       — input base con todas las opciones
 *   - FloatingPassword    — con botón ojo para mostrar/ocultar
 *   - FloatingSearch      — con botón × para limpiar
 *   - FloatingTextarea    — auto-grow opcional + contador de caracteres
 *   - FloatingSelect      — select nativo polished
 *   - FloatingNumero      — con steppers + / − a la derecha
 *
 * Opciones soportadas en TODOS:
 *   - tamano: 'sm' | 'md' | 'lg'
 *   - valido / invalido / deshabilitado / readonly
 *   - error: 'mensaje'        → muestra el error debajo + estado invalido
 *   - hint:  'texto'          → ayuda gris debajo (oculta al haber error)
 *   - requerido               → asterisco rojo en el label
 *   - opcional                → "(opcional)" gris pequeño junto al label
 *   - icono                   → ícono SVG dentro del input a la izquierda
 *   - contador / max          → "12/100" abajo a la derecha
 *   - onChange / onInput / onBlur
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ---------------------------------------------------------------------------
//  Helper común — construye el wrap floating con todas sus partes
// ---------------------------------------------------------------------------
const construirFloating = ({
  label, requerido, opcional, hint, error, contador, max,
  icono, sufijo,
  tamano = 'md',
  invalido, valido, deshabilitado, readonly,
}, control) => {
  const wrap = crearEl('div', {
    class: [
      'floating',
      tamano !== 'md' && `floating--${tamano}`,
      icono && 'floating--con-icono',
      sufijo && 'floating--con-sufijo',
      (invalido || error) && 'floating--invalido',
      valido && 'floating--valido',
      deshabilitado && 'floating--deshabilitado',
      readonly && 'floating--readonly',
    ],
  });

  if (icono) wrap.appendChild(crearEl('span', { class: 'floating__icono' }, [icono]));
  wrap.appendChild(control);

  // Label flotante
  const lbl = crearEl('label', {}, [
    label,
    requerido && crearEl('span', { class: 'floating__req' }, [' *']),
    opcional && !requerido && crearEl('span', { class: 'floating__opc' }, [' (opcional)']),
  ]);
  wrap.appendChild(lbl);

  if (sufijo) wrap.appendChild(crearEl('span', { class: 'floating__sufijo' }, [sufijo]));

  // Helper / error + contador
  const tieneAyuda = error || hint || (contador && max);
  if (tieneAyuda) {
    const ayuda = crearEl('div', { class: 'floating__ayuda' });
    if (error) {
      ayuda.appendChild(crearEl('span', { class: 'floating__error' }, [
        Icono('alerta', { tamano: 12 }), error,
      ]));
    } else if (hint) {
      ayuda.appendChild(crearEl('span', { class: 'floating__hint' }, [hint]));
    } else {
      ayuda.appendChild(crearEl('span'));
    }
    if (contador && max) {
      const ctr = crearEl('span', { class: 'floating__contador' }, ['0/' + max]);
      const refrescarCtr = () => {
        const len = control.value ? control.value.length : 0;
        ctr.textContent = `${len}/${max}`;
        ctr.classList.toggle('floating__contador--exceso', len > max);
      };
      control.addEventListener('input', refrescarCtr);
      requestAnimationFrame(refrescarCtr);
      ayuda.appendChild(ctr);
    }
    wrap.appendChild(ayuda);
  }

  return wrap;
};

// ---------------------------------------------------------------------------
//  1 · FloatingInput
// ---------------------------------------------------------------------------
export const FloatingInput = ({
  label, type = 'text', value = '', placeholder = ' ',
  tamano, requerido, opcional, hint, error, contador, max,
  icono, sufijo, autoComplete,
  invalido, valido, deshabilitado, readonly,
  onInput, onChange, onBlur, onFocus,
  ...resto
} = {}) => {
  const input = crearEl('input', {
    type, value, placeholder,
    class: 'input',
    autocomplete: autoComplete,
    disabled: deshabilitado || null,
    readOnly: readonly || null,
    'aria-invalid': (invalido || error) || null,
    'data-valido': valido || null,
    maxLength: contador && max ? max : null,
    onInput, onChange, onBlur, onFocus,
    ...resto,
  });
  return construirFloating({
    label, requerido, opcional, hint, error, contador, max,
    icono, sufijo, tamano, invalido, valido, deshabilitado, readonly,
  }, input);
};

// ---------------------------------------------------------------------------
//  2 · FloatingPassword — toggle de visibilidad
// ---------------------------------------------------------------------------
export const FloatingPassword = ({ label = 'Contraseña', value = '', ...resto } = {}) => {
  const input = crearEl('input', {
    type: 'password',
    value,
    placeholder: ' ',
    class: 'input',
    autocomplete: 'current-password',
  });
  // Inyecta el sufijo manualmente (un botón clickeable, no decorativo)
  let visible = false;
  const btnOjo = crearEl('button', {
    type: 'button',
    class: 'floating__sufijo floating__sufijo--btn',
    'aria-label': 'Mostrar contraseña',
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => {
      visible = !visible;
      input.type = visible ? 'text' : 'password';
      btnOjo.replaceChildren(Icono(visible ? 'ojo_off' : 'ojo', { tamano: 16 }));
      btnOjo.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
    },
  }, [Icono('ojo', { tamano: 16 })]);

  // Construye el floating, luego reemplaza el sufijo decorativo por nuestro botón
  const wrap = construirFloating({
    label,
    sufijo: '_',     // truco para que la clase --con-sufijo se aplique
    ...resto,
  }, input);
  // Quita el sufijo decorativo y agrega el botón
  const sufijoEl = wrap.querySelector('.floating__sufijo');
  if (sufijoEl) sufijoEl.replaceWith(btnOjo);
  return wrap;
};

// ---------------------------------------------------------------------------
//  3 · FloatingSearch — botón × que limpia
// ---------------------------------------------------------------------------
export const FloatingSearch = ({
  label = 'Buscar', value = '', onChange,
  ...resto
} = {}) => {
  const input = crearEl('input', {
    type: 'search',
    value,
    placeholder: ' ',
    class: 'input',
    autocomplete: 'off',
    onInput: (e) => { actualizarBoton(); onChange && onChange(e.target.value, e); },
  });

  const btnLimpiar = crearEl('button', {
    type: 'button',
    class: 'floating__sufijo floating__sufijo--btn',
    'aria-label': 'Limpiar',
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => {
      input.value = '';
      input.focus();
      actualizarBoton();
      onChange && onChange('', null);
    },
  }, [Icono('cerrar', { tamano: 14 })]);

  const actualizarBoton = () => {
    btnLimpiar.style.opacity = input.value ? '1' : '0';
    btnLimpiar.style.pointerEvents = input.value ? 'auto' : 'none';
  };

  const wrap = construirFloating({
    label,
    icono: Icono('busqueda', { tamano: 14 }),
    sufijo: '_',
    ...resto,
  }, input);
  const sufijoEl = wrap.querySelector('.floating__sufijo');
  if (sufijoEl) sufijoEl.replaceWith(btnLimpiar);
  requestAnimationFrame(actualizarBoton);
  return wrap;
};

// ---------------------------------------------------------------------------
//  4 · FloatingTextarea — opcional auto-grow + contador
// ---------------------------------------------------------------------------
export const FloatingTextarea = ({
  label, value = '', filas = 3, autoGrow = false,
  contador, max, hint, error, requerido, opcional, tamano,
  invalido, valido, deshabilitado, readonly,
  onInput, ...resto
} = {}) => {
  const ta = crearEl('textarea', {
    rows: filas,
    placeholder: ' ',
    class: 'input',
    disabled: deshabilitado || null,
    readOnly: readonly || null,
    maxLength: contador && max ? max : null,
    'aria-invalid': (invalido || error) || null,
    'data-valido': valido || null,
    ...resto,
  });
  ta.value = value;

  if (autoGrow) {
    const grow = () => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    };
    ta.addEventListener('input', grow);
    requestAnimationFrame(grow);
  }
  if (onInput) ta.addEventListener('input', onInput);

  return construirFloating({
    label, requerido, opcional, hint, error, contador, max,
    tamano, invalido, valido, deshabilitado, readonly,
  }, ta);
};

// ---------------------------------------------------------------------------
//  5 · FloatingSelect (nativo polished — el caret no rota)
// ---------------------------------------------------------------------------
export const FloatingSelect = ({
  label, opciones = [], value = '', placeholder = 'Selecciona…',
  requerido, opcional, hint, error, tamano,
  invalido, valido, deshabilitado, onChange,
  ...resto
} = {}) => {
  const opts = [];
  // Placeholder option (vacío) — necesario para que el label suba solo cuando elija algo
  opts.push(crearEl('option', { value: '', disabled: true, selected: !value, hidden: true }, [placeholder]));
  opciones.forEach((o) => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    opts.push(crearEl('option', { value: v, selected: v === value }, [l]));
  });
  const select = crearEl('select', {
    class: 'input floating__select',
    disabled: deshabilitado || null,
    'aria-invalid': (invalido || error) || null,
    onChange: (e) => { actualizar(); onChange && onChange(e); },
    ...resto,
  }, opts);
  // CSS no puede saber si un select tiene valor "no placeholder" — aplicamos
  // la clase `has-value` vía JS cuando hay selección.
  const actualizar = () => {
    if (select.value && select.value !== '') select.classList.add('has-value');
    else select.classList.remove('has-value');
  };
  requestAnimationFrame(actualizar);
  return construirFloating({
    label, requerido, opcional, hint, error,
    tamano, invalido, valido, deshabilitado,
  }, select);
};

// ---------------------------------------------------------------------------
//  6 · FloatingNumero — con steppers + y −
// ---------------------------------------------------------------------------
export const FloatingNumero = ({
  label, value = 0, min, max, step = 1,
  requerido, hint, error, tamano,
  onChange, ...resto
} = {}) => {
  const input = crearEl('input', {
    type: 'number',
    value: String(value),
    placeholder: ' ',
    class: 'input',
    min, max, step,
    inputMode: 'numeric',
    onInput: (e) => onChange && onChange(parseFloat(e.target.value) || 0),
    ...resto,
  });

  const ajustar = (delta) => {
    const v = (parseFloat(input.value) || 0) + delta;
    const clamped = Math.max(
      min !== undefined ? min : -Infinity,
      Math.min(max !== undefined ? max : Infinity, v),
    );
    input.value = String(clamped);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const steppers = crearEl('div', { class: 'floating__steppers' }, [
    crearEl('button', {
      type: 'button',
      class: 'floating__stepper',
      'aria-label': 'Disminuir',
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => ajustar(-step),
    }, [Icono('chevron_d', { tamano: 12 })]),
    crearEl('button', {
      type: 'button',
      class: 'floating__stepper',
      'aria-label': 'Aumentar',
      onMouseDown: (e) => e.preventDefault(),
      onClick: () => ajustar(step),
    }, [Icono('chevron_u', { tamano: 12 })]),
  ]);

  const wrap = construirFloating({
    label, requerido, hint, error, tamano, sufijo: '_',
  }, input);
  const sufijoEl = wrap.querySelector('.floating__sufijo');
  if (sufijoEl) sufijoEl.replaceWith(steppers);
  return wrap;
};
