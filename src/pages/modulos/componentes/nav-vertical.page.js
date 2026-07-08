import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers — bloques de la app mockeada
// ============================================================================
const brand = (texto = 'template-vanilla') => crearEl('div', { class: 'mock-brand' }, [
  crearEl('span', { class: 'mock-brand__logo' }, ['L']),
  crearEl('span', null, [texto]),
]);

const sidebarItem = ({ icono, etiqueta, activo, badge }) => crearEl('a', {
  href: '#', class: 'mock-sidebar__item sin-decoracion',
  'data-activo': activo ? 'true' : null,
}, [
  crearEl('span', { class: 'mock-sidebar__item-icono' }, [Icono(icono, { tamano: 16 })]),
  crearEl('span', null, [etiqueta]),
  badge && crearEl('span', { class: 'mock-sidebar__item-badge' }, [badge]),
]);

const sidebarLabel = (txt) => crearEl('span', { class: 'mock-sidebar__label' }, [txt]);

const topbarBasico = () => crearEl('div', { class: 'mock-topbar' }, [
  crearEl('div', { class: 'mock-search' }, [
    crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 14 })]),
    crearEl('span', { class: 'mock-search__placeholder' }, ['Buscar…']),
    crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
  ]),
  crearEl('div', { class: 'mock-topbar__acciones' }, [
    crearEl('button', { class: 'mock-icono-btn' }, [Icono('campana', { tamano: 18 })]),
    crearEl('div', { class: 'mock-avatar' }, ['MG']),
  ]),
]);

const contentSkeleton = () => crearEl('div', { class: 'mock-content' }, [
  crearEl('div', { class: 'mock-skel mock-skel--titulo' }),
  crearEl('div', { class: 'mock-skel mock-skel--row' }, [
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
  ]),
  crearEl('div', { class: 'mock-skel mock-skel--texto' }),
  crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '70%' } }),
  crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '50%' } }),
]);

// ============================================================================
//  1. Sidebar completo (default template-vanilla)
// ============================================================================
const sidebarCompleto = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-layout' }, [
    crearEl('aside', { class: 'mock-sidebar' }, [
      brand(),
      crearEl('div', { class: 'mock-sidebar__seccion' }, [
        sidebarItem({ icono: 'panel',     etiqueta: 'Dashboard', activo: true }),
        sidebarItem({ icono: 'analitica', etiqueta: 'Analítica' }),
        sidebarItem({ icono: 'eventos',   etiqueta: 'Calendario' }),
        sidebarItem({ icono: 'chat',      etiqueta: 'Mensajes', badge: '3' }),
      ]),
      crearEl('div', { class: 'mock-sidebar__seccion' }, [
        sidebarLabel('Comercio'),
        sidebarItem({ icono: 'productos', etiqueta: 'Productos' }),
        sidebarItem({ icono: 'pedidos',   etiqueta: 'Pedidos', badge: '12' }),
        sidebarItem({ icono: 'clientes',  etiqueta: 'Clientes' }),
      ]),
      crearEl('div', { class: 'mock-sidebar__seccion' }, [
        sidebarLabel('Configuración'),
        sidebarItem({ icono: 'utilidades',  etiqueta: 'Ajustes' }),
        sidebarItem({ icono: 'grupos',      etiqueta: 'Equipo' }),
      ]),
    ]),
    crearEl('div', { class: 'mock-layout__main' }, [
      topbarBasico(),
      contentSkeleton(),
    ]),
  ]),
]);

// ============================================================================
//  2. Mini sidebar (sólo iconos)
// ============================================================================
const sidebarMini = () => {
  const miniItem = (icono, activo = false) => crearEl('button', {
    type: 'button', class: 'mock-sidebar-mini__item',
    'data-activo': activo ? 'true' : null,
  }, [Icono(icono, { tamano: 18 })]);

  return crearEl('div', { class: 'mock-app' }, [
    crearEl('div', { class: 'mock-layout' }, [
      crearEl('aside', { class: 'mock-sidebar mock-sidebar--mini' }, [
        crearEl('span', { class: 'mock-brand__logo' }, ['L']),
        crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px', marginBlockStart: 'var(--space-3)' } }, [
          miniItem('panel', true),
          miniItem('analitica'),
          miniItem('eventos'),
          miniItem('chat'),
          miniItem('productos'),
          miniItem('pedidos'),
        ]),
        crearEl('div', { style: { marginBlockStart: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' } }, [
          miniItem('utilidades'),
          crearEl('div', { class: 'mock-avatar mock-avatar--xs' }, ['MG']),
        ]),
      ]),
      crearEl('div', { class: 'mock-layout__main' }, [
        topbarBasico(),
        contentSkeleton(),
      ]),
    ]),
  ]);
};

// ============================================================================
//  3. Sidebar con workspace switcher + perfil abajo
// ============================================================================
const sidebarConPerfil = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-layout' }, [
    crearEl('aside', { class: 'mock-sidebar', style: { padding: 0 } }, [
      // Workspace switcher (top)
      crearEl('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: 'var(--space-3)',
          borderBlockEnd: '1px solid var(--border)',
          cursor: 'pointer',
        },
      }, [
        crearEl('span', { class: 'mock-brand__logo' }, ['A']),
        crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['Acme Inc.']),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, ['Plan Pro · 12 miembros']),
        ]),
        Icono('chevron_v', { tamano: 14 }),
      ]),
      // Search en sidebar
      crearEl('div', { style: { padding: 'var(--space-2) var(--space-3)' } }, [
        crearEl('div', { class: 'mock-search', style: { width: '100%', maxWidth: 'none', height: '32px' } }, [
          crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 13 })]),
          crearEl('span', { class: 'mock-search__placeholder' }, ['Buscar…']),
        ]),
      ]),
      // Items de navegación
      crearEl('div', { style: { padding: '0 var(--space-3)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' } }, [
        crearEl('div', { class: 'mock-sidebar__seccion' }, [
          sidebarItem({ icono: 'panel',     etiqueta: 'Dashboard', activo: true }),
          sidebarItem({ icono: 'proyectos', etiqueta: 'Proyectos' }),
          sidebarItem({ icono: 'eventos',   etiqueta: 'Calendario' }),
          sidebarItem({ icono: 'chat',      etiqueta: 'Mensajes', badge: '3' }),
        ]),
        crearEl('div', { class: 'mock-sidebar__seccion' }, [
          sidebarLabel('Favoritos'),
          sidebarItem({ icono: 'estrella', etiqueta: 'template-vanilla Web' }),
          sidebarItem({ icono: 'estrella', etiqueta: 'API Core' }),
        ]),
      ]),
      // Perfil abajo
      crearEl('div', {
        style: {
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: 'var(--space-3)',
          borderBlockStart: '1px solid var(--border)',
          cursor: 'pointer',
        },
      }, [
        crearEl('div', { class: 'mock-avatar' }, ['MG']),
        crearEl('div', { style: { flex: 1, minWidth: 0 } }, [
          crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 600 } }, ['María García']),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, ['maria@template-vanilla.dev']),
        ]),
        crearEl('button', { class: 'mock-icono-btn', style: { width: '28px', height: '28px' } }, [Icono('utilidades', { tamano: 14 })]),
      ]),
    ]),
    crearEl('div', { class: 'mock-layout__main' }, [
      topbarBasico(),
      contentSkeleton(),
    ]),
  ]),
]);

// ============================================================================
//  4. Sidebar oscuro (dark sidebar style — Linear, Vercel)
// ============================================================================
const sidebarOscuro = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-layout' }, [
    crearEl('aside', {
      class: 'mock-sidebar',
      style: {
        background: '#0a0a0a',
        borderInlineEndColor: '#1f1f1f',
        color: '#fff',
      },
    }, [
      crearEl('div', { class: 'mock-brand', style: { color: '#fff' } }, [
        crearEl('span', { class: 'mock-brand__logo', style: { background: '#fff', color: '#000' } }, ['L']),
        crearEl('span', null, ['template-vanilla']),
      ]),
      crearEl('div', { class: 'mock-sidebar__seccion' }, [
        ...['Dashboard', 'Proyectos', 'Tareas', 'Equipo', 'Reportes'].map((t, i) => crearEl('a', {
          href: '#', class: 'mock-sidebar__item sin-decoracion',
          'data-activo': i === 0 ? 'true' : null,
          style: i === 0
            ? { background: 'rgba(255,255,255,0.08)', color: '#fff' }
            : { color: 'rgba(255,255,255,0.6)' },
        }, [
          crearEl('span', { class: 'mock-sidebar__item-icono' },
            [Icono(['panel', 'proyectos', 'reportes', 'grupos', 'analitica'][i], { tamano: 16 })]),
          crearEl('span', null, [t]),
        ])),
      ]),
    ]),
    crearEl('div', { class: 'mock-layout__main' }, [
      topbarBasico(),
      contentSkeleton(),
    ]),
  ]),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Navbar Vertical',
  descripcion: 'Sidebar fijo a la izquierda + topbar. Layout activo por defecto en template-vanilla. 4 patrones reales: completo con secciones, mini sólo-iconos, con workspace switcher + perfil abajo, y dark sidebar estilo Linear.',
  decoracion: corner1(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Sidebar completo (template-vanilla default)',
      descripcion: 'Patrón estándar SaaS — brand arriba, items agrupados por sección con label uppercase. Items con icono + etiqueta y badge opcional para counts (mensajes, pedidos pendientes).',
      hijos: [VistaCodigo({
        vista: sidebarCompleto(),
        codigo: `crearEl('aside', { class: 'mock-sidebar' }, [
  brand('template-vanilla'),

  crearEl('div', { class: 'mock-sidebar__seccion' }, [
    sidebarItem({ icono: 'panel',     etiqueta: 'Dashboard', activo: true }),
    sidebarItem({ icono: 'analitica', etiqueta: 'Analítica' }),
    sidebarItem({ icono: 'chat',      etiqueta: 'Mensajes', badge: '3' }),
  ]),

  crearEl('div', { class: 'mock-sidebar__seccion' }, [
    sidebarLabel('Comercio'),
    sidebarItem({ icono: 'productos', etiqueta: 'Productos' }),
    sidebarItem({ icono: 'pedidos',   etiqueta: 'Pedidos', badge: '12' }),
  ]),
])

estadoUi.posicionNav.value = 'vertical';`,
      })],
    }),

    Seccion({
      titulo: '2 · Mini sidebar (sólo iconos)',
      descripcion: 'Versión colapsada que ahorra espacio horizontal — sólo iconos, tooltips al hover. El logo de la marca arriba, perfil abajo. Patrón de Discord, VS Code.',
      hijos: [VistaCodigo({
        vista: sidebarMini(),
        codigo: `crearEl('aside', { class: 'mock-sidebar mock-sidebar--mini' }, [
  brandLogo,
  ['panel', 'analitica', 'eventos', 'chat'].map(icono =>
    crearEl('button', { class: 'mock-sidebar-mini__item' },
      [Icono(icono, { tamano: 18 })])),
])

estadoUi.barraFijada.value = false;  // contraído por defecto`,
      })],
    }),

    Seccion({
      titulo: '3 · Con workspace switcher + perfil',
      descripcion: 'Sidebar de productividad — workspace switcher arriba (Acme Inc.), search dentro del sidebar, items, y perfil clickeable abajo. Patrón de Slack, Linear, Notion.',
      hijos: [VistaCodigo({
        vista: sidebarConPerfil(),
        codigo: `crearEl('aside', { class: 'mock-sidebar' }, [
  workspaceSwitcher,                          // logo + nombre + chevron
  searchEnSidebar,                            // input search
  crearEl('div', null, [
    sidebarItem({ icono, etiqueta, activo }),
    // ...
  ]),
  perfilAbajo,                                // avatar + email + settings
])`,
      })],
    }),

    Seccion({
      titulo: '4 · Dark sidebar (Linear / Vercel)',
      descripcion: 'Sidebar oscuro independiente del tema general. Da una sensación de "panel de control" más serio. El contenido principal mantiene el tema (claro u oscuro).',
      hijos: [VistaCodigo({
        vista: sidebarOscuro(),
        codigo: `// Sidebar oscuro forzado
crearEl('aside', { class: 'mock-sidebar', style: {
  background: '#0a0a0a',
  borderInlineEndColor: '#1f1f1f',
  color: '#fff',
} }, [...])

// Items con opacidad escalonada — los inactivos son más tenues`,
      })],
    }),

  ],
});
