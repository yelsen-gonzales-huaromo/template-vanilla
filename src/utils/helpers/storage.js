/**
 * Envoltorio seguro sobre Web Storage — maneja SSR, excepciones de cuota y parseo JSON.
 */
const seguro = (almacenamiento) => ({
  obtener(clave, porDefecto = null) {
    try {
      const crudo = almacenamiento.getItem(clave);
      return crudo === null ? porDefecto : JSON.parse(crudo);
    } catch { return porDefecto; }
  },
  guardar(clave, valor) {
    try { almacenamiento.setItem(clave, JSON.stringify(valor)); return true; }
    catch { return false; }
  },
  eliminar(clave) {
    try { almacenamiento.removeItem(clave); } catch { /* sin op */ }
  },
  limpiar() {
    try { almacenamiento.clear(); } catch { /* sin op */ }
  },
});

const sinOp = { obtener: (_, pd = null) => pd, guardar: () => false, eliminar() {}, limpiar() {} };

export const almacenamientoLocal  = typeof localStorage   !== 'undefined' ? seguro(localStorage)   : sinOp;
export const almacenamientoSesion = typeof sessionStorage !== 'undefined' ? seguro(sessionStorage) : sinOp;
