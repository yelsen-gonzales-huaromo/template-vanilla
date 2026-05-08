/**
 * Soporte dashboard — tickets, agentes, SLA y satisfacción.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Bar, Heatmap, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'Centro de soporte',
    subtitulo: 'Tickets, SLA, agentes y satisfacción del cliente.',
    acciones: [
      Btn('Asignación', 'outline'),
      Btn('+ Nuevo ticket', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Tickets abiertos',     valor: '127',     delta: '-8',     tendencia: 'down',
      icono: 'soporte', color: 'primary',  sparkline: seriePerlin(20, 60, 18, 1),
      sub: '23 sin asignar' }),
    KPI({ etiqueta: 'Tiempo 1ª respuesta',  valor: '12 min',  delta: '-3 min', tendencia: 'down',
      icono: 'reloj', color: 'success',    sparkline: seriePerlin(20, 50, 20, 2) }),
    KPI({ etiqueta: 'CSAT',                 valor: '4.8 ★',   delta: '+0.2',   tendencia: 'up',
      icono: 'estrella', color: 'pink',    sparkline: seriePerlin(20, 80, 10, 3) }),
    KPI({ etiqueta: 'SLA cumplido',         valor: '94.2%',   delta: '+2.1%',  tendencia: 'up',
      icono: 'check', color: 'info',       sparkline: seriePerlin(20, 75, 12, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Tickets nuevos vs resueltos',
      subtitulo: 'Últimos 14 días',
      hijos: Linea({
        series: [seriePerlin(14, 60, 18, 1), seriePerlin(14, 55, 20, 6)],
        etiquetas: ['1', '3', '5', '7', '9', '11', '13'],
        colores: ['#f59e0b', 'var(--color-success)'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Por canal',
      hijos: Donut({
        datos: [
          { label: 'Email',     valor: 540, color: '#ea4335' },
          { label: 'WhatsApp',  valor: 420, color: '#25d366' },
          { label: 'Chat web',  valor: 380, color: '#3b82f6' },
          { label: 'Teléfono',  valor: 180, color: '#a855f7' },
          { label: 'Twitter',   valor: 80,  color: '#1da1f2' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Top agentes',
      accion: Btn('Ranking completo', 'ghost'),
      hijos: Lista([
        { avatar: 'AL', color: '#06b6d4', titulo: 'Ana López',       sub: '48 tickets · 4.9 ★', valor: '94%' },
        { avatar: 'CM', color: '#8b5cf6', titulo: 'Carlos Mendoza',  sub: '42 tickets · 4.8 ★', valor: '92%' },
        { avatar: 'DR', color: '#22c55e', titulo: 'Diego Ramírez',   sub: '38 tickets · 4.7 ★', valor: '88%' },
        { avatar: 'LT', color: '#f97316', titulo: 'Lucía Torres',    sub: '35 tickets · 4.9 ★', valor: '95%' },
        { avatar: 'PS', color: '#ef4444', titulo: 'Pedro Silva',     sub: '28 tickets · 4.6 ★', valor: '82%' },
      ]),
    }),
    Panel({
      titulo: 'Tickets prioritarios',
      accion: Btn('Bandeja', 'ghost'),
      hijos: Lista([
        { icono: 'alerta', color: '#ef4444', titulo: '#4821 · Pago no procesado',      sub: 'Acme Corp · 2h sin respuesta', valor: 'P0' },
        { icono: 'alerta', color: '#ef4444', titulo: '#4820 · Login bloqueado x 3 usr', sub: 'Tech Inc · 1h',               valor: 'P0' },
        { icono: 'alerta', color: '#f59e0b', titulo: '#4818 · Sync no funciona',        sub: 'Dev Lab · 4h',                valor: 'P1' },
        { icono: 'alerta', color: '#f59e0b', titulo: '#4815 · Email entrega lenta',     sub: 'StartUp X · 6h',              valor: 'P1' },
        { icono: 'alerta', color: '#3b82f6', titulo: '#4810 · Pregunta sobre API',      sub: 'Innovate · 8h',               valor: 'P2' },
      ]),
    }),
    Panel({
      titulo: 'Categorías más reportadas',
      hijos: Progreso([
        { label: 'Pagos & facturación', pct: 32, valor: '420', color: '#ef4444' },
        { label: 'Login & cuenta',       pct: 24, valor: '316', color: '#f59e0b' },
        { label: 'Bugs técnicos',        pct: 18, valor: '237', color: '#a855f7' },
        { label: 'Cómo usar X',          pct: 14, valor: '184', color: '#3b82f6' },
        { label: 'Solicitud de feature', pct: 12, valor: '158', color: '#22c55e' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Volumen de tickets por hora',
      subtitulo: 'Heatmap última semana — para optimizar staffing',
      hijos: Heatmap({
        filas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        cols: ['00', '03', '06', '09', '12', '15', '18', '21'],
        datos: [
          [5, 3, 8, 42, 78, 95, 65, 25],
          [6, 4, 10, 48, 82, 100, 70, 28],
          [7, 4, 12, 52, 88, 98, 72, 30],
          [8, 5, 15, 56, 92, 100, 78, 32],
          [10, 6, 18, 62, 96, 100, 80, 38],
          [12, 8, 6, 22, 45, 58, 48, 30],
          [15, 10, 4, 18, 38, 50, 42, 25],
        ],
      }),
    }),
    Panel({
      titulo: 'Tickets por día',
      subtitulo: 'Volumen últimos 7 días',
      hijos: Bar({
        datos: [142, 158, 175, 168, 182, 95, 78],
        etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        color: 'var(--primary)',
        alto: 240,
      }),
    }),
  ]),
]);
