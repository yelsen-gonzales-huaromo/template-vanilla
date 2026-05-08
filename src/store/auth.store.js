import { senal, calculado } from '../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../utils/helpers/storage.js';
import { busEventos, EVENTOS_APP } from '../utils/helpers/event-bus.js';
import { CLAVES_ALMACENAMIENTO, PERMISOS_POR_ROL, PERMISOS } from '../utils/constants/index.js';

const usuario = senal(null);
const token   = senal(null);

export const estadoAuth = {
  usuario,
  token,
  estaAutenticado: calculado(() => Boolean(token.value && usuario.value)),

  hidratar() {
    token.value   = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.TOKEN_AUTH);
    usuario.value = almacenamientoLocal.obtener(CLAVES_ALMACENAMIENTO.USUARIO_AUTH);
  },

  establecerSesion({ usuario: u, token: t, refresh }) {
    usuario.value = u;
    token.value   = t;
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.USUARIO_AUTH, u);
    almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.TOKEN_AUTH, t);
    if (refresh) almacenamientoLocal.guardar(CLAVES_ALMACENAMIENTO.TOKEN_REFRESH, refresh);
    busEventos.emitir(EVENTOS_APP.AUTH_INICIO, u);
  },

  limpiar() {
    usuario.value = null;
    token.value   = null;
    almacenamientoLocal.eliminar(CLAVES_ALMACENAMIENTO.USUARIO_AUTH);
    almacenamientoLocal.eliminar(CLAVES_ALMACENAMIENTO.TOKEN_AUTH);
    almacenamientoLocal.eliminar(CLAVES_ALMACENAMIENTO.TOKEN_REFRESH);
    busEventos.emitir(EVENTOS_APP.AUTH_CIERRE);
  },

  tieneRol(rol) { return usuario.value?.rol === rol; },

  tienePermiso(permiso) {
    const rol = usuario.value?.rol;
    if (!rol) return false;
    const lista = PERMISOS_POR_ROL[rol] || [];
    return lista.includes(PERMISOS.ADMIN) || lista.includes(permiso);
  },
};
