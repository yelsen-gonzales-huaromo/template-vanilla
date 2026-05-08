import { clienteHttp } from './client.js';
import { interceptorAuth } from './interceptors/auth.interceptor.js';
import { interceptorError } from './interceptors/error.interceptor.js';
import { interceptorLogPeticion, interceptorLogRespuesta } from './interceptors/logging.interceptor.js';

let inicializado = false;

export const iniciarHttp = () => {
  if (inicializado) return clienteHttp;
  clienteHttp.usar('peticion', interceptorLogPeticion);
  clienteHttp.usar('peticion', interceptorAuth);
  clienteHttp.usar('respuesta', interceptorLogRespuesta);
  clienteHttp.usar('error', interceptorError);
  inicializado = true;
  return clienteHttp;
};

export { clienteHttp };
