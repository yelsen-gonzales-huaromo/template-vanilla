import { PaginaError } from '../_error-page.js';
import { t } from '../../../i18n/index.js';

export default async () => PaginaError({
  codigo: 500,
  titulo: t('errors.500_title'),
  texto: t('errors.500_text'),
  animacion: './public/lottie/' + encodeURIComponent('Sign for error _ Flat style.json'),
  acciones: [
    { texto: 'Reintentar', variante: 'primary', onClick: () => location.reload() },
    { texto: 'Reportar problema', variante: 'outline',
      onClick: () => window.open('mailto:soporte@launchpad.dev?subject=Error%20500', '_blank') },
  ],
  pista: 'Error code: 500 · Internal server error',
});
