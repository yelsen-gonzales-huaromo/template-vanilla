import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  titulo: 'En mantenimiento',
  texto: 'Estamos haciendo mejoras importantes. Volveremos en breve.',
  animacion: './public/lottie/' + encodeURIComponent('coffee-break.json'),
});
