import { clienteHttp } from './http/client.js';
import { CONFIG_APP } from '../config/app.config.js';
import { estadoAuth } from '../store/auth.store.js';

const dormir = (ms) => new Promise(r => setTimeout(r, ms));

export const listar = (parametros = {}) => {
  if (CONFIG_APP.modoDemo) return Promise.resolve({ items: [], total: 0 });
  return clienteHttp.get('/users', { params: parametros });
};

export const obtenerPorId = (id) => {
  if (CONFIG_APP.modoDemo) return Promise.resolve({ id, nombre: 'Demo' });
  return clienteHttp.get(`/users/${id}`);
};

export const crear = async (datos) => {
  if (CONFIG_APP.modoDemo) { await dormir(200); return { id: Date.now(), ...datos }; }
  return clienteHttp.post('/users', datos);
};

export const actualizar = async (id, datos) => {
  if (CONFIG_APP.modoDemo) { await dormir(200); return { id, ...datos }; }
  return clienteHttp.patch(`/users/${id}`, datos);
};

export const eliminar = async (id) => {
  if (CONFIG_APP.modoDemo) { await dormir(200); return { id }; }
  return clienteHttp.delete(`/users/${id}`);
};

export const actualizarPerfil = async (datos) => {
  if (CONFIG_APP.modoDemo) {
    await dormir(250);
    const actual = estadoAuth.usuario.peek() || {};
    return { ...actual, ...datos, nombre: datos.name || actual.nombre, email: datos.email || actual.email };
  }
  return clienteHttp.patch('/users/me', datos);
};

export const cambiarContrasena = async (actual, nueva) => {
  if (CONFIG_APP.modoDemo) { await dormir(250); return { ok: true }; }
  return clienteHttp.post('/users/me/password', { current: actual, next: nueva });
};
