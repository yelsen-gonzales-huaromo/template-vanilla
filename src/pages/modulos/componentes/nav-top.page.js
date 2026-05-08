import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers
// ============================================================================
const brand = (texto = 'Launchpad') => crearEl('div', { class: 'mock-brand' }, [
  crearEl('span', { class: 'mock-brand__logo' }, ['L']),
  crearEl('span', null, [texto]),
]);

const navLink = (texto, activo = false) => crearEl('a', {
  href: '#', class: 'sin-decoracion',
  style: {
    padding: '8px 12px', borderRadius: 'var(--radius-sm)',
    color: activo ? 'var(--foreground)' : 'var(--muted-foreground)',
    fontSize: 'var(--text-sm)', fontWeight: activo ? 600 : 500,
    textDecoration: 'none',
    background: activo ? 'var(--muted)' : 'transparent',
  },
}, [texto]);

const iconoBtn = (icono, ping = false) => crearEl('button', {
  type: 'button', class: 'mock-icono-btn',
  'data-ping': ping ? 'true' : null,
}, [Icono(icono, { tamano: 18 })]);

const avatar = (txt) => crearEl('div', { class: 'mock-avatar' }, [txt]);

const contentBlocks = () => crearEl('div', { class: 'mock-content' }, [
  crearEl('div', { class: 'mock-skel mock-skel--titulo' }),
  crearEl('div', { class: 'mock-skel mock-skel--row' }, [
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
    crearEl('div', { class: 'mock-skel mock-skel--card' }),
  ]),
  crearEl('div', { class: 'mock-skel mock-skel--texto' }),
  crearEl('div', { class: 'mock-skel mock-skel--texto', style: { width: '70%' } }),
]);

// ============================================================================
//  1. Top nav básico (sin sidebar) — SaaS simple
// ============================================================================
const topNavBasico = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
      navLink('Dashboard', true),
      navLink('Proyectos'),
      navLink('Equipo'),
      navLink('Documentación'),
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
//  2. Top nav con tabs de sección — patrón Stripe / Linear
// ============================================================================
const topNavConTabs = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar', style: { paddingBlockEnd: 0, alignItems: 'flex-end' } }, [
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: 'var(--space-3)', paddingBlockEnd: 'var(--space-2)' } }, [
      brand(),
    ]),
    crearEl('div', { style: { flex: 1, display: 'flex', gap: '4px' } }, [
      ['Inicio', 'Pagos', 'Clientes', 'Productos', 'Reportes', 'Conectores'].map((t, i) => crearEl('a', {
        href: '#', class: 'sin-decoracion',
        style: {
          padding: '14px 12px',
          borderBlockEnd: i === 1 ? '2px solid var(--primary)' : '2px solid transparent',
          color: i === 1 ? 'var(--foreground)' : 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)', fontWeight: i === 1 ? 600 : 500,
          textDecoration: 'none',
          marginBlockEnd: '-1px',
        },
      }, [t])),
    ].flat()),
    crearEl('div', { style: { display: 'flex', gap: '6px', paddingBlockEnd: 'var(--space-2)' } }, [
      iconoBtn('busqueda'),
      iconoBtn('campana'),
      avatar('SL'),
    ]),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  3. Top nav centrado con scroll progress (Apple / blogs)
// ============================================================================
const topNavCentered = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar', style: {
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center', gap: 0,
    position: 'relative',
  } }, [
    crearEl('div', { style: { display: 'flex', gap: '4px' } }, [
      navLink('Producto'),
      navLink('Soluciones'),
      navLink('Precios'),
    ]),
    brand('Launchpad'),
    crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '4px' } }, [
      navLink('Iniciar sesión'),
      crearEl('button', { class: 'mock-cta', style: { padding: '6px 12px' } }, ['Empezar']),
    ]),
    // Progress bar abajo del header
    crearEl('div', {
      style: {
        position: 'absolute',
        insetBlockEnd: 0,
        insetInlineStart: 0,
        width: '38%', height: '2px',
        background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
      },
    }),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  4. Top nav con CTA prominente (marketing site)
// ============================================================================
const topNavMarketing = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand('Launchpad'),
    crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
      navLink('Producto'),
      navLink('Precios'),
      navLink('Clientes'),
      navLink('Recursos'),
      navLink('Empresa'),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      crearEl('a', {
        href: '#', class: 'sin-decoracion',
        style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 500, padding: '8px 12px', textDecoration: 'none' },
      }, ['Iniciar sesión']),
      crearEl('a', {
        href: '#', class: 'sin-decoracion',
        style: {
          padding: '8px 14px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 600,
          textDecoration: 'none',
        },
      }, ['Demo']),
      crearEl('button', { class: 'mock-cta' }, ['Empieza gratis']),
    ]),
  ]),
  // Hero section con gradient
  crearEl('div', {
    style: {
      padding: 'var(--space-7) var(--space-5)',
      background: 'linear-gradient(135deg, color-mix(in srgb, var(--primary) 8%, transparent), color-mix(in srgb, #8b5cf6 8%, transparent))',
      textAlign: 'center',
    },
  }, [
    crearEl('div', { class: 'mock-skel mock-skel--titulo', style: { margin: '0 auto var(--space-3)', height: '32px', width: '60%' } }),
    crearEl('div', { class: 'mock-skel mock-skel--texto', style: { margin: '0 auto', width: '40%' } }),
  ]),
]);

// ============================================================================
//  5. Top nav con breadcrumbs (deep navigation)
// ============================================================================
const topNavBreadcrumbs = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: {
      display: 'flex', alignItems: 'center', gap: '6px',
      marginInlineStart: 'var(--space-5)',
      fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)',
    } }, [
      crearEl('a', { href: '#', style: { color: 'var(--muted-foreground)', textDecoration: 'none' } }, ['Acme Inc.']),
      crearEl('span', { style: { opacity: 0.4 } }, ['/']),
      crearEl('a', { href: '#', style: { color: 'var(--muted-foreground)', textDecoration: 'none' } }, ['Proyectos']),
      crearEl('span', { style: { opacity: 0.4 } }, ['/']),
      crearEl('span', { style: { color: 'var(--foreground)', fontWeight: 600 } }, ['Launchpad Web']),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('mas'),
      iconoBtn('campana'),
      avatar('MG'),
    ]),
  ]),
  contentBlocks(),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Top Nav',
  descripcion: 'Sólo barra superior — sin sidebar. 5 patrones según el caso de uso: SaaS simple, con tabs de sección (Stripe), centrado con scroll progress (Apple), marketing con CTA, y breadcrumbs para apps con jerarquía profunda.',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Top nav básico (SaaS simple)',
      descripcion: 'Brand a la izquierda, links de nav, search compacto y acciones a la derecha. Para apps con poca navegación lateral — settings sites, herramientas pequeñas.',
      hijos: [VistaCodigo({
        vista: topNavBasico(),
        codigo: `estadoUi.posicionNav.value = 'top';

// Estructura: brand + navLinks + search + acciones
crearEl('div', { class: 'mock-topbar' }, [
  brand(),
  navLinks(['Dashboard', 'Proyectos', 'Equipo', 'Documentación']),
  crearEl('div', { class: 'mock-topbar__acciones' }, [
    search,
    iconoBtn('campana', true),
    avatar('MG'),
  ]),
])`,
      })],
    }),

    Seccion({
      titulo: '2 · Con tabs de sección (Stripe-style)',
      descripcion: 'Tabs integrados al header (no como nav links, sino como tabs underline). El tab activo lleva borde inferior primary. Patrón canónico de Stripe Dashboard.',
      hijos: [VistaCodigo({
        vista: topNavConTabs(),
        codigo: `// Tabs en el header con borderBlockEnd
['Inicio', 'Pagos', 'Clientes', 'Productos'].map((t, i) => crearEl('a', {
  style: {
    padding: '14px 12px',
    borderBlockEnd: i === 1 ? '2px solid var(--primary)' : '2px solid transparent',
    color: i === 1 ? 'var(--foreground)' : 'var(--muted-foreground)',
    fontWeight: i === 1 ? 600 : 500,
  },
}, [t]))`,
      })],
    }),

    Seccion({
      titulo: '3 · Centered con scroll progress',
      descripcion: 'Logo centrado (grid 1fr auto 1fr) + barra fina abajo con gradient que muestra el progreso de scroll de la página. Patrón usado por Apple.com, blogs editoriales.',
      hijos: [VistaCodigo({
        vista: topNavCentered(),
        codigo: `crearEl('div', { class: 'mock-topbar', style: {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  position: 'relative',
} }, [
  navLinksIzq, brand(), accionesDer,
  // Progress bar de scroll
  crearEl('div', { style: {
    position: 'absolute', insetBlockEnd: 0, insetInlineStart: 0,
    width: \`\${scrollPct}%\`, height: '2px',
    background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)',
  } }),
])`,
      })],
    }),

    Seccion({
      titulo: '4 · Marketing con CTA prominente',
      descripcion: 'Para sites de marketing — links de producto, "Iniciar sesión" + "Demo" como variantes secundarias, y CTA principal con gradient. Hero gradient debajo para reforzar.',
      hijos: [VistaCodigo({
        vista: topNavMarketing(),
        codigo: `// 3 niveles de jerarquía en las acciones:
// 1. Link discreto: "Iniciar sesión"
// 2. Botón outline:  "Demo"
// 3. CTA principal:  "Empieza gratis"  ← gradient + sombra

crearEl('button', { class: 'mock-cta' }, ['Empieza gratis'])`,
      })],
    }),

    Seccion({
      titulo: '5 · Con breadcrumbs (jerarquía profunda)',
      descripcion: 'En vez de tabs o links, breadcrumbs muestran dónde estás dentro de la jerarquía: Workspace / Proyecto / Página actual. Útil para apps con muchos niveles anidados.',
      hijos: [VistaCodigo({
        vista: topNavBreadcrumbs(),
        codigo: `crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
  crearEl('a', { href: '#' }, ['Acme Inc.']),
  crearEl('span', null, ['/']),
  crearEl('a', { href: '#' }, ['Proyectos']),
  crearEl('span', null, ['/']),
  crearEl('span', { style: { fontWeight: 600 } }, ['Launchpad Web']),
])`,
      })],
    }),

  ],
});
