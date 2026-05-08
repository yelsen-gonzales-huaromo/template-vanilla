import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';
import { TablaPro } from './_tabla-pro.js';
import {
  cellPersona, cellTag, cellEstado, cellMoney, cellDelta, cellAvatarGrupo, cellBarra, cellRating,
  generarEmpleados, generarOrdenes, generarProductos, generarTasks,
} from './_compartido.js';

// Acciones bulk reutilizables — los 4 iconos del screenshot TanStack
const accionesBulkBase = (extra = []) => [
  { id: 'compartir', icono: 'flecha_u',  label: 'Compartir',     onClick: () => {} },
  { id: 'reordenar', icono: 'ordenar',   label: 'Reordenar',     onClick: () => {} },
  { id: 'export',    icono: 'descargar', label: 'Exportar CSV',  onClick: () => {} },
  ...extra,
  { id: 'borrar',    icono: 'papelera',  label: 'Eliminar',      peligrosa: true, onClick: () => {} },
];

// Acciones de fila reutilizables (kebab menu)
const accionesFilaBase = [
  { id: 'editar',   label: 'Editar',          icono: 'editar',   atajo: '⌘E', onClick: () => {} },
  { id: 'copiar',   label: 'Hacer una copia', icono: 'copia',    atajo: '⌘D', onClick: () => {} },
  { id: 'favorito', label: 'Favorito',        icono: 'estrella', onClick: () => {} },
  { id: 'borrar',   label: 'Eliminar',        icono: 'papelera', atajo: '⌫',  peligrosa: true, onClick: () => {} },
];

export default async () => {
  const empleados = generarEmpleados(48);
  const ordenes = generarOrdenes(75);
  const productos = generarProductos(40);
  const tasks = generarTasks(120);

  // ===== Datos sintéticos extra para nuevos casos =====

  // Facturas
  const facturas = Array.from({ length: 60 }, (_, i) => {
    const estados = [
      { id: 'pagada',     label: 'Pagada',     tag: 'ok'   },
      { id: 'pendiente',  label: 'Pendiente',  tag: 'warn' },
      { id: 'vencida',    label: 'Vencida',    tag: 'err'  },
      { id: 'borrador',   label: 'Borrador',   tag: 'default' },
      { id: 'procesando', label: 'Procesando', tag: 'info' },
    ];
    const planes = ['Free', 'Pro', 'Team', 'Enterprise'];
    const empresas = ['Acme Inc.', 'Globex Corp.', 'Northwind Ltd.', 'Stark Industries', 'Wayne Enterprises', 'Initech', 'Pied Piper', 'Hooli', 'Aperture Labs', 'Cyberdyne'];
    const e = estados[Math.floor(Math.random() * estados.length)];
    return {
      id: `INV-2025-${String(1000 + i).padStart(4, '0')}`,
      cliente: empresas[i % empresas.length],
      plan: planes[Math.floor(Math.random() * planes.length)],
      monto: Math.floor(500 + Math.random() * 24500),
      fecha: `2025-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
      vence: `2025-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
      estado: e.id, estadoLabel: e.label, estadoTag: e.tag,
      metodo: ['Visa •••• 4242', 'Mastercard •••• 8856', 'PayPal', 'Transferencia'][Math.floor(Math.random() * 4)],
    };
  });

  // Tickets de soporte
  const tickets = Array.from({ length: 80 }, (_, i) => {
    const prios = [
      { id: 'urgente', label: 'Urgente', tag: 'err'  },
      { id: 'alta',    label: 'Alta',    tag: 'warn' },
      { id: 'media',   label: 'Media',   tag: 'info' },
      { id: 'baja',    label: 'Baja',    tag: 'default' },
    ];
    const ests = [
      { id: 'abierto',     label: 'Abierto',     tag: 'info' },
      { id: 'pendiente',   label: 'Pendiente',   tag: 'warn' },
      { id: 'resuelto',    label: 'Resuelto',    tag: 'ok'   },
      { id: 'cerrado',     label: 'Cerrado',     tag: 'default' },
      { id: 'reabierto',   label: 'Reabierto',   tag: 'err'  },
    ];
    const cats = ['Bug técnico', 'Pregunta', 'Solicitud feature', 'Facturación', 'Acceso/Login', 'Performance', 'Integración API'];
    const nombres = ['Carlos M.', 'María G.', 'Diego R.', 'Ana T.', 'Pablo S.', 'Lucía P.', 'Jorge H.', 'Rosa C.', 'Luis V.', 'Patricia L.'];
    const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#84cc16'];
    const p = prios[Math.floor(Math.random() * prios.length)];
    const e = ests[Math.floor(Math.random() * ests.length)];
    const titulos = [
      'No puedo acceder a mi cuenta', 'Error 500 al guardar', 'Cómo exporto en CSV',
      'Solicitud: Modo oscuro nativo', 'Cobro duplicado en mi factura', 'API responde lento',
      'Webhook no se dispara', 'Usuario no recibe email', 'Bug en el editor visual',
      'Necesito SSO con Google', 'Permisos no funcionan correctamente', 'Falta filtro por fecha',
    ];
    return {
      id: `TKT-${5000 + i}`,
      titulo: titulos[Math.floor(Math.random() * titulos.length)],
      cliente: nombres[Math.floor(Math.random() * nombres.length)],
      color: colores[Math.floor(Math.random() * colores.length)],
      categoria: cats[Math.floor(Math.random() * cats.length)],
      prioridad: p.id, prioridadLabel: p.label, prioridadTag: p.tag,
      estado: e.id, estadoLabel: e.label, estadoTag: e.tag,
      tiempo: `${Math.floor(1 + Math.random() * 48)}h ${Math.floor(Math.random() * 60)}m`,
      asignado: nombres[Math.floor(Math.random() * nombres.length)],
    };
  });

  // Leads CRM
  const leads = Array.from({ length: 50 }, (_, i) => {
    const fuentes = ['Web orgánico', 'Google Ads', 'LinkedIn', 'Referido', 'Cold email', 'Webinar', 'Evento'];
    const etapas = [
      { id: 'nuevo',         label: 'Nuevo',          tag: 'default' },
      { id: 'contactado',    label: 'Contactado',     tag: 'info'    },
      { id: 'calificado',    label: 'Calificado',     tag: 'purple'  },
      { id: 'propuesta',     label: 'Propuesta',      tag: 'warn'    },
      { id: 'negociacion',   label: 'Negociación',    tag: 'warn'    },
      { id: 'ganado',        label: 'Ganado',         tag: 'ok'      },
      { id: 'perdido',       label: 'Perdido',        tag: 'err'     },
    ];
    const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const empresas = ['Acme Inc.', 'TechCo', 'Innovate Labs', 'GreenSoft', 'BlueWave', 'CodeFactory', 'DataPoint', 'SkyHigh', 'NextGen Sys.', 'Pulse Corp.'];
    const nombres = ['Carlos Méndez', 'María García', 'Diego Ramos', 'Ana Torres', 'Pablo Soto', 'Lucía Paredes', 'Jorge Huamán', 'Rosa Cárdenas', 'Luis Vega', 'Patricia León'];
    const e = etapas[Math.floor(Math.random() * etapas.length)];
    return {
      id: `LEAD-${2000 + i}`,
      nombre: nombres[i % nombres.length],
      empresa: empresas[Math.floor(Math.random() * empresas.length)],
      cargo: ['CTO', 'CEO', 'VP Eng', 'Head of Product', 'Tech Lead', 'Founder'][Math.floor(Math.random() * 6)],
      color: colores[Math.floor(Math.random() * colores.length)],
      email: nombres[i % nombres.length].toLowerCase().replace(/\s+/g, '.').replace(/[^a-z.]/g, '') + '@' + empresas[Math.floor(Math.random() * empresas.length)].toLowerCase().replace(/[^a-z]/g, '') + '.com',
      fuente: fuentes[Math.floor(Math.random() * fuentes.length)],
      etapa: e.id, etapaLabel: e.label, etapaTag: e.tag,
      score: Math.floor(20 + Math.random() * 80),
      valor: Math.floor(2 + Math.random() * 80) * 1000,
      ultimoContacto: `hace ${Math.floor(1 + Math.random() * 30)} día${Math.random() > 0.5 ? 's' : ''}`,
    };
  });

  // Suscripciones
  const subs = Array.from({ length: 40 }, (_, i) => {
    const planes = ['Free', 'Starter', 'Pro', 'Team', 'Business', 'Enterprise'];
    const estados = [
      { id: 'activa',     label: 'Activa',     tag: 'ok'   },
      { id: 'trial',      label: 'En trial',   tag: 'info' },
      { id: 'cancelada',  label: 'Cancelada',  tag: 'err'  },
      { id: 'pausa',      label: 'En pausa',   tag: 'warn' },
      { id: 'morosa',     label: 'Morosa',     tag: 'err'  },
    ];
    const colores = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
    const empresas = ['Acme Inc.', 'TechCo', 'Innovate', 'GreenSoft', 'BlueWave', 'CodeFactory', 'DataPoint', 'SkyHigh', 'NextGen', 'Pulse Corp.'];
    const e = estados[Math.floor(Math.random() * estados.length)];
    const plan = planes[Math.floor(Math.random() * planes.length)];
    const precios = { Free: 0, Starter: 19, Pro: 49, Team: 99, Business: 199, Enterprise: 499 };
    return {
      id: `SUB-${3000 + i}`,
      cliente: empresas[i % empresas.length],
      color: colores[Math.floor(Math.random() * colores.length)],
      plan,
      mrr: precios[plan],
      ciclo: ['Mensual', 'Anual'][Math.floor(Math.random() * 2)],
      proximaFactura: `2025-${String(Math.floor(1 + Math.random() * 12)).padStart(2, '0')}-${String(Math.floor(1 + Math.random() * 28)).padStart(2, '0')}`,
      asientos: Math.floor(1 + Math.random() * 50),
      estado: e.id, estadoLabel: e.label, estadoTag: e.tag,
    };
  });

  const countTaskEstado = (e) => tasks.filter((t) => t.estado === e).length;
  const countTaskPrio   = (p) => tasks.filter((t) => t.prioridad === p).length;
  const countTicketEst  = (e) => tickets.filter((t) => t.estado === e).length;
  const countTicketPrio = (p) => tickets.filter((t) => t.prioridad === p).length;
  const countLeadEtapa  = (e) => leads.filter((l) => l.etapa === e).length;
  const countSubEstado  = (e) => subs.filter((s) => s.estado === e).length;
  const countFactEstado = (e) => facturas.filter((f) => f.estado === e).length;
  const countOrdEstado  = (e) => ordenes.filter((o) => o.estado === e).length;

  return PaginaShowcase({
    titulo: 'Bulk select',
    descripcion: '7 tablas profesionales con selección múltiple para casos reales: gestión de tareas, RRHH, e-commerce, billing, soporte, CRM y suscripciones. Todas usan el mismo `TablaPro` con bulk-bar pill **fixed al fondo del viewport**, kebab menu por fila con atajos, filtros con dropdown + buscador, column toggle, y page-size selector. Drop-in para producción.',
    decoracion: corner4(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Tablas', href: '#/modulos/tablas' },
    ],
    hijos: [

      // ============== 1. TASKS / GESTIÓN DE TAREAS (estilo TanStack) ==============
      Seccion({
        titulo: '1 · Gestión de tareas — estilo TanStack',
        descripcion: '120 tareas. Filtros con dropdown buscador (Estado · Prioridad · Tipo) — counts a la derecha de cada opción. Sort en cualquier columna. Kebab por fila con atajos (⌘E, ⌘D, ⌫). Pill flotante fixed al fondo del viewport con 4 acciones (Compartir · Reordenar · Exportar · Eliminar).',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: tasks,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 15, 20, 50, 100],
            searchPlaceholder: 'Filtrar por título o ID…',
            filtros: [
              { id: 'estado', label: 'Estado', opciones: [
                { value: 'cancelado',  label: 'Cancelado',   icono: 'cerrar', count: countTaskEstado('cancelado') },
                { value: 'completado', label: 'Completado',  icono: 'check',  count: countTaskEstado('completado') },
                { value: 'pendiente',  label: 'Pendiente',   icono: 'reloj',  count: countTaskEstado('pendiente') },
                { value: 'progreso',   label: 'En progreso', icono: 'reloj',  count: countTaskEstado('progreso') },
              ]},
              { id: 'prioridad', label: 'Prioridad', opciones: [
                { value: 'baja',  label: 'Baja',  icono: 'flecha_d', count: countTaskPrio('baja') },
                { value: 'media', label: 'Media', icono: 'flecha_r', count: countTaskPrio('media') },
                { value: 'alta',  label: 'Alta',  icono: 'flecha_u', count: countTaskPrio('alta') },
              ]},
            ],
            columnas: [
              { id: 'id',        etiqueta: 'Tarea',     render: (t) => crearEl('span', { class: 'cell-id' }, [t.id]) },
              { id: 'titulo',    etiqueta: 'Título',    render: (t) => crearEl('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', minWidth: 0 } }, [
                cellTag(t.tipoLabel, t.tipo === 'error' ? 'err' : t.tipo === 'caracteristica' ? 'info' : 'default'),
                crearEl('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '420px' } }, [t.titulo]),
              ]) },
              { id: 'estado',    etiqueta: 'Estado',    render: (t) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted-foreground)' } }, [Icono(t.estadoIcon, { tamano: 14 }), t.estadoLabel]) },
              { id: 'prioridad', etiqueta: 'Prioridad', render: (t) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [Icono(t.prioridadIcon, { tamano: 14 }), t.prioridadLabel]) },
            ],
            accionesBulk: [
              { id: 'estado',    icono: 'flecha_u',  label: 'Actualizar estado',           onClick: () => {} },
              { id: 'prioridad', icono: 'ordenar',   label: 'Actualizar prioridad',        onClick: () => {} },
              { id: 'export',    icono: 'descargar', label: 'Exportar tareas',             onClick: () => {} },
              { id: 'borrar',    icono: 'papelera',  label: 'Eliminar tareas seleccionadas', peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'editar',    label: 'Editar',           icono: 'editar',   atajo: '⌘E', onClick: () => {} },
              { id: 'copiar',    label: 'Hacer una copia',  icono: 'copia',    atajo: '⌘D', onClick: () => {} },
              { id: 'favorito',  label: 'Favorito',         icono: 'estrella', onClick: () => {} },
              { id: 'etiquetas', label: 'Etiquetas',        icono: 'flecha_r', onClick: () => {} },
              { id: 'borrar',    label: 'Eliminar',         icono: 'papelera', atajo: '⌫',  peligrosa: true, onClick: () => {} },
            ],
          }),
          codigo: `TablaPro({
  filas: tasks,
  pageSize: 10,
  pageSizes: [10, 15, 20, 50, 100],
  searchPlaceholder: 'Filtrar por título o ID…',
  filtros: [
    { id: 'estado',    label: 'Estado',    opciones: [...] },
    { id: 'prioridad', label: 'Prioridad', opciones: [...] },
  ],
  columnas: [...],
  accionesBulk: [/* 4 acciones icon-only */],
  accionesFila: [/* kebab con atajos */],
})`,
        })],
      }),

      // ============== 2. EQUIPO / RRHH ==============
      Seccion({
        titulo: '2 · Equipo / RRHH — directorio de empleados',
        descripcion: '48 empleados con avatar + email. Bulk: cambiar departamento, asignar proyecto, exportar nómina, eliminar. Kebab: ver perfil, editar, asignar, enviar mensaje. Columna "País" empieza oculta para mostrar el column toggle.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: empleados,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
            searchPlaceholder: 'Buscar empleados…',
            filtros: [
              { id: 'estado', label: 'Estado', opciones: [
                { value: 'activo',    label: 'Activo',    count: empleados.filter((e) => e.estado === 'activo').length },
                { value: 'inactivo',  label: 'Inactivo',  count: empleados.filter((e) => e.estado === 'inactivo').length },
                { value: 'baja',      label: 'Baja',      count: empleados.filter((e) => e.estado === 'baja').length },
              ]},
              { id: 'departamento', label: 'Departamento', opciones: [
                { value: 'Engineering',       label: 'Engineering',       count: empleados.filter((e) => e.departamento === 'Engineering').length },
                { value: 'Product',           label: 'Product',           count: empleados.filter((e) => e.departamento === 'Product').length },
                { value: 'Design',            label: 'Design',            count: empleados.filter((e) => e.departamento === 'Design').length },
                { value: 'Marketing',         label: 'Marketing',         count: empleados.filter((e) => e.departamento === 'Marketing').length },
                { value: 'Sales',             label: 'Sales',             count: empleados.filter((e) => e.departamento === 'Sales').length },
                { value: 'Customer Success',  label: 'Customer Success',  count: empleados.filter((e) => e.departamento === 'Customer Success').length },
              ]},
              { id: 'nivel', label: 'Nivel', opciones: [
                { value: 'Junior',    label: 'Junior',    count: empleados.filter((e) => e.nivel === 'Junior').length },
                { value: 'Mid',       label: 'Mid',       count: empleados.filter((e) => e.nivel === 'Mid').length },
                { value: 'Senior',    label: 'Senior',    count: empleados.filter((e) => e.nivel === 'Senior').length },
                { value: 'Staff',     label: 'Staff',     count: empleados.filter((e) => e.nivel === 'Staff').length },
                { value: 'Principal', label: 'Principal', count: empleados.filter((e) => e.nivel === 'Principal').length },
              ]},
            ],
            columnas: [
              { id: 'nombre',       etiqueta: 'Empleado',     render: (e) => cellPersona({ nombre: e.nombre, email: e.email, color: e.color }) },
              { id: 'rol',          etiqueta: 'Rol' },
              { id: 'departamento', etiqueta: 'Departamento' },
              { id: 'pais',         etiqueta: 'País', oculta: true },
              { id: 'nivel',        etiqueta: 'Nivel',         render: (e) => cellTag(e.nivel, e.nivel === 'Principal' ? 'purple' : e.nivel === 'Staff' ? 'info' : e.nivel === 'Senior' ? 'ok' : 'default') },
              { id: 'salario',      etiqueta: 'Salario',       render: (e) => crearEl('div', { class: 'cell-num' }, [cellMoney(e.salario)]) },
              { id: 'estado',       etiqueta: 'Estado',        render: (e) => cellTag(e.estado === 'activo' ? 'Activo' : e.estado === 'inactivo' ? 'Inactivo' : 'Baja', e.estado === 'activo' ? 'ok' : e.estado === 'inactivo' ? 'warn' : 'err') },
            ],
            accionesBulk: accionesBulkBase(),
            accionesFila: [
              { id: 'ver',     label: 'Ver perfil',        icono: 'ojo',     atajo: '⌘K', onClick: () => {} },
              { id: 'editar',  label: 'Editar',            icono: 'editar',  atajo: '⌘E', onClick: () => {} },
              { id: 'asignar', label: 'Asignar proyecto',  icono: 'mas',                  onClick: () => {} },
              { id: 'mensaje', label: 'Enviar mensaje',    icono: 'correo',               onClick: () => {} },
              { id: 'borrar',  label: 'Eliminar',          icono: 'papelera', atajo: '⌫', peligrosa: true, onClick: () => {} },
            ],
          }),
        })],
      }),

      // ============== 3. PEDIDOS / E-COMMERCE ==============
      Seccion({
        titulo: '3 · Pedidos — admin e-commerce',
        descripcion: '75 pedidos con cliente, monto, estado y método de pago. Bulk para marcar enviadas, imprimir etiquetas, generar facturas, cancelar.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: ordenes,
            claveID: 'id',
            pageSize: 12,
            pageSizes: [10, 12, 25, 50, 100],
            searchPlaceholder: 'Buscar pedidos por ID, cliente o producto…',
            filtros: [
              { id: 'estado', label: 'Estado del pedido', opciones: [
                { value: 'completada', label: 'Completados', icono: 'check',  count: countOrdEstado('completada') },
                { value: 'pendiente',  label: 'Pendientes',  icono: 'reloj',  count: countOrdEstado('pendiente')  },
                { value: 'enviada',    label: 'Enviados',    icono: 'flecha_u', count: countOrdEstado('enviada')  },
                { value: 'cancelada',  label: 'Cancelados',  icono: 'cerrar', count: countOrdEstado('cancelada')  },
                { value: 'reembolso',  label: 'Reembolsos',  icono: 'flecha_d', count: countOrdEstado('reembolso') },
              ]},
            ],
            columnas: [
              { id: 'id',       etiqueta: 'ID',       render: (o) => crearEl('span', { class: 'cell-id' }, [o.id]) },
              { id: 'cliente',  etiqueta: 'Cliente',  render: (o) => cellPersona({ nombre: o.cliente, email: o.empresa }) },
              { id: 'productos', etiqueta: 'Productos', render: (o) => crearEl('div', { class: 'cell-num' }, [`${o.productos} ítems`]) },
              { id: 'pais',     etiqueta: 'País' },
              { id: 'fecha',    etiqueta: 'Fecha' },
              { id: 'metodo',   etiqueta: 'Método de pago' },
              { id: 'estado',   etiqueta: 'Estado',   render: (o) => cellTag(o.estadoLabel, o.estadoTag) },
              { id: 'monto',    etiqueta: 'Monto',    render: (o) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(o.monto)]) },
            ],
            accionesBulk: [
              { id: 'enviar',    icono: 'check',     label: 'Marcar enviadas', onClick: () => {} },
              { id: 'etiqueta',  icono: 'descargar', label: 'Imprimir etiquetas', onClick: () => {} },
              { id: 'export',    icono: 'descargar', label: 'Exportar CSV',    onClick: () => {} },
              { id: 'borrar',    icono: 'papelera',  label: 'Cancelar pedidos', peligrosa: true, onClick: () => {} },
            ],
            accionesFila: accionesFilaBase,
          }),
        })],
      }),

      // ============== 4. INVENTARIO / SHOPIFY ==============
      Seccion({
        titulo: '4 · Inventario — gestión de productos',
        descripcion: '40 productos con stock, precio, categoría y rating. Bulk para actualizar precios, mover de categoría, archivar. Filtros por categoría y estado de stock.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: productos,
            claveID: 'sku',
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
            searchPlaceholder: 'Buscar por SKU o nombre…',
            filtros: [
              { id: 'categoria', label: 'Categoría', opciones: [
                ...new Set(productos.map((p) => p.categoria)),
              ].map((c) => ({ value: c, label: c, count: productos.filter((p) => p.categoria === c).length })) },
              { id: 'stockEstado', label: 'Stock', opciones: [
                { value: 'agotado', label: 'Agotado', icono: 'cerrar', count: productos.filter((p) => p.stockEstado === 'agotado').length },
                { value: 'bajo',    label: 'Stock bajo', icono: 'flecha_d', count: productos.filter((p) => p.stockEstado === 'bajo').length },
                { value: 'medio',   label: 'Normal', icono: 'check', count: productos.filter((p) => p.stockEstado === 'medio').length },
                { value: 'alto',    label: 'Alto', icono: 'flecha_u', count: productos.filter((p) => p.stockEstado === 'alto').length },
              ]},
            ],
            columnas: [
              { id: 'sku',       etiqueta: 'SKU',       render: (p) => crearEl('span', { class: 'cell-id' }, [p.sku]) },
              { id: 'nombre',    etiqueta: 'Producto' },
              { id: 'categoria', etiqueta: 'Categoría', render: (p) => cellTag(p.categoria, 'info') },
              { id: 'precio',    etiqueta: 'Precio',    render: (p) => crearEl('div', { class: 'cell-num' }, [cellMoney(p.precio)]) },
              { id: 'stock',     etiqueta: 'Stock',     render: (p) => cellTag(`${p.stock} u.`, p.stockEstado === 'agotado' ? 'err' : p.stockEstado === 'bajo' ? 'warn' : 'ok') },
              { id: 'vendidos',  etiqueta: 'Vendidos',  render: (p) => crearEl('div', { class: 'cell-num' }, [p.vendidos.toLocaleString()]) },
              { id: 'rating',    etiqueta: 'Rating',    render: (p) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [cellRating(Math.round(p.rating)), crearEl('span', { style: { fontSize: '11px', color: 'var(--muted-foreground)' } }, [p.rating.toFixed(1)])]) },
            ],
            accionesBulk: [
              { id: 'precio',    icono: 'editar',    label: 'Actualizar precios', onClick: () => {} },
              { id: 'categoria', icono: 'panel',     label: 'Cambiar categoría',  onClick: () => {} },
              { id: 'duplicar',  icono: 'copia',     label: 'Duplicar',           onClick: () => {} },
              { id: 'export',    icono: 'descargar', label: 'Exportar CSV',       onClick: () => {} },
              { id: 'borrar',    icono: 'papelera',  label: 'Eliminar',           peligrosa: true, onClick: () => {} },
            ],
            accionesFila: accionesFilaBase,
          }),
        })],
      }),

      // ============== 5. FACTURAS / BILLING ==============
      Seccion({
        titulo: '5 · Facturas — billing & contabilidad',
        descripcion: '60 facturas con estado, plan, monto y fecha de vencimiento. Filtros por estado de pago. Bulk para descargar PDFs, marcar pagadas, enviar recordatorios.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: facturas,
            claveID: 'id',
            pageSize: 15,
            pageSizes: [10, 15, 25, 50, 100],
            searchPlaceholder: 'Buscar por número de factura o cliente…',
            filtros: [
              { id: 'estado', label: 'Estado', opciones: [
                { value: 'pagada',     label: 'Pagada',     icono: 'check',  count: countFactEstado('pagada')     },
                { value: 'pendiente',  label: 'Pendiente',  icono: 'reloj',  count: countFactEstado('pendiente')  },
                { value: 'vencida',    label: 'Vencida',    icono: 'alerta', count: countFactEstado('vencida')    },
                { value: 'borrador',   label: 'Borrador',   icono: 'editar', count: countFactEstado('borrador')   },
                { value: 'procesando', label: 'Procesando', icono: 'reloj',  count: countFactEstado('procesando') },
              ]},
              { id: 'plan', label: 'Plan', opciones: [
                { value: 'Free',       label: 'Free',       count: facturas.filter((f) => f.plan === 'Free').length },
                { value: 'Pro',        label: 'Pro',        count: facturas.filter((f) => f.plan === 'Pro').length },
                { value: 'Team',       label: 'Team',       count: facturas.filter((f) => f.plan === 'Team').length },
                { value: 'Enterprise', label: 'Enterprise', count: facturas.filter((f) => f.plan === 'Enterprise').length },
              ]},
            ],
            columnas: [
              { id: 'id',      etiqueta: 'Factura',  render: (f) => crearEl('span', { class: 'cell-id' }, [f.id]) },
              { id: 'cliente', etiqueta: 'Cliente' },
              { id: 'plan',    etiqueta: 'Plan',     render: (f) => cellTag(f.plan, f.plan === 'Enterprise' ? 'purple' : f.plan === 'Team' ? 'info' : f.plan === 'Pro' ? 'ok' : 'default') },
              { id: 'fecha',   etiqueta: 'Fecha emisión' },
              { id: 'vence',   etiqueta: 'Vencimiento' },
              { id: 'metodo',  etiqueta: 'Método' },
              { id: 'estado',  etiqueta: 'Estado',   render: (f) => cellTag(f.estadoLabel, f.estadoTag) },
              { id: 'monto',   etiqueta: 'Monto',    render: (f) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(f.monto)]) },
            ],
            accionesBulk: [
              { id: 'pdf',       icono: 'descargar', label: 'Descargar PDFs',     onClick: () => {} },
              { id: 'pagada',    icono: 'check',     label: 'Marcar como pagadas', onClick: () => {} },
              { id: 'recordar',  icono: 'correo',    label: 'Enviar recordatorio', onClick: () => {} },
              { id: 'export',   icono: 'descargar',  label: 'Exportar CSV',        onClick: () => {} },
              { id: 'anular',    icono: 'papelera',  label: 'Anular',              peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'ver',       label: 'Ver detalle',       icono: 'ojo',       atajo: '⌘K', onClick: () => {} },
              { id: 'pdf',       label: 'Descargar PDF',     icono: 'descargar', onClick: () => {} },
              { id: 'duplicar',  label: 'Duplicar factura',  icono: 'copia',     onClick: () => {} },
              { id: 'recordar',  label: 'Enviar recordatorio', icono: 'correo', onClick: () => {} },
              { id: 'anular',    label: 'Anular',            icono: 'papelera',  atajo: '⌫', peligrosa: true, onClick: () => {} },
            ],
          }),
        })],
      }),

      // ============== 6. TICKETS DE SOPORTE ==============
      Seccion({
        titulo: '6 · Tickets de soporte — helpdesk',
        descripcion: '80 tickets con prioridad, categoría, asignado y SLA. Filtros por estado y prioridad. Bulk para asignar agente, cerrar masivamente, escalar a urgente.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: tickets,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
            searchPlaceholder: 'Buscar tickets…',
            filtros: [
              { id: 'estado', label: 'Estado', opciones: [
                { value: 'abierto',   label: 'Abierto',    icono: 'mas',     count: countTicketEst('abierto')   },
                { value: 'pendiente', label: 'Pendiente',  icono: 'reloj',   count: countTicketEst('pendiente') },
                { value: 'resuelto',  label: 'Resuelto',   icono: 'check',   count: countTicketEst('resuelto')  },
                { value: 'cerrado',   label: 'Cerrado',    icono: 'cerrar',  count: countTicketEst('cerrado')   },
                { value: 'reabierto', label: 'Reabierto',  icono: 'alerta',  count: countTicketEst('reabierto') },
              ]},
              { id: 'prioridad', label: 'Prioridad', opciones: [
                { value: 'urgente', label: 'Urgente', icono: 'alerta',   count: countTicketPrio('urgente') },
                { value: 'alta',    label: 'Alta',    icono: 'flecha_u', count: countTicketPrio('alta')    },
                { value: 'media',   label: 'Media',   icono: 'flecha_r', count: countTicketPrio('media')   },
                { value: 'baja',    label: 'Baja',    icono: 'flecha_d', count: countTicketPrio('baja')    },
              ]},
              { id: 'categoria', label: 'Categoría', opciones: [
                ...new Set(tickets.map((t) => t.categoria)),
              ].map((c) => ({ value: c, label: c, count: tickets.filter((t) => t.categoria === c).length })) },
            ],
            columnas: [
              { id: 'id',         etiqueta: 'Ticket',    render: (t) => crearEl('span', { class: 'cell-id' }, [t.id]) },
              { id: 'titulo',     etiqueta: 'Asunto',    render: (t) => crearEl('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, [
                cellTag(t.categoria, 'info'),
                crearEl('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' } }, [t.titulo]),
              ]) },
              { id: 'cliente',    etiqueta: 'Cliente',   render: (t) => cellPersona({ nombre: t.cliente, color: t.color }) },
              { id: 'prioridad',  etiqueta: 'Prioridad', render: (t) => cellTag(t.prioridadLabel, t.prioridadTag) },
              { id: 'estado',     etiqueta: 'Estado',    render: (t) => cellTag(t.estadoLabel, t.estadoTag) },
              { id: 'asignado',   etiqueta: 'Asignado a' },
              { id: 'tiempo',     etiqueta: 'SLA',       render: (t) => crearEl('div', { class: 'cell-num', style: { fontSize: '12px', color: 'var(--muted-foreground)' } }, [t.tiempo]) },
            ],
            accionesBulk: [
              { id: 'asignar',  icono: 'mas',       label: 'Asignar agente',   onClick: () => {} },
              { id: 'cerrar',   icono: 'check',     label: 'Cerrar tickets',   onClick: () => {} },
              { id: 'escalar',  icono: 'flecha_u',  label: 'Escalar a urgente', onClick: () => {} },
              { id: 'export',   icono: 'descargar', label: 'Exportar CSV',     onClick: () => {} },
              { id: 'borrar',   icono: 'papelera',  label: 'Eliminar',         peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'ver',     label: 'Ver conversación', icono: 'ojo',     atajo: '⌘K', onClick: () => {} },
              { id: 'asignar', label: 'Reasignar',         icono: 'mas',                  onClick: () => {} },
              { id: 'cerrar',  label: 'Marcar resuelto',  icono: 'check',                onClick: () => {} },
              { id: 'borrar',  label: 'Eliminar',         icono: 'papelera', atajo: '⌫', peligrosa: true, onClick: () => {} },
            ],
          }),
        })],
      }),

      // ============== 7. LEADS / CRM ==============
      Seccion({
        titulo: '7 · Leads — pipeline de ventas (CRM)',
        descripcion: '50 leads con etapa de pipeline, score, fuente y valor estimado. Bulk para mover de etapa, asignar SDR, exportar.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: leads,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
            searchPlaceholder: 'Buscar leads por nombre, empresa o email…',
            filtros: [
              { id: 'etapa', label: 'Etapa del pipeline', opciones: [
                { value: 'nuevo',       label: 'Nuevo',         count: countLeadEtapa('nuevo')       },
                { value: 'contactado',  label: 'Contactado',    count: countLeadEtapa('contactado')  },
                { value: 'calificado',  label: 'Calificado',    count: countLeadEtapa('calificado')  },
                { value: 'propuesta',   label: 'Propuesta',     count: countLeadEtapa('propuesta')   },
                { value: 'negociacion', label: 'Negociación',   count: countLeadEtapa('negociacion') },
                { value: 'ganado',      label: 'Ganado',        icono: 'check',  count: countLeadEtapa('ganado') },
                { value: 'perdido',     label: 'Perdido',       icono: 'cerrar', count: countLeadEtapa('perdido') },
              ]},
              { id: 'fuente', label: 'Fuente', opciones: [
                ...new Set(leads.map((l) => l.fuente)),
              ].map((f) => ({ value: f, label: f, count: leads.filter((l) => l.fuente === f).length })) },
            ],
            columnas: [
              { id: 'nombre',  etiqueta: 'Lead',    render: (l) => cellPersona({ nombre: l.nombre, email: l.email, color: l.color }) },
              { id: 'empresa', etiqueta: 'Empresa', render: (l) => crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 600 } }, [l.empresa]),
                crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)' } }, [l.cargo]),
              ]) },
              { id: 'fuente',  etiqueta: 'Fuente',  render: (l) => cellTag(l.fuente, 'default') },
              { id: 'score',   etiqueta: 'Score',   render: (l) => cellBarra(l.score) },
              { id: 'valor',   etiqueta: 'Valor estimado', render: (l) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(l.valor)]) },
              { id: 'etapa',   etiqueta: 'Etapa',   render: (l) => cellTag(l.etapaLabel, l.etapaTag) },
              { id: 'ultimoContacto', etiqueta: 'Último contacto', render: (l) => crearEl('span', { style: { fontSize: '12px', color: 'var(--muted-foreground)' } }, [l.ultimoContacto]) },
            ],
            accionesBulk: [
              { id: 'mover',   icono: 'flecha_u',  label: 'Mover de etapa',  onClick: () => {} },
              { id: 'asignar', icono: 'mas',       label: 'Asignar SDR',     onClick: () => {} },
              { id: 'email',   icono: 'correo',    label: 'Enviar email',    onClick: () => {} },
              { id: 'export',  icono: 'descargar', label: 'Exportar CSV',    onClick: () => {} },
              { id: 'borrar',  icono: 'papelera',  label: 'Eliminar',        peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'ver',     label: 'Ver lead completo',  icono: 'ojo',      atajo: '⌘K', onClick: () => {} },
              { id: 'editar',  label: 'Editar',             icono: 'editar',   atajo: '⌘E', onClick: () => {} },
              { id: 'email',   label: 'Enviar email',       icono: 'correo',                onClick: () => {} },
              { id: 'reunion', label: 'Agendar reunión',    icono: 'calendario',            onClick: () => {} },
              { id: 'borrar',  label: 'Eliminar',           icono: 'papelera', atajo: '⌫', peligrosa: true, onClick: () => {} },
            ],
          }),
        })],
      }),

      // ============== 8. SUSCRIPCIONES ==============
      Seccion({
        titulo: '8 · Suscripciones — recurrentes & MRR',
        descripcion: '40 suscripciones SaaS con plan, MRR, ciclo de facturación, asientos. Bulk para aplicar descuento, cancelar, cambiar plan.',
        hijos: [VistaCodigo({
          vista: TablaPro({
            filas: subs,
            claveID: 'id',
            pageSize: 10,
            pageSizes: [10, 25, 50, 100],
            searchPlaceholder: 'Buscar suscripciones…',
            filtros: [
              { id: 'estado', label: 'Estado', opciones: [
                { value: 'activa',     label: 'Activa',     icono: 'check',  count: countSubEstado('activa')     },
                { value: 'trial',      label: 'En trial',   icono: 'reloj',  count: countSubEstado('trial')      },
                { value: 'pausa',      label: 'En pausa',   icono: 'reloj',  count: countSubEstado('pausa')      },
                { value: 'morosa',     label: 'Morosa',     icono: 'alerta', count: countSubEstado('morosa')     },
                { value: 'cancelada',  label: 'Cancelada',  icono: 'cerrar', count: countSubEstado('cancelada')  },
              ]},
              { id: 'plan', label: 'Plan', opciones: [
                { value: 'Free',       label: 'Free',       count: subs.filter((s) => s.plan === 'Free').length },
                { value: 'Starter',    label: 'Starter',    count: subs.filter((s) => s.plan === 'Starter').length },
                { value: 'Pro',        label: 'Pro',        count: subs.filter((s) => s.plan === 'Pro').length },
                { value: 'Team',       label: 'Team',       count: subs.filter((s) => s.plan === 'Team').length },
                { value: 'Business',   label: 'Business',   count: subs.filter((s) => s.plan === 'Business').length },
                { value: 'Enterprise', label: 'Enterprise', count: subs.filter((s) => s.plan === 'Enterprise').length },
              ]},
              { id: 'ciclo', label: 'Ciclo', opciones: [
                { value: 'Mensual', label: 'Mensual', count: subs.filter((s) => s.ciclo === 'Mensual').length },
                { value: 'Anual',   label: 'Anual',   count: subs.filter((s) => s.ciclo === 'Anual').length },
              ]},
            ],
            columnas: [
              { id: 'id',       etiqueta: 'ID',       render: (s) => crearEl('span', { class: 'cell-id' }, [s.id]) },
              { id: 'cliente',  etiqueta: 'Cliente',  render: (s) => cellPersona({ nombre: s.cliente, color: s.color }) },
              { id: 'plan',     etiqueta: 'Plan',     render: (s) => cellTag(s.plan, s.plan === 'Enterprise' ? 'purple' : s.plan === 'Business' || s.plan === 'Team' ? 'info' : s.plan === 'Pro' ? 'ok' : 'default') },
              { id: 'ciclo',    etiqueta: 'Ciclo' },
              { id: 'asientos', etiqueta: 'Asientos', render: (s) => crearEl('div', { class: 'cell-num' }, [s.asientos]) },
              { id: 'mrr',      etiqueta: 'MRR',      render: (s) => crearEl('div', { class: 'cell-num cell-money' }, [cellMoney(s.mrr)]) },
              { id: 'proximaFactura', etiqueta: 'Próx. factura' },
              { id: 'estado',   etiqueta: 'Estado',   render: (s) => cellTag(s.estadoLabel, s.estadoTag) },
            ],
            accionesBulk: [
              { id: 'descuento', icono: 'editar',    label: 'Aplicar descuento', onClick: () => {} },
              { id: 'plan',      icono: 'flecha_u',  label: 'Cambiar plan',      onClick: () => {} },
              { id: 'pausar',    icono: 'reloj',     label: 'Pausar',            onClick: () => {} },
              { id: 'export',    icono: 'descargar', label: 'Exportar CSV',      onClick: () => {} },
              { id: 'cancelar',  icono: 'papelera',  label: 'Cancelar',          peligrosa: true, onClick: () => {} },
            ],
            accionesFila: [
              { id: 'ver',       label: 'Ver suscripción', icono: 'ojo',     atajo: '⌘K', onClick: () => {} },
              { id: 'editar',    label: 'Editar plan',     icono: 'editar',                onClick: () => {} },
              { id: 'descuento', label: 'Aplicar cupón',   icono: 'estrella',              onClick: () => {} },
              { id: 'cancelar',  label: 'Cancelar',        icono: 'papelera', atajo: '⌫', peligrosa: true, onClick: () => {} },
            ],
          }),
        })],
      }),

    ],
  });
};
