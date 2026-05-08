/**
 * CRM dashboard — pipeline de ventas, deals, equipo y leads.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Funnel, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'CRM',
    subtitulo: 'Pipeline de ventas y rendimiento del equipo comercial.',
    acciones: [
      Btn('Importar leads', 'outline'),
      Btn('+ Nuevo deal', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Pipeline total',     valor: 'S/. 1.2M',  delta: '+24%', tendencia: 'up',
      icono: 'analitica', color: 'success', sparkline: seriePerlin(20, 70, 25, 1) }),
    KPI({ etiqueta: 'Deals cerrados',     valor: '47',         delta: '+8',   tendencia: 'up',
      icono: 'check', color: 'primary',     sparkline: seriePerlin(20, 60, 20, 2) }),
    KPI({ etiqueta: 'Ticket promedio',    valor: 'S/. 28,420', delta: '+12%', tendencia: 'up',
      icono: 'tarjeta', color: 'info',     sparkline: seriePerlin(20, 80, 15, 3) }),
    KPI({ etiqueta: 'Win rate',           valor: '34.8%',      delta: '+3.2%', tendencia: 'up',
      icono: 'estrella', color: 'pink',    sparkline: seriePerlin(20, 65, 18, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Embudo de ventas',
      subtitulo: 'Conversión por etapa · últimos 30 días',
      hijos: Funnel([
        { label: 'Leads',          valor: 1240, color: '#94a3b8' },
        { label: 'Calificados',    valor: 580,  color: '#3b82f6' },
        { label: 'Demos',          valor: 290,  color: '#a855f7' },
        { label: 'Propuestas',     valor: 142,  color: '#f59e0b' },
        { label: 'Ganados',        valor: 47,   color: '#22c55e' },
      ]),
    }),
    Panel({
      titulo: 'Origen de leads',
      hijos: Donut({
        datos: [
          { label: 'Referidos',      valor: 320, color: '#22c55e' },
          { label: 'Inbound',        valor: 280, color: '#3b82f6' },
          { label: 'Outbound',       valor: 210, color: '#f59e0b' },
          { label: 'Eventos',        valor: 150, color: '#a855f7' },
          { label: 'Partners',       valor: 80,  color: '#ec4899' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Top vendedores',
      accion: Btn('Ver ranking', 'ghost'),
      hijos: Lista([
        { avatar: 'CM', color: '#8b5cf6', titulo: 'Carlos Mendoza',  sub: '12 deals · S/. 340K', valor: '124%', delta: 'meta', tendencia: 'up' },
        { avatar: 'AL', color: '#06b6d4', titulo: 'Ana López',       sub: '10 deals · S/. 280K', valor: '108%', delta: 'meta', tendencia: 'up' },
        { avatar: 'DR', color: '#22c55e', titulo: 'Diego Ramírez',   sub: '8 deals · S/. 215K',  valor: '89%',  delta: 'meta', tendencia: 'down' },
        { avatar: 'LT', color: '#f97316', titulo: 'Lucía Torres',    sub: '7 deals · S/. 192K',  valor: '78%',  delta: 'meta', tendencia: 'down' },
      ]),
    }),
    Panel({
      titulo: 'Deals por cerrar esta semana',
      hijos: Lista([
        { icono: 'tarjeta', color: '#22c55e', titulo: 'Acme Corp · Plan Enterprise', sub: 'S/. 85,000 · 92% prob.', valor: 'Mar' },
        { icono: 'tarjeta', color: '#3b82f6', titulo: 'TechStartup SA',              sub: 'S/. 42,000 · 78% prob.', valor: 'Mié' },
        { icono: 'tarjeta', color: '#f59e0b', titulo: 'Distribuidora Lima',          sub: 'S/. 38,000 · 65% prob.', valor: 'Jue' },
        { icono: 'tarjeta', color: '#a855f7', titulo: 'Consultora Norte',            sub: 'S/. 28,000 · 55% prob.', valor: 'Vie' },
      ]),
    }),
    Panel({
      titulo: 'Actividad del equipo',
      hijos: Lista([
        { icono: 'chat', color: '#3b82f6', titulo: 'Carlos llamó a Acme Corp', sub: 'Hace 12 min · 25 min duración' },
        { icono: 'correo', color: '#a855f7', titulo: 'Ana envió propuesta',     sub: 'Hace 1h · TechStartup' },
        { icono: 'check', color: '#22c55e', titulo: 'Diego cerró deal',         sub: 'Hace 2h · S/. 32K' },
        { icono: 'eventos', color: '#f59e0b', titulo: 'Lucía agendó demo',      sub: 'Mañana · 10am' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Revenue mensual',
      subtitulo: 'Ingresos cerrados · últimos 12 meses',
      hijos: Linea({
        series: [seriePerlin(12, 70, 20, 1)],
        etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        colores: ['var(--color-success)'],
        alto: 240,
      }),
    }),
    Panel({
      titulo: 'Cumplimiento de cuota',
      subtitulo: 'Por vendedor · Q3',
      hijos: Progreso([
        { label: 'Carlos Mendoza', pct: 124, valor: 'S/. 340K / 275K', color: 'var(--color-success)' },
        { label: 'Ana López',      pct: 108, valor: 'S/. 280K / 260K', color: 'var(--color-success)' },
        { label: 'Diego Ramírez',  pct: 89,  valor: 'S/. 215K / 240K', color: 'var(--primary)' },
        { label: 'Lucía Torres',   pct: 78,  valor: 'S/. 192K / 245K', color: '#f59e0b' },
        { label: 'Pedro Silva',    pct: 56,  valor: 'S/. 134K / 240K', color: '#ef4444' },
      ]),
    }),
  ]),
]);
