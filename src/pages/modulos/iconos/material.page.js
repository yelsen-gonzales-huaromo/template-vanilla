/**
 * Material Symbols — la versión moderna (variable font) de Material Icons.
 * Tres estilos (Outlined / Rounded / Sharp), variable font con axes para
 * weight (100..700), fill (0/1), grade y optical size.
 *
 * Carga: 3 stylesheets de fonts.googleapis.com (uno por estilo).
 * Uso:   <span class="material-symbols-outlined">home</span>
 */
import { crearEl } from '../../../utils/helpers/dom.js';
import { senal, efecto } from '../../../utils/helpers/reactive.js';
import { PaginaShowcase, Seccion } from '../../../components/common/showcase/showcase.js';
import { cargarCss } from '../../../integrations/_loader.js';
import { corner4 } from '../../../components/ui/card/card-decoraciones.js';
import {
  HeroBanner, Catalogo, Receta,
  RecipeSidebar, RecipeBotones, RecipeKPI, RecipeBadges, RecipeToolbar, RecipeEmptyState, RecipeNotificacion,
  SeccionTamanos, SeccionColores,
} from './_compartido.js';

const COLOR = '#ea580c';

const URL_OUTLINED = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';
const URL_ROUNDED  = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';
const URL_SHARP    = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block';

// ~140 nombres curados (de los 3500+ que ofrece Material Symbols)
const ICONOS = [
  'home','dashboard','search','notifications','mail','account_circle','group','person_add','badge','admin_panel_settings',
  'menu','more_vert','more_horiz','close','check','add','remove','done','done_all','filter_list','sort','tune','expand_more','expand_less','chevron_left','chevron_right','arrow_back','arrow_forward','arrow_upward','arrow_downward','arrow_outward','open_in_new','launch','keyboard_arrow_down',
  'settings','build','tune','manage_accounts','password','lock','lock_open','vpn_key','security','shield',
  'favorite','star','bookmark','flag','share','link','content_copy','reply','forward',
  'shopping_cart','shopping_bag','receipt_long','sell','local_offer','redeem','payments','credit_card','account_balance_wallet','currency_exchange',
  'calendar_month','event','schedule','timer','alarm','history','update',
  'analytics','bar_chart','pie_chart','show_chart','timeline','trending_up','trending_down','speed','insights',
  'image','photo_camera','videocam','movie','music_note','headphones','mic','play_arrow','pause','skip_next','skip_previous','volume_up','volume_off',
  'description','article','attach_file','folder','folder_open','cloud','cloud_download','cloud_upload','download','upload','print','save',
  'visibility','visibility_off','edit','edit_note','draw','delete','delete_forever','restore','refresh','sync','autorenew','undo','redo',
  'info','help','warning','error','check_circle','cancel','task_alt','priority_high','support_agent','live_help',
  'public','language','translate','location_on','place','map','navigation','near_me','my_location','explore','route','directions',
  'wb_sunny','dark_mode','light_mode','nights_stay','cloud_queue','umbrella','thunderstorm','ac_unit','air','water_drop',
  'directions_car','directions_bus','directions_subway','directions_bike','flight','train','local_shipping','two_wheeler',
  'work','business','apartment','school','restaurant','local_hospital','store','factory',
  'rocket_launch','lightbulb','workspace_premium','emoji_events','military_tech','diamond',
  'storage','dns','code','terminal','computer','tablet_mac','smartphone','wifi','cable',
  'palette','brush','format_paint','colorize','design_services','crop',
  'thumb_up','thumb_down','sentiment_satisfied','sentiment_dissatisfied','mood','recommend','handshake',
  'bug_report','vaccines','medication','medical_services','psychology','accessibility',
  'tag','alternate_email','percent','attach_money','euro_symbol',
];

// Estado global de los axes (variantes y propiedades)
const ESTILO = senal('outlined');                     // outlined | rounded | sharp
const FILL = senal(0);                                // 0 | 1
const PESO = senal(400);                              // 100..700
const GRADO = senal(0);                               // -25 | 0 | 200

const claseEstilo = () => `material-symbols-${ESTILO.value}`;
const fontVarSettings = () => `'FILL' ${FILL.value}, 'wght' ${PESO.value}, 'GRAD' ${GRADO.value}, 'opsz' 24`;

const renderMS = (nombre, tamano = 24) => {
  const span = crearEl('span', {
    class: claseEstilo(),
    style: {
      fontSize: `${tamano}px`,
      width: `${tamano}px`, height: `${tamano}px`,
      lineHeight: '1', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontVariationSettings: fontVarSettings(),
      userSelect: 'none',
      // El font carga async; si aún no está, mostramos un cuadrito sutil
      transition: 'opacity 200ms ease',
    },
  }, [nombre]);
  // Asegura que cambios en estilo/fill/peso/grado actualicen este span
  efecto(() => {
    span.className = claseEstilo();
    span.style.fontVariationSettings = fontVarSettings();
  });
  return span;
};

const ALIAS_RECIPE = {
  alerta:    'warning',
  check:     'check_circle',
  cerrar:    'cancel',
  ojo:       'visibility',
  reloj:     'schedule',
  estrella:  'star',
};
const renderRecipe = (nombre, tamano) => renderMS(ALIAS_RECIPE[nombre] || nombre, tamano);

export default async () => {
  // Carga los 3 estilos (la primera carga de cada estilo bajará 1 woff2 por uso real)
  cargarCss(URL_OUTLINED);
  cargarCss(URL_ROUNDED);
  cargarCss(URL_SHARP);

  // Selector de estilo + axes
  const ESTILOS_OPC = [
    { id: 'outlined', t: 'Outlined' },
    { id: 'rounded',  t: 'Rounded' },
    { id: 'sharp',    t: 'Sharp' },
  ];

  const segmentoEstilo = crearEl('div', {
    style: { display: 'inline-flex', padding: '3px', background: 'var(--background)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', gap: '2px' },
  });
  ESTILOS_OPC.forEach((e) => {
    const b = crearEl('button', {
      style: { border: 0, padding: '6px 14px', borderRadius: '5px', background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: 'var(--muted-foreground)' },
      onClick: () => { ESTILO.value = e.id; },
    }, [e.t]);
    efecto(() => {
      const activo = ESTILO.value === e.id;
      b.style.background = activo ? COLOR : 'transparent';
      b.style.color = activo ? '#fff' : 'var(--muted-foreground)';
    });
    segmentoEstilo.appendChild(b);
  });

  const sliderFill = crearEl('input', {
    type: 'range', min: 0, max: 1, step: 1, value: 0,
    style: { width: '100px', accentColor: COLOR },
    onInput: (e) => { FILL.value = parseInt(e.currentTarget.value, 10); },
  });
  const sliderPeso = crearEl('input', {
    type: 'range', min: 100, max: 700, step: 100, value: 400,
    style: { width: '120px', accentColor: COLOR },
    onInput: (e) => { PESO.value = parseInt(e.currentTarget.value, 10); },
  });
  const lblFill = crearEl('span', { style: { fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', minWidth: '24px' } }, ['0']);
  const lblPeso = crearEl('span', { style: { fontSize: '11px', fontWeight: 700, fontFamily: 'monospace', minWidth: '32px' } }, ['400']);
  efecto(() => { lblFill.textContent = String(FILL.value); });
  efecto(() => { lblPeso.textContent = String(PESO.value); });

  const controlAxes = crearEl('div', {
    style: { display: 'flex', flexWrap: 'wrap', gap: '14px', padding: 'var(--space-3) var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', alignItems: 'center' },
  }, [
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
      crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Estilo']),
      segmentoEstilo,
    ]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
      crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Fill']),
      sliderFill, lblFill,
    ]),
    crearEl('div', { style: { display: 'flex', alignItems: 'center', gap: '6px' } }, [
      crearEl('span', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em' } }, ['Weight']),
      sliderPeso, lblPeso,
    ]),
  ]);

  return PaginaShowcase({
    titulo: 'Material Symbols',
    descripcion: 'La versión moderna del Material Icons clásico. Variable font con 4 axes (estilo · fill · peso · grado) que permite ajustar el icono en tiempo real con CSS. 3,500+ iconos en 3 estilos. Es lo que usa Google en sus apps actuales (Gmail, Calendar, Drive, Maps).',
    decoracion: corner4(),
    migas: [
      { etiqueta: 'Módulos', href: '#/modulos' },
      { etiqueta: 'Iconos', href: '#/modulos/iconos' },
    ],
    hijos: [

      Seccion({
        titulo: '1 · Hero · paleta · instalación',
        descripcion: 'Variable font: cargas un solo woff2 por estilo y los axes te dan infinitas variaciones sin descargar más. Estética moderna 2024 (no la antigua de Material 2).',
        hijos: [HeroBanner({
          marca: 'Material Symbols',
          color: COLOR,
          version: '2024',
          totalIconos: '3,500+',
          licencia: 'Apache 2.0',
          pesoCdn: 'sólo glifos usados (woff2 con range)',
          install: {
            descripcion: 'Stylesheets de Google Fonts — 1 por estilo. Sólo se descargan los glifos que usas (font-display: block).',
            snippet: '<link rel="stylesheet"\n      href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined">',
            uso: '<span class="material-symbols-outlined">home</span>\n<span class="material-symbols-rounded">favorite</span>\n<span class="material-symbols-sharp">settings</span>',
          },
          preview: [
            renderMS('rocket_launch', 32),
            renderMS('bolt', 32),
            renderMS('favorite', 32),
            renderMS('shopping_bag', 32),
            renderMS('insights', 32),
          ],
        })],
      }),

      Seccion({
        titulo: '2 · Controles del variable font',
        descripcion: 'Cambia los axes y todos los iconos de la página se actualizan en vivo. Esto es **único** de Material Symbols — ninguna otra librería tiene esta capacidad sin descargar fuentes adicionales.',
        hijos: [controlAxes],
      }),

      Seccion({
        titulo: '3 · Recipes — UI con Material Symbols',
        descripcion: 'Patrones idénticos a los que usan las apps de Google (Gmail, Calendar, Maps). Outlined es el default profesional; Rounded añade calidez; Sharp es más técnico.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-3)' },
        }, [
          Receta({
            titulo: 'Sidebar Gmail-style',
            descripcion: 'Estilo Material 3',
            hijo: RecipeSidebar({
              render: renderMS, color: COLOR,
              items: [
                { icono: 'inbox', etiqueta: 'Bandeja', badge: '12' },
                { icono: 'send', etiqueta: 'Enviados' },
                { icono: 'drafts', etiqueta: 'Borradores', badge: '3' },
                { icono: 'star', etiqueta: 'Destacados' },
                { icono: 'schedule', etiqueta: 'Programados' },
                { icono: 'archive', etiqueta: 'Archivados' },
              ],
            }),
          }),
          Receta({
            titulo: 'Botones FAB y outline',
            descripcion: 'Material Buttons',
            hijo: RecipeBotones({
              render: renderMS, color: COLOR,
              items: [
                { icono: 'add', etiqueta: 'Crear', primario: true },
                { icono: 'cloud_upload', etiqueta: 'Subir' },
                { icono: 'share', etiqueta: 'Compartir' },
                { icono: 'delete', etiqueta: 'Eliminar' },
              ],
            }),
          }),
          Receta({
            titulo: 'Toolbar Docs',
            descripcion: 'Editor de texto',
            hijo: RecipeToolbar({
              render: renderMS, color: COLOR,
              items: [
                { icono: 'format_bold', titulo: 'Negrita' },
                { icono: 'format_italic', titulo: 'Cursiva' },
                { icono: 'format_underlined', titulo: 'Subrayado' },
                { icono: 'format_list_bulleted', titulo: 'Lista' },
                { icono: 'link', titulo: 'Enlace' },
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
            descripcion: 'Estilo Material 3',
            hijo: RecipeNotificacion({ render: renderRecipe, color: COLOR }),
          }),
          Receta({
            titulo: 'Empty state',
            descripcion: 'Sin contenido',
            hijo: RecipeEmptyState({
              render: renderMS, color: COLOR,
              icono: 'inbox', titulo: 'No hay nada por aquí',
              descripcion: 'Cuando recibas mensajes los verás en esta lista.',
            }),
          }),
        ])],
      }),

      Seccion({
        titulo: '4 · KPI cards — Material 3 style',
        descripcion: 'Material Symbols rinde precioso a 24px (el tamaño "natural" del optical size axis).',
        hijos: [RecipeKPI({
          render: renderMS, color: COLOR,
          items: [
            { icono: 'trending_up', label: 'Ingresos', valor: '$48.2K', delta: '+12.4%', color: '#10b981' },
            { icono: 'group', label: 'Usuarios', valor: '1,247', delta: '+8.1%', color: COLOR },
            { icono: 'shopping_bag', label: 'Pedidos', valor: '342', delta: '-2.3%', color: '#f59e0b' },
            { icono: 'speed', label: 'Performance', valor: '98.4%', delta: '+0.6pp', color: '#06b6d4' },
          ],
        })],
      }),

      Seccion({
        titulo: '5 · Comparativa de los 3 estilos',
        descripcion: 'El mismo icono en los 3 estilos — Outlined (lineal), Rounded (esquinas suaves), Sharp (esquinas agudas y técnicas). Aplica el que mejor combine con tu tipografía.',
        hijos: [crearEl('div', {
          style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' },
        }, ['favorite', 'home', 'settings', 'shopping_bag', 'rocket_launch'].map((nombre) => crearEl('div', {
          style: { padding: 'var(--space-4)', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' },
        }, [
          crearEl('div', { style: { fontSize: '11px', fontWeight: 700, color: 'var(--muted-foreground)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBlockEnd: '12px' } }, [nombre]),
          crearEl('div', { style: { display: 'flex', justifyContent: 'space-around', color: COLOR } }, [
            crearEl('div', { style: { textAlign: 'center' } }, [
              crearEl('span', { class: 'material-symbols-outlined', style: { fontSize: '36px' } }, [nombre]),
              crearEl('div', { style: { fontSize: '10px', color: 'var(--muted-foreground)', marginBlockStart: '4px' } }, ['outlined']),
            ]),
            crearEl('div', { style: { textAlign: 'center' } }, [
              crearEl('span', { class: 'material-symbols-rounded', style: { fontSize: '36px' } }, [nombre]),
              crearEl('div', { style: { fontSize: '10px', color: 'var(--muted-foreground)', marginBlockStart: '4px' } }, ['rounded']),
            ]),
            crearEl('div', { style: { textAlign: 'center' } }, [
              crearEl('span', { class: 'material-symbols-sharp', style: { fontSize: '36px' } }, [nombre]),
              crearEl('div', { style: { fontSize: '10px', color: 'var(--muted-foreground)', marginBlockStart: '4px' } }, ['sharp']),
            ]),
          ]),
        ])))],
      }),

      Seccion({
        titulo: '6 · Tamaños',
        descripcion: 'El optical size axis (`opsz`) ajusta detalle automáticamente al tamaño — los iconos pequeños se ven más densos para mantener legibilidad.',
        hijos: [SeccionTamanos({ render: renderMS, icono: 'rocket_launch', color: COLOR })],
      }),

      Seccion({
        titulo: '7 · Colores',
        descripcion: 'Heredan `color` igual que cualquier glifo de fuente.',
        hijos: [SeccionColores({ render: renderMS, icono: 'favorite' })],
      }),

      Seccion({
        titulo: '8 · Catálogo · click para copiar',
        descripcion: `${ICONOS.length} iconos curados de los 3,500+ disponibles. Las opciones de estilo y axes definidas arriba se aplican aquí también — cambia "Estilo: rounded" para ver el catálogo redondeado.`,
        hijos: [Catalogo({
          iconos: ICONOS,
          render: renderMS,
          obtenerCodigo: (n) => `<span class="material-symbols-${ESTILO.value}">${n}</span>`,
          color: COLOR,
        })],
      }),

    ],
  });
};
