/**
 * Adaptador para DataTables.net — tablas con búsqueda, ordenación, paginación.
 *  https://datatables.net/
 *
 * Si te basta con sortear/buscar, usa nuestro `Tabla` + `usarPaginacion` nativo.
 * DataTables es para tablas grandes (>1000 filas) con server-side processing.
 *
 *   const { tabla, instancia } = await TablaAvanzada({
 *     columnas: [{ titulo: 'Nombre' }, { titulo: 'Email' }],
 *     filas: [['Ana', 'ana@x.com'], ['Carlos', 'c@x.com']],
 *     pageSize: 25,
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '2.1.8';
const URL_CSS = `https://cdn.jsdelivr.net/npm/datatables.net-dt@${VERSION}/css/dataTables.dataTables.min.css`;
const URL_JS  = `https://cdn.jsdelivr.net/npm/datatables.net@${VERSION}/js/dataTables.min.js`;

export const cargarDataTables = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'DataTable',
});

const ES = {
  search: 'Buscar:',
  lengthMenu: 'Mostrar _MENU_ filas',
  info: 'De _START_ a _END_ de _TOTAL_',
  infoEmpty: 'Sin resultados',
  infoFiltered: '(filtrado de _MAX_)',
  paginate: { previous: '‹', next: '›', first: '«', last: '»' },
  emptyTable: 'No hay datos',
  zeroRecords: 'No se encontraron coincidencias',
};

/**
 * @param {object} opts
 * @param {Array<{titulo:string}>} opts.columnas
 * @param {Array<Array>}           opts.filas
 * @param {number}                 [opts.pageSize=10]
 * @param {boolean}                [opts.busqueda=true]
 * @param {boolean}                [opts.ordenable=true]
 */
export const TablaAvanzada = async ({
  columnas = [], filas = [], pageSize = 10,
  busqueda = true, ordenable = true,
} = {}) => {
  const DataTable = await cargarDataTables();

  const tabla = document.createElement('table');
  tabla.className = 'table';
  tabla.style.width = '100%';
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  columnas.forEach(c => {
    const th = document.createElement('th');
    th.textContent = c.titulo;
    tr.appendChild(th);
  });
  thead.appendChild(tr);
  tabla.appendChild(thead);
  tabla.appendChild(document.createElement('tbody'));

  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  wrapper.appendChild(tabla);

  // Inicializar tras montar.
  const observador = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) {
      observador.disconnect();
      new DataTable(tabla, {
        data: filas,
        pageLength: pageSize,
        searching: busqueda,
        ordering: ordenable,
        language: ES,
      });
    }
  });
  observador.observe(wrapper);

  return { tabla: wrapper };
};
