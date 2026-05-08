/**
 * SaaS dashboard — MRR, ARR, churn, NPS, signups y health del producto.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Bar, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'SaaS Metrics',
    subtitulo: 'Salud del negocio · MRR, churn, retention y health del producto.',
    acciones: [
      Btn('Compartir reporte', 'outline'),
      Btn('Cohort analysis', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'MRR',                valor: 'S/. 184,290', delta: '+12.4%', tendencia: 'up',
      icono: 'analitica', color: 'success', sparkline: seriePerlin(24, 70, 25, 1),
      sub: 'Annual run rate: S/. 2.21M' }),
    KPI({ etiqueta: 'Suscriptores activos', valor: '4,128',     delta: '+184',   tendencia: 'up',
      icono: 'crm', color: 'primary',     sparkline: seriePerlin(24, 65, 18, 2) }),
    KPI({ etiqueta: 'Churn rate',          valor: '2.4%',       delta: '-0.3%',  tendencia: 'down',
      icono: 'flechas_lr', color: 'success', sparkline: seriePerlin(24, 30, 15, 3) }),
    KPI({ etiqueta: 'NPS',                 valor: '64',         delta: '+8',     tendencia: 'up',
      icono: 'estrella', color: 'pink',  sparkline: seriePerlin(24, 75, 12, 4),
      sub: 'Promotores: 72%' }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'MRR · últimos 12 meses',
      subtitulo: 'New MRR (verde) · Churn MRR (rojo) · Net (azul)',
      hijos: Linea({
        series: [
          seriePerlin(12, 70, 12, 1),
          seriePerlin(12, 25, 8, 5),
          seriePerlin(12, 50, 15, 7),
        ],
        etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        colores: ['var(--color-success)', 'var(--color-danger)', 'var(--primary)'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Por plan',
      hijos: Donut({
        datos: [
          { label: 'Pro',         valor: 1840, color: '#3b82f6' },
          { label: 'Team',        valor: 1240, color: '#a855f7' },
          { label: 'Enterprise',  valor: 720,  color: '#22c55e' },
          { label: 'Free',        valor: 328,  color: '#94a3b8' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Nuevos signups',
      accion: Btn('Ver todos', 'ghost'),
      hijos: Lista([
        { avatar: 'AC', color: '#3b82f6', titulo: 'Acme Corp',         sub: 'Plan Enterprise · S/. 990/mes', valor: 'Hace 12 min' },
        { avatar: 'TS', color: '#a855f7', titulo: 'TechStartup SA',    sub: 'Plan Pro · S/. 99/mes',         valor: 'Hace 1 h' },
        { avatar: 'DL', color: '#22c55e', titulo: 'Dev Lab Inc',       sub: 'Plan Team · S/. 290/mes',       valor: 'Hace 2 h' },
        { avatar: 'IM', color: '#ec4899', titulo: 'Innov Media',       sub: 'Plan Pro · S/. 99/mes',         valor: 'Hace 3 h' },
        { avatar: 'CS', color: '#f59e0b', titulo: 'CloudSec Ltd',      sub: 'Plan Free → trial Pro',         valor: 'Hace 5 h' },
      ]),
    }),
    Panel({
      titulo: 'Adopción de features',
      accion: Btn('Detalle', 'ghost'),
      hijos: Progreso([
        { label: 'Dashboard',         pct: 92, color: 'var(--color-success)' },
        { label: 'Reportes custom',   pct: 78, color: 'var(--primary)' },
        { label: 'API integraciones', pct: 56, color: '#a855f7' },
        { label: 'Webhooks',          pct: 38, color: '#f59e0b' },
        { label: 'SSO',               pct: 24, color: '#ef4444' },
      ]),
    }),
    Panel({
      titulo: 'Health del sistema',
      hijos: Lista([
        { icono: 'check', color: '#22c55e', titulo: 'API uptime 99.98%',     sub: 'Últimos 30 días',     valor: '✓' },
        { icono: 'check', color: '#22c55e', titulo: 'Latencia P95: 142ms',   sub: 'Bajo objetivo (200ms)', valor: '✓' },
        { icono: 'check', color: '#f59e0b', titulo: 'DB queries lentas: 12', sub: 'Aumento de 8 ayer',   valor: '⚠' },
        { icono: 'check', color: '#22c55e', titulo: 'Webhook delivery: 100%', sub: '0 fallos en 24h',     valor: '✓' },
        { icono: 'check', color: '#22c55e', titulo: 'CDN cache hit: 98.4%',  sub: 'Óptimo',              valor: '✓' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Cohorts retention',
      subtitulo: '% de usuarios activos por mes desde signup',
      hijos: Bar({
        datos: [100, 84, 72, 64, 58, 54, 51, 48, 46, 44, 43, 42],
        etiquetas: ['M0', 'M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'],
        color: '#3b82f6',
        alto: 240,
      }),
    }),
    Panel({
      titulo: 'Customer Lifetime Value',
      subtitulo: 'LTV por plan · valor proyectado',
      hijos: Lista([
        { icono: 'analitica', color: '#22c55e', titulo: 'Enterprise', sub: '32 meses promedio', valor: 'S/. 31,680' },
        { icono: 'analitica', color: '#3b82f6', titulo: 'Team',       sub: '24 meses promedio', valor: 'S/. 6,960' },
        { icono: 'analitica', color: '#a855f7', titulo: 'Pro',        sub: '18 meses promedio', valor: 'S/. 1,782' },
        { icono: 'analitica', color: '#94a3b8', titulo: 'Free→Pro',   sub: 'Conversión 12.4%',  valor: 'S/. 220' },
      ]),
    }),
  ]),
]);
