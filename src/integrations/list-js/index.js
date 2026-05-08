/**
 * Adaptador para List.js — añade búsqueda/filtrado/ordenación a listas HTML.
 *  https://listjs.com/
 *
 *   const lista = await ListaBuscable({
 *     contenedor: ulRef,
 *     valueNames: ['nombre', 'correo'],
 *   });
 *   lista.search('ana');           // filtra
 *   lista.sort('nombre', { order: 'asc' });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '2.3.1';
const URL_JS = `https://cdn.jsdelivr.net/npm/list.js@${VERSION}/dist/list.min.js`;

export const cargarListJs = () => cargarLib({ scripts: URL_JS, global: 'List' });

/**
 * @param {object} opts
 * @param {HTMLElement} opts.contenedor   — debe tener internamente `.list` y opcional `.search`.
 * @param {string[]}    opts.valueNames   — clases CSS de los campos a indexar.
 */
export const ListaBuscable = async ({ contenedor, valueNames = [] } = {}) => {
  const List = await cargarListJs();
  return new List(contenedor, { valueNames });
};
