/**
 * Adaptador para SortableJS — drag and drop entre listas.
 *  https://sortablejs.github.io/Sortable/
 *
 *   const limpiar = await DragDrop({
 *     contenedor: divKanbanColumna,
 *     grupo: 'tareas',
 *     alMover: ({ desde, hasta, idArrastrado, indice }) => { ... },
 *   });
 *   // ... después limpiar() para destruir.
 */
import { cargarLib } from '../_loader.js';

const VERSION = '1.15.2';
const URL_JS = `https://cdn.jsdelivr.net/npm/sortablejs@${VERSION}/Sortable.min.js`;

export const cargarSortable = () => cargarLib({
  scripts: URL_JS,
  global: 'Sortable',
});

/**
 * Habilita drag & drop en `contenedor`. Sus hijos directos serán arrastrables.
 * @param {object} opts
 * @param {HTMLElement} opts.contenedor
 * @param {string}      [opts.grupo]       — para arrastrar entre contenedores con mismo grupo.
 * @param {string}      [opts.handle]      — selector CSS del "pomo" de arrastre.
 * @param {boolean}     [opts.animacion=true]
 * @param {Function}    [opts.alMover]     — ({desde, hasta, idArrastrado, indice}).
 * @returns {Function}  función para destruir la instancia.
 */
export const DragDrop = async ({
  contenedor,
  grupo,
  handle,
  animacion = true,
  alMover,
  ...resto
} = {}) => {
  const Sortable = await cargarSortable();

  const instancia = Sortable.create(contenedor, {
    group: grupo,
    handle: handle,
    animation: animacion ? 200 : 0,
    ghostClass: 'is-arrastrando',
    chosenClass: 'is-elegido',
    dragClass: 'is-arrastrado',
    onEnd: (evento) => {
      alMover?.({
        desde: evento.from,
        hasta: evento.to,
        idArrastrado: evento.item.dataset.id || evento.oldIndex,
        indice: evento.newIndex,
        indiceAnterior: evento.oldIndex,
      });
    },
    ...resto,
  });

  return () => instancia.destroy();
};
