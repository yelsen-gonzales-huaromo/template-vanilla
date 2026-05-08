import { senal } from '../utils/helpers/reactive.js';
import { clienteHttp } from '../services/http/client.js';

/**
 * Hook reactivo de recurso — expone señales `datos`/`cargando`/`error` y un re-ejecutor.
 * Re-pide transparentemente al llamar a `refrescar()`.
 */
export const usarPeticion = (urlOFn, opciones = {}) => {
  const datos    = senal(null);
  const error    = senal(null);
  const cargando = senal(false);

  const ejecutar = async (sobrescritos = {}) => {
    cargando.value = true;
    error.value = null;
    try {
      const url = typeof urlOFn === 'function' ? urlOFn() : urlOFn;
      datos.value = await clienteHttp.get(url, { ...opciones, ...sobrescritos });
    } catch (err) {
      error.value = err;
      datos.value = null;
    } finally {
      cargando.value = false;
    }
  };

  if (!opciones.perezoso) ejecutar();

  return { datos, error, cargando, refrescar: ejecutar };
};
