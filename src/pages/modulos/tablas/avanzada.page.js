import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto, calculado } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { Boton } from '../../../components/ui/button/button.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';
import { TablaPro } from './_tabla-pro.js';
import {
  cellPersona, cellTag, cellEstado, cellMoney, cellDelta, cellAcciones, cellAvatarGrupo, cellBarra,
  generarEmpleados, generarOrdenes, generarTasks,
} from './_compartido.js';

// ============================================================================
//  TablaAvanzada — componente reactivo con sort + filter + search + paginación
// ============================================================================
const TablaAvanzada = ({ columnas, filas, conSearch = true, conFiltros, pageSize = 10, sortInicial }) => {
  const busqueda = senal('');
  const ordenCol = senal(sortInicial?.col || null);
  const ordenDir = senal(sortInicial?.dir || 'asc');
  const filtros = senal({});
  const paginaActual = senal(1);

  // === Datos derivados ===
  const filasFiltradas = calculado(() => {
    let out = filas;
    const q = busqueda.value.toLowerCase().trim();
    if (q) {
      out = out.filter((f) => Object.values(f).some((v) => String(v).toLowerCase().includes(q)));
    }
    Object.entries(filtros.value).forEach(([k, valor]) => {
      if (valor === null || valor === undefined || valor === 'todos') return;
      out = out.filter((f) => f[k] === valor);
    });
    if (ordenCol.value) {
      const dir = ordenDir.value === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const va = a[ordenCol.value], vb = b[ordenCol.value];
        if (va < vb) return -1 * dir;
        if (va > vb) return 1 * dir;
        return 0;
      });
    }
    return out;
  });

  const totalPaginas = calculado(() => Math.max(1, Math.ceil(filasFiltradas.value.length / pageSize)));
  const filasPagina = calculado(() => {
    const p = Math.min(paginaActual.value, totalPaginas.value);
    if (paginaActual.peek() !== p) paginaActual.value = p;
    const desde = (p - 1) * pageSize;
    return filasFiltradas.value.slice(desde, desde + pageSize);
  });

  // === UI ===
  // Toolbar
  const inputBuscar = crearEl('input', {
    type: 'search', placeholder: 'Buscar…',
    onInput: (e) => { busqueda.value = e.currentTarget.value; paginaActual.value = 1; },
  });
  const toolbar = conSearch || conFiltros ? crearEl('div', { class: 'tabla-toolbar' }, [
    conSearch && crearEl('div', { class: 'tabla-toolbar__buscador' }, [
      Icono('busqueda', { tamano: 14 }),
      inputBuscar,
    ]),
    conFiltros && crearEl('div', { class: 'filter-chips' },
      conFiltros.map((f) => {
        const chip = crearEl('button', {
          class: 'filter-chip',
          onClick: () => {
            const actual = filtros.peek()[f.clave];
            filtros.value = { ...filtros.peek(), [f.clave]: actual === f.valor ? null : f.valor };
            paginaActual.value = 1;
          },
        }, [f.label, f.count !== undefined && crearEl('span', { class: 'filter-chip__count' }, [String(f.count)])]);
        efecto(() => { chip.dataset.activo = String(filtros.value[f.clave] === f.valor); });
        return chip;
      }),
    ),
  ]) : null;

  // Tabla
  const wrapper = crearEl('div', { class: 'table-wrapper', style: { borderRadius: 'var(--radius)' } });
  const thead = crearEl('thead', null, [
    crearEl('tr', null, columnas.map((col) => {
      const th = crearEl('th', {
        scope: 'col',
        class: col.sortable !== false ? 'table__th--sortable' : '',
        onClick: col.sortable !== false ? () => {
          if (ordenCol.peek() === col.clave) {
            ordenDir.value = ordenDir.peek() === 'asc' ? 'desc' : 'asc';
          } else {
            ordenCol.value = col.clave;
            ordenDir.value = 'asc';
          }
        } : undefined,
      }, [col.etiqueta]);
      if (col.sortable !== false) {
        efecto(() => {
          if (ordenCol.value === col.clave) {
            th.dataset.orden = ordenDir.value;
          } else {
            delete th.dataset.orden;
          }
        });
      }
      return th;
    })),
  ]);

  const tbody = crearEl('tbody');
  const renderTbody = () => {
    const filas = filasPagina.value;
    if (filas.length === 0) {
      tbody.replaceChildren(crearEl('tr', null, [
        crearEl('td', { colspan: columnas.length, style: { padding: 'var(--space-6)', textAlign: 'center', color: 'var(--muted-foreground)' } }, [
          'No hay resultados que coincidan con tu búsqueda.',
        ]),
      ]));
      return;
    }
    tbody.replaceChildren(...filas.map((fila) => crearEl('tr', null, columnas.map((col) =>
      crearEl('td', null, [col.render ? col.render(fila) : fila[col.clave]]),
    ))));
  };
  efecto(renderTbody);

  const tabla = crearEl('table', { class: 'table' }, [thead, tbody]);
  wrapper.appendChild(tabla);

  // Paginación
  const lblConteo = crearEl('span');
  efecto(() => {
    const total = filasFiltradas.value.length;
    const desde = total === 0 ? 0 : (paginaActual.value - 1) * pageSize + 1;
    const hasta = Math.min(total, paginaActual.value * pageSize);
    lblConteo.textContent = `${desde}-${hasta} de ${total}`;
  });

  const botonesPag = crearEl('div', { style: { display: 'flex', gap: '4px' } });
  efecto(() => {
    const p = paginaActual.value, total = totalPaginas.value;
    const ventana = [];
    const max = total;
    const start = Math.max(1, p - 2);
    const end = Math.min(max, p + 2);
    if (start > 1) { ventana.push(1); if (start > 2) ventana.push('…'); }
    for (let i = start; i <= end; i++) ventana.push(i);
    if (end < max) { if (end < max - 1) ventana.push('…'); ventana.push(max); }

    botonesPag.replaceChildren(
      crearEl('button', { class: 'pag-btn', disabled: p === 1, onClick: () => paginaActual.value = p - 1 }, ['‹']),
      ...ventana.map((n) => n === '…'
        ? crearEl('span', { style: { width: '24px', textAlign: 'center', color: 'var(--muted-foreground)' } }, ['…'])
        : crearEl('button', { class: 'pag-btn', 'data-activo': String(n === p), onClick: () => paginaActual.value = n }, [String(n)])),
      crearEl('button', { class: 'pag-btn', disabled: p === total, onClick: () => paginaActual.value = p + 1 }, ['›']),
    );
  });

  const footer = crearEl('div', { class: 'tabla-footer' }, [lblConteo, botonesPag]);

  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
    toolbar, wrapper, footer,
  ]);
};

export default async () => {
  const empleados = generarEmpleados(48);
  const ordenes = generarOrdenes(75);
  const tasks = generarTasks(100);

  // Counts para chips de filtro
  const countEstadoEmp = (est) => empleados.filter((e) => e.estado === est).length;
  const countDept = (d) => empleados.filter((e) => e.departamento === d).length;
  const countEstadoOrd = (est) => ordenes.filter((o) => o.estado === est).length;
  const countTaskEstado = (e) => tasks.filter((t) => t.estado === e).length;
  const countTaskPrio = (p) => tasks.filter((t) => t.prioridad === p).length;
  const countTaskTipo = (t) => tasks.filter((task) => task.tipo === t).length;

  return PaginaShowcase({
    titulo: 'Tablas avanzadas',
    descripcion: 'Tablas con búsqueda en vivo, sorting click-en-header (asc/desc/none), filter chips con counter, paginación inteligente con ventana deslizable y empty state propio. Cero dependencias externas — todo construido con `senal` + `calculado`. Patrón usado en Linear, Notion, GitHub Issues.',
    decoracion: corner3(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Tablas', href: '#/modulos/tablas' },
    ],
    hijos: [

      // ============== 1. TANSTACK PRO — TODO EN UNO ==============
      Seccion({
        titulo: '1 · TablaPro — production-ready (estilo TanStack)',
        descripcion: '100 tareas con TODO: búsqueda · filtros multi-select con dropdown + counts · sort en cualquier columna · bulk select con toolbar flotante · kebab menu (•••) por fila con 5 acciones · column visibility toggle (View) · page size selector (10/15/20/50/100) · "Página X de Y" + first/prev/next/last buttons. La selección persiste entre páginas. Drop-in para producción.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: tasks,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 15, 20, 50, 100],
            searchPlaceholder: 'Filtrar por título o ID…',
            filtros: [
              {
                id: 'estado', label: 'Estado',
                opciones: [
                  { value: 'cancelado',  label: 'Cancelado',   count: countTaskEstado('cancelado')  },
                  { value: 'completado', label: 'Completado',  count: countTaskEstado('completado') },
                  { value: 'pendiente',  label: 'Pendiente',   count: countTaskEstado('pendiente')  },
                  { value: 'progreso',   label: 'En progreso', count: countTaskEstado('progreso')   },
                ],
              },
              {
                id: 'prioridad', label: 'Prioridad',
                opciones: [
                  { value: 'baja',  label: 'Baja',  count: countTaskPrio('baja')  },
                  { value: 'media', label: 'Media', count: countTaskPrio('media') },
                  { value: 'alta',  label: 'Alta',  count: countTaskPrio('alta')  },
                ],
              },
              {
                id: 'tipo', label: 'Tipo',
                opciones: [
                  { value: 'documentacion',   label: 'Documentación',  count: countTaskTipo('documentacion') },
                  { value: 'error',           label: 'Error',          count: countTaskTipo('error') },
                  { value: 'caracteristica',  label: 'Característica', count: countTaskTipo('caracteristica') },
                ],
              },
            ],
            columnas: [
              { id: 'id',          etiqueta: 'Tarea',     render: (t) => crearEl('span', { class: 'cell-id' }, [t.id]) },
              { id: 'titulo',      etiqueta: 'Título',    render: (t) => crearEl('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 } }, [
                cellTag(t.tipoLabel, t.tipo === 'error' ? 'err' : t.tipo === 'caracteristica' ? 'info' : 'default'),
                crearEl('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '420px' } }, [t.titulo]),
              ]) },
              { id: 'estado',      etiqueta: 'Estado',    render: (t) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted-foreground)' } }, [Icono(t.estadoIcon, { tamano: 14 }), t.estadoLabel]) },
              { id: 'prioridad',   etiqueta: 'Prioridad', render: (t) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [Icono(t.prioridadIcon, { tamano: 14 }), t.prioridadLabel]) },
            ],
            accionesBulk: [
              { id: 'compartir', label: 'Compartir',     icono: 'flecha_u',   onClick: () => {} },
              { id: 'reordenar', label: 'Reordenar',     icono: 'ordenar',    onClick: () => {} },
              { id: 'export',    label: 'Exportar CSV',  icono: 'descargar',  onClick: () => {} },
              { id: 'borrar',    label: 'Eliminar',      icono: 'papelera',   peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'editar',   label: 'Editar',            icono: 'editar',     atajo: '⌘E',   onClick: () => {} },
              { id: 'copiar',   label: 'Hacer una copia',   icono: 'copia',       atajo: '⌘D',   onClick: () => {} },
              { id: 'favorito', label: 'Favorito',          icono: 'estrella',   onClick: () => {} },
              { id: 'etiquetas', label: 'Etiquetas',        icono: 'flecha_r',   onClick: () => {} },
              { id: 'borrar',   label: 'Eliminar',          icono: 'papelera',   atajo: '⌫',    peligrosa: true, onClick: () => {} },
            ],
          }),
          codigo: `import { TablaPro } from './_tabla-pro.js';

TablaPro({
  filas: tasks,
  claveID: 'id',
  pageSize: 10,
  pageSizes: [10, 15, 20, 50, 100],            // ← page size selector
  searchPlaceholder: 'Filtrar por título o ID…',

  // Filter dropdowns con counts
  filtros: [
    { id: 'estado', label: 'Estado', opciones: [
      { value: 'cancelado',  label: 'Cancelado',  count: 23 },
      { value: 'completado', label: 'Completado', count: 18 },
      // ...
    ]},
    { id: 'prioridad', label: 'Prioridad', opciones: [...] },
  ],

  columnas: [
    { id: 'id',     etiqueta: 'Tarea' },
    { id: 'titulo', etiqueta: 'Título', render: t => <Cell /> },
    { id: 'estado', etiqueta: 'Estado', sortable: true },
    // ...
  ],

  // Bulk actions (toolbar flotante con icons)
  accionesBulk: [
    { id: 'export',  icono: 'descargar', label: 'Exportar' },
    { id: 'borrar',  icono: 'papelera',  label: 'Eliminar', peligrosa: true },
  ],

  // Kebab menu por fila
  accionesFila: [
    { label: 'Editar',     icono: 'editar',   atajo: '⌘E' },
    { label: 'Hacer copia', icono: 'copia',    atajo: '⌘D' },
    { label: 'Favorito',   icono: 'estrella' },
    { label: 'Eliminar',   icono: 'papelera', atajo: '⌫', peligrosa: true },
  ],
})`,
        })],
      }),

      // ============== 2. EQUIPO COMPLETO (48 empleados) ==============
      Seccion({
        titulo: '2 · Directorio de empleados — search + filtros + sort',
        descripcion: '48 empleados con búsqueda en vivo (busca en cualquier campo), filtros chip por estado, sort en cualquier columna click-on-header, paginación de 10 en 10. Real-world admin dashboard.',
        hijos: [VistaCodigo({
          vista: TablaAvanzada({
            pageSize: 10,
            conFiltros: [
              { clave: 'estado',       valor: 'activo',     label: 'Activos',     count: countEstadoEmp('activo')   },
              { clave: 'estado',       valor: 'inactivo',   label: 'Inactivos',   count: countEstadoEmp('inactivo') },
              { clave: 'estado',       valor: 'baja',       label: 'Baja',        count: countEstadoEmp('baja')     },
              { clave: 'departamento', valor: 'Engineering', label: 'Engineering', count: countDept('Engineering') },
              { clave: 'departamento', valor: 'Product',    label: 'Product',     count: countDept('Product') },
              { clave: 'departamento', valor: 'Design',     label: 'Design',      count: countDept('Design') },
            ],
            sortInicial: { col: 'salario', dir: 'desc' },
            columnas: [
              { etiqueta: 'Empleado', clave: 'nombre',       render: (e) => cellPersona({ nombre: e.nombre, email: e.email, color: e.color }) },
              { etiqueta: 'Rol',      clave: 'rol' },
              { etiqueta: 'Depto.',   clave: 'departamento' },
              { etiqueta: 'País',     clave: 'pais' },
              { etiqueta: 'Nivel',    clave: 'nivel',        render: (e) => cellTag(e.nivel, e.nivel === 'Principal' ? 'purple' : e.nivel === 'Staff' ? 'info' : e.nivel === 'Senior' ? 'ok' : 'default') },
              { etiqueta: 'Salario',  clave: 'salario',      render: (e) => crearEl('div', { class: 'cell-num' }, [cellMoney(e.salario)]) },
              { etiqueta: 'Ingreso',  clave: 'fechaIngreso' },
              { etiqueta: 'Estado',   clave: 'estado',       render: (e) => cellTag(e.estado === 'activo' ? 'Activo' : e.estado === 'inactivo' ? 'Inactivo' : 'Baja', e.estado === 'activo' ? 'ok' : e.estado === 'inactivo' ? 'warn' : 'err') },
              { etiqueta: '', clave: 'acciones', sortable: false, render: () => cellAcciones({ onVer: () => {}, onEditar: () => {}, onBorrar: () => {} }) },
            ],
            filas: empleados,
          }),
          codigo: `TablaAvanzada({
  pageSize: 10,
  conFiltros: [
    { clave: 'estado', valor: 'activo', label: 'Activos', count: 32 },
    { clave: 'departamento', valor: 'Engineering', label: 'Eng', count: 18 },
    // ...
  ],
  sortInicial: { col: 'salario', dir: 'desc' },
  columnas: [
    { etiqueta: 'Empleado', clave: 'nombre', render: e => cellPersona(e) },
    { etiqueta: 'Salario',  clave: 'salario', render: e => cellMoney(e.salario) },
    { etiqueta: '',  sortable: false, render: () => cellAcciones(...) },
  ],
  filas: empleados,
})`,
        })],
      }),

      // ============== 3. ÓRDENES (75) ==============
      Seccion({
        titulo: '3 · Órdenes — 75 transacciones con filtros',
        descripcion: 'Stripe Dashboard pattern. Filtra por estado de la orden con chips. Sort por monto descendente por default para ver primero las grandes.',
        hijos: [VistaCodigo({
          vista: TablaAvanzada({
            pageSize: 12,
            conFiltros: [
              { clave: 'estado', valor: 'completada', label: 'Completadas', count: countEstadoOrd('completada') },
              { clave: 'estado', valor: 'pendiente',  label: 'Pendientes',  count: countEstadoOrd('pendiente')  },
              { clave: 'estado', valor: 'enviada',    label: 'Enviadas',    count: countEstadoOrd('enviada')    },
              { clave: 'estado', valor: 'cancelada',  label: 'Canceladas',  count: countEstadoOrd('cancelada')  },
              { clave: 'estado', valor: 'reembolso',  label: 'Reembolsos',  count: countEstadoOrd('reembolso')  },
            ],
            sortInicial: { col: 'monto', dir: 'desc' },
            columnas: [
              { etiqueta: 'ID',       clave: 'id',     render: (o) => crearEl('span', { class: 'cell-id' }, [o.id]) },
              { etiqueta: 'Cliente',  clave: 'cliente', render: (o) => cellPersona({ nombre: o.cliente, email: o.empresa }) },
              { etiqueta: 'Productos', clave: 'productos', render: (o) => crearEl('div', { class: 'cell-num' }, [`${o.productos} ítems`]) },
              { etiqueta: 'País',     clave: 'pais' },
              { etiqueta: 'Fecha',    clave: 'fecha' },
              { etiqueta: 'Método',   clave: 'metodo' },
              { etiqueta: 'Estado',   clave: 'estado', render: (o) => cellTag(o.estadoLabel, o.estadoTag) },
              { etiqueta: 'Monto',    clave: 'monto',  render: (o) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(o.monto)]) },
            ],
            filas: ordenes,
          }),
          codigo: `// Sort por monto desc, filtros por estado de orden
sortInicial: { col: 'monto', dir: 'desc' },
conFiltros: [
  { clave: 'estado', valor: 'completada', label: 'Completadas', count: 42 },
  { clave: 'estado', valor: 'pendiente',  label: 'Pendientes',  count: 18 },
]`,
        })],
      }),

      // ============== 4. SOLO BÚSQUEDA + STICKY ==============
      Seccion({
        titulo: '4 · Sticky header — sólo búsqueda',
        descripcion: 'Para listas largas, header sticky cuando haces scroll vertical. Útil cuando la tabla está dentro de un dialog o página de altura fija.',
        hijos: [VistaCodigo({
          vista: (() => {
            const busqueda = senal('');
            const filtradas = calculado(() => {
              const q = busqueda.value.toLowerCase().trim();
              return q ? empleados.filter((e) => Object.values(e).some((v) => String(v).toLowerCase().includes(q))) : empleados;
            });
            const inputBuscar = crearEl('input', {
              type: 'search', placeholder: 'Buscar entre 48 empleados…',
              onInput: (e) => { busqueda.value = e.currentTarget.value; },
            });
            const tbody = crearEl('tbody');
            efecto(() => {
              const filas = filtradas.value;
              tbody.replaceChildren(...filas.map((e) => crearEl('tr', null, [
                crearEl('td', null, [cellPersona({ nombre: e.nombre, email: e.email, color: e.color })]),
                crearEl('td', null, [e.rol]),
                crearEl('td', null, [e.departamento]),
                crearEl('td', null, [cellTag(e.nivel, e.nivel === 'Principal' ? 'purple' : 'default')]),
                crearEl('td', { class: 'cell-num' }, [cellMoney(e.salario)]),
              ])));
            });
            return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
              crearEl('div', { class: 'tabla-toolbar' }, [
                crearEl('div', { class: 'tabla-toolbar__buscador' }, [Icono('busqueda', { tamano: 14 }), inputBuscar]),
              ]),
              crearEl('div', { class: 'table-wrapper', style: { maxHeight: '420px', overflow: 'auto' } }, [
                crearEl('table', { class: 'table table--sticky' }, [
                  crearEl('thead', null, [crearEl('tr', null, [
                    crearEl('th', null, ['Empleado']),
                    crearEl('th', null, ['Rol']),
                    crearEl('th', null, ['Departamento']),
                    crearEl('th', null, ['Nivel']),
                    crearEl('th', null, ['Salario']),
                  ])]),
                  tbody,
                ]),
              ]),
            ]);
          })(),
          codigo: `// Wrapper con max-height + overflow auto + table.table--sticky
<div class="table-wrapper" style="max-height: 420px; overflow: auto">
  <table class="table table--sticky">
    <thead><!-- queda sticky ---></thead>
    <tbody>{filas}</tbody>
  </table>
</div>`,
        })],
      }),

      // ============== 5. DENSE + COLUMNAS NUMÉRICAS ==============
      Seccion({
        titulo: '5 · Vista densa para listas grandes',
        descripcion: 'Cuando necesitas ver MUCHO de un vistazo. `--dense` reduce padding y font-size. Ideal para data tables con 500+ rows.',
        hijos: [VistaCodigo({
          vista: TablaAvanzada({
            pageSize: 15,
            sortInicial: { col: 'fecha', dir: 'desc' },
            columnas: [
              { etiqueta: 'ID',     clave: 'id',     render: (o) => crearEl('span', { class: 'cell-id' }, [o.id]) },
              { etiqueta: 'Fecha',  clave: 'fecha' },
              { etiqueta: 'Cliente', clave: 'cliente' },
              { etiqueta: 'Productos', clave: 'productos', render: (o) => crearEl('div', { class: 'cell-num' }, [String(o.productos)]) },
              { etiqueta: 'País',   clave: 'pais' },
              { etiqueta: 'Método', clave: 'metodo' },
              { etiqueta: 'Estado', clave: 'estado', render: (o) => cellTag(o.estadoLabel, o.estadoTag) },
              { etiqueta: 'Monto',  clave: 'monto',  render: (o) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(o.monto)]) },
            ],
            filas: ordenes,
          }),
          codigo: `<table class="table table--dense">
  ...
</table>

/* CSS */
.table--dense th, .table--dense td {
  padding: 6px var(--space-3);
  font-size: 12.5px;
}`,
        })],
      }),

    ],
  });
};
