/**
 * Adaptador para Choices.js — selects mejorados (búsqueda, multi-selección, tags).
 *  https://choices-js.github.io/Choices/
 *
 *   const { select, instancia } = await SelectorAvanzado({
 *     opciones: [{ value: 'a', label: 'Alfa' }, ...],
 *     multiple: true, busqueda: true,
 *   });
 *   form.appendChild(select);
 */
import { cargarLib } from '../_loader.js';

const VERSION = '11.0.2';
const URL_CSS = `https://cdn.jsdelivr.net/npm/choices.js@${VERSION}/public/assets/styles/choices.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/choices.js@${VERSION}/public/assets/scripts/choices.min.js`;

export const cargarChoices = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'Choices',
});

/**
 * @param {object} opts
 * @param {Array<{value, label, selected?, disabled?}>} opts.opciones
 * @param {boolean} [opts.multiple=false]
 * @param {boolean} [opts.busqueda=true]
 * @param {boolean} [opts.eliminables=true]   — para multi-select (chips removibles)
 * @param {string}  [opts.placeholder]
 * @param {Function}[opts.onChange]
 * @returns {Promise<{select: HTMLSelectElement, instancia: object}>}
 */
export const SelectorAvanzado = async ({
  opciones = [],
  multiple = false,
  busqueda = true,
  eliminables = true,
  placeholder = 'Selecciona…',
  onChange,
} = {}) => {
  const Choices = await cargarChoices();
  const select = document.createElement('select');
  select.className = 'select';
  if (multiple) select.multiple = true;
  for (const op of opciones) {
    const o = document.createElement('option');
    o.value = op.value;
    o.textContent = op.label;
    if (op.selected) o.selected = true;
    if (op.disabled) o.disabled = true;
    select.appendChild(o);
  }

  const instancia = new Choices(select, {
    searchEnabled: busqueda,
    removeItemButton: eliminables && multiple,
    placeholder: !!placeholder,
    placeholderValue: placeholder,
    shouldSort: false,
    itemSelectText: '',
    noResultsText: 'Sin resultados',
    noChoicesText: 'Sin opciones',
    loadingText: 'Cargando…',
  });

  if (onChange) {
    select.addEventListener('change', () => {
      const valor = multiple
        ? Array.from(select.selectedOptions).map(o => o.value)
        : select.value;
      onChange(valor);
    });
  }

  return { select, instancia };
};
