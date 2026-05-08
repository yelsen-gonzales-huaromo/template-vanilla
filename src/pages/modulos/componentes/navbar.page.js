import { crearEl } from '../../../utils/helpers/dom.js';
import { senal } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner6 } from '../../../components/ui/card/card-decoraciones.js';

// ============================================================================
//  Helpers — bloques reutilizables
// ============================================================================
const brand = (texto = 'Launchpad', tamano = '') => crearEl('div', {
  class: ['mock-brand', tamano && `mock-brand--${tamano}`],
}, [
  crearEl('span', { class: 'mock-brand__logo' }, ['L']),
  crearEl('span', null, [texto]),
]);

const search = (placeholder = 'Buscar…', conAtajo = true) => crearEl('div', { class: 'mock-search' }, [
  crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 14 })]),
  crearEl('span', { class: 'mock-search__placeholder' }, [placeholder]),
  conAtajo && crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
]);

const iconoBtn = (icono, ping = false) => crearEl('button', {
  type: 'button', class: 'mock-icono-btn',
  'data-ping': ping ? 'true' : null,
}, [Icono(icono, { tamano: 18 })]);

const avatar = (txt = 'GH', tamano = '') => crearEl('div', {
  class: ['mock-avatar', tamano && `mock-avatar--${tamano}`],
}, [txt]);

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

// ============================================================================
//  1. Navbar default — branded SaaS
// ============================================================================
const navbarDefault = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: { width: 'var(--space-4)' } }),
    search(),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('faq'),
      iconoBtn('campana', true),
      avatar('MG'),
    ]),
  ]),
]);

// ============================================================================
//  2. Navbar con tabs integrados (Stripe-style)
// ============================================================================
const navbarConTabs = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar', style: { paddingBlockEnd: 0 } }, [
    brand(),
    crearEl('div', { style: { width: 'var(--space-4)' } }),
    crearEl('div', { style: { flex: 1, display: 'flex', gap: '4px', alignItems: 'flex-end' } }, [
      ['Dashboard', 'Pagos', 'Clientes', 'Productos', 'Conexión'].map((t, i) => crearEl('a', {
        href: '#', class: 'sin-decoracion',
        style: {
          padding: '14px 12px',
          borderBlockEnd: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
          color: i === 0 ? 'var(--foreground)' : 'var(--muted-foreground)',
          fontSize: 'var(--text-sm)', fontWeight: i === 0 ? 600 : 500,
          textDecoration: 'none',
          marginBlockEnd: '-1px',
        },
      }, [t])),
    ].flat()),
    crearEl('div', { class: 'mock-topbar__acciones', style: { paddingBlockEnd: 'var(--space-2)' } }, [
      iconoBtn('busqueda'),
      iconoBtn('campana'),
      avatar('SL'),
    ]),
  ]),
]);

// ============================================================================
//  3. Marketing nav con CTA (landing page)
// ============================================================================
const navbarMarketing = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand('Launchpad', 'lg'),
    crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
      navLink('Producto'),
      navLink('Precios'),
      navLink('Clientes'),
      navLink('Recursos'),
      navLink('Blog'),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      crearEl('a', {
        href: '#', class: 'sin-decoracion',
        style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 500, padding: '8px 12px', textDecoration: 'none' },
      }, ['Iniciar sesión']),
      crearEl('button', { class: 'mock-cta' }, [
        'Empieza gratis ',
        Icono('flecha_r', { tamano: 14 }),
      ]),
    ]),
  ]),
]);

// ============================================================================
//  4. Glass / translucent (con blur)
// ============================================================================
const navbarGlass = () => crearEl('div', {
  class: 'mock-app',
  style: {
    backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 35%, #8b5cf6 70%, #ec4899 100%)',
    minHeight: '180px',
  },
}, [
  crearEl('div', { class: 'mock-topbar mock-topbar--glass' }, [
    brand(),
    crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
      navLink('Inicio', true),
      navLink('Explorar'),
      navLink('Comunidad'),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('busqueda'),
      avatar('AT'),
    ]),
  ]),
  crearEl('div', { style: { flex: 1, padding: 'var(--space-4)', minHeight: '120px' } }),
]);

// ============================================================================
//  5. Centered nav (Apple-style — logo centrado)
// ============================================================================
const navbarCentered = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar', style: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 0 } }, [
    crearEl('div', { style: { display: 'flex', gap: '4px' } }, [
      navLink('Tienda', true),
      navLink('Mac'),
      navLink('iPad'),
      navLink('iPhone'),
    ]),
    brand('Apple'),
    crearEl('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '4px' } }, [
      iconoBtn('busqueda'),
      iconoBtn('carrito'),
    ]),
  ]),
]);

// ============================================================================
//  6. Navbar con megamenu (SaaS marketing — Productos)
// ============================================================================
const navbarMegamenu = () => {
  const abierto = senal(true);
  const panel = crearEl('div', { class: 'mock-megamenu__panel' }, [
    crearEl('div', { class: 'mock-megamenu__col' }, [
      crearEl('span', { class: 'mock-megamenu__col-titulo' }, ['Productos']),
      ...['Dashboard', 'Analítica', 'CRM'].map((t, i) => crearEl('div', { class: 'mock-megamenu__item' }, [
        crearEl('div', { class: 'mock-megamenu__item-icono' }, [Icono(['panel', 'analitica', 'crm'][i], { tamano: 16 })]),
        crearEl('div', null, [
          crearEl('div', { class: 'mock-megamenu__item-titulo' }, [t]),
          crearEl('div', { class: 'mock-megamenu__item-sub' }, ['Descripción breve del producto.']),
        ]),
      ])),
    ]),
    crearEl('div', { class: 'mock-megamenu__col' }, [
      crearEl('span', { class: 'mock-megamenu__col-titulo' }, ['Soluciones']),
      ...['E-commerce', 'SaaS', 'LMS'].map((t, i) => crearEl('div', { class: 'mock-megamenu__item' }, [
        crearEl('div', { class: 'mock-megamenu__item-icono' }, [Icono(['comercio', 'saas', 'lms'][i], { tamano: 16 })]),
        crearEl('div', null, [
          crearEl('div', { class: 'mock-megamenu__item-titulo' }, [t]),
          crearEl('div', { class: 'mock-megamenu__item-sub' }, ['Caso de uso específico.']),
        ]),
      ])),
    ]),
    crearEl('div', { class: 'mock-megamenu__col' }, [
      crearEl('span', { class: 'mock-megamenu__col-titulo' }, ['Recursos']),
      ...['Documentación', 'API', 'Soporte'].map((t, i) => crearEl('div', { class: 'mock-megamenu__item' }, [
        crearEl('div', { class: 'mock-megamenu__item-icono' }, [Icono(['pagina', 'utilidades', 'soporte'][i], { tamano: 16 })]),
        crearEl('div', null, [
          crearEl('div', { class: 'mock-megamenu__item-titulo' }, [t]),
          crearEl('div', { class: 'mock-megamenu__item-sub' }, ['Acceso rápido.']),
        ]),
      ])),
    ]),
  ]);

  return crearEl('div', { class: 'mock-app', style: { overflow: 'visible' } }, [
    crearEl('div', { class: 'mock-topbar' }, [
      brand(),
      crearEl('div', { style: { display: 'flex', gap: '4px', marginInlineStart: 'var(--space-5)' } }, [
        crearEl('a', { href: '#', class: 'sin-decoracion',
          style: { padding: '8px 12px', borderRadius: 'var(--radius-sm)',
            color: 'var(--foreground)', fontSize: 'var(--text-sm)', fontWeight: 600,
            background: 'var(--muted)', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', gap: '4px',
          },
        }, ['Productos ', Icono('chevron_d', { tamano: 12 })]),
        navLink('Precios'),
        navLink('Clientes'),
        navLink('Documentación'),
      ]),
      crearEl('div', { class: 'mock-topbar__acciones' }, [
        crearEl('a', { href: '#', class: 'sin-decoracion',
          style: { color: 'var(--muted-foreground)', fontSize: 'var(--text-sm)', fontWeight: 500, padding: '8px 12px', textDecoration: 'none' },
        }, ['Iniciar sesión']),
        crearEl('button', { class: 'mock-cta' }, ['Empezar']),
      ]),
    ]),
    crearEl('div', { style: { padding: '0 var(--space-4) var(--space-4)' } }, [panel]),
  ]);
};

// ============================================================================
//  7. App nav simple (search-focused)
// ============================================================================
const navbarSearchFocused = () => crearEl('div', { class: 'mock-app' }, [
  crearEl('div', { class: 'mock-topbar' }, [
    brand(),
    crearEl('div', { style: { width: 'var(--space-4)' } }),
    crearEl('div', { class: 'mock-search', style: { flex: 1, maxWidth: '600px', height: '38px' } }, [
      crearEl('span', { class: 'mock-search__icono' }, [Icono('busqueda', { tamano: 16 })]),
      crearEl('span', { class: 'mock-search__placeholder', style: { fontSize: 'var(--text-sm)' } }, ['Type / for commands · ⌘K para buscar']),
      crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
    ]),
    crearEl('div', { class: 'mock-topbar__acciones' }, [
      iconoBtn('mas'),
      iconoBtn('campana'),
      avatar('JD'),
    ]),
  ]),
]);

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Navbar',
  descripcion: 'Barra superior — el patrón de navegación más visible. Casos: SaaS dashboard (search + acciones + avatar), apps con tabs integrados (Stripe), marketing landing con CTA, glass effect sobre hero gradients, layout centrado tipo Apple, megamenu de productos.',
  decoracion: corner6(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    Seccion({
      titulo: '1 · Default — SaaS dashboard',
      descripcion: 'Brand a la izquierda, search central con atajo ⌘K, acciones a la derecha (ayuda, notificaciones con badge, avatar). El layout que ya usa Launchpad por defecto.',
      hijos: [VistaCodigo({
        vista: navbarDefault(),
        codigo: `crearEl('div', { class: 'mock-topbar' }, [
  brand(),
  search('Buscar…'),                          // con atajo ⌘K
  crearEl('div', { class: 'mock-topbar__acciones' }, [
    iconoBtn('faq'),
    iconoBtn('campana', true),                // ping rojo si hay nuevas
    avatar('MG'),
  ]),
])`,
      })],
    }),

    Seccion({
      titulo: '2 · Con tabs integrados (Stripe-style)',
      descripcion: 'Marca a la izquierda + tabs de sección integrados al header (sin barra separada). Patrón de Stripe Dashboard, Vercel, GitHub.',
      hijos: [VistaCodigo({
        vista: navbarConTabs(),
        codigo: `// Topbar con tabs en línea (underline en el activo)
crearEl('div', { class: 'mock-topbar', style: { paddingBlockEnd: 0 } }, [
  brand(),
  crearEl('div', null, [
    'Dashboard', 'Pagos', 'Clientes', 'Productos',
  ].map((t, i) => crearEl('a', {
    style: {
      borderBlockEnd: i === 0 ? '2px solid var(--primary)' : '2px solid transparent',
      padding: '14px 12px', /* etc. */
    },
  }, [t]))),
  acciones,
])`,
      })],
    }),

    Seccion({
      titulo: '3 · Marketing / landing con CTA',
      descripcion: 'Para sites de marketing — links centrales (Producto, Precios, Clientes…), "Iniciar sesión" como link discreto, "Empezar gratis" como CTA con gradient + sombra.',
      hijos: [VistaCodigo({
        vista: navbarMarketing(),
        codigo: `crearEl('div', { class: 'mock-topbar' }, [
  brand('Launchpad', 'lg'),
  navLinks(['Producto', 'Precios', 'Clientes', 'Recursos', 'Blog']),
  crearEl('div', { class: 'mock-topbar__acciones' }, [
    crearEl('a', null, ['Iniciar sesión']),
    crearEl('button', { class: 'mock-cta' }, [
      'Empieza gratis ',
      Icono('flecha_r'),
    ]),
  ]),
])`,
      })],
    }),

    Seccion({
      titulo: '4 · Glass / translucent (con blur)',
      descripcion: 'Sobre un hero gradient o imagen — `backdrop-filter: blur(12px)` + fondo semi-transparente. Patrón de Apple, iOS Safari, Notion.',
      hijos: [VistaCodigo({
        vista: navbarGlass(),
        codigo: `crearEl('div', { class: 'mock-topbar mock-topbar--glass' }, [...])

/* CSS:
.mock-topbar--glass {
  background: color-mix(in srgb, var(--surface) 65%, transparent);
  backdrop-filter: blur(12px);
} */`,
      })],
    }),

    Seccion({
      titulo: '5 · Centered (Apple-style)',
      descripcion: 'Logo centrado con grid 1fr auto 1fr — links a la izquierda, marca al medio, acciones a la derecha. Sensación de site editorial / e-commerce premium.',
      hijos: [VistaCodigo({
        vista: navbarCentered(),
        codigo: `crearEl('div', { class: 'mock-topbar', style: {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
} }, [
  navLinksIzquierda,
  brand('Apple'),
  accionesDerecha,
])`,
      })],
    }),

    Seccion({
      titulo: '6 · Con megamenu',
      descripcion: 'Hover/click en "Productos" abre un panel grande con 3 columnas (Productos / Soluciones / Recursos), cada item con icono + título + descripción. Patrón de marketing sites SaaS.',
      hijos: [VistaCodigo({
        vista: navbarMegamenu(),
        codigo: `crearEl('div', { class: 'mock-megamenu__panel' }, [
  crearEl('div', { class: 'mock-megamenu__col' }, [
    crearEl('span', { class: 'mock-megamenu__col-titulo' }, ['Productos']),
    crearEl('div', { class: 'mock-megamenu__item' }, [
      crearEl('div', { class: 'mock-megamenu__item-icono' }, [Icono('panel')]),
      crearEl('div', null, [
        crearEl('div', { class: 'mock-megamenu__item-titulo' }, ['Dashboard']),
        crearEl('div', { class: 'mock-megamenu__item-sub' }, ['…']),
      ]),
    ]),
    // ...
  ]),
  // ... 2 columnas más
])`,
      })],
    }),

    Seccion({
      titulo: '7 · Search-focused (command palette)',
      descripcion: 'Search prominente al centro tomando todo el ancho. Para apps donde el search es el patrón principal de navegación (Linear, Notion, Raycast).',
      hijos: [VistaCodigo({
        vista: navbarSearchFocused(),
        codigo: `crearEl('div', { class: 'mock-search', style: { flex: 1, maxWidth: '600px' } }, [
  Icono('busqueda'),
  'Type / for commands · ⌘K para buscar',
  crearEl('span', { class: 'mock-search__atajo' }, ['⌘K']),
])`,
      })],
    }),

  ],
});
