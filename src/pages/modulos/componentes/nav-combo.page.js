import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers
// ============================================================================
const brand = (texto = 'Launchpad') => crearEl('div', { class: 'mock-brand' }, [
  crearEl('span', { class: 'mock-brand__logo' }, ['L']),
  crearEl('span', null, [texto]),
]);

const iconoBtn = (icono, ping = false) => crearEl('button', {
  type: 'button', class: 'mock-icono-btn',
  'data-ping': ping ? 'true' : null,
}, [Icono(icono, { tamano: 18 })]);

const avatar = (txt) => crearEl('div', { class: 'mock-avatar' }, [txt]);

const miniItem = (icono, activo = false) => crearEl('button', {
  type: 'button', class: 'mock-sidebar-mini__item',
  'data-activo': activo ? 'true' : null,
}, [Icono(icono, { tamano: 18 })]);

const contentBlocks = () => crearEl('div', { class: 'mock-content' }, [
  crearEl('div', { class: 'mock-skel mock-skel--titulo' }),
  crearEl('div', { class: 'mock-skel mock-skel--row' }, [
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
  ]),
  crearEl('div', { class: 'mock-skel mock-skel--texto' }),
  crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '70%' } }),
]);

// ============================================================================
//  1. Combo clásico — topbar + mini sidebar
// ============================================================================
const comboClasico = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { class: 'mock-search', style: { flex: 1, maxWidth: '420px', marginInlineStart: 'var(--space-5)' } }, [
      crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 14 })]),
      crearEl('span', { class: 'mock-search__placeholder' }, ['Buscar…']),
      crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('campana', true),
      avatar('MG'),
    ]),
  ]),
  crearEl('div', { class: 'mock-layout' }, [
    crearEl('aside', { class: 'mock-sidebar mock-sidebar--mini' }, [
      crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, [
        miniItem('panel', true),
        miniItem('analitica'),
        miniItem('eventos'),
        miniItem('chat'),
        miniItem('productos'),
        miniItem('pedidos'),
        miniItem('grupos'),
      ]),
      crearEl('div', { style: { marginBlockStart: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' } }, [
        miniItem('utilidades'),
        miniItem('faq'),
      ]),
    ]),
    crearEl('div', { class: 'mock-layout__main' }, [contentBlocks()]),
  ]),
]);

// ============================================================================
//  2. Combo con secciones (Discord-style)
// ============================================================================
const comboDiscord = () => {
  const serverItem = (txt, activo = false, color = '#5865f2') => crearEl('button', {
    type: 'button',
    style: {
      width: '40px', height: '40px',
      borderRadius: activo ? '14px' : '50%',
      background: activo ? color : 'color-mix(in srgb, var(--foreground) 8%, transparent)',
      color: activo ? '#fff' : 'var(--foreground)',
      border: 0, cursor: 'pointer',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: '0.75rem',
      transition: 'border-radius 200ms ease, background 200ms ease',
    },
  }, [txt]);

  return crearEl('div', { class: 'mock-app' }, [
    crearEl('div', { class: 'mock-layout' }, [
      // Mini sidebar de servidores (extra angosto, oscuro)
      crearEl('aside', {
        style: {
          width: '64px',
          background: '#0e0e10',
          borderInlineEnd: '1px solid #1f1f22',
          padding: 'var(--space-2) 0',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        },
      }, [
        serverItem('A', true, '#5865f2'),
        crearEl('div', { style: { width: '32px', height: '2px', background: 'rgba(255,255,255,0.1)' } }),
        serverItem('B', false, '#10b981'),
        serverItem('C', false, '#f59e0b'),
        serverItem('D', false, '#ef4444'),
        serverItem('E', false, '#8b5cf6'),
        crearEl('button', {
          type: 'button',
          style: {
            width: '40px', height: '40px',
            borderRadius: '50%',
            background: 'color-mix(in srgb, #10b981 14%, transparent)',
            color: '#10b981',
            border: 0, cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          },
        }, [Icono('mas', { tamano: 18 })]),
      ]),
      // Sidebar de canales del server activo
      crearEl('aside', {
        style: {
          width: '220px',
          background: '#1a1a1d',
          borderInlineEnd: '1px solid #1f1f22',
          color: '#fff',
          padding: 'var(--space-3)',
          display: 'flex', flexDirection: 'column', gap: 'var(--space-3)',
        },
      }, [
        crearEl('strong', { style: { fontSize: 'var(--text-sm)' } }, ['Acme Inc.']),
        crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, [
          ...['#general', '#diseño', '#engineering', '#random'].map((t, i) => crearEl('div', {
            style: {
              padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              background: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: i === 0 ? '#fff' : 'rgba(255,255,255,0.6)',
              fontSize: 'var(--text-sm)', cursor: 'pointer',
            },
          }, [t])),
        ]),
        crearEl('span', { style: { fontSize: '0.6875rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em', marginBlockStart: 'var(--space-2)' } }, ['Voz']),
        crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, [
          ...['🔊 General voice', '🔊 Meeting room'].map((t) => crearEl('div', {
            style: {
              padding: '6px 8px', borderRadius: 'var(--radius-sm)',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 'var(--text-sm)', cursor: 'pointer',
            },
          }, [t])),
        ]),
      ]),
      // Contenido (chat-style)
      crearEl('div', { class: 'mock-layout__main' }, [
        crearEl('div', { class: 'mock-topbar' }, [
          crearEl('strong', null, ['# general']),
          crearEl('div', { class: 'mock-topbar__acciones' }, [
            iconoBtn('busqueda'),
            avatar('MG'),
          ]),
        ]),
        crearEl('div', { class: 'mock-content' }, [
          crearEl('div', { class: 'mock-skel mock-skel--row' }, [
            crearEl('div', { class: 'mock-skel mock-skel--card' }),
          ]),
          crearEl('div', { class: 'mock-skel mock-skel--row' }, [
            crearEl('div', { class: 'mock-skel mock-skel--card' }),
          ]),
        ]),
      ]),
    ]),
  ]);
};

// ============================================================================
//  3. Combo expansible (sidebar mini que se expande al hover)
// ============================================================================
const comboExpansible = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: { flex: 1 } }),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('campana', true),
      avatar('MG'),
    ]),
  ]),
  crearEl('div', { class: 'mock-layout' }, [
    crearEl('aside', {
      class: 'mock-sidebar',
      style: {
        width: '220px',
        position: 'relative',
      },
    }, [
      crearEl('span', {
        style: {
          position: 'absolute',
          insetBlockStart: '12px',
          insetInlineEnd: '-12px',
          width: '24px', height: '24px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '50%',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--muted-foreground)',
          cursor: 'pointer',
          zIndex: 1,
          boxShadow: 'var(--shadow-sm)',
        },
      }, [Icono('chevron_l', { tamano: 12 })]),
      crearEl('div', { class: 'mock-sidebar__seccion' }, [
        crearEl('a', { href: '#', class: 'mock-sidebar__item sin-decoracion', 'data-activo': 'true' }, [
          crearEl('span', { class: 'mock-sidebar__item-icono' }, [Icono('panel', { tamano: 16 })]),
          crearEl('span', null, ['Dashboard']),
        ]),
        ...['Proyectos', 'Tareas', 'Mensajes', 'Equipo'].map((t, i) => crearEl('a', {
          href: '#', class: 'mock-sidebar__item sin-decoracion',
        }, [
          crearEl('span', { class: 'mock-sidebar__item-icono' },
            [Icono(['proyectos', 'pedidos', 'chat', 'grupos'][i], { tamano: 16 })]),
          crearEl('span', null, [t]),
        ])),
      ]),
    ]),
    crearEl('div', { class: 'mock-layout__main' }, [contentBlocks()]),
  ]),
  crearEl('div', {
    style: {
      padding: '8px var(--space-4)',
      fontSize: 'var(--text-xs)',
      color: 'var(--muted-foreground)',
      background: 'color-mix(in srgb, var(--foreground) 3%, var(--surface))',
      borderBlockStart: '1px solid var(--border)',
      textAlign: 'center',
    },
  }, ['💡 Click en el chevron para colapsar a mini sidebar (sólo iconos)']),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Combo Nav',
  descripcion: 'Topbar + sidebar contraído (sólo iconos). Híbrido que combina lo mejor de ambos: marca arriba + navegación lateral compacta. 3 patrones: combo clásico (topbar global + mini sidebar), Discord-style (doble sidebar — servers + canales), y expansible (toggle entre completo y mini).',
  decoracion: corner4(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Combo clásico',
      descripcion: 'Topbar arriba con marca + search + acciones. Mini sidebar a la izquierda sólo con iconos (tooltips al hover). Aprovecha el espacio horizontal de la pantalla — muy productivo en monitores grandes.',
      hijos: [VistaCodigo({
        vista: comboClasico(),
        codigo: `estadoUi.posicionNav.value = 'combo';
estadoUi.barraFijada.value = false;     // sidebar colapsado por defecto

// Layout: topbar arriba + mini sidebar (64px) + contenido`,
      })],
    }),

    Seccion({
      titulo: '2 · Discord-style (doble sidebar)',
      descripcion: 'Mini sidebar oscuro de "espacios" (servidores, workspaces) + sidebar normal con los items del espacio activo. Patrón de Discord, Slack, Microsoft Teams.',
      hijos: [VistaCodigo({
        vista: comboDiscord(),
        codigo: `// Sidebar 1 — workspaces/servidores (64px, oscuro)
crearEl('aside', { style: { width: '64px', background: '#0e0e10' } }, [
  serverItem('A', true),                  // workspace activo (rounded square)
  serverItem('B'),                        // inactivos (circulares)
  // ...
])

// Sidebar 2 — canales del workspace activo
crearEl('aside', { style: { width: '220px', background: '#1a1a1d' } }, [
  ['#general', '#diseño', '#engineering'].map(...),
])`,
      })],
    }),

    Seccion({
      titulo: '3 · Expansible (toggle completo / mini)',
      descripcion: 'Sidebar normal con un botón circular en el borde para colapsar a mini. El usuario alterna según necesite más espacio para el contenido. Patrón de VS Code, Notion.',
      hijos: [VistaCodigo({
        vista: comboExpansible(),
        codigo: `// Botón circular flotando en el borde derecho del sidebar
crearEl('span', { style: {
  position: 'absolute',
  insetInlineEnd: '-12px',
  width: '24px', height: '24px',
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: '50%',
} }, [Icono('chevron_l')])

// Click → estadoUi.barraFijada.value = !estadoUi.barraFijada.value;`,
      })],
    }),

  ],
});
