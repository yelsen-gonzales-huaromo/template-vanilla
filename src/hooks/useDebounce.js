import { senal, efecto } from '../utils/helpers/reactive.js';
import { antirebote } from '../utils/helpers/debounce.js';

/**
 * Devuelve una señal que refleja a `fuente` tras `espera` ms de inactividad.
 * Útil para campos de búsqueda en vivo sin saturar la API.
 */
export const usarAntirebote = (fuente, espera = 300) => {
  const aplazada = senal(fuente.peek?.() ?? fuente.value);
  const actualizar = antirebote((v) => { aplazada.value = v; }, espera);
  efecto(() => actualizar(fuente.value));
  return aplazada;
};
