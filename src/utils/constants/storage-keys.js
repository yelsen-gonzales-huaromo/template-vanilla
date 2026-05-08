/** Claves de almacenamiento centralizadas — nunca referenciar cadenas crudas en componentes. */
export const CLAVES_ALMACENAMIENTO = Object.freeze({
  TOKEN_AUTH:        'launchpad.auth.token',
  TOKEN_REFRESH:     'launchpad.auth.refresh',
  USUARIO_AUTH:      'launchpad.auth.user',

  // Apariencia
  TEMA:              'launchpad.ui.theme',
  IDIOMA:            'launchpad.ui.locale',
  DIRECCION:         'launchpad.ui.dir',
  ESTADO_BARRA:      'launchpad.ui.sidebar',
  POSICION_NAV:      'launchpad.ui.navPos',
  ESTILO_SIDEBAR:    'launchpad.ui.sidebarStyle',
  DENSIDAD:          'launchpad.ui.density',
  TAMANO_FUENTE:     'launchpad.ui.fontSize',
  FUENTE:            'launchpad.ui.fontFamily',
  COLOR_MARCA:       'launchpad.ui.accent',

  // Otros
  RUTAS_RECIENTES:   'launchpad.ui.recent',
});
