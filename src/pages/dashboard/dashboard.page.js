/**
 * Default dashboard — overview general profesional.
 * Bienvenida + KPIs ejecutivos + tendencia + actividad reciente + tareas + equipo.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import {
  DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, seriePerlin,
} from '../panel/_dash.js';
import { Icono } from '../../components/ui/icon/icons.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: '¡Buenos días, María! 👋',
    subtitulo: 'Aquí está el resumen de hoy. Tienes 3 tareas pendientes y 2 reuniones esta tarde.',
    acciones: [
      Btn('Exportar', 'outline'),
      Btn('+ Nuevo proyecto', 'primary'),
    ],
  }),

  // KPIs principales
  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Ingresos del mes', valor: 'S/. 124,580', delta: '+18.2%', tendencia: 'up',
      icono: 'analitica', color: 'success', sparkline: seriePerlin(24, 80, 30, 1),
      sub: 'vs mes anterior' }),
    KPI({ etiqueta: 'Proyectos activos', valor: '12', delta: '+3', tendencia: 'up',
      icono: 'proyectos', color: 'primary', sparkline: seriePerlin(24, 50, 15, 2) }),
    KPI({ etiqueta: 'Tareas pendientes', valor: '23', delta: '-5', tendencia: 'down',
      icono: 'kanban', color: 'warning', sparkline: seriePerlin(24, 60, 20, 3) }),
    KPI({ etiqueta: 'Satisfacción', valor: '4.8 ★', delta: '+0.3', tendencia: 'up',
      icono: 'estrella', color: 'pink', sparkline: seriePerlin(24, 90, 10, 4),
      sub: 'sobre 1,284 reseñas' }),
  ]),

  // Tendencia + canales
  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Rendimiento del trimestre',
      subtitulo: 'Ingresos vs gastos · últimos 12 meses',
      accion: Btn('Ver detalle', 'ghost'),
      hijos: Linea({
        series: [seriePerlin(12, 70, 30, 1), seriePerlin(12, 45, 20, 5)],
        etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        colores: ['var(--color-success)', 'var(--color-danger)'],
        alto: 260,
      }),
    }),
    Panel({
      titulo: 'Distribución por canal',
      subtitulo: 'Origen de los ingresos',
      hijos: Donut({
        datos: [
          { label: 'Web directo',   valor: 45200, color: '#3b82f6' },
          { label: 'Móvil app',     valor: 32100, color: '#22c55e' },
          { label: 'Marketplace',   valor: 28900, color: '#a855f7' },
          { label: 'Partners',      valor: 18380, color: '#f59e0b' },
        ],
      }),
    }),
  ]),

  // Tareas + Equipo + Actividad
  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Tareas próximas',
      accion: Btn('Ver todas', 'ghost'),
      hijos: Lista([
        { icono: 'check', color: '#ef4444',
          titulo: 'Revisar diseño del checkout', sub: 'Vence hoy · Alta', valor: '2h' },
        { icono: 'check', color: '#f59e0b',
          titulo: 'Sprint planning Q3',          sub: 'Mañana 10am',     valor: '1h' },
        { icono: 'check', color: '#3b82f6',
          titulo: 'Reunión con cliente Acme',    sub: 'Jueves 4pm',      valor: '45m' },
        { icono: 'check', color: '#22c55e',
          titulo: 'Deploy a producción',         sub: 'Viernes 6pm',     valor: '30m' },
      ]),
    }),
    Panel({
      titulo: 'Equipo activo',
      accion: Btn('Invitar', 'ghost'),
      hijos: Lista([
        { avatar: 'MG', color: '#ec4899', titulo: 'María García',   sub: 'Online · Diseño',     valor: '5 tareas' },
        { avatar: 'CM', color: '#8b5cf6', titulo: 'Carlos Mendoza', sub: 'Online · Backend',    valor: '3 tareas' },
        { avatar: 'AL', color: '#06b6d4', titulo: 'Ana López',      sub: 'Reunión · Frontend',  valor: '7 tareas' },
        { avatar: 'DR', color: '#22c55e', titulo: 'Diego Ramírez',  sub: 'Offline · DevOps',    valor: '2 tareas' },
      ]),
    }),
    Panel({
      titulo: 'Actividad reciente',
      hijos: Lista([
        { icono: 'check', color: '#22c55e', titulo: 'Carlos completó "API de pagos"', sub: 'Hace 12 min' },
        { icono: 'chat', color: '#3b82f6',  titulo: 'María comentó en "Onboarding"',  sub: 'Hace 1 h' },
        { icono: 'mas', color: '#a855f7',   titulo: 'Ana creó el sprint Q3',          sub: 'Hace 3 h' },
        { icono: 'reportes', color: '#f59e0b', titulo: 'Reporte mensual generado',     sub: 'Ayer 18:00' },
      ]),
    }),
  ]),

  // Progreso de proyectos
  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Progreso de objetivos Q3',
      subtitulo: 'OKRs del trimestre',
      hijos: Progreso([
        { label: 'Lanzar v2 de la plataforma', pct: 78, color: 'var(--color-success)' },
        { label: 'Aumentar MRR a $500K',       pct: 62, color: 'var(--primary)' },
        { label: 'Reducir churn al 2%',        pct: 45, color: '#f59e0b' },
        { label: 'Contratar 5 ingenieros',     pct: 80, color: '#a855f7' },
        { label: 'NPS ≥ 50',                   pct: 92, color: '#22c55e' },
      ]),
    }),
    Panel({
      titulo: 'Proyectos por estado',
      subtitulo: 'Workload del equipo',
      hijos: Donut({
        datos: [
          { label: 'En progreso', valor: 8, color: '#3b82f6' },
          { label: 'En revisión', valor: 3, color: '#f59e0b' },
          { label: 'Completados', valor: 12, color: '#22c55e' },
          { label: 'Bloqueados',  valor: 1, color: '#ef4444' },
        ],
      }),
    }),
  ]),
]);
