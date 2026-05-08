export const formatearNumero = (valor, opciones = {}) => {
  const { locale = navigator.language, ...resto } = opciones;
  return new Intl.NumberFormat(locale, resto).format(valor ?? 0);
};

export const formatearMoneda = (valor, moneda = 'USD', locale = navigator.language) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: moneda }).format(valor ?? 0);

export const formatearPorcentaje = (valor, locale = navigator.language) =>
  new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(valor ?? 0);

export const formatearBytes = (bytes, decimales = 2) => {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 B';
  const unidades = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(decimales)} ${unidades[i]}`;
};
