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
 * @param {Function} [opts.alSoltarExterno]    — fires al soltar (info: { draggedEl, date, dateStr, allDay })
 * @param {Function} [opts.alRecibirEvento]    — fires DESPUÉS de que FC crea el evento (info: { event })
 * @param {Function} [opts.alMoverEvento]      — usuario arrastró/redimensionó
 * @param {boolean}  [opts.editable=true]
 * @param {boolean}  [opts.aceptarDropExterno=false]
 * @param {string}   [opts.alto='auto']
 * @param {object}   [opts.opcionesExtra]      — pasa opciones extra crudas a FullCalendar
 */
export const CalendarioCompleto = async ({
  eventos = [],
  vistaInicial = 'dayGridMonth',
  alClickEvento,
  alClickFecha,
  alSeleccionarRango,
  alSoltarExterno,
  alRecibirEvento,
  alMoverEvento,
  editable = true,
  aceptarDropExterno = false,
  alto = 'auto',
  opcionesExtra = {},
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
    droppable: aceptarDropExterno,
    events: eventos,
    eventClick: alClickEvento,
    dateClick: alClickFecha,
    select: alSeleccionarRango,
    drop: alSoltarExterno,
    eventReceive: alRecibirEvento,
    eventDrop: alMoverEvento,
    eventResize: alMoverEvento,
    ...opcionesExtra,
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

/**
 * Convierte un contenedor con hijos `.fc-evento-externo` en draggable hacia
 * cualquier instancia de FullCalendar. Cada hijo debe tener:
 *   data-evento='{ "title": "...", "color": "...", "duracion": "01:00" }'
 *
 * Devuelve la instancia Draggable (para destruir si hace falta).
 */
export const hacerDraggablesExternos = async (contenedor, opciones = {}) => {
  await cargarFullCalendar();
  const Draggable = window.FullCalendar.Draggable;
  if (!Draggable) {
    console.warn('[fullcalendar] Draggable no disponible en este bundle');
    return null;
  }
  return new Draggable(contenedor, {
    itemSelector: opciones.selector || '.fc-evento-externo',
    eventData: (el) => {
      try {
        const d = JSON.parse(el.dataset.evento || '{}');
        return {
          title:    d.title || el.textContent.trim(),
          color:    d.color,
          duration: d.duracion || d.duration,
          allDay:   d.allDay,
          extendedProps: d.extendedProps || {},
        };
      } catch {
        return { title: el.textContent.trim() };
      }
    },
  });
};
