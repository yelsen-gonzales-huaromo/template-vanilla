/** Formato de fechas con soporte de locale — basado en Intl, sin moment.js. */
export const formatearFecha = (entrada, opciones = {}) => {
  if (!entrada) return '';
  const fecha = entrada instanceof Date ? entrada : new Date(entrada);
  if (Number.isNaN(fecha.getTime())) return '';
  const { locale = navigator.language, ...resto } = opciones;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric', month: 'short', day: '2-digit', ...resto,
  }).format(fecha);
};

export const formatearFechaHora = (entrada, opciones = {}) =>
  formatearFecha(entrada, { hour: '2-digit', minute: '2-digit', ...opciones });

const UNIDADES_RELATIVAS = [
  ['year',   60 * 60 * 24 * 365],
  ['month',  60 * 60 * 24 * 30],
  ['week',   60 * 60 * 24 * 7],
  ['day',    60 * 60 * 24],
  ['hour',   60 * 60],
  ['minute', 60],
  ['second', 1],
];

export const formatearRelativo = (entrada, locale = navigator.language) => {
  const fecha = entrada instanceof Date ? entrada : new Date(entrada);
  const diffSegundos = (fecha.getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unidad, segs] of UNIDADES_RELATIVAS) {
    if (Math.abs(diffSegundos) >= segs || unidad === 'second') {
      return rtf.format(Math.round(diffSegundos / segs), unidad);
    }
  }
  return '';
};
