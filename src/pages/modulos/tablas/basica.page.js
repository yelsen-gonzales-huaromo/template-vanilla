import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Tabla } from '../../../components/ui/table/table.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';
import {
  cellPersona, cellTag, cellEstado, cellMoney, cellDelta, cellSparkline, cellAcciones, cellRating, cellAvatarGrupo, cellBarra,
  generarEmpleados, generarOrdenes, generarProductos,
} from './_compartido.js';

export default async () => {
  const empleados = generarEmpleados(8);
  const ordenes = generarOrdenes(10);
  const productos = generarProductos(8);

  return PaginaShowcase({
    titulo: 'Tablas básicas',
    descripcion: 'Las tablas son el caballo de batalla de cualquier dashboard B2B. Aquí van 10 patrones modernos: empleados con avatar + email, órdenes con estado coloreado, inventario con stock visual, KPIs con sparkline, leaderboards con medallas, comparativa de planes, transacciones recientes, billing rows. Cero dependencias — sólo CSS + el componente `Tabla`.',
    decoracion: corner1(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Tablas', href: '#/modulos/tablas' },
    ],
    hijos: [

      // ============== 1. EMPLEADOS / TEAM ROSTER ==============
      Seccion({
        titulo: '1 · Equipo / Team roster',
        descripcion: 'Avatar + nombre + email en una celda; rol en otra; estado con tag coloreado; acciones inline. El layout más usado en Linear, Notion, Slack admin.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'Empleado', clave: 'persona', render: (e) => cellPersona({ nombre: e.nombre, email: e.email, color: e.color }) },
              { etiqueta: 'Rol',      clave: 'rol' },
              { etiqueta: 'Departamento', clave: 'departamento' },
              { etiqueta: 'País',     clave: 'pais' },
              { etiqueta: 'Estado',   clave: 'estado', render: (e) => cellTag(e.estado === 'activo' ? 'Activo' : e.estado === 'inactivo' ? 'Inactivo' : 'Baja', e.estado === 'activo' ? 'ok' : e.estado === 'inactivo' ? 'warn' : 'err') },
              { etiqueta: '', clave: 'acciones', render: () => cellAcciones({ onVer: () => {}, onEditar: () => {}, onBorrar: () => {} }) },
            ],
            filas: empleados,
          }),
          codigo: `Tabla({
  columnas: [
    { etiqueta: 'Empleado', render: e => cellPersona({ nombre: e.nombre, email: e.email }) },
    { etiqueta: 'Rol', clave: 'rol' },
    { etiqueta: 'Estado', render: e => cellTag(e.estado, 'ok') },
    { etiqueta: '',  render: () => cellAcciones({ onVer, onEditar, onBorrar }) },
  ],
  filas: empleados,
})`,
        })],
      }),

      // ============== 2. ÓRDENES / TRANSACCIONES ==============
      Seccion({
        titulo: '2 · Órdenes — estado + monto + método de pago',
        descripcion: 'Patrón Stripe Dashboard / Shopify Admin. ID monoespacio, monto a la derecha alineado tabular-nums, estado con tag, método de pago con dots.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'ID',     clave: 'id', render: (o) => crearEl('span', { class: 'cell-id' }, [o.id]) },
              { etiqueta: 'Cliente', clave: 'cliente', render: (o) => cellPersona({ nombre: o.cliente, email: o.empresa }) },
              { etiqueta: 'Fecha',  clave: 'fecha' },
              { etiqueta: 'Método', clave: 'metodo' },
              { etiqueta: 'Estado', clave: 'estado', render: (o) => cellTag(o.estadoLabel, o.estadoTag) },
              { etiqueta: 'Monto',  clave: 'monto', render: (o) => crearEl('div', { class: 'cell-num' }, [cellMoney(o.monto)]) },
            ],
            filas: ordenes,
          }),
          codigo: `// Cell ID monoespacio + monto tabular-nums alineado a la derecha
{ etiqueta: 'ID', render: o => <span class="cell-id">{o.id}</span> },
{ etiqueta: 'Monto', render: o => <div class="cell-num">{cellMoney(o.monto)}</div> },`,
        })],
      }),

      // ============== 3. INVENTARIO / PRODUCTOS ==============
      Seccion({
        titulo: '3 · Inventario — stock visual + rating',
        descripcion: 'Para almacenes y catálogos. SKU monoespacio, stock con barra de progreso color-coded, rating con estrellas, sparkline de tendencia de ventas.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'SKU',      clave: 'sku', render: (p) => crearEl('span', { class: 'cell-id' }, [p.sku]) },
              { etiqueta: 'Producto', clave: 'nombre' },
              { etiqueta: 'Categoría', clave: 'categoria', render: (p) => cellTag(p.categoria, 'info') },
              { etiqueta: 'Precio',   clave: 'precio', render: (p) => crearEl('div', { class: 'cell-num' }, [cellMoney(p.precio)]) },
              { etiqueta: 'Stock',    clave: 'stock', render: (p) => cellTag(`${p.stock} u.`, p.stockEstado === 'agotado' ? 'err' : p.stockEstado === 'bajo' ? 'warn' : 'ok') },
              { etiqueta: 'Rating',   clave: 'rating', render: (p) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', gap: '6px' } }, [cellRating(Math.round(p.rating)), crearEl('span', { style: { fontSize: '11px', color: 'var(--muted-foreground)' } }, [p.rating.toFixed(1)])]) },
              { etiqueta: 'Tendencia', clave: 'sparkline', render: (p) => cellSparkline(p.sparkline, p.sparkline.at(-1) > p.sparkline[0] ? '#10b981' : '#ef4444') },
            ],
            filas: productos,
          }),
          codigo: `{ etiqueta: 'Stock', render: p => cellTag(\`\${p.stock} u.\`, p.stock < 20 ? 'err' : 'ok') },
{ etiqueta: 'Rating', render: p => cellRating(Math.round(p.rating)) },
{ etiqueta: 'Tendencia', render: p => cellSparkline(p.sparkline) },`,
        })],
      }),

      // ============== 4. KPI ROWS (sparklines + delta) ==============
      Seccion({
        titulo: '4 · KPI rows — sparkline + delta',
        descripcion: 'Métricas con tendencia visual y comparativa vs período anterior. Patrón "Mini dashboard" usado en Mixpanel, PostHog, Amplitude.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'Métrica', clave: 'nombre' },
              { etiqueta: 'Valor actual', clave: 'valor', render: (k) => crearEl('div', { class: 'cell-num', style: { fontSize: '15px', fontWeight: 700 } }, [k.valor]) },
              { etiqueta: 'vs. mes anterior', clave: 'delta', render: (k) => cellDelta(k.delta) },
              { etiqueta: 'Tendencia 12m', clave: 'sp', render: (k) => cellSparkline(k.sparkline, k.delta >= 0 ? '#10b981' : '#ef4444') },
              { etiqueta: 'Categoría', clave: 'cat', render: (k) => cellTag(k.cat, 'info') },
            ],
            filas: [
              { nombre: 'MRR', valor: '$48,234', delta: 12.4, sparkline: [42, 44, 43, 46, 45, 48, 47, 49, 51, 52, 50, 48], cat: 'Revenue' },
              { nombre: 'Usuarios activos diarios', valor: '8,492', delta: 8.1, sparkline: [70, 72, 71, 74, 76, 78, 80, 82, 81, 84, 86, 85], cat: 'Engagement' },
              { nombre: 'Tasa de churn', valor: '2.4%', delta: -0.8, sparkline: [38, 36, 34, 32, 30, 28, 26, 24, 22, 24, 22, 24], cat: 'Retention' },
              { nombre: 'Pedidos/día', valor: '342', delta: -2.3, sparkline: [60, 65, 70, 68, 72, 70, 65, 60, 58, 55, 50, 52], cat: 'Sales' },
              { nombre: 'Net Promoter Score', valor: '72', delta: 5.2, sparkline: [55, 58, 60, 62, 64, 65, 67, 68, 70, 71, 72, 72], cat: 'Satisfaction' },
              { nombre: 'Tiempo de carga (p95)', valor: '142ms', delta: -18.5, sparkline: [200, 195, 188, 178, 170, 165, 160, 155, 150, 148, 145, 142], cat: 'Performance' },
            ],
          }),
          codigo: `filas.map(k => ({
  nombre: 'MRR',
  valor: '$48,234',
  delta: 12.4,                          // → ↑ verde 12.4%
  sparkline: [42, 44, 43, 46, ...],      // → svg inline
}))`,
        })],
      }),

      // ============== 5. LEADERBOARD ==============
      Seccion({
        titulo: '5 · Leaderboard — ranking con medallas',
        descripcion: 'Tabla ranking con medallas para top 3, barra de progreso, score grande y delta de posición. Útil para gamification, sales leaderboard, GitHub contributions.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: '#', clave: 'pos', render: (l) => crearEl('div', { style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', fontSize: '14px' } }, [l.pos === 1 ? '🥇' : l.pos === 2 ? '🥈' : l.pos === 3 ? '🥉' : crearEl('span', { style: { fontWeight: 700, color: 'var(--muted-foreground)' } }, [`#${l.pos}`])]) },
              { etiqueta: 'Vendedor', render: (l) => cellPersona({ nombre: l.nombre, email: l.region, color: l.color }) },
              { etiqueta: 'Cierres', clave: 'cierres', render: (l) => crearEl('div', { class: 'cell-num', style: { fontWeight: 700 } }, [l.cierres]) },
              { etiqueta: 'Ingresos', clave: 'ingresos', render: (l) => crearEl('div', { class: 'cell-num' }, [cellMoney(l.ingresos)]) },
              { etiqueta: 'Cuota %', clave: 'cuota', render: (l) => cellBarra(l.cuota) },
              { etiqueta: 'Δ Pos', render: (l) => l.deltaPos === 0 ? crearEl('span', { style: { color: 'var(--muted-foreground)' } }, ['—']) : cellDelta(l.deltaPos, '') },
            ],
            filas: [
              { pos: 1, nombre: 'María García',   region: 'LATAM',     color: '#3b82f6', cierres: 47, ingresos: 284500, cuota: 142, deltaPos: 1 },
              { pos: 2, nombre: 'Carlos Méndez',  region: 'EMEA',      color: '#8b5cf6', cierres: 42, ingresos: 248200, cuota: 124, deltaPos: -1 },
              { pos: 3, nombre: 'Diego Ramos',    region: 'NA',        color: '#10b981', cierres: 38, ingresos: 215800, cuota: 108, deltaPos: 0 },
              { pos: 4, nombre: 'Ana Torres',     region: 'APAC',      color: '#06b6d4', cierres: 35, ingresos: 198400, cuota: 99,  deltaPos: 2 },
              { pos: 5, nombre: 'Pablo Soto',     region: 'LATAM',     color: '#f59e0b', cierres: 32, ingresos: 178200, cuota: 89,  deltaPos: -2 },
              { pos: 6, nombre: 'Lucía Paredes',  region: 'EMEA',      color: '#ec4899', cierres: 28, ingresos: 156800, cuota: 78,  deltaPos: 0 },
              { pos: 7, nombre: 'Jorge Huamán',   region: 'NA',        color: '#84cc16', cierres: 24, ingresos: 132500, cuota: 66,  deltaPos: 1 },
              { pos: 8, nombre: 'Rosa Cárdenas',  region: 'APAC',      color: '#0ea5e9', cierres: 21, ingresos: 118400, cuota: 59,  deltaPos: -3 },
            ],
          }),
          codigo: `// Top 3 con emoji medalla, resto con #pos
{ etiqueta: '#', render: l =>
  l.pos === 1 ? '🥇' : l.pos === 2 ? '🥈' : l.pos === 3 ? '🥉' : \`#\${l.pos}\` },
{ etiqueta: 'Cuota %', render: l => cellBarra(l.cuota) },`,
        })],
      }),

      // ============== 6. PROYECTOS CON ASIGNADOS ==============
      Seccion({
        titulo: '6 · Proyectos — avatares overlapping + progreso',
        descripcion: 'Patrón Asana / Linear / ClickUp. Líder destacado, equipo como avatares overlapping (con +N si hay más), progreso visual, prioridad como tag.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'Proyecto', clave: 'nombre', render: (p) => crearEl('div', null, [
                crearEl('div', { style: { fontWeight: 600 } }, [p.nombre]),
                crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)' } }, [p.cliente]),
              ]) },
              { etiqueta: 'Líder', clave: 'lider', render: (p) => cellPersona({ nombre: p.lider.nombre, color: p.lider.color }) },
              { etiqueta: 'Equipo', render: (p) => cellAvatarGrupo(p.asignados) },
              { etiqueta: 'Progreso', render: (p) => cellBarra(p.progreso) },
              { etiqueta: 'Tareas', render: (p) => crearEl('span', { style: { fontSize: '12px', color: 'var(--muted-foreground)', fontVariantNumeric: 'tabular-nums' } }, [`${p.tareas.completadas}/${p.tareas.total}`]) },
              { etiqueta: 'Prioridad', render: (p) => cellTag(p.prioridad, p.prioridad === 'critica' ? 'err' : p.prioridad === 'alta' ? 'warn' : p.prioridad === 'media' ? 'info' : 'default') },
              { etiqueta: 'Deadline', clave: 'fechaLimite' },
            ],
            filas: [
              { id: 'P-101', nombre: 'Onboarding v2', cliente: 'Acme Inc.', progreso: 78, prioridad: 'alta', lider: { nombre: 'María García', color: '#3b82f6' }, asignados: [{ nombre: 'Maria G', color: '#3b82f6' }, { nombre: 'Carlos M', color: '#8b5cf6' }, { nombre: 'Ana T', color: '#10b981' }], tareas: { total: 24, completadas: 19 }, fechaLimite: '2025-12-15' },
              { id: 'P-102', nombre: 'Migration to Postgres', cliente: 'Globex Corp.', progreso: 42, prioridad: 'critica', lider: { nombre: 'Carlos Méndez', color: '#8b5cf6' }, asignados: [{ nombre: 'C M', color: '#8b5cf6' }, { nombre: 'D R', color: '#06b6d4' }, { nombre: 'A T', color: '#10b981' }, { nombre: 'P S', color: '#f59e0b' }, { nombre: 'L P', color: '#ec4899' }], tareas: { total: 48, completadas: 20 }, fechaLimite: '2025-11-30' },
              { id: 'P-103', nombre: 'API redesign', cliente: 'Northwind Ltd.', progreso: 95, prioridad: 'media', lider: { nombre: 'Diego Ramos', color: '#10b981' }, asignados: [{ nombre: 'D R', color: '#10b981' }, { nombre: 'A T', color: '#06b6d4' }], tareas: { total: 16, completadas: 15 }, fechaLimite: '2025-12-08' },
              { id: 'P-104', nombre: 'Mobile app launch', cliente: 'Stark Industries', progreso: 22, prioridad: 'alta', lider: { nombre: 'Ana Torres', color: '#06b6d4' }, asignados: [{ nombre: 'A T', color: '#06b6d4' }, { nombre: 'M G', color: '#3b82f6' }, { nombre: 'C M', color: '#8b5cf6' }, { nombre: 'P S', color: '#f59e0b' }, { nombre: 'L P', color: '#ec4899' }, { nombre: 'J H', color: '#84cc16' }], tareas: { total: 64, completadas: 14 }, fechaLimite: '2026-02-28' },
              { id: 'P-105', nombre: 'SOC2 audit', cliente: 'Wayne Enterprises', progreso: 60, prioridad: 'baja', lider: { nombre: 'Pablo Soto', color: '#f59e0b' }, asignados: [{ nombre: 'P S', color: '#f59e0b' }, { nombre: 'M G', color: '#3b82f6' }], tareas: { total: 32, completadas: 19 }, fechaLimite: '2026-01-15' },
            ],
          }),
          codigo: `{ etiqueta: 'Equipo', render: p => cellAvatarGrupo(p.asignados) },
{ etiqueta: 'Progreso', render: p => cellBarra(p.progreso) },
{ etiqueta: 'Prioridad', render: p => cellTag(p.prioridad,
  p.prioridad === 'critica' ? 'err' : 'warn') },`,
        })],
      }),

      // ============== 7. BILLING / FACTURACIÓN ==============
      Seccion({
        titulo: '7 · Billing — facturas con estado',
        descripcion: 'Patrón Stripe Billing / Paddle. Número de factura, monto + impuestos, estado clarísimo, fecha de vencimiento. Incluye fila destacada con accent border-left.',
        hijos: [VistaCodigo({
          vista: crearEl('div', { class: 'table-wrapper' }, [
            crearEl('table', { class: 'table' }, [
              crearEl('thead', null, [
                crearEl('tr', null, [
                  crearEl('th', null, ['Factura']),
                  crearEl('th', null, ['Cliente']),
                  crearEl('th', null, ['Plan']),
                  crearEl('th', null, ['Período']),
                  crearEl('th', null, ['Subtotal']),
                  crearEl('th', null, ['Impuestos']),
                  crearEl('th', null, ['Total']),
                  crearEl('th', null, ['Estado']),
                ]),
              ]),
              crearEl('tbody', null, [
                ['INV-2025-0142', 'Acme Inc.',          'Pro',        'Nov 2025',  4900,  931,  5831, 'Pagado',     'ok',   'row--ok'],
                ['INV-2025-0141', 'Globex Corp.',       'Enterprise', 'Nov 2025',  19900, 3781, 23681, 'Pagado',     'ok',   'row--ok'],
                ['INV-2025-0140', 'Northwind Ltd.',     'Pro',        'Nov 2025',  4900,  931,  5831, 'Pendiente',  'warn', 'row--warn'],
                ['INV-2025-0139', 'Stark Industries',   'Enterprise', 'Nov 2025',  19900, 3781, 23681, 'Vencido',    'err',  'row--err'],
                ['INV-2025-0138', 'Wayne Enterprises',  'Team',       'Nov 2025',  1900,  361,  2261, 'Pagado',     'ok',   'row--ok'],
                ['INV-2025-0137', 'Initech',            'Team',       'Nov 2025',  1900,  361,  2261, 'Procesando', 'info', 'row--info'],
                ['INV-2025-0136', 'Pied Piper',         'Pro',        'Nov 2025',  4900,  931,  5831, 'Pagado',     'ok',   'row--ok'],
              ].map(([id, cli, plan, periodo, sub, imp, total, estado, tag, accent]) => crearEl('tr', { class: accent }, [
                crearEl('td', null, [crearEl('span', { class: 'cell-id' }, [id])]),
                crearEl('td', null, [cli]),
                crearEl('td', null, [cellTag(plan, plan === 'Enterprise' ? 'purple' : plan === 'Pro' ? 'info' : 'default')]),
                crearEl('td', null, [periodo]),
                crearEl('td', { class: 'cell-num' }, [cellMoney(sub)]),
                crearEl('td', { class: 'cell-num' }, [cellMoney(imp)]),
                crearEl('td', { class: 'cell-num cell-money' }, [cellMoney(total)]),
                crearEl('td', null, [cellTag(estado, tag)]),
              ]))),
            ]),
          ]),
          codigo: `// Filas con accent border-left por estado
<tr class="row--ok">    {/* verde · pagado */}
<tr class="row--warn">  {/* amarillo · pendiente */}
<tr class="row--err">   {/* rojo · vencido */}
<tr class="row--info">  {/* azul · procesando */}`,
        })],
      }),

      // ============== 8. COMPARATIVA DE PLANES ==============
      Seccion({
        titulo: '8 · Comparativa de planes — pricing table',
        descripcion: 'La tabla más importante de toda landing SaaS. Plan recomendado destacado con accent purpura, checks/equis verdes/grises, CTA en cada columna.',
        hijos: [VistaCodigo({
          vista: crearEl('div', { class: 'table-wrapper' }, [
            crearEl('table', { class: 'table' }, [
              crearEl('thead', null, [
                crearEl('tr', null, [
                  crearEl('th', { style: { width: '32%' } }, ['Feature']),
                  crearEl('th', { style: { textAlign: 'center' } }, ['Free']),
                  crearEl('th', { style: { textAlign: 'center', color: 'var(--primary)', fontWeight: 700 } }, ['Pro · ', crearEl('span', { style: { background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontWeight: 800 } }, ['popular'])]),
                  crearEl('th', { style: { textAlign: 'center' } }, ['Enterprise']),
                ]),
              ]),
              crearEl('tbody', null, [
                ...[
                  ['Usuarios incluidos',        '1',         '10',          'Ilimitado'],
                  ['Proyectos',                 '3',         '50',          'Ilimitado'],
                  ['Espacio de almacenamiento', '500 MB',    '50 GB',       '500 GB'],
                  ['Soporte',                   'Comunidad', 'Email · 24h', 'Dedicado · SLA'],
                  ['SSO / SAML',                '✗',         '✓',           '✓'],
                  ['Audit logs',                '✗',         '90 días',     'Ilimitado'],
                  ['SOC2 Type II',              '✗',         '✗',           '✓'],
                  ['Custom contract',           '✗',         '✗',           '✓'],
                  ['Precio',                    '$0',        '$49 / mes',   'Custom'],
                ].map(([feat, free, pro, ent]) => crearEl('tr', null, [
                  crearEl('td', null, [crearEl('span', { style: { fontWeight: 600 } }, [feat])]),
                  crearEl('td', { style: { textAlign: 'center', color: free === '✗' ? 'var(--muted-foreground)' : 'var(--foreground)' } }, [free === '✓' ? crearEl('span', { style: { color: '#10b981' } }, ['✓']) : free === '✗' ? '—' : free]),
                  crearEl('td', { style: { textAlign: 'center', background: 'color-mix(in srgb, var(--primary) 4%, transparent)', color: pro === '✗' ? 'var(--muted-foreground)' : 'var(--foreground)', fontWeight: feat === 'Precio' ? 700 : 400 } }, [pro === '✓' ? crearEl('span', { style: { color: '#10b981' } }, ['✓']) : pro === '✗' ? '—' : pro]),
                  crearEl('td', { style: { textAlign: 'center', color: ent === '✗' ? 'var(--muted-foreground)' : 'var(--foreground)' } }, [ent === '✓' ? crearEl('span', { style: { color: '#10b981' } }, ['✓']) : ent === '✗' ? '—' : ent]),
                ])),
                crearEl('tr', null, [
                  crearEl('td'),
                  crearEl('td', { style: { textAlign: 'center', paddingBlock: 'var(--space-3)' } }, [Boton({ texto: 'Empezar', variante: 'ghost', tamano: 'sm' })]),
                  crearEl('td', { style: { textAlign: 'center', paddingBlock: 'var(--space-3)', background: 'color-mix(in srgb, var(--primary) 4%, transparent)' } }, [Boton({ texto: 'Empezar gratis', variante: 'primary', tamano: 'sm' })]),
                  crearEl('td', { style: { textAlign: 'center', paddingBlock: 'var(--space-3)' } }, [Boton({ texto: 'Contactar', variante: 'ghost', tamano: 'sm' })]),
                ]),
              ]),
            ]),
          ]),
          codigo: `// Columna recomendada con bg sutil + check verde
<th style="color: var(--primary)">Pro · popular</th>
<td style="background: rgba(59,130,246,0.04)">{valor}</td>`,
        })],
      }),

      // ============== 9. STRIPED + COMPACT ==============
      Seccion({
        titulo: '9 · Variantes — striped, compact, ghost',
        descripcion: 'Tres modificadores que cambian densidad y estilo: `--striped` para filas alternadas, `--compact` para listas largas, `--ghost` para look minimalista.',
        hijos: [crearEl('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' } }, [
          ['Striped (filas alternadas)', 'striped'],
          ['Compact (denso)', 'compact'],
          ['Ghost (minimalista)', 'ghost'],
        ].map(([t, variante]) => crearEl('div', null, [
          crearEl('div', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockEnd: '8px' } }, [t]),
          Tabla({
            variante,
            columnas: [
              { etiqueta: 'Mes', clave: 'mes' },
              { etiqueta: 'Ventas', clave: 'ventas', render: (r) => crearEl('div', { class: 'cell-num' }, [cellMoney(r.ventas)]) },
              { etiqueta: 'Δ', clave: 'd', render: (r) => cellDelta(r.d) },
            ],
            filas: [
              { mes: 'Enero',      ventas: 42000, d: 4.2 },
              { mes: 'Febrero',    ventas: 51000, d: 21.4 },
              { mes: 'Marzo',      ventas: 47500, d: -6.9 },
              { mes: 'Abril',      ventas: 58000, d: 22.1 },
              { mes: 'Mayo',       ventas: 64200, d: 10.7 },
              { mes: 'Junio',      ventas: 71500, d: 11.4 },
              { mes: 'Julio',      ventas: 78900, d: 10.3 },
            ],
          }),
        ])))],
      }),

      // ============== 10. ESTADO DE SERVICIOS ==============
      Seccion({
        titulo: '10 · Status / Health monitoring',
        descripcion: 'Tabla de estado tipo statuspage.io. Estado con punto coloreado, uptime con barra, latencia tabular-nums. Para SRE/DevOps dashboards.',
        hijos: [VistaCodigo({
          vista: Tabla({
            columnas: [
              { etiqueta: 'Servicio', render: (s) => crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                crearEl('span', { style: { fontSize: '14px' } }, [s.icono]),
                crearEl('span', { style: { fontWeight: 600 } }, [s.nombre]),
              ]) },
              { etiqueta: 'Región', clave: 'region' },
              { etiqueta: 'Estado', clave: 'estado', render: (s) => cellEstado(s.estadoLabel, s.estado === 'operativo' ? '#10b981' : s.estado === 'degradado' ? '#f59e0b' : s.estado === 'mantenimiento' ? '#3b82f6' : '#ef4444') },
              { etiqueta: 'Uptime 30d', clave: 'uptime', render: (s) => cellBarra(s.uptime) },
              { etiqueta: 'Latencia p95', clave: 'latencia', render: (s) => crearEl('div', { class: 'cell-num' }, [`${s.latencia}ms`]) },
              { etiqueta: 'Incidentes 30d', clave: 'inc', render: (s) => crearEl('div', { class: 'cell-num' }, [s.inc]) },
              { etiqueta: 'Última verificación', clave: 'verif' },
            ],
            filas: [
              { icono: '🌐', nombre: 'API Gateway',    region: 'us-east-1', estado: 'operativo',     estadoLabel: 'Operativo',     uptime: 99.98, latencia: 84,  inc: 0, verif: 'hace 14 s' },
              { icono: '🗄️', nombre: 'Database (primary)', region: 'us-east-1', estado: 'operativo', estadoLabel: 'Operativo',     uptime: 99.99, latencia: 32,  inc: 0, verif: 'hace 14 s' },
              { icono: '🔍', nombre: 'Search (Algolia)', region: 'global', estado: 'degradado',      estadoLabel: 'Degradado',     uptime: 98.42, latencia: 320, inc: 2, verif: 'hace 21 s' },
              { icono: '📦', nombre: 'Storage (S3)',   region: 'us-east-1', estado: 'operativo',     estadoLabel: 'Operativo',     uptime: 99.95, latencia: 142, inc: 0, verif: 'hace 14 s' },
              { icono: '⚡', nombre: 'CDN (Cloudflare)', region: 'global',  estado: 'operativo',     estadoLabel: 'Operativo',     uptime: 99.99, latencia: 28,  inc: 0, verif: 'hace 14 s' },
              { icono: '📧', nombre: 'Email (SendGrid)', region: 'global', estado: 'mantenimiento', estadoLabel: 'Mantenimiento', uptime: 99.20, latencia: 0,   inc: 0, verif: 'hace 14 s' },
              { icono: '💳', nombre: 'Stripe webhooks', region: 'global',   estado: 'caido',         estadoLabel: 'Caído',         uptime: 96.10, latencia: 0,   inc: 4, verif: 'hace 14 s' },
            ],
          }),
          codigo: `{ etiqueta: 'Estado', render: s => cellEstado(s.label,
  s.estado === 'operativo' ? '#10b981' :
  s.estado === 'degradado' ? '#f59e0b' :
  s.estado === 'caido'     ? '#ef4444' : '#3b82f6') },`,
        })],
      }),

    ],
  });
};
