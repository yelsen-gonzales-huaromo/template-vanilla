/**
 * Catálogo de iconos SVG/PNG profesionales — viven en `/public/img/icons/`.
 * Iconos estáticos modernos para botones, listas, badges, features sections,
 * cards, etc. Funcionan offline, son livianos (~1KB cada uno).
 *
 * Para añadir más:
 *   1) Pon el archivo (.svg o .png) en /public/img/icons/
 *   2) Añade aquí la entrada con `archivo` y `categoria`
 */

const RUTA = './public/img/icons/';

export const SVG_ICONOS_PRO = {
  flechas: {
    titulo: 'Flechas',
    items: [
      { id: 'arrows-h',          nombre: 'Flechas horizontales', archivo: 'arrows-h.svg' },
      { id: 'chevron-up',        nombre: 'Chevron arriba',       archivo: 'chevron-up.svg' },
      { id: 'double-chevron',    nombre: 'Doble chevron',        archivo: 'double-chevron-up.svg' },
      { id: 'triple-chevron',    nombre: 'Triple chevron',       archivo: 'triple-chevron-up.svg' },
      { id: 'left-arrow-from',   nombre: 'Flecha desde izq.',    archivo: 'left-arrow-from-left.svg' },
    ],
  },
  acciones: {
    titulo: 'Acciones',
    items: [
      { id: 'play',              nombre: 'Reproducir',           archivo: 'play.svg' },
      { id: 'edit-alt',          nombre: 'Editar',               archivo: 'edit-alt.svg' },
      { id: 'paragraph',         nombre: 'Párrafo',              archivo: 'paragraph.svg' },
      { id: 'target',            nombre: 'Objetivo',             archivo: 'target.svg' },
      { id: 'star-on',           nombre: 'Estrella',             archivo: 'star_on.svg' },
    ],
  },
  red: {
    titulo: 'Red / Cloud',
    items: [
      { id: 'cloud-download',    nombre: 'Cloud download',       archivo: 'cloud-download.svg' },
      { id: 'cloud-upload',      nombre: 'Cloud upload',         archivo: 'cloud-upload.svg' },
      { id: 'networking',        nombre: 'Networking',           archivo: 'networking.svg' },
      { id: 'signal',            nombre: 'Señal',                archivo: 'signal.png' },
    ],
  },
  pago: {
    titulo: 'Pago',
    items: [
      { id: 'visa',              nombre: 'Visa',                 archivo: 'visa.png' },
      { id: 'mastercard',        nombre: 'Mastercard',           archivo: 'master-card.png' },
      { id: 'paypal',            nombre: 'PayPal',               archivo: 'icon-paypal-full.png' },
      { id: 'chip',              nombre: 'Chip',                 archivo: 'chip.png' },
    ],
  },
  marketing: {
    titulo: 'Marketing / Plan',
    items: [
      { id: 'pro',               nombre: 'Pro',                  archivo: 'pro.svg' },
      { id: 'free',              nombre: 'Free',                 archivo: 'free.svg' },
      { id: 'discount',          nombre: 'Descuento',            archivo: 'discount.svg' },
    ],
  },
  usuarios: {
    titulo: 'Usuarios',
    items: [
      { id: 'user-plus',         nombre: 'Añadir usuario',       archivo: 'user-plus.svg' },
      { id: 'users',             nombre: 'Usuarios',             archivo: 'users.svg' },
    ],
  },
  generales: {
    titulo: 'Generales',
    items: [
      { id: 'shield',            nombre: 'Escudo',               archivo: 'shield.png' },
      { id: 'cookie',            nombre: 'Cookie',               archivo: 'cookie-1.png' },
      { id: 'docs',              nombre: 'Documentos',           archivo: 'docs.png' },
      { id: 'zip',               nombre: 'ZIP',                  archivo: 'zip.png' },
      { id: 'connect-circle',    nombre: 'Conectar',             archivo: 'connect-circle.png' },
    ],
  },
};

export const SVG_TODOS = Object.entries(SVG_ICONOS_PRO).flatMap(([cat, sec]) =>
  sec.items.map((it) => ({ ...it, categoria: cat, src: `${RUTA}${it.archivo}` })),
);

/** Renderiza un icono SVG/PNG por su id. */
export const IconoPro = (id, { tamano = 32, alt = '' } = {}) => {
  const item = SVG_TODOS.find((i) => i.id === id);
  const img = document.createElement('img');
  if (item) {
    img.src = item.src;
    img.alt = alt || item.nombre;
  } else {
    img.alt = `?${id}?`;
  }
  img.style.width = typeof tamano === 'number' ? `${tamano}px` : tamano;
  img.style.height = 'auto';
  img.style.display = 'inline-block';
  return img;
};
