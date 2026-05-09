import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  codigo: 503,
  titulo: 'Servicio no disponible',
  texto: 'El servidor está sobrecargado o en mantenimiento. Inténtalo de nuevo en unos minutos.',
  animacion: './public/lottie/' + encodeURIComponent('Loading gears.json'),
});
