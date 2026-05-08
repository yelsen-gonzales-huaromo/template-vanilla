/**
 * Adaptador para Leaflet — mapas interactivos.
 *  https://leafletjs.com/
 *
 *   const { contenedor, mapa } = await Mapa({
 *     centro: [40.41, -3.70], zoom: 13,
 *     marcadores: [{ lat: 40.41, lng: -3.70, titulo: 'Madrid' }],
 *   });
 */
import { cargarLib } from '../_loader.js';

const VERSION = '1.9.4';
const URL_CSS = `https://unpkg.com/leaflet@${VERSION}/dist/leaflet.css`;
const URL_JS  = `https://unpkg.com/leaflet@${VERSION}/dist/leaflet.js`;

export const cargarLeaflet = () => cargarLib({
  css: URL_CSS,
  scripts: URL_JS,
  global: 'L',
});

/**
 * Crea un contenedor con Leaflet montado.
 * @param {object} opts
 * @param {[number,number]} [opts.centro=[40.41,-3.70]]
 * @param {number} [opts.zoom=12]
 * @param {Array}  [opts.marcadores=[]] - { lat, lng, titulo, popup }
 * @param {string} [opts.alto='400px']
 * @param {boolean}[opts.scrollWheelZoom=false]
 * @returns {Promise<{contenedor: HTMLDivElement, mapa: object, agregarMarcador: Function}>}
 */
export const Mapa = async ({
  centro = [40.4168, -3.7038],
  zoom = 12,
  marcadores = [],
  alto = '400px',
  scrollWheelZoom = false,
} = {}) => {
  const L = await cargarLeaflet();

  const contenedor = document.createElement('div');
  contenedor.style.width = '100%';
  contenedor.style.height = alto;
  contenedor.style.borderRadius = 'var(--radius)';
  contenedor.style.overflow = 'hidden';

  // Pequeño truco: L.map necesita el div en el DOM con tamaño. Devolvemos el
  // contenedor y dejamos que el caller lo monte; iniciamos el mapa al detectar
  // que entra en el viewport.
  const observador = new IntersectionObserver((entradas) => {
    if (entradas[0].isIntersecting) {
      observador.disconnect();
      iniciarMapa();
    }
  });
  observador.observe(contenedor);

  let mapa;
  const cola = [];

  const iniciarMapa = () => {
    mapa = L.map(contenedor, { scrollWheelZoom }).setView(centro, zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 19,
    }).addTo(mapa);

    marcadores.forEach(agregarMarcadorInterno);
    cola.forEach(fn => fn());
  };

  const agregarMarcadorInterno = ({ lat, lng, titulo, popup }) => {
    const m = L.marker([lat, lng], titulo ? { title: titulo } : {}).addTo(mapa);
    if (popup) m.bindPopup(popup);
    return m;
  };

  const agregarMarcador = (m) => {
    if (mapa) agregarMarcadorInterno(m);
    else cola.push(() => agregarMarcadorInterno(m));
  };

  return {
    contenedor,
    get mapa() { return mapa; },
    agregarMarcador,
  };
};
