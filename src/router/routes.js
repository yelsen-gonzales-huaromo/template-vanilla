/**
 * Mapa de rutas — cada ruta carga su módulo de página de forma diferida (lazy)
 * para que el bundle inicial sea mínimo. El layout y las guardias son declarativos.
 */
import { NOMBRES_RUTAS, RUTAS } from '../config/routes.config.js';
import { guardiaAutenticacion } from './guards/auth-guard.js';
import { guardiaInvitado } from './guards/guest-guard.js';

const r = (nombre, opciones) => ({
  name: nombre,
  path: RUTAS[nombre],
  ...opciones,
});

export const rutas = [
  // Núcleo
  { name: NOMBRES_RUTAS.INICIO, path: RUTAS[NOMBRES_RUTAS.INICIO], redirect: RUTAS[NOMBRES_RUTAS.PANEL] },
  r(NOMBRES_RUTAS.PANEL, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/dashboard/dashboard.page.js'),
    meta: { title: 'Panel' },
  }),

  // Dashboards
  r(NOMBRES_RUTAS.PANEL_ANALITICA, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/analitica/analitica.page.js'),
    meta: { title: 'Analítica' },
  }),
  r(NOMBRES_RUTAS.PANEL_CRM, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/crm/crm.page.js'),
    meta: { title: 'CRM' },
  }),
  r(NOMBRES_RUTAS.PANEL_COMERCIO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/comercio/comercio.page.js'),
    meta: { title: 'Comercio' },
  }),
  r(NOMBRES_RUTAS.PANEL_LMS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/lms/lms.page.js'),
    meta: { title: 'LMS' },
  }),
  r(NOMBRES_RUTAS.PANEL_PROYECTOS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/proyectos/proyectos.page.js'),
    meta: { title: 'Proyectos' },
  }),
  r(NOMBRES_RUTAS.PANEL_SAAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/saas/saas.page.js'),
    meta: { title: 'SaaS' },
  }),
  r(NOMBRES_RUTAS.PANEL_SOPORTE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/panel/soporte/soporte.page.js'),
    meta: { title: 'Soporte' },
  }),

  // Auth
  r(NOMBRES_RUTAS.INGRESAR, {
    layout: 'auth', guards: [guardiaInvitado],
    component: () => import('../pages/auth/login/login.page.js'),
    meta: { title: 'Iniciar sesión' },
  }),
  r(NOMBRES_RUTAS.REGISTRAR, {
    layout: 'auth', guards: [guardiaInvitado],
    component: () => import('../pages/auth/register/register.page.js'),
    meta: { title: 'Crear cuenta' },
  }),
  r(NOMBRES_RUTAS.RECUPERAR, {
    layout: 'auth', guards: [guardiaInvitado],
    component: () => import('../pages/auth/forgot-password/forgot-password.page.js'),
    meta: { title: 'Recuperar contraseña' },
  }),
  r(NOMBRES_RUTAS.RESTABLECER, {
    layout: 'auth', guards: [guardiaInvitado],
    component: () => import('../pages/auth/reset-password/reset-password.page.js'),
    meta: { title: 'Restablecer' },
  }),
  r(NOMBRES_RUTAS.CONFIRMAR_CORREO, {
    layout: 'auth',
    component: () => import('../pages/auth/confirm-mail/confirm-mail.page.js'),
    meta: { title: 'Confirmar correo' },
  }),
  r(NOMBRES_RUTAS.BLOQUEO, {
    layout: 'auth',
    component: () => import('../pages/auth/lock-screen/lock-screen.page.js'),
    meta: { title: 'Bloqueado' },
  }),
  r(NOMBRES_RUTAS.ASISTENTE_REGISTRO, {
    layout: 'auth',
    component: () => import('../pages/auth/wizard/wizard.page.js'),
    meta: { title: 'Asistente de registro' },
  }),

  // ============== Auth · Variantes (Simple / Card / Split) ==============
  // Las 3 variantes comparten el mismo módulo de página y se diferencian
  // únicamente por el `layout` (que aporta el chrome visual).
  // SIN guardiaInvitado porque son rutas SHOWCASE (deben verse incluso cuando
  // el usuario está autenticado). El flujo auth real usa /ingresar, /registrar.
  // Simple
  r(NOMBRES_RUTAS.AUTH_SIMPLE_INGRESAR,    { layout: 'auth-simple', component: () => import('../pages/auth/shared/ingresar.page.js'),    meta: { title: 'Ingresar' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_REGISTRAR,   { layout: 'auth-simple', component: () => import('../pages/auth/shared/registrar.page.js'),   meta: { title: 'Crear cuenta' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_RECUPERAR,   { layout: 'auth-simple', component: () => import('../pages/auth/shared/recuperar.page.js'),   meta: { title: 'Recuperar contraseña' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_RESTABLECER, { layout: 'auth-simple', component: () => import('../pages/auth/shared/restablecer.page.js'), meta: { title: 'Restablecer' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_CONFIRMAR,   { layout: 'auth-simple', component: () => import('../pages/auth/shared/confirmar.page.js'),   meta: { title: 'Confirmar correo' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_SALIR,       { layout: 'auth-simple', component: () => import('../pages/auth/shared/salir.page.js'),       meta: { title: 'Sesión cerrada' } }),
  r(NOMBRES_RUTAS.AUTH_SIMPLE_BLOQUEO,     { layout: 'auth-simple', component: () => import('../pages/auth/shared/bloqueo.page.js'),     meta: { title: 'Bloqueado' } }),

  // Card
  r(NOMBRES_RUTAS.AUTH_CARD_INGRESAR,      { layout: 'auth-card',   component: () => import('../pages/auth/shared/ingresar.page.js'),    meta: { title: 'Ingresar' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_REGISTRAR,     { layout: 'auth-card',   component: () => import('../pages/auth/shared/registrar.page.js'),   meta: { title: 'Crear cuenta' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_RECUPERAR,     { layout: 'auth-card',   component: () => import('../pages/auth/shared/recuperar.page.js'),   meta: { title: 'Recuperar contraseña' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_RESTABLECER,   { layout: 'auth-card',   component: () => import('../pages/auth/shared/restablecer.page.js'), meta: { title: 'Restablecer' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_CONFIRMAR,     { layout: 'auth-card',   component: () => import('../pages/auth/shared/confirmar.page.js'),   meta: { title: 'Confirmar correo' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_SALIR,         { layout: 'auth-card',   component: () => import('../pages/auth/shared/salir.page.js'),       meta: { title: 'Sesión cerrada' } }),
  r(NOMBRES_RUTAS.AUTH_CARD_BLOQUEO,       { layout: 'auth-card',   component: () => import('../pages/auth/shared/bloqueo.page.js'),     meta: { title: 'Bloqueado' } }),

  // Split
  r(NOMBRES_RUTAS.AUTH_SPLIT_INGRESAR,     { layout: 'auth-split',  component: () => import('../pages/auth/shared/ingresar.page.js'),    meta: { title: 'Ingresar' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_REGISTRAR,    { layout: 'auth-split',  component: () => import('../pages/auth/shared/registrar.page.js'),   meta: { title: 'Crear cuenta' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_RECUPERAR,    { layout: 'auth-split',  component: () => import('../pages/auth/shared/recuperar.page.js'),   meta: { title: 'Recuperar contraseña' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_RESTABLECER,  { layout: 'auth-split',  component: () => import('../pages/auth/shared/restablecer.page.js'), meta: { title: 'Restablecer' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_CONFIRMAR,    { layout: 'auth-split',  component: () => import('../pages/auth/shared/confirmar.page.js'),   meta: { title: 'Confirmar correo' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_SALIR,        { layout: 'auth-split',  component: () => import('../pages/auth/shared/salir.page.js'),       meta: { title: 'Sesión cerrada' } }),
  r(NOMBRES_RUTAS.AUTH_SPLIT_BLOQUEO,      { layout: 'auth-split',  component: () => import('../pages/auth/shared/bloqueo.page.js'),     meta: { title: 'Bloqueado' } }),

  // Modal — página demo independiente (layout blank)
  r(NOMBRES_RUTAS.AUTH_MODAL, {
    layout: 'blank',
    component: () => import('../pages/auth/modal.page.js'),
    meta: { title: 'Auth en modal' },
  }),

  // Apps
  r(NOMBRES_RUTAS.CHAT, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/chat/chat.page.js'),
    meta: { title: 'Chat' },
  }),
  r(NOMBRES_RUTAS.KANBAN, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/kanban/kanban.page.js'),
    meta: { title: 'Kanban' },
  }),
  r(NOMBRES_RUTAS.CALENDARIO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/calendario/calendario.page.js'),
    meta: { title: 'Calendario' },
  }),
  r(NOMBRES_RUTAS.EMAIL, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/email/email.page.js'),
    meta: { title: 'Email · Inbox' },
  }),
  r(NOMBRES_RUTAS.EMAIL_LEER, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/email/read.page.js'),
    meta: { title: 'Email · Lectura' },
  }),
  r(NOMBRES_RUTAS.EMAIL_COMPOSE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/app/email/compose.page.js'),
    meta: { title: 'Email · Compose' },
  }),

  // Páginas (settings + misc)
  r(NOMBRES_RUTAS.PERFIL, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/settings/profile/profile.page.js'),
    meta: { title: 'Perfil' },
  }),
  r(NOMBRES_RUTAS.AJUSTES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/settings/ajustes/ajustes.page.js'),
    meta: { title: 'Ajustes' },
  }),
  r(NOMBRES_RUTAS.SEGURIDAD, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/settings/security/security.page.js'),
    meta: { title: 'Seguridad' },
  }),
  r(NOMBRES_RUTAS.PREFERENCIAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/settings/preferences/preferences.page.js'),
    meta: { title: 'Preferencias' },
  }),
  r(NOMBRES_RUTAS.REPORTES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/reports/reports.page.js'),
    meta: { title: 'Reportes' },
  }),

  // Módulos (showcase)
  r(NOMBRES_RUTAS.MOD_GRAFICOS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/graficos.page.js'),
    meta: { title: 'Gráficos' },
  }),
  r(NOMBRES_RUTAS.CHART_CHARTJS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/chartjs.page.js'),
    meta: { title: 'Chart.js' },
  }),
  r(NOMBRES_RUTAS.CHART_D3, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/d3.page.js'),
    meta: { title: 'D3.js' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_LINE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/linea.page.js'),
    meta: { title: 'ECharts · Líneas' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_BAR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/barras.page.js'),
    meta: { title: 'ECharts · Barras' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_VELA, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/velas.page.js'),
    meta: { title: 'ECharts · Velas' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_GEO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/geo.page.js'),
    meta: { title: 'ECharts · Geo' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_DISPERSION, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/dispersion.page.js'),
    meta: { title: 'ECharts · Dispersión' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_PASTEL, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/pastel.page.js'),
    meta: { title: 'ECharts · Pastel' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_GAUGE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/gauge.page.js'),
    meta: { title: 'ECharts · Gauge' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_RADAR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/radar.page.js'),
    meta: { title: 'ECharts · Radar' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_HEATMAP, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/heatmap.page.js'),
    meta: { title: 'ECharts · Heatmap' },
  }),
  r(NOMBRES_RUTAS.CHART_ECHART_USO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/charts/echart/uso.page.js'),
    meta: { title: 'ECharts · Cómo usar' },
  }),
  r(NOMBRES_RUTAS.MOD_FORMULARIOS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/formularios.page.js'),
    meta: { title: 'Formularios' },
  }),
  // ===== Forms · Basic =====
  r(NOMBRES_RUTAS.FORM_CONTROL,     { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/form-control.page.js'),  meta: { title: 'Form control' } }),
  r(NOMBRES_RUTAS.FORM_INPUT_GROUP, { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/input-group.page.js'),    meta: { title: 'Input group' } }),
  r(NOMBRES_RUTAS.FORM_SELECT,      { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/select.page.js'),         meta: { title: 'Select' } }),
  r(NOMBRES_RUTAS.FORM_CHECKS,      { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/checks.page.js'),         meta: { title: 'Checks' } }),
  r(NOMBRES_RUTAS.FORM_RANGE,       { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/range.page.js'),          meta: { title: 'Range' } }),
  r(NOMBRES_RUTAS.FORM_LAYOUT,      { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/basic/layout.page.js'),         meta: { title: 'Form layout' } }),
  // ===== Forms · Advance =====
  r(NOMBRES_RUTAS.FORM_ADV_SELECT,   { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/select.page.js'),       meta: { title: 'Advance select' } }),
  r(NOMBRES_RUTAS.FORM_DATE_PICKER,  { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/date-picker.page.js'),  meta: { title: 'Date picker' } }),
  r(NOMBRES_RUTAS.FORM_EDITOR,       { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/editor.page.js'),       meta: { title: 'Editor' } }),
  r(NOMBRES_RUTAS.FORM_EMOJI,        { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/emoji.page.js'),        meta: { title: 'Emoji button' } }),
  r(NOMBRES_RUTAS.FORM_UPLOADER,     { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/uploader.page.js'),     meta: { title: 'File uploader' } }),
  r(NOMBRES_RUTAS.FORM_INPUT_MASK,   { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/input-mask.page.js'),   meta: { title: 'Input mask' } }),
  r(NOMBRES_RUTAS.FORM_RANGE_SLIDER, { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/range-slider.page.js'), meta: { title: 'Range slider' } }),
  r(NOMBRES_RUTAS.FORM_RATING,       { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/rating.page.js'),       meta: { title: 'Rating' } }),
  r(NOMBRES_RUTAS.FORM_CROPPER,      { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/advance/cropper.page.js'),      meta: { title: 'Recortador de imágenes' } }),
  // ===== Forms · standalone =====
  r(NOMBRES_RUTAS.FORM_FLOATING,    { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/floating.page.js'),    meta: { title: 'Floating labels' } }),
  r(NOMBRES_RUTAS.FORM_WIZARD,      { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/wizard.page.js'),      meta: { title: 'Form wizard' } }),
  r(NOMBRES_RUTAS.FORM_VALIDACION,  { layout: 'dashboard', guards: [guardiaAutenticacion], component: () => import('../pages/modulos/forms/validacion.page.js'),  meta: { title: 'Validación' } }),
  r(NOMBRES_RUTAS.MOD_TABLAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/tablas.page.js'),
    meta: { title: 'Tablas' },
  }),
  r(NOMBRES_RUTAS.TABLA_BASICA, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/tablas/basica.page.js'),
    meta: { title: 'Tablas básicas' },
  }),
  r(NOMBRES_RUTAS.TABLA_AVANZADA, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/tablas/avanzada.page.js'),
    meta: { title: 'Tablas avanzadas' },
  }),
  r(NOMBRES_RUTAS.TABLA_BULK, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/tablas/bulk-select.page.js'),
    meta: { title: 'Bulk select' },
  }),
  r(NOMBRES_RUTAS.MOD_ICONOS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/iconos.page.js'),
    meta: { title: 'Iconos' },
  }),
  r(NOMBRES_RUTAS.ICON_FONT_AWESOME, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/iconos/font-awesome.page.js'),
    meta: { title: 'Font Awesome' },
  }),
  r(NOMBRES_RUTAS.ICON_BOOTSTRAP, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/iconos/bootstrap.page.js'),
    meta: { title: 'Bootstrap Icons' },
  }),
  r(NOMBRES_RUTAS.ICON_FEATHER, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/iconos/feather.page.js'),
    meta: { title: 'Feather Icons' },
  }),
  r(NOMBRES_RUTAS.ICON_MATERIAL, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/iconos/material.page.js'),
    meta: { title: 'Material Symbols' },
  }),
  r(NOMBRES_RUTAS.MOD_MAPAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/mapas.page.js'),
    meta: { title: 'Mapas' },
  }),
  r(NOMBRES_RUTAS.MAPA_GOOGLE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/mapas/google.page.js'),
    meta: { title: 'Google Maps' },
  }),
  r(NOMBRES_RUTAS.MAPA_LEAFLET, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/mapas/leaflet.page.js'),
    meta: { title: 'Leaflet' },
  }),
  r(NOMBRES_RUTAS.MOD_UTILIDADES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/utilidades.page.js'),
    meta: { title: 'Utilidades' },
  }),
  r(NOMBRES_RUTAS.MOD_COMPONENTES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes.page.js'),
    meta: { title: 'Componentes' },
  }),

  // ============================== Componentes ==============================
  r(NOMBRES_RUTAS.COMP_ACORDEON, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/acordeon.page.js'),
    meta: { title: 'Acordeón' },
  }),
  r(NOMBRES_RUTAS.COMP_ALERTAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/alertas.page.js'),
    meta: { title: 'Alertas' },
  }),
  r(NOMBRES_RUTAS.COMP_AVISOS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/avisos.page.js'),
    meta: { title: 'Avisos modales' },
  }),
  r(NOMBRES_RUTAS.COMP_BADGES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/badges.page.js'),
    meta: { title: 'Insignias' },
  }),
  r(NOMBRES_RUTAS.COMP_BOTONES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/botones.page.js'),
    meta: { title: 'Botones' },
  }),
  r(NOMBRES_RUTAS.COMP_CARDS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/cards.page.js'),
    meta: { title: 'Tarjetas' },
  }),
  r(NOMBRES_RUTAS.COMP_MODALES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/modales.page.js'),
    meta: { title: 'Modales' },
  }),
  r(NOMBRES_RUTAS.COMP_DROPDOWNS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/dropdowns.page.js'),
    meta: { title: 'Menús desplegables' },
  }),
  r(NOMBRES_RUTAS.COMP_TOASTS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/toasts.page.js'),
    meta: { title: 'Notificaciones' },
  }),
  r(NOMBRES_RUTAS.COMP_TOOLTIPS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/tooltips.page.js'),
    meta: { title: 'Tooltips' },
  }),
  r(NOMBRES_RUTAS.COMP_SPINNERS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/spinners.page.js'),
    meta: { title: 'Spinners' },
  }),
  r(NOMBRES_RUTAS.COMP_TABS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/pestanas.page.js'),
    meta: { title: 'Pestañas' },
  }),
  r(NOMBRES_RUTAS.COMP_PROGRESS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/progreso.page.js'),
    meta: { title: 'Barra de progreso' },
  }),
  r(NOMBRES_RUTAS.COMP_TIMELINE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/timeline.page.js'),
    meta: { title: 'Línea de tiempo' },
  }),
  r(NOMBRES_RUTAS.COMP_AVATAR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/avatar.page.js'),
    meta: { title: 'Avatares' },
  }),
  r(NOMBRES_RUTAS.COMP_PAGINACION, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/paginacion.page.js'),
    meta: { title: 'Paginación' },
  }),

  // ============== Componentes nuevos (segundo lote) ==============
  r(NOMBRES_RUTAS.COMP_ANCLA, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/ancla.page.js'),
    meta: { title: 'Ancla' },
  }),
  r(NOMBRES_RUTAS.COMP_ICONOS_ANIM, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/iconos-animados.page.js'),
    meta: { title: 'Iconos animados' },
  }),
  r(NOMBRES_RUTAS.COMP_FONDO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/fondo.page.js'),
    meta: { title: 'Fondo / Decoraciones' },
  }),
  r(NOMBRES_RUTAS.COMP_BARRA_INF, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/barra-inferior.page.js'),
    meta: { title: 'Barra inferior' },
  }),
  r(NOMBRES_RUTAS.COMP_MIGAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/breadcrumbs.page.js'),
    meta: { title: 'Migas' },
  }),
  r(NOMBRES_RUTAS.COMP_CALENDAR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/calendario.page.js'),
    meta: { title: 'Calendario' },
  }),
  r(NOMBRES_RUTAS.COMP_CARRUSEL_BS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/carrusel-bs.page.js'),
    meta: { title: 'Carrusel' },
  }),
  r(NOMBRES_RUTAS.COMP_COLAPSO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/colapso.page.js'),
    meta: { title: 'Colapso' },
  }),
  r(NOMBRES_RUTAS.COMP_COOKIE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/cookie-notice.page.js'),
    meta: { title: 'Cookie notice' },
  }),
  r(NOMBRES_RUTAS.COMP_CONTADOR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/countup.page.js'),
    meta: { title: 'Countup' },
  }),
  r(NOMBRES_RUTAS.COMP_LIST_GROUP, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/list-group.page.js'),
    meta: { title: 'List group' },
  }),
  r(NOMBRES_RUTAS.COMP_NAVS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/navs.page.js'),
    meta: { title: 'Navs' },
  }),
  r(NOMBRES_RUTAS.COMP_NAVBAR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/navbar.page.js'),
    meta: { title: 'Navbar' },
  }),
  r(NOMBRES_RUTAS.COMP_NAV_VERT, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/nav-vertical.page.js'),
    meta: { title: 'Nav vertical' },
  }),
  r(NOMBRES_RUTAS.COMP_NAV_TOP, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/nav-top.page.js'),
    meta: { title: 'Top nav' },
  }),
  r(NOMBRES_RUTAS.COMP_NAV_DOBLE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/nav-doble.page.js'),
    meta: { title: 'Doble top' },
  }),
  r(NOMBRES_RUTAS.COMP_NAV_COMBO, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/nav-combo.page.js'),
    meta: { title: 'Combo nav' },
  }),
  r(NOMBRES_RUTAS.COMP_IMAGENES, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/imagenes.page.js'),
    meta: { title: 'Imágenes' },
  }),
  r(NOMBRES_RUTAS.COMP_FIGURAS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/figuras.page.js'),
    meta: { title: 'Figuras' },
  }),
  r(NOMBRES_RUTAS.COMP_HOVERBOX, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/hoverbox.page.js'),
    meta: { title: 'Hoverbox' },
  }),
  r(NOMBRES_RUTAS.COMP_LIGHTBOX, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/lightbox.page.js'),
    meta: { title: 'Lightbox' },
  }),
  r(NOMBRES_RUTAS.COMP_PLACEHOLDER, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/placeholder.page.js'),
    meta: { title: 'Placeholders' },
  }),
  r(NOMBRES_RUTAS.COMP_POPOVERS, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/popovers.page.js'),
    meta: { title: 'Popovers' },
  }),
  r(NOMBRES_RUTAS.COMP_SCROLLSPY, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/scrollspy.page.js'),
    meta: { title: 'Scrollspy' },
  }),
  r(NOMBRES_RUTAS.COMP_SEARCH, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/search.page.js'),
    meta: { title: 'Search' },
  }),
  r(NOMBRES_RUTAS.COMP_SORTABLE, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/sortable.page.js'),
    meta: { title: 'Sortable' },
  }),
  r(NOMBRES_RUTAS.COMP_TREEVIEW, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/treeview.page.js'),
    meta: { title: 'Treeview' },
  }),
  r(NOMBRES_RUTAS.COMP_TYPED, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/typed.page.js'),
    meta: { title: 'Texto tipeado' },
  }),
  r(NOMBRES_RUTAS.COMP_VIDEO_EMBED, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/video-embed.page.js'),
    meta: { title: 'Video embed' },
  }),
  r(NOMBRES_RUTAS.COMP_VIDEO_PLYR, {
    layout: 'dashboard', guards: [guardiaAutenticacion],
    component: () => import('../pages/modulos/componentes/video-plyr.page.js'),
    meta: { title: 'Video Plyr' },
  }),

  // Errores
  r(NOMBRES_RUTAS.ERROR_401, {
    layout: 'blank',
    component: () => import('../pages/errors/401/error-401.page.js'),
    meta: { title: '401 · Sesión requerida' },
  }),
  r(NOMBRES_RUTAS.ERROR_403, {
    layout: 'blank',
    component: () => import('../pages/errors/403/error-403.page.js'),
    meta: { title: '403 · Acceso denegado' },
  }),
  r(NOMBRES_RUTAS.ERROR_404, {
    layout: 'blank',
    component: () => import('../pages/errors/404/error-404.page.js'),
    meta: { title: '404 · No encontrado' },
  }),
  r(NOMBRES_RUTAS.ERROR_500, {
    layout: 'blank',
    component: () => import('../pages/errors/500/error-500.page.js'),
    meta: { title: '500 · Error del servidor' },
  }),
  r(NOMBRES_RUTAS.ERROR_503, {
    layout: 'blank',
    component: () => import('../pages/errors/503/error-503.page.js'),
    meta: { title: '503 · Servicio no disponible' },
  }),
  r(NOMBRES_RUTAS.ERROR_MANTENIMIENTO, {
    layout: 'blank',
    component: () => import('../pages/errors/mantenimiento/mantenimiento.page.js'),
    meta: { title: 'En mantenimiento' },
  }),
  r(NOMBRES_RUTAS.ERROR_OFFLINE, {
    layout: 'blank',
    component: () => import('../pages/errors/offline/offline.page.js'),
    meta: { title: 'Sin conexión' },
  }),

  // Catch-all
  { name: 'no-encontrado', path: '*', redirect: RUTAS[NOMBRES_RUTAS.ERROR_404] },
];
