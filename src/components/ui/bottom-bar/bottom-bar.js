/**
 * BarraInferior — navegación inferior estilo móvil (iOS/Android).
 *
 *   BarraInferior({
 *     items: [
 *       { icono: Icono('panel'), etiqueta: 'Inicio', activo: true },
 *       { icono: Icono('correo'), etiqueta: 'Email', badge: 4 },
 *       { icono: Icono('chat'),   etiqueta: 'Chat',  punto: true },
 *       { destacado: true, icono: Icono('mas') },         // FAB central
 *     ],
 *     variante: 'estandar' | 'compacta' | 'minimal' | 'cristal',
 *     flotante: true,             // sombra + sin borde
 *     indicador: 'fondo'|'linea'|'punto'|'ninguno',  // marcador de activo
 *     posicion:  'inline' | 'fija',                  // fija = position: fixed
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const BarraInferior = ({
  items = [],
  variante = 'estandar',
  flotante = false,
  indicador = 'fondo',
  posicion = 'inline',
} = {}) =>
  crearEl('nav', {
    class: [
      'barra-inf',
      `barra-inf--${variante}`,
      flotante && 'barra-inf--flotante',
      `barra-inf--ind-${indicador}`,
      posicion === 'fija' && 'barra-inf--fija',
    ],
    'aria-label': 'Navegación inferior',
  },
    items.map((it) => {
      // FAB central (botón destacado en el medio)
      if (it.destacado) {
        return crearEl('button', {
          type: 'button',
          class: ['barra-inf__fab'],
          'aria-label': it.etiqueta || 'Acción',
          disabled: it.deshabilitado || null,
          onClick: it.alClick,
        }, [
          crearEl('span', { class: 'barra-inf__fab-icono', 'aria-hidden': 'true' }, [it.icono]),
        ]);
      }

      // Item regular
      return crearEl('button', {
        type: 'button',
        class: [
          'barra-inf__item',
          it.activo && 'barra-inf__item--activo',
          it.deshabilitado && 'barra-inf__item--deshabilitado',
        ],
        disabled: it.deshabilitado || null,
        onClick: it.alClick,
      }, [
        crearEl('span', { class: 'barra-inf__icon-wrap' }, [
          crearEl('span', { class: 'barra-inf__icon', 'aria-hidden': 'true' }, [it.icono]),
          // Badge numérico
          it.badge != null && crearEl('span', { class: 'barra-inf__badge' }, [String(it.badge)]),
          // Punto de notificación (sin número)
          it.punto && crearEl('span', { class: 'barra-inf__punto', 'aria-hidden': 'true' }),
        ]),
        it.etiqueta && variante !== 'minimal' && variante !== 'compacta' &&
          crearEl('span', { class: 'barra-inf__lbl' }, [it.etiqueta]),
      ]);
    }),
  );
