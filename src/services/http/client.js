/**
 * Cliente HTTP — basado en fetch con un pipeline de interceptores.
 * Reemplaza axios/jQuery.ajax del template legacy; cero dependencias en runtime.
 */
import { CONFIG_APP } from '../../config/app.config.js';
import { busEventos, EVENTOS_APP } from '../../utils/helpers/event-bus.js';

const interceptoresPeticion  = [];
const interceptoresRespuesta = [];
const interceptoresError     = [];

export const clienteHttp = {
  usar(tipo, fn) {
    const mapa = { peticion: interceptoresPeticion, respuesta: interceptoresRespuesta, error: interceptoresError };
    mapa[tipo]?.push(fn);
    return () => {
      const arr = mapa[tipo];
      const idx = arr.indexOf(fn);
      if (idx >= 0) arr.splice(idx, 1);
    };
  },

  async peticion(entrada, init = {}) {
    const url = entrada.startsWith('http') ? entrada : `${CONFIG_APP.api.urlBase}${entrada}`;
    let config = {
      url,
      metodo: init.metodo || init.method || 'GET',
      cabeceras: { 'Content-Type': 'application/json', Accept: 'application/json', ...(init.cabeceras || init.headers || {}) },
      cuerpo: init.cuerpo ?? init.body,
      signal: init.signal,
      credentials: init.credentials || 'same-origin',
      params: init.params,
      _meta: init._meta || {},
    };

    for (const fn of interceptoresPeticion) config = (await fn(config)) || config;

    if (config.params && Object.keys(config.params).length > 0) {
      const qs = new URLSearchParams(config.params).toString();
      config.url += (config.url.includes('?') ? '&' : '?') + qs;
    }

    const controlador = new AbortController();
    const idTimeout = setTimeout(() => controlador.abort(), CONFIG_APP.api.tiempoEspera);
    const signal = config.signal || controlador.signal;

    busEventos.emitir(EVENTOS_APP.HTTP_PETICION, config);

    let respuesta;
    try {
      respuesta = await fetch(config.url, {
        method: config.metodo,
        headers: config.cabeceras,
        body: typeof config.cuerpo === 'string' || config.cuerpo instanceof FormData
          ? config.cuerpo
          : config.cuerpo ? JSON.stringify(config.cuerpo) : undefined,
        signal,
        credentials: config.credentials,
      });
    } catch (err) {
      clearTimeout(idTimeout);
      const envuelto = { config, message: err.message, original: err, esErrorRed: true };
      for (const fn of interceptoresError) await fn(envuelto);
      busEventos.emitir(EVENTOS_APP.HTTP_ERROR, envuelto);
      throw envuelto;
    }
    clearTimeout(idTimeout);

    const contentType = respuesta.headers.get('content-type') || '';
    const datos = contentType.includes('application/json')
      ? await respuesta.json().catch(() => null)
      : await respuesta.text();

    let resultado = { datos, status: respuesta.status, cabeceras: respuesta.headers, ok: respuesta.ok, config };

    if (!respuesta.ok) {
      const resErr = { ...resultado, message: datos?.message || respuesta.statusText, esErrorHttp: true };
      for (const fn of interceptoresError) await fn(resErr);
      busEventos.emitir(EVENTOS_APP.HTTP_ERROR, resErr);
      throw resErr;
    }

    for (const fn of interceptoresRespuesta) resultado = (await fn(resultado)) || resultado;
    busEventos.emitir(EVENTOS_APP.HTTP_RESPUESTA, resultado);
    return resultado.datos;
  },

  get(url, opciones = {})           { return clienteHttp.peticion(url, { ...opciones, metodo: 'GET' }); },
  post(url, cuerpo, opciones = {})  { return clienteHttp.peticion(url, { ...opciones, metodo: 'POST', cuerpo }); },
  put(url, cuerpo, opciones = {})   { return clienteHttp.peticion(url, { ...opciones, metodo: 'PUT', cuerpo }); },
  patch(url, cuerpo, opciones = {}) { return clienteHttp.peticion(url, { ...opciones, metodo: 'PATCH', cuerpo }); },
  delete(url, opciones = {})        { return clienteHttp.peticion(url, { ...opciones, metodo: 'DELETE' }); },
};
