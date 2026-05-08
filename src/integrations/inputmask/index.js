/**
 * Adaptador para Inputmask — máscaras de teléfonos, fechas, tarjetas, etc.
 *  https://github.com/RobinHerbots/Inputmask
 *
 *   const input = document.querySelector('#telefono');
 *   await aplicarMascara(input, '+34 999 999 999');
 *   // O usa los presets:
 *   await aplicarMascara(input, 'telefono');
 */
import { cargarLib } from '../_loader.js';

const VERSION = '5.0.9';
const URL_JS = `https://cdn.jsdelivr.net/npm/inputmask@${VERSION}/dist/inputmask.min.js`;

export const cargarInputmask = () => cargarLib({
  scripts: URL_JS,
  global: 'Inputmask',
});

const PRESETS = {
  telefono:    '+34 999 999 999',
  movil:       '+34 6\\99 999 999',
  fecha:       'datetime', // alias del preset interno de inputmask
  hora:        'datetime',
  cp:          '99999',
  dni:         '99999999A',
  nif:         '[A-Z]9999999[A-Z]',
  cif:         '[A-Z]99999999',
  iban_es:     'ES99 9999 9999 9999 9999 9999',
  tarjeta:     '9999 9999 9999 9999',
  cvv:         '999',
  porcentaje:  'decimal',
  moneda:      'currency',
  numero:      'integer',
};

/** Aplica una máscara o preset a un input. Devuelve la instancia. */
export const aplicarMascara = async (input, mascaraOPreset, opciones = {}) => {
  const Inputmask = await cargarInputmask();

  const def = PRESETS[mascaraOPreset];
  if (def && ['datetime', 'currency', 'decimal', 'integer'].includes(def)) {
    return Inputmask({ alias: def, ...opciones }).mask(input);
  }
  const mask = def || mascaraOPreset;
  return Inputmask({ mask, showMaskOnHover: false, ...opciones }).mask(input);
};

/** Recorre el DOM y aplica máscaras a inputs con `[data-mascara]`. */
export const aplicarMascarasGlobales = async (raiz = document) => {
  const Inputmask = await cargarInputmask();
  raiz.querySelectorAll('input[data-mascara]').forEach((input) => {
    const m = input.dataset.mascara;
    const def = PRESETS[m] || m;
    if (['datetime', 'currency', 'decimal', 'integer'].includes(def)) {
      Inputmask({ alias: def }).mask(input);
    } else {
      Inputmask({ mask: def, showMaskOnHover: false }).mask(input);
    }
  });
};
