/** Nombres de rutas centralizados — evita cadenas mágicas en todo el código.
 *  Espejo del sidebar de Falcon: cada entrada del menú apunta a un nombre aquí.
 *  Las rutas que aún no tengan página registrada en `router/routes.js` caen al
 *  comodín 404 — eso es esperado mientras se van armando las páginas. */
export const NOMBRES_RUTAS = Object.freeze({
  // ============================== Núcleo ==============================
  INICIO:        'inicio',
  PANEL:         'panel',

  // ============================ Dashboards ============================
  PANEL_ANALITICA:    'panel-analitica',
  PANEL_CRM:          'panel-crm',
  PANEL_COMERCIO:     'panel-comercio',
  PANEL_LMS:          'panel-lms',
  PANEL_PROYECTOS:    'panel-proyectos',
  PANEL_SAAS:         'panel-saas',
  PANEL_SOPORTE:      'panel-soporte',

  // ============================ App: básicos ==========================
  CHAT:               'chat',
  KANBAN:             'kanban',
  CALENDARIO:         'calendario',
  EMAIL:              'email',
  EMAIL_LEER:         'email-leer',
  EMAIL_COMPOSE:      'email-compose',

  // ============================== Páginas =============================
  // Páginas > Auth (Simple)
  AUTH_SIMPLE_INGRESAR:        'auth-simple-ingresar',
  AUTH_SIMPLE_SALIR:           'auth-simple-salir',
  AUTH_SIMPLE_REGISTRAR:       'auth-simple-registrar',
  AUTH_SIMPLE_RECUPERAR:       'auth-simple-recuperar',
  AUTH_SIMPLE_CONFIRMAR:       'auth-simple-confirmar',
  AUTH_SIMPLE_RESTABLECER:     'auth-simple-restablecer',
  AUTH_SIMPLE_BLOQUEO:         'auth-simple-bloqueo',

  // Páginas > Auth (Card)
  AUTH_CARD_INGRESAR:          'auth-card-ingresar',
  AUTH_CARD_SALIR:             'auth-card-salir',
  AUTH_CARD_REGISTRAR:         'auth-card-registrar',
  AUTH_CARD_RECUPERAR:         'auth-card-recuperar',
  AUTH_CARD_CONFIRMAR:         'auth-card-confirmar',
  AUTH_CARD_RESTABLECER:       'auth-card-restablecer',
  AUTH_CARD_BLOQUEO:           'auth-card-bloqueo',

  // Páginas > Auth (Split)
  AUTH_SPLIT_INGRESAR:         'auth-split-ingresar',
  AUTH_SPLIT_SALIR:            'auth-split-salir',
  AUTH_SPLIT_REGISTRAR:        'auth-split-registrar',
  AUTH_SPLIT_RECUPERAR:        'auth-split-recuperar',
  AUTH_SPLIT_CONFIRMAR:        'auth-split-confirmar',
  AUTH_SPLIT_RESTABLECER:      'auth-split-restablecer',
  AUTH_SPLIT_BLOQUEO:          'auth-split-bloqueo',

  // Páginas > Auth (compatibilidad: rutas planas existentes)
  INGRESAR:           'ingresar',
  REGISTRAR:          'registrar',
  RECUPERAR:          'recuperar',
  RESTABLECER:        'restablecer',
  CONFIRMAR_CORREO:   'confirmar-correo',
  BLOQUEO:            'bloqueo',
  ASISTENTE_REGISTRO: 'asistente-registro',
  AUTH_MODAL:         'auth-modal',

  // Páginas > Usuario
  PERFIL:             'perfil',
  AJUSTES:            'ajustes',

  // Páginas > Errores
  ERROR_401:          'error-401',
  ERROR_403:          'error-403',
  ERROR_404:          'error-404',
  ERROR_500:          'error-500',
  ERROR_503:          'error-503',
  ERROR_MANTENIMIENTO:'error-mantenimiento',
  ERROR_OFFLINE:      'error-offline',

  // ============================== Módulos =============================
  // Módulos > Forms (Basic)
  FORM_CONTROL:       'form-control',
  FORM_INPUT_GROUP:   'form-input-group',
  FORM_SELECT:        'form-select',
  FORM_CHECKS:        'form-checks',
  FORM_RANGE:         'form-range',
  FORM_LAYOUT:        'form-layout',
  // Módulos > Forms (Advance)
  FORM_ADV_SELECT:    'form-adv-select',
  FORM_DATE_PICKER:   'form-date-picker',
  FORM_EDITOR:        'form-editor',
  FORM_EMOJI:         'form-emoji',
  FORM_UPLOADER:      'form-uploader',
  FORM_INPUT_MASK:    'form-input-mask',
  FORM_RANGE_SLIDER:  'form-range-slider',
  FORM_RATING:        'form-rating',
  FORM_CROPPER:       'form-cropper',
  // Módulos > Forms (otros)
  FORM_FLOATING:      'form-floating',
  FORM_WIZARD:        'form-wizard',
  FORM_VALIDACION:    'form-validacion',

  // Módulos > Tables
  TABLA_BASICA:       'tabla-basica',
  TABLA_AVANZADA:     'tabla-avanzada',
  TABLA_BULK:         'tabla-bulk',

  // Módulos > Charts
  CHART_CHARTJS:      'chart-chartjs',
  CHART_D3:           'chart-d3',
  CHART_ECHART_LINE:        'chart-echart-line',
  CHART_ECHART_BAR:         'chart-echart-bar',
  CHART_ECHART_VELA:        'chart-echart-vela',
  CHART_ECHART_GEO:         'chart-echart-geo',
  CHART_ECHART_DISPERSION:  'chart-echart-dispersion',
  CHART_ECHART_PASTEL:      'chart-echart-pastel',
  CHART_ECHART_GAUGE:       'chart-echart-gauge',
  CHART_ECHART_RADAR:       'chart-echart-radar',
  CHART_ECHART_HEATMAP:     'chart-echart-heatmap',
  CHART_ECHART_USO:         'chart-echart-uso',

  // Módulos > Icons
  ICON_FONT_AWESOME:  'icon-font-awesome',
  ICON_BOOTSTRAP:     'icon-bootstrap',
  ICON_FEATHER:       'icon-feather',
  ICON_MATERIAL:      'icon-material',

  // Módulos > Maps
  MAPA_GOOGLE:        'mapa-google',
  MAPA_LEAFLET:       'mapa-leaflet',

  // Módulos > Components
  COMP_ACORDEON:      'comp-acordeon',
  COMP_ALERTAS:       'comp-alertas',
  COMP_AVISOS:        'comp-avisos',
  COMP_ANCLA:         'comp-ancla',
  COMP_ICONOS_ANIM:   'comp-iconos-anim',
  COMP_FONDO:         'comp-fondo',
  COMP_BADGES:        'comp-badges',
  COMP_BARRA_INF:     'comp-barra-inf',
  COMP_MIGAS:         'comp-migas',
  COMP_BOTONES:       'comp-botones',
  COMP_CALENDAR:      'comp-calendar',
  COMP_CARDS:         'comp-cards',
  COMP_CARRUSEL_BS:   'comp-carrusel-bs',
  COMP_CARRUSEL_SW:   'comp-carrusel-sw',
  COMP_COLAPSO:       'comp-colapso',
  COMP_COOKIE:        'comp-cookie',
  COMP_CONTADOR:      'comp-contador',
  COMP_DROPDOWNS:     'comp-dropdowns',
  COMP_LIST_GROUP:    'comp-list-group',
  COMP_MODALES:       'comp-modales',
  COMP_NAVS:          'comp-navs',
  COMP_NAVBAR:        'comp-navbar',
  COMP_NAV_VERT:      'comp-nav-vert',
  COMP_NAV_TOP:       'comp-nav-top',
  COMP_NAV_DOBLE:     'comp-nav-doble',
  COMP_NAV_COMBO:     'comp-nav-combo',
  COMP_TABS:          'comp-tabs',
  COMP_AVATAR:        'comp-avatar',
  COMP_IMAGENES:      'comp-imagenes',
  COMP_FIGURAS:       'comp-figuras',
  COMP_HOVERBOX:      'comp-hoverbox',
  COMP_LIGHTBOX:      'comp-lightbox',
  COMP_PROGRESS:      'comp-progress',
  COMP_PLACEHOLDER:   'comp-placeholder',
  COMP_PAGINACION:    'comp-paginacion',
  COMP_POPOVERS:      'comp-popovers',
  COMP_SCROLLSPY:     'comp-scrollspy',
  COMP_SEARCH:        'comp-search',
  COMP_SORTABLE:      'comp-sortable',
  COMP_SPINNERS:      'comp-spinners',
  COMP_TIMELINE:      'comp-timeline',
  COMP_TOASTS:        'comp-toasts',
  COMP_TOOLTIPS:      'comp-tooltips',
  COMP_TREEVIEW:      'comp-treeview',
  COMP_TYPED:         'comp-typed',
  COMP_VIDEO_EMBED:   'comp-video-embed',
  COMP_VIDEO_PLYR:    'comp-video-plyr',

  // Módulos > Multi-level (demo)
  MULTI_NIVEL:        'multi-nivel',

  // ============================ Documentación =========================
  DOC_CONFIG:         'doc-config',
  DOC_ESTILO:         'doc-estilo',
  DOC_DARKMODE:       'doc-darkmode',
  DOC_PLUGIN:         'doc-plugin',
  DOC_GULP:           'doc-gulp',
  DOC_DESIGN:         'doc-design',

  // ============================ Configuración =========================
  // (compatibilidad — usados por el menú de cuenta)
  SEGURIDAD:          'seguridad',
  PREFERENCIAS:       'preferencias',
  REPORTES:           'reportes',

  // Atajos a sub-categorías de modulos (compatibilidad con código anterior)
  MOD_GRAFICOS:       'mod-graficos',
  MOD_FORMULARIOS:    'mod-formularios',
  MOD_TABLAS:         'mod-tablas',
  MOD_ICONOS:         'mod-iconos',
  MOD_MAPAS:          'mod-mapas',
  MOD_UTILIDADES:     'mod-utilidades',
  MOD_COMPONENTES:    'mod-componentes',
});

const N = NOMBRES_RUTAS;

export const RUTAS = Object.freeze({
  // Núcleo
  [N.INICIO]:               '/',
  [N.PANEL]:                '/panel',

  // Dashboards
  [N.PANEL_ANALITICA]:      '/panel/analitica',
  [N.PANEL_CRM]:            '/panel/crm',
  [N.PANEL_COMERCIO]:       '/panel/comercio',
  [N.PANEL_LMS]:            '/panel/lms',
  [N.PANEL_PROYECTOS]:      '/panel/proyectos',
  [N.PANEL_SAAS]:           '/panel/saas',
  [N.PANEL_SOPORTE]:        '/panel/soporte',

  // App: básicos
  [N.CHAT]:                 '/app/chat',
  [N.KANBAN]:               '/app/kanban',
  [N.CALENDARIO]:           '/app/calendario',
  [N.EMAIL]:                '/app/email',
  [N.EMAIL_LEER]:           '/app/email/leer',
  [N.EMAIL_COMPOSE]:        '/app/email/compose',

  // Auth (Simple)
  [N.AUTH_SIMPLE_INGRESAR]:    '/auth/simple/ingresar',
  [N.AUTH_SIMPLE_SALIR]:       '/auth/simple/salir',
  [N.AUTH_SIMPLE_REGISTRAR]:   '/auth/simple/registrar',
  [N.AUTH_SIMPLE_RECUPERAR]:   '/auth/simple/recuperar',
  [N.AUTH_SIMPLE_CONFIRMAR]:   '/auth/simple/confirmar',
  [N.AUTH_SIMPLE_RESTABLECER]: '/auth/simple/restablecer',
  [N.AUTH_SIMPLE_BLOQUEO]:     '/auth/simple/bloqueo',
  // Auth (Card)
  [N.AUTH_CARD_INGRESAR]:      '/auth/card/ingresar',
  [N.AUTH_CARD_SALIR]:         '/auth/card/salir',
  [N.AUTH_CARD_REGISTRAR]:     '/auth/card/registrar',
  [N.AUTH_CARD_RECUPERAR]:     '/auth/card/recuperar',
  [N.AUTH_CARD_CONFIRMAR]:     '/auth/card/confirmar',
  [N.AUTH_CARD_RESTABLECER]:   '/auth/card/restablecer',
  [N.AUTH_CARD_BLOQUEO]:       '/auth/card/bloqueo',
  // Auth (Split)
  [N.AUTH_SPLIT_INGRESAR]:     '/auth/split/ingresar',
  [N.AUTH_SPLIT_SALIR]:        '/auth/split/salir',
  [N.AUTH_SPLIT_REGISTRAR]:    '/auth/split/registrar',
  [N.AUTH_SPLIT_RECUPERAR]:    '/auth/split/recuperar',
  [N.AUTH_SPLIT_CONFIRMAR]:    '/auth/split/confirmar',
  [N.AUTH_SPLIT_RESTABLECER]:  '/auth/split/restablecer',
  [N.AUTH_SPLIT_BLOQUEO]:      '/auth/split/bloqueo',

  // Auth (planos — compatibilidad)
  [N.INGRESAR]:             '/ingresar',
  [N.REGISTRAR]:            '/registrar',
  [N.RECUPERAR]:            '/recuperar-contrasena',
  [N.RESTABLECER]:          '/restablecer-contrasena',
  [N.CONFIRMAR_CORREO]:     '/confirmar-correo',
  [N.BLOQUEO]:              '/bloqueo',
  [N.ASISTENTE_REGISTRO]:   '/asistente-registro',
  [N.AUTH_MODAL]:           '/auth/modal',

  // Usuario
  [N.PERFIL]:               '/usuario/perfil',
  [N.AJUSTES]:              '/usuario/ajustes',

  // Errores
  [N.ERROR_401]:            '/401',
  [N.ERROR_403]:            '/403',
  [N.ERROR_404]:            '/404',
  [N.ERROR_500]:            '/500',
  [N.ERROR_503]:            '/503',
  [N.ERROR_MANTENIMIENTO]:  '/mantenimiento',
  [N.ERROR_OFFLINE]:        '/offline',

  // Forms
  [N.FORM_CONTROL]:         '/modulos/forms/basic/form-control',
  [N.FORM_INPUT_GROUP]:     '/modulos/forms/basic/input-group',
  [N.FORM_SELECT]:          '/modulos/forms/basic/select',
  [N.FORM_CHECKS]:          '/modulos/forms/basic/checks',
  [N.FORM_RANGE]:           '/modulos/forms/basic/range',
  [N.FORM_LAYOUT]:          '/modulos/forms/basic/layout',
  [N.FORM_ADV_SELECT]:      '/modulos/forms/advance/select',
  [N.FORM_DATE_PICKER]:     '/modulos/forms/advance/date-picker',
  [N.FORM_EDITOR]:          '/modulos/forms/advance/editor',
  [N.FORM_EMOJI]:           '/modulos/forms/advance/emoji',
  [N.FORM_UPLOADER]:        '/modulos/forms/advance/uploader',
  [N.FORM_INPUT_MASK]:      '/modulos/forms/advance/input-mask',
  [N.FORM_RANGE_SLIDER]:    '/modulos/forms/advance/range-slider',
  [N.FORM_RATING]:          '/modulos/forms/advance/rating',
  [N.FORM_CROPPER]:         '/modulos/forms/advance/cropper',
  [N.FORM_FLOATING]:        '/modulos/forms/floating',
  [N.FORM_WIZARD]:          '/modulos/forms/wizard',
  [N.FORM_VALIDACION]:      '/modulos/forms/validacion',

  // Tables
  [N.TABLA_BASICA]:         '/modulos/tablas/basica',
  [N.TABLA_AVANZADA]:       '/modulos/tablas/avanzada',
  [N.TABLA_BULK]:           '/modulos/tablas/bulk-select',

  // Charts
  [N.CHART_CHARTJS]:        '/modulos/charts/chartjs',
  [N.CHART_D3]:             '/modulos/charts/d3',
  [N.CHART_ECHART_LINE]:        '/modulos/charts/echart/linea',
  [N.CHART_ECHART_BAR]:         '/modulos/charts/echart/barras',
  [N.CHART_ECHART_VELA]:        '/modulos/charts/echart/velas',
  [N.CHART_ECHART_GEO]:         '/modulos/charts/echart/geo',
  [N.CHART_ECHART_DISPERSION]:  '/modulos/charts/echart/dispersion',
  [N.CHART_ECHART_PASTEL]:      '/modulos/charts/echart/pastel',
  [N.CHART_ECHART_GAUGE]:       '/modulos/charts/echart/gauge',
  [N.CHART_ECHART_RADAR]:       '/modulos/charts/echart/radar',
  [N.CHART_ECHART_HEATMAP]:     '/modulos/charts/echart/heatmap',
  [N.CHART_ECHART_USO]:         '/modulos/charts/echart/uso',

  // Icons
  [N.ICON_FONT_AWESOME]:    '/modulos/iconos/font-awesome',
  [N.ICON_BOOTSTRAP]:       '/modulos/iconos/bootstrap',
  [N.ICON_FEATHER]:         '/modulos/iconos/feather',
  [N.ICON_MATERIAL]:        '/modulos/iconos/material',

  // Maps
  [N.MAPA_GOOGLE]:          '/modulos/mapas/google',
  [N.MAPA_LEAFLET]:         '/modulos/mapas/leaflet',

  // Components
  [N.COMP_ACORDEON]:        '/modulos/componentes/acordeon',
  [N.COMP_ALERTAS]:         '/modulos/componentes/alertas',
  [N.COMP_AVISOS]:          '/modulos/componentes/avisos',
  [N.COMP_ANCLA]:           '/modulos/componentes/ancla',
  [N.COMP_ICONOS_ANIM]:     '/modulos/componentes/iconos-animados',
  [N.COMP_FONDO]:           '/modulos/componentes/fondo',
  [N.COMP_BADGES]:          '/modulos/componentes/badges',
  [N.COMP_BARRA_INF]:       '/modulos/componentes/barra-inferior',
  [N.COMP_MIGAS]:           '/modulos/componentes/migas',
  [N.COMP_BOTONES]:         '/modulos/componentes/botones',
  [N.COMP_CALENDAR]:        '/modulos/componentes/calendario',
  [N.COMP_CARDS]:           '/modulos/componentes/cards',
  [N.COMP_CARRUSEL_BS]:     '/modulos/componentes/carrusel/bootstrap',
  [N.COMP_CARRUSEL_SW]:     '/modulos/componentes/carrusel/swiper',
  [N.COMP_COLAPSO]:         '/modulos/componentes/colapso',
  [N.COMP_COOKIE]:          '/modulos/componentes/cookie',
  [N.COMP_CONTADOR]:        '/modulos/componentes/contador',
  [N.COMP_DROPDOWNS]:       '/modulos/componentes/dropdowns',
  [N.COMP_LIST_GROUP]:      '/modulos/componentes/list-group',
  [N.COMP_MODALES]:         '/modulos/componentes/modales',
  [N.COMP_NAVS]:            '/modulos/componentes/navs',
  [N.COMP_NAVBAR]:          '/modulos/componentes/navbar',
  [N.COMP_NAV_VERT]:        '/modulos/componentes/nav-vertical',
  [N.COMP_NAV_TOP]:         '/modulos/componentes/nav-top',
  [N.COMP_NAV_DOBLE]:       '/modulos/componentes/nav-doble',
  [N.COMP_NAV_COMBO]:       '/modulos/componentes/nav-combo',
  [N.COMP_TABS]:            '/modulos/componentes/tabs',
  [N.COMP_AVATAR]:          '/modulos/componentes/avatar',
  [N.COMP_IMAGENES]:        '/modulos/componentes/imagenes',
  [N.COMP_FIGURAS]:         '/modulos/componentes/figuras',
  [N.COMP_HOVERBOX]:        '/modulos/componentes/hoverbox',
  [N.COMP_LIGHTBOX]:        '/modulos/componentes/lightbox',
  [N.COMP_PROGRESS]:        '/modulos/componentes/progress',
  [N.COMP_PLACEHOLDER]:     '/modulos/componentes/placeholder',
  [N.COMP_PAGINACION]:      '/modulos/componentes/paginacion',
  [N.COMP_POPOVERS]:        '/modulos/componentes/popovers',
  [N.COMP_SCROLLSPY]:       '/modulos/componentes/scrollspy',
  [N.COMP_SEARCH]:          '/modulos/componentes/search',
  [N.COMP_SORTABLE]:        '/modulos/componentes/sortable',
  [N.COMP_SPINNERS]:        '/modulos/componentes/spinners',
  [N.COMP_TIMELINE]:        '/modulos/componentes/timeline',
  [N.COMP_TOASTS]:          '/modulos/componentes/toasts',
  [N.COMP_TOOLTIPS]:        '/modulos/componentes/tooltips',
  [N.COMP_TREEVIEW]:        '/modulos/componentes/treeview',
  [N.COMP_TYPED]:           '/modulos/componentes/typed',
  [N.COMP_VIDEO_EMBED]:     '/modulos/componentes/video/embed',
  [N.COMP_VIDEO_PLYR]:      '/modulos/componentes/video/plyr',

  // Multi-level
  [N.MULTI_NIVEL]:          '/multi-nivel',

  // Documentación
  [N.DOC_CONFIG]:           '/documentacion/configuracion',
  [N.DOC_ESTILO]:           '/documentacion/estilo',
  [N.DOC_DARKMODE]:         '/documentacion/dark-mode',
  [N.DOC_PLUGIN]:           '/documentacion/plugin',
  [N.DOC_GULP]:             '/documentacion/gulp',
  [N.DOC_DESIGN]:           '/documentacion/design',

  // Configuración (compatibilidad)
  [N.SEGURIDAD]:            '/configuracion/seguridad',
  [N.PREFERENCIAS]:         '/configuracion/preferencias',
  [N.REPORTES]:             '/reportes',

  // Atajos a sub-categorías de modulos (compatibilidad)
  [N.MOD_GRAFICOS]:         '/modulos/graficos',
  [N.MOD_FORMULARIOS]:      '/modulos/formularios',
  [N.MOD_TABLAS]:           '/modulos/tablas',
  [N.MOD_ICONOS]:           '/modulos/iconos',
  [N.MOD_MAPAS]:            '/modulos/mapas',
  [N.MOD_UTILIDADES]:       '/modulos/utilidades',
  [N.MOD_COMPONENTES]:      '/modulos/componentes',
});
