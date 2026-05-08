import { crearEl } from '../../../utils/helpers/dom.js';
import { busEventos, EVENTOS_APP } from '../../../utils/helpers/event-bus.js';

/**
 * Captura errores síncronos lanzados por `render()` y muestra un fallback.
 * Se suscribe a `EVENTOS_APP.ERROR_CAPTURADO` para errores globales/async.
 */
export const LimiteError = ({ render, alternativa } = {}) => {
  const contenedor = crearEl('div', { class: 'error-boundary' });

  const renderAlternativa = (error) => {
    contenedor.replaceChildren(
      typeof alternativa === 'function'
        ? alternativa({ error, reintentar: ejecutarRender })
        : alternativa || crearEl('div', { style: { padding: 'var(--space-8)', textAlign: 'center' } }, [
            crearEl('h2', null, ['Algo salió mal']),
            crearEl('p', { class: 'text-muted' }, [error?.message || 'Error inesperado']),
          ])
    );
  };

  const ejecutarRender = () => {
    try { contenedor.replaceChildren(render()); }
    catch (err) {
      busEventos.emitir(EVENTOS_APP.ERROR_CAPTURADO, err);
      renderAlternativa(err);
    }
  };

  ejecutarRender();
  busEventos.on(EVENTOS_APP.ERROR_CAPTURADO, renderAlternativa);
  return contenedor;
};

/** Instala manejadores globales — debe llamarse una vez en el bootstrap. */
export const instalarManejadoresErrores = () => {
  window.addEventListener('error', (e) => {
    busEventos.emitir(EVENTOS_APP.ERROR_CAPTURADO, e.error || new Error(e.message));
  });
  window.addEventListener('unhandledrejection', (e) => {
    busEventos.emitir(EVENTOS_APP.ERROR_CAPTURADO, e.reason || new Error('Promesa rechazada sin manejar'));
  });
};
