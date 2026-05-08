/**
 * Proyectos dashboard — gestión de proyectos, equipo y deadlines.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'Proyectos',
    subtitulo: 'Estado, deadlines, presupuesto y workload del equipo.',
    acciones: [
      Btn('Reportes', 'outline'),
      Btn('+ Nuevo proyecto', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Proyectos activos',     valor: '24',         delta: '+3',     tendencia: 'up',
      icono: 'proyectos', color: 'primary', sparkline: seriePerlin(20, 60, 18, 1) }),
    KPI({ etiqueta: 'Tareas completadas',    valor: '342',        delta: '+18%',   tendencia: 'up',
      icono: 'check', color: 'success',     sparkline: seriePerlin(20, 75, 22, 2) }),
    KPI({ etiqueta: 'Horas trabajadas',      valor: '1,824h',     delta: '+12%',   tendencia: 'up',
      icono: 'reloj', color: 'info',        sparkline: seriePerlin(20, 70, 15, 3) }),
    KPI({ etiqueta: 'Presupuesto consumido', valor: '68.4%',      delta: '+4.2%',  tendencia: 'flat',
      icono: 'analitica', color: 'warning', sparkline: seriePerlin(20, 65, 12, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Burndown del sprint',
      subtitulo: 'Sprint #14 · ideal vs real',
      hijos: Linea({
        series: [
          [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0],
          [100, 95, 88, 82, 70, 62, 50, 42, 30, 18, 8],
        ],
        etiquetas: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9', 'D10', 'D11'],
        colores: ['#94a3b8', 'var(--primary)'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Por estado',
      hijos: Donut({
        datos: [
          { label: 'En progreso',  valor: 12, color: '#3b82f6' },
          { label: 'En revisión',  valor: 5,  color: '#f59e0b' },
          { label: 'Completados',  valor: 6,  color: '#22c55e' },
          { label: 'Bloqueados',   valor: 1,  color: '#ef4444' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Proyectos próximos a vencer',
      accion: Btn('Calendario', 'ghost'),
      hijos: Lista([
        { icono: 'calendario', color: '#ef4444', titulo: 'Migración legacy DB',     sub: 'Vence en 2 días',  valor: '78%' },
        { icono: 'calendario', color: '#f59e0b', titulo: 'Rebranding marketing',   sub: 'Vence en 5 días',  valor: '62%' },
        { icono: 'calendario', color: '#f59e0b', titulo: 'App móvil v3',           sub: 'Vence en 1 sem.',  valor: '45%' },
        { icono: 'calendario', color: '#3b82f6', titulo: 'Integración Stripe',     sub: 'Vence en 2 sem.',  valor: '88%' },
        { icono: 'calendario', color: '#22c55e', titulo: 'Sistema de reportes',    sub: 'Vence en 3 sem.',  valor: '32%' },
      ]),
    }),
    Panel({
      titulo: 'Workload del equipo',
      accion: Btn('Reasignar', 'ghost'),
      hijos: Lista([
        { avatar: 'CM', color: '#8b5cf6', titulo: 'Carlos Mendoza',  sub: '8 tareas · Backend',   valor: '92%' },
        { avatar: 'AL', color: '#06b6d4', titulo: 'Ana López',       sub: '6 tareas · Frontend',  valor: '78%' },
        { avatar: 'MG', color: '#ec4899', titulo: 'María García',    sub: '5 tareas · Diseño',    valor: '65%' },
        { avatar: 'DR', color: '#22c55e', titulo: 'Diego Ramírez',   sub: '3 tareas · DevOps',    valor: '48%' },
      ]),
    }),
    Panel({
      titulo: 'Hitos próximos',
      hijos: Lista([
        { icono: 'estrella', color: '#22c55e', titulo: 'Beta v2 launch',          sub: '15 May 2026' },
        { icono: 'estrella', color: '#3b82f6', titulo: 'Auditoría de seguridad', sub: '22 May 2026' },
        { icono: 'estrella', color: '#a855f7', titulo: 'Feature freeze Q2',     sub: '30 May 2026' },
        { icono: 'estrella', color: '#f59e0b', titulo: 'Demo a inversionistas', sub: '5 Jun 2026' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Progreso de proyectos principales',
      hijos: Progreso([
        { label: 'Plataforma v2',          pct: 78, valor: '78%', color: 'var(--color-success)' },
        { label: 'App móvil iOS/Android',  pct: 45, valor: '45%', color: 'var(--primary)' },
        { label: 'Migración a microservicios', pct: 62, valor: '62%', color: '#a855f7' },
        { label: 'Sistema de notificaciones', pct: 92, valor: '92%', color: 'var(--color-success)' },
        { label: 'Rediseño UI dashboard',  pct: 28, valor: '28%', color: '#f59e0b' },
      ]),
    }),
    Panel({
      titulo: 'Presupuesto por proyecto',
      subtitulo: 'Consumido vs asignado',
      hijos: Progreso([
        { label: 'Plataforma v2',           pct: 68, valor: 'S/. 340K / 500K', color: 'var(--primary)' },
        { label: 'App móvil',               pct: 92, valor: 'S/. 184K / 200K', color: '#ef4444' },
        { label: 'Migración microservicios', pct: 45, valor: 'S/. 90K / 200K', color: 'var(--color-success)' },
        { label: 'Sistema notificaciones',  pct: 38, valor: 'S/. 38K / 100K',  color: 'var(--color-success)' },
        { label: 'Marketing Q3',            pct: 78, valor: 'S/. 156K / 200K', color: '#f59e0b' },
      ]),
    }),
  ]),
]);
