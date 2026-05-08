/**
 * E-commerce dashboard — ventas, productos, pedidos y clientes.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Bar, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'E-commerce',
    subtitulo: 'Ventas, productos, pedidos y comportamiento del cliente.',
    acciones: [
      Btn('Mes actual', 'outline'),
      Btn('+ Nuevo producto', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Ingresos del mes', valor: 'S/. 348,290', delta: '+22.4%', tendencia: 'up',
      icono: 'analitica', color: 'success', sparkline: seriePerlin(30, 70, 25, 1) }),
    KPI({ etiqueta: 'Pedidos',           valor: '1,847',       delta: '+12.1%', tendencia: 'up',
      icono: 'pedidos', color: 'primary', sparkline: seriePerlin(30, 60, 18, 2) }),
    KPI({ etiqueta: 'Ticket promedio',   valor: 'S/. 188.50',  delta: '+5.2%',  tendencia: 'up',
      icono: 'tarjeta', color: 'info',    sparkline: seriePerlin(30, 75, 12, 3) }),
    KPI({ etiqueta: 'Tasa conversión',   valor: '3.42%',       delta: '+0.4%',  tendencia: 'up',
      icono: 'estrella', color: 'warning', sparkline: seriePerlin(30, 50, 15, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Ventas vs pedidos',
      subtitulo: 'Últimos 30 días',
      hijos: Linea({
        series: [seriePerlin(30, 70, 25, 1), seriePerlin(30, 50, 18, 6)],
        etiquetas: ['1', '5', '10', '15', '20', '25', '30'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Por categoría',
      hijos: Donut({
        datos: [
          { label: 'Electrónica',  valor: 142000, color: '#3b82f6' },
          { label: 'Moda',         valor: 98000,  color: '#ec4899' },
          { label: 'Hogar',        valor: 64000,  color: '#22c55e' },
          { label: 'Deportes',     valor: 28000,  color: '#f59e0b' },
          { label: 'Otros',        valor: 16290,  color: '#94a3b8' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Top productos',
      accion: Btn('Ver todos', 'ghost'),
      hijos: Lista([
        { avatar: '📱', color: '#3b82f6', titulo: 'iPhone 15 Pro 256GB',     sub: '124 unidades',   valor: 'S/. 89.5K', delta: '+18%', tendencia: 'up' },
        { avatar: '💻', color: '#a855f7', titulo: 'MacBook Air M3',          sub: '78 unidades',    valor: 'S/. 72.1K', delta: '+25%', tendencia: 'up' },
        { avatar: '🎧', color: '#22c55e', titulo: 'AirPods Pro 2',           sub: '342 unidades',   valor: 'S/. 41.0K', delta: '+12%', tendencia: 'up' },
        { avatar: '⌚', color: '#f59e0b', titulo: 'Apple Watch Ultra',       sub: '95 unidades',    valor: 'S/. 38.4K', delta: '-3%',  tendencia: 'down' },
        { avatar: '🖱', color: '#06b6d4', titulo: 'Magic Mouse',             sub: '210 unidades',   valor: 'S/. 18.9K', delta: '+8%',  tendencia: 'up' },
      ]),
    }),
    Panel({
      titulo: 'Pedidos recientes',
      accion: Btn('Bandeja', 'ghost'),
      hijos: Lista([
        { icono: 'pedidos', color: '#22c55e', titulo: '#10342 · María García', sub: 'Pagado · 3 items',     valor: 'S/. 248' },
        { icono: 'pedidos', color: '#f59e0b', titulo: '#10341 · Carlos M.',    sub: 'Pendiente · 1 item',   valor: 'S/. 1,290' },
        { icono: 'pedidos', color: '#22c55e', titulo: '#10340 · Ana López',    sub: 'Enviado · 2 items',    valor: 'S/. 458' },
        { icono: 'pedidos', color: '#ef4444', titulo: '#10339 · Diego R.',     sub: 'Cancelado · refund',   valor: '-S/. 120' },
        { icono: 'pedidos', color: '#22c55e', titulo: '#10338 · Lucía T.',     sub: 'Pagado · 5 items',     valor: 'S/. 824' },
      ]),
    }),
    Panel({
      titulo: 'Stock crítico',
      accion: Btn('Reabastecer', 'ghost'),
      hijos: Lista([
        { icono: 'productos', color: '#ef4444', titulo: 'iPhone 15 Pro Max',    sub: 'Negro 512GB',          valor: '3 uds' },
        { icono: 'productos', color: '#ef4444', titulo: 'MacBook Air M3 13"',   sub: 'Plata 8GB/256GB',      valor: '2 uds' },
        { icono: 'productos', color: '#f59e0b', titulo: 'AirPods Pro 2',        sub: 'Caja USB-C',           valor: '7 uds' },
        { icono: 'productos', color: '#f59e0b', titulo: 'Apple Watch Series 9', sub: '45mm Aluminio',        valor: '8 uds' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Ventas por día de la semana',
      hijos: Bar({
        datos: [42500, 38200, 41100, 45400, 52800, 68300, 58900],
        etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        color: '#22c55e',
        alto: 240,
      }),
    }),
    Panel({
      titulo: 'Métricas de fulfillment',
      subtitulo: 'Cumplimiento de envíos · últimos 30 días',
      hijos: Progreso([
        { label: 'Pedidos enviados a tiempo', pct: 96, valor: '96%', color: 'var(--color-success)' },
        { label: 'Tasa de devolución',        pct: 4,  valor: '4%',  color: 'var(--color-danger)' },
        { label: 'Carritos abandonados',      pct: 32, valor: '32%', color: '#f59e0b' },
        { label: 'Clientes recurrentes',      pct: 58, valor: '58%', color: 'var(--primary)' },
        { label: 'Satisfacción del cliente',  pct: 92, valor: '4.6 ★', color: '#a855f7' },
      ]),
    }),
  ]),
]);
