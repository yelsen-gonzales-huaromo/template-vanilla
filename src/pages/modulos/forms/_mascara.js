/**
 * Input mask vanilla JS — sin Inputmask (~25 KB) ni dependencias.
 *
 * Convención de máscara:
 *   9   → un dígito (0-9)
 *   A   → una letra mayúscula (autoconvierte)
 *   a   → una letra minúscula (autoconvierte)
 *   n   → letra o dígito (alfanumérico)
 *   *   → cualquier carácter
 *   Cualquier otro carácter (espacio, guion, /, +, paréntesis, Q, etc.) es LITERAL
 *   y se inserta automáticamente mientras el usuario tipea solo los tokens.
 *
 * Componentes exportados:
 *   - aplicarMascara(input, mask)  → ata la máscara a un input ya creado
 *   - MaskedInput({ mask, ... })   → crea un input con máscara y validación
 *   - CardInput({ ... })           → tarjeta con detección de marca + Luhn
 *
 * Validación opcional:
 *   - validador: (value) => true|false|null  (null = neutral)
 *   - Muestra check verde / X rojo en el ícono al final del input
 */

import { crearEl } from '../../../utils/helpers/dom.js';
import { Icono } from '../../../components/ui/icon/icons.js';

// ---------------------------------------------------------------------------
//  Engine de máscara
// ---------------------------------------------------------------------------
const TOKENS = '9aAn*';
const esToken = (c) => TOKENS.includes(c);
const matches = (char, type) => {
  if (type === '9') return /\d/.test(char);
  if (type === 'a' || type === 'A') return /[a-z]/i.test(char);
  if (type === 'n') return /[a-z0-9]/i.test(char);
  if (type === '*') return true;
  return false;
};

// "Meaningful" = todo lo que no sea separador típico (espacios, guiones, slash, paréntesis).
// Esto se usa para extraer la parte que el usuario escribió, ignorando los literales.
const limpiarValor = (val) => val.replace(/[^a-z0-9*]/gi, '');

const formatear = (raw, mask) => {
  let out = '';
  let r = 0;
  for (let i = 0; i < mask.length; i++) {
    const m = mask[i];
    if (!esToken(m)) {
      // Si el usuario tipeó este literal, sáltalo en raw
      if (raw[r] && raw[r].toLowerCase() === m.toLowerCase()) r++;
      // Solo agrega el literal si ya hemos comenzado o si vamos a agregar más
      if (out.length > 0 || r < raw.length) out += m;
      continue;
    }
    while (r < raw.length && !matches(raw[r], m)) r++;
    if (r >= raw.length) break;
    let c = raw[r];
    if (m === 'A') c = c.toUpperCase();
    if (m === 'a') c = c.toLowerCase();
    out += c;
    r++;
  }
  return out;
};

const placeholderDeMask = (mask) =>
  mask.replace(/9/g, '_').replace(/[aAn]/g, '_').replace(/\*/g, '_');

// ---------------------------------------------------------------------------
//  aplicarMascara — ata el comportamiento a un <input> ya creado
// ---------------------------------------------------------------------------
export const aplicarMascara = (input, mask) => {
  if (!input.placeholder) input.placeholder = placeholderDeMask(mask);

  const reformatear = () => {
    const cursorOriginal = input.selectionStart;
    const valOriginal = input.value;

    // Cuántos chars meaningful hay ANTES del cursor
    const meaningfulAntesCursor = limpiarValor(valOriginal.slice(0, cursorOriginal)).length;

    const raw = limpiarValor(valOriginal);
    const formatted = formatear(raw, mask);
    if (formatted === valOriginal) return;
    input.value = formatted;

    // Reposicionar cursor: avanzar hasta haber pasado `meaningfulAntesCursor`
    // chars meaningful en la nueva versión formateada.
    let count = 0;
    let nuevaPos = formatted.length;
    for (let i = 0; i <= formatted.length; i++) {
      if (count === meaningfulAntesCursor) { nuevaPos = i; break; }
      const c = formatted[i];
      if (c && /[a-z0-9]/i.test(c)) count++;
    }
    try { input.setSelectionRange(nuevaPos, nuevaPos); } catch {}
  };

  input.addEventListener('input', reformatear);
  // Si el input ya tiene valor inicial, formatéalo
  if (input.value) {
    requestAnimationFrame(() => {
      input.value = formatear(limpiarValor(input.value), mask);
    });
  }
};

// ---------------------------------------------------------------------------
//  MaskedInput — wrapper con campo + ícono de validación al final
// ---------------------------------------------------------------------------
export const MaskedInput = ({
  mask,
  placeholder,
  value = '',
  validador,        // (val) => true | false | null
  onChange,
  ...resto
} = {}) => {
  const input = crearEl('input', {
    type: 'text',
    class: 'input',
    placeholder: placeholder || (mask ? placeholderDeMask(mask) : ''),
    value: value && mask ? formatear(limpiarValor(value), mask) : value,
    autocomplete: 'off',
    ...resto,
  });

  if (mask) aplicarMascara(input, mask);

  if (!validador && !onChange) return input;

  // Wrapper con badge de validación
  const wrap = crearEl('div', { class: 'mask-wrap' }, [input]);
  const badge = crearEl('span', { class: 'mask-badge' });
  wrap.appendChild(badge);

  const refresh = () => {
    if (onChange) onChange(input.value);
    if (!validador) return;
    const r = validador(input.value);
    badge.replaceChildren();
    badge.classList.remove('mask-badge--ok', 'mask-badge--err');
    input.classList.remove('input--invalido');
    input.removeAttribute('data-valido');
    if (r === true) {
      badge.appendChild(Icono('check', { tamano: 14 }));
      badge.classList.add('mask-badge--ok');
      input.setAttribute('data-valido', 'true');
    } else if (r === false && input.value.trim() !== '') {
      badge.appendChild(Icono('cerrar', { tamano: 14 }));
      badge.classList.add('mask-badge--err');
      input.setAttribute('aria-invalid', 'true');
    }
  };

  input.addEventListener('input', refresh);
  requestAnimationFrame(refresh);
  return wrap;
};

// ===========================================================================
//  Tarjeta de crédito — detección de marca + máscara dinámica + Luhn
// ===========================================================================
const MARCAS = [
  { id: 'visa',     nombre: 'Visa',       prefijo: /^4/,                                   length: [13, 16, 19], gaps: [4, 8, 12] },
  { id: 'amex',     nombre: 'Amex',       prefijo: /^(34|37)/,                             length: [15],          gaps: [4, 10] },
  { id: 'mastercard',nombre:'Mastercard',prefijo: /^(5[1-5]|2[2-7])/,                    length: [16],          gaps: [4, 8, 12] },
  { id: 'discover', nombre: 'Discover',   prefijo: /^(6011|65|64[4-9])/,                  length: [16, 19],     gaps: [4, 8, 12] },
  { id: 'diners',   nombre: 'Diners',     prefijo: /^(36|38|30[0-5])/,                    length: [14],          gaps: [4, 10] },
  { id: 'jcb',      nombre: 'JCB',        prefijo: /^35(2[89]|[3-8])/,                    length: [16],          gaps: [4, 8, 12] },
  { id: 'unionpay', nombre: 'UnionPay',   prefijo: /^(62|81)/,                            length: [16, 17, 18, 19], gaps: [4, 8, 12] },
];

export const detectarMarca = (numero) => {
  const limpio = numero.replace(/\D/g, '');
  if (!limpio) return null;
  return MARCAS.find((m) => m.prefijo.test(limpio)) || null;
};

const formatearTarjeta = (numero, gaps) => {
  const limpio = numero.replace(/\D/g, '');
  let out = '';
  for (let i = 0; i < limpio.length; i++) {
    if (gaps.includes(i) && i !== 0) out += ' ';
    out += limpio[i];
  }
  return out;
};

// Algoritmo de Luhn (validación de checksum de tarjetas)
export const validarLuhn = (numero) => {
  const limpio = numero.replace(/\D/g, '');
  if (limpio.length < 12) return false;
  let suma = 0;
  let alterna = false;
  for (let i = limpio.length - 1; i >= 0; i--) {
    let n = parseInt(limpio[i], 10);
    if (alterna) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    suma += n;
    alterna = !alterna;
  }
  return suma % 10 === 0;
};

// ---------- Logos SVG inline de las marcas (mini, ~24px) ----------
const LOGOS = {
  visa: `<svg viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" font-family="Arial Black,Helvetica,sans-serif" font-size="18" font-style="italic" font-weight="900" fill="#1a1f71">VISA</text></svg>`,
  mastercard: `<svg viewBox="0 0 40 28" xmlns="http://www.w3.org/2000/svg"><circle cx="14" cy="14" r="12" fill="#eb001b"/><circle cx="26" cy="14" r="12" fill="#f79e1b"/><path d="M20 5.5a11.97 11.97 0 0 0 0 17 11.97 11.97 0 0 0 0-17z" fill="#ff5f00"/></svg>`,
  amex: `<svg viewBox="0 0 60 22" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="22" rx="3" fill="#2e77bb"/><text x="6" y="15" font-family="Arial,Helvetica,sans-serif" font-size="9" font-weight="900" fill="#fff">AMEX</text></svg>`,
  discover: `<svg viewBox="0 0 60 22" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="22" rx="3" fill="#fff" stroke="#e5e7eb"/><text x="3" y="15" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700" fill="#231f20">DISCOVER</text><circle cx="55" cy="15" r="4" fill="#ff6000"/></svg>`,
  diners: `<svg viewBox="0 0 60 22" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="22" rx="3" fill="#0079be"/><text x="6" y="15" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700" fill="#fff">DINERS</text></svg>`,
  jcb: `<svg viewBox="0 0 60 22" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="22" rx="3" fill="#fff" stroke="#e5e7eb"/><text x="14" y="15" font-family="Arial,Helvetica,sans-serif" font-size="11" font-weight="900" fill="#0e4c96">JCB</text></svg>`,
  unionpay: `<svg viewBox="0 0 60 22" xmlns="http://www.w3.org/2000/svg"><rect width="60" height="22" rx="3" fill="#e21836"/><text x="3" y="15" font-family="Arial,Helvetica,sans-serif" font-size="8" font-weight="700" fill="#fff">UnionPay</text></svg>`,
};

const renderLogo = (marcaId) => {
  const wrap = crearEl('span', { class: 'mask-card-logo' });
  if (LOGOS[marcaId]) wrap.innerHTML = LOGOS[marcaId];
  else wrap.appendChild(Icono('tarjeta', { tamano: 16 }));
  return wrap;
};

// ---------------------------------------------------------------------------
//  CardInput — input de número de tarjeta (auto-formato + brand + Luhn)
// ---------------------------------------------------------------------------
export const CardInput = ({ value = '', onChange } = {}) => {
  let marcaActual = null;

  const input = crearEl('input', {
    type: 'text',
    class: 'input mask-card-input',
    placeholder: '1234 1234 1234 1234',
    inputMode: 'numeric',
    autocomplete: 'cc-number',
    value,
  });

  const logo = crearEl('span', { class: 'mask-card-brand' });
  const validBadge = crearEl('span', { class: 'mask-badge' });

  const wrap = crearEl('div', { class: 'mask-wrap mask-wrap--card' }, [input, logo, validBadge]);

  const refresh = () => {
    const cursor = input.selectionStart;
    const sucio = input.value;
    const limpio = sucio.replace(/\D/g, '');
    const marca = detectarMarca(limpio);
    const gaps = marca ? marca.gaps : [4, 8, 12];
    const maxLen = marca ? Math.max(...marca.length) : 19;
    const recortado = limpio.slice(0, maxLen);
    const formatted = formatearTarjeta(recortado, gaps);

    // Recoloca el cursor preservando la posición meaningful
    const meaningfulAntes = sucio.slice(0, cursor).replace(/\D/g, '').length;
    if (input.value !== formatted) {
      input.value = formatted;
      let count = 0;
      let nueva = formatted.length;
      for (let i = 0; i <= formatted.length; i++) {
        if (count === meaningfulAntes) { nueva = i; break; }
        if (formatted[i] && /\d/.test(formatted[i])) count++;
      }
      try { input.setSelectionRange(nueva, nueva); } catch {}
    }

    // Logo
    if (marca?.id !== marcaActual) {
      marcaActual = marca?.id || null;
      logo.replaceChildren();
      if (marca) logo.appendChild(renderLogo(marca.id));
    }

    // Badge
    validBadge.replaceChildren();
    validBadge.classList.remove('mask-badge--ok', 'mask-badge--err');
    input.removeAttribute('data-valido');
    input.removeAttribute('aria-invalid');
    if (marca && marca.length.includes(limpio.length)) {
      const ok = validarLuhn(limpio);
      validBadge.appendChild(Icono(ok ? 'check' : 'cerrar', { tamano: 14 }));
      validBadge.classList.add(ok ? 'mask-badge--ok' : 'mask-badge--err');
      if (ok) input.setAttribute('data-valido', 'true');
      else input.setAttribute('aria-invalid', 'true');
    }

    if (onChange) onChange({
      numero: limpio,
      formato: formatted,
      marca: marca ? marca.nombre : null,
      valida: marca && marca.length.includes(limpio.length) && validarLuhn(limpio),
    });
  };

  input.addEventListener('input', refresh);
  requestAnimationFrame(refresh);
  return wrap;
};

// ---------------------------------------------------------------------------
//  Validadores útiles para usar en `MaskedInput({ validador })`
// ---------------------------------------------------------------------------
export const validadores = {
  fechaDDMMYYYY: (v) => {
    if (v.length < 10) return null;
    const m = v.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (!m) return false;
    const d = new Date(+m[3], +m[2] - 1, +m[1]);
    return d.getFullYear() === +m[3] && d.getMonth() === +m[2] - 1 && d.getDate() === +m[1];
  },
  fechaMMYY: (v) => {
    if (v.length < 5) return null;
    const m = v.match(/^(\d{2})\/(\d{2})$/);
    if (!m) return false;
    const mes = +m[1], anio = 2000 + +m[2];
    if (mes < 1 || mes > 12) return false;
    const ahora = new Date();
    const exp = new Date(anio, mes, 0); // último día del mes
    return exp >= ahora;
  },
  cvv: (v) => {
    const limpio = v.replace(/\D/g, '');
    if (limpio.length < 3) return null;
    return limpio.length === 3 || limpio.length === 4;
  },
  // DNI Perú (8 dígitos)
  dniPe: (v) => {
    if (v.length < 8) return null;
    return /^\d{8}$/.test(v);
  },
  // DNI España (8 dígitos + letra de control)
  dniEs: (v) => {
    if (v.length < 9) return null;
    const m = v.match(/^(\d{8})([A-Z])$/);
    if (!m) return false;
    const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
    return letras[+m[1] % 23] === m[2];
  },
  // IBAN (validación módulo 97 simplificada)
  iban: (v) => {
    const limpio = v.replace(/\s/g, '').toUpperCase();
    if (limpio.length < 15) return null;
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(limpio)) return false;
    // Mover los 4 primeros al final
    const reorg = limpio.slice(4) + limpio.slice(0, 4);
    // Convertir letras a números (A=10, B=11, … Z=35)
    let num = '';
    for (const c of reorg) {
      num += /[A-Z]/.test(c) ? (c.charCodeAt(0) - 55) : c;
    }
    // Mod 97 sobre string largo (BigInt)
    try { return BigInt(num) % 97n === 1n; } catch { return false; }
  },
};
