import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { VistaCodigo } from '../../../components/ui/code-preview/code-preview.js';
import { VistaArbol } from '../../../components/ui/treeview/treeview.js';
import { Insignia } from '../../../components/ui/badge/badge.js';
import { Avatar } from '../../../components/ui/avatar/avatar.js';
import { Campo } from '../../../components/ui/input/input.js';
import { Icono } from '../../../components/ui/icon/icons.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';

const FOTO = (n) => `./public/img/team/${n}.jpg`;

// ============================================================================
//  Helper: container con borde estándar para los demos
// ============================================================================
const wrap = (...n) => crearEl('div', {
  style: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)', padding: 'var(--space-2)',
    maxWidth: '480px',
  },
}, n);

// ============================================================================
//  Datasets
// ============================================================================
const ARCHIVOS = [
  { id: 'src', etiqueta: 'src', items: [
    { id: 'components', etiqueta: 'components', items: [
      { id: 'ui', etiqueta: 'ui', items: [
        { id: 'btn', etiqueta: 'button.js' },
        { id: 'crd', etiqueta: 'card.js' },
        { id: 'tab', etiqueta: 'tabs.js' },
        { id: 'mdl', etiqueta: 'modal.js' },
      ]},
      { id: 'common', etiqueta: 'common', items: [
        { id: 'sho', etiqueta: 'showcase.js' },
        { id: 'lay', etiqueta: 'layout.js' },
      ]},
    ]},
    { id: 'pages', etiqueta: 'pages', items: [
      { id: 'das', etiqueta: 'dashboard.page.js' },
      { id: 'login', etiqueta: 'login.page.js' },
      { id: 'set', etiqueta: 'settings.page.js' },
    ]},
    { id: 'router', etiqueta: 'router', items: [
      { id: 'ridx', etiqueta: 'index.js' },
      { id: 'rrt', etiqueta: 'routes.js' },
    ]},
    { id: 'styles', etiqueta: 'styles', items: [
      { id: 'main-css', etiqueta: 'main.css' },
      { id: 'theme-css', etiqueta: 'theme.css' },
    ]},
    { id: 'main', etiqueta: 'main.js' },
  ]},
  { id: 'public', etiqueta: 'public', items: [
    { id: 'idx', etiqueta: 'index.html' },
    { id: 'mfst', etiqueta: 'manifest.json' },
    { id: 'logo', etiqueta: 'logo.png' },
  ]},
  { id: 'docs', etiqueta: 'docs', items: [
    { id: 'rd', etiqueta: 'README.md' },
    { id: 'api', etiqueta: 'api.md' },
    { id: 'demo', etiqueta: 'demo.mp4' },
  ]},
  { id: 'pkg', etiqueta: 'package.json' },
  { id: 'lic', etiqueta: 'LICENSE.pdf' },
];

const PROYECTO = [
  { id: 'q3', etiqueta: 'Q3 2026 — Lanzamiento v2', items: [
    { id: 'eng', etiqueta: 'Engineering', items: [
      { id: 'auth', etiqueta: 'OAuth providers', meta: '4/8' },
      { id: 'api',  etiqueta: 'Public API v2', meta: '12/15' },
      { id: 'perf', etiqueta: 'Performance audit', meta: '0/5' },
    ]},
    { id: 'des', etiqueta: 'Diseño', items: [
      { id: 'mock', etiqueta: 'Mockups dashboard',     meta: 'Done' },
      { id: 'icon', etiqueta: 'Icon system unificado',  meta: '8/12' },
    ]},
    { id: 'mkt', etiqueta: 'Marketing', items: [
      { id: 'ld',   etiqueta: 'Landing page',  meta: '3/4' },
      { id: 'blog', etiqueta: 'Blog post Q3',  meta: '0/3' },
    ]},
  ]},
];

// ============================================================================
//  Página
// ============================================================================
export default async () => PaginaShowcase({
  titulo: 'Vista de árbol',
  descripcion: 'Estructura jerárquica recursiva con nodos expandibles. Estado abierto/cerrado en `senal Set` reactivo, soporta cualquier profundidad. Auto-detección de tipo de archivo por extensión (.js, .css, .pdf…) con icono y color por tipo. Soporta selección activa, checkboxes multi-select con propagación a descendientes, badges, meta info, filtro reactivo con highlight y disabled.',
  decoracion: corner2(),
  migas: [{ etiqueta: 'Componentes', href: '#/modulos/componentes' }],
  hijos: [

    // ============== 1. ESTRUCTURA DE ARCHIVOS ==============
    Seccion({
      titulo: '1 · Estructura de archivos (auto-icono por extensión)',
      descripcion: 'Cada archivo recibe un icono+color según su extensión: `.js` amarillo, `.css` azul, `.html` naranja, `.pdf` rojo, `.png` violeta, `.mp4` cyan. Las carpetas son siempre warning (estilo VS Code).',
      hijos: [VistaCodigo({
        vista: wrap(
          VistaArbol({
            iniciales: ['src', 'components', 'ui'],
            items: ARCHIVOS,
          }),
        ),
        codigo: `VistaArbol({
  iniciales: ['src', 'components', 'ui'],
  items: [
    { id: 'src', etiqueta: 'src', items: [
      { id: 'components', etiqueta: 'components', items: [...] },
      { id: 'main', etiqueta: 'main.js' },        // ← auto: icono JS amarillo
    ]},
    { id: 'lic', etiqueta: 'LICENSE.pdf' },        // ← auto: icono PDF rojo
  ],
})

// El tipo se detecta por extensión. Override con item.tipo o item.icono.`,
      })],
    }),

    // ============== 2. CON SELECCIÓN ACTIVA ==============
    Seccion({
      titulo: '2 · Con selección activa (file picker)',
      descripcion: '`seleccionado: senal()` resalta el item actual con bg primary + texto + icono. Usa este patrón para file pickers, selectores de carpeta, navegación en sidebar.',
      hijos: [VistaCodigo({
        vista: (() => {
          const seleccionado = senal('main');
          const indicador = crearEl('p', {
            style: { margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' },
          });
          efecto(() => { indicador.textContent = `Seleccionado: ${seleccionado.value || '—'}`; });
          return crearEl('div', null, [
            wrap(VistaArbol({
              iniciales: ['src', 'components'],
              seleccionado,
              items: ARCHIVOS,
            })),
            indicador,
          ]);
        })(),
        codigo: `const seleccionado = senal('main');

VistaArbol({
  iniciales: ['src'],
  seleccionado,                              // ← senal con el id activo
  items: [...],
})

// El item activo lleva bg primary + texto bold + icono primary.
// Click en cualquier nodo cambia seleccionado.value.`,
      })],
    }),

    // ============== 3. CON BADGES ==============
    Seccion({
      titulo: '3 · Con badges (errores, no-leídos, counts)',
      descripcion: 'Cada item puede llevar un `badge` (cualquier nodo) a la derecha. Útil para mostrar errores de compilación, archivos no leídos, count de cambios pendientes.',
      hijos: [VistaCodigo({
        vista: wrap(VistaArbol({
          iniciales: ['src', 'components'],
          items: [
            { id: 'src2', etiqueta: 'src', items: [
              { id: 'comps', etiqueta: 'components', items: [
                { id: 'b1', etiqueta: 'button.js' },
                { id: 'b2', etiqueta: 'card.js',  badge: Insignia({ texto: '2', variante: 'warning' }) },
                { id: 'b3', etiqueta: 'modal.js', badge: Insignia({ texto: '!', variante: 'danger' }) },
              ]},
              { id: 'pp', etiqueta: 'pages', items: [
                { id: 'p1', etiqueta: 'dashboard.page.js' },
                { id: 'p2', etiqueta: 'login.page.js', badge: Insignia({ texto: '·', variante: 'primary' }) },
              ]},
            ]},
          ],
        })),
        codigo: `{
  id: 'modal',
  etiqueta: 'modal.js',
  badge: Insignia({ texto: '!', variante: 'danger' }),    // ← errores
}

{
  id: 'card',
  etiqueta: 'card.js',
  badge: Insignia({ texto: '2', variante: 'warning' }),   // ← warnings
}`,
      })],
    }),

    // ============== 4. CON FILTRO REACTIVO ==============
    Seccion({
      titulo: '4 · Con filtro reactivo (search)',
      descripcion: 'Al tipear se ocultan los nodos que no matchean ni tienen descendientes que matcheen. Las coincidencias se resaltan en amarillo. Las carpetas que contienen matches se auto-expanden.',
      hijos: [VistaCodigo({
        vista: (() => {
          const filtro = senal('');
          return crearEl('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', maxWidth: '480px' } }, [
            Campo({
              type: 'search',
              placeholder: 'Buscar archivo… (prueba: "page", "css", "main")',
              onInput: (e) => { filtro.value = e.currentTarget.value; },
            }),
            wrap(VistaArbol({
              iniciales: ['src'],
              filtro,
              items: ARCHIVOS,
            })),
          ]);
        })(),
        codigo: `const filtro = senal('');

VistaArbol({
  filtro,                                    // ← senal con el texto actual
  items: [...],
})

Campo({ type: 'search',
  onInput: e => { filtro.value = e.currentTarget.value; } })

// El árbol auto-expande las ramas que contienen matches y resalta
// las coincidencias con <mark class="arbol__match"> (bg amarillo).`,
      })],
    }),

    // ============== 5. CON CHECKBOXES (MULTI-SELECT) ==============
    Seccion({
      titulo: '5 · Checkboxes multi-select (con propagación)',
      descripcion: '`conChecks: true` añade un checkbox antes de cada item. Marcar un nodo padre marca automáticamente TODOS sus descendientes. Patrón gestores de archivos / permisos / categorías.',
      hijos: [VistaCodigo({
        vista: (() => {
          const marcados = senal(new Set());
          const indicador = crearEl('p', {
            style: { margin: 'var(--space-2) 0 0', fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' },
          });
          efecto(() => {
            const n = marcados.value.size;
            indicador.textContent = n === 0 ? 'Ningún item marcado' : `${n} items marcados`;
          });
          return crearEl('div', null, [
            wrap(VistaArbol({
              iniciales: ['src', 'components'],
              conChecks: true,
              marcados,
              items: ARCHIVOS,
            })),
            indicador,
          ]);
        })(),
        codigo: `const marcados = senal(new Set());

VistaArbol({
  conChecks: true,                           // ← muestra checkboxes
  marcados,                                  // ← senal con ids marcados
  items: [...],
})

// Marcar el padre marca TODOS los descendientes recursivamente.
// Desmarcar el padre desmarca TODOS los descendientes.`,
      })],
    }),

    // ============== 6. PROYECTOS / TAREAS CON PROGRESO ==============
    Seccion({
      titulo: '6 · Proyecto / tareas con progreso (meta inline)',
      descripcion: '`meta: "12/15"` muestra texto a la derecha del nombre con `font-variant-numeric: tabular-nums`. Para mostrar progreso, fechas, tamaños sin invadir la jerarquía.',
      hijos: [VistaCodigo({
        vista: wrap(VistaArbol({
          iniciales: ['q3', 'eng', 'des', 'mkt'],
          items: PROYECTO,
        })),
        codigo: `{
  id: 'auth',
  etiqueta: 'OAuth providers',
  meta: '4/8',                               // ← muestra a la derecha
}

// También útil para tamaños:
{ etiqueta: 'big-file.zip', meta: '142.6 MB' }
{ etiqueta: 'commit a3f8b', meta: 'hace 2h' }`,
      })],
    }),

    // ============== 7. ORG CHART (avatares) ==============
    Seccion({
      titulo: '7 · Org chart con avatares custom',
      descripcion: 'Override del icono via `icono: nodo` para mostrar avatares de personas en vez de iconos de archivo. Patrón jerarquía organizacional.',
      hijos: [VistaCodigo({
        vista: wrap(VistaArbol({
          iniciales: ['ceo', 'eng-mgr', 'design-mgr'],
          items: [
            {
              id: 'ceo', etiqueta: 'María García · CEO',
              icono: Avatar({ nombre: 'María García', src: FOTO(1), tamano: 'xs' }),
              items: [
                {
                  id: 'eng-mgr', etiqueta: 'Marcus Lee · CTO',
                  icono: Avatar({ nombre: 'Marcus Lee', src: FOTO(2), tamano: 'xs' }),
                  items: [
                    { id: 'eng-1', etiqueta: 'Sara Chen · Frontend',  icono: Avatar({ nombre: 'Sara Chen', src: FOTO(3), tamano: 'xs' }) },
                    { id: 'eng-2', etiqueta: 'Carlos N. · Backend',   icono: Avatar({ nombre: 'Carlos Núñez', src: FOTO(4), tamano: 'xs' }) },
                    { id: 'eng-3', etiqueta: 'Lina Park · DevOps',    icono: Avatar({ nombre: 'Lina Park', src: FOTO(5), tamano: 'xs' }) },
                  ],
                },
                {
                  id: 'design-mgr', etiqueta: 'Eva F. · Head of Design',
                  icono: Avatar({ nombre: 'Eva Fernández', src: FOTO(6), tamano: 'xs' }),
                  items: [
                    { id: 'des-1', etiqueta: 'Priya P. · Senior Designer',  icono: Avatar({ nombre: 'Priya Patel', src: FOTO(7), tamano: 'xs' }) },
                    { id: 'des-2', etiqueta: 'Jorge R. · Junior Designer',  icono: Avatar({ nombre: 'Jorge Ramírez', src: FOTO(8), tamano: 'xs' }) },
                  ],
                },
              ],
            },
          ],
        })),
        codigo: `{
  id: 'ceo',
  etiqueta: 'María García · CEO',
  icono: Avatar({ nombre, src, tamano: 'xs' }),    // ← override del icono
  items: [
    { id: 'cto', etiqueta: 'Marcus Lee · CTO', icono: Avatar(...), items: [...] },
  ],
}`,
      })],
    }),

    // ============== 8. CATEGORÍAS DE PRODUCTOS ==============
    Seccion({
      titulo: '8 · Categorías de productos (e-commerce)',
      descripcion: 'Taxonomía de productos con count de items por categoría. Click en una categoría filtra el catálogo. Patrón Amazon / Mercado Libre sidebar.',
      hijos: [VistaCodigo({
        vista: (() => {
          const seleccionado = senal('zapatillas');
          return wrap(VistaArbol({
            iniciales: ['ropa', 'calzado'],
            seleccionado,
            items: [
              { id: 'ropa', etiqueta: 'Ropa', tipo: 'carpeta', items: [
                { id: 'camisetas',  etiqueta: 'Camisetas',     meta: '124', tipo: 'archivo' },
                { id: 'pantalones', etiqueta: 'Pantalones',    meta: '89',  tipo: 'archivo' },
                { id: 'chaquetas',  etiqueta: 'Chaquetas',     meta: '56',  tipo: 'archivo' },
                { id: 'sudaderas',  etiqueta: 'Sudaderas',     meta: '47',  tipo: 'archivo' },
              ]},
              { id: 'calzado', etiqueta: 'Calzado', tipo: 'carpeta', items: [
                { id: 'zapatillas',  etiqueta: 'Zapatillas',  meta: '78', tipo: 'archivo' },
                { id: 'botas',       etiqueta: 'Botas',       meta: '42', tipo: 'archivo' },
                { id: 'sandalias',   etiqueta: 'Sandalias',   meta: '31', tipo: 'archivo' },
              ]},
              { id: 'accesorios', etiqueta: 'Accesorios', tipo: 'carpeta', items: [
                { id: 'gorras',  etiqueta: 'Gorras',  meta: '24', tipo: 'archivo' },
                { id: 'bufandas', etiqueta: 'Bufandas', meta: '12', tipo: 'archivo' },
                { id: 'cinturones', etiqueta: 'Cinturones', meta: '18', tipo: 'archivo' },
              ]},
              { id: 'mochilas', etiqueta: 'Mochilas y bolsos', meta: '67', tipo: 'archivo' },
            ],
          }));
        })(),
        codigo: `VistaArbol({
  iniciales: ['ropa', 'calzado'],
  seleccionado,
  items: [
    { id: 'ropa', etiqueta: 'Ropa', items: [
      { id: 'camisetas', etiqueta: 'Camisetas', meta: '124' },
      { id: 'pantalones', etiqueta: 'Pantalones', meta: '89' },
    ]},
  ],
})`,
      })],
    }),

    // ============== 9. PERMISOS / ROLES (con disabled) ==============
    Seccion({
      titulo: '9 · Permisos / roles (con items disabled)',
      descripcion: '`disabled: true` deshabilita un nodo (atenúa, cursor not-allowed, no clickeable). Útil para permisos no disponibles en el plan actual o ya concedidos por otro rol.',
      hijos: [VistaCodigo({
        vista: (() => {
          const marcados = senal(new Set(['leer-proyectos', 'leer-usuarios']));
          return wrap(VistaArbol({
            iniciales: ['proyectos', 'usuarios', 'facturacion'],
            conChecks: true,
            marcados,
            items: [
              { id: 'proyectos', etiqueta: 'Proyectos', tipo: 'carpeta', items: [
                { id: 'leer-proyectos',     etiqueta: 'Leer proyectos' },
                { id: 'crear-proyectos',    etiqueta: 'Crear proyectos' },
                { id: 'editar-proyectos',   etiqueta: 'Editar proyectos' },
                { id: 'eliminar-proyectos', etiqueta: 'Eliminar proyectos', disabled: true },
              ]},
              { id: 'usuarios', etiqueta: 'Usuarios y equipo', tipo: 'carpeta', items: [
                { id: 'leer-usuarios',     etiqueta: 'Leer usuarios' },
                { id: 'invitar-usuarios',  etiqueta: 'Invitar usuarios' },
                { id: 'cambiar-roles',     etiqueta: 'Cambiar roles', disabled: true },
              ]},
              { id: 'facturacion', etiqueta: 'Facturación', tipo: 'carpeta', items: [
                { id: 'ver-facturas',     etiqueta: 'Ver facturas' },
                { id: 'gestionar-pago',   etiqueta: 'Gestionar métodos de pago', disabled: true },
                { id: 'cancelar-plan',    etiqueta: 'Cancelar suscripción',      disabled: true },
              ]},
            ],
          }));
        })(),
        codigo: `{
  id: 'eliminar-proyectos',
  etiqueta: 'Eliminar proyectos',
  disabled: true,                            // ← atenuado, no clickeable
}

// El checkbox también queda deshabilitado.
// Útil para permisos no disponibles en el plan actual.`,
      })],
    }),

    // ============== 10. NAVEGACIÓN DE DOCS ==============
    Seccion({
      titulo: '10 · Navegación de docs (sidebar de documentación)',
      descripcion: 'Patrón Stripe docs / Vercel docs / Notion. TOC jerárquico con selección activa, item destacado con badge "Nuevo", colapsable por sección.',
      hijos: [VistaCodigo({
        vista: (() => {
          const seleccionado = senal('routing');
          return wrap(VistaArbol({
            iniciales: ['empezando', 'fundamentos', 'avanzado'],
            seleccionado,
            items: [
              { id: 'empezando', etiqueta: 'Empezando', tipo: 'carpeta', items: [
                { id: 'instalacion',   etiqueta: 'Instalación', tipo: 'md' },
                { id: 'estructura',    etiqueta: 'Estructura del proyecto', tipo: 'md' },
                { id: 'primer-app',    etiqueta: 'Tu primera app', tipo: 'md' },
              ]},
              { id: 'fundamentos', etiqueta: 'Fundamentos', tipo: 'carpeta', items: [
                { id: 'componentes', etiqueta: 'Componentes',     tipo: 'md' },
                { id: 'reactividad', etiqueta: 'Reactividad',     tipo: 'md' },
                { id: 'routing',     etiqueta: 'Routing',         tipo: 'md' },
                { id: 'forms',       etiqueta: 'Formularios',     tipo: 'md' },
              ]},
              { id: 'avanzado', etiqueta: 'Avanzado', tipo: 'carpeta', items: [
                { id: 'performance', etiqueta: 'Performance',         tipo: 'md' },
                { id: 'testing',     etiqueta: 'Testing',              tipo: 'md' },
                { id: 'view-trans',  etiqueta: 'View Transitions API', tipo: 'md',
                  badge: Insignia({ texto: 'Nuevo', variante: 'success' }) },
                { id: 'i18n',        etiqueta: 'Internacionalización', tipo: 'md' },
              ]},
              { id: 'api', etiqueta: 'API Reference', tipo: 'carpeta', items: [
                { id: 'senal-api',  etiqueta: 'senal()',  tipo: 'js' },
                { id: 'efecto-api', etiqueta: 'efecto()', tipo: 'js' },
                { id: 'crearel-api', etiqueta: 'crearEl()', tipo: 'js' },
              ]},
            ],
          }));
        })(),
        codigo: `// Sidebar de docs estilo Stripe / Vercel / Notion
VistaArbol({
  iniciales: ['empezando', 'fundamentos'],
  seleccionado,                              // ← senal con la página actual
  items: [
    { id: 'fundamentos', etiqueta: 'Fundamentos', items: [
      { id: 'reactividad', etiqueta: 'Reactividad', tipo: 'md' },
      { id: 'view-trans',  etiqueta: 'View Transitions API', tipo: 'md',
        badge: Insignia({ texto: 'Nuevo', variante: 'success' }) },
    ]},
  ],
})`,
      })],
    }),

  ],
});
