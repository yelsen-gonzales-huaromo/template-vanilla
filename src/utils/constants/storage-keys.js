/** Claves de almacenamiento centralizadas — nunca referenciar cadenas crudas en componentes. */
export const CLAVES_ALMACENAMIENTO = Object.freeze({
  TOKEN_AUTH:        'template-vanilla.auth.token',
  TOKEN_REFRESH:     'template-vanilla.auth.refresh',
  USUARIO_AUTH:      'template-vanilla.auth.user',

  // Apariencia
  TEMA:              'template-vanilla.ui.theme',
  IDIOMA:            'template-vanilla.ui.locale',
  DIRECCION:         'template-vanilla.ui.dir',
  ESTADO_BARRA:      'template-vanilla.ui.sidebar',
  POSICION_NAV:      'template-vanilla.ui.navPos',
  ESTILO_SIDEBAR:    'template-vanilla.ui.sidebarStyle',
  DENSIDAD:          'template-vanilla.ui.density',
  TAMANO_FUENTE:     'template-vanilla.ui.fontSize',
  FUENTE:            'template-vanilla.ui.fontFamily',
  COLOR_MARCA:       'template-vanilla.ui.accent',

  // Otros
  RUTAS_RECIENTES:   'template-vanilla.ui.recent',
});
