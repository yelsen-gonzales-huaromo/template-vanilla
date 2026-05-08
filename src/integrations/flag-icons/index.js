/**
 * Adaptador para flag-icons — banderas SVG por código ISO.
 *  https://flagicons.lipis.dev/   (MIT)
 *
 * Solo carga el CSS (sprite SVG hosteado en CDN). Cada bandera se renderiza
 * con `<span class="fi fi-pe"></span>` (código ISO 3166-1 alpha-2 en minúsculas).
 *
 * Por qué no emoji 🇵🇪 nativo: en Windows desktop (Chrome/Edge) las
 * regional-indicators no renderizan como banderas — muestran las dos letras
 * "PE". flag-icons usa SVG real y funciona en todos los navegadores.
 */
import { cargarCss } from '../_loader.js';

const VERSION = '7.2.3';
const URL_CSS = `https://cdn.jsdelivr.net/gh/lipis/flag-icons@${VERSION}/css/flag-icons.min.css`;

let cargado = false;

export const cargarFlagIcons = () => {
  if (cargado) return;
  cargarCss(URL_CSS);
  cargado = true;
};
