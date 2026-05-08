/** Catálogo de permisos — mantén sincronizado con las tablas RBAC del backend. */
export const PERMISOS = Object.freeze({
  USUARIO_LEER:     'user:read',
  USUARIO_ESCRIBIR: 'user:write',
  USUARIO_ELIMINAR: 'user:delete',
  REPORTE_LEER:     'report:read',
  REPORTE_ESCRIBIR: 'report:write',
  ADMIN:            'admin:*',
});

export const ROLES = Object.freeze({
  INVITADO: 'guest',
  USUARIO:  'user',
  EDITOR:   'editor',
  ADMIN:    'admin',
});

export const PERMISOS_POR_ROL = Object.freeze({
  [ROLES.INVITADO]: [],
  [ROLES.USUARIO]:  [PERMISOS.USUARIO_LEER, PERMISOS.REPORTE_LEER],
  [ROLES.EDITOR]:   [PERMISOS.USUARIO_LEER, PERMISOS.REPORTE_LEER, PERMISOS.REPORTE_ESCRIBIR],
  [ROLES.ADMIN]:    [PERMISOS.ADMIN],
});
