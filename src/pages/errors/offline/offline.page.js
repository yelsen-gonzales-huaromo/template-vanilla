import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  codigo: '⚡',
  titulo: 'Sin conexión',
  texto: 'No detectamos conexión a internet. Verifica tu red WiFi o datos móviles. Tu trabajo guardado seguirá ahí cuando vuelvas.',
  animacion: './public/lottie/' + encodeURIComponent('Cloud robotics abstract.json'),
  acciones: [
    { texto: 'Reintentar', variante: 'primary', onClick: () => location.reload() },
    { texto: 'Modo offline', variante: 'outline', onClick: () => history.back() },
  ],
  pista: 'Error: NetworkError · Verifica tu conexión',
});
