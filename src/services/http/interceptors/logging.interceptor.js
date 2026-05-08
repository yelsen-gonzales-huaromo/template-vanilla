import { CONFIG_APP } from '../../../config/app.config.js';

/** Logger de peticiones/respuestas sólo en dev. No-op en producción. */
export const interceptorLogPeticion = (config) => {
  if (CONFIG_APP.ambiente === 'development') {
    console.debug(`[http] → ${config.metodo} ${config.url}`);
  }
  return config;
};

export const interceptorLogRespuesta = (resultado) => {
  if (CONFIG_APP.ambiente === 'development') {
    console.debug(`[http] ← ${resultado.status} ${resultado.config.url}`);
  }
  return resultado;
};
