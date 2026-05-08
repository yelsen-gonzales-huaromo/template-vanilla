/**
 * Analytics dashboard — métricas de tráfico y comportamiento.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Bar, Heatmap, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'Analítica',
    subtitulo: 'Comportamiento de tu producto en los últimos 30 días.',
    acciones: [
      Btn('Hoy', 'outline'),
      Btn('Últimos 30 días', 'primary'),
      Btn('Exportar PDF', 'outline'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Sesiones',         valor: '186,432', delta: '+12.4%', tendencia: 'up',
      icono: 'analitica', color: 'primary', sparkline: seriePerlin(30, 70, 25, 1) }),
    KPI({ etiqueta: 'Usuarios únicos',  valor: '94,128',  delta: '+8.1%',  tendencia: 'up',
      icono: 'crm', color: 'success',     sparkline: seriePerlin(30, 60, 20, 2) }),
    KPI({ etiqueta: 'Tasa de rebote',   valor: '34.2%',   delta: '-3.2%',  tendencia: 'down',
      icono: 'flechas_lr', color: 'warning', sparkline: seriePerlin(30, 50, 30, 3) }),
    KPI({ etiqueta: 'Tiempo en sitio',  valor: '4m 12s',  delta: '+0.8%',  tendencia: 'up',
      icono: 'reloj', color: 'info',     sparkline: seriePerlin(30, 80, 15, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Tráfico diario',
      subtitulo: 'Sesiones (azul) vs Usuarios únicos (verde)',
      hijos: Linea({
        series: [seriePerlin(30, 75, 20, 1), seriePerlin(30, 50, 18, 5)],
        etiquetas: ['1', '5', '10', '15', '20', '25', '30'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Por dispositivo',
      hijos: Donut({
        datos: [
          { label: 'Desktop', valor: 62000, color: '#3b82f6' },
          { label: 'Móvil',   valor: 28000, color: '#22c55e' },
          { label: 'Tablet',  valor: 10000, color: '#a855f7' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Top fuentes de tráfico',
      hijos: Progreso([
        { label: 'Búsqueda orgánica', pct: 78, valor: '54.2K', color: 'var(--color-success)' },
        { label: 'Directo',            pct: 45, valor: '31.8K', color: 'var(--primary)' },
        { label: 'Redes sociales',     pct: 32, valor: '22.1K', color: '#a855f7' },
        { label: 'Email',              pct: 18, valor: '12.4K', color: '#f59e0b' },
        { label: 'Referidos',          pct: 12, valor: '8.3K',  color: '#06b6d4' },
      ]),
    }),
    Panel({
      titulo: 'Páginas más visitadas',
      hijos: Lista([
        { icono: 'pagina', titulo: '/inicio',         sub: '/launchpad.dev',  valor: '12.4K', delta: '+8%', tendencia: 'up' },
        { icono: 'pagina', titulo: '/precios',        sub: '/precios',        valor: '8.2K',  delta: '+15%', tendencia: 'up' },
        { icono: 'pagina', titulo: '/blog/v2',        sub: 'Anuncio v2',      valor: '6.7K',  delta: '+42%', tendencia: 'up' },
        { icono: 'pagina', titulo: '/docs/api',       sub: 'Docs',            valor: '4.1K',  delta: '-3%', tendencia: 'down' },
        { icono: 'pagina', titulo: '/checkout',       sub: 'Funnel',          valor: '2.8K',  delta: '+12%', tendencia: 'up' },
      ]),
    }),
    Panel({
      titulo: 'Top campañas',
      hijos: Lista([
        { avatar: 'GG', color: '#ea4335', titulo: 'Google Ads — Q3',   sub: 'CPC: $0.42',     valor: '+18.2%' },
        { avatar: 'FB', color: '#1877f2', titulo: 'Facebook Lookalike', sub: 'CPM: $4.10',     valor: '+12.5%' },
        { avatar: 'IG', color: '#e4405f', titulo: 'Instagram Reels',   sub: 'CPC: $0.28',     valor: '+24.1%' },
        { avatar: 'LK', color: '#0a66c2', titulo: 'LinkedIn B2B',      sub: 'CPM: $12.40',    valor: '+9.8%' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Visitas por hora del día',
      subtitulo: 'Heatmap de los últimos 7 días',
      hijos: Heatmap({
        filas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        cols: ['00', '03', '06', '09', '12', '15', '18', '21'],
        datos: [
          [10, 5, 12, 45, 78, 92, 65, 32],
          [12, 6, 14, 48, 82, 95, 70, 38],
          [11, 5, 13, 46, 80, 90, 68, 35],
          [13, 7, 15, 50, 85, 98, 72, 40],
          [15, 8, 18, 52, 88, 100, 76, 45],
          [25, 10, 12, 30, 60, 78, 82, 70],
          [30, 12, 10, 25, 50, 65, 75, 65],
        ],
      }),
    }),
    Panel({
      titulo: 'Eventos por país',
      hijos: Bar({
        datos: [42500, 31200, 28100, 19400, 15800, 12300, 9800, 7200],
        etiquetas: ['PE', 'MX', 'CO', 'AR', 'CL', 'ES', 'US', 'Otros'],
        color: '#3b82f6',
        alto: 240,
      }),
    }),
  ]),
]);
