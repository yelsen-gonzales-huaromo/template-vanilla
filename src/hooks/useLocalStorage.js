import { senal, efecto } from '../utils/helpers/reactive.js';
import { almacenamientoLocal } from '../utils/helpers/storage.js';

/** Sincronización bidireccional entre una señal y localStorage, con sync entre pestañas. */
export const usarAlmacenamientoLocal = (clave, inicial) => {
  const guardado = almacenamientoLocal.obtener(clave, inicial);
  const estado = senal(guardado);

  efecto(() => { almacenamientoLocal.guardar(clave, estado.value); });

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
      if (e.key === clave) {
        try { estado.value = e.newValue === null ? inicial : JSON.parse(e.newValue); }
        catch { /* mantener actual */ }
      }
    });
  }

  return estado;
};
