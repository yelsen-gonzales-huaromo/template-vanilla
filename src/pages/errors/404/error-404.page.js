import { PaginaError } from '../_error-page.js';
import { t } from '../../../i18n/index.js';

export default async () => PaginaError({
  codigo: 404,
  titulo: t('errors.404_title'),
  texto: t('errors.404_text'),
  animacion: './public/lottie/' + encodeURIComponent('404 error lost in space astronaut.json'),
  pista: 'Error code: 404 · Resource not found',
});
