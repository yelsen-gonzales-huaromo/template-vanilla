/**
 * Índice del catálogo de componentes — listado con cards navegables.
 * Cada card abre la página individual del componente con sus ejemplos.
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { senal, efecto } from '../../utils/helpers/reactive.js';
import { Migas } from '../../layouts/components/breadcrumbs/breadcrumbs.js';
import { TituloPagina } from '../../components/common/page-title/page-title.js';
import { Icono } from '../../components/ui/icon/icons.js';
import { Insignia } from '../../components/ui/badge/badge.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';

const N = NOMBRES_RUTAS;

// Catálogo del índice — sólo componentes que YA tienen página showcase.
// Las que aún no, se irán dando de alta en próximos turnos.
const CATALOGO = [
  { ruta: N.COMP_ACORDEON,   titulo: 'Acordeón',    icono: 'panel',        descripcion: 'Secciones colapsables con animación.', color: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { ruta: N.COMP_ALERTAS,    titulo: 'Alertas',     icono: 'alerta',       descripcion: 'Mensajes contextuales con 4 variantes.', color: 'linear-gradient(135deg,#f59e0b,#d97706)' },
  { ruta: N.COMP_ANCLA,      titulo: 'Ancla',       icono: 'flecha_r',     descripcion: 'Enlaces y CTAs textuales.',                color: 'linear-gradient(135deg,#fb923c,#ea580c)' },
  { ruta: N.COMP_ICONOS_ANIM,titulo: 'Iconos animados', icono: 'estrella', descripcion: 'SVG con animaciones reutilizables.',       color: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
  { ruta: N.COMP_FONDO,      titulo: 'Fondo',       icono: 'paleta',       descripcion: 'Hero con video, imagen, color o patrón.',  color: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  { ruta: N.COMP_BADGES,     titulo: 'Insignias',   icono: 'estrella',     descripcion: 'Etiquetas semánticas y con punto.',       color: 'linear-gradient(135deg,#a78bfa,#8b5cf6)' },
  { ruta: N.COMP_BARRA_INF,  titulo: 'Barra inferior', icono: 'menu_3',    descripcion: 'Nav fija al pie estilo móvil.',           color: 'linear-gradient(135deg,#22d3ee,#0891b2)' },
  { ruta: N.COMP_MIGAS,      titulo: 'Breadcrumbs', icono: 'flecha_r',     descripcion: 'Ruta jerárquica clickeable.',             color: 'linear-gradient(135deg,#fb7185,#e11d48)' },
  { ruta: N.COMP_BOTONES,    titulo: 'Botones',     icono: 'mas',          descripcion: '6 variantes × 3 tamaños + iconos.',       color: 'linear-gradient(135deg,#10b981,#059669)' },
  { ruta: N.COMP_CALENDAR,   titulo: 'Calendario',  icono: 'calendario',   descripcion: 'Mini-widget reactivo de calendario.',     color: 'linear-gradient(135deg,#60a5fa,#2563eb)' },
  { ruta: N.COMP_CARDS,      titulo: 'Tarjetas',    icono: 'pagina',       descripcion: 'Contenedor con 9 variantes visuales.',    color: 'linear-gradient(135deg,#06b6d4,#0891b2)' },
  { ruta: N.COMP_CARRUSEL_BS,titulo: 'Carrusel',     icono: 'flechas_lr', descripcion: 'Slider con autoplay, dots y flechas.',     color: 'linear-gradient(135deg,#8b5cf6,#6d28d9)' },
  { ruta: N.COMP_COLAPSO,    titulo: 'Colapso',     icono: 'chevron_d',    descripcion: 'Show/hide reactivo simple.',              color: 'linear-gradient(135deg,#34d399,#059669)' },
  { ruta: N.COMP_COOKIE,     titulo: 'Cookie notice', icono: 'info',       descripcion: 'Banner de consentimiento persistente.',    color: 'linear-gradient(135deg,#fcd34d,#d97706)' },
  { ruta: N.COMP_CONTADOR,   titulo: 'Countup',     icono: 'analitica',    descripcion: 'Números animados al entrar al viewport.', color: 'linear-gradient(135deg,#10b981,#047857)' },
  { ruta: N.COMP_DROPDOWNS,  titulo: 'Menús desplegables', icono: 'menu_3', descripcion: 'Listas de acciones contextuales.',         color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
  { ruta: N.COMP_LIST_GROUP, titulo: 'Lista de grupo', icono: 'menu_3',    descripcion: 'Lista con divisores y items activos.',     color: 'linear-gradient(135deg,#fbbf24,#d97706)' },
  { ruta: N.COMP_MODALES,    titulo: 'Modales',     icono: 'monitor',      descripcion: 'Diálogos centrados con backdrop.',         color: 'linear-gradient(135deg,#f43f5e,#e11d48)' },
  { ruta: N.COMP_NAVS,       titulo: 'Navs',        icono: 'panel_l',      descripcion: 'Patrones de navegación.',                  color: 'linear-gradient(135deg,#06b6d4,#0e7490)' },
  { ruta: N.COMP_NAVBAR,     titulo: 'Navbar',      icono: 'panel',        descripcion: 'Barra superior con marca + acciones.',     color: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' },
  { ruta: N.COMP_NAV_VERT,   titulo: 'Nav vertical',icono: 'panel_l',      descripcion: 'Layout sidebar + topbar (default).',       color: 'linear-gradient(135deg,#60a5fa,#3b82f6)' },
  { ruta: N.COMP_NAV_TOP,    titulo: 'Top nav',     icono: 'menu_3',       descripcion: 'Sólo barra superior.',                     color: 'linear-gradient(135deg,#a78bfa,#7c3aed)' },
  { ruta: N.COMP_NAV_DOBLE,  titulo: 'Double top',  icono: 'menu_3',       descripcion: 'Dos barras superiores apiladas.',          color: 'linear-gradient(135deg,#22d3ee,#0e7490)' },
  { ruta: N.COMP_NAV_COMBO,  titulo: 'Combo nav',   icono: 'panel_l',      descripcion: 'Topbar + sidebar contraído.',              color: 'linear-gradient(135deg,#fb7185,#be123c)' },
  { ruta: N.COMP_AVATAR,     titulo: 'Avatares',    icono: 'perfil',       descripcion: 'Iniciales o imagen, con grupos.',          color: 'linear-gradient(135deg,#2dd4bf,#14b8a6)' },
  { ruta: N.COMP_IMAGENES,   titulo: 'Imágenes',    icono: 'pagina',       descripcion: 'Estilos comunes de imagen.',               color: 'linear-gradient(135deg,#34d399,#047857)' },
  { ruta: N.COMP_FIGURAS,    titulo: 'Figuras',     icono: 'pagina',       descripcion: 'Imagen + caption asociado.',               color: 'linear-gradient(135deg,#fbbf24,#b45309)' },
  { ruta: N.COMP_HOVERBOX,   titulo: 'Hoverbox',    icono: 'ojo',          descripcion: 'Imagen con overlay al hover.',             color: 'linear-gradient(135deg,#a78bfa,#6d28d9)' },
  { ruta: N.COMP_LIGHTBOX,   titulo: 'Lightbox',    icono: 'ojo',          descripcion: 'Visor de imágenes pantalla completa.',     color: 'linear-gradient(135deg,#f472b6,#be185d)' },
  { ruta: N.COMP_PROGRESS,   titulo: 'Barra de progreso', icono: 'flecha_r', descripcion: 'Indicador horizontal reactivo.',         color: 'linear-gradient(135deg,#fb7185,#e11d48)' },
  { ruta: N.COMP_PLACEHOLDER,titulo: 'Placeholder', icono: 'reloj',        descripcion: 'Esqueletos para feedback de carga.',       color: 'linear-gradient(135deg,#94a3b8,#475569)' },
  { ruta: N.COMP_PAGINACION, titulo: 'Paginación',  icono: 'menu_3',       descripcion: 'Navegación reactiva con elipsis.',         color: 'linear-gradient(135deg,#a3e635,#84cc16)' },
  { ruta: N.COMP_POPOVERS,   titulo: 'Popovers',    icono: 'info',         descripcion: 'Como tooltip pero con click.',             color: 'linear-gradient(135deg,#22d3ee,#0e7490)' },
  { ruta: N.COMP_SCROLLSPY,  titulo: 'Scrollspy',   icono: 'analitica',    descripcion: 'Resalta nav según sección visible.',       color: 'linear-gradient(135deg,#10b981,#065f46)' },
  { ruta: N.COMP_SEARCH,     titulo: 'Búsqueda',    icono: 'busqueda',     descripcion: 'Filtros reactivos en vivo.',               color: 'linear-gradient(135deg,#60a5fa,#1d4ed8)' },
  { ruta: N.COMP_SORTABLE,   titulo: 'Sortable',    icono: 'menu_3',       descripcion: 'Drag-and-drop reordenable nativo.',        color: 'linear-gradient(135deg,#fbbf24,#a16207)' },
  { ruta: N.COMP_SPINNERS,   titulo: 'Spinners',    icono: 'reloj',        descripcion: 'Indicadores de carga + esqueletos.',       color: 'linear-gradient(135deg,#34d399,#10b981)' },
  { ruta: N.COMP_TABS,       titulo: 'Pestañas',    icono: 'panel_l',      descripcion: 'Navegación entre paneles, 3 variantes.',   color: 'linear-gradient(135deg,#818cf8,#6366f1)' },
  { ruta: N.COMP_TIMELINE,   titulo: 'Línea de tiempo', icono: 'reloj',     descripcion: 'Lista vertical cronológica.',             color: 'linear-gradient(135deg,#f472b6,#ec4899)' },
  { ruta: N.COMP_TOASTS,     titulo: 'Notificaciones', icono: 'campana',   descripcion: 'Mensajes flotantes apilables.',            color: 'linear-gradient(135deg,#22d3ee,#06b6d4)' },
  { ruta: N.COMP_TOOLTIPS,   titulo: 'Tooltips',    icono: 'info',         descripcion: 'Información contextual al hover.',         color: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
  { ruta: N.COMP_TREEVIEW,   titulo: 'Vista de árbol', icono: 'menu_3',    descripcion: 'Estructura jerárquica recursiva.',         color: 'linear-gradient(135deg,#10b981,#047857)' },
  { ruta: N.COMP_TYPED,      titulo: 'Texto tipeado', icono: 'texto_aa',   descripcion: 'Efecto máquina de escribir en bucle.',     color: 'linear-gradient(135deg,#fb7185,#9f1239)' },
  { ruta: N.COMP_VIDEO_EMBED,titulo: 'Video embed', icono: 'monitor',      descripcion: 'iframe con aspect-ratio 16/9.',            color: 'linear-gradient(135deg,#ef4444,#991b1b)' },
  { ruta: N.COMP_VIDEO_PLYR, titulo: 'Video Plyr',  icono: 'monitor',      descripcion: '<video> nativo + comparación con Plyr.',   color: 'linear-gradient(135deg,#a78bfa,#5b21b6)' },
];

// Búsqueda reactiva — input filtra el grid.
const filtro = senal('');

const card = (entrada) => {
  const path = RUTAS[entrada.ruta];
  return crearEl('a', {
    class: 'comp-card',
    href: path,
    onClick: (e) => { e.preventDefault(); navegarA(path); },
  }, [
    crearEl('span', {
      class: 'comp-card__icon',
      style: { background: entrada.color },
      'aria-hidden': 'true',
    }, [Icono(entrada.icono, { tamano: 22 })]),
    crearEl('div', { class: 'comp-card__cuerpo' }, [
      crearEl('strong', { class: 'comp-card__titulo' }, [entrada.titulo]),
      crearEl('p', { class: 'comp-card__descripcion' }, [entrada.descripcion]),
    ]),
    crearEl('span', { class: 'comp-card__caret', 'aria-hidden': 'true' }, [
      Icono('chevron_r', { tamano: 14 }),
    ]),
  ]);
};

export default async () => {
  const grid = crearEl('div', { class: 'comp-grid' });

  efecto(() => {
    const q = filtro.value.trim().toLowerCase();
    const visibles = q
      ? CATALOGO.filter((c) => c.titulo.toLowerCase().includes(q) || c.descripcion.toLowerCase().includes(q))
      : CATALOGO;
    if (!visibles.length) {
      grid.replaceChildren(crearEl('div', { class: 'comp-grid__vacio' }, ['Sin coincidencias para "' + q + '"']));
    } else {
      grid.replaceChildren(...visibles.map(card));
    }
  });

  const buscador = crearEl('input', {
    type: 'search',
    class: 'comp-buscador',
    placeholder: 'Buscar componente…',
    'aria-label': 'Buscar componente',
    onInput: (e) => { filtro.value = e.currentTarget.value; },
  });

  return crearEl('div', null, [
    Migas({ items: [{ etiqueta: 'Inicio', href: '/' }, { etiqueta: 'Componentes' }] }),
    TituloPagina({
      titulo: 'Catálogo de componentes',
      subtitulo: 'Cada componente tiene su página con ejemplos en vivo + código copiable.',
      acciones: Insignia({ texto: `${CATALOGO.length} componentes`, variante: 'muted' }),
    }),
    crearEl('div', { class: 'comp-toolbar' }, [buscador]),
    grid,
  ]);
};
