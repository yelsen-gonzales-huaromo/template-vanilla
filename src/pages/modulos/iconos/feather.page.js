/**
 * Feather Icons — set minimalista de 287 iconos SVG.
 *
 * Carga: https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/dist/feather.min.js
 * Uso:   feather.icons['home'].toSvg({ width, height, color })
 *        — devuelve un string SVG que insertamos en el DOM.
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { cargarLib } from '../../../integrations/_loader.js';
import { corner3 } from '../../../components/ui/card/card-decoraciones.js';
import {
  HeroBanner, Catalogo, Receta,
  RecipeSidebar, RecipeBotones, RecipeKPI, RecipeBadges, RecipeToolbar, RecipeEmptyState, RecipeNotificacion,
  SeccionTamanos, SeccionColores,
} from './_compartido.js';

const COLOR = '#0ea5e9';
const FEATHER_URL = 'https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/dist/feather.min.js';

// Lista completa Feather (287 iconos)
const ICONOS = [
  'activity','airplay','alert-circle','alert-octagon','alert-triangle','align-center','align-justify','align-left','align-right','anchor','aperture','archive','arrow-down','arrow-down-circle','arrow-down-left','arrow-down-right','arrow-left','arrow-left-circle','arrow-right','arrow-right-circle','arrow-up','arrow-up-circle','arrow-up-left','arrow-up-right','at-sign','award','bar-chart','bar-chart-2','battery','battery-charging','bell','bell-off','bluetooth','bold','book','book-open','bookmark','box','briefcase','calendar','camera','camera-off','cast','check','check-circle','check-square','chevron-down','chevron-left','chevron-right','chevron-up','chevrons-down','chevrons-left','chevrons-right','chevrons-up','chrome','circle','clipboard','clock','cloud','cloud-drizzle','cloud-lightning','cloud-off','cloud-rain','cloud-snow','code','codepen','codesandbox','coffee','columns','command','compass','copy','corner-down-left','corner-down-right','corner-left-down','corner-left-up','corner-right-down','corner-right-up','corner-up-left','corner-up-right','cpu','credit-card','crop','crosshair','database','delete','disc','divide','divide-circle','divide-square','dollar-sign','download','download-cloud','dribbble','droplet','edit','edit-2','edit-3','external-link','eye','eye-off','facebook','fast-forward','feather','figma','file','file-minus','file-plus','file-text','film','filter','flag','folder','folder-minus','folder-plus','framer','frown','gift','git-branch','git-commit','git-merge','git-pull-request','github','gitlab','globe','grid','hard-drive','hash','headphones','heart','help-circle','hexagon','home','image','inbox','info','instagram','italic','key','layers','layout','life-buoy','link','link-2','linkedin','list','loader','lock','log-in','log-out','mail','map','map-pin','maximize','maximize-2','meh','menu','message-circle','message-square','mic','mic-off','minimize','minimize-2','minus','minus-circle','minus-square','monitor','moon','more-horizontal','more-vertical','mouse-pointer','move','music','navigation','navigation-2','octagon','package','paperclip','pause','pause-circle','pen-tool','percent','phone','phone-call','phone-forwarded','phone-incoming','phone-missed','phone-off','phone-outgoing','pie-chart','play','play-circle','plus','plus-circle','plus-square','pocket','power','printer','radio','refresh-ccw','refresh-cw','repeat','rewind','rotate-ccw','rotate-cw','rss','save','scissors','search','send','server','settings','share','share-2','shield','shield-off','shopping-bag','shopping-cart','shuffle','sidebar','skip-back','skip-forward','slack','slash','sliders','smartphone','smile','speaker','square','star','stop-circle','sun','sunrise','sunset','table','tablet','tag','target','terminal','thermometer','thumbs-down','thumbs-up','toggle-left','toggle-right','tool','trash','trash-2','trello','trending-down','trending-up','triangle','truck','tv','twitch','twitter','type','umbrella','underline','unlock','upload','upload-cloud','user','user-check','user-minus','user-plus','user-x','users','video','video-off','voicemail','volume','volume-1','volume-2','volume-x','watch','wifi','wifi-off','wind','x','x-circle','x-octagon','x-square','youtube','zap','zap-off','zoom-in','zoom-out',
];

// Cache de SVGs ya generados para no regenerar
const cache = new Map();

const renderFeather = (nombre, tamano = 24) => {
  const claveCache = `${nombre}_${tamano}`;
  if (cache.has(claveCache)) return cache.get(claveCache).cloneNode(true);

  const span = crearEl('span', {
    style: {
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: `${tamano}px`, height: `${tamano}px`,
      color: 'currentColor',
    },
  });

  if (window.feather && window.feather.icons[nombre]) {
    span.innerHTML = window.feather.icons[nombre].toSvg({
      width: tamano, height: tamano,
      'stroke-width': 2,
    });
    cache.set(claveCache, span);
  } else {
    // Antes de que feather cargue, mostramos un placeholder
    span.style.background = 'color-mix(in srgb, currentColor 12%, transparent)';
    span.style.borderRadius = '4px';
  }
  return span;
};

const ALIAS_RECIPE = {
  alerta:    'alert-triangle',
  check:     'check-circle',
  cerrar:    'x-circle',
  ojo:       'eye',
  reloj:     'clock',
  estrella:  'star',
};
const renderRecipe = (nombre, tamano) => renderFeather(ALIAS_RECIPE[nombre] || nombre, tamano);

export default async () => {
  // Esperamos que feather cargue antes de armar la página para que los SVGs salgan ya
  await cargarLib({ scripts: FEATHER_URL, global: 'feather' });

  return PaginaShowcase({
    titulo: 'Feather Icons',
    descripcion: 'Set minimalista de 287 iconos SVG con stroke uniforme de 2px. Diseñado por Cole Bemis con estética limpia tipo Linear / Stripe / Vercel. Licencia MIT, super liviano (~14KB JS minified).',
    decoracion: corner3(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Iconos', href: '#/modulos/iconos' },
    ],
    hijos: [

      Seccion({
        titulo: '1 · Hero · paleta · instalación',
        descripcion: 'Feather expone los iconos como SVGs JS — `feather.icons["home"].toSvg()` te devuelve el string SVG directamente. Sin webfont, sin clases, sin clipping. Tamaño y color totalmente programáticos.',
        hijos: [HeroBanner({
          marca: 'Feather Icons',
          color: COLOR,
          version: '4.29.2',
          totalIconos: '287',
          licencia: 'MIT',
          pesoCdn: '~14KB JS minified',
          install: {
            descripcion: 'Cargas el JS y luego usas `feather.icons[nombre].toSvg({...})` para insertar el SVG en cualquier nodo.',
            snippet: '<script src="https://cdn.jsdelivr.net/npm/feather-icons@4.29.2/dist/feather.min.js"></script>',
            uso: 'div.innerHTML = feather.icons[\'home\'].toSvg({\n  width: 24, height: 24,\n  \'stroke-width\': 2,\n  color: \'#3b82f6\',\n});',
          },
          preview: [
            renderFeather('zap', 28),
            renderFeather('award', 28),
            renderFeather('heart', 28),
            renderFeather('shopping-bag', 28),
            renderFeather('trending-up', 28),
          ],
        })],
      }),

      Seccion({
        titulo: '2 · Recipes — UI patterns con Feather',
        descripcion: 'Feather brilla en interfaces minimalistas: dashboards de SaaS, herramientas de productividad, pages limpios sin barroquismo. Estos son los patrones más comunes.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
        }, [
          Receta({
            titulo: 'Sidebar minimalista',
            descripcion: 'Estilo Linear / Notion',
            hijo: RecipeSidebar({
              render: renderFeather, color: COLOR,
              items: [
                { icono: 'home', etiqueta: 'Inicio' },
                { icono: 'inbox', etiqueta: 'Bandeja', badge: '3' },
                { icono: 'calendar', etiqueta: 'Calendario' },
                { icono: 'users', etiqueta: 'Equipo' },
                { icono: 'bar-chart-2', etiqueta: 'Analítica' },
                { icono: 'settings', etiqueta: 'Ajustes' },
              ],
            }),
          }),
          Receta({
            titulo: 'Botones',
            descripcion: 'Acciones primarias y secundarias',
            hijo: RecipeBotones({
              render: renderFeather, color: COLOR,
              items: [
                { icono: 'plus', etiqueta: 'Nueva nota', primario: true },
                { icono: 'upload-cloud', etiqueta: 'Subir' },
                { icono: 'share-2', etiqueta: 'Compartir' },
                { icono: 'trash-2', etiqueta: 'Eliminar' },
              ],
            }),
          }),
          Receta({
            titulo: 'Toolbar',
            descripcion: 'Editor de texto',
            hijo: RecipeToolbar({
              render: renderFeather, color: COLOR,
              items: [
                { icono: 'bold', titulo: 'Negrita' },
                { icono: 'italic', titulo: 'Cursiva' },
                { icono: 'underline', titulo: 'Subrayado' },
                { icono: 'list', titulo: 'Lista' },
                { icono: 'link-2', titulo: 'Enlace' },
                { icono: 'image', titulo: 'Imagen' },
                { icono: 'code', titulo: 'Código' },
              ],
            }),
          }),
          Receta({
            titulo: 'Status badges',
            descripcion: 'Estados con icono',
            hijo: RecipeBadges({ render: renderRecipe }),
          }),
          Receta({
            titulo: 'Notificación',
            descripcion: 'Alerta inline',
            hijo: RecipeNotificacion({ render: renderRecipe, color: COLOR }),
          }),
          Receta({
            titulo: 'Empty state',
            descripcion: 'Sin contenido aún',
            hijo: RecipeEmptyState({
              render: renderFeather, color: COLOR,
              icono: 'inbox', titulo: 'Tu inbox está limpio',
              descripcion: 'Cuando llegue algo nuevo lo verás aquí.',
            }),
          }),
        ])],
      }),

      Seccion({
        titulo: '3 · KPI cards — dashboard SaaS',
        descripcion: 'El stroke fino y consistente de Feather los hace ideales para tarjetas de métricas: legibles a tamaños pequeños sin perder personalidad.',
        hijos: [RecipeKPI({
          render: renderFeather, color: COLOR,
          items: [
            { icono: 'dollar-sign', label: 'Ingresos', valor: '$48.2K', delta: '+12.4%', color: '#10b981' },
            { icono: 'users', label: 'Usuarios', valor: '1,247', delta: '+8.1%', color: COLOR },
            { icono: 'shopping-bag', label: 'Pedidos', valor: '342', delta: '-2.3%', color: '#f59e0b' },
            { icono: 'zap', label: 'Performance', valor: '98.4%', delta: '+0.6pp', color: '#8b5cf6' },
          ],
        })],
      }),

      Seccion({
        titulo: '4 · Stroke width · espesor de línea',
        descripcion: 'Una de las gracias de Feather: el `stroke-width` es ajustable. Más fino = más elegante; más grueso = más legible a tamaños pequeños.',
        hijos: [crearEl('div', {
          style: { display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', padding: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', justifyContent: 'center', alignItems: 'center' },
        }, [1, 1.5, 2, 2.5, 3].map((sw) => {
          const span = crearEl('div', {
            style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', minWidth: '80px', color: COLOR },
          });
          const ico = crearEl('span', {
            style: { display: 'inline-flex', width: '48px', height: '48px' },
          });
          if (window.feather?.icons.zap) {
            ico.innerHTML = window.feather.icons.zap.toSvg({ width: 48, height: 48, 'stroke-width': sw });
          }
          span.appendChild(ico);
          span.appendChild(crearEl('span', { style: { fontSize: '12px', color: 'var(--muted-foreground)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' } }, [`stroke-width: ${sw}`]));
          return span;
        }))],
      }),

      Seccion({
        titulo: '5 · Tamaños',
        descripcion: 'Como cada icono es un SVG con `width/height` programáticos, escalan nítidos en cualquier tamaño.',
        hijos: [SeccionTamanos({ render: renderFeather, icono: 'zap', color: COLOR })],
      }),

      Seccion({
        titulo: '6 · Colores',
        descripcion: 'Los SVGs heredan `currentColor` por defecto, así que basta con `color: ...` en el padre.',
        hijos: [SeccionColores({ render: renderFeather, icono: 'heart' })],
      }),

      Seccion({
        titulo: '7 · Catálogo · click para copiar',
        descripcion: `Los 287 iconos completos. Filtra por nombre, click para copiar el snippet \`feather.icons['NOMBRE'].toSvg()\`.`,
        hijos: [Catalogo({
          iconos: ICONOS,
          render: renderFeather,
          obtenerCodigo: (n) => `feather.icons['${n}'].toSvg({ width: 24, height: 24 })`,
          color: COLOR,
        })],
      }),

    ],
  });
};
