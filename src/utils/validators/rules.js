/**
 * Reglas de validación de formularios componibles. Cada regla devuelve `null` (válido)
 * o una clave i18n (inválido). Usa `validar(valor, [...reglas])` para ejecutarlas.
 */
export const obligatorio = (msj = 'validation.required') => (v) =>
  v === undefined || v === null || (typeof v === 'string' && v.trim() === '') ? msj : null;

export const longitudMinima = (n, msj = 'validation.min_length') => (v) =>
  typeof v === 'string' && v.length < n ? { key: msj, params: { n } } : null;

export const longitudMaxima = (n, msj = 'validation.max_length') => (v) =>
  typeof v === 'string' && v.length > n ? { key: msj, params: { n } } : null;

export const patron = (regex, msj = 'validation.pattern') => (v) =>
  v && !regex.test(v) ? msj : null;

const RE_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const correo = (msj = 'validation.email') => (v) =>
  v && !RE_CORREO.test(v) ? msj : null;

const RE_URL = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
export const url = (msj = 'validation.url') => (v) =>
  v && !RE_URL.test(v) ? msj : null;

export const coincide = (obtenerOtroValor, msj = 'validation.match') => (v) =>
  v !== obtenerOtroValor() ? msj : null;

export const numerico = (msj = 'validation.numeric') => (v) =>
  v !== '' && Number.isNaN(Number(v)) ? msj : null;

export const validar = (valor, reglas = []) => {
  for (const regla of reglas) {
    const resultado = regla(valor);
    if (resultado) return resultado;
  }
  return null;
};

export const validarFormulario = (valores, esquema) => {
  const errores = {};
  for (const [campo, reglas] of Object.entries(esquema)) {
    const error = validar(valores[campo], reglas);
    if (error) errores[campo] = error;
  }
  return { valido: Object.keys(errores).length === 0, errores };
};
