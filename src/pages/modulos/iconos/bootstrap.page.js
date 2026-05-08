/**
 * Bootstrap Icons — showcase con CDN free.
 *
 * Carga: https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css
 * Uso:   <i class="bi bi-house"></i>
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { cargarCss } from '../../../integrations/_loader.js';
import { corner2 } from '../../../components/ui/card/card-decoraciones.js';
import {
  HeroBanner, Catalogo, Receta,
  RecipeSidebar, RecipeBotones, RecipeKPI, RecipeBadges, RecipeToolbar, RecipeEmptyState, RecipeNotificacion,
  SeccionTamanos, SeccionColores,
} from './_compartido.js';

const COLOR = '#7c3aed';
const BS_CSS = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css';

const ICONOS = [
  'house','house-door','house-heart','person','person-circle','person-plus','person-fill','people',
  'search','funnel','sliders','filter','list','grid','grid-3x3','x','plus','dash','check','check2',
  'gear','tools','wrench','wrench-adjustable',
  'bell','bell-slash','envelope','envelope-open','send','chat','chat-dots','chat-square','telephone',
  'heart','star','star-fill','bookmark','flag','share','link','clipboard','copy',
  'cart','cart3','bag','bag-check','credit-card','wallet','wallet2','coin','tag','tags','receipt','gift','box','box2','box-seam',
  'calendar','calendar-event','calendar-check','clock','clock-history','hourglass','stopwatch',
  'graph-up','graph-down','bar-chart','pie-chart','activity','speedometer','speedometer2',
  'image','images','camera','camera-video','film','music-note','headphones','mic','play','pause','skip-forward','skip-backward',
  'file','file-earmark','file-earmark-pdf','file-earmark-image','file-earmark-text','folder','folder2-open','download','upload','cloud','cloud-upload','cloud-download','printer',
  'lock','unlock','shield','shield-check','shield-lock','key','fingerprint',
  'eye','eye-slash','pencil','pencil-square','trash','trash3','arrow-clockwise','arrow-counterclockwise','arrow-repeat',
  'info-circle','question-circle','check-circle','x-circle','exclamation-circle','exclamation-triangle','life-preserver',
  'arrow-up','arrow-down','arrow-left','arrow-right','arrow-up-right','arrow-up-right-circle','box-arrow-up-right','arrow-up-short','arrow-down-short',
  'chevron-up','chevron-down','chevron-left','chevron-right','chevron-double-right',
  'globe','globe2','translate','geo','geo-alt','pin-map','compass','signpost-2','map',
  'sun','moon','moon-stars','cloud-sun','cloud-rain','snow','wind','lightning','fire','droplet',
  'truck','bus-front','airplane','train-front','bicycle','tropical-storm','car-front',
  'briefcase','building','hospital','book','shop','shop-window',
  'rocket','rocket-takeoff','lightbulb','trophy','award','gem','star-half',
  'database','server','code','code-slash','terminal','laptop','display','phone','tablet','wifi','plug',
  'palette','palette2','brush','pen','eraser','droplet-half',
  'emoji-smile','emoji-frown','emoji-heart-eyes','heart-pulse','hand-thumbs-up','hand-thumbs-down','people-fill',
  'bug','virus','virus2','capsule','clipboard-pulse','prescription2',
  'hash','at','asterisk','percent','currency-dollar','currency-euro','currency-bitcoin',
];

const renderBS = (nombre, tamano = 24) => crearEl('i', {
  class: `bi bi-${nombre}`,
  style: { fontSize: `${tamano}px`, lineHeight: 1, width: `${tamano}px`, height: `${tamano}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
});

const ALIAS_RECIPE = {
  alerta:    'exclamation-triangle',
  check:     'check-circle',
  cerrar:    'x-circle',
  ojo:       'eye',
  reloj:     'clock',
  estrella:  'star-fill',
};
const renderRecipe = (nombre, tamano) => renderBS(ALIAS_RECIPE[nombre] || nombre, tamano);

export default async () => {
  cargarCss(BS_CSS);

  return PaginaShowcase({
    titulo: 'Bootstrap Icons',
    descripcion: 'Set oficial de iconos del equipo Bootstrap. ~2,000 SVG con licencia MIT, distribuidos como webfont (icon-font) o como SVG individuales. Estilo redondeado y consistente, gratis para cualquier uso.',
    decoracion: corner2(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Iconos', href: '#/modulos/iconos' },
    ],
    hijos: [

      Seccion({
        titulo: '1 · Hero · paleta · instalación',
        descripcion: 'Una sola línea de CSS desde jsdelivr. Iconos como webfont (`<i class="bi bi-X">`) o como `<svg>` directo (mejor para tree-shaking).',
        hijos: [HeroBanner({
          marca: 'Bootstrap Icons',
          color: COLOR,
          version: '1.11.3',
          totalIconos: '2,000+',
          licencia: 'MIT',
          pesoCdn: '~140KB CSS + woff2',
          install: {
            descripcion: 'Webfont via CDN — todos los iconos disponibles desde la primera carga.',
            snippet: '<link rel="stylesheet"\n      href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css">',
            uso: '<i class="bi bi-house"></i>\n<i class="bi bi-rocket"></i>\n<i class="bi bi-github"></i>',
          },
          preview: [
            renderBS('rocket', 28),
            renderBS('lightning-charge-fill', 28),
            renderBS('heart-fill', 28),
            renderBS('cart3', 28),
            renderBS('graph-up', 28),
          ],
        })],
      }),

      Seccion({
        titulo: '2 · Recipes — patrones reales',
        descripcion: 'Sidebar de admin, botones, toolbar de editor, badges de estado y empty state — el toolkit completo de iconografía operativa.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
        }, [
          Receta({
            titulo: 'Sidebar admin',
            descripcion: 'Navegación principal',
            hijo: RecipeSidebar({
              render: renderBS, color: COLOR,
              items: [
                { icono: 'speedometer2', etiqueta: 'Dashboard' },
                { icono: 'graph-up', etiqueta: 'Reportes' },
                { icono: 'people', etiqueta: 'Equipo', badge: '12' },
                { icono: 'box-seam', etiqueta: 'Productos' },
                { icono: 'chat-dots', etiqueta: 'Tickets', badge: '4' },
                { icono: 'gear', etiqueta: 'Configuración' },
              ],
            }),
          }),
          Receta({
            titulo: 'Botones con icono',
            descripcion: 'Primario + secundarios',
            hijo: RecipeBotones({
              render: renderBS, color: COLOR,
              items: [
                { icono: 'plus-circle-fill', etiqueta: 'Crear', primario: true },
                { icono: 'cloud-upload', etiqueta: 'Subir' },
                { icono: 'file-earmark-arrow-down', etiqueta: 'Exportar' },
                { icono: 'three-dots', etiqueta: 'Más' },
              ],
            }),
          }),
          Receta({
            titulo: 'Toolbar editor',
            descripcion: 'Formato de texto',
            hijo: RecipeToolbar({
              render: renderBS, color: COLOR,
              items: [
                { icono: 'type-bold', titulo: 'Negrita' },
                { icono: 'type-italic', titulo: 'Cursiva' },
                { icono: 'type-underline', titulo: 'Subrayado' },
                { icono: 'list-ul', titulo: 'Lista' },
                { icono: 'link-45deg', titulo: 'Enlace' },
                { icono: 'image', titulo: 'Imagen' },
                { icono: 'code-slash', titulo: 'Código' },
              ],
            }),
          }),
          Receta({
            titulo: 'Status badges',
            descripcion: 'Colores semánticos',
            hijo: RecipeBadges({ render: renderRecipe }),
          }),
          Receta({
            titulo: 'Notificación inline',
            descripcion: 'Alerta destacada',
            hijo: RecipeNotificacion({ render: renderRecipe, color: COLOR }),
          }),
          Receta({
            titulo: 'Empty state',
            descripcion: 'Icono + título + descripción',
            hijo: RecipeEmptyState({
              render: renderBS, color: COLOR,
              icono: 'inbox', titulo: 'Sin notificaciones',
              descripcion: 'Te avisaremos cuando ocurra algo importante.',
            }),
          }),
        ])],
      }),

      Seccion({
        titulo: '3 · KPI cards — métricas con icono',
        descripcion: 'Tarjetas de dashboard con icono colorizado por categoría y delta. Patrón Linear / Stripe.',
        hijos: [RecipeKPI({
          render: renderBS, color: COLOR,
          items: [
            { icono: 'graph-up-arrow', label: 'Ingresos', valor: '$48.2K', delta: '+12.4%', color: '#10b981' },
            { icono: 'people-fill', label: 'Usuarios', valor: '1,247', delta: '+8.1%', color: COLOR },
            { icono: 'bag-check-fill', label: 'Pedidos', valor: '342', delta: '-2.3%', color: '#f59e0b' },
            { icono: 'lightning-charge-fill', label: 'Velocidad', valor: '128ms', delta: '+24ms', color: '#06b6d4' },
          ],
        })],
      }),

      Seccion({
        titulo: '4 · Tamaños',
        descripcion: 'Bootstrap Icons usa `font-size` igual que cualquier glifo de fuente — escalado nítido en cualquier tamaño.',
        hijos: [SeccionTamanos({ render: renderBS, icono: 'rocket', color: COLOR })],
      }),

      Seccion({
        titulo: '5 · Colores',
        descripcion: 'Hereda `color` del padre. Combina con `currentColor` para iconos que cambian con el contexto.',
        hijos: [SeccionColores({ render: renderBS, icono: 'heart-fill' })],
      }),

      Seccion({
        titulo: '6 · Outline vs filled',
        descripcion: 'Muchos iconos vienen en dos versiones: la outline (sin sufijo) y la `-fill` (relleno sólido). Útil para diferenciar estado seleccionado / no seleccionado.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' },
        }, [
          ['heart',     'heart-fill',     'Favorito'],
          ['star',      'star-fill',      'Destacado'],
          ['bookmark',  'bookmark-fill',  'Guardado'],
          ['bell',      'bell-fill',      'Notificaciones'],
          ['person',    'person-fill',    'Perfil'],
          ['chat',      'chat-fill',      'Mensajes'],
        ].map(([outline, filled, etq]) => crearEl('div', {
          style: { padding: 'var(--space-3)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' },
        }, [
          crearEl('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } }, [
            crearEl('span', { style: { color: 'var(--muted-foreground)' } }, [renderBS(outline, 22)]),
            crearEl('span', { style: { color: COLOR } }, [renderBS(filled, 22)]),
          ]),
          crearEl('div', null, [
            crearEl('div', { style: { fontSize: 'var(--text-sm)', fontWeight: 700 } }, [etq]),
            crearEl('div', { style: { fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'monospace' } }, [`bi-${outline} / bi-${filled}`]),
          ]),
        ])))],
      }),

      Seccion({
        titulo: '7 · Catálogo · click para copiar',
        descripcion: `${ICONOS.length} iconos curados. Filtra para encontrar el que necesitas, click para copiar la clase \`bi bi-NOMBRE\`.`,
        hijos: [Catalogo({
          iconos: ICONOS,
          render: renderBS,
          obtenerCodigo: (n) => `<i class="bi bi-${n}"></i>`,
          color: COLOR,
        })],
      }),

    ],
  });
};
