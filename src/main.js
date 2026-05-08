/**
 * Bootstrap de la aplicación — el orden importa:
 *   1. Hidrata los stores (auth/ui desde localStorage) para que las guardias tengan estado.
 *   2. Inicializa los interceptores HTTP (auth/error/logging).
 *   3. Inicializa i18n (carga diferida del diccionario del idioma del usuario).
 *   4. Monta la región de avisos + manejadores globales de error.
 *   5. Inicializa el enrutador (resuelve la URL actual y renderiza la página).
 */
import { iniciarEstado } from './store/index.js';
import { iniciarEnrutador } from './router/index.js';
import { iniciarI18n } from './i18n/index.js';
import { iniciarHttp } from './services/http/index.js';
import { iniciarNotificaciones } from './components/ui/toast/toast.js';
import { instalarTooltipPortal } from './components/ui/tooltip/tooltip-portal.js';
import { instalarManejadoresErrores } from './components/common/error-boundary/error-boundary.js';
import { CONFIG_APP } from './config/app.config.js';

const arrancar = async () => {
  if (CONFIG_APP.ambiente === 'development') {
    console.info(`%c${CONFIG_APP.nombre} v${CONFIG_APP.version}`,
      'color:#3b82f6;font-weight:600;font-size:14px;');
  }

  instalarManejadoresErrores();
  iniciarEstado();
  iniciarHttp();
  await iniciarI18n();
  iniciarNotificaciones();
  instalarTooltipPortal();
  await iniciarEnrutador();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', arrancar);
} else {
  arrancar();
}
