/**
 * Lista de items con divisores y hover.
 *
 *   ListaGrupo({
 *     variante: 'default' | 'flush' | 'cards',
 *     tamano:   'sm' | 'md' | 'lg',
 *     items: [
 *       { contenido: nodo|string, alClick?, activo?, peligro? },
 *       { header: 'TÍTULO DE SECCIÓN' },          // separador con label
 *     ],
 *   })
 */
import { crearEl } from '../../../utils/helpers/dom.js';

export const ListaGrupo = ({ items = [], variante = 'default', tamano = 'md' } = {}) =>
  crearEl('ul', {
    class: ['lista-grupo', `lista-grupo--${variante}`, tamano !== 'md' && `lista-grupo--${tamano}`],
  },
    items.map((it) => {
      if (it.header) {
        return crearEl('li', { class: 'lista-grupo__header', role: 'presentation' }, [it.header]);
      }
      return crearEl('li', {
        class: [
          'lista-grupo__item',
          it.activo && 'lista-grupo__item--activo',
          it.alClick && 'lista-grupo__item--clickeable',
          it.peligro && 'lista-grupo__item--peligro',
        ],
        onClick: it.alClick,
      }, [it.contenido]);
    }),
  );
