/**
 * Adaptador para Flatpickr — selector de fechas.
 *  https://flatpickr.js.org/
 *
 * Uso:
 *   import { SelectorFecha } from '@integrations/flatpickr';
 *   const { input, instancia } = await SelectorFecha({ value: '2026-05-01', onChange: f => ... });
 *   form.appendChild(input);
 */
import { cargarLib, cargarScript } from '../_loader.js';
import { estadoUi } from '../../store/ui.store.js';

const VERSION = '4.6.13';
const URL_CSS = `https://cdn.jsdelivr.net/npm/flatpickr@${VERSION}/dist/flatpickr.min.css`;
const URL_TEMA_OSCURO = `https://cdn.jsdelivr.net/npm/flatpickr@${VERSION}/dist/themes/dark.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/flatpickr@${VERSION}/dist/flatpickr.min.js`;
const URL_ES  = `https://cdn.jsdelivr.net/npm/flatpickr@${VERSION}/dist/l10n/es.js`;

let yaInicializado = false;

/** Carga flatpickr una sola vez y aplica locale español + tema oscuro si toca. */
export const cargarFlatpickr = async () => {
  const flatpickr = await cargarLib({
    css: estadoUi.tema.peek() === 'dark' ? [URL_CSS, URL_TEMA_OSCURO] : URL_CSS,
    scripts: URL_JS,
    global: 'flatpickr',
  });

  if (!yaInicializado) {
    try {
      await cargarScript(URL_ES);
      if (flatpickr.l10ns?.es) flatpickr.localize(flatpickr.l10ns.es);
    } catch { /* locale opcional */ }
    yaInicializado = true;
  }

  return flatpickr;
};

/**
 * Crea un <input> con flatpickr inicializado.
 * @param {object} opts
 * @param {string|Date} [opts.value]      Valor inicial.
 * @param {Function} [opts.onChange]      Callback (Date) → void.
 * @param {boolean}  [opts.rango]         Selector de rango (2 fechas).
 * @param {boolean}  [opts.tiempo]        Incluir hora (datetime-local).
 * @param {string}   [opts.formato]       Formato de salida (default 'Y-m-d').
 * @returns {Promise<{input:HTMLInputElement, instancia:object}>}
 */
export const SelectorFecha = async ({
  value, onChange, rango = false, tiempo = false, formato, ...resto
} = {}) => {
  const flatpickr = await cargarFlatpickr();

  const input = document.createElement('input');
  input.className = 'input';
  input.type = 'text';
  input.placeholder = tiempo ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD';

  const instancia = flatpickr(input, {
    dateFormat: formato || (tiempo ? 'Y-m-d H:i' : 'Y-m-d'),
    enableTime: tiempo,
    mode: rango ? 'range' : 'single',
    defaultDate: value,
    onChange: (fechas) => onChange?.(rango ? fechas : fechas[0]),
    ...resto,
  });

  return { input, instancia };
};
