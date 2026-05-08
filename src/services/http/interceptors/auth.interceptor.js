import { estadoAuth } from '../../../store/auth.store.js';
import { CONFIG_APP } from '../../../config/app.config.js';

/** Adjunta el token Bearer si hay sesión. Omitir con `_meta.omitirAuth = true`. */
export const interceptorAuth = (config) => {
  if (config._meta?.omitirAuth) return config;
  const token = estadoAuth.token.peek();
  if (token) {
    config.cabeceras[CONFIG_APP.auth.cabeceraToken] = `${CONFIG_APP.auth.prefijoToken} ${token}`;
  }
  return config;
};
