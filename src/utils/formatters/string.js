export const capitalizar = (s = '') =>
  s ? s[0].toUpperCase() + s.slice(1) : '';

export const truncar = (s = '', max = 60, sufijo = '…') =>
  s.length > max ? s.slice(0, max - sufijo.length) + sufijo : s;

export const slug = (s = '') =>
  s.toString()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export const iniciales = (nombre = '', cantidad = 2) =>
  nombre.trim().split(/\s+/).slice(0, cantidad).map(p => p[0]?.toUpperCase() ?? '').join('');

/** Escapa cadenas provistas por usuario antes de inyectar en innerHTML. */
export const escaparHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
