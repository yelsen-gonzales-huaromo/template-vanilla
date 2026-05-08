/**
 * Adaptador para FullCalendar — calendario completo con vistas mes/semana/día.
 *  https://fullcalendar.io/
 *
 *   const { contenedor, instancia } = await CalendarioCompleto({
 *     eventos: [
 *       { id: '1', title: 'Reunión', start: '2026-05-12T10:00', end: '2026-05-12T11:00', color: '#3b82f6' },
 *     ],
 *     vistaInicial: 'dayGridMonth',
 *     alClickEvento: (info) => console.log(info.event),
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '6.1.15';
const URL_JS = `https://cdn.jsdelivr.net/npm/fullcalendar@${VERSION}/index.global.min.js`;

export const cargarFullCalendar = () => cargarLib({ scripts: URL_JS, global: 'FullCalendar' });

/**
 * @param {object} opts
 * @param {Array}  opts.eventos
 * @param {'dayGridMonth'|'timeGridWeek'|'timeGridDay'|'listWeek'} [opts.vistaInicial='dayGridMonth']
 * @param {Function} [opts.alClickEvento]
 * @param {Function} [opts.alClickFecha]
 * @param {Function} [opts.alSeleccionarRango]
 * @param {boolean}  [opts.editable=true]
 * @param {string}   [opts.alto='auto']
 */
export const CalendarioCompleto = async ({
  eventos = [],
  vistaInicial = 'dayGridMonth',
  alClickEvento,
  alClickFecha,
  alSeleccionarRango,
  editable = true,
  alto = 'auto',
} = {}) => {
  const FullCalendar = await cargarFullCalendar();
  const contenedor = document.createElement('div');
  contenedor.style.minHeight = '500px';

  const instancia = new FullCalendar.Calendar(contenedor, {
    initialView: vistaInicial,
    locale: 'es',
    height: alto,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    buttonText: {
      today: 'Hoy', month: 'Mes', week: 'Semana', day: 'Día', list: 'Lista',
    },
    firstDay: 1,
    selectable: true,
    editable,
    nowIndicator: true,
    events: eventos,
    eventClick: alClickEvento,
    dateClick: alClickFecha,
    select: alSeleccionarRango,
  });

  // Render cuando entra en viewport.
  const observador = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) {
      observador.disconnect();
      instancia.render();
    }
  });
  observador.observe(contenedor);

  return { contenedor, instancia };
};
