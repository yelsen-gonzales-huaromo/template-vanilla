/**
 * Validación — sistema completo vanilla JS para forms profesionales.
 *
 *  - Validadores reusables (15+ presets) — funciones puras (v) → null|string
 *  - CampoValidado con estados visuales: pristine, validando (spinner),
 *    válido (check verde), inválido (× rojo)
 *  - CampoAsync con debounce — verifica disponibilidad contra "servidor"
 *    con cancelación de requests viejos
 *  - PasswordChecklist en vivo con animación al cumplir cada criterio
 *  - ResumenErrores — panel sticky con conteo + jump links a cada campo
 *  - FormValidator — orchestrator que coordina validación entre todos los
 *    campos y expone estado reactivo `esValido` para deshabilitar el submit
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ===========================================================================
//  Validadores — funciones puras (valor) → null si OK | string con error
// ===========================================================================
export const v = {
  requerido: (msg = 'Este campo es obligatorio') => (val) =>
    String(val ?? '').trim() ? null : msg,

  email: (msg = 'Email no válido') => (val) =>
    !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : msg,

  url: (msg = 'URL no válida') => (val) => {
    if (!val) return null;
    try { new URL(val.startsWith('http') ? val : 'https://' + val); return null; }
    catch { return msg; }
  },

  telefono: (msg = 'Teléfono no válido') => (val) =>
    !val || /^[+]?[\d\s\-()]{7,}$/.test(val) ? null : msg,

  min: (n, msg) => (val) =>
    (val?.length ?? 0) >= n ? null : (msg || `Mínimo ${n} caracteres`),

  max: (n, msg) => (val) =>
    (val?.length ?? 0) <= n ? null : (msg || `Máximo ${n} caracteres`),

  numero: (msg = 'Debe ser un número') => (val) =>
    !val || !isNaN(parseFloat(val)) ? null : msg,

  entero: (msg = 'Debe ser un número entero') => (val) =>
    !val || /^-?\d+$/.test(val) ? null : msg,

  rango: (mn, mx, msg) => (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return null;
    return (n >= mn && n <= mx) ? null : (msg || `Debe estar entre ${mn} y ${mx}`);
  },

  regex: (re, msg) => (val) =>
    !val || re.test(val) ? null : msg,

  letrasSolo: (msg = 'Solo letras permitidas') => (val) =>
    !val || /^[A-Za-zÀ-ÿ\s]+$/.test(val) ? null : msg,

  alfanumerico: (msg = 'Solo letras y números') => (val) =>
    !val || /^[A-Za-z0-9]+$/.test(val) ? null : msg,

  dniPe: (msg = 'DNI Perú: 8 dígitos') => (val) =>
    !val || /^\d{8}$/.test(val) ? null : msg,

  fecha: (msg = 'Fecha no válida') => (val) =>
    !val || !isNaN(new Date(val).getTime()) ? null : msg,

  fechaFutura: (msg = 'Debe ser una fecha futura') => (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (isNaN(d.getTime())) return 'Fecha no válida';
    return d > new Date() ? null : msg;
  },

  edadMinima: (anios, msg) => (val) => {
    if (!val) return null;
    const d = new Date(val);
    const hoy = new Date();
    const edad = hoy.getFullYear() - d.getFullYear() -
      ((hoy.getMonth() < d.getMonth() || (hoy.getMonth() === d.getMonth() && hoy.getDate() < d.getDate())) ? 1 : 0);
    return edad >= anios ? null : (msg || `Debes tener al menos ${anios} años`);
  },

  passwordFuerte: (msg) => (val) => {
    if (!val) return null;
    if (val.length < 8) return msg || 'Mínimo 8 caracteres';
    if (!/[A-Z]/.test(val)) return msg || 'Debe incluir una mayúscula';
    if (!/[0-9]/.test(val)) return msg || 'Debe incluir un número';
    if (!/[^A-Za-z0-9]/.test(val)) return msg || 'Debe incluir un símbolo';
    return null;
  },
};

// Helper para encadenar validadores y devolver el primer error encontrado.
export const ejecutarValidadores = (val, validadores) => {
  for (const fn of (validadores || [])) {
    const r = fn(val);
    if (r) return r;
  }
  return null;
};

// ===========================================================================
//  CampoValidado — con badge de estado (pending/valid/invalid)
// ===========================================================================
export const CampoValidado = ({
  label, type = 'text', placeholder, value = '',
  validar = [],
  requerido,
  hint,
  registrar,           // (campo) => unregister  — para FormValidator
} = {}) => {
  const valor = senal(value);
  const error = senal(null);
  const tocado = senal(false);

  const wrap = crearEl('div', { class: 'campo' });
  const idCampo = `vc-${Math.random().toString(36).slice(2, 9)}`;

  const lbl = label && crearEl('label', { class: 'campo__label', htmlFor: idCampo }, [
    label,
    requerido && crearEl('span', { class: 'campo__label-required' }, ['*']),
  ]);

  const input = crearEl('input', {
    type, placeholder, value, class: 'input',
    id: idCampo,
    onInput: (e) => { valor.value = e.target.value; if (tocado.peek()) doValidar(); },
    onBlur: () => { tocado.value = true; doValidar(); },
  });

  const badge = crearEl('span', { class: 'val-badge' });
  const inputWrap = crearEl('div', { class: 'val-wrap' }, [input, badge]);

  const errEl = crearEl('div', { class: 'campo__error', style: { display: 'none' } });
  const hintEl = hint && crearEl('div', { class: 'campo__hint' }, [hint]);

  const doValidar = () => {
    const e = ejecutarValidadores(valor.peek(), [
      ...(requerido ? [v.requerido()] : []),
      ...validar,
    ]);
    error.value = e;
  };

  // Refresh visual del input + badge
  efecto(() => {
    const muestraError = error.value && tocado.value;
    const esValido = !error.value && valor.value && tocado.value;
    input.setAttribute('aria-invalid', muestraError ? 'true' : null);
    input.setAttribute('data-valido', esValido ? 'true' : null);

    badge.replaceChildren();
    badge.classList.remove('val-badge--ok', 'val-badge--err');
    if (muestraError) {
      badge.appendChild(Icono('cerrar', { tamano: 14 }));
      badge.classList.add('val-badge--err');
    } else if (esValido) {
      badge.appendChild(Icono('check', { tamano: 14 }));
      badge.classList.add('val-badge--ok');
    }

    if (muestraError) {
      errEl.replaceChildren(Icono('alerta', { tamano: 12 }), error.value);
      errEl.style.display = 'flex';
      if (hintEl) hintEl.style.display = 'none';
    } else {
      errEl.style.display = 'none';
      if (hintEl) hintEl.style.display = 'block';
    }
  });

  if (lbl) wrap.appendChild(lbl);
  wrap.appendChild(inputWrap);
  if (hintEl) wrap.appendChild(hintEl);
  wrap.appendChild(errEl);

  // Registrar en el FormValidator
  const handle = {
    id: idCampo,
    label: label || '',
    get valor() { return valor.peek(); },
    get error() { return error.peek(); },
    get tocado() { return tocado.peek(); },
    forzarValidacion: () => { tocado.value = true; doValidar(); },
    enfocar: () => { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    suscribir: (fn) => efecto(() => fn({ valor: valor.value, error: error.value, tocado: tocado.value })),
  };
  if (registrar) registrar(handle);

  wrap.handle = handle;
  return wrap;
};

// ===========================================================================
//  CampoAsync — debounced async validation (verificar disponibilidad)
// ===========================================================================
export const CampoAsync = ({
  label, placeholder, value = '',
  cargar,                       // async (val) => null | string  (null = OK)
  debounceMs = 500,
  hint, requerido,
  registrar,
} = {}) => {
  const valor = senal(value);
  const error = senal(null);
  const tocado = senal(false);
  const verificando = senal(false);

  const wrap = crearEl('div', { class: 'campo' });
  const idCampo = `va-${Math.random().toString(36).slice(2, 9)}`;
  const lbl = label && crearEl('label', { class: 'campo__label', htmlFor: idCampo }, [
    label, requerido && crearEl('span', { class: 'campo__label-required' }, ['*']),
  ]);

  let timer;
  let lastQuery = '';

  const input = crearEl('input', {
    type: 'text', placeholder, value, class: 'input',
    id: idCampo,
    onInput: (e) => {
      valor.value = e.target.value;
      tocado.value = true;
      error.value = null;
      clearTimeout(timer);
      if (!e.target.value.trim()) { verificando.value = false; return; }
      verificando.value = true;
      timer = setTimeout(async () => {
        const q = e.target.value;
        lastQuery = q;
        try {
          const r = await cargar(q);
          if (q !== lastQuery) return;     // ignora respuestas obsoletas
          error.value = r;
        } finally {
          if (q === lastQuery) verificando.value = false;
        }
      }, debounceMs);
    },
  });

  const badge = crearEl('span', { class: 'val-badge' });
  const inputWrap = crearEl('div', { class: 'val-wrap' }, [input, badge]);

  const errEl = crearEl('div', { class: 'campo__error', style: { display: 'none' } });
  const hintEl = hint && crearEl('div', { class: 'campo__hint' }, [hint]);
  const ok = crearEl('div', { class: 'campo__ok', style: { display: 'none' } });

  efecto(() => {
    badge.replaceChildren();
    badge.classList.remove('val-badge--ok', 'val-badge--err', 'val-badge--load');
    input.removeAttribute('aria-invalid');
    input.removeAttribute('data-valido');

    if (verificando.value) {
      badge.appendChild(crearEl('span', { class: 'val-spinner' }));
      badge.classList.add('val-badge--load');
      errEl.style.display = 'none';
      ok.style.display = 'none';
      if (hintEl) hintEl.style.display = 'none';
      return;
    }
    if (error.value && tocado.value) {
      input.setAttribute('aria-invalid', 'true');
      badge.appendChild(Icono('cerrar', { tamano: 14 }));
      badge.classList.add('val-badge--err');
      errEl.replaceChildren(Icono('alerta', { tamano: 12 }), error.value);
      errEl.style.display = 'flex';
      ok.style.display = 'none';
      if (hintEl) hintEl.style.display = 'none';
      return;
    }
    if (valor.value && tocado.value && !error.value) {
      input.setAttribute('data-valido', 'true');
      badge.appendChild(Icono('check', { tamano: 14 }));
      badge.classList.add('val-badge--ok');
      ok.replaceChildren(Icono('check', { tamano: 12 }), 'Disponible');
      ok.style.display = 'flex';
      errEl.style.display = 'none';
      if (hintEl) hintEl.style.display = 'none';
      return;
    }
    if (hintEl) hintEl.style.display = 'block';
    errEl.style.display = 'none';
    ok.style.display = 'none';
  });

  if (lbl) wrap.appendChild(lbl);
  wrap.appendChild(inputWrap);
  if (hintEl) wrap.appendChild(hintEl);
  wrap.appendChild(ok);
  wrap.appendChild(errEl);

  const handle = {
    id: idCampo, label: label || '',
    get valor() { return valor.peek(); },
    get error() { return error.peek() || (requerido && !valor.peek().trim() ? 'Requerido' : null); },
    get tocado() { return tocado.peek(); },
    forzarValidacion: () => { tocado.value = true; },
    enfocar: () => { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
    suscribir: (fn) => efecto(() => fn({ valor: valor.value, error: error.value, tocado: tocado.value, verificando: verificando.value })),
  };
  if (registrar) registrar(handle);

  return wrap;
};

// ===========================================================================
//  PasswordChecklist — input + checklist en vivo de los criterios
// ===========================================================================
const CRITERIOS_PWD = [
  { id: 'len',   label: 'Mínimo 8 caracteres',           test: (v) => v.length >= 8 },
  { id: 'mayus', label: 'Una mayúscula (A-Z)',           test: (v) => /[A-Z]/.test(v) },
  { id: 'minus', label: 'Una minúscula (a-z)',           test: (v) => /[a-z]/.test(v) },
  { id: 'num',   label: 'Un número (0-9)',               test: (v) => /[0-9]/.test(v) },
  { id: 'sym',   label: 'Un símbolo (!@#$%^&*)',         test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export const PasswordChecklist = ({
  placeholder = '••••••••',
  conMedidor = true,
  registrar,
} = {}) => {
  const valor = senal('');
  const wrap = crearEl('div', { class: 'campo pwd-checklist' });
  const idCampo = `pc-${Math.random().toString(36).slice(2, 9)}`;

  let visible = false;
  const input = crearEl('input', {
    type: 'password', placeholder, class: 'input',
    id: idCampo,
    onInput: (e) => { valor.value = e.target.value; },
  });
  const ojo = crearEl('button', {
    type: 'button',
    class: 'pwd-checklist__ojo',
    'aria-label': 'Mostrar contraseña',
    onMouseDown: (e) => e.preventDefault(),
    onClick: () => {
      visible = !visible;
      input.type = visible ? 'text' : 'password';
      ojo.replaceChildren(Icono(visible ? 'ojo_off' : 'ojo', { tamano: 14 }));
    },
  }, [Icono('ojo', { tamano: 14 })]);
  const inputWrap = crearEl('div', { class: 'val-wrap' }, [input, ojo]);

  const medidor = conMedidor && crearEl('div', { class: 'pwd-medidor' }, [
    crearEl('div', { class: 'pwd-medidor__barras' },
      Array.from({ length: 4 }, () => crearEl('div', { class: 'pwd-medidor__barra' }))),
    crearEl('span', { class: 'pwd-medidor__lbl' }),
  ]);

  const lista = crearEl('ul', { class: 'pwd-criterios' },
    CRITERIOS_PWD.map((c) => crearEl('li', {
      class: 'pwd-criterio',
      'data-id': c.id,
    }, [
      crearEl('span', { class: 'pwd-criterio__icono' }, [Icono('check', { tamano: 11 })]),
      crearEl('span', { class: 'pwd-criterio__lbl' }, [c.label]),
    ])),
  );

  efecto(() => {
    const v = valor.value;
    let cumplidos = 0;
    CRITERIOS_PWD.forEach((c) => {
      const ok = c.test(v);
      if (ok) cumplidos++;
      const li = lista.querySelector(`[data-id='${c.id}']`);
      li.classList.toggle('pwd-criterio--ok', ok);
    });
    if (medidor) {
      const colores = ['var(--muted)', '#ef4444', '#f97316', '#eab308', '#22c55e'];
      const labels = ['', 'Muy débil', 'Débil', 'Aceptable', 'Fuerte'];
      const score = Math.min(4, Math.max(0, cumplidos - 1));
      const barras = medidor.querySelectorAll('.pwd-medidor__barra');
      barras.forEach((b, i) => {
        b.style.background = i < score ? colores[score] : 'var(--muted)';
      });
      const lbl = medidor.querySelector('.pwd-medidor__lbl');
      lbl.textContent = v ? labels[score] : '';
      lbl.style.color = colores[score];
    }
  });

  wrap.appendChild(inputWrap);
  if (medidor) wrap.appendChild(medidor);
  wrap.appendChild(lista);

  if (registrar) {
    registrar({
      id: idCampo, label: 'Contraseña',
      get valor() { return valor.peek(); },
      get error() {
        const v = valor.peek();
        if (!v) return 'Requerido';
        return CRITERIOS_PWD.every((c) => c.test(v)) ? null : 'Contraseña débil';
      },
      get tocado() { return valor.peek().length > 0; },
      forzarValidacion: () => {},
      enfocar: () => { input.focus(); input.scrollIntoView({ behavior: 'smooth', block: 'center' }); },
      suscribir: (fn) => efecto(() => fn({ valor: valor.value })),
    });
  }
  return wrap;
};

// ===========================================================================
//  ResumenErrores — panel sticky con conteo + jump links
// ===========================================================================
export const ResumenErrores = ({ form }) => {
  const wrap = crearEl('div', { class: 'val-resumen' });
  const head = crearEl('div', { class: 'val-resumen__head' });
  const lista = crearEl('ul', { class: 'val-resumen__lista' });
  wrap.appendChild(head);
  wrap.appendChild(lista);

  efecto(() => {
    const errores = form.errores.value;
    if (errores.length === 0) {
      wrap.classList.remove('val-resumen--mostrar');
      return;
    }
    wrap.classList.add('val-resumen--mostrar');
    head.replaceChildren(
      Icono('alerta', { tamano: 14 }),
      ` Hay ${errores.length} ${errores.length === 1 ? 'error' : 'errores'} en el formulario`,
    );
    lista.replaceChildren(...errores.map((c) => crearEl('li', null, [
      crearEl('a', {
        href: '#',
        onClick: (e) => { e.preventDefault(); c.enfocar(); },
      }, [`${c.label || c.id} — ${c.error}`]),
    ])));
  });

  return wrap;
};

// ===========================================================================
//  FormValidator — orchestrator que coordina varios CampoValidado
// ===========================================================================
export const crearFormValidator = () => {
  const campos = [];
  const errores = senal([]);
  const esValido = senal(false);

  const recalcular = () => {
    const conErr = campos
      .filter((c) => c.error)
      .map((c) => ({ id: c.id, label: c.label, error: c.error, enfocar: c.enfocar }));
    errores.value = conErr;
    esValido.value = conErr.length === 0 && campos.every((c) => c.valor);
  };

  return {
    errores, esValido,
    registrar: (handle) => {
      campos.push(handle);
      handle.suscribir(() => recalcular());
      return () => {
        const i = campos.indexOf(handle);
        if (i >= 0) campos.splice(i, 1);
        recalcular();
      };
    },
    submit: () => {
      campos.forEach((c) => c.forzarValidacion && c.forzarValidacion());
      recalcular();
      const primerError = errores.peek()[0];
      if (primerError) primerError.enfocar();
      return errores.peek().length === 0;
    },
  };
};
