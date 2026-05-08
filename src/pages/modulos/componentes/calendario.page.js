import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import {
  Calendario, CalendarioCompleto, SelectorFecha, SelectorRango, PresetsRango,
} from '../../../components/ui/calendar/calendar.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { notificar } from '../../../components/ui/toast/toast.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

const stack = (...n) => crearEl('div', {
  style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
}, n);

// Helpers de demo
const conFecha = (config = {}) => {
  const sel = senal(new Date());
  const label = crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } });
  efecto(() => { label.textContent = `Seleccionado: ${sel.value?.toLocaleDateString() || 'ninguno'}`; });
  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Calendario({ valor: sel, ...config }),
    label,
  ]);
};

const conRango = () => {
  const sel = senal({ desde: null, hasta: null });
  const label = crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } });
  efecto(() => {
    const r = sel.value;
    label.textContent = r?.desde && r?.hasta
      ? `Rango: ${r.desde.toLocaleDateString()} → ${r.hasta.toLocaleDateString()}`
      : r?.desde ? `Desde: ${r.desde.toLocaleDateString()}` : 'Sin rango';
  });
  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Calendario({ valor: sel, modo: 'rango' }),
    label,
  ]);
};

const conMultiple = () => {
  const sel = senal([new Date()]);
  const label = crearEl('p', { style: { margin: 0, fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' } });
  efecto(() => { label.textContent = `${sel.value.length} días seleccionados`; });
  return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' } }, [
    Calendario({ valor: sel, modo: 'multiple' }),
    label,
  ]);
};

// Eventos demo
const eventosMockup = () => {
  const hoy = new Date();
  const mes = hoy.getMonth(), anio = hoy.getFullYear();
  const at = (d, h, m = 0) => { const x = new Date(anio, mes, d, h, m); return x; };
  return [
    { id: 1, titulo: 'Standup',                inicio: at(2, 9, 0),  color: 'info' },
    { id: 2, titulo: 'Review con cliente',     inicio: at(5, 10, 30),color: 'primary' },
    { id: 3, titulo: 'Deploy a producción',    inicio: at(5, 18, 0), color: 'danger' },
    { id: 4, titulo: 'Demo Q&A',               inicio: at(5, 14, 0), color: 'warning' },
    { id: 5, titulo: 'Workshop UI',            inicio: at(8, 11, 0), color: 'success' },
    { id: 6, titulo: '1:1 con Carlos',         inicio: at(12, 16, 0),color: 'info' },
    { id: 7, titulo: 'Presentación Board',     inicio: at(14, 9, 30),color: 'danger' },
    { id: 8, titulo: 'Cierre de sprint',       inicio: at(15, 17, 0),color: 'warning' },
    { id: 9, titulo: 'Onboarding nuevo dev',   inicio: at(18, 10, 0),color: 'success' },
    { id: 10, titulo: 'Reunión equipo',        inicio: at(22, 11, 0),color: 'primary' },
    { id: 11, titulo: 'Café con María',        inicio: at(22, 16, 0),color: 'info' },
    { id: 12, titulo: 'Revisión PRs',          inicio: at(22, 18, 0),color: 'success' },
    { id: 13, titulo: 'Retrospectiva',         inicio: at(25, 14, 0),color: 'warning' },
    { id: 14, titulo: 'Planning siguiente',    inicio: at(28, 10, 0),color: 'primary' },
  ];
};

const eventosFestivos = () => {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  return [
    { id: 'h1', titulo: 'Navidad',          inicio: new Date(anio, 11, 25), color: 'danger' },
    { id: 'h2', titulo: 'Año nuevo',        inicio: new Date(anio + 1, 0, 1), color: 'danger' },
    { id: 'h3', titulo: 'Día del trabajo',  inicio: new Date(anio, 4, 1), color: 'danger' },
  ];
};

export default async () => PaginaShowcase({
  titulo: 'Calendario',
  descripcion: 'Sistema completo: mini calendario para popovers/forms (selección día/rango/múltiple), calendario completo tipo FullCalendar con eventos y vista agenda, y selectores con popover.',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== CALENDARIO COMPLETO (lo más importante) ==============
    Seccion({
      titulo: 'Calendario completo (estilo Google Calendar / FullCalendar)',
      descripcion: 'Vista mes con eventos como bloques + vista agenda (lista cronológica). Para apps de scheduling, gestión de citas, planning de equipos. Click en un evento para abrir su detalle, click en una celda vacía para crear uno nuevo.',
      hijos: [VistaCodigo({
        vista: CalendarioCompleto({
          eventos: eventosMockup(),
          alClickEvento: (ev) => notificar.info(`Evento: ${ev.titulo}`),
          alClickDia: (d) => notificar.info(`Crear evento en ${d.toLocaleDateString()}`),
        }),
        codigo: `CalendarioCompleto({
  eventos: [
    { id: 1, titulo: 'Standup',          inicio: new Date(2026, 4, 2, 9, 0),  color: 'info' },
    { id: 2, titulo: 'Demo Q&A',         inicio: new Date(2026, 4, 5, 14, 0), color: 'warning' },
    { id: 3, titulo: 'Deploy producción',inicio: new Date(2026, 4, 5, 18, 0), color: 'danger' },
  ],
  alClickEvento: (ev) => abrirDetalle(ev),
  alClickDia:    (fecha) => abrirCreador(fecha),
})

// Toggle entre Mes / Agenda en la cabecera
// Click "Hoy" para volver al mes actual
// Click flechas para navegar`,
      })],
    }),

    // ============== CALENDARIO COMPLETO CON FESTIVOS ==============
    Seccion({
      titulo: 'Calendario completo · sólo festivos',
      descripcion: 'Mismo componente con menos densidad — útil para mostrar vacaciones, días no laborales, deadlines aislados.',
      hijos: [VistaCodigo({
        vista: CalendarioCompleto({
          eventos: eventosFestivos(),
          altura: '480px',
        }),
        codigo: `CalendarioCompleto({
  eventos: [
    { titulo: 'Navidad', inicio: new Date(2026, 11, 25), color: 'danger' },
    { titulo: 'Año nuevo', inicio: new Date(2027, 0, 1), color: 'danger' },
  ],
})`,
      })],
    }),

    // ============== MINI CALENDARIO — DÍA ==============
    Seccion({
      titulo: 'Mini · selección de día',
      descripcion: 'Calendario compacto para sidebars, popovers o formularios. El estado vive en una `senal` reactiva.',
      hijos: [VistaCodigo({
        vista: conFecha(),
        codigo: `const sel = senal(new Date());
Calendario({ modo: 'dia', valor: sel })

efecto(() => console.log('Cambió a:', sel.value));`,
      })],
    }),

    // ============== MINI CALENDARIO — RANGO ==============
    Seccion({
      titulo: 'Mini · selección de rango',
      descripcion: 'Click en el primer día = inicio. Click en el segundo = fin. Días intermedios se resaltan automáticamente.',
      hijos: [VistaCodigo({
        vista: conRango(),
        codigo: `const sel = senal({ desde: null, hasta: null });
Calendario({ modo: 'rango', valor: sel })`,
      })],
    }),

    // ============== MINI CALENDARIO — MÚLTIPLE ==============
    Seccion({
      titulo: 'Mini · selección múltiple',
      descripcion: 'Selecciona varios días no contiguos (fechas de un evento recurrente, días bloqueados, etc.).',
      hijos: [VistaCodigo({
        vista: conMultiple(),
        codigo: `const sel = senal([]);
Calendario({ modo: 'multiple', valor: sel })

// sel.value === Date[]`,
      })],
    }),

    // ============== CON EVENTOS (mini con dots) ==============
    Seccion({
      titulo: 'Mini · días marcados',
      descripcion: '`diasMarcados` muestra un dot bajo el número en el mini calendario. Útil cuando sólo quieres indicar que hay actividad ese día sin ver el detalle.',
      hijos: [VistaCodigo({
        vista: (() => {
          const hoy = new Date();
          const m = hoy.getMonth(), a = hoy.getFullYear();
          return conFecha({ diasMarcados: [
            { fecha: new Date(a, m, 5),  color: 'success' },
            { fecha: new Date(a, m, 12), color: 'danger' },
            { fecha: new Date(a, m, 18), color: 'info' },
            { fecha: new Date(a, m, 22), color: 'warning' },
          ]});
        })(),
        codigo: `Calendario({
  diasMarcados: [
    { fecha: new Date(2026, 4, 5),  color: 'success' },
    { fecha: new Date(2026, 4, 12), color: 'danger' },
  ],
})`,
      })],
    }),

    // ============== MIN/MAX + DESHABILITADOS ==============
    Seccion({
      titulo: 'Mini · restricciones (mín/máx + deshabilitados)',
      descripcion: 'Rango de fechas válido + función para bloquear días específicos (festivos, fines de semana, etc.).',
      hijos: [VistaCodigo({
        vista: (() => {
          const min = new Date();
          const max = new Date(); max.setDate(max.getDate() + 30);
          return conFecha({
            minFecha: min, maxFecha: max,
            diasDeshabilitados: (d) => d.getDay() === 0 || d.getDay() === 6,
          });
        })(),
        codigo: `Calendario({
  minFecha: new Date(),                    // hoy en adelante
  maxFecha: new Date(...),                 // hasta cierta fecha
  diasDeshabilitados: (d) => d.getDay() === 0 || d.getDay() === 6,  // sin fines de semana
})`,
      })],
    }),

    // ============== SELECTOR DE FECHA (POPOVER) ==============
    Seccion({
      titulo: 'SelectorFecha — input + popover',
      descripcion: 'El patrón estándar para formularios. Input de sólo lectura que abre el calendario al hacer click; cierra al click fuera.',
      hijos: [VistaCodigo({
        vista: stack(
          SelectorFecha({ placeholder: 'Fecha de nacimiento' }),
          SelectorFecha({ placeholder: 'Sólo futuros', minFecha: new Date() }),
          SelectorFecha({ placeholder: 'Sin fines de semana',
            diasDeshabilitados: (d) => d.getDay() === 0 || d.getDay() === 6 }),
        ),
        codigo: `SelectorFecha({ placeholder: 'Fecha de nacimiento' })

SelectorFecha({ minFecha: new Date() })   // sólo futuros

SelectorFecha({
  diasDeshabilitados: (d) => d.getDay() === 0 || d.getDay() === 6,
})`,
      })],
    }),

    // ============== SELECTOR DE RANGO ==============
    Seccion({
      titulo: 'SelectorRango — con presets',
      descripcion: 'Para filtros de dashboard, reportes, reservas. Popover ancho con sidebar de presets (Hoy, Esta semana, Últimos 30 días…) + calendario rango.',
      hijos: [VistaCodigo({
        vista: SelectorRango({ conPresets: true }),
        codigo: `SelectorRango({ conPresets: true })
// Presets: Hoy · Ayer · Esta semana · Últimos 7/30/90 días · Este mes`,
      })],
    }),

    // ============== PRESETS SOLOS ==============
    Seccion({
      titulo: 'PresetsRango — botones rápidos solos',
      descripcion: 'Cuando sólo necesitas atajos sin el calendario. Cada botón devuelve un `{desde, hasta}` listo para tu filtro.',
      hijos: [VistaCodigo({
        vista: PresetsRango({
          alSeleccionar: (rango) => notificar.info(
            `${rango.desde.toLocaleDateString()} → ${rango.hasta.toLocaleDateString()}`
          ),
        }),
        codigo: `PresetsRango({
  alSeleccionar: (rango) => {
    // rango = { desde: Date, hasta: Date }
    cargarDatos(rango);
  },
})`,
      })],
    }),

    // ============== CASOS DE USO ==============
    Seccion({
      titulo: 'Cuándo usar cada uno',
      hijos: [VistaCodigo({
        vista: stack(
          crearEl('div', { style: { padding: 'var(--space-3)', background: 'var(--surface-muted)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)' } }, [
            crearEl('strong', null, ['Calendario completo (CalendarioCompleto)']),
            crearEl('p', { style: { margin: '4px 0 0' } }, ['Apps de scheduling, gestión de equipos, agendas. Cuando los eventos son la información principal.']),
            crearEl('ul', { style: { margin: '6px 0 0', paddingInlineStart: '1.2rem', color: 'var(--muted-foreground)' } }, [
              crearEl('li', null, ['CRMs (calendario de actividades del equipo)']),
              crearEl('li', null, ['Sistemas de citas (clínicas, peluquerías)']),
              crearEl('li', null, ['Project management (deadlines, sprints, milestones)']),
              crearEl('li', null, ['Booking de salas / recursos']),
            ]),
          ]),
          crearEl('div', { style: { padding: 'var(--space-3)', background: 'var(--surface-muted)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)' } }, [
            crearEl('strong', null, ['Mini calendario (Calendario)']),
            crearEl('p', { style: { margin: '4px 0 0' } }, ['Cuando la fecha es input de algo más. No es la información principal.']),
            crearEl('ul', { style: { margin: '6px 0 0', paddingInlineStart: '1.2rem', color: 'var(--muted-foreground)' } }, [
              crearEl('li', null, ['Sidebars con resumen del mes']),
              crearEl('li', null, ['Date picker de formularios (vía SelectorFecha)']),
              crearEl('li', null, ['Filtros de fecha en listados (vía SelectorRango)']),
            ]),
          ]),
        ),
        codigo: `// Decisión rápida:
// ¿Los EVENTOS son el contenido principal de la pantalla?
//   Sí → CalendarioCompleto (vista mes/agenda con bloques)
//   No → Calendario / SelectorFecha / SelectorRango (mini)

// ¿El usuario sólo elige una fecha para enviar en un form?
//   → SelectorFecha o SelectorRango (popover)`,
      })],
    }),
  ],
});
