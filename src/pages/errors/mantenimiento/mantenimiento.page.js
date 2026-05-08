import { PaginaError } from '../_error-page.js';

export default async () => PaginaError({
  codigo: '⚙',
  titulo: 'En mantenimiento',
  texto: 'Estamos haciendo mejoras importantes. Volveremos en breve. Sigue nuestro estado o suscríbete para recibir un aviso cuando estemos de vuelta.',
  animacion: './public/lottie/' + encodeURIComponent('coffee-break.json'),
  acciones: [
    { texto: 'Ver estado en vivo', variante: 'primary',
      onClick: () => window.open('https://status.launchpad.dev', '_blank') },
    { texto: 'Notificarme cuando vuelva', variante: 'outline',
      onClick: () => window.open('mailto:soporte@launchpad.dev?subject=Notificarme', '_blank') },
  ],
  pista: 'Mantenimiento programado · ETA ~30 min',
});
