/** Antirebote: difiere la ejecución hasta que pase `espera` ms sin nuevas llamadas. */
export const antirebote = (fn, espera = 250) => {
  let temporizador = null;
  const aplazado = (...args) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), espera);
  };
  aplazado.cancelar = () => clearTimeout(temporizador);
  return aplazado;
};

/** Acelerador (throttle): asegura como máximo 1 ejecución por `espera` ms. */
export const acelerador = (fn, espera = 250) => {
  let ultima = 0;
  let temporizador = null;
  return (...args) => {
    const ahora = Date.now();
    const restante = espera - (ahora - ultima);
    if (restante <= 0) {
      clearTimeout(temporizador);
      ultima = ahora;
      fn(...args);
    } else if (!temporizador) {
      temporizador = setTimeout(() => {
        ultima = Date.now();
        temporizador = null;
        fn(...args);
      }, restante);
    }
  };
};
