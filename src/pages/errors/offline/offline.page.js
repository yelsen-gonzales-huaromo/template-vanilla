import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  titulo: 'Sin conexión',
  texto: 'No detectamos conexión a internet. Verifica tu red WiFi o datos móviles.',
  animacion: './public/lottie/' + encodeURIComponent('Cloud robotics abstract.json'),
});
