/**
 * PaginaError — plantilla minimalista estilo NobleUI.
 *
 * Layout: ilustración Lottie centrada, número grande en gris, título corto,
 * sub-texto pequeño, un solo enlace "← Volver al inicio". Sin gradientes
 * pesados, sin grid. Funciona idéntico en claro y oscuro vía tokens.
 *
 * Uso:
 *   PaginaError({
 *     codigo: 500,
 *     titulo: 'Internal server error',
 *     texto: 'Oopps! Hubo un error. Inténtalo más tarde.',
 *     animacion: './public/lottie/Error 404.json', // opcional
 *     enlaceTexto: '← Volver al inicio',           // opcional
 *     enlaceHref:  '#/panel',                       // opcional
 *   });
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';
import { Animacion } from '../../integrations/lottie/index.js';

export const PaginaError = ({
  codigo,
  titulo,
  texto,
  animacion,
  enlaceTexto = '← Volver al inicio',
  rutaInicio = RUTAS[NOMBRES_RUTAS.PANEL],
} = {}) => {
  // Contenedor de la ilustración (carga lazy, no bloquea el render)
  const contenedorAnim = crearEl('div', { class: 'pg-error__ilustracion' });
  if (animacion) {
    Animacion({ url: animacion, alto: '100%', ancho: '100%' })
      .then(({ contenedor }) => {
        contenedor.style.width = '100%';
        contenedor.style.height = '100%';
        contenedorAnim.appendChild(contenedor);
      })
      .catch(() => {
        contenedorAnim.classList.add('pg-error__ilustracion--vacia');
      });
  }

  return crearEl('div', { class: 'pg-error' }, [
    crearEl('div', { class: 'pg-error__contenido' }, [
      contenedorAnim,
      codigo != null && crearEl('h1', { class: 'pg-error__codigo' }, [String(codigo)]),
      titulo && crearEl('h2', { class: 'pg-error__titulo' }, [titulo]),
      texto && crearEl('p', { class: 'pg-error__texto' }, [texto]),
      crearEl('a', {
        href: rutaInicio,
        class: 'pg-error__enlace',
        onClick: (e) => { e.preventDefault(); navegarA(rutaInicio); },
      }, [enlaceTexto]),
    ]),
  ]);
};
