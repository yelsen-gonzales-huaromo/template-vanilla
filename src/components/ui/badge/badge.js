/**
 * Insignia — etiqueta semántica con muchas variantes.
 *
 *   Insignia({
 *     texto: 'En vivo',
 *     variante: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'muted',
 *     estilo:   'soft' | 'solido' | 'outline',  // visual
 *     tamano:   'xs' | 'sm' | 'md',
 *     forma:    'pill' | 'cuadrada',
 *     icono,                                    // nodo a la izquierda
 *     punto: false,                             // bullet de estado
 *     pulsante: false,                          // animación pulse (live)
 *     descartable: false,                       // botón ✕
 *     alDescartar: () => {},
 *     contador: false,                          // estilo numérico circular
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const Insignia = ({
  texto,
  variante = 'default',
  estilo = 'soft',
  tamano = 'sm',
  forma = 'pill',
  icono,
  punto = false,
  pulsante = false,
  descartable = false,
  alDescartar,
  contador = false,
  ...resto
} = {}) => {
  const clases = [
    'badge',
    variante !== 'default' && `badge--${variante}`,
    estilo   !== 'soft'    && `badge--${estilo}`,
    tamano   !== 'sm'      && `badge--${tamano}`,
    forma    !== 'pill'    && `badge--${forma}`,
    punto && 'badge--dot',
    pulsante && 'badge--pulsante',
    contador && 'badge--contador',
  ];

  const hijos = [];
  if (punto) hijos.push(crearEl('span', { class: 'badge__punto', 'aria-hidden': 'true' }));
  if (icono) hijos.push(crearEl('span', { class: 'badge__icon', 'aria-hidden': 'true' }, [icono]));
  if (texto != null) hijos.push(crearEl('span', { class: 'badge__texto' }, [String(texto)]));
  if (descartable) {
    hijos.push(crearEl('button', {
      type: 'button', class: 'badge__cerrar', 'aria-label': 'Quitar',
      onClick: (e) => {
        e.stopPropagation();
        const host = e.currentTarget.closest('.badge');
        host?.classList.add('badge--saliendo');
        setTimeout(() => { host?.remove(); alDescartar?.(); }, 160);
      },
    }, ['×']));
  }

  return crearEl('span', { class: clases, ...resto }, hijos);
};
