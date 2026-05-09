import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  codigo: 401,
  titulo: 'Sesión requerida',
  texto: 'Necesitas iniciar sesión para acceder a esta página. Si tu sesión expiró, vuelve a entrar.',
  animacion: './public/lottie/' + encodeURIComponent('Cosmos.json'),
  enlaceTexto: '← Iniciar sesión',
  rutaInicio: '#/ingresar',
});
