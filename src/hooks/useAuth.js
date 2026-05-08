import { estadoAuth } from '../store/auth.store.js';
import * as servicioAuth from '../services/auth.service.js';
import { estadoNotificaciones } from '../store/notifications.store.js';

/**
 * Composable para flujos de autenticación — envuelve el store y los servicios
 * para que los componentes no tengan que coordinarlos. Refleja la API de un hook
 * de Vue/React pero en JS nativo.
 */
export const usarAutenticacion = () => ({
  usuario: estadoAuth.usuario,
  token: estadoAuth.token,
  estaAutenticado: estadoAuth.estaAutenticado,
  tieneRol: estadoAuth.tieneRol.bind(estadoAuth),
  tienePermiso: estadoAuth.tienePermiso.bind(estadoAuth),

  async iniciarSesion(credenciales) {
    const sesion = await servicioAuth.iniciarSesion(credenciales);
    estadoAuth.establecerSesion(sesion);
    return sesion;
  },

  async registrar(datos) {
    const sesion = await servicioAuth.registrar(datos);
    estadoAuth.establecerSesion(sesion);
    return sesion;
  },

  async cerrarSesion() {
    try { await servicioAuth.cerrarSesion(); }
    catch { /* ignorar — lo importante es limpiar el estado local */ }
    estadoAuth.limpiar();
  },

  async recuperarContrasena(correo) {
    await servicioAuth.recuperarContrasena(correo);
    estadoNotificaciones.exito('Correo de recuperación enviado.');
  },

  async restablecerContrasena(token, contrasena) {
    await servicioAuth.restablecerContrasena({ token, contrasena });
    estadoNotificaciones.exito('Contraseña actualizada.');
  },
});
