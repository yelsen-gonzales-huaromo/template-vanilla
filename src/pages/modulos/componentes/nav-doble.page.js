import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers
// ============================================================================
const brand = (texto = 'template-vanilla') => crearEl('div', { class: 'mock-brand' }, [
  crearEl('span', { class: 'mock-brand__logo' }, ['L']),
  crearEl('span', null, [texto]),
]);

const iconoBtn = (icono, ping = false) => crearEl('button', {
  type: 'button', class: 'mock-icono-btn',
  'data-ping': ping ? 'true' : null,
}, [Icono(icono, { tamano: 18 })]);

const avatar = (txt) => crearEl('div', { class: 'mock-avatar' }, [txt]);

const navLink = (texto, activo = false, opts = {}) => crearEl('a', {
  href: '#', class: 'sin-decoracion',
  style: {
    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
    color: activo ? 'var(--foreground)' : 'var(--muted-foreground)',
    fontSize: 'var(--text-sm)', fontWeight: activo ? 600 : 500,
    textDecoration: 'none',
    ...opts,
  },
}, [texto]);

const tabUnderline = (texto, activo = false) => crearEl('a', {
  href: '#', class: 'sin-decoracion',
  style: {
    padding: '12px 12px',
    borderBlockEnd: activo ? '2px solid var(--primary)' : '2px solid transparent',
    color: activo ? 'var(--foreground)' : 'var(--muted-foreground)',
    fontSize: 'var(--text-sm)', fontWeight: activo ? 600 : 500,
    textDecoration: 'none',
    marginBlockEnd: '-1px',
  },
}, [texto]);

const contentBlocks = () => crearEl('div', { class: 'mock-content' }, [
  crearEl('div', { class: 'mock-skel mock-skel--titulo' }),
  crearEl('div', { class: 'mock-skel mock-skel--row' }, [
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
  ]),
  crearEl('div', { class: 'mock-skel mock-skel--texto' }),
  crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '60%' } }),
]);

// ============================================================================
//  1. Branding bar + nav contextual
// ============================================================================
const dobleBrandingNav = () => crearEl('div', { class: 'mock-app' }, [
  // Barra 1: branding global (oscura, fina)
  crearEl('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: '8px var(--space-4)',
      background: '#0a0a0a',
      borderBlockEnd: '1px solid #1f1f1f',
      color: '#fff',
      fontSize: 'var(--text-xs)',
      minHeight: '40px',
    },
  }, [
    crearEl('div', { class: 'mock-brand', style: { color: '#fff' } }, [
      crearEl('span', { class: 'mock-brand__logo', style: { background: '#fff', color: '#000', width: '22px', height: '22px', fontSize: '0.625rem' } }, ['L']),
      crearEl('span', { style: { fontSize: 'var(--text-xs)' } }, ['template-vanilla']),
    ]),
    crearEl('span', { style: { color: 'rgba(255,255,255,0.4)' } }, ['/']),
    crearEl('a', { href: '#', style: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' } }, ['Acme Inc.']),
    crearEl('div', { style: { flex: 1 } }),
    crearEl('a', { href: '#', style: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' } }, ['Soporte']),
    crearEl('a', { href: '#', style: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' } }, ['Estado']),
    crearEl('a', { href: '#', style: { color: 'rgba(255,255,255,0.7)', textDecoration: 'none' } }, ['Docs']),
  ]),
  // Barra 2: nav contextual (clara, normal)
  crearEl('div', { class: 'mock-topbar' }, [
    crearEl('div', { style: { display: 'flex', gap: '4px' } }, [
      navLink('Dashboard', true),
      navLink('Proyectos'),
      navLink('Tareas'),
      navLink('Equipo'),
      navLink('Reportes'),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      crearEl('div', { class: 'mock-search', style: { width: '220px' } }, [
        crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 14 })]),
        crearEl('span', { class: 'mock-search__placeholder' }, ['Buscar…']),
      ]),
      iconoBtn('campana', true),
      avatar('MG'),
    ]),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  2. Nav global + tabs de página
// ============================================================================
const dobleGlobalTabs = () => crearEl('div', { class: 'mock-app' }, [
  // Barra 1: nav global con todas las secciones
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
      navLink('Inicio'),
      navLink('Productos', true, { background: 'var(--muted)' }),
      navLink('Clientes'),
      navLink('Pagos'),
      navLink('Reportes'),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('busqueda'),
      iconoBtn('campana'),
      avatar('MG'),
    ]),
  ]),
  // Barra 2: tabs underline de la página actual
  crearEl('div', {
    style: {
      display: 'flex', alignItems: 'center', gap: '4px',
      padding: '0 var(--space-4)',
      background: 'var(--surface)',
      borderBlockEnd: '1px solid var(--border)',
    },
  }, [
    tabUnderline('Catálogo', true),
    tabUnderline('Inventario'),
    tabUnderline('Categorías'),
    tabUnderline('Atributos'),
    tabUnderline('Reseñas'),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  3. Branding + breadcrumbs
// ============================================================================
const dobleBreadcrumbs = () => crearEl('div', { class: 'mock-app' }, [
  // Barra 1: marca + acciones globales
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { class: 'mock-search', style: { flex: 1, maxWidth: '420px', marginInlineStart: 'var(--space-5)' } }, [
      crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 14 })]),
      crearEl('span', { class: 'mock-search__placeholder' }, ['Buscar en todo el workspace…']),
      crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('campana', true),
      iconoBtn('utilidades'),
      avatar('SL'),
    ]),
  ]),
  // Barra 2: breadcrumbs + acciones de la página
  crearEl('div', {
    style: {
      display: 'flex', alignItems: 'center',
      padding: '10px var(--space-4)',
      background: 'color-mix(in srgb, var(--foreground) 3%, var(--surface))',
      borderBlockEnd: '1px solid var(--border)',
      gap: 'var(--space-3)',
    },
  }, [
    crearEl('div', { style: {
      display: 'flex', alignItems: 'center', gap: '6px',
      fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', flex: 1,
    } }, [
      Icono('panel', { tamano: 14 }),
      crearEl('a', { href: '#', style: { color: 'var(--muted-foreground)', textDecoration: 'none' } }, ['Workspace']),
      crearEl('span', { style: { opacity: 0.4 } }, ['/']),
      crearEl('a', { href: '#', style: { color: 'var(--muted-foreground)', textDecoration: 'none' } }, ['Proyectos']),
      crearEl('span', { style: { opacity: 0.4 } }, ['/']),
      crearEl('span', { style: { color: 'var(--foreground)', fontWeight: 600 } }, ['template-vanilla Web']),
    ]),
    crearEl('button', {
      type: 'button',
      style: {
        padding: '6px 12px', fontSize: 'var(--text-xs)', fontWeight: 600,
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', color: 'var(--foreground)', cursor: 'pointer',
      },
    }, ['Compartir']),
    crearEl('button', { class: 'mock-cta', style: { padding: '6px 12px', fontSize: 'var(--text-xs)' } }, ['Nueva tarea']),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Doble Top Nav',
  descripcion: 'Dos barras superiores apiladas — útil para separar branding/global (arriba) de navegación contextual (abajo). 3 patrones: branding bar oscuro + nav, nav global + tabs de página, y branding + breadcrumbs con acciones.',
  decoracion: corner3(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Branding bar + nav contextual',
      descripcion: 'Barra superior fina y oscura para branding global y links externos (Soporte, Estado, Docs). Debajo la nav contextual normal. Patrón usado por workspaces enterprise.',
      hijos: [VistaCodigo({
        vista: dobleBrandingNav(),
        codigo: `// Barra 1 — branding global (oscura, fina, 40px)
crearEl('div', { style: { background: '#0a0a0a', color: '#fff' } }, [
  brandMini, '/ Acme Inc.', spacer,
  link('Soporte'), link('Estado'), link('Docs'),
])

// Barra 2 — nav contextual normal
crearEl('div', { class: 'mock-topbar' }, [
  navLinks, search, acciones,
])`,
      })],
    }),

    Seccion({
      titulo: '2 · Nav global + tabs de página',
      descripcion: 'La barra superior tiene la nav global (Inicio, Productos, Clientes…) y la inferior los tabs de la sección actual (Catálogo / Inventario / Categorías). El usuario sabe en qué módulo Y en qué subsección está.',
      hijos: [VistaCodigo({
        vista: dobleGlobalTabs(),
        codigo: `// Barra 1 — nav global del producto
crearEl('div', { class: 'mock-topbar' }, [
  brand, navLinks(['Inicio', 'Productos', 'Clientes', 'Pagos']),
  acciones,
])

// Barra 2 — tabs underline de la página
crearEl('div', null, [
  tabUnderline('Catálogo', true),
  tabUnderline('Inventario'),
  tabUnderline('Categorías'),
])`,
      })],
    }),

    Seccion({
      titulo: '3 · Branding + breadcrumbs con acciones',
      descripcion: 'Patrón de Notion / Linear. Barra de marca con search global arriba, debajo breadcrumbs de la página actual + botones de acción contextual (Compartir, Nueva tarea).',
      hijos: [VistaCodigo({
        vista: dobleBreadcrumbs(),
        codigo: `// Barra 2 — breadcrumbs + acciones contextuales
crearEl('div', null, [
  crearEl('div', { style: { display: 'flex', flex: 1 } }, [
    breadcrumbs,
  ]),
  Boton('Compartir'),
  Boton('Nueva tarea', { variante: 'primary' }),
])`,
      })],
    }),

  ],
});
