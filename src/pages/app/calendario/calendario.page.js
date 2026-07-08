/**
 * App Calendario — calendario completo con sidebar de eventos draggable.
 *
 * Inspirado en Outlook / Google Calendar / Minia. Layout 2 columnas:
 *   • Sidebar izq:  botón "Crear evento" + lista de plantillas draggable.
 *   • Calendario:   FullCalendar con vistas mes/semana/día/lista.
 *
 * Funciones:
 *   • Crear evento (modal con título, fecha, hora, color, descripción).
 *   • Editar / eliminar evento haciendo clic en él.
 *   • Drag plantilla desde sidebar → calendario crea evento.
 *   • Mover / redimensionar eventos en calendario (persistencia auto).
 *   • Persistencia en localStorage.
 *   • Tema claro / oscuro vía tokens.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { Boton } from '../../../components/ui/button/button.js';
import { Modal } from '../../../components/ui/modal/modal.js';
import { Aviso } from '../../../components/ui/aviso/aviso.js';
import { FloatingInput } from '../../modulos/forms/_floating.js';
import { estadoNotificaciones } from '../../../store/notifications.store.js';
import {
  CalendarioCompleto,
  hacerDraggablesExternos,
} from '../../../integrations/fullcalendar/index.js';

/* ─── Constantes ───────────────────────────────────────────────────────── */
const STORAGE_KEY = 'template-vanilla:calendario:eventos';

const PLANTILLAS = [
  { id: 'plan',     titulo: 'Planificación',     color: '#10b981', duracion: '01:00' },
  { id: 'reunion',  titulo: 'Reunión',           color: '#3b82f6', duracion: '00:30' },
  { id: 'reportes', titulo: 'Generar reportes',  color: '#f59e0b', duracion: '02:00' },
  { id: 'tema',     titulo: 'Crear nuevo tema',  color: '#ef4444', duracion: '01:30' },
  { id: 'equipo',   titulo: 'Reunión de equipo', color: '#6b7280', duracion: '01:00' },
  { id: 'review',   titulo: 'Code review',       color: '#8b5cf6', duracion: '00:45' },
  { id: 'cliente',  titulo: 'Llamada cliente',   color: '#06b6d4', duracion: '00:30' },
];

const COLORES = [
  { valor: '#3b82f6', etiqueta: 'Azul' },
  { valor: '#10b981', etiqueta: 'Verde' },
  { valor: '#f59e0b', etiqueta: 'Ámbar' },
  { valor: '#ef4444', etiqueta: 'Rojo' },
  { valor: '#8b5cf6', etiqueta: 'Violeta' },
  { valor: '#06b6d4', etiqueta: 'Cian' },
  { valor: '#ec4899', etiqueta: 'Rosa' },
  { valor: '#6b7280', etiqueta: 'Gris' },
];

/* Construye eventos demo basados en la fecha actual para que siempre
   se vean en el mes vigente. */
const eventosDemoIniciales = () => {
  const hoy = new Date();
  const y = hoy.getFullYear(), m = hoy.getMonth();
  const d = (dia) => new Date(y, m, dia).toISOString().slice(0, 10);
  return [
    { id: 'e1', title: 'Reunión all-hands',  start: d(3) + 'T09:00', end: d(3) + 'T10:00', color: '#3b82f6' },
    { id: 'e2', title: 'Planning sprint',    start: d(5) + 'T10:30', end: d(5) + 'T12:00', color: '#10b981' },
    { id: 'e3', title: 'Generar reportes Q1', start: d(7), end: d(11), color: '#f59e0b', allDay: true },
    { id: 'e4', title: 'Almuerzo equipo',    start: d(9) + 'T13:00', end: d(9) + 'T14:00', color: '#ef4444' },
    { id: 'e5', title: 'Code review',        start: d(12) + 'T15:00', end: d(12) + 'T16:00', color: '#8b5cf6' },
    { id: 'e6', title: 'Llamada cliente',    start: d(15) + 'T11:00', end: d(15) + 'T11:30', color: '#06b6d4' },
    { id: 'e7', title: 'Cumpleaños María',   start: d(20), color: '#ec4899', allDay: true },
  ];
};

/* ─── Persistencia ─────────────────────────────────────────────────────── */
const cargarEventos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const demo = eventosDemoIniciales();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  return demo;
};
const guardarEventos = (lista) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
};

const idNuevo = () => `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ─── Modal de evento (crear/editar) ───────────────────────────────────── */
const abrirModalEvento = ({ evento, alGuardar, alEliminar }) => {
  const editando = !!evento;
  const datos = {
    id: evento?.id || idNuevo(),
    title: evento?.title || '',
    start: evento?.start || '',
    end: evento?.end || '',
    color: evento?.color || '#3b82f6',
    allDay: evento?.allDay || false,
    descripcion: evento?.extendedProps?.descripcion || '',
  };
  const sStart = senal(toLocalInput(datos.start));
  const sEnd   = senal(toLocalInput(datos.end));
  const sColor = senal(datos.color);
  const sAllDay = senal(datos.allDay);

  const inputTitulo = FloatingInput({
    label: 'Título', value: datos.title, requerido: true, autoFocus: true,
  });
  inputTitulo.querySelector('input').name = 'title';

  const fechaIni = crearEl('input', {
    type: 'datetime-local', class: 'cal-modal__input',
    value: sStart.value,
    onInput: (e) => { sStart.value = e.target.value; },
  });
  const fechaFin = crearEl('input', {
    type: 'datetime-local', class: 'cal-modal__input',
    value: sEnd.value,
    onInput: (e) => { sEnd.value = e.target.value; },
  });

  const swAllDay = crearEl('label', { class: 'cal-modal__check' }, [
    crearEl('input', {
      type: 'checkbox', checked: sAllDay.value,
      onChange: (e) => { sAllDay.value = e.target.checked; },
    }),
    crearEl('span', null, ['Todo el día']),
  ]);
  efecto(() => {
    fechaIni.type = sAllDay.value ? 'date' : 'datetime-local';
    fechaFin.type = sAllDay.value ? 'date' : 'datetime-local';
  });

  // Selector de color
  const paleta = crearEl('div', { class: 'cal-modal__paleta' },
    COLORES.map(c => {
      const btn = crearEl('button', {
        type: 'button',
        class: 'cal-modal__color',
        style: { background: c.valor },
        title: c.etiqueta,
        onClick: () => { sColor.value = c.valor; },
      });
      efecto(() => {
        btn.classList.toggle('cal-modal__color--activo', sColor.value === c.valor);
      });
      return btn;
    }),
  );

  const taDesc = crearEl('textarea', {
    class: 'cal-modal__textarea',
    placeholder: 'Descripción (opcional)',
    rows: '3',
  });
  taDesc.value = datos.descripcion;

  const cuerpo = crearEl('div', { class: 'cal-modal__cuerpo' }, [
    inputTitulo,
    swAllDay,
    crearEl('div', { class: 'cal-modal__grid2' }, [
      campo('Inicio', fechaIni),
      campo('Fin', fechaFin),
    ]),
    campo('Color', paleta),
    campo('Descripción', taDesc),
  ]);

  let ref;
  const btnGuardar = Boton({
    texto: editando ? 'Guardar cambios' : 'Crear evento',
    variante: 'primary',
    onClick: () => {
      const titulo = inputTitulo.querySelector('input').value.trim();
      if (!titulo) {
        estadoNotificaciones.advertencia('El título es obligatorio.');
        return;
      }
      const ev = {
        id: datos.id,
        title: titulo,
        start: fromLocalInput(sStart.value, sAllDay.value),
        end: sEnd.value ? fromLocalInput(sEnd.value, sAllDay.value) : undefined,
        allDay: sAllDay.value,
        color: sColor.value,
        extendedProps: { descripcion: taDesc.value },
      };
      alGuardar(ev);
      ref.cerrar();
    },
  });
  const acciones = [btnGuardar];
  if (editando) {
    acciones.unshift(Boton({
      texto: 'Eliminar', variante: 'danger',
      onClick: async () => {
        const ok = await Aviso.confirmar({
          titulo: '¿Eliminar evento?',
          mensaje: `"${evento.title}" se borrará del calendario.`,
          txtConfirmar: 'Sí, eliminar',
          txtCancelar:  'Cancelar',
        });
        if (ok) {
          alEliminar(evento.id);
          ref.cerrar();
        }
      },
    }));
  }
  acciones.unshift(Boton({
    texto: 'Cancelar', variante: 'ghost',
    onClick: () => ref.cerrar(),
  }));

  ref = Modal.abrir({
    titulo: editando ? 'Editar evento' : 'Nuevo evento',
    cuerpo,
    pie: crearEl('div', { class: 'cal-modal__pie' }, acciones),
    tamano: 'md',
  });
  setTimeout(() => inputTitulo.querySelector('input').focus(), 50);
};

const campo = (etiqueta, control) => crearEl('label', { class: 'cal-modal__campo' }, [
  crearEl('span', { class: 'cal-modal__etiqueta' }, [etiqueta]),
  control,
]);

/* Convierte un Date / string ISO a formato `YYYY-MM-DDTHH:mm` para input. */
const toLocalInput = (val) => {
  if (!val) return '';
  const d = val instanceof Date ? val : new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
/* Reverso: del input de tipo `datetime-local` o `date` a string ISO. */
const fromLocalInput = (val, allDay) => {
  if (!val) return undefined;
  if (allDay) return val.slice(0, 10);
  return val;
};

/* ─── Componente página ────────────────────────────────────────────────── */
export default async () => {
  const eventos = senal(cargarEventos());

  /* Persistencia automática */
  efecto(() => guardarEventos(eventos.value));

  /* Refs */
  let calRef = null;       // instancia FullCalendar
  let dragRef = null;      // instancia Draggable

  /**
   * Fires DESPUÉS de que FullCalendar crea el evento al soltar la plantilla.
   * Tomamos el evento auto-creado, lo sustituimos por uno con nuestro id
   * estable y lo persistimos al store. Si no hacemos esto, el evento sólo
   * vive en memoria de FC y desaparece al recargar.
   */
  const onRecibirEvento = (info) => {
    const ev = info.event;
    const nuevo = {
      id: idNuevo(),
      title: ev.title,
      start: ev.start ? ev.start.toISOString() : undefined,
      end: ev.end ? ev.end.toISOString() : undefined,
      allDay: ev.allDay,
      color: ev.backgroundColor || ev.borderColor || '#3b82f6',
    };
    ev.remove();                          // quita el evento auto sin id estable
    eventos.value = [...eventos.value, nuevo];
    calRef?.addEvent(nuevo);              // re-añade con id propio
    estadoNotificaciones.exito('Evento añadido');
  };

  const onClickFecha = (info) => {
    abrirModalEvento({
      evento: { start: info.date, allDay: info.allDay },
      alGuardar: (ev) => {
        eventos.value = [...eventos.value, ev];
        calRef?.addEvent(ev);
      },
    });
  };

  const onClickEvento = (info) => {
    const ev = info.event;
    abrirModalEvento({
      evento: {
        id: ev.id,
        title: ev.title,
        start: ev.start,
        end: ev.end,
        color: ev.backgroundColor || ev.borderColor,
        allDay: ev.allDay,
        extendedProps: ev.extendedProps,
      },
      alGuardar: (nuevo) => {
        eventos.value = eventos.value.map(e => e.id === nuevo.id ? nuevo : e);
        ev.remove();
        calRef?.addEvent(nuevo);
      },
      alEliminar: (id) => {
        eventos.value = eventos.value.filter(e => e.id !== id);
        ev.remove();
        estadoNotificaciones.exito('Evento eliminado');
      },
    });
  };

  const onMoverEvento = (info) => {
    const ev = info.event;
    eventos.value = eventos.value.map(e => e.id === ev.id ? {
      ...e,
      start: ev.start.toISOString(),
      end: ev.end ? ev.end.toISOString() : undefined,
      allDay: ev.allDay,
    } : e);
  };

  /* Sidebar: plantillas + acciones */
  const sidebar = crearEl('aside', { class: 'cal-app__sidebar' }, [
    Boton({
      texto: '+ Crear nuevo evento',
      variante: 'primary',
      bloque: true,
      onClick: () => abrirModalEvento({
        evento: null,
        alGuardar: (ev) => {
          eventos.value = [...eventos.value, ev];
          calRef?.addEvent(ev);
        },
      }),
    }),
    crearEl('p', { class: 'cal-app__hint' }, [
      'Arrastra y suelta cualquiera de estos eventos en el calendario, o haz clic en una fecha para crear uno nuevo.',
    ]),
    crearEl('div', { class: 'cal-app__plantillas' },
      PLANTILLAS.map(p => crearEl('div', {
        class: 'fc-evento-externo cal-app__plantilla',
        'data-color': p.color,
        'data-evento': JSON.stringify({
          title: p.titulo,
          color: p.color,
          duracion: p.duracion,
        }),
      }, [
        crearEl('span', {
          class: 'cal-app__plantilla-color',
          style: { background: p.color },
          'aria-hidden': 'true',
        }),
        crearEl('span', { class: 'cal-app__plantilla-texto' }, [p.titulo]),
        crearEl('span', { class: 'cal-app__plantilla-dur' }, [p.duracion]),
      ])),
    ),
  ]);

  /* Calendario host */
  const calHost = crearEl('div', { class: 'cal-app__calendar' });
  // skeleton mientras carga FullCalendar desde CDN
  calHost.appendChild(crearEl('div', { class: 'cal-app__skeleton' }, ['Cargando calendario…']));

  /* Carga async de FullCalendar */
  CalendarioCompleto({
    eventos: eventos.value,
    aceptarDropExterno: true,
    alClickEvento: onClickEvento,
    alClickFecha: onClickFecha,
    alRecibirEvento: onRecibirEvento,
    alMoverEvento: onMoverEvento,
    alto: 'auto',
  }).then(({ contenedor, instancia }) => {
    calRef = instancia;
    calHost.replaceChildren(contenedor);
    instancia.render();
    // Activa Draggable sobre la sidebar
    hacerDraggablesExternos(sidebar.querySelector('.cal-app__plantillas'))
      .then((d) => { dragRef = d; });
  }).catch((err) => {
    console.error(err);
    calHost.replaceChildren(crearEl('div', { class: 'cal-app__error' }, [
      'No se pudo cargar el calendario. Verifica tu conexión.',
    ]));
  });

  /* Cleanup cuando la página sale del DOM */
  const root = crearEl('div', { class: 'cal-app' }, [
    crearEl('header', { class: 'cal-app__header' }, [
      crearEl('div', null, [
        crearEl('h1', { class: 'cal-app__h1' }, ['Calendario']),
        crearEl('p',  { class: 'cal-app__lead' }, [
          'Organiza tus eventos. Arrastra plantillas, mueve eventos, edita haciendo clic.',
        ]),
      ]),
    ]),
    crearEl('div', { class: 'cal-app__layout' }, [sidebar, calHost]),
  ]);

  const mo = new MutationObserver(() => {
    if (!root.isConnected) {
      try { calRef?.destroy(); } catch {}
      try { dragRef?.destroy(); } catch {}
      mo.disconnect();
    }
  });
  requestAnimationFrame(() => root.parentNode && mo.observe(root.parentNode, { childList: true }));

  return root;
};
