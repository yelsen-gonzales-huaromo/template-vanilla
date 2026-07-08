import { clienteHttp } from './http/client.js';
import { CONFIG_APP } from '../config/app.config.js';

/**
 * Servicio de autenticación. Si `CONFIG_APP.modoDemo` está activo,
 * devolvemos sesiones falsas para poder navegar la app sin backend.
 */

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

const sesionDemo = (correo = 'demo@template-vanilla.dev') => ({
  usuario: {
    id: 'demo-1',
    nombre: correo.split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase()),
    email: correo,
    rol: 'admin',
    avatar: '',
    telefono: '+34 600 000 000',
    ciudad: 'Madrid',
  },
  token: 'demo-' + Math.random().toString(36).slice(2),
  refresh: 'demo-refresh',
});

export const iniciarSesion = async (credenciales) => {
  if (CONFIG_APP.modoDemo) {
    await dormir(250);
    if (!credenciales?.email) throw { message: 'Correo requerido' };
    return sesionDemo(credenciales.email);
  }
  return clienteHttp.post('/auth/login', credenciales, { _meta: { omitirAuth: true } });
};

export const registrar = async (datos) => {
  if (CONFIG_APP.modoDemo) {
    await dormir(250);
    return sesionDemo(datos?.email || 'nuevo@template-vanilla.dev');
  }
  return clienteHttp.post('/auth/register', datos, { _meta: { omitirAuth: true } });
};

export const cerrarSesion = async () => {
  if (CONFIG_APP.modoDemo) return;
  return clienteHttp.post('/auth/logout');
};

export const miPerfil = async () => {
  if (CONFIG_APP.modoDemo) return sesionDemo().usuario;
  return clienteHttp.get('/auth/me');
};

export const recuperarContrasena = async (correo) => {
  if (CONFIG_APP.modoDemo) { await dormir(300); return; }
  return clienteHttp.post('/auth/forgot-password', { email: correo }, { _meta: { omitirAuth: true } });
};

export const restablecerContrasena = async ({ token, contrasena }) => {
  if (CONFIG_APP.modoDemo) { await dormir(300); return; }
  return clienteHttp.post('/auth/reset-password', { token, password: contrasena }, { _meta: { omitirAuth: true } });
};

export const renovarToken = async (refresh) => {
  if (CONFIG_APP.modoDemo) return sesionDemo();
  return clienteHttp.post('/auth/refresh', { refresh }, { _meta: { omitirAuth: true } });
};
