import { PaginaError } from '../_error-page.js';
import { t } from '../../../i18n/index.js';

export default async () => PaginaError({
  codigo: 403,
  titulo: t('errors.403_title'),
  texto: t('errors.403_text'),
  animacion: './public/lottie/' + encodeURIComponent('404 error page with cat.json'),
});
