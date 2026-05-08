import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  codigo: 503,
  titulo: 'Servicio no disponible',
  texto: 'El servidor está sobrecargado o en mantenimiento temporal. Por favor intenta de nuevo en unos minutos. Si el problema persiste, contacta a soporte.',
  animacion: './public/lottie/' + encodeURIComponent('Loading gears.json'),
  acciones: [
    { texto: 'Reintentar', variante: 'primary', onClick: () => location.reload() },
    { texto: 'Ver estado del sistema', variante: 'outline',
      onClick: () => window.open('https://status.launchpad.dev', '_blank') },
  ],
  pista: 'Error code: 503 · Service Unavailable',
});
