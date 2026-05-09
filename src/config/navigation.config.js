import { NOMBRES_RUTAS } from './routes.config.js';

const N = NOMBRES_RUTAS;

/**
 * Árbol de navegación — espejo del sidebar de Falcon.
 *
 * Cada entrada del array es una de:
 *   • { grupo: 'etiqueta' }                              — separador (label de grupo)
 *   • { id, etiqueta, icono, items: [...] }              — sección colapsable de primer nivel
 *
 * Dentro de `items` (recursivo):
 *   • { ruta, etiqueta, nuevo? }                         — link hoja
 *   • { id, etiqueta, items: [...] }                     — sub-rama colapsable
 *
 * Fuente única de verdad: consumido por el sidebar (renderizado), por el command
 * palette (búsqueda) y potencialmente por el nav-top (mega-menus).
 */
export const SECCIONES = [
  // ============================== Dashboard ==============================
  {
    id: 'paneles', etiqueta: 'Dashboard', icono: 'panel',
    items: [
      { ruta: N.PANEL,           etiqueta: 'Default' },
      { ruta: N.PANEL_ANALITICA, etiqueta: 'Analítica' },
      { ruta: N.PANEL_CRM,       etiqueta: 'CRM' },
      { ruta: N.PANEL_COMERCIO,  etiqueta: 'E-commerce' },
      { ruta: N.PANEL_LMS,       etiqueta: 'LMS', nuevo: true },
      { ruta: N.PANEL_PROYECTOS, etiqueta: 'Proyectos' },
      { ruta: N.PANEL_SAAS,      etiqueta: 'SaaS' },
      { ruta: N.PANEL_SOPORTE,   etiqueta: 'Soporte', nuevo: true },
    ],
  },

  // ================================= App =================================
  { grupo: 'App' },
  {
    id: 'app-chat', etiqueta: 'Chat', icono: 'chat', ruta: N.CHAT,
  },
  {
    id: 'app-kanban', etiqueta: 'Kanban', icono: 'kanban',
    items: [{ ruta: N.KANBAN, etiqueta: 'Kanban' }],
  },
  {
    id: 'app-calendario', etiqueta: 'Calendario', icono: 'calendar', ruta: N.CALENDARIO,
  },
  {
    id: 'app-email', etiqueta: 'Email', icono: 'correo',
    items: [
      { ruta: N.EMAIL,         etiqueta: 'Bandeja' },
      { ruta: N.EMAIL_LEER,    etiqueta: 'Leer correo' },
      { ruta: N.EMAIL_COMPOSE, etiqueta: 'Redactar' },
    ],
  },

  // =============================== Páginas ===============================
  { grupo: 'Páginas' },
  {
    id: 'pg-auth', etiqueta: 'Autenticación', icono: 'candado',
    items: [
      { id: 'auth-simple', etiqueta: 'Simple', items: [
        { ruta: N.AUTH_SIMPLE_INGRESAR,    etiqueta: 'Ingresar' },
        { ruta: N.AUTH_SIMPLE_SALIR,       etiqueta: 'Salir' },
        { ruta: N.AUTH_SIMPLE_REGISTRAR,   etiqueta: 'Registrar' },
        { ruta: N.AUTH_SIMPLE_RECUPERAR,   etiqueta: 'Recuperar' },
        { ruta: N.AUTH_SIMPLE_CONFIRMAR,   etiqueta: 'Confirmar' },
        { ruta: N.AUTH_SIMPLE_RESTABLECER, etiqueta: 'Restablecer' },
        { ruta: N.AUTH_SIMPLE_BLOQUEO,     etiqueta: 'Bloqueo' },
      ]},
      { id: 'auth-card', etiqueta: 'Card', items: [
        { ruta: N.AUTH_CARD_INGRESAR,    etiqueta: 'Ingresar' },
        { ruta: N.AUTH_CARD_SALIR,       etiqueta: 'Salir' },
        { ruta: N.AUTH_CARD_REGISTRAR,   etiqueta: 'Registrar' },
        { ruta: N.AUTH_CARD_RECUPERAR,   etiqueta: 'Recuperar' },
        { ruta: N.AUTH_CARD_CONFIRMAR,   etiqueta: 'Confirmar' },
        { ruta: N.AUTH_CARD_RESTABLECER, etiqueta: 'Restablecer' },
        { ruta: N.AUTH_CARD_BLOQUEO,     etiqueta: 'Bloqueo' },
      ]},
      { id: 'auth-split', etiqueta: 'Split', items: [
        { ruta: N.AUTH_SPLIT_INGRESAR,    etiqueta: 'Ingresar' },
        { ruta: N.AUTH_SPLIT_SALIR,       etiqueta: 'Salir' },
        { ruta: N.AUTH_SPLIT_REGISTRAR,   etiqueta: 'Registrar' },
        { ruta: N.AUTH_SPLIT_RECUPERAR,   etiqueta: 'Recuperar' },
        { ruta: N.AUTH_SPLIT_CONFIRMAR,   etiqueta: 'Confirmar' },
        { ruta: N.AUTH_SPLIT_RESTABLECER, etiqueta: 'Restablecer' },
        { ruta: N.AUTH_SPLIT_BLOQUEO,     etiqueta: 'Bloqueo' },
      ]},
      { ruta: N.ASISTENTE_REGISTRO, etiqueta: 'Asistente' },
      { ruta: N.AUTH_MODAL,         etiqueta: 'Modal' },
    ],
  },
  {
    id: 'pg-usuario', etiqueta: 'Usuario', icono: 'perfil',
    items: [
      { ruta: N.PERFIL,  etiqueta: 'Perfil' },
      { ruta: N.AJUSTES, etiqueta: 'Ajustes' },
    ],
  },
  {
    id: 'pg-errores', etiqueta: 'Errores', icono: 'alerta',
    items: [
      { ruta: N.ERROR_401,           etiqueta: '401 · Sesión requerida' },
      { ruta: N.ERROR_403,           etiqueta: '403 · Acceso denegado' },
      { ruta: N.ERROR_404,           etiqueta: '404 · No encontrado' },
      { ruta: N.ERROR_500,           etiqueta: '500 · Error del servidor' },
      { ruta: N.ERROR_503,           etiqueta: '503 · No disponible' },
      { ruta: N.ERROR_MANTENIMIENTO, etiqueta: 'Mantenimiento' },
      { ruta: N.ERROR_OFFLINE,       etiqueta: 'Sin conexión' },
    ],
  },

  // =============================== Módulos ===============================
  { grupo: 'Módulos' },
  {
    id: 'mod-forms', etiqueta: 'Forms', icono: 'formularios',
    items: [
      { id: 'form-basic', etiqueta: 'Basic', items: [
        { ruta: N.FORM_CONTROL,     etiqueta: 'Form control' },
        { ruta: N.FORM_INPUT_GROUP, etiqueta: 'Input group' },
        { ruta: N.FORM_SELECT,      etiqueta: 'Select' },
        { ruta: N.FORM_CHECKS,      etiqueta: 'Checks' },
        { ruta: N.FORM_RANGE,       etiqueta: 'Range' },
        { ruta: N.FORM_LAYOUT,      etiqueta: 'Layout' },
      ]},
      { id: 'form-advance', etiqueta: 'Advance', items: [
        { ruta: N.FORM_ADV_SELECT,   etiqueta: 'Advance select' },
        { ruta: N.FORM_DATE_PICKER,  etiqueta: 'Date picker' },
        { ruta: N.FORM_EDITOR,       etiqueta: 'Editor' },
        { ruta: N.FORM_EMOJI,        etiqueta: 'Emoji button' },
        { ruta: N.FORM_UPLOADER,     etiqueta: 'File uploader' },
        { ruta: N.FORM_INPUT_MASK,   etiqueta: 'Input mask' },
        { ruta: N.FORM_RANGE_SLIDER, etiqueta: 'Range slider' },
        { ruta: N.FORM_RATING,       etiqueta: 'Rating' },
        { ruta: N.FORM_CROPPER,      etiqueta: 'Recortar imagen' },
      ]},
      { ruta: N.FORM_FLOATING,   etiqueta: 'Floating labels' },
      { ruta: N.FORM_WIZARD,     etiqueta: 'Wizard' },
      { ruta: N.FORM_VALIDACION, etiqueta: 'Validación' },
    ],
  },
  {
    id: 'mod-tables', etiqueta: 'Tables', icono: 'tablas',
    items: [
      { ruta: N.TABLA_BASICA,   etiqueta: 'Basic tables' },
      { ruta: N.TABLA_AVANZADA, etiqueta: 'Advance tables' },
      { ruta: N.TABLA_BULK,     etiqueta: 'Bulk select' },
    ],
  },
  {
    id: 'mod-charts', etiqueta: 'Charts', icono: 'graficos',
    items: [
      { ruta: N.CHART_CHARTJS, etiqueta: 'Chart.js' },
      { ruta: N.CHART_D3,      etiqueta: 'D3.js', nuevo: true },
      { id: 'echart', etiqueta: 'ECharts', items: [
        { ruta: N.CHART_ECHART_LINE,       etiqueta: 'Línea' },
        { ruta: N.CHART_ECHART_BAR,        etiqueta: 'Barras' },
        { ruta: N.CHART_ECHART_VELA,       etiqueta: 'Velas' },
        { ruta: N.CHART_ECHART_GEO,        etiqueta: 'Geo map' },
        { ruta: N.CHART_ECHART_DISPERSION, etiqueta: 'Dispersión' },
        { ruta: N.CHART_ECHART_PASTEL,     etiqueta: 'Pastel' },
        { ruta: N.CHART_ECHART_GAUGE,      etiqueta: 'Gauge' },
        { ruta: N.CHART_ECHART_RADAR,      etiqueta: 'Radar' },
        { ruta: N.CHART_ECHART_HEATMAP,    etiqueta: 'Heatmap' },
        { ruta: N.CHART_ECHART_USO,        etiqueta: 'Cómo usar' },
      ]},
    ],
  },
  {
    id: 'mod-icons', etiqueta: 'Iconos', icono: 'iconos',
    items: [
      { ruta: N.ICON_FONT_AWESOME, etiqueta: 'Font Awesome' },
      { ruta: N.ICON_BOOTSTRAP,    etiqueta: 'Bootstrap icons' },
      { ruta: N.ICON_FEATHER,      etiqueta: 'Feather' },
      { ruta: N.ICON_MATERIAL,     etiqueta: 'Material icons' },
    ],
  },
  {
    id: 'mod-maps', etiqueta: 'Mapas', icono: 'mapas',
    items: [
      { ruta: N.MAPA_GOOGLE,  etiqueta: 'Google map' },
      { ruta: N.MAPA_LEAFLET, etiqueta: 'Leaflet' },
    ],
  },
  {
    id: 'mod-components', etiqueta: 'Components', icono: 'componentes',
    items: [
      { ruta: N.COMP_ACORDEON,    etiqueta: 'Acordeón' },
      { ruta: N.COMP_ALERTAS,     etiqueta: 'Alertas' },
      { ruta: N.COMP_AVISOS,      etiqueta: 'Avisos modales' },
      { ruta: N.COMP_ANCLA,       etiqueta: 'Ancla' },
      { ruta: N.COMP_ICONOS_ANIM, etiqueta: 'Iconos animados' },
      { ruta: N.COMP_FONDO,       etiqueta: 'Fondo' },
      { ruta: N.COMP_BADGES,      etiqueta: 'Badges' },
      { ruta: N.COMP_BARRA_INF,   etiqueta: 'Barra inferior', nuevo: true },
      { ruta: N.COMP_MIGAS,       etiqueta: 'Breadcrumbs' },
      { ruta: N.COMP_BOTONES,     etiqueta: 'Botones' },
      { ruta: N.COMP_CALENDAR,    etiqueta: 'Calendario' },
      { ruta: N.COMP_CARDS,       etiqueta: 'Cards' },
      { ruta: N.COMP_CARRUSEL_BS, etiqueta: 'Carrusel' },
      { ruta: N.COMP_COLAPSO,     etiqueta: 'Colapso' },
      { ruta: N.COMP_COOKIE,      etiqueta: 'Cookie notice' },
      { ruta: N.COMP_CONTADOR,    etiqueta: 'Countup' },
      { ruta: N.COMP_DROPDOWNS,   etiqueta: 'Dropdowns' },
      { ruta: N.COMP_LIST_GROUP,  etiqueta: 'List group' },
      { ruta: N.COMP_MODALES,     etiqueta: 'Modales' },
      { id: 'navs-tabs', etiqueta: 'Navs & Tabs', items: [
        { ruta: N.COMP_NAVS,      etiqueta: 'Navs' },
        { ruta: N.COMP_NAVBAR,    etiqueta: 'Navbar' },
        { ruta: N.COMP_NAV_VERT,  etiqueta: 'Navbar vertical' },
        { ruta: N.COMP_NAV_TOP,   etiqueta: 'Top nav' },
        { ruta: N.COMP_NAV_DOBLE, etiqueta: 'Double top', nuevo: true },
        { ruta: N.COMP_NAV_COMBO, etiqueta: 'Combo nav' },
        { ruta: N.COMP_TABS,      etiqueta: 'Tabs' },
      ]},
      { id: 'pictures', etiqueta: 'Pictures', items: [
        { ruta: N.COMP_AVATAR,   etiqueta: 'Avatar' },
        { ruta: N.COMP_IMAGENES, etiqueta: 'Imágenes' },
        { ruta: N.COMP_FIGURAS,  etiqueta: 'Figuras' },
        { ruta: N.COMP_HOVERBOX, etiqueta: 'Hoverbox' },
        { ruta: N.COMP_LIGHTBOX, etiqueta: 'Lightbox' },
      ]},
      { ruta: N.COMP_PROGRESS,    etiqueta: 'Progress bar' },
      { ruta: N.COMP_PLACEHOLDER, etiqueta: 'Placeholder' },
      { ruta: N.COMP_PAGINACION,  etiqueta: 'Paginación' },
      { ruta: N.COMP_POPOVERS,    etiqueta: 'Popovers' },
      { ruta: N.COMP_SCROLLSPY,   etiqueta: 'Scrollspy' },
      { ruta: N.COMP_SEARCH,      etiqueta: 'Search' },
      { ruta: N.COMP_SORTABLE,    etiqueta: 'Sortable' },
      { ruta: N.COMP_SPINNERS,    etiqueta: 'Spinners' },
      { ruta: N.COMP_TIMELINE,    etiqueta: 'Timeline' },
      { ruta: N.COMP_TOASTS,      etiqueta: 'Toasts' },
      { ruta: N.COMP_TOOLTIPS,    etiqueta: 'Tooltips' },
      { ruta: N.COMP_TREEVIEW,    etiqueta: 'Treeview' },
      { ruta: N.COMP_TYPED,       etiqueta: 'Typed text' },
      { id: 'videos', etiqueta: 'Videos', items: [
        { ruta: N.COMP_VIDEO_EMBED, etiqueta: 'Embed' },
        { ruta: N.COMP_VIDEO_PLYR,  etiqueta: 'Plyr' },
      ]},
    ],
  },

  // ============================ Documentación ============================
  { grupo: 'Documentación' },
  {
    id: 'doc-custom', etiqueta: 'Customización', icono: 'preferencias',
    items: [
      { ruta: N.DOC_CONFIG,   etiqueta: 'Configuración' },
      { ruta: N.DOC_ESTILO,   etiqueta: 'Estilo' },
      { ruta: N.DOC_DARKMODE, etiqueta: 'Dark mode' },
      { ruta: N.DOC_PLUGIN,   etiqueta: 'Plugin' },
    ],
  },
];
