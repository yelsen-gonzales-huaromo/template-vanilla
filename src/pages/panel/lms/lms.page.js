/**
 * LMS dashboard — cursos, estudiantes, instructores y aprendizaje.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { DashHeader, KPI, Panel, Lista, Progreso, Linea, Donut, Bar, seriePerlin } from '../_dash.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: 'button', class: ['btn', variante !== 'primary' && `btn--${variante}`], ...extra,
}, [texto]);

export default async () => crearEl('div', null, [
  DashHeader({
    titulo: 'Plataforma de aprendizaje',
    subtitulo: 'Cursos, estudiantes, instructores y métricas de finalización.',
    acciones: [
      Btn('Reportes', 'outline'),
      Btn('+ Nuevo curso', 'primary'),
    ],
  }),

  crearEl('div', { class: 'dash-grid-kpis' }, [
    KPI({ etiqueta: 'Estudiantes activos',  valor: '12,481',  delta: '+8.4%',  tendencia: 'up',
      icono: 'estudiante', color: 'primary', sparkline: seriePerlin(20, 70, 25, 1) }),
    KPI({ etiqueta: 'Cursos publicados',    valor: '142',      delta: '+12',    tendencia: 'up',
      icono: 'cursos', color: 'success',     sparkline: seriePerlin(20, 60, 18, 2) }),
    KPI({ etiqueta: 'Tasa de finalización', valor: '78.2%',    delta: '+4.1%',  tendencia: 'up',
      icono: 'check', color: 'info',         sparkline: seriePerlin(20, 75, 12, 3) }),
    KPI({ etiqueta: 'Calificación promedio', valor: '4.7 ★',   delta: '+0.2',   tendencia: 'up',
      icono: 'estrella', color: 'warning',   sparkline: seriePerlin(20, 80, 10, 4) }),
  ]),

  crearEl('div', { class: 'dash-grid-2' }, [
    Panel({
      titulo: 'Inscripciones por mes',
      subtitulo: 'Nuevos estudiantes vs estudiantes que completaron',
      hijos: Linea({
        series: [seriePerlin(12, 70, 25, 1), seriePerlin(12, 50, 18, 6)],
        etiquetas: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        colores: ['var(--primary)', 'var(--color-success)'],
        alto: 280,
      }),
    }),
    Panel({
      titulo: 'Categorías populares',
      hijos: Donut({
        datos: [
          { label: 'Tecnología',     valor: 4820, color: '#3b82f6' },
          { label: 'Negocios',       valor: 3140, color: '#a855f7' },
          { label: 'Diseño',         valor: 2280, color: '#ec4899' },
          { label: 'Idiomas',        valor: 1450, color: '#f59e0b' },
          { label: 'Otros',          valor: 791,  color: '#94a3b8' },
        ],
      }),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-3' }, [
    Panel({
      titulo: 'Cursos top',
      accion: Btn('Ver todos', 'ghost'),
      hijos: Lista([
        { avatar: '🐍', color: '#3776ab', titulo: 'Python para Data Science',  sub: '1,824 estudiantes',  valor: '4.9 ★' },
        { avatar: 'JS', color: '#eab308', titulo: 'JavaScript moderno ES6+',   sub: '1,420 estudiantes',  valor: '4.8 ★' },
        { avatar: 'UX', color: '#ec4899', titulo: 'Diseño UX/UI con Figma',   sub: '982 estudiantes',    valor: '4.9 ★' },
        { avatar: 'AI', color: '#a855f7', titulo: 'IA Generativa con LLMs',   sub: '780 estudiantes',    valor: '4.7 ★' },
        { avatar: '☁', color: '#06b6d4', titulo: 'AWS Cloud Practitioner',   sub: '654 estudiantes',    valor: '4.6 ★' },
      ]),
    }),
    Panel({
      titulo: 'Top instructores',
      accion: Btn('Ver perfiles', 'ghost'),
      hijos: Lista([
        { avatar: 'JM', color: '#3b82f6', titulo: 'José Martínez',     sub: '12 cursos · 4.9 ★',   valor: '8.2K' },
        { avatar: 'EL', color: '#22c55e', titulo: 'Elena Vargas',     sub: '8 cursos · 4.8 ★',    valor: '5.4K' },
        { avatar: 'RC', color: '#a855f7', titulo: 'Roberto Castro',    sub: '15 cursos · 4.7 ★',   valor: '4.9K' },
        { avatar: 'SP', color: '#ec4899', titulo: 'Sandra Pérez',      sub: '6 cursos · 4.9 ★',    valor: '3.2K' },
      ]),
    }),
    Panel({
      titulo: 'Próximas clases en vivo',
      hijos: Lista([
        { icono: 'monitor_play', color: '#ef4444', titulo: 'Python avanzado',          sub: 'Hoy · 6pm · 124 inscritos', valor: 'EN VIVO' },
        { icono: 'monitor_play', color: '#3b82f6', titulo: 'Q&A: React Server Comp.', sub: 'Mañana · 7pm',              valor: '85' },
        { icono: 'monitor_play', color: '#a855f7', titulo: 'Workshop Figma',           sub: 'Jueves · 6pm',              valor: '210' },
        { icono: 'monitor_play', color: '#22c55e', titulo: 'AWS Summit',               sub: 'Sábado · 10am',             valor: '432' },
      ]),
    }),
  ]),

  crearEl('div', { class: 'dash-grid-2-equal' }, [
    Panel({
      titulo: 'Horas estudiadas por día',
      subtitulo: 'Promedio de los últimos 7 días',
      hijos: Bar({
        datos: [248, 312, 289, 365, 421, 198, 156],
        etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        color: '#a855f7',
        alto: 240,
      }),
    }),
    Panel({
      titulo: 'Progreso de cohortes',
      subtitulo: 'Bootcamp 2026 · % completado',
      hijos: Progreso([
        { label: 'Cohorte Python · Marzo',     pct: 82, valor: '82%', color: 'var(--color-success)' },
        { label: 'Cohorte React · Abril',      pct: 65, valor: '65%', color: 'var(--primary)' },
        { label: 'Cohorte UX · Mayo',          pct: 48, valor: '48%', color: '#a855f7' },
        { label: 'Cohorte AWS · Mayo',         pct: 32, valor: '32%', color: '#06b6d4' },
        { label: 'Cohorte Data Sci · Junio',   pct: 12, valor: '12%', color: '#f59e0b' },
      ]),
    }),
  ]),
]);
