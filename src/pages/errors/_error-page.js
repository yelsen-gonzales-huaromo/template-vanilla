/**
 * PaginaError — plantilla profesional para páginas 4xx/5xx.
 *
 * Layout: animación Lottie grande arriba, código de error en gradient text,
 * título + descripción, acciones (volver, reportar, reintentar). Background
 * con gradiente sutil + grid pattern. Diseño full-viewport.
 *
 * Uso:
 *    PaginaError({
 *      codigo: 404,
 *      titulo: '...',
 *      texto: '...',
 *      animacion: '/public/lottie/Error 404.json',  // opcional
 *      acciones: [                                   // override si quieres
 *        { texto: 'Volver al inicio', onClick: ..., variante: 'primary' },
 *      ],
 *    });
 */
import { crearEl } from '../../utils/helpers/dom.js';
import { navegarA } from '../../router/index.js';
import { RUTAS, NOMBRES_RUTAS } from '../../config/routes.config.js';
import { Animacion } from '../../integrations/lottie/index.js';

const Btn = (texto, variante = 'primary', extra = {}) => crearEl('button', {
  type: extra.type || 'button',
  class: ['btn', variante !== 'primary' && `btn--${variante}`],
  ...extra,
}, [texto]);

export const PaginaError = ({
  codigo,
  titulo,
  texto,
  animacion,                    // URL al Lottie .json (relativa a la app)
  acciones,                     // [{ texto, onClick, variante? }] — opcional
  pista,                        // texto pequeño extra debajo (ej: "Error ID: 7f2a")
} = {}) => {
  // Acciones por defecto: Volver al inicio + Recargar
  const accionesFinal = acciones || [
    {
      texto: '← Volver al inicio',
      variante: 'primary',
      onClick: () => navegarA(RUTAS[NOMBRES_RUTAS.PANEL]),
    },
    {
      texto: 'Recargar',
      variante: 'outline',
      onClick: () => location.reload(),
    },
  ];

  // Contenedor para el Lottie (se carga async)
  const contenedorAnim = crearEl('div', { class: 'pg-error__anim' });
  if (animacion) {
    Animacion({ url: animacion, alto: '100%', ancho: '100%' })
      .then(({ contenedor }) => {
        contenedor.style.width = '100%';
        contenedor.style.height = '100%';
        contenedorAnim.appendChild(contenedor);
      })
      .catch(() => {
        // Fallback: muestra el código grande si el Lottie no carga
        contenedorAnim.appendChild(crearEl('div', { class: 'pg-error__codigo-fallback' }, [String(codigo)]));
      });
  } else {
    contenedorAnim.appendChild(crearEl('div', { class: 'pg-error__codigo-fallback' }, [String(codigo)]));
  }

  return crearEl('div', { class: 'pg-error' }, [
    crearEl('div', { class: 'pg-error__bg' }),
    crearEl('div', { class: 'pg-error__contenido' }, [
      contenedorAnim,
      crearEl('div', { class: 'pg-error__codigo' }, [String(codigo)]),
      crearEl('h1', { class: 'pg-error__titulo' }, [titulo]),
      crearEl('p', { class: 'pg-error__texto' }, [texto]),
      crearEl('div', { class: 'pg-error__acciones' },
        accionesFinal.map((a) => Btn(a.texto, a.variante || 'primary', { onClick: a.onClick })),
      ),
      pista && crearEl('div', { class: 'pg-error__pista' }, [pista]),
    ]),
  ]);
};
