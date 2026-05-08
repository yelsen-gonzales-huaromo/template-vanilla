/**
 * Font Awesome 6 — showcase con CDN free.
 *
 * Carga: https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css
 * Uso:   <i class="fa-solid fa-house"></i>
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { cargarCss } from '../../../integrations/_loader.js';
import { corner1 } from '../../../components/ui/card/card-decoraciones.js';
import {
  HeroBanner, Catalogo, Receta,
  RecipeSidebar, RecipeBotones, RecipeKPI, RecipeBadges, RecipeToolbar, RecipeEmptyState, RecipeNotificacion,
  SeccionTamanos, SeccionColores,
} from './_compartido.js';

const COLOR = '#339af0';
const FA_CSS = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';

// Curated: ~140 iconos populares (de los ~2000+ del free)
const ICONOS = [
  'house','user','users','user-circle','user-plus','user-tie','address-book','address-card',
  'magnifying-glass','filter','sliders','bars','grip','grip-vertical','xmark','plus','minus','check','equals',
  'gear','wrench','screwdriver-wrench','hammer','tools',
  'bell','bell-slash','envelope','envelope-open','paper-plane','message','comment','comments','phone',
  'heart','star','thumbs-up','thumbs-down','bookmark','flag','share','share-nodes','link','copy',
  'cart-shopping','bag-shopping','credit-card','wallet','money-bill','dollar-sign','euro-sign','tag','tags','receipt','gift','box','boxes-stacked',
  'calendar','calendar-check','calendar-day','calendar-plus','clock','hourglass','stopwatch',
  'chart-line','chart-bar','chart-pie','chart-area','chart-column','chart-simple','square-poll-vertical',
  'image','images','video','film','camera','music','headphones','microphone','play','pause','forward','backward',
  'file','file-lines','file-pdf','file-image','file-csv','folder','folder-open','folder-tree','download','upload','cloud','cloud-arrow-up','cloud-arrow-down','print',
  'lock','unlock','shield','shield-halved','key','fingerprint','user-shield',
  'eye','eye-slash','pen','pen-to-square','pencil','trash','trash-can','rotate','rotate-left','rotate-right','arrow-rotate-right','undo',
  'circle-info','circle-question','circle-check','circle-xmark','circle-exclamation','triangle-exclamation','life-ring',
  'arrow-up','arrow-down','arrow-left','arrow-right','arrow-up-right-from-square','arrow-trend-up','arrow-trend-down',
  'chevron-up','chevron-down','chevron-left','chevron-right','angles-up','angles-down',
  'globe','language','earth-americas','earth-europe','earth-asia','map','map-pin','location-dot','location-arrow','compass','route',
  'sun','moon','cloud-sun','cloud-moon','umbrella','snowflake','wind','bolt','fire','droplet',
  'truck','car','plane','train','bicycle','motorcycle','ship',
  'briefcase','building','hospital','school','industry','store','warehouse',
  'rocket','lightbulb','crown','trophy','medal','award','gem',
  'database','server','code','terminal','laptop','desktop','mobile','tablet','wifi','plug',
  'palette','brush','pen-nib','swatchbook','droplet','contrast',
  'hand','handshake','hand-holding-heart','face-smile','face-frown','language',
  'bug','virus','syringe','pills','prescription-bottle-medical',
  'hashtag','at','asterisk','percent',
];

const renderFA = (nombre, tamano = 24) => crearEl('i', {
  class: `fa-solid fa-${nombre}`,
  style: { fontSize: `${tamano}px`, lineHeight: 1, width: `${tamano}px`, height: `${tamano}px`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' },
});

// Para los recipes que usan claves "internas" (alerta, check, ojo, reloj, cerrar, estrella),
// las mapeamos a nombres reales de Font Awesome:
const ALIAS_RECIPE = {
  alerta:    'triangle-exclamation',
  check:     'check',
  cerrar:    'xmark',
  ojo:       'eye',
  reloj:     'clock',
  estrella:  'star',
};
const renderRecipe = (nombre, tamano) => renderFA(ALIAS_RECIPE[nombre] || nombre, tamano);

export default async () => {
  cargarCss(FA_CSS);

  return PaginaShowcase({
    titulo: 'Font Awesome 6',
    descripcion: 'La biblioteca de iconos más usada de la web (~2000 iconos en el plan free, +30K con Pro). Carga vía CDN; los iconos se renderizan con `<i class="fa-solid fa-name"></i>` y heredan color con `currentColor`. Click en cualquier icono del catálogo para copiar la clase al portapapeles.',
    decoracion: corner1(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Iconos', href: '#/modulos/iconos' },
    ],
    hijos: [

      Seccion({
        titulo: '1 · Hero · paleta · instalación',
        descripcion: 'Setup en una línea de CSS desde CDN. Sin npm install, sin build step.',
        hijos: [HeroBanner({
          marca: 'Font Awesome',
          color: COLOR,
          version: '6.5.2',
          totalIconos: '2,016 (free)',
          licencia: 'CC BY 4.0',
          pesoCdn: '~110KB CSS + 75KB woff2',
          install: {
            descripcion: 'Pega el `<link>` en el `<head>` o cárgalo lazy con `cargarCss()`. Los iconos se ven al instante.',
            snippet: '<link rel="stylesheet"\n      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">',
            uso: '<i class="fa-solid fa-house"></i>\n<i class="fa-solid fa-rocket"></i>\n<i class="fa-brands fa-github"></i>',
          },
          preview: [
            renderFA('house', 28),
            renderFA('rocket', 28),
            renderFA('heart', 28),
            renderFA('cart-shopping', 28),
            renderFA('chart-line', 28),
          ],
        })],
      }),

      Seccion({
        titulo: '2 · Recipes — patrones reales con iconos',
        descripcion: 'Sidebar de navegación, grupo de botones, KPI cards, status badges, toolbar y empty state. Los iconos son reemplazables por cualquier otro nombre del catálogo.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
        }, [
          Receta({
            titulo: 'Sidebar de navegación',
            descripcion: 'Item activo con bg + color de marca',
            hijo: RecipeSidebar({
              render: renderFA, color: COLOR,
              items: [
                { icono: 'house', etiqueta: 'Inicio' },
                { icono: 'chart-line', etiqueta: 'Analítica' },
                { icono: 'users', etiqueta: 'Clientes', badge: '24' },
                { icono: 'cart-shopping', etiqueta: 'Pedidos' },
                { icono: 'envelope', etiqueta: 'Mensajes', badge: '7' },
                { icono: 'gear', etiqueta: 'Ajustes' },
              ],
            }),
          }),
          Receta({
            titulo: 'Grupo de botones con icono',
            descripcion: 'Acción primaria + secundarias',
            hijo: RecipeBotones({
              render: renderFA, color: COLOR,
              items: [
                { icono: 'plus', etiqueta: 'Nuevo proyecto', primario: true },
                { icono: 'cloud-arrow-down', etiqueta: 'Importar' },
                { icono: 'share-nodes', etiqueta: 'Compartir' },
                { icono: 'trash-can', etiqueta: 'Eliminar' },
              ],
            }),
          }),
          Receta({
            titulo: 'Toolbar de editor',
            descripcion: 'Mini barra con tools',
            hijo: RecipeToolbar({
              render: renderFA, color: COLOR,
              items: [
                { icono: 'bold', titulo: 'Negrita' },
                { icono: 'italic', titulo: 'Cursiva' },
                { icono: 'underline', titulo: 'Subrayado' },
                { icono: 'list-ul', titulo: 'Lista' },
                { icono: 'link', titulo: 'Enlace' },
                { icono: 'image', titulo: 'Imagen' },
              ],
            }),
          }),
          Receta({
            titulo: 'Status badges',
            descripcion: '5 estados con icono y color semántico',
            hijo: RecipeBadges({ render: renderRecipe }),
          }),
          Receta({
            titulo: 'Notificación destacada',
            descripcion: 'Alerta inline con icono + descripción',
            hijo: RecipeNotificacion({ render: renderRecipe, color: COLOR }),
          }),
          Receta({
            titulo: 'Empty state',
            descripcion: 'Icono grande + título + descripción',
            hijo: RecipeEmptyState({
              render: renderFA, color: COLOR,
              icono: 'inbox', titulo: 'Tu bandeja está vacía',
              descripcion: 'Cuando recibas mensajes los verás aquí.',
            }),
          }),
        ])],
      }),

      Seccion({
        titulo: '3 · KPI cards — dashboard pattern',
        descripcion: 'Tarjetas de métricas con icono header y delta vs período anterior. Patrón Stripe Dashboard / Linear Insights.',
        hijos: [RecipeKPI({
          render: renderFA, color: COLOR,
          items: [
            { icono: 'dollar-sign', label: 'MRR', valor: '$48.2K', delta: '+12.4%', color: '#10b981' },
            { icono: 'users', label: 'Usuarios activos', valor: '1,247', delta: '+8.1%', color: COLOR },
            { icono: 'cart-shopping', label: 'Pedidos hoy', valor: '342', delta: '-2.3%', color: '#f59e0b' },
            { icono: 'chart-line', label: 'Conversión', valor: '4.8%', delta: '+0.6pp', color: '#8b5cf6' },
          ],
        })],
      }),

      Seccion({
        titulo: '4 · Tamaños',
        descripcion: 'El icono hereda `font-size`, así que cualquier valor en px/em/rem funciona. Para mantener crispness, usa múltiplos de 4: 12, 16, 20, 24, 32, 40, 48, 64.',
        hijos: [SeccionTamanos({ render: renderFA, icono: 'rocket', color: COLOR })],
      }),

      Seccion({
        titulo: '5 · Colores',
        descripcion: 'El icono usa `color` (CSS) — combínalo con `var(--primary)`, success/warning/danger o gradientes con `background-clip: text`.',
        hijos: [SeccionColores({ render: renderFA, icono: 'heart' })],
      }),

      Seccion({
        titulo: '6 · Variantes (solid · regular · brands)',
        descripcion: 'Font Awesome agrupa por estilo: `fa-solid` (default · todos en free), `fa-regular` (outline, mayoría en Pro pero algunos free), `fa-brands` (logos: GitHub, Twitter, Discord…).',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' },
        }, [
          ['fa-solid', 'fa-solid', 'house', '#10b981', 'Solid · todos los iconos'],
          ['fa-regular', 'fa-regular', 'face-smile', '#f59e0b', 'Regular · outline (algunos)'],
          ['fa-brands', 'fa-brands', 'github', '#8b5cf6', 'Brands · logos de marcas'],
        ].map(([etq, claseStyle, ic, col, desc]) => crearEl('div', {
          style: { padding: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textAlign: 'center' },
        }, [
          crearEl('i', { class: `${claseStyle} fa-${ic}`, style: { fontSize: '40px', color: col, marginBlockEnd: '8px', display: 'block' } }),
          crearEl('div', { style: { fontFamily: 'monospace', fontSize: '12px', color: 'var(--muted-foreground)', marginBlockEnd: '4px' } }, [`<i class="${claseStyle} fa-${ic}"></i>`]),
          crearEl('div', { style: { fontSize: 'var(--text-xs)', color: 'var(--muted-foreground)' } }, [desc]),
        ]))),
        ],
      }),

      Seccion({
        titulo: '7 · Catálogo · click para copiar',
        descripcion: `${ICONOS.length} iconos curados de los más populares. Filtra escribiendo, click en cualquiera para copiar su clase \`fa-solid fa-NOMBRE\`.`,
        hijos: [Catalogo({
          iconos: ICONOS,
          render: renderFA,
          obtenerCodigo: (n) => `<i class="fa-solid fa-${n}"></i>`,
          color: COLOR,
        })],
      }),

    ],
  });
};
