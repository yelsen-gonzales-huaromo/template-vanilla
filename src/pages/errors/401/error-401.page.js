import { PaginaError } from '../_error-page.js';
import { navegarA } from '../../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../../config/routes.config.js';

export default async () => PaginaError({
  codigo: 401,
  titulo: 'Sesión requerida',
  texto: 'Necesitas iniciar sesión para acceder a esta página. Si ya tenías una sesión activa, es posible que haya expirado.',
  animacion: './public/lottie/' + encodeURIComponent('Cosmos.json'),
  acciones: [
    { texto: 'Iniciar sesión', variante: 'primary',
      onClick: () => navegarA(RUTAS[NOMBRES_RUTAS.LOGIN] || '#/auth/login') },
    { texto: '← Volver al inicio', variante: 'outline',
      onClick: () => navegarA(RUTAS[NOMBRES_RUTAS.PANEL]) },
  ],
  pista: 'Error code: 401 · Unauthorized',
});
