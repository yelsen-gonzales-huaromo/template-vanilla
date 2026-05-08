import { crearEl } from '../../../utils/helpers/dom.js';

/**
 * Tabla declarativa — pasa `columnas` y `filas`. Las columnas pueden declarar `render(fila)`
 * para inyectar celdas personalizadas (insignias, acciones). Sin deps externas, sin jQuery DataTables.
 */
export const Tabla = ({ columnas = [], filas = [], variante = '', mensajeVacio = 'Sin datos' } = {}) => {
  if (filas.length === 0) {
    return crearEl('div', { class: 'table-wrapper' }, [
      crearEl('div', { class: 'table-empty' }, [mensajeVacio]),
    ]);
  }

  return crearEl('div', { class: 'table-wrapper' }, [
    crearEl('table', { class: ['table', variante && `table--${variante}`] }, [
      crearEl('thead', null, [
        crearEl('tr', null, columnas.map(col => crearEl('th', { scope: 'col' }, [col.etiqueta]))),
      ]),
      crearEl('tbody', null, filas.map(fila =>
        crearEl('tr', null, columnas.map(col => {
          const celda = col.render ? col.render(fila) : fila[col.clave];
          return crearEl('td', null, [celda]);
        }))
      )),
    ]),
  ]);
};
